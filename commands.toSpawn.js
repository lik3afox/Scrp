function getCost(module) {
    var total = 0;
    for (var i in module) {
        for (var e in BODYPART_COST) {
            if (module[i] == e) {
                total += BODYPART_COST[e];
            }
        }
    }
    return total;
}

function getStack(spawn) {
    if(spawn.room.memory.aSpawnOperated ){ // Meaning that only operated spawns will work.
        let effects = spawn.isEffected(PWR_OPERATE_SPAWN);
        if(effects){
            let alpha = spawn.room.alphaSpawn;
            if(alpha.memory.warCreate && alpha.memory.warCreate.length > 0 ){
                return alpha.memory.warCreate;
            }
        } else {
            return [];
        }
    }
    
    spawn = spawn.room.alphaSpawn;
    if(!spawn.memory.create) return;
    if(spawn.room.name === 'E13S18' && spawn.memory.warCreate && spawn.memory.warCreate.length > 0 ){
        return spawn.memory.warCreate;
    }

    if (spawn.memory.create.length === 0 && spawn.memory.warCreate.length > 0) {
        return spawn.memory.warCreate;
    }
    if (spawn.memory.create.length === 0 && spawn.memory.expandCreate.length > 0 && spawn.memory.warCreate.length === 0) {
        return spawn.memory.expandCreate;
    }
    return spawn.memory.create;
}


function getEmptyTargets(creep) {
    if (creep.room._extensionCache === undefined) {
        creep.room._extensionCache = _.filter(creep.room.find(FIND_MY_STRUCTURES), function(structure) {
            if (structure.structureType === STRUCTURE_TOWER) {
                return structure.energy < 800;
            } else {
                return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) && structure.energy < structure.energyCapacity;
            }
        });

    }
    return creep.room._extensionCache;
}


function getRandomFillTarget(creep) {
    let targets = getEmptyTargets(creep);
    let targetNum = targets.length;
    if (targetNum === 0) return false;
    let rando = Math.floor(Math.random() * targetNum);
    //    creep.say('ran!' + rando + "/" + targetNum);
    return targets[rando];
}

function newmoveToTransfer(creep, limit) {
    // Move To transfer does three things
    // 1. Find Target
    // 1. Transfer to target
    //      a. Transfer to another.
    //      b. Find Target
    // 2. Move To target
    var moveTo; // = STRUCTURE_STORAGE;
    if (limit !== undefined) {
        if (creep.room.energyAvailable > limit) return false;
    }

    let fillTarget = Game.getObjectById(creep.memory.fillTargetID);

    if (creep.memory.fillTargetID === undefined || fillTarget === null || fillTarget.energy === fillTarget.energyCapacity) {
        fillTarget = getRandomFillTarget(creep);
        if (fillTarget === false) return false;
        creep.memory.fillTargetID = fillTarget.id;
    }
    if (toTransfer2(creep)) {
        return true;
    }

    if (moveTo === STRUCTURE_STORAGE) {
        creep.moveMe(creep.room.storage, { maxOpts: 100, reusePath: 1, ignoreCreeps: true });
    } else {
        creep.moveMe(fillTarget, {
            reusePath: 20,
            range: 1,
            ignoreCreeps: true,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#fff',
                lineStyle: 'dashed',
                strokeWidth: 0.15,
                opacity: 0.5
            }
        });
    }
}

