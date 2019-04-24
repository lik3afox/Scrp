// This is the army,
// Used offensively.
// These will need to be added to the allreport.


var allParty = {
	testBall:[
	        ['mage', 4, 0],
	],
    Issacar:[
        ['fighter', 1, 1]
    ],
    SKIssacar:[
        ['engineer', 1, 14]
    ],

    templar: [
        ['templar', 1, 0]
    ],
    manager: [
        ['manager', 1, 0]
    ],
    reclaimer: [
        ['reclaimer', 1, 0]
    ],
    dismantleRoom: [
        ['demolisher', 4, 5], // Upgrade Engineer
        ['thief', 3, 5],
    ],
    shooter: [
        ['shooter', 1, 4]
    ],
    guard: [
        ['guard', 1, 1]
    ],
    engineer: [
        ['engineer', 1, 5],
    ],
    firstWave: [
        ['engineer', 1, 10], // Builder Engineer
        ['mule', 1, 10],
        ['engineer', 2, 11], // Builder Engineer
    ],
    secondWave: [
        ['engineer', 4, 12], // Upgrade Engineer
        ['mule', 5, 9],
    ],
    thirdWave: [
        ['engineer', 4, 7], //  Builder Engineer
        ['mule', 5, 9],
    ],
    demoSuppressor:[
        ['demolisher', 2, 5],
//        ['demolisher', 2, 5],
        ['ranger', 2, 5]
    ],


    suppressor:[
        ['fighter', 2, 5],
//        ['demolisher', 2, 5],
        ['mage', 2, 5]
    ],
    cleanUp:[
        ['demolisher', 1, 8],
        ['thief', 4, 5],
    ],
    operator:[
        ['healer', 0, 10], // Healer    
        ['mage', 0, 10],
        ['ranger', 0, 10],
        ['paladin', 0, 10],
        ['fighter', 0, 10],
        ['demolisher', 0, 10],
        ['thief', 0, 10],
        ['mule', 0, 10],
        ['engineer', 0, 10],
        ['Acontroller', 0, 1],
    ],

    warParty: [
        ['healer', 0, 10], // Healer    
        ['mage', 0, 10],
        ['ranger', 0, 10],
        ['fighter', 0, 10],
        ['demolisher', 0, 10],
    ],
    boostWarParty: [
        ['healer', 0, 10], // Healer    
        ['mage', 0, 10],
        ['fighter', 0, 10],
        ['demolisher', 0, 10],
    ],
    toughWarParty: [
        ['healer', 0, 10], // Healer    
        ['mage', 0, 10],
        ['fighter', 0, 10],
        ['demolisher', 0, 10],
    ],
    bandit: [
        ['thief', 0, 6],
        ['mage', 1, 13],
        ['fighter', 1, 10],
    ],

    mineral: [
        ['guard', 1, 0],
        ['mineral', 1, 7],
        ['ztransport', 1, 1],
    ],
    mineral2: [
        //        ['guard',1,0],
        ['mineral', 1, 7],
        ['ztransport', 1, 1],
    ],
    thief: [
        ['thief', 3, 5],
    ],
    safemode: [
        ['wallwork', 3, 5]
    ],

    bigPowerParty: [
        ['fighter', 1, 5],
        ['healer', 2, 2] // Healer
    ],

    smallPowerParty: [
        ['fighter', 1, 3],
        ['healer', 1, 5] // Healer
    ],

    smartPowerParty: [
        ['fighter', 1, 9],
        // This fighter is 33 attack, 3 toughness, and 9 movement - designed for
        // This party should kill a power source in 1000 ticks
        // the healer below - doing 25/25
        ['healer', 1, 5] // Healer
    ],
    smarterPowerParty: [
        ['fighter', 1, 13],
        // This fighter is 33 attack, 3 toughness, and 9 movement - designed for
        // This party should kill a power source in 1000 ticks
        // the healer below - doing 25/25
        ['healer', 1, 5] // Healer
    ],

    troll: [
        ['troll', 1, 0]
    ],
    mage: [
        ['mage', 0, 10]
    ],

    scout: [
        ['scout', 1, 0]
    ],
    sign: [
        ['scout', 1, 1]
    ],
    test: [
        ['scout', 1, 1]


    ],

    control: [
        ['Acontroller', 1, 0]
    ],
    controllerAttack: [
        ['Acontroller', 1, 1]
    ],
    recontrol: [
        ['recontroller', 1, 0]
    ],

    mule: [
        ['mule', 2, 5],
    ],

    hmule: [
        ['mule', 2, 9],
    ],

    // Every base already has a wall repairer
    // Also have it so the upgrader also repairs the wall
    // If there's a mineral harvest - have him repair too.

    rampart: [ // This is what currently si in effect, but 
        // Rampart Will be range,repair,tower,and other things needed that is not attack.
        //     ['tower', 1, 0],
        ['wallwork', 2, 5],
        ['rampartGuard', 1, 0]
    ],
    //   tower: [ // This is what currently si in effect, but 
    // Rampart Will be range,repair,tower,and other things needed that is not attack.
    //        ['tower', 1, 0]
    //    ],

    // This is a rampart dude that is placed and will always go to that location. 
    soloGuard: [
        ['rampartGuard', 1, 0]
    ],
    harass: [
        ['harass', 2, 5]
    ],
    harass1: [
        ['harass', 1, 5]
    ],

};



