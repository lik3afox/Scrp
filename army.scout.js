//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE],
    [MOVE, MOVE, MOVE, WORK, ATTACK, CARRY, HEAL],
    [MOVE],
    [MOVE],
    [MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
class scoutClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length) level = classLevels.length;
        return classLevels[level];
    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }
        creep.memory.waypoint = true;

        if (creep.memory.customPoint === undefined) {
            creep.memory.customPoint = false;
        }

        if (creep.room.name == 'E43S92') {
            var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 10);
            if (bads.length !== 0) {
                creep.moveTo(14, 10);
            } else {
                creep.moveTo(15, 10);
            }

        }
        if (creep.hits !== creep.hitsMax) {
            creep.selfHeal();
            if (super.edgeRun(creep)) {
                return;
            }
        }

        console.log('scout reporting in', creep.pos);
        if (super.goToPortal(creep)) return;
        creep.say('sc');
        if (!super.moveToSignControl(creep)) {
            if (!super.avoidArea(creep)) {
                movement.flagMovement(creep);
            }
        }
    }
}

module.exports = scoutClass;
