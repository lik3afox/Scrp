var movement = require('commands.toMove');
var roleParent = require('role.parent');

function lookAtSpot(creep) {

    let atFeet;
    if (creep.room.name === 'E59S51') {
        atFeet = creep.room.lookAt(34, 6);
    } else {
        atFeet = creep.room.lookAt(31, 10);
    }

    for (var i in atFeet) {
        if (atFeet[i].type === 'energy') {
            creep.pickup(atFeet[i].energy);
            return true;
        } else if (atFeet[i].type === 'resource') {
            creep.pickup(atFeet[i].resource);
            return true;
        } else if (atFeet[i].type === 'tombstone') {
            for (let e in atFeet[i].tombstone.store) {
                if (atFeet[i].tombstone.store[e] > 0) {
                    creep.withdraw(atFeet[i].tombstone, RESOURCE_ENERGY);
                    return true;
                }
            }
        }

    }
    return false;
}


function getEnergy(creep) {
    creep.say('get');
    if (creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
        creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
    } else if (creep.room.storage.store[RESOURCE_ENERGY] > 0) {
        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
    }

}

function depositEnergy(creep) {
    creep.say('put');
    if (creep.room.controller.level === 0) return;
    let alpha = creep.room.alphaSpawn;
    if (alpha && creep.room.alphaSpawn.energy < 150) {
        creep.transfer(creep.room.alphaSpawn, RESOURCE_ENERGY);
        return;
    }
    switch (creep.room.controller.level) {
        case 4:
        case 5:
            if (creep.room.storage.total <= 998000) {
                creep.transfer(creep.room.storage, creep.carrying);
            } else {
                creep.sleep(5);
            }
            break;
        case 6:
        case 7:
            let lab = creep.room.boostLab;
            if (lab && lab.energy < 2000 && creep.carry[RESOURCE_ENERGY] > 0) {
                creep.transfer(lab, RESOURCE_ENERGY);
            } else if (creep.room.storage.total <= 998000 && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
                creep.transfer(creep.room.storage, creep.carrying);
            } else if(creep.room.storage.total === 0) {
                creep.sleep(15);
            }else {
                creep.sleep(5);
            }
            break;
        default:
            creep.sleep(5);
            break;
    }

}
//STRUCTURE_POWER_BANK:
class templeManagement extends roleParent {
    static levels(level) {
        return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,  ];
    }
    static boosts(level) {
        return [];
    }

    static run(creep) {

        if (creep.pos.isEqualTo(creep.partyFlag)) {
            if (creep.room.name === creep.partyFlag.pos.roomName && creep.room.storage.total !== creep.room.storage.store[RESOURCE_ENERGY] && !creep.room.terminal.full && creep.carryTotal === 0) {
                for (let i in creep.room.storage.store) {
                    if (i !== RESOURCE_ENERGY) {
                        creep.withdraw(creep.room.storage, i);
                        break;
                    }
                }
                return;
            }
if(creep.room.controller.level > 0){
            let alpha = creep.room.alphaSpawn;
            if (creep.ticksToLive < 1400 && alpha.energy > 100) {
                alpha.renewCreep(creep);
            }
}

            if (creep.carryTotal > 0) {
                if (creep.carry.XGH2O > 0) {
                    let lab = creep.room.boostLab;
                    if (lab.mineralAmount !== 3000) {
                        creep.transfer(lab, 'XGH2O');
                    } else {
                        if (creep.room.terminal.total !== 300000) {
                            creep.transfer(creep.room.terminal, 'XGH2O');
                        } else {
                            creep.transfer(creep.room.storage, 'XGH2O');
                        }

                    }

                } else if (creep.carrying !== RESOURCE_ENERGY) {
                    if (creep.room.terminal.total !== 300000) {
                        creep.transfer(creep.room.terminal, creep.carrying);
                    } else {
                        creep.transfer(creep.room.storage, creep.carrying);

                    }
                } else {
                    depositEnergy(creep);
                }
            } else {
                let lab = creep.room.boostLab;
                if (lab && (creep.room.controller.level > 5 && lab.mineralType !== 'XGH2O' || lab.mineralAmount < 3000)) {
                    let amount = 3000 - lab.mineralAmount;
                    creep.withdraw(creep.room.terminal, 'XGH2O', amount);
                } else {
                    getEnergy(creep);
                }
            }

        } else {
            movement.flagMovement(creep);
        }
    }
}

module.exports = templeManagement;