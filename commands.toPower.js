var transportCall = 750000;

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

    static roomRun(roomName) {
        if (Game.rooms[roomName].controller.level < 8) return false;

        if (Game.rooms[roomName].powerspawn !== undefined) {
            let powerS = Game.rooms[roomName].powerspawn;
            if (powerS !== undefined) {
                let room = Game.rooms[roomName];
                if (powerS.power > 0 && powerS.energy >= 50 && room.terminal.store[RESOURCE_ENERGY] > 19000 && room.storage.store[RESOURCE_ENERGY] > storageEnergyLimit) {
                    if (powerS.processPower() == OK) {
                        Memory.stats.powerProcessed++;
                        powerS.room.visual.text("🔌", powerS.pos, {
                            color: '#e42fFF ',
                            stroke: '#000000 ',
                            strokeWidth: 0.123,
                            font: 0.5
                        });
                    }
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
            creep.memory.powerbankID = undefined;
            return true;
        }


    }

    static getPowerToSpawn(creep) {
        if (creep.room.powerspawn === undefined) {
            return false;
        }
        if (Memory.stats.totalMinerals.power < 500 && (creep.room.terminal.store[RESOURCE_POWER] === undefined || creep.room.terminal.store[RESOURCE_POWER] === 0) && creep.carry[RESOURCE_POWER] === undefined) {
            return false;
        }
        let powerspawn = creep.room.powerspawn;

        if (powerspawn.power >= 10 && powerspawn.energy > 50) return false;

        var target;
        var noPower = true;
        if (creep.room.terminal.store[RESOURCE_POWER] === undefined && creep.room.powerspawn.power === 0 && creep.carry[RESOURCE_POWER] === undefined || creep.carry[RESOURCE_POWER] === 0) {
            if (!_terminal_().requestMineral(creep.room.name, RESOURCE_POWER)) {
                return false;
            }
        }
        creep.say('pw2Sp');
        if (creep.carryTotal === 0) {
            creep.say('g');
            if (powerspawn.power < 10 && creep.room.terminal.store[RESOURCE_POWER] > 0) {
                let amt = 100;
                if (amt > creep.room.terminal.store[RESOURCE_POWER]) {
                    amt = creep.room.terminal.store[RESOURCE_POWER];
                }
                creep.moveToWithdraw(creep.room.terminal, RESOURCE_POWER, amt);
                creep.say('gP' + amt);
                return true;

            } else if (powerspawn.energy < 50) {
                creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
                creep.say('gE');
                return true;
            }
        } else {
            if (creep.carry[RESOURCE_POWER] > 0 && powerspawn.power < 100) {
                creep.say('PP');
                if (creep.pos.isNearTo(powerspawn)) {
                    if (creep.carry[RESOURCE_POWER] > 0) {
                        creep.transfer(powerspawn, RESOURCE_POWER);
                    }

                } else {
                    creep.moveMe(powerspawn);
                }
                return true;

            } else if (creep.carry[RESOURCE_ENERGY] > 0 && powerspawn.energy < 4000) {
                creep.say('PE');
                if (creep.pos.isNearTo(powerspawn)) {
                    creep.transfer(powerspawn, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(powerspawn);
                }
                return true;
            }
            /*else if (creep.carry[RESOURCE_ENERGY] > 0  && powerspawn.energy >= 4000){
/*
                for(var e in creep.carry){
                    creep.moveToTransfer(creep.room.terminal,e);
                    return true;
                } */

            //            }
        }
        return false;
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
                flag.memory.powerbankID = find[0].id;
            flag.memory.spawn = true;
        }

        let powerB = Game.getObjectById(theRoom.memory.powerbankID);

        if (powerB === null) {
            theRoom.memory.powerbankID = undefined;
            flag.memory.spawn = false;
            flag.memory.transSent = false;
            let zz = flag.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
            for (var e in flag.memory.party) {
                flag.memory.party[e][1] = 0;
            }
            if (zz.length === 0) {
                flag.memory = undefined;
                flag.remove();
            }
            return;
        }
        if (powerB.hits === 2000000) {
            if (flag.memory.party !== undefined) {
                for (let ee in flag.memory.party) {
                    if (flag.memory.party[ee][0] === 'fighter' && flag.memory.party[ee][1] === 0) {
                        flag.memory.party[ee][1] = 1;
                    } else if (flag.memory.party[ee][0] === 'healer' && flag.memory.party[ee][1] === 0) {
                        flag.memory.party[ee][1] = 1;
                    }
                }
            }
        }
        let damageDone = flag.memory.powerHits - powerB.hits;
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
        if (Game.shard.name !== 'shard1') {
            transportCall = 300000;
        }
        if (powerB.hits < transportCall && !flag.memory.transSent) {

            let carryAmount = 150;
            let boost = ['KH2O'];

            if (Game.shard.name !== 'shard1') {
                carryAmount = 50;
                boost = [];
            }

            let carryNeeded = Math.ceil(powerB.power / carryAmount);
            let numOfcreep = Math.ceil(carryNeeded / 25);
            if (Game.shard.name !== 'shard1') {
                if (numOfcreep > 4) numOfcreep = 4;
            }

            //get spawnID - find the creeps around powerB
            let creep = powerB.pos.findInRange(FIND_MY_CREEPS, 2);
            if (creep.length === 0) return;
            let spawnID = creep[0].memory.parent;
            let spawn = require('commands.toSpawn');
            let carryNeed = Math.ceil(carryNeeded / numOfcreep);

            do {
                let transport = {
                    build: makeBody(carryNeed),
                    memory: {
                        role: "thief",
                        home: creep[0].memory.home,
                        parent: spawnID,
                        powerParty: true,
                        level: 6,
                        boostNeeded: _.clone(boost),
                        goal: powerB.id,
                        party: flag.name
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

        if (powerBank.ticksToDecay < 3000) {
            return false;
        } else if (powerBank.power < 2000) {
            return false;
        } else {
            let rando = Math.floor(Math.random() * 100) + 1;
            var name = 'powerbankX' + rando;
            //            console.log('Analyzing Powerbank:' + powerBank + " " + powerBank.ticksToDecay + "/" + powerBank.ticksToDecay < 2700 + "  : " + Game.flags[name]);
            if (Game.flags[name] === undefined && (room.memory.powerbankID === undefined || Game.getObjectById(room.memory.powerbankID) === null)) {
                var mem = {
                    flagName: name,
                    flagPos: new RoomPosition(powerBank.pos.x, powerBank.pos.y, powerBank.pos.roomName),
                    flagCol: COLOR_YELLOW,
                    flagCol2: COLOR_RED
                };
                var half = ['E30S41', 'E30S42', 'E30S43', 'E30S44', 'E30S45', 'E30S46', 'E30S47', 'E30S48', 'E30S49'];
                var second = [];
                let zz;

                if (_.contains(half, powerBank.pos.roomName)) {
                    if (powerBank.pos.x < 25) {
                        zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                    }
                } else if (_.contains(second, powerBank.pos.roomName)) {
                    if (powerBank.pos.x < 25) {
                        zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                    }
                } else {
                    zz = room.createFlag(mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
                }
                //                console.log(zz, 'We MIGHT a flag we have it', mem.flagPos, mem.flagName, mem.flagCol, mem.flagCol2);
            }
            return true;
        }


    }

}
module.exports = PowerInteract;