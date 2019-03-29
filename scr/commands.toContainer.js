// This class is designed to interact with containers
// getSortByClose
// moveTo
// withDraw

function getNonEmptyContain(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((
                structure.structureType == STRUCTURE_CONTAINER));
        }
    });
}

class ContainerInteract {
    static moveToTerminal(creep) {
        var terminal = creep.room.terminal;
        if (creep.pos.isNearTo(terminal)) {
            creep.countStop();
            creep.transfer(terminal, creep.carrying);
            return true;
        } else {
            creep.moveTo(terminal, { reusePath: 20 });
        }
        return false;
    }

    static moveToStorage(creep) {
        //        creep.say('2Storage');
        var storage = creep.room.storage;
        if (storage === undefined) return false;
        if (_.sum(storage.store) == storage.storeCapacity) return false;
        if (creep.pos.isNearTo(storage)) {
            for (var e in creep.carry) {
                creep.transfer(storage, e);
                creep.countStop();
                //                break;
            }
        } else {
            creep.moveTo(storage, {
                reusePath: 25
            });
        }
        return true;
    }
    static withdrawFromTerminal(creep) {
        var terminal = creep.room.terminal;
        if (terminal === undefined) return false;
        if (terminal.store[RESOURCE_ENERGY] === 0) return false;
        if (creep.pos.isNearTo(terminal)) {
            creep.withdraw(terminal, RESOURCE_ENERGY);
        } else {
            creep.moveTo(terminal, { reusePath: 30 });
        }

        return true;
    }

    static withdrawFromLink(creep, minium) {
        if (creep.className && creep.room.controller.isPowerEnabled) {
            let mLink = creep.room.masterLink;
            if (mLink.energy > 0) {
                if (creep.pos.isNearTo(mLink)) {
                    if (creep.withdraw(mLink, RESOURCE_ENERGY) === OK) {}
                } else {
                    creep.moveMe(mLink, { reusePath: 30 });
                }
            return true;
            }
            return false;
        }
        if (creep.room.masterLink === undefined) return false;
        if (minium === undefined) minium = 0;
        //        if(creep.room.name === 'W53S35') minium = 400;
        if (creep.room.masterLink.energy === 0) return false;
        if (creep.room.masterLink.energy <= minium) return false;
        if (creep.carryTotal === creep.carryCapacity) return false;
        if (creep.carrying !== RESOURCE_ENERGY && creep.carryTotal > 0) {
            creep.storeCarrying();
        }
        //let ezd = creep.moveToWithdraw(creep.room.masterLink,RESOURCE_ENERGY);
        let mLink = creep.room.masterLink;
        if (!creep.room._mLinkhasCreep) {
            //            console.log('masterlink check to make sure only 1 has job', creep.room._mLinkhasCreep, roomLink(creep.room.name), creep.memory.roleID, minium);
            if (creep.pos.isNearTo(mLink)) {
                if (creep.withdraw(mLink, RESOURCE_ENERGY) === OK) {

                }
                //                mLink._withdraw = true;
            } else {
                creep.moveMe(mLink, { reusePath: 30 });
            }
            creep.room._mLinkhasCreep = true;
            creep.say('MLINK');
            return true;
        } else if (mLink && creep.pos.isNearTo(mLink)) {
            creep.withdraw(mLink, RESOURCE_ENERGY);
            return true;
        }
        return false;
    }

    static withdrawFromStorage(creep) {
        var storage = creep.room.storage;
        if (storage === undefined || storage.store[RESOURCE_ENERGY] === 0 || storage.store[RESOURCE_ENERGY] === undefined) {
            return false;
        }

        //        creep.say(storage.store[RESOURCE_ENERGY]);
        if (storage.store[RESOURCE_ENERGY] < creep.carryCapacity) return false;
        if (creep.pos.isNearTo(storage)) {
            creep.withdraw(storage, RESOURCE_ENERGY);
        } else {
            creep.moveMe(storage, { maxRooms: 1, reusePath: 20 });

        }

        return true;
    }

    static moveToWithdraw(creep) {
        console.log('moveTowtidhaw', creep.room.name);

        if (creep.memory.containerID === undefined || creep.memory.containerID.length === 0) {
            var containers = getNonEmptyContain(creep);
            // = [];
            let contains = [];
            for (var e in containers) {
                contains.push(containers[e].id);
            }
            creep.memory.containerID = contains;
        }
        if (creep.memory.containerID.length < 1) return false;


        if (creep.memory.containerID.length > 0) {
            var goTo = creep.memory.roleID;
            while (creep.memory.containerID.length <= goTo) {
                goTo = goTo - creep.memory.containerID.length;
            }

            if (creep.memory.containerID[goTo] !== undefined) {
                let contain = Game.getObjectById(creep.memory.containerID[goTo]);
                if (contain === null) return false;
                if (contain.total === 0) {
                    return false;
                }

                if (creep.pos.isNearTo(contain)) {
                    creep.withdraw(contain, RESOURCE_ENERGY);
                    return true;
                } else {
                    creep.moveTo(contain, { maxRooms: 1, reusePath: 30 });
                    return true;
                }
            }

            return false;


        }

    }

}
module.exports = ContainerInteract;