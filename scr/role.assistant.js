// Assist Role is designed to carry from target to storage/terminal.

var classLevels = [
    [CARRY, MOVE, CARRY, MOVE, CARRY, CARRY], // 300

    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, CARRY, MOVE], // 550

    [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], // 500 Carry

    [MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY,
        MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, // 1000 Carry?
    ], //1300
    [MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ], // 1500 carry.

    [MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, MOVE, MOVE, MOVE,

        MOVE, MOVE, MOVE, MOVE, MOVE,
        MOVE, MOVE, CARRY, CARRY, CARRY,

        CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY,

        CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY,

        CARRY, CARRY, CARRY, CARRY, CARRY,
        CARRY, CARRY, CARRY, CARRY, CARRY
    ],
    // level 6
    {
        body: [MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, MOVE, MOVE, MOVE, MOVE,

            MOVE, MOVE, MOVE, MOVE, MOVE,
            MOVE, CARRY, CARRY,

            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,

            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY,

            CARRY, CARRY, CARRY, CARRY, CARRY,
            CARRY, CARRY, CARRY, CARRY, CARRY
        ],
        boost: ['KH'],

    }

];

var roleParent = require('role.parent');


function getAssistTarget(creep) {
    // Well, this should be used for energy too! pre lv 6 rooms - meaing pre duo links.
    if (creep.room.memory.mineralName && Game.creeps[creep.room.memory.mineralName]) {
        creep.memory.targetCreepID = creep.room.memory.mineralName;
    }
    return;
}
/*
                let result;
                let end = new RoomPosition(info.endPoint.x, info.endPoint.y, info.endPoint.roomName);
                options.ignoreCreeps = true;
                let path;
                if (info.cachedPath[this.room.name] === undefined) {
                    path = this.pos.findPathTo(end);
                    info.cachedPath[this.room.name] = Room.serializePath(path);
                } else {
                    path = info.cachedPath[this.room.name];
                }
                if (this.pos.roomName === this.partyFlag.pos.roomName) {
                    this.memory.makePath = undefined;
                }

                result = this.moveByPath(path);
                console.log('Creating Path and moving by path', result, roomLink(this.room.name));
                this.say("MPath");
                return result;

*/

function takeFromTarget(creep, targetCreep) {
    //creep.say('taking');
    if (!targetCreep) return false;
    targetCreep.memory.assistID = creep.id;
    if (creep.carryTotal > 0) {
        if (creep.pos.isNearTo(creep.room.terminal)) {
            creep.transfer(creep.room.terminal, creep.carrying);
        } else 
        if (creep.pos.isNearTo(creep.room.storage)) {
            creep.transfer(creep.room.storage, creep.carrying);
        } else {
            if (creep.memory.pathToStorage === undefined && creep.pos.isNearTo(targetCreep)) {
                creep.memory.pathToStorage = Room.serializePath(creep.pos.findPathTo(creep.room.storage.pos,{ignoreCreeps: true}));
                creep.say('M');
                creep.moveMeByPath(creep.memory.pathToStorage,creep.room.storage);
            } else if (creep.memory.pathToStorage) {
                creep.say('M');
                creep.moveMeByPath(creep.memory.pathToStorage,creep.room.storage);
            } else {
                creep.moveMe(creep.room.storage, { reusePath: 50, ignoreCreeps: true });
                    creep.say('G');
            }
        }

    } else {
        if (creep.room.mineral.mineralAmount === 0) {
            creep.memory.death = true;
            return;
        }
        if (creep.pos.isNearTo(targetCreep)) {
            if (creep.pos.isNearTo(creep.room.extractor)) {
                creep.dance();
            }
            if (targetCreep.carryTotal > targetCreep.carryCapacity - targetCreep.stats('work') || targetCreep.carryTotal > creep.carryCapacity) {
                targetCreep.transfer(creep, targetCreep.carrying);
                creep.memory.stuckCount = 0;
            } else {
                creep.sleep(5);
            }
        } else {
            if (creep.memory.pathToStorage && creep.memory.pathToExtract === undefined && creep.pos.isNearTo(creep.room.storage)) {
                creep.memory.pathToExtract = Room.serializePath(creep.pos.findPathTo(creep.room.extractor.pos,{ignoreCreeps: true}));
                creep.say('M');
                creep.moveMeByPath(creep.memory.pathToExtract,creep.room.extractor);
            } else if (creep.memory.pathToExtract) {
                creep.say('BP');
                creep.moveMeByPath(creep.memory.pathToExtract,creep.room.extractor);
            } else {
                if (targetCreep.pos.isNearTo(creep.room.extractor)) {
                    let zed = Game.getObjectById(creep.room.memory.mineralContainID);
                    if(zed){
                        creep.moveMe(zed, { reusePath: 50 ,ignoreCreeps: true }); // ignoreCreeps: true, range: 1 
                    }else if(creep.memory.targetCreepID){
                        zed = Game.creeps[creep.memory.targetCreepID];
                        if(zed){
                            creep.moveMe(zed, { reusePath: 50 ,ignoreCreeps: true }); // ignoreCreeps: true, range: 1 
                        }
                    }  else {
                        creep.moveMe(creep.room.mineralContainer, { reusePath: 50 ,ignoreCreeps: true }); // ignoreCreeps: true, range: 1 
                    }
                    creep.say('G');
                } else {
                    creep.say('W');
                    creep.sleep(5);
                }
                
            }
        }
    }
    return true;
}

class roleAssistant extends roleParent {

    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        if (_.isArray(classLevels[level])) {
            return classLevels[level];
        }
        if (_.isObject(classLevels[level])) {
            return _.shuffle(classLevels[level].body);
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
//console.log(roomLink(creep.room.name),creep.memory.role);
        if (super.spawnRecycle(creep)) return;
        if (super.boosted(creep)) { return; }

        if (creep.memory.targetCreepID === undefined) {
            getAssistTarget(creep);
        }

        if (!takeFromTarget(creep, Game.creeps[creep.memory.targetCreepID])) {
            creep.memory.targetCreepID = undefined;
            creep.say('null');
            creep.sleep(10);
            return;
        }
    }
}

module.exports = roleAssistant;