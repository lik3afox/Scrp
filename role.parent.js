// Base parent class for all roles - this has basic functions that all
// classes use to do there thing.
var sign = '[Ypsilon Pact]: Territory Claimed by Likeafox. Respect our Borders.';
var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var movement = require('commands.toMove');
var links = require('build.link');
var spawnsCC = require('commands.toSpawn');
var labsBuild = require('build.labs');
var power = require('build.power');
var segment = require("commands.toSegment");
//var party = require('commands.toParty');
var fox = require('foxGlobals');

function keeperFindAt(xx, yy, creep) {
    if (creep.memory.keeperLairID === undefined) {
        let varen = 9;
        if (yy - varen < 0) yy = varen;
        if (xx - varen < 0) xx = varen;
        if (yy + varen > 49) yy = 49 - varen;
        if (xx + varen > 49) xx = 49 - varen;
        let find = creep.room.lookForAtArea(LOOK_STRUCTURES, yy - varen, xx - varen, yy + varen, xx + varen, true);
        var e = find.length;
        while (e--) {
            if (find[e].structure.structureType == STRUCTURE_KEEPER_LAIR) {
                creep.memory.keeperLairID = find[e].structure.id;
                return;
            }
        }
        if (creep.memory.keeperLairID === undefined) {
            creep.memory.keeperLairID = null;
        }
    }
}


function newBoosted(creep, boosted) {
    if (creep.room.name === creep.memory.home && creep.ticksToLive < 75 && creep.memory.isBoosted && creep.memory.isBoosted.length > 0) {
        creep.memory.death = true;
        return false;
    }
    if (creep.memory.home !== creep.room.name) return false;
    if (!creep.room.boostLab) return false;

    if (creep.memory.boostNeeded && creep.memory.boostNeeded.length > 0) {
        if (creep.ticksToLive < 1250) {
            console.log("Creep has:", creep.ticksToLive, roomLink(creep.room.name), "and waiting for boost still");
        }

        let mineral = creep.memory.boostNeeded[0];
        let need = numCreepParts(creep, mineral);
        if (creep.memory.boostNeeded !== undefined && creep.memory.boostNeeded.length > 0 && creep.memory.home == creep.room.name) {
            if (creep.room.memory.boost) {
                //                if(creep.room.memory.boost.creepID !== creep.id)    console.log('boost already existant',roomLink(creep.room.name));
            } else {
                creep.room.memory.boost = {
                    mineralType: mineral,
                    resourcesNeeded: need,
                    creepID: creep.id,
                };
            }
            creep.say('💊Wait');

        }
        return true;
    }
    return false;
}

function numCreepParts(creep, boostType) {
    let count = 0;
    for (let i in creep.body) {
        let type = creep.body[i].type; //'work'
        if (BOOSTS[type][boostType] !== undefined && !creep.body[i].boost) {
            // Means that this is a good boost for this body type.   
            count++;
        }
    }
    return {
        mineral: 30 * count,
        energy: 20 * count,
        count: count,
    };
}

var roomTested;

class baseParent {

    static get labs() {
        return labsBuild;
    }
    static get segment() {
        return segment;
    }

    static get link() {
        return links;
    }
    static get fox() {
        return fox;
    }

    static get spawns() {
        return spawnsCC;
    }

    static get containers() {
        return containers;
    }


    static get constr() {
        return constr;
    }
    static get movement() {
        return movement;
    }
    static get power() {

        return power;
    }
    constructor() {}

    levels(level) {}
    boosts(level) {}



    static boosted(creep, boosted) {
        return newBoosted(creep);
    }

