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
    { "name": "E22S49", "shard": "shard2", "rcl": "4", "buildings": { "road": { "pos": [{ "x": 29, "y": 10 }, { "x": 30, "y": 11 }, { "x": 30, "y": 12 }, { "x": 31, "y": 13 }, { "x": 32, "y": 14 }, { "x": 33, "y": 15 }, { "x": 33, "y": 16 }, { "x": 40, "y": 16 }, { "x": 33, "y": 17 }, { "x": 39, "y": 17 }, { "x": 33, "y": 18 }, { "x": 38, "y": 18 }, { "x": 43, "y": 18 }, { "x": 34, "y": 19 }, { "x": 37, "y": 19 }, { "x": 42, "y": 19 }, { "x": 35, "y": 20 }, { "x": 36, "y": 20 }, { "x": 41, "y": 20 }, { "x": 36, "y": 21 }, { "x": 40, "y": 21 }, { "x": 37, "y": 22 }, { "x": 39, "y": 22 }, { "x": 38, "y": 23 }, { "x": 39, "y": 24 }, { "x": 40, "y": 25 }, { "x": 41, "y": 26 }, { "x": 42, "y": 27 }] }, "storage": { "pos": [{ "x": 38, "y": 15 }] }, "extension": { "pos": [{ "x": 41, "y": 16 }, { "x": 40, "y": 17 }, { "x": 41, "y": 17 }, { "x": 42, "y": 17 }, { "x": 39, "y": 18 }, { "x": 40, "y": 18 }, { "x": 41, "y": 18 }, { "x": 42, "y": 18 }, { "x": 38, "y": 19 }, { "x": 39, "y": 19 }, { "x": 40, "y": 19 }, { "x": 41, "y": 19 }, { "x": 37, "y": 20 }, { "x": 38, "y": 20 }, { "x": 39, "y": 20 }, { "x": 40, "y": 20 }, { "x": 37, "y": 21 }, { "x": 38, "y": 21 }, { "x": 39, "y": 21 }, { "x": 38, "y": 22 }] }, "spawn": { "pos": [{ "x": 35, "y": 19 }] }, "tower": { "pos": [{ "x": 36, "y": 19 }] } } },
    { "name": "E22S49", "shard": "shard2", "rcl": "5", "buildings": { "link": { "pos": [{ "x": 28, "y": 9 }, { "x": 39, "y": 14 }] }, "road": { "pos": [{ "x": 29, "y": 10 }, { "x": 30, "y": 11 }, { "x": 30, "y": 12 }, { "x": 44, "y": 12 }, { "x": 31, "y": 13 }, { "x": 43, "y": 13 }, { "x": 45, "y": 13 }, { "x": 32, "y": 14 }, { "x": 42, "y": 14 }, { "x": 45, "y": 14 }, { "x": 33, "y": 15 }, { "x": 41, "y": 15 }, { "x": 45, "y": 15 }, { "x": 33, "y": 16 }, { "x": 40, "y": 16 }, { "x": 45, "y": 16 }, { "x": 33, "y": 17 }, { "x": 39, "y": 17 }, { "x": 44, "y": 17 }, { "x": 33, "y": 18 }, { "x": 38, "y": 18 }, { "x": 43, "y": 18 }, { "x": 34, "y": 19 }, { "x": 37, "y": 19 }, { "x": 42, "y": 19 }, { "x": 35, "y": 20 }, { "x": 36, "y": 20 }, { "x": 41, "y": 20 }, { "x": 36, "y": 21 }, { "x": 40, "y": 21 }, { "x": 37, "y": 22 }, { "x": 39, "y": 22 }, { "x": 38, "y": 23 }, { "x": 39, "y": 24 }, { "x": 40, "y": 25 }, { "x": 41, "y": 26 }, { "x": 42, "y": 27 }] }, "extension": { "pos": [{ "x": 44, "y": 13 }, { "x": 43, "y": 14 }, { "x": 44, "y": 14 }, { "x": 42, "y": 15 }, { "x": 43, "y": 15 }, { "x": 44, "y": 15 }, { "x": 41, "y": 16 }, { "x": 42, "y": 16 }, { "x": 43, "y": 16 }, { "x": 44, "y": 16 }, { "x": 40, "y": 17 }, { "x": 41, "y": 17 }, { "x": 42, "y": 17 }, { "x": 43, "y": 17 }, { "x": 39, "y": 18 }, { "x": 40, "y": 18 }, { "x": 41, "y": 18 }, { "x": 42, "y": 18 }, { "x": 38, "y": 19 }, { "x": 39, "y": 19 }, { "x": 40, "y": 19 }, { "x": 41, "y": 19 }, { "x": 37, "y": 20 }, { "x": 38, "y": 20 }, { "x": 39, "y": 20 }, { "x": 40, "y": 20 }, { "x": 37, "y": 21 }, { "x": 38, "y": 21 }, { "x": 39, "y": 21 }, { "x": 38, "y": 22 }] }, "storage": { "pos": [{ "x": 38, "y": 15 }] }, "spawn": { "pos": [{ "x": 35, "y": 19 }] }, "tower": { "pos": [{ "x": 36, "y": 19 }, { "x": 36, "y": 22 }] } } },
    { "name": "E22S49", "shard": "shard2", "rcl": "6", "buildings": { "link": { "pos": [{ "x": 28, "y": 9 }, { "x": 39, "y": 14 }, { "x": 41, "y": 27 }] }, "road": { "pos": [{ "x": 29, "y": 10 }, { "x": 30, "y": 11 }, { "x": 30, "y": 12 }, { "x": 44, "y": 12 }, { "x": 31, "y": 13 }, { "x": 43, "y": 13 }, { "x": 45, "y": 13 }, { "x": 32, "y": 14 }, { "x": 42, "y": 14 }, { "x": 45, "y": 14 }, { "x": 33, "y": 15 }, { "x": 41, "y": 15 }, { "x": 45, "y": 15 }, { "x": 33, "y": 16 }, { "x": 40, "y": 16 }, { "x": 45, "y": 16 }, { "x": 33, "y": 17 }, { "x": 39, "y": 17 }, { "x": 44, "y": 17 }, { "x": 33, "y": 18 }, { "x": 38, "y": 18 }, { "x": 43, "y": 18 }, { "x": 34, "y": 19 }, { "x": 37, "y": 19 }, { "x": 42, "y": 19 }, { "x": 35, "y": 20 }, { "x": 36, "y": 20 }, { "x": 41, "y": 20 }, { "x": 36, "y": 21 }, { "x": 40, "y": 21 }, { "x": 37, "y": 22 }, { "x": 39, "y": 22 }, { "x": 38, "y": 23 }, { "x": 39, "y": 24 }, { "x": 40, "y": 25 }, { "x": 41, "y": 26 }, { "x": 42, "y": 27 }] }, "extension": { "pos": [{ "x": 44, "y": 13 }, { "x": 43, "y": 14 }, { "x": 44, "y": 14 }, { "x": 42, "y": 15 }, { "x": 43, "y": 15 }, { "x": 44, "y": 15 }, { "x": 41, "y": 16 }, { "x": 42, "y": 16 }, { "x": 43, "y": 16 }, { "x": 44, "y": 16 }, { "x": 40, "y": 17 }, { "x": 41, "y": 17 }, { "x": 42, "y": 17 }, { "x": 43, "y": 17 }, { "x": 39, "y": 18 }, { "x": 40, "y": 18 }, { "x": 41, "y": 18 }, { "x": 42, "y": 18 }, { "x": 44, "y": 18 }, { "x": 38, "y": 19 }, { "x": 39, "y": 19 }, { "x": 40, "y": 19 }, { "x": 41, "y": 19 }, { "x": 43, "y": 19 }, { "x": 37, "y": 20 }, { "x": 38, "y": 20 }, { "x": 39, "y": 20 }, { "x": 40, "y": 20 }, { "x": 42, "y": 20 }, { "x": 43, "y": 20 }, { "x": 37, "y": 21 }, { "x": 38, "y": 21 }, { "x": 39, "y": 21 }, { "x": 41, "y": 21 }, { "x": 42, "y": 21 }, { "x": 38, "y": 22 }, { "x": 40, "y": 22 }, { "x": 41, "y": 22 }, { "x": 39, "y": 23 }, { "x": 40, "y": 23 }] }, "terminal": { "pos": [{ "x": 38, "y": 14 }] }, "storage": { "pos": [{ "x": 38, "y": 15 }] }, "spawn": { "pos": [{ "x": 35, "y": 19 }] }, "tower": { "pos": [{ "x": 36, "y": 19 }, { "x": 36, "y": 22 }] }, "container": { "pos": [{ "x": 21, "y": 31 }] }, "extractor": { "pos": [{ "x": 22, "y": 32 }] } } },
    { "name": "E22S49", "shard": "shard2", "rcl": "7", "buildings": { "link": { "pos": [{ "x": 28, "y": 9 }, { "x": 39, "y": 14 }, { "x": 41, "y": 27 }] }, "road": { "pos": [{ "x": 29, "y": 10 }, { "x": 30, "y": 11 }, { "x": 30, "y": 12 }, { "x": 44, "y": 12 }, { "x": 31, "y": 13 }, { "x": 43, "y": 13 }, { "x": 45, "y": 13 }, { "x": 32, "y": 14 }, { "x": 42, "y": 14 }, { "x": 45, "y": 14 }, { "x": 33, "y": 15 }, { "x": 41, "y": 15 }, { "x": 45, "y": 15 }, { "x": 33, "y": 16 }, { "x": 40, "y": 16 }, { "x": 45, "y": 16 }, { "x": 33, "y": 17 }, { "x": 39, "y": 17 }, { "x": 44, "y": 17 }, { "x": 33, "y": 18 }, { "x": 38, "y": 18 }, { "x": 43, "y": 18 }, { "x": 34, "y": 19 }, { "x": 37, "y": 19 }, { "x": 42, "y": 19 }, { "x": 35, "y": 20 }, { "x": 36, "y": 20 }, { "x": 41, "y": 20 }, { "x": 36, "y": 21 }, { "x": 40, "y": 21 }, { "x": 37, "y": 22 }, { "x": 39, "y": 22 }, { "x": 38, "y": 23 }, { "x": 39, "y": 24 }, { "x": 40, "y": 25 }, { "x": 41, "y": 26 }, { "x": 42, "y": 27 }] }, "extension": { "pos": [{ "x": 45, "y": 12 }, { "x": 46, "y": 12 }, { "x": 44, "y": 13 }, { "x": 46, "y": 13 }, { "x": 43, "y": 14 }, { "x": 44, "y": 14 }, { "x": 46, "y": 14 }, { "x": 42, "y": 15 }, { "x": 43, "y": 15 }, { "x": 44, "y": 15 }, { "x": 46, "y": 15 }, { "x": 41, "y": 16 }, { "x": 42, "y": 16 }, { "x": 43, "y": 16 }, { "x": 44, "y": 16 }, { "x": 46, "y": 16 }, { "x": 40, "y": 17 }, { "x": 41, "y": 17 }, { "x": 42, "y": 17 }, { "x": 43, "y": 17 }, { "x": 45, "y": 17 }, { "x": 46, "y": 17 }, { "x": 39, "y": 18 }, { "x": 40, "y": 18 }, { "x": 41, "y": 18 }, { "x": 42, "y": 18 }, { "x": 44, "y": 18 }, { "x": 45, "y": 18 }, { "x": 38, "y": 19 }, { "x": 39, "y": 19 }, { "x": 40, "y": 19 }, { "x": 41, "y": 19 }, { "x": 43, "y": 19 }, { "x": 44, "y": 19 }, { "x": 37, "y": 20 }, { "x": 38, "y": 20 }, { "x": 39, "y": 20 }, { "x": 40, "y": 20 }, { "x": 42, "y": 20 }, { "x": 43, "y": 20 }, { "x": 37, "y": 21 }, { "x": 38, "y": 21 }, { "x": 39, "y": 21 }, { "x": 41, "y": 21 }, { "x": 42, "y": 21 }, { "x": 38, "y": 22 }, { "x": 40, "y": 22 }, { "x": 41, "y": 22 }, { "x": 39, "y": 23 }, { "x": 40, "y": 23 }] }, "terminal": { "pos": [{ "x": 38, "y": 14 }] }, "storage": { "pos": [{ "x": 38, "y": 15 }] }, "spawn": { "pos": [{ "x": 38, "y": 17 }, { "x": 35, "y": 19 }] }, "tower": { "pos": [{ "x": 36, "y": 18 }, { "x": 36, "y": 19 }, { "x": 36, "y": 22 }] }, "container": { "pos": [{ "x": 21, "y": 31 }] }, "extractor": { "pos": [{ "x": 22, "y": 32 }] } } },
    { "name": "E22S49", "shard": "shard2", "rcl": "8", "buildings": { "link": { "pos": [{ "x": 28, "y": 9 }, { "x": 39, "y": 14 }, { "x": 41, "y": 27 }] }, "road": { "pos": [{ "x": 29, "y": 10 }, { "x": 30, "y": 11 }, { "x": 30, "y": 12 }, { "x": 44, "y": 12 }, { "x": 31, "y": 13 }, { "x": 43, "y": 13 }, { "x": 45, "y": 13 }, { "x": 32, "y": 14 }, { "x": 42, "y": 14 }, { "x": 45, "y": 14 }, { "x": 33, "y": 15 }, { "x": 41, "y": 15 }, { "x": 45, "y": 15 }, { "x": 33, "y": 16 }, { "x": 40, "y": 16 }, { "x": 45, "y": 16 }, { "x": 33, "y": 17 }, { "x": 39, "y": 17 }, { "x": 44, "y": 17 }, { "x": 33, "y": 18 }, { "x": 38, "y": 18 }, { "x": 43, "y": 18 }, { "x": 34, "y": 19 }, { "x": 37, "y": 19 }, { "x": 42, "y": 19 }, { "x": 35, "y": 20 }, { "x": 36, "y": 20 }, { "x": 41, "y": 20 }, { "x": 36, "y": 21 }, { "x": 40, "y": 21 }, { "x": 37, "y": 22 }, { "x": 39, "y": 22 }, { "x": 38, "y": 23 }, { "x": 39, "y": 24 }, { "x": 40, "y": 25 }, { "x": 41, "y": 26 }, { "x": 42, "y": 27 }] }, "extension": { "pos": [{ "x": 43, "y": 11 }, { "x": 44, "y": 11 }, { "x": 45, "y": 11 }, { "x": 42, "y": 12 }, { "x": 43, "y": 12 }, { "x": 45, "y": 12 }, { "x": 46, "y": 12 }, { "x": 41, "y": 13 }, { "x": 42, "y": 13 }, { "x": 44, "y": 13 }, { "x": 46, "y": 13 }, { "x": 41, "y": 14 }, { "x": 43, "y": 14 }, { "x": 44, "y": 14 }, { "x": 46, "y": 14 }, { "x": 42, "y": 15 }, { "x": 43, "y": 15 }, { "x": 44, "y": 15 }, { "x": 46, "y": 15 }, { "x": 41, "y": 16 }, { "x": 42, "y": 16 }, { "x": 43, "y": 16 }, { "x": 44, "y": 16 }, { "x": 46, "y": 16 }, { "x": 40, "y": 17 }, { "x": 41, "y": 17 }, { "x": 42, "y": 17 }, { "x": 43, "y": 17 }, { "x": 45, "y": 17 }, { "x": 46, "y": 17 }, { "x": 39, "y": 18 }, { "x": 40, "y": 18 }, { "x": 41, "y": 18 }, { "x": 42, "y": 18 }, { "x": 44, "y": 18 }, { "x": 45, "y": 18 }, { "x": 38, "y": 19 }, { "x": 39, "y": 19 }, { "x": 40, "y": 19 }, { "x": 41, "y": 19 }, { "x": 43, "y": 19 }, { "x": 44, "y": 19 }, { "x": 37, "y": 20 }, { "x": 38, "y": 20 }, { "x": 39, "y": 20 }, { "x": 40, "y": 20 }, { "x": 42, "y": 20 }, { "x": 43, "y": 20 }, { "x": 37, "y": 21 }, { "x": 38, "y": 21 }, { "x": 39, "y": 21 }, { "x": 41, "y": 21 }, { "x": 42, "y": 21 }, { "x": 38, "y": 22 }, { "x": 40, "y": 22 }, { "x": 41, "y": 22 }, { "x": 39, "y": 23 }, { "x": 40, "y": 23 }] }, "terminal": { "pos": [{ "x": 38, "y": 14 }] }, "storage": { "pos": [{ "x": 38, "y": 15 }] }, "spawn": { "pos": [{ "x": 40, "y": 15 }, { "x": 38, "y": 17 }, { "x": 35, "y": 19 }] }, "powerSpawn": { "pos": [{ "x": 38, "y": 16 }] }, "tower": { "pos": [{ "x": 36, "y": 18 }, { "x": 36, "y": 19 }, { "x": 36, "y": 22 }] }, "nuker": { "pos": [{ "x": 35, "y": 21 }] }, "container": { "pos": [{ "x": 21, "y": 31 }] }, "extractor": { "pos": [{ "x": 22, "y": 32 }] } } },
    {"name":"E29S48","shard":"shard2","rcl":"2","buildings":{"spawn":{"pos":[{"x":17,"y":12}]},"extension":{"pos":[{"x":16,"y":13},{"x":15,"y":14},{"x":14,"y":15},{"x":13,"y":16},{"x":12,"y":17}]}}},
    {"name":"E29S48","shard":"shard2","rcl":"3","buildings":{"road":{"pos":[{"x":14,"y":11},{"x":15,"y":11},{"x":16,"y":12},{"x":17,"y":13},{"x":16,"y":14},{"x":15,"y":15},{"x":14,"y":16},{"x":13,"y":17}]},"extension":{"pos":[{"x":14,"y":12},{"x":15,"y":12},{"x":14,"y":13},{"x":15,"y":13},{"x":16,"y":13},{"x":14,"y":14},{"x":15,"y":14},{"x":14,"y":15},{"x":13,"y":16},{"x":12,"y":17}]},"spawn":{"pos":[{"x":17,"y":12}]},"tower":{"pos":[{"x":17,"y":14}]}}},
    {"name":"E29S48","shard":"shard2","rcl":"4","buildings":{"road":{"pos":[{"x":14,"y":11},{"x":15,"y":11},{"x":13,"y":12},{"x":16,"y":12},{"x":12,"y":13},{"x":17,"y":13},{"x":11,"y":14},{"x":16,"y":14},{"x":15,"y":15},{"x":14,"y":16},{"x":13,"y":17},{"x":10,"y":18},{"x":11,"y":18},{"x":12,"y":18}]},"storage":{"pos":[{"x":19,"y":11}]},"extension":{"pos":[{"x":14,"y":12},{"x":15,"y":12},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":16,"y":13},{"x":12,"y":14},{"x":13,"y":14},{"x":14,"y":14},{"x":15,"y":14},{"x":11,"y":15},{"x":12,"y":15},{"x":13,"y":15},{"x":14,"y":15},{"x":10,"y":16},{"x":11,"y":16},{"x":12,"y":16},{"x":13,"y":16},{"x":11,"y":17},{"x":12,"y":17}]},"spawn":{"pos":[{"x":17,"y":12}]},"tower":{"pos":[{"x":17,"y":14}]}}},
    {"name":"E29S48","shard":"shard2","rcl":"5","buildings":{"link":{"pos":[{"x":18,"y":10},{"x":28,"y":46}]},"extension":{"pos":[{"x":13,"y":11},{"x":12,"y":12},{"x":14,"y":12},{"x":15,"y":12},{"x":11,"y":13},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":16,"y":13},{"x":10,"y":14},{"x":12,"y":14},{"x":13,"y":14},{"x":14,"y":14},{"x":15,"y":14},{"x":9,"y":15},{"x":11,"y":15},{"x":12,"y":15},{"x":13,"y":15},{"x":14,"y":15},{"x":8,"y":16},{"x":10,"y":16},{"x":11,"y":16},{"x":12,"y":16},{"x":13,"y":16},{"x":8,"y":17},{"x":9,"y":17},{"x":11,"y":17},{"x":12,"y":17},{"x":9,"y":18},{"x":10,"y":18}]},"road":{"pos":[{"x":14,"y":11},{"x":15,"y":11},{"x":13,"y":12},{"x":16,"y":12},{"x":12,"y":13},{"x":17,"y":13},{"x":11,"y":14},{"x":16,"y":14},{"x":7,"y":15},{"x":8,"y":15},{"x":10,"y":15},{"x":15,"y":15},{"x":9,"y":16},{"x":14,"y":16},{"x":10,"y":17},{"x":13,"y":17},{"x":11,"y":18},{"x":12,"y":18}]},"storage":{"pos":[{"x":19,"y":11}]},"spawn":{"pos":[{"x":17,"y":12}]},"tower":{"pos":[{"x":17,"y":14}]}}},
    {"name":"E29S48","shard":"shard2","rcl":"6","buildings":{"link":{"pos":[{"x":34,"y":3},{"x":18,"y":10},{"x":28,"y":46}]},"road":{"pos":[{"x":11,"y":10},{"x":9,"y":11},{"x":10,"y":11},{"x":14,"y":11},{"x":15,"y":11},{"x":8,"y":12},{"x":13,"y":12},{"x":16,"y":12},{"x":7,"y":13},{"x":12,"y":13},{"x":17,"y":13},{"x":6,"y":14},{"x":11,"y":14},{"x":16,"y":14},{"x":7,"y":15},{"x":8,"y":15},{"x":10,"y":15},{"x":15,"y":15},{"x":9,"y":16},{"x":14,"y":16},{"x":10,"y":17},{"x":13,"y":17},{"x":11,"y":18},{"x":12,"y":18}]},"lab":{"pos":[{"x":17,"y":10}]},"terminal":{"pos":[{"x":19,"y":10}]},"extension":{"pos":[{"x":13,"y":11},{"x":12,"y":12},{"x":14,"y":12},{"x":15,"y":12},{"x":11,"y":13},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":16,"y":13},{"x":7,"y":14},{"x":8,"y":14},{"x":10,"y":14},{"x":12,"y":14},{"x":13,"y":14},{"x":14,"y":14},{"x":15,"y":14},{"x":5,"y":15},{"x":6,"y":15},{"x":9,"y":15},{"x":11,"y":15},{"x":12,"y":15},{"x":13,"y":15},{"x":14,"y":15},{"x":16,"y":15},{"x":6,"y":16},{"x":7,"y":16},{"x":8,"y":16},{"x":10,"y":16},{"x":11,"y":16},{"x":12,"y":16},{"x":13,"y":16},{"x":15,"y":16},{"x":8,"y":17},{"x":9,"y":17},{"x":11,"y":17},{"x":12,"y":17},{"x":14,"y":17},{"x":9,"y":18},{"x":10,"y":18},{"x":13,"y":18}]},"storage":{"pos":[{"x":19,"y":11}]},"spawn":{"pos":[{"x":17,"y":12}]},"tower":{"pos":[{"x":17,"y":14},{"x":16,"y":16}]}}},
{"name":"E29S48","shard":"shard2","rcl":"7","buildings":{"link":{"pos":[{"x":34,"y":3},{"x":18,"y":10},{"x":28,"y":46}]},"road":{"pos":[{"x":15,"y":6},{"x":20,"y":6},{"x":14,"y":7},{"x":19,"y":7},{"x":13,"y":8},{"x":18,"y":8},{"x":14,"y":9},{"x":17,"y":9},{"x":11,"y":10},{"x":15,"y":10},{"x":16,"y":10},{"x":9,"y":11},{"x":10,"y":11},{"x":14,"y":11},{"x":15,"y":11},{"x":8,"y":12},{"x":13,"y":12},{"x":16,"y":12},{"x":7,"y":13},{"x":12,"y":13},{"x":17,"y":13},{"x":6,"y":14},{"x":11,"y":14},{"x":16,"y":14},{"x":7,"y":15},{"x":8,"y":15},{"x":10,"y":15},{"x":15,"y":15},{"x":9,"y":16},{"x":14,"y":16},{"x":10,"y":17},{"x":13,"y":17},{"x":11,"y":18},{"x":12,"y":18},{"x":13,"y":19},{"x":14,"y":20},{"x":15,"y":21},{"x":15,"y":22},{"x":16,"y":23},{"x":17,"y":24},{"x":18,"y":25},{"x":19,"y":25},{"x":20,"y":26},{"x":21,"y":27},{"x":21,"y":28},{"x":20,"y":29},{"x":19,"y":30},{"x":18,"y":31},{"x":18,"y":32},{"x":18,"y":33},{"x":18,"y":34},{"x":18,"y":35},{"x":17,"y":36},{"x":16,"y":37},{"x":15,"y":38},{"x":11,"y":39},{"x":12,"y":39},{"x":13,"y":39},{"x":14,"y":39}]},"extension":{"pos":[{"x":14,"y":8},{"x":15,"y":9},{"x":11,"y":11},{"x":13,"y":11},{"x":9,"y":12},{"x":10,"y":12},{"x":11,"y":12},{"x":12,"y":12},{"x":14,"y":12},{"x":15,"y":12},{"x":8,"y":13},{"x":9,"y":13},{"x":10,"y":13},{"x":11,"y":13},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":16,"y":13},{"x":7,"y":14},{"x":8,"y":14},{"x":9,"y":14},{"x":10,"y":14},{"x":12,"y":14},{"x":13,"y":14},{"x":14,"y":14},{"x":15,"y":14},{"x":5,"y":15},{"x":6,"y":15},{"x":9,"y":15},{"x":11,"y":15},{"x":12,"y":15},{"x":13,"y":15},{"x":14,"y":15},{"x":16,"y":15},{"x":6,"y":16},{"x":7,"y":16},{"x":8,"y":16},{"x":10,"y":16},{"x":11,"y":16},{"x":12,"y":16},{"x":13,"y":16},{"x":15,"y":16},{"x":8,"y":17},{"x":9,"y":17},{"x":11,"y":17},{"x":12,"y":17},{"x":14,"y":17},{"x":9,"y":18},{"x":10,"y":18},{"x":13,"y":18}]},"spawn":{"pos":[{"x":14,"y":10},{"x":17,"y":12}]},"lab":{"pos":[{"x":17,"y":10}]},"terminal":{"pos":[{"x":19,"y":10}]},"tower":{"pos":[{"x":16,"y":11},{"x":17,"y":14},{"x":16,"y":16}]},"storage":{"pos":[{"x":19,"y":11}]},"extractor":{"pos":[{"x":9,"y":40}]},"container":{"pos":[{"x":10,"y":40}]}}},
{"name":"E29S48","shard":"shard2","rcl":"8","buildings":{"link":{"pos":[{"x":34,"y":3},{"x":18,"y":10},{"x":28,"y":46}]},"road":{"pos":[{"x":15,"y":6},{"x":20,"y":6},{"x":14,"y":7},{"x":19,"y":7},{"x":13,"y":8},{"x":18,"y":8},{"x":14,"y":9},{"x":17,"y":9},{"x":11,"y":10},{"x":15,"y":10},{"x":16,"y":10},{"x":9,"y":11},{"x":10,"y":11},{"x":14,"y":11},{"x":15,"y":11},{"x":8,"y":12},{"x":13,"y":12},{"x":16,"y":12},{"x":7,"y":13},{"x":12,"y":13},{"x":17,"y":13},{"x":6,"y":14},{"x":11,"y":14},{"x":16,"y":14},{"x":7,"y":15},{"x":8,"y":15},{"x":10,"y":15},{"x":15,"y":15},{"x":9,"y":16},{"x":14,"y":16},{"x":10,"y":17},{"x":13,"y":17},{"x":11,"y":18},{"x":12,"y":18},{"x":13,"y":19},{"x":14,"y":20},{"x":15,"y":21},{"x":15,"y":22},{"x":16,"y":23},{"x":17,"y":24},{"x":18,"y":25},{"x":19,"y":25},{"x":20,"y":26},{"x":21,"y":27},{"x":21,"y":28},{"x":20,"y":29},{"x":19,"y":30},{"x":18,"y":31},{"x":18,"y":32},{"x":18,"y":33},{"x":18,"y":34},{"x":18,"y":35},{"x":17,"y":36},{"x":16,"y":37},{"x":15,"y":38},{"x":11,"y":39},{"x":12,"y":39},{"x":13,"y":39},{"x":14,"y":39}]},"extension":{"pos":[{"x":16,"y":6},{"x":17,"y":6},{"x":13,"y":7},{"x":15,"y":7},{"x":16,"y":7},{"x":17,"y":7},{"x":18,"y":7},{"x":12,"y":8},{"x":14,"y":8},{"x":15,"y":8},{"x":16,"y":8},{"x":15,"y":9},{"x":11,"y":11},{"x":13,"y":11},{"x":9,"y":12},{"x":10,"y":12},{"x":11,"y":12},{"x":12,"y":12},{"x":14,"y":12},{"x":15,"y":12},{"x":8,"y":13},{"x":9,"y":13},{"x":10,"y":13},{"x":11,"y":13},{"x":13,"y":13},{"x":14,"y":13},{"x":15,"y":13},{"x":16,"y":13},{"x":7,"y":14},{"x":8,"y":14},{"x":9,"y":14},{"x":10,"y":14},{"x":12,"y":14},{"x":13,"y":14},{"x":14,"y":14},{"x":15,"y":14},{"x":5,"y":15},{"x":6,"y":15},{"x":9,"y":15},{"x":11,"y":15},{"x":12,"y":15},{"x":13,"y":15},{"x":14,"y":15},{"x":16,"y":15},{"x":6,"y":16},{"x":7,"y":16},{"x":8,"y":16},{"x":10,"y":16},{"x":11,"y":16},{"x":12,"y":16},{"x":13,"y":16},{"x":15,"y":16},{"x":8,"y":17},{"x":9,"y":17},{"x":11,"y":17},{"x":12,"y":17},{"x":14,"y":17},{"x":9,"y":18},{"x":10,"y":18},{"x":13,"y":18}]},"tower":{"pos":[{"x":17,"y":8},{"x":16,"y":11},{"x":18,"y":13},{"x":17,"y":14},{"x":16,"y":16},{"x":14,"y":18}]},"spawn":{"pos":[{"x":16,"y":9},{"x":14,"y":10},{"x":17,"y":12}]},"lab":{"pos":[{"x":17,"y":10}]},"terminal":{"pos":[{"x":19,"y":10}]},"storage":{"pos":[{"x":19,"y":11}]},"extractor":{"pos":[{"x":9,"y":40}]},"container":{"pos":[{"x":10,"y":40}]}}},



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
                        for (let e in tombStone[0].store) {
                            creep.withdraw(tombStone, e);
                        }
                    } else {
                        for (let e in tombStone[0].store) {
                            if (e !== RESOURCE_ENERGY)
                                creep.withdraw(tombStone, e);
                        }
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
            creep.room.visual.line(creep.pos, tombStone.pos, { color: 'red' });
            if (energy) {
                if (tombStone.total === 0) creep.memory.tombStoneID = undefined;
            } else {
                if (tombStone.total - tombStone.store.energy === 0) creep.memory.tombStoneID = undefined;
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
            creep.moveMe(ztarget, { reusePath: 15, ignoreCreeps: true , maxRooms:1});
        }
        return true;
    }

    static moveToRepairWall(creep) {
        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            Game.rooms[creep.room.name].memory.weakestWall = target.hits;
            if (target.hits < 300000000) {
                if (creep.pos.inRangeTo(target, 3)) {
                   
                    creep.cleanMe();
                    creep.repair(target);
                    return true;
                } else {
                    creep.moveMe(target, { ignoreCreeps: true, reusePath: 30 });
                    return true;
                }
            } else {
                creep.memory.wallTargetID = undefined;
            }
        } else {
            creep.memory.wallTargetID = undefined;
        }

        if (creep.memory.wallTargetID === undefined) {
            var sz;

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
            creep.say(targets.length);
            if (targets.length > 0) {
                var lowestWall = _.min(targets, o => o.hits);
                creep.memory.wallTargetID = lowestWall.id;
                if (creep.repair(lowestWall) === ERR_NOT_IN_RANGE) {
                    creep.moveMe(lowestWall, { ignoreCreeps: true, reusePath: 30 });
                } else {
                    creep.cleanMe();
                }
                return;
            } else {
                creep.drop(RESOURCE_ENERGY);
            }

        }


    }

}
module.exports = StructureInteract;