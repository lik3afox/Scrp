// Back line
// Designed for healing.

var classLevels = [
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

var doMove;
//STRUCTURE_POWER_BANK:
class trollClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        var build = classLevels[level];
        let attk = Math.floor(Math.random() * 5) + 1;
        let rnge = 5-attk;
        //        let work = Math.floor(Math.random() * (5 - attk - rnge));

        let a;
        a = attk;
        while (a--) {
            build.push(ATTACK);
        }
        a = rnge;
        while (a--) {
            build.push(RANGED_ATTACK);
        }
        /*        a = work;
                while (a--) {
                    build.push(WORK);
                } */
        //        console.log(build.length);
        return build;
    }

    static run(creep) {

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        if (super.boosted(creep, ['XLHO2', 'XGHO2', 'XZHO2'])) {
            return;
        }

        movement.flagMovement(creep);
        if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
            creep.rangedMassAttack();
        }
        var bads;
        /*
                if (creep.getActiveBodyparts(WORK) > 0) {
                    bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                    bads = _.filter(bads, function(o) {
                        return !_.contains(fox.friends, o.owner.username);
                    });
                    if (bads.length > 0) {
                        creep.dismantle(bads[0]);
                        return true;
                    }
                } else if (creep.getActiveBodyparts(ATTACK) > 0) {
                    bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                    bads = _.filter(bads, function(o) {
                        return !_.contains(fox.friends, o.owner.username);
                    });
                    if (bads.length > 0) {
                        creep.attack(bads[0]);
                        return true;
                    }
                } */
            if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
                creep.rangedMassAttack();
            }
/*        if (creep.hits === creep.hitsMax) {
            if (creep.getActiveBodyparts(ATTACK) > 0) {
                bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                bads = _.filter(bads, function(o) {
                    return !_.contains(fox.friends, o.owner.username);
                });
                if (bads.length > 0) {
                    creep.attack(bads[0]);
                    return true;
                }
            }
        } else {*/
            creep.heal(creep);
//        }

        if (creep.room.name == 'E18S64') {
            var site = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
            site = _.filter(site, function(o) {
                return !o.pos.lookForStructure(STRUCTURE_RAMPART);
            });
            creep.say(site.length);
            if (site.length > 0) {
                var zzz = creep.pos.findClosestByRange(site);
                creep.moveTo(zzz);
            }
        }
    }
}

module.exports = trollClass;
