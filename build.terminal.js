var labs = require('build.labs');
var s1LabRooms = [];
var s0LabRooms = [];
var prohibitedEnergySellingRooms;
var numOfOrders;
const maxEnergyTrans = 5000;

function createBuyEnergyOrder(roomName) {
    let room = Game.rooms[roomName];
    if (room === undefined) return false;
    if (!room.storage.closeToFull) {
        if (!anyLikeOrder(RESOURCE_ENERGY, roomName, ORDER_BUY)) {
            let avg = getAverageMineralPrice(RESOURCE_ENERGY, true);
            let amnt = 1000000 - room.storage.total;
            let rst = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, avg, amnt, roomName);
            console.log(rst, roomName, "needs to create Buy Order for energy,", ORDER_BUY, RESOURCE_ENERGY, avg, amnt, roomName);
        }
    }


}

function tokenMarket() {

    var order = _.filter(Game.market.orders, function(o) {
        return o.resourceType === 'token';
    });
    if (order.length > 0) {
        let myOrder = order[0];
        let maxOrder = _.max(Game.market.getAllOrders({ type: ORDER_BUY, resourceType: 'token' }), a => a.price);
        if (myOrder.price < maxOrder.price) {
            let newValue = maxOrder.price + 10000;
            if (Game.market.credits + 1000000 > newValue) {
                let priceChange = Game.market.changeOrderPrice(myOrder.id, newValue);
                console.log('Doing price change for TOKEN:', priceChange, 'New $$:', newValue, "Old:", maxOrder.price);
            }
        }
    } else {
        // Creating token buy order
        let maxOrder = _.max(Game.market.getAllOrders({ type: ORDER_BUY, resourceType: 'token' }), a => a.price);
        if (Game.market.credits > maxOrder.price + 1000000) {

            let rst = Game.market.createOrder(ORDER_BUY, 'token', maxOrder.price + 100000, 1, "E1S11");
            console.log(rst, 'creating Buy ORder for TOken,', maxOrder.price + 100000, "Credits:", Game.market.credits);
        }

    }
}


function sellMin(roomName, lowestPrice, thresholdAmount) {
    // This is an expensive function due to going through all Orders - something that should be avoided.

    if (Game.time % 500 !== 0) return;
    let room = Game.rooms[roomName];
    if (Game.shard.name === 'shard1') console.log(roomName, lowestPrice, thresholdAmount, "sellMxin");
    if (room === undefined) return;
    let terminal = room.terminal;
    if (terminal === undefined || terminal.store[RESOURCE_ENERGY] < 1250) return;
    let storage = room.storage;
    if (lowestPrice === undefined) {
        lowestPrice = 0.20;
    }
    if (thresholdAmount === undefined) {
        thresholdAmount = 0;
    }
    let termAmnt;
    if (Game.shard.name === 'shard1') {
        termAmnt = 5000;
    } else {
        termAmnt = 4500;
    }

    let buyOrders = Game.market.getAllOrders({ type: ORDER_BUY });


    for (let i in terminal.store) {
        if (_.contains(["H", "O", "U", "L", "K", "Z"], i) && terminal.store[i] >= termAmnt) { //|| storage.store[i] >= 100
            if (i === RESOURCE_ENERGY && storage.store[RESOURCE_ENERGY] < 100000) continue;
            if (Memory.stats && Memory.stats.totalMinerals && Memory.stats.totalMinerals[i] < thresholdAmount) continue;
            let Orders = _.filter(buyOrders, function(order) {
                return (order.price > lowestPrice) && order.resourceType === i;
            });
            if (Orders.length > 0) {
                let zz = Game.market.deal(Orders[0].id, 1250, roomName);
                profitReport(roomName, "1 Credit B Order", zz, Orders[0].id, 1250, i, Orders[0].price, Orders[0].roomName);
                if (zz === OK) continue;
            }

        }
    }
}


var stopTemple;

function shareEnergy(terminal) {
    //    console.log('doing share energy', terminal, terminal.room.name);
    // When full, From this terminal, we will send energy to another.
    // Lets check here in all the storages to see if that room's storage level is at.
    if (terminal.store[RESOURCE_ENERGY] < terminalEnergyLimit) return false;
    if (terminal._gotEnergy) {
        console.log('Cancled ShareEnergy due to _gotEnergy', terminal.room.name);
        return false; // Because it gotEnergy this tick, so it won't be transfering energy.
    }
    var lowestStore = getLowStorageTotal(terminal.pos.roomName);
    if (!lowestStore) {
        lowestStore = getLowTerminalTotal(terminal.pos.roomName);

    }

    // So this is what is required to do a transfer, so if the lowest Score has this - then let's not do the transfer.
    // lowestStore.room.memory.energyIn;
    /*if ((!lowestStore || (lowestStore.room.storage.almostFull && lowestStore.room.terminal.almostFull)) && stopTemple === undefined) {
        //        console.log("lowestScore Failure: Doing Temple Transfer", lowestStore, lowestStore.pos.roomName, lowestStore.room.storage.total, lowestStore.room.terminal.store[RESOURCE_ENERGY]);
        let templeRoom = 'E14S38';
        if (Game.rooms[templeRoom] && Game.rooms[templeRoom].controller.level > 5) {
            let term = Game.rooms[templeRoom].terminal;
            if (term.store[RESOURCE_ENERGY] < 285000) {
                let zz = terminal.recordSend(RESOURCE_ENERGY, 10000, 'E14S38', 'Temple Room');
                profitReport(terminal.pos.roomName, "Temple Transfer", zz, undefined, 10000, "E", 0.00, 'E14S38');
                if (zz === OK && term.total >= 290000) {
                    stopTemple = true;
                }
                return true;
            }
        }
        templeRoom = 'E59S51';
        if (Game.rooms[templeRoom] && Game.rooms[templeRoom].controller.level > 5) {
            let term = Game.rooms[templeRoom].terminal;
            if (term.store[RESOURCE_ENERGY] < 285000) {
                let zz = terminal.recordSend(RESOURCE_ENERGY, 10000, 'E59S51', 'Temple Room');
                profitReport(terminal.pos.roomName, "Temple Transfer", zz, undefined, 10000, "E", 0.00, 'E59S51');
                return true;
            }
        }

    } else */
    if (lowestStore) {
        let amount = 10000; //terminal.store[RESOURCE_ENERGY] * 0.1;
        lowestStore.room.terminal._gotEnergy = true;
        let zz = terminal.recordSend(RESOURCE_ENERGY, amount, lowestStore.room.name, 'Sharing Energy');
        //    console.log(terminal.pos, "sHaring energy to", lowestStore.room.name, Game.rooms[lowestStore.room.name].memory.energyIn, ":", amount, zz);
        profitReport(terminal.pos.roomName, "Energy Sharing", zz, undefined, amount, "E", 0.00, lowestStore.room.name);
        return true;

    }
    return false;
}

