var classLevels = [
    [CARRY, CARRY, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],
    [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
    ],

    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
];

var roleParent = require('role.parent');
var job = require('jobs.spawn');
const POWERSPAWN = 1;
const BOOSTLAB = 2;
const MINERAL = 3;
const ROOMENERGY = 4;
const LABWORK = 5;
const FILLWALL = 6;
const MASTERLINK = 7;
const BALANCE = 8;
const FILLNUKE = 9;
const MAKESAFEMODE = 10;
const PICKUPDROPPED = 11;
const TOMBSTONE = 13;
const SLEEP = 14;
const TERMINALREDUCE = 15;
const TOWERFILL = 16;

var alwaysJob = [BOOSTLAB]; // This should take over jobs if available.
var shouldJob = [ROOMENERGY, MINERAL, LABWORK, FILLWALL, FILLNUKE, TOMBSTONE, TERMINALREDUCE, PICKUPDROPPED]; // This should be analyzed to see if job need to be done. MASTERLINK //PICKUPDROPPED
var noJob = [MAKESAFEMODE, BALANCE, SLEEP]; // This is what is done if nothing else.
var jobList;

function doFillTower(powercrp) {
    let zz;
    let target = Game.getObjectById(powercrp.memory.towerTargetID);
    if (powercrp.memory.towerTargetID === undefined || !target || target && target.energy === 1000) {
        zz = powercrp.room.find(FIND_STRUCTURES, { filter: o => o.energy < 900 && o.structureType == STRUCTURE_TOWER });
        if (zz.length > 0) {
            powercrp.memory.towerTargetID = zz[0].id;
        } else {
            return false;
        }

    }
    if (powercrp.carry[RESOURCE_ENERGY] > 0) {
        powercrp.moveToTransfer(target, RESOURCE_ENERGY);
    } else {
        // getEnergy(creep);
        powercrp.moveToWithdraw(powercrp.room.storage, RESOURCE_ENERGY);
    }
    return true;
}


function pickUpTombstone(creep) {
    let close = Game.getObjectById(creep.memory.tombstoneID);
    if (!close || close.total === 0) {
        var zed = creep.room.tombstone;
        if (zed.length === 0) {
            creep.memory.tombstoneID = undefined;
            return false;
        }
        creep.memory.tombstoneID = zed[0].id;
        close = zed[0];
    }
    creep.say('TBS');
    if (creep.memory.isFull === undefined) {
        if (creep.carryTotal > 0) {
            creep.memory.isFull = true;
        } else {
            creep.memory.isFull = false;
        }
    }
    if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.isFull = true;
    } else if (creep.carryTotal === 0) {
        creep.memory.isFull = false;
    }

    if (!creep.memory.isFull) {
        if (creep.pos.isNearTo(close)) {
            for (let i in close.store) {
                if (close.store[i] > 0) {
                    let edd = creep.withdraw(close, i);

                    return edd;
                }
            }
        } else {
            return creep.moveMe(close, { maxRooms: 1, reusePath: 20 });
        }
    } else {

        return creep.storeCarrying();
    }
}


function pickUpEverything(creep) {
    let close = Game.getObjectById(creep.memory.pickUpId);

    if (close === null && creep.memory.pickUpId === undefined) {
        var zed = creep.room.dropped;
        zed = _.filter(zed, function(o) {

            if (o.resourceType === RESOURCE_ENERGY) {
                return o.amount > 100;
            } else {
                return true;
            }

        });

        if (zed.length === 0) {
            creep.memory.pickUpId = undefined;
            creep.memory.isFull = true;
            //            return false;
        } else {
            close = creep.pos.findClosestByRange(zed);
            creep.memory.pickUpId = close.id;
        }

    } else if (close === null) {
        creep.memory.currentJob = undefined;
        creep.memory.pickUpId = undefined;
        return;
    }
    if (creep.memory.isFull === undefined) {
        if (creep.carryTotal > 0) {
            creep.memory.isFull = true;
        } else {
            creep.memory.isFull = false;
        }
    }
    if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.isFull = true;
    } else if (creep.carryTotal === 0) {
        creep.memory.isFull = false;
    }
    if (close == null) {
        creep.memory.currentJob = undefined;
    }
    creep.say('D/Mins');


    if (!creep.memory.isFull && close) {
        if (creep.pos.isNearTo(close)) {
            return creep.pickup(close);
        } else {
            return creep.moveMe(close, { maxRooms: 1, reusePath: 20, ignoreCreeps: true });
        }
    } else {
        return creep.storeCarrying();
    }
}

