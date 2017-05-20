// Designed to kill sourcekeepers - lvl is high for this guy. 
// needed for this is :     4.140K

// only 1 level and 
var classLevels = 
[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,
ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL,HEAL,HEAL,HEAL];
var boost = [RESOURCE_LEMERGIUM_OXIDE,'KO'];
/*
warinternal [4:18 PM] 
@likeafox they can't attack and heal, but they can ranged, heal, and move at the same time
*/
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var attack = require('commands.toAttack');
var flags = require('build.flags');

function getPartyFlag(creep) {
	for(var e in Game.flags) {
		if(Game.flags[e].name == creep.memory.party) {
			return Game.flags[e];
		}
	}
}
function getHostiles(creep) {
    let range = 4;
    if(creep.room.name == 'E34S84') range = 6 ;   
    if(creep.room.name == 'E25S74'||creep.room.name == 'E24S74'||creep.room.name == 'E35S74') {
        range = 8 ;   
    }
    if(creep.room.name == 'E24S75' || creep.room.name == 'E26S76') {
        range = 10;
    }

    return creep.pos.findInRange(creep.room.hostilesHere(),range);


    range = 4;
    if(creep.room.name == 'E34S84') range = 6 ;   
    if(creep.room.name == 'E25S74'||creep.room.name == 'E24S74'||creep.room.name == 'E35S74') {
        range = 8 ;   
    }
    if(creep.room.name == 'E24S75' || creep.room.name == 'E26S76') {
        range = 10;
    }
    if(creep.memory.hostileID == undefined || creep.memory.hostileID.length == 0) {
    let zz = creep.room.hostilesHere();
    creep.memory.hostileID = [];
    for(var e in zz) {
        creep.memory.hostileID.push(zz[e].id)
    }

    return creep.pos.findInRange(zz,range);
    } else {
            let badGuys =[];
        for(var e in creep.memory.hostileID){
            let bad = Game.getObjectById(creep.memory.hostileID[e]);
            if(bad == undefined) {
                creep.memory.hostileID.splice(e,1);
            } else {
                badGuys.push(bad);
            }
        }
        return creep.pos.findInRange(badGuys,range);
    }
}

function attackCreep(creep,bads){
	  if(bads.length == 0)  { 
        creep.memory.needed = undefined;
        return true;
        }

            let enemy = creep.pos.findClosestByRange(bads);
            let distance = creep.pos.getRangeTo(enemy);
      creep.say('attk'+distance);

            if(creep.pos.isNearTo(enemy)) {
                creep.memory.walkingTo = undefined;
if(enemy.owner.username != 'Source Keeper' || enemy.hits <= 100 ){
                creep.attack(enemy);
                creep.rangedMassAttack();
} else {
    creep.selfHeal();
}
            } else if ( distance < 4){

                var targets = creep.pos.findInRange(bads, 3)

                // Ranged attack.
                if(targets.length > 2) {
if(enemy.owner.username != 'Source Keeper'){
    creep.rangedMassAttack();
} else {
    creep.selfHeal();
}
    
                } else {
if(enemy.owner.username != 'Source Keeper')                    {
                creep.rangedAttack(enemy);    
            }else {
 creep.selfHeal();               
            }
    
                }
                // Heal
                creep.selfHeal();
                // Move
                creep.moveTo(enemy,{ignoreRoads:true});
            } else if ( distance >= 4 ) {
                creep.selfHeal();
                creep.moveTo(enemy,{ignoreRoads:true});
            }
}

function analyzeSourceKeeper(creep) {
    
    let keepers = creep.memory.keeperLair;
    let targetID;
    let lowest = 300;

if(creep.memory.mineralRoomID == undefined) {
        let tempinz = creep.room.find(FIND_MINERALS);
        creep.memory.mineralRoomID = tempinz[0].id;
    }  
 let tempin = Game.getObjectById( creep.memory.mineralRoomID);

    for(var e in keepers) {
        let keeperTarget = Game.getObjectById(keepers[e].id);
//        let lair = Game.getObjectById(  creep.memory.keeperLair[creep.memory.goTo].id)
//        console.log(keeperTarget,keepers[e].id,keeperTarget.ticksToSpawn,e,lowest,":",targetID);
    if(tempin.pos.inRangeTo(keeperTarget,10)&&creep.room.name != "E26S76" &&creep.room.name != "E25S76"  ){
        if(creep.room.name != "E35S84"){
        if(tempin.mineralAmount != 0){
        if(keeperTarget.ticksToSpawn == undefined) {
            targetID = e;
            break;
            //Winner
        } else if( keeperTarget.ticksToSpawn < lowest) {
            lowest = keeperTarget.ticksToSpawn;
            targetID = e;
        } 
        }
            
        }
    }else {
        if(keeperTarget.ticksToSpawn == undefined) {
            targetID = e;
            break;
            //Winner
        } else if( keeperTarget.ticksToSpawn < lowest) {
            lowest = keeperTarget.ticksToSpawn;
            targetID = e;
        } 

    }

    
    }

//let keeperTarget = Game.getObjectById(keepers[targetID].id);
//    console.log ('winner of the anazlying is',targetID,creep.room.name,creep.name,keeperTarget.pos);
    return targetID;
}

