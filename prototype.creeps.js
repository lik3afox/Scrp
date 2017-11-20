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

function spliceSlice(str, index, count, add) {
  // We cannot pass negative indexes dirrectly to the 2nd slicing operation.
  if (index < 0) {
    index = str.length + index;
    if (index < 0) {
      index = 0;
    }
  }

  return str.slice(0, index) + (add || "") + str.slice(index + count);
}
function serializePath(creep) {
    // This function will take an object that is a _move.
    // and turn into an object that is passed.
    var report = 'E00S001199W00S002288123456789';
    if(creep.memory._move === undefined) return false;
    var move = creep.memory._move;
    // Output would be nice
    // Desintation 
    // E00S00 4040 // combined.
    var dest = "" + (move.dest.x < 10 ? "0" + move.dest.x : move.dest.x) +
        (move.dest.y < 10 ? "0" + move.dest.y : move.dest.y) + move.dest.room;
    // Current Location
    // E00S00 + path - First 4 of the path is the first location.
    var current = creep.pos.roomName;
    /*
    var move = {
    dest = {
    x:1,
    y:2,
    roomName:undefined
    },
    time: 123
    path : 
    room : 'E14S37'
    }
    */
    var path = creep.memory._move.path;
    // Getting the path after a moveTo needs to go back 1 space.
    // first it needs to change the 0/1 2/3 units of the array to it's current.
var future = new RoomPosition(parseInt(path[0]+path[1]),parseInt(path[2]+path[3]),creep.room.name);
var dir = creep.pos.getDirectionTo(future);
var ez = path.substring(0,4);
console.log('old path',path,future);
var xx,yy;
    if(creep.pos.x < 10) {
        ez[0] = 0;
        ez[1] = creep.pos.x;
    } else {
        var z = creep.pos.x.toString();
        ez[0] = z[0];
        ez[1] = z[1];
    }
    if(creep.pos.y < 10) {
        ez[2] = 0;
        ez[3] = creep.pos.y;
    } else {
        var zz = creep.pos.x.toString();
        ez[2] = zz[0];
        ez[3] = zz[1];
    }
//3207 E23S38 E23S39 4804 88888
//0123 456789 012345 6789 0 

// then it needs to calcuate teh direction between current pos and the pos
//console.log( path );
var ee = path.substring(4,path.length);

console.log("CHecked","path",path ,"c",creep.pos,ez,ee,"d:",dir,future.isEqualTo(creep.pos) );
console.log(ez+dir+ee);
//path =  spliceSlice(path, 20, 1, dir) ;
// it needs to add to the array@
    // that it think it's at.

    var reported = dest + current + ez+dir+ee;
    return reported;
}

