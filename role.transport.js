var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var containers = require('commands.toContainer');
var spawns = require('commands.toSpawn');
var movement = require('commands.toMove');
var link = require('build.link');
var rePath = 100;


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

function shouldDie(creep) {
    if (creep.hits == creep.hitsMax) return;

    let death = true;
    var e = creep.body.length;
    while (e--) {
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

function createWayPoint(creep) {
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
    if (creep.memory.goal == '5873bd6f11e3e4361b4d9356') task.enemyWatch = false;
    task.energyPickup = true;
    task.rangeHappy = 1;
    creep.memory.task.push(task);
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

        if (movement.runAway(creep)) {
            return;
        }

        if (super.doTask(creep)) {
            return;
        }
        if (super.depositNonEnergy(creep)) return;

        if (link.transfer(creep)) {
            creep.countReset();
            return;
        }



        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.keeperWatch(creep)) {
            return;
        }

        shouldDie(creep);

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

            if (creep.room.name == 'E23S38') {
                let zz = Game.getObjectById('59f2315894e0b138c6b4c4e1');

                if (zz !== null) {
                    if (!creep.pos.isNearTo(zz)) {
                        creep.moveTo(zz);
                    }
                    creep.build(zz);

                    return;
                }
            }
            if (creep.room.name == 'E27S34') {
                let zz = Game.getObjectById('59e79328602a0717b8a09f0b');

                if (zz !== null) {
                    if (!creep.pos.isNearTo(zz)) {
                        creep.moveTo(zz);
                    }
                    creep.build(zz);

                    return;
                }
            }
            if (creep.room.name == 'E25S27') {
                let zz = Game.getObjectById('59e794c30f3a5f17e8d64c90');

                if (zz !== null) {
                    if (!creep.pos.isNearTo(zz)) {
                        creep.moveTo(zz);
                    }
                    creep.build(zz);

                    return;
                } else {
                    zz = Game.getObjectById('59e794b9ca696517c72cd0fa');

                    if (zz !== null) {
                        if (!creep.pos.isNearTo(zz)) {
                            creep.moveTo(zz);
                        }
                        creep.build(zz);

                        return;
                    }
                }
            }

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
                if (creep.room.name !== '') {
                    if (!constr.doCloseRoadRepair(creep)) {
                        if (!constr.doCloseRoadBuild(creep)) {
                            if (creep.carry[RESOURCE_ENERGY] > creep.carryCapacity - 15) {
                                //console.log('here we decide to create an road if we aren''t near one');
                                if (creep.memory.roadCount === undefined) {
                                    creep.memory.roadCount = 0;
                                }
                                creep.memory.roadCount--;
                                if (creep.memory.roadCount < 0) {
                                    //                                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
                                    creep.memory.roadCount = 1;
                                }

                            }
                        }
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

            if (!super._constr.moveToPickUpEnergyIn(creep, 7))
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
/*
                let contain = Game.getObjectById(creep.memory.workContain);
                if (contain !== null) {
                    if (contain.total > 100) {
                        creep.say('!!!');
                        if (creep.pos.isNearTo(contain)) {
                            var keyz = Object.keys(contain.store);
                            var a = keyz.length;
                            var withDraw;

                            while (a--) {
                                if (keyz[a] === RESOURCE_ENERGY)
                                    withDraw = creep.withdraw(contain, keyz[a]);
                            }

                            if (withDraw !== OK) {
                                a = keyz.length;
                                while (a--) {
                                    if (keyz[a] !== RESOURCE_ENERGY)
                                        withDraw = creep.withdraw(contain, keyz[a]);
                                }
                            }

                        } else {
                            creep.moveTo(contain, { maxOps: 50 });
                        }
                    } else if (!creep.pos.isNearTo(contain)) {
                    creep.say('!!!!');
                        creep.moveTo(contain, { maxOps: 50 });
                    } else if (creep.pos.isNearTo(contain)) {
                    creep.say('!!!!!');
                        creep.say('zZzZ', true);
                    }
                } else {
                    if (!creep.pos.isNearTo(contain)) {
                        creep.moveTo(contain, { maxOps: 50 });
                    } else {
                        creep.say('zZzZ');
                    }
                }
*/

            } else if (_goal !== null) {

                let task = {};
                task.options = {
                    reusePath: rePath,
                    ignoreRoads: false,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                };
                task.pos = _goal.pos;
                task.order = "moveTo";
                task.enemyWatch = (_goal.energyCapacity === 3000 ? false : true);
                task.energyPickup = true;
                task.rangeHappy = 2;
                creep.memory.task.push(task);

            } else if (_goal === null) {
                var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
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