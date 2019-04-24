var classLevels = [
    //0
    [WORK, CARRY, MOVE],
    //1
    [WORK, MOVE, WORK, MOVE, CARRY, CARRY, MOVE],
    //2
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //3
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //4 /2300 Energy
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    //6 Super Level 6 - 40 Work, 5 carry 5 move
    {
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE],
        boost: ['XZHO2', 'XLH2O', 'XKH2O'],
    },
    // Level 7 - same as level 6 except it will focus on nuke repair.
    {
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
        boost: ['XZHO2', 'XLH2O', 'XKH2O'],
    }

];

var boost = [];
var roleParent = require('role.parent');
/*
function doNukeRamparts(creep) {
//    creep.say('nUKEEE');
    if (creep.memory.constructionID !== undefined) {
        var strucs = Game.getObjectById(creep.memory.constructionID);

        if (strucs !== null) {
            if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                creep.moveTo(strucs, { reusePath: 15 });
            }
        } else {
            creep.memory.constructionID = undefined;
        }
    } else {
        zzz = flag.room.find(FIND_MY_STRUCTURES);
        zzz = _.filter(zzz, function(structure) {
            return (structure.structureType == STRUCTURE_RAMPART &&
                structure.pos.isNearTo(nuke, 5)

            );
        });
    }
    return true;
}*/

