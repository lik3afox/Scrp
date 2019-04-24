function analyzeBody(body) {
    var level = 0;
    var att = 0;
    var rng = 0;
    var heal = 0;
    var work = 0;
    var tgh = 0;
    var boosted = false;
    var strngth = 1;
    for (var e in body) {

        if (body[e].boost === undefined) {
            level++;
            strngth = 1;
        } else {
            if (body[e].boost.length === 2) {
                level += 2;
                strngth = 2;
                boosted = true;
            } else if (body[e].boost.length === 4) {
                level += 3;
                strngth = 3;
                boosted = true;
            } else if (body[e].boost.length === 5) {
                level += 4;
                strngth = 4;
                boosted = true;
            }
        }

        switch (body[e].type) {
            case TOUGH:
                tgh += strngth;
            break;
            case ATTACK:
                att += strngth;
                break;
            case RANGED_ATTACK:
                rng += strngth;
                break;
            case HEAL:
                heal += strngth;
                break;
            case WORK:
                work += strngth;
                break;

        }

    }

    //    return Math.ceil(str);

    return {
        strength: level,
        attack: att,
        tough: tgh,
        range: rng,
        heal: heal,
        work: work,
        boost: boosted,
    };
}

function determineType(creep, strength) {
    // this function is designed to determine what type of attacker we have.
    if (strength <= 50 && creep.owner.username !== 'Invader') return 'weak'; // Means non-boosted type no big deal;
    // Types will be : fighter,healer,ranger,mage,demolisher,other.

    let attack = creep.getActiveBodyparts(ATTACK);
    let rattack = creep.getActiveBodyparts(RANGED_ATTACK);
    let work = creep.getActiveBodyparts(WORK);
    let heal = creep.getActiveBodyparts(HEAL);
    let tough = creep.getActiveBodyparts(TOUGH);
    //    let move = creep.getActiveBodyparts(MOVE);
    let numberOfParts = creep.body.length;
    let type = 'other';
if(creep.owner.username === 'Invader'){
    if (attack >= 3 && tough >= 2) type = 'fighter';
    if (heal >= 5 && tough === 0) type = 'healer';
    if (rattack >= 3 && tough >= 2) type = 'ranger';
    if (rattack === 1 && attack === 1&& work === 1) type = 'fighter';
} else {
    if (attack > 10 ) type = 'fighter';
    if (heal >= 10 ) type = 'healer';
    if (rattack > 10 ) type = 'ranger';
    if (work > 10 ) type = 'demolisher';
//    if (rattack > 10 ) type = 'mage';
    if (rattack > 10 && attack >= 10) type = 'mage';
}
if(type === 'other') console.log(creep.owner.username,attack,rattack,work,heal,tough,numberOfParts,roomLink(creep.room.name));

    return type;
}

function analyzeHits(creep) {
    var hits = 0;
    var body = creep.body;
    for (var e in body) {

        var multi = 100;
        if (body[e].type === 'tough' && body[e].boost !== undefined) {
            if (body[e].boost.length === 2) {
                multi = multi / 0.7;
            } else if (body[e].boost.length === 4) {
                multi = multi / 0.5;
            } else if (body[e].boost.length === 5) {
                multi = multi / 0.3;
            }
        }
        hits += multi;
    }
    return Math.ceil(hits);
}


