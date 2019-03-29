class buildLink {

    static roomRun(roomName) {
        var energyLimitSend = 300;
        if (Game.rooms[roomName] === undefined || (Game.rooms[roomName].masterLink === undefined) || Game.rooms[roomName].masterLink.energy > energyLimitSend && Game.rooms[roomName].masterLink._withdraw === undefined) return false;
        if (Game.rooms[roomName].memory.roomLinksID === undefined) { Game.rooms[roomName].memory.roomLinksID = []; }
        if (Game.rooms[roomName].memory.roomLinksID.length === 0) return false;
        if(!Game.rooms[roomName].memory.energyIn){
             energyLimitSend = 700;
        }
        var LINK;
        var linksID = Game.rooms[roomName].memory.roomLinksID;
        //var keys = Object.keys(linksID);
        //var z = linksID.length;
        //while (z--) {
          //  var zz = keys[z];
          for(let zz in linksID){
            LINK = Game.getObjectById(linksID[zz]);
            if ((!LINK) || (linksID[zz] == LINK.room.memory.masterLinkID)) {
                linksID.splice(zz, 1);
                continue;
            }
            if (LINK.cooldown !== 0) continue;
            if (LINK.energy >= energyLimitSend) {
                if (LINK.transferEnergy(LINK.room.masterLink) == OK) {
                    return true;
                }
            }
        }
        return false;
    }


    static deposit(creep) { // Used by harvesters

        if (creep.carry[RESOURCE_ENERGY] === 0) return false;
        if (creep.room.controller === undefined) return false;
        if (creep.room.controller.level < 5) return false;

        if (creep.memory.linkID === undefined) {
            let yy = coronateCheck(creep.pos.y - 1);
            let yy2 = coronateCheck(creep.pos.y + 1);
            let xx = coronateCheck(creep.pos.x - 1);
            let xx2 = coronateCheck(creep.pos.x + 1);
            var nlinkz = creep.room.lookForAtArea(LOOK_STRUCTURES, yy, xx, yy2, xx2, true);

            for (var i in nlinkz) {
                if (nlinkz[i].structure !== undefined && nlinkz[i].structure.structureType == 'link') {
                    creep.memory.linkID = nlinkz[i].structure.id;
                    creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY);

                    if (creep.room.memory.roomLinksID !== undefined && !_.contains(creep.room.memory.roomLinksID, nlinkz[i].structure.id)) {
                        creep.room.memory.roomLinksID.push(nlinkz[i].structure.id);
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
            let LINK = Game.getObjectById(creep.memory.linkID);
            if (creep.pos.isNearTo(LINK) && LINK.energy < LINK.energyCapacity) {
                creep.transfer(LINK, RESOURCE_ENERGY);
                return true;
            }
        }
    }

    static transfer(creep) {
        let yy = coronateCheck(creep.pos.y - 1);
        let yy2 = coronateCheck(creep.pos.y + 1);
        let xx = coronateCheck(creep.pos.x - 1);
        let xx2 = coronateCheck(creep.pos.x + 1);
        var nlinkz = creep.room.lookForAtArea(LOOK_STRUCTURES, yy, xx, yy2, xx2, true);

        for (var i in nlinkz) {
                if (creep.room.memory.roomLinksID && creep.room.memory.roomLinksID.length < 5 && nlinkz[i].structure && nlinkz[i].structure.structureType == 'link') {
                    if (creep.room.memory.roomLinksID &&  !_.contains(creep.room.memory.roomLinksID, nlinkz[i].structure.id)) {
                        creep.room.memory.roomLinksID.push(nlinkz[i].structure.id);
                    }
                }
            if (nlinkz[i].structure !== undefined && nlinkz[i].structure.energy !== undefined && nlinkz[i].structure.energy !== nlinkz[i].structure.energyCapacity) {
                if (creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY) == OK) {
                    if (nlinkz[i].structure.structureType == 'link') {
    //                    if (creep.room.memory.roomLinksID && creep.room.memory.roomLinksID.length < 5 && !_.contains(creep.room.memory.roomLinksID, nlinkz[i].structure.id)) {
  //                          creep.room.memory.roomLinksID.push(nlinkz[i].structure.id);
//                        }
                        if (nlinkz[i].structure.cooldown === 0) {
                            return true;
                        }
                    }
                    return false;
                }
            }
        }
        return false;
    }



}

module.exports = buildLink;