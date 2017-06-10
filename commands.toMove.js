// Here we will setup various ways to move to flags or room directions
// or other ways.

var FLAG = require('foxGlobals');

var container = require('commands.toContainer');

function getTotalFlag() {
    var total = 0;
    for (var name in Game.flags) {
        total += 1;
    }
    return total;
}

function isInFlagRoom(creep, flagColor) {
    //  if(creep.room.name)

}

var portalID = '5881eb5de8d5a7884c0ac723';

function moveToWayFlag(creep) {
    // Returns false if no flag or not at flag - 
    // return true only when the creep.memory.waypoint = true; 
    var wayflag;
    for (var e in Game.flags) {
        if (Game.flags[e].color == FLAG.WAYPOINT) {
            wayflag = new RoomPosition(Game.flags[e].pos.x, Game.flags[e].pos.y, Game.flags[e].pos.roomName);
        }
    }
    // If waypoint flag exists continue. 
    if (wayflag === undefined) return true;
    if (creep.memory.waypoint === undefined) {
        creep.memory.waypoint = false;
    }

    if (creep.memory.waypoint) // If at the waypoint then return true;
        return creep.memory.waypoint;



    //let temp = Game.getObjectById(portalID);
    /*if(temp.room != undefined && creep.room.name == temp.room.name) {
      creep.moveTo(temp);
    } else {
        
    } */
    creep.say('way' + creep.moveTo(wayflag, { reusePath: 40, ignoreRoads: true }));
    //    creep.moveTo(wayflag);

    var inRange = creep.pos.findInRange(FIND_FLAGS, 1, {
        filter: (flag) => {
            return (flag.color == FLAG.WAYPOINT);
        }
    });

    if (inRange.length > 0) { // if through the portal...
        creep.memory.waypoint = true;
    }

    return creep.memory.waypoint;
}

function getRetreatFlag(creep) {
    let flag;
    let zz;

    switch (creep.memory.goal) {

        case '5836b8118b8b9619519f1659':
        case '5836b8118b8b9619519f165c':
            flag = Game.flags.Flag6;
            break;

        case '5836b8118b8b9619519f165f':
            flag = Game.flags.Flag11;
            break;

        case '5836b8148b8b9619519f16d7':
        case '5836b8148b8b9619519f16d8':
            flag = Game.flags.Flag38;
            break;
        case '5836b8138b8b9619519f16cb':
        case '5836b8138b8b9619519f16c2':
        case '5836b8138b8b9619519f16c1':
        case '5836b8138b8b9619519f16c8':
        case '5836bb2241230b6b7a5b9a35':
            flag = Game.flags.Flag31;
            break;

        case '5836b8138b8b9619519f16b8':
        case '5836b8138b8b9619519f16bd':
            flag = Game.flags.Flag9;
            break;

        case '5836b8138b8b9619519f16ba':
        case '5836bb2241230b6b7a5b9a33':
            flag = Game.flags.Flag3;
            break;

        case '5873bd6d11e3e4361b4d92ec':
            flag = Game.flags.Flag44;
            break;
        case '5873bd6d11e3e4361b4d92ef':
            flag = Game.flags.Flag45;
            break;

        case '5873bd6d11e3e4361b4d92ed':
        case '5873c198ade6694c56c57c84':

            flag = Game.flags.Flag41;
            break;
        case '5873bd6f11e3e4361b4d9356':
            flag = Game.flags.Flag48;
            break;

        case '5873bd6f11e3e4361b4d9355':
        case '5873bd6f11e3e4361b4d9357':
        case '5873c198ade6694c56c57c92':

            flag = Game.flags.Flag45;
            break;
        case '5836bb2241230b6b7a5b9a37':
        case '5836b8138b8b9619519f16cc':
        case '5836b8138b8b9619519f16cf':

            flag = Game.flags.Flag14;
            break;

        case '5836bb2241230b6b7a5b9a2b':
        case '5836b8118b8b9619519f166c':
            flag = Game.flags.Flag29;
            break;

        case '5836b8118b8b9619519f1669':
        case '5836b8118b8b9619519f1668':
        case '5836b8138b8b9619519f16c8':

            flag = Game.flags.Flag30;
            break;

        case '5836b8118b8b9619519f1664':
        case '5836b8118b8b9619519f1665':

            flag = Game.flags.Flag33;
            break;

        case '5836b8118b8b9619519f1663':
        case '5836bb2241230b6b7a5b9a29':

            flag = Game.flags.Flag32;
            break;

        default:
            let targetParent = Game.getObjectById(creep.memory.parent);
            for (var a in Game.flags) {
                if (targetParent.pos.roomName == Game.flags[a].pos.roomName && Game.flags[a].color == COLOR_WHITE) {
                    let zz = new RoomPosition(Game.flags[a].pos.x, Game.flags[a].pos.y, Game.flags[a].pos.roomName);
                    creep.memory.runTarget = zz;
                    return zz;
                }
            }
            break;

    }

    if (flag !== undefined && flag.pos.roomName != creep.pos.roomName) {
        zz = new RoomPosition(flag.pos.x, flag.pos.y, flag.pos.roomName);
        creep.memory.runTarget = zz;
        return zz;
    } else {
        let targetParent = Game.getObjectById(creep.memory.parent);
        for (var u in Game.flags) {
            if (targetParent.pos.roomName == Game.flags[u].pos.roomName && Game.flags[u].color == COLOR_WHITE) {
                let zz = new RoomPosition(Game.flags[u].pos.x, Game.flags[u].pos.y, Game.flags[u].pos.roomName);
                creep.memory.runTarget = zz;
                return zz;
            }
        }
    }



}

