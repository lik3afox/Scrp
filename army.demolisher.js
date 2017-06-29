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
    switch (creep.room.name) {
        case "E18S64":
            var E18S64targets = ['59506a753d55600158180666'];
            for (var a in E18S64targets) {
                target = Game.getObjectById(E18S64targets[a]);
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        creep.dismantle(target);
                        break;
                    }
                }
            }
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username);
            });
            if (bads.length > 0) {
                creep.dismantle(bads[0]);
                return true;
            }
            return false;
        default:
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
            if (bads.length > 0) {
                creep.dismantle(bads[0]);
                break;
            }

            break;
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
        console.log(this.hits, this.hitsMax);
        if (!doAttack(creep))
            if (!creep.killBase()) {
                movement.flagMovement(creep);
                return;
            }
    }
}

module.exports = demolisherClass;
