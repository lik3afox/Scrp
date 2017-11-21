// Modules [name,  role.type,   # of them,  Level wanted]
// All modules
// Add your modules here if they want to be counted and kept track of.

// This module is where the require counts and what really determines the behavior.
// The role (1) here will be linked to the require run.
var allModule = [
    ['harass', require('keeper.harass')],
    ['assistant', require('role.assistant')],
    ['troll', require('army.troll')],
    ['recontroller', require('army.recontroller')],
    ['ranger', require('army.ranger')],
    ['demolisher', require('army.demolisher')],
    ['thief', require('army.thief')],
    ['mule', require('army.mule')],
    ['Acontroller', require('army.controller')],
    ['healer', require('army.healer')], // Gather and move - just carry 
    ['nuker', require('role.nuker')],
    ['mage', require('army.mage')],
    ['shooter', require('keeper.shooter')],
    ['tower', require('role.tower')],
    ['responder', require('keeper.responder')],
    ['minHarvest', require('role.mineral')],
    ['mineral', require('keeper.scientist')],
    ['engineer', require('army.engineer')],

    ['scout', require('army.scout')],
    ['rampartGuard', require('army.rampartGuard')],
    ['homeDefender', require('role.defender2')],
    ['builder', require('role.builder')],
    ['fighter', require('army.fighter')],
    ['upbuilder', require('role.upbuilder')],
    ['controller', require('role.controller')],
    ['scientist', require('role.scientist')],
    ['ztransport', require('role.ztransport')], // Harvester - experiemnt w/o carry
    ['upgrader', require('role.upgrader')],
    ['Aupgrader', require('army.upgrader')],
    ['wallwork', require('role.wallworker')],
    ['guard', require('keeper.guard')],
    ['linker', require('role.linker')],
    ['first', require('role.first')], // Should never have more firsts than containers...maybe..mmmm
    ['harvester', require('role.harvester')],
    ['transport', require('role.transport')], // Gather and move - just carry 
    ['miner', require('role.miner')] // Harvester - experiemnt w/o carry
];

var controllerLevel = 3500;
var transportLevel = 20000;

var expansionModule = [
    // Zero level is just miner and builder of roadsn
    [ // 200 Energy required

    ],
    // sends a miner to build the cotainer
    [ // 300 Energy Required
        ['miner', 1, 2] // Harvester - experiemnt w/o carry
    ],
    // Adds transport once container is built.
    [ // 550 Energy Max
        ['miner', 1, 2], // Harvester - experiemnt w/o carry
        ['transport', 1, 2] // Gather and move - just carry 
    ],
    // Level 3 has a controller 
    [ // 800 Energy Max.
        ['miner', 1, 2], // Harvester - experiemnt w/o carry
        // There are two transports because this is cock blocked by expansions.
        ['transport', 1, 2], // Gather and move - just carry 
        ['controller', 1, 1]
    ],

    // four level When the spawn can create 1300 strong units. 
    // The transport here will be designed for 1 square away - 
    [ // 1300 Energy Max.
        ['miner', 1, 3], // Harvester - experiemnt w/o carry
        ['transport', 1, 3], // Gather and move - just carry 
        ['controller', 1, 4]
    ],

    // Level 5 or above means the area is constructed, 
    // needing more transports because the distance is a bit further.

    // Level five is an contructed fully area - rebuilder can be downgraded and more
    // transports.
    [ // 1800 Energy Max.
        ['miner', 1, 3], // Harvester - experiemnt w/o carry
        ['transport', 1, 3], // Gather and move - just carry 800
        ['controller', 1, 4]
    ],
    // Level six is a bit further - needing 2 heavy level transports.
    [ // 1800 Energy Max.
        ['miner', 1, 3], // Harvester - experiemnt w/o carry
        ['transport', 1, 4], // Gather and move - just carry up to 1400
        ['ztransport', 1, 0], // Gather and move - just carry up to 1400
        ['controller', 1, 4]
    ],

    // Level seven is the highest distance away. 
    [ // 1800 Energy Max.
        ['miner', 1, 4], // Harvester - experiemnt w/o carry
        ['transport', 1, 5], // Gather and move - just carry 
        ['controller', 1, 5]
    ],
    [ // 1800 Energy Max.5836b8138b8b9619519f16b8
        ['miner', 1, 4], // Harvester - experiemnt w/o carry
        ['transport', 1, 6], // Gather and move - just carry up to 1400
        ['controller', 1, 5]
    ],

    [ // LEVEL 9 is another expansion that has a spawn.
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['controller', 1, 5],
        ['transport', 1, 5] // Gather and move - just carry 
    ],
    [ // LEVEL 10 is another expansion that has a spawn.5836b8168b8b9619519f1708
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 6], // Gather and move - just carry up to 1400
        ['controller', 1, 5] // Gather and move - just carry 
    ],

    [ // LEVEL 11 is another expansion that has a spawn.
        ['mineral', 1, 4],
        ['ztransport', 1, 0],
    ],

    [ // LEVEL 12 is another expansion that has a spawn. 5836b8168b8b9619519f1708
        ['mineral', 1, 5],
        ['ztransport', 1, 0],
    ],

    [ // LEVEL 13 - for just a miner and transport.
        ['mineral', 1, 7],
        ['ztransport', 1, 0],
    ],
    [ // LEVEL 14 - for an mineral For spawn3
        ['mineral', 1, 7],
        ['ztransport', 1, 0],
    ],
    [ // LEVEL 15 - for an mineral for spawn1
        ['miner', 1, 3], // Gather and move - just carry 
        ['transport', 2, 3], // Gather and move - just carry 
        ['controller', 1, 4]
    ],
    [ // LEVEL 16 - for just a miner and transport.
        ['miner', 1, 5], // Gather and move - just carry 
        ['transport', 2, 4], // Gather and move - just carry 
        ['controller', 1, 4]
    ], // al
    [ // LEVEL 17 - for just a miner and transport. Weaker than lv 15
        ['miner', 1, 5], // Gather and move - just carry 
        ['transport', 2, 4], // Gather and move - just carry 
        ['controller', 1, 4]
    ], // al
    [ // LEVEL 18 - for just a miner and transport. Weaker than lv 15
        ['miner', 1, 5], // Gather and move - just carry 
        ['transport', 2, 5] // Gather and move - just carry 
    ],
    [ // LEVEL 19 - for just a miner and transport.
        ['miner', 1, 5], // Gather and move - just carry 
        ['controller', 1, 4],
        ['transport', 2, 6] // Gather and move - just carry 
    ], // al
    [ // LEVEL 20 - for just a miner and transport. Weaker than lv 15
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 6],
        ['ztransport', 1, 0],
    ], // 
    [ // LEVEL 21 [E25S74 12,9]
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 2, 6],
        ['ztransport', 1, 0],
    ], // 
    [ // LEVEL 22 
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 6],
    ], // 
    [ // LEVEL 23  [E35S84 10,6]
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 4]
    ], //
    [ // LEVEL 24 
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 6],
    ], // 
    [ // LEVEL 25 
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 3] // 800 carry transport.

    ], // 
    [ // LEVEL 26 
    ], // 
    [ // LEVEL 27 
    ],
    [ // LEVEL 28 
    ], // 
    [ // LEVEL 29 
    ], // 
    [ // LEVEL 30 

    ]
];

