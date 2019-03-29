// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.140K

var classLevels = [
    [MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, ATTACK,

        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ATTACK, ATTACK, ATTACK, ATTACK, HEAL,
        HEAL, HEAL, HEAL, MOVE, HEAL
    ],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        HEAL, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, MOVE, HEAL
    ], //4310
];

var boost = [];
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var fox = require('foxGlobals');


function getHostiles(creep, range) {
    if (creep.room.name !== creep.partyFlag.pos.roomName || creep.memory.keeperLair === undefined || creep.memory.keeperLair.length === 1) {
        range = 3;
    }

    let tgt = Game.getObjectById(creep.memory.playerTargetId);
    if (tgt !== null && tgt.owner.username !== 'Invader') {
        return [tgt];
    } else if (tgt !== null && tgt.owner.username === 'Invader') {
        let bads = creep.pos.inRangeTo(creep.room.notAllies, 3);
        if (bads.length > 0) return bads;
        return [tgt];
    } else {
        creep.memory.playerTargetId = undefined;
    }

    let bads = creep.room.notAllies;

    let player = creep.room.enemies;

    if (player.length > 0) {
        creep.memory.playerTargetId = player[0].id;
        return player;
    }
    let invader = creep.room.invaders;
    if (invader.length) {
        //        creep.memory.playerTargetId = invader[0].id;
        return invader;
    }

    if (bads.length && range === undefined) {
        let close = creep.pos.findClosestByRange(bads);
        if (close && close.owner.username !== 'Invader') {
            creep.memory.playerTargetId = close.id;
        }
        return [close];
    } else if (range !== undefined) {
        let close = creep.pos.findClosestByRange(bads);
        if (close !== null && creep.pos.inRangeTo(close, range)) {
            return [close];
        } else {
            return [];
        }
    }
    return bads;

}