// This party is created and sent to the red flag when done. 

var _name = 0;
var _number = 1;
var _level = 2;

var spawn = require('commands.toSpawn');

function getModuleRole(role) {
    var spawnsDo = require('commands.toCreep');
    let allModule = spawnsDo.allModule();
    for (var a in allModule) {
        if (allModule[a][_name] == role) {
            return allModule[a][1];
        }
    }
}

function getSpawnCreating(flag) {
    // Rampart Defense, gotta create it where the flag appears.
    if (flag.memory.spawnRoom !== undefined) {
        flag.memory.musterRoom = flag.memory.spawnRoom;
        return flag.memory.musterRoom;
    }
    if (flag.memory.musterRoom === 'close') {
        flag.memory.musterRoom = returnClosestRoom(flag.pos.roomName);
        return flag.memory.musterRoom;
    }
    if (Game.rooms[flag.memory.musterRoom] !== undefined) {
        return flag.memory.musterRoom;
    }
    if (flag.name.substr(0, 6) == 'getMin' && flag.memory.musterRoom === 'none') {
        flag.memory.musterRoom = returnClosestRoom(flag.pos.roomName);
        return flag.memory.musterRoom;
    }

    if (flag.name.substr(0, 5) == 'rampa') {
        return flag.room.name;
    }
    if (flag.name.substr(0, 2) == 'RA') {
        return flag.room.name;
    }
     
    if ( flag.memory.bandit || flag.name.substr(0, 6) == 'bandit') {
                                flag.memory.bandit = true;
        flag.memory.musterRoom = returnClosestRoom(flag.pos.roomName);
        if (flag.memory.musterRoom === 'E53S59') {
            return 'E52S57';
        }
        if (flag.memory.musterRoom === 'E25S37') {
            return 'E28S37';
        }
        if (flag.memory.musterRoom === 'E54S53') {
            flag.memory.musterRoom ='E58S51';
        }
        return flag.memory.musterRoom;

    }

    if (flag.name.substr(0, 5) == 'power' ) {
        flag.memory.power = true;
        //        if (flag.memory.spawn) return allParty.smartPowerParty;
        flag.memory.musterRoom = returnClosestRoom(flag.pos.roomName);
        if (flag.memory.musterRoom === 'E53S59') {
            return 'E52S57';
        }
        if (flag.memory.musterRoom === 'E25S37') {
            return 'E28S37';
        }
        if (flag.memory.musterRoom === 'E54S53') {
            flag.memory.musterRoom ='E58S51';
        }
        return flag.memory.musterRoom;

    }

    if (flag.memory.musterRoom != 'none') {
        return returnClosestRoom(flag.pos.roomName);
    }
    return undefined;
}


