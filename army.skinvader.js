var classLevels = [
 [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL]
];
//var boost = ['UH'];
var movement = require('commands.toMove');

var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:


function getHostiles(creep) {
    let range = 10;
    return creep.pos.findInRange(creep.room.hostilesHere(), range);

}

function attackCreep(creep, bads) {

    if (creep.memory.runAwayLimit === undefined) {
        creep.memory.runAwayLimit = creep.hitsMax * 0.33;
    }

    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }

    let enemy = creep.pos.findClosestByRange(bads);

    creep.selfHeal(creep);
    let distance = creep.pos.getRangeTo(enemy);
    if (bads.length == 2) {
        if (creep.pos.isNearTo(enemy)) {
            creep.rangedMassAttack();
        } else {
            creep.moveMe(enemy);
            creep.rangedAttack(enemy);
        }
    } else if (distance < 4) {

        var targets = creep.pos.findInRange(bads, 3);
        if (creep.hits < creep.memory.runAwayLimit) {
            creep.memory.getaway = true;
        }

        if (bads.length)
            if (creep.memory.getaway || distance < 3) {
                creep.runFrom(bads);
            }
        creep.rangedAttack(enemy);

    } else if (distance >= 4) {
        if (!creep.memory.getaway) {
            creep.moveMe(enemy, { maxRooms: 1 });
        }

    }

    if (creep.memory.getaway && creep.hits == creep.hitsMax) {
        creep.memory.getaway = false;
    }
}
function moveCreep(creep) {


}
class fighterClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {

        creep.say('fight');
        if (super.returnEnergy(creep)) {            return;        }
        if (super.doTask(creep)) {            return;        }
        creep.memory.throughPortal = false;
        if (super.goToPortal(creep)) return;

            let bads = getHostiles(creep);

            if (bads.length > 0) {
                attackCreep(creep, bads);
            } else {
                creep.selfHeal();
                moveCreep(creep);
            }
    }
}

module.exports = fighterClass;
