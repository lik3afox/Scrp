//

var classLevels = [
    [ CARRY, MOVE],

    [CARRY, CARRY,CARRY, CARRY, MOVE, MOVE],

    [CARRY, CARRY,CARRY, CARRY, MOVE, MOVE,CARRY, CARRY,CARRY, CARRY, MOVE, MOVE],
// 500
[CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE],
// 600
[CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE],

// 1000
[CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE,
CARRY,CARRY,MOVE]
    //[MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY],
//    [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY] // 50/3750

];

var groupOne = [
'58b4b98952bcc31f7967fb57', //E29S79
'58b765651d11996760a39d15', //E28S77
'58af2ceb751600062cd0c58d', // Spawn 1
'58aff827090180496c7848fb', // Spawn 3
'58b11106554d4c1333aed29b', // spawn 4
'58af4822278c0725a7ad4642', // spawn 2
'58c074ead62936ed5e2bce0b', // E27S75
'58fae20240468f2a39d50830', // E38S72
'58d97b7b8c94aa185ccaf659', //E35S83
'58f793ad1f64b8d842dc0c16', // E37S75
'58dc1eb90c1c7697092ce5c2',  // E35S73
'59090e6f771e5d03793d20b4' // W4S93
//,'58c074ead62936ed5e2bce0b' // E27S75
];

var groupTwo = [
];

var roleParent = require('role.parent');
var labsBuild = require('build.labs');
/*
function mineMineralsToTerminal(creep) {

    	if(creep.memory.mineralID == undefined) {
    		let vr = creep.room.find(FIND_MINERALS);
    		creep.memory.mineralID  = vr[0].id;

    	} 
		let min = Game.getObjectById(creep.memory.mineralID);
        if(min.mineralAmount == 0) return false;

		if(min.mineralAmount > 0 ) {
                var minz = creep.room.lookAt(min);
                let cdNeed;
                for(var i in minz) {
                    if(minz[i].type == 'structure') {
                        cdNeed = minz[i].structure.cooldown;
                        break;
                    }
                }

//console.log('sci',cdNeed,creep.pos);
//
            if(cdNeed == 0 && creep.pos.isNearTo(min)) {
                if(creep.memory.extractID == undefined) {
//                    let extract = creep.room.find(FIND_STRUCTURES,{filter: {structureType: STRUCTURE_EXTRACTOR}});
                }
                creep.harvest(min)
            } else {

                creep.moveTo(min);

            }
		    return true;

    } 
	return false;
}
*/

function mineralContainerEmpty(creep){
if(creep.memory.containsGood) return false;
    let contains = creep.room.find(FIND_STRUCTURES);
    contains = _.filter(contains,function(o){return o.structureType == STRUCTURE_CONTAINER;});
    for(var e in contains){
        for(var a in contains[e].store) {
            if(a != RESOURCE_ENERGY && contains[e].store[a] > creep.stats.carry) {
    //            console.log(contains[e])
                if(creep.pos.isNearTo(contains[e])){
                    creep.withdraw(contains[e],a);
                }else {
                    creep.moveMe(contains[e],{reusePath:15});
                    return true;
                }
            }
        }
    }
}
function getPlan(lab) {
    var theplans = labsBuild.getPlans(lab.room.name);
    for (var i in theplans) {
        if (lab.id == theplans[i].id) {
            return theplans[i];
        }
    }
}

function getGroup(creep){
    let id = creep.id;
//console.log( _.includes(groupOne,id),groupOne ,id);
//    if(_.includes(groupOne,id) )
        return groupOne;
//    if(_.includes(groupTwo,id) )
//        return groupTwo;

//    return groupOne;
}

