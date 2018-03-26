// This class is designed to go to 
// the flag recontrol

// recontrol flag means that you go to the controller - unclaim it then reclaim it afterwards.
var classLevels = [
    [MOVE, MOVE, CLAIM],
    [CLAIM, CLAIM, MOVE, MOVE, CLAIM, CLAIM, MOVE, MOVE, CLAIM, MOVE],
    [CLAIM, CLAIM, MOVE, MOVE, CLAIM, CLAIM, MOVE, MOVE, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');

//STRUCTURE_POWER_BANK:
class hacker2Class extends roleParent {
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

    static run(creep) {
//console.log('RECONTROLLER',creep.pos,roomLink(creep.room.name));
        if (Game.flags.recontrol !== undefined && creep.pos.roomName == Game.flags.recontrol.pos.roomName) {
            creep.say('there?');

            if (creep.pos.isNearTo(creep.room.controller) && creep.room.controller.level !== undefined && creep.room.controller.level > 6) {
                creep.room.controller.unclaim();
                creep.say('here?');
                return;
            } else {
                let what = creep.claimController(creep.room.controller);
                creep.say(what);

                switch (what) {
                    case OK:
                        // case 0 is when it's claimed.
                        Game.flags.recontrol.remove();
                        creep.suicide();
                        break;
                    case ERR_GCL_NOT_ENOUGH:
                    case ERR_NOT_IN_RANGE:

                        creep.moveTo(creep.room.controller);
                        break;

                    default:

                        if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }

                        break;
                }
           }
        } else {
                movement.flagMovement(creep);
        }

    }
}

module.exports = hacker2Class;
