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
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY]

];


function getHostiles(creep) {
    let range = 4;
    let bads = creep.room.find(FIND_HOSTILE_CREEPS);
    return creep.pos.findInRange(bads, range);

}

function getEnergy(creep) {
    if (roleParent.constr.withdrawFromTombstone(creep)) {
        return;
    }
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

                    if (containerz[a].store[RESOURCE_ENERGY] > targetAmount) {
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
                    if (target.store[b])
                        creep.withdraw(target, b);
                }
                creep.memory.gotoID = undefined;

            } else {
                creep.pickup(target);
                creep.memory.gotoID = undefined;
            }
        } else {
            if (!roleParent.guardRoom(creep)) {
                creep.moveMe(target, {
                    ignoreRoads: _ignoreRoad,
                    maxRooms: 1,
                    useSKPathing: true,
                    reusePath: rePath,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });
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
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }
    static run(creep) {
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
        }
        if (creep.memory.gohome === undefined) {
            creep.memory.gohome = false;
        }
        //        creep.memory.task = [];
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
        if (creep.partyFlag !== undefined && (creep.partyFlag.color === COLOR_WHITE || creep.partyFlag.color === COLOR_BROWN)) {
            creep.memory.death = true;
        }

        let kept = Game.getObjectById(creep.memory.keeperLairID);
        if (kept !== null && !creep.memory.gohome) {
            if (kept.ticksToSpawn === undefined || kept.ticksToSpawn < 15) {

                creep.memory.gohome = true;
                creep.memory.empty = false;
                if (creep.carryTotal > 0) {
                    let sci = Game.getObjectById(creep.memory.scientistID);
                    if (sci !== null && creep.pos.isNearTo(sci)) {
                        if (sci.transfer(creep, sci.carrying) == OK)
                            return;
                    }
                }
                return;
            }
        }

        //!creep.memory.gohome &&
        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        }

        if (creep.carryTotal < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }
        let _goal = Game.getObjectById(creep.memory.goal);
        if (creep.partyFlag !== undefined && creep.partyFlag.memory.mineral) {
            if (!creep.memory.gohome) {
                if (!creep.atFlagRoom && creep.carryTotal === 0) {
                    if (creep.ticksToLive < 100) creep.memory.death = true;
                    creep.memory.goal = creep.partyFlag.memory.mineralID;
                    //                  if (!super.guardRoom(creep)) {
                    if (_goal === null) {
                        creep.moveMe(creep.partyFlag, { reusePath: 50, useSKPathing: true, swampCost: 1 });
                    } else {
                        creep.moveMe(_goal, { reusePath: 50, useSKPathing: true, swampCost: 1 });
                    }
                    //                    }
                    creep.say('zFlag');
                    return;
                } else {
                    creep.memory.goal = creep.room.mineral.id;
                    _goal = creep.room.mineral;
                    if(!creep.pos.inRangeTo(_goal,2)){
                        creep.moveMe(_goal, { reusePath: 50, useSKPathing: true, swampCost: 1 });
                    }else {

                        //creep.moveMe(creep.partyFlag);
                    }
                    return;
                }
                creep.memory.task = [];
            }
        }


        if (creep.memory.gohome) {
            if (creep.room.name === creep.memory.home) {
                if (!super.containers.moveToStorage(creep))
                    var zz = super.containers.moveToTerminal(creep);
            } else {

                let task = {};
                task.options = {
                    ignoreRoads: creep.room.name == 'E35S85' ? false : _ignoreRoad,
                    reusePath: rePath,
                    useSKPathing: true,
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

            if (creep.memory.party !== undefined && super.constr.withdrawFromTombstone(creep, 5, false)) {
                if (_goal !== null && _goal.mineralAmount === 0 && creep.carryTotal > 0) creep.memory.death = true;
                return true;
            }
            if (_goal !== null && creep.room.name == _goal.pos.roomName) {

                if (_goal.mineralAmount > 0) {
                    super.keeperFind(creep);
                    if (creep.memory.scientistID === undefined) {
                        if (!super.guardRoom(creep)) {
                            if (!creep.pos.inRangeTo(_goal, 2)) {
                                if (!super.guardRoom(creep)) {
                                    creep.moveMe(_goal, { reusePath: 50, useSKPathing: true, swampCost: 1 });
                                }
                            } else {
                                let sci = Game.getObjectById(creep.memory.scientistID);

                                if (creep.memory.level === 1) {
                                    if (!creep.smartHeal())
                                        //                                } else{&& creep.hits !== creep.hitsMax && sci !== null && sci.hits !== sci.hitsMax
                                        creep.sleep(15);
                                }
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
                                if (!super.guardRoom(creep)) {
                                    creep.moveMe(sci, { reusePath: 50, maxOpts: 100, useSKPathing: true });
                                    return;
                                }

                            } else {
                                super.keeperFind(creep);
                            }
                            if (sci.carryTotal > creep.carryCapacity >> 1) {
                                sci.transfer(creep, sci.carrying);
                            } else if (creep.ticksToLive < 150) {
                                sci.transfer(creep, sci.carrying);
                                creep.memory.goHome = true;
                            }

                            creep.say('go sci');
                            if (!creep.smartHeal()) creep.sleep(EXTRACTOR_COOLDOWN);
                        }
                    }
                    if (creep.ticksToLive < 100) {
                        creep.memory.gohome = true;
                        creep.memory.empty = false;
                    }
                } else {
                    creep.memory.reportDeath = true;
                    if (_goal !== null && _goal.room.name === creep.room.name) {
                        creep.say('Get Energy');
                        getEnergy(creep);
                    }
                }
            } else {
                // If in the same room and with in a square of 5 away from goal. 
                if (_goal !== null && _goal.room.name === creep.room.name) {
                    getEnergy(creep);
                } else if (creep.memory.gotoID === undefined || (creep.carryTotal === 0 && creep.memory.home == creep.room.name)) {
                    // )
                    var goingTo;
                    if (_goal === null) {
                        goingTo = super.movement.getRoomPos(creep); // this gets the goal pos.
                    } else {
                        goingTo = _goal.pos;
                    }

                    let task = {};
                    task.options = {
                        ignoreRoads: _ignoreRoad,
                        reusePath: rePath,
                        useSKPathing: true,
                        visualizePathStyle: pathVis
                    };
                    task.pos = goingTo;
                    task.energyPickup = true;
                    task.order = "moveTo";
                    task.enemyWatch = true;
                    task.happyRange = 1;
                    creep.memory.task.push(task);
                } else if (creep.memory.gotoID !== undefined) {
                    var zze = Game.getObjectById(creep.memory.gotoID);
                    if (zze !== null) {
                        if (!super.guardRoom(creep)) {
                            creep.moveMe(zze, { reusePath: 50, useSKPathing: true });
                        }

                    }

                }

            }

        }
    }

}
module.exports = transportz;