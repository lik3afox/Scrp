function makeBody(carryNeeded) {
    let body = [];

    do {
        body.push(MOVE);
        body.push(CARRY);
        carryNeeded--;
    } while (carryNeeded > 0);
    return body;
}

// decay 25
class PowerInteract {

    static run() {
        let report = '';
        let total = 0;
        for (var e in Game.rooms) {
            if (Game.rooms[e].memory.powerSpawnID !== undefined) {
                let powerS = Game.rooms[e].powerspawn;
                if (powerS !== null) {
                    let room = Game.rooms[e];
                    if (room.memory.powerCount === undefined) room.memory.powerCount = 0;

/*                    if (!Memory.war) {
                        if (room.controller.level == 8 && powerS !== null && powerS.power !== 0 && powerS.energy >= 50 &&
                            room.terminal.store[RESOURCE_ENERGY] > 19000 && room.storage.store[RESOURCE_ENERGY] > 890000
                        ) {
                            if (powerS.processPower() == OK) {
                                room.memory.powerCount++;
                                total++;
                                powerS.room.visual.text("🔌", powerS.pos, {
                                    color: '#e42f43 ',
                                    stroke: '#000000 ',
                                    strokeWidth: 0.123,
                                    font: 0.5
                                });
                            }
                        }
                    } else { */
                        if (room.controller.level == 8 && powerS !== null && powerS.power !== 0 && powerS.energy >= 50 &&
                            room.terminal.total > 299000 && room.storage.store[RESOURCE_ENERGY] > 999000
                        ) {
                            //                        report = report + " " + room + "(" + room.memory.powerCount + ")";
                            if (powerS.processPower() == OK) {
                                room.memory.powerCount++;
                                total++;
                                powerS.room.visual.text("!", powerS.pos, {
                                    color: '#e42f43 ',
                                    stroke: '#000000 ',
                                    strokeWidth: 0.123,
                                    font: 0.5
                                });
                            }
                        }

                //    }


                } else {
                    Game.rooms[e].memory.powerSpawnID = undefined;
                }
            }
        }
        if (total !== 0) {
            Memory.stats.powerProcessed = total;
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
            console.log(creep, "Has switched to new party", closeFlag.name, 'from', creep.memory.party);
            creep.memory.party = closeFlag.name;
            creep.memory.reportDeath = true;
            creep.memory.powerbankID = undefined;
            return true;
        }


    }

