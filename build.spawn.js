// Modules [name,  role.type,   # of them,  Level wanted]
// All modules
// Add your modules here if they want to be counted and kept track of.

// This module is where the require counts and what really determines the behavior.
// The role (1) here will be linked to the require run.
var allModule = [
    ['scientist',require('role.scientist')],
    ['minHarvest', require('role.mineral')],
    ['mineral',require('keeper.scientist')],
    ['guard',require('keeper.guard')],
    ['engineer',require('army.engineer')],
    ['recontroller', require('army.recontroller')],
    ['repairer', require('role.repairer')],
    ['builder',require('role.builder')],
    ['roadbuilder', require('role.roadbuilder')], // Pick up/harvest to build. 
    ['fighter',     require('army.fighter')],
    ['boss',        require('role.constructionBoss')],
    ['first',       require('role.first')], // Should never have more firsts than containers...maybe..mmmm
    ['harvester',   require('role.harvester')],
    ['upbuilder',    require('role.upbuilder')],
    ['scout',  require('army.scout')],
    ['homeDefender',    require('role.defender2')],
    ['controller',  require('role.controller')],
    ['linker',      require('role.linker')],
    ['xtransport', require('role.xtransport')], // Harvester - experiemnt w/o carry
    ['ytransport', require('role.ytransport')], // Harvester - experiemnt w/o carry
    ['ztransport', require('role.ztransport')], // Harvester - experiemnt w/o carry
    ['rtransport', require('role.rtransport')], // Harvester - experiemnt w/o carry
    ['upgrader',require('role.upgrader')],
    ['ranger', require('army.ranger')],
    ['miner',       require('role.miner')], // Harvester - experiemnt w/o carry
    ['demolisher', require('army.demolisher')],
    ['Aupgrader', require('army.upgrader')],
    ['thief', require('army.thief')],
    ['Acontroller', require('army.controller')],
    ['transport',   require('role.transport')], // Gather and move - just carry 
    ['healer',   require('army.healer')], // Gather and move - just carry 
    ['nuker',    require('role.nuker')],
    ['shooter',require('keeper.shooter')],
    ['rampartGuard',require('army.rampartGuard')],
    ['tower',require('role.tower')],
    ['wallwork',    require('role.wallworker')]
];

var controllerLevel = 3500;
var transportLevel = 20000;

var newbModLevel = [
    [
        ['upbuilder', require('role.upbuilder'), 0, 0]
    ], // Overflow 


// First wave - right when spawn is created.
    [
//        ['upgrader', require('role.upgrader'), 1, 0],
        ['first', require('role.first'), 2, 0],
        ['harvester', require('role.harvester'), 2, 0]
//        ['upbuilder',    require('role.upbuilder'), 2, 0]
    ], 
// 2nd Wave starts right at Controller lvl 2. 
    [ 
        ['first', require('role.first'), 2,1],
        
//        ['defender',    require('role.defender'), 1, 0],
        //['upbuilder',    require('role.upbuilder'), 2, 1],
        ['repairer', require('role.repairer'), 1, 1],
        ['upgrader', require('role.upgrader'), 1, 1],
        ['builder',    require('role.builder'), 2, 2],
        ['harvester', require('role.harvester'), 2, 1]
    ],

// 3rd wave starts @ Controller level 3
     [ 
        ['first', require('role.first'), 2,1],
        
//        ['defender',    require('role.defender'), 1, 1],
//        ['builder',    require('role.builder'), 0, 1],
//        ['repairer', require('role.repairer'), 1, 1],
        ['upgrader', require('role.upgrader'), 1, 2  ],
        ['linker',      require('role.linker'), 2 , 3],
//        ['upbuilder',    require('role.upbuilder'), 5, 2],
        ['harvester', require('role.harvester'), 2, 2]
    ], // At this point there shoulud be another module for it to take over
    [
        ['first', require('role.first'), 2, 2],
        ['harvester', require('role.harvester'), 2, 2],
        ['upbuilder',    require('role.upbuilder'), 4, 2],
        ['linker',      require('role.linker'), 0, 0]
    ] // At this point there shoulud be another module for it to take over
];// 

var upgradeModule = [
        ['harvester', require('role.harvester'), 1,2],
        ['first', require('role.first'), 1, 1],
        ['upbuilder',    require('role.upbuilder'), 0 , 7   ],
        ['builder', require('role.builder'), 0, 5],
        ['scientist',require('role.scientist'), 0, 4],
        ['linker',      require('role.linker'), 1      , 10]
];


var empireModules = [
        ['harvester', require('role.harvester'), 2,2],
        ['first', require('role.first'), 2, 3],
        ['upbuilder',    require('role.upbuilder'), 1 , 7   ],
//        ['upgrader',    require('role.upgrader'), 0 ,    6],
        ['linker',      require('role.linker'), 1      , 3],
        ['minHarvest', require('role.mineral'),1, 5],
        ['scientist',require('role.scientist'), 0, 4],
        ['wallwork',    require('role.wallworker'), 1, 5],
        ['homeDefender',    require('role.defender2'), 1,6]
];
var spawn2Module = [ 
        ['harvester', require('role.harvester'), 2, 2],
        ['first', require('role.first'), 2, 3],
        ['upbuilder',    require('role.upbuilder'), 1 , 7   ],
        ['linker',      require('role.linker'), 1      , 3],
        ['homeDefender',    require('role.defender2'), 1,6],        
        ['nuker',    require('role.nuker'), 1, 0],
        ['scientist',require('role.scientist'), 0, 4],
//        ['builder',    require('role.builder'), 3, 5],

        ['minHarvest', require('role.mineral'),1,5 ],  
        ['wallwork',    require('role.wallworker'), 1, 5]
];
var spawn3Module = [ 
        ['harvester', require('role.harvester'), 2, 2],
        ['linker',      require('role.linker'), 1      , 3],
        ['first', require('role.first'), 2, 2],
        ['scientist',require('role.scientist'), 0, 4],
        ['upbuilder',    require('role.upbuilder'), 1 ,    7],
        ['minHarvest', require('role.mineral'),1, 4 ],
        ['wallwork',    require('role.wallworker'), 1, 5]
];
var spawn4Module = [  // Room E26S77 Spawn 5
        ['first', require('role.first'), 2,2],
        ['linker',      require('role.linker'), 1 , 3],
        ['minHarvest', require('role.mineral'),1, 4 ],
        ['scientist',require('role.scientist'), 0, 4],        
        ['wallwork',    require('role.wallworker'), 1, 3],
        ['upbuilder',    require('role.upbuilder'), 1, 7],
        ['harvester', require('role.harvester'), 1, 2]

];
var spawn5Module = [  

        ['first', require('role.first'), 2,3],
        ['scientist',require('role.scientist'), 0, 4],        
        ['linker',      require('role.linker'), 1 , 3],
        ['upbuilder',    require('role.upbuilder'), 1, 5],
        ['wallwork',    require('role.wallworker'), 0, 0],
        ['minHarvest', require('role.mineral'),1, 5 ],
        ['harvester', require('role.harvester'), 2, 2]
  

     // At this point there shoulud be another module for it to take over */
];
var spawn6Module = [  // Spawn11 Room E28S77

      ['first', require('role.first'), 1,4],
        ['nuker',    require('role.nuker'), 1, 4],
        ['minHarvest', require('role.mineral'),1, 4 ],
        ['linker',      require('role.linker'), 1 , 3],
        ['scientist',require('role.scientist'), 0, 4],        
        ['upbuilder',    require('role.upbuilder'), 1, 7],
        ['wallwork',    require('role.wallworker'), 1, 5],
        ['homeDefender',    require('role.defender2'), 1,6],
        ['harvester', require('role.harvester'), 2, 2]
  

     // At this point there shoulud be another module for it to take over */
];
var E35S83Module = [  // Spawn11 Room E28S77

      ['first', require('role.first'), 2,3],
        ['minHarvest', require('role.mineral'),1, 4 ],
        ['linker',      require('role.linker'), 2 ,3],
        ['builder',    require('role.builder'), 0, 5],
        ['upbuilder',    require('role.upbuilder'), 1 ,    7],

        ['scientist',require('role.scientist'), 0, 4],     
        ['upbuilder',    require('role.upbuilder'), 0 ,4],
        ['wallwork',    require('role.wallworker'), 1, 5],
        ['harvester', require('role.harvester'), 2, 2]
  

     // At this point there shoulud be another module for it to take over */
];

