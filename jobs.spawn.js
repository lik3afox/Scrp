var labsBuild = require('build.labs');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var containers = require('commands.toContainer');
var spawns = require('commands.toSpawn');

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
    creep.memory.currentJob = 11;
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

function labNeedReducing(creep) {
    if (creep.carryTotal === creep.carryCapacity) return false;
    if (creep.room.terminal.full) return false;
    var theplans = labsBuild.getPlans(creep.room.name);
    if (theplans === undefined) return;
    var e = theplans.length;
    while (e--) {
        let lab = Game.getObjectById(theplans[e].id);
        if (lab !== null && !theplans[e].emptied && (lab.mineralType !== null && theplans[e].resource !== lab.mineralType) && lab.room.name == creep.room.name && creep.carryTotal !== creep.carryCapacity) {
            creep.say('redo');
            //            creep.room.visual.line(creep.pos, lab.pos);
            if (creep.pos.isNearTo(lab)) {
                creep.withdraw(lab, lab.mineralType);
                return true;
            } else {
                creep.moveMe(lab.pos);
                return true;
            }
        }
        if (lab !== null && theplans[e].emptied && (lab.mineralAmount >= 1600 || (lab.mineralAmount >= 0 && lab.mineralType !== null && theplans[e].resource !== lab.mineralType)) && lab.room.name == creep.room.name && creep.carryTotal !== creep.carryCapacity) {
            creep.say('redo');
            if (creep.pos.isNearTo(lab)) {
                creep.withdraw(lab, lab.mineralType);
                return true;
            } else {
                creep.moveMe(lab.pos);
                return true;
            }
        }
    }
    return false;
}


function mineralContainerEmpty(creep) {
    //    if (creep.memory.containsGood) return false;
    if (!creep.room.memory.mineralID) return false;
    if (!creep.room.memory.mineralContainID) return false;

    if (creep.memory.mineralContainID === undefined && creep.room.memory.mineralID !== undefined) {
        var min = Game.getObjectById(creep.room.memory.mineralID);
        let contains = creep.room.find(FIND_STRUCTURES);
        if (min !== null) {
            contains = _.filter(contains, function(o) {
                return o.structureType == STRUCTURE_CONTAINER && o.pos.inRangeTo(min, 2);
            });
        }
        if (contains.length > 0) {
            creep.room.memory.mineralContainID = contains[0].id;
        }
    }

    var a;

    var targetContain = Game.getObjectById(creep.room.memory.mineralContainID);

    if (targetContain !== null) {
        if (creep.pos.isNearTo(targetContain)) {
            let res = creep.room.lookAt(targetContain.pos.x, targetContain.pos.y);
            for (let i in res) {
                if (res[i].type === 'creep' && res[i].creep.total > 200) {
                    res[i].creep.transfer(creep, res[i].creep.carrying);
                    return true;
                }
            }
            for (let e in targetContain.store) {
                creep.say('minC');
                if (targetContain.store[e] > 0) {
                    creep.withdraw(targetContain, e);
                    return true;
                }
            }
        } else {
            creep.moveMe(targetContain, { reusePath: 15 });
            return true;
        }
    }
    return false;
}

