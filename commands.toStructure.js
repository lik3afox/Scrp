// Commands to structure
// Way for creep to interact wtih repair/build and constructionsite
// This needs to be fixed for goal and not to find a goal every tick


function getConstruction(creep) {
    return creep.room.find(FIND_CONSTRUCTION_SITES);
}

function clearAllConstruction(creep) {
    var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    for (var i in sites) {
        sites[i].remove();
    }
}

var buildOnLevel = [

{"name":"E39S57","shard":"shard1","rcl":"3","buildings":{"extension":{"pos":[{"x":42,"y":9},{"x":41,"y":10},{"x":43,"y":10},{"x":42,"y":11},{"x":44,"y":11},{"x":43,"y":12},{"x":45,"y":12},{"x":44,"y":13},{"x":46,"y":13},{"x":45,"y":14}]},"road":{"pos":[{"x":43,"y":11},{"x":42,"y":12},{"x":44,"y":12},{"x":41,"y":13},{"x":45,"y":13},{"x":40,"y":14},{"x":46,"y":14},{"x":39,"y":15},{"x":47,"y":15},{"x":47,"y":16},{"x":47,"y":17},{"x":47,"y":18},{"x":46,"y":19},{"x":47,"y":19},{"x":45,"y":20},{"x":47,"y":20},{"x":46,"y":21}]},"tower":{"pos":[{"x":40,"y":15}]},"spawn":{"pos":[{"x":46,"y":20}]}}},
{"name":"E39S57","shard":"shard1","rcl":"4","buildings":{"road":{"pos":[{"x":44,"y":7},{"x":45,"y":8},{"x":46,"y":9},{"x":47,"y":10},{"x":43,"y":11},{"x":48,"y":11},{"x":42,"y":12},{"x":44,"y":12},{"x":48,"y":12},{"x":41,"y":13},{"x":45,"y":13},{"x":47,"y":13},{"x":40,"y":14},{"x":46,"y":14},{"x":39,"y":15},{"x":47,"y":15},{"x":47,"y":16},{"x":47,"y":17},{"x":47,"y":18},{"x":46,"y":19},{"x":47,"y":19},{"x":45,"y":20},{"x":47,"y":20},{"x":46,"y":21}]},"extension":{"pos":[{"x":42,"y":9},{"x":43,"y":9},{"x":45,"y":9},{"x":41,"y":10},{"x":43,"y":10},{"x":44,"y":10},{"x":45,"y":10},{"x":46,"y":10},{"x":42,"y":11},{"x":44,"y":11},{"x":45,"y":11},{"x":46,"y":11},{"x":47,"y":11},{"x":43,"y":12},{"x":45,"y":12},{"x":46,"y":12},{"x":47,"y":12},{"x":44,"y":13},{"x":46,"y":13},{"x":45,"y":14}]},"tower":{"pos":[{"x":40,"y":15}]},"spawn":{"pos":[{"x":46,"y":20}]},"storage":{"pos":[{"x":44,"y":22}]}}},
{"name":"E39S57","shard":"shard1","rcl":"5","buildings":{"road":{"pos":[{"x":43,"y":7},{"x":44,"y":7},{"x":42,"y":8},{"x":45,"y":8},{"x":40,"y":9},{"x":41,"y":9},{"x":46,"y":9},{"x":39,"y":10},{"x":42,"y":10},{"x":47,"y":10},{"x":38,"y":11},{"x":43,"y":11},{"x":48,"y":11},{"x":37,"y":12},{"x":42,"y":12},{"x":44,"y":12},{"x":48,"y":12},{"x":36,"y":13},{"x":41,"y":13},{"x":45,"y":13},{"x":47,"y":13},{"x":40,"y":14},{"x":46,"y":14},{"x":39,"y":15},{"x":47,"y":15},{"x":38,"y":16},{"x":47,"y":16},{"x":47,"y":17},{"x":47,"y":18},{"x":46,"y":19},{"x":47,"y":19},{"x":45,"y":20},{"x":47,"y":20},{"x":46,"y":21}]},"extension":{"pos":[{"x":43,"y":8},{"x":44,"y":8},{"x":42,"y":9},{"x":43,"y":9},{"x":44,"y":9},{"x":45,"y":9},{"x":40,"y":10},{"x":41,"y":10},{"x":43,"y":10},{"x":44,"y":10},{"x":45,"y":10},{"x":46,"y":10},{"x":39,"y":11},{"x":40,"y":11},{"x":41,"y":11},{"x":42,"y":11},{"x":44,"y":11},{"x":45,"y":11},{"x":46,"y":11},{"x":47,"y":11},{"x":39,"y":12},{"x":40,"y":12},{"x":41,"y":12},{"x":43,"y":12},{"x":45,"y":12},{"x":46,"y":12},{"x":47,"y":12},{"x":44,"y":13},{"x":46,"y":13},{"x":45,"y":14}]},"link":{"pos":[{"x":28,"y":13},{"x":43,"y":20}]},"tower":{"pos":[{"x":41,"y":14},{"x":40,"y":15}]},"spawn":{"pos":[{"x":46,"y":20}]},"storage":{"pos":[{"x":44,"y":22}]}}},
{"name":"E39S57","shard":"shard1","rcl":"6","buildings":{"road":{"pos":[{"x":43,"y":7},{"x":44,"y":7},{"x":42,"y":8},{"x":45,"y":8},{"x":40,"y":9},{"x":41,"y":9},{"x":46,"y":9},{"x":39,"y":10},{"x":42,"y":10},{"x":47,"y":10},{"x":38,"y":11},{"x":43,"y":11},{"x":48,"y":11},{"x":37,"y":12},{"x":42,"y":12},{"x":44,"y":12},{"x":48,"y":12},{"x":36,"y":13},{"x":41,"y":13},{"x":45,"y":13},{"x":47,"y":13},{"x":36,"y":14},{"x":40,"y":14},{"x":46,"y":14},{"x":37,"y":15},{"x":39,"y":15},{"x":47,"y":15},{"x":38,"y":16},{"x":47,"y":16},{"x":47,"y":17},{"x":47,"y":18},{"x":46,"y":19},{"x":47,"y":19},{"x":45,"y":20},{"x":47,"y":20},{"x":46,"y":21}]},"extension":{"pos":[{"x":41,"y":8},{"x":43,"y":8},{"x":44,"y":8},{"x":42,"y":9},{"x":43,"y":9},{"x":44,"y":9},{"x":45,"y":9},{"x":40,"y":10},{"x":41,"y":10},{"x":43,"y":10},{"x":44,"y":10},{"x":45,"y":10},{"x":46,"y":10},{"x":39,"y":11},{"x":40,"y":11},{"x":41,"y":11},{"x":42,"y":11},{"x":44,"y":11},{"x":45,"y":11},{"x":46,"y":11},{"x":47,"y":11},{"x":38,"y":12},{"x":39,"y":12},{"x":40,"y":12},{"x":41,"y":12},{"x":43,"y":12},{"x":45,"y":12},{"x":46,"y":12},{"x":47,"y":12},{"x":37,"y":13},{"x":38,"y":13},{"x":39,"y":13},{"x":40,"y":13},{"x":44,"y":13},{"x":46,"y":13},{"x":37,"y":14},{"x":38,"y":14},{"x":39,"y":14},{"x":45,"y":14},{"x":38,"y":15}]},"link":{"pos":[{"x":28,"y":13},{"x":43,"y":20},{"x":35,"y":23}]},"tower":{"pos":[{"x":41,"y":14},{"x":40,"y":15}]},"lab":{"pos":[{"x":45,"y":19}]},"spawn":{"pos":[{"x":46,"y":20}]},"terminal":{"pos":[{"x":43,"y":21}]},"storage":{"pos":[{"x":44,"y":22}]},"extractor":{"pos":[{"x":8,"y":28}]}}},
{"name":"E39S57","shard":"shard1","rcl":"7","buildings":{"extension":{"pos":[{"x":43,"y":6},{"x":44,"y":6},{"x":42,"y":7},{"x":45,"y":7},{"x":40,"y":8},{"x":41,"y":8},{"x":43,"y":8},{"x":44,"y":8},{"x":46,"y":8},{"x":39,"y":9},{"x":42,"y":9},{"x":43,"y":9},{"x":44,"y":9},{"x":45,"y":9},{"x":47,"y":9},{"x":38,"y":10},{"x":40,"y":10},{"x":41,"y":10},{"x":43,"y":10},{"x":44,"y":10},{"x":45,"y":10},{"x":46,"y":10},{"x":48,"y":10},{"x":39,"y":11},{"x":40,"y":11},{"x":41,"y":11},{"x":42,"y":11},{"x":44,"y":11},{"x":45,"y":11},{"x":46,"y":11},{"x":47,"y":11},{"x":38,"y":12},{"x":39,"y":12},{"x":40,"y":12},{"x":41,"y":12},{"x":43,"y":12},{"x":45,"y":12},{"x":46,"y":12},{"x":47,"y":12},{"x":37,"y":13},{"x":38,"y":13},{"x":39,"y":13},{"x":40,"y":13},{"x":44,"y":13},{"x":46,"y":13},{"x":37,"y":14},{"x":38,"y":14},{"x":39,"y":14},{"x":45,"y":14},{"x":38,"y":15}]},"road":{"pos":[{"x":43,"y":7},{"x":44,"y":7},{"x":42,"y":8},{"x":45,"y":8},{"x":40,"y":9},{"x":41,"y":9},{"x":46,"y":9},{"x":39,"y":10},{"x":42,"y":10},{"x":47,"y":10},{"x":38,"y":11},{"x":43,"y":11},{"x":48,"y":11},{"x":37,"y":12},{"x":42,"y":12},{"x":44,"y":12},{"x":48,"y":12},{"x":36,"y":13},{"x":41,"y":13},{"x":45,"y":13},{"x":47,"y":13},{"x":36,"y":14},{"x":40,"y":14},{"x":46,"y":14},{"x":37,"y":15},{"x":39,"y":15},{"x":47,"y":15},{"x":38,"y":16},{"x":47,"y":16},{"x":47,"y":17},{"x":47,"y":18},{"x":46,"y":19},{"x":47,"y":19},{"x":45,"y":20},{"x":47,"y":20},{"x":46,"y":21}]},"link":{"pos":[{"x":28,"y":13},{"x":43,"y":20},{"x":35,"y":23}]},"tower":{"pos":[{"x":41,"y":14},{"x":40,"y":15},{"x":39,"y":16}]},"spawn":{"pos":[{"x":46,"y":18},{"x":46,"y":20}]},"lab":{"pos":[{"x":45,"y":19}]},"terminal":{"pos":[{"x":43,"y":21}]},"storage":{"pos":[{"x":44,"y":22}]},"extractor":{"pos":[{"x":8,"y":28}]}}},
{"name":"E39S57","shard":"shard1","rcl":"8","buildings":{"extension":{"pos":[{"x":43,"y":6},{"x":44,"y":6},{"x":45,"y":6},{"x":42,"y":7},{"x":45,"y":7},{"x":46,"y":7},{"x":40,"y":8},{"x":41,"y":8},{"x":43,"y":8},{"x":44,"y":8},{"x":46,"y":8},{"x":47,"y":8},{"x":39,"y":9},{"x":42,"y":9},{"x":43,"y":9},{"x":44,"y":9},{"x":45,"y":9},{"x":47,"y":9},{"x":38,"y":10},{"x":40,"y":10},{"x":41,"y":10},{"x":43,"y":10},{"x":44,"y":10},{"x":45,"y":10},{"x":46,"y":10},{"x":48,"y":10},{"x":37,"y":11},{"x":39,"y":11},{"x":40,"y":11},{"x":41,"y":11},{"x":42,"y":11},{"x":44,"y":11},{"x":45,"y":11},{"x":46,"y":11},{"x":47,"y":11},{"x":36,"y":12},{"x":38,"y":12},{"x":39,"y":12},{"x":40,"y":12},{"x":41,"y":12},{"x":43,"y":12},{"x":45,"y":12},{"x":46,"y":12},{"x":47,"y":12},{"x":35,"y":13},{"x":37,"y":13},{"x":38,"y":13},{"x":39,"y":13},{"x":40,"y":13},{"x":44,"y":13},{"x":46,"y":13},{"x":35,"y":14},{"x":37,"y":14},{"x":38,"y":14},{"x":39,"y":14},{"x":45,"y":14},{"x":36,"y":15},{"x":38,"y":15},{"x":37,"y":16},{"x":38,"y":17}]},"road":{"pos":[{"x":43,"y":7},{"x":44,"y":7},{"x":42,"y":8},{"x":45,"y":8},{"x":40,"y":9},{"x":41,"y":9},{"x":46,"y":9},{"x":39,"y":10},{"x":42,"y":10},{"x":47,"y":10},{"x":38,"y":11},{"x":43,"y":11},{"x":48,"y":11},{"x":37,"y":12},{"x":42,"y":12},{"x":44,"y":12},{"x":48,"y":12},{"x":36,"y":13},{"x":41,"y":13},{"x":45,"y":13},{"x":47,"y":13},{"x":36,"y":14},{"x":40,"y":14},{"x":46,"y":14},{"x":37,"y":15},{"x":39,"y":15},{"x":47,"y":15},{"x":38,"y":16},{"x":47,"y":16},{"x":47,"y":17},{"x":47,"y":18},{"x":46,"y":19},{"x":47,"y":19},{"x":45,"y":20},{"x":47,"y":20},{"x":46,"y":21}]},"link":{"pos":[{"x":28,"y":13},{"x":43,"y":20},{"x":35,"y":23}]},"tower":{"pos":[{"x":42,"y":13},{"x":41,"y":14},{"x":40,"y":15},{"x":41,"y":15},{"x":39,"y":16},{"x":40,"y":16}]},"lab":{"pos":[{"x":45,"y":19}]},"spawn":{"pos":[{"x":46,"y":20}]},"terminal":{"pos":[{"x":43,"y":21}]},"storage":{"pos":[{"x":44,"y":22}]},"extractor":{"pos":[{"x":8,"y":28}]}}},
];

