var roleParent = require('role.parent');
var rePath = 100;
var _ignoreRoad = true;
var pathVis = {
    fill: 'transparent',
    stroke: '#ff0',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};

var classLevels = [
    // MAX level 6 
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]

];


function getHostiles(creep) {
    let range = 4;
        let bads = creep.room.find(FIND_HOSTILE_CREEPS);
        return creep.pos.findInRange(bads, range);

}

function getEnergy(creep) {
    if (creep.memory.gotoID === undefined) {


        let target; // This is where you want to go. 
        let targetAmount = 0;
        let isDropped = true;
        var tmp = creep.room.find(FIND_DROPPED_RESOURCES);

        if (tmp.length === 0) {
            isDropped = false;
        } else {
            for (var e in tmp) {
                if (tmp[e].amount > targetAmount && tmp[e].amount >= 100) {
                    targetAmount = tmp[e].amount;
                    target = tmp[e].id;
                }
            }
        }

        if (targetAmount < 200) { // If the energy on the gound is now. then
            //var min = Game.getObjectById(creep.room.memory.mineralID);

            var containerz = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_CONTAINER);
                }
            });

            if (containerz.length > 0) {
                for (let a in containerz) {

                    if ((containerz[a].store[RESOURCE_ENERGY] * 0.75) > targetAmount) {
                        target = containerz[a].id;
                        targetAmount = containerz[a].store[RESOURCE_ENERGY];
                        //            isDropped = true;
                    }
                    if (containerz[a].total !== 0 && containerz[a].store[RESOURCE_ENERGY] === 0) {
                        target = containerz[a].id;
                        break;
                    }

                }
            }

        }

        creep.memory.gotoID = target;

    }


    let target = Game.getObjectById(creep.memory.gotoID);
    if (target !== null) {

        // Then it goes to it.

        // Once picked up, clears memory so it can pick up something new.
        if (creep.pos.isNearTo(target)) {

            if (target.structureType === STRUCTURE_CONTAINER) {
                for (var b in target.store) {
                    if(target.store[b])
                        creep.withdrawing(target, b);
                }
                creep.memory.gotoID = undefined;

            } else {
                creep.pickup(target);
                creep.memory.gotoID = undefined;
            }
        } else {
            var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
            if (bads.length === 0) {
                //if(!super.avoidArea(creep)) { 

                creep.moveMe(target, {
                    ignoreRoads: _ignoreRoad,
                    maxRooms: 1,
                    reusePath: rePath,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });
                //                  }
            }
        }
        if (target.structureType === STRUCTURE_CONTAINER && _.sum(target.store) === 0) {
            creep.memory.gotoID = undefined;
        }

    } else {
        creep.memory.gotoID = undefined;
    }

}

class transportz extends roleParent {

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }
    static run(creep) {
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
        }
        if (creep.memory.gohome === undefined) {
            creep.memory.gohome = false;
        }

        if (super.doTask(creep)) {
            return;
        }
        if (super.link.transfer(creep)) {
            creep.countReset();
            return;
        }
        if (super.depositNonEnergy(creep)) return;
        super.rebirth(creep);
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.movement.runAway(creep)) {
            return;
        }

        let kept = Game.getObjectById(creep.memory.keeperLairID);
        if (kept !== null && !creep.memory.gohome) {
            if (kept.ticksToSpawn === undefined || kept.ticksToSpawn < 15) {

                creep.memory.gohome = true;
                creep.memory.empty = false;
                if (creep.carryTotal > 0) {
                    let sci = Game.getObjectById(creep.memory.scientistID);
                    if (sci !== null && creep.pos.isNearTo(sci)) {
                        for (var e in sci.carry) {

                            if (sci.carry[e] && sci.transfer(creep, e) == OK)
                                return;
                        }
                    }
                }
                return;
            }
        }


        if (!creep.memory.gohome && creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        }

        if (creep.carryTotal < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }
        let _goal = Game.getObjectById(creep.memory.goal);

        if (creep.memory.gohome) {
            if (creep.room.name === creep.memory.home) {
                if (!super.containers.moveToStorage(creep))
                    var zz = super.containers.moveToTerminal(creep);
            } else {

                let task = {};
                task.options = {
                    ignoreRoads: creep.room.name == 'E35S85' ? false : _ignoreRoad,
                    reusePath: rePath,
                    visualizePathStyle: pathVis
                };
                task.pos = Game.getObjectById(creep.memory.parent).pos;
                task.order = "moveTo";
                task.enemyWatch = true;
                task.room = true;
                creep.memory.task.push(task);

            }

        } else { // IF not going home. 
            //

            if (_goal !== null && creep.room.name == _goal.pos.roomName) {

                if (_goal.mineralAmount > 0) {
                    if (creep.memory.scientistID === undefined) {
                        if (!super.guardRoom(creep)) {
                            if (!creep.pos.inRangeTo(_goal, 3)) {
                                creep.moveMe(_goal, { reusePath: 50 });
                            }
                        }
                        creep.say('mv Min');
                    } else {
                        let sci = Game.getObjectById(creep.memory.scientistID);
                        if (sci === null) {
                            if (creep.carryTotal > 0) {
                                creep.memory.gohome = true;
                            }
                            creep.memory.scientistID = undefined;
                        } else {
                            if (creep.room.name == sci.pos.roomName && !creep.pos.isNearTo(sci)) {
var bads = getHostiles(creep);
                            if(bads.length === 0)
                                creep.moveTo(sci, { reusePath: 50, maxOpts: 100 });

                            }/* else if (creep.pos.isNearTo(sci) && sci.carryTotal > (creep.carryCapacity - creep.carryTotal)) {
                                for (var z in sci.carry) {
                                    if (sci.transfer(creep, z) == OK)
                                        return;
                                }
                            } */ else {
                                super.keeperFind(creep);
                            }
                            creep.say('go sci');
                        }
                    }
                    if (creep.ticksToLive < 100) {
                        creep.memory.gohome = true;
                        creep.memory.empty = false;
                    }
                } else {
                    if (_goal !== null && _goal.room.name === creep.room.name) {
                        creep.say('Get Energy');
                        getEnergy(creep);
                    }
                }
            } else {
                // If in the same room and with in a square of 5 away from goal. 
                if (_goal !== null && _goal.room.name === creep.room.name) {
                    getEnergy(creep);
                } else  if (creep.memory.gotoID === undefined|| (creep.carryTotal === 0 && creep.memory.home == creep.room.name)){
                    // )
                    var goingTo;
                    if (_goal === null) {
                        goingTo = super.movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                    } else {
                        goingTo = _goal.pos;
                    }

                    let task = {};
                    task.options = {
                        ignoreRoads: _ignoreRoad,
                        reusePath: rePath,
                        visualizePathStyle: pathVis
                    };
                    task.pos = goingTo;
                    task.order = "keeperMoveTo";

                    task.happyRange = 0;
                    creep.memory.task.push(task);
                } else if (creep.memory.gotoID !== undefined ){
                    var zze = Game.getObjectById(creep.memory.gotoID);
                    if(zze !== null){
                        creep.moveTo(zze,{reusePath:50});
                    }

                }

            }

        }
    }

}
module.exports = transportz;