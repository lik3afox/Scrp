var roleParent = require('role.parent');
var rePath = 100;
var _ignoreRoad = true;
var pathVis = {
    fill: 'transparent',
    stroke: '#ff0',
    lineStyle: 'dashed',
    strokeWidth: 0.15,
    opacity: 0.5
};

var classLevels = [
    // MAX level 6 
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY],
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, CARRY],
    [MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, MOVE, HEAL]

];

function goHomeAndDeposit(creep) {
    if (creep.room.name === creep.memory.home) {
        creep.storeCarrying();
    } else {
        creep.moveMe(Game.rooms[creep.memory.home].alphaSpawn,{
            ignoreRoads: _ignoreRoad,
            reusePath: 50,
            useSKPathing: true,
            visualizePathStyle: pathVis
        });
    }
}

function doMineralParty(creep) {
    if (creep.partyFlag !== undefined && creep.partyFlag.memory.mineral) {
        if (roleParent.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }

        if (!creep.memory.goHome) {
            let sci = Game.getObjectById(creep.memory.scientistID);
            if (creep.room.name !== creep.partyFlag.pos.roomName || !creep.pos.inRangeTo(creep.partyFlag, 6) || creep.isAtEdge || creep.pos.x === 48) {
                let min = Game.getObjectById(creep.partyFlag.memory.mineralID);
                if (min) {
                    creep.moveMe(min, { reusePath: 50, useSKPathing: true, swampCost: 1 });

                } else {
                    creep.moveMe(creep.partyFlag, { reusePath: 50, useSKPathing: true, swampCost: 1 });
                }
            } else {
                if (sci === null) {
                    creep.memory.scientistID = undefined;
                    if (creep.carryTotal > 0) {
                        creep.memory.goHome = true;
                    } else {
                        creep.memory.goal = creep.partyFlag.memory.mineralID;
                    }
                    creep.sleep(5);
                    return;
                } else if (sci.pos.inRangeTo(creep.partyFlag, 8)) {
                    if (!creep.pos.isNearTo(sci)) {
                        creep.moveMe(sci, { swampCost: 1, reusePath: 10 });
                        return true;
                    } else {
                        roleParent.keeperFind(creep);
                        
                    }
                    let sk = Game.getObjectById(creep.memory.keeperLairID);
                    if (sk && sk.ticksToSpawn < 20 && sci.carryTotal > 0) {
                        sci.transfer(creep, sci.carrying);
                    } else if (sci.carryTotal > sci.carryCapacity >> 1) {
                        sci.transfer(creep, sci.carrying);
                    } else if (creep.ticksToLive < 100) {
                        sci.transfer(creep, sci.carrying);
                        creep.memory.goHome = true;
                    }

                    creep.say('go sci');
                    if (creep.pos.isNearTo(sci)) creep.sleep(EXTRACTOR_COOLDOWN * 5);
                }
            }
        } else {
            goHomeAndDeposit(creep);
        }
        return true;
    }
    return false;
}

function getMineral(creep) {
    // Creep is only responsable for getting to scientist 
    //    console.log('Ztransport doing scientist', roomLink(creep.room.name));
    creep.say('mv Min');
    if (roleParent.keeperWatch(creep)) {

        return;
    }

    if (!roleParent.guardRoom(creep)) {
        let goal = Game.getObjectById(creep.memory.goal);
        if (goal && !creep.pos.inRangeTo(goal, 7)) {
            creep.moveMe(goal, { reusePath: 50, useSKPathing: true, swampCost: 1 });
        } else {
            roleParent.keeperFind(creep);
            let _sci = Game.getObjectById(creep.memory.scientistID);
            if (_sci !== null && !creep.pos.isNearTo(_sci) && goal && _sci.pos.isNearTo(goal)) {
                creep.moveMe(_sci, { reusePath: 50, useSKPathing: true, swampCost: 1 });
            } else if (_sci) {
                if (creep.pos.isNearTo(_sci)) creep.sleep(EXTRACTOR_COOLDOWN * 2);
            } else {
                creep.say('Wn4Sci');

            }
        }


    }
    if (creep.ticksToLive < 100) {
        creep.memory.goHome = true;
    }

}


