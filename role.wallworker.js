// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    //1
    [WORK, CARRY, MOVE],
    //2

    [WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    //3
    [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //4
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //5 /2250 Energy
    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY],
    //6
    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
];

var boost = [];
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');
var contain = require('commands.toContainer');
var sources = require('commands.toSource');
var labs = require('build.labs');

class roleWallWorker extends roleParent {
    static levels(level, room) { // goalInfo is roadsTo in Spawn.memory;
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (super.depositNonEnergy(creep)) return;
        if(Memory.stats.totalMinerals.LH > 20000) {
            boost.push('LH');
        }

        if ( creep.room.name != 'E18S36'&& creep.memory.level >=4 && super.boosted(creep, boost)) {
            return;
        }


        if (creep.memory.repair) {
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
                constr.moveToRepairWall(creep);

            }

            if (creep.carry.energy === 0) {
                creep.memory.repair = false;
            }
        } else {

            constr.pickUpEnergy(creep);
            if (!contain.withdrawFromStorage(creep)) {
                if (!contain.moveToWithdraw(creep)) {
                    sources.moveToWithdraw(creep);
                    //           }
                }
            } else {}

            if (creep.carry.energy > creep.carryCapacity - 50) {
                creep.memory.repair = true;
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null) creep.memory.constructionID = strucs.id;
                creep.memory.wallTargetID = undefined;
            }

        }
        //        creep.say('ww');
    }

}
module.exports = roleWallWorker;