function linkPickUpMineral(creep) {
    let close = Game.getObjectById(creep.memory.pickUpId);
    if (!close) {
        var zed = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                return object.resourceType !== RESOURCE_ENERGY;
            }
        });
        if (zed.length === 0) {
            creep.memory.pickUpId = undefined;
            return false;
        }
        close = _.max(zed, o => o.amount);
        creep.memory.pickUpId = close.id;
    }
    creep.memory.currentJob = PICKUPDROPPED;
    if (creep.carryTotal === 0) {
        if (creep.pos.isNearTo(close)) {
            return creep.pickup(close);
        } else {
            return creep.moveMe(close, { maxRooms: 1, reusePath: 20 });
        }
    } else {
        return creep.moveToTransfer(creep.room.storage, creep.carrying, { maxRooms: 1 });
    }
}

function linkTerminalStorageBalance(creep) {

    return job.balanceTS(creep);
}



/*function howIsPowerSpawn(room) {
    if (Game.shard.name !== 'shard1') return false;
    if (!Memory.empireSettings.processPower) return false;
    if (room.powerspawn === undefined) {
        return false;
    }
    let powerspawn = room.powerspawn;
    if (powerspawn.power >= 10 && powerspawn.energy > 50) return false;
    if (Memory.stats.totalMinerals.power < 500 && (room.terminal.store[RESOURCE_POWER] === undefined || room.terminal.store[RESOURCE_POWER] === 0)) {
        return false;
    }
    if(room.name === 'E39S51'){
        console.log(room.terminal.store[RESOURCE_POWER],"powerd");
    }
    
    if (room.terminal.store[RESOURCE_POWER] === undefined) {
        if (!roomRequestMineral(room.name, RESOURCE_POWER)) {
            //            return false;
        }
    }
    return true;
}*/


function howIsBoost(room) {
    if (room.memory.boost === undefined || room.memory.boost.mineralType === 'none' || room.memory.boost.mineralAmount === 0 || room.memory.boostLabID === undefined) {
        return false;
    }
    if (room.boostLab === undefined) {
        return false;
    }
    const info = room.memory.boost;

    if (!info) {
        return false;
    }
    if (!info.resourcesNeeded) {
        return false;
    }
    return true;
}

function howIsMinerals(room) {
    var targetContain = Game.getObjectById(room.memory.mineralContainID);
    var min = Game.getObjectById(room.memory.mineralID);
    if (targetContain === null || min === null || targetContain.total < 500) {
        return false;
    }
    return true;
}

function howIsWallWork(room) {
    if (room.memory.wallworkers === undefined) return false;
    if (room.memory.wallworkers.length === 0) return false;
    if (room.memory.focusWall === true) return false;
    let wallworkers = room.memory.wallworkers;
    for (let ee in wallworkers) {
        let wall = Game.getObjectById(wallworkers[ee]);
        if (wall === null) {
            wallworkers[ee] = undefined;
            continue;
        } else if(wall.room.name === wall.memory.home && wall.carry[RESOURCE_ENERGY] < wall.carryCapacity >> 1) {
            return true;
        }
    }
    return false;
}

function howIsNuke(room) {
    let nuke = room.nuke;
    if (nuke === undefined || nuke === null) return false;
    if (nuke.ghodium == nuke.ghodiumCapacity && nuke.energy == nuke.energyCapacity) return false;
    if (room.energyAvailable < room.energyCapacityAvailable) return false;
    if (room.storage.store[RESOURCE_ENERGY] < 100000) return false;
    return true;
}

