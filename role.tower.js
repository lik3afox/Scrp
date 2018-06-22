// Role just to fill up towers and nothing else. 

var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ]
];
var roleParent = require('role.parent');

var containers = require('commands.toContainer');
var constr = require('commands.toStructure');

function getEnergy(creep) {
    //    if (creep.room.name == 'E35S83') {
    //        creep.say('E38');
    var bads = creep.room.find(FIND_HOSTILE_CREEPS);
    if (bads.length > 0) {
        if (!containers.withdrawFromStorage(creep)) {
            creep.moveTo(Game.flags[creep.memory.party]);
        }
    } else {

        var close = creep.room.find(FIND_DROPPED_RESOURCES);
        if (close.length === 0) {
            if (!containers.withdrawFromStorage(creep)) {
                
            }
            return;
        }
        let high = _.max(close,a=>a.amount);

        if (creep.pos.isNearTo(high)) {
            creep.pickup(high);
        } else {
            creep.moveTo(high, {
                maxRooms: 1,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#f0f',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        }

    }
    return;
    //   }

}

class towerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if( _.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level]) ) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return classLevels[level].boost;
        }
        return;
    }

    static run(creep) {

        if (creep.carry[RESOURCE_ENERGY] > 0) {
            let zz;
            if (creep.memory.towerTargetID === undefined) {
                zz = creep.room.find(FIND_STRUCTURES, { filter: o => o.energy < 900 && o.structureType == STRUCTURE_TOWER });
                if (zz.length > 0)
                    creep.memory.towerTargetID = zz[0].id;

            }
            if (creep.memory.towerTargetID === undefined) {
                var storage = creep.room.storage;
                if (!creep.pos.isNearTo(storage)) {
                    creep.moveTo(storage);
                } else {
                    for (var e in creep.carry) {
                        creep.transfer(storage, e);
                    }
                }
                return;
            }
            let target = Game.getObjectById(creep.memory.towerTargetID);
            if (target !== null) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.moveMe(target);
                }
                if (target.energy > target.energyCapacity - 100)
                    creep.memory.towerTargetID = undefined;

                // Find towers and fill them
            } else {

                creep.memory.towerTargetID = undefined;
            }
        } else {

            getEnergy(creep);
        }

    }
}

module.exports = towerClass;