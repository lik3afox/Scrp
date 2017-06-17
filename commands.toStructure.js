// Commands to structure
// Way for creep to interact wtih repair/build and constructionsite
// This needs to be fixed for goal and not to find a goal every tick


function getConstruction(creep) {
    return creep.room.find(FIND_MY_CONSTRUCTION_SITES);
}

function clearAllConstruction(creep) {
    var sites = creep.room.find(FIND_MY_CONSTRUCTION_SITES);
    for (var i in sites) {
        sites[i].remove();
    }
}

function setNewRepair(creep) {
    let repairs = getRepair(creep);
    //  creep.memory.goal = 
}

function getRepair(creep) {
    // Array returned will be others first - then roads.
    //    console.log('does this get used?');
    //  console.log('here?',test.length);
    return creep.room.find(FIND_STRUCTURES, {
        filter: object => (object.hits < object.hitsMax)
    }).sort((a, b) => a.hits - b.hits);
}
//[x,y,Type]
//   1   3
// 4 x x x 2
//   x   x
// 5 x x x 6
//   7   8

var buildOnLevel = [
    [
        [1, 2, STRUCTURE_TOWER],
        [1, 2, STRUCTURE_TOWER]
    ],
    [
        [1, 2, STRUCTURE_TOWER],
        [1, 2, STRUCTURE_TOWER]
    ],
    // Building into lv 2
    // 5 extensions
    [
        [-2, -2, STRUCTURE_EXTENSION],
        [2, 2, STRUCTURE_EXTENSION],
        [-2, 2, STRUCTURE_EXTENSION],
        [2, -2, STRUCTURE_EXTENSION],
        [-3, 2, STRUCTURE_EXTENSION]
    ],
    // Building into lv 3
    // 1 tower
    // 5 extensions
    [
        [1, -1, STRUCTURE_TOWER],
        [0, -4, STRUCTURE_EXTENSION],
        [-3, -2, STRUCTURE_EXTENSION],
        [-3, -4, STRUCTURE_EXTENSION],
        [0, -1, STRUCTURE_EXTENSION],
        [2, -2, STRUCTURE_EXTENSION]

    ],
    // Level 4 
    // 10 extensions
    // Storage
    [ //  [ 0,-1,STRUCTURE_STORAGE]

        /*  [-3, 2,STRUCTURE_EXTENSION],
    [-3,-2,STRUCTURE_EXTENSION],
    [-4, 0,STRUCTURE_EXTENSION],
    [ 4, 0,STRUCTURE_EXTENSION],
    [-2,-4,STRUCTURE_EXTENSION],
    [ 2,-4,STRUCTURE_EXTENSION],
    [-4, 2,STRUCTURE_EXTENSION],
    [-4, -2,STRUCTURE_EXTENSION],
    [ 4, -2,STRUCTURE_EXTENSION],
    [ 4, 2,STRUCTURE_EXTENSION]
*/
    ] /* */
    // level 5
    // 10 extensions
    // 2 links
    // 1 tower
    /*
    [   [ 1, 1,STRUCTURE_TOWER],

        [6, -5,STRUCTURE_LINK], 
        [-9, 2,STRUCTURE_LINK],

        [-3, -3,STRUCTURE_EXTENSION],
        [-5,-1 ,STRUCTURE_EXTENSION],
        [-6, 0,STRUCTURE_EXTENSION],
        [-5, 1,STRUCTURE_EXTENSION],
        [-3, 3,STRUCTURE_EXTENSION],
        [-3, 5,STRUCTURE_EXTENSION],
        [-1, 5,STRUCTURE_EXTENSION],
        [1, 5,STRUCTURE_EXTENSION],
        [0, 6,STRUCTURE_EXTENSION],
        [2, 4,STRUCTURE_EXTENSION]

       ], 
    // level 6
    // 10 extensisons
    // 1 link
    // 1 extractor
    // 3 labs
    // terminal     33,27
    [   
    [ -7, -13,STRUCTURE_LINK],

        [1, 7,STRUCTURE_EXTENSION],
        [2, 6,STRUCTURE_EXTENSION],

        [3,5,STRUCTURE_EXTENSION],
    [4,4,STRUCTURE_EXTENSION],
    [5,3,STRUCTURE_EXTENSION],
    [3,3,STRUCTURE_EXTENSION],
    [5,1,STRUCTURE_EXTENSION],
    [-6,2,STRUCTURE_EXTENSION],
    [-5,3,STRUCTURE_EXTENSION],
    [ 1, -5,STRUCTURE_EXTENSION],
    [ 3, -1,STRUCTURE_EXTENSION]

       ]*/
    // level 7
    // 10 extensions
    // 1 spawn
    // 1 link
    // 1 tower
    // 3 labs


    // level 8 
    // 10 extensions
    // 1 spawn
    // 3 towers
    // 2 links
    // 4 labs
    // 1 observer
    // 1 power spawn


];
/*, // There is no zero level.

// Things built once controller level 2
// 5 structures - 
[ [1,1,STRUCTURE_EXTENSION],
[-1,1,STRUCTURE_EXTENSION]
], // Level 1 doesn't do anything. 


// Controller level 3
// 5 structures
// 1 tower.

] */