function droppedStuff(creep) {

}
/*
const alwaysJob = []; // This should take over jobs if available.
const shouldJob = [, , , , , , PICKUPDROPPED, PICKUPMINERAL, ]; // This should be analyzed to see if job need to be done. MASTERLINK
const noJob = [, , SLEEP]; // This is what is done if nothing else.
*/
function shouldDoJob(job, room) {
    //    let room = creep.room;


    switch (job) {
        case MAKESAFEMODE:
            return (room.controller && room.controller.level === 8 && room.controller.safeModeAvailable <= 8);
        case FILLNUKE:
            return howIsNuke(room);
        case LABWORK:
            //            if(room.terminal.full && room.storage.full) return false;
            return (room.memory.labsNeedWork === true);
        case FILLWALL:
            return howIsWallWork(room);
            //        case POWERSPAWN:
            //          return howIsPowerSpawn(room);
        case MASTERLINK:
            if (room.storage.full && room.terminal.full) return false;
            return (room.masterLink !== undefined && room.masterLink.energy > 0);
        case ROOMENERGY:
            if (room.powerLevels && room.powerLevels[PWR_OPERATE_EXTENSION] && room.powerLevels[PWR_OPERATE_EXTENSION].ready) {
                return false;
            }
            return (room.energyAvailable < room.energyCapacityAvailable);
        case BOOSTLAB:
            return howIsBoost(room);
        case MINERAL:
            return howIsMinerals(room);
        case PICKUPDROPPED:
            if (room.storage.nearFull && room.terminal.nearFull) return false;

            return room.dropped.length !== 0;
            //      case TERMINALREDUCE:
            //          if (room.storage.full && room.terminal.full) return true;
        case TOMBSTONE:
            if (room.storage.full && room.terminal.full) return false;
            return room.tombstone.length !== 0;
        default:
            return false;
    }
}

function fullTerminal(creep) {
    if (creep.room.terminal && (creep.room.terminal.total > 290000 && creep.room.terminal.store[RESOURCE_ENERGY] < 20000)) {
        //        if (creep.room.terminal && creep.room.terminal.store[RESOURCE_ENERGY] < 10000) {
        console.log('FullTerminal W/ No energy', creep.room.name, Game.time);
        if (creep.carryTotal === 0) {
            if (creep.room.terminal.nearFull) {
                let res = ['L', 'O', 'U', 'Z', 'X'];
                for (let i in res) {
                    let amnt = 500;
                    if (creep.room.terminal.store[res[i]] >= amnt) {
                        creep.moveToWithdraw(creep.room.terminal, res[i], amnt);
                        return true;
                    }
                }
            }
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
        } else if (creep.carrying === RESOURCE_ENERGY) {
            creep.moveToTransfer(creep.room.terminal, RESOURCE_ENERGY);
        } else if (creep.carrying !== RESOURCE_ENERGY) {
            creep.drop(creep.carrying);
        }
        creep.say('FTERM');
        return true;

    }
    return false;
}

