// Difference between mule and thief.
// Thief gets things and brings them
// mule takes thing and send them

var classLevels = [
    // Level 0, equal carry and move.
    [CARRY,
        MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE
    ],
    // Level 1, 1:2 move to carry
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 2, heal and move;
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');

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
        if (creep.memory.level === 2) {
            let isThere = false;
            if (Game.flags[creep.memory.party] !== undefined &&
                Game.flags[creep.memory.party].room !== undefined &&
                creep.room.name == Game.flags[creep.memory.party].room.name) {
                isThere = true;
            }

            if (isThere) {
                if (creep.memory.recycleID === undefined) {
                    var stru = creep.room.find(FIND_STRUCTURES);
                    stru = _.filter(stru, function(o) {
                        return o.structureType == STRUCTURE_SPAWN;
                    });
                    if (stru.length !== 0) {
                        creep.memory.recycleID = stru[0].id;
                    }
                }
                var targ = Game.getObjectById(creep.memory.recycleID);
                if (targ !== null) {
                    if (creep.pos.isNearTo(targ)) {
                        targ.recycleCreep(creep);
                        return;
                    } else {
                        creep.moveTo(targ);
                    }
                }

            } else {
                if (!super.avoidArea(creep)) {
                    movement.flagMovement(creep);
                }
            }
            return;
        }
        let total = creep.carryTotal;
        if (total === 0 && creep.room.name !== creep.memory.home && creep.memory.level !== 3) creep.memory.goHome = true;
        if (total === 0 && creep.room.name == creep.memory.home) creep.memory.goHome = false;

        if (!creep.memory.goHome) {
            if (total === 0 && creep.memory.level !== 2) {
                let stor = creep.room.storage;
                //                constr.pickUpEnergy(creep);
                if (stor.store[RESOURCE_ENERGY] < 1000) {
                    stor = creep.room.terminal;
                }
                if (creep.pos.isNearTo(stor)) {
                    creep.withdraw(stor, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(stor, { reusePath: 20 });
                }
            } else {
                creep.say('bich');
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
                    if (creep.memory.level === 2) {


                    } else {
                        if (creep.room.storage !== undefined) {
                            if (creep.pos.isNearTo(creep.room.storage)) {
                                creep.transfer(creep.room.storage, RESOURCE_ENERGY);
                                creep.memory.goHome = true;

                            } else {
                                creep.moveTo(creep.room.storage, { reusePath: 20, ignoreCreeps: true });
                            }
                        } else {
                            if (creep.pos.isEqualTo(Game.flags[creep.memory.party].pos)) {
                                creep.drop(RESOURCE_ENERGY);
                            } else {
                                creep.moveMe(Game.flags[creep.memory.party], { reusePath: 20, ignoreCreeps: true });
                            }
                        }
                    }

                }


            }
        } else {
            if (creep.room.name == creep.memory.home) {
                creep.memory.goHome = false;
            } else {
                let zz = Game.getObjectById(creep.memory.parent);
                if (zz !== null) {
                    creep.moveMe(zz, { reusePath: 50, ignoreCreeps: true });

                }
            }
        }

    }
}

module.exports = muleClass;