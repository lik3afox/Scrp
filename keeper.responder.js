// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.420K
//[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE]
/*/
[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE],
*/
// only 1 level and 
// 800 Sets
var classLevels = [
    // lv 0 - 5500 50 parts
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        HEAL, MOVE, HEAL, HEAL, HEAL, HEAL, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK
    ],
    [RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, HEAL,
        MOVE, HEAL, HEAL, HEAL, HEAL,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
    ]
];

var roleParent = require('role.parent');
var movement = require('commands.toMove');
var boost = [];
var fox = require('foxGlobals');

function getHostiles(creep) {
    let range = 15;
    let zzz = creep.pos.findInRange(creep.room.hostilesHere(), range);
    if (creep.room.name == 'E35S76') return [];

    if (creep.memory.playerCreepId !== undefined) {
        let plzy = Game.getObjectById(creep.memory.playerCreepId);
        if (plzy === null) {
            creep.memory.playerCreepId = undefined;
            zzz = _.filter(zzz, function(object) {
                return object.owner.username == 'Invader' || object.owner.username == 'Source Keeper';
            });

            return zzz;
        } else {
            return [plzy];
        }

    } else {
        let players = _.filter(zzz, function(object) {
            return !_.contains(fox.friends, object.owner.username) || object.owner.username !== 'Invader' || object.owner.username !== 'Source Keeper';
        });
        if (players.length > 0) {
            creep.memory.playerCreepId = players[0].id;
            return [players];
        }

        zzz = _.filter(zzz, function(object) {
            return object.owner.username == 'Invader' || object.owner.username == 'Source Keeper';
        });

        return zzz;
    }
    return [];
}
/*
function attackCreep(creep, bads) {
    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }
    if (creep.memory.badTargetID === undefined) {
        for (var e in bads) {
            if (bads[e].owner.username == 'Invader') {
                for (var a in bads[e].body) {
                    if (bads[e].body[a].type == RANGED_ATTACK) {
                        creep.memory.badTargetID = bads[e];
                        break;
                    }
                }
            }
        }
    }

    if (creep.memory.badTargetID === undefined) {

        let enemy = creep.pos.findClosestByRange(bads);
        let distance = creep.pos.getRangeTo(enemy);
        creep.say('attk' + distance);

        if (creep.pos.isNearTo(enemy)) {
            creep.memory.walkingTo = undefined;
            if (enemy.owner.username != 'Source Keeper' || enemy.hits <= 100) {
                creep.attack(enemy);
                creep.rangedMassAttack();
            } else {
                creep.attack(enemy);
                //            creep.selfHeal();
            }
        } else if (distance < 4) {

            var targets = creep.pos.findInRange(bads, 3);

            // Ranged attack.
            if (targets.length > 2) {
                if (enemy.owner.username != 'Source Keeper') {
                    creep.rangedMassAttack();
                } else {
                    creep.selfHeal();
                }

            } else {
                if (enemy.owner.username != 'Source Keeper') {
                    creep.rangedAttack(enemy);
                } else {
                    creep.selfHeal();
                }

            }
            // Heal
            creep.selfHeal();
            // Move
            creep.moveTo(enemy, { ignoreRoads: true });
        } else if (distance >= 4) {
            creep.selfHeal();
            creep.moveTo(enemy, { ignoreRoads: true });
        }
    } else {
        let target = Game.getObjectById(creep.memory.badTargetID);
        if (creep.pos.isNearTo(target)) {
            creep.attack(target);
            creep.rangedMassAttack();
        } else {
            creep.moveTo(target);
            creep.rangedAttack(target);
            creep.selfHeal();
        }
    }

}*/

function getRangeAttacker(bads) {
    for (var e in bads) {
        let zzz = _.filter(bads[e].body, function(o) {
            return o.type == RANGED_ATTACK;
        });
        if (zzz.length > 0)
            return bads[e];
    }
    return bads[0];
}

function invasionAttack(creep, bads) {
    let distance = creep.pos.getRangeTo(enemy);
    //    var targets = creep.pos.findInRange(bads, 3);
    if (creep.pos.isNearTo(enemy)) {
        creep.rangedMassAttack();
        creep.attackMove(enemy);
    } else {
        creep.selfHeal();
        creep.moveTo(enemy);
        creep.rangedAttack(enemy);
    }
}

function invasionAttack(creep, bads) {
    //    let enemy = creep.pos.findClosestByRange(bads);
    if (creep.hits > 3000) {
        let enemy = getRangeAttacker(bads);
        //        creep.selfHeal(creep);
        let distance = creep.pos.getRangeTo(enemy);
        var targets = creep.pos.findInRange(bads, 3);
        if (creep.pos.isNearTo(enemy)) {
            creep.rangedMassAttack();
            creep.attack(enemy);
        } else if (targets.length > 1) {
            creep.selfHeal();
            creep.moveTo(enemy);
            creep.rangedMassAttack();
        } else {
            creep.selfHeal();
            creep.moveTo(enemy);
            creep.rangedMassAttack();
//            creep.rangedAttack(enemy);
        }
    } else {
        creep.selfHeal();
        if (bads.length > 0)
            if (bads[0] !== undefined && bads[0].owner.username === 'Invader')
                creep.runFrom(bads);
    }
}

