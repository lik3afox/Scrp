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
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],

    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
];

var roleParent = require('role.parent');

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
    if (creep.room.controller.level < 8) return false;
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

function toStorageOrTerminal(creep) {
    let maxStorage = 850000;
    if (creep.room.controller === undefined || creep.room.controller.level < 4) {
        return false;
    }
    if (isItTier3(creep)) {

    } else if (creep.room.terminal === undefined) {
        containers.moveToStorage(creep);
    } else if (creep.room.terminal.store[RESOURCE_ENERGY] === 0) {
        containers.moveToTerminal(creep);
    } else if (creep.room.terminal !== undefined && creep.room.terminal.total == 300000) {
        containers.moveToStorage(creep);
    } else if ((creep.carry[RESOURCE_ENERGY] === 0 && creep.carryTotal !== 0) || (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 5000)) {
        containers.moveToTerminal(creep);
    } else if (creep.room.storage.store[RESOURCE_ENERGY] < 75000) {
        containers.moveToStorage(creep);
    } else if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000 || creep.room.storage.store[RESOURCE_ENERGY] > 900000) {
        containers.moveToTerminal(creep);
    } else {
        containers.moveToStorage(creep);
    }
}


function manageStorageMinerals(creep) {
    if(Game.shard.name !== 'shard1') return;
    if (creep.carryTotal === creep.carryCapacity) return false;

var storaged = ['XLHO2', 'XLH2O', 'XUH2O', 'XUHO2', 'XGHO2', 'XZHO2', 'XZH2O', 'XKHO2', 'XKH2O'];    
for(var i in creep.room.storage.store) {
    if(!_.contains(storaged,i) && creep.room.storage.store[i] > 0 && i !== RESOURCE_ENERGY){
        creep.say('NotBelong');
console.log(i,!_.contains(storaged,i) , creep.room.storage.store[i],creep.room.name);
        creep.moveToWithdraw(creep.room.storage,i);
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

function takeFromTerminalForStorage(creep) {
    if (creep.room.terminal === undefined || creep.room.storage === undefined) return false;
    if (creep.room.controller.level === 8 && manageStorageMinerals(creep)) {
        creep.say('M');
        return true;
    }
    var goto = creep.room.terminal;
    if (goto !== undefined && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
        creep.say('T');
        if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(goto);
        }
        return true;
    }
    return false;
}

function doMasterLink(creep) {
    var term = creep.room.terminal;
    let goto = Game.getObjectById(creep.room.memory.masterLinkID);
    if (goto !== null && goto.energy > 0) {
        if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(goto, {
                reusePath: 20
            });
        }
        return true;
    }
    return false;
}

function doPowerSpawn(creep) {
    if (creep.room.storage.store[RESOURCE_ENERGY] < 900000) return false;
    if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) return false;
    let pspwn = creep.room.powerspawn;
    if (pspwn !== undefined && pspwn.energy < 4000) {
        if (creep.pos.isNearTo(pspwn)) {
            creep.transfer(pspwn, RESOURCE_ENERGY);
        } else {
            creep.moveTo(pspwn);
        }
        creep.say('🔌');
        return true;
    }
    return false;
}


function oneLinkRoom(creep, fill) {
    if (!fill) {
        //    if ( creep.moveToPickUp(FIND_DROPPED_RESOURCES) ){
        //   creep.say('zzes');
        //          return;
        //        }
        if (roleParent.constr.withdrawFromTombstone(creep)) {
            return;
        }

        if (!doMasterLink(creep)) {
            takeFromTerminalForStorage(creep);
        } else {
            creep.say('mLink');
        }
    } else {
        if (!toStorageOrTerminal(creep)) {

        } else {
            creep.say('blnc');
        }
    }
}

