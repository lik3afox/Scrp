var classLevels = [
    // Level 0
    //  Transport - 500 Carry/900 Energy

    [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY], //  900
    // Level 1 - 750 Carry 1250 Energy
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1250
    // Level 2 1000 Carry - 1750 Energy
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY,
    ], // 1750
    // Level 3 1250 Carry - 2200 Energy.
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //2000
    // Level 4 1550 carry 2600 Energy - Required Lv 7 
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
    ], //2600


    // Level 5
    {
        body: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
        ],
        boost: ['KH'],
    },
    // Level 6
    {
        body: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE
        ],
        boost: ['KH'],
    },
    // MAX level 7
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK,
        MOVE, WORK
    ]

];
var roleParent = require('role.parent');
var visPath = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};

function emptied(creep) {
    if (creep.ticksToLive < creep.memory.distance * 2) {
        if (!creep.memory.reportDeath) { //&& creep.ticksToLive < creep.memory.distance
            let spawnsDo = require('commands.toCreep');
            spawnsDo.reportDeath(creep);
        }
        creep.memory.death = true;
    }
    creep.countReset();
}



function updateMemory(creep, actionObjects) {
    if (creep.memory.atSource === undefined) {

        creep.memory.atSource = false;
    }       
    if (creep.memory.isSkGoal === undefined) {
        creep.memory.isSkGoal = actionObjects.goalPos.isSkRoom();
    }

    if (creep.memory.goHome === undefined) {
        creep.memory.goHome = false;
    }

    if (creep.memory.goHome) {
        if (creep.carryTotal < 100) { //|| empting
            emptied(creep);
            creep.memory.moveToStorageAction = undefined;
            creep.memory.goHome = false;
        } else if(creep.room.storage && creep.pos.isNearTo(creep.room.storage)){
            emptied(creep);
            creep.memory.moveToStorageAction = undefined;
            creep.memory.goHome = false;
            if(creep.carryAvailable < (creep.room.storage.storeCapacity-creep.room.storage.total)){
                actionObjects.withdrawStorage = true;
            } else {
                actionObjects.dropEnergy = true;
            }
        }
        creep.memory.atSource = false;
        creep.memory.tombStoneID = undefined;
        creep.memory.maker = undefined;

    } else {
        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.goHome = true;
            creep.memory.atSource = false;
            creep.memory.tombStoneID = undefined;
        }
        creep.memory.maker2 = undefined;

        if (creep.memory.isSkGoal && creep.memory.tombStoneID === undefined && creep.pos.inRangeTo(actionObjects.goalPos, 5)) {
            let lyrer = Game.getObjectById(creep.memory.keeperLairID);
            if (lyrer && (!lyrer.ticksToSpawn || lyrer.ticksToSpawn < 10)) {
                actionObjects.DONOTMOVE = true;
            }
            var tombStone = creep.pos.findInRange(FIND_TOMBSTONES, 7);
            tombStone = _.filter(tombStone, function(o) {
                return o.total > 0;
            });
            if (tombStone.length === 0) {
                creep.memory.tombStoneID = null;
            } else {
                creep.memory.tombStoneID = tombStone[0].id;
            }
        }


        if (creep.memory.workContain === undefined && creep.pos.inRangeTo(actionObjects.goalPos, 3)) {

            let contain = creep.room.find(FIND_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_CONTAINER
                }
            });
            if (contain.length === 0) {} else {
                contain = _.filter(contain, function(o) {
                    return o.pos.isNearTo(actionObjects.goalPos);
                });

                //contain = actionObjects.goalPos.findClosestByRange(contain);
                if (contain.length > 0) {
                    creep.memory.workContain = contain[0].id;
                } else {
                    creep.sleep(50);
                }
            }
        } else if (creep.pos.inRangeTo(actionObjects.goalPos, 2)) {
            creep.memory.atSource = true;
        } /*else if (actionObjects.container && creep.pos.isNearTo(actionObjects.container)) {
            //   creep.moveMe(actionObjects.goalPos, { reusePath: 50, segment: true, ignoreCreeps: true, visualizePathStyle: visPath });
          //  creep.memory.atSource = true;
        } *///else {
            //creep.memory.atSource = false;
        //}

       
        if (creep.memory.stuckCount > 0 && creep.pos.getRangeTo(actionObjects.container) === 2) {
            //            console.log('creep atSource so stopping', roomLink(creep.room.name));
//            creep.memory.atSource = true;
            creep.sleep(10);
            creep.cleanMe();
        }



        if (actionObjects.container && creep.pos.isNearTo(actionObjects.container)) {
            
            if(toStorageCache&& toStorageCache[creep.memory.goal]  && toStorageCache[creep.memory.goal].startPos){
                var tst = toStorageCache[creep.memory.goal].startPos;
                creep.room.visual.text('M',tst.x,tst.y);
//                var goTo = new RoomPosition(sourceCache.startPos.x, sourceCache.startPos.y, sourceCache.startPos.roomName);

            }

            if (!creep.memory.tombStoneID) {
            if(!creep.memory.goalDistance){
                creep.memory.goalDistance = 75;
                let spn = Game.rooms[creep.memory.home].alphaSpawn;
                for(let i in spn.memory.roadsTo){
                    let remoteInfo = spn.memory.roadsTo[i];
                    if(remoteInfo.source === creep.memory.goal && remoteInfo.distance){
                        creep.memory.goalDistance = remoteInfo.distance;
                    }
                }
            }

                if(creep.ticksToLive < creep.memory.goalDistance){
                    actionObjects.withdrawContainer = true;
                    roleParent.segment.requestRoomSegmentData(creep.memory.home);
                    creep.memory.goHome = true;
                } else 
                 if (actionObjects.container.total >= creep.carryAvailable) {
                        actionObjects.withdrawContainer = true;
                        roleParent.segment.requestRoomSegmentData(creep.memory.home);
                        creep.memory.goHome = true;
                }  else {
                    creep.sleep(3);
                    creep.cleanMe();
                }
                if (creep.memory.keeperLairID) {
                        let lyrer = Game.getObjectById(creep.memory.keeperLairID);
                        if (lyrer && (!lyrer.ticksToSpawn || lyrer.ticksToSpawn < 10)) {
                            actionObjects.withdrawContainer = true;
                            creep.memory.goHome = true;
                        }
                } else {
                        roleParent.keeperFind(creep);
                }
            }
            creep.memory._move = undefined;
            creep.memory.cachePath = undefined;
            creep.memory.position = undefined;
            creep.countReset();

        }
    }
    return actionObjects;
}

