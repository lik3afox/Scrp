function getSpawnRequire(spawn) {
    switch (spawn.name) {
        case 'Spawn1':
            return require('build.spawn1');
        case 'Spawn2':
            return require('build.spawn2');
        case 'Spawn3':
            return spwn3;
        default:
            console.log('ERRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR');
            break;
    }
}
var showSpawning = false;

function ghettoFind(structure) {

}

function getModule(spawn) {
    let spawnz = getSpawnRequire(spawn);
    let modz = spawnz.getModules();
}


function getTargets(creep) {

    if (creep.memory.spawnTargets !== undefined) {
        let zzz = [];
        for (var e in creep.memory.spawnTargets) {
            let target = Game.getObjectById(creep.memory.spawnTargets[e]);
            //            console.log(target.energy);
            if (target.energy < target.energyCapacity) {
                if (creep.pos.isNearTo(target)) {
                    return [target];
                } else {
                    zzz.push(target);
                }

            }
        }
//        console.log(zzz.length, '/', creep.memory.spawnTargets.length, creep.pos);
        creep.say('bizzches', true);
        return zzz;
    }
    if (creep.room.name == 'E27S75' || creep.room.name == 'E37S75') {
        let zzz = creep.room.find(FIND_MY_STRUCTURES);
        zzz = _.filter(zzz, function(structure) {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_EXTENSION
                //                structure.structureType == STRUCTURE_POWER_SPAWN ||
                //structure.structureType == STRUCTURE_LAB
            ) && structure.energy < structure.energyCapacity;
        });
        /*        if (creep.memory.spawnTargets === undefined) {
                    creep.memory.spawnTargets = [];
                    for (var z in zzz) {
                        creep.memory.spawnTargets.push(zzz[z].id);
                    }
                }
                return zzz; */
    }

    let zzz;
    //    if (creep.room.name == 'E35S83') {
    zzz = creep.room.find(FIND_MY_STRUCTURES);
        if (creep.room.name == 'E35S83') {

    zzz = _.filter(zzz, function(structure) {
        return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER ||
            structure.structureType == STRUCTURE_LAB 
        );
    });
} else {
    zzz = _.filter(zzz, function(structure) {
        return (structure.structureType == STRUCTURE_EXTENSION ||
            structure.structureType == STRUCTURE_SPAWN ||
            structure.structureType == STRUCTURE_TOWER ||
            structure.structureType == STRUCTURE_LAB ||
            structure.structureType == STRUCTURE_POWER_SPAWN
        );
    });
}

    creep.memory.spawnTargets = [];
    for (var a in zzz) {
        creep.memory.spawnTargets.push(zzz[a].id);
    }
    return zzz;
    /*  } else {
          zzz = creep.room.find(FIND_MY_STRUCTURES);
          zzz = _.filter(zzz, function(structure) {
              return (structure.structureType == STRUCTURE_EXTENSION ||
                  structure.structureType == STRUCTURE_SPAWN ||
                  structure.structureType == STRUCTURE_TOWER ||
                  structure.structureType == STRUCTURE_LAB ||
                  structure.structureType == STRUCTURE_POWER_SPAWN
              ) && structure.energy < structure.energyCapacity;
          });

          return zzz;
      }*/
}

