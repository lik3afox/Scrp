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

var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var terminal = require('build.terminal');

function clearTerminal(creep) {
    let tgt = creep.room.terminal;
    if (creep.pos.isNearTo(tgt)) {
        for (var e in tgt.store) {
            creep.withdraw(tgt, e);
            return true;
        }
    } else {
        creep.moveTo(tgt);
        return true;
    }

    return false;
}

function isItTier3(creep) {
    if (creep.room.controller === undefined || creep.room.controller.level < 8) return false;
    if (Game.shard.name !== 'shard1') return false;
    //    var tier3 = ['XLHO2', 'XUH2O', 'XGHO2', 'XZHO2', 'XZH2O', 'XKHO2'];
    var tier3 = ['XLHO2', 'XLH2O', 'XUH2O', 'XUHO2', 'XGHO2', 'XZHO2', 'XZH2O', 'XKHO2', 'XKH2O'];
    //if(creep.carrying.length !== 5) return false;

    var xStored = terminal.getStored();
    for (var ee in tier3) {
        if (creep.carry[tier3[ee]] !== undefined && (xStored[tier3[ee]].amount > creep.room.storage.store[tier3[ee]] || creep.room.storage.store[tier3[ee]] === undefined)) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                let zz = creep.transfer(creep.room.storage, tier3[ee]);
            } else {
                creep.moveTo(creep.room.storage);
            }

            return true;
        }
    }
    return false;
}

function manageStorageMinerals(creep) {
    if (Game.shard.name !== 'shard1') return;
    if (creep.carryTotal === creep.carryCapacity) return false;

    var storaged = ['XLHO2', 'XLH2O', 'XUH2O', 'XUHO2', 'XGHO2', 'XZHO2', 'XZH2O', 'XKHO2', 'XKH2O'];
    for (var i in creep.room.storage.store) {
        if (!_.contains(storaged, i) && creep.room.storage.store[i] > 0 && i !== RESOURCE_ENERGY) {
            //            console.log(i, !_.contains(storaged, i), creep.room.storage.store[i], creep.room.name);
            creep.moveToWithdraw(creep.room.storage, i);
            return;
        }
    }

    var xStored = terminal.getStored();
    for (var e in xStored) {
        if (creep.room.storage.store[e] === undefined && creep.room.terminal.store[e] !== undefined) {
            if (creep.room.terminal.store[e] > 0) {
                //                console.log('1Linker thinks:', creep.room.storage.store[e], ":storage,", xStored[e].amount, ":term", creep.room.terminal.store[e], e);
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, e);
                } else {
                    creep.moveTo(creep.room.terminal);
                }
                return true;
            }
        }

        if (creep.room.storage.store[e] < xStored[e].amount && creep.room.terminal.store[e] !== undefined) {
            if (creep.room.terminal.store[e] > 0) {
                var taken = xStored[e].amount - creep.room.storage.store[e];
                if (taken > creep.carryCapacity) taken = creep.carryCapacity;
                if (taken > creep.room.terminal.store[e]) taken = creep.room.terminal.store[e];
                if (creep.room.terminal.store[e] > 0) {
                    if (creep.pos.isNearTo(creep.room.terminal)) {
                        let zz = creep.withdraw(creep.room.terminal, e, taken);

                    } else {
                        creep.moveTo(creep.room.terminal);
                    }
                }
            }
            return true;
        } else if (creep.carryTotal === 0 && creep.room.storage.store[e] !== undefined && creep.room.storage.store[e] > xStored[e].amount) {
            var amount = creep.room.storage.store[e] - xStored[e].amount;
            if (amount > creep.carryCapacity) amount = creep.carryCapacity;
            if (creep.pos.isNearTo(creep.room.storage)) {
                var result = creep.withdraw(creep.room.storage, e, amount);

            } else {
                creep.moveTo(creep.room.storage);
            }
            return true;
        }
    }
    return false;
}



