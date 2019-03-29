// Modules [name,  role.type,   # of them,  Level wanted]
// All modules
// Add your modules here if they want to be counted and kept track of.

// This module is where the require counts and what really determines the behavior.
// The role (1) here will be linked to the require run.
var controllerLevel = 1500;
var transportLevel = 20000;

var allModule = [
    ['bard', require('army.bard')],

    ['templar', require('temple.templar')],
    ['manager', require('temple.manager')],
    ['reclaimer', require('temple.reclaimer')],
    ['tribute', require('temple.tribute')],
    ['merchant', require('army.merchant')],

    ['wallAssist', require('role.wallAssist')],
    ['first', require('role.first')], // Should never have more firsts than containers...maybe..mmmm
    ['rampartGuard', require('army.rampartGuard')],
    ['remoteGuard', require('army.remoteGuard')],
    ['harass', require('army.harass')],
    ['assistant', require('role.assistant')],
    ['troll', require('army.troll')],
    ['paladin', require('army.paladin')],
    ['ranger', require('army.ranger')],
    ['demolisher', require('army.demolisher')],
    ['thief', require('army.thief')],
    ['mule', require('army.mule')],
    ['shardMule', require('army.shardMule')],
    ['healer', require('army.healer')], // Gather and move - just carry 
    ['mage', require('army.mage')],
    //    ['shooter', require('keeper.shooter')],
    ['minHarvest', require('role.mineral')],
    ['mineral', require('keeper.scientist')],
    ['engineer', require('army.engineer')],
    ['scout', require('army.scout')],
    ['homeDefender', require('role.defender2')],
    ['fighter', require('army.fighter')],
    //    ['upbuilder', require('role.upbuilder')],
    ['controller', require('role.controller')],
    ['Acontroller', require('army.controller')],
    ['ztransport', require('role.ztransport')], // Harvester - experiemnt w/o carry
    ['upgrader', require('role.upgrader')],
    ['wallwork', require('role.wallworker')],
    ['guard', require('keeper.guard2')],
    //    ['linker', require('role.linker')],
    ['harvester', require('role.harvester')],
    ['job', require('role.job')],
    ['transport', require('role.transport')], // Gather and move - just carry 
    ['miner', require('role.miner')] // Harvester - experiemnt w/o carry
];

