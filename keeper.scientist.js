var roleParent = require('role.parent');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');

var containers = require('commands.toContainer');

var boost = ['KH'];

var classLevels = [
    //0
    [MOVE, CARRY, WORK, WORK], //  300
    //1
    [MOVE, WORK, WORK, WORK, MOVE, CARRY], //  450
    //2
    [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, CARRY], // 550
    //3
    [MOVE, WORK, MOVE, WORK, WORK, WORK, WORK, MOVE, CARRY], // 550
    //4 700
    [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, CARRY, CARRY], // 550
    //5 2550/36
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY],
    //6 3400/48
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY],
    //7 4000/50    
    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK,
    ],

    {
        body: [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK],
        boost: ['UO'],
    }

];

function memoryCheck(creep) {
    if (creep.memory.distance === undefined) {
        creep.memory.distance = 0;
    }
    //        creep.memory.mineralID = creep.memory.goal;
}

class keeperSciRole extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return classLevels[level].body;
        } else {
            return classLevels[level];
        }
    }
    static boosts(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isObject(classLevels[level])) {
            return _.clone(classLevels[level].boost);
        }
        return;
    }
    static run(creep) {
        if (super.spawnRecycle(creep)) return true;

        let carry = creep.carryTotal;
        if (creep.ticksToLive > 1200 && creep.memory.boostNeeded === undefined && _.isObject(classLevels[creep.memory.level])) {
            creep.memory.boostNeeded = _.clone(classLevels[creep.memory.level].boost);
        }
        if (super.boosted(creep, creep.memory.boostNeeded)) {
            return;
        }

        memoryCheck(creep);

        if (movement.runAway(creep)) return;
        this.rebirth(creep);
        if (creep.partyFlag !== undefined) {
            creep.memory.goal = creep.partyFlag.memory.mineralID;
        }

        var _mineral = Game.getObjectById(creep.memory.goal);
        if (_mineral === null && creep.partyFlag !== undefined && creep.atFlagRoom) {
            if (creep.partyFlag.memory.mineral) {
                creep.memory.goal = creep.partyFlag.memory.mineralID;
                _mineral = Game.getObjectById(creep.memory.goal);
            } else {
                _mineral = movement.getSourcePos(creep);
            }
            if (_mineral === null) {
                console.log('Bad Mineral ending movement');
                return;
            }
        }

        if ( super.keeperWatch(creep)) { // two parter - keeperFind happens when
            return;
        }

        if (creep.memory.party !== undefined && creep.partyFlag.color === COLOR_WHITE && (carry > creep.carryCapacity - creep.stats('mineral'))) {
            creep.memory.death = true;
            return;
        }
        if(!creep.memory.party && creep.room.controller && creep.room.controller.level < 6 && creep.room.name === 'E14S38') {
            creep.memory.death = true;
            return;
        }
        if (_mineral !== null && _mineral.mineralAmount === 0) creep.memory.death = true;
        if (_mineral === null && creep.partyFlag !== undefined) {
            _mineral = creep.partyFlag;
        }

        if (creep.memory.ztransportID === undefined && _mineral && creep.room.name === _mineral.pos.roomName) {
            var trans = creep.room.find(FIND_MY_CREEPS);
            trans = _.filter(trans, function(object) {
                return object.memory.role == 'ztransport' && object.memory.goal == creep.memory.goal;
            });
            if (trans.length > 0) {
                trans[0].memory.scientistID = creep.id; // Ztransport looks for scientist and it withdrwas minerals from.
                creep.memory.ztransportID = trans[0].id;
            }
        } else if (creep.memory.ztransportID !== undefined) {
            let ztran = Game.getObjectById(creep.memory.ztransportID);
            if (ztran === null) {
                creep.memory.ztransportID = undefined;
            } else if (creep.pos.isNearTo(ztran) && (creep.carryTotal > (creep.carryCapacity - 100) || (ztran.carryCapacity - ztran.carryTotal) <= creep.carryTotal)) { // && ztran.carryCapacity-ztran.carryTotal >= creep.carry[creep.carrying]
                creep.transfer(ztran, creep.carrying);
            }
        }
        if (creep.hits <= 200) creep.suicide();
        if (creep.partyFlag && creep.room.name === creep.partyFlag.pos.roomName && creep.pos.inRangeTo(creep.partyFlag,7)) {
            let badz = creep.partyFlag.pos.findInRange(creep.room.notAllies, 7);
            // So if _mineral/party flag has bads around it. 
            //    badz = _.filter(badz, function(object) {
            //            return object.owner.username === 'Invader' && object.getActiveBodyparts(ATTACK) > 0 || object.getActiveBodyparts(RANGED_ATTACK) > 0;
            //      });
            if (badz.length > 0) {
                creep.sleep(5);
                return;
                /*            let distance = creep.pos.getRangeTo(badz[0]) ;
                            if (distance > 4) {
                                return;

                            } else if (distance === 4 && creep.pos.inRangeTo(_mineral,5)) {

                            } else {
                                creep.runFrom(badz[0]);
                                creep.say('AHHHHH',true);
                                return;
                            } */
            }
        }
        if (_mineral && !creep.pos.isNearTo(_mineral)) {
            var eda;

            creep.moveMe(_mineral, {
                reusePath: 49,
                ignoreCreeps: true,
//                swampCost: 1,
                useSKPathing: true,
            });

            //   }

        } else {
            let extract = creep.room.extractor;
            if (extract !== null && extract.cooldown === 0 && creep.carryTotal !== creep.carryCapacity) {
                if (creep.harvest(_mineral) == OK) {
                    if (creep.memory.goal === undefined) creep.memory.goal = _mineral.id;
                    super.keeperFind(creep);
                    let ez = Game.getObjectById(creep.memory.ztransportID);
                    if (ez === null) creep.memory.ztransportID = undefined;
                    creep.sleep(Game.time + EXTRACTOR_COOLDOWN);
                }

            }
        }

    }
}
module.exports = keeperSciRole;