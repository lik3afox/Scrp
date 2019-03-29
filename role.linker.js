var classLevels = [
    [CARRY, CARRY, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE
    ],
    [MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
        MOVE, MOVE, CARRY, CARRY, CARRY, CARRY,
    ],

    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE]
];

var roleParent = require('role.parent');
var job = require('jobs.spawn');
let roomLevel;

var containers = require('commands.toContainer');
var constr = require('commands.toStructure');
var terminal = require('build.terminal');

function linkPickUpEnergy(creep) {
    let close = Game.getObjectById(creep.memory.pickUpId);
    if (!close) {
        var zed = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                //return !object.pos.isEqualTo(Game.flags[object.pos.roomName]) && object.amount > 100;
                return object.resourceType !== RESOURCE_ENERGY || object.amount > 100;
            }
        });
        if (zed.length === 0) {
            creep.memory.pickUpId = undefined;
            //            creep.sleep(1 + creep.memory.roleID);
            return false;
        }
        close = _.max(zed, o => o.amount);
        creep.memory.pickUpId = close.id;
    }

    //    if (!close) {
    //      creep.memory.pickUpId = undefined;
    //    return false;
    //}
    if (creep.carryTotal === 0) {
        //       creep.say("PUS");
        //        console.log('DOING THIS', roomLink(creep.room.name));
        if (creep.pos.isNearTo(close)) {
            return creep.pickup(close);
        } else {
            return creep.moveMe(close, { maxRooms: 1, reusePath: 20 });
        }
    } else { //  if (roomLevel < 7)

        return creep.moveToTransfer(creep.room.storage, creep.carrying, { maxRooms: 1 });
    }
}


function linkPickUpMineral(creep) {
    let close = Game.getObjectById(creep.memory.pickUpId);
    if (!close) {
        var zed = creep.room.find(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                return object.resourceType !== RESOURCE_ENERGY ;
            }
        });
        if (zed.length === 0) {
            creep.memory.pickUpId = undefined;
            return false;
        }
        close = _.max(zed, o => o.amount);
        creep.memory.pickUpId = close.id;
    }
    creep.say('MINS');
    if (creep.carryTotal === 0) {
        if (creep.pos.isNearTo(close)) {
            return creep.pickup(close);
        } else {
            return creep.moveMe(close, { maxRooms: 1, reusePath: 20 });
        }
    } else { 

        return creep.moveToTransfer(creep.room.storage, creep.carrying, { maxRooms: 1 });
    }
}


function nojobs(creep) {
    /*    if (creep.carryTotal === 0) {
            if (creep.carryTotal < creep.carryCapacity && roleParent.constr.withdrawFromTS(creep)) {
                creep.say('mtombstone');
                return true;
            }

           

        } else {
            creep.moveToTransfer(creep.room.storage, creep.carrying);
        }*/
    //    if(creep.memory.roleID === 2){
    if (creep.memory.empty === false) {
        if (creep.carryTotal > 0) {
            creep.moveToTransfer(creep.room.storage, creep.carrying);
            return true;
        } else {
            creep.memory.empty = true;
        }
    }
    if (roleParent.containers.withdrawFromLink(creep, 200)) {
        creep.memory.empty = false;
        return true;
    }

    if (linkPickUpEnergy(creep) === OK) {
        creep.say('ENGY');
        return;
    }

    //  }
    if (creep.room.energyAvailable === creep.room.energyCapacityAvailable) {
        if (creep.memory.roleID === 0) {
            creep.sleep(1);
        } else {
            creep.sleep(3 + creep.memory.roleID);
        }
    }
}