function moveCreep(creep) {
    if(creep.memory.goTo == undefined) {
     creep.memory.goTo =      analyzeSourceKeeper(creep);
    }

    let gota = Game.getObjectById( creep.memory.keeperLair[creep.memory.goTo].id )
    let inRange = creep.pos.getRangeTo(gota);
    if(inRange < 4 && gota.ticksToSpawn > 200 ) {
        creep.say('dif',true);
     creep.memory.goTo =      analyzeSourceKeeper(creep);
    }

let rmPos = new RoomPosition(creep.memory.keeperLair[creep.memory.goTo].pos.x,creep.memory.keeperLair[creep.memory.goTo].pos.y,creep.memory.keeperLair[creep.memory.goTo].pos.roomName);
if(!creep.pos.isNearTo (gota))
   creep.moveMe(rmPos,{reusePath:7,ignoreRoads: true,visualizePathStyle: {
    fill: 'transparent',
    stroke: '#bf0',
    lineStyle: 'dashed',
    strokeWidth: .15,
    opacity: .5}});

}


class roleGuard extends roleParent{
    static levels(level) {
        return classLevels;
    }

    static run(creep) {
        super.calcuateStats(creep);
        if(super.doTask(creep)) {return;}
        
//      creep.say(creep.room.controller.owner.username );

        if (super.returnEnergy(creep)) {
            return;
        }
        super.rebirth(creep);
    	//if(!super.run(creep)) return;
//    	creep.say('guard');
// if less than 300 and doesn't see invader then set to false. 
if(creep.ticksToLive < 300 && creep.memory.invaderStatus == undefined) {
    creep.memory.invaderStatus = true;
    creep.memory.seeInvader = false;
}


        // If the creep did not see invader then boost
//        if(creep.memory.seeInvader != undefined && !creep.memory.seeInvader){
            if(super.boosted(creep,boost)) { return;}
//        }


        if(creep.memory.goalPos == undefined) {
            for(var e in Game.flags) {
                if(Game.flags[e].color == COLOR_BLUE && Game.flags[e].name == creep.memory.party) {
                 creep.memory.goalPos = Game.flags[e].pos;
                }
            }
        }

        if(creep.memory.keeperLair) {

        	 let bads = getHostiles(creep);

            if(bads.length > 0 ) {
if(creep.hits < 400) {
    creep.say('bads');
creep.selfHeal();

} else {
            attackCreep(creep,bads);
}

          
	        }else {
                creep.selfHeal();
                 if(!movement.moveToDefendFlag(creep))                 {
        	           moveCreep(creep);
                 } else { // So if it has to move to a defend flag - it's seen an invader in the room.
                    if(creep.memory.goTo != undefined)
                        creep.memory.goTo = undefined;
                 }
        	}
        }else if(creep.room.name != creep.memory.goalPos.roomName) {
             let bads = getHostiles(creep);
            if(bads.length > 0 ) {
                attackCreep(creep,bads);
                return;
            }else {
                creep.selfHeal();
                movement.guardFlagMove(creep);
            }
            if(creep.memory.distance == undefined) {
                creep.memory.distance = 0;
            }
            creep.memory.distance++;

        } else {
            if(creep.memory.keeperLair == undefined) {
                
                    creep.memory.keeperLair = creep.room.find(FIND_STRUCTURES, {filter: {structureType: STRUCTURE_KEEPER_LAIR}});
                    creep.memory.goTo =  analyzeSourceKeeper(creep);
                
            }
        	 moveCreep(creep);
        }

    }


}
module.exports = roleGuard;
