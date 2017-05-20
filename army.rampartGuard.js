// Rampart Fighter

var classLevels = [
[
ATTACK,MOVE,ATTACK,
ATTACK,MOVE,ATTACK,
MOVE,ATTACK,ATTACK,
ATTACK,MOVE,ATTACK,
MOVE,ATTACK,ATTACK,
ATTACK,MOVE,ATTACK,
MOVE,ATTACK,ATTACK,

ATTACK,MOVE,ATTACK,
MOVE,ATTACK,ATTACK,
ATTACK,MOVE,ATTACK,

MOVE,ATTACK,ATTACK,
ATTACK,MOVE,ATTACK,
MOVE,ATTACK,ATTACK,

ATTACK,MOVE,ATTACK,
MOVE,ATTACK,ATTACK,
ATTACK,MOVE,ATTACK,
MOVE,ATTACK
]

];
//var boost = [RESOURCE_LEMERGIUM_OXIDE];
var movement = require('commands.toMove');

var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:


class fighterClass extends roleParent{
   static levels(level) {
     if (level > classLevels.length-1)       level = classLevels.length-1;
        return classLevels[level];
    }

	static run(creep) {

		creep.say('fight');
        if (super.returnEnergy(creep)) {            return;        }
              super.calcuateStats(creep);
        if(super.doTask(creep)) {return;}

     //   if(super.boosted(creep,boost)) { return;}
		var enemy = creep.pos.findInRange(creep.room.hostilesHere(),3);

		if(enemy.length > 0) {
			enemy = creep.pos.findClosestByRange(enemy);
			if(creep.attack(enemy) == ERR_NOT_IN_RANGE) {
				creep.say('ahh',enemy);
    		}	
		} 
		movement.flagMovement(creep);
  	if(creep.memory.formationPos != 0){
  		creep.memory.formationPos = 0;
  	}
	}
}

module.exports = fighterClass;
