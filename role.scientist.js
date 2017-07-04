//

var classLevels = [
    [CARRY, MOVE],

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    // 500
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ],
    // 600
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ],

    // 1000
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE
    ]


];

var groupOne = [
    '58b4b98952bcc31f7967fb57', //E29S79
    '58b765651d11996760a39d15', //E28S77
    '58af2ceb751600062cd0c58d', // Spawn 1
    '58aff827090180496c7848fb', // Spawn 3
    '58b11106554d4c1333aed29b', // spawn 4
    '58af4822278c0725a7ad4642', // spawn 2
    '58c074ead62936ed5e2bce0b', // E27S75
    '5934fa72604c7e190610993f', // E23S75
    '58fae20240468f2a39d50830', // E38S72
    '58d97b7b8c94aa185ccaf659', //E35S83
    '58f793ad1f64b8d842dc0c16', // E37S75
    '58dc1eb90c1c7697092ce5c2', // E35S73
    '5923a6cbf9f4ceb75afbc831', // E33S76
    '59090e6f771e5d03793d20b4' // W4S93
    //,'58c074ead62936ed5e2bce0b' // E27S75
];

var groupTwo = [];

var roleParent = require('role.parent');
var labsBuild = require('build.labs');

function mineralContainerEmpty(creep) {
    //    if (creep.memory.containsGood) return false;
    let contains = creep.room.find(FIND_STRUCTURES);
    contains = _.filter(contains, function(o) {
        return o.structureType == STRUCTURE_CONTAINER;
    });
    var e = contains.length;
    var a;
    while (e--) {
        var keys = Object.keys(contains[e].store);
        var z = keys.length;
        while (z--) {
            a = keys[z];
            if (a != RESOURCE_ENERGY && contains[e].store[a] > creep.stats('carry')) {
                if (creep.pos.isNearTo(contains[e])) {
                    creep.withdraw(contains[e], a);
                } else {
                    creep.moveMe(contains[e], { reusePath: 15 });
                    return true;
                }
            }
        }
    }
}


function getGroup(creep) {
    let id = creep.id;
    return groupOne;
}

function changeParent(creep) {
    if (creep.memory.changedParent) {
        if (creep.ticksToLive < 50) {
            creep.suicide();
            return;
        } else if (_.sum(creep.carry) === 0) {
            creep.suicide();
            return;
        } else {
            return;
        }
    }

    let spawnGroup = getGroup(creep);

    if (creep.memory.scientistID === undefined) { creep.memory.scientistID = 2; }
    if (creep.ticksToLive > (3 * creep.body.length) + creep.memory.distance) return false;
    let noScientist = false;
    do {
        creep.memory.scientistID++;
        let zzz = _.filter(Game.creeps, function(o) {
            return o.memory.role == 'scientist' && o.memory.scientistID == creep.memory.scientistID;
        });
        if (zzz.length === 0) noScientist = true;
    } while (noScientist);

    let zz = Game.getObjectById(spawnGroup[creep.memory.scientistID]);
    //console.log(zz)
    if (zz !== null && zz.room.name == 'E27S75') {
        if (zz === null || zz.room.controller.level === null || zz.room.controller.level < 7) creep.memory.scientistID++;
    } else {
        if (zz === null || zz.room.controller.level === null || zz.room.controller.level < 6) creep.memory.scientistID++;
    }

    if (creep.memory.scientistID > spawnGroup.length - 1) creep.memory.scientistID = 0;

    creep.memory.parent = spawnGroup[creep.memory.scientistID];
    creep.memory.changedParent = true;

    let spawnsDo = require('build.spawn');
    spawnsDo.reportDeath(creep);
    creep.memory.changedParent = true;
    if (_.sum(creep.carry) === 0) {
        creep.suicide();
    }
}

function labNeedReducing(creep) {
    var theplans = labsBuild.getPlans(creep.room.name);
    var e = theplans.length;
    while (e--) {
        let lab = Game.getObjectById(theplans[e].id);
        if (lab !== null && theplans[e].emptied && lab.room.name == creep.room.name && lab.mineralAmount >= 500) {
            creep.say('redo');
            if (creep.pos.isNearTo(lab)) {
                creep.withdraw(lab, lab.mineralType);
                return true;
            } else {
                creep.moveMe(lab.pos);
                return true;
            }
        }
    }
    return false;
}

