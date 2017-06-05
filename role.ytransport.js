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


var classLevels = [
    // MAX level 6 
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY]

];
var _ignoreRoad = true;

function shouldDie(creep) {
    if (creep.hits === creep.hitsMax) return;

    let death = true;

    for (var e in creep.body) {
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

class transport extends roleParent {
    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        creep.say('y');
        var start;
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        //   super._movement.checkForBadsPlaceFlag(creep);
        shouldDie(creep);
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
            //            console.log('heya, here we set up a different parent so it goes back there');
        }
        if (super.returnEnergy(creep)) {
            return;
        }

        // First it needs to go to the room
        // if not in the room that it needs to be
        //      console.log();
        //        creep.say('tn'+creep.memory.roleID);
        if (super.depositNonEnergy(creep)) return;

        let _goal = Game.getObjectById(creep.memory.goal);

        super.rebirth(creep);

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

        //let flagz = _.filter(Game.flags, function(f) {
        //           return f.color == COLOR_CYAN;
        //       });
        //        if (creep.room.name != 'E28S77' && creep.room.storage == undefined && creep.room.name != 'E27S75' )
        if (!creep.pos.isNearTo(Game.flags[creep.memory.focusFlagName]))
            super._constr.pickUpEnergy(creep); // This is to pick up after other transport deaths.

        if (creep.memory.gohome) {


            if (!super.goToFocusFlag(creep, Game.flags[creep.memory.focusFlagName])) {
                super._movement.moveHome(creep);
            }

        } else { // IF not going home. 


            if (_goal === null) {
                var goingTo = super._movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                creep.moveTo(goingTo, {
                    ignoreRoads: _ignoreRoad,
                    reusePath: 49,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });
            } else if (_goal !== null && _goal.room.name != creep.room.name) {
                if (!super.guardRoom(creep)) {
                    //                    if(!super.avoidArea(creep)) { 

                    creep.moveTo(_goal, {
                        ignoreRoads: _ignoreRoad,
                        reusePath: 49,
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#ff0',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    });
                    //        }
                }

            } else {

                let foxy = require('foxMethods');
                // If in the same room and with in a square of 5 away from goal. 
                if (_goal.room.name === creep.room.name) {
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
                            var containerz = creep.room.find(FIND_STRUCTURES, {
                                filter: (structure) => {
                                    return (structure.structureType === STRUCTURE_CONTAINER);
                                }
                            });

                            if (containerz.length > 0) {
                                for (var o in containerz) {
                                    if ((containerz[o].store[RESOURCE_ENERGY] * 0.75) > targetAmount) {
                                        target = containerz[o].id;
                                        targetAmount = containerz[o].store[RESOURCE_ENERGY];
                                        //            isDropped = true;
                                    }
                                }
                            }
                        }

                        creep.memory.gotoID = target;

                    }

                    var runbads = creep.pos.findInRange(creep.room.hostilesHere(), 3);
                    var staybads = creep.pos.findInRange(creep.room.hostilesHere(), 4);
                    if (staybads.length > 0) {
                        // Do nothing
                    } else if (runbads.length === 0) {

                        if (!super._constr.moveToPickUpEnergyIn(creep, 5)) {
                            let target = Game.getObjectById(creep.memory.gotoID);
                            if (target !== null) {

                                // Then it goes to it.

                                // Once picked up, clears memory so it can pick up something new.
                                if (creep.pos.isNearTo(target)) {

                                    if (target.structureType === STRUCTURE_CONTAINER) {
                                        creep.withdraw(target, RESOURCE_ENERGY);
                                        creep.memory.gotoID = undefined;
                                    } else {
                                        creep.pickup(target);
                                        creep.memory.gotoID = undefined;
                                    }
                                } else {
                                    //if(!super.avoidArea(creep)) { 

                                    creep.moveTo(target, {
                                        ignoreRoads: _ignoreRoad,
                                        maxRooms: 1,
                                        reusePath: 49,
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
                                if (target.structureType === STRUCTURE_CONTAINER && _.sum(target.store) === 0) {
                                    creep.memory.gotoID = undefined;
                                }

                            } else {
                                creep.memory.gotoID = undefined;
                            }
                        }
                    } else {
                        creep.runFrom(bads);
                    }

                }

            }


        }

    }
}
module.exports = transport;
