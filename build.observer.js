var s1_obserRooms = ['E25S37', 'E18S36', 'E18S32', 'E23S42', 'E28S37', 'E39S51', 'E54S53', 'E59S42', 'E51S41', 'E51S31'];
var s2_obserRooms = ['E19S49'];

//'E32S70',
var cachedRoomObserve;
var roomsObserve = [
    'E20S40',
    'E29S40', 'E28S40', 'E27S40', 'E26S40', 'E25S40', 'E24S40', 'E23S40', 'E22S40', 'E21S40',
    'E20S30', 'E11S30', 'E12S30',
    //    'E21S30', 'E22S30', 'E23S30', 'E24S30', 'E25S30', 'E26S30', // North side
    'E20S31', 'E20S32', 'E20S33', 'E20S34', 'E20S35', 'E20S36', 'E20S37', 'E20S38', 'E20S39',
    'E30S40', 'E30S41', 'E30S42', 'E30S43', 'E30S44', 'E30S45', 'E30S46', 'E30S47', 'E30S48', 'E30S49', 'E30S50', // East south
    'E11S40', 'E12S40', 'E13S40', 'E14S40', 'E15S40', 'E16S40', 'E17S40', 'E18S40', 'E19S40',
    'E20S50', 'E30S50',
    'E21S50', 'E22S50', 'E23S50', 'E24S50', 'E25S50', 'E27S50', 'E28S50', 'E29S50', 'E30S50',

    'E20S41', 'E20S42', 'E20S43', 'E20S44', 'E20S45', 'E20S46', 'E20S47', 'E20S48', 'E20S49',
    'E30S39', 'E30S38',
    'E30S43', 'E30S44', 'E30S45', 'E30S46', 'E30S32', 'E30S33', 'E30S34', 'E30S35', 'E30S36', 'E30S37', 'E30S38', 'E30S39',
    'E11S50', 'E12S50', 'E13S50', 'E14S50', 'E15S50', 'E16S50', 'E17S50', 'E18S50', 'E19S50',
    'E17S30', 'E18S30', 'E19S30',

    'E10S44', 'E10S45', 'E10S46', 'E10S47', 'E10S48', 'E10S49', 'E10S50',
    'E40S60', 'E41S60', 'E42S60', 'E43S60', 'E44S60', 'E45S60', 'E46S60', 'E47S60', 'E48S60', 'E49S60', 'E50S60', 'E51S60', 'E52S60', 'E53S60', 'E54S60', 'E55S60', 'E56S60', 'E57S60', 'E58S60', 'E59S60', 'E60S60',
    //    'E50S50', 'E50S51', 

    'E50S52', 'E50S53', 'E50S54', 'E50S55', 'E50S56', 'E50S57', 'E50S58', 'E50S59',
    'E51S50', 'E52S50', 'E53S50', 'E54S50', 'E55S50',
    'E60S50', 'E60S51', 'E60S52', 'E60S53', 'E60S54', 'E60S55', 'E60S56', 'E60S57', 'E60S58', 'E60S59',

    'E60S40', 'E60S41', 'E60S42', 'E60S43', 'E60S44', 'E60S45', 'E60S46', 'E60S47', 'E60S48', 'E60S49',

    'E55S40', 'E56S40', 'E57S40', 'E58S40', 'E59S40', 'E56S50', 'E57S50', 'E58S50', 'E59S50', 'E60S50',

    'E50S37', 'E50S38', 'E50S39', 'E50S40', 'E50S41', 'E50S42', 'E50S43', 'E47S40', 'E48S40', 'E49S40', 'E51S40', 'E52S40', 'E53S40',

    'E60S30', 'E60S31', 'E60S32', 'E60S33', 'E60S34', 'E60S35', 'E60S36', 'E60S37', 'E60S38', 'E60S39',

    //'E50S30','E51S30','E52S30'
    'E53S30', 'E54S30',
    'E31S50', 'E32S50',
    //    'E30S51', 'E30S52',
    //'E50S30','E50S31','E50S32','E50S33','E50S34',
    'E37S50', 'E38S50', 'E39S50', 'E40S50', 'E41S50', 'E42S50', 'E40S48', 'E40S49', 'E40S51', 'E40S52',

];
var shard1PowerRooms = [
    'E30S40', 'E30S41', 'E30S42', 'E30S43', 'E30S44', 'E30S45', 'E30S46', 'E30S47', 'E30S48', 'E30S49', 'E30S50',
    //    'E21S30', 'E22S30', 'E23S30', 'E24S30', 'E25S30', 'E26S30',
    'E11S50', 'E12S50', 'E13S50', 'E14S50', 'E15S50', 'E16S50', 'E17S50', 'E18S50', 'E19S50',
    'E21S50', 'E22S50', 'E23S50', 'E24S50', 'E25S50', 'E27S50', 'E28S50', 'E29S50', 'E30S50',
    'E20S40', 'E20S50',
    'E30S33', 'E30S34', 'E30S35', 'E30S36', 'E30S37', 'E30S38', 'E30S39', 'E20S30',
    'E29S40', 'E28S40', 'E27S40', 'E26S40', 'E25S40', 'E24S40', 'E23S40', 'E22S40', 'E21S40',
    'E20S31', 'E20S32', 'E20S33', 'E20S34', 'E20S35', 'E20S36', 'E20S37', 'E20S38', 'E20S39',
    'E12S40', 'E13S40', 'E14S40', 'E15S40', 'E16S40', 'E17S40', 'E18S40', 'E19S40',
    'E20S41', 'E20S42', 'E20S43', 'E20S44', 'E20S45', 'E20S46', 'E20S47', 'E20S48', 'E20S49', 'E17S30', 'E18S30', 'E19S30',
    'E10S44', 'E10S45', 'E10S46', 'E10S47', 'E10S48', 'E10S49', 'E10S50',


    'E40S60', 'E41S60', 'E42S60', 'E43S60', 'E44S60', 'E45S60', 'E46S60', 'E47S60', 'E48S60', 'E49S60',
    'E50S60', 'E51S60', 'E52S60', 'E53S60', 'E54S60', 'E55S60', 'E56S60', 'E57S60', 'E58S60', 'E59S60', 'E60S60',
    //    'E50S50', 'E50S51', 
    'E50S52', 'E50S53', 'E50S54', 'E50S55', 'E50S56', 'E50S57', 'E50S58', 'E50S59',
    'E51S50', 'E52S50', 'E53S50', 'E54S50', 'E55S50', 'E56S50', 'E57S50', 'E58S50', 'E59S50', 'E60S50',

    'E60S50', 'E60S51', 'E60S52', 'E60S53', 'E60S54', 'E60S55', 'E60S56', 'E60S57', 'E60S58', 'E60S59',
    'E60S40', 'E60S41', 'E60S42', 'E60S43', 'E60S44', 'E60S45', 'E60S46', 'E60S47', 'E60S48', 'E60S49',
    'E55S40', 'E56S40', 'E57S40', 'E58S40', 'E59S40',

    'E50S37', 'E50S38', 'E50S39', 'E50S40', 'E50S41', 'E50S42', 'E50S43', 'E47S40', 'E48S40', 'E49S40', 'E51S40', 'E52S40', 'E53S40',
    'E60S30', 'E60S31', 'E60S32', 'E60S33', 'E60S34', 'E60S35', 'E60S36', 'E60S37', 'E60S38', 'E60S39',
    //'E50S30','E51S30','E52S30',
    'E53S30', 'E54S30',
    //'E50S30','E50S31','E50S32','E50S33','E50S34',

    'E31S50', 'E32S50',
    //    'E30S51', 'E30S52',
    'E37S50', 'E38S50', 'E39S50', 'E40S50', 'E41S50', 'E42S50', 'E40S48', 'E40S49', 'E40S51', 'E40S52',
];


