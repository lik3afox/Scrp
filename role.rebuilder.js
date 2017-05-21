var containers = require('commands.toContainer');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var toSpawn = require('commands.toSpawn');
var movement = require('commands.toMove');
var source = require('commands.toSource');
/// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30


var classLevels = [
    [MOVE, WORK, WORK, CARRY], // 200/200
    [WORK, MOVE, CARRY,CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE,CARRY,MOVE,WORK, MOVE, CARRY,CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE,CARRY,MOVE,WORK, MOVE, CARRY,CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE,CARRY,MOVE,WORK, MOVE, CARRY,CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE,CARRY,MOVE,WORK, MOVE, CARRY,CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE,CARRY,MOVE,WORK, MOVE, CARRY,CARRY, MOVE, WORK, WORK, CARRY] // 300/300

];

class rebuilder extends roleParent {
    
    static levels(level) {
         if (level > classLevels.length-1 )       level = classLevels.length-1;
            return classLevels[level];
        }
        // FIND_DROPPED_ENERGY
    static run(creep) {
        if(    super.returnEnergy(creep) ) {
            return;
        }
            super.calcuateStats(creep);
        if(super.doTask(creep)) {return;}
    
        // First it needs to go to the room
        // if not in the room that it needs to be
        //      console.log(Game.getObjectById(creep.memory.goal).room.name,creep.room.name );
//        creep.say('rb');
        /*
                    let lastMovement = {x:creep.pos.x,y:creep.pos.y};
                    creep.memory.lastPos = lastMovement;
                    console.log('last',creep.memory.lastPos.x,creep.memory.lastPos.y);
                    console.log('current',creep.pos.x,creep.pos.y); */

        if (creep.memory.build === undefined) {
            creep.memory.build = false;
        }

        if (creep.memory.repair === undefined) {
            creep.memory.repair = false;
        }

        if (_.sum(creep.carry) == creep.carryCapacity) {
            if(creep.room.controller.level == 1) { // This code is so the builder helps the controller get started.
                var spawns = toSpawn.getSortByClose(creep);
                creep.say('not');
                creep.moveTo(spawns[0]);
                toSpawn.moveToTransfer(creep);
            } else {
            creep.memory.build = true;
            }
        }

        if (_.sum(creep.carry) === 0) {
            creep.memory.build = false;
        }


        // If not at home room. 
        if (creep.memory.home != creep.room.name) {
            if( movement.runAway(creep) ) {
                return;
            }

            var temz = creep.memory.roleID%2;

            if (creep.memory.build) {
                if(temz === 0) {
                    if(!constr.doBuild(creep)) {
                        if (!constr.moveToBuild(creep)) {
                            constr.moveToRepair(creep);
                        }
                        
                    }
                }   else {
                    if(!constr.doRepair(creep)) {
                        if (!constr.moveToRepair(creep)) {
                            constr.moveToBuild(creep);
                        }
                    }

            }


            } 


            else {

                if(Game.getObjectById(creep.memory.goal) === null) {
                    
                    var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                creep.moveTo(goingTo);
                } else if (Game.getObjectById(creep.memory.goal) !== null &&
                    (!creep.memory.build) &&
                    Game.getObjectById(creep.memory.goal).room.name != creep.room.name) {
                    creep.moveTo(Game.getObjectById(creep.memory.goal));

                } else {

                    if (!constr.moveToPickUpEnergy(creep)) {
                        if(!containers.moveToWithdraw(creep)) {
                            if(!source.moveToWithdraw(creep)) {
                                movement.moveToGoal(creep);
                            }
                            
                        }
                    } 
                }
            }
//        }

        } else {

            if ((Game.getObjectById(creep.memory.goal) !== null) && (!creep.memory.build)) {
                creep.moveTo(Game.getObjectById(creep.memory.goal));
            } else {
                    if(!constr.doBuild(creep)) {
                        if (!constr.moveToBuild(creep)) {
                            constr.moveToRepair(creep);
                        }
                    }
            }
        }

        if (creep.ticksToLive < 5) {
            var spawn = require('build.spawn');
            spawn.reportDeath(creep);
            creep.suicide();
        }
 
    }
}
module.exports = rebuilder;