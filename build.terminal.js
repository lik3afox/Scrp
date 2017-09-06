var labs = require('build.labs');
//var terminal_target;// = 'E29S79';//'E35S73';
//var Target;
var report = false;
let basic = [
    RESOURCE_POWER,
    'H', 'O', 'L', 'U', 'Z', 'K', 'X',
    'ZK', 'UL', 'OH',
    'G', 'GH', 'GH2O', 'XGH2O',
    'GO', 'GHO2', 'XGHO2',
    'LH', 'LH2O', 'XLH2O',
    'LO', 'LHO2', 'XLHO2',
    'UH', 'UH2O', 'XUH2O',
    'UO', 'UHO2', 'XUHO2',
    'ZH', 'ZH2O', 'XZH2O',
    'ZO', 'ZHO2', 'XZHO2',
    'KH', 'KH2O', 'XKH2O',
    'KO', 'KHO2', 'XKHO2',
];
var labRooms = ['E18S36', 'E17S34', 'E23S38', 'E18S32', 'E17S45', 'E28S37', 'E25S37', 'E13S34', 'E14S37',
    'E27S34','E14S43','E23S42','E28S42','E24S33','E25S43','E14S47'
];

// If you need to focus all minerals somewhere change it here.
var focusID; // = '591365a95128141e7200c235';
var focusMin; // = 'XGH2O'

// Every terminal needs this amount or else...
var required = [{ resource: RESOURCE_POWER, amount: 100 }, { resource: 'G', amount: 500 }];

// This is when you cannot change.
var prohibited = ['KO', 'GH', 'LO', 'UO', 'LH', 'G', 'OH', 'GO', 'GH2O', 'GHO2', 'XLH2O', 'XUH2O', 'XUHO2', 'XGH2O', 'XGHO2', 'XZH2O', 'XLHO2', 'XKHO2', 'XKH2O', 'XZHO2'];

var maxEnergyTrans = 5000;

function setTrap() {
    // This is to create deals that 
}

function focusMinerals(targetID, mineral) {
    if (targetID === undefined) return;
    if (mineral === undefined) return;
    let target = Game.getObjectById(targetID);
    if (target === null) return;
    for (var e in labRooms) {
        let term = Game.getObjectById(labRooms[e]);
        if (term !== null && term.store[mineral] > 1) {
            term.send(mineral, term.store[mineral] - 1, target.room.name, 'focus Trade');
        }
    }
}
/*
function focusEnergy(terminal) {
    // This terminal will request energy from others. 
    if (terminal.room.controller.level === 8 || terminal.room.name == 'E27S75') return false;
    if (terminal.store[RESOURCE_ENERGY] > 10000) return false;

    var highestEnergy;
    var currentHigh = 0;
    for (var e in labRooms) {
        let storage = Game.getObjectById(labRooms[e]);
        if (storage.store[RESOURCE_ENERGY] > currentHigh && terminal.room.name != storage.room.name) {
            highestEnergy = Game.getObjectById(labRooms[e]);
            currentHigh = storage.store[RESOURCE_ENERGY];
        }
    }
    let amount = currentHigh * 0.25;
    console.log(highestEnergy, currentHigh, RESOURCE_ENERGY, amount, terminal.room.name);
    let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
    console.log('FOCUS terminal', terminal.room, 'gets' + amount + ' energy', highestEnergy.room, 'result:', zz);

} */

function shareEnergy(terminal) {

    // When full, From this terminal, we will send energy to another.
    // Lets check here in all the storages to see if that room's storage level is at.
    if (terminal.store[RESOURCE_ENERGY] < 21000) return false;
    var lowestStore;
    var currentLow = 1000000;
    for (var e in labRooms) {
        let storage = Game.rooms[labRooms[e]].storage;
        if (storage !== null && labRooms[e] !== terminal.room.name ) {
//        	console.log(labRooms[e],storage.store[RESOURCE_ENERGY] , currentLow, terminal.total);
            if (storage.store[RESOURCE_ENERGY] < currentLow && storage.room.terminal.total !== 300000) {
                lowestStore = storage;
                currentLow = storage.store[RESOURCE_ENERGY];
            }
        }
    }
    console.log(terminal.room.name,'needs found lowest',lowestStore);
    if (lowestStore === undefined) return false;


    let amount = terminal.store[RESOURCE_ENERGY] * 0.1;
    let zz = terminal.send(RESOURCE_ENERGY, amount, lowestStore.room.name, 'Sharing Energy');
    console.log(terminal.pos, "sHaring energy to", lowestStore.room.name, ":", amount, zz);
    return true;
}

function adjustOldPrices() {

    var order = _.filter(Game.market.orders, function(o) {
        return Game.time - o.created > 30000;
    });
    if (order.length > 0) {
        for (var e in order) {
            if (order[e].resourceType !== RESOURCE_ENERGY) {
                let amount = getAverageMineralPrice(order[e].resourceType, false);
                if (amount !== undefined && amount < order[e].price) {
                    console.log('switching average of order', order[e].id, 'too', amount);
                    Game.market.changeOrderPrice(order[e].id, amount);
                }
            }
        }
    }
}

