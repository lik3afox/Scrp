function returnClosestRoom(roomName) {
    var distance = 100;
    var spawn;
    for (var e in Game.spawns) {
        if (Game.spawns[e].memory.alphaSpawn) {
            if (Game.spawns[e].room.name === 'E14S37') {
                var tempDis = Game.map.getRoomLinearDistance(roomName, Game.spawns[e].room.name);
                if (tempDis < distance) {
                    distance = tempDis;
                    spawn = Game.spawns[e];
                }
            }
        }
    }
    return spawn;
}


function scanForRemoteSources() {
    var observer = require('build.observer');

    if (Game.flags.remote === undefined && Game.flags.mineral === undefined) return false;
    let flag = Game.flags.remote;
    if (flag !== undefined) {
        if (flag.memory.spawnRoom === undefined) {
            var zz;

            flag.memory.spawnRoom = 'none';
        }
        if (flag.room === undefined) {

            observer.reqestRoom(flag.pos.roomName, 5);
        } else {
            if (flag.memory.spawnRoom === 'none') {
                flag.room.visual.text('SETROOM', flag.pos);
            } else {
                let source = flag.room.find(FIND_SOURCES);
                let room = Game.rooms[flag.memory.spawnRoom];
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
                                miner: false,
                                transport: false,
                                expLevel: 4
                            };
                            if (parseInt(eee) === 0 && source[eee].room.controller !== undefined) {
                                BUILD.controller = false;
                            }
                            remote.push(BUILD);
                            //                            console.log('RRRemote added', BUILD.source, '@', BUILD.sourcePos, spwn[0].room.name, 'Lvl:', BUILD.expLevel, remote.length);
                        }
                    }

                    flag.memory.spawnRoom = 'none';
                    flag.remove();
                }

            }
        }

    }

    flag = Game.flags.mineral;
    if (flag !== undefined) {

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
                                mineral: false,
                                ztransport: false,
                                expLevel: 10
                            };
                            if (parseInt(eee) === 0 && source[eee].room.controller !== undefined) {
                                BUILD.controller = false;
                            }
                            remote.push(BUILD);
                            //                            console.log('Minearl added', BUILD.source, '@', BUILD.sourcePos, spwn[0].room.name, 'Lvl:', BUILD.expLevel, remote.length);
                        }
                    }

                    flag.memory.spawnRoom = 'none';
                    flag.remove();
                }
            }

        }
    }
}

function scanForCleanRoom() {
    if (Game.flags.clearRoom === undefined && Game.flags.clearRoom === undefined) return false;
    var room = Game.flags.clearRoom.room;
    if (room === undefined) return false;
    var stru = room.find(FIND_STRUCTURES);
    var test2 = _.filter(stru, function(o) {
        return o.structureType !== STRUCTURE_NUKER && o.structureType !== STRUCTURE_STORAGE && o.structureType !== STRUCTURE_TERMINAL && o.structureType !== STRUCTURE_CONTROLLER;
    });
    for (let a in test2) {
        test2[a].destroy();

    }
    if (test2.length === 0) Game.flags.clearRoom.remove();


}

function whoWorksFor(goal) {
    var keys = Object.keys(Game.creeps);
    var a = keys.length;
    var e;
    while (a--) {
        e = keys[a];
        if (Game.creeps[e].memory.goal == goal) {
            //            console.log(goal, Game.creeps[e].memory.home, Game.creeps[e].name, Game.creeps[e].memory.role, Game.creeps[e].pos, "lvl:", Game.creeps[e].memory.level);
        }
    }
}



