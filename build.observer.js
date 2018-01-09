var s1_observers = ['59aee0acae855116d42aaff7', '59c1d51712c6322c527647d1', '59b8299536dabe15ba6d1f99', '59a2fa6f51963d5833d4b53a'];
var s0_observers = ['5a1b24d46ea97155dbbcfc78'];

var s1_obserRooms = ['E25S37', 'E17S45', 'E25S43', 'E18S36', 'E23S42'];
//'E32S70',
var roomsObserve = [
    'E20S40',
    'E29S40', 'E28S40', 'E27S40', 'E26S40', 'E25S40', 'E24S40', 'E23S40', 'E22S40', 'E21S40',
    'E20S30', 'E11S30', 'E12S30', 'E21S30', 'E29S30', 'E28S30', // North side
    'E20S31', 'E20S32', 'E20S33', 'E20S34', 'E20S35', 'E20S36', 'E20S37', 'E20S38', 'E20S39',
    'E30S40', 'E30S41', 'E30S42', 'E30S48', 'E30S49', 'E30S50', // East south
    'E11S40', 'E12S40', 'E13S40', 'E14S40', 'E15S40', 'E16S40', 'E17S40', 'E18S40', 'E19S40',
    'E20S50', 'E30S50', 'E21S50', 'E22S50', 'E28S50', 'E29S50', // South
    'E20S41', 'E20S42', 'E20S43', 'E20S44', 'E20S45', 'E20S46', 'E20S47', 'E20S48', 'E20S49',
    'E30S39', 'E30S38', 'E30S31', 'E30S32',
];
var powerRooms = [
    'E20S40',
    'E29S40', 'E28S40', 'E27S40', 'E26S40', 'E25S40', 'E24S40', 'E23S40', 'E22S40', 'E21S40',
    'E20S31', 'E20S32', 'E20S33', 'E20S34', 'E20S35', 'E20S36', 'E20S37', 'E20S38', 'E20S39',
    'E11S40', 'E12S40', 'E13S40', 'E14S40', 'E15S40', 'E16S40', 'E17S40', 'E18S40', 'E19S40',
    'E20S41', 'E20S42', 'E20S43', 'E20S44', 'E20S45', 'E20S46', 'E20S47', 'E20S48', 'E20S49',
];
/*

*/
var linksCache = [];

function getCached(id) {
    if (linksCache[id] === undefined) {
        linksCache[id] = Game.getObjectById(id);
    }
    return linksCache[id];
}

