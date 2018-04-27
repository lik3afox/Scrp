// Difference between mule and thief.
// Thief gets things and brings them
// mule takes thing and send them

var classLevels = [
    // Level 0
    [MOVE, CARRY],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 4
    [CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY,
    ],
    // Level 5
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        boost: ['KH'],
    },
    // Level 7
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        boost: ['XKH2O'],
    },
    // Level 8
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XKH2O'],
    },
    // Level 9

    {
        body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
        boost: [],
    },
    // Level 10
    {
        body: [WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XKH2O', 'XUHO2'],
    },
    // Level 11
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XUHO2', 'XKH2O'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XKH2O'],
    },
    // Level 13
    {
        body: [MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,

            HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL,
        ],
        boost: [],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');

//STRUCTURE_POWER_BANK:
class muleClass extends roleParent {
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
        // First if it's home it will go to storage.
        if (this.spawnRecycle(creep)) {
            return false;
        }

        if (creep.ticksToLive > 1200 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        if (!creep.memory.goHome) {
            if (creep.room.name == creep.memory.home && creep.memory.didPortal) {
                creep.memory.goHome = true;
            }
        }
        if (super.rallyFirst(creep)) return;

        if (creep.memory.goHome === undefined) {
            creep.memory.goHome = false;
        }

        if (creep.memory.level === 9 || creep.memory.level === 13) {
            if (creep.hits < 5000)
                creep.selfHeal();
            if (creep.atFlagRoom) {
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
                var targ = Game.flags[creep.memory.party];
                var spn = Game.getObjectById(creep.memory.recycleID);

                if (targ !== null && spn !== null && targ.pos.isNearTo(spn)) {
                    if (creep.pos.isEqualTo(targ)) {
                        if (creep.memory.recycleID === 'none') {
                            creep.suicide();
                        } else {
                            spn.recycleCreep(creep);
                        }
                        return;
                    } else {
                        creep.moveMe(targ, { maxRooms: 1, reusePath: 50 });
    //                    if(creep.pos.isNearTo(spn)){
//                            spn.recycleCreep(creep);
  //                      }

                    }
                } else {
                        creep.moveMe(spn, { maxRooms: 1, reusePath: 50 });
                        if(creep.pos.isNearTo(spn)){
                            spn.recycleCreep(creep);
                        }
                }
                // }

            } else {
                creep.tuskenTo(Game.flags[creep.memory.party], creep.memory.home, { reusePath: 50 });
            }
            return;
        } else if (creep.memory.level >= 10 && creep.atFlagRoom) {
            if (creep.memory.engineerID === undefined) {
                let tempe = creep.room.find(FIND_MY_CREEPS);
                tempe = _.filter(tempe, function(o) {
                    return o.memory.role === 'engineer';
                });
                if (tempe.length > 0) {
                    creep.memory.engineerID = tempe[0].id;
                }
            }
            if (creep.carry[RESOURCE_ENERGY] === 0) {
                creep.memory.mining = true;
            } else if (creep.carry[RESOURCE_ENERGY] === creep.carryCapacity) {
                creep.memory.mining = false;
            } else if (creep.carry[RESOURCE_ENERGY] >= 3000) {
                creep.memory.mining = false;
            } else if (creep.memory.mining === undefined) {
                creep.memory.mining = false;
            }

            if (!creep.memory.mining) {
                var partner = Game.getObjectById(creep.memory.engineerID);
                if (partner !== null) {
                    creep.moveToTransfer(partner, RESOURCE_ENERGY, { maxOpts: 100,maxRooms:1 });
                } else {
                    creep.memory.engineerID = undefined;
                    creep.memory.mining = true;
                }
            }

            if (creep.memory.mining) {
      //          if (roleParent.constr.withdrawFromTombstone(creep)) {
    //                if (!creep.moveToPickEnergy(100)) {
                        if (!creep.moveToWithdrawSource()) {
                            let totaled = creep.room.find(FIND_SOURCES_ACTIVE);
                            if(totaled.length === 0) creep.memory.mining = false;
                        }

//                    }
  //              }
            }
            creep.say('10' + creep.memory.mining);
            return;
        }
        let total = creep.carryTotal;
        if (total === 0 && creep.room.name !== creep.memory.home && creep.memory.level !== 3) creep.memory.goHome = true;
        if (total === 0 && creep.room.name == creep.memory.home) creep.memory.goHome = false;


        if (!creep.memory.goHome) {
            if ((creep.memory.happy !== undefined || total === creep.carryCapacity) && creep.memory.level !== 9) {

                if (!creep.atFlagRoom) {
                    if (creep.memory.party === 'portal' || creep.memory.level >= 10) {
                        creep.tuskenTo(Game.flags[creep.memory.party], creep.memory.home, { segment: true, reusePath: 50 });
                    } else if (creep.memory.party == 'Flag9' || creep.memory.party == 'Flag12') {
                        creep.tuskenTo(Game.flags[creep.memory.party], creep.memory.home, { reusePath: 50 });
                    } else {
                        creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50, ignoreCreeps: false });
                        creep.say('!');
                    }
                    creep.countDistance();
                    //                    }
                } else {
                    if (creep.room.storage !== undefined && creep.room.controller.level > 3 && creep.room.name !== 'E14S38') {
                        var target = creep.room.storage;
                        if (creep.carry[RESOURCE_ENERGY] === 0) {
                            target = creep.room.terminal;
                        }

                        if (creep.pos.isNearTo(target)) {


                            for (var bb in creep.carry) {
                                creep.transfer(target, bb);
                            }
                            if (creep.memory.party != 'E23S38') {
                                creep.memory.goHome = true;
                            }
                            if (creep.ticksToLive < creep.memory.distance >> 1) creep.suicide();
                            creep.countReset();

                        } else {
                            creep.moveMe(target, { reusePath: 20 });
                        }

                    } else {
                        if (creep.pos.isEqualTo(Game.flags[creep.memory.party].pos)) {
                            creep.drop(RESOURCE_ENERGY);
                            if (creep.ticksToLive < creep.memory.distance >> 1) creep.suicide();
                            creep.countReset();

                        } else {


                            //        creep.moveTo(Game.flags[creep.memory.party], { reusePath: 50, ignoreCreeps: false });
                            var zzed;
                            if (creep.memory.party == 'Flag9' || creep.memory.party == 'Flag12') {
                                zzed = creep.tuskenTo(Game.flags[creep.memory.party], creep.memory.home, { maxRooms: 1 });
                                //creep.moveTo(Game.flags[creep.memory.party], { reusePath: 50, ignoreCreeps: false }); 
                            } else {
                                zzed = creep.moveTo(Game.flags[creep.memory.party], { reusePath: 50, ignoreCreeps: false });
                            }
                            //         creep.say('!@' + zzed);
                        }
                        return;

                    }


                }


            } else {


                let stor = creep.room.terminal;


                if (creep.pos.isNearTo(stor)) {
                    if (creep.memory.pickup !== undefined) {
                        if (creep.ticksToLive < 1200) {
                            creep.memory.death = true;
                            return;
                        }
                        creep.say('%' + stor.structureType);
                        let min = creep.memory.pickup.mineralType;
                        let amnt = creep.memory.pickup.mineralAmount;
                        if (Game.shard.name === 'shard1' && (creep.room.terminal.store[min] === undefined || creep.room.terminal.store[min] < amnt)) {
                            _terminal_().requestMineral(creep.room.name, min);
                        }
                        if (Game.shard.name !== 'shard1' && creep.room.terminal.store[min] !== undefined && creep.room.terminal.store[min] < 5000 && min !== RESOURCE_POWER) {
                            creep.memory.death = true;
                            return;
                        } else if (min === RESOURCE_POWER && creep.room.terminal.store[min] === undefined || creep.room.terminal.store[min] === 0) {
                            creep.memory.death = true;
                            return;
                        }
                        if (creep.room.terminal.store[min] > 0 && amnt > 0 && creep.room.terminal.store[min] < amnt) { amnt = creep.room.terminal.store[min]; }
                        if (creep.room.terminal.store[min] >= amnt && creep.withdraw(stor, min, amnt) === OK) {
                            creep.memory.happy = true;
                        } else {
                            return;
                        }
                    } else if (creep.room.name == 'E38S81') {
                        if (creep.ticksToLive < 1200) {
                            creep.memory.death = true;
                            return;
                        }
                        for (var l in stor.store) {
                            if (stor.store[l] > 0 && l !== RESOURCE_ENERGY) {
                                creep.withdraw(stor, l);
                                break;
                            }
                        }
                    } else {

                        creep.withdraw(stor, RESOURCE_ENERGY);
                    }
                } else {
                    creep.moveMe(stor, { reusePath: 20 });
                }

            }


        } else {
            if (creep.room.name == creep.memory.home && !creep.memory.didPortal) {
                creep.memory.goHome = false;
            } else {
                if (creep.isHome && creep.carryTotal > 0 && !creep.memory.didPortal) {
                    creep.moveToTransfer(creep.room.terminal, creep.carrying);
                    creep.say('trs');
                    return;
                }
                if (creep.atFlagRoom && creep.carryTotal > 0 && creep.memory.didPortal) {
                    let tgtt= creep.room.terminal;
                    if(tgtt.total === 300000) tgtt = creep.room.storage;
                    creep.moveToTransfer(tgtt, creep.carrying);
                    creep.say('trs2');
                    return;
                } else {
                    creep.moveMe(creep.partyFlag, { reusePath: 50 });
                }
                /*                let zz = Game.getObjectById(creep.memory.parent);
                                if (zz !== null && creep.carryTotal > 0) {
                                    zz = zz.room.terminal;
                                    if (creep.pos.isNearTo(zz)) {
                                        creep.transfer(zz, creep.carrying);
                                    } else {
                                        //creep.moveMe(zz, { reusePath: 50, ignoreCreeps: true });
                                        //                            creep.tuskenTo(zz,creep.partyFlag.pos.roomName);
                                        creep.moveMe(zz, { reusePath: 50, ignoreCreeps: true });
                                    }
                                }*/
                if (creep.carryTotal === 0 && creep.memory.didPortal) {
                    creep.memory.death = true;
                }
            }
        }
    }
}

module.exports = muleClass;