var party = require('commands.toParty');
var FLAG = require('foxGlobals');
var delayBetweenScan = 15;


function getRoomFlag(creep) {
    for (var i in Game.flags) {
        if (Game.flags[i].color == COLOR_WHITE && Game.flags[i].pos.roomName == creep.pos.roomName) {
            return Game.flags[i];
        }
    }
}

function doDefendThings(flag) {
    if (flag.room === undefined) return;

    // = _.filter(flag.room.hostileInRoom(),function(o){return o.owner.username == 'Invader'} ) ;
    // FIND_HOSTILE_CREEPS //flag.room.hostileInRoom()
    var hostiles = flag.room.find(FIND_HOSTILE_CREEPS);

    hostiles = _.filter(hostiles, function(o) {
        return o.owner.username == 'Invader';
    });

    flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });

    if (hostiles.length === 0) {
        flag.remove();
    } else {
        flag.setPosition(hostiles[0].pos.x, hostiles[0].pos.y);
    }

    //  let temp = [];
    //    for (var e in hostiles) {
    //    temp.push(hostiles[e].id);
    //  }
    //    flag.memory.hostilesID = temp;
    flag.room.memory.invasionFlag = flag.name;

    var creeps = flag.pos.findInRange(FIND_MY_CREEPS, 15);
    if (creeps.length > 0) {
        for (var a in creeps) {
            creeps[a].memory.runAway = true;
            creeps[a].memory.runFrom = flag.name;
        }
    }

}

function rampartThings(flag) {
    if (flag.memory.invaderTimed === undefined) flag.memory.invaderTimed = 0;
    if (flag.memory.alert === undefined || !flag.memory.alert) {
        //        let roomCreeps = _.filter(Game.creeps,function(z){z.room.name == flag.room.name});
        let roomCreeps = _.filter(Game.creeps, function(n) {
            return n.room.name == flag.room.name;
        });
        console.log(roomCreeps.length, 'trea');
        for (var a in roomCreeps) {
            roomCreeps[a].memory.rampartDefense = true;
        }
        flag.memory.alert = true;
    }

    if (flag.memory.alert) {
        // Look for creeps
        let bads = flag.room.find(FIND_HOSTILE_CREEPS);
        if (bads.length === 0) {
            flag.memory.invaderTimed = undefined;
            flag.memory.alert = undefined;
            let roomCreeps = _.filter(Game.creeps, { filter: z => z.room.name == flag.room.name });
            for (var o in roomCreeps) {
                roomCreeps[o].memory.rampartDefense = false;
            }
            flag.room.memory.towerRepairID = undefined;
            flag.remove();
        }
    }
    flag.memory.invaderTimed++;
}

function findParty() {
    // we need to go through the creeps/warcreate of all the spawns only once.
    // once we do, we create an object that holds the party and numbers it has, sending it to
    // creation and see if a screep needs to be created.
    let ztotal = [];
    for (var z in Game.flags) {
        if (Game.flags[z].color == FLAG.GUARD) {
            let temp = { party: z, total: 0 };
            ztotal.push(temp);
        }
    }
    // z = flag name. which equals flag party name. 
    for (var e in Game.creeps) {
        if (Game.creeps[e].memory.party !== undefined) {
            for (var a in ztotal) {
                if (ztotal[a].party == Game.creeps[e].memory.party) {
                    ztotal[a].total++;
                }
            }
        }
    }

    for (var o in ztotal) {
        console.log(ztotal[o].party, ztotal[o].total, o);
    }

    return ztotal;
}

function clearFlagMemory() {
    for (var a in Memory.flags) {
        if (Game.flags[a] === undefined) delete Memory.flags[a];
    }
    for (var e in Memory.rooms) {
        if (Game.rooms[e] === undefined) delete Memory.rooms[e];
    }
}

class buildFlags {

    /*    static getBads(flag) {
            // This is used after it finds a flag.
            if (flag.memory.hostilesID === undefined) return false;
            let tmp = [];
            for (var e in flag.memory.hostilesID) {
                tmp.push(Game.getObjectById(flag.memory.hostilesID[e]));
            }
            return tmp;
        } */

    static inRoom(search, creep) {
        var flag = getRoomFlag(creep);
        for (var i in flag.memory.scan) {
            if (i == search) {
                return flag.memory.scan[i];
            }
        }
    }