function toTransfer2(creep) {
    var around = creep.room.lookAtArea(coronateCheck(creep.pos.y - 1), coronateCheck(creep.pos.x - 1),
        coronateCheck(creep.pos.y + 1), coronateCheck(creep.pos.x + 1), true);
    var e = around.length;
    var didTransfer = false;
    var foundMore = false;
    while (e--) {
        if (around[e].type == 'resource') {
            if (creep.carryTotal !== creep.carryCapacity) {
                if (didTransfer) {
                    foundMore = true;
                    break;
                }
                let result = creep.pickup(around[e].resource);
                //                console.log('Totransfer resource pickup', result);
                //                creep.say('PU'+result);
                didTransfer = true;
                continue;
                //    return true;
            }
        } else if (around[e].type === 'tombstone') {
            if (creep.carryTotal !== creep.carryCapacity) {

                for (let ii in around[e].tombstone.store) {
                    if (around[e].tombstone.store[ii] > 0) {
                        if (didTransfer) {
                            foundMore = true;
                            break;
                        }
                        let result = creep.withdraw(around[e].tombstone, ii);
                        didTransfer = true;
                        continue;
                        //                        console.log('Totransfer resource pickup', result);
                        //break;
                    }
                }
                creep.say('TU');

                //   return true;
            }
        } else if (around[e].type == 'structure') {
            if (around[e].structure.structureType === STRUCTURE_POWER_SPAWN) {
                if (around[e].structure.energy < around[e].structure.carryCapacity >> 1) {
                    if (didTransfer) {
                        //                    foundMore = true;
                        //                  break;
                    }

                    if (creep.transfer(around[e].structure, RESOURCE_ENERGY) == OK) {
                        didTransfer = true;
                        continue;
                        //      return true;
                    }
                }
            }

            if (around[e].structure.structureType === STRUCTURE_LINK && around[e].structure.energy > 0 && creep.carryTotal !== creep.carryCapacity >> 1) {
                if (didTransfer) {
                    foundMore = true;
                    break;
                }

                if (creep.withdraw(around[e].structure, RESOURCE_ENERGY) == OK) {
                    didTransfer = true;
                    continue;
                    //      return true;
                }
            }
            if ((around[e].structure.structureType != STRUCTURE_LINK && around[e].structure.structureType != STRUCTURE_NUKER && around[e].structure.structureType !== STRUCTURE_POWER_SPAWN) && around[e].structure.energy < around[e].structure.energyCapacity) {
                if (didTransfer) {

                    foundMore = true;
                    break;
                }

                if (creep.transfer(around[e].structure, RESOURCE_ENERGY) == OK) {
                    if (creep.carry[RESOURCE_ENERGY] < 51) {
                        creep.moveTo(creep.room.storage, { maxOpts: 10 });
                    }
                    if (creep.memory.fillTargetID === around[e].structure.id) {
                        creep.memory.fillTargetID = undefined;
                    }

                    didTransfer = true;
                    continue;
                    // return true;
                }
            }
        } else if (around[e].type == 'creep' && around[e].creep.id !== creep.id && around[e].creep.owner.username === 'likeafox' && around[e].creep.carryTotal < around[e].creep.carryCapacity - 100) {
            // IF they are both linkers, and one is 'depositing '
            /*                if ( around[e].creep.memory.role === 'linker' && creep.memory.role === 'linker' && !around[e].creep.memory.deposit && creep.carryTotal> creep.carryCapacity>>1) {
                                if (creep.transfer(Game.creeps[around[e].creep.name], RESOURCE_ENERGY,creep.carry[RESOURCE_ENERGY]>>1) === OK) {
                                    console.log(creep.memory.role, 'DDDoing transfer', Game.creeps[around[e].creep.name].memory.role, Game.creeps[around[e].creep.name].pos, roomLink(Game.creeps[around[e].creep.name].room.name));
                                    Game.creeps[around[e].creep.name].memory.deposit = true;
                                    return true;
                                }
                            } else  */
            if (creep.memory.role === 'transport') {
                if (around[e].creep.memory.role === 'wallwork' || around[e].creep.memory.role === 'linker') {
                    /*if(didTransfer){
                        foundMore = true;
                        break;
                    }*/

                    if (creep.transfer(Game.creeps[around[e].creep.name], RESOURCE_ENERGY) === OK) {
                        //    console.log(creep.memory.role, 'doing transfer', Game.creeps[around[e].creep.name].memory.role, Game.creeps[around[e].creep.name].pos, roomLink(Game.creeps[around[e].creep.name].room.name));
                        didTransfer = true;
                        continue;

                        //     return true;
                    }
                }
            } else if (creep.memory.role === 'linker') {
                if (around[e].creep.memory.role === 'wallwork') {
                    /*if(didTransfer){
                        foundMore = true;
                        break;
                    }*/

                    if (creep.transfer(Game.creeps[around[e].creep.name], RESOURCE_ENERGY) === OK) {
                        //       console.log(creep.memory.role, 'doing transfer', Game.creeps[around[e].creep.name].memory.role, Game.creeps[around[e].creep.name].pos, roomLink(Game.creeps[around[e].creep.name].room.name));
                        didTransfer = true;
                        continue;

                        //   return true;
                    }
                }
            }
        }
    }

    if (foundMore && creep.memory._move) {
        creep.memory._move.time++;
    }
    return foundMore;
}
class SpawnInteract {
    static newSpawnRemote(spawn){
        spawn.memory.remotes = {
            '5982ff6bb097071b4adc296d':{
                // id: disabled cuase the id is the object finding.
                active: true, // This is how we disable this remote
                pos: {
                    x:0,
                    y:0,
                    roomName:'E1W1'
                    },
                containPos:{
                    x:0,
                    y:0,
                    roomName:'E1W1'
                },
                distance:10,
                controller: false,
                miner:{
                    carry:2,
                    work:12,
                },
                transport:{
                    carry:10,
                },
                keeperID: undefined, 
                /*cachePath: {
                    toStorage:{
                        'E24S34':1782104445,
                        'E28S33':1782104445,
                    },
                    toSource:{
                        roomName:path,
                    },
                }*/

            }
        };

       // spawn.memory.remotes.push()

    }




