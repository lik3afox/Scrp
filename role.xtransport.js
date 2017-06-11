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

var classLevels =
    // MAX level 6 
    [
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,

        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,

        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY,
        MOVE, WORK
    ]

;
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

var link = require('build.link');

function buildConstructionRoad(creep) {
    // First make sure there are no roads or constructionsites in 4 spaces
    let radius = 4;
    let strcts = creep.pos.findInRange(FIND_STRUCTURES, radius, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD);
        }
    });
    let sites = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, radius, {
        filter: (structure) => {
            return (structure.structureType === STRUCTURE_ROAD);
        }
    });
    console.log(strcts.length, sites.length, creep.name, creep.pos);
    if (strcts.length === 0 && sites.length === 0) {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
    }
}


class transport extends roleParent {
    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }

    static levels(level) {
            //            if (level > classLevels.length) level = classLevels.length;
            if (level === 3) {
                return [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, WORK, CARRY, CARRY, MOVE];
            } else {
                return classLevels;

            }
        }
        // FIND_DROPPED_ENERGY
    static run(creep) {
        if (creep.saying === 'zZzZ') {
            creep.say('zZz');
            return;
        }
        if (creep.saying === 'zZz') {
            return;
        }

        var start;
        shouldDie(creep);
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
        }
        if (super.returnEnergy(creep)) {
            return;
        }
        if (creep.memory.roadConstruct === undefined) {
            creep.memory.roadConstruct = 10;
        }

        if (super.depositNonEnergy(creep)) return;

        if (link.stayDeposit(creep)) {
            //            constr.pickUpEnergy(creep);
            return;
        }

        let _goal = Game.getObjectById(creep.memory.goal);

        super.rebirth(creep);

        if (super.returnEnergy(creep)) {
            return;
        }
        if (super._movement.runAway(creep)) {
            return;
        }
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        if (super.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }
        if (creep.memory.gohome === undefined) {
            creep.memory.gohome = false;
        }

        let carry = _.sum(creep.carry);

        if (!creep.memory.gohome && carry > creep.carryCapacity - 45) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        }

        if (carry < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }

        //        if (creep.room.name != 'E28S77' && creep.room.storage == undefined && creep.room.name != 'E27S75' )
        if (!creep.pos.isNearTo(Game.flags[creep.memory.focusFlagName]))
            super._constr.pickUpEnergy(creep); // This is to pick up after other transport deaths.


        if (creep.memory.gohome) {

            /*super.goToFocusFlag(creep, Game.flags[creep.memory.focusFlagName]);
            if (!super._constr.doCloseRoadRepair(creep))
                super._constr.doCloseRoadBuild(creep);
*/
            let task = {};
            task.options = {
                reusePath: 49,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ff0',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            };
            task.pos = _goal.pos;
            task.order = "focusMoveTo";
            creep.memory.task.push(task);


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
                //          if(creep.room.name == 'E26S77'||creep.room.name == 'E35S74' ) {
                /*                _ignoreRoad = false;
                                //            } else {
                                //                  _ignoreRoad = true;
                                //                }
                                if (!super.guardRoom(creep)) {
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
                                } */

                let task = {};
                task.options = {
                    ignoreRoads: _ignoreRoad,
                    reusePath: 49,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                };
                task.pos = _goal.pos;
                task.order = "keeperMoveTo";
                task.happyRange = 5;
                creep.memory.task.push(task);

            } else {

                let foxy = require('foxMethods');
                // If in the same room and with in a square of 5 away from goal. 
                if (!super._constr.moveToPickUpEnergyIn(creep, 5))
                    if (_goal.room.name === creep.room.name && foxy.isInRange(creep, _goal.pos.x, _goal.pos.y, 5)) {
                        //                    if (!constr.pickUpEnergy(creep)) {
                        if (creep.memory.workContain === undefined) {
                            let contain = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                filter: {
                                    structureType: STRUCTURE_CONTAINER
                                }
                            });
                            if (contain !== null) {
                                creep.memory.workContain = contain.id;
                            }

                        }



                        let contain = Game.getObjectById(creep.memory.workContain);
                        if (contain !== null) {
                            if (creep.pos.isNearTo(contain)) {
                                if (_.sum(contain.store) > 0) {
                                    for (var e in contain.store) {
                                        if (creep.withdraw(contain, e) === OK) {
                                            super.keeperFind(creep);
                                        }
                                    }

                                } else {
                                    creep.say('zZzZ');
                                }
                            } else {
                                creep.moveTo(contain);
                            }

                        } else {
                            creep.say('zZzZ');
                        }

                        //                  }
                    } else {

                        // This here is to prevent moving back and forth.
                        if (creep.memory.keeperLairID !== undefined) {
                            let sKep = Game.getObjectById(creep.memory.keeperLairID);
                            if (sKep.ticksToSpawn === null || sKep.ticksToSpawn < 25 || sKep.ticksToSpawn > 295) {
                                return;
                            }
                        }

                        if (!super.guardRoom(creep)) {
                            creep.moveTo(_goal, {
                                ignoreRoads: _ignoreRoad,
                                reusePath: 49,
                                visualizePathStyle: {
                                    fill: 'transparent',
                                    stroke: '#fff',
                                    lineStyle: 'dashed',
                                    strokeWidth: 0.15,
                                    opacity: 0.5
                                }
                            });
                        }
                    }
            }
        }
    }
}
module.exports = transport;
