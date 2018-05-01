var classLevels = [
    // Level 0
    //  Transport - 500 Carry/900 Energy
    [MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY], //  300
    // Level 1 - 750 Carry 1250 Energy
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 2 1000 Carry - 1750 Energy
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, WORK, WORK,
    ],
    // Level 3 1250 Carry - 2200 Energy.
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    // Level 4 1550 carry 2600 Energy - Required Lv 7 
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        MOVE, WORK
    ],


    // Level 5
    {
        body: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
        ],
        boost: ['KH'],
    },
    // Level 6
    {
        body: [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE,
            CARRY, MOVE, CARRY, MOVE
        ],
        boost: ['KH'],
    },
    // MAX level 7
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


function buildStarterRoad(creep) {
    // this is called because it doesn't find a container.

    let isBuilt = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3, {
        filter: object => (object.structureType == STRUCTURE_ROAD)
    });
    // If you find a construction site
    if (isBuilt.length > 0) {
        creep.build(isBuilt[0]);
    } else {
        creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD);
    }

}

function getBads(creep) {
    var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    bads = _.filter(bads, function(object) {
        return (object.owner.username != 'zolox' && object.owner.username != 'admon');
    });
    return bads;
}

function emptied(creep) {
    if (creep.ticksToLive < creep.memory.distance * 2) {
        if (!creep.memory.reportDeath) {
            let spawnsDo = require('build.spawn');
            spawnsDo.reportDeath(creep);
        }
        creep.suicide();
    }
    creep.countReset();
}

var withdrawing;
var empting;

function interactContainer(creep) {
    if (creep.memory.goHome) {
        if (creep.isHome && creep.pos.isNearTo(creep.room.storage)) {
            for (var e in creep.carry) {

                if (creep.carry[e] && creep.transfer(creep.room.storage, e) == OK) {
                    emptied(creep);
                    empting = true;
                    break;
                }
            }
        }
        if (creep.isHome && creep.pos.isNearTo(creep.room.terminal)) {
            for (var ez in creep.carry) {
                if (creep.carry[ez] && creep.transfer(creep.room.terminal, ez) == OK) {
                    emptied(creep);
                    empting = true;
                    break;
                }
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
        if (creep.carryTotal < 20 || empting) {
            creep.memory.goHome = false;
            creep.memory.cachePath = undefined;

            emptied(creep);
        }
    } else {
        let container = Game.getObjectById(creep.memory.workContain);
        if (creep.pos.isNearTo(container)) {
            creep.memory._move = undefined;
            creep.memory.cachePath = undefined;
            creep.memory.position = undefined;
            creep.distance = 0;
            // If it is getting ready to withdraw and 
            /// 1250 - 500 = 750
            if (container.store[RESOURCE_ENERGY] >= creep.carryCapacity - creep.carry[RESOURCE_ENERGY]) {
                roleParent.segment.requestRoomSegmentData(creep.memory.home);
            }

        }
        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.goHome = true;
        }
        if (_goal !== null && _goal.pos.inRangeTo(_goal, 3)) {
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

                } else {
                    let CONTAIN = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3, {
                        filter: object => (object.structureType == STRUCTURE_CONTAINER)
                    });
                    if (CONTAIN.length > 0) {
                        if (creep.pos.isNearTo(CONTAIN[0])) {
                            buildStarterRoad(creep);
                        } else {
                            creep.moveTo(CONTAIN[0]);

                        }
                        return;
                    }

                }
            }
            roleParent.keeperFind(creep);
        }
    }
}

