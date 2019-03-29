var classLevels = [
    // Level 0
    //  Transport - 500 Carry/900 Energy

    [MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY], //  900
    // Level 1 - 750 Carry 1250 Energy
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1250
    // Level 2 1000 Carry - 1750 Energy
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, MOVE, CARRY, WORK, WORK,
    ], // 1750
    // Level 3 1250 Carry - 2200 Energy.
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //2000
    // Level 4 1550 carry 2600 Energy - Required Lv 7 
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, WORK,
        CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY,
        MOVE, WORK
    ], //2600


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



function buildStarterRoad2(creep) {
    //conditions to create starter roads.
    //Has a workContain	//Near it
    // Is near by 1 other road.
    // has no road under it.
    // Is not near source.
    if(creep.memory.noMoreStarter) return false;
    let source = Game.getObjectById(creep.memory.goal);
    let cont = Game.getObjectById(creep.memory.workContain);
    if (!source || !cont) return false;

    if (creep.pos.lookForStructure(STRUCTURE_ROAD)) {
        return true;
    }

    if (creep.pos.isNearTo(cont) && !creep.pos.isNearTo(source)) {
        let otherRoads = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: object => (object.structureType == STRUCTURE_ROAD && creep.pos.isNearTo(object))
        });
        if (otherRoads.length === 1) {
            console.log(roomLink(creep.room.name), "wants to create road at", creep.pos);
            creep.memory.noMoreStarter = true;
            if(creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_ROAD) === OK){
            }
        }

    }

}


function lookAtFeet(creep) {

    let atFeet = creep.room.lookAt(creep.pos.x, creep.pos.y);
    var threst = 4500;
    if ((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined)) {
        threst = 500;
    }
    creep.memory.onRoad = false;
    for (var i in atFeet) {

        if (creep.carry[RESOURCE_ENERGY] > 0 && atFeet[i].type == 'structure' && atFeet[i].structure.structureType == STRUCTURE_ROAD &&
            (atFeet[i].structure.hits < atFeet[i].structure.hitsMax - threst)) {
            if (creep.repair(atFeet[i].structure) == OK) {
                creep.memory.onRoad = true;
                return true;
            }
        } else if (creep.carryTotal < creep.carryCapacity) {
            if (atFeet[i].type === 'energy') {
                if (!creep.room.storage || !creep.pos.isNearTo(creep.room.storage)) {
                    creep.pickup(atFeet[i].energy);
                }
                return true;
            } else if (atFeet[i].type === 'resource') {
                creep.pickup(atFeet[i].resource);
                return true;
            } else if (atFeet[i].type === 'tombstone') {
                for (let e in atFeet[i].tombstone.store) {
                    if (atFeet[i].tombstone.store[e] > 0) {
                        creep.withdraw(atFeet[i].tombstone);
                        return true;
                    }
                }
            }
        } else if (atFeet[i].type === 'constructionSite') {
            creep.build(atFeet[i].constructionSite);
            return true;
        }

    }

    if (!creep.memory.onRoad && creep.memory.goHome) {
        if ((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined)) {

            if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {

            }
        }
    }
    creep.memory.onRoad = false;

    return false;
}

function emptied(creep) {
    creep.memory.task = [];
    if (creep.ticksToLive < creep.memory.distance * 2) {
        if (!creep.memory.reportDeath) {
            let spawnsDo = require('commands.toCreep');
            spawnsDo.reportDeath(creep);
        }
        creep.memory.suicide = true;
        creep.suicide();

    }
    creep.countReset();
}

var withdrawing;
var empting;
var _workContainer;

