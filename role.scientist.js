var classLevels = [
    [CARRY, MOVE],

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE],
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
    ],
    [CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE,
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

var roleParent = require('role.parent');
var labsBuild = require('build.labs');

function labNeedReducing(creep) {
    var theplans = labsBuild.getPlans(creep.room.name);
    if (theplans === undefined) return;
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
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
        if (creep.memory.party === undefined && !creep.room.memory.labsNeedWork) {
            if (creep.room.memory.mineralContainID !== undefined) {
                var zz = Game.getObjectById(creep.room.memory.mineralContainID);
                if (zz !== undefined && zz.total > 1000) {
                    require('role.assistant').run(creep);
                    creep.say('bi');
                    return;
                }
            }
            if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                require('role.first').run(creep);
            } else {
                require('role.nuker').run(creep);
                return;
            }
            return;
        }

        if (super.doTask(creep)) {
            return;
        }

        if (super.spawnRecycle(creep)) {
            return;
        }

        if (!creep.memory.party) {

        } else {
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].room !== undefined &&
                creep.room.name !== Game.flags[creep.memory.party].room.name) {
                creep.suicide();
            }
        }

        creep.say('sci');

        var total = creep.carryTotal;
        if (total === 0) {
            creep.memory.putaway = false;
        } else {
            creep.memory.putaway = true;
        }

        if (creep.memory.putaway && creep.saying !== 'redo') {
            if (!labsBuild.moveToTransfer(creep)) {

                if (creep.room.terminal.total === 300000 || (creep.room.name == 'E33S76')) {
                    super.containers.moveToStorage(creep);
                } else {
                    creep.say('term');
                    super.containers.moveToTerminal(creep);
                }
                return;
            }
            //     super.containers.moveToStorage(creep);

        } else {
            var _labs = labsBuild.getLabs(creep.room.name);
            creep.say(_labs.length);
            if ( !labNeedReducing(creep))
                if (_labs.length > 0) { // If there are labs. 
                    var i = _labs.length;
                    var plan = labsBuild.getPlans(_labs[0].pos.roomName); // get the plans
                    while (i--) { // go through them

                        if (plan[i].id == _labs[i].id && (plan[i].resource !== _labs[i].mineralType) && (_labs[i].mineralAmount > plan[i].emptied ? 500 : 0) && _labs[i].id !== creep.room.memory.boostLabID) {
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
                        let otherThings = false;
                        if (!otherThings) {
                            creep.say('<3', true);
                            creep.room.memory.labsNeedWork = false;
                        }

                    }

                }
        }
    }
}

module.exports = scientistRole;