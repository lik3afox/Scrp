class SourceInteract {

    static moveToWithdraw(creep) {

        if (creep.getActiveBodyparts(WORK) === 0) return false;

        let source = Game.getObjectById(creep.memory.sourceID);
        if (source === null || source.energy === 0 || source.energy === undefined) {
            var total = creep.room.find(FIND_SOURCES_ACTIVE);
            creep.say('FINDING' + total.length);
            if(total.length === 0)
                return false;
            if (total.length === 1) {
                creep.memory.sourceID = total[0].id;
            } else {
                for (var z in total) {
                    let otherHasIt = false;
                    for (var e in Game.creeps) {
                        if (Game.creeps[e].memory.role == creep.memory.role && Game.creeps[e].memory.sourceID == total[z].id) {
                            otherHasIt = true;
                        }
                    }
                    if (!otherHasIt) {
                        creep.memory.sourceID = total[z].id;
                        break;
                    }
                }
                // if none has been assigned that means that it's all full so give it an random one!
                if (creep.memory.sourceID === undefined) {
                    let rando = Math.floor(Math.random() * total.length);
                    creep.memory.sourceID = total[rando].id;
                }
            }
            source = Game.getObjectById(creep.memory.sourceID);
        }


        // let source = Game.getObjectById( creep.memory.sourceID ); 

        if (creep.pos.isNearTo(source)) {
            if (creep.harvest(source) == OK) {
                creep.memory.isThere = true;
                creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                    color: 'white',
                    align: LEFT,
                    font: 0.6,
                    strokeWidth: 0.75
                });
            }
        } else {

            creep.moveTo(source);

        }

        return true;
    }

}

module.exports = SourceInteract;