//

var classLevels = [
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

var roleParent = require('role.parent');

function mineralContainerEmpty(creep) {
    //    if (creep.memory.containsGood) return false;
    if (creep.memory.mineralContainerID === undefined && creep.room.memory.mineralID !== undefined) {
        var min = Game.getObjectById(creep.room.memory.mineralID);
        let contains = creep.room.find(FIND_STRUCTURES);
        if (min !== null) {
            contains = _.filter(contains, function(o) {
                return o.structureType == STRUCTURE_CONTAINER && o.pos.inRangeTo(min, 2);
            });
        }
        if (contains.length > 0) {
            creep.memory.mineralContainerID = contains[0].id;
        }
    }

    var a;

    var targetContain = Game.getObjectById(creep.memory.mineralContainerID);

    if (targetContain !== null) {
        var keys = Object.keys(targetContain.store);
        var z = keys.length;
        while (z--) {
            a = keys[z];
            if (targetContain.store[a] > 0) {

                if (creep.pos.isNearTo(targetContain)) {
                    creep.withdraw(targetContain, a);
                } else {
                    creep.moveMe(targetContain, { reusePath: 15 });
                    return true;
                }

            } else {

            }
        }
    }

}

class scientistRole extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if( _.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level]) ) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (creep.carryTotal === 0) {
            creep.memory.putaway = false;
            var targetContain = Game.getObjectById(creep.memory.mineralContainerID);
            var min = Game.getObjectById(creep.room.memory.mineralID);
            if (min !== null && targetContain !== null)
                if (targetContain.total === 0 && min.mineralAmount === 0) {
                    creep.memory.death = true;
                }
        }
        if (creep.carryTotal > 0) {
            creep.memory.putaway = true;
        }

        if (creep.memory.putaway) {
            let tar = creep.room.terminal;
            if (tar !== undefined) {
                if (tar.total === 300000) {
                    tar = creep.room.storage;
                }
                if (creep.pos.isNearTo(tar)) {
                    for (var a in creep.carry) {
                        creep.transfer(tar, a);
                    }
                } else {
                    creep.moveMe(tar);
                }
            }

        } else {
            mineralContainerEmpty(creep);
        }
    }
}

module.exports = scientistRole;