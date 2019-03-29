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

];
var roleParent = require('role.parent');



// Here are the things we need.
// offshard - takes from storage and moves to portal
//      From Portal moves to storage and deposit
// mainShard - takes from storage and moves to portal
//      From Portal Moves to storage and deposits.


function roadMove(creep) {
    if (!creep.room.controller || !creep.room.controller.owner || creep.room.controller.owner.username !== 'likeafox') {
        return true;
    }
    return false;
}

function manageMemory(creep) {
    if (creep.memory.toPortal === undefined) {
        if (creep.carryTotal > 0) {
            creep.memory.toPortal = false; // Moving to Portal -
        } else {
            if (creep.room.terminal && creep.room.terminal.my) {
                creep.memory.toPortal = true; // Moving From Portal
            } else if (creep.carryTotal === 0) {
                creep.suicide();
            }
        }
    }

    if (creep.memory.shardFrom === undefined) {
        if (creep.name[0] === '0' && creep.name[18] === '1') {
            creep.memory.shardFrom = 'shard1';
        } else if (creep.name[9] === 'd' && creep.name[17] === '1') {
            creep.memory.shardFrom = 'shard1';
        } else if (creep.name[0] === '0' && creep.name[18] === '2') {
            creep.memory.shardFrom = 'shard2';
        } else if (creep.name[9] === 'd' && creep.name[17] === '2') {
            creep.memory.shardFrom = 'shard2';
        } else if (creep.name[9] === 'd' && creep.name[17] === '3') { // Shard2 from shard 3
            creep.memory.shardFrom = 'shard3';
        }
    }
    if (creep.memory.return2Shard === undefined) {
        if (creep.name[0] === '0' || (creep.name[0] === 'r' && creep.name[1] === 't' && creep.name[2] === 'r')) {
            creep.memory.return2Shard = true;
        } else {
            creep.memory.return2Shard = false;
        }
    }
    if (creep.memory.party === 'shard1' && creep.room.name === 'E20S50') {
        creep.memory.toPortal = true;
    }


    // Death conditions. 
    if (creep.carryTotal !== creep.carryCapacity) {
        if (Game.shard.name === 'shard3' && creep.room.storage.total - creep.room.storage.store[RESOURCE_ENERGY] < 4500) {
            creep.memory.death = true;
        } else if (Game.shard.name === 'shard3' && creep.room.storage.total < 10000) {
            //  creep.memory.death = true;
        }
    }

    if (creep.carryTotal === 0 && creep.carryCapacity !== 0) {
        //    if (creep.memory.toPortal && creep.room.terminal && creep.pos.isNearTo(creep.room.terminal) && creep.memory.stuckCount > 4) {
        //            creep.memory.death = true;
        //      }
        if (creep.memory.toPortal) {
            if (Game.shard.name === 'shard0' && creep.memory.stuckCount === 5) creep.memory.death = true;
            if (creep.room.storage && creep.room.storage.total === creep.room.storage.store[RESOURCE_ENERGY]) {
                creep.memory.death = true;
            }
            if (creep.memory.readyToPortal && creep.room.alphaSpawn) { // Needs to be one of the top things.
                creep.memory.death = true;
            }
            if (creep.ticksToLive < 500 && creep.room.alphaSpawn) {
                creep.memory.death = true;
            }
            if (creep.memory.holding && creep.room.storage) {
                if (Game.shard.name !== 'shard2' && creep.room.storage.store[creep.memory.holding] > 0 && (creep.room.storage.total - creep.room.storage.store[creep.memory.holding]) === creep.room.storage.store[RESOURCE_ENERGY]) {
                    creep.memory.death = true;
                }
            }
        }

        if (creep.ticksToLive < 500 && creep.room.alphaSpawn) creep.memory.death = true;

        if (Game.shard.name === 'shard0' && creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] === creep.room.storage.total) {

            creep.memory.death = true;

        }

        //                  if (creep.carryTotal === 0) {
        //                    if (!creep.memory.return2Shard ) { //rtrn/send/requ //
        //                      creep.memory.death = true;
        //                    }
        //              }
    }

    if (creep.carryTotal === 0 && !creep.memory.toPortal) {
        // If empty and isn't going to portal then it means it's deposited.

        creep.memory.toPortal = true;
        creep.memory.home = creep.room.name;
        if (Game.shard.name === 'shard0') {
            creep.memory.party = 'shard1';
        } else if (Game.shard.name === 'shard1') {
            if (creep.room.name === 'E21S49') {
                creep.memory.party = 'shard2';

            } else if (creep.room.name === 'E23S38' || creep.room.name === 'E23S42') {
                creep.memory.party = 'shard0';
            }
        } else if (Game.shard.name === 'shard2') {
            creep.memory.party = 'shard1';
        }

    }

    if (creep.memory.toPortal) {
        if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] === creep.room.storage.total) {
            if (creep.carryTotal === 0) {

            } else {
                creep.memory.readyToPortal = true;
            }
        }
        if (creep.memory.readyToPortal === undefined && creep.memory.shardFrom === 'shard3' && Game.shard.name === 'shard2') {

            creep.memory.readyToPortal = true;
        }
        if (creep.carryTotal === creep.carryCapacity) {
            creep.memory.readyToPortal = true;
        }
        if (!creep.memory.readyToPortal && (creep.room.storage || creep.room.terminal)) {
            if (Game.shard.name !== 'shard1') {
                // Take from storage
                creep.memory.depositTarget = 'storage';

            } else {
                // Take from terminal.
                creep.memory.depositTarget = 'terminal';
            }
        }
    }

}