var overflow = ['upgrader', require('role.upgrader'), 0, 0];

var party = require('commands.toParty');

var _overflow = 0;

var _require = 1; // Only All Module uses require

var _name = 0;
var _number = 1;
var _level = 2;

var currentModule;

var showEveryone = true;
var countCPU = false;

function cpuCount(creep, time) {
    if (creep.memory === undefined) return;
    if (creep.memory.cpu === undefined) {
        creep.memory.cpu = [];
    }
    let avg = _.sum(creep.memory.cpu) / creep.memory.cpu.length;
    if (showEveryone) console.log('CPU used by ' + creep + ' is a ' + creep.memory.role +
        ' Time : ' + 'avg:' + Math.floor(_.sum(creep.memory.cpu) / creep.memory.cpu.length), '/lst:', time, creep.pos, creep.carryTotal, creep.memory.goal);
    if ((creep.memory.cpu.length === 0 && time === 0) || (time !== 0))
        creep.memory.cpu.push(time);
    if (creep.memory.cpu.length > 30) creep.memory.cpu.shift();
}

// Give it a role, and SourceID
// Returns all creeps that match that role and source ID

function newGetExpandRole(creepRole, sourceID, totalCreeps) {
    if (totalCreeps[creepRole] !== undefined) {
        let cc = _.filter(totalCreeps[creepRole].goal, function(o) {
            return o == sourceID;
        });
        return cc.length;
    }
    return 0;
}

function getPossibleRole(spawn, creepRole, sourceID) {
    let total = 0;

    for (var e in spawn.memory.warCreate) {
        if (spawn.memory.warCreate[e].memory.role == creepRole && spawn.memory.warCreate[e].memory.goal == sourceID)
            total++;
    }

    for (var u in spawn.memory.expandCreate) {
        if (spawn.memory.expandCreate[u].memory.role == creepRole && spawn.memory.expandCreate[u].memory.goal == sourceID)
            total++;
    }

    for (var o in spawn.memory.create) {
        if (spawn.memory.create[o].memory.role == creepRole && spawn.memory.create[o].memory.goal == sourceID)
            total++;
    }

    return total;

}

