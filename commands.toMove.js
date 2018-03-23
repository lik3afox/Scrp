// Here we will setup various ways to move to flags or room directions
// or other ways.
var FLAG = require('foxGlobals');

function getRetreatFlag(creep) {
    if(creep.homeFlag !== undefined){
        let zz = new RoomPosition(creep.homeFlag.pos.x, creep.homeFlag.pos.y, creep.homeFlag.pos.roomName);
        return zz;
    }
}

function moveToRallyFlag(creep) {
    let moveToPos = getFormationPos(creep.partyFlag, creep.memory.formationPos);
    if (moveToPos !== undefined) {
        if (creep.room.name == moveToPos.roomName) {
            if (!creep.pos.isEqualTo(moveToPos)) {
                creep.moveMe(moveToPos, { reusePath: 25 });
            }
        } else {
            if (!creep.pos.isEqualTo(moveToPos))
                creep.moveMe(moveToPos, { reusePath: 50 });
        }
        return true;
    }

    if (Game.flags[creep.memory.party] === undefined) return false;
    if (creep.room.name == Game.flags[creep.memory.party]) {
        creep.moveMe(Game.flags[creep.memory.party], { ignoreCreeps: true });
    } else {
        creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50 });
    }
    //        creep.moveMe(Game.flags[creep.memory.party],{ignoreRoads: true,reusePath:50});
    creep.say('rally');
    return true;

}
var redFlags;

class MoveInteract {

    static getRoomPos(creep) {
        let goalID = creep.memory.goal;
        var spawn = Game.getObjectById(creep.memory.parent);
        if (spawn !== null) {
            for (var e in spawn.memory.roadsTo) {
                if (spawn.memory.roadsTo[e] !== null && spawn.memory.roadsTo[e].source == goalID) {
                    if (spawn.memory.roadsTo[e].sourcePos !== undefined)
                        return new RoomPosition(spawn.memory.roadsTo[e].sourcePos.x,
                            spawn.memory.roadsTo[e].sourcePos.y,
                            spawn.memory.roadsTo[e].sourcePos.roomName);
                }
            }
        }
        return 0;
    }

    static flagMovement(creep) {
        if (!moveToRallyFlag(creep)) {

        }
    }

    static moveToDefendFlag(creep, bades) {
        var defendRooms = {
            E16S45: ['E16S45', 'E15S45', 'E16S44'],

        };

  //      if (redFlags === undefined) {
            redFlags = _.filter(Game.flags, function(f) {
                return f.color == COLOR_RED;
            });
//        }

        let flagz = redFlags;
        let targetFlag;

        for (var e in flagz) {

            var distance = Game.map.getRoomLinearDistance(flagz[e].pos.roomName, creep.room.name);
            let maxDistance = 4;
            targetFlag = flagz[e];

            if (creep.memory.role == 'homeDefender') {
                if (creep.room.name == 'E28S77' || creep.room.name == 'E35S73') {
                    maxDistance = 2;
                } else {
                    maxDistance = 1; //  if(distance > 2) return false;
                }
                //break;
            } else if (creep.memory.role == 'guard' || creep.memory.role == 'shooter') {
                maxDistance = 1; //if(distance > 1) return false;

                if (defendRooms[creep.room.name] !== undefined) {
                    if (_.contains(defendRooms[creep.room.name], flagz[e].pos.roomName) || _.contains(defendRooms[creep.room.name], creep.memory.home)) {
                        maxDistance = 1;
                    } else {
                        maxDistance = 0;
                    }
                }
            }
            if (distance <= maxDistance) {
                let zz = new RoomPosition(flagz[e].pos.x, flagz[e].pos.y, flagz[e].pos.roomName);
                let xx = creep.moveTo(zz, { reusePath: 40 });
                //console.log(xx,flagz[e].pos.x,flagz[e].pos.y,flagz[e].pos.roomName ,maxDistance);
                creep.say(maxDistance + '/D!' + flagz[e].pos.roomName);
                //        targetFlag;
                return true;
            }

        }
        return false;
    }

    static runAway(creep) {

        if (creep.memory.runAway === true) {
            if (creep.memory.role == 'miner') creep.dropEverything();
            if (creep.memory.runTarget === undefined) {
                creep.memory.runTarget = getRetreatFlag(creep);
                creep.moveTo(creep.memory.runTarget, { reusePath: 50 });
            } else {
                creep.say('🏃');
                let zz = new RoomPosition(creep.memory.runTarget.x, creep.memory.runTarget.y, creep.memory.runTarget.roomName);
                if (creep.moveTo(zz, { reusePath: 50 }) == OK) {
                    if (creep.pos.inRangeTo(zz, 3)) {
                        creep.sleep(4);
                    }
                }
            }
        }
        if (creep.memory.runAway !== undefined && Game.flags[creep.memory.runFrom] === undefined) {
            creep.memory.runAway = undefined;
            creep.memory.runFrom = undefined;
            return;
        }

        return creep.memory.runAway;
    }



    static checkForBadsPlaceFlag(creep) {
        if (creep.memory.runAway) return true;
        if (creep.memory.checkForBadScan === undefined) {
            creep.memory.checkForBadScan = Math.ceil(Math.random() * 7) + 3;
        }
        creep.memory.checkForBadScan--;
        if (creep.memory.checkForBadScan < 0) {
            creep.memory.checkForBadScan = Math.ceil(Math.random() * 9) + 3;

            var bads = creep.room.find(FIND_HOSTILE_CREEPS);
            /*            var player = _.filter(bads, function(o) {
                            return o.owner.username != 'Invader' && o.owner.username != "Source Keeper" && !_.contains(FLAG.friends, o.owner.username);
                        });

                        if (player.length > 0) {
                            var flagName = player[0].owner.username + player[0].pos.roomName;
                            if (Game.flags[flagName] === undefined) {
                                creep.room.createFlag(player[0].pos.x, player[0].pos.y, flagName, FLAG.DEFEND, COLOR_WHITE);
                            }
                        } */

            bads = _.filter(bads, function(o) {
                return o.owner.username == 'Invader';
            });
            //            console.log(bads.length, 'checkForBadsPlaceFlag', creep.room);
            if (bads.length > 0) {

                if (creep.room.memory.mining !== undefined) {
                    creep.room.memory.mining = 0;
                }

                var flagz = creep.room.find(FIND_FLAGS);
                flagz = _.filter(flagz,
                    function(flag) {
                        return (flag.color == FLAG.DEFEND);
                    }
                );

                let type = bads[0].owner.username;
                let z = bads[0].room.name;

                if (flagz.length === 0) {
                    creep.room.createFlag(bads[0].pos.x, bads[0].pos.y, type + z + " " + bads.length + bads[0].id[22], FLAG.DEFEND);
                }
            }

        }

    }


}

module.exports = MoveInteract;