function linkTerminalStorageBalance(creep) {
    //    console.log(creep.pos.roomName, 'doing simple');

    if (creep.carryTotal === 0) {
        creep.memory.empty = true;
    } else if (creep.carryTotal === creep.carryCapacity) {
        creep.memory.empty = false;
    } else if (creep.carryTotal !== creep.carry[RESOURCE_ENERGY]) {
        creep.memory.empty = false;
    }

    var storage = creep.room.storage;
    var terminal = creep.room.terminal;
    let max = 5000;
    if (Game.shard.name !== 'shard1') {
        max = 4500;
    }
    if (creep.room.name !== creep.memory.home) {
        return true;
    }

    if (creep.memory.empty) {
        if (roleParent.containers.withdrawFromLink(creep, 200)) {
            creep.memory.empty = false;
            return true;
        }
        if (creep.room.energyIn) {
            if (roleParent.constr.withdrawFromTS(creep, 10)) {
                creep.say('rmtombstone');
                return true;
            }
        } else {
            if (roleParent.constr.withdrawFromTS(creep)) {
                creep.say('mtombstone');
                return true;
            }

        }

        /*        if (Game.shard.name === 'shard2' && creep.room.name === 'E29S48') {
                    if (!linkPickUpEnergy(creep)) {
                        if (creep.room.storage.total !== creep.room.storage.store[RESOURCE_ENERGY]) {
                            for (var e in creep.room.storage.store) {
                                if (e !== RESOURCE_ENERGY) {
                                    creep.moveToWithdraw(creep.room.storage, e);
                                    return;
                                }
                            }
                        }
                    } else {
                        return;
                    }
                } else */
        if (creep.room.controller.level > 5 && storage && terminal && storage.total < 997000 && terminal.total < 297000) { //  && creep.carryTotal === 0 
            let i = RESOURCES_ALL.length;
            while (i--) { // 43 total -2 * 5000 = 205000 = 95,000 left, energy should be capped at 750000
                let min = RESOURCES_ALL[i];
                if (min === RESOURCE_ENERGY) {
                    max = terminalEnergyLimit;
                } else {
                    max = 5000;
                    if (Game.shard.name !== 'shard1') {
                        max = 4500;
                    }

                }
                /*                if (min === RESOURCE_POWER && Game.shard.name !== 'shard1') {
                                    if (storage.store[min] > 0) {
                                        let amount = storage.store[min];
                                        if (amount > creep.carryCapacity) {
                                            amount = creep.carryCapacity;
                                        }
                                        creep.moveToWithdraw(storage, min, amount);
                                        return true;
                                    }
                                }*/
                if ((terminal.store[min] === undefined || terminal.store[min] < max) && storage.store[min] > 0 && !terminal.full) {
                    creep.say('5000stor');
                    let minAmount = terminal.store[min];
                    if (minAmount === undefined) minAmount = 0;
                    let amount = max - minAmount; // 50000
                    if (amount > creep.carryCapacity) {
                        amount = creep.carryCapacity;
                    }
                    if (creep.carryTotal > 0) {
                        amount -= creep.carryTotal;
                    }
                    //terminal needs it form storage : E59S34 XGHO2 1600 8028 -8
                    creep.moveToWithdraw(storage, min, amount);
                    creep.say(max);
                    //                  if (Game.shard.name === 'shard0')


                    return true;

                } else if (terminal.store[min] > max) {
                    if (min === RESOURCE_ENERGY && creep.room.memory.energyIn) continue;
                    //  if(Game.shard.name === 'shard3'){
                    //   	console.log(terminal.store[min], max,min );
                    //   }

                    let amount = terminal.store[min] - max;
                    creep.say(amount + ' 5Kt:' + min);
                    if (storage.total < 1000000) {
                        if (creep.pos.isNearTo(terminal)) {
                            if (amount > (creep.carryCapacity - creep.carryTotal)) {
                                amount = (creep.carryCapacity - creep.carryTotal);
                            }
                            creep.withdraw(terminal, min, amount);
                        } else {
                            creep.moveMe(terminal);
                        }
                        //                        console.log('terminal has extra and transfer storage:', roomLink(creep.room.name), min, amount);
                        return true;

                    } else if (storage.total === 1000000) {
                        // Storage has too much and needs to transfer this out of this room.
                        //                      console.log('terminal has extra and moving out:', roomLink(creep.room.name), min, amount);
                        _terminal_().sendMineralFromTerminal(terminal, min);
                    }
                }

            }
        }
        if (creep.room.terminal && (creep.room.terminal.total > 295000 || (creep.room.terminal.total > (295000 + creep.carryCapacity) && creep.room.terminal.store[RESOURCE_ENERGY] < 10000)) && !creep.room.storage.full) {
            for (let i in creep.room.terminal.store) {
                if (creep.room.terminal.store[i] > 4500) {
                    let amount = creep.room.terminal.store[i] - 4500;
                    if(amount > 0){
                    	if(amount > creep.carryCapacity) {
                    		amount = creep.carryCapacity;
                    	}
                    creep.moveToWithdraw(creep.room.terminal, i, amount);
                    break;
                }
                }
            }
            creep.say('2MuchT');
            return true;
        } else if (creep.room.storage && creep.room.storage.total > (995000 + creep.carryCapacity)) {
            if (creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
            } else {
                for (let ee in creep.room.terminal.store) {
                    if (creep.room.storage.store[ee] > 0 && creep.room.terminal.store[ee] < 4500) {
                        creep.moveToWithdraw(creep.room.storage, ee);
                        break;
                    }
                }
            }
            creep.say('2MuchS');
            return true;
        }
        /*else if (creep.room.storage.store[RESOURCE_ENERGY] === 0){
                   creep.moveToWithdraw(creep.room.storage, creep.room.storage.storing);
                   creep.say('NoESt');
               } */

        if (creep.room.terminal !== undefined && creep.room.storage !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000 && creep.room.terminal.total > 298000 && creep.memory.roleID === 0) {
            for (let i in creep.room.terminal.store) {
                if (i !== RESOURCE_ENERGY && i !== RESOURCE_POWER) {
                    creep.moveToWithdraw(creep.room.terminal, i);
                    break;
                }
            }
            console.log('bad Terminal Energy room:', roomLink(creep.room.name));
            creep.say('bT');
            return true;
        }

        if (creep.room.terminal !== undefined && creep.room.storage !== undefined && creep.room.storage.total < 995000 && creep.room.terminal.store[RESOURCE_ENERGY] > 75000) {
            if (creep.pos.isNearTo(creep.room.terminal)) {
                let amount = creep.room.terminal.store[RESOURCE_ENERGY] - 75000;

                if (amount > creep.carryCapacity) {
                    amount = creep.carryCapacity;
                }
                //                console.log(amount,creep.room.terminal.store[RESOURCE_ENERGY]);
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY, amount);
                creep.memory.empty = false;
            } else {
                creep.moveTo(creep.room.terminal, { reusePath: 20 });
            }
            creep.say('bS');
            return true;
        }


        if (creep.carryTotal > 0) creep.memory.empty = false;
        return false;



    } else {
        let e = creep.carrying;
        if (creep.room.terminal === undefined && creep.room.storage === undefined) {
            tgt = Game.flags[creep.room.name];
            if (tgt !== undefined) {
                if (creep.pos.isNearTo(tgt)) {
                    creep.drop(creep.carrying);
                } else {
                    creep.moveMe(tgt);
                }

                return true;
            }
        }

        var tgt;
        switch (e) {
            case "energy":
                if (!creep.room.terminal) {
                    tgt = creep.room.storage;
                } else
                if (creep.room.storage.total > 995000 && creep.room.terminal.total < 295000) {
                    creep.say('TT');
                    tgt = creep.room.terminal;
                } else
                if (creep.room.terminal.total > 295000 && creep.room.storage.total < 995000) {
                    creep.say('SS');
                    tgt = creep.room.storage;
                } else if (creep.room.storage.total > 995000) {
                    creep.say('S>tt');
                    tgt = creep.room.terminal;
                } else if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < terminalEnergyLimit && creep.room.terminal.total < 291000) {
                    creep.say('<');
                    tgt = creep.room.terminal;
                } else if (creep.room.storage.full) {
                    creep.say('eterm');
                    tgt = creep.room.terminal;
                } else {
                    creep.say('eStor');
                    tgt = creep.room.storage;
                }

                break;
            case "power":
                //                if (creep.room.powerspawn !== undefined && creep.room.powerspawn.power > 10){
                tgt = creep.room.terminal;
                if (tgt.store[RESOURCE_POWER] >= max) {
                    tgt = creep.room.storage;
                }
                //              }
                break;
            default:
                //          if (creep.room.storage.total > 995000) {
                //                console.log('ROOM TO FULL DROPPING', roomLink(creep.room.name));
                //                  tgt = creep.room.terminal;
                //                }
                if (Game.shard.name === 'shard2' && creep.room.name === 'E29S48') {
                    tgt = creep.room.terminal;
                } else if (storage && storage.total === 1000000) {
                    creep.say('MTT');
                    tgt = creep.room.terminal;
                } else
                if (terminal && (terminal.store[creep.carrying] === undefined || terminal.store[creep.carrying] < max) && terminal.total !== 300000) {
                    // If terminal has less than max, then 
                    // move to terminal.
                    creep.say('MTT');
                    tgt = creep.room.terminal;
                } else {
                    creep.say('MSS');
                    tgt = creep.room.storage;
                }


                break;
        }

        if (tgt !== undefined) {

            let rst = creep.moveToTransfer(tgt, creep.carrying, { reusePath: 20, maxRooms: 1 });
            //            creep.say(tgt.structureType + "2@");
            if (rst !== OK) {
                //                console.log(rst,roomLink(creep.room.name),'has bad transfer',tgt.structureType);
                //creep.drop(creep.carrying);
                creep.memory.empty = true;
            }
            return true;
            //            creep.say('D' + + tgt.structureType);
        }

        return false;

    }

}


