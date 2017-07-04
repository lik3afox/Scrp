var labRooms = ['E23S75', 'E33S76', 'W4S93', 'E28S73', 'E35S73', 'E35S83', 'E29S79', 'E28S77', 'E26S77', 'E37S75', 'E28S71', 'E27S75', 'E26S73', 'E38S72'];

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
    id: '59404817f09551065801fb93',
    resource: 'XGH2O',
    amount: 2700
}, {
    id: '5940584df9399f32041dea6a',
    resource: 'none',
    amount: 2700
}, {
    id: '5940502fce1e936d4d837fa9',
    resource: 'none',
    amount: 2700
}];

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
    'GH': 30000,
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
    'KH': 30000,

    'XUHO2': 45000,
    'XUH2O': 45000,
    'XZHO2': 45000,
    'XZH2O': 45000,
    'XLHO2': 45000,
    'XLH2O': 45000,
    'XKHO2': 45000,
    'XKH2O': 45000,



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

            if (currentLab !== null && currentLab.energy < currentLab.energyCapacity && currentLab.room.name == creep.room.name && !labs[i].emptied) {
                return RESOURCE_ENERGY;
            }
            if (currentLab !== null && currentLab.mineralAmount < labs[i].amount && currentLab.room.name == creep.room.name &&
                creep.room.terminal.store[labs[i].resource] > 0 && !labs[i].emptied) {
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

        if (!labs[i].emptied && real !== null && labs[i].resource == have && real.pos.roomName == creep.room.name && real.mineralAmount < labs[i].amount) {
            return labs[i].id;
        }

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
    if (labs[created - 1] === undefined || labs[labz - 1] === undefined || labs[laby - 1] === undefined) {
        console.log('undefined Lab');
        return false;
    }
    //    if (Memory.stats.totalMinerals[labs[created - 1]] === undefined) return false;
    //    console.log(( Memory.stats.totalMinerals[labs[created-1].resource]>maxMinerals[labs[created-1].resource] ));
    if (Memory.stats.totalMinerals[labs[created - 1].resource] > maxMinerals[labs[created - 1].resource] && labs[created - 1].emptied) {
        console.log("max Mineral Triggered", labs[created - 1].resource, maxMinerals[labs[created - 1].resource], Memory.stats.totalMinerals[labs[created - 1].resource]);
        return false;
    }
    let lab1 = getCached(labs[created - 1].id);
    let lab2 = getCached(labs[labz - 1].id);
    let lab3 = getCached(labs[laby - 1].id);
    if (lab1 !== null && lab2 !== null && lab3 !== null) {

        lab1.room.visual.line(lab1.pos, lab2.pos, { color: 'red' });
        lab1.room.visual.line(lab1.pos, lab3.pos, { color: 'red' });
    }



    if (lab1 === null || lab1.mineralAmount >= 2990 || lab1.cooldown !== 0) return false;
    if (lab2 === null || lab2 !== null && lab2.mineralType != labs[labz - 1].resource) return false;
    if (lab3 === null || lab2 !== null && lab3.mineralType != labs[laby - 1].resource) return false;


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

var muster = [{
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XGHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XLHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XKHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}];

// AttackXUHO2
var XUH2O = [{
    id: 'getReplaced',
    resource: 'U',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];
// Attack
var LH = [{
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];
// Attack
var UH = [{
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'U',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

var XZHO2 = [{
    id: 'getReplaced',
    resource: 'Z',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

// Range Attack
var XKHO2 = [{
    id: 'getReplaced',
    resource: 'K',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'KHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XKHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

// MOVE
var XXZHO2 = [{
    id: 'getReplaced',
    resource: 'Z',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

// DISMANTLE
var XZH2O = [{
    id: 'getReplaced',
    resource: 'Z',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

// TOUGH
var XGHO2 = [{
    id: 'getReplaced',
    resource: 'G',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'GO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'GHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XGHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];
var E33S76WarMix = [
    [3, 1, 2],
    [4, 2, 5],
    [6, 3, 4],
    [9, 7, 6]
];
// HAL
var XLHO2 = [{
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XLHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XLHO2',
    amount: 1,
    emptied: true
}];

function labMode(roomName, mode, labs) {
    var a;
    switch (mode) {
        case 'muster':
            Game.rooms[roomName].memory.labMode = mode;
            for (a in muster) {
                muster[a].id = labs[a].id;
            }
            return muster;
        case 'XUH2O':
            Game.rooms[roomName].memory.labMode = mode;
            for (a in XUH2O) {
                XUH2O[a].id = labs[a].id;
            }

            return XUH2O;
        case 'XKH2O':
            Game.rooms[roomName].memory.labMode = mode;
            for (a in XKH2O) {
                //        if (labs[e] !== undefined)
                XKH2O[a].id = labs[a].id;
            }

            return XKH2O;
        case 'XGHO2':
            Game.rooms[roomName].memory.labMode = mode;
            for (var e in XGHO2) {
                //        if (labs[e] !== undefined)
                XGHO2[e].id = labs[e].id;
            }

            return XGHO2;
        case 'XUHO2':
            Game.rooms[roomName].memory.labMode = mode;
            for (a in XUHO2) {
                //            if (labs[a] !== undefined)

                XUHO2[a].id = labs[a].id;
            }

            return XUHO2;
        case 'XZH2O':
            Game.rooms[roomName].memory.labMode = mode;
            for (a in XZH2O) {
                //              if (labs[a] !== undefined)

                XZH2O[a].id = labs[a].id;
            }

            return XZH2O;
        case 'XKHO2':
            Game.rooms[roomName].memory.labMode = mode;
            for (var z in XKHO2) {
                //                if (labs[z] !== undefined)
                XKHO2[z].id = labs[z].id;
            }

            return XKHO2;
        case 'XZHO2':
            Game.rooms[roomName].memory.labMode = mode;
            for (var bbb in XZHO2) {
                //       if (labs[b] !== undefined)

                XZHO2[bbb].id = labs[bbb].id;
            }

            return XZHO2;

        case 'XXZHO2':
            Game.rooms[roomName].memory.labMode = mode;
            for (var b in XXZHO2) {
                //       if (labs[b] !== undefined)

                XXZHO2[b].id = labs[b].id;
            }

            return XXZHO2;
        case 'XLHO2':
            Game.rooms[roomName].memory.labMode = mode;
            for (var m in XLHO2) {
                //       if (labs[m] !== undefined)

                XLHO2[m].id = labs[m].id;
            }

            return XLHO2;
        case 'UH':
            Game.rooms[roomName].memory.labMode = mode;
            for (var mm in UH) {
                //       if (labs[m] !== undefined)

                UH[mm].id = labs[mm].id;
            }

            return UH;

        case 'LH':
            Game.rooms[roomName].memory.labMode = mode;
            for (var mmm in LH) {
                //       if (labs[m] !== undefined)

                LH[mmm].id = labs[mmm].id;
            }

            return UH;

        case 'empty':
            for (var bb in labs) {
                labs[bb].resource = 'none';
            }
            return labs;
        default:

        case 'light':
            var count = {};
            for (var c in labs) {
                if (count[c] === undefined) {
                    count[c] = 0;
                }
                count[c]++;
                if (count[c] > 1) {
                    labs[c].resource = 'XUH2O';
                }
            }
            return labs;
    }
}
//Game.rooms[roomName].memory.labMix.push([7,2,6])


var E29S79WarMix = [
    [3, 1, 2],
    [5, 4, 2],
    [6, 5, 3],
    [9, 7, 6]
];

var oneWarMix = [
    [1, 4, 7],
    [2, 4, 7],
    [3, 4, 7],
    [5, 4, 7],
    [6, 4, 7],
    [8, 4, 7],
    [9, 4, 7],
    [10, 4, 7]
];

function getLabMixes(roomName) {
    if (Memory.war) {
        var newMixes = [];
        switch (Game.rooms[roomName].memory.labMode) {
            case 'UH':
            case 'LH':
                return Game.rooms[roomName].memory.labMix;
            case 'XXZHO2':
                return E29S79WarMix;
            case 'light':
            case undefined:
                return Game.rooms[roomName].memory.labMix;
            default:

                return E33S76WarMix;
                /*            default:
                                return Game.rooms[roomName].memory.labMix;*/
        }
    } else {
        return Game.rooms[roomName].memory.labMix;
    }
}


function setLabs(roomName, labs) {
    /*    var warLab = {
            id: lab.id,
            emptied: lab.resource,
            amount: lab.resource,
            resource: lab.resource
        }; */
    //if(roomName == 'E35S83') console.log("does it get here88");    

    switch (roomName) {
        /*        case 'E35S83':
                let zz = labMode(roomName, 'muster', labs);
                    return zz;*/

        case 'E28S71':
        case 'E29S79':
            return labMode(roomName, 'XLHO2', labs);

        case 'E38S72':
        case 'W4S93':
            return labMode(roomName, 'XGHO2', labs);

        case 'E37S75':
        case 'E26S73':
            return labMode(roomName, 'XUH2O', labs);


        case 'E33S76':
        case 'E38S72':
            return labMode(roomName, 'XKHO2', labs);

        case 'E35S73':
            return labMode(roomName, 'XZH2O', labs);

        case 'E28S73':
            return labMode(roomName, 'XXZHO2', labs);
        case 'E23S75':
            return labMode(roomName, 'XZHO2', labs);


        case 'E27S75':
        case 'E26S77':
            return labMode(roomName, 'light', labs);
        default:
            Game.rooms[roomName].memory.labMode = undefined;
            return labs;
    }
    //    console.log('2', labs.length);
    return labs;
}

function returnLabs(roomName) {
    if (Game.rooms[roomName] === undefined) {
        console.log(roomName, 'return labs failure', roomName.pos.roomName);
        return false;

    }
    if (Game.rooms[roomName].memory.labs === undefined) {
        switch (roomName) {

            default: console.log('Room not available,return empty room', roomName);
            return [];
        }
    } else {
        if (Memory.war) {
            var currentLabs = Game.rooms[roomName].memory.labs;
            var warLabs = [];
            //            var e = currentLabs.length;
            for (var e in currentLabs) {
                var lab = currentLabs[e];
                var warLab = {
                    id: lab.id,
                    emptied: lab.emptied,
                    amount: lab.amount,
                    mineralType: lab.resource,
                    resource: lab.resource
                };
                warLabs.push(warLab);
            }
            //return ;
            let zz = setLabs(roomName, warLabs);
            return zz;
        } else {

            return Game.rooms[roomName].memory.labs;
        }


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
class buildLab {

    static getPlans(roomName) { // returns the acutal plans.
        let zzz = returnLabs(roomName);
        return zzz;
    }

    static getLabs(roomName) { // Returns the object of the labs.
        let returned = [];

        let labs = returnLabs(roomName);

        for (var i in labs) {
            let test = Game.getObjectById(labs[i].id);
            if (test !== null && test.pos.roomName !== roomName) {
                console.log('WTF why this not in the same room?', test, test.pos, test.id, roomName);
            } else if (test !== null) {
                returned.push(test);
            }
        }
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

            var labMix = getLabMixes(roomName);
            for (var a in labMix) {
                let form = labMix[a];
                if (labDo(roomName, form[0], form[1], form[2])) {}
            }

        }

        linksCache = [];



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
        let What;
        if (creep.carryTotal !== 0) {
            What = whatDoIHave(creep);
        } else {
            for (var a in creep.carry) {
                if (creep.carry[a] > 0)
                    What = a;
            }
        }
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
