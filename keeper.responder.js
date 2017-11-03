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
    // lv 0 - 5500 50 parts
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        HEAL, MOVE, HEAL, HEAL, HEAL, HEAL, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK
    ],
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, HEAL,
        MOVE, HEAL, HEAL, HEAL, HEAL,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
    ]
];

var roleParent = require('role.parent');
var movement = require('commands.toMove');
var boost = [];
var fox = require('foxGlobals');

function getHostiles(creep) {
    let range = 15;
    let zzz = creep.pos.findInRange(creep.room.hostilesHere(), range);
    if (creep.room.name == 'E35S76') return [];

    if (creep.memory.playerCreepId !== undefined) {
        let plzy = Game.getObjectById(creep.memory.playerCreepId);
        if (plzy === null) {
            creep.memory.playerCreepId = undefined;
            zzz = _.filter(zzz, function(object) {
                return object.owner.username == 'Invader' || object.owner.username == 'Source Keeper';
            });

            return zzz;
        } else {
            return [plzy];
        }

    } else {
        let players = _.filter(zzz, function(object) {
            return !_.contains(fox.friends, object.owner.username) || object.owner.username !== 'Invader' || object.owner.username !== 'Source Keeper';
        });
        if (players.length > 0) {
            creep.memory.playerCreepId = players[0].id;
            return [players];
        }

        zzz = _.filter(zzz, function(object) {
            return object.owner.username == 'Invader' || object.owner.username == 'Source Keeper';
        });

        return zzz;
    }
    return [];
}


function getRangeAttacker(bads) {
    for (var e in bads) {
        let zzz = _.filter(bads[e].body, function(o) {
            return o.type == RANGED_ATTACK;
        });
        if (zzz.length > 0)
            return bads[e];
    }
    return bads[0];
}

function invasionAttack(creep, bads) {
    let distance = creep.pos.getRangeTo(enemy);
    //    var targets = creep.pos.findInRange(bads, 3);
    if (creep.pos.isNearTo(enemy)) {
        creep.rangedMassAttack();
        creep.attackMove(enemy);
    } else {
        creep.selfHeal();
        creep.moveTo(enemy);
        creep.rangedAttack(enemy);
    }
}

function invasionAttack(creep, bads) {
    //    let enemy = creep.pos.findClosestByRange(bads);
    if (creep.hits > 3000) {
        let enemy = getRangeAttacker(bads);
        //        creep.selfHeal(creep);
        let distance = creep.pos.getRangeTo(enemy);
        var targets = creep.pos.findInRange(bads, 3);
        if (creep.pos.isNearTo(enemy)) {
            creep.rangedMassAttack();
            creep.attack(enemy);
        } else if (targets.length > 1) {
            creep.selfHeal();
            creep.rangedMassAttack();
        } else if(distance < 4) {
            creep.selfHeal();
            creep.moveTo(enemy);
            creep.rangedMassAttack();
            //            creep.rangedAttack(enemy);
        } else if (distance >= 4){
            creep.selfHeal();
            creep.moveTo(enemy);
        }
    } else {
        creep.selfHeal();
        let enemy = getRangeAttacker(bads);
        creep.rangedAttack(enemy);
        if (bads.length > 0)
            if (bads[0] !== undefined && bads[0].owner !== undefined && bads[0].owner.username === 'Invader')
                creep.runFrom(bads);
    }
}

function SKAttack(creep, bads) {
    let enemy = creep.pos.findClosestByRange(bads);
    if (creep.memory.runAwayLimit === undefined) {
        creep.memory.runAwayLimit = creep.hitsMax * 0.33;
    }

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

function attackCreep(creep, bads) {

    // This one will in the just go after the guys with range attack.

    if (creep.memory.runAwayLimit === undefined) {
        creep.memory.runAwayLimit = 3000;
    }

    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }

    let enemy = creep.pos.findClosestByRange(bads);
    ///    console.log(enemy.is)
    if (enemy !== null) {
        /*        console.log(enemy.isNPC, 'isnpc', creep.pos);
                console.log(enemy.isEnemy, 'isEnemy');
                console.log(enemy.isFriend, 'isnpc'); */
    }
    if (enemy !== null && enemy.owner !== null && enemy.owner.username == 'Source Keeper') {
        SKAttack(creep, bads);
    }
    else {
        invasionAttack(creep, bads);
    }


}

function moveCreep(creep) {
    let pflag = Game.flags[creep.memory.party];
    if (!creep.pos.inRangeTo(pflag, 5)) {
        creep.moveMe(pflag);
        creep.countDistance();
    } else {
        creep.say('ZzZzZzZ');
        creep.countStop();
    }
}


class roleGuard extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {

        if (creep.saying == 'ZzZzZzZ') {
            creep.say('ZzZzZz');
            return;
        }
        if (creep.saying == 'ZzZzZz') {
            creep.say('ZzZzZ');
            return;
        }
        if (creep.saying == 'ZzZzZ') {
            creep.say('ZzZz');
            return;
        }
        if (creep.saying == 'ZzZz') {
            creep.say('ZzZ');
            return;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        super.rebirth(creep);

        let bads = getHostiles(creep);

        if (bads.length > 0) {
            attackCreep(creep, bads);
        } else {
            if (!movement.moveToDefendFlag(creep)) {
                moveCreep(creep);
            }
        }

    }


}
module.exports = roleGuard;