function getLowTerminalTotal(target) {
    let lowest = 10000000;
    let bested;
    let e;
    let mineral = RESOURCE_ENERGY;
    for (e in s1LabRooms) {
        if (target != s1LabRooms[e] && !Game.rooms[s1LabRooms[e]].memory.energyIn && Game.rooms[s1LabRooms[e]].terminal.total < 295000 && Game.rooms[s1LabRooms[e]].terminal._gotEnergy === undefined) {
            let tmp = Game.rooms[s1LabRooms[e]].terminal.total;
            if (tmp < lowest) {
                lowest = tmp;
                bested = Game.rooms[s1LabRooms[e]].storage;
            }
        }
    }
    return bested;
}


function getLowStorageTotal(target) {
    let lowest = 1990000;
    let bested;
    let e;
    for (e in s1LabRooms) {
        if (target != s1LabRooms[e] && Game.rooms[s1LabRooms[e]].terminal._gotEnergy === undefined && Game.rooms[s1LabRooms[e]].terminal.total < 295000 && ((!Game.rooms[s1LabRooms[e]].memory.energyIn) || (Game.rooms[s1LabRooms[e]].memory.energyIn && !Game.rooms[s1LabRooms[e]].storage.almostFull))) {
            let tmp = Game.rooms[s1LabRooms[e]].storage.total;
            if (tmp < lowest) {
                lowest = tmp;
                bested = Game.rooms[s1LabRooms[e]].storage;
            }
        }
    }
    return bested;
}
/*
function adjustOldPrices() {
    //    if (Game.shard.name === 'shard2') return false;
    prohibitedEnergySellingRooms = {};
    var order = _.filter(Game.market.orders, function(o) {
        return o.price > 0.001;
    });
    console.log('here?',order.length);
    if (order.length > 0) {
        for (var e in order) {
            if (order[e].resourceType === RESOURCE_ENERGY && order[e].price === 0.012) {
                  console.log(  Game.market.changeOrderPrice(order[e].id, 0.013),"Changed" );
            }
        }
    }
}*/

function adjustOldPrices() {
    //    if (Game.shard.name === 'shard2') return false;
    prohibitedEnergySellingRooms = {};
    var order = _.filter(Game.market.orders, function(o) {
        return o.resourceType === 'token' || (Game.time - o.created > 30000 && o.price > 0.001) || o.amount === 0; //|| o.resourceType === RESOURCE_ENERGY
    });
    if (order.length > 0) {
        for (var e in order) {
            /*if (order[e].resourceType === RESOURCE_ENERGY && order[e].price < 0.005){ // Only cheap.
                let room = Game.rooms[order[e].roomName];
                if(room && room.storage && room.storage.total < 900000){
                    let addAmount = 1000000 - room.storage.total - order[e].remainingAmount;
                    if(addAmount > 100000){
                    let zed = Game.market.extendOrder(order[e].id, addAmount);
                        console.log(roomLink(order[e].roomName),"DED extend order",addAmount,zed);
                    }
                }
            } else */
            if (order[e].resourceType !== RESOURCE_ENERGY && order[e].resourceType !== "XGH2O" && order[e].resourceType !== "token" && order[e].resourceType !== "power") {
                let amount = getAverageMineralPrice(order[e].resourceType, false);
                if (amount !== undefined && amount < order[e].price && order[e].price > 0.001) {
                    //                    // console.log('switching average of order', order[e].id, 'too', amount);
                    Game.market.changeOrderPrice(order[e].id, amount);
                }
            } else if (order[e].resourceType === RESOURCE_ENERGY && order[e].price > 0.001) {
                prohibitedEnergySellingRooms[order[e].roomName] = true;
            }
            if (order[e].roomName && order[e].amount === 0 && order[e].type === "sell") {
                //                console.log("WE NEED TO SEND STUFF TO THIS ROOM ", order[e].roomName, order[e].resourceType, order[e].remainingAmount);
                requestMineral(order[e].roomName, order[e].resourceType, 25000);
            }


        }
    }
}

function countTerminals() {
    let data = {};
    let basic = [
        RESOURCE_POWER, RESOURCE_ENERGY,
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
        'ops'
    ];
    //    let showData =true;// Game.time%1000 === 0;

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

                // let's do lab stuff too?
                let lab1 = Game.getObjectById(Game.rooms[s1LabRooms[e]].memory.labs[0].id);
                //console.log(lab1 , lab1.mineralType, basic[b]);
                if (lab1 && lab1.mineralType && lab1.mineralType === basic[b]) {
                    info.amount += lab1.mineralAmount;
                }
                if (Game.rooms[s1LabRooms[e]].memory.labs[1]) {
                    let lab2 = Game.getObjectById(Game.rooms[s1LabRooms[e]].memory.labs[1].id);
                    if (lab2 && lab2.mineralType && lab2.mineralType === basic[b]) {
                        info.amount += lab2.mineralAmount;
                    }
                }

            }
        }
        //    if(showData){
        //          let max = labs.maxMinerals();
        //            console.log('Min:',basic[b],"Ammnt:",info.amount,"/",max[basic[b]]);
        //  }
        data[basic[b]] = info.amount;
    }
    return data;
}

var didNewTradeEnergy;

