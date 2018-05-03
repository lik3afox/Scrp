// This is the army,
// Used offensively.
// These will need to be added to the allreport.


var allParty = {
    shooter : [
    ['shooter',  1, 4]
    ],
    guard :[
    ['guard',  1, 1]
    ],
    engineer: [
        ['engineer', 1, 5],
    ],
    firstWave: [
        ['engineer', 1, 10], // Builder Engineer
        ['mule', 1, 10],
    ],
    secondWave: [
        ['engineer', 2, 12], // Upgrade Engineer
        ['mule', 3, 9],
    ],
    thirdWave: [
        ['engineer', 2, 7], //  Builder Engineer
        ['mule', 3, 9],
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
//        ['thief', 2, 6],
        ['mage', 1, 7],
        ['fighter', 1, 10],
    ],

    mineral:[
        ['mineral',1,7],
        ['ztransport',1,1],
        ['guard',1,0],
    ],
    mineral2:[
//        ['guard',1,0],
        ['mineral',1,7],
        ['ztransport',1,1],
    ],
    thief: [
        ['thief', 1, 4],
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
        ['mule', 2, 4],
    ],

    hmule: [
        ['mule', 2, 9],
    ],

    // Every base already has a wall repairer
    // Also have it so the upgrader also repairs the wall
    // If there's a mineral harvest - have him repair too.

    rampart: [ // This is what currently si in effect, but 
        // Rampart Will be range,repair,tower,and other things needed that is not attack.
        ['tower', 1, 0],
        ['wallwork', 2, 5],
        ['rampartGuard', 1, 0]
    ],
    tower: [ // This is what currently si in effect, but 
        // Rampart Will be range,repair,tower,and other things needed that is not attack.
        ['tower', 1, 0]
    ],

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
    var spawnsDo = require('build.spawn');
    let allModule = spawnsDo.allModule();
    for (var a in allModule) {
        if (allModule[a][_name] == role) {
            return allModule[a][1];
        }
    }
}

function getSpawnCreating(flag) {
    // Rampart Defense, gotta create it where the flag appears.
    if(flag.memory.spawnRoom !== undefined) {
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
        return returnClosestRoom(flag.pos.roomName);
    }

    if (flag.name.substr(0, 5) == 'rampa') {
        return flag.room.name;
    }
    if (flag.name.substr(0, 2) == 'RA') {
        return flag.room.name;
    }
    if (flag.name.substr(0, 5) == 'power' || flag.name == 'bandit') {
        flag.memory.power = true;
        //        if (flag.memory.spawn) return allParty.smartPowerParty;
        flag.memory.musterRoom = returnClosestRoom(flag.pos.roomName);
        return flag.memory.musterRoom;
    }

    if (flag.memory.musterRoom != 'none') {
        return returnClosestRoom(flag.pos.roomName);
    }
    return undefined;
}


function getCurrentParty(flag) {

    if (flag.memory.party !== undefined) {
        return flag.memory.party;
    }
    if (flag.name.substr(0, 5) == 'power') {
        flag.memory.power = true;
        if (Game.shard.name === 'shard1' || Game.shard.name === 'shard2') {
            if (flag.memory.spawn) return allParty.smarterPowerParty;
        } else {
            if (flag.memory.spawn) return allParty.smallPowerParty;
        }
    }
    if (flag.name == 'bandit') {
        return allParty.bandit;
    }
//    console.log(flag.name.substr(0, ));
    if (flag.name.substr(0, 6) == 'getMin') {
        flag.memory.mineral = true;
        if(flag.pos.roomName[2] === '5' && flag.pos.roomName[5] === '5'){
        return allParty.mineral2;    
        }
        return allParty.mineral;
//            mineral2

    }

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
        case 'E20S37':
        case 'E20S38':
        case 'E20S39':
            return 'E23S38';
    }

    for (var e in Game.spawns) {
        if (Game.spawns[e].memory.alphaSpawn) {
            if (Game.spawns[e].room.name !== 'E14S38' && Game.spawns[e].room.name !== 'E14S37' && Game.spawns[e].room.controller.level === 8) {
                var tempDis = Game.map.getRoomLinearDistance(roomName, Game.spawns[e].room.name);
                if (tempDis < distance) {
                    distance = tempDis;
                    spawn = Game.spawns[e];
                }
            }
        }
    }
    return spawn.room.name;

}

