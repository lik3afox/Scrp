var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
class reclaimer extends roleParent {
    static levels(level) {
        return [MOVE,CLAIM];
    }
    static boosts(level) {
        return [];
    }

    static run(creep) {
        if (creep.pos.isNearTo(creep.partyFlag)) {
            if(creep.room.controller.level === 1){
                
                creep.suicide();

            }else if(creep.room.controller.level === 0){
                creep.claimController(creep.room.controller);
                creep.say('control');
            } else {
                creep.room.controller.unclaim();
                creep.say('unclaim');
            }
        } else {
            creep.moveMe(creep.partyFlag,{reusePath:50});
        }

    }
}

module.exports = reclaimer;