var shard0PowerRooms = ['E36S70', 'E37S70', 'E38S70', 'E39S70', 'E40S70',
    'E40S71', 'E40S72', 'E40S73'
];

var shard2PowerRooms = ['E18S50', 'E19S50', 'E20S50', 'E21S50', 'E22S50', 'E20S49', 'E20S51', 'E20S52', 'E20S48'];

var shard3PowerRooms = ['E16S50', 'E17S50', 'E18S50', 'E19S50', 'E20S50', 'E21S50', 'E22S50', 'E20S49', 'E20S51', 'E20S52', 'E20S53', 'E20S48'];



function newDoTask(roomName) {
    var target;
    var flagName;
    var tasks = Memory.observerTask;
    if (tasks.length === 0) {
        return false;
    }
    let task = tasks[0];
    let options;
    var distance;
    var observers;
    var a, e;
    let ob = Game.rooms[roomName].observer;
    if(Memory.empireSettings.boostObserverRoom && Memory.empireSettings.boostObserverRoom[Game.shard.name]){
        let chosenRoom = Memory.empireSettings.boostObserverRoom[Game.shard.name];
        let chosenOb = Game.rooms[chosenRoom].observer;
        if(chosenOb.isEffected() && roomName !== chosenRoom){
            return; 
        } 
        ob = chosenOb;
    }
    if (task.order === undefined) {
        tasks.shift();
        return;
    }
//    if(ob.isEffected())console.log('doing observer',roomName,'effected',task.order,task.options.room,task.options.timed,Game.rooms[task.options.room]);
    options = task.order.options;
    if (!ob) return;
    switch (task.order) {
        case "banditFlag":
            target = task.options.room;
            flagName = task.options.name;
            if (flagName === undefined) {
                console.log('Bad flag name for bandit flag');
                return;
            }
            if (Game.flags[flagName]) {
                console.log('TYRING To place flag that laready exists?');
            }
            if (ob.isEffected()) {
                distance = 0;
                
            } else {
                distance = Game.map.getRoomLinearDistance(ob.room.name, target);
            }

            if (distance <= 10) {
                //                console.log(tasks.length, roomName, 'is looking at ', task.order, "for bandit flag", distance, roomLink(target), Game.rooms[target]);
                if (Game.rooms[target] !== undefined) {
                    var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT, backgroundColor: '#0F0F0F' };
                    Game.rooms[target].visual.text('LOOKING to place flag:' + Game.flags[flagName], 25, 25, font);
                    if (Game.flags[flagName] === undefined) {
                        var bca = new RoomPosition(20, 25, target);
                        var zzz = Game.rooms[target].createFlag(bca, flagName, COLOR_YELLOW, COLOR_YELLOW);
                    } else {
                        Game.flags[flagName].memory.musterType = 'bandit';
                        Game.flags[flagName].memory.bandit = true;
                        tasks.shift();
                        return true;
                    }
                }
                let edz = ob.observeRoom(target);
                //if(ob.isEffected())        console.log('looking at room result', edz, target, ob, "flag exists?", Game.flags.bandit !== undefined,edz);
                if (edz == OK) {
                    if (Game.flags[flagName] !== undefined) {
                        Game.flags[flagName].memory.musterType = 'bandit';
                        Game.flags[flagName].memory.bandit = true;
                        tasks.shift();
                        return true;
                    }
                }

            }


            break;
        case "observer":
            for (let ee in task.options) {
                if (ee == 'room') target = task.options[ee];
            }
            if (ob.isEffected()) {
                distance = 0;
//                task.options.timed = 0;
            } else {
                distance = Game.map.getRoomLinearDistance(ob.room.name, target);
            }

            if (distance < 10) {
                let ezcd = ob.observeRoom(target) ; 
//                if(ob.isEffected())    console.log(ezcd,roomLink(target),'looking @',target, "distance:", distance, ob, "doing the task of", task.order, "for " + task.options.timed + "longer", Game.rooms[target]);
                if (ezcd== OK) {
                    task.options.timed--;
                    if (task.options.timed <= 0) {
                        tasks.shift();
                    }
                    return true;
                }
            }
            break;
    }
    return false;
}

