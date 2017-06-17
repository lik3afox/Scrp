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
var terminals = ['58b0bd65ad252479508f2eab', '58b31b469e8b37461c88d6f3', '58e174a1be34d67531319d7f', '58e2633bd12e106302dce492',
    '58b1cbbd08b3b7bd61139e14', '594040ae3058b1431a1d2629', '58bb4e55942e459e3151f9b6', '58bf37b77dfb1e2f42591b87', '58bfb95f87bda510020bb080', '58c48f1b119a7dfa3b53525d',
    '58f81a437684166367608336', '5902420f523e1c2d5ca6114a', '591365a95128141e7200c235', '592c8d47cc8d322372c51e45'
];

// If you need to focus all minerals somewhere change it here.
var focusID; // = '591365a95128141e7200c235';
var focusMin; // = 'XGH2O'

// Every terminal needs this amount or else...
var required = [{ resource: RESOURCE_POWER, amount: 100 }, { resource: 'G', amount: 500 }];

// This is when you cannot change.
var prohibited = ['KO', 'GH', 'LO', 'UO', 'LH', 'H', 'G', 'OH', 'GO', 'GH2O', 'GHO2', 'XLH2O', 'XUH2O', 'XUHO2', 'XGH2O', 'XGHO2', 'XZH2O', 'XLHO2', 'XKHO2', 'XKH2O', 'XZHO2'];

var maxEnergyTrans = 5000;

function focusMinerals(targetID, mineral) {
    if (targetID === undefined) return;
    if (mineral === undefined) return;
    let target = Game.getObjectById(targetID);
    if (target === null) return;
    for (var e in terminals) {
        let term = Game.getObjectById(terminals[e]);
        if (term !== null && term.store[mineral] > 1) {
            term.send(mineral, term.store[mineral] - 1, target.room.name, 'focus Trade');
        }
    }
}

function focusEnergy(terminal) {
    if (terminal.room.controller.level === 8 || terminal.room.name == 'E27S75') return false;
    if (terminal.store[RESOURCE_ENERGY] > 10000) return false;

    var highestEnergy;
    var currentHigh = 0;
    for (var e in terminals) {
        let storage = Game.getObjectById(terminals[e]);
        if (storage.store[RESOURCE_ENERGY] > currentHigh && terminal.room.name != storage.room.name) {
            highestEnergy = Game.getObjectById(terminals[e]);
            currentHigh = storage.store[RESOURCE_ENERGY];
        }
    }
    let amount = currentHigh * 0.25;
    console.log(highestEnergy, currentHigh, RESOURCE_ENERGY, amount, terminal.room.name);
    let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
    console.log('FOCUS terminal', terminal.room, 'gets' + amount + ' energy', highestEnergy.room, 'result:', zz);

}

function countTerminals() {
    let data = {};
    for (var b in basic) {
        let info = { type: basic[b], amount: 0 };
        for (var e in terminals) {
            let target = Game.getObjectById(terminals[e]);
            if (target.store[basic[b]] > 0) {
                info.amount += target.store[basic[b]];
            }
        }
        //if(data[basic[b]] == undefined) data[basic[b]]= 0;
        data[basic[b]] = info.amount;
        //console.log(basic[b],info.amount);
        //  data.push(info);
    }
    //  console.log(data['KH'],"Terminal Count");
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

function shareEnergy(terminal) {
    // Lets check here in all the storages to see if that room's storage level is at.

    var lowestStore;
    var currentLow = 1000000;
    for (var e in terminals) {
        let storage = Game.getObjectById(terminals[e]).room.storage;
        if (storage.store[RESOURCE_ENERGY] < 800000) {
            if (storage.store[RESOURCE_ENERGY] < currentLow) {
                lowestStore = storage;
                currentLow = storage.store[RESOURCE_ENERGY];
            }
        }
    }
    if (lowestStore === undefined) return false;


    let amount = lowestStore.store[RESOURCE_ENERGY] * 0.1;
    let zz = terminal.send(RESOURCE_ENERGY, amount, lowestStore.room.name, 'Sharing Energy');
    console.log(terminal.pos, "sHaring energy to", lowestStore.room.name, ":", amount, zz);
    return true;


}

function needEnergy(terminal) {
    //   console(terminal.room.storage.store[RESOURCE_ENERGY]);
    if (terminal.room.name == 'E33S76') return;

    if (terminal.room.storage.store[RESOURCE_ENERGY] < 100000) {
        if (!anyLikeOrder(RESOURCE_ENERGY, terminal.room.name)) {
            let qq = Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 1000000, terminal.room.name);
            console.log(ORDER_BUY, RESOURCE_ENERGY, 1000000, 0.01, terminal.room.name, '');
        } else {

            var highestEnergy;
            var currentHigh = 0;
            for (var e in terminals) {
                let storage = Game.getObjectById(terminals[e]);
                if (storage.store[RESOURCE_ENERGY] > currentHigh && terminal.room.name != storage.room.name) {
                    highestEnergy = Game.getObjectById(terminals[e]);
                    currentHigh = storage.store[RESOURCE_ENERGY];
                }
            }
            let amount = currentHigh * 0.25;
            console.log(highestEnergy, currentHigh, RESOURCE_ENERGY, amount, terminal.room.name);
            let zz = highestEnergy.send(RESOURCE_ENERGY, amount, terminal.room.name, 'Emergency');
            console.log('This terminal', terminal.room, 'gets' + amount + ' energy', highestEnergy.room, 'result:', zz);
            //    console.log('this room has Order for it');
        }

    }

    if (terminal.room.terminal.store[RESOURCE_POWER] > 45000) {

        let amount = getAverageMineralPrice(RESOURCE_POWER, false);
        if (amount !== undefined) {
            if (!anyLikeOrder(RESOURCE_POWER, terminal.room.name)) {
                let qq = Game.market.createOrder(ORDER_SELL, RESOURCE_POWER, amount, 40000, terminal.room.name);
                console.log(ORDER_SELL, RESOURCE_POWER, amount, 45000, terminal.room.name, 'current average price for power', qq);
            }
        }
    }
}

