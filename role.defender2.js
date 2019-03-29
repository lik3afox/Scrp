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
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, CARRY, HEAL, HEAL, MOVE,
    ],
];
// 24 MOVE
// 2 CARRY
// 11 ATT
// 10 Rng
// 3 HEAL

var fox = require('foxGlobals');

function rangeCreep(creep, bads) {
    let enemy = _.filter(bads, function(o){
              return o.hits < 100;
            });

    if(enemy.length === 0){
        enemy = _.filter(bads, function(o){
              return o.getActiveBodyparts(RANGED_ATTACK);
            });
    }
    if(enemy.length === 0){
    	let healersOnly = true;
        enemy = _.filter(bads, function(o){
              if(o.getActiveBodyparts(HEAL) === 0){
              	healersOnly = false;
              }
            });
     	if(healersOnly) {
     		creep.memory.death = true;
     		return;
     	}
    }
    if(enemy.length === 0){
       enemy = bads;
    }
    enemy = creep.pos.findClosestByRange(enemy);
    let distance = creep.pos.getRangeTo(enemy);
    creep.say('pew',true);
    creep.heal(creep);
    if (creep.pos.isNearTo(enemy)) {
        creep.rangedMassAttack();
        if(creep.isAtEdge){
            creep.moveInside();
        } else {
          creep.moveTo(enemy);
        }
  //      if(enemy.owner.username === 'Invader' && creep.memory.level === 10){
//            Game.notify(Game.time + ' ' + creep.room.name + ' Lv 10 Defender work');
   //     }

    } else if (distance < 4) {
        var targets = creep.pos.findInRange(creep.room.notAllies, 3);
        // Ranged attack.
        if (targets.length > 2) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
        creep.moveTo(enemy, {
            maxOpts: 300,
            swampCost:1,
            maxRooms: 1
        });
    } else if (distance >= 4) {
        creep.moveTo(enemy, {
            maxOpts: 300,
            maxRooms: 1
        });
    }
    // Move
    //creep.tacticalMove(bads);
}

function attackCreep(creep, bads) {
    if(creep.memory.level === 10){
        rangeCreep(creep,bads);
        return;
    }
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);

    if (creep.pos.isNearTo(enemy)) {
        let zz = creep.attack(enemy);
        creep.say('attk' + zz);

        if (enemy.owner.username != 'Invader') {
            creep.rangedAttack(enemy);
        } else {
            creep.rangedMassAttack();
        }
        if(creep.isAtEdge){
            creep.moveInside();
        }

    } else if (distance < 4) {

        var targets = creep.pos.findInRange(creep.room.notAllies, 3);

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
            maxOpts: 300,
            swampCost:1,
            maxRooms: 1
        });
    } else if (distance >= 4) {
        creep.heal(creep);
        creep.moveTo(enemy, {
            //swampCost:1,
            maxOpts: 300,
            maxRooms: 1
        });
    }
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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    static run(creep) {
        if (Game.rooms[creep.memory.home].memory.spawnDefenderNeeded && creep.memory.boostNeeded && creep.memory.boostNeeded.length > 0 && Game.flags[creep.memory.flagDefend] === undefined){
                creep.memory.death = true;
                Game.rooms[creep.memory.home].memory.defenderActive = undefined;
                Game.rooms[creep.memory.home].memory.invaderStats = undefined;
                
        }
        if (super.spawnRecycle(creep)) {
            if(creep.hits !== creep.hitsMax){
                creep.selfHeal();
            }
            return;
        }

        if (creep.ticksToLive < 1000) {
            console.log(creep.memory.invadeLevel,'CUSTOM CREATED with < 1000 life', roomLink(creep.room.name),creep.memory.level,Game.cpu.bucket);
        }


        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        creep.memory.noHealing = true;

        if (super.movement.moveToDefendFlag3(creep)) {

            let badzs = creep.room.invaders;
            if (badzs.length > 0) {
                attackCreep(creep, badzs);
            }
            return true;
        } else { // go to mom and renew
            let badzs;
            badzs = creep.pos.findInRange(creep.room.invaders, 4);
            if (badzs.length > 0) {
                attackCreep(creep, badzs);
                return true;
            }

            if (creep.hits < creep.hitsMax) creep.heal(creep);

            if (creep.carryTotal > 0 && creep.isHome) {
                creep.moveToTransfer(creep.room.terminal === undefined ? creep.room.storage : creep.room.terminal, creep.carrying);
                return;
            } else if (!creep.isHome && creep.carryTotal < creep.carryCapacity) {

                let tombStone = Game.getObjectById(creep.memory.tombstoneID);
                if (!tombStone) {
                    let stones = creep.room.find(FIND_TOMBSTONES);
                    let tombStones = _.filter(stones, function(o) {
                        return o.total !== o.store[RESOURCE_ENERGY] && o.pos.findInRange(creep, 3);
                    });

                    if (tombStones.length === 0) {
                        tombStones = _.filter(stones, function(o) {
                            return o.total > 0 && o.pos.findInRange(creep, 3);
                        });

                    }
                    if (tombStones.length > 0) {
                        let close = creep.pos.findClosestByRange(tombStones);
                        creep.memory.tombstoneID = close.id;
                        tombStone = close;
                    }
                }
                if (tombStone && tombStone.total !== tombStone.store[RESOURCE_ENERGY] && tombStone.total > 0) {
                    if (creep.pos.isNearTo(tombStone)) {
                        for (let ee in tombStone.store) {
                            if (ee !== RESOURCE_ENERGY && tombStone.store[ee] > 0) {
                                creep.withdraw(tombStone, ee);
                                break;
                            }
                        }

                    } else {
                        creep.moveMe(tombStone);
                    }
                    return true;
                } else if (tombStone && tombStone.total === tombStone.store[RESOURCE_ENERGY] && tombStone.total > 0) {
                    if (creep.pos.isNearTo(tombStone)) {
                        creep.withdraw(tombStone, RESOURCE_ENERGY);
                    } else {
                        creep.moveMe(tombStone);
                    }
                    return true;
                }
            }
            if (Game.rooms[creep.memory.home].memory.spawnDefenderNeeded) {
                creep.memory.death = true;
                creep.memory._move = undefined;
                Game.rooms[creep.memory.home].memory.defenderActive = undefined;
                Game.rooms[creep.memory.home].memory.invaderStats = undefined;
                return;
            }

            let mom = Game.flags[creep.memory.home];
            if (mom !== null) {
                if (creep.pos.isEqualTo(mom)) {
                    creep.sleep(1500);
                    creep.room.memory.defenderActive = undefined;
                } else {
                    creep.moveMe(mom, { reusePath: 50 });
                }
            }

        }

    }



}
module.exports = roleNewDefender;