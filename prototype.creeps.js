module.exports = function() {

    Object.defineProperty(Creep.prototype, "carryTotal", {
        configurable: true,
        get: function() {
            if (this.memory.carryTotal === undefined || this.memory.carryTotalTimer != Game.time) {
                this.memory.carryTotal = _.sum(this.carry);
                this.memory.carryTotalTimer = Game.time;
            }
            return this.memory.carryTotal;

        },
    });



    Object.defineProperty(Structure.prototype, "total", {
        configurable: true,
        get: function() {
            if (this._storage_sum !== undefined) {
                return this._storage_sum;
            } else {
                this._storage_sum = _.sum(this.store);
                return this._storage_sum;
            }
        },
    });

    Object.defineProperty(Room.prototype, 'powerspawn', {
        configurable: true,
        get: function() {
            if (this.memory.powerspawnID === undefined) {
                let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_POWER_SPAWN });
                if (bb.length > 0)
                    this.memory.powerspawnID = bb[0].id;
            }
            let zz = Game.getObjectById(this.memory.powerspawnID);
            if (zz === null) this.memory.powerspawnID = undefined;
            return zz;
        }
    });

    Object.defineProperty(Room.prototype, 'nuke', {
        configurable: true,
        get: function() {
            if (this.memory.nukeID === undefined) {
                let bb = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_NUKER });
                if (bb.length > 0)
                    this.memory.nukeID = bb[0].id;
            }
            let zz = Game.getObjectById(this.memory.nukeID);
            if (zz === null) this.memory.nukeID = undefined;
            return zz;
        }
    });

    Object.defineProperty(Creep.prototype, "stats", {
        configurable: true,
        get: function() {
            return this.memory.stats;
        },
    });
    Creep.prototype.stats = function(stat) {
        if (creep.memory.stats === undefined) {
            creep.memory.stats = {};
        }
        if (creep.memory.stats[stat] === undefined) {
            /*
        let wParts = _.filter(creep.body, { type: WORK }).length;
        let mParts = _.filter(creep.body, { type: MOVE }).length;
        let hParts = _.filter(creep.body, { type: HEAL }).length;
        let rParts = _.filter(creep.body, { type: RANGED_ATTACK }).length;
        let aParts = _.filter(creep.body, { type: ATTACK }).length;
        let cParts = _.filter(creep.body, { type: CARRY }).length;
        let cost = getCost(creep.body);
            */
            switch (stat) {
                case 'mining':
                    let zz = creep.memory.stats[stat] = _.filter(creep.body, { type: WORK }).length * 2;
                    return zz;
                case 'heal':
                case 'healing':
                    let zzz = creep.memory.stats[stat] = _.filter(creep.body, { type: HEAL }).length;
                    return zzz;
                default:
                    console.log('requested stat not existant');
                    break;
            }
        } else {
            return creep.memory.stats[stat];
        }
    };
    Creep.prototype.defendFlags = function() {
        var redFlags;

        if (this.memory.redFlagNames === undefined || this.memory.redFlagTimer != Game.time) {
            redFlags = _.filter(Game.flags, function(f) {
                return f.color == COLOR_RED;
            });
            let redFlagsArray = [];
            for (var e in redFlags) {
                redFlagsArray.push(redFlags[e].name);
            }
            this.memory.redFlagNames = redFlagsArray;
            this.memory.redFlagTimer = Game.time;
            return redFlags;
        }
        redFlags = [];
        for (var z in this.memory.redFlagNames) {
            redFlags.push(Game.flags[this.memory.redFlagNames[z]]);
        }
        return redFlags;
    };

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

    Creep.prototype.totalCarry = function() {
        if (this.memory.totalCarryTimer != Game.time) {
            this.memory.totalCarryTimer = Game.time;
            this.memory.totalCarry = _.sum(total.carry);
        }
        return this.memory.totalCarry;
    };

    Creep.prototype.pickUpEnergy = function() {
        let zz = this.room.lookAtArea((this.pos.y - 1 < 0 ? 0 : this.pos.y - 1), (this.pos.x - 1 < 0 ? 0 : this.pos.x - 1), (this.pos.y + 1 > 49 ? 49 : this.pos.y + 1), (this.pos.x + 1 > 49 ? 49 : this.pos.x + 1), true);
        for (var e in zz) {
            if (zz[e].type == 'resource') {
                if (zz[e].resource.resourceType == 'energy') {
                    if (this.pickup(zz[e].resource) == OK)
                        return;
                }
            }
        }
    };

    Creep.prototype.countDistance = function() {
        if (this.memory.distance === undefined) {
            this.memory.distance = 0;
        }
        if (this.memory.notThere === undefined) {
            this.memory.notThere = false;
        }
        if (this.memory.notThere) return;
        this.memory.distance++;
        this.room.visual.text("🐨" + this.memory.distance, this.pos.x, this.pos.y, { color: 'white', font: 0.5, align: LEFT, strokeWidth: 0.35 });
        return false;
    };

    Creep.prototype.dropEverything = function() {
        for (var e in this.carry) {
            this.drop(e);
            return;
        }
    };

    Creep.prototype.countStop = function() {
        this.memory.notThere = true;
    };
    Creep.prototype.countReset = function() {
        this.memory.notThere = false;
        this.memory.distance = 0;
    };

    Creep.prototype.healOther = function(range) {
        var hurtz = this.pos.findInRange(FIND_MY_CREEPS, range);
        hurtz = _.filter(hurtz, function(object) {
            return object.hits < object.hitsMax;
        });
        hurtz.sort((a, b) => a.hits - b.hits);
        if (hurtz.length > 0) {
            if (!this.pos.isNearTo(hurtz[0])) {
                this.rangedHeal(hurtz[0]);
                this.moveTo(hurtz[0]);
            } else {
                this.heal(hurtz[0]);
            }
            return true;
        }
        return false;
    };

    Creep.prototype.selfHeal = function() {
        if (this.hits == this.hitsMax) return false;
        if (this.memory.hasHeal === undefined) {
            this.memory.hasHeal = false;
            for (var e in this.body) {
                if (this.body[e].type == HEAL) {
                    this.memory.hasHeal = true;
                }

            }
        }
        if (!this.memory.hasHeal) return false;
        this.heal(this);
    };

    Creep.prototype.runFrom = function(badguy, options) {
        if (_.isArray(badguy)) {
            let target = this.pos.findClosestByRange(badguy);
            badguy = target;
        }
        var direction = this.pos.getDirectionTo(badguy);
        direction = direction + 4;
        if (direction > 8)
            direction = direction - 8;
        var moveStatus = this.move(direction, options);
        this.say('><', true);
    };

    Spawn.prototype.deadCheck = function() {
        // first off a spawn needs to have a memory check too make sure
        // it wants to do this deadCheck
        // Leveling rooms do not want this.
        if (this.memory.deadCheck === undefined) {
            if (this.room.name != 'E27S75') {
                this.memory.deadCheck = true;
            } else {
                this.memory.deadCheck = false;
            }
        }
        if (!this.memory.deadCheck) return;
        if (this.spawning !== undefined) return;

        if (this.room.energyAvailable < 300 && this.memory.totalCreep < 5 && this.room.controller.level >= 4) {
            if (this.room.memory.roomFailure === undefined)
                this.room.memory.roomFailure = 0;
            this.room.memory.roomFailure++;
        } else {
            this.room.memory.roomFailure = 0;
        }

        //console.log(this.room.memory.roomFailure);
        if (this.room.memory.roomFailure > 10000) {
            let body = [MOVE, CARRY, CARRY, MOVE];
            let name = 'Emergcy';
            let mem = {
                role: 'first',
                home: this.room.name,
                parent: this.id,
                level: 1
            };
            let zz = this.createCreep(body, name, mem);
            if (zz === 0) this.room.memory.roomFailure = -1500;
            console.log('Emergency creation, trying to create simple RESULT:');
        }

        // If spawns haven't spawn in a while
        //Game.spawns[title].memory.lastSpawn = 0;
        // if creeps are less than 5
        // spawn.memory.totalCreep


    };


    Creep.prototype.moveMe = function(target, options, xxx) {

        if (this.memory.standSpot !== undefined) {
            if (this.pos.isEqualTo(this.memory.standSpot)) {
                return OK;
            } else {

                moveStatus = this.moveTo(this.memory.standSpot, options);
                if (moveStatus == ERR_NO_PATH) {}

                return moveStatus;

            }
        }

        if (this.fatigue > 0) return;
        //  if(targets)


        if (xxx !== undefined) {
            target = new RoomPosition(target, options, this.room.name);
            options = xxx;
        }

        if (_.isUndefined(this.memory.stuckCount)) this.memory.stuckCount = 0;

        var moveStatus;
        if (options === undefined) options = {};
        var samePath = 50;
        var stuck = false;

        if (this.memory.position !== undefined) {
            stuck = this.pos.isEqualTo(this.memory.position.x, this.memory.position.y);
        }
        this.memory.position = this.pos;
        if (this.memory.stuckCount > 0)
            this.say('St' + this.memory.stuckCount, true);
        if (stuck) {
            this.memory.stuckCount++;

            if (this.memory.stuckCount >= 2) {
                this.memory.detourTicks = 5;
            }
        } else {
            if (this.memory.stuckCount > 0)
                this.memory.stuckCount--;
        }

        if (this.memory.detourTicks > 0) {
            this.memory.detourTicks--;
            samePath = 5;
        }

        if (this.memory.stuckCount > 5)
            this.memory.stuckCount = 5;

        //  options.reusePath = samePath;
        if (options.visualizePathStyle === undefined) {
            options.visualizePathStyle = {
                stroke: '#faF',
                lineStyle: 'dotted',
                strokeWidth: 0.1,
                opacity: 0.5
            };
        }


        if (this.memory.role == 'transport' || this.memory.role == 'xtransport') {
            if (this.room.name != this.memory.home)
                options.ignoreCreeps = true;
            if (this.room.name == 'E35S84' || this.room.name == 'E35S74')
                options.ignoreRoads = false;
        }

        if (this.room.name == 'W4S93') {
            options.ignoreCreeps = true;
        }

        if (options.ignoreCreeps) {
            if (this.memory.stuckCount > 2) {
                options.reusePath = 5;
                options.ignoreCreeps = false;
            }
        }

        moveStatus = this.moveTo(target, options);

        return moveStatus;
    };
};
