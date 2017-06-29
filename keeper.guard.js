// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.140K

var classLevels = [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
    ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL, MOVE, MOVE, MOVE
];

var boost = [RESOURCE_LEMERGIUM_OXIDE, 'KO'];
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var fox = require('foxGlobals');


function getHostiles(creep) {
    let range = 5;
    if (creep.room.name == 'E34S84' || creep.room.name == 'W4S94') range = 6;
    if (creep.room.name == 'E25S74' || creep.room.name == 'E35S74' || creep.room.name == 'E35S84') {
        range = 8;
    }
    var rng10 = ['E24S75', 'E26S76', 'E36S74', 'E24S74', 'E34S74'];
    if (_.contains(rng10, creep.room.name)) {
        range = 10;
    }
/*
    let bads = creep.room.find(FIND_HOSTILE_CREEPS );

    let player = _.filter(bads,function(o) {
        return !_.contains(fox.friends, o.owner.username)&& o.owner.username !== 'Invader'&& o.owner.username !== 'Source Keeper' ;
    } );
    if(player.length > 0){
        return player;
    }

    let returned = creep.pos.findInRange(bads, range);

    returned = _.filter(returned, function(o) {
        return !_.contains(fox.friends, o.owner.username) ;
    }); */
    let tgt = Game.getObjectById(creep.memory.playerTargetId);
    if (tgt === null) {
        creep.memory.playerTargetId = null;
        let bads = creep.room.find(FIND_HOSTILE_CREEPS);
        let player = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.owner.username !== 'Invader' && o.owner.username !== 'Source Keeper';
        });
        if (player.length > 0) {
            creep.memory.playerTargetId = player[0].id;
            return player;
        }
        return creep.pos.findInRange(bads, range);
    } else {
        return [tgt];
    }

    return returned;

}

function attackCreep(creep, bads) {
    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    creep.say('attk' + distance);

    if (creep.pos.isNearTo(enemy)) {
        creep.memory.walkingTo = undefined;
        if (enemy.owner.username != 'Source Keeper' || enemy.hits <= 100) {
            creep.attack(enemy);
            creep.rangedMassAttack();
        } else {
            if (creep.hits > 2600) {
                creep.attack(enemy);
            } else {
                creep.selfHeal();
            }
        }
    } else if (distance < 4) {

        //        var targets = creep.pos.findInRange(bads, 3);

        // Ranged attack.
        if (bads.length > 2) {
            creep.rangedMassAttack();
        } else {
            creep.rangedAttack(enemy);
        }
        creep.selfHeal();
        creep.moveTo(enemy, { ignoreRoads: true });
    } else if (distance >= 4) {
        creep.selfHeal();
        creep.moveTo(enemy, { ignoreRoads: true });
    }
}

function analyzeSourceKeeper(creep) {

    let keepers = creep.memory.keeperLair;
    let targetID;
    let lowest = 300;

    if (creep.memory.mineralRoomID === undefined) {
        let tempinz = creep.room.find(FIND_MINERALS);
        creep.memory.mineralRoomID = tempinz[0].id;
    }
    let tempin = Game.getObjectById(creep.memory.mineralRoomID);
    var e = keepers.length;
    while (e--) {
        let keeperTarget;
        if (keepers[e] !== null)
            keeperTarget = Game.getObjectById(keepers[e].id);
        //        let lair = Game.getObjectById(  creep.memory.keeperLair[creep.memory.goTo].id)
        //        console.log(keeperTarget,keepers[e].id,keeperTarget.ticksToSpawn,e,lowest,":",targetID);
        if (keeperTarget !== null && tempin !== null) {
            if (keepers[e] !== null && tempin.pos.inRangeTo(keeperTarget, 10) && creep.room.name != "E26S76" && creep.room.name != 'E24S75' &&
                creep.room.name != "E26S76" && creep.room.name != "E35S74" &&
                creep.room.name != "E25S76" && creep.room.name != "E36S75" && creep.room.name != "E34S76") {
                if (creep.room.name != "E35S84") {
                    if (tempin.mineralAmount !== 0) {
                        if (keeperTarget.ticksToSpawn === undefined) {
                            targetID = e;
                            break;
                            //Winner
                        } else if (keeperTarget.ticksToSpawn < lowest) {
                            lowest = keeperTarget.ticksToSpawn;
                            targetID = e;
                        }
                    }

                }
            } else {
                if (keeperTarget !== undefined) {
                    if (keeperTarget.ticksToSpawn === undefined) {
                        targetID = e;
                        break;
                        //Winner
                    } else if (keeperTarget.ticksToSpawn < lowest) {
                        lowest = keeperTarget.ticksToSpawn;
                        targetID = e;
                    }
                }

            }
        }


    }

    //let keeperTarget = Game.getObjectById(keepers[targetID].id);
    //    console.log ('winner of the anazlying is',targetID,creep.room.name,creep.name,keeperTarget.pos);
    return targetID;
}

