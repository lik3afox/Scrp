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
        CARRY, CARRY
    ],
    //6
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY],
    //7
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

        if (super.returnEnergy(creep)) return;

        if (creep.memory.renewSpawnID !== undefined) {
            if (creep.room.name != 'W4S93' && creep.ticksToLive < 10) {
                spawn.wantRenew(creep);
            }
            if (creep.ticksToLive >= 1495) {
                creep.memory.boostNeeded = undefined;
                creep.memory.home = creep.room.name;
                spawn.removeRenew(creep);
            }
        }

        //if(creep.memory.roleID == 0) creep.moveTo(9,32)
        if (creep.room.name == 'E23S75') {
            let zz = super.boosted(creep, ['XGH2O']);
            if (zz) {
                return;
            }
        } else {
            if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && creep.room.controller.level >= 6 && creep.room.controller.level != 8) {
                let zz = super.boosted(creep, boost);
                creep.say('DRUGS');
                if (zz) {
                    return;
                }
            }
        }

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
                //                var ccSpawn = require('commands.toSpawn');
                if (creep.room.name != 'E23S75')
                    spawn.wantRenew(creep);

            }

            if (creep.carry.energy < 100) {
                if (creep.room.name == 'E27S75') {
                    let spawn = Game.getObjectById(creep.memory.renewSpawnID);
                    //                    if(creep.pos.isNearTo(creep.room.storage)) {
                    //                      creep.withdraw(creep.room.storage,RESOURCE_ENERGY);
                    //                } else {
                    if (spawn !== null) {
                        if (creep.pos.isNearTo(spawn)) {
                            if (spawn.energy > 0) {
                                creep.say('MINE!');
                                creep.withdraw(spawn, RESOURCE_ENERGY);
                            }

                        } else {
                            creep.moveTo(spawn);
                        }
                    }
                    //              }

                } else if (creep.room.name == 'E37S75') {
                    if (creep.memory.roleID == 1) {
                        if (!contain.withdrawFromTerminal(creep)) {
                            contain.withdrawFromStorage(creep);
                        }
                    } else {
                        if (!contain.withdrawFromStorage(creep)) {
                            contain.withdrawFromTerminal(creep);
                        }
                    }

                } else if (creep.room.name == 'E26S77' && creep.memory.roleID == 1) {
                    let poz = new RoomPosition(16, 29, 'E26S77');
                    if (creep.pos.isEqualTo(poz)) {
                        contain.withdrawFromTerminal(creep);
                    } else {
                        creep.moveTo(poz);
                    }

                } else {
                    if (creep.pos.isNearTo(creep.room.storage)) {
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else if (contain.withdrawFromStorage(creep)) {
                        //  constr.pickUpEnergy(creep);

                    } else if (creep.pos.isNearTo(creep.room.terminal)) {
                        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                    }




                }

            }

            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                if (creep.room.name != 'W4S93') {
                    creep.moveTo(creep.room.controller);
                }
            }
            if (creep.room.name == 'E23S75') {
                let zz;
                switch (creep.memory.roleID) {
                    case 0:
                        zz = new RoomPosition(28, 34, creep.room.name);
                        break;
                    case 1:
                        zz = new RoomPosition(28, 33, creep.room.name);
                        break;
                    case 2:
                        zz = new RoomPosition(29, 33, creep.room.name);
                        break;
                    case 3:
                        zz = new RoomPosition(30, 33, creep.room.name);
                        break;
                    case 4:
                        zz = new RoomPosition(30, 34, creep.room.name);
                        break;
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