function changeRoom(roomName, direction, amount) {
    var east = parseInt(roomName[1] + roomName[2]);
    var north = parseInt(roomName[4] + roomName[5]);
    if (amount === undefined) amount = 3;

    switch (direction) {
        case "s":
        case "south":
            north -= amount;
            break;
        case "n":
        case "north":
            north += amount;
            break;
        case "w":
        case "west":
            east -= amount;
            break;
        case "e":
        case "east":
            east += amount;
            break;
    }
    let rtn = roomName[0] + east + roomName[3] + north;
    return rtn;
}

function caravanCheck(target) {

    if (Game.shard.name !== 'shard1') return false;
    if (Game.rooms[target] === undefined) return false;
    if (_.contains(['E48S40', 'E49S40', 'E48S30', 'E49S30', 'E50S41', 'E50S42', 'E50S43'], target)) return false;
    let caravan = Game.rooms[target].npcs;
    var targetRoom;
    var string = target + " " + 'LOOKING FOR Screeps:' + " " + caravan.length;
    Game.rooms[target].visual.text(string, 25, 25, {
        color: '#10c3ba ',
        stroke: '#000000 ',
        strokeWidth: 0.123,
        font: 0.5
    });

    if (caravan.length > 0) {
        let direction;
        let troom = Game.rooms[target];
        var dir;
        if (caravan[0].ticksToLive < 1400 && caravan[0].ticksToLive > 1000) {
            let roomName = caravan[0].pos.roomName;
            var two = parseInt(roomName[2]);
            var five = parseInt(roomName[5]);
            // This is west direction 1/2 
            if ((two === 1 || two === 2) && caravan[0].ticksToLive > 1000) {
                dir = 'e';
            } else if ((two === 9 || two === 8) && caravan[0].ticksToLive > 1000) {
                dir = 'w';
            } else if ((five === 1 || five === 2) && caravan[0].ticksToLive > 1000) {
                dir = 'n';

            } else if ((five === 9 || five === 8) && caravan[0].ticksToLive > 1000) {
                dir = 's';
            } else {
                return;
            }
            if (dir !== undefined && dir !== 'none' && dir !== 'fail') {
                targetRoom = changeRoom(roomName, dir, 6);
            }
            let flagName;
            //E20S42
            if (dir === 'w' || dir === 'e') {
                let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
                flagName = 'bandit' + parsed[3] + parsed[4];
            } else if (dir === 'n' || dir === 's') {
                let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
                flagName = 'bandit' + parsed[1] + parsed[2];
            }
            if (targetRoom !== undefined && Game.flags[flagName] === undefined) {
                if (Memory.observerTask.length === 0) {
                    let request = { order: "banditFlag", options: { room: targetRoom, name: flagName } };
                    Memory.observerTask.push(request);
                }
            }
        }


    }
}

