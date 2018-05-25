var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, CARRY, RANGED_ATTACK, ATTACK, HEAL], // 0
    [MOVE, MOVE, MOVE, MOVE, CARRY, RANGED_ATTACK, ATTACK, HEAL], // 1
    [MOVE, MOVE, MOVE, MOVE, CARRY, RANGED_ATTACK, ATTACK, HEAL], // 2
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL], // 3
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL], // 4

    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],

    //6  48/4030
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],

    //7
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,  MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, HEAL, HEAL, HEAL
    ]
];
var fox = require('foxGlobals');

function attackCreep(creep, bads) {
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);

    if (creep.pos.isNearTo(enemy)) {
        creep.say('attk' + creep.attack(enemy));
        creep.attack(enemy);
        if (enemy.owner.username != 'Invader') {
            creep.rangedAttack(enemy);
        } else {
            creep.rangedMassAttack();
        }


    } else if (distance < 4) {

        var targets = creep.pos.findInRange(creep.room.hostilesHere(), 3);

        // Ranged attack.
        if (targets.length > 2) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
        // Heal
        creep.heal(creep);
        // Move
        creep.moveTo(enemy, {
            maxOpts:300,
            maxRooms: 1
        });
    } else if (distance >= 4) {
        creep.heal(creep);
        creep.moveTo(enemy, {
            maxOpts:300,
            maxRooms: 1
        });
    }
}

function getHostiles(creep) {
    //!_.contains(fox.friends, creep.owner.username);
    //    var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
    var bads = creep.room.find(FIND_HOSTILE_CREEPS);
    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });
    return bads;
}

var roleParent = require('role.parent');

class roleNewDefender extends roleParent {
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
        // So this guy will stay by his spawn
        if (creep.memory.renewSpawnID === undefined &&  creep.room.alphaSpawn !== undefined) {
            creep.memory.renewSpawnID = creep.room.alphaSpawn.id;
            var ccSpawn = require('commands.toSpawn');
//            ccSpawn.newWantRenew(creep);
        }
        if (super.spawnRecycle(creep)) {
            return;
        }

        if (super.movement.moveToDefendFlag2(creep)) {

            let badzs = getHostiles(creep);
            if (badzs.length > 0) {
            creep.say('nDef' + badzs.length);
                attackCreep(creep, badzs);
            }

            return true;
        } else { // go to mom and renew
            let badzs = getHostiles(creep);
            if (badzs.length > 0) {
            creep.say('nDef' + badzs.length);
                attackCreep(creep, badzs);
                return true;
            }

            if (creep.hits < creep.hitsMax) creep.heal(creep);
            if (creep.carryTotal > 0 && creep.isHome) {
                creep.moveToTransfer(creep.room.terminal === undefined ? creep.room.storage : creep.room.terminal, creep.carrying);
                return;
            } else if (!creep.isHome) {
                if (super.constr.withdrawFromTombstone(creep, 5, false)) return true;
            } 
                let mom = Game.rooms[creep.memory.home].alphaSpawn;
                if (mom !== null) {
                    if (creep.pos.isNearTo(mom)) {
                        creep.sleep(5);
                    } else {
                        creep.moveTo(mom);
                    }
                }
            
        }

    }



}
module.exports = roleNewDefender;