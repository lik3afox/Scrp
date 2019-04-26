var _squadFlag;
var movement = require('commands.toMove');
var fox = require('foxGlobals');
var tempTarget, pathfindResult;
var doMovement;
var reformSquad;
var siegeTargets;
var runMovement;
var squadMoveDir;
var doRotation;

function squadMemory(squaded, bads, analysis) {
    let squad = [];
    let damaged = [];
    let healNumber = 0;
    let squadFlag = squaded[0].partyFlag;
    let pointSquad;

    if (!squadFlag.memory.squadMode) {
        console.log(squadFlag.memory.squadMode, "Not existant");
        squadFlag.memory.squadMode = 'travel';
    }
    for (var e in squaded) {
        if (squaded[e] && !pointSquad) {
            pointSquad = squaded[e];
        }
        squad.push(squaded[e]);
        if (squaded[e].hits < squaded[e].hitsMax) {
            damaged.push(squaded[e]);
        }
        if (squaded[e].getActiveBodyparts(HEAL) > 2) {
            healNumber++;
        }
    }

    if (squadFlag.memory.aiSettings === undefined) {
        squadFlag.memory.aiSettings = {
            taunter: false, // Taunting or not
            aggressive: false, // Charging or not
            fleeDistance: 0, // when you run away from units.
            fleeStrength: 150, // How strong the enemy has to be to run
            meleeRadius: 3,
            rangeRadius: 4,
            visual: false, // Visuals
            goal: { // Goal settings
                //locked: true, // Locked default - get 1 target and go for it.
                switching: false, // Switch targets 
                walls: false, // Go for walls/rampart targets.
            },
        };
    }
    if (squadFlag.memory.travelSettings === undefined) {
        //        squadFlag.memory.travelSettings = {

        //      };
    }
    if (squadFlag.memory.squadMode !== 'battle' && Game.time % 200 === 0 && squad[0] && squad[0].room) {
        let nuke = squad[0].room.find(FIND_NUKES);
        if (nuke.length > 0) {
            let nxtNuke = _.min(nuke, o => o.timeToLand);
            if (nxtNuke.timeToLand <= 200) {
                switchMode(_squadFlag, squad, 'battle');
            }
        }
    }



    switch (squadFlag.memory.squadMode) {
        case 'paired':
            for (let i in squadFlag.memory.squadGrouping) {
                let squad = squadFlag.memory.squadGrouping[i];
                let tank = Game.creeps[squad.tank];
                let support = Game.creeps[squad.support];
                let target = Game.getObjectById(squad.target);
                if (!target && tank && tank.room && squadFlag.pos.roomName === tank.room.name) {
                    // get new target;
                    if (_squadFlag.memory.homeDefense) {
                        let close = tank.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if (close) {
                            squadFlag.memory.squadGrouping[i].target = close.id;
                        } else {
                            console.log('No Enemies, I need death!');
                            squadFlag.memory.death = true;
                        }
                    } else {
                        squadFlag.memory.squadGrouping[i].target = tank.room.getClearBaseTarget().id;
                    }

                    //                    squadFlag.memory.squadGrouping[i].target = tank.getClearBaseTarget().id;

                } else if (!target && tank && squadFlag.pos.roomName !== tank.room.name && squadFlag.room) {

                    if (_squadFlag.memory.homeDefense) {
                        let close = tank.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                        if (close) {
                            squadFlag.memory.squadGrouping[i].target = close.id;
                        } else {
                            console.log('No Enemies, I need death!');
                            squadFlag.memory.death = true;
                        }
                    } else {
                        squadFlag.memory.squadGrouping[i].target = tank.room.getClearBaseTarget().id;
                    }
                }
            }
            break;

        case 'siege':
            // First thing is place where Point is - direction of the attack
            /*    TOP: 1,
                TOP_RIGHT: 2,
                RIGHT: 3,
                BOTTOM_RIGHT: 4,
                BOTTOM: 5,
                BOTTOM_LEFT: 6,
                LEFT: 7,
                TOP_LEFT: 8, */

            // Two types of healing 
            // Preventive And Reactive, it is determined by current status of creeps.
            /*
                        if (damaged.length > 0) {
                            healType = 'react';
                        } else {
                            healType = 'prevent';
                        }*/


            var point = Game.getObjectById(squadFlag.memory.pointID);
            if (point === null) {
                reformSquad = true;
            } else {
                point.room.visual.text('P', point.pos);
            }
            var siegeTarget;
            if (squadFlag.memory.attackPos) {
                siegeTarget = Game.getObjectById(squadFlag.memory.target);
            }
            //            let breach = checkPathToTarget(squad, siegeTarget);
            //          console.log('is there a breach?',breach,pointSquad);

            if (!siegeTarget) {
                squadFlag.memory.target = undefined;
                let target = Game.getObjectById(point.partyFlag.memory.travelTargetID);
                if (!target) {
                    point.partyFlag.memory.travelTargetID = getRoomTargets(point.room).id;
                }
                var isPathToTarget = checkPathToTarget(squad, target);
                if (point.room.name === point.partyFlag.pos.roomName && !point.partyFlag.memory.travelTargetID) {
                    point.partyFlag.memory.travelTargetID = getRoomTargets(point.room).id;
                }

                if (isPathToTarget) {
                    console.log('//Siege is switching to //Paired to Destory Structures quicker');
                    switchMode(squadFlag, squad, 'paired');
                    squadMemory(squaded, bads, analysis);
                    return;
                } else {
                    console.log('//Siege is switching to //Battle to get another seige target');
                    switchMode(squadFlag, squad, 'battle');
                    squadMemory(squaded, bads, analysis);
                    return;
                }

                return;
            }



            var attackDir;

            if (squadFlag.memory.attackDirection === undefined) {
                squadFlag.memory.attackDirection = false;
            }
            if (!squadFlag.memory.attackDirection && siegeTarget) {
                //            if(siegeTargets && siegeTargets.length){
                //                  attackDir = siegeTarget.pos.getDirectionTo(siegeTargets[0]);    
                //                } else {    
                attackDir = siegeTarget.pos.getDirectionTo(point);
                //          }
            } else {
                attackDir = squadFlag.memory.attackDirection;
            }
            // Point 
            // now we push into squadSpots objec that holds formationPos, role
            var X = attackDir;
            var X10 = X * 10;
            var squadSpots = [
                { pos: X, role: 'point', },
                { pos: f(X - 1), role: 'melee', }, // Left of point
                { pos: f(X + 1), role: 'melee', }, // right of point
                { pos: (X * 10) + (X), }, // Behind point
                { pos: (f(X - 1) * 10) + X, },
                { pos: (X10 + f(X + 1)), role: (X10 + (X + 1)), },

                { pos: f(X - 1) * 10 + f(X - 1), role: f(X - 1) * 10 + (X - 1), },
                { pos: f(X + 1) * 10 + f(X + 1), role: f(X + 1) * 10 + (X + 1), },
                { pos: f(X + 1) * 10 + f(X + 2), role: f(X + 1) * 10 + (X + 2), },
                { pos: f(X - 2) * 10 + f(X - 1), role: f(X - 2) * 10 + (X - 1), },
            ];

            for (let ae in squadSpots) {

                var loc = getFormationPos(siegeTarget, squadSpots[ae].pos);
                var show = true;
                let atFeet = point.room.lookAt(loc);
                for (var i in atFeet) {
                    if (atFeet[i].type == 'terrain' && atFeet[i].terrain == 'wall') {
                        squadSpots[ae].role = 'X';
                        squadSpots.splice(ae, 1);
                        show = false;
                        break;
                    }
                    if (atFeet[i].type == 'structure' && atFeet[i].structure.structureType !== 'road' && atFeet[i].structure.structureType !== 'container') {
                        squadSpots[ae].role = 'X';
                        squadSpots.splice(ae, 1);
                        show = false;
                        break;
                    }
                }
                if (show)
                    roleCircle(loc, squadSpots[ae].role);
            }
            // healer
            var _healer = 1;
            // Support
            var _meleeSpot = 2;
            var _rest = 0; // This counts up, and is the rest of the guy's posistion.

            //squad[0] = point;
            //squad[1] = healer;
            var z;
            //            for(let z = squad.length; z--; z> 0){
            z = squad.length;
            while (z--) {
                if (squad[z].memory.point && squadSpots.length > 0) {
                    squad[z].memory.formationPos = squadSpots.shift().pos;
                    squad.splice(z, 1);
                    break;
                }
            }

            z = squad.length;
            while (z--) {

                //            for(let z = squad.length; z--; z> 0){
                //            for (let z in squad) {

                //console.log('setting Squad for ',squad[z].memory.role, squadSpots[0].role,squadSpots.length );
                if (squad[z].memory.role !== undefined && (squad[z].memory.role == 'fighter' || squad[z].memory.role == 'demolisher') && squadSpots.length > 0 && squadSpots[0].role == 'melee') {
                    squad[z].memory.formationPos = squadSpots.shift().pos;

                    squad.splice(z, 1);

                }
            }

            //            for(let z = squad.length; z--; z> 0){
            z = squad.length;
            while (z--) {

                //console.log('setting Squad for ',squad[z].memory.role, squadSpots[0].role);
                if ((squad[z].memory.role == 'mage' || squad[z].memory.role == 'healer') && squadSpots.length > 0 && squadSpots[0].role == 'healer') {
                    squad[z].memory.formationPos = squadSpots.shift().pos;
                    squad.splice(z, 1);
                    break;
                }
            }

            z = squad.length;
            while (z--) {
                if (squadSpots.length > 0) {
                    squad[z].memory.formationPos = squadSpots.shift().pos;
                    squad.splice(z, 1);
                } else {
                    squad[z].memory.formationPos = undefined;
                }
            }



            if (point !== null) {
                /*let towers = point.room.find(FIND_STRUCTURES);
                towers = _.filter(towers, function(o) {
                    return o.structureType == STRUCTURE_TOWER;
                });
                let twer = point.room.towerDamage(point);
                let bd = point.pos.damageDone(bads);
                //                console.log("tower Damage", twer);

                //tower.damageDone(creep);
                //              console.log('creep damage', bd);
                let totalDamage = bd + twer;
                let reduced = totalDamage * 0.3;
                //            console.log("damage after tough", reduced);
                let healDone = point.healDone(squaded);
                //          console.log('potential Heal', healDone);
                let estDamage = reduced - healDone;
                if (estDamage < 0) estDamage = 0;*/
                //        console.log('est Damage:', estDamage, "estimated HP:", point.hits - estDamage, "RealHp:", point.hits);
            }
            bads = _.filter(bads, function(o) {
                return (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
            });
            if (point === null) {
                /*for (let z in squad) {
                    let test = Game.getObjectById(squad[z].memory.followingID);
                    if (test === null) {
                        setTravelSquad(squad);
                        break;
                    }
                }*/
            }
            if (point === null || point === undefined) break;

            if (bads.length) {
                let baddybads = _.filter(bads, function(o) {
                    return (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
                });
                //let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
                let target = point.pos.findClosestByRange(baddybads);
                let distance = point.pos.getRangeTo(target);
                if (distance <= 3) {
                    console.log('//Siege is switching to Battle for fight');
                    switchMode(squadFlag, squad, 'battle');
                    return;
                }
            }

            break;

        case 'snake': // Like traveling but it's a siege formation, so different rooms don't matter.
            doMovement = true;

            bads = _.filter(bads, function(o) {
                return (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
            });
            let backup = false;
            let switchSnake = false;
            squadMoveDir = undefined;
            for (let a in squad) {
                let creep = squad[a];
                if (creep.hits < 4200) {
                    switchMode(squadFlag, squad, 'battle');
                    squadMemory(squaded, bads, analysis);
                    return;
                }
                let btarget = creep.pos.findClosestByRange(bads);
                let bdistance = creep.pos.getRangeTo(btarget);
                if (bdistance < 3) {
                    let analy = analyzeCreep(btarget);
                    if (analy.strength > 120) {
                        //                                switchSnake = true;
                        //switchMode(squadFlag, squad, 'battle');
                        //squadMemory(squaded, bads, analysis);
                        backup = true;
                        return;
                    }
                }


                if (creep.memory.followingID === undefined && creep.memory.point) {
                    if (creep.partyFlag.memory.snaked && bads.length > 0) { // Meaning that it's the front.
                    }
                    let dir = Game.getObjectById(creep.memory.directingID);
                    creep.memory.formationPos = 0;
                    if (dir !== null) {
                        creep.room.visual.line(creep.pos, dir.pos, { color: 'red' });
                    }
                    if (creep.pos.isNearTo(dir)) {
                        creep.memory.happy = true;
                    } else {
                        creep.memory.happy = false;
                    }

                } else if (creep.memory.directingID === undefined) {
                    if (!creep.partyFlag.memory.snaked && bads.length > 0) { // Meaning that it's the front.
                        let btarget = creep.pos.findClosestByRange(bads);
                        let bdistance = creep.pos.getRangeTo(btarget);
                        if (bdistance < 3) {
                            let analy = analyzeCreep(btarget);
                            if (analy.strength > 120) {
                                //     switchSnake = true;
                                switchMode(squadFlag, squad, 'battle');
                                squadMemory(squaded, bads, analysis);
                                return;
                            }
                        }
                    }

                    let fol = Game.getObjectById(creep.memory.followingID);
                    if (fol !== null) {
                        creep.room.visual.line(creep.pos, fol.pos, { color: 'green' });
                    }
                    if (creep.pos.isNearTo(fol)) {
                        creep.memory.happy = true;
                    } else {
                        creep.memory.happy = false;
                    }
                    creep.say('kab');
                } else {
                    // everyone else;
                    let fol = Game.getObjectById(creep.memory.followingID);
                    let dir = Game.getObjectById(creep.memory.directingID);
                    if (fol !== null) {
                        creep.room.visual.line(creep.pos, fol.pos, { color: 'red' });
                    }
                    if (dir !== null) {
                        creep.room.visual.line(creep.pos, dir.pos, { color: 'green' });
                    }

                    if ((creep.pos.isNearTo(dir) || isNearToInNextRoom(creep, dir)) && (creep.pos.isNearTo(fol) || isNearToInNextRoom(creep, fol))) {
                        creep.memory.happy = true;
                    } else {
                        creep.memory.happy = false;
                    }

                    creep.say('md');
                }
                if (backup) {
                    doMovement = false;
                    if (squadMoveDir === undefined) {
                        let result = PathFinder.search(creep.pos, { btarget, range: bdistance + 1 }, { flee: true });
                        squadMoveDir = creep.pos.getDirectionTo(result.path[0]);
                    }
                }

                if (!creep.memory.happy) {
                    doMovement = false;
                }
                if (creep.fatigue !== 0) {
                    doMovement = false;
                }
                if (creep.memory.stuckCount === 5) {
                    creep.memory.stuckCount = 0;
                    doMovement = true;
                }
            }
            if (switchSnake) {
                if (creep.partyFlag.memory.snaked) {
                    creep.partyFlag.memory.snaked = false;
                } else {
                    creep.partyFlag.memory.snaked = true;
                }
            }

            break;


        case 'travel':
            doMovement = true;
            //            healType = 'react';
            if (bads.length && !_squadFlag.memory.death) {
                let baddybads = _.filter(bads, function(o) {
                    return (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
                });
                //let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
                let target = squad[0].pos.findClosestByRange(baddybads);
                let distance = squadDistance(squaded, target);
                if (distance < 4) {
                    console.log('//Traveling is switching to battle for fight');
                    switchMode(squadFlag, squad, 'battle');
                    return;
                }
            }

            for (let a in squad) {
                let creep = squad[a];
                if (creep.hits < creep.hitsMax) {
                    switchMode(squadFlag, squad, 'battle');
                    squadMemory(squaded, bads, analysis);
                    console.log('//Traveling siwtching to battle due to range in 3');
                    return;
                }

                /*else
                               if (!_squadFlag.memory.death && creep.room.name === creep.partyFlag.pos.roomName && (creep.pos.x > 2 || creep.pos.y > 2 || creep.pos.x < 47 || creep.pos.y < 47)) { // && !creep.isNearEdge
                                   switchMode(squadFlag, squad, 'battle');
                                   console.log('//Traveling siwtching to Battle due to flagRoom');
                                   return;
                               }*/

                if (creep.memory.followingID === undefined && creep.memory.point) {
                    // Leader point man here
                    //                    creep.say('ldr');
                    let dir = Game.getObjectById(creep.memory.directingID);
                    creep.memory.formationPos = 0;
                    //let dir = Game.getObjectById(creep.memory.directingID);
                    if (dir !== null) {
                        creep.room.visual.line(creep.pos, dir.pos, { color: 'red' });
                    }
                    if (creep.pos.isNearTo(dir) || isNearToInNextRoom(creep, dir)) {
                        //     creep.say('ToFlag');
                        creep.memory.happy = true;
                    } else {
                        creep.memory.happy = false;
                    }

                    if (squadFlag.memory.powerCreepFlag) {
                        if (creep.pos.inRangeTo(creep.partyFlag, 2)) {
                            switchMode(squadFlag, squad, 'battle');
                        }
                        if (creep.hits < creep.hitsMax) {
                            switchMode(squadFlag, squad, 'battle');
                        }
                    }


                } else if (creep.memory.directingID === undefined) {
                    // Last person
                    let fol = Game.getObjectById(creep.memory.followingID);
                    if (fol !== null) {
                        creep.room.visual.line(creep.pos, fol.pos, { color: 'green' });
                    }
                    if (creep.pos.isNearTo(fol) || isNearToInNextRoom(creep, fol)) {
                        creep.memory.happy = true;
                    } else {
                        creep.memory.happy = false;
                    }
                    creep.say('kab');
                } else {
                    // everyone else;
                    let fol = Game.getObjectById(creep.memory.followingID);
                    let dir = Game.getObjectById(creep.memory.directingID);
                    if (fol !== null) {
                        creep.room.visual.line(creep.pos, fol.pos, { color: 'red' });
                    } else {
                        creep.memory.point = true;
                    }
                    if (dir !== null) {
                        creep.room.visual.line(creep.pos, dir.pos, { color: 'green' });
                    }

                    if ((creep.pos.isNearTo(dir) || isNearToInNextRoom(creep, dir)) && (creep.pos.isNearTo(fol) || isNearToInNextRoom(creep, fol))) {
                        creep.memory.happy = true;
                    } else {
                        creep.memory.happy = false;
                    }

                    creep.say('md');
                }

                if (!creep.memory.happy) {
                    doMovement = false;
                }
                if (creep.fatigue !== 0) {
                    doMovement = false;
                }
                if (creep.memory.stuckCount === 5) {
                    creep.memory.stuckCount = 0;
                    doMovement = true;
                }

                squad = _.sortBy(squad, function(o) {
                    return o.memory.battlePos;
                });

                creep.say(creep.memory.battlePos);
            }

            break;

        case 'battle':
            // if squad doesn't have posistions yet, then lets set the posistions.
            //            switchMode(squadFlag, squaded, 'travel');
            if (squadFlag.memory.groupPoint === undefined) {
                switchMode(squadFlag, squaded, 'battle');
            }
            var ai = squadFlag.memory.aiSettings;

            let yy = 3;
            let xx = -5;
            if (squadFlag.room) {
                for (let i in ai) {
                    squadFlag.room.visual.text(i, squadFlag.pos.x + xx, squadFlag.pos.y + yy, { color: '#FF00F3 ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                    squadFlag.room.visual.text(ai[i], squadFlag.pos.x + xx + 5, squadFlag.pos.y + yy, { color: '#FF00F3 ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
                    yy++;
                }
            }
            let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
            let doMove = true;
            let distance;

            let isSquadFatiqued = squadFatique(squad);
            let roomName = groupPoint.roomName;
            if (isSquadFatiqued) {
                doMove = false;
            }
            let target;
            let inPos = squadInPos(squad);
            if (doMove && !inPos) {
                if (groupPoint.x > 1 && groupPoint.x < 49 && groupPoint.y > 1 && groupPoint.y < 49) {
                    doMove = false;
                }
            }


            var damagedRun = false;
            for (let i in squaded) {
                if (squaded[i].stats('toughHP') === 0) {
                    if (squaded[i].hits < squaded[i].hitsMax - 500) {
                        damagedRun = true;
                        break;
                    }
                } else {
                    if (squaded[i].hits < squaded[i].hitsMax - squaded[i].stats('toughHP')) {
                        damagedRun = true;
                        break;
                    }
                }
            }
            if (damagedRun) {

                let closeTower = groupPoint.findClosestByRange(_squadFlag.room.towers);
                var distanceTower = groupPoint.getRangeTo(closeTower);
                if (distanceTower > 20) distanceTower = 20;
                pathfindResult = PathFinder.search(groupPoint, { pos: closeTower.pos, range: distanceTower + 1 }, {
                    flee: true,
                    roomCallback: roomName => getRoomMatrix4Squad(roomName, bads)
                });

                squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                siegeTargets = [];
                console.log(_squadFlag.name, '://HURT RUN:', _squadFlag, squadMoveDir, "CPU: XX", roomName, groupPoint, "D:", distance, "Siege Targets:", siegeTargets);
                return;
            } else {
                /*                if (_squadFlag.name === 'Flag3') {
                                    switchMode(squadFlag, squad, 'travel');
                                    squadMemory(squaded, bads, analysis);
                                    console.log('//BATTLE siwtching to travel due to flagRoom');
                                    return;
                                }*/
            }

            var nuke = squadFlag.room.find(FIND_NUKES);
            if (nuke.length > 0) {
                var nxtNuke = _.min(nuke, o => o.timeToLand);
                if (_squadFlag.memory.runFromNuke === undefined && nxtNuke.timeToLand < 50) {
                    _squadFlag.memory.runFromNuke = 52;
                    _squadFlag.memory.nukeRoom = nxtNuke.pos.roomName;
                }
                console.log('Found nuke, time left:', nxtNuke.timeToLand);
            }
            let nukeRoom = _squadFlag.memory.nukeRoom;
            if (!_squadFlag.memory.runFromNuke && _squadFlag.room && _squadFlag.room.controller && _squadFlag.room.controller.safeMode > 100) {
                _squadFlag.memory.runFromNuke = 100;
                _squadFlag.memory.nukeRoom = _squadFlag.pos.roomName;
            }

            if (_squadFlag.memory.runFromNuke > 0) {
                _squadFlag.memory.runFromNuke--;
                if (!_squadFlag.memory.nukeRunSpot) {
                    let evact = squadEvacutateSpot(squadFlag, groupPoint);
                    if (evact.x === 0) {
                        let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(evact.roomName);
                        match[2]--;
                        _squadFlag.memory.nukeRunSpot = new RoomPosition(5, evact.y, match[1] + match[2] + match[3] + match[4]);
                    } else if (evact.x === 49) {
                        let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(evact.roomName);
                        match[2]++;
                        _squadFlag.memory.nukeRunSpot = new RoomPosition(5, evact.y, match[1] + match[2] + match[3] + match[4]);
                    } else if (evact.y === 0) {
                        let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(evact.roomName);
                        match[4]--;
                        _squadFlag.memory.nukeRunSpot = new RoomPosition(5, evact.y, match[1] + match[2] + match[3] + match[4]);
                    } else if (evact.y === 49) {
                        let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(evact.roomName);
                        match[4]++;
                        _squadFlag.memory.nukeRunSpot = new RoomPosition(5, evact.y, match[1] + match[2] + match[3] + match[4]);
                    }
                }
                target = new RoomPosition(_squadFlag.memory.nukeRunSpot.x, _squadFlag.memory.nukeRunSpot.y, _squadFlag.memory.nukeRunSpot.roomName);
                if (inPos) {
                    if (target.roomName !== groupPoint.roomName) {
                        pathfindResult = PathFinder.search(groupPoint, target, { roomCallback: roomName => getRoomMatrix4Squad(roomName, bads), range: _squadFlag.memory.moveRange }); //, maxOps: 100 
                        squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                        console.log(_squadFlag.name, '://NUKE EVACUATE:', target, squadMoveDir, "CPU: ", pathfindResult.ops, roomName, groupPoint, "Timing:", _squadFlag.memory.runFromNuke);
                        return;
                    } else {
                        let thisRoom = Game.rooms[target.roomName];
                        if (thisRoom) {
                            var killTargets = thisRoom.find(FIND_HOSTILE_CREEPS);
                            if (killTargets.length > 0) {
                                target = groupPoint.findClosestByRange(killTargets);
                                pathfindResult = PathFinder.search(groupPoint, target, { roomCallback: roomName => getRoomMatrix4Squad(roomName), range: _squadFlag.memory.moveRange }); //, maxOps: 100 
                                squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                                console.log(_squadFlag.name, '://SEARCH AND DESTORY:', target, squadMoveDir, "CPU: ", pathfindResult.ops, roomName, groupPoint, "Timing:", _squadFlag.memory.runFromNuke);
                                return;
                            } else {
                                pathfindResult = PathFinder.search(groupPoint, target, { roomCallback: roomName => getRoomMatrix4Squad(roomName), range: _squadFlag.memory.moveRange }); //, maxOps: 100 
                                squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                                console.log(_squadFlag.name, '://NUKE WAITING:', target, squadMoveDir, "CPU: ", pathfindResult.ops, roomName, groupPoint, "Timing:", _squadFlag.memory.runFromNuke);
                                return;
                            }
                        }
                    }
                }
            } else {
                _squadFlag.memory.runFromNuke = undefined;
                _squadFlag.memory.edgeExitPos = undefined;
                _squadFlag.memory.nukeRunSpot = undefined;
                _squadFlag.memory.nukeRoom = undefined;
            }

            if (Game.time % 50 === 0) {
                if (ai.aggressive) {
                    ai.aggressive = false;
                } else {
                    ai.aggressive = true;
                }
            }
            if (Game.time % 150 === 0) {
                if (ai.taunter) {
                    ai.taunter = false;
                } else {
                    ai.taunter = true;
                }
            }

            if (Game.time % 300 === 0) {
                target = _squadFlag;
                _squadFlag.memory.targetID = _squadFlag.name;
                ai.taunter = false;
            }

            if (Game.time % 150 === 0) {
                if (ai.goal.switching) {
                    target = getRoomTargets(Game.rooms[roomName]);
                    _squadFlag.memory.targetID = target.id;
                }
            }
            /*if (_squadFlag.pos.roomName !== squaded[0].pos.roomName) {
                console.log('flag not in room, switching to travel mode');
                squadToMatrixClear(_squadFlag);
                switchMode(squadFlag, squaded, 'travel');
                return;
            }*/
            if (_squadFlag.memory.targetID && groupPoint.roomName === _squadFlag.pos.roomName) {
                target = Game.getObjectById(_squadFlag.memory.targetID);
                if (!target) {
                    if (Game.flags[_squadFlag.memory.targetID]) {
                        target = Game.flags[_squadFlag.memory.targetID];
                        if (Game.time % 100 === 0) {
                            target = getRoomTargets(Game.rooms[roomName]);
                            if (target) {
                                _squadFlag.memory.targetID = target.id;
                            }
                        }
                    } else {
                        target = getRoomTargets(Game.rooms[roomName]);
                        if (target) {
                            _squadFlag.memory.targetID = target.id;
                        }
                    }
                }
                if (Game.rooms[roomName]) {
                    let visual = Game.rooms[roomName].visual;
                    visual.circle(target.pos.x, target.pos.y, {
                        radius: 1,
                        stroke: '#bf0',
                        fill: 'transparent'
                    });
                    visual.line(target.pos.x - 1, target.pos.y - 1, target.pos.x + 1, target.pos.y + 1, { color: 'red' });
                    visual.line(target.pos.x - 1, target.pos.y + 1, target.pos.x + 1, target.pos.y - 1, { color: 'red' });


                }
                //                Game.rooms[roomName].visual.text('X', target.pos);


            } else if (roomName && Game.rooms[roomName] && groupPoint.roomName === _squadFlag.pos.roomName) {
                target = getRoomTargets(Game.rooms[roomName]);
                if (target) {
                    _squadFlag.memory.targetID = target.id;
                }
                if (target)
                    Game.rooms[roomName].visual.text('X', target.pos);
            }
            if (groupPoint.roomName !== _squadFlag.pos.roomName) {
                target = _squadFlag;
            }
            if (_squadFlag.memory.musterType === 'testBall') {
                target = _squadFlag;
            }
            ai.target = target.id;

            if (bads.length > 0 && doMove) {
                let bTarget;
                bTarget = groupPoint.findClosestByRange(_.shuffle(bads));
                distance = squadDistance(squaded, bTarget);

                // So lets see if siege is in danger, if it has a 
                var doSiege = true;
                var analyzed;
                let isRamparted;
                var scaredDistance = 4;
                var notScared = false;

                if (bTarget) {
                    /*
                        This are is to analyze the bTarget data that we need is
                        scaredDistance 
                        notScared
                        analyzed.strength


                    */
                    isRamparted = bTarget.pos.lookForStructure(STRUCTURE_RAMPART);

                    if (isRamparted) {
                        // This determines weather to run away or stay and shoot.
                        // If something is ramparted and not moving off it.

                        if (ai.taunter) {
                            if (squadFlag.memory.enemyTarget) {
                                let pTarget = Game.getObjectById(squadFlag.memory.enemyTarget);
                                if (pTarget) {
                                    let pDistance = squadDistance(squaded, pTarget);
                                    if (pDistance === distance) {
                                        bTarget = pTarget;
                                    }
                                }
                            }
                            groupSing(squad, "I fart in your general direction! Your mother was a hamster and your father smelt of elderberries!");
                            if (squadFlag.memory.enemyTarget === bTarget.id) {
                                squadFlag.memory.enemyTargetStanding++;
                                squadFlag.memory.enemyTarget = bTarget.id;
                            } else {
                                squadFlag.memory.enemyTarget = bTarget.id;
                                squadFlag.memory.enemyTargetStanding = 0;
                                squadFlag.memory.enemyTargetStandingDistance = distance;
                            }

                        }
                    }
                    if (_squadFlag.memory.aiSettings) {

                    }
                    analyzed = analyzeCreep(bTarget);
                    var runStrength = 200;
                    //                  if(ai.fleeStrength) {
                    //
                    //                    } 
                    if (analyzed.strength === 200) { // max Strength should 
                        scaredDistance = 4;
                    } else if (analyzed.strength > (runStrength - 100)) {
                        scaredDistance = 3;
                    } else {
                        scaredDistance = 2;
                    }

                    if (isRamparted && squadFlag.memory.enemyTargetStanding > 3) { // and if we can determine they won't jump at us.

                        //                        target = Game.getObjectById(_squadFlag.memory.targetID);
                        pathfindResult = PathFinder.search(groupPoint, target, { roomCallback: roomName => getRoomMatrix4Squad(roomName, bads), range: _squadFlag.memory.moveRange }); //, maxOps: 100 
                        squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                        let objectsInWay = lookForTargets(groupPoint, squadMoveDir, roomName);
                        if (objectsInWay && objectsInWay.length === 0) {
                            scaredDistance = 3;
                            notScared = true;
                        } else {
                            var nearBy = filterNearToBads(squad, objectsInWay);
                            console.log('Next to rampart, lets back up!', nearBy.length);
                            if (nearBy.length > 0) {
                                scaredDistance = 4;
                            } else {
                                scaredDistance = 3;
                                notScared = true;
                            }
                        }
                    }

                    if (analyzed.type === 'fighter') {
                        scaredDistance = ai.meleeRadius;
                    }


                    //                    console.log("Closest Analyized:", analyzed.type, analyzed.strength, bTarget.pos, distance, "Runaway @", scaredDistance, notScared);
                }
                // WE need to determine threat level.

                if (bTarget) {

                    if (ai.aggressive && analyzed.strength <= 150 && !isRamparted && distance <= 4) {

                        pathfindResult = PathFinder.search(groupPoint, bTarget, { roomCallback: roomName => getRoomMatrix4Squad(roomName, bads), range: _squadFlag.memory.moveRange }); //, maxOps: 100 
                        squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                        console.log(_squadFlag.name, '://CHARGE:', analyzed.strength, bTarget, squadMoveDir, "CPU: ", pathfindResult.ops, isRamparted, groupPoint, "D:", distance, "RecalPath:");
                        return;
                    } else if (ai.taunter && notScared && distance === scaredDistance) {

                        doMove = false;
                        doRotation = true;
                        // Need a check here to make sure there's no ramparts in the direct.

                    } else if (distance <= scaredDistance) { // If scaredDistance
                        let badStructs = groupPoint.findInRange(FIND_STRUCTURES, 2);
                        _.forEach(badStructs, function(st) {
                            if (st.structureType !== STRUCTURE_ROAD) {
                                bads.push(st);
                            }
                        });
                        pathfindResult = PathFinder.search(groupPoint, { pos: bTarget.pos, range: scaredDistance + 1 }, {
                            flee: true,
                            roomCallback: roomName => getRoomMatrix4Squad(roomName, bads)
                        });
                        squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                        console.log(_squadFlag.name, '://FLEE:', analyzed.strength, bTarget, squadMoveDir, "CPU: ", pathfindResult.ops, groupPoint, "D:", distance, "RecalPath:");
                        siegeTargets = [];
                        return;
                    }
                }

            }


            if (Game.time % 10 === 0) {
                let breachd = checkPathToTarget(squad, target);
                console.log('Checking for a breach?', breachd);
                if (breachd && _squadFlag.room && _squadFlag.room.controller && _squadFlag.room.controller.level < 7) {
                    console.log('switched to paired');
                    squadToMatrixClear(_squadFlag);
                    switchMode(squadFlag, squaded, 'paired');
                    squadMemory(squaded, bads, analysis);
                    return;

                }
            }
            if (doMove) {
                if (ai.taunter) {
                    bads = [];
                }
                pathfindResult = PathFinder.search(groupPoint, target, { roomCallback: roomName => getRoomMatrix4Squad(roomName, bads), range: _squadFlag.memory.moveRange }); //, maxOps: 100 
                squadMoveDir = groupPoint.getDirectionTo(pathfindResult.path[0]);
                let objectsInWay = lookForTargets(groupPoint, squadMoveDir, roomName);
                if (objectsInWay && objectsInWay.length > 0) {
                    console.log(_squadFlag.name, '://SIEGE-AT:', target, squadMoveDir);
                    squadMoveDir = undefined;
                    siegeTargets = objectsInWay;
                    doRotation = true;
                    /*if (_squadFlag.memory.squadType === 'melee') {
                        squadToMatrixClear(_squadFlag);
                        //if () {
                        //switchMode(squadFlag, squaded, 'paired');
                        //} else {
                        switchMode(squadFlag, squaded, 'siege');
                        squadMemory(squaded, bads, analysis);
                        return;
                    }*/
                } else {
                    siegeTargets = [];
                    console.log(_squadFlag.name, '://MOVE:', target, squadMoveDir, "CPU: ", pathfindResult.ops, roomName, groupPoint, "D:", distance, "Siege Targets:", siegeTargets.length);
                }
                if (squadMoveDir === undefined) {
                    doRotation = true;
                }
            } else {
                squadMoveDir = undefined;
                siegeTargets = [];
                console.log(_squadFlag.name, '://STAY:', target, squadMoveDir, "CPU: 0", roomName, groupPoint, "D:", distance, "Siege Targets:", siegeTargets);
            }

            break;


    }
}

function squadAction(squad, bads) {

    var doHeal = true;
    var creep;
    var target;
    let towers = squad[0].room.towers;
    switch (_squadFlag.memory.squadMode) {

        case 'battle':
        case 'paired':

            if (squad[0].room.controller && squad[0].room.controller.owner && squad[0].room.controller.owner.username === 'likeafox') {
                // Is hoem so don't attack;
                return;
            }
            let squadFlag = squad[0].partyFlag;
            let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
            // so we need to find all the targets that are not underRampart;
            let vulBads = _.filter(bads, function(b) {
                return !b.pos.lookForStructure(STRUCTURE_RAMPART);
            });
            target = groupPoint.findClosestByRange(bads);
            //    let nearBy = squadIsNearTo(squad, target);
            let tempStructs = squad[0].pos.findInRange(FIND_STRUCTURES, 5);
            siegeTargets = _.filter(siegeTargets, function(o) {
                return !o.my && (!o.structureType || (o.structureType && o.structureType !== STRUCTURE_STORAGE && o.structureType !== STRUCTURE_TERMINAL));
            });
            for (let i in squad) {

                if (squad[i].stats('rangedAttack') > 0) {
                    

                    let temp = squad[i].pos.findClosestByRange(vulBads);
                    if (temp && squad[i].pos.inRangeTo(temp, 3)) {
                           squad[i].say("Tpew");
                        if (squad[i] && squad[i].pos.isNearTo(temp) && squad[i].room.storage && (!squad[i].room.storage || !squad[i].pos.inRangeTo(squad[i].room.storage, 2)) && (!squad[i].room.terminal || !squad[i].pos.inRangeTo(squad[i].room.terminal, 2))) {
                            squad[i].rangedMassAttack();
                        } else {
                            squad[i].rangedAttack(temp);
                        }
                    } else if (calcuateMassAttack(squad[i], tempStructs, bads)) {
                        squad[i].rangedMassAttack();
                        squad[i].say('!');
                    } else if (siegeTargets && siegeTargets.length) {
                         squad[i].say("Spew");
                        let attTarget = _.min(squad[i].pos.findInRange(siegeTargets, 3), o => o.hits);
                        // squad[i].pos.isNearTo(attTarget) 
    //                    if (attTarget.structureType !== STRUCTURE_WALL && squad[i] && squad[i].pos.inRangeTo(attTarget, 2) && (!squad[i].room.storage || !squad[i].pos.inRangeTo(squad[i].room.storage, 2)) && (!squad[i].room.terminal || !squad[i].pos.inRangeTo(squad[i].room.terminal, 2))) {
  //                          squad[i].rangedMassAttack();
//                        } else {
                        if(attTarget)
                            squad[i].rangedAttack(attTarget);
      //                  }
                    } else {
                                                squad[i].say("Rpew");
                        let closeStr = _.min(squad[i].pos.findInRange(tempStructs, 3), o => o.hits);
                        if (closeStr) {
    //                        if (closeStr.structureType !== STRUCTURE_WALL && squad[i].pos.inRangeTo(closeStr, 2) && (!squad[i].room.storage || !squad[i].pos.inRangeTo(squad[i].room.storage, 2)) && (!squad[i].room.terminal || !squad[i].pos.inRangeTo(squad[i].room.terminal, 2))) {
  //                              squad[i].rangedMassAttack();
//                            } else {
                                squad[i].rangedAttack(closeStr);
      //                      }
                        }
                    }
                }
                if (squad[i].stats('attack') > 0) {
                    //    if (squad[i].stats('rangedAttack') > 0)squad[i].rangedMassAttack();
                    if (squad[i].stats('healing') === 0 || squad[i].hits === squad[i].hitsMax) {
                        if (siegeTargets && siegeTargets.length) {
                            siegeTargets = _.filter(siegeTargets, function(oo) {
                                return squad[i].pos.isNearTo(oo);
                            });
                            if (siegeTargets.length > 0) {
                                let attTarget = _.min(siegeTargets, o => o.hits);
                                squad[i].memory.meleeRange = true;
                                let zed = squad[i].attack(attTarget);
                                if (zed === OK) {
                                    squad[i]._didHeal = true;
                                }
                            }
                        } else {
                            target = squad[i].pos.findClosestByRange(squad[i].pos.findInRange(FIND_HOSTILE_CREEPS, 4));
                            if (target && squad[i].pos.isNearTo(target)) {
                                squad[i].memory.meleeRange = true;
                                let zed = squad[i].attack(target);
                                if (zed === OK) {
                                    squad[i]._didHeal = true;
                                }
                            } else {

                                target = squad[i].pos.findClosestByRange(tempStructs);
                                if (target && squad[i].pos.isNearTo(target)) {
                                    squad[i].memory.meleeRange = true;
                                    let zed = squad[i].attack(target);
                                    if (zed === OK) {
                                        squad[i]._didHeal = true;
                                    }
                                }
                            }
                        }
                    }
                }
                if (squad[i].stats('dismantle') > 0) {

                    if (squad[i].stats('healing') === 0 || squad[i].hits === squad[i].hitsMax) {
                        if (siegeTargets && siegeTargets.length) {
                            siegeTargets = _.filter(siegeTargets, function(oo) {
                                return squad[i].pos.isNearTo(oo) && oo.structureType !== STRUCTURE_TERMINAL && oo.structureType !== STRUCTURE_STORAGE;
                            });
                            if (siegeTargets.length > 0) {
                                let attTarget = _.min(siegeTargets, o => o.hits);
                                squad[i].memory.meleeRange = true;
                                let zed = squad[i].dismantle(attTarget);
                                if (zed === OK) {
                                    squad[i]._didHeal = true;
                                }
                            }
                        } else {
                            target = squad[i].pos.getNearByHostileStructures();
                            if (!target && squad[i].room.name === squadFlag.pos.roomName) {
                                var strcts = squad[i].pos.findInRange(FIND_STRUCTURES, 1);
                                if (strcts.length > 0) {
                                    target = strcts[0];
                                }
                            }
                            if (squad[i].pos.isNearTo(target)) {
                                squad[i].memory.meleeRange = true;
                                if (squad[i].dismantle(target) === OK) {
                                    squad[i]._didHeal = true;
                                }
                            }
                        }
                    }
                }

            }

            var needHealing = [];
            var noHealingBut = [];
            // Before everything, lets see if any particlar target needs healing badly!
            var emergencyHeal = [];
            for (let i in squad) {
                var totalDamage = getCreepDamage(squad[i], bads);
                if (totalDamage > 0) {
                    squad[i].room.visual.text(totalDamage, squad[i].pos);
                }
                if (totalDamage > 2000) {
                    emergencyHeal.push(squad[i]);
                }
            }

            if (emergencyHeal.length > 0) {
                for (let i in squad) {
                    let rando = Math.floor(Math.random() * emergencyHeal.length);
                    squad[i].heal(emergencyHeal[rando]);

                    //squad[i].heal(emergencyHeal[0]);
                }
                return;
            }

            // So what we want to first figure out is, does it need to heal it self. 



            for (let i in squad) {
                if (squad[i].stats('healing') > 0 && !squad[i]._didHeal) {
                    if (squad[i].hits < squad[i].hitsMax && squad[i].hits > squad[i].hitsMax - squad[i].stats('healing')) { //
                        squad[i].selfHeal();
                        squad[i]._didHeal = true;
                        needHealing.push(squad[i]);
                    } else if (squad[i].hits < squad[i].hitsMax) {
                        needHealing.push(squad[i]);
                    }
                } else if (squad[i].hits < squad[i].hitsMax) {
                    needHealing.push(squad[i]);
                }

                if ((squad[i].stats('healing') === 0 || squad[i].didHeal) && (squad[i].stats('attack') > 0 || squad[i].stats('demolish') > 0) && squad[i].hits === squad[i].hitsMax) {
                    noHealingBut.push(squad[i]);
                }

            }

            if (needHealing.length === 0) {
                for (let i in squad) {
                    if (!squad[i]._didHeal && squad[i].stats('healing') > 0) {
                        if (noHealingBut.length > 0) {
                            squad[i]._didHeal = true;
                            squad[i].heal(noHealingBut.shift());
                        } else {
                            squad[i]._didHeal = true;
                            squad[i].selfHeal();
                        }
                    }
                }
            } else {
                for (let i in squad) {
                    if (!squad[i]._didHeal && squad[i].stats('healing') > 0) {
                        let random = Math.floor(Math.random() * needHealing.length);
                        squad[i].heal(needHealing[random]);
                        squad[i]._didHeal = true;
                    }
                }
            }

            break;

        case 'travel':
        case 'snake':
        case 'siege':
            for (let i in squad) {
                creep = squad[i];
                if (doHeal && creep.stats('heal') > 0 && creep.memory.role !== 'fighter' && creep.memory.role !== 'demolisher') {
                    if (!creep.smartHeal()) { // Does close heal
                        // if ((!creep.room.terminal || creep.pos.getRangeTo(creep.room.terminal) > 3 || creep.room.terminal.pos.lookForStructure(STRUCTURE_RAMPART)) && (!creep.room.storage || creep.pos.getRangeTo(creep.room.storage) > 3 || creep.room.storage.pos.lookForStructure(STRUCTURE_RAMPART))) {
                        creep.smartRangedAttack();
                        // }
                    } else {
                        creep.rangedMassAttack();
                    }
                    continue;
                } else if (creep.stats('attack') > 0) {
                    creep.smartAttack();
                }
                if (creep.stats('rangedAttack') === 10) {
                    creep.rangedMassAttack();
                } else if (creep.stats('rangedAttack') > 0) {
                    if ((!creep.room.terminal || creep.pos.getRangeTo(creep.room.terminal) > 3 || creep.room.terminal.pos.lookForStructure(STRUCTURE_RAMPART)) && (!creep.room.storage || creep.pos.getRangeTo(creep.room.storage) > 3 || creep.room.storage.pos.lookForStructure(STRUCTURE_RAMPART))) {
                        if (creep.smartRangedAttack()) {
                            doHeal = false;
                            creep.smartCloseHeal();
                        }
                    }
                }
                if (creep.stats('dismantle') > 0) {

                    creep.smartDismantle();
                }
            }
            break;
    }
}

function calcuateMassAttack(creep, structs, eCreeps) {
    var range2 = 0;
    var range3 = 0;
    for (let i in eCreeps) {
        if (eCreeps[i].pos.lookForStructure(STRUCTURE_RAMPART)) continue;
        let dis = creep.pos.getRangeTo(eCreeps[i]);
        if (dis === 1) {
            return true;
        } else if (dis === 2) {
            range2 += 3;
        } else if (dis === 3) {
            range3++;
        }
        if (range2 + range3 >= 10) {
            return true;
        }
    }

    for (let i in structs) {
        if (structs[i].structureType === STRUCTURE_WALL || structs[i].structureType === STRUCTURE_ROAD || structs[i].structureType === STRUCTURE_CONTAINER) {
            continue;
        }
        let dis = creep.pos.getRangeTo(structs[i]);
        if (dis === 1) {
            return true;
        } else if (dis === 2) {
            range2 += 3;
        } else if (dis === 3) {
            range3++;
        }
        if (range2 + range3 >= 10) {
            return true;
        }
    }
    //console.log(range2,range3,creep);
    creep.room.visual.text(range2+range3,creep.pos);
    return false;
}

function squadMovement(squad, bads) {
    var topLeft = squad[0].partyFlag.memory.groupPoint;
    var creep;
    var moveTarget;
    let partyFlag = squad[0].partyFlag;

    if (topLeft === undefined) {
        squad[0].partyFlag.memory.groupPoint = squad[0].pos;
        topLeft = squad[0].pos;
        return;
    }

    switch (_squadFlag.memory.squadMode) {

        case 'siege':
            for (let i in squad) {
                creep = squad[i];

                let siegeTarget = Game.getObjectById(creep.partyFlag.memory.target);
                let moveToPos = getFormationPos(siegeTarget, creep.memory.formationPos);
                if (moveToPos !== undefined) {
                    if (!creep.pos.isEqualTo(moveToPos)) {
                        creep.moveMe(moveToPos, { reusePath: 50 });
                    }
                }
            }

            break;
        case 'snake':

            for (let i in squad) {
                creep = squad[i];

                moveTarget = creep.room.storage;
                if (creep.partyFlag.memory.travelTargetID) {
                    moveTarget = Game.getObjectById(creep.partyFlag.memory.travelTargetID);
                    //            console.log(moveTarget);
                    if (!moveTarget) {
                        moveTarget = creep.partyFlag;
                    }
                }
                if (creep.partyFlag.memory.snaked === undefined) {
                    creep.partyFlag.memory.snaked = true;
                }
                var creepMoveDir;
                if (squadMoveDir) {
                    creep.move(squadMoveDir);
                    creep.say('👌');
                } else if (creep.partyFlag.memory.snaked) {
                    if (creep.memory.followingID === undefined) {
                        // Leader point man here
                        let dir = Game.getObjectById(creep.memory.directingID);
                        if (dir === null) {
                            reformSquad = true;
                        }
                        //                console.log(doMovement,"doMov");
                        if (doMovement && !creep.pos.isNearTo(moveTarget)) {
                            //let rsut = creep.moveMe(moveTarget, { reusePath: 50 });

                            creepMoveDir = creep.pos.getDirectionTo(moveTarget);
                            creep.say('🚆');
                            if (!checkDirectionIsGood(creep, creepMoveDir, bads)) {
                                let newDirection = getDirectionToCrawl(creep, creepMoveDir);
                                if (!newDirection) {
                                    // This is we switch who's head
                                    creep.partyFlag.memory.snaked = false;
                                    creepMoveDir = undefined;
                                } else {
                                    creepMoveDir = newDirection;
                                }

                            }
                            if (creepMoveDir) {
                                let zed = creep.move(creepMoveDir);
                            }
                        }
                    } else if (creep.memory.directingID === undefined) {
                        // Last person
                        let fol = Game.getObjectById(creep.memory.followingID);
                        if (fol === null) {
                            reformSquad = true;
                        }

                        if (fol !== null) {
                            if (doMovement) {
                                creep.move(creep.pos.getDirectionTo(fol));
                                //    creep.say('🚆');
                            } else if (!creep.memory.happy) {
                                creep.moveMe(fol, { ignoreCreeps: true });
                                //        creep.say(':(1');
                            }
                        }
                    } else {
                        // everyone else;
                        let fol = Game.getObjectById(creep.memory.followingID);
                        if (fol === null) {
                            reformSquad = true;
                        }
                        if (fol !== null) {
                            if (doMovement) {
                                creep.move(creep.pos.getDirectionTo(fol));
                            } else if (!creep.memory.happy) {
                                creep.moveMe(fol, { ignoreCreeps: true });
                            }
                        }
                    }
                } else {
                    if (creep.memory.directingID === undefined) {
                        let dir = Game.getObjectById(creep.memory.followingID);
                        if (dir === null) {
                            reformSquad = true;
                        }
                        if (doMovement && !creep.pos.isNearTo(moveTarget)) {
                            creepMoveDir = creep.pos.getDirectionTo(moveTarget);
                            creep.say('🚆');
                            if (!checkDirectionIsGood(creep, creepMoveDir, bads)) {
                                let newDirection = getDirectionToCrawl(creep, creepMoveDir, false);
                                if (!newDirection) {
                                    creep.partyFlag.memory.snaked = true;
                                    creepMoveDir = undefined;
                                } else {
                                    creepMoveDir = newDirection;
                                }
                            }
                            if (creepMoveDir) {
                                let zed = creep.move(creepMoveDir);
                            }
                        }
                    } else if (creep.memory.followingID === undefined) {
                        // Last person
                        let fol = Game.getObjectById(creep.memory.directingID);
                        if (fol === null) {
                            reformSquad = true;
                        }

                        if (fol !== null) {
                            if (doMovement) {
                                creep.move(creep.pos.getDirectionTo(fol));
                            } else if (!creep.memory.happy) {
                                creep.moveMe(fol, { ignoreCreeps: true });
                            }
                        }
                    } else {
                        // everyone else;
                        let fol = Game.getObjectById(creep.memory.directingID);
                        if (fol === null) {
                            reformSquad = true;
                        }
                        if (fol !== null) {
                            if (doMovement) {
                                creep.move(creep.pos.getDirectionTo(fol));
                            } else if (!creep.memory.happy) {
                                creep.moveMe(fol, { ignoreCreeps: true });
                            }
                        }
                    }
                }
            }
            break;
        case 'travel':
            for (let i in squad) {
                creep = squad[i];

                moveTarget = creep.partyFlag;
                if (_squadFlag.memory.death) {
                    moveTarget = Game.rooms[creep.memory.home].alphaSpawn;
                    if (creep.isHome) {
                        creep.memory.follower = undefined;
                        creep.memory.death = true;
                    }
                }

                if (creep.partyFlag.memory.travelTargetID) {
                    moveTarget = Game.getObjectById(creep.partyFlag.memory.travelTargetID);
                    //            console.log(moveTarget);
                    if (!moveTarget) {
                        moveTarget = creep.partyFlag;
                    }
                }
                if (creep.memory.followingID === undefined) {
                    // Leader point man here
                    let dir = Game.getObjectById(creep.memory.directingID);
                    if (dir === null) {
                        reformSquad = true;
                    }
                    if (doMovement && !creep.pos.isNearTo(moveTarget)) {
                        //movement.flagMovement(creep);
                        let rsut = creep.moveMe(moveTarget, { reusePath: 50 });
                        creep.say('🚆');
                        if (rsut === -2) { // ERROR NO PATH
                            switchMode(squadFlag, squad, 'battle');
                            //                                    squadMemory(squaded, bads, analysis);
                            console.log('//Travel siwtching to Battle due to -2 PATH');
                        }
                    }
                } else if (creep.memory.directingID === undefined) {
                    // Last person
                    let fol = Game.getObjectById(creep.memory.followingID);
                    if (fol === null) {
                        reformSquad = true;
                    }

                    if (fol !== null) {
                        if (doMovement) {
                            creep.move(creep.pos.getDirectionTo(fol));
                            //    creep.say('🚆');
                        } else if (!creep.memory.happy) {
                            creep.moveMe(fol, { ignoreCreeps: true });
                            //        creep.say(':(1');
                        }
                    }
                } else {
                    // everyone else;
                    let fol = Game.getObjectById(creep.memory.followingID);
                    if (fol === null) {
                        reformSquad = true;
                    }
                    if (fol !== null) {
                        if (doMovement) {
                            creep.move(creep.pos.getDirectionTo(fol));
                            //                        creep.say();
                        } else if (!creep.memory.happy) {
                            creep.moveMe(fol, { ignoreCreeps: true });
                            //                      creep.say(':(2');
                        }
                    }
                }
            }
            break;


        case 'paired':

            for (let i in partyFlag.memory.squadGrouping) {
                let squad = partyFlag.memory.squadGrouping[i];
                let tank = Game.creeps[squad.tank];
                let support = Game.creeps[squad.support];
                let target = Game.getObjectById(squad.target);

                if (target && target.room && tank && support) {
                    target.room.visual.text('T', target.pos);
                    target.room.visual.line(tank.pos, support.pos, { color: 'red' });
                }
                if (tank && !support) {
                    if (!tank.pos.isNearTo(target)) {
                        tank.moveMe(target);
                    }
                }

                if (target && tank && support && tank.fatigue === 0 && support.fatigue === 0) {
                    if (tank.pos.isNearTo(support) || isNearToInNextRoom(tank, support)) {
                        if (!tank.pos.isNearTo(target) || tank.isAtEdge) {
                            tank.moveMe(target);

                            support.move(support.pos.getDirectionTo(tank));


                        } else {
                            //if (target.structureType && tank.pos.isNearTo(target) && !support.pos.isNearTo(target)) {
                            //support.moveMe(target);
                            //}
                            if (!tank.pos.isNearTo(target)) {
                                support.move(support.pos.getDirectionTo(tank));
                            }
                        }
                    } else {
                        if (!support.isAtEdge) {
                            tank.moveMe(support);
                        }
                        support.move(support.pos.getDirectionTo(tank));

                    }
                }
            }
            break;

        case 'battle':
            if (squadMoveDir) {
                squad[0].partyFlag.memory.oldPoint = {
                    x: partyFlag.memory.groupPoint.x,
                    y: partyFlag.memory.groupPoint.y,
                    roomName: partyFlag.memory.groupPoint.roomName,
                };

                switch (squadMoveDir) {
                    case 1:
                        partyFlag.memory.groupPoint.y--;
                        break;
                    case 2:
                        partyFlag.memory.groupPoint.y--;
                        partyFlag.memory.groupPoint.x++;
                        break;
                    case 3:
                        partyFlag.memory.groupPoint.x++;
                        break;
                    case 4:
                        partyFlag.memory.groupPoint.x++;
                        partyFlag.memory.groupPoint.y++;
                        break;
                    case 5:
                        partyFlag.memory.groupPoint.y++;
                        break;
                    case 6:
                        partyFlag.memory.groupPoint.x--;
                        partyFlag.memory.groupPoint.y++;
                        break;
                    case 7:
                        partyFlag.memory.groupPoint.x--;
                        break;
                    case 8:
                        partyFlag.memory.groupPoint.y--;
                        partyFlag.memory.groupPoint.x--;
                        break;
                }

            } else {
                checkLocationAndMove(squad);
            }

            partyFlag.memory.groupPoint = checkPosRoomTransistion(partyFlag.memory.groupPoint);

            let room = squad[0].room;
            room.visual.circle(topLeft.x, topLeft.y, { radius: 0.5, opacity: 0.15, fill: '0f000F' });
            var badPos = false;
            for (let i in squad) {
                let creep = squad[i];
                let targetPos;
                var tempPos;
                var doLook = false;
                switch (creep.memory.posistion) {
                    case 1:
                        tempPos = checkPosRoomTransistion({ x: topLeft.x, y: topLeft.y, roomName: topLeft.roomName });
                        targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                        if (!creep.pos.isEqualTo(targetPos)) {
                            if (creep.isAtEdge && creep.pos.isNearTo(targetPos)) {
                                creep.move(creep.pos.getDirectionTo(targetPos));
                            } else {
                                creep.moveMe(targetPos);
                            }
                        }
                        break;
                    case 2:
                        //                targetPos = new RoomPosition(coronateCheck(topLeft.x + 1), coronateCheck(topLeft.y), topLeft.roomName);
                        tempPos = checkPosRoomTransistion({ x: topLeft.x + 1, y: topLeft.y, roomName: topLeft.roomName });
                        targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                        if (!creep.pos.isEqualTo(targetPos)) {
                            if (creep.isAtEdge && creep.pos.isNearTo(targetPos)) {
                                creep.move(creep.pos.getDirectionTo(targetPos));
                            } else {
                                creep.moveMe(targetPos);
                            }
                        }
                        break;
                    case 3:
                        //              targetPos = new RoomPosition(coronateCheck(topLeft.x + 1), coronateCheck(topLeft.y + 1), topLeft.roomName);
                        tempPos = checkPosRoomTransistion({ x: topLeft.x + 1, y: topLeft.y + 1, roomName: topLeft.roomName });
                        targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                        if (!creep.pos.isEqualTo(targetPos)) {
                            if (creep.isAtEdge && creep.pos.isNearTo(targetPos)) {
                                creep.move(creep.pos.getDirectionTo(targetPos));
                            } else {
                                creep.moveMe(targetPos);
                            }
                        }
                        break;
                    case 4:
                        //                targetPos = new RoomPosition(coronateCheck(topLeft.x), coronateCheck(topLeft.y + 1), topLeft.roomName);
                        tempPos = checkPosRoomTransistion({ x: topLeft.x, y: topLeft.y + 1, roomName: topLeft.roomName });
                        targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                        if (!creep.pos.isEqualTo(targetPos)) {
                            if (creep.isAtEdge && creep.pos.isNearTo(targetPos)) {
                                creep.move(creep.pos.getDirectionTo(targetPos));
                            } else {
                                creep.moveMe(targetPos);
                            }
                        }
                        break;
                }
            }
            checkLocationAndMove(squad);
            break;
    }
}



function switchMode(flag, squad, toMode) {
    squad = _.clone(squad);
    var fromMode = flag.memory.squadMode;
    let caravan;
    switch (fromMode) {
        case 'siege':
            //        squad[0].partyFlag.memory.travelTargetID = undefined;
            break;
        case 'battle':
            break;
        case 'travel':
        case 'snake':
            for (let ie in squad) {
                squad[ie].memory.directingID = undefined;
                squad[ie].memory.followingID = undefined;
            }

            break;
        case 'paired':
            for (let ie in squad) {
                squad[ie].memory.directingID = undefined;
                squad[ie].memory.followingID = undefined;
                squad[ie].memory.support = undefined;
                squad[ie].memory.tank = undefined;
            }

            break;

    }
    var squadFlag = squad[0].partyFlag;
    switch (toMode) {

        case 'paired':

            let healer = []; // Healing types 
            let tank = []; // Attack/demo types with high tough
            let mixed = []; // Healing and attack types.
            let attack = []; // attack types that will be in the back most likely
            for (let i in squad) {
                switch (squad[i].memory.role) {
                    case 'healer':
                        healer.push(squad[i]);
                        continue;
                    case 'mage':
                        mixed.push(squad[i]);
                        continue;
                    case 'harass':
                    case 'ranger':
                        attack.push(squad[i]);
                        continue;
                    case 'paladin':
                    case 'fighter':
                    case 'demolisher':
                        tank.push(squad[i]);
                        continue;
                }
            }
            let squad1 = {
                tank: null,
                support: null,
            };
            let squad2 = {
                tank: null,
                support: null,
            };
            // First we go through and assign all that want to be assigned, instead of just filled.
            for (let i in tank) {
                if (!squad1.tank) {
                    squad1.tank = tank[i];
                    continue;
                }
                if (!squad2.tank) {
                    squad2.tank = tank[i];
                    continue;
                }
                if (!squad1.support) {
                    squad1.support = tank[i];
                    continue;
                }
                if (!squad2.support) {
                    squad2.support = tank[i];
                    continue;
                }

            }
            for (let i in healer) {
                if (!squad1.support) {
                    squad1.support = healer[i];
                    continue;
                }
                if (!squad2.support) {
                    squad2.support = healer[i];
                    continue;
                }
                if (!squad1.tank) {
                    squad1.tank = healer[i];
                    continue;
                }
                if (!squad2.tank) {
                    squad2.tank = healer[i];
                    continue;
                }
            }

            // Now we have dedicated everything.
            if (mixed.length > 0) {
                for (let i in mixed) {
                    if (!squad1.support) {
                        squad1.support = mixed[i];
                        continue;
                    }
                    if (!squad2.support) {
                        squad2.support = mixed[i];
                        continue;
                    }
                    if (!squad1.tank) {
                        squad1.tank = mixed[i];
                        continue;
                    }
                    if (!squad2.tank) {
                        squad2.tank = mixed[i];
                        continue;
                    }
                }
            }
            if (attack.length > 0) {
                for (let i in attack) {
                    if (!squad1.support) {
                        squad1.support = attack[i];
                        continue;
                    }
                    if (!squad2.support) {
                        squad2.support = attack[i];
                        continue;
                    }
                    if (!squad1.tank) {
                        squad1.tank = attack[i];
                        continue;
                    }
                    if (!squad2.tank) {
                        squad2.tank = attack[i];
                        continue;
                    }
                }
            }

            console.log(squad1.tank, squad1.support);
            console.log(squad2.tank, squad2.support);
            flag.memory.squadGrouping = {};
            flag.memory.squadGrouping.one = {};
            flag.memory.squadGrouping.two = {};

            if (squad1.tank && squad1.support) {

                if (squad1.tank.room.name === squad1.tank.partyFlag.pos.roomName) {
                    let did = getRoomTargets(squad[0].room);
                    if (did) {
                        flag.memory.squadGrouping.one.target = did.id;
                    }
                }
                flag.memory.squadGrouping.one.tank = squad1.tank.name;
                flag.memory.squadGrouping.one.support = squad1.support.name;

                squad1.tank.memory.tank = true;
                squad1.tank.memory.directingID = squad1.support.id;

                squad1.support.memory.support = true;
                squad1.support.memory.followingID = squad1.tank.id;
            } else if (squad1.tank) {
                squad1.tank.memory.tank = true;
                //                squad1.tank.memory.directingID = squad1.support.id;
                flag.memory.squadGrouping.one.tank = squad1.tank.name;

                flag.memory.squadGrouping.one.target = getRoomTargets(squad[0].room).id;


            }
            if (squad2.tank && squad2.support) {
                if (squad2.tank.room.name === squad2.tank.partyFlag.pos.roomName) {
                    let tgt = getRoomTargets(squad[0].room);
                    if (tgt) {
                        flag.memory.squadGrouping.two.target = tgt.id;
                    }
                }
                flag.memory.squadGrouping.two.tank = squad2.tank.name;
                flag.memory.squadGrouping.two.support = squad2.support.name;

                squad2.support.memory.support = true;
                squad2.tank.memory.tank = true;
                squad2.tank.memory.directingID = squad2.support.id;
                squad2.support.memory.followingID = squad2.tank.id;
            } else if (squad2.tank) {
                squad2.tank.memory.tank = true;
                //                squad2tank.tank.memory.directingID = squad2tank.support.id;
                flag.memory.squadGrouping.two.tank = squad2.tank.name;
                flag.memory.squadGrouping.two.target = getRoomTargets(squad[0].room).id;

            }
            break;
        case 'siege':
            let point = Game.getObjectById(squadFlag.memory.pointID);
            if (!squadFlag.memory.pointID || !point) {
                for (let i in squad) {
                    //                console.log(point,i,squad[i]);
                    if (!point) {
                        point = squad[i];
                        continue;
                    }
                    // We are looking for those with dismantle/attack or high tough.
                    if (squad[i].stats('attack') > point.stats('attack') ||
                        squad[i].stats('dismantle') > point.stats('dismantle') ||
                        squad[i].stats('tough') > point.stats('tough')) {
                        point = squad[i];
                        continue;
                    }
                    if (squad[i].memory.directingID && squad[i].memory.followingID === undefined) {
                        flag.memory.attackPos = squad[i].pos;
                    } else if (squad[i].memory.posistion === 1) {
                        flag.memory.attackPos = squad[i].pos;
                    }

                }
                flag.memory.pointID = point.id;
            }
            if (siegeTargets && siegeTargets.length > 0) {
                flag.memory.target = siegeTargets[0].id;
            }




            break;

        case 'battle':
            var melee = 0;
            var range = 0;
            var siege = 0;
            var total = 0;
            // determine if squad[0] and squad[1]
            let squadDirected = squad[0].pos.getDirectionTo(squad[1]);
            if (squadDirected === 8 || squadDirected === 1 || squadDirected === 1) {

                let ie = squad.length;
                while (ie--) {

                    squad[ie].memory.posistion = squad[ie].memory.battlePos;
                    // Setup the groupPoint - which is the 2nd posistion on this - it allows for formation easily.
                    if (squad[ie].memory.battlePos === 3) {
                        flag.memory.groupPoint = new RoomPosition(squad[ie].pos.x, squad[ie].pos.y, squad[ie].pos.roomName);
                        let matrix = getRoomMatrix4Squad(flag.pos.roomName);
                        let value = matrix.get(flag.memory.groupPoint.x, flag.memory.groupPoint.y);
                        while (value == 255) {
                            switch (Math.floor(Math.random() * 4)) {
                                case 0:
                                    //    if(flag.memory.groupPoint.x < 0)
                                    flag.memory.groupPoint.x++;
                                    break;
                                case 1:
                                    flag.memory.groupPoint.x--;
                                    break;
                                case 2:
                                    flag.memory.groupPoint.y++;
                                    break;
                                case 3:
                                    flag.memory.groupPoint.y--;
                                    break;
                            }
                            value = matrix.get(flag.memory.groupPoint.x, flag.memory.groupPoint.y);
                        }

                    }


                    range += squad[ie].getActiveBodyparts(RANGED_ATTACK);
                    let thisAttack = squad[ie].getActiveBodyparts(ATTACK);
                    melee += thisAttack;
                    let thisWork = squad[ie].getActiveBodyparts(WORK);
                    siege += thisWork;
                    if (thisAttack > 0 || thisWork > 0) {
                        squad[ie].memory.meleeAttack = true;
                    }
                    total += range + melee + siege;
                }

            } else {
                for (let ie in squad) {
                    squad[ie].memory.posistion = squad[ie].memory.battlePos;
                    // Setup the groupPoint - which is the 2nd posistion on this - it allows for formation easily.
                    if (squad[ie].memory.battlePos === 2) {
                        flag.memory.groupPoint = new RoomPosition(squad[ie].pos.x, squad[ie].pos.y, squad[ie].pos.roomName);
                        let matrix = getRoomMatrix4Squad(flag.pos.roomName);
                        let value = matrix.get(flag.memory.groupPoint.x, flag.memory.groupPoint.y);
                        while (value == 255) {
                            switch (Math.floor(Math.random() * 4)) {
                                case 0:
                                    flag.memory.groupPoint.x++;
                                    break;
                                case 1:
                                    flag.memory.groupPoint.x--;
                                    break;
                                case 2:
                                    flag.memory.groupPoint.y++;
                                    break;
                                case 3:
                                    flag.memory.groupPoint.y--;
                                    break;
                            }
                            value = matrix.get(flag.memory.groupPoint.x, flag.memory.groupPoint.y);
                        }

                    }


                    range += squad[ie].getActiveBodyparts(RANGED_ATTACK);
                    let thisAttack = squad[ie].getActiveBodyparts(ATTACK);
                    melee += thisAttack;
                    let thisWork = squad[ie].getActiveBodyparts(WORK);
                    siege += thisWork;
                    if (thisAttack > 0 || thisWork > 0) {
                        squad[ie].memory.meleeAttack = true;
                    }
                    total += range + melee + siege;
                }
            }


            if (melee >= 40 || siege >= 40) {

                // This will trigger siege mode, so in reality we need at least 3
                flag.memory.squadType = 'melee';
            } else {
                flag.memory.squadType = 'range';
            }
            break;


        case 'snake':

            caravan = _.sortBy(squad, function(o) {
                return o.memory.battlePos;
            });
            // Healing needs to be in the middle,
            // ends need to be non-healing.

            for (let a = 0; a < caravan.length; a++) {
                caravan[a].memory.battlePos = a + 1;
                if (a === 0 && caravan[a + 1]) {
                    caravan[a].memory.directingID = caravan[a + 1].id;
                    // It is directing the next one.
                } else if (a === caravan.length - 1 && caravan[a - 1]) {
                    caravan[a].memory.followingID = caravan[a - 1].id;
                    // It is following the last one.
                } else if (caravan[a + 1] && caravan[a - 1]) {
                    caravan[a].memory.directingID = caravan[a + 1].id;
                    caravan[a].memory.followingID = caravan[a - 1].id;
                }
            }
            break;

        case "travel":

            caravan = _.sortBy(squad, function(o) {
                return o.memory.battlePos;
            });

            for (let a = 0; a < caravan.length; a++) {
                caravan[a].memory.battlePos = a + 1;
                if (a === 0 && caravan[a + 1]) {
                    caravan[a].memory.directingID = caravan[a + 1].id;
                    caravan[a].memory.point = true;
                    // It is directing the next one.
                } else if (a === caravan.length - 1 && caravan[a - 1]) {
                    caravan[a].memory.followingID = caravan[a - 1].id;
                    // It is following the last one.
                } else if (caravan[a + 1] && caravan[a - 1]) {
                    caravan[a].memory.directingID = caravan[a + 1].id;
                    caravan[a].memory.followingID = caravan[a - 1].id;
                }
            }
            break;
    }
    flag.memory.squadMode = toMode;
}


function f(number) {
    if (number > 8) return number - 8;
    if (number < 1) return number + 8;
    return number;
}

function getRoomTargets(room) {
    if (_squadFlag && _squadFlag.memory.homeDefense) {
        let close = room.find(FIND_HOSTILE_CREEPS);
        if (close.length > 0) {
            return close[0];
        } else {
            console.log('No Enemies, I need death!');
            _squadFlag.memory.death = true;
            return undefined;
        }
    }
    if (!room) {
        console.log(room, 'failure to get targets');
        return [];
    }
    if (_squadFlag && _squadFlag.memory.aiSettings && _squadFlag.memory.aiSettings.goal.walls) {
        let allStructs = this.find(FIND_STRUCTURES);
        allStructs = _.filter(allStructs, function(o) {
            return o.structureType === STRUCTURE_WALL || o.structureType === STRUCTURE_RAMPART;
        });
        return allStructs[Math.floor(Math.random() * allStructs.length)];
    }
    return room.getClearBaseTarget();
}

function getCreepDamage(target, groupOfCreeps) {
    var total = 0;
    var damage;
    var e;
    _.forEach(groupOfCreeps, function(o) {
        if (o.pos.isNearTo(target)) {
            for (e in o.body) {
                if (o.body[e].type === ATTACK) {
                    damage = 30;
                    if (o.body[e].boost !== undefined) {
                        damage *= BOOSTS.attack[o.body[e].boost].attack;
                    }
                    total += damage;
                }
                if (o.body[e].type === RANGED_ATTACK) {
                    damage = 10;
                    if (o.body[e].boost !== undefined) {
                        damage *= BOOSTS.ranged_attack[o.body[e].boost].rangedAttack;
                    }
                    total += damage;
                }

            }
        } else if (o.pos.getRangeTo(target) <= 3) {
            for (e in o.body) {
                if (o.body[e].type === RANGED_ATTACK) {
                    damage = 10;
                    if (o.body[e].boost !== undefined) {
                        damage *= BOOSTS.ranged_attack[o.body[e].boost].rangedAttack;
                    }
                    total += damage;
                }

            }
        }
    });
    return total;
}

function squadEvacutateSpot(flag, groupPoint) {
    var Exits = [FIND_EXIT_TOP,
        FIND_EXIT_RIGHT,
        FIND_EXIT_BOTTOM,
        FIND_EXIT_LEFT
    ];

    var closest = 100;
    var exited;
    if (flag.memory.edgeExitPos) {
        return new RoomPosition(flag.memory.edgeExitPos.x, flag.memory.edgeExitPos.y, flag.memory.edgeExitPos.roomName);
    }

    for (var e in Exits) {
        const exit = groupPoint.findClosestByPath(Exits[e]);
        var distance = groupPoint.getRangeTo(exit);
        if (distance < closest) {
            closest = distance;
            exited = exit;
        }
    }
    flag.memory.edgeExitPos = {
        x: exited.x,
        y: exited.y,
        roomName: exited.roomName
    };
    return new RoomPosition(flag.memory.edgeExitPos.x, flag.memory.edgeExitPos.y, flag.memory.edgeExitPos.roomName);
}


function checkDirectionIsGood(creep, direction, bads) {
    let pos = getFormationPos(creep, direction);
    if (pos.x === 0 || pos.x === 49 || pos.y === 0 || pos.y === 49) return false;
    let lookedResult = creep.room.lookAt(pos);

    for (let i in lookedResult) {
        if (lookedResult[i].terrain && lookedResult[i].terrain === 'wall') {
            return false;
        }
        if (lookedResult[i].creep) {
            return false;
        }

        if (lookedResult[i].structure && lookedResult[i].structure.structureType !== 'road' && lookedResult[i].structure.structureType !== 'container') { //&& lookedResult[i].structure.structureType !== 'rampart'
            return false;
        }
    }
    let inRange = _.filter(pos.findInRange(FIND_HOSTILE_CREEPS, 2), function(o) {
        return o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0;
    });
    console.log('checking direction is good', direction, inRange, "In 2 :", inRange);
    if (inRange.length > 0) {
        return false;
    }
    return true;
}

function getDirectionToCrawl(creep, direction, clockwise) {
    var movedir = direction;
    var spin = 1;
    if (clockwise === true || clockwise === undefined) {
        spin = -1;
    } else {
        spin = 1;
    }
    var newDirection;
    for (let i = 1; i < 4; i++) {
        let e = i * spin;
        newDirection = f(direction + e);
        if (checkDirectionIsGood(creep, newDirection)) {
            return newDirection;
        }
    }
    return false;
}
var LEFTROTATE = 1;
var RIGHTROTATE = 2;
var CROSSSWITCH = 3;
var XSWITCH = 4;
var YSWITCH = 5;

function switchPos(creep, creep2) {
    if (!creep || !creep2) {
        return;
    }
    switch (creep.memory.posistion) {
        case 1:
            switch (creep2.memory.posistion) {
                case 2:
                    creep.memory.posistion = 2;
                    creep2.memory.posistion = 1;
                    break;
                case 3:
                    creep.memory.posistion = 3;
                    creep2.memory.posistion = 1;
                    break;
                case 4:
                    creep.memory.posistion = 4;
                    creep2.memory.posistion = 1;
                    break;
            }
            break;
        case 2:
            switch (creep2.memory.posistion) {
                case 1:
                    creep.memory.posistion = 1;
                    creep2.memory.posistion = 2;
                    break;
                case 3:
                    creep.memory.posistion = 3;
                    creep2.memory.posistion = 2;
                    break;
                case 4:
                    creep.memory.posistion = 4;
                    creep2.memory.posistion = 2;
                    break;
            }
            break;
        case 3:
            switch (creep2.memory.posistion) {
                case 1:
                    creep.memory.posistion = 1;
                    creep2.memory.posistion = 3;
                    break;
                case 2:
                    creep.memory.posistion = 2;
                    creep2.memory.posistion = 3;
                    break;
                case 4:
                    creep.memory.posistion = 4;
                    creep2.memory.posistion = 3;
                    break;
            }

            break;
        case 4:
            switch (creep2.memory.posistion) {
                case 1:
                    creep.memory.posistion = 1;
                    creep2.memory.posistion = 4;
                    break;
                case 2:
                    creep.memory.posistion = 2;
                    creep2.memory.posistion = 4;
                    break;
                case 3:
                    creep.memory.posistion = 3;
                    creep2.memory.posistion = 4;
                    break;
            }

            break;
    }
}

function getZoneToScan(centerPoint, direction, options) {
    /*
        This function's design is to provide a centerPoint, and direction that you want to scan in. Can add options to change the height/width and scan distance
        Output of this function is designed to be used with lookAtArea(10,5,11,7);

        Input :
        CenterPoint - is an x,y posistion;
        Direction - In Game direction to get scan area; Undefined direction will return the whole scan box.
        Options -   squadWidth; squadHeight; detectRange; are the inputs for options
                    Default - 2x2 hight/width with a 3 distance range.
           

        Output [Object:{top:0,left:0,bottom:0,right:0}]; This matches lookAtArea's input.
    */

    // x and y are the "center" point
    let x = centerPoint.x;
    let y = centerPoint.y;

    // x and squadHeight are the size of the box.
    let squadWidth = 2;
    let squadHeight = 2;
    let detectRange = 3;

    if (options) {
        if (options.squadWidth) squadWidth = options.squadWidth;
        if (options.squadHeight) squadHeight = options.squadHeight;
        if (options.range) detectRange = options.range;
    }

    // Following variables is the max size of the scan box from centerPoint - offset by squadsize
    let boxMaxX = squadWidth + detectRange - 1; // RIGHT most of the scan square
    let boxMaxY = squadHeight + detectRange - 1; // Bottom most of the scan square

    let boxMinX = detectRange * -1; // Left most of the scan square
    let boxMinY = detectRange * -1; // Right most of the scan square

    switch (direction) {
        //      default:
        //            return { left: boxMinX, right: boxMaxX, top: boxMinY, bottom: boxMaxY };

        case 8:
            let dir8 = { x: x + boxMinX, y: y + boxMinY };
            return { left: dir8.x, right: dir8.x + detectRange - 1, top: dir8.y, bottom: dir8.y + detectRange - 1 };

        case 7:
            let dir7 = { x: x + boxMinX, y: y };
            return { left: dir7.x, top: dir7.y, right: dir7.x + detectRange - 1, bottom: dir7.y + squadHeight - 1 };
        case 6:
            let dir6 = { x: x + boxMinX, y: y + squadHeight };
            return { left: dir6.x, top: dir6.y, right: dir6.x + detectRange - 1, bottom: dir6.y + detectRange - 1 };

        case 5:
            let di53 = { x: x, y: y + squadHeight };
            return { left: di53.x, top: di53.y, right: di53.x + squadHeight - 1, bottom: di53.y + detectRange - 1 };

        case 4:
            let dir4 = { x: x + squadWidth, y: y + squadHeight };
            return { left: dir4.x, top: dir4.y, right: dir4.x + detectRange - 1, bottom: dir4.y + detectRange - 1 };

        case 3:
            let dir3 = { x: x + squadWidth, y: y };
            return { top: dir3.y, right: dir3.x + detectRange - 1, bottom: dir3.y + squadWidth - 1, left: dir3.x, };

        case 2:
            let dir2 = { x: x + squadWidth, y: y + boxMinY };
            return { left: dir2.x, top: dir2.y, right: dir2.x + detectRange - 1, bottom: dir2.y + detectRange - 1 };

        case 1:

            let dir1 = { x: x, y: y + boxMinY };
            return { top: dir1.y, right: dir1.x + squadHeight - 1, bottom: dir1.y + detectRange - 1, left: dir1.x };

    }
}

function getExtraScanPoints(centerPoint, direction, options) {
    /* Due to the corners directions needing an extra two spots to scan.
    // Example:
                      8 * * 2
                      * #,# *
                      * #,# *
                      6 * * 4

                      * = extra points to scan.

    For each diagonal direction, you will want the two extra points(*).
    */

    let x = centerPoint.x;
    let y = centerPoint.y;

    // x and squadHeight are the size of the box.
    let squadWidth = 2;
    let squadHeight = 2;

    if (options) {
        if (options.squadWidth) squadWidth = options.squadWidth;
        if (options.squadHeight) squadHeight = options.squadHeight;
    }

    switch (direction) {
        case 2:
            // get the top, right corner and return two points with -1y and +1 x
            let dir2 = { x: x + squadWidth - 1, y: y };
            return [{ x: dir2.x, y: dir2.y - 1 }, { x: dir2.x + 1, y: dir2.y }];
        case 4:
            // get bottom right corner, and return two points with +1 y and +1 x
            let dir4 = { x: x + squadWidth - 1, y: y + squadHeight - 1 };
            return [{ x: dir4.x + 1, y: dir4.y }, { x: dir4.x, y: dir4.y + 1 }];
        case 6:
            let dir6 = { x: x, y: y + squadHeight - 1 };
            // get bottom left corner, and return two points iwht -1 x and +1 y
            return [{ x: dir6.x - 1, y: dir6.y }, { x: dir6.x, y: dir6.y + 1 }];
        case 8:
            let dir8 = { x: x, y: y };
            // get top left corner, adn return two points with -1 x and -1 y
            return [{ x: dir8.x - 1, y: dir8.y }, { x: dir8.x, y: dir8.y - 1 }];
    }
}

function lookForTargets(groupPoint, direction, roomName) {
    // This will look at area, analyze what's returned and filter out everything except structures and creeps
    let room = Game.rooms[roomName];
    if (!direction || !room) return;
    let zone = getZoneToScan(groupPoint, direction, { range: 1 });
    let foundObjects;
    if (zone) {
        foundObjects = room.lookAtArea(coronateCheck(zone.top), coronateCheck(zone.left), coronateCheck(zone.bottom), coronateCheck(zone.right), true);
    }
    let extraZone = getExtraScanPoints(groupPoint, direction);
    for (let i in extraZone) {
        let looked = room.lookAt(coronateCheck(extraZone[i].x), coronateCheck(extraZone[i].y));
        for (let i in looked) {
            foundObjects.push(looked[i]);
        }
    }
    let returnArray = [];
    for (let i in foundObjects) {
        if (foundObjects[i].structure && foundObjects[i].structure.structureType !== STRUCTURE_ROAD) {
            returnArray.push(foundObjects[i].structure);
        } else if (foundObjects[i].creep) {
            returnArray.push(foundObjects[i].creep);
        }
    }
    return returnArray;
}

function battleRotate(squad, type) {
    //    if(squadFatique(squad)) return;
    //console.log('battle rotate');
    let rando = Math.floor(Math.random() * 10);
    //if()
    if (squad.length < 4 && rando !== 0) {
        var happyPos = [];
        for (let i in squad) {
            happyPos.push(squad[i].memory.posistion);
        }

        switch (type) {
            case LEFTROTATE:
            case CROSSSWITCH:
                for (let i in squad) {
                    do {
                        squad[i].memory.posistion--;
                        if (squad[i].memory.posistion < 1) squad[i].memory.posistion = 4;
                    } while (!_.contains(happyPos, squad[i].memory.posistion));
                }
                break;
            case XSWITCH:
            case YSWITCH:
            case RIGHTROTATE:
                for (let i in squad) {
                    do {
                        squad[i].memory.posistion++;
                        if (squad[i].memory.posistion > 4) squad[i].memory.posistion = 1;
                    } while (!_.contains(happyPos, squad[i].memory.posistion));
                }
                break;
        }
    } else if (squad.length === 4 || rando === 0) {
        switch (type) {
            case LEFTROTATE:
                for (let i in squad) {
                    squad[i].memory.posistion--;
                    if (squad[i].memory.posistion < 1) squad[i].memory.posistion = 4;
                }
                break;
            case RIGHTROTATE:
                for (let i in squad) {
                    squad[i].memory.posistion++;
                    if (squad[i].memory.posistion > 4) squad[i].memory.posistion = 1;
                }
                break;
            case CROSSSWITCH:
                for (let i in squad) {

                    switch (squad[i].memory.posistion) {
                        case 1:
                            squad[i].memory.posistion = 3;
                            break;
                        case 2:
                            squad[i].memory.posistion = 4;
                            break;
                        case 3:
                            squad[i].memory.posistion = 1;
                            break;
                        case 4:
                            squad[i].memory.posistion = 2;
                            break;
                    }
                }
                break;
            case XSWITCH:

                for (let i in squad) {
                    switch (squad[i].memory.posistion) {
                        case 1:
                            squad[i].memory.posistion = 2;
                            break;
                        case 2:
                            squad[i].memory.posistion = 1;
                            break;
                        case 3:
                            squad[i].memory.posistion = 4;
                            break;
                        case 4:
                            squad[i].memory.posistion = 3;
                            break;
                    }
                }
                break;
            case YSWITCH:
                for (let i in squad) {
                    switch (squad[i].memory.posistion) {
                        case 1:
                            squad[i].memory.posistion = 4;
                            break;
                        case 2:
                            squad[i].memory.posistion = 3;
                            break;
                        case 3:
                            squad[i].memory.posistion = 2;
                            break;
                        case 4:
                            squad[i].memory.posistion = 1;
                            break;
                    }
                }
                break;
            default:
                console.log(type, "request for battle sqich");
                break;
        }
    }
}


function checkPathToTarget(squad, target) {
    // This is used to determine if walls are down and you can get to target to destory. 
    var squadFlag = squad[0].partyFlag;
    let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
    var struc = squad[0].room.find(FIND_STRUCTURES);
    var test2 = _.filter(struc, function(o) {
        return o.structureType === STRUCTURE_WALL || o.structureType === STRUCTURE_RAMPART;
    }); // This is something is not on a rampart
    var pathfindResult = PathFinder.search(groupPoint, target, { roomCallback: roomName => createRoomMatrix4Breach(roomName, test2), range: 1 }); //, maxOps: 100     
    if (pathfindResult.incomplete) {
        return false;
    }
    return true;
}
var roomBreachMatrix;

function createRoomMatrix4Breach(roomName, stuff) { // This is all flag based, it will be stored in flag.
    if (roomBreachMatrix === undefined) {
        roomBreachMatrix = {};
    }
    if (!roomBreachMatrix[roomName]) {
        const terrain = new Room.Terrain(roomName);
        const matrix = new PathFinder.CostMatrix();

        // Fill CostMatrix with default terrain costs for future analysis:
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                var weight = 0;
                switch (tile) {
                    case TERRAIN_MASK_WALL:
                        weight = 0xff;
                        break;
                    default:
                        break;
                }
                matrix.set(x, y, weight);
            }
        }
        roomBreachMatrix[roomName] = matrix;

    }
    var rtnMatrix = roomBreachMatrix[roomName].clone();
    for (let i in stuff) {
        if (stuff[i].pos) {
            rtnMatrix.set(stuff[i].pos.x, stuff[i].pos.y, 0xff);
        }
    }
    return rtnMatrix;
}

function isNearToInNextRoom(creep, nearByTarget) {
    if (!creep || !creep.isNearEdge || !nearByTarget || !nearByTarget.isNearEdge) return false;
    if (creep.pos.x <= 1 || creep.pos.x >= 48) {
        let value = Math.abs(creep.pos.y - nearByTarget.pos.y);
        if (value < 3) {
            return true;
        }
    }
    if (creep.pos.y <= 1 || creep.pos.y >= 48) {
        let value = Math.abs(creep.pos.x - nearByTarget.pos.x);
        if (value < 3) return true;
    }
    return false;
}


function checkPos(target) {
    var samePos = false;
    if (target.pos) {
        if (tempTarget && tempTarget.x === target.pos.x && tempTarget.y === target.pos.y) {
            samePos = true;
        }

        tempTarget = {
            x: target.pos.x,
            y: target.pos.y,
        };
    } else {
        if (tempTarget && tempTarget.x === target.x && tempTarget.y === target.y) {
            samePos = true;
        }
        tempTarget = {
            x: target.x,
            y: target.y,
        };
    }
    return samePos;
}
/*
function resetSpot(xx, yy, roomName) {
    const terrain = new Room.Terrain(roomName);
    var scan = [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
    ];
    var highTerrain = 0;
    for (let i in scan) {
        if (scan[i]) {
            let tile = terrain.get(xx + scan[i].x, yy + scan[i].y);
            if (tile === TERRAIN_MASK_WALL) {
                return 255;
            } else if (tile === TERRAIN_MASK_SWAMP) {
                if (highTerrain < 5)
                    highTerrain = 5;
            }
        }
    }
    return highTerrain;
}*/

function squadToMatrix(squad) {
    var squadFlag = squad[0].partyFlag;
    if (!squadFlag || !squadFlag.memory.groupPoint) {
        return;
    }
    let matrix = createBaseRoomMatrix(squadFlag.pos.roomName); // Careful this is changing the base.
    if (clearedMemoryMatrix === undefined) {
        clearedMemoryMatrix = {};
    }
    if (clearedMemoryMatrix[squadFlag.pos.roomName] === undefined) {
        clearedMemoryMatrix[squadFlag.pos.roomName] = {};
    }

    clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name] = {};

    for (let x = -1; x < 2; x++) {
        if (clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x] === undefined) {
            clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x] = {};
        }
        for (let y = -1; y < 2; y++) {
            let value = matrix.get(squadFlag.memory.groupPoint.x + x, squadFlag.memory.groupPoint.y + y);
            if (value === 254) {
                let otherInfo = getOtherSquadInfo(squadFlag.memory.groupPoint.x + x, squadFlag.memory.groupPoint.y + y, squadFlag);
                clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x][squadFlag.memory.groupPoint.y + y] = otherInfo;
            } else {
                clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x][squadFlag.memory.groupPoint.y + y] = value;
                matrix.set(squadFlag.memory.groupPoint.x + x, squadFlag.memory.groupPoint.y + y, 254);
            }
        }
    }
}

