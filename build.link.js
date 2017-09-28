function use() { "use strict"; }

var gameCache = [];

function getCached(id) {
    if (gameCache[id] !== undefined) {
        if (gameCache[id] === null) {
            //        console.log( 'Null Linked Cache',id);
            return null;
        } else {
            //        console.log('returned cache',gameCache[id],id);
            return gameCache[id];
        }
    }
    let zzz = Game.getObjectById(id);
    //    console.log('Created Cache');
    gameCache[id] = zzz;
    return zzz; //Game.getObjectById(id);
}

function newLinkTransfer() {
    var LINK;
    for (var e in Game.rooms) {
        if (Game.rooms[e].memory.roomLinksID !== undefined && Game.rooms[e].memory.roomLinksID.length > 0) {
            var linksID = Game.rooms[e].memory.roomLinksID;
            for (var zz in linksID) {
                LINK = Game.getObjectById(linksID[zz]);
                //                LINK.room.visual.text(LINK.cooldown, LINK.pos.x, LINK.pos.y + 1, { color: '#00000a ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 }); 
                if (LINK !== null) {
                    LINK.room.visual.text(LINK.cooldown, LINK.pos.x, LINK.pos.y + 1, { color: '#00000A ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                    if (LINK.energy !== 800) {

                        let targets = LINK.pos.findInRange(FIND_MY_CREEPS, 1);
                        targets = _.filter(targets, function(s) {
                            return (s.carry[RESOURCE_ENERGY] > 0 && s.memory.linkID == linksID[zz]);
                        });
                        if (targets.length !== 0) {

                            if (targets.length > 1)
                                targets.sort((a, b) => a.carry[RESOURCE_ENERGY] - b.carry[RESOURCE_ENERGY]);

                            ttarget = targets[0];

                            if (ttarget !== undefined) {
                                let vv = ttarget.transfer(LINK, RESOURCE_ENERGY);
                            }
                        }

                    }

                    if (LINK.energy > 0) {
                        if (LINK.room.memory.chainLinks[LINK.id] !== undefined) {
                            let nLink = Game.getObjectById(LINK.room.memory.chainLinks[LINK.id]);
                            if (nLink !== undefined && nLink.energy < 100 ) {
                                LINK.room.visual.line(LINK.pos, nLink.pos, { color: 'yellow' });
                                LINK.transferEnergy(nLink);
                            }
                        } else if (LINK.room.memory.masterLinkID !== undefined) {
                            let mLink = Game.getObjectById(LINK.room.memory.masterLinkID);
                            if (mLink !== undefined && mLink.energy < 100) {
                                LINK.room.visual.line(LINK.pos, mLink.pos, { color: 'white' });
                                LINK.transferEnergy(mLink);
                            }
                        }
                    }
                }
            }

            var chainID = Game.rooms[e].memory.chainLinks;
            for (var zzz in chainID) {
                LINK = Game.getObjectById(chainID[zzz]);
                if (LINK !== null && LINK.energy > 0) {
                    if (LINK.room.memory.chainLinks[LINK.id] !== undefined) {
                        let nLink = Game.getObjectById(LINK.room.memory.chainLinks[LINK.id]);
                        if (nLink !== undefined && nLink.energy < 100) {
                            LINK.room.visual.line(LINK.pos, nLink.pos, { color: 'yellow' });
                            LINK.transferEnergy(nLink);
                        }
                    } else if (LINK.room.memory.masterLinkID !== undefined) {
                        let mLink = Game.getObjectById(LINK.room.memory.masterLinkID);
                        if (mLink !== undefined && mLink.energy < 100) {
                            LINK.room.visual.line(LINK.pos, mLink.pos, { color: 'white' });
                            LINK.transferEnergy(mLink);
                        }
                    }
                }

            }

        }
    }
}

class buildLink {

    /** @param {Creep} creep **/
    static run() {
        newLinkTransfer();
        gameCache = []; // cleaning up cache for this tick.
    }

    static deposit(creep) { // Used by harvesters

        if (creep.carry[RESOURCE_ENERGY] === 0) return false;

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
                    //                    creep.memory.linkID = nlinkz[i].id;
                    creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY);

                    if (creep.room.memory.masterLinkID !== undefined) {
                        let mLink = Game.getObjectById(creep.room.memory.masterLinkID);
                        if (mLink !== null) {
                            if (nlinkz[i].structure.energy > 700)
                                nlinkz[i].structure.transferEnergy(mLink);
                            nlinkz[i].structure.room.visual.line(nlinkz[i].structure.pos, mLink.pos, { color: 'green' });
                        }
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

    static waitForTransfer(creep) {

        if (creep.carry[RESOURCE_ENERGY] === 0) return false;
        if (creep.memory.home !== creep.room.name) return false;
        if (creep.room.controller.level < 5) return false;

        if (creep.room.memory.roomLinksID === undefined)
            creep.room.memory.roomLinksID = [];
        if (creep.room.memory.chainLinks === undefined)
            creep.room.memory.chainLinks = {
                'fakeID': 'nextID'
            };
        let LINK;

        if (creep.memory.linkID !== undefined) {
            if(creep.room.memory.masterLinkID !== undefined && creep.memory.linkID  === creep.room.memory.masterLinkID) return false;
            LINK = getCached(creep.memory.linkID);
            if (LINK !== null && creep.pos.isNearTo(LINK)) {
                if (creep.room.memory.roomLinksID !== undefined && !_.contains(creep.room.memory.roomLinksID, creep.memory.linkID)) {

                    creep.room.memory.roomLinksID.push(creep.memory.linkID);
                }
                return true;
            }
        } else {


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
                    if (!_.contains(creep.room.memory.roomLinksID, creep.memory.linkID)) {
                        creep.room.memory.roomLinksID.push(creep.memory.linkID);
                    }
                    if (creep.memory.linkID === creep.room.memory.masterLinkID) {
                        return false;
                    }
                    return true;
                }
            }

        }

    }

}

module.exports = buildLink;