var E35S73Module = [  // Spawn11 Room E28S77

      ['first', require('role.first'), 2,2],
        ['linker',      require('role.linker'), 1 , 4],
//        ['builder',    require('role.builder'),1, 5],
        ['scientist',require('role.scientist'), 0, 3],     
        ['minHarvest', require('role.mineral'),1, 4 ],

        ['upbuilder',    require('role.upbuilder'), 1, 7],
        ['wallwork',    require('role.wallworker'), 1, 4],
          ['harvester', require('role.harvester'), 2, 2]
  

     // At this point there shoulud be another module for it to take over */
];

var E38S74Module = [
    ['first', require('role.first'), 0,0]
];
var W4S93Module = [
    ['first', require('role.first'), 2,2],
    ['linker',      require('role.linker'), 2, 3],
    ['homeDefender',    require('role.defender2'), 1,6],
    ['upbuilder',    require('role.upbuilder'), 0, 5],
    ['wallwork',    require('role.wallworker'), 1, 3],
    ['scientist',    require('role.wallworker'), 0, 2],
    ['minHarvest', require('role.mineral'),1, 3 ],
    ['harvester', require('role.harvester'), 2, 2]
];

var E38W75Module = [
    ['first', require('role.first'), 1,3],
    ['scientist',require('role.scientist'), 0, 3],     
    ['minHarvest', require('role.mineral'),1, 3 ],
    ['upbuilder',    require('role.upbuilder'), 1, 7]

];

var E38S72Module = [
    ['first', require('role.first'), 2,3],
    ['linker',      require('role.linker'), 1, 3],
['scientist',require('role.scientist'), 0, 3],         
    ['homeDefender',    require('role.defender2'), 1,6],
    ['wallwork',    require('role.wallworker'), 1, 5],
    ['upbuilder',    require('role.upbuilder'), 1, 7],
    ['upgrader',    require('role.upgrader'), 0, 5],
    ['minHarvest', require('role.mineral'),1, 3 ],
    ['harvester', require('role.harvester'), 2, 2]
]

var expansionModule = [
    // Zero level is just miner and builder of roadsn
    [ // 200 Energy required
        ['roadbuilder', require('role.roadbuilder'), 1, 2] // Pick up/harvest to build. 
    ],
    // sends a miner to build the cotainer
    [ // 300 Energy Required
        ['miner', require('role.miner'), 1, 2] // Harvester - experiemnt w/o carry
    ],
    // Adds transport once container is built.
    [ // 550 Energy Max
        ['miner', require('role.miner'), 1, 2], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'),1, 2] // Gather and move - just carry 
    ],
    // Level 3 has a controller 
    [ // 800 Energy Max.
        ['miner', require('role.miner'), 1, 2], // Harvester - experiemnt w/o carry
        // There are two transports because this is cock blocked by expansions.
        ['transport', require('role.transport'), 1, 2], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 1]
    ],

    // four level When the spawn can create 1300 strong units. 
    // The transport here will be designed for 1 square away - 
    [ // 1300 Energy Max.
        ['miner', require('role.miner'), 1, 3], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 2], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 4]
    ],

