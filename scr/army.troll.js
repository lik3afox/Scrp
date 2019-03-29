// Back line
// Designed for healing.

var classLevels = [{
    boost: ['XLHO2', 'XGHO2', 'XZHO2'],
    body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
}];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

var doMove;
//STRUCTURE_POWER_BANK:
class trollClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        var build;

        if (_.isArray(classLevels[level])) {
            build = classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            build = classLevels[level].body;
        } else {
            build = classLevels[level];
        }

        let attk = Math.floor(Math.random() * 5) + 1;
        let rnge = 5 - attk;
        let a;
        a = attk;
        while (a--) {
            build.push(ATTACK);
        }
        a = rnge;
        while (a--) {
            build.push(RANGED_ATTACK);
        }
        return build;
    }
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
return _.clone( classLevels[level].boost);}
        return;
    }

    static run(creep) {

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (creep.ticksToLive > 1495 &&  creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
//            creep.memory.boostNeeded = classLevels[creep.memory.level].boost;
creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.goToPortal(creep)) return;
        if(creep.partyFlag.color === COLOR_YELLOW)
            super.rebirth(creep);

if (creep.hits < creep.hitsMax - 200 ) {
        creep.moveToEdge();
    } else {
        movement.flagMovement(creep);
    }
        if (creep.getActiveBodyparts(RANGED_ATTACK) > 0) {
        let strcts = creep.pos.findInRange(FIND_STRUCTURES, 3, {
        filter: (structure) => {
            return (structure.structureType !== STRUCTURE_RAMPART && structure.structureType !== STRUCTURE_WALL);
        }
    });
        creep.say(strcts.length);
        if(strcts.length > 0) {
            creep.rangedAttack(strcts[0]);
        } else {
            creep.rangedMassAttack();
        }
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
        creep.selfHeal();
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