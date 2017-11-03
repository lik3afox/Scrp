// Back line
// Designed for shooting 

var classLevels = [
    [MOVE, RANGED_ATTACK],
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],

    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ],
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ]

];
var boost = [RESOURCE_LEMERGIUM_OXIDE, 'KO'];
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

                    //creep.rangedMassAttack();
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
        case "E52S67":
            rangeAttack(creep, ['588587458b65791f39f134c1']);

            break;

        case "E52S64":
            rangeAttack(creep, ['58a53db570b153574ac9cc5c', '5944cdbf65bb7e35247611a4']);
            break;
        case "E52S64":
            rangeAttack(creep, ['59511202d6fb6910572a40b5']);


            break;

        default:
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].memory.wallTarget !== 'none') {
                rangeAttack(creep, [Game.flags[creep.memory.party].memory.wallTarget]);
                break;
            }
            rangeAttack(creep, ['59511202d6fb6910572a40b5']);

            bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });

            if (bads.length > 2) {
                creep.rangedMassAttack();

            } else {
                if (bads[0] !== undefined) {
                    if (creep.pos.isNearTo(bads[0])) {
                        creep.rangedMassAttack();
                    } else if (creep.pos.inRangeTo(bads[0], 3)) {
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
        if (creep.memory.level >= 2)
            if (super.boosted(creep, ['XZHO2', 'XGHO2', 'XKHO2'])) {
                return;
            }
        if (super.spawnRecycle(creep)) {
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


        /*        if (creep.hits !== creep.hitsMax) {
                    if (super.edgeRun(creep)) {
                        return;
                    }
                }*/


        movement.flagMovement(creep);
        //          }
    }


}
module.exports = rangerClass;
