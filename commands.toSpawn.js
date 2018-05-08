function getTargets(creep) {
    creep.room.memory.spawnTargets = undefined;
    if (creep.room._extensionCache === undefined) {
        let zzz = creep.room.find(FIND_MY_STRUCTURES);
        zzz = _.filter(zzz, function(structure) {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_LAB
            );
        });

        creep.room._extensionCache = zzz;
    }
    return creep.room._extensionCache;
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
    var rampart = 'rampartD' + spawn.room.name;
    var ExpandBeforeWar = ['E38S72'];
    if (spawn.memory.alphaSpawn) {

        if (spawn.memory.create.length === 0 && spawn.memory.warCreate.length > 0) {
            if (_.contains(ExpandBeforeWar, spawn.room.name) && spawn.memory.expandCreate.length > 0) {
                return spawn.memory.expandCreate;
            } else {
                return spawn.memory.warCreate;
            }
        }
        if (spawn.memory.create.length === 0 && spawn.memory.expandCreate.length > 0 && spawn.memory.warCreate.length === 0) {
            return spawn.memory.expandCreate;
        }

        return spawn.memory.create;
    } else {
        //        if (spawn.memory.alphaSpawnID !== undefined) {
        spawn.memory.alphaSpawnID = undefined;
        alpha = spawn.room.alphaSpawn;
        //            Game.getObjectById(spawn.memory.alphaSpawnID);

        if (alpha !== undefined) {
            if (alpha.memory.expandCreate === undefined) {
                alpha.memory.expandCreate = [];
            }
            if (alpha.memory.create !== undefined && alpha.memory.create.length === 0 && alpha.memory.warCreate !== undefined && alpha.memory.warCreate.length > 0) {
                if (_.contains(ExpandBeforeWar, alpha.room.name) && alpha.memory.expandCreate.length > 0) {
                    return alpha.memory.expandCreate;
                } else {
                    return alpha.memory.warCreate;
                }
            }

            if (alpha.memory.create !== undefined && Game.flags[rampart] === undefined && alpha.memory.create.length === 0 && alpha.memory.expandCreate.length > 0 && alpha.memory.warCreate !== undefined && alpha.memory.warCreate.length === 0) {
                return alpha.memory.expandCreate;
            }
            return alpha.memory.create;
        }
    }
}