function getModuleLevel(spawn) {
    return spawn.memory.buildLevel;
}

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
    // Here we return the stack that is wanted 
    //    console.log('getting stack',spawn.memory.currentStack)
    //    console.log(spawn.memory.create.length,spawn.memory.warCreate.length,spawn.memory.expandCreate );
    if (spawn.memory.alphaSpawn) {

        spawn.memory.currentStack = 'create';
        //    console.log(spawn.memory.create.length , spawn.memory.expandCreate.length);
        if (spawn.memory.create.length === 0 && spawn.memory.warCreate.length > 0) {
            spawn.memory.currentStack = 'war';
        }

        if (spawn.memory.create.length === 0 && spawn.memory.expandCreate.length > 0 && spawn.memory.warCreate.length === 0) {
            spawn.memory.currentStack = 'expand';
        }

        //        console.log(spawn.memory.currentStack);
        switch (spawn.memory.currentStack) {
            case 'create':
                return spawn.memory.create;
            case 'war':
                return spawn.memory.warCreate;
            case 'expand':
                return spawn.memory.expandCreate;
        }
    } else {
        for (var i in Game.spawns) {
            if (Game.spawns[i].room.name == spawn.room.name && Game.spawns[i].memory.alphaSpawn) {
                alpha = Game.spawns[i];
                //                console.log(Game.spawns[i].room.name, spawn.room.name, Game.spawns[i].memory.alphaSpawn, alpha.memory.currentStack);


                alpha.memory.currentStack = 'create';
                if (alpha.memory.create.length === 0 && alpha.memory.warCreate.length > 0) {
                    alpha.memory.currentStack = 'war';
                }

                if (alpha.memory.create.length === 0 && alpha.memory.expandCreate.length > 0 && alpha.memory.warCreate.length === 0) {
                    alpha.memory.currentStack = 'expand';
                }


                switch (alpha.memory.currentStack) {
                    case 'create':
                        return alpha.memory.create;
                    case 'war':
                        return alpha.memory.warCreate;
                    case 'expand':
                        return alpha.memory.expandCreate;
                }

            }
        }

    }
}

function checkAround(creep) {
    var targets = creep.pos.findInRange(FIND_STRUCTURES, 1, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_LAB ||
                structure.structureType == STRUCTURE_POWER_SPAWN ||
                structure.structureType == STRUCTURE_SPAWN
            ) && structure.energy < structure.energyCapacity;
        }
    });
    //console.log(creep,targets.length,creep.pos);
    for (var i in targets) {
        creep.transfer(targets[i], RESOURCE_ENERGY);
        return true;
    }
    return false;
}

function getNewTarget(creep) {
    let target;
    for (var e in Game.structures) {
        if (Game.structures[e].room.name == creep.room.name &&
            Game.structures[e].energy < Game.structures[e].energyCapacity &&
            (Game.structures[e].structureType == STRUCTURE_TOWER ||
                Game.structures[e].structureType == STRUCTURE_EXTENSION ||
                Game.structures[e].structureType == STRUCTURE_LAB ||
                Game.structures[e].structureType == STRUCTURE_SPAWN ||
                Game.structures[e].structureType == STRUCTURE_POWER_SPAWN)) {
            if (creep.pos.isNearTo(Game.structures[e]))
                return Game.structures[e].id;
        }
    }

    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_LAB ||
                structure.structureType == STRUCTURE_SPAWN ||
                Game.structures[e].structureType == STRUCTURE_POWER_SPAWN) && structure.energy < structure.energyCapacity;
        }
    });



    if (target === undefined) return false;
    return target.id;
}

class SpawnInteract {
    constructor() {}


    static requestCreep(creepWanted, spawnID) {
        let spawn = Game.getObjectById(spawnID);
        console.log('request happening', spawn, creepWanted.build);
        spawn.memory.warCreate.push(creepWanted);
        return true;
    }

    static addToWarStack(creep) {
        // for now it will only created at homeEmpire.
        console.log(creep.spawn, 'this should be a room');
        for (var i in Game.spawns) {
            if (Game.spawns[i].memory.alphaSpawn && Game.spawns[i].room.name == creep.spawn) {
                creep.memory.home = Game.spawns[i].room.name;
                creep.memory.parent = Game.spawns[i].id;
                Game.spawns[i].memory.warCreate.push(creep);
                console.log(Game.spawns[i], 'adding to stack', Game.spawns[i].name, creep.spawn);
            }

        }

    }


    static newTarget(creep) {
        getNewTarget(creep);
    }

    static getSpawns(creep) {
        var targets = getTargets(creep);
        return targets;
    }

