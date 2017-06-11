/*
RESOURCE_ENERGY: "energy",
    RESOURCE_POWER: "power",

    RESOURCE_HYDROGEN: "H",
    RESOURCE_OXYGEN: "O",
    RESOURCE_UTRIUM: "U",
    RESOURCE_LEMERGIUM: "L",
    RESOURCE_KEANIUM: "K",
    RESOURCE_ZYNTHIUM: "Z",
    RESOURCE_CATALYST: "X",
    RESOURCE_GHODIUM: "G",

    RESOURCE_HYDROXIDE: "OH",
    RESOURCE_ZYNTHIUM_KEANITE: "ZK",
    RESOURCE_UTRIUM_LEMERGITE: "UL",

    RESOURCE_UTRIUM_HYDRIDE: "UH",
    RESOURCE_UTRIUM_OXIDE: "UO",
    RESOURCE_KEANIUM_HYDRIDE: "KH",
    RESOURCE_KEANIUM_OXIDE: "KO",
    RESOURCE_LEMERGIUM_HYDRIDE: "LH",
    RESOURCE_LEMERGIUM_OXIDE: "LO",
    RESOURCE_ZYNTHIUM_HYDRIDE: "ZH",
    RESOURCE_ZYNTHIUM_OXIDE: "ZO",
    RESOURCE_GHODIUM_HYDRIDE: "GH",
    RESOURCE_GHODIUM_OXIDE: "GO",

    RESOURCE_UTRIUM_ACID: "UH2O",
    RESOURCE_UTRIUM_ALKALIDE: "UHO2",
    RESOURCE_KEANIUM_ACID: "KH2O",
    RESOURCE_KEANIUM_ALKALIDE: "KHO2",
    RESOURCE_LEMERGIUM_ACID: "LH2O",
    RESOURCE_LEMERGIUM_ALKALIDE: "LHO2",
    RESOURCE_ZYNTHIUM_ACID: "ZH2O",
    RESOURCE_ZYNTHIUM_ALKALIDE: "ZHO2",
    RESOURCE_GHODIUM_ACID: "GH2O",
    RESOURCE_GHODIUM_ALKALIDE: "GHO2",

    RESOURCE_CATALYZED_UTRIUM_ACID: "XUH2O",
    RESOURCE_CATALYZED_UTRIUM_ALKALIDE: "XUHO2",
    RESOURCE_CATALYZED_KEANIUM_ACID: "XKH2O",
    RESOURCE_CATALYZED_KEANIUM_ALKALIDE: "XKHO2",
    RESOURCE_CATALYZED_LEMERGIUM_ACID: "XLH2O",
    RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE: "XLHO2",
    RESOURCE_CATALYZED_ZYNTHIUM_ACID: "XZH2O",
    RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE: "XZHO2",
    RESOURCE_CATALYZED_GHODIUM_ACID: "XGH2O",
    RESOURCE_CATALYZED_GHODIUM_ALKALIDE: "XGHO2",
5836b8118b8b9619519f1663
8,13
E25S75
*/
var constr = require('commands.toStructure');
var labmax = 2401;
var allLabs = [{
        id: '5938fdd462b8ff7e30107eb1',
        resource: 'XGH2O',
        amount: 2700
    }, {
        id: '593946bbeba80c4eae9ca4ec',
        resource: 'none',
        amount: 2700
    }, {
        id: '59397bc179c6c83efbe58950',
        resource: 'none',
        amount: 2700
    }, {
        id: '5939b5212b016b259c74422c',
        resource: 'none',
        amount: 2700
    }, {
        id: '5939db8e3d2cc933144120e8',
        resource: 'none',
        amount: 2700
    }, {
        id: '593a13a24053314604625508',
        resource: 'none',
        amount: 2700
    }


];

var maxMinerals = {
    //    'U':300000,
    'U': 125000,
    'L': 125000,
    'Z': 125000,
    'K': 125000,
    'O': 125000,
    'H': 125000,
    'X': 125000,

    'G': 30000,
    'UL': 10000,
    'ZK': 10000,
    'OH': 30000,

    'UO': 30000,
    'UH': 30000,
    'ZO': 30000,
    'ZH': 30000,
    'LO': 30000,
    'LH': 30000,
    'KO': 30000,
    'KH': 30000

};

var linksCache = [];

function getCached(id) {
    //  if (linksCache[id] === undefined) {
    linksCache[id] = Game.getObjectById(id);
    //    }
    return linksCache[id];
}

