var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var movement = require('commands.toMove');

var visPath = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};


var classLevels = [
    // Level 0
    [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], //  300
    // Level 1

    [CARRY, CARRY, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], //  550
    // Level 2

    [CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    // Level 3
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
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        MOVE, WORK
    ]

];
var _ignoreRoad = true;

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
    var bads = creep.pos.findInRange(creep.room.hostilesHere, 3);
    bads = _.filter(bads, function(object) {
        return (object.owner.username != 'zolox' && object.owner.username != 'admon');
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
        if (movement.runAway(creep)) {
            return;
        }
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
        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.keeperWatch(creep)) {
            return;
        }
        shouldDie(creep);
        super.deathWatch(creep);
        if (creep.memory.gohome === undefined) { creep.memory.gohome = false; }
        if (creep.memory.keeperLairID == 'none') { creep.memory.keeperLairID = undefined; }

        if ((!creep.memory.gohome && total > creep.carryCapacity - 45)) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        } else if (total < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }

        if (creep.room.name != 'E28S77' && creep.room.name != 'E27S74' && creep.room.storage === null)
            constr.pickUpEnergy(creep); // This is to pick up after other transport deaths.

        if (creep.memory.gohome) {
            creep.countDistance();
            if (creep.memory.linkID !== undefined) {
                if (!constr.doCloseRoadRepair(creep)) {
                    constr.doCloseRoadBuild(creep);
                }

                let bads = getBads(creep);
                if (bads.length === 0) {
                    creep.moveMe(Game.getObjectById(creep.memory.linkID), {
                        reusePath: 49
                    });
                } else {
                    creep.runFrom(bads);
                }

            } else if (creep.memory.home == creep.room.name) {
                var containers = require('commands.toContainer');

                if (!containers.moveToStorage(creep)) {
                    if (!containers.moveToTerminal(creep)) {
                        var spawns = require('commands.toSpawn');
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

                let bads = getBads(creep);
                if (bads.length === 0) {
                    creep.moveMe(Game.getObjectById(creep.memory.parent), {
                        reusePath: 49
                    });
                } else {
                    creep.runFrom(bads);
                }
            }



        } else { // IF not going home. 
            let rng = 4;
            let _goal = Game.getObjectById(creep.memory.goal);
            if (creep.room.name == 'E27S74') rng = 3;

            if (!super._constr.moveToPickUpEnergyIn(creep, 7))
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
                            creep.moveTo(Game.getObjectById(creep.memory.parent), { maxOps: 50 });
                        }

                    } else {
                        creep.say('zZzZ');
                    }


                } else if (_goal !== null) {
                if (!super.guardRoom(creep)) {
                    creep.moveMe(_goal, {
                        ignoreRoads: _ignoreRoad,
                        reusePath: 49,
                        visualizePathStyle: visPath
                    });
                }
            } else if (_goal === null) {
                var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                creep.moveMe(goingTo, {
                    ignoreRoads: _ignoreRoad,
                    reusePath: 49,
                    visualizePathStyle: visPath
                });
            }
        }
    }
}
module.exports = transport;
