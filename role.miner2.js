var classLevels = [
    [MOVE, CARRY, WORK, WORK], //  300
    [MOVE, WORK, WORK, WORK, MOVE, CARRY], //  450
    [CARRY, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK], // 800

    [WORK, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY], // 1050
    [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, ], // 1250 


    //6m/12w/1c - 1550 energy
    [CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, MOVE], // 1550
    //7m,14w/1c
    [CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        WORK, WORK, WORK, WORK, WORK,
        WORK, WORK, WORK, WORK,
    ] // 1800

];
var visPath = {
    fill: 'transparent',
    stroke: '#ff0',
    lineStyle: 'dotted',
    strokeWidth: 0.25,
    opacity: 0.5
};

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
            isBuilt = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
            console.log(isBuilt, "shoud be removing soon");

            if (Object.keys(Game.constructionSites).length === 100 && !isBuilt[0]) {
                //creep.sleep(5);
            } else {
                if (isBuilt[0]) isBuilt[0].remove();
                creep.room.createConstructionSite(creep.pos.x, creep.pos.y, STRUCTURE_CONTAINER);
                var roadWork = Game.rooms[creep.memory.home].memory.roadWork;
                roadWork.push(creep.memory.goal);
                console.log('miner added to roadwork query and crated site');
            }
            creep.say('bcotain');
            return;
        }
    } else if (creep.memory.conSite && !tgt) {
        let roads = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);
        if (roads.length > 0) {
            creep.build(roads[0]);
            return;
        }
    }
    creep.build(tgt);
    creep.pickUpEnergy();
}

function repairContainer(creep) {
    let contain = Game.getObjectById(creep.memory.workContainer);
    if (contain === null) {
        creep.memory.workContainer = undefined;
        return false;
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
    } else {}
}

function doRemoteMining(creep, actionObjects) {

    var contain = actionObjects.container;
    var _source = actionObjects.source;
    if (creep.memory.isThere) { // Pretty much mean if creep is there.

        if(contain ){
            if(creep.memory.adjustment === undefined){
                creep.memory.adjustment = 0;
            }
            
            if (contain.total === 2000){
                creep.memory.adjustment++;
            }
            creep.say(creep.memory.adjustment,true);
            if(creep.ticksToLive < 200 && creep.memory.adjustment > 500 &&  Game.rooms[creep.memory.home]){
                console.log(roomLink(creep.room.name),creep.ticksToLive, creep.memory.adjustment ,"Adjustment level");
                let spn = Game.rooms[creep.memory.home].alphaSpawn;
                for(let i in spn.memory.roadsTo){
                    let remoteInfo = spn.memory.roadsTo[i];
                    if(remoteInfo.source === creep.memory.goal){
                        console.log(creep.memory.goal, remoteInfo.expLevel, "Should adjust");
                        remoteInfo.expLevel++;
                        creep.memory.adjustment = 0;
                        if(remoteInfo.expLevel > 8 ){
                            remoteInfo.expLevel = 8;
                            console.log('Maxed out remote, maybe remove?');
                        }
                    }
                }
            } else  if(creep.ticksToLive < 100 && creep.memory.adjustment < -550 ){
                console.log(roomLink(creep.room.name),creep.ticksToLive, creep.memory.adjustment ,"Adjustment level");
                let spn = Game.rooms[creep.memory.home].alphaSpawn;
                for(let i in spn.memory.roadsTo){
                    let remoteInfo = spn.memory.roadsTo[i];
                    if(remoteInfo.source === creep.memory.goal){
                        console.log(creep.memory.goal, remoteInfo.expLevel, "Should adjust");
                        remoteInfo.expLevel--;
                        creep.memory.adjustment = 0;
                        if(remoteInfo.expLevel < 2 ){
                            remoteInfo.expLevel = 2;
                            console.log('Min level remote!');
                        }
                    }
                }


            }
        }

        if ((creep.carryTotal >= creep.carryCapacity - creep.stats('work')) || contain === null) {
            // When to full of energy lets see if a container is there
            // If it is, then repair the container;
            if (repairContainer(creep)) {

            } else if (_source) {
                let isContainer = _source.pos.findInRange(FIND_STRUCTURES, 2, {
                    filter: object => (object.structureType == STRUCTURE_CONTAINER)
                });
                // Checks for container 
                if (creep.carryTotal < creep.stats('work')*5 ) {
                    let hvt = creep.harvest(_source);
                } else if (isContainer.length === 0) {
                    if (!buildContainer(creep)) {
                        let hvt = creep.harvest(_source);
                    }
                    return;
                } else {
                    creep.memory.workContainer = isContainer[0].id;
                }

            }

        }
        if (!contain || (_source.energy !== 0 && contain.total < contain.storeCapacity) ||
            (creep.carry[RESOURCE_ENERGY] < 20 && contain.total === contain.storeCapacity && contain.hits < contain.hitsMax) ||
            (creep.pos.isNearTo(contain) && contain.total < (contain.storeCapacity - creep.stats('work')) && _source.energy !== 0)) {
            let hvt = creep.harvest(_source);
            if (hvt === OK) {
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
            }
        } else if (_source.energy === 0) {
            if (contain.hits < contain.hitsMax) {
                creep.repair(contain);
                if (creep.carry[RESOURCE_ENERGY] < 20 && contain.store[RESOURCE_ENERGY] > 20) {
                    creep.withdraw(contain, RESOURCE_ENERGY);
                }
            } else {
                if (creep.pos.isNearTo(actionObjects.goalPos)) {
                    let lastRoad = Game.getObjectById(creep.memory.lastRoadId);
                    if (lastRoad) {
                        creep.repair(lastRoad);
                    }
                    creep.sleep(Game.time + _source.ticksToRegeneration - 1);
//                    creep.memory.adjustment -= _source.ticksToRegeneration - 1 ;
                    
                }
            }
        }
    }
}

