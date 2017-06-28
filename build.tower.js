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
        return !_.contains(fox.friends, o.owner.username);
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
        var range = target.pos.getRangeTo(towers[e]);
        if (range <= 5) {
            totalDamage += 600;
        } else if (range >= 20) {
            totalDamage += 150;
        } else {
            range -= 5;
            var damage = 150 + 30 * range;
            //            console.log(totalDamage, target.pos, damage, range, "Yo");
            totalDamage += damage;
        }
        //      showTowerRange(towers[e]);
    }
    return totalDamage;
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

function calcuateDamage(body, amount) {
    var toughType;
    for (var a in body) {
        if (body[a].boost !== undefined && body[a].type == TOUGH) {
            return amount * BOOST.tough[body[a].boost].damage;
        }
    }
    return amount;
}

function estimateDamageAndAttack(target, allies, towers) {
    var totalDamage = 0;
    totalDamage += getTowerDamage(target, towers);
    totalDamage += getCreepDamage(target, allies);
    //    totalDamage += getRangedDamage(target, allies);
    var totalToughHp = getBoostTough(target.body) * 100;
    var damageTotal = calcuateDamage(target.body, totalDamage);
    var currentLossHp = creep.hitsMax - creep.hits;
    if (damageTotal + currentLossHp < totalToughHp) return false;

    console.log(target, totalToughHp, damageTotal, damageTotal > totalToughHp);
    target.room.visual.text(calcuateDamage(target.body, totalDamage), target.pos, { color: 'green', font: 0.8 });

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
    if (hostiles[0].owner.username !== 'Invader') {


        // Random attack targets
        // Until one of them gets below toughness hp
        let focusTarget = analyzedBads(hostiles);
        var toughNess;
        if (!focusTarget) {
            e = towers.length;
            while (e--) {
                if (towers[e].energy > 0) {
                    if (hostiles.length > 1) {
                        let zz = Math.floor(Math.random() * hostiles.length);
                        //                        let focus = Game.getObjectById('58fd0a6a344ac64d3b4ac231');
                        //                      if (focus != null) {
                        //                        towers[e].attack(focus);
                        //                  } else {
                        if (hostiles[zz].getActiveBodyparts(HEAL) > 0 && hostiles[zz].getActiveBodyparts(ATTACK) === 0)
                            toughNess = getBoostTough(hostiles[zz].body);
                        if (toughNess === 0) {
                            showTowerRange(towers[e]);
                            towers[e].attack(hostiles[zz]);
                        }
                        //                }
                    }
                }
            }
        } else {
            e = towers.length;
            while (e--) {
                if (towers[e].energy > 0) {
                    toughNess = getBoostTough(hostiles[zz].body);
                    if (toughNess === 0) {
                        showTowerRange(towers[e]);
                        towers[e].attack(focusTarget);
                    }
                }
            }
        }
        return true;


    } else {
        e = towers.length;
        while (e--) {
            if (towers[e].energy > 0) {
                let zz = Math.floor(Math.random() * hostiles.length);
                showTowerRange(towers[e]);
                towers[e].attack(hostiles[zz]);
            }
        }
    }
}

function healRoom(towers, hurt) {
    //    console.log(towers[0].room.name);
    if (hurt.length === 0) return false;
    if (hurt.length > 0) {
        var e = towers.length;
        while (e--) {
            if (towers[e].energy > 0) {

                showTowerRange(towers[e]);
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
    //  console.log('scan repair tower',towers[0].room.memory.repairQuery.length,towers.length);
    if (towers[0].room.memory.repairQuery.length === 0) return false;
    //    console.log('Towers repairing');
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
            //        if(towerNum > towerMax) return;
        }
    }

}

var scanDelay = 250;

function showTowerRange(tower) {
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
    /*    tower.room.visual.circle(tower.pos, {
            fill: 'transparent', radius: 20, stroke: 'white',lineStyle:'dashed',opacity:.01,fill:color
        })
        tower.room.visual.circle(tower.pos, {
            fill: 'transparent', radius: 15, stroke: 'white',opacity:.01,fill:color
        })
        tower.room.visual.circle(tower.pos, {
            fill: 'transparent', radius: 10, stroke: 'white',opacity:.02,fill:color
        })
        tower.room.visual.circle(tower.pos, {
            fill: 'transparent', radius: 5, stroke: 'white',opacity:.02,fill:'#FFFFFF'
        })*/
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
        //        console.log('no scan',troom.memory.timedScan);
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
    //console.log(troom,'scanned',troom.memory.repairQuery.length);
}

function repairRampart(towers) {
    if (towers[0].room.memory.towerRepairID === undefined) {
        let targets = towers[0].room.find(FIND_STRUCTURES);

        targets = _.filter(targets, function(object) {
            return (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART);
        }).sort((a, b) => a.hits - b.hits);
        towers[0].room.memory.towerRepairID = targets[0].id;
    }

    let target = Game.getObjectById(towers[0].room.memory.towerRepairID);
    if (target !== null) {
        for (var a in towers) {
            towers[a].repair(target);
        }
    }
}



var constr = require('commands.toStructure');
var fox = require('foxGlobals');
//var towerSafe =  ['zolox','admon84']
class roleTower {
    /*
        static rescan(tower) {
            tower.room.memory.structures = undefined;
        } */

    /** @param {Creep} creep **/
    static run(roomName) {
        //    var total = 0;
        var towers = Game.rooms[roomName].find(FIND_MY_STRUCTURES);
        towers = _.filter(towers, function(o) {
            return o.structureType == STRUCTURE_TOWER;
        });

        if (towers.length > 0) {
            //                showTowerRange(towers);  
            var hostiles = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
            hostiles = _.filter(hostiles, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            //        if(hostiles.length > 0) {
            // Here we need to find a rampartFlag in the room
            // IF we find one, we should look at the timer of how long it's been there.
            //  spawn.room.createFlag(nearRampart[0].pos, named, COLOR_PURPLE);
            var named = 'rampartD' + roomName;
            let zz = Game.flags[named];
            if (zz !== undefined) { // Here we say if the attack has gone on for 500 ticks, we're not going to kill it
                // SO we should just repair and make it longer
                if (zz.memory.invaderTimed > 500) {
                    repairRampart(towers);
                    return;
                }
            }
            //      }
            var mycreeps = Game.rooms[roomName].find(FIND_MY_CREEPS);
            var hurt = _.filter(mycreeps, function(thisCreep) {
                return thisCreep.hits < thisCreep.hitsMax;
            });
            //        showTowerRange(towers);
            if (!defendRoom(towers, hostiles)) {
                if (!healRoom(towers, hurt)) {
                    repairRoom(towers);
                }
            }
            if (hostiles.length > 0) {
                if (roomName == 'E35S83') {
                    for (var e in hostiles) {
                        if (estimateDamageAndAttack(hostiles[e], mycreeps, towers)) {
                            console.log("KILLING", hostiles[e]);
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
