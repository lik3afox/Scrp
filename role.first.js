// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

// First to be built, this one stays home and makes sure everything stays running.
// Mostly works with spawn.

var classLevels = [
    [CARRY, MOVE, CARRY, MOVE], // 300

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, MOVE], // 550

    [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // 800
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1300
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

];

var thisID;

var roleParent = require('role.parent');
var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var spawn = require('commands.toSpawn');
var sources = require('commands.toSource');

function makePatrol(creep, simPatrol) {
    if (creep.room.memory.firstTracker === undefined) {
        creep.room.memory.firstTracker = 0;
    }
    creep.room.memory.firstTracker++;
    if (creep.room.memory.firstTracker > 1) {
        simPatrol.reverse();
        creep.room.memory.firstTracker = 0;
    }
    let pPath = [];
    for (var e in simPatrol) {
        if (e == simPatrol.length - 1) {
            let point = new RoomPosition(simPatrol[e][0], simPatrol[e][1], creep.room.name);
            let go = new RoomPosition(simPatrol[0][0], simPatrol[0][1], creep.room.name);
            let path = creep.room.findPath(point, go, { ignoreCreeps: true });
            pPath = pPath.concat(path);
        } else {
            let point = new RoomPosition(simPatrol[e][0], simPatrol[e][1], creep.room.name);
            let nxt = e++;
            let go = new RoomPosition(simPatrol[e][0], simPatrol[e][1], creep.room.name);
            let path = creep.room.findPath(point, go, { ignoreCreeps: true });
            pPath = pPath.concat(path);
            e--;
        }
    }
    return pPath;
}

function mineralContainerEmpty(creep) {
    if (creep.memory.containsGood) return false;
    if (creep.memory.mineralContainerID !== undefined) {
        let contains = creep.room.find(FIND_STRUCTURES);
        contains = _.filter(contains, function(o) {
            return o.structureType == STRUCTURE_CONTAINER;
        });

        for (var e in contains) {
            for (var a in contains[e].store) {
                if (a != RESOURCE_ENERGY && contains[e].store[a] > creep.stats.carry) {
                    creep.memory.mineralContainerID = contains[e].id;
                }
            }
        }
    }

    let contain = Game.getObjectById(creep.memory.mineralContainerID);
    if (creep.pos.isNearTo(contain)) {
        for (var o in contain) {
            creep.withdraw(contain, o);
        }
        return true;
    } else {
        creep.moveMe(contain, { reusePath: 15 });
        return true;
    }

    return false;
}

function isOnPath(creep) {
    let path = creep.memory.patrolpath;
    for (var e in path) {
        if (creep.pos.x == path[e].x && creep.pos.y == path[e].y) {
            return true;
        }
    }
    return false;
}

function goToMovePath(creep, patrol) {
    if (creep.memory.patrolpath === undefined) {
        creep.memory.patrolpath = makePatrol(creep, patrol);
    }
    // Creep will walk back to spawn until it matches one of those points
    var path = creep.memory.patrolpath; //spawn.room.findPath(spawn, source);
    let what = creep.moveByPath(path);

    switch (what) {
        case ERR_NOT_FOUND:
            if (creep.memory.pathClose === undefined) {
                let pos = [];
                var pathz = creep.memory.patrolpath;
                for (var e in pathz) {
                    pos.push(new RoomPosition(pathz[e].x, pathz[e].y, creep.room.name));
                }
                creep.memory.pathClose = creep.pos.findClosestByRange(pos);
            }
            creep.say('m');
            creep.moveTo(creep.memory.pathClose.x, creep.memory.pathClose.y);

            break;
        case OK:
            creep.memory.pathClose = undefined;
            break;
    }
}


function moveOnPath(creep) {
    var patrol;
    switch (creep.room.name) {
        case "E28S77":
            patrol = [
                [7, 20],
                [17, 18],
                [17, 14],
                [17, 11],
                [15, 8],
                [10, 8],
                [8, 12],
                [11, 14],
                [11, 16]
            ];
            goToMovePath(creep, patrol);
            return true;
        case "E26S73":
            patrol = [
                [33, 23],
                [25, 31],
                [28, 34],
                [31, 31],
                [35, 35],
                [40, 30]
            ];
            goToMovePath(creep, patrol);
            return true;

        case "E27S7z5":
            patrol = [
                [10, 30],
                [19, 34],
                [19, 26]
            ];
            goToMovePath(creep, patrol);
            return true;
        case "E38S72":
            patrol = [
                [23, 20],
                [26, 18],
                [37, 29],
                [37, 32],
                [35, 34],
                [35, 33],
                [30, 27]
            ];

            goToMovePath(creep, patrol);
            return true;
        case "E28S73":

            patrol = [
                [15, 28],
                [19, 30],
                [21, 34],
                [18, 38],
                [19, 40],
                [19, 43],
                [19, 45],
                [14, 41],
                [13, 36],
                [14, 29]
            ];
            goToMovePath(creep, patrol);
            return true;

        case "E26S77":
            goToMovePath(creep, [
                [13, 26],
                [13, 28],
                [11, 28],
                [3, 36],
                [2, 37],
                [2, 36],
                [5, 22],
                [11, 26]
            ]);
            return true;
        case "E37S75":
            goToMovePath(creep, [
                [11, 31],
                [25, 17],
                [27, 20],
                [13, 34]
            ]);
            return true;
        case "E35S73":
            goToMovePath(creep, [
                [36, 37],
                [34, 39],
                [31, 43],
                [35, 46],
                [39, 42],
                [43, 46],
                [46, 43],
                [44, 41],
                [46, 39],
                [44, 37],
                [45, 36],
                [43, 34],
                [44, 33],
                [43, 32],
                [42, 33],
                [41, 32],
                [40, 33],
                [37, 31],
                [35, 33]
            ]);
            return true;
        default:
            creep.memory.patrolpath = undefined;
            return false;
    }
}

