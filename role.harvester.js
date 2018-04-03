var classLevels = [
    [WORK, WORK, CARRY, MOVE], // 300
    [WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [WORK, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE], // 800
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE], // 550
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE],
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

        default:
            return false;
    }
}

function clearMemory(creep) {
    // When creep is there - lets clean up some stuff.
    if (creep.memory.position !== undefined) creep.memory.position = undefined;
    if (creep.memory._move !== undefined) creep.memory._move = undefined;
    if (creep.memory.stuckCount !== undefined) creep.memory.stuckCount = undefined;
    if (creep.memory.isThere !== undefined) creep.memory.isThere = undefined;

}

function doMining(creep) {
    let source = Game.getObjectById(creep.memory.sourceID);
    creep.pickUpEnergy();
    if (creep.memory.level >= 4) {
        if (source !== null && creep.carryTotal < (creep.carryCapacity - creep.stats('work')) && creep.harvest(source) == OK) {
            creep.memory.notThere = true;
            clearMemory(creep);
            creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                color: 'yellow',
                align: LEFT,
                font: 0.6,
                strokeWidth: 0.75
            });
            if (creep.memory.linkID !== undefined) {
                creep.say('⛏️');
            }
        }

    } else {
        if (source !== null && creep.carryTotal < (creep.carryCapacity - creep.stats('work')) && creep.harvest(source) == OK) {
            creep.memory.notThere = true;
            clearMemory(creep);
            creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                color: 'yellow',
                align: LEFT,
                font: 0.6,
                strokeWidth: 0.75
            });
            if (creep.memory.linkID !== undefined) {
                creep.say('⛏️');
            }
        }
    }
    //    creep.pickUpEnergy();

}

function moveToWithdraw(creep) {

    let source = Game.getObjectById(creep.memory.sourceID);
    if (source === null) {
        var total;
        if (creep.memory.level >= 4) {
            total = creep.room.find(FIND_SOURCES_ACTIVE);
            if (total.length > 0) {
                creep.memory.sourceID = total[0].id;
            } else {
                total = creep.room.find(FIND_SOURCES);
                if (total.length > 1) {
                    let lowest = _.min(total,a=>a.ticksToRegeneration);
                    if (creep.pos.isNearTo(lowest.pos)) {
                        if (creep.memory.sourceID === undefined) {
                            creep.sleep(3);
                        }
                    } else {
                        creep.moveMe(lowest, {ignoreCreeps:true, maxRooms: 1, maxOpts: 30 });
                    }
                    return;
                }

            }

        } else {
            total = creep.room.find(FIND_SOURCES);
            var z = total.length;
            while (z--) {
                let otherHasIt = false;
                var keys = Object.keys(Game.creeps);
                var l = keys.length;
                while (l--) {
                    var e = keys[l];
                    if (Game.creeps[e].memory.role == creep.memory.role && Game.creeps[e].memory.sourceID == total[z].id) {
                        otherHasIt = true;
                    }
                }
                if (!otherHasIt) {
                    creep.memory.sourceID = total[z].id;
                    break;
                }
            }
            if (creep.memory.sourceID === undefined) {
                let rando = Math.floor(Math.random() * total.length);
                creep.memory.sourceID = total[rando].id;
                source = total[rando];
            }
        }
        // if none has been assigned that means that it's all full so give it an random one!
    }

    if (source !== null && source.energy === 0) {
        if (creep.memory.level >= 4) {
            let link = Game.getObjectById(creep.memory.linkID);
            if (link !== null) {
                creep.transfer(link, RESOURCE_ENERGY);
            }
            creep.memory.sourceID = undefined;
            creep.memory.linkID = undefined;

        } else {
            if (creep.pos.isNearTo(source)) {
                creep.sleep(Game.time + source.ticksToRegeneration - 1);
            } else {
                creep.moveMe(source);
            }
        }
        return;
    }
    let rest = restingSpot(creep); // If this has an assign spot in a room.
    if (rest) {
        if (creep.pos.isEqualTo(rest)) {
            doMining(creep);
        } else {
            creep.moveMe(rest, { reusePath: 10 });
            if (creep.memory.level < 4)
                creep.countDistance();
        }
        return false;
    } else {
        if (creep.pos.isNearTo(source)) {
            doMining(creep);
        } else {
            creep.moveMe(source, { reusePath: 10 });
            if (creep.memory.level < 4)
                creep.countDistance();
        }
        return false;
    }



    return true;
}


function depositContain(creep) {
    var conta;
    if (creep.memory.containerID === undefined) {
        let contain = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        if (contain.length !== 0) {
            creep.memory.containerID = contain[0].id;
            conta = contain[0];
        }
    }
    if (conta === undefined) conta = Game.getObjectById(creep.memory.containerID);

    if (conta !== null) {
        creep.transfer(conta, RESOURCE_ENERGY);
        return true;
    }

    return false;
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

    static run(creep) {
        if (super.baseRun(creep)) {
            return;
        }
        let goal = Game.getObjectById(creep.memory.sourceID);
        if (creep.saying == "⛏️" && creep.memory.sourceID !== undefined && creep.room.memory.masterLinkID !== undefined &&
            goal !== undefined && goal.energy > 0) {
            if (creep.carry.energy <= creep.carryCapacity - creep.stats('mining')) {
                creep.harvest(goal);
                creep.cleanMe();
                creep.say("⛏️", true);
            }
            if (creep.carry.energy >= creep.carryCapacity - creep.stats('mining')) {
                let link = Game.getObjectById(creep.memory.linkID);
                if (link !== null && creep.pos.isNearTo(link)) {
                    creep.transfer(link, RESOURCE_ENERGY);
                    if (link.energy > 650 && link.cooldown === undefined) {
                        link.transferEnergy(creep.room.masterLink);
                    }
                }
            }
            return;
        }
        if(creep.memory.level === 2) {
            creep.harvest(goal);
        }

        if (creep.room.name == 'E32S34') {
            creep.memory.distance = 0;
        }
        super.rebirth(creep);

        if (goal !== null && creep.carry.energy > creep.carryCapacity - (creep.stats('mining')) && creep.pos.isNearTo(goal)) {
            if (!super.link.deposit(creep)) {
                if (!depositContain(creep)) {}
            }
        }

        moveToWithdraw(creep);
    }
}

module.exports = roleHarvester;