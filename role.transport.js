var classLevels = [
    // Level 0
    [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY], //  300
    // Level 1

    [CARRY, CARRY, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], //  550
    // Level 2

    [CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    // Level 3
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE,
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
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK,
        MOVE, WORK
    ]

];
var _ignoreRoad = true;
var roleParent = require('role.parent');
var rePath = 100;
var visPath = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};


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
        super.rebirth(creep);

        if (super.movement.runAway(creep)) {
            return;
        }
        if (super.baseRun(creep)) return;

        if (super.link.transfer(creep)) {
            creep.countReset();
            return;
        }

        if (super.keeperWatch(creep)) {
            return;
        }

        super.shouldDie(creep);

        if (creep.memory.gohome === undefined) { creep.memory.gohome = false; }
        if (creep.memory.keeperLairID == 'none') { creep.memory.keeperLairID = undefined; }

        if ((!creep.memory.gohome && creep.carryTotal > creep.carryCapacity - 45)) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        } else if (creep.carryTotal < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
        }

        if (creep.memory.gohome) {
            /*
                        if (creep.room.name == 'E27S45') {
                            let zz = Game.getObjectById('59fa31ab20b5cd5f44d8d78a');

                            if (zz !== null) {
                                if (!creep.pos.isNearTo(zz)) {
                                    creep.moveTo(zz);
                                }
                                creep.build(zz);

                                return;
                            }
                        }
                       */

            creep.countDistance();
            if (creep.memory.linkID !== undefined && creep.carry[RESOURCE_ENERGY] > 0 && creep.memory.home != creep.room.name) {

                let goal = Game.getObjectById(creep.memory.linkID);
                if (goal !== null) {
                    let task = {};

                    task.options = {
                        reusePath: rePath,
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#ff0',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    };
                    task.pos = goal.pos;
                    task.order = "roadMoveTo";
                    let zzz = Game.getObjectById(creep.memory.goal);
                    if (zzz !== null && zzz.energyCapacity === 3000) {
                        task.enemyWatch = false;
                    } else {
                        task.enemyWatch = true;
                    }
                    task.rangeHappy = 1;
                    creep.memory.task.push(task);
                } else {
                    creep.memory.linkID = undefined;
                }



            } else if (creep.memory.home == creep.room.name) {

                if (!super.containers.moveToStorage(creep)) {
                    if (!super.containers.moveToTerminal(creep)) {
                        if (!super.spawns.moveToTransfer(creep)) {
                            if (!super.constr.doCloseBuild(creep)) {
                                if (!super.containers.moveToTransfer(creep)) {
                                    // if no containers then go to spawns
                                }
                            }
                        }
                    }
                }

            } else {
                if (!super.constr.doCloseRoadRepair(creep)) {
                    if (creep.memory.roadCount === 0 && !super.constr.doCloseRoadBuild(creep)) {

                    }else {
//                        console.log('G');
                    }
                }

                let bads = getBads(creep);
                if (bads.length === 0) {
                    creep.moveMe(Game.getObjectById(creep.memory.parent), {
                        reusePath: rePath
                    });
                } else {
                    creep.runFrom(bads);
                }
            }
        } else { // IF not going home. 

            let rng = 4;
            let _goal = Game.getObjectById(creep.memory.goal);

            if (!super.constr.moveToPickUpEnergyIn(creep, 7))
                if (creep.memory.workContain !== undefined) {
                    let zzz = Game.getObjectById(creep.memory.workContain);
                    if (zzz !== null)
                        if (!creep.pos.isNearTo(zzz)) {
                            let task = {};
                            task.options = {
                                reusePath: rePath,
                                ignoreRoads: false,
                                visualizePathStyle: {
                                    fill: 'transparent',
                                    stroke: '#ff0',
                                    lineStyle: 'dashed',
                                    strokeWidth: 0.15,
                                    opacity: 0.5
                                }
                            };
                            task.pos = new RoomPosition(zzz.pos.x, zzz.pos.y, zzz.pos.roomName);
                            task.order = "moveTo";
                            task.enemyWatch = (_goal.energyCapacity === 3000 ? false : true);
                            task.energyPickup = true;
                            task.rangeHappy = 1;
                            creep.memory.task.push(task);
                        } else if (creep.pos.isNearTo(zzz) && zzz.total > 100) {

                        var keys = Object.keys(zzz.store); // Picking up
                        var z = keys.length;
                        while (z--) {
                            var o = keys[z];
                            if (creep.withdraw(zzz, o) == OK) {}
                        }
                    } else if (creep.pos.isNearTo(_goal)) {
                        creep.moveTo(Game.getObjectById(creep.memory.parent), { maxOps: 50 });
                    } else {
                        creep.say('zZzZ', true);
                    }

                } else if (_goal !== null && creep.pos.inRangeTo(_goal, rng)) {

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

                super.keeperFind(creep);

            } else if (_goal !== null) {

                let task = {};
                task.options = {
                    reusePath: rePath,
                    ignoreRoads: false,
                    visualizePathStyle: visPath
                };
                task.pos = _goal.pos;
                task.order = "moveTo";
                task.enemyWatch = (_goal.energyCapacity === 3000 ? false : true);
                task.energyPickup = true;
                task.rangeHappy = 2;
                creep.memory.task.push(task);

            } else if (_goal === null) {
                var goingTo = super.movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                creep.moveMe(goingTo, {
                    ignoreRoads: false,
                    reusePath: rePath,
                    visualizePathStyle: visPath
                });
            }
        }
    }
}
module.exports = transport;