function interactContainer(creep) {
    if (creep.memory.goHome && creep.isHome) {
        if (creep.room.storage && creep.room.terminal && creep.room.storage.full && creep.room.terminal.full && creep.pos.isNearTo(creep.room.storage)) {
            creep.drop(RESOURCE_ENERGY);
            console.log('ROOM MAXED OUT, BAD CREEP DROPPING ENERGY', roomLink(creep.room.name), 'Adding upgrade to flag.');
            Game.notify(creep.room.name + "  Terminal and Storage Full DropEnergy!!!  ", 120);
            return;
        } else if (creep.room.storage && creep.pos.isNearTo(creep.room.storage) && !creep.room.storage.full) {
            if (creep.transfer(creep.room.storage, creep.carrying) == OK) {
                emptied(creep);
                empting = true;
                return;
            }
        } else if (creep.room.terminal && creep.pos.isNearTo(creep.room.terminal) && creep.room.storage.full) {
            for (var ez in creep.carry) {
                if (creep.carry[ez] && creep.transfer(creep.room.terminal, ez) == OK) {
                    emptied(creep);
                    empting = true;
                    return;
                }
            }
        }
    } else {
        if (creep.memory.workContain !== undefined) {
            let container = _workContainer;
            if (container !== null) {
                if (creep.pos.isNearTo(container) && container.store[RESOURCE_ENERGY] >= (creep.carryCapacity - creep.carryTotal)) {
                    var keys = Object.keys(container.store); // Picking up
                    var z = keys.length;
                    while (z--) {
                        var o = keys[z];
                        if (creep.withdraw(container, o) == OK) {
                            withdrawing = true;
                        }
                    }
                }
            } else {
                creep.memory.workContain = undefined;
            }
        } else {
            if (creep.memory.lookForConSite === undefined) {
                let isBuilt = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1, {
                    filter: object => (object.structureType == STRUCTURE_CONTAINER)
                });
                if (isBuilt.length === 0) {
                    creep.memory.lookForConSite = -10;
                } else {

                    creep.memory.lookForConSite = isBuilt[0].id;
                }
            } else if (creep.memory.lookForConSite <= 0) {
                creep.memory.lookForConSite++;
                if (creep.memory.lookForConSite === 0) creep.memory.lookForConSite = undefined;
            } else {
                let site = Game.getObjectById(creep.memory.lookForConSite);
                if (site && creep.carry[RESOURCE_ENERGY] > 0) {
                    creep.build(site);
                    creep.say('helping');
                } else {
                    creep.memory.lookForConSite = undefined;
                }
            }
        }
    }
}

function updateMemory(creep) {

    if (creep.room.name === creep.memory.home && creep.carryTotal > 0) {
        // This is for running home and depositing.
        creep.memory.goHome = true;
    } else if (creep.carryTotal === 0) {
        creep.memory.goHome = false;
        creep.memory.cachePath = undefined;
    }

    if (creep.memory.goHome) {
        if (creep.carryTotal < 20 || empting) {
            creep.memory.goHome = false;
            //            creep.memory.cachePath = undefined;
            emptied(creep);
        }
    } else {
        let container = _workContainer;
        if (container && creep.pos.isNearTo(container)) {
            creep.memory._move = undefined;
            creep.memory.cachePath = undefined;
            creep.memory.position = undefined;
            creep.distance = 0;
            // If it is getting ready to withdraw and 
            /// 1250 - 500 = 750
            if (container.store[RESOURCE_ENERGY] >= creep.carryCapacity - creep.carry[RESOURCE_ENERGY]) {
                roleParent.segment.requestRoomSegmentData(creep.memory.home);
            }
            roleParent.keeperFind(creep);
        }
        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.goHome = true;
        }
        if (creep.memory.workContain === undefined && _goal && creep.room.name === _goal.pos.roomName && creep.pos.inRangeTo(_goal, 3)) {

            let contain = _goal.room.find(FIND_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_CONTAINER
                }
            });
            if (contain.length === 0) {
                let CONTAIN = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3, {
                    filter: object => (object.structureType == STRUCTURE_CONTAINER)
                });
            } else {
                contain = _.filter(contain, function(o) {
                    return o.pos.isNearTo(_goal);
                });
                //                contain = _goal.pos.findInRange(contain, 10);
                contain = _goal.pos.findClosestByRange(contain);
                if (contain !== null) {
                    creep.memory.workContain = contain.id;
                }
            }
        } else {
            buildStarterRoad2(creep);
        }
    }
}

