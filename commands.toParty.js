// This is the army,
// Used offensively.
// These will need to be added to the allreport.
var allParty = {
    engineer: [
        ['engineer', 1, 5],
    ],
    firstWave: [
        ['engineer', 1, 10], // Builder Engineer
        ['mule', 1, 11],
    ],
    secondWave: [
        ['engineer', 1, 10], // Builder Engineer
        ['mule', 3, 9],
    ],
    thirdWave: [
        ['engineer', 1, 11], //  Upgrade Engineer
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
        ['fighter', 1, 10],
        ['mage', 1, 6],
        ['thief', 4, 5],
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
    if (flag.memory.musterRoom === 'close') {
        flag.memory.musterRoom = returnClosestRoom(flag.pos.roomName);
        return flag.memory.musterRoom;
    }

    if (flag.name.substr(0, 5) == 'rampa') {
        return flag.room.name;
    }
    if (flag.name.substr(0, 2) == 'RA') {
        return flag.room.name;
    }
    if (Game.rooms[flag.memory.musterRoom] !== undefined) {
        return flag.memory.musterRoom;
    }
    if (flag.name.substr(0, 5) == 'power' || flag.name == 'bandit') {
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
        if(Game.shard.name === 'shard1') {
            if (flag.memory.spawn) return allParty.smarterPowerParty;
        } else {
            if (flag.memory.spawn) return allParty.smallpowerParty;
        }
    }
    if(flag.name == 'bandit') {
        return allParty.bandit;
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
            console.log(flag, 'doesn"t have party or musterType', roomLink(flag.pos.roomName));
        }
        return party;
    }

}

function returnClosestRoom(roomName) {
    var distance = 100;
    var spawn;

    switch(roomName){
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
function findParty(flag) {
    var currentParty = getCurrentParty(flag);
    var total = [];

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
        if (flag.name === 'bandit')
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
        //          console.log('Checking Rally',flag);
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

        if (flag.memory.wayPath === undefined) {
            flag.memory.wayPath = [];
            var test = {
                throughPortal: false,
                x: 1,
                y: 1,
                roomName: 'none'
            };
            flag.memory.wayPath.push(test);
        }

        var o;
        var a;


        if (flag.memory.rallyFlag !== false && flag.memory.rallyFlag !== undefined) {

            var rallied;
            if (flag.memory.rallyFlag === 'home') {
                var home = getSpawnCreating(flag);
                rallied = Game.flags[home];
                //                console.log(home, rallied);
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
            flag.memory.totalNumber = totalParty;
            if (flag.memory.squadLogic) {
                if (rallied !== undefined && rallied.room !== undefined) {

                    let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 5);
                    crps = _.filter(crps, function(o) {
                        return o.memory.party == flag.name;
                    });
                    rallied.room.visual.text("💥" + flag.memory.totalNumber, totalParty, crps.length, rallied.room, 'total# check', rallied.pos.x - 5.5, rallied.pos.y - 5.5, { color: 'green', font: 0.8 });
                    rallied.room.visual.rect(rallied.pos.x - 5.5, rallied.pos.y - 5.5,
                        11, 11, { fill: 'transparent', stroke: '#f00' });

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
                                if (creep.memory.role === 'fighter') {
                                    point = creep;
                                } else
                                if (creep.memory.role === 'demolisher') {
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
                                if (creep.memory.role === 'mage' || creep.memory.role === 'healer') {
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
                        console.log('SETTING CARAVAN', healers.length, others.length, point);

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
                        console.log('AFTERSETTING CARAVAN', caravan.length);
                        flag.memory.squadID = [];
                        for (let a = 0; a < caravan.length; a++) {

                            var ne = 1 + a;
                            var af = ne - 2;
//                            console.log(a, caravan[a], caravan[ne], caravan[af]);
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
            } else if (flag.memory.totalNumber === 2) {

                if (rallied !== undefined && rallied.room !== undefined) {
                    let crps = rallied.pos.findInRange(FIND_MY_CREEPS, 5);
                    crps = _.filter(crps, function(o) {
                        return o.memory.party == flag.name;
                    });
                    if (crps.length >= flag.memory.totalNumber) {
                        crps[0].memory.leaderID = crps[1].id;
                        crps[1].memory.followerID = crps[0].id;
                        crps[1].memory.partied = true;
                        crps[0].memory.partied = true;

                    }
                }
            } else {
                console.log('ERROR for These creeps, enable squadLogic',flag.name,roomLink(flag.pos.roomName));
            }

            //              break;
            //        }
        }
    }

    static create(flag) {
        var totalParty = findParty(flag);
        var currentParty = getCurrentParty(flag);
        let totalPartyed = 0;
        for (let e in flag.memory.party) {
            totalPartyed += flag.memory.party[e][1];
        }
        //console.log( _.sumBy(flag.memory.party, function(o) { return o.n[1]; }),"x" );        
        flag.memory.totalNumber = totalPartyed;

        if (flag.memory.party === undefined) {
            flag.memory.party = currentParty;
            //   console.log('testing', flag.memory.party, flag.name, currentParty);
        }
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

                    if (currentParty[e][_name] == 'mule' && (home == 'E38S81' || home == 'E38S72')) {
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
                    } else if (currentParty[e][_name] == 'mule' && home == 'E19S49') {
                        let term = Game.rooms[home].terminal;
                        //term.store.X > 1250 ||
                        if ( (term.store[RESOURCE_POWER] > 1250) && Game.rooms[home].storage.store[RESOURCE_ENERGY] > 100000) {
                            let toSpawn = require('commands.toSpawn');
                            toSpawn.addToWarStack(temp);
                            totalParty[i]++;
                        }
                    } else if (currentParty[e][_name] == 'mule') {
                            let toSpawn = require('commands.toSpawn');
                            toSpawn.addToExpandStack(temp);
                            totalParty[i]++;
                    }else if (currentParty[e][_name] == 'Aupgrader') {
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
    }

}

module.exports = partyInteract;