//Back line
// Designed to do damage to all.
// every x = 50x5
var classLevels = [
    [MOVE, WORK], // 300

    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK],
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
    if(creep.room.name !== Game.flags[creep.memory.party].pos.roomName) return;
    let target;
    var E18S64targets;
    switch (creep.room.name) {
        case "E12S43":
            E18S64targets = ['599ae1f89bc4694f39c98f01'];
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

        default:
/*            if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].memory.wallTarget !== undefined) {
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
            } else { */
                bads = creep.pos.findInRange(FIND_STRUCTURES, 1);
    //            bads = _.filter(bads, function(o) {
  //                  return !_.contains(fox.friends, o.owner.username);
//                });
                if (bads.length > 0) {
                    creep.dismantle(bads[0]);
                                  return true;
                }
                if(creep.room.controller !== undefined && creep.room.controller.owner !== undefined&& creep.room.controller.owner.username !== 'likeafox'){
                    bads = creep.pos.findInRange(FIND_STRUCTURES, 1);
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
        if (creep.memory.level > 2) {
            if (super.boosted(creep, [ 'XGHO2', 'XZH2O','XZHO2'])) {
                return;
            }
        }

        var killBase = ['E28S45'];

        if (Game.flags[creep.memory.party] !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName && _.contains(killBase,creep.room.name)) {
            let zz = Game.getObjectById('599c4116f4cc3c5f26a258a7');
            if(zz === null) {
                creep.say('kill');
                creep.killBase();
                return;
            } else {
                if(creep.pos.isNearTo(zz)) {
                   creep.dismantle(zz); 
                } else {
                    creep.moveTo(zz);
                }
            }
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
