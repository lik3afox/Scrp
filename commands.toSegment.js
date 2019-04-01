// decay 25
var shards = ['shard0', 'shard1', 'shard2', 'shard3'];
const timer = 128;
var roomSegment = {
    // Shard0 
    E38S72: 10,

    // Shard1
    E23S38: 10,
    E25S37: 11,
    E24S33: 12,
    E55S58: 13,
    E18S32: 13,
    E28S37: 14,
    E25S27: 15,
    E14S43: 24,
    E18S36: 16,
    E33S54: 16,

    E17S45: 17,
    E52S59: 25,

    E14S47: 18,
    E23S42: 19,
    E14S37: 19,
    E28S42: 20,
    E29S48: 20,
    E25S43: 21,
    E25S47: 28,
    E58S57: 23,
    E52S57: 22,
    E22S48: 25,
    E27S45: 26,
    E18S46: 27,
    W53S35: 29,

    // Shard 2
    E19S49: 10,

};



//var interShardData;

function getShardRoom2(shard) {
    switch (shard) {
        case 'shard1':
            return 'E24S33';
        case 'shard2':
        case 'shard3':
            return 'E19S49';
        default:
            return 'E24S33';
    }
}

function makeRequestString() {

    var rtrn = {
        basicTrading: {
            room: getShardRoom2(Game.shard.name),
            energy: false,
            H: false,
            O: false,
            X: false,
            U: false,
            L: false,
            Z: false,
            K: false,
        },
        /*
        mineralRequest:{
            room: getShardRoom2(Game.shard.name),
            mineralType: null,
            amount: 0,
        }*/
        /*
    resourceRequest: {
        room: 'E23S38',
        resourceType: 'X',
        amount: 1000,
    },         */
        dangerRoom: {
            challenger: 'none',
            parts: 0,
        },
    };
    if (Game.flags.request) {
        rtrn.dangerRoom.challenger = Game.flags.request.memory.challenger;
        rtrn.dangerRoom.parts = Game.flags.request.memory.parts;
        //	if(rtrn.dangerRoom.challenger){
        //    		console.log('You have requested a fight again: ',rtrn.dangerRoom.challenger,rtrn.dangerRoom.parts);
        //  	}
    }

    for (var e in rtrn.basicTrading) {
        if (e !== 'room' && e !== 'energy') {
            if (Memory.stats.totalMinerals[e] < 100000) {
                rtrn.basicTrading[e] = true;
            }
        }
    }
    /*
    let lookFor = ['X'];
    for(let i in lookFor){
        if(Memory.stats.totalMinerals[lookFor[i]] < 150000){

        }
    }*/

    return JSON.stringify(rtrn);
}

function setMyPublicSegment(array) {
    if (!_.isArray(array)) {
        array = [array];
    }
    RawMemory.setPublicSegments(array);
    for (var e in array) {
        if (RawMemory.segments[array[e]] === undefined) {
            // Make request for segment if it's not available now. 
            // likeafox code here.
            if (_.isNumber(array[e]))
                Memory.shardNeed.push(array[e]);
        } else {
            RawMemory.segments[array[e]] = makeRequestString();
        }
    }
}
var notSeen;



function dangerRoomSetup(player, dangerRequest) {
    let flag = Game.flags.dangerRoom;
    if (flag.memory.rallyCreateCount > 10) flag.memory.rallyCreateCount = 10;
    flag.memory.party = [];
    if (dangerRequest.challenger === 'likeafox') { // && flag.memory.challenger !== player

        console.log(player, "requesting fight for", dangerRequest.challenger, "parts:", dangerRequest.parts);
        // we send out the bard when we get a challenger.
        if (Game.flags.bard && dangerRequest.parts !== 1) {
            if (Game.flags.bard.color === COLOR_WHITE) {
                Game.notify(player+" requesting fight for "+ dangerRequest.challenger +" parts:" + dangerRequest.parts + " Time:"+Game.time);
            	Game.flags.bard.memory.rallyCreateCount = 0;
                Game.flags.bard.memory.setColor = {
                    color: COLOR_YELLOW,
                    secondaryColor: COLOR_YELLOW,
                };
                Game.flags.bard.setColor(COLOR_YELLOW,COLOR_YELLOW);
            }
        }
        // set up flag memory:
        flag.memory.challenger = player;
        flag.memory.delaySpawn = 0;

        // Figure out what kind of fight I want to send:
        switch (dangerRequest.parts) {
            case 0:
            case 1:
                flag.memory.party.push(['thief', 1, 5]);
            break;
            case 44:
                flag.memory.party.push(['mage', 4, 0]);
            break;
            case 40:
                flag.memory.party.push(['mage', 4, 1]);
                flag.memory.squadLogic = true;
                break;
            case 50:
                flag.memory.squadLogic = false;
                flag.memory.party.push(['harass', 1, 5]);
            break;
            case 100:
                flag.memory.squadLogic = false;
                flag.memory.party.push(['harass', 2, 5]);
            break;
            case 200:
                flag.memory.squadLogic = true;
                flag.memory.party.push(['mage', 4, 5]);
            break;
            default:
                flag.memory.squadLogic = true;
                flag.memory.party.push(['mage', 4, 0]);
                break;
        }

    }

}

function siegeRequest(siegeRequest) {

}

function analyzeOtherPlayerSegment(alliedList) {
    if (Game.time % 10 !== 0) return;
    //    if (Game.shard.name !== 'shard1') return;
    // Reason this is an array instead of object, is that it's easy to use the keys in an array across multiple ticks.


    if (Memory.otherPlayerSegmentCount === undefined || Memory.otherPlayerSegmentCount >= alliedList.length) {
        Memory.otherPlayerSegmentCount = 0;
    }


    // This will get the object of the player segement. 
    var obj = require('commands.toSegment').getObjectPlayerSegment(alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);

    // Appectable array is the resources you are willing to trade out.
    var acceptable;
    var acceptNum;
    var amount = 101;
    var doMineralRequest;

    if (obj !== undefined) {
        let playerSeg = alliedList[Memory.otherPlayerSegmentCount][0];
        doMineralRequest = false;
        switch (playerSeg) {
            case 'admon':
                acceptNum = 90000;
                amount = 101;
                doMineralRequest = true;
                acceptable = [ 'X', 'O', 'H', 'L', 'U', 'K', 'Z' ]; //"energy", /"XGH2O",
                if (obj.basicTrading && obj.basicTrading.amount) {
                    amount = obj.basicTrading.amount;
                    if (amount > 101) {
                        amount = 101;
                    }
                }
                break;

            case 'wolffman122':
                acceptable = ['X', 'O', 'H', 'L', 'U', 'K', 'Z', 'energy'];
                acceptNum = 100000;
                break;

            case 'Geir1983':
                acceptable = ['X', 'O', 'H', 'L', 'U', 'K', 'Z'];
                acceptNum = 100000;
                obj.test = 'yo bitch';
                break;
            default:
                acceptable = ['X', 'O', 'H', 'L', 'U', 'K', 'Z'];
                acceptNum = 100000;
                break;
        }
        if (obj.dangerRoom) {
            dangerRoomSetup(playerSeg, obj.dangerRoom);
        }
        if (obj.siegeRequest) {
            siegeRequest(obj.siegeRequest);
        }
        if(doMineralRequest){
            var mineralRequest = obj.resourceRequest;
            if(mineralRequest){
                let amount = mineralRequest.amount;
                let min = mineralRequest.resourceType;
                let room = mineralRequest.room;
                if(amount > 1500) amount = 1500;
                    if(Memory.stats.totalMinerals[min] >200000){

                    roomRequestMineral(mineralRequest.room,mineralRequest.resourceType,amount);
                    return;
                }
            }
        }

        var basic = obj.basicTrading;
        if (basic !== undefined) {

            for (var resource in basic) {
                if (basic[resource] && Memory.stats.totalMinerals[resource] > acceptNum && _.contains(acceptable, resource) ) {
                        if(basic.room !== 'none'){
                            let zz = roomRequestMineral(basic.room, resource, amount);
                            profitReport('E58S57', alliedList[Memory.otherPlayerSegmentCount][0], zz, undefined, amount, resource, 0, basic.room);
                            break;
                        }
                }
            }
        }
        Memory.otherPlayerSegmentCount++;
        if (Memory.otherPlayerSegmentCount >= alliedList.length) {
            Memory.otherPlayerSegmentCount = 0;
        }
    } else {
        if (notSeen === undefined) notSeen = 0;
        notSeen++;
        if (notSeen >= 1) {
            notSeen = 0;
            Memory.otherPlayerSegmentCount++;
            if (Memory.otherPlayerSegmentCount >= alliedList.length) {
                Memory.otherPlayerSegmentCount = 0;
            }
        }
    }
    RawMemory.setActiveForeignSegment(alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);
}