function movement(creep) {
//    let bads = [];
//    bads = getBads(creep);
//    if (bads.length !== 0) {
    if (roleParent.guardRoom(creep)) {
//creep.say("BADS");
//        creep.runFrom(bads);
        creep.memory.cachePath = undefined;
    } else  {
        var skRooms = ['E16S45'];
        if (creep.memory.goHome) {

            if (!creep.isHome && !roleParent.constr.doCloseRoadRepair(creep)) {
                if (!roleParent.constr.doCloseRoadBuild(creep)) {

                }
            }

            creep.countDistance();
            if (Game.rooms[creep.memory.home].storage.total !== 1000000) {

                creep.moveMe(Game.rooms[creep.memory.home].storage, {
                    reusePath: rePath,
                    useSKPathing: _.contains(skRooms, creep.memory.home),
                    segment: true,
                    ignoreCreeps: true,
                    visualizePathStyle: visPath
                });

            } else {

                creep.moveMe(Game.rooms[creep.memory.home].terminal, {
                    reusePath: rePath,
                    segment: true,
                    useSKPathing: _.contains(skRooms, creep.memory.home),
                    ignoreCreeps: true,
                    visualizePathStyle: visPath
                });

            }
        } else {
            if (_goal !== null && _goal.energyCapacity === 4000 && roleParent.constr.withdrawFromTombstone(creep, 4)) {
                creep.memory.cachePath = undefined;
                return;
            }

            let container = Game.getObjectById(creep.memory.workContain);
            if (_goal !== null && creep.room.name !== _goal.pos.roomName) {
                let task = {};

                task.options = {
                    reusePath: rePath,
                    segment: true,
                    ignoreCreeps: true,
                    visualizePathStyle: visPath,
                    useSKPathing: _.contains(skRooms, creep.memory.home),
                };
                task.pos = _goal !== null ? _goal.pos : roleParent.movement.getRoomPos(creep);
                task.order = "moveTo";
                if(_goal.energyCapacity === 3000  || _goal.energyCapacity === 1500 ) {
                    task.enemyWatch = false;
                } else {
                    task.enemyWatch = true;
                }
                task.energyPickup = true;
                task.rangeHappy = 2;
                creep.memory.task.push(task);
                roleParent.doTask(creep);
            } else if (_goal !== null && creep.room.name === _goal.pos.roomName) {
                if (!creep.pos.isNearTo(container)) {
                    creep.moveTo(container, { maxOps: 30, maxRooms: 1 });
                } else if (creep.pos.isEqualTo(container)) {
                    creep.moveTo(Game.getObjectById(creep.memory.parent), { maxOps: 30, reusePath: 1 });
                } else {
                    if (!withdrawing) {
                        creep.sleep();
                        creep.cleanMe();


                        var partner = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                            return o.pos.isNearTo(creep) && o.ticksToLive < creep.ticksToLive ;
                        });
                        if (partner.length > 0) {
                            if (creep.carry[RESOURCE_ENERGY]) {

                                creep.transfer(partner[0], RESOURCE_ENERGY);
                                if (partner[0].carryCapacity - partner[0].carry[RESOURCE_ENERGY] < creep.energy) {
                                    partner[0].say(':)'); // Breaks sleep.
                                    roleParent.segment.requestRoomSegmentData(partner[0].memory.home); // Request it for the broken sleeper to use.
                                }
                            }
                        }
                        if (partner.length > 1) {
                            var max = _.max(partner,a=> a.carryTotal);
                            if(max.memory !== undefined)                           max.memory.goHome = true;
                        }

                        if (creep.room.memory.mineInfo === undefined) {
                            creep.room.memory.mineInfo = {};
                        }
                        if (creep.room.memory.mineInfo[creep.memory.goal] === undefined) {
                            creep.room.memory.mineInfo[creep.memory.goal] = 0;
                        } else {
                            if (creep.memory.expandLevel === undefined) {
                                var spn = Game.getObjectById(creep.memory.parent);
                                if (spn !== null) {
                                    for (var e in spn.memory.roadsTo) {
                                        let zz = spn.memory.roadsTo[e];
                                        if (zz.source === creep.memory.goal) {
                                            creep.memory.expandLevel = zz.expLevel;
                                            break;
                                        }
                                    }
                                }
                            }

                            if (creep.memory.expandLevel > 4) {
                                creep.room.memory.mineInfo[creep.memory.goal] -= 15;
                            } else {
                                creep.room.memory.mineInfo[creep.memory.goal] -= 30;
                            }
                        }

                    }
                }
            } else if(_goal === null) {
                creep.moveMe( roleParent.movement.getRoomPos(creep), { reusePath: 50 ,segment:true, ignoreCreeps: true });
            } else { // If 
                if (creep.memory.workContain !== undefined) {
                    let container = Game.getObjectById(creep.memory.workContain);
                    if (container !== null) {
                        creep.moveTo(container, { maxOps: 30 });
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
        if (_.isArray(classLevels[level])) {
            return _.shuffle(classLevels[level]);
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle( classLevels[level].body );
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {

        if (creep.memory.goHome === undefined) creep.memory.goHome = false;
        if (creep.memory.keeperLairID == 'none') { creep.memory.keeperLairID = undefined; }
        if (creep.getActiveBodyparts(MOVE) < 1)
            creep.suicide();

        super.rebirth(creep);
        if (super.movement.runAway(creep)) {
            
            return;
        }
        if (super.baseRun(creep)) return;

        if (creep.ticksToLive > 1400 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
            //            creep.memory.boostNeeded = classLevels[creep.memory.level].boost;
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        empting = false;
        withdrawing = false;
        if (creep.room.name == 'E29xxS48' && super.link.newTransfer(creep)) {
            if (creep.carry[RESOURCE_ENERGY] > 800) {
                return;
            }
            empting = true;
        } else if (super.link.transfer(creep)) {
            if (creep.carry[RESOURCE_ENERGY] > 800) {
                return;
            }
            empting = true;
        }

        _goal = Game.getObjectById(creep.memory.goal);
        if (_goal !== null && _goal.energyCapacity === 4000 && super.keeperWatch(creep)) {

            creep.memory.cachePath = undefined;
            return;
        }

        if (creep.carryTotal < creep.carryCapacity - 10) {
/*            let bads = [];
            if (_goal !== null && _goal.energyCapacity === 4000) {
                bads = getBads(creep);
            }

            if (bads.length !== 0) {
                creep.runFrom(bads);
                creep.memory.cachePath = undefined;
            } else {
                //if (_goal !== null && _goal.energyCapacity === 4000 && super.constr.moveToPickUpEnergyIn(creep, 6)) {
            } */
        }

        interactContainer(creep);
        updateMemory(creep);
        movement(creep);

    }
}
module.exports = transport;