// decay 25

var roomSegment = {
    // Shard0 
    E38S72: 10,
    E38S81: 11,
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
    E17S45: 17,
    E14S47: 18,
    E23S42: 19,
    E14S37: 19,
    E28S42: 20,
    E29S48: 20,
    E25S43: 21,
    E27S45: 21,
    E25S47: 21,
    E17S34: 23,
    E13S34: 22,
    E22S48: 25,
};
var segmentChange = 10;
var interShardData;

function grabInterShardData() {
    Memory.wantedMineral = [];
    if (interShardData === undefined) {
        interShardData = JSON.parse(RawMemory.interShardSegment);
        RawMemory.interShardSegment = JSON.stringify(interShardData);
    }
    //    console.log('SHARD0 getting request');
    return interShardData;
}

function setInterShardData() {
    if (Memory.setInterShardData === undefined) Memory.setInterShardData = 100;
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
        //        console.log('setting shard1 intershardData', segmentChange);
    }
}


function getSerializedPath() {
    // Taking a
}
var setActive = {};
class segmentCommand {
    static roomToSegment(roomName) {
        return roomSegment[roomName] === undefined ? false : roomSegment[roomName];
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

    static requestRoomSegmentData(roomName){
        if (roomSegment[roomName] !== undefined) {


            if (RawMemory.segments[roomSegment[roomName]] === undefined && !_.contains(Memory.shardNeed,roomSegment[roomName]) ) {
                Memory.shardNeed.push(roomSegment[roomName]);
//                console.log(roomSegment[roomName]+':requesting a segment for the future:');
                return true;
            } else {
  //              let zz = _.indexOf( Memory.shardNeed , roomSegment[roomName] );
//                console.log(roomSegment[roomName] ,"doing index"+  zz);
            }


        }
        return false;
    }

    static setRoomSegmentData(roomName, rawData) {
        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined && setActive[roomSegment[roomName]] === undefined) {
                Memory.shardNeed.push(roomSegment[roomName]);
                setActive[roomSegment[roomName]] = true;
                return false;

            } else if (RawMemory.segments[roomSegment[roomName]] !== undefined) {
                RawMemory.segments[roomSegment[roomName]] = rawData;
            }
        } else {
//            console.log('roomSegment Failure SET FAILURE', roomSegment[roomName], roomName, segmentChange);
            return;
        }

    }

    static getRawSegmentRoomData(roomName) {
        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined && setActive[roomSegment[roomName]] === undefined) {
                Memory.shardNeed.push(roomSegment[roomName]);
                setActive[roomSegment[roomName]] = true;
                return false;
            } else if (RawMemory.segments[roomSegment[roomName]] !== undefined) {

                if (RawMemory.segments[roomSegment[roomName]][0] === undefined) {
                    RawMemory.segments[roomSegment[roomName]] = '+';
                }
                return RawMemory.segments[roomSegment[roomName]];
            }
        } else {
//            console.log('roomSegment RawSegmentRoomData GET FAILURE', roomName, segmentChange);
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
    static run() {
        if (Memory.shardNeed === undefined) {
            Memory.shardNeed = [];
        }
        segmentChange = 10; // This needs to always be set to 10 
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
                setInterShardData();
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