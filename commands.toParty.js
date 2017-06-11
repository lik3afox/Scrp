// This is the army,
// Used offensively.
// These will need to be added to the allreport.
var allParty = [
    ['healer', require('army.healer'), 1, 1], // Healer
    ['ranger', require('army.ranger'), 3, 1], // Focused attack.
    ['demolisher', require('army.demolisher'), 1, 1]
];

var basicParty = [
    ['Acontroller', require('army.controller'), 0, 0],
    ['fighter', require('army.fighter'), 0, 0],
    ['demolisher', require('army.demolisher'), 0, 2]
];

var demoParty = [
    //['demolisher', require('army.demolisher'), 1, 1],
    ['thief', require('army.thief'), 1, 3],

];
var engineerParty = [
    ['engineer', require('army.engineer'), 2, 5],
];
var engineer2Party = [
    ['engineer', require('army.engineer'), 1, 5],
];
var thiefParty = [
    ['thief', require('army.thief'), 2, 3],
];
var thief2Party = [
    ['thief', require('army.thief'), 1, 3],
];

var muleParty = [
    ['mule', require('army.mule'), 1, 1]
];

// Has 
/*
var defendParty = [
// towerfiller
// big wall repairer
// attacker
] */

var bigPowerParty = [
    ['fighter', require('army.fighter'), 1, 10],
    ['healer', require('army.healer'), 2, 4] // Healer
];

var smallPowerParty = [
    ['fighter', require('army.fighter'), 1, 8],
    ['healer', require('army.healer'), 1, 5] // Healer
];

var mageParty = [
    ['mage', require('army.mage'), 1, 0]
];

var warParty = [
    ['fighter', require('army.fighter'), 2, 11],
    ['first', require('role.first'), 1, 4],
    //    ['demolisher', require('army.demolisher'), 0, 1],
    ['ranger', require('army.ranger'), 1, 1],
    ['healer', require('army.healer'), 1, 6] // Healer    
];
// ID: 5836bb2241230b6b7a5b9a1f 8,6 e24s76

var scoutParty = [
    ['scout', require('army.scout'), 1, 0]
];
var testParty = [
    ['scout', require('army.scout'), 4, 0]
];

var controlParty = [
    ['Acontroller', require('army.controller'), 1, 0]
];
var recontrolParty = [
    ['recontroller', require('army.recontroller'), 1, 0]
];
var killParty = [
    ['ranger', require('army.ranger'), 1, 3]
    //    ['Acontroller', require('army.controller'), 1, 0]
];

var upgradeParty = [
    ['Aupgrader', require('army.upgrader'), 1, 6]
];
var upgrade2Party = [
    ['Aupgrader', require('army.upgrader'), 3, 6]
];
var upgradeRoomParty = [
    ['Aupgrader', require('army.upgrader'), 2, 6]
];

// Every base already has a wall repairer
// Also have it so the upgrader also repairs the wall
// If there's a mineral harvest - have him repair too.

var rampartParty = [
    ['tower', require('role.tower'), 1, 0],
    ['rampartGuard', require('army.rampartGuard'), 1, 0]

];
// This party is created and sent to the red flag when done. 

var _name = 0;
var _require = 1;
var _number = 2;
var _level = 3;

var spawn = require('commands.toSpawn');

function getCurrentParty(flag) {
    // Powerflags do not use this to create they will do it themselves.

    if (flag.name.substr(0, 5) == 'power') {
        if (flag.memory.spawn) return smallPowerParty;
        //        if (flag.memory.spawn) return bigPowerParty;
    }
    if (flag.name.substr(0, 5) == 'rampa') {
        return rampartParty;
    }
    switch (flag.name) {
        case 'test':
            return testParty;

        case 'upgradeRoom':
            return upgradeRoomParty;

        case 'warparty1':
        case 'warparty2':
        case 'warparty3':
            return warParty;

        case 'demo':
            return demoParty;

        case 'mule':
            return muleParty;

        case 'kill':
        case 'kill2':
            return killParty;

        case 'upgrade':
            return upgradeParty;


        case '2upgrade':
            return upgrade2Party;

        case '3upgrade':
            return upgrade2Party;

        case 'scout':
        case 'scout2':

            return scoutParty;

        case 'mage':
            return mageParty;
        case 'engineer2':
            return engineer2Party;

        case 'rampartDefender':
            return rampartParty;

        case 'engineer':
            return engineerParty;

        case 'fighter':
            return fighterParty;

        case 'demolish':
            return demolishParty;


        case 'control':
            return controlParty;

        case 'recontrol':
            return recontrolParty;

        case 'thief2':
            return thief2Party;
        case 'thief':
            return thiefParty;

        case 'thief3':
        case 'thief4':
        case 'thief5':
            return thief2Party;


        default:
            return basicParty;

    }
}

