var shiftCount = 1800;
var _maxMinAmount = 175000;
var s1LabRooms = [];
var _maxT3MinAmount = 355000;
var maxMinerals = {

    'OH': _maxT3MinAmount,
    'UL': _maxMinAmount,
    'ZK': _maxMinAmount,


    'G': _maxT3MinAmount,

    'GH': _maxMinAmount, // Upgrade
    'GH2O': _maxMinAmount,
    'XGH2O': _maxT3MinAmount, // Trigger used for upgrading

    'KH': _maxMinAmount,
    'KH2O': _maxMinAmount, // Carry
    'XKH2O': _maxT3MinAmount, // Carry Used for Power


    'XLH2O': _maxT3MinAmount, // Repair *
    'LH2O': _maxMinAmount, // Repair *
    'LH': _maxMinAmount, // Always used


    'XGHO2': _maxT3MinAmount, // Used for power,bandits
    'GHO2': _maxMinAmount,
    'GO': _maxMinAmount, // Toughness

    'XZH2O': _maxT3MinAmount, // Dismantle // Not used
    'ZH2O': _maxMinAmount, // Dismantle
    'ZH': _maxMinAmount, // Dismantle

    'XKHO2': _maxT3MinAmount, // Ranged* 
    'KHO2': _maxMinAmount, // Ranged*
    'KO': _maxMinAmount, // SK

    'XZHO2': _maxT3MinAmount, //  Move* // Used for power/bandits
    'ZHO2': _maxMinAmount, //  Move*
    'ZO': _maxMinAmount, // Move

    'XUH2O': _maxT3MinAmount, // Attack // Used for bandits
    'UH2O': _maxMinAmount, // Attack // used for pwoer
    'UH': _maxMinAmount, // Repair

    'XUHO2': _maxT3MinAmount, // Harvest // Used for hojme rooms
    'UHO2': _maxMinAmount,
    'UO': _maxMinAmount,

    'XLHO2': _maxT3MinAmount, // Heal* // used for SK and power
    'LHO2': _maxMinAmount, // Heal*
    'LO': _maxMinAmount,

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




function getCached(id) {
    return Game.getObjectById(id);
}

function labMode(roomName, mode, labs) {
    switch (mode) {
        case 'empty':
        case 'none':
            for (var bb in labs) {
                labs[bb].resource = undefined;
            }
            return labs;

        default:
            return doNewLabSetup(roomName, mode, labs);
    }

}


function returnLabs(roomName) {
    var mode;
    if (Game.rooms[roomName].memory.primaryLab) {
        mode = Game.rooms[roomName].memory.labMode;
    } else {
        mode = Game.rooms[roomName].memory.lab2Mode;
    }
    //return doNewLabSetup(roomName, mode, labs);
    return labMode(roomName, mode, Game.rooms[roomName].memory.labs);
}


function whatDoIget(creep) {
    let labs = returnLabs(creep.room.name);

    for (var i in labs) {
        if (labs[i].resource && labs[i].resource != 'none') {
            let currentLab = getCached(labs[i].id);
            //        if (currentLab !== null && currentLab.energy < currentLab.energyCapacity && currentLab.room.name == creep.room.name && !labs[i].emptied) {
            //              return RESOURCE_ENERGY;
            //            }
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
        if (labs[i].resource && labs[i].resource == wanted) {
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
/*
function whatDoIHave(creep) {
    for (var i in creep.carry) {
        if (creep.carry[i] > 0) {
            return i;
        }
    }
} */

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
    //    labs = _.clone(labs);
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


//var labsInRoom;

function labCheck(roomName, created, labz, laby) {
    let labs = returnLabs(roomName);
    if (created === 0) {
        //     console.log(roomName, "Created 0 Fail");
        return false;
    }
    let targetLab = labs[created - 1];
    let form1 = labs[labz - 1];
    let form2 = labs[laby - 1];
    if (targetLab === undefined || form1 === undefined || form2 === undefined) {
        //    console.log(roomName, "Undefined Fail");
        return false;
    }

    let endLab = Game.getObjectById(targetLab.id);
    let lab2 = getCached(form1.id);
    let lab3 = getCached(form2.id);
    if (endLab === null || lab2 === null || lab3 === null) {
        //  console.log(roomName, "Null Fail");
        return false;
    }
    let labRoom = lab3.room;
    if (!labRoom.memory.labsNeedWork) {
        let zed;
        if (lab2.mineralType === null) {
            if (labRoom.terminal.store[form1.resource] === undefined || labRoom.terminal.store[form1.resource] < 100) {
                zed = roomRequestMineral(labRoom.name, form1.resource,3000);
                if (zed === OK) {
                    lab3.room.memory.labsNeedWork = true;
                } else {
                    Game.rooms[roomName].memory.labShift -= 10;

                }
            } else {
                lab3.room.memory.labsNeedWork = true;
            }
            //    console.log(lab3.room.name, 'null mineral Lab Tigger1', form1.resource, zed);
            return false;
        }
        if (lab3.mineralType === null) {
            if (labRoom.terminal.store[form2.resource] === undefined || labRoom.terminal.store[form2.resource] < 100) {
                zed = roomRequestMineral(labRoom.name, form2.resource,3000);
                if (zed !== false) {
                    lab3.room.memory.labsNeedWork = true;
                } else {
                    Game.rooms[roomName].memory.labShift -= 10;
                }
            } else {
                lab3.room.memory.labsNeedWork = true;
            }
            //   console.log(lab3.room.name, 'null mineral Lab Tigger2', form2.resource, lab3.room.memory.labsNeedWork, zed);
            return false;
        }else {

        }

        if (endLab.mineralAmount >= 2950) {
            //   console.log(lab3.room.name, 'max lab trigger');
            lab3.room.memory.labsNeedWork = true;
            return false;
        }
        //      if ((!form1.emptied && (lab2.mineralAmount < 150 ) ) || //&& ()
        if (!form2.emptied && lab3.mineralAmount < 5) { //&& (lab3.room.terminal.store[form2.resource] > 1)
            //     console.log(lab3.room.name, 'low lab amount trigger');
            if (lab3.room.terminal.store[form2.resource] > 5) {
                lab3.room.memory.labsNeedWork = true;
            } else {
                roomRequestMineral(labRoom.name, form2.resource,3000-lab3.mineralAmount);
            }
            return false;
        }
        if (!form1.emptied && lab2.mineralAmount < 5) { //&& 
            //    console.log(lab3.room.name, 'low lab amount trigger');
            if (lab2.room.terminal.store[form1.resource] > 1) {
                lab3.room.memory.labsNeedWork = true;
            } else {
                roomRequestMineral(labRoom.name, form1.resource,3000-lab3.mineralAmount);
            }
            return false;
        }
        if (form1.resource !== 'none' &&
            ((lab2.mineralType !== undefined && lab2.mineralType !== null) && form1.resource !== undefined &&
                form1.resource !== lab2.mineralType)) {
            //            console.log(lab3.room.name, 'mismatch Trigger', lab2.mineralType, form1.resource, lab2.mineralType);
            lab3.room.memory.labsNeedWork = true;
            return false;
        }

        if ((lab3.room.memory.lab2Mode !== 'none') && (lab3.mineralType !== null && form2.resource !== undefined && form2.resource !== lab3.mineralType)) {
            //          console.log(roomLink(lab3.room.name), 'mismatch Trigger2', lab3.mineralType, form2.resource, form2.resource, lab3.mineralType);

            lab3.room.memory.labsNeedWork = true;
            return false;
        }

    }

    if (lab2.mineralType != form1.resource) {
        //   console.log(lab3.room.name, "Mistach Fail");
        return false;
    }
    if (lab3.mineralType != form2.resource) {
        // console.log(lab3.room.name, "Mismatch fail 2");
        return false;
    }
    return true;
}


function labDo(roomName, created, labz, laby) {
    let labs = returnLabs(roomName);
    let lab1 = Game.getObjectById(labs[created - 1].id);
    let lab2 = getCached(labs[labz - 1].id);
    let lab3 = getCached(labs[laby - 1].id);
    if (lab1 === null || lab2 === null || lab3 === null) return false;
    //    lab1.room.visual.line(lab1.pos, lab2.pos, { color: 'red' });
    //  lab1.room.visual.line(lab1.pos, lab3.pos, { color: 'red' });

    let zz = lab1.runReaction(lab2, lab3);
    if (zz !== OK) {
    } 
    return zz;
}
function onlyEffectedLabDo(roomName, created, labz, laby) {
    let labs = returnLabs(roomName);
    let lab1 = Game.getObjectById(labs[created - 1].id);
    let lab2 = getCached(labs[labz - 1].id);
    let lab3 = getCached(labs[laby - 1].id);
    if (lab1 === null || lab2 === null || lab3 === null) return false;
    if(lab1.effects && lab1.effects.length > 0){
        let zz = lab1.runReaction(lab2, lab3);
    }
}

function newlabSwitchToComponents(roomName) {
    var room = Game.rooms[roomName];
    if (Game.shard.name !== 'shard1') return false;
    var _info; // = Memory.stats.totalMinerals;
    if (room.memory.labsNeedWork) return false;
    if (room.memory.labMode === 'none') return false;
    _info = room.terminal.store;
    let labs = returnLabs(roomName);
    let lab1 = getCached(labs[0].id);
    let lab2 = getCached(labs[1].id);
    var targetMin;
    if (lab1.mineralAmount === null) {
        targetMin = lab2.mineralType;
        if (!targetMin) {
            targetMin = labs[1].resource;
        }
    } else if (lab2.mineralAmount === null) {
        targetMin = lab1.mineralType;
        if (!targetMin) {
            targetMin = labs[0].resource;
        }
    } else if (lab1.mineralAmount > lab2.mineralAmount) {
        targetMin = lab2.mineralType;
        if (!targetMin) {
            targetMin = labs[1].resource;
        }
    } else {
        targetMin = lab1.mineralType;
        if (!targetMin) {
            targetMin = labs[0].resource;
        }
    }

    if (targetMin && targetMin.length > 1 && checkMats(targetMin) && Game.rooms[roomName].memory.labShift < 500) {
        console.log("NEW SWITCH", lab1.mineralAmount, lab2.mineralAmount, targetMin, roomLink(roomName));
        room.memory.lab2Mode = targetMin;
        room.memory.labsNeedWork = true;
        Game.rooms[roomName].memory.labShift = Math.floor(Math.random() * 1000) + 500;
    } else {
        //    console.log("NEW BAD SWITCH",lab1.mineralAmount, lab2.mineralAmount,targetMin,labs[0].resource,labs[1].resource);
    }

    // lets look at the reason why - so lab #1 and 2

}

function labSwitchToComponents(roomName) {
    var room = Game.rooms[roomName];
    var _info; // = Memory.stats.totalMinerals;
    if (room.memory.labsNeedWork) return false;
    _info = room.terminal.store;
    var _switch;
    var _switch2;
    if (room.memory.lab2Mode.length === 5) {
        _switch = room.memory.lab2Mode.substring(1, 5);
    } else if (room.memory.lab2Mode.length === 4) {
        let type = room.memory.lab2Mode.substring(0, 1);
        let isH = room.memory.lab2Mode.substring(1, 2);
        if (isH === 'H') {
            _switch = type + 'H';
        } else {
            _switch = type + 'L';
        }
        _switch2 = 'OH';
    } else {
        switch (room.memory.lab2Mode) {
            case "GO":
            case "GH":
                _switch = 'G';
                break;
            case "G":
                _switch = 'UL';
                _switch2 = 'ZK';
                break;
        }
    }


    if (_switch !== undefined) {
        if (_info[_switch] < 100 || _info[_switch] === undefined) {
            room.memory.lab2Mode = _switch;
            console.log(roomLink(roomName), _switch, _switch2, "Doing lab4 switch");

            return true;
        }
    }
    if (_switch2 !== undefined) {
        if (_info[_switch2] < 100 || _info[_switch2] === undefined) {
            room.memory.lab2Mode = _switch2;
            console.log(roomLink(roomName), _switch, _switch2, "Doing lab4 switch2");
            return true;
        }
    }



    return false;
}

function updateRoomLabsMemory(roomName) {
    if (Game.rooms[roomName].memory.labsNeedWork === undefined) {
        Game.rooms[roomName].memory.labsNeedWork = false;
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
    if (Game.rooms[roomName].memory.labMode === 'shift') {

        if (Game.rooms[roomName].memory.labShift === undefined) {
            Game.rooms[roomName].memory.labShift = 0;
        }

        Game.rooms[roomName].memory.labShift -= 1;

        if (Game.rooms[roomName].memory.lab2Mode === 'none') {
            //        if (Game.rooms[roomName].memory.labShift > 50) {
            //              Game.rooms[roomName].memory.labShift = 50;
            //            }
            Game.rooms[roomName].memory.labShift -= 5;
        }


        if (Game.rooms[roomName].memory.labShift < 0) {
            shiftingMats = _.shuffle(["UH", "UO", "ZH", "ZO", "KH", "KO", "LH", "LO", "GH", "GO", 'ZK', 'UL', 'G', 'OH', 'GH', 'GH2O', 'XGH2O', 'XZH2O', 'XGHO2', 'XKHO2', 'XKH2O', 'XLHO2', 'XZHO2', 'XUH2O', 'XLH2O', 'XUHO2', "UH2O", "UHO2", "ZH2O", "ZHO2", "KH2O", "KHO2", "LH2O", "LHO2", "GH2O", "GHO2", ]);
            Game.rooms[roomName].memory.labShift = shiftCount;
            //if (Game.rooms[roomName].memory.lab2Mode === 'none' || (Memory.stats.totalMinerals[Game.rooms[roomName].memory.lab2Mode] > maxMinerals[Game.rooms[roomName].memory.lab2Mode])) {
            Game.rooms[roomName].memory.lab2Mode = 'none';
            let zz = shiftingMats.length;
            while (zz--) {
                //                console.log(roomName, 'CHECKING shift', zz, shiftingMats[zz],"Need work check:",Memory.stats.totalMinerals[shiftingMats[zz]] < maxMinerals[shiftingMats[zz]],"mats check:", checkMats(shiftingMats[zz]));
                if (Memory.stats.totalMinerals[shiftingMats[zz]] < maxMinerals[shiftingMats[zz]] && checkMats(shiftingMats[zz])) {
                    Game.rooms[roomName].memory.lab2Mode = shiftingMats[zz];
//                    Game.rooms[roomName].memory.labsNeedWork = true;
                    break;
                } else {
                    //                    Memory.stats.totalMinerals[mat] > maxMinerals[mat]
                }
            }


            if (Game.rooms[roomName].memory.lab2Mode === 'none') {
                Game.rooms[roomName].memory.labsNeedWork = true;
                //              if (Memory.stats.totalMinerals.XUHO2 < (_maxT3MinAmount * 2)) {
                //                    Game.rooms[roomName].memory.lab2Mode = 'XUHO2';
                //            }
                Game.rooms[roomName].memory.labShift = 450;
            }
            //            }
        }
        Game.rooms[roomName].memory.primaryLab = undefined;

        return Game.rooms[roomName].memory.lab2Mode;
    }

    let min = Game.rooms[roomName].memory.labMode;
    if (Memory.stats.totalMinerals && Memory.stats.totalMinerals[min] !== undefined && Memory.stats.totalMinerals[min] < maxMinerals[min]) {
        Game.rooms[roomName].memory.primaryLab = true;
    } else {
        if (Game.rooms[roomName].memory.lab2Mode == 'none') {
            Game.rooms[roomName].memory.primaryLab = true;
        } else {
            Game.rooms[roomName].memory.primaryLab = false;
        }
    }

    //    if (Game.rooms[roomName].memory.boostRequest !== undefined) Game.rooms[roomName].memory.boostRequest = undefined;
    /*
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

        } */



}

function checkMats(mat) {

    if (mat == 'LO') {
        if (Memory.stats.totalMinerals.L < 40000 || Memory.stats.totalMinerals.O < 40000) {
            return false;
        }
    }
    if (mat == 'UO') {
        if (Memory.stats.totalMinerals.U < 60000 || Memory.stats.totalMinerals.O < 60000) {
            return false;
        }
    }

    if (mat == 'KH') {
        if (Memory.stats.totalMinerals.K < 60000 || Memory.stats.totalMinerals.H < 60000) {
            return false;
        }
    }
    if (mat == 'KO') {
        if (Memory.stats.totalMinerals.K < 60000 || Memory.stats.totalMinerals.O < 60000) {
            return false;
        }
    }
    if (mat == 'LH') {
        if (Memory.stats.totalMinerals.L < 30000 || Memory.stats.totalMinerals.H < 50000) {
            return false;
        }
    }
    if (mat == 'UH') {
        if (Memory.stats.totalMinerals.U < 10000 || Memory.stats.totalMinerals.H < 10000) {
            return false;
        }
    }
    if (mat == 'GH' || mat == 'GH2O') {
        if (Memory.stats.totalMinerals.H < 60000) {
            return false;
        }
    }
    return true;
}

function doNewBoostLab(roomName) {
    const room = Game.rooms[roomName];
    const info = room.memory.boost;
    if (!info) {

        //            console.log('No boost Info',roomLink(roomName));
        return false;
    }
    const boostMineral = info.mineralType;
    if (!info.resourcesNeeded) {

        // console.log('bad ResNeed', roomLink(roomName));
        return false;
    }

    const mineralNeed = info.resourcesNeeded.mineral;
    const energyNeed = info.resourcesNeeded.energy;
    const boostLab = room.boostLab;
    if (!boostLab) {

        //   console.log('bad BoostlB', roomLink(roomName));
        return;
    }

    const tarCreep = Game.getObjectById(info.creepID);
    if (!tarCreep) {
        //            console.log('CreepNull', roomLink(roomName));
        room.memory.boost = undefined;
        return false;
    }
    if (tarCreep.memory.boostNeeded && tarCreep.memory.boostNeeded.length === 0) {

        room.memory.boost = undefined;
        return false;
    }
    if (tarCreep.memory.isBoosted && tarCreep.memory.isBoosted.length === 0) {
        //      console.log('bad Tcre', roomLink(roomName));
        return false;
    }
    if (boostLab.mineralType !== boostMineral) {
        //        console.log('Wrong type', roomLink(roomName));
        return false;
    }
    if (boostLab.mineralAmount < mineralNeed) {
        //        console.log('not min enmough', roomLink(roomName));
        return false;
    }
    if (boostLab.energyAmount < energyNeed) {
        //      console.log('not ene enoughenguh', roomLink(roomName));
        return false;
    }
    if (!tarCreep.pos.isNearTo(boostLab)) {
        //        console.log('Not near', roomLink(roomName));
        tarCreep.moveTo(boostLab, { reusePath: 10 });
        boostLab.room.visual.line(boostLab.pos, tarCreep.pos, { color: 'blue' });
        tarCreep.say('YAY');
        return false;
    }
    let result = boostLab.boostCreep(tarCreep);

    if (result === OK) {
        if (tarCreep.memory.isBoosted === undefined) tarCreep.memory.isBoosted = [];
        tarCreep.say('ahhh');
        tarCreep.memory.isBoosted.push(tarCreep.memory.boostNeeded.shift());
        room.memory.boost = undefined;
        return false;
    } else if (result === -5) { // Already boosted
        if (tarCreep.memory.isBoosted === undefined) tarCreep.memory.isBoosted = [];
        tarCreep.memory.isBoosted.push(tarCreep.memory.boostNeeded.shift());
        room.memory.boost = undefined;
        return false;
    } else if (result === ERR_INVALID_TARGET) {
        spawnBoostingREMOVED = true;
    } else {

        console.log(result, roomLink(roomName), "BAD LAB RESULTS OTHER THAN OK");
    }
}
var spawnBoostingREMOVED;
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
        if (Game.rooms[roomName].memory.focusWall && Game.rooms[roomName].memory.focusWall) {
            Game.rooms[roomName].memory.lab2Mode = 'none';

            if (Game.rooms[roomName].memory.boost !== undefined && Game.rooms[roomName].memory.boost.mineralType !== 'none') {
                doNewBoostLab(roomName); // Boosting Targets.
            }

            return;
        }

        if (Game.shard.name === 'shard0' && Game.cpu.bucket < 500) {
            if (Game.rooms[roomName].memory.boost !== undefined && Game.rooms[roomName].memory.boost.mineralType !== 'none') {
                doNewBoostLab(roomName); // Boosting Targets.
            }

            return;
        }
        if (Game.time % 5 === 0) {
/*        if (!_.contains(s1LabRooms, roomName) && Game.rooms[roomName].controller.owner !== undefined && Game.rooms[roomName].controller.owner.username === 'likeafox') {
            s1LabRooms.push(roomName);
            if(!Memory.roomNumber) Memory.roomNumber = 1;
            if( s1LabRooms.length > Memory.roomNumber ) Memory.roomNumber = s1LabRooms.length;
            console.log(Memory.roomNumber,"Number of rooms");
        }*/

            if (Game.time % 510 === 0 && Game.shard.name === 'shard1' && Game.rooms[roomName].memory.lab2Mode !== 'none') {
                console.log(roomLink(roomName), "lab shifting:", Game.rooms[roomName].memory.lab2Mode, "Current Count:", Memory.stats.totalMinerals[Game.rooms[roomName].memory.lab2Mode], "/", maxMinerals[Game.rooms[roomName].memory.lab2Mode], "time:", Game.rooms[roomName].memory.labShift);
            }
            if (Game.rooms[roomName].memory.labs === undefined) {
                Game.rooms[roomName].memory.labs = [{
                    id: 'none',
                }];
            }
            if (Game.rooms[roomName].memory.labMode === undefined) {
                Game.rooms[roomName].memory.labMode = 'none';
            }

            if ((Game.rooms[roomName].memory.labMode !== undefined && Game.rooms[roomName].memory.labMode === 'shift') || Game.rooms[roomName].boostLab !== undefined) { //|| _.contains(ez, roomName) 
                if (Game.rooms[roomName] !== undefined) {
                    updateRoomLabsMemory(roomName);
                    // Here we should do the test to do the labmix - before we do any lab getting.
                    var mat = getRoomLabMode(roomName);
                    var doMix = true;
                    if (Memory.stats.totalMinerals && Memory.stats.totalMinerals[mat] > maxMinerals[mat]) {
                        //                        console.log('failed doMix With MaxMinerals', roomLink(roomName), Memory.stats.totalMinerals[mat], maxMinerals[mat], mat);
                        doMix = false;
                        Game.rooms[roomName].memory.labShift -= 5;
                    } else if (Game.rooms[roomName].memory.lab2Mode === 'none' && Game.shard.name !== 'shard2') {
                        //                        console.log('failed doMix with none mode', roomLink(roomName));
                        doMix = false;
                    }

                    if (doMix && !labCheck(roomName, 3, 1, 2)) {
                        //                        console.log('failed doMix with labCheck', roomLink(roomName));
                        doMix = false;
                        if (Game.shard.name === 'shard1') {
                            if (!checkMats(mat)) {
                                //                            console.log('Failed Mats check WILL SHIFT:', roomName, mat, Game.rooms[roomName].memory.labShift);
  //                                              if(roomName === 'E28S42') console.log('labwork tigger5 chkmats2');

//                                Game.rooms[roomName].memory.labsNeedWork = true;
                                Game.rooms[roomName].memory.labShift -= 25;
                            } else {}
                        } else {
                            Game.rooms[roomName].memory.labsNeedWork = true;
                        }
                    }

                    if (roomName === 'E1S11') doMix = true;
                    var oneMatMix;
                    if(!doMix && Game.rooms[roomName].powerLevels && Game.rooms[roomName].powerLevels[PWR_OPERATE_LAB] && !Game.rooms[roomName].memory.labsNeedWork ){
                         oneMatMix = [
                            [3, 1, 2],
                            [4, 1, 2],
                            [5, 1, 2],
                            [7, 1, 2],
                            [8, 1, 2],
                            [9, 1, 2],
                            [10, 1, 2],
                        ];
                        for (let a in oneMatMix) {
                            let form = oneMatMix[a];
                            let res = onlyEffectedLabDo(roomName, form[0], form[1], form[2]);
                        }
                    }else if (doMix) {
                         oneMatMix = [
                            [3, 1, 2],
                            [4, 1, 2],
                            [5, 1, 2],
                            [7, 1, 2],
                            [8, 1, 2],
                            [9, 1, 2],
                            [10, 1, 2],
                        ];
                        for (let a in oneMatMix) {
                            let form = oneMatMix[a];
                            let res = labDo(roomName, form[0], form[1], form[2]);
                            if (res !== OK) {
                                //                              if (roomName === 'E1S11')
                            } else if (res === OK) {
                                //  mixes++;
                            }
                        }
                    } else {
                        if (Game.rooms[roomName]._didCheck === undefined && !Game.rooms[roomName].memory.labsNeedWork && Game.rooms[roomName].memory.labMode === 'none') {
                            if (newlabSwitchToComponents(roomName)) {
                                //if (labSwitchToComponents(roomName)) {
                                // console.log(roomLink(roomName), 'room did labSwitch to do LabSwitc222222222222222222h');
                                //                                        Game.rooms[roomName].memory.labShift = 1000;
                            }
                            Game.rooms[roomName]._didCheck = true;
                        }

                    }

                }
            }
        }

        if (Game.rooms[roomName].memory.boost !== undefined && Game.rooms[roomName].memory.boost.mineralType !== 'none') {
            doNewBoostLab(roomName); // Boosting Targets.
        }
        return;
    }

    static prohibitedMinerals(roomName) {
        if (Game.rooms[roomName].memory.lab2Mode !== undefined) {
            if (!Game.rooms[roomName].memory.lab2Mode || Game.rooms[roomName].memory.lab2Mode === 'none') {
                return [];
            } else {
                let rtn = Array.from(Game.rooms[roomName].memory.lab2Mode);
                if (Game.rooms[roomName].memory.boost !== undefined && Game.rooms[roomName].memory.boost.mineralType !== 'none') {
                    rtn.push(Game.rooms[roomName].memory.boost.mineralType);
                }
                return rtn;
            }
        }
    }


    static moveToTransfer(creep) {
        let What;
        if (creep.carryTotal !== 0) {
            What = creep.carrying;
        }

        let Where = whereDoIPut(creep, What);
        //        creep.say('m' + Where);
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

        if (creep.room.terminal.store[wanted] === undefined || creep.room.terminal.store[wanted] < howMuch) {
            roomRequestMineral(creep.room.name, wanted, howMuch);
        }
        if (creep.withdraw(creep.room.terminal, wanted) == ERR_NOT_IN_RANGE) {
            creep.moveMe(creep.room.terminal);
        }
        return true;
    }
}

module.exports = buildLab;