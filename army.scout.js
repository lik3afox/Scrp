//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE],
    [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
    [MOVE, MOVE, MOVE, WORK, ATTACK, CARRY, HEAL,RANGED_ATTACK],
    [MOVE],
    [MOVE,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY],
    [MOVE]
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
class scoutClass extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if( _.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level]) ) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
    //    if (super.doTask(creep)) {
  //          return;
//        }
        if (super.spawnRecycle(creep)) {
            return;
        }        

//        if (creep.room.name == 'E35S75') creep.suicide();
  //      creep.memory.waypoint = true;

    //    if (creep.memory.customPoint === undefined) {
      //      creep.memory.customPoint = false;
//        }
/*
        if (creep.ticksToLive > 1495 &&  creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {

creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);

        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        if (creep.hits !== creep.hitsMax) {
            creep.selfHeal();
            if (super.edgeRun(creep)) {
                return;
            }
        } */

//        console.log('scout reporting in', creep.pos,Game.shard.name);
//        if (super.goToPortal(creep)) return;
        creep.say('sc');
//            if (!super.moveToSignControl(creep)) {
    //            if (!super.avoidArea(creep)) {
               //     movement.flagMovement(creep);
               creep.tuskenTo(creep.partyFlag,creep.memory.home,{ignoreCreeps:true,visualizePathStyle: {
                        stroke: '#fa0',
                        lineStyle: 'dotted',
                        strokeWidth: 0.1,
                        opacity: 0.5
                    }});
  //              }
  //          }
  if(creep.pos.isEqualTo(creep.partyFlag)){
    creep.sleep(10);
    creep.cleanMe();
  }
//  if(Game.shard.name === 'shard1')
  
//        creep.sing(zz, true);

    }
}

module.exports = scoutClass;
