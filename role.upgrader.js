/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.
var classLevels = [
    //0
    [WORK, WORK, CARRY, MOVE], // 300
    //1
    [WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 550
    //2
    [CARRY, WORK, CARRY, MOVE, WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 800
    //3
    [WORK,WORK,WORK,WORK,WORK,CARRY, WORK, CARRY, MOVE, WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 1300
    
    //4  - Energy enough for 1800 @ lv 5 room.
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //5
    [MOVE, WORK, MOVE, WORK, WORK, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    //6
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
];

var containers = require('commands.toContainer');
var structures = require('commands.toStructure');
var roleParent = require('role.parent');

function doUpgradeIn(creep) {
    var pos;

    switch (creep.pos.roomName) {
        case "E27S55":
            pos = [
                new RoomPosition(27, 30, creep.room.name),
                new RoomPosition(29, 30, creep.room.name),
///                new RoomPosition(31, 22, creep.room.name),
//                new RoomPosition(31, 21, creep.room.name),
            ];
            break;
        case "E33S54":
            pos = [
//                new RoomPosition(31, 22, creep.room.name),
                new RoomPosition(36, 42, creep.room.name),
                new RoomPosition(36, 41, creep.room.name),
                new RoomPosition(35, 41, creep.room.name),
                new RoomPosition(34, 41, creep.room.name),
//                new RoomPosition(31, 22, creep.room.name),
                new RoomPosition(33, 41, creep.room.name),
//                new RoomPosition(31, 21, creep.room.name),
            ];
            break;
        case "E11S47":
            pos = [
//                new RoomPosition(13, 5, creep.room.name),
                new RoomPosition(13, 6, creep.room.name),
                new RoomPosition(13, 7, creep.room.name),
                new RoomPosition(12, 7, creep.room.name),
                new RoomPosition(11, 7, creep.room.name),
//                new RoomPosition(11, 6, creep.room.name),
                //                new RoomPosition(26, 40, creep.room.name),
                //              new RoomPosition(26, 41, creep.room.name),
            ];
                break        ;
        default:
            return false;

    }

for(let ee in pos){
    creep.room.visual.text(ee,pos[ee], {color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
}

    going = pos[creep.memory.roleID];
    if (going !== undefined) {
        if (!creep.pos.isEqualTo(going)) {
            creep.moveTo(going, {
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#bf0',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        }

    } else {

    }

    if (creep.pos.isNearTo(creep.room.terminal)) {
        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
    } else {
        if (creep.pos.isNearTo(creep.room.storage)) {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        }
    }

}
        var going;

class roleUpgrader extends roleParent {

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


    /** @param {Creep} creep **/
    static run(creep) {

        if (super.doTask(creep)) {
            return;
        }
        var boost = ['XGH2O'];
        //if(Game.shard.name == 'shard2')
        if (super.boosted(creep, boost)) {
            return;
        }

        /*        if (creep.room.controller.level != 8 && creep.room.controller.level > 5) {
                    if (creep.room.name === '') {
                        if (super.boosted(creep, ['XGH2O'])) {
                            return;
                        }
                    } else {
                    }
                }*/

        if (creep.room.controller.level == 8) {
            creep.memory.death = true;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;
        if (creep.memory.level > 5) super.renew(creep);
        going = undefined;

        if (!doUpgradeIn(creep)) {
            if (creep.carry.energy < creep.stats('upgrading') + 1) {

 if (going === undefined){
    if(creep.pos.isNearTo(creep.room.terminal) && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
        creep.withdraw(creep.room.terminal,RESOURCE_ENERGY);
    } else {
    creep.moveToWithdraw(creep.room.storage,RESOURCE_ENERGY);
    }
//                if (!structures.pickUpEnergy(creep)) {
      //              if (!containers.fromStorage(creep)) {
//                        if (!containers.fromTerminal(creep)) {
//                            if (!containers.withdrawFromStorage(creep)) {
  //                              if (!containers.moveToWithdraw(creep)) {
    //                            }
      //                      }
          //              }
          //          }
           //     }
} else {
    
}

            }

        }
        if (creep.room.name == 'E19S49') {
            let zz = Game.getObjectById('5a382d821d1eb30ea473ed75');
            if (zz !== null) {
                creep.build(zz);
                return;
            }
        }
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            if (going === undefined){
                creep.moveTo(creep.room.controller);
            }
            creep.say('hh');
        }
          //  if (going !== undefined)
             //   creep.moveTo(going);
    }
}

module.exports = roleUpgrader;