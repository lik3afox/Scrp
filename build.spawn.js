// Modules [name,  role.type,   # of them,  Level wanted]
// All modules
// Add your modules here if they want to be counted and kept track of.

// This module is where the require counts and what really determines the behavior.
// The role (1) here will be linked to the require run.
var controllerLevel = 1500;
var transportLevel = 20000;


var allModule = [
    ['harass', require('army.harass')],
    ['assistant', require('role.assistant')],
    ['troll', require('army.troll')],
    ['recontroller', require('army.recontroller')],
    ['ranger', require('army.ranger')],
    ['demolisher', require('army.demolisher')],
    ['thief', require('army.thief')],
    ['mule', require('army.mule')],
    ['Acontroller', require('army.controller')],
    ['healer', require('army.healer')], // Gather and move - just carry 

    ['mage', require('army.mage')],
    ['shooter', require('keeper.shooter')],
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
    ['ztransport', require('role.ztransport')], // Harvester - experiemnt w/o carry
    ['upgrader', require('role.upgrader')],
    ['Aupgrader', require('army.upgrader')],
    ['wallwork', require('role.wallworker')],
    ['guard', require('keeper.guard2')],

    ['linker', require('role.linker')],
    ['first', require('role.first')], // Should never have more firsts than containers...maybe..mmmm
    //    ['scientist', require('role.scientist')],

    ['harvester', require('role.harvester')],
    ['transport', require('role.transport')], // Gather and move - just carry 
    ['miner', require('role.miner')] // Harvester - experiemnt w/o carry
];

var expansionModule = [
    // Zero level is just miner and builder of roadsn
    [], // Kept empty so nothing occurs and this can stay.
    [ // Level 1 500 Carry 2 work transports. 
        ['miner', 1, 2], // Harvester - experiemnt w/o carry
        ['transport', 1, 0], // Gather and move - just carry 
        ['controller', 1, 1]
    ],
    [ // Level 2 750 Carry 1250 Energy
        ['miner', 1, 3], // Harvester - experiemnt w/o carry
        ['transport', 1, 1], // Gather and move - just carry 
        ['controller', 1, 2]
    ],
    [ //Level 3 1000 Carry - 1750 Energy
        ['miner', 1, 4], // Harvester - experiemnt w/o carry
        // There are two transports because this is cock blocked by expansions.
        ['transport', 1, 2], // Gather and move - just carry 
        ['controller', 1, 3]
    ],
    [ // level 4  1550 Carry - 2600 Energy
        ['miner', 1, 4], // Harvester - experiemnt w/o carry
        ['transport', 1, 3], // Gather and move - just carry 
        ['controller', 1, 4]
    ],
    [ // Lv 5 - 2000 Carry 
        // Two transports @ 1000 Carry
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 1, 4], // Gather and move - just carry 
        ['controller', 1, 4]
    ],
    [
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 2, 2], // Gather and move - just carry 
        ['controller', 1, 4]

    ], // Level seven
    [ // Lv 7 - 3100 Carry
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 2, 3], // Gather and move - just carry 
        ['controller', 1, 4]
    ],
    // lv 8
    [
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 2, 4], // Gather and move - just carry 
        ['controller', 1, 4]

    ], // Lv 9
    [
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 3, 3], // Gather and move - just carry 
        ['controller', 1, 4]
    ],
    [ // LEVEL 10  For Mineral Harvesting.
        ['miner', 1, 5], // Harvester - experiemnt w/o carry
        ['transport', 3, 4], // Gather and move - just carry 
        ['controller', 1, 4]
    ],
    [ // LEVEL 11  For Mineral Harvesting.
        ['mineral', 1, 7],
        ['ztransport', 1, 0],
    ],
];

var _name = 0;
var _require = 1; // Only All Module uses require
var _number = 1;
var _level = 2;

var currentModule;
var spawnCount;
var roleIndex;

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

