var movement = require('commands.toMove');
var roleParent = require('role.parent');
var spots = [
    new RoomPosition(32, 9, 'E14S38'),
    new RoomPosition(33, 10, 'E14S38'),
    new RoomPosition(34, 9, 'E14S38'),
    new RoomPosition(34, 8, 'E14S38'),
    new RoomPosition(33, 8, 'E14S38'),
    new RoomPosition(32, 8, 'E14S38'),
];

function doRenew(creep) {
    switch (creep.memory.roleID) {
        case 0:
            if (creep.room.storage.store[RESOURCE_ENERGY] > 100000) {
                return true;
            }
            break;
            //                    case 1:
        default:
            if (creep.room.storage.store[RESOURCE_ENERGY] > 200000) {
                return true;
            }
            break;
    }
    return false;
}

function takeFromSpot(creep, x, y) {
    let atFeet = creep.room.lookAt(x, y);
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

function anotherAtSpot(creep, pos) {
    if (!creep.pos.isEqualTo(spots[creep.memory.spot])) return false;
    let atFeet = creep.room.lookAt(pos);
    for (var i in atFeet) {
        if (atFeet[i].type === 'creep') {
            return true;
        }
    }
    return false;
}


function getEnergy(creep) {
    if (creep.memory.spot === 0) {
        if (creep.room.controller.level < 6 && takeFromSpot(creep, 32, 9)) return;
    }
    creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
}
//STRUCTURE_POWER_BANK:
class templeUpgrader extends roleParent {
    static levels(level) {
        return [MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            CARRY, CARRY, CARRY, CARRY, CARRY,
        ];
    }
    static boosts(level) {
        return [];
    }

    static run(creep) {
        let tgt = Game.getObjectById('5c3cded15c593f5cfb903370');
        if (tgt !== null) {
            creep.build(tgt);
        }

        if (Game.rooms.E14S38 && creep.room.name === 'E14S37' && creep.pos.inRangeTo(creep.room.boostLab, 3) && Game.rooms.E14S38.controller.level < 6) {
            if (creep.memory.boostNeeded === undefined) {
                creep.memory.boostNeeded = ['XGH2O'];
            }
            if (super.boosted(creep)) {
                return;
            }
        }
        var tRoom;
        var labsIDs;
        if (creep.memory.party === 'templar') {
            tRoom = 'E14S38';
            spots = [
                new RoomPosition(32, 9, 'E14S38'),
                new RoomPosition(33, 10, 'E14S38'),
                new RoomPosition(34, 9, 'E14S38'),
                new RoomPosition(34, 8, 'E14S38'),
                new RoomPosition(33, 8, 'E14S38'),
                new RoomPosition(32, 8, 'E14S38'),
            ];
            labsIDs = ['5c030bdc7a11b045dccca412', '5c03152df25c2952a7c44511'];
        }
        if (creep.memory.party === 'templar2') {
            tRoom = 'E59S51';
            spots = [
                new RoomPosition(34, 6, 'E59S51'),
                new RoomPosition(35, 7, 'E59S51'),
                new RoomPosition(36, 6, 'E59S51'),
                new RoomPosition(36, 5, 'E59S51'),
                new RoomPosition(35, 5, 'E59S51'),
                new RoomPosition(34, 5, 'E59S51'),
            ];
            labsIDs = [];

            if(creep.room.name === 'E58S51' && creep.carryTotal === 0){
                if(creep.pos.isNearTo(creep.room.terminal)){
                    creep.withdraw(creep.room.terminal,RESOURCE_ENERGY);
                }else 
                if(creep.pos.isNearTo(creep.room.storage)){
                    creep.withdraw(creep.room.storage,RESOURCE_ENERGY);
                }
            }
            if(creep.room.name === 'E59S51' && creep.carryTotal > 0 && !creep.pos.isNearTo(creep.room.storage)){
                let look = creep.room.lookAt(creep.pos.x,creep.pos.y);
                let foundSomething = false;
                for(let i in look){
                    if(look[i].structure){
                        foundSomething = true;
                        if(look[i].structure.hits < 1000)
                        creep.repair(look[i].structure);
                    } else if(look[i].constructionSite){
                        creep.build(look[i].constructionSite);
                        foundSomething = true;
                    }
                }
                if(!foundSomething){
                    creep.room.createConstructionSite(creep.pos.x, creep.pos.y, "road");
                }
            }

        }
        if (creep.room.name === tRoom) {
            if (creep.memory.spot === undefined) {
                creep.memory.spot = 0;
                //                creep.memory.spot = spots.length - 1;
                if (anotherAtSpot(creep, spots[0])) {
                    let i = spots.length - 1;
                    while (anotherAtSpot(creep, spots[i])) {
                        i--;
                    }
                    creep.memory.spot = i;
                }
            }

            if (creep.carryTotal <= 40) {
                getEnergy(creep);
            }
            if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
                for (let ie in creep.carry) {
                    if (ie !== RESOURCE_ENERGY) {
                        creep.transfer(creep.room.storage, ie);
                    }
                }
            }

            creep.upgradeController(creep.room.controller);

            if (!creep.pos.isEqualTo(spots[creep.memory.spot]) || creep.memory.doPickUp === true || creep.memory.passThis === true) {
                creep.moveMe(spots[creep.memory.spot], { reusePath: 50,ignoreCreeps:true });
            } else {
                let advance = false;
                switch (creep.memory.spot) {
                    case 0: // Renew Spot
                        if (creep.room.controller.level > 5 && creep.ticksToLive < 1495) {
                            if (creep.memory.boosted === true) {
                                //                                console.log("boosted",creep.memory.doPickUp,creep.room.boostLab.cooldown,creep.memory.boosted );
                                if (creep.memory.doPickUp === true) {
                                    if (!takeFromSpot(creep, creep.pos.x, creep.pos.y)) {
                                        creep.memory.doPickUp = undefined;
                                        creep.memory.boosted = undefined;
                                    }
                                } else if (creep.room.boostLab.cooldown === 0) {
                                    if (creep.room.boostLab.unboostCreep(creep) === OK) {
                                        creep.memory.doPickUp = true;
                                    }
                                } else {
                                    creep.memory.boosted = undefined;
                                }
                            } else if (creep.memory.boosted === undefined || creep.ticksToLive < 5) {
                                if ((creep.body[5].boost !== null&&creep.body[5].boost !== undefined) && creep.ticksToLive > 1450) {
                                    console.log(creep.body[5].boost, creep, "templares?", creep.ticksToLive,Game.time,roomLink(creep.room.name));
                                    if(creep.body[5].boost  === 'XGH2O') advance = true;
                                } else {
                                    if(creep.room.alphaSpawn ) creep.room.alphaSpawn.renewCreep(creep);
                                }

                            }
                        } else if (creep.room.controller.level > 5) {
                            let lab = creep.room.boostLab;
                            if (lab && lab.energy === 2000 && lab.mineralAmount === 3000 && Memory.stats.totalMinerals.XGH2O > 300000) {
                                if (lab.boostCreep(creep) === OK) {
                                    advance = true;
                                    creep.memory.boosted = true;
                                }
                            } else {
                                advance = true;
                            }
                        } else {
                            if (anotherAtSpot(creep, spots[spots.length - 1])) {
                                // If there's someone waiting at the last spot.
                                advance = true;
                            }
                        }
                        break;
                    case spots.length - 1: // last spot in wait line
                        if (creep.memory.boosted) {

  //                          takeFromSpot(creep, 31, 8);
//                            takeFromSpot(creep, 32, 7);
                            if ((creep.ticksToLive < 50 && creep.room.boostLab.cooldown !== 0)) {
                                if (creep.memory.doPickUp) {
                                    if (!takeFromSpot(creep, creep.pos.x, creep.pos.y)) {
                                        creep.memory.doPickUp = undefined;
                                        creep.memory.boosted = undefined;
                                    }
                                } else {

                                    
                                    if (creep.room.controller.level === 710) {
                                        labsIDs = ['5c030bdc7a11b045dccca412', '5c03152df25c2952a7c44511', '5c047e8bb018e87c9640c158', '5c0472748a6d6c02c257888d', '5c04681e45706e02c893fbf8'];
                                    }
                                    for (let i in labsIDs) {
                                        let lab = Game.getObjectById(labsIDs[i]);
                                        if (lab !== null && lab.cooldown === 0) {
                                            if (creep.pos.isNearTo(lab)) {
                                                if (lab.unboostCreep(creep) === OK) {
                                                    creep.memory.doPickUp = true;
                                                    creep.memory.passThis = undefined;
                                                }
                                            } else {
                                                creep.moveMe(lab);
                                            }
                                            creep.memory.passThis = true;
                                            break;
                                        }
                                    }

                                }


                            } else if (creep.ticksToLive < 10 && creep.room.name !== 'E59S51') {
                                //console.log('boosted undefined for 10 <');
                                //creep.memory.boosted = undefined;
                                advance = true;
                            }
                        } else {
                            if (creep.room.controller.level > 5 && !anotherAtSpot(creep, spots[0])) {
                                advance = true;
                            }
                        }

                        break;
                    default:
                        advance = true;
                        break;
                }


                if (creep.memory.waitSpot === undefined || creep.memory.waitSpot === null) creep.memory.waitSpot = 0;
                creep.memory.waitSpot--;
                if (advance && creep.memory.waitSpot < 0) {
                    let nextSpot = creep.memory.spot + 1;
                    if (nextSpot > spots.length) nextSpot = 0;
                    let result = anotherAtSpot(creep, spots[nextSpot]);
                    //                    console.log("another spot look at", result, creep.memory.spot, "Looking at",nextSpot);
                    if (!result) {
                        creep.memory.spot++;
                        if (creep.memory.spot > spots.length - 1) {
                            creep.memory.spot = 0;
                        }
                    } else {
                        creep.memory.waitSpot = 10;
                    }

                }

            }
        } else {
            creep.moveMe(creep.partyFlag, { reusePath: 50,ignoreCreeps:true });
        }
    }
}

module.exports = templeUpgrader;