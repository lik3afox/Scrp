
var classLevels = [
    [WORK, CARRY, WORK, MOVE],
    [WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, MOVE],
    [WORK, WORK, MOVE, WORK, CARRY, WORK, WORK, MOVE, CARRY, MOVE, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    // lv 5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY],
    // Lv 8
    [WORK, WORK, WORK, WORK, WORK,
        WORK, WORK, WORK, WORK, WORK,
        WORK, WORK, WORK, WORK, WORK,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, MOVE,
        WORK, WORK, WORK, WORK, MOVE,
        WORK, WORK, WORK, WORK, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
    ],
    // Lv 9
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, MOVE,
            WORK, WORK, WORK, WORK, MOVE,
            WORK, WORK, WORK, WORK, MOVE,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        ],
        boost: ['UO'], //, 'KH'

    },
    // Lv 10 - designed to take down 100,000 minerals in 1400 ticks.
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK,

            WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK,

            WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK,

            WORK, MOVE, MOVE, WORK, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,

            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,


        ],
        boost: ['XUHO2', 'XKH2O', 'XZHO2'],

    }

];

var roleParent = require('role.parent');


class mineralRole extends roleParent {
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

    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    static run(creep) {

        if (creep.room.mineral && creep.room.mineral.mineralAmount === 0) {
                    creep.memory.death = true;
        }
        if(creep.memory.death && creep.carryTotal > 0){
                let targetContain = Game.getObjectById(creep.room.memory.mineralContainID);
                if (targetContain && creep.pos.isNearTo(targetContain)) {
                    creep.transfer(targetContain,creep.carrying);
                }

        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if(creep.ticksToLive > 1495) creep.room.memory.mineralName = creep.name;
        if (creep.ticksToLive > 1200 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (creep.room.terminal && (!creep.room.terminal.store.UO ||creep.room.terminal.store.UO < 500)) creep.memory.boostNeeded = [];
        if (Game.shard.name === 'shard3' && creep.memory.boostNeeded === undefined && creep.ticksToLive > 1490 && creep.room.terminal.store.XUHO2 > 1000) creep.memory.boostNeeded = ['XUHO2'];
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (creep.ticksToLive < 175 && creep.memory.isBoosted && creep.memory.isBoosted.length > 0 && creep.carryTotal === 0) {
            creep.memory.death = true;
            return;
        }

        let minz = creep.room.mineral;
        let extract = creep.room.extractor; 
        if (minz === null || !extract) return;
        let carry = creep.carryTotal;
        let cdNeed = extract.cooldown;
        let isNear = creep.pos.isNearTo(minz);
        if (creep.memory.stats !== undefined) {
            if (creep.memory.level === 8) {
                // Do nothing
                creep.memory.stats.work = 32;
            } else if (creep.memory.level === 9) {
                // Do nothing
                creep.memory.stats.work = 96;
            } else if (creep.memory.level === 10) {
                // Do nothing
                creep.memory.stats.work = 217;
            }
        }
        if (isNear && ((carry < creep.carryCapacity - creep.stats('work') && minz.mineralAmount !== 0) || creep.room.memory.mineralContainID)) {
            if (creep.room.memory.mineralContainID) {
                var targetContain = Game.getObjectById(creep.room.memory.mineralContainID);
                if (targetContain === null) {
                    creep.room.memory.mineralContainID = undefined;
                    return;
                }
                if (targetContain && !creep.pos.isEqualTo(targetContain)) creep.moveTo(targetContain);
                if (creep.carryCapacity === creep.carryTotal && targetContain.total > 1900) return false;
            }
            if (cdNeed === 0) {
            let rsut = creep.harvest(minz);
                if (rsut == OK) {

                    if (creep.room.memory.mineralContainID === undefined && creep.memory.didCheck === undefined) {
                        let stru = creep.pos.findInRange(FIND_STRUCTURES, 5);
                        stru = _.filter(stru, function(o) {
                            return o.structureType == STRUCTURE_CONTAINER;
                        });
                        if (stru.length !== 0) {
                            creep.room.memory.mineralContainID = stru[0].id;
                            creep.memory.didCheck = true;
                        } else {
                            creep.memory.didCheck = true;
                        }
                    }
                    creep.sleep(Game.time + EXTRACTOR_COOLDOWN);
                } else {
//                    console.log('error in mineral harvesting',rsut,minz,roomLink(creep.room.name),isNear);
                }
            } else {}

        } else if (!isNear && carry < creep.carryCapacity - creep.stats('work')) {
            creep.moveMe(minz, { reusePath: 15 });
        } else if (creep.memory.level === 8) {
            creep.sleep(4);
        } else if (creep.memory.level === 9) {
            creep.sleep(4);
        } else if (creep.memory.level === 10) {
            creep.sleep(3);
        } /*else if (creep.memory.assistID !== undefined && carry >= creep.carryCapacity - creep.stats('work')) {
            let assist = Game.getObjectById(creep.memory.assistID);
            if (assist) {
                assist.memory.sleep = undefined;
                creep.transfer(assist, creep.carrying);
            }
        }*/ else {
            let contain = Game.getObjectById(creep.memory.mineralContainID);
            if (contain === null || contain === undefined) {
                if (!super.containers.moveToTerminal(creep)) {
                    super.containers.moveToStorage(creep);
                }
            } else {
                if (creep.transfer(contain, creep.carrying) === -9) {
                    creep.moveTo(contain);
                }
            }

        }

    }
}

module.exports = mineralRole;