function getCurrentParty(flag) {
    if (flag.memory.mineral || flag.name.substr(0, 6) == 'getMin') {
        flag.memory.mineral = true;
        if (flag.memory.noSKMineral || (flag.pos.roomName[2] === '5' && flag.pos.roomName[5] === '5')) {
            flag.memory.noSKMineral = true;
            return allParty.mineral2;
        }
        return allParty.mineral;

    }

    if (flag.name.substr(0, 4) == 'safe') {
        flag.memory.musterRoom = 'close';
        if(!flag.memory.removeFlagCount){
            flag.memory.removeFlagCount = flag.room.controller.safeMode;
        }
        return allParty.safemode;
    }

    if (flag.memory.party !== undefined) {
        return flag.memory.party;
    }
    if(flag.name === 'testBall' && flag.memory.prohibitDirection){
        flag.memory.rallyFlag = 'home';
        flag.memory.prohibitDirection = undefined;
        flag.memory.squadLogic = true;
        flag.memory.tusken = false;
    }
    if (flag.memory.power || flag.name.substr(0, 5) == 'power') {
        flag.memory.power = true;

        //if (Game.shard.name === 'shard1' || Game.shard.name === 'shard2') {
            //if (flag.memory.spawn === undefined || flag.memory.spawn) return allParty.smallPowerParty;
            flag.memory.spawnCounter = 1;
            if (flag.memory.spawn === undefined || flag.memory.spawn){
                //if(Memory.stats.totalMinerals.UH2O > 100000){
                if(Memory.empireSettings.boost.power){
                  return allParty.smarterPowerParty;   
                } else {
                  return allParty.smallPowerParty;   
                }
            }
        //} else {
    //        if (flag.memory.spawn === undefined || flag.memory.spawn) return allParty.smallPowerParty;
      //  }
    }
    if ( flag.memory.bandit || flag.name.substr(0, 6) == 'bandit') {

        return allParty.bandit;
    }
    //    console.log(flag.name.substr(0, ));

    if (flag.name.substr(0, 5) == 'rampa') {
        return allParty.rampart;
    }
    if (flag.name.substr(0, 2) == 'RA') {
        return allParty.soloGuard;
    }
    if (flag.name === 'controllerAttack') {
        return allParty.controllerAttack;
    }
    if (flag.memory.musterType !== 'none') {
        var party;
        if (allParty[flag.memory.musterType] !== undefined) {
            party = allParty[flag.memory.musterType];
        } else {
            //            console.log(flag, 'doesn"t have party or musterType', roomLink(flag.pos.roomName));
        }

        //if(flag.memory.musterType === 'guard') console.log('does it?',party);

        return party;
    }

}

function returnClosestRoom(roomName) {
    var distance = 100;
    var spawn;

    switch (roomName) {
    	case 'E51S50':
    	case 'E52S50':
    	case 'E53S50':
    	case 'E54S50':
    		return 'E58S51';
        case 'E20S37':
        case 'E20S38':
        case 'E20S39':
            return 'E23S38';
        case 'E60S43':
        case 'E60S44':
        case 'E60S45':
        case 'E60S46':
        case 'E60S47':
            return 'E59S42';

    }

    for (var e in Game.spawns) {
        if (Game.spawns[e].memory.alphaSpawn) {
            if (Game.spawns[e].room.name !== 'E14S38' && Game.spawns[e].room.name !== 'E54S53' && Game.spawns[e].room.name !== 'E14S37' && Game.spawns[e].room.controller.level === 8) {
                var tempDis = Game.map.getRoomLinearDistance(roomName, Game.spawns[e].room.name);
                if (tempDis < 11) {
                    var pathDistance = Game.map.findRoute(roomName, Game.spawns[e].room.name).length;
                    if(pathDistance < distance){
                            distance = tempDis;
                            spawn = Game.spawns[e];
                    }
                }
            }
        }
    }
    return spawn.room.name;

}

// This get the current total of each party member of currentParty.

function findPartyOld(flag) {

    let currentParty = getCurrentParty(flag);
    let total = [];

    for (var i in currentParty) {
        total[currentParty[i][_name]] = 0;
        for (var e in Game.creeps) {
            if (Game.creeps[e].memory.role == currentParty[i][_name] && Game.creeps[e].memory.party == flag.name) {
                total[currentParty[i][_name]]++;
            }
        }

        for (var o in Game.spawns) {
            let spawnz = Game.spawns[o];
            for (var z in spawnz.memory.warCreate) {
                if (currentParty[i][_name] == spawnz.memory.warCreate[z].memory.role && spawnz.memory.warCreate[z].memory.party == flag.name) {
                    total[currentParty[i][_name]]++;
                }
            }
            for (z in spawnz.memory.expandCreate) {
                if (currentParty[i][_name] == spawnz.memory.expandCreate[z].memory.role && spawnz.memory.expandCreate[z].memory.party == flag.name) {
                    total[currentParty[i][_name]]++;
                }
            }
        }

    }

    return total;
}
var partiedCreeps;

