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
    // lv 0 - 1100 10 parts
    [MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, HEAL],
    // lv 1 - 2200 20 parts
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, HEAL, HEAL],
    // lv 2 - 3300 30 parts
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, HEAL, HEAL, HEAL],
    // lv 3 - 4400 40 parts
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, MOVE, HEAL, HEAL, HEAL, HEAL],
    // lv 4 - 5500 50 parts
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, RANGED_ATTACK, HEAL, MOVE, HEAL, HEAL, HEAL, HEAL]
];

var roleParent = require('role.parent');
var movement = require('commands.toMove');
var boost = [];

function getPartyFlag(creep) {
    for (var e in Game.flags) {
        if (Game.flags[e].name == creep.memory.party) {
            return Game.flags[e];
        }
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

    for (var e in keepers) {
        let keeperTarget = Game.getObjectById(keepers[e].id);
        //        let lair = Game.getObjectById(  creep.memory.keeperLair[creep.memory.goTo].id)
        //        console.log(keeperTarget,keepers[e].id,keeperTarget.ticksToSpawn,e,lowest,":",targetID);
        if (tempin !== null)
            if (tempin.pos.inRangeTo(keeperTarget, 10) && creep.room.name != "E26S76") {
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

    let others = creep.room.find(FIND_MY_CREEPS);
    others = _.filter(others, function(object) {
        return (object.memory.party == creep.memory.party);
    });
    if (others.length > 0) {
        for (var z in others) {
            others[z].memory.goTo = targetID;
        }
    }

    return targetID;
}


function getHostiles(creep) {
    let range = 10;
    if (creep.room.name == 'E24S75' || creep.room.name == 'E26S76') {
        range = 12;
    }
    if (creep.room.name == 'E26S74') {
        range = 10;
    }
    return creep.pos.findInRange(creep.room.hostilesHere(), range);

}

function attackCreep(creep, bads) {

    if (creep.memory.runAwayLimit === undefined) {
        creep.memory.runAwayLimit = creep.hitsMax * 0.33;
    }

    if (bads.length === 0) {
        creep.memory.needed = undefined;
        return true;
    }

    let enemy = creep.pos.findClosestByRange(bads);

    creep.selfHeal(creep);
    let distance = creep.pos.getRangeTo(enemy);
    if (bads.length == 2) {
        if (creep.pos.isNearTo(enemy)) {
            creep.rangedMassAttack();
        } else {
            creep.moveMe(enemy);
            creep.rangedAttack(enemy);
        }
    } else if (distance < 4) {

        var targets = creep.pos.findInRange(bads, 3);
        if (creep.hits < creep.memory.runAwayLimit) {
            creep.memory.getaway = true;
        }

        if (bads.length)
            if (creep.memory.getaway || distance < 3) {
                creep.runFrom(bads);
            }
        creep.rangedAttack(enemy);

    } else if (distance >= 4) {
        if (!creep.memory.getaway) {
            creep.moveMe(enemy, { maxRooms: 1 });
        }

    }

    if (creep.memory.getaway && creep.hits == creep.hitsMax) {
        creep.memory.getaway = false;
    }




}

function moveCreep(creep) {

    if (creep.memory.goTo === undefined) {
        creep.memory.goTo = analyzeSourceKeeper(creep);
    }
    if (creep.memory.keeperLair[creep.memory.goTo] !== undefined) {
        let gota = Game.getObjectById(creep.memory.keeperLair[creep.memory.goTo].id);
        let inRange = creep.pos.getRangeTo(gota);
        if (gota !== null && gota.ticksToSpawn > 220) {
            creep.memory.goTo = analyzeSourceKeeper(creep);
        } else if (inRange >= 5) {
            let rmPos = new RoomPosition(creep.memory.keeperLair[creep.memory.goTo].pos.x, creep.memory.keeperLair[creep.memory.goTo].pos.y, creep.memory.keeperLair[creep.memory.goTo].pos.roomName);
            creep.moveMe(rmPos, {
                reusePath: 7,
                ignoreRoads: true,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#Af0',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        }
    }



}


class roleGuard extends roleParent {


    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {

        if (super.returnEnergy(creep)) {
            return;
        }
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        super.rebirth(creep);

        if (super.boosted(creep, boost)) {
            return;
        }


        if (creep.memory.goalPos === undefined) {
            for (var e in Game.flags) {
                if (Game.flags[e].color == COLOR_BLUE && Game.flags[e].name == creep.memory.party) {
                    creep.memory.goalPos = Game.flags[e].pos;
                }
            }
        }

        if (creep.memory.keeperLair) {

            let bads = getHostiles(creep);

            if (bads.length > 0) {
                attackCreep(creep, bads);
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
                creep.memory.goTo = super
.analyzeSourceKeeper(creep);

            }
            if (!movement.moveToDefendFlag(creep)) {
                moveCreep(creep);
            }
        }

    }


}
module.exports = roleGuard;