    static addSpawnQuery(spawnCount) {
        var e;
        if (spawnCount !== undefined) {

            for (e in Game.spawns) {
                if (Game.spawns[e].memory.alphaSpawn) {
                    if (spawnCount[Game.spawns[e].id] === undefined) {
                        spawnCount[Game.spawns[e].id] = {
                            bodyCount: 0
                        };
                    }
                    if (spawnCount[Game.spawns[e].id] !== undefined) {
                        let spwn = Game.spawns[e];
                        let spwnCount = spawnCount[Game.spawns[e].id];
                        if (spwn.memory.create === undefined) spwn.memory.create = [];
                        let create = spwn.memory.create;

                        let war = spwn.memory.warCreate;
                        let expand = spwn.memory.expandCreate;
                        if (expand === undefined) expand = [];
                        let a;
                        let iMax;

                        iMax = create.length;

                        for (a = 0; a < iMax; a++) {
                            if (spwnCount[create[a].memory.role] !== undefined) {
                                spwnCount[create[a].memory.role].count++;
                            } else {
                                spwnCount[create[a].memory.role] = {
                                    count: 1,
                                    goal: []
                                };
                            }
                        }
                        if (war !== undefined) {
                            iMax = war.length;
                            for (a = 0; a < iMax; a++) {
                                if (spwnCount[war[a].memory.role] !== undefined) {
                                    spwnCount[war[a].memory.role].count++;
                                } else {
                                    spwnCount[war[a].memory.role] = {
                                        count: 1,
                                        goal: []
                                    };
                                }
                            }
                        }
                        iMax = expand.length;
                        for (a = 0; a < iMax; a++) {
                            if (spwnCount[expand[a].memory.role] !== undefined) {
                                spwnCount[expand[a].memory.role].count++;
                                spwnCount[expand[a].memory.role].goal.push(expand[a].memory.goal);
                            } else {
                                spwnCount[expand[a].memory.role] = {
                                    count: 1,
                                    goal: [expand[a].memory.goal]
                                };

                            }
                        }
                    }
                }

            }
        }

        return spawnCount;
    }

    static requestCreep(creepWanted, spawnID) {
        let spawn = Game.getObjectById(spawnID);
        if (spawn !== null) {
            //            console.log('request happening', spawn, creepWanted.build);
            spawn.memory.warCreate.push(creepWanted);
            return true;
        }
    }

