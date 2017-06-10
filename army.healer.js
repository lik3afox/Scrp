// Back line
// Designed for healing.

var classLevels = [
    [HEAL, MOVE],
    [HEAL, MOVE, MOVE, MOVE], // 200
    [WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, HEAL, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    // BOOSTED heal
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL]

];
var boost = [];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');

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
                creep.memory.parent = returnClosestSpawn(creep.room.name).id;
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
                creep.healOther(7);
            }
        } else {
            creep.healOther(7);
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
        //      if(pBank == undefined) {
        if (!power.findNewPowerParty(creep))
            creep.memory.death = true;
        //      }

    }

    return creep.memory.powerParty;
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

//STRUCTURE_POWER_BANK:
class healerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (super.sayWhat(creep)) return;
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        //  if(super.boosted(creep,boost)) { return;}   
        if (super.returnEnergy(creep)) {
            return;
        }

        if (super.isPowerParty(creep)) {
            creep.memory.waypoint = true;
            if (creep.ticksToLive == 500) {
                creep.memory.parent = returnClosestSpawn(creep.room.name).id;
            }
            super.rebirth(creep);
            if (powerAction(creep))
                return;
        }
        // creep.say('drugs'+creep.memory.level);

        if (creep.memory.level == 6) {
            if (super.boosted(creep, ['XZHO2', 'XLHO2', 'XGHO2'])) {
                return;
            }
        }
        //  creep.heal(creep);
        var hurtz = creep.pos.findInRange(FIND_MY_CREEPS, 5);
        hurtz = _.filter(hurtz, function(object) {
            return object.hits < object.hitsMax;
        }).sort((a, b) => a.hits - b.hits);


        creep.say(hurtz.length);
        //return;
        if (hurtz[0] !== undefined) {
            if (creep.heal(hurtz[0]) == ERR_NOT_IN_RANGE) {
                creep.rangedHeal(hurtz[0]);
            }
            //  if(!creep.pos.isNearTo(hurtz[0]) )
            //          creep.moveTo(hurtz[0]);
        }

        //  if(hurtz[0] == undefined)
        movement.flagMovement(creep);

    }
}

module.exports = healerClass;