function linkTerminalStorageBalance(creep) {
    //    console.log(creep.pos.roomName, 'doing simple');
    if (creep.carryTotal === 0) {
        creep.memory.empty = true;
    } else if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.empty = false;
    } else if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
        creep.memory.empty = false;
    }
    creep.say("trfn" + creep.memory.empty);
    if (creep.memory.empty) {


        creep.pickUpEnergy();

        let cc = Game.getObjectById(creep.room.memory.masterLinkID);
        if (cc !== null && cc.energy > 200 && creep.memory.roleID === 0) {
            if (creep.pos.isNearTo(cc)) {
                creep.withdraw(cc, RESOURCE_ENERGY);
            } else {
                creep.moveTo(cc);
            }
            creep.say('Link');
            creep.memory.empty = false;
            return;
        }
        if (creep.room.memory.simple && creep.memory.roleID !== 0 && creep.moveToPickUp(FIND_DROPPED_RESOURCES, 100) === OK) {
            creep.say('drp');
            return;
        }
        // This will empty terminal if not mine while storage is. 
        if (creep.memory.roleID >= 1 && creep.room.controller !== undefined && creep.room.controller.level <= 5 && creep.room.terminal !== undefined) {
            for (var e in creep.room.terminal.store) {
                if (creep.room.terminal.store[e] > 0 && e !== RESOURCE_ENERGY) {
                    creep.moveToWithdraw(creep.room.terminal, e);
                    break;
                }
            }
            creep.say('emTerm');
            return;
        }
        if (creep.room.memory.simple && roleParent.constr.withdrawFromTombstone(creep)) {
            creep.say('tomb');
            return;
        }
        // Remove all minerals from storage.
        //        if(creep.room.name == 'E38S72')
        //        console.log('creep.room.terminal.full',);
        if (Game.shard.name !== 'shard1') {
            //creep.room.memory.simple &&
            if (creep.room.controller !== undefined && creep.room.controller.level >= 6 && creep.room.storage.store[RESOURCE_ENERGY] !== creep.room.storage.total && creep.room.terminal !== undefined && !creep.room.terminal.full) {
                if (creep.pos.isNearTo(creep.room.storage)) {
                    for (let zz in creep.room.storage.store) {
                        if (zz !== RESOURCE_ENERGY) {
                            creep.withdraw(creep.room.storage, zz);
                            creep.say('mBal');
                        }
                    }
                } else {
                    creep.moveTo(creep.room.storage);
                }
                return;
            }
        } else {
            if (creep.room.controller.level === 8 && manageStorageMinerals(creep)) {
                creep.say('M');
                return;
            }

        }
        // Balancing
        if (creep.room.controller !== undefined && creep.room.controller.level >= 6 && !creep.room.storage.full && creep.room.storage.store[RESOURCE_ENERGY] < storageEnergyLimit && creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > (21000 + creep.stats('carry'))) {
            if (creep.pos.isNearTo(creep.room.terminal)) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            } else {
                creep.moveTo(creep.room.terminal);
            }
            creep.say('Balance');
            return;
        }
        var zent = 100;
        if (creep.room.controller.level < 8) zent = 0;
        if (creep.room.memory.simple && creep.room.energyAvailable < creep.room.energyCapacityAvailable - zent) {
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
            creep.say('fis');
        } else {
            creep.memory.empty = false;
            //            creep.sleep(3);
        }

    } else {
        if (Game.shard.name === 'shard1' && isItTier3(creep)) {
            creep.say('t3');
            return;
        }
        if (creep.carryTotal === 0) {
            creep.sleep(3);
            return;
        }
        if (creep.saying === 'mBal') {
            creep.moveToTransfer(creep.room.terminal, creep.carrying);
            return;
        }

        if (creep.room.memory.simple && creep.memory.roleID === 0 && creep.room.energyAvailable < (creep.room.energyCapacityAvailable - 100) && creep.carry[RESOURCE_ENERGY] == creep.carryTotal && !creep.memory.pickUpId && job.doRoomEnergy(creep)) {
            creep.say('fill');
            return;
        }
        if (creep.room.memory.simple && creep.room.controller !== undefined && creep.room.controller.level < 4) {
            if (creep.pos.isEqualTo(Game.flags[creep.memory.home])) {
                creep.drop(creep.carrying);
            } else {
                creep.moveMe(Game.flags[creep.memory.home], { reusePath: 10 });
            }
            creep.say('drop');
            return;
        }

        let e = creep.carrying;
        var tgt;
        switch (e) {
            case "energy":
                if (creep.room.terminal !== undefined && creep.room.storage !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000 && creep.room.storage.store[RESOURCE_ENERGY] > 100000) {
                    creep.say('eTerm');
                    tgt = creep.room.terminal;
                } else if (creep.room.powerspawn !== undefined && creep.room.powerspawn.energy < 3000) {
                    tgt = creep.room.powerspawn;
                } else if (creep.room.storage !== undefined && creep.room.storage.store[RESOURCE_ENERGY] < storageEnergyLimit) {
                    creep.say('<');
                    tgt = creep.room.storage;
                } else {
                    creep.say('eStor');
                    tgt = creep.room.terminal;
                }

                break;
            case "power":
                if (creep.room.powerspawn !== undefined && creep.room.powerspawn.power < 100)
                    tgt = creep.room.powerspawn;
                break;
            default:
                if (creep.room.terminal !== undefined) {
                    creep.say('termUn');
                    tgt = creep.room.terminal;
                } else {
                    creep.say('defaultStor');
                    tgt = creep.room.storage;
                }
                break;
        }

        if (creep.room.terminal === undefined) {
            //      creep.say('termUn');
            tgt = creep.room.storage;
        } else if (creep.room.terminal.total === 300000) {
            //        creep.say('term300K');
            tgt = creep.room.storage;
        } else if (creep.room.storage === undefined || creep.room.storage.total === 1000000) {
            //          creep.say('stor1m');
            tgt = creep.room.terminal;
        } else if (creep.room.storage.store[RESOURCE_ENERGY] < 10000) {
            tgt = creep.room.storage;
        } else if (creep.room.terminal.store[RESOURCE_ENERGY] < 5000) {
            tgt = creep.room.terminal;
        }
        if (tgt !== undefined) {
            creep.moveToTransfer(tgt, e, { reusePath: 20, maxRooms: 1 });
            //            creep.say('D' + + tgt.structureType);
        }

        return;

    }

}



