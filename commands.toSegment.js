// decay 25

var roomSegment = {
    // Shard0 
    E38S72: 10,
    E38S81: 11,
    E23S45: 12,

    // Shard1
    E23S38: 10,
    E25S37: 11,
    E24S33: 12,
    E27S34: 13,
    E18S32: 13,
    E28S37: 14,
    E25S27: 15,
    E14S43: 24,
    E18S36: 16,
    E33S54: 16,

    E17S45: 17,
//    E2S24: 30,

    E14S47: 18,
    E23S42: 19,
    E14S37: 19,
    E28S42: 20,
    E29S48: 20,
    E25S43: 21,
    E25S47: 28,
    E17S34: 23,
    E13S34: 22,
    E22S48: 25,
    E27S45: 26,
    E18S46: 27,
    W53S35: 29,
    E32S34: 24,
    // Shard 2
    E19S49: 10,
    E22S49: 10,
//    E29S48: 10,
};


var segmentChange = 10;
var interShardData;

function grabInterShardData() {
    Memory.wantedMineral = [];
    if (interShardData === undefined) {
        interShardData = JSON.parse(RawMemory.interShardSegment);
        RawMemory.interShardSegment = JSON.stringify(interShardData);
    }
    return interShardData;
}

function setInterShardData() {
    Memory.setInterShardData--;
    if (Memory.setInterShardData < 0) {
        Memory.setInterShardData = 100;
        segmentChange--;
        RawMemory.interShardSegment = JSON.stringify({
            terminalRequest: {
                H: Memory.stats.totalMinerals.H < 100000 ? true : false,
                O: Memory.stats.totalMinerals.O < 100000 ? true : false,
                X: Memory.stats.totalMinerals.X < 100000 ? true : false,
                U: Memory.stats.totalMinerals.U < 100000 ? true : false,
                L: Memory.stats.totalMinerals.L < 100000 ? true : false,
                Z: Memory.stats.totalMinerals.Z < 100000 ? true : false,
                K: Memory.stats.totalMinerals.K < 100000 ? true : false,
            }
        });
    }
}


function getSerializedPath() {
    // Taking a
}

function checkSegmentClear() {
    for (var e in Memory.assignedPartySegment) {
        if (Memory.assignedPartySegment[e] === 'clean') {
            RawMemory.segments[e] = "+";
            Memory.assignedPartySegment[e] = 'none';
            if (RawMemory.segments[e] === undefined) {
                if (_.isNumber(e))
                    Memory.shardNeed.push(e);
            }
        }

    }
}


function partyNameToSegmentNumber(partyName) {
    //  console.log('partyName requested',partyName);
    // So we get a partyName
    // From segment 99 it will assign a segment to it.
    //    if (Game.shard.name !== 'shard0') return;
    if (Memory.assignedPartySegment === undefined) {
        Memory.assignedPartySegment = {
            //        99:'none',
            98: 'none',
            97: 'none',
            96: 'none',
            95: 'none',
            94: 'none',
            93: 'none',
            92: 'none',
            91: 'none',
            90: 'none',
            89: 'none',
            88: 'none',
            87: 'none',
            86: 'none',
            85: 'none',
            84: 'none',
            83: 'none',
            82: 'none',
            81: 'none',
            80: 'none',
        };
    }
    for (let i in Memory.assignedPartySegment) {

        //console.log(i, Memory.assignedPartySegment[i],'2',Game.flags[Memory.assignedPartySegment[i]]);
        if (Memory.assignedPartySegment[i] !== 'none' && Memory.assignedPartySegment[i] !== 'clean' && Game.flags[Memory.assignedPartySegment[i]] === undefined) {
            Memory.assignedPartySegment[i] = 'clean';
        }
        if (Memory.assignedPartySegment[i] === partyName) {
            //            console.log('returned Segment for :', partyName, ':', i, '@', roomLink(Game.flags[partyName].pos.roomName));
            return i;
        }
    }

    for (let i in Memory.assignedPartySegment) {
        //console.log(i, Memory.assignedPartySegment[i]);
        if (Memory.assignedPartySegment[i] === 'none' && Game.flags[partyName] !== undefined && Game.flags[partyName].color === COLOR_YELLOW) {
            Memory.assignedPartySegment[i] = partyName;
            //          console.log('Assigned');
            return i;
        }
    }
}


function makeRequestString() {
    var rtrn = {
        basicTrading: {
            room: 'E27S34',
            energy: false,
            H: false,
            O: false,
            X: false,
            U: false,
            L: false,
            Z: false,
            K: false,
        },
        advancedTrading: {
            E3N15: {
                K: 5000,
                XGHO2: 100,
            },
            E1N15: {
                L: 5000,
            },
        }
    };
    for (var e in rtrn.basicTrading) {
        if (e !== 'room' && e !== 'energy') {
            if (Memory.stats.totalMinerals[e] < 100000) {
                rtrn.basicTrading[e] = true;
            }
        }
    }

    return JSON.stringify(rtrn);
}

