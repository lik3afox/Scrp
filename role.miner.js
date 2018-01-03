var classLevels = [
    [MOVE, CARRY, WORK, WORK], //  300
    [MOVE, WORK, WORK, WORK, MOVE, CARRY], //  450
    [MOVE, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, CARRY, WORK], // 550(700)
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
    var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
    bads = _.filter(bads, function(object) {
        return (object.owner.username != 'zolox' && object.owner.username != 'admon');
    });
    return bads;
}

function restingSpot(creep) {
    switch (creep.memory.goal) {
        case '5982ff2eb097071b4adc236d':
            return new RoomPosition(3, 16, creep.room.name);
        case '5982ff95b097071b4adc2ea4':
            return new RoomPosition(13, 19, creep.room.name);
        case '5982ff21b097071b4adc2221':
            return new RoomPosition(36, 34, creep.room.name);

        case '5982feecb097071b4adc1bf5':
            return new RoomPosition(37, 6, creep.room.name);
        case '5836b8308b8b9619519f19f1':
            return new RoomPosition(40, 40, creep.room.name);
        case '5982ff07b097071b4adc1fa7':
            return new RoomPosition(16, 44, creep.room.name);
        case '5982ff14b097071b4adc20f9':
            return new RoomPosition(23, 30, creep.room.name);

        case '5982ff2eb097071b4adc236f':
            return new RoomPosition(6, 28, creep.room.name);
        case '5982ff6bb097071b4adc2990':
            return new RoomPosition(9, 43, creep.room.name);
        case '5982ff20b097071b4adc2212':
            return new RoomPosition(39, 42, creep.room.name);
        case '5836b8268b8b9619519f18b1':
            return new RoomPosition(33, 34, creep.room.name);
        case '5982ff05b097071b4adc1f6a':
            return new RoomPosition(38, 5, creep.room.name);
        case '5982feeab097071b4adc1bc5':
            return new RoomPosition(43, 10, creep.room.name);
        case '5982fed0b097071b4adc18aa':
            return new RoomPosition(19, 33, creep.room.name);
        case '5982ff6bb097071b4adc298b':
            return new RoomPosition(17, 6, creep.room.name);
        case '5982ff86b097071b4adc2d27':
            return new RoomPosition(32, 40, creep.room.name);
        case '5982ff07b097071b4adc1fa2':
            return new RoomPosition(33, 9, creep.room.name);
        case '5982ff78b097071b4adc2b4c':
            return new RoomPosition(10, 13, creep.room.name);
        case '5982ff21b097071b4adc2227':
            return new RoomPosition(18, 6, creep.room.name);
        case '5982feeab097071b4adc1bce':
            return new RoomPosition(34, 17, creep.room.name);
        case '5982ff50b097071b4adc2676':
            return new RoomPosition(24, 20, creep.room.name);
        case '5982ff5eb097071b4adc27d0':
            return new RoomPosition(28, 23, creep.room.name);
        default:
            return false;
    }
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
            //creep.moveTo(contain);
        }
        // Deposit
    }

}

function markDeath(sourceID) {
    var target = _.filter(Game.creeps, function(o) {
        if (o.memory.goal == sourceID) {
            o.memory.reportDeath = true;
        }
    });

}