function needEnergy(terminal) {

    /*    var always = ['E28S71', 'E38S72', 'W4S93'];
        if (Game.market.credits > 15000000) { // Disabled currently
            if (_.contains(always, terminal.room.name)) {
                if (!anyLikeOrder(RESOURCE_ENERGY, terminal.room.name)) {
                    //       let qq = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 1000000, terminal.room.name);
                    //     console.log(ORDER_BUY, RESOURCE_ENERGY, 1000000, 0.01, terminal.room.name, 'ALWAYS ORDER NEEDS TO BE ALWYS');
                }
            }
        }
    */

    if (terminal.store[RESOURCE_ENERGY] < 1000 || terminal.room.storage.store[RESOURCE_ENERGY] < 1000) {
        var highestEnergy;
        var currentHigh = 0;
        for (var e in labRooms) {
            let storage = Game.getObjectById(labRooms[e]);
            if (storage !== null && storage.store[RESOURCE_ENERGY] > currentHigh &&
                terminal.room.name != storage.room.name &&
                (storage.room.controller.level === 8 || storage.room.name == 'E27S75')) {
                highestEnergy = Game.getObjectById(labRooms[e]);
                currentHigh = storage.store[RESOURCE_ENERGY];
            }
        }
        let amount = currentHigh * 0.25;
        let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
        console.log('This terminal:', terminal.room, 'gets' + amount + ' energy:', highestEnergy.room, 'result:', zz);
        //    console.log('this room has Order for it');
    }
    //   console(terminal.room.storage.store[RESOURCE_ENERGY]);
    // This terminal if below 100k will make a order if none exist.
    // Find the highest terminal that's level 8 and get energy from it.
    /*
        if (terminal.room.storage.store[RESOURCE_ENERGY] < 100000) {
            if (!anyLikeOrder(RESOURCE_ENERGY, terminal.room.name)) {
                //          let qq = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 1000000, terminal.room.name);
                //            console.log(ORDER_BUY, RESOURCE_ENERGY, 1000000, 0.01, terminal.room.name, '');
            }
        }

        if (terminal.room.terminal.store[RESOURCE_POWER] > 45000) {
            if (!anyLikeOrder(RESOURCE_POWER, terminal.room.name)) {
                let amount = getAverageMineralPrice(RESOURCE_POWER, false);
                if (amount !== undefined) {
                    let qq = Game.market.createOrder(ORDER_SELL, RESOURCE_POWER, amount, 40000, terminal.room.name);
                    console.log(ORDER_SELL, RESOURCE_POWER, amount, 45000, terminal.room.name, 'current average price for power', qq);
                }
            } else if (terminal.room.terminal.store[RESOURCE_POWER] > 75000) {
                
                            var order = _.filter(Game.market.orders, function(o) {
                                return o.resourceType == RESOURCE_POWER && o.roomName == terminal.room.name && Game.time - o.created > 30000;
                            });
                            if (order.length > 0) {
                                console.log('switching average of order');
                                let amount = getAverageMineralPrice(RESOURCE_POWER, false);
                                if (amount !== undefined) {

                                    Game.market.changeOrderPrice(order[0].id, amount);
                                }
                            }
                            
            }
        } */


}

function countTerminals() {
    let data = {};
    for (var b in basic) {
        let info = { type: basic[b], amount: 0 };
        for (var e in labRooms) {
            let target = Game.rooms[labRooms[e]].terminal;
            if (target !== null && target.store[basic[b]] > 0) {
                info.amount += target.store[basic[b]];
            }
        }
        data[basic[b]] = info.amount;
    }
    return data;
}

function buyGH2O() {
    if (Game.market.credits < 200000) return false;
    let Orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: 'XGH2O' });
    let minim = 1.51;

    for (var e in Orders) {
        if (Orders[e].price <= minim) {
            let target = Orders[e].id;
            let trans = Orders[e].amount;
            let zz;
            zz = Game.market.deal(target, trans, 'E28S71');
            break;
        }
    }
}

