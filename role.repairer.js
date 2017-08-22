// Main 300
// level 0 = 200

// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    [WORK, WORK, CARRY, MOVE],
    [CARRY,  WORK, MOVE,CARRY, WORK, WORK, MOVE, MOVE], // 500
    [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, WORK, CARRY, CARRY, MOVE], // 700
    [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, WORK, CARRY, CARRY, MOVE], // 700
    [WORK, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, WORK, CARRY, CARRY, MOVE], // 700
];

var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var sources = require('commands.toSource');
var containers = require('commands.toContainer');

class roleRepairer extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    /** @param {Creep} creep **/
    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return; }

        var targets = constr.getRepairSite(creep);
        // Logic here
        // Logic here
        // Logic here
        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;
        // If energy = 0 then go harvest.
        if (creep.carry.energy === 0) {
            creep.memory.repairing = false;
        }


        if (creep.carry.energy == creep.carryCapacity && targets.length > 0) {
            constr.moveToRepair(creep);
            creep.memory.repairing = true;
        }
        // Action
        // Action
        // Action

        // Current problem is that it goes and moves on after it repairs once. Spending a lot of time moving around. 

        if (creep.memory.repairing) {
            //          creep.say('repair');
            //constr.getCloseRepair(creep);
            //          if(!) {
            let zbuild = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: object => (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax - 1000))
            });
            if (creep.repair(zbuild) == ERR_NOT_IN_RANGE) {
                creep.moveTo(zbuild);
            }
            //          constr.moveToRepair(creep);
            //          }

        } else {
            creep.say('harvest');
            if(!constr.moveToPickUpEnergy(creep)) {
            if (!containers.withdrawFromStorage(creep)) {
                if (!containers.moveToWithdraw(creep)) {
                    sources.moveToWithdraw(creep);
                }
            }

            }
        }
    }
}

module.exports = roleRepairer;