function E14S38(creep, fill) {
    var goto;
    var target = creep.room.storage;
    if (creep.room.terminal !== undefined && creep.room.controller.level > 3) {
        target = creep.room.terminal;
    }
    if (!fill && creep.room.terminal.store[RESOURCE_ENERGY] === 0) {
        target = creep.room.storage;
    }

    var tgt = new RoomPosition(32, 10, 'E14S38');

    if (creep.memory.roleID !== 0)
        tgt = new RoomPosition(34, 10, 'E14S38');
    if (!creep.pos.isEqualTo(tgt)) {
        creep.say('hug' + creep.moveTo(tgt));

    }

    let lab = Game.getObjectById(creep.room.memory.boostLabID);
    if ((lab !== null && (lab.mineralAmount === undefined || lab.mineralAmount < 3000) && creep.room.terminal.store.XGH2O !== undefined) || creep.carry.XGH2O > 1) {
        if (!fill) {
            if (creep.room.storage.store.XGH2O > 0) {

                creep.withdraw(creep.room.storage, 'XGH2O');
            } else {
                creep.withdraw(creep.room.terminal, 'XGH2O');
            }
        } else {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (lab.energy !== lab.energyCapacity) {
                    creep.transfer(lab, RESOURCE_ENERGY);
                } else {
                    creep.transfer(creep.room.storage, RESOURCE_ENERGY);
                }
            } else {

                if (lab.mineralAmount !== 3000) {
                    for (var e in creep.carry) {
                        creep.transfer(lab, e);
                    }
                } else {
                    for (var ee in creep.carry) {
                        creep.transfer(creep.room.storage, ee);
                    }
                }
            }

        }
        creep.say('GH' + fill);
        return;
    }
    if (!fill) {
        creep.say(fill);
        switch (creep.memory.roleID) {
            default:
                //            if (!constr.pickUpEnergy(creep))
                if (!roleParent.constr.withdrawFromTombstone(creep)) {
                    let zzze = creep.moveToPickUp(FIND_DROPPED_RESOURCES, 100);
                    if (zzze !== 0) {
                        if (target !== null && creep.room.storage.store[RESOURCE_ENERGY] < 998000) {
                            if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {}
                        }
                    }
                }

            break;
        }
    } else {
        switch (creep.memory.roleID) {
            default:

                let tower = Game.getObjectById('5a07418fec922a4a7a8492e8');
            if (tower !== null && tower.energy < 100 && creep.room.controller.level > 2) {
                creep.transfer(tower, RESOURCE_ENERGY);
                return;
            }
            let lab = Game.getObjectById(creep.room.memory.boostLabID);
            if (lab !== null && lab.energy !== lab.energyCapacity && creep.room.controller.level > 5) {
                creep.transfer(lab, RESOURCE_ENERGY);
                return;
            }
            let spawn = Game.getObjectById('5a03400a3e83cd1e5374cf65');
            if (spawn !== null && spawn.energy < 175) {
                if (creep.pos.isNearTo(spawn)) {
                    creep.transfer(spawn, RESOURCE_ENERGY);
                } else {}
                return;
            }
            if (creep.room.controller.level > 3) {
                if (target.structureType == STRUCTURE_STORAGE && creep.room.controller.level > 5) {
                    target = creep.room.terminal;
                } else {
                    target = creep.room.storage;
                }

                if (target !== undefined) {
                    if (creep.pos.isNearTo(target)) {
                        for (var eee in creep.carry) {
                            creep.transfer(target, eee);
                        }
                    } else {}
                }

            }

            break;
        }
    }
}

