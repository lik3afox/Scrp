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
        body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: [],
    },

    /*  {
        body: [ MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['LO', 'KO'],
    },
*/
    // Level 6
    { // low harass change. - Double value + little bit of reduction
        body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['GO', 'LO', 'KO'],
    },
    // Level 7
    { // Triple Value + tough
        body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['GHO2', 'LHO2', 'KHO2'],
    },
    // Level 8
    { // Quad Value
        body: [TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL],
        boost: ['XGHO2', 'XZHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 9

    { // Designed to work alone and assist in power banks, does back 288 damage and heals. This is what I will be using mostly.
        //        3t/24ra/6h/17
        body: [TOUGH, TOUGH, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE,
        ],
        boost: ['XZHO2', 'XGHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK,
            HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL,
        ],
        boost: ['XZHO2', 'XGHO2', 'XKHO2', 'XLHO2'],
    },
    // Level 11
    { // Designed to need a 2nd healer at 25/25
        body: [TOUGH, TOUGH, TOUGH,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        ],
        boost: ['ZHO2', 'XGHO2', 'XKHO2', ],
    },
    // Level 12
    {
        body: [],
        boost: [],
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

function powerAction(creep) {
    var power = require('build.power');
    /*
    let bads = creep.room.notAllies;
    if(bads.length > 0){
        creep.smartRangedAttack();
        creep.selfHeal();
        break;
    } */
    if (creep.partyFlag && creep.partyFlag.memory.harassers && creep.partyFlag.memory.ready === undefined) {
        creep.partyFlag.memory.ready = false;
    }
    if (Game.flags[creep.memory.party] !== undefined) {
        if (creep.room.name == Game.flags[creep.memory.party].pos.roomName) {


            if (creep.partyFlag.memory.harassers) {
                creep.partyFlag.memory.ready = true;
                attackCreep(creep, creep.room.notAllies);
                creep.say('GO');
                return true;
            }



            if (creep.memory.powerBankID === undefined) {
                creep.memory.powerBankID = creep.partyFlag.memory.powerBankID;
            }
            let pBank = Game.getObjectById(creep.memory.powerBankID);
            if (pBank === null) {
                creep.memory.death = true;
                return false;
            }
            creep.selfHeal();
            if (creep.pos.inRangeTo(pBank, 3) && creep.hits === creep.hitsMax) {
                creep.countStop();
                creep.rangedAttack(pBank);
                return true;
            } else {
                creep.moveMe(pBank, { reusePath: 100, ignoreCreeps: true });
                return true;
            }
        } else {
            creep.tuskenTo(creep.partyFlag, { reusePath: 60, ignoreCreeps: true });
            return true;
        }
    } else {
        creep.memory.death = true;
    }
    return creep.memory.powerParty;

}


function getHostiles(creep) {
    if(creep.room.name === 'E13S17'){
        return _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function(o) {
                return _.contains(['admon', 'Geir1983'], o.owner.username);
            });
    }
    let bads = creep.room.notAllies;

    if (!creep.atFlagRoom) {
        bads = creep.pos.findInRange(bads, 5);
    }
    var players = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username) && o.owner.username != 'Invader' && o.owner.username != 'Source Keeper'; // && !o.isAtEdge && !o.pos.lookForStructure(STRUCTURE_RAMPART);
    });
    var sk = _.filter(bads, function(o) {
        return (o.owner.username == 'Invader' || o.owner.username == 'Source Keeper') && creep.pos.inRangeTo(o, 3);
    });
    if (sk.length > 0) return sk;
    if (players.length > 0) {
        return players;
    } else {
        return _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.owner.username != 'Invader' && o.owner.username != 'Source Keeper';
        });
    }

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
    if (bads.length === 0) return;
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    if (creep.partyFlag.memory.killRoads === true && distance > 3) {
        creep.killRoads();
    } else {
        creep.smartRangedAttack();
    }
    if (enemy.getActiveBodyparts(RANGED_ATTACK) > 0 && enemy.getActiveBodyparts(ATTACK) === 0) { //
        //creep.say('CHRG');
        creep.chaseTo(enemy, { maxRooms: 1, reusePath: 10 });

    } else if (creep.hits < creep.hitsMax - 200 && enemy.getActiveBodyparts(MOVE) > 0 && distance < 3) {
        creep.moveToEdge();
    } else if (distance == 3 && (enemy.getActiveBodyparts(ATTACK) > 0)) {

    } else if ((distance > 2 || enemy.getActiveBodyparts(RANGED_ATTACK) > 0) && enemy.getActiveBodyparts(ATTACK) === 0) {
        creep.chaseTo(enemy, { maxRooms: 1, reusePath: 10 });
    } else if (distance < 3 && (enemy.getActiveBodyparts(RANGED_ATTACK) > 0 || enemy.getActiveBodyparts(ATTACK) > 0)) {
        creep.moveToEdge();
    } else {
        /*if(distance > 5){
            if(creep.memory.waitMoveTimer){
                //creep.memory.targetPos = new RoomPosition(enemy.pos.x, enemy.pos.y, enemy.pos.roomName);
                creep.memory.waitMoveTimer--;
                if(creep.memory.waitMoveTimer <= 0){
                    creep.memory.targetPos= new RoomPosition(enemy.pos.x, enemy.pos.y, enemy.pos.roomName);
                    creep.memory.waitMoveTimer = 5;
                }
                creep.moveMe(creep.memory.targetPos, { maxRooms: 1, reusePath: 5 });    
            } else {
                creep.memory.targetPos = new RoomPosition(enemy.pos.x, enemy.pos.y, enemy.pos.roomName);
                creep.memory.waitMoveTimer = 5;
                creep.moveMe(creep.memory.targetPos, { maxRooms: 1, reusePath: 5 });    
            }
        } else { */
            creep.chaseTo(enemy, { maxRooms: 1, reusePath: 5 });
        //}

    }
}

