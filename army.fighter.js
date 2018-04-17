// Front line - 
// Needs to be balanced between tough/attack/movement. 

var classLevels = [
    // Level 0
    [MOVE, ATTACK],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Level 4
    [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, HEAL,
    ],
    // Level 5
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ],
        boost: ['UH'],
    },
    // Level 7
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ],
        boost: ['XUH2O'],
    },
    // Level 8
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XUH2O'],
    },
    // Level 9

    {
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
        boost: ['UH', 'XGHO2', 'XZHO2'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, ATTACK, TOUGH, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XUH2O', 'XGHO2', 'XZHO2'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, ATTACK,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XUH2O'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XUH2O'],
    },
    { // Level 13
        body: [TOUGH, TOUGH, TOUGH,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['UH2O', 'XGHO2', 'ZHO2'],
    },
    // Level 14
    {
        body: [TOUGH, TOUGH, TOUGH,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XUH2O'],
    },

];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
function findNewParty(creep) {
    // first we will look at Game.falgs
    let pbFlags = _.filter(Game.flags, function(o) {
        return o.color == COLOR_YELLOW && o.secondaryColor == COLOR_RED;
    });
    var e = pbFlags.length;
    while (e--) {
        var a = pbFlags[e];
        let dis = Game.map.getRoomLinearDistance(creep.room.name, pbFlags[a].pos.roomName);
        if (dis <= 5 && pbFlags[a].name != creep.memory.party) {
            //            console.log(creep, "Has switched to new party", pbFlags[a].name, 'from', creep.memory.party);
            creep.memory.party = pbFlags[a].name;
            creep.memory.reportDeath = true;
            creep.memory.powerbankID = undefined;
            return true;
        }
    }

    return false;
}

function doAttack(creep) {
    let target;
    var a;
    var bads;

    creep.say('de');
    target = Game.getObjectById(creep.partyFlag.memory.target);
    if (target !== null) {
        if (creep.pos.isNearTo(target)) {
            creep.attack(target);
        }
        return true;
    }

    bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });
    if (bads.length > 0) {
        creep.attack(bads[0]);
        return true;
    }


    bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });
    if (bads.length > 0) {
        creep.attack(bads[0]);
        return true;
    }

    if (creep.room.controller !== undefined && creep.room.controller.owner !== undefined && creep.room.controller.owner.username !== 'likeafox') {
        bads = creep.pos.findInRange(FIND_STRUCTURES, 1);
        if (bads.length > 0) {
            creep.attack(bads[0]);
        }
    }

    return false;
}

function powerAction(creep) {
    var power = require('commands.toPower');

            var bads = creep.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(o) {
                return o.owner.username === 'Screeps';
            });
//            bads = creep.pos.findInRange(bads,3);
if(bads.length > 0){
            console.log('FOUND looking around for bads',bads.length);
}

    if (Game.flags[creep.memory.party] !== undefined) {

        if (creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            if (creep.memory.powerbankID === undefined) {
                let zz = creep.room.find(FIND_STRUCTURES);
                zz = _.filter(zz, function(o) {
                    return o.structureType == STRUCTURE_POWER_BANK;
                });
                if (zz.length > 0) {
                    creep.memory.powerbankID = zz[0].id;
                }
            }

            let pBank = Game.getObjectById(creep.memory.powerbankID);
            if (pBank === null) {

                if (!power.findNewPowerParty(creep))
                    creep.memory.death = true;
                return false;
            }
            if (creep.pos.isNearTo(pBank) && creep.hits === creep.hitsMax) {
                creep.countStop();
                creep.attack(pBank);
                return true;
            } else {
                creep.countDistance();
                creep.moveMe(pBank, { reusePath: 100, ignoreCreeps: true });
                return true;
            }


        } else {
            creep.countDistance();
            creep.tuskenTo(creep.partyFlag,creep.memory.home,{reusePath:60,ignoreCreeps:true});
  /*          let task = {};
            task.options = {
                reusePath: 50
            };
            task.pos = Game.flags[creep.memory.party].pos;
            task.order = "moveTo";
            task.room = true;
            task.count = true;
            creep.memory.task.push(task);
*/
            return true;
        }
    } else {
        if (!power.findNewPowerParty(creep))
            creep.memory.death = true;
    }
    //    }     
    return creep.memory.powerParty;

}

