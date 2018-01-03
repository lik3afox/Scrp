// Back line
// Designed for shooting 

var classLevels = [


    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL],
    [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL],
];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

//STRUCTURE_POWER_BANK:

function banditAction(creep) {
    creep.memory.reportDeath = true;

    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {

            good = creep.room.find(FIND_MY_CREEPS);
            good = _.filter(good, function(o) {
                return o.id !== creep.id && o.getActiveBodyparts(ATTACK) > 0;
            });
            good.sort((a, b) => a.hits - b.hits);
            creep.say(good.length + 'xxx');
            if (good.length > 0) {
                if (!creep.pos.isNearTo(good[0])) {
                    creep.moveTo(good[0]);
                }
                creep.heal(good[0]);
                creep.rangedMassAttack();
                return true;
            }

        }
        movement.flagMovement(creep);
    }
}

function doAttack(creep) {
    let target;
    var bads;
    var a;
    switch (creep.room.name) {

        default: bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
        bads = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username);
        });

        if (bads.length === 1) {
            if (bads[0] !== undefined) {
                if (creep.pos.inRangeTo(bads[0], 3)) {
                    creep.rangedAttack(bads[0]);
                    creep.say('pewpew', true);
                    return true;
                }
            }
        } else {
            creep.rangedMassAttack();
        }
        break;

    }
    return false;
}

function getDefendFlag() {
    for (var a in Game.flags) {
        if (Game.flags[a].color == COLOR_RED) {
            return Game.flags[a];
        }
    }
    return false;
}
class rangerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length) level = classLevels.length;
        return classLevels[level];
    }

    static run(creep) {

        if (super.spawnRecycle(creep)) {
            return;
        }
        if(creep.memory.level > 1) {
        //        if (super.boosted(creep, ['XGHO2'])) {
        //              return;
        //            }
        }
        if (creep.memory.party == 'bandit') {
            super.rebirth(creep);
            creep.say('bandit');
            banditAction(creep);
            if (Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
            return;
        }

        if (super.goToPortal(creep)) return;
        if (creep.pos.isNearTo(Game.flags.kill)) {
            creep.memory.waypoint = false;
        }

        if (super.doTask(creep)) {
            return;
        }

        if (!doAttack(creep)) {
            if (creep.room.name == 'W5S34') {
                var roads = creep.pos.findInRange(FIND_STRUCTURES, 3);
                console.log("ROD", roads.length);
                roads = _.filter(roads, function(o) {
                    return o.structureType == STRUCTURE_ROAD || o.structureType == STRUCTURE_CONTAINER;
                });
                console.log("ROD", roads.length);
                console.log(creep.rangedAttack(roads[0]));
            }
        }

        creep.say(creep.memory.party);
        creep.heal(creep);
        //var defendFlag = movement.
        /*              */
        //      if(enemy.length > 0) {
        //      } 

        //else   { 
        if (creep.hits !== creep.hitsMax) {
            if (super.edgeRun(creep)) {
                return;
            }
        }


        movement.flagMovement(creep);
        //          }
    }


}
module.exports = rangerClass;