// Level 5 or above means the area is constructed, 
// needing more transports because the distance is a bit further.

    // Level five is an contructed fully area - rebuilder can be downgraded and more
    // transports.
    [ // 1800 Energy Max.
        ['miner', require('role.miner'), 1, 3], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 3], // Gather and move - just carry 800
        ['controller', require('role.controller'), 1, 4]
    ],
    // Level six is a bit further - needing 2 heavy level transports.
    [ // 1800 Energy Max.
        ['miner', require('role.miner'), 1, 3], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 4], // Gather and move - just carry up to 1400
        ['ztransport', require('role.ztransport'), 1, 0], // Gather and move - just carry up to 1400
        ['controller', require('role.controller'), 1, 4]
    ],

    // Level seven is the highest distance away. 
    [ // 1800 Energy Max.
        ['miner', require('role.miner'), 1, 4], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 5], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 5]
    ],
    [ // 1800 Energy Max.5836b8138b8b9619519f16b8
        ['miner', require('role.miner'), 1, 4], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 6], // Gather and move - just carry up to 1400
        ['controller', require('role.controller'), 1, 5]
    ],

    [ // LEVEL 9 is another expansion that has a spawn.
        ['miner', require('role.miner'), 1, 5], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 5] // Gather and move - just carry 
    ],
    [ // LEVEL 10 is another expansion that has a spawn.5836b8168b8b9619519f1708
        ['miner', require('role.miner'), 1, 5], // Harvester - experiemnt w/o carry
        ['transport', require('role.transport'), 1, 6], // Gather and move - just carry up to 1400
        ['controller', require('role.controller'), 1, 5] // Gather and move - just carry 
    ],

    [ // LEVEL 11 is another expansion that has a spawn.
    ['mineral',require('keeper.scientist'),1,4],
    ['ztransport', require('role.ytransport'), 1, 0],
    ['rtransport', require('role.rtransport'), 1, 0]
    ],

    [ // LEVEL 12 is another expansion that has a spawn. 5836b8168b8b9619519f1708
    ['mineral',require('keeper.scientist'),1,5],
    ['rtransport', require('role.rtransport'), 1, 0],
    ['ztransport', require('role.ytransport'), 1, 0],
    ['ytransport', require('role.ytransport'), 1, 0]

    ],

    [ // LEVEL 13 - for just a miner and transport.
        ['mineral',require('keeper.scientist'),1,5],
    ['ztransport', require('role.ytransport'), 1, 0]
    ],
    [ // LEVEL 14 - for an mineral For spawn3
        ['miner', require('role.miner'), 1, 3], // Gather and move 12- just carry 
        ['transport', require('role.transport'), 2, 2], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 4]
    ],
    [ // LEVEL 15 - for an mineral for spawn1
        ['miner', require('role.miner'), 1, 3], // Gather and move - just carry 
        ['transport', require('role.transport'), 2, 3], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 4]
    ],
    [ // LEVEL 16 - for just a miner and transport.
        ['miner', require('role.miner'), 1, 5], // Gather and move - just carry 
        ['transport', require('role.transport'), 2, 4], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 4]
    ], // al
    [ // LEVEL 17 - for just a miner and transport. Weaker than lv 15
        ['miner', require('role.miner'), 1, 5], // Gather and move - just carry 
        ['transport', require('role.transport'), 2, 4], // Gather and move - just carry 
        ['controller', require('role.controller'), 1, 4]
    ], // al
    [ // LEVEL 18 - for just a miner and transport. Weaker than lv 15
        ['miner', require('role.miner'), 1, 5], // Gather and move - just carry 
        ['transport', require('role.transport'), 2, 5] // Gather and move - just carry 
    ],
        [ // LEVEL 19 - for just a miner and transport.
        ['miner', require('role.miner'), 1, 5], // Gather and move - just carry 
        ['transport', require('role.transport'), 2, 6] // Gather and move - just carry 
    ], // al
    [ // LEVEL 20 - for just a miner and transport. Weaker than lv 15
        ['miner', require('role.miner'), 1, 5],// Harvester - experiemnt w/o carry
        ['ytransport', require('role.ytransport'), 1, 0],
        ['transport',  require('role.transport'), 1, 6],
        ['ztransport', require('role.ztransport'), 1, 0],
        ['xtransport', require('role.xtransport'), 1, 0] // Harvester - experiemnt w/o carry
    ], // 
    [ // LEVEL 21 [E25S74 12,9]
        ['miner', require('role.miner'), 1, 5],// Harvester - experiemnt w/o carry
        ['ytransport', require('role.ytransport'), 1, 0],
        ['transport',  require('role.transport'), 2, 6],
        ['ztransport', require('role.ztransport'), 1, 0],
        ['xtransport', require('role.xtransport'), 1, 0] // Harvester - experiemnt w/o carry
    ], // 
    [ // LEVEL 22 
        ['miner', require('role.miner'), 1, 5],// Harvester - experiemnt w/o carry
        ['ytransport', require('role.ytransport'), 1, 0],
        ['transport',  require('role.transport'), 1, 6],
        ['xtransport', require('role.xtransport'), 1, 0] // Harvester - experiemnt w/o carry

    ], // 
    [ // LEVEL 23  [E35S84 10,6]
        ['miner', require('role.miner'), 1, 5],// Harvester - experiemnt w/o carry
        ['transport',  require('role.transport'), 1, 4]
    ], //
    [ // LEVEL 24 
        ['miner', require('role.miner'), 1, 5],// Harvester - experiemnt w/o carry
        ['ytransport', require('role.ytransport'), 1, 0],
        ['transport',  require('role.transport'), 1, 6],
        ['ztransport', require('role.ztransport'), 1, 0]
    ], // 
    [ // LEVEL 25 
    ], // 
    [ // LEVEL 26 
    ], // 
    [ // LEVEL 27 
    ],
    [ // LEVEL 28 
    ], // 
    [ // LEVEL 29 
    ], // 
    [ // LEVEL 30 
        
    ] 
];

var overflow = ['upgrader', require('role.upgrader'), 0, 0];

var party = require('commands.toParty');

var _overflow = 0;
var _name = 0;
var _require = 1;
var _number = 2;
var _level = 3;

var currentModule;

var showEveryone = true;
var countCPU = false;

function cpuCount(creep,time)     {

if(creep.memory.cpu == undefined) {
    creep.memory.cpu = [];
}
let avg = _.sum(creep.memory.cpu)/creep.memory.cpu.length;
if(showEveryone) console.log('CPU used by '+ creep  +' is a '+creep.memory.role + 
    ' Time : ' + 'avg:'+Math.floor(_.sum(creep.memory.cpu)/creep.memory.cpu.length),'/lst:',time,creep.pos);

creep.memory.cpu.push(time);
if(creep.memory.cpu.length > 30) creep.memory.cpu.shift();
}                  

// Give it a role, and SourceID
// Returns all creeps that match that role and source ID
function getPossibleRole(spawn,creepRole,sourceID)  {
    let total = 0;

        for(var e in spawn.memory.warCreate) {
            if(spawn.memory.warCreate[e].memory.role == creepRole&& spawn.memory.warCreate[e].memory.goal == sourceID)
                total++;
        }

        for(var e in spawn.memory.expandCreate) {
            if(spawn.memory.expandCreate[e].memory.role == creepRole&& spawn.memory.expandCreate[e].memory.goal == sourceID)
                total++;
        }

        for(var e in spawn.memory.create) {
            if(spawn.memory.create[e].memory.role == creepRole&& spawn.memory.create[e].memory.goal == sourceID)
                total++;
        }

    return total;

}

function getExpandRole(creepRole,sourceID,totalCreeps) {
    let count = 0;
                for(var e in totalCreeps){
                    for(var a in totalCreeps[e].goal) {
                     if ( creepRole == e && totalCreeps[e].goal[a] == sourceID ){
                        count ++;      
                     }
                    }
                } 

                return count;
}

function makeBody(carryNeeded){
    let body = [WORK,MOVE];

    do{
        body.push(MOVE);
        body.push(CARRY);
        carryNeeded--;
    }while(carryNeeded > 0)
    return body;
}

