var guardParty = [
    ['guard', require('keeper.guard'), 1, 0]
];
var shooterParty = [
    ['shooter', require('keeper.shooter'), 1, 4]
];


var _name = 0;
var _require = 1;
var _number = 2;
var _level = 3;


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

function getSpawnCreating(flag) {
    if(flag.memory.spawnRoom === undefined) flag.memory.spawnRoom = 'none';
    if (flag.memory.spawnRoom !== 'none') {
        return flag.memory.spawnRoom;
    } 

} // Game.flags.Flag22.pos;
// E36S75
function getCurrentParty(flag) {
        switch (flag.memory.musterType) {
            case 'guard':
                return guardParty;
            case 'shooter':
                return shooterParty;
            default:
                return guardParty;
}
}

function findParty(flag) {
    var currentParty = getCurrentParty(flag);
    var creationRoom = getSpawnCreating(flag);
    var total = [];
    /*
        let yy = _.filter(Game.creeps, function(o) {
            return o.memory.party == flag.name;
        });*/
    for (var i in currentParty) {

        let zz = _.filter(Game.creeps, function(o) {
            return o.memory.role == currentParty[i][_name] && o.memory.party == flag.name;
        });
        total[currentParty[i][_name]] = zz.length;

        for (var a in currentParty) {

            for (var e in Game.spawns) {

                let spawnz = Game.spawns[e];

                for (var u in spawnz.memory.warCreate) {
                    if (spawnz.memory.warCreate[u] === undefined) {
                        console.log('error', spawnz.memory.warCreate[u], spawnz);
                    } else {
                        if (currentParty[a][_name] == spawnz.memory.warCreate[u].memory.role &&
                            spawnz.memory.warCreate[u].memory.party == flag.name) {
                            total[currentParty[a][_name]]++;
                        }
                    }
                }
                for (var z in spawnz.memory.expandCreate) {
                    if (spawnz.memory.expandCreate[z] === undefined) {
                        console.log('error', spawnz.memory.expandCreate[z], spawnz);
                    } else {
                        if (currentParty[a][_name] == spawnz.memory.expandCreate[z].memory.role &&
                            spawnz.memory.expandCreate[z].memory.party == flag.name) {
                            total[currentParty[a][_name]]++;
                        }
                    }
                }

            }

        }

    }
    return total;
}

class partyInteract {

    // So first thing is that a named Yellow flag needs to be placed first. 
    // The name of the flag determines which warband/party that will be created.

    static create(flag) {

        if (flag.room !== undefined && flag.room.memory !== undefined && flag.room.memory.guardRoom === undefined) {
            flag.room.memory.guardRoom = true;
        }
        if (flag.memory.musterType === undefined) {
            flag.memory.musterType = 'none';
        }
        var totalParty = findParty(flag);
        var currentParty = getCurrentParty(flag);

        for (var e in currentParty) {
            for (var i in totalParty) {
                if ((currentParty[e][_name] == i) && (totalParty[i] < currentParty[e][_number])) {

                    let home = getSpawnCreating(flag);
                    let temp = {
                        build: currentParty[e][_require].levels(currentParty[e][_level]),
                        room: home, // This will return a room, and that room will add to alphaSpawn warstack.
                        name: undefined,
                        party: flag.name,
                        memory: {
                            role: currentParty[e][_name],
                            home: home,
                            party: flag.name,
                            parent: 'default'
                        }
                    };
                    var spawn = _.filter(Game.spawns, function(sp) {
                        return sp.room.name == temp.room && sp.memory.alphaSpawn;
                    });
                    if (spawn.length > 0) {
//                        console.log('using new');
                        temp.memory.parent = spawn[0].id;
                        spawn[0].memory.expandCreate.unshift(temp);
                    } else {}

                    totalParty[i]++;

                }
            }
        }
    }


}

module.exports = partyInteract;