function movement(creep) {
    // Party Determines where you are going.
    if (creep.memory.toPortal) {

        if (creep.memory.readyToPortal) { // Needs to be one of the top things.
            creep.moveMe(creep.partyFlag, { reusePath: 50 });
            // if(Game.shard.name !== 'shard0')          creep.say('P');
        } else if (creep.memory.depositTarget !== undefined) {
            if (creep.memory.depositTarget === 'storage' && creep.room.storage) {
                creep.moveMe(creep.room.storage, { reusePath: 50, range: 1, ignoreRoads: roadMove(creep) });
            }
            if (creep.memory.depositTarget === 'terminal' && creep.room.terminal) {
                creep.moveMe(creep.room.terminal, { reusePath: 50, range: 1, ignoreRoads: roadMove(creep) });
            }
        }
    }
    if (!creep.memory.toPortal) {

        if (creep.partyFlag && creep.room.name === creep.partyFlag.pos.roomName) {
            creep.memory.followerID = undefined;
            creep.memory.leaderID = undefined;
            if (creep.room.terminal.total === 300000) {
                creep.moveMe(creep.room.storage, { reusePath: 50, ignoreRoads: roadMove(creep) });
            } else {
                creep.moveMe(creep.room.terminal, { reusePath: 50, ignoreRoads: roadMove(creep) });
            }
        } else {
            creep.moveMe(creep.partyFlag, { reusePath: 50, ignoreRoads: roadMove(creep) });
            // if(Game.shard.name !== 'shard0')            creep.say('🏦');
        }
    }

}

function getMostNonEnergy(terminal) {
    if (!terminal) return;
    let highestMin;
    let highestAmt = 1;
    for (let i in terminal.store) {
        if (i !== RESOURCE_ENERGY && terminal.store[i] > highestAmt) {
            highestAmt = terminal.store[i];
            highestMin = i;
        }
    }
    return highestMin;
}