function doDefault(creep) {
    if (creep.carryTotal !== creep.carryCapacity) {
        var close;
        if (creep.room.controller !== undefined && creep.room.controller.level > 3 && creep.room.storage !== undefined) {
            creep.say('<');
            if (creep.room.memory.masterLinkID !== undefined) {

                if (creep.memory.roleID === 0) {
                    let cc = Game.getObjectById(creep.room.memory.masterLinkID);
                    var remove = 0;
                    if (creep.room.name == 'E11S47') {
                        remove = 400;
                    }
                    if (cc !== null && cc.energy > remove) {
                        if (creep.pos.isNearTo(cc)) {
                            creep.withdraw(cc, RESOURCE_ENERGY);
                        } else {
                            creep.moveTo(cc);
                        }
                        return true;
                    }
                }

                if (creep.room.memory.masterLinkID !== undefined) {
                    creep.say('!@@');
                    if (creep.memory.roleID !== 0 && containers.moveToWithdraw(creep)) {
                        return true;
                    }
                } else {
                    if (containers.moveToWithdraw(creep)) {
                        return true;
                    }
                }
            }

            if (!takeFromTerminalForStorage(creep)) {

                if (roleParent.constr.withdrawFromTombstone(creep)) {
                    return;
                }

                close = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: function(object) {
                        return object.amount > (creep.memory.roleID * 500) + 100;
                    }
                });

                if (creep.pos.isNearTo(close)) {
                    creep.pickup(close, RESOURCE_ENERGY);
                } else {
                    creep.moveMe(close, {
                        maxRooms: 1,
                        reusePath: 50,
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#f0fA',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    });
                }
            }
            return;
        } else {
            var spn = Game.getObjectById(creep.memory.parent);

            close = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: function(object) {
                    return !spn.pos.isNearTo(object) && object.amount > (creep.memory.roleID * 500) + 100;
                }
            });
            if (close !== null) {
                if (creep.pos.isNearTo(close)) {
                    creep.pickup(close, RESOURCE_ENERGY);
                } else {
                    creep.moveMe(close, {
                        maxRooms: 1,
                        reusePath: 50,
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#f0fA',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    });
                }
            }


            creep.say('>' + close);
        }
    } else {
        if (!toStorageOrTerminal(creep)) {
            if (Game.flags[creep.memory.home] !== undefined && creep.room.storage === undefined) {
                creep.say('*');
                if (creep.pos.isEqualTo(Game.flags[creep.memory.home])) {
                    creep.drop(RESOURCE_ENERGY);
                } else {
                    creep.moveTo(Game.flags[creep.memory.home]);
                }
            }
        }


    }

}

function boostLabWork(creep) {
    creep.say('hi');
    var boost = creep.room.memory.boost;
    var lab = Game.getObjectById(creep.room.memory.boostLabID);
    if (creep.room.terminal === undefined) return;
    if (lab !== null) {
        lab.room.visual.text(boost.mineralType, lab.pos.x, lab.pos.y, {
            color: 'FF00FF',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });
        var wanted = creep.room.memory.boost.amount - lab.resourceAmount;

        if (creep.carryTotal > 0) {
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (lab.energy < lab.energyCapacity) {
                    creep.moveToTransfer(lab, RESOURCE_ENERGY);
                    creep.say('PutE');
                    return;
                } else {
                    creep.moveToTransfer(creep.room.storage, RESOURCE_ENERGY);
                    creep.say('putM');
                    return;
                }
            }

            for (var eee in creep.carry) {

                if (eee == lab.mineralType && eee == boost.mineralType && boost.mineralAmount > 0) {
                    creep.moveToTransfer(lab, eee);
                    creep.say('put');
                    return;

                }
                if (lab.mineralType === null && eee == boost.mineralType && boost.mineralAmount > 0) {
                    creep.moveToTransfer(lab, eee);
                    creep.say('put');
                    return;
                }
                creep.say('putaway');
                if (creep.room.terminal.total === 300000) {
                    creep.moveToTransfer(creep.room.storage, eee, { reusePath: 10 });
                } else {
                    creep.moveToTransfer(creep.room.terminal, eee);
                }
            }
        } else {
            if (boost.timed <= 0 || boost.timed === undefined || boost.mineralAmount === 0) {
                boost.mineralType = 'none';
            }

            if (creep.room.terminal.store[boost.mineralType] === undefined || creep.room.terminal.store[boost.mineralType] === 0) {
                creep.say('request');
                _terminal_().requestMineral(creep.room.name, boost.mineralType);
            }
//console.log(lab.mineralType, boost.mineralType, lab.mineralAmount);
            if (lab.mineralType !== undefined && lab.mineralType === boost.mineralType && lab.mineralAmount > boost.mineralAmount) {
                creep.say('reuce');
                if (creep.pos.isNearTo(lab)) {
                    creep.withdraw(lab, lab.mineralType,lab.mineralAmount - boost.mineralAmount);
                } else {
                    creep.moveTo(lab);
                }
                return;
            }

            if (lab.mineralType !== undefined && lab.mineralType !== boost.mineralType && lab.mineralAmount > 0) {
                creep.say('Empty');
                if (creep.pos.isNearTo(lab)) {
                    creep.withdraw(lab, lab.mineralType);
                } else {
                    creep.moveTo(lab);
                }
                return;
            }
            if (lab.energy < 20 * (boost.mineralAmount / 30)) {
                creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                return;
            }

            if ((creep.room.terminal.store[boost.mineralType] > 0 || creep.room.storage.store[boost.mineralType] > 0) && (lab.mineralAmount < boost.mineralAmount || lab.mineralAmount === 0)) {
                let target = creep.room.terminal;
                if (creep.room.storage.store[boost.mineralType] > boost.mineralAmount) {
                    target = creep.room.storage;
                }
                if (creep.pos.isNearTo(target)) {
                    var amount = lab.mineralAmount !== undefined ? boost.mineralAmount - lab.mineralAmount : undefined;
                    creep.say('Tak' + amount);
                    if (amount > creep.carryCapacity) {
                        amount = creep.carryCapacity;
                    }

                    if (amount > target.store[boost.mineralType])
                        amount = target.store[boost.mineralType];

                    if (amount !== 0) {
                        let vv = creep.withdraw(target, boost.mineralType, amount);
                    }
                } else {
                    creep.moveTo(target);
                }

                return;
            }

            creep.say('BT' + boost.mineralAmount);
            boost.timed--;

            return;
        }
    }
    if (boost.timed <= 0 || boost.timed === undefined) {
        boost.mineralType = 'none';
    }

}

