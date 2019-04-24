var _powerspawn;
var fox = require('foxGlobals');

Object.defineProperty(Room.prototype, "powerLevels", {
    configurable: true,
    get: function() {
        return this.memory.powerLevels;
    },
});


    Object.defineProperty(Room.prototype, 'myPowerCreeps', {
        configurable: true,
        get: function() {
            if (this._cachedPowerCrps === undefined) {
                this._cachedPowerCrps = this.find(FIND_MY_POWER_CREEPS);
            }
            return this._cachedPowerCrps;
        }
    });
    Object.defineProperty(Room.prototype, 'enemyPowerCreeps', {
        configurable: true,
        get: function() {
            if (this._enemyPowerCrps === undefined) {
                this._enemyPowerCrps = _.filter(this.find(FIND_HOSTILE_POWER_CREEPS), function(o) {
                    return !_.contains(fox.friends, o.owner.username);
                });
            }
            return this._enemyPowerCrps;
        }
    });
    Object.defineProperty(Room.prototype, 'allyPowerCreeps', {
        configurable: true,
        get: function() {
            if (this._allyPowerCrps === undefined) {
                this._allyPowerCrps = _.filter(this.find(FIND_HOSTILE_POWER_CREEPS), function(o) {
                    return _.contains(fox.friends, o.owner.username);
                });
            }
            return this._allyPowerCrps;
        }
    });


RoomPosition.prototype.heroStats = function(structureType) {
    if (!this.memory.heroStats) {
        this.memory.heroStats = {};
    }
    return this.memory.heroStats;
};

RoomPosition.prototype.getNearByHostileStructures = function() {
    if(!this._returnedHostStructs){
        var badStr = this.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        bads = _.filter(badStr, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.structureType !== STRUCTURE_STORAGE && o.structureType !== STRUCTURE_TERMINAL;
        });
        this._returnedHostStructs = badStr[0];
        return badStr[0];
    } else {
        return this._returnedHostStructs;
    }
};


RoomPosition.prototype.lookForStructure = function(structureType) {
    return _.find(this.lookFor(LOOK_STRUCTURES), { structureType: structureType });
};

RoomPosition.prototype.getMassRangeDamage = function(bads) {
    if (bads.length === 0) return 0;
    let total = 0;
    for (let i in bads) {
        let range = this.getRangeTo(bads[i]);
        if (range === 1) {
            total += 10;
        } else
        if (range === 2) {
            total += 3;
        } else
        if (range === 3) {
            total += 1;
        }
    }
    return total;
};


RoomPosition.prototype.isSkRoom = function() {
    let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.roomName);
    let xMod = parsed[1] % 10;
    let yMod = parsed[2] % 10;
    if ((xMod === 5) && (yMod === 5)) return true;
    return (xMod >= 4) && (xMod <= 6) && (yMod >= 4) && (yMod <= 6);
};
Object.defineProperty(Room.prototype, "storedEnergy", {
    configurable: true,
    get: function() {
        var stor = 0;
        var term = 0;
        if (this.storage !== undefined) {
            stor = this.storage.store[RESOURCE_ENERGY];
        }
        if (this.terminal !== undefined) {
            term = this.terminal.store[RESOURCE_ENERGY];
        }
        return stor + term;
    },
});