function getExpandRole(creepRole, sourceID, totalCreeps) {
    let count = 0;
    for (var e in totalCreeps) {
        for (var a in totalCreeps[e].goal) {
            if (creepRole == e && totalCreeps[e].goal[a] == sourceID) {
                count++;
            }
        }
    }

    return count;
}

function makeBody(carryNeeded) {
    let body = [WORK, MOVE];

    do {
        body.push(MOVE);
        body.push(CARRY);
        carryNeeded--;
    } while (carryNeeded > 0);
    return body;
}

function analyzeSource(expand) {

    expand.transInfo = undefined;
    expand.mineInfo = undefined;
    expand.allDistance = undefined;
    expand.controlInfo = undefined;
    return;
    /*
    if (expand.allDistance === undefined) expand.allDistance = [];

    if (expand.allDistance.length > 30) {
        expand.allDistance.sort(function(a, b) {
            return a - b;
        });
        do {
            expand.allDistance.shift();
            expand.allDistance.pop();
            expand.allDistance.shift();
            expand.allDistance.pop();
        } while (expand.allDistance.length > 30);
        expand.aveDistance = Math.ceil((_.sum(expand.allDistance) / expand.allDistance.length));

    }
    let mining;
    let miningInfo = {};
    let source = Game.getObjectById(expand.source);
    if (source !== null && source.energyCapacity == 4000) {
        // 4000/300 + time away 40
        mining = 32; // 16 * 2;
        miningInfo.workNeeded = 11; // * 2 *2;
    } else {
        // 3000/300 = 10/2 = 5 work - back and forth distnce so. 
        miningInfo.workNeeded = 7; // * 2 *2;
        mining = 20;
    }

    if (expand.transportNum !== undefined) expand.transportNum = undefined;
    if (expand.tranCarryNeed !== undefined) expand.tranCarryNeed = undefined;
    if (expand.numOfParts !== undefined) expand.numOfParts = undefined;
    if (expand.numOfCreep !== undefined) expand.numOfCreep = undefined;
    if (expand.carryNeed !== undefined) expand.carryNeed = undefined;
    if (expand.tranCarryNeed !== undefined) expand.tranCarryNeed = undefined;
    if (expand.carryNeeded !== undefined) expand.carryNeeded = undefined;
    if (expand.transportNum !== undefined) expand.transportNum = undefined;

    let tInfo = {};
    tInfo.carryNeeded = (expand.aveDistance * mining);
    tInfo.tranCarryParts = Math.ceil(tInfo.carryNeeded / 50);
    tInfo.transportNum = Math.ceil(tInfo.tranCarryParts / 32);
    tInfo.carryPerTran = Math.ceil(tInfo.tranCarryParts / tInfo.transportNum);

    expand.transInfo = tInfo;
    expand.mineInfo = miningInfo;
    expand.controlInfo = {};
    */
}


function rebuildCreep(creep) {
    // Here we need to determine if it needs to be leveled up. 
    // Here we need to determine if the creep is an expansion creep or home creep.
    // expansion creep.
    let _body = [];

    if (creep.memory.role == 'miner' || creep.memory.role == 'transport' || creep.memory.role == 'ztransport') {
        let spawn = Game.getObjectById(creep.memory.parent);
        let _module;
        let goalInfo;
        if (spawn !== null) {
            for (var o in _module) {
                if (_module[o][_name] == creep.memory.role) {
                    _body = getModuleRole(_module[o][_name]).levels(_module[o][_level], spawn.room);
                    break;
                }
            }
        }

    } else if (creep.memory.role == 'first' || creep.memory.role == 'harvester' || creep.memory.role == 'scientist') {
        if (Game.flags[creep.memory.home] !== undefined && Game.flags[creep.memory.home].color == COLOR_WHITE && Game.flags[creep.memory.home].secondaryColor == COLOR_GREEN) {
            currentModule = Game.flags[creep.memory.home].memory.module;
        } 

        for (var type in currentModule) {
            if (currentModule[type][_name] == creep.memory.role) {
                _body = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level], creep.memory.home);
                /**/
                break;
            }
        }
    } else {

        for (var z in creep.body) {
            _body.push(creep.body[z].type);
        }
    }

    if (_body.length === 0) {
        for (var u in creep.body) {
            _body.push(creep.body[u].type);
        }
    }

    if (creep.memory.deathCount === undefined) { creep.memory.deathCount = 0; }
    creep.memory.deathCount++;

    let rando = Math.floor(Math.random() * creep.memory.parent.length);
    var needBoost;
    var isModded = false;
    var doBoost = ['E25xxS37'];
    if (creep.memory.needBoost === undefined || creep.memory.needBoost.length === 0) { // this pretty much says if it's gotten a boost before.
        if (_.contains(doBoost, creep.memory.home) &&
            (creep.memory.role == 'miner') && _body.length > 6) {
            var cBuild = [];
            //                console.log(_body,'ray');
            cBuild = changeBuild(_body, Game.rooms[creep.memory.home]);
            //                console.log(cBuild,'rayray',Game.rooms[creep.memory.home].memory.tempBoost);

            if (cBuild.length != _body.length) {
                _body = cBuild;
                isModded = true;
                needBoost = Game.rooms[creep.memory.home].memory.tempBoost;
            }
        }
    } else {
        needBoost = creep.memory.needBoost;
    }




    let temp = {
        build: _body,
        name: creep.memory.role[0] + creep.memory.role[1] + creep.memory.role[2] + creep.memory.deathCount + ':' + creep.memory.parent[rando],
        memory: {
            role: creep.memory.role,
            home: creep.memory.home,
            needBoost: needBoost,
            parent: creep.memory.parent,
            deathCount: creep.memory.deathCount,
            level: creep.memory.level,
            goal: creep.memory.goal,
            party: creep.memory.party
        }
    };

    /*            if(creep.memory.workContainer != undefined) {
                    temp.memory.workContainer = creep.memory.workContainer;
                } */
    if (creep.memory.sourceID !== undefined) {
        temp.memory.sourceID = creep.memory.sourceID;
    }
    if (creep.memory.keeperLairID !== undefined) {
        temp.memory.keeperLairID = creep.memory.keeperLairID;
    }
    if (creep.memory.scientistID !== undefined) {
        temp.memory.scientistID = creep.memory.scientistID;
    }

    return temp;
}

