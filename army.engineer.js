// Mining and Contstruction.

var classLevels = [
    // Level 0
    [MOVE, WORK, MOVE, CARRY],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 4
    [WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, HEAL,
    ],
    // Level 5
    {

        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: ['LH'],
    },
    // Level 7
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        boost: ['LH', 'KH'],
    },
    // Level 8
    {
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XLH2O'],
    },
    // Level 9

    {
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
        boost: ['XLH2O', 'KO'],
    },
    // Level 10
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XLH2O', 'XKH2O'],
    },
    // Level 11
    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XGH2O', 'XKH2O'],
    },
    // Level 12
    {
        body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['GH', 'KH'],
    },
    // Level 13
    {
        body: [],
        boost: [],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var spawn = require('commands.toSpawn');
var contain = require('commands.toContainer');

function killWalls(creep) {
    creep.say('kill Wall');
    //    if (creep.memory.targetID === undefined) {
    var struc = creep.room.find(FIND_STRUCTURES);
    var test2 = _.filter(struc, function(o) {
        return o.structureType === STRUCTURE_WALL;
    }); // This is something is not on a rampart
    creep.say(test2.length);
    if (test2.length > 0) {
        let vv = test2[0];
        if (creep.pos.isNearTo(vv)) {
            creep.dismantle(vv);
        } else {
            creep.moveTo(vv);
        }
        //              creep.memory.targetID = test2[0];
    }
    //        }
}

function repairWalls(creep) {
    creep.say('R Wall');
    //    if (creep.memory.targetID === undefined) {
    var struc = creep.room.find(FIND_STRUCTURES);
    var test2 = _.filter(struc, function(o) {
        return o.structureType === STRUCTURE_WALL;
    }); // This is something is not on a rampart
    if (test2.length > 0) {

        var tar = _.min(test2, o => o.hits);
        creep.say(tar);
        if (creep.pos.inRangeTo(tar, 3)) {
            creep.repair(tar);
        } else {
            creep.moveTo(tar);
        }
        //              creep.memory.targetID = test2[0];
    }
    //        }
}
//STRUCTURE_POWER_BANK:
class engineerClass extends roleParent {
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
        if (super.spawnRecycle(creep)) {
            return;
        }

        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if ((creep.memory.level === 7 || creep.memory.level >= 10) && creep.carry[RESOURCE_ENERGY] === 0 && creep.room.name === creep.memory.home) {
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
            return;
        }

        if (super.goToPortal(creep)) return;
        if (super.rallyFirst(creep)) return;
        if (super.doTask(creep)) {
            return;
        }
        if (creep.memory.isBoosted !== undefined && creep.memory.isBoosted.length > 0) {
            if (creep.memory.boostType === undefined) {
                if (_.contains(creep.memory.isBoosted, ['XGH2O','GH2O','GH'])) {
                    creep.memory.boostType = 'upgrader';
                } else if (_.contains(creep.memory.isBoosted, 'XLH2O')) {
                    creep.memory.boostType = 'builder';
                } else {
                    creep.memory.boostType = 'normal';
                }
            }
        }
        //        creep.say(isThere);
        if (!creep.atFlagRoom) {
            creep.tuskenTo(creep.partyFlag, creep.home, { reusePath: 50, useSKPathing: true });
        } else {

            if (creep.memory.renewSpawnID === undefined && creep.room.alphaSpawn !== undefined && creep.memory.isBoosted !== undefined && creep.memory.isBoosted.length === 0) {
                creep.memory.renewSpawnID = creep.room.alphaSpawn.id;
                require('commands.toSpawn').newWantRenew(creep);
            }

            var tw = creep.pos.isNearAny(creep.room.towers);
            if (tw !== undefined) {
                creep.transfer(tw, RESOURCE_ENERGY);
            }

            if (creep.carry[RESOURCE_ENERGY] === 0) {
                creep.memory.building = false;
                creep.say('harvesting');
            } else if (creep.carry[RESOURCE_ENERGY] > creep.carryCapacity - 50) {
                creep.memory.building = true;
            }
            creep.say('eng!' + creep.memory.building);

            if (creep.memory.building) {
                if (creep.room.controller !== undefined) {

                    switch (creep.memory.boostType) {
                        case 'upgrader':
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller, { reusePath: 20, maxRooms: 1 });
                            }
                            if (creep.carry[RESOURCE_ENERGY] < 100) creep.pickUpEnergy();
                            break;
                        case 'builder':
                            creep.pickUpEnergy();
                            if (!super.constr.moveToBuild(creep)) {
                                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.controller,{maxRooms:1});
                                } else {
                                    if (creep.pos.isEqualTo(Game.flags.there)) {
                                        creep.moveTo(creep.room.conttroller,{maxRooms:1});
                                    }
                                }
                            }
                            break;
                        default:
                            creep.pickUpEnergy();
                            if (!spawn.moveToTransfer(creep, 300)) {
                                if (!super.constr.moveToBuild(creep)) {
                                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(creep.room.controller,{maxRooms:1});
                                    } else {
                                        if (creep.pos.isEqualTo(Game.flags.there)) {
                                            creep.moveTo(creep.room.conttroller,{maxRooms:1});
                                        }
                                    }
                                }
                            }
                            break;
                    }
                    /*
                                        if (!spawn.moveToTransfer(creep, 300)) {
                                            if (!super.constr.moveToBuild(creep)) {
                                                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                                    creep.moveTo(creep.room.controller);
                                                } else {
                                                    if (creep.pos.isEqualTo(Game.flags.there)) {
                                                        creep.moveTo(creep.room.conttroller);
                                                    }
                                                }
                                            }
                                        } */


                    creep.say('!' + creep.memory.boostType);
                } else {
                    if (!super.constr.moveToBuild(creep)) {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                    creep.say('!@');
                }
            } else {
                creep.pickUpEnergy();
                if (creep.room.storage === undefined || creep.room.storage.store[RESOURCE_ENERGY] <= 10000 || !super.containers.withdrawFromStorage(creep)) {
                    if (!roleParent.constr.withdrawFromTombstone(creep)) {
                        if (!super.containers.withdrawFromStorage(creep)) {
                            if (!super.containers.withdrawFromTerminal(creep)) {
                                if (!super.containers.moveToWithdraw(creep)) {
                                    if (!creep.moveToWithdrawSource()) {
                                        if (!creep.pos.isNearTo(Game.flags[creep.memory.party])) {
                                            movement.flagMovement(creep);
                                        }
                                    }
                                }
                            }
                        }
                    }

                }
            }

        }



    }
}

module.exports = engineerClass;