function analyzeSource(expand) {
	if(expand.allDistance == undefined) expand.allDistance = [];

                        if(expand.allDistance.length > 30) {
                             expand.allDistance.sort(function(a, b) {return a - b;});
                            do{
                            expand.allDistance.shift();
                            expand.allDistance.pop();
                            expand.allDistance.shift();
                            expand.allDistance.pop();
                            }while(expand.allDistance.length > 30)
                        expand.aveDistance = Math.ceil( (_.sum(expand.allDistance) / expand.allDistance.length));

                        }
let mining;
let miningInfo = {};
let source = Game.getObjectById(expand.source);
if(source != undefined && source.energyCapacity == 4000) {
    // 4000/300 + time away 40
    mining = 32; // 16 * 2;
    miningInfo.workNeeded = 11;// * 2 *2;
} else {
    // 3000/300 = 10/2 = 5 work - back and forth distnce so. 
    miningInfo.workNeeded = 7;// * 2 *2;
    mining = 20;
}

if( expand.transportNum != undefined ) expand.transportNum = undefined;
if( expand.tranCarryNeed != undefined ) expand.tranCarryNeed = undefined;
if( expand.numOfParts != undefined ) expand.numOfParts = undefined;
if( expand.numOfCreep != undefined ) expand.numOfCreep = undefined;
if( expand.carryNeed != undefined ) expand.carryNeed = undefined;
if( expand.tranCarryNeed != undefined ) expand.tranCarryNeed = undefined;
if( expand.carryNeeded != undefined ) expand.carryNeeded = undefined;
if( expand.transportNum != undefined ) expand.transportNum = undefined;

let tInfo = {};
                        tInfo.carryNeeded = (expand.aveDistance*mining);
                        tInfo.tranCarryParts = Math.ceil(tInfo.carryNeeded/50);
                        tInfo.transportNum = Math.ceil(tInfo.tranCarryParts/32);
                        tInfo.carryPerTran = Math.ceil(tInfo.tranCarryParts/tInfo.transportNum);

expand.transInfo = tInfo;
expand.mineInfo = miningInfo;
expand.controlInfo = {};
}


   function rebuildCreep(creep) {
    // Here we need to determine if it needs to be leveled up. 
    // Here we need to determine if the creep is an expansion creep or home creep.
    // expansion creep.
    let _body = [];

    if(creep.memory.role == 'miner' ||creep.memory.role ==  'transport'||creep.memory.role ==  'ztransport'||creep.memory.role ==  'rtransport'||creep.memory.role ==  'xtransport'||creep.memory.role ==  'ytransport') {
    let spawn = Game.getObjectById(creep.memory.parent);
    let _module; 
    let goalInfo;
    for(var e in spawn.memory.roadsTo) {
        if(spawn.memory.roadsTo[e].source == creep.memory.goal){
            _module = expansionModule[spawn.memory.roadsTo[e].expLevel];
            goalInfo = spawn.memory.roadsTo[e];
            if(creep.memory.role == 'transport') {
                    analyzeSource(spawn.memory.roadsTo[e]);
                        }
            } 
            break;
        }
    
    if(_body == undefined) {
    for(var e in _module ) {
     if( _module[e][_name] == creep.memory.role) {
//       _body = _module[e][_require].levels(_module[e][_level],spawn.room);
     _body = getModuleRole(_module[e][_name]).levels(_module[e][_level],spawn.room)
       break;
     }
    }
    }

//if((creep.memory.home == 'E35S73') && creep.memory.role == 'miner' ) {   console.log(_body,'ray');    }

}  else if(creep.memory.role == 'first' || creep.memory.role == 'harvester'|| creep.memory.role == 'scientist') {
            currentModule = getCurrentModule(Game.getObjectById( creep.memory.parent) );
            for (var type in currentModule) {
                if( currentModule[type][_name] == creep.memory.role) {
                    _body = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level],creep.memory.home);
/**/                    
                    break;
                }
            }
        } else {

            for (var e in creep.body) {
            _body.push(creep.body[e].type)
            }
        }

        if(_body.length == 0) {
        for (var e in creep.body) {
            _body.push(creep.body[e].type)
            }
        }

        if(creep.memory.deathCount == undefined) {creep.memory.deathCount = 0;}
        creep.memory.deathCount++;

let rando =Math.floor( Math.random() * creep.memory.parent.length ) ;
var needBoost;
var isModded = false;
if(creep.memory.needBoost== undefined||creep.memory.needBoost.length == 0) { // this pretty much says if it's gotten a boost before.
    if((creep.memory.home == 'E35S73'|| creep.memory.home == 'E35S83x' || creep.memory.home == 'E26S77x' ) && 
        (creep.memory.role == 'miner')
        &&_body.length > 6 ) {
                var cBuild = [];
//                console.log(_body,'ray');
                    cBuild = changeBuild(_body,Game.rooms[creep.memory.home]);
//                console.log(cBuild,'rayray',Game.rooms[creep.memory.home].memory.tempBoost);

                if(cBuild.length != _body.length) {
                    _body = cBuild;
                    isModded = true;
                    needBoost = Game.rooms[creep.memory.home].memory.tempBoost;
                } 
    } 
} else {
    needBoost = creep.memory.needBoost;   
}




            let temp = {
                            build:_body,
                            name:  creep.memory.role[0]+creep.memory.role[1]+creep.memory.role[2] + creep.memory.deathCount +':'+ creep.memory.parent[rando],
                            memory: {
                                role: creep.memory.role,
                                home: creep.memory.home,
                                needBoost:needBoost,
                                parent: creep.memory.parent,
                                deathCount: creep.memory.deathCount,
                                level: creep.memory.level,
                                goal: creep.memory.goal,
                                party: creep.memory.party
                            }
                        };

/*            if(creep.memory.workContainer != undefined) {
                temp.memory.workContainer = creep.memory.workContainer;
            } */
            if(creep.memory.sourceID != undefined) {
                temp.memory.sourceID = creep.memory.sourceID;
            }
            if(creep.memory.keeperLairID != undefined) {
                temp.memory.keeperLairID = creep.memory.keeperLairID;
            }
            if(creep.memory.scientistID != undefined) {
             temp.memory.scientistID = creep.memory.scientistID;   
            }

        return temp;
    }

function addFromCreateStack(totalCreeps,role,spawn) {
    //                if(spawn.memory.create[e] != undefined) {
            for (var e in spawn.memory.create) {
                if (role == spawn.memory.create[e].memory.role) {
                    totalCreeps[role].count++;
                    totalCreeps[role].goal.push(spawn.memory.create[e].memory.goal);
                }
            }
            for (var e in spawn.memory.warCreate) {
                if (role == spawn.memory.warCreate[e].memory.role) {
                    totalCreeps[role].count++;
                    if(spawn.memory.create[e] != undefined)
                    totalCreeps[role].goal.push(spawn.memory.create[e].memory.goal);
                }
            }
            for (var e in spawn.memory.expandCreate) {
                if (role == spawn.memory.expandCreate[e].memory.role) {
                    totalCreeps[role].count++;
                    totalCreeps[role].goal.push(spawn.memory.create[e].memory.goal);
                }
            } 
            return totalCreeps;
            }

function getModuleLevel(spawn){
            return spawn.memory.buildLevel;
}
function getNuke(spawn) {
    return spawn.room.nuke;
    let nukes = ['58b8846bb286c56d754d0161'];
    for(var e in nukes){
     let nuker = Game.getObjectById(nukes[e]);
     if(nuker != undefined && nuker.pos.roomName == spawn.pos.roomName) {
        return nuker;
     }
    }
}

function getCurrentModule(spawn) {

    var currentModuleLevel = getModuleLevel(spawn);

        if (spawn.memory.homeEmpire && spawn.room.controller.level > 3 && spawn.name == 'Spawn1') {
            if(spawn.room.memory.roomModule == undefined) {
            var roomModule = [];
                for(var a in empireModules) {
                    let zz = {name:empireModules[a][_name],require:false,count:empireModules[a][_number],level:empireModules[a][_level]}
//                    console.log(zz);
                    roomModule.push(zz);
                }
            spawn.room.memory.roomModule = roomModule;
            }


            return  empireModules;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn2') {
            return  spawn2Module;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn3') {
            return  spawn3Module;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn5') {
            return  spawn4Module;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn9') {
            return  spawn5Module;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn11') {
            return  spawn6Module;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn22') {
            return  E35S73Module;            
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'Spawn20') {
            return  E35S83Module;
        }
        if(spawn.name == 'Spawn28') {
            return  E38S74Module;            
        }
        if(spawn.name == 'E37W75') {
            return E38W75Module;
        }
        if(spawn.name == 'W4S93') {
        return W4S93Module;
    }
        if(spawn.name == 'E38S72') {
            return E38S72Module;
        }
        if(spawn.room.controller.level > 3 && spawn.name == 'UpgradeSpawn') {
            return upgradeModule;
        }

    
    return  newbModLevel[currentModuleLevel];
}


