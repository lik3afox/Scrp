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
  //      case "E38S72":
//            return new RoomPosition(36, 34, roomName);
        case "E18S36":
            return new RoomPosition(37,25, roomName);
        case "E23S38":
            return new RoomPosition(35, 8, roomName);
        case "E13S34":
            return new RoomPosition(37, 18, roomName);
        case "E19S49":
            return new RoomPosition(29, 33, roomName);
        case "E14S47":
            return new RoomPosition(30, 39, roomName);
        case "E17S34":
            return new RoomPosition(17, 13, roomName);
        case "E38S72":
            return new RoomPosition(37, 37, roomName);
        case "E32S34":
            return new RoomPosition(40, 34, roomName);
        case "E18S46":
            return new RoomPosition(33, 10, roomName);
        case "W53S35":
            return new RoomPosition(26, 40, roomName);
            
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
        if (super.doTask(creep)) {
            return;
        }
  //      if (Game.shard.name === 'shard1')
//            super.rebirth(creep);

 if(creep.room.stats.storageEnergy < 850000){
    creep.memory.reportDeath = true;
 }        
        if (Memory.war && creep.ticksToLive < 1300 || creep.room.memory.alert) {
            require('role.wallworker').run(creep);
            return;
        }

        var doUpgrade = ['E29S48', 'E14S43']; //'E18S36','E23S42','E14S47','E14S37','E28S42',
        var justgh = []; // 'E27S34'
        // && _.contains(doUpgrade, creep.room.name)
        if (Game.shard.name == 'shard1' && creep.ticksToLive === 1499 && (creep.memory.level === 8 || creep.memory.level === 4)) {
            boost = [];
            if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.GH2O > 50000) {
                boost.push('GH2O');
            } 
            _.uniq(boost);
        }
        if (_.contains(justgh, creep.room.name) && creep.ticksToLive === 1499 && creep.memory.level === 8 || creep.memory.level === 4) {
            if (Memory.stats.totalMinerals !== undefined && Memory.stats.totalMinerals.GH > 85000) {
                boost.push('GH');
            }
            _.uniq(boost);
        }
   //     if (creep.room.name == 'E1S11' && super.boosted(creep, ['XLH2O'])) {
   //         return;
    //    }

        if (Game.shard.name === 'shard1' && super.boosted(creep,boost)) {
            return;
        }

        if (super.depositNonEnergy(creep)) return;


        // Logic here to determine action.
        if ( creep.carry.energy <= creep.stats('upgrading')) {
 creep.pickUpEnergy();
//            super.constr.pickUpEnergy(creep);
            creep.memory.wallTargetID = undefined;
            if (creep.room.name == 'E17S34' || creep.room.name == 'E28S73') {
                super.containers.withdrawFromTerminal(creep);
            } else if (creep.room.name == 'x') {

                if (creep.room.storage !== undefined && creep.room.storage[RESOURCE_ENERGY] === 0) {
                    //                    if (super._containers.withdrawFromTerminal(creep))
//                    if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 80)) {
                        if (!super.containers.moveToWithdraw(creep)) {

                        }

             //       }
                } else {
                  //  if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 80)) {
                        if (!super.containers.withdrawFromStorage(creep))
                            if (!super.containers.moveToWithdraw(creep)) {
                                //                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {
                            }
                //    }

                }
            } else if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                //                super._containers.withdrawFromStorage(creep);
            } else /* if (creep.carry.energy === 0) */ {
                if (creep.room.storage !== undefined && creep.room.storage[RESOURCE_ENERGY] === 0) {
                    if (super.containers.withdrawFromTerminal(creep))
                        if (!super.containers.moveToWithdraw(creep)) {
//                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * (creep.memory.level * 15))) {

                 //           }

                        }
                } else {
                	if (!roleParent.constr.withdrawFromTombstone(creep)) {
                    if (!super.containers.withdrawFromStorage(creep))
                        if (!super.containers.moveToWithdraw(creep)) {
if (!creep.moveToWithdrawSource()) {
}
                      //      if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * (creep.memory.level * 15))) {
                                //                            if (!constr.moveToPickUpEnergy(creep, creep.memory.roleID * 8)) {

                        //    }
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
        }


        if (rampartDefense(creep)) {
            return;
        }

            //            var spawn = require('commands.toSpawn');
            var number = 0;
            var doNot = []; //'E14S43',&& !_.contains(doNot, creep.room.name)

            var strucs = Game.getObjectById(creep.memory.constructionID);

            if (strucs !== null  ) {
                if (creep.build(strucs) == ERR_NOT_IN_RANGE) {


                    creep.moveMe(strucs,{ignoreCreeps:true});
                }
            } else {
                creep.memory.constructionID = undefined;
                if (creep.memory.foundCon) {
                    creep.memory.foundCon = false;
                    creep.room.memory.spawnTargets = undefined;
                }
                let spot = getSpot(creep.room.name);
                if (spot !== undefined) {
                    if (creep.pos.isEqualTo(spot)) {
                        let zz = creep.upgradeController(creep.room.controller);
                        if (zz == OK) {
                            creep.say('⚡');
                            creep.cleanMe();
                        }
                        creep.memory._move = undefined;
                    } else {
                        if (creep.moveMe(spot,{ignoreCreeps:true}) == OK) {

                        }
                    }
                } else {
                    let zz = creep.upgradeController(creep.room.controller);
                    if (zz === ERR_NOT_IN_RANGE) {
                        creep.moveMe(creep.room.controller,{ignoreCreeps:true});
                    }
                }


            }

        
    }
}

module.exports = roleUpbuilder;