function newTradeEnergy(terminal) {
    //if(Game.shard.name !== 'shard1') return true;

    //    if (Game.shard.name === 'shard1' && Game.rooms.E14S38.controller.level > 5 && Game.rooms.E14S38.terminal.store[RESOURCE_ENERGY] < 290000) return true;
    // Below here we're selling energy.
    if (didNewTradeEnergy) return false;
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

    if (target.room === undefined) return false;
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
                let whatHappened = marketRecordDeal(target.id, trans, targetRoom);
                //                let whatHappened = Game.rooms[targetRoom].terminal.recordDeal(target.id,trans,targetRoom);
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
                    /*console.log(maxLimit, grade, whatHappened, '*EstProfit:', (energyGained * 0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price,
                        'Gain:', profit.toFixed(2),
                        "total=", energyUsed.toFixed(2), "Amount", trans.toFixed(2), '+Transfer:', cost, '@perEnergy', perEnergy.toFixed(3));*/
                    profitReport(terminal.room.name, grade, whatHappened, target.id, trans, "E", target.price, target.room);
                    didNewTradeEnergy = true;
                    return true;
                } else {
                    //                    console.log(maxLimit, grade, whatHappened, '*EstProfit:', (energyGained * 0.01).toFixed(2), 'From:', terminal.room, 'to', target.room, '@', target.price, 'Gain:', profit.toFixed(2), "total=", energyUsed.toFixed(2), "Amount", trans.toFixed(2), '+Transfer:', cost, '@perEnergy', perEnergy.toFixed(3));
                    profitReport(terminal.room.name, grade, whatHappened, target.id, trans, "E", target.price, target.room);
                    //profitReport(roomName, saleType, result, id, mineralAmount, mineralType, mineralCost, targetRoom);
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
let didTrade = {};

function maxEnergyTrade(terminal) {
    if (!prohibitedEnergySellingRooms) prohibitedEnergySellingRooms = {};
    if (prohibitedEnergySellingRooms[terminal.pos.roomName] && Game.shard.name !== 'shard3') { //
        console.log("prohibited room from selling max energy", terminal.pos.roomName);
        return false;
    }
    // Below here we're selling energy.
    let eTotal = terminal.store[RESOURCE_ENERGY];
    let targetRoom = terminal.pos.roomName;
    //    if (Memory.termReport) // console.log(terminal, 'has ', eTotal, targetRoom);
    let Orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
    let target = { price: 0.001, id: undefined, cost: 1000, amount: 1, room: undefined, trans: 1 };
    let EnergyNum = 100;
    //console.log('doing tradeEnergy',terminal.pos);
    let thresh = 1;
    if (terminal.total > 299000) {
        thresh = 500;
    }
    for (var e in Orders) {
        let temp = (Game.market.calcTransactionCost(EnergyNum, targetRoom, Orders[e].roomName) / EnergyNum);
        let profit = Orders[e].price;
        // so far this only calcuates the distance - and the closest is best so far. 
        // What htis logic below is
        // profit / 1 energy + cost    
        if(Game.rooms[Orders[e].roomName]) continue;
        //// console.log( profit/(1+temp), target.price/(1+target.cost),target.price,temp );
        if (Orders[e].amount > thresh && didTrade[Orders[e].id] === undefined)
            if (profit / (1 + temp) > target.price / (1 + target.cost)) {
                target.id = Orders[e].id;
                target.cost = temp;
                target.amount = Orders[e].amount;
                target.price = Orders[e].price;
                target.room = Orders[e].roomName;
            }
    }
    let trans = (Math.floor(eTotal / (1 + target.cost)));
    if (Game.shard.name === 'shard2') {
        if (trans < 2000) trans = 2000;
    }
    if (trans > target.amount) trans = target.amount;
    if (trans > maxEnergyTrans) trans = maxEnergyTrans;
    if (target.price < 0.01) {
        trans = trans * 0.5;
    }
    if (target.price > 0.001) {
        didTrade[target.id] = true;
        let whatHappened = marketRecordDeal(target.id, trans, targetRoom);
        //        console.log(roomLink(terminal.room.name), "Max Energy Trade", whatHappened, 'profit:', target.price * trans, '@', (target.price + target.cost) * trans, "/", trans, '(' + target.price + "/" + target.price / (1 + target.cost) + ')', 'EnergyCost', (target.price + target.cost));
        profitReport(terminal.room.name, "Max Energy Trade ", whatHappened, target.id, trans, 'E', target.price, target.room);
        if (whatHappened === OK) return true;
    }
    return false;

}

function anyLikeOrder(resource, roomName, orderType) {
    var prohibited = ['KO', 'GH', 'LO', 'UO', 'LH', 'G', 'OH', 'GO', 'GH2O', 'GHO2', 'XLH2O', 'XUH2O', 'XUHO2', 'XGH2O', 'XGHO2', 'XZH2O', 'XLHO2', 'XKHO2', 'XKH2O', 'XZHO2'];

    for (var a in prohibited) {
        if (resource == prohibited[a]) {
            return true;
        }
    }

    if (orderType === undefined) {
        orderType = ORDER_SELL;
    }

    let zz = _.filter(Game.market.orders, function(order) {
        return (order.resourceType == resource && order.type == orderType && (!roomName || order.roomName === roomName)); // If no roomname or order.roomName === roomName
    });
    if (zz.length > 0) {
        return true;
    }
    return false;
}



function sellValuableOrder() {
    // First lets find what I have most of
    let selling = ['power'];
    for (var e in selling) {
        //console.log('trying to sell?',selling[e],Memory.stats.totalMinerals[selling[e]] , maxMinAmount+100000 ,Memory.stats.totalMinerals[selling[e]] > (maxMinAmount+100000) );
        if (Memory.stats.totalMinerals[selling[e]] && Memory.stats.totalMinerals[selling[e]] > Memory.empireSettings.maxMineralAmount) { //maxT3MinAmount //173000
            let sellingPoint = getAverageMineralPrice(selling[e], false);
            var storage = getMostStorage(selling[e]);
            if (!storage) continue;
            var amount = storage.store[selling[e]] * 0.75;
            if (sellingPoint >= 0.50 && !anyLikeOrder(selling[e], storage.pos.roomName, ORDER_SELL)) {
                let whatHappened = Game.market.createOrder(ORDER_SELL, selling[e], sellingPoint, amount, storage.pos.roomName);
                profitReport(storage.pos.roomName, "SET SELL ORDER", whatHappened, null, amount, selling[e], sellingPoint, undefined);
                return true;
            }
        }
    }
}


function sellMineralOrder() {
    // First lets find what I have most of
    //var keys = Object.keys(Game.market.orders);
    //console.log(numOfOrders,"oider length");
    if (numOfOrders === 50) return false;

    let selling = ['K', 'U', 'Z', 'X', 'L', 'O', 'H', ];
    for (var e in selling) {
        //console.log('trying to sell?',selling[e],Memory.stats.totalMinerals[selling[e]] , maxMinAmount+100000 ,Memory.stats.totalMinerals[selling[e]] > (maxMinAmount+100000) );
        if (Memory.stats.totalMinerals[selling[e]] && Memory.stats.totalMinerals[selling[e]] > Memory.empireSettings.maxMineralAmount) { //maxT3MinAmount //173000
            let sellingPoint = getAverageMineralPrice(selling[e], false);
            var storage = getMostStorage(selling[e]);
            if (!storage) continue;
            var amount = storage.store[selling[e]] * 0.75;
            //            console.log( anyLikeOrder(selling[e], undefined, ORDER_SELL),"@!@@!SellMineral ORder seeing if undefined roomName works@@!@!@",selling[e] );
            if (sellingPoint >= 0.01 && !anyLikeOrder(selling[e], undefined, ORDER_SELL)) {
                let whatHappened = Game.market.createOrder(ORDER_SELL, selling[e], sellingPoint, amount, storage.pos.roomName);
                //console.log("is here?",sellingPoint,storage,whatHappened);
                //console.log(ORDER_SELL, selling[e], sellingPoint, amount, storage.pos.roomName);
                profitReport(storage.pos.roomName, "SET SELL ORDER", whatHappened, null, amount, selling[e], sellingPoint, undefined);
                return true;
            }
        }
    }
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

function getLeastStorage(mineral, target) {
    let lowest = 10000000;
    let bested;
    let e;
    mineral = mineral.toLowerCase();
    if (target === undefined) {
        e = s1LabRooms.length;
        while (e--) {
            let tmp = Game.rooms[s1LabRooms[e]].storedEnergy;
            if (tmp < lowest) {
                lowest = tmp;
                bested = Game.rooms[s1LabRooms[e]].terminal;
            }
        }
        return bested;

    } else {
        for (e in s1LabRooms) {
            if (target != s1LabRooms[e] && Game.rooms[s1LabRooms[e]].terminal.total !== 300000 && Game.rooms[s1LabRooms[e]].terminal._gotEnergy === undefined) {
                let tmp = Game.rooms[s1LabRooms[e]].terminal.total;
                if (tmp < lowest) {
                    lowest = tmp;
                    bested = Game.rooms[s1LabRooms[e]].terminal;
                }
            }
        }
        return bested;
    }
}


function getLeastTerminal(mineral, target) {
    let lowest = 10000000;
    let bested;
    let e;
    mineral = mineral.toLowerCase();
    if (target === undefined) {
        e = s1LabRooms.length;
        while (e--) {
            let tmp = Game.rooms[s1LabRooms[e]].terminal;
            if (tmp !== undefined && tmp.store[mineral] !== undefined && tmp.store[mineral] < lowest) {
                lowest = tmp.store[mineral];
                bested = tmp;
            }
        }
        return bested;

    } else {
        for (e in s1LabRooms) {
            if (target != s1LabRooms[e]) {
                let tmp = Game.rooms[s1LabRooms[e]].terminal;
                if (tmp.store[mineral] === undefined || tmp.store[mineral] < lowest) {
                    lowest = tmp.store[mineral];
                    bested = tmp;
                }
            }
        }
        return bested;
    }
}

function getMostStorage(mineral, target) {
    let highest = 0;
    var bested;
    var e;
    //    mineral = mineral.toLowerCase();
    if (target === undefined) {
        //      console.log('calling getmost');
        e = s1LabRooms.length;
        while (e--) {
            let tmp = Game.rooms[s1LabRooms[e]].storage;
            //            if(tmp !== undefined)
            //            console.log('doing most',highest,tmp,mineral,e,s1LabRooms[e]);
            if (tmp !== undefined && tmp.store[mineral] !== undefined && tmp.store[mineral] > highest) {
                highest = tmp.store[mineral];
                bested = tmp;
            }
        }
        return bested;

    } else {
        for (e in s1LabRooms) {
            if (target.id != s1LabRooms[e]) {
                let tmp = Game.rooms[s1LabRooms[e]].storage;
                if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest) {
                    highest = tmp.store[mineral];
                    bested = tmp;
                }
            }
        }
        return bested;
    }

}

function getMostTerminal(mineral, target) {
    let highest = 0;
    var bested;
    var e;
    mineral = mineral.toLowerCase();
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
/*
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

    var result = giver.recordSend(Debt.type, transferAmount, Debt.room, 'Debt@' + Debt.amount);

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
} */





function getAverageMineralPrice(resource, buy) {
    if (buy === undefined) buy = true;
    var amount;
    let zz = Game.market.getAllOrders({ type: (buy ? ORDER_BUY : ORDER_SELL), resourceType: resource });
    zz.sort((a, b) => a.price - b.price);
    zz.shift();
    zz.pop();
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
}

function getMinerals(terminal, needed) {
    for (var e in needed) {
        var wantedAmount = 5000;
        if (terminal.store[needed[e]] !== undefined && terminal.store[needed[e]] >= wantedAmount) continue;
        if (terminal.store[needed[e]]) {
            wantedAmount -= terminal.store[needed[e]];
        }
        if (wantedAmount < 100) continue;
        let result = requestMineral(terminal.room.name, needed[e], wantedAmount);
    }
}

function buyCheapEnergy() {
    let amount = Memory.empireSettings.cheapEnergyBuy.amount;
    let transferCostMax = amount * Memory.empireSettings.cheapEnergyBuy.transferPercent;
    let minCheapPrice = Memory.empireSettings.cheapEnergyBuy.maxPrice;
    let zz = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: RESOURCE_ENERGY });
    zz = _.filter(zz, function(o) {
        return o.price <= minCheapPrice;
    });
    if (zz.length > 0) {
        zz = _.sortBy(zz, function(o) {
            return o.price;
        });
        let target = zz[0];
        if(Game.room[zz[0].roomName])return;

        if (amount > zz[0].amount) {
            amount = zz[0].amount;
        }
        //target.roomName

        let closeRoom = 'E23S38';
        /*_.sortBy(s1LabRooms, function(o) {
                    return Game.market.calcTransactionCost(amount, o, target.roomName);
                }); */
        let cost = Game.market.calcTransactionCost(amount, closeRoom, target.roomName) * 0.5; // 0.05 for effected terminal

        if (cost < transferCostMax && Game.rooms[closeRoom].terminal.store[RESOURCE_ENERGY] >= cost) {
            let zed = Game.market.deal(target.id, amount, closeRoom);
            profitReport(closeRoom, "Buy Cheap Energy", zed, target.id, amount, RESOURCE_ENERGY, target.price, target.roomName);
        } else {
            console.log('Tried to do cheap eneryg, transfer cost too much', cost, "for amount:", amount, Game.rooms[closeRoom].terminal.store[RESOURCE_ENERGY]);
        }

    }

}

