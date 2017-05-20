// Role just to fill up towers and nothing else. 

var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ]
];
var roleParent = require('role.parent');

var containers = require('commands.toContainer');

function getEnergy(creep) {
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
            //      if (creep.memory.towerTargetID == undefined) {
            zz = creep.room.find(FIND_STRUCTURES, { filter: o => o.energy < 200 && o.structureType == STRUCTURE_TOWER });
            if (zz.length > 0)
                creep.memory.towerTargetID = zz[0].id;
            //    }

            let target = Game.getObjectById(creep.memory.towerTargetID);
            if (!_.isUndefined(target)) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.moveMe(target);
                }
                if (target.energy == target.energyCapacity - 100)
                    creep.memory.towerTargetID = undefined;

                // Find towers and fill them
            }
        } else {
            getEnergy(creep);
        }

    }
}

module.exports = towerClass;
