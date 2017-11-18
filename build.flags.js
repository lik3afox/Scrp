    var party = require('commands.toParty');
    var FLAG = require('foxGlobals');
    var delayBetweenScan = 3;

    function doDefendThings(flag) {
        if (flag.room === undefined) return;

        // = _.filter(flag.room.hostileInRoom(),function(o){return o.owner.username == 'Invader'} ) ;
        // FIND_HOSTILE_CREEPS //flag.room.hostileInRoom()
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
            flag.room.memory.invasionFlag = flag.name;

            creeps = flag.pos.findInRange(FIND_MY_CREEPS, 15);
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
                    flag.memory.invadeDelay = 2000;

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
                    flag.memory.invadeDelay = 2000;
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
        scientist    : undefined,
        wallwork : undefined,
        spawn : undefined,
        upgrade : undefined,
        //           
        /*            linker   : undefined,
*/
        wait:undefined,
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
        console.log('SUCIDE FIND', screeps.length);
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
            case "upgrader":
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1 && flag.room.controller.level !== 8) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {
                    if(flag.room.controller.level === 8){
                        flag.memory.module.splice(ez,1);
                    }
                }
                break;
            case 'upbuilder':
                // Harvest Checking
                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
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
                break;
            case 'lab':
                // Find lab that is within two distance of storage and terminal.
                if (flag.room.storage === undefined || flag.room.terminal === undefined) break;

                zzz = flag.room.find(FIND_MY_STRUCTURES);
                zzz = _.filter(zzz, function(structure) {
                    return (structure.structureType == STRUCTURE_LAB && structure.pos.inRangeTo(flag.room.storage, 2) && structure.pos.inRangeTo(flag.room.terminal, 2));
                });

                if (zzz.length > 0) {
                    console.log(flag, 'FOUND MasterLab', zzz[e].structureType);
                    flag.room.memory.boostLabID = zzz[e].id;
                }

                break;

            case 'linker':

                if (flag.room.storage === undefined) break;

                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {

                }

                if (flag.room.controller.level < 5) break;

                zzz = flag.room.find(FIND_MY_STRUCTURES);
                zzz = _.filter(zzz, function(structure) {
                    return (structure.structureType == STRUCTURE_LINK && structure.pos.inRangeTo(flag.room.storage, 2));
                });

                if (zzz.length > 0) {
                    console.log(flag, 'FOUND masterLink', zzz[e].structureType);
                    flag.room.memory.masterLinkID = zzz[e].id;
                }


                break;

            case "wait":
                flag.memory.checkWhat = -10;
            break;
            case 'power':
                if (flag.room.controller.level === 8 && flag.room.memory.powerspawnID === undefined)
                    console.log(roomLink(flag.pos.roomName), 'FINDING SPAWN' + flag.room.powerspawn);
                break;
            case 'nuke':
                if (flag.room.controller.level === 8 && flag.room.memory.nukeID === undefined)
                    console.log(roomLink(flag.pos.roomName), 'Finding Nuke' + flag.room.nuke);
                break;
            case 'spawn':
                // This will setup the spawns.
                console.log('FINDING spawn');
                zzz = flag.room.find(FIND_MY_STRUCTURES);
                zzz = _.filter(zzz, function(structure) {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                        structure.structureType == STRUCTURE_SPAWN ||
                        structure.structureType == STRUCTURE_TOWER ||
                        structure.structureType == STRUCTURE_LAB ||
                        structure.structureType == STRUCTURE_POWER_SPAWN
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
                } else if(Game.shard.name === 'shard1'){
switch(flag.memory.module[ez][_level]){
    case 0:
    if(roomEnergy >= 1250){ // At room controller lv 4 and extensions, with walls or ramparts
                                    let vr = flag.room.find(FIND_STRUCTURES, {
                                        filter: s => s.structureType == STRUCTURE_WALL || s.structureType == STRUCTURE_RAMPART
                                    });
                                    if(vr.length > 0){
                                        flag.memory.module[ez][_level] = 2;
                                        flag.memory.module[ez][_number] = 1;
                                    }
    }
    break;
    case 2:
    if(roomEnergy >= 1750){
        flag.memory.module[ez][_level] = 3;
    }
    break;
    case 3:
    if(roomEnergy >= 2250){
        flag.memory.module[ez][_level] = 4;
    }
    break;
    case 4:
    if(roomEnergy >= 3250){
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
                    // flag.memory.module[ez][_number] = 2; Number gets reduced by scientist coming.

                    switch (flag.memory.module[ez][_level]) {
                        case 0:
                            if (roomEnergy >= 550) {
                                flag.memory.module[ez][_level] = 1;
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

                    if (flag.memory.module[ez][_number] === 0) {
                        let vr = flag.room.find(FIND_STRUCTURES, {
                            filter: s => s.structureType == STRUCTURE_SPAWN && s.memory.alphaSpawn
                        });

                        if (vr.length > 0) {
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
                } else if(Game.shard.name === 'shard1'){
                    if (flag.memory.module[ez][_level] === 0 && flag.room.memory.mineralContainID !== undefined && flag.room.memory.mineralID !== undefined && flag.room.memory.extractID !== undefined) {
                        flag.memory.module[ez][_level] = 4;
                        flag.memory.module[ez][_number] = 1;
                        flag.memory.module[_.findIndex(flag.memory.module, function(o) { return o[_name] == 'first'; })][_number] = 1;
                        stopRebirth(flag.room,'first');
                    }
                    switch( flag.memory.module[ez][_level] ){
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
                                console.log(flag, 'FINDING mineral');
                                // mineralContainID, mineralID, extractID

                                if (flag.room.memory.mineralID === undefined) {
                                    let vr = flag.room.find(FIND_MINERALS);
                                    flag.room.memory.mineralID = vr[0].id;
                                }
                                if (flag.room.memory.extractID === undefined) {
                                    let vr = flag.room.find(FIND_STRUCTURES, {
                                        filter: s => s.structureType == STRUCTURE_EXTRACTOR
                                    });
                                    flag.room.memory.extractID = vr[0].id;
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
                                    flag.memory.module[ez][_number] = 1;
                                }

                            }
                            break;
                    }
                }
                break;
            case 'harvester':
                // Harvest Checking
                console.log(roomLink(flag.room.name), 'FINDING harvester');

                ez = _.findIndex(flag.memory.module, function(o) { return o[_name] == ee; });
                if (ez === -1) {
                    flag.memory.module.push([ee, 0, 0]);
                } else {


                    if (flag.memory.module[ez][_level] < 3) {
                        console.log(flag.memory.module[ez][_name], 'Lvl:', flag.memory.module[ez][_level], 'Num', flag.memory.module[ez][_number]);

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

        // Linker Checking

        // First Checking

        // Upgrader Checking

        // Defender Checking


    }

    var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT, backgroundColor: '#0F0F0F' };
    var _name = 0;
    var _number = 1;
    var _level = 2;

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
                        //flag.room.visual.text(report, xx, ++yy,font); 

                    }
                }
                break;

            case COLOR_RED:
                flag.room.visual.text('Hard Setting Memory', flag.pos.x + 1.5, flag.pos.y, font);
                break;
            case COLOR_GREEN:
                if (flag.memory.module !== undefined && flag.memory.module.length !== 0) {

                    var zze = Object.keys(roomer)[flag.memory.checkWhat];

                    flag.room.visual.text('Module:' + flag.memory.alphaSpawn + ' Status:' + flag.memory.checkWhat + zze, flag.pos.x + 1.5, flag.pos.y - 1, font);
                    var x = flag.pos.x + 1.5;
                    var y = flag.pos.y;
                    for (e in flag.memory.module) {
                        var outThere;
                        if (Memory.spawnCount[flag.memory.alphaSpawn][flag.memory.module[e][_name]] !== undefined) {
                            outThere = Memory.spawnCount[flag.memory.alphaSpawn][flag.memory.module[e][_name]].count;
                        } else {
                            outThere = 0;
                        }

                        flag.room.visual.text('Role :' + flag.memory.module[e][_name] + '(Lv:' + flag.memory.module[e][_level] + ') #:' + outThere + '/' + flag.memory.module[e][_number], x, y, font);
                        y++;
                    }
                } else {
                    flag.room.visual.text('Fail Module, is Flag name === Room name?', flag.pos.x + 1.5, flag.pos.y, font);
                }
                break;

        }
    }

    function whiteflag(flag) {
        if (flag.memory.checkWhat === undefined) {
            flag.memory.checkWhat = -10;
        }
        if(flag.secondaryColor === COLOR_GREEN)
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
                break;
            case COLOR_GREEN:
                // Runs off of flag memory. 
                // This color also means that it's pulled as module for build.spaw
                if (flag.memory.checkWhat >= 0)
                    adjustModule(flag);
                break;

            case COLOR_RED:
                hardSetMemory(flag);
                break;
            case COLOR_PURPLE:
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

    class buildFlags {

        static run() {

            let powerTotal = 0;
            let defendTotal = 0;
            if (Memory.clearFlag === undefined) Memory.clearFlag = 500;
            Memory.clearFlag--;
            if (Memory.clearFlag < 0) {
                Memory.clearFlag = 50;
                clearFlagMemory();
            }

            let zFlags = _.filter(Game.flags, function(o) {
                return o.color != COLOR_GREY && o.color != COLOR_CYAN;
            });
            //o.color != COLOR_WHITE
            var e = zFlags.length;
            var flag;
            while (e--) {
                flag = zFlags[e];

                switch (flag.color) {
                    case COLOR_WHITE:
                        whiteflag(flag);
                        break;

                    case COLOR_RED:
                        doDefendThings(flag);
                        if (Memory.showInfo > 1)
                            defendTotal++;
                        break;

                    case FLAG.PARTY:
                        if (flag.memory.formation === undefined) {
                            flag.memory.formation = [];
                        }
                        if (flag.memory.wallTarget === undefined) {
                            flag.memory.wallTarget = 'none';
                        }
                        if (flag.memory.wallTarget !== 'none') {
                            if (flag.room !== undefined) { // Only do this if room is visable. 
                                var target = Game.getObjectById(flag.memory.wallTarget);
                                //                                console.log('wall trying to find, ', target, target.hits, target.pos);
                                if (target === null) {
                                    var struc = flag.room.find(FIND_STRUCTURES);
                                    var bads;

                                    var test2 = _.filter(struc, function(o) {
                                        return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && !o.pos.lookForStructure(STRUCTURE_RAMPART);
                                    }); // This is something is not on a 

                                    if (test2.length !== 0) {
                                        var close = flag.pos.findClosestByRange(test2);
                                        flag.memory.wallTarget = close.id;
                                        flag.setPosition(close.pos);
                                    }
                                    // thing is dead and get a new target.
                                } else {
                                    console.log('attacking', target, 'hp:', target.hits);
                                    // Thing is still alive
                                }
                            }

                        }
                        if (flag.memory.formation.length === 0) {
                            var Party = {
                                role: 'none',
                                posistion: 1,
                                number: 1
                            };
                            flag.memory.formation.push(Party);
                        }
                        break;

                    case FLAG.GUARD:

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

                    case FLAG.RALLY:
                        // This will mean power flag if it's green/red.
                        let rally = flag;
                        if (flag.secondaryColor == COLOR_RED) {
                            var power = require('commands.toPower');
                            if (Memory.showInfo > 1)
                                powerTotal++;
                            power.calcuate(flag);
                        }

                        if (flag.secondaryColor == COLOR_PURPLE) {
                            rampartThings(flag);
                        }
                        if (flag.secondaryColor == COLOR_WHITE) {
                            removeRA(flag);
                        }
                        if (flag.name == 'Flag27') {
                            if (flag.room.storage.store[RESOURCE_ENERGY] < 100000) {
                                flag.memory.musterType = 'hmule';
                            } else {
                                flag.memory.musterType = 'upgrademule';
                            }
                        }


                        if (rally !== undefined) {
                            if (rally.memory.rallyCreateCount === undefined) {
                                rally.memory.rallyCreateCount = 0;
                            }
                            rally.memory.rallyCreateCount--;
                            if (rally.memory.rallyCreateCount < 0) {
                                party.create(flag);
                                party.rally(flag);
                                rally.memory.rallyCreateCount = delayBetweenScan;
                            }
                        }

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