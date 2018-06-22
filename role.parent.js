// Base parent class for all roles - this has basic functions that all
// classes use to do there thing.
var sign = '[Ypsilon Pact]: Territory Claimed by Likeafox. Respect our Borders.';
var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var movement = require('commands.toMove');
var links = require('build.link');
var spawnsCC = require('commands.toSpawn');
var labsBuild = require('build.labs');
var power = require('commands.toPower');
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
            creep.memory.keeperLairID = 'none';
        }
    }
}

function numberOfBody(creep, boost) {
    var total = 0;
    let type;
    if (boost === undefined) {
        //        console.log(creep, "trying to do boost for:", boost);
        return;
    }
    switch (boost) {
        case "UH":
        case "UH2O":
        case "XUH2O":
            type = ATTACK;
            break;
        case "LO":
        case "LHO2":
        case "XLHO2":
            type = HEAL;
            break;
        case "KO":
        case "KHO2":
        case "XKHO2":
            type = RANGED_ATTACK;
            break;
        case "ZO":
        case "ZHO2":
        case "XZHO2":
            type = MOVE;
            break;
        case "KH":
        case "KH2O":
        case "XKH2O":
            type = CARRY;
            break;
        case "GO":
        case "GHO2":
        case "XGHO2":
            type = TOUGH;
            break;
        default:
            type = WORK;
            break;

    }
    var e = creep.body.length;
    while (e--) {
        if (creep.body[e].type == type) {
            total++;
        }
    }

    return total;
}
// this class will go through and see if this creep has been boosted by this already. 
function creepParts(creep, boost) {
    let nonBoost = false;
    let type;
    switch (boost) {
        case "UH":
        case "UH2O":
        case "XUH2O":
            type = ATTACK;
            break;
        case "LO":
        case "LHO2":
        case "XLHO2":
            type = HEAL;
            break;
        case "KO":
        case "KHO2":
        case "XKHO2":
            type = RANGED_ATTACK;
            break;
        case "ZO":
        case "ZHO2":
        case "XZHO2":
            type = MOVE;
            break;
        case "KH":
        case "KH2O":
        case "XKH2O":
            type = CARRY;
            break;
        case "GO":
        case "GHO2":
        case "XGHO2":
            type = TOUGH;
            break;
        default:
            type = WORK;
            break;
    }
    var e = creep.body.length;
    while (e--) {
        if (creep.body[e].type === type && creep.body[e].boost === undefined) {
            return true;
        }
    }
    return false;
}


class baseParent {

    static run(creep) {}

    static baseRun(creep) {
        if (this.depositNonEnergy(creep)) return true;
        if (this.spawnRecycle(creep)) return true;
        if (this.doTask(creep)) return true;

        return false;
    }


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

