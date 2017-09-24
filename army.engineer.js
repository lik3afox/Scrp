// Mining and Contstruction.

var classLevels = [
    [WORK, WORK, CARRY, MOVE],
    [MOVE, MOVE, MOVE, WORK, MOVE, MOVE, WORK, WORK, WORK, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY], // 850
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY],
    [MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK
    ]

];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var sources = require('commands.toSource');
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
//STRUCTURE_POWER_BANK:
class engineerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        //     super.renew(creep);
        if (creep.saying == 'zZzZ') {
            creep.say('zZz');
            return;
        }
        if (creep.saying == 'zZz') {
            return;
        }

        if (super.doTask(creep)) {
            return;
        }

        if (creep.room.name == 'E25xxS43') {
            killWalls(creep);
            return;
        }

        if (creep.room.name == 'E25Sxx37')
            if (super.boosted(creep, ['LH'])) { return; }

        if (super.goToPortal(creep)) return;

        let isThere = false;
        if (creep.memory.renewSpawnID === undefined) {
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].pos.roomName == creep.room.name)
                isThere = true;
        } else {
            isThere = true;
        }

        if (!isThere) {
            if (!super.avoidArea(creep)) {
                movement.flagMovement(creep);
            }
        } else {

            creep.say('eng!');
            if (creep.memory.renewSpawnID === undefined) {
                let finded = creep.room.find(FIND_STRUCTURES);
                finded = _.filter(finded, function(structure) {
                    return (structure.structureType == STRUCTURE_SPAWN);
                });
                if (finded.length > 0) {
                    creep.memory.renewSpawnID = finded[0].id;
                }
            }


            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }
                

            if (creep.carry.energy < (creep.stats('mining') + 1)) {
                creep.memory.building = false;
                creep.say('harvesting');
                /*
                                               if (!super._constr.pickUpEnergy(creep)) {
                                //                if (!super._containers.withdrawFromStorage(creep)) {
                                                      if (!super._containers.moveToWithdraw(creep)) {
                                //      if (!super._containers.moveToWithdraw(creep))
                                //                    super._sources.moveToWithdraw(creep);
                                                  }
                                //                        creep.say('zZzZ')
                                //                  }
                                            }
                                            return; */
            }


            if (creep.memory.building) {
                //         if (!spawn.moveToTransfer(creep)) {


                if (creep.room.name == 'E14S38') {
                    if (creep.room.controller.level < 4) {
                        if (creep.pos.isEqualTo(Game.flags[creep.memory.party])) {
                            creep.drop(RESOURCE_ENERGY);
                        } else {
                            creep.moveTo(Game.flags[creep.memory.party]);
                        }
                    } else {
                        if (!super._containers.moveToStorage(creep)) {}
                    }
                    return;
                }


                if (creep.room.controller !== undefined && creep.room.controller.level !== 1) {
                    //    if(creep.room.controller.level < 4)
                    if (!super._containers.moveToStorage(creep)) {
                        if (!super._constr.moveToBuild(creep)) {
                            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(creep.room.controller);
                            }
                        }
                    }
                    //  }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                //                }

            } else {
                //                super._constr.moveToBuild(creep);
                /*                  let zz = Game.getObjectById('59a706eff5b4d253ca80424a');
                                  if(zz !== null) {
                                    creep.moveTo(zz);
                                    creep.pickup(zz);
                                    return;
                                  }*/
                //                               if (!super._constr.moveToPickUpEnergy(creep)) { 
                //                                if (!super._containers.moveToWithdraw(creep)) {
                //                            if (!super._containers.withdrawFromStorage(creep)) {
                //           if (!super._containers.moveToWithdraw(creep))
                //                if(creep.carry[RESOURCE_ENERGY] < creep.carryCapacity - creep.stats('mining') )
if(!super._constr.moveToPickUpEnergy(creep))
                super._sources.moveToWithdraw(creep);
                //                          }
                //                        creep.say('zZzZ')
                //                                }
                //                                  }


            }

        }
    }
}

module.exports = engineerClass;