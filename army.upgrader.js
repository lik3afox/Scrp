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
                    creep.memory.upgradeSpot = 0;
                }
                let zz;
                let renew;
                var atSpot;
                var ez;
                switch (creep.memory.upgradeSpot) {
                    case 1: // renew spot.
                        zz = new RoomPosition(32, 9, creep.room.name);
                        if (creep.room.controller.level > 5 && ((!creep.memory.boosted) || (creep.memory.boosted && creep.ticksToLive < 5))) {
                            creep.say('renew');
                            let spawn = Game.getObjectById('5a03400a3e83cd1e5374cf65');
                            if (spawn !== null && creep.ticksToLive < 1489) {
                                if (spawn.renewCreep(creep) == OK)
                                    creep.memory.boosted = false;
                            } else if (creep.ticksToLive > 1490) {
                                creep.memory.upgradeSpot = 2; // Moving to boost spot.
                            }
                        } else if (creep.room.storage.store[RESOURCE_ENERGY] === 0) {
                            var spawned = Game.getObjectById('5a03400a3e83cd1e5374cf65');
                            if (spawned !== null && creep.pos.isEqualTo(new RoomPosition(32, 9, creep.room.name))) {
                                spawned.recycleCreep(creep);
                            }
                        } else {
                            creep.say();
                        }

                        break;

                    case 2: // Boost Spot - highest life
                        zz = new RoomPosition(33, 10, creep.room.name);
                        creep.say('boost');
                        if (creep.room.controller.level > 5) {
                            if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
                                for (var aa in creep.carry)
                                    creep.transfer(creep.room.terminal, aa);
                            }
                            if (!creep.memory.boosted) {
                                let lab = Game.getObjectById(creep.room.memory.boostLabID);
                                if (lab !== null && creep.ticksToLive > 1480) {
                                    // Do boost here and 
                                    let zzz = lab.boostCreep(creep);
                                    //                                    creep.say(zzz);
                                    if (zzz == OK) {
                                        creep.memory.boosted = true;
                                        creep.memory.upgradeSpot = 0; // 0 is the wait spot that can take multiple creeps.
                                    }

                                } else if (creep.ticksToLive < 1480) {
                                    creep.memory.boosted = false;
                                    creep.memory.upgradeSpot = 0;
                                    // also moves to 2nd location.
                                }
                            }
                        } else {
                            if (creep.room.storage.store.RESOURCE_ENERGY === undefined) {
                                //                       creep.memory.upgradeSpot = 1;
                            }
                        }

                        break;

                    case 0:


                        if (creep.memory.waitTimer === undefined) {
                            creep.memory.waitTimer = 40;
                        }
                        creep.memory.waitTimer--;
                        switch (creep.memory.waitSpot) {
                            case 0:
                                zz = new RoomPosition(32, 8, creep.room.name);
                                if (creep.memory.waitTimer < 0 && creep.ticksToLive < 1400 && creep.pos.isEqualTo(zz)) {
                                    renew = creep.room.lookAt(32, 9); // renew spot
                                    atSpot = false;
                                    for (ez in renew) {
                                        if (renew[ez].type == 'creep') {
                                            atSpot = true;
                                        }
                                    }
                                    if (!atSpot) {
                                        creep.memory.waitSpot = undefined;
                                        creep.memory.waitTimer = undefined;

                                        creep.memory.upgradeSpot = 1;
                                    }

                                }
                                break;
                            case 1:
                                zz = new RoomPosition(33, 8, creep.room.name);
                                if (creep.memory.waitTimer < 0 && creep.pos.isEqualTo(zz)) {
                                    renew = creep.room.lookAt(32, 8); // renew spot
                                    atSpot = false;
                                    for (ez in renew) {
                                        if (renew[ez].type == 'creep') {
                                            atSpot = true;
                                        }
                                    }
                                    if (!atSpot) {
                                        creep.memory.waitSpot--;
                                        creep.memory.waitTimer = undefined;
                                    }
                                }
                                break;
                            case 2:
                                zz = new RoomPosition(34, 8, creep.room.name);
                                if (creep.memory.waitTimer < 0 && creep.pos.isEqualTo(zz)) {

                                    renew = creep.room.lookAt(33, 8); // renew spot
                                    atSpot = false;
                                    for (ez in renew) {
                                        if (renew[ez].type == 'creep') {
                                            atSpot = true;
                                        }
                                    }
                                    if (!atSpot) {
                                        creep.memory.waitSpot--;
                                        creep.memory.waitTimer = undefined;
                                    }
                                }
                                break;
                            case 3:
                                zz = new RoomPosition(34, 9, creep.room.name);
                                if (creep.memory.waitTimer < 0 && creep.pos.isEqualTo(zz)) {

                                    renew = creep.room.lookAt(34, 8); // renew spot
                                    atSpot = false;
                                    for (ez in renew) {
                                        if (renew[ez].type == 'creep') {
                                            atSpot = true;
                                        }
                                    }
                                    if (!atSpot) {
                                        creep.memory.waitSpot--;
                                        creep.memory.waitTimer = undefined;
                                    }
                                }
                                break;
                            case 4:
                                zz = new RoomPosition(34, 10, creep.room.name);
                                if (creep.memory.waitTimer < 0 && creep.pos.isEqualTo(zz)) {

                                    renew = creep.room.lookAt(34, 9); // renew spot
                                    atSpot = false;
                                    for (ez in renew) {
                                        if (renew[ez].type == 'creep') {
                                            atSpot = true;

                                        }
                                    }
                                    if (!atSpot) {
                                        creep.memory.waitSpot--;
                                        creep.memory.waitTimer = undefined;
                                    }
                                }
                                break;
                            case 5:
                                zz = new RoomPosition(33, 10, creep.room.name);
                                if (creep.memory.waitTimer < 0 && creep.pos.isEqualTo(zz)) {

                                    renew = creep.room.lookAt(34, 10); // renew spot
                                    atSpot = false;
                                    for (ez in renew) {
                                        if (renew[ez].type == 'creep') {
                                            atSpot = true;

                                        }
                                    }
                                    if (!atSpot) {
                                        creep.memory.waitSpot--;
                                        creep.memory.waitTimer = undefined;
                                    }
                                }
                                break;
                            default:
                                let eee = creep.room.find(FIND_CREEPS);
                                var ggg;
                                let count = 0;
                                let aaa = _.filter(eee, function(object) {
                                    return (object.memory.role === 'Aupgrader' && object.memory.upgradeSpot === 0 && ( object.memory.boosted === undefined || !object.memory.boosted)  );                                
                                }).sort((a, b) => a.ticksToLive - b.ticksToLive);

                                for (ggg in aaa) {
                                    aaa[ggg].memory.waitSpot = count;
  //                                  console.log('xxx',aaa[ggg].name,aaa[ggg].memory.waitSpot,aaa[ggg].ticksToLive, aaa[ggg].memory.boosted );
                                    count++;
                                }

                                let uuu = _.filter(eee, function(object) {
                                    return (object.memory.role === 'Aupgrader' && object.memory.upgradeSpot === 0 && object.memory.boosted !== undefined && object.memory.boosted);
                                }).sort((a, b) => a.ticksToLive - b.ticksToLive);

                                for(ggg in uuu){
                                    uuu[ggg].memory.waitSpot = count;
//                                    console.log('yyy',uuu[ggg].name,uuu[ggg].memory.waitSpot,uuu[ggg].ticksToLive, uuu[ggg].memory.boosted );
                                    count++;
                                }

                                break;
                        }
                        creep.say('wait' + creep.memory.waitSpot);
                        break;

                }
                if (zz !== undefined) {
                    if (!creep.pos.isEqualTo(zz)) {
                        creep.moveTo(zz, { ignoreCreep: true });
                        let isThere = creep.room.lookAt(zz);

                        for (var a in isThere) {
                            if (isThere[a].type == 'creep') {
                                creep.memory.waitSpot = undefined;
                            }
                        }

                    }
                }
            }
        }
    }
}
module.exports = upgraderzClass;