function newTradeEnergy(terminal) {

    // Below here we're selling energy.

    let eTotal = terminal.store[RESOURCE_ENERGY];
    if (eTotal < 25000) return false;
    let targetRoom = terminal.pos.roomName;
    //    if (Memory.termReport) console.log(terminal, 'has ', eTotal, targetRoom);
    let Orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
    Orders = _.filter(Orders, function(order) {
        return (order.price > 0.01);
    });

    if (Orders.length === 0) {
        console.log('ALERT - .01 energy low');
        return false;
    } else {

    }
    let target = { price: 0.0001, id: undefined, cost: 1000, amount: 1, room: undefined, trans: 1 };


    let EnergyNum = terminal.store[RESOURCE_ENERGY] * 0.1;


    for (var e in Orders) {
        let temp = (Game.market.calcTransactionCost(EnergyNum, targetRoom, Orders[e].roomName) / EnergyNum);
        let profit = Orders[e].price;
        // so far this only calcuates the distance - and the closest is best so far. 
        // What htis logic below is
        // profit / 1 energy + cost    

        //console.log( profit/(1+temp), target.price/(1+target.cost),target.price,temp );
        if (Game.rooms[Orders[e].roomName] !== undefined) {
            console.log('trying to buy own energy');
        } else {
            if (profit / (1 + temp) > target.price / (1 + target.cost) && Orders[e].roomName != 'E24S72' && Orders[e].roomName != 'E22S77') {
                target.id = Orders[e].id;
                target.cost = temp;
                target.amount = Orders[e].amount;
                target.price = Orders[e].price;
                target.room = Orders[e].roomName;
            }
        }
    }
    let trans = EnergyNum; // (Math.floor(eTotal / (1 + target.cost)));
    if (trans > target.amount) trans = target.amount;
    if (trans > maxEnergyTrans) trans = maxEnergyTrans;
    let cost = Game.market.calcTransactionCost(trans, target.room, terminal.room.name);
    let perEnergy = cost / trans;
    var profitLine;
    /*
    1000,000 = 10,000 + credits charge for the order (price(.01)* amount(1000000)* 0.05);
    500 for the order.

    ( 1000000 - (10500 / energySell) )  / (10500 / energySell)
    */
    switch (target.price) {
        case 0.02:
            profitLine = 0.90;
            break;
        case 0.03:
            profitLine = 1.85;
            break;
        case 0.04:
            profitLine = 2.80;
            break;
        case 0.05:
            profitLine = 3.71;
            break;
        case 0.06:
            profitLine = 4.71;
            break;
        case 0.07:
            profitLine = 5.66;
            break;
        case 0.07:
            profitLine = 6.61;

            break;
        default:
            break;
    }
    //    console.log(profitLine, perEnergy);
    if (profitLine > perEnergy) {

        let BAD = profitLine; // Anything at the profit line.
        let GOOD = profitLine * 0.9; // .81
        let GREAT = profitLine * 0.7; // .63
        let AWESOME = profitLine * 0.5;
        var profit = target.price * trans;
        var energyUsed = cost + trans;
        var rawEnergyProfit = profit * 100; // Assuming you buy energy @ .01;
        var estOrderCost = 0.01 * 0.05 * (trans * 0.95);
        var realProfit = profit - estOrderCost;
        var energyGained = (realProfit * 100) - energyUsed;

        var termEnergy = terminal.store[RESOURCE_ENERGY];
        var storeEnergy = terminal.room.storage.store[RESOURCE_ENERGY];
        var maxLimit = 1000;

        if (storeEnergy > 890000) {
            maxLimit -= 250;
        } else if (storeEnergy < 100000) {
            maxLimit += 2000;
        } else if (storeEnergy < 300000) {
            maxLimit += 1200;
        } else if (storeEnergy < 500000) {
            maxLimit += 750;
        } else {
            //            maxLimit += 250;
        }

        if (termEnergy > 20000)
            maxLimit -= 250;
        if (termEnergy > 40000)
            maxLimit -= 250;
        if (termEnergy > 80000)
            maxLimit -= 350;

        if (maxLimit < 0) maxLimit = 1;

        if (Memory.stats.deals === undefined) {
            Memory.stats.deals = {
                AA: 0,
                A: 0,
                B: 0,
                C: 0,
                D: 0
            };
        }
        let grade;
        if (energyGained > maxLimit) {
            if (GOOD > perEnergy) {
                let whatHappened = Game.market.deal(target.id, trans, targetRoom);
                if (energyGained < 500) {
                    Memory.stats.deals.D++;
                    grade = 'D Grade Deal:';
                } else if (energyGained < 1000) {
                    Memory.stats.deals.C++;
                    grade = 'C Grade Deal:';
                } else if (energyGained < 2000) {
                    Memory.stats.deals.B++;
                    grade = 'B Grade Deal:';
                } else if (energyGained < 3900) {
                    Memory.stats.deals.A++;
                    grade = 'A Grade Deal:';
                } else if (energyGained >= 3900) {
                    Memory.stats.deals.AA++;
                    grade = 'A++ Grade Deal:';
                }

                console.log(maxLimit, grade, whatHappened, '*EstProfit:', (energyGained * 0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price,
                    'Gain:', profit.toFixed(2),
                    "total=", energyUsed.toFixed(2), "Amount", trans.toFixed(2), '+Transfer:', cost, '@perEnergy', perEnergy.toFixed(3));
                return true;
            }
        } else {
            if (energyGained < 500) {
                Memory.stats.deals.D++;
                //              grade = 'D Grade Deal:';
            } else if (energyGained < 1000) {
                Memory.stats.deals.C++;
                //                grade = 'C Grade Deal:';
            } else if (energyGained < 2000) {
                Memory.stats.deals.B++;
                grade = 'B Grade Deal:';
            } else if (energyGained < 3900) {
                Memory.stats.deals.A++;
                grade = 'A Grade Deal:';
            } else if (energyGained >= 3900) {
                Memory.stats.deals.AA++;
                grade = 'A++ Grade Deal:';
            }
            if (grade !== undefined)
                console.log(grade, 'Deal passed up', terminal.room, 'pro:', profit.toFixed(2), 'profi:', energyGained, 'Max:', maxLimit);
            //            console.log(maxLimit,, '*EstEnergyGained:', energyGained, 'From:', terminal.room, 'to', target.room, '@', target.price, 'profit', profit, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans, "total", energyUsed,'Term',termEnergy,'storage',storeEnergy);
            // console.log(maxLimit,'F Deal:', '*EstProfit:', (energyGained*0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price, 'profit', profit.toFixed(2), 'Transfer:', cost, 'perEnergy', perEnergy.toFixed(3), "Amount", trans.toFixed(2), "total", energyUsed.toFixed(2),GOOD);            return false;
        }

        /*        if (AWESOME > perEnergy) {
                    console.log('ESTEnergyGained:', energyGained, 'EnergyUsed', energyUsed, 'Credit Profit', profit);
                    console.log('A++Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                } else if (GREAT > perEnergy) {
                    console.log('ESTEnergyGained:', energyGained, 'EnergyUsed', energyUsed, 'Credit Profit', profit);
                    console.log('A Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                } else if (GOOD > perEnergy) {
                    console.log('ESTEnergyGained:', energyGained, 'EnergyUsed', energyUsed, 'Credit Profit', profit);
                    console.log('B Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                } else { //        if(GOOD > perEnergy ) {
                    console.log('C Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                }
        */

    }

}

function tradeEnergy(terminal) {

    // Below here we're selling energy.
    if (!Memory.war) {
        let eTotal = terminal.store[RESOURCE_ENERGY];
        let targetRoom = terminal.pos.roomName;
        //    if (Memory.termReport) console.log(terminal, 'has ', eTotal, targetRoom);
        let Orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
        let target = { price: 0.0001, id: undefined, cost: 1000, amount: 1, room: undefined, trans: 1 };
        let EnergyNum = 100;

        for (var e in Orders) {
            let temp = (Game.market.calcTransactionCost(EnergyNum, targetRoom, Orders[e].roomName) / EnergyNum);
            let profit = Orders[e].price;
            // so far this only calcuates the distance - and the closest is best so far. 
            // What htis logic below is
            // profit / 1 energy + cost    

            //console.log( profit/(1+temp), target.price/(1+target.cost),target.price,temp );
            if (Orders[e].amount !== 1)
                if (profit / (1 + temp) > target.price / (1 + target.cost) && Orders[e].roomName != 'E24S72' && Orders[e].roomName != 'E22S77') {
                    target.id = Orders[e].id;
                    target.cost = temp;
                    target.amount = Orders[e].amount;
                    target.price = Orders[e].price;
                    target.room = Orders[e].roomName;
                }
        }
        let trans = (Math.floor(eTotal / (1 + target.cost)));
        if (trans > target.amount) trans = target.amount;
        if (trans > maxEnergyTrans) trans = maxEnergyTrans;
        if (target.price == 0.01) {
            trans = trans * 0.5;
        }

        let whatHappened = Game.market.deal(target.id, trans, targetRoom);
        console.log("Max Energy Trade", whatHappened, 'profit:', target.price * trans, '#', trans, 'EnergyCost', (target.price + target.cost), (target.price + target.cost) * trans, 'Profit per Energy', target.price / (1 + target.cost));
    }

    //  var amountSending = terminal.store[RESOURCE_ENERGY] * 0.05;
    //   var rando = Math.floor(Math.random() * Memory.debts.length);
    //    var result = terminal.send(RESOURCE_ENERGY, amountSending, Memory.debts[rando].room, 'End');
    //    console.log('LUCKY ROOM', Memory.debts[rando].room, 'gets energy:', amountSending, 'from this room', terminal.room);

    /*    if (Memory.sellingHistory === undefined) { Memory.sellingHistory = []; }

        let orderInfo = {
            price: target.price,
            distance: Game.map.getRoomLinearDistance(target.room, targetRoom),
            energyCost: Game.market.calcTransactionCost(trans, target.room, targetRoom),
            amount: trans
        };
        Memory.sellingHistory.push(orderInfo);
    */
    //    console.log('besties',target.id,trans,targetRoom,target.price,target.room);
    //    eTotal/1+target.cost 
    // Game.market.calcTransactionCost(1, targetRoom, order.roomName)
}

// Energy seems to be at .01 to .05 credits.

var profitLine = 0.30;

function checkEnergyProfit(distance, credits, amount) {
    credits = credits * 100;
    let line = Math.ceil(amount * (Math.log((0.1 * distance) + 0.9) + 0.1));
    let total = (line / credits) / amount;
    //    console.log(line, 'per', amount, total, profitLine);
    if (total < profitLine) {
        return true;
    } else {
        return false;
    }
}

function orderExist(resource, room, sellingPoint) {
    for (var a in prohibited) {
        if (resource == prohibited[a]) {
            return true;
        }
    }

    for (var e in Game.market.orders) {
        let order = Game.market.orders[e];
        //        if (Memory.termReport) console.log(order.resourceType, resource, order.roomName, room, sellingPoint, order.price);
        if (room === undefined) {
            if (order.resourceType == resource) return true;
        } else {
            if (sellingPoint === undefined) {
                if (order.resourceType == resource && order.roomName == room) return true;
            } else {

                if (order.resourceType == resource && order.roomName == room && sellingPoint == order.price) return true;
            }
        }
    }
    return false;
}

function anyLikeOrder(resource, room) {
    for (var e in Game.market.orders) {
        let order = Game.market.orders[e];
        if (order.resourceType == resource && order.roomName == room) return true;
    }
    /*let zz = _.filter(Game.market.orders,function(order){return(order.resourceType == resource && order.roomName == room);});
    if(zz.length > 0) {
        return true;
    }*/
    return false;

}



function tradeMineral() {
    // First lets find what I have most of
    let target = { resource: undefined, amount: 0 };

    let total = 0;
    for (var e in Memory.stats.totalMinerals) {
        if (e == 'K' || e == 'U' || e == 'Z' || e == 'L') {
            if (Memory.stats.totalMinerals[e] > 200000) {

                //                let Orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: e });
                let sellingPoint = getAverageMineralPrice(e, false); //= 1000;
                /*                for (var vv in Orders) {
                                    if (Orders[vv].price < sellingPoint) {
                                        sellingPoint = Orders[vv].price;
                                    }
                                }*/

                var termin = getMostTerminal(e);
                var amount = termin.store[e] * 0.75;
                //                if (e == 'K') console.log('YEAAAH', sellingPoint, orderExist(e),);

                if (sellingPoint >= 0.01 && !orderExist(e)) {
                    let whatHappened = Game.market.createOrder(ORDER_SELL, e, sellingPoint, amount, termin.pos.roomName);
                    console.log(whatHappened, 'selling:', e, '@', sellingPoint, 'For:', amount, '@', termin.pos.roomName);
                    //                    console.log('Made order for minerals:', target.resource, target.amount, sellingPoint, whatHappened);
                    return true;
                }
            }
        }
    }
    //    Memory.stats.totalMinerals[];
    /*
        for (var e in terminal.store) {
            if (e != RESOURCE_ENERGY) {
                total += terminal.store[e];
                if (terminal.store[e] > target.amount && !anyLikeOrder(e, terminal.pos.roomName)) {
                    target.resource = e;
                    target.amount = terminal.store[e];
                }
            }
        }
        if (total < 150000) return; */
    /*
        let Orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: target.resource });
        let sellingPoint = 1000;
        for (var o in Orders) {
            if (Orders[o].price < sellingPoint) {
                sellingPoint = Orders[o].price;
            }
        }
        //    console.log(ORDER_SELL, target.resource, sellingPoint, Math.floor((target.amount * 0.1)), terminal.pos.roomName, orderExist(target.resource, terminal.pos.roomName, sellingPoint));

        if (sellingPoint <= 0.01) return;
        if (orderExist(target.resource, terminal.pos.roomName, sellingPoint)) return;
        let whatHappened = Game.market.createOrder(ORDER_SELL, target.resource, sellingPoint, Math.floor((target.amount * 0.05)), terminal.pos.roomName);
        //if(Memory.termReport )
        console.log('Made order for minerals:', target.resource, target.amount, sellingPoint, whatHappened);
        // then find what the lowest sell order is
        // Then set it to that price. 
        // */
}

function cleanUpOrders() {
    if (Game.market.orders.length === 0) return;
    for (var e in Game.market.orders) {
        let order = Game.market.orders[e];
        if (!order.active && Game.time - order.created > 2500 && order.remainingAmount <= 10) {
            Game.market.cancelOrder(order.id);
        }
    }
}


function sellMineral(terminal) {
    if (terminal.total < 299000) return false;


    let mostMineral;
    let most = 0;
    let mostAmount;
    let noSell = [''];
    for (var e in terminal.store) {
        //      if(_.contains(noSell,e)) {

        //        }
        if (terminal.store[e] > 1000 && terminal.store[e] > most && e !== RESOURCE_ENERGY) {
            mostMineral = e;
            most = terminal.store[e];
        }

    }

    let zz = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: mostMineral });
    zz.sort((a, b) => b.price - a.price);
    var sellAmount = 2000;
    var target;
    for (var zzz in zz) {
        if (zz[zzz].amount > 100) {
            target = zz[zzz];
            break;
        }
    }
    //        console.log(zz[0].amount , sellAmount);
    if (target !== undefined) {
        if (target.amount < sellAmount) {
            sellAmount = target.amount;
        }
        if (most < sellAmount) {
            sellAmount = most;
        }
        let cc = Game.market.deal(target.id, sellAmount, terminal.room.name);
        //        console.log(zz[0].id,zz[0].price , sellAmount, terminal.room.name,mostMineral);
        console.log('Sold', sellAmount, target.amount, 'mineral', mostMineral, target.price, terminal.room.name, cc);
        return true;
    }

    return false;
}

