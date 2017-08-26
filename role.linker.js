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
var constr = require('commands.toStructure');

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
    let maxStorage = 850000;
    //    if (creep.room.name == 'E26S77') maxStorage = 400000;
    if (creep.carry[RESOURCE_ENERGY] === 0 && creep.carryTotal !== 0) {
        containers.moveToTerminal(creep);
    } else if (creep.room.terminal !== undefined && creep.room.terminal.total == 300000) {
        containers.moveToStorage(creep);
    } else if (creep.room.storage.store[RESOURCE_ENERGY] < 75000) {
        containers.moveToStorage(creep);
    } else if (creep.room.terminal !== undefined && creep.room.terminal.store[RESOURCE_ENERGY] < 20000 || creep.room.storage.store[RESOURCE_ENERGY] > 900000) {
        containers.moveToTerminal(creep);
    } else {
        if (creep.room.name == 'E35S83' && creep.memory.roleID == 1) {
            if (creep.pos.isNearTo(creep.room.storage)) {
                if (creep.transfer(creep.room.storage, RESOURCE_ENERGY) == OK) {
                    creep.moveTo(creep.room.storage);
                }
            } else {
                creep.moveTo(creep.room.storage);
            }
        } else {
            containers.moveToStorage(creep);

        }
    }
}

function takeFromTerminalForStorage(creep) {
    if (creep.room.terminal === undefined || creep.room.storage === undefined) return false;
    var goto = creep.room.terminal;
    if (goto !== undefined && goto.store[RESOURCE_ENERGY] > 21000 && creep.room.storage.store[RESOURCE_ENERGY] < 900000) {
        if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(goto);
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

function E24S37(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                var term = creep.room.storage;
                let goto = Game.getObjectById('599e02188f76c44a7e6079c8');
                if (goto !== null && goto.energy > 0) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                } else {
                    if (term !== undefined && term.store[RESOURCE_ENERGY] > 100000) {
                        if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(term);
                        }
                    } else {}
                }
                break;
            case 1:
                let goto2 = Game.getObjectById('599bbce3d0f27f2d7d70d851');
                if (goto2 !== null && creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(goto2, {
                        reusePath: 20
                    });
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: toStorageOrTerminal(creep);
            break;
        }

    }
}

function E18S36(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                var term = creep.room.terminal;
                let goto = Game.getObjectById('5997883fab58151efecc98e0');
                if (goto !== null && goto.energy > 0) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                } else {
                    if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                        if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(term);
                        }
                    } else {
                        takeFromTerminalForStorage(creep);
                    }
                }

                break;
            case 1:
                let goto2 = Game.getObjectById('59964e118626e94667b54b40');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === null) {
                //moveToAndDrop(creep,new RoomPosition(14,16,creep.room.name));
            } else {
                /*if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                } */
            }
            toStorageOrTerminal(creep);
            break;
        }

    }
}

function E17S45(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                var term = creep.room.terminal;
                let goto = Game.getObjectById('599d4b24de5c444ff07248a4');
                if (goto !== null && goto.energy > 0) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                } else {
                    if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                        if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(term);
                        }
                    } else {
           //             takeFromTerminalForStorage(creep);
                    }
                }

                break;            

            case 1:
                let goto2 = Game.getObjectById('599b0851a7a2e40dcce2f69f');
                //                if(goto2.store[RESOURCE_ENERGY] < 1500) goto2 = Game.getObjectById('599af50ef7512a4ed203ec50');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === null) {
                //moveToAndDrop(creep,new RoomPosition(14,16,creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
    }
}

function E17S34(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                var term = creep.room.storage;
                let goto3 = Game.getObjectById('599d9a8849dbcd7a6e95f99b');
                if (goto3 !== null && goto3.energy > 0) {
                    if (creep.withdraw(goto3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto3, {
                            reusePath: 20
                        });
                    }
                } else {
                    if (term !== undefined && term.store[RESOURCE_ENERGY] > 100000) {
                        if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(term);
                        }
                    } else {}
                }
                break;

            case 2:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/
                let goto = Game.getObjectById('599af0794119aa39977eb158');
                if (goto.store[RESOURCE_ENERGY] < 1500) goto = Game.getObjectById('599af282b13c2e2260a1f3f3');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599af282b13c2e2260a1f3f3');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: toStorageOrTerminal(creep);
            break;
        }
    }
}

function E23S38(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                var term = creep.room.storage;
                let goto = Game.getObjectById('599d511549eaf30b4769db20');
                if (goto !== null && goto.energy > 0) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                } else {
                    if (term !== undefined && term.store[RESOURCE_ENERGY] > 100000) {
                        if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(term);
                        }
                    }
                }
                break;
            case 1:
                let goto2 = Game.getObjectById('59962c776b765c54b3d7e845');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: toStorageOrTerminal(creep);
            break;
        }
    }
}


function E18S32(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                var term = creep.room.storage;
                let goto = Game.getObjectById('599e13ba4820ce76f0fb3380');
                if (goto !== null && goto.energy > 0) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                } else {
                    if (term !== undefined && term.store[RESOURCE_ENERGY] > 100000) {
                        if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(term);
                        }
                    } else {
                        //  takeFromTerminalForStorage(creep);
                    }
                }
                break;
            case 1:
                let goto2 = Game.getObjectById('599b80693b94ba6c0a7eb1d8');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default:
                /*let zz = creep.room.storage;
                           if (zz === null) {
                               //moveToAndDrop(creep,new RoomPosition(14,16,creep.room.name));
                           } else {
                               if (creep.pos.isNearTo(zz)) {
                                   for (var e in creep.carry) {
                                       creep.transfer(zz, e);
                                   }
                               } else {
                                   creep.moveTo(zz);
                               }
                           }*/
                toStorageOrTerminal(creep);
            break;
        }
    }
}