function changeBuild(build,room) { // Input [body,body,carry],room
    // So we go through the body and take it apart
    // Once we take it apart, we'll start analzying the room and the parts that it can reduce.
    // First we will start with harvesting
    let available = room.memory.availableMinerals;
    if(available == undefined ) return build;

    let workparts = _.filter(build,function(n) {return n == WORK;});
    let otherParts = _.filter(build,function(n) {return n != WORK;});

    let workCount = workparts.length;

    let nWorkPart = Math.ceil(workCount/BOOSTS.work.UO.harvest);
    let harvestEffect = nWorkPart * HARVEST_POWER; // 11 = 22
    // take 22 divide it by 400% increase -
    room.memory.tempBoost = []; //+200% harvest effectiveness


    console.log(workCount,room.memory.labMinerals['UO']-room.memory.calledMinerals['UO'] , nWorkPart*30);
    if(workCount >= 3 && room.memory.labMinerals['UO']-room.memory.calledMinerals['UO'] >= nWorkPart*30) {
        // so "UO" will make it 3 instead of 1 work, 
        let workparts = [];
        do{
            workparts.push(WORK);
            nWorkPart--;
        } while (nWorkPart != 0)

        build = otherParts.concat(workparts); // Changes build with otherparts+work
        room.memory.tempBoost.push('UO'); // Adds it to memory so it can be added to it's self memory in build.
        room.memory.calledMinerals['UO']+=nWorkPart*30;

    }

    // Then we will do move - move will always be last.

    otherParts = _.filter(build,function(n) {return n != MOVE && n!=CARRY ; }); // for miner atm
    carryParts = _.filter(build,function(n) {return n == CARRY ; });
    let bneeded = Math.ceil( (otherParts.length*2)/4 ); // This is for ZO 
    needed = Math.ceil(bneeded*.50); // We'll start everything using roads. 
//    console.log(bneeded,otherParts,needed,room.memory.labMinerals['ZO'],room.memory.calledMinerals['ZO'] ,needed*30 )
    if(bneeded > 1 && room.memory.labMinerals['ZO']-room.memory.calledMinerals['ZO'] >= needed*30) {
        // so "UO" will make it 3 instead of 1 work, 
        let moveParts = [];
        do{
            moveParts.push(MOVE);
            needed--;
        } while (needed > 0)

        build = otherParts.concat(carryParts).concat(moveParts); // Changes build with otherparts+work
        room.memory.tempBoost.unshift('ZO'); // Adds it to memory so it can be added to it's self memory in build.
        room.memory.calledMinerals['ZO']+=needed*30;
    } else {
        needed = Math.ceil( otherParts.length*.5 ); // This is to still fix the move parts to be lower incase other changes have occured.
        console.log(needed,'no boost change into');
        let moveParts = [];
        do{
            moveParts.push(MOVE);
            needed--;
        } while (needed > 0)

        build = carryParts.concat(moveParts).concat(otherParts); // Changes build with otherparts+work
//        build = build.concat(carryParts);
    }
    console.log('in the end',room.memory.tempBoost )

    // Uses this memory point in order to pass more than 1 variable.
    // Returns the body, and adds to the room.memory.tempBoost in order to the creep to get it to boost with.
//    room.memory.tempBoost = ['UO'];
    return build;
}

    function buildMiner( workParts ) {
        let body = [];
        do {
            body.push(WORK);
            workParts--;
        } while(workParts >0)

        let mv = Math.ceil( body.length *2 );
        do {
            body.push(MOVE);
            mv--;
        } while(mv >0)
        body.push(CARRY);
        body.push(CARRY);
        return body;
    }

    function buildTransport( carryParts ) {
        let body = [];
        body.push(WORK);
        body.push(MOVE);
        do {
            body.push(CARRY);
            body.push(CARRY);
            carryParts--;
        } while(carryParts > 0)
        let mv = Math.ceil( body.length *2 );
        do {
            body.push(MOVE);
            mv--;
        } while(mv >0)
        return body;
    }

    function getModuleRole(role) {
        for(var a in allModule){
            if(allModule[a][_name] == role) {
                return allModule[a][_require];
            }
        }
    }

class theSpawn {

    static getMaxCount() {
        var totalCreeps = [];
        for (var a in allModule) {
            totalCreeps[allModule[a][_name]] = 0;
        }
        for (var type in currentModule) {
            totalCreeps[currentModule[type][_name]] = currentModule[type][_number];
        }
        return totalCreeps;

    }

 static spawnCount(spawnID) {
        var totalCreeps = [];
        for (var a in allModule) {
            totalCreeps[allModule[a][_name]]  = {goal : [], count : 0 }
        }

        var totalBuild = 0;
        var total = 0;

        var spawnCreeps = _.filter(Game.creeps, function(o){return (o.memory.parent == spawnID) } )
        
        for (var name in spawnCreeps) { // Start of creep loop
                for (var type in allModule) {
                    if (spawnCreeps[name].memory.role == allModule[type][_name]) { // if they are the same
                        spawnCreeps[name].memory.roleID = totalCreeps[allModule[type][_name]].count;
                        totalCreeps[allModule[type][_name]].count++;
                        totalCreeps[allModule[type][_name]].goal.push(spawnCreeps[name].memory.goal);
                    }
                }
                total++;
                totalBuild = totalBuild + spawnCreeps[name].body.length;
        }
        let spawn = Game.getObjectById(spawnID);
        spawn.memory.TotalBuild = (totalBuild * 3)+total;
        spawn.memory.totalCreep = total;
        return totalCreeps;
    }    


    static checkModules(spawn, totalCreeps) {

//        totalCreeps = spawnCount(spawn.id)

        if(!spawn.memory.alphaSpawn) return false; 
        var STACK = spawn.memory.create;

        var currentModuleLevel = getModuleLevel(spawn);

        currentModule = getCurrentModule(spawn);

//        let sites = spawn.room.find(FIND_CONSTRUCTION_SITES);
        for (var type in currentModule) {
            // So we want to take the current module role
            // go through stack and see if there are any others that match that role

            // Go through and add to totalcreeps based of stack info.
            totalCreeps = addFromCreateStack(totalCreeps,currentModule[type][_name],spawn);
  let min = Game.getObjectById(spawn.room.memory.mineralID);
let nuke = getNuke(spawn);

            if ( (currentModule[type][_name] == 'minHarvest')&&(min != undefined)&&(min.mineralAmount == 0) ) {
            }else if ( (currentModule[type][_name] == 'nuker')&&(nuke.ghodium == nuke.ghodiumCapacity)&&(nuke.energy == nuke.energyCapacity) ) {
            }else{

            // If totalCreeps is less than require through currentModule then.
            if (totalCreeps[currentModule[type][_name]].count < currentModule[type][_number]) {
                if(spawn.memory.created == undefined) { spawn.memory.created = 0;}
                spawn.memory.created++;
                var theBuild = getModuleRole(currentModule[type][_name]).levels(currentModule[type][_level]);
/**/
                let temp = {
                    build: theBuild,
                    name: currentModule[type][_name]+totalCreeps[currentModule[type][_name]].count+"*"+spawn.memory.created,
                    memory: {
                        role: currentModule[type][_name],
                        home: spawn.room.name,
//                        needBoost: needBoost,
                        parent: spawn.id,
                        level: currentModule[type][_level]
                    }
                }
                if (currentModule[type][_name] == 'first' || currentModule[type][_name] == 'harvester') {
                    spawn.memory.create.unshift(temp);
                    totalCreeps[currentModule[type][_name]].count++;
                    totalCreeps[currentModule[type][_name]].goal.push('none');

                } else {
                    spawn.memory.create.push(temp);
                    totalCreeps[currentModule[type][_name]].count++;
                    totalCreeps[currentModule[type][_name]].goal.push('none');
                }
            }
            }
        }
        }

