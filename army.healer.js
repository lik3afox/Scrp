// Back line
// Designed for healing.
var classLevels = [
// Level 0
[MOVE, HEAL],
// Level 1 10/10
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
// Level 2 15/15
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],
// Level 3 20/20
[MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
// Level 4
[HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, RANGED_ATTACK,],
// Level 5
{
body:[HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:[],
},
// Level 6
{
body:[HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:['LO'],
},
// Level 7
{
body:[HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,], 
boost:['XLHO2'],
},
// Level 8
{
body:[HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XZHO2', 'XLHO2'],
},
// Level 9
{
body:[      HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, HEAL, HEAL,], 
boost:['LO'],
},

{
body:[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE, HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,], 
boost:['XLHO2'],
},
// Level 10
{
body:[TOUGH, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, TOUGH, HEAL, TOUGH, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XLHO2','XGHO2', 'XZHO2'],
},
// Level 11
{
body:[TOUGH, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, TOUGH, HEAL,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XGHO2', 'XZHO2', 'XLHO2'],
},
// Level 12
{
body:[TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],    
boost:['XGHO2', 'XZHO2', 'XLHO2'],
},
// Level 13
{
body:[],    
boost:[],
},

];

var movement = require('commands.toMove');
var roleParent = require('role.parent');

function findNewParty(creep) {
    // first we will look at Game.falgs
    let pbFlags = _.filter(Game.flags, function(o) {
        return o.color == COLOR_YELLOW && o.secondaryColor == COLOR_RED;
    });
    for (var a in pbFlags) {
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

function powerAction(creep) {
    var power = require('commands.toPower');

    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.pos.inRangeTo(Game.flags[creep.memory.party], 5)) {
            if (creep.memory.powerbankID === undefined) {
                let vv = creep.room.find(FIND_STRUCTURES);
                vv = _.filter(vv, function(s) {
                    return s.structureType == STRUCTURE_POWER_BANK;
                });
                if (vv.length > 0) {
                    creep.memory.powerbankID = vv[0].id;
                }
                //                creep.memory.parent = returnClosestSpawn(creep.room.name).id;
            }

            let pBank = Game.getObjectById(creep.memory.powerbankID);
            if (pBank === null) {
                creep.memory.powerbankID = undefined;
                creep.memory.notThere = true;
                creep.memory.distance = 0;

                if (!creep.healOther(5)) {
                    if (!power.findNewPowerParty(creep))
                        creep.memory.death = true;
                }
                return true;
            }

            if (creep.pos.inRangeTo(pBank, 6)) {
                creep.memory.notThere = true;
                if(creep.id == creep.memory.partner){
                    creep.memory.partner = undefined;
                }
                if (creep.memory.partner !== undefined) {
                    let zz = Game.getObjectById(creep.memory.partner);
                    if (zz !== null) {
                        creep.heal(zz);
                        if(!creep.pos.isNearTo(zz))
                        	creep.moveTo(zz);
                    }
                } else {
                    creep.healOther(7);
                }
            }
        } else {

            if (creep.memory.partner !== undefined) {
                let zz = Game.getObjectById(creep.memory.partner);
                if (!creep.pos.isNearTo) {
                    creep.moveTo(zz);
                }
                    creep.heal(zz);
            } else {
                creep.healOther(7);
            }
            creep.countDistance();
            movement.flagMovement(creep);

            let task = {};
            task.options = {
                reusePath: 100
            };
            task.pos = Game.flags[creep.memory.party].pos;
            task.order = "moveTo";
            task.count = true;
            task.room = true;
            creep.memory.task.push(task);


        }

    } else {
        //   let pBank = Game.getObjectById( creep.memory.powerbankID);
        //      if(pBank == null) {
        if (!power.findNewPowerParty(creep))
            creep.memory.death = true;
        //      }

    }

    return creep.memory.powerParty;
}

function banditAction(creep) {
    creep.memory.reportDeath = true;

    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {

            good = creep.room.find(FIND_MY_CREEPS);
            good = _.filter(good, function(o) {
                return o.id !== creep.id && o.getActiveBodyparts(ATTACK) > 0;
            });
            good.sort((a, b) => a.hits - b.hits);
            creep.say(good.length + 'xxx');
            if (good.length > 0) {
                if (!creep.pos.isNearTo(good[0])) {
                    creep.moveTo(good[0]);
                }
                creep.heal(good[0]);
                return true;
            }

        }
        movement.flagMovement(creep);
    }
}


function returnClosestSpawn(roomName) {
    var distance = 100;
    var spawn;
    for (var e in Game.spawns) {
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

function healParty(creep) {
    if (creep.memory.partyID === undefined || creep.memory.partyID.length === 0) return false;
    for (var a in creep.memory.partyID) {
        var needed = Game.getObjectById(creep.memory.partyID[a]);
        if (needed !== null)
            if (needed.hits < needed.hitsMax) {
                if (creep.pos.inRangeTo(needed, 3)) {
                    creep.heal(needed);
                    creep.memory.lastHealed = needed.id;
                } else {
                    creep.moveTo(needed);
                }
                return true;
            }
    }
    return false;
}
var doMove;
//STRUCTURE_POWER_BANK:
class healerClass extends roleParent {
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
        doMove = false;
        if (super.sayWhat(creep)) return;
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
//            creep.memory.boostNeeded = classLevels[creep.memory.level].boost;
creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);        } 
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        if (super.isPowerParty(creep)) {
            creep.memory.waypoint = true;
            if (powerAction(creep))
                return;
        }
        if (creep.memory.party == 'bandit') {
//            super.rebirth(creep);
            creep.say('bandit');
            banditAction(creep);
            if (Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
            return;
        }

        var hurtz = creep.pos.findInRange(FIND_MY_CREEPS, 7);
        hurtz = _.filter(hurtz, function(object) {
            return object.hits < object.hitsMax && (object.owner.username == 'likeafox' || object.owner.username == 'Baj');
        }).sort((a, b) => a.hits - b.hits);

        //return;
        if (hurtz[0] !== undefined) {
            creep.say('1');
            if (creep.heal(hurtz[0]) == ERR_NOT_IN_RANGE) {
                creep.rangedHeal(hurtz[0]);
            } else {
                creep.memory.lastHealed = hurtz[0].id;
            }
            doMove = true;

        } else if (creep.hits < creep.hitsMax) {
            creep.say('2');
            creep.heal(creep);
            doMove = true;
        } else if (!healParty(creep)) {
            // heal last
            creep.say('3');
            var last = Game.getObjectById(creep.memory.lastHealed);
            if (last !== null) {
                creep.heal(last);
                if (last.id !== creep.id) {}
            }
            doMove = true;
        }
        if (super.rallyFirst(creep)) return;
        if (super.goToPortal(creep)) return;

        //  creep.heal(creep);


        if (creep.room.name == 'E11xS36') {
            var site = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
            site = _.filter(site, function(o) {
                return !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.progressTotal - o.progress < 1000;
            });
            creep.say(site.length);
            if (site.length > 0) {
                var zzz = creep.pos.findClosestByRange(site);
                creep.moveTo(zzz);
            } else if (doMove) {
                movement.flagMovement(creep);
            }
        } else {
            if (doMove) {
                movement.flagMovement(creep);
            }
        }


        /*        let zz = Game.getObjectById('595082872cf123870e614e0d');
        if (zz !== null && zz.hits > zz.hitsMax - 5) {
            if (creep.pos.isNearTo(zz))
                creep.rangedAttack(zz);
            creep.heal(zz);
        } * /
        creep.say(creep.memory.party);
        //  if(hurtz[0] == undefined)
*/

        /*        if (creep.room.name == 'E18S64') {
                    creep.selfHeal();
                    var spn = Game.getObjectById('594fc84a66235f5268eb6c6a');
                    if (spn !== null) {
                        creep.moveTo(spn);
                        return;
                    }
                    var tar = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                    if (tar.length > 0) {
                        let clost = creep.pos.findClosestByRange(tar);
                        creep.moveTo(clost);
                        return;
                    }
                } */

    }
}

module.exports = healerClass;