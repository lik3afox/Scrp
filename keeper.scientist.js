var roleParent = require('role.parent');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');
var source = require('commands.toSource');
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
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]

];

function memoryCheck(creep) {
    if (creep.memory.distance === undefined) {
        creep.memory.distance = 0;
    }
    //        creep.memory.mineralID = creep.memory.goal;
}

class mineralRole extends roleParent {
    static levels(level) {
        return classLevels[level];
    }

    static run(creep) {
        if (super.doTask(creep)) {
            return;
        }

        let carry = _.sum(creep.carry);
        if (creep.saying == 'zZzZ') {
            if (carry > 0) {
                creep.memory.mining = false;
                creep.memory.goHome = true;
            }
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

        var _goal = movement.getRoomPos(creep.memory.goal);

        this.rebirth(creep);

        if (_goal !== null && _goal.mineralAmount === undefined) {
            creep.memory.death = true;
        }

        if (super.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }

        // He's not in 5 spaces of his goal. so he needs to move there. 
        if (creep.memory.goHome) {

            if (creep.room.terminal !== undefined && (creep.room.controller.owner !== undefined || creep.room.name == creep.memory.home)) {
                if (creep.pos.isNearTo(creep.room.terminal)) {
                    for (var a in creep.carry) {
                        creep.transfer(creep.room.terminal, a);
                    }
                } else {
                    creep.say('tt');
                    creep.moveTo(creep.room.terminal, {
                        reusePath: 30
                    });
                    return;
                }
            } else if (creep.room.storage !== undefined && creep.room.controller.owner !== undefined) {
                if (creep.pos.isNearTo(creep.room.storage)) {
                    for (var z in creep.carry) {
                        creep.transfer(creep.room.storage, z);
                    }
                } else {
                    //                        creep.say('m');
                    creep.moveTo(creep.room.storage, {
                        reusePath: 30
                    });
                    return;
                }
            } else if (creep.room.name != creep.memory.home) {
                //                if (creep.memory.goal == '59834303d7922107c07815db'||creep.memory.goal == '59834303d7922107c078159d'||creep.memory.goal == '59834303d7922107c07815dd'||creep.memory.goal == '59834303d7922107c078159b') {
                // So we look through the room or all creeps for ztransport that has matching goal.

                if (creep.memory.ztransportID !== undefined) {
                    let zz = Game.getObjectById(creep.memory.ztransportID);
                    if (zz !== null) {
                        if (creep.pos.isNearTo(zz)) {
                            for (var e in creep.carry) {
                                if (creep.transfer(zz, e) == OK) {
                                    creep.memory.goHome = false;
                                    creep.memory.mining = true;
                                    return;
                                }

                            }
                        }
                    } else {
                        creep.memory.ztransportID = undefined;
                    }
                }
                creep.say('Looking for Ztransport');
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
                    }
                }

                return;
            }


        }

        if (_goal === null) {
            var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
            creep.say('creepy');
            creep.moveMe(goingTo, {
                ignoreRoads: _ignoreRoad,
                reusePath: 49,
                visualizePathStyle: visPath
            });

        } else if (!(_goal.roomName == creep.room.name && creep.pos.inRangeTo(_goal.x, _goal.y, 4))) {

            if (!super.guardRoom(creep)) {
                creep.moveTo(_goal, {
                    reusePath: 30
                });
                creep.memory.distance++;
            }
        } else {
            // First he mines and fill up.
            if (creep.memory.mining) {
                //                creep.say('fu',creep.memory.mining);
                var _source = Game.getObjectById(creep.memory.goal);
                if (_source !== null && _source.mineralAmount === 0) creep.memory.goHome = true;

                if (creep.pos.isNearTo(_source)) {
                    if (creep.memory.ExtractID === undefined) {
                        let vr = creep.room.find(FIND_STRUCTURES);
                        vr = _.filter(vr, function(s) {
                            return s.structureType == STRUCTURE_EXTRACTOR;
                        });
                        creep.memory.ExtractID = vr[0].id;
                    }
                    let extract = Game.getObjectById(creep.memory.ExtractID);
                    if (extract !== null && extract.cooldown === 0) {
                        if (creep.harvest(_source) == OK) {
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
                            }
                        }
                    }
                } else {
                    if (!super.guardRoom(creep)) {
                        creep.moveTo(_source, {
                            reusePath: 30
                        });
                    }
                }
            }
        }

    }
}
module.exports = mineralRole;