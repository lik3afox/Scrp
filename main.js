var codePush;
var showCPU;
var ticksInARow;

function changeEmpireSettings() {

    if (Game.time % 1500 !== 0 && ticksInARow !== undefined) return;
    if (Game.shard.name !== 'shard1') return;
    Memory.empireSettings = {
        processPower: true, // sellPower:false, stops jobs.spawns, stops commands.topower. 
        sellPower: 0.75, // if there is 
        buyPower: 0.30,
        maxWallSize: 299000000, // This is the setting for max wall size. 
        maxController: 100000, // When upgrader is made. - 1500
        // MaxController has a random factor of up to 15000;
        // If room has energy in it's random * 15000 + 10000;
        maxMineralAmount: 600000, // This is the threshold to sell minerals.

        boostObserverRoom: {
            shard1: 'E18S36',
        },


        // Cheap energy buy, at most is 150000 - we would at most pay 75000 at a max price of 0.005 - so 
        // 0.0075(transferPercent + 1 * maxPrice) = 0.0075
        cheapEnergyBuy: {
            amount: 100000, // Amount at most we would buy 
            transferPercent: 0.5, // The amount of transfer we would accept
            maxPrice: 0.007, // Price we would accpet at highest.
        },


        boost: {
            power: true, // Disable Power Boosting
            guard: true, // Disable SKGuard boosting
            upgrade: true, // Disable Upgrade boosting


            wallwork: true, // Wallwork
            harvest: true, // Harverst - room
            mineral: true, // Mineral 
        },
        market: {
            energy: true, // Enables NewEnergyTrade.
            basic: true, // Turn off/on to create sell orders for minerals above maxMineralAmount
            token: true, // Turn off/on to create/match token orders.
            value: true, // Turn off/on to create sell Power and other valueable stuff above maxMineralAmount.
            tier1: true,


            // Minerals seem to be worth around .04 
            // Lab time is roughly around .003 per ALT to .02 per ALT
            // 

            tier1Sell: 0.1, // This is the value to sell at. 1.4/2 = 0.7 ALT = 10
            tier1GSell: 0.35, // This is the value to sell at. 5 = 0.7 ALT = 15

            tier2: true,
            tier2Sell: 0.285, // This is the value to sell at. 2.8/4 = 0.7  ALT = 35
            tier2GSell: 0.6, // This is the value to sell at. 7 = 0.7 ALT = 50/65

            tier3: true, // Will auto sell Tier3 Mats if they are above a value.
            tier3Sell: 3.5, // This is the value to sell at. 3.5/5 = 0.7 ALT = 95~
            tier3GSell: 5, // This is the value to sell at. 8 = 0.7 ALT = 130-200~
            tier3Buy: 0.9, // This is the value to sell at. 3.5/5 = 0.7 ALT = 95~
            tier3GBuy: 0.9, // This is the value to sell at. 8 = 0.7 ALT = 130-200~

        }
    };

    let energyCost = Memory.mineralAverage.energy.buy;
    let HBuyCost = Memory.mineralAverage.H.buy;
    let OBuyCost = Memory.mineralAverage.O.buy;
    let UBuyCost = Memory.mineralAverage.U.buy;
    let LBuyCost = Memory.mineralAverage.L.buy;
    let KBuyCost = Memory.mineralAverage.K.buy;
    let ZBuyCost = Memory.mineralAverage.Z.buy;
    let XBuyCost = Memory.mineralAverage.X.buy;

    let OHBuyCost = HBuyCost + OBuyCost;
    let GBuyCost = UBuyCost + LBuyCost + ZBuyCost + KBuyCost;
    let averageBasic = GBuyCost / 4;
    let tier1Cost = averageBasic + (OHBuyCost * 0.5);
    let tier2Cost = tier1Cost + OHBuyCost;
    let tier3Cost = tier2Cost + XBuyCost;

    let tier1GCost = GBuyCost + (OHBuyCost * 0.5);
    let tier2GCost = tier1GCost + OHBuyCost;
    let tier3GCost = tier2GCost + XBuyCost;

    // 0.05 = .005 credits per cooldown.  Current setup makes .005 credits per cooldown.
    Memory.empireSettings.tier1Sell = tier1Cost + 0.05;
    Memory.empireSettings.tier2Sell = tier2Cost + 0.10;

    Memory.empireSettings.tier3Buy = tier3Cost; // * 1.2;
    Memory.empireSettings.tier3GBuy = tier3GCost; // * 1.2;

    Memory.empireSettings.tier1GSell = tier1GCost + 0.10;
    Memory.empireSettings.tier2GSell = tier2GCost + 0.25;
    console.log('SHARD AVERAGE:  energy', energyCost, "TotalEnergy:", Memory.stats.empireEnergy, "H:", HBuyCost, "Basic4Ave:", averageBasic, "T1Cost:", Memory.empireSettings.tier1Sell, "T2Cost:", Memory.empireSettings.tier2Sell, "T3Cost:", tier3Cost, "/", Memory.empireSettings.tier3Sell);
    //  console.log("G SELLLING basic:", GBuyCost, "T1:", Memory.empireSettings.tier1GSell, "T2:", Memory.empireSettings.tier2GSell, "T3:", tier3GCost);
    //    console.log("BUY THRESHOLDS T3:", Memory.empireSettings.tier3Buy, "T3G:", Memory.empireSettings.tier3GBuy);
    /*if (energyCost > 0.035) {
        //    console.log("MAX ENERGY SELL");
        //     Memory.empireSettings.maxWallSize = 050000000;
//        Memory.empireSettings.maxController -= 9000;
//        Memory.terminalDoNewTrade = true;
        console.log('EMPIRE SETTING At: max Tier', Memory.empireSettings.maxWallSize, Memory.empireSettings.maxController, Memory.terminalDoNewTrade);
    } else if (energyCost > 0.02) {
        // First tier change.
        //  console.log("TIER1 Change");
        //   Memory.empireSettings.maxWallSize = 150000000;
        //Memory.empireSettings.maxController -= 4500;
        Memory.terminalDoNewTrade = undefined;
        console.log('EMPIRE SETTING At: Tier 2', Memory.empireSettings.maxWallSize, Memory.empireSettings.maxController, Memory.terminalDoNewTrade);
    } else if (energyCost >= 0.010) {
        Memory.empireSettings.maxController -= 1500;
        console.log('EMPIRE SETTING At: Tier1', Memory.empireSettings.maxWallSize, Memory.empireSettings.maxController, Memory.terminalDoNewTrade);
    } else { // So if below 0.02 do not change anything
        Memory.empireSettings.maxWallSize = 299000000;
        //        Memory.empireSettings.maxController = 100000;
        Memory.terminalDoNewTrade = undefined;
        console.log('EMPIRE SETTING At: Base Tier', Memory.empireSettings.maxWallSize, Memory.empireSettings.maxController, Memory.terminalDoNewTrade);
    }*/
    if (Memory.empireSettings.maxController < 10000) Memory.empireSettings.maxController = 10000;

    if (codePush === undefined) codePush = Game.time;
    console.log('Last CodePush:', codePush, "Time Passed:", (Game.time - codePush));
}