function rebuildCreep(creep) {
    // Here we need to determine if it needs to be leveled up. 
    // Here we need to determine if the creep is an expansion creep or home creep.
    // expansion creep.
    let _body = [];
    let _boost = [];

    if (creep.memory.role == 'miner' || creep.memory.role == 'transport' || creep.memory.role == 'ztransport') {
        let spawn = Game.getObjectById(creep.memory.parent);
        let _module;
        if (spawn !== null) {
            for (let type in spawn.memory.roadsTo) {
                if (spawn.memory.roadsTo[type].source === creep.memory.goal) {
                    _module = expansionModule[spawn.memory.roadsTo[type].expLevel];
                    for (var uo in _module) {
                        if (_module[uo][_name] === creep.memory.role) {
                            _body = getModuleRole(_module[uo][_name]).levels(_module[uo][_level], spawn.memory.roadsTo[type], spawn.room);
                            _boost = getModuleRole(_module[uo][_name]).boosts(_module[uo][_level], spawn.memory.roadsTo[type], spawn.room);
                        }
                    }
                }
            }
        }

    } else if (creep.memory.role == 'first' || creep.memory.role == 'harvester' || creep.memory.role == 'scientist') {
        if (Game.flags[creep.memory.home] !== undefined && Game.flags[creep.memory.home].color == COLOR_WHITE && (Game.flags[creep.memory.home].secondaryColor == COLOR_GREEN ||
                Game.flags[creep.memory.home].secondaryColor == COLOR_PURPLE)) {
            currentModule = Game.flags[creep.memory.home].memory.module;
        }

        for (var type in currentModule) {
            if (currentModule[type][_name] == creep.memory.role) {
                _body = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level], creep.memory.home);
                _boost = getModuleRole(currentModule[type][_name]).boosts(currentModule[type][_level], creep.memory.home);
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

    let rando = Math.floor(Math.random() * 1000);

    let temp = {
        build: _body,
        name: creep.memory.role[0] + creep.memory.role[1] + creep.memory.role[2] + creep.memory.deathCount + ':' + rando,
        memory: {
            role: creep.memory.role,
            home: creep.memory.home,
            parent: creep.memory.parent,
            boostNeeded: _boost,
            deathCount: creep.memory.deathCount,
            level: creep.memory.level,
            goal: creep.memory.goal,
            party: creep.memory.party
        }
    };

    if (creep.memory.workContainer != undefined) {
        temp.memory.workContainer = creep.memory.workContainer;
    }
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

function numberOfBody(creep, boost) {
    var total = 0;
    let type;
    if (boost === undefined) {
        //        console.log(creep, "trying to do boost for:", boost);
        return;
    }
    switch (boost) {
        case "UH":
        case "UH2O":
        case "XUH2O":
            type = ATTACK;
            break;
        case "LO":
        case "LHO2":
        case "XLHO2":
            type = HEAL;
            break;
        case "KO":
        case "KHO2":
        case "XKHO2":
            type = RANGED_ATTACK;
            break;
        case "ZO":
        case "ZHO2":
        case "XZHO2":
            type = MOVE;
            break;
        case "KH":
        case "KH2O":
        case "XKH2O":
            type = CARRY;
            break;
        case "GO":
        case "GHO2":
        case "XGHO2":
            type = TOUGH;
            break;
        default:
            type = WORK;
            break;

    }
    var e = creep.body.length;
    while (e--) {
        if (creep.body[e].type == type) {
            total++;
        }
    }

    return total;
}

function doSpawnCount(creep) {
    if (creep === undefined) {
        return;
    }

    if (creep.partyFlag !== undefined) {
        // If this creep is in a party
        if (spawnCount[creep.memory.party] === undefined) {
            spawnCount[creep.memory.party] = {};
        }
        if (spawnCount[creep.memory.party][creep.memory.role] === undefined) {
            spawnCount[creep.memory.party][creep.memory.role] = {
                count: 0,
            };
        }
        spawnCount[creep.memory.party][creep.memory.role].count++;
    }

    if (creep.memory.parent === undefined) return;
    if (spawnCount[creep.memory.parent] === undefined) {
        spawnCount[creep.memory.parent] = {};
    }
    if (spawnCount[creep.memory.parent][creep.memory.role] === undefined) {
        spawnCount[creep.memory.parent][creep.memory.role] = {
            count: 0,
            goal: [],
        };
    }
    if (spawnCount[creep.memory.parent].bodyCount === undefined) {
        spawnCount[creep.memory.parent].bodyCount = 0;
    }
    if (spawnCount[creep.memory.parent].total === undefined) {
        spawnCount[creep.memory.parent].total = 0;
    }
    spawnCount[creep.memory.parent].bodyCount += creep.body.length;

    creep.memory.roleID = spawnCount[creep.memory.parent][creep.memory.role].count;
    spawnCount[creep.memory.parent][creep.memory.role].count++;
    spawnCount[creep.memory.parent].total++;

    if (creep.memory.goal !== undefined)
        spawnCount[creep.memory.parent][creep.memory.role].goal.push(creep.memory.goal);
}

function getModuleRole(role) {
    if (roleIndex !== undefined && roleIndex[role] !== undefined) {
        return allModule[roleIndex[role]][_require];
    }

    for (var a in allModule) {
        if (allModule[a][_name] == role) {
            return allModule[a][_require];
        }
    }
}

class theSpawn {

    static spawnQuery(spawn, spawnCount) {

        var totalCreeps;
        var type;
        if (spawnCount !== undefined) {
            totalCreeps = spawnCount[spawn.id];
            spawn.memory.totalParts = (spawnCount[spawn.id].bodyCount * 3);
            spawn._totalParts = (spawnCount[spawn.id].bodyCount * 3);
            spawn.memory.totalCreep = spawnCount[spawn.id].total;
            spawn._totalCreep = (spawnCount[spawn.id].bodyCount * 3);
        }

        // Flag Module Check Add Module.
        currentModule = Game.flags[spawn.room.name].memory.module;
        for (type in currentModule) {

            let min = Game.getObjectById(spawn.room.memory.mineralID);
            let nuke = spawn.room.nuke;
            var alertProhib = ['minHarvest', 'assistant'];
            if (currentModule[type][_number] === 0) {
                // No count so don't count.
            } else if (currentModule[type][_name] == 'wallworker' && Game.rooms[creep.room.name].memory.weakestWall !== undefined && Game.rooms[creep.room.name].memory.weakestWall > 299000000) {
                console.log('room has "max" walls!', spawn.room.name);
            } else if ((currentModule[type][_name] == 'minHarvest' || currentModule[type][_name] == 'assistant') && (min !== null) && (min.mineralAmount === 0)) {

            } else if (spawn.room.memory.alert && _.contains(alertProhib, currentModule[type][_name])) {} else if (currentModule[type][_name] == 'upbuilder' && ((spawn.room.powerspawn !== undefined && spawn.room.powerspawn.power > 0) && (spawn.room.controller.ticksToDowngrade > 25000))) { // current stop for power.
            } else if (currentModule[type][_name] == 'upgrader' && spawn.room.controller.level === 8) {

            } else {
                if (totalCreeps[currentModule[type][_name]] === undefined) {
                    totalCreeps[currentModule[type][_name]] = {
                        count: 0,
                        goal: []
                    };
                }

                if (totalCreeps[currentModule[type][_name]].count < currentModule[type][_number]) {
                    if (spawn.memory.create === undefined) spawn.memory.create = [];

                    let mod = getModuleRole(currentModule[type][_name]);
                    if (mod !== undefined) {
                        var theBuild = mod.levels(currentModule[type][_level]);
                        let temp = {
                            build: theBuild,
                            name: currentModule[type][_name] + totalCreeps[currentModule[type][_name]].count + "*" + spawn.memory.created,
                            memory: {
                                role: currentModule[type][_name],
                                boostNeeded: mod.boosts(currentModule[type][_level]),
                                home: spawn.room.name,
                                parent: spawn.id,
                                level: currentModule[type][_level]
                            }
                        };

                        if (currentModule[type][_name] == 'linker') {
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
        }

        // Expand check
        if (spawn.memory.roadsTo === undefined || spawn.memory.roadsTo.length === 0) return;

        for (let mod in spawn.memory.roadsTo) {
            let remoteInfo = spawn.memory.roadsTo[mod];
            let source = Game.getObjectById(remoteInfo.source);
            // Checking if room is visable and too observe it.
            if (remoteInfo.expLevel === 0) {
                continue;
            }
            if (source === null) {
                if (remoteInfo.sourcePos !== undefined) {
                    let obser = require('build.observer');
                    obser.reqestRoom(remoteInfo.sourcePos.roomName, 2);
                }
                return;
            }

            // Expand Module Check.

            if (remoteInfo.sourcePos === undefined) {
                remoteInfo.sourcePos = source.pos;
            }
            var expandRole = ['miner', 'controller', 'transport', 'ztransport', 'mineral'];
            var roleInfo = {};
            var e;

            let _module = expansionModule[remoteInfo.expLevel];
            for (e in _module) {
                roleInfo[_module[e][_name]] = {
                    max: _module[e][_number],
                    level: _module[e][_level],
                };
            }

            for (e in expandRole) {
                if (roleInfo[expandRole[e]] !== undefined && roleInfo[expandRole[e]].max > 0) {
                    //totalCreeps[creepRole][goal]
                    //      spawnCount[creep.memory.party][creep.memory.role].count++;
                    let currentCount = newGetExpandRole(expandRole[e], remoteInfo.source, totalCreeps);

                    if (currentCount < roleInfo[expandRole[e]].max) {
                        // This is where it does the creation of the unit.
                        if (spawn.memory.created === undefined) {
                            spawn.memory.created = 0;
                        }
                        spawn.memory.created++;
                        let temp = {
                            build: getModuleRole(expandRole[e]).levels(roleInfo[expandRole[e]].level),
                            name: expandRole[e] + "-" + spawn.memory.created + "v",
                            memory: {
                                role: expandRole[e],
                                home: spawn.room.name,
                                parent: spawn.id,
                                boostNeeded: getModuleRole(expandRole[e]).boosts(roleInfo[expandRole[e]].level),
                                goal: remoteInfo.source,
                                level: roleInfo[expandRole[e]].level
                            }
                        };
                        if (totalCreeps[expandRole[e]] === undefined) {
                            totalCreeps[expandRole[e]] = {
                                count: 0,
                                goal: [],
                            };
                        }

                        if (totalCreeps[expandRole[e]].goal === undefined) totalCreeps[expandRole[e]].goal = [];

                        switch (expandRole[e]) {
                            case 'miner':
                                totalCreeps[expandRole[e]].goal.push(remoteInfo.source);
                                spawn.memory.expandCreate.unshift(temp);
                                break;
                            case 'ztransport':
                                let min = Game.getObjectById(remoteInfo.source);
                                if (min.pos.roomName == 'E14S38') {
                                    if (min !== null && min.mineralAmount > 0 &&
                                        min.room.controller !== undefined && min.room.controller.level >= 6) {
                                        spawn.memory.expandCreate.push(temp);
                                    } else if (min !== null && min.mineralAmount > 0 && min.room.controller === undefined) {
                                        totalCreeps[expandRole[e]].goal.push(remoteInfo.source);
                                        totalCreeps[expandRole[e]].count++;
                                        spawn.memory.expandCreate.push(temp);
                                    }
                                } else {
                                    totalCreeps[expandRole[e]].goal.push(remoteInfo.source);
                                    spawn.memory.expandCreate.push(temp);
                                }

                                break;
                            case 'controller':

                                if (remoteInfo.controller !== undefined && (source.energyCapacity === 3000 || source.energyCapacity === 1500)) {

                                    var level;
                                    let controlLeft = source.room.controller;
                                    if (source.room.controller !== undefined && source.room.controller.reservation !== undefined) {
                                        level = source.room.controller.reservation.ticksToEnd;
                                    } else {
                                        level = 0;
                                    }

                                    if (level === 0 || (level < controllerLevel) || (source.room.controller.level > 0)) {
                                        let controlParts;
                                        if (spawn.room.energyCapacityAvailable > 10000) {
                                            controlParts = 8;
                                        } else if (spawn.room.energyCapacityAvailable > 6000) {
                                            controlParts = 4;
                                        }
                                        if (controlParts !== undefined) {
                                            temp.build = [];
                                            for (var i = 0; i <= controlParts; i++) {
                                                temp.build.push(CLAIM);
                                                temp.build.push(MOVE);
                                            }
                                        }
                                        totalCreeps[expandRole[e]].goal.push(remoteInfo.source);

                                        spawn.memory.expandCreate.push(temp);
                                        //   return;
                                    }
                                }
                                break;
                            case 'mineral':
                                let mizn = Game.getObjectById(remoteInfo.source);
                                if (mizn !== null && mizn.mineralAmount > 0 &&
                                    mizn.room.controller !== undefined && mizn.room.controller.level >= 6) {
                                    totalCreeps[expandRole[e]].goal.push(remoteInfo.source);
                                    spawn.memory.expandCreate.push(temp);
                                } else if (mizn !== null && mizn.mineralAmount > 0 && mizn.room.controller === undefined) {
                                    totalCreeps[expandRole[e]].goal.push(remoteInfo.source);
                                    spawn.memory.expandCreate.push(temp);
                                }
                                break;

                            default:
                                totalCreeps[expandRole[e]].goal.push(remoteInfo.source);
                                spawn.memory.expandCreate.push(temp);
                                break;
                        }

                    }
                }
            }
        }
    }

    static checkBuild(spawn) {
        if (spawn.memory.buildLevel != spawn.room.controller.level) {
            var constr = require('commands.toStructure');
            constr.buildConstrLevel(spawn.room.controller);
            spawn.memory.buildLevel = spawn.room.controller.level;
        }
        return true;
    }

    // Newcount needs ID of an object in order to 
    // New count looks through game.creeps to find creeps that's parent
    // Id matches and returns an array of current count. 

    static runCreeps() {
        var ee;
        var portalInRooms; // Rooms that will have creeps coming through too.
        var roomTarget;
        if (Game.shard.name == 'shard0') {
            // Currently has no creeps going to shard0
            portalInRooms = ['E40S70', 'E40S80'];
            roomTarget = ['E38S72', 'E38S81'];

            for (let i = 0, iMax = portalInRooms.length; i < iMax; i++) {
                if (Game.rooms[portalInRooms[i]] !== undefined) {
                    let crps = Game.rooms[portalInRooms[i]].find(FIND_MY_CREEPS);
                    if (crps.length > 0) {
                        for (let e = 0, eMax = crps.length; e < eMax; e++) {
                            if (crps[e].memory.role === undefined) {
                                if (crps[e].name.substr(0, 5) == 'engin') {
                                    crps[e].memory.role = 'engineer';
                                } else {
                                    crps[e].memory.role = 'mule';
                                    crps[e].memory.level = 2;
                                }
                                crps[e].memory.party = roomTarget[i];
                                if (crps[e].memory.parent === undefined) {
                                    crps[e].memory.parent = Game.rooms[roomTarget[i]].alphaSpawn.id;
                                }
                                if (crps[e].memory.home === undefined) {
                                    crps[e].memory.home = portalInRooms[i];
                                }

                                crps[e].memory.didPortal = true;
                            }
                        }
                    }
                }
            }
        }
        if (Game.shard.name == 'shard1') {
            portalInRooms = ['E20S40', 'E20S50'];
            roomTarget = ['E23S38', 'E22S48'];

            for (let i = 0, iMax = portalInRooms.length; i < iMax; i++) {
                if (Game.rooms[portalInRooms[i]] !== undefined) {
                    let crps = Game.rooms[portalInRooms[i]].find(FIND_MY_CREEPS);
                    if (crps.length > 0) {
                        for (let e = 0, eMax = crps.length; e < eMax; e++) {
                            if (crps[e].memory.role === undefined) {
                                if (crps[e].name.substr(0, 5) == 'engin') {
                                    crps[e].memory.role = 'engineer';
                                } else {
                                    crps[e].memory.role = 'mule';
                                    crps[e].memory.level = 5;
                                }
                                crps[e].memory.party = roomTarget[i];
                                if (crps[e].memory.parent === undefined) {
                                    crps[e].memory.parent = Game.rooms[roomTarget[i]].alphaSpawn.id;
                                }
                                if (crps[e].memory.home === undefined) {
                                    crps[e].memory.home = portalInRooms[i];
                                }

                                crps[e].memory.didPortal = true;
                            }
                        }
                    }
                }
            }
        }
        if (Game.shard.name == 'shard2') {
            portalInRooms = ['E20S50'];
            roomTarget = ['E19S49'];
            for (let i = 0, iMax = portalInRooms.length; i < iMax; i++) {
                if (Game.rooms[portalInRooms[i]] !== undefined) {
                    let crps = Game.rooms[portalInRooms[i]].find(FIND_MY_CREEPS);
                    if (crps.length > 0) {
                        for (let e = 0, eMax = crps.length; e < eMax; e++) {
                            if (crps[e].memory.role === undefined) {
                                if (crps[e].name.substr(0, 5) == 'engin') {
                                    crps[e].memory.role = 'engineer';
                                } else {
                                    crps[e].memory.role = 'mule';
                                    crps[e].memory.level = 5;
                                }
                                crps[e].memory.didPortal = true;
                            }
                            if (crps[e].memory.parent === undefined) {
                                crps[e].memory.parent = Game.rooms[roomTarget[i]].alphaSpawn.id;
                            }
                            if (crps[e].memory.home === undefined) {
                                crps[e].memory.home = portalInRooms[i];
                            }
                            if (crps[e].memory.party === undefined) {
                                crps[e].memory.party = roomTarget[i];
                            }


                        }
                    }
                }
            }



            portalInRooms = undefined;
            roomTarget = undefined;
        }
        if (Memory.creeps === undefined) return false;

        var start;
        Memory.creepTotal = 0;
        var totalRoles = {};
        var cpuUsed = {};
        spawnCount = {};
        if (roleIndex === undefined) roleIndex = {};

        for (let name in Memory.creeps) {

            if (Memory.showInfo > 4)
                start = Game.cpu.getUsed();


            if (!Game.creeps[name]) { // Check to see if this needs deletion
                delete Memory.creeps[name]; // If it does then it does.
            } else {
                doSpawnCount(Game.creeps[name]); // THis is where the creeps are counted.
                if (Memory.showInfo > 1) {
                    if (totalRoles[Game.creeps[name].memory.role] === undefined) totalRoles[Game.creeps[name].memory.role] = 0;
                    totalRoles[Game.creeps[name].memory.role]++;
                    Memory.creepTotal++;
                }
                if ((Game.creeps[name].memory.sleeping !== undefined && Game.creeps[name].memory.sleeping > 0)) {
                    if (Game.creeps[name].memory.sleeping < 1000) {
                        //                    if (Game.creeps[name].ticksToLive <= Game.creeps[name].memory.sleeping) {
                        //                          Game.creeps[name].suicide();
                        //                        }
                        Game.creeps[name].say('💤' + Game.creeps[name].memory.sleeping);
                        Game.creeps[name].memory.sleeping--;
                    } else {
                        if (Game.time >= Game.creeps[name].memory.sleeping) {
                            Game.creeps[name].memory.sleeping = undefined;
                        } else {
                            if (Game.creeps[name].ticksToLive <= Game.creeps[name].memory.sleeping - Game.time) {
                                Game.creeps[name].suicide();
                            }
                            Game.creeps[name].say('💤' + (Game.creeps[name].memory.sleeping - Game.time));

                        }
                    }
                } else if (Game.creeps[name].memory.follower) {
                    // So here instead of doing what the creep normally does, it will want to see if it can find it's party 
                } else if (!Game.creeps[name].spawning) {
                    Game.creeps[name].memory.sleeping = undefined;
                    if (roleIndex[Game.creeps[name].memory.role] === undefined) {
                        var type = allModule.length;
                        while (type--) {
                            if (Game.creeps[name].memory.role == allModule[type][_name]) { // if they are the same
                                roleIndex[Game.creeps[name].memory.role] = type;
                                allModule[type][_require].run(Game.creeps[name]); // Then run the require of that role.
                                if (Game.creeps[name].memory.home === 'E24S33' && Game.creeps[name].memory.parent !== '5a9609b01fdc475500bd30bd') {
                                    Game.creeps[name].memory.reportDeath = true;
                                }
                                break;
                            }
                        }
                    } else {
                        allModule[roleIndex[Game.creeps[name].memory.role]][_require].run(Game.creeps[name]); // Then run the require of that role.     
                                if (Game.creeps[name].memory.home === 'E24S33' && Game.creeps[name].memory.parent !== '5a9609b01fdc475500bd30bd') {
                                    Game.creeps[name].memory.reportDeath = true;
                                }
                    }
                } else if (Game.creeps[name].spawning) {
                   // if (Game.creeps[name].pos.isNearTo(Game.creeps[name].room.boostLab)) {
                  //      console.log('creep spawning is near boostLab', Game.creeps[name].pos.roomName, Game.creeps[name].memory.role, Game.creeps[name].memory.boostNeeded);
                    //}
                    if (Game.creeps[name].memory.boostNeeded !== undefined && Game.creeps[name].memory.boostNeeded.length > 0 && Game.creeps[name].room.boostLab !== undefined && Game.creeps[name].room.boostLab.pos.isNearTo(Game.creeps[name]) && Game.creeps[name].room.boostLab._didBoost === undefined ) {
                        var neededMin = numberOfBody(Game.creeps[name], Game.creeps[name].memory.boostNeeded[0]) * 30;
                        Game.creeps[name].room.memory.boost = {
                            mineralType: Game.creeps[name].memory.boostNeeded[0],
                            timed: 20,
                            mineralAmount: neededMin
                        };
                        let lab = Game.creeps[name].room.boostLab;
                        console.log(roomLink(Game.creeps[name].room.name),'trying to do boost,',Game.creeps[name].room.memory.boost.mineralType,Game.creeps[name].room.memory.boost.mineralAmount,Game.creeps[name].room.boostLab._didBoost);
                        if(Game.creeps[name].room.boostLab._didBoost){
                            console.log('This shouldnt do a boost due to,',Game.creeps[name].room.boostLab._didBoost);
                            console.log('This shouldnt do a boost due to,',Game.creeps[name].room.boostLab._didBoost);
                            console.log('This shouldnt do a boost due to,',Game.creeps[name].room.boostLab._didBoost);
                            console.log('This shouldnt do a boost due to,',Game.creeps[name].room.boostLab._didBoost);
                        }
                        if (lab !== undefined && Game.creeps[name].room.memory.boost.mineralAmount >= lab.mineralAmount && Game.creeps[name].room.memory.boost.mineralType == lab.mineralType ) {
                            //            console.log('doing boost', good.length, roomLink(roomName));
                            let result = lab.boostCreep(Game.creeps[name]);
                            if (result === OK) {
                                if (Game.creeps[name].memory.isBoosted === undefined) Game.creeps[name].memory.isBoosted = [];
                                Game.creeps[name].room.boostLab._didBoost = true;
                                Game.creeps[name].memory.isBoosted.push(Game.creeps[name].memory.boostNeeded.shift());
                                console.log('SPAWNING BOOST', Game.creeps[name].memory.isBoosted,Game.creeps[name].room.boostLab._didBoost,roomLink(Game.creeps[name].room.name));
                                Game.creeps[name].room.memory.boost = {
                                    mineralType: 'none',
                                    timed: 20,
                                    mineralAmount: neededMin
                                };
                                //                                ;
                            }
                        }




                    }
                }
            }
            Memory.stats.roles = totalRoles;

        }
        return spawnCount;
    }

    static allModule() {
        return allModule;
    }


    // Okay here, false means that there is no creep
    // when it's add to the stack it also becomes true.

    static reportDeath(creep) {
        var spawn = Game.getObjectById(creep.memory.parent);
        if (spawn !== null && spawn.memory.expandCreate === undefined) spawn.memory.expandCreate = [];
        if (spawn !== null && spawn.memory.create === undefined) spawn.memory.create = [];
        if (spawn !== null) {
            switch (creep.memory.role) {
                case "miner":
                case "transport":
                case "ztransport":
                case "mineral":
                    spawn.memory.expandCreate.push(rebuildCreep(creep));
                    break;

                case "first":
                case "linker":
                    spawn.memory.create.unshift(rebuildCreep(creep));
                    break;
                case "scientist":
                case "harvester":
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
}
module.exports = theSpawn;