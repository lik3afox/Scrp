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

function clearLabs(creep) {
    let labs = creep.room.find(FIND_STRUCTURES);
    labs = _.filter(labs, function(structure) {
        return (structure.structureType == STRUCTURE_LAB && structure.mineralAmount > 0);
    });
    //    creep.say(labs.length);
    if (labs.length > 0) {

        let zzz = labs[0];
        if (creep.pos.isNearTo(zzz)) {
            if (zzz.mineralAmount > 0) {
                creep.withdraw(zzz, zzz.mineralType);
            } else {
                //                creep.withdraw(zzz,RESOURCE_ENERGY);
            }
        } else {
            creep.moveMe(zzz, { reusePath: 30 });
        }
    }
}

function powerAction(creep) {
//    creep.createTrain();
    if (creep.carryTotal === 0) {
        if (Game.flags[creep.memory.party] === undefined) {
            if (creep.isHome) {
                creep.memory.death = true;
                return;
            } else {
                let target = Game.rooms[creep.memory.home].terminal;
                creep.moveMe(target, { reusePath: 50 });
                creep.say(';(');
            }
        }
        if (creep.memory.flagLoc === undefined && creep.partyFlag) creep.memory.flagLoc = Game.flags[creep.memory.party].pos.roomName;
        if (Game.flags[creep.memory.party] !== undefined && creep.pos.inRangeTo(Game.flags[creep.memory.party], 2)) {
            let resource = creep.room.find(FIND_DROPPED_RESOURCES);
            resource = _.filter(resource, function(o) {
                return o.resourceType === RESOURCE_POWER;
            });
            if (resource.length > 0) {
                if (creep.pos.isNearTo(resource[0])) {
                    if (creep.pickup(resource[0]) === OK && Game.shard.name !== 'shard1') {
                        creep.memory.role = 'mule';
                        creep.memory.party = 'shard1';
                        creep.memory.followerID = undefined;
                        creep.memory.leaderID = undefined;
                    }
                } else {
                    creep.moveTo(resource[0], { reusePath: 10 });
                }
            } else {
                creep.sleep(creep.memory.roleID + 4);
            }

        } else {
//            creep.moveMe(Game.flags[creep.memory.party], { ignoreCreeps: true, reusePath: 100 });
            creep.tuskenTo(Game.flags[creep.memory.party],creep.memory.home, { ignoreCreeps: true, reusePath: 100 });
            if (creep.memory.leaderID) {
                let lead = Game.getObjectById(creep.memory.leaderID);
                if (lead && creep.pos.isNearTo(lead) && lead.memory.sleeping) {
                    creep.sleep(3);
                    return true;
                }
            }
        }
    } else {
        let target;
        target = Game.rooms[creep.memory.home].terminal;
        if (creep.pos.isNearTo(target)) {
            creep.transfer(target, creep.carrying);
        } else {
            creep.moveMe(target, { reusePath: 50 });
        }
    }
    return true;
}