function getEnergy(creep) {

    let target = Game.getObjectById(creep.memory.gotoID);

    if (!target || creep.memory.gotoID === undefined) {
        var tmp;
        creep.memory.targetType = undefined;
        tmp = creep.room.find(FIND_TOMBSTONES);
        tmp = _.filter(tmp, function(o) {
            return o.total > 0;
        });
        if (tmp.length > 0) {
            tmp = _.max(tmp, a => a.total);
            creep.memory.targetType = FIND_TOMBSTONES;
            creep.memory.gotoID = tmp.id;
            target = tmp;
        }

        if (creep.memory.targetType === undefined) {
            tmp = creep.room.find(FIND_DROPPED_RESOURCES);
            if (tmp.length > 0) {
                let max = _.max(tmp, a => a.amount);
                creep.memory.targetType = FIND_DROPPED_RESOURCES;
                creep.memory.gotoID = max.id;
                target = max;
            }
            if (creep.memory.targetType === undefined) { // If the energy on the gound is now. then
                var containerz = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType === STRUCTURE_CONTAINER);
                    }
                });
                if (containerz.length > 0) {
                    let max = _.max(containerz, a => a.store[RESOURCE_ENERGY]);
                    creep.memory.targetType = STRUCTURE_CONTAINER;
                    creep.memory.gotoID = max.id;
                    target = max;
                }
            }
        }
    }


    if (target !== null) {
        creep.room.visual.line(creep.pos, target.pos, { color: 'red' });
        if (creep.pos.isNearTo(target)) {
            switch (creep.memory.targetType) {
                case FIND_DROPPED_RESOURCES:
                    creep.pickup(target);
                    creep.memory.gotoID = undefined;
                    creep.memory.targetType = undefined;
                    break;
                default:
                    for (let aee in target.store) {
                        if (target.store[aee] > 0) {
                            creep.withdraw(target, aee);
                            break;
                        }
                    }
                    creep.memory.gotoID = undefined;
                    creep.memory.targetType = undefined;
                    break;

            }
        } else {
            if (!roleParent.guardRoom(creep)) {
                creep.moveMe(target, {
                    ignoreRoads: _ignoreRoad,
                    maxRooms: 1,
                    useSKPathing: true,
                    reusePath: rePath,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#ff0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });
                creep.say("bizc");
            }
        }

        switch (creep.memory.targetType) {
            case FIND_DROPPED_RESOURCES:
                if (target.amount === undefined || target.amount === 0) {
                    creep.memory.gotoID = undefined;
                    creep.memory.targetType = undefined;
                }
                break;
            default:
                if (target.store === undefined || target.store[RESOURCE_ENERGY] === undefined || target.store[RESOURCE_ENERGY] === 0) {
                    creep.memory.gotoID = undefined;
                    creep.memory.targetType = undefined;
                }
                break;
        }
    } else {
        creep.memory.gotoID = undefined;
    }

}

class transportz extends roleParent {

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
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
        if(creep.memory.home === 'E24S33'){
            require('role.mTransport').run(creep);
            return;
        }
        var start = Game.cpu.getUsed();
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
        }
        if (creep.memory.goHome === undefined) {
            creep.memory.goHome = false;
        }

        super.rebirth(creep);
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.movement.runAway(creep)) {
            return;
        }
        if (creep.partyFlag !== undefined && (creep.partyFlag.color === COLOR_WHITE || creep.partyFlag.color === COLOR_BROWN)) {
            creep.memory.death = true;
        }

        if (creep.carryTotal > creep.carryCapacity - 45) {
            creep.memory.goHome = true;
        }

        if (creep.carryTotal <= 0) {
            creep.memory.goHome = false;
        }
        //if (Game.shard.name === 'shard1') console.log("ztrans: after init",Game.cpu.getUsed() - start,creep); 

        // Two modes for ztransports
        // mode 1 is where they have a scientist to take off of,
        // mode 2 is where they have to collect energy from the room.
        // creep.memory.scientistID gets given too by an scientist.
        if (doMineralParty(creep)) {

            return;
        }

        start = Game.cpu.getUsed();
        if (super.depositNonEnergy(creep)) {
            return;
        }
        if (creep.carry[RESOURCE_ENERGY] > 0 && super.link.transfer(creep)) {
            return;
        }
        if (creep.memory.goHome) {
            goHomeAndDeposit(creep);
        } else { // IF not going home. 
            let _goal = Game.getObjectById(creep.memory.goal);
            if (_goal !== null && creep.room.name == _goal.pos.roomName) {
                if (_goal.mineralAmount > 0) {
                    getMineral(creep);
                } else {
                    getEnergy(creep);
                }
            } else {
                creep.moveMe(super.movement.getSourcePos(creep), { reusePath: 50 });
            }
            if(!creep.memory.party && creep.room.controller && creep.room.controller.level < 6 && creep.room.name === 'E14S38'){
                creep.memory.death = true;
            }else if(!creep.memory.party && creep.room.controller && _goal && _goal.pos.roomName === creep.room.name && _goal.mineralAmount === 0){
                creep.memory.death = true;
            }
        }
        //  if (Game.shard.name === 'shard1') console.log("ztrans: after NOrmal",Game.cpu.getUsed() - start); start = Game.cpu.getUsed();

    }

}
module.exports = transportz;