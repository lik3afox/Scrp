// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    [WORK, WORK, CARRY, MOVE], // 300
    [WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [MOVE, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE], // 550
    [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], // 550
    [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE] // 550
];

var roleParent = require('role.parent');
var sources = require('commands.toSource');
var containers = require('commands.toContainer');
var spawns = require('commands.toSpawn');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');
var link = require('build.link');

class roleHarvester extends roleParent {

    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        //        if(creep.memory.needBoost!= undefined && creep.memory.needBoost.length > 0) {
        //            creep.say('mod');
        //            if(super.boosted(creep,creep.memory.needBoost)) { return;}
        //        }
        creep.pickUpEnergy();

        if (creep.memory.distance === undefined) { creep.memory.distance = 0; }
        if (creep.memory.isThere === undefined) { creep.memory.isThere = false; }
        super.rebirth(creep);
        if (super.returnEnergy(creep)) {
            return; }
        //        if (super.depositNonEnergy(creep)) return;
        if (creep.memory.level > 1) super.renew(creep);
        if (creep.room.name == 'E38S72') constr.pickUpEnergy(creep);
        // Logic paths
        if (!creep.memory.isThere) creep.memory.distance++;


        if (creep.carry.energy == creep.carryCapacity) {
            let spawnz = Game.getObjectById(creep.memory.renewSpawnID);
            if (spawnz !== null && spawnz.energy < spawnz.energyCapacity) {
                creep.transfer(spawnz, RESOURCE_ENERGY);
            } else {
                if (!link.deposit(creep)) {
                    if (!containers.toContainer(creep)) {}
                }
            }

        }
        sources.moveToWithdraw(creep);
    }
}

module.exports = roleHarvester;
