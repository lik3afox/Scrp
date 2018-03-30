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
    [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL]
];

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
        body: [RANGED_ATTACK, RANGED_ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
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
    let bads = creep.room.find(FIND_HOSTILE_CREEPS);

    var players = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username) && o.owner.username != 'Invader' && o.owner.username != 'Source Keeper';
    });

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
            creep.moveTo(enemy, { maxRooms: 1, reusePath: 10 });
        }
    } else {
        if (distance < 3) {
            creep.moveToEdge();
        }

    }

}

function attackCreep(creep, bads) {
    /*    if(creep.room.name != Game.flags[creep.memory.party].pos.roomName) {
            bads = _.filter(bads,function(o) {
                return o.pos.inRangeTo(creep,5);
            });
        } */
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);

    creep.smartRangedAttack();

    if (creep.hits < creep.hitsMax - 200 && enemy.getActiveBodyparts(MOVE) > 0) {
        creep.moveToEdge();
    } else if (distance == 3) {

    } else if (distance > 2) { //
        if (creep.memory.leaderID !== undefined) {
            var led = Game.getObjectById(creep.memory.leaderID);
            if (led !== null) {
                if (creep.pos.isNearTo(led)) {
                    creep.moveTo(enemy, { maxRooms: 1, reusePath: 10 });
                } else {
                    creep.moveMe(led, { maxRooms: 1, reusePath: 10 });
                }
            }
        } else {
            creep.moveMe(enemy, { maxRooms: 1, reusePath: 10 });
        }
        //        }
    } else if (distance < 3) {
        creep.moveToEdge();
    }

}

function moveCreep(creep) {
    var zz = require('role.parent');
    creep.moveMe(creep.partyFlag, { ignoreCreep: true, reusePath: 50 });
}


class roleGuard extends roleParent {


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

        if (super.goToPortal(creep)) return;
        if (super.rallyFirst(creep)) return;

        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.doTask(creep)) {
            return;
        }
        creep.selfHeal();
        if (creep.partyFlag === undefined) {
            if (creep.memory.portal) {
                creep.suicide();
            }
            creep.memory.death = true;
        }
        let bads = getHostiles(creep);

        if (bads.length > 0 && bads[0].owner.username == 'Source Keeper') {
            killSK(creep, bads);
        } else if (bads.length > 0) {

            attackCreep(creep, bads);

        } else {
            if (creep.partyFlag !== undefined){
            if (creep.partyFlag.memory.killBase) {
                let zzzz = Game.getObjectById(creep.partyFlag.memory.target);
                if (zzzz.structureType === STRUCTURE_CONTAINER || zzzz.structureType === STRUCTURE_ROAD) {
                    creep.rangedAttack(zzzz);
                } else {
                    creep.rangedMassAttack();
                }
            } else  {
                let zzzz = Game.getObjectById(creep.partyFlag.memory.target);
                if (zzzz !== null) {
                    if (creep.pos.isNearTo(zzzz)) {
                        creep.rangedMassAttack();

                    } else {
                        creep.rangedAttack(zzzz);
                    }
                }
            }
            }
            moveCreep(creep);
            creep.memory.needed = undefined;
        }

        if (Game.flags[creep.memory.party].memory.prohibitDirection === undefined) {
            Game.flags[creep.memory.party].memory.prohibitDirection = {
                top: true,
                right: true,
                left: true,
                bottom: true,
            };
        }
    }

}
module.exports = roleGuard;