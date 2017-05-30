// Linkers are when you need to manually do something
// Container to storage
// Link to storage

// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    [CARRY, CARRY, MOVE],
    [CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE],
    [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE,
        CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE
    ],

    [CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE] // 500 
];

var roleParent = require('role.parent');
var sources = require('commands.toSource');
var containers = require('commands.toContainer');
var links = require('build.link');
var spawns = require('commands.toSpawn');
var constr = require('commands.toStructure');


var link = '585817a0c9b2061567d02260';

var spawn1 = '58af2ceb751600062cd0c58d';
var spawn2 = '58af4822278c0725a7ad4642';
var spawn3 = '58aff827090180496c7848fb';
var spawn4 = '58b11106554d4c1333aed29b';
var spawn5 = '58b4b98952bcc31f7967fb57';
var spawn6 = '58b765651d11996760a39d15';
var spawn7 = '58cc2556716771fd581ce04c';
var spawn8 = '58d97b7b8c94aa185ccaf659';
var spawn9 = '58dc1eb90c1c7697092ce5c2';
var E38S72 = '58fae20240468f2a39d50830';
var W4S93 = '59090e6f771e5d03793d20b4';
var E33S76 = '5923a6cbf9f4ceb75afbc831';
var upgradeSpawn = '58c074ead62936ed5e2bce0b';


function clearTerminal(creep) {
    let tgt = creep.room.terminal;
    if (creep.pos.isNearTo(tgt)) {
        for (var e in tgt.store) {
            creep.withdraw(tgt, e);
            return true;
        }
    } else {
        creep.moveTo(tgt);
        return true;
    }

    return false;
}

function toStorageOrTerminal(creep) {
    /*    if(creep.carry[0] != RESOURCE_ENERGY) {
            containers.moveToStorage(creep);
            return;
        } */
    let maxStorage = 850000;
    if (creep.room.name == 'E26S77') maxStorage = 400000;
    if (_.sum(creep.room.terminal.store) == 300000) {
        containers.moveToStorage(creep);
    } else if (creep.room.storage.store[RESOURCE_ENERGY] < 75000) {
        containers.moveToStorage(creep);
    } else if (creep.room.terminal.store[RESOURCE_ENERGY] < 20000 || creep.room.storage.store[RESOURCE_ENERGY] > 900000) {
        containers.moveToTerminal(creep);
    } else {
        if (creep.room.name == 'E35S83' && creep.memory.roleID == 1) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == OK) {
                    creep.moveTo(creep.room.terminal);
                }
            } else {
                creep.moveTo(creep.room.storage);
            }
        } else {
            containers.moveToStorage(creep);

        }
    }
}

function moveToAndDrop(creep, pos) {
    if (creep.pos.isEqualTo(pos)) {
        creep.drop(RESOURCE_ENERGY);
    } else {
        creep.moveTo(pos);
    }
}

function eitherOr(creep, containz1, containz2) {
    let contain = Game.getObjectById(containz1);
    let contain2 = Game.getObjectById(containz2);
    let target;
    if (contain === null || contain2 === null) return;
    if (contain.store[RESOURCE_ENERGY] > contain2.store[RESOURCE_ENERGY]) {
        target = contain;
    } else {
        target = contain2;
    }

    if (creep.pos.isNearTo(target)) {
        creep.withdraw(target, RESOURCE_ENERGY);
    } else {
        creep.moveTo(target);
    }

}

function E33S76Room(creep) {
    let goto;
    switch (creep.memory.roleID) {
        case 1:
            /*
                        let zz = creep.room.find(FIND_STRUCTURES);
                        zz = _.filter(zz, o => o.structureType == STRUCTURE_LAB && o.energy > 0 && o.mineralAmount > 0);
                        creep.say(zz.length);
                        if (zz.length > 0) {
                            if (creep.pos.isNearTo(zz[0])) {
                                if (zz[0].energy > 0) {
                                    creep.withdraw(zz[0], RESOURCE_ENERGY);
                                } else {
                                    creep.withdraw(zz[0], zz[0].mineralType);
                                }
                            } else {
                                creep.moveTo(zz[0]);
                            }
                        } */
            goto = creep.room.storage;
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== undefined && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20 //,ignoreCreeps:true
                });
            }
            break;

        case 0:
            goto = Game.getObjectById('5924991d4048d6d526242979');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20 //,ignoreCreeps:true
                });
            }
            break;

    }

}




