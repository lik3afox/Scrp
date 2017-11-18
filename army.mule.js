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
        if (Game.flags.portal !== undefined && creep.room.name == Game.flags.portal.pos.roomName && creep.memory.party !== 'hello22') {
            creep.say('P');
            creep.moveTo(Game.flags.portal);
            return;
        }
        if (Game.flags.portal2 !== undefined && creep.room.name == Game.flags.portal2.pos.roomName && creep.memory.party !== 'hello22') {
            creep.say('P2');
            creep.moveTo(Game.flags.portal2);
            return;
        }
        if (this.spawnRecycle(creep)) {
            return false;
        }

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
                var targ = Game.flags[creep.memory.party].pos;

                if (targ !== null) {
                    if (creep.pos.isEqualTo(targ)) {
                        Game.getObjectById(creep.memory.recycleID).recycleCreep(creep);
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

        if (creep.memory.party == 'hello22' && creep.carryTotal === 0 && creep.room.name == Game.flags.hello22.pos.roomName) {
            creep.say('blh');
            creep.memory.parent = '599a20fdea625865e74d453d';
            creep.memory.death = true;
        }

        if (!creep.memory.goHome) {
            if (total > 0 && creep.memory.level !== 2) {

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
                        if (creep.room.storage !== undefined && creep.room.controller.level > 3 && creep.room.name !== 'E14S38') {
                            var target = creep.room.storage;
                            if (creep.memory.party == 'hello22') {
                                target = creep.room.terminal;
                            }

                            if (creep.pos.isNearTo(target)) {
                                for (var bb in creep.carry) {
                                    creep.transfer(target, bb);
                                }
                                if (creep.memory.party != 'hello22') {
                                    creep.memory.goHome = true;
                                }

                            } else {
                                creep.moveTo(target, { reusePath: 20 });
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


            } else {
               
                
                let stor = creep.room.storage;
                //                constr.pickUpEnergy(creep);
                if (stor.store[RESOURCE_ENERGY] < 1000) {
                    stor = creep.room.terminal;
                }
                if (Game.shard.name == 'shard0') {
                    if (creep.room.storage.total !== creep.room.storage.store[RESOURCE_ENERGY]) {
                        stor = creep.room.storage;
                    } else {
                        stor = creep.room.terminal;
                    }
                }

                /*
                        var keys = Object.keys(linksID);
                        var z = linksID.length;

                            while (z--) {
                                var zz = keys[z];
                                LINK = Game.getObjectById(linksID[zz]);
                */


                if (creep.pos.isNearTo(stor)) {
                    if (Game.shard.name == 'shard0') {
                        var zz = Math.floor(Math.random() * 4);
                        if (zz !== 0) {
                            creep.withdraw(stor, 'H');
                        } else {
                            for (var e in stor.store) {
                                if (e !== RESOURCE_ENERGY) {
                                    creep.withdraw(stor, e);
                                }
                            }
                        }


                    } else {
                        if (creep.room.name == 'E14S37')
                            creep.withdraw(stor, RESOURCE_ENERGY);
                    }
                } else {
                    creep.moveTo(stor, { reusePath: 20 });
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