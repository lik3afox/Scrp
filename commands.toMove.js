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
        //if (creep.room.name === creep.partyFlag.pos.roomName) {
        if (!creep.pos.isEqualTo(moveToPos)) {
            creep.moveMe(moveToPos, { reusePath: 50 });
        }
        //  } else {
        //        if (!creep.pos.isEqualTo(moveToPos))
        //                creep.moveMe(moveToPos, { reusePath: 50 });
        //      }
        return true;
    }

    if (Game.flags[creep.memory.party] === undefined) return false;
    if (creep.room.name == Game.flags[creep.memory.party]) {
        creep.moveMe(Game.flags[creep.memory.party], { eusePath: 50 });
    } else {
        creep.moveMe(Game.flags[creep.memory.party], { reusePath: 50 });
    }
    creep.say('rally');
    return true;

}
var redFlags;

class MoveInteract {

    static getSourcePos(creep) {

        if (creep.memory.getSourcePos !== undefined) {
            return new RoomPosition(creep.memory.getSourcePos.x,
                creep.memory.getSourcePos.y,
                creep.memory.getSourcePos.roomName);
        }
        let goalID = creep.memory.goal;
        var spawn = Game.getObjectById(creep.memory.parent);
        if (spawn !== null) {
            for (var e in spawn.memory.roadsTo) {
                if (spawn.memory.roadsTo[e] !== null && spawn.memory.roadsTo[e].source == goalID) {
                    if (spawn.memory.roadsTo[e].sourcePos !== undefined) {
                        creep.memory.getSourcePos = {
                            x: spawn.memory.roadsTo[e].sourcePos.x,
                            y: spawn.memory.roadsTo[e].sourcePos.y,
                            roomName: spawn.memory.roadsTo[e].sourcePos.roomName
                        };
                        return new RoomPosition(spawn.memory.roadsTo[e].sourcePos.x,
                            spawn.memory.roadsTo[e].sourcePos.y,
                            spawn.memory.roadsTo[e].sourcePos.roomName);
                    }
                }
            }
        }
        return 0;
    }
    static getSourcePath(creep) {

        /*if (creep.memory.getSourcePos !== undefined) {
            return new RoomPosition(creep.memory.getSourcePos.x,
                creep.memory.getSourcePos.y,
                creep.memory.getSourcePos.roomName);
        }*/
        let goalID = creep.memory.goal;
        var spawn = Game.getObjectById(creep.memory.parent);
        if (spawn !== null) {
            for (var e in spawn.memory.roadsTo) {
                if (spawn.memory.roadsTo[e] !== null && spawn.memory.roadsTo[e].source == goalID) {
                    if (spawn.memory.roadsTo[e].path !== undefined) {
                        /*creep.memory.getSourcePos = {
                            x: spawn.memory.roadsTo[e].sourcePos.x,
                            y: spawn.memory.roadsTo[e].sourcePos.y,
                            roomName: spawn.memory.roadsTo[e].sourcePos.roomName
                        }; */
                        return spawn.memory.roadsTo[e].path;
                    }
                }
            }
        }
        return 0;
    }

    static flagMovement(creep) {
        if (!moveToRallyFlag(creep)) {

        }
    }

    static moveToDefendFlag3(creep) {
        if (creep.memory.delayMoveTo && creep.memory.delayMoveTo >= 0) {
            creep.memory.delayMoveTo--;
            if (creep.memory.delayMoveTo < 0) {
                creep.memory.delayMoveTo = undefined;
            }
            return false;
        }

        let flag = Game.flags[creep.memory.flagDefend];
        if (!flag) {
            creep.memory.flagDefend = undefined;
            let maxDistance = 1;
            if (creep.memory.role === 'homeDefender') {
                maxDistance = 2;
                if (creep.memory.level === 0)
                    maxDistance = 0;
            }

            let redFlags = _.filter(Game.flags, function(f) {
                return f.color == COLOR_RED && Game.map.getRoomLinearDistance(f.pos.roomName, creep.room.name) <= maxDistance;
            });
            if (creep.memory.role === 'guard') {
                redFlags = _.filter(redFlags, function(f) {
                    return f.pos.isSkRoom();
                });
            }
            if (redFlags.length > 0) {
                creep.memory.flagDefend = redFlags[0].name;
            } else {
                creep.memory.delayMoveTo = 15;
                return false;
            }
        }
        if (flag) {
            //        console.log('Doing New Defend Flag. defend flag',roomLink(creep.room.name));
            if (creep.room.name === flag.pos.roomName) return true;
            let zz = new RoomPosition(25, 25, flag.pos.roomName);
            let xx = creep.moveMe(zz, { reusePath: 40 });
            return true;
        }
        return false;
    }


    static moveToDefendFlag2(creep) {
        console.log('doing defend flag');
        if (creep.memory.delayMoveTo && creep.memory.delayMoveTo >= 0) {
            creep.memory.delayMoveTo--;
            if (creep.memory.delayMoveTo < 0) {
                creep.memory.delayMoveTo = undefined;
            }
            return false;
        }
        let maxDistance = 1;
        if (creep.memory.role === 'homeDefender') maxDistance = 2;
        let redFlags = _.filter(Game.flags, function(f) {
            return f.color == COLOR_RED && Game.map.getRoomLinearDistance(f.pos.roomName, creep.room.name) <= maxDistance;
        });

        if (redFlags.length) {
            // This is set true, so it's up to the defender/guard to get guys.
            if (creep.room.name === redFlags[0].pos.roomName) return true;
            let zz = new RoomPosition(25, 25, redFlags[0].pos.roomName);
            let xx = creep.moveTo(zz, { reusePath: 40 });
            //            creep.say(maxDistance + '/D2!' + redFlags[0].pos.roomName);
            return true;
        } else {
            creep.memory.delayMoveTo = 5;

        }
        return false;
    }


