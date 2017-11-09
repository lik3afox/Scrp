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
var s1LabRooms = ['E28S37', 'E18S36', 'E17S34', 'E23S38', 'E18S32', 'E17S45', 'E25S37', 'E13S34', 'E14S37',
    'E27S34', 'E14S43', 'E23S42', 'E28S42', 'E24S33', 'E25S43', 'E14S47', 'E25S47', 'E14S38', 'E25S27', 'E27S45', 'E29S48'
];
var s0LabRooms = ['E38S81', 'E38S72'];

// If you need to focus all minerals somewhere change it here.
var focusID;
var focusMin;

// Every terminal needs this amount or else...
var required = [{ resource: RESOURCE_POWER, amount: 100 }, { resource: 'G', amount: 500 }];

var xStorage = {
    XGHO2: {
        amount: 15000
    },
    XUH2O: {
        amount: 6000
    },
    XZH2O: {
        amount: 3000
    },
    XKHO2: {
        amount: 12000
    },
    XZHO2: {
        amount: 5000
    },
    XLHO2: {
        amount: 4000
    },
    //    XLH2O : {        amount:1000    },
};
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
    for (var e in s1LabRooms) {
        let term = Game.rooms[s1LabRooms[e]].terminal;
        if (term !== null && term.store[mineral] > 1) {
            term.send(mineral, term.store[mineral] - 1, target.room.name, 'focus Trade');
        }
    }
}