function containerInteract(creep) {
    if (creep.memory.toPortal) {
        if (creep.memory.depositTarget !== undefined) {
            let target;
            if (creep.memory.depositTarget === 'terminal' && creep.room.terminal && creep.pos.isNearTo(creep.room.terminal)) {
                target = creep.room.terminal;
            } else if (creep.memory.depositTarget === 'storage' && creep.room.storage && creep.pos.isNearTo(creep.room.storage)) {
                target = creep.room.storage;
            }

            if (Game.shard.name !== 'shard1' && target) {
                let withdraw = false;

                if (creep.room.memory.shardNeeded !== undefined && creep.room.storage.store[creep.room.memory.shardNeeded] > 0 && creep.pos.isNearTo(creep.room.storage)) {
                    if (creep.withdraw(creep.room.storage, creep.room.memory.shardNeeded) === OK) {
                        creep.room.memory.shardNeeded = undefined;
                    }
                    return;
                }


                if (creep.room.storage.total !== creep.room.storage.store[RESOURCE_ENERGY] && creep.withdraw(creep.room.storage, getMostNonEnergy(creep.room.storage)) === OK) {
                    withdraw = true;
                }
                if (!withdraw) {
                    for (var e in target.store) {
                        if (e !== RESOURCE_ENERGY && target.store[e] > 0 && e !== creep.memory.holding && creep.room.terminal.store[e] >= 4500) {
                            creep.withdraw(creep.room.storage, e);
                            withdraw = true;
                            break;
                        } else if (Game.shard.name === 'shard0' && e === creep.memory.holding && creep.carryTotal > 0) {
                            creep.memory.readyToPortal = true;
                        }
                    }
                }
                if (!withdraw && Game.shard.name === 'shard2' && creep.room.name === 'E19S49') {
                    //if (creep.room.storage.store.energy > 990000) {
                    if (creep.memory.return2Shard === true || creep.memory.party === 'shard3') {
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                        if (creep.memory.party !== 'shard3') creep.memory.party = 'shard1';
                    } else {
                        //                        creep.memory.death = true;
                    }
                }
                if (!withdraw && Game.shard.name === 'shard3') {
                    creep.memory.death = true;
                }
            } else if (target && creep.carryTotal < creep.carryCapacity) {

                let request;
                if (creep.memory.party === 'shard0') {
                    request = Memory.shard0Requests;
                } else if (creep.memory.party === 'shard2') {
                    request = Memory.shard2Requests;
                } else if (creep.memory.party === 'shard3') {
                    request = Memory.shard3Requests;
                }

                var total = 0;
                for (let mineral in request) {
                    if(request[mineral] === 0) continue;
//                    if(mineral === RESOURCE_ENERGY) continue;
                    let amnt = request[mineral];
                    if (amnt > creep.carryCapacity - creep.carryTotal) {
                        amnt = creep.carryCapacity - creep.carryTotal;
                    }
                    if (target.store[mineral] < amnt) {
                        amnt = target.store[mineral];
                    }
                    if(target.store[mineral] > 0) total += request[mineral];

                    if (mineral === RESOURCE_POWER && target.store[RESOURCE_POWER] === 0) {
                        total -= request[mineral];
                    }
                    if (target.store[mineral] < request[mineral]||!target.store[mineral]) {
                        roomRequestMineral(creep.room.name, mineral, 1250);

                        if(Memory.stats.totalMinerals[mineral] < 20000){
                            request[mineral] = 0;
                            continue;
                        }
                    } //&& (!creep.carry[mineral] || creep.carry[mineral] === 0)mineral !== RESOURCE_ENERGY 
                    if ( request[mineral] !== 0) {
                        let rsult = creep.withdraw(target, mineral, amnt);
                        if (rsult === OK) {
                            request[mineral] -= amnt;
                            return;
                        }
                    }
                    /*                   else     if (mineral === RESOURCE_ENERGY && request[mineral] > 0) {
                        let rsult = creep.withdraw(target, mineral);
                        if (rsult === OK) {
                            request[mineral] -= 1250;
                                return;
                        }
                    }*/


                }
                if (total === 0) {

                    if (creep.carryTotal === 0) {
                        if (creep.memory.return2Shard) { //rtrn/send/requ //
                            creep.withdraw(target, RESOURCE_ENERGY);
                            if (creep.room.name === 'E21S49') {
                                creep.memory.party = 'shard2';
                            } else if (creep.room.name === 'E23S38') {
                                creep.memory.party = 'shard0';
                            }
                            return;
                        } else {
                                                            creep.memory.death = true;
                        }

                    } else {
                                                    creep.withdraw(target, RESOURCE_ENERGY);
                                                  creep.memory.readyToPortal = true;
                        //                        return;
                    }
                }

                if (creep.carryTotal === 0) {
                    //      creep.memory.death = true;
                } else {
                    //    creep.memory.readyToPortal = true;
                }

            }
        }
    } else if (!creep.memory.toPortal) {
        if (creep.memory.holding === undefined)
            creep.memory.holding = creep.carrying;
        if (creep.pos.isNearTo(creep.room.terminal)) {
            creep.transfer(creep.room.terminal, creep.carrying);
        } else if (creep.pos.isNearTo(creep.room.storage)) {
            creep.transfer(creep.room.storage, creep.carrying);
        }
    }
}

