function analyzeBody(body) {
    var str = 0;
    for (var e in body) {
        if (body[e].boost === undefined) {
            str++;
        } else {
            if (body[e].boost.length === 2) {
                str += 2;
            } else if (body[e].boost.length === 4) {
                str += 3;
            } else if (body[e].boost.length === 5) {
                str += 4;
            }
        }
    }
    return Math.ceil(str);
}

function analyzeHits(creep) {
    var hits = 0;
    var body = creep.body;
    for (var e in body) {

        var multi = 100;
        if (body[e].type === 'tough' && body[e].boost !== undefined) {
            if (body[e].boost.length === 2) {
                multi = multi / 0.7;
            } else if (body[e].boost.length === 4) {
                multi = multi / 0.5;
            } else if (body[e].boost.length === 5) {
                multi = multi / 0.3;
            }
        }
        hits += multi;
    }
    return Math.ceil(hits);
}

module.exports = function() {

    global.roomLink = function(roomname) {
        return '<a href=https://screeps.com/a/#!/room/shard1/' + roomname + '  style="color:#aaaaff">' + roomname + '</a>';
    };

    global.analyzeCreep = function(creep) {
        // This get passed a creep, and it will show stats about it. 
        if (creep === null) return;
        if (creep === null && Game.rooms[creep.pos.roomName] === undefined) return;
        var col = 'red';
        var _strength = analyzeBody(creep.body);
        var _hits = analyzeHits(creep);
        Game.rooms[creep.pos.roomName].visual.text('s:' + _strength, creep.pos.x, creep.pos.y, {
            stroke: col,
            font: 0.25,
        });

        Game.rooms[creep.pos.roomName].visual.text('' + _hits, creep.pos.x, creep.pos.y + 0.30, {
            stroke: col,
            font: 0.25,
        });
        return { strength: _strength, hits: _hits };
    };

    global.squadVisual = function(squad) {
        // pass squad find leader;
        // squadvisual is a box that we keep our search looking at and also how we determine the frame of influence and how we move around.
        // Because everything is done w/ a target, we should do that with this too, it should be done at the same time as a run is done.
        var partyInfo = [];
        if (squad.length === 0) return;
        var room = squad[0].room;
        var center;
        for (var e in squad) {
            if (squad[e].memory.point) {
                squad[e].room.visual.rect(squad[e].pos.x - 6.5, squad[e].pos.y - 6.5,
                    13, 13, { fill: 'transparent', stroke: '#f00' });
                center = new RoomPosition(squad[e].pos.x, squad[e].pos.y, squad[e].pos.roomName);
            }
            let analyze = analyzeCreep(squad[e]);
            let stats = squad[e].memory.role + ":" + squad[e].hits + "/" + squad[e].hitsMax + "(" + analyzeHits(squad[e]) + ")" + squad[e].fatigue;
            partyInfo.push(stats);
        }
        if (center === undefined) return;
        var font = { color: '#F000FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT };
        if (squad[0].owner.username == 'likeafox') {
            center.x -= 12;
        } else {
            center.x += 12;
        }
        for (e in partyInfo) {
            room.visual.text(partyInfo[e], center.x, center.y, font);
            center.y++;
        }

    };

    global.roleCircle = function(pos, role) {
        if(pos === undefined) return false;
        if (Game.rooms[pos.roomName] === undefined) return false;
        var col;

        switch (role) {
            case 'point':
                col = 'red';
                role = 'po';
                break;
            case 'healer':
                col = 'green';
                role = 'he';
                break;
            case 'melee':
                col = 'blue';
                role = 'me';
                break;
            case 'any':
                col = 'white';
                break;
            default:
                col = 'green';
                break;
        }


        Game.rooms[pos.roomName].visual.circle(pos.x, pos.y, {
            radius: 0.5,
            stroke: col,
            fill: 'transparent'
        });


        Game.rooms[pos.roomName].visual.text(role, pos.x, pos.y + 0.25, {
            stroke: col
        });


    };


    global.coronateCheck = function(number) {
        if (number > 49) return 49;
        if (number < 0) return 0;
        return number;


    };

    Object.defineProperty(global, '_terminal', {
        get: function() {
            // @todo: adjust limit based on remaining bucket, and log function
            return require('build.terminal');
            // return Game.cpu.getUsed() > 9;
        },
        configurable: true
    });
    Object.defineProperty(global, 'storageEnergyLimit', {
        get: function() {
            return 850000;
        },
        configurable: true
    });
    
    Object.defineProperty(global, 'storageEnergyLimit', {
        get: function() {
            return 850000;
        },
        configurable: true
    });


    global._terminal_ = function() {
        return require('build.terminal');
    };

    global.stringToRoomPos = function(string) {
        //input XXYYE12S23
        //input 0123456789
        if (string.length !== 10) return;
        var goalRoom = string[4] + string[5] + string[6] + string[7] + string[8] + string[9];
        return new RoomPosition(parseInt(string[0] + string[1]), parseInt(string[2] + string[3]), goalRoom);
    };
    global.roomPosToString = function(roomPos) {
        if (roomPos.x === undefined) return false;
        var xx = roomPos.x;
        if (xx.length === 1) {
            xx = 0 + xx;
        }
        var yy = roomPos.y;
        if (yy.length === 1) {
            yy = 0 + yy;
        }
        var ret = xx + yy + roomPos.roomName;
        if (ret.length > 10) {
            return;
        }
        return ret;
    };


    global.getFormationPos = function(target, formationPos) {
        // So first we get the target.
        if (target === undefined || target.pos === undefined || formationPos === undefined) {
            return;
        }

        if (!_.isNumber(formationPos)) {
            formationPos = parseInt(formationPos);
        }

        let dif = { x: 0, y: 0 };
            switch (formationPos) {
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
                    dif.x = -2;
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
        let zz;
        zz = new RoomPosition(coronateCheck(dif.x + target.pos.x), coronateCheck(dif.y + target.pos.y), target.pos.roomName);
        return zz;
    };

    /*

    Issacar's code

    */

    global.getWorldMapPath = function(start_room, end_room, opts = {}) {
        _.defaults(opts, {
            avoidSK: true, //Avoid SK rooms
            avoidHostile: true, //Avoid rooms that have been blacklisted
            preferOwn: true, //Prefer to path through claimed/reserved rooms
            preferHW: true, //Prefer to path through Highways
            preferRooms: Memory.empire_rooms, //Prefer to path through a specific list of rooms
            avoidRooms: Memory.hostile_rooms, //Avoid pathing through a specific list of rooms
        });
        if (start_room === end_room) {
            return [];
        }

        let ret = Game.map.findRoute(start_room, end_room, {
            routeCallback: (roomName) => {
                if(opts.avoidRooms === undefined) opts.avoidRooms= [];
                if (opts.avoidRooms.length > 0) {
                    //NOTE: This is above opts.preferRooms --> so will overwrite any preferRooms
                    if (opts.avoidRooms.includes(roomName)) {
                        // Avoid pathing through specific rooms
                        return 16.0;
                    }
                }

                if (opts.preferRooms.length > 0) {
                    if (opts.preferRooms.includes(roomName)) {
                        // Prefer to path through specific rooms
                        return 1.0;
                    }
                }

                if (opts.avoidHostile && Memory.hostile_rooms[roomName] && roomName !== start_room && roomName !== end_room) {
                    // Avoid hostile rooms
                    return Number.POSITIVE_INFINITY;
                }

                if (opts.preferOwn && Memory.empire_rooms[roomName]) {
                    // Prefer to path through my own rooms
                    return 1.5;
                }

                let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                let fMod = parsed[1] % 10;
                let sMod = parsed[2] % 10;
                let isSK = !(fMod === 5 && sMod === 5) &&
                    ((fMod >= 4) && (fMod <= 6)) &&
                    ((sMod >= 4) && (sMod <= 6));
                if (opts.avoidSK && isSK) {
                    // Avoid SK rooms
                    return 8.0;
                }

                let isHW = (fMod === 0 || sMod === 0);
                if (opts.preferHW && isHW) {
                    // Prefer to path through highways
                    return 3;
                }

                // Default weight
                return 3.0;
            },
        });

        return ret;
    };
    // Returns the Manhattan distance between two room names
    /*
    global.getManhattanRoomDistance = function(room_1,room_2) {
        if (room_1.name) {
            room_1 = room_1.name;
        }

        if (room_2.name) {
            room_2 = room_2.name;
        }

        let [x1,y1] = getRoomNameToXY(room_1);
        let [x2,y2] = getRoomNameToXY(room_2);

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);

        return (dx+dy);
    };
    // Converts a room name to a 'global' x,y coordinate
    global.getRoomNameToXY = function(room_name) {
        let match = room_name.match(/^(\w)(\d+)(\w)(\d+)$/);
        if (!match) {
            return [undefined,undefined];
        }

        let h = match[1];
        let x = match[2];
        let v = match[3];
        let y = match[4];

        if (h === 'W') {
            x = -x - 1;
        } else {
            x = +x;
        }

        if (v === 'N') {
            y = -y - 1;
        } else {
            y = +y;
        }

        return [x,y];
    }; */
    // Returns the n-th step along an ulam spiral
    global.ulamSpiral = function(n) {
        // Note - The spiral paths counter-clockwise: (0,0) (0,1) (-1,1) (-1,0) ...
        let p = Math.floor(Math.sqrt(4 * n + 1));
        let q = n - Math.floor(p * p / 4);
        let sq = Math.floor((p + 2) / 4);
        let x = 0;
        let y = 0;
        if (p % 4 === 0) {
            // Bottom Segment
            x = -sq + q;
            y = -sq;
        } else if (p % 4 === 1) {
            // Right Segment
            x = sq;
            y = -sq + q;
        } else if (p % 4 === 2) {
            // Top Segment
            x = sq - q - 1;
            y = sq;
        } else if (p % 4 === 3) {
            // Left Segment
            x = -sq;
            y = sq - q;
        }

        return { x: x, y: y, sq: sq };
    };

};