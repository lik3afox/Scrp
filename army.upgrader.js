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

        if (super.returnEnergy(creep)) return;

        if (creep.memory.renewSpawnID !== undefined) {
            if (creep.ticksToLive < 10) {
                spawn.wantRenew(creep);
            }
            if (creep.ticksToLive >= 1495) {
                creep.memory.boostNeeded = undefined;
                creep.memory.home = creep.room.name;
                spawn.removeRenew(creep);
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

                spawn.wantRenew(creep);

            }

            if (creep.carry.energy < creep.stats('building')) {
                constr.pickUpEnergy(creep);

                if (creep.pos.isNearTo(creep.room.storage)) {
                    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                } 
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                }

            }
            if (!constr.moveToBuild(creep)) {
                if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {}
            } else {
                creep.withdraw(creep.room.storage,RESOURCE_ENERGY);
            }
            if (creep.room.name == 'E14S38') {
                let zz;
                switch (creep.memory.roleID) {
                    case 0:
                        zz = new RoomPosition(32, 9, creep.room.name);
                        break;
                    case 1:
                        zz = new RoomPosition(34, 10, creep.room.name);
                        break;
                    case 2:
                        zz = new RoomPosition(34, 9, creep.room.name);
                        break;
                    case 3:
                        zz = new RoomPosition(34, 8, creep.room.name);
                        break;
                    case 4:
                        zz = new RoomPosition(32, 11, creep.room.name);
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