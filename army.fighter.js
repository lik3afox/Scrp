// Front line - 
// Needs to be balanced between tough/attack/movement. 

var classLevels = [
    // Level 0
    [MOVE, ATTACK, MOVE, ATTACK],
    // Level 1 10/10
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Level 2 15/15
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Level 3 20/20
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
    // Level 4
    [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        ATTACK, ATTACK, ATTACK, ATTACK, HEAL,
    ],
    // Level 5
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ],
        //     boost: [],
    },
    // Level 6
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ],
        boost: ['UH'],
    },
    // Level 7
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
        ],
        boost: ['XUH2O'],
    },
    // Level 8
    {
        body: [ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XZHO2', 'XUH2O'],
    },
    // Level 9

    {
        body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
        boost: ['UH', 'XGHO2', 'XZHO2'],
    },
    // Level 10
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, ATTACK, TOUGH, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XUH2O', 'XGHO2', 'XZHO2'],
    },
    // Level 11
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, TOUGH, ATTACK,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XUH2O'],
    },
    // Level 12
    {
        body: [TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH,
            TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XZHO2', 'XUH2O'],
    },
    { // Level 13
        body: [TOUGH, TOUGH, TOUGH,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['UH2O', 'XGHO2', 'ZHO2'],
    },
    // Level 14
    {
        body: [TOUGH, TOUGH, TOUGH,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
            MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE
        ],
        boost: ['XGHO2', 'XUH2O'],
    },

];

var movement = require('commands.toMove');
var roleParent = require('role.parent');
//STRUCTURE_POWER_BANK:
function findNewParty(creep) {
    // first we will look at Game.falgs
    let pbFlags = _.filter(Game.flags, function(o) {
        return o.color == COLOR_YELLOW && o.secondaryColor == COLOR_RED;
    });
    var e = pbFlags.length;
    while (e--) {
        var a = pbFlags[e];
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

function doAttack(creep) {
    let target;
    var a;
    var bads;

    creep.say('de');
    target = Game.getObjectById(creep.partyFlag.memory.target);
    if (target !== null) {
        if (creep.pos.isNearTo(target)) {
            creep.attack(target);
        }
        return true;
    }

    bads = creep.pos.findInRange(creep.room.notAllies, 1);
    if (bads.length > 0) {
        creep.attack(bads[0]);
        return true;
    }


    bads = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
    bads = _.filter(bads, function(o) {
        return !_.contains(fox.friends, o.owner.username);
    });
    if (bads.length > 0) {
        creep.attack(bads[0]);
        return true;
    }

    if (creep.room.controller !== undefined && creep.room.controller.owner !== undefined && creep.room.controller.owner.username !== 'likeafox') {
        bads = creep.pos.findInRange(FIND_STRUCTURES, 1);
        if (bads.length > 0) {
            creep.attack(bads[0]);
        }
    }

    return false;
}

function killHarassers(creep) {
    let notAllies = creep.room.notAllies;
    let close;
    if (notAllies.length > 0) {
        close = creep.pos.findClosestByRange(creep.room.notAllies);
    } else {
        let otherThieves = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
            return o.carryCapacity > 0;
        });
        if(otherThieves.length > 0){
            close = creep.pos.findClosestByRange(otherThieves);
            creep.say('SORRY',true);
        } else {
            return;
        }
    }
    creep.moveMe(close);
    creep.smartAttack();
}

function powerAction(creep) {

    // So how this works is the attack Creep will look around in the room for any Screeps Caravan or players getting ready to attack.
    // If it finds Caravan - Maybe attack it.
    // If it find other players - and they get to close - like 5 distance.
    // Analyze Threat - if they are ranged or melee/boosted or not;
    // Call in reinforcements
    // Wait for reinforcments
    // Go attack
    // Finish Power bank.
    if (creep.partyFlag && creep.partyFlag.memory.harassers) {
        if (!creep.partyFlag.memory.ready) {
            // Evacuate room til reinforcements come. 
            //creep.evacuateRoom(creep.partyFlag.pos.roomName);
            // Problem with evacuateRoom is that isn't not the direction I want - I want it to run towards home soo...
            if (creep.room.name === creep.partyFlag.pos.roomName) {
                let home = Game.flags[creep.memory.home];
                creep.moveMe(home, { reusePath: 50 });
            } else {
                return creep.moveInside();
            }
            creep.say('NOT READY');
        } else {
            if (creep.room.name === creep.partyFlag.pos.roomName) {
                killHarassers(creep);
            } else {
                creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 60, ignoreCreeps: true });
            }
            creep.say('READY');
        }
        return true;
    }


    if (creep.partyFlag) creep.partyFlag.memory.tusken = false;
