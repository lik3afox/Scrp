var labRooms = ['W53S35', 'E23S38', 'E13S34', 'E17S34', 'E27S34', 'E18S32', 'E14S37', 'E17S45', 'E28S37', 'E27S34', 'E24S33', 'E14S43', 'E28S42', 'E23S42', 'E25S43', 'E25S47', 'E14S47', 'E18S36', 'E14S38', 'E25S37', 'E25S27', 'E27S45', 'E29S48', 'E22S48', 'E18S46',
    'E32S34', 'E21S38', 'E11S47', 'E1S11', 'E33S54'
];

var shiftCount = 1800;

var constr = require('commands.toStructure');

var maxMinerals = {

    'OH': 200000,
    'UL': 50000,
    'ZK': 50000,
    'G': 150000,

    'GH': 100000, // Upgrade
    'GH2O': 50000,
    'XGH2O': 225000,

    'KH': 40000,
    'KH2O': 50000, // Carry
    'XKH2O': 120000, // Carry

    'XLH2O': 140000, // Repair *
    'LH2O': 50000, // Repair *
    'LH': 50000,


    'XGHO2': 400000,
    'GHO2': 50000,
    'GO': 20000, // Toughness

    'XZH2O': 100000, // Dismantle
    'ZH2O': 50000, // Dismantle
    'ZH': 20000, // Dismantle

    'XKHO2': 325000, // Ranged*
    'KHO2': 50000, // Ranged*
    'KO': 50000,

    'XZHO2': 350000, //  Move*
    'ZHO2': 50000, //  Move*
    'ZO': 50000, // Move

    'XUH2O': 250000, // Attack
    'UH2O': 50000, // Attack
    'UH': 75000, // Repair

    'XUHO2': 40000, // Harvest
    'UHO2': 30000,
    'UO': 20000,

    'XLHO2': 325000, // Heal*
    'LHO2': 50000, // Heal*
    'LO': 50000,

};

var reactionTemplate = [{
    id: 'getReplaced',
    resource: 'x',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'y',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'xy',
    amount: 1,
    emptied: true
}];

var oneMatMix = [
    [3, 1, 2],
    [4, 1, 2],
    [5, 1, 2],
    //    [6, 1, 2],
    [7, 1, 2],
    [8, 1, 2],
    [9, 1, 2],
    [10, 1, 2],
];