function moveToBuildRoad(creep) {
    if (!creep.memory.goal) return false;
    if (creep.memory.stopRepair && creep.isHome) {
        creep.memory.goal = undefined;
        creep.memory.stopRepair = undefined;
        creep.memory.goToSource = undefined;
        return false;
    }

    var goalPos = Game.getObjectById(creep.memory.goal);
    if (goalPos === null) {
        let remoteRooms = Game.rooms[creep.memory.home].alphaSpawn.memory.roadsTo;
        for (let i in remoteRooms) {
            if (remoteRooms[i].source === creep.memory.goal) {
                goalPos = new RoomPosition(remoteRooms[i].sourcePos.x, remoteRooms[i].sourcePos.y, remoteRooms[i].sourcePos.roomName);
            }
        }
    }
    if(goalPos === null){
        creep.memory.goal = undefined;
        return;
    }
    if (creep.isHome && creep.carryTotal < creep.carryCapacity) {
        creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
        return true;
    }
    if (creep.memory.goToSource === undefined) {
        creep.memory.goToSource = true;
    }
    if (creep.memory.stopRepair === undefined) {
        creep.memory.stopRepair = false;
    }

    if (Game.time % 2 === 0 && creep.carryTotal < creep.carryCapacity) {
        let yy = coronateCheck(creep.pos.y - 1);
        let yy2 = coronateCheck(creep.pos.y + 1);
        let xx = coronateCheck(creep.pos.x - 1);
        let xx2 = coronateCheck(creep.pos.x + 1);
        var nlinkz = creep.room.lookAtArea(LOOK_CREEPS, yy, xx, yy2, xx2, true);

        for (var i in nlinkz) {
            if (nlinkz[i].creep && nlinkz[i].creep.carryTotal > 0) {
                if (nlinkz[i].creep.transfer(creep, RESOURCE_ENERGY) === OK) {
                    if(creep.carryTotal === 0){
                        if(creep.memory.goToSource){
                            creep.memory.goToSource = false;
                        } else {
                            creep.memory.goToSource = true;
                        }
                    }
                }
            }
            if(nlinkz[i].energy){
                creep.pickup(nlinkz[i].energy);
            }
            if(nlinkz[i].constructionSite){
                creep.build(nlinkz[i].constructionSite);
                creep.memory.buildId = nlinkz[i].constructionSite.id;
            }
        }
    }
    

    if (!creep.isHome) {
        var doFeeet = true;
        if(creep.isNearEdge){
                    let conSite = _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), function(o) {
                        return o.pos.inRangeTo(creep, 3);
                    });
                    if(conSite.length > 0){
                        creep.build(conSite[0]);
                        creep.memory.buildId = conSite[0].id;
                         doFeeet = false;
                    }

        }        
        if(doFeeet){
        let atFeet = creep.room.lookAt(creep.pos);
        var createSite = true;
        for(let i in atFeet){
            var thing = atFeet[i];
            if(atFeet[i].type === 'structure'){
                if (atFeet[i].structure.hits < atFeet[i].structure.hitsMax-200) { //- creep.stats('repair')
                    creep.repair(atFeet[i].structure);
                }
                createSite = false;
            } else if (thing.type === 'constructionSite'){
                creep.build(thing.constructionSite);
                creep.memory.buildId = thing.constructionSite.id;
                creep.memory.stopRepair = false;
                createSite = false;
//                creep._stopMove = true;
            } else if (thing.type === LOOK_ENERGY){
                creep.pickup(thing.energy);
            }  else {
            }
        }
        if(creep.carryTotal === 0 && !creep.memory.goToSource){
            createSite = false;
        }

        if (createSite) {
            // Maybe here build construction Site ||creep.memory.noFound <=
            if (((creep.memory.cachePath !== undefined) && (creep.memory._move === undefined))) {
                if (creep.room.createConstructionSite(creep.pos, STRUCTURE_ROAD) == OK) {}
            }
            if(creep.memory.buildId){
                let tgt = Game.getObjectById(creep.memory.buildId);
                if(tgt && creep.pos.inRangeTo(tgt,3)){
                    creep.build(tgt);
                } else {
                    let conSite = _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), function(o) {
                        return o.pos.inRangeTo(creep, 3);
                    });
                    if(conSite.length > 0){
                        creep.build(conSite[0]);
                        creep.memory.buildId = conSite[0].id;
                    }
                }
            }
        }
            }

    }


    if (creep.memory.goToSource) {
        if (creep.pos.inRangeTo(goalPos,2) ) { //creep.pos.inRangeTo(goalPos,15) && creep.carryTotal === 0 || 
            var nearBy = _.filter(creep.room.find(FIND_STRUCTURES), function(o) {
                return o.structureType === STRUCTURE_CONTAINER;
            });
            var contain = creep.pos.findClosestByRange(nearBy);
            if (contain) {
                creep.moveToWithdraw(contain, RESOURCE_ENERGY);
            } else {
                creep.memory.goToSource = false;
            }

            creep.memory.stopRepair = true;   
            if (creep.carryTotal > 0) {
                    let conSite = _.filter(creep.room.find(FIND_CONSTRUCTION_SITES), function(o) {
                        return o.pos.inRangeTo(creep, 3);
                    });
                    if(conSite.length > 0){
                        creep.build(conSite[0]);
                        creep.memory.buildId = conSite[0].id;
                        creep.memory.stopRepair = false;   
                    } else {
                    }

                creep.memory.goToSource = false;
            } 
            return true;
        } else  if(creep.carryTotal === 0){
            creep.memory.goToSource = false;
        }
        creep.moveMe(goalPos, {
            reusePath: 49,
            ignoreCreeps: true,
            segment: true,
            //            visualizePathStyle: visPath
        });
    } else if (!creep.memory.goToSource) {
        creep.moveMe(Game.rooms[creep.memory.home].storage, {
            reusePath: 49,
            ignoreCreeps: true,
            segment: true,
            //          visualizePathStyle: visPath
        });
        if (creep.room.storage) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                creep.memory.goToSource = true;
             //   creep.memory.stopRepair = true;
            }
        }
    }


    creep.say(creep.memory.stopRepair);
    return true;
}


