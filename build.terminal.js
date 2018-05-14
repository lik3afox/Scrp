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
var s1LabRooms = ['E28S37', 'E18S36', 'E17S34', 'E23S38', 'E18S32', 'E17S45', 'E25S37', 'E13S34', 'E14S37', 'E22S48', 'W53S35',
    'E27S34', 'E14S43', 'E23S42', 'E28S42', 'E24S33', 'E25S43', 'E14S47', 'E25S47', 'E14S38', 'E25S27', 'E27S45', 'E29S48', 'E18S46', 'E32S34',
    'E11S47', 'E1S11', 'E33S54', 'E2S24'
];
var s0LabRooms = ['E38S81'];

// If you need to focus all minerals somewhere change it here.
var focusID; // = '5a77f309cae6c964a010370d';
var focusMin; // ='XGH2O';

// Every terminal needs this amount or else...
var required = [{ resource: RESOURCE_POWER, amount: 100 }, { resource: 'G', amount: 500 }];
var labs = require('build.labs');
var shard1Rooms = 25;
var terminalStorage = 40000;
var xStorage = {
    XGHO2: {
        amount: (labs.maxMinerals().XGHO2 - terminalStorage) / shard1Rooms
    },
    XUH2O: {
        amount: (labs.maxMinerals().XUH2O - terminalStorage) / shard1Rooms
    },
    XUHO2: {
        //        amount: (labs.maxMinerals().XUH2O - terminalStorage) / shard1Rooms
        amount: 1000,
    },
    XZH2O: {
        amount: (labs.maxMinerals().XZH2O - terminalStorage) / shard1Rooms
    },
    XKHO2: {
        amount: (labs.maxMinerals().XKHO2 - terminalStorage) / shard1Rooms
    },
    XKH2O: {
        //        amount: (labs.maxMinerals().XKHO2 - terminalStorage) / shard1Rooms
        amount: 1000,
    },
    XZHO2: {
        amount: (labs.maxMinerals().XZHO2 - terminalStorage) / shard1Rooms
    },
    XLHO2: {
        amount: (labs.maxMinerals().XLHO2 - terminalStorage) / shard1Rooms
    },
    XLH2O: {
        //   amount: (labs.maxMinerals().XLHO2 - terminalStorage) / shard1Rooms
        amount: 1000,
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
    //if(terminal.room.storage === undefined ) return false;
    for (var e in s1LabRooms) {
        let storage = Game.rooms[s1LabRooms[e]].storage;
        if (storage === undefined) continue;
        if (storage !== null && s1LabRooms[e] !== terminal.room.name) {
            //          // console.log(s1LabRooms[e],storage.store[RESOURCE_ENERGY] , currentLow, terminal.total);
            if (s1LabRooms[e] !== 'E14S38' && storage === undefined) {
                lowestStore = 0;
                currentLow = storage.store[RESOURCE_ENERGY];
            } else if (storage !== undefined && s1LabRooms[e] !== 'E14S38' && storage.store[RESOURCE_ENERGY] < currentLow && storage.room.terminal.total < 295000 && Game.rooms[s1LabRooms[e]].controller.level > 5) {
                lowestStore = storage;
                currentLow = storage.store[RESOURCE_ENERGY];
            }
        }
    }
    //    // console.log(terminal.room.name, 'needs found lowest', lowestStore);
    if (lowestStore === undefined) return false;
    if (currentLow > 899000) return false;


    let amount = terminal.store[RESOURCE_ENERGY] * 0.1;
    let zz = terminal.send(RESOURCE_ENERGY, amount, lowestStore.room.name, 'Sharing Energy');
    //    console.log(terminal.pos, "sHaring energy to", lowestStore.room.name, ":", amount, zz);
    return true;
}

function adjustOldPrices() {
    if (Game.shard.name === 'shard2') return false;
    var order = _.filter(Game.market.orders, function(o) {
        return Game.time - o.created > 30000 && o.price !== 0.01;
    });
    if (order.length > 0) {
        for (var e in order) {
            if (order[e].resourceType !== RESOURCE_ENERGY && order[e].resourceType !== "XGH2O" && order[e].resourceType !== "token") {
                let amount = getAverageMineralPrice(order[e].resourceType, false);
                if (amount !== undefined && amount < order[e].price && order[e].price !== 0.01) {
                    //                    // console.log('switching average of order', order[e].id, 'too', amount);
                    Game.market.changeOrderPrice(order[e].id, amount);
                }
            }
        }
    }
}

function needEnergy(terminal) {

    if (terminal.room.controller.level < 6) return false;
    if (terminal.room.storage === undefined) return false;
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
            //            // console.log('UPGRADE terminal:', terminal.room, 'gets' + amount + ' energy:', highestEnergy.room, 'result:', zz);
        }
    } else {
        if (terminal.store[RESOURCE_ENERGY] < 10000 || terminal.room.storage.store[RESOURCE_ENERGY] < 10000) {

            currentHigh = 0;

            for (e in s1LabRooms) {
                let storage = Game.rooms[s1LabRooms[e]].terminal;

                if (storage !== undefined && storage.store[RESOURCE_ENERGY] > currentHigh && terminal.room.name != storage.room.name && terminal.room.name !== 'E14S38') {
                    highestEnergy = Game.rooms[s1LabRooms[e]].terminal;
                    currentHigh = storage.store[RESOURCE_ENERGY];
                }
            }
            let amount = currentHigh * 0.25;
            if (highestEnergy !== undefined) {
                let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
                //                // console.log('This terminal:', terminal.room, 'gets' + amount + ' energy:', highestEnergy.room, 'result:', zz);
            }
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
                    // console.log(ORDER_SELL, RESOURCE_POWER, amount, 45000, terminal.room.name, 'current average price for power', qq);
                }
            } else if (terminal.room.terminal.store[RESOURCE_POWER] > 75000) {
                
                            var order = _.filter(Game.market.orders, function(o) {
                                return o.resourceType == RESOURCE_POWER && o.roomName == terminal.room.name && Game.time - o.created > 30000;
                            });
                            if (order.length > 0) {
                                // console.log('switching average of order');
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
                if (target !== undefined && target.store !== undefined && target.store[basic[b]] > 0) {
                    info.amount += target.store[basic[b]];
                }
                target = Game.rooms[s1LabRooms[e]].storage;
                if (target !== undefined && target.store !== undefined && target.store[basic[b]] > 0) {
                    info.amount += target.store[basic[b]];
                }
            }
        }
        data[basic[b]] = info.amount;
    }
    return data;
}