function movement(creep, actionObjects) {
    var result;
    if (creep.memory.isThere && creep.memory.isSkGoal) {
        if (roleParent.keeperWatch2(creep)) {
            return;
        }
    }

    if (!creep.memory.isThere) {
        /*if(actionObjects && actionObjects.path){
            console.log('we got a path to move to!',actionObjects.path.startPos.x,actionObjects.path.startPos.y,actionObjects.path.startPos,actionObjects.path.path,creep.memory.sourcePath);
            if(creep.memory.sourcePath === undefined){
                let startPos = new RoomPosition(actionObjects.path.startPos.x,actionObjects.path.startPos.y,actionObjects.path.startPos.roomName );
                console.log(startPos,creep.pos);
                if(creep.pos.isEqualTo(startPos)){
                    creep.memory.sourcePath =  actionObjects.path.path.toString();
                } else {
                    creep.moveMe(startPos);
                }
            } else {
                console.log( _.isNumber(creep.memory.sourcePath[0]) ,creep.memory.sourcePath[0], creep.memory.sourcePath.slice(1,creep.memory.sourcePath.length) );

                var direction = creep.memory.sourcePath[0];
                result = creep.move(direction);
                creep.memory.sourcePath = creep.memory.sourcePath.slice(1,creep.memory.sourcePath.length);
                console.log(direction,result);
            }
            return;
        } else {*/
        result = creep.moveMe(actionObjects.goalPos, {
            reusePath: 49,
            ignoreCreeps: true,
            segment: true,
            visualizePathStyle: visPath
        });
        // }


    } else if (actionObjects.container) {
        if (!creep.pos.isEqualTo(actionObjects.container)) {
            result = creep.moveMe(actionObjects.container, {
                ignoreCreeps: true,
                visualizePathStyle: visPath
            });
        }
    } else if (!creep.pos.isNearTo(actionObjects.goalPos)) {
        result = creep.moveMe(actionObjects.goalPos, {
            ignoreCreeps: true,
            visualizePathStyle: visPath,
        });
    }
    if (!creep.memory.isThere && !creep.isHome) { //
        creep.countDistance();
        let road = creep.pos.lookForStructure(STRUCTURE_ROAD);
        if (road && creep.carry[RESOURCE_ENERGY] > 0) {
            //console.log(road,road.hits , road.hitsMax-creep.stats('repair') );
            if (road.hits < road.hitsMax - creep.stats('repair')) {
                creep.repair(road);
            }
            if (road.hits < 1000) {
                callHelp(creep);
            }
            creep.memory.lastRoadId = road.id;
        } else {
            // Maybe here build construction Site
            if ((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined)) {
                if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {
                    callHelp(creep);                    
                }
            }
            let sites = creep.pos.lookFor(LOOK_CONSTRUCTION_SITES);
            if (sites.length) {
                if (creep.carryTotal > 0) {
                    creep.build(sites[0]);
                    callHelp(creep);
                } else {
                    if (!road) {
                        callHelp(creep);
                    }
                }
            }

        }
    }

}

