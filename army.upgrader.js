// Mining and Contstruction.

var classLevels = [
    //0
    [WORK, WORK, CARRY, MOVE],
    //1
    [MOVE, MOVE, MOVE, WORK, MOVE, MOVE, WORK, WORK, WORK, CARRY],
    //2
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY], // 850
    //3
    [MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY],
    //4
    [MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY],
    //5
    [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, WORK,
        CARRY
    ],
    //6
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //7
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY],
    //8
    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]

];
var boost = ['XGH2O'];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var sources = require('commands.toSource');
var constr = require('commands.toStructure');
var spawn = require('commands.toSpawn');
var contain = require('commands.toContainer');
//STRUCTURE_POWER_BANK:
class upgraderzClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        creep.memory.waypoint = true;
        if (super.baseRun(creep)) return;

        let isThere = false;
        if (creep.memory.renewSpawnID === undefined) {
            for (var e in Game.flags) {
                if (Game.flags[e].name == creep.memory.party && Game.flags[e].color == COLOR_YELLOW && Game.flags[e].pos.roomName == creep.room.name) {
                    isThere = true;
                    break;
                }
            }
        } else {
            isThere = true;
        }

        if (!isThere) {
            movement.flagMovement(creep);
        } else {

            if (creep.memory.renewSpawnID === undefined) {
                let finded = creep.room.find(FIND_STRUCTURES);
                finded = _.filter(finded, function(structure) {
                    return (structure.structureType == STRUCTURE_SPAWN);
                });
                if (finded.length > 0) {
                    creep.memory.renewSpawnID = finded[0].id;
                }

                spawn.wantRenew(creep);

            }

            if (creep.carry.energy < creep.stats('upgrading')) {


                if (creep.pos.isNearTo(creep.room.storage)) {
                    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                } else if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                }

            }

            //            if (!constr.moveToBuild(creep)) {
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {}
            //          } else {
            //                creep.withdraw(creep.room.storage,RESOURCE_ENERGY);
            //        }
            constr.pickUpEnergy(creep);



            if (creep.room.name == 'E14S38') {
                if (creep.memory.upgradeSpot === undefined) {

                    let zz = creep.room.find(FIND_CREEPS);
                    let vv;
                    zz = _.filter(zz, function(object) {
                        return (object.memory.role == 'Aupgrader');
                    }).sort((a, b) => a.ticksToLive - b.ticksToLive);
                    var eee = 0;
                    for (var ae in zz) {
                        console.log(zz[ae].ticksToLive);
                        zz[ae].memory.upgradeSpot = eee;
                        eee++;
                    }


                }
                let zz;
                switch (creep.memory.upgradeSpot) {

                    case 0: // Watch spot - When it gets low do a shuffle. 
                        zz = new RoomPosition(33, 8, creep.room.name);
                        creep.say('watch');
                        if (creep.ticksToLive < 5) {
                            // DO shuffle here.
                            let zz = creep.room.find(FIND_CREEPS);

                            zz = _.filter(zz, function(object) {
                                return (object.memory.role === 'Aupgrader');
                            });
                            for (var ee in zz) {

                                zz[ee].memory.upgradeSpot++;
                                if (zz[ee].memory.upgradeSpot > 3) zz[ee].memory.upgradeSpot = 0;

                            }

                        }
                        break;
                    case 1: // renew spot.
                            zz = new RoomPosition(32, 9, creep.room.name);
                        if (creep.room.controller.level > 5) {
                            creep.say('renew');
                            let spawn = Game.getObjectById('5a03400a3e83cd1e5374cf65');
                            if (spawn !== null && creep.ticksToLive < 1489) {
                                spawn.renewCreep(creep);
                            } else if (creep.ticksToLive > 1490) {
                                // Here it moves to the boost spot. 
                            }
                            creep.memory.boosted = false;
                        } else if(creep.room.storage.store.RESOURCE_ENERGY === undefined ){
       //                     var spawned = Game.getObjectById('5a03400a3e83cd1e5374cf65');
     //                       if(spawned !== null && creep.pos.isEqualTo(new RoomPosition(32,9,creep.room.name))) {
  ///                              spawned.recycleCreep(creep);
//                            }   
                        }

                        break;

                    case 2: // Boost Spot - highest life
                        zz = new RoomPosition(33, 10, creep.room.name);
                        creep.say('boost');
                        if (creep.room.controller > 5) {
                            if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
                                for (var aa in creep.carry)
                                    creep.transfer(creep.room.terminal, aa);
                            }
                            if (!creep.memory.boosted) {
                                let lab = Game.getObjectById(creep.room.memory.boostLabID);
                                if (lab !== null && creep.ticksToLive > 1450) {
                                    // Do boost here and 
                                    let zzz = lab.boostCreep(creep);
                                    creep.say(zzz);
                                    if (zzz == OK) {
                                        creep.memory.boosted = true;
                                        // Once it's boosted, it can move to another posistion. 
                                    }
                                } else if (creep.ticksToLive < 1450) {
                                    creep.memory.boosted = true;
                                    // also moves to 2nd location.
                                }
                            }
                        } else {
                            if(creep.room.storage.RESOURCE_ENERGY === undefined){
         //                       creep.memory.upgradeSpot = 1;
                            }
                        }

                        break;


                    case 3: // Waiting
                        zz = new RoomPosition(34, 9, creep.room.name);
                        creep.say('wait');
                            if(creep.room.storage.RESOURCE_ENERGY === undefined){
           //                     creep.memory.upgradeSpot = 2;
                            }

                        break;
                        /*
                    case 2: // Waiting
                        zz = new RoomPosition(34, 8, creep.room.name);
                        creep.say('wait');
                        break;
                        */

                }
                if (zz !== undefined) {
                    if (!creep.pos.isEqualTo(zz))
                        creep.moveTo(zz, { ignoreCreep: true });
                }
            }
        }
    }
}
module.exports = upgraderzClass;