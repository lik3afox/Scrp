// Back line
// Designed for healing.
var classLevels = [
    // Level 0
    [MOVE, HEAL],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL],
    // Level 4
    [HEAL, HEAL, HEAL, HEAL, HEAL,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        HEAL, HEAL, HEAL, HEAL, HEAL,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        HEAL, HEAL, HEAL, HEAL, HEAL,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        HEAL, HEAL, HEAL, HEAL, HEAL,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        HEAL, HEAL, HEAL, HEAL, RANGED_ATTACK,
    ],
    // Level 5
    {
        body: [HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
        ],
        boost: [],
    },
    // Level 6
    {
        body: [HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
        ],
        boost: ['LO'],
    },
    // Level 7
    {
        body: [HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
        ],
        boost: ['XLHO2'],
    },
    // Level 8
    {
        body: [HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XLHO2'],
    },
    // Level 9
    {
        body: [HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, HEAL, HEAL,
        ],
        boost: ['LO'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XLHO2', 'XGHO2', 'XZHO2'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XLHO2'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XLHO2'],
    },
    // Level 13
    {
        body: [
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
            HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL, HEAL,
            ],
        boost: ['XLHO2', 'XKH2O', 'XZHO2'],
    },

];

var movement = require('commands.toMove');
var roleParent = require('role.parent');

function findNewParty(creep) {
    // first we will look at Game.falgs
    let pbFlags = _.filter(Game.flags, function(o) {
        return o.color == COLOR_YELLOW && o.secondaryColor == COLOR_RED;
    });
    for (var a in pbFlags) {
        let dis = Game.map.getRoomLinearDistance(creep.room.name, pbFlags[a].pos.roomName);
        if (dis <= 5 && pbFlags[a].name != creep.memory.party) {
            creep.memory.party = pbFlags[a].name;
            creep.memory.reportDeath = true;
            creep.memory.powerbankID = undefined;
            return true;
        }
    }
    return false;
}

function powerAction(creep) {

    if (Game.flags[creep.memory.party] !== undefined) {
        if (creep.isHome && creep.memory.followerID) {
            let zz = Game.getObjectById(creep.memory.followerID);
            if (zz && zz.memory.boostNeeded && zz.memory.boostNeeded.length > 0) {
                creep.say('waiting');
                return true;
            }

        }


        if (creep.memory.partner === undefined && creep.memory.leaderID) {
            creep.memory.partner = creep.memory.leaderID;
        }
        if (creep.memory.partner !== undefined) {
            let zz = Game.getObjectById(creep.memory.partner);

            if (zz === null) {
                creep.memory.death = true;
                creep.memory.party = 'unknown';
            } else {
                if (zz.hits !== zz.hitsMax) creep.heal(zz);
            }
        }

        if (Game.flags[creep.memory.party] && Game.flags[creep.memory.party].room !== undefined && creep.pos.inRangeTo(Game.flags[creep.memory.party], 5)) {

            if (creep.memory.powerBankID === undefined) {
                creep.memory.powerBankID = creep.partyFlag.memory.powerBankID;
            }

            let pBank = Game.getObjectById(creep.memory.powerBankID);
            if (pBank === null) {
                creep.memory.powerBankID = undefined;
                creep.memory.notThere = true;
                creep.memory.distance = 0;

                if (!creep.healOther(5)) {

                    creep.memory.death = true;
                }
                return true;
            }

            /*let 
            if (zz && pBank && !creep.pos.inRangeTo(pBank, 2) && !creep.pos.isNearTo(zz)) {
                creep.moveMe(pBank);
            } else*/
            if (pBank && !creep.pos.inRangeTo(pBank, 2)) {
                creep.moveMe(pBank);
            }
            if (creep.pos.inRangeTo(pBank, 4)) {
                creep.memory.notThere = true;
                if (creep.id == creep.memory.partner) {
                    creep.memory.partner = undefined;
                }
                if (creep.memory.leaderID !== undefined) {
                    let zz = Game.getObjectById(creep.memory.leaderID);
                    if (zz !== null) {
                        creep.heal(zz);
                        creep.say('HL');
                        creep.memory.HL = true;
                        creep.memory.leaderName = zz.name;
                        if (!creep.pos.isNearTo(zz) || (creep.partyFlag && creep.partyFlag.memory.harassers))
                            creep.moveTo(zz);
                    }
                } else {
                    creep.healOther(7);
                }
            }
        } else {
            if (creep.room.controller && creep.room.controller.level && creep.room.controller.level > 2) creep.healOther(7);
            creep.moveMe(creep.partyFlag, { reusePath: 50 });
        }

    } else {
        creep.memory.death = true;
    }

    return creep.memory.powerParty;
}

function banditAction(creep) {
    creep.memory.reportDeath = true;

    if (Game.flags[creep.memory.party] !== undefined) {
        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {

            good = creep.room.find(FIND_MY_CREEPS);
            good = _.filter(good, function(o) {
                return o.id !== creep.id && o.getActiveBodyparts(ATTACK) > 0;
            });
            if (good.length > 0) {
                var dmg = _.min(good, o => o.hits);
                //                creep.say(dmg + 'xxx');
                if (!creep.pos.isNearTo(dmg)) {
                    creep.moveTo(dmg);
                }
                creep.heal(dmg);
                return true;
            }

        }
        movement.flagMovement(creep);
    }
}


function returnClosestSpawn(roomName) {
    var distance = 100;
    var spawn;
    for (var e in Game.spawns) {
        if (Game.spawns[e].memory.alphaSpawn) {
            var tempDis = Game.map.getRoomLinearDistance(roomName, Game.spawns[e].room.name);
            if (tempDis < distance) {
                distance = tempDis;
                spawn = Game.spawns[e];
            }
        }
    }
    return spawn;
}

function powerCreepHeal(creep){
    let powerCrp = Game.powerCreeps[creep.memory.party];
    if(!powerCrp) return;
    if(creep.room.storage && creep.room.storage.my && creep.carryTotal === 0){
        creep.moveToWithdraw(creep.room.storage,'ops');
        return;
    }
    if(creep.pos.isNearTo(powerCrp)){
        creep.heal(powerCrp);
        creep.move(creep.pos.getDirectionTo(powerCrp));
        if(creep.carry.ops > 0){
            if(powerCrp.carry.ops < 500){
                creep.transfer(powerCrp,'ops');
            }
        }

    } else {
        creep.rangedHeal(powerCrp);
        creep.moveMe(powerCrp,{reusePath:50});
    }


}

function healParty(creep) {
    if (creep.memory.partyID === undefined || creep.memory.partyID.length === 0) return false;
    for (var a in creep.memory.partyID) {
        var needed = Game.getObjectById(creep.memory.partyID[a]);
        if (needed !== null)
            if (needed.hits < needed.hitsMax) {
                if (creep.pos.inRangeTo(needed, 3)) {
                    creep.heal(needed);
                    creep.memory.lastHealed = needed.id;
                } else {
                    creep.moveTo(needed);
                }
                return true;
            }
    }
    return false;
}
var doMove;
//STRUCTURE_POWER_BANK:
class healerClass extends roleParent {
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
        if (creep.memory.HL && (creep.partyFlag && !creep.partyFlag.memory.harassers)) {
            if (creep.hits < creep.hitsMax) {
                creep.selfHeal();
                return;
            }
            let tgt = Game.creeps[creep.memory.leaderName];

            if (tgt && creep.heal(tgt) === OK) {
                creep.say('HL');
                return;
            }
        } else {
            creep.memory.HL = undefined;
        }
        doMove = false;
        //        creep.memory.death = creep.partyFlag === undefined;
        if (creep.memory.death === true && creep.ticksToLive < 500 && creep.memory.level === 5) {
            creep.suicide();
            return;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }

        if (creep.ticksToLive > 1400 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }

        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }
        if(creep.partyFlag && creep.partyFlag.memory.powerCreepFlag){
            powerCreepHeal(creep);
            return;
        }
        /*
        if (super.isPowerParty(creep) && creep.partyFlag && creep.ticksToLive < 900 && creep.room.name !== creep.partyFlag.pos.roomName) {
            creep.say('WONT MAKE IT EVER');
            // Removet falg.
            creep.partyFlag.memory.remove = true;
            creep.partyFlag.memory.rallyCreateCount = 0;
//            creep.partyFlag.remove();
            return;
        } */

        if (super.rallyFirst(creep)) return;
        if (super.isPowerParty(creep)) {
            //            creep.memory.waypoint = true;
            if (powerAction(creep)) {
                if (creep.memory.followerID !== undefined && !creep.isHome) {
                    var tgt = Game.getObjectById(creep.memory.followerID);
                    if (tgt !== null && tgt.memory.leaderID !== undefined) {
                        tgt.memory.leaderID = undefined;
                        creep.memory.followerID = undefined;

                        creep.memory.leaderID = tgt.id;
                        tgt.memory.followerID = creep.id;
                        creep.say("><");
                        tgt.say(">?<");

                    }
                    /*    tgt.followerID = creep.id;
                        tgt.memory.leaderID = undefined;
                        creep.memory.leaderID = tgt.id;
                        creep.memory.followerID = undefined;
                        return;*/
                }

                return;

            }

        }
        if (creep.memory.party && creep.partyFlag.memory.bandit) {
            creep.say('bandit');
            banditAction(creep);
            return;
        }
        /*
                var hurtz = creep.pos.findInRange(FIND_MY_CREEPS, 7);

                hurtz = _.filter(hurtz, function(object) {
                    return object.hits < object.hitsMax && (object.owner.username == 'likeafox' || object.owner.username == 'Baj');
                });
                let dmg = _.min(hurtz, o => o.hits);
        */
        //return;
        creep.smartHeal();

        if (super.goToPortal(creep)) return;


        /*        if (creep.room.name == 'E11xS36') {
                    var site = creep.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                    site = _.filter(site, function(o) {
                        return !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.progressTotal - o.progress < 1000;
                    });
                    creep.say(site.length);
                    if (site.length > 0) {
                        var zzz = creep.pos.findClosestByRange(site);
                        creep.moveTo(zzz);
                    } else if (doMove) {
                        movement.flagMovement(creep);
                    }
                } else {*/
        //if (creep.partyFlag.tusken) {
        //creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50 });
        //} else {
        creep.moveMe(creep.partyFlag, { reusePath: 50 });
        //}

        //      }

    }
}

module.exports = healerClass;