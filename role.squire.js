var classLevels = [
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
    ]
];

// This role is designed to be helper to another role.
// The main purpose of this role is to fetch and/or putaway minerals/energy for other creeps.


var roleParent = require('role.parent');


class squireRole extends roleParent {
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

    static assign(){

    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if(creep.memory.pimpID !== undefined){

        }
        if(creep.memory.targetID !== undefined){

        }
        if(creep.memory.goHome !== undefined){
            if(creep.memory.goHome) {

            }
        }
    }
}

module.exports = squireRole;