function build(controller) {
    for (var e in buildOnLevel) {
        if (buildOnLevel[e].name == controller.pos.roomName && buildOnLevel[e].rcl == controller.level) {
            var lvlBuild = buildOnLevel[e].buildings;
            for (var a in lvlBuild) {
                for (var i in lvlBuild[a]) {
                    var pos = lvlBuild[a][i].pos;
                    for (var o in lvlBuild[a][i]) {
                        var posLook = controller.room.lookAt(lvlBuild[a][i][o].x, lvlBuild[a][i][o].y);
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

                            controller.room.createConstructionSite(lvlBuild[a][i][o].x, lvlBuild[a][i][o].y, a);
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

    static withdrawFromTombstone(creep, range, energy) {
        var tombStone;
//        if( creep.room.name === 'E39S57') return false;
        if (creep.carryTotal === creep.carryCapacity) {
            creep.memory.tombStoneID = undefined;
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
                    return o.total > 100;
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
                    creep.say(creep.moveTo(tombStone[0]), { reusePath: 50, maxRooms: 1 });
                }
                return true;
            }
        }


        tombStone = Game.getObjectById(creep.memory.tombStoneID);
        if (tombStone !== null) {
            creep.say('⚰️');
            creep.room.visual.line(creep.pos, tombStone.pos, { color: 'red' });
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
        for (var i in atFeet) {
            if (atFeet[i].type == 'structure' && atFeet[i].structure.structureType == STRUCTURE_ROAD &&
                (atFeet[i].structure.hits < atFeet[i].structure.hitsMax - 500)) {

                let dont = ['59b9cbff720ad030dcef2023'];
                if (_.includes(dont, atFeet[i].structure.id)) {
                    creep.dismantle(atFeet[i].structure);
                } else {
                    if (creep.repair(atFeet[i].structure) == OK) {
                        creep.memory.onRoad = true;
                        return true;
                    }
                }
            } else {
                creep.memory.onRoad = false;
            }
        }
        // If none there, then create 1 road per creep.
        //        var doFor = ['E32S34','E28S37','E25S37','E25S43'];&& _.contains(doFor,creep.memory.home) 
        if (!creep.memory.onRoad && creep.memory.goHome) {
            if ((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined)) {
                if (creep.room.name !== 'E16S45' && creep.room.name !== 'E16Sxx45') {

                    if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {

                    }
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
            creep.moveTo(zbuild);
        }
        return true;

    }


    static moveToBuild(creep) {
        if (creep.memory.constructionID === undefined) {
            var contargets = getConstruction(creep);
            if (contargets.length === 0) {
                return false;
            }
            let bb = creep.pos.findClosestByRange(contargets);
            creep.memory.constructionID = bb.id;
        }
        let ztarget = Game.getObjectById(creep.memory.constructionID);
        if (ztarget === null) {
            creep.memory.constructionID = undefined;
            return false;
        }
        if (creep.pos.inRangeTo(ztarget, 3)) {
            let zz = creep.build(ztarget);
            creep.say('Build' + zz);
        } else {
            creep.moveMe(ztarget, { reusePath: 15, ignoreCreeps: true, maxRooms: 1 });
        }
        return true;
    }

    static moveToRepairWall(creep) {
        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            Game.rooms[creep.room.name].memory.weakestWall = target.hits;
            if (creep.memory.repairCounter === undefined) {
                creep.memory.repairCounter = 75;
            }
            creep.say(creep.memory.repairCounter);
            if (creep.memory.repairCounter < 0) {
                creep.memory.repairCounter = 75;
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
                    creep.moveMe(target, { ignoreCreeps: true, reusePath: 30 });

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
            creep.say(targets.length+"Zced");
            if (targets.length > 0) {
                var lowestWall = _.min(targets, o => o.hits);
                creep.memory.wallTargetID = lowestWall.id;
                if (creep.repair(lowestWall) === ERR_NOT_IN_RANGE) {
                    creep.moveMe(lowestWall, { ignoreCreeps: true, reusePath: 30, maxRooms: 1 });
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