function doJob(creep) {
    if (creep.memory.roleID === 0 && fullTerminal(creep)) {
        return;
    }

    if (creep.memory.currentJob === MAKESAFEMODE && creep.className) {
        creep.memory.currentJob = undefined;
    }


    switch (creep.memory.currentJob) {
        case TOMBSTONE:
            pickUpTombstone(creep);
            break;
        case TOWERFILL:
            doFillTower(creep);
            break;


        case PICKUPDROPPED:
            pickUpEverything(creep);
            break;
        case MAKESAFEMODE:
            if (creep.className) {
                creep.memory.currentJob = undefined;
                break;
            }
            job.makeSafeMode(creep);
            break;
        case FILLNUKE:
            job.doNuke(creep);
            break;
        case LABWORK:
            //            creep.say(creep.memory.currentJob, true);
            job.doLabs(creep);
            break;
        case FILLWALL:
            job.newDoRefill(creep);
            break;
            //        case POWERSPAWN:
            //          job.doPowerspawn(creep);
            // Powerspawn has been transfered to job balancing.
            //            break;
        case MASTERLINK:
            if (creep.carryTotal === 0) {
                creep.say('!$ER');
                if (creep.pos.isNearTo(creep.room.masterLink)) {
                    if (creep.withdraw(creep.room.masterLink, RESOURCE_ENERGY) === OK) {

                    }
                } else {
                    creep.moveMe(creep.room.masterLink);
                }

            } else {
                creep.moveToTransfer(creep.room.storage, creep.carrying);
            }
            break;
        case ROOMENERGY:

            job.doRoomEnergy(creep);
            break;
        case BOOSTLAB:
            job.doBoostLab(creep);
            break;
        case MINERAL:
            job.doMineralContainer(creep);
            break;
        default:
            /*
                        if (creep.room.memory.powerCreep && creep.memory.maxLinkers !== 0) {
                                if (!creep.className) {
                                    if (!linkTerminalStorageBalance(creep)) {
                                    creep.sleep(1);
                                    }
                                }else {
                
                                }
                        }*/
            if (creep.memory.roleID === 0) {
                if (!linkTerminalStorageBalance(creep)) {
                    creep.sleep(1);
                }
            } else if (!creep.className) {
                if (creep.room.masterLink && creep.room.masterLink.energy > 0) {
                    creep.say('lnk');
                    if (creep.carryTotal === creep.carryCapacity) {
                        creep.moveToTransfer(creep.room.storage, creep.carrying);
                    } else {
                        //creep.memory.currentJob = MASTERLINK;
                        creep.moveToWithdraw(creep.room.masterLink, RESOURCE_ENERGY);
                    }
                    //                creep.moveToWithdraw(creep.room.masterLink, RESOURCE_ENERGY);
                } else if (creep.room.powerspawn && creep.room.powerspawn.power < 10) {
                    if (creep.carry.power > 0) {
                        creep.moveToTransfer(creep.room.powerspawn, RESOURCE_POWER);
                    } else {
                        creep.moveToWithdraw(creep.room.terminal, RESOURCE_POWER, 100 - creep.room.powerspawn.power);
                    }
                } else {
                    creep.say('sleepy');
                    creep.sleep(3);
                }
            } else {

                if (creep.pos.isNearTo(creep.room.controller)) {
                    creep.memory.sleep = 3;
                } else {
                    creep.moveMe(creep.room.controller, { reusePath: 20 });
                }
            }
            break;
    }
    if (creep.memory.currentJob !== undefined) {
        if (!shouldDoJob(creep.memory.currentJob, creep.room)) {
            creep.memory.currentJob = undefined;
        }
    }

}

var roomAssignments;

function duplicateJob(creep, job) {
    let assign = roomAssignments[creep.room.name];
    if (creep.room.controller.isPowerEnabled) {
        if (!creep.className) {
            if (creep.memory.roleID === 0) {
                if (job === FILLWALL) return true;
                if (creep.room.name !== 'E21S49' && job === PICKUPDROPPED) return true;
                if (creep.room.name !== 'E21S49' && job === TOMBSTONE) return true;
                if (job === MINERAL) return true;
                if (creep.room.name === 'E23S38' && job === ROOMENERGY) return true;
            }
        } else {
            if (job === MAKESAFEMODE) return true;
            if (creep.room.name !== 'E21S49' && job === TOMBSTONE) return true;
        }
        for (let i in assign) {
            if (i !== creep.memory.roleID) {
                if (job === assign[i]) {
                    return true;
                }
            }
        }
        return false;
    }


    // Things that role == 0 does not do:
    if (creep.memory.roleID === 0 && job === FILLWALL) {
        return true;
    }
    if (creep.memory.roleID === 0 && job === PICKUPDROPPED && creep.room.memory.maxLinkers !== 1) {
        return true;
    }
    if (creep.memory.roleID === 0 && job === MINERAL && creep.room.memory.maxLinkers > 0 ) {
        return true;
    }
    if (creep.memory.roleID === 0 && job === ROOMENERGY && creep.room.controller.level !== 8) {
        return true;
    }
    if (creep.memory.roleID === 0 && job === TOMBSTONE && creep.room.memory.maxLinkers > 1) {
        return true;
    }
    if (creep.room.controller.level < 6 && creep.room.energyAvailable === creep.room.energyCapacity) {
        if (job === PICKUPDROPPED) {
            return false;
        }
    }


    for (let i in assign) {
        if (creep.room.memory.maxLinkers > 1 && creep.memory.roleID === 0) {
            if (assign[i] === ROOMENERGY) {
                if (creep.room.memory.currentJobWorkers && creep.room.memory.currentJobWorkers === 1) {
                    return false;
                }
            }
        } else {

        }

        if (assign[i] === ROOMENERGY) return false;

        if (assign[i] === BOOSTLAB && creep.memory.roleID !== 0) return true;
        if (i !== creep.memory.roleID) {
            if (job === assign[i]) {
                return true;
            }
        }
    }
    return false;
}

