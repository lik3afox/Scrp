// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.420K
//[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE]
/*/
[RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE,
RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE,RANGED_ATTACK,MOVE, HEAL,MOVE],
*/
// only 1 level and 
// 800 Sets

var classLevels = [
    // Level 0
    [MOVE, RANGED_ATTACK, MOVE, HEAL],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
    // Level 4
    [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
    // Level 5
    {
        body: [
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE, 
            MOVE, MOVE, MOVE, MOVE, MOVE, 
            MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, 
            HEAL, HEAL,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['KO', 'LO'],
    },
    // Level 7
    {
        body: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['XKHO2', 'XLHO2'],
    },
    // Level 8
    {
        body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['XZHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 9

    {
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
        boost: ['XGHO2', 'XLH2O', 'KO'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['XZHO2', 'XGHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['XGHO2', 'XKHO2', 'XLHO2', 'XZHO2'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['XGHO2', 'XKHO2', 'XLHO2', 'XZHO2'],
    },
    // Level 13
    {
        body: [],
        boost: [],
    },

];
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var fox = require('foxGlobals');

function getHostiles(creep) {
    let bads = creep.room.notAllies;

    if (!creep.atFlagRoom) {
        bads = creep.pos.findInRange(bads, 5);
    }
    var players = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username) && o.owner.username != 'Invader' && o.owner.username != 'Source Keeper' && !o.isAtEdge && !o.pos.lookForStructure(STRUCTURE_RAMPART);
    });
    //&& creep.pos.inRangeTo(o, 10)
    var sk = _.filter(bads, function(o) {
        return (o.owner.username == 'Invader' || o.owner.username == 'Source Keeper') && creep.pos.inRangeTo(o, 3);
    });
    if (sk.length > 0) return sk;

    return players;
}

function killSK(creep, bads) {
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    if (creep.hits > 3000) {

        if (distance === 1) {
            creep.rangedMassAttack();
        } else if (distance < 4) {
            creep.rangedAttack(enemy);
        }
        if (distance >= 3) {
            creep.moveMe(enemy, { maxRooms: 1, reusePath: 10 });
        }
    } else {
        if (distance < 3) {
            creep.moveToEdge();
        }

    }

}

function attackCreep(creep, bads) {
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    creep.smartRangedAttack();

    if (enemy.getActiveBodyparts(RANGED_ATTACK) > 0 && enemy.getActiveBodyparts(ATTACK) === 0) { //
        creep.say('CHRG');

        creep.moveMe(enemy, { maxRooms: 1, reusePath: 10 });


    } else
    if (creep.hits < creep.hitsMax - 200 && enemy.getActiveBodyparts(MOVE) > 0 && distance < 3) {
        creep.moveToEdge();
    } else if (distance == 3 && (enemy.getActiveBodyparts(ATTACK) > 0)) {

    } else if ((distance > 2 || enemy.getActiveBodyparts(RANGED_ATTACK) > 0) && enemy.getActiveBodyparts(ATTACK) === 0) {
        //      if (creep.room.controller === undefined || creep.room.controller.owner === undefined || !_.contains(fox.enemies, creep.room.controller.owner.username)) {

        creep.moveMe(enemy, { maxRooms: 1, reusePath: 10 });
        //        }
    } else if (distance < 3 && (enemy.getActiveBodyparts(RANGED_ATTACK) > 0 || enemy.getActiveBodyparts(ATTACK) > 0)) {
        creep.moveToEdge();
    } else {
        //      if (creep.room.controller === undefined || creep.room.controller.owner === undefined || !_.contains(fox.enemies, creep.room.controller.owner.username)) {
        creep.moveMe(enemy, { maxRooms: 1, reusePath: 10 });
        //        }
        //        creep.killRoads();
    }
    //if( enemy.getActiveBodyparts(ATTACK) === 0 ) 
}

function moveCreep(creep) {
    var zz = require('role.parent');
    creep.tuskenTo(creep.partyFlag, creep.memory.home, { ignoreCreep: true, reusePath: 50 });
    //creep.moveMe(creep.partyFlag, { ignoreCreep: true, reusePath: 50 });
}


class roleRemoteGuard extends roleParent {


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


        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.goToPortal(creep)) return;
        if (super.rallyFirst(creep)) return;
        if (creep.hits < creep.hitsMax) {
            creep.selfHeal();
        } else {
            creep.smartHeal();
            var tgt = Game.getObjectById(creep.memory.reHealID);
            if (tgt !== null && tgt.hits === tgt.hitsMax) {
                creep.memory.reHealID = undefined;
            } else {
                creep.memory.reHealID = undefined;
            }
        }

        if (creep.partyFlag === undefined) {
            if (creep.memory.portal) {
                creep.suicide();
            }
            creep.memory.death = true;
        }

        let bads = getHostiles(creep);
        if (bads.length > 0) {



            attackCreep(creep, bads);

            creep.say('bds');

        } else if (bads.length > 0 && bads[0].owner.username == 'Source Keeper') {
            killSK(creep, bads);
        } else {

            moveCreep(creep);
            if (creep.partyFlag !== undefined) {
                if (creep.room.name === 'E47S59') {
                    if (creep.pos.isEqualTo(creep.partyFlag)) {
                        creep.rangedMassAttack();
                    }
                } else
                if (creep.pos.roomName === creep.partyFlag.pos.roomName) {
                    creep.smartRangedAttack();
                }
            }
        }

    }

}
module.exports = roleRemoteGuard;