function movement(creep) {
    //    let bads = [];
    //    bads = getBads(creep);
    //    if (bads.length !== 0) {
    if (creep.memory.suicide) return;
    if (roleParent.guardRoom(creep)) {
        creep.memory.cachePath = undefined;
        //        creep.sleep(5);
        //        creep.say("DGHDAG");
        return;
    }
    //    else {
    if (creep.memory.goHome) {

        if (!creep.isHome && !lookAtFeet(creep)) {
            if (!roleParent.constr.doCloseRoadBuild(creep)) {

            }
        }

        creep.countDistance();
        if (creep.isHome && creep.room.storage.full && creep.pos.inRangeTo(creep.room.storage, 5)) {
            creep.moveMe(creep.room.terminal);
        } else
        if (Game.rooms[creep.memory.home] && Game.rooms[creep.memory.home].storage) {
            creep.moveMe(Game.rooms[creep.memory.home].storage, {
                reusePath: 50,
                segment: true,
                ignoreCreeps: true,
                visualizePathStyle: visPath
            });
        }
        /* else {
                    creep.moveMe(Game.rooms[creep.memory.home].alphaSpawn, {
                        reusePath: 50,
                        segment: true,
                        ignoreCreeps: true,
                        visualizePathStyle: visPath
                    });
                }*/



    } else {
        lookAtFeet(creep);

        if (_goal !== null && _goal.energyCapacity === 4000 && _goal.pos.roomName === creep.room.name && roleParent.constr.withdrawFromTombstone(creep, 7)) {
            creep.memory.cachePath = undefined;
            return;
        }

        let container = _workContainer;
        if (_goal === null) {
            _goal = {
                pos: roleParent.movement.getSourcePos(creep),
                energyCapacity: 3000,
            };
        }
        if (_goal !== null && creep.room.name !== _goal.pos.roomName) {
            creep.moveMe(_goal.pos, { reusePath: 50, segment: true, ignoreCreeps: true, visualizePathStyle: visPath });
        } else if (_goal !== null && creep.room.name === _goal.pos.roomName) {
            if ((container && creep.pos.isEqualTo(container)) || (!container && _goal && creep.pos.isNearTo(_goal))) {
                creep.dance();
                creep.say('Dnce');
                creep.sleep(3);
            } else if (container && creep.pos.isNearTo(container) && !withdrawing) {
                //                creep.sleep(3);
                //                if (!withdrawing) {
                creep.sleep(3);
                creep.cleanMe();

                // how do we determine if a creep can have a partner?

                if (creep.memory.remoteLvl && creep.memory.remoteLvl > 4 && creep.pos.inRangeTo(_goal, 3)) {
                    var partner = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                        return o.pos.isNearTo(creep) && o.ticksToLive < creep.ticksToLive;
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
                        var max = _.max(partner, a => a.carryTotal);
                        if (max.memory !== undefined) max.memory.goHome = true;
                    }
                }

                //            }
            } else if (_goal && !creep.pos.isNearTo(_goal)) {
                if (!container) {
                    creep.moveMe(_goal.pos, { reusePath: 50, segment: true, ignoreCreeps: true, visualizePathStyle: visPath });
                } else if (container) {
                    creep.moveMe(container.pos, { reusePath: 50, segment: true, ignoreCreeps: true, visualizePathStyle: visPath });
                }
            } else if (container && !creep.pos.isNearTo(container)) {
                creep.moveMe(container.pos, { reusePath: 50, segment: true, ignoreCreeps: true, visualizePathStyle: visPath });
            } else {}
        }
        //   }
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
            return _.shuffle(classLevels[level].body);
        } else {
            return classLevels[level];
        }
    }
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    static run(creep) {
        if (creep.memory.goHome === undefined) creep.memory.goHome = false;

        super.rebirth(creep);

        if (super.movement.runAway(creep)) {
            return;
        }

        if (super.spawnRecycle(creep)) return true;
        if (super.depositNonEnergy(creep)) return true;

        if (super.boosted(creep)) {
            return;
        }

        empting = false;
        withdrawing = false;
        if (creep.room.name === creep.memory.home) {

            if (super.link.transfer(creep)) {
                if (creep.carry[RESOURCE_ENERGY] > 800) {

                    return;
                }
                empting = true;

            }
        }
        if (creep.memory.goal === '5982ff6bb097071b4adc2991' && creep.pos.y === 48 && creep.room.name === 'E24S38' && !creep.memory.goHome) {
            creep.moveInside();
            return;
        }

        _goal = Game.getObjectById(creep.memory.goal);
        _workContainer = Game.getObjectById(creep.memory.workContain);

        if (creep.memory.isSkGoal === undefined && _goal !== null) {
            creep.memory.isSkGoal = _goal.pos.isSkRoom();
        }

        if (_goal !== null && _goal.energyCapacity === 4000 && super.keeperWatch(creep)) {
            creep.memory.cachePath = undefined;

            return;
        }

        interactContainer(creep);
        updateMemory(creep);
        if(creep.saying === 'helping') return;
            movement(creep);


    }
}
module.exports = transport;