function whatDoIget(creep) {
    let labs = returnLabs(creep.room.name);

    for (var i in labs) {

        if (labs[i].resource != 'none') {
            let currentLab = getCached(labs[i].id);

            //           if (creep.room.name == 'E35S73')
            //                console.log('lab works ', currentLab.energy, currentLab.energyCapacity, i, labs[i].id);

            if (currentLab !== null && currentLab.energy < currentLab.energyCapacity && currentLab.room.name == creep.room.name) {
                return RESOURCE_ENERGY;
            }
            if (currentLab !== null && currentLab.mineralAmount < labs[i].amount && currentLab.room.name == creep.room.name &&
                creep.room.terminal.store[labs[i].resource] > 0) {
                return labs[i].resource;
            }
        }
    }
}


function howMuchDoIget(creep, wanted) {
    let labs = returnLabs(creep.room.name);

    for (var i in labs) {
        if (labs[i].resource == wanted) {
            return labs[i].amount;
        }
    }

}

function whereDoIPut(creep, have) {
    let labs = returnLabs(creep.room.name);
    for (var i in labs) {
        let real = getCached(labs[i].id);
        if (real !== null && labs[i].resource == have && real.pos.roomName == creep.room.name && real.mineralAmount < labs[i].amount) {
            return labs[i].id;
        }
        /*        if(real != undefined && labs[i].resource == have && real.pos.roomName == creep.room.name 
                    && real.mineralType == undefined) {
                    return labs[i].id;
                } */

        if (real !== null && have == RESOURCE_ENERGY && real.pos.roomName == creep.room.name) {
            if (real.energy < real.energyCapacity) {
                return labs[i].id;
            }
        }
    }
    return undefined;
}

function whatDoIHave(creep) {
    for (var i in creep.carry) {
        if (creep.carry[i] > 0) {
            return i;
        }
    }
}

function labDo(roomName, created, labz, laby) {
    let labs = returnLabs(roomName);
    if (created === 0) {
        //        console.log('created 0 ', created, labz, laby, roomName);
        return false;
    }
    //    console.log(( Memory.stats.totalMinerals[labs[created-1].resource]>maxMinerals[labs[created-1].resource] ));
    if (Memory.stats.totalMinerals[labs[created - 1].resource] > maxMinerals[labs[created - 1].resource] && labs[created - 1].emptied) {
        //        console.log("max Mineral Triggered", labs[created - 1].resource, maxMinerals[labs[created - 1].resource], Memory.stats.totalMinerals[labs[created - 1].resource]);
        return false;
    }
    let lab1 = getCached(labs[created - 1].id);
    let lab2 = getCached(labs[labz - 1].id);
    let lab3 = getCached(labs[laby - 1].id);
    lab1.room.visual.line(lab1.pos, lab2.pos, { color: 'red' });
    lab1.room.visual.line(lab1.pos, lab3.pos, { color: 'red' });



    if (lab1 === null || lab1.mineralAmount >= 2990 || lab1.cooldown !== 0) return false;
    if (lab2.mineralType != labs[labz - 1].resource) return false;
    if (lab3.mineralType != labs[laby - 1].resource) return false;


    if (lab2 === null || lab2.mineralAmount < 5) return false;

    if (lab3 === null || lab3.mineralAmount < 5) return false;

    let zz = lab1.runReaction(lab2, lab3);

    if (zz !== 0) console.log(created, labz, laby, lab1.mineralAmount, 'lab Reaction', zz, lab1.mineralType, lab2.mineralType, lab3.mineralType, roomName);
    return true;
}

function labReady(roomName, labz) {
    let labs = returnLabs(roomName);
    let lab1 = getCached(labs[labz - 1].id);
    if (lab1.cooldown === 0) return true;
    return false;
}

function returnLabs(roomName) {
    if (Game.rooms[roomName].memory.labs === undefined) {
        switch (roomName) {
            case "E33S76":
                return allLabs;

            default:
                console.log('Room not available,return empty room', roomName);
                return [];
        }
    } else {
        return Game.rooms[roomName].memory.labs;
    }

}

