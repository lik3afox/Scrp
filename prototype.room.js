var linksCache = [];
var _powerspawn;

RoomPosition.prototype.lookForStructure = function(structureType) {
    let structures = this.lookFor(LOOK_STRUCTURES);
    return _.find(structures, { structureType: structureType });
};

module.exports = function() {


    Object.defineProperty(Room.prototype, 'powerspawn', {
        configurable: true,
        get: function() {
            if(this._powerspawn !== undefined) {
                return this._powerspawn;
            } else {
                if (this.memory.powerSpawnID === undefined) {
                    let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_POWER_SPAWN });
                    if (bb.length > 0)
                        this.memory.powerSpawnID = bb[0].id;
                }
                this._powerspawn = Game.getObjectById(this.memory.powerSpawnID);
                if (this._powerspawn === null) this.memory.powerSpawnID = undefined;
                return this._powerspawn;
            }

        }
    });
    Object.defineProperty(Room.prototype, 'nuke', {
        configurable: true,
        get: function() {
            if(this._nuke !== undefined) {
                return this._nuke;
            } else {
                if (this.memory.nukeID === undefined) {
                    let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_NUKER });
                    if (bb.length > 0)
                        this.memory.nukeID = bb[0].id;
                }
                this._nuke = Game.getObjectById(this.memory.nukeID);
                if (this._nuke === null) this.memory.nukeID = undefined;
                return this._nuke;
            }

        }
    });


    Room.prototype.dropped = function() {
        var dEnergy;
        if (this.memory.hostileID === undefined || this.memory.droppedScanTimer != Game.time) {
            dEnergy = this.find(FIND_DROPPED_RESOURCES);
            let badArray = [];
            for (var e in dEnergy) {
                let zz = dEnergy[e];
                badArray.push(zz.id);
            }
            this.memory.droppedID = badArray;
            this.memory.droppedScanTimer = Game.time;
            return dEnergy;
        }
        dEnergy = [];
        for (var v in this.memory.droppedID) {
            dEnergy.push(Game.getObjectById(this.memory.droppedID[v]));
        }
        return dEnergy;
    };

    Room.prototype.hostilesHere = function() {
        var bads;
        if (this.memory.hostileID === undefined || this.memory.hostileScanTimer != Game.time) {
            bads = this.find(FIND_HOSTILE_CREEPS);
            let badArray = [];
            for (var e in bads) {
                let zz = bads[e];
                badArray.push(zz.id);
            }
            this.memory.hostileID = badArray;
            this.memory.hostileScanTimer = Game.time;
            return bads;
        }
        bads = [];
        for (var z in this.memory.hostileID) {
            bads.push(Game.getObjectById(this.memory.hostileID[z]));
        }
        return bads;
    };
};