function energyCheck(terminal) {
    if (terminal.store[RESOURCE_ENERGY] > 20000) return false;
    if (terminal.total < 299000) return false;

    // First lets get the most mineral in this terminal.

    let mostMineral;
    let most = 0;
    for (var e in terminal.store) {
        if (terminal.store[e] > most) {
            mostMineral = e;
            most = terminal.store[e];
        }
    }

    // Then lets get the lowest terminal.
    var lowestStore;
    var currentLow = 1000000;
    for (var v in labRooms) {
        let storage = Game.getObjectById(labRooms[v]);
        if (storage !== null && storage.total < currentLow) {
            lowestStore = storage;
            currentLow = storage.total;
        }
    }
    if (lowestStore === undefined) return false;

    //    let bb = terminal.send(mostMineral, 3000, lowestStore.room.name, 'too much');
    //    console.log(terminal.room.name, 'this terminal is full with less than 20000 energy', mostMineral, lowestStore.room.name, 'result:', bb);

    //Game.rooms.E28S71.terminal.send('O', 15000, 'E5N7', 'trade');
    //  let zz = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: e });
    //    zz.sort((a, b) => a.price - b.price);

    //      let cc = Game.market.deal(zz[0].id, 2000, terminal.room.name);
    //        console.log('Sold 100 mineral', mostMineral, zz[0].price * 2000,cc);

    //Game.market.deal('57cd2b12cda69a004ae223a3', 1000, "W1N1");   

    //    }


    return false;
}