function moveToGuardFlag(creep) {
    for (var e in Game.flags) {
        if (Game.flags[e].color == FLAG.GUARD) {
            if (creep.room.name != Game.flags[e].memory.room && Game.flags[e].name == creep.memory.party) {
                creep.moveMe(Game.flags[e], { reusePath: 30 });
                creep.say('m2G');
                return true;
            }
        }
    }
    return false;
}

function moveToAttackFlag(creep) {
    for (var e in Game.flags) {
        if (Game.flags[e].color == FLAG.ATTACK) {
            creep.moveTo(Game.flags[e]);
            creep.say('march');
            return true;
        }
    }
    return false;
}

function doRun(creep) {}

function moveToRallyFlag(creep) {
    let moveToPos = getFormationPos(creep);
    if (moveToPos !== undefined) {
        if (creep.room.name == moveToPos.roomName) {
            if (!creep.pos.isEqualTo(moveToPos))
                creep.moveMe(moveToPos, { ignoreRoads: true, swampCost: 1 });
        } else {
            if (!creep.pos.isEqualTo(moveToPos))
                creep.moveMe(moveToPos, { reusePath: 50 });
        }
        return true;
    }

    if (Game.flags[creep.memory.party] === undefined) return false;
    if (creep.room.name == Game.flags[creep.memory.party]) {
        creep.moveMe(Game.flags[creep.memory.party], { ignoreRoads: true, ignoreCreeps: true });
    } else {
        creep.moveMe(Game.flags[creep.memory.party], { ignoreRoads: true, reusePath: 50 });
    }
    //        creep.moveMe(Game.flags[creep.memory.party],{ignoreRoads: true,reusePath:50});
    creep.say('rally');
    return true;

}

function getNewGoal(creep) {

    var _flags = [];
    for (var e in Game.flags) {
        if (Game.flags[e].color == COLOR_WHITE || Game.flags[e].color == COLOR_BLUE) {
            //      if(Game.flags[e].pos.roomName)
            var distance = Game.map.getRoomLinearDistance(Game.flags[e].pos.roomName, creep.room.name);
            if (distance < 3) {
                _flags.push(Game.flags[e]);
            }
        }
    }

    if (_flags.length === 0) return;

    let random = Math.floor(Math.random() * _flags.length);

    var i = 0;
    for (var name in _flags) {
        let target = _flags[name];
        if (i == random) {
            creep.memory.goal = target;
            return;
        }
        i = i + 1;
    }
}