function showMineInfo(roomName) {
    if (Game.rooms[roomName] === undefined) return;
    if (Game.rooms[roomName].memory.mineInfo === undefined) return;
    //if (Game.shard.name !== 'shard1') return;
    if (Game.rooms[roomName].memory.mineInfo['undefined'] !== undefined) Game.rooms[roomName].memory.mineInfo.undefined = undefined;
    let room = Game.rooms[roomName];
    var lineY = 0;
    var totalHarvest = 0;
    var totalSpent = 0;
    var totalAverage = 0;
    var font = { color: '#00FF00 ', stroke: '#111111 ', strokeWidth: 0.123, font: 0.5, align: RIGHT };
    /*
    Game.rooms[roomName].memory.mineInfo = _.sortBy(Game.rooms[roomName].memory.mineInfo, function(n) {
      return n;
    });
    */
    for (var e in Game.rooms[roomName].memory.mineInfo) {
        if (!_.isObject(Game.rooms[roomName].memory.mineInfo[e])) {
            Game.rooms[roomName].memory.mineInfo[e] = undefined;
            continue;
        }
        if (e === 'undefined') {
            Game.rooms[roomName].memory.mineInfo[e] = undefined;
            continue;
        }
        // Showing info - ID
        let xx = 1;
        let yy = 1 + lineY;
        room.visual.text(e, xx - 5, yy, font);

        xx = 5;
        if (!Game.rooms[roomName].memory.mineInfo[e].pos) {
            let tgt = Game.getObjectById(e);
            if (tgt) {
                Game.rooms[roomName].memory.mineInfo[e].pos = {
                    x: tgt.pos.x,
                    y: tgt.pos.y,
                    roomName: tgt.pos.roomName,
                };
            }
        }
        if (Game.rooms[roomName].memory.mineInfo[e].pos) {
            if (Game.rooms[roomName].memory.mineInfo[e].isSkSource) {
                room.visual.text("*" + Game.rooms[roomName].memory.mineInfo[e].pos.roomName + ":" + Game.rooms[roomName].memory.mineInfo[e].pos.x + "," + Game.rooms[roomName].memory.mineInfo[e].pos.y, xx, yy, font);
            } else {
                room.visual.text(Game.rooms[roomName].memory.mineInfo[e].pos.roomName + ":" + Game.rooms[roomName].memory.mineInfo[e].pos.x + "," + Game.rooms[roomName].memory.mineInfo[e].pos.y, xx, yy, font);
            }
        }

        xx = 10;
        // harvest total for last 15000
        room.visual.text(Game.rooms[roomName].memory.mineInfo[e].mean + "[" + Game.rooms[roomName].memory.mineInfo[e].history[Game.rooms[roomName].memory.mineInfo[e].history.length - 1].harvested + "]" + "(" + Game.rooms[roomName].memory.mineInfo[e].harvested + ")", xx, yy, font);
        totalAverage += Game.rooms[roomName].memory.mineInfo[e].mean;
        // Spent
        xx = 20;
        room.visual.text(Game.rooms[roomName].memory.mineInfo[e].spent, xx, yy, font);
        totalSpent += Game.rooms[roomName].memory.mineInfo[e].spent;
        //xx = 25;
        //      room.visual.text('time' ,xx,yyy,font);
        // Level
        xx = 17;
        if (Game.rooms[roomName].memory.mineInfo[e].level === undefined) Game.rooms[roomName].memory.mineInfo[e].level = 0; // This will be for home sources.
        if (Game.rooms[roomName].memory.mineInfo[e].counter === undefined) Game.rooms[roomName].memory.mineInfo[e].counter = 0; // This will be for home sources.

        room.visual.text(Game.rooms[roomName].memory.mineInfo[e].level, xx, yy, font); //+"("+Game.rooms[roomName].memory.mineInfo[e].counter+")"

        //      room.visual.text(Game.rooms[roomName].memory.mineInfo[e].reset-Game.time ,xx,yy,font);
        xx = 25;

        room.visual.text(Game.rooms[roomName].memory.mineInfo[e].profit, xx, yy, font);
        xx = 30;

        room.visual.text(Game.rooms[roomName].memory.mineInfo[e].efficient + "%", xx, yy, font);
        lineY++;

    }


    let yyy = 0;
    let xx = 1;
    room.visual.text('id', xx, 0, font);
    xx = 10;
    room.visual.text('harvested[last](current)', xx, 0, font);
    xx = 17;
    room.visual.text('Level', xx, 0, font);
    xx = 20;
    room.visual.text('Spent', xx, 0, font);
    xx = 25;
    room.visual.text('Profit', xx, 0, font);
    xx = 30;
    room.visual.text('efficient', xx, 0, font);


    font = { color: '#FF0000', stroke: '#111111 ', strokeWidth: 0.123, font: 0.5, };
    //      room.visual.text("Total Harvest: "+totalHarvest ,10, lineY+1,font);
    room.visual.text("Total Average: " + totalAverage, 12, lineY + 1, font);
    room.visual.text("Total Spent  : " + totalSpent, 20, lineY + 1, font);
    //      room.visual.text("Diff: "+(totalAverage-totalSpent) ,25, lineY+1,font);

}


