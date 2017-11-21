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

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY] // 800    
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
        case "E23S38":
            return new RoomPosition(35, 8, roomName);
        case "E13S34":
            return new RoomPosition(37, 18, roomName);
        default:
            return;
    }

}

//var boost =['XGH2O'];
var boost = [];
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
            if (creep.upgradeController(creep.room.controller) == OK)
                creep.say('⚡', true);
            /*            let spot = getSpot(creep.room.name);
                        if (spot !== undefined && !creep.pos.isEqualTo(spot)) {
                            creep.moveTo(spot);
                        } */
            return;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }


        if (Memory.war && creep.ticksToLive < 1300 || creep.room.memory.alert) {
            require('role.wallworker').run(creep);
            return;
        }

        var doUpgrade = ['E29S48','E14S43']; //'E18S36','E23S42','E14S47','E14S37','E28S42',
        var justgh = []; // 'E27S34'
        if (Game.shard.name == 'shard1' && _.contains(doUpgrade, creep.room.name) && creep.ticksToLive === 1499 && (creep.memory.level === 8 || creep.memory.level === 4)) {
            if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.XGH2O > 85000) {
                boost.push('XGH2O');
            } else if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.GH > 85000) {
                boost.push('GH');
            }
            _.uniq(boost);
        }
        if (_.contains(justgh, creep.room.name) && creep.ticksToLive === 1499 && creep.memory.level === 8 || creep.memory.level === 4) {
            if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.GH > 85000) {
                boost.push('GH');
            }
            _.uniq(boost);
        }

        if (super.boosted(creep, boost)) {
            return;
        }

        if (super.depositNonEnergy(creep)) return;



        // Logic here to determine action.
        if (creep.memory.upgrading === undefined) {
            creep.memory.upgrading = true;
        }
        creep.memory.upgrading = true;
        if (creep.memory.upgrading && creep.carry.energy <= creep.stats('upgrading')) {
            //            creep.memory.upgrading = false;
            super.constr.pickUpEnergy(creep);
            creep.memory.wallTargetID = undefined;
            if (creep.room.name == 'E17S34' || creep.room.name == 'E28S73') {
                super.containers.withdrawFromTerminal(creep);
            } else if (creep.room.name == 'x') {

                if (creep.room.storage !== undefined && creep.room.storage[RESOURCE_ENERGY] === 0) {
                    //                    if (super._containers.withdrawFromTerminal(creep))
                    if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 80)) {
                        if (!super.containers.moveToWithdraw(creep)) {

                        }

                    }
                } else {
                    if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 80)) {
                        if (!super.containers.withdrawFromStorage(creep))
                            if (!super.containers.moveToWithdraw(creep)) {
                                //                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {

                            }
                    }

                }
            } else if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                //                super._containers.withdrawFromStorage(creep);
            } else /* if (creep.carry.energy === 0) */ {
                if (creep.room.storage !== undefined && creep.room.storage[RESOURCE_ENERGY] === 0) {
                    if (super.containers.withdrawFromTerminal(creep))
                        if (!super.containers.moveToWithdraw(creep)) {
                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * (creep.memory.level * 15))) {

                            }

                        }
                } else {
                    if (!super.containers.withdrawFromStorage(creep))
                        if (!super.containers.moveToWithdraw(creep)) {
                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * (creep.memory.level * 15))) {
                                //                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {

                            }
                        }

                }
            }

            if (creep.memory.constructionID === undefined) {
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null) {

                    creep.memory.constructionID = strucs.id;
                    creep.memory.foundCon = true;
                }
            }

            //    return;
        }


        if (creep.carry.energy > creep.stats('upgrading')) {
            creep.memory.upgrading = true;
            creep.say('upgrading');
        }
        if (rampartDefense(creep)) {
            return;
        }

        if (creep.memory.upgrading) {
            var spawn = require('commands.toSpawn');
            var number = 0;
            var doNot = []; //'E14S43',

            var strucs = Game.getObjectById(creep.memory.constructionID);

            if (strucs !== null && !_.contains(doNot, creep.room.name) && !creep.memory.isBoosted) {
                if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(strucs);
                }
            } else {
                creep.memory.constructionID = undefined;
                if (creep.memory.foundCon) {
                    creep.memory.foundCon = false;
                    creep.room.memory.spawnTargets = undefined;
                }
                let zz = creep.upgradeController(creep.room.controller);

                if (creep.room.name == 'E17S34') {
                    var nez = new RoomPosition(17, 13, 'E17S34');
                    creep.moveTo(nez);
                } else {
                    if (zz == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }

                if (zz == OK)
                    creep.say('⚡');
            }

        }

    }
}

module.exports = roleUpbuilder;