function findParty(flag, spawnCount) {
    /*
    if (spawnCount !== undefined && spawnCount[flag.name] !== undefined) {
        let currentParty = getCurrentParty(flag);
        let total = [];
        for (let i in currentParty) {
            total[currentParty[i][_name]] = 0;
            if (spawnCount[flag.name][currentParty[i][_name]] !== undefined) {
                total[currentParty[i][_name]] = spawnCount[flag.name][currentParty[i][_name]].count;
            }
            for (let o in Game.spawns) {
                if (!Game.spawns[o].memory.alphaSpawn) continue;
                let spawnz = Game.spawns[o];
                for (let z in spawnz.memory.warCreate) {
                    if (currentParty[i][_name] == spawnz.memory.warCreate[z].memory.role && spawnz.memory.warCreate[z].memory.party == flag.name) {
                        total[currentParty[i][_name]]++;
                    }
                }
                for (let z in spawnz.memory.expandCreate) {
                    if (currentParty[i][_name] == spawnz.memory.expandCreate[z].memory.role && spawnz.memory.expandCreate[z].memory.party == flag.name) {
                        //                        if( total[currentParty[i][_name]] == undefined) total[currentParty[i][_name]] = 0;
                        total[currentParty[i][_name]]++;
                    }
                }
            }
  //          if(total[currentParty[i][_name]] === 0)
//                console.log(flag.name,'New Find Party:',currentParty[i][_name],":",spawnCount[flag.name][currentParty[i][_name]].count,total[currentParty[i][_name]] );
        }

        return total;
    } */

    let currentParty = getCurrentParty(flag);
    let total = [];
    let partyCreeps = _.filter(Game.creeps, function(o) {
        return o.memory.party === flag.name;
    });
    partiedCreeps = partyCreeps;

    for (var i in currentParty) {
        total[currentParty[i][_name]] = 0;
        for (var e in partyCreeps) {
            if (partyCreeps[e].memory.role == currentParty[i][_name]) {
                total[currentParty[i][_name]]++;
            }
        }

        for (var o in Game.spawns) {
            let spawnz = Game.spawns[o];
            for (var z in spawnz.memory.warCreate) {
                if (currentParty[i][_name] == spawnz.memory.warCreate[z].memory.role && spawnz.memory.warCreate[z].memory.party == flag.name) {
                    total[currentParty[i][_name]]++;
                }
            }
            for (z in spawnz.memory.expandCreate) {
                if (currentParty[i][_name] == spawnz.memory.expandCreate[z].memory.role && spawnz.memory.expandCreate[z].memory.party == flag.name) {
                    total[currentParty[i][_name]]++;
                }
            }
        }

    }

    return total;
}

function getCost(module) {
    var total = 0;
    for (var i in module) {
        for (var e in BODYPART_COST) {
            if (module[i] == e) {
                total += BODYPART_COST[e];
            }
        }
    }
    return total;
}
    function returnRoleModule(flag, role) {
        if (flag.memory.party === undefined || flag.memory.party.length === 0) return;
        let allParty = flag.memory.party;
        for (let i in allParty) {
            if (allParty[i][0] === role) {
                return allParty[i];
            }
        }
        return;
    }


class partyInteract {
        static getPartyModule(flag, role) {
            return returnRoleModule(flag, role);
        }
        static addRole(flag,role,count,level){
            let module = returnRoleModule(flag, role);
            if (!module) {
                flag.memory.party.push([role,count,level]);
                return true;
            } else {
                return false;
            }
        }

        static removeRole(flag,role){
            let module = returnRoleModule(flag, role);
            if (module) {
                module = undefined;
                return true;
            } else {
                return false;
            }
        }

        static changeRoleCount(flag, role, number,level) {
            let module = returnRoleModule(flag, role);
            if (module) {
                module[1] = number;
                return true;
            } else {
                return false;
            }

        }
        static changeRoleLevel(flag, role, level) {
            let module = returnRoleModule(flag, role);
            if (module) {
                module[2] = level;
                return true;
            } else {
                return false;
            }
        }


    static returnClosestRoom(roomName) {
        return returnClosestRoom(roomName);
    }

