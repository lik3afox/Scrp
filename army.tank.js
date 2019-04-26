// Tanks are designed to range and demolish at the same time.

var classLevels = [
    // Level 0
    [MOVE, WORK],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 4
    [WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
    ],
    // Level 5
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: ['ZH'],
    },
    // Level 7
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: ['XZH2O'],
    },
    // Level 8
    {
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XZH2O'],
    },
    // Level 9

    {
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
        boost: ['XGHO2', 'XZH2O', 'KO'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XGHO2', 'XZH2O','XKHO2'],
    },
    // RANGED_ATTACK
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, WORK, TOUGH, TOUGH, TOUGH, WORK, TOUGH, TOUGH, WORK,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZH2O', 'XZHO2'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZH2O', 'XZHO2'],
    },
    // Level 13
    {
        body: [],
        boost: [],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');


//STRUCTURE_POWER_BANK:
class demolisherClass extends roleParent {
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
            return;
        }

        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.rallyFirst(creep)) return;
        if (super.goToPortal(creep)) return;
        if(creep.partyFlag === undefined){
            creep.memory.death = true;
            return;   
        }


        if (creep.partyFlag.memory.aiOpts && creep.partyFlag.memory.aiOpts.clearBase === true && creep.room.name === creep.partyFlag.pos.roomName) {
            if (creep.memory.targetID === undefined) { // || Game.time % 500 === 0
                    var tgtdd = creep.room.getClearBaseTarget();
                    if(!tgtdd){
                        creep.partyFlag.memory.remove = true;
                        creep.memory.death = true;
                        return;
                    }
                    creep.memory.targetID = tgtdd.id;

                if (creep.memory.targetID === false) {
                    creep.memory.death = true;
                }
            }
            let tgt = Game.getObjectById(creep.memory.targetID);
            if (tgt) {
                if (creep.pos.isNearTo(tgt)) {
                    creep.dismantle(tgt);
                } else {
                    let sded;
                    if(creep.room.name === creep.partyFlag.pos.roomName){
                        sded = creep.moveTo(tgt, { reusePath: 50 });
                    } else {
                        sded = creep.moveMe(tgt, { reusePath: 50 });
                    }
                	if(sded === -2){
                		let tgttt = creep.room.getClearBaseTarget(true);
                		if(tgttt)                		creep.memory.targetID = tgttt.id;
                	}
                    creep.smartDismantle();
                }
            } else {
                creep.memory.targetID = undefined;
            }
            return;
        }
        creep.smartDismantle();

        if (creep.pos.isNearTo(creep.partyFlag)) {
            creep.memory.stuckCount--;
        }
        if (creep.memory.leaderID && creep.pos.inRangeTo(creep.partyFlag, 2)) {
            creep.moveTo(creep.partyFlag);
        } else {
            creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50 }); //,useSKPathing:true
        }

    }
}

module.exports = demolisherClass;