function addFromCreateStack(totalCreeps, role, spawn) {

    var e;
    if (totalCreeps[role] === undefined) {
        totalCreeps[role] = {
            count: 0,
            goal: []
        };
    }
    if (totalCreeps[role].count === undefined) {
        totalCreeps[role].count = 0;
    }
    if (totalCreeps[role].goal === undefined) {
        totalCreeps[role].goal = [];
    }
    for (e in spawn.memory.create) {
        if (role == spawn.memory.create[e].memory.role) {
            totalCreeps[role].count++;
            totalCreeps[role].goal.push(spawn.memory.create[e].memory.goal);
        }
    }
    for (e in spawn.memory.warCreate) {
        if (role == spawn.memory.warCreate[e].memory.role) {
            totalCreeps[role].count++;
            if (spawn.memory.create[e] !== undefined)
                totalCreeps[role].goal.push(spawn.memory.create[e].memory.goal);
        }
    }
    for (e in spawn.memory.expandCreate) {
        if (role == spawn.memory.expandCreate[e].memory.role) {
            totalCreeps[role].count++;
            totalCreeps[role].goal.push(spawn.memory.create[e].memory.goal);
        }
    }
    return totalCreeps;
}

function getModuleLevel(spawn) {
    return spawn.memory.buildLevel;
}

function getNuke(spawn) {
    return spawn.room.nuke;
}

function getCurrentModule(roomName) {
    return [];
}


function changeBuild(build, room) { // Input [body,body,carry],room
    // So we go through the body and take it apart
    // Once we take it apart, we'll start analzying the room and the parts that it can reduce.
    // First we will start with harvesting
    //    let available = room.memory.availableMinerals;
    //    if (available === undefined) return build;

    let workparts = _.filter(build, function(n) {
        return n == WORK;
    });
    let otherParts = _.filter(build, function(n) {
        return n != WORK;
    });

    let workCount = workparts.length;

    let nWorkPart = Math.ceil(workCount / BOOSTS.work.UO.harvest);
    let harvestEffect = nWorkPart * HARVEST_POWER; // 11 = 22
    room.memory.tempBoost = [];


    if (workCount >= 3 && Memory.stats.totalMinerals.UO >= nWorkPart * 30) {
        // so "UO" will make it 3 instead of 1 work, 
        let workparts = [];
        do {
            workparts.push(WORK);
            nWorkPart--;
        } while (nWorkPart !== 0);

        build = otherParts.concat(workparts); // Changes build with otherparts+work
        room.memory.tempBoost.push('UO'); // Adds it to memory so it can be added to it's self memory in build.
        //        room.memory.calledMinerals.UO += nWorkPart * 30;

    }

    // Then we will do move - move will always be last.

    otherParts = _.filter(build, function(n) {
        return n != MOVE && n != CARRY;
    }); // for miner atm
    carryParts = _.filter(build, function(n) {
        return n == CARRY;
    });
    let bneeded = Math.ceil((otherParts.length * 2) / 4); // This is for ZO 
    needed = Math.ceil(bneeded * 0.50); // We'll start everything using roads. 
    //    console.log(bneeded,otherParts,needed,room.memory.labMinerals['ZO'],room.memory.calledMinerals['ZO'] ,needed*30 )
    if (bneeded > 1 && room.terminal.ZO >= needed * 30) {
        // so "UO" will make it 3 instead of 1 work, 
        let moveParts = [];
        do {
            moveParts.push(MOVE);
            needed--;
        } while (needed > 0);

        build = otherParts.concat(carryParts).concat(moveParts); // Changes build with otherparts+work
        room.memory.tempBoost.unshift('ZO'); // Adds it to memory so it can be added to it's self memory in build.
        //        room.memory.calledMinerals.ZO += needed * 30;
    } else {
        needed = Math.ceil(otherParts.length * 0.5); // This is to still fix the move parts to be lower incase other changes have occured.
        console.log(needed, 'no boost change into');
        let moveParts = [];
        do {
            moveParts.push(MOVE);
            needed--;
        } while (needed > 0);

        build = carryParts.concat(moveParts).concat(otherParts); // Changes build with otherparts+work
        //        build = build.concat(carryParts);
    }

    console.log('in the end', room.memory.tempBoost);

    // Uses this memory point in order to pass more than 1 variable.
    // Returns the body, and adds to the room.memory.tempBoost in order to the creep to get it to boost with.
    //    room.memory.tempBoost = ['UO'];
    return build;
}