function moveCreep(creep) {
    if (creep.memory.targetMoveID === undefined) {
        if (creep.memory.waitTimerSites === undefined || creep.memory.waitTimerSites  < 0) {
            var site = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
            site = _.filter(site, function(o) {
                return !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.progress > 0;
            });
            if (site.length > 0) {
                creep.memory.targetMoveID = site[0].id;
            } else {
                creep.memory.waitTimerSites = 100;
            }
        } else {
            if(creep.memory.waitTimerSites)
            creep.memory.waitTimerSites--;
            creep.tuskenTo(creep.partyFlag, creep.memory.home, { ignoreCreep: true, reusePath: 50 });
        }
    } else {
        let tgt = Game.getObjectById(creep.memory.targetMoveID);
        if (tgt) {
            creep.moveMe(tgt, { reusePath: 50 });
        } else {
            creep.memory.targetMoveID = undefined;
        }
    }
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
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if (super.goToPortal(creep)) return;
        if (super.rallyFirst(creep)) return;

        if (super.isPowerParty(creep) && powerAction(creep)) {
            return;
        }
        if (creep.partyFlag.memory.killRoads === undefined) {
            creep.partyFlag.memory.killRoads = false;
        }
        if (creep.partyFlag.memory.harassOpts === undefined) {
            creep.partyFlag.memory.harassOpts = {
                clearBase: false,
                leaveRoom: false,
            };
        }


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
            if (creep.partyFlag.memory.harassOpts.leaveRoom === true) {
                if (creep.partyFlag.memory.noBadsCount === undefined) {
                    creep.partyFlag.memory.noBadsCount = 0;
                } else {
                    if (creep.room.name === creep.partyFlag.pos.roomName && creep.partyFlag.memory.noBadsCount < 210) {
                        creep.partyFlag.memory.noBadsCount++;
                    } else if (creep.partyFlag.memory.noBadsCount > -10) {
                        creep.partyFlag.memory.noBadsCount--;
                    }
                }

                if (!creep.memory.leave && creep.partyFlag.memory.noBadsCount >= 200) {
                    creep.partyFlag.memory.noBadsCount += 100;
                    creep.memory.leave = true;
                }
                if (creep.memory.leave === true) {
                    if (creep.partyFlag.memory.noBadsCount <= 0) {
                        creep.memory.leave = undefined;
                    }

                    creep.evacuateRoom(creep.partyFlag.pos.roomName);
                    return;
                }
            }

            if (creep.partyFlag.memory.harassOpts.clearBase === true && creep.room.name === creep.partyFlag.pos.roomName) {
                if (creep.memory.targetID === undefined || Game.time % 128 === 0) {
                    creep.memory.targetID = creep.getClearBaseTarget();
                }
                let tgt = Game.getObjectById(creep.memory.targetID);
                if (tgt) {
                    if(tgt.progress){
                        creep.moveMe(tgt, { reusePath: 50 }); 
                    } else if (creep.pos.inRangeTo(tgt, 3)) {
                        creep.rangedAttack(tgt);
                    } else {
                        creep.moveMe(tgt, { reusePath: 50 });
                    }
                    creep.say('G2');
                } else {
                        //moveCreep(creep);
                    creep.memory.targetID = undefined;
                }
                return;
            }


            if (creep.pos.isNearTo(creep.partyFlag)) {
                creep.memory.stuckCount--;
            }
            moveCreep(creep);
            if (creep.partyFlag !== undefined) {
                if (creep.room.name === 'E47S59') {
                    if (creep.pos.isEqualTo(creep.partyFlag)) {
                        creep.rangedMassAttack();
                    }
                } else
                if (creep.pos.roomName === creep.partyFlag.pos.roomName) {
                    if (creep.partyFlag.memory.killRoads === true) {
                        if (!creep.killRoads()) {
                            creep.smartRangedAttack();
                        }

                    } else {
                        creep.smartRangedAttack();
                    }
                }
            }

        }

        if (Game.flags[creep.memory.party] !== undefined && Game.flags[creep.memory.party].memory.prohibitDirection === undefined) {
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