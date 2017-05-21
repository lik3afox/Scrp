// designed to carry and help keeper.guard, then goes to the targetSource;

// only 1 level and 
var classLevels = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, RANGED_ATTACK, HEAL, HEAL
];

/*
warinternal [4:18 PM] 
@likeafox they can't attack and heal, but they can ranged, heal, and move at the same time
*/
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var attack = require('commands.toAttack');
var struct = require('commands.toStructure');

var targetId = '587022ea601aa5b440019da3';

function getLeader(creep) {
    for (var e in Game.creeps) {
        if (Game.creeps[e].memory.role == 'guard') {
            creep.memory.leaderID = Game.creeps[e].id;
            return Game.creeps[e].id;
        }
    }
}

function moveCreep(creep) {}

class roleGuard extends roleParent {
    static levels(level) {
        return classLevels;
    }

    static run(creep) {

        if (super.returnEnergy(creep)) {
            return;
        }
        if (!super.run(creep)) return;
        creep.say('fol');

        if (creep.memory.leaderID === undefined) {
            creep.memory.leaderID = getLeader(creep);
            if (creep.memory.leaderID === undefined) {
                creep.say('NO');
                return;
            }
        }

        if (_.sum(creep.carry) === creep.carryCapacity) {
            creep.memory.full = true;
        }
        if (_.sum(creep.carry) === 0) {
            creep.memory.full = false;
        }

        if (creep.memory.full) {
            let target = Game.getObjectById(targetId);
            if (creep.pos.isNearTo(target)) {
                creep.transfer(target, RESOURCE_ENERGY);
            } else {
                creep.moveTo(target, { reusePath: 20 });
                creep.heal(creep);
            }
        } else {

            let ldr = Game.getObjectById(creep.memory.leaderID);

            if (creep.hits < creep.hitsMax) {
                creep.heal(creep);
            } else if (ldr !== null && ldr.hits < ldr.hitsMax) {
                if (creep.pos.isNearTo(ldr)) {
                    creep.heal(ldr);
                }
            }


            if (!struct.moveToPickUpEnergyIn(creep, 7)) {
                if (creep.room.name != ldr.room.name) {
                    creep.moveTo(ldr);
                } else {
                    creep.move(creep.pos.getDirectionTo(ldr));
                }
            }
        }

    }


}
module.exports = roleGuard;