function offShardAnalyzeOtherPlayerSegment(alliedList) {
    if (Game.time % 10 !== 0) return;
    // Reason this is an array instead of object, is that it's easy to use the keys in an array across multiple ticks.

    // Appectable array is the resources you are willing to trade out.
    var acceptable = ['X', 'O', 'H', 'L', 'U', 'K', 'Z', RESOURCE_ENERGY, 'XGH2O'];
    var shardRoom = 'E19S49';
    let room = Game.rooms[shardRoom];

    if (Memory.otherPlayerSegmentCount === undefined || Memory.otherPlayerSegmentCount >= alliedList.length) {
        Memory.otherPlayerSegmentCount = 0;
    }

    // This will get the object of the player segement. 
    var obj = require('commands.toSegment').getObjectPlayerSegment(alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);
    let terminal = room.terminal;
    if (obj !== undefined) {
        var basic = obj.basicTrading;
        if (basic !== undefined) {
            for (var resource in basic) {
                if (basic[resource]) {
                    if (_.contains(acceptable, resource) && terminal.store[resource] > 1500) {
                        var amount = 101;
                        if (resource === RESOURCE_ENERGY) {
                            if (terminal.store[RESOURCE_ENERGY] >= 75000 && room.storage.store[RESOURCE_ENERGY] > 500000) {
                                amount = 10001;
                            } else {
                                continue;
                            }
                        }
                        if (resource === 'XGH2O') {
                            if (terminal.store.XGH2O < 3250) {
                                continue;
                            }
                        }
                        //                        let zz = roomRequestMineral(basic.room, resource, amount);
                        let sentResult = room.terminal.recordSend(resource, amount, basic.room, 'tradezz');
                        //  console.log(term.pos, 'request for mineral @', targetRoom, sentResult, mineral, term.store[mineral] - 1, term._didSend);
                        profitReport(shardRoom, alliedList[Memory.otherPlayerSegmentCount][0] + " Sending", sentResult, undefined, amount, resource, 0, basic.room);

                    }
                }
            }
        }
        Memory.otherPlayerSegmentCount++;
        if (Memory.otherPlayerSegmentCount >= alliedList.length) {
            Memory.otherPlayerSegmentCount = 0;
        }
    } else {
        if (notSeen === undefined) notSeen = 0;
        notSeen++;
        if (notSeen > 2) {
            notSeen = 0;
            Memory.otherPlayerSegmentCount++;
            if (Memory.otherPlayerSegmentCount >= alliedList.length) {
                Memory.otherPlayerSegmentCount = 0;
            }
        }
    }
    RawMemory.setActiveForeignSegment(alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);
}

var setActive = {};
var instructionCache;

function doInstructions(instructions) {

    if (instructions.length > 0 && Game.shard.name === 'shard1' && Game.time % timer*2 === 0) { //
        console.log("CURRENT:", Game.shard.name, "doing instructions #:", instructions.length);
        for (let ii in instructions) {
            console.log("Shard:", instructions[ii].shard, "type:", instructions[ii].type, "mineral", instructions[ii].mineralType, instructions[ii].mineralAmount);
            if (instructions[ii].type === 'send' && instructions[ii].shard === 'shard0' && instructions[ii].mineralType !== 'X') {
                instructions.splice(ii, 1);
                ii--;
                continue;
            }
            if (instructions[ii].mineralAmount > 2500) {
                instructions[ii].mineralAmount = 2500;
            }
        }
    }

    let i = instructions.length;
    while (i--) {
        let current = instructions[i];
        let shard = current.shard;

        let roomCreate;
        let flagTarget;
        // Here we're checking to see if there's any other instruction that is simliar that can cancel each other out.
        //        var similiar = _.filter(instructions, function(o){
        //      return o.mineralType === current.mineralType && o !== current ;
        //    });
        //      if(similiar.length)
        //        console.log(similiar.length,current.mineralType,"Thesad");

        if (Game.shard.name === 'shard1' && current.type === 'request') {
            // Here shard1 fulfills any request that is made.
            //        console.log('shard1 wants to fulfill REQUEST for', current.shard);
            //            current.mineralType,current.mineralAmount,
            if (current.shard === 'shard0') {
                roomCreate = 'E23S38';
                flagTarget = 'shard0';
            }
            if (current.shard === 'shard2') {
                roomCreate = 'E21S49';
                flagTarget = 'shard2';
            }
            if (current.shard === 'shard3') {
                roomCreate = 'E21S49';
                flagTarget = 'shard3';
            }
            if (!Game.rooms[roomCreate]) continue;
            let alphaSpawn = Game.rooms[roomCreate].alphaSpawn;
            if (!alphaSpawn || alphaSpawn.memory.expandCreate.length > 0) continue;

            //      console.log('REQUESTTo:', current.shard, roomCreate, 'Min:', current.mineralType, 'Amt:', current.mineralAmount, 'Shard1/REQUEST');
            //      if (current.mineralAmount <= 0) {
            //console.log(current.mineralAmount, current.mineralType, ' Removed from instruction due to not in terminal', Game.rooms[roomCreate].terminal.store[current.mineralType], roomCreate);
            //            instructions.splice(i, 1);
            //              continue;
            //            }
            //    if (current.mineralAmount < 500) {
            //          console.log(current.mineralAmount, current.mineralType, ' to low and removed');
            //            instructions.splice(i, 1);
            //              continue;
            //            }
            /* if (current.mineralType === RESOURCE_ENERGY && flagTarget !== 'shard3') {
                 //                console.log('energy prohibited currently');
                 instructions.splice(i, 1);
                 continue;
             }*/
            //        if (!Game.rooms[roomCreate].terminal.store[current.mineralType] ) {
            //              roomRequestMineral(roomCreate, current.mineralType, 1250);
            //              continue;
            //            }
            let request;
            if (flagTarget === 'shard0') {
                request = Memory.shard0Requests;
            } else if (flagTarget === 'shard2') {
                request = Memory.shard2Requests;
            } else if (flagTarget === 'shard3') {
                request = Memory.shard3Requests;
            }
            let total = 0;
            for (let i in request) {
                if (Game.rooms[roomCreate].terminal.store[current.mineralType] > 0) {
                    total += request[i];
                }
            }
            //             console.log(total, current.mineralType,Game.rooms[roomCreate].terminal.store[current.mineralType],roomCreate,"gdsg",alphaSpawn.memory.expandCreate.length,flagTarget );
            if (total === 0) continue;

            //            if(flagTarget === 'shard3') console.log('shard3','trying?',alphaSpawn.memory.expandCreate.length,roomCreate);
            let parts = 50; //Math.ceil(current.mineralAmount / 50);
            let temp = {

                build: makeBody(parts),
                name: 'requ' + "[" + flagTarget + "]" + Game.shard.name + ":" + Math.floor(Math.random() * 2000),
                memory: {
                    role: 'shardMule',
                    home: roomCreate,
                    party: flagTarget,
                    parent: Game.rooms[roomCreate].memory.alphaSpawnID,
                    level: 5,
                    pickup: {
                        mineralType: current.mineralType,
                        mineralAmount: current.mineralAmount > 1250 ? 1250 : current.mineralAmount,
                    }
                }
            };
            if (Game.rooms[current.shardRoom] && Game.rooms[current.shardRoom].storage && Game.rooms[current.shardRoom].storage.total < 990000) {
                temp.name = 'rtrn' + "[" + flagTarget + "]" + Game.shard.name + ":" + Math.floor(Math.random() * 2000);
            }

            //                if (current.mineralAmount > 0) {
            alphaSpawn.memory.expandCreate.push(temp);
            instructions.splice(i, 1);
            //                if (flagTarget === 'shard3') console.log(roomCreate, 'added to alphaSpawn', current.mineralAmount, temp.memory.pickup.mineralAmount, 'spliced Insturctions');
            continue;
            //              }
            // So the issue here is that we need to notify that we're sending materials to shard.
            //                current.mineralAmount -= temp.memory.pickup.mineralAmount;

        }
        if (shard === Game.shard.name) {
            // Here the shards make the creeps to send.
            if (current.type === 'send') {
                var alphaSpawn = Game.rooms[current.shardRoom].alphaSpawn;
                roomCreate = current.shardRoom;
                if (Game.rooms[roomCreate] === undefined) {
                    console.log('Non room spliced', current.send, current.mineralType, current.mineralAmount);
                    instructions.splice(i, 1);
                    continue;
                }
                if (!Game.rooms[roomCreate].terminal) {
                    console.log('Non Terminal Room room spliced', current.send, current.mineralType, current.mineralAmount);
                    instructions.splice(i, 1);
                    continue;
                }
                if (Game.shard.name === 'shard0' && Game.cpu.bucket < 150) {
                    //              if(Game.time % 100 === 0){
                    //                      console.log('shard0 continue to save CPU',Game.cpu.bucket );
                    //                  }
                    //instructions.splice(i, 1);
                    continue;
                }
                if (Game.rooms[roomCreate] !== undefined && Game.rooms[roomCreate].terminal.store[current.mineralType] <= 4500) {
                    //           console.log("bad slicing ");
                    //                    instructions.splice(i, 1);
                    //             continue;
                }
                if (Game.rooms[roomCreate] !== undefined && Game.rooms[roomCreate].storage.total === Game.rooms[roomCreate].storage.store[RESOURCE_ENERGY]) {
                    //              console.log("Contine due to storage total === storage energy");
                    continue;
                }

                /*                if(Game.rooms[current.shardRoom].storage.store[current.mineralType] > 1000){
                                    console.log("Storage OverFlow");
                                    instructions.splice(i, 1);
                                    continue;
                                } */
                //                console.log(Game.rooms[current.shardRoom].storage.store[current.mineralType],current.mineralAmount,"xXXX",alphaSpawn.memory.expandCreate.length );
                if (alphaSpawn.memory.expandCreate.length === 0) {
                    //                    var temp = createSendCreep(current);
                    if (current.mineralAmount <= 400) {
                        //                        console.log(' too low and spliced', current.mineralAmount, current.mineralType);
                        instructions.splice(i, 1);
                        continue;
                    }
                    if (current.mineralType === RESOURCE_ENERGY && current.shard !== 'shard2') {
                        console.log('energy prohibited currently');
                        instructions.splice(i, 1);
                        continue;
                    }

                    var partyFlag;
                    switch (Game.shard.name) {
                        case 'shard2':
                            partyFlag = 'shard1';
                            if (current.mineralType === RESOURCE_ENERGY) {
                                if(Game.time%2 === 0){
                                partyFlag = 'shard1';
                                }else {
                                partyFlag = 'shard3';
                                }
                                // if Shard2 has more than 990000 energy it sends energy to this place:
                            }
                            break;
                        case 'shard0':
                            partyFlag = 'shard1';
                            break;
                        case 'shard3':
                            partyFlag = 'shard1';
                            break;
                    }
                    let parts = 50; //Math.ceil(current.mineralAmount / 50);
                    let temp = {
                        build: makeBody(parts),
                        name: 'send' + "[" + partyFlag + "]" + Game.shard.name + ":" + Math.floor(Math.random() * 2000),
                        memory: {
                            role: 'shardMule',
                            home: current.shardRoom,
                            party: partyFlag,
                            parent: Game.rooms[current.shardRoom].memory.alphaSpawnID,
                            level: 5,
                        }
                    };
                    if ((partyFlag === 'shard3'||partyFlag === 'shard1') && Game.shard.name === 'shard2' && current.mineralType === RESOURCE_ENERGY) {
                        temp.build = [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK];
                    }
                    if (Game.shard.name !== 'shard3' && Game.rooms[current.shardRoom] && Game.rooms[current.shardRoom].storage && Game.rooms[current.shardRoom].storage.total < 990000 && Game.rooms[current.shardRoom].storage.total !== Game.rooms[current.shardRoom].storage.store[RESOURCE_ENERGY]) {
                        temp.name = 'rtrn' + "[" + partyFlag + "]" + Game.shard.name + ":" + Math.floor(Math.random() * 2000);
                    } ////rtrn/send/requ // ) {


                    temp.memory.pickup = {
                        mineralType: current.mineralType,
                        mineralAmount: current.mineralAmount > 1250 ? 1250 : current.mineralAmount,
                    };
                    // This is to limit the amount of mules made at one time to control transports a bit better.                
                    if (current.mineralAmount > 0) {
                        alphaSpawn.memory.expandCreate.push(temp);
                        //                        console.log('added to alphaSpawn', current.mineralAmount, temp.memory.pickup.mineralAmount);
                    }
                    current.mineralAmount -= temp.memory.pickup.mineralAmount;
                    if (current.mineralAmount <= 0) {
                        instructions.splice(i, 1);
                    }
                }
            }

            if (current.type === 'fillBuyOrder') {
                roomCreate = current.order.shardRoom;
                if (roomCreate === undefined) roomCreate = getShardRoom(Game.shard.name, current.mineralType);
                if (!Game.rooms[roomCreate] || !Game.rooms[roomCreate].terminal) {
                    console.log('Trying to ',current.type,roomCreate,Game.shard.name);
                    instructions.splice(i, 1);
                    continue;
                }

                if (Game.rooms[roomCreate].terminal.cooldown > 0 || Game.rooms[roomCreate].terminal.didAction || Game.rooms[roomCreate].terminal.store[RESOURCE_ENERGY] < 25000) {
                    if (Game.rooms[roomCreate].terminal.store[current.mineralType] === undefined) {
                        instructions.splice(i, 1);
                    }
                    continue;
                }
                if (Game.rooms[roomCreate].terminal.cooldown > 0) {
                    continue;
                }
                let order = Game.market.getOrderById(current.order.id);
                if (order === null || order.amount === 0) {
                    instructions.splice(i, 1);
                    continue;
                } 

                var amoutn = current.mineralAmount;
                if(order.amount < amoutn){
                    amoutn = order.amount;
                } 
                if(Game.rooms[roomCreate].terminal.store[current.mineralType]  < amoutn){
                    amoutn = Game.rooms[roomCreate].terminal.store[current.mineralType] ;
                }
                if (amoutn > Game.rooms[roomCreate].terminal.store[RESOURCE_ENERGY]) {
                    amoutn = Game.rooms[roomCreate].terminal.store[RESOURCE_ENERGY];
                }
                if (!Game.rooms[roomCreate].terminal.store[current.mineralType] || amoutn > Game.rooms[roomCreate].terminal.store[current.mineralType]) {
                    if (Game.shard.name === 'shard1') {
                        roomRequestMineral(roomCreate, current.mineralType, amoutn);
                        continue;
                    } else {
                        instructions.splice(i, 1);
                        continue;
                    }
                }


                let ez = marketRecordDeal(order.id, amoutn, roomCreate);
                profitReport(roomCreate, "FulFill Buy Order", ez, order.id, amoutn, current.mineralType, order.price, order.roomName);
                if (ez === OK) {
                    Game.rooms[roomCreate].terminal.didAction = true;
                    instructions.splice(i, 1);
                    continue;
                }
            }
            
            if (current.type === 'fillSellOrder') { // Filling Sell order - means that we're trying to Obtain Minerals by filling sell orders.

                let order = current.order;
                roomCreate = order.shardRoom;
                let zez = Game.market.getOrderById(order.id);
                if (zez === null) {
                    instructions.splice(i, 1);
                    //                    console.log('removed ', current.type, 'do to null');
                    continue;
                }
                if (roomCreate === undefined) {
                    roomCreate = getShardRoom(Game.shard.name, current.mineralType);
                    if (Game.shard.name === 'shard1') {
                        roomCreate = 'E21S49';
                    }
                }

                if (Game.shard.name !== 'shard1' && Game.rooms[roomCreate].storage.store[current.mineralType] > 1000) {
                    //                    console.log('Filling Sell Order Skipped due to storage containing mineral.', Game.shard.name, 'min:', current.mineralType, '#:', current.mineralAmount, 'from room', roomCreate);
                    Game.rooms[roomCreate].memory.shardNeeded = current.mineralType;
                    //                    instructions.splice(i, 1);
                    continue;
                }
                if (Game.rooms[roomCreate] && Game.rooms[roomCreate].terminal && (Game.rooms[roomCreate].terminal.cooldown > 0 || Game.rooms[roomCreate].terminal.didAction)) {
                    continue;
                }

                //            console.log(current.mineralType, order.id, current.mineralAmount, roomCreate, Game.shard.name);
                let amount = current.mineralAmount;
                if (amount > Game.rooms[roomCreate].terminal.store[RESOURCE_ENERGY]) {
                    amount = Game.rooms[roomCreate].terminal.store[RESOURCE_ENERGY];
                }
                if (Game.rooms[roomCreate]._didTransaction) {
                    continue;
                }
                let ez = marketRecordDeal(order.id, current.mineralAmount, roomCreate);
                //                console.log(ez, 'FulFill Sell order on ', Game.shard.name, 'min:', current.mineralType, "/", amount, '#:', current.mineralAmount, 'from room', roomCreate, order.id, order.amount);
                profitReport(roomCreate, "FulFill Sell Order", ez, order.id, amount, current.mineralType, zez.price * -1, zez.roomName);

                if (ez === OK) {
                    //                    console.log("buying SUCCESS", current.mineralType);
                    Game.rooms[roomCreate]._didTransaction = true;
                    instructions.splice(i, 1);
                    continue;
                } else {
                    //                  console.log('Buying FAILED', ez);
                }
            }


        }
    }
}

