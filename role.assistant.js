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
var labsBuild = require('build.labs');

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
/*
                if (creep.room.storage !== undefined) {
                    var keyz = Object.keys(creep.room.storage.store);
                    var x = keyz.length;
                    while (x--) {
                        var b = keyz[x];
                        if (b != RESOURCE_ENERGY && creep.room.storage.store[b]) {
                            if (creep.pos.isNearTo(creep.room.storage)) {
                                creep.withdraw(creep.room.storage, b);
                            } else {
                                creep.moveMe(creep.room.storage);
                            }
                        }

                    }

                } */

            }
        }
    }

}

class scientistRole extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1)
            level = classLevels.length - 1;

        return classLevels[level];
    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }

        if (super.returnEnergy(creep)) {
            return;
        }
        if (creep.carryTotal === 0) {
            creep.memory.putaway = false;
            var targetContain = Game.getObjectById(creep.memory.mineralContainerID);
            var min = Game.getObjectById(creep.room.memory.mineralID);
            if(min !== null && targetContain !== null)
            if(targetContain.total === 0 && min.mineralAmount === 0){
                creep.memory.death = true;
            }
        }
        if (creep.carryTotal > 0) {
            creep.memory.putaway = true;
        }

        if (creep.memory.putaway) {
            if (creep.pos.isNearTo(creep.room.terminal)) {
                for (var a in creep.carry) {
                    creep.transfer(creep.room.terminal, a);
                }
            } else {
                creep.moveMe(creep.room.terminal);
            }

        } else {
            mineralContainerEmpty(creep);
        }
    }
}

module.exports = scientistRole;
