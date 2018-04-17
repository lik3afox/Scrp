// Here we will setup various ways to move to flags or room directions
// or other ways.
var FLAG = require('foxGlobals');

function getRetreatFlag(creep) {
    if (creep.homeFlag !== undefined) {
        let zz = new RoomPosition(creep.homeFlag.pos.x, creep.homeFlag.pos.y, creep.homeFlag.pos.roomName);
        return zz;
    }
}

function moveToRallyFlag(creep) {
    let moveToPos = getFormationPos(creep.partyFlag, creep.memory.formationPos);
    if (moveToPos !== undefined) {
        if (creep.room.name === creep.partyFlag.pos.roomName) {
            if (!creep.pos.isEqualTo(moveToPos)) {
                creep.moveMe(moveToPos, { ignoreCreeps: true ,reusePath: 25 });
            }
        } else {
            if (!creep.pos.isEqualTo(moveToPos))
                creep.moveMe(moveToPos, { ignoreCreeps: true , reusePath: 50 });
        }
        return true;
    }

    if (Game.flags[creep.memory.party] === undefined) return false;
    if (creep.room.name == Game.flags[creep.memory.party]) {
        creep.moveMe(Game.flags[creep.memory.party], { ignoreCreeps: true });
    } else {
        creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50 });
    }
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


    static moveToDefendFlag2(creep, bades) {
        let maxDistance = 1;
        if(creep.memory.role === 'homeDefender') maxDistance = 2;
        let redFlags = _.filter(Game.flags, function(f) {
            return f.color == COLOR_RED && Game.map.getRoomLinearDistance(f.pos.roomName, creep.room.name) <= maxDistance;
        });

        if (redFlags.length) {
            // This is set true, so it's up to the defender/guard to get guys.
            if(creep.room.name === redFlags[0].pos.roomName) return true;
                let zz = new RoomPosition(25, 25, redFlags[0].pos.roomName);
                let xx = creep.moveTo(zz, { reusePath: 40 });
                creep.say(maxDistance + '/D2!' + redFlags[0].pos.roomName);
                return true;
        }
        return false;
    }


    static moveToDefendFlag(creep, bades) {
        console.log('DEFEND FLAG HAS BEEN DISCONTINUED, FIX',creep.memory.role);
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

            bads = _.filter(bads, function(o) {
                return o.owner.username == 'Invader';
            });
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
                    creep.room.createFlag(bads[0].pos.x, bads[0].pos.y, type + z + " " + bads.length + creep.room.name, FLAG.DEFEND);
                }
            }

        }

    }


}

module.exports = MoveInteract;