function analyzeMyMinerals(shardObject) {
    if (Game.shard.name !== 'shard1') return;

    if (shardObject.shard0 === undefined || shardObject.shard0.marketData === undefined ||
        shardObject.shard1 === undefined || shardObject.shard1.marketData === undefined ||
        shardObject.shard2 === undefined || shardObject.shard2.marketData === undefined) {
        return;
    }
    var minerals = [
        "H", "O", "U", "L", "K", "Z", "X",
    ];
    //    var shards = ['shard0', 'shard1', 'shard2', 'shard3'];
    for (let e in minerals) {
        let stats = Memory.stats.totalMinerals;
        if (stats[minerals[e]] < 50000) {
            // This means we need to create an order.
            let lowestShard;
            let lowestAmount;
            let min = minerals[e];
            //for(var l in shardObject.shard0.marketData)
            // {
            //      console.log( shardObject.shard0.marketData.U,shardObject.shard1.marketData.U,shardObject.shard2.marketData.U);
            // }

            for (let i in shards) {
                let shrd = shards[i];
                if (shrd === 'shard0') {
                    if (shardObject[shrd].marketData[min]) {
                        lowestShard = shrd;
                        lowestAmount = shardObject[shrd].marketData[min].sell;
                    }
                } else if (shrd !== 'shard3') {
                    if (shardObject[shrd].marketData[min]) {
                        if (lowestAmount === null || lowestAmount === undefined || shardObject[shrd].marketData[min].sell.price < lowestAmount.price) {
                            lowestShard = shrd;
                            lowestAmount = shardObject[shrd].marketData[min].sell;
                        }
                    }
                }
            }
            if (lowestAmount === undefined) {
                continue;
            }
            let request = {
                type: 'fillSellOrder',
                shard: lowestShard,
                order: lowestAmount,
                mineralType: minerals[e],
                shardRoom: lowestShard === 'shard1' ? 'E21S49' : getShardRoom(lowestShard, min),
                mineralAmount: lowestAmount.amount > 2000 ? 2000 : lowestAmount.amount,
            };
            let doRequest = true;
            if (doRequest) {
                for (let e in shardObject.instructions) {
                    // WE need to switch this so there is not tos many requests in instructions.
                    if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) { //&& shardObject.instructions[e].mineralType === request.mineralType
                        //                        console.log("Same shard request");
                        doRequest = false;
                        break;
                    }
                }
            }
            /*
                let zz = _.filter(Game.market.orders, function(order) {
                    return (order.resourceType == min && order.type == ORDER_SELL);
                });
                if (zz.length > 0) {
                    continue;
                } */


            if (doRequest) {
                //                console.log(shardObject.instructions.length, 'TOO LOWPush on to instructions,', minerals[e], lowestShard, request.mineralAmount, lowestAmount.price, "=", (request.mineralAmount * lowestAmount.price));
                if (lowestAmount.price < 0.20) {
                    shardObject.instructions.push(request);
                }
            }


        } else if (stats[minerals[e]] > 300000) {
            let lowestShard;
            let lowestAmount;
            let min = minerals[e];
            for (let i in shards) {
                let shrd = shards[i];
                if (shrd === 'shard0') {
                    if (shardObject[shrd].marketData[min]) {
                        lowestShard = shrd;
                        lowestAmount = shardObject[shrd].marketData[min].buy;
                    }
                } else {
                    if (shardObject[shrd].marketData[min]) {
                        if (lowestAmount === null || lowestAmount === undefined || (shardObject[shrd].marketData[min].buy !== null && shardObject[shrd].marketData[min].buy.price > lowestAmount.price)) {
                            lowestShard = shrd;
                            lowestAmount = shardObject[shrd].marketData[min].buy;
                        }
                    }
                }
            }
            if (lowestAmount === undefined || lowestAmount === null) {
                continue;
            }
            let request = {
                type: 'fillBuyOrder',
                shard: lowestShard,
                order: lowestAmount,
                mineralType: minerals[e],
                shardRoom: lowestShard === 'shard1' ? 'E21S49' : getShardRoom(lowestShard, min),
                mineralAmount: lowestAmount.amount > 1750 ? 1750 : lowestAmount.amount,
            };

            let doRequest = true;
            if (doRequest) {
                for (let e in shardObject.instructions) {
                    if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type && shardObject.instructions[e].mineralType === request.mineralType) {
                        doRequest = false;
                        break;
                    }
                }
            }

            if (doRequest) {
                //                console.log(shardObject.instructions.length, 'TOO MUCH Push on to instructions,', minerals[e], lowestShard, request.mineralAmount, lowestAmount.price, "=", (request.mineralAmount * lowestAmount.price));
                //                if (lowestAmount.price < 1.00) {
                shardObject.instructions.push(request);
                //              }
            }


        }
    }

    minerals = [
        "ZH",
    ];
    //    var shards = ['shard0', 'shard1', 'shard2', 'shard3'];
    for (let e in minerals) {
        let stats = Memory.stats.totalMinerals;
        if (stats[minerals[e]] > 250000) {
            let lowestShard;
            let lowestAmount;
            let min = minerals[e];
            for (let i in shards) {
                let shrd = shards[i];
                if (shrd === 'shard0') {
                    if (shardObject[shrd].marketData[min]) {
                        lowestShard = shrd;
                        lowestAmount = shardObject[shrd].marketData[min].buy;
                    }
                } else {
                    if (shardObject[shrd].marketData[min]) {
                        if (lowestAmount === null || lowestAmount === undefined || (shardObject[shrd].marketData[min].buy !== null && shardObject[shrd].marketData[min].buy.price > lowestAmount.price)) {
                            lowestShard = shrd;
                            lowestAmount = shardObject[shrd].marketData[min].buy;
                        }
                    }
                }
            }
            if (lowestAmount === undefined || lowestAmount === null) {
                continue;
            }
            let request = {
                type: 'fillBuyOrder',
                shard: lowestShard,
                order: lowestAmount,
                mineralType: minerals[e],
                shardRoom: lowestShard === 'shard1' ? 'E21S49' : getShardRoom(lowestShard, min),
                mineralAmount: lowestAmount.amount > 1750 ? 1750 : lowestAmount.amount,
            };

            let doRequest = true;
            if (doRequest) {
                for (let e in shardObject.instructions) {
                    if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type && shardObject.instructions[e].mineralType === request.mineralType) {
                        doRequest = false;
                        break;
                    }
                }
            }

            if (doRequest) {
                //                console.log(shardObject.instructions.length, 'TOO MUCH MUCHMUCHMUCH Push on to instructions,', minerals[e], lowestShard, request.mineralAmount, lowestAmount.price, "=", (request.mineralAmount * lowestAmount.price));
                if (lowestAmount.price > 0.001) {
                    shardObject.instructions.push(request);
                }
            }


        }
    }

}


