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

var withdrawing;

function interactContainer(creep) {
    withdrawing = false;
    if (creep.memory.goHome) {
        if (creep.isHome && creep.pos.isNearTo(creep.room.storage)) {
            for (var e in creep.carry) {
                creep.transfer(creep.room.storage, e);
            }
        }
        if (creep.isHome && creep.pos.isNearTo(creep.room.terminal)) {
            for (var ez in creep.carry) {
                creep.transfer(creep.room.terminal, ez);
            }
        }

    } else {
        if (creep.memory.workContain !== undefined) {
            let container = Game.getObjectById(creep.memory.workContain);
            if (container !== null) {
                if (creep.pos.isNearTo(container) && container.total > 100) {

                    var keys = Object.keys(container.store); // Picking up
                    var z = keys.length;
                    while (z--) {
                        var o = keys[z];
                        if (creep.withdraw(container, o) == OK) {
                            withdrawing = true;
                        }
                    }
                }
            }
        }
    }
}

function updateMemory(creep) {


    if (creep.memory.goHome) {
        if (creep.carryTotal < 20) {
            creep.memory.goHome = false;
            creep.memory.cachePath = undefined;
        }
    } else {
        let container = Game.getObjectById(creep.memory.workContain);
        if (creep.pos.isNearTo(container)) {
            creep.memory._move = undefined;
            creep.memory.cachePath = undefined;
            creep.memory.position = undefined;
            creep.distance = 0;
        }
        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.goHome = true;
        }

        if (creep.memory.workContain === undefined && _goal !== null && creep.pos.inRangeTo(_goal, 4)) {
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
            roleParent.keeperFind(creep);
        }
    }
}

function movement(creep) {
    let bads = _goal.energyCapacity === 3000 ? [] : getBads(creep);
    if (bads.length !== 0) {
        creep.runFrom(bads);
    } else {
        if (creep.memory.goHome) {

            if (!creep.isHome&&  !roleParent.constr.doCloseRoadRepair(creep)) {
                if (!roleParent.constr.doCloseRoadBuild(creep)) {}
            }

            creep.countDistance();
            creep.moveMe(Game.rooms[creep.memory.home].storage, {
                reusePath: rePath,
                segment:true,
                ignoreCreeps: true,
                visualizePathStyle: visPath
            });
            //        creep.moveMe(Game.rooms[creep.memory.home].storage,{maxOps:50});
        } else {
            let container = Game.getObjectById(creep.memory.workContain);
            if (_goal !== null && creep.room.name !== _goal.pos.roomName) {
                let task = {};
                task.options = {
                    reusePath: rePath,
                    segment:true,
                    ignoreCreeps: true,
                    ignoreRoads: false,
                    visualizePathStyle: visPath
                };
                task.pos = _goal !== null ? _goal.pos : roleParent.movement.getRoomPos(creep.memory.goal);
                task.order = "moveTo";
                task.enemyWatch = (_goal.energyCapacity === 3000 ? false : true);
                task.energyPickup = true;
                task.rangeHappy = 2;
                creep.memory.task.push(task);
                roleParent.doTask(creep);
            } else if (creep.room.name === _goal.pos.roomName) {
                if (!creep.pos.isNearTo(container)) {
                    creep.moveTo(container);
                } else {
                    if (!withdrawing)
                        creep.sleep();
                }
            } else { // If 
                if (creep.pos.isNearTo(_goal)) {
                    creep.moveTo(Game.getObjectById(creep.memory.parent), { maxOps: 10, reusePath: 1 });
                } else if (creep.memory.workContain !== undefined) {
                    let container = Game.getObjectById(creep.memory.workContain);
                    if (container !== null) {
                        creep.moveTo(container);
                    }
                }
            }
        }
    }
}

var _goal;
class transport extends roleParent {
    static keeperFind(creep) {
        return super.keeperFind(creep);
    }
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (creep.memory.goHome === undefined) creep.memory.goHome = false;
        if (creep.memory.keeperLairID == 'none') { creep.memory.keeperLairID = undefined; }


        super.rebirth(creep);
        if (super.movement.runAway(creep)) return;
        if (super.baseRun(creep)) return;
        if (super.link.transfer(creep)) {
            creep.countReset();
            return;
        }
            _goal = Game.getObjectById(creep.memory.goal);
        if (_goal !== null && _goal.energyCapacity === 4000 && super.keeperWatch(creep)) return;
        if (creep.carryTotal !== creep.carryCapacity) {
            if (super.constr.moveToPickUpEnergyIn(creep, 7)) {
                return;
            }
        }
        interactContainer(creep);
        updateMemory(creep);
        movement(creep);
    }
}
module.exports = transport;