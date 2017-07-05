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
    if (creep.room.name == 'E35S83') {
        creep.say('E38');
        var bads = creep.room.find(FIND_HOSTILE_CREEPS);
        if (bads.length > 0) {
            if (!containers.withdrawFromStorage(creep)) {
                creep.moveTo(Game.flags[creep.memory.party]);
            }
        } else {

            var close = creep.room.find(FIND_DROPPED_RESOURCES);
            close.sort((a, b) => a.amount - b.amount);
            var high = close.length - 1;

            if (close[high] === undefined) return false;

            if (creep.pos.isNearTo(close[high])) {
                creep.pickup(close[high]);
            } else {
                creep.moveTo(close[high], {
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
    }
    if (!containers.withdrawFromStorage(creep)) {}

}

class towerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
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
