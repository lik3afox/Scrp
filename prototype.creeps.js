module.exports = function() {

    Creep.prototype.pullTargetTo = function(pull,target,opts) {
        // Pull target 
        // So pull needs to be near this.
        // we need to stop pullling of the pull first
        // we need to get near the pull
        if(!pull){
            console.log(pull,'!!!#$$');
            return;
        }
        if(pull.fatigue > 0){
            pull.memory.needPull = true;
        }  else if(!pull.memory.needPull){
            return false;  
        } 
        if(pull.pos.isNearTo(target)) return false;
        console.log(roomLink(this.room.name),"DoiNG PUll!!");
            pull.memory.stopMoving = true;
            pull.cancelOrder('move');
        if(!this.pos.isNearTo(pull)){
            this.moveMe(pull);
            return true;
        }
        this.say('->');
        pull.say('0');
        // once we're near, we go to the target 
        pull.move(pull.pos.getDirectionTo(this));
//return creep.move(creep.pos.getDirectionTo(led));        
        // Once we're nearBy target, we pull one last time, but! we move to the target.
        if(this.pos.isNearTo(target)){
            this.move(this.pos.getDirectionTo(pull));
        } else {
        this.moveMe(target,opts);
        }
    };

    Structure.prototype.isEffected = function(effect) {
        if (!this.effects) return false;
        if (this.effects.length === 0) return false;
        if(effect !== undefined){
            for(let i in this.effects){
                if(this.effects[i].power === effect){
                    return this.effects[i];
                }
            }
        }
        return true;
    };

    PowerCreep.prototype.getStoredOps = function(amount){
        if(this.room.storage && this.room.storage[RESOURCE_OPS] >= amount){
        
            return this.moveToWithdraw(this.room.storage,'ops',amount);
        }
        if(this.room.terminal && this.room.terminal[RESOURCE_OPS] >= amount){
            return this.moveToWithdraw(this.room.terminal,'ops',amount);
        }
    };
    PowerCreep.prototype.getActiveBodyparts = function(amount){
        return 0;
    };


    PowerCreep.prototype.stats = function(stat) {
        // What does the stats function do?
        // Does it return the value it will increase? or does it return how much it will be used?
        if (this.memory.stats === undefined) {
            this.memory.stats = {};
        }
        if (this.memory.stats[stat] === undefined) {
            var ab;
            switch (stat) {
                case 'shield':
                    if (!this.powers[PWR_OPERATE_EXTENSION]) {
                        this.memory.stats[stat] = 0;
                        return this.memory.stats[stat];
                    }
                    this.memory.stats[stat] = this.powers[PWR_OPERATE_EXTENSION].level * 5000;
                    return this.memory.stats[stat];
                case 'extension':
                    if (!this.powers[PWR_OPERATE_EXTENSION]) {
                        this.memory.stats[stat] = 0;
                        return this.memory.stats[stat];
                    }
                    let lvl = this.powers[PWR_OPERATE_EXTENSION].level * 0.20;
                    let extensionEnergy = this.room.energyCapacityAvailable - 900; //900 is for spawns, yes this isn't perfect.
                    this.memory.stats[stat] = Math.floor(lvl * extensionEnergy);
                    return this.memory.stats[stat];
                case 'carry':
                    this.memory.stats[stat] = this.carryCapacity;
                    return this.memory.stats[stat];
                default:
                    //                    console.log('requested stat not existant');
                    return 0;
            }
        } else {
            return this.memory.stats[stat];
        }
    };
    Creep.prototype.moveMe = function(target, options, xxx) {
        return moveMe(this, target, options, xxx);
    };
    PowerCreep.prototype.moveMe = function(target, options, xxx) {
        return moveMe(this, target, options, xxx);
    };
    Object.defineProperty(PowerCreep.prototype, "carryAvailable", {
        configurable: true,
        get: function() {
            return this.carryCapacity - getCarryTotal(this);
        },
    });
    Object.defineProperty(Creep.prototype, "carryAvailable", {
        configurable: true,
        get: function() {
            return this.carryCapacity - getCarryTotal(this);
        },
    });

    Object.defineProperty(PowerCreep.prototype, "carryTotal", {
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
    Object.defineProperty(Creep.prototype, "carryTotal", {
        configurable: true,
        get: function() {
            return getCarryTotal(this);
        },
    });
    Object.defineProperty(PowerCreep.prototype, "fatigue", {
        configurable: true,
        get: function() {
            return 0;
        },
    });

    Object.defineProperty(PowerCreep.prototype, "flag", {
        configurable: true,
        get: function() {
            return Game.flags[this.name];
        },
    });
    Object.defineProperty(PowerCreep.prototype, "partyFlag", {
        configurable: true,
        get: function() {
            return Game.flags[this.name];
        },
    });

    function getCarryTotal(screep) {
        if (screep._carryTotal_sum !== undefined) {
            return screep._carryTotal_sum;
        } else {
            screep._carryTotal_sum = _.sum(screep.carry);
            return screep._carryTotal_sum;
        }
    }



    Object.defineProperty(PowerCreep.prototype, "carrying", {
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
    PowerCreep.prototype.moveToTransfer = function(target, resource, options) {
        if (target === undefined || target === null) { return false; }
        if (this.carry[resource] === undefined || this.carry[resource] === 0) return false;

        if (options === undefined) options = {
            reusePath: 25,
            ignoreCreeps: true,
            range: 1,
            visualizePathStyle: {
                stroke: '#faF',
                strokeWidth: 0.5,
                opacity: 0.25,
                color: '#FF9911'
            },

        };
        if (this.pos.isNearTo(target)) {
            return this.transfer(target, resource);
        } else {
            return this.moveMe(target, options);
        }
        //        return true;
    };


    Object.defineProperty(Creep.prototype, "atFlagRoom", {
        configurable: true,
        get: function() {
            if (this.partyFlag === undefined) return false;
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
    /*
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
        });*/


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
            return this.owner.username === 'Invader' || this.owner.username === 'Source Keeper';
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
    Object.defineProperty(Structure.prototype, "full", {
        configurable: true,
        get: function() {
            return this.total === this.storeCapacity;
        },
    });
    Object.defineProperty(Structure.prototype, "nearFull", {
        configurable: true,
        get: function() {
            return this.total > this.storeCapacity - 5000;
        },
    });
    Object.defineProperty(Structure.prototype, "almostFull", {
        configurable: true,
        get: function() {
            return this.total > this.storeCapacity - 10000;
        },
    });
    Object.defineProperty(Structure.prototype, "closeToFull", {
        configurable: true,
        get: function() {
            return this.total > this.storeCapacity - 100000;
        },
    });

    Object.defineProperty(Structure.prototype, "storing", {
        configurable: true,
        get: function() {
            for (var i in this.store) {
                if (this.store[i] > 0) return i;
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

    Creep.prototype.createTrain = function() {
        if (this.room.name === 'E20S50') return;
        //        if(this.room.name === 'E20S50') return;
        /*Enter Room
        At Edge
        Look
        for Leader
        Not found - set self as leader.
        Found - set leaderID as follower and give leader followerID. -
            If leaderID > 1 then -
            find one with out followerID
        */
        if (!this.isAtEdge || this.memory.leaderID || this.memory.followerID) {
            // So if it has a leaderID then it doesn't need this.
            return false;
        }
        let creep = this;
        let otherPMs = _.filter(this.room.find(FIND_MY_CREEPS), function(o) {
            if (creep.memory.death) {
                return o.memory && creep.memory && o.memory.parent === creep.memory.parent && o.id !== creep.id && o.memory.death;
            } else if (creep.carryTotal === 0) {
                return o.memory && creep.memory && o.memory.party === creep.memory.party && o.memory.role === creep.memory.role && o.id !== creep.id && o.carryTotal === 0;
            } else {
                return o.memory && creep.memory && o.memory.party === creep.memory.party && o.memory.role === creep.memory.role && o.id !== creep.id;
            }
        });
        if (otherPMs === 0 || otherPMs === 1) {
            return false;
        }

        // Go through and we need to find.
        // this w/ FollowerID == leader
        // this w/ FollowerID && leaderID == middle
        // this w/ leaderID == kaboose; 
        // this w/o follower or leaderID == nothing set yet.
        // So this that doesn't have leaderID needs to find the one with/o a followerID
        //        console.log("CReATE TRAIN", roomLink(this.room.name), this.room.find(FIND_MY_CREEPS), otherPMs.length);
        for (let i in otherPMs) {
            // first we need to find the PM that doesn't have followerID;
            /*if (otherPMs[i].memory.followerID) {
            this.say("leader");
            }
            if (otherPMs[i].memory.followerID && otherPMs[i].memory.followerID) {
            this.say("middle");
            } */
            if (otherPMs[i].memory.leaderID && !otherPMs[i].memory.followerID) {
                otherPMs[i].say("end");
                otherPMs[i].memory.followerID = this.id;
                this.memory.leaderID = otherPMs[i].id;
            } else if (!otherPMs[i].memory.followerID && !otherPMs[i].memory.leaderID) {
                otherPMs[i].say("nothing");
                otherPMs[i].memory.followerID = this.id;
                this.memory.leaderID = otherPMs[i].id;
            }
        }
        //  }

    };


    function getBodyBoostValue(creep, type, boost) {
        let body = creep.body;
        for (let i in creep.body) {
            if (creep.body[i].type === type && ((boost && boost === creep.body[i].boost) || (!boost && creep.body[i].boost))) {
                switch (creep.body[i].boost.length) {
                    case 2:
                        return 2;
                    case 4:
                        return 3;
                    case 5:
                        return 4;
                }
            }
        }
        return 1;
    }

    Creep.prototype.stats = function(stat) {
        // What does the stats function do?
        // Does it return the value it will increase? or does it return how much it will be used?
        if (this.memory.stats === undefined) {
            this.memory.stats = {};
        }
        if (this.memory.stats[stat] === undefined) {
            var ab;
            var total;
            switch (stat) {
                case 'repair':
                case 'repairing':
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 100;
                    switch (getBodyBoostValue(this, WORK)) {
                        case 2:
                            this.memory.stats[stat] = this.memory.stats[stat] * 1.5;
                            break;
                        case 3:
                            this.memory.stats[stat] = this.memory.stats[stat] * 1.7;
                            break;
                        case 4:
                            this.memory.stats[stat] = this.memory.stats[stat] * 2;
                            break;
                    }
                    return this.memory.stats[stat];
                case 'work': // used by repair to get the energy worked.
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK);
                    return this.memory.stats[stat];
                case 'mining':
                     total = (this.getActiveBodyparts(WORK) * 2) * ((getBodyBoostValue(this, WORK) * 2) - 1);
                    this.memory.stats[stat] = total;
                    return this.memory.stats[stat];
                case 'building':
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 10;
                    switch (getBodyBoostValue(this, WORK)) {
                        case 2:
                            this.memory.stats[stat] = this.memory.stats[stat] * 1.5;
                            break;
                        case 3:
                            this.memory.stats[stat] = this.memory.stats[stat] * 1.7;
                            break;
                        case 4:
                            this.memory.stats[stat] = this.memory.stats[stat] * 2;
                            break;
                    }
                    return this.memory.stats[stat];
                case 'mineral':
                     total = this.getActiveBodyparts(WORK) * ((getBodyBoostValue(this, WORK) * 2) - 1);
                    this.memory.stats[stat] = total;
                    return this.memory.stats[stat];
                case 'upgrading':
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK);
                    switch (getBodyBoostValue(this, WORK)) {
                        case 2:
                            this.memory.stats[stat] = this.memory.stats[stat] * 1.5;
                            break;
                        case 3:
                            this.memory.stats[stat] = this.memory.stats[stat] * 1.7;
                            break;
                        case 4:
                            this.memory.stats[stat] = this.memory.stats[stat] * 2;
                            break;
                    }

                    return this.memory.stats[stat];
                case 'heal':
                case 'healing':
                    this.memory.stats[stat] = this.getActiveBodyparts(HEAL) * 12;
                    return this.memory.stats[stat] * getBodyBoostValue(this, HEAL);
                case 'attack':
                    this.memory.stats[stat] = this.getActiveBodyparts(ATTACK) * 30;
                    return this.memory.stats[stat] * getBodyBoostValue(this, ATTACK);
                case 'dismantle':
                    this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 50;
                    return this.memory.stats[stat] * getBodyBoostValue(this, WORK);
                case 'rangedAttack':
                case 'rangedattack':
                case 'ranged Attack':
                    this.memory.stats[stat] = this.getActiveBodyparts(RANGED_ATTACK) * 10;
                    return this.memory.stats[stat] * getBodyBoostValue(this, RANGED_ATTACK);


                case 'carry':
                    this.memory.stats[stat] = this.getActiveBodyparts(CARRY) * 50;
                    return this.memory.stats[stat] * getBodyBoostValue(this, CARRY);
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

    Creep.prototype.dance = function() {
        return this.move(Math.ceil(Math.random() * 8));
    };
    PowerCreep.prototype.dance = function() {
        return this.move(Math.ceil(Math.random() * 8));
    };
    /*
        Creep.prototype.recordUpgrade = function(target) {
            let room = Game.rooms[this.memory.home];
            if (room === undefined) return false;
            let result = this.upgradeController(target);
            if (room.memory.upgradeInfo === undefined) room.memory.upgradeInfo = {
                time: this.id,
                current: 0,
                history: [],
            };
            let info = room.memory.upgradeInfo;
            if (result === OK) {
                info.current += this.stats('work');
            }
            if (info.time !== this.id) {
                info.time = this.id;
                info.history.push(info.current);
                if (info.history.length > 10) info.history.shift();
            }
            this.room.visual.text(info.current, this.pos.x, this.pos.y);
            return result;
        };
        Creep.prototype.recordRepair = function(target) {
            let room = Game.rooms[this.memory.home];
            if (room === undefined) return false;
            let result = this.repair(target);
            if (room.memory.repairInfo === undefined) room.memory.repairInfo = {
                time: this.id,
                current: 0,
                history: [],
            };
            let info = room.memory.repairInfo;
            if (result === OK) {
                info.current += this.stats('work');
                //            if(this.memory.boost)
            }
            if (info.time !== this.id) {
                info.time = this.id;
                info.history.push(info.current);
                if (info.history.length > 10) info.history.shift();
            }
            this.room.visual.text(info.current, this.pos.x, this.pos.y);
            return result;

        };

        StructureTower.prototype.recordHeal = function() {

        };
        StructureTower.prototype.recordAttack = function() {

        };
        StructureTower.prototype.recordRepair = function() {

        };

        Creep.prototype.getNearNonEnergy = function() {
            var around = this.room.lookAtArea(coronateCheck(this.pos.y - 1), coronateCheck(this.pos.x - 1),
                coronateCheck(this.pos.y + 1), coronateCheck(this.pos.x + 1), true);
            var e = around.length;
            while (e--) {
                switch (around[e].type) {
                    case 'tombstone':
                        let tombstone = around[e].tombstone;
                        for (let i in tombstone.store) {
                            if (i !== RESOURCE_ENERGY && tombstone.store[i] > 0) {
                                this.withdraw(tombstone, i);
                                this.say('tomestone');
                                console.log(this, '@', this.pos, 'doing tombstone pick');
                                return true;
                            }
                        }
                        break;
                    case 'resource':
                        let resource = around[e].resource;
                        if (resource.resourceType !== RESOURCE_ENERGY) {
                            this.pickup(resource);
                            this.say('resource');
                            console.log(this, '@', this.pos, 'doing resource pick');
                            return true;
                        }

                        break;
                    case 'creep':
                        let creep = around[e].creep;
                        if (creep.carryCapacity > 0 && creep.carrying !== RESOURCE_ENERGY && creep.id !== this.id && creep.carryTotal > creep.carryCapacity >> 1) {
                            //this.withdraw(creep,creep.carrying);
                            creep.transfer(this, creep.carrying);
                            this.say('creep');
                            console.log(this, '@', this.pos, 'doing creep pick', creep, creep.carrying, creep.carryCapacity >> 1);
                            return true;
                        }

                }
            }


            return false;
        };*/
    PowerCreep.prototype.pickUpFeet = function() {
        let zz = this.room.lookAt(this.pos.x, this.pos.y);
        for (var e in zz) {
            if (zz[e].type == 'resource') {
                let rsult = this.pickup(zz[e].resource);
                //                if (rsult == OK)
                return rsult;
            }
        }
        return false;
    };


    PowerCreep.prototype.pickUpEverything = function() {
        let zz = this.room.lookAtArea((this.pos.y - 1 < 0 ? 0 : this.pos.y - 1), (this.pos.x - 1 < 0 ? 0 : this.pos.x - 1), (this.pos.y + 1 > 49 ? 49 : this.pos.y + 1), (this.pos.x + 1 > 49 ? 49 : this.pos.x + 1), true);
        for (var e in zz) {
            if (zz[e].type == 'resource') {
                if (this.pickup(zz[e].resource) == OK)
                    return true;
            }
        }
        return false;
    };

    PowerCreep.prototype.pickUpEnergy = function() {
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

    Creep.prototype.pickUpFeet = function() {
        let zz = this.room.lookAt(this.pos.x, this.pos.y);
        for (var e in zz) {
            if (zz[e].type == 'resource') {
                let rsult = this.pickup(zz[e].resource);
                //                if (rsult == OK)
                return rsult;
            }
        }
        return false;
    };


    Creep.prototype.pickUpEverything = function() {
        let zz = this.room.lookAtArea((this.pos.y - 1 < 0 ? 0 : this.pos.y - 1), (this.pos.x - 1 < 0 ? 0 : this.pos.x - 1), (this.pos.y + 1 > 49 ? 49 : this.pos.y + 1), (this.pos.x + 1 > 49 ? 49 : this.pos.x + 1), true);
        for (var e in zz) {
            if (zz[e].type == 'resource') {
                if (this.pickup(zz[e].resource) == OK)
                    return true;
            }
        }
        return false;
    };

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

    Creep.prototype.evacuateRoom = function(roomEvac) {
        //        this.dropEverything();
        if (this.room.name === roomEvac) {
            return this.moveToEdge({ reusePath: 10 });
        } else {
            return this.moveInside();
        }
    };
    PowerCreep.prototype.evacuateRoom = function(roomEvac) {
        //        this.dropEverything();
        if (this.room.name === roomEvac) {
            return this.moveToEdge({ reusePath: 10 });
        } else {
            return this.moveInside();
        }
    };
    PowerCreep.prototype.moveToEdge = function(options) {
        var Exits = [FIND_EXIT_TOP,
            FIND_EXIT_RIGHT,
            FIND_EXIT_BOTTOM,
            FIND_EXIT_LEFT
        ];
        if (options === undefined) options = {
            reusePath: 50,
            ignoreCreep: true,
        };
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

        if (this.memory.edgeExitPos) {
            let exit = new RoomPosition(this.memory.edgeExitPos.x, this.memory.edgeExitPos.y, this.memory.edgeExitPos.roomName);
            if (this.room.name !== this.memory.edgeExitPos.roomName) {
                this.memory.edgeExitPos = undefined;
            } else if (exit) {
                //                console.log('Creep has it memorized', roomLink(this.room.name));
                options.maxRooms = 1;
                this.moveMe(exit, options);
                return;
            }
        }

        if (this.partyFlag !== undefined && this.partyFlag.memory.prohibitDirection !== undefined) {
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

        for (var e in Exits) {
            const exit = this.pos.findClosestByRange(Exits[e]);
            var distance = this.pos.getRangeTo(exit);
            if (distance < closest) {
                closest = distance;
                exited = exit;
            }
        }
        if (exited !== undefined) {
            options.maxRooms = 1;
            this.memory.edgeExitPos = {
                x: exited.x,
                y: exited.y,
                roomName: exited.roomName
            };
            this.moveMe(exited, options);
        }
    };
    PowerCreep.prototype.moveInside = function(options) {
        if (this.pos.x > 47) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(8);
                case 1:
                    return this.move(6);
                default:
                    return this.move(LEFT);
            }
        } else if (this.pos.x < 3) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(2);
                case 1:
                    return this.move(4);
                default:
                    return this.move(RIGHT);
            }

        } else if (this.pos.y > 47) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(TOP);
                case 1:
                    return this.move(8);
                default:
                    return this.move(2);
            }

        } else if (this.pos.y < 3) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(4);
                case 1:
                    return this.move(6);
                default:
                    return this.move(BOTTOM);
            }
        } else {
            return false;
        }
    };



    Creep.prototype.moveToEdge = function(options) {
        var Exits = [FIND_EXIT_TOP,
            FIND_EXIT_RIGHT,
            FIND_EXIT_BOTTOM,
            FIND_EXIT_LEFT
        ];
        if (options === undefined) options = {
            reusePath: 50,
            ignoreCreep: true,
        };
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

        if (this.memory.edgeExitPos) {
            let exit = new RoomPosition(this.memory.edgeExitPos.x, this.memory.edgeExitPos.y, this.memory.edgeExitPos.roomName);
            if (this.room.name !== this.memory.edgeExitPos.roomName) {
                this.memory.edgeExitPos = undefined;
            } else if (exit) {
                //                console.log('Creep has it memorized', roomLink(this.room.name));
                options.maxRooms = 1;
                this.moveMe(exit, options);
                return;
            }
        }

        if (this.partyFlag !== undefined && this.partyFlag.memory.prohibitDirection !== undefined) {
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

        for (var e in Exits) {
            const exit = this.pos.findClosestByRange(Exits[e]);
            var distance = this.pos.getRangeTo(exit);
            if (distance < closest) {
                closest = distance;
                exited = exit;
            }
        }
        if (exited !== undefined) {
            options.maxRooms = 1;
            this.memory.edgeExitPos = {
                x: exited.x,
                y: exited.y,
                roomName: exited.roomName
            };
            this.moveMe(exited, options);
        }
    };
    Creep.prototype.moveInside = function(options) {
        if (this.pos.x > 47) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(8);
                case 1:
                    return this.move(6);
                default:
                    return this.move(LEFT);
            }
        } else if (this.pos.x < 3) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(2);
                case 1:
                    return this.move(4);
                default:
                    return this.move(RIGHT);
            }

        } else if (this.pos.y > 47) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(TOP);
                case 1:
                    return this.move(8);
                default:
                    return this.move(2);
            }

        } else if (this.pos.y < 3) {
            switch (Math.floor(Math.random() * 3)) {
                case 0:
                    return this.move(4);
                case 1:
                    return this.move(6);
                default:
                    return this.move(BOTTOM);
            }
        } else {
            return false;
        }
    };


    PowerCreep.prototype.storeCarrying = function() {
        if (this.carryTotal === 0) return false;
        if (this.room.storage === undefined && this.room.terminal === undefined) return false;
        let target;
        tgt = this.room.storage;

        if (tgt === undefined) {
            target = this.room.terminal;
        } else if (this.room.terminal === undefined) {
            target = this.room.storage;
        }
        if (this.room.storage.full && !this.room.terminal.nearFull) {
            tgt = this.room.terminal;
        } else if (this.room.terminal && this.room.terminal.nearFull) {
            tgt = this.room.storage;
        }


        if (this.room.storage.total === this.room.storage.storeCapacity && this.room.terminal.nearFull) {
            this.say('dropping');
            if (this.pos.isNearTo(tgt)) {
                return this.drop(this.carrying);
            } else {
                return this.moveMe(tgt);
            }
        }

        this.moveToTransfer(tgt, this.carrying, { reusePath: 45, ignoreCreeps: true });
        this.say('Store:' + tgt.structureType);
        return true;

    };

    Creep.prototype.storeCarrying = function() {
        if (this.carryTotal === 0) return false;
        if (this.room.storage === undefined && this.room.terminal === undefined) return false;
        let target;
        tgt = this.room.storage;

        if (tgt === undefined) {
            target = this.room.terminal;
        } else if (this.room.terminal === undefined) {
            target = this.room.storage;
        }
        if (this.room.storage.full && !this.room.terminal.nearFull) {
            tgt = this.room.terminal;
        } else if (this.room.terminal && this.room.terminal.nearFull) {
            tgt = this.room.storage;
        }


        if (this.room.storage.total === this.room.storage.storeCapacity && this.room.terminal.nearFull) {
            this.say('dropping');
            if (this.pos.isNearTo(tgt)) {
                return this.drop(this.carrying);
            } else {
                return this.moveMe(tgt);
            }
        }

        this.moveToTransfer(tgt, this.carrying, { reusePath: 45, ignoreCreeps: true });
        this.say('Store:' + tgt.structureType);
        return true;

    };

    Creep.prototype.moveToPickEnergy = function(amount, options) {
        //        var options = {};
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
        close = Game.getObjectById(this.memory.pickUpId);
        if (close === null) {
            if (amount === undefined) amount = 0;
            close = this.room.find(FIND_DROPPED_RESOURCES, {
                filter: function(object) {
                    return object.amount > amount && object.resourceType === 'energy';

                }
            });
            if (close.length === 0) {
                this.memory.pickUpId = undefined;
                return false;
            }
            close = _.max(close, o => o.amount);
            this.memory.pickUpId = close.id;
        }
        if (this.pos.isNearTo(close)) {
            this.pickup(close);
            return true;
        } else {
            this.moveTo(close, options);
            return true;
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
                /*                if (this.memory.role === 'linker' && this.room !== undefined) {
                                    //                    console.log(.name);
                                    close = _.max(this.room.find(FIND, {
                                        filter: function(object) {
                                            //                            console.log(object.pos.roomName);
                                            return object.amount > amount && !object.pos.isEqualTo(Game.flags[object.pos.roomName]);
                                        }
                                    }), o => o.amount);
                                } else {*/
                /*                    close = _.max(this.room.find(FIND, {
                                        filter: function(object) {
                                            return object.amount > amount; //&& object.resourceType !== 'energy'
                                        }
                                    }), o => o.amount); */
                close = this.pos.findClosestByRange(FIND, {
                    filter: function(object) {
                        return object.amount > amount;
                    }
                });

                //              }
            } else {
                close = this.pos.findClosestByRange(FIND, {
                    filter: function(object) {
                        return object.amount > amount;
                    }
                });
            }
            if (!close) return false;

            this.memory.pickUpId = close.id;
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
            //            options.maxRooms = 1;
            return this.moveTo(close, options);
        }

        return false;
    };

    PowerCreep.prototype.moveToPickEnergy = function(amount, options) {
        //        var options = {};
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
        close = Game.getObjectById(this.memory.pickUpId);
        if (close === null) {
            if (amount === undefined) amount = 0;
            close = this.room.find(FIND_DROPPED_RESOURCES, {
                filter: function(object) {
                    return object.amount > amount && object.resourceType === 'energy';

                }
            });
            if (close.length === 0) {
                this.memory.pickUpId = undefined;
                return false;
            }
            close = _.max(close, o => o.amount);
            this.memory.pickUpId = close.id;
        }
        if (this.pos.isNearTo(close)) {
            this.pickup(close);
            return true;
        } else {
            this.moveTo(close, options);
            return true;
        }

        return false;
    };


    PowerCreep.prototype.moveToPickUp = function(FIND, amount, options) {
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
                /*                if (this.memory.role === 'linker' && this.room !== undefined) {
                                    //                    console.log(.name);
                                    close = _.max(this.room.find(FIND, {
                                        filter: function(object) {
                                            //                            console.log(object.pos.roomName);
                                            return object.amount > amount && !object.pos.isEqualTo(Game.flags[object.pos.roomName]);
                                        }
                                    }), o => o.amount);
                                } else {*/
                /*                    close = _.max(this.room.find(FIND, {
                                        filter: function(object) {
                                            return object.amount > amount; //&& object.resourceType !== 'energy'
                                        }
                                    }), o => o.amount); */
                close = this.pos.findClosestByRange(FIND, {
                    filter: function(object) {
                        return object.amount > amount;
                    }
                });

                //              }
            } else {
                close = this.pos.findClosestByRange(FIND, {
                    filter: function(object) {
                        return object.amount > amount;
                    }
                });
            }
            if (!close) return false;

            this.memory.pickUpId = close.id;
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
            //            options.maxRooms = 1;
            return this.moveTo(close, options);
        }

        return false;
    };
    Creep.prototype.sleep = function(count) {
        if (count === undefined) count = 3;
        this.cleanMe();
        if (count < 100000) {
            count += Game.time;
        }
        this.memory.sleeping = count;
    };
    PowerCreep.prototype.sleep = function(count) {
        if (count === undefined) count = 3;
        this.memory.sleeping = count;
    };

    PowerCreep.prototype.countDistance = function() {
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

    Creep.prototype.chaseTo = function(target) {
        let distance = this.pos.getRangeTo(target);
        if (distance > 5) {
            if (this.memory.refreshChaseTimer) {
                this.memory.refreshChaseTimer--;
                if (this.memory.refreshChaseTimer <= 0) {
                    this.memory.chaseTarget = new RoomPosition(target.pos.x, target.pos.y, target.pos.roomName);
                    this.memory.refreshChaseTimer = 5;
                }
                return this.moveMe(this.memory.chaseTarget, { maxRooms: 1, reusePath: 5 });
            } else {
                this.memory.chaseTarget = new RoomPosition(target.pos.x, target.pos.y, target.pos.roomName);
                this.memory.refreshChaseTimer = 5;
                return this.moveMe(this.memory.chaseTarget, { maxRooms: 1, reusePath: 5 });
            }
        } else {
            return this.moveMe(target, { maxRooms: 1, reusePath: 5 });
        }

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
            this.moveMe(source, { maxRooms: 1, reusePath: 50, ignoreCreeps: true });
        }

        return true;
    };

    PowerCreep.prototype.countStop = function() {
        this.memory.notThere = true;
    };
    PowerCreep.prototype.countReset = function() {
        this.memory.notThere = false;
        this.memory.distance = 0;
    };
    PowerCreep.prototype.dropEverything = function() {
        return this.drop(this.carrying);
    };

    Creep.prototype.countStop = function() {
        this.memory.notThere = true;
    };
    Creep.prototype.countReset = function() {
        this.memory.notThere = false;
        this.memory.distance = 0;
    };

    Creep.prototype.dropEverything = function() {
        return this.drop(this.carrying);
    };
    Creep.prototype.smartDismantle = function() {
        //     this.say('sDismale');
        if (this.getActiveBodyparts(WORK) === 0) {
            return false;
        }
        if (this.partyFlag !== undefined) {
            var target = Game.getObjectById(this.partyFlag.memory.target);
            if (target !== null) {
                if (this.pos.isNearTo(target)) {
                    this.dismantle(target);
                    return true;
                }
            }
        }
        var bads;
        bads = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        bads = _.filter(bads, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_TERMINAL && o.structureType !== STRUCTURE_STORAGE;
        });
        if (bads.length > 0) {
            this.dismantle(bads[0]);
            return true;
        }
        if (this.atFlagRoom) {
            this.killRoads();
            return true;
        }
    };

    Creep.prototype.getClearBaseTarget = function() {
        let strucs = this.room.find(FIND_STRUCTURES);
        var test2 = _.filter(strucs, function(o) {
            return o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_ROAD && o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_CONTROLLER && o.structureType !== STRUCTURE_EXTRACTOR;
        }); // Kill all structures not on rampart. 
        if (test2.length > 0) {
            return this.pos.findClosestByRange(test2).id;
        } else {
            test2 = _.filter(strucs, function(o) {
                return o.structureType === STRUCTURE_RAMPART;
            }); // Kill all structures not on rampart. 
            if (test2.length > 0) {
                return this.pos.findClosestByRange(test2).id;
            } else {
                test2 = _.filter(strucs, function(o) {
                    return o.structureType === STRUCTURE_WALL;
                }); // Kill all structures not on rampart. 
                if (test2.length > 0) {
                    return this.pos.findClosestByRange(test2).id;
                } else {
                    var site = this.room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
                    site = _.filter(site, function(o) {
                        return !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.progress > 0;
                    });
                    if (site.length > 0) {
                        return this.pos.findClosestByRange(site).id;
                    }
                }
            }
        }
        return false;
    };



    Creep.prototype.killRoads = function() {
        var bads = this.pos.findInRange(FIND_STRUCTURES, 3);
        bads = _.filter(bads, function(o) {
            return o.structureType === STRUCTURE_ROAD || o.structureType === STRUCTURE_CONTAINER || o.structureType === STRUCTURE_WALL || o.structureType === STRUCTURE_RAMPART;
        });
        if (bads.length > 0) {
            let az = this.pos.findClosestByRange(bads);
            if (az.pos.isNearTo(this) && this.getActiveBodyparts(WORK) > 0) {
                this.dismantle(az);
            } else if (az.pos.isNearTo(this) && this.getActiveBodyparts(ATTACK) > 0) {
                this.attack(az);
            } else if (this.getActiveBodyparts(RANGED_ATTACK) > 0) {
                this.rangedAttack(az);
            }
            return true;
        }
        return false;
    };

    Creep.prototype.smartRangedAttack = function() {
        // No moving. 

        //        this.say('SRanged');
        var hurtz;
        hurtz = this.pos.findInRange(this.room.notAllies, 3);
        hurtz = _.filter(hurtz, function(object) {
            return !object.pos.lookForStructure(STRUCTURE_RAMPART);
        });
        if (hurtz.length > 0) {
            var clost = this.pos.findClosestByRange(hurtz);
            if (this.pos.isNearTo(clost)) {
                this.rangedMassAttack();
            } else {
                this.rangedAttack(clost);
            }
            this.say('🔫' + hurtz.length, true);
            return true;
        }

        var sus = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
        var bads = _.filter(sus, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL && !o.pos.lookForStructure(STRUCTURE_RAMPART);
        });
        if (bads.length > 0) {
            let az = this.pos.findClosestByRange(bads);
            if (az.pos.isNearTo(this) && az.structureType !== STRUCTURE_WALL && az.structureType !== STRUCTURE_ROAD) {
                this.rangedMassAttack();
            } else {
                this.rangedAttack(az);
            }
            this.say('azed');
            return true;
        }

        if (this.partyFlag !== undefined) {
            var target = Game.getObjectById(this.partyFlag.memory.target);
            if (target !== null) {
                if (this.pos.isNearTo(target) && target.structureType !== STRUCTURE_WALL && target.structureType !== STRUCTURE_ROAD && target.structureType !== STRUCTURE_CONTAINER) {
                    this.rangedMassAttack();
                    return true;
                } else if (this.pos.inRangeTo(target, 3)) {
                    this.rangedAttack(target);
                    this.say('!@!');
                    return true;
                }
            }
            if (sus.length > 0) {
                this.rangedAttack(sus);
            }
        }
        /*        if ((this.room.name === this.partyFlag.pos.roomName) || (this.room.controller !== undefined && this.room.controller.owner !== undefined && _.contains(fox.enemies, this.room.controller.owner.username)) || (this.room.controller !== undefined && this.room.controller.reservation !== undefined && _.contains(fox.enemies, this.room.controller.reservation.username))) {
                    
                    this.say('kr');
                } else */
        if (this.atFlagRoom) {
            //        if (!this.killRoads()) {
            this.rangedMassAttack();
            //      }
            return;
        }

        if (this.room.controller !== undefined && !this.room.controller.my && this.partyFlag && this.room.name === this.partyFlag.pos.roomName) {
            this.rangedMassAttack();
        }
        return false;
    };
    Creep.prototype.smartAttack = function() {
        // No moving. 
        //        this.say('SAttack');
        if (this.getActiveBodyparts(ATTACK) === 0) {
            return false;
        }
        var bads;
            bads = this.pos.findInRange(this.room.notAllies, 1);
        // 
        if (this.room.name === 'E22S52') {
            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username); // && !o.pos.lookForStructure(STRUCTURE_RAMPART);
            });

        } else {

            bads = _.filter(bads, function(o) {
                return !_.contains(fox.friends, o.owner.username) && !o.pos.lookForStructure(STRUCTURE_RAMPART); // && !o.pos.lookForStructure(STRUCTURE_RAMPART);
            });
        }
        //      this.say(bads.length + "x");
        if (bads.length > 0) {
            this.attack(bads[0]);
            console.log("hitting a bad instead of rampart?", bads[0], roomLink(this.room.name));
            return true;
        }
        if (this.partyFlag) {
            target = Game.getObjectById(this.partyFlag.memory.target);
            if (target !== null) {
                if (this.pos.isNearTo(target)) {
                    console.log(this, 'is attacking the target', target.hits, target.id);
                    this.attack(target);
                    return true;
                }
            }
        }
        var badStr = this.pos.findInRange(FIND_HOSTILE_STRUCTURES, 1);
        bads = _.filter(badStr, function(o) {
            return !_.contains(fox.friends, o.owner.username) && o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_RAMPART && !o.pos.lookForStructure(STRUCTURE_RAMPART) && o.structureType !== STRUCTURE_STORAGE && o.structureType !== STRUCTURE_TERMINAL;
        });
        if (bads.length > 0) {
            this.attack(bads[0]);
            return true;
        }

        bads = _.filter(badStr, function(o) {
            return !_.contains(fox.friends, o.owner.username);
        });
        if (bads.length > 0) {
            this.attack(bads[0]);
            return true;
        }
        return false;
    };

    function getBox(bads) {
        let rtn = {
            top: 50,
            left: 50,
            right: 0,
            bottom: 0
        };
        for (let i in bads) {
            if (bads[i].pos.x < rtn.left) {
                rtn.left = bads[i].pos.x;
            }
            if (bads[i].pos.x > rtn.right) {
                rtn.right = bads[i].pos.x;
            }
            if (bads[i].pos.y < rtn.top) {
                rtn.top = bads[i].pos.y;
            }
            if (bads[i].pos.y > rtn.bottom) {
                rtn.bottom = bads[i].pos.y;
            }
        }
        rtn.left--;
        rtn.right++;
        rtn.top--;
        rtn.bottom++;
        if (rtn.left < 1) rtn.left = 1;
        if (rtn.right > 48) rtn.right = 48;
        if (rtn.top < 1) rtn.top = 1;
        if (rtn.bottom > 48) rtn.bottom = 48;

        return rtn;
    }

    function isThereSomething(pos) {
        let room = Game.rooms[pos.roomName];
        let zz = room.lookAt(pos.x, pos.y);
        for (var e in zz) {
            if ((zz[e].creep && zz[e].creep.owner.username !== 'likeafox') || (zz[e].terrain && zz[e].terrain === 'wall')) { //|| (zz[e].structure && zz[e].structure.structureType !== 'STRUCTURE_ROAD') there will be no structures that stop me.
                return true;
            }
        }
        return false;
    }

    Creep.prototype.tacticalMove = function(bads, opts) {
        if (opts === undefined) {
            opts = {
                maxRooms: 1,
            };
        }
        if (bads.length === 1) {
            return this.moveTo(bads[0], opts);
        }

        let box = getBox(bads);
        let startPos = new RoomPosition(box.left, box.top, this.pos.roomName);
        let currentPos = new RoomPosition(box.left, box.top, this.pos.roomName);
        let endPos = new RoomPosition(box.right, box.bottom, this.pos.roomName);

        let bestSpot;
        let bestDamage = 0;
        do {
            if (!isThereSomething(currentPos)) {
                let damage = currentPos.getMassRangeDamage(bads);
                this.room.visual.text(damage, currentPos);
                if (damage > bestDamage) {
                    bestDamage = damage;
                    bestSpot = [new RoomPosition(currentPos.x, currentPos.y, currentPos.roomName)];
                } else if (damage === bestDamage) {
                    if (bestSpot === undefined) bestSpot = [];
                    bestSpot.push(new RoomPosition(currentPos.x, currentPos.y, currentPos.roomName));
                }
            } else {
                //this.room.visual.text('!', currentPos, { color: '#FF0000 '});
            }

            currentPos.x++;
            if (currentPos.x > endPos.x) {
                currentPos.x = startPos.x;
                currentPos.y++;
            }
        } while (currentPos.x !== endPos.x || currentPos.y !== endPos.y);
        if (bestSpot.length > 1) {
            bestSpot = this.pos.findClosestByRange(bestSpot);
        } else {
            bestSpot = bestSpot[0];
        }
        this.room.visual.text('X', bestSpot, { color: '#FF00FF ' });
        //   console.log(bestSpot,roomLink(this.pos.roomName), 'doing tacticalMove');
        return this.moveTo(bestSpot, opts);
    };

    Creep.prototype.smartCloseHeal = function() {
        var heals = this.getActiveBodyparts(HEAL);
        if (heals < 2 && heals === 0) {
            return false;
        }
        this.say('CloseHeal');
        var hurtz;

        hurtz = this.pos.findInRange(this.room.myHurtCreeps, 1);

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
        // So rangedHeal will override any attack/ranged/mass - but meleeHeal will override any RangedHeal and attack.
        // Because of that When this does a nearBy heal it will return false so it will allow other ranged Attacks.
        // false from smartHeal will mean it's okay to do other attacks.

        //        this.say('SHeal');
        if (this.getActiveBodyparts(HEAL) < 1) {
            return false;
        }


        var hurtz;
        var ranged = this.getActiveBodyparts(RANGED_ATTACK);

        if (this.hits !== this.hitsMax) {
            this.heal(this);
            // Does self healing
            this.memory.reHealID = this.id;
            return false;
        }

        hurtz = this.pos.findInRange(this.room.myHurtCreeps, 3);

        if (hurtz.length > 0) {
            // Heals others
            let tgt = _.min(hurtz, c => c.hits);
            this.memory.reHealID = tgt.id;
            if (!this.pos.isNearTo(tgt)) {
                this.rangedHeal(tgt);
                this.room.visual.line(this.pos, tgt.pos);
                return true;
            } else {
                this.heal(tgt);
                return true;

            }
            //    return true;
        } else {
            if (this.memory.role === 'guard') return false;
            // Echo Healing.
            let tgt = Game.getObjectById(this.memory.reHealID);
            if (tgt === null) {
                this.heal(this);
                return false;
            } else {
                if (!this.pos.isNearTo(tgt)) {
                    this.rangedHeal(tgt);
                    return true;
                } else {
                    this.heal(tgt);
                    return false;
                }
            }
        }
    };


    Creep.prototype.healOther = function(range) {
        var hurtz;
        if (range !== undefined) {
            hurtz = this.pos.findInRange(this.room.myHurtCreeps, range);
        } else {
            hurtz = this.room.myHurtCreeps;
        }

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
            var moveStatus = this.move(this.pos.getDirectionTo(badguy), options);

        }
    };


    var fox = require('foxGlobals');
    Creep.prototype.moveToTransfer = function(target, resource, options) {
        if (target === undefined || target === null) { return false; }
        if (this.carry[resource] === undefined || this.carry[resource] === 0) return false;

        if (options === undefined) options = {
            reusePath: 25,
            ignoreCreeps: true,
            range: 1,
            visualizePathStyle: {
                stroke: '#faF',
                //                lineStyle: 'dotted',
                strokeWidth: 0.5,
                opacity: 0.25,
                color: '#FF9911'
            },

            //            maxRooms: 1,
        };
        if (this.pos.isNearTo(target)) {
            return this.transfer(target, resource);
        } else {
            return this.moveMe(target, options);
        }
        //        return true;
    };

    PowerCreep.prototype.moveToWithdraw = function(target, resource, amount, options) {
        if (target === undefined || target === null) {
            return false;
        }
        //        if(target.store[resource] === undefined || target.store[resource] === 0 ) return false;
        if (options === undefined) options = {
            reusePath: 25,
            ignoreCreeps: true,
            range: 1,
            visualizePathStyle: {
                stroke: '#faF',
                color: '#009911',
                //              lineStyle: 'dotted',
                strokeWidth: 0.5,
                opacity: 0.25
            },

        };
        if (target.store) {
            if (target.store[resource] < amount) {
                amount = target.store[resource];
            }
        }
        if (this.pos.isNearTo(target)) {
            this.memory._move = undefined;
            return this.withdraw(target, resource, amount);
        } else {
            return this.moveMe(target, options);
        }
        return true;
    };

    Creep.prototype.moveToWithdraw = function(target, resource, amount, options) {
        if (target === undefined || target === null) {
            return false;
        }
        //        if(target.store[resource] === undefined || target.store[resource] === 0 ) return false;
        if (options === undefined) options = {
            reusePath: 25,
            ignoreCreeps: true,
            range: 1,
            visualizePathStyle: {
                stroke: '#faF',
                color: '#009911',
                //              lineStyle: 'dotted',
                strokeWidth: 0.5,
                opacity: 0.25
            },

        };
        if (target.store) {
            if (target.store[resource] < amount) {
                amount = target.store[resource];
            }
        }
        if (this.pos.isNearTo(target)) {
            this.memory._move = undefined;
            return this.withdraw(target, resource, amount);
        } else {
            return this.moveMe(target, options);
        }
        return true;
    };


    PowerCreep.prototype.runFrom = function(badguy, options) {

        //      if (this.memory.role === 'transport') {
        var baddies = [];
        if (_.isArray(badguy)) {
            for (var e in badguy) {
                baddies.push({ pos: badguy[e].pos, range: 5 });
            }
        } else {
            baddies.push({ pos: badguy.pos, range: 5 });
        }
        let result = PathFinder.search(this.pos, baddies, { flee: true });
        let edz = this.move(this.pos.getDirectionTo(result.path[0]));
        //        console.log(roomLink(this.room.name), 'doing new runFrom,', edz);
        this.say('RUN');
        if (edz === OK) {
            return true;
        } else {
            return false;
        }
    };


    Creep.prototype.runFrom = function(badguy, options) {

        //      if (this.memory.role === 'transport') {
        var baddies = [];
        if (_.isArray(badguy)) {
            for (var e in badguy) {
                baddies.push({ pos: badguy[e].pos, range: 5 });
            }
        } else {
            baddies.push({ pos: badguy.pos, range: 5 });
        }
        let result = PathFinder.search(this.pos, baddies, { flee: true });
        let edz = this.move(this.pos.getDirectionTo(result.path[0]));
        //        console.log(roomLink(this.room.name), 'doing new runFrom,', edz);
        this.say('RUN');
        if (edz === OK) {
            return true;
        } else {
            return false;
        }
    };

    Creep.prototype.sing = function(lyrics, publicd) {
        var word = _.indexOf(lyrics, this.saying) + 1;
        this.say(lyrics[word >= lyrics.length ? 0 : word], publicd);
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


    /*function standardizeRoomName(roomName) {
        if (roomName.length === 6) return roomName;
        //       var match = roomName.match(/([WE])([0-9]+)([NS])([0-9]+)/g);
        let match = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(roomName);
        var threeBad;
        var oneBad;
        if (match[2].length === 1) {
            oneBad = true;
        }
        if (match[4].length === 1) {
            threeBad = true;
        }

        var newString = "";
        newString += match[1];
        if (oneBad) {
            newString += "0" + match[2];
        } else {
            newString += match[2];
        }
        newString += match[3];
        if (threeBad) {
            newString += "0" + match[4];
        } else {
            newString += match[4];
        }

        console.log('none standarize RoomName changing',newString);
        return newString;
    } */


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


        //     console.log('Seralized Path', dest, currentPos, path);

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
            direction = creep.memory._move.path[5];
            //            creep.say("👀" + direction);
        }
        if (direction === undefined) { return; }
        let tpos = getFormationPos(creep, direction);
        var looking = creep.room.lookForAt(LOOK_CREEPS, tpos)[0];

        creep.room.visual.line(creep.pos, tpos, { color: 'red', width: 0.3 });
        creep.room.visual.circle(tpos, { stroke: 'green', radius: 0.5 });
        if (looking === undefined) { return; }

        // The blocked Creep moves to 
        //  var color = 'green';
        if (creep.memory && looking.memory && !creep.memory.goHome && creep.memory.role === 'transport' && looking.memory.role === 'transport' && looking.memory.goal === creep.memory.goal && looking.memory.sleeping) {
            //           creep.say("BUMP");
            creep.sleep(3);
            return;
        }
        if (looking.memory === undefined ||
            looking.memory.role === 'wallwork' ||
            (looking.memory.sleeping !== undefined && looking.memory.sleeping > 0) ||
            (looking.memory._move !== undefined && looking.memory.cachePath !== undefined && looking.fatigue === 0) ||
            (looking.memory.stuckCount !== undefined && looking.memory.stuckCount > 1)) {
            //            color = 'red';
            looking.move(looking.pos.getDirectionTo(creep));
            looking.say('✔');
            creep.memory.swapTargetID = looking.id;
            creep.say('mv!');
        }
        creep.room.visual.circle(tpos, { stroke: 'red', radius: 0.5 });

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
        var goalRoomName = goalPos.roomName;
        var currentRoomName = currentPos.roomName;

        var test = rawData;

        if (test[i + 4] !== goalRoomName[0]) return false;
        if (test[i + 5] !== goalRoomName[1]) return false;
        if (test[i + 6] !== goalRoomName[2]) return false;
        if (test[i + 7] !== goalRoomName[3]) return false;
        if (test[i + 8] !== goalRoomName[4]) return false;
        if (test[i + 9] !== goalRoomName[5]) return false;
        if (test[i + 14] !== currentRoomName[0]) return false;
        if (test[i + 15] !== currentRoomName[1]) return false;
        if (test[i + 16] !== currentRoomName[2]) return false;
        if (test[i + 17] !== currentRoomName[3]) return false;
        if (test[i + 18] !== currentRoomName[4]) return false;
        if (test[i + 19] !== currentRoomName[5]) return false;

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

    function getExitPos(creep) {

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
    }


    // Robust path finding, for traveling large distances
    // Designed for long distance, you do need a start_room for your journey.
    // 
    Creep.prototype.tuskenTo = function(target, start_room, move_opts, map_opts) {
        // NOTE: start_room is currently >ALWAYS< creep.room.name
        if (move_opts === undefined) move_opts = {};
        _.defaults(move_opts, {
            //            useSKPathing: true,
            reusePath: 50,
            maxRooms: 1,
            segment: false,
            simpleExit: false,
        });
        /*
                if (target !== undefined && target.memory.target !== undefined) {
                    if (this.pos.isNearTo(target)) {
                        this.say('Cl');
                        return false;
                    }
                }*/
        if (this.partyFlag !== undefined && !this.partyFlag.memory.tusken) {
            move_opts.maxRooms = undefined;
            return this.moveMe(target, move_opts);
        }
        if (_.isObject(start_room)) {
            move_opts = start_room;
            start_room = this.memory.home;
        }
        if (target === undefined) return;

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
            //            move_opts.maxRooms = 1;
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
                    this.room.visual.circle(newz, { stroke: 'green', radius: 0.5 });
                    move_opts.maxRooms = 1;
                    let zz = this.moveMe(newz, move_opts); // Never needs to be segmented.
                    this.say('🚏');
                    return zz;
                }
            } else {
                this.memory.inter_room_target = this.memory.inter_room_path[0];
                this.memory.inter_room_exitTarget = this.memory.inter_room_exit[0];
                if (this.memory.inter_room_target !== undefined) {
                    let newTarget;
                    if (Game.map.getRoomLinearDistance(this.room.name, this.memory.inter_room_target) <= 1) {
                        if (target.pos === undefined) {
                            newTarget = new RoomPosition(target.x, target.y, this.memory.inter_room_target);
                        } else {
                            newTarget = new RoomPosition(target.pos.x, target.pos.y, this.memory.inter_room_target);
                        }
                    } else {
                        newTarget = new RoomPosition(25, 25, this.memory.inter_room_target);
                    }

                    return this.moveMe(newTarget, move_opts);
                }
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
            move_opts.maxRooms = 2;
            this.say('NotPath');
            return this.moveMe(target, move_opts);
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
                let index;
                if (this.room.name == start_room) {
                    this.memory.inter_room_target = this.memory.inter_room_path[0];
                    this.memory.inter_room_exitTarget = this.memory.inter_room_exit[0];
                } else {
                    index = this.memory.inter_room_path.indexOf(this.room.name);
                    if (index > -1) {
                        this.memory.inter_room_target = this.memory.inter_room_path[index + 1];
                        this.memory.inter_room_exitTarget = this.memory.inter_room_exit[index + 1];
                    }
                }
                //              if(this.memory.role === 'demolisher') {
                //                    console.log(this.room.name, this.memory.inter_room_path.indexOf(this.room.name),this.memory.inter_room_path.length-2);
                //                  }
                if (this.memory.inter_room_target !== undefined) {
                    if (index === this.memory.inter_room_path.length - 2) {
                        //                        console.log("this is close to target room, using location",index, this.memory.inter_room_path.length - 2,this.memory.role,this.room.name,target.pos.x,target.pos.y);
                        var tmp;
                        if (target.pos !== undefined) {
                            tmp = new RoomPosition(target.pos.x, target.pos.y, this.memory.inter_room_target);
                        } else {
                            tmp = new RoomPosition(target.x, target.y, this.memory.inter_room_target);
                        }
                        target = tmp;
                        move_opts.maxRooms = 2;

                    } else {
                        target = new RoomPosition(25, 25, this.memory.inter_room_target);
                    }

                }
            }

        }
        return this.moveMe(target, move_opts);
    };



    var segment = require('commands.toSegment');
    var rawData;
    Creep.prototype.moveMeByPath = function(path, target) {
        var stuck;
        if (this.memory.position !== undefined) {
            stuck = this.pos.x === this.memory.position.x && this.pos.y === this.memory.position.y;
        } else {
            stuck = false;
        }
        if (!stuck) this.memory.position = {
            x: this.pos.x,
            y: this.pos.y,
        };

        if (this.memory.stuckCount === undefined) this.memory.stuckCount = 0;

        if (stuck) {
            this.memory.stuckCount++;
        } else {
            //          if (this.memory.stuckCount > 0) {
            //                this.memory.stuckCount--;
            //        }
        }

        this.say('GG');
        let result = this.moveByPath(path);
        if (result !== OK) {
            this.memory.stuckCount++;
        }


        if (this.memory.stuckCount > 3) {
            if (this.memory.stuckCount >= 5) {
                this.memory.stuckCount = 5;
                this.say('ST5');
            }
            if (this.pos.isNearTo(target)) {
                this.memory.stuckCount = 0;
            }
            return this.moveTo(target, {
                ignoreCreeps: false,
                reusePath: 20,
                maxRooms: 1,
                visualizePathStyle: {
                    stroke: '#faF',
                    lineStyle: 'dotted',
                    strokeWidth: 0.1,
                    opacity: 0.5
                },
            });
        }
        return result;
    };

    function moveMe(creep, target, options, xxx) {

        if (creep.fatigue > 0) {
            if (creep.memory._move !== undefined)
                creep.memory._move.time = creep.memory._move.time + 1;
            return ERR_TIRED;
        }
        if (creep.memory.stopMoving !== undefined) {
            creep.memory.stopMoving = undefined;
            return ERR_BUSY;
        }
        if (target === null || target === undefined || target === false) {
            console.log(creep, 'going to target NULL', target, roomLink(creep.room.name), creep.pos, creep.memory.role, creep.memory.party);
            return ERR_INVALID_TARGET;
        }
        if (xxx !== undefined) {
            target = new RoomPosition(target, options, creep.room.name);
            options = xxx;
        }

        if (options === undefined) options = {};
        if (options.visualizePathStyle === undefined) {
            options.visualizePathStyle = {
                stroke: '#faF',
                lineStyle: 'dotted',
                strokeWidth: 0.1,
                opacity: 0.5
            };
        }


        var moveStatus;
        var stuck;


        if (creep.memory.position !== undefined) {
            stuck = creep.pos.x === creep.memory.position.x && creep.pos.y === creep.memory.position.y;
        } else {
            stuck = false;
        }
        if (!stuck) creep.memory.position = {
            x: creep.pos.x,
            y: creep.pos.y,
        };

        if (creep.memory.stuckCount === undefined) creep.memory.stuckCount = 0;

        if (stuck) {
            creep.memory.stuckCount++;
        } else {
            if (creep.memory.stuckCount > 0) {
                creep.memory.stuckCount--;
            }
        }
        if (creep.memory.stuckCount > 2) {
            if (creep.memory.stuckCount >= 5) {
                creep.memory.stuckCount = 5;
                creep.say('ST5');
            }
            //            options.reusePath = 5;
            options.ignoreCreeps = false;
            creep.memory._move = undefined;

            creep.memory.cachePath = undefined;
            return creep.moveTo(target, options);
        }


        // Here is the logic for following and stuff.
        if (creep.memory.followerID || creep.memory.leaderID) {
            if (creep.memory.followerID !== undefined && creep.memory.leaderID !== undefined) {
                // This is a guy in the middle
                let led = Game.getObjectById(creep.memory.leaderID);
                let fol = Game.getObjectById(creep.memory.followerID);
                if (led !== null && fol !== null) {
                    if (!fol.memory.leaderID || fol.memory.leaderID !== creep.id) {
                        //                    console.log(roomLink(fol.room.name),"Mismatch leaderID to creep");
                        creep.memory.followerID = undefined;
                    }
                    if (!led.memory.followerID || led.memory.followerID !== creep.id) {
                        //                  console.log(roomLink(fol.room.name),"Mismatch leaderID to creep");
                        creep.memory.leaderID = undefined;
                    }

                    creep.room.visual.line(creep.pos, fol.pos, { color: 'white' });
                    creep.room.visual.line(creep.pos, led.pos, { color: 'white' });
                    if (!creep.pos.isNearTo(fol) && !creep.isAtEdge) {
                        // If not near the follower then don't move. 
                        creep.say('w4F');
                        return ERR_NO_PATH;
                    }
                    options.reusePath = 50;

                    if (creep.pos.isNearTo(led)) {
                        return creep.move(creep.pos.getDirectionTo(led));
                    } else {
                        return creep.moveTo(led, options);
                    }
                }
            } else if (creep.memory.followerID !== undefined) {
                // This is the leader.
                let fol = Game.getObjectById(creep.memory.followerID);
                if (fol !== null) {
                    if (!fol.memory.leaderID || fol.memory.leaderID !== creep.id) {
                        //   console.log(roomLink(fol.room.name),"Mismatch leaderID to creep");
                        creep.memory.followerID = undefined;
                    }
                    creep.room.visual.line(creep.pos, fol.pos, { color: 'red' });
                    creep.room.visual.text('L', creep.pos);
                    if ((!creep.pos.isNearTo(fol) && !creep.isAtEdge) || fol.fatigue > 0 || (fol.hits !== fol.hitsMax && fol.getActiveBodyparts(MOVE) === 0)) {

                        // If the leader isn't near his follower, he doesn't move. 
                        if (creep.memory.waitTimer === undefined) {
                            creep.memory.waitTimer = 10;
                        }
                        creep.memory.waitTimer--;
                        if (creep.memory.waitTimer < 0) {
                            //                        creep.memory.waitTimer = 5;
                            return creep.moveTo(fol, options);
                            //                          We do not move, because as the leader, we do not want to recalcuate the path. 
                        }
                        creep.memory.stuckCount--;
                        creep.say('Wait4F');
                        return ERR_NO_PATH;
                    } else {
                        creep.memory.waitTimer = undefined;
                    }
                } else {
                    creep.memory.followerID = undefined;
                }
            } else if (creep.memory.leaderID !== undefined) {
                let led = Game.getObjectById(creep.memory.leaderID);

                if (led !== null) {
                    if (!led.memory.followerID || led.memory.followerID !== creep.id) {
                        //     console.log(roomLink(led.room.name),"Mismatch leaderID to creep");
                        creep.memory.leaderID = undefined;
                    }

                    creep.room.visual.line(creep.pos, led.pos, { color: 'blue' });
                    creep.room.visual.text('E', creep.pos);

                    if (creep.room.name === led.room.name) {
                        options.maxRooms = 1;
                        options.ignoreCreeps = false;
                        options.reusePath = 50;
                    }
                    if (creep.pos.isNearTo(led)) {
                        return creep.move(creep.pos.getDirectionTo(led));
                    } else {
                        return creep.moveTo(led, options);
                    }
                } else {
                    creep.memory.leaderID = undefined;
                }
                // This is the last follower. 
            }
        }


        let status = null;
        let exit_cost = 25;

        if (options.useSKPathing) {
            /*let parsed = /^[WE]([0-9]+)[NS]([0-9]+)$/.exec(creep.room.name);
            let fMod = parsed[1] % 10;
            let sMod = parsed[2] % 10;
            let isSK = !(fMod === 5 && sMod === 5) && ((fMod >= 4) && (fMod <= 6)) &&
                ((sMod >= 4) && (sMod <= 6));*/
            let c;
            let isSK = require('role.parent').isRoomSK(creep);
            if (isSK) {
                //    creep.say('😎');
                // Use special SK pathing algorithim to avoid hostile SK creeps

                if (creep.memory.role === 'transport' || creep.memory.role === 'miner' || creep.memory.role === 'engineer' || creep.memory.role === 'thief') {
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
                                    /*terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    if (terrain === 'wall') {
                                        // Don't try to tunnel through game walls!
                                        costMatrix.set(tar_x, tar_y, 0xff);
                                    } else {
                                        costMatrix.set(tar_x, tar_y, aggro_cost);
                                    }*/
                                    //terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    terrain = Game.map.getRoomTerrain(c.room.name);
                                    switch (terrain.get(tar_x, tar_y)) {
                                        case 'wall':
                                            costMatrix.set(tar_x, tar_y, 0xff);
                                            break;
                                        default:
                                            costMatrix.set(tar_x, tar_y, aggro_cost);
                                            break;
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
                                    /*
                                    terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    if (terrain === 'wall') {
                                        // Don't try to tunnel through game walls!
                                        costMatrix.set(tar_x, tar_y, 0xff);
                                    } else {
                                        costMatrix.set(tar_x, tar_y, aggro_cost);
                                    }*/
                                    //terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                    terrain = Game.map.getRoomTerrain(c.room.name);
                                    switch (terrain.get(tar_x, tar_y)) {
                                        case 'wall':
                                            costMatrix.set(tar_x, tar_y, 0xff);
                                            break;
                                        default:
                                            costMatrix.set(tar_x, tar_y, aggro_cost);
                                            break;
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
                                        /*
                                        terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                        if (terrain === 'wall') {
                                            // Don't try to tunnel through game walls!
                                            costMatrix.set(tar_x, tar_y, 0xff);
                                        } else {
                                            costMatrix.set(tar_x, tar_y, aggro_cost);
                                        } */


                                        terrain = Game.map.getRoomTerrain(c.room.name);
                                        switch (terrain.get(tar_x, tar_y)) {
                                            case 'wall':
                                                costMatrix.set(tar_x, tar_y, 0xff);
                                                break;
                                            default:
                                                costMatrix.set(tar_x, tar_y, aggro_cost);
                                                break;
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


                        let aggro_radius = 3;
                        let aggro_cost = 50;
                        let n = 0;
                        let ret = null;
                        let tar_x = 0;
                        let tar_y = 0;
                        let terrain = null;

                        let sourceKeepers = _.filter(room.find(FIND_HOSTILE_CREEPS), function(o) {
                            return o.owner.username === 'Source Keeper';
                        });

                        for (let ii in sourceKeepers) {
                            c = sourceKeepers[ii];
                            n = 0;
                            ret = ulamSpiral(n);
                            while (true) {
                                ret = ulamSpiral(n);
                                n += 1;
                                if (ret.sq > aggro_radius) {
                                    break;
                                } else if (ret.sq === aggro_radius) {
                                    aggro_cost = 50;
                                } else {
                                    aggro_cost = 50;
                                }
                                tar_x = c.pos.x + ret.x;
                                tar_y = c.pos.y + ret.y;
                                if (tar_x > 49 || tar_x < 0) {
                                    continue;
                                } else if (tar_y > 49 || tar_y < 0) {
                                    continue;
                                }
                                //terrain = Game.map.getTerrainAt(tar_x, tar_y, c.room.name);
                                terrain = Game.map.getRoomTerrain(c.room.name);
                                switch (terrain.get(tar_x, tar_y)) {
                                    case 'wall':
                                        costMatrix.set(tar_x, tar_y, 0xff);
                                        break;
                                    default:
                                        costMatrix.set(tar_x, tar_y, aggro_cost);
                                        break;
                                }
                                /*
                                if (terrain === 'wall') {
                                    // Don't try to tunnel through game walls!
                                    costMatrix.set(tar_x, tar_y, 0xff);
                                } else {
                                    costMatrix.set(tar_x, tar_y, aggro_cost);
                                }*/
                            }


                        }
                        /*
                                                room.find(sourceKeepers).forEach(
                                                    function(c) {
                                                        console.log(c,'it should be in creep loop!');
                                                        n = 0;
                                                        ret = ulamSpiral(n);
                                                        while (true) {
                                                            ret = ulamSpiral(n);
                                                            n += 1;
                                                            if (ret.sq > aggro_radius) {
                                                                break;
                                                            } else if (ret.sq === aggro_radius) {
                                                                aggro_cost = 50;
                                                            } else {
                                                                aggro_cost = 50;
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
                                                );*/


                        return costMatrix;
                    };
                }

            }
        }




        if (creep.memory.party !== undefined && Game.flags[creep.memory.party] && Game.flags[creep.memory.party].memory.CachedPathOn === true && Game.flags[creep.memory.party].memory.cachedPathInfo && Game.flags[creep.memory.party].memory.cachedPathInfo.startPoint.x !== 0 && ((target.pos && target.pos.isEqualTo(creep.partyFlag)) || (!target.pos && target.isEqualTo(creep.partyFlag)))) {
            // This section is to determine if we have a end/start point, and also determine if we need to make a path;
            let info = Game.flags[creep.memory.party].memory.cachedPathInfo;
            if (creep.memory.usePath === undefined && info) {
                if (info.startPoint.x !== 0 && creep.room.name == info.startPoint.roomName) {
                    let start = new RoomPosition(info.startPoint.x, info.startPoint.y, info.startPoint.roomName);

                    if (!creep.pos.isEqualTo(start)) {
                        creep.say('M2Start');
                        creep.room.visual.circle(start, { stroke: 'red', radius: 0.5 });
                        options.ignoreCreeps = false;
                        options.maxOpts = 15;
                        return creep.moveTo(start, options);
                    } else {
                        creep.memory.usePath = true;
                        if (info.cachedPath[creep.room.name] === undefined) {
                            creep.memory.makePath = true;
                        } else {
                            creep.memory.makePath = undefined;
                        }
                    }
                } else if (info.startPoint.x === 0) {
                    return 0;
                }
            }

            if (creep.memory.makePath === true) {
                let result;
                let end = new RoomPosition(info.endPoint.x, info.endPoint.y, info.endPoint.roomName);
                options.ignoreCreeps = true;
                let path;
                if (info.cachedPath[creep.room.name] === undefined) {
                    path = creep.pos.findPathTo(end, options);
                    info.cachedPath[creep.room.name] = Room.serializePath(path);
                } else {
                    path = info.cachedPath[creep.room.name];
                }
                if (creep.pos.roomName === creep.partyFlag.pos.roomName) {
                    creep.memory.makePath = undefined;
                }

                result = creep.moveByPath(path);
                //                console.log('Creating Path and moving by path', result, roomLink(creep.room.name));
                creep.say("MPath");
                return result;

            }
            if (creep.memory.cachePath === undefined || creep.memory.cachePath.room !== creep.room.name) {
                if (info && info.cachedPath[creep.room.name] !== undefined) {
                    creep.say('getPath');
                    creep.memory.cachePath = {
                        path: info.cachedPath[creep.room.name],
                        room: creep.room.name,
                    };
                } else if (info && info.endPoint) {
                    creep.say('noPath');
                    let end = new RoomPosition(info.endPoint.x, info.endPoint.y, info.endPoint.roomName);
                    return creep.moveTo(end, options);
                }
            }
            if (creep.memory.home === 'E20S50' && creep.memory.party === 'shard3') {
                creep.say('NoPath');
                return creep.moveTo(target, options);
            }
            if (creep.memory.cachePath && creep.memory.cachePath.path) {
                if (creep.memory.stuckCount > 2) {
                    return creep.moveTo(target, options);
                }
                let rsut = creep.moveByPath(creep.memory.cachePath.path);
                if (rsut === OK) {
                    creep.say("$", true);
                } else {
                    //                    console.log(roomLink(creep.room.name), rsut, creep.memory.cachePath.room, ":", creep.memory.cachePath.path);
                    creep.say('notOnPath');
                    return creep.moveTo(target, options);
                }
                return rsut;
            } else {
                return creep.moveTo(target, options);
            }
        } else if (creep.memory.usePath && Game.flags[creep.memory.party] && Game.flags[creep.memory.party].memory.CachedPathOn) {
            creep.memory.usePath = undefined;
        }


        // Start of segment fun.

        if (options.segment === undefined) {
            options.segment = false;
        }
        if (!options.segment && creep.memory.cachePath !== undefined) {
            options.segment = true;
        }

        if (options.segment && (creep.pos.x === 1 || creep.pos.x === 48 || creep.pos.y === 1 || creep.pos.y === 48) && (creep.memory.cachePath === undefined || creep.memory.cachePath.length < 10)) {
            segment.requestRoomSegmentData(creep.memory.home);
        }

        if (!options.segment || !segment.roomToSegment(creep.memory.home)) {
            moveStatus = creep.moveTo(target, options);
            if (moveStatus == OK) {
                if (options.ignoreCreeps && creep.memory.stuckCount > 0) { //|| creep.room.name === creep.memory.home 
                    swapTarget(creep);
                }
            }
        } else {
            var doPath = false;
            var zz, test;
            let home = creep.memory.home;
            if (creep.memory.cachePath !== undefined) { // This has been done before and gotten a path.
                //   var start = Game.cpu.getUsed();
                /*if (stuck) {
                    creep.memory.cachePath = creep.memory.oldCachePath;
                }
                if (_.isString(creep.memory.cachePath)) {
                    path = Room.deserializePath(creep.memory.cachePath);
                    creep.memory.oldCachePath = creep.memory.cachePath;*/
                moveStatus = creep.moveByPath(creep.memory.cachePath, options);
                /* if (moveStatus == OK) {
                        path.shift();
                        creep.memory._move = undefined;
                    } else {
                        console.log(moveStatus, roomLink(creep.room.name), creep.name, creep.pos, creep.memory.oldCachePath, creep.memory.cachePath);
                    }
                    creep.memory.cachePath = Room.serializePath(path);

                    if (creep.memory.cachePath.length === 0) creep.memory.cachePath = undefined;
                }*/
                creep.say('💰!', true);


            } else if ((creep.pos.x === 0 || creep.pos.x === 49 || creep.pos.y === 0 || creep.pos.y === 49) || nearContain(creep)) {
                if (rawData === undefined) {
                    rawData = {};
                }

                if (rawData[home] === undefined || !rawData[home] ||Game.rooms[home].memory.segmentReset < 0 ) { // False rawdata needs to be refreshed
                    rawData[home] = segment.getRawSegmentRoomData(home);
                }

                if (target !== undefined && target.x === undefined) {
                    target = target.pos;
                }
                let zz = findSerializedPath(rawData[home], creep.pos, target);

                if (zz === undefined) {
                    // if we don't find the path then. 
                    options.ignoreCreeps = true;
                    doPath = true;
                    creep.say('NP');
                } else {
                    //                    console.log(segment.roomToSegment( creep.memory.home), creep.memory.home, 'There is a path, C:', creep.pos, "G:", target);
                    // Then we use zz to set _move as;
                    let _move = getSerializedPath(zz);
                    //path = _.isString(_move.path) ? Room.deserializePath(_move.path) : _move.path;
                    //let path = _move.path;
                    creep.memory.cachePath = _move.path;

                    moveStatus = creep.moveByPath(creep.memory.cachePath, options);
                    //path.shift();
                    creep.memory._move = undefined;

                    // if (path.length > 0)
                    //creep.memory.cachePath = path;// Room.serializePath(path);
                    creep.say("💰");
                    //     return moveStatus;
                }

            }

            //            if (options.ignoreCreeps && creep.memory.stuckCount > 0) {
            //    swapTarget(creep);
            //  }


            // If no move before done,then do creep move.
            if (moveStatus === undefined || moveStatus === -5) {
                creep.memory.cachePath = undefined;
                //                creep.say(moveStatus,true);
                moveStatus = creep.moveTo(target, options);
            }
            if (doPath) {
                if (rawData[home] !== undefined && creep.memory._move !== undefined) {
                    test = serializePath(creep);
                    if (test !== undefined) {
                        rawData[home] += test + '+';
                        segment.setRoomSegmentData(home, rawData[home]);
                    }
                }
            }
        }

        if (moveStatus === OK && options.ignoreCreeps && (creep.isAtEdge || creep.memory.stuckCount > 0 || creep.room.name === creep.memory.home) && creep.memory.role === 'miner') {
            swapTarget(creep);
        }


        return moveStatus;
    }
};