var expansionModule = [
    // Zero level is just miner and builder of roadsn
    [], // Kept empty so nothing occurs and this can stay.
    [ // Level 1 500 Carry 2 work transports. 
        ['miner', 1, 2], // Harvester - experiemnt w/o carry 800 cost
        ['transport', 1, 0], // Gather and move - just carry  900 cost
        ['controller', 1, 1]
    ],
    [ // Level 2 750 Carry 1250 Energy
        ['miner', 1, 3], // Harvester - experiemnt w/o carry 1050
        ['transport', 1, 1], // Gather and move - just carry 1250
        ['controller', 1, 2]
    ],
    [ //Level 3 1000 Carry - 1750 Energy
        ['miner', 1, 4], // Harvester - experiemnt w/o carry 1250
        // There are two transports because this is cock blocked by expansions.
        ['transport', 1, 2], // Gather and move - just carry 1750
        ['controller', 1, 3]
    ],
    [ // level 4  1550 Carry - 2600 Energy
        ['miner', 1, 4], // Harvester - experiemnt w/o carry 1250
        ['transport', 1, 3], // Gather and move - just carry 2000
        ['controller', 1, 4]
    ],
    [ // Lv 5 - 2000 Carry 
        // Two transports @ 1000 Carry
        ['miner', 1, 5], // Harvester - experiemnt w/o carry 1550
        ['transport', 1, 4], // Gather and move - just carry 2600
        ['controller', 1, 4]
    ],
    [
        ['miner', 1, 5], // Harvester - experiemnt w/o carry 1550
        ['transport', 2, 2], // Gather and move - just carry 1750x2
        ['controller', 1, 4]

    ], // Level seven
    [ // Lv 7 - 3100 Carry
        ['miner', 1, 5], // Harvester - experiemnt w/o carry 1550
        ['transport', 2, 3], // Gather and move - just carry 2000x2
        ['controller', 1, 4]
    ],
    // lv 8
    [
        ['miner', 1, 5], // Harvester - experiemnt w/o carry 1550
        ['transport', 2, 4], // Gather and move - just carry 2600x2
        ['controller', 1, 4]

    ], // Lv 9
    [
        ['miner', 1, 5], // Harvester - experiemnt w/o carry 1550
        ['transport', 3, 3], // Gather and move - just carry 2000x3
        ['controller', 1, 4]
    ],
    [ // LEVEL 10  For Mineral Harvesting.
        ['miner', 1, 5], // Harvester - experiemnt w/o carry 1550
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



function addToBody(body, type, amount) {
    while (amount--) {
        body.push(type);
    }
    return body;
}

function createDefender(invaderStats) {
    let theBuild = [];
    let theBoost = [];
    let theLevel = 0;
    if (invaderStats === undefined) return;
    if (invaderStats.level === 10 && invaderStats.attack === 30 && invaderStats.range === 10) {
        theBuild = [TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, CARRY, MOVE, CARRY];
        theLevel = 0;
    } else if (invaderStats.level === 15) {
        theBuild = [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, CARRY, CARRY, MOVE, CARRY];
        theLevel = 1;
    } else if (invaderStats.level >= 55) {
        theBuild = getModuleRole('homeDefender').levels(7);
        theLevel = 7;
    } else if (invaderStats.level >= 45) {
        theBuild = [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, RANGED_ATTACK, RANGED_ATTACK, CARRY, RANGED_ATTACK, RANGED_ATTACK, CARRY, MOVE, CARRY
        ];

        theBoost = ['KHO2', 'GHO2'];
        theLevel = 4;
    } else { //if (invaderStats.level >= 25)
        //theBuild = getModuleRole('homeDefender').levels(5);
        theBuild = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, CARRY, RANGED_ATTACK, RANGED_ATTACK, CARRY, MOVE, CARRY
        ];

        theBoost = ['KHO2', 'UH'];
        theLevel = 3;
    }

    if (invaderStats.skRoom && Game.flags[invaderStats.flagName] !== undefined) {
        if (invaderStats.level <= 35) {
            //            console.log('Low invaderlevel for defender creation');
            return undefined;
        }
        let toughDmg = Math.ceil(invaderStats.range * 0.3);
        let healNeed = Math.ceil(toughDmg / 12);
        let rangeNeed = Math.ceil(invaderStats.heal / 10);
        //    invaderStats.healerCount--;
        if (invaderStats.healerCount < 1) invaderStats.healerCount = 1;
        rangeNeed = Math.ceil(rangeNeed / invaderStats.healerCount);
        //      if (invaderStats.healerCount === 0) rangeNeed = 1;
        if (rangeNeed < 1) rangeNeed = 1;
        let toughT3Need = Math.ceil(toughDmg / 100);
        let healT3Need = Math.ceil(healNeed / 4);
        let rangeT3Need = Math.ceil(rangeNeed / 4);
        let totalParts = toughT3Need + healT3Need + rangeT3Need;

        if (rangeT3Need < 1) rangeT3Need = 1;
        if (totalParts < 1) totalParts = 1;
        if (healT3Need < 1) healT3Need = 1;


        if (totalParts > 12) {
            let moveT3Need = Math.ceil(totalParts / 4); // 5
            theBuild = [];
            theBuild = addToBody(theBuild, TOUGH, toughT3Need);
            theBuild = addToBody(theBuild, MOVE, moveT3Need);
            theBuild = addToBody(theBuild, RANGED_ATTACK, rangeT3Need);
            theBuild = addToBody(theBuild, HEAL, healT3Need);
            theBuild = addToBody(theBuild, CARRY, 6);
            theBoost = ['XKHO2', 'XGHO2', 'XZHO2', 'XLHO2'];
            theLevel = 10;
        } else {
            theBuild = [];
            theBuild = addToBody(theBuild, TOUGH, toughT3Need);
            theBuild = addToBody(theBuild, MOVE, totalParts);
            theBuild = addToBody(theBuild, RANGED_ATTACK, rangeT3Need);
            theBuild = addToBody(theBuild, HEAL, healT3Need);
            theBuild = addToBody(theBuild, CARRY, 6);
            theBoost = ['XKHO2', 'XGHO2', 'XLHO2'];
            theLevel = 10;
        }

        //        console.log(invaderStats.level,'CReATING SK BODY!!!:', theBuild, "Bost:", theBoost, invaderStats.room, invaderStats.flagName);
    }
    //    if (Game.flags[invaderStats.flagName] === undefined) {
    // console.log('INvader Flag doesnt exist yet...', invaderStats.room, invaderStats.flagName);
    //  }

    /*
        let useRangeAttack = false;
        let useAttack = true;

        if (invaderStats.kite) {
            // Kiting means it needs range attack in order to 'chase';
            useRangeAttack = true;
            console.log("need rangeAttack for kite chasing.");
        }
        if (invaderStats.heal > 0) {
            useRangeAttack = true; // Healing means it needs Range to lock down
            // It also needs attack to out damage.
            console.log("Needs to out damage healing");
        }
    */
    return { body: theBuild, boost: theBoost, level: theLevel };
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
                            _body = getModuleRole(_module[uo][_name]).levels(_module[uo][_level], spawn.memory.roadsTo[type], spawn.room.name);
                            _boost = getModuleRole(_module[uo][_name]).boosts(_module[uo][_level], spawn.memory.roadsTo[type], spawn.room.name);
                        }
                    }
                }
            }
        }

    } else if (creep.memory.role == 'first' || creep.memory.role == 'scientist') {
        if (Game.flags[creep.memory.home] !== undefined && Game.flags[creep.memory.home].color == COLOR_WHITE && (Game.flags[creep.memory.home].secondaryColor == COLOR_GREEN ||
                Game.flags[creep.memory.home].secondaryColor == COLOR_PURPLE)) {
            currentModule = Game.flags[creep.memory.home].memory.module;
        }

        for (let type in currentModule) {
            if (currentModule[type][_name] == creep.memory.role) {
                _body = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level], creep.memory.home);
                _boost = getModuleRole(currentModule[type][_name]).boosts(currentModule[type][_level], creep.memory.home);
                break;
            }
        }
    } else if (creep.memory.role == 'harvester') {
        if (Game.flags[creep.memory.home] !== undefined) { // THis is desgined to rebuild the harvester and has enough minerals to do 1/1/1
            if (Memory.empireSettings && Memory.empireSettings.boost.harvest && creep.room.controller.level === 8) {
                // Creating 1/1/1 bodies only when rebuilt.
                creep.memory.level = 10;
                _body = _.clone(getModuleRole('harvester').levels(10, creep.memory.home));
                _boost = getModuleRole('harvester').boosts(10, creep.memory.home);
                if (creep.room.memory.powerLevels && creep.room.memory.powerLevels[PWR_REGEN_SOURCE]) {
                    // so base is 3000 - each level adds 1k
                    // 6(7) base
                    // 30 
                    // 1000/300 
                    // 2 * 2 * 300 = 1200
                    var neededWork = creep.room.memory.powerLevels[PWR_REGEN_SOURCE].level * 2;
                    var boostedWork = Math.ceil(neededWork / 7);
                    if (boostedWork < 1) boostedWork = 1;
                    for (let i = 0; i < boostedWork; i++) {
                        _body.push(WORK);
                        if (i % 2 === 0) _body.push(MOVE);
                        if (i % 2 === 0) _body.push(CARRY);
                    }
                    //                    console.log(roomLink(creep.room.name),'Created Harveseter with',_body.length,creep.room.memory.powerLevels[PWR_REGEN_SOURCE].level);


                    /*
                    let goal = Game.getObjectById(creep.memory.sourceID);
                    if(goal && goal.effects && goal.effects.length > 0){
                            console.log('goal effects',goal.effects[0].power,goal.effects[0].ticksRemaining,goal.effects[0].level);
                            if(goal.effects[0].level > 2){
                            }
                    }
                    _body.push(WORK);
                    _body.push(WORK);
                    _body.push(MOVE);
                    _body.push(CARRY);
                    _body.push(CARRY);     */
                }
            } else {
                currentModule = Game.flags[creep.memory.home].memory.module;
                for (let type in currentModule) {
                    if (currentModule[type][_name] == creep.memory.role) {
                        creep.memory.level = currentModule[type][_level];
                        _body = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level], creep.memory.home);
                        _boost = getModuleRole(currentModule[type][_name]).boosts(currentModule[type][_level], creep.memory.home);
                        break;

                    }
                }
            }
        }
    } else {
        for (var z in creep.body) {
            _body.push(creep.body[z].type);
        }
        /*
        for (let type in currentModule) {
            if (currentModule[type][_name] == creep.memory.role) {
                _boost = getModuleRole(currentModule[type][_name]).boosts(currentModule[type][_level], creep.memory.home);
                break;
            }
        } */
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
    if (spawnCount[creep.memory.parent].creepCount === undefined) {
        spawnCount[creep.memory.parent].creepCount = 0;
    }
    if (spawnCount[creep.memory.parent].total === undefined) {
        spawnCount[creep.memory.parent].total = 0;
    }
    spawnCount[creep.memory.parent].bodyCount += creep.body.length;
    spawnCount[creep.memory.parent].creepCount++;

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

function numCreepParts(creep, boostType) {
    let count = 0;
    for (let i in creep.body) {
        let type = creep.body[i].type; //'work'
        if (BOOSTS[type][boostType] !== undefined && !creep.body[i].boost) {
            // Means that this is a good boost for this body type.   
            count++;
        }
    }
    return {
        mineral: 30 * count,
        energy: 20 * count,
        count: count,
    };
}

//

var cpuRankings;
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


            if (totalCreeps[currentModule[type][_name]] === undefined) {
                totalCreeps[currentModule[type][_name]] = {
                    count: 0,
                    goal: []
                };
            }
            if (spawn.room.controller.isPowerEnabled) {
                /*if(currentModule[type][_name] === 'harvester'){

                }*/
            }

            if (currentModule[type][_number] === 0) {} else if (currentModule[type][_name] == 'wallwork' && Game.rooms[spawn.room.name].memory.weakestWall !== undefined && Game.rooms[spawn.room.name].memory.weakestWall > Memory.empireSettings.maxWallSize && Game.rooms[spawn.room.name].memory.focusWall === undefined) {} else if ((currentModule[type][_name] == 'minHarvest' || currentModule[type][_name] == 'assistant') && (min !== null) && (min.ticksToRegeneration > 0)) {

            }
            /* else if(currentModule[type][_name] == 'minHarvest' && spawn.room.storage.total > 990000 && spawn.room.terminal.total > 290000 && (min !== null) && (min.mineralAmount !== 0)){

                        }*/
            else if (spawn.room.memory.alert && _.contains(alertProhib, currentModule[type][_name])) {

                //            } else if (currentModule[type][_name] == 'upbuilder' && ((spawn.room.powerspawn !== undefined && spawn.room.powerspawn.power > 0) && (spawn.room.controller.ticksToDowngrade > 25000))) { // current stop for power.
            } else if (spawn.room.memory.spawnDefenderNeeded && currentModule[type][_name] == 'homeDefender') {
                // When the room only spawns defender when needed
                if (spawn.room.memory.defenderActive !== undefined) {
                    //                    console.log(roomLink(spawn.room.name), "Is spawning defenders when needed", spawn.room.memory.defenderActive,totalCreeps[currentModule[type][_name]].count , currentModule[type][_number]);
                    if (totalCreeps[currentModule[type][_name]].count < currentModule[type][_number]) {
                        let defend = createDefender(spawn.room.memory.invaderStats);
                        if (defend) {
                            //                            console.log(spawn.room.memory.invaderStats.level,':Lv defender created', defend.body, roomLink(spawn.room.name) );
                            spawn.memory.create.unshift({
                                build: defend.body,
                                name: currentModule[type][_name] + totalCreeps[currentModule[type][_name]].count + "*" + spawn.memory.created,
                                memory: {
                                    role: currentModule[type][_name],
                                    boostNeeded: defend.boost,
                                    home: spawn.room.name,
                                    parent: spawn.id,
                                    flagDefend: spawn.room.memory.invaderStats.flagName,
                                    invadeLevel: spawn.room.memory.invaderStats.level,
                                    level: defend.level

                                }
                            });
                            totalCreeps[currentModule[type][_name]].count++;
                            spawn.memory.created++;
                        } else {
                            //console.log("error defeder created?", roomLink(spawn.room.name),spawn.room.memory.invaderStats.heal,spawn.room.memory.invaderStats.range);
                        }
                    }
                }

            } else if (currentModule[type][_name] == 'upgrader' && spawn.room.controller.level === 8 && currentModule[type][_level] < 7) {

            } else {

                if (totalCreeps[currentModule[type][_name]].count < currentModule[type][_number]) {
                    if (spawn.memory.create === undefined) spawn.memory.create = [];

                    let mod = getModuleRole(currentModule[type][_name]);
                    if (mod !== undefined) {

                        var theBuild = mod.levels(currentModule[type][_level], spawn.room.name);
                        let temp = {
                            build: theBuild,
                            name: currentModule[type][_name] + totalCreeps[currentModule[type][_name]].count + "*" + spawn.memory.created,
                            memory: {
                                role: currentModule[type][_name],
                                boostNeeded: mod.boosts(currentModule[type][_level], spawn.room.name),
                                home: spawn.room.name,
                                parent: spawn.id,
                                level: currentModule[type][_level]
                            }
                        };

                        if (currentModule[type][_name] == 'job') {
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
                //                return;
            }
            // Expand Module Check.

            if (remoteInfo.sourcePos === undefined) {
                remoteInfo.sourcePos = source.pos;
            }
            if (spawn.memory.remoteStop.length !== 0 && _.contains(spawn.memory.remoteStop, remoteInfo.sourcePos.roomName)) {
                console.log('REMOTE PROHIBITED ', remoteInfo.sourcePos.roomName);
                continue;
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
                                remoteLvl: roleInfo[expandRole[e]].level,
                                parent: spawn.id,
                                boostNeeded: getModuleRole(expandRole[e]).boosts(roleInfo[expandRole[e]].level, spawn.room.name),
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
                                if (min && min.pos && (min.pos.roomName == 'E14S38' || min.pos.roomName == 'E59S51')) {
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

                                if (remoteInfo.controller !== undefined && source && (source.energyCapacity === 3000 || source.energyCapacity === 1500)) {

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

    static runCreeps() {
        var ee;
        var portalInRooms; // Rooms that will have creeps coming through too.
        var roomTarget;
        if (Game.shard.name == 'shard0') {
            // Currently has no creeps going to shard0
            portalInRooms = ['E40S70', 'E40S80'];
            roomTarget = ['E38S72'];

            for (let i = 0, iMax = portalInRooms.length; i < iMax; i++) {
                if (Game.rooms[portalInRooms[i]] !== undefined) {
                    let crps = Game.rooms[portalInRooms[i]].find(FIND_MY_CREEPS);
                    if (crps.length > 0) {
                        for (let e = 0, eMax = crps.length; e < eMax; e++) {
                            if (crps[e].memory.role === undefined) {
                                if (crps[e].name.substr(0, 5) == 'engin') {
                                    crps[e].memory.role = 'engineer';
                                } else {
                                    crps[e].memory.role = 'shardMule';
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
            roomTarget = ['E23S38', 'E21S49'];

            for (let i = 0, iMax = portalInRooms.length; i < iMax; i++) {
                if (Game.rooms[portalInRooms[i]] !== undefined) {
                    let crps = Game.rooms[portalInRooms[i]].find(FIND_MY_CREEPS);
                    if (crps.length > 0) {
                        for (let e = 0, eMax = crps.length; e < eMax; e++) {
                            if (crps[e].memory.role === undefined) {
                                if (crps[e].name.substr(0, 5) == 'engin') {
                                    crps[e].memory.role = 'engineer';
                                } else if (crps[e].name.substr(0, 5) == 'power' || crps[e].getActiveBodyparts(RANGED_ATTACK) > 0) {
                                    crps[e].memory.role = 'mule';
                                    crps[e].memory.party = roomTarget[i];
                                    crps[e].memory.level = 9;
                                } else {
                                    crps[e].memory.role = 'shardMule';
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
                                } else if (crps[e].name.substr(0, 5) == 'power') {
                                    crps[e].memory.role = 'shardMule';
                                    crps[e].memory.party = 'shard1';
                                    crps[e].memory.readyToPortal = true;
                                } else {
                                    crps[e].memory.role = 'shardMule';
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
                                if (crps[e].name[9] === 'd' && crps[e].name[10] === '2') {
                                    crps[e].memory.party = roomTarget[i];
                                } else if (crps[e].name[9] === 'd' && crps[e].name[10] === '2' && crps[e].name[9] === 'd' && crps[e].name[17] === '3') { // Shard2 from shard 3
                                    crps[e].memory.party = 'shard1';
                                } else if (crps[e].name[9] === 'd' && crps[e].name[10] === '1' && crps[e].name[17] === '3') { // Shard2 from shard 3
                                    crps[e].memory.party = 'shard1';
                                } else if (crps[e].name[9] === 'd' && crps[e].name[10] === '1' && crps[e].name[17] === '2') { // Shard2 from shard 3
                                    crps[e].memory.party = roomTarget[i];
                                } else {
                                    crps[e].memory.party = 'shard3';
                                }
                            }



                        }
                    }
                }
            }



            portalInRooms = undefined;
            roomTarget = undefined;
        }
        if (Game.shard.name == 'shard3') {
            portalInRooms = ['E20S50'];
            roomTarget = ['E19S49'];
            for (let i = 0, iMax = portalInRooms.length; i < iMax; i++) {
                if (Game.rooms[portalInRooms[i]] !== undefined) {
                    let crps = Game.rooms[portalInRooms[i]].find(FIND_MY_CREEPS);
                    if (crps.length > 0) {
                        for (let e = 0, eMax = crps.length; e < eMax; e++) {
                            if (crps[e].memory.role === undefined) {
                                if (crps[e].getActiveBodyparts(CLAIM) > 0) {
                                    crps[e].memory.role = 'Acontroller';
                                } else if (crps[e].getActiveBodyparts(WORK) > 0) {
                                    crps[e].memory.role = 'engineer';
                                    crps[e].memory.level = 5;
                                } else {
                                    crps[e].memory.role = 'mule';
                                    crps[e].memory.level = 9;
                                }

                                //if (crps[e].name.substr(0, 5) == 'engin') {
                                //crps[e].memory.role = 'engineer';
                                /*} else {
                                    crps[e].memory.role = 'shardMule';
                                    crps[e].memory.level = 5;
                                }*/
                                crps[e].memory.didPortal = true;
                            }
                            if (crps[e].memory.parent === undefined && Game.rooms[roomTarget[i]] && Game.rooms[roomTarget[i]].alphaSpawn) {
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
        //        if (Memory.creeps === undefined) return false;

        var start;
        var roleCPUCount;
        Memory.creepTotal = 0;
        var totalRoles = {};
        var cpuUsed = {};
        var countCPU;// = true;
        var roleCount;// = 'homeDefender';
        var roleCPU;
        spawnCount = {};
        if (roleIndex === undefined) roleIndex = {};
        if (roleCount && Game.shard.name === 'shard1') {
            console.log('LOOKING AT ', roleCount, Game.cpu.bucket);
        }
        for (let name in Memory.creeps) {
            if (countCPU && Game.shard.name === 'shard1') start = Game.cpu.getUsed();
            if (!Game.creeps[name]) { // Check to see if this needs deletion
                delete Memory.creeps[name]; // If it does then it does.
            } else {
                doSpawnCount(Game.creeps[name]); // THis is where the creeps are counted.
                if (Game.creeps[name].memory.role === undefined) {
                    Game.creeps[name].memory.role = 'first';
                    Game.creeps[name].memory.death = true;
                    Game.creeps[name].memory.home = Game.creeps[name].room.name;
                }
                if (Memory.showInfo > 1) {
                    if (totalRoles[Game.creeps[name].memory.role] === undefined) totalRoles[Game.creeps[name].memory.role] = 0;
                    totalRoles[Game.creeps[name].memory.role]++;
                    Memory.creepTotal++;
                }
                if ((Game.creeps[name].memory.sleeping !== undefined && Game.creeps[name].memory.sleeping > 0)) {
                    if (Game.creeps[name].memory.sleeping < 1000) {
                        Game.creeps[name].say('💤');
                        Game.creeps[name].memory.sleeping--;
                    } else {
                        if (Game.time >= Game.creeps[name].memory.sleeping) {
                            Game.creeps[name].memory.sleeping = undefined;
                        } else {
                            if (Game.creeps[name].ticksToLive <= Game.creeps[name].memory.sleeping - Game.time) {
                                Game.creeps[name].suicide();
                            }
                            Game.creeps[name].say('💤');

                        }
                    }
                    if (roleCount && Game.creeps[name].memory.role === roleCount) {
                        if (!Game.creeps[name].memory.cpu) {
                            Game.creeps[name].memory.cpu = [];
                        }
                        Game.creeps[name].memory.cpu.push(0);
                        if (Game.creeps[name].memory.cpu.length > 300) {
                            Game.creeps[name].memory.cpu.shift();
                        }

                        console.log(Game.creeps[name].memory.role, roomLink(Game.creeps[name].pos.roomName), "CpUZZ", _.sum(Game.creeps[name].memory.cpu), "/", Game.creeps[name].memory.cpu.length, "=", (_.sum(Game.creeps[name].memory.cpu) / Game.creeps[name].memory.cpu.length));

                    }
                } else if (Game.creeps[name].memory.follower) {
                    // So here instead of doing what the creep normally does, it will want to see if it can find it's party 
                } else if (!Game.creeps[name].spawning) {
                    Game.creeps[name].memory.sleeping = undefined;
                    if (roleCount && Game.creeps[name].memory.role === roleCount) {
                        roleCPU = Game.cpu.getUsed();
                    } else {
                        roleCPU = undefined;
                    }

                    if (roleIndex[Game.creeps[name].memory.role] === undefined) {
                        var type = allModule.length;
                        while (type--) {
                            if (Game.creeps[name].memory.role == allModule[type][_name]) { // if they are the same
                                roleIndex[Game.creeps[name].memory.role] = type;

                                allModule[type][_require].run(Game.creeps[name]); // Then run the require of that role.

                                break;
                            }
                        }
                    } else {
                        allModule[roleIndex[Game.creeps[name].memory.role]][_require].run(Game.creeps[name]); // Then run the require of that role.     
                    }

                    if (roleCPU) {
                        if (!Game.creeps[name].memory.cpu) {
                            Game.creeps[name].memory.cpu = [];
                        }
                        Game.creeps[name].memory.cpu.push(Game.cpu.getUsed() - roleCPU);
                        if (Game.creeps[name].memory.cpu.length > 300) {
                            Game.creeps[name].memory.cpu.shift();
                        }

                        console.log(Game.cpu.getUsed() - roleCPU,Game.creeps[name].memory.role, roomLink(Game.creeps[name].pos.roomName), "CpU", _.sum(Game.creeps[name].memory.cpu), "/", Game.creeps[name].memory.cpu.length, "=", (_.sum(Game.creeps[name].memory.cpu) / Game.creeps[name].memory.cpu.length));

                    }

                } else if (Game.creeps[name].spawning) {}
            }
            if (Game.shard.name === 'shard1' && countCPU) {
                if (Game.creeps[name] && !Game.creeps[name].spawning) {
                    if (roleCPUCount === undefined) {
                        roleCPUCount = {};
                    }
                    if (roleCPUCount[Game.creeps[name].memory.role] === undefined) {
                        roleCPUCount[Game.creeps[name].memory.role] = {
                            totalCPU: 0,
                            totalCreeps: 0,
                            roleName: Game.creeps[name].memory.role,
                            //       sumTotalCPU: ,
                        };
                    }
                    let cpuUsed = Game.cpu.getUsed() - start;
                    roleCPUCount[Game.creeps[name].memory.role].totalCreeps++;
                    roleCPUCount[Game.creeps[name].memory.role].totalCPU += cpuUsed;

                    //if (Game.shard.name === 'shard1') console.log("   " + Game.creeps[name].memory.role + " ROLE USED:", cpuUsed);

                }
            }

            Memory.stats.roles = totalRoles;

        }
        // thief, ztransport,miner,healer,transport,miner
        if (Game.shard.name === 'shard1' && countCPU) {
            roleCPUCount = _.sortBy(roleCPUCount, function(n) { return Math.floor((n.totalCPU / n.totalCreeps) * 100); });

            if (cpuRankings === undefined) cpuRankings = {};

            for (let ee in roleCPUCount) {
                //                if( ee === 'harvester' || ee === 'linker')
                if (cpuRankings[roleCPUCount[ee].roleName] === undefined) cpuRankings[roleCPUCount[ee].roleName] = [];
                let cpu = (roleCPUCount[ee].totalCPU / roleCPUCount[ee].totalCreeps) * 100;
                cpuRankings[roleCPUCount[ee].roleName].push(cpu);
                if (cpuRankings[roleCPUCount[ee].roleName].length > 30) cpuRankings[roleCPUCount[ee].roleName].shift();


                roleCPUCount[ee].sumTotalCPU = _.sum(cpuRankings[roleCPUCount[ee].roleName]);
                //cpuRankings.length;
                //                if (cpu > 35 )

                //                if(cpuRankings[roleCPUCount[ee].roleName].length){
                //                        console.log(cpuRankings[roleCPUCount[ee].roleName][0],cpuRankings[roleCPUCount[ee].roleName][1],_.sum(cpuRankings[roleCPUCount[ee].roleName]));
                //                  }
            }

            roleCPUCount = _.sortBy(roleCPUCount, function(n) { return n.sumTotalCPU; });
            console.log('CPU COUNTER : Ranked by Lowest to Highest CPU use', Game.cpu.bucket);
            for (let ee in roleCPUCount) {
                let toal = cpuRankings[roleCPUCount[ee].roleName].length;
                console.log("Role:", roleCPUCount[ee].roleName, "     Last Tick Ave:", Math.floor((roleCPUCount[ee].totalCPU / roleCPUCount[ee].totalCreeps) * 100), "=", "(" + roleCPUCount[ee].totalCreeps + "/" + roleCPUCount[ee].totalCPU + ")   TotalCPU:", Math.floor(roleCPUCount[ee].sumTotalCPU / toal), roleCPUCount[ee].roleName, "Total:", roleCPUCount[ee].sumTotalCPU, " Input #:", toal);
            }

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
                case "job":
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