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
    [WORK, WORK, CARRY, MOVE], // 300

    [MOVE, MOVE, CARRY, WORK, WORK, CARRY, MOVE, WORK], // 550

    [CARRY, CARRY, MOVE, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, CARRY, MOVE], // 800

    [MOVE, MOVE, MOVE, WORK, WORK, CARRY, MOVE,
        WORK, WORK, MOVE, WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE
    ], // 800
    [
        WORK, WORK, WORK,
        WORK, WORK, WORK,
        WORK, MOVE,
        WORK, WORK, WORK,
        MOVE, MOVE, MOVE,
        CARRY, CARRY
    ],

    [
        CARRY, CARRY,
        WORK, MOVE, MOVE, WORK,
        WORK, WORK, WORK,
        WORK, WORK, WORK,
        WORK, MOVE,
        WORK, WORK, WORK,
        MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY
    ],

    //[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
    [WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ],

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY] // 800    
    // Last level is designed for after level 8 to update.
];


var containers = require('commands.toContainer');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');

function rampartDefense(creep) {
    // Flag triggers rampartDefense,
    if (!creep.memory.rampartDefense) return false;
    if (creep.carry.energy === 0) {
        if (!containers.withdrawFromStorage(creep)) {}
    } else {

        if (creep.memory.constructionID !== undefined) {
            var strucs = Game.getObjectById(creep.memory.constructionID);
            if (strucs !== null) {
                if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(strucs, { reusePath: 15 });
                }
            } else {
                creep.memory.constructionID = undefined;
            }
        } else {
            constr.moveToRepairWall(creep);
        }

        if (creep.carry.energy === 0) {
            creep.memory.repair = false;
        }


        constr.moveToRepairWall(creep);
    }
    creep.say('repair');
    var named = 'rampartD' + creep.room.name;
    if (Game.flags[named] === undefined || Game.flags[named] === null)
        creep.memory.rampartDefense = false;
    return true;
}

function getSpot(roomName) {
    switch (roomName) {
        case "E38S72":
            return new RoomPosition(36, 34, roomName);
        default:
            return;
    }

}

//var boost =['XGH2O'];
class roleUpbuilder extends roleParent {

    static levels(level) {
        if (Memory.war && level == 7) {
            return classLevels[6];
        }
        if (level > classLevels.length - 1)
            level = classLevels.length - 1;
        return classLevels[level];
    }

    /** @param {Creep} creep **/
    static run(creep) {
        if (creep.saying == '⚡' && creep.carry.energy > 51) {
            creep.upgradeController(creep.room.controller);
            creep.say('⚡', true);
            let spot = getSpot(creep.room.name);
            if (spot !== undefined && !creep.pos.isEqualTo(spot)) {
                creep.moveTo(spot);
            }
            return;
        }
        if (super.returnEnergy(creep)) {
            return;
        }
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }


        if (Memory.war && creep.ticksToLive < 1300 || creep.room.memory.alert) {
            require('role.wallworker').run(creep);
            return;
        }
        if (!Memory.war) {
            if (creep.ticksToLive > 1420 && creep.room.controller.level == 8) {
                let zz;
                switch (creep.room.name) {
                    case 'E38S72':
                    case 'E23S75':
                    case 'E28S73':
                    case 'E28S71':
                    case 'E26S73':
                    case 'E38S72':
                    case 'E35S83':
                    case 'E37S75':
                    case 'E35S73':
                    case 'W4S93':
                        zz = super.boosted(creep, ['XGH2O']);
                        break;
                }
                if (zz) {
                    return;
                }
            }
        }
        if (super.depositNonEnergy(creep)) return;



        // Logic here to determine action.
        if (creep.memory.upgrading === undefined) {
            creep.memory.upgrading = true;
        }
            creep.memory.upgrading = true;
        if (creep.memory.upgrading && creep.carry.energy <= creep.stats('upgrading') ) {
            //            creep.memory.upgrading = false;
            super._constr.pickUpEnergy(creep);
            creep.memory.wallTargetID = undefined;
            if (creep.room.name == 'E35S83' || creep.room.name == 'E28S73') {
                super._containers.withdrawFromTerminal(creep);
            } else if (creep.room.name == 'E33S76') {
                let link = Game.getObjectById('59243d3f403da5a97dea664a');
                if (creep.withdraw(link, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                    creep.moveTo(link);
            } else if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                //                super._containers.withdrawFromStorage(creep);
            } else /* if (creep.carry.energy === 0) */ {
                if (creep.room.storage !== undefined && creep.room.storage[RESOURCE_ENERGY] === 0) {
                    if (super._containers.withdrawFromTerminal(creep))
                        if (!containers.moveToWithdraw(creep)) {
                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {

                            }

                        }
                } else {
                    if (!super._containers.withdrawFromStorage(creep))
                        if (!containers.moveToWithdraw(creep)) {
                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {

                            }
                        }

                }
            }

            if (creep.memory.constructionID === undefined) {
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null)
                    creep.memory.constructionID = strucs.id;
            }

            //    return;
        }


        if (creep.carry.energy > creep.stats('upgrading') ) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }
        if (rampartDefense(creep)) {
            return;
        }

        if (creep.memory.upgrading) {
            var spawn = require('commands.toSpawn');
            var number = 0;

  //          var strucs = Game.getObjectById(creep.memory.constructionID);

//            if (strucs !== null) {
        //        if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
      //              creep.moveTo(strucs);
    //            }
  //          } else {
//                creep.memory.constructionID = undefined;
                switch (creep.upgradeController(creep.room.controller)) {
                    case ERR_NOT_IN_RANGE:
                        if (creep.room.name == 'E28S73') {
                            creep.moveTo(23, 42);
                        } else {
                            creep.moveTo(creep.room.controller, {
                                reusePath: 5
                            });
                        }
                        break;
                    case OK:
                        creep.say('⚡');
                        break;
                }
//            }

        }

    }
}

module.exports = roleUpbuilder;