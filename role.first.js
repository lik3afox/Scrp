var classLevels = [
    [CARRY, MOVE, CARRY, MOVE, CARRY, CARRY], // 300

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, MOVE], // 550

    [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // 800

    [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY,
        MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY
    ], //1300
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

];

var roleParent = require('role.parent');

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

function isOnPath(creep) {
    let path = creep.memory.patrolpath;
    var e = path.length;
    while (e--) {
        if (creep.pos.x == path[e].x && creep.pos.y == path[e].y) {
            return true;
        }
    }
    return false;
}

function goToMovePath(creep, patrol) {
    if (creep.memory.patrolpath === undefined) {
        creep.memory.patrolpath = Room.serializePath(makePatrol(creep, patrol));
        //        creep.memory.patrolpath = makePatrol(creep, patrol);
    }
    // Creep will walk back to spawn until it matches one of those points
    var path = creep.memory.patrolpath; //spawn.room.findPath(spawn, source);
    path = _.isString(path) ? Room.deserializePath(path) : path;
    let what = creep.moveByPath(path);

    switch (what) {
        case ERR_NOT_FOUND:
            if (creep.memory.pathClose === undefined) {
                let pos = [];
                var e = path.length;
                while (e--) {
                    pos.push(new RoomPosition(path[e].x, path[e].y, creep.room.name));
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
    if (creep.room.memory.alert) return false;
    switch (creep.room.name) {
        case "E32S34x":
            patrol = [
                [39, 32],
                [32, 24],
                [34, 22],
                [41, 29],
            ];
            goToMovePath(creep, patrol);
            return true;
        case "E23S38":
            patrol = [
                [27, 8],
                [22, 13],
                [28, 20],
                [31, 20],
                [32, 19],
                [30, 17],
                [28, 9],
                [31, 6],
                [30, 5],

            ];
            goToMovePath(creep, patrol);
            return true;
        default:
            creep.memory.patrolpath = undefined;
            return false;
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
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
        if (creep.room.memory.simple) {
            creep.memory.reportDeath = true;
        }
        super.rebirth(creep);
        if (super.baseRun(creep)) {
            return;
        }
        if (creep.room.name == 'E24S33') {
            let nuke = Game.getObjectById('5a2c7974840ab15db16dc7a3');
            if (nuke !== null) {
                if (nuke.timeToLand < 50) {
                    creep.say(creep.moveTo(Game.flags.Flag1.pos));
                    return;
                }
            }
        }

        if ((creep.room.energyAvailable == creep.room.energyCapacityAvailable && Game.shard.name == 'shard0') ||
            (creep.room.energyAvailable == creep.room.energyCapacityAvailable && creep.room.name == 'E18S46')) {
            require('role.linker').run(creep);
            return;
        }


        if (creep.memory.deposit === undefined) { creep.memory.deposit = false; }

        if (!creep.memory.deposit && creep.carryTotal > creep.carryCapacity - 5) {
            creep.memory.deposit = true;
        }
        if (creep.room.name != creep.memory.home) {
            let zzz = Game.getObjectById(creep.memory.parent);
            if (zzz !== null)
                creep.moveTo(zzz);
            return;
        }
        if (creep.carry.energy === 0) {
            creep.memory.deposit = false;
        }

        if (!creep.memory.deposit) {

            if (creep.room.name == 'E33S54' && creep.room.controller.level !== 8) {
                if (!super.containers.withdrawFromTerminal(creep)) {}
                return;
            }

            if (creep.pos.isNearTo(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] !== 0) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            } else if (creep.pos.isNearTo(creep.room.terminal) && creep.room.terminal.store[RESOURCE_ENERGY] !== 0) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            } else {
                if (!super.containers.withdrawFromStorage(creep)) {
                    if (!super.containers.withdrawFromTerminal(creep)) {
                        if (!creep.moveToPickUp(FIND_DROPPED_RESOURCES, creep.memory.roleID * 40)) {}
                    }
                }
            }




        } else {
            if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
                if (creep.pos.isEqualTo(Game.flags[creep.memory.home])) {
                    creep.moveTo(creep.room.controller);
                }
                creep.sleep();
                return;
            }
            if (!moveOnPath(creep)) {
                if (!super.spawns.moveToTransfer(creep)) {

                }
            } else {
                if (super.spawns.toTransfer(creep)) {
                    if (creep.carry[RESOURCE_ENERGY] < getExtendEnergy(creep) + 1) {
                        super.containers.withdrawFromStorage(creep);
                    }
                }
            }
        }
    }
}

module.exports = roleFirst;