    static doTask(creep) {
        if (creep.memory.task === undefined) {
            creep.memory.task = [];
        }
        if (creep.memory.boostNeeded !== undefined && creep.memory.boostNeeded.length > 0 && this.boosted(creep, creep.memory.boostNeeded)) {
            return true;
        }
        let Thetasks = creep.memory.task;
        if (Thetasks.length === 0) {
            return false;
        }
        let task = Thetasks[0];
        // Example:
        /* Game.Order.creep('58e987f98dd21b4f7aa198a7',{
        order:"put",
        pos: new RoomPosition(8,8,'E28S71'),
        resource: RESOURCE_ENERGY,
        timed: 5, 
        repeat:true,
        targetID:'58b31b469e8b37461c88d6f3',
        options:{reusePath:10}
      }) 
      // creep.memory.task.push(task)
*/
        let orderComplete = false;
        var target;
        switch (task.order) {
            case "keeperMoveTo":
            case "moveTo":
                if (task.pos === undefined || task.pos.x === undefined || task.pos.y === undefined || task.pos.roomName === undefined) {
                    orderComplete = true;
                    break;
                }
                var tmp2 = new RoomPosition(task.pos.x, task.pos.y, task.pos.roomName);

                if (task.rangeHappy === undefined || task.rangeHappy === 0) {
                    if (creep.room.name == task.pos.roomName) {
                        orderComplete = true;
                    }
                } else if (creep.pos.inRangeTo(tmp2, task.rangeHappy)) {
                    orderComplete = true;
                    break;
                } else if (task.energyPickup && creep.carryTotal == creep.carryCapacity) {
                    orderComplete = true;
                    break;
                } else if (task.goHome && creep.carryTotal === 0) {
                    orderComplete = true;
                    break;
                }

                if (task.enemyWatch) {
                    var range = 4;
                    if (creep.room.name == tmp2.roomName) {
                        switch (creep.memory.role) {
                            case 'transport':
                                range = 4;
                                break;
                            case 'ztransport':
                                range = 4;
                                break;
                            case 'miner':
                                range = 4;
                                break;
                        }
                    }
                    let badz = creep.pos.findInRange(FIND_HOSTILE_CREEPS, range);
                    badz = _.filter(badz, function(object) {
                        return !_.contains(fox.friends, object.owner.username) && object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0;
                    });

                    if (badz.length === 0) {
                        if (task.energyPickup) { //!creep.isHome
                            if (!constr.withdrawFromTombstone(creep, 4)) {
                                if (creep.moveMe(tmp2, task.options) == OK) {
                                    if (task.count) {
                                        if (creep.memory.distance === undefined) {
                                            creep.memory.distance = 0;

                                        }
                                        creep.memory.distance++;
                                    }
                                }
                            }
                        } else {
                            if (creep.moveMe(tmp2, task.options) == OK) {
                                if (task.count) {
                                    if (creep.memory.distance === undefined) {
                                        creep.memory.distance = 0;

                                    }
                                    creep.memory.distance++;
                                }
                            }
                        }
                    } else {
                        if (creep.memory._move !== undefined) {
                            creep.memory._move.time++;
                        }

                        var close = creep.pos.findClosestByRange(badz);
                        var rnz = creep.pos.getRangeTo(close);
                        if (rnz == range) {
                            creep.sleep();
                        } else if (range <= 3) {
                            creep.runFrom(close);
                        }
                    }
                } else if (task.energyPickup) {
                    if (!constr.withdrawFromTombstone(creep, 4)) {
                        //                    if (!constr.moveToPickUpEnergyIn(creep, 4)) {

                        if (creep.moveMe(tmp2, task.options) == OK) {
                            if (task.count) {
                                creep.countDistance();
                            }
                        }
                    }
                } else {
                    if (creep.moveMe(tmp2, task.options) == OK) {
                        if (task.count) {
                            creep.countDistance();
                        }
                    }
                }

                break;
            default:
                //                console.log('Trying to do task that doesnt exist', task.order);
                break;
        }
        if (orderComplete) {
            let zz = creep.memory.task.shift();
            if (task.repeat) {
                creep.memory.task.push(zz);
            }
            creep.say('Task Completed');
            return false;
        }
        return true;
    }