    static getPowerToSpawn(creep) {

        if (creep.memory.powerSpawnID === undefined) {
            let zz = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_SPAWN });
            if (zz.length !== 0) {
                creep.memory.powerSpawnID = zz[0].id;
            } else {
                creep.memory.powerSpawnID = 'none';
            }
        }
        if (creep.memory.powerSpawnID === undefined || creep.memory.powerSpawnID == 'none') return false;

        let powerSpawn = Game.getObjectById(creep.memory.powerSpawnID);
        if (powerSpawn === null) return false;
        if (powerSpawn.power > 10) return false;

        var target;
        var noPower = true;
        if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_POWER] > 0) {
            target = creep.room.terminal;
            noPower = false;
        } else if (creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_POWER] !== undefined && creep.room.storage.store[RESOURCE_POWER] > 0) {
            target = creep.room.storage;
            noPower = false;
        } else if (creep.carry[RESOURCE_POWER] > 0) {
            noPower = false;
        }
        if (noPower) return false;
        if (creep.carry[RESOURCE_POWER] === 0) return false;
        // First find the powerspawn
        if (_.sum(creep.carry) === 0) {
            if (creep.pos.isNearTo(target)) {
                let take = target.store[RESOURCE_POWER];
                if (take > 100) take = 100;
                creep.withdraw(target, RESOURCE_POWER, take);
            } else {
                creep.moveMe(target);
            }
            return true;

        } else if (creep.carry[RESOURCE_POWER] > 0) {
            creep.say('hP');
            if (creep.pos.isNearTo(powerSpawn)) {
                creep.transfer(powerSpawn, RESOURCE_POWER);
            } else {
                creep.moveMe(powerSpawn);
            }
            return true;

        } else if (creep.carry[RESOURCE_ENERGY] > 0) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.transfer(creep.room.storage, RESOURCE_ENERGY);
            } else {
                creep.moveTo(creep.room.storage);
            }
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

        if (theRoom.memory.powerbankID === undefined) {
            let find = theRoom.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });
            if (find.length > 0)
                theRoom.memory.powerbankID = find[0].id;
            flag.memory.spawn = true;
        }

        let powerB = Game.getObjectById(theRoom.memory.powerbankID);
        if (powerB === null) {
            theRoom.memory.powerbankID = undefined;
            flag.memory.spawn = false;
            theRoom.memory.transSent = false;
            let zz = flag.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            //    console.log(zz.length,zz[0].resourceType,zz[1].resourceType);
            if (zz.length === 0)
                flag.remove();
            return;
        }
        let damageDone = theRoom.memory.powerHits - powerB.hits;
        if (damageDone === 0) {
            //console.log('PowerBank targeted:',powerB.pos,"Est: none"+"/D:"+powerB.ticksToDecay," hp:",powerB.hits,'0');
            let msg = powerB.hits + "/" + powerB.ticksToDecay;
            theRoom.visual.text(msg, powerB.pos.x, powerB.pos.y - 1, { color: 'white', font: 0.6, strokeWidth: 0.35 });
        } else {
            //    Math.ceil(powerB.hits/damageDone)
            //console.log('PowerBank targeted:',powerB.pos,"Est:nan"+"/"+powerB.ticksToDecay," hp:",powerB.hits,damageDone);
            let msg = powerB.hits + "/" + powerB.ticksToDecay;
            theRoom.visual.text(msg, powerB.pos.x, powerB.pos.y - 1, { color: 'white', font: 0.6, strokeWidth: 0.35 });
        }
        /*
                        let damageNeed = powerB.hits/powerB.ticksToDecay;
                        if(damageNeed < 600) {
                            // Here we add to the closest spawn
                            // Amount of carry parts we need is
                        } */
        // So here when decay is at 1000 we will start creating the transports
        //                    theRoom.memory.transSent = undefined;
        if (powerB.hits < 350000 && !theRoom.memory.transSent) {

            let carryNeeded = Math.ceil(powerB.power / 50);
            let numOfcreep = Math.ceil(carryNeeded / 25);
            //     console.log (numOfcreep,"creeps with ",carryNeeded*.5 , "# of parts needed");
            //get spawnID - find the creeps around powerB
            let creep = powerB.pos.findInRange(FIND_MY_CREEPS, 2);
            if (creep.length === 0) return;
            let spawnID = creep[0].memory.parent;
            let dist = Game.map.getRoomLinearDistance(powerB.room.name, creep[0].memory.home);
            let spawn = require('commands.toSpawn');
            let count = numOfcreep;
            let carryNeed = Math.ceil(carryNeeded / numOfcreep);
            let maxCarry;
            if (dist < 2) {
                maxCarry = 2;
            } else if (dist < 4) {
                maxCarry = 3;
            } else {
                maxCarry = 4;
            }
            if (count > maxCarry) {
                count = maxCarry;
                carryNeed = 25;
            }
            if (powerB.power > 5000) count++;
            if (powerB.power > 9000) count++;


            do {
                let transport = {
                    build: makeBody(carryNeed),
                    memory: {
                        role: "thief",
                        home: creep[0].memory.home,
                        parent: spawnID,
                        powerParty: true,
                        level: 9,
                        goal: powerB.id,
                        party: flag.name
                    }
                };
                spawn.requestCreep(transport, spawnID);
                count--;
            } while (count > 0);
            //            console.log(theRoom.memory.transSent);
            theRoom.memory.transSent = true;
            //          console.log(theRoom.memory.transSent);

        }
        //               let damageNeed = powerB.hits/powerB.ticksToDecay;
        //                console.log(powerB,damageNeed);
        /*
// now parts needed is 
// console.log(Math.ceil(powerB.power/50)); This is the number of parts needed. 
// find the closest spawn and request transports with a party of this so it can 
*/
        theRoom.memory.powerHits = powerB.hits;

    }

    static analyzePowerBank(powerBank, room) {

        if (powerBank.ticksToDecay < 4000) {
            console.log('Powerbank too old@',powerBank.ticksToDecay, powerBank.pos);
            return false;
        } else if (powerBank.power < 5000) {
            console.log('Not enough power@',powerBank.power , powerBank.pos);
            return false;
        }
        else {
            let rando = Math.floor(Math.random() * 100) + 1;
            var name = 'powerbankX' + rando;
            console.log('Analyzing Powerbank:' + powerBank + " " + powerBank.ticksToDecay + "/" + powerBank.ticksToDecay < 2700 + "  : " + Game.flags[name]);
            if (Game.flags[name] === undefined &&(room.memory.powerbankID === undefined || Game.getObjectById(room.memory.powerbankID) === null)) {
                var mem = {
                flagName: name,
                flagPos: new RoomPosition(powerBank.pos.x, powerBank.pos.y, powerBank.pos.roomName),
                flagCol: COLOR_YELLOW,
                flagCol2: COLOR_RED
                };
                console.log('We MIGHT a flag we have it', mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
            } 
            return true;
        }


    }

}
module.exports = PowerInteract;
