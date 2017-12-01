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
var contain = require('commands.toContainer');

function clearLabs(creep) {
    let labs = creep.room.find(FIND_STRUCTURES);
    labs = _.filter(labs, function(structure) {
        return (structure.structureType == STRUCTURE_LAB && structure.mineralAmount > 0);
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
    if (creep.carryTotal === 0) {
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


function banditAction(creep) {
    if(creep.memory.goHome === undefined) 
        creep.memory.goHome = false;
    if(Game.flags[creep.memory.party] === undefined) creep.memory.death = true;
            creep.memory.reportDeath = true;

    if(creep.carryTotal == creep.carryCapacity){
    creep.memory.goHome = true;        
    }
    if(creep.carryTotal === 0){
    creep.memory.goHome = false;        
    }
    if(creep.memory.goHome){
        var stor =  Game.rooms[creep.memory.home].terminal;
        if(creep.pos.isNearTo(stor)){
            for(var eee in creep.carry){
                if(creep.carry[eee]> 0){
                creep.say( creep.transfer(stor,eee)+eee );
                break;
                }
            }
        } else {
            creep.moveTo(stor,{reusePath:50});
            }
        return;
    }
    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {

            bads = creep.room.find(FIND_STRUCTURES);
             var   cont = _.filter(bads, function(structure) {
                    return (structure.structureType == STRUCTURE_CONTAINER && structure.total > 0 );
                });

            if (cont.length > 0) {
                cont.sort((a, b) => a.pos.getRangeTo(creep) - b.pos.getRangeTo(creep));
                if (creep.pos.isNearTo(cont[0])) {
                    for(var e in cont[0].store){
                        creep.withdraw(cont[0],e);
                    }
                } else {
                    creep.moveTo(cont[0]);
                }
                return true;
            }
            if(cont.length === 0) {
                creep.memory.goHome = true;
                if(bads.length > 0){
    //                Game.flags[creep.memory.party].remove();
                }
            }

        }
        movement.flagMovement(creep);
    }
}
//STRUCTURE_POWER_BANK:
class thiefClass extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        if (super.baseRun(creep)) return;

        if (super.boosted(creep, boost)) {
            return;
        }

        if (super.spawnRecycle(creep)) {
            return;
        }
            super.rebirth(creep);
        if (creep.memory.party == 'Flag1') {
            creep.say('bandit');
            banditAction(creep);
            return;
        }
        if (super.isPowerParty(creep)) {
            if (powerAction(creep)) return;
        }

        //        if (super.constr.pickUpNonEnergy(creep)) return;

        let creepCarry = creep.carryTotal;

        if (creep.memory.home == creep.room.name && creep.ticksToLive < 500 && creepCarry === 0) {
            creep.memory.death = true;
        }
        if (creep.memory.home == creep.room.name && creep.carryTotal > 0) {
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
                    creep.moveTo(par, { reusePath: 75 });
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
                    creep.moveTo(parent, { reusePath: 75 });
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
            if (creep.room.name == 'E35S83') {
                creep.say('E38');
                var bads = creep.room.find(FIND_HOSTILE_CREEPS);
                if (bads.length > 0) {
                    creep.moveTo(Game.flags[creep.memory.party]);
                } else {
                    super.constr.moveToPickUpEnergy(creep);
                }
                return;
            } else {
                target = creep.room.storage;
                //   getting;
                if (target !== undefined) {
                    for (var e in target.store) {
                        //                        if (e != RESOURCE_ENERGY)
                        if (target.store[e] > 0 && e !== RESOURCE_ENERGY) {
                            getting = e;
                            break;
                        }
                    }
                }
                if (getting === undefined) {
                    target = creep.room.terminal;
                    if (target !== undefined) {
                        for (var o in target.store) {
                            if (target.store[o] > 0 && o !== RESOURCE_ENERGY) {
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
                    creep.moveMe(target, { reusePath: 75 });
                }
            }




        }
        if (creep.carryTotal == creep.carryCapacity && creep.memory.home != creep.room.name) {

            var parentz = Game.getObjectById(creep.memory.parent);
            //            parent = new RoomPosition(35,35,"E38S72");
            if (creep.pos.isNearTo(parentz)) {
                creep.drop(RESOURCE_ENERGY);
            } else {
                if (!super.avoidArea(creep)) {
                    creep.moveMe(parentz, { reusePath: 75 });
                }
            }

        }
    }
}

module.exports = thiefClass;
