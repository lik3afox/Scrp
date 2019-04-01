// Build.power is all about power structures - 

var transportCall = 675000;

function makeBody(carryNeeded) {
    let body = [];

    do {
        body.push(MOVE);
        body.push(CARRY);
        carryNeeded--;
    } while (carryNeeded > 0);
    return body;
}

class powerBuildings {

    static roomRun(roomName) {
//        if (Game.shard.name !== 'shard1') return;
  //      if (!Memory.empireSettings.processPower) return;
        if (Game.rooms[roomName].controller.level < 8 || !Game.rooms[roomName] || Game.rooms[roomName].powerspawn === undefined || Game.rooms[roomName].controller.isEffected()) return;
        if (Game.rooms[roomName].memory.focusWall) return;

        let powerS = Game.rooms[roomName].powerspawn;

        if(powerS.isEffected()){
            if (powerS.power >= Game.rooms[roomName].powerLevels[PWR_OPERATE_POWER].level && powerS.energy >= (50 * Game.rooms[roomName].powerLevels[PWR_OPERATE_POWER].level) ) {
                if (powerS.processPower() == OK) {
                    Memory.stats.powerProcessed++;
                    powerS.room.visual.text("🔌", powerS.pos, {
                        color: '#e42fFF ',
                        stroke: '#000000 ',
                        strokeWidth: 0.123,
                        font: 0.5
                    });
                    return;
                }
            }            
        }
        let room = Game.rooms[roomName];
        if (Game.rooms[roomName].memory.energyIn) {
            if (powerS.power > 0 && powerS.energy >= 50 && ((room.storage.total >= 800000 && room.storage.store[RESOURCE_ENERGY] >= 75000) || (room.storage.store[RESOURCE_POWER] && room.storage.store[RESOURCE_ENERGY] >= 75000))) { // && room.terminal.store[RESOURCE_ENERGY] >= terminalEnergyLimit
                if (powerS.processPower() == OK) {
                    Memory.stats.powerProcessed++;
                    powerS.room.visual.text("🔌", powerS.pos, {
                        color: '#e42fFF ',
                        stroke: '#000000 ',
                        strokeWidth: 0.123,
                        font: 0.5
                    });
                    return;
                }
            }
        } else {
            //room.storage.total > 900000 && 
            if (powerS.power > 0 && powerS.energy >= 50 && ((room.storage.store[RESOURCE_ENERGY] >= 75000) || (room.storage.store[RESOURCE_POWER] && room.storage.store[RESOURCE_ENERGY] >= 75000))) { // && room.terminal.store[RESOURCE_ENERGY] >= terminalEnergyLimit 
                if (powerS.processPower() == OK) {
                    Memory.stats.powerProcessed++;
                    powerS.room.visual.text("🔌", powerS.pos, {
                        color: '#e42fFF ',
                        stroke: '#000000 ',
                        strokeWidth: 0.123,
                        font: 0.5
                    });
                    return;
                }
            }
        }
    }

