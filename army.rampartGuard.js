// Rampart Fighter

var classLevels = [
    [
        ATTACK, MOVE, ATTACK,
        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK, ATTACK,
        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK, ATTACK,
        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK, ATTACK,

        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK, ATTACK,
        ATTACK, MOVE, ATTACK,

        MOVE, ATTACK, ATTACK,
        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK, ATTACK,

        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK, ATTACK,
        ATTACK, MOVE, ATTACK,
        MOVE, ATTACK
    ],
    [MOVE, ATTACK, RANGED_ATTACK, MOVE]

];
var boost = ['XUH2O'];
var movement = require('commands.toMove');

var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
function getBoostTough(body) {
    let toughness = 0;
    var e = body.length;
    while (e--) {
        if (body[e].type == TOUGH && body[e].boost !== undefined) {
            toughness++;
        }
    }
    return toughness;
}

function toughOutThere(enemies) {
    var toughMax = 0;

    for (var e in enemies) {
        if (toughMax < getBoostTough(enemies[e].body)) {
            toughMax = getBoostTough(enemies[e].body);
        }
    }
    return toughMax;
}

function findAttacker(enemies) {
    count = 0;
    for (var e in enemies) {
        for (var a in enemies[e].body) {
            if (enemies[e].body[a].type == ATTACK || enemies[e].body[a].type == RANGED_ATTACK)
                count++;

        }
    }
    if (count === 0) return false;
    return count;
}
class fighterClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {

        if (super.returnEnergy(creep)) {
            return;
        }
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        var bads = creep.room.find(FIND_HOSTILE_CREEPS);
        var tLevel = toughOutThere(bads);
        if (creep.ticksToLive > 500 && tLevel > 15) {
            if (super.boosted(creep, boost)) {
                //                creep.memory.boosted = true;
                creep.memory.boostFighting = true;
                return;
            }
        }

        if (creep.ticksToLive < 1250 && bads.length === 0) {
            creep.memory.death = true;
        }

        if (creep.memory.boostFighting) {
            if (bads.length === 0) {
                // Lets wait 100 ticks then kill self.
                if (creep.memory.countDown === undefined)
                    creep.memory.countDown = 50;
                creep.memory.countDown--;
                if (creep.memory.countDown < 0) {
                    creep.say('death:(');
                    creep.memory.death = true;
                }
                //                here we will decide to kill this dude.
            }
        }
        var enemy = creep.pos.findInRange(bads, 3);

        if (enemy.length > 0) {
            enemy = creep.pos.findClosestByRange(enemy);
            var zzz = findAttacker(bads);
            //            creep.say(zzz);
            if (!zzz) {
                if (creep.pos.isNearTo(enemy)) {
                    creep.attackMove(enemy);
                } else {
                    creep.moveTo(enemy);
                    return;
                }

            }
            /*else if (enemy.length === 2 && zzz === 1) {
                           if (creep.pos.isNearTo(enemy)) {
                               creep.attackMove(enemy);
                           } else {
                               creep.moveTo(enemy);
                               return;
                           }
                       }*/
            else {
                if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                    //                creep.say('ahh', enemy);
                }
            }
        }

        var flag = Game.flags[creep.memory.party];
        if (flag !== undefined) {
            if (!creep.pos.isEqualTo(flag)) {
                creep.moveMe(flag, {
                    ignoreCreeps: true,
                    visualizePathStyl: {
                        stroke: '#fa0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.1,
                        opacity: 0.5
                    }
                });
            }
        }
        //       movement.flagMovement(creep);

        if (creep.memory.formationPos !== 0) {
            creep.memory.formationPos = 0;
        }
    }
}

module.exports = fighterClass;