function getMarketPrices() {
    console.log('getting Market Prices',Game.time,Game.shard.name);
    var rtn = {};
    var minerals = [
        "H", "O", "U", "L", "K", "Z", "X", "G", "energy", "power",
        "OH", "ZK", "UL",
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
    ];

    if (Memory.empireSettings && Memory.empireSettings.market.tier1) {
        minerals.push("UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO");
    }
    if (Memory.empireSettings && Memory.empireSettings.market.tier2) {
        minerals.push("UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2");
    }

    /*    if (Game.rooms[room] === undefined || Game.rooms[room].terminal === undefined) {
            console.log("how does this room:", room, "not have terminal", Game.shard.name, min);
            return;
        } */

    for (var e in minerals) {
        let min = minerals[e];
        var room = getShardRoom(Game.shard.name, min);

        if (Game.rooms[room] !== undefined && Game.rooms[room].terminal !== undefined && Game.rooms[room].terminal.store[min] !== undefined && Game.rooms[room].terminal.store[min] > 100) {
            let buyed = _.max(Game.market.getAllOrders(o => o.type === ORDER_BUY && o.resourceType === min && !Game.market.orders[o.id]), o => o.price);
            let selled = _.min(Game.market.getAllOrders(o => o.type === ORDER_SELL && o.resourceType === min && !Game.market.orders[o.id]), o => o.price);
            /*rtn[min] = {
                buy: buyed,
                sell: selled
            }; */
            rtn[min] = {
                buy: {
                    remainingAmount: buyed.remainingAmount,
                    amount: buyed.amount,
                    price: buyed.price,
                    id: buyed.id
                    },

                sell: {
                    remainingAmount: selled.remainingAmount,
                    amount: selled.amount,
                    price: selled.price,
                    id: selled.id
                    },

            };

            if (_.contains(["energy", "H", "O", "U", "L", "K", "Z", "X", ], min)) {
                if (Memory.trackMineralValue === undefined) {
                    Memory.trackMineralValue = {};
                }
                if (Memory.trackMineralValue[min] === undefined) {
                    Memory.trackMineralValue[min] = [];
                }
                Memory.trackMineralValue[min].push({
                    buy: {
                        price: buyed.price
                    },
                    sell: {
                        price: selled.price
                    }
                });
                if (Memory.trackMineralValue[min].length > 5) {
                    Memory.trackMineralValue[min].shift();
                }
                // This is where we create the average of all minerals.
                if (Memory.trackMineralValue[min].length === 5) {

                    if (rtn.average === undefined) rtn.average = {};

                    let buyCount = 0;
                    let buyTotal = 0;
                    let sellCount = 0;
                    let sellTotal = 0;
                    let orders = Memory.trackMineralValue[min];
                    for (let ee in orders) {
                        if (orders[ee].buy !== null) {
                            buyCount++;
                            buyTotal += orders[ee].buy.price;
                        }
                        if (orders[ee].sell !== null) {
                            sellCount++;
                            sellTotal += orders[ee].sell.price;
                        }
                    }
                    //                    console.log('AVERAGE MIerals set?', buyCount, buyTotal, sellCount, sellTotal);
                    rtn.average[min] = {
                        buy: buyTotal / buyCount,
                        sell: sellTotal / sellCount,
                    };
                }
            }

        }
    }



    return rtn;
}



function cleanOrders(shardObject, min) {
    for (let ed in shards) {
        let shrd = shards[ed];
        if (shardObject[shrd].marketData[min]) {
            if (shardObject[shrd].marketData[min].buy === null) {
                shardObject[shrd].marketData[min].buy = {
                    price: 0.01,
                };
            }
            if (shardObject[shrd].marketData[min].sell === null) {
                shardObject[shrd].marketData[min].sell = {
                    price: 1000,
                };
            }
        }

    }
    if (shardObject.shard1.marketData[min]) {

        if (shardObject.shard1.marketData[min].buy === null || shardObject.shard1.marketData[min].buy === undefined) {
            shardObject.shard1.marketData[min].buy = {
                price: 0.01,
            };
        }
        if (shardObject.shard1.marketData[min].sell === null) {
            shardObject.shard1.marketData[min].sell = {
                price: 1000,
            };
        }
    }

}



function copyEmpireData(shardObject) {
    if (Game.shard.name === 'shard1') {
        shardObject.empireSettings = Memory.empireSettings;
    } else {
        Memory.empireSettings = shardObject.empireSettings;
    }
}
var shard0tax;

