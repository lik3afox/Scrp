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
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY]
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

        if (super.doTask(creep)) {
            return;
        }


        if (creep.room.controller.level != 8 && creep.room.controller.level > 5) {
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
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;
        if (creep.memory.level > 5) super.renew(creep);

        if (creep.carry.energy < creep.stats('upgrading') + 1) {
            if (creep.room.name == 'E22S48') {
                var going;
                var pos = [
//                new RoomPosition(20, 23, creep.room.name),
                new RoomPosition(20, 22, creep.room.name),
                new RoomPosition(20, 21, creep.room.name),
                new RoomPosition(21, 21, creep.room.name),
                new RoomPosition(22, 21, creep.room.name),
                ];
                if(pos[creep.memory.roleID] !== undefined) {
                    going = pos[creep.memory.roleID];
                } 

                if (going !== undefined) {
                    if (!creep.pos.isEqualTo(going)) {
                        creep.moveTo(going,{
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#bf0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });
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
if(creep.room.name == 'E22S48') {
    let zz = Game.getObjectById('5a22d7eb9d541908b765603e');
    if(zz !== null){
        creep.build(zz);
        return;
    }
}
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    }
}

module.exports = roleUpgrader;