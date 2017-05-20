// This role is designed for moving into other rooms and taking over there controller or reserving it. 

// To set claim a new room, you need to put in that room a flag 'Claim' once the controller moves there it will
// claim instead of reserve.
// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30

var classLevels = [
    [CLAIM, MOVE], // 0 NIL
    [CLAIM, MOVE], // 1 NIL
    [CLAIM, MOVE], // 2 NIL
    [MOVE ,CLAIM ], //  700/800
    [CLAIM,MOVE, CLAIM,MOVE], // 800/1300
    [CLAIM,MOVE, CLAIM,MOVE, CLAIM,MOVE], //  1300/1800
    [CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE] //  1300/1800 // 5 claim 3300
    [CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE,CLAIM, MOVE] // 6600
]

var roleParent = require('role.parent');
var structure = require('commands.toStructure');
var source = require('commands.toSource');
var movement = require('commands.toMove');
class controllerRole extends roleParent {

    static levels(level) {
         if (level > classLevels.length-1 )       level = classLevels.length-1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        var temp = Game.getObjectById(creep.memory.goal);
        if( movement.runAway(creep) ) {    return;     }

        if ((temp != undefined )&&( creep.room.name == temp.room.name && creep.room.controller)) {
                if (creep.pos.isNearTo(creep.room.controller)) {
                    creep.reserveController(creep.room.controller);
                    super.signControl(creep);
                } else {
                    creep.moveTo(creep.room.controller,{maxRooms:1,reusePath:50});
                }

        } else {
            if((temp != undefined ))
    	        creep.moveMe(temp.pos,{reusePath:50});
        }
    }
}

module.exports = controllerRole;