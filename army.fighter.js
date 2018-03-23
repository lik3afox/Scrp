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
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
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
            console.log(creep, "Has switched to new party", pbFlags[a].name, 'from', creep.memory.party);
            creep.memory.party = pbFlags[a].name;
            creep.memory.reportDeath = true;
            creep.memory.powerbankID = undefined;
            return true;
        }
    }

    return false;
}

var E18S64targets = ['58f844ac24da03916bf3b00b', '58efba5cd63a0941a119c94f'];

function doAttack(creep) {
    let target;
    var a;
    var bads;
    switch (creep.room.name) {
        case "E22xS78":
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            if (bads.length > 0) {
                creep.attack(bads[0]);
                return true;
            }
            return false;


        case "xx":
            var E18S64targets = ['59f45823233302090ecbfade'];
            if (creep.partyFlag.memory.target !== undefined)
                E18S64targets.push(creep.partyFlag.memory.target);
            for (a in E18S64targets) {
                target = Game.getObjectById(creep.partyFlag.memory.target);
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        creep.attack(target);
                        break;
                    }
                }
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
                return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL;
            });
            if (bads.length > 0) {
                creep.attack(bads[0]);
                return true;
            }
            return false;
            /*        case "E12S43":
                        bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
                        bads = _.filter(bads, function(o) {
                            return !_.contains(fox.friends, o.owner.username);
                        });
                        if (bads.length > 0) {

                            creep.attack(bads[0]);
                            break;
                        }

                        bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                        bads = _.filter(bads, function(o) {
                            return bads.structureType != STRUCTURE_WALL;
                        });
                        if (bads.length > 0)
                            creep.attack(bads[0]);
                        break; */
        default:
            creep.say('de');
            target = Game.getObjectById(creep.partyFlag.memory.target);
            if (target !== null) {
                if (creep.pos.isNearTo(target)) {
                    creep.attack(target);
                }
                return true;
            }

            if (creep.partyFlag.memory.killBase) {
                //                creep.killBase();
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

            break;

    }
    return false;
}


function returnClosestSpawn(roomName) {
    var distance = 100;
    var spawn;
    //    var e = _.filter(Game.spawns).length;
    var keys = Object.keys(Game.spawns);
    var a = keys.length;
    while (a--) {
        var e = keys[a];
        if (Game.spawns[e].memory.alphaSpawn && Game.spawns[e].room.name !== 'E14S38' && Game.spawns[e].room.name !== 'E14S37') {
            var tempDis = Game.map.getRoomLinearDistance(roomName, Game.spawns[e].room.name);
            if (tempDis < distance) {
                distance = tempDis;
                spawn = Game.spawns[e];
            }
        }
    }
    return spawn;
}

function powerAction(creep) {
    var power = require('commands.toPower');

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
            movement.flagMovement(creep);
            let task = {};
            task.options = {
                reusePath: 100
            };
            task.pos = Game.flags[creep.memory.party].pos;
            task.order = "moveTo";
            task.room = true;
            task.count = true;
            creep.memory.task.push(task);

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
                bads.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep));
                if (creep.pos.isNearTo(bads[0])) {
                    creep.attack(bads[0]);
                    creep.moveTo(bads[0]);
                } else {
                    creep.moveTo(bads[0]);
                }
                return true;
            }

            bads = creep.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(o) {
                return o.owner.username === 'Screeps';
            });
            if (bads.length > 0) {
                bads.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep));
                if (creep.pos.isNearTo(bads[0])) {
                    if (bads[0].getActiveBodyparts(ATTACK) > 0 && creep.hits > 2000) {
                        creep.attack(bads[0]);
                    } else if (bads[0].getActiveBodyparts(ATTACK) === 0) {
                        creep.attack(bads[0]);
                    }
                    creep.moveTo(bads[0]);
                } else {
                    creep.moveTo(bads[0]);
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
        if (super.spawnRecycle(creep)) {
            return;
        }
         if (creep.ticksToLive > 1400 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
            creep.say('got boosted IDeas');
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }


        if (super.isPowerParty(creep)) {
            if (powerAction(creep))
                return;
        }
        if (creep.memory.party == 'bandit') {
            creep.say('bandit');
            banditAction(creep);
            if (Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
            return;
        }
        var enemy;

        if (super.rallyFirst(creep)) return;
        if (super.goToPortal(creep)) return;
        if (creep.partyFlag === undefined) creep.memory.death = true;

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
        if (enemy.length > 0 && distance < 2) {
            enemy = creep.pos.findClosestByRange(enemy);
            if (creep.pos.isNearTo(enemy)) {
                creep.attack(enemy);
            } else {
                //                creep.moveTo(enemy);
                //                movement.flagMovement(creep);
            }
            //          return;
        } else {
            if (creep.memory.level == 5 || creep.memory.level == 10) {
                if (creep.hits < creep.hitsMax)
                    creep.selfHeal();
            }
            var killBase = ['E25S49', 'E23S27', 'W55S33'];
            if (creep.partyFlag !== undefined && creep.partyFlag.memory.killBase) {
                if (creep.room.name == creep.partyFlag.pos.roomName) {
                    creep.killBase({ maxRooms: 1 });
                } else {
                    movement.flagMovement(creep);
                }
                creep.say('!!@');
                return;
            } else if (_.contains(killBase, creep.room.name) && Game.flags[creep.memory.party] !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
                creep.killBase({ maxRooms: 1 });
                return;
            } else {
                if (!doAttack(creep)) {

                }
            }
        }

        movement.flagMovement(creep);

        if (creep.room.name == 'E15S63') {
            if (creep.pos.y == 49 && creep.hits === creep.hitsMax) {
                creep.move(TOP);
            }
            if (creep.pos.y == 48) {
                var bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                creep.attack(bads[0]);
                console.log('does damage?', bads[0].hits);
                creep.move(BOTTOM);
            }
        }
        if (creep.hits !== creep.hitsMax && creep.room.name == 'E15S64') {
            if (creep.pos.y === 0)
                creep.move(BOTTOM);
        }
    }
}

module.exports = fighterClass;