function doNewBoostLab(creep) {
    if (creep.room.memory.boost === undefined || creep.room.memory.boost.mineralType === 'none' || creep.room.memory.boost.mineralAmount === 0 || creep.room.memory.boostLabID === undefined) {
        return false;
    }
    const info = creep.room.memory.boost;
    const boostMineral = info.mineralType;
    creep.room.visual.text(info.mineralType, creep.room.boostLab.pos.x, creep.room.boostLab.pos.y, {
        color: 'FF00FF',
        stroke: '#000000 ',
        strokeWidth: 0.123,
        font: 0.5
    });

    let mineralNeed = info.resourcesNeeded.mineral;
    const energyNeed = info.resourcesNeeded.energy;
    const boostLab = creep.room.boostLab;
    const creepSpace = (creep.carryCapacity - creep.carryTotal);
    let tgt = Game.getObjectById(info.creepID);
    if(tgt === null) return;
    if (boostLab.energy < energyNeed) { // Fill ENERGY
        creep.say('LabNEne');
        if (creep.carry[RESOURCE_ENERGY] > 0) {
            creep.moveToTransfer(boostLab, RESOURCE_ENERGY);
        } else {
            creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY, undefined, { reusePath: 20 });
        }
        tgt.moveMe(creep.room.boostLab);

        return true;
    }

    if (boostLab.mineralType !== boostMineral && boostLab.mineralType && creep.carryTotal < creep.carryCapacity) { // mismatch
        creep.say('WMin');
        creep.moveToWithdraw(boostLab, boostLab.mineralType, undefined, { reusePath: 10 });
        tgt.moveMe(creep.room.boostLab);

        return true;
    }

    if (creep.carrying !== boostMineral && creep.carryTotal > 0 && creep.carryAvailable < mineralNeed) {
        creep.storeCarrying();
        tgt.moveMe(creep.room.boostLab);

        return true;
    }

    if ((!boostLab.mineralAmount || boostLab.mineralAmount < mineralNeed)) {
        creep.say('moveMin');
        if (creep.carrying !== boostMineral && creep.carryTotal > 0) {
            creep.storeCarrying();
        } else if (creep.carry[RESOURCE_ENERGY] > 0 && creep.carryTotal === creep.carry[RESOURCE_ENERGY]) {
            creep.storeCarrying();
        } else if (creep.carry[boostMineral] > 0) {
            creep.moveToTransfer(boostLab, boostMineral);
        } else {
            if (mineralNeed > creepSpace) mineralNeed = creepSpace;
            let rsult = creep.moveToWithdraw(creep.room.terminal, boostMineral, mineralNeed, { reusePath: 20 });
            //                creep.say('moveMin'+rsult);
            if (!creep.room.terminal.store[boostMineral] || creep.room.terminal.store[boostMineral] < mineralNeed) {
                if (Game.shard.name === 'shard1') {
                   let rsult =  roomRequestMineral(creep.room.name, boostMineral, mineralNeed);
                   if(!rsult){
                       if(boostMineral === 'LH' && Memory.stats.totalMinerals[boostMineral] < 180000){
                        console.log('Shifting LH from boostNeeded',tgt.memory.role);
                        tgt.memory.boostNeeded.shift();
                       }
                   }
                    if (creep.room.terminal.full) {
                        creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
                    }
                } else {
                    
                    if (tgt) {
                        tgt.memory.boostNeeded.shift();
                    }
                }
            }

        }
        return true;
    } else if(!creep.className){
//        creep.pullTargetTo(tgt,creep.room.boostLab);
        return;
    }
    return false;
}

function moveEnergyToWall(creep, wall) {
    if (!wall || !creep) return false;
    if (wall.carryTotal === wall.carryCapacity) return false;
    if (wall.carry[RESOURCE_ENERGY] < wall.carryCapacity >> 1 && !wall.memory.death) {
        if (creep.carry[RESOURCE_ENERGY] > wall.carryCapacity >> 1) {
            if (creep.pos.isNearTo(wall)) {
                creep.transfer(wall, RESOURCE_ENERGY);
            } else {
                creep.moveMe(wall, { reusePath: 30, ignoreCreeps: true, maxRooms: 1 }); //, 
            }
            creep.say('Giving');
            let zed = wall.cancelOrder('move');
            wall.memory.stopMoving = true;
        } else {
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
        }
        return true;
    }
    return false;
}

function mineralWorkerEmpty(creep) {
    if (creep.memory.harvesterID && creep.memory.harvesterID === 'none') return false;
    var harvester;
    if (creep.memory.harvesterID === undefined) {
        var harvesters = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
            return o.memory.role === 'minHarvest';
        }); // This is something is not on a rampart       
        if (harvesters.length > 0) {
            creep.memory.harvesterID = harvesters[0].id;
            harvester = harvesters[0];
        } else {
            creep.memory.harvesterID = 'none';
        }
    }
    harvester = Game.getObjectById(creep.memory.harvesterID);
    if (harvester && harvester.carryTotal > 500) {
        if (creep.pos.isNearTo(harvester)) {
            harvester.transfer(creep, harvester.carrying);
        } else {
            creep.moveMe(harvester, { reusePath: 25, ignoreCreeps: true });
        }
        return true;
    }
    return false;

}

var globalSignature;
var roomSigned;
class jobSpawns {

    static signController(creep) {
        if (1 === 1) return false;
        if (globalSignature === undefined) {
            globalSignature = "[Ypsilon Pact]: Territory Claimed by Likeafox. " + Game.time;
        }
        if (Game.shard.name !== 'shard1' && creep.room.name !== 'E1S11') return false;
        if (roomSigned === undefined) {
            roomSigned = {};
        }
        if (roomSigned[creep.room.name] !== undefined) return false;
        if (Memory.war) return false;
        if (creep.room.controller === undefined) return false;
        if (creep.room.controller.sign && creep.room.controller.sign.text === globalSignature) {
            roomSigned[creep.room.name] = true;
            return false;
        }
        creep.say('resign');
        if (creep.pos.isNearTo(creep.room.controller)) {
            creep.signController(creep.room.controller, globalSignature);
        } else {
            creep.moveMe(creep.room.controller, { reusePath: 50, maxRooms: 1 });
        }

        return true;
    }


