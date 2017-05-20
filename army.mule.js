// Front line - 
// Tank - but also desgned to carry.

var classLevels = [
	[CARRY,MOVE],
    [TOUGH,TOUGH,CARRY,CARRY, CARRY, MOVE,MOVE,MOVE], // 200
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');
//STRUCTURE_POWER_BANK:
class muleClass extends roleParent{
   static levels(level) {
   	 if (level > classLevels.length )       level = classLevels.length;
        return classLevels[level];
    }

	static run(creep) {
		creep.say('mule');

//		if(creep.pos.inRange( ))

		var enemy = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
		if(enemy.length > 0) {
			enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
			if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
				creep.say('ahh');
		        creep.moveTo(enemy);
    		}	
		} else {
	movement.flagMovement(creep);
	}
	}
}

module.exports = muleClass;
