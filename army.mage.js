// Back line
// Designed for shooting 


var classLevels = [
    // Level 0
    [MOVE, HEAL, MOVE, RANGED_ATTACK],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE,RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
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
        HEAL, HEAL, HEAL, HEAL, HEAL,
    ],
    // Level 5
    {
        body: [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
        ],
        boost: [],
    },
    // Level 6
    { //this will take on 1 tower.
        body: [TOUGH, TOUGH, TOUGH,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['XKHO2', 'XLHO2', 'XGHO2'],
    },
    // Level 7
    { // This can be created by RCL 7 
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['XKHO2', 'XLHO2', 'XGHO2', 'XZHO2'],
    },
    // Level 8
    { // This will take on 1 tower. 

        body: [TOUGH, TOUGH, TOUGH,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['XKHO2', 'XLHO2', 'XGHO2'],
    },
    // Level 9

    {
        body: [],
        boost: ['XGHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        boost: ['XKHO2', 'XLHO2', 'XGHO2', 'XZHO2'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        boost: ['XGHO2', 'XZHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        boost: ['XGHO2', 'XZHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 13
    {
        body: [HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['XKHO2', 'XLHO2',  'XZHO2'],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

//STRUCTURE_POWER_BANK:

function banditAction(creep) {
    creep.memory.reportDeath = true;

    if (Game.flags[creep.memory.party] !== undefined) {
        //        creep.rangedMassAttack();
        //        creep.smartHeal();
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            good = creep.room.find(FIND_MY_CREEPS);
            good = _.filter(good, function(o) {
                return o.memory.role === 'fighter';
            });
            if (good.length > 0) {
                if (creep.pos.isNearTo(good[0])) {
                    creep.move(creep.pos.getDirectionTo(good[0]));
                } else {

                    creep.moveTo(good[0], { reusePath: 50 });
                }

                if (creep.hits < creep.hitsMax) {
                    creep.selfHeal();
                } else {
                    if (creep.pos.isNearTo(good[0])) {
                        if (creep.heal(good[0])) {

                        }
                        creep.smartRangedAttack();
                    } else {
                        if (creep.rangedHeal(good[0])) {}
                        creep.rangedMassAttack();
                    }

                }
                creep.memory.death = good[0].memory.death;
                return true;
            } else {
                creep.rangedMassAttack();
            }

        }
        movement.flagMovement(creep);
    }
}

function doAttack(creep) {
    let zz = Game.getObjectById(creep.partyFlag.memory.target);
    if (zz !== null) {
        if (creep.pos.isNearTo(zz)) {
            creep.rangedMassAttack();
        } else
        if (creep.pos.inRangeTo(zz, 3)) {
            creep.rangedAttack(zz);
            creep.say('Xx?');
            return;
        }
    }
    creep.smartRangedAttack();
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
class mageClass extends roleParent {
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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }
    static run(creep) {

        if (super.spawnRecycle(creep)) {
            creep.selfHeal();
            return;
        }

        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (creep.partyFlag === undefined) creep.memory.death = true;

        if (super.rallyFirst(creep)) return;
        if (super.goToPortal(creep)) return;
        if (creep.partyFlag && creep.partyFlag.memory.bandit) {
            super.rebirth(creep);
            creep.say('bandit');
            banditAction(creep);
//            if (Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
            return;
        }

        if (creep.pos.isNearTo(Game.flags.kill)) {
            creep.memory.waypoint = false;
        }

        //if (
            creep.smartHeal();
            //) { // IF smartHeal is true - means it's doing a ranged heal.
                 //       creep.rangedMassAttack();
        //} // else {
        creep.smartRangedAttack();
        // }



        if (creep.hits > creep.hitsMax - 300) {
            if(creep.partyFlag && creep.partyFlag.memory.target){
                let tgt = Game.getObjectById(creep.partyFlag.memory.target);
                if(tgt && !creep.pos.inRangeTo(tgt,2)){
                    creep.tuskenTo(tgt, creep.memory.home, { reusePath: 50 });
                }

            } else {
                creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50 });
            }
        } else {
            creep.runFrom(creep.partyFlag);
        }
    }


}
module.exports = mageClass;