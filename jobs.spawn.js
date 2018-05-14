var labsBuild = require('build.labs');
var roleParent = require('role.parent');

function labNeedReducing(creep) {
    var theplans = labsBuild.getPlans(creep.room.name);
    if (theplans === undefined) return;
    var e = theplans.length;
    while (e--) {
        let lab = Game.getObjectById(theplans[e].id);
        if (lab !== null && theplans[e].emptied && lab.room.name == creep.room.name && lab.mineralAmount >= 250 && creep.carryTotal !== creep.carryCapacity) {
            ////            creep.say('redo');
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


function getEnergy(creep) {
    //    if (creep.room.name == 'E35S83') {
    //        creep.say('E38');
    var bads = creep.room.find(FIND_HOSTILE_CREEPS);
    if (bads.length > 0) {
        if (!containers.withdrawFromStorage(creep)) {
            creep.moveTo(Game.flags[creep.memory.party]);
        }
    } else {

        var close = creep.room.find(FIND_DROPPED_RESOURCES);
        if (close.length === 0) {
            if (!containers.withdrawFromStorage(creep)) {

            }
            return;
        }
        let high = _.max(close, a => a.amount);

        if (creep.pos.isNearTo(high)) {
            creep.pickup(high);
        } else {
            creep.moveTo(high, {
                maxRooms: 1,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#f0f',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        }

    }
    return;
    //   }

}

function mineralContainerEmpty(creep) {
    //    if (creep.memory.containsGood) return false;
    if (creep.memory.mineralContainerID === undefined && creep.room.memory.mineralID !== undefined) {
        var min = Game.getObjectById(creep.room.memory.mineralID);
        let contains = creep.room.find(FIND_STRUCTURES);
        if (min !== null) {
            contains = _.filter(contains, function(o) {
                return o.structureType == STRUCTURE_CONTAINER && o.pos.inRangeTo(min, 2);
            });
        }
        if (contains.length > 0) {
            creep.memory.mineralContainerID = contains[0].id;
        }
    }

    var a;

    var targetContain = Game.getObjectById(creep.memory.mineralContainerID);

    if (targetContain !== null) {
        var keys = Object.keys(targetContain.store);
        var z = keys.length;
        while (z--) {
            a = keys[z];
            if (targetContain.store[a] > 0) {

                if (creep.pos.isNearTo(targetContain)) {
                    creep.withdraw(targetContain, a);
                } else {
                    creep.moveMe(targetContain, { reusePath: 15 });
                    return true;
                }

            } else {

            }
        }
    }

}

class jobs {

    static doRefill(creep) {
        // Creeps that need refill - wallWorker
        //        if (creep.room.memory.wallworkID === undefined) 

        if (creep.room.controller === undefined) {
            creep.room.memory.wallworkID = undefined;
            return;
        }
        if (_.isNumber(creep.room.memory.wallworkID)) {
            if (creep.room.memory.wallworkID > 0) {
                return false;
            } else {
            creep.room.memory.wallworkID--;
            creep.say(creep.room.memory.wallworkID+'xze' );
            }

        }
        var wall = Game.getObjectById(creep.room.memory.wallworkID);
        if (wall === null) {
            wall = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                return o.memory.role === 'wallwork';
            });
            if (wall.length === 0) {
                creep.room.memory.wallworkID = 100;
                return false;
            }
            creep.room.memory.wallworkID = wall[0].id;
            wall = wall[0];
        }
        if (wall.carry[RESOURCE_ENERGY] < wall.carryCapacity >> 1) {
            if (creep.carrying !== undefined && creep.carrying !== RESOURCE_ENERGY) {
                creep.moveToTransfer(creep.room.storage, creep.carrying);
                return false;
            }
            if (creep.carry[RESOURCE_ENERGY] >  wall.carryCapacity >> 1 ) {
                if (creep.pos.isNearTo(wall)) {
                    creep.transfer(wall, RESOURCE_ENERGY);
                    //                    wall.memory.wallTargetID = undefined;
                } else {
                    creep.moveTo(wall);
                }
            } else {
                if (creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                } else {
                    creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
                }

            }
            creep.say('Giving');
            return true;
        }
        return false;
    }

    static doTower(creep) {
        //        console.log(creep, '@ doTower', roomLink(creep.room.name));
        if (creep.carry[RESOURCE_ENERGY] > 0) {
            let zz;
            if (creep.memory.towerTargetID === undefined) {
                zz = creep.room.find(FIND_STRUCTURES, { filter: o => o.energy < 900 && o.structureType == STRUCTURE_TOWER });
                if (zz.length > 0)
                    creep.memory.towerTargetID = zz[0].id;

            }
            if (creep.memory.towerTargetID === undefined) {
                var storage = creep.room.storage;
                if (!creep.pos.isNearTo(storage)) {
                    creep.moveTo(storage);
                } else {
                    for (var e in creep.carry) {
                        creep.transfer(storage, e);
                    }
                }
                return true;
            }
            let target = Game.getObjectById(creep.memory.towerTargetID);
            if (target !== null) {
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, RESOURCE_ENERGY);
                } else {
                    creep.moveMe(target);
                }
                if (target.energy > target.energyCapacity - 100)
                    creep.memory.towerTargetID = undefined;

            } else {

                creep.memory.towerTargetID = undefined;
            }
        } else {

            getEnergy(creep);
        }
        return true;
    }

    static doPowerspawn(creep) {

        if (creep.room.powerspawn === undefined) {
            return false;
        }
        let powerspawn = creep.room.powerspawn;
        if (creep.carry[RESOURCE_POWER] > 0 && powerspawn.power == 100) {
            creep.moveToTransfer(creep.room.terminal, RESOURCE_POWER);
        }
        if (powerspawn.power >= 10 && powerspawn.energy > 50) return false;
        if (Memory.stats.totalMinerals.power < 500 && (creep.room.terminal.store[RESOURCE_POWER] === undefined || creep.room.terminal.store[RESOURCE_POWER] === 0) && creep.carry[RESOURCE_POWER] === undefined) {
            return false;
        }
        if (creep.carry[RESOURCE_ENERGY] > 0 && creep.room.powerspawn.energy > 4000) {
            return false;
        }

        var target;
        var noPower = true;
        if (creep.room.terminal.store[RESOURCE_POWER] === undefined && creep.room.powerspawn.power === 0 && creep.carry[RESOURCE_POWER] === undefined || creep.carry[RESOURCE_POWER] === 0) {
            if (!_terminal_().requestMineral(creep.room.name, RESOURCE_POWER)) {}
            return false;
        }
        if ((creep.room.terminal.store[RESOURCE_POWER] === undefined || creep.room.terminal.store[RESOURCE_POWER] === 0) && creep.carry[RESOURCE_POWER] !== undefined) {
            if (!_terminal_().requestMineral(creep.room.name, RESOURCE_POWER)) {}
            return false;
        }
        //        console.log(creep, '@ doPowerspawn', roomLink(creep.room.name),creep.room.terminal.store[RESOURCE_POWER]);

        creep.say('pw2Sp');
        if (creep.carryTotal === 0) {
            creep.say('g');
            if (powerspawn.power < 10 && (creep.room.terminal.store[RESOURCE_POWER] !== undefined && creep.room.terminal.store[RESOURCE_POWER] > 0)) {
                let amt = 100;
                if (amt > creep.room.terminal.store[RESOURCE_POWER]) {
                    amt = creep.room.terminal.store[RESOURCE_POWER];
                }
                creep.moveToWithdraw(creep.room.terminal, RESOURCE_POWER, amt);
                creep.say('gP' + amt);
                return true;
            } else if (powerspawn.energy < 50) {
                creep.moveToWithdraw(creep.room.terminal, RESOURCE_ENERGY);
                creep.say('gE');
                return true;
            }
            return false;
        } else {
            if (creep.carry[RESOURCE_POWER] > 0 && powerspawn.power < 100) {
                creep.say('PP');
                if (creep.pos.isNearTo(powerspawn)) {
                    if (creep.carry[RESOURCE_POWER] > 0) {
                        creep.transfer(powerspawn, RESOURCE_POWER);
                    }

                } else {
                    creep.moveMe(powerspawn);
                }
                return true;

            } else if (creep.carry[RESOURCE_ENERGY] > 0 && powerspawn.energy < 4000) {
                creep.say('PE');
                if (creep.pos.isNearTo(powerspawn)) {
                    creep.transfer(powerspawn, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(powerspawn);
                }
                return true;
            } else {
                creep.moveToTransfer(creep.room.terminal, creep.carrying);
            }
            return true;
        }
        return false;
    }

    static doRoomEnergy(creep) {
        if (creep.room.energyAvailable == creep.room.energyCapacityAvailable) {
            return false;
        }
        // console.log(creep, '@ doRoomEnergy', roomLink(creep.room.name));
              if(creep.carryTotal !== creep.carry[RESOURCE_ENERGY]){
          creep.moveToTransfer(creep.room.storage,creep.carrying);
                  creep.say('@2124');
                    return true;
               } 
        if (!creep.memory.deposit && creep.carryTotal > creep.carryCapacity - 5) {
            creep.memory.deposit = true;
        } else if (creep.carry.energy === 0) {
            creep.memory.deposit = false;
        }

        if (!creep.memory.deposit) {

            let cc = Game.getObjectById(creep.room.memory.masterLinkID);
            if (cc !== null && cc.energy > 200) {
                if (creep.pos.isNearTo(cc)) {
                    creep.withdraw(cc, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(cc);
                }
                creep.say('Link');
                creep.memory.empty = false;
            }

            if (creep.pos.isNearTo(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            } else if (creep.pos.isNearTo(creep.room.terminal) && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            } else {
                if (!roleParent.containers.withdrawFromStorage(creep)) {
                    if (!roleParent.containers.withdrawFromTerminal(creep)) {
                        if (!roleParent.constr.withdrawFromTombstone(creep)) {
                            if (!creep.moveToPickUp(FIND_DROPPED_RESOURCES, creep.memory.roleID * 40, { maxRooms: 1 })) {}
                        }
                    }
                }
            }

        } else {
            if (!roleParent.spawns.moveToTransfer(creep)) {

            }
        }
        return true;
    }


    static doUpgradeRoom(creep, fill) {
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

    static doBoostLab(creep) {
        if (creep.room.memory.boost === undefined || creep.room.memory.boost.mineralType === 'none' || creep.room.memory.boost.mineralAmount === 0 || creep.room.memory.boostLabID === undefined) {
            return false;
        }
        //  console.log(creep, '@ doBoostLab', roomLink(creep.room.name));
        creep.say('hi');
        var boost = creep.room.memory.boost;
        var lab = Game.getObjectById(creep.room.memory.boostLabID);
        if (creep.room.terminal === undefined) return false;
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
                        return true;
                    } else {
                        if (creep.room.storage.total < 1000000) {
                            creep.moveToTransfer(creep.room.storage, RESOURCE_ENERGY);
                        } else {
                            creep.moveToTransfer(creep.room.terminal, RESOURCE_ENERGY);
                        }

                        creep.say('putM');
                        return true;
                    }
                }

                for (var eee in creep.carry) {

                    if (eee == lab.mineralType && eee == boost.mineralType && boost.mineralAmount > 0) {
                        creep.moveToTransfer(lab, eee);
                        creep.say('put');
                        return true;

                    }
                    if (lab.mineralType === null && eee == boost.mineralType && boost.mineralAmount > 0) {
                        creep.moveToTransfer(lab, eee);
                        creep.say('put');
                        return true;
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

                if (creep.room.terminal.store[boost.mineralType] === undefined || creep.room.terminal.store[boost.mineralType] === 0 || creep.room.terminal.store[boost.mineralType] < boost.mineralAmount) {
                    let zze = _terminal_().requestMineral(creep.room.name, boost.mineralType, boost.mineralAmount);
                    creep.say('req:' + boost.mineralType + zze);
                    if (!zze) boost.timed--;
                    return true;
                }
                //          if(creep.room.name == 'E29S48'){
                //            }
                if (lab.energy <= 800) {
                    console.log(lab.energy, (boost.mineralAmount * 20), 'LAB ENERGY TRANDFEr');
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                    return true;
                }

                //console.log(lab.mineralType, boost.mineralType, lab.mineralAmount);
                if (lab.mineralType !== undefined && lab.mineralType === boost.mineralType && lab.mineralAmount > boost.mineralAmount) {
                    creep.say('reuce');
                    if (creep.pos.isNearTo(lab)) {
                        creep.withdraw(lab, lab.mineralType, lab.mineralAmount - boost.mineralAmount);
                    } else {
                        creep.moveTo(lab);
                    }
                    return true;
                }

                if (lab.mineralType !== undefined && lab.mineralType !== boost.mineralType && lab.mineralAmount > 0) {
                    creep.say('Empty');
                    if (creep.pos.isNearTo(lab)) {
                        creep.withdraw(lab, lab.mineralType);
                    } else {
                        creep.moveTo(lab);
                    }
                    return true;
                }
                if (lab.energy < 20 * (boost.mineralAmount / 30)) {
                    creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                    return true;
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

                    return true;
                }

                creep.say('BT' + boost.mineralAmount);
                boost.timed--;

                return true;
            }
        }
        if (boost.timed <= 0 || boost.timed === undefined) {
            boost.mineralType = 'none';
        }
        return true;
    }

    static doNuke(creep) {
        let nuke = creep.room.nuke;
        if (nuke === undefined || nuke === null) return false;
        if (nuke.ghodium == nuke.ghodiumCapacity && nuke.energy == nuke.energyCapacity) return false;
        console.log(creep, '@ doNuke', roomLink(creep.room.name));
        if (creep.carryTotal === 0) {
            if (nuke.energy < nuke.energyCapacity) {
                if (creep.room.terminal.store[RESOURCE_ENERGY] === 0) {
                    if (creep.pos.isNearTo(creep.room.storage)) {
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(creep.room.storage);
                    }

                } else {
                    if (creep.pos.isNearTo(creep.room.terminal)) {
                        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
                    } else {
                        creep.moveTo(creep.room.terminal);
                    }
                }
            } else if (nuke.ghodium < nuke.ghodiumCapacity) { //&& terminal.store[RESOURCE_GHODIUM] !== undefined
                if (creep.room.terminal.store.G === undefined || creep.room.terminal.store.G === 0) {
                    _terminal_().requestMineral(creep.room.name, 'G');
                }
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.withdraw(creep.room.terminal, 'G');
                } else {
                    creep.moveTo(creep.room.terminal);
                }
            }

        } else {

            if (creep.carrying === 'G' && nuke.ghodium == nuke.ghodiumCapacity) {
                creep.moveToTransfer(creep.room.terminal, creep.carrying);
            } else if (creep.carrying === RESOURCE_ENERGY && nuke.energy == nuke.energyCapacity) {
                creep.moveToTransfer(creep.room.terminal, creep.carrying);
            } else {
                creep.moveToTransfer(nuke, creep.carrying);
            }
        }
    }
    static doMineralContainer(creep) {
        var targetContain = Game.getObjectById(creep.room.memory.mineralContainID);

        var min = Game.getObjectById(creep.room.memory.mineralID);
        if (targetContain === null || targetContain.total < 1000 || min === null) {
            return false;
        }
        //        console.log(creep, '@ doMinContain', roomLink(creep.room.name),targetContain);
        if (creep.carryTotal > 0) {
            creep.moveToTransfer(creep.room.terminal, creep.carrying);
            creep.say('!');
        } else {
            mineralContainerEmpty(creep);
            creep.say('!!');

        }
        return true;
    }


    static doLabs(creep) {
        if (!creep.room.memory.labsNeedWork) return false;

        //        console.log(creep, '@ doLabs', roomLink(creep.room.name));
        //        creep.say('labs');

        var total = creep.carryTotal;
        if (total === 0) {
            creep.memory.putaway = false;
        } else {
            creep.memory.putaway = true;
        }

        if (creep.memory.putaway && creep.saying !== 'redo') {
            if (!labsBuild.moveToTransfer(creep)) {

                if (creep.room.terminal.total === 300000 || (creep.room.name == 'E33S76')) {
                    roleParent.containers.moveToStorage(creep);
                } else {
                    creep.say('term');
                    //roleParent.containers.moveToTerminal(creep);
                    creep.moveToTransfer(creep.room.terminal, creep.carrying);
                }
                return true;
            }
        } else {
            var _labs = labsBuild.getLabs(creep.room.name);
            if (!labNeedReducing(creep)) {
                if (_labs.length > 0) { // If there are labs. 
                    var i = _labs.length;
                    var plan = labsBuild.getPlans(_labs[0].pos.roomName); // get the plans
                    while (i--) { // go through them

                        if (plan[i].id == _labs[i].id && (plan[i].resource !== _labs[i].mineralType) && (_labs[i].mineralAmount > plan[i].emptied ? 500 : 0) && _labs[i].id !== creep.room.memory.boostLabID) {
                            creep.say('clear');

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

                    if (!labsBuild.getFromTerminal(creep)) {
                        let otherThings = false;
                        if (!otherThings) {
                            creep.say('<3', true);
                            creep.room.memory.labsNeedWork = false;
                        }

                    }

                }
            }
        }
        return true;
    }
}

module.exports = jobs;