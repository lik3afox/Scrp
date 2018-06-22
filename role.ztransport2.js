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

function getMineral(creep) {
    let sci = Game.getObjectById(creep.memory.scientistID);
    if (sci === null) {
        creep.memory.goHome = true;
        creep.memory.empty = false;
        creep.memory.scientistID = undefined;

        return;
    } else {
        if (!creep.pos.isNearTo(sci)) {
            if (!super.guardRoom(creep)) {
                creep.moveMe(sci, { reusePath: 50, maxOpts: 100, useSKPathing: true });
                return;
            }

        } else {
            if (creep.carryTotal > 0) {
                if (sci.transfer(creep, sci.carrying) == OK)
                    return;
            }
            super.keeperFind(creep);
        }
        if (creep.ticksToLive < 50) {
            sci.transfer(creep, sci.carrying);
            creep.memory.goHome = true;
        }


        creep.say('go sci');
        if (creep.pos.isNearTo(sci)) creep.sleep(EXTRACTOR_COOLDOWN);
    }

    return;


}

function getHostiles(creep) {
    let range = 4;
    let bads = creep.room.find(FIND_HOSTILE_CREEPS);
    return creep.pos.findInRange(bads, range);

}

function goHome(creep) {
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
        task.pos = Game.rooms[creep.memory.home].storage.pos;
        task.order = "moveTo";
        task.enemyWatch = true;
        task.room = true;
        creep.memory.task.push(task);

    }

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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    static run(creep) {
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
        }
        if (creep.memory.goHome === undefined) {
            creep.memory.goHome = false;
        }
        if (super.doTask(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;
        //        super.rebirth(creep);
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.movement.runAway(creep)) {
            return;
        }

        if (creep.partyFlag !== undefined && (creep.partyFlag.color === COLOR_WHITE || creep.partyFlag.color === COLOR_BROWN)) {
            creep.memory.death = true;
        }

        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.goHome = true;
            creep.memory.empty = false;
        }

        if (creep.carryTotal < 20) {
            creep.memory.goHome = false;
            creep.memory.empty = true;
        }

        // Two modes for ztransports
        // mode 1 is where they have a scientist to take off of,
        // mode 2 is where they have to collect energy from the room.

        // First off we get goal info.
        let _goal = Game.getObjectById(creep.memory.goal);
        var goingTo;
        if (_goal === null) {
            if (creep.memory.party === undefined) {
                goingTo = super.movement.getRoomPos(creep); // this gets the goal pos.
            } else {
                goingTo = creep.partyFlag;
            }
        } else {
            goingTo = _goal;
        }

        if (!creep.memory.goHome) {
            if (_goal !== null && _goal.room.name === creep.room.name) {
                if (_goal.mineralAmount !== undefined && _goal.mineralAmount > 0) {
                    getMineral(creep);
                } else if (creep.memory.party === undefined) {
                    creep.memory.reportDeath = true;

                    creep.say('Get Energy');
                    getEnergy(creep);
                }
            } else if (_goal !== null) {
                creep.moveMe(_goal, { reusePath: 50 });
            }


        } else {
            goHome(creep);
        }

    }

}
module.exports = transportz;