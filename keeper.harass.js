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


    var players = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username) && o.owner.username != 'Invader' && o.owner.username != 'Source Keeper';
    });

    var sk = _.filter(bads, function(o) {
        return (o.owner.username == 'Invader' || o.owner.username == 'Source Keeper') && creep.pos.inRangeTo(o, 3);
    });
    if (sk.length > 0) return sk;

    return players;
}

function attackCreep(creep, bads) {

    if (bads.length === 0) {
        moveCreep(creep);
        creep.memory.needed = undefined;
        return true;
    }
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);

    if (bads.length == 2) {
        creep.rangedMassAttack();

    } else if (distance === 1) {
        creep.rangedMassAttack();
    } else if (distance < 4) {
        creep.rangedAttack(enemy);
    } else if (distance >= 4) {

    }

    if (creep.memory.run) {
        creep.moveToEdge();
    } else {
        if (distance < 3) {
            creep.runFrom(enemy);
        } else if (distance >= 4) {
            creep.moveTo(enemy);
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
            creep.memory.runAwayLimit = 4000;
        }

        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        creep.selfHeal();

        // Attack stuff.
        let bads = getHostiles(creep);
        attackCreep(creep, bads);

        if (creep.hits < creep.memory.runAwayLimit) {
            creep.memory.run = true;
        }
        if (creep.memory.run === undefined) {
            creep.memory.run = false;
        }
        if (creep.hits == creep.hitsMax) {
            creep.memory.run = false;
        }
        // Move stuff.
    }

}
module.exports = roleGuard;