//    var power = require('build.power');
    if (creep.memory.partner === undefined && creep.memory.followerID) {
        creep.memory.partner = creep.memory.followerID;
    }
    if (creep.memory.partner) {
        let part = Game.getObjectById(creep.memory.partner);
        if (part === null) {
            creep.memory.death = true;
            creep.memory.party = 'unknown';
        }
    }
    if (creep.room.controller && creep.room.controller.level && creep.room.controller.level > 2 && creep.room.controller.owner && creep.room.controller.owner.username !== 'Solace') creep.smartAttack();
    if (Game.flags[creep.memory.party] !== undefined) {

        //        Game.flags[creep.memory.party].memory.rallyCreateCount = 10;

        if (creep.room.name == Game.flags[creep.memory.party].pos.roomName) {
            if (creep.memory.powerBankID === undefined) {
                creep.memory.powerBankID = creep.partyFlag.memory.powerBankID;
                /*let zz = creep.room.find(FIND_STRUCTURES);
                zz = _.filter(zz, function(o) {
                    return o.structureType == STRUCTURE_POWER_BANK;
                });
                if (zz.length > 0) {
                    creep.memory.powerbankID = zz[0].id;
                } else {
                    creep.memory.death = true;
                } */
            }

            let pBank = Game.getObjectById(creep.memory.powerBankID);
            if (pBank === null) {

                //                if (!power.findNewPowerParty(creep))
                creep.memory.death = true;
                return false;
            }
            if (creep.pos.isNearTo(pBank) && creep.hits === creep.hitsMax) {
                creep.countStop();
                creep.attack(pBank);
                return true;
            } else {
                creep.countDistance();
                creep.moveMe(pBank, { reusePath: 100, ignoreCreeps: true });
                return true;
            }


        } else {
            creep.countDistance();
            creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 60, ignoreCreeps: true });
            return true;
        }
    } else {
        //        if (!power.findNewPowerParty(creep))
        creep.memory.death = true;
    }
    //    }     
    return creep.memory.powerParty;

}

function banditAction(creep) {
    creep.memory.reportDeath = true;
    if (Game.flags[creep.memory.party] !== undefined) {

        if (Game.flags[creep.memory.party].room !== undefined && creep.room.name == Game.flags[creep.memory.party].pos.roomName) {


            var tombs = creep.room.find(FIND_TOMBSTONES);
            if (tombs.length > 0) {
                let cara = creep.room.npcs;
                if (cara.length === 0) {
                    creep.memory.death = true;
                }
            }
            let noHealerBads = _.filter(creep.room.npcs, function(o) {
                return o.owner.username === 'Screeps' && o.getActiveBodyparts(HEAL) < 8;
            });


            if (noHealerBads.length > 0) {
                let tgt = creep.pos.findClosestByRange(noHealerBads);
                if (creep.pos.isNearTo(tgt)) {
                    if (tgt.getActiveBodyparts(ATTACK) > 0 && creep.hits > 2000) {
                        creep.attack(tgt);
                    } else if (tgt.getActiveBodyparts(ATTACK) === 0) {
                        creep.attack(tgt);
                    }
                    if (tgt.fatigue === 0 && !creep.isNearEdge) creep.moveMe(tgt);

                } else {
                    creep.moveMe(tgt);
                }
                return true;
            }
            let healerBads = _.filter(creep.room.npcs, function(o) {
                return o.owner.username === 'Screeps' && o.getActiveBodyparts(HEAL) > 8;
            });
            if (healerBads.length > 0) {
                let tgt = creep.pos.findClosestByRange(healerBads);
                if (creep.pos.isNearTo(tgt)) {
                    creep.attack(tgt);
                    if (tgt.fatigue === 0) creep.moveMe(tgt);
                } else {
                    creep.moveMe(tgt, { maxRooms: 1 });
                }
                return true;
            }

        }
        movement.flagMovement(creep);
    }
    if (creep.partyFlag === undefined) creep.memory.death = true;
}


