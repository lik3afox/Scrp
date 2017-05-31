//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY], //  300
    // Level 1
    [MOVE, MOVE, MOVE, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
    // Level 2

    [MOVE, CARRY, CARRY,
        MOVE, CARRY, CARRY,
        MOVE, CARRY, CARRY,
        MOVE, CARRY, CARRY,
        MOVE, CARRY, CARRY
    ],

    [CARRY,
        MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE
    ]

];
var boost = ['XKH2O'];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');
var contain = require('commands.toContainer');

function clearLabs(creep) {
    let labs = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return (structure.structureType == STRUCTURE_LAB && structure.mineralAmount > 0);
        }
    });
    creep.say(labs.length);
    if (labs.length > 0) {

        let zzz = labs[0];
        if (creep.pos.isNearTo(zzz)) {
            if (zzz.mineralAmount > 0) {
                creep.withdraw(zzz, zzz.mineralType);
            } else {
                //                creep.withdraw(zzz,RESOURCE_ENERGY);
            }
        } else {
            creep.moveTo(zzz);
        }
    }
}

function powerAction(creep) {
    var constr = require('commands.toStructure');
    if (_.sum(creep.carry) === 0) {
        if (Game.flags[creep.memory.party] !== undefined && creep.pos.inRangeTo(Game.flags[creep.memory.party], 4)) {
            if (!constr.pickUpCloseNonEnergy(creep)) {
                creep.say('here');
            }

        } else {
            if (Game.flags[creep.memory.party] !== undefined) {
                creep.moveMe(Game.flags[creep.memory.party], { reusePath: 100 });
            } else {
                creep.memory.death = true;

            }
        }
        if (Game.flags[creep.memory.party] === undefined && creep.room.name == creep.memory.home && creep.pos.isNearTo(creep.room.terminal)) {
            creep.memory.death = true;
        }
    } else {
        if (creep.room.terminal !== undefined && creep.room.controller !== undefined && creep.room.controller.owner !== undefined) {
            if (creep.pos.isNearTo(creep.room.terminal)) {
                for (var e in creep.carry) {
                    creep.transfer(creep.room.terminal, e);
                }
            } else {
                creep.moveTo(creep.room.terminal, { reusePath: 20 });
            }
        } else {
            creep.moveMe(Game.getObjectById(creep.memory.parent).room.terminal, { reusePath: 100 });
        }
    }
    return true;
}


//STRUCTURE_POWER_BANK:
class thiefClass extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        creep.memory.waypoint = true;
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        if (super.sayWhat(creep)) {
            return;
        }

        if (super.boosted(creep, boost)) {
            return;
        }

        if (super.returnEnergy(creep)) {
            return;
        }

        if (super.isPowerParty(creep)) {
            if (powerAction(creep)) return;
        }

        //        if (super._constr.pickUpNonEnergy(creep)) return;

        let creepCarry = _.sum(creep.carry);

        if (creep.memory.home == creep.room.name && creep.ticksToLive < 500 && creepCarry === 0) {
            creep.memory.death = true;
        }
        if (creep.memory.home == creep.room.name && _.sum(creep.carry) > 0) {
            // Find Minearls.
            if (creep.room.storage !== undefined) {
                contain.moveToStorage(creep);
            } else if (creep.room.terminal !== undefined) {
                contain.moveToTerminal(creep);
            } else {
                let par = Game.getObjectById(creep.memory.parent);
                if (creep.pos.isNearTo(par)) {
                    creep.drop(RESOURCE_ENERGY);
                } else {
                    creep.moveTo(par);
                }

            }
            return;
        }

        let isThere = false;
        if (Game.flags[creep.memory.party] !== undefined &&
            Game.flags[creep.memory.party].room !== undefined &&
            creep.room.name == Game.flags[creep.memory.party].room.name) {
            isThere = true;
        }

        if (!isThere) {
            creep.say('thief');
            if (creepCarry == creep.carryCapacity && creep.memory.home != creep.room.name) {
                var parent = Game.getObjectById(creep.memory.parent);
                if (!super.avoidArea(creep)) {
                    creep.moveTo(parent);
                }
            } else {
                if (!super.avoidArea(creep)) {
                    movement.flagMovement(creep);
                }
            }
            return;
        }

        creep.memory.waypoint = true;
        if (creepCarry < creep.carryCapacity) {
            let target;
            let getting;
            //            if(!){
            if (creep.room.name == 'E37S79z') {
                creep.say('E38');
                super._constr.moveToPickUpEnergy(creep);
                return;
            } else {
                target = creep.room.storage;
                //   getting;
                if (target !== undefined) {
                    for (var e in target.store) {
                        //                        if (e != RESOURCE_ENERGY)
                        if (target.store[e] > 0) {
                            getting = e;
                            break;
                        }
                    }
                }
                if (getting === undefined) {
                    target = creep.room.terminal;
                    if (target !== undefined) {
                        for (var o in target.store) {
                            if (target.store[o] > 0) {
                                getting = o;
                                break;
                            }
                        }
                    }
                }
            }
            //     }

            /*if(getting == undefined) {
                clearLabs(creep);
            }*/


            if (creep.pos.isNearTo(target)) {
                //                console.log(creep.withdraw(target, getting),target,getting);
                switch (creep.withdraw(target, getting)) {
                    case OK:
                        creep.say('ty', true);
                        break;
                    case -1:
                        creep.say(':(', true);
                        break;
                }
                return;
            } else {
                if (!super.avoidArea(creep)) {
                    creep.moveMe(target);
                }
            }




        }
        if (_.sum(creep.carry) == creep.carryCapacity && creep.memory.home != creep.room.name) {

            var parentz = Game.getObjectById(creep.memory.parent);
            //            parent = new RoomPosition(35,35,"E38S72");
            if (creep.pos.isNearTo(parentz)) {
                creep.drop(RESOURCE_ENERGY);
            } else {
                if (!super.avoidArea(creep)) {
                    creep.moveMe(parentz, { reusePath: 20 });
                }
            }

        }
    }
}

module.exports = thiefClass;
