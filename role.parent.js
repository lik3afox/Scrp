// Base parent class for all roles - this has basic functions that all
// classes use to do there thing.
var sign = '[Ypsilon Pact]: Territory Claimed by Likeafox. Respect our Borders.';


function getCost(module) {
    var total = 0;
    var i = module.length;
    while (i--) {
        var keys = Object.keys(BODYPART_COST);
        var z = keys.length;
        while (z--) {
            var e = keys[z];
            if (module[i] == e) {
                total += BODYPART_COST[e];
            }
        }
    }
    return total;
}

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

//var containers = r
var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var movement = require('commands.toMove');
var sources = require('commands.toSource');
var links = require('build.link');
var spawnsCC = require('commands.toSpawn');
var labsBuild = require('build.labs');
var power = require('commands.toPower');

function numberOfBody(creep, boost) {
    let nonBoost = false;
    var total = 0;
    let type;
    switch (boost) {
        case 'UH':
        case "UH2O":
        case "XUH2O":
            type = ATTACK;
            break;
        case 'LO':
        case "LHO2":
        case "XLHO2":
            type = HEAL;
            break;
        case 'KO':
        case "KHO2":
        case "XKHO2":
            type = RANGED_ATTACK;
            break;
        case 'ZO':
        case "ZHO2":
        case "XZHO2":
            type = MOVE;
            break;
        case 'KH':
        case "KH2O":
        case "XKH2O":
            type = CARRY;
            break;
        case 'GO':
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
        case 'UH':
        case "UH2O":
        case "XUH2O":
            type = ATTACK;
            break;
        case 'LO':
        case "LHO2":
        case "XLHO2":
            type = HEAL;
            break;
        case 'KO':
        case "KHO2":
        case "XKHO2":
            type = RANGED_ATTACK;
            break;
        case 'ZO':
        case "ZHO2":
        case "XKHO2":
            type = MOVE;
            break;
        case 'KH':
        case "KH2O":
        case "XKH2O":
            type = CARRY;
            break;
        case 'GO':
        case "GHO2":
        case "XKHO2":
            type = TOUGH;
            break;
        default:
            type = WORK;
            break;

    }
    var e = creep.body.length;
    while (e--) {
        //    console.log(creep.body[e].boost, boost);
        if (creep.body[e].type == type && (creep.body[e].boost === undefined && creep.body[e].boost === null)) {
            //console.log(boost,type,creep.body[e].boost,creep.body[e].type,creep.pos);
            return true;
        }


        /*    if(creep.body[e].boost == boost) {
              return false;
            } */
    }

    return true;
}
/*
function getCost(module) {
    var total = 0;
    for (var i in module) {
        for (var e in BODYPART_COST) {
            if (module[i].type == e) {
                total += BODYPART_COST[e];
            }
        }
    }
    return total;
} */

function getParts(creep) {
    let parts = {
        move: 0,
        attack: 0,
        range_attack: 0,
        carry: 0,
        heal: 0,
        tough: 0
    };

    let workParts = _.filter(creep.body, { type: WORK }).length;
    let healParts = _.filter(creep.body, { type: HEAL }).length;
    let attackParts = _.filter(creep.body, { type: RANGED_ATTACK }).length;
    let carryParts = _.filter(creep.body, { type: CARRY }).length;

}
var fox = require('foxGlobals');

function getDeathSpot(roomName) {
    switch (roomName) {
        case "E18S36":
            return new RoomPosition(38, 24, roomName);

        default:
            return;
    }
}

//5836b8138b8b9619519f16c1
class baseParent {