function checkRoomJobs(roomName) {
    let room = Game.rooms[RoomName];

    if ((Game.time % 100 === 0 || room.memory.jobsToDo.length === 0) && (room.memory.jobGameTime === undefined || room.memory.jobGameTime !== Game.time)) {
        //if(creep.memory.roleID === 0) 
        room.visual.text("Chking", 25, 25, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT });

        if (Game.time % 100 === 0) creep.room.memory.jobsToDo = [];
        let toDo = room.memory.jobsToDo;
        let jobs = alwaysJob;
        for (let i in jobs) {
            if (shouldDoJob(jobs[i], room)) {
                toDo.push(jobs[i]);
            }
        }
        jobs = shouldJob;
        for (let i in jobs) {
            if (shouldDoJob(jobs[i], room)) {
                toDo.push(jobs[i]);
            }
        }
        jobs = noJob;
        for (let i in jobs) {
            if (shouldDoJob(jobs[i], room)) {
                toDo.push(jobs[i]);
            }
        }
        room.memory.jobGameTime = Game.time;
    }
}

class roleJober extends roleParent {

    static checkJobs(roomName) {
        checkRoomJobs(roomName);
    }

    static levels(level) {
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle(classLevels[level].body);
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
        //      if(creep.memory.roleID > 2) creep.memory.death = true;
        if (!creep.room.memory.powerCreep && creep.className) {
            creep.room.memory.powerCreep = true;
        }


        if (creep.ticksToLive < 10) {
            if (creep.carryTotal > 0) {
                creep.storeCarrying();
            }
            return;
        }
        let max = creep.room.memory.maxLinkers;
        if (creep.className) creep.memory.death = undefined;
        if (creep.memory.roleID > max - 1 && creep.memory.roleID !== 0 && !creep.className) {
            creep.memory.death = true;
            //console.log(roomLink(creep.room.name),"wants death",creep.room.memory.maxLinkers,creep.memory.roleID);
        }
        if (creep.memory.roleID === 0 && max === 0) {
            creep.memory.death = true;
        }
        if (this.spawnRecycle(creep)) return true;
        if (roomAssignments === undefined) {
            roomAssignments = {};
        }
        if (roomAssignments[creep.room.name] === undefined) {
            roomAssignments[creep.room.name] = {};
        }

        if (creep.memory.roleID === 0 && creep.ticksToLive <= 144) {
            super.rebirth(creep);
        }

        if (!creep.isHome && !creep.className && creep.memory.job !== FILLWALL) {
            creep.moveMe(Game.flags[creep.memory.home], { reusePath: 50 });
            return;
        }
        if (!creep.room.controller && creep.className && creep.room.name !== creep.flag.pos.roomName) {
            creep.moveMe(creep.flag);
            return;
        }
        if (!creep.room.memory.jobsToDo) creep.room.memory.jobsToDo = [];
        if (creep.room.controller.level < 6) {
            if (creep.memory.roleID > 0) {
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
                    creep.memory.currentJob = ROOMENERGY;
                } else if (creep.room.dropped.length > 0) {
                    creep.memory.currentJob = PICKUPDROPPED;
                }
            } else {
                creep.memory.currentJob = undefined;
            }
        } else

        if (creep.memory.currentJob === undefined) {

            if ((Game.time % 100 === 0 || creep.room.memory.jobsToDo.length === 0) && (creep.room.memory.jobGameTime === undefined || creep.room.memory.jobGameTime !== Game.time)) {
                //if(creep.memory.roleID === 0) 
                creep.room.visual.text("Chking", 25, 25, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT });

                if (Game.time % 100 === 0) creep.room.memory.jobsToDo = [];
                let toDo = creep.room.memory.jobsToDo;
                let jobs = alwaysJob;
                for (let i in jobs) {
                    if (shouldDoJob(jobs[i], creep.room)) {
                        toDo.push(jobs[i]);
                    }
                }
                jobs = shouldJob;
                for (let i in jobs) {
                    if (shouldDoJob(jobs[i], creep.room)) {
                        toDo.push(jobs[i]);
                    }
                }
                jobs = noJob;
                for (let i in jobs) {
                    if (shouldDoJob(jobs[i], creep.room)) {
                        toDo.push(jobs[i]);
                    }
                }
                creep.room.memory.jobGameTime = Game.time;
            }