function determineAlphaSpawn(spawn) {
    if (spawn.room.alphaSpawn !== undefined) return true;
    if (spawn.memory.alphaSpawn !== undefined) return true;

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

class SpawnInteract {


    static requestCreep(creepWanted, spawnID) {
        let spawn = Game.getObjectById(spawnID);
        if (spawn !== null) {
            //            console.log('request happening', spawn, creepWanted.build);
            spawn.memory.warCreate.push(creepWanted);
            return true;
        }
    }

    static addToExpandStack(newCreep) {
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

    static addToWarStack(newCreep) {
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

    static toTransfer(creep) {
        var around = creep.room.lookAtArea(coronateCheck(creep.pos.y - 1), coronateCheck(creep.pos.x - 1),
            coronateCheck(creep.pos.y + 1), coronateCheck(creep.pos.x + 1), true);
        var e = around.length;
        while (e--) {
            if (around[e].type == 'structure') {
                if ((around[e].structure.structureType != STRUCTURE_LINK && around[e].structure.structureType != STRUCTURE_NUKER) && around[e].structure.energy < around[e].structure.energyCapacity) {
                    if (creep.transfer(around[e].structure, RESOURCE_ENERGY) == OK) {
                        if (creep.carry[RESOURCE_ENERGY] < 51) {
                            creep.moveTo(creep.room.storage, { maxOpts: 10 });
                        }
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

        if (creep.memory.goToSpawn === undefined) {
            var targets = getTargets(creep);
            if (targets.length === 0) return false;
            let goTo = -1; //= creep.memory.roleID;
            var zz = creep.memory.roleID;
            if (creep.memory.role == 'scientist') zz++;
            if (zz) { // if(0) == false;
                do {
                    goTo++;
                    if (targets[goTo] !== undefined && targets[goTo].structureType === STRUCTURE_TOWER && targets[goTo].energy > 500) {
                        goTo++;
                    } else if (targets[goTo] !== undefined && targets[goTo].structureType === STRUCTURE_EXTENSION && targets[goTo].energy === targets[goTo].energyCapacity) {
                        goTo++;
                    }
                    if (goTo > targets.length) return false;
                } while (targets[goTo] !== undefined && targets[goTo].energy === targets[goTo].energyCapacity);
            } else {
                goTo = targets.length - 1;
                while (targets[goTo] !== undefined && targets[goTo].energy === targets[goTo].energyCapacity) {
                    goTo--;
                    if (targets[goTo] !== undefined && targets[goTo].structureType === STRUCTURE_TOWER && targets[goTo].energy > 500) {
                        goTo--;
                    } else if (targets[goTo] !== undefined && targets[goTo].structureType === STRUCTURE_EXTENSION && targets[goTo].energy === targets[goTo].energyCapacity) {
                        goTo--;
                    }
                    if (goTo < 0) {
                        return false;
                    }
                }
            }
            if (targets[goTo] !== undefined)
                creep.memory.goToSpawn = targets[goTo].id;
        }


        let fillTarget = Game.getObjectById(creep.memory.goToSpawn);

        if (fillTarget === null) {
            creep.memory.goToSpawn = undefined;
            return false;
        }
        creep.say('^^');

        if (creep.pos.isNearTo(fillTarget)) {
            let zzz = creep.transfer(fillTarget, RESOURCE_ENERGY);
            if (zzz == OK) {
                creep.memory.goToSpawn = undefined;

                if (creep.carry[RESOURCE_ENERGY] < fillTarget.energy - fillTarget.energyCapacity) {
                    creep.moveMe(creep.room.storage, { maxOpts: 100, reusePath: 1, ignoreCreeps: true });
                }


            } else if (zzz == -8) {
                creep.memory.goToSpawn = undefined;
            }
            creep.say('^' + zzz);
        } else {
            this.toTransfer(creep);
            creep.moveMe(fillTarget, {
                ignoreCreeps: true,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#fff',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
            creep.say('^');
            return true;
        }

    }

    static checkMemory(spawn) {

        determineAlphaSpawn(spawn);

        if (spawn.memory.alphaSpawn) {
            // Mode is to determine what is being built and also controller level so build.
            if (spawn.memory.buildLevel === undefined) {
                spawn.memory.buildLevel = 0;
                console.log('----------------Create buildLevel Variable----------------');
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
                spawn.memory.roadsTo = [];
                console.log('----------------Create Spawn RoadsTo ----------------');
                Game.spawns[title].memory.roadsTo.push({
                    source: 'xxxx',
                    sourcePos: new RoomPosition(5, 5, 'xxnx'),
                    miner: false,
                    transport: false,
                    expLevel: 0
                });
            }


        }
    }
    static newRenewCreep(roomName) {
        var room = Game.rooms[roomName];
        if (room === undefined) return;
        if (room.memory.renewCreep === undefined) {
            room.memory.renewCreep = [];
        }
        //console.log(room.energyAvailable,  );
        if (room.energyAvailable < room.energyCapacityAvailable >> 1) return;
        var e = room.memory.renewCreep.length;
        if (e === 0) return;
        if (room.availableSpawns.length === 0) return;
        var cpts = [];
        while (e--) {
            var crp = Game.creeps[room.memory.renewCreep[e]];
            if (crp !== undefined) {
                cpts.push(crp);
            } else {
                room.memory.renewCreep.splice(e, 1);
            }
        }
        for (e in room.availableSpawns) {
            let spwn = room.availableSpawns[e];
            if (!spwn.spawning) {
                let inRng = spwn.pos.findInRange(cpts, 1);
                if (inRng.length) {
                    let minTgt = _.min(inRng, o => o.ticksToLive);
                    if (minTgt.ticksToLive < 1300) {
                        room.availableSpawns[e].renewCreep(minTgt);
                    }
                }
            }
        }
    }
    static newWantRenew(creep) {
        if (creep.room.memory.renewCreep === undefined) {
            creep.room.memory.renewCreep = [];
        }
        creep.room.memory.renewCreep.push(creep.name);
    }

    static createFromStack(spawn) {
        if (spawn.spawning) return;
        var STACK = getStack(spawn);
        if (spawn.memory.spawnDir === undefined) {
            spawn.memory.spawnDir = 1;
        }
        if (STACK !== undefined && STACK.length > 0) {
            if (!_.isArray(STACK[0].build)) {
                console.log('clearing stak of error', STACK[0].build);
                STACK.shift();
                return;
            }
            //        if(STACK[0] === undefined) {
            //                console.log(STACK[0],'Xde',STACK.length,spawn.room.name);
            //          }
            var ee = spawn.canCreateCreep(STACK[0].build);
            //console.log("spawn, dry run", spawn.spawnCreep(STACK[0].build,build[0].name, {memory:STACK[0].memory,direction:spawn.memory.spawnDir,dryRun:true}) );
            if (STACK[0].build.length === 0 && ee === ERR_INVALID_ARGS) {
                STACK.shift();
            }
            if (ee === ERR_NOT_ENOUGH_ENERGY && getCost(STACK[0].build) > spawn.room.energyCapacityAvailable) {

                do {
                    STACK[0].build.shift();
                    console.log('><><>>>>-=-=-DOWNGRADE MODULE ENERGY', getCost(STACK[0].build), STACK[0].memory.role + STACK[0].memory.party + '-=-=-=-=<<<<><><');
                } while (getCost(STACK[0].build) > spawn.room.energyCapacityAvailable);

                //                spawn.canCreateCreep(STACK[0].build);

            } else if (ee === ERR_INVALID_ARGS && STACK[0].build.length > 50) {
                do {
                    STACK[0].build.shift();
                    console.log('><><>>>>-=-=-DOWNGRADE MODULE 50+', STACK[0].build.length, STACK[0].memory.role + STACK[0].memory.party + '-=-=-=-=<<<<><><');
                } while (STACK[0].build.length > 50);
                //spawn.canCreateCreep(STACK[0].build);

            } else if (ee == OK) {

                let ez = spawn.createCreep(STACK[0].build, STACK[0].name, STACK[0].memory);
                if (ez == -3) {
                    STACK[0].name = STACK[0].name + Math.floor(Math.random() * 9);
                    //                    console.log('ERROR NAME', STACK[0].name, 'REBUILD ATTEMPT', ez,roomLink(spawn.room.name));
                } else {
                    STACK.shift();
                }
            } else if (STACK[0].memory.role === 'linker' && ee === ERR_NOT_ENOUGH_ENERGY) {
                //                STACK[0].build = [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, ];
                //              console.log('><><>>>>-=-=-EMERGYENC MODULE ENERGY', getCost(STACK[0].build), STACK[0].memory.role + '-=-=-=-=<<<<><><');
                let zzed = spawn.room.energyAvailable;
                if (zzed < 300) zzed = 300;
                if (getCost(STACK[0].build) > zzed) {
                    do {
                        STACK[0].build.shift();
                        console.log(roomLink(spawn.room.name)+'><><>>>>-=-=-EMERGYENC MODULE ENERGY', getCost(STACK[0].build), STACK[0].memory.role + '-=-=-=-=<<<<><><');
                    } while (getCost(STACK[0].build) > zzed);

                    //spawn.canCreateCreep(STACK[0].build);
                }
            } else if (STACK[0].length === undefined && STACK[0].length === 0) {

                console.log("ERROR", spawn, spawn.pos);
                //  console.log("ERROR");
                //  console.log("ERROR");
                //
            }

        }
    }

}
module.exports = SpawnInteract;