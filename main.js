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
    for (var e in Game.creeps) {
        if (Game.creeps[e].memory.goal == goal) {
            console.log(goal, Game.creeps[e].memory.home, Game.creeps[e].name, Game.creeps[e].memory.role, Game.creeps[e].pos, "lvl:", Game.creeps[e].memory.level);
        }
    }
}

function determineHomeEmpire() {
    Game.spawns.Spawn1.memory.homeEmpire = true;
}


function DoRenew(spawn) {
    /*    let zz = spawn.pos.findInRange(FIND_CREEPS, 1, {
            filter: object => ((object.memory == undefined || !object.memory.reportDeath) &&object.memory.role != undefined &&
                object.memory.role != 'scientist' && object.ticksToLive < 1300)
        });*/
    let zz = spawn.pos.findInRange(FIND_CREEPS, 1, {
        filter: object => (object !== null && object.memory !== undefined && object !== undefined && !object.memory.reportDeath &&
            object.memory.role != 'scientist' && object.ticksToLive < 1300)
    });
    if (zz.length === 0) return false;
    let creep = zz[0];
    spawn.renewCreep(creep);
}

function determineAlphaSpawn(spawn) {
    if (spawn.memory.alphaSpawn !== undefined) return true;

    let spwns = spawn.room.find(FIND_STRUCTURES, {
        filter: {
            structureType: STRUCTURE_SPAWN
        }
    });

    if (spwns.length == 1) {
        spwns[0].memory.alphaSpawn = true;
    }
    for (var a in spwns) {
        if (spwns[a].memory.alphaSpawn === undefined) {
            spwns[a].memory.alphaSpawn = false;
            spwns[a].memory.alphaSpawnID = spwns[0].id;
        }
    }

}

