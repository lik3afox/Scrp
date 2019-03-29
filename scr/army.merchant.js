//Back line
// Designed to do damage to all.

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
    [CARRY, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE,
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
        body: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,

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
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
        boost: ['XGHO2', 'XZHO2', 'KH'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, TOUGH, TOUGH, TOUGH, CARRY, TOUGH, TOUGH, CARRY, TOUGH, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XKH2O', 'XGHO2', 'XZHO2'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, TOUGH, TOUGH, TOUGH, CARRY, TOUGH, TOUGH, CARRY,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, CARRY, TOUGH, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XKH2O'],
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
        body: [],
        boost: [],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var contain = require('commands.toContainer');

//STRUCTURE_POWER_BANK:
class thiefClass extends roleParent {


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
        if(!creep.className){

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        creep.memory.death = creep.partyFlag === undefined;
        }

        if ( creep.room.name === 'E1S11' && creep.memory.travelHome === undefined) {

            if (creep.carryTotal === 0) {
                if (creep.className && creep.ticksToLive < 200) {
                    creep.memory.death = true;
                }
                //creep.memory.getEnergy = true;
                creep.memory.travelTo = true;

            } else {
                if (creep.carryTotal > 0) {
                    creep.memory.travelHome = true;
                } else if (creep.carryTotal === creep.carryCapacity) {
                    //                    creep.memory.travelTo = true;
                    creep.memory.getEnergy = undefined;
                }
            }
        }
let flag = creep.partyFlag;
        if (creep.room.name === flag.pos.roomName) {
            creep.memory.travelTo = undefined;
            /*            if(creep.carrying === RESOURCE_ENERGY && creep.carryTotal > 0){
                            creep.moveToTransfer(creep.room.storage,RESOURCE_ENERGY,{reusePath:50});
                        } else*/

            if (creep.carryTotal < creep.carryCapacity) {
                let tgt = creep.room.terminal;
                let mins = ['X', 'U', 'L', 'Z', 'K', 'O', 'H', 'XGH2O', RESOURCE_POWER, RESOURCE_ENERGY];
                for (let i in mins) {
                    let mineral = mins[i];
                    let amnt = 500;
                    if(mineral === 'XGH2O'){
                        amnt = 75;
                    } else if (mineral === RESOURCE_POWER || mineral === RESOURCE_ENERGY) {
                        amnt = creep.carryCapacity - creep.carryTotal;
                    } else if (Memory.stats.totalMinerals[mineral] > 100000 || creep.room.terminal.store[mineral] < 10000) {
                        continue;
                    }
                    if(creep.room.terminal.store[mineral]  < amnt ) {
                        amnt = creep.room.terminal.store[mineral];
                    }
                    if (!creep.carry[mineral] && creep.room.terminal.store[mineral] >= amnt) {
                        if (creep.pos.isNearTo(tgt)) {
                            creep.withdraw(tgt, mineral, amnt);
                        } else {
                            creep.moveMe(tgt, { reusePath: 50 });
                        }
                        break;
                    }
                }
            } else if (creep.carryTotal === creep.carryCapacity) { //creep.carrying === RESOURCE_POWER &&
                creep.memory.travelHome = true;
            }
        }

        if (creep.memory.getEnergy) {
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
        }
        if (creep.memory.travelTo) {
            creep.moveMe(flag, { reusePath: 50 });
        }
        if (creep.memory.travelHome) {
            let home = creep.memory.home;
            if(creep.className){
                home = 'E1S11';
            }
            let tgt = Game.rooms[home].storage;
            if (tgt.full) tgt = Game.rooms[home].terminal;
            //            if(tgt.nearFull) return;
            if (creep.carry[RESOURCE_ENERGY] > 0 && creep.room.powerspawn && creep.pos.isNearTo(creep.room.powerspawn)) {
                creep.transfer(creep.room.powerspawn, RESOURCE_ENERGY);
            }
            if (creep.pos.isNearTo(tgt)) {
                creep.say(creep.transfer(tgt, creep.carrying));
                creep.memory.travelHome = undefined;
            } else {
                creep.moveMe(tgt, { reusePath: 50 });
            }
        }

    }
}

module.exports = thiefClass;