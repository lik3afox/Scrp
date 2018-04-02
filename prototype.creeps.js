module.exports = function() {


    Object.defineProperty(Creep.prototype, "carryTotal", {
        configurable: true,
        get: function() {
            if (this._carryTotal_sum !== undefined) {
                return this._carryTotal_sum;
            } else {
                this._carryTotal_sum = _.sum(this.carry);
                return this._carryTotal_sum;
            }
        },
    });
    Object.defineProperty(Creep.prototype, "powerSpawn", {
        configurable: true,
        get: function() {
            return Game.rooms[this.memory.home].powerSpawn;
        },
    });
    Object.defineProperty(Creep.prototype, "roomName", {
        configurable: true,
        get: function() {
            return this.pos.roomName;
        },
    });

    Object.defineProperty(Creep.prototype, "homeRoom", {
        configurable: true,
        get: function() {
            return Game.rooms[this.memory.home];
        },
    });
    Object.defineProperty(Creep.prototype, "atFlagRoom", {
        configurable: true,
        get: function() {
            return this.room.name === this.partyFlag.pos.roomName;
        },
    });

    Object.defineProperty(Creep.prototype, "partyFlag", {
        configurable: true,
        get: function() {
            return Game.flags[this.memory.party];
        },
    });
    Object.defineProperty(Creep.prototype, "homeFlag", {
        configurable: true,
        get: function() {
            return Game.flags[this.memory.home];
        },
    });

    Object.defineProperty(Creep.prototype, "carrying", {
        configurable: true,
        get: function() {
            if (this._carrying === undefined) {
                for (var e in this.carry) {
                    if (this.carry[e] > 0) {
                        this._carrying = e;
                        return e;
                    }
                }
            } else {
                return this._carrying;
            }
        },
    });

    Object.defineProperty(Creep.prototype, "level", {
        configurable: true,
        get: function() {
            return this.memory.level;
        },
    });
    Object.defineProperty(Creep.prototype, "party", {
        configurable: true,
        get: function() {
            return this.memory.party;
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
    /*
               if (creep.memory.stats !== undefined) return;

               let wParts = _.filter(creep.body, { type: WORK }).length;
               let mParts = _.filter(creep.body, { type: MOVE }).length;
               let hParts = _.filter(creep.body, { type: HEAL }).length;
               let rParts = _.filter(creep.body, { type: RANGED_ATTACK }).length;
               let aParts = _.filter(creep.body, { type: ATTACK }).length;
               let cParts = _.filter(creep.body, { type: CARRY }).length;
               let cost = getCost(creep.body);
               let stats = {
                   //            birthTime: Game.time
                   // === 0 ? undefined : wParts
                   work: wParts,
                   heal: hParts,
                   carry: cParts,
                   move: mParts,
                   energyCost: cost,
                   spawnTime: creep.body.length * 3,
                   mining: wParts * 2,
                   harvesting: wParts,
                   attack: aParts * 30,
                   build: wParts * 5,
                   repair: wParts * 100,
                   repairEnergy: wParts,
                   upgrade: wParts,
                   carryMax: cParts * 50,
                   dismanle: wParts * 50,
                   healMax: hParts * 12,
                   rangeHeal: hParts * 4,
                   massMax: rParts * 1,
                   massMid: rParts * 4,
                   massMin: rParts * 10,
                   range: rParts * 10,
                   recovery: mParts,
                   fatigue: (creep.body.length - mParts),
                   swamp: (creep.body.length - mParts) * 5,
                   renewCost: Math.ceil(cost / 2.5 / creep.body.length),
                   renewTime: Math.floor(600 / creep.body.length),

                   level: creep.memory.level
               };
*/


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
    Object.defineProperty(Tombstone.prototype, "total", {
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
    Creep.prototype.stats = function(stat) {
        if (this.memory.stats === undefined) {
            this.memory.stats = {};
        }
        if (this.memory.stats[stat] === undefined) {
            var ab;
            switch (stat) {
                case 'repair':
                case 'repairing':
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 100;
                    return this.memory.stats[stat];
                case 'work': // used by repair to get the energy worked.
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK);
                    return this.memory.stats[stat];
                case 'mining':
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 2;
                    return this.memory.stats[stat];
                case 'building':
                    let zxz = this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 10;
                    return zxz;
                case 'mineral':
                    let zzb = this.memory.stats[stat] = this.getActiveBodyparts(WORK);
                    return zzb;
                case 'upgrading':
                    let aa = this.memory.stats[stat] = this.getActiveBodyparts(WORK);
                    return aa;
                case 'heal':
                case 'healing':
                    let zazz = this.memory.stats[stat] = this.getActiveBodyparts(HEAL) * 12;
                    return zazz;
                case 'attack':
                    let zzz = this.memory.stats[stat] = this.getActiveBodyparts(ATTACK) * 30;
                    return zzz;
                case 'dismantle':
                    ab = this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 50;
                    return ab;
                case 'rangedAttack':
                case 'rangedattack':
                case 'ranged Attack':
                    let zzez = this.memory.stats[stat] = this.getActiveBodyparts(RANGED_ATTACK) * 10;
                    return zzez;


                case 'carry':
                    let zzzz = this.memory.stats[stat] = this.getActiveBodyparts(CARRY) * 50;

                    return zzzz;
                default:
                    //                    console.log('requested stat not existant');
                    break;
            }
        } else {
            return this.memory.stats[stat];
        }
    };
    /*  var redFlags;
    Creep.prototype.defendFlags = function() {
        if (redFlags === undefined) {
            redFlags = _.filter(Game.flags, function(f) {
                return f.color == COLOR_RED;
            });
        }
        return redFlags;
    };
*/

    Creep.prototype.pickUpEnergy = function() {
        let zz = this.room.lookAtArea((this.pos.y - 1 < 0 ? 0 : this.pos.y - 1), (this.pos.x - 1 < 0 ? 0 : this.pos.x - 1), (this.pos.y + 1 > 49 ? 49 : this.pos.y + 1), (this.pos.x + 1 > 49 ? 49 : this.pos.x + 1), true);
        for (var e in zz) {
            if (zz[e].type == 'resource') {
                if (zz[e].resource.resourceType == 'energy') {
                    if (this.pickup(zz[e].resource) == OK)
                        return true;
                }
            }
        }
        return false;
    };

    Creep.prototype.moveToPickUp = function(FIND, amount, options) {
        if (options === undefined) options = {};
        _.defaults(options, {
            reusePath: 10,
            visualizePathStyle: {
                fill: 'transparent',
                stroke: '#f0f',
                lineStyle: 'dashed',
                strokeWidth: 0.15,
                opacity: 0.5
            },
        });
        var close;
        if (this.memory.pickUpId === undefined) {
            if (amount === undefined) amount = 0;
            if (FIND === FIND_DROPPED_RESOURCES) {
                close = this.pos.findClosestByRange(FIND, {
                    filter: function(object) {
                        return object.amount > amount && object.resourceType !== 'energy';
                    }
                });
            } else {
                close = this.pos.findClosestByRange(FIND, {
                    filter: function(object) {
                        return object.amount > amount;
                    }
                });
            }

        } else {
            close = Game.getObjectById(this.memory.pickUpId);
        }

        if (close === null || close === undefined) {
            this.memory.pickUpId = undefined;
            return false;
        }

        if (this.pos.isNearTo(close)) {
            return this.pickup(close);
        } else {
            return this.moveTo(close, options);
        }

        return false;
    };

    Creep.prototype.sleep = function(count) {
        if (count === undefined) count = 3;
        this.cleanMe();
        this.memory.sleeping = count;
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
    Creep.prototype.moveToWithdrawSource = function() {

        if (this.getActiveBodyparts(WORK) === 0) return false;

        let source = Game.getObjectById(this.memory.sourceID);
        if (source === null || source.energy === 0 || source.energy === undefined) {
            var total = this.room.find(FIND_SOURCES_ACTIVE);
            this.say('FINDING' + total.length);
            if (total.length === 0)
                return false;
            if (total.length === 1) {
                this.memory.sourceID = total[0].id;
            } else {
                for (var z in total) {
                    let otherHasIt = false;
                    for (var e in Game.thiss) {
                        if (Game.thiss[e].memory.role == this.memory.role && Game.thiss[e].memory.sourceID == total[z].id) {
                            otherHasIt = true;
                        }
                    }
                    if (!otherHasIt) {
                        this.memory.sourceID = total[z].id;
                        break;
                    }
                }
                // if none has been assigned that means that it's all full so give it an random one!
                if (this.memory.sourceID === undefined) {
                    let rando = Math.floor(Math.random() * total.length);
                    this.memory.sourceID = total[rando].id;
                }
            }
            source = Game.getObjectById(this.memory.sourceID);
        }


        // let source = Game.getObjectById( this.memory.sourceID ); 
        if (this.pos.isNearTo(source)) {
            if (this.harvest(source) == OK) {
                this.memory.isThere = true;
                this.room.visual.text(source.energy + "/" + source.ticksToRegeneration, source.pos.x + 1, source.pos.y, {
                    color: 'white',
                    align: LEFT,
                    font: 0.6,
                    strokeWidth: 0.75
                });
            }
        } else {
            this.moveTo(source);
        }

        return true;
    };

    Creep.prototype.countStop = function() {
        this.memory.notThere = true;
    };
    Creep.prototype.countReset = function() {
        this.memory.notThere = false;
        this.memory.distance = 0;
    };

    Creep.prototype.dropEverything = function() {
        for (var e in this.carry) {
            this.drop(e);
            return;
        }
    };
    Creep.prototype.smartDismantle = function() {
        //     this.say('sDismale');
        if (this.getActiveBodyparts(WORK) === 0) {
            return false;
        }
        var target = Game.getObjectById(this.partyFlag.memory.target);
        if (target !== null) {
            if (this.pos.isNearTo(target)) {

                this.dismantle(target);
                return true;
            }
        }
        var bads = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        bads = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL;
        });
        if (bads.length > 0) {
            this.dismantle(bads[0]);
            return true;
        }
    };

    Creep.prototype.smartRangedAttack = function() {
        // No moving. 
        //        this.say('SRanged');
        var hurtz;
        hurtz = this.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        hurtz = _.filter(hurtz, function(object) {
            return object.owner.username !== 'likeafox' && !object.pos.lookForStructure(STRUCTURE_RAMPART);
        });
        if (hurtz.length > 0) {
            var clost = this.pos.findClosestByRange(hurtz);
            this.rangedAttack(clost);
            this.say('🔫' + hurtz.length, true);
            return;
        }

        var bads = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
        bads = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL && !o.pos.lookForStructure(STRUCTURE_RAMPART);
        });
        if (bads.length > 0) {
            let az = this.pos.findClosestByRange(bads);
            if (az.pos.isNearTo(this) && az.structureType !== STRUCTURE_WALL && az.structureType !== STRUCTURE_ROAD) {
                this.rangedMassAttack();
            } else {
                this.rangedAttack(az);
            }
            return true;
        }

        var target = Game.getObjectById(this.partyFlag.memory.target);
        if (target !== null) {
            if (this.pos.isNearTo(target) && target.structureType !== STRUCTURE_WALL && target.structureType !== STRUCTURE_ROAD) {
                this.rangedMassAttack();
                return true;
            } else if (this.pos.inRangeTo(target, 3)) {
                this.rangedAttack(target);
                return true;
            }
        }

    };
    Creep.prototype.smartAttack = function() {
        // No moving. 
        //        this.say('SAttack');
        if (this.getActiveBodyparts(ATTACK) === 0) {
            return false;
        }

        var bads = this.pos.findInRange(FIND_HOSTILE_CREEPS, 1);
        bads = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username); // && !o.pos.lookForStructure(STRUCTURE_RAMPART);
        });
        //      this.say(bads.length + "x");
        if (bads.length > 0) {
            this.attack(bads[0]);
            return true;
        }

        target = Game.getObjectById(this.partyFlag.memory.target);
        if (target !== null) {
            if (this.pos.isNearTo(target)) {
                this.attack(target);
                return true;
            }
        }

        bads = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        bads = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL;
        });
        if (bads.length > 0) {
            this.attack(bads[0]);
            return true;
        }
    };
    Creep.prototype.smartCloseHeal = function() {
        var heals = this.getActiveBodyparts(HEAL);
        if (heals < 2 && heals === 0) {
            return false;
        }
        this.say('CloseHeal');
        var hurtz;

        hurtz = this.pos.findInRange(FIND_CREEPS, 1);

        hurtz = _.filter(hurtz, function(object) {
            return object.hits < object.hitsMax && (object.owner.username == 'likeafox');
        });
        if (hurtz.length > 0) {
            // Heals others
            let tgt = _.min(hurtz, c => c.hits);
            if (this.pos.isNearTo(tgt)) {
                this.heal(tgt);
            }
            this.memory.reHealID = tgt.id;
        }
        if (this.hits !== this.hitsMax) {
            this.heal(this);
            // Does self healing
            this.memory.reHealID = this.id;
        } else {
            // Echo Healing.
            let tgt = Game.getObjectById(this.memory.reHealID);
            if (tgt === null) {
                this.heal(this);
            } else {
                if (this.pos.isNearTo(tgt)) {
                    this.heal(tgt);
                }
            }
            return true;
        }
        return false;
    };

    Creep.prototype.smartHeal = function() {
        // No moving.
        // This returns true if it's a ranged heal and false if
        this.say('SHeal');
        if (this.getActiveBodyparts(HEAL) < 2) {
            return false;
        }


        var hurtz;
        var ranged = this.getActiveBodyparts(RANGED_ATTACK);

        if (this.hits !== this.hitsMax) {
            this.heal(this);
            // Does self healing
            this.memory.reHealID = this.id;
            return true;
        }

        hurtz = this.pos.findInRange(FIND_CREEPS, 3);

        hurtz = _.filter(hurtz, function(object) {
            return object.hits < object.hitsMax && (object.owner.username == 'likeafox');
        });
        if (hurtz.length > 0) {
            // Heals others
            let tgt = _.min(hurtz, c => c.hits);
            if (!this.pos.isNearTo(tgt)) {
                this.rangedHeal(tgt);
                this.room.visual.line(this.pos, tgt.pos);
            } else {
                this.heal(tgt);
            }
            this.memory.reHealID = tgt.id;
        } else {
            if (this.memory.role === 'guard') return false;
            // Echo Healing.
            let tgt = Game.getObjectById(this.memory.reHealID);
            if (tgt === null) {
                this.heal(this);
            } else {
                if (!this.pos.isNearTo(tgt)) {
                    this.rangedHeal(tgt);
                } else {
                    this.heal(tgt);
                }
            }
            return true;
        }
        return false;
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

        if (hurtz.length > 0) {
            var hurted = _.min(hurtz, a => a.hits);
            if (!this.pos.isNearTo(hurted)) {
                this.rangedHeal(hurted);
                this.room.visual.line(this.pos, hurted.pos);
                this.moveTo(hurted, { maxOpts: 100 });
            } else {
                this.heal(hurted);
            }
            this.memory.reHealID = hurted.id;
/*            if (this.memory.role == 'healer' && this.memory.partner === undefined && hurted.memory.role == 'fighter' && hurted.memory.party === this.memory.party) {
                this.memory.partner = hurted.id;
                hurted.memory.partner = this.id;
            }*/
            return true;
        } else {
            let tgt = Game.getObjectById(this.memory.reHealID);
            if (!this.pos.isNearTo(tgt)) {
                this.rangedHeal(tgt);
                this.moveTo(tgt, { maxOpts: 100 });
            } else {
                this.heal(tgt);
            }
        }
        return false;
    };

    Creep.prototype.selfHeal = function() {
        if (this.getActiveBodyparts(HEAL) === 0) {
            return false;
        }
        return this.heal(this);
        //        if (this.hits == this.hitsMax) return true;
        //        return true;
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
    Creep.prototype.moveToTransfer = function(target, resource, options) {
        if (target === undefined || target === null) { return false; }
        if (this.carry[resource] === undefined || this.carry[resource] === 0) return false;

        if (options === undefined) options = {
            reusePath: 10,
        };
        if (this.pos.isNearTo(target)) {
            return this.transfer(target, resource);
        } else {
            return this.moveTo(target, options);
        }
        //        return true;
    };
    Creep.prototype.moveToWithdraw = function(target, resource, amount, options) {
        if (target === undefined || target === null || target.store === undefined) {
            return false;
        }
        //        if(target.store[resource] === undefined || target.store[resource] === 0 ) return false;
        if (options === undefined) options = {
            reusePath: 10,
        };
        if (this.pos.isNearTo(target)) {
            this.withdraw(target, resource, amount);
        } else {
            this.moveTo(target, options);
        }
        return true;
    };

    /*    Creep.prototype.killBase = function(options) {
            //        if (this.hits !== this.hitsMax) return false;

            if (this.room.controller !== undefined && this.room.controller.owner !== undefined && _.contains(fox.friends, this.room.controller.owner.username)) {
                return;
            }

            var target = Game.getObjectById(this.partyFlag.memory.target);
            if (target !== null) {
                if (this.pos.isNearTo(target)) {
                    this.attack(target);
                    return;
                } else {
                    this.moveTo(target);
                    let bads = this.pos.findInRange(FIND_STRUCTURES, 1);
                    if (bads.length > 0) {
                        this.attack(bads[0]);
                    }
                    return;
                }
                //            var font = { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5, align: LEFT, backgroundColor: '#0F0F0F' };
                //           this.room.visual.text(target.hits, this.pos.x + 1.5, this.pos.y, font);
            }

            if (this.room.controller !== undefined && this.room.controller.owner !== undefined &&

                _.contains(fox.friends, this.room.controller.owner.username)) return false;
            /*        if (this.memory.role == 'demolisher') {

                    } 
            var struc = this.room.find(FIND_STRUCTURES);

            var site = this.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
            site = _.filter(site, function(o) {
                return !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.progress > 2000;
            });
            if (site.length > 0) {
                var zzz = this.pos.findClosestByRange(site);
                this.moveTo(zzz);
                return;
            }


            if (this.memory.targetID === undefined) {
                if (this.room.controller === undefined) {
                    let test2 = _.filter(struc, function(o) {
                        return o.structureType === STRUCTURE_WALL && o.structureType === STRUCTURE_ROAD && o.structureType === STRUCTURE_CONTAINER;
                    });

                    if (test2.length !== 0) {
                        this.memory.targetID = this.pos.findClosestByRange(test2).id;
                    }
                } else if (this.room.controller !== undefined && this.room.controller.owner === 'undefined') {
                    if (this.room.storage !== undefined && this.room.storage.pos.lookForStructure(STRUCTURE_RAMPART)) {
                        this.memory.targetID = this.room.storage.id;
                    } else if (this.room.terminal !== undefined && this.room.terminal.pos.lookForStructure(STRUCTURE_RAMPART)) {
                        this.memory.targetID = this.room.terminal.id;
                    }
                } else if (this.room.controller !== undefined) {
                    if (1 == 2 && this.room !== undefined && this.room.terminal !== undefined && this.room.terminal.pos.lookForStructure(STRUCTURE_RAMPART)) {
                        //                    this.memory.targetID = this.room.terminal.id;
                        var test2z = _.filter(struc, function(o) {
                            return (!o.pos.lookForStructure(STRUCTURE_TERMINAL) && o.structureType == STRUCTURE_RAMPART);
                        }); // This is something is not on a rampart
                        if (test2z.length > 0) {
                            this.memory.targetID = test2z[0].id;
                        }
                    } else {


                        var filter = [STRUCTURE_WALL, STRUCTURE_ROAD, STRUCTURE_CONTROLLER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL];
                        var test2 = _.filter(struc, function(o) {
                            return !o.pos.lookForStructure(STRUCTURE_RAMPART) && !_.contains(filter, o.structureType);
                        }); // This is something is not on a rampart

                        if (test2.length !== 0) {
                            this.memory.targetID = this.pos.findClosestByRange(test2).id;
                        } else {
                            filter = [STRUCTURE_WALL, STRUCTURE_CONTROLLER, STRUCTURE_CONTAINER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL];
                            var test = _.filter(struc, function(o) {
                                return !o.pos.lookForStructure(STRUCTURE_RAMPART) && !_.contains(filter, o.structureType);
                            });
                            if (test.length !== 0) {
                                this.memory.targetID = this.pos.findClosestByRange(test).id;
                            } else {
                                filter = [STRUCTURE_WALL, STRUCTURE_CONTROLLER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL];
                                bads = _.filter(struc, function(o) {
                                    return !_.contains(filter, o.structureType);
                                }); // these are the ramparts
                                if (bads.length > 0) {
                                    this.memory.targetID = this.pos.findClosestByRange(bads).id;
                                } else {
                                    filter = [STRUCTURE_CONTROLLER, STRUCTURE_STORAGE, STRUCTURE_TERMINAL];
                                    bads = _.filter(struc, function(o) {
                                        return !_.contains(filter, o.structureType);
                                    }); // these are the ramparts
                                    if (bads.length > 0) {
                                        this.memory.targetID = this.pos.findClosestByRange(bads).id;
                                    }
                                }
                            }
                        }
                    }

                } else {
                    var tester2 = _.filter(this.room.find(FIND_STRUCTURES), function(o) {
                        return o.structureType === STRUCTURE_ROAD && o.structureType === STRUCTURE_CONTAINER;
                    }); // This is something is not on a rampart

                    if (tester2.length !== 0) {
                        this.memory.targetID = tester2[0].id;
                    }
                }



            }
            close = Game.getObjectById(this.memory.targetID);
            //    this.say('blah'+this.memory.targetID);

            if (close !== null) {
                if (this.getActiveBodyparts(ATTACK) > 0) {
                    if (this.pos.isNearTo(close)) {
                        this.attack(close);
                    } else {
                        this.moveTo(close);
                    }
                    return true;

                } else if (this.getActiveBodyparts(RANGED_ATTACK) > 0) {
                    if (this.pos.inRangeTo(close, 3)) {
                        this.rangedAttack(close);
                    } else {
                        this.moveTo(close);
                    }
                    return true;
                } else {
                    if (this.pos.isNearTo(close)) {
                        this.dismantle(close);
                    } else {
                        this.moveTo(close);
                    }
                    return true;
                }
            } else {
                this.memory.targetID = undefined;
            }
            return false;
        };*/
    /*
        Creep.prototype.dragHealer = function(options) {
            if (this.memory.healerID !== undefined) {
                heal = Game.getObjectById(this.memory.healerID);
                if (this.memory.healerID === null) {
                    this.memory.healerID = undefined;
                } else {
                    this.move(heal.pos.getDirectionTo(this), options);
                }
            }
        };*/

    Creep.prototype.runFrom = function(badguy, options) {

        if (_.isArray(badguy)) {
            let target = this.pos.findClosestByRange(badguy);
            badguy = target;
        }


        //        var result = PathFinder.search(this.pos, { pos: badguy.pos, range: 3 }, { flee: true });

        //this.move(this.pos.getDirectionTo(result.path[0]))
        //        this.move(this.pos.getDirectionTo(result.path[0]));
        var direction = this.pos.getDirectionTo(badguy);
        direction = direction + 4;
        if (direction > 8)
            direction = direction - 8;
        var moveStatus = this.move(direction, options);
        this.say('><', true);

    };
    /*
        Creep.prototype.runFrom = function(badguy, options) {

            if (_.isArray(badguy)) {
                let target = this.pos.findClosestByRange(badguy);
                badguy = target;
            }


            //        var result = PathFinder.search(this.pos, { pos: badguy.pos, range: 3 }, { flee: true });

            //this.move(this.pos.getDirectionTo(result.path[0]))
            //        this.move(this.pos.getDirectionTo(result.path[0]));
            var direction = this.pos.getDirectionTo(badguy);
            direction = direction + 4;
            if (direction > 8)
                direction = direction - 8;
            var moveStatus = this.move(direction, options);
            this.memory.cachePath = undefined;
            this.say('><', true);
        };*/

    /*    Spawn.prototype.deadCheck = function() {
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


            if (this.room.memory.roomFailure > 10000) {
                let body = [MOVE, CARRY, CARRY, MOVE];
                let name = 'Emergcy';
                let mem = {
                    role: 'first',
                    home: this.room.name,
                    parent: this.id,
                    level: 1
                };
                let zz = this.spawnCreep(body, name, mem);
                if (zz === 0) this.room.memory.roomFailure = -1500;

            }

            // If spawns haven't spawn in a while
            // if creeps are less than 5
            // spawn.memory.totalCreep


        }; */

    //    var fox = require('foxGlobals');
    Creep.prototype.sing = function(lyrics, public) {
        var word = _.indexOf(lyrics, this.saying) + 1;
        this.say(lyrics[word >= lyrics.length ? 0 : word], public);
        //        }
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

        if (this.partyFlag !== undefined && this.partyFlag.pos.roomName === this.roomName) {
            if (this.partyFlag.memory.prohibitDirection === undefined) {
                this.partyFlag.memory.prohibitDirection = {
                    top: true,
                    right: true,
                    left: true,
                    bottom: true,
                };
            }
        }

        if (this.partyFlag.memory.prohibitDirection !== undefined) {
            Exits = [];
            if (this.partyFlag.memory.prohibitDirection.bottom) {
                Exits.push(FIND_EXIT_BOTTOM);
            }
            if (this.partyFlag.memory.prohibitDirection.right) {
                Exits.push(FIND_EXIT_RIGHT);

            }
            if (this.partyFlag.memory.prohibitDirection.left) {
                Exits.push(FIND_EXIT_LEFT);

            }
            if (this.partyFlag.memory.prohibitDirection.top) {
                Exits.push(FIND_EXIT_TOP);
            }
        }
        /*
                switch (this.roomName) {
                    case "W58S29":
                        Exits = [
                            FIND_EXIT_RIGHT,
                            FIND_EXIT_BOTTOM,
                            FIND_EXIT_LEFT
                        ];
                        break;
                }
        */

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

    function serializePath(creep) {
        // This function will take an object that is a _move.
        // and turn into an object that is passed.
        /*
destination Current Pos Path
0123 456789 0123 456789 
4345 E23S39 3100 E23S39 3001655555555555566665555555544445444444444455444
*/
        var path = creep.memory._move.path;
        if (path === undefined || path.length < 6) return;

        let currentPos = "";
        var stringPosY = creep.pos.y.toString();
        var stringPosX = creep.pos.x.toString();
        if (stringPosX[1] === undefined) {
            // Means that it's just 1 entry.
            currentPos += 0;
            currentPos += stringPosX[0];

        } else {
            currentPos += stringPosX[0];
            currentPos += stringPosX[1];
        }

        if (stringPosY[1] === undefined) {
            // Means that it's just 1 entry.
            currentPos += 0;
            currentPos += stringPosY[0];

        } else {
            currentPos += stringPosY[0];
            currentPos += stringPosY[1];
        }
        currentPos += creep.pos.roomName;
        // then it needs to calcuate teh direction between current pos and the pos

        var move = creep.memory._move;
        var dest = "" + (move.dest.x < 10 ? "0" + move.dest.x : move.dest.x) +
            (move.dest.y < 10 ? "0" + move.dest.y : move.dest.y) + move.dest.room;


        //        console.log('Seralized Path', dest, currentPos, path);

        return dest + currentPos + path;
    }

    function swapTarget(creep) {
        // Boolean return - 
        // if it's true then there is a target and move?
        // if it's false then there is not a target and move?

        if ((creep.memory._move === undefined || creep.memory._move.path === undefined) && creep.memory.cachePath === undefined) {
            return;
        }

        if (creep.memory.swapTargetID !== undefined) {
            var oldSwapper = Game.getObjectById(creep.memory.swapTargetID);
            if (oldSwapper !== null && creep.pos.isNearTo(oldSwapper)) {
                oldSwapper.move(oldSwapper.pos.getDirectionTo(creep));
                oldSwapper.say('♨');
            }
            creep.memory.swapTargetID = undefined;
        }
        var direction;

        if (creep.memory.cachePath !== undefined) {
            direction = creep.memory.cachePath[4];
        } else if (creep.memory._move.path !== undefined) {
            direction = creep.memory._move.path[4];
        }
        if (direction === undefined) { return; }

        var looking = creep.room.lookForAt(LOOK_CREEPS, getFormationPos(creep, direction))[0];

        if (looking === undefined) { return; }

        // The blocked Creep moves to 

        if (looking.memory === undefined ||
            (looking.memory.sleeping !== undefined && looking.memory.sleeping > 0) ||
            (looking.memory._move !== undefined && looking.memory.cachePath !== undefined && looking.fatigue === 0) ||
            (looking.memory.stuckCount !== undefined && looking.memory.stuckCount > 1)) {
            looking.move(looking.pos.getDirectionTo(creep));
            looking.say('✔');
            creep.memory.swapTargetID = looking.id;
            creep.say('mv!');
        }

        return;

    }

    function simpleMatch(rawData, currentPos, goalPos, i) {
        /*
        of course we need to make sure the first match is - currentroomname !== goalPos
destination Current Pos Nx Pos  Path 
0123 456789 0123 456789 01 23   4
4345 E23S39 3100 E23S39 30 01   655555555555566665555555544445444444444455444
xxxx yyyyyy yyyy yyyyyy XX yy
*/
        var test = rawData;

        if (test[i + 4] !== goalPos.roomName[0]) return false;
        if (test[i + 5] !== goalPos.roomName[1]) return false;
        if (test[i + 6] !== goalPos.roomName[2]) return false;
        if (test[i + 7] !== goalPos.roomName[3]) return false;
        if (test[i + 8] !== goalPos.roomName[4]) return false;
        if (test[i + 9] !== goalPos.roomName[5]) return false;
        if (test[i + 14] !== currentPos.roomName[0]) return false;
        if (test[i + 15] !== currentPos.roomName[1]) return false;
        if (test[i + 16] !== currentPos.roomName[2]) return false;
        if (test[i + 17] !== currentPos.roomName[3]) return false;
        if (test[i + 18] !== currentPos.roomName[4]) return false;
        if (test[i + 19] !== currentPos.roomName[5]) return false;

        if (currentPos.x < 10) {
            if (parseInt(test[i + 10]) !== 0) return false;
            if (parseInt(test[i + 11]) !== currentPos.x) return false;
        } else {
            if (parseInt(test[i + 10] + test[i + 11]) !== currentPos.x) return false;
        }
        if (currentPos.y < 10) {
            if (parseInt(test[i + 12]) !== 0) return false;
            if (parseInt(test[i + 13]) !== currentPos.y) return false;
        } else {
            if (parseInt(test[i + 12] + test[i + 13]) !== currentPos.y) return false;
        }
        if (goalPos.x < 10) {
            if (parseInt(test[i + 0]) !== 0) return false;
            if (parseInt(test[i + 1]) !== goalPos.x) return false;
        } else {
            if (parseInt(test[i + 0] + test[i + 1]) !== goalPos.x) return false;
        }
        if (goalPos.y < 10) {
            if (parseInt(test[i + 2]) !== 0) return false;
            if (parseInt(test[i + 3]) !== goalPos.y) return false;
        } else {
            if (parseInt(test[i + 2] + test[i + 3]) !== goalPos.y) return false;
        }

        return true;
    }

    function findSerializedPath(rawData, currentPos, goalPos) {
        var test = rawData;
        if (test === undefined) return;
        for (var i = 0; i < test.length; i++) {
            if (test[i] == '+' && i !== test.length - 1) {
                i++;
                var goal = stringToRoomPos(rawData.substring(i + 0, i + 10));
                var current = stringToRoomPos(rawData.substring(i + 10, i + 20));
                // So current pos, and same room while not in the goal room.
                // So if the goalRoom doesn't equal currentRoom, and goalRoom == goalPos.roomName 
                if (current.isEqualTo(currentPos) && goal.isEqualTo(goalPos)) {
                    //simpleMatch(rawData, currentPos, goalPos, i),

                    for (var e = i + 19; e++; e < test.length) {
                        if (test[e] == '+') {
                            var tt = rawData.substring(i, e);
                            return tt;
                        }
                    }
                } else {
                    i += 20;
                }
            }
        }
    }

    function getSerializedPath(rawData) {

        var destRoomX = parseInt(rawData[5] + rawData[6]);
        var destRoomY = parseInt(rawData[8] + rawData[9]);
        var goalRoom = rawData[4] + destRoomX + rawData[7] + destRoomY;
        var currentRoomX = parseInt(rawData[11] + rawData[12]);
        var currentRoomY = parseInt(rawData[14] + rawData[15]);
        var currentRoom = rawData[10] + currentRoomX + rawData[13] + currentRoomY;

        var move = {
            dest: {
                x: parseInt(rawData[0] + rawData[1]),
                y: parseInt(rawData[2] + rawData[3]),
                room: goalRoom
            },
            room: currentRoom,
            path: rawData.substring(20, rawData.length)
        };
        return move;
        // Taking a
    }

    function nearContain(creep) {
        if (creep.memory.role !== 'transport') return false;
        if (creep.memory.workContain === undefined) return false;
        if (creep.memory.empty) return false;
        if (!creep.memory.goHome) return false;
        var zz = Game.getObjectById(creep.memory.workContain);
        if (zz === null) return false;
        if (!creep.pos.isNearTo(zz)) {
            return false;
        }
        if (creep.pos.isEqualTo(zz)) {
            return false;
        }
        var standingSpot = creep.room.lookAt(creep.pos.x, creep.pos.y);
        for (var ez in standingSpot) {
            if (standingSpot[ez].type == 'structure' && standingSpot[ez].structure.structureType == STRUCTURE_ROAD) {
                return true;
            }
        }
    }
    /*
        Creep.prototype.withdrawing = function(target, resource, amount) {

            //    if(Game.shard.name === 'shard0'){
            //          return this.withdraw(target, resource, amount);
            //      }
            if (target.structureType !== STRUCTURE_LINK && target.store !== undefined) {
                if (target.store[resource] !== undefined) {
                    return this.withdraw(target, resource, amount);
                }
            } else {
                return this.withdraw(target, resource, amount);
            }
            return -6;

        };*/

    Creep.prototype.cleanMe = function() {
        // What this function does is clean up memory and make it less.
        if (this.ticksToLive < 1400) {
            this.memory.needBoost = undefined;
        }
        this.memory._move = undefined;
        this.memory.oldCachePath = undefined;
        this.memory.position = undefined;
        this.memory.stuckCount = undefined;
        this.memory.cachePath = undefined;
        this.memory.closeRoadBuildTimer = undefined;
        this.memory.onRoad = undefined;

    };

    var getExitPos = function(creep) {

        if (creep.memory._move && creep.memory._move.path.length === 0) {
            creep.memory._move = undefined;
        }
        let goToPos; // = new RoomPosition(25, 25, room_name);
        let leastRange = 50;

        if (creep.pos.x < 2 || creep.pos.x > 48 || creep.pos.y < 2 || creep.pos.y > 48)
            creep.memory.inter_room_exitTarget = creep.memory.inter_room_exit[creep.memory.inter_room_path.indexOf(creep.memory.inter_room_target)];

        if (creep.memory.inter_room_exitTarget !== undefined) {
            let room = creep.room;
            room.find(creep.memory.inter_room_exitTarget).forEach(
                function(pos) {
                    let rng = pos.getRangeTo(creep);
                    if (rng <= leastRange) {
                        leastRange = rng;
                        goToPos = new RoomPosition(pos.x, pos.y, pos.roomName);
                    }
                }
            );
        }

        return goToPos;
    };


    // Robust path finding, for traveling large distances
    // Designed for long distance, you do need a start_room for your journey.
    // 
    Creep.prototype.tuskenTo = function(target, start_room, move_opts, map_opts) {
        // NOTE: start_room is currently >ALWAYS< creep.room.name
        if (move_opts === undefined) move_opts = {};
        _.defaults(move_opts, {
            useSKPathing: true,
            reusePath: 50,
            maxRooms: 1,
            segment: false,
            simpleExit: false,
        });

        let status = null;
        let end_room = target.roomName !== undefined ? target.roomName : target.pos.roomName;

        if ((this.memory.start_room !== undefined && this.memory.start_room !== start_room) ||
            (this.memory.inter_room_path !== undefined && this.memory.inter_room_path[this.memory.inter_room_path.length - 1] !== end_room)) {
            /* The last room in the inter_room_path is not the same as the end_room --> We probably didn't wipe the this's memory properly */
            // Or different rooms that you started off.
            this.memory.inter_room_path = undefined;
            this.memory.inter_room_target = undefined;
            this.memory.inter_room_exit = undefined;
            this.memory.inter_room_exitTarget = undefined;
        }

        this.memory.start_room = start_room;

        if (this.memory.inter_room_path === undefined || this.memory.inter_room_exit === undefined) {
            // HERE is the magic, here is we get the route of rooms, a bit smarter or not than
            // Normal pathfinding, but at least it's controlled.
            let ret = getWorldMapPath(start_room, end_room, map_opts);
            let inter_room_path = [];
            let inter_room_exit = [];
            for (let i in ret) {
                inter_room_path.push(ret[i].room);
                inter_room_exit.push(ret[i].exit);
            }
            this.memory.inter_room_path = inter_room_path;
            this.memory.inter_room_exit = inter_room_exit;

            if (this.room.name === start_room) {
                this.memory.inter_room_target = inter_room_path[0];
                this.memory.inter_room_exitTarget = inter_room_exit[0];
            } else {
                let index = this.memory.inter_room_path.indexOf(this.room.name);
                this.memory.inter_room_target = this.memory.inter_room_path[index + 1];
                this.memory.inter_room_exitTarget = this.memory.inter_room_exit[index + 1];
            }

        }

        if (this.room.name == start_room) {
            this.say('StartPath');
            if (move_opts.simpleExit || move_opts.segment) {
                if (this.room.memory.exitPoints === undefined) {
                    this.room.memory.exitPoints = {};
                }

                if (this.room.memory.exitPoints[this.memory.inter_room_exitTarget] === undefined) {
                    let room = this.room;
                    let leastRange = 50;
                    var least;
                    var crp = this;
                    room.find(this.memory.inter_room_exitTarget).forEach(
                        function(posed) {
                            let rng = posed.getRangeTo(crp);
                            if (rng < leastRange) {
                                leastRange = rng;
                                least = new RoomPosition(posed.x, posed.y, posed.roomName);
                            }
                        }
                    );
                    this.room.memory.exitPoints[this.memory.inter_room_exitTarget] = least;
                }

                if (this.room.memory.exitPoints[this.memory.inter_room_exitTarget] !== undefined) {
                    var newz = new RoomPosition(this.room.memory.exitPoints[this.memory.inter_room_exitTarget].x, this.room.memory.exitPoints[this.memory.inter_room_exitTarget].y, this.room.memory.exitPoints[this.memory.inter_room_exitTarget].roomName);
                    let zz = this.moveTo(newz); // Never needs to be segmented.
                    this.say('🚏' + zz);
                    return zz;
                }
            } else {
                this.memory.inter_room_target = this.memory.inter_room_path[0];
                this.memory.inter_room_exitTarget = this.memory.inter_room_exit[0];
                target = new RoomPosition(25, 25, this.memory.inter_room_target);
                return this.moveMe(target, move_opts);
            }
        }
        if (this.room.name == target.pos.roomName) {
            // At the target room it will be happy.
            if (!this.pos.isEqualTo(target)) {
                this.say('IsThere');
                return this.moveMe(target, move_opts); // Questionable segment use.
            }
        }

        if (!_.contains(this.memory.inter_room_path, this.room.name) && this.room.name !== start_room) {
            // This is a check to make sure the creep is on the path, if it makes a wrong move it should clear and go back to moveing to target.
            // If it is not then it should do it's own moveTo(target);
            this.memory.inter_room_exitTarget = undefined;
            this.memory.inter_room_target = undefined;
            this.say('NotPath');
            return this.moveTo(target, move_opts);
        } else if (this.memory.inter_room_exitTarget === undefined) {
            let index = this.memory.inter_room_path.indexOf(this.room.name);
            this.memory.inter_room_target = this.memory.inter_room_path[index + 1];
            this.memory.inter_room_exitTarget = this.memory.inter_room_exit[index + 1];
        }
        /*      if (this.memory.inter_room_target === undefined) {
            // We coudn't find a path!
            this.say(':+');
            return this.moveTo(target, move_opts);
        }
*/
        if (this.room.name !== this.memory.inter_room_target && move_opts.simpleExit) {
            this.say('Sexit');
            target = getExitPos(this);
        } else {
            // Get next room in the path
            let index = this.memory.inter_room_path.indexOf(this.memory.inter_room_target);
            if (index === -1 || this.memory.inter_room_target === undefined) {
                // Unable to find the next room --> remake path
                this.memory.inter_room_path = undefined;
                this.memory.inter_room_target = undefined;
                this.memory.inter_room_exit = undefined;
                this.memory.inter_room_exitTarget = undefined;

                return status;
            }
            this.memory.inter_room_target = this.memory.inter_room_path[index + 1];
            this.memory.inter_room_exitTarget = this.memory.inter_room_exit[index + 1];
            if (move_opts.simpleExit) {
                this.say('Sexit2');
                target = getExitPos(this);
            } else {
                this.say('2525');
                if (this.room.name == start_room) {
                    this.memory.inter_room_target = this.memory.inter_room_path[0];
                    this.memory.inter_room_exitTarget = this.memory.inter_room_exit[0];
                } else {
                    let index = this.memory.inter_room_path.indexOf(this.room.name);
                    if (index > -1) {
                        this.memory.inter_room_target = this.memory.inter_room_path[index + 1];
                        this.memory.inter_room_exitTarget = this.memory.inter_room_exit[index + 1];
                    }
                }
                if (this.memory.inter_room_target !== undefined)
                    target = new RoomPosition(25, 25, this.memory.inter_room_target);
            }

        }
        return this.moveMe(target, move_opts);
    };

    var segment = require('commands.toSegment');
    var rawData;

    Creep.prototype.moveMe = function(target, options, xxx) {
        //        this.say('MVMe');
        //        if (options !== undefined && options.segment) this.say('SMMe');
        if (this.fatigue > 0) {
            if (this.memory._move !== undefined)
                this.memory._move.time = this.memory._move.time + 1;
            return;
        }

        if (xxx !== undefined) {
            target = new RoomPosition(target, options, this.room.name);
            options = xxx;
        }

        if (_.isUndefined(this.memory.stuckCount)) this.memory.stuckCount = 0;

        var moveStatus;
        if (options === undefined) options = {};
        var stuck = false;

        if (this.memory.position !== undefined) {
            if (_.isString(this.memory.position)) {
                var de = stringToRoomPos(this.memory.position);
                stuck = this.pos.isEqualTo(de);
                if (de === undefined) {
                    this.say(this.memory.position);
                }
            } else {
                stuck = this.pos.isEqualTo(this.memory.position.x, this.memory.position.y);
            }
        }
        let zze; // = roomPosToString(this.pos );
        if (zze !== undefined) {
            this.memory.position = zze;
        } else {
            this.memory.position = this.pos;
        }

        if (stuck) {
            this.memory.stuckCount++;
            if (this.memory.stuckCount > 5)
                this.memory.stuckCount = 5;
        } else {
            if (this.memory.stuckCount > 0) {
                this.memory.stuckCount--;
            }
        }
        if (this.memory.stuckCount > 0)
            this.say('St' + this.memory.stuckCount);

        if (options.visualizePathStyle === undefined) {
            options.visualizePathStyle = {
                stroke: '#faF',
                lineStyle: 'dotted',
                strokeWidth: 0.1,
                opacity: 0.5
            };
        }

        // Here is the logic for following and stuff.
        if (this.memory.followerID !== undefined && this.memory.leaderID !== undefined) {
            // This is a guy in the middle
            let led = Game.getObjectById(this.memory.leaderID);
            let fol = Game.getObjectById(this.memory.followerID);
            if (led !== null && fol !== null) {
                if (!this.pos.isNearTo(fol) && !this.isAtEdge) {
                    // If not near the follower then don't move. 
                    this.say('w4F');
                    return ERR_NO_PATH;
                }
                if (this.pos.isNearTo(led)) {
                    return this.move(this.pos.getDirectionTo(led));
                } else {
                    return this.moveTo(led, options);
                }
            }
        } else if (this.memory.followerID !== undefined) {
            // This is the leader.
            let fol = Game.getObjectById(this.memory.followerID);
            if (fol !== null) {
                if((!this.pos.isNearTo(fol) && !this.isAtEdge) || fol.fatigue > 0) {
                    // If the leader isn't near his follower, he doesn't move. 
                    this.say('w4F');
                    //this.moveTo(fol,options)
                    return ERR_NO_PATH;
                }
            } else {
                this.memory.followerID = undefined;
            }
        } else if (this.memory.leaderID !== undefined) {
            let led = Game.getObjectById(this.memory.leaderID);
            if (led !== null) {
                if (this.pos.isNearTo(led)) {
                    return this.move(this.pos.getDirectionTo(led));
                } else {
                    return this.moveTo(led, options);
                }
            } else {
                this.memory.leaderID = undefined;
            }
            // This is the last follower. 
        }

        if (this.memory.role == 'transport' || this.memory.role == 'xtransport' || this.memory.party !== undefined) {
            if (this.room.name != this.memory.home)
                options.ignoreCreeps = true;
        }
        if (options.ignoreCreeps && (this.memory.stuckCount > 0 || this.room.name == this.memory.home)) {
            swapTarget(this);
        }

        if (this.memory.stuckCount > 2) {
            options.reusePath = 5;
            options.ignoreCreeps = false;
            this.memory._move = undefined;
            this.memory.cachePath = undefined;
        }

        let status = null;
        let exit_cost = 25;
        if (options.useSKPathing || this.memory.home === 'E17S45') {
            let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(this.room.name);
            let fMod = parsed[1] % 10;
            let sMod = parsed[2] % 10;
            let isSK = !(fMod === 5 && sMod === 5) && ((fMod >= 4) && (fMod <= 6)) &&
                ((sMod >= 4) && (sMod <= 6));


            if (isSK) {
                //    this.say('😎');
                // Use special SK pathing algorithim to avoid hostile SK creeps

                if (this.memory.role === 'transport' || this.memory.role === 'miner' || this.memory.role === 'engineer') {
                    options.swampCost = 4;
                    options.costCallback = function(roomName, costMatrix) {
                        //NOTE: roomName is not the same as room_name!
                        let room = Game.rooms[roomName];
                        if (room === undefined) {
                            return costMatrix;
                        }
                        if (options.avoidExits) {
                            room.find(FIND_EXIT_TOP).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                    //                                    costMatrix.set(pos.x, pos.y+1, 1);
                                }
                            );
                            room.find(FIND_EXIT_RIGHT).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                    //                                  costMatrix.set(pos.x, pos.y-1, 1);
                                }
                            );
                            room.find(FIND_EXIT_BOTTOM).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                    //                                costMatrix.set(pos.x, pos.y-1, 1);
                                }
                            );
                            room.find(FIND_EXIT_LEFT).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                    //                              costMatrix.set(pos.x, pos.y+1, 1);
                                }
                            );
                        }
                        let aggro_radius = 4;
                        let aggro_cost = 10;
                        let n = 0;
                        let ret = null;
                        let tar_x = 0;
                        let tar_y = 0;
                        let terrain = null;


                        room.find(FIND_MINERALS).forEach(
                            function(c) {
                                n = 0;
                                ret = ulamSpiral(n);
                                while (true) {
                                    ret = ulamSpiral(n);
                                    n += 1;
                                    if (ret.sq > aggro_radius) {
                                        break;
                                    } else if (ret.sq === aggro_radius) {
                                        aggro_cost = 10;
                                    } else {
                                        aggro_cost = 10;
                                    }
                                    tar_x = c.pos.x + ret.x;
                                    tar_y = c.pos.y + ret.y;
                                    if (tar_x > 49 || tar_x < 0) {
                                        continue;
                                    } else if (tar_y > 49 || tar_y < 0) {
                                        continue;
                                    }
                                    terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    if (terrain === 'wall') {
                                        // Don't try to tunnel through game walls!
                                        costMatrix.set(tar_x, tar_y, 0xff);
                                    } else {
                                        costMatrix.set(tar_x, tar_y, aggro_cost);
                                    }
                                }
                            }
                        );
                        room.find(FIND_SOURCES).forEach(
                            function(c) {
                                n = 0;
                                ret = ulamSpiral(n);
                                while (true) {
                                    ret = ulamSpiral(n);
                                    n += 1;
                                    if (ret.sq > aggro_radius) {
                                        break;
                                    } else if (ret.sq === aggro_radius) {
                                        aggro_cost = 10;
                                    } else {
                                        aggro_cost = 10;
                                    }
                                    tar_x = c.pos.x + ret.x;
                                    tar_y = c.pos.y + ret.y;
                                    if (tar_x > 49 || tar_x < 0) {
                                        continue;
                                    } else if (tar_y > 49 || tar_y < 0) {
                                        continue;
                                    }
                                    terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    if (terrain === 'wall') {
                                        // Don't try to tunnel through game walls!
                                        costMatrix.set(tar_x, tar_y, 0xff);
                                    } else {
                                        costMatrix.set(tar_x, tar_y, aggro_cost);
                                    }
                                }
                            }
                        );
                        aggro_radius = 3;
                        room.find(FIND_STRUCTURES).forEach(
                            function(c) {
                                if (c.structureType === STRUCTURE_KEEPER_LAIR) {
                                    n = 0;
                                    ret = ulamSpiral(n);
                                    while (true) {
                                        ret = ulamSpiral(n);
                                        n += 1;
                                        if (ret.sq > aggro_radius) {
                                            break;
                                        } else if (ret.sq === aggro_radius) {
                                            aggro_cost = 10;
                                        } else {
                                            aggro_cost = 10;
                                        }
                                        tar_x = c.pos.x + ret.x;
                                        tar_y = c.pos.y + ret.y;
                                        if (tar_x > 49 || tar_x < 0) {
                                            continue;
                                        } else if (tar_y > 49 || tar_y < 0) {
                                            continue;
                                        }
                                        terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                        if (terrain === 'wall') {
                                            // Don't try to tunnel through game walls!
                                            costMatrix.set(tar_x, tar_y, 0xff);
                                        } else {
                                            costMatrix.set(tar_x, tar_y, aggro_cost);
                                        }

                                    }
                                }
                                /* else if (c.structureType === STRUCTURE_ROAD) {
                                                                   costMatrix.set(c.pos.x, c.pos.y, 1);
                                                               }*/
                            }
                        );
                        room.find(FIND_CONSTRUCTION_SITES).forEach(
                            function(c) {
                                costMatrix.set(c.pos.x, c.pos.y, 1);
                            }
                        );
                        return costMatrix;
                    };





                } else {
                    options.costCallback = function(roomName, costMatrix) {
                        //NOTE: roomName is not the same as room_name!
                        let room = Game.rooms[roomName];
                        if (!room) {
                            return costMatrix;
                        }
                        if (options.avoidExits) {
                            room.find(FIND_EXIT_TOP).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                }
                            );
                            room.find(FIND_EXIT_RIGHT).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                }
                            );
                            room.find(FIND_EXIT_BOTTOM).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                }
                            );
                            room.find(FIND_EXIT_LEFT).forEach(
                                function(pos) {
                                    costMatrix.set(pos.x, pos.y, exit_cost);
                                }
                            );
                        }
                        let aggro_radius = 4;
                        let aggro_cost = 50;
                        let n = 0;
                        let ret = null;
                        let tar_x = 0;
                        let tar_y = 0;
                        let terrain = null;
                        room.find(FIND_HOSTILE_CREEPS).forEach(
                            function(c) {
                                if (c.owner.username === 'Invader') {
                                    return;
                                }
                                n = 0;
                                ret = ulamSpiral(n);
                                while (true) {
                                    ret = ulamSpiral(n);
                                    n += 1;
                                    if (ret.sq > aggro_radius) {
                                        break;
                                    } else if (ret.sq === aggro_radius) {
                                        aggro_cost = 10;
                                    } else {
                                        aggro_cost = 10;
                                    }
                                    tar_x = c.pos.x + ret.x;
                                    tar_y = c.pos.y + ret.y;
                                    if (tar_x > 49 || tar_x < 0) {
                                        continue;
                                    } else if (tar_y > 49 || tar_y < 0) {
                                        continue;
                                    }
                                    terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    if (terrain === 'wall') {
                                        // Don't try to tunnel through game walls!
                                        costMatrix.set(tar_x, tar_y, 0xff);
                                    } else {
                                        costMatrix.set(tar_x, tar_y, aggro_cost);
                                    }
                                }
                            }
                        );


                        return costMatrix;
                    };
                }

            }
        }

        // Start of segment fun.


        if (options.segment === undefined) options.segment = false;

        if (options.segment && (this.pos.x === 1 || this.pos.x === 48 || this.pos.y === 1 || this.pos.y === 48)) {
            if (this.memory.cachePath === undefined || this.memory.cachePath.length < 10) {
                if (this.memory.party !== undefined) {
                    segment.requestPartySegmentData(this.memory.party);
                } else {
                    segment.requestRoomSegmentData(this.memory.home);
                }
            }
        }
        if (this.memory.party !== undefined && (!segment.partyToSegment(this.memory.party) || !options.segment || this.memory.stuckCount > 2)) {
            moveStatus = this.moveTo(target, options);
            if (moveStatus == OK) {
                this.memory.cachePath = undefined;
                this.memory.oldCachePath = undefined;
            }
        } else if (!segment.roomToSegment(this.memory.home) || !options.segment || this.memory.stuckCount > 2) {
            moveStatus = this.moveTo(target, options);
            if (moveStatus == OK) {
                this.memory.cachePath = undefined;
                this.memory.oldCachePath = undefined;
            }
        } else {
            // new stuff
            var doPath = false;
            var zz, test;
            let home = this.memory.home;
            if (this.memory.party !== undefined) {
                home = this.memory.party;
            }
            if (this.memory.cachePath !== undefined) { // This has been done before and gotten a path.
                if (stuck) {
                    this.memory.cachePath = this.memory.oldCachePath;
                }
                if (_.isString(this.memory.cachePath)) {
                    path = Room.deserializePath(this.memory.cachePath);
                    this.memory.oldCachePath = this.memory.cachePath;
                    moveStatus = this.moveByPath(path, options);
                    if (moveStatus == OK) {
                        path.shift();
                        this.memory._move = undefined;
                    }
                    this.memory.cachePath = Room.serializePath(path);

                    this.say('💰' + this.memory.cachePath.length, true);
                    if (this.memory.cachePath.length === 0) this.memory.cachePath = undefined;
                }
            } else if ((this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49) || nearContain(this)) {
                if (rawData === undefined) {
                    rawData = {};
                }

                if (rawData[home] === undefined || !rawData[home]) { // False rawdata needs to be refreshed
                    if (this.memory.party === undefined) {
                        rawData[home] = segment.getRawSegmentRoomData(home);
                    } else {
                        rawData[home] = segment.getRawSegmentPartyData(home);
                    }
                    //                    console.log('GRABBING SEGMENT AGAIN for ', home, this.pos, this.name);
                }

                if (target !== undefined && target.x === undefined) {
                    target = target.pos;
                }
                zz = findSerializedPath(rawData[home], this.pos, target);

                if (zz === undefined) {
                    // if we don't find the path then. 
                    options.ignoreCreeps = true;
                    doPath = true;
                } else {
                    //                    console.log(segment.roomToSegment( this.memory.home), this.memory.home, 'There is a path, C:', this.pos, "G:", target);
                    // Then we use zz to set _move as;
                    let _move = getSerializedPath(zz);
                    path = _.isString(_move.path) ? Room.deserializePath(_move.path) : _move.path;
                    moveStatus = this.moveByPath(path, options);
                    path.shift();
                    this.memory._move = undefined;

                    if (path.length > 0)
                        this.memory.cachePath = Room.serializePath(path);
                    this.say("💰" + this.memory.cachePath.length);
                }

            }
            // If no move before done,then do this move.
            if (moveStatus === undefined || moveStatus === -5) {
                this.memory.cachePath = undefined;
                moveStatus = this.moveTo(target, options);
            }
            if (doPath) {
                if (!rawData[home]) { // Fail on rawdata means that the segment will be available next tick
                } else if (rawData[home] !== undefined && this.memory._move !== undefined) {
                    test = serializePath(this);
                    if (test !== undefined) {
                        rawData[home] += test + '+';
                        if (this.memory.party === undefined) {
                            segment.setRoomSegmentData(home, rawData[home]);
                        } else {
                            segment.setPartySegmentData(home, rawData[home]);
                        }
                        //                      console.log(segment.roomToSegment(this.memory.home),this.pos, 'G', target, 'Added to', home, ' FINALSERIALIZED PATH:', test);
                    }
                }
            }

        }

        return moveStatus;
    };
};