function getSpawnCreating(flag) {
    if (flag.name.substr(0, 5) == 'power') {
        if (flag.memory.spawn)
            return returnClosestRoom(flag.pos.roomName);
    }

    // Rampart Defense, gotta create it where the flag appears.
    if (flag.name.substr(0, 5) == 'rampa') {
        return flag.room.name;
    }

    switch (flag.name) {
        //    case 'scout2' :
        case 'warparty1':
            return 'W4S93';

        case 'warparty2':
            return 'E28S77';

        case 'warparty3':
        case 'demo':
            return 'E33S76';


        case '2upgrade':
            return 'W4S93';

            // case 'rampartDefender' :
            //    case 'upgrade':
            //      return 'E27S75';
        case '3upgrade':
        case 'thief5':
            return 'E35S73';
        case 'mule':
        case 'thief':
            return 'E35S73';

        case 'upgradeRoom':
            return 'E27S75';
        case 'engineer':
            return 'E26S73';

        case 'recontrol':
        case 'test':
        case 'control':
        case 'engineer2':
            return returnClosestRoom(flag.pos.roomName);
        case 'thief2':
            return 'E37S75';
        case 'thief3':
        case 'thief5':
            return 'E28S71';

        case 'upgrade':
            return 'E37S75';

        case 'thief2':
            return 'E35S83';
        case 'thief4':

            return 'E28S77';
            //      return 'E35S73';


        case 'engineer':
        case 'engineer2':
            return 'E28S73';

        case 'fighter':
            return 'E28S73';
        case 'upgrade':
            return 'E35S73';
        case 'scout':
            return returnClosestRoom(flag.pos.roomName);
        default:
        case 'scout':
            return 'E35S73';

            //      return 'E26S73';
    }


}

function returnClosestRoom(roomName) {
    var distance = 100;
    var spawn;

    switch (roomName) {
        case "E25S70":
        case "E24S70":
        case "E32S70":
            return "E26S73";
        case "E30S78":
        case "E30S77":
            return "E28S77";
        default:
            for (var e in Game.spawns) {
                if (Game.spawns[e].memory.alphaSpawn) {
                    var tempDis = Game.map.getRoomLinearDistance(roomName, Game.spawns[e].room.name);
                    if (tempDis < distance && Game.spawns[e].room.name != 'E35S73') {
                        distance = tempDis;
                        spawn = Game.spawns[e];
                    }
                }
            }
            if (spawn.room.name == 'E35S73') return 'E26S73';
            return spawn.room.name;
            //  break;
    }

}

// This get the current total of each party member of currentParty.
function findParty(flag) {
    var currentParty = getCurrentParty(flag);
    var total = [];
    let report = flag.name + " Party:";

    for (var i in currentParty) {
        total[currentParty[i][_name]] = 0;

        for (var e in Game.creeps) {
            if (Game.creeps[e].memory.role == currentParty[i][_name] && Game.creeps[e].memory.party == flag.name) {
                total[currentParty[i][_name]]++;
            }
        }

        for (var a in currentParty) {
            for (var o in Game.spawns) {
                let spawnz = Game.spawns[o];
                for (var z in spawnz.memory.warCreate) {
                    if (currentParty[a][_name] == spawnz.memory.warCreate[z].memory.role && spawnz.memory.warCreate[z].memory.party == flag.name) {
                        total[currentParty[a][_name]]++;
                    }
                }
            }
        }
        //                   function addFromCreateStack(totalCreeps,role,spawn) {
        report += currentParty[i][_name] + " Found:" + total[currentParty[i][_name]] + ':::';

    }
    console.log(report);

    return total;
}

/*BODYPART_COST: {
        "move": 50,
        "work": 100,
        "attack": 80,
        "carry": 50,
        "heal": 250,
        "ranged_attack": 150,
        "tough": 10,
        "claim": 600
    },*/

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

    // So first thing is that a named Yellow flag needs to be placed first. 
    // The name of the flag determines which warband/party that will be created.

    static runFlag() {

    }

    static rally(flag) {
        //  console.log('Checking Rally');
        var currentParty = getCurrentParty(flag);
        if (flag.memory.totalNumber === undefined) {
            var totalParty = 0;
            for (var e in currentParty) {
                totalParty += currentParty[e][_number];
            }
            flag.memory.totalNumber = totalParty;
        }

        if (flag.room !== undefined) {
            let crps = flag.pos.findInRange(FIND_MY_CREEPS, 5, { filter: o => o.memory.party == flag.name });
            if (crps.length > 0) {
                let total = 0;
                for (var o in crps) {
                    total++;
                    if (crps[o].memory.formationPos === undefined)
                        crps[o].memory.formationPos = total;
                }
            }
        }


        //  console.log(crps.length,flag.memory.creepIds)

        if (flag.memory.creepIds === undefined)
        //  if(crps.length == flag.memory.totalNumber) {
            flag.memory.creepIds = [];
        //for(var a in crps) {
        //    flag.memory.creepIds.push(crps[a].id);
        //    }
        // }


    }

    static create(flag) {
        var totalParty = findParty(flag);
        var currentParty = getCurrentParty(flag);
        //        console.log('here',totalParty.length);

        for (var e in currentParty) {
            for (var i in totalParty) {
                //          console.log(currentParty[e][_name],i,totalParty[i] , currentParty[e][_number],totalParty[i] < currentParty[e][_number]);

                if ((currentParty[e][_name] == i) && (totalParty[i] < currentParty[e][_number])) {
                    //Add to stack 
                    let rando = Math.floor(Math.random() * flag.name.length);
                    var death = false;
                    if (currentParty[e][_name] == 'first') death = true;
                    var build = currentParty[e][_require].levels(currentParty[e][_level]);
                    let temp = {
                        build: build,
                        spawn: getSpawnCreating(flag),
                        name: currentParty[e][_name] + '!' + flag.name[rando],
                        //                name: currentParty[e][_name]+,
                        memory: {
                            role: currentParty[e][_name],
                            home: 'default',
                            party: flag.name,
                            parent: 'default',
                            reportDeath: death,
                            level: currentParty[e][_level]
                        }
                    };

                    let toSpawn = require('commands.toSpawn');
                    toSpawn.addToWarStack(temp);
                    totalParty[i]++;
                }
            }
        }
    }

}

module.exports = partyInteract;