function getOtherSquadInfo(x, y, flag) {
    let roomName = flag.pos.roomName;
    let flagName = flag.name;
    if (!clearedMemoryMatrix[roomName]) return undefined;
    for (let squadName in clearedMemoryMatrix[roomName]) {
        if (flagName !== squadName) {
            if (clearedMemoryMatrix[roomName][squadName][x]) {
                if (clearedMemoryMatrix[roomName][squadName][x][y] !== undefined) {
                    return clearedMemoryMatrix[roomName][squadName][x][y];
                }
            }
        }
    }
    return undefined;
}


var clearedMemoryMatrix;

function squadToMatrixClear(squadFlag) {
    if (!squadFlag || !squadFlag.memory.groupPoint) {
        return;
    }
    let room = squadFlag.room;
    let matrix = createBaseRoomMatrix(squadFlag.pos.roomName); // Careful this is changing the base.

    /*    if (clearedMemoryMatrix && clearedMemoryMatrix[squadFlag.pos.roomName]) {
            for (let i in clearedMemoryMatrix[squadFlag.pos.roomName]) {
                console.log('looking at cached saved matrixes', i, clearedMemoryMatrix[squadFlag.pos.roomName][i]);
                for (let x in clearedMemoryMatrix[squadFlag.pos.roomName][i]) {
                    let msg = "";
                    for (let y in clearedMemoryMatrix[squadFlag.pos.roomName][i][x]) {
                        msg += x + "," + y + ": " + clearedMemoryMatrix[squadFlag.pos.roomName][i][x][y] + " | ";
                    }
                    console.log(msg);
                }
            }
        }*/


    for (let x = -1; x < 2; x++) {
        for (let y = -1; y < 2; y++) {
            if (clearedMemoryMatrix && clearedMemoryMatrix[squadFlag.pos.roomName] && clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name] && clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x] && clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x][squadFlag.memory.groupPoint.y + y] !== undefined) {
                let value = clearedMemoryMatrix[squadFlag.pos.roomName][squadFlag.name][squadFlag.memory.groupPoint.x + x][squadFlag.memory.groupPoint.y + y];
                let otherInfo = getOtherSquadInfo(squadFlag.memory.groupPoint.x + x, squadFlag.memory.groupPoint.y + y, squadFlag);
                if (otherInfo === undefined) {
                    matrix.set(squadFlag.memory.groupPoint.x + x, squadFlag.memory.groupPoint.y + y, value);
                } else {
                    otherInfo = value;
                }

            }
        }
    }

}