function emptyTerminal(creeo, room, mineral) {
    if (creep.room.name === room) {
        if (creep.carryTotal > 0) {
            creep.drop(creep.carrying);
        } else {

            creep.moveToWithdraw(creep.room.terminal, mineral);
        }
        return;
    }
}

var jobList;

class roleLinker extends roleParent {

    static levels(level) {
        if (level == 10) {
            return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
        } else if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle(classLevels[level].body);
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {

        // control progress
        if (creep.room.controller !== undefined && creep.room.controller.level != 8 && creep.memory.roleID === 0) {
            creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
        }
        if (creep.room.storage !== undefined) {

            if (creep.room.memory.simple) {
                creep.room.visual.text("S", creep.room.storage.pos.x, creep.room.storage.pos.y, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
            } else {
                creep.room.visual.text("X", creep.room.storage.pos.x, creep.room.storage.pos.y, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
            }
        }
        let workers = 0;
        if (jobList === undefined) jobList = {};
        if (jobList[creep.memory.home] === undefined) jobList[creep.memory.home] = {};
        let aa = 0;
        if (creep.memory.roleID === 0) {
            for (var a in jobList[creep.memory.home]) {
                if (Game.creeps[jobList[creep.memory.home][a]] === undefined) {
                    jobList[creep.memory.home] = {};
                } else {
                    creep.room.visual.text(a + ":" + jobList[creep.memory.home][a], 10, 25 + aa, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                }
                aa++;
            }
        }

        jobList[creep.memory.home][creep.memory.roleID] = creep.name;
        workers = Object.keys(jobList[creep.memory.home]).length;

        switch (creep.memory.roleID) {
            case 0:

                if (workers === 1) {
                    if (job.doBoostLab(creep)) {
                        break;
                    }
                    if (job.doRoomEnergy(creep)) {
                        return;
                    }
                    if (job.doRefill(creep)) {
                        return;
                    }
                    if (job.doPowerspawn(creep)) {
                        break;
                    }
                    if (creep.room.memory.simple && job.doMineralContainer(creep)) {
                        creep.say('GMin');
                        return;
                    }

                    linkTerminalStorageBalance(creep);
                    break;
                }
                if (job.doBoostLab(creep)) {
                    break;
                }
                if (creep.room.memory.simple && creep.room.energyAvailable === creep.room.energyCapacityAvailable && creep.room.memory.labsNeedWork) {
                    job.doLabs(creep);
                    creep.say('Labs');
                    break;
                }
                if (job.doPowerspawn(creep)) {
                    break;
                }
                if (creep.room.memory.simple && job.doRefill(creep)) {
                    return;
                }
                if (creep.room.memory.simple && job.doMineralContainer(creep)) {
                    creep.say('GMin');
                    return;
                }
                linkTerminalStorageBalance(creep);

                break;
            case 1:
                if (workers === 2) {
                    if (job.doRoomEnergy(creep)) {
                        return;
                    }
                    if (job.doLabs(creep)) {
                        return;
                    }

                    if (!creep.room.memory.labsNeedWork && this.depositNonEnergy(creep)) {
                        return;
                    }
                    if (job.doMineralContainer(creep)) {
                        return;
                    }
                    if (roleParent.constr.withdrawFromTombstone(creep)) {
                        return;
                    }
                    break;
                }

                if (!creep.room.memory.labsNeedWork && this.depositNonEnergy(creep)) {
                    return;
                }
                if (job.doMineralContainer(creep)) {
                    return;
                }
                if (roleParent.constr.withdrawFromTombstone(creep)) {
                    return;
                }
                if (creep.room.energyAvailable < creep.room.energyCapacityAvailable && job.doRoomEnergy(creep)) {
                    return;
                }
                if (job.doLabs(creep)) {
                    return;
                }
                if ((creep.room.memory.simple === undefined || !creep.room.memory.simple) && job.doRefill(creep)) {
                    return;
                }
                if (job.doNuke(creep)) {
                    return;
                }

                if (creep.carryTotal !== creep.carryCapacity) {
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                } else {
                    creep.sleep(3);
                }

                break;
            default:
                if (job.doRoomEnergy(creep)) {
                    return;
                }
                if (creep.carryTotal !== creep.carryCapacity) {
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                } else {
                    creep.sleep(3);
                }
                break;
        }
        //        if (workers !== undefined) creep.say(workers);
    }
}

module.exports = roleLinker;