// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.140K

var classLevels = [ MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
    ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
    ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, HEAL, HEAL, HEAL,MOVE
];

var boost = [];
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var fox = require('foxGlobals');


function getHostiles(creep) {
    let range = 6;
    if ( creep.room.name == 'E16S34') range = 4;

    if (creep.room.name == 'E11S36') {
        range = 49;
    }
    var rng10 = ['E16S35', 'E25S26','E26S35'];
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

         */
    /*    let returned = creep.pos.findInRange(bads, range);

        returned = _.filter(returned, function(o) {
            return !_.contains(fox.friends, o.owner.username);
        }); */
    let tgt = Game.getObjectById(creep.memory.playerTargetId);
    //        console.log(tgt, 'tgt');
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

    //    return returned;

}

function attackCreep(creep, bads) {
    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }
    let enemy = creep.pos.findClosestByRange(bads);
    let distance = creep.pos.getRangeTo(enemy);
    creep.say('attk' + bads.length);

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
        if (bads.length <= 2) {
            creep.rangedAttack(enemy);
        } else {
            creep.rangedMassAttack();
        }
        creep.selfHeal();
        creep.moveTo(enemy, { ignoreRoads: true, maxRooms: 1 });
        if (bads.length > 2) {}

        return;
    } else if (distance >= 4) {
        creep.selfHeal();
        if (enemy.owner.username === 'Source Keeper') {
            if (creep.hits == creep.hitsMax) {
                creep.moveTo(enemy, { ignoreRoads: true, maxRooms: 1 });
            }
        } else {
            creep.moveTo(enemy, { ignoreRoads: true, maxRooms: 1 });
        }
    }
    if (bads.length > 2) {
        creep.rangedMassAttack();
    }
}

function analyzeSourceKeeper(creep) {
    var noMineral = ['E14S34', 'E16S34', 'E24S34', 'E25S44', 'E14S35'];

    let keepers = creep.memory.keeperLair;
    let targetID;
    let lowest = 300;

    var e = keepers.length;
    while (e--) {
        let keeperTarget;
        if (keepers[e] !== null)
            keeperTarget = Game.getObjectById(keepers[e].id);

        if (keeperTarget !== null&&keeperTarget !== undefined) {
            if (_.contains(noMineral, creep.room.name)) { // Will always kill mineral SK.
                if (keeperTarget.ticksToSpawn === undefined) {
                    targetID = e;
                    break;
                    //Winner
                } else if (keeperTarget.ticksToSpawn < lowest) {
                    lowest = keeperTarget.ticksToSpawn;
                    targetID = e;
                }
            } else {

                if (creep.memory.mineralRoomID === undefined) {
                    let tempinz = creep.room.find(FIND_MINERALS);
                    creep.memory.mineralRoomID = tempinz[0].id;
                }

                if (e == creep.memory.mineralRoomID) {
                    let tempin = Game.getObjectById(creep.memory.mineralRoomID);
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
                } else {
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
//        console.log('BLah', creep.pos, creep.memory.goTo);
        creep.memory.goTo = analyzeSourceKeeper(creep);
        return;
    }
    let gota = Game.getObjectById(creep.memory.keeperLair[creep.memory.goTo].id);
    if (gota !== null) {
        let inRange = creep.pos.getRangeTo(gota);
        if (inRange < 4 && gota.ticksToSpawn > 200) {
            creep.say('dif', true);
            creep.memory.goTo = analyzeSourceKeeper(creep);
            return;
        }

        if (!creep.pos.isNearTo(gota)) {
            if (creep.room.name == 'E15S34') {
                creep.moveMe(gota, {
                    reusePath: 7,
                    maxRooms: 1,
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
                creep.moveMe(gota, {
                    reusePath: 7,
                    visualizePathStyle: {
                        fill: 'transparent',
                        stroke: '#bf0',
                        lineStyle: 'dashed',
                        strokeWidth: 0.15,
                        opacity: 0.5
                    }
                });

            }

        } else {
            creep.say('zZzZz');
        }
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

        if (super.spawnRecycle(creep)) {
            return;
        }
        super.rebirth(creep);
        //        if (creep.memory.party == 'Flag13' || creep.memory.party == 'Flag15')
        if (creep.ticksToLive === 1499) {
            if (Memory.stats.totalMinerals.KO > 20000) {
                boost.push('KO');
            }
            if (Memory.stats.totalMinerals.LO > 20000) {
                boost.push('LO');
            }
            _.uniq(boost);
        }
        if (super.boosted(creep, boost)) {
            return;
        }

        if (creep.memory.goalPos === undefined && Game.flags[creep.memory.party] !== undefined) {

            creep.memory.goalPos = new RoomPosition(Game.flags[creep.memory.party].pos.x, Game.flags[creep.memory.party].pos.y, Game.flags[creep.memory.party].pos.roomName);
        }

        if (creep.room.name === 'E15S41') {
            creep.selfHeal();

            let bads = getHostiles(creep);
            creep.say(bads.length);

            if (bads.length > 0) {
                attackCreep(creep, bads);
            } else {
                creep.killBase();

            }
            return;
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
        } else if (creep.memory.goalPos !== undefined && creep.room.name != creep.memory.goalPos.roomName) {
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
                if (creep.room.name == 'E26S34') {
                    var ee = Game.getObjectById('5982ff86b097071b4adc2d2a');
                    var zz = Game.getObjectById('5982ff86b097071b4adc2d2c');

                    creep.memory.keeperLair.push(ee);
                    creep.memory.keeperLair.push(zz);
                }
                creep.memory.goTo = analyzeSourceKeeper(creep);
            }
            moveCreep(creep);
        }

    }


}
module.exports = roleGuard;