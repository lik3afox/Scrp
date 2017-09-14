/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.
var classLevels = [
    //0
    [WORK, WORK, CARRY, MOVE], // 300
    //1
    [WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 550
    //2
    [CARRY, WORK, CARRY, MOVE, WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 800
    //3
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //4
    //[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
    [MOVE, WORK, MOVE, WORK, WORK, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    //5

    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    // 6
    // Final evel
    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], // 800    
    // 7
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
];

var containers = require('commands.toContainer');
var sources = require('commands.toSource');
var structures = require('commands.toStructure');
var roleParent = require('role.parent');

class roleUpgrader extends roleParent {

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }


    /** @param {Creep} creep **/
    static run(creep) {

        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        if (creep.room.controller.level != 8 && creep.room.name !== 'E17S34')
            if (super.boosted(creep, ['XGH2O'])) {
                return;
            }

        if (creep.room.controller.level == 8) {
            creep.memory.death = true;
        }
        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;
        if (creep.memory.level > 5) super.renew(creep);

        if (creep.carry.energy < creep.stats('upgrading') + 1) {
            if (creep.room.name == 'E14S43') {
                if (creep.memory.roleID == '0') {
                    if (!creep.pos.isEqualTo(new RoomPosition(18, 21, creep.room.name))) {
                        creep.moveTo(18, 21);
                    }
                }
                if (creep.memory.roleID == '1') {
                    if (!creep.pos.isEqualTo(new RoomPosition(18, 22, creep.room.name))) {
                        creep.moveTo(18, 22);
                    }
                }
                if (creep.memory.roleID == '2') {
                    if (!creep.pos.isEqualTo(new RoomPosition(18, 23, creep.room.name))) {
                        creep.moveTo(18, 23);
                    }
                }
                if (!containers.withdrawFromStorage(creep)) {}

            } else {
                if (!structures.pickUpEnergy(creep)) {
                    if (!containers.fromStorage(creep)) {
                        if (!containers.fromTerminal(creep)) {
                            if (!containers.withdrawFromStorage(creep)) {
                                if (!containers.moveToWithdraw(creep)) {
                                    sources.moveToWithdraw(creep);
                                }
                            }
                        }
                    }
                }
            }

        }

        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}

module.exports = roleUpgrader;