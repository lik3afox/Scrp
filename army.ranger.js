// Back line
// Designed for shooting 

var classLevels = [
    [MOVE, RANGED_ATTACK],
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]

];
var boost = [RESOURCE_LEMERGIUM_OXIDE, 'KO'];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:

function rangeAttack(creep,targets){
            bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);    
                if (bads.length === 0) {
                for (var a in targets) {
                    target = Game.getObjectById(targets[a]);
                    if (target !== null) {
                        if (creep.pos.isNearTo(target)) {
                            creep.rangedMassAttack();
                            return true;
                        } else if (creep.pos.inRangeTo(target, 3)) {
                            creep.rangedAttack(target);
                            return true;
                        }
                    }
                }
                creep.rangedMassAttack();

            } else {
                if (bads[0] !== undefined) {
                    if (creep.pos.inRangeTo(bads[0], 3)) {
                        if (creep.pos.isNearTo(bads[0])) {
                            //creep.rangedAttack(bads[0]);
                            creep.rangedMassAttack();
                        } else {

                            creep.rangedAttack(bads[0]);
                        }
                        creep.say('pewpew', true);
                    }
                }
            }
}

function doAttack(creep) {
    let target;
    var bads;
        var a;
    switch (creep.room.name) {
        case "E18S64":
            var E18S64targets = ['58f844ac24da03916bf3b00b', '58efba5cd63a0941a119c94f', '58be88cc436155731968483e', '58d9bd5f8f81ea7c04bda21f'];
            bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);

            if (bads.length === 0) {
                for ( a in E18S64targets) {
                    target = Game.getObjectById(E18S64targets[a]);
                    if (target !== null) {
                        if (creep.pos.isNearTo(target)) {
                            creep.rangedMassAttack();
                            return true;
                        } else if (creep.pos.inRangeTo(target, 3)) {
                            creep.rangedAttack(target);
                            return true;
                        }
                    }
                }
                creep.rangedMassAttack();

            } else {
                if (bads[0] !== undefined) {
                    if (creep.pos.inRangeTo(bads[0], 3)) {
                        if (creep.pos.isNearTo(bads[0])) {
                            //creep.rangedAttack(bads[0]);
                            creep.rangedMassAttack();
                        } else {

                            creep.rangedAttack(bads[0]);
                        }
                        creep.say('pewpew', true);
                    }
                }
            }
            break;

case "E16S63":
rangeAttack(creep,['58c8bbf2564efa2205d5ac4d']);


            break;

        default:
            bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4);
            bads = _.filter(bads,function(o){return o.owner.username != 'daboross'; });

            if (bads.length === 0) {} else {
                if (bads[0] !== undefined) {
                    if (creep.pos.inRangeTo(bads[0], 3)) {
                        creep.rangedAttack(bads[0]);
                        creep.say('pewpew', true);
                    }
                }
            }
            break;

    }
    return false;
}

function getDefendFlag() {
    for (var a in Game.flags) {
        if (Game.flags[a].color == COLOR_RED) {
            return Game.flags[a];
        }
    }
    return false;
}
class rangerClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length) level = classLevels.length;
        return classLevels[level];
    }

    static run(creep) {
        if (creep.memory.level == 1)
            if (super.boosted(creep, ['XZHO2', 'XGHO2', 'XKHO2'])) {
                return;
            }
        if (super.returnEnergy(creep)) {
            return;
        }

        if (creep.pos.isNearTo(Game.flags.kill)) {
            creep.memory.waypoint = false;
        }

        creep.say('ranger');
        //      creep.heal(creep);
        //var defendFlag = movement.
        //      var enemy = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
        //      if(enemy.length > 0) {
        //      } 
        doAttack(creep);
        //else   { 
        movement.flagMovement(creep);
        //          }
    }


}
module.exports = rangerClass;
