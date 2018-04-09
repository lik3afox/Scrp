// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.140K

var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        HEAL, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, MOVE, HEAL
    ]
];

var boost = [];
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var fox = require('foxGlobals');


function getHostiles(creep, range) {
    let tgt = Game.getObjectById(creep.memory.playerTargetId);
    if (tgt !== null && tgt.owner.username !== 'Invader') {
        return [tgt];
    } else {
        creep.memory.playerTargetId = undefined;
    }

    let bads = creep.room.find(FIND_HOSTILE_CREEPS);

    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });



    let player = _.filter(bads, function(o) {
        return o.owner.username !== 'Invader' && o.owner.username !== 'Source Keeper';
    });
    if (player.length > 0) {
        creep.memory.playerTargetId = player[0].id;
        return player;
    }
    if (bads.length) {
        let close = creep.pos.findClosestByRange(bads);
        if (close.owner.username !== 'Invader') {
            creep.memory.playerTargetId = close.id;
        }
        return [close];
    }
    return bads;

}

function attackCreep(creep, bads) {
    creep.memory.goTo = undefined;

    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    creep.say('attk' + bads.length, ":", distance);
    if(enemy === null) return;
    if (creep.hits < 400 && enemy !== undefined && enemy.owner.username != 'Source Keeper' && distance === 1) {
        creep.selfHeal();
        return;
    }

    if (distance <= 1) {
        creep.memory.walkingTo = undefined;
        if (enemy.owner.username != 'Source Keeper' || enemy.hits <= 100) {
            creep.attack(enemy);
            if (Game.cpu.bucket > 5000) creep.rangedMassAttack();
        } else {
            if (creep.hits > 2600) {
                creep.attack(enemy);
                if (Game.cpu.bucket > 5000) creep.rangedMassAttack();
            } else {
                creep.rangedMassAttack();
                creep.selfHeal();
            }
        }
    } else if (distance < 4) {
        if (bads.length <= 2) {
            creep.rangedAttack(enemy);
        } else {
            creep.rangedMassAttack();
        }
        creep.selfHeal();
        creep.moveMe(enemy, { ignoreCreeps: true, maxRooms: 1 });

        return;
    } else if (distance >= 4) {
        if (creep.hits !== creep.hitsMax) creep.selfHeal();
        if (enemy.owner.username === 'Source Keeper') {
            if (creep.hits == creep.hitsMax || distance > 6) {
                creep.moveMe(enemy, { ignoreCreeps: true, maxRooms: 1 });
            }
        } else {
            creep.moveMe(enemy, { ignoreCreeps: true, maxRooms: 1 });
        }
    }
    if (bads.length > 2) {
        creep.rangedMassAttack();
    }
}

function analyzeSourceKeeper(creep) {

    let keepers = creep.memory.keeperLair;
    let targetID;
    let lowest = 300;

    var e = keepers.length;
    while (e--) {
        let keeperTarget;
        if (keepers[e] !== null)
            keeperTarget = Game.getObjectById(keepers[e]);
        if (keeperTarget !== null && keeperTarget !== undefined) {
            if (keeperTarget.ticksToSpawn < lowest) {
                lowest = keeperTarget.ticksToSpawn;
                targetID = e;
            }
        }
    }
    return targetID;
}

function moveCreep(creep) {
    // So moveCreep only needs to worry about movement to a sourceKeeper. 
    if (creep.memory.goTo === undefined) {
        creep.memory.goTo = analyzeSourceKeeper(creep);
    }

    let gota = Game.getObjectById(creep.memory.keeperLair[creep.memory.goTo]);

    if (gota !== null) {
        if (!creep.pos.isNearTo(gota)) {
            creep.moveMe(gota, {
                reusePath: 15,
                ignoreRoads: true,
                ignoreCreeps: true,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#bf0',
                    lineStyle: 'dotted',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });

        } else {
            if (gota.ticksToSpawn !== undefined && gota.ticksToSpawn - 1 > 0 && gota.ticksToSpawn < 200) {
                creep.sleep(gota.ticksToSpawn + Game.time - 1);
            }
        }
    }


}


class roleGuard extends roleParent {

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

        super.rebirth(creep);

        if (creep.ticksToLive === 1499) {
            if (Memory.stats.totalMinerals.KO > 20000) {
                boost.push('KO');
            }
            if (Memory.stats.totalMinerals.LO > 20000) {
                boost.push('LO');
            }
            _.uniq(boost);
        }
        if (super.boosted(creep, boost)) {
            return;
        }

        var goalPos = creep.partyFlag;

        if (creep.memory.keeperLair === undefined && creep.room.name == creep.partyFlag.pos.roomName) {
            creep.memory.keeperLair = [];
            var lairs = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_KEEPER_LAIR } });
            for (var e in lairs) {
                creep.memory.keeperLair.push(lairs[e].id);
            }
        }

        if (creep.memory.keeperLair) {
            let bads;
            if (!movement.moveToDefendFlag2(creep)) {
                if (creep.room.name == creep.partyFlag.pos.roomName) {
                    bads = getHostiles(creep);
                } else {
                    bads = getHostiles(creep, 6);
                }
                if (bads !== undefined && bads.length > 0) {
                    if (creep.hits < 400) {
                        creep.selfHeal();
                    } else {
                        attackCreep(creep, bads);
                    }
                    creep.memory.goTo = undefined;
                    return;
                } else {
                    creep.smartHeal();
                    moveCreep(creep);
                }
            } else {
                bads = getHostiles(creep);
                if (bads !== undefined && bads.length > 0) {
                    attackCreep(creep, bads);
                    creep.memory.goTo = undefined;
                    return;
                }
            }
        } else if (creep.room.name != creep.partyFlag.pos.roomName) {
            let bads = getHostiles(creep, 6);
            if (bads !== undefined && bads.length > 0) {
                attackCreep(creep, bads);
                return;
            } else {
                //                if(creep.hits !== creep.hitsMax) 
                creep.smartHeal();
                creep.moveMe(creep.partyFlag, { reusePath: 50, segment: true });
            }
        }
    }


}
module.exports = roleGuard;