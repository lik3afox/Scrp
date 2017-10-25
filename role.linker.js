// Linkers are when you need to manually do something
// Container to storage
// Link to storage

// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

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
var sources = require('commands.toSource');
var containers = require('commands.toContainer');
var links = require('build.link');
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
            let zz = creep.transfer(creep.room.storage, tier3[ee]);
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
    if (isItTier3(creep)) {} else if (creep.room.terminal !== undefined && creep.room.terminal.total == 300000) {
        containers.moveToStorage(creep);
    } else if (creep.room.terminal === undefined) {
        containers.moveToStorage(creep);
    } else if ((creep.carry[RESOURCE_ENERGY] === 0 && creep.carryTotal !== 0) || creep.room.terminal.store[RESOURCE_ENERGY] < 5000) {
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

        if (creep.room.storage.store[e] < xStored[e].amount) {
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
        return;
    }
    var goto = creep.room.terminal;
    if (goto !== undefined && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
        creep.say('T');
        if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(goto);
        }
    }
}

function moveToAndDrop(creep, pos) {
    if (creep.pos.isEqualTo(pos)) {
        creep.drop(RESOURCE_ENERGY);
    } else {
        creep.moveTo(pos);
    }
}

function eitherOr(creep, containz1, containz2) {
    let contain = Game.getObjectById(containz1);
    let contain2 = Game.getObjectById(containz2);
    let target;
    if (contain === null || contain2 === null) return;
    if (contain.store[RESOURCE_ENERGY] > contain2.store[RESOURCE_ENERGY]) {
        target = contain;
    } else {
        target = contain2;
    }

    if (creep.pos.isNearTo(target)) {
        creep.withdraw(target, RESOURCE_ENERGY);
    } else {
        creep.moveTo(target);
    }

}

function doLinkRoom(creep) {
    var term = creep.room.terminal;
    let goto = Game.getObjectById(creep.room.memory.masterLinkID);
    if (goto !== null && goto.energy > 0) {
        if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(goto, {
                reusePath: 20
            });
        }
    } else {
        takeFromTerminalForStorage(creep);
    }
}


function oneLinkRoom(creep, fill) {
    if (!fill) {
        if (constr.pickUpEnergy(creep)) return;
        switch (creep.memory.roleID) {
            case 0:
                doLinkRoom(creep);
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: toStorageOrTerminal(creep);
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
    if (creep.room.terminal.store[RESOURCE_ENERGY] === 0) {
        target = creep.room.storage;
    }

    var tgt = new RoomPosition(32, 10, 'E14S38');

    if (creep.memory.roleID !== 0)
        tgt = new RoomPosition(34, 10, 'E14S38');
    if (!creep.pos.isEqualTo(tgt)) {
        creep.say('hug' + creep.moveTo(tgt));

    }


    //    }
    if (!fill) {
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

                let tower = Game.getObjectById('59b6c74247713d03af663275');
            if (tower !== undefined && tower.energy < 100 && creep.room.controller.level > 2) {
                creep.transfer(tower, RESOURCE_ENERGY);
                return;
            }
            // Then we do spawn 
            let spawn = Game.getObjectById('59b6bbb8fa8a1c0b7da30a88');
            if (spawn !== undefined && spawn.energy < 100) {
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
                        creep.transfer(target, RESOURCE_ENERGY);
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
                    creep.say('<');
        // Then pick up energy.
        if (creep.room.controller.level > 3) {
            // First look for containers.
            if (creep.room.memory.masterLinkID !== undefined) {

            }
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
            } else {
                constr.moveToPickUpEnergy(creep, 100);
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
            takeFromTerminalForStorage(creep);
            return;
        } else {
            constr.moveToPickUpEnergy(creep, 300);
        }
    } else {
        toStorageOrTerminal(creep);
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
        this.rebirth(creep);
        if (creep.saying == 'ZzZ') return;

        if (creep.room.controller.level != 8 && creep.memory.roleID === 0) {
            creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
        }
        //        if (creep.room.name !== 'x' && creep.room.name !== 'E14S47')


        if (super.returnEnergy(creep)) return;

        super.renew(creep);
        // Linker goes to link and stores it at the storage.
        if (creep.carryTotal > 0) {
            creep.memory.full = true;
        } else {
            creep.memory.full = false;
        }
        // Here we look for various important things
        // Powerspawn
        // Boost Lab
        // We do this at 1400 life.
        if (creep.ticksToLive === 1400 && creep.pos.isNearTo(creep.room.storage)) {
            var close = creep.pos.findInRange(FIND_STRUCTURES, 1);
            for (var e in close) {
                if (close[e].structureType == STRUCTURE_POWER_SPAWN && creep.room.memory.powerSpawnID === undefined) {
                    console.log('FOUND ROOM STRUCTURE', close[e].structureType);
                    creep.room.memory.powerSpawnID = close[e].id;
                }
                if (creep.room.memory.masterLinkID === undefined && close[e].structureType == STRUCTURE_LINK) {
                    console.log('FOUND ROOM STRUCTURE', close[e].structureType);
                    creep.room.memory.masterLinkID = close[e].id;
                }
                if (creep.room.memory.boostLabID === undefined && close[e].structureType == STRUCTURE_LAB) {
                    console.log('FOUND ROOM STRUCTURE', close[e].structureType);
                    creep.room.memory.boostLabID = close[e].id;
                }
            }
        }
        var goto;
        if (creep.room.memory.boost === undefined) {
            creep.room.memory.boost = {
                mineralType: 'none',
                mineralAmount: 0,
                timed: 20,
                emptied: false
            };
        }
        //var good = ['E25S43', 'E14S43', 'E28S42','E17S34','E17S45','E23S38','E28S37','E27S34','E14S37'];

        if (creep.memory.roleID === 0 && creep.room.memory.boost.mineralType !== 'none' && creep.room.memory.boostLabID !== undefined) {
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
                    if (creep.room.terminal.store[boost.mineralType] > 0 && lab.mineralAmount < boost.mineralAmount) {
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
                }
            }
            if (boost.timed <= 0 || boost.timed === undefined) {
                boost.mineralType = 'none';
            }
            /*                returned[2].resource = zz;
                            returned[2].amount = Game.rooms[roomName].memory.boostRequest[0].amount;
                            returned[2].emptied = false;             */
        }

        if (creep.room.controller.level === 8 && creep.memory.roleID === 0) {
            oneLinkRoom(creep, creep.memory.full);
            return;
        }

        switch (creep.pos.roomName) {
            case 'E14S38':
                E14S38(creep, creep.memory.full);
                break;

            default:
                doDefault(creep, creep.memory.full);
                break;

        }



    }
}

module.exports = roleLinker;