class settler extends roleParent {
    static levels(level, room) { //spawn.memory.roadsTo[ie] 18652311
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.shouldDie(creep);
        if (super.movement.runAway(creep)) return;
        if (super.baseRun(creep)) return;
        /*        if (creep.memory.needBoost !== undefined && creep.memory.needBoost.length > 0) {
                    if (super.boosted(creep, creep.memory.needBoost)) {
                        return;
                    }
                } */
        if (creep.room.name == 'E21S49') {
            let zz = Game.getObjectById('599b449d1fbcb148de2f75ab');
            if (zz !== null) {
                if (creep.pos.isNearTo(zz)) {
                    creep.dismantle(zz);
                } else {
                    creep.moveTo(zz);
                }
                return;
            }

        }

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

        var resting = restingSpot(creep);
        // if(!resting ?creep.pos.isNearTo(_source):creep.pos.isEqualTo(resting)){
        //  console.log('test good', resting);
        //            if(!resting ?creep.pos.isNearTo(_source):creep.pos.isEqualTo(resting))
        //          }
        //}
        let contain = Game.getObjectById(creep.memory.workContainer);

        //if (creep.pos.isNearTo(_source)) {
        if (!resting ? creep.pos.isNearTo(_source) : creep.pos.isEqualTo(resting)) {

            if (creep.room.memory.mineInfo === undefined) {
                creep.room.memory.mineInfo = {};
            }

            if (creep.room.memory.mineInfo[creep.memory.goal] === undefined) {
                creep.room.memory.mineInfo[creep.memory.goal] = 0;
            }

            //    if(creep.room.memory.mineInfo[creep.memory.goal] !== undefined) creep.room.memory.mineInfo[creep.memory.goal] +=10;
            // If container is full, then slowly add more to this. 
            // If transport is near and waiting then remove.
            if (contain !== null && contain.total === 2000) {
                creep.room.memory.mineInfo[creep.memory.goal] += 15;
            }



            var string = creep.room.memory.mineInfo[creep.memory.goal];

            var spn = Game.getObjectById(creep.memory.parent);
            if (spn !== null) {
                for (var e in spn.memory.roadsTo) {
                    let zz = spn.memory.roadsTo[e];
                    if (zz.source === creep.memory.goal) {
                        var roomDo = ['E17S45', 'E18S46', 'E18S36', 'E22S48'];
                        if (_.contains(roomDo, creep.memory.home)) {
                                if(_source.energyCapacity === 4000 ) {
                                    if (zz.expLevel < 3) zz.expLevel = 3;
                                }
    //                            if (zz.expLevel < 2) zz.expLevel = 2;
                            if (creep.room.memory.mineInfo[creep.memory.goal] < -7500) {
                                zz.expLevel--;
                                if (zz.expLevel < 2) zz.expLevel = 2;
                                creep.room.memory.mineInfo[creep.memory.goal] = 0;
                                markDeath(creep.memory.goal);
                            }
                            if (creep.room.memory.mineInfo[creep.memory.goal] > 7500) {
                                zz.expLevel++;
                                if (zz.expLevel > 8) zz.expLevel = 8;
                                creep.room.memory.mineInfo[creep.memory.goal] = 0;
                                markDeath(creep.memory.goal);
                            }
                        }
                        string = string + "[" + zz.expLevel + "]";
                    }
                }

            }


            if (creep.room.memory.mineInfo[creep.memory.goal] > 100000) creep.room.memory.mineInfo[creep.memory.goal] = 100000;
            if (creep.room.memory.mineInfo[creep.memory.goal] < -100000) creep.room.memory.mineInfo[creep.memory.goal] = -100000;
            //}

            creep.room.visual.text(string, creep.pos, {
                color: '#10c3ba ',
                stroke: '#000000 ',
                strokeWidth: 0.123,
                font: 0.5
            });


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

            if (contain === null || (contain !== null && _source.energy !== 0 && contain.total < contain.storeCapacity)) {

                if (creep.harvest(_source) == OK) {
                    if (_source.energyCapacity == 4000 && creep.memory.keeperLairID === undefined) {
                        super.keeperFind(creep);
                    }
                    if (creep.room.memory.mineInfo[creep.memory.goal] < 0) {
                        creep.room.memory.mineInfo[creep.memory.goal] += 3;
                    } else {
                        creep.room.memory.mineInfo[creep.memory.goal] -= 1;
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
                    if (creep.room.memory.mineInfo[creep.memory.goal] < 0) {
                        creep.room.memory.mineInfo[creep.memory.goal] += 2;
                    } else {
                        creep.room.memory.mineInfo[creep.memory.goal] -= 2;
                    }
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
            if (creep.room.name == super.movement.getRoomPos(creep.memory.goal).roomName) {
                var bad = getBads(creep);
                creep.say(bad.length);
                if (bad.length === 0) {
                    creep.moveTo(!resting ? _source : resting);
                }

            } else {
                let task = {};
                task.options = {
                    reusePath: 49,
                    ignoreCreep: true,
                    segment: true,
                    ignoreRoads: false,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                };
                task.pos = _source !== null ? _source.pos : super.movement.getRoomPos(creep.memory.goal);
                task.count = true;
                task.order = "moveTo";
                task.enemyWatch = true;
                task.rangeHappy = 1;
                creep.memory.task.push(task);
                roleParent.doTask(creep);
                creep.say('added Task');
            }


        }

    }
}
module.exports = settler;