    static rally(flag) {
        var currentParty; // = getCurrentParty(flag);


        var o;
        var a;
        if (flag.memory.waypointFlag !== undefined && flag.memory.waypointFlag !== false) {
            let rallied;
            rallied = Game.flags[flag.memory.rallyFlag];
            if (rallied === undefined) return;


            if (rallied !== undefined && rallied.room !== undefined) {
                let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 10);
                crps = _.filter(crps, function(o) {
                    if(o.memory.boostNeeded && o.memory.boostNeeded.length === 0 && o.memory.party == flag.name){
                        o.memory.partied = true;
                        return true;
                    }else if (!o.memory.boostNeeded && o.memory.party == flag.name) {
                        o.memory.partied = true;
                        return true;
                    }
                });
            }
        }

        if (!flag.memory.rallyFlag) {
            return;
        }
        //  if ( flag.memory.rallyFlag !== undefined && flag.room === undefined && flag.memory.rallyFlag !== false) {

        let rallied;
        if (flag.memory.rallyFlag === 'home') {
            var home = getSpawnCreating(flag);
            rallied = Game.flags[home];
        } else {
            rallied = Game.flags[flag.memory.rallyFlag];
        }
        if (rallied === undefined) return;

        currentParty = getCurrentParty(flag);
        var totalParty = 0;
        for (var e in currentParty) {
            {
                if (currentParty[e][_name] !== 'scientist' && currentParty[e][_name] !== 'first') {
                    totalParty += currentParty[e][_number];
                }
            }
        }

//        console.log(flag, "doing rally check @ ", flag.pos, roomLink(rallied.pos.roomName));
        flag.memory.totalNumber = totalParty;
        if(flag.memory.powerCreepFlag){
                let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 3);

                crps = _.filter(crps, function(o) {
                    return o.memory.party == flag.name && (!o.memory.boostNeeded||(o.memory.boostNeeded !== undefined && o.memory.boostNeeded.length === 0));
                });

