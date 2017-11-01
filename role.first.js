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
    [CARRY, MOVE, CARRY, MOVE, WORK], // 300

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, MOVE], // 550

    [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // 800

    [MOVE,CARRY, CARRY,  MOVE, CARRY, CARRY, MOVE,CARRY, CARRY, MOVE,CARRY, CARRY, MOVE, MOVE,  CARRY, CARRY,
    MOVE,CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,  CARRY, CARRY, CARRY   ], //1300
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
/*
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
    if (contain !== null) {
        if (creep.pos.isNearTo(contain)) {
            for (var o in contain) {
                creep.withdraw(contain, o);
            }
            return true;
        } else {
            creep.moveMe(contain, { reusePath: 15 });
            return true;
        }

    }

    return false;
} */

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
                var e = pathz.length;
                while (e--) {
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
    if (creep.room.memory.alert) return false;
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
        default:
            creep.memory.patrolpath = undefined;
            return false;
    }
}

function getEnergy(creep) {
    if (creep.pos.isNearTo(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] !== 0) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    } else {
        if (!containers.withdrawFromStorage(creep)) {
            if (!containers.withdrawFromTerminal(creep)) {
                if (!containers.moveToWithdraw(creep)) {
                    if (!constr.moveToPickUpEnergyIn(creep, 2)) {
                        if (!constr.moveToPickUpEnergy(creep,creep.memory.roleID * 40)+300 ) {
                            if (!sources.moveToWithdraw(creep)) {

                            }
                        }
                    }
                }
            }
        }
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
    //    if(creep.memory.roleID === 0 &&  (creep.room.name == 'E25S37'||creep.room.name == 'E17S45' ) &&  super.fillLabForBoost(creep)){
  //          return;
//        }
 if(creep.memory.roleID === 0 &&creep.room.name == 'E25S27'){
    let zz= Game.getObjectById('59c7cc38c354a34c538569de');
    if(zz !== null && zz.energy < 1000 && creep.carryTotal !== 0){
       if(creep.pos.isNearTo(zz)){
        creep.transfer(zz,RESOURCE_ENERGY);
       } else {
		creep.moveTo(zz);       	
       }
        return;
    }

 }
// if(creep.memory.roleID > 1) {
//    console.log(roomLink( creep.room.name), creep.ticksToLive,creep.memory.deathCount);
// }

        
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

        if (!creep.memory.deposit && creep.carryTotal > creep.carryCapacity - 5) {
            creep.memory.deposit = true;
            //spawn.newTarget(creep);
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

            constr.pickUpEnergy(creep);
            getEnergy(creep);

        } else {
            if (creep.room.energyAvailable == creep.room.energyCapacityAvailable ) {         
                        creep.say('noWork');
                        return;
            }
/*            if (creep.room.name != 'E23S75' && creep.room.energyAvailable == creep.room.energyCapacityAvailable || (creep.room.name == 'E37S75' && creep.room.energyAvailable == (creep.room.energyCapacityAvailable - 900))) {
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
            } else {*/
                if (!moveOnPath(creep)) {
                    if (!spawn.moveToTransfer(creep)) {

                    } else {

                    }
                } else {
                    if (spawn.toTransfer(creep)) {
                        if (creep.carry[RESOURCE_ENERGY] < getExtendEnergy(creep) + 1) {
                            getEnergy(creep);
                        }
                    }
                }
//            }

        }
    }
}

module.exports = roleFirst;