function atFlag(creep, flag) {

    if (creep.pos.inRangeTo(flag, 1)) {
        return true;
    }
    return false;
}


function getFormationPos(creep) {
    // So first we get the flag.
    let dif = { x: 0, y: 0 };
    if (creep.memory.formationPos !== undefined) {
        switch (creep.memory.formationPos) {
            case 1:
                dif.y = -1;
                break;
            case 2:
                dif.x = 1;
                dif.y = -1;
                break;
            case 3:
                dif.x = 1;
                break;
            case 4:
                dif.x = 1;
                dif.y = 1;
                break;
            case 5:
                dif.y = 1;
                break;
            case 6:
                dif.x = -1;
                dif.y = 1;
                break;
            case 7:
                dif.x = -1;
                break;
            case 8:
                dif.x = -1;
                dif.y = -1;
                break;
            case 11:
                dif.y = -2;
                break;
            case 12:
            case 21:
                dif.x = 1;
                dif.y = -2;
                break;
            case 22:
                dif.x = +2;
                dif.y = -2;
                break;
            case 23:
            case 32:
                dif.x = 2;
                dif.y = -1;
                break;
            case 33:
                dif.x = 2;
                break;
            case 34:
            case 43:
                dif.x = 2;
                dif.y = 1;
                break;
            case 44:
                dif.x = 2;
                dif.y = 2;
                break;
            case 45:
            case 54:
                dif.x = 1;
                dif.y = 2;
                break;
            case 55:
                dif.y = 2;
                break;
            case 56:
            case 65:
                dif.x = -1;
                dif.y = 2;
                break;
            case 66:
                dif.x = -2;
                dif.y = 2;
                break;
            case 67:
            case 76:
                dif.x = 2;
                dif.y = 1;
                break;
            case 77:
                dif.x = -2;
                break;
            case 78:
            case 87:
                dif.x = -2;
                dif.y = -1;
                break;
            case 88:
                dif.x = -2;
                dif.y = -2;
                break;
            case 18:
            case 81:
                dif.x = -1;
                dif.y = -2;
                break;

        }
    }
    let zz;
    if (Game.flags[creep.memory.party] !== undefined) {
        let yy = Game.flags[creep.memory.party].pos;
        zz = new RoomPosition(dif.x + yy.x, dif.y + yy.y, yy.roomName);
    }
    return zz;
}

class MoveInteract {
    static constructor() {
        console.log('creation of this class?');
    }

    static isDefendFlag(spawn) {
            for (var e in Game.flags) {
                if (Game.flags[e].color == FLAG.DEFEND) {
                    return true;
                }
            }
            return false;
        }
        //      

    static removeDefendFlag() {
        for (var e in Game.flags) {
            if (Game.flags[e].color == FLAG.DEFEND) {

            }
        }
    }

    static getSortByClose(creep) {


    }

    static moveToGoalz(creep) {
        var goalID = creep.memory.goal;
        if (goalID === undefined)
            return false;

        for (var i in Game.spawns) {
            for (var e in Game.spawns[i].memory.roadsTo) {
                //          console.log(Game.spawns[i].memory.roadsTo[e].source , goalID);
                if (Game.spawns[i].memory.roadsTo[e].source == goalID) {

                    //              console.log(Game.spawns[i].memory.roadsTo[e].sourcePos.x);

                    if (Game.spawns[i].memory.roadsTo[e].sourcePos !== undefined)
                    //              console.log(tempz);

                        creep.moveTo(Game.spawns[i].memory.roadsTo[e].sourcePos.x,
                        Game.spawns[i].memory.roadsTo[e].sourcePos.y,
                        Game.spawns[i].memory.roadsTo[e].sourcePos.roomName);
                    return true;

                }
            }
        }
        return false;
    }

