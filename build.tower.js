var allies;

function scanHostileBelowToughness(target) {
    // What we want from scanbody, an list of tough parts that are enhanced

    //    let target = Game.getObjectById(creepid);
    let body = target.body;
    let toughness = 0;
    for (var e in body) {
        //     console.log(body[e].type,body[e].boost);
        if (body[e].type == TOUGH && body[e].boost !== undefined) {
            toughness++;
        }
    }
    if (toughness === 0) return false;
    // after getting the  # of toughs, then multiple that by 100.

    if (target.hits < (target.hitsMax - (toughness * 100))) {
        return true;
    }
    return false;
}

// This function should do one of two things - return false/undefined means that no focus.
// or a bad guy that has less hp than his toughness parts, so he takes more damage.
function analyzedBads(hostiles) {
    for (var e in hostiles) {
        if (scanHostileBelowToughness(hostiles[e])) {
            return hostiles[e];
        }
    }
    return false;
}

function defendRoom(towers, hostiles) {
    if (hostiles.length === 0) return false;

    // Random attack targets
    // Until one of them gets below toughness hp
    let focusTarget = analyzedBads(hostiles);
    if (!focusTarget) {
        for (var e in towers) {
            if (towers[e].energy > 0) {
                let zz = Math.floor(Math.random() * hostiles.length);
                let zzz = Game.getObjectById('58fd0a6a344ac64d3b4ac231');
                //            if(zzz != undefined) {
                //              towers[e].attack(zzz);
                //                }else {
                showTowerRange(towers[e]);
                towers[e].attack(hostiles[zz]);
                //          }
            }
        }
    } else {
        for (var o in towers) {
            if (towers[o].energy > 0) {
                showTowerRange(towers[o]);
                towers[o].attack(focusTarget);
            }
        }
    }
    return true;
}

function healRoom(towers, hurt) {
    if (hurt.length === 0) return false;
    if (hurt.length > 0) {
        for (var e in towers) {
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

    for (var e in needs) {
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

    for (var o in repairs) {
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
                return o.owner.username != 'zolox';
            });
            //        if(hostiles.length > 0) {
            // Here we need to find a rampartFlag in the room
            // IF we find one, we should look at the timer of how long it's been there.
            //  spawn.room.createFlag(nearRampart[0].pos, named, COLOR_PURPLE);
            var named = 'rampartD' + roomName;
            let zz = Game.flags[named];
            if (zz !== undefined) { // Here we say if the attack has gone on for 500 ticks, we're not going to kill it
                // SO we should just repair and make it longer
                if (zz.memory.invaderTimed > 750) {
                    repairRampart(towers);
                    return;
                }
            }
            //      }
            var hurt = Game.rooms[roomName].find(FIND_MY_CREEPS);
            hurt = _.filter(hurt, function(thisCreep) {
                return thisCreep.hits < thisCreep.hitsMax;
            });
            //        showTowerRange(towers);

            if (!defendRoom(towers, hostiles)) {
                if (!healRoom(towers, hurt)) {
                    repairRoom(towers);
                }
            }

            scanForRepair(towers[0].room);

        }


    }
}

module.exports = roleTower;
