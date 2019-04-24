var classLevels = [
    [MOVE, CARRY, WORK, WORK], //  300
    [MOVE, WORK, WORK, WORK, MOVE, CARRY], //  450

    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, CARRY, WORK], // 800

    [WORK, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE,MOVE, CARRY], // 1050
    [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY], // 1250 

    //6m/12w/1c - 1550 energy
    [CARRY,CARRY, MOVE, MOVE, MOVE, MOVE, MOVE , MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, WORK,  ], // 1550
    //7m,14w/1c
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, ] // 1800

];

var roleParent = require('role.parent');

function buildContainer(creep, source) {
    // this is called because it doesn't find a container.
    let tgt = Game.getObjectById(creep.memory.conSite);
    let isBuilt;
    let goal = Game.getObjectById(creep.memory.goal);
    if (!tgt) {
        isBuilt = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 5, {
            filter: object => (object.structureType == STRUCTURE_CONTAINER)
        });
        if (isBuilt.length > 0) {
            creep.memory.conSite = isBuilt[0].id;
            tgt = isBuilt[0];
        } else if (creep.pos.isNearTo(goal)) {
            if (Object.keys(Game.constructionSites).length === 100) {
                creep.sleep(5);
            } else {
                creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
            }


            creep.say('bcotain');
            return;
        }
    }
    creep.build(tgt);
    creep.pickUpEnergy();
}

function doRemoteMining(creep, _source, contain, resting) {
    let _sourcePos;
    if (creep.memory.goal === '59bbc5b12052a716c3ce9e3f') { // this is an room for 2 sources next to each other.
        if (_source && _source.energy === 0) {
            _source = Game.getObjectById('59bbc5b12052a716c3ce9e40');
        }
    }
    if(_source){
        _sourcePos= _source.pos;
    }  else {
        _sourcePos = new RoomPosition(creep.memory._sourcePos.x, creep.memory._sourcePos.y, creep.memory._sourcePos.roomName);
    }

    if ((_source && creep.pos.inRangeTo(_source, 3)) || (resting && creep.pos.inRangeTo(resting, 3))) { // Pretty much mean if creep is there.
        if ((creep.carryTotal >= creep.carryCapacity - creep.stats('work')) || contain === null) {
            if (creep.memory.workContainer === undefined) {
                let isContainer = _source.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: object => (object.structureType == STRUCTURE_CONTAINER)
                });
                // Checks for container 
                if (isContainer.length === 0) {
                    buildContainer(creep);
                } else {
                    creep.memory.workContainer = isContainer[0].id;
                    repairContainer(creep);
                    return;
                }
            } else {
                if (repairContainer(creep))
                    return;
            }
        }

        if (contain === null || (creep.pos.isNearTo(contain) && contain.total < (contain.storeCapacity - creep.stats('work')) && _source.energy !== 0)) {

            let hvt = creep.harvest(_source);
            if (hvt == OK) {
                trackMining(creep);
                creep.memory.isThere = true;
                creep.room.visual.text(_source.energy + "/" + _source.ticksToRegeneration, _source.pos.x + 1, _source.pos.y, {
                    color: 'white',
                    align: RIGHT,
                    font: 0.6,
                    strokeWidth: 0.75
                });

            }

        } else if (creep.carry[RESOURCE_ENERGY] < 20 && contain !== null && contain.total === contain.storeCapacity && contain.hits < contain.hitsMax) {
            if (creep.harvest(_source) === OK) {
                trackMining(creep);
            }
            creep.say('rp');
        } else if (_source.energy !== 0 && contain === undefined) {
            if (creep.harvest(_source) == OK) {
                trackMining(creep);
                creep.memory.isThere = true;
            }

        } else if (_source.energy === undefined || _source.energy === 0) {
            if (creep.carry[RESOURCE_ENERGY] === 0 && contain.store[RESOURCE_ENERGY] === 0) {
                if (creep.pos.isNearTo(_sourcePos)) {
                    creep.sleep(Game.time + _source.ticksToRegeneration - 1);
                }
            } else if (contain.hits < contain.hitsMax) {
                creep.repair(contain);
                if (creep.carry[RESOURCE_ENERGY] < 20 && contain.store[RESOURCE_ENERGY] > 20) {
                    creep.withdraw(contain, RESOURCE_ENERGY);
                }
            } else {
                if (creep.pos.isNearTo(_sourcePos)) {
                    creep.sleep(Game.time + _source.ticksToRegeneration - 1);
                }
            }
        }
        if (resting && !creep.pos.isEqualTo(resting)) {
            creep.moveMe(resting);
        } else if (_source && !creep.pos.isNearTo(_source)) {
            creep.moveMe(_source);
        }

    } else {
        creep.moveMe(_sourcePos, {
            reusePath: 49,
            ignoreCreep: true,
            segment: true,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#ff0',
                lineStyle: 'dotted',
                strokeWidth: 0.25,
                opacity: 0.5
            }
        });
    }

}

