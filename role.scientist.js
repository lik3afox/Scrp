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
var constr = require('commands.toStructure');

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
                if (creep.room.name == 'E27S45') {
                    if (creep.room.nuke.ghodium !== creep.room.nuke.ghodiumCapacity && creep.room.nuke.energy !== creep.room.nuke.energyCapacity) {
                        require('role.nuker').run(creep);
                        return;
                    }
                }
            }
//                console.log('xexx',creep.room.energyAvailable, creep.room.energyCapacityAvailable) ;
            return;
        }

        if (super.doTask(creep)) {
            return;
        }

        if (super.spawnRecycle(creep)) {
            return;
        }

        if (!creep.memory.party) {} else {
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].room !== undefined &&
                creep.room.name !== Game.flags[creep.memory.party].room.name) {
                creep.suicide();
            }
        }

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
                    super.containers.moveToStorage(creep);
                } else {
                    super.containers.moveToTerminal(creep);
                }
            }
        } else {

            var _labs = labsBuild.getLabs(creep.room.name);

            if (!labNeedReducing(creep))
                if (_labs.length > 0) { // If there are labs. 
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
                        let otherThings = false;
                        var keys = Object.keys(creep.room.storage.store);
                        var n = keys.length;
                        while (n--) {
                            var e = keys[n];
                            var stored = [RESOURCE_ENERGY, 'XGHO2', 'XLHO2', 'XUH2O', 'XZHO2', 'XZH2O', 'XKHO2'];
                            if (!_.contains(stored, e) && creep.room.storage.store[e]) {
                                otherThings = true;
                                if (creep.pos.isNearTo(creep.room.storage)) {
                                    creep.withdraw(creep.room.storage, e);
                                } else {
                                    creep.moveMe(creep.room.storage);
                                }
                            }
                        }

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