    static clearAllFlags() {
        let total = 0;
        for (var z in Game.flags) {
            if (Game.flags[z].memory.scanned !== undefined) {
                Game.flags[z].memory.scanned = undefined;
                total++;
            }
            if (Game.flags[z].room !== undefined) {
                Game.flags[z].memory.room = Game.flags[z].room.name;
            }
        }
        console.log('cleared ', total, 'flags');
    }

    /** @param {Creep} creep **/
    /*
        static reportMining(creep) {

            var roomFlag;
            for (var e in Game.flags) {
                if (Game.flags[e].pos.roomName == creep.pos.roomName && (Game.flags[e].color == COLOR_WHITE ||
                        Game.flags[e].color == COLOR_BLUE ||
                        Game.flags[e].color == COLOR_GREY)) {
                    roomFlag = Game.flags[e];
                    break;
                }
            }
            if (roomFlag === undefined) {
                console.log('NEEDS FLAG', creep.room.name);
                return;
            }
            if (roomFlag.memory.goldMined === undefined) {
                roomFlag.memory.goldMined = 0;
            }
            if (roomFlag.memory.totalMined === undefined) {
                roomFlag.memory.totalMined = 0;
            }

            let workMod = 0;
            for (var o in creep.body) {
                if (creep.body[o].type == 'work') {
                    workMod++;
                }
            }
            roomFlag.memory.goldMined = roomFlag.memory.goldMined + (workMod * 2);
            roomFlag.memory.totalMined = roomFlag.memory.totalMined + (workMod * 2);
        } */

    /*static scan(){
        for(var e in Game.flags) {
            let flag = Game.flags[e];
            if(flag.memory.scanTimer == undefined){
                flag.memory.scanTimer;
            }
            flag.memory.scanTimer--;
            if(flag.memory.scanTimer < 0 ) {
                flag.memory.scanTimer = Math.random()*10+10;
                
            }
        }
    } */
    static run() {

        let powerTotal = 0;
        let defendTotal = 0;
        if (Memory.clearFlag === undefined) Memory.clearFlag = 500;
        Memory.clearFlag--;
        if (Memory.clearFlag < 0) {
            Memory.clearFlag = 250;
            clearFlagMemory();
        }
        //    var    start  = Game.cpu.getUsed(); // start counting. 

        let zFlags = _.filter(Game.flags, function(o) {
            return o.color != COLOR_WHITE && o.color != COLOR_GREY && o.color != COLOR_CYAN;
        });
        //console.log(  (Game.cpu.getUsed() - start ), ' afterfilter',zFlags.length); start = Game.cpu.getUsed();
        var e;
        for (e in zFlags) {
            let flag = zFlags[e];
            //console.log(Game.flags[e],Game.flags[e].pos)
            //if(Game.flags[e].pos == undefined) console.log('adsfaf');
            //            if(flag.room )
            switch (flag.color) {

                case COLOR_RED:
                    doDefendThings(flag);
                    console.log('defend flag @', flag.pos);
                    defendTotal++;
                    break;

                case FLAG.GUARD:

                    let guard = flag;
                    if (guard.memory.guardCreateCount === undefined) {
                        guard.memory.guardCreateCount = 0;
                    }
                    guard.memory.guardCreateCount--;
                    if (guard.memory.guardCreateCount < 0) {
                        guard.memory.guardCreateCount = delayBetweenScan;
                        require('commands.toGuard').create(flag);
                    }
                    break;

                case FLAG.RALLY:
                    // This will mean power flag if it's green/red.
                    let rally = flag;
                    if (flag.secondaryColor == COLOR_RED) {
                        var power = require('commands.toPower');
                        powerTotal++;
                        power.calcuate(flag);
                    }

                    if (flag.secondaryColor == COLOR_PURPLE) {
                        rampartThings(flag);
                    }

                    if (rally !== undefined) {
                        if (rally.memory.rallyCreateCount === undefined) {
                            rally.memory.rallyCreateCount = 0;
                        }
                        rally.memory.rallyCreateCount--;
                        if (rally.memory.rallyCreateCount < 0) {
                            party.create(flag);
                            party.rally(flag);
                            rally.memory.rallyCreateCount = delayBetweenScan;
                        }
                    }

                    break;

            }
            //            if(flag.color == 10 )
            //        console.log(  (Game.cpu.getUsed() - start ), ' after', flag.color,flag.secondaryColor); start = Game.cpu.getUsed();
        }
        Memory.stats.powerPartyNum = powerTotal;
        Memory.stats.defendFlagNum = defendTotal;

    }
}

module.exports = buildFlags;

// 11,14 E25S74
