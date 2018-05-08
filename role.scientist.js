var classLevels = [
    [CARRY, MOVE],

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE],
    // 500
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ],
    // 600
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ],

    // 1000
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ],
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ]


];

var roleParent = require('role.parent');
var jobs = require('jobs.spawn');


class scientistRole extends roleParent {
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
//        creep.memory.role = 'linker';
//console.log('here',roomLink(creep.room.name));
        if (super.doTask(creep)) {
            return;
        }

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (!creep.room.memory.labsNeedWork && this.depositNonEnergy(creep)) {
            return;
        }

        if (jobs.doMineralContainer(creep)) {
     //       creep.say('gMin');
            return;
        }
        if ( roleParent.constr.withdrawFromTombstone(creep)) {
            creep.say('tomb');
            return;
        }

        if (!creep.room.memory.labsNeedWork && jobs.doRoomEnergy(creep)) {
            return;
        } else if (jobs.doNuke(creep)) {
            return;
        }
        if (jobs.doLabs(creep)) {
            return;
        }
        creep.sleep(3);
    }
}

module.exports = scientistRole;