function analyzeMarkets(shardObject) {
    
    //    shardObject.instructions= [];
    //[Game.shard.name]
    //if (Game.shard.name === 'shard1') return;
    //console.log(shardObject.shard0.marketData, shardObject.shard1.marketData, shardObject.shard2.marketData);
    //  if(Game.time%1000 === 0|| shard0tax === undefined){
    //      shard0tax = Memory.mineralAverage.energy.buy * (5000 *0.2) / 1250;
    // So Energy Cost * (cost of creep * 0.2[Time it takes 300/1500] ) / 1250 - amount of space
    //      console.log(shard0tax,"TAXES TAXES TAXES");console.log(shard0tax,"TAXES TAXES TAXES");
    //      } 
    //    var shard1tax = 0;
    //  var shard2tax = shard0tax;


    //    var taxes = [shard0tax, 0, shard0tax];
    /*
    if (shardObject.empireSettings.market.tier1 && Game.time % timer === 0) { //
        for (let e in shards) {
            let min = "power";
            if (shardObject[shards[e]].marketData[min] && shardObject[shards[e]].marketData[min].sell) {
                let targetPrice = Memory.empireSettings.buyPower;
                //                    if(shards[e] === 'shard2'){
                //                            targetPrice = 0.25;
                //                      }
                if (shardObject[shards[e]].marketData[min].sell.price <= targetPrice) {

                    let amnt = 2500;
                    if (shardObject[shards[e]].marketData[min].sell.remaingAmount < amnt) {
                        amnt = lowestAmount.remaingAmount;
                    }

                    let request = {
                        type: 'fillSellOrder',
                        shard: shards[e],
                        order: shardObject[shards[e]].marketData[min].sell,
                        mineralType: min,
                        shardRoom: getShardRoom(shards[e], min),
                        mineralAmount: amnt,
                    };

                    let doRequest = true;
                    console.log("ADDING POWER TO BUY:", request.type, request.shard, request.order, request.mineralType, request.shardRoom, request.mineralAmount, shardObject[shards[e]].marketData[min].buy.price);
                    //                            if (shardObject.instructions.length > 15) doRequest = false;
                    if (doRequest) {
                        for (let e in shardObject.instructions) {
                            if ((shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type && shardObject.instructions[e].mineralType === request.mineralType)) {
                                doRequest = false;
                                break;
                            }
                        }
                    }
                    if (doRequest) {
                        console.log("ADDING POWER TO BUY YES:", request.type, request.shard, request.order, request.mineralType, request.shardRoom, request.mineralAmount, shardObject[shards[e]].marketData[min].buy.price);
                        shardObject.instructions.push(request);
                        return;
                    }
                }


            }

        }
    }*/
    var energyHigh;

    let basic = ["energy", "H", "O", "U", "L", "K", "Z", "X", ];
    if (Game.time%( timer*4) === 0) {

        for (let ie in basic) {
            let minSellTotal = 0;
            let minSellCount = 0;
            let minBuyTotal = 0;
            let minBuyCount = 0;

            for (let e in shards) {
                //          console.log(shardObject[shards[e]].marketData.average[basic[ie]],basic[ie],shards[e] );
                if (shardObject[shards[e]].marketData && shardObject[shards[e]].marketData.average && shardObject[shards[e]].marketData.average[basic[ie]]) {

                    if (shardObject[shards[e]].marketData.average[basic[ie]].buy) {
                        //                    console.log(minSellTotal, shardObject[shards[e]].marketData.average[basic[ie]].buy, minSellCount);
                        minSellTotal += shardObject[shards[e]].marketData.average[basic[ie]].buy;
                        minSellCount++;
                    }
                    if (shardObject[shards[e]].marketData.average[basic[ie]].sell) {
                        minBuyTotal += shardObject[shards[e]].marketData.average[basic[ie]].sell;
                        minBuyCount++;
                    }
                }
            }
            if (Memory.mineralAverage === undefined) {
                Memory.mineralAverage = {};
            }
            if (Memory.mineralAverage[basic[ie]] === undefined) {
                Memory.mineralAverage[basic[ie]] = {

                };
            }
            if (minSellCount > 0) {
                Memory.mineralAverage[basic[ie]].sell = (minSellTotal / minSellCount);
                //                Memory.mineralAverage[basic[ie]].sell = parseInt( (minSellTotal / minSellCount).toFixed(2) );
                //              console.log(basic[ie], 'AVERAGE: SELL:', Memory.mineralAverage[basic[ie]].sell);
            }
            if (minBuyCount > 0) {
                Memory.mineralAverage[basic[ie]].buy = (minBuyTotal / minBuyCount);
                //              Memory.mineralAverage[basic[ie]].buy = parseInt(  (minBuyTotal / minBuyCount).toFixed(2) );
                //                console.log(basic[ie], 'AVERAGE: BUY:', Memory.mineralAverage[basic[ie]].buy);

            }
        }
    }


    var minerals = [
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
        "UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2",
        "UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO",
        "OH", "ZK", "UL",
        "H", "O", "U", "L", "K", "Z", "X", "G",
    ];

    if (shardObject.shard0 === undefined || shardObject.shard0.marketData === undefined ||
        shardObject.shard1 === undefined || shardObject.shard1.marketData === undefined ||
        shardObject.shard2 === undefined || shardObject.shard2.marketData === undefined ||
        shardObject.shard3 === undefined || shardObject.shard3.marketData === undefined) {
        return;
    }

    // We are looking for the highest BUY Price
    if (shardObject.shard0.marketData.energy || shardObject.shard1.marketData.energy || shardObject.shard2.marketData.energy || shardObject.shard0.marketData.energy.buy === null || shardObject.shard1.marketData.energy.buy === null || shardObject.shard2.marketData.energy.buy === null) {
        energyHigh = 0.02;
    } else {
        energyHigh = shardObject.shard0.marketData.energy.buy.price + shardObject.shard1.marketData.energy.buy.price + shardObject.shard2.marketData.energy.buy.price;
        energyHigh = energyHigh / 3;
        energyHigh = energyHigh.toFixed(2);
        Memory.energyCost = energyHigh;
    }


    var bestDeal;
    var highestShard;
    var highestAmount;
    var lowestShard;
    var lowestAmount;

    for (let i in minerals) {
        highestShard = undefined;
        highestAmount = undefined;
        lowestShard = undefined;
        lowestAmount = undefined;

        let min = minerals[i];

        cleanOrders(shardObject, min);
        // We are looking for the highest BUY Price
        if (shardObject.shard0.marketData[min]) {
            highestShard = 'shard0';
            highestAmount = shardObject.shard0.marketData[min].sell;
        }

        for (let i in shards) {
            if (shards[i] !== 'shard0') {
                if (shardObject[shards[i]].marketData[min]) {
                    if (highestAmount === undefined || shardObject[shards[i]].marketData[min].sell.price < highestAmount.price) {
                        highestShard = shards[i];
                        highestAmount = shardObject[shards[i]].marketData[min].sell;
                    }
                }
            }
        }

        if (shardObject.shard0.marketData[min]) {
            lowestShard = 'shard0';
            lowestAmount = shardObject.shard0.marketData[min].buy;
        }
        // HighestAmount -is the sell 
        // Lowest amoutn  is to  buy
        for (let i in shards) {
            if (shards[i] !== 'shard0') {

                if (shardObject[shards[i]].marketData[min]) {
                    if (lowestAmount === undefined || shardObject[shards[i]].marketData[min].buy.price > lowestAmount.price) {
                        lowestShard = shards[i];
                        lowestAmount = shardObject[shards[i]].marketData[min].buy;
                    }
                }
            }
        }
        // If Buy is greater than Sell     
        //0.112 for: U Highest Buy order shard1 @ 0.113 Lowest Sell order shard1 @ 0.001
        // WE are looking for the lowest SELL price

        //        console.log('for:',min,'Highest Buy order',lowestShard,'@',lowestAmount.price,'Lowest Sell order',highestShard,'@',highestAmount.price);

        // This is to setup an order if we need to sell an mineral we have too much of and we don't need to verify.
        /*        if (lowestAmount !== undefined && Memory.stats.totalMinerals[min] > 300000 && lowestAmount.price > 0.20 && _.contains(['X', 'O', 'H', 'L', 'U', 'Z', 'K'], minerals[i])) {

                    let request = {
                        type: 'fillBuyOrder',
                        shard: lowestShard,
                        order: lowestAmount,
                        mineralType: minerals[i],
                        shardRoom: getShardRoom(lowestShard, min),
                        mineralAmount: 1750,
                    };
                    if (shardObject.instructions.length < 4) {

                        console.log('added just a buy order to instructions:', min, "@", lowestAmount.price, Memory.stats.totalMinerals[min]);
                        shardObject.instructions.push(request);
                        continue;
                    }
                } */

        if (lowestAmount !== undefined && highestAmount !== undefined) {

            var profit = lowestAmount.price - highestAmount.price;
            if (profit > 0) {

                var amnt = 1250;
                if (lowestAmount.remaingAmount < 1250) {
                    amnt = lowestAmount.remaingAmount;
                }
                if (highestAmount.remaingAmount < 1250) {
                    amnt = highestAmount.remaingAmount;
                }
                if (highestAmount.remaingAmount < amnt) {
                    amnt = highestAmount.remaingAmount;
                }
                if (lowestAmount.remaingAmount < amnt) {
                    amnt = lowestAmount.remaingAmount;
                }
                if (amnt < 100) continue;
                let request = {
                    type: 'fillBuyOrder',
                    shard: lowestShard,
                    order: lowestAmount,
                    mineralType: minerals[i],
                    shardRoom: getShardRoom(lowestShard, min),
                    mineralAmount: amnt,
                };
                let request2 = {
                    type: 'fillSellOrder',
                    shard: highestShard,
                    order: highestAmount,
                    mineralType: minerals[i],
                    shardRoom: highestShard === 'shard1' ? 'E21S49' : getShardRoom(lowestShard, min),
                    mineralAmount: amnt,
                };
                const segmentCost = 1700;
                var request1TransferCost = calcuateTotalCost(request);
                var request2TransferCost = calcuateTotalCost(request2);
                var energyCost = energyHigh;
                var total = segmentCost + request1TransferCost + request2TransferCost;
                var estimateTransferCreditCost = energyCost * total;
                var estimateGain = profit * request.mineralAmount;
                var estimateProfit = estimateGain - estimateTransferCreditCost;
                if (estimateProfit > 0) {
                    if (_.contains(["H", "O", "U", "L", "K", "Z", "X"], min)) {

                        let rating;
                        if (estimateProfit < 50) {
                            rating = "D";
                        } else if (estimateProfit < 70) {
                            rating = "C";

                        } else if (estimateProfit < 80) {
                            rating = "B";

                        } else if (estimateProfit < 90) {
                            rating = "A";

                        } else if (estimateProfit < 100) {

                            rating = "A+";
                        } else {
                            rating = "S";
                        }
                        //if(estimateProfit>100 )
                        //  console.log("Bsc: ", rating, '@', min, "#", amnt, ' EST Profit:', estimateProfit.toFixed(2), "Energy Est:", total, "*", energyHigh, "(eng avg)  Est Cred=", estimateTransferCreditCost.toFixed(2), "Gain from selling", estimateGain.toFixed(2));
                        if (estimateProfit >= 50) {
                            if (bestDeal === undefined) {
                                bestDeal = {
                                    req: request,
                                    req2: request2,
                                    estimateProfit: estimateProfit,
                                };
                            } else if (estimateProfit > bestDeal.estimateProfit) {
                                bestDeal = {
                                    req: request,
                                    req2: request2,
                                    estimateProfit: estimateProfit,
                                };
                            }

                        }
                    } else {

                        let rating;
                        if (estimateProfit < 100) {
                            rating = "D";
                        } else if (estimateProfit < 200) {
                            rating = "C";

                        } else if (estimateProfit < 300) {
                            rating = "B";

                        } else if (estimateProfit < 400) {
                            rating = "A";

                        } else if (estimateProfit < 500) {

                            rating = "A+";
                        } else {
                            rating = "S";
                        }
                        //if(estimateProfit>100 )
                        //    console.log("Ad: ", rating, '@', min, "#", amnt, ' EST Profit:', estimateProfit.toFixed(2), "Energy Est:", total, "*", energyHigh, "(eng avg)  Est Cred=", estimateTransferCreditCost.toFixed(2), "Gain from selling", estimateGain.toFixed(2));
                        if (estimateProfit > 100) {
                            if (bestDeal === undefined) {
                                bestDeal = {
                                    req: request,
                                    req2: request2,
                                    estimateProfit: estimateProfit,
                                };
                            } else if (estimateProfit > bestDeal.estimateProfit) {
                                bestDeal = {
                                    req: request,
                                    req2: request2,
                                    estimateProfit: estimateProfit,
                                };
                            }

                        }

                    }
                }


            }
        }

    }
    if (bestDeal !== undefined) {

        var doRequest = true;
        if (doRequest) {
            for (let e in shardObject.instructions) {
                if ((shardObject.instructions[e].shard === bestDeal.req.shard && shardObject.instructions[e].type === bestDeal.req.type && shardObject.instructions[e].mineralType === bestDeal.req.mineralType) ||
                    (shardObject.instructions[e].shard === bestDeal.req2.shard && shardObject.instructions[e].type === bestDeal.req2.type && shardObject.instructions[e].mineralType === bestDeal.req2.mineralType)) {
                    doRequest = false;
                    break;
                }
            }
        }
        if (doRequest && bestDeal.req.mineralType === bestDeal.req2.mineralType) {
            console.log('Pushing to buy/sell:', bestDeal.req2.mineralType, "estimateProfit:", bestDeal.estimateProfit, 'highest Buy order', lowestShard, '@', bestDeal.req.price, 'lowest Sell order', highestShard, '@', bestDeal.req2.price);
            shardObject.instructions.push(bestDeal.req);
            shardObject.instructions.push(bestDeal.req2);
        }

    }
}
var requestMineral0;
var requestMineral2;
var requestMineral3;

