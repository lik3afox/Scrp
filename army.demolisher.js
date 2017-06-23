//Back line
// Designed to do damage to all.
// every x = 50x5
var classLevels = [
    [MOVE, WORK], // 300
    // Not boosted
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Boosted level

    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]
];
var boost = ['ZH'];

var movement = require('commands.toMove');
var roleParent = require('role.parent');

function doAttack(creep) {
    let target;
    switch (creep.room.name) {
        case "E15S63":
            var E18S64targets = ['590e45817f0a72187ae0ceb6'];
            for (var a in E18S64targets) {
                target = Game.getObjectById(E18S64targets[a]);
                if (target !== null) {
                    if (creep.pos.isNearTo(target)) {
                        creep.dismantle(target);
                        break;
                    }
                }
            }
             bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
            if (bads.length > 0) {
                creep.dismantle(bads[0]);
                break;
            } 
            bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES,1);
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
        //        console.log(super.isFlagged(creep));
        if (super.isFlagged(creep)) {
            creep.memory.death = false;

        } else {
            creep.memory.death = true;
        }
        if (creep.memory.level == 2) {
            if (super.boosted(creep, ['XZHO2', 'XGHO2', 'XZH2O'])) {
                return;
            }
        }

        doAttack(creep);
        movement.flagMovement(creep);
        return;
    }
}

module.exports = demolisherClass;