function newTradeEnergy(terminal) {
    //if(Game.shard.name !== 'shard1') return true;

    if (Game.shard.name === 'shard1' && Game.rooms.E14S38.controller.level > 5 && Game.rooms.E14S38.terminal.store[RESOURCE_ENERGY] < 290000) return true;
    // Below here we're selling energy.

    //    let eTotal = terminal.store[RESOURCE_ENERGY];
    //    if (eTotal < 21000) return false;
    let targetRoom = terminal.pos.roomName;
    //    if (Memory.termReport) // console.log(terminal, 'has ', eTotal, targetRoom);
    let Orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
    Orders = _.filter(Orders, function(order) {
        return (order.price > 0.01);
    });
    if (Orders.length === 0) {
        //        // console.log('ALERT!! No orders above 0.01 energy');
        return true;
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

        //// console.log( profit/(1+temp), target.price/(1+target.cost),target.price,temp );
        if (Game.rooms[Orders[e].roomName] !== undefined) {
            //            // console.log('trying to buy own energy');
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

    if (target.room === undefined) return;
    //    // console.log('in newtrade', target.room, target.price);

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
    //    // console.log(profitLine, perEnergy);
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
                    console.log(maxLimit, grade, whatHappened, '*EstProfit:', (energyGained * 0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price, 'Gain:', profit.toFixed(2), "total=", energyUsed.toFixed(2), "Amount", trans.toFixed(2), '+Transfer:', cost, '@perEnergy', perEnergy.toFixed(3));
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
            //            if (grade !== undefined)
            // console.log(grade, 'Deal passed up', terminal.room, 'pro:', profit.toFixed(2), 'profi:', energyGained, 'Max:', maxLimit);
            //            // console.log(maxLimit,, '*EstEnergyGained:', energyGained, 'From:', terminal.room, 'to', target.room, '@', target.price, 'profit', profit, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans, "total", energyUsed,'Term',termEnergy,'storage',storeEnergy);
            // // console.log(maxLimit,'F Deal:', '*EstProfit:', (energyGained*0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price, 'profit', profit.toFixed(2), 'Transfer:', cost, 'perEnergy', perEnergy.toFixed(3), "Amount", trans.toFixed(2), "total", energyUsed.toFixed(2),GOOD);            return false;
        }

        /*        if (AWESOME > perEnergy) {
                    // console.log('ESTEnergyGained:', energyGained, 'EnergyUsed', energyUsed, 'Credit Profit', profit);
                    // console.log('A++Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                } else if (GREAT > perEnergy) {
                    // console.log('ESTEnergyGained:', energyGained, 'EnergyUsed', energyUsed, 'Credit Profit', profit);
                    // console.log('A Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                } else if (GOOD > perEnergy) {
                    // console.log('ESTEnergyGained:', energyGained, 'EnergyUsed', energyUsed, 'Credit Profit', profit);
                    // console.log('B Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                } else { //        if(GOOD > perEnergy ) {
                    // console.log('C Profit SELL :', terminal.room, 'to', target.room, '@', target.price, 'Transfer:', cost, 'perEnergy', perEnergy, "Amount", trans);
                }
        */

    }
    return false;
}

function tradeEnergy(terminal) {

    // Below here we're selling energy.
    if (!Memory.war) {
        let eTotal = terminal.store[RESOURCE_ENERGY];
        let targetRoom = terminal.pos.roomName;
        //    if (Memory.termReport) // console.log(terminal, 'has ', eTotal, targetRoom);
        let Orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
        let target = { price: 0.01, id: undefined, cost: 1000, amount: 1, room: undefined, trans: 1 };
        let EnergyNum = 100;

        for (var e in Orders) {
            let temp = (Game.market.calcTransactionCost(EnergyNum, targetRoom, Orders[e].roomName) / EnergyNum);
            let profit = Orders[e].price;
            // so far this only calcuates the distance - and the closest is best so far. 
            // What htis logic below is
            // profit / 1 energy + cost    

            //// console.log( profit/(1+temp), target.price/(1+target.cost),target.price,temp );
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
        if (target.price > 0.01) {
            let whatHappened = Game.market.deal(target.id, trans, targetRoom);
            // console.log(targetRoom, "Max Energy Trade", whatHappened, 'profit:', target.price * trans, '@', trans, '(' + target.price + ')', 'EnergyCost', (target.price + target.cost), (target.price + target.cost) * trans, 'Profit per Energy', target.price / (1 + target.cost), roomLink(terminal.room.name));
        }
    }

    //  var amountSending = terminal.store[RESOURCE_ENERGY] * 0.05;
    //   var rando = Math.floor(Math.random() * Memory.debts.length);
    //    var result = terminal.send(RESOURCE_ENERGY, amountSending, Memory.debts[rando].room, 'End');
    //    // console.log('LUCKY ROOM', Memory.debts[rando].room, 'gets energy:', amountSending, 'from this room', terminal.room);

    /*    if (Memory.sellingHistory === undefined) { Memory.sellingHistory = []; }

        let orderInfo = {
            price: target.price,
            distance: Game.map.getRoomLinearDistance(target.room, targetRoom),
            energyCost: Game.market.calcTransactionCost(trans, target.room, targetRoom),
            amount: trans
        };
        Memory.sellingHistory.push(orderInfo);
    */
    //    // console.log('besties',target.id,trans,targetRoom,target.price,target.room);
    //    eTotal/1+target.cost 
    // Game.market.calcTransactionCost(1, targetRoom, order.roomName)
}

// Energy seems to be at .01 to .05 credits.

var profitLine = 0.30;

function checkEnergyProfit(distance, credits, amount) {
    credits = credits * 100;
    let line = Math.ceil(amount * (Math.log((0.1 * distance) + 0.9) + 0.1));
    let total = (line / credits) / amount;
    //    // console.log(line, 'per', amount, total, profitLine);
    if (total < profitLine) {
        return true;
    } else {
        return false;
    }
}

function orderExist(resource, room, sellingPoint) {
    for (var e in Game.market.orders) {
        let order = Game.market.orders[e];
        //        if (Memory.termReport) // console.log(order.resourceType, resource, order.roomName, room, sellingPoint, order.price);
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

function anyLikeOrder(resource, room, orderType, sellingPoint) {

    /*
        for (var e in Game.market.orders) {
            let order = Game.market.orders[e];
            if (order.resourceType == resource && order.roomName == room) return true;
        } */
    for (var a in prohibited) {
        if (resource == prohibited[a]) {
            return true;
        }
    }

    if (orderType === undefined) {
        orderType = ORDER_SELL;
    }
    /*
        orders = Game.market.getAllOrders({ type: orderType, resourceType: resource,  roomName: room});
        // console.log('doing anylike order',orders.length,orderType,resource,room,sellingPoint);
        if(orders.length > 0 ) {
          return true;  
        }  */

    let zz = _.filter(Game.market.orders, function(order) {
        return (order.resourceType == resource && order.type == orderType);
    });
    if (zz.length > 0) {
        return true;
    }
    //if(1 == 1)return true;

    return false;

}



function sellMineralOrder() {
    // First lets find what I have most of
    let target = { resource: undefined, amount: 0 };

    let total = 0;
    for (var e in Memory.stats.totalMinerals) {
        if (e == 'K' || e == 'U' || e == 'Z' || e == 'X' || e == 'L' || e == 'O' || e == 'H') {
            if (Memory.stats.totalMinerals[e] > 250000) {

                //                let Orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: e });
                let sellingPoint = getAverageMineralPrice(e, false); //= 1000;
                /*                for (var vv in Orders) {
                                    if (Orders[vv].price < sellingPoint) {
                                        sellingPoint = Orders[vv].price;
                                    }
                                }*/

                var termin = getMostTerminal(e);
                var amount = termin.store[e] * 0.75;

                if (sellingPoint >= 0.01 && !anyLikeOrder(e, termin.pos.roomName, ORDER_SELL)) {
                    //                if (sellingPoint >= 0.01 && !orderExist(e)) {

                    let whatHappened = Game.market.createOrder(ORDER_SELL, e, sellingPoint, amount, termin.pos.roomName);
                    // console.log(whatHappened, 'selling:', e, '@', sellingPoint, 'For:', amount, '@', termin.pos.roomName);
                    //                    // console.log('Made order for minerals:', target.resource, target.amount, sellingPoint, whatHappened);
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
        //    // console.log(ORDER_SELL, target.resource, sellingPoint, Math.floor((target.amount * 0.1)), terminal.pos.roomName, orderExist(target.resource, terminal.pos.roomName, sellingPoint));

        if (sellingPoint <= 0.01) return;
        if (orderExist(target.resource, terminal.pos.roomName, sellingPoint)) return;
        let whatHappened = Game.market.createOrder(ORDER_SELL, target.resource, sellingPoint, Math.floor((target.amount * 0.05)), terminal.pos.roomName);
        //if(Memory.termReport )
        // console.log('Made order for minerals:', target.resource, target.amount, sellingPoint, whatHappened);
        // then find what the lowest sell order is
        // Then set it to that price. 
        // */
}

function cleanUpOrders() {
    if (Game.market.orders.length === 0) return;
    for (var e in Game.market.orders) {
        let order = Game.market.orders[e];
        if (Game.time - order.created > 2500 && order.remainingAmount <= 10 && order.resourceType !== 'token') {
            Game.market.cancelOrder(order.id);
            if (Game.rooms[order.roomName].memory.trapCount !== undefined) {
                Game.rooms[order.roomName].memory.trapCount = 0;
            }
        } else if (order.remainingAmount === 0) {
            Game.market.cancelOrder(order.id);
        }
    }
}

/*
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
    if (target !== undefined) {
        if (target.amount < sellAmount) {
            sellAmount = target.amount;
        }
        if (most < sellAmount) {
            sellAmount = most;
        }
        let cc = Game.market.deal(target.id, sellAmount, terminal.room.name);
        // console.log('Sold', sellAmount, target.amount, 'mineral', mostMineral, target.price, terminal.room.name, cc);
        return true;
    }

    return false;
} */

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
    //    // console.log(terminal.room.name, 'this terminal is full with less than 20000 energy', mostMineral, lowestStore.room.name, 'result:', bb);

    //Game.rooms.E28S71.terminal.send('O', 15000, 'E5N7', 'trade');
    //  let zz = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: e });
    //    zz.sort((a, b) => a.price - b.price);

    //      let cc = Game.market.deal(zz[0].id, 2000, terminal.room.name);
    //        // console.log('Sold 100 mineral', mostMineral, zz[0].price * 2000,cc);

    //Game.market.deal('57cd2b12cda69a004ae223a3', 1000, "W1N1");   

    //    }


    return false;
}

function newgetMostTerminal(mineralz, target) {
    // get rooms that have terminal
    // Sort it by the mineral

}

function getLeastTerminal(mineralz, target) {
    let highest = 300000;
    var bested;
    var e;
    var mineral = mineralz; // = mineralz.toLowerCase();
    if (target === undefined) {
        e = s1LabRooms.length;
        while (e--) {
            let tmp = Game.rooms[s1LabRooms[e]].terminal;
            if (tmp !== undefined && tmp.store[mineral] !== undefined && tmp.store[mineral] < highest && tmp.store[mineral] > 10000) {
                highest = tmp.store[mineral];
                bested = tmp;
            }
        }
        return bested;

    } else {
        for (e in s1LabRooms) {
            if (target.id != s1LabRooms[e]) {
                let tmp = Game.rooms[s1LabRooms[e]].terminal;
                if (tmp.store[mineral] !== undefined && tmp.store[mineral] < highest && tmp.store[mineral] > 10000) {
                    highest = tmp.store[mineral];
                    bested = tmp;
                }
            }
        }
        return bested;
    }

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
            if (tmp !== undefined && tmp.store[mineral] !== undefined && tmp.store[mineral] > highest) {
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
                // console.log(result, mins[e], sending, 'E13S72', 'Inviso', sender.pos.roomName, sender.store[mins[e]]);
            }
        }
    }
}

function doDebt() {

    if (Memory.debts.length === 0) {
        var debt = {
            room: 'test',
            type: 'E',
            increment: 0,
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
    var giver = getLeastTerminal(Debt.type);

    var transferAmount = Debt.increment;

    if (giver === undefined) {
        // console.log('ERROR in DEBT', Debt.type, Debt.room, Debt.amount);

        Memory.debts.push(Memory.debts.shift());
        return false;
    }
    if (Debt.type !== RESOURCE_ENERGY) {

    } else {
        if (giver.store[Debt.type] < transferAmount * 10) {
            // console.log('Error in Debt, not enough funds', giver.pos, giver.store[Debt.type], transferAmount * 10);
            Memory.debts.push(Memory.debts.shift());
            return false;
        }

    }

    var result = giver.send(Debt.type, transferAmount, Debt.room, 'Debt@' + Debt.amount);

    if (result == OK) {
        Debt.amount -= transferAmount;
    }
    if (Debt.amount <= 0) {
        // console.log(result, 'Debt COMPLETED!!', Debt.room, Debt.type);
        if (Debt.repeat) {
            var zz = Memory.debts.shift();
            zz.amount = zz.maxAmount;
            Memory.debts.push(zz);
        } else {
            Memory.debts.shift();
        }
    } else {
        // console.log(result, 'Debt Sending', Debt.room, 'sending:', Debt.type, 'From:', giver.room.name, 'Amount:', transferAmount, 'Debt@', Debt.amount);
    }
    return true;
}





function getAverageMineralPrice(resource, buy) {
    if (buy === undefined) buy = true;
    var amount;
    let zz = Game.market.getAllOrders({ type: (buy ? ORDER_BUY : ORDER_SELL), resourceType: resource });
    zz.sort((a, b) => a.price - b.price);
    let bb = 0;
    if (buy) {
        if (zz[zz.length - 1] !== undefined && zz[zz.length - 1].price !== 0.01)
            bb += zz[zz.length - 1].price;
        if (zz[zz.length - 2] !== undefined && zz[zz.length - 2].price !== 0.01)
            bb += zz[zz.length - 2].price;
        if (zz[zz.length - 3] !== undefined && zz[zz.length - 3].price !== 0.01)
            bb += zz[zz.length - 3].price;
        if (zz[zz.length - 4] !== undefined && zz[zz.length - 4].price !== 0.01)
            bb += zz[zz.length - 4].price;
    } else {
        if (zz[1] !== undefined && zz[1].price !== 0.01)
            bb += zz[1].price;
        if (zz[2] !== undefined && zz[2].price !== 0.01)
            bb += zz[2].price;
        if (zz[3] !== undefined && zz[3].price !== 0.01)
            bb += zz[3].price;
        if (zz[0] !== undefined && zz[0].price !== 0.01)
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
            if (amount !== undefined && !anyLikeOrder(e, "E13S34", ORDER_BUY)) {
                let qq = Game.market.createOrder(ORDER_BUY, e, amount, 25000, "E13S34");
                // console.log('Created Buy Order for ', e, 'amount:', amount, qq);
            }
        }
    }
}


function forEveryStorage(terminal) {
    if (terminal.room.name === 'E14S38') return;
    if (terminal.room.controller.level !== 8) return;
    //    if (terminal.room.memory.simple) return;
    if (Game.shard.name !== 'shard1') return;
    var storage = terminal.room.storage;
    for (var e in xStorage) {
        if (storage.store[e] === undefined ||
            (storage.store[e] !== undefined && storage.store[e] < xStorage[e].amount && (terminal.store[e] === undefined || terminal.store[e] < 1000))) {
            if (terminal.store[e] < 1000 || terminal.store[e] === undefined) {
                giveMinerals(terminal, e, 1000);

            }
        }
    }

}


function forEveryTerminal(terminal) {
    for (var e in required) {
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

//var highestCached;

function giveMinerals(terminal, mineral, amount) {
    //   if (highestCached === undefined) {
    //       highestCached = {};
    //   }
    // First lets find the terminal with the highest of wanted minerals.
    let target;
    let highest = 0;
    // if (highestCached[mineral] === undefined) {
    //s1LabRooms.sort((a, b) => Game.rooms[s1LabRooms[e]].terminal.store[mineral] - b.pos.getRangeTo(creep));
    //bads.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep));
    for (var e in s1LabRooms) {
        if (terminal.room.name != s1LabRooms[e]) {
            let tmp = Game.rooms[s1LabRooms[e]].terminal; //Game.getObjectById(s1LabRooms[e]);

            if (tmp !== undefined && tmp.store[mineral] !== undefined && tmp.store[mineral] > highest && tmp.room.controller.level > 5) {
                let minNeeded = labs.neededMinerals(tmp.room.name);
                if (_.contains(minNeeded, mineral)) {
                    if (tmp.store[mineral] > 2000) {

                        highest = tmp.store[mineral];
                        target = tmp;
                        //highestCached[mineral] = target;
                    }
                } else {
                    highest = tmp.store[mineral];
                    target = tmp;
                    //      highestCached[mineral] = target;
                }
            }
        }
    }
    //   } else {
    //      target = highestCached[mineral];
    //   }

    //              let sentResult = target.send(mineral, amount, targetRoom, '1zz');               
    //     // console.log('Sending Minerals:',target.pos.roomName,mineral,amount, 'azz');
    //// console.log('Target:',target,target !== undefined? target.pos.roomName :'none');
    if (target !== undefined) {
        let sender = target.pos.roomName;

        //        if (target.store[mineral] < 2100) return;

        if (amount === undefined) {
            amount = Math.floor(target.store[mineral] * 0.15);
        }
        if (amount > target.store[mineral]) {
            amount = target.store[mineral];
        }

        // IF the chosen room uses the mineral, then max at 1000 and if less than 2000, fail;

        let minNeeded = labs.neededMinerals(sender);
        if (_.contains(minNeeded, mineral)) {
            if (amount > 1000) {
                amount = 1000;
            }
            if (target.store[mineral] !== undefined &&
                target.store[mineral] < 2000) {
                return false;
            }
        }

        if (amount < 100) return false;
        let targetRoom = terminal.pos.roomName;
        let sentResult = target.send(mineral, amount, targetRoom, 'tradezz');
        if (sentResult == OK) {}
        terminal.room.memory.didOrder = undefined;
        //        // console.log('Sending Minerals:', sender, mineral, amount, targetRoom, sentResult);
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
}


function getMinerals(terminal, needed) {

    for (var e in needed) {
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
    //    // console.log(terminal.room.name, result, amount, terminal, RESOURCE_ENERGY);
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
    if (Game.shard.name !== 'shard1') return true;
    if (Game.spawns.Spawn28 === undefined) return false;
    var targetRoom = Game.spawns.Spawn28.room;
    if (targetRoom.controller.level < 6) return false;
    if (targetRoom.terminal === undefined) return false;
    if (terminal.store[RESOURCE_CATALYZED_GHODIUM_ACID] < 2000) return false;
    if (Memory.stats.totalMinerals.XGH2O < 80000) return false;
    if (targetRoom.terminal.store.XGH2O !== undefined &&
        targetRoom.terminal.store.XGH2O > 10000) return false;

    // XGH2O stuff
    // console.log('checking ', targetRoom.terminal.store.XGH2O, terminal.store.XGH2O, terminal.room.controller.level);
    if ((targetRoom.terminal.store.XGH2O === undefined || targetRoom.terminal.store.XGH2O <= 10000) && terminal.store.XGH2O > 2000 && terminal.room.controller.level === 8) {
        let amount = 1000;
        let result = terminal.send('XGH2O', amount, targetRoom.name);
        // console.log('^^^ Sending XGH2O to upgrade room:' + result + '#:' + amount + ' ^^^');
        if (result === 0) {
            return true;
        }
    }
}

function upgradeRoom(terminal) {
    //    if(Game.spawns.upgrade === undefined) return;
    //    if(Game.shard.name !== 'shard1') return true;
    if (Game.spawns.Spawn28 === undefined) return;
    var targetRoom = Game.spawns.Spawn28.room;
    if (targetRoom.controller.level < 6) return false;
    if (targetRoom.terminal === undefined) return false;
    // Energy stuff.
    var totalEnergy = targetRoom.storage.store[RESOURCE_ENERGY] + targetRoom.terminal.store[RESOURCE_ENERGY];
    if (targetRoom.storage.store[RESOURCE_ENERGY] > 990000 && targetRoom.terminal.total > 290000) return false;
    var amount = terminal.store[RESOURCE_ENERGY] * 0.25;
    var sender = terminal;
    var result = terminal.send('energy', amount, targetRoom.name);
    // console.log('^^^ Sending ENERGY to upgrade room:' + result + '#:' + amount + ' ^^^');
    if (result === 0) {
        return true;
    }
    return false;
}


function reduceTerminal(terminal) {
    // first we get the most
    var min;
    var most = 0;
    for (var e in terminal.store) {
        if (terminal.store[e] > most && e !== RESOURCE_ENERGY) {
            most = terminal.store[e];
            min = e;
        }
    }
    var leastTerm = 300000;
    var room;
    for (var ee in s1LabRooms) {
        if (Game.rooms[s1LabRooms[ee]].terminal.total < leastTerm && s1LabRooms[ee] !== 'E14S38') {
            room = s1LabRooms[ee];
            leastTerm = Game.rooms[s1LabRooms[ee]].terminal.total;
        }
    }
    // then we get the terminal with the least
    // console.log('this terminal" most is', min, "going to room", roomLink(room));
    terminal.send(min, 5000, room, 'trade');


}

var wanted;

function getPower(terminal) {
    if (terminal.store[RESOURCE_POWER] === 0 || terminal.store[RESOURCE_POWER] === undefined) {
        //        // console.log(roomLink(terminal.room.name), "getting power to process", terminal.store[RESOURCE_POWER]);
        getMinerals(terminal, [RESOURCE_POWER]);
    }
}


function buyMineralsFromBUYORDER(terminal) {
    var shard1Needed = require('commands.toSegment').getShardData();
    wanted = [];
    for (var need in shard1Needed.terminalRequest) {
        if (shard1Needed.terminalRequest[need])
            wanted.push(need);
    }
    if (wanted.length === 0) {

        return;
    }

    var stor = terminal.room.storage;
    var eng = terminal.store[RESOURCE_ENERGY];
    var buy;
    if (eng < 30000 && !anyLikeOrder(RESOURCE_ENERGY, terminal.pos.roomName, ORDER_BUY)) {

        Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 100000, terminal.pos.roomName);
    } else {
        for (var e in wanted) {
            if (terminal.store[wanted[e]] < 25000 || terminal.store[wanted[e]] === undefined) {


                if (!anyLikeOrder(wanted[e], terminal.pos.roomName, ORDER_BUY)) {
                    let average = getAverageMineralPrice(wanted[e], true);
                    if (average < 0.5) {
                        Game.market.createOrder(ORDER_BUY, wanted[e], average, 25000, terminal.pos.roomName);
                    }

                }
            }

        }


    }
    // Look for resourses wanted.

}

function doTrap(roomname) {
    if (Game.rooms[roomname].memory.trapCount === undefined) {
        Game.rooms[roomname].memory.trapCount = 0;
    }
    Game.rooms[roomname].memory.trapCount--;
    if (Game.rooms[roomname].memory.trapCount > 0) return;
    if (Game.rooms[roomname].terminal === undefined || Game.rooms[roomname].terminal.total > 290000) return;
    Game.rooms[roomname].memory.trapCount = 15;
    // if( roomname === 'E38S72' ) {
    //          Game.rooms[roomname].memory.marketBuyTrap = ['G','H','ZK','UL','energy','XGH2O','XGHO2','XZHO2','XZH2O','XLHO2','XLH2O','XKHO2','XKH2O','XUHO2','XUH2O','X','power'];
    //      }
    buyTrap = Game.rooms[roomname].memory.marketBuyTrap;

    for (var e in buyTrap) {
        var trapPrice = 0.01;
        if (buyTrap[e] === RESOURCE_ENERGY) {
            trapPrice = 0.005;
        }

        var orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: buyTrap[e], price: trapPrice, roomName: roomname });
        if (orders.length === 0) {
            // console.log('TRAP BUY@', roomname, 'W:', buyTrap[e], Game.shard.name, orders.length);
            //So if no buy orders, we'll setup an real cheap buy order.
            var amount = 10000;
            if (buyTrap[e] === RESOURCE_ENERGY) amount = 100000;
            Game.market.createOrder(ORDER_BUY, buyTrap[e], trapPrice, amount, roomname);

        }
    }
}

function trackSegmentSharing() {
    //    if (Game.time % 67 !== 0) return;

    if (Memory.stats.playerTrade === undefined) {
        Memory.stats.playerTrade = {};
    }

    if (Memory.segmentTransactions === undefined) {
        Memory.segmentTransactions = {
            lastIncommingTs: 0,
            lastOutgoingTs: 0,
        };
    }
    var incommingTrans = Game.market.incomingTransactions;
    var latestTransaction;
    var transaction;
    for (let id in incommingTrans) {
        transaction = incommingTrans[id];
        if (transaction.time > Memory.segmentTransactions.lastIncommingTs) {
            if (!latestTransaction) { latestTransaction = transaction.time; }
            if (!transaction.sender || transaction.order) { continue; }
            //            if (transaction.description !== 'segmentTransactions') {continue; }
            let username = transaction.sender.username;
            if (Memory.stats.playerTrade[username] === undefined) {
                Memory.stats.playerTrade[username] = 0;
            }
            var tradeScore = Memory.stats.playerTrade[username];
            if (username !== "likeafox" && transaction.order === undefined) {
                if (Memory.segmentTransactions[username] === undefined) { Memory.segmentTransactions[username] = {}; }
                if (Memory.segmentTransactions[username][transaction.resourceType] === undefined) { Memory.segmentTransactions[username][transaction.resourceType] = 0; }
                Memory.segmentTransactions[username][transaction.resourceType] += transaction.amount;
                Memory.stats.playerTrade[username] += transaction.amount;
                // console.log("Segment sharing from " + username + " : " + transaction.amount + " " + transaction.resourceType + " at tick " + transaction.time);
            }
        } else {
            break;
        }
    }
    if (latestTransaction) { Memory.segmentTransactions.lastIncommingTs = latestTransaction; }

    var outgoingTrans = Game.market.outgoingTransactions;
    for (let id in outgoingTrans) {
        transaction = outgoingTrans[id];
        if (transaction.time > Memory.segmentTransactions.lastOutgoingTs) {
            if (!latestTransaction) { latestTransaction = transaction.time; }
            if (!transaction.recipient || transaction.order) { continue; }
            let username = transaction.recipient.username;
            if (username !== "likeafox") {
                if (Memory.segmentTransactions[username] === undefined) { Memory.segmentTransactions[username] = {}; }
                if (Memory.segmentTransactions[username][transaction.resourceType] === undefined) { Memory.segmentTransactions[username][transaction.resourceType] = 0; }
                Memory.segmentTransactions[username][transaction.resourceType] -= transaction.amount;
                // console.log("Segment sharing to " + username + " : " + transaction.amount + " " + transaction.resourceType + " at tick " + transaction.time);
            }
        } else {
            break;
        }
    }
    if (latestTransaction) { Memory.segmentTransactions.lastOutgoingTs = latestTransaction; }
}

var focus;
var newTrade;
var share;
var failedRequest;

class roleTerminal {

    static getAveragePrice(e, isBuy) {
        return getAverageMineralPrice(e, isBuy);
    }

    static getRoomMostMineral(mineral) {
        let most = 0;
        let mostRoom;
        for (var e in s1LabRooms) {
            if (Game.rooms[s1LabRooms[e]] !== undefined) {
                var term = Game.rooms[s1LabRooms[e]].terminal;
                if (term !== undefined) {
                    let needed = labs.neededMinerals(term.pos.roomName);
                    if (term.cooldown === 0 && term.store[mineral] !== undefined && term.store[mineral] > most && !_.contains(needed, mineral)) {
                        most = term.store[mineral];
                        mostRoom = s1LabRooms[e];
                    }
                    if (term.cooldown === 0 && term.store[mineral] !== undefined && term.store[mineral] > most && _.contains(needed, mineral) && term.store[mineral] > 10000) {
                        most = term.store[mineral];
                        mostRoom = s1LabRooms[e];
                    }

                }
            }
        }

        return mostRoom;
    }

    static requestMineral(targetRoom, mineral, amount) {
        //  if (failedRequest === undefined) {
        //      failedRequest = {};
        //  }
        //  if (failedRequest[mineral] === undefined) {
        //            // console.log('REQUEST: mineral request for:', mineral, '@', roomLink(targetRoom), Memory.stats.totalMinerals[mineral]);
        switch (Game.shard.name) {
            case "shard0":
                s1LabRooms = ['E38S72'];
                break;
            case "shard2":
                s1LabRooms = ['E19S49'];
                break;
        }

        for (var e in s1LabRooms) {
            if (Game.rooms[s1LabRooms[e]] !== undefined && s1LabRooms[e] !== targetRoom) {
                var term = Game.rooms[s1LabRooms[e]].terminal;
                if (term !== undefined) {
                    let needed = labs.neededMinerals(term.pos.roomName);

                    if (term.cooldown === 0 && term.store[mineral] !== undefined && term.store[mineral] > 100 && !_.contains(needed, mineral)) {
                        if (mineral === RESOURCE_POWER) {
                            let amt = term.store[mineral] * 0.5;
                            if (term.store[mineral] < 1000) {
                                amt = 100;
                            }

                            let sentResult = term.send(mineral, amt, targetRoom, 'tradezz');
                            //                              // console.log('request for mineral @', targetRoom, sentResult, mineral, term.store[mineral] - 1);
                            if (sentResult === OK) return true;

                        } else {
                            if (amount === undefined) {
                                amount = term.store[mineral] - 1;
                                if (amount > 3000) {
                                    amount = amount >> 2;
                                }
                            }
                            if (amount < 100) amount = 100;
                            let msg;
                            if (amount === 101) {
                                msg = 'segmentTransactions';
                            }

                            let sentResult = term.send(mineral, amount, targetRoom, msg);
                            //                                                         console.log(sentResult,'request for mineral @',mineral,amount,targetRoom);
                            if (sentResult === OK) return sentResult;

                        }
                    }
                }
            }
        }
        //      failedRequest[mineral] = true;
        // }
        return false;

    }

    static getStored() {
        return xStorage;
    }


    static offShardTerminalRun(roomName) {
        // Satalite room for the main room, these are only on shard0/1 .
        var main;
        if (Game.shard.name === 'shard2') main = 'E19S49';
        if (Game.shard.name === 'shard0') main = 'E38S72';
        let terminal = Game.rooms[roomName].terminal;
        if (terminal === undefined) return;

        if (roomName === main) {
            doTrap(roomName);
            if (roomName === 'E38S72') {
                if (terminal.total > 290000) {
                    for (let e in terminal.store) {
                        if (e !== RESOURCE_ENERGY && terminal.store[e] > 10000) {

                            terminal.send(e, 2500, 'E38S81', 'stuf');
                            return;
                        }
                    }
                    if (Game.rooms.E38S81.terminal.total !== 300000) {
                        terminal.send(RESOURCE_ENERGY, 20000, 'E38S81', 'stuf');
                    } else {
                        tradeEnergy(Game.rooms[roomName].terminal);
                    }
                    return;
                }
            }
            //          if (Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 21000 || Game.rooms[roomName].terminal.total === 300000) {

            //                 newTradeEnergy(Game.rooms[roomName].terminal);
            //              return;
            //            }
            return;
        } else {
            if (Game.rooms[main].terminal.full && !Game.rooms[roomName].terminal.full) {
                let amt;
                if (Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 20000) {
                    amt = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] - 20000;
                } else {
                    amt = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] >> 1;
                }
                Game.rooms[main].terminal.send('energy', amt, roomName);
                return;
            }
            if (Game.rooms[roomName].terminal.full && Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 5000) {
                Game.rooms[roomName].terminal.send('energy', 5000, main);
                return;
            }
            if (Game.shard.name === 'shard2' && roomName === 'E29S48') {
                main = 'E23S45';
            }
            if (Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 22000 && Game.rooms[main].terminal.store[RESOURCE_ENERGY] < 20000) {
                Game.rooms[roomName].terminal.send('energy', 20000, main);
                return;
            }

        }

        var energy = terminal.store[RESOURCE_ENERGY];
        var total = terminal.total;

        if (terminal.total !== terminal.store[RESOURCE_ENERGY] && (terminal.room.boost === undefined || terminal.room.boost.mineralType === 'none')) {
            let needed = labs.neededMinerals(terminal.pos.roomName);
            for (let e in terminal.store) {

                if (!_.contains(needed, e) && e !== RESOURCE_ENERGY && terminal.store[e] !== undefined) {
                    let amnt = 1250;
                    if (amnt > terminal.store[e]) amnt = terminal.store[e];
                    if (amnt < 100) continue;
                    let ez = Game.rooms[roomName].terminal.send(e, amnt, main, 'Balance');
                    console.log(roomName, 'getting rid of excess', e, '@', main, 'xx', ez);
                    return;
                }
            }
        }
        if (Game.rooms[roomName].storage.store[RESOURCE_ENERGY] < 1000) {
            Game.rooms[main].terminal.send(RESOURCE_ENERGY, 1250, roomName, 'Balance');
            return;

        }
    }


    static runSimple(roomName) {

        //        // console.log('running simple terminal,', roomName, Game.shard.name);
        if (focus === undefined) {
            focus = false;
        }
        if (newTrade === undefined) {
            newTrade = false;
        }

        if (Game.rooms[roomName].memory.marketTrap !== undefined) {
            Game.rooms[roomName].memory.marketTrap = undefined;
        }
        if (Game.rooms[roomName].memory.marketBuyTrap === undefined) {
            Game.rooms[roomName].memory.marketBuyTrap = [];
        }
        if (Game.rooms[roomName].memory.marketSellTrap !== undefined) {
            Game.rooms[roomName].memory.marketSellTrap = undefined;
        }

        doTrap(roomName);
        var doNewTrade = ['E19S49', 'E1S11', 'E38S72', 'E11S47', 'W53S35'];
        if (_.contains(doNewTrade, roomName)) {
            if (Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 22000 && Game.rooms[roomName].storage.store[RESOURCE_ENERGY] > 850000)
                if (newTradeEnergy(Game.rooms[roomName].terminal)) {
                    return;
                }
        }

        let terminal = Game.rooms[roomName].terminal;
        if (terminal === undefined) return;
        var energy = terminal.store[RESOURCE_ENERGY];
        var total = terminal.total;
        if (total > 295000) {
            if (!shareEnergy(terminal)) {
                if (!tradeEnergy(terminal)) {
                    reduceTerminal(terminal);
                }
            }
        }
//        needEnergy(terminal);



        //        if (Game.shard.name == 'shard1')
        //          forEveryStorage(terminal);

        let needed = labs.neededMinerals(terminal.pos.roomName);
        if (terminal.room.boost !== undefined && terminal.room.boost.mineralType !== 'none') {
            needed.push(terminal.room.boost.mineralType);
        }
        if (roomName === 'E22S48') {
            // This room is what moves minerals too Shard2
            if (Memory.stats.totalMinerals.L > 80000)
                needed.push('L');
            if (Memory.stats.totalMinerals.X > 80000)
                needed.push('X');
            if (Memory.stats.totalMinerals.H > 80000)
                needed.push('H');
            if (Memory.stats.totalMinerals.O > 80000)
                needed.push('O');
            if (Memory.stats.totalMinerals.U > 80000)
                needed.push('U');
            if (Memory.stats.totalMinerals.Z > 80000)
                needed.push('Z');
            if (Memory.stats.totalMinerals.K > 80000)
                needed.push('K');
        }
        getMinerals(terminal, needed);
    }

    static runTerminal(roomName) {

        //        // console.log('running terminal,', roomName, Game.shard.name);
        if (focus === undefined) {
            focus = false;
        }
        if (newTrade === undefined) {
            newTrade = false;
        }
        if (share === undefined) {
            share = false;
        }

        if (Game.rooms[roomName] !== undefined && _.contains(s1LabRooms, roomName)) {
            if (Game.rooms[roomName].memory.marketTrap !== undefined) {
                Game.rooms[roomName].memory.marketTrap = undefined;
            }
            if (Game.rooms[roomName].memory.marketBuyTrap === undefined) {
                Game.rooms[roomName].memory.marketBuyTrap = [];
            }
            if (Game.rooms[roomName].memory.marketSellTrap !== undefined) {
                Game.rooms[roomName].memory.marketSellTrap = undefined;
            }
            doTrap(roomName);
            //        newTradeEnergy(terminal);

            let terminal = Game.rooms[roomName].terminal;

            if (terminal !== undefined && terminal.cooldown === 0 && roomName !== 'E14S38') {
                //              if (!upgradeGHTransfer)
                //                    upgradeGHTransfer = upgradeGH(terminal);

                var energy = terminal.store[RESOURCE_ENERGY];
                var total = terminal.total;
                /*                if (Game.shard.name === 'shard1' && (Game.rooms.E14S38.controller.level < 5 || Game.rooms.E14S38.storage.store.energy > 990000 && Game.rooms.E14S38.storage.total > 290000)) {
                                    if (!newTrade && energy > 21000) {

                                        if (!newTrade) {
                                    //        newTrade = newTradeEnergy(terminal);
                                        }
                                    }
                                } */
                if (total === 300000) {
                    // console.log(roomLink(terminal.room.name), "is full and less than 20K energy");
                    if (!shareEnergy(terminal)) {
                        if (!tradeEnergy(terminal)) {
                            reduceTerminal(terminal);
                        } else {
                            return;
                        }
                    }
                } else
                if (total > 295000) {
                    if (energy > 21000) {
                        //                        if (!upgradeTransfer) {
                        //  upgradeTransfer = upgradeRoom(terminal);
                        //      if (!upgradeTransfer) {
                        if (!share) {
                            share = shareEnergy(terminal);
                            if (!share) {
                                if (terminal.room.name !== 'E14S37') {
                                    if (!tradeEnergy(terminal)) {

                                    }
                                }
                            } else {

                            }
                        }
                        //    }
                        /*        } else {
                                    if (!share) {
                                        share = shareEnergy(terminal);
                                        if (!share) {
                                            if (terminal.room.name !== 'E14S37') {
                                                if (!tradeEnergy(terminal)) {

                                                }
                                            }
                                        } else {
                                        }
                                    }


                                }*/

                    } else {}
                }
                //                if (!focus) focus = focusRoom(terminal);
                needEnergy(terminal);
                let needed = labs.neededMinerals(terminal.pos.roomName);
                if (terminal.room.name === 'E22S48') {
                    // This room is what moves minerals too Shard2
                    if (Memory.stats.totalMinerals.L > 80000)
                        needed.push('L');
                    if (Memory.stats.totalMinerals.X > 80000)
                        needed.push('X');
                    if (Memory.stats.totalMinerals.H > 80000)
                        needed.push('H');
                    if (Memory.stats.totalMinerals.O > 80000)
                        needed.push('O');
                    if (Memory.stats.totalMinerals.U > 80000)
                        needed.push('U');
                    if (Memory.stats.totalMinerals.Z > 80000)
                        needed.push('Z');
                    if (Memory.stats.totalMinerals.K > 80000)
                        needed.push('K');
                }
                if (terminal.room.memory.boost !== undefined && terminal.room.memory.boost.mineralType !== 'none') {
                    needed.push(terminal.room.memory.boost.mineralType);
                }

                needed = _.uniq(needed);
                getMinerals(terminal, needed);

                if (terminal.room.memory.boost !== undefined) {

                    if (terminal.store[terminal.room.memory.boost.mineralType] === undefined || terminal.store[terminal.room.memory.boost.mineralType] < terminal.room.memory.boost.mineralAmount) {
                        giveMinerals(terminal, terminal.room.memory.boost.mineralType);
                    }
                }
                //                forEveryTerminal(terminal);
                //         if (Game.shard.name == 'shard1')
                //              forEveryStorage(terminal);
            }

        }
        //          energyCheck(terminal);
    }

    /** @param {Creep} creep **/
    static run() {
        cleanUpOrders();
        adjustOldPrices();
        anyLikeOrder('Z', 'E17S47', ORDER_SELL);
        trackSegmentSharing();
        //        upgradeTransfer = false;
        //        upgradeGHTransfer = false;

        switch (Game.shard.name) {
            case 'shard0':
                return;
            case 'shard1':
                focusMinerals(focusID, focusMin);
                Memory.stats.totalMinerals = countTerminals();

                //          if (Game.rooms.E14S38.controller.level > 5 && Game.rooms.E14S38.terminal.store.K > 1000) {
                //                Game.rooms.E14S38.terminal.send('K', Game.rooms.E14S38.terminal.store.K, 'E17S45', 'trade');
                //              }
                //                needEnergy(Game.rooms.E14S38.terminal);

                doDebt(); // Send energy to a target
                sellMineralOrder();
                //        buyMineralOrder();
                //                Game.rooms.E27S45.terminal.send('L', 100, 'E37S46');
                return;
            case 'shard2':
                return;
        }


    }


}
module.exports = roleTerminal;