function controllerCheck(target) {
    if (Game.rooms[target] === undefined) return false;
    if (Game.rooms[target].controller === undefined) return false;
    var controller = Game.rooms[target].controller;
    if (controller.owner !== undefined) {
        var fox = require('foxGlobals');
        if (!_.contains(fox.friends, controller.owner.username)) {
            //Memory.hostile_rooms = [];
            if (Memory.hostile_rooms === undefined || !_.isArray(Memory.hostile_rooms)) Memory.hostile_rooms = [];
            Memory.hostile_rooms.push(target);
            Memory.hostile_rooms = _.uniq(Memory.hostile_rooms);
            //            console.log('hostile room added to global hostile_rooms',target,controller.owner.username);
        }
    } else if (controller.owner === undefined) {
        let zze = _.indexOf(Memory.hostile_rooms, target);
        if (zze > 0) {
            Memory.hostile_rooms.splice(zze, 1);

        }
    }
}

function powerbankCheck(target) {
    //    if (Game.shard.name === 'shard2') return false;
    //    if (Game.shard.name === 'shard0') return false;
    if (Game.rooms[target] === undefined) return false;
    let powerRooms = getPowerRooms();

    if (!_.contains(powerRooms, target)) return false;
    let powerBank = Game.rooms[target].find(FIND_STRUCTURES);
    powerBank = _.filter(powerBank, function(s) {
        return s.structureType == STRUCTURE_POWER_BANK;
    });
    var string = 'LOOKING FOR PowerBank:' + powerBank.length;

    Game.rooms[target].visual.text(string, 25, 26, {
        color: '#10c3ba ',
        stroke: '#000000 ',
        strokeWidth: 0.123,
        font: 0.5
    });
    if (powerBank.length > 0) {
        let power = require('build.power');
        power.analyzePowerBank(powerBank[0], Game.rooms[target]);
        observers = getObservers();
        for (var oe in observers) {
            let stru = Game.getObjectById(observers[oe]);
            if (stru !== null)
                if (stru.observeRoom(target) === OK) {
                    break;
                }
        }

    }

}

