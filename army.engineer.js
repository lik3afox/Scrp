// Mining and Contstruction.

var classLevels = [
    [WORK, WORK, CARRY, MOVE],
    [MOVE, MOVE, MOVE, WORK, MOVE, MOVE, WORK, WORK, WORK, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY], // 850
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    [MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK,
        MOVE, WORK, CARRY, MOVE, WORK, MOVE, WORK, CARRY, MOVE, WORK
    ]

];



var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');
var sources = require('commands.toSource');
var constr = require('commands.toStructure');
var spawn = require('commands.toSpawn');
var contain = require('commands.toContainer');
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

        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        if (super.goToPortal(creep)) return;
        //        spawn.wantRenew(creep);
        if (super.depositNonEnergy(creep)) return;

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
                let finded = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_SPAWN);
                    }
                });
                if (finded.length > 0) {
                    creep.memory.renewSpawnID = finded[0].id;
                }
            }


            if (!creep.memory.building && creep.carry.energy == creep.carryCapacity) {
                creep.memory.building = true;
            }

            if (creep.carry.energy < (creep.memory.stats.mining + 1)) {
                creep.memory.building = false;
                creep.say('harvesting');

                //               if (!super._constr.moveToPickUpEnergy(creep)) {
                //                if (!super._containers.withdrawFromStorage(creep)) {
                //                      if (!super._containers.moveToWithdraw(creep)) {
                //      if (!super._containers.moveToWithdraw(creep))
                //                    super._sources.moveToWithdraw(creep);
                //                  }
                //                        creep.say('zZzZ')
                //                  }
                //            }
            }


            if (creep.memory.building) {
                /*let zz = Game.getObjectById(creep.memory.renewSpawnID)
                let tw = Game.getObjectById('58eb90f785d61a50d4919c1c')
                if(creep.pos.isNearTo(zz)&&zz.energy < 200 ) {
                    creep.transfer(zz,RESOURCE_ENERGY);
                } else if(creep.pos.isNearTo(tw)&&tw.energy < 500 ) {
                    creep.transfer(tw,RESOURCE_ENERGY);
                } */
                //                    if(creep.memory.roleID == 0) {
                /*                        let zz = Game.getObjectById(creep.memory.renewSpawnID);
                                        if(zz != undefined && creep.pos.isNearTo(zz) && zz.energy < 100 ) {
                                            creep.transfer(zz,RESOURCE_ENERGY)
                                        } else {*/
                //                            if(!spawn.moveToTransfer(creep)){

                //if (!spawn.moveToTransfer(creep)) {
                if (!constr.moveToBuild(creep)) {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
                // }
                //                      }
                /*              } else {
                    if (!constr.moveToBuild(creep)) {
                                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(creep.room.controller);
                                }
                        }
                }
*/

            } else {
                if (creep.room.name == 'E33S76') {
                /*    let yy = Game.getObjectById('59245d7c5feea00129f642e3');

                    if (yy !== null) {*/
                        let xx = creep.room.storage;
                        if (creep.pos.isNearTo(xx)) {
                            creep.withdraw(xx, RESOURCE_ENERGY);
                        } else {
                            creep.moveMe(xx);
                        }
                        return;
/*                    }

                    if (creep.memory.roleID == 1) {
                        let zz = Game.getObjectById('588371768b6b60986f18d1d8');
                        if (creep.pos.isNearTo(zz)) {
                            creep.dismantle(zz);
                        } else {
                            creep.moveMe(zz);
                        }
                    } else {
                        let zz = Game.getObjectById('5836b8248b8b9619519f1865');
                        if (creep.pos.isNearTo(zz)) {
                            creep.harvest(zz);
                        } else {
                            creep.moveMe(zz);
                        }
                    } */

                } else {
                    if (!super._constr.moveToPickUpEnergy(creep, 300)) {
                        if (!super._containers.withdrawFromStorage(creep)) {
                            //                      if (!super._containers.moveToWithdraw(creep)) {
                            //           if (!super._containers.moveToWithdraw(creep))
                            super._sources.moveToWithdraw(creep);
                            //                  }
                            //                        creep.say('zZzZ')
                        }
                    }

                }
            }

            /*else {

                          // Engineers should build the spawn
                          // then put energy in the spawn for the first first
                          // the upgrade
                          creep.say('yes');
                          if ((creep.memory.renewSpawnID != 'none' && creep.memory.renewSpawnID != undefined) && creep.ticksToLive < 0) {
                              //    creep.say(((creep.memory.renewSpawnID != 'none' ) && creep.ticksToLive < 300 )  );
                              creep.moveTo(Game.getObjectById(creep.memory.renewSpawnID));
                              creep.say('yesy');

                          } else {
                              creep.say('yesn');

                              let source;
                              //constr.pickUpEnergy(creep);
                              //contain.fromContainer(creep);
                              //creep.say(vv+'asdf');

                              if (creep.room.name == 'E35S73zz') {
                                  constr.pickUpEnergy(creep);

                                  let finded = creep.post.findClosestByRange(FIND_STRUCTURES, {
                                      filter: (structure) => {
                                          return (structure.energy > 0);
                                      }
                                  })

                                  if (creep.pos.isNearTo(finded)) {
                                      creep.withdraw(finded);
                                  } else {
                                      creep.moveTo(finded);
                                  }
                              }/* else if (creep.room.name == 'E35S73zz') {

                                  if (!super._constr.moveToPickUpEnergyIn(creep, 12)) {
                                      creep.say('E35')
                                      let storage = creep.room.storage;
                                      if (!super._constr.moveToDismantle(creep, STRUCTURE_RAMPART)) {
                                          if (storage.store[RESOURCE_ENERGY] != 0) {

                                              if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                                  creep.moveTo(storage);
                                              }
                                          } else if (creep.room.storage.store[RESOURCE_ENERGY] != 0) {
                                              storage = creep.room.terminal;
                                              if (creep.withdraw(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                                  creep.moveTo(storage);
                                              }

                                          } else {
                                              super._constr.moveToDismantle(creep, STRUCTURE_RAMPART);
                                          }
                                      }
                                  }
                                  // return;
                              }*/
            /* else {

            //                        if (!super._containers.withdrawFromStorage(creep)) {
                                        if (!super._constr.moveToPickUpEnergy(creep, 300)) {
            //                                if (!super._containers.moveToWithdraw(creep)) {
            //                                    super._sources.moveToWithdraw(creep);
            //                                }
                                        }
            //                        }

                                }
                                //
                            }

                            //            sources.moveToWithdraw(creep);
                        }*/


        }
    }
}

module.exports = engineerClass;
