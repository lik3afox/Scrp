var classLevels = [
    [CLAIM, MOVE], // 0 NIL
    [CLAIM, MOVE], // 1 NIL
    [CLAIM, MOVE], // 2 NIL
    [MOVE, CLAIM], //  700/800
    [CLAIM, MOVE, CLAIM, MOVE], // 800/1300
    [CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], //  1300/1800
    [CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE], //  1300/1800 // 5 claim 3300
    [CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE, CLAIM, MOVE] // 6600
];

var roleParent = require('role.parent');

class controllerRole extends roleParent {

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
return _.clone( classLevels[level].boost);
        }
        return;
    }

    static run(creep) {
        var goal = Game.getObjectById(creep.memory.goal);

        if (super.movement.runAway(creep)) {
            return;
        }
        
        if (goal !== null &&  creep.room.name == goal.pos.roomName) {

            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.reserveController(creep.room.controller);
                super.signControl(creep);
                creep.memory._move = undefined;
                creep.memory.cachePath = undefined;
                creep.memory.oldCachePath= undefined;
                creep.memory.stuckCount = undefined;
                creep.memory.position = undefined;
            } else {
                creep.moveMe(creep.room.controller, { segment:true,maxRooms: 1, reusePath: 50, ignoreCreeps: creep.isHome ? false:true  });
            }

        } else {
                creep.moveMe(goal !== null ? goal.pos : super.movement.getRoomPos(creep), { reusePath: 50 ,segment:true, ignoreCreeps: creep.isHome ? false:true });
        }
    }
}

module.exports = controllerRole;