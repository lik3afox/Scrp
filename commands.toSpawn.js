var roomCache = {};
var visPath = {
    fill: 'transparent',
    stroke: '#fff',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};

function getTargets(creep) {

    if (creep.ticksToLive === 1499 || creep.room.memory.spawnTargets === undefined) {
        // Once a creeps life we will get the room.
        let zzz;

        zzz = creep.room.find(FIND_MY_STRUCTURES);
        zzz = _.filter(zzz, function(structure) {
            return (structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_SPAWN ||
                structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_LAB ||
                structure.structureType == STRUCTURE_POWER_SPAWN
            );
        });

        creep.room.memory.spawnTargets = [];
        var a = zzz.length;
        while (a--) {
            creep.room.memory.spawnTargets.push(zzz[a].id);
        }
        return zzz;

    }


    //  if (roomCache[creep.room.name] === undefined) {
    let zzz = [];
    var e = creep.room.memory.spawnTargets.length;
    while (e--) {
        let target = Game.getObjectById(creep.room.memory.spawnTargets[e]);
        if (target !== null) {
            zzz.push(target);
        }
    }
    roomCache[creep.room.name] = zzz;
    //        console.log('Room isn"t cached',creep.room.name,roomCache[creep.room.name].length);

    return zzz;
    //    } else {
    //        return roomCache[creep.room.name];
    //    }

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

function waitForAllSpawn(roomName) {
    var spwns = _.filter(spwns, function(o) {
        return o.room.name === roomName && o.spawning === null;
    });
    //    console.log(spwns);

}

function getStack(spawn) {
    // Here we return the stack that is wanted 
    //    console.log('getting stack',spawn.memory.currentStack)
    //    console.log(spawn.memory.create.length,spawn.memory.warCreate.length,spawn.memory.expandCreate );
    var rampart = 'rampartD' + spawn.room.name;
    if (spawn.memory.alphaSpawn) {

        spawn.memory.currentStack = 'create';
        //    console.log(spawn.memory.create.length , spawn.memory.expandCreate.length);
        if (spawn.memory.create.length === 0 && spawn.memory.warCreate.length > 0) {
            spawn.memory.currentStack = 'war';
        }
        //        if (Game.flags[rampart] === undefined && spawn.memory.create.length === 0 && spawn.memory.expandCreate.length > 0 && spawn.memory.warCreate.length === 0) {
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
                if (alpha.memory.create !== undefined && alpha.memory.create.length === 0 && alpha.memory.warCreate !== undefined && alpha.memory.warCreate.length > 0) {
                    alpha.memory.currentStack = 'war';
                }

                if (alpha.memory.create !== undefined && Game.flags[rampart] === undefined && alpha.memory.create.length === 0 && alpha.memory.expandCreate.length > 0 && alpha.memory.warCreate !== undefined && alpha.memory.warCreate.length === 0) {
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
    var targets = creep.pos.findInRange(FIND_STRUCTURES, 1);
    targets = _.filter(targets,
        function(structure) {
            return (structure.structureType == STRUCTURE_TOWER ||
                structure.structureType == STRUCTURE_EXTENSION ||
                structure.structureType == STRUCTURE_LAB ||
                structure.structureType == STRUCTURE_POWER_SPAWN ||
                structure.structureType == STRUCTURE_SPAWN
            ) && structure.energy < structure.energyCapacity;
        });
    var i = targets.length;
    while (i--) {
        creep.transfer(targets[i], RESOURCE_ENERGY);
        return true;
    }
    return false;
}

function determineAlphaSpawn(spawn) {
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
    constructor() {}


    static requestCreep(creepWanted, spawnID) {
        let spawn = Game.getObjectById(spawnID);
        if (spawn !== null) {
            console.log('request happening', spawn, creepWanted.build);
            spawn.memory.warCreate.push(creepWanted);
            return true;
        }
    }

    static addToWarStack(newCreep) {
        //        console.log("WARSTACK", newCreep.room);
        // for now it will only created at homeEmpire.
        for (var i in Game.spawns) {
            if (Game.spawns[i].memory.alphaSpawn && Game.spawns[i].room.name == newCreep.room) {
                newCreep.memory.home = Game.spawns[i].room.name;
                newCreep.memory.parent = Game.spawns[i].id;
                if (Game.spawns[i].memory.warCreate !== undefined) {
                    if (newCreep.memory.role === 'rampartGuard') {
                        Game.spawns[i].memory.warCreate.unshift(newCreep);
                    }
                    Game.spawns[i].memory.warCreate.push(newCreep);
                }

                //                                console.log(Game.spawns[i], 'adding to stack', Game.spawns[i].name, creep);
            }

        }

    }

    static toTransfer(creep) {
        let yy = creep.pos.y - 1 < 0 ? 0 : creep.pos.y - 1;
        let yy2 = creep.pos.y + 1;
        let xx = creep.pos.x - 1;
        let xx2 = creep.pos.x + 1;
        if (xx < 0) xx = 0;
        if (yy2 > 49) yy2 = 49;
        if (xx2 > 49) xx2 = 49;
        var around = creep.room.lookAtArea(yy, xx, yy2, xx2, true);
        //  console.log(around.length);
        var e = around.length;
        while (e--) {
            if (around[e].type == 'structure') {
                //          console.log(around[e].structure.energy , around[e].structure.energyCapacity);
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

        var targets = getTargets(creep);
        if (creep.memory.goToSpawn === undefined) {
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
            creep.memory.goToSpawn = goTo;
        }
        creep.say(creep.memory.goToSpawn + '!!!' + targets.length);

        var goTo = creep.memory.goToSpawn;


        if (targets[goTo] === undefined) {
            creep.memory.goToSpawn = undefined;
            return false;
        }
        creep.say('^^');

        if (creep.pos.isNearTo(targets[goTo])) {
            let zzz = creep.transfer(targets[goTo], RESOURCE_ENERGY);
            if (zzz == OK) {
                creep.memory.goToSpawn = undefined;

                if (creep.carry[RESOURCE_ENERGY] < targets[goTo].energy - targets[goTo].energyCapacity) creep.moveTo(creep.room.storage, { maxOpts: 100, reusePath: 1 });

                if (creep.memory.roleID === 0) {
                    goTo++;
                } else {
                    goTo--;
                }

                if (targets[goTo] !== undefined && targets[goTo].energy !== targets[goTo].energyCapacity) {
                    if (!creep.pos.isNearTo(targets[goTo]))
                        creep.moveTo(targets[goTo], { maxOpts: 100, reusePath: 1 });
                    return true;
                }
                roomCache[creep.room.name] = undefined;
            } else if (zzz == -8) {
                roomCache[creep.room.name] = undefined;
                creep.memory.goToSpawn = undefined;
            }
            creep.say('^' + zzz);
        } else {
            this.toTransfer(creep);
            creep.moveTo(targets[goTo], {
                visualizePathStyle: visPath
            });
            creep.say('^');
            return true;
        }

    }

    static checkMemory(spawn) {

        determineAlphaSpawn(spawn);

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
            if (spawn.memory.created === undefined) {
                spawn.memory.created = 0;
                console.log('----------------Create Spawn Created Count----------------');
            }
            if (spawn.memory.wantRenew === undefined) {
                spawn.memory.wantRenew = [];
                console.log('----------------Create Spawn wantRenew----------------');
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


        }
    }

    static renewCreep(spawn) {
        /*        if (spawn.memory.autoRenew) {
                    let zz = spawn.pos.findInRange(FIND_CREEPS, 1);
                    zz = _.filter(zz, function(object) {
                        return (object !== null && object.memory !== undefined && object !== undefined && !object.memory.reportDeath &&
                            object.memory.role != 'scientist' && object.ticksToLive < 1300);
                    });
                    if (zz.length === 0) return false;
                    let creep = zz[0];
                    spawn.renewCreep(creep);
                    return;
                } */


        if (spawn.memory.wantRenew === undefined) return false;
        if (spawn.memory.wantRenew.length === 0) return false;
        //        if(spawn.room.name == 'E14S38' && spawn.room.controller.level < 6) return false;
        if (spawn.memory.renewEnergyLevel !== undefined) {
            if (spawn.room.energyAvailable < spawn.memory.renewEnergyLevel) {
                return false;
            }
        }

        let temp = 1500;
        let renewTarget;
        var e = spawn.memory.wantRenew.length;
        while (e--) {
            let creepID = spawn.memory.wantRenew[e];
            let creepTarget = Game.getObjectById(creepID);

            if (creepTarget === null) {
                spawn.memory.wantRenew.splice(e, 1);
            } else if (creepTarget.ticksToLive < temp && creepTarget.pos.isNearTo(spawn)) {
                //              console.log( creepTarget.memory.role ,spawn.room.controller.level );
                if (spawn.room.name === 'E14S38') {

                    if (spawn.room.controller.level > 5) {

                        renewTarget = creepTarget;
                        temp = creepTarget.ticksToLive;
                    } else if (creepTarget.memory.role == 'linker') {
                        renewTarget = creepTarget;
                        temp = creepTarget.ticksToLive;
                    }
                } else {
                    renewTarget = creepTarget;
                    temp = creepTarget.ticksToLive;
                }
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
        if (spawn === null) return;
        let zz = spawn.memory.wantRenew;
        var e = zz.length;
        while (e--) {
            if (zz[e] == creep.id) {
                //                console.log(e, zz[e], "removecreep");
                zz.splice(e, 1);
                break;
            }
        }

    }

    static createFromStack(spawn) {
        var STACK = getStack(spawn);

        if (STACK !== undefined && STACK.length > 0) {
            // Creation here.
            if (spawn.canCreateCreep(STACK[0].build) == OK) {

                spawn.memory.CreatedMsg = STACK[0].memory.role;
                let ez = spawn.createCreep(STACK[0].build, STACK[0].name, STACK[0].memory);

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

                console.log("ERROR", spawn, spawn.pos);
                console.log("ERROR");
                console.log("ERROR");
                //STACK.shift();

            }

        }
    }

}
module.exports = SpawnInteract;