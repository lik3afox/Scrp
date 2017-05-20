//Back line
// Designed to do damage to all.
// every x = 50x5
var classLevels = [
	[MOVE,WORK], // 300
// Not boosted
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
// Boosted level

[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK]
]; 
var boost = ['ZH'];

var movement = require('commands.toMove');
var roleParent = require('role.parent');

function  doAttack(creep) {
           let target;
    switch(creep.room.name) {
        case "E37S79":
            target = Game.getObjectById('58a84f9cff111d524e669e8f');
            if(target != undefined) {
                if(creep.pos.isNearTo(target)) {
                    creep.dismantle(target);
                }
            } else {
            target =  Game.getObjectById('58a56eba4d5d993ffadd2496');
            if(target != undefined) {

            if(creep.pos.isNearTo(target)) {
                creep.dismantle(target);
            }
            }
        }
//        return true;
        break;
        case "E17S76":
            target =  Game.getObjectById('58677af00d89403c0f3cea15');
            if(target != undefined) {
                if(creep.pos.isNearTo(target)) {
                    creep.dismantle(target);
                }
            } else {
            target =  Game.getObjectById('588893b8dc89f23ad43c3d52');
                if(target != undefined) {
                    if(creep.pos.isNearTo(target)) {
                        creep.dismantle(target);
                    }
                }
            }
            creep.say('yoyo')
//            return true;
        break;

    }
    return false;
}

//STRUCTURE_POWER_BANK:
class demolisherClass extends roleParent{
   static levels(level) {
   	 if (level > classLevels.length )       level = classLevels.length;
        return classLevels[level];
    }

	static run(creep) {
        if (super.returnEnergy(creep)) {
            return;
        }
//        console.log(super.isFlagged(creep));
        if( super.isFlagged(creep) ) {
        	creep.memory.death = false;

        }else{
        	creep.memory.death = true;
        }
if(creep.memory.level == 1) {
        if(super.boosted(creep,['XZHO2','XGHO2'])) { return;}       
} 

            doAttack(creep);
            movement.flagMovement(creep);
			return; 
	}
}

module.exports = demolisherClass;