function rampartCheck(spawn) {


    var targets = spawn.room.find(FIND_HOSTILE_CREEPS, {
        filter: object => (object.owner.username != 'Invader' && object.owner.username != 'zolox'
                //&& object.owner.username != 'admon'
            )
            //            filter: object => (object.owner.username != 'Invader')
    });

    if (targets.length === 0) return;
    for (var e in targets) {

        let nearRampart = targets[e].pos.findInRange(FIND_STRUCTURES, 1, {
            filter: object => (object.structureType == 'rampart')
        });

        if (nearRampart.length > 0) {
            var named = 'rampartD' + spawn.room.name;
            if (Game.flags[named] === undefined) {
                console.log('lets place a flag here for defense');
                spawn.room.createFlag(nearRampart[0].pos, named, COLOR_YELLOW, COLOR_PURPLE);
            } else {

                Game.flags[named].setPosition(nearRampart[0].pos);
                break;
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
        for (var e in Game.spawns) {
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

function testFunction() {
    let nextBlue;
    let flags = Game.flags;
    let wanted = [];
    let highest = 0;
    let highFlag;
    let report = "Flag:";
    for (var e in flags) {
        if (flags[e].color == COLOR_BLUE) {
            report = report + " " + flags[e] + ":" + flags[e].memory.goldMined;

            wanted.push(flags[e]);
            if (flags[e].memory.goldMined > highest) {
                highest = flags[e].memory.goldMined;
                highFlag = flags[e];
            }
        }
    }

    console.log(report);
    console.log(highFlag, highFlag.pos);
}

function safemodeCheck(spawn) {
    var targets = spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {
        filter: object => (object.owner.username != 'Invader' && object.owner.username != 'zolox')
    });
    //    console.log('testin safemode',spawn.room.controller.safeModeCooldown);
    if (targets.length > 0 && spawn.room.controller.safeModeCooldown === undefined) {
        spawn.room.controller.activateSafeMode();
    }
}

function doUpgradeRooms() { //5836b82d8b8b9619519f19be
    let spwns = ['58c074ead62936ed5e2bce0b']; //,''
    if (Game.flags.recontrol !== undefined) return;

    for (var e in spwns) {
        let spawn = Game.getObjectById(spwns[e]);
        let control = spawn.room.controller;
        if (control.level < 7) return;
        if (spawn === null) return;
        //    console.log(spawn, spawn.id, 'upgradde', control.level, control.progress, min.mineralAmount);
        if (control.level >= 7 && control.progress > 10900000) {
            if (Game.flags.recontrol === undefined) {

                spawn.room.createFlag(control.pos, 'recontrol', COLOR_YELLOW);
                let zz = spawn.room.find(FIND_CREEPS);
                zz = _.filter(zz, function(o) {
                    return o.memory.role == 'miner';
                });
                if (zz.length > 0) zz[0].suicide();
            }
        }
    }
}
var loaded = Game.time;

//const profiler = require('screeps-profiler');
//profiler.enable();

var Console = require('console-commands');

module.exports.loop = function() {
    //    Console.wrap(function() {
    var start = Game.cpu.getUsed();

    //profiler.wrap(function() {
    /*        let lastLoaded = Memory.loaded;
            if (Game.time == loaded) {
                console.log("Script reload after", loaded - lastLoaded, "ticks took " + Game.cpu.getUsed().toFixed(3) + " CPU.");
                Memory.loaded = Game.time;
            } */

    for (let i in prototypes) {
        prototypes[i]();
    }

    var totalCreeps; // = spawnsDo.getCount(); // This also runs.
    var totalSpawn = 10;
    var report;
    var doSpawnChecks = false;

    //    console.log('********************START REPORT****************************');
    safemodeCheck(Game.spawns.Spawn1);
    if (Memory.doFlag === undefined) Memory.doFlag = 1;
    Memory.doFlag--;
    if (Memory.doFlag === 0) {
        Memory.doFlag = 2;
        flag.run(); // We do this part of the first stuff so we can go and find things in the flag rooms
    }
    // for creeps.


    var total = 0;
    spawnsDo.runCreeps();

    for (var title in Game.spawns) { // Start of spawn Loo
        if (Game.spawns[title].room.energyCapacityAvailable !== 0 && Game.spawns[title].room.controller.level !== 0) {
            // report = '';
            //                    if (Game.spawns[title].memory.alphaSpawn)
            //console.log(  (Game.cpu.getUsed() - start ), ' Start of spawn'); start = Game.cpu.getUsed();
            rampartCheck(Game.spawns[title]);
            //        safemodeCheck(Game.spawns[title]);

            ccSpawn.checkMemory(Game.spawns[title]); // This creates Arrays
            determineAlphaSpawn(Game.spawns[title]);
            // Don't always need to do this. but keep this in mind that it should be checked... mmm
            if (Game.spawns[title].room.controller.level == 1) {
                determineHomeEmpire(Game.spawns);
            }

            if (Game.spawns[title].memory.newSpawn === undefined) {
                spawnsDo.checkNewSpawn(Game.spawns[title]);
            }

            /*        if(Game.spawns[title].memory.alphaSpawn){
                        let zz= Math.ceil(Game.cpu.getUsed() - start );
                        let tt = Math.ceil(zz/Game.spawns[title].memory.totalCreep*100)
                        total = total + zz;
                console.log( Game.spawns[title].memory.totalCreep,"/",zz,"(",tt,")", ' after',Game.spawns[title].name,total); 
                    }*/

            if (Game.spawns[title].memory.alphaSpawn) {

                totalSpawn++;
                Game.spawns[title].memory.segmentID = totalSpawn;
                tower.run(Game.spawns[title].pos.roomName); // Tower doing stuff.
                /*
                                if(Game.spawns[title].memory.roomCheck == undefined) { 
                                    Game.spawns[title].memory.roomCheck = roomCheck;
                                }
                               Game.spawns[title].memory.roomCheck--;

                                if(Game.spawns[title].memory.roomCheck < 0){
                                Game.spawns[title].memory.roomCheck = roomCheck;

                                for (var name in Game.rooms) { // Start of Room loop w/ spawn
                                    if (Game.spawns[title].pos.roomName == Game.rooms[name].name) {
                                        if (!ccSpawn.analyzed(Game.spawns[title].memory, Game.rooms[name].name)) {
                                            ccSpawn.homeAnalyzed(Game.rooms[name], Game.spawns[title]);
                                        }
                                    } else {
                                    // See if this room has been analyzed by this spawn. 
                                    // Analyze Room for this spawn
                                    if (!ccSpawn.analyzed(Game.spawns[title].memory, Game.rooms[name].name)) {
                                        ccSpawn.analyzeRoom(Game.spawns[title], Game.rooms[name]);
                                    }
                                }
                            } // End of room loop. 
                        }
                 */
            }

            let anySpawn = false;
            if (Game.spawns[title].memory.alphaSpawn) {
                Game.spawns[title].memory.checkCount--;
            }
            if ((Game.spawns[title].spawning === null)) {
                if (Game.spawns[title].memory.alphaSpawn) {

                    let zz = _.filter(Game.spawns, function(o) {
                        return (o.spawning === null || o.spawning === null) && o.room.name == Game.spawns[title].room.name && !o.memory.alphaSpawn;
                    });
                    if (zz.length > 0) anySpawn = true;
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
                if (Game.spawns[title].memory.autoRenew)
                    DoRenew(Game.spawns[title]);

                ccSpawn.createFromStack(Game.spawns[title]);

                if (Game.spawns[title].memory.lastSpawn === undefined)
                    Game.spawns[title].memory.lastSpawn = 0;
                Game.spawns[title].memory.lastSpawn++;
                ccSpawn.renewCreep(Game.spawns[title]);
                // This function is to make sure this spawn hasn't failed. 
                Game.spawns[title].deadCheck();

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
            if (Game.spawns[title].memory.alphaSpawn) {
                ccSpawn.report(Game.spawns[title], report);
                //            if (Game.spawns[title].memory.alphaSpawn) console.log('---------------------------------------------------------------------------');
            }
        }
        //           if (Game.spawns[title].memory.alphaSpawn)
        //            console.log(  (Game.cpu.getUsed() - start ), ' End Spawn loop'); start = Game.cpu.getUsed();

    } // End of Spawns Loops

    //        var total = 0;
    //    for (var e in Game.constructionSites) {
    //        Game.constructionSites[e].remove();
    //       total++;
    //    }

    if (Memory.labsRunCounter === undefined) Memory.labsRunCounter = 2;
    Memory.labsRunCounter--;
    if (Memory.labsRunCounter <= 0) {
        Memory.labsRunCounter = 5;
        labs.run();
    }
    link.run();
    if (Memory.marketRunCounter === undefined) Memory.marketRunCounter = 10;
    Memory.marketRunCounter--;
    if (Memory.marketRunCounter <= 0) {
        Memory.marketRunCounter = 10;
        market.run();
    }
    observer.run();
    power.run();
    globalCreep();
    doUpgradeRooms();
    //zz = Game.getObjectById('59024ff4b8400157a89165f7');
    //console.log(zz.room.powerspawn);
    /*
    console.log(zz.hits,zz.pos);
    zz = Game.getObjectById('58ba75aa041adbe4312ca6ac');
    console.log(zz.hits,zz.pos);
    zz = Game.getObjectById('58ba7da1f942eb2e281e3639');
    console.log(zz.hits,zz.pos);
    zz = Game.getObjectById('58c620e7ac1eea7e06bc317e');
    console.log(zz.hits,zz.pos);
     */
    //
    //    if( Game.cpu.bucket > 4000)
    // 900
    // 1500
    //RawMemory.setActiveSegments([0,3,]);
    // on the next tick
    //RawMemory.segments[5] = 'hf';
    /*RawMemory.segments[0] = 'hf';*/
    //RawMemory.segments[3] = '{"foo": "bar", "counter": 15}';
    //    testFunction();

    // currentModule[type][_require].levels(currentModule[type][_level])
    // let miner = require('role.miner');
    // console.log(miner.levels(1,'5836b82b8b8b9619519f1967' ) )
    /*
        let array = ['5836b82b8b8b9619519f1972','5836b82b8b8b9619519f1976','5836b8288b8b9619519f1915','5836b8288b8b9619519f1913'];

        if(array.length != 0){
        for(var e in array) {
            whoWorksFor(array[e]);
        }
        } 

5836b8288b8b9619519f1915 5836b8288b8b9619519f1913
        let target = 29;
        for(var e in Game.spawns) {
            let spawn = Game.spawns[e];
            if(spawn.memory.roadsTo != undefined) {
            console.log(e,":",target)
                for(var a in spawn.memory.roadsTo) {
        //            console.log(target,spawn.memory.roadsTo[a].expLevel )
        if(spawn.memory.roadsTo[a].expLevel == 29) {
            spawn.memory.roadsTo[a].expLevel = 20;
        }
                    if(target == spawn.memory.roadsTo[a].expLevel) {
                        console.log("   ",spawn,":", spawn.memory.roadsTo[a].sourcePos.roomName);
                        let ext = spawn.memory.roadsTo[a];
                            for(var e in ext){
                                console.log(e,ext[e]);
                            }
        //for(var e in array) {
            whoWorksFor(spawn.memory.roadsTo[a].source);room E25S74 pos 38,34]
        //}

                    }
                }
            }
        }
        */

    if (Game.spawns.Spawn1 !== undefined) {
        let dif = Game.cpu.limit + (Game.spawns.Spawn1.memory.lastBucket - Game.cpu.bucket);
        console.log('*****PP:' + Memory.totalPowerProcessed + '*****************TICK REPORT:' + Game.time + '****************************' + dif + ':CPU|' + Game.cpu.limit + '|Max' + Game.cpu.tickLimit + '|buck:' + Game.cpu.bucket);
        Game.spawns.Spawn1.memory.lastBucket = Game.cpu.bucket;
    }


    //  });
};