    static makeSafeMode(creep) {
        let control = creep.room.controller;
        if (creep.className) return false;
        if (creep.carry[RESOURCE_GHODIUM] >= 1000) {
            if (creep.pos.isNearTo(control)) {
                creep.generateSafeMode(control);
                return false;
            } else {
                creep.moveMe(control, { reusePath: 20 });

            }
        } else {
            if (!creep.room.terminal.store[RESOURCE_GHODIUM] || creep.room.terminal.store[RESOURCE_GHODIUM] < 1000) {
                roomRequestMineral(creep.room.name, RESOURCE_GHODIUM, 1500);
                //return false;
            }
            if (creep.carryTotal > 0) {
                creep.moveToTransfer(creep.room.storage, creep.carrying);
            } else {
                creep.moveToWithdraw(creep.room.terminal, RESOURCE_GHODIUM, 1000);
            }
        }
        return true;
    }



    static newDoRefill(creep) {
        if (creep.memory.wallTargetID) {
            let tgt = Game.getObjectById(creep.memory.wallTargetID);
            if (tgt && moveEnergyToWall(creep, tgt)) {
                return true;
            } else {
                creep.memory.wallTargetID = undefined;
            }
        }

        let wallworkers = creep.room.memory.wallworkers;
        let targetWork = [];
        for (let ee in wallworkers) {
            let wall = Game.getObjectById(wallworkers[ee]);
            if (wall === null) {
                wallworkers[ee] = undefined;
                continue;
            } else {
                if (wall.carry[RESOURCE_ENERGY] < wall.carryCapacity >> 1) {
                    targetWork.push(wall);
                }
            }
        }
        if (targetWork.length > 0) {
            let rando = Math.floor(Math.random() * targetWork.length);
            let wall = targetWork[rando];

            if (moveEnergyToWall(creep, wall)) {
                creep.memory.wallTargetID = wall.id;
                return true;
            } else {
                creep.memory.wallTargetID = undefined;
            }
        }


        return false;
    }

    static doTower(creep) {

        if (creep.memory.towerRefillDelay !== undefined) {
            creep.memory.towerRefillDelay--;
            if (creep.memory.towerRefillDelay < 0) {
                creep.memory.towerRefillDelay = undefined;
            } else {
                return;
            }
        }
        if (creep.carry[RESOURCE_ENERGY] > 0) {
            let zz;
            if (creep.memory.towerTargetID === undefined) {
                zz = creep.room.find(FIND_STRUCTURES, { filter: o => o.energy < 900 && o.structureType == STRUCTURE_TOWER });
                if (zz.length > 0) {
                    creep.memory.towerTargetID = zz[0].id;
                } else {
                    creep.memory.towerRefillDelay = 20;
                    return false;
                }

            }
            /*            if (creep.memory.towerTargetID === undefined) {
                            var storage = creep.room.storage;
                            if (!creep.pos.isNearTo(storage)) {
                                creep.moveTo(storage);
                            } else {
                                for (var e in creep.carry) {
                                    creep.transfer(storage, e);
                                }
                            }
                            return true;
                        } */
            let target = Game.getObjectById(creep.memory.towerTargetID);
            if (target !== null) {
                creep.moveToTransfer(target, RESOURCE_ENERGY);
                if (target.energy > target.energyCapacity - 100) {
                    creep.memory.towerTargetID = undefined;
                }
            } else {
                creep.memory.towerTargetID = undefined;
            }
        } else {
            // getEnergy(creep);
            //           creep.moveToWithdraw(creep.room.terminal,RESOURCE_ENERGY);
        }
        return true;
    }