    static moveToClose(creep) {
        if (creep.memory.spawnTarget === undefined) {
            creep.memory.spawnTarget = getNewTarget(creep);
        }

        var target = Game.getObjectById(creep.memory.spawnTarget);

        if (target === null || target.energy == target.energyCapacity) {
            // get new target
            creep.memory.spawnTarget = getNewTarget(creep);
            target = Game.getObjectById(creep.memory.spawnTarget);
        }
        if (target === null) {
            return false;
        }
        if (creep.pos.isNearTo(target)) {
            switch (creep.transfer(target, RESOURCE_ENERGY)) {
                case ERR_NOT_IN_RANGE:
                    creep.moveTo(target);
                    break;
                case OK:
                    creep.memory.spawnTarget = getNewTarget(creep);
                    break;
            }
        }
        return true;

    }


    static toExtensions(creep) {
        let yy = creep.pos.y - 1;
        let yy2 = creep.pos.y + 1;
        let xx = creep.pos.x - 1;
        let xx2 = creep.pos.x + 1;
        if (yy < 0) yy = 0;
        if (xx < 0) xx = 0;
        if (yy2 > 49) yy2 = 49;
        if (xx2 > 49) xx2 = 49;
        var around = creep.room.lookAtArea(yy, xx, yy2, xx2, true);
        //  console.log(around.length);
        for (var e in around) {
            if (around[e].type == 'structure') {
                if ((around[e].structure.structureType != STRUCTURE_SPAWN && around[e].structure.structureType != STRUCTURE_LINK) && around[e].structure.energy < around[e].structure.energyCapacity) {
                    if (creep.transfer(around[e].structure, RESOURCE_ENERGY) == OK) {
                        return true;
                    }
                }
            }
        }
        return false;

    }


    static toTransfer(creep) {
        let yy = creep.pos.y - 1;
        let yy2 = creep.pos.y + 1;
        let xx = creep.pos.x - 1;
        let xx2 = creep.pos.x + 1;
        if (yy < 0) yy = 0;
        if (xx < 0) xx = 0;
        if (yy2 > 49) yy2 = 49;
        if (xx2 > 49) xx2 = 49;
        var around = creep.room.lookAtArea(yy, xx, yy2, xx2, true);
        //  console.log(around.length);
        for (var e in around) {
            if (around[e].type == 'structure') {
                //          console.log(around[e].structure.energy , around[e].structure.energyCapacity);
                if ((around[e].structure.structureType != STRUCTURE_LINK && around[e].structure.structureType != STRUCTURE_NUKER) && around[e].structure.energy < around[e].structure.energyCapacity) {
                    if (creep.transfer(around[e].structure, RESOURCE_ENERGY) == OK) {
                        return true;
                    }
                }
            }
        }
        return false;

    }

    static moveToTransfer(creep, limit) {

        if (limit !== undefined) {
            if (creep.room.energyAvailable > limit) return false;
        }

        var targets = getTargets(creep);

        let goTo = 0;

        if (targets.length > 1) {
            if (targets.length < creep.memory.roleID) {
                goTo = creep.memory.roleID % targets.length;
            } else {
                goTo = creep.memory.roleID;
            }
        }

        if (targets[goTo] === undefined) return false;
        creep.memory.spawnTarget = targets[goTo].id;

        if (targets.length > 0) {
            if (creep.pos.isNearTo(targets[goTo])) {
                if (creep.transfer(targets[goTo], RESOURCE_ENERGY) == OK) {
                    if (creep.carry[RESOURCE_ENERGY] < 51) {
                        creep.moveTo(creep.room.terminal);
                    } else {
                        if (targets[goTo + 1] !== undefined) {
                            if (!creep.pos.isNearTo(targets[goTo + 1]))
                                creep.moveTo(targets[goTo + 1]);
                            return true;
                        }
                    }

                }
            } else {
                checkAround(creep);
                creep.moveTo(targets[goTo]);
            }
            return true;
        } else {
            return false;
        }
    }
    static moveTo(creep, limit) {
        if (limit !== undefined) {
            if (creep.room.energyAvailable > limit) return false;
        }
        var targets = getTargets(creep);
        let goTo = 0;
        //         var goTo = 0;
        if (targets.length > 1) {
            if (targets.length < creep.memory.roleID) {
                goTo = creep.memory.roleID % targets.length;
            } else {
                goTo = creep.memory.roleID;
            }
        }

        if (targets[goTo] === undefined) return false;
        creep.memory.spawnTarget = targets[goTo].id;
        let _spawn = Game.getObjectById(creep.memory.spawnTarget);

        if (targets.length > 0) {
            if (!creep.pos.isNearTo(targets[goTo])) {} else {
                creep.moveTo(targets[goTo]);
            }
            return true;
        } else {
            return false;
        }
    }