function reduceStorage(storage) {
    // first we get the most
    var min;
    var most = 5000;
    let amnt = 3600;

    for (var e in storage.store) {
        if (storage.store[e] > most && e !== RESOURCE_ENERGY  && storage.room.terminal.store[e] > 1000) {
            most = storage.store[e];
            min = e;
        }
    }
    if( storage.room.terminal.store[min] < amnt) amnt =  storage.room.terminal.store[min];
    if(!min) {
    	return;
    }
    var leastTerm = 10000000;
    var room;
/*    for (let ee in s1LabRooms) {
        if (s1LabRooms[ee] !== storage.room.name && !Game.rooms[s1LabRooms[ee]].terminal.nearFull && (Game.rooms[s1LabRooms[ee]].terminal.store[min] < 4900 || !Game.rooms[s1LabRooms[ee]].terminal.store[min])) {
            room = s1LabRooms[ee];
            break;
        }
    }
    if(!room){*/
            for (let ee in s1LabRooms) {
                if (Game.rooms[s1LabRooms[ee]].storage.total < leastTerm && s1LabRooms[ee] !== storage.room.name && !Game.rooms[s1LabRooms[ee]].terminal.nearFull) {
                    room = s1LabRooms[ee];
                    leastTerm = Game.rooms[s1LabRooms[ee]].storage.total;
                }
            }
//        }
  //  if (!room && !Game.rooms.E23S38.storage.almostFull) {
//        room = 'E23S38';
  //  }
    /*
    if (!Game.rooms.E23S38.storage.almostFull) { // This is a boosted room
        leastTerm = Game.rooms.E23S38.storage.total;
        room = 'E23S38';
    } else {
        if (min === RESOURCE_POWER) {
            leastTerm = 0;
            for (let ee in s1LabRooms) {
                if (Game.rooms[s1LabRooms[ee]].memory.energyIn && Game.rooms[s1LabRooms[ee]].storage.store[RESOURCE_ENERGY] > leastTerm && s1LabRooms[ee] !== storage.room.name && !Game.rooms[s1LabRooms[ee]].terminal.nearFull) {
                    room = s1LabRooms[ee];
                    leastTerm = Game.rooms[s1LabRooms[ee]].storage.total;
                }
            }
        } else {
        }
    }*/
    // then we get the terminal with the least
    if (room) {

//        amnt = amnt - Game.rooms[room].terminal.store[min];
        if (amnt < 100) amnt = 100;

        let rst = storage.room.terminal.recordSend(min, amnt, room, 'trade');

        profitReport(storage.room.name, "Full Storage Shuffle", rst, undefined, amnt, min, 0, room);

        return true;
    }
}