function getMostTerminal(mineralz, target) {
    let highest = 0;
    var bested;
    var e;
    var mineral = mineralz; // = mineralz.toLowerCase();
    if (target === undefined) {
        e = labRooms.length;
        while (e--) {
            let tmp = Game.getObjectById(labRooms[e]);
            if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest) {
                highest = tmp.store[mineral];
                bested = tmp;
            }
        }
        return bested;

    } else {
        for (e in labRooms) {
            if (target.id != labRooms[e]) {
                let tmp = Game.getObjectById(labRooms[e]);
                if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest) {
                    highest = tmp.store[mineral];
                    bested = tmp;
                }
            }
        }
        return bested;
    }

}
//UH, GO, LO, ZO
function giveInviso() {
    var mins = ['XGHO2', 'XUH2O', 'XLHO2', 'XZHO2', 'XZH2O', 'XKHO2'];
    var minAmount = 44999;
    if (Memory.stats.totalMinerals.X > 30000 && Memory.stats.totalMinerals.O > 30000 && Memory.stats.totalMinerals.H > 30000) {
        for (var e in mins) {
            if (Memory.stats.totalMinerals[mins[e]] > minAmount) {
                var sending = Memory.stats.totalMinerals[mins[e]] - minAmount < 100 ? 100 : Memory.stats.totalMinerals[mins[e]] - minAmount;
                var sender = getMostTerminal(mins[e]);
                var result = sender.send(mins[e], sending, 'E13S72', 'inviso');
                console.log(result, mins[e], sending, 'E13S72', 'Inviso', sender.pos.roomName, sender.store[mins[e]]);
            }
        }
    }
}

