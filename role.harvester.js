// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    [WORK, WORK, CARRY, MOVE], // 300
    [WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [MOVE, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE], // 550
    [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], // 550
    [MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE] // 550
];

var roleParent = require('role.parent');
var sources = require('commands.toSource');
var containers = require('commands.toContainer');
var spawns = require('commands.toSpawn');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');
var link = require('build.link');

function moveToWithdraw(creep) {

    let source = Game.getObjectById(creep.memory.sourceID);
    if (source === null) {
        var total = creep.room.find(FIND_SOURCES);
        for (var z in total) {
            let otherHasIt = false;
            for (var e in Game.creeps) {
                if (Game.creeps[e].memory.role == creep.memory.role && Game.creeps[e].memory.sourceID == total[z].id) {
                    otherHasIt = true;
                }
            }
            if (!otherHasIt) {
                creep.memory.sourceID = total[z].id;
                break;
            }
        }
        // if none has been assigned that means that it's all full so give it an random one!
        if (creep.memory.sourceID === undefined) {
            let rando = Math.floor(Math.random() * total.length);
            creep.memory.sourceID = total[rando].id;
            source = total[rando];
        }
    }

    if (creep.pos.isNearTo(source)) {
        if (creep.harvest(source) == OK) {
            creep.memory.isThere = true;
            creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                color: 'white',
                align: LEFT,
                font: 0.6,
                strokeWidth: 0.75
            });
        }
    } else {
        creep.moveMe(source);
        creep.memory.distance++;
        return false;
    }

    return true;
}

function depositSpawn(creep) {
    if (creep.memory.renewSpawnID !== undefined) {
        let spawnz = Game.getObjectById(creep.memory.renewSpawnID);
        if (spawnz !== null && spawnz.energy < spawnz.energyCapacity - creep.stats.carry) {
            creep.transfer(spawnz, RESOURCE_ENERGY);
            return true;
        }
    }
    return false;
}

function depositContain(creep) {
    var conta;
    if (creep.room.name == 'E29S79') console.log(creep.memory.containerID);
    if (creep.memory.containerID === undefined) {
        let contain = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (contain.length !== 0) {
            creep.memory.containerID = contain[0].id;
            conta = contain[0];
        }
    }
    if (conta === undefined) conta = Game.getObjectById(creep.memory.containerID);
    if (conta !== null) {
        creep.transfer(conta, RESOURCE_ENERGY);
        return true;
    } else {
        return false;
    }

}

class roleHarvester extends roleParent {

    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);

        if (creep.memory.containerID !== undefined || creep.memory.linkID !== undefined)
            creep.pickUpEnergy();

        if (creep.memory.distance === undefined) { creep.memory.distance = 0; }
        if (creep.memory.isThere === undefined) { creep.memory.isThere = false; }
        super.rebirth(creep);
        if (super.returnEnergy(creep)) {
            return;
        }
        if (creep.memory.level > 1) super.renew(creep);

        if (creep.carry.energy > creep.carryCapacity - creep.stats.mining) {
            if (super.depositNonEnergy(creep)) return;
            if (!link.deposit(creep)) {
                if (!depositSpawn(creep)) {
                    depositContain(creep);
                }
            }
        }
        moveToWithdraw(creep);
    }
}

module.exports = roleHarvester;