function getObservers() {
    switch (Game.shard.name) {
        case 'shard0':
            return ['5a1b24d46ea97155dbbcfc78'];
        case 'shard1':
            return ['59aee0acae855116d42aaff7', '59c1d51712c6322c527647d1', '59b8299536dabe15ba6d1f99', '59a2fa6f51963d5833d4b53a'];
        case 'shard2':
            return ['5a41b5c16464bd403cbb6036'];
        case 'shard3':
            return ['5c192db4d03a2c54775874d7'];

    }
}

function getRandomRoom(room, max) {
    /*    if (Game.rooms[room].memory.randomN === undefined) {
            Game.rooms[room].memory.randomN = 0;
            ret = ulamSpiral(Game.rooms[room].memory.randomN);
        }
        ret = ulamSpiral(Game.rooms[room].memory.randomN); */

    let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(room);
    let _we = parsed[1];
    let _we_num = parsed[2];
    let _ns = parsed[3];
    let _ns_num = parsed[4];

    //    _we_num = ret.x;
    //    _ns_num = ret.y;
    _we_num = parseInt(_we_num) + Math.ceil(Math.random() * (2 * max)) - max;
    _ns_num = parseInt(_ns_num) + Math.ceil(Math.random() * (2 * max)) - max;
    if (_we_num < 0) {
        if (_we === 'W') {
            _we = 'E';
        } else {
            _we = 'W';
        }
        _we_num = (_we_num + 1) * -1;
    }
    if (_ns_num < 0) {
        if (_ns === 'N') {
            _ns = 'S';
        } else {
            _ns = 'N';
        }
        _ns_num = (_ns_num + 1) * -1;
    }

    Game.rooms[room].memory.randomN += 1;
    return _we + _we_num + _ns + _ns_num;
}

function getPowerRooms() {
    switch (Game.shard.name) {
        case 'shard1':
            return shard1PowerRooms;
        case 'shard0':
            return shard0PowerRooms;
        case 'shard2':
            return shard2PowerRooms;
        case 'shard3':
            return shard3PowerRooms;
        default:
            return [];
    }

}

class buildObserver {

    static reqestRoom(theroom, thetimed) {
        var request = { order: "observer", options: { room: theroom, timed: thetimed } };
        if (_.find(Memory.observerTask, function(o) {
                return o.options.room == theroom;
            })) {
            return false;
        }
        Memory.observerTask.push(request);
    }

    static runRoom2(roomName) {
        if (Memory.observerTask.length > 0) {

            if (newDoTask(roomName)) {
                return;
            }
        }
        if (Game.shard.name === 'shard0') {
            return;
        }
        let rooms = getPowerRooms();

        if (Game.time % 100 > 30) return;
        let room = Game.rooms[roomName];
        if (room === undefined) return;
        if (room.controller !== undefined && room.controller.level < 8) return;
        if (room.observer === undefined || room.observer === null) return;
        if (room.memory.observeNumber === undefined) {
            room.memory.observeNumber = 0;
        }
        if (room.memory.observeTarget === undefined) {
            if (rooms.length > 0) {
                room.memory.observeTarget = rooms[room.memory.observeNumber];
            }

        }
        if (Game.rooms[room.memory.observeTarget] === undefined) {
            room.observer.observeRoom(room.memory.observeTarget);
        } else {
            //            caravanCheck(room.memory.observeTarget);
            powerbankCheck(room.memory.observeTarget);

            //          controllerCheck(room.memory.observeTarget);

            room.memory.observeNumber++;
            if (room.memory.observeNumber > rooms.length - 1) room.memory.observeNumber = 0;
            if (rooms.length > 0) {
                room.memory.observeTarget = rooms[room.memory.observeNumber];
            }
            room.observer.observeRoom(room.memory.observeTarget);
        }
    }