function interactContainer(creep, actionObjects) {
        if(actionObjects.withdrawStorage){
            if (creep.transfer(creep.room.storage, creep.carrying) == OK) {
                return actionObjects;
            }
        }else if (actionObjects.dropEnergy) {
            creep.drop(RESOURCE_ENERGY);
            console.log('ROOM MAXED OUT, BAD CREEP DROPPING ENERGY', roomLink(creep.room.name), 'Adding upgrade to flag.');
            Game.notify(creep.room.name + "  Terminal and Storage Full DropEnergy!!!  ", 120);
            return actionObjects;
        } else if(actionObjects.withdrawContainer){
            creep.withdraw(actionObjects.container, actionObjects.container.storing);            
        }
    return actionObjects;
}

function movement(creep, actionObjects) {
    if (actionObjects.DONOTMOVE) {
        return actionObjects;
    }
    //if(creep.memory._move && creep.memory._move.path.length === 0 ){
  //      console.log(roomLink(creep.room.name),creep.memory._move.path.length,creep.memory._move.dest.x,creep.memory._move.dest.y,creep.memory._move.dest.roomName,creep.memory.maker);
//    }
    if (creep.memory.goHome) {
        creep.countDistance();
            //if (creep.memory.home === 'E54S53') {
                pickupAndCacheMovementToStorage(creep, actionObjects);
            /*} else {
                creep.moveMe(Game.rooms[creep.memory.home].storage, {
                    reusePath: 50,
                    segment: true,
                    ignoreCreeps: true,
                    visualizePathStyle: visPath
                });
            } */
    } else if (actionObjects) {
        if (creep.memory.tombStoneID) {
            let tTombstone;
            if (!tTombstone) tTombstone = Game.getObjectById(creep.memory.tombStoneID);
            if (!tTombstone || tTombstone.total === 0) {
                creep.memory.tombStoneID = null;
            } else {
                if (creep.pos.isNearTo(tTombstone)) {
                    creep.withdraw(tTombstone, tTombstone.storing);
                } else {
                    creep.moveMe(tTombstone, { reusePath: 50, maxRooms: 1 });
                }
            }
        } else if(creep.memory.atSource && toStorageCache && toStorageCache[creep.memory.goal] && toStorageCache[creep.memory.goal].startPos){
            var goTo = new RoomPosition(toStorageCache[creep.memory.goal].startPos.x, toStorageCache[creep.memory.goal].startPos.y, toStorageCache[creep.memory.goal].startPos.roomName);
            if(!creep.pos.isEqualTo(goTo)){
                creep.moveMe(goTo,{swampCost:0});
                creep.say('W');
            }
        }else if (!creep.memory.atSource) {
            toSourceCacheMove(creep, actionObjects.goalPos);
        }  else if ((actionObjects.container && creep.pos.isEqualTo(actionObjects.container)) || (!actionObjects.container && creep.pos.isNearTo(actionObjects.goalPos))) {
            creep.dance();
            creep.say('Dnce');
            creep.sleep(3);
        } else if (actionObjects.container && !creep.pos.isNearTo(actionObjects.container)) {
            creep.moveMe(actionObjects.container, { reusePath: 50, segment: true, ignoreCreeps: true, swampCost: 1, visualizePathStyle: visPath });
        }
    }
}

