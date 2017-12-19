var classLevels = [
    //0
    [WORK, CARRY, MOVE],
    //1
    [WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    //2
    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
    //3
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //4 /2300 Energy
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
];

var boost = [];
var roleParent = require('role.parent');

function doNukeRamparts(creep){
    creep.say('nUKEEE');
            if (creep.memory.constructionID !== undefined) {
                var strucs = Game.getObjectById(creep.memory.constructionID);

                if (strucs !== null) {
                    if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(strucs, { reusePath: 15 });
                    }
                } else {
                    creep.memory.constructionID = undefined;
                }
            } else {
                zzz = flag.room.find(FIND_MY_STRUCTURES);
                zzz = _.filter(zzz, function(structure) {
                    return (structure.structureType == STRUCTURE_RAMPART &&
                        structure.pos.isNearTo(nuke,5)
                        
                    );
                });                
            }
    return true;
}

class roleWallWorker extends roleParent {

    static levels(level, room) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (super.baseRun(creep)) return;
        if(Game.shard.name == 'shard0' && creep.ticksToLive > 1450) {
            require('role.upbuilder').run(creep);
            return;
        }
        if(creep.room.name == 'E22S48'){
            if( super.boosted(creep,['XLH2O']) )
                return;

        }
        if(Game.shard.name == 'shard1'&& creep.ticksToLive > 1300 &&creep.room.controller !== undefined &&  creep.room.controller.level == 8 && creep.room.controller.ticksToDowngrade < 100000 ){
            require('role.upbuilder').run(creep);
            return;
        }  else if (Game.shard.name == 'shard1' && creep.ticksToLive == 1499 && Memory.stats.totalMinerals.LH > 20000) {

                boost.push('LH');

                _.uniq(boost);
            } else if (creep.room.memory.nukeIncoming&& creep.ticksToLive == 1499) {
                boost.push('XLH2O');
                _.uniq(boost);
            }


        if (creep.memory.level >= 4 && super.boosted(creep, boost)) {
            return;
        }

        if (creep.memory.repair) {
/*            if(creep.room.memory.nukeIncoming) {
                if(doNukeRamparts(creep)) {
                    return;
                }
            }*/
            if (creep.memory.constructionID !== undefined) {
                var strucs = Game.getObjectById(creep.memory.constructionID);
                if (strucs !== null) {
                    if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(strucs, { reusePath: 15 });
                    }
                } else {
                    creep.memory.constructionID = undefined;
                }
            } else {
                super.constr.moveToRepairWall(creep);
            }

            if (creep.carry.energy === 0) {
                creep.memory.repair = false;
            }
        } else {

            super.constr.pickUpEnergy(creep);
            if(creep.room.name == 'E29S48'||creep.room.name == 'E18S46') {
            if (!super.containers.withdrawFromTerminal(creep)) {
            }

            } else {
            if (!super.containers.withdrawFromStorage(creep)) {
                if (!super.containers.moveToWithdraw(creep)) {
                    super.sources.moveToWithdraw(creep);
                }
            }
            }

            if (creep.carry.energy > creep.carryCapacity - 50) {
                creep.memory.repair = true;
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null) creep.memory.constructionID = strucs.id;
                creep.memory.wallTargetID = undefined;
            }

        }
        
    }

}
module.exports = roleWallWorker;