//STRUCTURE_POWER_BANK:
class shardMuleClass extends roleParent {
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

        if (creep.fatigue > 0 && creep.hits !== creep.hitsMax) {
            creep.drop(creep.carrying, 50);
        }
        if (creep.partyFlag && creep.partyFlag.memory.CachedPathOn2 === false && creep.partyFlag.memory.CachedPathOn === false) creep.createTrain();
        if (creep.memory.toPortal !== undefined) {
            if (creep.saying === 'xP') {
                if (creep.memory.leaderID || creep.memory.followerID) {
                    creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50, ignoreRoads: roadMove(creep) });
                } else {
                    creep.moveTo(Game.flags[creep.memory.party], { reusePath: 50, ignoreRoads: roadMove(creep) });
                }


                creep.say('P');
                return;
            }
            if (creep.saying === 'x🏦' && creep.room.name !== creep.partyFlag.pos.roomName) {
                if (creep.memory.leaderID || creep.memory.followerID) {
                    creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50, ignoreRoads: roadMove(creep) });
                } else {
                    creep.moveTo(creep.partyFlag, { reusePath: 50, ignoreRoads: roadMove(creep) });
                }
                creep.say('🏦');
                return;
                //            }
            }
        }
        if (creep.memory.shardFrom === 'shard3' && Game.shard.name !== 'shard3' && creep.room.name === 'E21S49') creep.memory.death = true;
        if (creep.memory.death) {
            if (creep.room.name === 'E38S72') {
                let spawn = Game.getObjectById('5b96dac388d207516812174b');
                if (spawn) {
                    if (creep.pos.isNearTo(spawn)) {
                        spawn.recycleCreep(creep);
                    } else {
                        creep.moveMe(spawn, { reusePath: 20 });
                    }
                }
                creep.say('DEATH0');
            } else if (creep.room.name === 'E19S49' && Game.shard.name === 'shard3') {
                let spawn = Game.getObjectById('5c0e95baae07965cadec8623');
                if (spawn) {
                    if (creep.pos.isNearTo(spawn)) {
                        spawn.recycleCreep(creep);
                    } else {
                        creep.moveMe(spawn, { reusePath: 20 });
                    }
                }
                creep.say('DEATH0');
            } else if (creep.room.name === 'E19S49') {
                let spawn = Game.getObjectById('5bb3adf91d1607668bd711a2');
                if (spawn) {
                    if (creep.pos.isNearTo(spawn)) {
                        spawn.recycleCreep(creep);
                    } else {
                        creep.moveMe(spawn, { reusePath: 20 });
                    }
                }
                creep.say('DEATH0');
            } else if (creep.room.alphaSpawn) {
                let spawn = creep.room.alphaSpawn;
                if (creep.room.name === 'E19S49' && Game.shard.name === 'shard2') {
                    let spawn2 = Game.getObjectById('5bb3adf91d1607668bd711a2');
                    if (!spawn2) spawn = spawn2;
                }
                if (creep.room.name === 'E21S49') {
                    let spawn2 = Game.getObjectById('5c537d236cafed0225eb90c3');
                }
                if (creep.pos.isNearTo(spawn)) {
                    spawn.recycleCreep(creep);
                } else {
                    creep.moveMe(spawn, { reusePath: 20 });
                }
                creep.say('DEATH1');
            } else if (creep.room.name === creep.memory.home) {
                if (creep.pos.isNearTo(creep.room.alphaSpawn)) {
                    creep.room.alphaSpawn.recycleCreep(creep);
                } else {
                    creep.moveMe(creep.room.alphaSpawn, { reusePath: 20 });
                }
                creep.say('DEATH2');
            } else {
                creep.moveMe(Game.flags[creep.memory.home]);
                creep.say('DEATH3');
            }

            return;
        }
        if (creep.memory.party === 'shard3' && creep.room.name === 'E20S50') {
            creep.moveMe(creep.partyFlag);
            return;
        }

        // Two things to determine first.
        // Are we going to the portal
        // are we empty.
        manageMemory(creep);
        containerInteract(creep);
        movement(creep);
    }
}

module.exports = shardMuleClass;