var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, CARRY, RANGED_ATTACK, ATTACK, HEAL], // 0
    [MOVE, MOVE, MOVE, MOVE, CARRY, RANGED_ATTACK, ATTACK, HEAL], // 1
    [MOVE, MOVE, MOVE, MOVE, CARRY, RANGED_ATTACK, ATTACK, HEAL], // 2
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL], // 3
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL], // 4

    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],

    //6  48/4030
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],

    //7
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL
    ]
];
var fox = require('foxGlobals');

function attackCreep(creep, bads) {
    //      creep.say('attk');
    //      let bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS,4);
    //    let bads = creep.pos.findClosestByRange(bads);
    if (bads.length === 0) return true;
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);

    if (creep.pos.isNearTo(enemy)) {
        creep.say('attk' + creep.attack(enemy));
        creep.attack(enemy);
        if (enemy.owner.username != 'Invader') {
            creep.rangedAttack(enemy);
        } else {
            creep.rangedMassAttack();
        }


    } else if (distance < 4) {

        var targets = creep.pos.findInRange(creep.room.hostilesHere(), 3);

        // Ranged attack.
        if (targets.length > 2) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
        // Heal
        creep.heal(creep);
        // Move
        creep.moveTo(enemy, {
            maxRooms: 1
        });
    } else if (distance >= 4) {
        creep.heal(creep);
        creep.moveTo(enemy, {
            maxRooms: 1
        });
    }
}

function restingSpot(creep) {
    if (creep.room.memory.defenderSleepSpot !== undefined && creep.room.name !== creep.memory.home) {
        creep.room.memory.defenderSleepSpot = undefined;
    }
    if (creep.room.name !== creep.memory.home) return;
    if (creep.room.memory.defenderSleepSpot === undefined && creep.room.name == creep.memory.home) {
        creep.room.memory.defenderSleepSpot = new RoomPosition(1, 1, 'none');
    }
    if (creep.room.memory.defenderSleepSpot.roomName !== 'none') {
        return creep.room.memory.defenderSleepSpot;
    }
    switch (creep.memory.home) {
        case 'E18S36':
            return new RoomPosition(37, 20, creep.memory.home);
        case 'E17S45':
            return new RoomPosition(12, 22, creep.memory.home);
        case 'E27S34':
            return new RoomPosition(28, 36, creep.memory.home);
        case 'E28S37':
            return new RoomPosition(22, 22, creep.memory.home);
        case 'E14S43':
            return new RoomPosition(11, 27, creep.memory.home);
        case 'E24S33':
            return new RoomPosition(11, 14, creep.memory.home);
        case 'E25S43':
            return new RoomPosition(38, 43, creep.memory.home);
        case 'E25S27':
            return new RoomPosition(37, 30, creep.memory.home);
        case 'E13S34':
            return new RoomPosition(41, 14, creep.memory.home);
        case 'E14S47':
            return new RoomPosition(26, 35, creep.memory.home);
        case 'E27S45':
            return new RoomPosition(15, 36, creep.memory.home);
        default:
            return false;
    }
}
var fox = require('foxGlobals');

function getHostiles(creep) {
    //!_.contains(fox.friends, creep.owner.username);
    var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });
    return bads;
}

function lootRun(creep) {

    if (creep.carryTotal === 0) return false;

    let target = creep.room.terminal;
    if (target === undefined) target = creep.room.storage;

    // go home and deposit.
    if (creep.pos.isNearTo(target)) {
        var keys = Object.keys(creep.carry);
        var z = keys.length;
        while (z--) {
            var e = keys[z];
            creep.transfer(target, e);
        }
    } else {
        creep.moveTo(target);
    }
    creep.say('loot');
    return true;
}

function rampartDefense(creep) {
    // Flag triggers rampartDefense,
    if (!creep.memory.rampartDefense) return false;
    creep.say('RAMP');
    var named = 'rampartD' + creep.room.name;

    if (Game.flags[named] !== undefined) {
        if (creep.memory.party === undefined) {
            creep.memory.party = named;
        }
        if (!creep.pos.isEqualTo(Game.flags[named])) {
            creep.moveTo(Game.flags[named]);
        }
        var badzs = getHostiles(creep);
        creep.say(badzs.length);
        if (badzs.length > 0) {
            creep.attack(badzs[0]);
            creep.rangedAttack(badzs[0]);
            //        creep.rangedMassAttack();
        }

    } else {
        creep.memory.rampartDefense = false;
    }

//    let zz = creep.room.lookForAtArea(LOOK_CREEPS, creep.y - 1, creep.x - 1, creep.y + 1, creep.x + 1);
 //   console.log(zz.length, 'looking for other creeps,');
    // so if it finds zz it will back up and just range shoot, other wise it will stay up front.
    var bads2 = getHostiles(creep);
    if (bads2.length > 0) {
        let enemy = creep.pos.findClosestByRange(bads2);
        if (creep.pos.isNearTo(enemy)) {
            creep.say('FU', true);
            creep.attack(enemy);
            creep.rangedMassAttack();
        }
    }
    return true;
}

var roleParent = require('role.parent');

class roleNewDefender extends roleParent {
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
        if (super.baseRun(creep)) return;

        // So this guy will stay by his spawn
        if (creep.memory.renewSpawnID === undefined && !creep.room.memory.simple) {
            let _struct = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN);
                }
            });
            if(_struct.length){
            creep.memory.renewSpawnID = _struct[_struct.length - 1].id;
            var ccSpawn = require('commands.toSpawn');
            ccSpawn.wantRenew(creep);
            }
        }


        // If no defend flag then

        if (super.movement.moveToDefendFlag(creep)) {

            var badzs = getHostiles(creep);
            creep.say('nDef' + badzs.length + creep.memory.active);
            if (badzs.length > 0) {
                attackCreep(creep, badzs);
            }

            creep.memory.active = true;
            return true;
        } else { // go to mom and renew
            creep.memory.active = false;

            if (creep.hits < creep.hitsMax) creep.heal(creep);
if(creep.carryTotal > 0 && creep.isHome){
            creep.moveToTransfer(creep.room.storage,creep.carrying);
            return;
} else if(!creep.isHome){
            if (super.constr.withdrawFromTombstone(creep, 5)) return true;
}

            let rest = restingSpot(creep); // If this has an assign spot in a room.
            if (!rest) {
                let mom = Game.getObjectById(creep.memory.renewSpawnID);
                if (mom !== null) {
                    if (creep.pos.isNearTo(mom)) {
                        creep.sleep(3);
                    } else {
                        creep.moveTo(mom);
                    }
                }
            } else {
                if (creep.pos.isEqualTo(new RoomPosition(rest.x, rest.y, rest.roomName))) {
                    creep.sleep(3);
                } else {
                    creep.moveTo(new RoomPosition(rest.x, rest.y, rest.roomName));
                }

            }
        }

    }



}
module.exports = roleNewDefender;