    static checkMemory(spawn) {

        if (spawn.memory.alphaSpawn) {
            // Mode is to determine what is being built and also controller level so build.
            if (spawn.memory.mode === undefined) {
                spawn.memory.mode = 'beginning';
                console.log('----------------Create mode Variable----------------');
            }
            if (spawn.memory.buildLevel === undefined) {
                spawn.memory.buildLevel = 0;
                console.log('----------------Create buildLevel Variable----------------');
            }
            // If there is no memory.create array then create it.
            // Create is an array to hold what will be created.

            if (spawn.memory.currentStack === undefined) {
                spawn.memory.currentStack = 'create';
                console.log('----------------Create CurrentStack Variable----------------');
            }
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

            // Analyzed is an array of rooms that this spawn has looked at. 
            if (spawn.memory.analyzed === undefined) {
                for (var e in Game.spawns) {
                    if (Game.spawns[e].homeEmpire) {
                        spawn.memory.analyzed = Game.spawns[e].analyzed;
                    }
                }
                spawn.memory.analyzed = [];
                console.log('----------------Create Spawn Analyzed STACK----------------');
            }

            // roadsTo is an array of sources in other rooms that have roads to them. 
            if (spawn.memory.roadsTo === undefined) {
                spawn.memory.roadsTo = [];
                console.log('----------------Create Spawn RoadsTo ----------------');
            }


        } else {
            /* let masterSpawn;
         for(var i in Game.spawns) {
             if(Game.spawns[i].memory.alphaSpawn && Game.spawns[i].room.name == spawn.room.name) {
                 masterSpawn = Game.spawns[i];
             }
         }
        if (spawn.memory.create == undefined) {
            spawn.memory.create = masterSpawn.memory.create;
            console.log('----------------Create Spawn Stack----------------');
        }
        if (spawn.memory.expandCreate == undefined) {
            spawn.memory.create = masterSpawn.memory.warCreate;
            console.log('----------------Create Spawn ExpansionStack----------------');
        } */
        }

    }

