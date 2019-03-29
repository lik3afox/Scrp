var classLevels = [
    [CARRY, CARRY, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],
    [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
    ],

    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
];

var roleParent = require('role.parent');
var job = require('jobs.spawn');
let roomLevel;
class roleWallAssist extends roleParent {

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle(classLevels[level].body);
        } else {
            return classLevels[level];
        }
    }
    static boosts(level) {
        return [];
    }

    static run(creep) {
        if (super.spawnRecycle(creep)) return true;
        if (super.depositNonEnergy(creep)) return true;
        if (creep.room.memory.focusWall == true) {
            super.rebirth(creep);
        } else if (!creep.room.memory.focusWall) {
            creep.memory.death = true;
        }
        if (!job.newDoRefill(creep)) {
            if (creep.carryTotal < creep.carryCapacity) {
                //creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
            } else {
                creep.sleep(3);
            }
        }

    }
}

module.exports = roleWallAssist;