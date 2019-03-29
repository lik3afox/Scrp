// Commands to structure
// Way for creep to interact wtih repair/build and constructionsite
// This needs to be fixed for goal and not to find a goal every tick


function getConstruction(creep) {
    let sites = creep.room.find(FIND_CONSTRUCTION_SITES);
    if(creep.room.controller && creep.room.controller.level === 6 && !creep.room.terminal){
    let    site2s = _.filter(sites, function(o) {
        return o.structureType === STRUCTURE_TERMINAL;
    }); // This is something is not on a rampart
        if(site2s.length > 0){
            return site2s;
        }
    }
    return sites;
}

function clearAllConstruction(creep) {
    var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    for (var i in sites) {
        sites[i].remove();
    }
}

var buildOnLevel = [
{"name":"E13S18","shard":"shard1","rcl":"3","buildings":{"spawn":{"pos":[{"x":19,"y":16}]},"tower":{"pos":[{"x":20,"y":17}]},"road":{"pos":[{"x":18,"y":18},{"x":17,"y":19},{"x":16,"y":20},{"x":15,"y":21},{"x":16,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":19,"y":22},{"x":20,"y":21},{"x":21,"y":20},{"x":20,"y":19},{"x":19,"y":18}]},"extension":{"pos":[{"x":19,"y":19},{"x":20,"y":20},{"x":19,"y":20},{"x":18,"y":19},{"x":18,"y":20},{"x":19,"y":21},{"x":18,"y":21},{"x":17,"y":20},{"x":17,"y":21},{"x":16,"y":21}]}}},
{"name":"E13S18","shard":"shard1","rcl":"4","buildings":{"spawn":{"pos":[{"x":19,"y":16}]},"tower":{"pos":[{"x":20,"y":17}]},"road":{"pos":[{"x":18,"y":18},{"x":17,"y":19},{"x":16,"y":20},{"x":15,"y":21},{"x":16,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":19,"y":22},{"x":20,"y":21},{"x":21,"y":20},{"x":20,"y":19},{"x":19,"y":18},{"x":14,"y":20},{"x":13,"y":19},{"x":12,"y":18},{"x":11,"y":17},{"x":10,"y":18},{"x":9,"y":19},{"x":9,"y":20},{"x":10,"y":21},{"x":11,"y":22},{"x":12,"y":23},{"x":13,"y":24},{"x":14,"y":25},{"x":15,"y":26},{"x":16,"y":25},{"x":17,"y":24}]},"extension":{"pos":[{"x":19,"y":19},{"x":20,"y":20},{"x":19,"y":20},{"x":18,"y":19},{"x":18,"y":20},{"x":19,"y":21},{"x":18,"y":21},{"x":17,"y":20},{"x":17,"y":21},{"x":16,"y":21},{"x":17,"y":22},{"x":18,"y":22},{"x":11,"y":18},{"x":10,"y":19},{"x":10,"y":20},{"x":11,"y":19},{"x":11,"y":20},{"x":12,"y":19},{"x":11,"y":21},{"x":12,"y":20}]},"storage":{"pos":[{"x":17,"y":16}]}}},
{"name":"E13S18","shard":"shard1","rcl":"5","buildings":{"spawn":{"pos":[{"x":19,"y":16}]},"tower":{"pos":[{"x":20,"y":17},{"x":20,"y":18}]},"road":{"pos":[{"x":18,"y":18},{"x":17,"y":19},{"x":16,"y":20},{"x":15,"y":21},{"x":16,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":19,"y":22},{"x":20,"y":21},{"x":21,"y":20},{"x":20,"y":19},{"x":19,"y":18},{"x":14,"y":20},{"x":13,"y":19},{"x":12,"y":18},{"x":11,"y":17},{"x":10,"y":18},{"x":9,"y":19},{"x":9,"y":20},{"x":10,"y":21},{"x":11,"y":22},{"x":12,"y":23},{"x":13,"y":24},{"x":14,"y":25},{"x":15,"y":26},{"x":16,"y":25},{"x":17,"y":24}]},"extension":{"pos":[{"x":19,"y":19},{"x":20,"y":20},{"x":19,"y":20},{"x":18,"y":19},{"x":18,"y":20},{"x":19,"y":21},{"x":18,"y":21},{"x":17,"y":20},{"x":17,"y":21},{"x":16,"y":21},{"x":17,"y":22},{"x":18,"y":22},{"x":11,"y":18},{"x":10,"y":19},{"x":10,"y":20},{"x":11,"y":19},{"x":11,"y":20},{"x":12,"y":19},{"x":11,"y":21},{"x":12,"y":20},{"x":12,"y":21},{"x":12,"y":22},{"x":13,"y":22},{"x":13,"y":21},{"x":13,"y":20},{"x":13,"y":23},{"x":14,"y":23},{"x":14,"y":24},{"x":14,"y":22},{"x":14,"y":21}]},"storage":{"pos":[{"x":17,"y":16}]},"link":{"pos":[{"x":19,"y":17},{"x":25,"y":44}]}}},
{"name":"E13S18","shard":"shard1","rcl":"6","buildings":{"spawn":{"pos":[{"x":19,"y":16}]},"tower":{"pos":[{"x":20,"y":17},{"x":20,"y":18}]},"road":{"pos":[{"x":18,"y":18},{"x":17,"y":19},{"x":16,"y":20},{"x":15,"y":21},{"x":16,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":19,"y":22},{"x":20,"y":21},{"x":21,"y":20},{"x":20,"y":19},{"x":19,"y":18},{"x":14,"y":20},{"x":13,"y":19},{"x":12,"y":18},{"x":11,"y":17},{"x":10,"y":18},{"x":9,"y":19},{"x":9,"y":20},{"x":10,"y":21},{"x":11,"y":22},{"x":12,"y":23},{"x":13,"y":24},{"x":14,"y":25},{"x":15,"y":26},{"x":16,"y":25},{"x":17,"y":24},{"x":14,"y":27},{"x":13,"y":28},{"x":11,"y":27},{"x":12,"y":28},{"x":10,"y":26},{"x":9,"y":25},{"x":8,"y":24},{"x":7,"y":23},{"x":7,"y":22},{"x":7,"y":21},{"x":8,"y":20}]},"extension":{"pos":[{"x":19,"y":19},{"x":20,"y":20},{"x":19,"y":20},{"x":18,"y":19},{"x":18,"y":20},{"x":19,"y":21},{"x":18,"y":21},{"x":17,"y":20},{"x":17,"y":21},{"x":16,"y":21},{"x":17,"y":22},{"x":18,"y":22},{"x":11,"y":18},{"x":10,"y":19},{"x":10,"y":20},{"x":11,"y":19},{"x":11,"y":20},{"x":12,"y":19},{"x":11,"y":21},{"x":12,"y":20},{"x":12,"y":21},{"x":12,"y":22},{"x":13,"y":22},{"x":13,"y":21},{"x":13,"y":20},{"x":13,"y":23},{"x":14,"y":23},{"x":14,"y":24},{"x":14,"y":22},{"x":14,"y":21},{"x":15,"y":25},{"x":15,"y":24},{"x":15,"y":23},{"x":15,"y":22},{"x":16,"y":24},{"x":16,"y":23},{"x":14,"y":26},{"x":13,"y":27},{"x":13,"y":26},{"x":12,"y":27}]},"storage":{"pos":[{"x":17,"y":16}]},"link":{"pos":[{"x":25,"y":44},{"x":19,"y":17}]},"terminal":{"pos":[{"x":17,"y":18}]},"extractor":{"pos":[{"x":13,"y":46}]},"lab":{"pos":[{"x":15,"y":18}]}}},
{"name":"E13S18","shard":"shard1","rcl":"7","buildings":{"spawn":{"pos":[{"x":19,"y":16},{"x":15,"y":20}]},"tower":{"pos":[{"x":20,"y":17},{"x":20,"y":18},{"x":21,"y":19}]},"road":{"pos":[{"x":18,"y":18},{"x":17,"y":19},{"x":16,"y":20},{"x":15,"y":21},{"x":16,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":19,"y":22},{"x":20,"y":21},{"x":21,"y":20},{"x":20,"y":19},{"x":19,"y":18},{"x":14,"y":20},{"x":13,"y":19},{"x":12,"y":18},{"x":11,"y":17},{"x":10,"y":18},{"x":9,"y":19},{"x":9,"y":20},{"x":10,"y":21},{"x":11,"y":22},{"x":12,"y":23},{"x":13,"y":24},{"x":14,"y":25},{"x":15,"y":26},{"x":16,"y":25},{"x":17,"y":24},{"x":14,"y":27},{"x":13,"y":28},{"x":11,"y":27},{"x":12,"y":28},{"x":10,"y":26},{"x":9,"y":25},{"x":8,"y":24},{"x":7,"y":23},{"x":7,"y":22},{"x":7,"y":21},{"x":8,"y":20}]},"extension":{"pos":[{"x":19,"y":19},{"x":20,"y":20},{"x":19,"y":20},{"x":18,"y":19},{"x":18,"y":20},{"x":19,"y":21},{"x":18,"y":21},{"x":17,"y":20},{"x":17,"y":21},{"x":16,"y":21},{"x":17,"y":22},{"x":18,"y":22},{"x":11,"y":18},{"x":10,"y":19},{"x":10,"y":20},{"x":11,"y":19},{"x":11,"y":20},{"x":12,"y":19},{"x":11,"y":21},{"x":12,"y":20},{"x":12,"y":21},{"x":12,"y":22},{"x":13,"y":22},{"x":13,"y":21},{"x":13,"y":20},{"x":13,"y":23},{"x":14,"y":23},{"x":14,"y":24},{"x":14,"y":22},{"x":14,"y":21},{"x":15,"y":25},{"x":15,"y":24},{"x":15,"y":23},{"x":15,"y":22},{"x":16,"y":24},{"x":16,"y":23},{"x":14,"y":26},{"x":13,"y":27},{"x":13,"y":26},{"x":12,"y":27},{"x":13,"y":25},{"x":12,"y":26},{"x":11,"y":26},{"x":12,"y":25},{"x":12,"y":24},{"x":11,"y":25},{"x":11,"y":24},{"x":11,"y":23},{"x":10,"y":24},{"x":10,"y":25}]},"storage":{"pos":[{"x":17,"y":16}]},"link":{"pos":[{"x":25,"y":44},{"x":19,"y":17}]},"terminal":{"pos":[{"x":17,"y":18}]},"extractor":{"pos":[{"x":13,"y":46}]},"lab":{"pos":[{"x":15,"y":18}]}}},
{"name":"E13S18","shard":"shard1","rcl":"8","buildings":{"spawn":{"pos":[{"x":19,"y":16},{"x":15,"y":20},{"x":16,"y":19}]},"tower":{"pos":[{"x":20,"y":17},{"x":20,"y":18},{"x":21,"y":19},{"x":14,"y":19},{"x":13,"y":18},{"x":12,"y":17}]},"road":{"pos":[{"x":18,"y":18},{"x":17,"y":19},{"x":16,"y":20},{"x":15,"y":21},{"x":16,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":19,"y":22},{"x":20,"y":21},{"x":21,"y":20},{"x":20,"y":19},{"x":19,"y":18},{"x":14,"y":20},{"x":13,"y":19},{"x":12,"y":18},{"x":11,"y":17},{"x":10,"y":18},{"x":9,"y":19},{"x":9,"y":20},{"x":10,"y":21},{"x":11,"y":22},{"x":12,"y":23},{"x":13,"y":24},{"x":14,"y":25},{"x":15,"y":26},{"x":16,"y":25},{"x":17,"y":24},{"x":14,"y":27},{"x":13,"y":28},{"x":11,"y":27},{"x":12,"y":28},{"x":10,"y":26},{"x":9,"y":25},{"x":8,"y":24},{"x":7,"y":23},{"x":7,"y":22},{"x":7,"y":21},{"x":8,"y":20}]},"extension":{"pos":[{"x":19,"y":19},{"x":20,"y":20},{"x":19,"y":20},{"x":18,"y":19},{"x":18,"y":20},{"x":19,"y":21},{"x":18,"y":21},{"x":17,"y":20},{"x":17,"y":21},{"x":16,"y":21},{"x":17,"y":22},{"x":18,"y":22},{"x":11,"y":18},{"x":10,"y":19},{"x":10,"y":20},{"x":11,"y":19},{"x":11,"y":20},{"x":12,"y":19},{"x":11,"y":21},{"x":12,"y":20},{"x":12,"y":21},{"x":12,"y":22},{"x":13,"y":22},{"x":13,"y":21},{"x":13,"y":20},{"x":13,"y":23},{"x":14,"y":23},{"x":14,"y":24},{"x":14,"y":22},{"x":14,"y":21},{"x":15,"y":25},{"x":15,"y":24},{"x":15,"y":23},{"x":15,"y":22},{"x":16,"y":24},{"x":16,"y":23},{"x":14,"y":26},{"x":13,"y":27},{"x":13,"y":26},{"x":12,"y":27},{"x":13,"y":25},{"x":12,"y":26},{"x":11,"y":26},{"x":12,"y":25},{"x":12,"y":24},{"x":11,"y":25},{"x":11,"y":24},{"x":11,"y":23},{"x":10,"y":24},{"x":10,"y":25},{"x":9,"y":24},{"x":9,"y":23},{"x":8,"y":23},{"x":8,"y":22},{"x":8,"y":21},{"x":9,"y":21},{"x":9,"y":22},{"x":10,"y":22},{"x":10,"y":23},{"x":14,"y":28}]},"storage":{"pos":[{"x":17,"y":16}]},"link":{"pos":[{"x":25,"y":44},{"x":19,"y":17}]},"terminal":{"pos":[{"x":17,"y":18}]},"extractor":{"pos":[{"x":13,"y":46}]},"lab":{"pos":[{"x":15,"y":18}]}}},
];

function build(spawn) {
    for (var e in buildOnLevel) {
        if (buildOnLevel[e].name == spawn.pos.roomName && buildOnLevel[e].rcl == spawn.level) {
            var lvlBuild = buildOnLevel[e].buildings;
            for (var a in lvlBuild) {
                for (var i in lvlBuild[a]) {
                    var pos = lvlBuild[a][i].pos;
                    for (var o in lvlBuild[a][i]) {
                        var posLook = spawn.room.lookAt(lvlBuild[a][i][o].x, lvlBuild[a][i][o].y);
                        var makeConSite = true;
                        for (var z in posLook) {
                            if (posLook[z].type == 'structure') {
                                if (posLook[z].structure.structureType == a) {
                                    makeConSite = false;
                                }
                            }
                            if (posLook[z].type == 'constructionSite') {
                                makeConSite = false;
                            }
                        }
                        if (makeConSite) {
                            spawn.room.createConstructionSite(lvlBuild[a][i][o].x, lvlBuild[a][i][o].y, a);
                        }
                    }
                }
            }
        }
    }
}

class StructureInteract {

    static buildConstrLevel(spawn, level) {
        build(spawn, level);
    }

    static withdrawFromTS(creep, range) {

        var tombStone;
        tombStone = Game.getObjectById(creep.memory.tombStoneID);
        if (creep.memory.tombStoneID === undefined || tombStone === null || tombStone.total === 0) {
            let stones;
            if (range !== undefined) {
                stones = creep.pos.findInRange(FIND_TOMBSTONES, range);
            } else {
                stones = creep.room.find(FIND_TOMBSTONES);
            }
            let tombStones = _.filter(stones, function(o) {
                if (o.store[RESOURCE_ENERGY] === o.total) {
                    return o.total > 100;
                } else {
                    return o.total > 0;
                }
            });
  //          if(range !== undefined && tombStones.length > 0)
//                console.log(tombStones.length,'ranged tb found',range,stones.length,roomLink(creep.room.name));

            if (tombStones.length === 0) {
                return false;
            }
            tombStone = creep.pos.findClosestByRange(tombStones);
            creep.memory.tombStoneID = tombStone.id;
        }


        if (tombStone !== null) {
            //            console.log(roomLink(creep.room.name),"doing new tb");
            if (creep.pos.isNearTo(tombStone)) {
                for (let e in tombStone.store) {
                    if (tombStone.store[e] > 0) {
                        creep.withdraw(tombStone, e);
                        return true;
                    }
                }
            } else {
                creep.moveMe(tombStone, { reusePath: 50, maxRooms: 1 });
            }
            return true;


        }
        return false;
    }

    static withdrawFromTombstone(creep, range, energy) {
        var tombStone;
        //        if( creep.room.name === 'E39S57') return false;
        if (creep.carryTotal > 0 && creep.memory.home === creep.room.name && creep.room.storage) {
            //    creep.memory.tombStoneID = undefined;
            creep.moveToTransfer(creep.room.storage, creep.carrying, { reusePath: 30 });
            return false;
        }

        if (energy === undefined) energy = true;
        if (creep.memory.tombStoneID === undefined) {
            if (range !== undefined) {
                tombStone = creep.pos.findInRange(FIND_TOMBSTONES, range);
            } else {
                tombStone = creep.room.find(FIND_TOMBSTONES);
            }
            if (energy) {
                tombStone = _.filter(tombStone, function(o) {
                    return o.total > 10;
                });
            } else {
                tombStone = _.filter(tombStone, function(o) {
                    return (o.total - o.store[RESOURCE_ENERGY]) > 0;
                });

            }

            if (tombStone.length === 0) return false;
            //          creep.say('⚰️' + tombStone.length);
            if (tombStone.length > 0) {
                //                creep.room.visual.line(creep.pos, tombStone[0].pos, { color: 'red' });
                creep.memory.tombStoneID = tombStone[0].id;
                if (creep.pos.isNearTo(tombStone[0])) {
                    if (energy) {
                        var keys = Object.keys(tombStone[0].store);
                        var e = keys.length;
                        var a;
                        while (e--) {
                            a = keys[e];
                            creep.withdraw(tombStone, a);
                        }

                    } else {
                        for (let e in tombStone[0].store) {
                            if (e !== RESOURCE_ENERGY)
                                creep.withdraw(tombStone, e);
                        }
                    }
                } else {
                    creep.moveMe(tombStone[0], { reusePath: 50, maxRooms: 1 });
                }
                return true;
            }
        }


        tombStone = Game.getObjectById(creep.memory.tombStoneID);
        if (tombStone !== null) {
            creep.say('⚰️');
//            creep.room.visual.line(creep.pos, tombStone.pos, { color: 'red' });
            if (energy) {
                if (tombStone.total === 0) {
                    creep.memory.tombStoneID = undefined;
                    return false;
                }
            } else {
                if (tombStone.total - tombStone.store.energy === 0) {
                    creep.memory.tombStoneID = undefined;
                    return false;
                }
            }
            if (!creep.pos.inRangeTo(tombStone, range)) creep.memory.tombStoneID = undefined;

            if (creep.pos.isNearTo(tombStone)) {
                for (let e in tombStone.store) {
                    if (energy) {
                        if (tombStone.store[e] > 0) {
                            creep.withdraw(tombStone, e);
                            return true;
                        }
                    } else {
                        if (tombStone.store[e] > 0 && e !== RESOURCE_ENERGY) {
                            creep.withdraw(tombStone, e);
                            return true;
                        }
                    }
                }
            } else {
                creep.moveTo(tombStone, { reusePath: 50, maxRooms: 1 });
            }
            return true;


        } else {
            creep.memory.tombStoneID = undefined;
        }
        return false;
    }

    static takeSnapShot(roomName) {
        var matrix;
        if (Game.rooms[roomName] === undefined) return false;
        if (Game.rooms[roomName].memory.snapshot === undefined) {
            Game.rooms[roomName].memory.snapshot = [];
            var strucs = Game.rooms[roomName].find(FIND_STRUCTURES);
            for (var e in strucs) {
                matrix = {
                    x: strucs[e].pos.x,
                    y: strucs[e].pos.y,
                    type: strucs[e].structureType
                };
                Game.rooms[roomName].memory.snapshot.push(matrix);
            }

        }
    }

    static checkSnapShot(roomName) {
        if (Game.rooms[roomName] === undefined) return false;
        if (Game.rooms[roomName].memory.snapshot === undefined) return false;
        var snapShot = Game.rooms[roomName].memory.snapshot;
        for (var e in snapShot) {
            var location = new RoomPosition(snapShot[e].x, snapShot[e].y, roomName);
            if (!_.find(location.lookFor(LOOK_STRUCTURES), { structureType: snapShot[e].type })) {
                Game.rooms[roomName].createConstructionSite(location.x, location.y, snapShot[e].type);

            }
        }
        //let structures = this.lookFor(LOOK_STRUCTURES);
        //return _.find(structures, { structureType: structureType });

    }

    static doCloseRoadRepair(creep) {

        let atFeet = creep.room.lookAt(creep.pos.x, creep.pos.y);
        var threst = 4500;
        if ((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined)) {
            threst = 500;
        }
        for (var i in atFeet) {
            if (atFeet[i].type == 'structure' && atFeet[i].structure.structureType == STRUCTURE_ROAD &&
                (atFeet[i].structure.hits < atFeet[i].structure.hitsMax - threst)) {

                //let dont = ['59b9cbff720ad030dcef2023'];
                //if (_.includes(dont, atFeet[i].structure.id)) {
                //creep.dismantle(atFeet[i].structure);
                //} else {
                if (creep.repair(atFeet[i].structure) == OK) {
                    creep.memory.onRoad = true;
                    return true;
                }
                //}
            } else {
                creep.memory.onRoad = false;
            }
        }
        // If none there, then create 1 road per creep.
        //        var doFor = ['E32S34','E28S37','E25S37','E25S43'];&& _.contains(doFor,creep.memory.home) 
        if (!creep.memory.onRoad && creep.memory.goHome) {
            if ((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined)) {

                if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {

                }
            }
            //else if ((creep.memory.cachePath === undefined)&&(creep.memory._move !== undefined && creep.memory._move.path !== undefined)) {
            //  if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {

            //}
            //}
        }
        creep.memory.onRoad = false;

        return false;
    }
    static doCloseRoadBuild(creep) {
        if (creep.memory.closeRoadBuildTimer === undefined) {
            creep.memory.closeRoadBuildTimer = 0;
        }
        creep.memory.closeRoadBuildTimer--;
        if (creep.memory.closeRoadBuildTimer < 0) {
            let zbuild = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
            if (zbuild.length === 0) {
                creep.memory.closeRoadBuildTimer = 4;
                return false;
            }
            creep.build(zbuild[0]);
        }
        return false;
    }

    static doCloseBuild(creep) {

        let zbuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (zbuild === null) return false;
        creep.say('cbu');
        if (creep.build(zbuild) == ERR_NOT_IN_RANGE) {
            creep.moveMe(zbuild, { reusePath: 30 });
        }
        return true;

    }


    static moveToBuild(creep) {
        if (creep.memory.constructionID === undefined) {
            var contargets = getConstruction(creep);
            if (contargets.length === 0) {
                return false;
            }

            if (creep.room.controller.level === 4 && !creep.room.storage) {
                let term = _.filter(contargets, function(o) {
                    return o.structureType === STRUCTURE_STORAGE;
                });
                if (term.length > 0) {
                    let bb = creep.pos.findClosestByRange(contargets);
                    creep.memory.constructionID = bb.id;
                }
            } else if (creep.room.controller.level === 6 && !creep.room.terminal) {
                let term = _.filter(contargets, function(o) {
                    return o.structureType === STRUCTURE_TERMINAL;
                });
                if (term.length > 0) {
                    let bb = creep.pos.findClosestByRange(contargets);
                    creep.memory.constructionID = bb.id;
                }
            } else {
                let bb = creep.pos.findClosestByRange(contargets);
                creep.memory.constructionID = bb.id;
            }
        }
        let ztarget = Game.getObjectById(creep.memory.constructionID);
        if (ztarget === null) {
            creep.memory.constructionID = undefined;
            return false;
        }
        if (creep.pos.inRangeTo(ztarget, 3)) {
            let zz = creep.build(ztarget);
            //            creep.say('Build' + zz);
        } else {
            creep.moveMe(ztarget, { reusePath: 15, maxRooms: 1 });
            creep.say('!');
        }
        return true;
    }

    static moveToRepairWall(creep) {
        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            if (creep.memory.repairCounter === undefined) {
                creep.memory.repairCounter = 75;
            }
            creep.say(creep.memory.repairCounter);
            if (creep.memory.repairCounter < 0) {
                creep.memory.repairCounter = 75;
                let stre = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (stre !== null) {
                    creep.memory.constructionID = stre.id;
                    return false;
                }


                let str = creep.pos.findInRange(FIND_STRUCTURES, 5);
                let structs = _.filter(str,
                    function(object) {
                        return object.structureType == STRUCTURE_RAMPART && object.isPublic && object.hits < 1000000;
                    }
                );
                if (structs.length > 0) {
                    target = _.min(structs, o => o.hits);
                    creep.memory.wallTargetID = target.id;

                } else {
                    structs = _.filter(str,
                        function(object) {
                            return (((object.structureType == STRUCTURE_RAMPART && !object.isPublic) || object.structureType === STRUCTURE_WALL) && object.hits !== object.hitsMax);
                        }
                    );
                    target = _.min(structs, o => o.hits);
                    creep.memory.wallTargetID = target.id;
                }
            }
            if (target.hits < 300000000) {
                if (creep.pos.inRangeTo(target, 3)) {

                    creep.cleanMe();
                    if (creep.repair(target) == OK) {
                        creep.memory.repairCounter--;

                    }
                    return true;
                } else {
                    creep.moveMe(target, { ignoreCreeps: true, reusePath: 30, range: 3 });

                    return false;
                }
            } else {
                creep.memory.wallTargetID = undefined;
            }
        } else {
            creep.memory.wallTargetID = undefined;
        }

        if (creep.memory.wallTargetID === undefined) {
            var sz;
            creep.memory.repairCounter = 75;
            var structs = creep.room.find(FIND_STRUCTURES);
            var targets = _.filter(structs,
                function(object) {
                    return object.structureType == STRUCTURE_RAMPART && object.isPublic && object.hits < 1000000;
                }
            );

            if (targets.length === 0) {
                targets = _.filter(structs,
                    function(object) {
                        return (((object.structureType == STRUCTURE_RAMPART && !object.isPublic) || object.structureType === STRUCTURE_WALL) && object.hits !== object.hitsMax);
                    }
                );
            }
            //            creep.say(targets.length + "Zced");
            if (targets.length > 0) {
                var lowestWall = _.min(targets, o => o.hits);
                creep.memory.wallTargetID = lowestWall.id;
                if (creep.repair(lowestWall) === ERR_NOT_IN_RANGE) {
                    creep.moveMe(lowestWall, { ignoreCreeps: true, reusePath: 30, maxRooms: 1, range: 3 });
                    return false;
                } else {
                    creep.cleanMe();
                }
                return true;
            } else {
                return false;
            }

        }


    }

}
module.exports = StructureInteract;