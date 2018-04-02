const scanDelay = 250;
var fox = require('foxGlobals');

function scanHostileBelowToughness(target, toughness) {

    if (target.hits < (target.hitsMax - (toughness * 100))) {
        return true;
    }
    return false;
}


function getBoostTough(body) {
    let toughness = 0;
    var e = body.length;
    while (e--) {
        if (body[e].type == TOUGH && body[e].boost !== undefined) {
            toughness++;
        }
    }
    return toughness;
}

function scanIfNoHealer(target) {
    let zzz = target.pos.findInRange(FIND_CREEPS, 3);
    zzz = _.filter(zzz, function(o) {
        return !_.contains(fox.friends, o.owner.username) && o.getActiveBodyparts(HEAL) > 0;
    });
    if (zzz > 0) {
        return true;
    }
    return false;
}

function getCreepDamage(target, allies) {
    var total = 0;
    var damage;
    var e;
    _.forEach(allies, function(o) {
        if (o.pos.isNearTo(target)) {
            for (e in o.body) {
                if (o.body[e].type === ATTACK) {
                    damage = 30;
                    if (o.body[e].boost !== undefined) {
                        damage *= BOOSTS.attack[o.body[e].boost].attack;
                    }
                    total += damage;
                }
                if (o.body[e].type === RANGED_ATTACK) {
                    damage = 10;
                    if (o.body[e].boost !== undefined) {
                        damage *= BOOSTS.ranged_attack[o.body[e].boost].rangedAttack;
                    }
                    total += damage;
                }

            }
        } else if (o.pos.getRangeTo(target) <= 3) {
            for (e in o.body) {
                if (o.body[e].type === RANGED_ATTACK) {
                    damage = 10;
                    if (o.body[e].boost !== undefined) {
                        damage *= BOOSTS.ranged_attack[o.body[e].boost].rangedAttack;
                    }
                    total += damage;
                }

            }
        }
    });
    return total;
}

function getTowerDamage(target, towers) {
    var totalDamage = 0;
    for (var e in towers) {
        if (towers[e].energy > 10) {
            var range = target.pos.getRangeTo(towers[e]);
            if (range <= 5) {
                totalDamage += 600;
            } else if (range >= 20) {
                totalDamage += 150;
            } else {
                range -= 5;
                var damage = 150 + 30 * range;

                totalDamage += damage;
            }
        }
        //      showTowerRange(towers[e]);
    }
    return totalDamage;
}

function calcuateDamage(body, amount) {
    var toughType;
    for (var a in body) {
        if (body[a].boost !== undefined && body[a].type == TOUGH) {
            return amount * BOOSTS.tough[body[a].boost].damage;
        }
    }
    return amount;
}

function findAttacker(enemies) {
    for (var e in enemies) {
        for (var a in enemies[e].body) {
            if (enemies[e].body[a].type == ATTACK || enemies[e].body[a].type == RANGED_ATTACK)
                return true;

        }
    }
    return false;
}

function estimateDamageAndAttack(target, allies, towers) {
    var totalDamage = 0;
    totalDamage += getTowerDamage(target, towers);
    totalDamage += getCreepDamage(target, allies);
    var toughParts = getBoostTough(target.body);
    var totalToughHp = toughParts * 100;
    var damageTotal = calcuateDamage(target.body, totalDamage);
    var currentLossHp = target.hitsMax - target.hits;
    target.room.visual.text(damageTotal, target.pos, { color: 'green', font: 0.8 });
    if (damageTotal + currentLossHp < totalToughHp && toughParts > 0) {
        return false;
    }
if(Game.shard.name == 'shard2')
    console.log('est damage',toughParts, target, totalToughHp, damageTotal, damageTotal > totalToughHp);
    target.room.visual.text(damageTotal, target.pos, { color: 'red', font: 0.8 });
    //    console.log(damageTotal, target.pos);
    var e;
    for (e in towers) {
        console.log(towers[e].attack(target), 'focus fire @',target);
    }
    for (e in allies) {
        if (allies[e].getActiveBodyparts(ATTACK) > 0) {
            allies[e].attack(target);
        }
        if (allies[e].getActiveBodyparts(RANGED_ATTACK) > 0) {
            allies[e].rangedAttack(target);
        }
    }
    return true;
}

// This function should do one of two things - return false/undefined means that no focus.
// or a bad guy that has less hp than his toughness parts, so he takes more damage.
function analyzedBads(hostiles) {
    var e = hostiles.length;
    while (e--) {
        var toughNess = getBoostTough(hostiles[e].body);
        if (toughNess > 0) {
            if (scanHostileBelowToughness(hostiles[e])) {
                return hostiles[e];
            }
            if (scanIfNoHealer(hostiles[e])) {
                return hostiles[e];
            }
        }
    }
    return false;
}