function doDebt() {

    if (Memory.debts === undefined) {
        Memory.debts = [];
    }
    if (Memory.debts.length === 0) {
        var debt = {
            room: 'test',
            type: 'E',
            amount: 0
        };
        Memory.debts.push(debt);
    }


    if (Memory.debts[0].room === 'test') return;

    var Debt = Memory.debts[0];

    if (Debt.amount === 0) {
        Memory.debts.unshift();
    }

    var mineral = Debt.type;
    var roomTarget = Debt.room;
    var debtAmount = Debt.amount;
    var giver = getMostTerminal(Debt.type);

    var transferAmount = Debt.increment;

    if (giver === undefined) {
        console.log('ERROR in DEBT', Debt.type, Debt.room, Debt.amount);

        Memory.debts.push(Memory.debts.shift());
        return false;
    }
    if (Debt.type !== RESOURCE_ENERGY) {

    } else {
        if (giver.store[Debt.type] < transferAmount * 10) {
            console.log('Error in Debt, not enough funds', giver.store[Debt.type], transferAmount * 10);
            Memory.debts.push(Memory.debts.shift());
            return false;
        }

    }

    var result = giver.send(Debt.type, transferAmount, Debt.room, 'Debt@' + Debt.amount);

    if (result == OK) {
        Debt.amount -= transferAmount;
    }
    if (Debt.amount <= 0) {
        console.log(result, 'Debt COMPLETED!!', Debt.room, Debt.type);
        if (Debt.repeat) {
            var zz = Memory.debts.shift();
            zz.amount = zz.maxAmount;
            Memory.debts.push(zz);
        } else {
            Memory.debts.shift();
        }
    } else {
        console.log(result, 'Debt Sending', Debt.room, 'sending:', Debt.type, 'From:', giver.room.name, 'Amount:', transferAmount, 'Debt@', Debt.amount);
    }
    return true;
}





