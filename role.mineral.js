//

var classLevels = [
    [WORK, CARRY, WORK, MOVE],
    [WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, MOVE],
    [WORK, WORK, MOVE, WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY]

];

var roleParent = require('role.parent');

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
        if(vr.length > 0) {
            creep.room.memory.extractID = vr[0].id;
            creep.memory.extractID = vr[0].id;
        }
    }
}

class mineralRole extends roleParent {
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
        memoryCheck(creep);
        if (creep.ticksToLive == 1499 && Memory.stats.totalMinerals.LH > 20000) {
            boost.push('UO');
            _.uniq(boost);
        }        
        if (creep.ticksToLive > 1200 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        if (super.spawnRecycle(creep)) {
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
            if (extract !== null) {
                cdNeed = extract.cooldown;
                if (cdNeed === 0) {
                    if (creep.harvest(minz) == OK) {
                        if (creep.memory.mineralContainID === undefined) {
                            let stru = creep.pos.findInRange(FIND_STRUCTURES, 5);
                            stru = _.filter(stru, function(o) {
                                return o.structureType == STRUCTURE_CONTAINER;
                            });
                            if (stru.length !== 0) {
                                creep.memory.mineralContainID = stru[0].id;
                                creep.room.memory.mineralContainID = stru[0].id;
                            } else {
                                creep.memory.mineralContainID = 'none';

    let isBuilt = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3, {
        filter: object => (object.structureType == STRUCTURE_CONTAINER)
    });
    // If you find a construction site
    if (isBuilt.length > 0) {
                                creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
    }
                            }
                        }
                    }
                } else {
                    creep.sing(['I', 'love', 'you']);
                }

            } else {

            }
        } else if (!isNear && carry < creep.carryCapacity - 49) {
            creep.moveMe(minz, { reusePath: 15 });
        } else {
            //let contain;
            //if(creep.memory.mineralContainID != undefined && creep.memory.mineralContainID != 'none') 
            let contain = Game.getObjectById(creep.memory.mineralContainID);
            if (contain === null || contain === undefined) {

                    if (!super.containers.moveToTerminal(creep)) {
                        super.containers.moveToStorage(creep);
                }
            } else {
                let containTotal = _.sum(contain.store);
/*                if (containTotal > contain.storeCapacity - 50) {
                    if (!super._containers.moveToTerminal(creep)) {
                        super._containers.moveToStorage(creep);
                    }

                } else {*/
                    var keys = Object.keys(creep.carry);
                    var z = keys.length;
                    while (z--) {
                        var e = keys[z];
                        if (creep.carry[e] > 0) {
                            if(creep.transfer(contain, e)=== -9 ){
                                creep.moveTo(contain);
                            }

                            return;
                        }
                    }
///                }
            }
        }

    }
}

module.exports = mineralRole;