function doSourceKeeperMining(creep, _source, contain, resting) {
    let _sourcePos;
    if (_source !== null) {
        _sourcePos = _source.pos;
    }
    if (!_sourcePos) _sourcePos = creep.memory._sourcePos;

    //if (creep.pos.isNearTo(_sourcePos) || creep.pos.isEqualTo(resting)) {
    if ((_sourcePos && creep.pos.inRangeTo(_sourcePos, 3)) || (resting && creep.pos.inRangeTo(resting, 3))) { // Pretty much mean if creep is there.
        if ((creep.carryTotal >= creep.carryCapacity - creep.stats('work')) || contain === null) {
            if (creep.memory.workContainer === undefined) {
                let range = 2;

                let isContainer = _source.pos.findInRange(FIND_STRUCTURES, range, {
                    filter: object => (object.structureType == STRUCTURE_CONTAINER)
                });
                // Checks for container 
                if (isContainer.length === 0) {
                    buildContainer(creep, _sourcePos);
                } else {
                    creep.memory.workContainer = isContainer[0].id;
                    if (repairContainer(creep)) return;
                }
            } else {
                if (repairContainer(creep)) return;
            }
        }

        if (!contain || (creep.pos.isNearTo(contain) && contain.total < (contain.storeCapacity - creep.stats('work')) && _source.energy !== 0)) {
            let hvt = creep.harvest(_source);

            if (hvt == OK) {
                trackMining(creep);
                if (_source.energyCapacity == 4000 && creep.memory.keeperLairID === undefined) {
                    roleParent.keeperFind(creep);
                }
                creep.memory.isThere = true;
                creep.room.visual.text(_source.energy + "/" + _source.ticksToRegeneration, _source.pos.x + 1, _source.pos.y, {
                    color: 'white',
                    align: RIGHT,
                    font: 0.6,
                    strokeWidth: 0.75
                });
            } else {
                creep.moveMe(_source);
            }
        } else if (contain !== null && contain.total === contain.storeCapacity && contain.hits < contain.hitsMax) {
            if (creep.carry[RESOURCE_ENERGY] < 20) {
                if (creep.harvest(_source) === OK) {
                    trackMining(creep);
                }
            } else {
                creep.moveMe(_source);
            }
        }
        /*else if (_source.energy !== 0 && !contain ) {
                   if (creep.harvest(_source) == OK) {
                       trackMining(creep);
                       if (creep.memory.keeperLairID === undefined) {
                           roleParent.keeperFind(creep);
                       }
                       creep.memory.isThere = true;
                   }else {
                    creep.moveMe(_source);
                   }

               } */
        else if (_source.energy === undefined || _source.energy === 0) {
            if (creep.carry[RESOURCE_ENERGY] === 0 && contain.store[RESOURCE_ENERGY] === 0) {
                creep.sleep(3);
            } else if (contain.hits < contain.hitsMax) {
                creep.repair(contain);
                if (creep.carry[RESOURCE_ENERGY] < 20 && contain.store[RESOURCE_ENERGY] > 20) {
                    creep.withdraw(contain, RESOURCE_ENERGY);
                }
            } else {
                creep.sleep(3);
            }
        }

        if (resting && !creep.pos.isEqualTo(resting)) {
            creep.say('rst');
            creep.moveMe(resting);
        } else if (!_source && !creep.pos.isNearTo(_source)) {
            creep.say('sur');
            creep.moveMe(_source);
        }
    } else {

        if (!creep.memory.isThere && _sourcePos.roomName != creep.room.name) creep.countDistance();

        creep.moveMe(_sourcePos, {
            reusePath: 49,
            ignoreCreep: true,

            segment: true,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#ff0',
                lineStyle: 'dotted',
                strokeWidth: 0.15,
                opacity: 0.5
            }
        });
    }

}

