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
    let zzz = _.filter(target.pos.findInRange(target.room.enemies, 3), function(o) {
        return o.getActiveBodyparts(HEAL) > 0;
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
        var towerDamage = 0;
        if (towers[e].energy > 10) {
            var range = target.pos.getRangeTo(towers[e]);
            if (range <= 5) {
                towerDamage += 600;
            } else if (range >= 20) {
                towerDamage += 150;
            } else {
                range -= 5;
                var damage = 150 + 30 * range;

                towerDamage += damage;
            }
        }
        let multipler = 1.00;
        if (towers[e].effects) {
            for (let i in towers[e].effects) {
                console.log(towers[e].effects[i].power, towers[e].effects[i].level, "twer effects in effect");
                if (towers[e].effects[i].power === PWR_DISRUPT_TOWER) {
                    multipler -= 0.10 * towers[e].effects[i].level;
                }
                if (towers[e].effects[i].power === PWR_OPERATE_TOWER) {
                    multipler += 0.10 * towers[e].effects[i].level;
                }
            }
            towerDamage = towerDamage * multipler;
            console.log(towerDamage, towerDamage * multipler, multipler);
        }
        totalDamage += towerDamage;
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
    //    if (Game.shard.name == 'shard2')
    //        console.log('est damage', toughParts, target, totalToughHp, damageTotal, damageTotal > totalToughHp);
    target.room.visual.text(damageTotal, target.pos, { color: 'red', font: 0.8 });
    //    console.log(damageTotal, target.pos);
    var e;
    for (e in towers) {
        towers[e].attack(target);
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
    } else {
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


function getTowerHeal(target, tower) {
    var range = target.pos.getRangeTo(tower);
    let heal = 0;
    if (range <= 5) {
        heal = 400;
    } else if (range >= 20) {
        heal = 100;
    } else {
        heal = 400 - (20 * (range - 5));
    }


    if (tower.effects) {
        let multipler = 1.00;
        for (let i in tower.effects) {
            console.log(tower.effects[i].power, tower.effects[i].level, "twer effects in effect");
            if (tower.effects[i].power === PWR_DISRUPT_TOWER) {
                multipler -= 0.10 * tower.effects[i].level;
            }
            if (tower.effects[i].power === PWR_OPERATE_TOWER) {
                multipler += 0.10 * tower.effects[i].level;
            }
        }
        heal = heal * multipler;
        console.log(heal, heal * multipler, multipler);
    }
    return heal;

}

function healRoom(towers, hurt) {
    if (hurt.length === 0) return false;
    var target = 0;
    if (hurt.length > 0) {
        var e = towers.length;
        var totalHeal = 0;
        while (e--) {
            if (towers[e].energy > 0) {

                // showTowerRange(towers[e]);
                // 400 hits at range ≤5 to 100 hits at range ≥20
                // we calcuate heal and,
                let didHeal = towers[e].heal(hurt[target]);
                if (hurt[target].memory && (hurt[target].memory.party === undefined || hurt[target].memory.role === 'ztransport')) {
                    let heal = getTowerHeal(hurt[target], towers[e]);
                    totalHeal = totalHeal + heal;
                    //                    console.log(didHeal, target, 'doing tower heal@', roomLink(towers[e].room.name), heal, totalHeal, hurt[target].hits + totalHeal, ">", hurt[target].hitsMax);
                    if (hurt[target].hits + totalHeal >= hurt[target].hitsMax) {
                        target++;
                        totalHeal = 0;
                    }
                    if (target >= hurt.length) {
                        break;
                    }
                }
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
    let repairTargets = towers[0].room.memory.repairQuery;
    let towerNum = 0;
    let towerMax = towers.length - 1;
    var e = repairTargets.length;
    while (e--) {
        let target = Game.getObjectById(repairTargets[e]);
        if (target === null) {
            repairTargets.splice(e, 1);
        } else if (target.hits > target.hitsMax - 1000) {
            repairTargets.splice(e, 1);
        } else if (target.structureType == STRUCTURE_RAMPART && target.hits > 10000) {
            repairTargets.splice(e, 1);
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
    if (1 === 1) return;
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


    /* repairs = troom.find(FIND_STRUCTURES);
    repairs = _.filter(repairs, function(structure) {
        return ((structure.structureType == STRUCTURE_RAMPART) && structure.hits == 1);
    });
    for (var e in repairs) {
        troom.memory.repairQuery.push(repairs[e].id);
    }*/

    let repairs = troom.find(FIND_STRUCTURES);
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

function analyzeCreeps(hostiles) {
    if (hostiles[0].owner.username === 'Invader') return;
    console.log(roomLink(hostiles[0].pos.roomName), "Non-NPC Creep:", hostiles.length, "# Owner:", hostiles[0].owner.username, "Size", hostiles[0].body.length);
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

function getTower(roomName) {
    var room = Game.rooms[roomName];
    let towers;
    if (room.memory.towers === undefined || (Game.time % 1000 && room.memory.towers.length !== 6)) {
        room.memory.towers = [];
        towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES);
        towers = _.filter(towers, function(o) {
            return o.structureType == STRUCTURE_TOWER;
        });
        for (var i in towers) {
            if (towers[i].id !== null)
                room.memory.towers.push(towers[i].id);
        }
    }

    if (towers === undefined) {
        towers = [];
        for (let e in room.memory.towers) {
            let tgt = Game.getObjectById(room.memory.towers[e]);
            if (tgt !== null) {
                towers.push(tgt);
            } else {
                room.memory.towers[e] = undefined;
            }
        }
    }
    return towers;
}


function killTunnel(currentRoomName, roomName, rampartID, tunnelID) {
    if (currentRoomName === roomName) {
        let ramp = Game.getObjectById(rampartID);
        let tgt = Game.getObjectById(tunnelID);
        if (tgt && ramp) {
            tgt.room.visual.line(tgt.pos, ramp.pos, { color: 'blue' });
        }

        if (!ramp || ramp.hits < 5000000) {
            if (tgt) {
                tgt.room.visual.line(tgt.pos, ramp.pos, { color: 'blue' });
                let towers = getTower(currentRoomName);
                for (let ee in towers) {
                    towers[ee].attack(tgt);
                }
                return true;
            }

        }
    }
    return false;
}



class roleTower {
    static roomTower(roomName) {
        if (Game.rooms[roomName].memory.skipTowerRun) {
            Game.rooms[roomName].memory.skipTowerRun--;
            if (Game.rooms[roomName].memory.skipTowerRun < 0) {
                Game.rooms[roomName].memory.skipTowerRun = undefined;
            }
            return 10;
        }
        if (killTunnel(roomName, 'E22S48', '5ba6a54e3760ec59ac8eec02', '5ba67a6180805f18ccae3df1')) return;
        if (killTunnel(roomName, 'E14S43', '5af49fa99b07cd553dd3974a', '5bb2b255d55a4d405c63e77a')) return;

        var towers;
//        var hostiles = Game.rooms[roomName].notAllies;
        var hostiles = _.filter(Game.rooms[roomName].find(FIND_HOSTILE_CREEPS), function(o) {
                    return !_.contains(fox.friends, o.owner.username);
                });
        var hurt = Game.rooms[roomName].myHurtCreeps;
        scanForRepair(Game.rooms[roomName]);
        var repair = Game.rooms[roomName].memory.repairQuery;
        if (hostiles.length === 0 && hurt.length === 0 && repair.length === 0) {
            Game.rooms[roomName].memory.skipTowerRun = 3; //Math.floor(Math.random()*5)+1;
            if (Game.rooms[roomName].controller.isPowerEnabled) {
                let myPwerCrps = Game.rooms[roomName].myPowerCreeps;
                //let pwerCrps = Game.rooms[roomName].enemyPowerCreeps;

                if (myPwerCrps) {
                    myPwerCrps = _.filter(myPwerCrps, function(o) {
                        return o.hits < o.hitsMax;
                    });
                    if (myPwerCrps.length > 0) {
                        console.log(myPwerCrps.length, roomName, 'needs healing Pwr Crp');
                        healRoom(getTower(roomName),myPwerCrps);
                    }
                }
            }
            return false;
        }



        towers = getTower(roomName);
        if (towers.length === 0) return;

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


        //            showTowerRange(towers);
        //            var creeps = Game.rooms[roomName].notAllies;

        /*var named = 'rampartD' + roomName;
        let zz = Game.flags[named];
        if (zz !== undefined) { // Here we say if the attack has gone on for 500 ticks, we're not going to kill it
            // SO we should just repair and make it longer
            if (!healRoom(towers, hurt)) {
                if (!defendRoom(towers, hostiles)) {}
            }
        } else { */


        if (hostiles.length > 0) {
            if (hostiles[0].owner.username === 'Invader' || Game.rooms[roomName].controller.safeMode) {
                defendRoom(towers, hostiles);
            } else {
                for (var e in hostiles) {
                    if (estimateDamageAndAttack(hostiles[e], hostiles[e].room.find(FIND_MY_CREEPS), towers)) {
                        console.log("KILLING", roomLink(hostiles[e].room.name), hostiles[e].owner.username);
                        return;
                    }
                }
            }
        } else if (hurt.length > 0) {
            healRoom(towers, hurt);
        } else {
            repairRoom(towers);

        }

    }
}

module.exports = roleTower;