function banditAction(creep) {
    var constr = require('commands.toStructure');

    if (creep.memory.goHome === undefined) creep.memory.goHome = false;
    if (Game.flags[creep.memory.party] === undefined) {
        if (creep.carryTotal === 0) {
            creep.memory.death = true;
            return;
        }
        creep.memory.goHome = true;
    }

    if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.goHome = true;
    }
    if (creep.carryTotal === 0) {
        creep.memory.goHome = false;
    }
    if (creep.memory.goHome) {
        var stor = Game.rooms[creep.memory.home].storage;
        if (creep.moveToTransfer(stor, creep.carrying, { reusePath: 50 })) {
            creep.countDistance();
        }
        if (creep.room.name === creep.memory.home) {
            creep.memory.followerID = undefined;
            creep.memory.leaderID = undefined;
        }
        return;
    }
    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            //if (!roleParent.constr.withdrawFromTombstone(creep,undefined,false)) {
            if (!roleParent.constr.withdrawFromTS(creep)) {
                if(!creep.pos.inRangeTo(creep.partyFlag,5)){
                    creep.moveMe(creep.partyFlag, { reusePath: 50 });
                } else {
                    creep.sleep(10);
                }
            } else {
                creep.memory.followerID = undefined;
                creep.memory.leaderID = undefined;

            }
            return;
        } else {
            creep.moveMe(creep.partyFlag, { reusePath: 50 });
            creep.say('M');
        }
    } else {
        let stoedr = Game.rooms[creep.memory.home].storage;
        if (creep.moveToTransfer(stoedr, creep.carrying, { reusePath: 50 })) {
            creep.countDistance();
        }

    }
}
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
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        if (creep.partyFlag && creep.partyFlag.memory.thiefOps === undefined) {
            creep.partyFlag.memory.thiefOps = {
                pickUp: true,
            };
        }

        if (creep.partyFlag  && creep.partyFlag.memory.bandit) {
            creep.say('bandit');
            banditAction(creep);
            return;
        } else if (super.isPowerParty(creep)) {
            if (powerAction(creep)) return;
        }
        if(!creep.partyFlag || creep.partyFlag.color === COLOR_WHITE){
        creep.memory.death = creep.partyFlag === undefined;
        return;
        }

        let creepCarry = creep.carryTotal;

        if (creep.memory.home == creep.room.name && creep.carryTotal > 0) {
            // Find Minearls.
            let room = Game.rooms[creep.memory.home];
            let target = room.terminal;
            if (target === undefined || room.terminal.full) target = room.storage;  
            creep.countDistance();
            if (!creep.pos.isNearTo(target)) {
                creep.moveMe(target, { reusePath: 50 });
            } else {
                creep.transfer(target, creep.carrying);
                if(creep.ticksToLive <= creep.memory.distance*2){
                    creep.memory.death = true;
                }
                creep.countReset();
            }
            return;
        }

        let isThere = false;
        if (Game.flags[creep.memory.party] !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            isThere = true;
        }
        if(creep.room.name === 'E6S26'){
            if(creepCarry == creep.carryCapacity){
            creep.moveMe(Game.flags.Flag1);
            } else {
            creep.moveMe(Game.flags.Flag9);
            }
            return;
        }

        if (creepCarry == creep.carryCapacity) {
            if (creep.memory.home != creep.room.name) {
                let parent = Game.getObjectById(creep.memory.parent);
                if(creep.partyFlag){
                    creep.tuskenTo(parent, creep.partyFlag.pos.roomName, { reusePath: 50, useSKPathing: true });
                }
                creep.countDistance();
            }
            return;
        } else if (!isThere) {
            let zz = creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50, useSKPathing: true });
        } else if (creepCarry < creep.carryCapacity && isThere) {
            let target;
            let getting;

            if (creep.room.name === 'E3S11') {
                //let tgt = creep.room.storage;
                let tgt = Game.getObjectById('59873a4a8d2e9a67917ee257');
                if (!tgt) {
                    tgt = creep.room.terminal;
                    if (tgt.store[RESOURCE_POWER] === 0) {
                        tgt = creep.room.storage;
                    }
                    if (creep.pos.isNearTo(tgt)) {
                        creep.withdraw(tgt, RESOURCE_POWER);
                    } else {
                        creep.moveMe(tgt, { reusePath: 50 });
                    }
                    creep.say('!');
                    return;
                }
            }
            if (creep.partyFlag.memory.thiefOps.pickUp) {
                if( creep.moveToPickUp(FIND_DROPPED_RESOURCES, undefined, { reusePath: 50 }) === OK){
                return;    
            } 
                
            } 
                if (creep.room.name === creep.partyFlag.pos.roomName && (creep.room.storage !== undefined && creep.room.storage.pos.lookForStructure(STRUCTURE_RAMPART) && (creep.room.terminal !== undefined && creep.room.terminal.pos.lookForStructure(STRUCTURE_RAMPART)))) {

                    creep.moveMe(creep.partyFlag, { reusePath: 30 });
                    creep.say("waiting");
                    return;
                }

                if (getting === undefined) {
                	if(!creep.room.storage || creep.room.storage.total === 0){
	                    target = creep.room.terminal;
                	} else {
		                target = creep.room.storage;
                	}
                if(target.store[RESOURCE_POWER]){
                    getting = RESOURCE_POWER;
                }
                    if (target !== undefined) {
                var keys = Object.keys(target.store);
                var e = keys.length;
                var o;
                while (e--) {
                    o = keys[e];
                            if (target.store[o] > 0 && o !== RESOURCE_ENERGY) { // 
                                getting = o;
                                break;
                            }
                }

                    }
                }
                if (getting === undefined && creep.room.storage.total === 0 && creep.room.terminal.total === 0) {
                    if(creep.partyFlag.memory.autoSiege){
                        creep.memory.death = true;
                    } else {
                        creep.partyFlag.remove();
                    if (creep.partyFlag === undefined) {
                            creep.memory.death = true;
                        return;
                    }
                    }
                }
            


            if (creep.pos.isNearTo(target)) {
                switch (creep.withdraw(target, getting)) {
                    case OK:
                        creep.say('ty', true);
                        break;
                    case -1:
                        creep.say(':(', true);
                        break;
                }
                return;
            } else {
                creep.moveTo(target, { reusePath: 30 });
            }
        }
    }
}

module.exports = thiefClass;