    static moveToDefendFlag(creep, bades) {
        console.log('DEFEND FLAG HAS BEEN DISCONTINUED, FIX', creep.memory.role);
    }

    static runAway(creep) {

        if (Game.flags[creep.memory.runFrom] === undefined) {
            creep.memory.runFrom = undefined;
            creep.memory.runFromRoom = undefined;
            creep.memory.runTarget = undefined;

            return false;
        }
        if(Game.flags[creep.memory.runFrom] && creep.memory.runTarget&& Game.flags[creep.memory.runFrom].pos.roomName === creep.memory.runTarget.roomName){
            creep.memory.runTarget = undefined;

        }
        //|| creep.memory.role === 'miner' 
        if (creep.memory.role === 'mineral' || creep.memory.role === 'controller' || (creep.memory.role === 'transport' && creep.carryTotal === 0)) { //creep.memory.isSkGoal !==undefined && !creep.memory.isSkGoal || 
            if (creep.memory.runTarget === undefined) {
                creep.memory.runTarget = getRetreatFlag(creep);
            }
            if (creep.memory.role === 'miner') creep.dropEverything();
            if (creep.memory.runFromRoom === undefined) {
                creep.memory.runFromRoom = Game.flags[creep.memory.runFrom].pos.roomName;
            }
            creep.memory.cachePath = undefined;
            if (creep.room.name !== creep.memory.runFromRoom && !creep.isAtEdge) {
                creep.sleep(3 + creep.memory.roleID);
            }
            creep.evacuateRoom(creep.memory.runFromRoom);
        } else {

            if (creep.memory.role === 'transport' && creep.carryTotal > 0) creep.memory.goHome = true;
            if (creep.memory.role === 'miner' && creep.carryTotal > 0 && creep.carry[RESOURCE_ENERGY] > 0) {
                creep.memory.goHome = true;
                creep.drop(RESOURCE_ENERGY);
            }

            if (creep.memory.runTarget === undefined) {
                creep.memory.runTarget = getRetreatFlag(creep);
            }
            creep.memory.cachePath = undefined;
            creep.memory.oldCachePath = undefined;
            creep.say('🏃');
            if (creep.memory.task && creep.memory.task.length) {
                creep.memory.task = [];
            }
            let zz = new RoomPosition(creep.memory.runTarget.x, creep.memory.runTarget.y, creep.memory.runTarget.roomName);
            if (creep.memory.role === 'miner') {
                let sourceRoom;
                let source = Game.getObjectById(creep.memory.goal);
                if(source){
                    sourceRoom = source.pos.roomName;
                }

                if (creep.room.name === sourceRoom) {
                    if (creep.moveMe(zz, { reusePath: 50, ingoreCreeps: true }) == OK) {}
                } else {
                    creep.moveInside();
                }

            } else {
                if (!creep.pos.inRangeTo(zz, 5)) {
                    if (creep.moveMe(zz, { reusePath: 50, ingoreCreeps: true,range:5 }) == OK) {}
                } else {

                    if (!creep.pos.inRangeTo(zz, 4)) {
                        creep.sleep(10 + creep.memory.roleID);
                        if (creep.moveMe(zz, { maxOpts: 10, ingoreCreeps: true,range:4 }) == OK) {}
                    } else {
                        creep.sleep(10 + creep.memory.roleID);
                        creep.dance();
                    }
                }
            }
        }
        return true;
    }



    static checkForBadsPlaceFlag(creep) {
        if (creep.memory.runFrom !== undefined) return true;
        if (creep.memory.checkForBadScan === undefined) {
            creep.memory.checkForBadScan = 0;
        }
        creep.memory.checkForBadScan--;
        if (creep.memory.checkForBadScan < 0) {
            creep.memory.checkForBadScan = 8;

            var bads = creep.room.invaders;

            if (bads.length > 0) {

                let type = bads[0].owner.username;
                let z = bads[0].room.name;
                let flagName = type + z + " " + bads.length + creep.room.name;


                if (Game.flags[flagName] === undefined) {
                    creep.room.createFlag(bads[0].pos.x, bads[0].pos.y, flagName, FLAG.DEFEND);
                }
            }
            if (creep.room.name !== 'E17S46') return;
            bads = creep.room.playerCreeps;
            //        bads = [];
            //            bads.push(Game.getObjectById('5bc8d6746b9ddf68f84a4c27'));
            //          bads.push(Game.getObjectById('5bc8d8e803a4102313dde441'));
            if (bads.length > 0) {
                let flagName = creep.room.name + bads[0].owner.username;
                if (Game.flags[flagName] === undefined) {
                    creep.room.createFlag(bads[0].pos.x, bads[0].pos.y, flagName, COLOR_YELLOW, COLOR_BLUE);
                } else {
                    Game.flags[flagName].memory.musterRoom = creep.memory.home;
                    let alpha = Game.rooms[creep.memory.home].alphaSpawn;
                    if (alpha && alpha.memory.remoteStop) {
                        let zz = _.indexOf(alpha.memory.remoteStop, creep.room.name);
                        if (zz === -1) {
                            alpha.memory.remoteStop.push(creep.room.name);
                        }
                    }
                }

            }

        }

    }


}

module.exports = MoveInteract;