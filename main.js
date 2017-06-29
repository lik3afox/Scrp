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
            return (object.owner.username != 'Invader' && !_.contains(fox.friends, o.owner.username));
        });

        if (targets.length === 0) return;
        var e = targets.length;
        while (e--) {

            let nearRampart = targets[e].pos.findInRange(FIND_STRUCTURES, 1, {
                filter: object => (object.structureType == 'rampart')
            });

            if (nearRampart.length > 0) {

                var named = 'rampartD' + spawn.room.name;
                if (Game.flags[named] === undefined) {
                    console.log('lets place a flag here for defense');
                    spawn.room.createFlag(nearRampart[0].pos, named, COLOR_YELLOW, COLOR_PURPLE);
                } else {
                    console.log('extra rampart is available for guy');
                    var named2 = 'RA2' + spawn.room.name;
                    if (Game.flags[named2] === undefined && Game.flags[named].invaderTimed !== undefined &&
                        Game.flags[named].invaderTimed > 250) {
                        spawn.room.createFlag(nearRampart[0].pos, named2, COLOR_YELLOW, COLOR_WHITE);
                    } else {
                        if (_.contains(HardD, spawn.room.name)) {
                            var named3 = 'RA3' + spawn.room.name;
                            if (Game.flags[named3] === undefined &&
                                Game.flags[named].invaderTimed > 500) {
                                spawn.room.createFlag(nearRampart[0].pos, named3, COLOR_YELLOW, COLOR_WHITE);
                            }
                        }
                    }
                }

            }

        }

    }


    function globalCreep() {
        var scientist = 2;
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
                    if (sci2.length !== 0)
                        console.log('sci spawns', sci2.length);
                    total += sci2.length;
                }
            }

            console.log('Did a test for scientist found:' + total);
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
        var targets = spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        targets = _.filter(targets, function(object) {
            return (object.owner.username != 'Invader' && !_.contains(fox.friends, object.owner.username));
        });
        //    console.log('testin safemode',spawn.room.controller.safeModeCooldown);
        if (targets.length > 0 && spawn.room.controller.safeModeCooldown === undefined) {
            spawn.room.controller.activateSafeMode();
        }
    }

    function doUpgradeRooms() { //5836b82d8b8b9619519f19be
        if (Memory.war) return;
        let spwns = ['58c074ead62936ed5e2bce0b']; //,''
        if (Game.flags.recontrol !== undefined) return;
        var e = spwns.length;
        while (e--) {
            let spawn = Game.getObjectById(spwns[e]);
            let control = spawn.room.controller;
            if (control.level < 7) return;
            if (spawn === null) return;
            //    console.log(spawn, spawn.id, 'upgradde', control.level, control.progress, min.mineralAmount);
            if (control.level >= 7 && control.progress > 10900000) {
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
        console.log(boost, ':boost ', bads.length, ':Bad guys found @', bads[0].room, 'from:', bads[0].owner.username);
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
        if (Memory.showInfo === 0) return; // Low Grafana stats.
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

        /*        const memory_used = RawMemory.get().length;
                // console.log('Memory used: ' + memory_used);
                Memory.stats.memory = {
                    used: memory_used,
                    // Other memory stats here?
                }; */

        Memory.stats.market = {
            credits: Game.market.credits
                //        num_orders: Game.market.orders ? Object.keys(Game.market.orders).length : 0,
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

        rampartCheck(Game.spawns.Spawn1);
        var total = 0;
        spawnsDo.runCreeps();
        var spawnReport = {};
        var keys = Object.keys(Game.spawns);
        var t = keys.length;
        var title;
        while (t--) { // Start of spawn Loop
            title = keys[t];
            if (Game.spawns[title].room.energyCapacityAvailable !== 0 && Game.spawns[title].room.controller.level !== 0) {

                if (Memory.war) {
                    if (Game.spawns[title].memory.alphaSpawn) {
                        doRoomReport(Game.spawns[title].room);
                    }
                }

                //                safemodeCheck(Game.spawns[title]);

                //        safemodeCheck(Game.spawns[title]);

                ccSpawn.checkMemory(Game.spawns[title]); // This creates Arrays

                if (Game.spawns[title].memory.newSpawn === undefined) {
                    spawnsDo.checkNewSpawn(Game.spawns[title]);
                }

                if (Game.spawns[title].memory.alphaSpawn) {

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
                //                if (Game.bucket > 1000) {
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

                    ccSpawn.renewCreep(Game.spawns[title]);

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

        if (Memory.labsRunCounter === undefined) Memory.labsRunCounter = 2;
        Memory.labsRunCounter--;
        if (Memory.labsRunCounter <= 0) {
            Memory.labsRunCounter = 10;
            labs.run();
        }
        link.run();
        if (Memory.marketRunCounter === undefined) Memory.marketRunCounter = 10;
        Memory.marketRunCounter--;
        if (Memory.marketRunCounter <= 0) {
            Memory.marketRunCounter = 10;
            market.run();
        }
        //        Memory.totalPowerProcessed = 0;
        power.run();
        observer.run();
        globalCreep();
        doUpgradeRooms();
        memoryStatsUpdate();
        var twn = Game.getObjectById('59506a753d55600158180666');
        if (twn !== null)
            console.log(twn.hits, 'left');
        //        speedTest();
        //    whoWorksFor('5836b81b8b8b9619519f178d');
        /*5836b8308b8b9619519f19fa
        for(var e in Game.constructionSites) {
            if(Game.constructionSites[e].pos.roomName == 'W4S95'){
                Game.constructionSites[e].remove();
            }
        } */

        /*
                var twn = Game.getObjectById('58c8bbce6caaa767129ed296');
                var tgt = Game.getObjectById('595011c4714af6656b8819c9');
                if (twn !== null && tgt !== null)
                    if (tgt.hits == tgt.hitsMax) {
                        twn.attack(tgt);
                    } */
        /*var nuke = Game.getObjectById('58f6cad2d61015d119c60e23');
        if(nuke.cooldown === undefined || nuke.cooldown === 0)
            nuke.launchNuke(new RoomPosition(20
,30, 'E18S64')); */
        /*      var nuke = Game.getObjectById('58b8846bb286c56d754d0161');
        if (nuke.cooldown === undefined || nuke.cooldown === 0)
            nuke.launchNuke(new RoomPosition(27, 23, 'E16S63'));
*/

        if (Game.spawns.Spawn1 !== undefined) {
            let dif = Game.cpu.limit + (Game.spawns.Spawn1.memory.lastBucket - Game.cpu.bucket);
            console.log('*****PP:' + Memory.totalPowerProcessed + '*****************TICK REPORT:' + Game.time + '**********************' + Memory.creepTotal + '****' + dif + ':CPU|' + Game.cpu.limit + '|Max' + Game.cpu.tickLimit + '|buck:' + Game.cpu.bucket);
            Game.spawns.Spawn1.memory.lastBucket = Game.cpu.bucket;
        }

    });