function shareEnergy(terminal) {
    if (terminal.room.name == 'E14S38') return false;

    // When full, From this terminal, we will send energy to another.
    // Lets check here in all the storages to see if that room's storage level is at.
    if (terminal.store[RESOURCE_ENERGY] < 21000) return false;
    var lowestStore;
    var currentLow = 1000000;
    for (var e in s1LabRooms) {
        let storage = Game.rooms[s1LabRooms[e]].storage;
        if (storage !== null && s1LabRooms[e] !== terminal.room.name) {
            //          console.log(s1LabRooms[e],storage.store[RESOURCE_ENERGY] , currentLow, terminal.total);
            if (s1LabRooms[e] !== 'E14S38' && storage.store[RESOURCE_ENERGY] < currentLow && storage.room.terminal.total !== 300000 && Game.rooms[s1LabRooms[e]].controller.level > 5) {
                lowestStore = storage;
                currentLow = storage.store[RESOURCE_ENERGY];
            }
        }
    }
    //    console.log(terminal.room.name, 'needs found lowest', lowestStore);
    if (lowestStore === undefined) return false;
    if (currentLow > 899000) return false;


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
    let zz = 1000;
    var highestEnergy;
    var currentHigh = 0;
    var e;
    if (terminal.room.name == 'E14S38') {
        if (terminal.room.storage.store[RESOURCE_ENERGY] < 10000) {
            currentHigh = 0;
            for (e in s1LabRooms) {
                let storage = Game.rooms[s1LabRooms[e]].terminal;
                if (storage !== null && storage.store[RESOURCE_ENERGY] > currentHigh &&
                    terminal.room.name != storage.room.name) {
                    highestEnergy = Game.rooms[s1LabRooms[e]].terminal;
                    currentHigh = storage.store[RESOURCE_ENERGY];
                }
            }
            let amount = currentHigh * 0.25;
            let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
            console.log('This terminal:', terminal.room, 'gets' + amount + ' energy:', highestEnergy.room, 'result:', zz);
            //    console.log('this room has Order for it');
        }
    } else {
        if (terminal.store[RESOURCE_ENERGY] < 10000 || terminal.room.storage.store[RESOURCE_ENERGY] < 10000) {

            currentHigh = 0;

            for (e in s1LabRooms) {
                let storage = Game.rooms[s1LabRooms[e]].terminal;

                if (storage !== null && storage.store[RESOURCE_ENERGY] > currentHigh && terminal.room.name != storage.room.name && terminal.room.name !== 'E14S38') {
                    highestEnergy = Game.rooms[s1LabRooms[e]].terminal;
                    currentHigh = storage.store[RESOURCE_ENERGY];
                }
            }
            let amount = currentHigh * 0.25;
            let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
            console.log('This terminal:', terminal.room, 'gets' + amount + ' energy:', highestEnergy.room, 'result:', zz);
            //    console.log('this room has Order for it');
        }
    }
    //   console(terminal.room.storage.store[RESOURCE_ENERGY]);
    // This terminal if below 100k will make a order if none exist.
    // Find the highest terminal that's level 8 and get energy from it.
    /*

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
        for (var e in s1LabRooms) {
            if (Game.rooms[s1LabRooms[e]] !== undefined) {
                let target = Game.rooms[s1LabRooms[e]].terminal;
                if (target !== null && target.store !== undefined && target.store[basic[b]] > 0) {
                    info.amount += target.store[basic[b]];
                }
                target = Game.rooms[s1LabRooms[e]].storage;
                if (target !== null && target.store !== undefined && target.store[basic[b]] > 0) {
                    info.amount += target.store[basic[b]];
                }
            }
        }
        data[basic[b]] = info.amount;
    }
    return data;
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
            if (profit / (1 + temp) > target.price / (1 + target.cost)) {
                target.id = Orders[e].id;
                target.cost = temp;
                target.amount = Orders[e].amount;
                target.price = Orders[e].price;
                target.room = Orders[e].roomName;
            }
        }
    }
    console.log('in newtrade', target.room, target.price);

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
    if (target.price < 0.03) {
        profitLine = 0.90;
    } else if (target.price < 0.04) {
        profitLine = 1.85;
    } else if (target.price < 0.05) {
        profitLine = 2.80;
    } else if (target.price < 0.06) {
        profitLine = 3.71;
    } else if (target.price < 0.07) {
        profitLine = 4.71;
    } else if (target.price < 0.08) {
        profitLine = 5.66;
    } else {
        profitLine = 6.61;
    }
    /*
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
            case 0.08:
                profitLine = 6.61;
                break;
            default:
                break;
        }
        if(target.price > 0.07) {
            profitLine = 7;
        } */
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
                if (whatHappened === OK) {
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
                    } else {
                        grade = 'A+++++ Grade Deal:';

                    }
                    console.log(maxLimit, grade, whatHappened, '*EstProfit:', (energyGained * 0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price,
                        'Gain:', profit.toFixed(2),
                        "total=", energyUsed.toFixed(2), "Amount", trans.toFixed(2), '+Transfer:', cost, '@perEnergy', perEnergy.toFixed(3));
                    return true;
                } else {
                    console.log(maxLimit, grade, whatHappened, '*EstProfit:', (energyGained * 0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price,
                        'Gain:', profit.toFixed(2),
                        "total=", energyUsed.toFixed(2), "Amount", trans.toFixed(2), '+Transfer:', cost, '@perEnergy', perEnergy.toFixed(3));
                    return false;
                }

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
        console.log("Max Energy Trade", whatHappened, 'profit:', target.price * trans, '#', trans, 'EnergyCost', (target.price + target.cost), (target.price + target.cost) * trans, 'Profit per Energy', target.price / (1 + target.cost), roomLink(terminal.room.name));
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



function sellMineralOrder() {
    // First lets find what I have most of
    let target = { resource: undefined, amount: 0 };

    let total = 0;
    for (var e in Memory.stats.totalMinerals) {
        if (e == 'K' || e == 'U' || e == 'Z' || e == 'X' || e == 'L' || e == 'O') {
            if (Memory.stats.totalMinerals[e] > 150000) {

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
    for (var v in s1LabRooms) {
        let storage = Game.getObjectById(s1LabRooms[v]);
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
        e = s1LabRooms.length;
        while (e--) {
            let tmp = Game.rooms[s1LabRooms[e]].terminal;
            if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest) {
                highest = tmp.store[mineral];
                bested = tmp;
            }
        }
        return bested;

    } else {
        for (e in s1LabRooms) {
            if (target.id != s1LabRooms[e]) {
                let tmp = Game.rooms[s1LabRooms[e]].terminal;
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
        if (zz[1] !== undefined && zz[1].price !== 0.01)
            bb += zz[1].price;
        if (zz[2] !== undefined && zz[2].price !== 0.01)
            bb += zz[2].price;
        if (zz[3] !== undefined && zz[3].price !== 0.01)
            bb += zz[3].price;
        if (zz[0].price !== 0.01)
            bb += zz[0].price;
    }

    amount = (bb / 4);
    if (amount > 1.10) return 1.10;
    return amount;
    //  }

}

function buyMineralOrder() {
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
            if (amount !== undefined && !anyLikeOrder(e, "E13S34")) {
                let qq = Game.market.createOrder(ORDER_BUY, e, amount, 25000, "E13S34");
                console.log('Created Buy Order for ', e, 'amount:', amount, qq);
                //  console.log('wants mineral but forced failure');
            }
        }
    }

}


function forEveryStorage(terminal) {
    //console.log(xStorage.XUH2O.amount,'forEveryStorage');
    if (terminal.room.name === 'E14S38') return;
    if (terminal.room.controller.level !== 8) return;
    var storage = terminal.room.storage;
    for (var e in xStorage) {
        if (storage.store[e] === undefined ||
            (storage.store[e] !== undefined && storage.store[e] < xStorage[e].amount && (terminal.store[e] === undefined || terminal.store[e] < 1000))) {
            console.log(e, 'needed @', terminal.room.name, 'amount:', xStorage[e].amount, storage.store[e], terminal.store[e]);
            if (terminal.store[e] < 1000 || terminal.store[e] === undefined) {
                console.log(giveMinerals(terminal, e, 1000));

            }
        }
    }
    /*
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
        } */
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

    for (var e in s1LabRooms) {
        if (terminal.room.name != s1LabRooms[e]) {
            let tmp = Game.rooms[s1LabRooms[e]].terminal; //Game.getObjectById(s1LabRooms[e]);
            //                    if(tmp.store[mineral] > 1)
            //                          console.log('here?',tmp.store[mineral],mineral,tmp.room.name);
            if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest && tmp.store[mineral] > 2100 && tmp.room.controller.level > 5) {
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
            terminal.room.visual.text('M_SENT', terminal.pos.x, terminal.pos.y, {
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
    return false;
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
    var target = 'E14S37';
    if (terminal.room.name == target) return false;
    //   if (Game.rooms.E27S34.storage.store[RESOURCE_ENERGY] < 10000) target = 'E27S34';
    if (Game.rooms[target].terminal === undefined) return false;
    if (Game.rooms[target].terminal.total > 290000) return false;
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


function upgradeGH(terminal) {
        var targetRoom = Game.spawns.Spawn28.room;
    if (targetRoom.controller.level < 6) return false;
    if (targetRoom.terminal === undefined) return false;
    if (Memory.stats.totalMinerals.XGH2O < 100000) return false;
    if(targetRoom.terminal.store.XGH2O !== undefined && 
        targetRoom.terminal.store.XGH2O > 10000 ) return true;

// XGH2O stuff
console.log('checking ',targetRoom.terminal.store.XGH2O,terminal.store.XGH2O,terminal.room.controller.level  );
    if((targetRoom.terminal.store.XGH2O === undefined || targetRoom.terminal.store.XGH2O < 10000 ) && terminal.store.XGH2O > 2000 && terminal.room.controller.level === 8) {
        let amount = 1000;
        let result = terminal.send('XGH2O', amount, targetRoom.name);
        console.log('^^^ Sending XGH2O to upgrade room:' + result + '#:' + amount + ' ^^^');
        if (result === 0) {
            return true;
        }
    }
}
function upgradeRoom(terminal) {
//    if(Game.spawns.upgrade === undefined) return;
    var targetRoom = Game.spawns.Spawn28.room;
    if (targetRoom.controller.level < 6) return false;
    if (targetRoom.terminal === undefined) return false;
// Energy stuff.
    var totalEnergy = targetRoom.storage.store[RESOURCE_ENERGY] + targetRoom.terminal.store[RESOURCE_ENERGY];
    if (targetRoom.storage.store[RESOURCE_ENERGY] > 990000 && targetRoom.terminal.total > 290000) return false;
    var amount = terminal.store[RESOURCE_ENERGY] * 0.25;
    var sender = terminal;
    var result = terminal.send('energy', amount, targetRoom.name);
    console.log('^^^ Sending ENERGY to upgrade room:' + result + '#:' + amount + ' ^^^');
    if (result === 0) {
        return true;
    }
    return false;
}

var wanted = ['L'];

function buyMineralsFromBUYORDER(terminal) {
    var stor = terminal.room.storage;
    var eng = terminal.store[RESOURCE_ENERGY];
    var buy;
    if (eng < 30000 && !anyLikeOrder(RESOURCE_ENERGY, terminal.pos.roomName)) {
        console.log(terminal.room.name, 'needs energy in terminal');
            Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 100000, terminal.pos.roomName);
    } else {
        for (var e in wanted) {
            if (terminal.store[wanted[e]] < 25000 || terminal.store[wanted[e]] === undefined) {
                console.log(terminal.room.name, 'needs', wanted[e], ' in terminal', terminal.store[wanted[e]]);

        if(!anyLikeOrder(wanted[e], terminal.pos.roomName) ){
            let average = getAverageMineralPrice(wanted[e], true);
            if (average < 0.5) {
                Game.market.createOrder(ORDER_BUY, wanted[e],average , 25000, terminal.pos.roomName);
            }

        }
            }

        }


    }
    // Look for resourses wanted.

}

class roleTerminal {

    static getStored() {
        return xStorage;
    }
    /** @param {Creep} creep **/
    static run() {
        cleanUpOrders();
        adjustOldPrices();
        if (Game.shard.name == 'shard0') {
            for (var a in s0LabRooms) {
                console.log(Game.rooms[s0LabRooms[a]], s0LabRooms[a]);
                if (Game.rooms[s0LabRooms[a]] !== undefined) {
                    let terminal = Game.rooms[s0LabRooms[a]].terminal;
                                    buyMineralsFromBUYORDER(terminal);
                }
            }
            return;
        }
        focusMinerals(focusID, focusMin);
        Memory.stats.totalMinerals = countTerminals();

        var focus = false;
        var newTrade = false;
        var upgradeTransfer = false;

        if(Game.rooms.E14S38.controller.level > 5 && Game.rooms.E14S38.terminal.store.K > 1000) {
            Game.rooms.E14S38.terminal.send('K', Game.rooms.E14S38.terminal.store.K, 'E17S45', 'trade');
        }

        for (var e in s1LabRooms) {
            if (Game.rooms[s1LabRooms[e]] !== undefined) {


                let terminal = Game.rooms[s1LabRooms[e]].terminal;



                if (terminal !== undefined && terminal.cooldown === 0 && s1LabRooms[e] !== 'E14S38') {

    if(!upgradeTransfer)
        upgradeTransfer = upgradeGH(terminal);

                    var energy = terminal.store[RESOURCE_ENERGY];
                    var total = terminal.total;
                    if (total > 295000) {
                        if (energy > 20000) {
                            if (!upgradeTransfer) {
                                upgradeTransfer = upgradeRoom(terminal);
                                if (!upgradeTransfer) {
                                    if (!shareEnergy(terminal)) { // Moves energy around
                                        if (terminal.room.name !== 'E14S37')
                                            if (!tradeEnergy(terminal)) {}
                                    }
                                }
                            } else {
                                if (!shareEnergy(terminal)) { // Moves energy around
                                    if (terminal.room.name !== 'E14S37')
                                        if (!tradeEnergy(terminal)) {}
                                }

                            }

                        } else if (energy > 21000) {
                            if (!newTrade) {
                                newTrade = newTradeEnergy(terminal);
                            }
                        } else if (energy > 10000) {

                        } else {

                        }
                    }
                    //                if (!focus) focus = focusRoom(terminal);
                    needEnergy(terminal);
                    let needed = labs.neededMinerals(terminal.pos.roomName);
                    getMinerals(terminal, needed);

                    if (terminal.room.memory.boost !== undefined) {
                        //    console.log(terminal.store[terminal.room.memory.boost.mineralType],'zvv');
                        if (terminal.store[terminal.room.memory.boost.mineralType] === undefined || terminal.store[terminal.room.memory.boost.mineralType] < terminal.room.memory.boost.mineralAmount) {
                            giveMinerals(terminal, terminal.room.memory.boost.mineralType);
                        }
                    }
                    //                forEveryTerminal(terminal);
                    forEveryStorage(terminal);




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

                }

            }
            //          energyCheck(terminal);
        }

        doDebt(); // Send energy to a target
        sellMineralOrder();
        //        buyMineralOrder();

    }


}
module.exports = roleTerminal;