function simple(creep) {

    if (creep.memory.empty === undefined) {
        if (creep.carryTotal === 0) {
            creep.memory.empty = true;
        } else {
            creep.memory.empty = false;
        }
    }
    if (creep.carryTotal === 0) {
        creep.memory.empty = true;
    } else if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.empty = false;
    }
    if (Game.shard.name !== 'shard2' && creep.room.memory.boost !== undefined && creep.room.memory.boost.mineralType !== 'none' && creep.room.memory.boost.mineralAmount !== 0 && creep.room.memory.boostLabID !== undefined) {
        boostLabWork(creep);
        creep.say('Boost');
        return;
    }
    if (creep.room.energyAvailable === creep.room.energyCapacityAvailable)
        if (creep.room.memory.labsNeedWork) {
            require('role.scientist').run(creep);
            creep.say('Labs');
            return;
        }


    if (creep.memory.empty) {
        if (creep.pos.isNearTo(creep.room.storage)) {
            creep.transfer(creep.room.storage, creep.carrying);
        }
        var zz = Game.getObjectById(creep.room.memory.mineralContainID);
        if (zz !== null && zz.total > 1000) {
            require('role.assistant').run(creep);
            creep.say('Min');
            return;
        }
        let cc = Game.getObjectById(creep.room.memory.masterLinkID);
        if (cc !== null && cc.energy > 200 && creep.memory.roleID === 0) {
            if (creep.pos.isNearTo(cc)) {
                creep.withdraw(cc, RESOURCE_ENERGY);
            } else {
                creep.moveTo(cc);
            }
            creep.say('Link');

            return;
        }
        if (creep.moveToPickUp(FIND_DROPPED_RESOURCES) === OK) {
            creep.say('drp');
            return;
        }
        //        if (constr.moveToPickUpEnergy(creep, 300)) {
        if (roleParent.constr.withdrawFromTombstone(creep)) {
            creep.say('tomb');
            return;
        }
        //     }
        if (creep.room.storage.store[RESOURCE_ENERGY] !== creep.room.storage.total && creep.room.terminal !== undefined) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                for (let zz in creep.room.storage.store) {
                    if (zz !== RESOURCE_ENERGY) {
                        creep.withdraw(creep.room.storage, zz);
                        creep.say('mBal');
                        return;
                    }
                }
            } else {
                creep.moveTo(creep.room.storage);
            }
        }

        if (creep.room.storage.store[RESOURCE_ENERGY] < 900000 && creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 20000) {
            if (creep.pos.isNearTo(creep.room.terminal)) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            } else {
                creep.moveTo(creep.room.terminal);
            }
            creep.say('Balance');
            return;
        }
        if (creep.room.powerspawn !== undefined && creep.room.powerspawn.power < 1 && creep.room.terminal.store[RESOURCE_POWER] > 0) {
            creep.say('gpwer');
            if (creep.pos.isNearTo(creep.room.terminal)) {
                var amount = 100;
                if (creep.room.terminal.store[RESOURCE_POWER] < 100) {
                    amount = creep.room.terminal.store[RESOURCE_POWER];
                }
                creep.withdraw(creep.room.terminal, RESOURCE_POWER, amount);
                creep.memory.empty = false;
            } else {
                creep.moveTo(creep.room.terminal);
            }
            return;
        } else if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_POWER] === 0) {
            _terminal_().requestMineral(creep.room.name, RESOURCE_POWER);
        }
        if (creep.room.powerspawn !== undefined && creep.room.powerspawn.energy < 50) {
            creep.say('geng');
            creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
            return;
        }
        if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] > 0 && creep.room.terminal.store[RESOURCE_ENERGY] < 20000 && creep.room.storage.store[RESOURCE_ENERGY] > 100000) {
            creep.say('TBal');
            creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
            return;
        }
        if (creep.room.energyAvailable < creep.room.energyCapacityAvailable) {
            creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
        } else {
            //            creep.sleep(3);
        }
    } else {
        if (creep.room.energyAvailable < creep.room.energyCapacityAvailable && creep.carry[RESOURCE_ENERGY] == creep.carryTotal && !creep.memory.pickUpId) {
            require('role.first').run(creep);
            creep.say('Fill');
            return;
        }

        creep.say('Deposit');
        var target = creep.room.terminal;

        if (creep.carry[RESOURCE_POWER] > 0 && roleParent.power.getPowerToSpawn(creep)) {
            creep.say('dSpawn');
            return;
        } else {
            creep.moveToTransfer(creep.room.terminal, RESOURCE_POWER);
        }


        if (creep.saying !== 'twer') {

            for (let e in creep.carry) {
                if (creep.carry[e] > 0 && e !== RESOURCE_POWER && e !== RESOURCE_ENERGY && creep.room.terminal !== undefined) {
                    creep.moveToTransfer(creep.room.terminal, e);
                    return;
                }
                if (creep.carry[e] > 0 && e === RESOURCE_ENERGY && creep.room.powerspawn !== undefined && creep.room.powerspawn.energy < 5000) {
                    creep.moveToTransfer(creep.room.powerspawn, RESOURCE_ENERGY);
                    return;
                }
                if (creep.carry[e] > 0 && e !== RESOURCE_POWER) {
                    if (creep.room.terminal === undefined) {
                        target = creep.room.storage;
                    } else if (creep.room.terminal !== undefined && creep.room.terminal.total === 300000) {
                        target = creep.room.storage;
                    } else if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000) {
                        target = creep.room.terminal;
                    } else if (creep.room.storage.store[RESOURCE_ENERGY] === 100000) {
                        target = creep.room.terminal;
                    } else if (e === RESOURCE_ENERGY && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
                        target = creep.room.storage;
                    }
                    creep.moveToTransfer(target, e);
                    return;
                }
            }
        }
        return;

    }

}