function E33S76Transfer(creep) {
    switch (creep.memory.roleID) {
        case 3:
            goto = Game.getObjectById('5924524129c65d152e19c40c');
            if (goto !== null && creep.transfer(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20 //,ignoreCreeps:true
                });
            }
            break;
        case 2:
            goto = Game.getObjectById('59243d3f403da5a97dea664a');
            if (goto !== null && creep.transfer(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20 //,ignoreCreeps:true
                });
            }
            break;

        default:
            if (creep.room.storage === undefined) {
                moveToAndDrop(creep, new RoomPosition(32, 10, 'E33S76'));
            } else {
                containers.moveToStorage(creep);
            }

            break;
    }
}


function W4S93Room(creep) {
    let goto;
    switch (creep.memory.roleID) {
        case 0:
            let str = creep.room.terminal;
            goto = Game.getObjectById('590f2337820b9efc44a15794');
            if (goto !== null && goto.energy === 0) {
                if (!constr.moveToPickUpEnergyIn(creep, 2))
                    if (str.store[RESOURCE_ENERGY] > 20000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000)
                        if (creep.withdraw(str, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveMe(str, {
                                reusePath: 20
                            });
                        }

            } else {
                //             require('commands.toStructure').pickUpEnergy(creep);
                if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveMe(goto, {
                        reusePath: 20
                    });
                }
            }

            break;
        case 2:
        case 3:
            goto = Game.getObjectById('590b3a1614e74057589379e4');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20 //,ignoreCreeps:true
                });
            }
            break;
        case 1:

            goto = Game.getObjectById('590b378e112780517ff77f2b');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20 //,ignoreCreeps:true
                });
            }
            break;

    }

}




function W4S93Transfer(creep) {
    switch (creep.memory.roleID) {
        case 0:
            toStorageOrTerminal(creep);

            //            containers.moveToStorage(creep);
            break;

        default:
            //console.log( creep.room.powerspawn.energyCapacity)
            /*        if(creep.room.powerspawn.energy < creep.room.powerspawn.energyCapacity-1000) {
                                if(creep.pos.isNearTo(creep.room.powerspawn)) {
                           creep.transfer(creep.room.powerspawn,RESOURCE_ENERGY) 
                                }
                        } else { 
                       toStorageOrTerminal(creep);
                    }*/
            if (creep.room.storage === undefined) {
                moveToAndDrop(creep, new RoomPosition(9, 39, 'W4S93'));
            } else {
                containers.moveToStorage(creep);
            }
            break;
    }
}

function E38S72Room(creep) {
    let goto;
    switch (creep.memory.roleID) {
        case 0:
            let str = creep.room.terminal;
            goto = Game.getObjectById('590239e397a4002b4e9f550c');
            if (goto !== null && goto.energy === 0) {
                if (!constr.moveToPickUpEnergyIn(creep, 2))
                    if (str.store[RESOURCE_ENERGY] > 20000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000)
                        if (creep.withdraw(str, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveMe(str, {
                                reusePath: 20
                            });
                        }

            } else {
                //             require('commands.toStructure').pickUpEnergy(creep);
                if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveMe(goto, {
                        reusePath: 20
                    });
                }
            }

            break;
        case 1:

            goto = Game.getObjectById('58fbc7ff0262df0a18eb0cf5');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveMe(goto, {
                    reusePath: 20
                });
            }
            break;

    }

}




