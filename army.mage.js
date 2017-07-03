// Back line
// Designed for shooting 

var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL]
];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

//STRUCTURE_POWER_BANK:

function rangeAttack(creep, targets) {
    var E18S64targets = targets;
    var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    bads = _.filter(bads, function(o) {
        return !o.pos.lookForStructure(STRUCTURE_RAMPART) && !_.contains(fox.friends, o.owner.username);
    });
    if (bads.length === 0) {

        for (var a in E18S64targets) {
            target = Game.getObjectById(E18S64targets[a]);
            if (target !== null) {
                if (creep.pos.isNearTo(target)) {
                    creep.rangedMassAttack();
                    creep.say('nice');
                    return true;
                } else if (creep.pos.inRangeTo(target, 3)) {
                    creep.rangedAttack(target);
                    creep.say('nice');
                    return true;
                }
            }
        }
        creep.rangedMassAttack();

    } else {
        var clost = creep.pos.findClosestByRange(bads);
        if (clost !== undefined) {
            if (creep.pos.inRangeTo(clost, 3)) {
                if (creep.pos.isNearTo(clost)) {
                    //creep.rangedAttack(bads[0]);
                    creep.rangedMassAttack();
                } else {

                    creep.rangedMassAttack();
                    //                    creep.rangedAttack(clost);
                }
                creep.say('pewpew', true);
            }
        }
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

        if (bads.length > 2) {
            creep.rangedMassAttack();

        } else {
            if (bads[0] !== undefined) {
                if (creep.pos.inRangeTo(bads[0], 3)) {
                    creep.rangedAttack(bads[0]);
                    creep.say('pewpew', true);
                    return true;
                }
            }
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

        if (super.returnEnergy(creep)) {
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
        //      creep.heal(creep);
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