    static checkBuild(spawn) {
        //        let constr = require()
        //console.log('here?',spawn.memory.buildLevel, spawn.room.controller.level);
        if (spawn.memory.buildLevel != spawn.room.controller.level) {
           var constr = require('commands.toStructure');
            constr.buildConstrLevel(spawn,spawn.room.controller.level);
            spawn.memory.buildLevel = spawn.room.controller.level;
            return false;
        }

        return true;

    }

    // Newcount needs ID of an object in order to 
    // New count looks through game.creeps to find creeps that's parent
    // Id matches and returns an array of current count. 

    static runCreeps(){

        var spawnCreeps = Memory.creeps

    for (var name in spawnCreeps) { // Start of Creep Loop
        if (!Game.creeps[name]) { // Check to see if this needs deletion
            delete spawnCreeps[name]; // If it does then it does.
        } else {
            for (var type in allModule) {
     var start;

                if (Game.creeps[name].memory.role == allModule[type][_name]) { // if they are the same
if(Game.creeps[name].memory.role == 'fighter'||Game.creeps[name].memory.role == 'healer') {countCPU = true;}else  {countCPU = false;} if(countCPU) {    start  = Game.cpu.getUsed(); }

                    if (!Game.creeps[name].spawning)
                        allModule[type][_require].run(Game.creeps[name]); // Then run the require of that role.
if(countCPU) {cpuCount(Game.creeps[name],Math.floor( (Game.cpu.getUsed() - start)*100 )) ;}

                    break;
                }
            }
        }
    }

    }

    static getNumber(roomName) {
        var max = [];
        for (var a in allModule) {
            max[allModule[a][_name]] = 0;
            for (var e in Game.creeps) {
                if ((Game.creeps[e].memory.role == allModule[a][_name]) &&
                    (Game.creeps[e].memory.home == roomName)) {
                    max[allModule[a][_name]]++;
                }
            }
        }

        return max;
    }