function analyzeShards(shardObject) {

    if (shardObject.shard0 !== undefined) {

        if (requestMineral0 === undefined) requestMineral0 = {};
        for (let e in requestMineral0) {
            //if (requestMineral0[e] > 0){
            if (requestMineral0[e] > 0) {
                //                console.log('delay for request0', e, requestMineral0[e]);
                requestMineral0[e]--;
            }
            //}
        }

        if (Game.time % timer === 0) {
            Memory.shard0Requests = {};
            //            }
            //            console.log("shardObject.shard2Requests UPDATING Memory.shard2Requests");
            for (let ie in shardObject.shard0.request) {
                //onsole.log(ie, shardObject.shard2.request[ie], shardObject.shard2.request[ie].mineralAmount, shardObject.shard2.request[ie].mineralType);
                //                if (shardObject.shard0.request[ie].mineralType !== RESOURCE_ENERGY) {
                Memory.shard0Requests[shardObject.shard0.request[ie].mineralType] = shardObject.shard0.request[ie].mineralAmount;
                //              }

            }
        }

        let total = 0;
        for (let eee in Memory.shard0Requests) {
            total += Memory.shard0Requests[eee];
        }

        if (total >= 1250) {
            let room = Game.rooms[shardObject.shard0.shardRoom];
            for (let i in shardObject.shard0.request) {
                //console.log('shard0 requests for', shardObject.shard0.request[i].mineralType, ":", shardObject.shard0.request[i].mineralAmount, shardObject.shard0.shardRoom);
                if (Memory.stats.totalMinerals[shardObject.shard0.request[i].mineralType] < 1000) {
                    continue;
                } //else if (shardObject.shard0.request[i].mineralType === RESOURCE_ENERGY) {
                //  continue;
                //                }

                let request = {
                    type: 'request',
                    // Requests only happen from shard1 to shardX
                    shard: 'shard0', // Should be shard1, requests happen from shard1.
                    shardRoom: shardObject.shard0.shardRoom, // If from shard 
                    mineralAmount: shardObject.shard0.request[i].mineralAmount,
                    mineralType: shardObject.shard0.request[i].mineralType,
                };
                //            console.log('request object',request.shard,request.shardRoom);
                let doRequest = true;
                for (let e in shardObject.instructions) {
                    if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                        doRequest = false;
                        break;
                    }
                }

                if (requestMineral0[request.mineralType] === undefined) requestMineral0[request.mineralType] = 0;
                if (requestMineral0[request.mineralType] > 0) doRequest = false;
                if (request.mineralAmount <= 500) doRequest = false;

                if (doRequest) {
                    requestMineral0[request.mineralType] = 1000;
                    shardObject.instructions.push(request);
                    //                console.log(shardObject.instructions.length, ' SHard 0 Making request, ins:', request.mineralType, request.mineralAmount);
                }

            }
        }


        for (let i in shardObject.shard0.sending) {
            //            console.log('shard0 sending out', shardObject.shard0.sending[i].mineralType, ":", shardObject.shard0.sending[i].mineralAmount, shardObject.shard0.shardRoom);

            let request = {
                type: 'send',
                shard: 'shard0',
                shardRoom: shardObject.shard0.shardRoom,
                mineralAmount: shardObject.shard0.sending[i].mineralAmount,
                mineralType: shardObject.shard0.sending[i].mineralType,
            };
            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) { //&& shardObject.instructions[e].mineralType === request.mineralType
                    //              console.log('dorequest false1 due to exisiting request',e);
                    doRequest = false;
                    break;
                }
            }

            if (doRequest && request.mineralAmount < 500) {
                doRequest = false;
            }

            if (doRequest) {
                shardObject.instructions.push(request);
                //console.log(shardObject.instructions.length, ' SHard 0 Sending to Shard1', request.mineralType, request.mineralAmount);
            }
        }
    }

    if (shardObject.shard2 !== undefined) {
        let room = Game.rooms[shardObject.shard2.shardRoom];
        if (requestMineral2 === undefined) requestMineral2 = {};

        for (let e in requestMineral2) {
            //    if (requestMineral2[e] > 0){
            if (requestMineral2[e] > 0) {
                //        console.log('delay for request2', e, requestMineral2[e]);
                requestMineral2[e]--;
            }

            // }
        }
        /*              console.log('shard2 current Request',Game.time % 100);
                        for(let ee in Memory.shard2Requests){
                            if(Memory.shard2Requests[ee] !== 0 && ee !== RESOURCE_ENERGY)
                            console.log(ee,':',Memory.shard2Requests[ee]);
                        }*/

        if (Game.time % (timer*2) === 0) {
            Memory.shard2Requests = {};
            //            }
            //            console.log("shardObject.shard2Requests UPDATING Memory.shard2Requests");
            for (let ie in shardObject.shard2.request) {
                //onsole.log(ie, shardObject.shard2.request[ie], shardObject.shard2.request[ie].mineralAmount, shardObject.shard2.request[ie].mineralType);
                if (shardObject.shard2.request[ie].mineralType !== RESOURCE_ENERGY) {
                    Memory.shard2Requests[shardObject.shard2.request[ie].mineralType] = shardObject.shard2.request[ie].mineralAmount;
                }

            }
        }
        // if (Game.time % 500 === 0) {
        // shard2requests is refreshed above every 500 
        //    if (shardObject.shard2.request[i].mineralType !== RESOURCE_ENERGY) {
        //                    console.log('updaing requestminreal2', Game.time, Memory.shard2Requests[shardObject.shard2.request[i].mineralType], shardObject.shard2.request[i].mineralType);
        //  }

        let total = 0;
        for (let eee in Memory.shard2Requests) {
            total += Memory.shard2Requests[eee];
        }
        //        console.log(total, "minerals shard2 needs");

        if (total >= 1250) {

            for (let i in shardObject.shard2.request) {
                //            console.log('shard2 requests for', shardObject.shard2.request[i].mineralType, ":", shardObject.shard2.request[i].mineralAmount, shardObject.shard2.shardRoom);
                if (Memory.stats.totalMinerals[shardObject.shard2.request[i].mineralType] < 1000 || shardObject.shard2.request[i].mineralAmount < 500) {
                    continue;
                }
                if (shardObject.shard2.request[i].mineralType === RESOURCE_ENERGY) {
                    continue;
                }

                let request = {
                    type: 'request',
                    // Requests only happen from shard1 to shardX
                    shard: 'shard2', // Should be shard1, requests happen from shard1.
                    shardRoom: shardObject.shard2.shardRoom, // If from shard 
                    mineralAmount: shardObject.shard2.request[i].mineralAmount,
                    mineralType: shardObject.shard2.request[i].mineralType,
                };
                //            console.log('request object',request.shard,request.shardRoom);
                let doRequest = true;
                for (let e in shardObject.instructions) {
                    if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) { // && shardObject.instructions[e].mineralType === shardObject.shard2.request[i].mineralType
                        doRequest = false;
                        //                    console.log("Simliar Orders already", request.type, request.shard, shardObject.instructions[e].mineralType, shardObject.shard2.request[i].mineralType);
                        break;
                        //                    continue;
                    }
                }
                //            if(shardObject.shard2.request[i].mineralType === 'UO'){               console.log('shard2 request stop?',doRequest);            }



                // We should add a 'delay of 1k ticks between doing '
                //    if (requestMineral2[request.mineralType] === undefined) requestMineral2[request.mineralType] = 0;
                //      if (requestMineral2[request.mineralType] > 0) {
                //                console.log(request.mineralType, requestMineral2[request.mineralType], "> 0 : Delay to request mineral again?");
                //doRequest = false;    
                //              continue;
                //        }
                //            if(shardObject.shard2.request[i].mineralType === 'UO'){               console.log('shard2 request stop?',doRequest);            }
                if (doRequest) {
                    requestMineral2[request.mineralType] = 1000;
                    shardObject.instructions.push(request);
                    //          console.log(shardObject.instructions.length, ' SHard 2 Requesting', request.mineralType, request.mineralAmount);
                }

            }
        }

        let shard2Room = Game.rooms[shardObject.shard2.shardRoom];
        if (shardObject.shard2.storage && shardObject.shard2.storage > 990000) {
            let request = {
                type: 'send', // Sending from:
                shard: 'shard2', // shard2
                shardRoom: 'E19S49',
                mineralAmount: 4500, // 4500 Energy
                mineralType: RESOURCE_ENERGY, // 
            };
            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type && shardObject.instructions[e].mineralType === request.mineralType) {
                    //                        console.log(shardObject.instructions[e].shard , request.shard , shardObject.instructions[e].type , request.type, shardObject.instructions[e].mineralType , request.mineralType);
                    doRequest = false;
                    break;
                }
            }

            if (doRequest) {
                shardObject.instructions.push(request);
            }


        }

        for (let i in shardObject.shard2.sending) {
            //      console.log('shard2 sending out', shardObject.shard2.sending[i].mineralType, ":", shardObject.shard2.sending[i].mineralAmount, shardObject.shard2.shardRoom);
            if (shardObject.shard2.sending[i].mineralAmount < 500) {
                continue;
            }

            let request = {
                type: 'send',
                shard: 'shard2',
                shardRoom: shardObject.shard2.shardRoom,
                mineralAmount: shardObject.shard2.sending[i].mineralAmount,
                mineralType: shardObject.shard2.sending[i].mineralType,
            };

            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                    doRequest = false;
                    break;
                }
            }
            if (doRequest) {
                shardObject.instructions.push(request);
                //   console.log(shardObject.instructions.length, ' SHaRd 2 Sending', request.mineralType, request.mineralAmount);
            }
        }
    }
    if (shardObject.shard3 !== undefined) {
        //      let room = Game.rooms[shardObject.shard3.shardRoom];
        if (requestMineral3 === undefined) requestMineral3 = {};

        for (let e in requestMineral3) {
            if (requestMineral3[e] > 0) {
                requestMineral3[e]--;
            }
        }
        /*              console.log('shard3 current Request',Game.time % 100);
                        for(let ee in Memory.shard3Requests){
                            if(Memory.shard3Requests[ee] !== 0 && ee !== RESOURCE_ENERGY)
                            console.log(ee,':',Memory.shard3Requests[ee]);
                        }*/

        if (Game.time % (timer*2) === 0) {
            Memory.shard3Requests = {};
            //            }
            //            console.log("shardObject.shard3Requests UPDATING Memory.shard3Requests");
            for (let ie in shardObject.shard3.request) {
                //                console.log(ie, shardObject.shard3.request[ie], shardObject.shard3.request[ie].mineralAmount, shardObject.shard3.request[ie].mineralType);
                //                if (shardObject.shard3.request[ie].mineralType !== RESOURCE_ENERGY) {
                Memory.shard3Requests[shardObject.shard3.request[ie].mineralType] = shardObject.shard3.request[ie].mineralAmount;
                //              }

            }
        }
        // if (Game.time % 500 === 0) {
        // shard3requests is refreshed above every 500 
        //    if (shardObject.shard3.request[i].mineralType !== RESOURCE_ENERGY) {
        //                    console.log('updaing requestminreal2', Game.time, Memory.shard3Requests[shardObject.shard3.request[i].mineralType], shardObject.shard3.request[i].mineralType);
        //  }

        let total = 0;
        for (let eee in Memory.shard3Requests) {
            total += Memory.shard3Requests[eee];
        }
        //        console.log(total, "minerals shard3 needs");

        if (total >= 4500) {

            for (let i in shardObject.shard3.request) {
                //            console.log('shard3 requests for', shardObject.shard3.request[i].mineralType, ":", shardObject.shard3.request[i].mineralAmount, shardObject.shard3.shardRoom);
                if (Memory.stats.totalMinerals[shardObject.shard3.request[i].mineralType] < 1000 || shardObject.shard3.request[i].mineralAmount < 500) {
                    continue;
                }
                if (shardObject.shard3.request[i].mineralType === RESOURCE_ENERGY) {
                    //                  continue;
                }

                let request = {
                    type: 'request',
                    // Requests only happen from shard1 to shardX
                    shard: 'shard3', //
                    shardRoom: shardObject.shard3.shardRoom, // If from shard 
                    mineralAmount: shardObject.shard3.request[i].mineralAmount,
                    mineralType: shardObject.shard3.request[i].mineralType,
                };
                //            console.log('request object',request.shard,request.shardRoom);
                let doRequest = true;
                for (let e in shardObject.instructions) {
                    if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) { // && shardObject.instructions[e].mineralType === shardObject.shard3.request[i].mineralType
                        doRequest = false;
                        //                    console.log("Simliar Orders already", request.type, request.shard, shardObject.instructions[e].mineralType, shardObject.shard3.request[i].mineralType);
                        break;
                        //                    continue;
                    }
                }
                //            if(shardObject.shard3.request[i].mineralType === 'UO'){               console.log('shard3 request stop?',doRequest);            }



                // We should add a 'delay of 1k ticks between doing '
                //    if (requestMineral2[request.mineralType] === undefined) requestMineral2[request.mineralType] = 0;
                //      if (requestMineral2[request.mineralType] > 0) {
                //                console.log(request.mineralType, requestMineral2[request.mineralType], "> 0 : Delay to request mineral again?");
                //doRequest = false;    
                //              continue;
                //        }
                //            if(shardObject.shard3.request[i].mineralType === 'UO'){               console.log('shard3 request stop?',doRequest);            }
                if (doRequest) {
                    requestMineral3[request.mineralType] = 1000;
                    shardObject.instructions.push(request);
                    //          console.log(shardObject.instructions.length, ' SHard 2 Requesting', request.mineralType, request.mineralAmount);
                }

            }
        }

        for (let i in shardObject.shard3.sending) {
            //      console.log('shard3 sending out', shardObject.shard3.sending[i].mineralType, ":", shardObject.shard3.sending[i].mineralAmount, shardObject.shard3.shardRoom);
            if (shardObject.shard3.sending[i].mineralAmount < 500) {
                continue;
            }

            let request = {
                type: 'send',
                shard: 'shard3',
                shardRoom: shardObject.shard3.shardRoom,
                mineralAmount: shardObject.shard3.sending[i].mineralAmount,
                mineralType: shardObject.shard3.sending[i].mineralType,
            };

            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                    doRequest = false;

                    break;
                }
            }
            if (doRequest) {
                shardObject.instructions.push(request);
            }
        }
    }

}

