//

var classLevels = [
    [WORK, CARRY, WORK, MOVE],
    [WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, MOVE],
    [WORK, WORK, MOVE, WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY] // 50/3750

];

var roleParent = require('role.parent');
var labsBuild = require('build.labs');

function memoryCheck(creep) {
    if (creep.memory.mineralID === undefined) {
        let vr = creep.room.find(FIND_MINERALS);
        creep.room.memory.mineralID = vr[0].id;
        creep.memory.mineralID = vr[0].id;
    }

    if (creep.memory.extractID === undefined) {
        let vr = creep.room.find(FIND_STRUCTURES, {
            filter: s => s.structureType == STRUCTURE_EXTRACTOR
        });
        creep.room.memory.extractID = vr[0].id;
        creep.memory.extractID = vr[0].id;
    }
}

class mineralRole extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        memoryCheck(creep);

        if (super.returnEnergy(creep)) {
            return;
        }
        let minz = Game.getObjectById(creep.memory.mineralID);
        if (minz === null) return;
        let carry = _.sum(creep.carry);

        let cdNeed;
        let isNear = creep.pos.isNearTo(minz);

        if (minz.mineralAmount === 0 && carry === 0) {
            creep.memory.death = true;
        }

        if (isNear && carry < creep.carryCapacity - 49 && minz.mineralAmount !== 0) {
            let extract = Game.getObjectById(creep.memory.extractID);
            if (!extract) {
                cdNeed = extract.cooldown;
                if (cdNeed === 0)
                    if (creep.harvest(minz) == OK) {
                        if (creep.memory.mineralContainID === undefined) {
                            let stru = creep.pos.findInRange(FIND_STRUCTURES, 5);
                            stru = _.filter(stru, function(o) {
                                return o.structureType == STRUCTURE_CONTAINER;
                            });
                            if (stru.length !== 0) {
                                creep.memory.mineralContainID = stru[0].id;
                            } else {
                                creep.memory.mineralContainID = 'none';
                            }
                        }
                    }

            }
        } else if (!isNear && carry < creep.carryCapacity - 49) {
            creep.moveMe(minz, { reusePath: 15 });
        } else {
            //let contain;
            //if(creep.memory.mineralContainID != undefined && creep.memory.mineralContainID != 'none') 
            let contain = Game.getObjectById(creep.memory.mineralContainID);
            if (contain === null || contain === undefined) {
                if (creep.room.name == 'E33S76') {
                    super._containers.moveToStorage(creep);
                } else {
                    if (!super._containers.moveToTerminal(creep)) {
                        super._containers.moveToStorage(creep);
                    }
                }
            } else {
                let containTotal = _.sum(contain.store);
                if (containTotal > contain.storeCapacity - 50) {
                    if (!super._containers.moveToTerminal(creep)) {
                        super._containers.moveToStorage(creep);
                    }

                } else {
                    for (var e in creep.carry) {
                        if (creep.carry[e] > 0) {
                            creep.say(creep.transfer(contain, e));
                            return;
                        }
                    }
                }
            }
        }

    }
}

module.exports = mineralRole;
