class templeTribute {
    static run(creep) {
        let sacSpot = new RoomPosition(32,9,'E14S38');
        if(creep.pos.isEqualTo(sacSpot)){
            creep.room.alphaSpawn.recycleCreep(creep);
        }else {
            creep.moveMe(sacSpot,{reusePath:50});
        }
    }
}

module.exports = templeTribute;