function calcuateTotalCost(request) {
    if (request.shardRoom === undefined || request.order.roomName === undefined || request.shardRoom === null || request.order.roomName === null) return undefined;
    var amount = request.mineralAmount;
    var distanceBetweenRooms = Game.map.getRoomLinearDistance(request.shardRoom, request.order.roomName, true);
    let rtn = Math.ceil(amount * (1 - Math.exp(-distanceBetweenRooms / 30)));
    return rtn;
}

function getShardRoom(shard, min) {
    switch (shard) {
        case "shard0":
            return 'E38S72';
        case "shard2":
            return 'E19S49';
        case "shard3":
            return 'E19S49';
        case "shard1":
            return _terminal_().getRoomMostMineral(min);
    }
}

function runShardRoom(roomName) {
    //shard room is room on a seperate shard
    let room = Game.rooms[roomName];
    if (room === undefined) return;
    let terminal = room.terminal;
    var min = 4500;
    var max = 4500; //"energy",
    var minerals = _.shuffle([
        "H", "O", "U", "L", "K", "Z", "X", "G",
        "power",
        "OH", "ZK", "UL",
        "UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO",
        "UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2",
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
    ]);

    var need = [];
    var maxed = [];

    if (Game.shard.name !== 'shard1') {
        if (room.storage && room.storage.total !== room.storage.store[RESOURCE_ENERGY] && room.terminal) {
            let minerals = room.storage.total - room.storage.store[RESOURCE_ENERGY];
            if (minerals > 4500) {
                maxed.push({
                    mineralType: 'X',
                    mineralAmount: 2500,
                });
            }
        }
    }
    if (terminal === undefined) {
        need.push({
            mineralType: RESOURCE_ENERGY,
            mineralAmount: 5000,
        });
        return {
            room: roomName,
            needed: need,
            sending: maxed,
        };
    }
    for (var e in minerals) {
        if (terminal.store[minerals[e]] !== undefined && minerals[e] !== RESOURCE_ENERGY) {
            //            console.log(roomName,'Doing Shard Room check:',minerals[e], terminal.store[minerals[e]] ,min,max);
            if (terminal.store[minerals[e]] < min && (!room.storage.store[minerals[e]] || room.storage.store[minerals[e]] < 1000)) {
                need.push({
                    mineralType: minerals[e],
                    mineralAmount: min - terminal.store[minerals[e]],
                });
                // request this mineral.
            }
        } else if (minerals[e] !== RESOURCE_ENERGY) {
            need.push({
                mineralType: minerals[e],
                mineralAmount: min,
            });
        }
    }
    if (room.storage && room.storage.store[RESOURCE_ENERGY] < 150000) {
        need.push({
            mineralType: RESOURCE_ENERGY,
            mineralAmount: 1250,
        });
    }
    if (Game.shard.name === 'shard0' && room.storage.total - room.storage.store[RESOURCE_ENERGY] > 50000) {
        need.push({
            mineralType: RESOURCE_ENERGY,
            mineralAmount: 1250,
        });
    }
    if (Game.shard.name === 'shard2') {
        return {
            room: roomName,
            needed: need,
            sending: maxed,
            storage: room.storage.total,
        };
    }

    return {
        room: roomName,
        needed: need,
        sending: maxed,
    };
}

