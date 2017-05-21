var observers = ['58b720b29b2a356930fd3438','58ecd1142353c5da3b415c92','58e886be32d51ba206139da7'];

var roomsObserve = ['E30S80','E30S70','E31S70','E29S70','E30S71','E30S69',
                             'E32S70','E28S70','E30S72','E30S68','E27S70','E26S70','E25S70',
                             'E30S73','E30S74','E30S75','E30S76','E30S77',
                   'E31S80','E29S80','E30S81','E30S79','E27S80','E26S80'
                            ,'E32S80','E33S80','E28S80','E30S82','E30S83','E30S78','E36S80','E35S80','E34S80','E33S80',
                            'E36S70','E37S70','E38S70','E39S70','E40S70','E41S70','E42S70',
                            'E40S68','E40S69','E40S71','E40S72','E40S73','E40S74'

                            ];

function doTask(tasks) {
    var target;
    if(tasks.length === 0) return false;
    let task = tasks[0];
    switch(task.order) {
        case "observer":
            let options = task.order.options;
        for(var a in observers) {
        let ob = Game.getObjectById( observers[a] );
        for(var e in task.options) {
            if(e == 'room') target = task.options[e];
        }
        var distance = Game.map.getRoomLinearDistance(ob.room.name, target);
//        console.log(target,"distance:",distance,ob,"doing the task of",task.order,"for "+task.options.timed+ "longer")
	        if(distance <= 10) {
    	        if( ob.observeRoom(target) == OK) {
        	        task.options.timed--;
            	    if(task.options.timed === 0) {
                	    tasks.shift();
	                }
    	            return;
        	    }
        	} else {
        		    task.options.timed--;
            	    if(task.options.timed === 0) {
                	    tasks.shift();
	                }
        	}
        }

        break;
    }
}

class buildObserver {

    static reqestRoom(theroom,thetimed) {
        var request = {order:"observer", options:{room: theroom, timed:thetimed}};
        if( _.find(Memory.observerTask, function(o) { return o.options.room == theroom; }) ) {
            return false;
        }
        Memory.observerTask.push(request);
    }

    static doRoom(theroom) {
            for(var e in observers) {
                let stru = Game.getObjectById(  observers[e] );
                stru.observeRoom(theroom);
            }
        } 

    static run() {
    	if(Memory.observerNum === undefined) {
    		Memory.observerNum = 0;
    	}
        if(Memory.observerTask === undefined) {
            Memory.observerTask = [];
        }        
        if(Memory.observerTask.length > 0) {
            doTask(Memory.observerTask);
            return;
        }
//        console.log(Memory.observerNum, roomsObserve[Memory.observerNum], Game.rooms[roomsObserve[Memory.observerNum]]);
        if( Memory.observerNum > roomsObserve.length -1) Memory.observerNum = 0;
        let target =  roomsObserve[Memory.observerNum];

//        console.log(Memory.observerNum,roomsObserve.length,"Observering room:",target,"seeing:",Game.rooms[target],'|Tasks:'+Memory.observerTask.length);

        if(Game.rooms[target] === undefined) {
            // Then we observer
            for(var e in observers) {
                let stru = Game.getObjectById(  observers[e] );
                var distance = Game.map.getRoomLinearDistance(stru.room.name, target);
                if(distance <= 10) {
                    stru.observeRoom(target);
                }
            }
        } else {
            let powerBank = Game.rooms[target].find(FIND_STRUCTURES,{filter: s => s.structureType == STRUCTURE_POWER_BANK} );
            if(powerBank.length > 0 ) {
                let power = require('commands.toPower');
                power.analyzePowerBank(powerBank[0],Game.rooms[target]);

            for(var o in observers) {
                let stru = Game.getObjectById(  observers[o] );
                    stru.observeRoom(target);
            }

            }
            Memory.observerNum = Memory.observerNum  + 1;

        }


    		// Then we analyze

    	}
        
    
}

module.exports = buildObserver;

// 11,14 E25S74