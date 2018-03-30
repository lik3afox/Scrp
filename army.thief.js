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
    creep.say(labs.length);
    if (labs.length > 0) {

        let zzz = labs[0];
        if (creep.pos.isNearTo(zzz)) {
            if (zzz.mineralAmount > 0) {
                creep.withdraw(zzz, zzz.mineralType);
            } else {
                //                creep.withdraw(zzz,RESOURCE_ENERGY);
            }
        } else {
            creep.moveTo(zzz);
        }
    }
}

function powerAction(creep) {
    var constr = require('commands.toStructure');
    if (creep.carryTotal === 0) {
        if (Game.flags[creep.memory.party] !== undefined && creep.pos.inRangeTo(Game.flags[creep.memory.party], 4)) {

            let resource = creep.room.find(FIND_DROPPED_RESOURCES);
            resource = _.filter(resource, function(o) {
                return o.resourceType === RESOURCE_POWER;
            });
            creep.say('here' + resource.length);
            if (resource.length > 0) {
                if (creep.pos.isNearTo(resource[0])) {
                    creep.pickup(resource[0]);
                } else {
                    creep.moveTo(resource[0]);
                }
            }
        } else {
            if (Game.flags[creep.memory.party] !== undefined) {
                creep.moveMe(Game.flags[creep.memory.party], {ignoreCreeps:true, reusePath: 100 });
            } else {
                creep.memory.death = true;
            }
        }
        if (Game.flags[creep.memory.party] === undefined && creep.room.name == creep.memory.home && creep.pos.isNearTo(creep.room.terminal)) {
            creep.memory.death = true;
        }
    } else {
        creep.say('h');
        //if (creep.room.terminal !== undefined && creep.room.controller !== undefined && creep.room.controller.owner !== undefined) {
        let target;
        target = Game.getObjectById(creep.memory.parent).room.terminal;
        if (target === undefined) {
            target = Game.getObjectById(creep.memory.parent).room.storage;
        }

        if (creep.room.name === creep.memory.home) {
            if (creep.pos.isNearTo(target)) {
                for (var e in creep.carry) {
                    creep.transfer(target, e);
                }
            } else {
                creep.moveMe(target, { reusePath: 50 });
            }
        } else {
            creep.moveMe(Game.getObjectById(creep.memory.parent).room.terminal, {ignoreCreeps:true, reusePath: 100 });
        }
    }
    return true;
}