function tradeEnergy(terminal) {

    // Below here we're selling energy.

    let eTotal = terminal.store[RESOURCE_ENERGY];
    let targetRoom = terminal.pos.roomName;
    if (Memory.termReport) console.log(terminal, 'has ', eTotal, targetRoom);
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
    console.log(whatHappened, 'profit:', target.price * trans, '#', trans, 'EnergyCost', (target.price + target.cost), (target.price + target.cost) * trans, 'Profit per Energy', target.price / (1 + target.cost));

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
    console.log(line, 'per', amount, total, profitLine);
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
        if (Memory.termReport) console.log(order.resourceType, resource, order.roomName, room, sellingPoint, order.price);
        if (order.resourceType == resource && order.roomName == room && sellingPoint == order.price) return true;
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



function tradeMineral(terminal) {
    // First lets find what I have most of
    let target = { resource: undefined, amount: 0 };

    let total = 0;

    for (var e in terminal.store) {
        if (e != RESOURCE_ENERGY) {
            total += terminal.store[e];
            if (terminal.store[e] > target.amount && !anyLikeOrder(e, terminal.pos.roomName)) {
                target.resource = e;
                target.amount = terminal.store[e];
            }
        }
    }
    if (total < 150000) return;

    let Orders = Game.market.getAllOrders({ type: ORDER_SELL, resourceType: target.resource });
    let sellingPoint = 1000;
    for (var o in Orders) {
        if (Orders[o].price < sellingPoint) {
            sellingPoint = Orders[o].price;
        }
    }
    console.log(ORDER_SELL, target.resource, sellingPoint, Math.floor((target.amount * 0.1)), terminal.pos.roomName, orderExist(target.resource, terminal.pos.roomName, sellingPoint));

    if (sellingPoint <= 0.01) return;
    if (orderExist(target.resource, terminal.pos.roomName, sellingPoint)) return;
    let whatHappened = Game.market.createOrder(ORDER_SELL, target.resource, sellingPoint, Math.floor((target.amount * 0.05)), terminal.pos.roomName);
    //if(Memory.termReport )
    console.log('Made order for minerals:', target.resource, target.amount, sellingPoint, whatHappened);
    // then find what the lowest sell order is
    // Then set it to that price. 
    // 
}

function cleanUpOrders() {
    if (Game.market.orders.length === 0) return;
    for (var e in Game.market.orders) {
        let order = Game.market.orders[e];
        if (!order.active && Game.time - order.created > 50000 && order.remainingAmount === 0) {
            Game.market.cancelOrder(order.id);

        }
    }
}

function giveMinerals(terminal, mineral, amount) {

    // First lets find the terminal with the highest of wanted minerals.
    //console.log('trying to send minerls');
    let target;
    let highest = 0;

    for (var e in terminals) {
        if (terminal.id != terminals[e]) {
            let tmp = Game.getObjectById(terminals[e]);
            if (tmp.store[mineral] !== undefined && tmp.store[mineral] > highest && tmp.room.controller.level > 5) {
                highest = tmp.store[mineral];
                target = tmp;
            }
        }
    }

    //              let sentResult = target.send(mineral, amount, targetRoom, '1zz');               
    //if(true)              console.log('Sending Minerals:',target.pos.roomName,mineral,amount, 'azz');
    if (target !== null) {
        let sender = target.pos.roomName;
        if (target.store[mineral] < 100) return;
        if (amount === undefined) {
            amount = Math.floor(target.store[mineral] * 0.15);
        }
        //                  if(amount < 90) return;
        //              console.log(terminal,target.store[mineral],target.pos.roomName);
        let targetRoom = terminal.pos.roomName;
        let sentResult = target.send(mineral, amount, targetRoom, 'tradezz');
        if (sentResult == OK) {
            terminal.room.memory.didOrder = true;
        }
        //              console.log('Sending Minerals:',sender,mineral,amount,targetRoom, sentResult);
        if (sentResult === 0) {
            return;
        }
    }

    //          if(Memory.termReport )console.log(mineral,'no one has');
}

function energyCheck(terminal) {
    if (terminal.store[RESOURCE_ENERGY] > 20000) return false;
    if (terminal.total < 299000) return false;
    console.log(terminal, 'in', terminal.pos, 'has less than 20000 energy');
    let mostMineral;
    let most = 0;
    for (var e in terminal.store) {
        if (terminal.store[e] > most) {
            mostMineral = e;
            most = terminal.store[e];
        }
    }

    let zz = Game.market.getAllOrders({ type: ORDER_BUY, resourceType: e });
    zz.sort((a, b) => a.price - b.price);

    //let bb = Game.market.deal(zz[0].id, 100, terminal.room.name);
    console.log('Sold 100 mineral', mostMineral, zz[0].price * 100);
    //Game.market.deal('57cd2b12cda69a004ae223a3', 1000, "W1N1");   

    return false;
}

function sendEnergy(terminal) {

    target = Memory.terminalTarget;
    let energyAmount = terminal.store[RESOURCE_ENERGY] * 0.1;
    if (Memory.termReport) console.log(terminal.pos, 'sending Energy', target, 'For:', energyAmount);
    if (terminal.send(RESOURCE_ENERGY, energyAmount, target, 'Etransfer') == OK) {
        terminal.room.memory.didOrder = true;
        return;
    }

    for (var e in terminals) {
        let zzterminal = Game.getObjectById(terminals[e]);
        if (zzterminal.room.storage.store[RESOURCE_ENERGY] < 200000) {
            let energyAmount = terminal.store[RESOURCE_ENERGY] * 0.1;
            terminal.send(RESOURCE_ENERGY, energyAmount, zzterminal.room.name, 'upkeep');
        }
    }

    return true;
}

function getMinerals(terminal, needed) {
    for (var e in needed) {
        if ((needed[e] != 'none' && needed[e] != 'flex') && (terminal.store[needed[e]] === undefined || terminal.store[needed[e]] === 0)) {
            console.log('getting minerals', terminal, needed[e]);
            giveMinerals(terminal, needed[e]);
        }
    }
}

function getAverageMineralPrice(resource, buy) {
    if (buy === undefined) buy = true;
    console.log((buy ? "buy" : "sell"), buy, (false ? "buy" : "sell"));
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
        bb += zz[zz.length - 1].price;
        bb += zz[zz.length - 2].price;
        bb += zz[zz.length - 3].price;
        bb += zz[zz.length - 4].price;
    } else {
        bb += zz[1].price;
        bb += zz[2].price;
        bb += zz[3].price;
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
            console.log(amount, anyLikeOrder(e, "E28S71"), e);
            if (amount !== undefined && !anyLikeOrder(e, "E28S71")) {
                let qq = Game.market.createOrder(ORDER_BUY, e, amount, 50000, "E28S71");
                console.log('Created Buy Order for ', e, 'amount:', amount, qq);
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
class roleTerminal {

    /** @param {Creep} creep **/
    static run() {

        //console.log( checkEnergyProfit(10,.02,1000) );

        focusMinerals(focusID, focusMin);

        makeMineralOrder();
        cleanUpOrders();
        Memory.stats.totalMinerals = countTerminals(); // reportTerminals(); 

        //            Memory.termRun = 10;
        for (var e in terminals) {
            let terminal = Game.getObjectById(terminals[e]);
            focusEnergy(terminal);
            forEveryTerminal(terminal);
            terminal.room.memory.didOrder = false;
            let needed = labs.neededMinerals(terminal.pos.roomName);
            getMinerals(terminal, needed);
            if (terminal.room.memory.powerSpawnID === undefined) {
                let zz = terminal.room.find(FIND_STRUCTURES);
                zz = _.filter(zz, function(o) {
                    return o.structureType == STRUCTURE_POWER_SPAWN;
                });
                if (zz.length === 0) {
                    //      doit = false;
                } else {
                    terminal.room.memory.powerSpawnID = zz[0].id;
                }
            }


            let zz = terminal.total;

            needEnergy(terminal);

            if (zz > 299000 && terminal.room.name != 'E33S76') {
                if (!energyCheck(terminal)) { // See if anyone is full but has less than 20k energy : fulfilles ORDER_BUY's
                    if (!shareEnergy(terminal)) { // Moves energy around
                        if (Memory.terminalTarget !== undefined && Memory.terminalTarget != 'none') {
                            if (!sendEnergy(terminal)) { // Send energy to a target
                                tradeEnergy(terminal);
                            }
                        }
                    }
                    tradeEnergy(terminal);
                    tradeMineral(terminal);
                }
            }
        }
    }


}
module.exports = roleTerminal;
