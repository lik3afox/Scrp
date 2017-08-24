var linksCache = [];

function getCached(id) {
    if (linksCache[id] === undefined) {
        linksCache[id] = Game.getObjectById(id);
    }
    return linksCache[id];
}

RoomPosition.prototype.lookForStructure = function(structureType) {
    let structures = this.lookFor(LOOK_STRUCTURES);
    return _.find(structures, { structureType: structureType });
};
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
    Object.defineProperty(Creep.prototype, "isHome", {
        configurable: true,
        get: function() {
            if (this.memory.home !== undefined)
                return this.room.name == this.memory.home;
            return false;
        },
    });
    Object.defineProperty(Creep.prototype, 'isNPC', {
        configurable: true,
        get: function() {

            return this.owner.username !== 'Invader' || this.owner.username !== 'Source Keeper';

        }
    });

    Object.defineProperty(Creep.prototype, 'isFriend', {
        configurable: true,
        get: function() {
            return _.contains(fox.friends, this.owner.username);
        }
    });
    Object.defineProperty(Creep.prototype, 'isEnemy', {
        configurable: true,
        get: function() {
            return _.contains(fox.enemies, this.owner.username);
            //            return this.owner.username !== 'Invader' && this.owner.username !== 'Source Keeper' && !_.contains(fox.friends, this.owner.username);
        }
    });
    Object.defineProperty(Creep.prototype, 'isAtEdge', {
        configurable: true,
        get: function() {
            return (this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49);
        }
    });

    Object.defineProperty(Creep.prototype, 'isNearEdge', {
        configurable: true,
        get: function() {
            return (this.pos.x <= 1 || this.pos.x >= 48 || this.pos.y <= 1 || this.pos.y >= 48);
        }
    });

    /*
     */
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

    Creep.prototype.stats = function(stat) {
        if (this.memory.stats === undefined) {
            this.memory.stats = {};
        }
        if (this.memory.stats[stat] === undefined) {
            switch (stat) {
                case 'mining':
                    let zz = this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 2;
                    return zz;
                case 'upgrading':
                    let aa = this.memory.stats[stat] = this.getActiveBodyparts(WORK);
                    return aa;
                case 'heal':
                case 'healing':
                    let zzz = this.memory.stats[stat] = this.getActiveBodyparts(HEAL) * 12;
                    return zzz;
                case 'carry':
                    let zzzz = this.memory.stats[stat] = this.getActiveBodyparts(CARRY) * 50;

                    return zzzz;
                default:
                    console.log('requested stat not existant');
                    break;
            }
        } else {
            return this.memory.stats[stat];
        }
    };
    var redFlags;
    Creep.prototype.defendFlags = function() {
        if (redFlags === undefined) {
            redFlags = _.filter(Game.flags, function(f) {
                return f.color == COLOR_RED || f.color == COLOR_RED && f.secondaryColor == COLOR_WHITE;
            });
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
        var hurtz;
        if (range !== undefined) {
            hurtz = this.pos.findInRange(FIND_CREEPS, range);
        } else {
            hurtz = this.room.find(FIND_CREEPS);
        }


        hurtz = _.filter(hurtz, function(object) {
            return object.hits < object.hitsMax && (object.owner.username == 'likeafox' || object.owner.username == 'baj');
        });
        hurtz.sort((a, b) => a.hits - b.hits);
        if (hurtz.length > 0) {
            if (!this.pos.isNearTo(hurtz[0])) {
                this.rangedHeal(hurtz[0]);
                this.room.visual.line(this.pos, hurtz[0].pos);
                this.moveTo(hurtz[0], { maxOpts: 100 });
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

    Creep.prototype.attackMove = function(badguy, options) {

        if (_.isArray(badguy)) {
            let target = this.pos.findClosestByRange(badguy);
            badguy = target;
        }
        if (this.attack(badguy) === OK) {
            var direction = this.pos.getDirectionTo(badguy);
            var moveStatus = this.move(direction, options);

        }
    };

    Creep.prototype.moveInside = function(options) {

        if (creep.x > 47) {
            if (creep.x !== 47)
                creep.move(LEFT);

        } else if (creep.x < 3) {
            if (creep.x !== 3)
                creep.move(RIGHT);

        } else if (creep.y > 47) {
            if (creep.y !== 47)
                creep.move(TOP);

        } else if (creep.y < 3) {
            if (creep.y !== 3)
                creep.move(BOTTOM);

        } else {
            return false;
        }

        var direction = this.pos.getDirectionTo(badguy);
        var moveStatus = this.move(direction, options);
    };

    var fox = require('foxGlobals');

    Creep.prototype.killBase = function(options) {
        //        if (this.hits !== this.hitsMax) return false;
        if (this.room.controller === undefined) {
            return false;
        }
        if (this.room.controller.owner === undefined) {
            return false;
        }
        if (this.room.controller !== undefined && this.room.controller.owner !== undefined &&

            _.contains(fox.friends, this.room.controller.owner.username)) return false;
        /*        if (this.memory.role == 'demolisher') {
                    console.log(this.room.controller);
                } */
        var struc = this.room.find(FIND_STRUCTURES);
        /*
                    var close;

                    if (test2.length !== 0) {
                        close = this.pos.findClosestByRange(bads);

                        if (this.pos.isNearTo(close)) {
                            this.attack(close);
                        } else {
                            this.moveTo(close, options);
                        }
                        return;
                    }
                    // This is something is on a rampart.
                    if (test.length !== 0) {
                        close = this.pos.findClosestByRange(bads);

                        if (this.pos.isNearTo(close)) {
                            this.attack(close);
                        } else {
                            this.moveTo(close, options);
                        }
                        return;
                    } */
        if (this.memory.targetID === undefined) {


            var test2 = _.filter(struc, function(o) {
                return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_ROAD && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && !o.pos.lookForStructure(STRUCTURE_RAMPART);
            }); // This is something is not on a rampart
            if (test2.length !== 0) {
                this.memory.targetID = this.pos.findClosestByRange(test2).id;
            } else {
                var test = _.filter(struc, function(o) {
                    return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && o.pos.lookForStructure(STRUCTURE_RAMPART);
                });
                if (test.length !== 0) {
                    this.memory.targetID = this.pos.findClosestByRange(test).id;
                } else {
                    bads = _.filter(struc, function(o) {
                        return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_CONTROLLER;
                    }); // these are the ramparts
                    if (bads.length > 0) {
                        this.memory.targetID = this.pos.findClosestByRange(bads).id;
                    } else {
                        bads = _.filter(struc, function(o) {
                            return o.structureType !== STRUCTURE_CONTROLLER;
                        }); // these are the ramparts
                        if (bads.length > 0) {
                            this.memory.targetID = this.pos.findClosestByRange(bads).id;
                        }
                    }
                }
            }


        }
        close = Game.getObjectById(this.memory.targetID);
        //        console.log(this.hits, this.hitsMax);
        if (close !== null) {
            if (this.pos.isNearTo(close)) {
                if (this.getActiveBodyparts(ATTACK) > 0) {
                    this.attack(close);
                } else if(this.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    this.rangedMassAttack();
                } else {
                    this.dismantle(close);
                }
                return true;
            } else /*if (this.hits == this.hitsMax)*/ {
                this.moveTo(close, options);
                return true;
            }
        } else {
            this.memory.targetID = undefined;
        }
        return false;
    };

    Creep.prototype.dragHealer = function(options) {
        if (this.memory.healerID !== undefined) {
            heal = Game.getObjectById(this.memory.healerID);
            if (this.memory.healerID === null) {
                this.memory.healerID = undefined;
            } else {
                this.move(heal.pos.getDirectionTo(this), options);
            }
        }
    };


    Creep.prototype.runFrom = function(badguy, options) {

        if (_.isArray(badguy)) {
            let target = this.pos.findClosestByRange(badguy);
            badguy = target;
        }
        //console.log(badguy.pos, badguy, this.pos);

        //        var result = PathFinder.search(this.pos, { pos: badguy.pos, range: 3 }, { flee: true });
        //        console.log('runfrom', this.pos.getDirectionTo(result.path[0]), result.length);
        //this.move(this.pos.getDirectionTo(result.path[0]))
        //        this.move(this.pos.getDirectionTo(result.path[0]));
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

    //    var fox = require('foxGlobals');
    Creep.prototype.sing = function(lyrics, public) {
        /*        if (!_.isArray(lyrics)) {
                    console.log('Give me an array', this);
                }
                if (this.saying !== undefined) { */
        var word = _.indexOf(lyrics, this.saying) + 1;
        this.say(lyrics[word >= lyrics.length ? 0 : word], public);
        //        }
    };
    Creep.prototype.runFrom = function(badguy, options) {

        if (_.isArray(badguy)) {
            let target = this.pos.findClosestByRange(badguy);
            badguy = target;
        }
        //console.log(badguy.pos, badguy, this.pos);

        //        var result = PathFinder.search(this.pos, { pos: badguy.pos, range: 3 }, { flee: true });
        //        console.log('runfrom', this.pos.getDirectionTo(result.path[0]), result.length);
        //this.move(this.pos.getDirectionTo(result.path[0]))
        //        this.move(this.pos.getDirectionTo(result.path[0]));
        var direction = this.pos.getDirectionTo(badguy);
        direction = direction + 4;
        if (direction > 8)
            direction = direction - 8;
        var moveStatus = this.move(direction, options);
        this.say('><', true);
    };

    function getExitDirection(direction) {
        switch (direction) {
            case TOP:
                return [FIND_EXIT_TOP];
            case TOP_RIGHT:
                return [FIND_EXIT_TOP, FIND_EXIT_RIGHT];
            case RIGHT:
                return [FIND_EXIT_RIGHT];
            case BOTTOM_RIGHT:
                return [FIND_EXIT_RIGHT, FIND_EXIT_BOTTOM];
            case BOTTOM:
                return [FIND_EXIT_BOTTOM];
            case BOTTOM_LEFT:
                return [FIND_EXIT_BOTTOM, FIND_EXIT_LEFT];
            case LEFT:
                return [FIND_EXIT_LEFT];
            case TOP_LEFT:
                return [FIND_EXIT_TOP, FIND_EXIT_LEFT];
        }
    }

    Creep.prototype.moveToEdge = function(options) {
        var Exits = [FIND_EXIT_TOP,
            FIND_EXIT_RIGHT,
            FIND_EXIT_BOTTOM,
            FIND_EXIT_LEFT
        ];
        var closest = 100;
        var exited;

        for (var e in Exits) {
            const exit = this.pos.findClosestByRange(Exits[e]);
            var distance = this.pos.getRangeTo(exit);
            if (distance < closest) {
                closest = distance;
                exited = exit;
            }
        }
        if (exited !== undefined) {
            this.moveTo(exited);
        }
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
            this.say('St' + this.memory.stuckCount);
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

        if (this.memory.role == 'transport' || this.memory.role == 'xtransport' || this.memory.party !== undefined) {
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