    static calcuateStats(creep) {
        return;
        /*
               if (creep.memory.stats !== undefined) return;

               let wParts = _.filter(creep.body, { type: WORK }).length;
               let mParts = _.filter(creep.body, { type: MOVE }).length;
               let hParts = _.filter(creep.body, { type: HEAL }).length;
               let rParts = _.filter(creep.body, { type: RANGED_ATTACK }).length;
               let aParts = _.filter(creep.body, { type: ATTACK }).length;
               let cParts = _.filter(creep.body, { type: CARRY }).length;
               let cost = getCost(creep.body);
               let stats = {
                   //            birthTime: Game.time
                   // === 0 ? undefined : wParts
                   work: wParts,
                   heal: hParts,
                   carry: cParts,
                   move: mParts,
                   energyCost: cost,
                   spawnTime: creep.body.length * 3,
                   mining: wParts * 2,
                   harvesting: wParts,
                   attack: aParts * 30,
                   build: wParts * 5,
                   repair: wParts * 100,
                   repairEnergy: wParts,
                   upgrade: wParts,
                   carryMax: cParts * 50,
                   dismanle: wParts * 50,
                   healMax: hParts * 12,
                   rangeHeal: hParts * 4,
                   massMax: rParts * 1,
                   massMid: rParts * 4,
                   massMin: rParts * 10,
                   range: rParts * 10,
                   recovery: mParts,
                   fatigue: (creep.body.length - mParts),
                   swamp: (creep.body.length - mParts) * 5,
                   renewCost: Math.ceil(cost / 2.5 / creep.body.length),
                   renewTime: Math.floor(600 / creep.body.length),

                   level: creep.memory.level
               };
               creep.memory.stats = stats;*/
        //      let body = getBodyParts(creep);  This will look at parts returning part numbers - and modifiers. 
        //     Boosted?
        //    minig
        //    Energy Building
        //    Renew cost and Tick
        //    Move Amount
        //    Range damage amount
        //    Toughness amount.
        //    Amount of boosts - tier 1 is 1 tier 2 is 2 ect.
        //    Level.

    }

    static getStat(creep) {

    }

    static edgeRun(creep) {

        if (Game.flags.siege !== undefined && creep.room.name == Game.flags.siege.pos.roomName) {
            if (creep.pos.x >= 48) creep.move(RIGHT);
            if (creep.pos.x <= 2) creep.move(LEFT);
            if (creep.pos.y >= 48) creep.move(BOTTOM);
            if (creep.pos.y <= 2) creep.move(TOP);
            return true;
        }

        if (Game.flags.siege !== undefined && Game.flags.drainer !== undefined) {
            creep.moveTo(Game.flags.drainer.pos);
            return true;
        }
        switch (creep.room.name) {
            case 'E15S63':
                if (creep.pos.x >= 48) creep.move(RIGHT);
                if (creep.pos.x <= 2) creep.move(LEFT);
                if (creep.pos.y >= 48) creep.move(BOTTOM);
                if (creep.pos.y <= 2) creep.move(TOP);
                return true;
            case 'E15S64':
                if (Game.flags.drainer !== undefined) {
                    creep.moveTo(Game.flags.drainer.pos);
                } else {
                    console.log('nEED ESCAPE FLAG');
                }
                return true;

        }
        return false;
    }
    static sayWhat(creep) {
        switch (creep.saying) {
            case "ty":
                creep.say('bye', true);
                return false;
            case "here":
                creep.say('zZzZz', true);
                return true;
            case "zZzZz":
                creep.say('zZzZ', true);
                return true;
            case "ZzZz":
                creep.say('zZz', true);
                return true;
            case "zZz":
                return true;
        }
        return false;
    }

