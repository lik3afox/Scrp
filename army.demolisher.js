//Back line
// Designed to do damage to all.
// every x = 50x5
var classLevels = [
    [MOVE, WORK], // 300
    // Not boosted
    [
        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
    ],
    // Boosted level

    [WORK, WORK, WORK, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE],
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE]
];
var boost = ['ZH'];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

function doAttack(creep) {
    let target;
    var E18S64targets;
    switch (creep.room.name) {
        case "E56S69":
            E18S64targets = ['5812412f7c14175b3153f70f'];
            for (var a in E18S64targets) {
                target = Game.getObjectById(E18S64targets[a]);
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        creep.dismantle(target);
                        return true;
                    }
                }
            }
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL;
            });
            if (bads.length > 0) {
                creep.dismantle(bads[0]);
                return true;
            }
            return false;
        case "E52S67":
            return false;
        default:
            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].memory.wallTarget !== 'none') {
                E18S64targets = [Game.flags[creep.memory.party].memory.wallTarget];
                for (var b in E18S64targets) {
                    target = Game.getObjectById(E18S64targets[b]);
                    if (target !== null) {
                        if (creep.pos.isNearTo(target)) {
                            creep.dismantle(target);
                            //          return true;
                        }
                    }
                }
                bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                bads = _.filter(bads, function(o) {
                    return !_.contains(fox.friends, o.owner.username);
                });
                if (bads.length > 0) {
                    creep.dismantle(bads[0]);
                    //                  return true;
                }
            } else {
                bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                bads = _.filter(bads, function(o) {
                    return !_.contains(fox.friends, o.owner.username);
                });
                if (bads.length > 0) {
                    creep.dismantle(bads[0]);
                    //                    return true;
                }
            }
            return false;
            /*        default:
                        bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
                        if (bads.length > 0) {
                            creep.dismantle(bads[0]);
                            break;
                        }

                        break; */
    }
    return false;
}

//STRUCTURE_POWER_BANK:
class demolisherClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length) level = classLevels.length;
        return classLevels[level];
    }

    static run(creep) {
        if (super.returnEnergy(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }

        //        console.log(super.isFlagged(creep));
        if (super.isFlagged(creep)) {
            creep.memory.death = false;

        } else {
            creep.memory.death = true;
        }
        if (creep.memory.level >= 2) {
            if (super.boosted(creep, ['XZHO2', 'XGHO2', 'XZH2O'])) {
                return;
            }
        }

        //        console.log(creep.room.name, creep.hits, Game.flags.warparty5.pos, Game.flags.warparty5);
        /*        if (creep.hits < 4500) {
                    super.edgeRun(creep);
                } */
        if (Game.flags[creep.memory.party] !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName && (creep.room.name == 'E52S64' || creep.room.name == 'E52S67')) {
            creep.killBase();
        } else if (!doAttack(creep)) {
            movement.flagMovement(creep);
        } else {
            movement.flagMovement(creep);
        }
        /*        var target = Game.getObjectById('588587458b65791f39f134c1');
                if (target !== null)
                    creep.dismantle(target); */

    }
}

module.exports = demolisherClass;