    static getRoomPos(goalID) {
        for (var i in Game.spawns) {
            for (var e in Game.spawns[i].memory.roadsTo) {
                //          console.log(Game.spawns[i].memory.roadsTo[e].source , goalID);
                if (Game.spawns[i].memory.roadsTo[e] !== null && Game.spawns[i].memory.roadsTo[e].source == goalID) {

                    //              console.log(Game.spawns[i].memory.roadsTo[e].sourcePos.x);

                    if (Game.spawns[i].memory.roadsTo[e].sourcePos !== undefined)
                        return new RoomPosition(Game.spawns[i].memory.roadsTo[e].sourcePos.x,
                            Game.spawns[i].memory.roadsTo[e].sourcePos.y,
                            Game.spawns[i].memory.roadsTo[e].sourcePos.roomName);


                }
            }
        }
        return 0;
    }



    static moveToGoal(creep) {

    }

    static totalFlag(creep) {
        return getTotalFlag();
    }

    static getRandomGoal(creep) {
        getNewGoal(creep);
    }

    static getDifferentGoal(creep) {
        getNewGoal(creep);
    }

    static guardFlagMove(creep) {
        return moveToGuardFlag(creep);
    }

    static flagMovement(creep) {


        // Defend Flag has highest prority. 
        //    if(!moveToDefendFlag(creep)) {
        // Then waypoint flag
        if (moveToWayFlag(creep)) {
            // Then rally flag
            if (!moveToRallyFlag(creep)) {
                moveToAttackFlag(creep);
            }
        }
        //  }

    }

    static checkRoomForBads(creep) {
        var hostiles = creep.room.find(FIND_HOSTILE_CREEPS, {
            filter: object => (object.owner.username == 'Invader')
        });

        for (var e in Game.flags) {
            if ((hostiles.length === 0) && (creep.room.name == Game.flags[e].pos.roomName)) {
                Game.flags[e].remove();
                return true;
            }
        }
    }