module.exports = function() {
    Object.defineProperty(Room.prototype, 'spawnExtension', {
        configurable: true,
        get: function() {
            if (this._cachedSpawnExtension === undefined) {
                this._cachedSpawnExtension = _.filter(this.find(FIND_MY_STRUCTURES), function(structure) {
                    return structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN;
                });
            }
            return this._cachedSpawnExtension;
        }
    });


    Object.defineProperty(Room.prototype, 'myHurtCreeps', {
        configurable: true,
        get: function() {
            if (this._cachedHurt === undefined) {
                this._cachedHurt = _.filter(this.find(FIND_MY_CREEPS), function(o) {
                    return o.hits !== o.hitsMax;
                });
            }
            return this._cachedHurt;
        }
    });
    Object.defineProperty(Room.prototype, 'myBattleGroup', {
        configurable: true,
        get: function() {
            //            if (this._cachedHurt === undefined) {
            this._cachedHurt = _.filter(this.find(FIND_MY_CREEPS), function(o) {
                return o.memory.party === 'dangerRoom';
            });
            //          }
            return this._cachedHurt;
        }
    });


    Object.defineProperty(Room.prototype, 'allies', {
        configurable: true,
        get: function() {
            if (this._cachedAllies === undefined) {
                this._cachedAllies = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return _.contains(fox.friends, o.owner.username);
                });
            }
            return this._cachedAllies;
        }
    });

    Object.defineProperty(Room.prototype, 'notAllies', {
        configurable: true,
        get: function() {
            if (this._cachedNotAllies === undefined) {
                this._cachedNotAllies = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return !_.contains(fox.friends, o.owner.username);
                });
            }
            return _.clone(this._cachedNotAllies);
        }
    });
    Object.defineProperty(Room.prototype, 'playerCreeps', {
        configurable: true,
        get: function() {
            if (this._cachedNotAllies === undefined) {
                this._cachedNotAllies = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return !_.contains(fox.friends, o.owner.username) && o.owner.username !== 'Invader';
                });
            }
            return this._cachedNotAllies;
        }
    });

    Object.defineProperty(Room.prototype, 'npcs', {
        configurable: true,
        get: function() {
            if (this._cachedNPC === undefined) {
                this._cachedNPC = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return o.owner.username === 'Screeps';
                });
            }
            return this._cachedNPC;
        }
    });


    Object.defineProperty(Room.prototype, 'sourceKeepers', {
        configurable: true,
        get: function() {
            if (this._cachedSK === undefined) {
                this._cachedSK = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return o.owner.username === 'Source Keeper';
                });
            }
            return this._cachedSK;
        }
    });

    Object.defineProperty(Room.prototype, 'allBads', {
        configurable: true,
        get: function() {
            let bads = this.find(FIND_HOSTILE_CREEPS);
            let invad = [];
            let sk = [];
            let play = [];
            for(let i in bads){
                if(bads[i].owner.username === 'Invader'){
                    invad.push(bads[i]);
                }else if(bads[i].owner.username === 'Source Keeper'){
                    sk.push(bads[i]);
                }else if(!_.contains(fox.friends, o.owner.username)){
                    play.push(bads[i]);
                }
            }
            return {
                invaders:invad,
                sourceKeeper:sk,
                players:play
            };
        }
    });


    Object.defineProperty(Room.prototype, 'invaders', {
        configurable: true,
        get: function() {
            if (this._cachedInvaders === undefined) {
                this._cachedInvaders = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return o.owner.username === 'Invader';
                });
            }
            return this._cachedInvaders;
        }
    });

    Object.defineProperty(Room.prototype, 'enemies', {
        configurable: true,
        get: function() {
            if (this._cachedNotAllies) {
                this._cachedEnemies = _.filter(this._cachedNotAllies, function(o) {
                    return o.owner.username !== 'Source Keeper' && o.owner.username !== 'Invader';
                });
            }
            if (this._cachedEnemies === undefined) {
                this._cachedEnemies = _.filter(this.find(FIND_HOSTILE_CREEPS), function(o) {
                    return !_.contains(fox.friends, o.owner.username) && o.owner.username !== 'Source Keeper' && o.owner.username !== 'Invader';
                });
            }
            return this._cachedEnemies;
        }
    });


    Object.defineProperty(Room.prototype, 'stats', {
        configurable: true,
        get: function() {
            let zz = Memory.stats.rooms[this.name];
            if (zz !== undefined) {
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

    Object.defineProperty(Room.prototype, 'extractor', {
        // Returns any(my/enemy) towers.
        configurable: true,
        get: function() {
            if (this._extractor !== undefined) {
                return this._extractor;
            } else {
                if (this.memory.extractID === undefined) {
                    var rtn = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_EXTRACTOR });
                    if (rtn.length > 0) {
                        this.memory.extractID = rtn[0].id;
                    }
                }
                let ext = Game.getObjectById(this.memory.extractID);
                if (ext === null) ext = undefined;
                this._extractor = ext;
                return this._extractor;
            }
        }
    });
    /*
        Object.defineProperty(Room.prototype, '', {
            // Returns any(my/enemy) towers.
            configurable: true,
            get: function() {
                if (this._mineral !== undefined) {
                    return this._mineral;
                } else {
                    if (this.memory.mineralID === undefined) {
                        var rtn = this.find(FIND_MINERALS);
                        if (rtn.length > 0) {
                            this.memory.mineralID = rtn[0].id;
                        }
                    }
                    let ext = Game.getObjectById(this.memory.mineralID);
                    if (ext === null) ext = undefined;
                    this._mineral = ext;
                    return this._mineral;
                }
            }
        }); */

    Object.defineProperty(Room.prototype, 'dropped', {
        // Returns any(my/enemy) towers.
        configurable: true,
        get: function() {
            if (this._mineral !== undefined) {
                return this._mineral;
            } else {
                var rtn = this.find(FIND_DROPPED_RESOURCES);
                this._mineral = rtn;
                return this._mineral;
            }
        }
    });
    Object.defineProperty(Room.prototype, 'tombstone', {
        // Returns any(my/enemy) towers.
        configurable: true,
        get: function() {
            if (this._tombstones !== undefined) {
                return this._tombstones;
            } else {

                var rtn = this.find(FIND_TOMBSTONES);
                rtn = _.filter(rtn, function(o) {
                    return o.total > 0;
                });
                this._tombstones = rtn;

                return this._tombstones;
            }
        }
    });


    Object.defineProperty(Room.prototype, 'mineral', {
        // Returns any(my/enemy) towers.
        configurable: true,
        get: function() {
            //        if (this._mineral !== undefined && this.name !== 'E44S59') {//
            //               if(this.name === 'E44S59')                console.log(this._mineral,!this.mineral,this._mineral === undefined,this._mineral === null,"nothing this._mineral !== undefined");
            //              return this._mineral;
            //            } else {
            if (this.memory.mineralID === undefined) {
                var rtn = this.find(FIND_MINERALS);
                if (rtn.length > 0) {
                    this.memory.mineralID = rtn[0].id;
                }
            }
            let ext = Game.getObjectById(this.memory.mineralID);
            //if (ext === null) ext = undefined;
            //    this._mineral = ext;
            return ext;
            //      }
        }
    });

    Object.defineProperty(Room.prototype, 'towers', {
        // To slow - do not do.
        configurable: true,
        get: function() {
            if (this._towers !== undefined) {
                return this._towers;
            } else {
                if(this.memory.towers && this.memory.towers.length > 0){
                    this._towers = [];
                    for(let i in this.memory.towers){
                        let twer = Game.getObjectById(this.memory.towers[i]);
                        if(twer)this._towers.push(twer);
                    }
                } else {
                    this._towers = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_TOWER });
                }
                return this._towers;
            }

        }
    });

    Object.defineProperty(Room.prototype, 'spawns', {
        // Returns any(my/enemy) towers.
        configurable: true,
        get: function() {

            var spwns = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_SPAWN });
            this.memory.spawns = [];
            for (var e in spwns) {
                this.memory.spawns.push(spwns[e].id);
            }

        }
    });
    Object.defineProperty(Room.prototype, 'availableSpawns', {
        // Returns any(my/enemy) towers.
        configurable: true,
        get: function() {
            if (this._spawns !== undefined) {
                return this._spawns;
            } else {
                this._spawns = this.find(FIND_STRUCTURES, { filter: o => o.structureType == STRUCTURE_SPAWN && !o.spawning });
                return this._spawns;
            }

        }
    });

    Object.defineProperty(Room.prototype, 'masterLink', {
        configurable: true,
        get: function() {
            if (this._masterLink) {
                return this._masterLink;
            } else {
                this._masterLink = Game.getObjectById(this.memory.masterLinkID);
                if (this._masterLink === null) {
                    this.memory.masterLinkID = undefined;
                    return undefined;
                }
                return this._masterLink;
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
                    if (bb.length > 0) {
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
                if (this._observer === null) {
                    this.memory.observerID = undefined;
                    return undefined;
                }
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
                if (this.memory.boostLabID === undefined && this.controller !== undefined) {
                    if (!this.controller.owner || this.controller.owner.username !== 'likeafox') {
                        return undefined;
                    }
                    if (this.controller.level === 8) {
                        let zzz = this.find(FIND_MY_STRUCTURES);
                        zzz = _.filter(zzz, function(structure) {
                            return (structure.structureType == STRUCTURE_LAB);
                        });
                        console.log('looking for boostLab', zzz.length, this.name);
                        if (zzz.length === 10) {
                            this.memory.boostLabID = zzz[9].id;
                            return zzz[9];
                        }
                    }
                    return undefined;
                }
                this._boostLab = Game.getObjectById(this.memory.boostLabID);
                if (this._boostLab === null) this.memory.boostLabID = undefined;
                return this._boostLab;
            }

        }
    });














    RoomPosition.prototype.isNearAny = function(targets) {

        if (!_.isArray(targets)) {
            targets = [targets];
        }
        for (let i in targets) {
            if (this.isNearTo(targets[i])) {
                return targets[i];
            }
        }
        return undefined;
    };
    /*
     */
    StructureTower.prototype.damageDone = function(target) {

        var range = this.pos.getRangeTo(target);
        if (range <= 5) {
            return 600;
        } else if (range >= 20) {
            return 150;
        } else {
            range -= 5;
            return 150 + 30 * range;
        }

    };

    Room.prototype.towerDamage = function(target) {
        let towers = this.find(FIND_STRUCTURES);
        let total = 0;
        towers = _.filter(towers, function(o) {
            if (o.structureType == STRUCTURE_TOWER) {
                total += o.damageDone(target);
            }
        });
        return total;
    };


    Creep.prototype.healDone = function(creeps) {
        var total = 0;
        var heal;
        var e;
        //      console.log(this);
        var tgt = this;
        _.forEach(creeps, function(o) {
            //            console.log(tgt,o,o.pos.isNearTo(tgt));
            if (o.pos.isNearTo(tgt)) {
                for (e in o.body) {
                    if (o.body[e].type === HEAL) {
                        heal = 12;
                        if (o.body[e].boost !== undefined) {
                            heal *= BOOSTS.heal[o.body[e].boost].heal;
                        }
                        total += heal;
                    }
                }
            } else if (o.pos.getRangeTo(tgt) <= 3) {
                for (e in o.body) {
                    if (o.body[e].type === HEAL) {
                        heal = 12;
                        if (o.body[e].boost !== undefined) {
                            heal *= BOOSTS.heal[o.body[e].boost].rangedHeal;
                        }
                        total += heal;
                    }

                }
            }
        });
        return total;
    };


    RoomPosition.prototype.damageDone = function(creeps) {
        var total = 0;
        var damage;
        var e;
        var tgt = this;
        _.forEach(creeps, function(o) {
            if (o.pos.isNearTo(tgt)) {
                for (e in o.body) {
                    if (o.body[e].type === ATTACK) {
                        damage = 30;
                        if (o.body[e].boost !== undefined) {
                            damage *= BOOSTS.attack[o.body[e].boost].attack;
                        }
                        total += damage;
                    }
                    if (o.body[e].type === RANGED_ATTACK) {
                        damage = 10;
                        if (o.body[e].boost !== undefined) {
                            damage *= BOOSTS.ranged_attack[o.body[e].boost].rangedAttack;
                        }
                        total += damage;
                    }

                }
            } else if (o.pos.getRangeTo(tgt) <= 3) {
                for (e in o.body) {
                    if (o.body[e].type === RANGED_ATTACK) {
                        damage = 10;
                        if (o.body[e].boost !== undefined) {
                            damage *= BOOSTS.ranged_attack[o.body[e].boost].rangedAttack;
                        }
                        total += damage;
                    }

                }
            }
        });
        return total;
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

    /*
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
        };*/

    StructureTerminal.prototype.recordSend = function(mineral, amount, roomTarget, notes) {
        let result = this.send(mineral, amount, roomTarget, notes);
        if (this.room.memory.terminalText === undefined) {
            return result;
        }
        let distanceBetweenRooms = Game.map.getRoomLinearDistance(this.room.name, roomTarget, true);
        let cost = Math.ceil(amount * (1 - Math.exp(-distanceBetweenRooms / 30)));
        if (result === OK) {
            this._didSend = true;
            //            this.room.memory.terminalText.sent = "Sent:" + mineral + " #" + amount + " to:" + roomTarget + " @" + Game.time + "$:" + cost;
            if (Game.rooms[roomTarget] !== undefined && Game.rooms[roomTarget].memory.terminalText !== undefined) {
                Game.rooms[roomTarget].memory.terminalText.recieved = "Recieved:" + mineral + " #" + amount + " from:" + this.room.name + " @" + Game.time + "$:" + cost;
            }
        }
        return result;
    };
    //                let whatHappened = Game.market.deal(target.id, trans, targetRoom);    

};