function changeParent(creep) {
    if( creep.memory.changedParent ) {
        if(creep.ticksToLive < 50){
            creep.suicide();
            return;
        } else if(_.sum(creep.carry) === 0) {
            creep.suicide();
        	return;
        } else {
        	return;
        }
    }

    let spawnGroup = getGroup(creep);

    if(creep.memory.scientistID === undefined ) {         creep.memory.scientistID = 2;    }
	if (creep.ticksToLive > (3*creep.body.length)+creep.memory.distance ) return false;

    creep.memory.scientistID++;

let zz = Game.getObjectById( spawnGroup[creep.memory.scientistID] );
//console.log(zz)
if(zz !== null && zz.room.name == 'E27S75') {
    if(zz === null || zz.room.controller.level === null || zz.room.controller.level < 7 ) creep.memory.scientistID++;
}else {
    if(zz === null || zz.room.controller.level === null || zz.room.controller.level < 6 ) creep.memory.scientistID++;
}

    if(creep.memory.scientistID > spawnGroup.length-1) creep.memory.scientistID = 0;

    creep.memory.parent = spawnGroup[creep.memory.scientistID];
    creep.memory.changedParent = true;
    
    let spawnsDo = require('build.spawn');
    spawnsDo.reportDeath(creep);
    creep.memory.changedParent = true;
    if(_.sum(creep.carry) === 0) {
            creep.suicide();
        }
}

function labNeedReducing(creep){
    var theplans = labsBuild.getPlans(creep.room.name);
    for(var e in theplans) {
        let lab = Game.getObjectById(theplans[e].id);
        if(theplans[e].emptied && lab.room.name == creep.room.name) {
            if(lab.mineralAmount > 601) {
                if(creep.pos.isNearTo(lab)) {
                    creep.withdraw(lab,lab.mineralType);
                    return true;
                }else {
                    creep.moveMe(lab.pos);
                    return true;
                }
            }
        }
    }
    return false;
}

class scientistRole extends roleParent {
    static levels(level) {
    if (level > classLevels.length-1 ) 
      level = classLevels.length-1;
        
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        if(super.doTask(creep)) {return;}
        
        if (super.returnEnergy(creep)) {
            return;
        }

if(creep.memory.distance === undefined)        creep.memory.distance = 0;
//        super.rebirth(creep);
//        if(Game.cpu.bucket < 3000 && creep.room.name !='E26S73') return;
        
        if (super.returnEnergy(creep)) {
            return;
        }

        changeParent(creep);
        if(creep.saying == 'raiders') {
            creep.memory.distance+=40;
            creep.say('suck',true);
            return;
        }
        if(creep.saying == 'suck') {
            creep.memory.distance+=35;
            creep.say('balls',true);
            return;
        } 
        creep.say('sci');

        var total = _.sum(creep.carry);
        if (total === 0) {
            creep.memory.putaway = false;
        }
        if(total > 0 ) {
            creep.memory.putaway = true;   
        }

        if (creep.memory.putaway) {
            if(!labsBuild.moveToTransfer(creep) ) {
                labsBuild.transferToTerminal(creep);
            }
        } else  {
        var _labs = labsBuild.getLabs(creep);

            if(_labs.length > 0 && _.sum(creep.carry) === 0  ) { // If there are labs. 
            for (var i in _labs) { // go through them
                 var plan = getPlan(_labs[i]); // get the plans

                if (   ( plan.resource != _labs[i].mineralType)&&(_labs[i].mineralAmount > 0)) {
                    if(creep.pos.isNearTo(_labs[i]) ) {
                        // need to check if the lab has mineral type wanted.
                        if( creep.withdraw(_labs[i], _labs[i].mineralType) == OK) {
                            creep.memory.putaway = true;
                        }
                    } else {
                        creep.moveMe(_labs[i]);
                    }
                    return;
                }
            }

                if(!labsBuild.getFromTerminal(creep)) {
                              
                    let otherThings = false; 
                    for(var e in creep.room.storage.store) {
                        if(e != RESOURCE_ENERGY && creep.room.storage.store[e]) {
                            otherThings = true;
                            if(creep.pos.isNearTo(creep.room.storage)) {
                              creep.withdraw(creep.room.storage,e);  
                            } else {
                                creep.moveMe(creep.room.storage);
                            }
                        }
                    } 
                    if(!otherThings) {

                    if(!mineralContainerEmpty(creep))
                       if(! labNeedReducing(creep) )
                       	if(!creep.pos.isNearTo(creep.room.terminal)) {
                          creep.moveMe(creep.room.terminal);  
                          
                       	} else {

                       	creep.say('raiders',true);	
                       	creep.memory.distance++;
//                       	doDeath(creep);

                       	}
                    } 
                    
                    }

            }  
            
//            creep.moveTo(creep.room.terminal);
            

        }


        //creep.moveTo(creep.room.terminal);
    }
}

module.exports = scientistRole;