var toStorageCache;
var GOTOSPOT = 1;
var GOTOSTORAGE = 2;

function pickupAndCacheMovementToStorage(creep, actionObjects) {
    var skPath = false;
    if(Memory.firstTick && creep.memory.maker2){
        creep.memory.maker2 = false;
    }
    if (!creep.memory.moveToStorageAction) { // THis gets cleared by having less than 20 energy
        creep.memory.moveToStorageAction = GOTOSPOT;
    }
    var homeStorage = Game.rooms[creep.memory.home].storage;
    if (creep.memory.stuckCount > 3 ) {
        return creep.moveMe(homeStorage, { useSKPathing: skPath, visualizePathStyle: visPath , maxOpts:10 });
    }


    var id = creep.memory.goal;
    if (toStorageCache === undefined) {
        toStorageCache = {};
    }
    if (toStorageCache[id] === undefined) {
        //console.log('Created ID cache', id);
        toStorageCache[id] = {};
    }
    var sourceCache = toStorageCache[id];
    if(sourceCache.startPos === undefined && creep.carryTotal > 0){
        
    }
    if(sourceCache.startPos === false){
        return creep.moveMe(homeStorage, { reusePath: 50, ignoreCreeps: true,segment: true, useSKPathing: skPath, visualizePathStyle: visPath });
    }else if (sourceCache.startPos === undefined && creep.pos.inRangeTo(actionObjects.goalPos,2) && creep.ticksToLive > 200 && actionObjects.container) {
        
        var roads = _.filter(actionObjects.container.pos.findInRange(FIND_STRUCTURES, 1), function(o) {
            return o.structureType === STRUCTURE_ROAD;
        });
        if (roads.length === 0) {
            // No road next to cotainer
            console.log(creep, "Looking for road next to container FAIL use segment",roomLink(creep.room.name), actionObjects.goalPos);
            sourceCache.startPos = false;
            return creep.moveMe(homeStorage, { reusePath: 50, ignoreCreeps: true,segment: true, useSKPathing: skPath, visualizePathStyle: visPath });
        }
        sourceCache.startPos = roads[0].pos;
        creep.memory.maker2 = true;
        if (creep.pos.isEqualTo(roads[0])) {
            creep.memory.moveToStorageAction = GOTOSTORAGE;            
        }
    } else if(!creep.memory.maker2 && (!sourceCache.startPos || !sourceCache.pathCache || !sourceCache.pathCache[creep.room.name] )) {
        let stu = creep.moveMe(homeStorage, { reusePath: 50, ignoreCreeps: true,segment: true, useSKPathing: skPath, visualizePathStyle: visPath });
        return stu;
    }

    if(creep.memory.maker2){
        creep.room.visual.circle(creep.pos, { radius: 0.5, opacity: 0.75, fill: '030303' });            
    }

    if (sourceCache.pathCache === undefined) {
        //        console.log("Created PathCache");
        sourceCache.pathCache = {};
    }

    var pathCache = sourceCache.pathCache;

    if (creep.memory.moveToStorageAction === GOTOSPOT && sourceCache.startPos) {
        var goTo = new RoomPosition(sourceCache.startPos.x, sourceCache.startPos.y, sourceCache.startPos.roomName);
        if (creep.pos.isEqualTo(goTo)) {
            creep.memory.moveToStorageAction = GOTOSTORAGE;
        }
    }

        var path;
        if (pathCache[creep.room.name] === undefined) {
            if (!creep.memory.maker2) {
                return creep.moveMe(homeStorage, { reusePath: 50, ignoreCreeps: true,segment: true, useSKPathing: skPath, visualizePathStyle: visPath });
            }
            
            path = creep.pos.findPathTo(homeStorage, { reusePath: 50, ignoreCreeps: true, useSKPathing: skPath, visualizePathStyle: visPath });
            pathCache[creep.room.name] = Room.serializePath(path);
            //  console.log('Added Path Cache', pathCache[creep.room.name]);
        } else {
            path = pathCache[creep.room.name];
        }

        if(creep.memory.maker2 && (creep.pos.isNearTo(homeStorage)||(creep.carryTotal < 100 && creep.isHome ))){
            creep.memory.maker2 = false;
        }

    
        var rsut = creep.moveByPath(path);

        if (rsut === OK) {
            creep.memory.cachePath = path;
            creep.say('🏆', true);
            if (creep.memory.stuckCount === undefined) {
                creep.memory.stuckCount = 0;
            }
            if (creep.memory.lastLoc) {
                if (creep.pos.x === creep.memory.lastLoc.x && creep.pos.y === creep.memory.lastLoc.y) {
                    creep.memory.stuckCount++;
                } else {
                    creep.memory.stuckCount = 0;
                }
            }
            creep.memory.lastLoc = {
                x: creep.pos.x,
                y: creep.pos.y
            };
        } else if(rsut === ERR_TIRED ){

        } else {
            let rst = creep.moveMe(homeStorage, { reusePath: 50,  ignoreCreeps: true,segment: true, useSKPathing: skPath, visualizePathStyle: visPath });
            creep.say(rsut, true);
            return rst;
        } 
    return rsut;
}

