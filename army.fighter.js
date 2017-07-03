// Front line - 
// Needs to be balanced between tough/attack/movement. 

var classLevels = [
    [TOUGH, MOVE, ATTACK],

    [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], // 200
    //[TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK],

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],

    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, HEAL],

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],

    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL, HEAL],
    //6
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL, HEAL],
    //7
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL],
    //8 
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    //9
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    //10
    [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE
    ],
    // Boosted fighter is level 11
    [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, ATTACK, TOUGH, ATTACK, ATTACK,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ],
    [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, ATTACK,
        TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ]
];

var boost = [RESOURCE_LEMERGIUM_OXIDE];
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
        case "E22S78":
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            if (bads.length > 0) {
                creep.attackMove(bads[0]);
                return true;
            }
            return false;


        case "E52S64xx":
            var E18S64targets = ['58002212f0b1ee20417fcf65'];
            for (a in E18S64targets) {
                target = Game.getObjectById(E18S64targets[a]);
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
                creep.attackMove(bads[0]);
                return true;
            }
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL;
            });
            if (bads.length > 0) {
                creep.attackMove(bads[0]);
                return true;
            }
            return false;
        case "E21S73":
            bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            if (bads.length > 0) {

                creep.attackMove(bads[0]);
                break;
            }

            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return bads.structureType != STRUCTURE_WALL;
            });
            if (bads.length > 0)
                creep.attackMove(bads[0]);
            break;
        default:
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].memory.wallTarget !== 'none') {
                E18S64targets = [Game.flags[creep.memory.party].memory.wallTarget];
                for (var b in E18S64targets) {
                    target = Game.getObjectById(E18S64targets[b]);
                    if (target !== null) {
                        if (creep.pos.isNearTo(target)) {
                            creep.attack(target);
                            return true;
                        }
                    }
                }
            }

            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            if (bads.length > 0) {
                creep.attack(bads[0]);
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
        if (Game.spawns[e].memory.alphaSpawn) {
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
    creep.memory.formationPos = undefined;

    //    var enemy = creep.pos.findInRange(creep.room.hostilesHere(),3,{
    //          filter: object => (object.owner.username != 'NobodysNightmare'&&object.owner.username != 'admon' &&object.owner.username != 'lolzor')
    //        });

    //movement.flagMovement(creep);
    //creep.say(enemy.length,true);
    //return;

    //    if(enemy.length > 0) {
    //    enemy = creep.pos.findClosestByRange(enemy);
    //      creep.attack(enemy);
    //   } else {

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
            if (creep.pos.isNearTo(pBank) && creep.hits > 2500) {
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

var fox = require('foxGlobals');

class fighterClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        creep.say('fight');
        if (super.returnEnergy(creep)) {
            return;
        }

        if (super.doTask(creep)) {
            return;
        }
        if (super.goToPortal(creep)) return;
        //   if(super.boosted(creep,boost)) { return;}
        var enemy;
        if (super.isPowerParty(creep)) {
            if (creep.room.name == 'E34S80') {
                enemy = creep.pos.findInRange(creep.room.hostilesHere(), 3, {
                    filter: o => (!_.contains(fox.friends, o.owner.username))
                });
                if (enemy.length > 0) {
                    enemy = creep.pos.findClosestByRange(enemy);
                    creep.attack(enemy);
                }
            }

            creep.memory.waypoint = true;
            if (creep.ticksToLive == 500) {
                creep.memory.parent = returnClosestSpawn(creep.room.name).id;
            }

            super.rebirth(creep);
            if (powerAction(creep))
                return;
        }
        if (creep.memory.level >= 11) {
            if (super.boosted(creep, ['XGHO2', 'XUH2O', 'XZHO2'])) {
                return;
            }
        }
        /*
                if (creep.memory.level == 10) {
                    if (super.boosted(creep, ['XUH2O'])) {
                        return;
                    }
                }  */

        enemy = creep.pos.findInRange(creep.room.hostilesHere(), 1);

        enemy = _.filter(enemy,
            function(object) {
                return (!_.contains(fox.friends, object.owner.username) && !object.pos.lookForStructure(STRUCTURE_RAMPART) && object.owner.username !== 'Source Keeper');
            }
        );

        //creep.say(enemy.length, true);
        //return;
        //        creep.say(creep.memory.party);
        var kill;
        if (enemy.length > 0) {
            enemy = creep.pos.findClosestByRange(enemy);
            if (creep.pos.isNearTo(enemy)) {
                creep.attackMove(enemy);
            } else {
                if (Game.flags.siege === undefined || Game.flags.siege.pos.roomName !== creep.room.name)
                    creep.moveTo(enemy);
            }
        } else {

            if (!doAttack(creep))

                if (Game.flags[creep.memory.party] !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
                    if (Game.flags.siege !== undefined && Game.flags.siege.pos.roomName === creep.room.name) {
                        //                        movement.flagMovement(creep);
                        creep.say('kill');
                        creep.killBase();
                    } else {
                        if (creep.room.name == 'E52S67' && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
                            creep.killBase();
                        } else {

                            movement.flagMovement(creep);
                        }
                    }
                } else {
                    if (creep.room.name == 'E52S67' && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
                        creep.killBase();
                    } else {

                        movement.flagMovement(creep);
                    }

                }

        }

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
        /*
                if (creep.hits !== creep.hitsMax && creep.room.name == 'E15S64') {
                    if (Game.flags.drainer !== undefined) {
                        creep.moveTo(Game.flags.drainer.pos);
                    } else {
                        console.log('nEED ESCAPE FLAG');
                    }
                } */

        /*
                        if (creep.hits !== creep.hitsMax) {
                            if (super.edgeRun(creep)) {
                                return;
                            }
                        }  */


    }
}

module.exports = fighterClass;