function getAverageMineralPrice(resource, buy) {
    if (buy === undefined) buy = true;
    //    console.log((buy ? "buy" : "sell"), buy, (false ? "buy" : "sell"));
    /*    let zz = _.filter(Game.market.orders, function(o) {
            return o.type == (buy ? ORDER_BUY : ORDER_SELL) && o.resourceType == resource && o.active === true;
        }); */
    //    console.log(e,'less than 25000',Memory.stats.totalMinerals[e],zz.length);
    //    if (zz.length === 0) {
    var amount;
    let zz = Game.market.getAllOrders({ type: (buy ? ORDER_BUY : ORDER_SELL), resourceType: resource });
    zz.sort((a, b) => a.price - b.price);
    let bb = 0;
    if (buy) {
        if (zz[zz.length - 1].price !== 0.01)
            bb += zz[zz.length - 1].price;
        if (zz[zz.length - 2].price !== 0.01)
            bb += zz[zz.length - 2].price;
        if (zz[zz.length - 3].price !== 0.01)
            bb += zz[zz.length - 3].price;
        if (zz[zz.length - 4].price !== 0.01)
            bb += zz[zz.length - 4].price;
    } else {
        if (zz[1].price !== 0.01)
            bb += zz[1].price;
        if (zz[2].price !== 0.01)
            bb += zz[2].price;
        if (zz[3].price !== 0.01)
            bb += zz[3].price;
        if (zz[0].price !== 0.01)
            bb += zz[0].price;
    }

    amount = (bb / 4);
    return amount;
    //  }

}

function makeMineralOrder() {
    var minMinerals = {
        'U': 25000,
        'L': 25000,
        'Z': 25000,
        'K': 25000,
        'O': 25000,
        'H': 25000,
        'X': 25000
    };
    for (var e in minMinerals) {
        if (Memory.stats.totalMinerals[e] < 25000) {
            amount = getAverageMineralPrice(e, true);
            //            console.log(amount, anyLikeOrder(e, "E28S71"), e);
            if (amount !== undefined && !anyLikeOrder(e, "E28S71")) {
                //                let qq = Game.market.createOrder(ORDER_BUY, e, amount, 25000, "E28S71");
                //              console.log('Created Buy Order for ', e, 'amount:', amount, qq);
                console.log('wants mineral but forced failure');
            }
        }
    }

}

function forEveryTerminal(terminal) {
    for (var e in required) {
        //      console.log('Doing required',e,required[e].amount,required[e].resource)
        let needed = required[e];
        let reNeeded = needed.resource;
        let reAmount = needed.amount;
        let termAmount = terminal.store[reNeeded];
        if (termAmount === undefined) termAmount = 0;
        if (termAmount < reAmount && terminal.room.controller.level > 5) {
            // get difference
            // then make the request
            let needed = reAmount - terminal.store[reNeeded];
            let doit = true;
            //          terminal.room.memory.powerSpawn = undefined;
            if (terminal.room.memory.powerSpawnID === undefined && reNeeded == RESOURCE_POWER) {
                let zz = terminal.room.find(FIND_STRUCTURES);
                zz = _.filter(zz, function(o) {
                    return o.structureType == STRUCTURE_POWER_SPAWN;
                });
                if (zz.length === 0) {
                    doit = false;
                } else {
                    terminal.room.memory.powerSpawnID = zz.id;
                }
            }

            if (doit) {
                giveMinerals(terminal, reNeeded, reAmount);
            }
        }
    }
}

function giveMinerals(terminal, mineral, amount) {

    // First lets find the terminal with the highest of wanted minerals.
    let target;
    let highest = 0;
if(terminal.room.name == 'E18S36') {
//    console.log(terminal, mineral, amount);
}
    for (var e in labRooms) {
        if (terminal.room.name != labRooms[e]) {
            let tmp = Game.rooms[labRooms[e]].terminal; //Game.getObjectById(labRooms[e]);
  //          if(mineral =='GHO2')
//            	console.log('here?',tmp.store[mineral],mineral,tmp.room.name);
            if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest && tmp.room.controller.level > 5) {
                highest = tmp.store[mineral];
                target = tmp;
            }
        }
    }

    //              let sentResult = target.send(mineral, amount, targetRoom, '1zz');               
//     console.log('Sending Minerals:',target.pos.roomName,mineral,amount, 'azz');
//console.log('Target:',target,target !== undefined? target.pos.roomName :'none');
    if (target !== undefined) {
        let sender = target.pos.roomName;
        if (target.store[mineral] < 2100) return;
        if (amount === undefined) {
            amount = Math.floor(target.store[mineral] * 0.15);
        }
        //                  if(amount < 90) return;
        //              console.log(terminal,target.store[mineral],target.pos.roomName);
        if (amount < 100) return false;
        let targetRoom = terminal.pos.roomName;
        let sentResult = target.send(mineral, amount, targetRoom, 'tradezz');
        if (sentResult == OK) {
            terminal.room.memory.didOrder = true;
        }
                console.log('Sending Minerals:', sender, mineral, amount, targetRoom, sentResult);
        if (sentResult === 0) {
            terminal.room.visual.text('SENT', terminal.pos.x, terminal.pos.y, {
                color: '#97c39a ',
                stroke: '#000000 ',
                strokeWidth: 0.123,
                font: 0.5
            });
            /*                Game.rooms.targetRoom.visual.text('RECIEVED', terminal.pos.x,terminal.pos.y,{
                                color: '#97c39a ',
                                stroke: '#000000 ',
                                strokeWidth: 0.123,
                                font: 0.5
                            }); */

            return true;
        }
    }

    //          if(Memory.termReport )console.log(mineral,'no one has');
}


