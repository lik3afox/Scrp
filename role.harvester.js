var classLevels = [
    [WORK, WORK, CARRY, MOVE], // 300
    [WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [WORK, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE], // 800
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE], // 550
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    [CARRY, CARRY, CARRY, CARRY,CARRY, MOVE, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // 21 Work parts.
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE],
    [],
    [],
    [],
    {
        body: [MOVE, CARRY, WORK, CARRY, CARRY],
        boost: ['XUHO2'],
    }
];

var roleParent = require('role.parent');

function restingSpot(creep) {
    switch (creep.memory.sourceID) {
        case '5982ffd3b097071b4adc3402':
            return new RoomPosition(42, 32, creep.memory.home);
        case '5982ffd3b097071b4adc3403':
            return new RoomPosition(44, 33, creep.memory.home);
        case '5982ff42b097071b4adc2524':
            return new RoomPosition(18, 19, creep.memory.home);
        case '59f1a45c82100e1594f3cd70':
            return new RoomPosition(38, 34, creep.memory.home);
        case '5982ff96b097071b4adc2eab':
            return new RoomPosition(19, 31, creep.memory.home);
        case '5982ff21b097071b4adc2224':
            return new RoomPosition(33, 29, creep.memory.home);
        case '5982feecb097071b4adc1c07':
            return new RoomPosition(4, 5, creep.memory.home);
        case '5982feebb097071b4adc1bd6':
            return new RoomPosition(18, 36, creep.memory.home);
        case '5982ff79b097071b4adc2b63':
            return new RoomPosition(17, 38, creep.memory.home);
        case '5836b8308b8b9619519f19f4':
            return new RoomPosition(21, 19, creep.memory.home);
        case '5982ff7ab097071b4adc2b7e':
            return new RoomPosition(33, 23, creep.memory.home);
        case '5982ff21b097071b4adc2224':
            return new RoomPosition(33, 29, creep.memory.home);
        case '59bbc5c12052a716c3ce9faf':
            return new RoomPosition(42, 37, creep.memory.home);
        case '59bbc5c12052a716c3ce9fb0':
            return new RoomPosition(43, 39, creep.memory.home);
        case '5836b8308b8b9619519f19f5':
            return new RoomPosition(38, 19, creep.memory.home);
        case '5982ff5eb097071b4adc27b9':
            return new RoomPosition(20, 10, creep.memory.home);

        default:
            return false;
    }
}

function doMining(creep, source) {
    let link = Game.getObjectById(creep.memory.linkID);
    if (link) {
        if (source && link.energy !== 800 && creep.harvest(source) == OK) {
            trackMining(creep);
            creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                color: 'yellow',
                align: LEFT,
                font: 0.6,
                strokeWidth: 0.75
            });
            if (creep.memory.linkID !== undefined && creep.pos.isNearTo(link)) {
                creep.say('⛏️');
            } else {
                creep.moveMe(link);
            }
        }
    } else {
        if (source && creep.harvest(source) == OK) {
            trackMining(creep);
            creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                color: 'yellow',
                align: LEFT,
                font: 0.6,
                strokeWidth: 0.75
            });
            if (link && creep.pos.isNearTo(link)) {
                creep.say('⛏️');
            } else if (link) {
                creep.moveMe(link);
            }
        }
    }

}

function moveToWithdraw2(creep) {
    let source = Game.getObjectById(creep.memory.sourceID);
    if (source === null) {
        var sources = creep.room.find(FIND_SOURCES);
        var crps = creep.room.find(FIND_MY_CREEPS);
        if (sources.length > 0) {
            for (var e in sources) {
                var matchedCrps = _.filter(crps, function(o) {
                    return o.memory.sourceID === sources[e].id;
                });
                if (matchedCrps.length === 0) {
                    creep.memory.sourceID = sources[e].id;
                    source = sources[e];
                    break;
                }
            }
        }
    }

    if (source !== null && source.energy === 0 && creep.pos.isNearTo(source)) {
        let slep = source.ticksToRegeneration - 1;
        if (slep > creep.ticksToLive) {
            slep = creep.ticksToLive - 2;
        }
        if(creep.room.powerLevels && creep.room.powerLevels[PWR_REGEN_SOURCE]){
            creep.sleep(3);
        } else {
            if (slep > 2) {
                creep.sleep(slep + Game.time);
            }
        }
        return;
    }

    let rest = restingSpot(creep); // If this has an assign spot in a room.
    if (rest) {
        if (creep.pos.isEqualTo(rest)) {
            doMining(creep, source);
        } else {
            creep.moveMe(rest, { reusePath: 10 });
            creep.say('resting');
            if (creep.memory.level < 4)
                creep.countDistance();
        }
        return false;
    } else if (source) {
        if (creep.pos.isNearTo(source)) {
            doMining(creep, source);
        } else {
            creep.moveMe(source, { reusePath: 30 });
            creep.say('!resting');
            if (creep.memory.level < 4)
                creep.countDistance();
        }

        return false;
    }



    return true;
}