function updateRoomMember(roomName) {
    // Game.rooms[roomName].memory.labMinerals - this hold what the room has
    // Game.rooms[roomName].memory.calledMinerals - this holds what creep in production have called.
    // Game.rooms[roomName].memory.availableMinerals - this hold what is available for creeps to call.
    if (Game.rooms[roomName].memory.calledMinerals === undefined) {
        Game.rooms[roomName].memory.calledMinerals = {};
    }
    //    if (Game.rooms[roomName].memory.availableMinerals === undefined) Game.rooms[roomName].memory.availableMinerals = [];

    let roomLabs = Game.rooms[roomName].memory.labs;
    let minerals = {};
    let bb = Math.ceil(Math.random() * 2);
    for (var e in roomLabs) {
        let lab = getCached(roomLabs[e].id);
        if (lab !== null) {

            if (bb == 1) {
                lab.room.visual.text(parseInt(e) + 1, lab.pos.x, lab.pos.y, {
                    color: '#97c39a ',
                    stroke: '#000000 ',
                    strokeWidth: 0.123,
                    font: 0.5
                });
            } else {
                let color = '#97c39a ';
                if (roomLabs[e].emptied) color = '#660033';
                lab.room.visual.text(roomLabs[e].resource, lab.pos.x, lab.pos.y, {
                    color: color,
                    stroke: '#000000 ',
                    strokeWidth: 0.123,
                    font: 0.5
                });
            }


            if (minerals[lab.mineralType] === undefined) {
                minerals[lab.mineralType] = lab.mineralAmount;
                if (Game.rooms[roomName].memory.calledMinerals[lab.mineralType] === undefined) {
                    Game.rooms[roomName].memory.calledMinerals[lab.mineralType] = 0;
                }
            } else {
                minerals[lab.mineralType] += lab.mineralAmount;
            }
        }

    }


    Game.rooms[roomName].memory.labMinerals = minerals;
    // first update the availableMinearls;
    //  for (var a in Game.rooms[roomName].memory.labMinerals) {
    //      Game.rooms[roomName].memory.availableMinerals[a] = Game.rooms[roomName].memory.labMinerals[a] - Game.rooms[roomName].memory.calledMinerals[a];
    //    }

}

//5836bb2241230b6b7a5b9a4d E35S75 43,15
var labRooms = ['E33S76', 'W4S93', 'E28S73', 'E35S73', 'E35S83', 'E29S79', 'E28S77', 'E26S77', 'E37S75', 'E28S71', 'E27S75', 'E26S73', 'E38S72'];
class buildLab {

    static getPlans(roomName) {
        return returnLabs(roomName);
    }

    static getLabs(creep) {
        let returned = [];
        let labs = returnLabs(creep.room.name);
        for (var i in labs) {
            if (labs[i].id != ' ') {
                let test = getCached(labs[i].id);
                if (test !== null && test.room.name == creep.room.name) {
                    returned.push(test);
                }
            }
        }
        //        let vs = creep.room.find(FIND_STRUCTURES,{filter: {structureType: STRUCTURE_LAB}});
        //        console.log( returned.length, returned[0],vs.length,vs[0] );
        return returned;
    }




    static gotMineral(mineral, body, roomName) {
        // this function is called when a creep has boosted

        let workparts = _.filter(body, function(n) {
            return n.type == WORK;
        }).length;
        let moveparts = _.filter(body, function(n) {
            return n.type == MOVE;
        }).length;
        let attkparts = _.filter(body, function(n) {
            return n.type == ATTACK;
        }).length;
        let healparts = _.filter(body, function(n) {
            return n.type == HEAL;
        }).length;
        let mem = Game.rooms[roomName].memory;
        // first update the availableMinearls;
        //    for (var a in mem.labMinerals) {
        //          mem.availableMinerals[a] = mem.labMinerals[a] - mem.calledMinerals[a];
        //        }
        let minNeeded;
        if (mineral == 'UO' ||
            mineral == 'LH' ||
            mineral == 'ZH' ||
            mineral == 'GH') {
            minNeeded = (workparts * 30);
        }
        if (mineral == 'LO') {
            minNeeded = (healparts * 30);
        }
        if (mineral == 'UH') {
            minNeeded = (attkparts * 30);
        }
        if (mineral == 'ZO') {
            minNeeded = (moveparts * 30);
        }
        if (mem.calledMinerals !== undefined) {
            mem.calledMinerals[mineral] -= minNeeded;
            if (mem.calledMinerals[mineral] < 0) mem.calledMinerals[mineral] = 0;
        }

        return true;

    }