var jobList;

class roleLinker extends roleParent {

    static levels(level) {
        if (level == 10) {
            return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
        } else if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle(classLevels[level].body);
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
        creep.memory.role = 'job';
        if (creep.room.controller === undefined) {
            roomLevel = 0;
        } else {
            roomLevel = creep.room.controller.level;
        }
        if (creep.room.name !== creep.memory.home) {
            creep.moveMe(Game.rooms[creep.memory.home].alphaSpawn, { reusePath: 50 });
            return;
        }

        // control progress

        let workers = 0;
        if (jobList === undefined) jobList = {};
        if (jobList[creep.memory.home] === undefined) jobList[creep.memory.home] = {};
        let aa = 0;

        if (creep.memory.roleID === 0) {
            if (roomLevel != 8 && creep.room.controller !== undefined) {
                creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
            }
            for (var a in jobList[creep.memory.home]) {
                if (Game.creeps[jobList[creep.memory.home][a]] === undefined) {
                    jobList[creep.memory.home] = {};
                } else {
                    //         creep.room.visual.text(a + ":" + jobList[creep.memory.home][a] + "T:" + Game.creeps[jobList[creep.memory.home][a]].ticksToLive, 10, 25 + aa, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                }

                if (creep.ticksToLive < 150 && Game.creeps[jobList[creep.memory.home][a]] && Game.creeps[jobList[creep.memory.home][a]].ticksToLive !== creep.ticksToLive) {
                    let dif = Game.creeps[jobList[creep.memory.home][a]].ticksToLive - creep.ticksToLive;
                    let thresh = 150;
                    if (dif < thresh) {
                        creep.suicide();
                        //                        console.log(roomLink(creep.room.name), 'lets see if there"s enough ticks between links', a, thresh, dif, "=", Game.creeps[jobList[creep.memory.home][a]].ticksToLive, "-", creep.ticksToLive, "How many creeps?");
                    }


                }
                aa++;
            }
        }


        jobList[creep.memory.home][creep.memory.roleID] = creep.name;
        workers = Object.keys(jobList[creep.memory.home]).length;

        if (creep.memory.roleID !== 0 && creep.room.storage !== undefined && creep.room.terminal !== undefined && creep.room.storage.my && !creep.room.terminal.my && creep.room.terminal.total !== 0) {
            // Emptying terminal when it's not ours.
            if (creep.carryTotal === 0) {
                creep.moveToWithdraw(creep.room.terminal, creep.room.terminal.storing);
            } else {
                creep.moveToTransfer(creep.room.storage, creep.carrying);
            }
            return;
        }
        //if(Game.shard.name === 'shard2x'){
        //    if(creep.carryTotal === 0){
        //          if(linkPickUpEnergy(creep))
        //                return;
        //            }else {
        //                creep.moveToTransfer(creep.room.terminal,creep.carrying);
        //          }
        //}
        /*
            if(creep.memory.roleID === 0){
            if(creep.carryTotal === 0 && creep.room.terminal.total > 295000){
                creep.moveToWithdraw(creep.room.terminal,'H');
            } else {
                creep.drop(creep.carrying);
            }
        } 
        if(creep.memory.roleID === 1){
            if(creep.carryTotal === 0 ){
            creep.moveToWithdraw(creep.room.storage,RESOURCE_ENERGY);
            } else {
                creep.moveToTransfer(creep.room.terminal,creep.carrying);
            }

        } 
            creep.say("BICZCH");
            return;
        } */
        //    if(creep.room.name === 'E38S72'){
        //                      let high = _.max(creep.room.storage.store, a => a !== RESOURCE_ENERGY);
        //                        console.log('High',high);
        //   }

        if (creep.memory.roleID === 0 && job.signController(creep)) {
            return true;
        }

        if (creep.saying === 'mtombstone') {
            if (creep.carryTotal !== creep.carryCapacity && roleParent.constr.withdrawFromTS(creep)) {
                creep.say('mtombstone');
                return true;
            }
        }
        if (creep.saying === 'rmtombstone') {
            if (creep.carryTotal !== creep.carryCapacity && roleParent.constr.withdrawFromTS(creep, 10)) {
                creep.say('rmtombstone');
                return true;
            }
        }
        if (creep.saying === 'SAFEMODE') {
            if (job.makeSafeMode(creep))
                creep.say('SAFEMODE');
            return true;
        }
        if (creep.saying === 'ENGY') {
            if (linkPickUpEnergy(creep)) {

                creep.say("ENGY");

                return;
            }
        }
        if(creep.saying === 'MINS'){
        	if(linkPickUpMineral(creep)){
        		creep.say('MINS');
        		return;
        	}
        }

        if (creep.memory.roleID === 0 && Game.flags.emptyTerminal !== undefined && Game.flags.emptyTerminal.pos.roomName === creep.room.name) {
            creep.room.memory.labMode = 'none';
            creep.room.memory.lab2Mode = 'none';
            // Labs
            // Storage
            if (creep.carryTotal > 0) {
                if (creep.room.terminal.total !== creep.room.terminal.store[RESOURCE_ENERGY]) {
                    creep.moveToTransfer(creep.room.terminal, creep.carrying);
                }
            } else {

                for (var e in creep.room.storage.store) {
                    if (creep.room.terminal.store[RESOURCE_ENERGY] < 15000) {
                        //                  if (e !== RESOURCE_ENERGY && creep.room.storage.store[e] > 0) {
                        creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                        //                    }
                    } else {
                        if (e !== RESOURCE_ENERGY && creep.room.storage.store[e] > 0) {
                            creep.moveToWithdraw(creep.room.storage, e);
                        }
                    }
                }
            }
            //            creep.say('moving everything to terminal');


            // Terminal
            // Send them away
            _terminal_().clearTerminal(creep.room.name);

            creep.room.memory.labsNeedWork = true;
            if (job.doLabs(creep)) {
                //        return;
            } else {
                creep.room.memory.labMode = 'none';
                creep.room.memory.labsNeedWork = false;
            }

            return;
        }
        if (creep.room.storage !== undefined && creep.room.terminal !== undefined && (creep.room.terminal.store.energy < 1000 || creep.room.storage.store.energy < 1000)) {
            roomRequestMineral(creep.room.name, RESOURCE_ENERGY,5000);
        }
        //if (creep.body.length <= 6) console.log('Creep <6 body@', roomLink(creep.room.name));
        //if (creep.room.controller !== undefined && roomLevel > 4) 
        //if (creep.room.name !== creep.memory.home) console.log('link outside of home', roomLink(creep.room.name));
        //if (creep.room.storage && creep.room.storage.store[RESOURCE_POWER] > 0) creep.moveToWithdraw(creep.room.storage, RESOURCE_POWER);
        //            creep.pickUpEnergy();
        if (creep.room.memory.maxLinkers&&workers === creep.room.memory.maxLinkers && creep.memory.roleID === 0 && creep.ticksToLive <= 144) {
            super.rebirth(creep);
        }
        switch (creep.memory.roleID) {
            case 0:
                //              if(creep.room.storage && creep.room.storage.full && creep.carryTotal === 0){
                //                    creep.moveToWithdraw(creep.room.storage,RESOURCE_ENERGY);
                //  return;
                //}
                if (Game.cpu.bucket > 3000) creep.pickUpEverything();
                if (workers === 1 || creep.room.controller !== undefined && roomLevel < 5) { // If alone then it does everything. 
                    if (creep.room.energyAvailable === creep.room.energyCapacityAvailable && !creep.room.memory.labsNeedWork && job.doPowerspawn(creep)) {
                        //                        creep.say('pspwn', true);
                        break;
                    }

                    if (job.doBoostLab(creep)) {
                        //                        creep.say('bLabs#1', true);
                        break;
                    }
                    if (creep.room.energyAvailable > creep.room.energyCapacityAvailable >> 1 && job.doMineralContainer(creep)) {
                        return;
                    }
                    if (job.doRoomEnergy(creep)) {
                        //                        creep.say('engy#1', true);
                        return;
                    }
                    if (creep.room.energyAvailable === creep.room.energyCapacityAvailable && creep.room.memory.labsNeedWork) {
                        //                      creep.say('Labs', true);
                        job.doLabs(creep);
                        break;
                    }
                    if (job.newDoRefill(creep)) {
                        //                        creep.say('refil!!', true);
                        return;
                    }
                    if (creep.saying !== 'nuke' && linkTerminalStorageBalance(creep)) {
                        return;
                    }
                    if (job.doNuke(creep)) {
                        creep.say('nuke');
                        return;
                    }

                    if (job.makeSafeMode(creep)) {
                        creep.say('SAFEMODE');
                        return true;
                    }

                    if (linkPickUpEnergy(creep)) {
                        creep.say("ENGY");
                        return;
                    }

                    nojobs(creep);
                    return;
                } else if (workers === 2) {
                    if (job.doBoostLab(creep)) {
                        //   creep.say('bst');
                        break;
                    }
                    if (job.doLabs(creep)) {
                        //                           creep.say('labs');
                        return;
                    }

                    if (job.doPowerspawn(creep)) {
                        //    creep.say('pwer');
                        return;
                    }
                    //     if (job.doBoostLab(creep)) {
                    //creep.say('bLabs#1');
                    //        return;
                    //    }
                    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable >> 1) {
                        if (job.doRoomEnergy(creep)) {
                            //                            creep.say('rmd');
                            return;
                        }
                    }

                    if (linkTerminalStorageBalance(creep)) {
                        //              creep.say('blnce');
                        return;
                    }
                    if (job.makeSafeMode(creep)) {
                        creep.say('SAFEMODE');
                        return true;
                    }
                    //                    if (linkPickUpEnergy(creep)) {
                    //                      creep.say("ENGY");

                    //                    return;
                    //              }

                    //nojobs(creep);
                    linkPickUpMineral(creep);
                    return;

                } else {
                    if (job.doBoostLab(creep)) {
                        return;
                    }
                    if (job.doPowerspawn(creep)) {
                        creep.say('pwr');
                        return;
                    }
                    if (workers === 2 && creep.room.energyAvailable < creep.room.energyCapacityAvailable >> 1) {
                        if (job.doRoomEnergy(creep)) {
                            //                            creep.say('rmd');
                            return;
                        }
                    }
                    if (linkTerminalStorageBalance(creep)) {
                        return;
                    }

                    if (job.makeSafeMode(creep)) {
                        creep.say('SAFEMODE');
                        return true;
                    }
                  //  nojobs(creep);
                  	linkPickUpMineral(creep);
                    return;
                }
                break;

            case 1:
                if (workers === 2) {
                    if (job.doMineralContainer(creep)) {
                        creep.say('miner');
                        return;
                    }
                    if (job.doRoomEnergy(creep)) {
                        creep.say('Rengy');
                        return;
                    }
                    if (!creep.room.memory.labsNeedWork && creep.saying !== 'nuke' && this.depositNonEnergy(creep)) {
                        creep.say('dpst');
                        return;
                    }

                    if (job.newDoRefill(creep)) {
                        creep.say('refil2');
                        return;
                    }


                    if (job.doNuke(creep)) {
                        creep.say('nuke');
                        return;
                    }

                    if (roomLevel < 5 && linkTerminalStorageBalance(creep)) {
                        return;
                    }
                    nojobs(creep);
                    break;
                } else {
                    if (creep.carrying !== 'G' && !creep.room.memory.labsNeedWork && this.depositNonEnergy(creep)) {
                        creep.say('dep');
                        return;
                    }
                    if (job.doLabs(creep)) {
                        //                        creep.say('lab');

                        return;
                    }
                    if (workers !== 1 && job.doRefill(creep)) {
                        creep.say('fill');

                        return;
                    }
                    if (creep.room.energyAvailable < creep.room.energyCapacityAvailable && job.doRoomEnergy(creep)) {
                        //    creep.say('room');
                        return;
                    }
                    if (job.doNuke(creep)) {
                        creep.say('nuke');
                        return;
                    }
                    nojobs(creep);
                }
                break;
            default:
                if (job.doMineralContainer(creep)) {
                    return;
                }
                if (linkPickUpEnergy(creep) === OK) {
                    creep.say('ENGY');
                    return;
                }

                if (job.doRoomEnergy(creep)) {
                    return;
                }

                nojobs(creep);
                break;
        }

    }
}

module.exports = roleLinker;