function moveCreep(creep) {
    if (creep.memory.goTo === undefined) {
        creep.memory.goTo = analyzeSourceKeeper(creep);
    }
    if (creep.memory.keeperLair[creep.memory.goTo] === undefined) {
        //        creep.memory.goTo = undefined;
        return false;
    }
    let gota = Game.getObjectById(creep.memory.keeperLair[creep.memory.goTo].id);
    if (gota !== null) {
        let inRange = creep.pos.getRangeTo(gota);
        if (inRange < 4 && gota.ticksToSpawn > 200) {
            creep.say('dif', true);
            creep.memory.goTo = analyzeSourceKeeper(creep);
        }

        let rmPos = new RoomPosition(creep.memory.keeperLair[creep.memory.goTo].pos.x, creep.memory.keeperLair[creep.memory.goTo].pos.y, creep.memory.keeperLair[creep.memory.goTo].pos.roomName);
        if (!creep.pos.isNearTo(gota)) {
            creep.moveMe(rmPos, {
                reusePath: 7,
                ignoreRoads: (creep.room.name == 'W4S94'),
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#bf0',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        } else {
            creep.say('zZzZz');
        }
    } else {
        //        creep.say('zZzZz');
    }

}


class roleGuard extends roleParent {

    static levels(level) {
        return classLevels;
    }

    static run(creep) {
        if (creep.saying == 'zZzZz') {
            creep.say('zZzZ');
            return;
        }
        if (creep.saying == 'zZzZ') {
            creep.say('zZz');
            return;
        }

        if (super.doTask(creep)) {
            return;
        }

        if (super.returnEnergy(creep)) {
            return;
        }
        super.rebirth(creep);

        if (super.boosted(creep, boost)) {
            return;
        }

        if (creep.memory.goalPos === undefined && Game.flags[creep.memory.party] !== undefined) {

            creep.memory.goalPos = new RoomPosition(Game.flags[creep.memory.party].pos.x, Game.flags[creep.memory.party].pos.y, Game.flags[creep.memory.party].pos.roomName);
        }

        if (creep.memory.keeperLair) {

            let bads = getHostiles(creep);

            if (bads.length > 0) {
                if (creep.hits < 400) {
                    creep.say('bads');
                    creep.selfHeal();

                } else {
                    attackCreep(creep, bads);
                }


            } else {
                creep.selfHeal();
                if (!movement.moveToDefendFlag(creep)) {
                    moveCreep(creep);
                } else { // So if it has to move to a defend flag - it's seen an invader in the room.
                    if (creep.memory.goTo !== undefined)
                        creep.memory.goTo = undefined;
                }
            }
        } else if (creep.room.name != creep.memory.goalPos.roomName) {
            let bads = getHostiles(creep);
            if (bads.length > 0) {
                attackCreep(creep, bads);
                return;
            } else {
                creep.selfHeal();
                movement.guardFlagMove(creep);
            }
            if (creep.memory.distance === undefined) {
                creep.memory.distance = 0;
            }
            creep.memory.distance++;

        } else {
            if (creep.memory.keeperLair === undefined) {
                creep.memory.keeperLair = creep.room.find(FIND_STRUCTURES, { filter: { structureType: STRUCTURE_KEEPER_LAIR } });
                creep.memory.goTo = analyzeSourceKeeper(creep);
            }
            moveCreep(creep);
        }

    }


}
module.exports = roleGuard;