function getRoomMatrix4Squad(roomName, bads) { // This is all flag based, it will be stored in flag.
    let matrix = createBaseRoomMatrix(roomName);
    bads = _.filter(bads, function(o) {
        return o.structureType || o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0;
    });
    if (bads) {
        if (matrix) {
            matrix = matrix.clone();
        }
        badsToMatrix(matrix, bads);
    }
    if (_squadFlag && _squadFlag.memory.aiSettings && _squadFlag.memory.aiSettings.visual) {
        const visual = new RoomVisual(roomName);
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                visual.text(matrix.get(x, y), x, y, { font: 0.5 });
            }
        }
    }

    return matrix;
}

function badsToMatrix(matrix, bads) {
    for (let i in bads) {
        let xPos = bads[i].pos.x;
        let yPos = bads[i].pos.y;
        // So bads won't always be a creep... Mmm
        if (bads[i].structureType) {
            matrix.set(xPos, yPos, 255);
        } else {
            let attack = bads[i].getActiveBodyparts(ATTACK);
            let range = bads[i].getActiveBodyparts(RANGED_ATTACK);
            matrix.set(xPos, yPos, 255);
            var radius = 3;
            if (attack > 0) { // Attack is a 2 range approach, because it will always move closer to you.
                if (_squadFlag && _squadFlag.memory.aiSettings && _squadFlag.memory.aiSettings.meleeRadius > 0) {
                    radius = _squadFlag.memory.aiSettings.meleeRadius;
                }
                let realWeight = attack * 3; // *3 multipler due to it being *3 more than ranged attack.
                let weight = attack * 3;
                if (weight > 254) weight = 254;
                for (let x = (radius) * -1; x < radius + 1; x++) {
                    for (let y = (radius) * -1; y < radius + 1; y++) {
                        checkAndSetMatrix(matrix, xPos + x, yPos + y, weight);
                    }
                }
            }
            if (range > 0) {
                if (_squadFlag && _squadFlag.memory.aiSettings && _squadFlag.memory.aiSettings.rangeRadius > 0) {
                    radius = _squadFlag.memory.aiSettings.rangeRadius;
                }
                let weight = range;
                for (let x = radius * -1; x < radius + 1; x++) {
                    for (let y = radius * -1; y < radius + 1; y++) {
                        checkAndSetMatrix(matrix, xPos + x, yPos + y, weight);
                    }
                }
            }

        }
    }
}


