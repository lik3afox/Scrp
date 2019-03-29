var classLevels = [
    //0
    [WORK, WORK, CARRY, MOVE], // 300
    //1

    [MOVE, MOVE, CARRY, WORK, WORK, CARRY, MOVE, WORK], // 550
    //2

    [CARRY, CARRY, MOVE, WORK, WORK, MOVE, MOVE, CARRY, WORK, WORK, CARRY, MOVE], // 800
    //4

    [
        WORK, WORK, WORK,
        WORK, WORK, WORK,
        WORK, WORK,
        MOVE, MOVE,
        MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY,
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
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ],

    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY] // 800    
    // MOVE, MOVE, MOVE, MOVE, MOVE,
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
        //      case "E38S72":
        //            return new RoomPosition(36, 34, roomName);
        case "E18S36":
            return new RoomPosition(37, 25, roomName);
        case "E23S38":
            return new RoomPosition(35, 9, roomName);
        case "E19S49":
            return new RoomPosition(29, 33, roomName);
        case "E14S47":
            return new RoomPosition(30, 39, roomName);
        case "E38S72":
            return new RoomPosition(37, 37, roomName);
        case "E55S58":
            return new RoomPosition(15, 32, roomName);
        case "E18S46":
            return new RoomPosition(33, 10, roomName);
        case "W53S35":
            return new RoomPosition(26, 40, roomName);
        case "E33S54":
            return new RoomPosition(33, 41, roomName);

        default:
            return;
    }

}

//var boost =['XGH2O'];
var boost = [];
class roleUpbuilder extends roleParent {

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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;

        let boost = [];
        
        if (Game.shard.name == 'shard1') {
            if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.XGH2O > 350000) {
                boost.push('XGH2O');
            } else if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.GH2O > 173000) {
                boost.push('GH2O');
            }
            return _.uniq(boost);
        } 

        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    /** @param {Creep} creep **/
    static run(creep) {



        if (creep.saying == '⚡' && creep.carry.energy > 51) {
            if (creep.upgradeController(creep.room.controller) == OK)
                creep.say('⚡', true);
            return;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        //      if (Game.shard.name === 'shard1')
        //            super.rebirth(creep);

        if (creep.room.stats.storageEnergy < 850000) {
            creep.memory.reportDeath = true;
        }

        /*
                if (_.contains(justgh, creep.room.name) && creep.ticksToLive === 1499) {
                    if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.GH > 85000) {
                        boost.push('GH');
                    }
                    _.uniq(boost);
                }*/
        //     if (creep.room.name == 'E1S11' && super.boosted(creep, ['XLH2O'])) {
        //         return;
        //    }

        if (Game.shard.name === 'shard1' && super.boosted(creep, boost)) {
            return;
        }

        if (super.depositNonEnergy(creep)) return;


        // Logic here to determine action.
        if (creep.carry.energy <= creep.stats('upgrading')) {
//            creep.pickUpEnergy();
            //            super.constr.pickUpEnergy(creep);
            creep.memory.wallTargetID = undefined;
            if(creep.pos.isNearTo(creep.room.masterLink)&&creep.room.masterLink.energy > 0){
                creep.withdraw(creep.room.masterLink, RESOURCE_ENERGY);
            } else 
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            } else /* if (creep.carry.energy === 0) */ {
                if (creep.room.storage !== undefined && creep.room.storage[RESOURCE_ENERGY] === 0) {
                    if (super.containers.withdrawFromTerminal(creep))
                        if (!super.containers.moveToWithdraw(creep)) {
                            //                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * (creep.memory.level * 15))) {

                            //           }

                        }
                } else {
                    if (!super.containers.withdrawFromLink(creep)) {
//                        if (!roleParent.constr.withdrawFromTombstone(creep)) {
                            if (!super.containers.withdrawFromStorage(creep))
                                if (!super.containers.moveToWithdraw(creep)) {
                                    if (!creep.moveToWithdrawSource()) {}
                                    //      if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * (creep.memory.level * 15))) {
                                    //                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {

                                    //    }
                                }
  //                      }
  
                    }
                }
            }

            if (creep.memory.constructionID === undefined) {
                let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (strucs !== null) {

                    creep.memory.constructionID = strucs.id;
                    //                    creep.memory.foundCon = true;
                }
            }
        }


        if (rampartDefense(creep)) {
            return;
        }

        //            var spawn = require('commands.toSpawn');
        var number = 0;
        var doNot = []; //'E14S43',&& !_.contains(doNot, creep.room.name)

        var strucs = Game.getObjectById(creep.memory.constructionID);

        if (strucs !== null && !creep.memory.isBoosted) {
            if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                creep.moveMe(strucs, { ignoreCreeps: true });
            }
        } else {
            creep.memory.constructionID = undefined;
            //      if (creep.memory.foundCon) {
            //            creep.memory.foundCon = false;
            //            }
            let spot = getSpot(creep.room.name);
            let zz = creep.upgradeController(creep.room.controller);
            if (spot !== undefined) {
                if (creep.pos.isEqualTo(spot)) {
                    if (zz == OK) {
                        creep.say('⚡');
                        creep.cleanMe();
                    }
                    creep.memory._move = undefined;
                } else {
                    if (creep.moveMe(spot, { ignoreCreeps: true }) == OK) {

                    }
                }
            } else {
                if (zz === ERR_NOT_IN_RANGE) {
                    creep.moveMe(creep.room.controller, { ignoreCreeps: true });
                } else if (zz === OK) {
                    creep.cleanMe();
                }
            }


        }


    }
}

module.exports = roleUpbuilder;