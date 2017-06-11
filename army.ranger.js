// Back line
// Designed for shooting 

var classLevels = [
    [MOVE, RANGED_ATTACK],
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK]

];
var boost = [RESOURCE_LEMERGIUM_OXIDE, 'KO'];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var attack = require('commands.toAttack');
//STRUCTURE_POWER_BANK:

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
        creep.rangedMassAttack();
        //else   { 
        movement.flagMovement(creep);
        //          }
    }


}
module.exports = rangerClass;
