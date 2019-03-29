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
            CARRY, CARRY, CARRY, CARRY, CARRY,
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
        body: [WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['XGH2O'],
    },
    // Level 14 - designed to kill and build at the same time.
    {
        body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, HEAL, ATTACK, HEAL, ATTACK, HEAL, HEAL, ATTACK, ATTACK, ATTACK, ATTACK],
        boost: [],
    }

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

function otherSKRoom(creep) {
    if (creep.partyFlag === undefined) {
        creep.suicide();
        return;
    }
    if (creep.room.name !== creep.partyFlag.pos.roomName) {
        creep.tuskenTo(creep.partyFlag, { reusePath: 50 });
        return;
    }
    /*
    if (creep.room.controller.reservation) {
        creep.moveToPickEnergy(100,{maxRooms:1});
        return;
    } */
    if (creep.room.name === creep.partyFlag.pos.roomName && creep.partyFlag.memory.spots === undefined) {
        var sources = creep.room.find(FIND_SOURCES);
        var crps = creep.room.find(FIND_DROPPED_RESOURCES);
        var ded = creep.room.find(FIND_HOSTILE_CREEPS);
        let spots = _.filter(crps, function(o) {
            for (let i in sources) {
                for (let e in ded) {
                    if (sources[i].pos.isNearTo(o) && ded[e].pos.isNearTo(o)) {
                        return true;
                    }
                }
            }
        });
        if (spots.length > 0) {
            creep.partyFlag.memory.spots = [];
            for (let i in spots) {
                creep.partyFlag.memory.spots.push(spots[i].pos);
            }
        }
    }
    if (!creep.memory.full) {
        if (creep.carryTotal < creep.carryCapacity) {
            creep.memory.full = false;
        } else {
            creep.memory.full = true;
        }
    }
    if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.full = true;
    } else if (creep.carryTotal === 0) {
        creep.memory.full = false;
    }
    if (creep.memory.targetSpot === undefined) {
        creep.memory.targetSpot = creep.partyFlag.memory.spots.shift();
    }
    var tmpSpot = new RoomPosition(creep.memory.targetSpot.x, creep.memory.targetSpot.y, creep.memory.targetSpot.roomName);
    //  console.log('dfh',creep.pos.inRangeTo(tmpSpot, 3),tmpSpot);
    creep.room.createConstructionSite(tmpSpot.x, tmpSpot.y, STRUCTURE_CONTAINER);

                        let otherContain = _.filter(creep.room.find(FIND_STRUCTURES), function(o) {
                            return o.pos.inRangeTo(tmpSpot, 3) && o.structureType == STRUCTURE_CONTAINER;
                        });    
                        if(otherContain.length > 0){
                            creep.memory.targetSpot = creep.partyFlag.memory.spots.shift();
                        }
    if (creep.pos.inRangeTo(tmpSpot, 10)) {
        let SK = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function(o) {
            return o.owner.username === 'Source Keeper' && creep.pos.inRangeTo(o, 7);
        });
        if (SK.length > 0) {
            if (SK[0].pos.getRangeTo(creep) >= 6) {

            } else {
                creep.moveMe(creep.partyFlag);
            }
            return;
        }

        let miner = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function(o) {
            return o.hitsMax === 1600 && tmpSpot.inRangeTo(o, 1);
        });
        //    console.log('SKIssacar Engineer Doing work!', tmpSpot, creep.pos,miner.length);
        if (miner.length > 0) {
            miner = creep.pos.findClosestByRange(miner);
            if (!creep.pos.isNearTo(miner))
                creep.moveTo(miner, { maxRooms: 1 });

            creep.attack(miner);
            return;
        } else {
            if (creep.hits < creep.hitsMax) creep.selfHeal();
            if(creep.carryTotal < 50 ){
                creep.pickUpEnergy();
            }
            if (creep.memory.full) {
                if (creep.memory.targetCon === undefined) {
                    let conSite = _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), function(o) {
                        return o.pos.inRangeTo(creep, 10);
                    });
                    //  console.log('looking for cons', conSite.length);

                    if (conSite.length > 0) {
                        let otherContain = _.filter(creep.room.find(FIND_STRUCTURES), function(o) {
                            return o.pos.inRangeTo(conSite[0], 3) && o.structureType == STRUCTURE_CONTAINER;
                        });
                        console.log('FOUND OTHERS?!',otherContain.length);
                        if (otherContain.length > 0) {
                            if (creep.partyFlag.memory.spots.length > 0) {
                                creep.memory.targetSpot = creep.partyFlag.memory.spots.shift();
                                creep.memory.sourceID = undefined;
                                creep.memory.targetCon = undefined;
                                creep.memory.full = false;
                            }
                        }

                        creep.memory.targetCon = conSite[0].id;
                    }
                }


                let zed = Game.getObjectById(creep.memory.targetCon);
                if (zed) {
                    creep.moveTo(zed, { maxRooms: 1 });
                    creep.build(zed);
                } else {
                    if (creep.partyFlag.memory.spots.length > 0) {
                        creep.memory.targetSpot = creep.partyFlag.memory.spots.shift();
                        creep.memory.sourceID = undefined;
                        creep.memory.targetCon = undefined;
                        creep.memory.full = false;
                    } // else {
                    //    creep.partyFlag.memory.remove = true;
                    //}
                }
            } else {
                
                var total = creep.room.find(FIND_SOURCES);
                creep.memory.sourceID = creep.pos.findClosestByRange(total).id;

                if (!creep.moveToWithdrawSource()) {}
            }


        }
    } else {
        creep.moveTo(tmpSpot, {
            visualizePathStyle: {
                stroke: '#fa0',
                lineStyle: 'dotted',
                strokeWidth: 0.1,
                opacity: 0.5
            }
        });
    }

    var test2 = _.filter(creep.room.find(FIND_STRUCTURES), function(o) {
        return o.structureType === STRUCTURE_CONTAINER;
    }); // This is something is not on a rampart
    if(creep.partyFlag.memory.spots){
    console.log(roomLink(creep.room.name), 'looking for containers:', test2.length, "spots left:", creep.partyFlag.memory.spots.length);
    }
    if (test2.length === 3) {
        creep.partyFlag.memory.remove = true;
    } else if (test2.length < 3 && creep.partyFlag.memory.spots.length === 0) {
        creep.partyFlag.memory.spots = undefined;
    }

    /*    if (creep.memory.full) {
            constr.moveToBuild(creep, { maxRooms: 1 });
            let zed = Game.getObjectById(creep.memory.constructionID);
            if (zed) creep.moveTo(zed, { maxRooms: 1 });
        } else {
            if (!creep.moveToPickEnergy(100, { maxRooms: 1 })) {
                if (!roleParent.constr.withdrawFromTS(creep)) {
                    if (!creep.moveToWithdrawSource()) {

                    } else {

                    }
                }
            }
        }
    */
    return;
}