function doTrap(roomname) {
    let buyTrap = Game.rooms[roomname].memory.marketBuyTrap;
    if (buyTrap.length === 0) {
        Game.rooms[roomname].memory.trapCount = undefined;
        return;
    }
    if (Game.rooms[roomname].memory.trapCount === undefined) {
        Game.rooms[roomname].memory.trapCount = 0;
    }
    Game.rooms[roomname].memory.trapCount--;
    if (Game.rooms[roomname].memory.trapCount > 0) return;
    if (Game.rooms[roomname].terminal === undefined || Game.rooms[roomname].terminal.total > 290000) return;
    Game.rooms[roomname].memory.trapCount = 50;


    for (var e in buyTrap) {
        var trapPrice = 0.001;
        if (buyTrap[e] === RESOURCE_ENERGY) {
            trapPrice = 0.001;
        }

        //  var orders = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: buyTrap[e], price: trapPrice, roomName: roomname });
        var orders = _.filter(Game.market.orders, function(o) {
            return o.type === ORDER_BUY && o.resourceType === buyTrap[e] && (o.price === trapPrice || o.price === 0.005) && o.roomName === roomname;
        });
        //        console.log('drap test', orders.length, Neworders.length);
        if (orders.length === 0) {
            // console.log('TRAP BUY@', roomname, 'W:', buyTrap[e], Game.shard.name, orders.length);
            //So if no buy orders, we'll setup an real cheap buy order.
            var amount = 10000;
            if (buyTrap[e] === RESOURCE_ENERGY) amount = 100000;
            profitReport(roomname, "Setting Trap", Game.market.createOrder(ORDER_BUY, buyTrap[e], trapPrice, amount, roomname), undefined, amount, buyTrap[e], trapPrice, roomname);
        }
    }
}