    static doPowerspawn(creep) {
        let powerspawn = creep.room.powerspawn;
        if (!powerspawn) {
            creep.memory.currentJob = undefined;
            return false;
        }
        if (powerspawn.power < 70 && !creep.carry.power && (creep.room.terminal.store[RESOURCE_POWER] !== undefined && creep.room.terminal.store[RESOURCE_POWER] > 0)) {
            creep.say('getP');
            let amt = 100 - powerspawn.power;
            if (amt > creep.room.terminal.store[RESOURCE_POWER]) {
                amt = creep.room.terminal.store[RESOURCE_POWER];
            }
            creep.moveToWithdraw(creep.room.terminal, RESOURCE_POWER, amt);
            return true;
        } else if (creep.carry.energy === 0 && powerspawn.energy < 2500) {
            creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
            creep.say('gE');
            return true;
        } else if (creep.carry[RESOURCE_POWER] > 0 && powerspawn.power < 70) {
            creep.say('PP');
            if (creep.pos.isNearTo(powerspawn)) {
                if (creep.carry[RESOURCE_POWER] > 0) {
                    creep.transfer(powerspawn, RESOURCE_POWER);
                }

            } else {
                creep.moveMe(powerspawn);
            }
            return true;

        } else if (creep.carry[RESOURCE_ENERGY] > 0 && powerspawn && powerspawn.energy < 2500) {
            creep.say('PE');
            if (creep.pos.isNearTo(powerspawn)) {
                creep.transfer(powerspawn, RESOURCE_ENERGY);
            } else {
                creep.moveMe(powerspawn, { reusePath: 30 });
            }
            return true;
        }

        return false;
    }

    static doRoomEnergy(creep) {
        if(!creep.memory.role || creep.memory.role !== 'first'){
        if (creep.room.powerLevels && creep.room.powerLevels[PWR_OPERATE_EXTENSION] && creep.room.powerLevels[PWR_OPERATE_EXTENSION].ready) {
            //            console.log('Not doing room Energy due to Extension Operate',roomLink(creep.room.name));
            return false;
        }
    }
        if (!creep.memory.deposit && creep.carryTotal > creep.carryCapacity - 5) {
            creep.memory.deposit = true;
        } else if (creep.carry.energy === 0) {

            if (creep.carryTotal !== 0 && creep.carryTotal !== creep.carry[RESOURCE_ENERGY] && !creep.className) { // This is to get rid of minerals.
                creep.storeCarrying();
                return true;
            } else {
                creep.memory.deposit = false;
            }

        }

        if (!creep.memory.deposit) {
            if (!containers.withdrawFromLink(creep, 100)) {
                if (!containers.withdrawFromStorage(creep)) {
                    if (!containers.withdrawFromTerminal(creep)) {
                        if (!constr.withdrawFromTombstone(creep)) {
                            if (!creep.moveToPickUp(FIND_DROPPED_RESOURCES, creep.memory.roleID * 40, { maxRooms: 1 })) {}
                        }
                    }
                }
            }
        } else {
            if (!spawns.moveToTransfer(creep)) {

            }
        }
        return true;
    }

    static doBoostLab(creep) {
        return doNewBoostLab(creep);

    }


