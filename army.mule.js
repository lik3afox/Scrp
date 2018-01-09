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
        if (Game.flags.portal !== undefined && creep.room.name == Game.flags.portal.pos.roomName && creep.memory.party !== 'E23S38') {
            creep.say('P');
            creep.moveTo(Game.flags.portal);
            return;
        }
        if (Game.flags.portal2 !== undefined && creep.room.name == Game.flags.portal2.pos.roomName && creep.memory.party !== 'E23S38') {
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
        if (creep.memory.level === 2 || Game.shard.name == 'shard2') {
            let isThere = false;
            if (Game.flags[creep.memory.party] !== undefined &&
                Game.flags[creep.memory.party].room !== undefined &&
                creep.room.name == Game.flags[creep.memory.party].room.name) {
                isThere = true;
            }

            if (isThere) {
                if (creep.carryTotal !== 0 && creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
                    // here it means it's carrying something other than energy.
                    if (creep.pos.isNearTo(creep.room.terminal)) {
                        for (var e in creep.carry) {
                            if (creep.carry[e] > 0) {
                                creep.transfer(creep.room.terminal, e);
                                creep.say('hi');
                            }
                        }
                    } else {
                        creep.moveTo(creep.room.terminal);
                    }
                } else {
                    // Here it means if it's empty.
                    if (creep.memory.recycleID === undefined) {
                        var stru = creep.room.find(FIND_STRUCTURES);
                        stru = _.filter(stru, function(o) {
                            return o.structureType == STRUCTURE_SPAWN;
                        });
                        if (stru.length !== 0) {
                            creep.memory.recycleID = stru[0].id;
                        } else {
                            creep.memory.recycleID = 'none';
                        }
                    }
                    var targ = Game.flags[creep.memory.party].pos;

                    if (targ !== null) {
                        if (creep.pos.isEqualTo(targ)) {
                            if (creep.memory.recycleID === 'none') {
                                creep.suicide();
                            } else {
                                Game.getObjectById(creep.memory.recycleID).recycleCreep(creep);
                            }
                            return;
                        } else {
                            creep.moveTo(targ);
                        }
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

        if (creep.memory.party == 'E23S38' && creep.carryTotal === 0 && creep.room.name == Game.flags.E23S38.pos.roomName) {
            creep.say('blh');
            creep.memory.parent = '599a20fdea625865e74d453d';
            creep.memory.death = true;
        }

        if (!creep.memory.goHome) {
            if (total === creep.carryCapacity && creep.memory.level !== 2) {

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
                    if (creep.room.storage !== undefined && creep.room.controller.level > 3 && creep.room.name !== 'E14S38') {
                        var target = creep.room.storage;
                        if (creep.memory.party == 'E23S38') {
                            target = creep.room.terminal;
                        }

                        if (creep.pos.isNearTo(target)) {
                            for (var bb in creep.carry) {
                                creep.transfer(target, bb);
                            }
                            if (creep.memory.party != 'E23S38') {
                                creep.memory.goHome = true;
                            }

                        } else {
                            creep.moveTo(target, { reusePath: 20 });
                        }

                    } else {
/*                        var zzee = Game.getObjectById('5a54d79f9ae2bd749a30a092');
                        if(zzee !== null && creep.pos.isNearTo(zzee)) {
                            creep.transfer(zzee,RESOURCE_ENERGY);
//                            return;
                        } */
                        if (creep.pos.isEqualTo(Game.flags[creep.memory.party].pos)) {
                            creep.drop(RESOURCE_ENERGY);
                        } else {
                            creep.moveMe(Game.flags[creep.memory.party], { reusePath: 20, ignoreCreeps: false });
                        }

                    }


                }


            } else {


                let stor = creep.room.storage;
                //                constr.pickUpEnergy(creep);
                if (stor === undefined || stor.store[RESOURCE_ENERGY] < 1000) {
                    stor = creep.room.terminal;
                }
                if (Game.shard.name == 'shard0') {
                    if (creep.room.storage.total !== creep.room.storage.store[RESOURCE_ENERGY]) {
                        stor = creep.room.storage;
                    } else {
                        stor = creep.room.terminal;
                    }
                }
                if (creep.room.name == 'E22S48') {
                    stor = creep.room.terminal;
                }

                if (creep.pos.isNearTo(stor)) {
                    if (Game.shard.name == 'shard0') {
                        var zz = Math.floor(Math.random() * 4);
                        if (zz !== 0) {
                            creep.withdrawing(stor, 'H');
                        } else {
                            for (var ae in stor.store) {
                                if (ae !== RESOURCE_ENERGY) {
                                    creep.withdrawing(stor, ae);
                                }
                            }
                        }


                    } else if (creep.room.name == 'E22S48') {
                        var needed = [];
                        var need2 = [];
                        if (Memory.stats.totalMinerals.L > 120000)
                            needed.push('L');
                        if (Memory.stats.totalMinerals.X > 150000)
                            needed.push('X');
                        if (Memory.stats.totalMinerals.H > 150000)
                            needed.push('H');
                        if (Memory.stats.totalMinerals.O > 80000)
                            needed.push('O');
                        if (Memory.stats.totalMinerals.U > 80000)
                            needed.push('U');
                        if (Memory.stats.totalMinerals.Z > 80000)
                            needed.push('Z');
                        if (Memory.stats.totalMinerals.K > 80000)
                            needed.push('K');
                            needed.push('XGH2O');
                        needed = _.uniq(needed);
//                        need2.sort((a, b) => a - b);
  //                      console.log('doing sort and seeing highesting',need2[0]);
var most;
var amount = 0;
var min = ['L','X','U','Z','K','X','H','O'];
for(var ze in Memory.stats.totalMinerals) {
    if(_.contains(min,ze) && Memory.stats.totalMinerals[ze] > amount ) {
        most = ze;
        amount = Memory.stats.totalMinerals[ze];
    }
}

                        creep.withdrawing(stor, most);
                    } else {
                        //                        if (creep.room.name == 'E14S37')
                        creep.withdrawing(stor, RESOURCE_ENERGY);
                    }
                } else {
                    creep.moveTo(stor, { reusePath: 20 });
                }

            }


        } else {
            if (creep.room.name == creep.memory.home) {
                creep.memory.goHome = false;
            } else {
                let zz = Game.getObjectById(creep.memory.parent).room.storage;
                if (zz !== null) {
                    creep.moveMe(zz, { reusePath: 50, ignoreCreeps: true });

                }
            }
        }
 creep.sing(['!Never', '!gonna', 'give', 'you!',
                        'up',
                        '@Never', '@gonna', 'let', 'you@',
                        'down',
                        '#Never', '#gonna', 'run', 'around', 'and', 'desert', 'you#'
                    ], true);            
        
    }
}

module.exports = muleClass;