    static requestMineral(boost, body, roomName) {
            // this function will go through room member and see what lab mats are available/energy
            // if there is enough, it will then request it 
            // Game.rooms[roomName].memory.labMinerals - this hold what the room has
            // Game.rooms[roomName].memory.calledMinearls - this holds what creep in production have called.
            // Game.rooms[roomName].memory.availableMinerals - this hold what is available for creeps to call.
            let workparts = _.filter(body, function(n) {
                return n == WORK;
            }).length;
            let moveparts = _.filter(body, function(n) {
                return n == MOVE;
            }).length;
            let attkparts = _.filter(body, function(n) {
                return n == ATTACK;
            }).length;
            let healparts = _.filter(body, function(n) {
                return n == HEAL;
            }).length;
            let mem = Game.rooms[roomName].memory;


            //for(var a in boost) {
            let minNeeded;
            if (boost == 'UO' ||
                boost == 'LH' ||
                boost == 'ZH' ||
                boost == 'GH') {
                minNeeded = workparts * 30;
            }
            if (boost == 'LO') {
                minNeeded = healparts * 30;
            }
            if (boost == 'UH') {
                minNeeded = attkparts * 30;
            }
            if (boost == 'ZO') {
                minNeeded = moveparts * 30;
            }
            if ((mem.labMinerals[a] - mem.calledMinerals[a]) >= minNeeded) {
                //console.log(Game.rooms[roomName].memory.calledMinerals[boost],boost,minNeeded);
                Game.rooms[roomName].memory.calledMinerals[boost] += minNeeded;

                return true;
            }

            return false;
            //}

        }
        /** @param {Creep} creep **/
    static run() {
        // 1+4 = 2,5,7
        // 9+10 = 3,6,8


        // Spawn 1 labs
        //labDo('E28S73',2,1,4);
        //3/5/6/8/9/0 =4+7

        for (var e in labRooms) {
            let roomName = labRooms[e];
            if (Game.rooms[roomName].memory.labs === undefined) {
                Game.rooms[roomName].memory.labs = returnLabs(roomName);
            }
            updateRoomMember(roomName);


            if (Game.rooms[roomName].memory.labMix === undefined) {
                Game.rooms[roomName].memory.labMix = [];
                Game.rooms[roomName].memory.labMix.push([3, 2, 6]);
                /*    
                    Game.rooms[roomName].memory.labMix.push([7,2,6])
                    Game.rooms[roomName].memory.labMix.push([4,5,9])
                    Game.rooms[roomName].memory.labMix.push([8,5,9])
                    Game.rooms[roomName].memory.labMix.push([10,5,9])*/
                //    Game.rooms[roomName].memory.labMix.push([10,4,7])
            }

            for (var a in Game.rooms[roomName].memory.labMix) {
                let form = Game.rooms[roomName].memory.labMix[a];
                if (labDo(roomName, form[0], form[1], form[2])) {}
            }

        }





    }

    static neededMinerals(roomName) {
            let mins = [];
            let labs = returnLabs(roomName);

            // Go through the labs in that room,
            // see what resources it needs,
            // send back array that has required
            // Terminal will use this, and then terminal will see if others have what it wants and gets it sent to them.

            for (var e in labs) {
                let lab = getCached(labs[e].id);
                if (lab !== null) {
                    //        } && lab.mineralAmount < labs[e].amount) {
                    let temp = labs[e].resource;
                    mins.push(temp);
                }
            }
            return _.uniq(mins);
        }
        /*
        static needsWork() { // function to see if labwork needs to be done. 
          let labs = returnLabs();

          for(var e in labs) {
              let lab = Game.getObjectById
(  labs[e].id );
              let res = labs[e].resource;
              let need = labs[e].amount;
              if(lab.mineralType != 'flex') {
              if(lab.mineralType == res &&
                  lab.mineralAmount < need) {
                  return true;
              }
          }
          }
          return false; 
        } */
        // 
        // RESOURCE_KEANIUM RESOURCE_OXYGEN
    static moveToTransfer(creep) {
        let What = whatDoIHave(creep);
        let Where = whereDoIPut(creep, What);
        creep.say('m');
        //    console.log(Where,'58b231304f9ae14589af186d');
        if (Where === undefined) return false;
        let itgoes = getCached(Where);
        //    console.log(Where,itgoes,itgoes.mineralType, What)
        if (What != RESOURCE_ENERGY) {
            if (itgoes.mineralType !== null) {
                if (itgoes.mineralType != What) return false;
            }
        }
        // if(itgoes.mineralType != undefined && itgoes.mineralType != What ) return false;

        if (creep.pos.isNearTo(itgoes)) {
            creep.transfer(itgoes, What);
        } else {
            creep.moveMe(itgoes);
        }
        return true;
    }


    static getFromTerminal(creep) { // gets the resource wanted from the terminal.
        creep.say('g');
        let wanted = whatDoIget(creep);
        if (wanted === undefined) return false;
        let howMuch = howMuchDoIget(creep, wanted);

        if (creep.withdraw(creep.room.terminal, wanted) == ERR_NOT_IN_RANGE) {
            creep.moveMe(creep.room.terminal);
        }
        return true;
    }
}

module.exports = buildLab;