function E38S72Transfer(creep) {
    switch (creep.memory.roleID) {

        default:
        //console.log( creep.room.powerspawn.energyCapacity)
            if (creep.room.powerspawn.energy < creep.room.powerspawn.energyCapacity - 1000) {
                if (creep.pos.isNearTo(creep.room.powerspawn)) {
                    creep.transfer(creep.room.powerspawn, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(creep.room.powerspawn);
                }
            } else {
                toStorageOrTerminal(creep);
            }
            //            containers.moveToStorage(creep);

            //        moveToAndDrop(creep,new RoomPosition(38,34,'E38S72'))
        break;
    }
}

function spawn9Room(creep) {
    let goto;
    switch (creep.memory.roleID) {
        //    default:
        //      creep.withdraw(creep.room.terminal,'O')
        //        break;
        case 0:
            creep.memory.standSpot = new RoomPosition(39, 39, 'E35S73');
            if (!creep.pos.isEqualTo(creep.memory.standSpot)) {
                creep.moveTo(creep.memory.standSpot);
            }
            //creep.say('hi')
            goto = Game.getObjectById('58dfbad7836eeb30dd91e1a3');
            if (goto !== null) {
                creep.withdraw(goto, RESOURCE_ENERGY);
            }

            break;
        case 1:

            goto = Game.getObjectById('58dc4e1a75295683255957c6');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveMe(goto, {
                    reusePath: 20
                });
            }
            break;
        case 2:
            clearLabs(creep);

    }

}




function s9Transfer(creep) {
    switch (creep.memory.roleID) {
        case 1:
            goto = Game.getObjectById('58dfc900827589b30d7acdbe');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.transfer(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20
                });
            }
            break;

        default:
            //        moveToAndDrop(creep,new RoomPosition(40,42,'E35S73'))
            //           containers.moveToStorage(creep);
            toStorageOrTerminal(creep);
            //           containers.moveToStorage(creep);
            break;
    }
}
// 5873bd6f11e3e4361b4d9355 38,9
//  7,9 E38S85

function spawn8Room(creep) {
    let goto;
    let goto2;
    switch (creep.memory.roleID) {
        case 0:
            goto = Game.getObjectById('58eeda269b7d1b581c9cf311');
            //         goto2 = Game.getObjectById('58dc2df7ca1434d44e7c7d06');//creep.room.terminal;
            //             require('commands.toStructure').pickUpEnergy(creep);
            //                            if (_.sum(goto.store) > 100) {
            //                if(goto.energy != 0 && goto2.store[RESOURCE_ENERGY]<1000 ) {
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20
                });
            }
            /*          }else if(goto2.store[RESOURCE_ENERGY]>500 ) {
                if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto2, {
                        reusePath: 20
                    });
                }
                           }
 */

            break;

        case 1:

            goto = Game.getObjectById('58dc2df7ca1434d44e7c7d06');
            if (goto !== null)
                if (creep.room.storage.store[RESOURCE_ENERGY] < 900000 && creep.room.terminal.store[RESOURCE_ENERGY] > 15000) {
                    if (creep.pos.isNearTo(creep.room.terminal)) {
                        if (creep.withdraw(creep.room.terminal, RESOURCE_ENERGY) == OK) {
                            creep.moveTo(creep.room.storage);
                        }
                    } else {
                        creep.moveTo(creep.room.terminal);

                    }
                } else {
                    //             require('commands.toStructure').pickUpEnergy(creep);
                    //                            if (_.sum(goto.store) > 100) {
                    if (creep.pos.isEqualTo(goto.pos)) {
                        if (goto.store[RESOURCE_ENERGY] > creep.carryCapacity) {
                            creep.say(creep.withdraw(goto, RESOURCE_ENERGY));

                        }
                    } else {
                        creep.moveTo(goto, { reusePath: 20 });
                    }

                }

                //            }

            break;
        case 2:

            goto = Game.getObjectById('58dc2df7ca1434d44e7c7d06');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null)
                if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto);
                }
            break;

        default:
            //        eitherOr(creep,'58d9aa1a3bdc747c31c18db7','58dc2df7ca1434d44e7c7d06')
            break;

    }

}