function doTask(tasks) {
    var target;
    if (tasks.length === 0) {
        return false;
    }
    let task = tasks[0];
    let options;
    var distance;
    var observers;
    var a, e;
    switch (task.order) {
        case "banditFlag":
            options = task.order.options;
            observers = Game.shard.name == 'shard0' ? s0_observers : s1_observers;
            for (a in observers) {
                let ob = getCached(observers[a]);
                for (e in task.options) {
                    if (e == 'room') target = task.options[e];
                }
                if (ob !== null) {
                    distance = Game.map.getRoomLinearDistance(ob.room.name, target);
                    console.log("Bandit check", roomLink(target), "distance:", distance, ob, "doing the task of", task.order);
                    if (distance <= 10) {

                        if (Game.rooms[target] !== undefined) {
                            var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT, backgroundColor: '#0F0F0F' };
                            Game.rooms[target].visual.text('LOOKING to place flag:' + Game.flags.bandit, 25, 25, font);
                            if (Game.flags.bandit === undefined) {
                                var bca = new RoomPosition(20, 25, target);
                                var zzz = Game.rooms[target].createFlag(bca, 'bandit', COLOR_YELLOW, COLOR_YELLOW);
                                console.log(zzz, 'Flag has been placed?');
                            }
                        }

                        if (ob.observeRoom(target) == OK) {
                            if (Game.flags.bandit !== undefined) {
                                tasks.shift();
                                return;
                            }
                        }

                    }
                }
            }

            break;
        case "observer":
            options = task.order.options;
            observers = Game.shard.name == 'shard0' ? s0_observers : s1_observers;
            for (a in observers) {
                let ob = getCached(observers[a]);
                for (e in task.options) {
                    if (e == 'room') target = task.options[e];
                }
                if (ob !== null) {
                    distance = Game.map.getRoomLinearDistance(ob.room.name, target);
                    //           console.log(roomLink(target),"distance:",distance,ob,"doing the task of",task.order,"for "+task.options.timed+ "longer");
                    if (distance <= 10) {
                        if (ob.observeRoom(target) == OK) {
                            task.options.timed--;
                            if (task.options.timed === 0) {
                                tasks.shift();
                            }
                            return;
                        }
                    } else {
                        task.options.timed--;
                        if (task.options.timed === 0) {
                            tasks.shift();
                        }
                    }
                }
            }

            break;
        case "observerFlag":
            tasks.shift();
            options = task.order.options;
            observers = Game.shard.name == 'shard0' ? s0_observers : s1_observers;
            for (var zz in observers) {
                let ob = getCached(observers[zz]);
                for (var ee in task.options) {
                    if (ee == 'room') target = task.options[ee];
                }
                if (ob !== null) {
                    if (Game.rooms[target] !== undefined) {
                        // Place flag here.
                        console.log('does it every come here danit.');
                        Game.rooms[target].createFlag(25, 25, 'caravan');
                        break;
                    }

                    var distance2 = Game.map.getRoomLinearDistance(ob.room.name, target);
                    console.log(roomLink(target), "distance:", distance2, ob, "doing the task of", task.order, "for " + task.options.timed + "longer");
                    if (distance2 <= 10) {
                        if (ob.observeRoom(target) == OK) {
                            task.options.timed--;
                            if (task.options.timed === 0) {
                                tasks.shift();
                            }
                            return;
                        }
                    } else {
                        task.options.timed--;
                        if (task.options.timed === 0) {
                            tasks.shift();
                        }
                    }
                }
            }
            break;

    }
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
    if (Game.rooms[target] === undefined) return false;
    let screeps = Game.rooms[target].find(FIND_CREEPS);
    let caravan = _.filter(screeps, function(s) {
        return s.owner.username == 'Screeps';
    });
    var targetRoom;
    var string = target + " " + 'LOOKING FOR Screeps:' + " " + caravan.length + " " + screeps.length;
    //console.log(string);
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

        if (caravan[0].ticksToLive < 1350    ) {
            let roomName = caravan[0].pos.roomName;
            var two = parseInt(roomName[2]);
            var five = parseInt(roomName[5]);

            if (two === 0 && five === 0  && caravan[0].ticksToLive < 1000  && caravan[0].ticksToLive > 700) {
                dir = 'none';
            } else if (two === 1 || two === 2 && caravan[0].ticksToLive > 1000) {
                dir = 'e';
            } else if (two === 9 || two === 8 && caravan[0].ticksToLive > 1000) {
                dir = 'w';
            } else if (five === 1 || five === 2 && caravan[0].ticksToLive > 1000) {
                dir = 'n';

            } else if (five === 9 || five === 8 && caravan[0].ticksToLive > 1000) {
                dir = 's';
            } else {
                dir = 'fail';
            }
            if (dir !== undefined && dir !== 'none' && dir !== 'fail') {
                targetRoom = changeRoom(roomName, dir, 6);
            }

        }
        if (dir === undefined) {
            console.log(dir, 'OLD FOUND CARAVAN: ', caravan[0].ticksToLive, caravan.length, roomLink(target), 'Estimated Interecpt room', targetRoom);
        } else if (dir === 'fail') {
            console.log(dir, 'BUGGED FOUND CARAVAN: ', caravan[0].ticksToLive, caravan.length, roomLink(target), 'Estimated Interecpt room', targetRoom);
        } else {
            console.log(dir, 'FOUND CARAVAN: ', caravan[0].ticksToLive, caravan.length, roomLink(target), 'Estimated Interecpt room', targetRoom);
        }
        if (dir !== undefined && dir === 'none') {
            caravan[0].room.createFlag(25, 25, 'bandit', COLOR_YELLOW, COLOR_YELLOW);
            if (Memory.observerTask.length === 0) {
                let request = { order: "banditFlag", options: { room: target } };
                Memory.observerTask.push(request);
            }
        } else if (Game.flags.bandit === undefined && targetRoom !== undefined) {
            if (Memory.observerTask.length === 0) {
                let request = { order: "banditFlag", options: { room: targetRoom } };
                Memory.observerTask.push(request);
            }
        }

    }
}

