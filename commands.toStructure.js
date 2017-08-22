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

function setNewRepair(creep) {
    let repairs = getRepair(creep);
    //  creep.memory.goal = 
}

function getRepair(creep) {
    // Array returned will be others first - then roads.
    //    console.log('does this get used?');
    //  console.log('here?',test.length);
    return creep.room.find(FIND_STRUCTURES, {
        filter: object => (object.hits < object.hitsMax)
    }).sort((a, b) => a.hits - b.hits);
}

var buildOnLevel = [
{"name":"E17S34","shard":"shard1","rcl":"2","buildings":{"extension":{"pos":[{"x":33,"y":13},{"x":33,"y":16},{"x":32,"y":17},{"x":31,"y":18},{"x":30,"y":19}]},"spawn":{"pos":[{"x":33,"y":19}]}}},
{"name":"E17S34","shard":"shard1","rcl":"3","buildings":{"extension":{"pos":[{"x":31,"y":11},{"x":32,"y":12},{"x":33,"y":13},{"x":33,"y":16},{"x":25,"y":17},{"x":32,"y":17},{"x":26,"y":18},{"x":31,"y":18},{"x":27,"y":19},{"x":30,"y":19}]},"tower":{"pos":[{"x":34,"y":18}]},"spawn":{"pos":[{"x":33,"y":19}]}}},
{"name":"E17S34","shard":"shard1","rcl":"4","buildings":{"extension":{"pos":[{"x":24,"y":8},{"x":25,"y":8},{"x":27,"y":8},{"x":29,"y":8},{"x":30,"y":8},{"x":23,"y":9},{"x":22,"y":10},{"x":21,"y":11},{"x":31,"y":11},{"x":32,"y":12},{"x":33,"y":13},{"x":23,"y":15},{"x":24,"y":16},{"x":33,"y":16},{"x":25,"y":17},{"x":32,"y":17},{"x":26,"y":18},{"x":31,"y":18},{"x":27,"y":19},{"x":30,"y":19}]},"storage":{"pos":[{"x":19,"y":13}]},"tower":{"pos":[{"x":34,"y":18}]},"spawn":{"pos":[{"x":33,"y":19}]}}},
{"name":"E23S38","shard":"shard1","rcl":"2","buildings":{"spawn":{"pos":[{"x":32,"y":7}]},"extension":{"pos":[{"x":37,"y":11},{"x":34,"y":12},{"x":33,"y":13},{"x":32,"y":14},{"x":31,"y":15}]}}},
{"name":"E23S38","shard":"shard1","rcl":"3","buildings":{"spawn":{"pos":[{"x":32,"y":7}]},"extension":{"pos":[{"x":37,"y":11},{"x":34,"y":12},{"x":33,"y":13},{"x":32,"y":14},{"x":35,"y":14},{"x":31,"y":15},{"x":33,"y":16},{"x":32,"y":17},{"x":33,"y":17},{"x":32,"y":18}]},"tower":{"pos":[{"x":34,"y":15}]}}},
{"name":"E23S38","shard":"shard1","rcl":"4","buildings":{"spawn":{"pos":[{"x":32,"y":7}]},"extension":{"pos":[{"x":30,"y":8},{"x":29,"y":9},{"x":28,"y":10},{"x":28,"y":11},{"x":37,"y":11},{"x":28,"y":12},{"x":34,"y":12},{"x":28,"y":13},{"x":33,"y":13},{"x":28,"y":14},{"x":32,"y":14},{"x":35,"y":14},{"x":28,"y":15},{"x":31,"y":15},{"x":29,"y":16},{"x":30,"y":16},{"x":33,"y":16},{"x":32,"y":17},{"x":33,"y":17},{"x":32,"y":18}]},"storage":{"pos":[{"x":34,"y":8}]},"tower":{"pos":[{"x":34,"y":15}]}}},
{"name":"E24S37","shard":"shard1","rcl":"2","buildings":{"spawn":{"pos":[{"x":29,"y":21}]},"extension":{"pos":[{"x":26,"y":22},{"x":25,"y":23},{"x":26,"y":23},{"x":24,"y":24},{"x":25,"y":24}]}}},
{"name":"E24S37","shard":"shard1","rcl":"3","buildings":{"spawn":{"pos":[{"x":29,"y":21}]},"extension":{"pos":[{"x":26,"y":22},{"x":25,"y":23},{"x":26,"y":23},{"x":28,"y":23},{"x":24,"y":24},{"x":25,"y":24},{"x":27,"y":24},{"x":28,"y":24},{"x":26,"y":25},{"x":27,"y":25}]},"tower":{"pos":[{"x":28,"y":22}]}}},
{"name":"E24S37","shard":"shard1","rcl":"4","buildings":{"spawn":{"pos":[{"x":29,"y":21}]},"storage":{"pos":[{"x":32,"y":21}]},"extension":{"pos":[{"x":26,"y":22},{"x":25,"y":23},{"x":26,"y":23},{"x":24,"y":24},{"x":25,"y":24},{"x":27,"y":24},{"x":28,"y":24},{"x":26,"y":25},{"x":27,"y":25},{"x":26,"y":26}]},"tower":{"pos":[{"x":28,"y":22}]}}},
{"name":"E17S45","shard":"shard1","rcl":"2","buildings":{"extension":{"pos":[{"x":15,"y":18},{"x":16,"y":18},{"x":16,"y":19},{"x":17,"y":19},{"x":17,"y":20}]},"spawn":{"pos":[{"x":13,"y":19}]}}},
{"name":"E17S45","shard":"shard1","rcl":"4","buildings":{"extension":{"pos":[{"x":16,"y":14},{"x":15,"y":18},{"x":16,"y":18},{"x":14,"y":19},{"x":16,"y":19},{"x":17,"y":19},{"x":14,"y":20},{"x":15,"y":20},{"x":17,"y":20},{"x":18,"y":20},{"x":15,"y":21},{"x":16,"y":21},{"x":18,"y":21},{"x":19,"y":21},{"x":16,"y":22},{"x":17,"y":22},{"x":19,"y":22},{"x":17,"y":23},{"x":18,"y":23},{"x":18,"y":24}]},"tower":{"pos":[{"x":14,"y":15}]},"storage":{"pos":[{"x":13,"y":16}]},"spawn":{"pos":[{"x":13,"y":19}]}}},
{"name":"E17S45","shard":"shard1","rcl":"3","buildings":{"extension":{"pos":[{"x":16,"y":14},{"x":15,"y":18},{"x":16,"y":18},{"x":16,"y":19},{"x":17,"y":19},{"x":17,"y":20},{"x":18,"y":20},{"x":18,"y":21},{"x":19,"y":21},{"x":19,"y":22}]},"tower":{"pos":[{"x":14,"y":15}]},"spawn":{"pos":[{"x":13,"y":19}]}}},
{"name":"E18S32","shard":"shard1","rcl":"2","buildings":{"spawn":{"pos":[{"x":15,"y":15}]},"extension":{"pos":[{"x":18,"y":19},{"x":19,"y":19},{"x":17,"y":20},{"x":18,"y":20},{"x":17,"y":21}]}}},
{"name":"E18S32","shard":"shard1","rcl":"3","buildings":{"spawn":{"pos":[{"x":15,"y":15}]},"extension":{"pos":[{"x":17,"y":17},{"x":16,"y":18},{"x":17,"y":18},{"x":15,"y":19},{"x":16,"y":19},{"x":18,"y":19},{"x":19,"y":19},{"x":17,"y":20},{"x":18,"y":20},{"x":17,"y":21}]},"tower":{"pos":[{"x":19,"y":17}]}}},
{"name":"E18S32","shard":"shard1","rcl":"4","buildings":{"spawn":{"pos":[{"x":15,"y":15}]},"storage":{"pos":[{"x":14,"y":16}]},"extension":{"pos":[{"x":17,"y":17},{"x":16,"y":18},{"x":17,"y":18},{"x":15,"y":19},{"x":16,"y":19},{"x":18,"y":19},{"x":19,"y":19},{"x":14,"y":20},{"x":17,"y":20},{"x":18,"y":20},{"x":13,"y":21},{"x":14,"y":21},{"x":16,"y":21},{"x":17,"y":21},{"x":12,"y":22},{"x":13,"y":22},{"x":15,"y":22},{"x":16,"y":22},{"x":15,"y":23},{"x":14,"y":24}]},"tower":{"pos":[{"x":19,"y":17}]}}},
{"name":"E28S37","shard":"shard1","rcl":"2","buildings":{"extension":{"pos":[{"x":20,"y":14},{"x":19,"y":15},{"x":20,"y":15},{"x":18,"y":16},{"x":19,"y":16}]},"spawn":{"pos":[{"x":16,"y":18}]}}},
{"name":"E28S37","shard":"shard1","rcl":"3","buildings":{"extension":{"pos":[{"x":18,"y":13},{"x":19,"y":13},{"x":17,"y":14},{"x":18,"y":14},{"x":20,"y":14},{"x":17,"y":15},{"x":19,"y":15},{"x":20,"y":15},{"x":18,"y":16},{"x":19,"y":16}]},"tower":{"pos":[{"x":16,"y":16}]},"spawn":{"pos":[{"x":16,"y":18}]}}},
{"name":"E28S37","shard":"shard1","rcl":"4","buildings":{"extension":{"pos":[{"x":18,"y":13},{"x":19,"y":13},{"x":17,"y":14},{"x":18,"y":14},{"x":20,"y":14},{"x":17,"y":15},{"x":19,"y":15},{"x":20,"y":15},{"x":21,"y":15},{"x":18,"y":16},{"x":19,"y":16},{"x":22,"y":16},{"x":25,"y":16},{"x":25,"y":18},{"x":28,"y":18},{"x":29,"y":18},{"x":25,"y":19},{"x":26,"y":19},{"x":27,"y":19},{"x":28,"y":19}]},"storage":{"pos":[{"x":32,"y":15}]},"tower":{"pos":[{"x":16,"y":16}]},"spawn":{"pos":[{"x":16,"y":18}]}}},
{"name":"E25S37","shard":"shard1","rcl":"4","buildings":{"storage":{"pos":[{"x":7,"y":25}]},"spawn":{"pos":[{"x":9,"y":26}]},"tower":{"pos":[{"x":11,"y":26}]},"extension":{"pos":[{"x":10,"y":27},{"x":12,"y":27},{"x":13,"y":27},{"x":15,"y":27},{"x":5,"y":28},{"x":6,"y":28},{"x":15,"y":28},{"x":16,"y":28},{"x":5,"y":29},{"x":7,"y":29},{"x":8,"y":29},{"x":13,"y":29},{"x":14,"y":29},{"x":16,"y":29},{"x":17,"y":29},{"x":6,"y":30},{"x":7,"y":30},{"x":14,"y":30},{"x":15,"y":30},{"x":15,"y":31}]}}},


    {"name":"E18S36","shard":"shard1","rcl":"2","buildings":{"extension":{"pos":[{"x":35,"y":18},{"x":35,"y":19},{"x":35,"y":20},{"x":36,"y":20},{"x":36,"y":21}]},"spawn":{"pos":[{"x":36,"y":23}]}}},
    {"name":"E18S36","shard":"shard1","rcl":"3","buildings":{"extension":{"pos":[{"x":32,"y":17},{"x":33,"y":17},{"x":34,"y":17},{"x":35,"y":17},{"x":32,"y":18},{"x":35,"y":18},{"x":35,"y":19},{"x":35,"y":20},{"x":36,"y":20},{"x":36,"y":21}]},"tower":{"pos":[{"x":34,"y":23}]},"spawn":{"pos":[{"x":36,"y":23}]}}},
    {"name":"E18S36","shard":"shard1","rcl":"4","buildings":{"extension":{"pos":[{"x":30,"y":17},{"x":32,"y":17},{"x":33,"y":17},{"x":34,"y":17},{"x":35,"y":17},{"x":30,"y":18},{"x":31,"y":18},{"x":32,"y":18},{"x":35,"y":18},{"x":33,"y":19},{"x":35,"y":19},{"x":30,"y":20},{"x":31,"y":20},{"x":32,"y":20},{"x":33,"y":20},{"x":35,"y":20},{"x":36,"y":20},{"x":34,"y":21},{"x":36,"y":21},{"x":34,"y":22}]},"tower":{"pos":[{"x":34,"y":23}]},"spawn":{"pos":[{"x":36,"y":23}]},"storage":{"pos":[{"x":38,"y":25}]}}},
    {"name":"E18S36","shard":"shard1","rcl":"5","buildings":{"extension":{"pos":[{"x":32,"y":17},{"x":33,"y":17},{"x":34,"y":17},{"x":35,"y":17},{"x":32,"y":18},{"x":35,"y":18},{"x":33,"y":19},{"x":35,"y":19},{"x":32,"y":20},{"x":35,"y":20},{"x":36,"y":20},{"x":31,"y":21},{"x":34,"y":21},{"x":36,"y":21},{"x":30,"y":22},{"x":34,"y":22},{"x":30,"y":23},{"x":30,"y":24},{"x":34,"y":24},{"x":30,"y":25},{"x":31,"y":25},{"x":33,"y":25},{"x":32,"y":26},{"x":28,"y":27},{"x":30,"y":27},{"x":28,"y":28},{"x":30,"y":28},{"x":28,"y":29},{"x":28,"y":30},{"x":29,"y":31}]},"tower":{"pos":[{"x":34,"y":23},{"x":31,"y":28}]},"spawn":{"pos":[{"x":36,"y":23}]},"storage":{"pos":[{"x":38,"y":25}]},"link":{"pos":[{"x":40,"y":25},{"x":23,"y":36}]}}},
    {"name":"E18S36","shard":"shard1","rcl":"6","buildings":{"extension":{"pos":[{"x":32,"y":17},{"x":33,"y":17},{"x":34,"y":17},{"x":35,"y":17},{"x":32,"y":18},{"x":35,"y":18},{"x":33,"y":19},{"x":35,"y":19},{"x":32,"y":20},{"x":35,"y":20},{"x":36,"y":20},{"x":31,"y":21},{"x":34,"y":21},{"x":36,"y":21},{"x":30,"y":22},{"x":34,"y":22},{"x":30,"y":23},{"x":30,"y":24},{"x":34,"y":24},{"x":30,"y":25},{"x":31,"y":25},{"x":33,"y":25},{"x":32,"y":26},{"x":28,"y":27},{"x":30,"y":27},{"x":28,"y":28},{"x":30,"y":28},{"x":37,"y":28},{"x":28,"y":29},{"x":30,"y":29},{"x":36,"y":29},{"x":28,"y":30},{"x":30,"y":30},{"x":35,"y":30},{"x":29,"y":31},{"x":34,"y":31},{"x":30,"y":32},{"x":33,"y":32},{"x":30,"y":33},{"x":32,"y":33}]},"tower":{"pos":[{"x":34,"y":23},{"x":31,"y":28}]},"spawn":{"pos":[{"x":36,"y":23}]},"storage":{"pos":[{"x":38,"y":25}]},"terminal":{"pos":[{"x":39,"y":25}]},"link":{"pos":[{"x":40,"y":25},{"x":1,"y":31},{"x":23,"y":36}]},"extractor":{"pos":[{"x":45,"y":26}]},"lab":{"pos":[{"x":39,"y":27},{"x":39,"y":28},{"x":40,"y":28}]}}},
    {"name":"E18S36","shard":"shard1","rcl":"7","buildings":{"extension":{"pos":[{"x":32,"y":17},{"x":33,"y":17},{"x":34,"y":17},{"x":35,"y":17},{"x":32,"y":18},{"x":35,"y":18},{"x":33,"y":19},{"x":35,"y":19},{"x":32,"y":20},{"x":35,"y":20},{"x":36,"y":20},{"x":31,"y":21},{"x":34,"y":21},{"x":36,"y":21},{"x":30,"y":22},{"x":34,"y":22},{"x":30,"y":23},{"x":30,"y":24},{"x":34,"y":24},{"x":30,"y":25},{"x":31,"y":25},{"x":33,"y":25},{"x":32,"y":26},{"x":28,"y":27},{"x":30,"y":27},{"x":28,"y":28},{"x":30,"y":28},{"x":37,"y":28},{"x":28,"y":29},{"x":30,"y":29},{"x":36,"y":29},{"x":37,"y":29},{"x":28,"y":30},{"x":30,"y":30},{"x":36,"y":30},{"x":38,"y":30},{"x":29,"y":31},{"x":34,"y":31},{"x":35,"y":31},{"x":37,"y":31},{"x":38,"y":31},{"x":30,"y":32},{"x":33,"y":32},{"x":36,"y":32},{"x":30,"y":33},{"x":32,"y":33},{"x":33,"y":33},{"x":35,"y":33},{"x":34,"y":34},{"x":35,"y":34}]},"tower":{"pos":[{"x":34,"y":23},{"x":31,"y":28},{"x":31,"y":30}]},"spawn":{"pos":[{"x":36,"y":23}]},"terminal":{"pos":[{"x":39,"y":24}]},"storage":{"pos":[{"x":38,"y":25}]},"link":{"pos":[{"x":40,"y":25},{"x":33,"y":30},{"x":1,"y":31},{"x":23,"y":36}]},"lab":{"pos":[{"x":40,"y":26},{"x":41,"y":26},{"x":39,"y":27},{"x":41,"y":27},{"x":39,"y":28},{"x":40,"y":28}]},"extractor":{"pos":[{"x":45,"y":26}]}}}
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

    static getConstrSite(creep) {
        var targets = getConstruction(creep);
        targets.sort((a, b) => a.hits - b.hits);
        return targets;
    }

    static getRepairSite(creep) {
        var targets = getRepair(creep);
        targets.sort((a, b) => a.hits - b.hits);
        return targets;
    }

    static pickUpNonEnergy(creep) {
        if (_.sum(creep.carry) == creep.carryCapacity) return false;
        var stuff = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
        //      console.log(stuff.length);
        stuff = _.filter(stuff, { filter: o => o.resourceType != RESOURCE_ENERGY });
        //     let workparts = _.filter(stuff,function(n) {return n.resourceType != RESOURCE_ENERGY});
        //     console.log(stuff.length,workparts.length);
        if (stuff.length === 0) return false;
        if (creep.pos.isNearTo(stuff[0])) {
            for (var e in stuff) {
                creep.pickup(stuff[e]);
            }
        } else {
            creep.moveTo(stuff[0]);
        }
        creep.say('!');
        return true;
    }

    static pickUpCloseNonEnergy(creep) {
        var stuff = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, {
            filter: object => (object.resourceType != RESOURCE_ENERGY)
        });
        //       let workparts = _.filter(stuff,function(n) {return n.resourceType != RESOURCE_ENERGY});
        //stuff = _.filter(stuff,function(n){ })
        //      console.log('doing cllose enrgy test,',stuff.length,workparts.length);
        if (stuff.length === 0) {
            return false;
        }
        creep.say('stuff');
        if (creep.pos.isNearTo(stuff[0])) {
            creep.pickup(stuff[0]);
        } else {
            creep.moveTo(stuff[0]);
        }
        return true;
    }

    static pickUpEnergy(creep) {
        if (creep.room.controller !== undefined) {
            if (creep.room.controller.owner === undefined) {
                return false;
            }
        }

        var dEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (dEnergy.length === 0) return false;
        if (dEnergy.length > 1) {
            for (var e in dEnergy) {
                if (dEnergy.resourceType != RESOURCE_ENERGY) {
                    creep.pickup(dEnergy[e]);
                    return true;
                }
            }
        } else {
            creep.pickup(dEnergy[0]);

        }
        return true;
    }

    static moveToPickUpEnergyIn(creep, range) {
        if (creep.memory.nextEnergyScan === undefined) { creep.memory.nextEnergyScan = 0; }
        creep.memory.nextEnergyScan--;
        if (creep.memory.nextEnergyScan < 0) {
            var dEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range);
            dEnergy = _.filter(dEnergy, function(d) {
                return d.amount > 200;
            });
            if (dEnergy.length === 0) {
                creep.memory.nextEnergyScan = 0; //range;
                return false;
            }
            let close = dEnergy[0]; //= creep.pos.findClosestByRange(dEnergy);

            if (creep.pos.isNearTo(close)) {
                creep.pickup(close);
            } else {
                creep.moveTo(close, { maxRooms: 1 });
            }
            return true;
        }

        return false;

    }

    static dismantleTarget(creep, targetID) {
        let zz = Game.getObjectById(targetID);
        if (zz === null) return false;
        if (creep.pos.isNearTo(zz)) {
            creep.dismantle(zz);
        } else {
            creep.moveTo(zz);
        }
        return true;
    }

    static moveToDismantle(creep, type) {

        let finded = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == type);
            }
        });

        if (creep.pos.isNearTo(finded)) {
            creep.dismantle(finded);
            return true;
        } else {
            creep.moveTo(finded);
            return true;
        }

        return false;
    }

    static moveToPickUpEnergy(creep, min) {
        if (min === undefined) min = 0;
        var close = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                return object.amount > min;
            }
        }); 
        if (close === undefined) return false;
