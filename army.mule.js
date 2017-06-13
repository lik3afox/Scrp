// Difference between mule and thief.
// Thief gets things and brings them
// mule takes thing and send them

var classLevels = [
    [CARRY,
        MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE
    ]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');
//STRUCTURE_POWER_BANK:
class muleClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        // First if it's home it will go to storage.
        if (creep.memory.goHome === undefined) {
            creep.memory.goHome = false;
        }
        let total = creep.carryTotal
;
        if (!creep.memory.goHome) {
            if (total === 0) {
                let stor = creep.room.storage;
                if (creep.pos.isNearTo(stor)) {
                    creep.withdraw(stor, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(stor);
                }
            } else {

                let isThere = false;
                if (Game.flags[creep.memory.party] !== undefined &&
                    Game.flags[creep.memory.party].room !== undefined &&
                    creep.room.name == Game.flags[creep.memory.party].room.name) {
                    isThere = true;
                }

                if (!isThere) {
                    if (!super.avoidArea(creep)) {
                        movement.flagMovement(creep);
                    }
                } else {
                    if (creep.room.storage !== undefined) {
                        if (creep.pos.isNearTo(creep.room.storage)) {
                            creep.transfer(creep.room.storage, RESOURCE_ENERGY);
                            creep.memory.goHome = true;

                        } else {
                            creep.moveTo(creep.room.storage);
                        }
                    }
                }


            }
        } else {
            if (creep.room.name == creep.memory.home) {
                creep.memory.goHome = false;
            } else {
                let zz = Game.getObjectById(creep.memory.parent);
                creep.moveTo(zz, { reusePath: 50 });
            }
        }

    }
}

module.exports = muleClass;
