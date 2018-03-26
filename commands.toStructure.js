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
    { "name": "E33S54", "shard": "shard1", "rcl": "3", "buildings": { "road": { "pos": [{ "x": 33, "y": 42 }, { "x": 32, "y": 43 }, { "x": 25, "y": 44 }, { "x": 31, "y": 44 }, { "x": 26, "y": 45 }, { "x": 30, "y": 45 }, { "x": 27, "y": 46 }, { "x": 29, "y": 46 }, { "x": 28, "y": 47 }] }, "spawn": { "pos": [{ "x": 33, "y": 43 }] }, "extension": { "pos": [{ "x": 24, "y": 45 }, { "x": 25, "y": 45 }, { "x": 25, "y": 46 }, { "x": 26, "y": 46 }, { "x": 26, "y": 47 }, { "x": 27, "y": 47 }, { "x": 29, "y": 47 }, { "x": 27, "y": 48 }, { "x": 28, "y": 48 }, { "x": 29, "y": 48 }] }, "tower": { "pos": [{ "x": 30, "y": 47 }] } } },

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
                            console.log(a, lvlBuild[a][i].length, a, lvlBuild[a][i][o].x, lvlBuild[a][i][o].y, makeConSite);
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

    static withdrawFromTombstone(creep, range) {
        var tombStone;
        if(creep.carryTotal === creep.carryCapacity) {
            creep.memory.tombStoneID =undefined;
            return false;
        }
        if (creep.memory.tombStoneID === undefined) {
            if (range !== undefined) {
                tombStone = creep.pos.findInRange(FIND_TOMBSTONES, range);
            } else {
                tombStone = creep.room.find(FIND_TOMBSTONES);
            }
            tombStone = _.filter(tombStone, function(o) {
                return o.total > 100;
            });
            if (tombStone.length === 0) return false;
            //          creep.say('⚰️' + tombStone.length);
            if (tombStone.length > 0) {
                //                creep.room.visual.line(creep.pos, tombStone[0].pos, { color: 'red' });
                creep.memory.tombStoneID = tombStone[0].id;
                if (creep.pos.isNearTo(tombStone[0])) {
                    for (let e in tombStone[0].store) {
                        creep.withdraw(tombStone, e);
                    }
                } else {
                    creep.say(creep.moveTo(tombStone[0]), { reusePath: 50 });
                }
                return true;
            }
        }


        tombStone = Game.getObjectById(creep.memory.tombStoneID);
        if (tombStone !== null) {
            creep.say('⚰️');
            if (creep.room.name == 'E17S45')
                console.log(tombStone.pos.roomName, tombStone.ticksToDecay, tombStone.total);
            creep.room.visual.line(creep.pos, tombStone.pos, { color: 'red' });
            if (tombStone.total === 0) creep.memory.tombStoneID = undefined;
            if (!creep.pos.inRangeTo(tombStone,range)) creep.memory.tombStoneID = undefined;
            if (tombStone.ticksToDecay < 0) console.log("BUGGY @", roomLink(tombStone.pos.roomName));
            if (creep.pos.isNearTo(tombStone)) {
                for (let e in tombStone.store) {
                    if (tombStone.store[e] > 0) {
                        creep.withdraw(tombStone, e);
                        return true;
                    }
                }
            } else {
                creep.moveTo(tombStone, { reusePath: 50 });
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
            console.log('Created SnapShot for room', roomName, '# of entries:', strucs.length);
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
                console.log('will place createConstructionSite', location.x, location.y, snapShot[e].type);
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
                //                console.log(atFeet[i],atFeet[i].structure.structureType,i,atFeet[i].structure.hits,              );
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
            if ((creep.memory.cachePath !== undefined)&&(creep.memory._move === undefined)) {
                if(creep.room.name !== 'E16S45'&&creep.room.name !== 'E16Sxx45'){

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
            creep.moveMe(ztarget, { reusePath: 15, ignoreCreeps: true });
        }
        return true;
    }

    static moveToRepairWall(creep) {

        if (creep.memory.wallTargetID === undefined) {
            var sz;

            var targets = creep.room.find(FIND_STRUCTURES);
            targets = _.filter(targets,
                function(object) {
                    return object.structureType == STRUCTURE_RAMPART && object.isPublic && object.hits < 1000000;
                }
            ).sort((a, b) => a.hits - b.hits);

            if (targets.length === 0) {

                targets = creep.room.find(FIND_STRUCTURES);
                if (creep.room.name !== 'E3x2S34') {
                    targets = _.filter(targets,
                        function(object) {
                            return (object.structureType == STRUCTURE_WALL || (object.structureType == STRUCTURE_RAMPART && !object.isPublic)) && object.hits !== undefined;
                        }
                    ).sort((a, b) => a.hits - b.hits);
                } else {
                    targets = _.filter(targets,
                        function(object) {
                            return (object.structureType == STRUCTURE_RAMPART && !object.isPublic);
                        }
                    ).sort((a, b) => a.hits - b.hits);
                }
            }
            creep.say(targets.length);
            if (targets.length > 0) {
                creep.memory.wallTargetID = targets[0].id;
                //                if(targets[0].structureType === STRUCTURE_RAMPART && !targets[0].isPublic){
                //                  tagets[0].setPublic(true);
                //            }
                if (creep.repair(targets[0]) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0],{ignoreCreeps:true,reusePath:20});
                }
                return;
            } else {
                creep.drop(RESOURCE_ENERGY);
            }

        }


        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            if (target.hits < 300000000) {
                if (creep.pos.inRangeTo(target, 3)) {
                    creep.repair(target);
                } else {
                    creep.moveTo(target, { reusePath: 10 });
                }
            } else {
                creep.memory.wallTargetID = undefined;
            }
        } else {
            creep.memory.wallTargetID = undefined;
        }
    }

}
module.exports = StructureInteract;