    static runRoom(roomName) {

        if (Memory.observerTask.length > 0) {
            if (newDoTask(roomName)) {
                return;
            }
        }
        let observeRooms;
        switch (Game.shard.name) {
            case 'shard1':
                observeRooms = s1_obserRooms;
                break;
            case 'shard2':
                observeRooms = s2_obserRooms;
                break;
        }
        var roomsSeen = [];
        var lookFlag = Game.flags.look !== undefined;
        //        console.log('it shoulud run', Memory.observerTask.length, _.contains(observeRooms, roomName));
        //        for (let a in observeRooms) {
        if (_.contains(observeRooms, roomName)) {
            let room = Game.rooms[roomName];
            if (cachedRoomObserve === undefined) {
                cachedRoomObserve = {};
            }
            if (cachedRoomObserve[roomName] === undefined) {
                cachedRoomObserve[roomName] = _.clone(roomsObserve);
            }
            let doObserve = true;
            if (lookFlag) {
                if (room.observer !== undefined) {
                    let distance = Game.map.getRoomLinearDistance(room.name, Game.flags.look.pos.roomName);

                    if (distance <= 10) {
                        if (Game.flags.look.room !== undefined) {
                            //    console.log(Game.flags.look.room.name, 'found room w/ look flag', room.name);
                            caravanCheck(Game.flags.look.room.name);
                            powerbankCheck(Game.flags.look.room.name);
                        }
                        room.observer.observeRoom(Game.flags.look.pos.roomName);
                        //                        console.log(Game.flags.look.room, 'OB at look flag', room.name);
                        lookFlag = false;
                        doObserve = false;
                    }
                }
            }

            if (room.observer !== undefined && doObserve) {
                if (room.memory._observe === undefined) {
                    room.memory._observe = {
                        lookAt: Math.floor(Math.random() * cachedRoomObserve[roomName].length),
                    };
                }
                let mem = room.memory._observe;
                if (mem.lookAt < 0) mem.lookAt = 0;
                let target = cachedRoomObserve[roomName][mem.lookAt];
                //                    console.log(target,':',roomsSeen,_.contains(roomsSeen,target));
                if (room !== undefined && target !== undefined && !_.contains(roomsSeen, target)) {

                    let distance = Game.map.getRoomLinearDistance(room.name, target);
                    //                    room.visual.text('Ob:' + room.memory._observe.lookAt + "/" + cachedRoomObserve[roomName].length + ":" + cachedRoomObserve[roomName][room.memory._observe.lookAt] + "@" + distance, room.observer.pos.x, room.observer.pos.y);

                    if (distance <= 10) {
                        if (Game.rooms[target] === undefined && room.observer !== null) {
                            let zz = room.observer.observeRoom(target);
                            //                             console.log(room.name, 'observe room Undefined',Game.rooms[target],roomsObserve[mem.lookAt],mem.lookAt,'Try again', zz);
                        } else {
                            roomsSeen.push(target);
                            //                                 console.log(room.name, 'room Check', target);
                            caravanCheck(target);
                            powerbankCheck(target);
                            mem.lookAt++;
                            if (mem.lookAt >= cachedRoomObserve[roomName].length) mem.lookAt = 0;
                            while (Game.map.getRoomLinearDistance(room.name, cachedRoomObserve[roomName][mem.lookAt]) > 10) {
                                //                                mem.lookAt++;
                                cachedRoomObserve[roomName].splice(mem.lookAt, 1);
                                if (mem.lookAt >= cachedRoomObserve[roomName].length) mem.lookAt = 0;
                            }
                            if (room.observer !== null) {
                                room.observer.observeRoom(cachedRoomObserve[roomName][mem.lookAt]);
                            }

                        }
                    } else {
                        //                        console.log(room.name, 'Room to far', target);
                        cachedRoomObserve[roomName].splice(mem.lookAt, 1);
                        //                        mem.lookAt++;
                        if (mem.lookAt >= cachedRoomObserve[roomName].length) mem.lookAt = 0;
                        while (Game.map.getRoomLinearDistance(room.name, cachedRoomObserve[roomName][mem.lookAt]) > 10) {
                            cachedRoomObserve[roomName].splice(mem.lookAt, 1);
                            //                        mem.lookAt++;
                            if (mem.lookAt >= cachedRoomObserve[roomName].length) mem.lookAt = 0;
                        }
                        room.observer.observeRoom(cachedRoomObserve[roomName][mem.lookAt]);
                    }

                } else {
                    mem.lookAt += Math.floor(Math.random() * 5); // = 0;
                }

                if (mem.lookAt >= cachedRoomObserve[roomName].length) mem.lookAt = 0;

            }
        }

    }
}

module.exports = buildObserver;