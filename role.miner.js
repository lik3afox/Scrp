var classLevels = [
    [MOVE, CARRY, WORK, WORK], //  300
    [MOVE, WORK, WORK, WORK, MOVE, CARRY], //  450
    [MOVE, MOVE, WORK, WORK, WORK, WORK, MOVE, CARRY, WORK], // 550
    [WORK, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, CARRY], // 800
    [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY], // 1300 
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY, CARRY, CARRY]

];

var roleParent = require('role.parent');
var boost = ['UO'];

function buildContainer(creep) {
    // this is called because it doesn't find a container.

    let isBuilt = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3, {
        filter: object => (object.structureType == STRUCTURE_CONTAINER)
    });
    // If you find a construction site
    if (isBuilt.length > 0) {
        creep.build(isBuilt[0]);
    } else {
        creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
    }

}

function getBads(creep) {
    var bads = creep.pos.findInRange(creep.room.hostilesHere, 3);
    bads = _.filter(bads, function(object) {
        return (object.owner.username != 'zolox' && object.owner.username != 'admon');
    });
    return bads;
}

function doWork(creep) {
    //    if(!super.guardRoom(creep)) false;
    if (creep.memory.keeperLairID !== undefined && creep.memory.keeperLairID != 'none') { // THis is obtained when 
        let keeper = Game.getObjectById(creep.memory.keeperLairID);

        if (keeper !== null)
            if (keeper.ticksToSpawn === undefined || keeper.ticksToSpawn < 20)
                return false;
    }

    let contain = Game.getObjectById(creep.memory.workContainer);
    if (contain === null) return;
    if ((contain.hits < contain.hitsMax - 25000) || (contain.hits < 50000)) {
        if (!creep.pos.isNearTo(contain)) {}

        let rep = creep.repair(contain);
        if (rep == ERR_NOT_IN_RANGE) {
            creep.say('m2w');
            //            creep.moveTo(contain);
        } else if (rep == OK) {
            return true;
        }
    } else {
        if (creep.pos.isNearTo(contain)) {
            if (contain.store != contain.storeCapacity) {
                //            creep.say('t');
                for (var e in creep.carry) {
                    creep.transfer(contain, e);
                }
            }
        } else {
            //          creep.say('m');
            switch (creep.memory.goal) {
                case '5836b8268b8b9619519f18b1':
                    creep.moveTo(33, 34);
                    break;
                case '5982ff05b097071b4adc1f6a':
                    creep.moveTo(38, 5);
                    break;

                default:
                    creep.moveTo(contain);
                    break;
            }

        }
        // Deposit
    }

}



class settler extends roleParent {
    static levels(level, room) { //spawn.memory.roadsTo[ie] 18652311
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (super.movement.runAway(creep)) return;
        if (super.baseRun(creep)) return;

        if (creep.memory.needBoost !== undefined && creep.memory.needBoost.length > 0) {
            if (super.boosted(creep, creep.memory.needBoost)) {
                return;
            }
        }

        //        shouldDie(creep);

        super.movement.checkForBadsPlaceFlag(creep);
        if (creep.memory.isThere === undefined) { creep.memory.isThere = false; }
        if (creep.memory.level >= 2) super.rebirth(creep);
        if (super.keeperWatch(creep)) {
            return;
        }
        var _source = Game.getObjectById(creep.memory.goal);
        if (creep.memory.goal == '5982ff7ab097071b4adc2b7d') {
            creep.memory.reportDeath = false;
        }

        if (_source !== null && (_source.pos.roomName != creep.room.name)) creep.countDistance();

        if (creep.pos.isNearTo(_source)) {
            super.constr.pickUpEnergy(creep);
            if (creep.carryTotal >= creep.carryCapacity - 15 && _source.energy !== 0) {
                if (creep.memory.workContainer === undefined) {
                    let range = 2;
                    if (creep.room.name == 'E24S38') range = 2;

                    let isContainer = _source.pos.findInRange(FIND_STRUCTURES, range, {
                        filter: object => (object.structureType == STRUCTURE_CONTAINER)
                    });
                    // Checks for container 
                    if (isContainer.length === 0) {
                        buildContainer(creep);
                    } else {
                        creep.memory.workContainer = isContainer[0].id;
                        doWork(creep);
                        return;

                    }
                } else {
                    if (doWork(creep))
                        return;
                }
            }

            let contain = Game.getObjectById(creep.memory.workContainer);
            if (contain === null || (contain !== null && _source.energy !== 0 && contain.total < contain.storeCapacity)) {

                if (creep.harvest(_source) == OK) {
                    if (_source.energyCapacity == 4000 && creep.memory.keeperLairID === undefined) {
                        super.keeperFind(creep);
                    }
                    creep.memory.isThere = true;
                    creep.room.visual.text(_source.energy + "/" + _source.ticksToRegeneration, _source.pos.x + 1, _source.pos.y, {
                        color: 'white',
                        align: RIGHT,
                        font: 0.6,
                        strokeWidth: 0.75
                    });
                }

            } else if (contain !== null && contain.total === contain.storeCapacity && contain.hits < contain.hitsMax) {
                if (creep.carry[RESOURCE_ENERGY] < 20) {
                    creep.harvest(_source);
                } else {
                    creep.repair(contain);
                }
                creep.say('rp');
            } else if (_source.energy !== 0 && contain === undefined) {
                if (creep.harvest(_source) == OK) {
                    if (_source.energyCapacity == 4000 && creep.memory.keeperLairID === undefined) {
                        super.keeperFind(creep);
                    }
                    creep.memory.isThere = true;
                }

            } else if (_source.energy === undefined || _source.energy === 0) {

                if (contain.hits < contain.hitsMax) {
                    creep.repair(contain);
                    if (creep.carry[RESOURCE_ENERGY] < 20 && contain.store[RESOURCE_ENERGY] > 20) {
                        creep.withdraw(contain, RESOURCE_ENERGY);
                    }
                } else {
                    creep.sleep(3);
                }
            } else {
                creep.sleep(3);
            }

        } else {

            if (!creep.memory.isThere && _source !== null && _source.pos.roomName != creep.room.name) creep.countDistance();

                var goingTo = super.movement.getRoomPos(creep.memory.goal);
                    if (_source !== null) {
                        let task = {};
                        task.options = {
                            reusePath: 49,
                            ignoreRoads: false,
                            visualizePathStyle: {
                                fill: 'transparent',
                                stroke: '#ff0',
                                lineStyle: 'dotted',
                                strokeWidth: 0.15,
                                opacity: 0.5
                            }
                        };
                        task.pos = _source.pos;
                        task.count = true;
                        task.order = "moveTo";
                        task.enemyWatch = true;
                        task.rangeHappy = 1;
                        creep.memory.task.push(task);
                    }
        }

    }
}
module.exports = settler;