function returnNearTo(creep, bads) {
    for (let i in bads) {
        if (creep.pos.isNearTo(bads[i])) {
            return bads[i];
        }
    }
}

function filterNearToBads(squad, bads) {
    let badRtn = [];
    for (let i in bads) {
        if (squadIsNearTo(squad, bads[i])) {
            badRtn.push(bads[i]);
        }
    }
    return badRtn;
}

function squadHp(squad) {
    let squadHp = {
        hits: 0,
        hitsMax: 0,
    };
    for (let i in squad) {
        squadHp.hits += squad[i].hits;
        squadHp.hitsMax += squad[i].hitsMax;
    }
    return squadHp;
}

function squadFatique(squad) {
    for (let i in squad) {
        if (squad[i].fatigue > 0) {
            return true;
        }
    }
    return false;
}

function squadIsNearTo(squad, target) {
    for (let i in squad) {
        if (squad[i].pos.isNearTo(target)) {
            return true;
        }
    }
    return false;
}

function squadDistance(squad, target) {
    var distance = 0;
    for (let i in squad) {
        let dis = squad[i].pos.getRangeTo(target);
        if (dis >= distance) {
            distance = dis;
        }
    }
    return distance;
}

function squadInRangeTo(squad, target, range) {
    for (let i in squad) {
        if (squad[i].pos.inRangeTo(target, range)) {
            return true;
        }
    }
    return false;
}

