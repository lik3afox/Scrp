// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

// First to be built, this one stays home and makes sure everything stays running.
// Mostly works with spawn.

var classLevels = [
    [CARRY, MOVE], // 300

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, MOVE], // 550

    [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // 800
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], //1300

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]

];

var roleParent = require('role.parent');

class roleNuker extends roleParent {
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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
return _.clone( classLevels[level].boost);
        }
        return;
    }

    static run(creep) {
        let nuke = creep.room.nuke;
            if(nuke === undefined||nuke === null) return;
        if (creep.carryTotal === 0) {
           if (nuke.energy < nuke.energyCapacity) {

                if (creep.room.terminal.store[RESOURCE_ENERGY] === 0) {
                    if (creep.pos.isNearTo(creep.room.storage)) {
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(creep.room.storage);
                    }

                } else {
                    if (creep.pos.isNearTo(creep.room.terminal)) {
                        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(creep.room.terminal);
                    }
                }
            } else if (nuke.ghodium < nuke.ghodiumCapacity ) { //&& terminal.store[RESOURCE_GHODIUM] !== undefined
                if(creep.room.terminal.store.G === undefined || creep.room.terminal.store.G === 0 ){
                    _terminal_().requestMineral(creep.room.name,'G');
                }
                if (creep.pos.isNearTo(creep.room.terminal)) {
                  creep.withdraw(creep.room.terminal, 'G');
                } else {
                    creep.moveTo(creep.room.terminal);
                }
            }

        } else {
            if (creep.carry.G > 0 && nuke.ghodium == nuke.ghodiumCapacity && nuke.energy == nuke.energyCapacity) {
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    for (var a in creep.carry) {
                        creep.transfer(creep.room.terminal, a);
                    }
                } else {
                    creep.moveTo(creep.room.terminal);
                }

            } else if (creep.carry[RESOURCE_ENERGY] > 0 && nuke.energy == nuke.energyCapacity) {
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    for (var z in creep.carry) {
                        creep.transfer(creep.room.terminal, z);
                    }
                } else {
                    creep.moveTo(creep.room.terminal);
                }

            } else {
                if (creep.pos.isNearTo(nuke)) {
                    for (var e in creep.carry) {
                        creep.transfer(nuke, e);
                    }
                } else {
                    creep.moveTo(nuke);
                }
            }
        }
    }
}

module.exports = roleNuker;