    static doNuke(creep) {
        let nuke = creep.room.nuke;
        if (creep.carryTotal === 0) {
            if (nuke.ghodium < nuke.ghodiumCapacity) { //&& terminal.store[RESOURCE_GHODIUM] !== undefined
                if (creep.room.terminal.store.G === undefined || creep.room.terminal.store.G === 0) {
                    roomRequestMineral(creep.room.name, 'G', creep.room.terminal.store.G);
                }
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, 'G', creep.room.terminal.store.G);
                } else {
                    creep.moveTo(creep.room.terminal, { reusePath: 30 });
                }
            } else if (nuke.energy < nuke.energyCapacity) {
                if (!containers.withdrawFromLink(creep, 100)) {
                    if (creep.pos.isNearTo(creep.room.storage)) {
                        if (creep.withdraw(creep.room.storage, RESOURCE_ENERGY) === OK) {
                            creep.moveToTransfer(nuke, creep.carrying);
                        }
                    } else {
                        creep.moveTo(creep.room.storage, { reusePath: 30 });
                    }
                }
            }

        } else {
            if (creep.carrying === 'G' && nuke.ghodium == nuke.ghodiumCapacity) {
                creep.moveToTransfer(creep.room.terminal, creep.carrying);
            } else if (creep.carrying === RESOURCE_ENERGY && nuke.energy == nuke.energyCapacity) {
                creep.moveToTransfer(creep.room.terminal, creep.carrying);
            } else {
                creep.moveToTransfer(nuke, creep.carrying);
                // if(creep.pos.isNearTo(nuke)){
                //creep.moveTo(creep.room.storage, { reusePath: 30 });   
                //}
            }
        }
        return true;
    }

    static doMineralContainer(creep) {

        var targetContain = Game.getObjectById(creep.room.memory.mineralContainID);
        var min = Game.getObjectById(creep.room.memory.mineralID);

        if (creep.carryTotal === 0 || (creep.pos.isNearTo(targetContain) && creep.carryCapacity !== creep.carryTotal)) {
            creep.memory.emptyMin = true;
        } else if (creep.carryCapacity === creep.carryTotal) {
            creep.memory.emptyMin = false;
        } else if (creep.memory.emptyMin === undefined) {
            creep.memory.emptyMin = false;
        } else if (min.mineralAmount === 0) {
            creep.memory.emptyMin = false;
        }

        let harvester = Game.getObjectById(creep.memory.harvesterID);

        if (targetContain && harvester) {
            if (targetContain.total === 0 && harvester.carryTotal < 200) {
                creep.memory.emptyMin = false;
            }
        } else {
            creep.memory.harvesterID = undefined;
        }
        if (creep.carryTotal !== 0 && creep.carryTotal === creep.carry[RESOURCE_ENERGY]) {
            creep.memory.emptyMin = false;
        }
        if (creep.carryTotal === creep.carryCapacity) {
            creep.memory.emptyMin = false;
        }

        if (!creep.memory.emptyMin) { //|| creep.carry[RESOURCE_ENERGY] !== 0
            if (creep.room.terminal.total === 300000) {
                creep.moveToTransfer(creep.room.storage, creep.carrying, { reusePath: 25, ignoreCreeps: true });
            } else {
                creep.moveToTransfer(creep.room.terminal, creep.carrying, { reusePath: 25, ignoreCreeps: true });
            }
            creep.say('!');
        } else {
            if (!mineralWorkerEmpty(creep)) {
                creep.say('min');
                if (!mineralContainerEmpty(creep)) {

                }
            } else {
                creep.say('wrk');
            }
            //            creep.say('!!');

        }
        return true;
    }

    static doNewLabs(creep) {
        if (creep.room.boostLab === undefined) {
            creep.room.memory.labsNeedWork = false;
            return false;
        }
        if (!creep.room.memory.labsNeedWork) return false;
        var _labs = labsBuild.getLabs(creep.room.name);
        if (creep.memory.labJob === undefined) {
            if (creep.carryTotal === 0) {
                if (creep.pos.inRangeTo(creep.room.terminal, 3)) {
                    creep.memory.labJob = 'Filling';
                } else {
                    creep.memory.labJob = 'Emptying';
                }
            } else if (creep.carryTotal === carryCapacity) {
                creep.memory.labJob = 'Deposit';
            }

            if (creep.room.memory.lab2Mode === 'none' && creep.room.memory.labsNeedWork) {
                creep.memory.labJob = 'Emptying';
            }

            if (creep.carrying === RESOURCE_ENERGY) {
                creep.memory.labJob = 'Deposit';
            }
        }



        switch (creep.memory.labJob) {
            case 'Filling':
                if (creep.memory.deposit === undefined) {
                    creep.memory.deposit = false;
                } else if (creep.carryTotal === 0) {
                    creep.memory.deposit = false;
                } else if (creep.carryTotal === creep.carryCapacity) {
                    creep.memory.deposit = true;
                }

                if (!creep.memory.deposit) {
                    //                    creep.moveToWithdraw(creep.room.terminal,); //mineral needed
                } else {
                    //                  creep.moveToTransfer(lab,creep.carrying); // Lab needed
                }

                break;
            case 'Emptying':
                break;
            case 'Deposit':
                break;
            case 'Emptying':
                break;
            case 'Deposit':
                break;
            default:
                return false;
        }
        // Filling - Labs 0 and 1

        // Emptying - labs 2-9

        // Replacing labs 0 and 1

        // You are always starting next to terminal - due to Spawning?
        //  Filling Labs 
        // Empty and next to labs - 
        //  then lets empty labs.

        // If you are not empty - then do your thing


    }

    static balanceTS(creep) {


        if (creep.carryTotal === 0) {
            creep.memory.empty = true;
        } else if (creep.carryTotal === creep.carryCapacity) {
            creep.memory.empty = false;
        } else if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
            creep.memory.empty = false;
        }

        var storage = creep.room.storage;
        var terminal = creep.room.terminal;
        let max = 5000;
        if (Game.shard.name !== 'shard1') {
            max = 4500;
        }
        if (creep.room.name !== creep.memory.home) {
            return true;
        }
        if (!creep.memory.empty && creep.carryTotal === creep.carry.ops && creep.carry.ops < 100) {
            creep.memory.empty = true;
        }


        if (creep.memory.empty) {
            if (containers.withdrawFromLink(creep, 200)) {
                creep.memory.empty = false;
                return true;
            }
            //if (creep.room.energyIn) {
            if (constr.withdrawFromTS(creep, 10)) {
                creep.say('rmtombstone');
                return true;
            }
            /*
            if (creep.room.powerspawn && creep.room.powerspawn.isEffected()) {
                if (creep.room.powerspawn.power < 30) {
                    if (creep.room.storage && creep.room.storage.store[RESOURCE_POWER] > 0) {
                        let amtn = 100 - creep.room.powerspawn.power;
                        creep.moveToWithdraw(creep.room.storage, RESOURCE_POWER, amtn);
                        creep.say('!pwrS!');
                        return true;
                    } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_POWER] > 0) {
                        let amtn = 100 - creep.room.powerspawn.power;
                        creep.moveToWithdraw(creep.room.terminal, RESOURCE_POWER, amtn);
                        creep.say('!pwrT!');
                        return true;
                    }

                    if (Memory.stats.totalMinerals.power > 500 && (!creep.room.terminal.store[RESOURCE_POWER] || creep.room.terminal.store[RESOURCE_POWER] < 100)) {
                        if (!roomRequestMineral(creep.room.name, RESOURCE_POWER, 5000)) {

                        }
                    }
                }

                if (creep.room.powerspawn && creep.room.powerspawn.power > 0 && creep.room.powerspawn.energy < 3400 ) {
                    if(creep.room.storage.store[RESOURCE_ENERGY] > 11600){
                        creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                        creep.say('!pwrES!');                        
                    }
                    return true;
                }
            } */


            if (creep.room.controller.level > 5 && storage && terminal && !storage.nearFull && !terminal.nearFull) { //  && creep.carryTotal === 0 
                let i = RESOURCES_ALL.length;
                while (i--) { // 43 total -2 * 5000 = 205000 = 95,000 left, energy should be capped at 750000
                    let min = RESOURCES_ALL[i];
                    if (min === RESOURCE_ENERGY) {
                        max = terminalEnergyLimit;
                    } else {
                        max = 5000;
                        if (Game.shard.name !== 'shard1') {
                            max = 4500;
                        }

                    }
                    if ((terminal.store[min] === undefined || terminal.store[min] < max) && storage.store[min] > 0 && !terminal.full) {
                        creep.say('5000stor');
                        let minAmount = terminal.store[min];
                        if (minAmount === undefined) minAmount = 0;
                        let amount = max - minAmount; // 50000
                        if (creep.carryTotal > 0) {
                            amount -= creep.carryTotal;
                        }
                        if (amount > creep.carryAvailable) {
                            amount = creep.carryAvailable;
                        }
                        //terminal needs it form storage : E59S34 XGHO2 1600 8028 -8
                        creep.moveToWithdraw(storage, min, amount);
                        creep.say(max);
                        //                  if (Game.shard.name === 'shard0')


                        return true;

                    } else if (terminal.store[min] > max) {
                        if (min === RESOURCE_ENERGY && creep.room.memory.energyIn) continue;
                        if (min === RESOURCE_ENERGY && !creep.room.memory.energyIn && creep.room.storage.nearFull) continue;

                        let amount = terminal.store[min] - max;
                        creep.say(amount + ' 5Kt:' + min);
                        if (!storage.full) {
                            if (creep.pos.isNearTo(terminal)) {
                                if (amount > (creep.carryCapacity - creep.carryTotal)) {
                                    amount = (creep.carryCapacity - creep.carryTotal);
                                }
                                creep.withdraw(terminal, min, amount);
                            } else {
                                creep.moveMe(terminal);
                            }

                            return true;

                        } else if (storage.full) {
                            // Storage has too much and needs to transfer this out of this room.

                           // _terminal_().sendMineralFromTerminal(terminal, min);
                        }
                    }

                }
            }
            if (creep.room.terminal && (creep.room.terminal.nearFull || (creep.room.terminal.total > (295000 + creep.carryCapacity) && creep.room.terminal.store[RESOURCE_ENERGY] < 10000)) && !creep.room.storage.nearFull) {
                for (let i in creep.room.terminal.store) {
                    if (creep.room.terminal.store[i] > 4500) {
                        let amount = creep.room.terminal.store[i] - 4500;

                        if (amount > 0) {
                            if (amount > creep.carryCapacity - creep.carryTotal) {
                                amount = creep.carryCapacity - creep.carryTotal;
                            }
                            creep.moveToWithdraw(creep.room.terminal, i, amount);
                            break;
                        }
                    }
                }
                creep.say('2MuchT');
                return true;
            } else if (creep.room.storage && creep.room.storage.nearFull && !creep.room.terminal.nearFull) {
                if (creep.room.storage.store[RESOURCE_ENERGY] > 70000) {
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                    creep.say('2MuchS');
                    return true;
                } else {
                    for (let ee in creep.room.terminal.store) {
                        if (creep.room.storage.store[ee] > 0 && ee !== RESOURCE_ENERGY) { //
                            creep.moveToWithdraw(creep.room.storage, ee);
                            creep.say('2MuchS');
                            return true;
                        }
                    }
                }
            }
            /*else if (creep.room.storage.store[RESOURCE_ENERGY] === 0){
                       creep.moveToWithdraw(creep.room.storage, creep.room.storage.storing);
                       creep.say('NoESt');
                   } */

            if (creep.room.terminal !== undefined && creep.room.storage !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000 && creep.room.terminal.nearFull && creep.memory.roleID === 0) {
                for (let i in creep.room.terminal.store) {
                    if (i !== RESOURCE_ENERGY && i !== RESOURCE_POWER) {
                        creep.moveToWithdraw(creep.room.terminal, i);
                        break;
                    }
                }

                creep.say('bT');
                return true;
            }

            if (creep.room.terminal !== undefined && creep.room.storage !== undefined && !creep.room.storage.nearFull && creep.room.terminal.store[RESOURCE_ENERGY] > 75000) {
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    let amount = creep.room.terminal.store[RESOURCE_ENERGY] - 75000;

                    if (amount > creep.carryCapacity) {
                        amount = creep.carryCapacity;
                    }

                    creep.withdraw(creep.room.terminal, RESOURCE_ENERGY, amount);
                    creep.memory.empty = false;
                } else {
                    creep.moveTo(creep.room.terminal, { reusePath: 20 });
                }
                creep.say('bS');
                return true;
            }
            if (creep.room.powerspawn && creep.room.powerspawn.power < 10) {
                if (creep.room.storage && creep.room.storage.store[RESOURCE_POWER] > 0) {
                    let amtn = 100 - creep.room.powerspawn.power;
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_POWER, amtn);
                    creep.say('pwrS');
                    return true;
                } else if (creep.room.terminal && creep.room.terminal.store[RESOURCE_POWER] > 0) {
                    let amtn = 100 - creep.room.powerspawn.power;
                    creep.moveToWithdraw(creep.room.terminal, RESOURCE_POWER, amtn);
                    creep.say('pwrT');
                    return true;
                }

                if (Memory.stats.totalMinerals.power > 500 && (!creep.room.terminal.store[RESOURCE_POWER] || creep.room.terminal.store[RESOURCE_POWER] < 100)) {
                    if (!roomRequestMineral(creep.room.name, RESOURCE_POWER, 100)) {

                    }
                }
            }
            if (linkPickUpMineral(creep) === OK) {
                return true;
            }
            if (creep.room.powerspawn && creep.room.powerspawn.power > 0 && creep.room.powerspawn.energy < 3400 && creep.room.storage.store[RESOURCE_ENERGY] > 11600) {
                creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                return true;
            }
            if (creep.carryTotal > 0) creep.memory.empty = false;
            creep.say('?');
            if (!creep.pos.inRangeTo(creep.room.storage, 5)) creep.moveMe(creep.room.storage, { reusePath: 15 });
            return false;



        } else {
            let e = creep.carrying;
            if (creep.room.terminal === undefined && creep.room.storage === undefined) {
                tgt = Game.flags[creep.room.name];
                if (tgt !== undefined) {
                    if (creep.pos.isNearTo(tgt)) {
                        creep.drop(creep.carrying);
                    } else {
                        creep.moveMe(tgt);
                    }

                    return true;
                }
            }

            var tgt;
            switch (e) {
                case "energy":
                    if (creep.room.powerspawn && creep.room.powerspawn.isEffected() && creep.room.powerspawn.energy < 1000) {
                        tgt = creep.room.powerspawn;
                    } else
                    if (!creep.room.terminal) {
                        tgt = creep.room.storage;
                    } else if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] < 10000 && !creep.room.storage.almostFull) {
                        tgt = creep.room.storage;
                    } else
                    if (creep.room.powerspawn && creep.room.powerspawn.energy < 3600 && creep.room.powerspawn.power > 0) {
                        creep.say('Pspawn');
                        tgt = creep.room.powerspawn;
                    } else if (creep.room.storage.nearFull && !creep.room.terminal.nearFull) {
                        creep.say('TT');
                        tgt = creep.room.terminal;
                    } else
                    if (creep.room.terminal.nearFull && !creep.room.storage.nearFull) {
                        creep.say('SS');
                        tgt = creep.room.storage;
                    } else if (creep.room.storage.nearFull && !creep.room.terminal.full) {
                        creep.say('S>tt');
                        tgt = creep.room.terminal;
                    } else if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < terminalEnergyLimit && creep.room.terminal.total < 291000) {
                        creep.say('<');
                        tgt = creep.room.terminal;
                    }
                    /* else if (creep.room.storage.full) {
                                        creep.say('eterm');
                                        tgt = creep.room.terminal;
                                    }*/
                    else if (creep.room.boostLab && creep.room.boostLab.energy < 2000) {
                        creep.say('labE');
                        tgt = creep.room.boostLab;
                    } else if(creep.room.storage.total < creep.room.storage.carryCapacity-creep.carryCapacity && creep.room.terminal.nearFull) {
                        creep.say('eStor');
                        tgt = creep.room.terminal;
                    } else {
                        creep.say('eStor');
                        tgt = creep.room.storage;
                        creep.room.memory.energyGood = true;
                    }

                    break;
                case "power":
                    if (creep.room.powerspawn && (!creep.room.powerspawn.power || creep.room.powerspawn.power < 90)) {
                        tgt = creep.room.powerspawn;
                    } else {
                        tgt = creep.room.terminal;
                        if (tgt.store[RESOURCE_POWER] >= max) {
                            tgt = creep.room.storage;
                        } else if (tgt.full) {
                            tgt = creep.room.storage;
                        }
                    }
                    break;
                default:
                    if (Game.shard.name === 'shard2' && creep.room.name === 'E29S48') {
                        tgt = creep.room.terminal;
                    } else if (storage && storage.full) {
                        creep.say('MTT');
                        tgt = creep.room.terminal;
                    } else
                    if (terminal && (terminal.store[creep.carrying] === undefined || terminal.store[creep.carrying] < max) && !terminal.full) {
                        // If terminal has less than max, then 
                        // move to terminal.
                        creep.say('MTT');
                        tgt = creep.room.terminal;
                    } else {
                        creep.say('MSS');
                        tgt = creep.room.storage;
                    }


                    break;
            }

            if (tgt !== undefined) {

                let rst = creep.moveToTransfer(tgt, creep.carrying, { reusePath: 20, maxRooms: 1 });
                //            creep.say(tgt.structureType + "2@");
                if (rst !== OK) {

                    //creep.drop(creep.carrying);
                    creep.memory.empty = true;
                }
                return true;
                //            creep.say('D' + + tgt.structureType);
            }

            return false;

        }

    }


    static doLabs(creep) {

        var total = creep.carryTotal;
        if (total === 0) {
            creep.memory.putaway = false;
        } else {
            creep.memory.putaway = true;
        }
        if (creep.room.memory.labMode === 'shift' && creep.room.memory.labsNeedWork && creep.room.memory.lab2Mode === 'none') {
            creep.room.memory.labsNeedWork = false;
            return;
        }

        var _labs = labsBuild.getLabs(creep.room.name);
        if (creep.room.memory.lab2Mode === 'none' && creep.room.memory.labsNeedWork) {
            if (creep.carryTotal > 0 && creep.saying !== 'NoneCear') {
                creep.moveToTransfer(creep.room.terminal, creep.carrying);
            } else if (creep.carryTotal !== creep.carryCapacity) {
                let i = _labs.length;
                while (i--) { // go through them
                    if ((_labs[i].mineralAmount > 0) && _labs[i].id !== creep.room.memory.boostLabID) {

                        if (creep.pos.isNearTo(_labs[i])) {
                            if (creep.withdraw(_labs[i], _labs[i].mineralType) == OK) {
                                creep.memory.putaway = true;
                            }
                        } else {
                            creep.moveMe(_labs[i], { ignoreCreeps: true, reusePath: 15 });
                        }
                        return true;
                    }
                }

            }
            return true;
        }

        if (creep.memory.putaway) {
            if (!labsBuild.moveToTransfer(creep)) {

                if (creep.room.terminal && creep.room.terminal.nearFull && !creep.room.storage.full) {

                    containers.moveToStorage(creep);

                } else {
                    creep.say('term');
                    //roleParent.containers.moveToTerminal(creep);
                    creep.moveToTransfer(creep.room.terminal, creep.carrying);
                }
                return true;
            }
        } else {
            if (!labNeedReducing(creep)) {
                if (!labsBuild.getFromTerminal(creep)) {
                    let otherThings = false;
                    if (!otherThings) {
                        creep.say('<3', true);
                        creep.room.memory.labsNeedWork = false;
                    }

                }
            }
        }
        return true;
    }
}

module.exports = jobSpawns;