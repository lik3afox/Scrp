var party = require('commands.toParty');
var FLAG = require('foxGlobals');
var delayBetweenScan = 5;

/*
function getRoomFlag(creep) {
    for (var i in Game.flags) {
        if (Game.flags[i].color == COLOR_WHITE && Game.flags[i].pos.roomName == creep.pos.roomName) {
            return Game.flags[i];
        }
    }
}*/

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
        //        console.log(roomCreeps.length, 'trea');
        var a = roomCreeps.length;
        while (a--) {
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
            var o = roomCreeps.length;
            while (o--) {
                roomCreeps[o].memory.rampartDefense = false;
            }
            flag.room.memory.towerRepairID = undefined;
            flag.remove();
        }
    }
    flag.memory.invaderTimed++;
}

function clearFlagMemory() {
    var keys = Object.keys(Memory.flags);
    var e = keys.length;
    var a;
    while (e--) {
        a = keys[e];
        if (Game.flags[a] === undefined) delete Memory.flags[a];
    }
    keys = Object.keys(Memory.rooms);
    e = keys.length;
    while (e--) {
        a = keys[e];
        if (Game.rooms[a] === undefined) delete Memory.rooms[a];
    }
}

class buildFlags {
    /*
        static clearAllFlags() {
            let total = 0;
            var keys = Object.keys(Game.flags);
            var e = keys.length;
            var z;
            while (e--) {
                z = keys[e];
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
    */
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
        var e = zFlags.length;
        var flag;
        while (e--) {
            flag = zFlags[e];
            //console.log(Game.flags[e],Game.flags[e].pos)
            //if(Game.flags[e].pos == undefined) console.log('adsfaf');
            //            if(flag.room )
            switch (flag.color) {

                case COLOR_RED:
                    doDefendThings(flag);
                    //                    console.log('defend flag @', flag.pos);
                    if (Memory.showInfo > 1)
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
                        if (Memory.showInfo > 1)
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
        if (Memory.showInfo > 1) {
            Memory.stats.powerPartyNum = powerTotal;
            Memory.stats.defendFlagNum = defendTotal;
        } else {
            Memory.stats.powerPartyNum = undefined;
            Memory.stats.defendFlagNum = undefined;

        }

    }
}

module.exports = buildFlags;

// 11,14 E25S74