function trackSegmentSharing() {
    if (Game.time % 100 !== 0) return;

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
            if (username || Memory.stats.playerTrade[username] === undefined) {
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
            if (username && username !== "likeafox") {
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
var failMineral;

function get4998(roomName) {
    let room = Game.rooms[roomName];
    let terminal = room.terminal;

    if (terminal.nearFull) return false;
    if (Game.shard.name !== 'shard1') return false;
    let totalAtLeastNeeds = (s1LabRooms.length * 2500);

    for (let i in terminal.store) {
        if (i !== RESOURCE_ENERGY && i !== RESOURCE_POWER && Memory.stats.totalMinerals[i] > totalAtLeastNeeds && room.storage && (!room.storage.store[i] || room.storage.store[i] === 0)) {
            let totalNeed = 4998;

            if (!terminal.store[i] || terminal.store[i] < totalNeed) {
                let need;
                if (!terminal.store[i]) {
                    need = 5000;
                } else {
                    need = totalNeed - terminal.store[i];
                    if (need < 100) need = 100;
                }
                if (findRoomThatHasExtra(i, need, roomName)) {
                    return true;
                }
            }
        }
    }
    return false;
}

function findRoomThatHasExtra(mineral, need, roomName) {
    let terminal = Game.rooms[roomName].terminal;
    if (terminal.nearFull) return false;
    for (var i in s1LabRooms) {
        if (s1LabRooms[i] !== roomName && Game.rooms[s1LabRooms[i]] && Game.rooms[s1LabRooms[i]].terminal && Game.rooms[s1LabRooms[i]].storage && Game.rooms[s1LabRooms[i]].terminal.cooldown === 0 &&
            !Game.rooms[s1LabRooms[i]].terminal._did5000) {
            let storage = Game.rooms[s1LabRooms[i]].storage;
            if (terminal.store[mineral] >= 5000 && storage.store[mineral] > need) {
                let result = terminal.recordSend(mineral, need, roomName, '5000');
                //                console.log(s1LabRooms[i], "Sending Result:", result, "Min:", mineral, "#", need, "too:", roomName);
                profitReport(s1LabRooms[i], "Request Mineral 4998", result, undefined, need, mineral, 0, roomName);

                Game.rooms[s1LabRooms[i]].terminal._did5000 = true;
                return true;
            }
        }
    }
    return false;
}

function requestMineral(targetRoom, mineral, amount) {
    if (failMineral === undefined) failMineral = {};
    let labRooms;
    switch (Game.shard.name) {
        case "shard0":
            labRooms = ['E38S72'];
            break;
        case "shard1":
            /*        labRooms = [];
                        roomsd = ['E21S49','E23S38'];  
            for(let i in roomsd){
                if(Game.rooms[roomsd[i]] && Game.rooms[roomsd[i]].terminal && Game.rooms[roomsd[i]].terminal.isEffected() && Game.rooms[roomsd[i]].terminal.store[mineral] > amount ){
                    labRooms.push(roomsd[i]);    
                } 
            }
            if(labRooms.length === 0){ */
            labRooms = s1LabRooms;
            //}

            break;
        case "shard2":
        case "shard3":
            labRooms = ['E19S49'];
            break;
    }
    if (!amount || amount < 100) amount = 100;
    if (amount > 10000) amount = 10000;

    if (failMineral[mineral] !== undefined) {
        return false;
    }


    for (var e in labRooms) {
        var term = Game.rooms[labRooms[e]].terminal;
        if (Game.rooms[labRooms[e]] !== undefined && labRooms[e] !== targetRoom && Game.rooms[labRooms[e]].terminal &&
            term.cooldown === 0 && term.store[mineral] !== undefined && term._didSend === undefined && (term.store[mineral] > amount || term.store[mineral] === 5000)) {
            if (mineral === RESOURCE_POWER) {
                let amt = term.store[RESOURCE_POWER] >> 1; // 0.5 *
                if (term.store[mineral] !== 5000) {
                    amt = 100;
                }
                var eng = term.store[RESOURCE_ENERGY] >> 1; // 0.5 * energy - make sure enough energy to transfer.
                if (amt > eng) {
                    amt = eng;
                }

                let sentResult = term.recordSend(mineral, amt, targetRoom, 'tradezz');
                profitReport(labRooms[e], "Request Power", sentResult, undefined, amt, mineral, 0, targetRoom);
                if (sentResult === OK) {
                    term._didSend = true;
                    return sentResult;
                }

            } else {
                if (_.contains(labs.prohibitedMinerals(labRooms[e]), mineral)) {
                    if (term.store[mineral] > 1000) {
                        amount = term.store[mineral] >> 1;
                    } else {
                        continue;
                    }
                }
                if (amount === undefined) {
                    amount = term.store[mineral] - 1;
                    if (amount > 3000) {
                        amount = amount >> 2;
                    }
                    if (amount < 100) amount = 100;
                }

                let msg;
                if (amount === 101) {
                    msg = 'segmentTransactions';
                }

                let sentResult = term.recordSend(mineral, amount, targetRoom, msg);
                if (!Game.rooms[targetRoom]) {
                    // This means it's not our rooms, so no profit report.
                } else if (mineral === RESOURCE_ENERGY) {
                    profitReport(labRooms[e], "Request Energy", sentResult, undefined, amount, mineral, 0, targetRoom);
                } else {
                    profitReport(labRooms[e], "Request Mineral", sentResult, undefined, amount, mineral, 0, targetRoom);
                }
                if (sentResult === OK) {
                    term._didSend = true;
                    return sentResult;
                } else {
                    return;
                }
            }
        }
    }
    failMineral[mineral] = false;
    //    profitReport(targetRoom, "FAILED Request Mineral", undefined, undefined, 0, mineral, 0, targetRoom);
    return false;
}

var energyAverage;

function getEnergyAverage() {
    if (!energyAverage) {
        var amount;
        let zz = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: RESOURCE_ENERGY });
        zz = _.filter(zz, function(o) {
            return o.amount > 1000;
        });

        zz.sort((a, b) => a.price - b.price);
        zz.shift();
        zz.pop();
        let bb = 0;

        if (zz[zz.length - 1] !== undefined)
            bb += zz[zz.length - 1].price;
        if (zz[zz.length - 2] !== undefined)
            bb += zz[zz.length - 2].price;
        if (zz[zz.length - 3] !== undefined)
            bb += zz[zz.length - 3].price;
        if (zz[zz.length - 4] !== undefined)
            bb += zz[zz.length - 4].price;

        energyAverage = (bb / 4);
    }
    return energyAverage;
}

function cheapEnergy() {
    if (numOfOrders.length === 50) return;
    if (Game.time % 50000 !== 0) return; // SEt high atm so we let the market settle from our interferance

    let energyAve = getEnergyAverage();
    if (energyAve > 0.05) return;
    let sortedStorage = _.sortBy(s1LabRooms, function(n) {

        if (Game.rooms[n] && Game.rooms[n].storage) {
            return Game.rooms[n].storage.total;
        } else {
            console.log(n, Game.rooms[n]);
        }

    });
    let targetRoom = Game.rooms[sortedStorage[0]];
    let roomName = sortedStorage[0];
    let storage = targetRoom.storage;
    let amnt = 995000 - storage.total;
    if (amnt < 50000) return;

    let likeOrder = anyLikeOrder(RESOURCE_ENERGY, roomName, ORDER_BUY);
    console.log(sortedStorage[0], "least", Game.rooms[sortedStorage[0]].storage.total, likeOrder, energyAve);
    if (!likeOrder) {
        let rst = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, energyAve, amnt, roomName);
        console.log(rst, roomName, "has cheap energy created buy order @", ORDER_BUY, RESOURCE_ENERGY, energyAve, amnt, roomName);

    }

}