var toSourceCache;

function toSourceCacheMove(creep, goalPos) {
    var skPath = false;
    if(Memory.firstTick && creep.memory.maker){
        creep.memory.maker = false;
    }
    if (creep.memory.stuckCount > 3 || creep.memory.noMoreCache === creep.room.name) {
        return creep.moveMe(goalPos, { reusePath: 50, ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath, visualizePathStyle: visPath });
    }
    var id = creep.memory.goal;
    if (toSourceCache === undefined) {
        console.log('Created Base');
        toSourceCache = {};
    }
    if (toSourceCache[id] === undefined) {
        //console.log('Created ID cache', id);
        toSourceCache[id] = {};
    }

    var sourceCache = toSourceCache[id];
    if (sourceCache.startPos === undefined) {
        if (creep.isHome && (creep.pos.x === 1 || creep.pos.x === 48 ||creep.pos.y === 1 || creep.pos.y === 48)  && creep.memory._move && creep.memory._move.path.length > 5 && creep.ticksToLive > 200) {
            var direction = creep.memory._move.path[5];
            var ed = getFormationPos(creep, direction);
            if (ed && (ed.x == 0 || ed.y == 49 || ed.x === 49 || ed.y === 0)) {
                sourceCache.startPos = ed;
                creep.memory.maker = true;
                //              console.log('added Start Pos', id, sourceCache.startPos);
            }
        } else if(creep.memory.maker){
            creep.memory.maker = undefined;
        }
        creep.say('M?');
        let rsult = creep.moveMe(goalPos, { reusePath: 50, ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath,  visualizePathStyle: visPath });
        return rsult;
    }
    if (sourceCache.pathCache === undefined) {
        //        console.log("Created PathCache");
        sourceCache.pathCache = {};
    }

    var pathCache = sourceCache.pathCache;
    //if (!sourceCache.startPos) {
        // NO adding to pathCache until startPos is made.
        //return creep.moveMe(goalPos, { reusePath: 50, ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath, visualizePathStyle: visPath });
    //}
    // Problem - is that paths are created by someone other than the startPos guy;
    if (creep.isHome) {
        var goTo = new RoomPosition(sourceCache.startPos.x, sourceCache.startPos.y, sourceCache.startPos.roomName);
        creep.room.visual.circle(goTo, { radius: 0.5, opacity: 0.75, fill: '0f000F' });
        return creep.moveMe(goTo, { reusePath: 50, ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath, visualizePathStyle: visPath });
    }

    var path;

    if (pathCache[creep.room.name] === undefined) {
        if (creep.memory.maker) {
            path = creep.pos.findPathTo(goalPos, { ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath});
            pathCache[creep.room.name] = Room.serializePath(path);            
        } else {
            return creep.moveMe(goalPos, { reusePath: 50, ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath, visualizePathStyle: visPath });
        }
        //  console.log('Added Path Cache', pathCache[creep.room.name]);
    } else {
        path = pathCache[creep.room.name];
    }

    var rsut = creep.moveByPath(path);
            if(creep.memory.maker && creep.memory.atSource){
                creep.memory.maker = undefined;
            }
if(creep.memory.maker){
    creep.room.visual.circle(creep.pos, { radius: 0.5, opacity: 0.75, fill: '110F0F' });
}
    if (rsut === OK) {
        creep.say('@$', true);
        creep.memory.cachePath = path;        
        if (creep.memory.stuckCount === undefined) {
            creep.memory.stuckCount = 0;
        }
        if (creep.memory.lastLoc) {
            if (creep.pos.x === creep.memory.lastLoc.x && creep.pos.y === creep.memory.lastLoc.y) {
                // Stuck stuff here.
                creep.memory.stuckCount++;
            } else {
                creep.memory.stuckCount = 0;
            }
        }
        creep.memory.lastLoc = {
            x: creep.pos.x,
            y: creep.pos.y
        };
    } else if(rsut === ERR_TIRED ){

    } else {
        //        console.log(creep, creep.pos, 'Doing move by path fail', rsut);
//        creep.memory.noMoreCache = creep.room.name;
        creep.say(rsut, true);
        return creep.moveMe(goalPos, { reusePath: 50, ignoreRoads: true, swampCost: 1, ignoreCreeps: true, useSKPathing: skPath, visualizePathStyle: visPath });
    }
    return rsut;
}