function makeBody(carryNeeded) {
    if (carryNeeded > 50) carryNeeded = 50;
    let body = [];
    do {
        body.push(MOVE);
        body.push(CARRY);
        if (body.length >= 50) return body;
        carryNeeded--;
    } while (carryNeeded > 0);
    return body;
}
class segmentCommand {


    static roomToSegment(roomName) {
        return roomSegment[roomName];
    }

    static requestRoomSegmentData(roomName) {
        if (roomSegment[roomName] !== undefined) {

            let zz = _.indexOf(Memory.shardNeed, roomSegment[roomName]);

            if (RawMemory.segments[roomSegment[roomName]] === undefined && zz === -1) {
                if (_.isNumber(roomSegment[roomName]))
                    Memory.shardNeed.push(roomSegment[roomName]);
                return true;
            }
        }
        return;
    }

    static setRoomSegmentData(roomName, rawData) {
        let maxMemory = 102400; //100 * 1024
        let mx = rawData.length;
        var needed_segments = Math.ceil(mx / maxMemory);
        //console.log(roomName,needed_segments,mx,"/",maxMemory);
        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined && setActive[roomSegment[roomName]] === undefined) {
                if (_.isNumber(roomSegment[roomName]))
                    Memory.shardNeed.push(roomSegment[roomName]);
                setActive[roomSegment[roomName]] = true;
                return;

            } else if (RawMemory.segments[roomSegment[roomName]] !== undefined) {
                RawMemory.segments[roomSegment[roomName]] = rawData;
            }
        } else {
            return;
        }

    }

    static getRawSegmentRoomData(roomName) {
        if (Game.rooms[roomName] === undefined) {

            return;
        }
        if (Game.rooms[roomName].memory.segmentReset === undefined) {
            Game.rooms[roomName].memory.segmentReset = 100000 + Math.floor(Math.random() * 100000);
        }


        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined && setActive[roomSegment[roomName]] === undefined) {
                if (_.isNumber(roomSegment[roomName]))
                    Memory.shardNeed.push(roomSegment[roomName]);
                setActive[roomSegment[roomName]] = true;
                return;
            } else if (RawMemory.segments[roomSegment[roomName]] !== undefined) {

                if (Game.rooms[roomName].memory.segmentReset < 0) {
                    Game.rooms[roomName].memory.segmentReset = 100000 + Math.floor(Math.random() * 100000);
                    RawMemory.segments[roomSegment[roomName]] = '+';
                    console.log(roomName,"Just resetting segments ",roomSegment[roomName]);
                }

                if (RawMemory.segments[roomSegment[roomName]][0] === undefined) {
                    RawMemory.segments[roomSegment[roomName]] = '+';
                }

                return RawMemory.segments[roomSegment[roomName]];
            }
        } else {

        }
        return;
    }

    static getObjectPlayerSegment(playerName, seg) {
        var raw = RawMemory.foreignSegment;
        if (raw === undefined) {
            RawMemory.setActiveForeignSegment(playerName, seg);
            return undefined;
        }
        if (raw.username === playerName) {
            if (raw.data !== undefined) {
                if (raw.data[0] === '{' && raw.data[raw.data.length - 1] === '}') {
                    var rtn = JSON.parse(raw.data);
                    return rtn;
                } else {
                    console.log(playerName, "segment is not an object ERROR");
                }
            }
        }
    }

    static setInterShardData() {
        if (Game.time % 8 !== 0) return false;
        // we need const timer stuff here.
        //const timer = 255;

        var rawData = RawMemory.interShardSegment;
        var rawObject = JSON.parse(rawData);

            copyEmpireData(rawObject);
//            console.log(rawObject.terminalRequest);
//            rawObject.terminalRequest = undefined;

        if (rawObject.instructions === undefined) {
            if (instructionCache !== undefined) {
                rawObject.instructions = instructionCache;
            } else {
                rawObject.instructions = [];
            }
        }

        var shardObject = rawObject[Game.shard.name];

        if (rawObject[Game.shard.name] === undefined) {
            rawObject[Game.shard.name] = {};
        }

        if (Game.shard.name === 'shard1') {
            if (Game.time % (timer ) === 0 || rawObject[Game.shard.name] === undefined) {
                rawObject[Game.shard.name].marketData = getMarketPrices();
            }
            analyzeShards(rawObject); // This determines where we send minerals and if they want minerals.
            analyzeMarkets(rawObject); //if (Game.time % 500 > 21) return;      
            analyzeMyMinerals(rawObject); //if (Game.time % 33 !== 0) return;

        } else if (Game.shard.name === 'shard0') {
            if (Game.time % timer === 0 || rawObject[Game.shard.name] === undefined) {
                let sharData = runShardRoom('E38S72');
                rawObject[Game.shard.name].request = sharData.needed; // needed
                rawObject[Game.shard.name].sending = sharData.sending;
                rawObject[Game.shard.name].shardRoom = sharData.room;
                rawObject[Game.shard.name].marketData = getMarketPrices();

            }
        } else if (Game.shard.name === 'shard2') {
            if (Game.time % timer === 0 || rawObject[Game.shard.name] === undefined) {
                let sharData = runShardRoom('E19S49');
                rawObject[Game.shard.name].request = sharData.needed; // needed
                rawObject[Game.shard.name].sending = sharData.sending;
                rawObject[Game.shard.name].shardRoom = sharData.room;
                rawObject[Game.shard.name].storage = sharData.storage;
                rawObject[Game.shard.name].marketData = getMarketPrices();

            }
        } else if (Game.shard.name === 'shard3') {
            if (Game.time % timer === 0 || rawObject[Game.shard.name] === undefined) {
                let sharData = runShardRoom('E19S49');
                rawObject[Game.shard.name].request = sharData.needed; // needed
                rawObject[Game.shard.name].sending = sharData.sending;
                rawObject[Game.shard.name].shardRoom = sharData.room;
                rawObject[Game.shard.name].marketData = getMarketPrices();

            }
        }

        //instructions are added by analzyingShards, and each shard needs to go through instructions 
        doInstructions(rawObject.instructions);

        // Instructions are made b
        instructionCache = rawObject.instructions;

        RawMemory.interShardSegment = JSON.stringify(rawObject);
    }



    static run() {
        
        if (Memory.shardNeed.length > 1) {
            Memory.shardNeed = _.uniq(Memory.shardNeed);
            while (Memory.shardNeed.length > 10) {
                Memory.shardNeed.shift();
            }
        }
        RawMemory.setActiveSegments(Memory.shardNeed);
        switch (Game.shard.name) {
            case 'shard0':
                break;

            case 'shard1':
                setMyPublicSegment([99]);
                analyzeOtherPlayerSegment([
                    //                ['Issacar', 99],
                    ['Geir1983', 99],
                    //                    ['Lolzor', 99],
                    //                  ['W4rl0ck', 99],
                    //['Tun9aN0', 99],
                    //   ['wolffman122', 99],
                    ['admon', 99],
                ]);
                break;
            case 'shard2':
                setMyPublicSegment([99]);
                //            offShardAnalyzeOtherPlayerSegment([
                //                    ['admon', 99],
                //              ]);
                break;
            case 'shard3':
                break;

        }


    }
}
module.exports = segmentCommand;