function banditAction(creep) {
    var constr = require('commands.toStructure');

    if (creep.memory.goHome === undefined)
        creep.memory.goHome = false;
    if (Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
    creep.memory.reportDeath = true;

    if (creep.carryTotal == creep.carryCapacity) {
        creep.memory.goHome = true;
    }
    if (creep.carryTotal === 0) {
        creep.memory.goHome = false;
    }
    if (creep.memory.goHome) {
        var stor = Game.rooms[creep.memory.home].terminal;
        if (stor.total === 300000) {
            stor = Game.rooms[creep.memory.home].storage;
        }

        if(creep.moveToTransfer(stor,creep.carrying,{reusePath:50})){
            creep.countDistance();
        }
        return;
    }
    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            if (!roleParent.constr.withdrawFromTombstone(creep)) {

                if (!creep.moveToPickUp(FIND_DROPPED_RESOURCES)) {


                    bads = creep.room.find(FIND_STRUCTURES);
                    var cont = _.filter(bads, function(structure) {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.total > 0);
                    });

                    if (cont.length > 0) {
                        var cunt = _.min(cont, o=>o.pos.getRangeTo(creep));

                        if (creep.pos.isNearTo(cunt)) {
                            for (var e in cunt.store) {
                                if(cunt.store[e] > 0){
                                creep.withdraw(cunt, e);
                                break;
                            }
                            }
                        } else {
                            creep.moveTo(cunt);
                        }
                        return true;
                    }
                    if (cont.length === 0) {
                        creep.memory.goHome = true;
                        if (bads.length > 0) {
                            //                Game.flags[creep.memory.party].remove();
                        }
                    }
                } else {
                    return;
                }
            } else {
                return;
            }
        }
        movement.flagMovement(creep);
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

    static run(creep) {
        if (this.doTask(creep)) return true;
//        if (this.sayWhat(creep)) return true;
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        //  super.rebirth(creep);
        if (creep.memory.party == 'bandit') {
            creep.say('bandit');
            banditAction(creep);
            return;
        }
        if (super.isPowerParty(creep)) {
            if (powerAction(creep)) return;
        }
        let creepCarry = creep.carryTotal;
        /*
                if (creep.memory.party == 'Flag1' && creep.isHome && creep.carryTotal === 0) {
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                    return;
                }
                if (creep.memory.party == 'Flag1' && creep.room.name === creep.partyFlag.pos.roomName && creep.carryTotal !== 0 && creep.carryTotal === creep.carry[RESOURCE_ENERGY]) {

                    if (creep.pos.isNearTo(creep.room.storage)) {
                        creep.transfer(creep.room.storage,creep.carrying);
                    } else {
                        creep.moveTo(creep.room.storage);
                    }
                    return;
                } */

        if (creep.memory.home == creep.room.name && creep.carryTotal > 0 && creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
            // Find Minearls.
let parent = Game.getObjectById(creep.memory.parent);            
            if(!creep.pos.isNearTo(parent.room.terminal)){

            creep.tuskenTo(parent.room.terminal, creep.partyFlag.pos.roomName,{segment:true,reusePath:50});
            } else {
                creep.transfer(creep.room.terminal,creep.carrying);
            }

/*            if (creep.room.storage !== undefined && creep.room.name !== 'W53S35') {
                contain.moveToStorage(creep);
                if (creep.pos.isNearTo(creep.room.storage)) {
                    if (creep.ticksToLive < creep.memory.distance) creep.suicide();
                    creep.countReset();

                } else {
                    creep.countDistance();
                }
            } else if (creep.room.terminal !== undefined) {
                contain.moveToTerminal(creep);
                if (creep.pos.isNearTo(creep.room.storage)) {
                    if (creep.ticksToLive < creep.memory.distance) creep.suicide();
                    creep.countReset();

                } else {
                    creep.countDistance();
                }
            } else {
                let par = Game.getObjectById(creep.memory.parent);
                if (creep.pos.isNearTo(par)) {
                    creep.drop(RESOURCE_ENERGY);
                } else {
                    creep.moveTo(par, { reusePath: 75 });
                }

            }*/
            creep.say('h');
            return;
        }

        let isThere = false;
        if (Game.flags[creep.memory.party] !== undefined &&
            creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            isThere = true;
        }
        if (creepCarry == creep.carryCapacity && creep.carryCapacity !== creep.carry[RESOURCE_ENERGY]) isThere = false;

        if (!isThere) {
            if (creepCarry == creep.carryCapacity && creep.memory.home != creep.room.name && creep.carryCapacity !== creep.carry[RESOURCE_ENERGY]) {
               let parent = Game.getObjectById(creep.memory.parent);
                //            if (!super.avoidArea(creep)) {
                //                    creep.moveTo(parent, { reusePath: 75 });
                creep.tuskenTo(parent.room.terminal, creep.partyFlag.pos.roomName,{segment:true,reusePath:50});
                //                creep.moveTo(parent, { reusePath: 75 });
                //              }
                creep.countDistance();
            } else {

                //        if (!super.avoidArea(creep)) {
                //              movement.flagMovement(creep);
                //            }
                let zz = creep.tuskenTo(creep.partyFlag, creep.memory.home,{segment:true,reusePath:50});
                //                let zz = creep.moveTo(creep.partyFlag, { reusePath: 75 });
                //                creep.say('thief'+zz);

            }

            return;
        }

        creep.memory.waypoint = true;
        if (creepCarry < creep.carryCapacity) {
            let target;
            let getting;
            if (creep.room.name == 'E3xx5S83') {
                creep.say('E38');
                var bads = creep.room.find(FIND_HOSTILE_CREEPS);
                if (bads.length > 0) {
                    creep.moveTo(Game.flags[creep.memory.party]);
                } else {}
                return;
            } else {
                target = creep.room.storage;
                if (target !== undefined) {
                    for (let e in target.store) {
                        if (target.store[e] > 0 && e !== RESOURCE_ENERGY && e !== 'H' && e !== 'X') {
                            getting = e;
                            break;
                        }
                    }
                    if (getting === undefined) {
                        for (let e in target.store) {
                            if (target.store[e] > 0 && e !== RESOURCE_ENERGY) {
                                getting = e;
                                break;
                            }
                        }
                    }
                }
                if (getting === undefined) {
                    target = creep.room.terminal;
                    if (target !== undefined) {
                        for (var o in target.store) {
                            if (target.store[o] > 0 && o !== RESOURCE_ENERGY) {
                                getting = o;
                                break;
                            }
                        }
                    }
                }
                if (getting === undefined) {
                    creep.partyFlag.remove();
                    if (creep.partyFlag === undefined) {
                        creep.memory.death = true;
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
                creep.moveTo(target);
            }
        }
    }
}

module.exports = thiefClass;