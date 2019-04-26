    var party = require('commands.toParty');
    var observer = require('build.observer');
    var delayBetweenScan = 10;

    function doDefendThings(flag) {
        if (flag.room === undefined) return;

        var hostiles;
        var creeps;
        if (flag.secondaryColor == COLOR_RED) {
            hostiles = flag.room.invaders;
            //          flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });
            if (hostiles.length === 0) {
                flag.remove();
            } else {
                flag.setPosition(hostiles[0].pos.x, hostiles[0].pos.y);


                if (flag.memory.invaderStats === undefined) {
                    flag.memory.invaderStats = {
                        count: hostiles.length,
                        level: 0,
                        tough: 0,
                        heal: 0,
                        attack: 0,
                        range: 0,
                        healerCount: 0,
                        rangerCount: 0,
                        figherCount: 0,
                        room: flag.pos.roomName,
                        flagName: flag.name,
                        skRoom: false,
                        kite: false,
                    };
                    for (let ee in hostiles) {
                        let analyzed = analyzeCreep(hostiles[ee]);
                        flag.memory.invaderStats.level += analyzed.level;
                        flag.memory.invaderStats.heal += analyzed.body.heal * 12;
                        flag.memory.invaderStats.attack += analyzed.body.attack * 30;
                        flag.memory.invaderStats.range += analyzed.body.range * 10;
                        flag.memory.invaderStats.tough += analyzed.body.tough;
                        flag.memory.invaderStats.skRoom = flag.pos.isSkRoom();
                        if (analyzed.type === 'ranger') {
                            flag.memory.invaderStats.kite = true;
                            flag.memory.invaderStats.rangerCount++;
                        }
                        if (analyzed.type === 'fighter') {
                            flag.memory.invaderStats.figherCount++;
                        }
                        if (analyzed.type === 'healer') {
                            flag.memory.invaderStats.healerCount++;
                        }
                    }
                }

            }

            creeps = flag.room.find(FIND_MY_CREEPS);
            if (creeps.length > 0) {
                flag.memory.responseRoom = creeps[0].memory.home;
                for (var a in creeps) {
                    creeps[a].memory.runFrom = flag.name;
                    if (creeps[a].memory.sleeping !== undefined) {
                        creeps[a].memory.sleeping = undefined;
                    }
                }
            }
            let edroom = Game.rooms[flag.memory.responseRoom];
            if (edroom && edroom.memory.spawnDefenderNeeded) {
                edroom.memory.invaderStats = flag.memory.invaderStats;
                edroom.memory.defenderActive = true;
            }
            // && edroom.memory.spawnDefenderNeeded

        } else if (flag.secondaryColor == COLOR_WHITE) {
            hostiles = flag.room.enemies;
            //            flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });
            if (hostiles.length === 0) {
                flag.remove();
            } else {
                flag.setPosition(hostiles[0].pos.x, hostiles[0].pos.y);
            }

            //            flag.room.memory.invasionFlag = flag.name;

            creeps = flag.pos.findInRange(FIND_MY_CREEPS, 15);
            //        creeps = _.filter(creeps, function(o) {
            //              return o.getActiveBodyParts(WORK) > 0 || o.getActiveBodyParts(CARRY) > 0;
            //            });
            if (creeps.length > 0) {
                for (var b in creeps) {
                    creeps[b].memory.runFrom = flag.name;
                }
            }
        }

    }

    function rampartThings(flag) {
        if (flag.color !== COLOR_YELLOW) {
            flag.memory.invadeDelay = undefined;
            flag.memory.invaderTimed = undefined;
            flag.memory.alert = undefined;

            return;
        }
        if (flag.memory.invaderTimed === undefined) flag.memory.invaderTimed = 0;
        if (flag.memory.alert === undefined || !flag.memory.alert) {
            flag.memory.alert = true;
        }
        console.log('Rampart Flag @ ', roomLink(flag.pos.roomName), flag.memory.invaderTimed, flag.memory.invadeDelay);
        if (flag.memory.alert) {
            // Look for creeps
            let bads = flag.room.enemies;
            if (bads.length === 0) {

                if (flag.memory.invadeDelay === undefined)
                    flag.memory.invadeDelay = 100;
                flag.memory.invadeDelay--;
                if (flag.memory.invadeDelay < 0) {

                    flag.memory.invadeDelay = undefined;
                    flag.memory.invaderTimed = undefined;
                    flag.memory.alert = undefined;
                    flag.room.memory.towerRepairID = undefined;
                    flag.remove();
                }

            } else {
                if (flag.memory.invadeDelay === undefined)
                    flag.memory.invadeDelay = 100;
            }
        }
        flag.memory.invaderTimed++;
    }

    //    function clearFlagMemory() {}
    // Difference is one does if it's undefined
    function softSetMemory(flag) {
        var mem = flag.memory;
        if (mem.module === undefined) {
            mem.module = [];
        }
        if (mem.alphaSpawn === undefined) {
            var spwns = flag.room.find(FIND_STRUCTURES);
            spwns = _.filter(spwns, function(o) {
                return o.structureType == STRUCTURE_SPAWN && o.memory.alphaSpawn;
            });
            if (spwns.length > 0)
                mem.alphaSpawn = spwns[0].id;
        }
    }

    function hardSetMemory(flag) {
        var mem = flag.memory;
        mem.module = [];
        var spwns = flag.room.find(FIND_STRUCTURES);
        spwns = _.filter(spwns, function(o) {
            return o.structureType == STRUCTURE_SPAWN && o.memory.alphaSpawn;
        });
        if (spwns.length > 0)
            mem.alphaSpawn = spwns[0].id;

        //            flag.secondaryColor = COLOR_GREEN;
    }

    var roomer = {
        minHarvest: undefined,
        harvester: undefined,
        job: undefined,
        wallwork: undefined,
        sort: undefined,
        upgrader: undefined,
        lab: undefined,
        tower: undefined,
        wait: undefined,
    };


    function adjustModule(flag) {

        /*            harvester  : flag.room.energyCapacityAvailable,
                    linker   : flag.room.controller.level,
                    defender : flag.room.storage,
                    minHarvest: flag.room.terminal,
                    scientist    : flag.memory.masterLinkID,*/

        // Look at room and make adjustments to module

        if (flag.room === undefined) return;
        var events = [];
        for (var e in roomer) {
            events.push(e);
        }

        if (flag.memory.module === undefined) {
            flag.memory.module = [];
        }

        var keys = Object.keys(roomer);
        var ee = keys[flag.memory.checkWhat];
        var ez;
        let zzz;
        var roomEnergy = flag.room.energyCapacityAvailable;


        flag.room.visual.text(flag.memory.checkWhat, flag.pos, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });

        switch (ee) {
            case "tower":
                flag.room.memory.towers = [];

                towers = flag.room.find(FIND_MY_STRUCTURES);
                towers = _.filter(towers, function(o) {
                    return o.structureType == STRUCTURE_TOWER;
                });
                for (var i in towers) {
                    flag.room.memory.towers.push(towers[i].id);
                }
                break;
            case "upgrader":
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1 && flag.room.controller.level !== 8) {
                    flag.memory.module.push([ee, 0, 0]);
                } else if (flag.memory.module[ez] !== undefined) {

                    if (roomEnergy > 2300) {
                        flag.memory.module[ez][_level] = 6;
                    } else if (roomEnergy === 2300) {
                        flag.memory.module[ez][_level] = 5;
                    } else if (roomEnergy >= 1800) {
                        flag.memory.module[ez][_level] = 4;
                    } else if (roomEnergy >= 1300) {
                        flag.memory.module[ez][_level] = 3;
                    }
                    /*
                                        if (flag.room.storage && flag.room.storage.total > 700000) {
                                            flag.memory.module[ez][_number] = 7;
                                        } else if (flag.room.storage && flag.room.storage.total > 600000) {
                                            flag.memory.module[ez][_number] = 6;
                                        } else if (flag.room.storage && flag.room.storage.total > 500000) {
                                            flag.memory.module[ez][_number] = 5;
                                        } else if (flag.room.storage && flag.room.storage.total > 300000) {
                                            flag.memory.module[ez][_number] = 3;
                                        } else if (flag.room.storage && flag.room.storage.total > 200000) {
                                            flag.memory.module[ez][_number] = 2;
                                        } else if (flag.room.storage && flag.room.storage.total > 100000) {
                                            flag.memory.module[ez][_number] = 1;
                                        } else {
                                            flag.memory.module[ez][_number] = 0;
                                        } */

                }
                break;

            case 'lab':
                // Find lab that is within two distance of storage and terminal.
                if (flag.room.terminal === undefined) break;

                if (flag.room.memory.boostLabID === undefined) {
                    zzz = flag.room.find(FIND_MY_STRUCTURES);
                    zzz = _.filter(zzz, function(structure) {
                        return (structure.structureType == STRUCTURE_LAB);
                    });
                    if (zzz.length === 1) {

                        flag.room.memory.boostLabID = zzz[0].id;
                    }
                    if (zzz.length === 10) {
                        flag.room.memory.boostLabID = zzz[9].id;
                    }
                }

                break;

            case 'job':
                if (flag.room.storage === undefined) break;
                if (flag.room.memory.masterLinkID === undefined && flag.room.controller.level > 4) {
                    zzz = flag.room.find(FIND_MY_STRUCTURES);
                    zzz = _.filter(zzz, function(structure) {
                        return (structure.structureType == STRUCTURE_LINK && structure.pos.inRangeTo(flag.room.storage, 2));
                    });

                    if (zzz.length > 0) {

                        flag.room.memory.masterLinkID = zzz[0].id;
                    }
                }

                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {

                    if (!flag.memory.sourceNumber) {
                        flag.memory.sourceNumber = flag.room.find(FIND_SOURCES).length;
                    }
                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            if (roomEnergy >= 700) {
                                flag.memory.module[ez][_level] = 2;
                                let source = flag.room.find(FIND_SOURCES);
                                flag.memory.module[ez][_number] = source.length;
                            }
                            break;
                        case 2:
                        case 1:
                            if (roomEnergy >= 750) {
                                flag.memory.module[ez][_level] = 3;
                            }
                            break;
                        case 3:
                            if (roomEnergy >= 1200) {
                                flag.memory.module[ez][_level] = 4;
                            }
                            flag.memory.module[ez][_number] = flag.memory.sourceNumber + 1;
                            break;
                        case 4:
                            if (roomEnergy >= 2250) {
                                flag.memory.module[ez][_level] = 5;
                                flag.memory.module[ez][_number] = flag.memory.sourceNumber + 1;
                            }
                            break;
                        case 5:
                            if (roomEnergy >= 2500) {
                                flag.memory.module[ez][_level] = 6;
                                flag.memory.module[ez][_number] = flag.memory.sourceNumber + 1;
                            }
                    }
                }


                break;

            case "sort":
                flag.memory.module.sort();
                break;

            case "wait":
                flag.memory.checkWhat = -40;
                break;
            case 'wallwork':

                // Harvest Checking
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {
                    if (flag.room.memory.nukeIncoming) {
                        flag.memory.module[ez][_number] = 3;
                    }
                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            if (roomEnergy >= 1250 && flag.room.controller.level < 8) { // At room controller lv 4 and extensions, with walls or ramparts
                                let vr = flag.room.find(FIND_STRUCTURES, {
                                    filter: s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
                                });
                                if (vr.length > 0) {
                                    flag.memory.module[ez][_level] = 2;
                                    flag.memory.module[ez][_number] = 1;
                                }
                            }
                            break;
                        case 2:
                            if (roomEnergy >= 1750) {
                                flag.memory.module[ez][_level] = 3;
                            }
                            break;
                        case 3:
                            if (roomEnergy >= 2250) {
                                flag.memory.module[ez][_level] = 4;
                            }
                            break;
                        case 4:
                            if (roomEnergy >= 3250) {
                                flag.memory.module[ez][_level] = 5;
                            }
                            break;

                    }
                }
                break;

            case 'minHarvest':
                // Harvest Checking

                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {
                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            if (flag.room.controller.level >= 6 && (flag.room.memory.mineralID === undefined || flag.room.memory.extractID === undefined || flag.room.memory.mineralContainID === undefined)) {


                                if (flag.room.memory.mineralID === undefined) {
                                    let vr = flag.room.find(FIND_MINERALS);
                                    flag.room.memory.mineralID = vr[0].id;
                                }
                                if (flag.room.memory.extractID === undefined) {
                                    let vr = flag.room.find(FIND_STRUCTURES, {
                                        filter: s => s.structureType == STRUCTURE_EXTRACTOR
                                    });
                                    if (vr.length > 0) {
                                        flag.room.memory.extractID = vr[0].id;
                                        flag.memory.module[ez][_number] = 1;
                                    } else {
                                        break;
                                    }
                                }

                                if (flag.room.memory.mineralContainID === undefined && flag.room.memory.extractID !== undefined) {
                                    var extract = Game.getObjectById(flag.room.memory.extractID);
                                    if (extract !== null) {
                                        let stru = extract.pos.findInRange(FIND_STRUCTURES, 5);
                                        stru = _.filter(stru, function(o) {
                                            return o.structureType == STRUCTURE_CONTAINER;
                                        });
                                        if (stru.length !== 0) {
                                            flag.room.memory.mineralContainID = stru[0].id;
                                        }
                                    }
                                }
                                if (flag.room.memory.mineralContainID !== undefined && flag.room.memory.mineralID !== undefined && flag.room.memory.extractID !== undefined) {
                                    flag.memory.module[ez][_level] = 7;
                                    //        flag.memory.module[ez][_number] = 1;
                                } else if (flag.room.memory.mineralID !== undefined && flag.room.memory.extractID !== undefined) {
                                    flag.memory.module[ez][_level] = 6;
                                }

                            }
                            break;
                    }
                }
                break;
            case 'harvester':
                // Harvest Checking

                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {


                    if (flag.memory.module[ez][_level] < 3) {

                        switch (flag.memory.module[ez][_level]) {
                            case 0:
                                if (roomEnergy >= 700) {
                                    flag.memory.module[ez][_level] = 2;
                                    let source = flag.room.find(FIND_SOURCES);
                                    flag.memory.module[ez][_number] = source.length;
                                }
                                break;
                            case 2:
                                if (roomEnergy >= 2900) {
                                    let source = flag.room.find(FIND_SOURCES);
                                    flag.memory.module[ez][_level] = 3;
                                    flag.memory.module[ez][_number] = source.length;
                                }
                                break;
                        }
                    }
                }

                break;

        }
    }



    var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT, backgroundColor: '#0F0F0F' };
    var _name = 0;
    var _number = 1;
    var _level = 2;
    var spawnCount;

    function createPath(from, to, opts) {

        var result = PathFinder.search(from, to, { roomCallback: roomName => createRoomMatrix4Breach(roomName), range: 1 });
        //    for(let i in result.path){
        //      console.log(i,result.path[i] );
        //    }
        var path = '';
        for (let i = 0; i < result.path.length; i++) {
            //        console.log(i,result.path[i],i+1,result.path[i+1]);
            if (result.path[i + 1]) {
                //       console.log(result.path[i], result.path[i].getDirectionTo(result.path[i+1]),result.path[i+1] ) ;
                path += result.path[i].getDirectionTo(result.path[i + 1]);
            }
        }
        return {
            startPos: result.path[0],
            path: path
        };
    }
    var roomBreachMatrix;

    function createRoomMatrix4Breach(roomName) { // This is all flag based, it will be stored in flag.
        if (roomBreachMatrix === undefined) {
            roomBreachMatrix = {};
        }
        if (!roomBreachMatrix[roomName]) {
            const terrain = new Room.Terrain(roomName);
            const matrix = new PathFinder.CostMatrix();

            // Fill CostMatrix with default terrain costs for future analysis:
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    const tile = terrain.get(x, y);
                    var weight = 0;
                    switch (tile) {
                        case TERRAIN_MASK_WALL:
                            weight = 0xff;
                            break;
                        case TERRAIN_MASK_SWAMP:
                            weight = 5; // swamp => weight:  5
                            break;
                        default:
                            weight = 1;
                            break;
                    }
                    matrix.set(x, y, weight);
                }
            }
            if (Game.rooms[roomName]) {
                var stuff = _.filter(Game.rooms[roomName].find(FIND_STRUCTURES), function(o) {
                    return o.structureType !== STRUCTURE_ROAD && o.structureType !== STRUCTURE_RAMPART;
                });


                for (let i in stuff) {
                    if (stuff[i].pos) {
                        matrix.set(stuff[i].pos.x, stuff[i].pos.y, 255);
                    }
                }
                stuff = _.filter(Game.rooms[roomName].find(FIND_STRUCTURES), function(o) {
                    return o.structureType === STRUCTURE_ROAD;
                });


                for (let i in stuff) {
                    if (stuff[i].pos) {
                        matrix.set(stuff[i].pos.x, stuff[i].pos.y, 0);
                    }
                }

            }
            roomBreachMatrix[roomName] = matrix;

        }
        return roomBreachMatrix[roomName];
    }


    function whiteflag(flag) {
        // Whiteflag functions as a control for that room.
        // When the secondary is set to white - nothing occurs.
        /*      flag.memory.nextTargets = undefined;
        flag.memory.rallyCreateCount = undefined;
        flag.memory.totalNumber = undefined;
        flag.memory.portal = undefined;
        flag.memory.rallyFlag = undefined;
        flag.memory.musterRoom = undefined;
        flag.memory.musterType = undefined;
        flag.memory.wayPath = undefined;
        flag.memory.target = undefined;
        flag.memory.killBase = undefined;
        flag.memory.squadLogic = undefined;
*/
        switch (flag.secondaryColor) {
            case COLOR_WHITE:
                // Nothing, maybe even clearing it. 

                if (flag.name === flag.pos.roomName) {
                    flag.room.visual.text('set to Grey for soft, then purple', flag.pos);
                }
                break;
            case COLOR_GREY:
                // Resets it's memory. 
                softSetMemory(flag);

                break;
            case COLOR_GREEN:
                // Runs off of flag memory. 
                // This color also means that it's pulled as module for build.spaw
                //              if (flag.memory.checkWhat >= 0)
                //                    adjustModule(flag);
                break;
            case COLOR_PURPLE:
                // Purple will mean that it's setup for low CPU usage.
                if (flag.memory.checkWhat === undefined) {
                    flag.memory.checkWhat = -10;
                }
                if (flag.secondaryColor === COLOR_GREEN || flag.secondaryColor === COLOR_PURPLE) {
                    flag.memory.checkWhat++;
                }
                if (flag.memory.checkWhat >= Object.keys(roomer).length) {
                    flag.memory.checkWhat = 0;
                }

                if (Game.time % 10 === 0 && flag.room && flag.pos.roomName === 'E19S49' && Game.shard.name === 'shard3') {
                    let res = flag.room.lookAt(flag.pos.x, flag.pos.y);
                    var target;
                    if (res.length > 0) {
                        for (let ee in res) {
                            if (res[ee].creep !== undefined) {
                                res[ee].creep.dance();
                                break;
                            }
                        }
                    }
                }


                if (flag.room !== undefined) { // 
                    if (flag.room.controller.level === 8 && (Game.time % 1500 === 0 || Memory.firstTick) ) { // 

                        flag.memory.module = [];
                        /*          
                                                    flag.memory.module.push(['minHarvest', 1, 8]); // non boosted
                                                    flag.memory.module.push(['assistant', 1, 2]);

                                                    // boost: ['UO','KH2O'],                            
                                                    flag.memory.module.push(['minHarvest', 1, 9]); // Tier 1 boosted Designed just to use tier 1 boost.
                                                    flag.memory.module.push(['assistant', 1, 4]);

                                                    flag.memory.module.push(['minHarvest', 1, 10]); // Tier 3 boosted designed to take down 100,000 minerals in 1400 ticks.
                                                    //boost: ['XUHO2','XKH2O','XZHO2'],
                                                    flag.memory.module.push(['assistant', 1, 6]);

                        */
                        if (!Memory.empireSettings.boost.mineral) {
                            flag.memory.module.push(['minHarvest', 1, 8]);
                            if (!flag.room.memory.mineralContainID) flag.memory.module.push(['assistant', 1, 2]);
                        } else if (Game.shard.name !== 'shard1') {
                            flag.memory.module.push(['minHarvest', 1, 9]);
                            if (!flag.room.memory.mineralContainID) flag.memory.module.push(['assistant', 1, 4]);
                        } else if (Memory.stats.totalMinerals.UO > 20000 && flag.room.memory.mineralContainID) { //&& flag.room.mineral.mineralAmount > 2000 
                            flag.memory.module.push(['minHarvest', 1, 9]);
                        } else if (Memory.stats.totalMinerals.XUHO2 > 65000 && Memory.stats.totalMinerals.XKH2O > 100000 && Memory.stats.totalMinerals.XZHO2 > 300000) { //&& flag.room.mineral.mineralAmount > 10000
                            flag.memory.module.push(['minHarvest', 1, 10]);
                            if (!flag.room.memory.mineralContainID) flag.memory.module.push(['assistant', 1, 6]);
                        } else if (Memory.stats.totalMinerals.UO > 20000 && Memory.stats.totalMinerals.KH2O > 40000) { //&& flag.room.mineral.mineralAmount > 2000 
                            flag.memory.module.push(['minHarvest', 1, 9]);
                            if (!flag.room.memory.mineralContainID) flag.memory.module.push(['assistant', 1, 4]);
                        } else {
                            flag.memory.module.push(['minHarvest', 1, 8]);
                            if (!flag.room.memory.mineralContainID) flag.memory.module.push(['assistant', 1, 2]);
                        }
                        let linkNum = 1;
                        if (flag.room.alphaSpawn === undefined) {
                            break;
                        }
                        let create = flag.room.alphaSpawn.memory.create;
                        let creat2 = flag.room.alphaSpawn.memory.warCreate;
                        let creat3 = flag.room.alphaSpawn.memory.expandCreate;
                        var totalBody = 0;
                        for (let i in create) {
                            totalBody += (create[i].build.length * 3);
                        }
                        for (let i in creat2) {
                            totalBody += (creat2[i].build.length * 3);
                        }
                        for (let i in creat3) {
                            totalBody += (creat3[i].build.length * 3);
                        }
                        totalBody += flag.room.stats.parts;
                        // Here we determine maxBody - a stat that reduces to 0 every 10000 ticks.
                        if (!flag.room.memory.maxBody || Game.time % 50000 === 0) {
                            flag.room.memory.maxBody = 0;
                        }
                        if (totalBody >= flag.room.memory.maxBody) {
                            flag.room.memory.maxBody = totalBody;
                        } else if (flag.room.memory.maxBody > totalBody) {
                            totalBody = flag.room.memory.maxBody;
                        }


                        /*
                        Empire modes

                        Power   - Wait for full energy to process power
                                - Have 50% full to process power.
                                - Process it regardless.

                        Construct - Wallworkers to build up.
                                - Wall threshold differs
                                - 10m
                                - 25m
                                - 50m
                                - 100m
                                - 200m
                                - max

                        Upgrade - build upbuilders/use boost
                                - Enable praise room.
                        */
                        let lowWall = Memory.stats.rooms[flag.pos.roomName].wallSize;
                        let doWall = true;
                        if (flag.room.memory.energyIn) {
                            doWall = true;
                        } else {
                            if (flag.room.storage.total > 900000) {
                                doWall = true;
                            } else {
                                doWall = false;
                            }
                        }
                        if (Game.shard.name !== 'shard1') doWall = true;
                        if (Memory.focusWall && Game.shard.name === 'shard1') {
                            if (flag.room.name === Memory.focusWall) {
                                doWall = false;
                                flag.memory.module.push(['wallwork', 6, 5]);
                                flag.memory.module.push(['wallAssist', 1, 5]);
                            } else if (flag.room.memory.focusWall) {
                                flag.room.memory.focusWall = undefined;
                            }
                        } else if (flag.room.memory.focusWall) {
                            flag.room.memory.focusWall = undefined;

                        }
                        if (Memory.threeLowestWalls) {
                            if (_.contains(Memory.threeLowestWalls, flag.pos.roomName)) {
                                console.log(flag, "gets 3 wallworks", Memory.threeLowestWalls);
                                flag.memory.module.push(['wallwork', 2, 5]);
                            } else {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            }
                        }
                        if (Game.shard.name === 'shard3' && flag.room.storage) {
                                if (flag.room.storage.store[RESOURCE_ENERGY] > 950000) {
                                    flag.memory.module.push(['wallwork', 3, 5]);
                                } else if (flag.room.storage.store[RESOURCE_ENERGY] > 100000) {
                                    flag.memory.module.push(['wallwork', 1, 5]);
                                } else {

                                }
                            }

            let structs = _.filter(flag.room.find(FIND_STRUCTURES),
                function(object) {
                    return object.structureType == STRUCTURE_RAMPART && !object.isPublic;
                }
            );
                                flag.room.memory.weakestWall = _.min(structs, o => o.hits).hits;

                        /*
                        if (doWall) {
                            if (Game.shard.name === 'shard3' && flag.room.storage) {
                                if (flag.room.storage.store[RESOURCE_ENERGY] > 950000) {
                                    flag.memory.module.push(['wallwork', 3, 5]);
                                } else if (flag.room.storage.store[RESOURCE_ENERGY] > 100000) {
                                    flag.memory.module.push(['wallwork', 1, 5]);
                                } else {

                                }
                            } else if (flag.pos.roomName === 'E13S18') {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            } else if (Memory.stats.rooms[flag.pos.roomName].wallSize < 20000000) {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            }
                            /* else if(flag.room.powerspawn && flag.room.powerspawn > 0 && Memory.stats.rooms[flag.pos.roomName].wallSize > 200000000&& flag.room.storage.store[RESOURCE_POWER] && flag.room.storage.store[RESOURCE_ENERGY] < 200000 ){

                                                        }else*/
                        /*
                            if (Memory.stats.rooms[flag.pos.roomName].wallSize < Memory.empireSettings.maxWallSize) {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            } else if (lowWall < 100000000 && flag.room.stats.storageEnergy > storageEnergyLimit) {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            } else if (flag.room.storage.store[RESOURCE_ENERGY] > storageEnergyLimit && flag.room.storage.total > 900000 && flag.room.memory.weakestWall < 299000000) {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            } else if (Game.shard.name === 'shard2' || Game.shard.name === 'shard0') {
                                flag.memory.module.push(['wallwork', 1, 5]);
                            }
                            /*else if (flag.pos.roomName === 'E13S18') {
                                                           flag.memory.module.push(['wallwork', 1, 5]);
                                                       }*/
                        /*
                                                    else {
                                                        let sites = flag.room.find(FIND_CONSTRUCTION_SITES);
                                                        if (sites.length > 0) {
                                                            flag.memory.module.push(['wallwork', 1, 5]);
                                                        }
                                                    }

                                                }*/

                        let rando = Math.floor(Math.random() * 1500);
                        //                        if (flag.room.memory.energyIn) rando += rando + 1000;
    //                    if(flag.room.powerLevels){
  //                      console.log(flag, flag.room.controller.isEffected() , flag.room.powerLevels[PWR_OPERATE_CONTROLLER],"control" );
//                        }
                        if (flag.room.controller.isEffected() && flag.room.powerLevels[PWR_OPERATE_CONTROLLER] && Memory.empireSettings.powers.controller ) {
                            if (flag.room.powerLevels[PWR_OPERATE_CONTROLLER].level > 3) {
                                flag.memory.module.push(['upgrader', 2, 7]);
                            } else {
                                flag.memory.module.push(['upgrader', 1, 7]);
                            }
                        } else if (flag.room.controller.ticksToDowngrade < Memory.empireSettings.maxController + rando) {
                            flag.memory.module.push(['upgrader', 1, 7]);
                        }

                        if (flag.room.alphaSpawn.memory.roadsTo !== undefined) {
                            if (flag.room.alphaSpawn.memory.roadsTo[0] !== undefined && flag.room.alphaSpawn.memory.roadsTo[0].source === 'xxxx') {
                                flag.room.alphaSpawn.memory.roadsTo.splice(0, 1);
                            }
                            if (flag.room.alphaSpawn.memory.roadsTo.length > 0) {
                                flag.room.memory.spawnDefenderNeeded = true;
                                flag.memory.module.push(['homeDefender', 1, 5]);
                            }
                        }
                        if (flag.memory.sourceNumber === undefined) {
                            flag.memory.sourceNumber = flag.room.find(FIND_SOURCES).length;
                        }
                        flag.memory.module.push(['harvester', flag.memory.sourceNumber, 3]);




                        if (flag.room.alphaSpawn.memory.warCreate === undefined) flag.room.alphaSpawn.memory.warCreate = [];
                        if (totalBody > 1500) {
                            linkNum++;
                        }
                        if (totalBody > 3000) {
                            linkNum++;
                        }
                        if (flag.room.memory.nukeIncoming) {
                            linkNum++;
                        }
                        if (linkNum < 2 && Game.shard.name === 'shard3') {
                            linkNum = 2;
                        }
                        // Set max LinkNum before

                        // This is set to zero as long as there's a powerCreep in there.
                        // Power Creep adjustments to creeps here.
                        let roomPowerLvl = flag.room.powerLevels;
                        if (roomPowerLvl) {
                            if (roomPowerLvl[PWR_OPERATE_EXTENSION]) {
                                if (roomPowerLvl[PWR_OPERATE_EXTENSION].level <= 2) {

                                } else if (roomPowerLvl[PWR_OPERATE_EXTENSION].level > 2) {
                                    linkNum = 1;
                                }
                                //   linkNum--;
                                // Disabled until further analysis
                            }
                            if (roomPowerLvl[PWR_REGEN_SOURCE]) {
                                if (roomPowerLvl[PWR_REGEN_SOURCE].level <= 2) {
                                    require('commands.toSpawn').setModuleRole(flag.pos.roomName, 'harvester', flag.memory.sourceNumber, 4);
                                } else if (roomPowerLvl[PWR_REGEN_SOURCE].level > 2) {
                                    require('commands.toSpawn').setModuleRole(flag.pos.roomName, 'harvester', flag.memory.sourceNumber, 5);
                                }
                            }
                        }
                        if (flag.room.memory.noAlphaJob) { // For just a replace ment
                            linkNum--;
                        }
                        if (linkNum < 1) {
                            linkNum = 1;
                        }

                        if (flag.room.memory.noHauler) {
                            // This is for rooms that need no Jobs or links or anything because a hero is taking care of it.
                            linkNum = 0;
                        }

                        if (flag.pos.roomName === 'E21S49' && linkNum < 1) { // Extra LinkNum for intershard mules.
                            linkNum = 1;
                        }

                        //require('commands.toSpawn').setModuleRole(powercrp.room.name, 'harvester', powercrp.memory.sourcesID.length, 4);
//                        console.log(flag.pos.roomName, linkNum, "LINKED");
                        flag.memory.module.push(['job', linkNum, 5]);
                        flag.room.memory.maxLinkers = linkNum;

                    } else if (flag.room.controller.level !== 8) {
                        adjustModule(flag);
                    }

                }
                break;
        }
    }


    function adjustThreatLevel(room, autoSiegeSettings) {
        if (!room) return;
        var threatLevel = autoSiegeSettings.threatLevel;

        var bads = room.notAllies;
        // We need to find bad creeps
        // iF they are have attack/ranged then incrase threatLevel by 2;
        // if they have work then increase threat level
        var damageCreeps = [];
        var buildingCreeps = [];
        for (let i in bads) {
            if (bads[i].getActiveBodyparts(ATTACK) > 0 || bads[i].getActiveBodyparts(RANGED_ATTACK) > 0) {
                damageCreeps.push(bads[i]);
            } else if (bads[i].getActiveBodyparts(WORK) > 0) {
                buildingCreeps.push(bads[i]);
            }
        }
        if (damageCreeps.length > 0) {
            // We should be looking at boosted here, if so then increase threat level even more!
            threatLevel += 10;
        } else {
            threatLevel -= 2;
        }
        if (buildingCreeps.length > 0) {
            threatLevel += 5;
        } else {
            threatLevel -= 2;
        }

        // if there are constructionSites increase threat level
        var conSites = room.find(FIND_CONSTRUCTION_SITES);
        conSites = _.filter(conSites, function(o) {
            return o.progress > 0;
        });
        if (conSites.length > 0) {
            threatLevel += 5;
        } else {
            threatLevel -= 2;
        }

        // if there are towers/spawn up increase threat level
        var doneStructs = room.find(FIND_STRUCTURES);
        doneStructs = _.filter(doneStructs, function(o) {
            return o.structureType === STRUCTURE_TOWER && o.structureType === STRUCTURE_SPAWN;
        });
        if (doneStructs.length > 0) {
            threatLevel += 25;
        } else {
            threatLevel -= 2;
        }
        //   autoSiegeSettings.threatLevel


        // Threat level is at max 100 and min -100
        // min - 100 means that you can maximize thieves
        if (threatLevel > 100) threatLevel = 100;
        if (threatLevel < -100) threatLevel = -100;
        console.log('Threat Level analyzed in ', room, "Set to:", threatLevel);
        return threatLevel;
    }

    class buildFlags {



        static run(spawnCount) {
            let powerTotal = 0;
            let defendTotal = 0;
            Memory.clearFlag--;
            if (Memory.clearFlag < 0) {
                Memory.clearFlag = 12;
                var keys = Object.keys(Memory.flags);
                var e = keys.length;
                var a;
                while (e--) {
                    a = keys[e];
                    if (Game.flags[a] === undefined) delete Memory.flags[a];
                }
                keys = Object.keys(Memory.rooms);
                e = keys.length;
                while (e--) {
                    a = keys[e];
                    if (Game.rooms[a] === undefined) delete Memory.rooms[a];
                }

            }

            let zFlags = Game.flags;

            if (Game.flags.focusWall) {
                // This flag is designed when it exists that it stops all other wallwork and makes the room be the focus of all wallworks.
                //              let room = Game.flags.focusWall.room;
                if (Game.flags.focusWall.memory.maxWall === undefined) Game.flags.focusWall.memory.maxWall = 299000000;
                Game.flags.focusWall.room.visual.text(Game.flags.focusWall.room.memory.weakestWall + "/" + Game.flags.focusWall.memory.maxWall, Game.flags.focusWall.pos.x, Game.flags.focusWall.pos.y, { color: '#00FF0F ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });

                Game.flags.focusWall.room.memory.focusWall = true;
                if (Game.flags.focusWall.room.memory.weakestWall > Game.flags.focusWall.memory.maxWall) { //
                    Game.flags.focusWall.memory.remove = true;
                    Game.flags.focusWall.room.memory.focusWall = undefined;
                }
                if (!Memory.focusWall) {
                    Memory.focusWall = Game.flags.focusWall.pos.roomName;
                }
            } else if (Memory.focusWall) {
                Memory.focusWall = undefined;
                if (Game.flags.focusWall.room)
                    Game.flags.focusWall.room.memory.focusWall = undefined;
            }

            if (Game.flags.templar !== undefined && Game.time % 500 === 0) {
                let templar = Game.flags.templar;
                templar.memory.musterRoom = 'E14S37';
                templar.memory.musterType = 'templar';
                if (templar.room.controller.level === 5 && ((templar.room.controller.progressTotal - templar.room.controller.progress) < templar.room.storage.store[RESOURCE_ENERGY])) {
                    templar.memory.party[0][1] = 5;
                } else if (templar.room.storage.store[RESOURCE_ENERGY] > 600000) {
                    templar.memory.party[0][1] = 5;
                } else if (templar.room.storage.store[RESOURCE_ENERGY] > 550000) {
                    templar.memory.party[0][1] = 5;
                } else if (templar.room.storage.store[RESOURCE_ENERGY] > 400000) {
                    templar.memory.party[0][1] = 3;
                } else if (templar.room.storage.store[RESOURCE_ENERGY] > 250000) {
                    templar.memory.party[0][1] = 2;
                } else if (templar.room.storage.store[RESOURCE_ENERGY] > 100000) {
                    templar.memory.party[0][1] = 1;
                } else {
                    templar.memory.party[0][1] = 0;
                }
            }






            if (Game.flags.nukeRoom !== undefined) {

                var removeFlag = false;
                //var count = 0;
                //                Game.flags.nukeRoom.memory.
                if (Game.flags.nukeRoom.memory.launchTick === undefined) Game.flags.nukeRoom.memory.launchTick = 0;
                if (Game.flags.nukeRoom.memory.currentDelay === undefined) Game.flags.nukeRoom.memory.currentDelay = 0;
                if (Game.flags.nukeRoom.memory.delayBetweenLaunch === undefined) Game.flags.nukeRoom.memory.delayBetweenLaunch = 0;
                if (Game.flags.nukeRoom.memory.nukeNumber === undefined) Game.flags.nukeRoom.memory.nukeNumber = 1;

                let goodNukes = [];
                for (let ae in Game.spawns) {

                    let room = Game.spawns[ae].room;
                    if (Game.spawns[ae].memory.alphaSpawn && room && room.controller && room.controller.level === 8 && room.nuke && Game.map.getRoomLinearDistance(Game.flags.nukeRoom.pos.roomName, room.name) <= 10) {
                        let nuked = room.nuke;
                        if (nuked.energy === nuked.energyCapacity && nuked.ghodium === nuked.ghodiumCapacity && nuked.cooldown === 0) {
                            console.log(room, "Has nuke and in 10 distance ", nuked.energy, nuked.ghodium, nuked.cooldown);
                            goodNukes.push(nuked);
                        }
                    }

                }

                if (Game.flags.nukeRoom.color === COLOR_GREEN) {
                    if (goodNukes.length === 0) {
                        Game.flags.nukeRoom.remove();
                    } else if (Game.flags.nukeRoom.memory.launchTick === 0 || Game.flags.nukeRoom.memory.launchTick <= Game.time) {
                        if (Game.flags.nukeRoom.memory.currentDelay > 0) {
                            Game.flags.nukeRoom.memory.currentDelay--;
                            console.log('waiting for next Launch Window', Game.flags.nukeRoom.memory.currentDelay);
                        } else if (Game.flags.nukeRoom.memory.nukeNumber <= 0) {
                            console.log('enough nukes!');
                            Game.flags.nukeRoom.remove();
                        } else {
                            console.log('Launching nuke!!!!', goodNukes[0].launchNuke(Game.flags.nukeRoom.pos));
                            Game.flags.nukeRoom.memory.currentDelay = Game.flags.nukeRoom.memory.delayBetweenLaunch;
                            Game.flags.nukeRoom.memory.nukeNumber--;
                        }
                    } else {
                        console.log('launch is a GO set for:', Game.flags.nukeRoom.memory.launchTick, '/', Game.time, 'every:', Game.flags.nukeRoom.memory.delayBetweenLaunch, Game.flags.nukeRoom.memory.nukeNumber, goodNukes.length);

                    }

                } else {

                }


                if (Game.flags.nukeRoom.color !== COLOR_GREEN) {
                    console.log('CHANGE COLOR TO GREEN IN ORDER TO STRIKE WITH ABOVE NUKES @', goodNukes.length, Game.time);
                    console.log(Game.flags.nukeRoom.memory.nukeNumber, '# launch set for:', Game.flags.nukeRoom.memory.launchTick, 'every:', Game.flags.nukeRoom.memory.delayBetweenLaunch);
                }
                if (removeFlag) {

                }
            }






            var flag;


            if (Game.flags.remote !== undefined) {
                flag = Game.flags.remote;
                /*
                               if(flag.color !== COLOR_YELLOW ) {
                                    flag.memory.setColor = {
                                        color:COLOR_YELLOW,
                                        secondaryColor:COLOR_YELLOW,
                                    };
                                   flag.memory.musterType = 'scout';
                                   flag.memory.musterRoom = 'close';
                               }

                                 */
                if (flag.memory.maxDelay === undefined) {
                    flag.memory.maxDelay = 1000;
                }

                if (flag.memory.spawnRoom === undefined) {
                    flag.memory.spawnRoom = 'none';
                }
                if (flag.room === undefined) {
                    observer.reqestRoom(flag.pos.roomName, 5);
                } else {

                    if (flag.memory.spawnRoom === 'none') {
                        flag.room.visual.text('SETROOM', flag.pos);
                    } else if (flag.secondaryColor === COLOR_GREY) {
                        let room = Game.rooms[flag.memory.spawnRoom];
                        let spwn = room.alphaSpawn;

                        if (flag.memory.sourceID === undefined) {
                            let source = flag.room.find(FIND_SOURCES);
                            flag.memory.sourceID = getIdArray(source);
                            if (source.length > 2) {
                                let mineral = flag.room.find(FIND_MINERALS);
                                flag.memory.sourceID.unshift(mineral[0].id);
                            }
                        }
                        if (Game.time % 50 === 0) {
                            console.log('Remote Flag up,', flag.room, flag.memory.delay, "/", flag.memory.maxDelay, flag.memory.sourceID);
                        }

                        let allRemotes = getObjArray(flag.memory.sourceID);
                        for (let i in allRemotes) {
                            if (allRemotes[i].mineralType) {
                                flag.room.visual.text("M", allRemotes[i].pos, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                            } else {
                                flag.room.visual.text(i, allRemotes[i].pos, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                            }

                        }
                        flag.room.visual.text(flag.memory.delay, flag.pos, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });

                        if (flag.memory.delay <= 0 && flag.memory.sourceID.length) {
                            var targetSource = Game.getObjectById(flag.memory.sourceID[0]);
                            if (targetSource && spwn) {
                                let remote = spwn.memory.roadsTo;

                                let has = false;
                                for (let zzz in remote) {
                                    if (remote[zzz].source === targetSource.id) {
                                        has = true;
                                        break;
                                    }
                                }

                                if (!has) {

                                    //var result = createPath(room.storage.pos, source[eee].pos, { ignoreCreeps: true,});
                                    let result = PathFinder.search(room.storage.pos, targetSource.pos, { roomCallback: roomName => createRoomMatrix4Breach(roomName), range: 1 });
                                    let path = result.path;

                                    // Here we add info to spwn.
                                    let BUILD = {
                                        source: targetSource.id,
                                        sourcePos: new RoomPosition(targetSource.pos.x, targetSource.pos.y, targetSource.pos.roomName),
                                        distance: result.path.length,
                                        expLevel: 2
                                    };
                                    if (targetSource.mineralType) {
                                        BUILD.expLevel = 11;
                                    }
                                    if (targetSource.energyCapacity === 4000) {
                                        BUILD.expLevel = 5;
                                    }

                                    if (targetSource.room.controller !== undefined) {
                                        BUILD.controller = false;
                                    }
                                    console.log('added remote', BUILD.sourcePos, BUILD.expLevel);
                                    remote.push(BUILD);
                                    flag.memory.sourceID.shift();
                                    flag.memory.delay = flag.memory.maxDelay;
                                } else {
                                    console.log('Existing remote removing from query', BUILD.sourcePos, BUILD.expLevel);
                                    //remote.push(BUILD);
                                    flag.memory.sourceID.shift();
                                    flag.memory.delay = 100;
                                }


                            }

                        }
                        flag.memory.delay--;
                        if (flag.memory.sourceID.length === 0) {
                            //                            flag.memory.spawnRoom = 'none';
                            flag.remove();
                        }

                    } else {
                        let source = flag.room.find(FIND_SOURCES);
                        let room = Game.rooms[flag.memory.spawnRoom];
                        let spwn = room.alphaSpawn;

                        if (spwn && source.length > 0) {
                            let remote = spwn.memory.roadsTo;
                            let has = false;
                            for (let eee in source) {
                                has = false;
                                for (let zzz in remote) {
                                    if (remote[zzz].source === source[eee].id) {
                                        has = true;
                                        break;
                                    }

                                }
                                if (!has) {

                                    //var result = createPath(room.storage.pos, source[eee].pos, { ignoreCreeps: true,});
                                    let result = PathFinder.search(source[eee].pos, room.storage.pos, { roomCallback: roomName => createRoomMatrix4Breach(flag.pos.roomName), range: 1 });
                                    let path = result.path;
                                    //console.log(path);
                                    /*
                                    for(let i in path){
                                        let _room = Game.rooms[path[i].roomName];
                                        console.log(_room,path[i].roomName);
                                        if(_room){
                                            let posed = path[i];
                                            let rst = _room.createConstructionSite(posed.x,posed.y, STRUCTURE_ROAD);
                                            console.log(rst,posed.x,posed.y, STRUCTURE_ROAD);
                                        }
                                    }*/

                                    // Here we add info to spwn.
                                    let BUILD = {
                                        source: source[eee].id,
                                        sourcePos: new RoomPosition(source[eee].pos.x, source[eee].pos.y, source[eee].pos.roomName),
                                        distance: result.path.length,
                                        expLevel: 2
                                    };
                                    if (parseInt(eee) === 0 && source[eee].room.controller !== undefined) {
                                        BUILD.controller = false;
                                    }
                                    remote.push(BUILD);
                                }
                            }

                            //                            flag.memory.spawnRoom = 'none';
                            flag.remove();
                        }

                    }
                }

            }

            if (Game.flags.mineral !== undefined) {
                flag = Game.flags.mineral;

                if (flag.memory.spawnRoom === undefined) {
                    flag.memory.spawnRoom = 'none';
                }
                if (flag.room === undefined) {
                    //    var observer = require('build.observer');

                    observer.reqestRoom(flag.pos.roomName, 5);
                } else {
                    if (flag.memory.spawnRoom === 'none') {
                        flag.room.visual.text('SETROOM', flag.pos);
                    } else {
                        let source = flag.room.find(FIND_MINERALS);
                        let room = Game.rooms[flag.memory.spawnRoom];
                        if (room === undefined) return;
                        let spwn = room.find(FIND_STRUCTURES);
                        spwn = _.filter(spwn, function(o) {
                            return o.structureType == STRUCTURE_SPAWN && o.memory.alphaSpawn;
                        });
                        if (spwn.length === 1 && source.length > 0 && room !== undefined) {
                            let remote = spwn[0].memory.roadsTo;
                            let has;
                            for (let eee in source) {
                                for (let zzz in remote) {
                                    has = false;
                                    if (remote[zzz].source === source[eee].id) {
                                        has = true;
                                        break;
                                    }

                                }
                                if (!has) {

                                    // Here we add info to spwn.
                                    let BUILD = {
                                        source: source[eee].id,
                                        sourcePos: new RoomPosition(source[eee].pos.x, source[eee].pos.y, source[eee].pos.roomName),
                                        expLevel: 11
                                    };
                                    if (parseInt(eee) === 0 && source[eee].room.controller !== undefined) {
                                        BUILD.controller = false;
                                    }
                                    remote.push(BUILD);
                                }
                            }

                            flag.memory.spawnRoom = 'none';
                            flag.remove();
                        }
                    }

                }
            }
            if (Game.flags.clearRoom !== undefined && Game.flags.clearRoom.room) {
                var room = Game.flags.clearRoom.room;
                var stru = room.find(FIND_STRUCTURES);
                var test2;
                if (Game.flags.clearRoom.color === COLOR_RED) {
                    test2 = _.filter(stru, function(o) {
                        return o.structureType !== STRUCTURE_NUKER && o.structureType !== STRUCTURE_STORAGE && o.structureType !== STRUCTURE_TERMINAL && o.structureType !== STRUCTURE_CONTROLLER;
                    });
                }
                if (Game.flags.clearRoom.color === COLOR_GREEN) {
                    test2 = _.filter(stru, function(o) {
                        return o.structureType !== STRUCTURE_NUKER && o.structureType !== STRUCTURE_STORAGE && o.structureType !== STRUCTURE_TERMINAL && o.structureType !== STRUCTURE_CONTROLLER && o.structureType !== STRUCTURE_ROAD && o.structureType !== STRUCTURE_CONTAINER;
                    });
                }

                for (let a in test2) {
                    test2[a].destroy();

                }
                if (test2.length === 0) Game.flags.clearRoom.remove();
            }


            if (Game.flags.controlGuard !== undefined && !Game.flags.controlGuard.memory.remove) {
                // first we take control of all the creeps near flag.
                let conFlag = Game.flags.controlGuard;
                let ze = _.filter(conFlag.room.find(FIND_MY_CREEPS), function(o) {
                    return o.memory.role === 'guard';
                });
                if (Game.time % 10 === 0)
                    console.log(roomLink(conFlag.pos.roomName), "Contrlling a guard", ze.length);
                if (ze.length > 0) {
                    ze[0].memory.dontMove = true;
                    ze[0].memory.follower = true;
                    var bads = ze[0].pos.findInRange(ze[0].room.notAllies, 3);
                    if (bads.length > 0) {
                        ze[0].moveMe(bads[0]);
                        ze[0].attack(bads[0]);
                        return;
                    }


                    ze[0].smartHeal();


                    if (!ze[0].pos.isEqualTo(conFlag)) {
                        ze[0].moveMe(conFlag);
                    } else {
                        let str = _.filter(conFlag.pos.findInRange(FIND_STRUCTURES, 3), function(o) {
                            return o.structureType === STRUCTURE_CONTAINER;
                        });

                        if (str.length > 0) {
                            // Found the container that wanted to be built.
                            ze[0].memory.dontMove = undefined;
                            conFlag.memory.remove = true;
                            ze[0].memory.follower = undefined;
                        }
                    }

                }


            }


            if (Game.flags.controlCreep !== undefined) {
                // This flag is designed to take control of all creeps 5 from the flag.
                // Red color returns control.
                // Yellow finds extra
                // Blue removes flag after all structures are removed
                // Default : Keeps control until...


                let conFlag = Game.flags.controlCreep;
                console.log(roomLink(Game.flags.controlCreep.pos.roomName), "control Creep flag up, remove or else!");
                let res;
                let target;

                if (conFlag.room !== undefined) {
                    let creeps;
                    switch (conFlag.color) {
                        case COLOR_YELLOW: // Finds extra creeps.
                            conFlag.memory.controlCreep = [];
                            let ze = conFlag.pos.findInRange(FIND_MY_CREEPS, 5);
                            for (let e in ze) {
                                conFlag.memory.controlCreep.push(ze[e].id);
                            }

                            break;
                        case COLOR_RED: // removes follower so creeps will do roles again.
                            creeps = conFlag.memory.controlCreep; //
                            for (let e in creeps) {
                                let creep = Game.getObjectById(creeps[e]);
                                if (creep) creep.memory.follower = undefined;
                            }
                            conFlag.memory.controlCreep = undefined;
                            conFlag.memory.remove = true;
                            break;
                        case COLOR_BLUE: //Blue flag removes after it destorys everything at ground.

                            res = conFlag.room.lookAt(conFlag.pos.x, conFlag.pos.y);

                            if (res.length > 0) {
                                for (let ee in res) {
                                    if (res[ee].structure !== undefined) {
                                        target = res[ee].structure;
                                        break;
                                    }
                                }
                            }
                            if (conFlag.memory.controlCreep === undefined || Game.time % 100 === 0) { // Here we find creeps near 5 distance from flag to control.
                                conFlag.memory.controlCreep = [];
                                let ze = conFlag.pos.findInRange(FIND_MY_CREEPS, 5);
                                for (let e in ze) {
                                    conFlag.memory.controlCreep.push(ze[e].id);
                                }
                            }
                            creeps = conFlag.memory.controlCreep; //
                            for (let e in creeps) {
                                let creep = Game.getObjectById(creeps[e]);
                                if (!creep) {
                                    creeps[e] = undefined;
                                    continue;
                                }
                                conFlag.room.visual.line(conFlag.pos, creep.pos, { color: 'blue' });
                                creep.memory.follower = true;
                                if (target) {
                                    if (creep.getActiveBodyparts(WORK) > 0) {
                                        if (creep.pos.isNearTo(target)) {
                                            creep.dismantle(target);
                                            creep.say(target);
                                        } else {
                                            creep.moveMe(target, { reusePath: 10 });
                                        }
                                        creep.say('w');
                                    } else if (creep.getActiveBodyparts(ATTACK) > 0) {
                                        if (creep.pos.isNearTo(target)) {
                                            creep.attack(target);
                                        } else {
                                            creep.moveMe(target, { reusePath: 10 });
                                        }
                                        creep.say('A');
                                    }
                                } else {
                                    //  if (!creep.pos.isNearTo(conFlag))
                                    //    creep.moveMe(conFlag, { reusePath: 10 });
                                    conFlag.setColor(COLOR_RED, COLOR_RED);
                                    conFlag.memory.setColor = {
                                        color: COLOR_RED,
                                        secondaryColor: COLOR_RED,
                                    };
                                }

                            }
                            break;

                        default:
                            res = conFlag.room.lookAt(conFlag.pos.x, conFlag.pos.y);

                            if (res.length > 0) {
                                for (let ee in res) {
                                    if (res[ee].structure !== undefined) {
                                        target = res[ee].structure;
                                        break;
                                    }
                                }
                            }
                            if (conFlag.memory.controlCreep === undefined) {
                                conFlag.memory.controlCreep = [];
                                let ze = conFlag.pos.findInRange(FIND_MY_CREEPS, 5);
                                for (let e in ze) {
                                    conFlag.memory.controlCreep.push(ze[e].id);
                                }
                            }
                            creeps = conFlag.memory.controlCreep; //
                            for (let e in creeps) {
                                let creep = Game.getObjectById(creeps[e]);
                                if (!creep) {
                                    creeps[e] = null;
                                    continue;
                                }
                                conFlag.room.visual.line(conFlag.pos, creep.pos, { color: 'blue' });
                                creep.memory.follower = true;
                                if (target) {
                                    if (creep.getActiveBodyparts(WORK) > 0) {
                                        if (creep.pos.isNearTo(target)) {
                                            creep.dismantle(target);
                                            creep.say(target);
                                        } else {
                                            creep.moveMe(target, { reusePath: 10 });
                                        }
                                        creep.say('w');
                                    } else if (creep.getActiveBodyparts(ATTACK) > 0) {
                                        if (creep.pos.isNearTo(target)) {
                                            creep.attack(target);
                                        } else {
                                            creep.moveMe(target, { reusePath: 10 });
                                        }
                                        creep.say('A');
                                    }
                                } else {
                                    if (!creep.pos.isNearTo(conFlag))
                                        creep.moveMe(conFlag, { reusePath: 10 });
                                }

                            }
                            break;
                    }
                }
            }



            if (Game.flags.findLab !== undefined) {
                let flag = Game.flags.findLab;
                if (Game.flags.findLab2 === undefined) {
                    flag.room.visual.text('place findLab2', flag.pos.x, flag.pos.y);
                } else {
                    let labFlag = Game.flags.findLab;
                    let labFlag2 = Game.flags.findLab2;
                    let res = flag.room.lookAt(labFlag.pos.x, labFlag.pos.y);
                    let lab1;
                    let lab2;
                    if (res.length > 0) {
                        for (let ee in res) {
                            if (res[ee].structure !== undefined && (res[ee].structure.structureType === STRUCTURE_LAB)) {
                                lab1 = res[ee].structure;
                                flag.room.visual.text('1', lab1.pos.x, lab1.pos.y);
                                break;
                            }
                        }
                    }
                    res = flag.room.lookAt(labFlag2.pos.x, labFlag2.pos.y);
                    if (res.length > 0) {
                        for (let ee in res) {
                            if (res[ee].structure !== undefined && (res[ee].structure.structureType === STRUCTURE_LAB)) {
                                lab2 = res[ee].structure;
                                flag.room.visual.text('2', lab2.pos.x, lab2.pos.y);
                                break;
                            }
                        }
                    }
                    if (lab1 !== undefined && lab2 !== undefined) {
                        flag.room.visual.text('2F', flag.pos.x, flag.pos.y);
                        if (labFlag.color !== COLOR_GREY) {
                            flag.room.visual.text('2 Labs found, switch to GREY color', flag.pos.x, flag.pos.y + 1);
                        } else if (labFlag.color === COLOR_GREY) {
                            let zzz = flag.room.find(FIND_MY_STRUCTURES);
                            zzz = _.filter(zzz, function(structure) {
                                return (
                                    structure.structureType == STRUCTURE_LAB && structure.id !== lab1.id && structure.id !== lab2.id && structure.id !== flag.room.memory.boostLabID
                                );
                            });

                            // Now we setup the room memory.
                            let newLabs = [{
                                    id: lab1.id
                                },
                                {
                                    id: lab2.id
                                }
                            ];

                            for (let ee in zzz) {
                                flag.room.visual.text(ee + 'x', zzz[ee].pos.x, zzz[ee].pos.y);
                                if (ee === '3') {
                                    newLabs.push({
                                        id: flag.room.memory.boostLabID
                                    });
                                }
                                newLabs.push({
                                    id: zzz[ee].id
                                });
                            }
                            flag.room.memory.labs = newLabs;
                            flag.room.memory.labMode = 'shift';
                            flag.room.visual.text('Labs set Remove', flag.pos.x, flag.pos.y - 2);
                            if (zzz.length === 7) {
                                Game.flags.findLab.memory.remove = true;
                                Game.flags.findLab2.memory.remove = true;
                            }
                        }

                    } else {
                        //                        flag.room.visual.text('2F', flag.pos.x, flag.pos.y);
                    }

                }
            }

            for (let i in zFlags) {
                flag = zFlags[i];

                // SETTING UP MEMORY

                if (flag.color === COLOR_YELLOW) {
                    if (flag.memory.squadMode) {
                        flag.memory.squadID = undefined;
                        flag.memory.pointID = undefined;
                        flag.memory.groupPoint = undefined;
                        flag.memory.squadMode = undefined;
                        flag.memory.targetPos = undefined;
                        flag.memory.aiSettings = undefined;
                        flag.memory.targetID = undefined;
                        flag.memory.enemyTarget = undefined;
                        flag.memory.enemyTargetStanding = undefined;
                        flag.memory.enemyTargetStandingDistance = undefined;
                    }

                    if (flag.memory.CachedPathOn === undefined) {
                        flag.memory.CachedPathOn = false;
                    }
                    if (flag.memory.attackDirection === undefined) {
                        flag.memory.attackDirection = false;
                    }

                    if (flag.memory.prohibitDirection === undefined) {
                        flag.memory.prohibitDirection = {
                            top: true,
                            right: true,
                            left: true,
                            bottom: true,
                        };
                    }
                    if (flag.memory.squadLogic === undefined) {
                        flag.memory.squadLogic = false;
                    }
                    if (flag.memory.autoSiege === undefined) {
                        flag.memory.autoSiege = false;
                    }
                    if (flag.memory.spawningSettings === undefined) {
                        flag.memory.spawningSettings = {
                            spawnCounter: 0, // Number of spawns 
                            spawnRoom: null, // MusterRoom
                            gameTimeSiege: null, // tick to start siege on.
                            maxSpawnDelay: 1500, // delay between waves
                        };
                    }
                }
                let spnSet = flag.memory.spawningSettings;
                if (spnSet && spnSet.gameTimeSiege) {
                    if (spnSet.gameTimeSiege < 999999) {
                        spnSet.gameTimeSiege = Game.time + spnSet.gameTimeSiege;
                    }
                    if (Game.time > spnSet.gameTimeSiege) {
                        if (spnSet.spawnCounter > 0) {
                            if (!flag.memory.setColor && flag.color !== COLOR_YELLOW && flag.color !== COLOR_ORANGE) {
                                spnSet.spawnCounter--;
                                spnSet.gameTimeSiege = spnSet.maxSpawnDelay;
                                flag.memory.setColor = {
                                    color: COLOR_YELLOW,
                                    secondaryColor: COLOR_YELLOW,
                                };
                            }
                        }

                    }
                }
                /*                // Flag Delay Spawning Function.
                                if (flag.memory.spawnCounter && flag.memory.spawnCounter > 0) {
                                    if (flag.memory.delaySpawnCounter > 0) {
                                        if (flag.memory.delaySpawnCounter < 100000) {
                                            flag.memory.delaySpawnCounter--;
                                        } else if (flag.memory.delaySpawnCounter < Game.time) {
                                            if (!flag.memory.setColor && flag.color !== COLOR_YELLOW && flag.color !== COLOR_ORANGE) {
                                                flag.memory.spawnCounter--;
                                                flag.memory.setColor = {
                                                    color: COLOR_YELLOW,
                                                    secondaryColor: COLOR_YELLOW,
                                                };
                                            }
                                        }
                                    } else {
                                        if (!flag.memory.setColor && flag.color !== COLOR_YELLOW && flag.color !== COLOR_ORANGE) {
                                            if (flag.memory.delaySpawn > 0) {
                                                flag.memory.delaySpawnCounter = flag.memory.delaySpawn;
                                            }
                                            flag.memory.spawnCounter--;
                                            flag.memory.setColor = {
                                                color: COLOR_YELLOW,
                                                secondaryColor: COLOR_YELLOW,
                                            };
                                        }
                                    }
                                }*/


                if (flag.memory.autoSiege && flag.room) {
                    //Autosiege changes from Siege -> Raiding/Supressing -> Suppressing/Demolishing/Decontrolling 
                    if (flag.memory.autoSiegeSettings === undefined) {
                        flag.memory.autoSiegeSettings = {};
                    }
                    var autoSiegeSettings = flag.memory.autoSiegeSettings;
                    if (autoSiegeSettings.mode === undefined) {
                        autoSiegeSettings.mode = 'siege';
                        autoSiegeSettings.raiding = true; // This means that we don't target storage/terminal and we also raid the storage/terminal
                        autoSiegeSettings.threatLevel = 0; // The lower the number the less threat the higher the more 
                    }
                    let xx = 1;
                    let yy = 1;
                    let font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT };
                    flag.room.visual.text("AutoSieged Enabled", xx, yy, font);
                    flag.room.visual.text("Mode:" + autoSiegeSettings.mode, xx, yy + 1, font);
                    flag.room.visual.text("raiding Storage/Terminal:" + autoSiegeSettings.raiding, xx, yy + 2, font);
                    flag.room.visual.text("Threat Level:" + autoSiegeSettings.threatLevel, xx, yy + 3, font);

                    switch (autoSiegeSettings.mode) {
                        case 'siege':
                        case 'sieging':
                            let allStructs = flag.room.find(FIND_STRUCTURES);
                            allStructs = _.filter(allStructs, function(o) {
                                return o.structureType === STRUCTURE_TOWER || o.structureType === STRUCTURE_SPAWN;
                            });
                            console.log("AutoSeiege adjustment looking for bad structus to turn off siegeMode", allStructs.length, "FOund bads structs");
                            if (allStructs.length === 0) {
                                autoSiegeSettings.mode = 'raiding';
                            }

                            break;

                        case 'raiding':
                            //Adjusting Threat level
                            if (Game.time % 250 === 0 && Game.flags.raidingFlag) {
                                autoSiegeSettings.threatLevel = adjustThreatLevel(flag.room, autoSiegeSettings);
                                console.log(autoSiegeSettings, "Threat level");
                                let party = require('commands.toParty');
                                if (autoSiegeSettings.threatLevel === -100) {
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 8); // 10/40 body
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 8); // 10/40 body
                                    if (flag.memory.musterType !== 'demoSuppressor') {
                                        flag.memory.party = [];
                                        flag.memory.musterType = "demoSuppressor";
                                    }
                                    party.changeRoleLevel(flag, 'demolisher', 7);
                                    party.changeRoleLevel(flag, 'ranger', 7);
                                } else if (autoSiegeSettings.threatLevel >= -50 && autoSiegeSettings.threatLevel < -10) {
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 6);
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 6);
                                    if (flag.memory.musterType !== 'demoSuppressor') {
                                        flag.memory.party = [];
                                        flag.memory.musterType = "demoSuppressor";
                                    }
                                    party.changeRoleLevel(flag, 'demolisher', 6);
                                    party.changeRoleLevel(flag, 'ranger', 6);
                                } else if (autoSiegeSettings.threatLevel >= -99 && autoSiegeSettings.threatLevel < -50) {
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 7);
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 7);
                                    //                                  party.changeRoleLevel(flag, 'fighter', 7);
                                    //                                    party.changeRoleLevel(flag, 'mage', 7);
                                    flag.memory.party = [];
                                    flag.memory.musterType = "demoSuppressor";
                                } else if (autoSiegeSettings.threatLevel <= 10 && autoSiegeSettings.threatLevel >= -10) {
                                    //party.changeRoleCount(flag, role, number, level);
                                    flag.memory.party = [];
                                    flag.memory.musterType = "suppressor";
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 5);
                                    party.changeRoleLevel(flag, 'mage', 5);
                                } else if (autoSiegeSettings.threatLevel <= 50 && autoSiegeSettings.threatLevel > 10) {
                                    //                      party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                        party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 6);
                                    party.changeRoleLevel(flag, 'mage', 6);
                                } else if (autoSiegeSettings.threatLevel <= 99 && autoSiegeSettings.threatLevel > 50) {
                                    //                          party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                            party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 7);
                                    party.changeRoleLevel(flag, 'mage', 7);
                                } else if (autoSiegeSettings.threatLevel === 100) {
                                    //                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                                  party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 10);
                                    party.changeRoleLevel(flag, 'mage', 10);
                                }
                            }

                            // Threat level is at max 100 and min -100
                            // min - 100 means that you can maximize thieves

                            // Add thieves too flag. 
                            // break; Do not break cause raiding also needs suppression.
                            if (!Game.flags.raidingFlag) {
                                var bca = new RoomPosition(flag.room.storage.pos.x, flag.room.storage.pos.y, flag.room.name);
                                var zzz = flag.room.createFlag(bca, 'raidingFlag', COLOR_YELLOW, COLOR_YELLOW);
                                flag.memory.musterType = 'suppressor';
                                flag.memory.spawnCounter = 10;
                                break;
                            }

                            if (Game.flags.raidingFlag.memory.musterRoom === 'none') {
                                Game.flags.raidingFlag.memory.musterRoom = 'close';
                                Game.flags.raidingFlag.memory.musterType = 'dismantleRoom';
                                Game.flags.raidingFlag.memory.tusken = flag.memory.tusken;
                                Game.flags.raidingFlag.memory.demolisherOpts.clearBase = true;
                                Game.flags.raidingFlag.memory.thiefOps.pickUp = false;
                                Game.flags.raidingFlag.memory.CachedPathOn = true;

                            } else if (Game.flags.raidingFlag.memory.CachedPathOn && Game.flags.raidingFlag.memory.cachedPathInfo.startFlag === null) {
                                Game.flags.raidingFlag.memory.cachedPathInfo.startFlag = Game.flags.raidingFlag.memory.musterRoom;

                            }
                            if (!autoSiegeSettings.raiding && Game.time % 50) {
                                var myDemos;
                                if (flag.room.terminal) {
                                    myDemos = flag.room.find(FIND_MY_CREEPS);
                                    myDemos = _.filter(myDemos, function(o) {
                                        return o.memory.role === 'demolisher';
                                    });
                                    for (let i in myDemos) {
                                        myDemos[i].memory.targetID = flag.room.terminal.id;
                                    }
                                    if (flag.memory.squadMode === 'paired') {
                                        flag.memory.squadGrouping.one.target = flag.room.terminal.id;
                                        flag.memory.squadGrouping.two.target = flag.room.terminal.id;
                                    }

                                } else if (flag.room.storage) {
                                    myDemos = flag.room.find(FIND_MY_CREEPS);
                                    myDemos = _.filter(myDemos, function(o) {
                                        return o.memory.role === 'demolisher';
                                    });
                                    for (let i in myDemos) {
                                        myDemos[i].memory.targetID = flag.room.storage.id;
                                    }
                                    if (flag.memory.squadMode === 'paired') {
                                        flag.memory.squadGrouping.one.target = flag.room.storage.id;
                                        flag.memory.squadGrouping.two.target = flag.room.storage.id;
                                    }
                                }
                                require('commands.toParty').removeRole(Game.flags.raidingFlag, 'thief');
                            }


                            if ((!flag.room.storage || flag.room.storage.total === 0 || flag.room.storage.store[RESOURCE_ENERGY] === flag.room.storage.total) && (!flag.room.terminal || flag.room.terminal.total === 0 || flag.room.terminal.store[RESOURCE_ENERGY] === flag.room.terminal.total)) {
                                autoSiegeSettings.mode = 'suppression';
                                require('commands.toParty').removeRole(Game.flags.raidingFlag, 'thief');
                            }
                            break;

                        case 'suppression':
                            if (flag.memory.spawnCounter === 0) {
                                flag.memory.spawnCounter = 5;
                            }
                            if (Game.time % 250 === 0 && Game.flags.raidingFlag) {
                                adjustThreatLevel(flag.room, autoSiegeSettings);
                                let party = require('commands.toParty');
                                /*if (autoSiegeSettings.threatLevel === -100) {
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 8); // 10/40 body
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 8); // 10/40 body
  //                                  party.changeRoleLevel(flag, 'fighter', 5);
//                                    party.changeRoleLevel(flag, 'mage', 5);
                                }else if (autoSiegeSettings.threatLevel >= -50 && autoSiegeSettings.threatLevel < -10) {
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 6);
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 6);
      //                              party.changeRoleLevel(flag, 'fighter', 6);
    //                                party.changeRoleLevel(flag, 'mage', 6);
                                } else if (autoSiegeSettings.threatLevel >= -99 && autoSiegeSettings.threatLevel < -50) {
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 7);
                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 7);
  //                                  party.changeRoleLevel(flag, 'fighter', 7);
//                                    party.changeRoleLevel(flag, 'mage', 7);
                                } else*/
                                if (autoSiegeSettings.threatLevel <= 10 && autoSiegeSettings.threatLevel >= -10) {
                                    //party.changeRoleCount(flag, role, number, level);
                                    //                                  party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                                    party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 5);
                                    party.changeRoleLevel(flag, 'mage', 5);
                                } else if (autoSiegeSettings.threatLevel <= 50 && autoSiegeSettings.threatLevel > 10) {
                                    //                      party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                        party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 6);
                                    party.changeRoleLevel(flag, 'mage', 6);
                                } else if (autoSiegeSettings.threatLevel <= 99 && autoSiegeSettings.threatLevel > 50) {
                                    //                          party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                            party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 7);
                                    party.changeRoleLevel(flag, 'mage', 7);
                                } else if (autoSiegeSettings.threatLevel === 100) {
                                    //                                    party.changeRoleLevel(Game.flags.raidingFlag, 'demolisher', 5);
                                    //                                  party.changeRoleLevel(Game.flags.raidingFlag, 'thief', 5);
                                    party.changeRoleLevel(flag, 'fighter', 10);
                                    party.changeRoleLevel(flag, 'mage', 10);
                                }
                            }



                            let nothingLeft = flag.room.find(FIND_STRUCTURES);
                            nothingLeft = _.filter(nothingLeft, function(o) {
                                return o.structureType !== STRUCTURE_CONTROLLER;
                            });
                            console.log('Suppressing room to clear all strucutrres', nothingLeft.length);
                            if (nothingLeft.length === 0) {
                                flag.memory.setColor = {
                                    color: COLOR_WHITE,
                                    secondaryColor: COLOR_WHITE,
                                };
                                Game.flags.raidingFlag.memory.remove = true;
                            }

                            break;
                    }

                }


                if (flag.memory.powerCreepFlag) {
                    if (flag.memory.doPowerOrder) {
                        if (flag.color !== COLOR_YELLOW && flag.room && Game.powerCreeps[flag.name]) {
                            flag.room.visual.text(flag.memory.doPowerOrder, flag.pos.x, flag.pos.y - 1);
                            flag.room.visual.text(Game.powerCreeps[flag.name].memory.currentPowerJob, flag.pos.x, flag.pos.y + 2);
                            flag.room.visual.text(Game.powerCreeps[flag.name].memory.currentJob, flag.pos.x, flag.pos.y + 3);


                        }
                    }
                    if (!Game.powerCreeps[flag.name]) {
                        flag.room.memory.powerLevels = undefined;
                    }
                }

                if (flag.memory.reclaimer === true) {

                    let reclaim = flag;
                    if (reclaim.room === undefined || reclaim.room.controller.level === 0) {
                        if (reclaim.color !== COLOR_YELLOW) {
                            reclaim.memory.setColor = {
                                color: COLOR_YELLOW,
                                secondaryColor: COLOR_YELLOW,
                            };
                        }
                    } else if (reclaim.room.controller.level) {
                        if (reclaim.room.controller.level === 7 && reclaim.room.controller.progress > 10000000) {
                            if (reclaim.color !== COLOR_YELLOW) {
                                reclaim.memory.setColor = {
                                    color: COLOR_YELLOW,
                                    secondaryColor: COLOR_YELLOW,
                                };
                            }
                        } else {
                            if (reclaim.color !== COLOR_WHITE) {
                                reclaim.memory.setColor = {
                                    color: COLOR_WHITE,
                                    secondaryColor: COLOR_WHITE,
                                };
                            }
                        }
                    }
                }

                if (flag.memory.support === true) {

                    let reclaim = flag;
                    if (reclaim.room && reclaim.room.controller.level < 6 && reclaim.room.controller.level > 3) {
                        if (reclaim.color !== COLOR_YELLOW) {
                            reclaim.memory.setColor = {
                                color: COLOR_YELLOW,
                                secondaryColor: COLOR_YELLOW,
                            };
                        }
                    } else {
                        if (reclaim.color !== COLOR_WHITE) {
                            reclaim.memory.setColor = {
                                color: COLOR_WHITE,
                                secondaryColor: COLOR_WHITE,
                            };
                        }
                    }
                }

                if (flag.memory.CachedPathOn === true) {
                    if (flag.memory.cachedPathInfo === undefined) {
                        flag.memory.cachedPathInfo = {
                            startFlag: null,
                            startPoint: { x: 0, y: 0, roomName: 'none' },
                            endPoint: { x: flag.pos.x, y: flag.pos.y, roomName: flag.pos.roomName },
                            cachedPath: {},
                        };
                    }
                    let info = flag.memory.cachedPathInfo;
                    if (!flag.pos.isEqualTo(new RoomPosition(info.endPoint.x, info.endPoint.y, info.endPoint.roomName))) {
                        console.log('Clearing CachedPath and resetting endPoint for new Flag location');
                        flag.memory.cachedPathInfo.endPoint = { x: flag.pos.x, y: flag.pos.y, roomName: flag.pos.roomName };
                        flag.memory.cachedPathInfo.cachedPath = {};
                    }
                    if (info.startPoint.x === 0) {
                        console.log('CachedPathOn for flag:', flag, 'needs startPoint set memory of StartFlag or startPoint');
                        if (Game.flags[info.startFlag] !== undefined) {
                            info.startPoint.x = Game.flags[info.startFlag].pos.x;
                            info.startPoint.y = Game.flags[info.startFlag].pos.y;
                            info.startPoint.roomName = Game.flags[info.startFlag].pos.roomName;
                        }
                    } else {
                        // If there is a start and end point then good :)    
                    }

                }

                if (flag.memory.evacuate) {
                    console.log('evacutae flag found?');
                    let evacFlag = flag;
                    // Goal of evacFlag is to remove all creeps from a room, then after the flag is gone, to put them back in that room.
                    if (evacFlag.room !== undefined) evacFlag.room.visual.text('DO NOT REMOVE, SET TO BLUE TO REMOVE', evacFlag.pos.x, evacFlag.pos.y);
                    if (evacFlag.memory.evacuateTimer !== undefined) {
                        evacFlag.memory.evacuateTimer--;
                        if (evacFlag.memory.evacuateTimer <= 0) {
                            evacFlag.memory.setColor = {
                                color: COLOR_BLUE,
                            };
                        }
                    }
                    // So first is to find all creeps in that room.
                    // Then to move them out of the room.
                    let _creeps;
                    if (evacFlag.memory.runningAway === undefined) {
                        evacFlag.memory.runningAway = [];
                        let crps = evacFlag.room.find(FIND_MY_CREEPS);
                        for (let e in crps) {
                            evacFlag.memory.runningAway.push(crps[e].id);
                        }
                        _creeps = crps;
                    }
                    if (evacFlag.memory.prohibitDirection === undefined) {
                        evacFlag.memory.prohibitDirection = {
                            top: true,
                            right: true,
                            left: true,
                            bottom: true,
                        };
                    }

                    if (_creeps === undefined) {
                        _creeps = [];
                        for (let i in evacFlag.memory.runningAway) {
                            let zzed = Game.getObjectById(evacFlag.memory.runningAway[i]);
                            if (zzed !== null)
                                _creeps.push(zzed);
                        }
                    }

                    if (evacFlag.color !== COLOR_BLUE) {
                        for (let i in _creeps) {
                            _creeps[i].say('evac flag');
                            _creeps[i].evacuateRoom(evacFlag.pos.roomName);
                            _creeps[i].memory.follower = true;
                            // we need to stop movement on creeps.
                        }
                    } else if (evacFlag.color === COLOR_BLUE) {
                        let allIn = true;
                        for (let i in _creeps) {

                            if (_creeps[i].pos.roomName !== evacFlag.pos.roomName) {
                                _creeps[i].moveTo(evacFlag);
                                _creeps[i].say('returning');
                                allIn = false;
                            } else if (_creeps[i].pos.roomName === evacFlag.pos.roomName) {
                                _creeps[i].memory.follower = undefined;
                            }
                        }
                        if (allIn) {
                            console.log('all creeps are returned');
                            evacFlag.remove();
                        }
                        // Do not remove flag, set flag color to RED to remove. 
                    }
                }

                // Mineral flag that will turn off when it's fully extracted.
                if (flag.memory.mineral) {
                    //flag.memory.mineralType 
                    /*
                    if ( Memory.stats.totalMinerals[flag.memory.mineralType] < 50000){
//                        console.log("Changing Mineral Flag for:",Memory.stats.totalMinerals[flag.memory.mineralType],flag.memory.mineralType);
                        if(flag.color !== COLOR_YELLOW){
                            flag.memory.setColor=  {
                                color: COLOR_YELLOW,
                                secondaryColor: COLOR_YELLOW,
                            };
                        }
                           //flag.memory.spawnCounter = 1;
                    } else*/
                    if (flag.color !== COLOR_WHITE) {
                        flag.memory.setColor = {
                            color: COLOR_WHITE,
                            secondaryColor: COLOR_WHITE,
                        };
                    }
                    /*
                                        if (flag.room !== undefined) {
                                            if (flag.room.mineral !== undefined) {
                                                flag.memory.mineralID = flag.room.mineral.id;
                                                flag.memory.mineralType = flag.room.mineral.mineralType;
                                            }
                                            if (flag.room.mineral.mineralAmount === 0) {
                                                flag.memory.delaySpawn = flag.room.mineral.ticksToRegeneration - 150;
                                                flag.memory.spawnCounter = 10;
                                            }
                                        }*/
                }




                if (flag.memory.musterType && flag.memory.musterType === 'hmule') {
                    if (flag.memory.rallyCreateCount > 100) {
                        flag.memory.rallyCreateCount = 100;
                    }
                }
                if (flag.memory.musterType !== undefined && flag.room !== undefined && flag.memory.musterType !== 'none') {
                    //flag.room.visual.
                    if (flag.memory.rallyCreateCount > 100) {
                        flag.memory.rallyCreateCount = 100;
                    }
                    flag.room.visual.text(flag.memory.musterType + ":" + flag.memory.rallyCreateCount, flag.pos.x, flag.pos.y);
                    flag.room.visual.text(flag.memory.squadMode, flag.pos.x, flag.pos.y - 3);

                    if (flag.memory.musterType === 'firstWave') {
                        var spwns = flag.room.find(FIND_MY_STRUCTURES);
                        spwns = _.filter(spwns, function(structure) {
                            return (structure.structureType == STRUCTURE_SPAWN);
                        });
                        if (spwns.length > 0) {
                            flag.memory.musterType = 'secondWave';
                            flag.memory.party = undefined;
                        }
                    }
                    if (flag.memory.musterType === 'secondWave') {
                        // THis is the upgrade wave.
                        let sites = flag.room.find(FIND_CONSTRUCTION_SITES);
                        if (sites.length > 3) {
                            flag.memory.musterType = 'thirdWave';
                            flag.memory.party = undefined;
                        }
                        if (flag.room.controller.level > 5 && flag.room.terminal !== undefined && flag.room.terminal.my) {
                            flag.memory.setColor = {
                                color: COLOR_WHITE,
                                secondaryColor: COLOR_WHITE,
                            };
                        }
                    }

                    if (flag.memory.musterType === 'thirdWave') {
                        // THis is the buildWave wave.
                        let sites = flag.room.find(FIND_CONSTRUCTION_SITES);
                        if (sites.length === 0) {
                            flag.memory.musterType = 'secondWave';
                            flag.memory.party = undefined;
                        }
                        if (flag.room.terminal !== undefined && flag.room.terminal.my) {
                            flag.memory.setColor = {
                                color: COLOR_WHITE,
                                secondaryColor: COLOR_WHITE,
                            };
                        }
                    }
                }


                // Flag functions - to setcolor or remove flag.
                if (flag.memory.setColor !== undefined && flag.memory.setColor.color !== flag.color) {
                    flag.setColor(flag.memory.setColor.color, flag.memory.setColor.secondaryColor);
                    //                    console.log( ,"trying to set color",flag.pos,roomLink(flag.pos.roomName));
                } else if (flag.memory.setColor !== undefined && flag.memory.setColor.secondaryColor && flag.memory.setColor.secondaryColor !== flag.secondaryColor) {
                    flag.setColor(flag.color, flag.memory.setColor.secondaryColor);
                    //flag.setColor(flag.memory.setColor.color, flag.memory.setColor.secondaryColor)
                    //console.log( flag.setColor(flag.memory.setColor.color, flag.memory.setColor.secondaryColor),"trying to set color",flag.pos,roomLink(flag.pos.roomName) );
                } else {
                    flag.memory.setColor = undefined;
                }
                if (flag.memory.removeFlagCount !== undefined) {
                    flag.memory.removeFlagCount--;
                    if (flag.memory.removeFlagCount < 0) {
                        flag.memory.remove = true;
                    }
                }

                if (flag.memory.remove !== undefined) {
                    flag.remove();
                }

                switch (flag.secondaryColor) {
                    case COLOR_BLUE:
                        if (flag.memory.roomOccupied === undefined) flag.memory.roomOccupied = 0;
                        console.log('Possible remote Harassers?', roomLink(flag.pos.roomName), flag.memory.roomOccupied);
                        flag.memory.roomOccupied++;
                        if (flag.room) {
                            //                        let bads = flag.room.enemies;
                            let bads = flag.room.playerCreeps;
                            //                            bads = [];
                            //          bads.push(Game.getObjectById('5bc8d6746b9ddf68f84a4c27'));
                            //        bads.push(Game.getObjectById('5bc8d8e803a4102313dde441'));

                            if (bads.length === 0 && Game.rooms[flag.memory.musterRoom]) { //
                                // Here we remove flags and such. 
                                flag.memory.remove = true;
                                let alpha = Game.rooms[flag.memory.musterRoom].alphaSpawn;
                                let zz = _.indexOf(alpha.memory.remoteStop, flag.pos.roomName);
                                if (zz !== -1) {
                                    alpha.memory.remoteStop.splice(zz, 1);
                                }
                                continue;
                            }

                            flag.room.visual.text(flag.memory.roomOccupied, flag.pos.x, flag.pos.y + 1);
                            if (flag.memory.roomOccupied > 100) {

                                let bodyCount = 0;
                                for (let ii in bads) {
                                    bodyCount += bads[ii].body.length;
                                }

                                let musterCount = 0;
                                if (bodyCount <= 50) {
                                    musterCount = 1;
                                } else if (bodyCount <= 100) {
                                    musterCount = 2;
                                } else {
                                    musterCount = 3;
                                }

                                // Well first off we need to stop production to this room. - This is done through checkforbads in commands.toMove;
                                // Then we need to set this flag to produce units.
                                flag.memory.rallyFlag = 'home';
                                if (flag.memory.rallyCreateCount > 5) { flag.memory.rallyCreateCount = 5; }
                                flag.memory.spawnCounter = 1;
                                flag.memory.party = [
                                    ['remoteGuard', musterCount, 5]
                                ];
                            }
                        } else {
                            // Request room to be observered for a long time!
                            observer.reqestRoom(flag.pos.roomName, 5);
                        }

                        break;
                    case COLOR_PURPLE:
                        rampartThings(flag);
                        break;
                    case COLOR_WHITE:
                        break;
                    case COLOR_RED:
                        if (flag.room === undefined) {
                            flag.memory.rallyFlag = 'home';
                        }
                        if (flag.memory.power) {
                            var power = require('build.power');
                            powerTotal++;
                            power.calcuate(flag);
                        }
                        break;

                    case COLOR_BROWN:

                        break;
                    case COLOR_ORANGE: // This color is for squad running, leave empty due to it being to the creep.run role;
                        var squad;
                        //                   if (flag.memory.squadID === undefined || flag.memory.squadID.length !== flag.memory.totalNumber) {
                        // This is setup by the commands.toParty.rally section.
                        ///                      } else {
                        if (!flag.memory.squadID) {
                            let potSquad = _.filter(Game.creeps, function(o) {
                                return o.memory.party === flag.name;
                            });
                            squad = _.filter(potSquad, function(o) {
                                return o.memory.partied;
                            });
                            flag.memory.squadID = getIdArray(squad);
                        } else {
                            squad = getObjArray(flag.memory.squadID);
                        }
                        if (flag.room) {
                            var currentPartyNumber = flag.memory.squadID.length;
                            flag.room.visual.text(flag.memory.squadID.length + "/" + flag.memory.totalNumber, flag.pos.x, flag.pos.y - 1);
                            flag.room.memory.look4Squad = undefined;
                        }
                        if(flag.memory.squadID.length === 0){
                            require('commands.toSquad').cleanUpSquadStuff(flag);
                            flag.memory.setColor = {
                                    color: COLOR_WHITE,
                                    secondaryColor: COLOR_WHITE
                            };
                            flag.memory.death = false;
                        }

                        /*  if(currentPartyNumber < flag.memory.totalNumber){
                            // if it at 3 it looks
                            // if it's at 2 it looks and adds it self to found
                            if(flag.room.memory.look4Squad === undefined){
                                flag.room.memory.look4Squad = {
                                    two:[],
                                    one:[],
                                };
                            }
                            // First it looks, then it adds it self to be found
                            var addedCreep;
                            var crp;
                            if(currentPartyNumber === 3 && flag.room.memory.look4Squad.one.length > 0){
                                addedCreep = Game.getObjectById(flag.room.memory.look4Squad.one.shift());
                                addedCreep.memory.party = flag.name;
                                flag.memory.squadID.push( addedCreep.id );
                                squad.push( addedCreep );

                            }else if(currentPartyNumber === 2 && flag.room.memory.look4Squad.two.length > 0){
  //                              addedCreep = flag.room.memory.look4Squad.two[0].shift();
                                addedCreep = Game.getObjectById(flag.room.memory.look4Squad.two[0].shift());
                                addedCreep.memory.party = flag.name;
                                flag.memory.squadID.push( addedCreep.id );

                                squad.push(addedCreep );

//                                addedCreep = flag.room.memory.look4Squad.two[0].shift();
                                addedCreep = Game.getObjectById(flag.room.memory.look4Squad.two[0].shift());
                                addedCreep.memory.party = flag.name;
                                flag.memory.squadID.push( addedCreep );
                                squad.push( addedCreep );
                            }else                            // if it's at 1 it looks to be found.
                            if(currentPartyNumber === 1){
                                flag.room.memory.look4Squad.one.push(squad[0].id);
                            }else if(currentPartyNumber === 2){
                                flag.room.memory.look4Squad.two.push([squad[0].id,squad[1].id]);
                            }
                        }*/




                        if (squad !== undefined && squad.length > 0) {
                            require('commands.toSquad').runSquad(squad);
                        } else {
                            
                            /*if (flag.memory.spawnCounter === 0) {
                                flag.memory.setColor = {
                                    color: COLOR_WHITE,
                                    secondaryColor: COLOR_WHITE
                                };
                            } else {
                                if (flag.memory.spawnCounter > 0) {
                                    flag.memory.spawnCounter--;
                                    flag.memory.setColor = {
                                        color: COLOR_YELLOW,
                                        secondaryColor: COLOR_YELLOW
                                    };
                                }
                            } */
                        }

                        flag.memory.squadID = getIdArray(squad);


                        break;
                }


                switch (flag.color) {
                    case COLOR_WHITE:
                        whiteflag(flag);
                        break;

                    case COLOR_RED:
                        doDefendThings(flag);
                        if (Memory.showInfo > 1)
                            defendTotal++;
                        break;

                    case COLOR_ORANGE:
                        break;

                    case COLOR_YELLOW:

                        // This will mean power flag if it's green/red
                        if (flag.memory.portal === undefined) {
                            flag.memory.portal = false; // This needs to be set true in order for creeps to rally then portal.
                        }
                        if (flag.memory.rallyFlag === undefined) {
                            flag.memory.rallyFlag = false; // This needs to be set true in order for creeps to rally then portal.
                        }
                        if (flag.memory.waypointFlag === undefined) {
                            flag.memory.waypointFlag = false; // This needs to be set true in order for creeps to rally then portal.
                        }
                        if (flag.memory.tusken === undefined) {
                            flag.memory.tusken = true; // This needs to be set true in order for creeps to rally then portal.
                        }
                        if (flag.memory.musterRoom === undefined) {
                            flag.memory.musterRoom = 'none';
                        }
                        if (flag.memory.musterType === undefined) {
                            flag.memory.musterType = 'none';
                        }
                        let rally = flag;
                        //if (flag.name.substr(0, 5) == 'power') {
                        //  flag.memory.power = true;
                        //    flag.setColor(flag.color, COLOR_RED);
                        //}


                        if (flag.memory.bandit || flag.name == 'thief') {
                            if (flag.name === 'thief') {
                                flag.memory.musterType = 'thief';
                                flag.memory.musterRoom = 'close';
                            } else {
                                // flag.memory.bandit = true;
                            }
                            /*                            if (flag.memory.timer === undefined) {
                                                            flag.memory.timer = 1200;
                                                        }
                                                        flag.memory.timer--;
                                                        if (flag.memory.timer < 0) {
                            //                                flag.remove();
                                                        } */
                            if (Game.time % 50 === 0) console.log("Bandit set @ room:", roomLink(flag.pos.roomName));
                            if (flag.room !== undefined) {
                                // So here we check if we remove the flag
                                // We first give it an 1500 timer.
                                var testz2 = flag.room.find(FIND_TOMBSTONES);

                                var testz3 = _.filter(testz2, function(o) {
                                    return o.total < 100;
                                });
                                // Start countingdown to see if bandits have failed to kill caravan.
                                if (flag.memory.removeCountDown === undefined) {
                                    flag.memory.removeCountDown = 1000;
                                }
                                flag.memory.removeCountDown--;
                                if (flag.memory.removeCountDown < 0 && testz2.length === 0) {
                                    flag.remove();
                                }

                                //                                console.log('Bandit room available, containers found:', testz2.length, "emp:", testz3.length, flag.memory.timer);
                                if (testz2.length > 0 && testz2.length == testz3.length) {
                                    flag.remove();
                                }
                                if (testz2.length > 0) {
                                    for (var eae in flag.memory.party) {
                                        if (flag.memory.party[eae][1] > 0 && flag.memory.party[eae][0] !== 'thief') {
                                            flag.memory.party[eae][1] = 0;
                                        }
                                        if (flag.memory.party[eae][1] === 0 && flag.memory.party[eae][0] === 'thief') {
                                            flag.memory.party[eae][1] = 3;
                                            flag.memory.rallyCreateCount = 10;
                                        }
                                    }
                                }

                            }
                        }


                        if (rally !== undefined) {
                            if (rally.memory.rallyCreateCount === undefined) {
                                rally.memory.rallyCreateCount = 0;
                            }
                            //                            if(Game.cpu.bucket > 600)
                            //                            rally.memory.rallyCreateCount = 0;
                            rally.memory.rallyCreateCount--;
                            if (rally.memory.rallyCreateCount > 100) {
                                rally.memory.rallyCreateCount = 100;
                            }

                            if (rally.memory.rallyCreateCount < 0) { //rallyCreateCount
                                //rally.memory.rallyCreateCount = delayBetweenScan;
                                party.create(flag, spawnCount);

                            }
                        }

                        //
                        break;

                }
            }
            if (Memory.showInfo > 1) {
                Memory.stats.powerPartyNum = powerTotal;
                Memory.stats.defendFlagNum = defendTotal;
            } else {
                Memory.stats.powerPartyNum = undefined;
                Memory.stats.defendFlagNum = undefined;
            }

        }
    }
    module.exports = buildFlags;