function SKAttack(creep, bads) {
    let enemy = creep.pos.findClosestByRange(bads);
    if (creep.memory.runAwayLimit === undefined) {
        creep.memory.runAwayLimit = creep.hitsMax * 0.33;
    }

    creep.selfHeal(creep);
    let distance = creep.pos.getRangeTo(enemy);
    if (bads.length == 2) {
        if (creep.pos.isNearTo(enemy)) {
            creep.rangedMassAttack();
        } else {
            creep.moveMe(enemy);
            creep.rangedAttack(enemy);
        }
    } else if (distance < 4) {

        var targets = creep.pos.findInRange(bads, 3);
        if (creep.hits < creep.memory.runAwayLimit) {
            creep.memory.getaway = true;
        }

        if (bads.length)
            if (creep.memory.getaway || distance < 3) {
                creep.runFrom(bads);
            }
        creep.rangedAttack(enemy);

    } else if (distance >= 4) {
        if (!creep.memory.getaway) {
            creep.moveMe(enemy, { maxRooms: 1 });
        }

    }

    if (creep.memory.getaway && creep.hits == creep.hitsMax) {
        creep.memory.getaway = false;
    }

}

function attackCreep(creep, bads) {

    // This one will in the just go after the guys with range attack.

    if (creep.memory.runAwayLimit === undefined) {
        creep.memory.runAwayLimit = 3000;
    }

    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }

    let enemy = creep.pos.findClosestByRange(bads);
    ///    console.log(enemy.is)
    if (enemy !== null) {
/*        console.log(enemy.isNPC, 'isnpc', creep.pos);
        console.log(enemy.isEnemy, 'isEnemy');
        console.log(enemy.isFriend, 'isnpc'); */
    }
    if (enemy !== null && enemy.owner !== null && enemy.owner.username == 'Source Keeper') {
        SKAttack(creep, bads);
    }
    /*else if (enemy.owner.username != 'Invader' && enemy.owner.username != "Source Keeper" && !_.contains(FLAG.friends, enemy.owner.username)) {
           //        playerAttack(creep, bads);
       }*/
    else {
        invasionAttack(creep, bads);
    }


}

function moveCreep(creep) {
    let pflag = Game.flags[creep.memory.party];
    if (!creep.pos.inRangeTo(pflag,5)) {
        creep.moveMe(pflag);
        creep.countDistance();
    } else {
        creep.say('ZzZzZzZ');
        creep.countStop();
    }
}

var E25S75 = ['E24S74', 'E25S74', 'E26S74', 'E24S75', 'E25S75', 'E26S75', 'E24S76', 'E25S76', 'E26S76'];
var E35S75 = ['E34S74', 'E35S74', 'E36S74', 'E34S75', 'E35S75', 'E36S75', 'E34S76', 'E35S76', 'E36S76'];

function analyzeMining(creep) {
    if (_.contains(E25S75, creep.room.name)) {
        let flag = Game.flags[creep.memory.party];
        let mostMinedRoom;
        let mostMined = 0;
        for (var e in E25S75) {
            if (Game.rooms[E25S75[e]] !== undefined && Game.rooms[E25S75[e]].memory.mining > mostMined) {
                mostMinedRoom = E25S75[e];
                mostMined = Game.rooms[E25S75[e]].memory.mining;
            }
        }
        //        console.log(flag, flag.room.name, mostMinedRoom, mostMined, "Most mined room info");
        if (flag.room.name !== mostMinedRoom) {
            flag.setPosition(new RoomPosition(flag.pos.x, flag.pos.y, mostMinedRoom));
        }
    }
}

class roleGuard extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {

        if (creep.saying == 'ZzZzZzZ') {
            creep.say('ZzZzZz');
            return;
        }
        if (creep.saying == 'ZzZzZz') {
            creep.say('ZzZzZ');
            return;
        }
        if (creep.saying == 'ZzZzZ') {
            creep.say('ZzZz');
            return;
        }
        if (creep.saying == 'ZzZz') {
            analyzeMining(creep);
            creep.say('ZzZ');
            return;
        }
        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        super.rebirth(creep);

        let bads = getHostiles(creep);

        if (bads.length > 0) {
            attackCreep(creep, bads);
        } else {
            if (!movement.moveToDefendFlag(creep)) {
                creep.selfHeal();
                moveCreep(creep);
            }
        }
            //            if()
    }


}
module.exports = roleGuard;