function buildMiner(workParts) {
    let body = [];
    do {
        body.push(WORK);
        workParts--;
    } while (workParts > 0);

    let mv = Math.ceil(body.length * 2);
    do {
        body.push(MOVE);
        mv--;
    } while (mv > 0);
    body.push(CARRY);
    body.push(CARRY);
    return body;
}

function buildTransport(carryParts) {
    let body = [];
    body.push(WORK);
    body.push(MOVE);
    do {
        body.push(CARRY);
        body.push(CARRY);
        carryParts--;
    } while (carryParts > 0);
    let mv = Math.ceil(body.length * 2);
    do {
        body.push(MOVE);
        mv--;
    } while (mv > 0);
    return body;
}

function doSpawnCount(creep) {
    if (creep === undefined) {
        //  console.log('bad creep',creep);
        return;
    }
    if (creep.memory.parent === undefined) return;
    if (Memory.spawnCount[creep.memory.parent] === undefined) {
        Memory.spawnCount[creep.memory.parent] = {};
    }
    if (Memory.spawnCount[creep.memory.parent][creep.memory.role] === undefined) {
        Memory.spawnCount[creep.memory.parent][creep.memory.role] = {
            count: 0,
            goal: [],
        };
    }
    if (Memory.spawnCount[creep.memory.parent].bodyCount === undefined) {
        Memory.spawnCount[creep.memory.parent].bodyCount = 0;
    }
    if (Memory.spawnCount[creep.memory.parent].total === undefined) {
        Memory.spawnCount[creep.memory.parent].total = 0;
    }

    //   if(creep.spawning){
    //        console.log('spawn find');
    //   }
    //totalBuild = totalBuild + spawnCreeps[name].body.length
    Memory.spawnCount[creep.memory.parent].bodyCount += creep.body.length;

    creep.memory.roleID = Memory.spawnCount[creep.memory.parent][creep.memory.role].count;
    Memory.spawnCount[creep.memory.parent][creep.memory.role].count++;
    Memory.spawnCount[creep.memory.parent].total++;

    if (creep.memory.goal !== undefined)
        Memory.spawnCount[creep.memory.parent][creep.memory.role].goal.push(creep.memory.goal);
}

function getModuleRole(role) {
    for (var a in allModule) {
        if (allModule[a][_name] == role) {
            return allModule[a][_require];
        }
    }
}

function calculateCPU(cpu, creep) {
    if (creep.memory === undefined) return;
    if (creep === undefined) return;
    if (creep.memory.cpuCount === undefined)
        creep.memory.cpuCount = 1500;

    if (creep.memory.cpuCost === undefined || creep.memory.cpuCount < 0) {
        creep.memory.cpuCount = 1500;
        creep.memory.cpuCost = 0;
    }
    creep.memory.cpuCount--;
    creep.memory.cpuCost += cpu;
    return creep.memory.cpuCost;
    /*
        if (cpu < 1) {
            return creep.memory.cpuCost;
        } else if (cpu < 2) {
            creep.memory.cpuCost += 1;
        } else if (cpu < 3) {
            creep.memory.cpuCost += 2;
        } else if (cpu < 4) {
            creep.memory.cpuCost += 3;
        } else if (cpu < 5) {
            creep.memory.cpuCost += 5;
        } else if (cpu < 6) {
            creep.memory.cpuCost += 8;
        } else if (cpu < 7) {
            creep.memory.cpuCost += 13;
        } else {
            creep.memory.cpuCost += 21;
        }

        return creep.memory.cpuCost;*/
}

class theSpawn {