function getMinerals(terminal, needed) {
    //  console.log('getting');


    for (var e in needed) {
        //      console.log(terminal.store[needed[e]] ,needed[e]);
        //      if(terminal.room.name == 'E18S36'){
        //              console.log( terminal.store[needed[e]],needed[e]);
        //          }
        if ((needed[e] != 'none' && needed[e] != 'flex') && (terminal.store[needed[e]] === undefined || terminal.store[needed[e]] <= 1000)) {
            if (terminal.store[needed[e]] === 0 || terminal.store[needed[e]] === undefined) {
                giveMinerals(terminal, needed[e]);
            } else {
                giveMinerals(terminal, needed[e], 1000);
            }
        }
    }
}

function focusRoom(terminal) {
    var target = 'E28S42';
    if (terminal.room.name == target) return false;
 //   if (Game.rooms.E27S34.storage.store[RESOURCE_ENERGY] < 10000) target = 'E27S34';
    if (Game.rooms[target].terminal === undefined) return false;
    if (Game.rooms[target].terminal.total === 300000) return false;
    if (terminal.store[RESOURCE_ENERGY] < 10000) return false;

//    if (terminal.room.name == target && terminal.room.name == 'E17S34' && terminal.room.name == 'E27S34') return false;
    var amount = 3000; // terminal.store[RESOURCE_ENERGY] *0.25;
    var sender = terminal;
    //
    var result = terminal.send('energy', amount, target);
    console.log(terminal.room.name, result, amount, terminal, RESOURCE_ENERGY);
    if (result === OK) {
        terminal.room.visual.text('FOCUS', terminal.pos.x, terminal.pos.y, {
            color: '#97c39a ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });

        return true;
    }
}

class roleTerminal {

    /** @param {Creep} creep **/
    static run() {

        //console.log( checkEnergyProfit(10,.02,1000) );

        //        focusMinerals(focusID, focusMin);
        cleanUpOrders();
        //        adjustOldPrices();
        Memory.stats.totalMinerals = countTerminals();

        //            Memory.termRun = 10;
        var focus = false;
        for (var e in labRooms) {
            let terminal = Game.rooms[labRooms[e]].terminal;
            if (terminal !== undefined) {
                var energy = terminal.store[RESOURCE_ENERGY];
                var total= terminal.total;
                if(total > 295000){
                    console.log('bAD ROOM',labRooms[e]);
                    if(energy > 20000) {
                        if (!shareEnergy(terminal)) { // Moves energy around
                        }

                    } else if(energy > 10000){

                    } else {

                    }
                }
//                                if (!focus) focus = focusRoom(terminal);

                let needed = labs.neededMinerals(terminal.pos.roomName);
                getMinerals(terminal, needed);

if (terminal.room.memory.boost !== undefined) {
//    console.log(terminal.store[terminal.room.memory.boost.mineralType],'zvv');
    if(terminal.store[terminal.room.memory.boost.mineralType] === undefined || terminal.store[terminal.room.memory.boost.mineralType] < terminal.room.memory.boost.mineralAmount) {
        giveMinerals(terminal,terminal.room.memory.boost.mineralType);
    }
}
                //   break; // Ends looking for stuff.
                //                if (!Memory.war || terminal.store[RESOURCE_ENERGY] > 100000)
                //                    newTradeEnergy(terminal);
                //          focusEnergy(terminal); Removed
                //                forEveryTerminal(terminal);
                //        terminal.room.memory.didOrder = false;


                /*            if (terminal.room.memory.powerSpawnID === undefined) {
                                let zz = terminal.room.find(FIND_STRUCTURES);
                                zz = _.filter(zz, function(o) {
                                    return o.structureType == STRUCTURE_POWER_SPAWN;
                                });
                                if (zz.length === 0) {
                                    //      doit = false;
                                } else {
                                    terminal.room.memory.powerSpawnID = zz[0].id;
                                }
                            }*/


                              let zz = terminal.total;
                //                needEnergy(terminal);
                //    if (!newTradeEnergy(terminal)) {

                if (zz > 299000) {
                        //                if (!sellMineral(terminal)) {
                        //                   tradeEnergy(terminal);
                    
                    //           } else {
                    //     tradeEnergy(terminal);
                }
                //       }
                //    }
            }
            //          energyCheck(terminal);
        }

        //   doDebt(); // Send energy to a target
        //        giveInviso();
        //     tradeMineral();
        //    makeMineralOrder();

    }


}
module.exports = roleTerminal;