    static checkExpand(spawn,totalCreeps) {
        if(!spawn.memory.alphaSpawn || spawn.memory.roadsTo.length == 0) return; 

        var _module;
        var report = '';
        

        for (var ie in spawn.memory.roadsTo) {

            let xp = spawn.memory.roadsTo[ie].expLevel;
            _module = expansionModule[xp];
            var source = Game.getObjectById(spawn.memory.roadsTo[ie].source);

            if(spawn.memory.roadsTo[ie].expLevel > 0) {
                if(source == undefined) {
                    console.log(source,spawn.memory.roadsTo[ie].source,spawn,ie);
                    let obser = require('build.observer');
                    obser.reqestRoom(spawn.memory.roadsTo[ie].sourcePos.roomName,5)
                } else {
                    if(source.room == undefined) {
                        console.log('HEREASD');
                    }
                }
            }

            if (source != undefined) {


                if (spawn.memory.roadsTo[ie].sourcePos == undefined) {
                    spawn.memory.roadsTo[ie].sourcePos = source.pos;
                }

                var maxMiners = 0;
                var maxTrans = 0;
                var maxxTrans = 0;
                var maxyTrans = 0;
                var maxrTrans = 0;
                var maxzTrans = 0;
                var maxCon = 0;
                var maxRoad = 0;
                var maxMin = 0;

                for (var e in _module) {


                    if (_module[e][_name] == 'miner') {
                        maxMiners = _module[e][_number]
                    }
                    if (_module[e][_name] == 'controller') {
                        maxCon = _module[e][_number]
                    }
                    if (_module[e][_name] == 'transport') {
                        maxTrans = _module[e][_number]
                    }
                    if (_module[e][_name] == 'xtransport') {

                        maxxTrans = _module[e][_number]
                    }
                    if (_module[e][_name] == 'ytransport') {

                        maxyTrans = _module[e][_number]
                    }
                    if (_module[e][_name] == 'ztransport') {
                        maxzTrans = _module[e][_number]
                    }
                    if (_module[e][_name] == 'rtransport') {
                        maxrTrans = _module[e][_number]
                    }
                    if (_module[e][_name] == 'roadbuilder') {
                        maxRoad = _module[e][_number]
                    }
                    if (_module[e][_name] == 'mineral') {
                        maxMin = _module[e][_number]
                    }
                }

              
              if(spawn.room.name == 'E35S73' && spawn.memory.roadsTo[ie].source =='5836b8288b8b9619519f190c') {
                  maxTrans =  spawn.memory.roadsTo[ie].transInfo.transportNum;
              }

if(spawn.memory.roadsTo[ie].transport != undefined) {
   let transportBuild;
/*  
if(spawn.memory.roadsTo[ie].transportNum != undefined) {
    transportBuild =  spawn.memory.roadsTo[ie].transportNum
} else {
    
}
*/
    transportBuild = getPossibleRole(spawn,'transport', spawn.memory.roadsTo[ie].source);
    let transport = getExpandRole('transport', spawn.memory.roadsTo[ie].source,totalCreeps);
    if (transport + transportBuild < maxTrans) {
        spawn.memory.roadsTo[ie].transport = false;
    }
}

if((spawn.memory.roadsTo[ie].xtransport != undefined)){
  let xtransport = getExpandRole('xtransport', spawn.memory.roadsTo[ie].source,totalCreeps);    
                let xtransportBuild = getPossibleRole(spawn,'xtransport', spawn.memory.roadsTo[ie].source);
                if ( xtransport + xtransportBuild < maxxTrans)  {
                    spawn.memory.roadsTo[ie].xtransport = false;
                }
}
if(spawn.memory.roadsTo[ie].ytransport != undefined) {
                let ytransport = getExpandRole('ytransport', spawn.memory.roadsTo[ie].source,totalCreeps);
                let ytransportBuild = getPossibleRole(spawn,'ytransport', spawn.memory.roadsTo[ie].source);

                if ((ytransport + ytransportBuild < maxyTrans)) {
                    spawn.memory.roadsTo[ie].ytransport = false;
                }
}
if(spawn.memory.roadsTo[ie].ztransport != undefined){
                let ztransport = getExpandRole('ztransport', spawn.memory.roadsTo[ie].source,totalCreeps);
                let ztransportBuild = getPossibleRole(spawn,'ztransport', spawn.memory.roadsTo[ie].source);
                if (ztransport + ztransportBuild < maxzTrans) {
                    spawn.memory.roadsTo[ie].ztransport = false;
                }
}
if(spawn.memory.roadsTo[ie].rtransport != undefined){
                let rtransport = getExpandRole('rtransport', spawn.memory.roadsTo[ie].source,totalCreeps);
                let rtransportBuild = getPossibleRole(spawn,'rtransport', spawn.memory.roadsTo[ie].source);
                if (rtransport + rtransportBuild < maxrTrans) {
                    spawn.memory.roadsTo[ie].rtransport = false;
                }
}
if(spawn.memory.roadsTo[ie].miner != undefined){
                let Niners = getExpandRole('miner', spawn.memory.roadsTo[ie].source,totalCreeps);
                    let minersBuild = getPossibleRole(spawn,'miner', spawn.memory.roadsTo[ie].source);

                if ((Niners+minersBuild < maxMiners) ) {
                    spawn.memory.roadsTo[ie].miner = false;

}
                }
                if(spawn.memory.roadsTo[ie].roadbuilder != undefined) {
                let roadbuilder =  getExpandRole('roadbuilder', spawn.memory.roadsTo[ie].source,totalCreeps);
                let roadbuilderBuild =  getPossibleRole(spawn,'roadbuilder', spawn.memory.roadsTo[ie].source);

                if (roadbuilder+roadbuilderBuild< maxRoad)  {
                    spawn.memory.roadsTo[ie].roadbuilder = false;

                }
                }

if(spawn.memory.roadsTo[ie].mineral != undefined){
                    let mineral =  getExpandRole('mineral', spawn.memory.roadsTo[ie].source,totalCreeps);
                let mineralBuild =  getPossibleRole(spawn,'mineral', spawn.memory.roadsTo[ie].source);

                if (mineral+mineralBuild < maxMin ) {
                    spawn.memory.roadsTo[ie].mineral = false;
                }
}
                
                let controller;
                let controllerBuild;
if(spawn.memory.roadsTo[ie].controller != undefined){
                controller = getExpandRole('controller', spawn.memory.roadsTo[ie].source,totalCreeps);
                controllerBuild = getPossibleRole(spawn,'controller', spawn.memory.roadsTo[ie].source);
                if ( controller+controllerBuild < maxCon && spawn.memory.roadsTo[ie].controller) {
                    spawn.memory.roadsTo[ie].controller = false;
                } 
}


                let exp = spawn.room.energyCapacityAvailable;
                
                if (spawn.memory.roadsTo[ie].expLevel == 2) {
                    if (exp >= 650) {
                        spawn.memory.roadsTo[ie].expLevel = 3;
                        spawn.memory.roadsTo[ie].controller = false; // creation of the controller. 
                    }
                }
                if (spawn.memory.roadsTo[ie].expLevel == 3 && (controller - controllerBuild) > 0) {
                    if (exp >= 1300) {
                        spawn.memory.roadsTo[ie].expLevel = 4;
                    }
                }

                /*

                let goldMined;
                let totalAttack;
                for (var e in Game.flags) {
                    if (Game.flags[e].pos.roomName == source.room.name) {
                        goldMined = Game.flags[e].memory.goldMined;
                        if (Game.flags[e].memory.attack == undefined) {
                            Game.flags[e].memory.attack = 0;
                        }
                        totalAttack = Game.flags[e].memory.attack;
                        break;
                    }
                } 

                report = report + "|XTran:"+ (xtransport + xtransportBuild) + "/" + maxxTrans    + "|"              ;

                report = report + (roadbuilder+roadbuilderBuild)+"/"+maxRoad+"|"+(mineral+mineralBuild)+"/"+maxMin+" ::";
                report = report + spawn.name + ":" + exp + ":" + "Room:" + source.room.name + "/" + "Id:" + xp +
                    "|Mine:" + (Niners + minersBuild) + "/" + maxMiners + "/" + minersBuild +
                    "|totalMined:" + goldMined + "<" + totalAttack + ">" + "|Tran:" + (transport + transportBuild) + "/" + maxTrans +
                    "/" + transportBuild +
                    "|Con:" + (controller + controllerBuild) + "/" + maxCon + "/" + controllerBuild;

                let controlLeft = Game.getObjectById(spawn.memory.roadsTo[ie].source);
                if (controlLeft.room.controller != undefined && controlLeft.room.controller.reservation != undefined) {
                    let timeLeft = controlLeft.room.controller.reservation.ticksToEnd;
                    report = report + "(" + timeLeft + "/" + controllerLevel + ")";
                }

                report = report + " ";

                report = report + "\n";  

*/
                // This part makes sure there's always the minimum. 
                //            if ((spawn.memory.roadsTo[ie].controller != undefined) ) {

                // search for another source in that room.
                //                spawn.memory.roadsTo[ie].controller = false;
                /*
                                for (var nn in spawn.memory.roadTo) {
                                    let newz = spawn.memory.roadTo[nn];
                                    if(newz.source !=  spawn.memory.roadsTo[ie].source &&
                                        newz.sourcePos.roomName == spawn.memory.roadsTo[ie].sourcePos.roomName)  {
                                            spawn.memory.roadsTo[ie].controller = true; 
                                        }
                                } */
                //            }


            }




            //                    console.log(_module[0][_name],_module2[0][_name]);
            for (var type in spawn.memory.roadsTo[ie]) {
                for (var uo in _module) {

                    //                console.log(type,spawn.memory.roadsTo[ie][type]);
                    // Find the expansions
                    //                    console.log(_module[uo][_name],_module2[uo][_name]);
                    if (type == _module[uo][_name]) {
                        // Instead of checking roadsTo - you can check the expansion #
                        //               console.log(spawn.memory.roadsTo[ie][type] , type );
                        if (!spawn.memory.roadsTo[ie][type]) {
                            //                        console.log('adding too, then set this to true');
                if(spawn.memory.created == undefined) {
                    spawn.memory.created = 0;
                }
                spawn.memory.created ++;
                let needBoost = [];
//                    name: currentModule[type][_name]+totalCreeps[currentModule[type][_name]]+"."+spawn.memory.created,
var theBuild = getModuleRole(_module[uo][_name]).levels(_module[uo][_level],spawn.memory.roadsTo[ie],spawn.room);
/**/
/*if((spawn.room.name == 'E35S73')  && type == 'miner') {
                var cBuild = [];//changeBuild(theBuild,spawn.room);
                    cBuild = changeBuild(theBuild,spawn.room);
                if(cBuild.length != theBuild.length) {
                    theBuild = cBuild;
                    needBoost = spawn.room.memory.tempBoost;
                } 
}*/

                            let temp = {
                                build: theBuild,
                                name: type+"-"+spawn.memory.created+"v",
                                memory: {
                                    needBoost:needBoost,
                                    role: _module[uo][_name],
                                    home: spawn.room.name,
                                    parent: spawn.id,
                                    goal: spawn.memory.roadsTo[ie]['source'],
                                    level: _module[uo][_level]
                                }
                            }

                            // Here, we'll check to see if the controller needs to be created

                            // For expansions here we can determine special requirements needed to
                            // create an unit

                            if (temp.memory.role == 'miner') {
                                console.log('create', _module[uo][_name], ':' + spawn.memory.roadsTo[ie]['source']);
                                spawn.memory.expandCreate.unshift(temp);
                                spawn.memory.roadsTo[ie][type] = true;
                            }
                            // Controller needs it's target reservation to go below 2000
                            else if (temp.memory.role == 'controller') {
                                var level;
                                let sourcez = Game.getObjectById(spawn.memory.roadsTo[ie].source);
                                var controlLeft;
                                if (sourcez != undefined) {
                                    controlLeft = sourcez.room.controller;
                                    if (sourcez.room.controller != undefined && sourcez.room.controller.reservation != undefined) {
                                        level = sourcez.room.controller.reservation.ticksToEnd;
                                    } else {
                                        level = 0;
                                    }

                                    if ((level < controllerLevel)||(sourcez.room.controller.level > 0)) {
      //                                  console.log('create', _module[uo][_name], ':' + spawn.memory.roadsTo[ie]['source']);
                                        spawn.memory.expandCreate.push(temp);
                                        spawn.memory.roadsTo[ie][type] = true;
                                    }

                                }
                            } else if (temp.memory.role == 'mineral') {
                                let min = Game.getObjectById(spawn.memory.roadsTo[ie].source);
                                if(min != undefined && min.mineralAmount > 0 && 
                                    min.room.controller != undefined && min.room.controller.level >= 6) {
    //                                console.log('create', _module[uo][_name], ':' + spawn.memory.roadsTo[ie]['source']);
                                    spawn.memory.expandCreate.push(temp);
                                    spawn.memory.roadsTo[ie][type] = true;

                                } else if(min != undefined && min.mineralAmount > 0 && min.room.controller == undefined) {
//                                console.log('create', _module[uo][_name], ':' + spawn.memory.roadsTo[ie]['source']);
                                spawn.memory.expandCreate.push(temp);
                                spawn.memory.roadsTo[ie][type] = true;
                                } else {

                                }
                            }else if(temp.memory.role == 'transport') {
                                analyzeSource(spawn.memory.roadsTo[ie]);
                            spawn.memory.expandCreate.push(temp);
                           spawn.memory.roadsTo[ie][type] = true;
                        
                        //console.log("Distance of this source is ",expand.aveDistance);
                            } else {

  //                              console.log('create', _module[uo][_name], ':' + spawn.memory.roadsTo[ie]['source']);
                                spawn.memory.expandCreate.push(temp);
                                spawn.memory.roadsTo[ie][type] = true;
                            }


                        }
                    }
                }
            }
        }

//        console.log(report);
    }



