// this is like roles, but to squads. Squads will be given an array of object creeps that it will then analyze.
// Taking control set a creep.memory.follower = true so it will be skipped in run.

// Basic squad Idea current is
//    WALL
//   R  ?  R
//   R  H  R
// extra healers

// So there is point posistion which is usally Fighter or a demolisher - with a little bit higher GO to handle other Fighters.
// Can also be a healer/mage.
var _partyFlag;
var movement = require('commands.toMove');

var doMovement;


function f(number) {
    if (number > 8) return number - 8;
    if (number < 1) return number + 8;
    return number;
}
var runMovement;

function squadMemory(squaded, bads, analysis) {
    let squad = [];
    for (var e in squaded) {
        squad.push(squaded[e]);
    }
    switch (squad[0].partyFlag.memory.squadMode) {
        case 'battle':
            // First thing is place where Point is - direction of the attack
            /*    TOP: 1,
                TOP_RIGHT: 2,
                RIGHT: 3,
                BOTTOM_RIGHT: 4,
                BOTTOM: 5,
                BOTTOM_LEFT: 6,
                LEFT: 7,
                TOP_LEFT: 8, */
            var point = Game.getObjectById(squad[0].partyFlag.memory.pointID);


            var attackDir;

            if (squad[0].partyFlag.memory.attackDirection === undefined) {
                squad[0].partyFlag.memory.attackDirection = false;
            }
            if (!squad[0].partyFlag.memory.attackDirection) {
                attackDir = squad[0].partyFlag.pos.getDirectionTo(point);
            } else {
                attackDir = squad[0].partyFlag.memory.attackDirection;
            }
            // Point 

            // now we push into squadSpots objec that holds formationPos, role
            var X = attackDir;
            var X10 = X * 10;
            var squadSpots = [
                { pos: X, role: 'point', },
                { pos: (X * 10) + (X), role: 'healer', },
                { pos: f(X - 1), role: 'melee', },
                { pos: f(X + 1), role: 'melee', },
                { pos: (f(X - 1) * 10) + X, role: (f(X - 1) * 10) + X, },
                { pos: (X10 + f(X + 1)), role: (X10 + (X + 1)), },

                { pos: f(X - 1) * 10 + f(X - 1), role: f(X - 1) * 10 + (X - 1), },
                { pos: f(X + 1) * 10 + f(X + 1), role: f(X + 1) * 10 + (X + 1), },
                { pos: f(X + 1) * 10 + f(X + 2), role: f(X + 1) * 10 + (X + 2), },
                { pos: f(X - 2) * 10 + f(X - 1), role: f(X - 2) * 10 + (X - 1), },

            ];

            let ae = squadSpots.length;
            while (ae--) {
                var loc = getFormationPos(squad[0].partyFlag, squadSpots[ae].pos);

                var show = true;
                let atFeet = squad[0].room.lookAt(loc);
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

            for (let z in squad) {
                if (squad[z].memory.point && squadSpots.length > 0) {

                    if (!squad[z].pos.inRangeTo(squad[z].partyFlag, 3) && runMovement === undefined) {
                        squad[z].partyFlag.memory.squadMode = 'travel';
                    }
                    squad[z].memory.formationPos = squadSpots.shift().pos;


                    squad.splice(z, 1);
                    break;
                }
            }

            for (let z in squad) {

                if ((squad[z].memory.role == 'mage' || squad[z].memory.role == 'healer') && squadSpots.length > 0 && squadSpots[0].role == 'healer') {
                    squad[z].memory.formationPos = squadSpots.shift().pos;

                    squad.splice(z, 1);
                    break;
                }
            }

            for (let z in squad) {

                if ((squad[z].memory.role == 'fighter' || squad[z].memory.role == 'demolisher') && squadSpots.length > 0 && squadSpots[0].role == 'melee') {

                    squad[z].memory.formationPos = squadSpots.shift().pos;


                    squad.splice(z, 1);

                }
            }


            for (let z in squad) {
                if (squadSpots.length > 0) {
                    squad[z].memory.formationPos = squadSpots.shift().pos;
                    
                } else {
                    squad[z].memory.formationPos = undefined;
                }
            }

            

            bads = _.filter(bads, function(o) {
                return (o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0);
            });
            if (point === null) {
                for (let z in squad) {
                    let test = Game.getObjectById(squad[z].memory.followingID);
                    if (test === null) {
                        setTravelSquad(squad);
                        break;
                    }
                }
            }
            if (point === null || point === undefined) break;
            var close = point.pos.findClosestByRange(bads);
            //            var close = Game.flags.Flag28;
            if (close !== undefined) {
                var distance = point.pos.getRangeTo(close);

                
                if (distance < 3) {
                    var dire = point.pos.getDirectionTo(close);
                    dire = dire + 4;
                    if (dire > 8)
                        dire = dire - 8;
                    runMovement = dire;
                } else if (distance === 3) {
                    runMovement = 0;
                }
            }

            break;

        case 'travel':
            doMovement = true;
            for (let a in squad) {
                let creep = squad[a];
                creep.memory.happy = false;
                let dir = Game.getObjectById(creep.memory.directingID);
                if (creep.memory.followingID === undefined && creep.memory.point) {
                    // Leader point man here
                    creep.memory.formationPos = 0;
                    //let dir = Game.getObjectById(creep.memory.directingID);
                    if (creep.pos.isNearTo(dir)) {
                        creep.say('ToFlag');
                        creep.memory.happy = true;
                    }
                    if (creep.pos.isNearTo(creep.partyFlag)) {
                        creep.say('atFLAG');
                        doMovement = false;
                        squad[0].partyFlag.memory.squadMode = 'battle';
                    }


                } else if (creep.memory.directingID === undefined) {
                    // Last person
                    let fol = Game.getObjectById(creep.memory.followingID);
                    if (creep.pos.isNearTo(fol)) {
                        creep.memory.happy = true;
                    }
                    creep.say('kab');
                } else {
                    // everyone else;
                    let fol = Game.getObjectById(creep.memory.followingID);
                    // dir = Game.getObjectById(creep.memory.directingID);
                    if (creep.pos.isNearTo(dir) && creep.pos.isNearTo(fol)) {
                        creep.memory.happy = true;
                    }
                }
                if (!creep.memory.happy) {
                    doMovement = false;
                }
                if (creep.fatigue !== 0) {
                    doMovement = false;
                }
                if (creep.isAtEdge) {
                    doMovement = true;
    //                if (creep.memory.point && !creep.pos.isNearTo(dir)) {
  //                      doMovement = false;
//                    }

                }

            }

            break;
    }
}

function squadMovement(creep) {
    switch (creep.partyFlag.memory.squadMode) {
        case 'battle':
                if (runMovement !== undefined) {
                    if (runMovement === 0) {
//                        console.log('creep doing run movement', runMovement);
                    } else {
                        creep.move(runMovement);
                    }
                    creep.say('r');
                } else {
                    movement.flagMovement(creep); // This is imperfect, but it's a start.
                }
//                    creep.say(creep.memory.formationPos);
            break;
        case 'travel':
            if (creep.memory.followingID === undefined) {
                // Leader point man here
                let dir = Game.getObjectById(creep.memory.directingID);
                if (doMovement && !creep.pos.isNearTo(creep.partyFlag)) {
                    movement.flagMovement(creep);
                    creep.say('🚆' + doMovement);
                }
            } else if (creep.memory.directingID === undefined) {
                // Last person
                let fol = Game.getObjectById(creep.memory.followingID);
                if(fol !== null){
                if (doMovement) {
                    creep.move(creep.pos.getDirectionTo(fol));
                    creep.say('🚆');
                } else if (!creep.memory.happy) {
                    creep.moveTo(fol);
                    creep.say(':(');
                }
            }
            } else {
                // everyone else;
                let fol = Game.getObjectById(creep.memory.followingID);
                if(fol !== null){
                if (doMovement) {
                    creep.move(creep.pos.getDirectionTo(fol));
                    creep.say('🚆');
                } else if (!creep.memory.happy) {
                    creep.moveTo(fol);
                    creep.say(':(');
                }
                }
            }
            break;
    }
}

function squadAction(creep) {
var doHeal = true;
    if (creep.stats('rangedAttack') === 10) {
        creep.rangedMassAttack();
    } else if (creep.stats('rangedAttack') > 0) {
        if( creep.smartRangedAttack() ){
        	creep.smartCloseHeal();
        }
        doHeal = false;
    }

    if (doHeal && creep.stats('heal') > 0 && creep.memory.role !== 'fighter') {
        creep.smartHeal();
    } else if (creep.stats('attack') > 0) {
        creep.smartAttack();
    }
    if (creep.stats('dismantle') > 0) {
        creep.smartDismantle();
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
var fox = require('foxGlobals');
class commandsToSquad {

    static setTravelSquad(squad) {
        var healers = [];
        var others = [];
        var point;
        if (squad.length === 0) return;
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
//        console.log('SETTING CARAVAN', healers.length, others.length, point);

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
//        console.log('AFTERSETTING CARAVAN', caravan.length);
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

    static runSquad(squad) {
        _partyFlag = squad[0].partyFlag;
        if (squad.length === 0) return;
        if (squad[0].partyFlag === undefined) return;
        runMovement = undefined;
        // First we determine if this is a two man squad or more.

        // First is updateMemory
        let bads = squad[0].room.find(FIND_HOSTILE_CREEPS);
        let analysis = {};
        bads = _.filter(bads, function(o) {
            if (o.pos.inRangeTo(_partyFlag, 6)) {
                analysis[o.id] = analyzeCreep(o);
            }
            return !_.contains(fox.friends, o.owner.username);
        });
        squadMemory(squad, bads, analysis);
        squadVisual(squad);

        _.forEach(squad, function(creep) {
            // Movement. 
            squadMovement(creep);
            // Actions
            squadAction(creep, bads);
        });
    }



}

module.exports = commandsToSquad;