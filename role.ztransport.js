// This one is a transport that is maxed out and can go offroads.

// Also designed to go to Cyan flag and do stuff at the cyan flag room.


var roleParent = require('role.parent');
// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.
var rePath = 100;
var pathVis = {
    fill: 'transparent',
    stroke: '#ff0',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};

var classLevels = [
    // MAX level 6 
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]

];
var _ignoreRoad = true;

function shouldDie(creep) {
    if (creep.hits === creep.hitsMax) return;

    let death = true;
    var e = creep.body.length;
    while (e--) {
        if (creep.body[e].type === 'move' && creep.body[e].hits > 0) {
            death = false;
        }
    }
    // Looking for any move parts
    // if there sin't any
    if (death) {
        console.log(creep, 'wants to die');
        creep.suicide();
    }

}

class transportz extends roleParent {
    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }
    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        var start;
        //    super._movement.checkForBadsPlaceFlag(creep);
        shouldDie(creep);
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
            //            console.log('heya, here we set up a different parent so it goes back there');
        }

        var link = require('build.link');
        if (link.stayDeposit(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;

        // First it needs to go to the room
        // if not in the room that it needs to be
        //      console.log();
        //        creep.say('tn'+creep.memory.roleID);

        let _goal = Game.getObjectById(creep.memory.goal);

        super.rebirth(creep);
        super.deathWatch(creep);

        if (super.returnEnergy(creep)) {
            return;
        }
        if (super._movement.runAway(creep)) {
            return;
        }
        if (creep.memory.gohome === undefined) {
            creep.memory.gohome = false;
        }


        if (!creep.memory.gohome && _.sum(creep.carry) > creep.carryCapacity - 45) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        }


        if (_.sum(creep.carry) < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }

        if (creep.memory.gohome) {
            if (creep.room.name === creep.memory.home) {
                if (!super._containers.moveToStorage(creep))
                    var zz = super._containers.moveToTerminal(creep);
            } else {

                let task = {};
                task.options = {
                    ignoreRoads: creep.room.name == 'E35S85' ? false : _ignoreRoad,
                    reusePath: rePath,
                    visualizePathStyle: pathVis
                };
                task.pos = Game.getObjectById(creep.memory.parent).pos;
                task.order = "moveTo";
                task.enemyWatch = true;
                task.room = true;
                creep.memory.task.push(task);

            }

        } else { // IF not going home. 

            if (creep.memory.gotoID === undefined || (creep.carryTotal === 0 && creep.memory.home == creep.room.name)) {
                var goingTo;
                if (_goal === null) {
                    goingTo = super._movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                } else {
                    goingTo = _goal.pos;
                }

                let task = {};
                task.options = {
                    ignoreRoads: _ignoreRoad,
                    reusePath: rePath,
                    visualizePathStyle: pathVis
                };
                task.pos = goingTo;
                task.order = "keeperMoveTo";
                
                task.happyRange = 0;
                creep.memory.task.push(task);
            }

            // If in the same room and with in a square of 5 away from goal. 
            if (_goal !== null && _goal.room.name === creep.room.name) {
                // First look for containers and picking up stuff.
                // Then assigns it to memory.
                if (creep.memory.gotoID === undefined) {


                    let target; // This is where you want to go. 
                    let targetAmount = 0;
                    let isDropped = true;
                    var tmp = creep.room.find(FIND_DROPPED_RESOURCES);

                    if (tmp.length === 0) {
                        isDropped = false;
                    } else {
                        for (var e in tmp) {
                            if (tmp[e].amount > targetAmount && tmp[e].amount >= 100) {
                                targetAmount = tmp[e].amount;
                                target = tmp[e].id;
                            }
                        }
                    }

                    if (targetAmount < 200) { // If the energy on the gound is now. then
                        //var min = Game.getObjectById(creep.room.memory.mineralID);

                        var containerz = creep.room.find(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType === STRUCTURE_CONTAINER);
                            }
                        });

                        if (containerz.length > 0) {
                            for (let a in containerz) {

                                if ((containerz[a].store[RESOURCE_ENERGY] * 0.75) > targetAmount) {
                                    target = containerz[a].id;
                                    targetAmount = containerz[a].store[RESOURCE_ENERGY];
                                    //            isDropped = true;
                                }
                                if (containerz[a].total !== 0 && containerz[a].store[RESOURCE_ENERGY] === 0) {
                                    target = containerz[a].id;
                                    break;
                                }

                            }
                        }

                    }

                    creep.memory.gotoID = target;

                }


//                if (!super._constr.moveToPickUpEnergyIn(creep, 4)) {
                    let target = Game.getObjectById(creep.memory.gotoID);
                    if (target !== null) {

                        // Then it goes to it.

                        // Once picked up, clears memory so it can pick up something new.
                        if (creep.pos.isNearTo(target)) {

                            if (target.structureType === STRUCTURE_CONTAINER) {
                                for (var b in target.store) {
                                    creep.withdraw(target, b);
                                }
                                creep.memory.gotoID = undefined;

                            } else {
                                creep.pickup(target);
                                creep.memory.gotoID = undefined;
                            }
                        } else {
                            var bads = creep.pos.findInRange(creep.room.hostilesHere(), 4);
                            if (bads.length === 0) {
                                //if(!super.avoidArea(creep)) { 

                                creep.moveTo(target, {
                                    ignoreRoads: _ignoreRoad,
                                    maxRooms: 1,
                                    reusePath: rePath,
                                    visualizePathStyle: {
                                        fill: 'transparent',
                                        stroke: '#ff0',
                                        lineStyle: 'dashed',
                                        strokeWidth: 0.15,
                                        opacity: 0.5
                                    }
                                });
                                //                  }
                            }
                        }
                        if (target.structureType === STRUCTURE_CONTAINER && _.sum(target.store) === 0) {
                            creep.memory.gotoID = undefined;
                        }

                    } else {
                        creep.memory.gotoID = undefined;
                    }
//                }

            }

        }

        creep.say('z');

    }

}
module.exports = transportz;