function setMyPublicSegment(array) {
    if (!_.isArray(array)) {
        array = [array];
    }
    RawMemory.setPublicSegments(array);
    for (var e in array) {
        if (RawMemory.segments[array[e]] === undefined) {
            // Make request for segment if it's not available now. 
            // likeafox code here.
            if (_.isNumber(array[e]))
                Memory.shardNeed.push(array[e]);
        } else {
            RawMemory.segments[array[e]] = makeRequestString();
        }
    }
}
var notSeen;

function analyzeOtherPlayerSegment() {
    if (Game.time % 10 !== 0) return;
    if (Game.shard.name !== 'shard1') return;
    // Reason this is an array instead of object, is that it's easy to use the keys in an array across multiple ticks.
    var alliedList = [
        ['Issacar', 99],
        ['Geir1983', 99],
        ['Lolzor', 99],
        ['W4rl0ck', 99],
    ];

    // Appectable array is the resources you are willing to trade out.
    var acceptable = ['X', 'O', 'H', 'L', 'U', 'K', 'Z'];
    var acceptNum = 100000; // The minimum you have of the above mineral befor eyou trade.

    if (Memory.otherPlayerSegmentCount === undefined || Memory.otherPlayerSegmentCount >= alliedList.length) {
        Memory.otherPlayerSegmentCount = 0;
    }

    // This will get the object of the player segement. 
    var obj = require('commands.toSegment').getObjectPlayerSegment(alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);

    if (obj !== undefined) {
        var basic = obj.basicTrading;
        if (basic !== undefined) {
            console.log(alliedList[Memory.otherPlayerSegmentCount][0], "@", basic.room, alliedList[Memory.otherPlayerSegmentCount][1], basic, 'Doing basicTrading:');
            for (var resource in basic) {
                if (basic[resource]) {

                    if (Memory.stats.totalMinerals[resource] > acceptNum && _.contains(acceptable, resource)) {
                        // Here we do the sending logic.
                        var amount = 101;
                        if (resource === 'X') {
                            amount = 1001;
                        }
                        let zz = _terminal.requestMineral(basic.room, resource, amount);
                        console.log('FULFILLING TERMINAL REQUEST', resource, basic[resource], '@', basic.room, '#:', 101, zz);
                    }
                }
            }
        }
        Memory.otherPlayerSegmentCount++;
        if (Memory.otherPlayerSegmentCount >= alliedList.length) {
            Memory.otherPlayerSegmentCount = 0;
        }
    } else {
        //    console.log(notSeen,'Trying to look at',alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);
        if (notSeen === undefined) notSeen = 0;
        notSeen++;
        if (notSeen > 2) {
            notSeen = 0;
            Memory.otherPlayerSegmentCount++;
            if (Memory.otherPlayerSegmentCount >= alliedList.length) {
                Memory.otherPlayerSegmentCount = 0;
            }
        }
    }
    RawMemory.setActiveForeignSegment(alliedList[Memory.otherPlayerSegmentCount][0], alliedList[Memory.otherPlayerSegmentCount][1]);
}

var setActive = {};
class segmentCommand {
    static roomToSegment(roomName) {
        return roomSegment[roomName] === undefined ? undefined : roomSegment[roomName];
    }

    static partyToSegment(partyName) {
        return partyNameToSegmentNumber(partyName);
    }

    static setSegmentData(segment, rawData) {
        //        console.log('Requesting Segment Change for segment#', segment, "Number of changes left this ticket ", segmentChange);
        if (segmentChange > 0) {
            RawMemory.segments[segment] = rawData;
            segmentChange--;
            return true;
        } else {
            return false;
        }
    }

    static requestRoomSegmentData(roomName) {
        if (roomSegment[roomName] !== undefined) {

            let zz = _.indexOf(Memory.shardNeed, roomSegment[roomName]);

            if (RawMemory.segments[roomSegment[roomName]] === undefined && zz === -1) {
                if (_.isNumber(roomSegment[roomName]))
                    Memory.shardNeed.push(roomSegment[roomName]);
                return true;
            } else {}


        }
        return;
    }

