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
    var allModule = require('allModule');

    var prototypes = [
        require('prototype.creeps')
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

                                //                                  Game.flags[named].memory.invaderTimed > 500) {


                                //                                }

                            }
                        }


                    }

                }

            }

        }

    }


    function globalCreep() {
        var scientist = 1;
        if (Memory.scientistCheck === undefined) Memory.scientistCheck = 250;
        Memory.scientistCheck--;
        if (Memory.scientistCheck < 0) {
            Memory.scientistCheck = 250;
            let sci = _.filter(Game.creeps, function(o) {
                return o.memory.role == 'scientist';
            });
            let total = 0;
            total += sci.length;
            var keys = Object.keys(Game.spawns);
            var a = keys.length;
            var e;
            while (a--) {
                e = keys[a];
                if (Game.spawns[e].memory.alphaSpawn) {
                    let sci2 = _.filter(Game.spawns[e].memory.create, function(o) {
                        return o.memory.role == 'scientist';
                    });
                    //                   if (sci2.length !== 0)
                    //                        console.log('sci spawns', sci2.length);
                    total += sci2.length;
                }
            }

            //            console.log('Did a test for scientist found:' + total);
            if (total < scientist) {
                let temp = {
                    build: [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, ],
                    name: "eSci",
                    memory: {
                        role: 'scientist',
                    }
                };
                console.log('pushing temp ', temp);
                Game.spawns.Spawn1.memory.create.push(temp);
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
        let spwns = ['58c074ead62936ed5e2bce0b']; //,''
        if (Game.flags.recontrol !== undefined) return;
        var e = spwns.length;
        while (e--) {
            let spawn = Game.getObjectById(spwns[e]);
            let control = spawn.room.controller;
            if (control.level < 7) return;
            if (spawn === null) return;
            //    console.log(spawn, spawn.id, 'upgradde', control.level, control.progress, min.mineralAmount);
            if (control.level >= 7 && control.progress > 10900000 || control.level === 8) {
                if (Game.flags.recontrol === undefined) {
                    spawn.room.createFlag(control.pos, 'recontrol', COLOR_YELLOW);
                }
            }
        }
    }

    function createParty(report) {
        // With the report - we will create an array that is filled with the requirement part.
        // 2/3 melee, 1 repair, 1 range
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
        if (goods.length <= 3) {
            for (var i in goods) {
                if (goods[i].memory.role == 'linker') {
                    goods[i].memory.role = 'first';
                }
            }
            var spwns = room.find(FIND_STRUCTURES);
            spwns = _.filter(spwns, function(o) {
                return o.structureType == STRUCTURE_SPAWN;
            });
            if (spwns.length > 0) {
                if (!spwns[0].spawning && room.energyAvailable === 300) {
                    spwns[0].createCreep([CARRY, CARRY, MOVE, MOVE, CARRY, CARRY], 'emegyfir', {
                        role: 'first',
                        home: spwns[0].pos.roomName,
                        parent: "none",
                        level: 3
                    });
                }
            }

        }


        // Determine Room Type - If the walls are next to entrace or not. 
        /*        var roomDefense;
                if (roomDefense !== undefined) {
                    // Do close to exit defense
                } else {
                    // DO normal defense
                } */


        // Create defend party
        //        var defendParty = createParty(report);

    }

    function memoryStatsUpdate() {
        if (Memory.stats === undefined) {
            Memory.stats = { tick: Game.time };
        }
        // Note: This is fragile and will change if the Game.cpu API changes
        Memory.stats.cpu = Game.cpu;
        Memory.stats.cpu.used = Game.cpu.getUsed(); // AT END OF MAIN LOOP

        Memory.stats.powerProcssed = Memory.totalPowerProcessed;
        Memory.stats.creepTotal = Memory.creepTotal;

        // Note: This is fragile and will change if the Game.gcl API changes
        Memory.stats.gcl = Game.gcl;

        Memory.stats.market = {
            credits: Game.market.credits
        };

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

        if(Memory.stats === undefined) Memory.stats = {};

        if (Memory.war === undefined) Memory.war = true;

        if (Memory.showInfo === undefined) Memory.showInfo = 5;
        //profiler.wrap(function() {
        /*        let lastLoaded = Memory.loaded;
                if (Game.time == loaded) {
                    console.log("Script reload after", loaded - lastLoaded, "ticks took " + Game.cpu.getUsed().toFixed(3) + " CPU.");
                    Memory.loaded = Game.time;
                } */
        var i = prototypes.length;
        while (i--) {
            prototypes[i]();
        }

        var totalCreeps; // = spawnsDo.getCount(); // This also runs.
        var totalSpawn = 10;
        var report;
        var doSpawnChecks = false;

        if (Memory.stopRemoteMining === undefined) {
            Memory.stopRemoteMining = [];
        }
        if (Memory.doFlag === undefined) Memory.doFlag = 1;
        Memory.doFlag--;
        if (Memory.doFlag < 0) {
            flag.run(); // We do this part of the first stuff so we can go and find things in the flag rooms
            Memory.doFlag = 2;
        }
        // for creeps.

        var total = 0;
        spawnsDo.runCreeps();
        var spawnReport = {};
        var keys = Object.keys(Game.spawns);
        var t = keys.length;
        var title;
        while (t--) { // Start of spawn Loop
            title = keys[t];
            if (Game.spawns[title].room.energyCapacityAvailable !== 0 && Game.spawns[title].room.controller.level !== 0) {

                if (Game.cpu.bucket > 500) {
                    rampartCheck(Game.spawns[title]);
                    safemodeCheck(Game.spawns[title]);
                    ccSpawn.checkMemory(Game.spawns[title]); // This creates Arrays
                    if (Game.spawns[title].memory.newSpawn === undefined) {
                        spawnsDo.checkNewSpawn(Game.spawns[title]);
                    }
                }

                spawnsDo.checkBuild(Game.spawns[title]);

                //                  if (Memory.war) {
                if (Game.spawns[title].memory.alphaSpawn) {
//                    doRoomReport(Game.spawns[title].room);
                }
                //                    }

                //                safemodeCheck(Game.spawns[title]);

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

                let anySpawn = false;
                if (Game.spawns[title].memory.alphaSpawn) {
                    Game.spawns[title].memory.checkCount--;
                }
                    if ((Game.spawns[title].spawning === null)) {
                        ccSpawn.renewCreep(Game.spawns[title]);
                    }

                if (Game.cpu.bucket > 500)
                    if ((Game.spawns[title].spawning === null)) {
                        if (Game.spawns[title].memory.alphaSpawn) {

                            let zz = _.filter(Game.spawns, function(o) {
                                return (o.spawning === null) && o.room.name == Game.spawns[title].room.name && !o.memory.alphaSpawn;
                            });
                            if (zz.length > 0 || Game.spawns[title].spawning === null) anySpawn = true;

                            if (anySpawn) {
                                if (Game.spawns[title].memory.checkCount === undefined) {
                                    Game.spawns[title].memory.checkCount = countCheck;
                                }
                                if (Game.spawns[title].memory.checkCount < 0) {
                                    let zz = spawnsDo.spawnCount(Game.spawns[title].id);
                                    spawnsDo.checkModules(Game.spawns[title], zz);
                                    spawnsDo.checkExpand(Game.spawns[title], zz); // Checks roads and expansions to.
                                    Game.spawns[title].memory.checkCount = countCheck;
                                }
                            }

                        }
                        ccSpawn.createFromStack(Game.spawns[title]);

                        if (Game.spawns[title].memory.lastSpawn === undefined)
                            Game.spawns[title].memory.lastSpawn = 0;
                        Game.spawns[title].memory.lastSpawn++;


                        // This function is to make sure this spawn hasn't failed. 
                        //                      Game.spawns[title].deadCheck();

                    } else if (Game.spawns[title].memory.alphaSpawn && Game.spawns[title].memory.checkCount < -25) {
                    let zz = spawnsDo.spawnCount(Game.spawns[title].id);
                    spawnsDo.checkModules(Game.spawns[title], zz);
                    spawnsDo.checkExpand(Game.spawns[title], zz); // Checks roads and expansions to.
                    Game.spawns[title].memory.checkCount = countCheck;
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
                //                }
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
        link.run();
                Memory.totalPowerProcessed = 0;
//            doUpgradeRooms();
        if (Game.cpu.bucket > 250) {
//            power.run();
//            observer.run();
//            globalCreep();


            //            memorSmtatsUpdate();
            if (Memory.labsRunCounter === undefined) Memory.labsRunCounter = 2;
            Memory.labsRunCounter--;
            if (Memory.labsRunCounter <= 0) {
                Memory.labsRunCounter = 10;
                labs.run();
            }
        }
            if (Memory.marketRunCounter === undefined) Memory.marketRunCounter = 10;
            Memory.marketRunCounter--;
            if (Memory.marketRunCounter <= 0) {
                Memory.marketRunCounter = 10;
  //              market.run();
            }

        if (Game.spawns.Spawn1 !== undefined) {
            let dif = Game.cpu.limit + (Game.spawns.Spawn1.memory.lastBucket - Game.cpu.bucket);
            console.log('*****PP:' + Memory.totalPowerProcessed + '*****************TICK REPORT:' + Game.time + '**********************' + Memory.creepTotal + '****' + dif + ':CPU|' + Game.cpu.limit + '|Max' + Game.cpu.tickLimit + '|buck:' + Game.cpu.bucket);
            Game.spawns.Spawn1.memory.lastBucket = Game.cpu.bucket;
        }

    });