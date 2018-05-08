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

function doWork(creep) {
    //    if(!super.guardRoom(creep)) false;
    if (creep.memory.keeperLairID !== undefined && creep.memory.keeperLairID != 'none') { // THis is obtained when 
        let keeper = Game.getObjectById(creep.memory.keeperLairID);

        if (keeper !== null)
            if (keeper.ticksToSpawn === undefined || keeper.ticksToSpawn < 20)
                return false;
    }

    let contain = Game.getObjectById(creep.memory.workContainer);
    if (contain === null) {
        creep.memory.workContainer = undefined;
        return;
    }
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
        if(creep.pos.isEqualTo(contain)){

        } else if (creep.pos.isNearTo(contain)) {
            if (contain.store != contain.storeCapacity) {
                creep.transfer(contain, creep.carrying);
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
    function shouldDie(creep) {
        if (creep.hits == creep.hitsMax) return;
        if (creep.getActiveBodyparts(MOVE) === 0) {
            creep.suicide();
            return;
        }
        if (creep.hits < creep.hitsMax - 800) {
            creep.suicide();
        }
    }

class settler extends roleParent {
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
        shouldDie(creep);
        super.rebirth(creep);
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

        if (super.keeperWatch(creep)) {
            return;
        }

        var _source = Game.getObjectById(creep.memory.goal);
    //    if (creep.memory.goal == '5982ff12b097071b4adc20caxx') {
            //creep.memory.reportDeath = false;
//            console.log(creep.room.name);
  //      }

        var resting; // = restingSpot(creep);
        // if(!resting ?creep.pos.isNearTo(_source):creep.pos.isEqualTo(resting)){
        //            if(!resting ?creep.pos.isNearTo(_source):creep.pos.isEqualTo(resting))
        //          }
        //}
        let contain = Game.getObjectById(creep.memory.workContainer);
        //        if(creep.room.name == 'E25S44'||creep.room.name == 'E25S45'){
        if (!resting && contain !== null) {
            if (creep.memory.mineSpot === undefined) {

                if (contain.pos.isNearTo(_source)) {
                    creep.memory.mineSpot = new RoomPosition(contain.pos.x, contain.pos.y, contain.pos.roomName);
                    resting = creep.memory.mineSpot;
                }

            } else {
                 creep.memory.mineSpot = new RoomPosition(contain.pos.x, contain.pos.y, contain.pos.roomName);
                resting = creep.memory.mineSpot;
            }
        }
        //      }

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
                creep.room.memory.mineInfo[creep.memory.goal] += 30;
            }



            //var string = creep.room.memory.mineInfo[creep.memory.goal];

            var spn = Game.getObjectById(creep.memory.parent);
            if (spn !== null) {
                for (var e in spn.memory.roadsTo) {
                    let zz = spn.memory.roadsTo[e];
                    let maxLevel = 8;
                    if (zz.source === creep.memory.goal && zz.expLevel !== 0 && Game.cpu.bucket > 2000) {
                        if (_source.energyCapacity === 4000) {
                            if (zz.expLevel < 3) zz.expLevel = 3;
                            //                            maxLevel = 9; // Max level 9/10 have 3 transports, let turn that off for now. 1/16/2018
                            if (zz.expLevel > maxLevel){
                              zz.expLevel = maxLevel;   
                            }
                        }
                        if (creep.room.memory.mineInfo[creep.memory.goal] < -5000 && zz.expLevel > 3) {
                            zz.expLevel--;
                            if (zz.expLevel < 2) zz.expLevel = 2;
                            creep.room.memory.mineInfo[creep.memory.goal] = 2000;
                            markDeath(creep.memory.goal);
                        }
                        if (creep.room.memory.mineInfo[creep.memory.goal] > 5000 && zz.expLevel < maxLevel) {
                            zz.expLevel++;
                            if (zz.expLevel > maxLevel) zz.expLevel = maxLevel;
                            creep.room.memory.mineInfo[creep.memory.goal] = -2000;
                            markDeath(creep.memory.goal);
                        } else if(creep.room.memory.mineInfo[creep.memory.goal] > 5000 && zz.expLevel === maxLevel ) {
                        }
                     //   string = string + "[" + zz.expLevel + "]";
                    }
                }

            }


            if (creep.room.memory.mineInfo[creep.memory.goal] > 100000) creep.room.memory.mineInfo[creep.memory.goal] = 100000;
            if (creep.room.memory.mineInfo[creep.memory.goal] < -100000) creep.room.memory.mineInfo[creep.memory.goal] = -100000;


//            super.constr.pickUpEnergy(creep);
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

            if (contain === null ||  _source.energy !== 0 || (creep.pos.isEqualTo(contain) || contain.total < contain.storeCapacity)) {

                if (creep.harvest(_source) == OK) {
                    if (_source.energyCapacity == 4000 && creep.memory.keeperLairID === undefined) {
                        super.keeperFind(creep);
                    }
                    if (creep.room.memory.mineInfo[creep.memory.goal] < 0) {
                        creep.room.memory.mineInfo[creep.memory.goal] += 1;
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
                

                
            if (creep.room.name == super.movement.getRoomPos(creep).roomName) {
                var bad = getBads(creep);
                creep.say(bad.length);
                if (bad.length === 0) {
                    creep.moveMe(!resting ? _source : resting);
                }
                return;
            } 
            

                let task = {};
                task.options = {
                    reusePath: 49,
                    ignoreCreep: true,
//                    swampCost:1,
                    segment: true,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                };
                task.pos = _source !== null ? _source.pos : super.movement.getRoomPos(creep);
                task.count = true;
                task.order = "moveTo";
                task.enemyWatch = true;
                task.rangeHappy = 1;
                if(creep.memory.resting !== undefined){
                    task.pos = creep.memory.resting;
                    task.rangeHappy = 0;
                } 
                creep.memory.task.push(task);
                roleParent.doTask(creep);
            


        }

//        creep.cleanMe();

    }
}
module.exports = settler;