    static findNewPowerParty(creep) {
        // first we will look at Game.falgs
        let pbFlags = _.filter(Game.flags, function(o) {
            return o.color == COLOR_YELLOW && o.secondaryColor == COLOR_RED;
        });

        var closeFlag;
        var distance = 10;

        for (var a in pbFlags) {
            let dis = Game.map.getRoomLinearDistance(creep.room.name, pbFlags[a].pos.roomName);
            if (dis <= 5 && pbFlags[a].name != creep.memory.party && dis < distance) {
                closeFlag = pbFlags[a];
                distance = dis;
            }
        }

        if (closeFlag === undefined || closeFlag.room === undefined) return false;

        let find = closeFlag.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });

        if (find.length > 0) {
            //            console.log(creep, "Has switched to new party", closeFlag.name, 'from', creep.memory.party);
            creep.memory.party = closeFlag.name;
            creep.memory.reportDeath = true;
            creep.memory.powerBankID = undefined;
            return true;
        }


    }

    static calcuate(flag) {

        var roomName = flag.pos.roomName;
        // What we need is how much it's at each tick and is done between each check
        // then using that info we try to determine how long it'll take.
        if (Game.rooms[roomName] === undefined) {
            let ob = require("build.observer");
            ob.reqestRoom(roomName, 3);
            return;
        }

        let theRoom = Game.rooms[roomName];
        if (flag.memory.powerBankID === undefined) {
            let find = theRoom.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK && flag.pos.isEqualTo(s) });
            if (find.length > 0) {
                flag.memory.powerBankID = find[0].id;
                flag.memory.spawn = true;
            }
        }
        /*
                if (theRoom.memory.powerBankID === undefined) {
                    let find = theRoom.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });
                    if (find.length > 0) {
                        theRoom.memory.powerbankID = find[0].id;
                        flag.memory.spawn = true;
                    }

                }*/

        let powerB = Game.getObjectById(flag.memory.powerBankID);

        if (powerB === null) {
            flag.memory.spawn = false;
            flag.memory.transSent = false;
            flag.memory.powerBankID = undefined;
            let zz = flag.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            //            console.log('PowreBank rdy!?',flag,roomLink(flag.pos.roomName));
            if (zz.length > 0) {
                for (var e in flag.memory.party) {
                    flag.memory.party[e][1] = 0;
                }
            }
            if (zz.length === 0) {
                let find = theRoom.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK && flag.pos.isEqualTo(s) });
                if (find.length > 0) {
                    flag.memory.powerBankID = find[0].id;
                    flag.memory.spawn = true;
                } else if (find.length === 0) {
                    theRoom.memory.powerbankID = undefined;
                    flag.remove();
                }
            }

            return;
        }
        if (powerB.hits > 0) {
            flag.memory.party = [
                ['fighter', 1, 13],
                ['healer', 1, 5],
            ];
            /*            if (flag.memory.party !== undefined) {
                                     for (let ee in flag.memory.party) {
                                         if (flag.memory.party[ee][0] === 'fighter' && flag.memory.party[ee][1] === 0) {
                                             flag.memory.party[ee][1] = 1;
                                         } else if (flag.memory.party[ee][0] === 'healer' && flag.memory.party[ee][1] === 0) {
                                             flag.memory.party[ee][1] = 1;
                                         }
                                     }
                                 }*/
            //            
        }
        /**/
        // }
        let damageDone = flag.memory.powerHits - powerB.hits;
        if (damageDone === 0) {
            //console.log('PowerBank targeted:',powerB.pos,"Est: none"+"/D:"+powerB.ticksToDecay," hp:",powerB.hits,'0');
            //            let msg = powerB.hits + "/" + powerB.ticksToDecay;
            //          theRoom.visual.text(msg, powerB.pos.x, powerB.pos.y - 1, { color: 'white', font: 0.6, strokeWidth: 0.35 });
        } else {
            //    Math.ceil(powerB.hits/damageDone)
            //console.log('PowerBank targeted:',powerB.pos,"Est:nan"+"/"+powerB.ticksToDecay," hp:",powerB.hits,damageDone);
            //        let msg = powerB.hits + "/" + powerB.ticksToDecay;
            //      theRoom.visual.text(msg, powerB.pos.x, powerB.pos.y - 1, { color: 'white', font: 0.6, strokeWidth: 0.35 });
        }
        /*
                        let damageNeed = powerB.hits/powerB.ticksToDecay;
                        if(damageNeed < 600) {
                            // Here we add to the closest spawn
                            // Amount of carry parts we need is
                        } */
        // So here when decay is at 1000 we will start creating the transports
        //                    theRoom.memory.transSent = undefined;
        if (Game.shard.name !== 'shard1') {
            transportCall = 1000000;
        }
        if (flag.memory.rangedSent) {
            transportCall = 500000;
        }
        //if(roomName[3] === 'S' &&roomName[4] === '3' &&roomName[5] === '0' ){
        //    console.log('setting ttransportCall to 700000');
        //transportCall = 800000;
        //}

        if (Game.time % 10 === 0 || flag.memory.harassers) {

            let bads = _.filter(powerB.pos.findInRange(powerB.room.notAllies, 15), function(o) {
                return o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0;
            });



            if (bads.length === 0) {
                flag.memory.harassers = undefined;
            } else { //if(!flag.memory.rangedSent && flag.pos.roomName === 'E60S55')
                flag.memory.harassers = true;
                var totalStr = 0;
                for (let ee in bads) {
                    let analyzed = analyzeCreep(bads[ee]);
                    totalStr += analyzed.strength;
                }
                let owner = bads[0].owner.username;
                let responseNum = 1;

                let level = 9; // Designed for non boosted
                if (totalStr > 100) {
                    level = 10; // designed for boosted;
                }
                let msg = "PowerBank Creeps being harassed by:" + owner + " #:" + bads.length + " power:" + totalStr + " Room: " + flag.pos.roomName + " Time: " + Game.time + " Lv:" + level + " / " + responseNum;
                Game.notify(msg, 60);
                console.log(msg, responseNum, flag.memory.rangedSent, level);

                if (!flag.memory.rangedSent) { //powerB.pos.roomName === 'E56S50' &&
                    //get spawnID - find the creeps around powerB
                    let creep = powerB.room.find(FIND_MY_CREEPS);
                    if (creep.length === 0) return;

                    let spawnID = creep[0].memory.parent;
                    let spawn = require('commands.toSpawn');
                    let harassment = require('army.harass');
                    let transport = {
                        build: harassment.levels(level),
                        memory: {
                            role: "harass",
                            home: creep[0].memory.home,
                            parent: spawnID,
                            powerParty: true,
                            level: level,
                            boostNeeded: harassment.boosts(level, creep[0].memory.home),
                            goal: powerB.id,
                            party: flag.name,
                            partied: true
                        }
                    };
                    while (responseNum--) {
                        spawn.requestCreep(transport, spawnID);
                    }
                    flag.memory.rangedSent = true;
                }
            }
        }



        if (powerB.hits < transportCall && !flag.memory.transSent) {

            let carryAmount = 150;
            let boost = ['KH2O'];

            if (Game.shard.name !== 'shard1') {
                carryAmount = 50;
                boost = [];
            } else {
                if (Memory.stats.totalMinerals.XKH2O > 450000) {
                    carryAmount = 200;
                    boost = ['XKH2O'];
                }
            }



            let carryNeeded = Math.ceil(powerB.power / carryAmount);
            let numOfcreep = Math.ceil(carryNeeded / 25);
            //        if (Game.shard.name !== 'shard1') {
            //              if (numOfcreep > 4) numOfcreep = 4;
            //            }

            //get spawnID - find the creeps around powerB
            let creep = powerB.pos.findInRange(FIND_MY_CREEPS, 2);
            if (creep.length === 0) return;
            let spawnID = creep[0].memory.parent;
            let spawn = require('commands.toSpawn');
            let carryNeed = Math.ceil(carryNeeded / numOfcreep);

            do {

                let transport = {
                    build: makeBody(carryNeed),
                    name: 'power@' + powerB.pos.roomName + numOfcreep,
                    memory: {
                        role: "thief",
                        home: creep[0].memory.home,
                        parent: spawnID,
                        powerParty: true,
                        level: 6,
                        boostNeeded: _.clone(boost),
                        goal: powerB.id,
                        party: flag.name,
                    }
                };
                spawn.requestCreep(transport, spawnID);
                numOfcreep--;
            } while (numOfcreep > 0);
            flag.memory.transSent = true;

        }
        flag.memory.powerHits = powerB.hits;

    }

    static analyzePowerBank(powerBank, room) {
        if (powerBank.ticksToDecay < 2000) {
            return false;
        } else if (powerBank.power < 1000) {
            return false;
        } else {
            var name = 'powerbankX' + room;
            if (Game.flags[name] === undefined) {
                var mem = {
                    flagName: name,
                    flagPos: new RoomPosition(powerBank.pos.x, powerBank.pos.y, powerBank.pos.roomName),
                    flagCol: COLOR_YELLOW,
                    flagCol2: COLOR_RED
                };
                // Prohibited 
                var bottom = [];
                var top = [];
                var right = [];
                var left = [];
                let zz;

                /*if (_.contains(top, powerBank.pos.roomName)) {
                    if (powerBank.pos.y > 25) {
                        zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                    }
                } else if (_.contains(bottom, powerBank.pos.roomName)) {
                    if (powerBank.pos.y > 25) {
                        zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                    }
                } else if (_.contains(left, powerBank.pos.roomName)) {
                    if (powerBank.pos.x > 25) {
                        zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                    }
                } else
                if (_.contains(right, powerBank.pos.roomName)) {
                    if (powerBank.pos.x < 25) {
                        zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                    }
                } else {*/
                zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                //}
                //                console.log(zz, 'We MIGHT a flag we have it', mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
            }
            return true;
        }


    }

}
module.exports = powerBuildings;