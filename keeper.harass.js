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
    [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
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
            creep.moveTo(Game.flags[creep.memory.party]);
        } else if (distance >= 4) {
            creep.moveTo(enemy);
        }
    }


}

function moveCreep(creep) {
    var zz = require('role.parent');
    if (!zz.avoidArea(creep)) {
        if (creep.room.name == 'E11S36x') {
            var site = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
            site = _.filter(site, function(o) {
                return !o.pos.lookForStructure(STRUCTURE_RAMPART);
            });
            creep.say(site.length);
            if (site.length > 0) {
                var zzz = creep.pos.findClosestByRange(site);
                creep.moveTo(zzz);
            } else {
                movement.flagMovement(creep);
            }
        } else {
                movement.flagMovement(creep);
        }
    }
}


class roleGuard extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (creep.memory.runAwayLimit === undefined) {
            creep.memory.runAwayLimit = 1900;
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
        if(creep.room.name == 'E12S34') {
            if(bads.length === 0) {
                creep.killBase();
                return;
            }
        }
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