/*function doRecordKeeping(creep) {
    var string;
    var _source = Game.getObjectById(creep.memory.goal);
    let contain = Game.getObjectById(creep.memory.workContainer);
    var spn = Game.getObjectById(creep.memory.parent);
    var mineInfo = creep.room.memory.mineInfo[creep.memory.goal];

    if (Game.rooms[creep.memory.home].memory.mineInfo && Game.rooms[creep.memory.home].memory.mineInfo[creep.memory.goal]) {

    }

    if (contain !== null && contain.total === 2000) {
        mineInfo += 30;
    }

    if (spn !== null && spn.memory.totalParts < 4500) {
        if (creep.memory.spawnRoadID === undefined) {
            for (let e in spn.memory.roadsTo) {
                let zz = spn.memory.roadsTo[e];
                let maxLevel = 8;
                if (zz.source === creep.memory.goal && zz.expLevel !== 0) {
                    creep.memory.spawnRoadID = e;
                    if (_source.energyCapacity === 4000) {
                        if (zz.expLevel < 3) zz.expLevel = 3;
                        //                            maxLevel = 9; // Max level 9/10 have 3 transports, let turn that off for now. 1/16/2018
                        if (zz.expLevel > maxLevel) {
                            zz.expLevel = maxLevel;
                        }
                    }
                    if (mineInfo < -5000 && zz.expLevel > 3) {
                        zz.expLevel--;
                        if (zz.expLevel < 2) zz.expLevel = 2;
                        mineInfo = 2000;
                        markDeath(creep.memory.goal);
                    }
                    if (mineInfo > 5000 && zz.expLevel < maxLevel) {
                        zz.expLevel++;
                        if (zz.expLevel > maxLevel) zz.expLevel = maxLevel;
                        mineInfo = -2000;
                        markDeath(creep.memory.goal);
                    } else if (mineInfo > 5000 && zz.expLevel === maxLevel) {}
                    string = mineInfo + "[" + zz.expLevel + "]";
                }
            }
        } else {
            let zz = spn.memory.roadsTo[creep.memory.spawnRoadID];
            let maxLevel = 8;
            if (zz.source === creep.memory.goal && zz.expLevel !== 0) {

                if (_source.energyCapacity === 4000) {
                    if (zz.expLevel < 3) zz.expLevel = 3;
                    //                            maxLevel = 9; // Max level 9/10 have 3 transports, let turn that off for now. 1/16/2018
                    if (zz.expLevel > maxLevel) {
                        zz.expLevel = maxLevel;
                    }
                }
                if (mineInfo < -5000 && zz.expLevel > 3) {
                    zz.expLevel--;
                    if (zz.expLevel < 2) zz.expLevel = 2;
                    mineInfo = 2000;
                    markDeath(creep.memory.goal);
                }
                if (mineInfo > 5000 && zz.expLevel < maxLevel) {
                    zz.expLevel++;
                    if (zz.expLevel > maxLevel) zz.expLevel = maxLevel;
                    mineInfo = -2000;
                    markDeath(creep.memory.goal);
                } else if (mineInfo > 5000 && zz.expLevel === maxLevel) {}
                string = mineInfo + "[" + zz.expLevel + "]";
            }
        }
        creep.room.visual.text(string, creep.pos);
    }


    if (mineInfo > 100000) mineInfo = 100000;
    if (mineInfo < -100000) mineInfo = -100000;

}*/

function getBads(creep) {
    return creep.room.notAllies;
}

function doSKSpot(creep) {
    if (creep.memory.runFromKeeper) return;
    switch (creep.memory.goal) {
        case '5982ff79b097071b4adc2b6d':
            creep.memory.runFromKeeper = {
                x: 48,
                y: 47,
                roomName: 'E25S44',
            };
            break;
    }
}

