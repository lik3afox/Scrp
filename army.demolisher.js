//Back line
// Designed to do damage to all.
// every x = 50x5

var classLevels = [
    // Level 0
    [MOVE, WORK],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    // Level 4
    [WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK,
    ],
    // Level 5
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, HEAL,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: ['ZH'],
    },
    // Level 7
    {
        body: [WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            WORK, WORK, WORK, WORK, WORK,
        ],
        boost: ['XZH2O'],
    },
    // Level 8
    {
        body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XZH2O'],
    },
    // Level 9

    {
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
        boost: ['XGHO2', 'XZH2O', 'KO'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, WORK, TOUGH, TOUGH, TOUGH, WORK, TOUGH, TOUGH, WORK, TOUGH, WORK, WORK,
            WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XGHO2', 'XZH2O'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, WORK, TOUGH, TOUGH, TOUGH, WORK, TOUGH, TOUGH, WORK,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZH2O', 'XZHO2'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZH2O', 'XZHO2'],
    },
    // Level 13
    {
        body: [],
        boost: [],
    },

];
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var fox = require('foxGlobals');

function doAttack(creep) {
    //    if(creep.room.name !== Game.flags[creep.memory.party].pos.roomName) return;
    let target;
    var E18S64targets;
    switch (creep.room.name) {
        case "W55S33":
            E18S64targets = ['59f45823233302090ecbfade'];
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
            if (creep.room.controller !== undefined && creep.room.controller.owner !== undefined && creep.room.controller.owner.username !== 'likeafox') {
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
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static run(creep) {
        creep.memory.death = creep.partyFlag === undefined;
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }

        if (creep.ticksToLive > 1495 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        } else if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.rallyFirst(creep)) return;
        if (super.goToPortal(creep)) return;


        if (creep.partyFlag.memory.target !== undefined) {
            /*            let fTar = Game.getObjectById(creep.partyFlag.memory.target);
                        if (fTar !== null) {
                            if (creep.pos.isNearTo(fTar)) {
                                creep.dismantle(fTar);
                            }
                        }*/
            creep.smartDismantle();
            if (creep.room.name === creep.partyFlag.pos.roomName) {
                creep.moveMe(creep.partyFlag, { ignoreCreeps: true });
            } else {
                movement.flagMovement(creep);
            }
        } else if (!doAttack(creep)) {
            movement.flagMovement(creep);
        } else {
            movement.flagMovement(creep);
        }

        if (creep.room.name === creep.partyFlag.pos.roomName) {
            if (creep.memory._move !== undefined && creep.memory._move.path !== undefined && creep.memory._move.path === "") {
               var str = creep.room.find(FIND_STRUCTURES);
                console.log(str.length,"trying");
                if(str.length > 0){
	               var tgt = creep.pos.findClosestByRange(str);
                	creep.partyFlag.memory.target = tgt.id;
                }
            }
        }
        /*        var target = Game.getObjectById('588587458b65791f39f134c1');
                if (target !== null)
                    creep.dismantle(target); */

    }
}

module.exports = demolisherClass;