    static addToExpandStack(newCreep) {
        if (Game.rooms[newCreep.room] === undefined) return;
        if (Game.rooms[newCreep.room].alphaSpawn !== undefined) {
            let spawn = Game.rooms[newCreep.room].alphaSpawn;
            newCreep.memory.parent = spawn.id;
            if (spawn.memory.expandCreate !== undefined) {
                var toTop = ['rampartGuard', 'fighter', 'healer', 'mage'];
                var toExpand = ['mule'];
                if (_.contains(toTop, newCreep.memory.role)) {
                    spawn.memory.expandCreate.unshift(newCreep);
                } else {
                    spawn.memory.expandCreate.push(newCreep);
                }
            }
        }
    }

    static setModuleRole(roomName,role,number,level){
        let flag = Game.flags[roomName];
        if(!flag) return;
        let mod = flag.memory.module;
        for(let i in mod){
            if(mod[i][0] === role){
                if(number !== undefined) mod[i][1] = number;
                if(level !== undefined)  mod[i][2] = level;
                return true;
            }
        }
        if(number === undefined) return;
        if(level === undefined) return;
        mod.push([role,number,level]);
    }

    static addToWarStack(newCreep) {
        if (Game.rooms[newCreep.room] === undefined) {
            //            console.log(newCreep);
            return;
        }
        if (Game.rooms[newCreep.room].alphaSpawn !== undefined) {
            let spawn = Game.rooms[newCreep.room].alphaSpawn;
            newCreep.memory.parent = spawn.id;
            if (spawn.memory.warCreate !== undefined) {
                var toTop = ['rampartGuard', 'fighter', 'healer', 'mage'];
                var toExpand = ['mule'];
                if (_.contains(toTop, newCreep.memory.role)) {
                    spawn.memory.warCreate.unshift(newCreep);
                } else {
                    spawn.memory.warCreate.push(newCreep);
                }
            }
        }
    }

    static moveToTransfer(creep, limit) {
        return newmoveToTransfer(creep, limit);
    }

    static checkMemory(spawn) {

        if (spawn.room.alphaSpawn === undefined || spawn.memory.alphaSpawn === undefined) {
            let spwns = spawn.room.find(FIND_STRUCTURES, {
                filter: {
                    structureType: STRUCTURE_SPAWN
                }
            });

            if (spwns.length == 1) {
                spwns[0].memory.alphaSpawn = true;
            }
            for (var a in spwns) {
                if (spwns[a].memory.alphaSpawn === undefined) {
                    spwns[a].memory.alphaSpawn = false;
                    spwns[a].memory.alphaSpawnID = spwns[0].id;
                }
            }
        }

        if (spawn.memory.alphaSpawn) {
            // Mode is to determine what is being built and also controller level so build.
            if (spawn.memory.roadsTo) {
                spawn.memory.remotes = undefined;
                spawn.room.memory.energyIn = spawn.memory.roadsTo.length > 0;
            }
            if (spawn.memory.buildLevel === undefined) {
                spawn.memory.buildLevel = 0;
                console.log('----------------Create buildLevel Variable----------------');
            }
            if (spawn.memory.remoteStop === undefined) {
                spawn.memory.remoteStop = [];
                console.log('----------------Create remoteStop ARRAY----------------');
            }

            // If there is no memory.create array then create it.
            // Create is an array to hold what will be created.

            if (spawn.memory.create === undefined) {
                spawn.memory.create = [];
                console.log('----------------Create Spawn Stack----------------');
            }
            if (spawn.memory.warCreate === undefined) {
                spawn.memory.warCreate = [];
                console.log('----------------Create Spawn WarStack----------------');
            }
            if (spawn.memory.expandCreate === undefined) {
                spawn.memory.expandCreate = [];
                console.log('----------------Create Spawn ExpansionStack----------------');
            }
            if (spawn.memory.created === undefined) {
                spawn.memory.created = 0;
                console.log('----------------Create Spawn Created Count----------------');
            }
            if (spawn.memory.roadsTo === undefined) {
                //                spawn.memory.roadsTo = [];
                console.log('----------------Create Spawn RoadsTo ----------------');
                //                console.log('looking for other spawns that match room and has roadTo info to grab from');
                for (var e in Game.spawns) {
                    //              if(Game.spawns[e].memory.roadsTo !== undefined){
                    //                      console.log(Game.spawns[e].room.name , spawn.room.name, Game.spawns[e].memory.alphaSpawn, Game.spawns[e].memory.roadsTo);
                    //                }

                    // Here is how we replace roadsTo = , first we need to mark the old one as not a alphaSpawn, then set the new one.
                    if (Game.spawns[e].room.name === spawn.room.name && !Game.spawns[e].memory.alphaSpawn && Game.spawns[e].memory.roadsTo !== undefined) {
                        //                console.log('found');
                        spawn.memory.roadsTo = Game.spawns[e].memory.roadsTo;
                        break;
                    }
                }
                if (spawn.memory.roadsTo === undefined) {
                    spawn.memory.roadsTo = [];
                }
            }


        }
    }

