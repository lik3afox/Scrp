// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.420K
//[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE]
/*/
[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE],
*/
// only 1 level and 
// 800 Sets
var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL]
];

var roleParent = require('role.parent');
var movement = require('commands.toMove');
var fox = require('foxGlobals');




function getHostiles(creep) {
    let bads = creep.room.find(FIND_HOSTILE_CREEPS);
    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });
    return bads;
}

function attackCreep(creep, bads) {

    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }
    if (creep.hits < creep.memory.runAwayLimit) {
        creep.memory.run = true;
    }

    let enemy = creep.pos.findClosestByRange(bads);

    let distance = creep.pos.getRangeTo(enemy);
    if (bads.length == 2) {
        if (creep.pos.isNearTo(enemy)) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
    } else if (distance < 4) {

        var targets = creep.pos.findInRange(bads, 3);
        creep.rangedAttack(enemy);
        creep.moveToEdge();

    } else if (distance >= 4) {
        if (!creep.memory.getaway) {
            creep.moveMe(enemy, { maxRooms: 1 });
        }

    }

}

function moveCreep(creep) {
    movement.flagMovement(creep);
}


class roleGuard extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (creep.memory.runAwayLimit === undefined) {
            creep.memory.runAwayLimit = 3000;
        }

        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        if (creep.memory.run) {
            creep.moveToEdge();
            if (creep.hits == creep.hitsMax) {
                creep.memory.run = false;
            }
        } else {
            moveCreep(creep);
        }
        creep.selfHeal();
        let bads = getHostiles(creep);
        if (bads.length > 0) {
            attackCreep(creep, bads);
        }
    }

}
module.exports = roleGuard;