function doRebuild(creep) {
    roleParent.rebirth(creep);
    if (creep.room.name !== creep.partyFlag.pos.roomName) {
        creep.countDistance();
        creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50 });
        return;
    }
    if (creep.partyFlag === undefined) {
        creep.suicide();
        return;
    }
    let Claims = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function(o) {
        return o.getActiveBodyparts(RANGED_ATTACK);
    });
    if (Claims.length > 0) {
        creep.moveTo(Claims[0]);
        creep.attack(Claims[0], { maxRooms: 1 });
        return;
    }
    Claims = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function(o) {
        return o.getActiveBodyparts(CLAIM);
    });
    if (Claims.length > 0) {
        creep.moveTo(Claims[0]);
        creep.attack(Claims[0], { maxRooms: 1 });
        return;
    } else {
        if (!creep.room.controller.reservation || creep.room.controller.reservation.ticksToEnd < (100 + creep.memory.distance)) {

            require('commands.toParty').addRole(creep.partyFlag, 'engineer', 1, 5);
            Claims = creep.room.find(FIND_HOSTILE_CREEPS);
            Claims = _.filter(creep.room.find(FIND_HOSTILE_CREEPS), function(o) {
                return o.hitsMax === 1100;
            });
            if (Claims.length > 0) {
                creep.moveTo(Claims[0], { maxRooms: 1 });
                creep.attack(Claims[0]);
            } else if (!creep.room.controller.reservation) {
                let spots = creep.partyFlag.memory.spots;
                for (let i in spots) {
                    creep.room.createConstructionSite(spots[i].x, spots[i].y, STRUCTURE_CONTAINER);
                }
                creep.moveMe(creep.partyFlag, { reusePath: 50 });
            }

            var test2 = _.filter(creep.room.find(FIND_STRUCTURES), function(o) {
                return o.structureType === STRUCTURE_CONTAINER;
            }); // This is something is not on a rampart
            if (creep.partyFlag.memory.spots && test2.length === creep.partyFlag.memory.spots.length) {
                creep.partyFlag.memory.remove = true;
            }
        } else if (!creep.pos.isNearTo(creep.partyFlag)) {
            creep.moveMe(creep.partyFlag, { reusePath: 50 });
        }
    }
    if (creep.room.name === creep.partyFlag.pos.roomName && creep.partyFlag.memory.spots === undefined) {
        var sources = creep.room.find(FIND_SOURCES);
        var crps = creep.room.find(FIND_DROPPED_RESOURCES);
        let spots = _.filter(crps, function(o) {
            for (let i in sources) {
                if (sources[i].pos.isNearTo(o)) {
                    return true;
                }
            }
        });
        if (spots.length > 0) {
            creep.partyFlag.memory.spots = [];
            for (let i in spots) {
                creep.partyFlag.memory.spots.push(spots[i].pos);
            }
        }
    }
    if (creep.room.controller && creep.room.controller.reservation)
        creep.say(creep.room.controller.reservation.ticksToEnd);
}

var fox = require('foxGlobals');

class fighterClass extends roleParent {
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

        if (super.rallyFirst(creep)) return;
        /*
        if (creep.ticksToLive > 1400 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }*/
        if (creep.partyFlag && creep.partyFlag.memory.musterType === 'Issacar') {
            creep.memory.mustertype = creep.partyFlag.memory.musterType;
            doRebuild(creep);
            return;
        } else if (creep.memory.mustertype === 'Issacar' && !creep.partyFlag) {
            creep.memory.death = true;
        }

        if (creep.memory.boostNeeded && creep.memory.boostNeeded.length === 0 && super.rallyFirst(creep)) {
            if (creep.room.name !== creep.memory.home) {
                let pbFlags = _.filter(creep.room.find(FIND_MY_CREEPS), function(o) {
                    return o.memory.role === 'healer';
                });
                if (pbFlags.length > 0) {
                    creep.memory.partied = true;
                    creep.memory.powerParty = true;
                    creep.memory.followerID = pbFlags[0].id;
                }
            }

            return;
        }
        if (super.isPowerParty(creep) && powerAction(creep)) {
            return;
        }
        if (creep.partyFlag && creep.partyFlag.memory.bandit) {
            creep.say('bandit');
            banditAction(creep);

            return;
        }

        var enemy;

        if (super.goToPortal(creep)) return;
        if(creep.partyFlag && creep.partyFlag.memory.Issacar && creep.pos.roomName === creep.partyFlag.pos.roomName){
        	let consted = creep.room.find(FIND_STRUCTURES);
        	let bads ;
        		consted = _.filter(consted,function(o){
        			return o.structureType === STRUCTURE_CONTAINER;
        		});

        	if(consted.length > 0){
                   if(creep.pos.isNearTo(consted[0])){
                    bads = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                    if(bads.pos.isNearTo(creep)){
                                        creep.attack(bads);
                    } else {
                                        creep.attack(consted[0]);
                    }

                   } 
                   	creep.moveMe(consted[0],{maxRooms:1});
                   	return;
        	} else {
				bads = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

        	}
                   
                   if(creep.pos.isNearTo(bads)){
                   	creep.attack(bads);
                   } 
                   	creep.moveMe(bads,{maxRooms:1});
                   
                   return;
        }
        if (creep.room.name === creep.partyFlag.pos.roomName) {
            
            if (creep.memory.targetID === undefined || Game.time % 128 === 0) {
                let bads = creep.room.notAllies;
                if(bads.length > 0){
                    creep.memory.targetID = bads[0].id;
                } else {
                    let tempTar = creep.room.getClearBaseTarget();
                    if(tempTar){
                        creep.memory.targetID = tempTar.id;    
                    }
                }
                
                if (creep.memory.targetID === false) {
                    require('commands.toParty').changeRoleCount(creep.partyFlag,creep.memory.role,0);
                    creep.memory.death = true;
                }
            }
            let tgt = Game.getObjectById(creep.memory.targetID);
            if (tgt) {
                if (creep.pos.isNearTo(tgt)) {
                    creep.attack(tgt);
                } else {
                    creep.moveMe(tgt, { reusePath: 50,maxRooms:1 });
                    creep.smartAttack();
                }
                creep.say('AG2');
            } else {
                creep.memory.targetID = undefined;
            }
            return;
        }

        if (!creep.smartAttack()) {
            if (creep.hits < creep.hitsMax) creep.selfHeal();
        }
        creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50 });
    }
}

module.exports = fighterClass;