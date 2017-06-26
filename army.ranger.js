// Back line
// Designed for shooting 

var classLevels = [
    [MOVE, RANGED_ATTACK],
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ]

];
var boost = [RESOURCE_LEMERGIUM_OXIDE, 'KO'];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:

function rangeAttack(creep, targets) {
    var E18S64targets = targets;
    var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    bads = _.filter(bads, function(o) {
        return !o.pos.lookForStructure(STRUCTURE_RAMPART);
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

                    creep.rangedAttack(clost);
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
        case "E18S64":
            var E18S64targets = ['594b6b86c48f3ee4074cb8a5', '594ef7bdd73cce6432e3b586', '58be88cc436155731968483e', '58d9bd5f8f81ea7c04bda21f'];
            var badz = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
            bads = _.filter(badz, function(o) {
                return o.getActiveBodyparts(ATTACK) === 0;
            });

            if (badz.length === 0) {

                for (a in E18S64targets) {
                    target = Game.getObjectById(E18S64targets[a]);
                    if (target !== null) {
                        if (creep.pos.isNearTo(target)) {
                            creep.rangedMassAttack();
                            return true;
                        } else if (creep.pos.inRangeTo(target, 3)) {
                            creep.rangedAttack(target);
                            return true;
                        }
                    }
                }
                creep.rangedMassAttack();

            } else {
                var clost = creep.pos.findClosestByRange(bad2s);
                if (clost !== undefined) {
                    if (creep.pos.inRangeTo(clost, 3)) {
                        if (creep.pos.isNearTo(clost)) {
                            //creep.rangedAttack(bads[0]);
                            creep.rangedMassAttack();
                        } else {

                            creep.rangedAttack(clost);
                        }
                        creep.say('pewpew', true);
                    }
                }
            }
            break;

        case "E16S63":
            rangeAttack(creep, ['58c8bbce6caaa767129ed296']);


            break;

        default:
            bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
            bads = _.filter(bads, function(o) {
                return o.owner.username != 'daboross' && o.owner.username != 'baj';
            });

            if (bads.length > 2) {
                creep.rangedMassAttack();

            } else {
                if (bads[0] !== undefined) {
                    if (creep.pos.inRangeTo(bads[0], 3)) {
                        creep.rangedAttack(bads[0]);
                        creep.say('pewpew', true);
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
        if (creep.memory.level == 1)
            if (super.boosted(creep, ['XZHO2', 'XGHO2', 'XKHO2'])) {
                return;
            }
        if (super.returnEnergy(creep)) {
            return;
        }

        if (creep.pos.isNearTo(Game.flags.kill)) {
            creep.memory.waypoint = false;
        }

        if (super.doTask(creep)) {
            return;
        }

        creep.say(creep.memory.party);

        //      creep.heal(creep);
        //var defendFlag = movement.
        //      var enemy = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
        //      if(enemy.length > 0) {
        //      } 
        doAttack(creep);
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