    // Okay here, false means that there is no creep
    // when it's add to the stack it also becomes true.

    static reportFrom(creep) {
        var spawn = Game.getObjectById(creep.memory.parent);

        switch (creep.memory.role) {
            case "miner" :
                for(var e in spawn.memory.roadsTo) {
                if(spawn.memory.roadsTo[e].expLevel == 1) {

                    if(creep.memory.keeperLairID == undefined || creep.memory.keeperLairID == 'none'){
                        if( spawn.memory.roadsTo[e].source == creep.memory.goal) {
                            spawn.memory.roadsTo[e].expLevel = 2 ;
                            spawn.memory.roadsTo[e].transport = false;
                            return 0;
                        }
                    } else { // If this is an keeperlair set it to lv 13
                        if( spawn.memory.roadsTo[e].source == creep.memory.goal) {
                            spawn.memory.roadsTo[e].expLevel = 9;
                            spawn.memory.roadsTo[e].transport = false;
                            return 0;
                        }

                    }

                }
if(spawn.memory.roadsTo[e].expLevel == 20) {
    if(spawn.memory.roadsTo[e].xtransport == undefined) {
        spawn.memory.roadsTo[e].xtransport = false;
        return 0;
    }
}                
                }

                return 750; // cooldown
            break;

            case "transport" : 
				if(creep.memory.distance != undefined && creep.memory.distance != 0) {
                for(var e in spawn.memory.roadsTo) {
                    if( spawn.memory.roadsTo[e].source == creep.memory.goal) {
                    	let expand = spawn.memory.roadsTo[e];
                    	if(expand.allDistance == undefined) {
							expand.allDistance = [];
                    	}
                    	expand.allDistance.push(creep.memory.distance);
//                    	console.log("Creep Reporting distance :",creep.memory.distance,creep.memory.goal)

		            }
            		}
            	}
            break;
            case "roadbuilder":

                for(var e in spawn.memory.roadsTo) {
                    if( spawn.memory.roadsTo[e].source == creep.memory.goal &&
                    spawn.memory.roadsTo[e].expLevel == 0 ) {
                        spawn.memory.roadsTo[e].miner = false;
                        spawn.memory.roadsTo[e].expLevel = 1;
                    }
                }

            break; 
            case "boss":
                var BUILD = {
                    source: creep.memory.goal,
                    sourcePos: Game.getObjectById(creep.memory.goal).pos,
                    miner: false,
                    transport: false,
                    expLevel: 2
                }
                spawn.memory.roadsTo.push(BUILD);
                return 250; 
                break;

            case "rebuilder":
                for (var e in spawn.memory.roadsTo) {
                    if (spawn.memory.roadsTo[e].source == creep.memory.goal) {
                        spawn.memory.roadsTo[e].rebuilder = false;
                    }
                }
                return 250; 
                break;
            case "transport":
                for (var e in spawn.memory.roadsTo) {
                    if (spawn.memory.roadsTo[e].source == creep.memory.goal) {
                        spawn.memory.roadsTo[e].transport = false;
                    }
                }
                return 250; 
                break;
        }
    }

    static reportDeath(creep) {
        var spawn = Game.getObjectById(creep.memory.parent);
        //                console.log( creep.rebuildMe(creep)+'aasdfffffffffffffffffffffffffffffffffffffff' );
        switch (creep.memory.role) {
            case "miner" :
            case "transport":
                spawn.memory.expandCreate.push(rebuildCreep(creep));
            break;
            case "xtransport":
            case "ytransport":
            case "ztransport":
            case "rtransport":
                spawn.memory.expandCreate.push(rebuildCreep(creep));
            break;

            case "harvester" :
            case "first" :
                spawn.memory.create.unshift(rebuildCreep(creep));
            break;
            case "scientist" :
                spawn.memory.create.push(rebuildCreep(creep));
            break;
            case "guard":
            case "shooter":
                spawn.memory.warCreate.push(rebuildCreep(creep));
            break;
            case "fighter":
            case "healer":
                spawn.memory.warCreate.unshift(rebuildCreep(creep));
            break;
        }
    }


    

    static checkNewSpawn(spawn) {
        // This function is created when a spawn is new.
        // This should only be checked while the controller level is 1
        if(!spawn.memory.alphaSpawn){
        spawn.memory.newSpawn = false;

          return false;
        } 
        for(var i in Game.spawns) {
            if(Game.spawns[i].name != spawn.name) {
                for(var e in Game.spawns[i].memory.analyzed) { // adds analyzed to spawn.
                spawn.memory.analyzed.push(Game.spawns[i].memory.analyzed[e]);
                }
            }
        }

        spawn.memory.analyzed =  _.uniq(spawn.memory.analyzed);

        spawn.memory.newSpawn = false;
    }

   

}
module.exports = theSpawn;