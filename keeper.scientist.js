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
    //4
    [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY], // 550
    //5
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //6
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY]
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
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        memoryCheck(creep);

        let carry = _.sum(creep.carry);
        /*
                if(creep.memory.keeperLairID != undefined && creep.memory.goal != undefined && creep.memory.ExtractID != undefined ) {
                    console.log('has it all');
                        let goal = Game.getObjectById(creep.memory.goal);
                        if(creep.pos.isNearTo(goal) && carry < creep.carryCapacity - 45 ) {
                            let sKep = Game.getObjectById(creep.memory.keeperLairID);
                            if (sKep.ticksToSpawn != undefined && sKep.ticksToSpawn > 15) {
                                let extract = Game.getObjectById(creep.memory.ExtractID);
                                if(extract.cooldown == 0) {
                                    console.log('har');
                                    creep.harvest(goal);
                                    return;
                                }
                                console.log('skip');
                                return;
                            }
                        }

                } */
        // needs keeperlairID, need mineralID, need ExtractID, 

        if (super.boosted(creep, boost)) {
            return;
        }
        if (super.returnEnergy(creep)) return;
        if (movement.runAway(creep)) return;

        if (carry === 0) {
            creep.memory.mining = true;
            creep.memory.goHome = false;
        }
        if (carry > creep.carryCapacity - 45) {
            creep.memory.mining = false;
            creep.memory.goHome = true;
        }
        if (creep.room.name == creep.memory.home && creep.ticksToLive < 200 && _.sum(creep.carry) === 0) {
            creep.memory.death = true;
        }

        var _goal = movement.getRoomPos(creep.memory.goal);
        let min = Game.getObjectById(creep.memory.goal);
        if (creep.room.name == 'W5S94') {
            console.log(min, min !== null ? min.mineralAmount : 0, carry);
        }
        if (min !== null && min.mineralAmount === 0 && carry === 0) {
            creep.memory.death = true;
        }

        if (super.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }

        // He's not in 5 spaces of his goal. so he needs to move there. 
        if (creep.memory.goHome) {
            if (creep.room.name == 'E33S76') {
                if (creep.pos.isNearTo(creep.room.storage)) {
                    for (var e in creep.carry) {
                        creep.transfer(creep.room.storage, e);
                    }
                } else {
                    creep.say('tt');
                    creep.moveTo(creep.room.storage, {
                        reusePath: 30
                    });
                    return;
                }
            } else if (creep.room.terminal !== undefined && creep.room.controller.owner !== undefined) {
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
                //                  creep.say('home');
                if (!super.guardRoom(creep)) {
                    if (creep.memory.goal == '5836bb2241230b6b7a5b9a35z' || creep.memory.goal == '5836bb2241230b6b7a5b9a35' || creep.memory.goal == '5836bb2241230b6b7a5b9a33z') {
                        //                        if (!super.goToFocusFlag(creep)) {
                        super._movement.moveHome(creep);
                        //                        }
                    } else {
                        super._movement.moveHome(creep);
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
