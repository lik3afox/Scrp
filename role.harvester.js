var classLevels = [
    [WORK, WORK, CARRY, MOVE], // 300
    [WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE], // 550
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, MOVE], // 550
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
];

var roleParent = require('role.parent');

function restingSpot(creep) {
    switch (creep.memory.sourceID) {
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

function moveToWithdraw(creep) {

    let source = Game.getObjectById(creep.memory.sourceID);
    if (source === null) {
        var total;
        if (creep.memory.level === 4) {
            total = creep.room.find(FIND_ACTIVE_SOURCES);
            if(total.length > 0) {
                creep.memory.sourceID = total[0].id;
            } else {
                creep.sleep(3);
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

        }
        // if none has been assigned that means that it's all full so give it an random one!
        if (creep.memory.sourceID === undefined) {
            let rando = Math.floor(Math.random() * total.length);
            creep.memory.sourceID = total[rando].id;
            source = total[rando];
        }
    }

    if (source !== null && source.energy === 0) {
        creep.sleep(3);
        return;
    }
    let rest = restingSpot(creep); // If this has an assign spot in a room.
    if (rest) {
        if (creep.pos.isEqualTo(rest)) {
            if (creep.harvest(source) == OK) {
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
            creep.moveMe(rest, { reusePath: 10 });
            creep.countDistance();
        }
        return false;
    } else {
        if (creep.pos.isNearTo(source)) {
            if (creep.harvest(source) == OK) {
                creep.memory.notThere = true;
                clearMemory(creep);
                creep.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                    color: 'white',
                    align: LEFT,
                    font: 0.6,
                    strokeWidth: 0.75
                });
                if (creep.memory.linkID !== undefined) {
                    creep.say('⛏️');
                }
            }
        } else {
            creep.moveMe(source, { reusePath: 10 });
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
        return classLevels[level];
    }

    static run(creep) {
        if (super.baseRun(creep)) return;
        if (creep.saying == "⛏️" && creep.memory.sourceID !== undefined && creep.room.memory.masterLinkID !== undefined) {
            let goal = Game.getObjectById(creep.memory.sourceID);
            if (goal.energy > 0) {
                creep.harvest(goal);
                if (creep.carry.energy > creep.carryCapacity - creep.stats('mining')) {
                    let link = Game.getObjectById(creep.memory.linkID);
                    creep.transfer(link, RESOURCE_ENERGY);
                    if (link.energy > 750 && link.cooldown === undefined) {
                        let master = Game.getObjectById(creep.room.memory.masterLinkID);
                        link.transferEnergy(master);
                    }
                } else {
                    creep.pickUpEnergy();
                    creep.say("⛏️", true);
                }
            } else {
                if (creep.pos.isNearTo(goal))
                    creep.sleep(3);
            }
            return;
        }


        super.rebirth(creep);
        if (creep.memory.sourceID == '5982ff7ab097071b4adc2b7d') {
            creep.memory.reportDeath = true;
        }

        if (creep.carry.energy > creep.carryCapacity - creep.stats('mining')) {
            if (!super.link.deposit(creep)) {
                if (!depositContain(creep)) {}
            }
        }

        moveToWithdraw(creep);
        creep.pickUpEnergy();
    }
}

module.exports = roleHarvester;