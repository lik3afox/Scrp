var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var containers = require('commands.toContainer');
var spawns = require('commands.toSpawn');
var movement = require('commands.toMove');
//var ccSpawn = require('build.spawn');
var visPath = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};
// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.


var classLevels = [
    // Level 0
    [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], //  300
    // Level 1

    [CARRY, CARRY, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], //  550
    // Level 2

    [CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    // Level 3
    // 750
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, WORK, CARRY, CARRY, MOVE
    ],

    // Level 4
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ],

    // Level 5
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, WORK, CARRY
    ],
    // MAX level 6 
    // MAX level 6 
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        MOVE, WORK
    ]

];
var _ignoreRoad = true;
var constr = require('commands.toStructure');

function shouldDie(creep) {
    if (creep.hits == creep.hitsMax) return;

    let death = true;

    for (var e in creep.body) {
        if (creep.body[e].type == 'move' && creep.body[e].hits > 0) {
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

function getBads(creep) {
    var bads = creep.pos.findInRange(creep.room.hostilesHere, 3, {
        filter: object => (object.owner.username != 'zolox' && object.owner.username != 'admon')
    });
    return bads;
}

class transport extends roleParent {
    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }

    static levels(level) {
            if (level > classLevels.length - 1) level = classLevels.length - 1;
            return classLevels[level];
        }
        // FIND_DROPPED_ENERGY
    static run(creep) {
        if (creep.saying == 'zZzZ') {
            creep.say('zZz');
            return;
        }
        if (creep.saying == 'zZz') {
            return;
        }


        super.rebirth(creep);
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        var link = require('build.link');
        let total = _.sum(creep.carry);

        if (link.stayDeposit(creep)) {
            constr.pickUpEnergy(creep);
            let zparent = require('build.spawn');
            zparent.reportFrom(creep);
            creep.countReset();
            return;
        }




        if (super.depositNonEnergy(creep)) return;
        //        movement.checkForBadsPlaceFlag(creep);
        shouldDie(creep);

        if (super.returnEnergy(creep)) {
            return;
        }
        if (movement.runAway(creep)) {
            return;
        }
        if (super.keeperWatch(creep)) {
            return;
        }

        let _goal = Game.getObjectById(creep.memory.goal);
        super.deathWatch(creep);

        if (creep.memory.gohome === undefined) {
            creep.memory.gohome = false;
        }
        if (creep.memory.keeperLairID == 'none') {
            creep.memory.keeperLairID = undefined;
        }

        if (creep.room.name == 'E29S73' || creep.room.name == 'E25S76') {
            //            _ignoreRoad = false;
        }
        if ((!creep.memory.gohome && total > creep.carryCapacity - 45)) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        } else if (total < 20) {
            //            _ignoreRoad = true;
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }

        movement.checkForBadsPlaceFlag(creep);

        if (creep.room.name != 'E28S77' && creep.room.name != 'E27S74' && creep.room.storage === null)
            constr.pickUpEnergy(creep); // This is to pick up after other transport deaths.

        if (creep.memory.gohome) {
            creep.countDistance();

            if (creep.memory.home == creep.room.name) {
                if (!containers.moveToStorage(creep)) {
                    if (!containers.moveToTerminal(creep)) {
                        if (!spawns.moveToTransfer(creep)) {
                            if (!constr.doCloseBuild(creep)) {
                                if (!containers.moveToTransfer(creep)) {
                                    // if no containers then go to spawns
                                }
                            }
                        }
                    }
                }

            } else {

                if (!constr.doCloseRoadRepair(creep)) {
                    constr.doCloseRoadBuild(creep);
                }

                var bads = getBads(creep);
                if (bads.length === 0) {
                    creep.moveMe(Game.getObjectById(creep.memory.parent), {
                        reusePath: 49
                    });
                } else {
                    creep.runFrom(bads);
                }
            }



        } else { // IF not going home.  5873bd6d11e3e4361b4d92ef 37,34

            if (!super._constr.moveToPickUpEnergyIn(creep, 7))
                if (_goal === null) {
                    var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                    creep.moveMe(goingTo, {
                        ignoreRoads: _ignoreRoad,
                        reusePath: 49,
                        visualizePathStyle: visPath
                    });
                } else if (_goal.room !== null && creep.room.name == _goal.room.name) {
                let rng = 4;
                if (creep.room.name == 'E27S74') rng = 3;

                if (!super.guardRoom(creep))
                    if (creep.pos.inRangeTo(_goal, rng)) {
                        if (creep.memory.workContain === undefined) {

                            let contain = _goal.room.find(FIND_STRUCTURES, {
                                filter: {
                                    structureType: STRUCTURE_CONTAINER
                                }
                            });
                            contain = _goal.pos.findInRange(contain, 10);
                            contain = _goal.pos.findClosestByRange(contain);
                            if (contain !== null) {
                                creep.memory.workContain = contain.id;
                            }
                        }

                        let contain = Game.getObjectById(creep.memory.workContain);
                        if (contain !== null) {
                            if (_.sum(contain.store) > 100) {
                                if (creep.pos.isNearTo(contain)) {
                                    for (var e in contain.store) {
                                        if (creep.withdraw(contain, e) == OK) {
                                            super.keeperFind(creep);
                                        }
                                    }
                                } else {
                                    creep.moveMe(contain);
                                }
                            } else if (creep.pos.isNearTo(_goal)) {
                                creep.moveTo(Game.getObjectById(creep.memory.parent));
                            }

                        } else {
                            let contain = Game.getObjectById(creep.memory.workContain);
                            if (contain !== null && _goal.energy === 0 && total > 0 && contain.store[RESOURCE_ENERGY] === 0) {
                                creep.memory.gohome = true;
                                creep.memory.empty = false;
                            } else {
                                creep.say('zZzZ');
                            }


                        }
                    } else {
                        //      if (!super.guardRoom(creep)) {
                        if (!creep.pos.isNearTo(_goal))
                            creep.moveMe(_goal, { ignoreRoads: _ignoreRoad, reusePath: 35, visualizePathStyle: visPath });
                        //       }
                    }

            } else if (_goal !== null) {
                creep.moveMe(_goal, {
                    ignoreRoads: _ignoreRoad,
                    reusePath: 49,
                    visualizePathStyle: visPath
                });
            }


        }

    }
}
module.exports = transport;