function repairContainer(creep) {
    /*if (creep.memory.keeperLairID !== undefined && creep.memory.keeperLairID != 'none') { // If htis is an SK room then it shouldn't repair at 20 below.
        let keeper = Game.getObjectById(creep.memory.keeperLairID);

        if (keeper !== null)
            if (keeper.ticksToSpawn === undefined || keeper.ticksToSpawn < 20)
                return false;
    }*/

    let contain = Game.getObjectById(creep.memory.workContainer);
    if (contain === null) {
        creep.memory.workContainer = undefined;
        return;
    }
    if ((contain.hits < contain.hitsMax - 25000) || (contain.hits < 50000)) {
        if (creep.carry[RESOURCE_ENERGY] === 0 && contain.store[RESOURCE_ENERGY] > 0) {
            creep.withdraw(contain, RESOURCE_ENERGY);
            return true;
        }
        let rep = creep.repair(contain);
        if (rep == ERR_NOT_IN_RANGE) {
            creep.say('m2w');
            creep.moveTo(contain);
            return true;
        } else if (rep == OK) {
            creep.say('repairContainer');
            return true;
        }
    } else {
        //        creep.say('noRepair');
        /*        if (!creep.pos.isEqualTo(contain) && creep.pos.isNearTo(contain)) {
                    if (contain.store != contain.storeCapacity) {
                        creep.transfer(contain, creep.carrying);
                    }
                } */
    }

}

/*function markDeath(sourceID) {
    var target = _.filter(Game.creeps, function(o) {
        if (o.memory.goal == sourceID) {
            o.memory.reportDeath = true;
        }
    });

}*/

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
            return _.clone(classLevels[level].body);
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
        if(creep.memory.home === 'E24S33'){
            require('role.miner2').run(creep);
            return;
        }

        shouldDie(creep);
        super.rebirth(creep);
        if (super.movement.runAway(creep)) { return; }

        if (super.spawnRecycle(creep)) return true;
        if (super.depositNonEnergy(creep)) return true;

        super.movement.checkForBadsPlaceFlag(creep);
        if (creep.memory.isThere === undefined) { creep.memory.isThere = false; }
        if (!creep.memory._sourcePos) { creep.memory._sourcePos = super.movement.getSourcePos(creep); }
        if (creep.memory.isSkGoal === undefined) { creep.memory.isSkGoal = creep.memory._sourcePos.isSkRoom(); }

        var _source = Game.getObjectById(creep.memory.goal);
        let contain = Game.getObjectById(creep.memory.workContainer);

        if (creep.memory.stuckCount === 5 && _source && creep.pos.inRangeTo(_source, 2)) {

            var sk = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                return o.memory.role === 'miner' && o.memory.goal === creep.memory.goal && o.ticksToLive < creep.ticksToLive;
            });
            if (sk.length > 0) {
                sk[0].suicide();
            }
        }
//        doSKSpot(creep);

        // Resting code stuff.
        var resting;
        if (creep.memory.mineSpot) resting = new RoomPosition(creep.memory.mineSpot.x, creep.memory.mineSpot.y, creep.memory.mineSpot.roomName);
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
        } else if (contain === null) {
            creep.memory.workContainer = undefined;
        }

        if (creep.memory.isSkGoal) {
            if (super.keeperWatch(creep)) {
                return;
            }
            if (creep.memory.keeperLairID !== undefined || !roleParent.guardRoom(creep)) {
                doSourceKeeperMining(creep, _source, contain, resting);
            }
            
        } else {
            doRemoteMining(creep, _source, contain, resting);
        }

        /*if( Game.time%100 === 0){
            let isRoad = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 5, {
                filter: object => (object.structureType == STRUCTURE_ROAD)
            });
         if (isRoad.length > 0) {
            creep.memory.roadBuildId = isRoad[0].id;
         }
        }
        if(creep.memory.roadBuildId){
            let tgt = Game.getObjectById(creep.memory.roadBuildId);
            if(tgt){
                creep.build(tgt);
            }else {
                creep.memory.roadBuildId = undefined;
            }
        }*/

    }
}
module.exports = settler;