    // showInfo depending on the level will do different things. Lv 5 is max show all get all cpu and such info
    // 4 is remove creeps cpu counting
    // 3 Remove Any Calucation for reports or Filters. 
    // 2 Remove High Grafana(calcuating something)
    // 1 Remove Visual and Low Grafana stats (Low Grafana means no calculations)
    // 1 Bare Visual

    var fox = require('foxGlobals');
    var _showJobs = true;
    var _creepsReport = false;
    var flag = require('build.flags');
    var tower = require('build.tower');
    var spawnsDo = require('build.spawn');
    var ccSpawn = require('commands.toSpawn');

    var _last;

    var link = require('build.link');
    var observer = require('build.observer');
    var movement = require('commands.toMove');
    var warband = require('commands.toParty');
    var power = require('commands.toPower');
    var labs = require('build.labs');
    var market = require('build.terminal');

    var prototypes = [
        require('prototype.creeps'),
        require('prototype.room')
    ];

    var roomCheck = 10;
    var countCheck = 3;

    function whoWorksFor(goal) {
        var keys = Object.keys(Game.creeps);
        var a = keys.length;
        var e;
        while (a--) {
            e = keys[a];
            if (Game.creeps[e].memory.goal == goal) {
                console.log(goal, Game.creeps[e].memory.home, Game.creeps[e].name, Game.creeps[e].memory.role, Game.creeps[e].pos, "lvl:", Game.creeps[e].memory.level);
            }
        }
    }

    var HardD = ['E35S83'];

    function rampartCheck(spawn) {


        var targets = spawn.room.find(FIND_HOSTILE_CREEPS);
        targets = _.filter(targets, function(object) {
            return (object.owner.username != 'Invader' && !_.contains(fox.friends, object.owner.username));
        });
        //var www = spawn.room.find(FIND_CREEPS);
        /*www = _.filter(targets,function(o){
            return (object.owner.username != 'likeafox');
        }); */
        if (targets.length === 0) return;
        var e = targets.length;
        var named2 = 'RA2' + spawn.room.name;
        var named = 'rampartD' + spawn.room.name;
        var named3 = 'RA3' + spawn.room.name;
        var structures = spawn.room.find(FIND_STRUCTURES);
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
                        //                        console.log('lets place a flag here for defense');
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
                            console.log('extra rampart is available for guy');
                            //        console.log(Game.flags[named2] , Game.flags[named].memory.invaderTimed,Game.flags[named].memory.invaderTimed );
                            if (Game.flags[named].memory.invaderTimed !== undefined &&
                                Game.flags[named].memory.invaderTimed > 15) {
                                //                        console.log(nearRampart[a].pos,Game.flags[named].pos);
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
        let spwns = ['5a03400a3e83cd1e5374cf65']; //,''
        if (Game.flags.recontrol !== undefined) return;
        var e = spwns.length;
        while (e--) {
            let spawn = Game.getObjectById(spwns[e]);
            if (spawn === null) return;
            let control = spawn.room.controller;
            if (control.level < 7) return;
            //    console.log(spawn, spawn.id, 'upgradde', control.level, control.progress, min.mineralAmount);
            if (control.level >= 7 && control.progress > 10900000 || control.level === 8) {
                if (Game.flags.recontrol === undefined) {
                    spawn.room.createFlag(control.pos, 'recontrol', COLOR_YELLOW);
                }
            }
        }
    }


    function isBoost(body) {
        for (var e in body) {
            //            console.log(body[e].boost, body[e].boost);
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
        if (Memory.testing === undefined) {
            var message = _.toString(boost + ':boost ' + bads.length + ':Bad guys found @' + bads[0].room + 'from:' + bads[0].owner.username);
            Game.notify(message);
            Memory.testing = 1;
        }
        console.log(boost, ':boost ', bads.length, ':Bad guys found @', bads[0].room, 'from:', bads[0].owner.username);
        if (bads.length > 0 && !_.contains(fox.friends, bads[0].owner.username)) {}
        return {};
    }

    var loaded = Game.time;

    //    var ALLIES = foxy.friends;

    function doRoomReport(room) {
        if (room.name == 'E14S38' || room.controller.level >= 6) return;
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
            Game.notify('NUKE INCOMING @' + nuke[0].room + ' from:' + launchRoomName);
        }

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
                return o.structureType == STRUCTURE_SPAWN;
            });
            if (spwns.length > 0) {
                if (!spwns[0].spawning && room.energyAvailable === 300) {
                    spwns[0].spawnCreep([CARRY, CARRY, MOVE, MOVE, CARRY, CARRY], 'emegyfir', {
                        role: 'first',
                        roleID: 0,
                        home: spwns[0].pos.roomName,
                        parent: "none",
                        level: 3
                    });
                }
            }

        }

    }

    function doRoomVisual(room) {
        if (Memory.stats.totalMinerals === undefined) return;
        room.visual.text(room.memory.labMode + ":" + Memory.stats.totalMinerals[room.memory.labMode], 10, 41, {
            color: room.memory.primaryLab ? '#10c3ba' : '#000000 ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });
        room.visual.text(room.memory.lab2Mode + ":" + Memory.stats.totalMinerals[room.memory.lab2Mode], 10, 42, {
            color: room.memory.primaryLab ? '#000000' : '#10c3ba ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });
        if (room.memory.boost !== undefined)
            room.visual.text(room.memory.boost.mineralType, 10, 43, {
                color: '#10c3ba ',
                stroke: '#000000 ',
                strokeWidth: 0.123,
                font: 0.5
            });
        room.visual.text("w:" + room.memory.labsNeedWork, 10, 44, {
            color: '#10c3ba ',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });


    }

    function memoryStatsUpdate() {
        if (Memory.stats === undefined) {
            Memory.stats = { tick: Game.time };
        }
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

    function addSpawnQuery() {
        for (var e in Game.spawns) {
            if (Game.spawns[e].memory.alphaSpawn && Memory.spawnCount[Game.spawns[e].id] !== undefined) {
                let spwn = Game.spawns[e];
                let spwnCount = Memory.spawnCount[Game.spawns[e].id];
                let create = spwn.memory.create;
                let war = spwn.memory.warCreate;
                let expand = spwn.memory.expandCreate;
                let a;
                for (a in create) {
                    if (spwnCount[create[a].memory.role] !== undefined) {
                        spwnCount[create[a].memory.role].count++;
                    } else {
                        spwnCount[create[a].memory.role] = {
                            count: 1,
                            goal: []
                        };
                    }
                }
                for (a in war) {
                    if (spwnCount[war[a].memory.role] !== undefined) {
                        spwnCount[war[a].memory.role].count++;
                    } else {
                        spwnCount[war[a].memory.role] = {
                            count: 1,
                            goal: []
                        };
                    }
                }
                for (a in expand) {
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
            RawMemory._parsed = Memory;
        };
    }

    module.exports.loop = blackMagic(function() {
        var start = Game.cpu.getUsed();

        if (Memory.stats === undefined) Memory.stats = {};

        if (Memory.war === undefined) Memory.war = true;

        if (Memory.showInfo === undefined) Memory.showInfo = 5;
        var i = prototypes.length;
        while (i--) {
            prototypes[i]();
            global.roomLink = function(roomname) {
                return '<a href=https://screeps.com/a/#!/room/shard1/' + roomname + '  style="color:#aaaaff">' + roomname + '</a>';
            };
            global.stringToRoomPos = function(string) {
                //input XXYYE12S23
                //input 0123456789
                if (string.length !== 10) return;
                var goalRoom = string[4] + string[5] + string[6] + string[7] + string[8] + string[9];
                return new RoomPosition(parseInt(string[0] + string[1]), parseInt(string[2] + string[3]), goalRoom);
            };
            global.roomPosToString = function(roomPos) {
                if (roomPos.x === undefined) return false;
                var xx = "";
                if (roomPos.x > 10) {
                    xx = roomPos.x;
                } else {
                    xx = "0" + roomPos.x;
                }
                var yy = "";
                if (roomPos.y > 10) {
                    yy = roomPos.y;
                } else {
                    yy = "0" + roomPos.y;
                }
//                console.log(xx, yy);
                return "" + xx + yy + roomPos.roomName;
            };

        }

        var totalSpawn = 10;
        var report;
        var doSpawnChecks = false;

        if (Memory.stopRemoteMining === undefined) {
            Memory.stopRemoteMining = [];
        }
        // for creeps.
        var total = 0;
        spawnsDo.runCreeps();
        require('commands.toSegment').run();
        addSpawnQuery(); // This will not work with old counting.
        var spawnReport = {};
        flag.run(); // We do this part of the first stuff so we can go and find things in the flag rooms


        var keys = Object.keys(Game.spawns);
        var t = keys.length;
        var title;
        while (t--) { // Start of spawn Loop
            title = keys[t];
            if (Game.spawns[title].room.energyCapacityAvailable !== 0 && Game.spawns[title].room.controller.level !== 0) {

                doRoomVisual(Game.spawns[title].room);
                rampartCheck(Game.spawns[title]);
                if (Game.cpu.bucket > 1000) {
                    safemodeCheck(Game.spawns[title]);
                    ccSpawn.checkMemory(Game.spawns[title]); // This creates Arrays
                    if (Game.spawns[title].memory.newSpawn === undefined) {
                        spawnsDo.checkNewSpawn(Game.spawns[title]);
                    }
                    spawnsDo.checkBuild(Game.spawns[title]);
                }

                //                  if (Memory.war) {
                if (Game.spawns[title].memory.alphaSpawn) {
                    doRoomReport(Game.spawns[title].room);
                }
                //                    }

                if (Game.spawns[title].memory.alphaSpawn) {
                    //                      var constr = require('commands.toStructure');
                    //                        console.log(Game.spawns[title].pos.roomName);
                    //                        constr.takeSnapShot(Game.spawns[title].pos.roomName);

                    totalSpawn++;
                    tower.run(Game.spawns[title].pos.roomName); // Tower doing stuff.

                    if (Game.spawns[title].memory.roadsTo.length === 0) {
                        var BUILD = {
                            source: 'xxxx',
                            sourcePos: new RoomPosition(5, 5, 'S25W55'),
                            miner: false,
                            transport: false,
                            expLevel: 0
                        };
                        Game.spawns[title].memory.roadsTo.push(BUILD);
                    }

                }


                if (Game.spawns[title].memory.alphaSpawn && Game.flags[Game.spawns[title].pos.roomName] !== undefined && Game.flags[Game.spawns[title].pos.roomName].color === COLOR_WHITE &&
                    Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_GREEN) {
                    spawnsDo.spawnQuery(Game.spawns[title]);
                }

                if (Game.spawns[title].spawning === null) {
                    ccSpawn.renewCreep(Game.spawns[title]);
                    var ed = 'E14S38';
                    if (Game.spawns[title].id === '59b732634d5e4c649336e82e' && Game.spawns[title].room.energyAvailable > 10000 && Game.rooms[ed].controller !== undefined&& Game.rooms[ed].controller.level > 3 && Game.rooms[ed].controller.level < 6) {
                        let spwn = Game.getObjectById('59b732634d5e4c649336e82e');
                        if(spwn.memory.created === undefined) spwn.memory.created= 0;
                            if (spwn !== null) {
                                let ez = spwn.spawnCreep([MOVE, CLAIM, CLAIM], 'ezBread'+ spwn.memory.created++, {memory:{
                                    role: 'mule',
                                    home: 'E14S37',
                                    party: 'Flag27',
                                    parent: '599c7de1255bda6a7f60b395',
                                    level: 2
                                }});
                                spwn.memory.CreatedMsg = 'LUCKY';
                                console.log('trying LUCKY', ez);
                        }
                    } else {
                        ccSpawn.createFromStack(Game.spawns[title]);
                    }
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
                        expandQ: spawn.memory.expandCreate.length
                    };
                    spawnReport[Game.spawns[title].room.name] = spawnStats;

                }
            }
        } // End of Spawns Loops

        Memory.stats.rooms = spawnReport;
        memoryStatsUpdate();
        link.run();

        if (Game.shard.name == 'shard1') {
            doUpgradeRooms();
            if (Game.cpu.bucket > 250) {
                power.run();
                observer.run();

                if (Memory.labsRunCounter === undefined) Memory.labsRunCounter = 2;
                Memory.labsRunCounter--;
                if (Memory.labsRunCounter <= 0) {
                    Memory.labsRunCounter = 10;
                    labs.run();
                }
            }
        }
        Memory.marketRunCounter--;
        if (Memory.marketRunCounter <= 0) {
            Memory.marketRunCounter = 10;
            market.run();
        }

        if (Memory.marketRunCounter === undefined) Memory.marketRunCounter = 10;

        if (Game.shard.name == 'shard1') {
            if (Game.spawns.Spawn1 !== undefined) {


                    report = "";
                    for (var a in Memory.shardNeed) {
                        report += " " + Memory.shardNeed[a];
                    }

                let dif = Game.cpu.limit + (Game.spawns.Spawn1.memory.lastBucket - Game.cpu.bucket);
                console.log('**S:' + Memory.shardNeed.length + '*PP:' + Memory.stats.powerProcessed + '***'+report+'***TICK REPORT:' + Game.time + '**********************' + Memory.creepTotal + '****' + dif + ':CPU|' + Game.cpu.limit + '|Max' + Game.cpu.tickLimit + '|buck:' + Game.cpu.bucket);

                Game.spawns.Spawn1.memory.lastBucket = Game.cpu.bucket;
                //            Game.spawns.E38S81.memory.lastBucket = Game.cpu.bucket;
            }
        } else {
            if (Game.spawns.E38S81) {
                //            let dif = Game.cpu.limit + (Game.spawns.Spawn1.memory.lastBucket - Game.cpu.bucket);
                let dif;
                //              console.log('*****PP:' + 0 + '*****************TICK REPORT:' + Game.time + '**********************' + Memory.creepTotal + '****' + dif + ':CPU|' + Game.cpu.limit + '|Max' + Game.cpu.tickLimit + '|buck:' + Game.cpu.bucket);

                //            Game.spawns.Spawn1.memory.lastBucket = Game.cpu.bucket;
                Game.spawns.E38S81.memory.lastBucket = Game.cpu.bucket;
            }
        }

        /*if(Game.shard.name == 'shard1'){
        var pos1 = new RoomPosition(31,0,"E23S39");
        var pos2 = new RoomPosition(43,45,"E23S39");
        //var room = ;
        var ee = 'E23S39';

        var path = Game.rooms[ee].findPath(pos1,pos2);
        console.log(Room.serializePath(path),pos1,pos2);

        } 
        var zz = 
        '+1023E23S391500E23S391401645556564555455555555567768+0942E24S384400E23S39450144444+4345E23S393100E23S393001655555555555566665555555544445444444444455444+3207E23S384905E23S39480488888+0843E24S384400E23S39450144444+0646E24S384400E23S39450144444+4446E23S393000E23S3930015555555555555666655555555444454444444444554444+0646E24S384300E23S394401434444+4345E23S393000E23S393001555555555555566665555555544445444444444455444+0922E23S391500E23S3914016455565645554555555555677688+4446E23S393100E23S3930016555555555555666655555555444454444444444554444+1023E23S391400E23S391401545556564555455555555567768+3207E23S380500E24S390501566667+1346E24S360032E24S37013121111112222222222222222211111188+1346E24S363449E23S373448121122233332212222112+0942E24S380005E24S390105322222+0942E24S380649E24S3806481212228+1346E24S361649E24S361548888+3207E23S381600E24S37170144555555666666666666666665555556+1607E24S373349E23S373448221122233332212222112+3207E23S384938E23S3748387876656677776665565+0646E24S380649E24S380648128+3207E23S384932E23S374833655666656677776665565+2240E24S373449E23S3734481211222333322122343+2240E24S370038E24S370138333333333333444443333228+2140E24S370038E24S370138333333333333444443333218+1706E24S370038E24S37013721111111111112222222222222222218+3207E23S380600E24S390501666667+1346E24S363249E23S373348222122233332212222112+1346E24S363349E23S373448221122233332212222112+1706E24S374938E23S374837882112+1706E24S370032E24S37013121111112222222222222222218+0843E24S380649E24S380648121228+0546E24S380649E24S380648118+1245E24S361649E24S3615488888+1607E24S370038E24S370137211111111111122222222222222222186+1607E24S370032E24S370131211111122222222222222222186+1607E24S373249E23S373348222122233332212222112+3207E23S384933E23S37483465666656677776665566+2140E24S370032E24S3701334444443333334444433332287+1245E24S361549E24S3614488881+1245E24S360033E24S370132211111112222222222222222211111188+1706E24S370034E24S3701332111111112222222222222222218+3207E23S384934E23S3748356666656677776665565+1245E24S360034E24S3701332111111112222222222222222211111188+3207E23S381500E24S371601444555556666666666666666655555556+1607E24S370034E24S37013321111111122222222222222222186+1706E24S370033E24S370132211111112222222222222222218+0646E24S380549E24S380648228+3207E23S380700E24S3906016766667+0843E24S380549E24S380648221228+0546E24S380549E24S380648218+0843E24S384400E23S39450144444+1346E24S361649E24S361548888+0843E24S380649E24S380648121228+0646E24S384400E23S39450144444+3207E23S384938E23S3748387876656677776665565+0646E24S380005E24S390105322222+0646E24S380649E24S380648128+1706E24S373449E23S373448121122233332212222112+1706E24S370032E24S37013121111112222222222222222218+4345E23S393000E23S393001555555555555566665555555544445444444444455444+1607E24S373349E23S373448221122233332212222112+2240E24S373449E23S3734481211222333322122343+3207E23S380600E24S390501666667+3207E23S381600E24S3717014455555566666666666666666555555556+3207E23S384905E23S39480488888+1607E24S370032E24S370131211111122222222222222222186+2240E24S370038E24S370138333333333333444443333228+1023E23S391500E23S391401645556564555455555555567768+3207E23S381600E24S3717014455555566666666666666666555555556+0942E24S384400E23S39450144444+';
        var ee = zz.split("+");
        ee.pop();
        ee.shift();
        console.log(ee.length,ee[0]); */

    });

    /*
    exports.deserializePath = function(path) {
    if(!_.isString(path)) {
        throw new Error('`path` is not a string');
    }

    var result = [];
    if(!path.length) {
        return result;
    }
    var x,y, direction, dx, dy;

    x = parseInt(path.substring(0, 2));
    y = parseInt(path.substring(2, 4));
    if(_.isNaN(x) || _.isNaN(y)) {
        throw new Error('`path` is not a valid serialized path string');
    }

    for (var i = 4; i < path.length; i++) {
        direction = parseInt(path.charAt(i));
        if(!offsetsByDirection[direction]) {
            throw new Error('`path` is not a valid serialized path string');
        }
        dx = offsetsByDirection[direction][0];
        dy = offsetsByDirection[direction][1];
        if (i > 4) {
            x += dx;
            y += dy;
        }
        result.push({
            x, y,
            dx, dy,
            direction
        });
    }


    return result;
};
*/