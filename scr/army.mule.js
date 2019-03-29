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
    // Level 4 25/25
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
    /*
    15 to 15 - 1 to 1 = 1250
    16 to 32 - 2 to 1 = 3200
    12 to 36 - 3 to 1 = 5400
    10 to 40 - 4 to 1 = 8000
    */
    // Level 5  25/25 again for consistance
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
    { // CARRYING 3200 
        body: [
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY,

            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE,
        ],
        boost: ['KH', 'ZO'],
    },
    // Level 7
    { // CARRYING 
        body: [
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,

            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, MOVE,
            CARRY, CARRY, CARRY, MOVE,

        ],
        boost: ['KH2O', 'ZH2O'],
    },
    // Level 8
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XKH2O'],
    },
    // Level 9

    {
        body: [MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, MOVE, HEAL, ],
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
    // Level 14
    {
        body: [MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, MOVE, RANGED_ATTACK, ],
        boost: [],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');

function newRoomWork(creep) {
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
        if (creep.memory.sourceID !== undefined) {
            let source = Game.getObjectById(creep.memory.sourceID);
            if (source !== null && source.energy === 0) {
                creep.memory.mining = false;
            }
        }
    } else if (creep.memory.mining === undefined) {
        creep.memory.mining = false;
    }

    if (!creep.memory.mining) {
        var partner = Game.getObjectById(creep.memory.engineerID);
        //partner.

        if (partner !== null) {
            creep.moveToTransfer(partner, RESOURCE_ENERGY, { maxOpts: 100, maxRooms: 1 });
            partner.memory.building = true;
            if (partner.carryTotal !== partner.carryCapacity) {
                partner.cancelOrder('move');
                partner.memory.stopMoving = true;
            } else {
                creep.memory.mining = true;
            }
        } else {
            creep.memory.engineerID = undefined;
            creep.memory.mining = true;
        }
    } else {
        //          if (roleParent.constr.withdrawFromTombstone(creep)) {
        //                    if (!creep.moveToPickEnergy(100)) {
        if (!creep.moveToWithdrawSource()) {
            let totaled = creep.room.find(FIND_SOURCES_ACTIVE);
            if (totaled.length === 0) creep.memory.mining = false;
            //                      }

            //                    }
        }
    }
    //            creep.say('10' + creep.memory.mining);    
}

function doHealMule(creep) {
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
        if( spn !== null && creep.room.storage){
            if (creep.pos.isNearTo(spn)) {
                spn.recycleCreep(creep);
                return;
            } else {
                creep.moveMe(spn, { maxRooms: 1, reusePath: 50 });
            }
        } else 
        if (targ !== null && spn !== null && targ.pos.isNearTo(spn)) {
            if (creep.pos.isEqualTo(targ)) {

                spn.recycleCreep(creep);

                return;
            } else {
                creep.moveMe(targ, { maxRooms: 1, reusePath: 50 });
                //                    if(creep.pos.isNearTo(spn)){
                //                            spn.recycleCreep(creep);
                //                      }
            }
            //if (creep.pos.isNearTo(spn)) {
            //   spn.recycleCreep(creep);
            //return;
            //}            
        } else if (spn === null) {
            creep.moveMe(targ, { maxRooms: 1, reusePath: 50 });
            if (creep.pos.isEqualTo(targ)) {
                creep.suicide();
            }
        } else {
            creep.moveMe(spn, { maxRooms: 1, reusePath: 50 });
            if (creep.pos.isNearTo(spn)) {
                spn.recycleCreep(creep);
            }
        }
        // }

    } else {
        if(Game.shard.name === 'shard1'){
            creep.tuskenTo(Game.flags[creep.memory.party], creep.memory.home, { reusePath: 50, useSKPathing: true });
        }else {
            creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50, useSKPathing: true });
        }

    
    }
}

function getLowMineral(creep) {
    let storage = creep.room.storage;
    let amount = 0;
    let resource;
    for (var e in storage.store) {
        if (e !== RESOURCE_ENERGY) {
            if (storage.store[e] > amount) {
                amount = storage.store[e];
                resource = e;
            }
        }
    }
    return resource;
}

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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
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

        if (super.rallyFirst(creep)) return;

        if (creep.memory.goHome === undefined) {
            creep.memory.goHome = false;
        }

        if (!creep.memory.goHome) {
            if (creep.room.name == creep.memory.home && creep.memory.didPortal) {
                creep.memory.goHome = true;
            }
        } else if (creep.memory.goHome === true) {
            if (creep.carryTotal > 0) {
                creep.memory.goHome = false;
            }
        }

        if (creep.carryCapacity <= 500 ) {
            doHealMule(creep);
            return;
        } else if (creep.memory.level >= 10 && creep.atFlagRoom) {
            newRoomWork(creep);
            return;
        }
        let total = creep.carryTotal;
        if (total === 0 && creep.room.name !== creep.memory.home && creep.memory.level !== 3) creep.memory.goHome = true;
        if (total === 0 && creep.room.name == creep.memory.home) creep.memory.goHome = false;


        if (creep.room.storage && creep.room.storage.total === creep.room.storage.store[RESOURCE_ENERGY]) {
            if (creep.carryTotal > 0 && creep.room.name === creep.memory.home) {
                creep.memory.goHome = false;
            } else if (creep.carryTotal === 0) {
                creep.memory.goHome = true;
            }
        }
        //     if(creep.memory.party === 'support') creep.createTrain();

        if (!creep.memory.goHome) {
            if (creep.carryTotal < creep.carryCapacity && creep.memory.home === creep.room.name) {
                creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                return;
            }
            if (!creep.atFlagRoom) {
                creep.say('T');
/*
                creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50, useSKPathing: true });*/
                creep.tuskenTo(Game.flags[creep.memory.party],creep.memory.home, { reusePath: 50, useSKPathing: true });
                creep.countDistance();
            } else {
                if (creep.room.storage !== undefined && creep.room.controller.level > 3) {
                    var target = creep.room.storage;
                    if (creep.pos.isNearTo(target)) {
                        creep.transfer(target, creep.carrying);
                        if (creep.ticksToLive < creep.memory.distance >> 1) creep.suicide();
                        creep.countReset();
                    } else {
                        creep.moveMe(target, { reusePath: 20, ignoreCreeps: false });
                    }

                } else {
                    if (creep.pos.isEqualTo(Game.flags[creep.memory.party].pos)) {
                        creep.drop(RESOURCE_ENERGY);
                        if (creep.ticksToLive < creep.memory.distance >> 1) creep.suicide();
                        creep.countReset();

                    } else {
                        creep.moveTo(Game.flags[creep.memory.party], { reusePath: 50, ignoreCreeps: false });
                    }
                }
            }
        } else {
            if(creep.memory.home === 'E20S50'){ // This means it's intershard creep that needs death;
                creep.memory.death = true;
                return;
            }
            creep.moveMe(Game.flags[creep.memory.home], { reusePath: 50 });
        }
    }
}

module.exports = muleClass;