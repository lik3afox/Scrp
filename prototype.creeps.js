var linksCache = [];

function getCached(id) {
    if (linksCache[id] === undefined) {
        linksCache[id] = Game.getObjectById(id);
    }
    return linksCache[id];
}

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

    Creep.prototype.stats = function(stat) {
        if (this.memory.stats === undefined) {
            this.memory.stats = {};
        }
        if (this.memory.stats[stat] === undefined) {
            switch (stat) {
                case 'mining':
                    let zz = this.memory.stats[stat] = this.getActiveBodyparts(WORK) * 2;
                    return zz;
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
                        return true;
                }
            }
        }
        return false;
    };
    Creep.prototype.sleep = function(count) {
        switch (count) {
            case 1:
                this.say('zZz');
                break;
            case 2:
                this.say('zZzZ');
                break;
            default:
                this.say('zZzZz');
                break;
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
        if (this.getActiveBodyparts(HEAL) === 0) {
            return false;
        }
        this.heal(this);
        if (this.hits == this.hitsMax) return true;
        return true;
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
        /*
                if (this.room.controller.owner === undefined) {
                    return false;
                } */
        if (this.room.controller !== undefined && this.room.controller.owner !== undefined &&

            _.contains(fox.friends, this.room.controller.owner.username)) return false;
        /*        if (this.memory.role == 'demolisher') {
                    console.log(this.room.controller);
                } */
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


            var test2 = _.filter(struc, function(o) {
                return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_ROAD && o.structureType !== STRUCTURE_CONTAINER && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && !o.pos.lookForStructure(STRUCTURE_RAMPART);
            }); // This is something is not on a rampart
            if (test2.length !== 0) {
                this.memory.targetID = this.pos.findClosestByRange(test2).id;
            } else {
                var test = _.filter(struc, function(o) {
                    return o.structureType !== STRUCTURE_WALL && o.structureType !== STRUCTURE_CONTAINER && o.structureType !== STRUCTURE_RAMPART && o.structureType !== STRUCTURE_CONTROLLER && o.pos.lookForStructure(STRUCTURE_RAMPART);
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
                } else if (this.getActiveBodyparts(RANGED_ATTACK) > 0) {
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
                let zz = this.spawnCreep(body, name, mem);
                if (zz === 0) this.room.memory.roomFailure = -1500;
                console.log('Emergency creation, trying to create simple RESULT:');
            }

            // If spawns haven't spawn in a while
            //Game.spawns[title].memory.lastSpawn = 0;
            // if creeps are less than 5
            // spawn.memory.totalCreep


        }; */

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

    function serializePath(creep) {
        // This function will take an object that is a _move.
        // and turn into an object that is passed.
        /*
destination Current Pos Path
0123 456789 0123 456789 
4345 E23S39 3100 E23S39 3001655555555555566665555555544445444444444455444
*/
        var path = creep.memory._move.path;
        if (path === undefined || path.length === 0) return;

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

    function simpleMatch(rawData, currentPos, goalPos, i) {
        /*
        of course we need to make sure the first match is - currentroomname !== goalPos
destination Current Pos Path
0123 456789 0123 456789 
4345 E23S39 3100 E23S39 3001655555555555566665555555544445444444444455444
xxxx yyyyyy yyyy yyyyyy x
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
                /*
                if(simpleMatch(rawData, currentPos, goalPos,i) ) {
                                        for (var e = i; e++; e < test.length) {
                                            if (test[e] == '+') {
                                                return rawData.substring(i, e);
                                            }
                                        }
                } else {
                    i+=20;
                    }
                 
                */

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
    Creep.prototype.withdrawing = function(target, resource, amount) {
        //console.log('doing wrapped withdrawing',target,resource,amount);
    //    if(Game.shard.name === 'shard0'){
//        	return this.withdraw(target, resource, amount);
  //      }
        if (target.structureType !== STRUCTURE_LINK && target.store !== undefined) {
            if ( target.store[resource] !== undefined) {
            	return this.withdraw(target, resource, amount);
            } 
        } else {
  //          console.log('doing wrapped withdrawing', target, resource, amount);
            return this.withdraw(target, resource, amount);
        }
        return -6;

    };
    Creep.prototype.cleanMe = function() {
        // What this function does is clean up memory and make it less.
        if(this.ticksToLive < 1400) {
            this.memory.needBoost = undefined;
        }
        if(this.memory._move !== undefined) {
            if(this.memory._move.time < Game.time){
                this.memory._move = undefined;
                this.memory.oldCachePath = undefined;
                this.memory.position = undefined;
                this.memory.stuckCount = undefined;
                this.memory.cachePath = undefined;
                this.memory.closeRoadBuildTimer = undefined;
                this.memory.onRoad = undefined;
            }
        }
    };

    var segment = require('commands.toSegment');
    var rawData;
    Creep.prototype.moveMe = function(target, options, xxx) {

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

        if (this.memory.role == 'transport' || this.memory.role == 'xtransport' || this.memory.party !== undefined) {
            if (this.room.name != this.memory.home)
                options.ignoreCreeps = true;
        }


        //        if (options.ignoreCreeps) {
        if (this.memory.stuckCount > 2) {
            options.reusePath = 5;
            options.ignoreCreeps = false;
            this.memory._move = undefined;

        }
        //      } 


        // Start of segment fun.

        if (options.segment === undefined) options.segment = false;

        if (options.segment && (this.pos.x === 1 || this.pos.x === 48 || this.pos.y === 1 || this.pos.y === 48)) {
            segment.requestRoomSegmentData(this.memory.home);
        }

        if (!segment.roomToSegment(this.memory.home) || !options.segment || this.memory.stuckCount > 2) {
            this.memory.cachePath = undefined;
            moveStatus = this.moveTo(target, options);
        } else {
            // new stuff
            var doPath = false;
            var zz, test;
            let home = this.memory.home;
            if (this.memory.cachePath !== undefined) { // This has been done before and gotten a path.
                if (stuck) {
                    this.memory.cachePath = this.memory.oldCachePath;
                }
                if (_.isString(this.memory.cachePath)) {
                    path = Room.deserializePath(this.memory.cachePath);
                    this.memory.oldCachePath = this.memory.cachePath;
                    moveStatus = this.moveByPath(path, options);
                    if (moveStatus == OK) path.shift();
                    this.memory.cachePath = Room.serializePath(path);

                    this.say('💰' + this.memory.cachePath.length);
                    if (this.memory.cachePath.length === 0) this.memory.cachePath = undefined;
                }
            } else if ((this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49) ||
                nearContain(this)) {
                if (rawData === undefined) {
                    rawData = {};
                }
                if (rawData[home] === undefined || !rawData[home]) { // False rawdata needs to be refreshed
                    rawData[home] = segment.getRawSegmentRoomData(home);
                    //                    console.log('GRABBING SEGMENT AGAIN for ', home, this.pos, this.name);
                }

                if (target.x === undefined) {
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
                    if (path.length > 0)
                        this.memory.cachePath = Room.serializePath(path);
                    this.say("💰" + moveStatus);
                }

            }
            // If no move before done,then do this move.
            if (moveStatus === undefined || moveStatus === -5) {
                this.memory.cachePath = undefined;
                moveStatus = this.moveTo(target, options);
            }
            if (doPath) {
                if (!rawData[home]) { // Fail on rawdata means that the segment will be available next tick
                    //                    console.log(segment.roomToSegment(this.memory.home),'here Segment fail.',roomLink( this.room.name ),this.pos);
                } else if (rawData[home] !== undefined && this.memory._move !== undefined) {
                    test = serializePath(this);
                    if (test !== undefined) {
                        rawData[home] += test + '+';
                        segment.setRoomSegmentData(home, rawData[home]);
                        //                      console.log(segment.roomToSegment(this.memory.home),this.pos, 'G', target, 'Added to', home, ' FINALSERIALIZED PATH:', test);
                    }
                }
            }

        }

        return moveStatus;
    };
};