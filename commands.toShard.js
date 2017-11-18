// decay 25
class shardCommand {
    static run() {
    	// Public Shard communication.
        switch (Game.shard.name) {
            case 'shard0':
                var interShardData = JSON.parse(RawMemory.interShardSegment);
                console.log(interShardData.terminalRequest, 'SHARD0 getting request');
                RawMemory.interShardSegment = JSON.stringify(interShardData);
                break;
            case 'shard1':
                RawMemory.interShardSegment = JSON.stringify({
                    terminalRequest: 'L'
                });
                console.log('setting shard1');
                break;

        }
    }
}
module.exports = shardCommand;