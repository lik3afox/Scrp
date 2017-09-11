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

var pathVis = {
    fill: 'transparent',
    stroke: '#ff0',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};

var classLevels = [
    // MAX level 6 
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, HEAL, HEAL, HEAL, MOVE]

];
var _ignoreRoad = false;

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

function getRooms(roomName) {
    switch (roomName) {
        case "E35S73":
            return ['E35S74', 'E36S74', 'E35S75', 'E36S75'];
        case "E35S83":
            return ['E35S84', 'E34S84', 'E35S85'];
        case "E26S77":
            return ['E26S76', 'E25S76', 'E26S75'];
        case "E26S73":
            return ['E26S74', 'E25S74', 'E25S75'];
    }
}

function getSKContainers(creep) {
    if (creep.memory.skContainersID === undefined) {
        let rooms = getRooms(creep.memory.home);
        let containers = [];
        for (var e in rooms) {
            let room = Game.rooms[rooms[e]];
            let fs = room.find(FIND_STRUCTURES);
            if (fs !== null) {
                fs = _.filter(fs, function(o) {
                    return o.structureType == STRUCTURE_CONTAINER;
                });
                for (var a in fs) {
                    containers.push(fs[a].id);
                }
            }
            creep.memory.skContainersID = containers;
        }
    }

    let containers = [];
    for (let o in creep.memory.skContainersID) {
        let container = Game.getObjectById(creep.memory.skContainersID[o]);
        containers.push(container);
    }
    return containers;

}

function repairRoad(creep, range) {
    let target = Game.getObjectById(creep.memory.repairTarget);
    let zbuild = creep.pos.findInRange(FIND_STRUCTURES, range);
    zbuild = _.filter(zbuild, function(o) {
        return (o.structureType == STRUCTURE_ROAD && o.hits < o.hitsMax - 1500);
    });
    if (zbuild.length > 0) {
        let ztarget = creep.pos.findClosestByRange(zbuild);
        if (creep.pos.inRangeTo(ztarget.pos, 3)) {
            creep.repair(ztarget);
        } else {
            creep.room.visual.line(creep.pos, ztarget.pos);
            creep.moveTo(ztarget.pos);
            return true;
        }
    } else {
        creep.moveMe(target);
    }
    return false;
}

class reTransport extends roleParent {
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

        shouldDie(creep);

        if (creep.memory.keeperLairID == 'none') {
            creep.memory.keeperLairID = undefined;
            //            console.log('heya, here we set up a different parent so it goes back there');
        }
        if (super.returnEnergy(creep)) {
            return;
        }

        let _goal = Game.getObjectById(creep.memory.goal);

        super.rebirth(creep);
        super.deathWatch(creep);

        if (super._movement.runAway(creep)) {
            return;
        }
        if (creep.memory.gohome === undefined) {
            creep.memory.gohome = false;
        }

        let total = creep.carryTotal;

        if (!creep.memory.gohome && total > creep.carryCapacity - 45) {
            creep.memory.gohome = true;
            creep.memory.empty = false;
        }
        if (total === 0 && creep.room.name == creep.memory.home) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            } else {
                creep.moveMe(creep.room.storage);
            }
        }

        if (total < 20) {
            creep.memory.gohome = false;
            creep.memory.empty = true;
            creep.memory.repairTarget = undefined;
        }
        if (creep.memory.stats('heal') > 0) {
            creep.selfHeal();

            /*    if( !creep.healOther(5) ){
                }else {
                  return  
                } */
        }

        if (creep.memory.gohome) {
            // Here we go around and repair roads and containers.
            if (creep.memory.repairTarget === undefined) {
                let containerz = getSKContainers(creep);
                let lowNeed = 10000000;
                let lowTar;
                for (let a in containerz) {
                    console.log(containerz[a].hits, lowNeed);
                    if (containerz[a].hits < lowNeed) {
                        lowNeed = containerz[a].hits;
                        lowTar = containerz[a];
                    }
                }
                console.log(lowTar);
                creep.memory.repairTarget = lowTar.id;
            }

            let target = Game.getObjectById(creep.memory.repairTarget);
            if (creep.pos.inRangeTo(target, 3)) {
                creep.repair(target);
                if (!creep.pos.isNearTo(target)) {
                    creep.moveMe(target);
                } else if (creep.carry[RESOURCE_ENERGY] < 200) {
                    creep.withdraw(target, RESOURCE_ENERGY);
                }

                if (target.hits == target.hitsMax) {
                    creep.memory.repairTarget = undefined;
                    creep.withdraw(target, RESOURCE_ENERGY);
                }

                var bads = creep.pos.findInRange(creep.room.hostilesHere(), 4);
                if (bads.length === 0) {} else {
                    creep.runFrom(bads);
                }

            } else {

                if (repairRoad(creep, 10)) return true;
            }

        } else {
            if (creep.room.name == creep.memory.home) {
                if (!super.guardRoom(creep)) {
                    creep.moveTo(_goal, {
                        reusePath: 49,
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#ff0',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    });
                }
            } else {

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
                                return (structure.structureType == STRUCTURE_CONTAINER);
                            }
                        });

                        if (containerz.length > 0) {
                            for (var a in containerz) {
                                if ((containerz[a].store[RESOURCE_ENERGY] * 0.75) > targetAmount) {
                                    target = containerz[a].id;
                                    targetAmount = containerz[a].store[RESOURCE_ENERGY];
                                    //            isDropped = true;
                                }
                            }
                        }
                    }

                    creep.memory.gotoID = target;

                }


                if (!super._constr.moveToPickUpEnergyIn(creep, 5)) {
                    let target = Game.getObjectById(creep.memory.gotoID);
                    if (target !== null) {
                        // Once picked up, clears memory so it can pick up something new.
                        if (creep.pos.isNearTo(target)) {

                            if (target.structureType == STRUCTURE_CONTAINER) {
                                creep.withdraw(target, RESOURCE_ENERGY);
                                creep.memory.gotoID = undefined;
                            } else {
                                creep.pickup(target);
                                creep.memory.gotoID = undefined;
                            }
                        } else {
                            var badz = creep.pos.findInRange(creep.room.hostilesHere(), 4);
                            if (badz.length === 0) {
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
                            } else {
                                creep.runFrom(badz);
                            }
                        }
                        if (target.structureType == STRUCTURE_CONTAINER && target.total === 0) {
                            creep.memory.gotoID = undefined;
                        }

                    } else {
                        creep.memory.gotoID = undefined;
                    }

                }
            }




        }

    }

}
module.exports = reTransport;
