var classLevels = [
    [CARRY, CARRY, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],

    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE] // 500 
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
    var tier3 = ['XLHO2', 'XUH2O', 'XGHO2', 'XZHO2', 'XZH2O', 'XKHO2'];
    for (var ee in tier3) {
        if (creep.carry[tier3[ee]] !== undefined) {
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
    if (creep.room.controller.level < 4) {
        // Here we drop.
        return false;
    }
    if (isItTier3(creep)) {

    } else if (creep.room.terminal === undefined) {
        containers.moveToStorage(creep);
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

function getMineralForStorage(creep) {
    var xStored = terminal.getStored();
    if (creep.carryTotal === creep.carryCapacity) return false;
    for (var e in xStored) {
        if (creep.room.storage.store[e] === undefined && creep.room.terminal.store[e] !== undefined) {
            //            console.log('h');
            if (creep.room.terminal.store[e] > 0) {
                console.log('1Linker thinks:', creep.room.storage.store[e], xStored[e].amount, creep.room.terminal.store[e], e);
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, e);

                } else {
                    creep.moveTo(creep.room.terminal);
                }
                return true;
            }
        }

        if (creep.room.storage.store[e] < xStored[e].amount && creep.room.terminal.store[e] !== undefined) {
            //            console.log(e,xStored[e].amount,creep.room.storage.store[e],creep.room.terminal.store[e]);
            if (creep.room.terminal.store[e] > 0) {
                var taken = xStored[e].amount - creep.room.storage.store[e];
                if (taken > creep.carryCapacity) taken = creep.carryCapacity;
                if (taken > creep.room.terminal.store[e]) taken = creep.room.terminal.store[e];
                if (creep.room.terminal.store[e] > 0) {
                    if (creep.pos.isNearTo(creep.room.terminal)) {
                        let zz = creep.withdraw(creep.room.terminal, e, taken);
                        console.log(creep.room.name, zz, xStored[e].amount, creep.room.storage.store[e], '=', '2Linker thinks:', creep.room.storage.store[e], xStored[e].amount, creep.room.terminal.store[e], e);
                    } else {
                        creep.moveTo(creep.room.terminal);
                    }
                }
            }
            return true;
        }
    }
    return false;
}

function takeFromTerminalForStorage(creep) {
    if (creep.room.terminal === undefined || creep.room.storage === undefined) return false;
    if (creep.room.controller.level === 8 && getMineralForStorage(creep)) {
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
    if (pspwn !== null && pspwn.energy < 4000) {
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
        if (constr.pickUpEnergy(creep)) return;
        if (!doMasterLink(creep)) {
            takeFromTerminalForStorage(creep);
        }
    } else {
        switch (creep.memory.roleID) {
            default: if (!doPowerSpawn(creep)) {
                if (!toStorageOrTerminal(creep)) {}
            }
            break;
        }
    }
}


function E14S38(creep, fill) {
    var goto;
    //    var storageMore = false;
    var target = creep.room.storage;
    //    if( creep.room.controller.level > 5 ){
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



    //    }
    if (!fill) {
        creep.say(fill);
        switch (creep.memory.roleID) {
            default: if (!constr.pickUpEnergy(creep))
                if (target !== null && creep.room.storage.store[RESOURCE_ENERGY] < 998000) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {}
                }
            break;
        }
    } else {
        switch (creep.memory.roleID) {
            default:
                // First we do the tower

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
            // Then we do spawn 
            let spawn = Game.getObjectById('5a03400a3e83cd1e5374cf65');
            if (spawn !== null && spawn.energy < 175) {
                if (creep.pos.isNearTo(spawn)) {
                    creep.transfer(spawn, RESOURCE_ENERGY);
                } else {
                    //               creep.moveTo(spawn);
                }
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
                    } else {
                        //                        creep.moveTo(target);
                    }
                }

            }

            break;
        }
    }
}