    static keeperWatch(creep) {
        // finds the structure 
        if (creep.memory.keeperLairID == 'none') return;
        if (creep.memory.keeperLairID !== undefined) { // THis is obtained when 
            let keeper = Game.getObjectById(creep.memory.keeperLairID);
            //          if(creep.memory.keeperLairID != undefined &&  keeper.ticksToSpawn  == undefined) return true;
            if (keeper === null) return false;
            if (keeper.ticksToSpawn !== undefined)
                keeper.room.visual.text(keeper.ticksToSpawn, keeper.pos.x, keeper.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
            let _goal = Game.getObjectById(creep.memory.goal);
            let newPos = new RoomPosition(_goal.pos.x, _goal.pos.y, _goal.pos.roomName);
            if (creep.room.name != _goal.pos.roomName) return;
            let dis = creep.pos.getRangeTo(newPos);
            if (dis > 8) return false;

            if (keeper.ticksToSpawn === undefined || keeper.ticksToSpawn < 15) {

                if (dis == 7) {
                    creep.sleep(7);
                    //creep.dance();
                    return true;
                }
                if (dis < 7) {
                    //                    creep.say('inc!' + dis);
                    if (creep.memory.role == 'miner' && creep.carry[RESOURCE_ENERGY] > 0) {
                        let zz = Game.getObjectById(creep.memory.workContainer);
                        if (zz !== null) {
                            creep.transfer(zz, RESOURCE_ENERGY);
                        }
                    }
                    if (creep.partyFlag) {
                        let tgt = new RoomPosition(25, 25, creep.room.name);
                        creep.moveMe(tgt, { reusePath: 10 });
                    } else if (creep.memory.runFromKeeper === undefined) {
                        creep.say('a');
                        var keys = Object.keys(Game.flags);
                        var o = keys.length;
                        while (o--) {
                            var e = keys[o];
                            if (Game.flags[e].room !== undefined && Game.flags[e].room.name == creep.room.name && Game.flags[e].color === COLOR_YELLOW) {
                                creep.memory.runFromKeeper = new RoomPosition(Game.flags[e].pos.x, Game.flags[e].pos.y, Game.flags[e].pos.roomName);
                                creep.moveTo(creep.memory.runFromKeeper, { ignoreRoads: true, maxOpts: 50 });
                                return true;
                            }
                        }
                        if (creep.memory.runFromKeeper === undefined) {
                            creep.memory.runFromKeeper = Game.rooms[creep.memory.home].alphaSpawn.pos;
                            creep.moveTo(creep.memory.runFromKeeper, { ignoreRoads: true, maxOpts: 50 });
                        }
                    } else {
                        creep.say('b');
                        creep.moveTo(new RoomPosition(creep.memory.runFromKeeper.x, creep.memory.runFromKeeper.y, creep.memory.runFromKeeper.roomName), { ignoreRoads: true, reusePath: 10 });
                    }

                    return true;

                } else {

                    return false;
                }
            } else {
                return false;
            }
        }
        return false;
    }

    static guardRoom(creep) {
        if (roomTested === undefined) roomTested = {};
        if (roomTested[creep.room.name] === false) {
            return roomTested[creep.room.name];
        }
        if (roomTested[creep.room.name] === undefined) {
            let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(creep.room.name);
            let fMod = parsed[1] % 10;
            let sMod = parsed[2] % 10;
            let isSK = !(fMod === 5 && sMod === 5) && ((fMod >= 4) && (fMod <= 6)) &&
                ((sMod >= 4) && (sMod <= 6));
            roomTested[creep.room.name] = isSK;
            if (!isSK) return false;
        }

        var D4Bad = creep.pos.findInRange(creep.room.notAllies, 4);

        var D3Bad = creep.pos.findInRange(D4Bad, 3);
        if (D3Bad.length > 0) {
            let resz = creep.runFrom(D4Bad);
            if (resz) {}
            return true;
        } else if (D4Bad.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    static keeperWatch2(creep) {
        // finds the structure 
        if (!creep.memory.isSkGoal) return;
        if (!creep.memory.keeperLairID) return;
        if (creep.memory.keeperLairID !== undefined) { // THis is obtained when 
            let keeper = Game.getObjectById(creep.memory.keeperLairID);
            //          if(creep.memory.keeperLairID != undefined &&  keeper.ticksToSpawn  == undefined) return true;
            if (keeper === null) return false;
            if (keeper.ticksToSpawn !== undefined)
                keeper.room.visual.text(keeper.ticksToSpawn, keeper.pos.x, keeper.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
            let _goal = Game.getObjectById(creep.memory.goal);

            if (creep.room.name != _goal.pos.roomName) return;

            if (keeper.ticksToSpawn === undefined || keeper.ticksToSpawn < 10) {
                let distance = creep.pos.getRangeTo(_goal);
                if (distance < 7) {
                    if (distance <= 5) {
                        var pathfindResult = PathFinder.search(creep.pos, { pos: _goal.pos, range: 6 }, {
                            flee: true,
                            maxOps: 20,
                        });
                        creep.move(creep.pos.getDirectionTo(pathfindResult.path[0]));
                    }
                    return true;
                }
            }
        }
        return false;
    }

    static isRoomSK(creep) {
        if (roomTested === undefined) roomTested = {};
        if (roomTested[creep.room.name] === undefined) {
            let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(creep.room.name);
            let fMod = parsed[1] % 10;
            let sMod = parsed[2] % 10;
            let isSK = !(fMod === 5 && sMod === 5) && ((fMod >= 4) && (fMod <= 6)) &&
                ((sMod >= 4) && (sMod <= 6));
            roomTested[creep.room.name] = isSK;
        }
        return roomTested[creep.room.name];
    }


    static keeperFind(creep) {
        if (creep.memory.keeperLairID) return;
        let target = Game.getObjectById(creep.memory.goal);
        if (target !== null) {
            keeperFindAt(target.pos.x, target.pos.y, creep);
        }
    }

    static spawnRecycle(creep) {
        if (!creep.memory.death || creep.className) {
            return false;
        }
        if (creep.memory.death) {
            //            creep.createTrain();
            if (creep.ticksToLive < 600 && creep.memory.pickUpMinerals && creep.memory.pickUpMinerals > 0) {
                if (creep.pickUpFeet() === OK) {
                    //creep.memory.pickUpMinerals = undefined;
                    creep.memory.pickUpMinerals--;
                    if (creep.memory.pickUpMinerals < -1) creep.memory.pickUpMinerals = undefined;
                } else {
                    creep.memory.pickUpMinerals = undefined;
                }
            }
            if (creep.ticksToLive < 600 && creep.memory.isBoosted && creep.memory.isBoosted.length > 0) { //
                if (creep.carryTotal !== 0) {
                    if (creep.carry[RESOURCE_ENERGY] === creep.carryTotal) {
                        creep.drop(RESOURCE_ENERGY);
                    } else {
                        creep.moveToTransfer(creep.room.storage, creep.carrying, { reusePath: 50, ignoreCreeps: true });
                    }
                    //                    console.log('doing unBoosting w/Enoty @', roomLink(creep.room.name));
                    return true;
                }
                if (creep.room.boostLab && creep.room.boostLab.cooldown === 0) {
                    if (creep.pos.isNearTo(creep.room.boostLab)) {
                        if (creep.room.boostLab.unboostCreep(creep) === OK) {
                            creep.memory.pickUpMinerals = creep.memory.isBoosted.length;
                            creep.memory.isBoosted = [];
                        }
                    } else {
                        creep.moveMe(creep.room.boostLab, { reusePath: 50, range: 1 });
                    }
                    //                  console.log('doing unBoosting w/boostLab @', roomLink(creep.room.name));
                    return true;
                }
                let labs = creep.room.memory.labs;
                for (let ii in labs) {
                    let tLab = Game.getObjectById(labs[ii].id);
                    if (tLab && tLab.cooldown === 0) {
                        if (creep.pos.isNearTo(tLab)) {
                            if (tLab.unboostCreep(creep) === OK) {
                                if (creep.carryCapacity > 0) {
                                    creep.memory.pickUpMinerals = creep.memory.isBoosted.length;
                                }
                                creep.memory.isBoosted = [];
                                if (creep.room.memory.zeroJob && Game.creeps[creep.room.memory.zeroJob]) {
                                    Game.creeps[creep.room.memory.zeroJob].memory.currentJob = 11;
                                } else if (creep.room.memory.jobsToDo && creep.carryCapacity === 0) {
                                    creep.room.memory.jobsToDo.push(11);

                                }
                            }
                        } else {
                            creep.moveMe(tLab, { reusePath: 50, range: 1 });
                        }
                        //      console.log('doing unBoosting w/NonBoostLab @', roomLink(creep.room.name));
                        return true;
                    }
                }
            }


            if (creep.memory._move !== undefined && creep.memory._move.time < Game.time && creep.memory._move.path.length === 0) {
                //              console.log(creep.memory._move.time, Game.time, creep.memory._move.time < Game.time, creep.memory._move.path.length, "Recycle failure path death.",roomLink(creep.room.name));
                //                if(creep.memory.role !== 'homeDefender'){

                //   creep.suicide();
                // return true;
                // }
            }
            if (creep.carryTotal > 0 && creep.room.storage) {
                if (creep.pos.isNearTo(creep.room.storage)) {
                    creep.transfer(creep.room.storage, creep.carrying);
                } else if (creep.pos.isNearTo(creep.room.terminal)) {
                    creep.transfer(creep.room.terminal, creep.carrying);
                }
            }
            creep.say('💀');
            let parent = Game.getObjectById(creep.memory.parent);
            if (!parent) parent = creep.room.alphaSpawn;
            if (parent !== null) {
                creep.memory.leaderID = undefined;
                creep.memory.followerID = undefined;
                creep.moveMe(parent, {
                    reusePath: 50,
                    range: 1,
                    //                    ignoreCreeps: true,
                    visualizePathStyle: {
                        stroke: '#fa0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.1,
                        opacity: 0.5
                    }
                });
                if (creep.pos.isNearTo(parent)) {
                    parent.recycleCreep(creep);
                }
            } else {
                parent = creep.room.alphaSpawn;
                creep.memory.leaderID = undefined;
                creep.memory.followerID = undefined;
                creep.moveMe(parent, {
                    reusePath: 50,
                    ignoreCreeps: true,
                    visualizePathStyle: {
                        stroke: '#fa0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.1,
                        opacity: 0.5
                    }
                });
                if (creep.pos.isNearTo(parent)) {
                    parent.recycleCreep(creep);
                }
            }
            return true;
        }
    }


    static rallyFirst(creep) {
        if (creep.memory.partied) return false;
        var partyFlag = creep.partyFlag;
        if (partyFlag === undefined) return false;
        if (partyFlag.memory.rallyFlag === undefined && !partyFlag.memory.waypointFlag) return false;

        if (partyFlag.memory.rallyFlag !== false) {
            require('commands.toParty').rally(creep.partyFlag);
            if (partyFlag.memory.rallyFlag !== 'home') {
                var pFlag = Game.flags[partyFlag.memory.rallyFlag];
                creep.moveTo(pFlag, { reusePath: 20 });
                creep.say('HR move');
                return true;
            } else {
                if (creep.pos.inRangeTo(creep.homeFlag, 3)) {
                    creep.moveMe(creep.homeFlag, { reusePath: 15 });
                    creep.sleep(3);
                } else {
                    creep.moveMe(creep.homeFlag, { reusePath: 15 });
                }
                creep.say('Ra2' + creep.memory.party);
                return true;
            }
        } else if (partyFlag.memory.waypointFlag !== false) {
            require('commands.toParty').rally(creep.partyFlag);

            let pFlag = Game.flags[partyFlag.memory.waypointFlag];
            creep.moveMe(pFlag, { reusePath: 50 });
            creep.say('way move');
            if (creep.pos.isEqualTo(pFlag)) {
                creep.memory.partied = true;
            }
            return true;

        }

        return false;
    }

    static goToPortal(creep) {
        var partyFlag = Game.flags[creep.memory.party];
        if (partyFlag !== undefined && partyFlag.memory.portal !== false && partyFlag.memory.portal !== undefined) {
            var pFlag = Game.flags[partyFlag.memory.portal];
            if (pFlag === undefined) return false;
            if (creep.room.name == pFlag.pos.roomName) {
                creep.say('P move');
                creep.moveTo(Game.flags[partyFlag.memory.portal], { reusePath: 50 });
                creep.memory.portal = true;
                return true;
            } else if (!creep.memory.portal) {
                creep.say('P move');
                creep.moveTo(Game.flags[partyFlag.memory.portal], { reusePath: 50 });
                return true;
            }
        }
        return false;
    }

    static signControl(creep) {
        if (creep.room.controller.sign === undefined || creep.room.controller.sign.text != sign) {
            creep.say('sign');
            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.signController(creep.room.controller, sign);
            }
            return true;
        }
    }

    static moveToSignControl(creep) {
        if (Memory.war) return false;
        if (creep.room.controller === undefined) return false;
        if (creep.room.controller.owner !== undefined && _.contains(fox.friends, creep.room.controller.owner.username)) return false;
        if (creep.room.controller.sign === undefined || creep.room.controller.sign.text != sign) {
            creep.say('resign');
            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.signController(creep.room.controller, sign);
            } else {
                creep.moveMe(creep.room.controller, { reusePath: 50, maxRooms: 1 });
            }
            return true;
        }
        return false;
    }

    static isPowerParty(creep) {
        if (creep.memory.powerParty !== undefined) {
            return creep.memory.powerParty;
        } else {
            if (creep.memory.party.substr(0, 5) == 'power') {
                creep.memory.powerParty = true;

            } else {
                creep.memory.powerParty = false;

            }
            return creep.memory.powerParty;
        }
    }

    static depositNonEnergy(creep) {

        if (creep.room.name !== creep.memory.home) return false;
        if (creep.room.terminal === undefined && creep.room.storage === undefined) return false;
        if (creep.carryTotal === 0) return false;
        if (creep.carryTotal === creep.carry[RESOURCE_ENERGY]) return false;

        let target;
        //      if (creep.room.terminal !== undefined && creep.room.terminal.total !== 300000 && creep.room.controller !== undefined && creep.room.controller.level >= 6) {
        //        target = creep.room.terminal;
        //        } else {
        target = creep.room.storage;
        //   }

        var keys = Object.keys(creep.carry);
        var p = keys.length;
        while (p--) {
            var e = keys[p];
            if (e != RESOURCE_ENERGY && creep.carry[e] > 0) {
                creep.say('chzzburger');
                creep.moveToTransfer(target, e);
                return true;
            }
        }
    }

    static rebirth(creep) {
        if (creep.memory.reportDeath) return true;
        let distance = 0;
        if (creep.memory.distance !== undefined) distance = creep.memory.distance;

        switch (creep.memory.role) {
            case "guard":
                distance += 20;
                break;
        }

        if (creep.ticksToLive < ((3 * creep.body.length) + distance)) {
            require('commands.toCreep').reportDeath(creep);
            creep.memory.reportDeath = true;
            return true;
        }
        return false;
    }

}

module.exports = baseParent;