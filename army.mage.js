// Back line
// Designed for shooting 


var classLevels = [
// Level 0
[MOVE, HEAL,MOVE, RANGED_ATTACK],
// Level 1 10/10
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL],
// Level 2 15/15
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
// Level 3 20/20
[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
// Level 4
[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,],
// Level 5
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:[],
},
// Level 6
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:['KO','LO'],
},
// Level 7
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:['XKHO2','XLHO2'],
},
// Level 8
{
body:[RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:['XZHO2', 'XKHO2','XLHO2'],
},
// Level 9

{
body:[],    
boost:['XGHO2', 'XKHO2','XLHO2'],
},
// Level 10
{
body:[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],  
boost:['XKHO2','XLHO2','XGHO2', 'XZHO2'],
},
// Level 11
{
body:[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],    
boost:['XGHO2', 'XZHO2', 'XKHO2','XLHO2'],
},
// Level 12
{
body:[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE], 
boost:['XGHO2', 'XZHO2','XKHO2','XLHO2'],
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

function banditAction(creep) {
    creep.memory.reportDeath = true;

    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            creep.rangedMassAttack();

            good = creep.room.find(FIND_MY_CREEPS);
            good = _.filter(good, function(o) {
                return o.id !== creep.id && o.getActiveBodyparts(ATTACK) > 0 && o.memory.party === creep.memory.party;
            });
//            good.sort((a, b) => a.hits - b.hits);
            if (good.length > 0) {
                if(creep.pos.isNearTo(good[0])){
                    creep.move(creep.pos.getDirectionTo(good[0]));
                } else {
                    
                    creep.moveTo(good[0],{reusePath:50});
                }

                if ( creep.hits < creep.hitsMax ) {
                    creep.selfHeal();
                } else {
                    if(creep.pos.isNearTo(good[0])){                    
                        creep.heal(good[0]);
                    } else {
                        creep.rangedHeal(good[0]);    
                    }

                }
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

        default: 
        bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
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
            let zz = Game.getObjectById( creep.partyFlag.memory.target );
            if(zz !== null) {
                if(creep.pos.inRangeTo(zz,3)){
                    creep.rangedAttack(zz);
                    return;
                }
            }
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
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if( _.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level]) ) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {

        if (super.spawnRecycle(creep)) {
        	creep.selfHeal();
            return;
        }
        if (creep.ticksToLive > 1495 &&  creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (creep.memory.party == 'bandit') {
            super.rebirth(creep);
            creep.say('bandit');
            banditAction(creep);
            if (Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
            return;
        }

        if (super.goToPortal(creep)) return;
        if (super.rallyFirst(creep)) return;
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
                creep.rangedAttack(roads[0]);
            }
        }

        creep.say(creep.memory.party);
        creep.selfHeal();

        //creep.heal(creep);
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