class roleHarvester extends roleParent {

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
        if (super.spawnRecycle(creep)) {
            if (creep.body.length === 5 && !creep.memory.reportDeath) {
                let spawnsDo = require('commands.toCreep');
                spawnsDo.reportDeath(creep);
                creep.memory.reportDeath = true;
            }
            if(!creep.memory.reportDeath && creep.room.powerLevels && creep.room.powerLevels[PWR_REGEN_SOURCE] ){
                let spawnsDo = require('commands.toCreep');
                spawnsDo.reportDeath(creep);
                creep.memory.reportDeath = true;
            }
            return true;
        }
        if (super.boosted(creep)) {
            return;
        }
        if (creep.body.length === 5 && creep.body[2].boost === undefined && creep.memory.boostNeeded && creep.memory.boostNeeded.length === 0 && creep.memory.isBoosted && creep.memory.isBoosted.length === 1) {
            creep.memory.boostNeeded = ['XUHO2'];
            console.log('harvester w/o boost', roomLink(creep.room.name));
        }
        let goal = Game.getObjectById(creep.memory.sourceID);
        if (!creep.room.controller.isPowerEnabled && creep.ticksToLive < 300 && goal && goal.energy === 0 && !creep.memory.reportDeath && creep.memory.isBoosted && creep.memory.isBoosted.length > 0) {
            let spawnsDo = require('commands.toCreep');
            spawnsDo.reportDeath(creep);
            creep.memory.death = true;
            creep.memory.reportDeath = true;
            super.link.deposit(creep);
            return;

        } else {
            super.rebirth(creep);
        }
        if (creep.saying == "⛏️" && goal && goal.energy > 0 && creep.memory.linkID) {
            let link = Game.getObjectById(creep.memory.linkID);
            if (link && !creep.pos.isNearTo(link)) {
                console.log(roomLink(creep.room.name), 'not near link');
                return;
            }
            if (link.energy < 800) {
                if (creep.harvest(goal) === OK) {
                    trackMining(creep);
                }
                creep.cleanMe();
                if (creep.carry.energy >= creep.carryCapacity - creep.stats('mining')) {
                    if (link && creep.pos.isNearTo(link)) {
                        creep.transfer(link, RESOURCE_ENERGY);
                    }
                }

                if (creep.carryTotal < creep.carryCapacity && link && link.energy < 800) creep.say("⛏️", true);
            }
            return;
        }

        if (goal !== null && creep.carry.energy > creep.carryCapacity - (creep.stats('mining')) && creep.pos.isNearTo(goal)) {
            super.link.deposit(creep);
        }
        moveToWithdraw2(creep);
        if (creep.memory.stuckCount > 3 && goal && creep.pos.inRangeTo(goal, 2)) {
            var crps = creep.room.find(FIND_MY_CREEPS);
            let rsult = _.filter(crps, function(o) {
                return o.memory.sourceID === creep.memory.sourceID && o.ticksToLive < 100;
            });
            if (rsult.length > 0) {
                rsult[0].memory.death = true;
                rsult[0].memory.sleep = undefined;
            }
            rsult = _.filter(crps, function(o) {
                return o.memory.sourceID === creep.memory.sourceID && o.ticksToLive > 100;
            });
            if (rsult.length > 0) {
                creep.memory.sourceID = undefined;
            }

        }

    }
}

module.exports = roleHarvester;