function getEnergy(creep) {
    if (creep.room.name == "E27S75") {
        let tgt = Game.getObjectById('58c15b77dae08a9e411bb197');
        if (creep.withdraw(tgt, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(tgt);
            creep.say('E28');

        }

    } else if (creep.room.name == 'E35S83' ||
        creep.room.name == 'E35S73zz') {
        //                    if(!constr.moveToPickUpEnergy(creep,creep.carryCapacity-75)){
        if (!containers.withdrawFromTerminal(creep)) {
            if (!containers.withdrawFromStorage(creep)) {}
        }
        //                    }

    } else {
        if (creep.pos.isNearTo(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] !== 0) {
            creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
        } else {
            //                        if(!constr.moveToPickUpEnergy(creep,200)){
            //                            if(!containers.moveToWithdraw(creep)) {
            if (!containers.withdrawFromStorage(creep)) {
                if (!containers.withdrawFromTerminal(creep)) {
                    if (!containers.moveToWithdraw(creep)) {
                        if (!sources.moveToWithdraw(creep)) {}
                    }
                    //                      }
                }
            }
        }
        //                   } 

    }
}



function getExtenAm(creep) {
    switch (creep.room.controller.level) {
        case '7':
            return 100;
        case '8':
            return 200;
        default:
            return 50;
    }
}

function getExtendEnergy(creep) {
    let zz = creep.room.controller.level;
    if (zz == 7) return 100;
    if (zz == 8) return 200;
    return 50;
}

class roleFirst extends roleParent {

    static levels(level) {
        var total = 0;
        for (var e in Game.creeps) {
            if (Game.creeps[e].memory.role == 'first') {
                total++;
            }
        }
        if (total === 0) {
            return classLevels[0];
        } else if (level > classLevels.length - 1) level = classLevels.length - 1;

        return classLevels[level];
    }
    static run(creep) {
        if (creep.saying == 'noWork') {
            creep.say('zZzZ');
            return;
        }
        if (creep.saying == 'zZzZ') {
            creep.say('zZz');
            return;
        }
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        if (this.returnEnergy(creep)) {
            return false;
        }
        this.rebirth(creep);
        if (creep.memory.roleID === 0)
            if (super._power.getPowerToSpawn(creep)) return;
        if (super.depositNonEnergy(creep)) return;

        if (creep.memory.deposit === undefined) { creep.memory.deposit = false; }

        if (!creep.memory.deposit && creep.carry.energy > creep.carryCapacity - 75) {
            creep.memory.deposit = true;
            //spawn.newTarget(creep);
        }
        if (creep.room.name != creep.memory.home) {
            creep.moveTo(Game.getObjectById(creep.memory.parent));
            return;
        }
        if (creep.carry.energy < 50) {
            creep.memory.deposit = false;
        }
        //            console.log(creep.room.storage.total);

        /*if(creep.room.name == 'E38S72' && creep.memory.roleID == 0 ){
            creep.moveTo(38,35);
            if(_.sum(creep.carry) == 0){
                var stuff = creep.pos.findInRange(FIND_DROPPED_RESOURCES,5);
                creep.pickup(stuff[0]);
            } else {
                for(var e in creep.carry) {
                 creep.say(  creep.transfer(creep.room.terminal,e )  ) ;
                 break;
                }
            }
            return;
        } */

        if (!creep.memory.deposit) {

            constr.pickUpEnergy(creep);
            getEnergy(creep);

        } else {
            if (creep.room.energyAvailable == creep.room.energyCapacityAvailable || (creep.room.name == 'E37S75' && creep.room.energyAvailable == (creep.room.energyCapacityAvailable - 900))) {
                if (creep.room.powerspawn !== undefined && creep.room.powerspawn !== null) {
                    if (creep.room.powerspawn.energy > creep.room.powerspawn.energyCapacity - 1000) {
                        //                        if(!mineralContainerEmpty(creep))
                        creep.say('noWork');
                    } else {
                        if (creep.pos.isNearTo(creep.room.powerspawn)) {
                            creep.transfer(creep.room.powerspawn, RESOURCE_ENERGY);
                        } else {
                            creep.say('noWork');
                        }
                    }
                } else {
                    creep.say('noWork');
                }
            } else {
                if (!moveOnPath(creep)) {
                    if (!spawn.moveToTransfer(creep)) {}
                } else {
                    if (spawn.toTransfer(creep)) {
                        if (creep.carry[RESOURCE_ENERGY] < getExtendEnergy(creep) + 1) {
                            getEnergy(creep);
                        }
                    }
                }
            }

        }
    }
}

module.exports = roleFirst;