    static boosted(creep, boosted) {
        if(creep.ticksToLive === 1499){
//            if()
        }
        if (creep.ticksToLive < 1000 || (creep.room.controller !== undefined && creep.room.controller.level < 6)) {
            return false;
        }
        if (creep.memory.boostNeeded === undefined) {
            creep.memory.boostNeeded = _.uniq(boosted);
        }

        if (creep.memory.boostNeeded !== undefined && creep.memory.boostNeeded.length > 0 && creep.memory.home == creep.room.name) {
        creep.say('💊' + creep.memory.boostNeeded.length);
            var neededMin = numberOfBody(creep, creep.memory.boostNeeded[0]) * 30;
            //                var needBoost = creepParts(creep, creep.memory.boostNeeded[0]);
            //     if (neededMin) { // this checks an existanced boost already happened.
            creep.room.memory.boost = {
                mineralType: creep.memory.boostNeeded[0],
                timed: 20,
                mineralAmount: neededMin
            };

            if (creep.room.memory.boostLabID !== undefined) {
                let laber = creep.room.boostLab;
                if (laber !== null) {
                    if (!creep.pos.isNearTo(laber)) {
                        creep.moveTo(laber);
                    }
                    creep.room.visual.line(creep.pos, laber.pos);
                    return true;
                }
            }
        }
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
                    creep.sleep(3);
                    return true;
                }
                if (dis < 7) {
                    creep.say('inc!' + dis);
                    if (creep.memory.role == 'miner' && creep.carry[RESOURCE_ENERGY] > 0) {
                        let zz = Game.getObjectById(creep.memory.workContainer);
                        if (zz !== null) {
                            creep.transfer(zz, RESOURCE_ENERGY);
                        }
                    }

                    if (creep.memory.runFromKeeper === undefined) {
                        creep.say('a');
                        var keys = Object.keys(Game.flags);
                        var o = keys.length;
                        while (o--) {
                            var e = keys[o];
                            if (Game.flags[e].room !== undefined && Game.flags[e].room.name == creep.room.name) {
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
                        creep.moveTo(new RoomPosition(creep.memory.runFromKeeper.x, creep.memory.runFromKeeper.y, creep.memory.runFromKeeper.roomName), { ignoreRoads: true, maxOpts: 50 });
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
        let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(creep.room.name);
        let fMod = parsed[1] % 10;
        let sMod = parsed[2] % 10;
        let isSK = !(fMod === 5 && sMod === 5) && ((fMod >= 4) && (fMod <= 6)) &&
            ((sMod >= 4) && (sMod <= 6));

        if (!isSK) return false;

        var D4Bad = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
        D4Bad = _.filter(D4Bad, function(o) {
            return !_.contains(fox.friends, o.owner.username) && (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
        });

        var D3Bad = creep.pos.findInRange(D4Bad, 3);
        if (D3Bad.length > 0 ) { //&& D4Bad.length - D3Bad.length != D4Bad.length
            let resz = creep.runFrom(D4Bad);
            if (resz) {
//                creep.memory.sleep = 5;
            }
            return true;
        } else if (D4Bad.length > 0) {
            return true;
        } else {
            return false;

        }
    }


    static keeperFind(creep) {
        if (creep.memory.keeperLairID !== undefined) return;
        let target = Game.getObjectById(creep.memory.goal);
        if (target !== null) {
            keeperFindAt(target.pos.x, target.pos.y, creep);
        }
    }

    static spawnRecycle(creep) {
        if (creep.memory.death === undefined) {
            return false;
        }
        if (creep.memory.death) {
            creep.say('💀');
            let parent = Game.getObjectById(creep.memory.parent);
            if (parent !== null) {
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
        if (partyFlag.memory.rallyFlag === undefined) return false;
        if (partyFlag.memory.rallyFlag !== false) {
            if (partyFlag.memory.rallyFlag !== 'home') {
                var pFlag = Game.flags[partyFlag.memory.rallyFlag];
                creep.moveTo(pFlag, { reusePath: 20 });
            creep.say('HR move');
            return true;
            } else {
                creep.moveTo(creep.homeFlag, { reusePath: 50 });
            creep.say('R move');
            return true;
            }
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
        if(creep.room.controller.owner !== undefined && _.contains(fox.friends, creep.room.controller.owner.username) ) return false;
        if (creep.room.controller.sign === undefined || creep.room.controller.sign.text != sign) {
            creep.say('resign');
            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.signController(creep.room.controller, sign);
            } else {
                creep.moveMe(creep.room.controller,{reusePath:50,maxRooms:1});
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
        if (creep.room.terminal !== undefined && creep.room.terminal.total !== 300000 && creep.room.controller !== undefined && creep.room.controller.level >= 6) {
            target = creep.room.terminal;
        } else {
            target = creep.room.storage;
        }

        var keys = Object.keys(creep.carry);
        var p = keys.length;
        while (p--) {
            var e = keys[p];
            if (e != RESOURCE_ENERGY && creep.carry[e] > 0) {
                creep.say(creep.carryTotal + 'has chzzburger');
                creep.moveToTransfer(target, e);
                return true;
            }
        }
    }

    static rebirth(creep) {
        if (creep.memory.reportDeath) return true;
        let distance = 0;
        switch (creep.memory.role) {
            case "guard":
                distance += 20;
                break;
        }

        if (creep.memory.distance !== undefined) distance = creep.memory.distance;
        if (creep.ticksToLive < ((3 * creep.body.length) + distance)) {
            let spawnsDo = require('build.spawn');
            spawnsDo.reportDeath(creep);
            creep.memory.reportDeath = true;
            return true;
        }
        return false;
    }

/*    static renew(creep) {
        //        if (creep.memory.birthTime === undefined) creep.memory.birthTime = Game.time;

        if (creep.ticksToLive > 750) return false;
        if (creep.memory.renewSpawnID == 'none') return false;
        if (creep.memory.renewSpawnID === undefined) {

            if (creep.room.alphaSpawn === undefined) {
                creep.memory.renewSpawnID = 'none';
                return;
            }

            creep.memory.renewSpawnID = creep.room.alphaSpawn.id;
            var ccSpawn = require('commands.toSpawn');
//            ccSpawn.newWantRenew(creep);
            creep.memory.reportDeath = true;
        }
        return true;
    } */

}

module.exports = baseParent;