class roleTerminal {
    /*
        static getAveragePrice(e, isBuy) {
            return getAverageMineralPrice(e, isBuy);
        }*/

    static sendMineralFromTerminal(terminal, min) {
        var leastTerm = 300000;
        var room;
        for (var ee in s1LabRooms) {
            if (!Game.rooms[s1LabRooms[ee]].storage.store[min] || (Game.rooms[s1LabRooms[ee]].terminal.total < leastTerm && s1LabRooms[ee] !== terminal.room.name)) {
                room = s1LabRooms[ee];
                leastTerm = Game.rooms[s1LabRooms[ee]].terminal.total;
            }
        }
        // then we get the terminal with the least
        console.log('Terminal:', terminal.room.name, "getting rid of" + min + " to: ", roomLink(room));
        if (min === undefined || room === undefined) return false;
        terminal.recordSend(min, 2000, room, 'trade');
        return true;

    }

    static getRoomMostMineral(mineral) {
        let most = 0;
        let mostRoom;
        for (var e in s1LabRooms) {
            if (Game.rooms[s1LabRooms[e]] !== undefined) {
                var storage = Game.rooms[s1LabRooms[e]].storage;
                var term = Game.rooms[s1LabRooms[e]].terminal;
                if (storage !== undefined) {
                    let needed = labs.prohibitedMinerals(storage.pos.roomName);
                    if (term.cooldown === 0 && storage.store[mineral] !== undefined && storage.store[mineral] > most && !_.contains(needed, mineral)) {
                        most = term.store[mineral];
                        mostRoom = s1LabRooms[e];
                    }
                    if (term.cooldown === 0 && storage.store[mineral] !== undefined && storage.store[mineral] > most && _.contains(needed, mineral) && storage.store[mineral] > 10000) {
                        most = term.store[mineral];
                        mostRoom = s1LabRooms[e];
                    }

                } else if (term !== undefined) {
                    let needed = labs.prohibitedMinerals(term.pos.roomName);
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
        return requestMineral(targetRoom, mineral, amount);
    }

    static offShardTerminalRun(roomName) {
        // Satalite room for the main room, these are only on shard0/1 .
        var main;
        if (Game.shard.name === 'shard2') main = 'E19S49';
        if (Game.shard.name === 'shard3') main = 'E19S49';
        if (Game.shard.name === 'shard0') main = 'E38S72';
        let terminal = Game.rooms[roomName].terminal;
        if (terminal === undefined) return;
        if (terminal.store[RESOURCE_ENERGY] < 75000 && Game.rooms[roomName].storage.store[RESOURCE_ENERGY] < 1000) {
            if (!anyLikeOrder(RESOURCE_ENERGY, roomName, ORDER_BUY)) {
                var space = (Game.rooms[roomName].storage.storeCapacity - Game.rooms[roomName].storage.total) - 1000;
                let max = _.max(Game.market.getAllOrders({ type: ORDER_BUY, resourceType: 'energy' }), a => a.price);
                if (max.price < 0.05) {
                    let res = Game.market.createOrder(ORDER_BUY, 'energy', max.price, space, "E38S72");
                    Game.notify(main + "@" + Game.shard.name, "Created low energy order " + res);
                }

            }
        }

        if (roomName === main) {
            doTrap(roomName);
            if (terminal.nearFull && Game.rooms[roomName].storage.nearFull) {
                maxEnergyTrade(Game.rooms[roomName].terminal);
                return;
            }
            return;
        } else {
            if (Game.rooms[main].terminal && Game.rooms[main].terminal.full && !Game.rooms[roomName].terminal.full) {
                let amt;
                if (Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 20000) {
                    amt = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] - 20000;
                } else {
                    amt = Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] >> 1;
                }
                Game.rooms[main].terminal.recordSend('energy', amt, roomName);
                return;
            }

            if (Game.rooms[roomName].terminal.full && Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 5000) {
                Game.rooms[roomName].terminal.recordSend('energy', 5000, main);
                return;
            }
            if (Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] > 22000 && Game.rooms[main].terminal.store[RESOURCE_ENERGY] < 20000) {
                Game.rooms[roomName].terminal.recordSend('energy', 20000, main);
                return;
            }
        }

    }


    static runSimple(roomName) {

        if (Game.rooms[roomName].memory.marketTrap !== undefined) {
            Game.rooms[roomName].memory.marketTrap = undefined;
        }
        if (Game.rooms[roomName].memory.marketBuyTrap === undefined) {
            Game.rooms[roomName].memory.marketBuyTrap = [];
        }
        if (Game.rooms[roomName].memory.marketSellTrap !== undefined) {
            Game.rooms[roomName].memory.marketSellTrap = undefined;
        }
        if (Game.rooms[roomName].controller.level < 6) return;
        let terminal = Game.rooms[roomName].terminal;
        let storage = Game.rooms[roomName].storage;
        if (terminal.cooldown > 0) return;
        if (terminal === undefined) return;
        if (roomName === 'E59S51') return;

        if (!_.contains(s1LabRooms, roomName) && Game.rooms[roomName].controller.owner !== undefined && Game.rooms[roomName].controller.owner.username === 'likeafox') {
            s1LabRooms.push(roomName);
        }
        var energy = terminal.store[RESOURCE_ENERGY];
        var total = terminal.total;

        doTrap(roomName);

        if ((storage.full || storage.store[RESOURCE_ENERGY] < 10000 || (Game.rooms[roomName].controller.level < 8) && storage.store[RESOURCE_ENERGY] < 100000)) {
            if (terminal.store[RESOURCE_ENERGY] < 75000) {
                requestMineral(roomName, RESOURCE_ENERGY, 10000);
            }
            let energyAve = getEnergyAverage();
            let max;
            if (!Game.rooms[roomName].memory.energyIn) {
                max = 995000;
            } else {
                max = 1000000;
            }
            let amnt = max - storage.total;
            if (!anyLikeOrder(RESOURCE_ENERGY, roomName, ORDER_BUY) && amnt > 0) {
                let rst = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, energyAve, amnt, roomName);
                console.log(rst, roomName, "has low energy created buy order @", energyAve, amnt);
            }
        }