function build(spawn, level) {
    //    if(level+1 > buildOnLevel.length) return;
    if (spawn.name == 'UpgradeSpawn') return;
    for (var e in buildOnLevel[level]) {

        spawn.room.createConstructionSite(buildOnLevel[level][e][0] + spawn.pos.x, buildOnLevel[level][e][1] + spawn.pos.y, buildOnLevel[level][e][2]);
    }
}

class StructureInteract {

    static buildConstrLevel(spawn, level) {
        build(spawn, level);
    }

    static getConstrSite(creep) {
        var targets = getConstruction(creep);
        targets.sort((a, b) => a.hits - b.hits);
        return targets;
    }

    static getRepairSite(creep) {
        var targets = getRepair(creep);
        targets.sort((a, b) => a.hits - b.hits);
        return targets;
    }

    static pickUpNonEnergy(creep) {
        if (_.sum(creep.carry) == creep.carryCapacity) return false;
        var stuff = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5);
        //      console.log(stuff.length);
        //        stuff = _.filter(stuff,{filter:o => o.resourceType != RESOURCE_ENERGY});
        //     let workparts = _.filter(stuff,function(n) {return n.resourceType != RESOURCE_ENERGY});
        //     console.log(stuff.length,workparts.length);
        if (stuff.length === 0) return false;
        if (creep.pos.isNearTo(stuff[0])) {
            for (var e in stuff) {
                creep.pickup(stuff[e]);
            }
        } else {
            creep.moveTo(stuff[0]);
        }
        creep.say('!');
        return true;
    }

    static pickUpCloseNonEnergy(creep) {
        var stuff = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 5, {
            filter: object => (object.resourceType != RESOURCE_ENERGY)
        });
        //       let workparts = _.filter(stuff,function(n) {return n.resourceType != RESOURCE_ENERGY});
        //stuff = _.filter(stuff,function(n){ })
        //      console.log('doing cllose enrgy test,',stuff.length,workparts.length);
        if (stuff.length === 0) {
            return false;
        }
        creep.say('stuff');
        if (creep.pos.isNearTo(stuff[0])) {
            creep.pickup(stuff[0]);
        } else {
            creep.moveTo(stuff[0]);
        }
        return true;
    }

    static pickUpEnergy(creep) {
        if (creep.room.controller !== undefined) {
            if (creep.room.controller.owner === undefined) {
                return false;
            }
        }

        var dEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1);
        if (dEnergy.length === 0) return false;
        creep.pickup(dEnergy[0]);
        return true;
    }

    static moveToPickUpEnergyIn(creep, range) {
        if (creep.memory.nextEnergyScan === undefined) { creep.memory.nextEnergyScan = 0; }
        creep.memory.nextEnergyScan--;
        if (creep.memory.nextEnergyScan < 0) {
            var dEnergy = creep.pos.findInRange(FIND_DROPPED_RESOURCES, range);
            if (dEnergy.length === 0) {
                creep.memory.nextEnergyScan = range;
                return false;
            }
            let close = dEnergy[0]; //= creep.pos.findClosestByRange(dEnergy);

            if (creep.pos.isNearTo(close)) {
                creep.pickup(close);
            } else {
                creep.moveTo(close, { maxRooms: 1 });
            }
            return true;
        }

        return false;

    }

    static dismantleTarget(creep, targetID) {
        let zz = Game.getObjectById(targetID);
        if (zz === null) return false;
        if (creep.pos.isNearTo(zz)) {
            creep.dismantle(zz);
        } else {
            creep.moveTo(zz);
        }
        return true;
    }

    static moveToDismantle(creep, type) {

        let finded = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == type);
            }
        });

        if (creep.pos.isNearTo(finded)) {
            creep.dismantle(finded);
            return true;
        } else {
            creep.moveTo(finded);
            return true;
        }

        return false;
    }

    static moveToPickUpEnergy(creep, min) {
        if (min === undefined) min = 0;
        var close = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
            filter: function(object) {
                return object.amount > min;
            }
        }); //.sort((a, b) => a.amount - b.amount); ;
        if (close === undefined) return false;
        //        creep.say(close.amount);
        if (creep.pos.isNearTo(close)) {
            creep.pickup(close);
        } else {
            creep.moveTo(close, {
                //                  ignoreRoads: _ignoreRoad,
                //                    reusePath: 49,
                maxRooms: 1,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#f0f',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        }
        return true;
        /*

        if(min === undefined) min = 0;
        //        var dEnergy = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCE);
                var tmp = creep.room.find(FIND_DROPPED_RESOURCE);//.sort((a, b) => a.amount - b.amount); ;
                let vv = tmp.length-(1+creep.memory.roleID);
                if (vv < 0 ) vv= 0;
             var   dEnergy = tmp[vv];
             
        //        console.log(creep.pickup(dEnergy),dEnergy.length);
        if(dEnergy === undefined ) return false;
        creep.say(dEnergy.amount);
        if(creep.pos.isNearTo(dEnergy)) {
            creep.pickup(dEnergy)
        }else {
            creep.moveTo(dEnergy);
        }
        return true; */
    }

    /*
        return creep.room.find(FIND_STRUCTURES, {
            filter: object => (object.hits < object.hitsMax &&
                object.structureType == STRUCTURE_ROAD)
        }).sort((a, b) => a.hits - b.hits); 

    */


    static createRoadAt(creep) {
        //    console.log(getConstruction(creep).length,creep);
        //    if(getConstruction(creep).length < 50 ) {

        var areaEast = creep.pos.findInRange(FIND_STRUCTURES, 1);
        var areaWest = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);

        //        console.log(areaWest.length,areaEast.length);
        if (areaEast.length + areaWest.length < 2) {
            var pos = creep.pos;
            var west = creep.room.createConstructionSite(pos, STRUCTURE_ROAD);
            console.log('Road construction', pos);
        }
        //    }
    }

    static doCloseRepair(creep) {
        let close = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: object => (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax))
        });

        let zlose = creep.pos.findInRange(FIND_STRUCTURES, 3);
        zclose = _.filter(zlose, function(object) {
            return (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax));
        });
        console.log(close.length, zlose.length);
        if (close.length > 0) {
            creep.say('cre');
            creep.repair(close[0]);
            return true;
        }
        return false;
    }

    static doCloseRoadRepair(creep) {
        if (creep.room.name == 'E27S75'
            //           || creep.room.name == 'E35S74'|| creep.room.name == 'E35S75'|| creep.room.name =='E36S75'
            //           || creep.room.name == 'E34S84'|| creep.room.name == 'E34S85'|| creep.room.name == 'E35S85'
            //          || creep.room.name == 'E25S76'|| creep.room.name == 'E26S76'|| creep.room.name == 'E26S75'
            //          || creep.room.name == 'E25S74'|| creep.room.name == 'E26S74'|| creep.room.name == 'E25S75'
        ) return false;

        if (creep.room.name == 'E27S74' &&
            creep.pos.x > 32 && creep.pos.y > 32) return false;

        let atFeet = creep.room.lookAt(creep.pos.x, creep.pos.y);
        for (var i in atFeet) {
            if (atFeet[i].type == 'structure' && atFeet[i].structure.structureType == STRUCTURE_ROAD &&
                (atFeet[i].structure.hits < atFeet[i].structure.hitsMax - 1500)) {
                //                console.log(atFeet[i],atFeet[i].structure.structureType,i,atFeet[i].structure.hits,              );
                //let dont = ['58de62291a511b1c34d01176','58de66302c883f369b9d05be','58dc3a0e6ac6a53b41864cfb'];
                //if(!_.includes(dont, atFeet[i].structure.id))
                if (creep.repair(atFeet[i].structure) == OK) {
                    return true;
                }
            }
        }

        return false;
    }
    static doCloseRoadBuild(creep) {
        if (creep.memory.closeRoadBuildTimer === undefined) {
            creep.memory.closeRoadBuildTimer = 0;
        }
        creep.memory.closeRoadBuildTimer--;
        if (creep.memory.closeRoadBuildTimer < 0) {
            let zbuild = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 1);
            if (zbuild.length === 0) {
                creep.memory.closeRoadBuildTimer = 4;
                return false;
            }
            creep.build(zbuild[0]);
        }
        return false;
    }

    static attackPowerbank(creep) {
        if (creep.memory.powerbankID === undefined) {
            let find = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });

            creep.memory.powerbankID = find[0].id;
        }

        let powerbank = Game.getObjectById(creep.memory.powerbankID);

        if (powerbank !== null) {
            //        if(creep.pos.isNearTo(powerbank)) {
            //              creep.attack(powerbank);
            //            } else {
            creep.say(creep.moveTo(powerbank));
            //      }
        }
    }
    static dismantlePowerbank(creep) {
        if (creep.memory.powerbankID === undefined) {
            let find = creep.room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_POWER_BANK });

            creep.memory.powerbankID = find[0].id;
        }

        let powerbank = Game.getObjectById(creep.memory.powerbankID);

        if (powerbank !== null) {
            if (creep.pos.isNearTo(powerbank)) {
                creep.say(creep.dismantle(powerbank));
            } else {
                creep.say(creep.moveTo(powerbank));
            }
        }
    }

    static doCloseBuild(creep) {

        let zbuild = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (zbuild === null) return false;
        creep.say('cbu');
        if (creep.build(zbuild) == ERR_NOT_IN_RANGE) {
            creep.moveTo(zbuild);
        }
        return true;

    }
    static doRepair(creep) {
        let close = creep.pos.findInRange(FIND_STRUCTURES, 3, {
            filter: object => (((object.structureType != STRUCTURE_WALL) && (object.structureType != STRUCTURE_RAMPART)) && (object.hits < object.hitsMax))
        });
        if (close.length > 0) {
            creep.repair(close[0]);
            return true;
        }
        return false;
    }

    static doBuild(creep) {
        let temp = creep.pos.findInRange(FIND_CONSTRUCTION_SITES, 3);

        if (temp.length === 0) return false;

        creep.build(temp[0]);
        creep.say('doB');
        return true;
    }


    static moveToBuild(creep) {
        if (creep.memory.constructionID === undefined) {
            var contargets = getConstruction(creep);
            if (contargets.length === 0) {
                return false;
            }
            let bb = creep.pos.findClosestByRange(contargets);
            creep.memory.constructionID = bb.id;
        }
        let ztarget = Game.getObjectById(creep.memory.constructionID);
        if (ztarget === null) {
            creep.memory.constructionID = undefined;
            return false;
        }

        creep.say('Build');
        if (creep.build(ztarget) == ERR_NOT_IN_RANGE) {
            creep.moveTo(ztarget);
        }
        return true;
    }

    static moveToRepair(creep) {
        var targets = getRepair(creep);
        if (targets.length > 0) {
            if (creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(targets[0], { reusePath: 30 });

            }
        } else {
            return false;
        }
        return true;
    }

    static moveToRepairWall(creep) {
        /*
                let targets = creep.room.find(FIND_STRUCTURES, { emily? 
                    filter: object => (object.structureType == STRUCTURE_WALL)
                }).sort((a, b) => a.hits - b.hits); */

        if (creep.memory.wallTargetID === undefined) {
            let targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => (object.structureType == STRUCTURE_WALL || object.structureType == STRUCTURE_RAMPART)
            }).sort((a, b) => a.hits - b.hits);
            if (targets.length > 0) {
                //    for(var e in targets) {
                //            if(targets[e].pos.y != 2 && targets[e].pos.roomName != 'E26S77') {
                creep.memory.wallTargetID = targets[0].id;
                //                break;                
                //          }
                //          }
            }
        }


        let target = Game.getObjectById(creep.memory.wallTargetID);

        if (target !== null) {
            creep.repair(target);
            if (!creep.pos.inRangeTo(target, 2)) creep.moveTo(target);
        } else {
            creep.memory.wallTargetID = undefined;
        }
    }

}
module.exports = StructureInteract;
