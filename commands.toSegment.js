// decay 25

var roomSegment = {
    E23S38: 10,
};
var segmentChange = 0;
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

class segmentCommand {
    static roomToSegment(roomName) {
        return roomSegment[roomName] === undefined ? false : roomSegment[roomName];
    }

    static setSegmentData(segment, rawData) {
        console.log('Requesting Segment Change for segment#', segment, "Number of changes left this ticket ", segmentChange);
        if (segmentChange > 0) {
            RawMemory.segments[segment] = rawData;
            segmentChange--;
            return true;
        } else {
            return false;
        }
    }

    static setRoomSegmentData(roomName, rawData) {
        if (roomSegment[roomName] !== undefined && segmentChange > 0) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined) {
                RawMemory.setActiveSegments([roomSegment[roomName]]);
                segmentChange--;
            } else {
                RawMemory.segments[roomSegment[roomName]] = rawData;
            }
        } else {
            console.log('RawSegmentRoomData SET FAILURE', roomName);
            return;
        }

    }
    static getRawSegmentRoomData(roomName) {
        if (roomSegment[roomName] !== undefined) {
            if (RawMemory.segments[roomSegment[roomName]] === undefined) {
                RawMemory.setActiveSegments([roomSegment[roomName]]);
            } else {

                if (RawMemory.segments[roomSegment[roomName]][0] === undefined) {
                    RawMemory.segments[roomSegment[roomName]] = '+';
                }

                return RawMemory.segments[roomSegment[roomName]];
            }
        } else {
            console.log('RawSegmentRoomData GET FAILURE', roomName);
        }
        return false;
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
        segmentChange = 10; // This needs to always be set to 10 
        // Public Shard communication.
        switch (Game.shard.name) {
            case 'shard0':
                break;

            case 'shard1':
                setInterShardData();
                // Doing segment Tests
                // Writing Segment
                //                console.log('first Setting');
                //                RawMemory.segments[0] = '{"foo": "bar", "counter": 15}';

//                console.log(RawMemory.segments[0], Game.time);
                break;

        }
    }
}
module.exports = segmentCommand;