// This get the current total of each party member of currentParty.
function findParty(flag, spawnCount) {
    if (spawnCount !== undefined && spawnCount[flag.name] !== undefined) {
        let currentParty = getCurrentParty(flag);
        let total = [];
        for (let i in currentParty) {
            if (spawnCount[flag.name][currentParty[i][_name]] !== undefined) {
                total[currentParty[i][_name]] = spawnCount[flag.name][currentParty[i][_name]].count;
            } else {
                total[currentParty[i][_name]] = 0;
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
                        total[currentParty[i][_name]]++;
                    }
                }
            }
        }

        return total;
    }

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
        if (flag.name === 'getMinE25')
            console.log(flag.name + " Party:" + currentParty[i][_name] + " Found:" + total[currentParty[i][_name]] + ':::@' + roomLink(flag.pos.roomName));

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

class partyInteract {

    static returnClosestRoom(roomName) {
        return returnClosestRoom(roomName);
    }

    static rally(flag) {
        var currentParty; // = getCurrentParty(flag);
        if (flag.memory.portal === undefined) {
            flag.memory.portal = false; // This needs to be set true in order for creeps to rally then portal.
        }
        if (flag.memory.rallyFlag === undefined) {
            flag.memory.rallyFlag = false; // This needs to be set true in order for creeps to rally then portal.
        }
        if (flag.memory.musterRoom === undefined) {
            flag.memory.musterRoom = 'none';
        }
        if (flag.memory.musterType === undefined) {
            flag.memory.musterType = 'none';
        }

        var o;
        var a;


        if (flag.memory.rallyFlag !== false && flag.memory.rallyFlag !== undefined) {

            var rallied;
            if (flag.memory.rallyFlag === 'home') {
                var home = getSpawnCreating(flag);
                rallied = Game.flags[home];
            } else {
                rallied = Game.flags[flag.memory.rallyFlag];
            }
  //          if(Game.shard.name === 'shard2')
//            console.log(flag);
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
//            console.log(flag,flag.memory.rallyFlag,totalParty );
            flag.memory.totalNumber = totalParty;
            if (flag.memory.squadLogic && totalParty > 0) {
                if (rallied !== undefined && rallied.room !== undefined) {
                    let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 5);
                    crps = _.filter(crps, function(o) {
                        return o.memory.party == flag.name && o.memory.boostNeeded !== undefined && o.memory.boostNeeded.length === 0;
                    });
                    //                rallied.room.visual.text("💥" + flag.memory.totalNumber, totalParty, crps.length, rallied.room, 'total# check', rallied.pos.x - 5.5, rallied.pos.y - 5.5, { color: 'green', font: 0.8 });
                    //                  rallied.room.visual.rect(rallied.pos.x - 5.5, rallied.pos.y - 5.5,
                    //                        11, 11, { fill: 'transparent', stroke: '#f00' });

                    if (flag.memory.totalNumber !== 0 && crps.length >= flag.memory.totalNumber || crps.length === flag.memory.totalNumber) {
                        var total = 0;
                        flag.memory.setColor = {
                            color: COLOR_ORANGE,
                            secondaryColor: COLOR_ORANGE
                        };
                        flag.memory.squadMode = 'travel';

                        var healers = [];
                        var others = [];
                        var point;

                        for (a in crps) {
                            var creep = crps[a];
                            creep.partyFlag.setColor(COLOR_ORANGE, COLOR_ORANGE);

                            if (point === undefined) {
                                if (creep.memory.role === 'healer') {
                                    point = creep;
                                }
                                 else
                                if (creep.memory.role === 'mage') {
                                    point = creep;
                                }
                                /*else
                                                                    if (creep.memory.role === 'mage') {
                                                                        point = creep;
                                                                    }*/
                                else
                                if (a === crps.length - 1) {
                                    point = creep;
                                }
                            }

                            if (point === undefined || creep.id !== point.id) {
                                if( creep.memory.role === 'healer'){
                                    healers.unshift(creep);
                                } else if (creep.memory.role === 'mage' ) {
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

                            var ne = 1 + a;
                            var af = ne - 2;
                            flag.memory.squadID.push(caravan[a].id);
                            if (a === 0) {
                                caravan[a].memory.directingID = caravan[ne].id;
                                caravan[a].memory.point = true;
                            } else if (a === caravan.length - 1) {
                                caravan[a].memory.followingID = caravan[af].id;
                                caravan[a].memory.point = false;
                            } else {
                                caravan[a].memory.directingID = caravan[ne].id;
                                caravan[a].memory.followingID = caravan[af].id;
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
                    crps = _.filter(crps, function(o) {
                        return o.memory.party == flag.name;
                    });
                    for (let a in crps) {
                        if (crps[a].memory.role === 'fighter') {
                            crps[a].memory.leader = true;
                        }
                    }
                    if (crps.length >= flag.memory.totalNumber) {


if (flag.name.substr(0, 5) !== 'power') {
                flag.memory.setColor = {
                    color: COLOR_ORANGE,
                    secondaryColor: COLOR_WHITE
                }; 
                flag.setColor(COLOR_ORANGE, COLOR_WHITE);
}

                        if (crps[0].memory.leader) {
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
            } else {
                //                console.log('ERROR for These creeps, enable squadLogic',flag.name,roomLink(flag.pos.roomName));
            }

        }
    }

    static create(flag, spawnCount) {
        var totalParty = findParty(flag, spawnCount);
        var currentParty = getCurrentParty(flag);
        let totalPartyed = 0;
        for (let e in flag.memory.party) {
            totalPartyed += flag.memory.party[e][1];
        }
        flag.memory.totalNumber = totalPartyed;
//if(flag.name === 'getMinE25') console.log('should craete');
        if (flag.memory.party === undefined) {
            flag.memory.party = currentParty;
        }
        //var e = currentParty.length;
        for (var e in currentParty) {

            for (var i in totalParty) {
                if ((currentParty[e][_name] == i) && (totalParty[i] < currentParty[e][_number])) {
                    //Add to stack 
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
                            level: currentParty[e][_level]
                        }
                    };

                    if (currentParty[e][_name] == 'mule' && (home == 'E38S81' )) {
                        var terminalStuff;
                        terminalStuff = 0;
                        let term = Game.rooms[home].terminal;
                        for (var eez in term.store) {
                            if (eez !== RESOURCE_ENERGY) {
                                terminalStuff += term.store[eez];
                            }
                        }
                        if (terminalStuff > 1250) {
                            let toSpawn = require('commands.toSpawn');
                            toSpawn.addToWarStack(temp);
                            totalParty[i]++;
                        }
                    } else/* if (currentParty[e][_name] == 'mule' && home == 'E19S49') {
                        let term = Game.rooms[home].terminal;
                        //term.store.X > 1250 ||
                        if ((term.store[RESOURCE_POWER] > 1250) && Game.rooms[home].storage.store[RESOURCE_ENERGY] > 100000) {
                            let toSpawn = require('commands.toSpawn');
                            toSpawn.addToWarStack(temp);
                            totalParty[i]++;
                        }
                    } else*/ if (currentParty[e][_name] == 'mule') {
//                        console.log('heresz?',toSpawn.pos.roomName);
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToExpandStack(temp);
                        totalParty[i]++;
                    } else if (currentParty[e][_name] == 'Aupgrader') {
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToExpandStack(temp);
                        totalParty[i]++;
                    } else if (currentParty[e][_name] == 'guard' ||currentParty[e][_name] == 'shooter') {
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToExpandStack(temp);
                        totalParty[i]++;
                    } else {
    //                    if (currentParty[e][_name] === 'healer') {
//                            console.log(temp.build.length);
  //                      }
                        let toSpawn = require('commands.toSpawn');
                        toSpawn.addToWarStack(temp);
                        totalParty[i]++;
                    }
                }
            }
        }
    }

}

module.exports = partyInteract;