function E25S37(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:

                let goto3 = Game.getObjectById('599e1b793ffb5e7550c34732');
                if (goto3 !== null) {
                    if (creep.withdraw(goto3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto3, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599b8f812d6d325f8821f0eb');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === undefined) {
                moveToAndDrop(creep, new RoomPosition(14, 16, creep.room.name));
            } else {
                toStorageOrTerminal(creep);
            }
            break;
        }
    }
}

function E28S37(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/
                let goto = Game.getObjectById('599c45ac04a90b34943a2aa0');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599c42f6f6e3a01fcbab569d');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === undefined) {
                moveToAndDrop(creep, new RoomPosition(27, 19, creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
    }
}

function E28S37(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/
                let goto = Game.getObjectById('599ef53a7b9d8a11e04396e8');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 2:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/
                let goto3 = Game.getObjectById('599c45ac04a90b34943a2aa0');
                if (goto3 !== null) {
                    if (creep.withdraw(goto3, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto3, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599c42f6f6e3a01fcbab569d');
                if (goto2.store[RESOURCE_ENERGY] < 1500) goto2 = Game.getObjectById('599c45ac04a90b34943a2aa0');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === undefined) {
                moveToAndDrop(creep, new RoomPosition(27, 19, creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
    }
}

function E14S37(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 1:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/
                let goto = Game.getObjectById('599e0ecbcf6d3f5f4e34a64d');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 0:
                let goto2 = Game.getObjectById('599fb7715718b6076387d35f');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === undefined) {
                moveToAndDrop(creep, new RoomPosition(27, 19, creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
    }
}

function E13S34(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/
                let goto = Game.getObjectById('599ee038f0327b2b551df4df');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599ee751e3d49719adc79c2e');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === undefined) {
                moveToAndDrop(creep, new RoomPosition(41, 17, creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
    }
}

function E27S34(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/


                let goto = Game.getObjectById('59a03a667e2fc03c4463fb61');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599edec130519b072d942c84');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === null) {
                moveToAndDrop(creep, new RoomPosition(37, 29, creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
    }
}

function E24S33(creep, fill) {
    if (!fill) {
        switch (creep.memory.roleID) {
            case 0:
                /*                var term = creep.room.terminal;
                                if (term !== undefined && term.store[RESOURCE_ENERGY] > 21000) {
                                    if (creep.withdraw(term, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(term);
                                    }
                                } else {*/


                let goto = Game.getObjectById('599f69630174255780b13a45');
                if (goto !== null) {
                    if (creep.withdraw(goto, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto, {
                            reusePath: 20
                        });
                    }
                }
                //                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
            case 1:
                let goto2 = Game.getObjectById('599f5b609499d367de7bfd04');
                if (goto2 !== null) {
                    if (creep.withdraw(goto2, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(goto2, {
                            reusePath: 20
                        });
                    }
                }
                //                takeFromTerminalForStorage(creep);
                //            }
                break;
        }
    } else {
        switch (creep.memory.roleID) {
            default: let zz = creep.room.storage;
            if (zz === null) {
                moveToAndDrop(creep, new RoomPosition(10, 16, creep.room.name));
            } else {
                if (creep.pos.isNearTo(zz)) {
                    for (var e in creep.carry) {
                        creep.transfer(zz, e);
                    }
                } else {
                    creep.moveTo(zz);
                }
            }
            //        toStorageOrTerminal(creep);
            break;
        }
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
        if (super.doTask(creep)) {
            return;
        }
        if (creep.saying == 'ZzZ') return;

                if (creep.room.controller.level != 8 && creep.memory.roleID === 0) {
                    creep.room.visual.text(creep.room.controller.progressTotal - creep.room.controller.progress, creep.room.controller.pos.x + 1, creep.room.controller.pos.y, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: RIGHT });
               }
        if (creep.room.name !== 'E13S34')
            constr.pickUpEnergy(creep);
        if (super.returnEnergy(creep)) return;

        super.renew(creep);
        // Linker goes to link and stores it at the storage.
        if (creep.carryTotal > 0) {
            creep.memory.full = true;
        } else {
            creep.memory.full = false;
        }
        var goto;

        switch (creep.pos.roomName) {

            case 'E24S33':
                E24S33(creep, creep.memory.full);
                break;
            case 'E27S34':
                E27S34(creep, creep.memory.full);
                break;
            case 'E13S34':
                E13S34(creep, creep.memory.full);
                break;
            case 'E18S36':
                E18S36(creep, creep.memory.full);
                break;
            case 'E14S37':
                E14S37(creep, creep.memory.full);
                break;
            case 'E23S38':
                E23S38(creep, creep.memory.full);
                break;
            case 'E24S37':
                E24S37(creep, creep.memory.full);
                break;
            case 'E17S45':
                E17S45(creep, creep.memory.full);
                break;
            case 'E17S34':
                E17S34(creep, creep.memory.full);
                break;
            case 'E18S32':
                E18S32(creep, creep.memory.full);
                break;
            case 'E25S37':
                E25S37(creep, creep.memory.full);
                break;
            case 'E28S37':
                E28S37(creep, creep.memory.full);
                break;

        }

    }
}

module.exports = roleLinker;