                if (flag.memory.totalNumber !== 0 && crps.length >= flag.memory.totalNumber) {
                    let total = 0;
                    flag.memory.squadMode = 'travel';

                    let healers = [];
                    let others = [];
                    let point;
                    let a = crps.length;
                    while (a--) {
                        let creep = crps[a];
                        creep.memory.partied = true;
                        creep.memory.follower = true; // setup squad logic too.
                    }

                    flag.memory.squadID = [];
                    let caravan = crps;
                    for (let a = 0; a < caravan.length; a++) {
                            // Posistion for Battle and
                        caravan[a].memory.battlePos = a+1; 
                        flag.memory.squadID.push(caravan[a].id);
                        if (a === 0) {
                            caravan[a].memory.directingID = caravan[a+1].id;
                            caravan[a].memory.point = true;
                        } else if (a === caravan.length - 1) {
                            caravan[a].memory.followingID = caravan[a-1].id;
                            caravan[a].memory.point = false;
                        } else {
                            caravan[a].memory.directingID = caravan[a+1].id;
                            caravan[a].memory.followingID = caravan[a-1].id;
                            caravan[a].memory.point = false;
                        }
                    }


                }
            
        } else  if (flag.memory.squadLogic && totalParty > 0) {
            if (rallied !== undefined && rallied.room !== undefined) {
                let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 2);

                crps = _.filter(crps, function(o) {
                    return o.memory.party == flag.name && (!o.memory.boostNeeded||(o.memory.boostNeeded !== undefined && o.memory.boostNeeded.length === 0));
                });

                
                flag.memory.squadID = getIdArray(crps);

  //                                console.log( flag,crps.length);
//                                rallied.room.visual.text("💥" + flag.memory.totalNumber, totalParty, crps.length, rallied.room, 'total# check', rallied.pos.x - 5.5, rallied.pos.y - 5.5, { color: 'green', font: 0.8 });
                //                  rallied.room.visual.rect(rallied.pos.x - 5.5, rallied.pos.y - 5.5,
                //                        11, 11, { fill: 'transparent', stroke: '#f00' });

                if (flag.memory.totalNumber !== 0 && crps.length >= flag.memory.totalNumber) {
                    var total = 0;
                    flag.memory.setColor = {
                        color: COLOR_ORANGE,
                        secondaryColor: COLOR_ORANGE
                    };
                    flag.memory.squadMode = 'travel';

                    var healers = [];
                    var others = [];
                    var point;
                    let a = crps.length;
                    while (a--) {
                        var creep = crps[a];
//                        creep.partyFlag.setColor(COLOR_ORANGE, COLOR_ORANGE);

                        if (point === undefined) {
                            if (creep.memory.role !== 'healer') {
                                point = creep;
                            }
                            /* else
                            if (creep.memory.role === 'mage') {
                                point = creep;
                            }
                            else
                                                                if (creep.memory.role === 'mage') {
                                                                    point = creep;
                                                                }*/
                            else
                            if (a === 0) {
                                point = creep;
                            }
                        }

                        if (point === undefined || creep.id !== point.id) {
                            if (creep.memory.role === 'healer') {
                                healers.unshift(creep);
                            } else if (creep.memory.role === 'mage') {
                                healers.push(creep);
                            } else {
                                others.push(creep);
                            }
                        }

                        creep.memory.partied = true;
                        creep.memory.follower = true; // setup squad logic too.
                        // createWayPath(creep);
                    }


                    // Here we setup the travel caravan;
                    //                        console.log('SETTING CARAVAN', healers.length, others.length, point);

                    var caravan = [];
                    caravan.push(point);
                    if (point === undefined) return;
                    flag.memory.pointID = point.id;
                    if (healers.length > 0) {
                        caravan.push(healers.shift());
                    }
                    if (others.length > 0) {
                        caravan.push(others.shift());
                    }
                    while (healers.length > 0 || others.length > 0) {
                        if (others.length > 0) {
                            caravan.push(others.shift());
                        }
                        if (healers.length > 0) {
                            caravan.push(healers.shift());
                        }
                        if (others.length > 0) {
                            caravan.push(others.shift());
                        }
                    }
                    //                        console.log('AFTERSETTING CARAVAN', caravan.length);
                    flag.memory.squadID = [];
                    for (let a = 0; a < caravan.length; a++) {
                            // Posistion for Battle and
                        caravan[a].memory.battlePos = a+1; 
                        flag.memory.squadID.push(caravan[a].id);
                        if (a === 0) {
                            caravan[a].memory.directingID = caravan[a+1].id;
                            caravan[a].memory.point = true;
                        } else if (a === caravan.length - 1) {
                            caravan[a].memory.followingID = caravan[a-1].id;
                            caravan[a].memory.point = false;
                        } else {
                            caravan[a].memory.directingID = caravan[a+1].id;
                            caravan[a].memory.followingID = caravan[a-1].id;
                            caravan[a].memory.point = false;
                        }
                    }


                }
            }
            // So logic dictacts 
            // If you have just the followerID - your the leader.
            // Maybe the leader needs an additional Flag - so if he has no followers someone can find him. 
            // iF you have both ID's your middle. 
            // iF you just have the leader ID - your the last follower.

        } else if (flag.memory.totalNumber === 2) {
            if (rallied !== undefined && rallied.room !== undefined) {
                let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 5);
                //            console.log(crps.length);
                crps = _.filter(crps, function(o) {
                    //                  console.log(o.memory.party,flag.name);
                    return o.memory.party == flag.name;
                });
                  //              console.log('2',crps.length,rallied,flag);
                /*for (let a in crps) {
                    if (crps[a].memory.role === 'fighter') {
                        crps[a].memory.leader = true;
                    }
                } */
                if (crps.length >= flag.memory.totalNumber) {

                    if (flag.memory.squadLogic && !flag.memory.power && flag.secondaryColor !== COLOR_BLUE) {
                        flag.memory.setColor = {
                            color: COLOR_ORANGE,
                            secondaryColor: COLOR_WHITE
                        };
                        flag.setColor(COLOR_ORANGE, COLOR_WHITE);
                    } 
                    if(flag.memory.power){
                        crps[0].memory.leaderID = crps[1].id;
                        crps[0].memory.partied = true;

                        crps[1].memory.followerID = crps[0].id;
                        crps[1].memory.partied = true;
                    }else if (crps[0].memory.leader) {
                        crps[0].memory.leaderID = crps[1].id;
                        crps[0].memory.partied = true;

                        crps[1].memory.followerID = crps[0].id;
                        crps[1].memory.partied = true;
                    } else {
                        crps[1].memory.leaderID = crps[0].id;
                        crps[1].memory.partied = true;

                        crps[0].memory.followerID = crps[1].id;
                        crps[0].memory.partied = true;

                    }

                }
            }
        } else if (flag.memory.totalNumber === 1) {
            if (rallied !== undefined && rallied.room !== undefined) {
                let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 5);
                crps = _.filter(crps, function(o) {
                    return o.memory.party == flag.name;
                });
                for (let a in crps) {
                    crps[0].memory.partied = true;
                }
            }
        } else {
                           console.log('ERROR for These creeps, enable squadLogic',flag.name,roomLink(flag.pos.roomName));
        }


    }

    static create(flag, spawnCount) {
        var totalParty = findParty(flag, spawnCount); // This is the current count .
        //        var testParty = findParty2(flag);
        var currentParty = getCurrentParty(flag); // This is how much to muster.
        let totalPartyed = 0;
        for (let e in flag.memory.party) {
            totalPartyed += flag.memory.party[e][1];
        }
        flag.memory.totalNumber = totalPartyed;
        if (flag.memory.party === undefined) {
            flag.memory.party = currentParty;
        }
        //var e = currentParty.length;
        var allSpawned ;
        do{
            allSpawned = true;
        for (var e in currentParty) {
            for (var i in totalParty) {
  //              if(currentParty[e][_number] === 0) continue;
//                if(currentParty[e][_name] !== i) continue;
                if ((currentParty[e][_name] == i) && (totalParty[i] < currentParty[e][_number])) {
                    //Add to stack 
                    allSpawned = false;
                    let rando = Math.floor(Math.random() * flag.name.length);
                    let rando3 = Math.floor(Math.random() * 1000);

                    var death = false;
                    if (currentParty[e][_name] == 'first' || currentParty[e][_name] == 'scientist' || currentParty[e][_name] == 'wallwork') {
                        death = true;
                    }
                    var build = getModuleRole(currentParty[e][_name]).levels(currentParty[e][_level]);
                    var home = getSpawnCreating(flag);
                    let temp = {
                        build: build,
                        room: home, // This will return a room, and that room will add to alphaSpawn warstack.
                        spawn: home,
                        home: home,
                        name: currentParty[e][_name] + '#' + currentParty[e][_level] + "!" + Game.shard.name[0] + Game.shard.name[5] + flag.name[rando] + rando3,
                        memory: {
                            role: currentParty[e][_name],
                            home: home,
                            party: flag.name,
                            parent: undefined,
                            reportDeath: death,
                            boostNeeded: getModuleRole(currentParty[e][_name]).boosts(currentParty[e][_level],home),
                            level: currentParty[e][_level]
                        }
                    };
                    if(flag.memory.power){
                        temp.memory.powerParty = true;
                    }
                    if (currentParty[e][_name] == 'mule') {
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToExpandStack(temp);
                        totalParty[i]++;
                    } else if (currentParty[e][_name] == 'Aupgrader') {
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToExpandStack(temp);
                        totalParty[i]++;
                    } else if (currentParty[e][_name] == 'guard' || currentParty[e][_name] == 'shooter') {
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToExpandStack(temp);
                        totalParty[i]++;
                    } else {
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToWarStack(temp);
                        totalParty[i]++;
                    }
                }
            }
        }
                }while(!allSpawned);

//        console.log(allSpawned,"Is all spawned?");
        if (allSpawned) {
            //       console.log('all spawnedd');
            if (partiedCreeps.length > 0) {
                let tgt = _.min(partiedCreeps, o => o.ticksToLive);
                if (flag.memory.totalNumber === partiedCreeps.length) {
                    if (partiedCreeps[0].ticksToLive === undefined) {
                        flag.memory.rallyCreateCount = 250;
                    } else {
                        flag.memory.rallyCreateCount = tgt.ticksToLive;

                    }
                } else if (partiedCreeps[0].ticksToLive === undefined) {
                    flag.memory.rallyCreateCount = 30;
                } else {
                    flag.memory.rallyCreateCount = 15;
                }

            } else {
                flag.memory.rallyCreateCount = 150;
            }
//            console.log('doing create', flag, roomLink(flag.pos.roomName), allSpawned, partiedCreeps.length, flag.memory.rallyCreateCount);

        } else {
            flag.memory.rallyCreateCount = 0;
        }

    }

}

module.exports = partyInteract;