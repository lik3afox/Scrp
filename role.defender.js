// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK], // 300

    [MOVE, MOVE, TOUGH, TOUGH, RANGED_ATTACK, TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK], // 550

    [MOVE, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK, MOVE, MOVE, TOUGH, TOUGH,
        RANGED_ATTACK, TOUGH, TOUGH, TOUGH, MOVE, MOVE, RANGED_ATTACK
    ], // 550

    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, RANGED_ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
    ],

    [TOUGH, TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE,
        MOVE, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, RANGED_ATTACK, MOVE, MOVE, MOVE,
        RANGED_ATTACK, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
    ],

    [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK
    ],

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],

    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        HEAL, HEAL, HEAL, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
        RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL
    ]


];

function attackCreep(creep, bads) {
    //      creep.say('attk');
    //      let bads = creep.pos.findInRange(FIND_HOSTILE_CREEPS,4);
    //    let bads = creep.pos.findClosestByRange(bads);
    if (bads.length === 0) return true;
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);

    if (creep.pos.isNearTo(enemy)) {
        creep.say('attk' + creep.attack(enemy));
        creep.attack(enemy);
        creep.rangedAttack(enemy);

    } else if (distance < 4) {

        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);

        // Ranged attack.
        if (targets.length > 2) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
        // Heal
        creep.heal(creep);
        // Move
        creep.moveTo(enemy, { maxRooms: 1 });
    } else if (distance >= 4) {
        creep.heal(creep);
        creep.moveTo(enemy, { maxRooms: 1 });
    }
}

function getHostiles(creep) {
    //    flag.isAreaSafe(creep,4) // looking for bad hostiles.
    //    flag.getBadInArea(creep,4)
    //    flag.getClosestBad(creep);
    for (var e in Game.flags) {
        if (creep.room.name == Game.flags[e].pos.roomName && Game.flags[e].color == COLOR_BLUE) {
            return creep.pos.findInRange(FIND_HOSTILE_CREEPS, 4, {
                filter: object => (object.owner.username != 'zolox')
            });
        }
    }
    return creep.room.find(FIND_HOSTILE_CREEPS);
}

function specialrun(creep) {

    creep.memory.grouped = true;
    var totalFlag = movement.totalFlag();
    constr.pickUpNonEnergy(creep);
    if (creep.memory.goal === undefined) {
        movement.getRandomGoal(creep);
    }
    var badzs = getHostiles(creep);
    if (badzs.length > 0) {
        attackCreep(creep, badzs);
    } else {
        if (creep.hits < creep.hitsMax) creep.heal(creep);

        if (_.sum(creep.carry) > 0 && creep.room.terminal !== undefined) {
            // go home and deposit.
            if (creep.room.terminal !== undefined) {
                container.moveToTerminal(creep);
            } else {
                creep.moveTo(Game.getObjectById(creep.memory.parent));
            }
            creep.say('loot');
        } else if (!movement.moveToDefendFlag(creep)) {
            creep.heal(creep);
            movement.moveToFlag(creep);
        }
    }
}

var roleParent = require('role.parent');
var hostile = require('commands.toAttack');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');
var container = require('commands.toContainer');
class roleAttacker extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        //            creep.heal(creep);
        if (super.returnEnergy(creep)) {
            return;
        }
        if (creep.memory.level >= 6) {
            specialrun(creep);
            return;
        }

        //      console.log('enemies :' + enemies.length);
        creep.memory.grouped = true;
        var totalFlag = movement.totalFlag();

        constr.pickUpNonEnergy(creep);
        //if(constr.pickUpCloseNonEnergy(creep)) 
        if (creep.memory.goal === undefined) {
            movement.getRandomGoal(creep);
        }
        if (creep.room.find(FIND_HOSTILE_CREEPS).length > 0) {
            //            console.log("here???");
            if (Game.flags.retreat === undefined) {
                creep.room.createFlag(creep.pos.x, creep.pos.y, 'retreat', COLOR_BROWN, COLOR_BROWN);
            }
        }

        var targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 8, {
            filter: object => (object.owner.username != 'zolox')
        });
        var melee = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {
            filter: object => (object.owner.username != 'zolox')
        });
        // If no defense flag.
        if (targets.length > 0) {
            if (melee.length > 0) {
                creep.moveTo(Game.flags.retreat);
            } else {
                if (targets.length > 2) {
                    creep.rangedMassAttack();
                } else {
                    creep.rangedAttack(targets[0]);
                    creep.moveTo(targets[0]);
                }

                if (creep.hits < creep.hitsMax) creep.heal(creep);
            }
        } else {
            if (_.sum(creep.carry) > 0 && creep.room.terminal !== undefined) {
                // go home and deposit.
                if (creep.room.terminal !== undefined) {
                    container.moveToTerminal(creep);
                } else {
                    creep.moveTo(Game.getObjectById(creep.memory.parent));
                }
                creep.say('loot');
                return;
            }

            if (!movement.moveToDefendFlag(creep)) {
                movement.moveToFlag(creep);

                /*            if( creep.memory.roleID == 0 ) {
                                movement.moveToFlag(creep);
                                for(var e in Game.creeps){
                                    if(Game.creeps[e].memory.role == 'defender' && Game.creeps[e].memory.roleID != 0 ) {
                                        Game.creeps[e].memory.leader = creep.id; 
                                    }
                                }
                            } else {
                                creep.say('fol');
                                creep.moveTo(Game.getObjectById(creep.memory.leader));

                            } */
            }



        }


        if (targets.length > 0) {
            creep.rangedAttack(targets[0]);
        }
    }
}
module.exports = roleAttacker;