module.exports = function() {
    // Attack effectiveness    600 hits at range ≤5 to 150 hits at range ≥20
    // Heal effectiveness  400 hits at range ≤5 to 100 hits at range ≥20
    // Repair effectiveness    800 hits at range ≤5 to 200 hits at range ≥20
    /*
    global.addToTracking = function(creep){
        var room = Game.rooms[creep.memory.home];
        if(room === undefined) return;
        let info = room.memory.mineInfo[creep.memory.goal];
        if(info === undefined) return;
        if(creep.memory.role !== 'transport')
    };
    */
    global.objsToIds= function (array){
        let ids =[];
        for(let i in array){
            ids.push(array[i].id);
        }
        return ids;
    };
    global.idsToObjs= function (array){
        let objects = [];
        for(let i in array){
            let rtn = Game.getObjectById(array[i]);
            if(rtn){
                objects.push(rtn);
            }else {
                array[i] = undefined;
            }
        }
        return objects;
    };

    global.getIdArray= function (array){
        let ids =[];
        for(let i in array){
            ids.push(array[i].id);
        }
        return ids;
    };
    global.getObjArray= function (array){
        let objects = [];
        for(let i in array){
            let rtn = Game.getObjectById(array[i]);
            if(rtn){
                objects.push(rtn);
            }else {
                array[i] = undefined;
            }
        }
        return objects;
    };
    global.arrayBodyCost = function(array) {

        var total = 0;
        for (var i in array) {
            if (BODYPART_COST[array[i]]) {
                total += BODYPART_COST[array[i]];
            }
        }
        return total;
    };

    global.getBodyCost = function(body) {
        var total = 0;
        for (var i in body) {
            if (BODYPART_COST[body[i].type]) {
                total += BODYPART_COST[body[i].type];
            }
        }
        return total;
    };


    global.trackMining = function(creep) {
        if (1 === 1) return;
        var room = Game.rooms[creep.memory.home];
        if (room.memory.mineInfo === undefined) {
            room.memory.mineInfo = {};
        }

        var _sourceID = creep.memory.goal;
        if (creep.memory.goal === undefined && creep.memory.sourceID) {
            _sourceID = creep.memory.sourceID;
        }

        if (room.memory.mineInfo[_sourceID] === undefined) {
            room.memory.mineInfo[_sourceID] = {
                harvested: 0,
                spent: getBodyCost(creep.body),
                reset: Game.time + 1500,
                history: [],
                //                pos: null,
                //              level:
            };
        }

        let info = room.memory.mineInfo[_sourceID];
        if (info.pos === undefined || info.level === undefined) {
            for (var e in room.alphaSpawn.memory.roadsTo) {
                //                console.log('adding extra info', _sourceID);
                if (room.alphaSpawn.memory.roadsTo[e].source === _sourceID) {
                    console.log('has info', room.alphaSpawn.memory.roadsTo[e].sourcePos, room.alphaSpawn.memory.roadsTo[e].expLevel);
                    info.pos = room.alphaSpawn.memory.roadsTo[e].sourcePos;
                    info.level = room.alphaSpawn.memory.roadsTo[e].expLevel;
                    if (room.alphaSpawn.memory.roadsTo[e].controller) {
                        info.reserver = true;
                    } else {
                        info.reserver = false;
                    }
                    break;
                }
            }
        }
        //if (info.counter === undefined) {
        //      if (creep.room.memory.mineInfo && creep.room.memory.mineInfo[creep.memory.goal]) {
        //                console.log('wants to add:', creep.room.memory.mineInfo[creep.memory.goal], creep.memory.goal);
        //              info.counter = creep.room.memory.mineInfo[creep.memory.goal];
        //        }
        //}


        if (info.history === undefined) info.history = [];
        if (info.isSkSource === undefined) {
            let source = Game.getObjectById(_sourceID);
            if (source && source.energyCapacity === 3000) {
                info.isSkSource = false;
                info.roomRemoteCount = creep.room.find(FIND_SOURCES).length;
            } else {
                info.isSkSource = true;
                info.roomRemoteCount = 3;
            }
        }




        if (info.reset <= Game.time) {
            info.reset = Game.time + 1500;

            let totalSpent = 0;
            let partyCreeps;

            if (info.level) {

                switch (info.level) {
                    case 1:
                        totalSpent = 1700;
                        break;
                    case 2:
                        totalSpent = 2300;
                        break;
                    case 3:
                        totalSpent = 3000;
                        break;
                    case 4:
                        totalSpent = 3250;
                        break;
                    case 5:
                        totalSpent = 4150;
                        break;
                    case 6:
                        totalSpent = 5050;
                        break;
                    case 7:
                        totalSpent = 5550;
                        break;
                    case 8:
                        totalSpent = 6750;
                        break;
                    case 9:
                        totalSpent = 7550;
                        break;
                    default:
                        totalSpent = getBodyCost(creep.body);
                        break;
                }
                //                console.log('getting reset info, totalSpent', info.level, totalSpent);
            } else {
                totalSpent = getBodyCost(creep.body);

            }
            /* Taxes
                SK rooms: area all divided by 3.
                    ztransports - 2500 per 1500 
                    Guard - 4310 per 1500
                Remote Rooms: // need to figure out if 1 or 2 source room.  info.roomRemoteCount
                    Claim - 1950 per 1500
                Invader Response: // divided by number of remotes. 
                    Defender - 4010

             surplus
                SK rooms: 
                    SK guards - 600~ x 4 per room per 1500

            */
            var creepTax = 0;
            var creepSurplus = 0;
            var remoteNum = Object.keys(room.memory.mineInfo).length;
            var containerTax = 750; // So For containers, Every 100 is 5000 - 50 energy =  .5 energy per tick.
            if (creep.room.name === creep.memory.home) {
                _sourceID = creep.memory.sourceID;
                containerTax = 0;
            }

            if (info.isSkSource) {
                creepTax += 833; // For ztransports - 2500/3
                creepTax += 1437; // for guard 4310/3
                creepTax += 4010 / remoteNum; // For invasion defense
                creepSurplus += 4000; // 4x600 for Tombstones Room gets 2400*5 / 3 == 4000
            } else if (creep.memory.home === creep.room.name) {
                //creepTax = 750; // per 1500 tower cost estimate.
            } else {
                creepTax += 4010 / remoteNum; // For invasion defense.
                creepTax = 1950 / info.roomRemoteCount; // For claim 1950 
            }


            info.spent = Math.ceil(totalSpent + containerTax + creepTax - creepSurplus);
            info.history.push({
                harvested: info.harvested,
                spent: info.spent,
            });

            if (info.history.length > 10) info.history.shift();


            if (info.isSkSource) {
                info.efficient = info.harvested / 24000 * 100; // 20000 - or
            } else {
                info.efficient = info.harvested / 15000 * 100;
            }

            info.mean = _.sum(info.history, function(o) { return o.harvested; });
            info.profit = info.history[0].harvested - info.spent;
            if (creepTax === null) {
                console.log('null creepTax', remoteNum, info.roomRemoteCount);
                console.log('null creepTax', remoteNum, info.roomRemoteCount);
                console.log('null creepTax', remoteNum, info.roomRemoteCount);
                console.log('null creepTax', remoteNum, info.roomRemoteCount);
                console.log('null creepTax', remoteNum, info.roomRemoteCount);
            }
            console.log(info.profit, '$$  info spent:', info.spent, "=", totalSpent, "+", containerTax, "(contax) +", creepTax, "(crpTax) -", creepSurplus, "Bonus ", roomLink(creep.room.name), info.history.length + "+1");
            info.harvested = 0;
        }

        info.harvested += creep.stats('mining');

        var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, };
        if (info.isSkSource) {
            creep.room.visual.text("**H:" + info.mean + "[" + info.harvested + "]  S:" + info.spent + " T:" + info.reset + " H:", creep.pos.x, creep.pos.y - 2, font);
        } else {
            creep.room.visual.text("H:" + info.mean + "[" + info.harvested + "]  S:" + info.spent + " T:" + info.reset + " H:", creep.pos.x, creep.pos.y - 2, font);
        }
        //   if (info.history && info.history.length > 0) {
        //         creep.room.visual.text(info.history[0].harvested + "#" + info.history.length, creep.pos.x, creep.pos.y - 4, font);
        //            if (Game.time % 100 < 10) {
        //          var sum = _.sum(info.history, function(o) {
        //                return o.harvested - o.spent;
        //              });
        //            console.log(sum,info.history.length,"=",sum/info.history.length );
        //                info.mean = sum / info.history.length;
        // info.mean = _.sum(info.history, function(o) { return o.harvested; });// / info.history.length;
        //          }
        //     }

        //      let meaner = info.mean;
        //        creep.room.visual.text("Profit:" + meaner, creep.pos.x, creep.pos.y - 3, font);

    };

    global.roomLink = function(roomname) {
        if(!roomname) return;
    //    if (!_.isString(roomname)) {
            //            console.log(roomname)            ;
            if (roomname.pos) {
                roomname = roomname.pos.roomName;
            } else if (roomname.roomName) {
                roomname = roomname.roomName;
            }
//            return;
  //      }
        return '<a href=https://screeps.com/a/#!/room/' + Game.shard.name + '/' + roomname + '  style="color:#aaaaff">' + roomname + '</a>';
    };

    global.roomHistory = function(roomname,time) {
        return '<a href=https://screeps.com/a/#!/history/' + Game.shard.name + '/' + roomname + '?t='+time+'  style="color:#aaaaff">' + roomname+"@"+time+ '</a>';
        //              https://screeps.com/a/#!/history/shard1/E37S34?t=13165000
    };


    global.analyzeCreep = function(creep) {
        // This get passed a creep, and it will show stats about it. 
        if (creep === null) return;
        if (creep === null && Game.rooms[creep.pos.roomName] === undefined) return;
        var col = 'red';
        //  level: str, - 1 per body, and 1 per tier. Max of 4 per Part. 
        //    attack: att, Number of attack body parts - max of 4 per part
        //      ranged: rng, Number of Attack Range Parts - max of 4 per part 
        //        heal: heal, Number of Heal parts - max of 4 per part
        //        work: work, Number of Work parts - max of 4 per part

        var _body = analyzeBody(creep.body);
        var _hits = analyzeHits(creep);
/*        Game.rooms[creep.pos.roomName].visual.text('s:' + _body.level, creep.pos.x, creep.pos.y, {
            stroke: col,
            font: 0.25,
        });

        Game.rooms[creep.pos.roomName].visual.text('' + _hits, creep.pos.x, creep.pos.y + 0.30, {
            stroke: col,
            font: 0.25,
        });*/
        var _type = determineType(creep, _body.strength);
        return { strength: _body.strength, hits: _hits, type: _type, body:_body, level:_body.strength };
    };

    global.marketRecordDeal = function(id, amount, roomTarget) {

        let result = Game.market.deal(id, amount, roomTarget);
        if (!Game.rooms[roomTarget] || Game.rooms[roomTarget].memory.terminalText === undefined) {
            return result;
        }
        let cost;
        let order = Game.market.getOrderById(id);
        cost = Game.market.calcTransactionCost(amount, order.roomName, roomTarget);
        if (result === OK && Game.rooms[roomTarget]) {
//            Game.rooms[roomTarget].memory.terminalText.deal = "deal:" + order.resourceType + " #" + amount + " to:" + roomTarget + " @" + Game.time + "$:" + cost;
        }
        return result;
    };

    global.squadVisual = function(squad) {
        // pass squad find leader;
        // squadvisual is a box that we keep our search looking at and also how we determine the frame of influence and how we move around.
        // Because everything is done w/ a target, we should do that with this too, it should be done at the same time as a run is done.
        var partyInfo = [];
        if (squad.length === 0) return;
        var room = squad[0].room;
        var center;
        for (var e in squad) {
            if (squad[e].memory.point) {
                squad[e].room.visual.rect(squad[e].pos.x - 6.5, squad[e].pos.y - 6.5,
                    13, 13, { fill: 'transparent', stroke: '#f00' });
                console.log(squad[e].pos.x, squad[e].pos.y, squad[e].pos.roomName);
                center = new RoomPosition(squad[e].pos.x, squad[e].pos.y, squad[e].pos.roomName);
            }
            let analyze = analyzeCreep(squad[e]);
            let stats = squad[e].memory.role + ":" + squad[e].hits + "/" + squad[e].hitsMax + "(" + analyzeHits(squad[e]) + ")" + squad[e].fatigue;
            partyInfo.push(stats);
        }
        if (center === undefined) return;
        var font = { color: '#F000FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT };
        if (squad[0].owner.username == 'likeafox') {
            center.x -= 12;
        } else {
            center.x += 12;
        }
        for (e in partyInfo) {
            room.visual.text(partyInfo[e], center.x, center.y, font);
            center.y++;
        }

    };

    global.roleCircle = function(pos, role) {
        if (pos === undefined) return false;
        if (Game.rooms[pos.roomName] === undefined) return false;
        var col;

        switch (role) {
            case 'point':
                col = 'red';
                role = 'po';
                break;
            case 'healer':
                col = 'green';
                role = 'he';
                break;
            case 'melee':
                col = 'blue';
                role = 'me';
                break;
            case 'any':
                col = 'white';
                break;
            default:
                col = 'green';
                break;
        }


        Game.rooms[pos.roomName].visual.circle(pos.x, pos.y, {
            radius: 0.5,
            stroke: col,
            fill: 'transparent'
        });


        Game.rooms[pos.roomName].visual.text(role, pos.x, pos.y + 0.25, {
            stroke: col
        });


    };

    global.profitReport = function(roomName, saleType, result, id, mineralAmount, mineralType, mineralCost, targetRoom) {
        let trans = 0;
        if (targetRoom) {
            trans = Game.market.calcTransactionCost(mineralAmount, roomName, targetRoom);
        }
        let cost;
        if (!Memory.mineralAverage || !Memory.mineralAverage.energy || !Memory.mineralAverage.energy.buy) {
            cost = 0.011;
        } else {
            cost = Memory.mineralAverage.energy.buy;
        }
        let eCost = Math.round(trans * cost);
        console.log(Game.time,roomLink(roomName), "Type:", saleType, result, "Profit:", Math.round(mineralAmount * mineralCost), "-", eCost, "=", Math.round((mineralAmount * mineralCost) - eCost), "  Mineral:", mineralType,"@",mineralCost, "  Amount:", mineralAmount, "  TC:", trans, "/", eCost, "  Target Room:", roomLink(targetRoom),Game.cpu.bucket);
    };
    //        console.log(roomLink(terminal.room.name), "Max Energy Trade", whatHappened, 'profit:', target.price * trans, '@', (target.price + target.cost) * trans, "/", trans, '(' + target.price + "/" + target.price / (1 + target.cost) + ')', 'EnergyCost', (target.price + target.cost));
    //                 console.log(roomCreate, ez, 'FulFill buy order on ', Game.shard.name, 'min:', current.mineralType, '#:', amoutn, "/", current.mineralAmount, 'from room', roomCreate,"ID:", order.id,"Order Amnt:", order.amount,"Send Amnt:", amoutn, "terminal amnt:",Game.rooms[roomCreate].terminal.store[current.mineralType]);
    global.coronateCheck = function(number) {
        if (number > 49) return 49;
        if (number < 0) return 0;
        return number;
    };
    /*
    const minMinerals = 173000; //33*5000
    const minMineralsTier3 = 350000;
    */
    Object.defineProperty(global, 'maxMinAmount', {
        get: function() {
            return 173000;
        },
        configurable: true
    });
    Object.defineProperty(global, 'maxT3MinAmount', {
        get: function() {
            return 350000;
        },
        configurable: true
    });


    Object.defineProperty(global, '_terminal', {
        get: function() {
            return require('build.terminal');
        },
        configurable: true
    });


    Object.defineProperty(global, 'storageEnergyLimit', {
        get: function() {
            return 500000;
        },
        configurable: true
    });
    Object.defineProperty(global, 'terminalEnergyLimit', {
        get: function() {
            return 75000;
        },
        configurable: true
    });


    global._terminal_ = function() {
        return require('build.terminal');
    };
    global.roomRequestMineral = function(targetRoom, mineral, amount) {
        return require('build.terminal').requestMineral(targetRoom, mineral, amount);
    };
    /*
        global.standardizeRoomName = function(roomName) {
            if (roomName.length === 6) return roomName;
            let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
            var threeBad;
            var oneBad;
            if (match[2].length === 1) {
                match[2] = _.padLeft(match[2], 2, "0");
            }
            if (match[4].length === 1) {
                match[4] = _.padLeft(match[4], 2, "0");
            }

            var newString = "";
            newString += match[1];
            newString += match[2];
            newString += match[3];
            newString += match[4];

            console.log('none standarize RoomName changing', newString);
            return newString;
        };*/

    global.stringToRoomPos = function(string) {
        //input XXYYE12S23
        //input 0123456789
        //        00 23 E23S42 0023E23S
        let match = /^([0-9][0-9])([0-9][0-9])(([WE])([0-9]+)([NS])([0-9]+))$/.exec(string);
        if (match !== null) {
//            return new RoomPosition(match[1], match[2], match[3]);
            return new RoomPosition(parseInt(match[1]), parseInt(match[2]), match[3]);
        } else {
            //            console.log(string, 'doing stringotRoomPos');
            //          console.log(match);
        }
        if (string.length !== 10) return;
        var goalRoom = string[4] + string[5] + string[6] + string[7] + string[8] + string[9];
        return new RoomPosition(parseInt(string[0] + string[1]), parseInt(string[2] + string[3]), goalRoom);
    };
    /*
    global.roomPosToString = function(roomPos) {
        if (roomPos.x === undefined) return false;
        var xx = roomPos.x;
        if (xx.length === 1) {
            xx = 0 + xx;
        }
        var yy = roomPos.y;
        if (yy.length === 1) {
            yy = 0 + yy;
        }
        var ret = xx + yy + roomPos.roomName;
        if (ret.length > 10) {
            return;
        }
        return ret;
    }; */


    global.getFormationPos = function(target, formationPos) {
        // So first we get the target.
        if (target === undefined || formationPos === undefined) {
            return;
        }

        if (!_.isNumber(formationPos)) {
            formationPos = parseInt(formationPos);
        }
        let dif = { x: 0, y: 0 };
        switch (formationPos) {
            case 1:
                dif.y = -1;
                break;
            case 2:
                dif.x = 1;
                dif.y = -1;
                break;
            case 3:
                dif.x = 1;
                break;
            case 4:
                dif.x = 1;
                dif.y = 1;
                break;
            case 5:
                dif.y = 1;
                break;
            case 6:
                dif.x = -1;
                dif.y = 1;
                break;
            case 7:
                dif.x = -1;
                break;
            case 8:
                dif.x = -1;
                dif.y = -1;
                break;
            case 11:
                dif.y = -2;
                break;
            case 12:
            case 21:
                dif.x = 1;
                dif.y = -2;
                break;
            case 22:
                dif.x = +2;
                dif.y = -2;
                break;
            case 23:
            case 32:
                dif.x = 2;
                dif.y = -1;
                break;
            case 33:
                dif.x = 2;
                break;
            case 34:
            case 43:
                dif.x = 2;
                dif.y = 1;
                break;
            case 44:
                dif.x = 2;
                dif.y = 2;
                break;
            case 45:
            case 54:
                dif.x = 1;
                dif.y = 2;
                break;
            case 55:
                dif.y = 2;
                break;
            case 56:
            case 65:
                dif.x = -1;
                dif.y = 2;
                break;
            case 66:
                dif.x = -2;
                dif.y = 2;
                break;
            case 67:
            case 76:
                dif.x = -2;
                dif.y = 1;
                break;
            case 77:
                dif.x = -2;
                break;
            case 78:
            case 87:
                dif.x = -2;
                dif.y = -1;
                break;
            case 88:
                dif.x = -2;
                dif.y = -2;
                break;
            case 18:
            case 81:
                dif.x = -1;
                dif.y = -2;
                break;

        }
        let zz;
        zz = new RoomPosition(coronateCheck(dif.x + target.pos.x), coronateCheck(dif.y + target.pos.y), target.pos.roomName);
        return zz;
    };

    /*

    Issacar's code

    */

    global.getWorldMapPath = function(start_room, end_room, opts = {}) {
        _.defaults(opts, {
            avoidSK: true, //Avoid SK rooms
            avoidHostile: true, //Avoid rooms that have been blacklisted
            preferOwn: true, //Prefer to path through claimed/reserved rooms
            preferHW: true, //Prefer to path through Highways
            preferRooms: Memory.empire_rooms, //Prefer to path through a specific list of rooms
            avoidRooms: Memory.hostile_rooms, //Avoid pathing through a specific list of rooms
        });
        if (start_room === end_room) {
            return [];
        }

        let ret = Game.map.findRoute(start_room, end_room, {
            routeCallback: (roomName) => {
                if (opts.avoidRooms === undefined) opts.avoidRooms = [];
                if (opts.avoidRooms.length > 0) {
                    //NOTE: This is above opts.preferRooms --> so will overwrite any preferRooms
                    if (opts.avoidRooms.includes(roomName)) {
                        // Avoid pathing through specific rooms
                        return 16.0;
                    }
                }

                if (opts.preferRooms.length > 0) {
                    if (opts.preferRooms.includes(roomName)) {
                        // Prefer to path through specific rooms
                        return 1.0;
                    }
                }

                if (opts.avoidHostile && Memory.hostile_rooms[roomName] && roomName !== start_room && roomName !== end_room) {
                    // Avoid hostile rooms
                    return Number.POSITIVE_INFINITY;
                }

                if (opts.preferOwn && Memory.empire_rooms[roomName]) {
                    // Prefer to path through my own rooms
                    return 1.5;
                }

                let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(roomName);
                let fMod = parsed[1] % 10;
                let sMod = parsed[2] % 10;
                let isSK = !(fMod === 5 && sMod === 5) &&
                    ((fMod >= 4) && (fMod <= 6)) &&
                    ((sMod >= 4) && (sMod <= 6));
                if (opts.avoidSK && isSK) {
                    // Avoid SK rooms
                    return 8.0;
                }

                let isHW = (fMod === 0 || sMod === 0);
                if (opts.preferHW && isHW) {
                    // Prefer to path through highways
                    return 3;
                }

                // Default weight
                return 3.0;
            },
        });

        return ret;
    };

    /*

    // GEIR1983 END TEST CODE// GEIR1983 END TEST CODE// GEIR1983 END TEST CODE
    // GEIR1983 END TEST CODE
    // GEIR1983 END TEST CODE
    // GEIR1983 END TEST CODE
        RoomVisual.prototype._toJSON = RoomVisual.prototype.toJSON;
        RoomVisual.prototype.toJSON = function(arg){
            var color = '<a style="color:#0afaff">';
            if (global.reportJson) {            
                try {
                    undefined.undefind = 13;
                } catch (err){
                    console.log("calling toJSON on RoomVisual while stringify on key "+color +global.keyToCheck + " argument " + JSON.stringify(arg) + " error " +err.name + err.stack);              
                }
            }
            return this._toJSON(arg);
        };
        



        PathFinder.CostMatrix.prototype.toJSON = function(arg) {
            if (global.reportJson) {
                try {
                    undefined.undefind = 13;
                } catch (err) {
                    var errorString = "calling toJSON! on CostMatrix " + global.keyToCheck + " argument " + JSON.stringify(arg) + " error " + err.name + err.stack;
                    console.log(errorString);
                 //   Game.notify(errorString);

                }
            }
        };

        Room.prototype.toJSON = function(arg) {
            if (global.reportJson) {
                try {
                    undefined.undefind = 13;
                } catch (err) {
                    var errorString = "calling toJSON on Room! " + this.name + " while stringify on key " + global.keyToCheck + " argument " + JSON.stringify(arg) + " error " + err.name + err.stack;
                    console.log(errorString);
              //      Game.notify(errorString);
                }
            }

        };

        ConstructionSite.prototype.toJSON = function(arg) {
            if (global.reportJson) {
                try {
                    undefined.undefind = 13;
                } catch (err) {
                    var errorString = "calling toJSON! ConstructionSite " + this.structureType + this.id + " while stringify on key " + global.keyToCheck + " argument " + JSON.stringify(arg) + " error " + err.name + err.stack;
                    console.log(errorString);
           //         Game.notify(errorString);
                }
            }
        };

        OwnedStructure.prototype.toJSON = function(arg) {
            if (global.reportJson) {
                try {
                    undefined.undefind = 13;
                } catch (err) {
                    var errorString = "calling toJSON! OwnedStructure " + this.structureType + this.id + " while stringify on key " + global.keyToCheck + " argument " + JSON.stringify(arg) + " error " + err.name + err.stack;
                    console.log(errorString);
               //     Game.notify(errorString);
                }
            }
        };

        Creep.prototype.toJSON = function(arg) {
            if (global.reportJson) {
                try {
                    undefined.undefind = 13;
                } catch (err) {
                    var errorString = "calling toJSON! Creep " + this.name + " while stringify on key " + global.keyToCheck + " argument " + JSON.stringify(arg) + " error " + err.name + err.stack;
                    console.log(errorString);
               //     Game.notify(errorString);
                }
            }
        };

        RoomPosition.prototype.toJSON = function(arg) {
            if (global.reportJson) {
                try {
                    undefined.undefind = 13;
                } catch (err) {
                    var errorString = "calling toJSON! RoomPosition " + this.roomName + " " + this.x + ":" + this.y + " while stringify on key " + global.keyToCheck + " argument " + JSON.stringify(arg) + " error " + err.name + err.stack;
                    console.log(errorString);
              //      Game.notify(errorString);
                }
            }
        };


        global.diagnoseGlobal = function() {

            if (Memory.globalKeyToCheck === undefined) { Memory.globalKeyToCheck = 1; }
            var check = global;
            var currentIdx = 0;
            var checkedKeys = 0;
            var init = Game.cpu.getUsed();
            var maxKeys = Object.keys(check).length;
            if (Memory.globalKeyToCheck >= maxKeys) { Memory.globalKeyToCheck = 1; }

            var mostCpu = 0;
            var biggestKeyLength = 0;
            var mostCpuKey;
            var biggestKey;
            for (var property in check) {
                currentIdx++;
                //  if (currentIdx != Memory.globalKeyToCheck ) { continue; }
                //  Memory.globalKeyToCheck++;

                if (property === "Game") { continue; } // Here be monsters!
                if (property === "global") { continue; }
                if (property === "gc") { continue; }
                if (property === "RawMemory") { continue; }
                if (property === "PathFinder") { continue; }
                if (property === "Constants") { continue; }
                if (property === "Memory") { continue; } // save some cpu for long term

                if (property === "roomsFindCache") { continue; }
                if (property === "observe_rooms") { continue; }


                var keyUsedCpu = Game.cpu.getUsed();

                checkedKeys++;
                //  console.log("stringify on key number " + Memory.globalKeyToCheck +"/" +maxKeys + " property " +property);
                global.keyToCheck = property;
                var stringified;
                try {
                    stringified = JSON.stringify(check[property]);
                } catch (err) { console.log(Memory.globalKeyToCheck + ' Error running stringify on ' + property + " error: " + err.name + err.stack); }

                keyUsedCpu = Game.cpu.getUsed() - keyUsedCpu;
                if (keyUsedCpu > mostCpu) {
                    mostCpu = keyUsedCpu;
                    mostCpuKey = property;
                }
                var usedSize = _.size(stringified);
                if (usedSize > biggestKeyLength) {
                    biggestKeyLength = usedSize;
                    biggestKey = property;
                }

                /*
                if (!knownGlobals[property]) {          
                    console.log("unknown key " + property + " size " + usedSize)
                }*/
    //  if (used > 10) { break; }   
    /*
        }


        var used = Game.cpu.getUsed() - init;
        var keySizeKb = biggestKeyLength / 1024;
        console.log("diagnoseGlobal checked " + checkedKeys + "/" + maxKeys + ", used total cpu  " + used.toFixed(1) + " most cpu on key " + mostCpuKey + " - " + mostCpu.toFixed(1) + " biggest key " + biggestKey + " with size " + keySizeKb.toFixed(1) + " kb");
    };

*/
    // GEIR1983 END TEST CODE
    // GEIR1983 END TEST CODE
    // GEIR1983 END TEST CODE

    // Returns the Manhattan distance between two room names
    /*
    global.getManhattanRoomDistance = function(room_1,room_2) {
        if (room_1.name) {
            room_1 = room_1.name;
        }

        if (room_2.name) {
            room_2 = room_2.name;
        }

        let [x1,y1] = getRoomNameToXY(room_1);
        let [x2,y2] = getRoomNameToXY(room_2);

        let dx = Math.abs(x2 - x1);
        let dy = Math.abs(y2 - y1);

        return (dx+dy);
    };
    // Converts a room name to a 'global' x,y coordinate
    global.getRoomNameToXY = function(room_name) {
        let match = room_name.match(/^(\w)(\d+)(\w)(\d+)$/);
        if (!match) {
            return [undefined,undefined];
        }

        let h = match[1];
        let x = match[2];
        let v = match[3];
        let y = match[4];

        if (h === 'W') {
            x = -x - 1;
        } else {
            x = +x;
        }

        if (v === 'N') {
            y = -y - 1;
        } else {
            y = +y;
        }

        return [x,y];
    }; */
    // Returns the n-th step along an ulam spiral
    global.ulamSpiral = function(n) {
        // Note - The spiral paths counter-clockwise: (0,0) (0,1) (-1,1) (-1,0) ...
        let p = Math.floor(Math.sqrt(4 * n + 1));
        let q = n - Math.floor(p * p / 4);
        let sq = Math.floor((p + 2) / 4);
        let x = 0;
        let y = 0;
        if (p % 4 === 0) {
            // Bottom Segment
            x = -sq + q;
            y = -sq;
        } else if (p % 4 === 1) {
            // Right Segment
            x = sq;
            y = -sq + q;
        } else if (p % 4 === 2) {
            // Top Segment
            x = sq - q - 1;
            y = sq;
        } else if (p % 4 === 3) {
            // Left Segment
            x = -sq;
            y = sq - q;
        }

        return { x: x, y: y, sq: sq };
    };

};