class roleLinker extends roleParent {

    static levels(level) {
        if (level == 10) {
            return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
        } else if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }
        if (Game.shard.name === 'shardx2') {
            if (creep.carryTotal > 0) {
                creep.drop(creep.carrying);

            } else {

                creep.moveToWithdraw(creep.room.terminal, 'X');
            }
            return;
        }
        /*
                if(creep.ticksLeftToLive === 1 ) {
                    // Right before death, we find the one to follow the link. Which will now be the first.
                    var my = creep.room.find(FIND_MY_CREEPS);
                        my = _.filter(my, function(o) {
                                      return o.memory.role === 'first';
                                  });
                        if(my.length){
                            my[0].memory.role === 'first';
                        }
                } */
        if(creep.room.name == 'xE14S47' && creep.carryTotal === 0){
            creep.moveToPickUp(FIND_DROPPED_RESOURCES);
            return;
        }
        if (creep.room.name == 'E29xxS48') {
            let term = creep.room.terminal;
            let stor = creep.room.storage;
            if (creep.carryTotal > 0) {
                if (creep.carry[RESOURCE_ENERGY] > 0 && term.total !== 300000) {
                    stor = creep.room.terminal;
                }
                if (creep.pos.isNearTo(stor)) {
                    for (let e in creep.carry) {
                        if (creep.carry[e] > 0) {
                            creep.transfer(stor, e);

                            //return;
                        }
                    }
                } else {
                    creep.moveTo(stor);
                }
                creep.say('zz');
            } else {

                if (creep.pos.isNearTo(term)) {
                    for (let e in term.store) {
                        if (term.store[e] > 0 && e.length >= 4) {
                            creep.withdraw(term, e);
                        }
                    }

                } else {
                    creep.moveTo(term);
                }
                creep.say('blizz');
            }
            return;

        }