function callHelp(creep) {
    if (creep.memory.reported) return;

    if (Game.rooms[creep.memory.home] && Game.rooms[creep.memory.home].memory.roadWork) {
        var roadWork = Game.rooms[creep.memory.home].memory.roadWork;
        var addWork = true;
        for (let i in roadWork) {
            if (creep.memory.goal === roadWork[i]) {
                addWork = false;
                break;
            }
        }
        if (addWork) {
            console.log("Roads need more work has sites", roomLink(creep.room.name), creep.memory.goal, creep.memory.home);
            roadWork.push(creep.memory.goal);
        }
        creep.memory.reported = true;

    }

}

function updateMemory(creep, actionObjects) {
    if (creep.memory.isSkGoal === undefined) {
        creep.memory.isSkGoal = actionObjects.goalPos.isSkRoom();
    }
    if (creep.memory.goal === '59bbc5b12052a716c3ce9e3f') { // this is an room for 2 sources next to each other.
        if (actionObjects.source && actionObjects.source.energy === 0) {
            actionObjects.source = Game.getObjectById('59bbc5b12052a716c3ce9e40');
        }
    }
    if (creep.memory.goal === '59bbc3dc2052a716c3ce6ec3') {
        if (creep.pos.x === 14 && creep.pos.y === 17) {
            let ezd = creep.room.lookForAt(LOOK_CREEPS, 12, 15);
            if (ezd.length > 0) {
                let ttd = creep.room.lookForAt(LOOK_CREEPS, 12, 16);
                if (ttd.length > 0) {
                    let contin = Game.getObjectById(creep.memory.workContainer);
                    if (contin) {
                        ezd[0].withdraw(contin, RESOURCE_ENERGY);
                        ezd[0].memory.goHome = true;
                    } else {
                        if (ezd[0].carryTotal > 0) {
                            ezd[0].memory.goHome = true;
                        } else {
                            ezd[0].suicide();
                        }
                    }
                }
            }
        }
    }
    if (creep.memory.isThere === undefined) {
        creep.memory.isThere = false;
    }

    if (!creep.memory.isThere && actionObjects.goalPos && creep.pos.isNearTo(actionObjects.goalPos)) {
        creep.memory.isThere = true;
    }
    if (!creep.memory.workContainer && !creep.memory.isThere && creep.pos.inRangeTo(actionObjects.goalPos, 3) && !creep.pos.isNearTo(actionObjects.goalPos)) {
        creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD);
    }
    if (creep.memory.isThere && creep.isHome) creep.memory.isThere = false;

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
        super.rebirth(creep);
        if (super.movement.runAway(creep)) { return; }
        if (super.spawnRecycle(creep)) return true;
        super.movement.checkForBadsPlaceFlag(creep);
        if (creep.isHome && creep.carryTotal === 0) {
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
            return;
        }
        var actionObjects = {
            container: Game.getObjectById(creep.memory.workContainer),
            goalPos: roleParent.movement.getSourcePos(creep), // This gains a pos roomPosition returned
            source: Game.getObjectById(creep.memory.goal),
            mineSpot: creep.memory.mineSpot ? new RoomPosition(creep.memory.mineSpot.x, creep.memory.mineSpot.y, creep.memory.mineSpot.roomName) : undefined,
            path: roleParent.movement.getSourcePath(creep),
        };
        

        if (creep.memory.stuckCount === 5 && actionObjects.source && creep.pos.inRangeTo(actionObjects.source, 2)) {
            var sk = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                return o.memory.role === 'miner' && o.memory.goal === creep.memory.goal && o.ticksToLive < creep.ticksToLive;
            });
            if (sk.length > 0) {
                sk[0].suicide();
            }
        }
        /*
        if(actionObjects){
            console.log(actionObjects.container,actionObjects.goalPos,actionObjects.source,actionObjects.mineSpot);
        }*/

        updateMemory(creep, actionObjects);
        movement(creep, actionObjects);
        doRemoteMining(creep, actionObjects);
    }
}
module.exports = settler;