function defendRoom(towers, hostiles) {
    if (hostiles.length === 0) return false;
    var e;
    if (towers[0].room.controller.safeMode !== undefined) {
        e = towers.length;
        while (e--) {
            if (towers[e].energy > 0) {
                let zz = Math.floor(Math.random() * hostiles.length);
                showTowerRange(towers[e]);
                towers[e].attack(hostiles[zz]);
            }
        }
        return;
    }
    if (hostiles[0].owner.username !== 'Invader') {

    }
    /*else if (hostiles[0].owner.username !== 'Invader') {


        // Random attack targets
        // Until one of them gets below toughness hp
        let focusTarget = analyzedBads(hostiles);
        var whatToDo = Math.floor(Math.random() * 2);
        var toughNess;


        // Here is the test for troll healer
        var towerTroll = _.filter(hostiles, function(o) {
            return (o.getActiveBodyparts(TOUGH) > 0 && o.getActiveBodyparts(HEAL) > 0 && o.getActiveBodyparts(ATTACK) === 0 && o.getActiveBodyparts(WORK) === 0 && o.getActiveBodyparts(RANGED_ATTACK) === 0);
        });
        if (towerTroll.length === hostiles.length) return false;

        if (!focusTarget) {
            e = towers.length;
            if (whatToDo === 2) {
                focusTarget = hostiles.sort((a, b) => a.hits - b.hits);
                if (focusTarget.length > 1) {
                    focusTarget = focusTarget[1];
                } else {
                    focusTarget = focusTarget[0];
                }
            }

        } else {
            e = towers.length;
            while (e--) {
                if (towers[e].energy > 100) {
                    toughNess = getBoostTough(hostiles[e].body);
                    if (toughNess === 0) {
                        showTowerRange(towers[e]);
                        towers[e].attack(focusTarget);
                    }
                }
            }
        }
        return true;


    }*/
    else {
        e = towers.length;
        while (e--) {
            if (towers[e].energy > 0) {
                let zz = Math.floor(Math.random() * hostiles.length);

                //                showTowerRange(towers[e]);
                towers[e].attack(hostiles[zz]);



            }
        }
        return true;
    }
}

function healRoom(towers, hurt) {
    if (hurt.length === 0) return false;
    if (hurt.length > 0) {
        var e = towers.length;
        while (e--) {
            if (towers[e].energy > 0) {

                // showTowerRange(towers[e]);
                towers[e].heal(hurt[0]);
            }
        }
    }
    return true;
}

function repairRoom(towers) { // This function is given all the towers in a room.
    if (towers[0].room.memory.repairQuery === undefined) {
        towers[0].room.memory.repairQuery = [];
    }
    if (towers[0].room.memory.repairQuery.length === 0) return false;
    let needs = towers[0].room.memory.repairQuery;
    let towerNum = 0;
    let towerMax = towers.length - 1;
    var e = needs.length;
    while (e--) {
        let target = Game.getObjectById(needs[e]);
        if (target === null) {
            needs.splice(e, 1);
        } else if (target.hits > target.hitsMax - 1000) {
            needs.splice(e, 1);
        } else if (target.structureType == STRUCTURE_RAMPART && target.hits > 10000) {
            needs.splice(e, 1);
        } else {
            if (towers[towerNum] !== undefined) {
                towers[towerNum].repair(target);
                showTowerRange(towers[towerNum]);
            }
            towerNum++;
        }
    }

}



function doTowerVis(tower) {
    let color = '#66CCFF';

    if (tower.room === undefined) return;
    tower.room.visual.rect(tower.pos.x - 20, tower.pos.y - 20, 40, 40, {
        stroke: 'white',
        lineStyle: 'dashed',
        opacity: 0.01,
        fill: color,
        strokeWidth: 0.2
    });
    tower.room.visual.rect(tower.pos.x - 15, tower.pos.y - 15, 30, 30, {
        stroke: 'white',
        lineStyle: 'dashed',
        opacity: 0.01,
        fill: color,
        strokeWidth: 0.2
    });
    tower.room.visual.rect(tower.pos.x - 10, tower.pos.y - 10, 20, 20, {
        stroke: 'white',
        lineStyle: 'dashed',
        opacity: 0.01,
        fill: color,
        strokeWidth: 0.2
    });
    tower.room.visual.rect(tower.pos.x - 5, tower.pos.y - 5, 10, 10, {
        stroke: 'white',
        strokeWidth: 0.2,
        lineStyle: 'dashed',
        opacity: 0.01,
        fill: color
    });
}

function showTowerRange(tower) {
    if (_.isArray(tower)) {
        var a = tower.length;
        while (a--) {
            doTowerVis(tower[a]);
        }
    } else {
        doTowerVis(tower);
    }
}

