// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.420K

// only 1 level and 
//MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,

var classLevels = [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
    MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
    ATTACK, ATTACK, ATTACK,
    HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL
];

var testLevel = [TOUGH,
    MOVE,
    WORK,
    ATTACK,
    HEAL
];
// These need to be in the lab or else this creep isn't good enough :/
//var boost = ['ZO',RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,RESOURCE_CATALYZED_GHODIUM_ALKALIDE,RESOURCE_UTRIUM_ACID];
var boost = ['XLHO2', 'XUH2O', 'XZHO2', 'XGHO2'];
/*
warinternal [4:18 PM] 
@likeafox they can't attack and heal, but they can ranged, heal, and move at the same time
*/
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var attack = require('commands.toAttack');
//var flags = require('build.flags');


class roleGuard extends roleParent {
    static levels(level) {
        if (level > classLevels.length) level = classLevels.length;
        return classLevels;
    }

    static run(creep) {
        creep.say('fight');
        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.boosted(creep, boost)) {
            return; }
        //E27S81  spawn 58b6e108e5da646c1eb6c6e6
        // Wall   58bcaa7d2c6316d758cf9efd
        // Towers  58bc6d52bb2aee1d0c8e3315   58c9c9f7f26e3bce72b17dd9
        var E27S81 = ['58bcaa7d2c6316d758cf9efd', '58bc6d52bb2aee1d0c8e3315', '58b6e108e5da646c1eb6c6e6', '58c9c9f7f26e3bce72b17dd9'];
        /*
        E27S83 Spawn  58a9fdba731af3b5728739e6
        wall    58ab2f9c898ac10cb8279d45
        tower    58ac6458424ed8ae2d458199   58b1db117f77053560a6b350


        E26S83  spawn  58ac35a404c9964832f5e469


        */
        var E27S83 = ['58ac6458424ed8ae2d458199', '58a9fdba731af3b5728739e6', '58b1db117f77053560a6b350', '58ab2fa6942916376a3da166'];
        var E26S83 = ['58ae0750941231640dfdc503', '58b98340caf98c611b7ee2b8', '58ac35a404c9964832f5e469'];

        if (creep.hits < creep.hitsMax - 400) {
            creep.heal(creep);
        }

        if (creep.room.name == 'E27S81' && creep.room.controller.safemode === undefined) {
            creep.say('here I am');

            let target;
            for (var e in E27S71) {
                target = Game.getObjectById(E27S71[e]);
                if (target !== undefined) {
                    if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {}
                    creep.moveTo(target);
                    return;
                }
            }
        }

        var enemy = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);

        if (enemy.length > 0) {
            enemy = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if (creep.attack(enemy) == ERR_NOT_IN_RANGE) {
                creep.say('ahh');
                creep.moveTo(enemy);
            }
        } else {
            movement.flagMovement(creep);
            creep.heal(creep);
        }

    }


}
module.exports = roleGuard;