class transport extends roleParent {
    static keeperFind(creep) {
        return super.keeperFind(creep);
    }
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return _.shuffle(classLevels[level]);
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle(classLevels[level].body);
        } else {
            return classLevels[level];
        }
    }
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    static run(creep) {

        super.rebirth(creep);
        if (super.movement.runAway(creep)) return;
        if (super.spawnRecycle(creep)) return;
        //        if (super.boosted(creep)) return;

        var actionObjects = {
            container: Game.getObjectById(creep.memory.workContain),
            goalPos: roleParent.movement.getSourcePos(creep), // This gains a pos roomPosition returned
        };
        /*
        let goal = Game.getObjectById(creep.memory.goal);
        if (goal && goal.pos.x !== actionObjects.goalPos.x || goal && goal.pos.y !== actionObjects.goalPos.y) {
            console.log(roomLink(creep.room.name), goal.pos.x, goal.pos.y, actionObjects.goalPos.x, actionObjects.goalPos.y, creep.memory.goal);
            creep.memory.getSourcePos = undefined;
        }*/
        /*if(actionObjects){
            console.log(actionObjects.container,actionObjects.goalPos);
        }*/

        actionObjects = updateMemory(creep, actionObjects);
        actionObjects = interactContainer(creep, actionObjects);
        actionObjects = movement(creep, actionObjects);

    }
}
module.exports = transport;