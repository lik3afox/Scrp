//Back line
// Designed to do damage to all.

var classLevels = [
    [MOVE],
    [MOVE],
    [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE, MOVE, MOVE, WORK, ATTACK, CARRY, HEAL, RANGED_ATTACK],
    [MOVE],
    [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    [MOVE],
    // 7
    {
        body: [MOVE, MOVE, MOVE, WORK, ATTACK, CARRY, HEAL, RANGED_ATTACK],
        boost: ['ZO','LO','UH'],
    }
];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:

function moveToRandomExit(creep, options) {
    var Exits = [FIND_EXIT_TOP,
        FIND_EXIT_RIGHT,
        FIND_EXIT_BOTTOM,
        FIND_EXIT_LEFT
    ];


    if (options === undefined) options = {};
    if (creep.memory.targetPos !== undefined && creep.memory.targetPos !== null && creep.room.name !== creep.memory.targetPos.roomName) {
        creep.memory.targetPos = undefined;
    }
    //    if() creep.memory.targetPos = undefined;
    var exited;
    if (creep.memory.targetPos === undefined || creep.memory.targetPos === null) {
        let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(creep.room.name);

        /*        if (match[2] <= 10 || creep.pos.x === 0) {
                    Exits = [FIND_EXIT_TOP,
                        FIND_EXIT_RIGHT,
                        FIND_EXIT_BOTTOM,

                    ];
                }
                if (match[2] >= 30 || creep.pos.x === 49) {
                    Exits = [FIND_EXIT_TOP,
                        FIND_EXIT_BOTTOM,
                        FIND_EXIT_LEFT
                    ];
                }
                if (match[4] <= 30 || creep.pos.y === 0) {
                    Exits = [
                        FIND_EXIT_RIGHT,
                        FIND_EXIT_BOTTOM,
                        FIND_EXIT_LEFT
                    ];
                }
                if (match[4] >= 50 || creep.pos.y === 49) {
                    Exits = [FIND_EXIT_TOP,
                        FIND_EXIT_RIGHT,

                        FIND_EXIT_LEFT
                    ];
                }*/


        var e = Math.floor(Math.random() * 4);
        var cont = 0;
        do {
            exited = creep.pos.findClosestByRange(Exits[e]);
            creep.memory.targetPos = exited;
            e = Math.floor(Math.random() * 4);

            if (cont > 10) return;
        } while (exited === null && cont < 10);
    } else {
        exited = creep.memory.targetPos;
    }
    if (exited !== undefined) {
        var ed = creep.moveMe(exited.x, exited.y, options);


    }



}

class scoutClass extends roleParent {
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
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }

    static run(creep) {
//        if( super.boosted(creep)){
  //          return;
    //    }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (creep.memory.level === 1) {
            // Sign controller, if the controller is signed, find a random exit and go to the next room.
            if (!super.moveToSignControl(creep)) {
                moveToRandomExit(creep, { reusePath: 50 });
            }
            if (Game.time % 20 === 0)
                console.log('Signer @ room', roomLink(creep.pos.roomName));
            return;
        }
        if (creep.memory.level === 1) {
            // Sign controller, if the controller is signed, find a random exit and go to the next room.
            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.memory.didThing = creep.room.name;
            }

            if (creep.memory.didThing === undefined || creep.memory.didThing !== creep.room.name) {
                if (!super.moveToSignControl(creep)) {
                    creep.memory.didThing = creep.room.name;
                }
            } else {
                moveToRandomExit(creep, { reusePath: 50 });
            }
            if (creep.pos.isNearTo(creep.room.controller)) {
                creep.reserveController(creep.room.controller);
            }
            if (Game.time % 20 === 0)
                console.log('Signer @ room', roomLink(creep.pos.roomName));
            return;
        }
//        creep.say('sc');
/*        if (!super.moveToSignControl(creep)) {
            //            if (!super.avoidArea(creep)) {
            //     movement.flagMovement(creep);
            creep.tuskenTo(creep.partyFlag, creep.memory.home, {
                ignoreCreeps: true,
                visualizePathStyle: {
                    stroke: '#fa0',
                    lineStyle: 'dotted',
                    strokeWidth: 0.1,
                    opacity: 0.5
                }
            });
            //              }
        }*/
if(!creep.partyFlag){
    creep.cleanMe();
    return;
}
        if (creep.pos.isEqualTo(creep.partyFlag)) {
//            creep.sleep(10);
            creep.cleanMe();
        } else{
            
            creep.crawlTo(creep.partyFlag);
//            creep.moveMe(creep.partyFlag,{reusePath:50});    
        }
    }
}

module.exports = scoutClass;