    static spawnQuery(spawn) {
        // Counting
        var totalCreeps;
        var type;
        if (Memory.spawnCount[spawn.id] === undefined) {
            Memory.spawnCount[spawn.id] = {
                bodyCount:0
            };
        }
        

        spawn.memory.TotalBuild = (Memory.spawnCount[spawn.id].bodyCount * 3);
        spawn.memory.totalCreep = Memory.spawnCount[spawn.id].total;
        totalCreeps = Memory.spawnCount[spawn.id];

        // Flag Module Check Add Module.

        if (Game.flags[spawn.pos.roomName] !== undefined && Game.flags[spawn.pos.roomName].secondaryColor == COLOR_GREEN) {
            if (Game.flags[spawn.pos.roomName].memory.module !== undefined && Game.flags[spawn.pos.roomName].memory.module.length === 0) {
                currentModule = getCurrentModule(spawn.room.name);
                for (var ee in currentModule) {
                    Game.flags[spawn.pos.roomName].memory.module.push(currentModule[ee]);
                }
            }
        }

        currentModule = Game.flags[spawn.room.name].memory.module;

        for (type in currentModule) {

            let min = Game.getObjectById(spawn.room.memory.mineralID);
            let nuke = getNuke(spawn);
            var alertProhib = ['minHarvest', 'assistant', 'nuker'];
            if (currentModule[type][_number] === 0) {
                // No count so don't count.
            } else if ((currentModule[type][_name] == 'minHarvest' || currentModule[type][_name] == 'assistant') && (min !== null) && (min.mineralAmount === 0)) {

            } else if ((currentModule[type][_name] == 'nuker') && (nuke.ghodium == nuke.ghodiumCapacity) && (nuke.energy == nuke.energyCapacity)) {

            } else if (spawn.room.memory.alert && _.contains(alertProhib, currentModule[type][_name])) {

            } else if (currentModule[type][_name] == 'upgrader' && spawn.room.controller.level === 8) {

            } else {
                if (totalCreeps[currentModule[type][_name]] === undefined) {
                    totalCreeps[currentModule[type][_name]] = {
                        count: 0,
                        goal: []
                    };
                }
                if (totalCreeps[currentModule[type][_name]].count < currentModule[type][_number]) {

                    var theBuild = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level]);
                    let temp = {
                        build: theBuild,
                        name: currentModule[type][_name] + totalCreeps[currentModule[type][_name]].count + "*" + spawn.memory.created,
                        memory: {
                            role: currentModule[type][_name],
                            home: spawn.room.name,
                            parent: spawn.id,
                            level: currentModule[type][_level]
                        }
                    };
                    if (currentModule[type][_name] == 'first' || currentModule[type][_name] == 'harvester') {
                        spawn.memory.create.unshift(temp);
                        totalCreeps[currentModule[type][_name]].count++;
                        spawn.memory.created++;
                    } else {
                        spawn.memory.create.push(temp);
                        totalCreeps[currentModule[type][_name]].count++;
                        spawn.memory.created++;

                    }
                }
            }
        }


        // Expand check
        if (spawn.memory.roadsTo.length === 0) return;

        var _module;
        var report = '';


        for (var ie in spawn.memory.roadsTo) {

            let xp = spawn.memory.roadsTo[ie].expLevel;
            _module = expansionModule[xp];
            var source = Game.getObjectById(spawn.memory.roadsTo[ie].source);

            // Checking if room is visable and too observe it.
            if (spawn.memory.roadsTo[ie].expLevel > 0) {
                if (source === null) {
                    if (spawn.memory.roadsTo[ie].sourcePos !== undefined) {
                        let obser = require('build.observer');
                        obser.reqestRoom(spawn.memory.roadsTo[ie].sourcePos.roomName, 5);
                    }
                } else {
                    if (source.room === undefined) {
                        console.log('ERROR source.room not available:checkexpand', spawn.pos);
                    }
                }
            }

            // Expand Module Check.
            if (source !== null) {

                if (spawn.memory.roadsTo[ie].sourcePos === undefined) {
                    spawn.memory.roadsTo[ie].sourcePos = source.pos;
                }
                var expandRole = ['miner', 'controller', 'transport', 'ztransport', 'mineral'];
                var maxRole = {};
                var e;
                for (e in expandRole) {
                    if (maxRole[expandRole[e]] === undefined) {
                        maxRole[expandRole[e]] = 0;
                    }
                } // This creates maxRole={miner:0,transport:0,ztransport:0}

                for (e in _module) {
                    maxRole[_module[e][_name]] = _module[e][_number];
                }

                for (e in expandRole) {
                    if (spawn.memory.roadsTo[ie][expandRole[e]] !== undefined) {
                        let transportBuild;

                        let currentCount = newGetExpandRole(expandRole[e], spawn.memory.roadsTo[ie].source, totalCreeps);
                        //console.log('new Expand Check',expandRole[e],currentCount,'/',maxRole[expandRole[e]], source,'@', spawn.memory.roadsTo[ie][expandRole[e]]);
                        if (currentCount < maxRole[expandRole[e]]) {
                            spawn.memory.roadsTo[ie][expandRole[e]] = false;
                        }


                    }
                }


            }

            // Going through Expand and Modules.
            for (type in spawn.memory.roadsTo[ie]) {
                for (var uo in _module) {

                    // Find the expansions
                    if (type == _module[uo][_name]) {
                        // Instead of checking roadsTo - you can check the expansion #
                        if (!spawn.memory.roadsTo[ie][type]) {
                            if (spawn.memory.created === undefined) {
                                spawn.memory.created = 0;
                            }
                            spawn.memory.created++;
                            let needBoost = [];
                            let temp = {
                                build: getModuleRole(_module[uo][_name]).levels(_module[uo][_level], spawn.memory.roadsTo[ie], spawn.room),
                                name: type + "-" + spawn.memory.created + "v",
                                memory: {
                                    needBoost: needBoost,
                                    role: _module[uo][_name],
                                    home: spawn.room.name,
                                    parent: spawn.id,
                                    goal: spawn.memory.roadsTo[ie].source,
                                    level: _module[uo][_level]
                                }
                            };

                            // Here, we'll check to see if the controller needs to be created

                            // For expansions here we can determine special requirements needed to
                            // create an unit

                            if (temp.memory.role == 'miner') {
                                spawn.memory.expandCreate.unshift(temp);
                                spawn.memory.roadsTo[ie][type] = true;
                            }
                            // Controller needs it's target reservation to go below 2000
                            else if (temp.memory.role == 'controller') {
                                var level;
                                let sourcez = Game.getObjectById(spawn.memory.roadsTo[ie].source);
                                var controlLeft;
                                if (sourcez !== null) {
                                    controlLeft = sourcez.room.controller;
                                    if (sourcez.room.controller !== undefined && sourcez.room.controller.reservation !== undefined) {
                                        level = sourcez.room.controller.reservation.ticksToEnd;
                                    } else {
                                        level = 0;
                                    }

                                    if ((level < controllerLevel) || (sourcez.room.controller.level > 0)) {
                                        spawn.memory.expandCreate.push(temp);
                                        spawn.memory.roadsTo[ie][type] = true;
                                    }

                                }
                            } else if (temp.memory.role == 'mineral') {
                                let min = Game.getObjectById(spawn.memory.roadsTo[ie].source);
                                if (min !== null && min.mineralAmount > 0 &&
                                    min.room.controller !== undefined && min.room.controller.level >= 6) {
                                    spawn.memory.expandCreate.push(temp);
                                    spawn.memory.roadsTo[ie][type] = true;

                                } else if (min !== null && min.mineralAmount > 0 && min.room.controller === undefined) {
                                    spawn.memory.expandCreate.push(temp);
                                    spawn.memory.roadsTo[ie][type] = true;
                                } else {

                                }
                            } else if (temp.memory.role == 'transport') {
                                spawn.memory.expandCreate.push(temp);
                                spawn.memory.roadsTo[ie][type] = true;
                            } else {
                                spawn.memory.expandCreate.push(temp);
                                spawn.memory.roadsTo[ie][type] = true;
                            }


                        }
                    }
                }
            }


        }


    }

    static checkBuild(spawn) {
        //        let constr = require()
        //console.log('here?',spawn.memory.buildLevel, spawn.room.controller.level);
        if (spawn.memory.buildLevel != spawn.room.controller.level) {
            var constr = require('commands.toStructure');
            constr.buildConstrLevel(spawn.room.controller);
            spawn.memory.buildLevel = spawn.room.controller.level;
            return false;
        }

        return true;

    }

    // Newcount needs ID of an object in order to 
    // New count looks through game.creeps to find creeps that's parent
    // Id matches and returns an array of current count. 

    static runCreeps() {
        if (Game.shard.name == 'shard0') {
            for (var ee in Game.creeps) {
                if (Game.creeps[ee].memory === undefined) {
                    Game.creeps[ee].memory = {
                        role: 'engineer',
                        party: 'hello'
                    };

                }
                if (Game.creeps[ee].memory.role === undefined) {
                    Game.creeps[ee].memory.role = 'engineer';
                }
                if (Game.creeps[ee].memory.party === undefined) {
                    Game.creeps[ee].memory.party = 'hello';
                }
            }
        }
        if (Game.shard.name == 'shard1') {
            for (var zzzz in Game.creeps) {
                if (Game.creeps[zzzz].memory.role === undefined && Game.creeps[zzzz].pos.roomName == 'E20S40') {
                    Game.creeps[zzzz].memory.role = 'mule';
                    Game.creeps[zzzz].memory.party = 'E23S38';
                }
            }
        }
        if (Memory.creeps === undefined) return false;

        var start;
        Memory.creepTotal = 0;
        var totalRoles = {};
        var cpuUsed = {};
        var keys = Object.keys(Memory.creeps);
        var e = keys.length;
        var name;
        Memory.spawnCount = {};
        while (e--) { // Start of Creep Loop
            name = keys[e];

            if (Memory.showInfo > 4)
                start = Game.cpu.getUsed();
            doSpawnCount(Game.creeps[name]); // THis is where the creeps are counted.

            if (!Game.creeps[name]) { // Check to see if this needs deletion
                delete Memory.creeps[name]; // If it does then it does.
            } else {
                if (Game.creeps[name] === undefined) {
                    console.log('got undefined Memory');
                }
                if (Memory.showInfo > 1) {
                    if (totalRoles[Game.creeps[name].memory.role] === undefined) totalRoles[Game.creeps[name].memory.role] = 0;
                    totalRoles[Game.creeps[name].memory.role]++;
                    Memory.creepTotal++;
                }


                var type = allModule.length;
                while (type--) {
                    if (Game.creeps[name].memory.role == allModule[type][_name]) { // if they are the same
                        if (Game.creeps[name].memory.role == 'mulxx') { countCPU = true; } else { countCPU = false; }
                        if (countCPU) { start = Game.cpu.getUsed(); }
                        if (!Game.creeps[name].spawning) {
                            allModule[type][_require].run(Game.creeps[name]); // Then run the require of that role.
                        }
                        if (countCPU) { cpuCount(Game.creeps[name], Math.floor((Game.cpu.getUsed() - start) * 100)); }
                        break;
                    }
                }
            }
            if (Game.creeps[name] !== undefined && Memory.showInfo > 4) {
                let zzz = name; //[0] + name[1] + name[2] + "@" + Game.creeps[name].pos.roomName + ',' + Game.creeps[name].pos.x + "," + Game.creeps[name].pos.y;
                let cpuUsedz = calculateCPU((Game.cpu.getUsed() - start), Game.creeps[name]);
                if (cpuUsedz > 150) {
                    cpuUsed[zzz] = cpuUsedz;
                } else if (cpuUsedz > 125 && Game.creeps[name].memory.cpuCount > 800) {
                    cpuUsed[zzz] = cpuUsedz;
                } else if (cpuUsedz > 75 && Game.creeps[name].memory.cpuCount > 1200) {
                    cpuUsed[zzz] = cpuUsedz;
                }
                Memory.stats.theCpuCount = cpuUsed;
            } else {
                //                Memory.stats.theCpuCount = undefined;
            }
            if (Memory.showInfo > 1) {
                Memory.stats.roles = totalRoles;
            }

        }
        //        console.log(totalRoles);
    }




    // Okay here, false means that there is no creep
    // when it's add to the stack it also becomes true.

    static reportDeath(creep) {
        var spawn = Game.getObjectById(creep.memory.parent);
        //                console.log( creep.rebuildMe(creep)+'aasdfffffffffffffffffffffffffffffffffffffff' );
        if (spawn !== null) {
//            console.log('Reporting death,', creep.name, roomLink(creep.pos.roomName));
            switch (creep.memory.role) {
                case "miner":
                case "transport":
                case "ztransport":
                case "mineral":
                    spawn.memory.expandCreate.push(rebuildCreep(creep));
                    break;

                case "harvester":
                case "first":
                case "linker":
                    spawn.memory.create.unshift(rebuildCreep(creep));
                    break;
                case "scientist":
                    spawn.memory.create.push(rebuildCreep(creep));
                    break;
                case "guard":
                case "shooter":
                case "responder":
                    spawn.memory.expandCreate.unshift(rebuildCreep(creep));
                    break;
                case "fighter":
                case "healer":
                    spawn.memory.warCreate.unshift(rebuildCreep(creep));
                    break;
                default:
                    spawn.memory.create.push(rebuildCreep(creep));
                    break;
            }
        }

    }




    static checkNewSpawn(spawn) {
        // This function is created when a spawn is new.
        // This should only be checked while the controller level is 1
        if (!spawn.memory.alphaSpawn) {
            spawn.memory.newSpawn = false;

            return false;
        }
        for (var i in Game.spawns) {
            if (Game.spawns[i].name != spawn.name) {
                for (var e in Game.spawns[i].memory.analyzed) { // adds analyzed to spawn.
                    spawn.memory.analyzed.push(Game.spawns[i].memory.analyzed[e]);
                }
            }
        }

        spawn.memory.analyzed = _.uniq(spawn.memory.analyzed);

        spawn.memory.newSpawn = false;
    }



}
module.exports = theSpawn;