function scanForRepair(troom) {
    if (troom.memory.repairQuery === undefined) {
        troom.memory.repairQuery = [];
    }
    if (troom.memory.timedScan === undefined) {
        troom.memory.timedScan = scanDelay;
    }
    if (troom.memory.timedScan > 0) {
        troom.memory.timedScan--;
        return false;
    }
    troom.memory.timedScan = scanDelay;
    let repairs = troom.find(FIND_STRUCTURES);
    repairs = _.filter(repairs, function(structure) {
        return ((structure.structureType == STRUCTURE_RAMPART) && structure.hits == 1);
    });
    for (var e in repairs) {
        troom.memory.repairQuery.push(repairs[e].id);
    }

    repairs = troom.find(FIND_STRUCTURES);
    repairs = _.filter(repairs, function(structure) {
        return ((structure.structureType != STRUCTURE_WALL &&
            structure.structureType != STRUCTURE_RAMPART) && structure.hits < structure.hitsMax - 1000);
    });
    if (repairs.length === 0) return false;
    var o = repairs.length;
    while (o--) {
        troom.memory.repairQuery.push(repairs[o].id);
    }


    troom.memory.repairQuery = _.uniq(troom.memory.repairQuery);
}

function repairRampart(towers) {
    let lowest;
    if (towers[0].room.memory.towerRepairID === undefined) {
        let targets = towers[0].room.find(FIND_STRUCTURES);

        targets = _.filter(targets, function(object) {
            return (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART);
        }); //.sort((a, b) => a.hits - b.hits);
        lowest = _.min(targets, o => o.hits);
        towers[0].room.memory.towerRepairID = lowest.id;
    }
    if (_.isArray(towers)) {

        let target = Game.getObjectById(towers[0].room.memory.towerRepairID);
        if (target !== null) {
            for (var a in towers) {
                if (towers[a].energy > 400)
                    towers[a].repair(target);
            }
        }
    } else {

        let target = Game.getObjectById(towers[0].room.memory.towerRepairID);
        if (towers.energy > 400)
            towers.repair(target);
    }
}

class roleTower {
    /*
        static rescan(tower) {
            tower.room.memory.structures = undefined;
        } */

    /** @param {Creep} creep **/
    static run(roomName) {
        //    var total = 0;
        var towers;
        var room = Game.rooms[roomName];
        if (room.memory.towers === undefined) {
            room.memory.towers = [];

            towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES);
            towers = _.filter(towers, function(o) {
                return o.structureType == STRUCTURE_TOWER;
            });
            for (var i in towers) {
                room.memory.towers.push(towers[i].id);
            }
        }

        towers = [];
        for (var ea in room.memory.towers) {
            var zz = Game.getObjectById(room.memory.towers[ea]);
            if (zz !== null) towers.push(zz);
        }

        if (Memory.towerTarget !== 'none') {
            let zzz = Game.getObjectById(Memory.towerTarget);
            if (zzz !== null && zzz.room.name == towers[0].room.name) {
                var a = towers.length;
                while (a--) {
                    towers[a].attack(zzz);
                }
                return true;
            }
        }

        if (towers.length > 0) {
            showTowerRange(towers);
            var creeps = Game.rooms[roomName].find(FIND_CREEPS);
            var hostiles = _.filter(creeps, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            //        if(hostiles.length > 0) {
            // Here we need to find a rampartFlag in the room
            // IF we find one, we should look at the timer of how long it's been there.
            //  spawn.room.createFlag(nearRampart[0].pos, named, COLOR_PURPLE);
            /*            var named = 'rampartD' + roomName;
                        let zz = Game.flags[named];
                        if (zz !== undefined) { // Here we say if the attack has gone on for 500 ticks, we're not going to kill it
                            // SO we should just repair and make it longer
                            for (var bad in hostiles) {
                                if (estimateDamageAndAttack(hostiles[bad], mycreeps, towers)) {
                                    return;
                                }
                            }
                            if (zz.memory.invaderTimed > 350) {
                                repairRampart(towers);
                            }
                        } */
            //      }
            var hurt = _.filter(creeps, function(thisCreep) {
                return thisCreep.hits < thisCreep.hitsMax && _.contains(fox.friends, thisCreep.owner.username);
            });

            var named = 'rampartD' + roomName;
            let zz = Game.flags[named];
            if (zz !== undefined) { // Here we say if the attack has gone on for 500 ticks, we're not going to kill it
                // SO we should just repair and make it longer
                if (!healRoom(towers, hurt)) {
                    if (!defendRoom(towers, hostiles)) {}
                }
            } else {

                if (!defendRoom(towers, hostiles)) {
                    if (!healRoom(towers, hurt)) {
                        repairRoom(towers);
                    }
                }
            }

            if (hostiles.length > 0) {
                for (var e in hostiles) {
                    if (hostiles[e].owner.username !== 'Invader') {
                        if (estimateDamageAndAttack(hostiles[e], hostiles[e].room.find(FIND_MY_CREEPS), towers)) {
                            console.log("KILLING", hostiles[e].room.name);
                            return;
                        }

                    }
                }
            }

            scanForRepair(towers[0].room);

        }


    }
}

module.exports = roleTower;