function rampartCheck(spawn) {
    var HardD = ['E35S83'];

    var fox = require('foxGlobals');

    let targets = spawn.room.find(FIND_HOSTILE_CREEPS);
    targets = _.filter(targets, function(object) {
        return (object.owner.username != 'Invader' && !_.contains(fox.friends, object.owner.username));
    });
    //var www = spawn.room.find(FIND_CREEPS);
    /*www = _.filter(targets,function(o){
        return (object.owner.username != 'likeafox');
    }); */
    if (targets.length === 0) return;
    let e = targets.length;
    let named2 = 'RA2' + spawn.room.name;
    let named = 'rampartD' + spawn.room.name;
    let named3 = 'RA3' + spawn.room.name;
    let structures = spawn.room.find(FIND_STRUCTURES);
    while (e--) {

        /*            let nearRampart = targets[e].pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: object => (object.structureType == 'rampart')
                    });  */
        let nearRampart = _.filter(structures, function(o) {
            return o.structureType == 'rampart' && o.pos.isNearTo(targets[e]);
        });
        if (nearRampart.length > 0) {
            for (var a in nearRampart) {
                if (Game.flags[named] === undefined) {

                    spawn.room.createFlag(nearRampart[a].pos, named, COLOR_YELLOW, COLOR_PURPLE);
                } else {
                    // It exists,but does it have any bad guys? If not then relocatie
                    if (Game.flags[named] !== undefined) {
                        var neat = Game.flags[named].pos.findInRange(targets, 1);
                        if (neat.length === 0) {
                            if ((Game.flags[named2] === undefined ||
                                    (Game.flags[named2] !== undefined && !Game.flags[named2].pos.isEqualTo(nearRampart[a].pos)) &&

                                    (Game.flags[named3] === undefined ||
                                        (Game.flags[named3] !== undefined && !Game.flags[named3].pos.isEqualTo(nearRampart[a].pos))))) {
                                Game.flags[named].setPosition(nearRampart[a].pos);
                            }
                        }
                    }




                    if (Game.flags[named2] === undefined) {


                        if (Game.flags[named].memory.invaderTimed !== undefined &&
                            Game.flags[named].memory.invaderTimed > 15) {

                            if (!nearRampart[a].pos.isEqualTo(Game.flags[named].pos))
                                spawn.room.createFlag(nearRampart[a].pos, named2, COLOR_YELLOW, COLOR_WHITE);
                        } else {
                            if (!nearRampart[a].pos.isEqualTo(Game.flags[named].pos))
                                spawn.room.createFlag(nearRampart[a].pos, named2, COLOR_YELLOW, COLOR_WHITE);
                        }
                    } else {
                        if (_.contains(HardD, spawn.room.name)) {
                            // First we look for walls below 2 mil
                            // If any are there
                            // We see if any flags are on the ramparts next to it.
                            // If there isn't place a flag.
                            weakWalls = _.filter(structures, function(o) {
                                return o.structureType == STRUCTURE_WALL && o.hits < 2000000;
                            });
                            if (weakWalls.length > 0) {
                                if (Game.flags[named3] === undefined) {
                                    for (var ee in weakWalls) {
                                        var wall = weakWalls[ee];
                                        let closeRamps = _.filter(structures, function(o) {
                                            return o.structureType == 'rampart' && o.pos.isNearTo(wall);
                                        });
                                        for (var eee in closeRamps) {
                                            if (!closeRamps[eee].pos.isEqualTo(Game.flags[named2]) && !closeRamps[eee].pos.isEqualTo(Game.flags[named])) {
                                                spawn.room.createFlag(nearRampart[a].pos, named3, COLOR_YELLOW, COLOR_WHITE);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

function safemodeCheck(spawn) {
    var fox = require('foxGlobals');

    if (spawn.room.name == 'W53S35') {
        var targetss = spawn.room.find(FIND_HOSTILE_CREEPS);
        targetss = _.filter(targetss, function(object) {
            return (object.owner.username != 'Invader' && !_.contains(fox.friends, object.owner.username) && (object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0));
        });
        if (targetss > 0) {
            spawn.room.controller.activateSafeMode();
        }
    }
    if (spawn.room.controller.level !== 8) return;
    var targets = spawn.room.find(FIND_HOSTILE_CREEPS, 1);
    targets = _.filter(targets, function(object) {
        return (object.owner.username != 'Invader' && !_.contains(fox.friends, object.owner.username));
    });
    if (targets.length > 1) {
        var ramp = spawn.room.find(FIND_STRUCTURES);
        ramp = _.filter(ramp, function(o) {
            return (o.structureType === STRUCTURE_RAMPART || o.structureType === STRUCTURE_WALL) && o.hits < 500000;
        });
        if (ramp.length > 1) {
            if (targets.length > 0 && spawn.room.controller.safeModeCooldown === undefined) {
                spawn.room.controller.activateSafeMode();
                if (Game.flags.safemode === undefined) {
                    spawm.room.createFlag(25, 25, 'safemode', COLOR_YELLOW, COLOR_YELLOW);
                }
            }
        }

    }
}

function doUpgradeRooms() { //5836b82d8b8b9619519f19be
    if (Memory.war)
        return;
    if (Game.shard.name !== 'shard1') return;

    // Lets count how many ticks left for enhanced upgrading.
    if (Memory.stats.playerTrade === undefined) {
        Memory.stats.playerTrade = {};
    }


    if (Game.flags.upgradeRoom !== undefined) {
        let flag = Game.flags.upgradeRoom;
        let room = flag.room;
        if (room.controller.level > 3) {
            //            if (room.controller.level > 5) {
            let total = room.storage.store[RESOURCE_ENERGY] + room.terminal.store[RESOURCE_ENERGY];
            room.visual.text(total, room.storage.pos);
            if (total > 1200000) {
                flag.memory.party[0][1] = 4;
            } else if (total > 1100000) {
                flag.memory.party[0][1] = 3;
            } else if (total > 900000) {
                flag.memory.party[0][1] = 2;

            } else if (total > 700000) {
                flag.memory.party[0][1] = 1;
            } else if (total > 500000) {
                flag.memory.party[0][1] = 1;
            }
        }
        //}

    }

    let spwns = ['5a03400a3e83cd1e5374cf65']; //,''
    if (Game.flags.recontrol !== undefined) return;
    var e = spwns.length;
    while (e--) {
        let spawn = Game.getObjectById(spwns[e]);
        if (spawn === null) return;

        let control = spawn.room.controller;
        if (control.level < 7) return;



        if (control.progress > 9000000) {
            if (Game.flags.recontrol === undefined) {
                var targets = spawn.room.find(FIND_MY_CREEPS);
                targets = _.filter(targets, function(object) {
                    return (object.memory.boosted && object.memory.role == 'Aupgrader');
                });

                var total = 0;
                for (var ze in targets) {
                    total += targets[ze].ticksToLive;
                }
                var limit = 4000;
                spawn.room.visual.text(total + "/" + limit, spawn.room.storage.pos.x, spawn.room.storage.pos.y, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                if (total > limit) {
                    spawn.room.createFlag(control.pos, 'recontrol', COLOR_YELLOW);
                }
            }

        } else if (control.level === 8 || control.progress > 10900000) {
            spawn.room.createFlag(control.pos, 'recontrol', COLOR_YELLOW);
        }
    }
}


function isBoost(body) {
    for (var e in body) {

        if (body[e].boost !== undefined)
            return true;
    }
    return false;
}

function analyzeHostiles(bads) {
    var report = {};
    var boost = 0;
    for (var e in bads) {
        var bad = bads[e];
        if (isBoost(bad.body)) {
            boost++;
        }
    }
    var fox = require('foxGlobals');

    //    if (Memory.testing === undefined) {
    //        var message = _.toString(boost + ':boost ' + bads.length + ':Bad guys found @' + bads[0].room + 'from:' + bads[0].owner.username);
    //        Game.notify(message);
    //      Memory.testing = 1;
    //    }
    //    console.log(boost, ':boost ', bads.length, ':Bad guys found @', bads[0].room, 'from:', bads[0].owner.username);
    if (bads.length > 0 && !_.contains(fox.friends, bads[0].owner.username)) {}
    return {};
}

function doRoomReport(room) {



    if (room.name == 'E14S38') return;
    var fox = require('foxGlobals');

    bads = room.find(FIND_HOSTILE_CREEPS);
    bads = _.filter(bads, function(creep) {
        return (!_.contains(fox.friends, creep.owner.username));
    });
    var numBads = bads.length;
    if (numBads > 0 && bads[0].owner.username !== 'Invader') {
        var report = analyzeHostiles(bads); // Here we get a report of the bads.
        room.memory.alert = true; // This will force walls/ramparts to start looking at damage.
    } else {
        room.memory.alert = false;
    }

    var nuke = room.find(FIND_NUKES);
    if (nuke.length > 0) {
        console.log('NUKE INCOMING @' + nuke[0].room + ' from:');
        room.memory.nukeIncoming = true;
        Game.notify('NUKE INCOMING @' + nuke[0].room + ' from:');
    }

    if (room.controller.level > 3) {

        var goods = room.find(FIND_MY_CREEPS);
        if (goods.length <= 2) {
            for (var i in goods) {
                if (goods[i].memory.role == 'linker') {
                    goods[i].memory.role = 'first';
                    goods[i].memory.reportDeath = true;
                } else if (goods[i].memory.role == 'homeDefender') {
                    goods[i].memory.death = true;
                }
            }
            if (room.energyAvailable >= 300) {
                var zz = room.alphaSpawn.spawnCreep([CARRY, CARRY, MOVE, MOVE, CARRY, CARRY], 'emegyfir' + Math.floor(Math.random() * 100), {
                    memory: {
                        role: 'first',
                        roleID: 0,
                        //                        home: room.pos.roomName,
                        parent: "none",
                        level: 3
                    }
                });
            }

        }
    }

}

function consoleLogReport() {
    //        if(Game.shard.name !== 'shard1') return;
    let report = "";
    for (let a in Memory.shardNeed) {
        report += " " + Memory.shardNeed[a];
    }

    let color = '<a style="color:#0afaff">';
    let endColor = '</a>';
    let shard = Game.shard.name;
    let segmentNumUsed = Memory.shardNeed.length;
    segmentNumUsed = JSON.stringify(segmentNumUsed).padStart(2, "0");
    let powerProcessed = Memory.stats.powerProcessed;
    if (powerProcessed === undefined) powerProcessed = 0;
    let segmentsUsed = report;
    let gameTime = Game.time;
    gameTime = JSON.stringify(gameTime).padStart(8, "0");
    let creepTotal = Memory.creepTotal;
    creepTotal = JSON.stringify(creepTotal).padStart(3, "0");
    //let cpuUsed = dif;
    let cpuLimit = Game.cpu.limit;
    cpuLimit = JSON.stringify(cpuLimit).padStart(3, "0");
    let cpuCeil = Game.cpu.tickLimit;
    cpuCeil = JSON.stringify(cpuCeil).padStart(3, "0");
    let cpuBucket = Game.cpu.bucket;
    cpuBucket = JSON.stringify(cpuBucket).padStart(5, "0");
    let filler = "###" + Game.shard.name + "###";
    switch (Game.shard.name) {
        case "shard0":
            color = '<a style="color:#00aaff">';
            filler = "!!!" + Game.shard.name + "!!!";
            break;
        case "shard1":
            break;
        case "shard2":
            color = '<a style="color:#aaaaff">';
            filler = "%%%" + Game.shard.name + "%%%";
            break;
    }
    if (Game.cpu.getHeapStatistics !== undefined) {
        console.log(color + shard + "[" + ticksInARow + "]" + filler + "  Tick #" + gameTime + "  Total Creeps:(" + creepTotal + ") Bucket: " + cpuBucket + " " + cpuLimit + "/" + cpuCeil + filler + " Seg#" + segmentNumUsed + " PP:" + powerProcessed + "#" + (`Used ${Game.cpu.getHeapStatistics().total_heap_size} / ${Game.cpu.getHeapStatistics().heap_size_limit}`));
    } else {

        console.log(color + shard + filler + "  Tick #" + gameTime + "  Total Creeps:(" + creepTotal + ") Bucket: " + cpuBucket + " " + cpuLimit + "/" + cpuCeil + filler + " Seg#" + segmentNumUsed + " PP:" + powerProcessed);

    }

}

function doRoomVisual(room) {
    if (Memory.stats.totalMinerals === undefined) return;

    if (room.memory.labMode !== undefined &&
        room.memory.labMode.substr(0, 5) === 'shift') {

        room.visual.text(room.memory.labMode + ":", 10, 41, {
            color: room.memory.primaryLab ? '#10c3ba' : '#FFFFFF ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });

        room.visual.text(room.memory.lab2Mode + ":" + Memory.stats.totalMinerals[room.memory.lab2Mode] + "/" + require('build.labs').maxMinerals()[room.memory.lab2Mode] + ":" + room.memory.labShift, 10, 42, {
            color: room.memory.primaryLab ? '#000000' : '#10c3ba ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });

    } else {

        room.visual.text(room.memory.labMode + ":" + Memory.stats.totalMinerals[room.memory.labMode], 10, 41, {
            color: room.memory.primaryLab ? '#10c3ba' : '#000000 ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });
        room.visual.text(room.memory.lab2Mode + ":" + Memory.stats.totalMinerals[room.memory.lab2Mode] + ":", 10, 42, {
            color: room.memory.primaryLab ? '#000000' : '#10c3ba ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });
    }
    /*        if (room.memory.boost !== undefined)
                room.visual.text(room.memory.boost.mineralType, 10, 43, {
                    color: '#10c3ba ',
                    stroke: '#000000 ',
                    strokeWidth: 0.123,
                    font: 0.5
                }); */
    room.visual.text("w:" + room.memory.labsNeedWork, 10, 43, {
        color: '#10c3ba ',
        stroke: '#000000 ',
        strokeWidth: 0.123,
        font: 0.5
    });


}

function memoryStatsUpdate() {

    // Note: This is fragile and will change if the Game.cpu API changes
    Memory.stats.cpu = Game.cpu;
    Memory.stats.cpu.used = Game.cpu.getUsed(); // AT END OF MAIN LOOP

    Memory.stats.creepTotal = Memory.creepTotal;

    // Note: This is fragile and will change if the Game.gcl API changes
    Memory.stats.gcl = Game.gcl;

    Memory.stats.market = {
        credits: Game.market.credits
    };

}

function getWallLow(roomName) {

    Memory.wallCount--;
    if (Memory.wallCount > 0) return;
    Memory.wallCount = 150;
    if (Game.rooms[roomName] === undefined) return false;
    let room = Game.rooms[roomName];
    let walls = _.filter(room.find(FIND_STRUCTURES), function(o) {
        return o.structureType == STRUCTURE_WALL || (o.structureType == STRUCTURE_RAMPART && !o.isPublic);
    });
    let highest = _.min(walls, a => a.hits);
    return highest.hits;

}

function cleanMemory() {
    for (var e in Game.rooms) {
        var room = Game.rooms[e];
        var memory = room.memory;
        if (memory.invasionFlag !== undefined) {
            memory.invasionFlag = undefined;
        }
        if (memory.hostileID !== undefined) {
            memory.hostileID = undefined;
        }
        if (memory.hostileScanTimer !== undefined) {
            memory.hostileScanTimer = undefined;
        }
        if (room.controller !== undefined && room.controller.owner !== undefined && room.controller.owner.username === 'likeafox') {

        } else {
            if (memory.roomLinksID !== undefined) {
                //                console.log('DEL roomLInk', roomLink(room.name));
                memory.roomLinksID = undefined;
            }
            if (Game.flags[memory.invasionFlag] === undefined) {
                if (memory.invasionFlag !== undefined) {
                    memory.invasionFlag = undefined;
                    memory.hostileID = undefined;
                    memory.hostileScanTimer = undefined;
                    //                  console.log('DEL invasion Info', roomLink(room.name));
                }

            }
        }
    }

}

function addSpawnQuery(spawnCount) {
    var e;
    if (spawnCount !== undefined) {

        for (e in Game.spawns) {
            if (Game.spawns[e].memory.alphaSpawn) {
                if (spawnCount[Game.spawns[e].id] === undefined) {
                    spawnCount[Game.spawns[e].id] = {
                        bodyCount: 0
                    };
                }
                if (spawnCount[Game.spawns[e].id] !== undefined) {
                    let spwn = Game.spawns[e];
                    let spwnCount = spawnCount[Game.spawns[e].id];
                    let create = spwn.memory.create;
                    let war = spwn.memory.warCreate;
                    let expand = spwn.memory.expandCreate;
                    let a;
                    let iMax;

                    iMax = create.length;

                    for (a = 0; a < iMax; a++) {
                        if (spwnCount[create[a].memory.role] !== undefined) {
                            spwnCount[create[a].memory.role].count++;
                        } else {
                            spwnCount[create[a].memory.role] = {
                                count: 1,
                                goal: []
                            };
                        }
                    }
                    if (war !== undefined) {
                        iMax = war.length;
                        for (a = 0; a < iMax; a++) {
                            if (spwnCount[war[a].memory.role] !== undefined) {
                                spwnCount[war[a].memory.role].count++;
                            } else {
                                spwnCount[war[a].memory.role] = {
                                    count: 1,
                                    goal: []
                                };
                            }
                        }
                    }
                    iMax = expand.length;
                    for (a = 0; a < iMax; a++) {
                        if (spwnCount[expand[a].memory.role] !== undefined) {
                            spwnCount[expand[a].memory.role].count++;
                            spwnCount[expand[a].memory.role].goal.push(expand[a].memory.goal);
                        } else {
                            spwnCount[expand[a].memory.role] = {
                                count: 1,
                                goal: [expand[a].memory.goal]
                            };

                        }
                    }
                }
            }

        }
    }

    return spawnCount;
}

function addCounters() {
    //        Memory.marketRunCounter--;
    //       labs = require('build.labs');
}

function resetCounters() {
    //     if (Memory.marketRunCounter <= 0) {
    //       Memory.marketRunCounter = 9;
    // }
}


function doMemory() {
    if (Memory.stats === undefined) Memory.stats = {};
    if (Memory.war === undefined) Memory.war = false;
    if (Memory.showInfo === undefined) Memory.showInfo = 5;
    if (Memory.stopRemoteMining === undefined) { Memory.stopRemoteMining = []; }
    if (Memory.clearFlag === undefined) Memory.clearFlag = 500;
    if (Memory.observerNum === undefined) { Memory.observerNum = 0; }
    if (Memory.observerTask === undefined) { Memory.observerTask = []; }
    if (Memory.debts === undefined) { Memory.debts = []; }
    if (Memory.towerTarget === undefined) { Memory.towerTarget = 'none'; }
    if (Memory.setInterShardData === undefined) Memory.setInterShardData = 100;
    if (Memory.shardNeed === undefined) { Memory.shardNeed = []; }
    if (Memory.stats === undefined) { Memory.stats = { tick: Game.time }; }
    if (Memory.wallCount === undefined) { Memory.wallCount = 150; }
    if (Memory.marketRunCounter !== undefined) Memory.marketRunCounter = undefined;
    if (Memory.labsRunCounter !== undefined) Memory.labsRunCounter = undefined;

    // Issacar's getWorldMapPath inits.
    if (Memory.avoid_rooms !== undefined) Memory.avoid_rooms = [];
    if (Memory.empire_rooms !== undefined) Memory.empire_rooms = [];

}
var ticksInARow;

function blackMagic(fn) {
    let memory;
    let tick;
    return () => {

        if (tick && tick + 1 === Game.time && memory) {
            delete global.Memory;
            Memory = memory;
        }
        memory = Memory;
        tick = Game.time;
        fn();
        if (ticksInARow === undefined) {
            ticksInARow = 0;
        }
        ticksInARow++;
        RawMemory._parsed = Memory;
    };
}

function runShardRoom(roomName) {
    //shard room is room on a seperate shard
    let room = Game.rooms[roomName];
    if (room === undefined) return;
    let terminal = room.terminal;
    var min = 6750;
    var max = 9250;
    var minerals = _.shuffle([
        "H", "O", "U", "L", "K", "Z", "X", "G",
        "OH", "ZK", "UL",
        "UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO",
        "UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2",
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
    ]);
    var mined = [];
    var maxed = [];
    for (var e in minerals) {
        if (terminal.store[minerals[e]] !== undefined) {
            if (terminal.store[minerals[e]] < min) {
                mined.push({
                    mineralType: minerals[e],
                    mineralAmount: min - terminal.store[minerals[e]],
                });
                // request this mineral.
            } else if (terminal.store[minerals[e]] > max) {
                maxed.push({
                    mineralType: minerals[e],
                    mineralAmount: terminal.store[minerals[e]] - max,
                });
                // Send mienrals
            }
        } else {
            mined.push({
                mineralType: minerals[e],
                mineralAmount: min,
            });
        }
    }
    return {
        room: roomName,
        needed: mined,
        sending: maxed,
    };
}



function createSendCreep(request) {
    console.log(Game.shard.name, 'doing ', request.type, 'from room', request.shardRoom, 'transports', request.mineralType, 'amount:', request.mineralAmount, 'for shard1');
    // 
    var partyFlag;
    switch (Game.shard.name) {
        case 'shard2':
            partyFlag = 'portal';
            break;
    }
    let temp = {
        build: [CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        name: 'send'+Game.shard.name+":"+Math.floor(Math.random()*2000),
        memory: {
            role: 'mule',
            home: request.shardRoom,
            party: partyFlag,
            parent: Game.rooms[request.shardRoom].memory.alphaSpawnID,
            level: 5,
        }
    };
    return temp;
}

function doInstructions(instructions) {
    //    console.log(Game.shard.name, "doing instructions", instructions.length);
    let i = instructions.length;
    while (i--) {
        let current = instructions[i];
        let shard = current.shard;
        if (Game.shard.name === 'shard1' && current.type === 'request') {
            // Here shard1 fulfills any request that is made.
//            console.log('shard1 wants to fulfill REQUEST for', current.shard);
            //            current.mineralType,current.mineralAmount,
            let roomCreate;
            let flagTarget;
            if (current.shard === 'shard0') {
                roomCreate = 'E23S38';
                flagTarget = 'portal3';
            }
            if (current.shard === 'shard2') {
                roomCreate = 'E22S48';
                flagTarget = 'portal';
            }
            let alphaSpawn = Game.rooms[roomCreate].alphaSpawn;
            console.log('Shard1/REQUEST:', roomCreate,'Min:',current.mineralType,'Amt:',current.mineralAmount,'To:',current.shard);
                if (alphaSpawn.memory.expandCreate.length === 0) {

            let temp = {
                build: [CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    MOVE, MOVE, MOVE, MOVE, MOVE,
                    CARRY, CARRY, CARRY, CARRY, CARRY,
                ],
                name: 'request'+Game.shard.name+":"+Math.floor(Math.random()*2000),
                memory: {
                    role: 'mule',
                    home: roomCreate,
                    party: flagTarget,
                    parent: Game.rooms[roomCreate].memory.alphaSpawnID,
                    level: 5,
                    pickup: {
                        mineralType: current.mineralType,
                        mineralAmount: current.mineralAmount > 1250 ? 1250 : current.mineralAmount,
                    }
                }
            };

                    alphaSpawn.memory.expandCreate.push(temp);
                    console.log('added to alphaSpawn', current.mineralAmount, temp.memory.pickup.mineralAmount);
                    current.mineralAmount -= temp.memory.pickup.mineralAmount;
                    if (current.mineralAmount < 0) {
                        console.log(' and Spliced from instructions');
                        instructions.splice(i, 1);
                    }
                } 

        }
        if (shard === Game.shard.name) {


            // Here the shards make the creeps to send.
            if (current.type === 'send') {
                var alphaSpawn = Game.rooms[current.shardRoom].alphaSpawn;
            console.log(Game.shard.name+'/SEND:', current.shardRoom,'Min:',current.mineralType,'Amt:',current.mineralAmount,'To: shard1');



                if (alphaSpawn.memory.expandCreate.length === 0) {
                var temp = createSendCreep(current);
                temp.memory.pickup = {
                    mineralType: current.mineralType,
                    mineralAmount: current.mineralAmount > 1250 ? 1250 : current.mineralAmount,
                };
                // This is to limit the amount of mules made at one time to control transports a bit better.                
                    alphaSpawn.memory.expandCreate.push(temp);
                    console.log('added to alphaSpawn', current.mineralAmount, temp.memory.pickup.mineralAmount);
                    current.mineralAmount -= temp.memory.pickup.mineralAmount;
                    if (current.mineralAmount < 0) {
                        console.log(' and Spliced from instructions');
                        instructions.splice(i, 1);
                    }
                }

            }
        }
    }
}

function analyzeShards(shardObject) {
    //    shardObject.instructions= [];
    //[Game.shard.name]
    //if (Game.shard.name === 'shard1') return;

    if (shardObject.shard0 !== undefined) {
        let room = Game.rooms[shardObject.shard0.shardRoom];
        for (let i in shardObject.shard0.request) {
            //            console.log('shard0 requests for',shardObject.shard0.request[i].mineralType,":",shardObject.shard0.request[i].mineralAmount,shardObject.shard0.shardRoom);
            if(Memory.stats.totalMinerals[shardObject.shard0.request[i].mineralType] < 1000){
                continue;
            }
            
            let request = {
                type: 'request',
                // Requests only happen from shard1 to shardX
                shard: 'shard0', // Should be shard1, requests happen from shard1.
                shardRoom: shardObject.shard0.shardRoom, // If from shard 
                mineralAmount: shardObject.shard0.request[i].mineralAmount,
                mineralType: shardObject.shard0.request[i].mineralType,
            };
            //            console.log('request object',request.shard,request.shardRoom);
            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                    doRequest = false;
                    break;
                }
            }
            if (doRequest) {
                shardObject.instructions.push(request);
                console.log(' SHard 0 adding to isntructions', shardObject.instructions.length);
            }

        }
        for (let i in shardObject.shard0.sending) {
            //            console.log('shard0 sending out',shardObject.shard0.sending[i].mineralType,":",shardObject.shard0.sending[i].mineralAmount,shardObject.shard0.shardRoom);
            let request = {
                type: 'send',
                shard: 'shard0',
                shardRoom: shardObject.shard0.shardRoom,
                mineralAmount: shardObject.shard0.sending[i].mineralAmount,
                mineralType: shardObject.shard0.sending[i].mineralType,
            };
            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                    doRequest = false;
                    break;
                }
            }
            if (doRequest) {
                shardObject.instructions.push(request);
                console.log(' SHard 0 adding to isntructions', shardObject.instructions.length);
            }
        }
    }

    if (shardObject.shard2 !== undefined) {
        let room = Game.rooms[shardObject.shard2.shardRoom];
        for (let i in shardObject.shard2.request) {
            //            console.log('shard2 requests for',shardObject.shard2.request[i].mineralType,":",shardObject.shard2.request[i].mineralAmount,shardObject.shard2.shardRoom);
            if(Memory.stats.totalMinerals[shardObject.shard2.request[i].mineralType] < 1000){
                continue;
            }
            let request = {
                type: 'request',
                // Requests only happen from shard1 to shardX
                shard: 'shard2', // Should be shard1, requests happen from shard1.
                shardRoom: shardObject.shard2.shardRoom, // If from shard 
                mineralAmount: shardObject.shard2.request[i].mineralAmount,
                mineralType: shardObject.shard2.request[i].mineralType,
            };
            //            console.log('request object',request.shard,request.shardRoom);
            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                    doRequest = false;
                    break;
                }
            }
            if (doRequest) {
                shardObject.instructions.push(request);
                console.log(' SHard 2 adding to isntructions', shardObject.instructions.length);
            }

        }
        for (let i in shardObject.shard2.sending) {
            //            console.log('shard2 sending out',shardObject.shard2.sending[i].mineralType,":",shardObject.shard2.sending[i].mineralAmount,shardObject.shard2.shardRoom);
            let request = {
                type: 'send',
                shard: 'shard2',
                shardRoom: shardObject.shard2.shardRoom,
                mineralAmount: shardObject.shard2.sending[i].mineralAmount,
                mineralType: shardObject.shard2.sending[i].mineralType,
            };
            let doRequest = true;
            for (let e in shardObject.instructions) {
                if (shardObject.instructions[e].shard === request.shard && shardObject.instructions[e].type === request.type) {
                    doRequest = false;
                    break;
                }
            }
            if (doRequest) {
                shardObject.instructions.push(request);
                console.log(' SHard 2 adding to isntructions', shardObject.instructions.length);
            }
        }
    }
}

function getMarketPrices(){
var rtn = {};
    var minerals = [
        "H", "O", "U", "L", "K", "Z", "X", "G",
        "OH", "ZK", "UL",
        "UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO",
        "UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2",
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
    ];

    for(var e in minerals){
        let min = minerals[e];
        //var maxed = _.max(Game.market.getAllOrders({type: ORDER_BUY, resourceType: min}) , o=>o.price);
        //var selled = _.min(Game.market.getAllOrders({type: ORDER_SELL, resourceType: min}) ,o=>o.price);

        rtn[min] = {
            buy: _.max(Game.market.getAllOrders({type: ORDER_BUY, resourceType: min}) , o=>o.price),
            sell: _.min(Game.market.getAllOrders({type: ORDER_SELL, resourceType: min}) ,o=>o.price),
        };
    }

return rtn;
}

function analyzeMarkets(shardObject) {
    //    shardObject.instructions= [];
    //[Game.shard.name]
    //if (Game.shard.name === 'shard1') return;
    var minerals = [
        "H", "O", "U", "L", "K", "Z", "X", "G",
        "OH", "ZK", "UL",
        "UH", "UO", "KH", "KO", "LH", "LO", "ZH", "ZO", "GH", "GO",
        "UH2O", "UHO2", "KH2O", "KHO2", "LH2O", "LHO2", "ZH2O", "ZHO2", "GH2O", "GHO2",
        "XUH2O", "XUHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XZH2O", "XZHO2", "XGH2O", "XGHO2",
    ];

    if (shardObject.shard0 === undefined || shardObject.shard0.marketData === undefined||
        shardObject.shard1 === undefined || shardObject.shard1.marketData === undefined ||
        shardObject.shard2 === undefined || shardObject.shard2.marketData === undefined ) {
        return;
    }
console.log('M',"typ ",'shard0', 'shard1 ', 'shard2 Buy');
    for(let i in minerals) {


        let min = minerals[i];
        //if( )
        if(shardObject.shard0.marketData[min].buy === null) {
            shardObject.shard0.marketData[min].buy = {
                price : 0.01,
            };
        }
        if(shardObject.shard0.marketData[min].sell === null) {
            shardObject.shard0.marketData[min].sell = {
                price : 1000,
            };
        }
        if(shardObject.shard1.marketData[min].buy === null || shardObject.shard1.marketData[min].buy === undefined) {
            shardObject.shard1.marketData[min].buy = {
                price : 0.01,
            };
        }
        if(shardObject.shard1.marketData[min].sell === null) {
            shardObject.shard1.marketData[min].sell = {
                price : 1000,
            };
        }
        if(shardObject.shard2.marketData[min].buy === null) {
            shardObject.shard2.marketData[min].buy = {
                price : 0.01,
            };
        }
        if(shardObject.shard2.marketData[min].sell === null) {
            shardObject.shard2.marketData[min].sell = {
                price : 1000,
            };
        }
        if(shardObject.shard0.marketData[min].buy !== null && shardObject.shard1.marketData[min].buy !== null && shardObject.shard2.marketData[min].buy !== null){

// We are looking for the highest BUY Price
var highest = 'shard0';
var highestAmount = shardObject.shard0.marketData[min].sell;



//if(min === 'U') console.log('Low Sell',shardObject.shard2.marketData[min].sell.price , highestAmount.price);
if(shardObject.shard1.marketData[min].sell.price < highestAmount.price){
    highest = 'shard1';
    highestAmount = shardObject.shard1.marketData[min].sell;
}
//if(min === 'U') console.log('Low Sell',shardObject.shard2.marketData[min].sell.price , highestAmount.price);
if(shardObject.shard2.marketData[min].sell.price < highestAmount.price){
    highest = 'shard2';
    highestAmount = shardObject.shard2.marketData[min].sell;
}


var lowest = 'shard0';
var lowestAmount = shardObject.shard0.marketData[min].buy;
//if(min === 'U') console.log('high Buy',shardObject.shard2.marketData[min].buy.price , lowestAmount.price);
if(shardObject.shard1.marketData[min].buy.price > lowestAmount.price){
    lowest = 'shard1';
    lowestAmount = shardObject.shard1.marketData[min].buy;
}
//if(min === 'U') console.log('high Buy',shardObject.shard2.marketData[min].buy.price , lowestAmount.price);
if(shardObject.shard2.marketData[min].buy.price > lowestAmount.price){
    lowest = 'shard2';
    lowestAmount = shardObject.shard2.marketData[min].buy;
}
//        console.log(min,"buy",shardObject.shard0.marketData[min].buy.price, shardObject.shard1.marketData[min].buy.price === undefined ? 1000: shardObject.shard1.marketData[min].buy.price, shardObject.shard2.marketData[min].buy.price);
// First we find who has the lowest BUY

//        console.log(min,"sell",shardObject.shard0.marketData[min].sell.price, shardObject.shard1.marketData[min].sell.price === undefined ? 1000: shardObject.shard1.marketData[min].sell.price, shardObject.shard2.marketData[min].sell.price);
// Then we get who has the highest sell of this mineral
// If Buy is greater than Sell     
//0.112 for: U Highest Buy order shard1 @ 0.113 Lowest Sell order shard1 @ 0.001
// WE are looking for the lowest SELL price

//console.log('for:',min,'Highest Buy order',lowest,'@',lowestAmount.price,'Lowest Sell order',highest,'@',highestAmount.price);
if(lowestAmount.price !== undefined && highestAmount.price !== undefined) {
    var profit =  lowestAmount.price - highestAmount.price;
    if(profit > 0){
console.log(profit,'for:',min,'highest Buy order',lowest,'@',lowestAmount.price,'lowest Sell order',highest,'@',highestAmount.price);
    }
}
        } else {
            console.log(min,"has null value on a shard");
        }
    }
console.log('analzye markets, have all 3 markets',shardObject.shard0.marketData,shardObject.shard1.marketData,shardObject.shard2.marketData);
}

function setInterShardData() {
    //Memory.setInterShardData--;
    //  if (Memory.setInterShardData < 0) {
    //        Memory.setInterShardData = 100;
    //   segmentChange--;
    var rawData = RawMemory.interShardSegment;
    var rawObject = JSON.parse(rawData);

    if (rawObject.instructions === undefined) {
        rawObject.instructions = [];
    }

    var shardObject = rawObject[Game.shard.name];

    if (rawObject[Game.shard.name] === undefined) {
        rawObject[Game.shard.name] = {

        };
    }
    if (Game.shard.name === 'shard1') {
        rawObject[Game.shard.name] = {
      //      marketData: getMarketPrices(),
        };
        analyzeShards(rawObject);
    //    analyzeMarkets(rawObject);
    } else if (Game.shard.name === 'shard0') {
        let sharData = runShardRoom('E38S72');

        rawObject[Game.shard.name] = {
            request: sharData.needed, // needed
            sending: sharData.sending,
            shardRoom: sharData.room,
  //          marketData: getMarketPrices(),
        };
    } else if (Game.shard.name === 'shard2') {
        let sharData = runShardRoom('E19S49');
        rawObject[Game.shard.name] = {
            request: sharData.needed, // needed
            sending: sharData.sending,
            shardRoom: sharData.room,
//            marketData: getMarketPrices(),
        };
    }
    //instructions are added by analzyingShards, and each shard needs to go through instructions 
    doInstructions(rawObject.instructions);

    // Instructions are made b
    RawMemory.interShardSegment = JSON.stringify(rawObject);
}

var spawnCount;
module.exports.loop = blackMagic(function() {
    var _terminal = require('build.terminal');
    //    this._terminal = require('build.terminal');
    var flag = require('build.flags');
    var power = require('commands.toPower');
    var observer = require('build.observer');
    var tower = require('build.tower');
    var spawnsDo = require('build.spawn');
    var ccSpawn = require('commands.toSpawn');
    var link = require('build.link');
    var labs = require('build.labs');
    var isTenTime = Game.time % 10;
    var prototypes = [
        require('prototype.creeps'),
        require('prototype.global'),
        require('prototype.room')
    ];
    doMemory();

    for (let i = 0, e = prototypes.length; i < e; i++) {
        prototypes[i]();
    }
    addCounters();

    flag.run(spawnCount); // We do this part of the first stuff so we can go and find things in the flag rooms

    if (Game.shard.name === 'shard1' && Game.cpu.bucket <= 200) {
        console.log('XXXX XXXXX 200 tick break after flag logic XXXX XXXX');
        return;
    }
    spawnCount = addSpawnQuery(spawnsDo.runCreeps()); // This will not work with old counting.
    var spawnReport = {};
    //    console.log('it should do something here');
    var seg = require('commands.toSegment');
    //    console.log(seg);
    seg.run();
    var title;
    Memory.stats.powerProcessed = 0;

    for (title in Game.spawns) {

        if (Game.spawns[title].memory.alphaSpawn) {
            //                      var constr = require('commands.toStructure');

            //                        constr.takeSnapShot(Game.spawns[title].pos.roomName);

            spawnsDo.checkBuild(Game.spawns[title]);
            doRoomReport(Game.spawns[title].room);
            let roomName = Game.spawns[title].pos.roomName;
            tower.run(roomName); // Tower doing stuff.
            labs.roomLab(roomName);
            power.roomRun(roomName);
            link.roomRun(roomName);
            if (Game.shard.name == 'shard2' || Game.shard.name == 'shard0') {
                observer.runRoom2(roomName);
            } else {
                observer.runRoom(roomName);
            }
            if (isTenTime === 0 && Game.shard.name == 'shard1') {
                if (Game.spawns[title].room.memory.simple) {
                    _terminal.runSimple(roomName);
                } else {
                    _terminal.runTerminal(roomName);
                }
            }

        }


        if (Game.spawns[title].room.energyCapacityAvailable !== 0 && Game.spawns[title].room.controller.level !== 0) {
            //            doRoomVisual(Game.spawns[title].room);
            rampartCheck(Game.spawns[title]);
            if (Game.cpu.bucket > 1000) {
                safemodeCheck(Game.spawns[title]);
            }
            ccSpawn.checkMemory(Game.spawns[title]); // This creates Arrays

            if (Game.spawns[title].memory.alphaSpawn) {
                if (Game.flags[Game.spawns[title].pos.roomName] !== undefined && Game.flags[Game.spawns[title].pos.roomName].color === COLOR_WHITE &&
                    (Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_GREEN || Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_PURPLE)) {
                    spawnsDo.spawnQuery(Game.spawns[title], spawnCount);
                }
                ccSpawn.newRenewCreep(Game.spawns[title].pos.roomName);
            }


            if (Game.spawns[title].spawning === null) {
                ccSpawn.createFromStack(Game.spawns[title]);
            } else {
                //                Game.spawns[title].memory.lastSpawn = 0;
                Game.spawns[title].spawning.setDirections(Game.spawns[title].memory.spawnDir);
                let spawn = Game.spawns[title];
                spawn.room.visual.text("🔧" + spawn.spawning.name, spawn.pos.x + 1, spawn.pos.y, {
                    color: '#97c39a ',
                    stroke: '#000000 ',
                    strokeWidth: 0.123,
                    font: 0.5,
                    align: RIGHT
                });

            }

            if (Game.spawns[title].memory.alphaSpawn && Memory.showInfo > 2) {
                let spawn = Game.spawns[title];
                let spawnStats = {
                    storageEnergy: spawn.room.storage === undefined ? 0 : spawn.room.storage.store[RESOURCE_ENERGY],
                    terminalEnergy: spawn.room.terminal === undefined ? 0 : spawn.room.terminal.store[RESOURCE_ENERGY],
                    terminalTotal: spawn.room.terminal === undefined ? 0 : spawn.room.terminal.total,
                    parts: spawn.memory.totalParts,
                    creepNumber: spawn.memory.totalCreep,
                    energy: spawn.room.energyAvailable,
                    maxEnergy: spawn.room.energyCapacityAvailable,
                    controllerLevel: spawn.room.controller.level,
                    createQ: spawn.memory.create.length,
                    warQ: spawn.memory.warCreate.length,
                    wallSize: getWallLow(Game.spawns[title].room.name),
                    expandQ: spawn.memory.expandCreate.length
                };
                spawnReport[Game.spawns[title].room.name] = spawnStats;
            }
        }
    } // End of Spawns Loops

    Memory.stats.rooms = spawnReport;
    if (isTenTime === 0) {
        _terminal.run();
    }
    if (Game.shard.name !== 'shard2') {
        memoryStatsUpdate();
    }

    doUpgradeRooms();
    resetCounters();
    scanForRemoteSources();
    scanForCleanRoom();
    consoleLogReport();
    setInterShardData();

    //        cleanMemory();
});