        this.rebirth(creep);
        if (creep.room.controller !== undefined && creep.room.controller.level != 8 && creep.memory.roleID === 0) {
            creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
        }

        if (creep.room.name == 'E14S38' && creep.carry.K > 0) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.transfer(creep.room.storage, 'K');
            } else {
                creep.moveTo(creep.room.storage);
            }
            return;
        }
        super.renew(creep);

        var goto;
        if (creep.room.memory.boost !== undefined && creep.room.memory.boost.mineralType !== 'none' && creep.room.memory.boost.mineralAmount !== 0 && creep.room.memory.boostLabID !== undefined && creep.room.name !== 'E22S49') {
            boostLabWork(creep);
            return;
        }
        if (creep.room.name == 'E19S49') {
creep.say('Xzh');
if(creep.carry[RESOURCE_ENERGY] > 0&&creep.room.terminal.total < 300000 && (creep.room.terminal.store[RESOURCE_ENERGY] === undefined || creep.room.terminal.store[RESOURCE_ENERGY] < 20000)){
    creep.moveToTransfer(creep.room.terminal,RESOURCE_ENERGY);
    return;
}
if(creep.carrying !== RESOURCE_ENERGY && creep.carryTotal > 0){
    creep.moveToTransfer(creep.room.terminal,creep.carrying);
    return;

}
            if (!super.power.getPowerToSpawn(creep)) {
                oneLinkRoom(creep, creep.carryTotal > 0);
            }
            return;
        }

        if (creep.room.memory.simple || Game.shard.name == 'shard2') {
            simple(creep);
            return;
        }

        if (creep.room.name == 'E14Sxx47') {
            if (creep.carryTotal === 0 && creep.room.terminal.total === 300000) {
                if (!creep.pos.isNearTo(creep.room.terminal)) {
                    creep.moveTo(creep.room.terminal);
                } else {
                    creep.withdraw(creep.room.terminal, 'Z');
                }
            } else if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
                for (let e in creep.carry) {
                    if (creep.carry[e] > 0) {
                        creep.drop(e);
                        break;
                    }
                }

            }
            creep.say('FUCK');
            return;
        }

        if (creep.room.name == 'E14S38') {
            E14S38(creep, creep.carryTotal > 0);
            return;
        }

        if (creep.room.controller !== undefined && creep.room.controller.level === 8 || creep.room.name == 'E25S43' || creep.room.name == 'E14S37') {
            if (!super.power.getPowerToSpawn(creep)) {
                oneLinkRoom(creep, creep.carryTotal > 0);
            }
            return;
        } else {
            if (creep.room.controller !== undefined && creep.room.controller.level > 5) {
                var zz = Game.getObjectById(creep.room.memory.mineralContainID);
                if (zz !== null && zz.total > 1000) {
                    require('role.assistant').run(creep);
                    creep.say('Min');
                    return;
                }
            }

            doDefault(creep, creep.carryTotal > 0);
            creep.say('df');
            return;
        }

    }
}

module.exports = roleLinker;