//            if(close.length === 0) return false;
        if (creep.pos.isNearTo(close)) {
            creep.pickup(close);
        } else {
            creep.moveTo(close, {
                //                  ignoreRoads: _ignoreRoad,
                //                    reusePath: 49,
                maxRooms: 1,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#f0f',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        }
        return true;
    }

    /*
        return creep.room.find(FIND_STRUCTURES, {
            filter: object => (object.hits < object.hitsMax &&
                object.structureType == STRUCTURE_ROAD)
        }).sort((a, b) => a.hits - b.hits); 

    */


    static createRoadAt(creep) {
        //    console.log(getConstruction(creep).length,creep);
        //    if(getConstruction(creep).length < 50 ) {

        var areaEast = creep.pos.findInRange(FIND_STRUCTURES, 1);
        var areaWest = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);

        //        console.log(areaWest.length,areaEast.length);
        if (areaEast.length + areaWest.length < 2) {
            var pos = creep.pos;
            var west = creep.room.createConstructionSite(pos, STRUCTURE_ROAD);
            console.log('Road construction', pos);
        }
        //    }
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

    static doCloseRepair(creep) {
        let close = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: object => (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax))
        });

        let zlose = creep.pos.findInRange(FIND_STRUCTURES, 3);
        zclose = _.filter(zlose, function(object) {
            return (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax));
        });
        //        console.log(close.length, zlose.length);
        if (close.length > 0) {
            creep.say('cre');
            creep.repair(close[0]);
            return true;
        }
        return false;
    }

    static doCloseRoadRepair(creep) {
        if (creep.room.name == 'E27S75'
            //           || creep.room.name == 'E35S74'|| creep.room.name == 'E35S75'|| creep.room.name =='E36S75'
            //           || creep.room.name == 'E34S84'|| creep.room.name == 'E34S85'|| creep.room.name == 'E35S85'
            //          || creep.room.name == 'E25S76'|| creep.room.name == 'E26S76'|| creep.room.name == 'E26S75'
            //          || creep.room.name == 'E25S74'|| creep.room.name == 'E26S74'|| creep.room.name == 'E25S75'
        ) return false;

        if (creep.room.name == 'E27S74' &&
            creep.pos.x > 32 && creep.pos.y > 32) return false;

        let atFeet = creep.room.lookAt(creep.pos.x, creep.pos.y);
        for (var i in atFeet) {
            if (atFeet[i].type == 'structure' && atFeet[i].structure.structureType == STRUCTURE_ROAD &&
                (atFeet[i].structure.hits < atFeet[i].structure.hitsMax - 1500)) {
                //                console.log(atFeet[i],atFeet[i].structure.structureType,i,atFeet[i].structure.hits,              );
                //let dont = ['58de62291a511b1c34d01176','58de66302c883f369b9d05be','58dc3a0e6ac6a53b41864cfb'];
                //if(!_.includes(dont, atFeet[i].structure.id))
                if (creep.repair(atFeet[i].structure) == OK) {
                    return true;
                }
            }
        }

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
    /*
        static attackPowerbank(creep) {
            if (creep.memory.powerbankID === undefined) {
                let find = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });

                creep.memory.powerbankID = find[0].id;
            }

            let powerbank = Game.getObjectById(creep.memory.powerbankID);

            if (powerbank !== null) {
                //        if(creep.pos.isNearTo(powerbank)) {
                //              creep.attack(powerbank);
                //            } else {
                creep.say(creep.moveTo(powerbank));
                //      }
            }
        } 
        static dismantlePowerbank(creep) {
            if (creep.memory.powerbankID === undefined) {
                let find = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });

                creep.memory.powerbankID = find[0].id;
            }

            let powerbank = Game.getObjectById(creep.memory.powerbankID);

            if (powerbank !== null) {
                if (creep.pos.isNearTo(powerbank)) {
                    creep.say(creep.dismantle(powerbank));
                } else {
                    creep.say(creep.moveTo(powerbank));
                }
            }
        }*/

    static doCloseBuild(creep) {

        let zbuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (zbuild === null) return false;
        creep.say('cbu');
        if (creep.build(zbuild) == ERR_NOT_IN_RANGE) {
            creep.moveTo(zbuild);
        }
        return true;

    }
    static doRepair(creep) {
        let close = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: object => (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax))
        });
        if (close.length > 0) {
            creep.repair(close[0]);
            return true;
        }
        return false;
    }

    static doBuild(creep) {
        let temp = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);

        if (temp.length === 0) return false;

        creep.build(temp[0]);
        creep.say('doB');
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

        creep.say('Build');
        if (creep.build(ztarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(ztarget);
        }
        return true;
    }

    static moveToRepair(creep) {
        var targets = getRepair(creep);
        if (targets.length > 0) {
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { reusePath: 30 });

            }
        } else {
            return false;
        }
        return true;
    }
    static toRepairWall(creep) {

        if (creep.memory.wallTargetID === undefined) {
            let targets = creep.pos.findInRange(FIND_STRUCTURES, 3);
            targets = _.filter(targets,
                function(object) {
                    return object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART;
                }
            ).sort((a, b) => a.hits - b.hits);
            if (targets.length > 0) {
                creep.memory.wallTargetID = targets[0].id;
            }
        }


        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            creep.repair(target);
            if (!creep.pos.inRangeTo(target, 3)) {
                creep.memory.wallTargetID = undefined;
            }
        } else {
            creep.memory.wallTargetID = undefined;
        }
    }
    static moveToRepairWall(creep) {

        if (creep.memory.wallTargetID === undefined) {
            var sz;
            if (creep.room.name == 'E35S83') {

                creep.memory.wallTargetID = '58fd71f2cc42f0c708bbb4d4';
                sz = Game.getObjectById(creep.memory.wallTargetID);
                if (sz.hits > 31000000) {
                    creep.memory.wallTargetID = '58fe06b4bbab1afe568fa4d5';
                } else {
                    return creep.memory.wallTargetID;
                }
                sz = Game.getObjectById(creep.memory.wallTargetID);
                if (sz.hits < 31000000) {
                    return creep.memory.wallTargetID;
                }
            }

            let targets = creep.room.find(FIND_STRUCTURES);
            targets = _.filter(targets,
                function(object) {
                    return object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART;
                }
            ).sort((a, b) => a.hits - b.hits);

            if (targets.length > 0) {
                creep.memory.wallTargetID = targets[0].id;
            }

        }


        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            if (creep.repair(target) == OK) {
                /*
                                if (target.hits < creep.memory.wallTargetHp - 750) {
                                    if (target.structureType == STRUCTURE_WALL) {
                                        console.log('Wall Getting Damage', target.pos, target.hits, creep.memory.wallTargetHp, target.hits - creep.memory.wallTargetHp);
                                        //creep.room.createConstructionSite(target.x, target.y, STRUCTURE_RAMPART);
                                    }
                                    if (target.structureType == STRUCTURE_RAMPART) {
                                        console.log('Wall Getting Damage', target.pos, target.hits, creep.memory.wallTargetHp, target.hits - creep.memory.wallTargetHp);
                                        //   creep.room.createConstructionSite(target.x, target.y, STRUCTURE_WALL);
                                    }
                                }
                                creep.memory.wallTargetHp = target.hits; */
            }

            if (!creep.pos.inRangeTo(target, 3)) creep.moveTo(target);
        } else {
            creep.memory.wallTargetID = undefined;
            creep.memory.wallTargetHp = 0;
        }
    }

}
module.exports = StructureInteract;