function otherRoom(creep) {
    if (creep.partyFlag === undefined) {
        creep.suicide();
        return;
    }
    if (creep.room.name !== creep.partyFlag.pos.roomName) {
        creep.tuskenTo(creep.partyFlag, { reusePath: 50 });
        return;
    }
    if (creep.room.controller.reservation) {
        creep.moveToPickEnergy(100, { maxRooms: 1 });
        return;
    }
    if (!creep.memory.full) {
        if (creep.carryTotal < creep.carryCapacity) {
            creep.memory.full = false;
        } else {
            creep.memory.full = true;
        }
    }
    if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.full = true;
    } else if (creep.carryTotal === 0) {
        creep.memory.full = false;
    }

    if (creep.memory.full) {
        constr.moveToBuild(creep, { maxRooms: 1 });
        let zed = Game.getObjectById(creep.memory.constructionID);
        if (zed) creep.moveTo(zed, { maxRooms: 1 });
    } else {
        if (!creep.moveToPickEnergy(100, { maxRooms: 1 })) {
            if (!roleParent.constr.withdrawFromTS(creep)) {
                if (!creep.moveToWithdrawSource()) {

                } else {

                }
            }
        }
    }

    return;
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

        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if ((creep.memory.level === 7 || creep.memory.level >= 10) && creep.carry[RESOURCE_ENERGY] === 0 && creep.room.name === creep.memory.home) {
            creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
            return;
        }

        if (super.goToPortal(creep)) return;
        if (super.rallyFirst(creep)) return;
        if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY] && creep.room.storage) {
            creep.moveToTransfer(creep.room.storage, creep.carrying);
            return;

        }
        if (creep.partyFlag && creep.partyFlag.memory.musterType === 'Issacar') {
            creep.memory.mustertype = creep.partyFlag.memory.musterType;
            otherRoom(creep);
            return;
        } else if (creep.partyFlag && creep.partyFlag.memory.musterType === 'SKIssacar') {
            creep.memory.mustertype = creep.partyFlag.memory.musterType;
            otherSKRoom(creep);
            return;
        } else if (creep.memory.mustertype === 'Issacar' && !creep.partyFlag) {
            creep.memory.death = true;
        }
        if (super.depositNonEnergy(creep)) return;

        if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] === 0 && creep.body[0].boost === undefined) {
            creep.memory.role = 'mule';
            creep.memory.level = 9;
            return;
        }
        if (!creep.memory.building && creep.saying === 'FINDING0' && creep.carryTotal > 0) {
            creep.memory.building = true;
        }
        if (!creep.room.storage && creep.saying === 'FINDING0' && creep.body[0].boost === undefined) {
            creep.memory.role = 'mule';
            creep.memory.level = 9;
            return;
        }
        if (!creep.memory.boostType && creep.body[0].boost === 'GH') {
            creep.memory.boostType = "upgrader";
        }
        if (creep.memory.isBoosted !== undefined && creep.memory.isBoosted.length > 0) {
            if (creep.memory.boostType === undefined) {
                if (creep.memory.isBoosted.length === 0) {
                    creep.memory.boostType = 'normal';
                } else if (_.contains(creep.memory.isBoosted, 'XLH2O')) {
                    creep.memory.boostType = 'builder';
                } else if (_.contains(creep.memory.isBoosted, 'LH')) {
                    creep.memory.boostType = 'builder';
                } else if (_.contains(creep.memory.isBoosted, 'LH2O')) {
                    creep.memory.boostType = 'builder';
                } else {
                    creep.memory.boostType = 'upgrader';
                }
            }
        }
        //        creep.say(isThere);
        if (creep.memory.level === undefined) {
            creep.memory.level = 5;
        }
        if (creep.room.controller && creep.room.controller.level === 6 && creep.room.controller.progress && creep.room.boostType === 'upgrader') {
            creep.memory.boostType = 'builder';
        }
        if (!creep.atFlagRoom || creep.room.name === 'E20S50') {
            creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50, useSKPathing: true });
        } else {

            //      if (creep.memory.renewSpawnID === undefined && creep.room.alphaSpawn !== undefined && creep.memory.isBoosted !== undefined && creep.memory.isBoosted.length === 0) {
            //            creep.memory.renewSpawnID = creep.room.alphaSpawn.id;
            ////                require('commands.toSpawn').newWantRenew(creep);
            //            }

            //            var tw = creep.pos.isNearAny(creep.room.towers);
            //          if (tw !== undefined) {
            //            creep.transfer(tw, RESOURCE_ENERGY);
            //      }

            if (creep.carry[RESOURCE_ENERGY] === 0) {
                creep.memory.building = false;
            } else if (creep.carry[RESOURCE_ENERGY] > creep.carryCapacity - 50 || creep.carryTotal === creep.carryCapacity) {
                creep.memory.building = true;
            }
            //            creep.say('eng!' + creep.memory.building);

            if (creep.memory.building) {
                if (creep.room.controller !== undefined) {

                    switch (creep.memory.boostType) {
                        case 'upgrader':
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller, { reusePath: 20, maxRooms: 1 });
                            }
                            if (creep.carry[RESOURCE_ENERGY] < 100) {
                                creep.pickUpEnergy();
                                if (creep.room.storage && creep.pos.isNearTo(creep.room.storage)) {
                                    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                                }
                            }
                            break;
                        case 'builder':
                            if (!super.constr.moveToBuild(creep)) {
                                let zz = creep.upgradeController(creep.room.controller);
                                creep.say(zz);
                                if (zz == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(creep.room.controller, { maxRooms: 1, reusePath: 30 });
                                } else {
                                    if (creep.pos.isEqualTo(Game.flags.there)) {
                                        creep.moveTo(creep.room.conttroller, { maxRooms: 1, reusePath: 30 });
                                    }
                                }
                            }
                            if (creep.room.storage && creep.pos.isNearTo(creep.room.storage)) {
                                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                            } else {
                                creep.pickUpEnergy();

                            }

                            break;
                        default:
                            creep.pickUpEnergy();
                            if (!spawn.moveToTransfer(creep, 300)) {
                                if (!super.constr.moveToBuild(creep)) {
                                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(creep.room.controller, { maxRooms: 1 });
                                    } else {
                                        if (creep.pos.isEqualTo(Game.flags.there)) {
                                            creep.moveTo(creep.room.conttroller, { maxRooms: 1, reusePath: 30 });
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


                    //                    creep.say('!' + creep.memory.boostType);
                } else {
                    if (!super.constr.moveToBuild(creep)) {}
                    creep.say('!@');
                }
            } else {
                creep.pickUpEnergy();
                //                if (creep.room.storage === undefined || creep.room.storage.store[RESOURCE_ENERGY] <= 10000 || !super.containers.withdrawFromStorage(creep)) {
                if (!creep.room.storage) {
                    if (!roleParent.constr.withdrawFromTS(creep)) {
                        if (!creep.moveToPickEnergy(100)) {
                            if (!creep.moveToWithdrawSource()) {

                            }
                        }
                    }
                } else {
                    //                     && ! ) {

                    if (!roleParent.constr.withdrawFromTS(creep)) {
                        if (!super.containers.withdrawFromStorage(creep)) {
                            if (!super.containers.withdrawFromTerminal(creep)) {
                                //                            if (!super.containers.moveToWithdraw(creep)) {
                                if (!creep.moveToWithdrawSource()) {
                                    if (!creep.pos.isNearTo(Game.flags[creep.memory.party])) {
                                        movement.flagMovement(creep);
                                    }
                                }
                                //                          }
                            }
                        }
                    }
                    //                  }

                    //              }
                }
            }
        }



    }
}

module.exports = engineerClass;