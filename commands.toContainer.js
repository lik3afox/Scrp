// This class is designed to interact with containers
// getSortByClose
// moveTo
// withDraw

// Ineffecent needs to do ID and get ID to move so it doesn't have to go througha nd sort and grab all the sturctres.
function getNotFullContainers(creep) {
    let containers = creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity));
        }
    });
    //console.log('# of cotainers', containers.length);
    if (containers.length > 0) {
        return containers;
    } else {
        let storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return ((structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) < structure.storeCapacity));
            }
        });
        //        console.log('go to storage');
        return storage;
    }

}



function getNonEmptyContain(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_STORAGE ||
                structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) > 0));
        }
    });
}

function getClosestNotFullContain(creep) {
    return creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) > 0));
        }
    }).id;
}
/*
function getAllTypes(creep) {






        let storage = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (( (structure.structureType == STRUCTURE_STORAGE) ||
                     (structure.structureType == STRUCTURE_TOWER) ||
                     (structure.structureType == STRUCTURE_CONTAINER) ||
                     (structure.structureType == STRUCTURE_SPAWN) ||
                     (structure.structureType == STRUCTURE_EXTENSION) ||
                    (structure.structureType == STRUCTURE_LINK)
                     )
                    && (_.sum(structure.store) < structure.storeCapacity));
            }
        });

console.log('next',storage.length,real.length);
        return storage
}
/*
function depositToAll(creep) {
var flags = require('build.flags');
/*var real = [];

var newz = flags.inRoom('structures',creep);
for(var e in newz) {
    if(( (newz[e].structureType == STRUCTURE_STORAGE) ||
                     (newz[e].structureType == STRUCTURE_TOWER) ||
                     (newz[e].structureType == STRUCTURE_CONTAINER) ||
                     (newz[e].structureType == STRUCTURE_SPAWN) ||
                     (newz[e].structureType == STRUCTURE_EXTENSION) ||
                    (newz[e].structureType == STRUCTURE_LINK)
                     )
                    && (_.sum(newz[e].store) < newz[e].storeCapacity)&&
                    (creep.pos.isNearTo(newz[e] ))   ) {
        real.push(newz[e])
    }
} 

var allType = creep.pos.findInRange(FIND_STRUCTURES,1,{
            filter: (structure) => {
                return (( (structure.structureType == STRUCTURE_STORAGE) ||
                     (structure.structureType == STRUCTURE_TOWER) ||
                     (structure.structureType == STRUCTURE_CONTAINER) ||
                     (structure.structureType == STRUCTURE_SPAWN) ||
                     (structure.structureType == STRUCTURE_EXTENSION) ||
                    (structure.structureType == STRUCTURE_LINK)
                     )
                    && (_.sum(structure.store) < structure.storeCapacity));
            }
        });

        for(var i in allType) {
           if( creep.transfer(allType[i], RESOURCE_ENERGY)== OK ) {
            return true;
           }
        }
        return false;
}
*/
class ContainerInteract {
    constructor() {}
        /*

            static areAllRoomContainFull(room) {

                var structures = room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && (_.sum(structure.store) < structure.storeCapacity));
                    }
                });
                if (structures.length == 0) return true;
                else return false;

            }
            static ifNearContainer(creep) {
                return depositToAll(creep) ;
            }

        for(var i in Game.structures) {
            if(Game.structures[i].room.name == creep.room.name){
                if(Game.structures[i].structureType == STRUCTURE_CONTAINER) {
            console.log(Game.structures[i].room.name, creep.room.name,Game.structures[i].structureType);
                if(creep.pos.isNearTo(Game.structures[i]) ) {
                    if( creep.transfer(Game.structures[i],RESOURCE_ENERGY) == OK) {
                        return true;
                        }
                }
            }
            }
        }

        */
    static toContainer(creep) {
        let contain = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });

        if (creep.transfer(contain[0], RESOURCE_ENERGY) == OK) {
            return true;
        }
        return false;
    }
    static fromContainer(creep) {
        var containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        for (var e in containers) {
            if (creep.withdraw(containers[e], RESOURCE_ENERGY) == OK) {
                return true;
            }
        }
        return false;

    }
    static getSortNotFull(creep) {
        var containers = getNonEmptyContain(creep);
        //containers.sort((a, b) => a.hits - b.hits);
        return containers;
    }

    /*
       static  getSortByClose(creep) {
            var containers = getNonEmptyContain(creep);
            //containers.sort((a, b) => a.hits - b.hits);
            return containers;
        }
    */
    /*
       
    /*
    /*
        

    /*    static toCreep(creep) {
            let temp = creep.pos.findInRange(FIND_CREEPS,1, {
                filter: (creep) => {
                    return (creep.memory.role != 'harvester' && 
                        creep.memory.role != 'transport' &&
                        creep.memory.role != 'miner');
                }
            });

            if( creep.transfer(temp[0]) == OK) {
                creep.say('tran');
                return true;
            }
            return false;

        }*/
    static moveToTransfer(creep) {
        //console.log('used sued');
        var containers = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => {

                return (structure.structureType == STRUCTURE_CONTAINER && _.sum(structure.store) != structure.storeCapacity);
            }
        });
        if (containers === undefined || containers === null) return false;

        if (creep.pos.isNearTo(containers)) {
            creep.transfer(containers, RESOURCE_ENERGY);
        } else {
            creep.moveTo(containers);
        }

        return true;

    }
    static toWithdraw(creep) {
        var containers = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_CONTAINER);
            }
        });
        for (var e in containers) {
            if (creep.withdraw(containers[e], RESOURCE_ENERGY) == OK) {
                return true;
            }
        }
        return false;


    }
    static toStorage(creep) {
        var storage = creep.room.storage;
        if (creep.pos.isNearTo(storage)) {
            if (creep.transfer(storage, RESOURCE_ENERGY) == OK) {
                return true;
            }
        }
        return false;
    }
    static fromTerminal(creep) {
        var terminal = creep.room.terminal;
        if (creep.pos.isNearTo(terminal)) {
            if (creep.withdraw(terminal, RESOURCE_ENERGY) == OK) {
                return true;
            }
        }
        return false;

    }
    static fromStorage(creep) {
        var terminal = creep.room.storage;
        if (creep.pos.isNearTo(terminal)) {
            if (creep.withdraw(terminal, RESOURCE_ENERGY) == OK) {
                return true;
            }
        }
        return false;

    }

    static moveToTerminal(creep) {
        var terminal = creep.room.terminal;
        if (creep.pos.isNearTo(terminal)) {
            for (var e in creep.carry) {
                creep.countStop();
                creep.transfer(terminal, e);
            }
        } else {
            creep.moveTo(terminal);
        }
    }

    static moveToNuke(creep) {
        if (creep.room.memory.nukeID === undefined) {
            let zz = creep.room.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_NUKE });
            if (zz.length !== 0) {
                creep.room.memory.nukeID = zz[0].id;
            }
        }
        if (creep.room.memory.nukeID === undefined) return false;
        let nuke = Game.getObjectById(creep.room.memory.nukeID);
        if (creep.pos.isNearTo(nuke)) {
            creep.transfer(nuke, RESOURCE_ENERGY);
        } else {
            creep.moveMe(nuke);
        }
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
            creep.moveTo(storage);
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
        creep.say(storage.store[RESOURCE_ENERGY]);

        if (storage.store[RESOURCE_ENERGY] === 0) {
            return false;
        }
        if (creep.pos.isNearTo(storage)) {
            for (var e in creep.carry) {
                creep.withdraw(storage, e);
            }
        } else {
            creep.moveTo(storage, { maxRooms: 1 });
        }

        return true;
    }

    static depositTreasure(creep) {
        if (_.sum(creep.carry) > 0) {
            // go home and deposit.
            if (creep.memory.home != creep.room.name) {
                creep.moveTo(Game.getObjectById(creep.memory.parent));
            } else {
                container.moveToTerminal(creep);
            }
            creep.say('loot');
            return true;
        } else {
            return false;
        }
    }

    /*
    creep.room.find(FIND_STRUCTURES, {
        filter: (structure) => {
            return ((structure.structureType == STRUCTURE_CONTAINER ||
                structure.structureType == STRUCTURE_STORAGE) && (_.sum(structure.store) > 0));
        }
    });
*/

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
                if (contain === undefined) return false;
                if (_.sum(contain.store) === 0) {
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
