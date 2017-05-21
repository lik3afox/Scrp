//Back line
// Designed to do damage to all.

var classLevels = [
	[MOVE,MOVE,MOVE,MOVE,MOVE,CLAIM],
    [CLAIM,CLAIM, MOVE,MOVE,CLAIM,CLAIM, MOVE,MOVE,CLAIM,MOVE],
    [CLAIM,CLAIM, MOVE,MOVE,CLAIM,CLAIM, MOVE,MOVE,CLAIM,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');
//STRUCTURE_POWER_BANK:
class hackerClass extends roleParent{
   static levels(level) {
     if (level > classLevels.length )       level = classLevels.length;
        return classLevels[level];
    }

	static run(creep) {
        if(super.goToPortal(creep)) return;

		console.log('Control checking in',creep.pos);
//        super.returnEnergy(creep); 5836bb2241230b6b7a5b9a59 37,33 E36S75
//		var target = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,2);
//{filter: {structureType: STRUCTURE_WALL}}
//console.log('acon',Game.flags.control , creep.pos.roomName , Game.flags.control.pos.roomName);
            if(Game.flags.control !== undefined && creep.pos.roomName == Game.flags.control.pos.roomName) {
            	let what = creep.claimController(creep.room.controller);
                    creep.say(what);

                switch(what) {
                    case OK :
                        // case 0 is when it's claimed.
                        Game.flags.control.remove();
                    break;

                    case ERR_NOT_IN_RANGE:

                        creep.moveTo(creep.room.controller);    
                    break;

                    default :
                    
                 	   if(creep.attackController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    	}
                
                    break;
                }
                /*if ( == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                } */
            }
   else {


//   	if(!super.guardRoom(creep)  ) {
                    if (!super.avoidArea(creep)) 

			movement.flagMovement(creep);
        }
//		}

	}
}

module.exports = hackerClass;