function findSerializedPath(rawData, currentPos, goalPos) {
    var test = rawData;
    //    console.log(test.length,test);
    if(test === undefined) return;
    for (var i = 0; i < test.length; i++) {
        if (test[i] == '+' && i !== test.length - 1) {
            i++;
            var destRoomX = parseInt(test[i + 5] + test[i + 6]);
            var destRoomY = parseInt(test[i + 8] + test[i + 9]);
            var goalRoom = test[i + 4] + destRoomX + test[i + 7] + destRoomY;
            var currentRoomX = parseInt(test[i + 11] + test[i + 12]);
            var currentRoomY = parseInt(test[i + 14] + test[i + 15]);
            var currentRoom = test[i + 10] + currentRoomX + test[i + 13] + currentRoomY;
            var goal = new RoomPosition(parseInt(test[i + 0] + test[i + 1]), parseInt(test[i + 2] + test[i + 3]), goalRoom);
            var current = new RoomPosition(parseInt(test[i + 16] + test[i + 17]), parseInt(test[i + 18] + test[i + 19]), currentRoom);
            if (current.isEqualTo(currentPos) && goal.isEqualTo(goalPos)) {
                for (var e = i; e++; e < test.length) {
                    if (test[e] == '+') {
                        return rawData.substring(i, e);
                    }

                }

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
            roomName: goalRoom
        },
        room: currentRoom,
        path: rawData.substring(20, rawData.length)
    };
    return move;
    // Taking a
}

    var rawData = {};
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

        if (xxx !== undefined) {
            target = new RoomPosition(target, options, this.room.name);
            options = xxx;
        }

        if (_.isUndefined(this.memory.stuckCount)) this.memory.stuckCount = 0;

        var moveStatus;
        if (options === undefined) options = {};
        var stuck = false;

        if (this.memory.position !== undefined) {
            stuck = this.pos.isEqualTo(this.memory.position.x, this.memory.position.y);
        }
        this.memory.position = this.pos;
        if (this.memory.stuckCount > 0)
            this.say('St' + this.memory.stuckCount);

        if (stuck) {
            this.memory.stuckCount++;
            if (this.memory.stuckCount > 5)
                this.memory.stuckCount = 5;
        } else {
            if (this.memory.stuckCount > 0) {
                this.memory.stuckCount--;
            }
        }

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


        if (options.ignoreCreeps) {
            if (this.memory.stuckCount > 2) {
                options.reusePath = 5;
                options.ignoreCreeps = false;
                this.memory._move = undefined;
            }
        }





        var doNew = ['E23S39'];//
        if (!_.contains(doNew, this.room.name)) {
            moveStatus = this.moveTo(target, options);
        } else {
            // new stuff
            var segment = require('commands.toSegment');
            var doPath = false;
            var zz,test;
//            console.log(this);
            console.log('segment Search',this.name,this.pos.x,this.pos.y);
            let home = this.memory.home;
                if (rawData[home] === undefined) {
                    rawData[home] = segment.getRawSegmentRoomData(home);
                } // Now we have rawData[this.room.name], it should be empty in the beginning.
       //          test = serializePath(this);
//                    console.log('serial',rawData[home],this.pos.x, this.pos.y,test);
     //            if(target.x === undefined){
   //                 target = target.pos;
 //                } 

//                 zz = findSerializedPath(rawData[home], this.pos, target);
//                 console.log('XXXXX',zz, this.pos,target);

            if (this.pos.x === 0 || this.pos.x === 49 || this.pos.y === 0 || this.pos.y === 49) {
                 if(target.x === undefined){
                    target = target.pos;
                 } 
                 zz = findSerializedPath(rawData[home], this.pos, target);
                 console.log('LINUSLINUSLINUS',zz, this.pos,target,rawData[home]);
                if (zz === undefined) {
                    // if we don't find the path then. 
//                    doPath = true;
                } else {
                    // Then we use zz to set _move as;
                    // this.memory._move = zz;
                }

            }

            moveStatus = this.moveTo(target, options);
//            test = serializePath(this);
            if(doPath){
                if(rawData[home] !== undefined) {
                    test = serializePath(this);
                    rawData[home] += test+'+';
                    segment.setRoomSegmentData(home, rawData[home]);
                    console.log(zz,'FINALSERIALIZEDPATH',test);
                }
            }

        }

        /*
        Here we'll start the part of the code to look too see if cached
        */


        /*            var datadd = serializePath(creep);
                    var newMove = getSerializedPath(datadd);
                    console.log(datadd, creep.pos);
                    console.log(newMove.dest.x, newMove.dest.y, newMove.dest.roomName);
                    console.log(newMove.room, newMove.path);
                    //4433 E24S34 E24S33 1134 6666656455555555
                    var test = '+3221E19S31E19S31044133333222222222222222222222334+3910E15S45E15S4539107+4433E24S34E24S3311346666656455555555+0930E29S48E29S490331222228222222222222222222221122322+';
                    var goalPos = new RoomPosition(44, 33, 'E24S34');
                    var currentPos = new RoomPosition(11, 34, 'E24S33');
                    console.log(test);
                    var zz = findSerializedPath(test, currentPos, goalPos);
                    console.log(zz, 'PathRETURNED');
                    console.log( getSerializedPath(zz).room );
                    console.log(serializePath(creep) ); */

        //  in commands.ToSegment.
        /* How it works is that there'll be an var that is the memory from
        segment, that if an creep requests a path from it's home, it will have it in
        an var stored in raw data.

        When a creeps is at  x || y  === 0 || 49, it will request to segment to look 
        a stored path in rawData. If it doesn't find one. It will create a moveTo, then
        add it to rawData.
        If it fines one then till will take the rawdata turn it into move and use it.

        // Steps to take to get this done
        // Pick a room
        // The best place to look at locations is before a move, that is outside
        // the room.
        // Have it do the 0||49 posistion check to create move;
        //  else it does normal move.

        // Step 2 is look at the segment
        // step 3 is to have creeps start taking it

                    
        */



        return moveStatus;
    };
};