function doDefault(creep) {
    if (creep.carryTotal !== creep.carryCapacity) {
        var close;
        // Then pick up energy.
        if (creep.room.controller.level > 3 && creep.room.storage !== undefined) {
            creep.say('<');
            // First look for containers.
            if (creep.room.memory.masterLinkID !== undefined) {

                if (creep.memory.roleID === 0) {
                    let cc = Game.getObjectById(creep.room.memory.masterLinkID);
                    if (cc !== null && cc.energy > 0) {
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

                close = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                    filter: function(object) {
                        return object.amount > (creep.memory.roleID * 500) + 300;
                    }
                });

                if (creep.pos.isNearTo(close)) {
                    creep.pickup(close, RESOURCE_ENERGY);
                } else {
                    creep.moveMe(close, {
                        maxRooms: 1,
                        reusePath: 50,
                        ignoreCreeps: true,
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#f0fA',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    });
                }

                //   creep.say('<');
            }
            return;
        } else {
            var spn = Game.getObjectById(creep.memory.parent);

            close = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                filter: function(object) {
                    return !spn.pos.isNearTo(object) && object.amount > (creep.memory.roleID * 500) + 300;
                }
            });

            if (creep.pos.isNearTo(close)) {
                creep.pickup(close, RESOURCE_ENERGY);
            } else {
                creep.moveMe(close, {
                    maxRooms: 1,
                    reusePath: 50,
                    ignoreCreeps: true,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#f0fA',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });
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
    boost.timed--;
    var lab = Game.getObjectById(creep.room.memory.boostLabID);
    if (lab !== null) {
        lab.room.visual.text(boost.resourceType, lab.pos.x, lab.pos.y, {
            color: 'FF00FF',
            stroke: '#000000 ',
            strokeWidth: 0.123,
            font: 0.5
        });
        var wanted = creep.room.memory.boost.amount - lab.resourceAmount;
        //            console.log(boost.mineralType, lab.mineralType, creep.carryTotal);

        if (creep.carryTotal > 0) {
            // IS our hands empty?
            if (creep.carry[RESOURCE_ENERGY] > 0) {
                if (lab.energy < lab.energyCapacity) {
                    if (creep.pos.isNearTo(lab)) {
                        creep.transfer(lab, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(lab);
                    }
                    creep.say('PutE');
                    return;
                } else {
                    if (creep.pos.isNearTo(creep.room.storage)) {
                        creep.transfer(creep.room.storage, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(creep.room.storage);
                    }
                    return;
                }
            }

            for (var eee in creep.carry) {

                if (eee == lab.mineralType && eee == boost.mineralType) {
                    if (creep.pos.isNearTo(lab)) {
                        creep.transfer(lab, eee);
                    } else {
                        creep.moveTo(lab);
                    }
                    creep.say('put');
                    return;

                }
                //                        console.log('xxx', lab.mineralType, eee, boost.mineralType);
                if (lab.mineralType === null && eee == boost.mineralType) {
                    if (creep.pos.isNearTo(lab)) {
                        creep.transfer(lab, eee);
                    } else {
                        creep.moveTo(lab);
                    }
                    creep.say('put');
                    return;
                }
            }
        } else {
            //                  console.log(lab.mineralAmount, boost.mineralAmount);
            if (lab.mineralType !== undefined && lab.mineralType !== boost.mineralType && lab.mineralAmount > 0) {
                creep.say('Empty');
                if (creep.pos.isNearTo(lab)) {
                    creep.withdraw(lab, lab.mineralType);
                } else {
                    creep.moveTo(lab);
                }
                return;
            }

            //                    console.log('BBB', creep.room.terminal.store[boost.mineralType], lab.mineralAmount, boost.mineralAmount, Memory.stats.totalMinerals[boost.mineralType]);
            if (creep.room.name == 'E13S34') {
                console.log(creep.room.terminal.store[boost.mineralType], boost.mineralAmount, lab.mineralAmount);
            }
            if ((creep.room.terminal.store[boost.mineralType] > 0 || creep.room.storage.store[boost.mineralType] > 0) && (lab.mineralAmount < boost.mineralAmount || lab.mineralAmount === 0)) {
                let target = creep.room.terminal;
                if (creep.room.storage.store[boost.mineralType] > boost.mineralAmount) {
                    target = creep.room.storage;
                }
                if (creep.pos.isNearTo(target)) {
                    creep.say('TakeT');
                    var amount = lab.mineralAmount !== undefined ? boost.mineralAmount - lab.mineralAmount : undefined;
                    if (amount > creep.carryCapacity) {
                        amount = creep.carryCapacity;
                    }

                    if (amount > target.store[boost.mineralType])
                        amount = target.store[boost.mineralType];

                    if (amount !== 0) {
                        let vv = creep.withdraw(target, boost.mineralType, amount);
                        //       console.log('takeT', amount, boost.mineralType, vv);

                    }
                } else {
                    creep.moveTo(target);
                }

                return;
            }
            creep.say('zzz' + lab.mineralAmount);
            if (boost.timed <= 0 || boost.timed === undefined) {
                boost.mineralType = 'none';
            }
            return;
        }
    }
    if (boost.timed <= 0 || boost.timed === undefined) {
        boost.mineralType = 'none';
    }

}


class roleLinker extends roleParent {

    static levels(level) {
        if (level == 10) {
            return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
        } else if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }
        if (creep.saying == 'ZzZ') return;

        this.rebirth(creep);
        if (creep.room.controller.level != 8 && creep.memory.roleID === 0) {
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
        // Linker goes to link and stores it at the storage.

        var goto;
        if (creep.room.memory.boost === undefined) {
            creep.room.memory.boost = {
                mineralType: 'none',
                mineralAmount: 0,
                timed: 20,
                emptied: false
            };
        }
        if (creep.room.memory.boost.mineralType !== 'none' && creep.room.memory.boostLabID !== undefined) {
            boostLabWork(creep);
            return;
        }

        if (creep.room.name == 'E14S38') {
            E14S38(creep, creep.carryTotal > 0);
            return;
        }

        if (creep.room.controller.level === 8 || creep.room.name == 'E25S43' || creep.room.name == 'E14S37') {
            if (!super.power.getPowerToSpawn(creep)) {
                oneLinkRoom(creep, creep.carryTotal > 0);
            }
            return;
        } else {
            doDefault(creep, creep.carryTotal > 0);
            return;
        }

    }
}

module.exports = roleLinker;