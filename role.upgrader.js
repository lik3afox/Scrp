/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.upgrader');
 * mod.thing == 'a thing'; // true
 */

// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.
var classLevels = [
    //0
    [WORK, WORK, CARRY, MOVE], // 300
    //1
    [WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 550
    //2
    [CARRY, WORK, CARRY, MOVE, WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 800
    //3
    [WORK, WORK, WORK, WORK, WORK, CARRY, WORK, CARRY, MOVE, WORK, WORK, CARRY, WORK, WORK, CARRY, MOVE], // 1300

    //4  - Energy enough for 1800 @ lv 5 room.
    [MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //5
    [MOVE, WORK, MOVE, WORK, WORK, CARRY, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
    //6
    [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE],
    // 7
    {
        body: [MOVE, MOVE, MOVE, MOVE,  CARRY, CARRY, CARRY, CARRY, CARRY,WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,],
        boost: ['XGH2O'],
    },
    // 8
    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],
    [], //9
    [], // 10
];

var containers = require('commands.toContainer');
var structures = require('commands.toStructure');
var roleParent = require('role.parent');

function doUpgradeIn(creep) {
    var pos;

    // first in array is the last posisiton for older creeps.
    switch (creep.pos.roomName) {
        case 'E28S42':
            pos = [
                new RoomPosition(23, 21, creep.room.name),
                new RoomPosition(24, 21, creep.room.name),
            ];
            break;
        case 'E24S33':
            pos = [
                new RoomPosition(8, 12, creep.room.name),
            ];
            break;
        case 'E37S34':
            pos = [
                new RoomPosition(31, 7, creep.room.name),
            ];
            break;

        case 'E18S36':
            pos = [
                new RoomPosition(38, 26, creep.room.name),
            ];
            break;
        case 'E14S37':
            pos = [
                new RoomPosition(38, 28, creep.room.name),
            ];
            break;
        case 'E1S11':
            pos = [
                new RoomPosition(31, 22, creep.room.name),
            ];
            break;
        case 'E25S47':
            pos = [
                new RoomPosition(8, 36, creep.room.name),
            ];
            break;
        case 'E27S45':
            pos = [
                new RoomPosition(15, 38, creep.room.name),
            ];
            break;
        case 'E17S45':
            pos = [
                new RoomPosition(13, 14, creep.room.name),
            ];
            break;
        case 'E38S72':
            pos = [
                new RoomPosition(36, 38, creep.room.name),
            ];
            break;
        case 'E2S24':
            pos = [
                new RoomPosition(40, 35, creep.room.name),
            ];
            break;
        case 'E55S58':
            pos = [
                new RoomPosition(15, 32, creep.room.name),
            ];
            break;
        case 'E51S31':

            pos = [
                new RoomPosition(35, 33, creep.room.name),
            ];
            break;
        case 'E21S49':

            pos = [
                new RoomPosition(36, 26, creep.room.name),
            ];
            break;
        case 'E39S51':
                pos = [
                    new RoomPosition(19, 13, creep.room.name),
                    new RoomPosition(19, 14, creep.room.name),

//                    new RoomPosition(18, 15, creep.room.name),
                    new RoomPosition(19, 15, creep.room.name),
                    new RoomPosition(20, 15, creep.room.name),

                    new RoomPosition(21, 15, creep.room.name),
                    new RoomPosition(22, 15, creep.room.name),
                    new RoomPosition(23, 15, creep.room.name),
                    new RoomPosition(23, 14, creep.room.name),
//                    new RoomPosition(23, 13, creep.room.name),
                    //                new RoomPosition(26, 25, creep.room.name),
                    //                new RoomPosition(37, 36, creep.room.name),
                    //                new RoomPosition(9, 14, creep.room.name),

                ];
            break;
        case 'E13S18':
                pos = [
                    new RoomPosition(18, 16, creep.room.name),
                    new RoomPosition(18, 15, creep.room.name),
                    new RoomPosition(17, 15, creep.room.name),
                    new RoomPosition(16, 15, creep.room.name),
                    new RoomPosition(16, 16, creep.room.name),
                    new RoomPosition(16, 17, creep.room.name),
                    new RoomPosition(17, 17, creep.room.name),

                ];
            break;

        case 'E19S49':
            if (Game.shard.name === 'shard3') {
                pos = [
                    //    new RoomPosition(44, 23, creep.room.name),
                    new RoomPosition(25, 25, creep.room.name),
                    new RoomPosition(24, 25, creep.room.name),
                    new RoomPosition(24, 26, creep.room.name),
                    new RoomPosition(24, 27, creep.room.name),
                    new RoomPosition(25, 27, creep.room.name),
                    //                new RoomPosition(26, 25, creep.room.name),
                    //                new RoomPosition(37, 36, creep.room.name),
                    //                new RoomPosition(9, 14, creep.room.name),

                ];
            } else {
                return false;
            }
            break;
        default:

            pos = [
                //    new RoomPosition(44, 23, creep.room.name),
                new RoomPosition(25, 27, creep.room.name),
                new RoomPosition(24, 27, creep.room.name),
                new RoomPosition(24, 26, creep.room.name),
                new RoomPosition(24, 25, creep.room.name),
                new RoomPosition(25, 25, creep.room.name),
                new RoomPosition(26, 25, creep.room.name),
                //                new RoomPosition(9, 14, creep.room.name),

            ];
            return false;

    }

    for (let ee in pos) {
        creep.room.visual.text(ee, pos[ee], { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
    }

    going = pos[creep.memory.roleID];
    if (going !== undefined) {
        if (!creep.pos.isEqualTo(going)) {
            creep.moveMe(going, {
                reusePath: 30,
                visualizePathStyle: {
                    fill: 'transparent',
                    stroke: '#bf0',
                    lineStyle: 'dashed',
                    strokeWidth: 0.15,
                    opacity: 0.5
                }
            });
        } else if(creep.room.controller.isEffected()){
            
        }  else if(creep.room.controller.level === 8){

            creep.memory.happy = true;
        }

    } else {
    }
    /*
        if (creep.pos.isNearTo(creep.room.terminal)) {
            creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
        } else {
            if (creep.pos.isNearTo(creep.room.storage)) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            }
        } */

}
var going;

class roleUpgrader extends roleParent {

    static levels(level,roomName) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if(Game.rooms[roomName] && Game.rooms[roomName].powerLevels && Game.rooms[roomName].powerLevels[PWR_OPERATE_CONTROLLER] && Memory.empireSettings.powers.controller ){
            let level = Game.rooms[roomName].powerLevels[PWR_OPERATE_CONTROLLER].level;
            let perTick = (level*10)+15;
            let _Body = [MOVE,MOVE,CARRY,CARRY,CARRY];//_.clone(classLevels[7].body);
            // so it's  25,35,45,55,65
            //          10,20,30,40,50
            // After lv 3 it needs to be split into two;
            if(level > 3){
                perTick = Math.floor(perTick/2);
                //require('commands.toSpawn').setModuleRole(roomName, 'upgrader', 2, 7);
            }
            for(let i = 0; i<perTick;i++){
                _Body.push(WORK);
                if(level !== 3 && i%4 == 3){
                    _Body.unshift(MOVE);            
                }
                if(_Body.length > 50) break;
            }
            console.log('Custom UPGRADER, ',perTick+15 ,_Body.length,_Body);
            return _Body;
        }

        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }

        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }

    static boosts(level,roomName) {
        if (Game.shard.name === 'shard3') return ['XGH2O'];
        if (!Memory.empireSettings.boost.upgrade) return [];
        if(roomName && Game.rooms[roomName] &&  Game.rooms[roomName].controller &&  Game.rooms[roomName].controller.level < 8) return ['XGH2O'];
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;

    }

    /** @param {Creep} creep **/
    static run(creep) {
        /*if ( creep.memory.happy && !creep.memory.death ) {
            if(creep.ticksToLive < 100){
                 creep.memory.happy = undefined;
            }
            if (creep.upgradeController(creep.room.controller) === OK) {
                creep.say('( -_･)σ---', true);
                //if(creep.room.controller.ticksToDowngrade === 200000 && creep.room.terminal.store[RESOURCE_POWER] && creep.ticksToLive > 1200){
               //     console.log(roomLink(creep.room.name),"Has an ugprader@",creep.room.controller.ticksToDowngrade,"and power in terminal");
             //   }
            } else {
                creep.memory.happy = undefined;
            }
            if (creep.carry.energy < creep.stats('upgrading') + 1) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            }
            return;
        }*/

      //  if( creep.ticksToLive < 100){ //!creep.memory.adjustedModule &&
//            require('commands.toSpawn').setModuleRole(creep.room.name, 'upgrader', 0, 7);
  //          creep.memory.adjustedModule = true;
    //    }

       // if (!creep.memory.boostNeeded && creep.ticksToLive > 1300 && creep.room.controller.level < 8) creep.memory.boostNeeded = ['XGH2O'];
    //    if (creep.memory.roleID === 0 && creep.ticksToLive < 150 && !creep.room.controller.isEffected() ) {
  //          super.rebirth(creep);
//        }
        if(!creep.room.controller.isEffected() && creep.getActiveBodyparts(WORK) > 15 && !Memory.empireSettings.powers.controller  && creep.room.controller.level == 8){
            require('commands.toSpawn').setModuleRole(creep.room.name, 'upgrader', 0, 7);            
            creep.memory.death = true;
        }
        if (super.spawnRecycle(creep)) {
            return;
        }
        if (super.boosted(creep)) {
            return;
        }
        if (creep.room.storage.store[RESOURCE_ENERGY] === 0) {
            creep.memory.death = true;
        } 

        if (creep.memory.level < 7 && creep.room.controller.level == 8) {
            creep.memory.death = true;
        }
        if (creep.memory.boostNeeded && creep.memory.boostNeeded.length > 0 && creep.ticksToLive < 1300 && creep.room.terminal && creep.room.terminal.store[creep.memory.boostNeeded[0]] === 0) creep.memory.boostNeeded = [];
//        if (super.depositNonEnergy(creep)) return;
        going = undefined;

        if (!doUpgradeIn(creep)) {
            if (creep.carry.energy < creep.stats('upgrading') + 1) {
                if (creep.room.masterLink && creep.room.masterLink.energy > 0 && creep.pos.isNearTo(creep.room.masterLink)) {
                    creep.withdraw(creep.room.masterLink, RESOURCE_ENERGY);
                } else if (going === undefined) {
                    if (creep.pos.isNearTo(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                        creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
                    } else {
                        creep.moveToWithdraw(creep.room.storage, RESOURCE_ENERGY);
                    }
                }

            }
        }
        if (creep.carry.energy < creep.stats('upgrading') + 1) {
            if (creep.pos.isNearTo(creep.room.storage) && creep.room.storage.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(creep.room.storage, RESOURCE_ENERGY);
            } else if (creep.pos.isNearTo(creep.room.terminal) && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
                creep.withdraw(creep.room.terminal, RESOURCE_ENERGY);
            }
        }
        let rsut = creep.upgradeController(creep.room.controller);
        if (rsut == ERR_NOT_IN_RANGE) {
            if (going === undefined) {
                creep.moveMe(creep.room.controller);
            }
            creep.say('Noooo!');
        } else if(rsut === OK && creep.room.controller.level !== 8){
    //        if(creep.pos.isNearTo(creep.room.storage)){
//                creep.memory.happy = true;
//                creep.say('( -_･)σ---');
  //          }
        } else if (rsut === OK){
            if(creep.pos.isNearTo(creep.room.storage) && !creep.pos.isNearTo(creep.room.boostLab)){
                creep.memory.happy = true;
//                creep.say('( -_･)σ---');
            }
            
        }
    }
}

module.exports = roleUpgrader;