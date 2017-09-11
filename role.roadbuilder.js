var containers = require('commands.toContainer');
var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var toSpawn = require('commands.toSpawn');
var movement = require('commands.toMove');
var source = require('commands.toSource');
/// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30


var classLevels = [
    [MOVE, WORK, WORK, CARRY], // 200/200
    [WORK, MOVE, CARRY, CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY], // 300/300
    [MOVE, WORK, MOVE, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, WORK, WORK, CARRY], // 300/300
    [MOVE, CARRY, MOVE, WORK, MOVE, CARRY, CARRY, MOVE, WORK, WORK, CARRY] // 300/300

];

class roadbuilder extends roleParent {

    static rebuildMe(creep) {
        super.rebuildMe(creep);
    }
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        creep.say('rr');
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }

        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }
        //constr.pickUpEnergy(creep);
        if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.mining = false;
        }
        if (_.sum(creep.carry) === 0 && creep.memory.goHome) {
            creep.memory.mining = true;
            //            creep.memory.goHome = false;
        }
        containers.toWithdraw(creep);
        if (creep.room.name == creep.memory.home && creep.memory.goHome) {
//            let home = require('build.spawn');
//            home.reportFrom(creep);
            creep.memory.death = true;
        }
        // first it always goes to the goal
        if (creep.memory.goHome) {
            creep.say('br');
            if (!creep.memory.mining) {
                // Head back home, but build roads on the way home.
                let constr = Game.getObjectById(creep.memory.construction);
                if (constr === null || creep.memory.construction === undefined) {
                    let road = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES, {
                        filter: object => (object.structureType == STRUCTURE_ROAD || object.structureType == STRUCTURE_WALL)
                    });
                    if (road !== null) {
                        creep.memory.construction = road.id;
                        constr = road;
                    }
                }

                let road = constr;
                /*creep.pos.findClosestByRange (FIND_CONSTRUCTION_SITES, {
                                filter: object => ( object.structureType == STRUCTURE_ROAD ||object.structureType == STRUCTURE_WALL)})*/

                if (road !== null) {
                    if (creep.build(road) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(road, { reusePath: 30 });
                    }

                } else {
                    if (!super.guardRoom(creep)) {
                        let zzz = Game.getObjectById(creep.memory.parent);
                        if (zzz !== null)
                            creep.moveTo(zzz, { reusePath: 30 });
                    }
                }
            } else {
                var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                if (goingTo !== null && creep.room.name != goingTo.roomName) {

                    creep.moveTo(goingTo, { reusePath: 30 });

                } else {
                    let sourced = Game.getObjectById(creep.memory.goal);

                    if (!constr.moveToPickUpEnergyIn(creep, 5)) {
                        if (!containers.moveToWithdraw(creep)) {
                            if (creep.pos.isNearTo(sourced)) {
                                if (creep.harvest(sourced) == OK) {
                                    super.keeperFind(creep);
                                }
                            } else {
                                if (!super.guardRoom(creep)) {
                                    creep.moveTo(sourced, { reusePath: 30 });
                                }
                            }
                        }
                    }
                    //}
                }

            }


        } else {

            if (Game.getObjectById(creep.memory.goal) === null) {
                var goingTo2 = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.
                if (!super.guardRoom(creep)) {
                    creep.moveTo(goingTo2, { reusePath: 30 });
                }
            } else {
                if (!super.guardRoom(creep)) {
                    creep.moveTo(Game.getObjectById(creep.memory.goal), { reusePath: 30 });
                    if (creep.pos.isNearTo(Game.getObjectById(creep.memory.goal))) {
                        creep.memory.goHome = true;
                        creep.memory.mining = true;
                    }
                }
            }
        }

        if (creep.ticksToLive < 5) {
            var spawn = require('build.spawn');
            spawn.reportDeath(creep);
            creep.suicide();
        }


    }
}
module.exports = roadbuilder;