function s8Transfer(creep) {
    switch (creep.memory.roleID) {
        case 0:
            containers.moveToTerminal(creep);
            break;
        default:
            containers.moveToStorage(creep);
            //toStorageOrTerminal(creep);
            //containers.moveToTerminal(creep);  5873bd6f11e3e4361b4d9356 3,38 E35S85
            break;
    }
}


function spawn7Room(creep) {
    switch (creep.memory.roleID) {
        default:

            if (creep.pos.isNearTo(creep.room.storage)) {
                for (var e in creep.room.storage.store) {
                    creep.withdraw(creep.room.storage, e);
                }
            } else {
                creep.moveTo(creep.room.storage);
            }

        break;
        /*
                    goto = Game.getObjectById('58cd792ff9a71a1f3e587aa5');
                    goto2 = Game.getObjectById('58af6e9064ccbf5351310a2b');
                    //             require('commands.toStructure').pickUpEnergy(creep);
               //     console.log(_.sum(goto.store) , _.sum(goto2.store));
               if(goto !== null && goto2 !== null)
                    if (_.sum(goto.store) > _.sum(goto2.store)) {
                        if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(goto, {
                                reusePath: 20
                            });
                        }
                    } else {
        //                goto2 = Game.getObjectById('58af6e9064ccbf5351310a2b');
                        //             require('commands.toStructure').pickUpEnergy(creep);
                                                    
                        if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(goto2, {
                                reusePath: 20
                            });
                }


                    }*/
        //                            creep.moveTo(goto,{reusePath:20});
        //                      }
        //            break;

    }

}




function s7Transfer(creep) {
    switch (creep.memory.roleID) {
        default: containers.moveToTerminal(creep);
        //            containers.moveToStorage(creep);
        break;
        case 0:
                toStorageOrTerminal(creep);
            break;

    }
}

function upspawnRoom(creep) {

    if (creep.memory.renewSpawnID === undefined) {
        let finded = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });
        if (finded.length > 0) {
            creep.memory.renewSpawnID = finded[0].id;
            var ccSpawn = require('commands.toSpawn');
            ccSpawn.wantRenew(creep);
        }
    }


    let zlinks = Game.getObjectById('58c48ff96b89238f10ad2947');
    if (zlinks !== null && zlinks.energy > 0) {
        creep.withdraw(zlinks, RESOURCE_ENERGY);
    } else {
        if (creep.room.controller.level < 4) {
            constr.pickUpEnergy(creep);
        } else {
            containers.withdrawFromStorage(creep);
        }


    }
}

function upSpawnTransfer(creep) {
    //toStorageOrTerminal(creep);
    //          containers.moveToStorage(creep);        
    //return;
    let zz = new RoomPosition(8, 34, 'E27S75');
    if (!creep.pos.isEqualTo(zz)) creep.moveTo(zz);

    if (creep.memory.renewSpawnID === undefined) {
        let finded = creep.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
                return (structure.structureType == STRUCTURE_SPAWN);
            }
        });
        if (finded.length > 0) {
            creep.memory.renewSpawnID = finded[0].id;
            var ccSpawn = require('commands.toSpawn');
            ccSpawn.wantRenew(creep);
        }
    } else {
        spawns.toTransfer(creep);
        //                      containers.moveToStorage(creep);
    }


}

function spawn6Room(creep) {
    switch (creep.memory.roleID) {
        case 2:
            goto = Game.getObjectById('58b7a677ec1c7c81790f15e7');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20
                });
            }

            break;
        case 1:
            goto = Game.getObjectById('58b7adaddcc9316ee957f9eb');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20
                });
            }

            break;
        case 0:

            goto = Game.getObjectById('58baddb59ac6e6215aa593b6');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && goto.energy > 0) {
                if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto, {
                        reusePath: 20
                    });
                }
            }
            /* else {

for ( var e in creep.room.storage.store) {
                if(creep.room.storage.store[e] != RESOURCE_ENERGY) {
                    creep.withdraw( creep.room.storage,e);
                }
            }        
        }*/
            if (creep.pos.x != 13 && creep.pos.y != 14)
                creep.moveTo(13, 14);

            break;
    }

}




