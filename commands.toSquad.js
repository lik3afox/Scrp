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

var reformSquad;


function f(number) {
    if (number > 8) return number - 8;
    if (number < 1) return number + 8;
    return number;
}
var runMovement;
var squadMoveDir;
var healType;

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

function battleRotate(squad, type) {
    //    if(squadFatique(squad)) return;
    //console.log('battle rotate');
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




function squadMemory(squaded, bads, analysis) {
    let squad = [];
    let damaged = [];
    let healNumber = 0;
    let squadFlag = squaded[0].partyFlag;
    for (var e in squaded) {
        squad.push(squaded[e]);
        if (squaded[e].hits < squaded[e].hitsMax) {
            damaged.push(squaded[e]);
        }
        if (squaded[e].getActiveBodyparts(HEAL) > 2) {
            healNumber++;
        }
    }
    switch (squadFlag.memory.squadMode) {

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

            if (damaged.length > 0) {
                healType = 'react';
            } else {
                healType = 'prevent';
            }


            var point = Game.getObjectById(squadFlag.memory.pointID);
            if (point === null) {
                //                reformSquad = true;
            }
            var attackDir;

            if (squadFlag.memory.attackDirection === undefined) {
                squadFlag.memory.attackDirection = false;
            }
            if (!squadFlag.memory.attackDirection) {
                attackDir = squadFlag.pos.getDirectionTo(point);
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

            if (squadFlag.pos.x === 2 || squadFlag.pos.x === 47 || squadFlag.pos.y === 2 || squadFlag.pos.y === 47) {
                // This means that the flag is near the edge posistion - or an target that is near the endge. 
                squadSpots = [
                    { pos: X, role: 'point', },
                    { pos: f(X - 1), role: 'melee', }, // Left of point
                    { pos: f(X + 1), role: 'melee', }, // right of point
                    { pos: (X * 10) + (X), role: 'healer', }, // Behind point
                    { pos: (f(X - 1) * 10) + X, role: (f(X - 1) * 10) + X, },
                    { pos: (X10 + f(X + 1)), role: (X10 + (X + 1)), },

                    { pos: f(X - 1) * 10 + f(X - 1), role: f(X - 1) * 10 + (X - 1), },
                    { pos: f(X + 1) * 10 + f(X + 1), role: f(X + 1) * 10 + (X + 1), },
                    { pos: f(X + 1) * 10 + f(X + 2), role: f(X + 1) * 10 + (X + 2), },
                    { pos: f(X - 2) * 10 + f(X - 1), role: f(X - 2) * 10 + (X - 1), },
                ];
            }

            if ((squad.length === 3 || squad.length === 4) && (healNumber === 2 || healNumber === 3)) {
                squadSpots = [
                    { pos: X, role: 'point', },
                    { pos: (X * 10) + (X), }, // Behind point
                    { pos: (f(X - 1) * 10) + X, },
                    { pos: (X10 + f(X + 1)), role: (X10 + (X + 1)), },
                    { pos: f(X - 1) * 10 + f(X - 1), role: f(X - 1) * 10 + (X - 1), },
                    { pos: f(X + 1) * 10 + f(X + 1), role: f(X + 1) * 10 + (X + 1), },
                    //              { pos: f(X + 1) * 10 + f(X + 2), role: f(X + 1) * 10 + (X + 2), },
                    //                { pos: f(X - 2) * 10 + f(X - 1), role: f(X - 2) * 10 + (X - 1), },
                ];

            }

            let ae = squadSpots.length;
            while (ae--) {
                var loc = getFormationPos(squadFlag, squadSpots[ae].pos);

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
            var z;
            //            for(let z = squad.length; z--; z> 0){
            z = squad.length;
            while (z--) {

                if (squad[z].memory.point && squadSpots.length > 0) {

                    if (!squad[z].pos.inRangeTo(squad[z].partyFlag, 3) && runMovement === undefined) {
                        squad[z].partyFlag.memory.squadMode = 'travel';
                    }
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
                let towers = point.room.find(FIND_STRUCTURES);
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
                if (estDamage < 0) estDamage = 0;
                //        console.log('est Damage:', estDamage, "estimated HP:", point.hits - estDamage, "RealHp:", point.hits);
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
                let distance = point.pos.getRangeTo(close);
                if (distance < 2) {
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
            healType = 'react';
            if(bads.length){
                let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
                let target = groupPoint.findClosestByRange(bads);
               let distance = squadDistance(squaded, target);
                if(distance < 11){
                    switchMode(squadFlag, squad, 'battle');
                    return;
                }
            }
            
            for (let a in squad) {
                let creep = squad[a];
                creep.memory.happy = false;

                let dir = Game.getObjectById(creep.memory.directingID);
                if (creep.memory.followingID === undefined && creep.memory.point) {
                    // Leader point man here
                    creep.say('ldr');
                    creep.memory.formationPos = 0;
                    //let dir = Game.getObjectById(creep.memory.directingID);
                    if (dir !== null) {
                        creep.room.visual.line(creep.pos, dir.pos, { color: 'red' });
                    }
                    if (creep.pos.isNearTo(dir)) {
                        //     creep.say('ToFlag');
                        creep.memory.happy = true;
                    }
                    if (creep.pos.inRangeTo(creep.partyFlag, 5) && !creep.isNearEdge) {
                        //      creep.say('atFLAG');
                        doMovement = false;
                        if (creep.memory.party === 'dangerRoom') {
                            //                            squadFlag.memory.squadMode = 'battle';
                            switchMode(squadFlag, squad, 'battle');
                        }  else if(squadFlag.memory.powerCreepFlag) {
                            switchMode(squadFlag, squad, 'battle');
                        } else {
                            squadFlag.memory.squadMode = 'siege';
                        }
                    }


                } else if (creep.memory.directingID === undefined) {
                    // Last person
                    let fol = Game.getObjectById(creep.memory.followingID);
                    if (fol !== null) {
                        creep.room.visual.line(creep.pos, fol.pos, { color: 'green' });
                    }
                    if (creep.pos.isNearTo(fol)) {
                        creep.memory.happy = true;
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

                    if (creep.pos.isNearTo(dir) && creep.pos.isNearTo(fol)) {
                        creep.memory.happy = true;
                    }
                    creep.say('md');
                }
                if (!creep.memory.happy) {
                    doMovement = false;
                }
                if (creep.fatigue !== 0) {
                    doMovement = false;
                }
                if(creep.memory.stuckCount === 5){
                    doMovement = true;
                }
                // New added to not move while 
                if (creep.hits !== creep.hitsMax) {
                    doMovement = false;
                }
                if (creep.isAtEdge) {
                    doMovement = true;
                    //                if (creep.memory.point && !creep.pos.isNearTo(dir)) {
                    //                      doMovement = false;
                    //                    }

                }
                creep.say(creep.memory.battlePos);
            }

            break;

        case 'battle':
        case 'fight':
            // if squad doesn't have posistions yet, then lets set the posistions.

            let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
            let doMove = true;
            let distance;
            var runAway = false;
            var chase = true;
            var isSquadFatiqued = squadFatique(squad);
            if (isSquadFatiqued) {
                doMove = false;
            }
            let target;
            if (doMove && !squadInPos(squad)) {
                doMove = false;
            }
            // bads = [Game.flags.test];

            if (bads.length > 0) {

                target = groupPoint.findClosestByRange(bads);
                distance = squadDistance(squaded, target);
                let attack = target.getActiveBodyparts(ATTACK);
                let ranged = target.getActiveBodyparts(RANGED_ATTACK);

                // Distance is the distance of furthest squad so... we

                if (ranged > 0 && attack === 0) {

                } else if (distance == 4 && (attack > 0)) {
                    doMove = false;
                } else if (distance > 3) {

                } else if (distance < 4 && (ranged > 0 || attack > 0)) {
                    runAway = true;
                    doMove = true;
                } else {

                }
                if (doMove && squadFlag.memory.squadType !== 'melee' && squadIsNearTo(squaded, target)) doMove = false;


                if (doMove && squadIsNearTo(squaded, target)) { //&& ranged === 0 && attack === 0
                    doMove = false;
                }

                if (distance <= 2) {
                    let meleeRange = filterNearToBads(squaded, bads);
                    if (meleeRange.length > 0) {
                        // These are the creeps that are near by.
                        for (let i in squaded) { // First we can creeps and see if they are near any bads. meleeRange = false/true depending on this.
                            squaded[i].memory.meleeRange = false;
                            for (let e in meleeRange) {
                                if (squaded[i].pos.isNearTo(meleeRange[e])) {
                                    squaded[i].memory.meleeRange = true;
                                }
                            }
                        }

                        for (let e in squaded) { // now we go through and determine if they are meleeAttack && !meleeRange
                            if (squaded[e].memory.meleeRange) {
                                squaded[e].room.visual.text('M', squaded[e].pos);
                            } else {
                                squaded[e].room.visual.text('X', squaded[e].pos);
                            }

                            if (squaded[e].memory.meleeRange && !squaded[e].memory.meleeAttack && squaded[e].fatigue === 0) {
                                for (let ie in squaded) {
                                    if (squaded[ie].name !== squaded[e].name && !squaded[ie].memory.meleeRange && squaded[ie].memory.meleeAttack && squaded[ie].fatigue === 0) {
                                        switchPos(squaded[e], squaded[ie]);
                                        squaded[ie].memory.meleeRange = true;
                                        break;
                                    }
                                }

                            }
                        }

                    }
                }
            } else {
                if(_partyFlag.memory.powerCreepFlag){
                    //_partyFlag.memory.moveRange;
                    if(_partyFlag.memory.moveSquad){
                        target = {
                            pos: new RoomPosition(_partyFlag.memory.moveSquad.x, _partyFlag.memory.moveSquad.y, _partyFlag.memory.moveSquad.roomName),
                        };
                    } else {
                        target = _partyFlag;
                    }
                } else {
                    target = Game.flags.dangerRoom;
                }
            }

            if (Game.flags.dangerRoom.pos.roomName !== squaded[0].pos.roomName) {
                console.log('flag not in room, switching to travel mode');
                switchMode(squadFlag, squaded, 'travel');
                return;
            }
            if (_partyFlag.pos.roomName !== squaded[0].pos.roomName) {
                console.log('flag not in room, switching to travel mode');
                switchMode(squadFlag, squaded, 'travel');
                return;
            }

            if (doMove) {
                let roomName = squadFlag.pos.roomName;
                //                tempTarget = target;
                var samePos = checkPos(target);
    // moveToArray is not setup for multiple squads..             
                if (!samePos) {
                    if (!runAway) {
                        moveToArray = PathFinder.search(groupPoint, target, { roomCallback: roomName => getRoomMatrix(roomName, bads),range:_partyFlag.memory.moveRange }); //, maxOps: 100 
                    } else {
                        moveToArray = PathFinder.search(groupPoint, { pos: target.pos, range: 5 }, {
                            flee: true,
                            roomCallback: roomName => getRoomMatrix(roomName, bads)
                        });
                    }
                } else {
                    moveToArray.path.shift();
                }
                squadMoveDir = groupPoint.getDirectionTo(moveToArray.path[0]);

                console.log('Squad2Memory://move:',target, squadMoveDir, "CPU: ", moveToArray.ops, roomName, groupPoint, "D:", distance, "Flee?", runAway, "RecalPath:", !samePos);
                if (squadMoveDir === undefined) {
                    battleRotate(squad, Math.ceil(Math.random() * 5));
                }
            } else {
                squadMoveDir = undefined;

                console.log('SquadMemory://move:',target, squadMoveDir, "CPU: ", moveToArray,  groupPoint, "D:", distance, "Flee?", runAway, "RecalPath:");
            }


            break;


    }
}
var tempTarget, moveToArray;

function checkPos(target){
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

function getRoomMatrix(roomName, bads) { // This is all flag based, it will be stored in flag.
    let matrix = createBaseRoomMatrix(roomName); 
    bads = _.filter(bads, function(o) {
        return o.getActiveBodyparts(ATTACK) > 0 || o.getActiveBodyparts(RANGED_ATTACK) > 0;
    });
    if (bads) {
        matrix = matrix.clone();
        badsToMatrix(matrix,bads);
    }
//        structsToMatrix(matrix); // not created

    const visual = new RoomVisual(roomName);

    for (let y = 0; y < 50; y++) {
        for (let x = 0; x < 50; x++) {
            visual.text(matrix.get(x, y), x, y, { font: 0.5 });
        }
    }

    return matrix;
}

function badsToMatrix(matrix,bads){
    for (let i in bads) {
            let xPos = bads[i].pos.x;
            let yPos = bads[i].pos.y;
            matrix.set(xPos, yPos, 69);
            let attack = bads[i].getActiveBodyparts(RANGED_ATTACK);

            if (attack > 0) { // Attack is a 2 range approach, because it will always move closer to you.
                let weight = attack * 3; // *3 multipler due to it being *3 more than ranged attack.
                for (let x = -2; x < 3; x++) {
                    for (let y = -2; y < 3; y++) {
                        addToMatrix(matrix, xPos + x,  yPos + y, weight);
                    }
                }
            }
                let range = bads[i].getActiveBodyparts(RANGED_ATTACK);
                {
            if (range > 0) {
                let weight = range;
                for (let x = -3; x < 4; x++) {
                    for (let y = -3; y < 4; y++) {
                        addToMatrix(matrix, xPos + x,  yPos + y, weight);
                    }
                }
            }
                }


        }
    return matrix;
}

function switchMode(flag, squad, toMode) {
    switch (toMode) {

        case 'battle':
            let melee = 0;
            let range = 0;
            let siege = 0;
            for (let ie in squad) {
                squad[ie].memory.directingID = undefined;
                squad[ie].memory.followingID = undefined;

                squad[ie].memory.posistion = squad[ie].memory.battlePos;
                // Setup the groupPoint - which is the 2nd posistion on this - it allows for formation easily.
                if (squad[ie].memory.battlePos === 2) {
                    flag.memory.groupPoint = new RoomPosition(squad[ie].pos.x, squad[ie].pos.y, squad[ie].pos.roomName);
                    let matrix = getRoomMatrix(flag.pos.roomName);
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
            }

            if (melee > 0 || siege > 0) {
                flag.memory.squadType = 'melee';
            } else {
                flag.memory.squadType = 'range';
            }
            break;

        case "travel":

            let caravan = _.sortBy(squad, function(o) {
                return o.memory.battlePos;
            });

            for (let a = 0; a < caravan.length; a++) {
                caravan[a].memory.battlePos = a + 1;
                if(!flag.memory.powerCreepFlag){
                    flag.memory.squadID.push(caravan[a].id);
                }

                if (a === 0) {
                    caravan[a].memory.directingID = caravan[a + 1].id;
                    // It is directing the next one.
                } else if (a === caravan.length - 1) {
                    caravan[a].memory.followingID = caravan[a - 1].id;
                    // It is following the last one.
                } else {
                    caravan[a].memory.directingID = caravan[a + 1].id;
                    caravan[a].memory.followingID = caravan[a - 1].id;
                }
            }
            break;
    }

    flag.memory.squadMode = toMode;
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
    for (let i in squad) {
        let creep = squad[i];
        let targetPos;
        switch (creep.memory.posistion) {
            case 1:
                targetPos = new RoomPosition(topLeft.x, topLeft.y, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
            case 2:
                targetPos = new RoomPosition(topLeft.x + 1, topLeft.y, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
            case 3:
                targetPos = new RoomPosition(topLeft.x + 1, topLeft.y + 1, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
            case 4:
                targetPos = new RoomPosition(topLeft.x, topLeft.y + 1, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    return false;
                }
                break;
        }
    }
    return true;
}

function squadMovement(squad) {
    var topLeft = squad[0].partyFlag.memory.groupPoint;
    let partyFlag = squad[0].partyFlag;
    //  if (!squadIsMaxHits(squad)) {
    //        battleRotate(squad, Math.ceil(Math.random() * 5));
    //    return;
    //  }
    if (squadMoveDir) {
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

    }
    partyFlag.memory.groupPoint.y = coronateCheck(partyFlag.memory.groupPoint.y);
    partyFlag.memory.groupPoint.x = coronateCheck(partyFlag.memory.groupPoint.x);
    /*if (!squadMoveDir && Game.time % 3 === 0 && squadInPos(squad)) {
        switchPos(squad[test2],squad[test]);
    }*/
    let room = squad[0].room;
    room.visual.circle(topLeft.x, topLeft.y, { radius: 0.5, opacity: 0.15, fill: '0f000F' });
    for (let i in squad) {
        let creep = squad[i];
        let targetPos;
        switch (creep.memory.posistion) {
            case 1:
                targetPos = new RoomPosition(topLeft.x, topLeft.y, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    creep.moveMe(targetPos);
                }
                break;
            case 2:
                targetPos = new RoomPosition(topLeft.x + 1, topLeft.y, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    creep.moveMe(targetPos);
                }
                break;
            case 3:
                targetPos = new RoomPosition(topLeft.x + 1, topLeft.y + 1, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    creep.moveMe(targetPos);
                }
                break;
            case 4:
                targetPos = new RoomPosition(topLeft.x, topLeft.y + 1, topLeft.roomName);
                if (!creep.pos.isEqualTo(targetPos)) {
                    creep.moveMe(targetPos);
                }
                break;
        }
    }

}

function squadAction(squad, bads) {
    var target;
    if (bads.length > 0) {
        let squadFlag = squad[0].partyFlag;
        let groupPoint = new RoomPosition(squadFlag.memory.groupPoint.x, squadFlag.memory.groupPoint.y, squadFlag.memory.groupPoint.roomName);
        target = groupPoint.findClosestByRange(bads);
        let allHappy = squadIsNearTo(squad, target);
        let nearBy = squadIsNearTo(squad, target);


        for (let i in squad) {
            //              target = squad[i].findClosestByRange(bads);
            distance = squad[i].pos.getRangeTo(target);
            if (squad[i].stats('rangedAttack') > 0) {
                if (squad[i].memory.meleeRange) {
                    squad[i].rangedMassAttack();
                } else if (squad[i] && distance < 4) {
                    squad[i].rangedAttack(target);
                }
            }
            if (nearBy && squad[i].stats('attack') > 0) {
                //            so if a creep is an attacker/dismantler it wants a target.
                target = squad[i].pos.findClosestByRange(bads);
                distance = squad[i].pos.getRangeTo(target);
                if (squad[i].pos.isNearTo(target)) {
                    squad[i].attack(target);
                } else if (distance < 3) {
                    allHappy = false;
                    // we find a way to get closer.
                    /*  let nearSquadMem = bads.pos.findInRange(squad,1);
                      nearSquadMem = _.filter( nearSquadMem,function(f) {
                          return o.stats('attack') === 0 && o.fatigue === 0;
                          } );
                      if(nearSquadMem.length > 0){
                          let temp;// = squad[i].memory.posistion ;
                          switch(squad[i].memory.posistion){
                              case 1:
                              temp = 1;
                              break;
                              case 2:
                              temp = 2;
                              break;
                              case 3:
                              temp = 3;
                              break;
                              case 4:
                              temp = 4;
                              break;
                          }
                          squad[i].memory.posistion = nearSquadMem[0].memory.posistion;
                          nearSquadMem[0].memory.posistion = temp;
                      }*/
                }
            }
            //        if (!allHappy && nearBy && !squadFatique(squad)) {
            //                battleRotate(squad, Math.ceil(Math.random() * 5));
            //          }
            //||squad[i].stats('dismantle') > 0

        }
    } else {
    for (let i in squad) {
        if (squad[i].stats('healing') > 0) {        
            if (squad[i].hits < squad[i].hitsMax) {
                squad[i].selfHeal();
            }
        }
    }
    return;
    }
    var needHealing = [];
    // So what we want to first figure out is, does it need to heal it self. 

    for (let i in squad) {
        if (squad[i].stats('healing') > 0) {
            if (squad[i].hits < squad[i].hitsMax && squad[i].hits > squad[i].hitsMax - squad[i].stats('healing')) {
                squad[i].selfHeal();
                squad[i]._didHeal = true;
            } else if (squad[i].hits < squad[i].hitsMax) {
                needHealing.push(squad[i]);
            }
        } else if (squad[i].hits < squad[i].hitsMax) {
            needHealing.push(squad[i]);
        }
    }


    if (needHealing.length === 0) {
        for (let i in squad) {
            if (!squad[i]._didHeal) squad[i].selfHeal();
        }
    } else {
        for (let i in squad) {
            if (!squad[i]._didHeal) {
                let random = Math.floor(Math.random() * needHealing.length);
                squad[i].heal(needHealing[random]);
            }
        }
    }

}
let roomMatrix;

function addToMatrix(matrix, x, y, weight){
    let base = matrix.get(x, y);
    base += weight;
    if(base > 255){
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
    var room = Game.rooms[roomName];
    if (room) {
        if (!roomMatrix[roomName]) {
            //   if (!room.memory.creepMovementBaseMatrix) {
            // 
            const terrain = new Room.Terrain(roomName);
            const matrix = new PathFinder.CostMatrix();
            const visual = new RoomVisual(roomName);

            // Fill CostMatrix with default terrain costs for future analysis:
            for (let y = 0; y < 50; y++) {
                for (let x = 0; x < 50; x++) {
                    const tile = terrain.get(x, y);
                    var weight = 0;
                    // Lets mark the edge as no no - but we will have to figure out how to not make it bugged.
                    if (x === 0 || x === 49 || y === 0 || y === 49 || x === 48 || y === 48) {
                        weight = 255;
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

}


function creepMovement(creep) {

    var nuke = creep.room.find(FIND_NUKES);
    if (nuke.length > 0) {
        var nxtNuke = _.min(nuke, o => o.timeToLand);
        if (creep.memory.runFromNuke === undefined && nxtNuke.timeToLand < 50) {
            creep.memory.runFromNuke = 52;
        }
        console.log('Found nuke, time left:', nxtNuke.timeToLand);
    }
    if (creep.memory.runFromNuke !== undefined) {
        creep.memory.runFromNuke--;
        if (creep.memory.runFromNuke <= 0) {
            creep.memory.runFromNuke = undefined;
        }
        creep.say('evac flag');
        if (creep.room.name !== creep.partyFlag.pos.roomName) {
            if (creep.memory.point) {

                let zzz = creep.room.notAllies;
                if (zzz.length > 0) {
                    creep.moveTo(zzz[0]);
                    return;
                } else {
                    creep.evacuateRoom(creep.partyFlag.pos.roomName);
                    return;
                }
            } else {
                let zed = Game.getObjectById(creep.partyFlag.memory.pointID);
                if (zed !== null) {
                    creep.moveMe(zed);
                }
            }

        }
        creep.evacuateRoom(creep.partyFlag.pos.roomName);
        return;
    }

    if (Game.flags.evacuate !== undefined && Game.flags.evacuate.pos.roomName === creep.partyFlag.pos.roomName) {
        creep.say('evac flag');
        creep.evacuateRoom(creep.partyFlag.pos.roomName);
        return;
    }
    switch (creep.partyFlag.memory.squadMode) {


        case 'siege':
            if (runMovement !== undefined) {
                if (runMovement === 0) {
                    //                        console.log('creep doing run movement', runMovement);
                } else {
                    creep.move(runMovement);
                }
                //creep.say('r');
                let tgt = Game.getObjectById(creep.partyFlag.memory.target);
                if (creep.stats('rangedAttack') > 0) {
                    if (tgt !== null) {
                        let distance = creep.pos.getRangeTo(tgt);
                        if (distance > 3) {
                            creep.moveMe(tgt);
                        }
                    }
                }
                if (creep.stats('heal') > 0) {
                    if (tgt !== null) {
                        let distance = creep.pos.getRangeTo(tgt);
                        if (distance > 2) {
                            creep.moveMe(tgt);
                        }
                    }
                }
            } else {
                movement.flagMovement(creep); // This is imperfect, but it's a start.
                //                creep.say('fmove');
            }
            //                    creep.say(creep.memory.formationPos);
            break;
        case 'travel':
            if (creep.memory.followingID === undefined) {
                // Leader point man here
                let dir = Game.getObjectById(creep.memory.directingID);
                if (dir === null) {
                    reformSquad = true;
                }
                if (doMovement && !creep.pos.isNearTo(creep.partyFlag)) {
                    //movement.flagMovement(creep);
                  creep.tuskenTo(creep.partyFlag, creep.memory.home, { reusePath: 50 });
                      creep.say('🚆');
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
            break;
    }
}

function creepAction(creep, bads) {
    var doHeal = true;
    switch (creep.partyFlag.memory.squadMode) {
        case 'battle':
            if (bads.length > 0) {
                creep.selfHeal();
                creep.rangedMassAttack();
            }
            break;
        default:
            if (doHeal && creep.stats('heal') > 0 && creep.memory.role !== 'fighter' && creep.memory.role !== 'demolisher') {
                //        creep.say(healType);
                if (healType === 'react') {
                    if (!creep.smartHeal()) { // Does close heal
                        //                creep.rangedMassAttack();
                        creep.smartRangedAttack();
                    }
                } else {
                    //maybe heal point?
                    let pnt = Game.getObjectById(creep.partyFlag.memory.pointID);
                    if (pnt !== null) {
                        if (creep.pos.isNearTo(pnt)) {
                            creep.heal(pnt);
                            creep.rangedMassAttack();
                        } else {
                            creep.rangedHeal(pnt);
                        }
                    }
                    // Maybe Heal Random
                    // Maybe do reHealing?
                    if (creep.memory.reHealID !== undefined) {
                        let pnt = Game.getObjectById(creep.memory.reHealID);
                        if (pnt !== null) {
                            if (creep.pos.isNearTo(pnt)) {
                                creep.heal(pnt);
                                creep.rangedMassAttack();
                            } else {
                                creep.rangedHeal(pnt);
                            }
                        }
                    }

                }


                return;
            } else if (creep.stats('attack') > 0) {
                creep.smartAttack();
            }
            if (creep.stats('rangedAttack') === 10) {
                creep.rangedMassAttack();
            } else if (creep.stats('rangedAttack') > 0) {
                if (creep.smartRangedAttack()) {
                    doHeal = false;
                    creep.smartCloseHeal();
                }
            }

            if (creep.stats('dismantle') > 0) {
                creep.smartDismantle();
            }
            break;
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

    /*  static setTravelSquad(squad) {
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
                                                      }
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
      }*/

    static runSquad(squad) {
        _partyFlag = squad[0].partyFlag;
        if (squad.length === 0) return;
        if (squad[0].partyFlag === undefined) return;
        runMovement = undefined;
        // First we determine if this is a two man squad or more.
        if (reformSquad) {
            setTravelSquad(squad);
            reformSquad = undefined;
        }
        // First is updateMemory
        let bads;
        let analysis = {};
        if (_partyFlag.name === 'dangerRoom') {
            bads = _.filter(squad[0].room.find(FIND_HOSTILE_CREEPS), function(o) {
                return _.contains(['admon', 'Geir1983'], o.owner.username); //
            });
        } else {
            bads = squad[0].room.notAllies;
            bads = _.filter(bads, function(o) {
                if (o.pos.inRangeTo(_partyFlag, 3)) {
                    analysis[o.id] = analyzeCreep(o);
                }
            });
        }

        squadMemory(squad, bads, analysis);
  //      if(_partyFlag.memory.l)
  if(!_partyFlag.memory.powerCreepFlag){
        squadVisual(squad);
  }

        if (_partyFlag.memory.squadMode === 'battle') {
            squadAction(squad, bads);
            squadMovement(squad);            
        } else {
            _.forEach(squad, function(creep) {
                // Actions
                creepAction(creep, bads);
                // Movement. 

                creepMovement(creep);
            });
        }
    }



}

module.exports = commandsToSquad;