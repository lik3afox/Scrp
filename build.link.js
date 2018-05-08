function use() { "use strict"; }

var gameCache = [];

function getCached(id) {
    return Game.getObjectById(id);
}

function newLinkTransfer() {
    var LINK;
    for (var roomName in Game.rooms) {
        if (Game.rooms[roomName].controller !== undefined && Game.rooms[roomName].controller.owner !== undefined && Game.rooms[roomName].controller.owner.username === 'likeafox') {
            if (Game.rooms[roomName].memory.roomLinksID === undefined) {
                Game.rooms[roomName].memory.roomLinksID = [];
            }
            if (Game.rooms[roomName].memory.roomLinksID.length > 0) {
                var linksID = Game.rooms[roomName].memory.roomLinksID;
                var keys = Object.keys(linksID);
                var z = linksID.length;

                while (z--) {
                    var zz = keys[z];
                    LINK = Game.getObjectById(linksID[zz]);
                    //                LINK.room.visual.text(LINK.cooldown, LINK.pos.x, LINK.pos.y + 1, { color: '#00000a ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 }); 
                    if (LINK !== null) {
                        LINK.room.visual.text(LINK.cooldown, LINK.pos.x, LINK.pos.y + 1, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                        if (LINK.energy !== 800) {

                            let targets = LINK.pos.findInRange(FIND_MY_CREEPS, 1);
                            targets = _.filter(targets, function(s) {
                                return (s.carry[RESOURCE_ENERGY] > 0 && (s.memory.role == 'transport' || s.memory.role == 'ztransport')); //&& s.memory.linkID == linksID[zz]
                            });
                            if (targets.length !== 0) {
                                ttarget = _.min(targets, o=>o.carry[RESOURCE_ENERGY]);

                                if (ttarget !== undefined) {
                                    let vv = ttarget.transfer(LINK, RESOURCE_ENERGY);
                                }
                            }

                        }

                        if (LINK.energy > 300 && LINK.cooldown === 0) {
                            if (LINK.room.memory.masterLinkID !== undefined) {
                                let mLink = Game.getObjectById(LINK.room.memory.masterLinkID);
                                if (LINK.structureType !== STRUCTURE_LINK) {
                                    linksID.splice(zz, 1);
                                } else {
                                    if (mLink !== null && mLink.energy < 100) {
                                        LINK.room.visual.line(LINK.pos, mLink.pos, { color: 'white' });
                                        
                                        if (LINK.transferEnergy(mLink) == OK) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        linksID.splice(zz, 1);
                    }

                    if (LINK !== null && linksID[zz] == LINK.room.memory.masterLinkID) {
                        linksID.splice(zz, 1);
                    }

                }
                Game.rooms[roomName].memory.chainLinks = undefined;
            }

        }
    }
}

class buildLink {

    /** @param {Creep} creep **/
    //   static run() {
    //       newLinkTransfer();
    //       gameCache = []; // cleaning up cache for this tick.
    //  }

    static roomRun(roomName) {

        if (Game.rooms[roomName] === undefined) return;
        if (Game.rooms[roomName].controller.level < 5) return;
        var LINK;
        if (Game.rooms[roomName].controller !== undefined && Game.rooms[roomName].controller.owner !== undefined && Game.rooms[roomName].controller.owner.username === 'likeafox') {
            if (Game.rooms[roomName].memory.roomLinksID === undefined) {
                Game.rooms[roomName].memory.roomLinksID = [];
            }
            if (Game.rooms[roomName].memory.roomLinksID.length > 0) {
                var linksID = Game.rooms[roomName].memory.roomLinksID;
                var keys = Object.keys(linksID);
                var z = linksID.length;

                while (z--) {
                    var zz = keys[z];
                    LINK = Game.getObjectById(linksID[zz]);
                    //                LINK.room.visual.text(LINK.cooldown, LINK.pos.x, LINK.pos.y + 1, { color: '#00000a ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 }); 
                    if (LINK !== null && LINK.structureType === STRUCTURE_LINK) {
                        LINK.room.visual.text(LINK.cooldown === undefined ? 0 : LINK.cooldown, LINK.pos.x, LINK.pos.y + 1, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                        if (LINK.energy !== 800) {

                            let targets = LINK.pos.findInRange(FIND_MY_CREEPS, 1);
                            targets = _.filter(targets, function(s) {
                                return (s.carry[RESOURCE_ENERGY] > 0 && (s.memory.role == 'transport' || s.memory.role == 'ztransport')); //&& s.memory.linkID == linksID[zz]
                            });
                            if (targets.length !== 0) {

                                let ttarget = _.min(targets,o=>o.carry[RESOURCE_ENERGY]);
                                let vv = ttarget.transfer(LINK, RESOURCE_ENERGY);
                            }

                        }

                        if (LINK.energy > 300 && LINK.cooldown === 0) {
                            if (LINK.room.memory.masterLinkID !== undefined) {
                                let mLink = Game.getObjectById(LINK.room.memory.masterLinkID);
                                if (LINK.structureType !== STRUCTURE_LINK) {
                                    linksID.splice(zz, 1);
                                } else {
                                    if (mLink !== null && mLink.energy < 100) {
                                        LINK.room.visual.line(LINK.pos, mLink.pos, { color: 'white' });
                                        
                                        if (LINK.transferEnergy(mLink) == OK) {
                                            break;
                                        }
                                    }
                                }
                            }
                        }
                    } else {
                        linksID.splice(zz, 1);
                    }

                    if (LINK !== null && linksID[zz] == LINK.room.memory.masterLinkID) {
                        linksID.splice(zz, 1);
                    }

                }
                Game.rooms[roomName].memory.chainLinks = undefined;
            }

        }


    }

    static deposit(creep) { // Used by harvesters

        if (creep.carry[RESOURCE_ENERGY] === 0) return false;
        if (creep.room.controller === undefined) return false;
        if (creep.room.controller.level < 5) return false;

        if (creep.memory.linkID === undefined) {
            let yy = creep.pos.y - 1;
            if (yy < 0) yy = 0;
            let yy2 = creep.pos.y + 1;
            if (yy2 > 49) yy2 = 49;
            let xx = creep.pos.x - 1;
            if (xx < 0) xx = 0;
            let xx2 = creep.pos.x + 1;
            if (xx2 > 49) xx2 = 49;
            var nlinkz = creep.room.lookForAtArea(LOOK_STRUCTURES, yy, xx, yy2, xx2, true);

            for (var i in nlinkz) {
                if (nlinkz[i].structure !== undefined && nlinkz[i].structure.structureType == 'link') {
                    creep.memory.linkID = nlinkz[i].structure.id;
                    creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY);

                    if (creep.room.memory.roomLinksID !== undefined && !_.contains(creep.room.memory.roomLinksID, nlinkz[i].structure.id)) {
                        creep.room.memory.roomLinksID.push(nlinkz[i].structure.id);
                    }


                    if (creep.room.memory.masterLinkID !== undefined) {
                        let mLink = Game.getObjectById(creep.room.memory.masterLinkID);
                        if (mLink !== null) {
                            if (nlinkz[i].structure.energy > 700)
                                nlinkz[i].structure.transferEnergy(mLink);
                            nlinkz[i].structure.room.visual.line(nlinkz[i].structure.pos, mLink.pos, { color: 'green' });
                        }
                    }
                    if (creep.memory.containerID !== undefined) {
                        var zz = Game.getObjectById(creep.memory.containerID);
                        if (zz !== null) {
                            if (creep.pos.isNearTo(zz)) {
                                zz.destroy();
                                creep.memory.containerID = undefined;
                            }
                        }
                        creep.memory.containerID = undefined;
                    }

                    return true;
                }
            }
        } else {
            let LINK = getCached(creep.memory.linkID);
            if (creep.pos.isNearTo(LINK)) {
                creep.transfer(LINK, RESOURCE_ENERGY);
                if (LINK.energy > 700 && creep.room.memory.masterLinkID !== undefined) {
                    let mLink = Game.getObjectById(creep.room.memory.masterLinkID);
                    if (mLink !== undefined) {
                        LINK.transferEnergy(mLink);
                    }
                }

                return true;
            }
        }
    }

    static transfer(creep) {
        if (!creep.carry[RESOURCE_ENERGY]) return false;
        let yy = coronateCheck(creep.pos.y - 1);
        let yy2 = coronateCheck(creep.pos.y + 1);
        let xx = coronateCheck(creep.pos.x - 1);
        let xx2 = coronateCheck(creep.pos.x + 1);
        var nlinkz = creep.room.lookForAtArea(LOOK_STRUCTURES, yy, xx, yy2, xx2, true);

        for (var i in nlinkz) {
            //            if (nlinkz[i].structure !== undefined && nlinkz[i].structure.structureType == 'link' && nlinkz[i].structure.energy < 800) {
            if (nlinkz[i].structure !== undefined && nlinkz[i].structure.energy !== undefined && nlinkz[i].structure.energy !== nlinkz[i].structure.energyCapacity) {

                if (creep.room.memory.roomLinksID !== undefined && !_.contains(creep.room.memory.roomLinksID, nlinkz[i].structure.id) && nlinkz[i].structure.structureType == 'link') {
                    creep.room.memory.roomLinksID.push(nlinkz[i].structure.id);
                }

                if (creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY) == OK) {
                    if (nlinkz[i].structure.structureType == 'link' && nlinkz[i].structure.cooldown === 0) {
                        return true;
                    }
                    return false;
                }
            }
        }
        return false;
    }



}

module.exports = buildLink;