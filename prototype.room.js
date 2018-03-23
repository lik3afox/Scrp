var _powerspawn;

RoomPosition.prototype.lookForStructure = function(structureType) {
    let structures = this.lookFor(LOOK_STRUCTURES);
    return _.find(structures, { structureType: structureType });
};

module.exports = function() {
 Object.defineProperty(Room.prototype, 'stats', {
        configurable: true,
        get: function() {
    let zz = Memory.stats.rooms[this.name];
    if(zz !== undefined) {
        return zz;
    }
    return {};
}
 });
    Object.defineProperty(Room.prototype, 'alphaSpawn', {
        configurable: true,
        get: function() {
            if (this._alphaSpawn !== undefined) {
                return this._alphaSpawn;
            } else {
                if (this.controller === undefined || this.controller.owner === undefined || this.controller.owner.username !== 'likeafox') {
                    return undefined;
                }
                if (this.memory.alphaSpawnID === undefined) {
                    let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_SPAWN && o.memory !== undefined && o.memory.alphaSpawn });
                    if (bb.length > 0) {
                        this.memory.alphaSpawnID = bb[0].id;
                    } else {
                        return undefined;
                    }
                }
                this._alphaspawn = Game.getObjectById(this.memory.alphaSpawnID);
                if (this._alphaspawn === null) {
                    this.memory.alphaSpawnID = undefined;
                    return undefined;
                }
                return this._alphaspawn;
            }

        }
    });

    Object.defineProperty(Room.prototype, 'powerspawn', {
        configurable: true,
        get: function() {
            if (this._powerspawn !== undefined && this._powerspawn !== null) {
                return this._powerspawn;
            } else {
                if (this.memory.powerSpawnID === undefined) {
                    let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_POWER_SPAWN });
                    if (bb.length > 0){
                        this.memory.powerSpawnID = bb[0].id;
                        return bb[0];
                    }
                }
                this._powerspawn = Game.getObjectById(this.memory.powerSpawnID);
                if (this._powerspawn === null) {
                    this.memory.powerSpawnID = undefined;
                    return undefined;
                }
                return this._powerspawn;
            }
        }
    });
    Object.defineProperty(Room.prototype, 'nuke', {
        configurable: true,
        get: function() {
            if (this._nuke !== undefined) {
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

    Object.defineProperty(Room.prototype, 'observer', {
        configurable: true,
        get: function() {
            if (this._observer !== undefined) {
                return this._observer;
            } else {
                if (this.memory.observerID === undefined) {
                    let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_OBSERVER });
                    if (bb.length > 0)
                        this.memory.observerID = bb[0].id;
                }
                this._observer = Game.getObjectById(this.memory.observerID);
                if (this._observer === null) this.memory.observerID = undefined;
                return this._observer;
            }

        }
    });
    Object.defineProperty(Room.prototype, 'boostLab', {
        configurable: true,
        get: function() {
            if (this._boostLab !== undefined) {
                return this._boostLab;
            } else {
                if (this.memory.boostLabID === undefined) {
                    return undefined;
                }
                this._boostLab = Game.getObjectById(this.memory.boostLabID);
//                console.log(this.memory.boostLabID,this._boostLab);
                if (this._boostLab === null) this.memory.boostLabID = undefined;
                return this._boostLab;
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



    Room.prototype.boostFromBoostLab = function(creep) {
        if (this._didLab) {
            return false;
        }
        let laber = Game.getObjectById(this.memory.boostLabID);
        if (laber !== null) {
            if (creep.pos.isNearTo(laber) && laber.mineralAmount >= neededMin) {
                let zz = laber.boostCreep(creep);
                creep.say('ah!' + zz);
                if (zz == OK) {
                    creep.memory.isBoosted = true;
                    this._didLab = true;
                }
                return zz;
            } else {
                creep.moveTo(laber);
                return false;
            }
            return zz;
        }
        return false;
    };

    Room.prototype.hostilesHere = function() {

        //    if (this.memory.hostileID === undefined || this.memory.hostileScanTimer != Game.time) {
        //          let badArray = [];
        /*            for (var e in bads) {
                        let zz = bads[e];
                        badArray.push(zz.id);
                    } */
        //            this.memory.hostileID = badArray;
        //           this.memory.hostileScanTimer = Game.time;
        return this.find(FIND_HOSTILE_CREEPS);
        //     }
        //  bads = [];
        //  for (var z in this.memory.hostileID) {
        //    bads.push(Game.getObjectById(this.memory.hostileID[z]));
        // }
        // return bads;
    };
};