    static setRoomSegmentData(roomName, rawData) {
 let maxMemory = 100*1024;
 let mx = rawData.length;
var needed_segments = Math.ceil(mx/maxMemory);
//console.log(roomName,needed_segments,mx,"/",maxMemory);
        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined && setActive[roomSegment[roomName]] === undefined) {
                if (_.isNumber(roomSegment[roomName]))
                    Memory.shardNeed.push(roomSegment[roomName]);
                setActive[roomSegment[roomName]] = true;
                return;

            } else if (RawMemory.segments[roomSegment[roomName]] !== undefined) {
                RawMemory.segments[roomSegment[roomName]] = rawData;
            }
        } else {
            return;
        }

    }


    static requestPartySegmentData(partyName) {
        var seg = partyNameToSegmentNumber(partyName);
        //      let zz = _.indexOf(Memory.shardNeed, seg);
//        console.log('requesting segment', partyName, seg);
        /*        if (RawMemory.segments[seg] === undefined && zz === -1) {
                    if (_.isNumber(seg))
                        Memory.shardNeed.push(seg);
                    return true;
                } else if (zz !== -1) {
                    let zze = Memory.shardNeed.splice(zz, 1);
                    */
        if (_.isNumber(seg))
            Memory.shardNeed.push(seg);
        //        }
        return;
    }

    static setPartySegmentData(partyName, rawData) {

        var seg = partyNameToSegmentNumber(partyName);
//        console.log("set party segment", seg, RawMemory.segments[seg]);

        if (RawMemory.segments[seg] === undefined) {
            if (seg !== undefined)
                if (_.isNumber(seg))
                    Memory.shardNeed.push(seg);
            return;

        } else if (RawMemory.segments[seg] !== undefined) {
            RawMemory.segments[seg] = rawData;
        }
    }

    static getRawSegmentPartyData(partyName) {
        var seg = partyNameToSegmentNumber(partyName);
//        console.log(partyName, "is getting raw party segment", seg, RawMemory.segments[seg],RawMemory.segments[seg][0]);

        if (RawMemory.segments[seg] === undefined) {
            if (seg !== undefined && _.isNumber(seg)) {
                Memory.shardNeed.push(seg);
            }
        } else if (RawMemory.segments[seg] !== undefined) {
            if (RawMemory.segments[seg][0] === undefined) {
                RawMemory.segments[seg] = '+';
            }
            return RawMemory.segments[seg];
        }
        return;
    }

    static getRawSegmentRoomData(roomName) {
        if (Game.rooms[roomName] === undefined) {

            return;
        }
        if (Game.rooms[roomName].memory.segmentReset === undefined) {
            Game.rooms[roomName].memory.segmentReset = 100000 + Math.floor(Math.random() * 100000);
        }
        Game.rooms[roomName].memory.segmentReset--;


        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined && setActive[roomSegment[roomName]] === undefined) {
                if (_.isNumber(roomSegment[roomName]))
                    Memory.shardNeed.push(roomSegment[roomName]);
                setActive[roomSegment[roomName]] = true;
                return;
            } else if (RawMemory.segments[roomSegment[roomName]] !== undefined) {
                if (Game.rooms[roomName].memory.segmentReset < 0) {
                    Game.rooms[roomName].memory.segmentReset = 100000 + Math.floor(Math.random() * 100000);
                    RawMemory.segments[roomSegment[roomName]] = '+';
                }

                if (RawMemory.segments[roomSegment[roomName]][0] === undefined) {
                    RawMemory.segments[roomSegment[roomName]] = '+';
                }
                return RawMemory.segments[roomSegment[roomName]];
            }
        } else {

        }
        return;
    }

    static getRawSegmentData(segment) {
        return RawMemory.segment[segment];
    }
    static getParsedSegmentData(segment) {
        var raw = RawMemory.segment[segment];
        var processed;
        return processed;
    }

    static getShardData() {
        return grabInterShardData();
    }

    static requestPlayerSegment(playerName, seg) {
        RawMemory.setActiveForeignSegment(playerName, seg);
    }
    static getRawPlayerSegment(playerName, seg) {
        var raw = RawMemory.setActiveForeignSegment;
        if (raw === undefined) {
            RawMemory.setActiveForeignSegment(playerName, seg);
            return raw;
        }
        if (raw.username === playerName) {
            return raw.data;
        }
    }
    static getObjectPlayerSegment(playerName, seg) {
        var raw = RawMemory.foreignSegment;
        if (raw === undefined) {
            RawMemory.setActiveForeignSegment(playerName, seg);
            return undefined;
        }
        if (raw.username === playerName) {
            if (raw.data !== undefined) {
                var rtn = JSON.parse(raw.data);
                return rtn;
            }
        }
    }


    static run() {
        segmentChange = 10; // This needs to always be set to 10 
        //      RawMemory.setDefaultPublicSegment(99);
        //        RawMemory.setPublicSegments([99]);
        // Public Shard communication.
        switch (Game.shard.name) {
            case 'shard0':
                Memory.shardNeed = _.uniq(Memory.shardNeed);
                while (Memory.shardNeed.length > 10) {
                    Memory.shardNeed.shift();
                }
                RawMemory.setActiveSegments(Memory.shardNeed);
                break;

            case 'shard1':
                //     setInterShardData();
                checkSegmentClear();

                setMyPublicSegment([99]);
                analyzeOtherPlayerSegment();


                Memory.shardNeed = _.uniq(Memory.shardNeed);
                while (Memory.shardNeed.length > 10) {
                    Memory.shardNeed.shift();
                }
                RawMemory.setActiveSegments(Memory.shardNeed);

                break;
            case 'shard2':
                checkSegmentClear();
                Memory.shardNeed = _.uniq(Memory.shardNeed);
                while (Memory.shardNeed.length > 10) {
                    Memory.shardNeed.shift();
                }
                RawMemory.setActiveSegments(Memory.shardNeed);
                break;

        }


    }
}
module.exports = segmentCommand;