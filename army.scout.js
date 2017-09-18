//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE],
    [MOVE, MOVE, MOVE, WORK, ATTACK, CARRY, HEAL,RANGED_ATTACK],
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
        if (super.returnEnergy(creep)) {
            return;
        }        
        var zz = ['!Never', '!gonna', 'give', 'you!',
            'up',
            '@Never', '@gonna', 'let', 'you@',
            'down',
            '#Never', '#gonna', 'run', 'around', 'and', 'desert', 'you#'
        ];
        if (creep.room.name == 'E35S75') creep.suicide();
        creep.memory.waypoint = true;

        if (creep.memory.customPoint === undefined) {
            creep.memory.customPoint = false;
        }

        if (creep.room.name == 'E18S36') {
            if(super.boosted(creep, ['XLHO2','XKHO2'])) {
                return;
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
//        creep.say('sc');
//            if (!super.moveToSignControl(creep)) {
                if (!super.avoidArea(creep)) {
                    movement.flagMovement(creep);
                }
  //          }
        creep.sing(zz, true);

    }
}

module.exports = scoutClass;