function moveToRepairWall(creep) {
    if (creep.memory.repairCounter === undefined) {
        creep.memory.repairCounter = -1;
    }
    let target = Game.getObjectById(creep.memory.wallTargetID);
    if (creep.memory.repairCounter < 0) {
        creep.memory.repairCounter = 75;
        if (!creep.memory.didSearchSites) {
            let stre = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (stre !== null) {
                creep.memory.constructionID = stre.id;
                return false;
            }
            creep.memory.didSearchSites = true;
        }

        if (creep.room.memory.nukeIncoming) {
            /// NUKE STUFF HERE FINDING nuke and repairing the nearby Ramparts.
            let nuke = Game.getObjectById(creep.memory.nukeID);
            if (!nuke) {
                nukes = creep.room.find(FIND_NUKES);
                nuke = _.min(nukes, o => o.timeToLand);
                creep.memory.nukeID = nuke.id;
                creep.memory.nukeNumber = nukes.length;
            }
            if (!nuke || nuke.pos === undefined) {
                creep.room.memory.nukeIncoming = undefined;
                return;
            }
            let str;
            if(!creep.memory.noMoreSearch){
                str = nuke.pos.findInRange(FIND_STRUCTURES, 2);
                let notRamprt = _.filter(str,
                    function(object) {
                        return !object.pos.lookForStructure(STRUCTURE_RAMPART) && object.structureType !== STRUCTURE_ROAD && object.structureType !== STRUCTURE_CONTAINER &&object.structureType !== STRUCTURE_CONTROLLER;
                    }
                );
                for (let eee in notRamprt) {
                    creep.room.createConstructionSite(notRamprt[eee].pos.x, notRamprt[eee].pos.y, STRUCTURE_RAMPART);
                }
                if(notRamprt.length === 0){
                    creep.memory.noMoreSearch = true;
                }
                console.log('found non ramparted structures', notRamprt.length);
            }else {
                str = creep.pos.findInRange(FIND_STRUCTURES, 3);
            }
            structs = _.filter(str,
                function(object) {
                    if (object.structureType === STRUCTURE_RAMPART && object.isPublic && creep.memory.nukeNumber && object.pos) {
                        let distance = object.pos.getRangeTo(nuke);
                        if (distance === 0) {
                            creep.memory.nukeMaxHits = creep.memory.nukeNumber * 10000000;
                            return object.hits <= creep.memory.nukeMaxHits;
                        } else {
                            creep.memory.nukeMaxHits = creep.memory.nukeNumber * 5000000;
                            return object.hits <= creep.memory.nukeMaxHits;
                        }
                    } else {
                        return object.structureType == STRUCTURE_RAMPART || object.structureType == STRUCTURE_WALL;
                    }
                }
            );
            target = _.min(structs, o => o.hits);
            if (target.structureType !== STRUCTURE_RAMPART || !target.isPublic) creep.memory.nukeMaxHits = undefined;

            // so... target... is a structure - then it should be public(to prevent it being further boosted up later.)
            if (!target.isPublic) {
                if (target.pos.lookForStructure(STRUCTURE_EXTENSION)) {
                    target.setPublic(true);
                }
                if (target.pos.lookForStructure(STRUCTURE_EXTRACTOR)) {
                    target.setPublic(true);
                }
                if (target.pos.lookForStructure(STRUCTURE_LINK)) {
                    target.setPublic(true);
                }
                if (target.pos.lookForStructure(STRUCTURE_OBSERVER)) {
                    target.setPublic(true);
                }
                if (target.pos.lookForStructure(STRUCTURE_POWER_SPAWN)) {
                    target.setPublic(true);
                }
                if (target.pos.lookForStructure(STRUCTURE_LAB) && target.id !== creep.room.memory.boostLabID) {
                    target.setPublic(true);
                }
                if (target.pos.lookForStructure(STRUCTURE_NUKER)) {
                    target.setPublic(true);
                }
            }


            creep.memory.wallTargetID = target.id;
        } else if (creep.room.memory.focusWall) {
            let str; // = creep.room.find(FIND_STRUCTURES);
            if (creep.ticksToLive > 1425 || creep.memory.roleID === 0) {
                str = creep.room.find(FIND_STRUCTURES);
            } else {
                str = creep.pos.findInRange(FIND_STRUCTURES, 3);
            }

            let structs = _.filter(str,
                function(object) {
                    return (((object.structureType == STRUCTURE_RAMPART && !object.isPublic) || object.structureType === STRUCTURE_WALL) && object.hits < (object.hitsMax - 50000)); //Memory.empireSettings.maxWallSize removed - this is used on creation.
                }
            );
            if (structs.length > 0) {
                if (creep.memory.roleID === 0) {
                    target = _.min(structs, o => o.hits);
                    creep.memory.wallTargetID = target.id;
                } else {
                    creep.memory.wallTargetID = structs[Math.floor(Math.random() * structs.length)].id;
                }
            }

        } else {

            let str;
            str = creep.room.find(FIND_STRUCTURES);

            let structs = _.filter(str,
                function(object) {
                    return object.structureType == STRUCTURE_RAMPART && object.isPublic && object.hits < 1000000;
                }
            );
            //            if (creep.room.name === 'E18S46') console.log(structs.length, "iospblc");
            if (structs.length > 0) {
                target = _.min(structs, o => o.hits);
                creep.memory.wallTargetID = target.id;
            } else {
                if(creep.room.memory.siege){
                    structs = _.filter(str,
                        function(object) {
                            return ((object.structureType == STRUCTURE_RAMPART && !object.isPublic ) && object.hits < object.hitsMax - 50000); //Memory.empireSettings.maxWallSize removed - this is used on creation.
                        }
                    );
                } else {
                structs = _.filter(str,
                    function(object) {
                        return (((object.structureType == STRUCTURE_RAMPART && !object.isPublic) || object.structureType === STRUCTURE_WALL) && object.hits < object.hitsMax - 50000); //Memory.empireSettings.maxWallSize removed - this is used on creation.
                    }
                );
                }

                if (structs.length > 0) {
                    if (creep.room.storage.full || (creep.room.terminal && creep.room.terminal.full)) {
                        target = creep.room.storage.pos.findClosestByRange(structs);
                        creep.memory.wallTargetID = target.id;

                    } else {
                        target = _.min(structs, o => o.hits);
                        creep.room.memory.weakestWall = target.hits;
                        creep.memory.wallTargetID = target.id;
                    }
                } else {
                    console.log(creep.room.name, structs.length, "No walls to work on that are less that 299999000:DEATH");
                    creep.memory.death = true;
                }
            }
        }
    }
    creep.say(creep.memory.repairCounter);

    //    console.log('repair wall', roomLink(creep.room.name));
    if (target !== null) {

        if (target.hits < 300000000) {
            if (creep.pos.inRangeTo(target, 3)) {
                if (creep.memory.nukeMaxHits) {
                    if (target.hits < creep.memory.nukeMaxHits + 1500 && creep.repair(target) == OK) {
                        creep.memory.repairCounter--;
                    } else {
                        creep.memory.repairCounter = -1;
                        //        return false;
                    }
                } else {
                    if (creep.repair(target) == OK) {
                        creep.memory.repairCounter--;
                    }
                    creep.room.visual.text(target.hits, target.pos, { color: '#00FF0F ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                }
                //  return true;
            }
            if (!creep.pos.inRangeTo(target, 3)) {
                creep.moveMe(target, { reusePath: 30, range: 2 });
                return false;
            } else {
                creep.cleanMe();
            }
        } else if (target.hits === 300000000) {
            console.log(roomLink(creep.room.name), "Has maxed out wall @ ", target.pos);

            creep.memory.wallTargetID = undefined; // = -1;
        } else {
            creep.memory.repairCounter = -1;
        }
    } else {
        creep.memory.repairCounter = -1;
    }


    /*
        if (creep.memory.wallTargetID === undefined) {
            var sz;
            creep.memory.repairCounter = 75;
            var structs = creep.room.find(FIND_STRUCTURES);
            var targets = _.filter(structs,
                function(object) {
                    return object.structureType == STRUCTURE_RAMPART && object.isPublic && object.hits < 1000000;
                }
            );

            if (targets.length === 0) {
                targets = _.filter(structs,
                    function(object) {
                        return (((object.structureType == STRUCTURE_RAMPART && !object.isPublic) || object.structureType === STRUCTURE_WALL) && object.hits !== object.hitsMax);
                    }
                );
            }
            //            creep.say(targets.length + "Zced");
            if (targets.length > 0) {
                var lowestWall = _.min(targets, o => o.hits);
                creep.memory.wallTargetID = lowestWall.id;
                if (creep.repair(lowestWall) === ERR_NOT_IN_RANGE) {
                    creep.moveMe(lowestWall, { ignoreCreeps: true, reusePath: 30, maxRooms: 1, range: 3 });
                    return false;
                } else {
                    creep.cleanMe();
                }
                return true;
            } else {
                return false;
            }

        }*/


}
class roleWallWorker extends roleParent {
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
    static boosts(level, roomName) {
        if (Game.shard.name === 'shard3') return ['LH'];
        if (Game.rooms[roomName] && Game.rooms[roomName].controller && Game.rooms[roomName].controller.level < 8) return ['XLH2O'];
        if (Game.shard.name !== 'shard1' || !Memory.empireSettings.boost.wallwork) return [];
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return ['LH'];
    }

    static run(creep) {
        if (Memory.focusWall) {
            if (creep.memory.roleID === 0) {
                creep.room.visual.text('0', creep.pos.x, creep.pos.y);
            }
            if (creep.pos.roomName !== Memory.focusWall) {
                //    creep.memory.death = true;

            } else {
                if (creep.room.memory.weakestWall > 299900000) {
                    //                    Game.flags.focusWall.memory.remove = true;
                    creep.memory.death = true;
                }
            }
        }
        if (super.spawnRecycle(creep)) return true;
        if (super.depositNonEnergy(creep)) return true;
        if (creep.ticksToLive === 1499) {
            let tz = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                return o.memory.role === 'wallwork';
            });
            creep.room.memory.wallworkers = [];
            for (let i in tz) {
                creep.room.memory.wallworkers.push(tz[i].id);
            }
            if (creep.room.memory.focusWall) {
                //                creep.room.boostNeeded = ['LH2O'];
            }
        }
        if (creep.room.boostLab && super.boosted(creep)) {
            return;
        }
        if (moveToBuildRoad(creep)) return;
        if (Game.shard.name === 'shard1') {
            if (creep.ticksToLive > 1495 && !creep.memory.boostNeeded && creep.room.terminal) {
                if (Game.shard.name === 'shard1' && Memory.stats.totalMinerals.XLH2O > 400000) {
                    creep.memory.boostNeeded = ['XLH2O'];
                } else if ((creep.room.terminal.store.LH > 2000) || Memory.stats.totalMinerals.LH > 50000) {
                    creep.memory.boostNeeded = ['LH'];
                } else {
                    creep.memory.boostNeeded = [];
                }

            } else if (creep.ticksToLive < 1400 && creep.memory.boostNeeded && creep.memory.boostNeeded.length > 0) {
                creep.memory.boostNeeded = [];
            }
        }
        var target; // = (creep.room.name == 'E29S48' || creep.room.name == 'E18S46') ? creep.room.storage : creep.room.terminal;
        if (creep.room.storage !== undefined) target = creep.room.storage;
        if ((target !== undefined && target.store[RESOURCE_ENERGY] === 0) || creep.pos.isNearTo(creep.room.terminal)) {
            target = creep.room.terminal;
        }
        if (creep.room.name === 'E38S72' && creep.room.masterLink && creep.room.masterLink.energy > 0) {
            target = creep.room.masterLink;
        }

        if (creep.room.name !== creep.memory.home) {
            creep.moveMe(Game.rooms[creep.memory.home].alphaSpawn, { reusePath: 50 });
            return;
        }
if(!creep.memory.goal && creep.room.memory.roadWork && creep.room.memory.roadWork.length){
    console.log(creep.room.memory.roadWork[0],"Roadwork needed in other places?",roomLink(creep.room.name));
    creep.memory.goal = creep.room.memory.roadWork.shift();
    if (moveToBuildRoad(creep)) return;
}
        if (creep.carryTotal === 0) {
            if (creep.pos.isNearTo(target)) { // || (creep.memory.repairCounter !== undefined && creep.memory.repairCounter <= 0)
                //                creep.say('t:' + target.structureType);
                creep.say(target + '1');
                creep.withdraw(target, RESOURCE_ENERGY);
                if (creep.memory.constructionID === undefined) {
                    let strucs = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                    if (strucs !== null) creep.memory.constructionID = strucs.id;
                }
                //                creep.memory.wallTargetID = undefined;
            } else {
                creep.say(target);
                creep.moveMe(target, { ignoreCreeps: true, reusePath: 20 });
            }
            return;
        }

        if (creep.memory.findRampart) { // This is to find a newly created rampart.
            creep.memory.findRampart--;
            if (creep.memory.findRampart === 0) creep.memory.findRampart = undefined;
            let strcts = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType === STRUCTURE_RAMPART && structure.hits <= 100);
                }
            });
            if (strcts.length) {
                creep.memory.wallTargetID = strcts[0].id;
                creep.memory.constructionID = undefined;
                creep.memory.findRampart = undefined;
            }
            //            creep.say('R1  ' + strcts.length);
        }

        if (creep.memory.constructionID !== undefined) {
            var strucs = Game.getObjectById(creep.memory.constructionID);
            if (strucs !== null) {
                if (creep.build(strucs) == ERR_NOT_IN_RANGE) {
                    creep.moveMe(strucs, { reusePath: 25, range: 3 });
                } else if (strucs.structureType === STRUCTURE_RAMPART) {
                    creep.memory.findRampart = 5;
                }
            } else {
                creep.memory.constructionID = undefined;
            }
        } else {
            if (moveToRepairWall(creep)) {}
        }

    }

}
module.exports = roleWallWorker;