function attackCreep(creep, bads) {
    creep.memory.goTo = undefined;
    let least = _.min(bads, o => o.hits);
    if (creep.pos.isNearTo(least)) {
        creep.attack(least);
        creep.rangedMassAttack();
        creep.tacticalMove(bads);
        return;
    }

    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    //    creep.say('attk' + bads.length, ":", distance);
    if (enemy === null) return;
    if (creep.hits < 400 && enemy !== undefined && enemy.owner.username != 'Source Keeper' && distance === 1) {
        creep.selfHeal();
        return;
    }



    if (distance <= 1) {
        creep.memory.walkingTo = undefined;
        if (enemy.owner.username != 'Source Keeper' || enemy.hits <= 100) {
            creep.attack(enemy);
            creep.rangedMassAttack();
            if (enemy.owner.username === 'Invader') {
                creep.tacticalMove(bads);
            }
            return;
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
        //        var  = _.filter()
        var heals = _.filter(bads, function(o) {
            return o.getActiveBodyparts(HEAL) > 0 && o.pos.inRangeTo(creep,4);
        });
        if (heals.length > 0) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
        //    if (bads.length <= 2) {
        //      } else {
        //        }
        creep.selfHeal();
        if (enemy.owner.username === 'Invader') {
            creep.tacticalMove(bads);
        } else {
            creep.moveMe(enemy, { ignoreCreeps: true, maxRooms: 1 });
        }

        return;
    } else if (distance >= 4) {
        if (creep.hits !== creep.hitsMax) creep.selfHeal();
        if (enemy.owner.username === 'Source Keeper') {
            if (creep.hits == creep.hitsMax || distance > 6) {
                creep.moveMe(enemy, { ignoreCreeps: true, maxRooms: 1, maxOpts: 200, });
            }
        } else {
            creep.moveMe(enemy, { ignoreCreeps: true, maxRooms: 1, maxOpts: 200 });
            //creep.smartMove(bads);

        }
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

function moveToSK(creep) {
    // So moveToSK only needs to worry about movement to a sourceKeeper. 
    if (creep.memory.goTo === undefined) {
        creep.memory.goTo = analyzeSourceKeeper(creep);
    }
    if(creep.memory.dontMove === true){
        // This is used with controlGuard flag to stay in one place.
        return false;
    }
    let gota = Game.getObjectById(creep.memory.keeperLair[creep.memory.goTo]);

    if (gota !== null) {
        /*        if(gota.id === '59bbc3eb2052a716c3ce7108'){
                    
                    gota = new RoomPosition(40,15,'E54S35');
                    if (!creep.pos.isEqualTo(gota)) {
                        
                        creep.moveMe(gota, {
                            reusePath: 25,
                            ignoreRoads: true,
                            ignoreCreeps: true,
                            
                        });
                    creep.say('bic3');

                }            
                } else if(gota.id === '5982ff77b097071b4adc2b21'){
                    gota = new RoomPosition(31,35,creep.room.name);
                    if (!creep.pos.isEqualTo(gota)) {
                        creep.moveMe(gota, {
                            reusePath: 25,
                            ignoreRoads: true,
                            ignoreCreeps: true,
                            
                        });
                    creep.say('bic2');

                }            
                } else*/
        if (!creep.pos.isNearTo(gota)) {
            creep.moveMe(gota, {
                reusePath: 25,
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
            creep.say('bic');
        } else {
            if (gota.ticksToSpawn !== undefined && gota.ticksToSpawn - 1 > 0 && gota.ticksToSpawn < 200 && creep.hits === creep.hitsMax) {

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
    static boosts(level) {
        if (!Memory.empireSettings.boost.guard) return [];
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (level >= 1) {
            var boost = [];
            if (Memory.stats.totalMinerals.KO > 175000) {
                boost.push('KO');
            }
            if (Memory.stats.totalMinerals.LO > 175000) {
                boost.push('LO');
            }
            return _.uniq(boost);
        } else {

            if (_.isObject(classLevels[level])) {
                return classLevels[level].boost;
            }


        }
        return;
    }
    static run(creep) {
        super.rebirth(creep);

        if (creep.ticksToLive === 1499 && creep.memory.boostNeeded && creep.memory.boostNeeded.length === 0 && creep.memory.isBoosted === undefined && creep.memory.level === 1 && Memory.empireSettings.boost.guard) {
            creep.memory.boostNeeded = [];
            if (Memory.stats.totalMinerals.KO > 20000) {
                creep.memory.boostNeeded.push('KO');
            }
            if (Memory.stats.totalMinerals.LO > 20000) {
                creep.memory.boostNeeded.push('LO');
            }
        }

        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (!creep.partyFlag.memory.mineral) creep.partyFlag.memory.rallyCreateCount = 10;

        //        if (creep.memory.home !== creep.partyFlag.memory.musterRoom) creep.memory.reportDeath = true;
        //        creep.say(creep.name,creep.pos,roomLink(creep.room.name));
        if (creep.partyFlag.memory.mineral) {

            let bads = creep.pos.findInRange(creep.room.notAllies, 5);
            //      this.say(bads.length + "x");
            if (bads.length > 0) {
                if (creep.pos.isNearTo(bads[0])) {
                    creep.attack(bads[0]);
                } else {
                    creep.moveTo(bads[0]);
                }
                return true;
            }
            let didHeal = creep.smartHeal();
            if (didHeal && creep.hits < creep.hitsMax) {
                creep.say('waiting');
                return true;
            }
            let slpTimer;
            if (creep.partyFlag.color === COLOR_WHITE || creep.partyFlag.color === COLOR_BROWN) {
                creep.memory.reportDeath = true;
            }
            if (!creep.pos.isEqualTo(creep.partyFlag)) {
                if (creep.memory.keeperLair === undefined && creep.atFlagRoom) {
                    let lairs = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_KEEPER_LAIR } });
                    let mineral = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_EXTRACTOR } });
                    if (lairs.length !== 0 && mineral.length !== 0) {
                        let closeToMin = _.min(lairs, o => o.pos.getRangeTo(mineral[0]));
                        if (closeToMin !== undefined) {
                            creep.memory.keeperLair = [closeToMin.id];
                        }
                    }
                    creep.say('zFlag');
                }
                creep.moveMe(creep.partyFlag, { reusePath: 50}); //, useSKPathing: true 
            } else if (creep.hits === creep.hitsMax) {
                if (creep.memory !== undefined && creep.memory.keeperLair !== undefined && creep.memory.keeperLair.length === 1) {
                    let gota = Game.getObjectById(creep.memory.keeperLair[0]);
                    if (gota !== null) {
                        if (creep.partyFlag !== undefined && creep.partyFlag.memory.delaySpawn > 10000) {
                            creep.suicide();
                        } else {
                            if (!didHeal) {
                                slpTimer = gota.ticksToSpawn + Game.time - 1;
                                creep.sleep(slpTimer);
                            }
                            //creep.say(didHeal);
                        }
                    }
                }
            } else if (creep.memory.keeperLair !== undefined) {
                let gota = Game.getObjectById(creep.memory.keeperLair[0]);
                if (gota !== null && gota.ticksToSpawn !== undefined) {
                    if (creep.ticksToLive < gota.ticksToSpawn) {
                        creep.suicide();
                    }
                }
            }
            return;
        }


        let bads;
        bads = getHostiles(creep);
        if (bads !== undefined && bads.length > 0) {
            attackCreep(creep, bads);
            creep.memory.goTo = undefined;
            return;
        } else {
            creep.smartHeal();
        }




        if (creep.memory.keeperLair === undefined && creep.atFlagRoom) {
            if (creep.room.name === 'E35S56') {
                creep.memory.keeperLair = [];
                creep.memory.keeperLair.push('59bbc5012052a716c3ce8d5f');
            } else {
                creep.memory.keeperLair = [];
                var lairs = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_KEEPER_LAIR } });
                for (var e in lairs) {
                    creep.memory.keeperLair.push(lairs[e].id);
                }
            }
        }
        if (creep.memory.keeperLair) {
            if (!movement.moveToDefendFlag3(creep)) {
                moveToSK(creep);
            } else {
                let invader = creep.room.invaders;
                if (invader.length > 0)
                    creep.memory.playerTargetId = invader[0].id;
            }
        } else {
            creep.moveMe(creep.partyFlag, { reusePath: 50 });
        }
    }


}
module.exports = roleGuard;