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


        if (super.doTask(creep)) {
            return;
        }
           if(super.boosted(creep,['LH'])) { return;}
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
                if (!constr.moveToBuild(creep)) {
                    if (!super._containers.moveToStorage(creep)) {
                        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(creep.room.controller);
                        }
                    }
                } else {
                    constr.doCloseRoadRepair(creep);
                }

            } else {
                if (creep.room.name == 'E37S83') {
                    if (!super._constr.moveToPickUpEnergy(creep, 300)) {
                        if (!super._containers.moveToWithdraw(creep)) {
                            let zz = Game.getObjectById('588371768b6b60986f18d1d8');
                            if (zz !== null)
                                if (creep.pos.isNearTo(zz)) {
                                    creep.dismantle(zz);
                                } else {
                                    creep.moveMe(zz);
                                }
                        }
                    }
                } else {
                    //if (!super._constr.moveToPickUpEnergy(creep, 300)) {
                    if (!super._containers.moveToWithdraw(creep)) {
                        if (!super._containers.withdrawFromTerminal(creep)) {
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