function banditAction(creep) {
    creep.memory.reportDeath = true;

    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            bads = creep.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(o) {
                return o.owner.username === 'Screeps' && o.getActiveBodyparts(ATTACK) === 0 && o.getActiveBodyparts(RANGED_ATTACK) === 0 && o.getActiveBodyparts(HEAL) === 2;
            });
            if (bads.length > 0) {

                let tgt = _.min(bads, o => o.pos.getRangeTo(creep));
                if (creep.pos.isNearTo(tgt)) {
                    creep.attack(tgt);
                    creep.moveMe(tgt);
                } else {
                    creep.moveMe(tgt);
                }
                return true;
            }

            bads = creep.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(o) {
                return o.owner.username === 'Screeps';
            });
            if (bads.length > 0) {

                // How many transporters there are

                let tgt = _.min(bads, o => o.pos.getRangeTo(creep));
                if (creep.pos.isNearTo(tgt)) {

                    if (tgt.getActiveBodyparts(ATTACK) > 0 && creep.hits > 2000) {
                        creep.attack(tgt);
                    } else if (tgt.getActiveBodyparts(ATTACK) === 0) {
                        creep.attack(tgt);
                    }
                    creep.moveTo(tgt);

                    if (creep.memory.calledTrans === undefined) {
                        var trans = _.fitler(bads, function(o) {
                            return o.getActiveBodyparts(CARRY) > 0;
                        });
//            let spawnID = ;
if(trans.length){
let spawn = require('commands.toSpawn');
let numOfcreep = 0;
  do {
                let transport = {
                    build: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,
                            MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,
                            MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,
                            MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,
                            MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,],
                    memory: {
                        role: "thief",
                        home: creep.memory.home,
                        parent: creep.memory.parent,
                        level: 5,
                        party: "bandit"
                    }
                };
                spawn.requestCreep(transport, spawnID);
                numOfcreep++;
            } while (numOfcreep <= trans.length);
}
                        creep.memory.calledTrans = true;
                    }

                } else {
                    creep.moveMe(tgt);
                }
                return true;
            }


        }
        movement.flagMovement(creep);
    }
    //            creep.say(bads.length);
}

var fox = require('foxGlobals');

class fighterClass extends roleParent {
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
        creep.say('fight');
         creep.memory.death = creep.partyFlag === undefined;
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (creep.ticksToLive > 1400 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.doTask(creep)) { return; }
        if (super.rallyFirst(creep)) return;

        if (super.isPowerParty(creep)) {
            if (powerAction(creep))
                return;
        }
        if (creep.memory.party == 'bandit') {
            creep.say('bandit');
            banditAction(creep);
            
            return;
        }

        var enemy;

        if (super.goToPortal(creep)) return;

        enemy = creep.room.hostilesHere();
        enemy = _.filter(enemy,
            function(object) {
                return (!_.contains(fox.friends, object.owner.username) && !object.pos.lookForStructure(STRUCTURE_RAMPART) && object.owner.username !== 'Source Keeper');
            }
        );

        let close = creep.pos.findClosestByRange(enemy);
        let distance = creep.pos.getRangeTo(close);
        var kill;
        creep.say(enemy.length + 'E');
        if (enemy.length > 0 && distance <= 1) {
            creep.attack(close);
        } else {
            if (!doAttack(creep)) {
                if (creep.hits < creep.hitsMax) creep.selfHeal();
            }
        }

//        movement.flagMovement(creep);
creep.tuskenTo(creep.partyFlag,creep.memory.home,{reusePath:50});
    }
}

module.exports = fighterClass;