        if (Game.flags.focusEnergy !== undefined && Game.rooms[roomName].memory.energyIn) {
            let nFocus = Game.flags.focusEnergy;
            if (!nFocus.room.storage._did && energy > 20000 && nFocus.room.storage.store[RESOURCE_ENERGY] < 850000 && nFocus.room.terminal.total < 275000) {
                let edd = terminal.recordSend(RESOURCE_ENERGY, 25000, Game.flags.focusEnergy.pos.roomName, 'Sharing Energy');
                nFocus.room.storage._did = true;
                console.log('FocusEnergy Flag up, ', edd, ':roomName sending 25000');
                return;
            }
        }
        //        let didShareMin = false;
        let didShareEne = false;
        //        if (Game.time % 300 === 0 && get4998(roomName)) return; // This requests minerals from others to fill 4998 amount.

        if (Game.rooms[roomName].storage.nearFull) { //!Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] || 
            if (Game.rooms[roomName].storage.store[RESOURCE_ENERGY] < 75000 || !Game.rooms[roomName].memory.energyIn) {
                if (reduceStorage(Game.rooms[roomName].storage)) {
                    return;
                }
            }
        } else if (Game.rooms[roomName].storage.nearFull && Game.rooms[roomName].terminal.nearFull) {
            if (reduceStorage(Game.rooms[roomName].storage)) {
                return;
            }
        }

        if (Game.rooms[roomName].memory.energyIn && Game.rooms[roomName].storage.almostFull && Game.rooms[roomName].terminal.store[RESOURCE_ENERGY] >= 75000) {
                if (!shareEnergy(terminal)) {
                    maxEnergyTrade(terminal);
                }
        }
        if (Game.rooms[roomName].storage.full && Game.rooms[roomName].terminal.full) {
            if (maxEnergyTrade(terminal)) {
                return true;
            }
        }

        if (roomName === 'E21S49') {
            let prohibited = [
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
            getMinerals(terminal, prohibited);
        } else if (roomName === 'E23S38') {
            let prohibited = [
                'H', 'O', 'L', 'U', 'Z', 'K', 'X',
            ];
            getMinerals(terminal, prohibited);
        }
    }

    /** @param {Creep} creep **/
    static run() { // Already run at time%10
        didNewTradeEnergy = undefined;
        didTrade = {};
        stopTemple = undefined;
        numOfOrders = Object.keys(Game.market.orders).length;
        Memory.empireRoomNumber = s1LabRooms.length;

        if (Game.time % 500 === 0) {
            cleanUpOrders();
            adjustOldPrices();
        }
        //        trackSegmentSharing();
        failMineral = undefined;
        switch (Game.shard.name) {
            case 'shard0':
                return;
            case 'shard1':

                cheapEnergy();

                /*
                let roomName = 'E14S38';
                if (Game.time % 500 === 0 && Game.rooms[roomName].controller.level > 5) {
                    
                    let energyAve = getEnergyAverage();
                    if (energyAve <= 0.005) {
                        if (energyAve > 0.001) {
                            energyAve -= 0.001;
                        }
                        let max = 995000;
                        if (!Game.rooms[roomName].storage.nearFull) {
                            if (!anyLikeOrder(RESOURCE_ENERGY, roomName, ORDER_BUY)) {
                                let amnt = max - Game.rooms[roomName].storage.total;
                                let rst = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, energyAve, amnt, roomName);
                                console.log(rst, roomName, "Created buy order for temple.@", energyAve, amnt);
                            }
                        }
                    }
                }
                if (Game.rooms.E14S38.controller.level > 5) {
                    if (!Game.rooms.E14S38.terminal.store.XGH2O || Game.rooms.E14S38.terminal.store.XGH2O < amount) {
                        if (Game.rooms.E14S38.terminal.store.XGH2O && Game.rooms.E14S38.terminal.store.XGH2O < amount) {
                            amount -= Game.rooms.E14S38.terminal.store.XGH2O;
                        }
                        roomRequestMineral('E14S38', 'XGH2O', amount);
                    }
                } else
                if (Game.rooms.E59S51.controller.level > 5) {
                    if (!Game.rooms.E59S51.terminal.store.XGH2O || Game.rooms.E59S51.terminal.stre.XGH2O < amount) {
                        if (Game.rooms.E59S51.terminal.store.XGH2O && Game.rooms.E59S51.terminal.store.XGH2O < amount) {
                            amount -= Game.rooms.E59S51.terminal.store.XGH2O;
                        }
                        roomRequestMineral('E59S51', 'XGH2O', amount);
                    }
                }

                */


                if (Game.time % 100 === 0) {
                    Memory.stats.totalMinerals = countTerminals();
                    s1LabRooms = _.shuffle(s1LabRooms);
                    buyCheapEnergy();

                }
                if (Game.time % 1000 === 0) {
                    sellMin('E23S38', 0.02, 900000);
                    if (Memory.empireSettings.market.token) {
                        tokenMarket();
                    }
                }

                if (Memory.empireSettings.market.basic) {
                    sellMineralOrder();
                }
                let amount = 10000;
                return;
            case 'shard2':
                return;
            case 'shard3':
                sellMin('E19S49');
                return;
        }

        energyAverage = undefined;

    }


}
module.exports = roleTerminal;