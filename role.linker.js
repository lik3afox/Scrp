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
let roomLevel;

var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var terminal = require('build.terminal');

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
        } else if (creep.room.terminal.store[e] === undefined || creep.room.terminal.store[e] < 1) {
            if (!_terminal_().requestMineral(creep.room.name, e)) {
                return false;
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

function linkPickUpEnergy(creep) {
    if (creep.memory.pickUpId === undefined) {
        close = _.max(creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                //                    console.log(object.pos, object.pos.roomName, Game.flags[object.pos.roomName],object.pos.isEqualTo( Game.flags[object.pos.roomName] ) );
                return object.amount > 0 && object.pos.isEqualTo(Game.flags[object.pos.roomName]) === false;
            }
        }), o => o.amount);
        if (close === undefined) return false;
    } else {
        close = Game.getObjectById(creep.memory.pickUpId);
    }

    if (close === null || close === undefined) {
        creep.memory.pickUpId = undefined;
        return false;
    }
    if (creep.carryTotal === 0) {
        if (creep.pos.isNearTo(close)) {
            return creep.pickup(close);
        } else {
            return creep.moveMe(close);
        }
    } else if (roomLevel < 7) {
        return creep.moveToTransfer(creep.room.storage, creep.carrying);
    }
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
    if (creep.memory.empty) {
        //        creep.pickUpEnergy();
        let cc = Game.getObjectById(creep.room.memory.masterLinkID);
        if (cc !== null && cc.energy >= 200 && creep.memory.roleID === 0) {
            if (creep.pos.isNearTo(cc)) {
                creep.withdraw(cc, RESOURCE_ENERGY);
            } else {
                creep.moveTo(cc);
            }
            creep.say('Link');
            creep.memory.empty = false;
            return;
        }
        if (Game.shard.name !== 'shard1') {
            if (creep.room.controller !== undefined && roomLevel >= 6 && creep.room.storage.store[RESOURCE_ENERGY] !== creep.room.storage.total && creep.room.terminal !== undefined && creep.room.terminal.total < 280000) {
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
            if (roomLevel === 8 && manageStorageMinerals(creep)) {
                creep.say('M');
                return;
            }

        }
        // Balancing
        if (roomLevel >= 6 && !creep.room.storage.full && creep.room.storage.store[RESOURCE_ENERGY] < storageEnergyLimit && creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > (21000 + creep.stats('carry'))) {
            if (creep.pos.isNearTo(creep.room.terminal)) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            } else {
                creep.moveTo(creep.room.terminal);
            }
            creep.say('Balance');
            return;
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

        if (creep.room.controller !== undefined && roomLevel < 4) {
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



function emptyTerminal(creep, room, mineral) {

    if (creep.room.name === room) {
        if (creep.room.terminal.store.X === undefined) return false;
        if (creep.carryTotal > 0) {
            if (creep.room.storage.total !== 300000) {
                creep.moveToTransfer(creep.room.storage, creep.carrying);
            } else {
                creep.drop(creep.carrying);
            }
        } else {

            creep.moveToWithdraw(creep.room.terminal, mineral);
        }
        return true;
    }
    return false;
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
        if(creep.room.controller === undefined) {
            roomLevel = 0;
        } else {
            roomLevel = creep.room.controller.level;
        }

        // control progress
        if (roomLevel != 8 && creep.memory.roleID === 0) {
            creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
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


if(creep.room.storage !== undefined &&  creep.room.terminal !== undefined &&( creep.room.terminal.store.energy < 1000 || creep.room.storage.store.energy < 1000 )){
    _terminal_().requestMineral(creep.room.name, RESOURCE_ENERGY);
}
        if(creep.body.length <= 6) console.log('Creep <6 body@',roomLink(creep.room.name));
        if (creep.room.controller !== undefined && roomLevel > 4)
            creep.pickUpEverything();

        switch (creep.memory.roleID) {
            case 0:
                if (workers === 2 && creep.room.name === 'E38S81') {
                    linkTerminalStorageBalance(creep); // 2nd variable means it grabs energy to fill.
                    creep.say('mlink');
                    return;
                } else
                if (workers === 1 || creep.room.controller !== undefined && roomLevel < 5) { // If alone then it does everything. 
                    if (job.doBoostLab(creep)) {
                        //                        creep.say('bLabs');
                        break;
                    }
                    if (job.doPowerspawn(creep)) {
                        creep.say('pspwn');
                        break;
                    }
                    if (job.doRoomEnergy(creep)) {
                        creep.say('engy');
                        return;
                    }
                    if (creep.room.energyAvailable === creep.room.energyCapacityAvailable && creep.room.memory.labsNeedWork) {
                        job.doLabs(creep);
                        creep.say('Labs');
                        break;
                    }
                    if (job.doMineralContainer(creep)) {
                        creep.say('mContain');
                        return;
                    }
                    if (job.doRefill(creep)) {
                        creep.say('refil');
                        return;
                    }
                    if (creep.room.controller !== undefined && roomLevel > 3 && roleParent.constr.withdrawFromTombstone(creep)) {
                        creep.say('mtombstone');
                        return;
                    }
                    if (creep.room.controller !== undefined && linkPickUpEnergy(creep) === OK) {
                        creep.say('drp');
                        return;
                    }

                    linkTerminalStorageBalance(creep); // 2nd variable means it grabs energy to fill.
                    //                        creep.say('mlink');
                    return;
                } else {
                    if (job.doBoostLab(creep)) {
                        break;
                    }
                    if (job.doPowerspawn(creep)) {
                        break;
                    }
                    if (workers === 2 && creep.room.energyAvailable < creep.room.energyCapacityAvailable >> 1) {
                        if (job.doRoomEnergy(creep)) {
                            return;
                        }
                    } else if(workers === 2 &&  creep.room.energyAvailable !== creep.room.energyCapacityAvailable ) {
                    if (job.doMineralContainer(creep)) {
                        creep.say('doMin'+creep.memory.empty);
                        return;
                    }
                    }
                    if (roomLevel > 3 && roleParent.constr.withdrawFromTombstone(creep)) {
                        creep.say('mtombstone');
                        return;
                    }

                    linkTerminalStorageBalance(creep);
                    return;
                }
                break;

            case 1:
                if (workers === 2) {

                    if (job.doRoomEnergy(creep)) {
                        creep.say('engy');
                        return;
                    }
                    if (job.doLabs(creep)) {
                        creep.say('labs');
                        return;
                    }
                    if (!creep.room.memory.labsNeedWork && this.depositNonEnergy(creep)) {
                        creep.say('dpst');
                        return;
                    }
                    if (job.doMineralContainer(creep)) {
                        creep.say('doMin');
                        return;
                    }
                    if (job.doRefill(creep)) {
                        creep.say('refil');
                        return;
                    }
                    if (roomLevel > 3 && roleParent.constr.withdrawFromTombstone(creep)) {
                        creep.say('tomb');
                        return;
                    }
                    if (creep.carry[RESOURCE_ENERGY] > 0) {
                        creep.moveToTransfer(creep.room.storage, creep.carrying);
                    }
                    if (roomLevel < 5) linkTerminalStorageBalance(creep);
                    if (creep.room.controller !== undefined && linkPickUpEnergy(creep) === OK) {
                        creep.say('drp');
                        return;
                    }
                    break;
                } else {
                    if (creep.carrying !== 'G' && !creep.room.memory.labsNeedWork && this.depositNonEnergy(creep)) {
                        return;
                    }
                    if (job.doMineralContainer(creep)) {
                        return;
                    }
                    if (roleParent.constr.withdrawFromTombstone(creep)) {
                        return;
                    }
                    if (job.doLabs(creep)) {
                        return;
                    }
                    if (workers !== 1 && job.doRefill(creep)) {
                        return;
                    }
                    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable && job.doRoomEnergy(creep)) {
                        return;
                    }
                    if (job.doNuke(creep)) {
                        return;
                    }

                    if (creep.room.controller !== undefined && linkPickUpEnergy(creep) === OK) {
                        creep.say('drp');
                        return;
                    }

                    if (creep.carryTotal !== creep.carryCapacity) {
                        creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else {
                        //                        creep.sleep(3);
                    }
                }
                break;
            default:
                if (creep.room.controller !== undefined && linkPickUpEnergy(creep) === OK) {
                    creep.say('drp');
                    return;
                }

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

    }
}

module.exports = roleLinker;