function s6Transfer(creep) {
    switch (creep.memory.roleID) {
        default:
            case 0:
            sp = Game.getObjectById('59053c38c46499274d742124');
        if (sp !== null)
            if (sp.energy > sp.energyCapacity - 1000) {
                toStorageOrTerminal(creep);
            } else {
                if (creep.pos.isNearTo(sp)) {
                    creep.transfer(sp, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(sp);
                }
            }

            //        toStorageOrTerminal(creep);
            //containers.moveToTerminal(creep);
            //            containers.moveToStorage(creep);
        break;
    }
}

function spawn5Room(creep) {
    let goto;
    switch (creep.memory.roleID) {
        case 0:
            creep.memory.standSpot = new RoomPosition(24, 27, 'E29S79');
            goto = Game.getObjectById('58b5a0d07f98701331712005');
            goto2 = Game.getObjectById('58ba2df2045ee10bf18fb464z');
            if (!require('commands.toStructure').moveToPickUpEnergyIn(creep, 5))
                if (goto !== null && _.sum(goto.store) > 1000) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                } else {

                    if (goto2 !== null && goto2.energy !== 0) {
                        if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(goto2, {
                                reusePath: 20
                            });
                        }

                    } else {
                        goto = Game.getObjectById('58bf37b77dfb1e2f42591b87');
                        if (goto !== null && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
                            if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(goto, {
                                    reusePath: 20
                                });
                            }
                        }


                        //             require('commands.toStructure').pickUpEnergy(creep);
                        //                            if (_.sum(goto.store) > 100) {

                    }


                }

            break;
        default:

            goto = Game.getObjectById('58b50d1482569eb43a085a94');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20
                });
            }
            break;
    }

}




function s5Transfer(creep) {
    switch (creep.memory.roleID) {
        default:
            case 0:

        //let link = Game.getObjectById('58ba2df2045ee10bf18fb464');
        //if(link != undefined&& link.energy < 700) {
        //  creep.transfer(link,RESOURCE_ENERGY);
        //} else {
            toStorageOrTerminal(creep);
        //}
        //containers.moveToTerminal(creep);
        //            containers.moveToStorage(creep);
        break;

        case 1:
                case 2:


                goto = Game.getObjectById('58b5a0d07f98701331712005');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null && creep.transfer(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(goto, {
                    reusePath: 20
                });
            }
            break;
    }
}

function spawn4Room(creep) {
    switch (creep.memory.roleID) {
        case 0:



            goto = Game.getObjectById('58b70f08fcbbe3403e815c29');
            if (goto !== null && goto.energy > 0) {
                if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto);
                }
            } else {
                goto = creep.room.terminal;
                if (goto !== null && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto);
                    }
                }

            }

            break;
        case 1:
        case 2:
            goto = Game.getObjectById('58bdb1c1554fc9614f8721bc');
            //             require('commands.toStructure').pickUpEnergy(creep);
            if (goto !== null)
                if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto, {
                        visualizePathStyle: {
                            fill: 'transparent',
                            stroke: '#bf0',
                            lineStyle: 'dashed',
                            strokeWidth: 0.15,
                            opacity: 0.5
                        }
                    });
                }

            break;

    }


}