    static createFromStack(spawn) {

        if (spawn.spawning) return;

        var STACK = getStack(spawn);
        var ee;
        spawn.memory.spawnDir = undefined;
        if (STACK !== undefined && STACK.length > 0) {
            if (!_.isArray(STACK[0].build)) {
                console.log('clearing stak of error', STACK[0].build);
                STACK.shift();
                return;
            }
            ee = spawn.canCreateCreep(STACK[0].build);
            if (ee == OK) {
                let ez = spawn.createCreep(STACK[0].build, STACK[0].name, STACK[0].memory);
                if (ez == -3) {
                    STACK[0].name = STACK[0].name + Math.floor(Math.random() * 9);
                } else {
                    STACK.shift();
                }
                spawn.room.memory.DOEXTENSIONPOWER = undefined;

            } else if (STACK[0].build.length === 0 && ee === ERR_INVALID_ARGS) {
                STACK.shift();
                console.log('INVAID STACK SHIFT', STACK, STACK.length, roomLink(spawn.pos.roomName));
            } else if (STACK[0] === undefined) {

            } else if (ee === ERR_NOT_ENOUGH_ENERGY && getCost(STACK[0].build) > spawn.room.energyCapacityAvailable) {
                STACK[0].build = _.clone(STACK[0].build);
                do {
                    STACK[0].build.shift();
                    console.log('><><>>>>-=-=-DOWNGRADE MODULE ENERGY', getCost(STACK[0].build), STACK[0].memory.role + STACK[0].memory.party + '-=-=-=-=<<<<><><');
                } while (getCost(STACK[0].build) > spawn.room.energyCapacityAvailable);

            } else if (ee === ERR_NOT_ENOUGH_ENERGY){
                if(spawn.room.powerLevels && spawn.room.powerLevels[PWR_OPERATE_EXTENSION] && spawn.room.powerLevels[PWR_OPERATE_EXTENSION].ready){
                    spawn.room.memory.DOEXTENSIONPOWER = true;
                    console.log(spawn.room, "Forcing DOEXTENSIONPOWER");
                }
            }else if (ee === ERR_INVALID_ARGS && STACK[0] && STACK[0].build.length > 50) {
                STACK[0].build = _.clone(STACK[0].build);
                do {
                    STACK[0].build.shift();
                    console.log('><><>>>>-=-=-DOWNGRADE MODULE 50+', STACK[0].build.length, STACK[0].memory.role + STACK[0].memory.party + '-=-=-=-=<<<<><><');
                } while (STACK[0].build.length > 50);
            } else if (STACK[0] && STACK[0].memory.role === 'linker' && ee === ERR_NOT_ENOUGH_ENERGY && STACK.length > 3) {

            } else if (STACK[0].length === undefined && STACK[0].length === 0) {
                console.log("ERROR", spawn, spawn.pos);
            }

        }

    }

}
module.exports = SpawnInteract;