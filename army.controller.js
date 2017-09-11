//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM],
    [CLAIM, CLAIM, MOVE, MOVE, CLAIM, CLAIM, MOVE, MOVE, CLAIM, MOVE],
    [CLAIM, CLAIM, MOVE, MOVE, CLAIM, CLAIM, MOVE, MOVE, CLAIM, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
class hackerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length) level = classLevels.length;
        return classLevels[level];
    }

    static run(creep) {
        if (super.goToPortal(creep)) return;

        console.log('Control checking in', creep.pos);

        //console.log('acon',Game.flags.control , creep.pos.roomName , Game.flags.control.pos.roomName);
        if (Game.flags[creep.memory.party] !== undefined && creep.pos.roomName == Game.flags[creep.memory.party].pos.roomName) {
            if (creep.room.controller !== undefined) {
                let what;
                if (creep.getActiveBodyparts(CLAIM) >= 5) {
                    what = creep.attackController(creep.room.controller);
                    creep.say(what + 'a');
                } else {
                    what = creep.claimController(creep.room.controller);
                    creep.say(what + 'c');
                }

                switch (what) {
                    case OK:
                        // case 0 is when it's claimed.
                        if (creep.getActiveBodyparts(CLAIM) < 5) {
                            Game.flags[creep.memory.party].remove();
                        }
                        break;

                    case ERR_NOT_IN_RANGE:

                        creep.moveTo(creep.room.controller);
                        break;

                    default:

                        if (creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }

                        break;
                }
            } else {
                movement.flagMovement(creep);
            }
        } else {


            if (!super.avoidArea(creep))
                movement.flagMovement(creep);
        }

    }
}

module.exports = hackerClass;