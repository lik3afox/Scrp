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

//creep.moveToTransfer(creep.room.terminal,creep.carrying,{reusePath:20});
//creep.countStop();

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
        var storage = creep.room.terminal;

        if (storage === undefined) return false;
        creep.say(storage.store[RESOURCE_ENERGY]);
        if (storage.store[RESOURCE_ENERGY] === 0) return false;
        if (creep.pos.isNearTo(storage)) {
            for (var e in creep.carry) {
                creep.withdraw(storage, RESOURCE_ENERGY);
            }
        } else {
            creep.moveTo(storage);
        }

        return true;
    }

    static withdrawFromStorage(creep) {
        var storage = creep.room.storage;

        if (storage === undefined) return false;

        if (storage.store[RESOURCE_ENERGY] === 0 || storage.store[RESOURCE_ENERGY] === undefined ) {
           return false;
        }

        creep.say(storage.store[RESOURCE_ENERGY]);
        if (creep.pos.isNearTo(storage)) {
            creep.withdraw(storage, RESOURCE_ENERGY);
        } else {
            creep.say(creep.moveTo(storage, { maxRooms: 1 }));
            
        }

        return true;
    }

    static moveToWithdraw(creep) {


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
                    creep.moveTo(contain, { maxRooms: 1 });
                    return true;
                }
            }

            return false;


        }

    }

}
module.exports = ContainerInteract;
