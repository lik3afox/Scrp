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
    //8
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL],
    //9 
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    //10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    //10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Boosted fighter is level 11
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK]
];

var boost = [RESOURCE_LEMERGIUM_OXIDE];
var movement = require('commands.toMove');
var attack = require('commands.toAttack');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
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

function doAttack(creep) {
    let target;
    switch (creep.room.name) {
        case "E38S82":
            target = Game.getObjectById('58ba75aa041adbe4312ca6ac');
            if (target !== null) {
                if (creep.pos.isNearTo(target)) {
                    creep.attack(target);
                }
            } else {
                target = Game.getObjectById('58a56eba4d5d993ffadd2496');
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        creep.attack(target);
                    }
                }
            }
            break;
        case "E17S76":
            target = Game.getObjectById('58677af00d89403c0f3cea15');
            if (target !== null) {
                if (creep.pos.isNearTo(target)) {
                    creep.attack(target);
                }
            } else {
                target = Game.getObjectById('588893b8dc89f23ad43c3d52');
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        creep.attack(target);
                    }
                }
            }
            break;
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
                let zz = creep.room.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_POWER_BANK });
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
                reusePath: 49
            };
            task.pos = Game.flags[creep.memory.party].pos;
            task.order = "moveTo";
            task.room = true;
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
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        //   if(super.boosted(creep,boost)) { return;}

        if (super.isPowerParty(creep)) {
            creep.memory.waypoint = true;
            if (creep.ticksToLive == 500) {
                creep.memory.parent = returnClosestSpawn(creep.room.name).id;
            }

            super.rebirth(creep);
            if (powerAction(creep))
                return;
        }
        if (creep.memory.level == 11) {
            if (super.boosted(creep, ['XZHO2', 'XGHO2'])) {
                return;
            }
        }

        var enemy = creep.pos.findInRange(creep.room.hostilesHere(), 3, {
            filter: object => (object.owner.username != 'NobodysNightmare' && object.owner.username != 'admon' && object.owner.username != 'lolzor')
        });

        //movement.flagMovement(creep);
        creep.say(enemy.length, true);
        //return;

        if (enemy.length > 0) {
            enemy = creep.pos.findClosestByRange(enemy);
            creep.attack(enemy);
        } else {
            doAttack(creep);
            if (creep.hits > creep.hitsMax - 400) {
                if (!movement.flagMovement(creep)) {}
            }
            creep.heal(creep);
        }
    }
}

module.exports = fighterClass;