class scientistRole extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1)
            level = classLevels.length - 1;

        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        if (super.returnEnergy(creep)) {
            return;
        }


        if (creep.memory.distance === undefined) creep.memory.distance = 0;
        //        super.rebirth(creep);
        //        if(Game.cpu.bucket < 3000 && creep.room.name !='E26S73') return;

        if (super.returnEnergy(creep)) {
            return;
        }
        if (!creep.memory.party) {
            changeParent(creep);
        } else {
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].room !== undefined &&
                creep.room.name !== Game.flags[creep.memory.party].room.name) {
                creep.suicide();
            }
        }


        if (creep.saying == 'raiders') {
            if (creep.memory.party === undefined)
                creep.memory.distance += 40;
            creep.say('suck', true);
            return;
        }
        if (creep.saying == 'suck') {
            if (creep.memory.party === undefined)
                creep.memory.distance += 35;
            creep.say('balls', true);
            return;
        }
        if (creep.memory.distance === 0) creep.memory.distance = 100;
        creep.say('sci');

        var total = _.sum(creep.carry);
        if (total === 0) {
            creep.memory.putaway = false;
        }
        if (total > 0) {
            creep.memory.putaway = true;
        }

        if (creep.memory.putaway) {
            if (!labsBuild.moveToTransfer(creep)) {
                if (creep.room.name == 'E33S76') {
                    super._containers.moveToStorage(creep);
                } else {
                    super._containers.moveToTerminal(creep);
                }
            }
        } else {

            var _labs = labsBuild.getLabs(creep.room.name);

            if (_labs.length > 0 && _.sum(creep.carry) === 0) { // If there are labs. 
                var i = _labs.length;
                while (i--) { // go through them

                    var plan = labsBuild.getPlans(_labs[i].pos.roomName); // get the plans

                    if (plan[i].id == _labs[i].id && (plan[i].resource != _labs[i].mineralType) && (_labs[i].mineralAmount > 0)) {
                        creep.say('clear');

                        if (creep.pos.isNearTo(_labs[i])) {
                            // need to check if the lab has mineral type wanted.
                            if (creep.withdraw(_labs[i], _labs[i].mineralType) == OK) {
                                creep.memory.putaway = true;
                            }
                        } else {
                            creep.moveMe(_labs[i]);
                        }
                        return;
                    }
                }

                if (!labsBuild.getFromTerminal(creep)) {
                    //if(creep.room.name == 'E23S75') console.log(labsBuild.getFromTerminal(creep));
                    let otherThings = false;
                    var keys = Object.keys(creep.room.storage.store);
                    var n = keys.length;
                    while (n--) {
                        var e = keys[n];
                        if (e != RESOURCE_ENERGY && creep.room.storage.store[e]) {
                            otherThings = true;
                            if (creep.pos.isNearTo(creep.room.storage)) {
                                creep.withdraw(creep.room.storage, e);
                            } else {
                                creep.moveMe(creep.room.storage);
                            }
                        }
                    }

                    if (!otherThings) {

                        if (!mineralContainerEmpty(creep))
                            if (!labNeedReducing(creep))
                                if (!creep.pos.isNearTo(creep.room.terminal)) {
                                    creep.moveMe(creep.room.terminal);

                                } else {
                                    creep.say('raiders', true);
                                    creep.memory.distance++;
                                    //                          doDeath(creep);

                                }
                    }

                }

            } else {
                if (creep.room.storage !== undefined) {
                    var keyz = Object.keys(creep.room.storage.store);
                    var z = keyz.length;
                    while (z--) {
                        var a = keyz[z];
                        if (a != RESOURCE_ENERGY && creep.room.storage.store[a]) {
                            if (creep.pos.isNearTo(creep.room.storage)) {
                                creep.withdraw(creep.room.storage, a);
                            } else {
                                creep.moveMe(creep.room.storage);
                            }
                        }
                    }

                }
            }

            //            creep.moveTo(creep.room.terminal);


        }


        //creep.moveTo(creep.room.terminal);
    }
}

module.exports = scientistRole;
