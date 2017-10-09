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

        if (creep.room.controller.level != 8) {
            if (creep.room.name === '') {
                if (super.boosted(creep, ['XGH2O'])) {
                    return;
                }
            } else {
                if (super.boosted(creep, ['XGH2O'])) {
                    return;
                }
            }
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
            if (creep.room.name == 'E38S81') {
                if (creep.memory.roleID == '6') {
                    if (!creep.pos.isEqualTo(new RoomPosition(24, 36, creep.room.name))) {
                        creep.moveTo(24, 36);
                    }
                } 
                if (creep.memory.roleID == '5') {
                    if (!creep.pos.isEqualTo(new RoomPosition(24, 35, creep.room.name))) {
                        creep.moveTo(24, 35);
                    }
                } 
                if (creep.memory.roleID == '4') {
                    if (!creep.pos.isEqualTo(new RoomPosition(24, 34, creep.room.name))) {
                        creep.moveTo(24, 34);
                    }
                } 
                if (creep.memory.roleID == '3') {
                    if (!creep.pos.isEqualTo(new RoomPosition(23, 34, creep.room.name))) {
                        creep.moveTo(23, 34);
                    }
                }

                if (creep.memory.roleID == '2') {
                    if (!creep.pos.isEqualTo(new RoomPosition(22, 34, creep.room.name))) {
                        creep.moveTo(22, 34);
                    }
                }
                if (creep.memory.roleID == '1') {
                    if (!creep.pos.isEqualTo(new RoomPosition(21, 34, creep.room.name))) {
                        creep.moveTo(21, 34);
                    }
                }
                if (creep.memory.roleID == '0') {
                    if (!creep.pos.isEqualTo(new RoomPosition(20, 34, creep.room.name))) {
                        creep.moveTo(20, 34);
                    }
                }
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                } else {
                       if (creep.pos.isNearTo(creep.room.storage)) {
                    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                }
                }

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