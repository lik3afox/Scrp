var classLevels = [
    //0
    [WORK, CARRY, MOVE],
    //1
    [WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    //2
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //3
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //4 /2300 Energy
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    //6 Super Level 6 - 40 Work, 5 carry 5 move
    {
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
        boost: ['XZHO2', 'XLH2O'],
    }
];

var boost = [];
var roleParent = require('role.parent');

function doNukeRamparts(creep) {
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
                structure.pos.isNearTo(nuke, 5)

            );
        });
    }
    return true;
}

class roleWallWorker extends roleParent {

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
        if (super.baseRun(creep)) return;
        /*        if (creep.ticksToLive > 1470 && creep.room.name !== 'E19S49') {
                    if (creep.memory.boostNeeded === undefined) {
                        creep.memory.boostNeeded = ['LH'];
                    }
                    require('role.upbuilder').run(creep);
                    return;
                } else 
                if (Game.shard.name == 'shard0' && creep.ticksToLive > 1450) {
                    require('role.upbuilder').run(creep);
                    return;
                } else if (Game.shard.name == 'shard2' && creep.ticksToLive > 1450) {
                    require('role.upbuilder').run(creep);
                    return;
                } else */
        if (Game.shard.name == 'shard1' && creep.ticksToLive > 1300 && creep.room.controller !== undefined && creep.room.controller.level == 8 && creep.room.controller.ticksToDowngrade < 10000) {
            creep.memory.role = 'upbuilder';
            creep.memory.reportDeath = true;
            return;
        } else if (Game.shard.name == 'shard1' && creep.ticksToLive == 1499 && Memory.stats.totalMinerals.LH > 20000) {
            let boost = [];
            boost.push('LH');
            _.uniq(boost);
            creep.memory.boostNeeded = boost;
        } else if (creep.room.memory.nukeIncoming && creep.ticksToLive == 1499) {
            let boost = [];
            boost.push('XLH2O');
            _.uniq(boost);
            creep.memory.boostNeeded = boost;
        }

        if (creep.ticksToLive > 1400 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        var target; // = (creep.room.name == 'E29S48' || creep.room.name == 'E18S46') ? creep.room.storage : creep.room.terminal;

        target = creep.room.storage;

        /*        if (creep.carry.energy > creep.carryCapacity - 50 && creep.pos.isNearTo(target)) {
                      creep.memory.repair = true;
                } else  */
        if (creep.carry.energy < creep.stats('work')) {
            if (creep.pos.isNearTo(target)) {
                creep.say('t:' + target.structureType);
                creep.withdraw(target, RESOURCE_ENERGY);
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null) creep.memory.constructionID = strucs.id;
                creep.memory.wallTargetID = undefined;
            } else {
                creep.moveMe(target, { ignoreCreeps: true, reusePath: 20 });
            }
            return;
        }

        if (creep.memory.constructionID !== undefined) {
            var strucs = Game.getObjectById(creep.memory.constructionID);
            if (strucs !== null) {
                if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                    creep.moveMe(strucs, { reusePath: 15 });
                }
            } else {
                creep.room.memory.spawnTargets = undefined;
                creep.memory.constructionID = undefined;
                //    let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                //  if (strucs !== null) creep.memory.constructionID = strucs.id;
            }
        } else {
            if (super.constr.moveToRepairWall(creep)) {
                roleParent.constr.doCloseRoadRepair(creep);
            } else {
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null) creep.memory.constructionID = strucs.id;

            }
        }

    }

}
module.exports = roleWallWorker;