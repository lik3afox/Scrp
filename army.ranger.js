// Back line
// Designed for shooting 

var classLevels = [
// Level 0
[MOVE, RANGED_ATTACK],
// Level 1 10/10
[MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
// Level 2 15/15
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK],
// Level 3 20/20
[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK],
// Level 4
[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL,],
// Level 5
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,], 
boost:[],
},
// Level 6
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,],    
boost:['KO'],
},
// Level 7
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,],    
boost:['XKHO2'],
},
// Level 8
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XZHO2', 'XKHO2'],
},
// Level 9

{
body:[],    
boost:[],
},
// Level 10
{
body:[TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XKHO2','XGHO2', 'XZHO2'],
},
// Level 11
{
body:[TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, RANGED_ATTACK,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XGHO2', 'XZHO2', 'XKHO2'],
},
// Level 12
{
body:[TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XGHO2', 'XZHO2', 'XKHO2'],
},
// Level 13
{
body:[],    
boost:[],
},

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
            /*            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].memory.wallTarget !== 'none') {
                            rangeAttack(creep, [Game.flags[creep.memory.party].memory.wallTarget]);
                            break;
                        } */
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
        creep.memory.death = creep.partyFlag === undefined;

        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);

        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
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
        if (super.rallyFirst(creep)) return;
        if (super.goToPortal(creep)) return;

//        if (!doAttack(creep)) {
  //      }
        creep.smartRangedAttack();

        creep.say(creep.memory.party);


        /*        if (creep.hits !== creep.hitsMax) {
                    if (super.edgeRun(creep)) {
                        return;
                    }
                }*/

creep.tuskenTo(creep.partyFlag,creep.memory.home,{reusePath:50});
        //movement.flagMovement(creep);
        //          }
    }


}
module.exports = rangerClass;