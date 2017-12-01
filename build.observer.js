var observers = ['59aee0acae855116d42aaff7','59c1d51712c6322c527647d1','59b8299536dabe15ba6d1f99','59a2fa6f51963d5833d4b53a'];
//'E32S70',
var roomsObserve = [
'E20S40',
'E29S40','E28S40','E27S40','E26S40','E25S40','E24S40','E23S40','E22S40','E21S40',
'E20S31','E20S32','E20S33','E20S34','E20S35','E20S36','E20S37','E20S38','E20S39',
'E11S40','E12S40','E13S40','E14S40','E15S40','E16S40','E17S40','E18S40','E19S40',
'E20S41','E20S42','E20S43','E20S44','E20S45','E20S46','E20S47','E20S48','E20S49',
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
    if (tasks.length === 0) return false;
    let task = tasks[0];
    let options ;
    switch (task.order) {
        case "observer":
             options = task.order.options;
            for (var a in observers) {
                let ob = getCached(observers[a]);
                for (var e in task.options) {
                    if (e == 'room') target = task.options[e];
                }
                if (ob !== null) {
                    var distance = Game.map.getRoomLinearDistance(ob.room.name, target);
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
             
            for (var zz in observers) {
                let ob = getCached(observers[zz]);
                for (var ee in task.options) {
                    if (ee == 'room') target = task.options[ee];
                }
                if (ob !== null) {
                        if(Game.rooms[target] !== undefined) {
                            // Place flag here.
                            console.log('does it every come here danit.');
                            Game.rooms[target].createFlag( 25,25,'caravan');
                            break;
                        }

                    var distance2 = Game.map.getRoomLinearDistance(ob.room.name, target);
                           console.log(roomLink(target),"distance:",distance2,ob,"doing the task of",task.order,"for "+task.options.timed+ "longer");
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
   function changeRoom(roomName,direction,amount){
    var east = parseInt(roomName[1]+roomName[2]);
    var north = parseInt(roomName[4]+roomName[5]);
        if(amount === undefined) amount = 3;

        switch(direction) {
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
            west += amount;
            break;
            case "e":
            case "east":
            east += amount;
            break;
        }
        let rtn = roomName[0]+east+roomName[3]+north;
        return rtn;
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
        if (Memory.observerTask.length > 0) {
            doTask(Memory.observerTask);
            return;
        }

        if (Memory.observerNum > roomsObserve.length - 1) Memory.observerNum = 0;
        let target = roomsObserve[Memory.observerNum];

//        console.log(Memory.observerNum,roomsObserve.length,"Observering room:",target,"seeing:",Game.rooms[target],'|Tasks:'+Memory.observerTask.length);

        if (Game.rooms[target] === undefined) {
            // Then we observer
            for (var e in observers) {
                let stru = getCached(observers[e]);
                if(stru !== undefined) {
                var distance = Game.map.getRoomLinearDistance(stru.room.name, target);
                if (distance <= 10) {
                    stru.observeRoom(target);
                }
                }
            }
        } else {

            let screeps = Game.rooms[target].find(FIND_CREEPS);
            screeps = _.filter(screeps, function(s) {
                return s.owner.username == 'Screeps';
            });
                    var targetRoom;
        //console.log('LOOKING FOR Screeps:',screeps.length);
            if(screeps.length > 0){
                let direction;
                let troom = Game.rooms[target];
var dir;
if(screeps[0].ticksToLive > 1300) {
    let roomName = screeps[0].pos.roomName;
    if(roomName[2] === 1 ||roomName[2] === 1 ){
        dir = 'e';
    } else if(roomName[2] === 9 ||roomName[2] === 8){
        dir = 'w';
    } else if(roomName[5] === 1 ||roomName[5] === 2){
        dir = 'n';

    } else if(roomName[5] === 9 ||roomName[5] === 8){
        dir = 's';
    } 
    targetRoom = changeRoom(roomName,dir,5);
}


                console.log('FOUND CARAVAN: ',screeps.length,roomLink(target),'Estimated Interecpt room',targetRoom);
if(Game.flags.bandit === undefined) {
 //Game.rooms[target].createFlag(25, 25, 'bandit',COLOR_GREEN,COLOR_GREEN);
}

            }

            let powerBank = Game.rooms[target].find(FIND_STRUCTURES);
            powerBank = _.filter(powerBank, function(s) {
                return s.structureType == STRUCTURE_POWER_BANK;
            });
            if (powerBank.length > 0) {
                let power = require('commands.toPower');

                power.analyzePowerBank(powerBank[0], Game.rooms[target]);

                for (var oe in observers) {
                    let stru = getCached(observers[oe]);
                    if(stru !== null)
                        stru.observeRoom(target);
                }

            }
            Memory.observerNum = Memory.observerNum + 1;

        }


        // Then we analyze

    }


}

module.exports = buildObserver;

// 11,14 E25S74
