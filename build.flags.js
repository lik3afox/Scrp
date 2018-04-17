    var party = require('commands.toParty');
    var FLAG = require('foxGlobals');
    var delayBetweenScan = 10;

    function doDefendThings(flag) {
        if (flag.room === undefined) return;

        var hostiles;
        var creeps;
        if (flag.secondaryColor == COLOR_RED) {
            hostiles = flag.room.find(FIND_HOSTILE_CREEPS);

            hostiles = _.filter(hostiles, function(o) {
                return o.owner.username == 'Invader';
            });

            flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });
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
                for (var a in creeps) {
                    creeps[a].memory.runAway = true;
                    creeps[a].memory.runFrom = flag.name;
                }
            }
        } else if (flag.secondaryColor == COLOR_WHITE) {
            hostiles = flag.room.find(FIND_HOSTILE_CREEPS);
            hostiles = _.filter(hostiles, function(o) {
                return o.owner.username != 'Invader' && o.owner.username != "Source Keeper" && !_.contains(FLAG.friends, o.owner.username);
            });
            flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });
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
                    creeps[b].memory.runAway = true;
                    creeps[b].memory.runFrom = flag.name;
                }
            }
        }

    }

    function removeRA(flag) {
        let bads = flag.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        bads = _.filter(bads, function(o) {
            return !_.contains(FLAG.friends, o.owner.username);
        });
        if (bads.length === 0) {
            flag.remove();
        }
    }

    function rampartThings(flag) {
        if (flag.memory.invaderTimed === undefined) flag.memory.invaderTimed = 0;
        if (flag.memory.alert === undefined || !flag.memory.alert) {
            flag.memory.alert = true;
        }

        if (flag.memory.alert) {
            // Look for creeps
            let bads = flag.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(object) {
                return (object.owner.username != 'Invader' && !_.contains(FLAG.friends, object.owner.username));
            });

            if (bads.length === 0) {
                if (flag.memory.invadeDelay === undefined)
                    flag.memory.invadeDelay = 100;

                if (flag.memory.invadeDelay < 0) {
                    //                    var constr = require('commands.toStructure');
                    //                    constr.checkSnapShot(flag.pos.roomName);

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

    function clearFlagMemory() {
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
        homeDefender: undefined,
        minHarvest: undefined,
        harvester: undefined,
        nuke: undefined,
        power: undefined,
        upbuilder: undefined,
        first: undefined,
        scientist: undefined,
        linker: undefined,
        wallwork: undefined,
        spawn: undefined,
        sort: undefined,
        upgrader: undefined,
        lab: undefined,
        tower: undefined,
        wait: undefined,
    };

    function killCreeps(room, role, level) {
        let screeps = room.find(FIND_MY_CREEPS);
        if (level === undefined) {
            screeps = _.filter(screeps, function(s) {
                return s.memory.role == role;
            });
        } else {
            screeps = _.filter(screeps, function(s) {
                return s.memory.role == role && s.memory.level == level;
            });

        }
        //        console.log('SUCIDE FIND', screeps.length);
        for (var ea in screeps) {
            screeps[ea].suicide();
        }
    }

    function stopRebirth(room, role) {

        let screeps = room.find(FIND_MY_CREEPS);
        _.filter(screeps, function(s) {
            if (s.memory.role == role) {
                s.memory.reportDeath = true;
            }
            //                return s.memory.role == role;
        });

    }

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
        //    console.log( roomer[ee],ee,flag.memory.checkWhat,'ADJUST CHECKING',flag.room.name);
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

                    if (flag.room.name == 'E19S49') {
                        if (flag.room.storage.store.energy > 800000) {
                            flag.memory.module[ez][_number] = 3;
                        } else if (flag.room.storage.store.energy > 500000) {
                            flag.memory.module[ez][_number] = 2;
                        } else if (flag.room.storage.store.energy > 25000) {
                            flag.memory.module[ez][_number] = 1;
                        } else {
                            flag.memory.module[ez][_number] = 0;
                        }

                    }
                    /*
                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            // 
                            break;
                        case 3:
                            if (roomEnergy >= 2300) {
                                flag.memory.module[ez][_level] = 5;
                            }
                            break;
                    }
*/
                }
                break;
            case 'upbuilder':
                // Harvest Checking
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {
                    if (Game.shard.name !== 'shard1') {
                        if (Game.shard.name === 'shard0') {
                            var storage = flag.room.storage;
                            if (storage !== undefined) {
                                if (storage.store[RESOURCE_ENERGY] > 500000) {
                                    flag.memory.module[ez][_number] = 1;
                                } else {
                                    flag.memory.module[ez][_number] = 0;
                                }
                            }
                        }

                    } else {

                        switch (flag.memory.module[ez][_level]) {
                            case 0:
                                // 
                                break;
                            case 7:
                                if (flag.room.controller.level === 8) {
                                    flag.memory.module[ez][_level] = 8;
                                    flag.memory.module[ez][_number] = 1;
                                }
                                break;
                        }
                    }
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
                        //                        console.log(flag, 'FOUND MasterLab', zzz[0].structureType);
                        flag.room.memory.boostLabID = zzz[0].id;
                    }
                }

                break;

            case 'linker':

                if (flag.room.storage === undefined) break;
                if (flag.room.memory.masterLinkID === undefined && flag.room.controller.level > 4) {
                    zzz = flag.room.find(FIND_MY_STRUCTURES);
                    zzz = _.filter(zzz, function(structure) {
                        return (structure.structureType == STRUCTURE_LINK && structure.pos.inRangeTo(flag.room.storage, 2));
                    });

                    if (zzz.length > 0) {
                        //     console.log(flag, 'FOUND masterLink', zzz[0].structureType);
                        flag.room.memory.masterLinkID = zzz[0].id;
                    }
                }

                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {
                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            if (roomEnergy >= 700) {
                                flag.memory.module[ez][_level] = 2;
                                let source = flag.room.find(FIND_SOURCES);
                                flag.memory.module[ez][_number] = source.length;
                            }
                            break;
                        case 2:
                            if (roomEnergy >= 750) {
                                flag.memory.module[ez][_level] = 3;
                            }
                            break;
                        case 3:
                            if (roomEnergy >= 1200) {
                                flag.memory.module[ez][_level] = 4;
                            }
                            break;

                    }
                }


                break;

            case "sort":
                flag.memory.module.sort();
                break;

            case "wait":
                flag.memory.checkWhat = -40;
                break;
            case 'power':
                if (flag.room.controller.level === 8 && flag.room.memory.powerspawnID === undefined) {
                    let zz = flag.room.powerspawn;
                    //   console.log(roomLink(flag.pos.roomName), 'FINDING SPAWN' );
                }
                break;
            case 'nuke':
                if (flag.room.controller.level === 8 && flag.room.memory.nukeID === undefined) {
                    let zz = flag.room.nuke;
                    //  console.log(roomLink(flag.pos.roomName), 'Finding Nuke');
                }
                break;
            case 'spawn':
                // This will setup the spawns.
                zzz = flag.room.find(FIND_MY_STRUCTURES);
                zzz = _.filter(zzz, function(structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_LAB

                    );
                });

                flag.room.memory.spawnTargets = [];
                var a = zzz.length;
                while (a--) {
                    flag.room.memory.spawnTargets.push(zzz[a].id);
                }

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
                            if (roomEnergy >= 1250) { // At room controller lv 4 and extensions, with walls or ramparts
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

            case 'first':
                // Harvest Checking
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {
                    roomEnergy = flag.room.energyCapacityAvailable;

                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            if (roomEnergy >= 550) {
                                flag.memory.module[ez][_level] = 1;
                                flag.memory.module[ez][_number] = 2; // Number gets reduced by scientist coming.
                            }
                            break;
                        case 1:
                            if (roomEnergy >= 800) {
                                flag.memory.module[ez][_level] = 2;
                            }
                            break;
                        case 2:
                            if (roomEnergy >= 1300) {
                                flag.memory.module[ez][_level] = 3;
                            }
                            break;
                        case 3:
                            if (roomEnergy >= 1800) {
                                flag.memory.module[ez][_level] = 4;
                                killCreeps(flag.room, 'first', 3);
                            }
                            break;
                        case 4:
                            if (roomEnergy >= 2250) {
                                flag.memory.module[ez][_level] = 5;
                                killCreeps(flag.room, 'first', 4);
                            }
                            break;
                        case 5:
                            if (roomEnergy >= 2500) {
                                flag.memory.module[ez][_level] = 6;
                                killCreeps(flag.room, 'first', 5);
                            }
                            break;
                    }

                }
                break;

            case 'homeDefender':
                // Harvest Checking
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {

                    if (flag.memory.module[ez][_number] === 0 && flag.memory.module[ez][_level] === 0) {
                        let vr = flag.room.find(FIND_STRUCTURES, {
                            filter: s => s.structureType == STRUCTURE_SPAWN && s.memory.alphaSpawn
                        });

                        if (vr.length > 0 && vr[0].memory.roadsTo.length > 0) {
                            if (vr[0].memory.roadsTo[0].source !== 'xxxx') {
                                flag.memory.module[ez][_level] = 4;
                                flag.memory.module[ez][_number] = 1;
                            }
                        }
                    } else {
                        flag.memory.module[ez][_level] = flag.room.controller.level - 1;
                    }

                }
                break;
            case 'scientist':
                // Harvest Checking
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else if (Game.shard.name === 'shard1') {
                    if (flag.memory.module[ez][_level] === 0 && flag.room.memory.mineralContainID !== undefined && flag.room.memory.mineralID !== undefined && flag.room.memory.extractID !== undefined) {
                        flag.memory.module[ez][_level] = 4;
                        flag.memory.module[ez][_number] = 1;
                        flag.memory.module[_.findIndex(flag.memory.module, function(o) { return o[_name] == 'first'; })][_number] = 1;
                        stopRebirth(flag.room, 'first');
                    }
                    switch (flag.memory.module[ez][_level]) {
                        case 4:
                            if (roomEnergy >= 1200) {
                                flag.memory.module[ez][_level] = 5;
                            }
                            break;
                        case 5:
                            if (roomEnergy >= 2250) {
                                flag.memory.module[ez][_level] = 6;
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
                                //                                console.log(flag, 'FINDING mineral');
                                //                                // mineralContainID, mineralID, extractID

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
                        //                        console.log(flag.memory.module[ez][_name], 'Lvl:', flag.memory.module[ez][_level], 'Num', flag.memory.module[ez][_number]);

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
                                    if (source.length == 1) {
                                        flag.memory.module[ez][_level] = 3;
                                        flag.memory.module[ez][_number] = 1;
                                    } else if (source.length == 2) {
                                        flag.memory.module[ez][_level] = 4;
                                        flag.memory.module[ez][_number] = 1;
                                    }
                                    killCreeps(flag.room, 'harvester', 2);
                                }
                                break;
                        }
                    }
                }

                break;

        }
    }


    function lowCPUAdjustModule(flag) {

    }

    var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT, backgroundColor: '#0F0F0F' };
    var _name = 0;
    var _number = 1;
    var _level = 2;
    var spawnCount;

    function showInfo(flag) {
        var e;
        if (flag.room === undefined) {
            //            console.log(flag, roomLink(flag.pos.roomName));
            return;
        }

        switch (flag.secondaryColor) {
            case COLOR_WHITE:
                flag.room.visual.text('No Info Selected', flag.pos.x + 1.5, flag.pos.y, font);
                break;
            case COLOR_GREY:
                flag.room.visual.text('Soft Setting Memory', flag.pos.x + 1.5, flag.pos.y, font);
                break;
            case COLOR_YELLOW:
                var xx = flag.pos.x + 1.5;
                var yy = flag.pos.y - 1;

                var keys = Object.keys(roomer);
                var status = keys[flag.memory.checkWhat];

                flag.room.visual.text('Remote Modules:' + ' Status:', status, xx, yy, font);
                if (flag.memory.alphaSpawn !== undefined) {
                    let spwn = Game.getObjectById(flag.memory.alphaSpawn);
                    if (spwn !== null) {
                        var cc = spwn.memory.create.length;
                        var wc = spwn.memory.warCreate.length;
                        var ec = spwn.memory.expandCreate.length;

                        flag.room.visual.text('Remote Modules:' + cc + ':' + wc + ':' + cc + ' Status:', xx, ++yy, font);
                        flag.room.visual.text("Remote:", xx, ++yy, font);
                        for (e in spwn.memory.roadsTo) {
                            let remote = spwn.memory.roadsTo[e];
                            var opt = ['mineral', 'miner', 'transport', 'controller', 'ztransport'];
                            for (var ze in remote) {
                                if (_.contains(opt, ze)) {
                                    var report = '0 / 0 :' + ze + '   ' + remote.source;
                                    flag.room.visual.text(report, xx, ++yy, font);
                                }
                            }
                        }
                        //                        flag.room.visual.text(report, xx, ++yy,font); 

                    }
                }
                break;

            case COLOR_RED:
                flag.room.visual.text('Hard Setting Memory', flag.pos.x + 1.5, flag.pos.y, font);
                break;
            case COLOR_PURPLE:
            case COLOR_GREEN:
                break;
                /*                if (flag.memory.module !== undefined && flag.memory.module.length !== 0) {

                                    var zze = Object.keys(roomer)[flag.memory.checkWhat];

                                    var x = 5; //flag.pos.x + 1.5;
                                    var y = 5; //flag.pos.y;
                                    flag.room.visual.text('Module:' + flag.memory.alphaSpawn + ' Status:' + flag.memory.checkWhat + zze, x, y - 1, font);
                                    for (e in flag.memory.module) {

                                        if (flag.memory.module[e][_number] !== 0) {
                                            var outThere;
                                            if (spawnCount !== undefined) {
                                                if (spawnCount[flag.memory.alphaSpawn] !== undefined && spawnCount[flag.memory.alphaSpawn][flag.memory.module[e][_name]] !== undefined) {
                                                    outThere = spawnCount[flag.memory.alphaSpawn][flag.memory.module[e][_name]].count;
                                                } else {
                                                    outThere = 0;
                                                }
                                            }
                                            /*else {
                                                                           if (Memory.spawnCount[flag.memory.alphaSpawn] !== undefined && Memory.spawnCount[flag.memory.alphaSpawn][flag.memory.module[e][_name]] !== undefined) {
                                                                               outThere = Memory.spawnCount[flag.memory.alphaSpawn][flag.memory.module[e][_name]].count;
                                                                           } else {
                                                                               outThere = 0;
                                                                           } 
                                                                       }*/

                /*
                                            flag.room.visual.text('(' + outThere + '/' + flag.memory.module[e][_number] + ')' + '[Lv:' + flag.memory.module[e][_level] + ']' + ':' + flag.memory.module[e][_name], x, y, font);
                                            y++;
                                        }
                                    }
                                } else {
                                    flag.room.visual.text('Fail Module, is Flag name === Room name?', flag.pos.x + 1.5, flag.pos.y, font);
                                }*/
                //   break;

        }
    }

    function whiteflag(flag) {
        if (flag.memory.checkWhat === undefined) {
            flag.memory.checkWhat = -10;
        }
        if (flag.secondaryColor === COLOR_GREEN || flag.secondaryColor === COLOR_PURPLE)
            flag.memory.checkWhat++;
        if (flag.memory.checkWhat >= Object.keys(roomer).length) {
            flag.memory.checkWhat = 0;
        }
        // Whiteflag functions as a control for that room.
        // When the secondary is set to white - nothing occurs.
        switch (flag.secondaryColor) {
            case COLOR_WHITE:
                // Nothing, maybe even clearing it. 


                break;
            case COLOR_GREY:
                // Resets it's memory. 
                softSetMemory(flag);
                flag.room.memory.simple = undefined;
                break;
            case COLOR_GREEN:
                // Runs off of flag memory. 
                // This color also means that it's pulled as module for build.spaw
                if (flag.memory.checkWhat >= 0)
                    adjustModule(flag);
                //                flag.room.memory.simple = undefined;

                break;

            case COLOR_RED:
                hardSetMemory(flag);
                flag.room.memory.simple = undefined;

                break;
            case COLOR_PURPLE:
                // Purple will mean that it's setup for low CPU usage.
                if (flag.room !== undefined) {
                    if (flag.room.controller.level === 8) {
                        flag.memory.module = [
                            ['linker', 1, 5],
                            ['harvester', 1, 4],
                            ['minHarvest', 1, 7]
                        ];
                        if (flag.room.stats.storageEnergy > 100000) {
                            flag.memory.module.push(['wallwork', 1, 5]);
                        }
                        if (flag.room.controller.ticksToDowngrade < 50000) {
                            flag.memory.module.push(['upbuilder', 1, 8]);
                        }
                        if (flag.room.storage.store[RESOURCE_ENERGY] > 900000) {
                            flag.memory.module.push(['upbuilder', 1, 8]);
                        }
                        if (flag.room.stats.creepNumber > 10) {
                            //                        flag.memory.module.push(['upbuilder', 1, 8]);
                        }
                        if (flag.room.alphaSpawn.memory.roadsTo[0] !== undefined && flag.room.alphaSpawn.memory.roadsTo[0].source === 'xxxx') {
                            flag.room.alphaSpawn.memory.roadsTo.splice(0, 1);
                        }
                        //                        console.log('doing roads to',flag.room.alphaSpawn.memory.roadsTo.length);
                        if (flag.room.alphaSpawn.memory.roadsTo.length > 0) {
                            flag.memory.module.push(['homeDefender', 1, 7]);
                        }
                        flag.room.memory.simple = true;
                        //                    console.log( flag.room.stats.parts,'parts',flag.room.name);

                        if (flag.room.stats.parts > 850) {
                            flag.memory.module.push(['first', 1, 6]);
                        }
                        if (flag.room.stats.parts > 1500) {
                            flag.room.memory.simple = false;
                        }
                        if (flag.room.stats.parts > 2000) {
                            // Linker becomes specialized. Like other non simple.
                            flag.room.memory.simple = false;
                            flag.memory.module.push(['scientist', 1, 6]);
                        }
                        if (flag.room.stats.parts > 3500) {}
                        /*     flag.room.memory.towers = [];

                             towers = flag.room.find(FIND_MY_STRUCTURES);
                             towers = _.filter(towers, function(o) {
                                 return o.structureType == STRUCTURE_TOWER;
                             });
                             for (var i in towers) {
                                 flag.room.memory.towers.push(towers[i].id);
                             }*/

                    } else { adjustModule(flag); }
                }


                break;
            case COLOR_BLUE:
                break;
            case COLOR_CYAN:
                break;
            case COLOR_YELLOW:
                break;
            case COLOR_ORANGE:
                break;
            case COLOR_BROWN:
                break;
        }
        showInfo(flag);

    }

    function findFlagTarget(flag) {
        if (flag.room === undefined) return;
        let strucs = flag.room.find(FIND_STRUCTURES);
        let filter = [STRUCTURE_SPAWN, STRUCTURE_TOWER, STRUCTURE_LAB, STRUCTURE_LINK, STRUCTURE_POWER_SPAWN, STRUCTURE_OBSERVER, STRUCTURE_NUKER, STRUCTURE_EXTENSION];
        var test2 = _.filter(strucs, function(o) {
            return !o.pos.lookForStructure(STRUCTURE_RAMPART) && _.contains(filter, o.structureType);
        }); // Kill all structures not on rampart. 
        if (test2.length > 0) {
            flag.memory.target = test2[0].id;
        } else {
            filter = [STRUCTURE_EXTRACTOR]; // Any towers
            test2 = _.filter(strucs, function(o) {
                return !o.pos.lookForStructure(STRUCTURE_RAMPART) && _.contains(filter, o.structureType);
            });
            if (test2.length > 0) {
                flag.memory.target = test2[0].id;
            } else {
                let bads = flag.room.find(FIND_HOSTILE_CREEPS);
                bads = _.filter(bads, function(o) {
                    return !_.contains(require('foxGlobals').friends, o.owner.username);
                }); // Kill all creeps
                if (bads.length > 0) {
                    flag.memory.target = bads[0].id;
                } else {
                    test2 = _.filter(strucs, function(o) {
                        return o.structureType == STRUCTURE_SPAWN || (o.structureType === STRUCTURE_RAMPART && (o.room.storage !== undefined && o.room.storage.pos.isEqualTo(o) || o.room.terminal !== undefined && o.room.terminal.pos.isEqualTo(o)));
                    });
                    if (test2.length > 0) {
                        flag.memory.target = test2[0].id;
                    } else {
                        filter = [STRUCTURE_TOWER]; // Any towers
                        test2 = _.filter(strucs, function(o) {
                            return _.contains(filter, o.structureType);
                        });
                        if (test2.length > 0) {
                            flag.memory.target = test2[0].id;
                        } else {
                            filter = [STRUCTURE_RAMPART, STRUCTURE_ROAD]; // Any ramparts and raods
                            test2 = _.filter(strucs, function(o) {
                                return _.contains(filter, o.structureType);
                            });
                            if (test2.length > 0) {
                                flag.memory.target = test2[0].id;
                            } else {
                                filter = [STRUCTURE_STORAGE, STRUCTURE_TERMINAL]; // Anything but Storage/terminal
                                test2 = _.filter(strucs, function(o) {
                                    return !_.contains(filter, o.structureType);
                                });
                                if (test2.length > 0 && test2[0].structureType !== STRUCTURE_CONTROLLER) {
                                    flag.memory.target = test2[0].id;
                                } else {

                                }
                            }
                        }
                    }
                }
            }
        }

    }

    class buildFlags {

        static run(spawnCount) {
            let powerTotal = 0;
            let defendTotal = 0;
            Memory.clearFlag--;
            if (Memory.clearFlag < 0) {
                Memory.clearFlag = 50;
                clearFlagMemory();
            }

            let zFlags = _.filter(Game.flags, function(o) { return o.color != COLOR_GREY && o.color != COLOR_CYAN; });

            for (let a in Memory.flags) {
                if (Game.flags[a] === undefined) {
                    delete Memory.flags[a];
                }
            }

            //  }
            //o.color != COLOR_WHITE
            //           var e = zFlags.length;
            var flag;
            for (let i = 0, iMax = zFlags.length; i < iMax; i++) {
                flag = zFlags[i];

                if (flag.name === 'nuke') {

                    if (flag.memory.nukeRooms === undefined) {
                        flag.memory.nukeRooms = [];
                    }

                    
                    return;
                }
                if (flag.name === 'recontrol') {
                    flag.memory.musterType = 'recontrol';
                    flag.memory.musterRoom = 'E14S37';
                }
                if (flag.name === 'Flag27') {
                    if (flag.room.storage.store[RESOURCE_ENERGY] < 375000) {
                        flag.memory.musterType = 'hmule';
                    } else {
                        flag.memory.musterType = 'upgrademule';
                    }

                    if (flag.room.controller.level < 6 && flag.room.controller.level > 3 && flag.color !== COLOR_YELLOW) {
                        flag.memory.setColor = {
                            color: COLOR_YELLOW,
                            secondaryColor: COLOR_YELLOW,
                        };
                    } else if (flag.room.controller.level > 5 && flag.color !== COLOR_WHITE) {
                        flag.memory.setColor = {
                            color: COLOR_WHITE,
                            secondaryColor: COLOR_WHITE,
                        };
                    }
                }

                // All flags need to have a target
                if (flag.room !== undefined && flag.room.controller !== undefined && !flag.room.controller.my) {
                    let tgt = Game.getObjectById(flag.memory.target);
                    if (tgt !== null && !tgt.pos.isEqualTo(flag)) {
                        flag.setPosition(tgt.pos);
                    } else if (tgt === null) {
                        findFlagTarget(flag);
                    }
                }
                // Mineral flag that will turn off when it's fully extracted.
                if (flag.memory.mineral && flag.room !== undefined) {
                    if (flag.room.mineral !== undefined) {
                        flag.memory.mineralID = flag.room.mineral.id;
                        flag.memory.mineralType = flag.room.mineral.mineralType;
                    }
                    if (flag.room.mineral.mineralAmount === 0) {
                        flag.memory.delaySpawn = flag.room.mineral.ticksToRegeneration-150;
                    }
                } 

                // Flag Delay Spawning Function.
                if (flag.memory.delaySpawn !== undefined) {
                    if (flag.memory.delaySpawn > 0) {
                        flag.memory.delaySpawn--;

                        if (flag.memory.color !== COLOR_BROWN) {
                            flag.memory.setColor = {
                                color: COLOR_BROWN,
                                secondaryColor: COLOR_WHITE,
                            };
                        }
                    } else if (flag.color === COLOR_BROWN) {
                        if (flag.memory.color !== COLOR_YELLOW) {
                            flag.memory.setColor = {
                                color: COLOR_YELLOW,
                                secondaryColor: COLOR_YELLOW,
                            };
                        }
                    }
                }
                if (flag.memory.musterType !== undefined && flag.room !== undefined && flag.memory.musterType !== 'none') {
                    //flag.room.visual.
                    flag.room.visual.text(flag.memory.musterType, flag.pos.x, flag.pos.y);
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
                        if (flag.room.controller.level > 5) {
                            flag.remove();
                        }
                    }

                    if (flag.memory.musterType === 'thirdWave') {
                        // THis is the buildWave wave.
                        let sites = flag.room.find(FIND_CONSTRUCTION_SITES);
                        if (sites.length === 0) {
                            flag.memory.musterType = 'secondWave';
                            flag.memory.party = undefined;
                        }
                        if (flag.room.controller.level > 5) {
                            flag.remove();
                        }
                    }
                }



                // Make sure the flag is set this color.
                if (flag.memory.setColor !== undefined && flag.memory.setColor.color !== flag.color) {
                    flag.setColor(flag.memory.setColor.color, flag.memory.setColor.secondaryColor);
                } else {
                    flag.memory.setColor = undefined;
                }

                switch (flag.secondaryColor) {

                    case COLOR_PURPLE:
                        rampartThings(flag);
                        break;
                    case COLOR_WHITE:
                        //                        removeRA(flag);
                        break;
                    case COLOR_RED:
                        if (flag.room === undefined) {
                            flag.memory.rallyFlag = 'home';
                        }
                        var power = require('commands.toPower');
                        if (Memory.showInfo > 1)
                            powerTotal++;
                        power.calcuate(flag);
                        break;

                    case COLOR_BROWN:
                        if (flag.room !== undefined) {

                            let res = flag.room.lookAt(flag.pos.x, flag.pos.y);
                            if (res.length > 0) {
                                for (let ee in res) {
                                    if (res[ee].structure !== undefined && (res[ee].structureType !== STRUCTURE_CONTROLLER)) {
                                        flag.memory.target = res[ee].structure.id;
                                        break;
                                    }
                                }
                            }

                            let tgt = Game.getObjectById(flag.memory.target);

                            if (tgt !== null && !tgt.pos.isEqualTo(flag)) {
                                flag.setPosition(tgt.pos);
                            } else if (tgt === null) {
                                flag.memory.target = undefined;
                            }

                            if (flag.memory.target === undefined || tgt === null) {
                                findFlagTarget(flag);
                            }
                        }
                        // Lets add some targets to next
                        break;
                    case COLOR_ORANGE: // This color is for squad running, leave empty due to it being to the creep.run role;
                        var squad;
                        //                   if (flag.memory.squadID === undefined || flag.memory.squadID.length !== flag.memory.totalNumber) {
                        // This is setup by the commands.toParty.rally section.
                        ///                      } else {
                        squad = _.filter(Game.creeps, function(o) {
                            return o.memory.party === flag.name;
                        });
                        if (squad !== undefined && squad.length > 0) {
                            if (squad.length === 1 && flag.room !== undefined) {
                                /*
                                let strucs = flag.room.find(FIND_STRUCTURES);

                                var towers = _.filter(strucs, function(o) {
                                    return o.structureType == STRUCTURE_TOWER && o.energy > 0;
                                });
                                var spawns = _.filter(strucs, function(o) {
                                    return o.structureType == STRUCTURE_SPAWN;
                                });
                                var bads = squad[0].room.find(FIND_CREEPS);
                                bads = _.filter(bads, function(o) {
                                    return !_.contains(require('foxGlobals').friends, o.owner.username);
                                });
                                if (spawns.length === 0 && bads.length === 0) {
                                    flag.memory.party = [
                                        ['fighter', 2, 10]
                                    ];
                                }
                                if (spawns.length === 0 && bads.length === 0 && towers.length === 0) {
                                    flag.memory.party = [
                                        ['fighter', 2, 10],

                                    ];
                                } */
                                // Kill all structures not on rampart.                                 
                                // Here we can analyze the room for changes in how squad is setup. 
                                // If no spawns.
                                // When do we determine if there is no more healing needed?
                                // If no towers.
                                // When do we determine if we need to start controller?
                                // When room is uncontrolled we are done.

                            }
                            require('commands.toSquad').runSquad(squad);
                        } else {
                            flag.memory.setColor = {
                                color: COLOR_YELLOW,
                                secondaryColor: COLOR_YELLOW
                            };
                        }

                        // Here we determine targets for the flag. 

                        flag.memory.killBase = false; // Always false - we don't turn this on until. 

                        if (flag.room !== undefined) {

                            if (flag.memory.nextTargets.length > 0) {
                                if (flag.memory.target === undefined) {
                                    flag.memory.target = flag.memory.nextTargets.shift();
                                }
                                // Visualization of X's.
                                let zzzzz = Game.getObjectById(flag.memory.target);
                                if (zzzzz === null) {
                                    flag.memory.target = flag.memory.nextTargets.shift();
                                }
                            }
                            if (flag.memory.target === undefined && flag.memory.nextTargets.length === 0) {
                                // Setting up target
                                let res = flag.room.lookAt(flag.pos.x, flag.pos.y);
                                for (var ee in res) {
                                    if (res[ee].structure !== undefined) {
                                        flag.memory.target = res[ee].structure.id;
                                        break;
                                    }
                                }
                                // Lets add some targets to next
                                if (flag.memory.target === undefined) findFlagTarget(flag);
                            }
                            /*
                             let bads = flag.room.find(FIND_HOSTILE_CREEPS);
                                            bads = _.filter(bads, function(o) {
                                                return !_.contains(require('foxGlobals').friends, o.owner.username);
                                            }); // Kill all creeps
                                            if (bads.length > 0) {
                                                flag.memory.target = bads[0].id;
                                            } */

                            let zz = Game.getObjectById(flag.memory.target);
                            let strng = "";

                            if (zz === null) {
                                flag.memory.target = undefined;
                                flag.memory.attackDirection = false;
                            } else if (!flag.pos.isEqualTo(zz)) {
                                flag.setPosition(zz.pos);
                            } else if (zz !== null) { // Visualization of hp and stuff.
                                if (zz.room !== undefined && zz.room.memory.targetLastHits !== undefined) {
                                    let tmp = zz.hits - zz.room.memory.targetLastHits;
                                    strng = zz.hits + "/" + tmp + "=" + (tmp === 0 ? 0 : Math.ceil((zz.hits / (tmp)) * -1));
                                    zz.room.visual.text(strng, zz.pos.x + 1, zz.pos.y, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT });
                                }
                                if (zz.room !== undefined)
                                    zz.room.memory.targetLastHits = zz.hits;
                            }

                        }

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

                        // squad color is orange, it occurs when a squad is at the rally(yellow) flag. 

                    case COLOR_ORANGE:
                        let squade = _.filter(Game.creeps, function(o) {
                            return o.memory.party === flag.name;
                        });
                        if (squade !== undefined && squade.length === 0) {
                            flag.memory.setColor = {
                                color: COLOR_YELLOW,
                                secondaryColor: COLOR_YELLOW
                            };
                        }

                        break;

                    case COLOR_BLUE:

                        let guard = flag;
                        if (guard.memory.guardCreateCount === undefined) {
                            guard.memory.guardCreateCount = 0;
                        }

                        guard.memory.guardCreateCount--;
                        if (guard.memory.guardCreateCount < 0) {
                            guard.memory.guardCreateCount = delayBetweenScan;
                            require('commands.toGuard').create(flag);
                        }
                        break;

                    case COLOR_YELLOW:
                        // This will mean power flag if it's green/red.
                        let rally = flag;
                        //if (flag.name.substr(0, 5) == 'power') {
                        //  flag.memory.power = true;
                        //    flag.setColor(flag.color, COLOR_RED);
                        //}
                        if (flag.memory.squadLogic === undefined) {
                            flag.memory.squadLogic = false;
                        }
                        if (flag.memory.nextTargets === undefined) {
                            flag.memory.nextTargets = [];
                        }


                        if (flag.name == 'bandit') {

                            flag.memory.rallyFlag = 'home';
                            /*                            if (flag.memory.timer === undefined) {
                                                            flag.memory.timer = 1200;
                                                        }
                                                        flag.memory.timer--;
                                                        if (flag.memory.timer < 0) {
                            //                                flag.remove();
                                                        } */
                            //                            console.log("Bandit set @ room:", roomLink(flag.pos.roomName));
                            if (flag.room !== undefined) {
                                // So here we check if we remove the flag
                                // We first give it an 1500 timer.
                                var strucd = flag.room.find(FIND_STRUCTURES);
                                var testz2 = _.filter(strucd, function(o) {
                                    return o.structureType === STRUCTURE_CONTAINER;
                                });

                                // Start countingdown to see if bandits have failed to kill caravan.
                                if (flag.memory.countDown === undefined) {
                                    flag.memory.countDown = 1000;
                                }
                                flag.memory.countDown--;
                                if (flag.memory.countDown < 0 && testz2.length === 0) {
                                    flag.remove();
                                }

                                // Now we check to see if the containers are empty and
                                var testz3 = _.filter(strucd, function(o) {
                                    return o.structureType === STRUCTURE_CONTAINER && o.total === 0;
                                });
                                //                                console.log('Bandit room available, containers found:', testz2.length, "emp:", testz3.length, flag.memory.timer);
                                if (testz2.length !== 0 && testz2.length == testz3.length) {
                                    flag.remove();
                                }
                                var cara = _.filter(flag.room.find(FIND_CREEPS), function(o) {
                                    return o.owner.username == 'Screeps';
                                });
                                if (testz2.length > 0 && cara.length === 0) {
                                    for (var eae in flag.memory.party) {
                                        if (flag.memory.party[eae][1] > 0 && flag.memory.party[eae][0] !== 'thief') {
                                            flag.memory.party[eae][1] = 0;
                                        }
                                    }

                                    _.map(flag.room.find(FIND_MY_CREEPS), function(o) {
                                        if ((o.memory.role == 'fighter' || o.memory.role == 'mage') && o.memory.party == flag.name) {
                                            o.memory.death = true;
                                        }
                                    });

                                }

                            }
                        }


                        if (rally !== undefined) {
                            if (rally.memory.rallyCreateCount === undefined) {
                                rally.memory.rallyCreateCount = 0;
                            }
                            //                            if(Game.cpu.bucket > 600)
                            rally.memory.rallyCreateCount--;
                            if (rally.memory.rallyCreateCount < 0) {
                                party.create(flag, spawnCount);
                                rally.memory.rallyCreateCount = delayBetweenScan;
                            }
                        }

                        party.rally(flag);
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

    // 11,14 E25S74