function squadIsMaxHits(squad) {
    for (let i in squad) {
        if (squad[i].hits < squad[i].hitsMax) {
            return false;
        }
    }
    return true;
}

function squadInPos(squad) {
    var topLeft = squad[0].partyFlag.memory.groupPoint;
    topLeft = checkPosRoomTransistion(topLeft);
    for (let i in squad) {
        let creep = squad[i];
        let targetPos;
        var tempPos;
        if (creep.isAtEdge) continue;
        switch (creep.memory.posistion) {
            case 1:
                tempPos = checkPosRoomTransistion({ x: topLeft.x, y: topLeft.y, roomName: topLeft.roomName });
                targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {

                    return false;
                }
                break;
            case 2:
                tempPos = checkPosRoomTransistion({ x: topLeft.x + 1, y: topLeft.y, roomName: topLeft.roomName });
                targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
            case 3:
                tempPos = checkPosRoomTransistion({ x: topLeft.x + 1, y: topLeft.y + 1, roomName: topLeft.roomName });
                targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
            case 4:
                tempPos = checkPosRoomTransistion({ x: topLeft.x, y: topLeft.y + 1, roomName: topLeft.roomName });
                targetPos = new RoomPosition(tempPos.x, tempPos.y, tempPos.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
        }
    }
    return true;
}




function checkPosRoomTransistion(pos) {
    let rtn = {
        x: pos.x,
        y: pos.y,
        roomName: pos.roomName
    };
    if (pos.x <= 0) {
        // Traveling WEst
        let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(pos.roomName);

        if (pos.x < 0) {
            rtn.x = 48;
        } else {
            rtn.x = 49;
        }
        rtn.y = pos.y;

        if (parsed[1] === 'E') {
            parsed[2]--;
            if (parsed[2] <= 0) {
                parsed[1] = 'W';
                parsed[2] = 0;
            }
        } else if (parsed[1] === 'W') {
            parsed[2]++;
            if (parsed[2] > 60) {
                parsed[2] = 60;
            }
        }

        rtn.roomName = parsed[1] + parsed[2] + parsed[3] + parsed[4];
        return rtn;
    }


    if (pos.x >= 49) { // Traveling east
        let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(pos.roomName);

        if (pos.x > 49) {
            rtn.x = 1;
        } else {
            rtn.x = 0;
        }
        rtn.y = pos.y;

        if (parsed[1] === 'E') {
            parsed[2]++;
            if (parsed[2] > 60) {
                parsed[2] = 60;
            }
        } else if (parsed[1] === 'W') {
            parsed[2]--;
            if (parsed[2] <= 0) {
                parsed[1] = 'E';
                parsed[2] = 0;
            }
        }

        rtn.roomName = parsed[1] + parsed[2] + parsed[3] + parsed[4];
        return rtn;
    }
    if (pos.y <= 0) {
        // Traveling NOrth
        let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(pos.roomName);

        if (pos.y < 0) {
            rtn.y = 48;
        } else {
            rtn.y = 49;
        }
        rtn.x = pos.x;

        if (parsed[3] === 'S') {
            parsed[4]--;
            if (parsed[4] <= 0) {
                parsed[3] = 'N';
                parsed[4] = 0;
            }
        } else if (parsed[3] === 'N') {
            parsed[4]++;
            if (parsed[4] > 60) {
                parsed[4] = 60;
            }
        }

        rtn.roomName = parsed[1] + parsed[2] + parsed[3] + parsed[4];
        return rtn;
    }

    if (pos.y >= 49) {
        // Traveling South        
        let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(pos.roomName);

        if (pos.y > 49) {
            rtn.y = 1;
        } else {
            rtn.y = 0;
        }
        rtn.x = pos.x;

        if (parsed[3] === 'S') {
            parsed[4]++;
            if (parsed[4] > 60) {
                parsed[4] = 60;
            }
        } else if (parsed[3] === 'N') {
            parsed[4]--;
            if (parsed[4] <= 0) {
                parsed[3] = 'S';
                parsed[4] = 0;
            }
        }

        rtn.roomName = parsed[1] + parsed[2] + parsed[3] + parsed[4];
        return rtn;
    }
    return rtn;

}


function checkLocationAndMove(squad) {
    let partyFlag = squad[0].partyFlag;
    let test = 0;
    while (lookAtSquadPosForNo(partyFlag)) {
        switch (test) {
            case 0:
                if (squad[0]) {
                    partyFlag.memory.groupPoint = checkPosRoomTransistion({ x: squad[0].pos.x, y: squad[0].pos.y, roomName: squad[0].pos.roomName });
                }
                test++;
                break;
            case 1:
                if (squad[1]) {
                    partyFlag.memory.groupPoint = checkPosRoomTransistion({ x: squad[1].pos.x, y: squad[1].pos.y, roomName: squad[1].pos.roomName });
                }
                test++;
                break;
            case 2:
                if (squad[2]) {
                    partyFlag.memory.groupPoint = checkPosRoomTransistion({ x: squad[2].pos.x, y: squad[2].pos.y, roomName: squad[2].pos.roomName });
                }
                test++;
                break;
            case 3:
                if (squad[3]) {
                    partyFlag.memory.groupPoint = checkPosRoomTransistion({ x: squad[3].pos.x, y: squad[3].pos.y, roomName: squad[3].pos.roomName });
                }
                test++;
                break;
            default:
                return;
        }
    }
}

function lookAtSquadPosForNo(flag) {
    let pos = flag.memory.groupPoint;
    let room = Game.rooms[pos.roomName];
    if (!room) return;
    if (!pos) return;
    let lookAt = [
        { x: pos.x, y: pos.y },
        { x: pos.x + 1, y: pos.y },
        { x: pos.x + 1, y: pos.y + 1 },
        { x: pos.x, y: pos.y + 1 },
    ];
    for (let i in lookAt) {
        let scan = room.lookAt(coronateCheck(lookAt[i].x), coronateCheck(lookAt[i].y));
        for (let e in scan) {
            if ((scan[e].structure && scan[e].structure.structureType !== STRUCTURE_ROAD) || (scan[e].terrain && scan[e].terrain === 'wall') || (scan[e].creep && scan[e].creep.memory && scan[e].creep.memory.party !== flag.name)) {
                return true;
            }
        }
    }
    return false;
}


let roomMatrix;

function addToMatrix(matrix, x, y, weight) {
    let base = matrix.get(x, y);
    base += weight;
    if (base > 255) {
        base = 255;
    }
}

function checkAndSetMatrix(matrix, x, y, weight) {
    if (matrix.get(x, y) < weight) {
        matrix.set(x, y, weight);
    }
}

function createBaseRoomMatrix(roomName) { // This is all flag based, it will be stored in flag.
    if (roomMatrix === undefined) {
        roomMatrix = {};
    }
    if (!roomMatrix[roomName] || Game.time % 200 === 0) {
        const terrain = new Room.Terrain(roomName);
        const matrix = new PathFinder.CostMatrix();

        // Fill CostMatrix with default terrain costs for future analysis:
        for (let y = 0; y < 50; y++) {
            for (let x = 0; x < 50; x++) {
                const tile = terrain.get(x, y);
                var weight = 0;
                // Lets mark the edge as no no - but we will have to figure out how to not make it bugged.
                if (x === 0 || x === 49 || y === 0 || y === 49 || x === 48 || y === 48) {
                    weight = 250;
                }
                switch (tile) {
                    case TERRAIN_MASK_WALL:
                        weight = 0xff;
                        break;
                    case TERRAIN_MASK_SWAMP:
                        weight = 5; // swamp => weight:  5
                        break;
                    default:

                        break;
                }
                matrix.set(x, y, weight);
                if (tile === TERRAIN_MASK_WALL) {
                    checkAndSetMatrix(matrix, x - 1, y, weight);
                    checkAndSetMatrix(matrix, x, y - 1, weight);
                    checkAndSetMatrix(matrix, x - 1, y - 1, weight);
                } else if (tile === TERRAIN_MASK_SWAMP) {
                    if (matrix.get(x - 1, y) < weight) {
                        matrix.set(x - 1, y, weight);
                    }
                    if (matrix.get(x, y - 1) < weight) {
                        matrix.set(x, y - 1, weight);
                    }
                    if (matrix.get(x - 1, y - 1) < weight) {
                        matrix.set(x - 1, y - 1, weight);
                    }
                }
            }
        }


        roomMatrix[roomName] = matrix;

    }
    return roomMatrix[roomName];

}


var songCache;

function groupSing(squad, song) {
    if (!song) {
        song = "Sweet dreams are made of this Who am I to disagree? I travel the world And the seven seas, Everybody's looking for something. Some of them want to use you Some of them want to get used by you Some of them want to abuse you Some of them want to be abused. Sweet dreams are made of this Who am I to disagree? I travel the world And the seven seas Everybody's looking for something Hold your head up Keep your head up, movin' on Hold your head up, movin' on Keep your head up, movin' on Hold  our head up Keep your head up, movin' on Hold your head up, movin' on Keep your head up, movin' on Some of them want to use you Some of them want to get used by you Some of them want to abuse you Some of them want to be abused. Sweet dreams are made of this Who am I to disagree? I travel the world And the seven seas Everybody's looking for something Sweet dreams are made of this Who am I to disagree? I travel the world And the seven seas Everybody's looking for something Sweet dreams  re made of this Who am I to disagree? I travel the world And the seven seas Everybody's looking for something Sweet dreams are made of this Who am I to disagree? I travel the world And the seven seas Everybody's looking for something";
    }
    if (songCache === undefined) {
        songCache = song.split(" ");
    }
    if (!_squadFlag.memory.singCounter) _squadFlag.memory.singCounter = 0;
    for (let i in squad) {
        squad[i].say(songCache[_squadFlag.memory.singCounter], true);
        _squadFlag.memory.singCounter++;
        if (_squadFlag.memory.singCounter >= songCache.length) _squadFlag.memory.singCounter = 0;
    }
}

function setTravelSquad(squad) {
    var healers = [];
    var others = [];
    var point;
    if (squad.length === 0) return;
    if (squad.length === 1) {
        squad[0].memory.point = true;
        squad[0].partyFlag.memory.pointID = squad[0].id;
        point = squad[0];
        return;
    }
    var flag = squad[0].partyFlag;
    for (let a in squad) {
        var creep = squad[a];
        creep.partyFlag.setColor(COLOR_ORANGE, COLOR_ORANGE);

        if (point === undefined) {
            if (creep.memory.role === 'fighter') {
                point = creep;
            } else
            if (creep.memory.role === 'demolisher') {
                point = creep;
            }
            /*else
                                                if (creep.memory.role === 'mage') {
                                                    point = creep;
                                                }*/
            else
            if (a === squad.length - 1) {
                point = creep;
            }
        }

        if (point === undefined || creep.id !== point.id) {
            if (creep.memory.role === 'mage' || creep.memory.role === 'healer') {
                healers.push(creep);
            } else {
                others.push(creep);
            }
        }
    }


    // Here we setup the travel caravan;
    //    console.log('SETTING CARAVAN', healers.length, others.length, point);

    var caravan = [];
    caravan.push(point);
    if (point === undefined) return;
    flag.memory.pointID = point.id;
    if (healers.length > 0) {
        caravan.push(healers.shift());
    }
    if (others.length > 0) {
        caravan.push(others.shift());
    }
    while (healers.length > 0 || others.length > 0) {
        if (others.length > 0) {
            caravan.push(others.shift());
        }
        if (healers.length > 0) {
            caravan.push(healers.shift());
        }
        if (others.length > 0) {
            caravan.push(others.shift());
        }
    }
    //    console.log('AFTERSETTING CARAVAN', caravan.length);
    flag.memory.squadID = [];
    for (let a = 0; a < caravan.length; a++) {

        var ne = 1 + a;
        var af = ne - 2;

        flag.memory.squadID.push(caravan[a].id);
        if (a === 0) {
            caravan[a].memory.directingID = caravan[ne].id;
            caravan[a].memory.point = true;
        } else if (a === caravan.length - 1) {
            caravan[a].memory.followingID = caravan[af].id;
            caravan[a].memory.point = false;
        } else {
            caravan[a].memory.directingID = caravan[ne].id;
            caravan[a].memory.followingID = caravan[af].id;
            caravan[a].memory.point = false;
        }
    }
}
class commandsToSquad {

    static cleanUpSquadStuff(flag) {
        squadToMatrixClear(flag);
    }

    static runSquad(squad) {
        if (squad.length === 0) return;
        if (squad[0].partyFlag === undefined) return;
        _squadFlag = squad[0].partyFlag;
        runMovement = undefined;
        doRotation = undefined;
        // First we determine if this is a two man squad or more.
        if (reformSquad) {
            setTravelSquad(squad);
            reformSquad = undefined;
        }
        if (_squadFlag.memory.switchModeTo === undefined) {
            _squadFlag.memory.switchModeTo = null;
        }
        if (_squadFlag.memory.switchModeTo) {
            switchMode(_squadFlag, squad, _squadFlag.memory.switchModeTo);
            _squadFlag.memory.switchModeTo = null;
        }
        if (_squadFlag.memory.travelTargetID) {

            let moveTarget = Game.getObjectById(_squadFlag.memory.travelTargetID);
            if (moveTarget) {
                moveTarget.room.visual.text('X', moveTarget.pos);
                //   console.log( checkPathToTarget(squad, moveTarget) );
            }
        }
        // First is updateMemory
        let bads;
        let analysis = {};
        if (_squadFlag.name === 'dangerRoom') {
            bads = _.filter(squad[0].room.find(FIND_HOSTILE_CREEPS), function(o) {
                return _.contains(['admon', 'Geir1983'], o.owner.username); //
            });
        } else {
            /*bads = _.filter(squad[0].room.find(FIND_HOSTILE_CREEPS), function(o) {
                return _.contains(['admon'], o.owner.username); //
            });*/
            bads = squad[0].pos.findInRange(FIND_HOSTILE_CREEPS, 10);
            /*= _.filter(squad[0].room.find(FIND_HOSTILE_CREEPS), function(o) {
                if (o.pos.inRangeTo( squad[0], 4)) {
                    analysis[o.id] = analyzeCreep(o);
                }
            });*/
        }
        squadMoveDir = undefined;
        if (_squadFlag.memory.homeDefense && _squadFlag.memory.squadMode !== 'paired') {
            switchMode(_squadFlag, squad, 'paired');
        }
        if (_squadFlag.memory.squadMode === 'battle') {
            squadToMatrixClear(_squadFlag);
        }

        if (_squadFlag.memory.death) {
            squadToMatrixClear(_squadFlag);
            switchMode(_squadFlag, squad, 'travel');
        }

        squadMemory(squad, bads, analysis);
        squadAction(squad, bads);
        switch (_squadFlag.memory.squadMode) {
            case 'battle':
            case 'paired':
                if (doRotation) { // I have it after action to determine who should move or not move. 
                    var wantRotation = [];
                    for (let i in squad) {

                        if ((!squad[i].memory.meleeRange || squad[i].hits < squad[i].hitsMax - 1000) || Game.time % 10 === 0) {
                            wantRotation.push(squad[i]);
                        }
                        squad[i].memory.meleeRange = undefined;
                    }
                    battleRotate(wantRotation, Math.ceil(Math.random() * 5));
                }

                break;
        }
        squadMovement(squad, bads);
        if (squadInPos(squad)) squadToMatrix(squad);
        // groupSing(squad);

    }
}

module.exports = commandsToSquad;