function getCached(id) {
    return Game.getObjectById(id);
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
            return real;
        }

        if (real !== null && have == RESOURCE_ENERGY && real.pos.roomName == creep.room.name) {
            if (real.energy < real.energyCapacity) {
                return real;
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

function getRoomLabMode(roomName) {
    if (Game.rooms[roomName].memory.labMode === 'shift') {
        return Game.rooms[roomName].memory.lab2Mode;
    } else if (Game.rooms[roomName].memory.primaryLab) {
        return Game.rooms[roomName].memory.labMode;
    } else {
        return Game.rooms[roomName].memory.lab2Mode;
    }
}

function doNewLabSetup(roomName, mode, labs) {
    var matX, matY;

    for (var mmm in labs) {
        if (labs[mmm] !== undefined) {
            reactionTemplate[mmm].id = labs[mmm].id;
            reactionTemplate[mmm].resource = mode;
        }
    }

    switch (mode) {
        case 'OH':
            reactionTemplate[0].resource = 'O';
            reactionTemplate[1].resource = 'H';
            break;
        case 'UL':
            reactionTemplate[0].resource = 'U';
            reactionTemplate[1].resource = 'L';
            break;
        case 'ZK':
            reactionTemplate[0].resource = 'Z';
            reactionTemplate[1].resource = 'K';
            break;
        case 'G':
            reactionTemplate[0].resource = 'ZK';
            reactionTemplate[1].resource = 'UL';
            break;

        case 'GH':
            reactionTemplate[0].resource = 'G';
            reactionTemplate[1].resource = 'H';
            break;
        case 'ZH':
            reactionTemplate[0].resource = 'Z';
            reactionTemplate[1].resource = 'H';
            break;
        case 'LH':
            reactionTemplate[0].resource = 'L';
            reactionTemplate[1].resource = 'H';
            break;
        case 'KH':
            reactionTemplate[0].resource = 'K';
            reactionTemplate[1].resource = 'H';
            break;
        case 'UH':
            reactionTemplate[0].resource = 'U';
            reactionTemplate[1].resource = 'H';
            break;

        case 'GO':
            reactionTemplate[0].resource = 'G';
            reactionTemplate[1].resource = 'O';
            break;
        case 'ZO':
            reactionTemplate[0].resource = 'Z';
            reactionTemplate[1].resource = 'O';
            break;
        case 'LO':
            reactionTemplate[0].resource = 'L';
            reactionTemplate[1].resource = 'O';
            break;
        case 'KO':
            reactionTemplate[0].resource = 'K';
            reactionTemplate[1].resource = 'O';
            break;
        case 'UO':
            reactionTemplate[0].resource = 'U';
            reactionTemplate[1].resource = 'O';
            break;


        case 'XGHO2':
            reactionTemplate[0].resource = 'GHO2';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XGH2O':
            reactionTemplate[0].resource = 'GH2O';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XZHO2':
            reactionTemplate[0].resource = 'ZHO2';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XZH2O':
            reactionTemplate[0].resource = 'ZH2O';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XLHO2':
            reactionTemplate[0].resource = 'LHO2';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XLH2O':
            reactionTemplate[0].resource = 'LH2O';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XKHO2':
            reactionTemplate[0].resource = 'KHO2';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XKH2O':
            reactionTemplate[0].resource = 'KH2O';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XUH2O':
            reactionTemplate[0].resource = 'UH2O';
            reactionTemplate[1].resource = 'X';
            break;
        case 'XUHO2':
            reactionTemplate[0].resource = 'UHO2';
            reactionTemplate[1].resource = 'X';
            break;

        case 'UHO2':
            reactionTemplate[0].resource = 'UO';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'UH2O':
            reactionTemplate[0].resource = 'UH';
            reactionTemplate[1].resource = 'OH';
            break;

        case 'GHO2':
            reactionTemplate[0].resource = 'GO';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'GH2O':
            reactionTemplate[0].resource = 'GH';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'ZHO2':
            reactionTemplate[0].resource = 'ZO';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'ZH2O':
            reactionTemplate[0].resource = 'ZH';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'LHO2':
            reactionTemplate[0].resource = 'LO';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'LH2O':
            reactionTemplate[0].resource = 'LH';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'KHO2':
            reactionTemplate[0].resource = 'KO';
            reactionTemplate[1].resource = 'OH';
            break;
        case 'KH2O':
            reactionTemplate[0].resource = 'KH';
            reactionTemplate[1].resource = 'OH';
            break;
            //      default:
            //        return;
    }

    reactionTemplate[5].resource = 'none';

    return reactionTemplate;
}

function labMode(roomName, mode, labs) {
    switch (mode) {
        case 'empty':
        case 'none':
            for (var bb in labs) {
                labs[bb].resource = 'none';
            }
            return labs;

        default:
            return doNewLabSetup(roomName, mode, labs);
    }

}

var labsInRoom;

function returnLabs(roomName) {

    // if (labsInRoom[roomName] !== undefined) {
    //   return labsInRoom[roomName];
    // }

    var mode;
    if (Game.rooms[roomName].memory.primaryLab) {
        mode = Game.rooms[roomName].memory.labMode;
    } else {
        mode = Game.rooms[roomName].memory.lab2Mode;
    }

    //    if (mode) {
    //      labsInRoom[roomName] = labMode(roomName, mode, Game.rooms[roomName].memory.labs);
    //        return labsInRoom[roomName];
    return labMode(roomName, mode, Game.rooms[roomName].memory.labs);
    //  }

    //labsInRoom[roomName] = Game.rooms[roomName].memory.labs;

    //    return labsInRoom[roomName];
}


function labDo(roomName, created, labz, laby) {
    let labs = returnLabs(roomName);
    if (created === 0) {
        return false;
    }
    if (labs[created - 1] === undefined || labs[labz - 1] === undefined || labs[laby - 1] === undefined) {
        return false;
    }

    let lab1 = Game.getObjectById(labs[created - 1].id);

    let lab2 = getCached(labs[labz - 1].id);
    let lab3 = getCached(labs[laby - 1].id);
    if (lab1 === null || lab2 === null || lab3 === null) {
        return false;
    } else {
        lab1.room.visual.line(lab1.pos, lab2.pos, { color: 'red' });
        lab1.room.visual.line(lab1.pos, lab3.pos, { color: 'red' });
    }
    if (lab1.cooldown !== 0) return false;
    if (!lab3.room.memory.labsNeedWork && Game.rooms[roomName].memory.lab2Mode !== 'none') {
        if (lab1.mineralAmount >= 2950 && labs[labz - 1].emptied) {
            console.log(lab3.room.name, 'tigger1');
            lab3.room.memory.labsNeedWork = true;
        }
        if ((!labs[labz - 1].emptied && (lab2.mineralAmount < 150 || lab2.mineralAmount === null) && (lab2.room.terminal.store[labs[labz - 1].resource] > 1)) ||
            (!labs[laby - 1].emptied && (lab3.mineralAmount < 150 || lab3.mineralAmount === null) && ( lab3.room.terminal.store[labs[laby - 1].resource] > 1))) {
            console.log(lab3.room.name, 'tigger2');
            lab3.room.memory.labsNeedWork = true;
        }
        if (labs[labz - 1].resource !== 'none' &&
            ((lab2.mineralType !== undefined && lab2.mineralType !== null) && labs[labz - 1].resource !== undefined && 
                labs[labz - 1].resource !== lab2.mineralType)) {
            console.log(lab3.room.name, 'tigger3', lab2.mineralType, labs[labz - 1].resource, lab2.mineralType);
            lab3.room.memory.labsNeedWork = true;
        }
        if ((lab3.mineralType !== null && labs[laby - 1].resource !== undefined && labs[laby - 1].resource !== lab3.mineralType)) {
            console.log(roomLink(lab3.room.name), 'tigger4', labs[laby - 1].resource, lab3.mineralType, laby - 1);
            lab3.room.memory.labsNeedWork = true;
        }

    }

    if (lab2.mineralType != labs[labz - 1].resource) return false;
    if (lab3.mineralType != labs[laby - 1].resource) return false;


    let zz = lab1.runReaction(lab2, lab3);
    if (zz !== OK) {
        //    console.log(zz,"error in room,",labs[labz - 1].id,,lab1.structureType,lab1.pos,lab2.pos,lab3.pos,created - 1);
        if (zz === -6) { // Not enough mats 
            switchLabMode(roomName);
        }
    }
    return zz;
}

function switchLabMode(roomName) {
    var room = Game.rooms[roomName];
    var lng = room.memory.lab2Mode.length;
    var newMode;

    switch (room.memory.lab2Mode) {
        case "XGH2O":
            if (Memory.stats.totalMinerals.GH2O < 5000) {
                room.memory.lab2Mode = 'GH2O';
     //           console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.GH < 5000) {
                room.memory.lab2Mode = 'GH';
            //    console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.G < 5000) {
                room.memory.lab2Mode = 'G';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;
        case "GH2O":
            if (Memory.stats.totalMinerals.GH < 5000) {
                room.memory.lab2Mode = 'GH';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.OH < 5000) {
                room.memory.lab2Mode = 'OH';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;

        case "XLHO2":
            if (Memory.stats.totalMinerals.LHO2 < 5000) {
                room.memory.lab2Mode = 'LHO2';
             //   console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;

        case "XGHO2":
            if (Memory.stats.totalMinerals.GHO2 < 5000) {
                room.memory.lab2Mode = 'GHO2';
             //   console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;
        case "LHO2":
            if (Memory.stats.totalMinerals.LO < 5000) {
                room.memory.lab2Mode = 'LO';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.OH < 5000) {
                room.memory.lab2Mode = 'OH';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;

        case "ZHO2":
            if (Memory.stats.totalMinerals.ZO < 5000) {
                room.memory.lab2Mode = 'ZO';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.OH < 5000) {
                room.memory.lab2Mode = 'OH';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;

        case "GHO2":
            if (Memory.stats.totalMinerals.GO < 5000) {
                room.memory.lab2Mode = 'GO';
               // console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.OH < 5000) {
                room.memory.lab2Mode = 'OH';
               // console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;
        case "UH2O":
            if (Memory.stats.totalMinerals.UH < 5000) {
                room.memory.lab2Mode = 'UH';
               // console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.OH < 5000) {
                room.memory.lab2Mode = 'OH';
               // console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;

        case "GO":
        case "GH":
            if (Memory.stats.totalMinerals.G < 5000) {
                room.memory.lab2Mode = 'G';
              //  console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;
        case "G":
            if (Memory.stats.totalMinerals.UL < 5000) {
                room.memory.lab2Mode = 'UL';
             //   console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            if (Memory.stats.totalMinerals.ZK < 5000) {
                room.memory.lab2Mode = 'ZK';
             //   console.log(roomLink(roomName), 'doing an lab switch for', roomName, room.memory.lab2Mode);
                return;
            }
            break;

    }
    Game.rooms[roomName].memory.labShift-= 5;
 //   console.log(roomLink(roomName), 'FAILED an lab switch for', roomName, room.memory.lab2Mode,Game.rooms[roomName].memory.labShift);
}

function updateRoomLabsMemory(roomName) {
    if (Game.rooms[roomName].memory.labsNeedWork === undefined) {
        Game.rooms[roomName].memory.labsNeedWork = true;
    }
    if (Game.rooms[roomName].memory.labs === undefined) {
        Game.rooms[roomName].memory.labs = [];
    }
    if (Game.rooms[roomName].memory.labs.length === 0) {
        Game.rooms[roomName].memory.labs = [{
            id: 'none',
        }];
    }
    if (Game.rooms[roomName].memory.labMode === undefined) {
        Game.rooms[roomName].memory.labMode = 'none';
    }
    if (Game.rooms[roomName].memory.lab2Mode === undefined) {
        Game.rooms[roomName].memory.lab2Mode = 'none';
    }
    if (Game.rooms[roomName].memory.primaryLab === undefined) {
        Game.rooms[roomName].memory.primaryLab = true;
    }

    let shiftingMats;
    if (Game.rooms[roomName].memory.labMode === 'shift' || Game.rooms[roomName].memory.labMode === 'shiftGH' || Game.rooms[roomName].memory.labMode === 'shiftBase') {

        if (Game.rooms[roomName].memory.labShift === undefined) {
            Game.rooms[roomName].memory.labShift = 0;
        }
        Game.rooms[roomName].memory.labShift--;
        if (Game.rooms[roomName].memory.lab2Mode === 'none' && Game.rooms[roomName].memory.labShift > 50) {
            Game.rooms[roomName].memory.labShift = 50;
        }
        if (Game.rooms[roomName].memory.labShift < 0) {


            if (Game.rooms[roomName].memory.labMode === 'shift') {
                shiftingMats = _.shuffle(["UH", "UO", "ZH", "ZO", "KH", "KO", "LH", "LO", "GH", "GO", 'ZK', 'UL', 'G', 'OH', 'GH', 'GH2O', 'XGH2O', 'XZH2O', 'XGHO2', 'XKHO2', 'XKH2O', 'XLHO2', 'XZHO2', 'XUH2O', 'XLH2O', "UH2O", "UHO2", "ZH2O", "ZHO2", "KH2O", "KHO2", "LH2O", "LHO2", "GH2O", "GHO2", ]);
            }
            if (Game.rooms[roomName].memory.labMode === 'shiftGH') {
                shiftingMats = _.shuffle(['XGH2O', 'GH2O', 'OH', 'GH', 'G']);
            }
            if (Game.rooms[roomName].memory.labMode === 'shiftBase') {
                shiftingMats = _.shuffle(['LO', 'KO', 'UH', 'KH', 'LH']);
            }
            if (Game.rooms[roomName].memory.labMode === 'shiftG') {
                shiftingMats = _.shuffle(["ZK", 'UL', 'G']);
            }
            if (Game.rooms[roomName].memory.labMode === 'tier1') {
                shiftingMats = _.shuffle(["UH", "UO", "ZH", "ZO", "KH", "KO", "LH", "LO", "GH", "GO"]);
            }
            if (Game.rooms[roomName].memory.labMode === 'tier2') {
                shiftingMats = _.shuffle(["UH2O", "UHO2", "ZH2O", "ZHO2", "KH2O", "KHO2", "LH2O", "LHO2", "GH2O", "GHO2", ]);
            }
            if (Game.rooms[roomName].memory.labMode === 'tier3') {
                shiftingMats = _.shuffle(["XUH2O", "XUHO2", "XZH2O", "XZHO2", "XKH2O", "XKHO2", "XLH2O", "XLHO2", "XGH2O", "XGHO2", ]);
            }



            //        if (Game.rooms[roomName].memory.labMode === 'shiftLow'){
            //              shiftingMats = ['LO','KO','LH'];
            //            }
            Game.rooms[roomName].memory.labShift = shiftCount;
            //if (Game.rooms[roomName].memory.lab2Mode === 'none' || (Memory.stats.totalMinerals[Game.rooms[roomName].memory.lab2Mode] > maxMinerals[Game.rooms[roomName].memory.lab2Mode])) {
                Game.rooms[roomName].memory.lab2Mode = 'none';
                let zz = shiftingMats.length;
                while (zz--) {
//                    console.log(roomName, 'CHECKING shift', zz, shiftingMats[zz], Memory.stats.totalMinerals[shiftingMats[zz]], maxMinerals[shiftingMats[zz]]);
                    if (Memory.stats.totalMinerals[shiftingMats[zz]] < maxMinerals[shiftingMats[zz]]) {
                        Game.rooms[roomName].memory.lab2Mode = shiftingMats[zz];
                        Game.rooms[roomName].memory.labsNeedWork = true;
                        break;
                    }
                }
                if (Game.rooms[roomName].memory.lab2Mode === 'none') {

                    //                  Game.rooms[roomName].memory.lab2Mode = shiftingMats[0];
                    //  _.min( )
                    Game.rooms[roomName].memory.labShift = 50;
                }
//            }
        }
        Game.rooms[roomName].memory.primaryLab = undefined;

        return Game.rooms[roomName].memory.lab2Mode;
    }

    let min = Game.rooms[roomName].memory.labMode;
    if (Memory.stats.totalMinerals[min] !== undefined && Memory.stats.totalMinerals[min] < maxMinerals[min]) {

        Game.rooms[roomName].memory.primaryLab = true;
    } else {
        if (Game.rooms[roomName].memory.lab2Mode == 'none') {
            Game.rooms[roomName].memory.primaryLab = true;
        } else {
            Game.rooms[roomName].memory.primaryLab = false;
        }
    }

    //    if (Game.rooms[roomName].memory.boostRequest !== undefined) Game.rooms[roomName].memory.boostRequest = undefined;

    let roomLabs = returnLabs(roomName); //Game.rooms[roomName].memory.labs;
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
            } else {
                minerals[lab.mineralType] += lab.mineralAmount;
            }
        }

    }



}
var cachedMinerals;
class buildLab {

    static getPlans(roomName) { // returns the acutal plans.
        let zzz = returnLabs(roomName);
        return zzz;
    }


    static maxMinerals() {
        return maxMinerals;
    }


    static getLabs(roomName) { // Returns the object of the labs.
        let returned = [];

        let labs = returnLabs(roomName);

        for (var i in labs) {
            let test = Game.getObjectById(labs[i].id);
            if (test !== null && test.pos.roomName !== roomName) {
                //                console.log('WTF why this not in the same room?', test, test.pos, test.id, roomName);
            } else if (test !== null) {
                returned.push(test);
            }
        }
        return returned;
    }

    static roomLab(roomName) {
        if (Game.rooms[roomName] === undefined) return;
        if (Game.rooms[roomName].controller === undefined || Game.rooms[roomName].controller.level < 6) return;
        if (Game.time%5  === 0) {

            if (_.contains(labRooms, roomName)) {
                if (Game.rooms[roomName] !== undefined) {
                    updateRoomLabsMemory(roomName);
                    //                    console.log(, 'Labs @ ', roomName);

                    // Here we should do the test to do the labmix - before we do any lab getting.
                    var mat = getRoomLabMode(roomName);
                    var doMix = true;
                    if (Game.rooms[roomName].memory.labMode === 'shift' || Game.rooms[roomName].memory.labMode === 'shiftGH' || Game.rooms[roomName].memory.labMode === 'shiftBase') {
                        doMix = true;
                        Game.rooms[roomName].memory.labShift -= 2; //Math.floor(Math.random()*5)+
                    } else if (Memory.stats.totalMinerals[mat] > maxMinerals[mat]) {
                        doMix = false;
                        Game.rooms[roomName].memory.labShift -= Math.floor(Math.random() * 5) + 2;
                        //Game.rooms[roomName].memory.labsNeedWork = true;

                    }
                    if (mat == 'LO') {
                        if (Memory.stats.totalMinerals.L < 60000 || Memory.stats.totalMinerals.O < 60000) {
                            doMix = false;
                        }
                    }

                    if (mat == 'KO') {
                        if (Memory.stats.totalMinerals.K < 60000 || Memory.stats.totalMinerals.O < 60000) {
                            doMix = false;
                        }
                    }
                    if (mat == 'LH') {
                        if (Memory.stats.totalMinerals.L < 30000 || Memory.stats.totalMinerals.H < 30000) {
                            doMix = false;
                        }
                    }
                    if (mat == 'UH') {
                        if (Memory.stats.totalMinerals.U < 10000 || Memory.stats.totalMinerals.H < 10000) {
                            doMix = false;
                        }
                    }


                    if (doMix) {
                        var result;
                        for (var a in oneMatMix) {
                            let form = oneMatMix[a];
                            if(result === OK || result === undefined || !result){
                                 result = labDo(roomName, form[0], form[1], form[2]);
                            } else {
//                                console.log('Not doing labs');
                                Game.rooms[roomName].memory.labShift -= 1; 
                            }
                        }
                    }



                }
            }
        }

        //        if (Game.rooms[roomName].memory.boostLabID === undefined) return;

        if (Game.rooms[roomName].memory.boost !== undefined && Game.rooms[roomName].memory.boost.mineralType === 'none') {
            return;
        } else {
            if (Game.rooms[roomName].memory.boost.mineralAmount === 0 || Game.rooms[roomName].memory.boost.timed === 0) {
                Game.rooms[roomName].memory.boost.mineralType = 'none';
                Game.rooms[roomName].memory.boost.mineralAmount = 0;
                Game.rooms[roomName].memory.boost.timed = 0;
                return;
            }
        }

        let lab = Game.rooms[roomName].boostLab; // Game.getObjectById(Game.rooms[roomName].memory.boostLabID);
        if (lab === undefined) { return; }
        let good = Game.rooms[roomName].find(FIND_MY_CREEPS);
        good = _.filter(good, function(o) {
            return _.contains(o.memory.boostNeeded, lab.mineralType) && o.pos.isNearTo(lab);
        });
        //        console.log(roomLink(roomName), 'boost check', good.length, Game.rooms[roomName].memory.boost.mineralAmount, lab.mineralAmount);
        if (good.length > 0 && Game.rooms[roomName].memory.boost.mineralAmount === lab.mineralAmount) {
//            console.log('doing boost', good.length, roomLink(roomName));
            let result = lab.boostCreep(good[0]);
            if (result === OK) {
                good[0].room.memory.boost.mineralType = 'none';
                //                good[0].room.memory.boost.mineralAmount = 0;
                good[0].room.memory.boost.timed = 0;
                good[0].memory.isBoosted = true;
                good[0].say('ahhh');
                let zz = good[0].memory.boostNeeded.length;
                while (zz--) {
                    if (lab.mineralType === good[0].memory.boostNeeded[zz]) {
                        good[0].memory.boostNeeded.splice(zz, 1);
                        //                        break;
                    }
                }
            }
        }
    }

    static neededMinerals(roomName) {
        let mins = [];
        let labs = returnLabs(roomName);
        //if (cachedMinerals === undefined) {
        //    cachedMinerals = {};
        //  }
        // Go through the labs in that room,
        // see what resources it needs,
        // send back array that has required
        // Terminal will use this, and then terminal will see if others have what it wants and gets it sent to them.
        //    if (cachedMinerals[roomName] === undefined) {
        for (var e in labs) {
            if (!labs[e].emptied && labs[e].resource !== 'none') {
                mins.push(labs[e].resource);
            }
        }
        if (Game.rooms[roomName].memory.boost.mineralType !== 'none') {
            mins.push(Game.rooms[roomName].memory.boost.mineralType);
        }
        return _.uniq(mins);
        //      }
        //        return cachedMinerals[roomName];
    }


    static moveToTransfer(creep) {
        let What;
        if (creep.carryTotal !== 0) {
            What = creep.carrying;//whatDoIHave(creep);
        } else {
            for (var a in creep.carry) {
                if (creep.carry[a] > 0)
                    What = a;
            }
        }
        let Where = whereDoIPut(creep, What);
        creep.say('m'+Where);
        if (Where === undefined) return false;
        if (Where.mineralType !== null) {
            if (Where.mineralType != What) return false;
        }

        if (creep.pos.isNearTo(Where)) {
            creep.transfer(Where, What);
        } else {
            creep.moveMe(Where);
        }
        return true;
    }


    static getFromTerminal(creep) { // gets the resource wanted from the terminal.
        //        creep.say('g');
        let wanted = whatDoIget(creep);
        if (wanted === undefined) return false;
        let howMuch = howMuchDoIget(creep, wanted);

        if (creep.room.terminal.store[wanted] === undefined || creep.room.terminal.store[wanted] < 1000) {
            _terminal_().requestMineral(creep.room.name, wanted);
        }
        if (creep.withdraw(creep.room.terminal, wanted) == ERR_NOT_IN_RANGE) {
            creep.moveMe(creep.room.terminal);
        }
        return true;
    }
}

module.exports = buildLab;