    static moveToDefendFlag(creep, bades) {

        var guardRooms = ['E26S75', 'E25S74', 'E25S75', 'E25S76', 'E26S74', 'E26S76', 'E35S84', 'E35S74'];
        var E26S76 = ['E26S75', 'E26S76', 'E25S76'];
        var E26S75 = ['E25S75', 'E26S74', 'E26S76'];
        var E26S74 = ['E26S75', 'E25S74'];
        var E25S74 = ['E25S75', 'E26S74'];
        var E25S76 = ['E25S75', 'E26S76'];
        var E35S84 = ['E35S84', 'E35S85', 'E34S84'];
        var E34S84 = ['E35S84', 'E35S85', 'E34S84'];

        var E35S74 = ['E35S74', 'E35S75', 'E34S74', 'E36S74', 'E36S75'];
        var E34S74 = ['E35S74', 'E34S74'];
        var E36S74 = ['E35S74', 'E36S74', 'E36S75'];
        var E36S75 = ['E35S74', 'E35S75', 'E36S74', 'E36S75'];
        var E35S76 = ['E35S76', 'E34S76', 'E35S75'];
        var E34S76 = ['E35S76', 'E34S76'];

        var W4S94 = ['W4S94', 'W5S94'];
        var W5S94 = ['W4S94', 'W5S94'];

        /*
                let flagz = _.filter(Game.flags, function(f) {
                    return f.color == FLAG.DEFEND;
                });

                console.log(flagz.length); */
        let flagz = creep.defendFlags();
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
                switch (creep.room.name) {
                    case 'W4S94':
                        if (_.contains(W4S94, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;
                    case 'W5S94':
                        if (_.contains(W5S94, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E34S76':
                        if (_.contains(E34S76, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;
                    case 'E35S76':
                        if (_.contains(E35S76, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E36S74':
                        if (_.contains(E36S74, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;
                    case 'E36S75':
                        if (_.contains(E36S75, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;


                    case 'E34S74':
                        if (_.contains(E34S74, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E34S84':
                        if (_.contains(E34S84, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;
                    case 'E35S84':
                        if (_.contains(E35S84, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E25S74':
                        if (_.contains(E25S74, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E35S74':
                        if (_.contains(E35S74, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E25S76':
                        if (_.contains(E25S76, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E26S74':
                        if (_.contains(E26S74, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E26S75':
                        if (_.contains(E26S75, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    case 'E26S76':
                        if (_.contains(E26S76, flagz[e].pos.roomName)) {
                            maxDistance = 1;
                        } else {
                            maxDistance = 0;
                        }
                        break;

                    default:
                        if (!_.contains(guardRooms, flagz[e].pos.roomName)) {
                            maxDistance = 0;
                        } else {
                            maxDistance = 1; //if(distance > 1) return false;
                        }
                        break;
                }



            }
            creep.say(maxDistance);
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

    static moveToAttackFlag(creep) {
        for (var e in Game.flags) {
            if (Game.flags[e].color == FLAG.ATTACK) {
                creep.moveTo(Game.flags[e]);
                return true;
            }
        }
        return false;
    }

    static moveToRallyFlag(creep) {


        if (Game.flags[creep.memory.party] === undefined) return false;
        creep.moveMe(Game.flags[creep.memory.party], { ignoreRoads: true, reusePath: 75 });
        return true;
        /*
                if (creep.memory.partyFlag === undefined) {

                    for (var e in Game.flags) {
                        if (Game.flags[e].color == FLAG.RALLY && creep.memory.party == Game.flags[e].name) {
                            creep.moveTo(Game.flags[e], { ignoreRoads: true });
                            creep.memory.partyFlag = Game.flags[e].name;
                            break;
                        }
                    }
                }
                return true;
        */
    }

    static moveToFlag(creep) {
        if (creep.memory.goal === undefined) return;
        var gogoing = new RoomPosition(creep.memory.goal.pos.x, creep.memory.goal.pos.y, creep.memory.goal.pos.roomName);
        creep.moveTo(gogoing, { reusePath: 20 });
        if (atFlag(creep, creep.memory.goal)) {
            getNewGoal(creep);
        }
    }

    static moveHome(creep) {
        let home = Game.getObjectById(creep.memory.parent);
        creep.moveMe(home, { reusePath: 30 });
    }

    static runAway(creep) {

        if (creep.memory.runAway === true) {
            if (creep.memory.role == 'miner') creep.dropEverything();
            if (creep.memory.runTarget === undefined) {
                getRetreatFlag(creep);
                creep.moveTo(creep.memory.runTarget, { reusePath: 50 });
            } else {
                creep.say('🏃');
                let zz = new RoomPosition(creep.memory.runTarget.x, creep.memory.runTarget.y, creep.memory.runTarget.roomName);
                if (creep.moveTo(zz, { reusePath: 50 }) == OK) {
                    if (creep.pos.inRangeTo(zz, 3)) {
                        creep.say('zZzZ');
                    }
                }
            }

            if (Game.flags[creep.memory.runFrom] === undefined) {
                creep.memory.runAway = false;
            }

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
            creep.memory.checkForBadScan = Math.ceil(Math.random() * 7) + 3;

            var bads = creep.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(o) {
                return o.owner.username == 'Invader';
            });
            //            console.log(bads.length, 'checkForBadsPlaceFlag', creep.room);
            if (bads.length > 0) {
                var flagz = creep.room.find(FIND_FLAGS, {
                    filter: (flag) => {
                        return (flag.color == FLAG.DEFEND);
                    }
                });
                //             return (flag.color == FLAG.DEFEND || flag.color == FLAG.GUARD);}} ); 
                let type = bads[0].owner.username;
                let z = bads[0].id[Math.floor(Math.random() * 15)];
                //                console.log(flagz.length, 'okay so bads are here', flagz.length == 0, flagz.length === 0);
                if (flagz.length === 0) {
                    creep.room.createFlag(bads[0].pos.x, bads[0].pos.y, type + z + " " + bads.length + bads[0].id[22], FLAG.DEFEND);
                    /*for (var e in Game.flags) {
                        if (Game.flags[e].pos.roomName == creep.pos.roomName && (Game.flags[e].color == COLOR_WHITE || Game.flags[e].color == COLOR_BLUE)) {
                            Game.flags[e].memory.goldMined = 0;
                            Game.flags[e].memory.attack++;
                        }
                    } */
                }
            }

        }

    }

    static isAtFlag(creep, flag) {
        return atFlag(creep, flag);
    }


}

module.exports = MoveInteract;