function powerbankCheck(target) {
    if (Game.rooms[target] === undefined) return false;
    //    console.log(roomLink( target ),'is target in power room',_.contains(powerRooms,target));
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
        let power = require('commands.toPower');

        power.analyzePowerBank(powerBank[0], Game.rooms[target]);
        observers = Game.shard.name == 'shard0' ? s0_observers : s1_observers;
        for (var oe in observers) {
            let stru = getCached(observers[oe]);
            if (stru !== null)
                stru.observeRoom(target);
        }

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

    static doRoom(theroom) {
        var observers = Game.shard.name == 'shard0' ? s0_observers : s1_observers;
        for (var e in observers) {
            let stru = getCached(observers[e]);
            stru.observeRoom(theroom);
        }
    }

    static run() {
        if (Memory.observerNum === undefined) {
            Memory.observerNum = 0;
        }
        if (Memory.observerTask === undefined) {
            Memory.observerTask = [];
        }

        let observeRooms;
        switch (Game.shard.name) {
            case 'shard1':
                observeRooms = s1_obserRooms;
                break;
        }
        var roomsSeen = [];
        var lookFlag = Game.flags.look !== undefined;

        for (let a in observeRooms) {
            let room = Game.rooms[observeRooms[a]];
            let doObserve = true;
            if (lookFlag) {
                if (room.observer !== undefined) {
                    let distance = Game.map.getRoomLinearDistance(room.name, Game.flags.look.pos.roomName);

                    if (distance <= 10) {
                        if (Game.flags.look.room !== undefined) {
                            console.log(Game.flags.look.room.name, 'found room w/ look flag', room.name);
                            caravanCheck(Game.flags.look.room.name);
                            powerbankCheck(Game.flags.look.room.name);

                        }
                        room.observer.observeRoom(Game.flags.look.pos.roomName);
                        console.log(Game.flags.look.room, 'OB at look flag', room.name);
                        lookFlag = false;
                        doObserve = false;
                    }
                }
            }
            if (room.observer !== undefined && doObserve) {
                if (room.memory._observe === undefined) {
                    room.memory._observe = {
                        lookAt: Math.floor(Math.random() * roomsObserve.length),
                    };
                }
                let mem = room.memory._observe;
                if (mem.lookAt < 0) mem.lookAt = 0;
                let target = roomsObserve[mem.lookAt];
                //                    console.log(target,':',roomsSeen,_.contains(roomsSeen,target));
                if (room !== undefined && target !== undefined && !_.contains(roomsSeen, target)) {
                    let distance = Game.map.getRoomLinearDistance(room.name, target);
                    if (distance <= 10) {
                        if (Game.rooms[target] === undefined) {
                            let zz = room.observer.observeRoom(target);
                            //   console.log(room.name, 'observe room Undefined',Game.rooms[target],roomsObserve[mem.lookAt],mem.lookAt,'Try again', zz);
                        } else {
                            roomsSeen.push(target);
                            //     console.log(room.name, 'room Check', target);
                            caravanCheck(target);
                            powerbankCheck(target);
                            mem.lookAt++;
                            if (mem.lookAt >= roomsObserve.length) mem.lookAt = 0;

                            if (Game.map.getRoomLinearDistance(room.name, roomsObserve[mem.lookAt]) <= 10) {
                                room.observer.observeRoom(roomsObserve[mem.lookAt]);
                            } else {
                                mem.lookAt++;
                            }

                        }
                    } else {
                        //   console.log(room.name, 'Room to far', target);
                        mem.lookAt++;
                        if (mem.lookAt >= roomsObserve.length) mem.lookAt = 0;
                        if (Game.map.getRoomLinearDistance(room.name, roomsObserve[mem.lookAt]) <= 10) {
                            room.observer.observeRoom(roomsObserve[mem.lookAt]);
                        } else {
                            mem.lookAt++;
                        }
                    }
                } else {
                    mem.lookAt += Math.floor(Math.random() * 5); // = 0;
                }

                if (mem.lookAt >= roomsObserve.length) mem.lookAt = 0;

            }
        }

        /*        if (Memory.observerTask.length === 0) {
                    var request = { order: "banditFlag", options: { room: 'E20S37' } };
                    Memory.observerTask.push(request);
                    //    return false;
                }*/

        if (Memory.observerTask.length > 0) {
            doTask(Memory.observerTask);
            return;
        }
    }


}

module.exports = buildObserver;

// 11,14 E25S74 Game.flags.bandit.pos