            if (creep.room.memory.jobsToDo.length > 0) {
                let job = creep.room.memory.jobsToDo.shift();
                if (!duplicateJob(creep, job)) {
                    creep.memory.currentJob = job;
                }
            }
            //}
        }
        //if (creep.memory.roleID === 0) {
        creep.room.visual.text(creep.room.memory.jobsToDo, 25, 26, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT });
        //}
        if (creep.memory.roleID === 0) {
            let aa = 0;
            /*            for (let i in roomAssignments[creep.room.name]) {
                            creep.room.visual.text(i + ":" + roomAssignments[creep.room.name][i], 10, 25 + aa, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                            aa++;
                        }
                                    if (creep.memory.currentJob === POWERSPAWN) {
                if (creep.carry[RESOURCE_POWER] === undefined && creep.room.terminal.store[RESOURCE_POWER] === undefined) {
                    creep.memory.currentJob = undefined;
                }
            }*/
            if (!creep.room.storage) console.log(roomLink(creep.room.name), "job in room w/ no storage");
            if (Game.shard.name === 'shard3') {
                if (creep.memory.currentJob === undefined) {
                    let zed = Game.getObjectById(creep.room.memory.mineralContainID);
                    if (zed && zed.store.H >= creep.carryCapacity) {
                        creep.moveToWithdraw(zed, 'H');
                        return;
                    }
                }
            }
            if (creep.room.memory.energyIn) {
                if (creep.room.storage.nearFull && creep.room.storage.store[RESOURCE_ENERGY] > 90000) {
                    if (!creep.room.terminal.store[RESOURCE_POWER] && !creep.room.storage.store[RESOURCE_POWER] && (!creep.room.powerspawn || creep.room.powerspawn && creep.room.powerspawn.power === 0)) {
                        require('commands.toSpawn').setModuleRole(creep.room.name, 'upgrader', 1, 7);
                    }
                    //                    require('commands.toSpawn').setModuleRole(creep.room.name, 'wallwork', 2, 5);
                }
            } else {
                if (creep.room.storage && creep.room.storage.full && !creep.room.storage.store[RESOURCE_POWER] && !creep.room.terminal.store[RESOURCE_POWER]) { // || creep.room.terminal && creep.room.terminal.full
                    require('commands.toSpawn').setModuleRole(creep.room.name, 'upgrader', 1, 7);
                    console.log(creep.room.storage.full, !creep.room.storage[RESOURCE_POWER], !creep.room.terminal[RESOURCE_POWER], "ROom added upgrader Whydf?",roomLink(creep.room.name));
                }
            }
            creep.room.visual.text('0', creep.pos);
            if (creep.room.controller.level === 8 && creep.memory.currentJob !== ROOMENERGY && creep.room.energyAvailable < 3000) {
                creep.memory.currentJob = ROOMENERGY;
            } else if (creep.memory.currentJob === ROOMENERGY && creep.room.energyAvailable > 6000 && creep.room.memory.maxLinkers > 1) {
                creep.memory.currentJob = undefined;
            } else if (creep.room.memory.maxLinkers === 1 && creep.memory.currentJob !== MINERAL && creep.room.energyAvailable > 3000 && creep.carryTotal === 0) {
                var targetContain = Game.getObjectById(creep.room.memory.mineralContainID);
                if (targetContain && targetContain.total > 1000) {
                    creep.memory.currentJob = MINERAL;
                }

            }
            let jobs = alwaysJob;
            for (let i in jobs) {
                if (shouldDoJob(jobs[i], creep.room)) {
                    creep.memory.currentJob = jobs[i];
                    if (creep.className && creep.memory.currentJob === MAKESAFEMODE) {
                        creep.memory.currentJob = undefined;
                    }

                }
            }

        }
        doJob(creep);
        //  if (creep.memory.currentJob) creep.say(creep.memory.currentJob, true);

        roomAssignments[creep.room.name][creep.memory.roleID] = creep.memory.currentJob;
        if (creep.memory.roleID === 0) {
            creep.room.memory.zeroJob = creep.name;
            let aa = 0;
            for (let i in roomAssignments[creep.room.name]) {
                creep.room.visual.text(i + ":" + roomAssignments[creep.room.name][i], 10, 25 + aa, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                aa++;
            }
        }
    }
}

module.exports = roleJober;