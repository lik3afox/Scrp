var roleParent = require('role.parent');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');

var containers = require('commands.toContainer');

var boost = ['KH'];

var classLevels = [
    //0
    [MOVE, CARRY, WORK, WORK], //  300
    //1
    [MOVE, WORK, WORK, WORK, MOVE, CARRY], //  450
    //2
    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY], // 550
    //3
    [MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, MOVE, CARRY], // 550
    //4 700
    [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY], // 550
    //5 2550/36
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //6 3400/48
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    //7 4000/50    
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, ],

    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
        boost: ['UO'],
    }

];

function memoryCheck(creep) {
    if (creep.memory.distance === undefined) {
        creep.memory.distance = 0;
    }
    //        creep.memory.mineralID = creep.memory.goal;
}

class mineralRole extends roleParent {
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

    static run(creep) {
        if (super.baseRun(creep)) return;

        let carry = creep.carryTotal;
        if (creep.ticksToLive > 1200 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        memoryCheck(creep);

        if (super.spawnRecycle(creep)) return;
        if (movement.runAway(creep)) return;

        if (carry === 0) {
            creep.memory.mining = true;
            creep.memory.goHome = false;
        }
        if (carry > creep.carryCapacity - creep.stats('mineral')) {
            creep.memory.mining = false;
            creep.memory.goHome = true;
        }
        if (carry > 0 && (creep.ticksToLive < 100 || creep.memory.home == creep.room.name)) {
            creep.memory.mining = false;
            creep.memory.goHome = true;
        }
        if (creep.room.name == creep.memory.home && creep.ticksToLive < 200 && _.sum(creep.carry) === 0) {
            creep.memory.death = true;
        }

        if (creep.partyFlag !== undefined && creep.partyFlag.memory.mineral) {
            if (!creep.atFlagRoom) {
                creep.memory.goal = creep.partyFlag.memory.mineralID;
                creep.moveMe(creep.partyFlag, { reusePath: 50, useSKPathing: true, segment: true });
                creep.say('zFlag');
                return;
            }
        }

        var _goal = movement.getRoomPos(creep);
        var _source = Game.getObjectById(creep.memory.goal);
        if (_source === null && creep.partyFlag !== undefined && creep.atFlagRoom) {
            _source = creep.room.mineral;
        }
        this.rebirth(creep);

        if (creep.memory.party === undefined && super.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }
        if (creep.memory.party !== undefined && creep.partyFlag.color === COLOR_WHITE && (carry > creep.carryCapacity - creep.stats('mineral'))) {
            //                    creep.moveToTransfer(creep.homeRoom.terminal,creep.carrying,{reusePath:50,useSKPathing:true});
            creep.memory.death = true;
            return;
        }

        if (creep.memory.goHome) {
            if (creep.room.name != creep.memory.home) {
                if (creep.memory.ztransportID !== undefined) {
                    let zz = Game.getObjectById(creep.memory.ztransportID);
                    if (zz !== null) {
                        if (creep.pos.isNearTo(zz)) {
                            if (creep.transfer(zz, creep.carrying) == OK) {
                                creep.memory.goHome = false;
                                creep.memory.mining = true;
                                return;
                            }
                        } else if (creep.pos.roomName === zz.pos.roomName && creep.carryTotal !== creep.carryCapacity) {
                            zz.moveTo(creep, { reusePath: 50 });
                        }
                    } else {
                        creep.memory.ztransportID = undefined;
                    }
                }
                creep.say(creep.memory.goHome + 'Looking for Ztransport');
                if (creep.room.name == 'E14S38') {
                    creep.moveToTransfer(creep.room.terminal, creep.carrying, { reusePath: 50 });
                }
                if (creep.memory.goal === undefined) creep.memory.goal = creep.room.mineral.id;
                creep.memory.goHome = false;
                creep.memory.mining = true;
                if (creep.memory.ztransportID === undefined) {
                    var tranzs = creep.room.find(FIND_MY_CREEPS);
                    tranzs = _.filter(tranzs, function(object) {
                        return object.memory.role == 'ztransport' && object.memory.goal == creep.memory.goal;
                    });
                    if (tranzs.length > 0) {
                        tranzs[0].memory.scientistID = creep.id;
                        creep.memory.ztransportID = tranzs[0].id;
                    } else {
                        //     creep.sleep(10);
                    }
                }

                return;
            }


        } else if (!creep.pos.isNearTo(_source)) {
  //          if (!super.guardRoom(creep)) {
                creep.moveMe(_source !== null ? _source : movement.getRoomPos(creep), {
                    reusePath: 49,
                    segment: true,
                    useSKPathing: true,
                    //                    visualizePathStyle: visPath
                });
//            }
        } else {
            // First he mines and fill up.
            if (creep.memory.mining) {

                let gota = Game.getObjectById(creep.memory.keeperLairID);
                if (gota !== null && gota.ticksToSpawn === undefined) {

                    let badz = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
                    badz = _.filter(badz, function(object) {
                        return object.owner.username === 'Invader' && object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0;
                    });
                    if (badz.length > 0) {
                        if(creep.pos.getRangeTo( badz[0] ) >= 4 ) {

                        } else {
                            creep.runFrom(badz[0]);
                            creep.say('AHHHHH');
                        }
                        return;
                    }
                }



                if (_source !== null && _source.mineralAmount === 0) creep.memory.goHome = true;

                if (creep.pos.isNearTo(_source)) {
                    let extract = creep.room.extractor;
                    if (extract !== null && extract.cooldown === 0) {
                        if (creep.harvest(_source) == OK) {
                            if (creep.memory.goal === undefined) creep.memory.goal = _source.id;
                            super.keeperFind(creep);
                            if (creep.memory.ztransportID === undefined) {
                                var trans = creep.room.find(FIND_MY_CREEPS);
                                trans = _.filter(trans, function(object) {
                                    return object.memory.role == 'ztransport' && object.memory.goal == creep.memory.goal;
                                });
                                if (trans.length > 0) {
                                    trans[0].memory.scientistID = creep.id;
                                    creep.memory.ztransportID = trans[0].id;
                                }
                            } else {
                                let ez = Game.getObjectById(creep.memory.ztransportID);
                                if (ez === null);
                                creep.memory.ztransportID = undefined;
                            }
                            if (creep.partyFlag !== undefined) creep.sleep(Game.time + EXTRACTOR_COOLDOWN);
                        }
                    }
                }
            }
        }

        if (_source !== null && _source.mineralAmount === 0) {
            creep.memory.death = true;
        }


    }
}
module.exports = mineralRole;