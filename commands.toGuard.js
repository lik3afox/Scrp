var guardParty = [
['guard',require('keeper.guard'), 1, 0]
];
var shooterParty = [
['shooter',require('keeper.shooter'), 1, 4]
//['guard',require('keeper.guard'), 0, 0]
];

var _name = 0;
var _require = 1;
var _number = 2;
var _level = 3;


function getCost(module) {
  var total = 0;
  for (var i in module) {
    for(var e in BODYPART_COST) {
      if(module[i] == e) {
        total += BODYPART_COST[e];
      }
    }
  }
  return total;
}

function getSpawnCreating(flag) {
  switch(flag.name) {
    case 'Flag18' :
    return 'E26S73';
    break;
    case 'Flag26' :
    return 'E26S73';
    break;
    case 'Flag20' :
    return 'E26S77';
    break;
    case 'Flag28' :
    return 'E26S77';
    break;
    case 'Flag11' :
      return 'E28S73';
    break; 
    case 'Flag34' :
    case 'E36S74':
    case 'E36S75':
      return 'E35S73';
    break; 
    case 'Flag39' :
    case 'Flag41':
      return 'E35S83';
    break; 
    case 'Flag40':
      return 'E35S73';

    default:
      return 'E28S73';
    break; 
  } 

}
// E36S75
function getCurrentParty(flag) {
  switch(flag.name) {
    case 'Flag39' :
    case 'E36S75':

      return guardParty;
    break;
case 'Flag41':
case 'Flag40' :
case 'E36S74':
      return shooterParty;
    break;
case 'Flag11' :
    case 'Flag28' :
      return guardParty;
  break;    
    case 'Flag18' :
      return shooterParty;
    break;
    case 'Flag20' :
      return shooterParty;
    break;
    case 'Flag26' :
      return guardParty;
    break;
    case 'Flag34' :
      return guardParty;
    break;
    default:
      return guardParty;
    break; 
  } 
}


function findParty(flag){
var currentParty = getCurrentParty(flag);
var total = [];
    for(var i in currentParty) {
      
let zz = _.filter(Game.creeps,function(o){return o.memory.role == currentParty[i][_name] &&
          o.memory.party == flag.name });
      total[ currentParty[i][_name] ] = zz.length;

/*      for(var e in Game.creeps) {
        if(Game.creeps[e].memory.role == currentParty[i][_name] &&
          Game.creeps[e].memory.party == flag.name) {

          total[currentParty[i][_name]]++;
        }
      }*/

for(var a in currentParty) {
      for(var e in Game.spawns) {
        let spawnz = Game.spawns[e]
            for (var e in spawnz.memory.warCreate) {
                if (currentParty[a][_name] == spawnz.memory.warCreate[e].memory.role &&
                    spawnz.memory.warCreate[e].memory.party == flag.name) {
                    total[currentParty[a][_name]]++;
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

    if(flag.room != undefined && flag.room.memory != undefined && flag.room.memory.guardRoom == undefined) {
      flag.room.memory.guardRoom = true;
    }

        var totalParty = findParty(flag);
        var currentParty = getCurrentParty(flag);

	    for(var e in currentParty) {
    	    for(var i in totalParty) {
    	    	if((currentParty[e][_name] == i)&&(totalParty[i] < currentParty[e][_number])) {

            let temp = {
                build: currentParty[e][_require].levels(currentParty[e][_level]),
                spawn: getSpawnCreating(flag), // This will return a room, and that room will add to alphaSpawn warstack.
                name: undefined,
                memory: {
                    role: currentParty[e][_name],
                    home: 'default',
                    party:  flag.name,
                    parent: 'default'
                }
            }

              let toSpawn = require('commands.toSpawn');
              toSpawn.addToWarStack(temp);
              totalParty[i]++;

    				}
    	    }
    	}
	}


}

module.exports = partyInteract;