function rampartCheck(spawn) {
    let targets = spawn.room.enemies;
    targets = _.filter(targets, function(o) {
        return o.body.length > 5;
    });
    if (targets.length === 0) return;
    var HardD = [];
    var mediumD = [];
    var flagName;


    let structures = spawn.room.find(FIND_STRUCTURES);

    var ramp = _.filter(structures, function(o) {
        return ((o.structureType === STRUCTURE_RAMPART && !o.isPublic) || o.structureType === STRUCTURE_WALL) && o.hits < 500000;
    });
    if (ramp.length > 1) {
        if (targets.length > 0 && spawn.room.controller.safeModeCooldown === undefined) {
            spawn.room.controller.activateSafeMode();
            flagName = 'safemode' + spawn.room.name;
            if (Game.flags[flagName] === undefined) {
                spawn.room.createFlag(25, 25, flagName, COLOR_YELLOW, COLOR_YELLOW);
            }
            Game.notify('SAFE MODE ACTIVATED DUE TO WEAK WALLS' + spawn.room.name);
        }
    }
    let rangerCount = 0;
    flagName = 'wallwork' + spawn.room.name;
    // Defense Against Rangers/Mage isn't to create melee, but it's to create counter repairers. 
    if (!Game.flags[flagName] || !Game.flags[flagName].memory.analyzed) {
        for (let ee in targets) {
            let ana = analyzeCreep(targets[ee]);
            if (ana.type === 'ranger' || ana.type === 'mage') {
                rangerCount++;
            }
        }
        if (rangerCount > 0) {
            let level = 5;
            if (rangerCount > 6) {
                rangerCount = 2;
                level = 6;
            } else if (rangerCount > 3) {
                rangerCount = 1;
                level = 6;
            }
            let flag = Game.flags[flagName];
            if (flag === undefined) {

                spawn.room.createFlag(25, 25, flagName, COLOR_YELLOW, COLOR_YELLOW);
            } else {
                flag.memory.musterRoom = spawn.room.name;
                flag.memory.analyzed = true;
                if (flag.memory.removeFlagCount === undefined) flag.memory.removeFlagCount = 1250;
                if (flag.memory.party === undefined) {
                    flag.memory.party = [
                        ['wallwork', rangerCount, level]
                    ];
                }
                Game.notify(targets[0].owner.username + ' is attacking and RANGER/MAGE attack to creating wallwork to counter' + spawn.room.name);
            }
        }
    }

    let e = targets.length;
    let named2 = 'RA2' + spawn.room.name;
    let named = 'rampartD' + spawn.room.name;
    let named3 = 'RA3' + spawn.room.name;
    if (targets[0].body.length > 10) {
        Game.notify(targets[0].owner.username + '  is in room: ' + spawn.room.name + " time: " + roomHistory(spawn.room.name, Game.time) + "  Num:" + e + "x" + targets[0].body.length, 180);

    }
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


                    if (_.contains(mediumD, spawn.room.name) && Game.flags[named2] === undefined) {


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


function doRoomReport(room, isTenTime) {
    var nukes = room.find(FIND_NUKES);
    let name = 'nukeRepair' + room.name;
    if (nukes.length === 0) {
        if (Game.flags[name]) {
            Game.flags[name].memory.remove = true;
        }
    }
    if (nukes.length > 0) {
        room.memory.nukeIncoming = true;
        for (var e in nukes) {

            console.log(nukes.length, 'NUKE INCOMING @', nukes[e].room, ' from:', nukes[e].launchRoomName, name, 'landing time', nukes[e].timeToLand);
            if (Game.flags[name] === undefined && nukes[e].timeToLand > 1500) {
                room.createFlag(nukes[e].pos, name, COLOR_YELLOW, COLOR_YELLOW);
            } else if (Game.flags[name]) {
                Game.flags[name].memory.musterRoom = room.name;
                Game.flags[name].memory.party = [
                    ['wallwork', 1, 6]
                ];
            }

            if (nukes[e].timeToLand < 150) {
                let evacName = 'eva' + room.name;
                if (Game.flags[evacName] === undefined) {
                    room.createFlag(nukes[e].pos, evacName, COLOR_WHITE, COLOR_WHITE);
                } else {
                    let flag = Game.flags[evacName];
                    if (flag.memory.evacuateTimer === undefined) flag.memory.evacuateTimer = 102;
                    flag.memory.evacuate = true;
                }
            }

        }
    }

    if (isTenTime === undefined) isTenTime = Game.time % 10;

    switch (isTenTime) {
        case 1:
            var bads = room.enemies;
            var numBads = bads.length;
            if (numBads > 0) {
                //        var report = analyzeHostiles(bads); // Here we get a report of the bads.
                Game.notify(numBads + '# of ' + bads[0].owner.username + ' guys found @' + bads[0].room + "  " + Game.time);
            }
            break;
        case 2:
            if (room.controller.level >= 3 && room.name !== 'E59S51') {

                var goods = room.find(FIND_MY_CREEPS);
                goods = _.filter(goods, function(o) {
                    return o.memory.home === room.name && (o.memory.role === 'job' || o.memory.role === 'first');
                });
                room.memory.currentJobWorkers = goods.length;
                if (goods.length === 0 && room.alphaSpawn.spawning === null && room.energyAvailable >= 300 && room.energyAvailable < 2400) { //&& room.energyAvailable < 2400
                    Game.notify(room.name + " has emegyfir created @ " + roomHistory(room.name, Game.time));
                    var zz = room.alphaSpawn.spawnCreep([CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, ], 'emegyfir' + Math.floor(Math.random() * 100), {
                        memory: {
                            role: 'first',
                            roleID: 0,
                            home: room.name,
                            parent: "none",
                            level: 3
                        }
                    });

                }
            }

            break;
        case 3:
            break;
    }



}

function consoleLogReport(breakNum) {
    //    if(Game.shard.name !== 'shard2'){
    if (Game.time % 256 > 0) {
        return;
    }
    //  }
    let report = "";
    for (let a in Memory.shardNeed) {
        report += " " + Memory.shardNeed[a];
    }

    let breakTimed = "";
    if (Game.shard.name === 'shard1') {
        if (breakNum === 0) {
            //            breakTimed = "X500X";
            console.log("BREAK BREAK XXXX < 500 - no CREEP MOVEMENT");
            Memory.delayCount = 5;
        } else if (breakNum === 1) {
            //          breakTimed = "Y1000";
            console.log("BREAK BREAK YYYY - NOTHING AFTER CREEPS");
        } else {
            //        breakTimed = "+++++";
        }
    }
    let color = '<a style="color:#0afaff">';
    let endColor = '</a>';
    let shard = Game.shard.name;
    let segmentNumUsed = Memory.shardNeed.length;
    //segmentNumUsed = JSON.stringify(segmentNumUsed).padStart(2, "0");
    let powerProcessed = Memory.stats.powerProcessed;
    if (powerProcessed === undefined) powerProcessed = 0;
    let segmentsUsed = report;
    let gameTime = Game.time;
    //  gameTime = JSON.stringify(gameTime).padStart(8, "0");
    let creepTotal = Memory.creepTotal;
    //    creepTotal = JSON.stringify(creepTotal).padStart(3, "0");
    //let cpuUsed = dif;
    let cpuLimit = Game.cpu.limit;
    //cpuLimit = JSON.stringify(cpuLimit).padStart(3, "0");
    let cpuCeil = Game.cpu.tickLimit;
    //  cpuCeil = JSON.stringify(cpuCeil).padStart(3, "0");
    let cpuBucket = Game.cpu.bucket;
    //    cpuBucket = JSON.stringify(cpuBucket).padStart(5, "0");
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
        case "shard2":
            color = '<a style="color:#af0aff">';
            filler = "$$$" + Game.shard.name + "$$$";
            break;
    }
    if (Game.cpu.getHeapStatistics !== undefined) {
        console.log(color + shard + "[" + ticksInARow + "]" + filler + breakTimed + "  Tick #" + gameTime + "  Total Creeps:(" + creepTotal + ") Bucket: " + cpuBucket + " " + cpuLimit + "/" + cpuCeil + filler + " Seg#" + segmentNumUsed + " PP:" + powerProcessed + "#" + (`Used ${Game.cpu.getHeapStatistics().total_heap_size} / ${Game.cpu.getHeapStatistics().heap_size_limit}`));
    } else {

        console.log(color + shard + filler + "  Tick #" + gameTime + "  Total Creeps:(" + creepTotal + ") Bucket: " + cpuBucket + " " + cpuLimit + "/" + cpuCeil + filler + " Seg#" + segmentNumUsed + " PP:" + powerProcessed);

    }

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
    //    if (Game.rooms[roomName] && Game.rooms[roomName].memory.weakestWall !== undefined) return Game.rooms[roomName].memory.weakestWall;
    if (Game.rooms[roomName] === undefined) return 0;
    if (Game.shard.name === 'shard3') return 0;
    let room = Game.rooms[roomName];
    if(!room.memory.weakestWall) return 0;
    if (Game.time % 1500 !== 0) return room.memory.weakestWall;
    if(Memory.threeLowestWalls === undefined){
        Memory.threeLowestWalls = ['E39S51','E13S18','E21S49'];
    }
    if(!_.contains(Memory.threeLowestWalls,roomName)){
        for(let i in Memory.threeLowestWalls){
            if(Game.rooms[Memory.threeLowestWalls[i]]){
                let wall = Game.rooms[ Memory.threeLowestWalls[i] ].memory.weakestWall;
                if(room.memory.weakestWall < wall-1000000 ){
                    Memory.threeLowestWalls[i] = roomName;
                    break;
                }
            } else {
                console.log(Memory.threeLowestWalls[i],"ROOM NOT THERE?");
            }
        }
    }
    return room.memory.weakestWall;

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
//const profiler = require('screeps-profiler');

function blackMagic(fn) {

    let memory;
    let tick;
    var prototypes = [
        require('prototype.global'),
        require('prototype.creeps'),
        require('prototype.room')
    ];
    return () => {
        // Main.js logic should go here.

        if (ticksInARow === undefined) {
            for (let i = 0, e = prototypes.length; i < e; i++) {
                prototypes[i]();
            }
        }

        if (tick && tick + 1 === Game.time && memory) {
            delete global.Memory;
            Memory = memory;
        }
        memory = Memory;
        tick = Game.time;
        fn();
        if (ticksInARow === undefined) { ticksInARow = 0; }
        ticksInARow++;
        RawMemory._parsed = Memory;
    };
}


var spawnCount;
module.exports.loop = blackMagic(function() {
    if (Memory.delayCount && Memory.delayCount > 0) {
        Memory.delayCount--;
        console.log(Memory.delayCount, "NO action recoup ticks.", Game.cpu.bucket);
        return;
    } else {
        Memory.delayCount = undefined;
    }
    var start = Game.cpu.getUsed();
    var startCpu;
    //if(Game.shard.name === 'shard1') showCPU = true;
    if (showCPU) {
        startCpu = Game.cpu.getUsed();
        console.log('----NEW TICK:', Game.time, Game.cpu.bucket);
    }

    changeEmpireSettings();

    var _terminal = require('build.terminal');
    var flag = require('build.flags');
    var power = require('build.power');
    var pCreeps = require('commands.toPower');
    var observer = require('build.observer');
    var tower = require('build.tower');
    var comCreeps = require('commands.toCreep');
    var comSpawn = require('commands.toSpawn');
    var link = require('build.link');
    var labs = require('build.labs');
    var seg = require('commands.toSegment');

    var isTenTime = Game.time % 10;

    if (Game.shard.name === 'shard1') {
        if (Game.time % 100 < 7) {
            let room = Game.rooms.E21S31;
            if (room === undefined) {
                require('build.observer').reqestRoom('E21S31', 1);
            } else {
                let mins = ['X', 'U', 'L', 'Z', 'K', 'O', 'H'];
                for (let i in mins) {
                    if (Memory.stats.totalMinerals[mins[i]] > 100000 && (!room.terminal.store[mins[i]] || room.terminal.store[mins[i]] < 10000)) {
                        let rsut = roomRequestMineral('E21S31', mins[i], 2000);
                        break;
                    }
                }
            }
        }
    }
    doMemory();

    let creepStopCPU;
    switch (Game.shard.name) {
        case 'shard0':
            creepStopCPU = 100;
            break;
        case 'shard1':
            creepStopCPU = 500;
            break;
        case 'shard2':
            creepStopCPU = 100;
            break;
        case 'shard3':
            creepStopCPU = 100;
            break;
    }

    let powerCreepCPU = Game.cpu.getUsed();
    if (Game.shard.name === 'shard1') pCreeps.runPowerCreeps();
    if (showCPU) {
        let cnt = Game.cpu.getUsed() - powerCreepCPU;
         
                

        console.log('PowerCrpCPU Run:', cnt,Object.keys(Game.powerCreeps).length);
    }

    let flagCPU = Game.cpu.getUsed();
    flag.run(spawnCount); // We do this part of the first stuff so we can go and find things in the flag rooms
    if (showCPU) {
        let cnt = Game.cpu.getUsed() - flagCPU;
        console.log('FlagCPU Run:', cnt);
    }

    if (Game.cpu.bucket <= creepStopCPU) {
        spawnCount = undefined;
        if (showCPU) {
            console.log("STOPPAGE STOPPAGE - Game.cpu.bucket <= creepStopCPU Stoppage", Game.cpu.bucket, creepStopCPU);
        }
        consoleLogReport(0);
        return;
    }
    let runCreepCPU = Game.cpu.getUsed();
    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('Before Creep Run:', cnt);
        startCpu = Game.cpu.getUsed();
    }

    spawnCount = comSpawn.addSpawnQuery(comCreeps.runCreeps()); // This will not work with old counting.

    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('Creep Run CPU:', cnt);
        startCpu = Game.cpu.getUsed();
    }

    if ((Game.cpu.getUsed() - runCreepCPU) > 300 && Game.time % 5 > 0 && Game.bucket < 1000) {
        if (showCPU) console.log("Stoppage due to > 300 CPU used by creeps and game.time%5 !== 0");
        consoleLogReport(0);
        return;
    }

    var spawnReport = {};
    seg.run();
    seg.setInterShardData();

    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('Segment Run CPU:', cnt);
        startCpu = Game.cpu.getUsed();
    }

    var title;
    Memory.stats.powerProcessed = 0;
    if (Game.cpu.bucket <= creepStopCPU && Game.time % 5 !== 0 && Game.cpu.bucket < 700) {
        consoleLogReport(1);
        return;
    }
    var totalEnergy = 0;
    var spawnCpu;
    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('After Flag Run:', cnt);
        startCpu = Game.cpu.getUsed();
        spawnCpu = Game.cpu.getUsed();


    }


    for (title in Game.spawns) {
        if (Game.spawns[title].room.energyCapacityAvailable !== 0 && Game.spawns[title].room.controller.level !== 0 && Game.spawns[title].room.name !== 'E14S38') {

            let roomName = Game.spawns[title].pos.roomName;
            if (Game.spawns[title].room.memory.allGood === undefined) {
                comSpawn.checkMemory(Game.spawns[title]); // This creates Arrays
                if (Game.spawns[title].memory.alphaSpawn) {
                    let roomName = Game.spawns[title].pos.roomName;
                    //                      var constr = require('commands.toStructure');
                    //                        constr.takeSnapShot(Game.spawns[title].pos.roomName);
                    if (Game.spawns[title].memory.buildLevel != Game.spawns[title].room.controller.level) {
                        var constr = require('commands.toStructure');
                        constr.buildConstrLevel(Game.spawns[title].room.controller);
                        Game.spawns[title].memory.buildLevel = Game.spawns[title].room.controller.level;
                    }
                }
            }

            if (Game.spawns[title].memory.alphaSpawn) {
                if(Game.rooms[roomName].memory.segmentReset){
                    Game.rooms[roomName].memory.segmentReset -= 5;
                }
                if (Game.spawns[title].room.controller.level === 8) Game.spawns[title].room.memory.allGood = true;
                if (Game.shard.name == 'shard2' || Game.shard.name == 'shard0' || Game.shard.name == 'shard3') {
                    observer.runRoom2(roomName);
                    if (isTenTime === 0) _terminal.offShardTerminalRun(roomName);
                } else {
                    observer.runRoom(roomName);
                    if (isTenTime === 0) _terminal.runSimple(roomName);
                }

                doRoomReport(Game.spawns[title].room, isTenTime);
                rampartCheck(Game.spawns[title]);
                power.roomRun(roomName);
                labs.roomLab(roomName);
                link.roomRun(roomName);
                tower.roomTower(roomName);
                let spawn = Game.spawns[title];

                if (Game.cpu.bucket >= creepStopCPU && Game.time % 5 === 0 && Game.flags[Game.spawns[title].pos.roomName] !== undefined && Game.flags[Game.spawns[title].pos.roomName].color === COLOR_WHITE &&
                    (Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_GREEN || Game.flags[Game.spawns[title].pos.roomName].secondaryColor === COLOR_PURPLE)) {
                    comCreeps.spawnQuery(Game.spawns[title], spawnCount);
                }
                if (spawnCount[Game.spawns[title].id]) {
                    Game.spawns[title]._totalParts = (spawnCount[Game.spawns[title].id].bodyCount * 3);
                    Game.spawns[title]._totalCreep = spawnCount[Game.spawns[title].id].creepCount;
                }
                let totalQuery = spawn.memory.expandCreate.length + spawn.memory.create.length + spawn.memory.warCreate.length;
                spawn.memory.totalQuery = totalQuery;
                spawn.room.visual.text(totalQuery, spawn.pos, { color: '#F0000F ', stroke: '#FFFFFF ', strokeWidth: 0.123, font: 0.5 });                
                spawnReport[Game.spawns[title].room.name] = {
                    storageEnergy: spawn.room.storage === undefined ? 0 : spawn.room.storage.store[RESOURCE_ENERGY],
                    storageTotal: spawn.room.storage === undefined ? 0 : spawn.room.storage.total,
                    terminalEnergy: spawn.room.terminal === undefined ? 0 : spawn.room.terminal.store[RESOURCE_ENERGY],
                    terminalTotal: spawn.room.terminal === undefined ? 0 : spawn.room.terminal.total,
                    parts: spawn._totalParts,
                    creepNumber: spawn._totalCreep,
                    energy: spawn.room.energyAvailable,
                    maxEnergy: spawn.room.energyCapacityAvailable,
                    controllerLevel: spawn.room.controller.level,
                    wallSize: getWallLow(Game.spawns[title].room.name),
                    expandQ: totalQuery,
                };
                totalEnergy += spawnReport[Game.spawns[title].room.name].storageEnergy + spawnReport[Game.spawns[title].room.name].terminalEnergy;
                if(spawn.room.memory.alphaSpawnOperated){
                    spawn.room.memory.alphaSpawnOperated --;
                    if(spawn.room.memory.alphaSpawnOperated <= 0){
                        spawn.room.memory.alphaSpawnOperated = undefined;
                    }
                spawn.room.visual.text(spawn.room.memory.alphaSpawnOperated, spawn.pos.x,spawn.pos.y-1, { color: '#F0000F ', stroke: '#FFFFFF ', strokeWidth: 0.123, font: 0.5 });                
                }
            }
//            if(!Game.spawns[title] && Game.spawns[title].room.memory.alphaSpawnOperated || Game.spawns[title].spawns[title].memory.alphaSpawn){
    if(!Game.spawns[title].room.memory.alphaSpawnOperated || Game.spawns[title].memory.alphaSpawn ||Game.spawns[title].room.powerLevels[PWR_OPERATE_SPAWN].level !== 5){
                comSpawn.createFromStack(Game.spawns[title]);
    }
  //          }


            /*            if (Game.spawns[title].room.memory.terminalText !== undefined) {
                            let xx = 40;
                            let yy = 28;
                            Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.labMode + "(Lab)W:" + Game.spawns[title].room.memory.labsNeedWork + " Min:" + Game.spawns[title].room.memory.lab2Mode + " time:" + Game.spawns[title].room.memory.labShift, xx, yy + 1, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });

                            if (Game.spawns[title].room.memory.terminalText.sent !== undefined) {
                                Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.terminalText.sent, xx, yy + 2, {
                                    color: '#97c39a ',
                                    stroke: '#000000 ',
                                    strokeWidth: 0.123,
                                    font: 0.5,
                                });
                            }
                            if (Game.spawns[title].room.memory.terminalText.recieved !== undefined) {
                                Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.terminalText.recieved, xx, yy + 3, {
                                    color: '#97c39a ',
                                    stroke: '#000000 ',
                                    strokeWidth: 0.123,
                                    font: 0.5,
                                });
                            }
                            if (Game.spawns[title].room.memory.terminalText.deal !== undefined) {
                                Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.terminalText.deal, xx, yy + 4, {
                                    color: '#97c39a ',
                                    stroke: '#000000 ',
                                    strokeWidth: 0.123,
                                    font: 0.5,
                                });
                            }
                        }*/

        }

    }

    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('After Spawn Run:', cnt);
        startCpu = Game.cpu.getUsed();
    }

    Memory.stats.empireEnergy = totalEnergy;

    Memory.stats.rooms = spawnReport;
    if (isTenTime === 0) {
        _terminal.run();
    }

    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('After Terminal Run:', cnt);
        startCpu = Game.cpu.getUsed();
    }

    if (Game.shard.name !== 'shard2') {
        memoryStatsUpdate(); // This is to send info to Grafnaa.
    }

    consoleLogReport();
    //    if (Game.time % 10 === 0) {
    /*        for (var e in Game.constructionSites) {
                if (Game.constructionSites[e].room !== undefined) {
                    if (Game.constructionSites[e].progress < 20) {
                        if (Game.constructionSites[e].room && Game.constructionSites[e].room.controller && Game.constructionSites[e].room.controller.level ) {

                        } else if(!Game.constructionSites[e].room.controller || !Game.constructionSites[e].room.controller.owner || Game.constructionSites[e].room.controller.owner.username !== 'likeafox'){
                         //   Game.constructionSites[e].remove();
                            console.log(roomLink(Game.constructionSites[e].pos.roomName), Game.constructionSites[e].structureType, Game.constructionSites[e].progress);
                        }
                    }
                }
            }*/
    //  }
    if (showCPU) {
        let cnt = Game.cpu.getUsed() - startCpu;
        console.log('memoryStatsUpdate Run:', cnt);
        startCpu = Game.cpu.getUsed();
    }



});