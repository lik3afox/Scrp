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
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
        if (super.goToPortal(creep)) return;

        // E23S38
//        console.log('Control checking in', creep.pos);
        if (this.spawnRecycle(creep)) {
            return false;
        }

        //console.log('acon',Game.flags.control , creep.pos.roomName , Game.flags.control.pos.roomName);
        if (Game.flags[creep.memory.party] !== undefined && creep.pos.roomName == Game.flags[creep.memory.party].pos.roomName) {
            if (creep.room.controller !== undefined) {
                let what;
                if (creep.getActiveBodyparts(CLAIM) >= 5) {
                    //                    what = creep.attackController(creep.room.controller);
                    what = creep.claimController(creep.room.controller);
                    creep.say(what + 'a');
                    if (creep.room.name == 'E19S48' && creep.room.controller.upgradeBlocked > 900){
                                creep.memory.death = true;
                    }
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
                        creep.memory._move = undefined;
                        creep.memory.cachePath = undefined;
                        break;

                    case ERR_NOT_IN_RANGE:

                        creep.moveTo(creep.room.controller);
                        break;

                    default:
                        let attk = creep.attackController(creep.room.controller);
                        if (attk == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                        if (attk === OK) {
                            creep.partyFlag.memory.delaySpawn = 650;
                        } else if (attk == -7) {
                            if (creep.room.name == 'E19S48')
                                creep.memory.death = true;
                        }

                        break;
                }
            } else {
                movement.flagMovement(creep);
            }
        } else {


//            if (!super.avoidArea(creep)){
//                creep.tuskenTo(creep.partyFlag,creep.memory.home,{useSKPathing:true,reusePath:50});
//                            movement.flagMovement(creep);
/*if(creep.memory.didIt === undefined){
    creep.moveMe(Game.flags.flagger,{useSKPathing:true,reusePath:50});
    if(creep.room.name === Game.flags.flagger.pos.roomName){
        creep.memory.didIt = true;
    }
    creep.say('zzzz');
    return;

} else { */
//    creep.moveMe(creep.partyFlag,{useSKPathing:true,reusePath:50});
if(creep.partyFlag.memory.tusken){
    creep.tuskenTo(creep.partyFlag,creep.memory.home,{useSKPathing:true,reusePath:50});
} else {
creep.moveMe(creep.partyFlag,{useSKPathing:true,reusePath:50});
}
//}
  //          }
        }

    }
}

module.exports = hackerClass;
