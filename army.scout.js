//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE],
    [MOVE,MOVE,MOVE,WORK,ATTACK,CARRY],
    [MOVE],
    [MOVE],
    [MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
class scoutClass extends roleParent{
   static levels(level) {
     if (level > classLevels.length )       level = classLevels.length;
        return classLevels[level];
    }

	static run(creep) {
        super.calcuateStats(creep);
        if(super.doTask(creep)) {return;}
          creep.memory.waypoint = true;

        console.log('scout reporting in',creep.pos);
        if(super.goToPortal(creep)) return;
        creep.say('sc');
        if(!super.moveToSignControl(creep)) {
            if (!super.avoidArea(creep)) {
                movement.flagMovement(creep);
            }
        }
	}
}

module.exports = scoutClass;