function s4Transfer(creep) {
    switch (creep.memory.roleID) {
        case 0:

            let sp = Game.getObjectById('58c44035fb22c86e2238a8b4');
            if (sp !== null && sp.energy < sp.energyCapacity) {
                if (creep.pos.isNearTo(sp)) {
                    creep.transfer(sp, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(sp);
                }
            } else {
                sp = Game.getObjectById('58e9a9572226935f93502e3a');
                if (sp !== null)
                    if (sp.energy > sp.energyCapacity - 1000) {
                        toStorageOrTerminal(creep);
                    } else {
                        if (creep.pos.isNearTo(sp)) {
                            creep.transfer(sp, RESOURCE_ENERGY);
                        } else {
                            creep.moveTo(sp);
                        }
                    }
            }

            break;

        case 1:
        case 2:
            containers.moveToTerminal(creep);
            break;
    }
}
// 38,4  E25S75
function spawn3Room(creep) {
    switch (creep.memory.roleID) {
        case 0:

            goto = Game.getObjectById('58b0ad8777b2837790268120');
            if (goto !== null && goto.energy > 0) {

                if (goto !== null && creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(17, 27);
                }


            } else {
                /*            for ( var e in creep.room.storage.store) {
                                if(creep.room.storage.store[e] != RESOURCE_ENERGY) {
                                    creep.withdraw( creep.room.storage,e);
                                }
                            } */
                goto = creep.room.terminal;
                if (goto !== undefined && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(17, 27);
                    }
                }

            }
            break;



        case 1:

            break;

    }

}

function s3Transfer(creep) {
    switch (creep.memory.roleID) {
        case 0:
            toStorageOrTerminal(creep);
            break;
        case 1:
            var goto = Game.getObjectById('5874fde4ef70493e1ab9f04a');
            if (goto !== null)
                if (creep.pos.isNearTo(goto)) {
                    creep.transfer(goto, RESOURCE_ENERGY);
                } else {
                    creep.moveTo(goto, { reusePath: 20 });
                }
            break;
    }

}

function spawn2Room(creep) {
    switch (creep.memory.roleID) {
        case 0:

            goto = Game.getObjectById('58b128380aac12d30a19c037');
            if (goto !== null && _.sum(goto.store) > 400) {
                if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto, { reusePath: 20 });
                }
            } else {
                goto = Game.getObjectById('58b12623584c0844f13caf93');
                if (goto !== null && goto.energy !== 0) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, { reusePath: 20 });
                    }
                }
            }
            break;
    }

}




function s2Transfer(creep) {
    switch (creep.memory.roleID) {
        case 1:
            containers.moveToTerminal(creep);
            containers.moveToStorage(creep);
            break;
        case 0:
            let zz = Game.getObjectById('58feb10fe51376037f9a9361');
            if (zz !== null && zz.energy < zz.energyCapacity - 1000) {
                creep.transfer(zz, RESOURCE_ENERGY);
            } else {
                toStorageOrTerminal(creep);
            }
            break;

    }
}

function spawn1Room(creep) {

    switch (creep.memory.roleID) {
        case 0:

            let goto = Game.getObjectById('58b4aadfd7bddc4460e23ff7');
            let goto2 = Game.getObjectById('58afd5afe6b54f9d2738d242');
            if (goto !== null && _.sum(goto.store) > 1000) {
                if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto, {
                        reusePath: 20
                    });
                }
            } else if (goto2.energy > 0) {

                if (goto2 !== null && creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto2, {
                        reusePath: 20
                    });
                }

            } else {
                goto = creep.room.terminal;
                if (goto !== null && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
            }

            break;

        default:
            break;
    }
}


function s1Transfer(creep) {
    switch (creep.memory.roleID) {
        default: if (creep.memory.renewSpawnID !== undefined) {
                let spawnz = Game.getObjectById(creep.memory.renewSpawnID);
                if (spawnz !== null && spawnz.energy < 50) {
                    creep.transfer(spawnz, RESOURCE_ENERGY);
                    return;
                }
            }
        toStorageOrTerminal(creep);
        break;
    }

}



class roleLinker extends roleParent {

    static levels(level) {
        if (level == 10) {
            return [MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY];
        } else if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return;
        }
        //{color: '#97c39b ',stroke: '#000000 ',strokeWidth: 0.123,font: 0.5}

