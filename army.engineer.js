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
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: ['XLH2O'],
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
        boost: [ 'XLH2O', 'KO'],
    },
    // Level 10
    {
        body: [CARRY, CARRY, CARRY, CARRY,CARRY , CARRY, CARRY, CARRY,CARRY , CARRY, CARRY, WORK, WORK, WORK, WORK,WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2','XLH2O','XKH2O'],
    },
    // Level 11
    {
        body: [CARRY, CARRY, CARRY, CARRY,CARRY , CARRY, CARRY, CARRY,CARRY , CARRY, CARRY, WORK, WORK, WORK, WORK,WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2','XGH2O','XKH2O'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XLH2O', 'XZHO2'],
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
    test2.sort((a, b) => a.hits - b.hits);
    creep.say(test2.length);
    if (test2.length > 0) {
        let vv = test2[0];
        if (creep.pos.inRangeTo(vv, 3)) {
            creep.repair(vv);
        } else {
            creep.moveTo(vv);
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
        //     super.renew(creep);
        if (super.goToPortal(creep)) return;
        if (creep.room.name == 'W53S35' && creep.memory.renewSpawnID !== undefined) {
            //    creep.memory.party = 'control';
        }
        if (creep.room.name == 'E38S81') {
            let zz = Game.getObjectById('59d35b4ec407c71ca99dcd6b');
            if (zz !== null) {
                if (creep.pos.isNearTo(zz)) {
                    creep.transfer(zz, RESOURCE_ENERGY);
                }
            }
        }

        if (super.doTask(creep)) {
            return;
        }

        if (creep.room.name == 'E25xxS43') {
            killWalls(creep);
            return;
        }
        if (creep.room.name == 'E32S34') {
            let xx = Game.getObjectById('5a6f7c6a0cd7db3ffbeb7ab7');
            if (xx !== null && xx.energy < 3000) {
                creep.transfer(xx, RESOURCE_ENERGY);
            }
        }
        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
//            creep.memory.boostNeeded = classLevels[creep.memory.level].boost;
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        if (super.goToPortal(creep)) return;

        let isThere = false;
        if (creep.memory.renewSpawnID === undefined) {
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].pos.roomName == creep.room.name) {
                isThere = true;
            }
        } else {
            isThere = true;
            let sp = Game.getObjectById(creep.memory.renewSpawnID);
            if (sp !== null) {
                if (creep.pos.isNearTo(sp)) {
                    sp.renewCreep(creep);
                }
            }
        }
        creep.say(isThere);
        if (!isThere) {

    //        if (!super.avoidArea(creep)) {
  //              movement.flagMovement(creep);
//            }
            creep.moveMe(creep.partyFlag,{reusePath:50,useSKPathing:true});
        } else {

            if (creep.memory.renewSpawnID === undefined) {
                let finded = creep.room.find(FIND_STRUCTURES);
                finded = _.filter(finded, function(structure) {
                    return (structure.structureType == STRUCTURE_SPAWN);
                });
                if (finded.length > 0) {
                    creep.memory.renewSpawnID = finded[0].id;
                    //                    finded[0].wantRenew.push(creep.id);
                } else {
                    creep.memory.renewSpawnID = 'none';
                }
            }


            if (creep.carry[RESOURCE_ENERGY] === 0) {
                creep.memory.building = false;
                creep.say('harvesting');
            } else if (creep.carry[RESOURCE_ENERGY] > creep.carryCapacity - 50) {
                creep.memory.building = true;
            }
            creep.say('eng!' + creep.memory.building);

            if (creep.memory.building) {
                //         if (!spawn.moveToTransfer(creep)) {


                if (creep.room.name == 'E14S38') {
                    if (!super.constr.moveToBuild(creep)) {
                        if (creep.room.controller.level !== 8) {
                            if (creep.pos.isEqualTo(Game.flags[creep.memory.party])) {
                                creep.drop(RESOURCE_ENERGY);
                            } else {
                                creep.moveTo(Game.flags[creep.memory.party]);
                            }
                        } else {
                            if (!super.containers.moveToStorage(creep)) {}
                        }
                    }
                    return;
                }
                if (creep.room.name == 'E25S49' && creep.room.controller.level > 1) {
                    repairWalls(creep);
                    return;
                }

                if (creep.room.controller !== undefined) {
                    //    if(creep.room.controller.level < 4)
                    //                    if (!super._containers.moveToStorage(creep)) {

                    if (!spawn.moveToTransfer(creep, 300)) {
                        if (!super.constr.moveToBuild(creep)) {
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                if (creep.room.name == 'E32S34' && creep.memory.sourceID === '5982ffd3b097071b4adc3402') {
                                    creep.moveTo(40, 33);
                                } else {
                                    creep.moveTo(creep.room.controller);
                                }

                            } else {
                                if (creep.pos.isEqualTo(Game.flags.there)) {
                                    creep.moveTo(creep.room.conttroller);
                                }
                            }
if(creep.room.name == 'E1S11'){
    creep.moveTo( 31,22);
}
                        }
                    }
                    //                  }
                    //  }
                    creep.say('!');
                } else {

                    if (!super.constr.moveToBuild(creep)) {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                    creep.say('!@');
                }
                //                }

            } else {
                if (creep.room.name == 'E25S49') {
                    var zz = Game.getObjectById('5982ff7ab097071b4adc2b87');
                    if (zz.energy !== 0) {
                        creep.memory.sourceID = '5982ff7ab097071b4adc2b87';
                    }

                }
                if(creep.room.name == 'E1S11'){
                    var zzzz = Game.getObjectById('5a81ec83dd808617c9f18493');
//                        if( super.constr.pickUpEnergy(creep,100) ) return;
                    if(zzzz !== null && zzzz.store[RESOURCE_ENERGY]> 400){

                    if(creep.pos.isNearTo(zzzz)){
                        creep.withdraw(zzzz,RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(zzzz);
                    }
                    return;
                    }
                }
                if (creep.room.name == 'E14Sxx38' || creep.room.name == 'E22xxS27') {
//                    if (!super.sources.moveToWithdraw(creep)) {
                                    if(!creep.moveToWithdrawSource()){
                    }
                } else {
                    if (creep.room.storage !== undefined) {
                            if (!super.containers.withdrawFromStorage(creep)) {
                            if(!creep.moveToPickUp(FIND_DROPPED_RESOURCES,(500 * creep.memory.roleID) + 100)) {
//                                if (!super.sources.moveToWithdraw(creep)) {
                                    if(!creep.moveToWithdrawSource()){
                                }
                            }
                        }

                    } else {
                        if(!creep.moveToPickUp(FIND_DROPPED_RESOURCES,(500 * creep.memory.roleID) + 100)) {

                            if (!super.containers.withdrawFromTerminal(creep))
                                if (!super.containers.withdrawFromStorage(creep)) {
                                    if (!super.containers.moveToWithdraw(creep)) {

//                                        if (!super.sources.moveToWithdraw(creep)) {
                                          if(!creep.moveToWithdrawSource()){

                                            if (!creep.pos.isNearTo(Game.flags[creep.memory.party])) {
                                                movement.flagMovement(creep);
                                            }
                                        } else {

                                            if (creep.room.name == 'E32S34') {
                                                let zz = Game.getObjectById('5a6f790501f51932d6f51369');
                                                let xx = Game.getObjectById('5a6f7c6a0cd7db3ffbeb7ab7');
                                                if (zz !== null && zz.energy < 3000) {
                                                    creep.transfer(zz, RESOURCE_ENERGY);
                                                } else if (xx !== null && xx.energy < 3000) {
                                                    creep.transfer(xx, RESOURCE_ENERGY);
                                                } else {
                                                    creep.upgradeController(creep.room.controller);
                                                }

                                            } else {
                                                var zzee = creep.room.find(FIND_CREEPS);

                                                zzee = _.filter(zzee, function(o) {
                                                    return o.memory !== undefined && o.memory.role === 'engineer' && o.ticksToLive < 1250;
                                                });
                                                if (zzee.length > 1) {
                                                    zzee.shift();
                                                    for (var e in zzee) {
                                                        zzee[e].memory.role = 'mule';
                                                        zzee[e].memory.level = 2;
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



    }
}

module.exports = engineerClass;