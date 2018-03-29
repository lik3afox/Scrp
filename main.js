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

var HardD = ['E35S83'];


function rampartCheck(spawn) {

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


    if (Game.flags.upgradeRoom !== undefined) {
        let flag = Game.flags.upgradeRoom;
        let room = flag.room;
        if (room.controller.level > 3) {
            //            if (room.controller.level > 5) {
            let total = room.storage.store[RESOURCE_ENERGY] + room.terminal.store[RESOURCE_ENERGY];
            room.visual.text(total, room.storage.pos);
            if (total > 1200000) {
                flag.memory.party[0][1] = 3;

            } else if (total > 1100000) {
                flag.memory.party[0][1] = 2;

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

var loaded = Game.time;

//    var ALLIES = foxy.friends;

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
        //        console.log('NUKE INCOMING @' + nuke[0].room + ' from:');
        room.memory.nukeIncoming = true;
        //        Game.notify('NUKE INCOMING @' + nuke[0].room + ' from:');
    }

    //   if (room.controller.level === 8 && room.controller.ticksToDowngrade < 100000) {

    /*            let spwns = room.find(FIND_STRUCTURES);
                spwns = _.filter(spwns, function(o) {
                    return o.structureType == STRUCTURE_SPAWN && o.spawning === null;
                });
                if(spwns.length > 0){
                        var zz = spwns[0].spawnCreep([CARRY, CARRY, MOVE, MOVE, CARRY, CARRY,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK], 'emegyUpg' + Math.random(), {
                            memory: {
                                role: 'upgrader',
                                roleID: 0,
                                home: spwns[0].pos.roomName,
                                parent: "none",
                                reportDeath: true,
                                level: 2
                            }
                        });

                } */
    //    }

    //   if (room.boostLab !== undefined) {
    //       room.visual.text('X', room.boostLab.pos);
    //  }

    if (room.controller.level > 3) {

        var goods = room.find(FIND_MY_CREEPS);
        if (goods.length <= 1) {
            for (var i in goods) {
                if (goods[i].memory.role == 'linker') {
                    goods[i].memory.role = 'first';
                    goods[i].memory.reportDeath = true;
                }
            }
            var spwns = room.find(FIND_STRUCTURES);
            spwns = _.filter(spwns, function(o) {
                return o.structureType == STRUCTURE_SPAWN && o.spawning === null;
            });
            if (spwns.length > 0) {

                if (room.energyAvailable >= 300) {
                    var zz = spwns[0].spawnCreep([CARRY, CARRY, MOVE, MOVE, CARRY, CARRY], 'emegyfir' + Math.random(), {
                        memory: {
                            role: 'first',
                            roleID: 0,
                            home: spwns[0].pos.roomName,
                            parent: "none",
                            level: 3
                        }
                    });
                }
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
    let highest = _.max(walls, a => a.hits);
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
const { log } = console;
console.log = function(v) {
    if (v === false) log.call(this, new Error().stack);
    if (v === "false") log.call(this, new Error().stack);
    log.apply(this, arguments);
};

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

    flag.run(); // We do this part of the first stuff so we can go and find things in the flag rooms

    if (Game.shard.name === 'shard1' && Game.cpu.bucket <= 200) {
        console.log('XXXX XXXXX 200 tick break after flag logic XXXX XXXX');
        return;
    }
    var spawnCount = addSpawnQuery(spawnsDo.runCreeps()); // This will not work with old counting.
    var spawnReport = {};
    require('commands.toSegment').run();

    var title;
    Memory.stats.powerProcessed = 0;

    for (title in Game.spawns) {

        if (Game.spawns[title].memory.alphaSpawn) {
            //                      var constr = require('commands.toStructure');

            //                        constr.takeSnapShot(Game.spawns[title].pos.roomName);
            doRoomReport(Game.spawns[title].room);
            let roomName = Game.spawns[title].pos.roomName;
            tower.run(roomName); // Tower doing stuff.
            labs.roomLab(roomName);
            power.roomRun(roomName);
            link.roomRun(roomName);
            if (Game.shard.name == 'shard2') {
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
            spawnsDo.checkBuild(Game.spawns[title]);

            if (Game.spawns[title].memory.alphaSpawn) {
                if (Game.flags[Game.spawns[title].pos.roomName] !== undefined && Game.flags[Game.spawns[title].pos.roomName].color === COLOR_WHITE &&
                    (Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_GREEN || Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_PURPLE)) {
                    spawnsDo.spawnQuery(Game.spawns[title], spawnCount);
                }
            }


            if (Game.spawns[title].spawning === null) {
                ccSpawn.renewCreep(Game.spawns[title]);
                ccSpawn.createFromStack(Game.spawns[title]);
            } else {
                Game.spawns[title].memory.lastSpawn = 0;
                let spawn = Game.spawns[title];
                spawn.room.visual.text("🔧" + spawn.memory.CreatedMsg, spawn.pos.x + 1, spawn.pos.y, {
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
                    parts: spawn.memory.TotalBuild,
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
        observer.runTask();
    }

    doUpgradeRooms();
    resetCounters();
    scanForRemoteSources();
    scanForCleanRoom();
    consoleLogReport();
    //        cleanMemory();
});