        if (creep.memory.roleID === 0) {
            if (creep.room.controller.level != 8) {
                creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
            }
            /*    if(creep.room.storage != undefined) {
                    let zz = ""+ Math.floor(creep.room.storage.store[RESOURCE_ENERGY]*.001);
                    let color = 'red';
                    if(zz > 300) 
                        color ='orange';
                    if(zz > 500) 
                        color ='black';
                    if(zz > 890) 
                        color = 'green';
                    creep.room.visual.text(zz,creep.room.storage.pos.x,creep.room.storage.pos.y,
                        {color: '#97c39b ',stroke: '#000000 ',strokeWidth: 0.123,font: 0.5});
                }
                if(creep.room.terminal != undefined) {
                    let zz = ""+ Math.floor(creep.room.terminal.store[RESOURCE_ENERGY]*.001);
                    creep.room.visual.text(zz,creep.room.terminal.pos.x,creep.room.terminal.pos.y,
                        {color: '#97c39b ',stroke: '#000000 ',strokeWidth: 0.123,font: 0.5});
                }*/
        }


        if (creep.room.name != "W4S93z" && creep.room.name != "E38S72" && creep.room.name != 'E33S76')
            constr.pickUpEnergy(creep);
        //if(Game.cpu.tickLimit > Game.cpu.tick) return;
        if (super.returnEnergy(creep)) return;
        //        if( super.depositNonEnergy(creep) ) return;

        super.renew(creep);
        // Linker goes to link and stores it at the storage.
        if (creep.carry.energy < creep.carryCapacity) {
            creep.memory.full = false;
        }
        if (_.sum(creep.carry) > 0) {
            creep.memory.full = true;
        }
        var goto;

        // Here are the withdrawing from.
        if (!creep.memory.full) {
            switch (creep.memory.roleID, creep.memory.parent) {
                case upgradeSpawn:
                    upspawnRoom(creep);
                    break;

                case spawn3:
                    spawn3Room(creep);
                    break;
                case spawn1:
                    spawn1Room(creep);
                    break;
                case spawn4:
                    spawn4Room(creep);
                    break;
                case spawn5:
                    spawn5Room(creep);
                    break;
                case spawn6:
                    spawn6Room(creep);
                    break;
                case spawn7:
                    spawn7Room(creep);
                    break;
                case spawn8:
                    spawn8Room(creep);
                    break;
                case spawn9:
                    spawn9Room(creep);
                    break;
                case E38S72:
                    E38S72Room(creep);
                    break;
                case W4S93:
                    W4S93Room(creep);
                    break;
                case E33S76:
                    E33S76Room(creep);
                    break;
                case spawn2:
                    spawn2Room(creep);
                    break;
            }
            // If empty
        }


        // Here are teh transfer.
        if (creep.memory.full) {
            //     containers.moveToStorage(creep);

            /*if( creep.memory.renewSpawnID != undefined) {
                let spawnz = Game.getObjectById(creep.memory.renewSpawnID);
                if(spawnz!= undefined && spawnz.energy < spawnz.energyCapacity) {
                    creep.transfer(spawnz,RESOURCE_ENERGY);
                    return;
                }
        } */

            switch (creep.memory.roleID, creep.memory.parent) {
                case upgradeSpawn:
                    upSpawnTransfer(creep);
                    break;

                case spawn3:
                    s3Transfer(creep);
                    break;
                case spawn4:
                    s4Transfer(creep);
                    break;

                case spawn1:
                    s1Transfer(creep);
                    break;
                case spawn7:
                    s7Transfer(creep);
                    break;

                case spawn2:
                    s2Transfer(creep);
                    break;
                case spawn5:
                    s5Transfer(creep);
                    break;
                case spawn6:
                    s6Transfer(creep);
                    break;
                case spawn8:
                    s8Transfer(creep);
                    break;
                case spawn9:
                    s9Transfer(creep);
                    break;
                case E38S72:
                    E38S72Transfer(creep);
                    break;
                case W4S93:
                    W4S93Transfer(creep);
                    break;
                case E33S76:
                    E33S76Transfer(creep);
                    break;
                default:
                    containers.moveToStorage(creep);
                    break;

            }

        }
    }
}

module.exports = roleLinker;
