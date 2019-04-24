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
        creep.moveMe(Game.rooms[creep.memory.home].alphaSpawn, {
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
    if (roleParent.keeperWatch(creep)) {
        return;
    }
    if (!roleParent.guardRoom(creep)) {
        let goal = Game.getObjectById(creep.memory.goal);
        if (goal && !creep.pos.inRangeTo(goal, 8)) {
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

function updateMemory(creep, actionObjects) {

}

function actions(creep, actionObjects) {

}

function movement(creep, actionObjects) {

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

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.movement.runAway(creep)) {
            return;
        }
        if (creep.memory.keeperLairID === 'none') {
            creep.memory.keeperLairID = undefined;
        }
        if (creep.memory.goHome === undefined) {
            creep.memory.goHome = false;
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


        var actionObjects = {
            goalPos: roleParent.movement.getSourcePos(creep), // This gains a pos roomPosition returned
            keeper: Game.getObjectById(creep.memory.keeperLairID),
        };

        //    updateMemory(creep, actionObjects);
        //      actions(creep, actionObjects);
        //        movement(creep, actionObjects);
        if(creep.memory.tombStoner === undefined && actionObjects.goalPos){ //
        let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(actionObjects.goalPos.roomName);
            if (parsed[2] % 5 === 0 && parsed[4] % 5 === 0) {
                creep.memory.tombStoner = false;
            } else {
                creep.memory.tombStoner = true;
            }
        }
        let _goal = Game.getObjectById(creep.memory.goal);
        if (creep.memory.tombStoner === false && _goal && _goal.mineralAmount === 0) {
            console.log(roomLink(creep.room.name), "Bad stoner");
            creep.memory.death = true;
            return;
        } else {
            super.rebirth(creep);
        }
        if (creep.memory.goHome) {
            goHomeAndDeposit(creep);
        } else { // IF not going home. 
            
            if (_goal && _goal.mineralAmount > 0) {
                getMineral(creep);
            } else {
            if (!_goal || !creep.pos.inRangeTo(actionObjects.goalPos, 4) ) {
                creep.moveMe(actionObjects.goalPos, { reusePath: 50 });
                return;
            }
                if (!roleParent.constr.withdrawFromTombstone(creep, 7) && actionObjects && actionObjects.keeper) {
                    creep.runFrom(actionObjects.keeper);
                    if (actionObjects.ticksToSpawn) {
                        creep.sleep(actionObjects.ticksToSpawn - 1);
                        if (creep.isAtEdge) {
                            creep.moveInside();
                        }
                    } else {
                        creep.sleep(15);

                    }

                }
            }

        }

    }

}
module.exports = transportz;