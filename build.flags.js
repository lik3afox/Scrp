    var party = require('commands.toParty');
    var FLAG = require('foxGlobals');
    var delayBetweenScan = 3;

    function doDefendThings(flag) {
        if (flag.room === undefined) return;

        // = _.filter(flag.room.hostileInRoom(),function(o){return o.owner.username == 'Invader'} ) ;
        // FIND_HOSTILE_CREEPS //flag.room.hostileInRoom()
        var hostiles;
        var creeps;
        if (flag.secondaryColor == COLOR_RED) {
            hostiles = flag.room.find(FIND_HOSTILE_CREEPS);

            hostiles = _.filter(hostiles, function(o) {
                return o.owner.username == 'Invader';
            });

            flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });
            if (hostiles.length === 0) {
                flag.remove();
            } else {
                flag.setPosition(hostiles[0].pos.x, hostiles[0].pos.y);
            }
            flag.room.memory.invasionFlag = flag.name;

            creeps = flag.pos.findInRange(FIND_MY_CREEPS, 15);
            if (creeps.length > 0) {
                for (var a in creeps) {
                    creeps[a].memory.runAway = true;
                    creeps[a].memory.runFrom = flag.name;
                }
            }
        } else if (flag.secondaryColor == COLOR_WHITE) {
            hostiles = flag.room.find(FIND_HOSTILE_CREEPS);
            hostiles = _.filter(hostiles, function(o) {
                return o.owner.username != 'Invader' && o.owner.username != "Source Keeper" && !_.contains(FLAG.friends, o.owner.username);
            });
            flag.room.visual.circle(flag.pos.x, flag.pos.y, { radius: 15, opacity: 0.15, fill: 'ff0000' });
            if (hostiles.length === 0) {
                flag.remove();
            } else {
                flag.setPosition(hostiles[0].pos.x, hostiles[0].pos.y);
            }

            //            flag.room.memory.invasionFlag = flag.name;

            creeps = flag.pos.findInRange(FIND_MY_CREEPS, 15);
            if (creeps.length > 0) {
                for (var b in creeps) {
                    creeps[b].memory.runAway = true;
                    creeps[b].memory.runFrom = flag.name;
                }
            }
        }

    }

    function removeRA(flag) {
        let bads = flag.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        bads = _.filter(bads, function(o) {
            return !_.contains(FLAG.friends, o.owner.username);
        });
        if (bads.length === 0) {
            flag.remove();
        }
    }

    function rampartThings(flag) {
        if (flag.memory.invaderTimed === undefined) flag.memory.invaderTimed = 0;
        if (flag.memory.alert === undefined || !flag.memory.alert) {
            flag.memory.alert = true;
        }

        if (flag.memory.alert) {
            // Look for creeps
            let bads = flag.room.find(FIND_HOSTILE_CREEPS);
            bads = _.filter(bads, function(object) {
                return (object.owner.username != 'Invader' && !_.contains(FLAG.friends, object.owner.username));
            });

            if (bads.length === 0) {
                if (flag.memory.invadeDelay === undefined)
                    flag.memory.invadeDelay = 2000;

                if (flag.memory.invadeDelay < 0) {
                    //                    var constr = require('commands.toStructure');
                    //                    constr.checkSnapShot(flag.pos.roomName);

                    flag.memory.invadeDelay = undefined;
                    flag.memory.invaderTimed = undefined;
                    flag.memory.alert = undefined;
                    flag.room.memory.towerRepairID = undefined;
                    flag.remove();
                }

            } else {
                if (flag.memory.invadeDelay === undefined)
                    flag.memory.invadeDelay = 2000;
            }
        }
        flag.memory.invaderTimed++;
    }

    function clearFlagMemory() {
        var keys = Object.keys(Memory.flags);
        var e = keys.length;
        var a;
        while (e--) {
            a = keys[e];
            if (Game.flags[a] === undefined) delete Memory.flags[a];
        }
        keys = Object.keys(Memory.rooms);
        e = keys.length;
        while (e--) {
            a = keys[e];
            if (Game.rooms[a] === undefined) delete Memory.rooms[a];
        }
    }

    class buildFlags {

        static run() {

            let powerTotal = 0;
            let defendTotal = 0;
            if (Memory.clearFlag === undefined) Memory.clearFlag = 500;
            Memory.clearFlag--;
            if (Memory.clearFlag < 0) {
                Memory.clearFlag = 50;
                clearFlagMemory();
            }

            let zFlags = _.filter(Game.flags, function(o) {
                return o.color != COLOR_WHITE && o.color != COLOR_GREY && o.color != COLOR_CYAN;
            });

            var e = zFlags.length;
            var flag;
            while (e--) {
                flag = zFlags[e];

                switch (flag.color) {

                    case COLOR_RED:
                        doDefendThings(flag);
                        if (Memory.showInfo > 1)
                            defendTotal++;
                        break;

                    case FLAG.PARTY:
                        if (flag.memory.formation === undefined) {
                            flag.memory.formation = [];
                        }
                        if (flag.memory.wallTarget === undefined) {
                            flag.memory.wallTarget = 'none';
                        }
                        if (flag.memory.wallTarget !== 'none') {
                            if (flag.room !== undefined) { // Only do this if room is visable. 
                                var target = Game.getObjectById(flag.memory.wallTarget);
                                //                                console.log('wall trying to find, ', target, target.hits, target.pos);
                                if (target === null) {
                                    var struc = flag.room.find(FIND_STRUCTURES);
                                    var bads;

                                    var test2 = _.filter(struc, function(o) {
                                        return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && !o.pos.lookForStructure(STRUCTURE_RAMPART);
                                    }); // This is something is not on a 

                                    if (test2.length !== 0) {
                                        var close = flag.pos.findClosestByRange(test2);
                                        flag.memory.wallTarget = close.id;
                                        flag.setPosition(close.pos);
                                    }
                                    /*
                                    var struc = creep.room.find(FIND_STRUCTURES);
                                    var bads; 

                                    var test2 = _.filter(struc, function(o) {
                                        return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && !o.pos.lookForStructure(STRUCTURE_RAMPART);
                                    }); // This is something is not on a 

                                    if (test2.length !== 0) {
                                        flag.memory.wallTarget = flag.pos.findClosestByRange(test2).id;
                                    } else {
                                        var test = _.filter(struc, function(o) {
                                            return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && o.pos.lookForStructure(STRUCTURE_RAMPART);
                                        });
                                        if (test.length !== 0) {
                                            flag.memory.wallTarget = flag.pos.findClosestByRange(test).id;
                                        } else {
                                            bads = _.filter(struc, function(o) {
                                                return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_CONTROLLER;
                                            }); // these are the ramparts
                                            if (bads.length > 0) {
                                                flag.memory.wallTarget = flag.pos.findClosestByRange(bads).id;
                                            } 
                                        }
                                    }
*/
                                    // thing is dead and get a new target.
                                } else {
                                    console.log('attacking', target, 'hp:', target.hits);
                                    // Thing is still alive
                                }
                            }

                        }
                        if (flag.memory.formation.length === 0) {
                            var Party = {
                                role: 'none',
                                posistion: 1,
                                number: 1
                            };
                            flag.memory.formation.push(Party);
                        }
                        break;

                    case FLAG.GUARD:

                        let guard = flag;
                        if (guard.memory.guardCreateCount === undefined) {
                            guard.memory.guardCreateCount = 0;
                        }

                        guard.memory.guardCreateCount--;
                        if (guard.memory.guardCreateCount < 0) {
                            guard.memory.guardCreateCount = delayBetweenScan;
                            require('commands.toGuard').create(flag);
                        }
                        break;

                    case FLAG.RALLY:
                        // This will mean power flag if it's green/red.
                        let rally = flag;
                        if (flag.secondaryColor == COLOR_RED) {
                            var power = require('commands.toPower');
                            if (Memory.showInfo > 1)
                                powerTotal++;
                            power.calcuate(flag);
                        }

                        if (flag.secondaryColor == COLOR_PURPLE) {
                            rampartThings(flag);
                        }
                        if (flag.secondaryColor == COLOR_WHITE) {
                            removeRA(flag);
                        }


                        if (rally !== undefined) {
                            if (rally.memory.rallyCreateCount === undefined) {
                                rally.memory.rallyCreateCount = 0;
                            }
                            rally.memory.rallyCreateCount--;
                            if (rally.memory.rallyCreateCount < 0) {
                                party.create(flag);
                                party.rally(flag);
                                rally.memory.rallyCreateCount = delayBetweenScan;
                            }
                        }

                        break;

                }
            }
            if (Memory.showInfo > 1) {
                //                Memory.stats.powerPartyNum = powerTotal;
                //               Memory.stats.defendFlagNum = defendTotal;
            } else {
                Memory.stats.powerPartyNum = undefined;
                Memory.stats.defendFlagNum = undefined;

            }

        }
    }

    module.exports = buildFlags;

    // 11,14 E25S74