    static doTask(creep) {
        if (creep.memory.task === undefined) {
            creep.memory.task = [];
        }
        let Thetasks = creep.memory.task;
        if (Thetasks.length === 0) {
            return false;
        }
        if (Thetasks.length > 2)
            console.log(creep, creep.pos, Thetasks.length);

        let task = Thetasks[0];
        //        console.log(creep, 'Doing task', task.order, task.options, creep.pos);
        // Task should be an object
        // That does it things
        // It checks first to see if the task is done
        // if not then it does it. 
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
            case "sing":
                if (creep.memory.singing === undefined) {
                    creep.say('singing');
                    creep.memory.song = task.sing;
                    creep.memory.singing = 0;
                    return false;
                }
                // Game.Order.creep('58e987f98dd21b4f7aa198a7',{sing:['never','let','me']});          
                break;

            case "roadMoveTo":
                creep.say('T:rMove');
                if (!constr.doCloseRoadRepair(creep))
                    constr.doCloseRoadBuild(creep);
                let tmp3 = new RoomPosition(task.pos.x, task.pos.y, task.pos.roomName);
                if (creep.pos.isNearTo(tmp3)) {
                    orderComplete = true;
                } else {
                    if (task.enemyWatch) {

                        var bads = creep.pos.findInRange(creep.room.hostilesHere, 3);
                        bads = _.filter(bads, function(object) {
                            return (object.owner.username != 'zolox' && object.owner.username != 'admon');
                        });
                        if (bads.length === 0) {
                            creep.moveMe(tmp3, task.options);
                        }
                    } else {
                        creep.moveMe(tmp3, task.options);
                    }

                }

                if (task.rangeHappy === undefined || task.rangeHappy === 0) {
                    if (creep.room.name == task.pos.roomName) {
                        orderComplete = true;
                    }
                } else {
                    if (creep.pos.inRangeTo(task.pos, task.rangeHappy)) {
                        orderComplete = true;
                    }
                }
                break;

            case "focusMoveTo":
                this.goToFocusFlag(creep, Game.flags[creep.memory.focusFlagName]);
                if (!constr.doCloseRoadRepair(creep))
                    constr.doCloseRoadBuild(creep);

                if (_.sum(creep.carry) === 0) {
                    orderComplete = true;
                }
                break;

            case "portalTo":

                var str = creep.room.find(FIND_STRUCTURES);
                var portal = _.filter(str, function(o) {
                    return o.structureType == STRUCTURE_PORTAL;
                });
                portal = creep.pos.findClosestByRange(portal);
                /*                console.log('hah', portal.length);
                                for (var bb in portal) {
                                    console.log(portal[bb].pos);
                                } */
                creep.moveTo(portal);
                if (creep.memory.portalDestination === undefined)
                    creep.memory.portalDestination = str.destination;
                if (creep.room.name == creep.memory.portalDestination) {
                    orderComplete = true;
                    creep.memory.portalDestination = undefined;
                }

                break;

            case "keeperMoveTo":
                // To do keeper moveTo you need
                // task.pos,task.options,task.order,task.happyRange

                creep.say('T:Kmove');

                var tmp = new RoomPosition(task.pos.x, task.pos.y, task.pos.roomName);

                if (!this.guardRoom(creep)) {
                    creep.moveMe(tmp, task.options);
                } else {
                    creep.say('failG');
                }
                if (task.rangeHappy === undefined || task.rangeHappy === 0) {
                    if (creep.room.name == task.pos.roomName) {
                        orderComplete = true;
                    }
                } else {
                    if (creep.pos.inRangeTo(task.pos, task.rangeHappy)) {
                        orderComplete = true;
                    }
                }
                break;


            case "moveTo":
            case "groupMoveTo":
                creep.say('T:move');

                var tmp2 = new RoomPosition(task.pos.x, task.pos.y, task.pos.roomName);

                if (task.rangeHappy === undefined || task.rangeHappy === 0) {
                    if (creep.room.name == task.pos.roomName) {
                        orderComplete = true;
                    }
                } else if (creep.pos.inRangeTo(tmp2, task.rangeHappy)) {
                    orderComplete = true;
                } else if (task.energyPickup && creep.carryTotal == creep.carryCapacity) {
                    orderComplete = true;
                }

                if (task.enemyWatch) {
                    let zzz = ['E25S36'];
                    let rng = _.indexOf(zzz, creep.room.name) >= 0 ? 6 : 4;
                    let badz = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                    badz = _.filter(badz, function(object) {
                        return !_.contains(fox.friends, object.owner.username) && object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0;
                    });

                    if (badz.length === 0) {
                        if (task.energyPickup) { //!creep.isHome
                            if (!constr.moveToPickUpEnergyIn(creep, 4)) {
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

//                        if (badz[0].owner.username !== 'Source Keeper' && badz[0].owner.username !== 'Invader') {
                            var close = creep.pos.findClosestByRange(badz);
                            var rnz = creep.pos.getRangeTo(close);
                            creep.say(rnz);
                            if (rnz == 4){
                              //  creep.runFrom(close);
                            } else if(rnz > 4) {
                                creep.runFrom(close);
                            }
                                // you can also use an array of targets, and it'll attempt to stay away from all of them
//                        }
                    }
                } else if (task.energyPickup) {
                    if (!constr.moveToPickUpEnergyIn(creep, 4)) {
                        if (creep.moveMe(tmp2, task.options) == OK) {
                            if (task.count) {
                                if (this.memory.distance === undefined) {
                                    this.memory.distance = 0;

                                }
                                this.memory.distance++;
                            }
                        }
                    }
                } else {
                    if (creep.moveMe(tmp2, task.options) == OK) {
                        if (task.count) {
                            if (this.memory.distance === undefined) {
                                this.memory.distance = 0;

                            }
                            this.memory.distance++;
                        }
                    }
                }

                break;

            case "attack":
                creep.say('T:att');
                target = Game.getObjectById(task.targetID);
                let distance = creep.pos.getRangeTo(target);
                if (distance == 1) {
                    //status check to see if we have attack damage.
                    creep.attack(target);
                    orderComplete = true;
                    // if this has work parts instead then dismantle
                    // creep.dismantle(target);
                } else if (distance < 4) {
                    //status check to see if we can do range damage.
                    creep.moveTo(target);
                } else {
                    creep.moveTo(target);
                }
                break;

            case "harvest":
                creep.say('T:hvst');
                let source = Game.getObjectById(task.targetID);
                if (source !== null) {
                    if (creep.pos.isNearTo(source)) {
                        creep.harvest(source);
                    } else {
                        creep.moveTo(source);
                    }
                    if (_.sum(creep.carry) == 3) {
                        orderComplete = true;
                    } // this will be work
                    // Needs location and ID

                }
                break;

            case "deposit":
            case "put":
                creep.say('T:dpst');

                target = Game.getObjectById(task.targetID);
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        var keys = Object.keys(creep.carry);
                        var n = keys.length;
                        while (n--) {
                            var e = keys[n];
                            creep.transfer(target, e);
                        }
                        if (_.sum(creep.carry) === 0) {
                            orderComplete = true;
                        }

                    } else {
                        creep.moveTo(target);
                    }
                }
                break;

            case "get":
                creep.say('T:get');
                target = Game.getObjectById(task.targetID);
                if (target === null) {
                    orderComplete = true;
                } else {
                    if (creep.pos.isNearTo(target)) {
                        if (target.structureType === undefined) {
                            creep.pickup(target);
                        } else {
                            creep.withdraw(target, task.resource);
                        }
                    } else {
                        creep.moveTo(target);
                    }
                }
                break;


            case "wait":
                // Tick amount to wait.
                if (creep.memory.taskWait === undefined) {
                    if (task.timed === undefined) {
                        console.log('Cannot wait due to no task.timed');
                    } else {
                        creep.memory.taskWait = task.timed;
                    }
                }
                creep.say('W:' + creep.memory.taskWait);
                creep.memory.taskWait--;
                if (creep.memory.taskWait === 0) {
                    creep.memory.taskWait = undefined;
                    orderComplete = true;
                }
                break;

            case "sign":
                this.moveToSignControl(creep);
                break;

            case "filler":
            case "first":
            case "spawn":


                break;

            case "guard":

                break;

            case "heal":

                break;

            case "attackheal":

                break;
            case "death":
                creep.memory.death = true;
                break;

        }
        if (orderComplete) {
            //            console.log(creep, 'task completed', task.order, task.options, creep.pos);
            let zz = creep.memory.task.shift();
            if (task.repeat) {
                creep.memory.task.push(zz);
            }
        }
        return true;
    }

    static addTask(creep) {

    }

    static run(creep) {
        console.log(creep.memory.role, creep.name);
    }

    static get _attack() {
        return attack;
    }

    static get _labs() {
        return labsBuild;
    }

    static get _links() {
        return links;
    }
    static get _spawns() {
        return spawnsCC;
    }

    static get _containers() {
        return containers;
    }

    static get _sources() {
        return sources;
    }

    static get _constr() {
        return constr;
    }
    static get _movement() {
        return movement;
    }
    static get _power() {
        return power;
    }
    /*
    static get _() {
      return;
    } 
    */


    static boosted(creep, boosted) {
        if (creep.ticksToLive <  1400) {
            return false;
        }
        if (creep.memory.boostNeeded === undefined) {
            creep.memory.boostNeeded = boosted;
        }
        
//        creep.room.memory.boost.mineralType = 'none';

        if (creep.memory.boostNeeded.mineralType !== 'none'  && creep.memory.home == creep.room.name) {

            var a = creep.memory.boostNeeded.length;
            while (a--) {
                //console.log('amount needed',numberOfBody(creep, boosted[a]));
                var neededMin = numberOfBody(creep, boosted[a]) * 30;

                if (Memory.stats.totalMinerals[boosted[a]] < neededMin) {
                    creep.memory.boostNeeded.pop();
                } else if (creepParts(creep, boosted)) { // this checks an existanced boost already happened.
                    // This makes a request to the room.
//                    if (creep.room.memory.boost !== undefined) {
                        var need = {
                            mineralType: creep.memory.boostNeeded[a],
  //                          creepID: creep.id,
                            timed: 20,
                            mineralAmount: neededMin
                        };
                        creep.room.memory.boost = need;
//                    }

                    let labs = creep.pos.findInRange(FIND_STRUCTURES, 20, {
                        filter: object => (object.structureType == STRUCTURE_LAB &&
                            object.mineralType == creep.memory.boostNeeded[a] &&
                            object.mineralAmount > 29)
                    });
                    if (labs.length > 0) {
                        if (creep.pos.isNearTo(labs[0]) && labs[0].mineralAmount >= neededMin ) {
                            let zz = labs[0].boostCreep(creep);
                            creep.say('ah!' + zz);
                            if (zz == OK) {
                                creep.memory.boostNeeded.splice(a, 1); // = 'done';
                                creep.room.memory.boost.mineralType = 'none';
                            } 
                        } else {
                            creep.say('drugs');
                            creep.moveTo(labs[0]);
                            creep.room.visual.line(creep.pos, labs[0].pos);
                        }
                        return true;
                    } else {
                        if (creep.room.memory.boost.mineralType !== 'none') {
                            return false;
                        } else {
                            // waiting for minerals.
                            return true;
                        }
                    }
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

            if (keeper.ticksToSpawn === undefined || keeper.ticksToSpawn < 15 || keeper.ticksToSpawn > 285) {

                if (dis == 7) {
                    creep.say('zZzZ');
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
                    switch (creep.memory.goal) {
                        case '5836b8118b8b9619519f1659':
                        case '5836b82b8b8b9619519f1967':
                        case '5836b82b8b8b9619519f196c':
                            creep.moveMe(Game.getObjectById(creep.memory.parent), { maxOps: 50 });
                            break;
                        case '5873bd6f11e3e4361b4d934b':
                            creep.moveTo(2, 2, { maxOps: 50 });
                            break;
                        case '5873bd6f11e3e4361b4d9351':
                            creep.moveTo(42, 38, { maxOps: 50 });
                            break;
                        case '58dbc4338283ff5308a3eb05':
                            creep.moveTo(21, 42, { maxOps: 50 });
                            break;
                        default:

                            if (creep.memory.runFromKeeper === undefined) {
                                creep.say('a');
                                var keys = Object.keys(Game.flags);
                                var o = keys.length;
                                while (o--) {
                                    var e = keys[o];
                                    //                                    console.log(e, keys[o], o);
                                    if (Game.flags[e].room !== undefined && Game.flags[e].room.name == creep.room.name) {
                                        creep.memory.runFromKeeper = new RoomPosition(Game.flags[e].pos.x, Game.flags[e].pos.y, Game.flags[e].pos.roomName);
                                        creep.moveTo(creep.memory.runFromKeeper, { ignoreRoads: true, maxOpts: 50 });
                                        return true;
                                    }
                                }
                            } else {
                                creep.say('b');
                                creep.moveTo(new RoomPosition(creep.memory.runFromKeeper.x, creep.memory.runFromKeeper.y, creep.memory.runFromKeeper.roomName), { ignoreRoads: true, maxOpts: 50 });
                            }
                            break;
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
        // IF this returns false - means that it's safe to move.
        // If this returns true - means that it's not safe to move.
        /*        let sKep = Game.getObjectById(creep.memory.keeperLairID);
                if (sKep !== null && sKep.pos.roomName == creep.pos.roomName) {
                    if (sKep.ticksToSpawn === undefined || sKep.ticksToSpawn < 15 || sKep.ticksToSpawn > 295) {
                        return true;
                    }
                } */
        var stay = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
        stay = _.filter(stay, function(o) {
            return !_.contains(fox.friends, o.owner.username) && (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
        });


        if (stay.length === 0) return false;
        var close = creep.pos.findInRange(stay, 4);
        if (stay.length - close.length != stay.length) {

            var closer = creep.pos.findInRange(stay, 3);
            if (closer.length > 0) {
                creep.runFrom(stay);
            }
            return true;
        } else {
            return false;
        }
    }

    static deathWatch(creep) {
        if (creep.memory.deathDistance === undefined) {
            //            let vv = Game.getObjectById(creep.memory.parent);

            /*            for (var a in vv.memory.roadsTo) {
                            if ( creep.memory.goal == vv.memory.roadsTo[a].source) {
                                if (vv.memory.roadsTo[a].aveDistance !== undefined) {
                                    creep.memory.deathDistance = vv.memory.roadsTo[a].aveDistance * 2;
                                }
                            }
                        } */
            if (creep.memory.deathDistance === undefined) {
                creep.memory.deathDistance = 'none';
            }
        }
        if (creep.memory.deathDistance != 'none') {
            if (creep.ticksToLive < creep.memory.deathDistance) {
                if (_.sum(creep.carry) === 0) {
                    if (!creep.memory.reportDeath) {
                        let spawnsDo = require('build.spawn');
                        spawnsDo.reportDeath(creep);
                        creep.memory.reportDeath = true;
                    }
                    creep.suicide();
                } else {
                    creep.memory.gohome = true;
                }
            }
        }
    }

    static keeperFind(creep) {
        if (creep.memory.keeperLairID !== undefined) return;
        let target = Game.getObjectById(creep.memory.goal);
        if (target !== null) {
            keeperFindAt(target.pos.x, target.pos.y, creep);
        }
        //            keeperFindAt(creep.pos.x, creep.pos.y, creep);
    }
    /*
        static rebuildMe(creep) {
                let temp = {
                                build:creep.levels(creep.memory.level),
                                name: undefined,
                                memory:{
                                    role: creep.memory.role,
                                    home: creep.memory.home,
                                    parent: creep.memory.parent,
                                    goal: creep.memory.goal,
                                    level: creep.memory.level,
                                    party: creep.memory.party
                                }
                            }

            return temp;
        } */

    static returnEnergy(creep) {
        if (creep.memory.death === undefined) {
            //        creep.memory.returnSource = false;
            creep.memory.death = false;
        }
        if (creep.memory.returnSource || creep.memory.death) {
            creep.say('💀');
            let spot = getDeathSpot(creep.memory.home);
            if (spot === undefined) {
                let parent = Game.getObjectById(creep.memory.parent);
                if (parent !== null) {
                    creep.moveTo(parent, { reusePath: 25 });
                    if (creep.pos.isNearTo(parent)) {
                        parent.recycleCreep(creep);
                    }
                }
            } else {
                if (creep.pos.isEqualTo(spot)) {
                    let spwns = creep.room.find(FIND_STRUCTURES);
                    spwns = _.filter(spwns, function(o) {
                        return o.structureType == STRUCTURE_SPAWN;
                    });
                    var e = spwns.length;
                    while (e--) {
                        if (creep.pos.isNearTo(spwns[e])) {
                            spwns[e].recycleCreep(creep);
                            return true;
                        }
                    }
                    //            parent.recycleCreep(creep);
                } else {
                    creep.moveTo(spot);
                }
            }

            return true;
        }
        return false;
    }


    static intelligence(creep) {
        if (creep.room.name == creep.room.home) {
            return 10;
        } else {
            return 49;
        }
    }

    static goToPortal(creep) {
        if (Game.flags.portal === undefined) return false;
        //    console.log(creep.room.name , Game.flags['portal'].pos.roomName );
        //  console.log(creep.memory.throughPortal);
        if (creep.memory.throughPortal) return false;
        if (creep.memory.throughPortal === undefined) return false;
        creep.moveMe(Game.flags.portal, { reusePath: 40 });
        //    creep.say(creep.room.name == Game.flags['portal'].pos.roomName);
        if (creep.room.name == Game.flags.portal.pos.roomName) {
            // then he's in the room with te portal
            creep.memory.throughPortal = false;
        } else {
            if (creep.memory.throughPortal !== undefined && creep.memory.throughPortal === false) {
                creep.memory.throughPortal = true;
            }
            // Gone through the portal
        }
        return true;
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
        if (creep.room.controller.sign === undefined || creep.room.controller.sign.text != sign) {
            creep.say('resign');
            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.signController(creep.room.controller, sign);
            } else {
                creep.moveTo(creep.room.controller);
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

    static goToFocusFlag(creep, flags) {

        if (creep.memory.focusFlagName === undefined) {
            flags = _.filter(Game.flags, function(f) {
                return f.color == COLOR_CYAN;
            });
            var e = flags.length;
            while (e--) {
                var distance = Game.map.getRoomLinearDistance(creep.room.name, flags[e].pos.roomName);
                if (distance < 5) {
                    creep.memory.focusFlagName = flags[e].name;
                    break;
                }
            }
        }

        let focusFlag = Game.flags[creep.memory.focusFlagName];
        if (focusFlag === undefined) console.log(creep.pos);
        if (focusFlag.pos.roomName == creep.room.name) {
            if (creep.room.controller.level >= 4 && creep.room.storage !== undefined) {
                if (creep.room.controller.level < 6) {
                    if (creep.room.storage.store[RESOURCE_ENERGY] < 999000) {
                        containers.moveToStorage(creep);
                    } else {
                        if (!creep.pos.isEqualTo(focusFlag.pos)) {
                            creep.moveTo(focusFlag.pos);
                        } else {
                            creep.drop(RESOURCE_ENERGY);
                        }
                    }
                } else if (creep.room.controller.level >= 6 && creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000) {
                    containers.moveToTerminal(creep);
                } else {
                    let tSum = _.sum(creep.room.terminal.store);
                    if (tSum < 50000) {
                        containers.moveToTerminal(creep);
                    } else if (creep.room.storage.store[RESOURCE_ENERGY] < 950000) {
                        containers.moveToStorage(creep);
                    } else if (tSum == 300000) {
                        containers.moveToStorage(creep);
                    } else {
                        //                            containers.moveToStorage(creep);
                        containers.moveToTerminal(creep);
                    }
                }

            } else {

                if (!creep.pos.isEqualTo(focusFlag.pos)) {
                    creep.moveTo(focusFlag.pos);
                } else {
                    creep.drop(RESOURCE_ENERGY);
                }
            }

        } else {

            if (!this.avoidArea(creep)) {

                //            var bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 5);
                //                        if (bads.length == 0) {
                // Here we change it to the flag in memory.
                creep.moveTo(focusFlag, {
                    reusePath: 30,
                    //ignoreRoads: _ignoreRoad,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#fa0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.25,
                        opacity: 0.5
                    }
                });
                //        }

            }
        }

        return true;

    }

    static depositNonEnergy(creep) {

        //        if (creep.room.controller !== undefined && creep.room.controller.owner !== 'likeafox') return false;
        if (creep.room.terminal === undefined && creep.room.storage === undefined) return false;

        if (creep.carryTotal === 0) return false;
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
                creep.say('has chzzburger');
                if (creep.pos.isNearTo(target)) {
                    creep.transfer(target, e);
                } else {
                    creep.moveTo(target);
                }
                return true;
            }
        }
        //      }
        return false;
    }

    static doNotStand(creep, pos) {
        //  var pos;
        //  var pos = new RoomPosition(35,27,'E26S75');
        if (creep.pos.isEqualTo(pos)) {
            if (creep.memory.standingTime === undefined) creep.memory.standingTime = 0;
            creep.memory.standingTime++;
            if (creep.memory.standingTime > 3) {
                return true;
                //      creep.moveTo( Game.getObjectById( creep.memory.parent) );
            }
        }
        return false;
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
        //      if (creep.memory.role == 'guard')
        //            creep.say('here?');
        if (creep.ticksToLive < ((3 * creep.body.length) + distance)) {
            creep.say('herezzz');
            let spawnsDo = require('build.spawn');
            spawnsDo.reportDeath(creep);
            creep.memory.reportDeath = true;
            return true;
        }
        return false;
    }

    static analyzeSourceKeeper(creep) {

        let keepers = creep.memory.keeperLair;
        let targetID;
        let lowest = 300;

        if (creep.memory.mineralRoomID === undefined) {
            let tempinz = creep.room.find(FIND_MINERALS);
            creep.memory.mineralRoomID = tempinz[0].id;
        }
        let tempin = Game.getObjectById(creep.memory.mineralRoomID);
        if (tempin !== null) {
            var e = keepers.length;
            while (e--) {
                let keeperTarget = Game.getObjectById(keepers[e].id);
                //        let lair = Game.getObjectById(  creep.memory.keeperLair[creep.memory.goTo].id)
                //        console.log(keeperTarget,keepers[e].id,keeperTarget.ticksToSpawn,e,lowest,":",targetID);
                if (tempin.pos.inRangeTo(keeperTarget, 10) && creep.room.name != "E26S76" && creep.room.name != 'E24S75') {
                    if (tempin.mineralAmount !== 0) {
                        if (keeperTarget.ticksToSpawn === undefined) {
                            targetID = e;
                            break;
                            //Winner
                        } else if (keeperTarget.ticksToSpawn < lowest) {
                            lowest = keeperTarget.ticksToSpawn;
                            targetID = e;
                        }
                    }
                } else {
                    if (keeperTarget.ticksToSpawn === undefined) {
                        targetID = e;
                        break;
                        //Winner
                    } else if (keeperTarget.ticksToSpawn < lowest) {
                        lowest = keeperTarget.ticksToSpawn;
                        targetID = e;
                    }

                }


            }
        }


        return targetID;
    }


    static renew(creep) {
        if (creep.memory.birthTime === undefined) creep.memory.birthTime = Game.time;

        if (creep.ticksToLive > 750) return false;
        if (creep.memory.renewSpawnID == 'none') return false;
        if (creep.memory.renewSpawnID === undefined) {
            let Fspawn = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                filter: object => (object.structureType == STRUCTURE_SPAWN)
            });

            if (Fspawn.length === 0) {
                creep.memory.renewSpawnID = 'none';
                return;
            }

            creep.memory.renewSpawnID = Fspawn[0].id;
            var ccSpawn = require('commands.toSpawn');
            ccSpawn.wantRenew(creep);
            creep.memory.reportDeath = true;
        }


        /*        let spawn = Game.getObjectById(creep.memory.renewSpawnID);
                if (creep.carry[RESOURCE_ENERGY] > 0) {
                    creep.transfer(spawn, RESOURCE_ENERGY);
                } */


        return true;
    }

    static isFlagged(creep) {
        let flagged = false;
        if (creep.memory.party !== undefined) {
            if (Game.flags[creep.memory.party] !== undefined) {
                return true;

            }
        }
        return false;
    }

    static avoidArea(creep) {
        var detect = 20;

        if (creep.room.name == 'E25S36') {
            detect = 25;
        }

        if (creep.room.name == 'E23S42') {
            detect = 35;
        }
        let greyflag = creep.pos.findInRange(FIND_FLAGS, detect);
        greyflag = _.filter(greyflag, function(structure) {
            return (structure.color == COLOR_GREY);
        });

        //  return false;
        creep.say(greyflag.length);
        if (greyflag.length === 0) {
            if (creep.memory.greyFlag) {
                creep.memory.greyFlag = undefined;
                creep.memory.greyPos = undefined;
            }
            return false;
        }

        if (creep.memory.greyFlag === undefined) {
            creep.memory.greyFlag = false;
            creep.memory.greyPos = greyflag[0].pos;
        }

        if (creep.pos.isEqualTo(greyflag[0].pos)) {
            creep.memory.greyFlag = true;
        } else if (!creep.memory.greyFlag) {
            creep.say('grey' + greyflag.length);
            creep.moveTo(greyflag[0], {
                reusePath: 5,
                ignoreRoads: true,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#ff0',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
            return true;
        }


    }


    constructor() {}

    levels(level) {}

    levelEnergy(level) {}
}

module.exports = baseParent;