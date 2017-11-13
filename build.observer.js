var observers = ['59aee0acae855116d42aaff7','59c1d51712c6322c527647d1','59b8299536dabe15ba6d1f99','59a2fa6f51963d5833d4b53a'];
//'E32S70',
var roomsObserve = [
'E20S40',
'E29S40','E28S40','E27S40','E26S40','E25S40','E24S40','E23S40','E22S40','E21S40',
'E20S31','E20S32','E20S33','E20S34','E20S35','E20S36','E20S37','E20S38','E20S39',

];
var linksCache = [];

function getCached(id) {
    if (linksCache[id] === undefined) {
        linksCache[id] = Game.getObjectById(id);
    }
    return linksCache[id];
}

function doTask(tasks) {
    var target;
    if (tasks.length === 0) return false;
    let task = tasks[0];
    switch (task.order) {
        case "observer":
            let options = task.order.options;
            for (var a in observers) {
                let ob = getCached(observers[a]);
                for (var e in task.options) {
                    if (e == 'room') target = task.options[e];
                }
                if (ob !== null) {
                    var distance = Game.map.getRoomLinearDistance(ob.room.name, target);
                           console.log(roomLink(target),"distance:",distance,ob,"doing the task of",task.order,"for "+task.options.timed+ "longer");
                    if (distance <= 10) {
                        if (ob.observeRoom(target) == OK) {
                            task.options.timed--;
                            if (task.options.timed === 0) {
                                tasks.shift();
                            }
                            return;
                        }
                    } else {
                        task.options.timed--;
                        if (task.options.timed === 0) {
                            tasks.shift();
                        }
                    }
                }
            }

            break;
    }
}

class buildObserver {

    static reqestRoom(theroom, thetimed) {
        var request = { order: "observer", options: { room: theroom, timed: thetimed } };
        if (_.find(Memory.observerTask, function(o) {
                return o.options.room == theroom;
            })) {
            return false;
        }
        Memory.observerTask.push(request);
    }

    static doRoom(theroom) {
        for (var e in observers) {
            let stru = getCached(observers[e]);
            stru.observeRoom(theroom);
        }
    }

    static run() {
        if (Memory.observerNum === undefined) {
            Memory.observerNum = 0;
        }
        if (Memory.observerTask === undefined) {
            Memory.observerTask = [];
        }
        if (Memory.observerTask.length > 0) {
            doTask(Memory.observerTask);
            return;
        }

        if (Memory.observerNum > roomsObserve.length - 1) Memory.observerNum = 0;
        let target = roomsObserve[Memory.observerNum];

        console.log(Memory.observerNum,roomsObserve.length,"Observering room:",target,"seeing:",Game.rooms[target],'|Tasks:'+Memory.observerTask.length);

        if (Game.rooms[target] === undefined) {
            // Then we observer
            for (var e in observers) {
                let stru = getCached(observers[e]);
                if(stru !== undefined) {
                var distance = Game.map.getRoomLinearDistance(stru.room.name, target);
                if (distance <= 10) {
                    stru.observeRoom(target);
                }
                }
            }
        } else {

            let screeps = Game.rooms[target].find(FIND_CREEPS);

            screeps = _.filter(screeps, function(s) {
                return s.owner.userName == 'Screeps';
            });

            if(screeps.length > 0){
                let direction;
                let troom = Game.rooms[target];
/*                if(troom.room.memory.caravanPos = undefined) {
                    troom.room.memory.caravanPos = new RoomPosition(screeps[0].x,screeps[0].y,screeps[0].roomName);
                    troom.room.memory.timedPos = screeps[0].ticksToLive;
                } else {
                    var pos = new RoomPosition(troom.room.memory.caravanPos.x,troom.room.memory.caravanPos.y,troom.room.memory.caravanPos.roomName );
                    if(!pos.isEqualTo(screeps[0].pos)&&(troom.room.memory.timedPos - screeps[0].ticksToLive) > 5 ){
                        direction = pos.getDirectionTo(screeps[0].pos);
                    }
                }*/

                if(direction !== undefined) {
                    // Estimate the room the caravan will be in lets stay 300 ticks.

                    var targetRoom;
                    switch(direction) {
    case TOP: 
    // Heading North;

         // target is the room name - it gets +3 North rooms.
         // So example if target is E10S32 - E10S29
    break;
    case BOTTOM: 
    // Heading South
         // target is the room name - it gets +3 south rooms.
         // So example if target is E10S32 - E10S25 
         // Place a flag in that room 
         //targetRoom = parse

    break;
    case RIGHT:
    // Heading East
    break;
    case LEFT: 
    // Heading weest
    break;

    case TOP_RIGHT: 
    case BOTTOM_RIGHT: 
    case BOTTOM_LEFT: 
    case TOP_LEFT:
    break;
                    }
                }
                console.log('FOUND CARAVAN ',screeps.length,screeps.pos,direction);
                for (var o in observers) {
                    let stru = getCached(observers[o]);
                    if(stru !== null)
                        stru.observeRoom(target);
                }


            }

            let powerBank = Game.rooms[target].find(FIND_STRUCTURES);
            powerBank = _.filter(powerBank, function(s) {
                return s.structureType == STRUCTURE_POWER_BANK;
            });
            if (powerBank.length > 0) {
                let power = require('commands.toPower');

                power.analyzePowerBank(powerBank[0], Game.rooms[target]);

                for (var oe in observers) {
                    let stru = getCached(observers[oe]);
                    if(stru !== null)
                        stru.observeRoom(target);
                }

            }
            Memory.observerNum = Memory.observerNum + 1;

        }


        // Then we analyze

    }


}

module.exports = buildObserver;

// 11,14 E25S74