    static homeAnalyzed(room, spawn) {
        if (!spawn.memory.alphaSpawn) return false;
        console.log('----------------Analyzing', room.name, '----------------');
        var sources = room.find(FIND_SOURCES);

        var structure = room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTROLLER);
            }
        });

        sources = sources.concat(structure);

        console.log('----------------' + sources.length + ':Paths made', '----------------');
        for (var e in sources) {
            var path = room.findPath(spawn.pos, sources[e].pos, {
                ignoreCreeps: true
            });
            for (var i in path) {
                var pos = new RoomPosition(path[i].x, path[i].y, room.name);
                room.createConstructionSite(pos, STRUCTURE_ROAD);
            }
        }

        console.log('-------------surrounded by roads ---------------------');

        var roads = [
            [0, 1],
            [-1, 0],
            [0, -1],
            [1, 0]
        ];
        //            spawn.room.createConstructionSite(roads[e][0],roads[e][1], STRUCTURE_ROAD);
        for (var a in roads) {
            spawn.room.createConstructionSite(roads[a][0] + spawn.pos.x, roads[a][1] + spawn.pos.y, STRUCTURE_ROAD);

        }

        spawn.memory.analyzed.push(room.name);
    }

    static renewCreep(spawn) {
        if (spawn.room.name == 'E26S73') {
            spawn.memory.renewEnergyLevel = 1300;
        }
        if (spawn.memory.wantRenew === undefined) return false;
        if (spawn.memory.wantRenew.length === 0) return false;
        if (spawn.memory.renewEnergyLevel !== undefined) {
            if (spawn.room.energyAvailable < spawn.memory.renewEnergyLevel) {
                return false;
            }
        }

        let temp = 1500;
        let renewTarget;

        for (var e in spawn.memory.wantRenew) {
            let creepID = spawn.memory.wantRenew[e];
            let creepTarget = Game.getObjectById(creepID);
            //          let dif = 0;
            //           if (creepTarget !== null)
            //                if (creepTarget.memory.role == 'linker') dif = 200;

            if (creepTarget === null) {
                spawn.memory.wantRenew.splice(e, 1);
            } else if (creepTarget.ticksToLive < temp && creepTarget.pos.isNearTo(spawn)) {
                renewTarget = creepTarget;
                temp = creepTarget.ticksToLive;
            }
        }

        // Does renew stuff
        let renewLimit = 1300;
        if (spawn.memory.renewLevel !== undefined) {
            renewLimit = spawn.memory.renewLevel;
        }
        if (temp < renewLimit) {
            let rst = spawn.renewCreep(renewTarget);

            //console.log('********* ',spawn,' am Renewing:',renewTarget.name,rst,'********* ');
            return true;
        } else {
            return false;
        }
    }

    static wantRenew(creep) {

        if (creep.memory.renewSpawnID === undefined || creep.memory.renewSpawnID == 'none') return false;

        let spawn = Game.getObjectById(creep.memory.renewSpawnID);
        if (spawn === null) {
            creep.memory.renewSpawnID = undefined;
            return false;
        }
        if (spawn.memory.wantRenew === undefined) {
            spawn.memory.wantRenew = [];
            console.log('----------------Create RENEW stack----------------');
        }

        if (!_.contains(spawn.memory.wantRenew, creep.id)) {
            spawn.memory.wantRenew.push(creep.id);
        }

        return true;
    }

    static removeRenew(creep) {

        let spawn = Game.getObjectById(creep.memory.renewSpawnID);
        let zz = spawn.memory.wantRenew;
        for (var e in zz) {
            if (zz[e] == creep.id) {
                console.log(e, zz[e], "renew creep");
                console.log("renew creep");
                console.log("renew creep");
                zz.splice(e, 1);
                break;
            }
        }
        //spawn.memory.wantRenew.splice(_.findIndex(spawn.memory.wantRenew,creep.id) ,1 );

    }

    static createFromStack(spawn) {
        var STACK = getStack(spawn);
        if (spawn.memory.notSpawner === true) return;
        if (STACK.length > 0) {
            // Creation here.

            if (spawn.canCreateCreep(STACK[0].build) == OK) {

                spawn.memory.CreatedMsg = STACK[0].memory.role;
                let ez = spawn.createCreep(STACK[0].build, STACK[0].name, STACK[0].memory);
                //                console.log(spawn.memory.CreatedMsg,ez);

                if (ez == -3) {
                    STACK[0].name = STACK[0].name + 'v';
                }
                STACK.shift();
            } else if (getCost(STACK[0].build) > spawn.room.energyCapacityAvailable) {
                let count = 0;
                do {
                    count++;
                    STACK[0].build.shift();
                } while (getCost(STACK[0].build) > spawn.room.energyCapacityAvailable);
                console.log('><><>>>>-=-=-DOWNGRADE MODULE X' + count + '-=-=-=-=<<<<><><');

            } else if (STACK[0].length === undefined && STACK[0].length === 0) {
                console.log("ERROR");
                console.log("ERROR");
                console.log("ERROR");
                console.log("ERROR");
                console.log("ERROR");
                //STACK.shift();

            }

        }
    }

    static analyzed(Memory, room) {
            for (var i in Memory.analyzed) {
                if (Memory.analyzed[i] == room) {
                    return true;
                }
            }
            return false;
        }
        /*static runSpawnCount(spawnID) {

                let spawn = Game.getObjectById(spawnID);
                spawn.memory.TotalBuild = (totalBuild * 3)+total;

                var totalCreeps = [];

                var currentModule = getModule(spawn);
                for (var a in currentModule) {
                    // This set all the currentModule up in totalCreep and sets it to 0;
                    totalCreeps[currentModule[a][_name]]  = 0;
                //            totalCreeps[] = 0;
                //            console.log(totalCreeps.length, currentModule[a][_name]);
                }
                var totalBuild = 0;
                var total = 0;

                for (var name in Game.creeps) { // Start of creep loop
                    // If the creep ID and this spawn Id match then 
                    if (Game.creeps[name].memory.parent == spawnID) {
                        // Going through all modules 
                        for (var type in currentModule) {
                            // When it finds it, 
                            if (Game.creeps[name].memory.role == currentModule[type][_name]) { // if they are the same
                                // Runs the module. 

                                currentModule[type][_require].run(Game.creeps[name]); // Then run the require of that role.
                                // We need to give it a roleID - the current count is great :D
                                // This needs to be unique per spawn
                                Game.creeps[name].memory.roleID = totalCreeps[currentModule[type][_name]];
                                // Then add one.
                                totalCreeps[currentModule[type][_name]]++;
                            }
                        }
                        total++;
                        totalBuild = totalBuild + Game.creeps[name].body.length;
                    }
                }

                spawn.memory.totalCreep = total;
                return totalCreeps;
            }*/

    static analyzeRoom(spawn, room) {
        // See how far away it iss
        if (!spawn.memory.alphaSpawn) return false;

        //        let hostil = room.find(FIND_HOSTILE_CREEPS);
        //       if(hostil.length > 0) return; 

        /*        for  (var e in Game.rooms) {
                    if(Game.rooms[e].name == room) {
                        if(Game.rooms[room].controller.owner != undefined)  {
                            console.log(room,'under other control');
                            return;
                            }
                        }
                    }*/

        // console.log( Game.rooms[room].controller.owner.username, );    
        var distance = Game.map.getRoomLinearDistance(room.name, spawn.room.name);
        //        console.log(distance,distance,distance,distance,distance,distance);
        if (distance < 2) {
            // If not analyzed then lets start the analyzation
            // How many sources in room.
            var sources = room.find(FIND_SOURCES);
            console.log('found sources', sources.length, ' in ', room.name);
            for (var e in sources) {

                let temp = {
                    build: [MOVE],
                    name: undefined,
                    memory: {
                        role: 'boss',
                        home: room.name,
                        parent: spawn.id,
                        goal: sources[e].id

                    }
                };
                console.log('Added boss to create road to source to stack');
                spawn.memory.create.push(temp);
            }

            // If more than 3 sources then sourcekeeper room
            if (sources.length == 3) {
                // Find the minearl
                var harvest = room.find(FIND_MINERALS);

                var BUILD = {
                    source: harvest[0].id,
                    sourcePos: new RoomPosition(harvest[0].pos.x, harvest[0].pos.y, harvest[0].pos.roomName),
                    mineral: false,
                    expLevel: 11
                };
                spawn.memory.roadsTo.push(BUILD);
            }
            /*
                        if(harvest >0) {
                            for(var i in harvest) {
                            let temp = {
                                build: [MOVE],
                                name: undefined,
                                memory: {
                                    role: 'boss',
                                    home: room.name,
                                    parent: spawn.id,
                                    goal: harvest[i].id

                                }
                            }

                            console.log('Added boss to create road to Harvest to stack');
                            spawn.memory.create.push(temp);
                        }
                        }*/

        }
        // Add it to spawn memory. 
        //        console.log('ERRORERRORERRORERRORERRORERRORERRORERRORERROR');
        spawn.memory.analyzed.push(room.name);
    }
}
module.exports = SpawnInteract;
//5836b80e8b8b9619519f1603 E24S74 17,42
