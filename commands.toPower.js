var job = require('jobs.spawn');
var vis = {
    stroke: '#faF',
    lineStyle: 'dotted',
    strokeWidth: 0.1,
    opacity: 0.5
};
/*
room.memory.powerLevels[PWR_OPERATE_EXTENSION]
    PWR_GENERATE_OPS: 1, Done
    PWR_OPERATE_SPAWN: 2, 100 Done
    PWR_OPERATE_TOWER: 3, Done
    PWR_OPERATE_STORAGE: 4, 100 Done
    PWR_OPERATE_LAB: 5, Done
    PWR_OPERATE_EXTENSION: 6, Done
    PWR_OPERATE_OBSERVER: 7, 10  Done
    PWR_OPERATE_TERMINAL: 8, 100 Done
    PWR_DISRUPT_SPAWN: 9,
    PWR_DISRUPT_TOWER: 10,
    PWR_DISRUPT_SOURCE: 11,
    PWR_SHIELD: 12, Done
    PWR_REGEN_SOURCE: 13, DOne
    PWR_REGEN_MINERAL: 14, Done
    PWR_DISRUPT_TERMINAL: 15,
    PWR_OPERATE_POWER: 16, Done
    PWR_FORTIFY: 17, 5 Done
    PWR_OPERATE_CONTROLLER: 18, Done
    PWR_OPERATE_FACTORY: 19
*/

function setPowerRoomLevel(powercrp) {
    // This function is designed to add to room memory about powerStats
    // Stats have level and ready - if cooldown is 0 or not.
    let flag = powercrp.flag;
    flag.memory.powerCreepFlag = true;
    let room = Game.rooms[flag.pos.roomName];
    if (!room) return;
    let levels = {
        /*        PWR_GENERATE_OPS: 1, Done
                PWR_OPERATE_TOWER: 3, Done
                PWR_OPERATE_SPAWN: 2, 
                PWR_OPERATE_LAB: 5,
                PWR_OPERATE_STORAGE: 4,
                PWR_OPERATE_OBSERVER: 7, DOne
                PWR_OPERATE_TERMINAL: 8,

                PWR_OPERATE_EXTENSION: 6, Done
                PWR_DISRUPT_SPAWN: 9,
                PWR_DISRUPT_TOWER: 10,
                PWR_DISRUPT_SOURCE: 11,
                PWR_SHIELD: 12,
                PWR_REGEN_SOURCE: 13, Done
                PWR_REGEN_MINERAL: 14, Done
                PWR_DISRUPT_TERMINAL: 15,
                PWR_OPERATE_POWER: 16,
                PWR_FORTIFY: 17,
                PWR_OPERATE_CONTROLLER: 18,
                PWR_OPERATE_FACTORY: 19*/
    };

    if (!flag.memory.doPowerOrder || flag.memory.doPowerOrder.length !== Object.keys(powercrp.powers).length) {
        flag.memory.doPowerOrder = [];
        for (let e in powercrp.powers) {
            flag.memory.doPowerOrder.push(parseInt(e));
        }
    }
    for (let e in powercrp.powers) {
        if (!levels[e]) {
            levels[e] = {
                level: powercrp.powers[e].level,
                ready: powercrp.powers[e].cooldown > 0 ? false : true,
            };
        } else {
            levels[e].level += powercrp.powers[e].level;
            levels[e].ready = powercrp.powers[e].cooldown > 0 ? false : true;
        }
    }
    room.memory.powerLevels = levels;
}

function doOperateController(powercrp) {
    powercrp.say('oContr');
    if(!Memory.empireSettings.powers.controller) {
        powercrp.memory.currentPowerJob = undefined;
        return false;
    }
    if (getOps(powercrp, 200)) return true;
    if (powercrp.pos.inRangeTo(powercrp.room.controller, 3)) {
        if (powercrp.usePower(PWR_OPERATE_CONTROLLER, powercrp.room.controller) === OK) {
            if (powercrp.powers[PWR_OPERATE_CONTROLLER].level > 3) {
                require('commands.toSpawn').setModuleRole(powercrp.room.name, 'upgrader', 2, 7);
            } else {
                require('commands.toSpawn').setModuleRole(powercrp.room.name, 'upgrader', 1, 7);
            }
            powercrp.memory.currentPowerJob = undefined;
        }
    } else {
        powercrp.moveMe(powercrp.room.controller, { reusePath: 25 });
    }
    return true;

}

function requestFollower(powercrp, creep) {
    /* creep Object uses
        memory :{role : 'fighter',
                 level : 3,                  },
        name : 'break',
        build : [MOVE,MOVE,CARRY],
        boost : ['XGH2O'],
        
    */
    if (!_.isObject(creep)) {
        if (_.isString(creep)) {
            switch (creep) {
                //                case :

                //              break;
                default:

                    break;
            }
        }
    } else {
        // Then create teh object spawns need.
        let temp = {
            build: creep.build,
            name: creep.name + " follower of " + powercrp.name,
            memory: {
                role: expandRole[e],
                home: spawn.room.name,
                party: powercrp.name,
                //parent://
                boostNeeded: creep.boost,
                followerOf: powercrp.name
            }
        };

    }
    // We need spawn

    // Then we shift it into the spawn.create array;
    // When return true 
}

function analyzeRampartsToFortifyZz(powercrp) {
    if (powercrp.powers[PWR_FORTIFY] === undefined) return false;
    if (getOps(powercrp, 10)) return true;
    let eventLog = powercrp.room.getEventLog();
    let attackEvents = _.filter(eventLog, { event: EVENT_ATTACK });
    let targets = {};
    attackEvents.forEach(event => {
        // So we should figure out what hits what in that tick.
        // TargetID is important.
        if (targets[event.targetId] === undefined) {
            targets[event.data.targetId] = 0;
        }
        targets[event.data.targetId]++;
    });
    var targetID;
    var lowest = 0;
    for (let i in targets) {
        if (targets[i] > 0) {
            lowest = targets[i];
            targetID = i;
        }
    }
    let target = Game.getObjectById(targetID);
    if (!target) {
        console.log('no Target', targetID);
        return false;
    }
    console.log(target, "Finding target to foritfy", target.pos, "struct type?", target.structureType);
    if (powercrp.pos.inRangeTo(target, 3)) {
        if (powercrp.usePower(PWR_FORTIFY, target) === OK) {
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.sleep = 5;
        }
    } else {
        powercrp.moveMe(target, { reusePath: 25, range: 3 });
    }
    powercrp.say('Pew', true);
    return true;
}

function doShield(powercrp) {
    if (!powercrp.powers[PWR_SHIELD]) return;
    if (powercrp.usePower(PWR_SHIELD) === OK) {
    } else {
        console.log('trying to do shiled', roomLink(powercrp.room.name));
    }
}

function doOperateStorage(powercrp) {
    let storage = powercrp.room.storage;
    powercrp.say('oStor', true);
    if (getOps(powercrp, 100)) return true;
    /*if (powercrp.carry.ops < 100) {
        console.log(powercrp.moveToWithdraw(powercrp.room.terminal, 'ops', 100));
        return true;
    }*/
    if (powercrp.pos.inRangeTo(storage, 3)) {
        if (powercrp.usePower(PWR_OPERATE_STORAGE, storage) === OK) {
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.findJob = true;
            powercrp.memory.lockPowerJob = undefined;
        }
    } else {
        powercrp.moveMe(storage, { reusePath: 25 });
    }
    return true;
}

function getOps(powercrp, amnt) {
    if (powercrp.carry.ops >= amnt) return false;
    if (!powercrp.room.terminal || !powercrp.room.terminal.store.ops || powercrp.room.terminal.store.ops < amnt) {
        roomRequestMineral(powercrp.room.name, 'ops', 1000);
    }

    if (powercrp.carryAvailable < amnt) {
        powercrp.moveToTransfer(powercrp.room.terminal, powercrp.carrying);
        return true;
    }
    powercrp.moveToWithdraw(powercrp.room.terminal, 'ops', amnt);
    return true;
}

function doOperateTerminal(powercrp) {
    let terminal = powercrp.room.terminal;
    powercrp.say('oTerm', true);
    if (getOps(powercrp, 100)) return true;
    if (powercrp.pos.inRangeTo(terminal, 3)) {
        if (powercrp.usePower(PWR_OPERATE_TERMINAL, terminal) === OK) {
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.findJob = true;
            powercrp.memory.lockPowerJob = undefined;
        }
    } else {
        powercrp.moveMe(terminal, { reusePath: 25 });
    }
    return true;
}


function doOperateSpawn(powercrp) {
    let spawn = powercrp.room.alphaSpawn;
    if(powercrp.memory.operateSpawnID){
        spawn = Game.getObjectById(powercrp.memory.operateSpawnID);
        if(!spawn){
            powercrp.memory.operateSpawnID = undefined;
        }
    }
    powercrp.say('oPspwn');
    if (getOps(powercrp, 100)) return true;
    if (powercrp.pos.inRangeTo(spawn, 3)) {
        if (powercrp.usePower(PWR_OPERATE_SPAWN, spawn) === OK) {
            powercrp.memory.findJob = true;
            powercrp.memory.currentPowerJob = undefined;
            powercrp.room.memory.aSpawnOperated = 1000;
        }
    } else {
        powercrp.moveMe(spawn, { reusePath: 25 });
    }
    return true;
}


function doOperateObserver(powercrp) {
    let observer = powercrp.room.observer;
    powercrp.say('obs');
    if (getOps(powercrp, 10)) return true;

    if (powercrp.pos.inRangeTo(observer, 3)) {
        if (powercrp.usePower(PWR_OPERATE_OBSERVER, observer) === OK) {
            powercrp.memory.findJob = true;
            powercrp.memory.currentPowerJob = undefined;
        }
    } else {
        powercrp.moveMe(observer, { reusePath: 25 });
    }
    return true;
}

function doOperatePower(powercrp) {
    powercrp.say('pwr');
    if (getOps(powercrp, 200)) return true;

    let powerspawn = powercrp.room.powerspawn;
    if (powercrp.pos.inRangeTo(powerspawn, 3)) {
        if (powercrp.usePower(PWR_OPERATE_POWER, powerspawn) === OK) {
            powercrp.memory.findJob = true;
            powercrp.memory.currentPowerJob = undefined;
        }
    } else {
        powercrp.moveMe(powerspawn, { reusePath: 25 });
    }
    return true;
}

function isTowerOperated(tower, power) {
    if (!tower.effects || tower.effects.length === 0) return false;
    for (let i in tower.effects) {
        if (tower.effects[i].power === power) return true;
    }
    return false;
}

function doOperateTower(powercrp) {
    if (powercrp.powers[PWR_OPERATE_TOWER] === undefined) return false;
    if (powercrp.room.towers.length === 0) return false;
    console.log(roomLink(powercrp.room.name), 'doing operate Tower!!');
    if (getOps(powercrp, 100)) return true;
    for (let i in powercrp.room.towers) {
        let tower = powercrp.room.towers[i];
        if (!isTowerOperated(tower, PWR_OPERATE_TOWER)) {
            powercrp.room.visual.text('X', tower.pos);
            if (powercrp.pos.inRangeTo(tower, 3)) {
                if (powercrp.powers[PWR_OPERATE_TOWER].cooldown === 0) powercrp.usePower(PWR_OPERATE_TOWER, tower);
            } else {
                powercrp.moveMe(tower, { reusePath: 15, range: 3 });
            }
            return true;
        } else {
            powercrp.room.visual.text('P', tower.pos);
        }
    }
}

function doOperateSource(powercrp) {
    //    if (powercrp.powers[PWR_REGEN_SOURCE] && powercrp.powers[PWR_REGEN_SOURCE].cooldown === 0) {
    if (powercrp.memory.sourcesID === undefined) {
        powercrp.memory.sourcesID = [];
        var sources = powercrp.room.find(FIND_SOURCES);
        for (let i in sources) {
            powercrp.memory.sourcesID.push(sources[i].id);
        }
    }
    let source = Game.getObjectById(powercrp.memory.sourcesID[powercrp.memory.sourceNum]);
    powercrp.say('source');
    if (powercrp.memory.sourceNum === undefined) powercrp.memory.sourceNum = 0;
    if (powercrp.memory.sourceNum > powercrp.memory.sourcesID.length - 1) {
        powercrp.memory.sourceNum = 0;
    }

    if (powercrp && powercrp.pos.inRangeTo(source, 3)) {
        if (powercrp.usePower(PWR_REGEN_SOURCE, source) === OK) {
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.findJob = true;
            powercrp.memory.sourceNum++;
            if (powercrp.memory.sourceNum > powercrp.memory.sourcesID.length - 1) powercrp.memory.sourceNum = 0;
        }
    } else {
        powercrp.moveMe(source, { reusePath: 25, visualizePathStyle: vis, range: 3 });
    }
    return true;
    //  }
}

function doGenerateOps(powercrp) {
    if (powercrp.powers[PWR_GENERATE_OPS] && powercrp.powers[PWR_GENERATE_OPS].cooldown === 0) {
        if (powercrp.carryTotal < powercrp.carryCapacity) {
            powercrp.usePower(PWR_GENERATE_OPS);
            powercrp.say('gen');
        } else {
            powercrp.drop('energy', 10);
        }
    }

}

function doRoomNoPower(powercrp) {
    if (powercrp.room.controller && !powercrp.room.controller.isPowerEnabled && powercrp.flag.color === COLOR_WHITE) {


        if (powercrp.ticksToLive < 400 && powercrp.room.powerspawn && powercrp.room.powerspawn.my) {
            if (powercrp.pos.isNearTo(powercrp.room.powerspawn)) {
                powercrp.renew(powercrp.room.powerspawn);
            } else {
                powercrp.moveTo(powercrp.room.powerspawn, { reusePath: 50, visualizePathStyle: vis });
            }
            powercrp.say('renew');
            return true;
        }
        if (powercrp.memory.sleep && powercrp.memory.sleep > 0) {
            powercrp.memory.sleep--;
            powercrp.say('zz');
            return true;
        }
        powercrp.memory.roleID = 0;
        if (powercrp.memory.home === undefined) {
            powercrp.memory.home = 'E1S11';
        }
        powercrp.memory.level = powercrp.level;

        switch (powercrp.memory.currentPowerJob) {
            case 69:
                if (doFillTower(powercrp)) return;
                break;
        }

        if (powercrp.name === 'Auroth') {
            require('army.merchant').run(powercrp);
            return true;
        }
        if (powercrp.name === 'Grimstroke') {
            require('army.merchant').run(powercrp);
            return true;
        }
        if (powercrp.name === 'Lina') {
            require('army.merchant').run(powercrp);
            return true;
        }

        powercrp.room.memory.noHauler = true;
        require('role.job').run(powercrp);
        return true;
    }
}

function doSleep(powercrp) {
    if (powercrp.memory.sleep && powercrp.memory.sleep > 0) {
        powercrp.memory.sleep--;
        powercrp.say('zz');
        return true;
    }
}

function doRenew(powercrp) {
    if(powercrp.memory.noRenewRemoveFlag){
        powercrp.flag.remove = true;
    }

    if (powercrp.pos.isNearTo(powercrp.room.powerspawn)) {
        powercrp.renew(powercrp.room.powerspawn);
    } else {
        powercrp.moveTo(powercrp.room.powerspawn, { reusePath: 50, visualizePathStyle: vis });
    }
    powercrp.say('renew');
    return true;


}

function setControllerPower(powercrp) {
    if (powercrp.room.controller && !powercrp.room.controller.isPowerEnabled) {
        if (powercrp.flag.color !== COLOR_CYAN) {
            //                        powercrp.flag.room.text('CHange Flag Color to CYAN in order to add power to room', powercrp.flag.pos);
            return false;
        } else {
            if (powercrp.pos.isNearTo(powercrp.room.controller)) {
                powercrp.enableRoom(powercrp.room.controller);
            } else {
                powercrp.moveTo(powercrp.room.controller, { reusePath: 50, visualizePathStyle: vis });
            }
        }
        return true;
    }

}

function doDeath(powercrp) {
    if (powercrp.memory.death) {
        if (powercrp.carryTotal > 0) {
            powercrp.moveToTransfer(powercrp.room.storage, powercrp.carrying);
        } else {
            powercrp.suicide();
        }
        powercrp.say('D');
        return true;
    }
}

function doStoreOps(powercrp) {
    if (powercrp.carry.ops > 150 && powercrp.pos.isNearTo(powercrp.room.storage) && powercrp.store) {
        powercrp.transfer(powercrp.room.storage, 'ops', powercrp.store.ops - 50);
        return true;
    }
}

function doOperateMineral(powercrp) {
    let mineral = powercrp.room.mineral;

    powercrp.say('MIneral');
    //    if (powercrp.powers[PWR_REGEN_MINERAL] && powercrp.powers[PWR_REGEN_MINERAL].cooldown < 20 && mineral && !mineral.ticksToRegeneration) {
    if (powercrp.pos.inRangeTo(mineral, 2)) {
        if (powercrp.carryTotal < powercrp.carryCapacity - 100) {
            var targetContain = Game.getObjectById(powercrp.room.memory.mineralContainID);
            if (targetContain && targetContain.total > 0 && powercrp.pos.isNearTo(targetContain)) {
                for (let e in targetContain.store) {
                    if (targetContain.store[e] > 0) {
                        powercrp.withdraw(targetContain, e);
                        powercrp.say('CT');
                        break;
                    }
                }
            }

            let harvester = Game.getObjectById(powercrp.memory.harvesterID);
            if (harvester && harvester.carryTotal > 100 && powercrp.pos.isNearTo(harvester)) {
                harvester.transfer(powercrp, harvester.carrying);
                powercrp.say('HT');
                return true;
            }
        }
        let rsut = powercrp.usePower(PWR_REGEN_MINERAL, mineral);
        if (rsut === OK) {
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.findJob = true;
        }
    } else {
        powercrp.moveMe(mineral, { reusePath: 50, range: 1 });
    }
    return true;
    //  }

}

function doFillTower(powercrp) {
    let zz;
    let target = Game.getObjectById(powercrp.memory.towerTargetID);
    if (powercrp.memory.towerTargetID === undefined || !target || target && target.energy === 1000) {
        zz = powercrp.room.find(FIND_STRUCTURES, { filter: o => o.energy < 900 && o.structureType == STRUCTURE_TOWER });

        if (zz.length > 0) {
            powercrp.memory.towerTargetID = zz[0].id;
        } else {
            powercrp.memory.currentPowerJob = undefined;
            return false;
        }

    }
    if (powercrp.carry[RESOURCE_ENERGY] > 0) {
        powercrp.moveToTransfer(target, RESOURCE_ENERGY);
    } else {
        // getEnergy(creep);
        powercrp.moveToWithdraw(powercrp.room.storage, RESOURCE_ENERGY);
    }
    return true;
}

function doOperateExtension(powercrp) {
    // OperateExtension when ready will stop all roomFilling duties
    if (getOps(powercrp, 2)) return true;
    let tgt;
    if (powercrp.room.storage.store[RESOURCE_ENERGY] > 10000) {
        tgt = powercrp.room.storage;
    } else {
        tgt = powercrp.room.terminal;
    }

    if (!powercrp.pos.inRangeTo(tgt, 3)) {
        powercrp.moveMe(tgt, { reusePath: 25, range: 3 });
    } else {
        let rest = powercrp.usePower(PWR_OPERATE_EXTENSION, tgt);
        if (rest === OK) {
            powercrp.room.memory.DOEXTENSIONPOWER = undefined;
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.findJob = true;
        }
    }
    powercrp.say('Extension');
    return true;
}

function doOperateLab(powercrp) {

    if (getOps(powercrp, 10)) return true;

    let targetLab = Game.getObjectById(powercrp.memory.currentLabTarget);
    if (targetLab === null || targetLab.isEffected()) {
        powercrp.memory.currentPowerJob = undefined;
        powercrp.memory.currentLabTarget = undefined;
        return false;
    }
    /*
    let numReact = 1000 / REACTION_TIME[powercrp.room.memory.lab2Mode];
    let minNeed = Math.ceil(numReact * ((powercrp.powers[PWR_OPERATE_LAB].level * 2) + 5));
    minNeed = effectLabs * minNeed;
    if (lab1.mineralAmount > minNeed && lab2.mineralAmount > minNeed) {*/
    //  if(lab1.mineralAmount > 2500 && lab2.mineralAmount > 2500){
    if (powercrp.pos.inRangeTo(targetLab, 3)) {
        let rsut = powercrp.usePower(PWR_OPERATE_LAB, targetLab);
        if (rsut === OK) {
            powercrp.room.memory.labsNeedWork = true;
            powercrp.memory.currentPowerJob = undefined;
            powercrp.memory.currentLabTarget = undefined;
            powercrp.memory.findJob = true;
        }
    } else {
        powercrp.moveMe(targetLab, { reusePath: 20, range: 3 });
    }
    powercrp.room.visual.text('T', targetLab.pos);
    powercrp.say('lab');
    //    console.log(roomLink(powercrp.room.name), "doing lab Effects");
    return true;
    //    }
}

function doRole(powercrp) {
    powercrp.room.memory.noAlphaJob = true;

    if (powercrp.room.memory.maxLinkers > 0) {
        powercrp.memory.roleID = 1;
    } else {
        powercrp.memory.roleID = 0;
    }
    powercrp.memory.home = powercrp.flag.pos.roomName;
    powercrp.memory.level = powercrp.level;
    if (powercrp.room.name !== powercrp.flag.pos.roomName) {
        powercrp.moveMe(powercrp.flag, { reusePath: 25 });
    } else {
        require('role.job').run(powercrp);
    }
}

function doShieldFortify(powercrp) {
    // needs both powers of foritfy and
    //PWR_SHIELD: 12,
    //PWR_FORTIFY: 17,
    if (powercrp.memory.canShieldFortify === undefined) {
        if (powercrp.powers[PWR_SHIELD] && powercrp.powers[PWR_FORTIFY]) {
            powercrp.memory.canShieldFortify = true;
        } else {
            powercrp.memory.canShieldFortify = false;
        }
    }
    if (!powercrp.memory.canShieldFortify) return;
    if (powercrp.memory.doFortNextTick) {
        res = powercrp.room.lookAt(powercrp.pos.x, powercrp.pos.y);
        if (res.length > 0) {
            for (let ee in res) {
                console.log(powercrp, res[ee].structure, res[ee].structure.structureType);
                if (res[ee].structure !== undefined && res[ee].structure.structureType === STRUCTURE_RAMPART) {
                    powercrp.memory.doFortNextTick = undefined;
                    powercrp.memory.shieldID = res[ee].structure.id;
                    break;
                }
            }
        }
    }
    if (powercrp.memory.shieldID) {
        let tgt = Game.getObjectById(powercrp.memory.shieldID);
        if (tgt) {
            console.log(powercrp.usePower(PWR_FORTIFY, tgt), tgt);
        } else {
            powercrp.memory.shieldID = undefined;
        }
    }
    if (powercrp.powers[PWR_SHIELD].cooldown === 0) {
        if (powercrp.usePower(PWR_SHIELD) === OK) {
            powercrp.memory.doFortNextTick = true;
        }
    }

}


function determineJob(powercrp) {
    if (Game.time % 5 === 0) {

        let flag = powercrp.flag;
        for (let i in flag.memory.doPowerOrder) {

            flag.memory.doPowerOrder[i] = parseInt(flag.memory.doPowerOrder[i]);
            //            console.log(flag.memory.doPowerOrder[i] === parseInt( PWR_REGEN_SOURCE ) , _.isString( PWR_REGEN_SOURCE ) , _.isString(flag.memory.doPowerOrder[i]) );
            if (powercrp.powers[flag.memory.doPowerOrder[i]]) {
                switch (flag.memory.doPowerOrder[i]) {
                    case PWR_FORTIFY:
                        //flag.memory.doPowerOrder.splice(i,1);
                        break;
                    case PWR_OPERATE_LAB:
                        //                console.log(powercrp.powers[flag.memory.doPowerOrder[i]].cooldown ,powercrp.powers[flag.memory.doPowerOrder[i]].level , powercrp.room.memory.lab2Mode, powercrp.room.name          );
                        if(powercrp.flag.memory.doLabPower === undefined){
                            powercrp.flag.memory.doLabPower = true;
                        }
                        if (powercrp.flag.memory.doLabPower && powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0 && powercrp.room.memory.lab2Mode !== 'none') {

                            //&& Memory.stats && Memory.stats.totalMinerals && Memory.stats.totalMinerals[powercrp.room.memory.lab2Mode] < 200000
                            let labs = powercrp.room.memory.labs;
                            let lab1 = Game.getObjectById(labs[0].id);
                            let lab2 = Game.getObjectById(labs[1].id);
                            if (!lab1 || !lab2 || !lab1.mineralAmount || lab1.mineralAmount < 1000 || !lab1.mineralAmount || lab2.mineralAmount < 1000) {
                                powercrp.room.memory.labsNeedWork = true;
                            } else {

                                if (powercrp.memory.currentLabTarget === undefined) {
                                    for (let i = 2; i < labs.length; i++) {
                                        let zed = Game.getObjectById(labs[i].id);
                                        if (zed && !zed.isEffected() && zed.cooldown < 200) {
                                            powercrp.memory.currentLabTarget = labs[i].id;
                                            return flag.memory.doPowerOrder[i];
                                        }
                                    }
                                } else {
                                    let zeed = Game.getObjectById(powercrp.memory.currentLabTarget);
                                    if (zeed) {
                                        return flag.memory.doPowerOrder[i];
                                    } else {
                                        powercrp.memory.currentLabTarget = undefined;
                                    }
                                }
                            }

                        }
                        break;
                    case PWR_OPERATE_EXTENSION:
                        let amnt = powercrp.stats('extension') * 0.5;
                        if (amnt < 2000) {
                            amnt = 2000;
                        }
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0 && ((powercrp.room.energyAvailable < (powercrp.room.energyCapacityAvailable - amnt)) || powercrp.room.memory.DOEXTENSIONPOWER)) {
                            return flag.memory.doPowerOrder[i];
                        }
                        break;
                    case PWR_REGEN_SOURCE:
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0) {
                            return flag.memory.doPowerOrder[i];
                        }
                        break;
                    case PWR_OPERATE_POWER:
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0 && powercrp.room.name === 'E25Sx37' && powercrp.room.powerspawn) { //&& powercrp.room.powerspawn.power > 20
                            let powerspawn = powercrp.room.powerspawn;
                            /*let perTickProcess = powercrp.powers[PWR_OPERATE_POWER].level + 1;
                            let energyNeed = 50000 * perTickProcess;
                            let storage = powercrp.room.storage;
                            let powerNeed = perTickProcess * 1000;
                            if (storage.store[RESOURCE_ENERGY] > energyNeed && powerspawn.room.terminal.store[RESOURCE_POWER] >= powerNeed) {*/
                            return flag.memory.doPowerOrder[i];
                            //}
                        }
                        break;
                    case PWR_OPERATE_OBSERVER:
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0 && powercrp.room.name === Memory.empireSettings.boostObserverRoom[Game.shard.name] && powercrp.room.observer) {
                            let affect = powercrp.room.observer.isEffected(PWR_OPERATE_OBSERVER);
                            if(!affect || affect.ticksRemaining < 10) {
                                if (!powercrp.memory.lockPowerJob && affect) powercrp.memory.lockPowerJob = affect.ticksRemaining;
                                return flag.memory.doPowerOrder[i];
                            }
                        }

                        break;
                    case PWR_OPERATE_SPAWN:
                            if (powercrp.flag.memory.spawnOperateOpts === undefined) {
                                powercrp.flag.memory.spawnOperateOpts = {
                                    maxSpawns: 0,
                                };
                            }
                        if(powercrp.flag.memory.spawnOperateOpts.maxSpawns === 0) continue;
                        if (powercrp.room.name === 'E13S18' && powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0) {
                            if (powercrp.room.memory.spawnIDs === undefined || powercrp.room.memory.spawnIDs.length !== 3) {
                                var test2 = _.filter(powercrp.room.find(FIND_STRUCTURES), function(o) {
                                    return o.structureType === STRUCTURE_SPAWN;
                                }); // This is something is not on a rampart
                                powercrp.room.memory.spawnIDs = [];
                                for (let i in test2) {
                                    powercrp.room.memory.spawnIDs.push(test2[i].id);
                                }
                            }


                            let spawns = []; // Array of spawns that want operate.
                            for (let i in powercrp.room.memory.spawnIDs) {
                                let zeed = Game.getObjectById(powercrp.room.memory.spawnIDs[i]);
                                if (zeed) {
                                    let affect = zeed.isEffected(PWR_OPERATE_SPAWN);
                                    if (affect) {
                                        if (affect.ticksRemaining < 20) {
                                            spawns.push(zeed);
                                            if (!powercrp.memory.lockPowerJob) powercrp.memory.lockPowerJob = affect.ticksRemaining;
                                        } else {
                                        }
                                    } else {
                                        spawns.push(zeed);
                                    }
                                } else {
                                    powercrp.room.memory.spawnIDs[i] = undefined;
                                }
                            }
                            let spawnsEffected = 3 - spawns.length;

                            if ( spawns.length > 0 && spawnsEffected < powercrp.flag.memory.spawnOperateOpts.maxSpawns) {
                                // we determine that we need a spawn to operate on.
                                powercrp.memory.operateSpawnID = spawns[0].id;
                                return flag.memory.doPowerOrder[i];
                            }
                        }
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0 && powercrp.room.name === 'E25S37' && !powercrp.room.alphaSpawn.isEffected(PWR_OPERATE_SPAWN)) {
                            return flag.memory.doPowerOrder[i];
                        } else if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0 && powercrp.room.alphaSpawn && !powercrp.room.alphaSpawn.isEffected(PWR_OPERATE_SPAWN) && powercrp.room.alphaSpawn.memory.totalQuery > 5 && powercrp.room.energyAvailable > powercrp.room.energyCapacityAvailable >> 1) {
                            return flag.memory.doPowerOrder[i];
                        }

                        break;
                    case PWR_REGEN_MINERAL:
                        let mineral = powercrp.room.mineral;
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown < 20 && mineral && !mineral.ticksToRegeneration) {
                            if (!powercrp.memory.lockPowerJob) powercrp.memory.lockPowerJob = 19;
                            return flag.memory.doPowerOrder[i];

                        }

                        break;

                    case PWR_OPERATE_TERMINAL:


                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0) {
                            if (powercrp.room.memory.useTerminalOperate) {
                                let termEffects = powercrp.room.terminal.isEffected(PWR_OPERATE_TERMINAL);
                                if (termEffects.ticksRemaining < 20) {
                                    if (!powercrp.memory.lockPowerJob) powercrp.memory.lockPowerJob = termEffects.ticksRemaining;
                                    return flag.memory.doPowerOrder[i];
                                }
                            }
                            if (powercrp.room.memory.useTerminalOperate && !powercrp.room.terminal.isEffected(PWR_OPERATE_TERMINAL)) {
                                return flag.memory.doPowerOrder[i];
                            }
                        }
                        break;
                    case PWR_OPERATE_STORAGE:
                        if (powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0) {
                            if (powercrp.room.memory.useStorageOperate) {
                                let storageEffects = powercrp.room.storage.isEffected(PWR_OPERATE_STORAGE);
                                if (storageEffects.ticksRemaining < 20) {
                                    if (!powercrp.memory.lockPowerJob) powercrp.memory.lockPowerJob = storageEffects.ticksRemaining;
                                    return flag.memory.doPowerOrder[i];
                                }
                            }

                            if (powercrp.room.memory.useStorageOperate && !powercrp.room.storage.isEffected(PWR_OPERATE_STORAGE)) {
                                return flag.memory.doPowerOrder[i];
                            }
                        }
                        break;
                    case PWR_OPERATE_CONTROLLER:
                    if(powercrp.powers[flag.memory.doPowerOrder[i]] && Memory.empireSettings.powers.controller)
                        if (!powercrp.powers[flag.memory.doPowerOrder[i]].cooldown  || powercrp.powers[flag.memory.doPowerOrder[i]].cooldown === 0) {
                            if (powercrp.flag.memory.useControllerOperate === undefined) {
                                powercrp.flag.memory.useControllerOperate = false;
                            }
                            if (powercrp.flag.memory.useControllerOperate) {
                                let contEffects = powercrp.room.controller.isEffected(PWR_OPERATE_CONTROLLER);
                                if (contEffects.ticksRemaining < 20) {
                                    if (!powercrp.memory.lockPowerJob) powercrp.memory.lockPowerJob = contEffects.ticksRemaining;
                                    return flag.memory.doPowerOrder[i];
                                }
                                if ( !contEffects) {
                                    return flag.memory.doPowerOrder[i];
                                }
                            }
                        }

                        break;
                }
            }
        }
    }
}

function attackingOps(powercrp) {
    let flag = powercrp.flag;
    flag.memory.musterRoom = 'close';
    flag.memory.musterType = 'operator';
    flag.memory.rallyFlag = 'home';
    flag.memory.tusken = false;
    //    flag.memory.moveSquad
    // now we have flag we need to do operations.

    // Determine when to Shield here
    if (powercrp.ticksToLive < 4000) {
        if (powercrp.room.powerspawn && powercrp.room.powerspawn.my) {
            doRenew(powercrp);
            return;
        }
    }
    if (!flag.memory.squadID || !flag.memory.squadID.length) {
        if (powercrp.room.memory.boost) {
            require('jobs.spawn').doBoostLab(powercrp);
            powercrp.say('bost');
            return;
        }
        // This power is used when mustering it's own party

        if (powercrp.powers[PWR_OPERATE_EXTENSION] && powercrp.room.storage && powercrp.room.storage.my) {
            if (powercrp.powers[PWR_OPERATE_EXTENSION].cooldown === 0 && powercrp.room.energyAvailable < powercrp.room.energyCapacityAvailable - 2000) {
                doOperateExtension(powercrp);
                return;
            }
        }
    }
    if (powercrp.powers[PWR_SHIELD]) {
        if (powercrp.hits < powercrp.hitsMax >> 1) {
            powercrp.memory.currentPowerAction = PWR_SHIELD;
            console.log(powercrp, 'needs to do heal?', powercrp.hits, powercrp.hitsMax << 1);
        }
    }
    // Gathering Ops for future use.
    if (powercrp.room.terminal && powercrp.room.terminal.my && powercrp.carryTotal < powercrp.carryCapacity - 100) {
        powercrp.moveToWithdraw(powercrp.room.terminal, 'ops');
        if (!powercrp.room.terminal.store.ops || powercrp.room.terminal.store.ops < 2600) {
            roomRequestMineral(powercrp.room.name, 'ops', 5000);
        }
        powercrp.say('gOps');
        return;
    }
    var doSquadLogic = true;

    // squad stuff now...
//    if (flag.memory.squadID && flag.memory.squadID.length) {
        if (powercrp.powers[PWR_DISRUPT_TOWER] && powercrp.room.towers && powercrp.room.towers.length && !powercrp.room.towers[0].my) { //
            for (let i in powercrp.room.towers) {
                let tower = powercrp.room.towers[i];
                //console.log(tower.isEffected());
                if (!tower.isEffected()) {
                    powercrp.memory.towerID = tower.id;
                    powercrp.memory.currentPowerAction = PWR_DISRUPT_TOWER;
                    break;
                }
            }
        }
        if (powercrp.memory.currentPowerAction === PWR_SHIELD) doSquadLogic = false;
  //  } else {
    //    console.log(powercrp.memory.currentPowerAction, "power action Single Action");
    //}

    // Actions tuff

    switch (powercrp.memory.currentPowerAction) {
        case PWR_SHIELD:
            powercrp.usePower(PWR_SHIELD);
            for (let i in squad) {
                squad[i].heal(powercrp);
            }
            //doSquadLogic = false;
            break;
        case PWR_DISRUPT_SPAWN:
            // Rnage 20
            let spawnTarget = Game.getObjectById(powercrp.memory.spawnID);
            if (spawnTarget) {
                if (powercrp.pos.inRangeTo(spawnTarget, 20)) {
                    if (powercrp.usePower(PWR_DISRUPT_SPAWN, spawnTarget) === OK) {
                        powercrp.memory.spawnID = undefined;
                        powercrp.memory.currentPowerAction = undefined;
                        flag.memory.moveSquad = undefined;
                    }
                    flag.memory.moveSquad = undefined;
                } else {
                    flag.memory.moveSquad = spawnTarget.pos;
                    flag.memory.moveRange = 3;
                }
            } else {
                powercrp.memory.currentPowerAction = undefined;
                powercrp.memory.spawnID = undefined;
                powercrp.say('notgt');
            }

            break;
        case PWR_DISRUPT_TOWER:
            // Range 50
            let towerTarget = Game.getObjectById(powercrp.memory.towerID);
            if (towerTarget) {

                if (powercrp.usePower(PWR_DISRUPT_TOWER, towerTarget) === OK) {
                    powercrp.memory.towerID = undefined;
                    powercrp.memory.currentPowerAction = undefined;
                    flag.memory.moveSquad = undefined;
                }

            } else {
                powercrp.memory.currentPowerAction = undefined;
                powercrp.memory.towerID = undefined;
            }


            break;
        case PWR_DISRUPT_SOURCE:
            // range 3 //moveSquad 
            let sourceTarget = Game.getObjectById(powercrp.memory.sourceID);
            if (sourceTarget) {
                if (powercrp.pos.inRangeTo(sourceTarget, 3)) {
                    if (powercrp.usePower(PWR_DISRUPT_SOURCE, sourceTarget) === OK) {
                        powercrp.memory.sourceID = undefined;
                        powercrp.memory.currentPowerAction = undefined;
                        flag.memory.moveSquad = undefined;

                    }
                } else {
                    flag.memory.moveSquad = sourceTarget.pos;
                    flag.memory.moveRange = 3;
                }
            } else {
                powercrp.memory.currentPowerAction = undefined;
                powercrp.memory.sourceID = undefined;
                powercrp.say('notgt');
            }
            break;
        case PWR_DISRUPT_TERMINAL:
            // range 50
            let terminal = powercrp.room.terminal;
            if (terminal) {
                if (powercrp.usePower(PWR_DISRUPT_TERMINAL, terminal) === OK) {
                    powercrp.memory.currentPowerAction = undefined;
                    flag.memory.moveSquad = undefined;

                }
            }
            break;
    }
    if (flag.memory.squadID && flag.memory.squadID.length) {
        let squad = [];
        for (let i in flag.memory.squadID) {
            let ez = Game.getObjectById(flag.memory.squadID[i]);
            if (ez) {
                squad.push(ez);
            } else {
                flag.memory.squadID[i] = undefined;
            }
        }

        if (doSquadLogic) {
            if (!powercrp.memory.battlePos) { // Not having battlePOs means it's not in formation
                if (!powercrp.pos.isEqualTo(flag)) {
                    powercrp.moveMe(flag, { reusePath: 15 });
                }
            } else {
                squad.push(powercrp);
            }
            require('commands.toSquad').runSquad(squad);
        }

    } else {
        if (!powercrp.pos.isEqualTo(flag)) {
            powercrp.moveMe(flag, { reusePath: 15 });
        }

    }

}


class PowerInteract {


    static runPowerCreeps() {
        for (let i in Game.powerCreeps) {
            let powercrp = Game.powerCreeps[i];

            if (!powercrp.ticksToLive) {
                // Here we spawn.
                if (Game.flags[powercrp.name]) {

                    //console.log(Game.powerCreeps[i].name, Game.flags[Game.powerCreeps[i].name].room, Game.flags[Game.powerCreeps[i].name].room.powerspawn);
                    if (Game.flags[Game.powerCreeps[i].name].room && Game.flags[Game.powerCreeps[i].name].room.powerspawn && Game.flags[Game.powerCreeps[i].name].room.powerspawn.my) {
                        let zz = powercrp.spawn(Game.flags[Game.powerCreeps[i].name].room.powerspawn);
                        if (zz !== OK && Game.time % 150 === 0) {
                            console.log(powercrp, 'POWERSPAWN ERRROR', zz, powercrp.name, Game.flags[Game.powerCreeps[i].name].pos);
                        }
                        Game.flags[powercrp.name].memory.doPowerOrder = undefined;
                        Game.flags[powercrp.name].room.memory.powerLevels = undefined;
                        Game.flags[powercrp.name].room.memory.powerCreep = undefined;
                        Game.flags[powercrp.name].room.memory.noAlphaJob = undefined;
                        Game.flags[powercrp.name].room.memory.DOEXTENSIONPOWER = undefined;

                    } else {
                        let rName = require('commands.toParty').returnClosestRoom(Game.flags[powercrp.name].pos.roomName);
                        let room = Game.rooms[rName];
                        let pSpawn = room.powerspawn;

                        if (pSpawn) {
                            let zz = powercrp.spawn(pSpawn);
                            if (zz !== OK && Game.time % 150 === 0 ) {
                                console.log('SPAWN ERRROR', zz, rName, room, pSpawn);
                            }
                        }
                    }
                }
            }
            if (powercrp.shard === Game.shard.name) {
                if (doRoomNoPower(powercrp)) continue;

                if (powercrp.hits < powercrp.hitsMax && doShield(powercrp)) {
                    continue;
                }
                doGenerateOps(powercrp); //  PWR_GENERATE_OPS
                if(!powercrp.flag){
                    continue;
                } 
                if (powercrp.flag.color === COLOR_YELLOW) {
                    // So the room that it's coming from should have at least 1 job.
                    if (Game.flags[powercrp.flag.memory.roomOccupied]) {
                        let roomFlag = Game.flags[powercrp.flag.memory.roomOccupied].memory.module;
                        if (roomFlag) {
                            for (let i in roomFlag) {
                                if (roomFlag[i][0] === 'job') {
                                    roomFlag[i][1]++;
                                }
                            }
                            powercrp.flag.memory.roomOccupied = undefined;
                            powercrp.room.memory.maxLinker++;
                        }
                    }
                    powercrp.flag.memory.roomOccupied = undefined;
                    powercrp.flag.memory.noHauler = undefined;
                    powercrp.flag.memory.noAlphaJob = undefined;
                    powercrp.flag.memory.powerCreep = undefined;
                    //flag.memory.doPowerOrder = undefined;
                    powercrp.room.memory.powerLevels = undefined;
                    attackingOps(powercrp);
                    continue;
                } else if (powercrp.flag.color === COLOR_WHITE) {
                    if (!powercrp.flag.memory.roomOccupied) {
                        if (Game.flags[powercrp.flag.memory.roomOccupied]) {
                            let roomFlag = Game.flags[powercrp.flag.memory.roomOccupied].memory.module;
                            if (roomFlag) {
                                for (let i in roomFlag) {
                                    if (roomFlag[i][0] === 'job') {
                                        roomFlag[i][1]--;
                                    }
                                }
                            }
                        }
                        powercrp.flag.memory.roomOccupied = powercrp.pos.roomName;
                    }

                    if (powercrp.flag.memory.squadID && powercrp.flag.memory.squadID.length) {
                        for (let i in powercrp.flag.memory.squadID) {
                            let crp = Game.getObjectById(powercrp.flag.memory.squadID[i]);
                            if (crp) {
                                crp.memory.death = true;
                                crp.memory.partied = undefined;
                                crp.memory.follower = undefined;
                            }
                        }
                        powercrp.flag.memory.squadID = undefined;
                    }
                    // So we know that build.flag changes job number.
                }
                setPowerRoomLevel(powercrp);
                if (setControllerPower(powercrp)) continue;
                if (doSleep(powercrp)) continue;
                if (powercrp.ticksToLive < 500) {
                    doRenew(powercrp);
                    continue;
                }
                //                if (doDeath(powercrp)) continue;
                if (doStoreOps(powercrp)) continue;
                if (powercrp.memory.currentPowerJob === 1) {
                    powercrp.memory.currentPowerJob = undefined;
                }
                if (powercrp.memory.currentPowerJob === undefined || powercrp.memory.findJob) {
                    powercrp.memory.currentPowerJob = determineJob(powercrp);
                    powercrp.memory.findJob = undefined;
                } else {
                    powercrp.say(powercrp.memory.currentPowerJob, true);
                }

                var bads = false;
                if (powercrp.room.playerCreeps.length > 0) {
                    if (doOperateTower(powercrp)) continue;
                    if (analyzeRampartsToFortifyZz(powercrp)) continue; // Sleeps after fortifying
                    if (doFillTower(powercrp)) continue;
                    bads = true;
                    powercrp.memory.noRenewRemoveFlag = undefined;
                }else {
                    if(powercrp.name === 'Techies'){
                        // Meaning that this is a type that is responsive;
                        powercrp.memory.noRenewRemoveFlag = true;
                      //  console.log('no baddies for Techies to stay Remove flag when below 500 life');
                    }
                }
                /*if(powercrp.room.name === 'E13S18'){
                    if(powercrp.pos.isEqualTo(powercrp.flag)){
                        doShieldFortify(powercrp);
                    }else{
                        powercrp.moveMe(powercrp.flag);
                    }
                    return;

                }*/

                if (powercrp.memory.currentPowerJob) {
                    if (powercrp.memory.lockPowerJob && powercrp.memory.lockPowerJob >= 0) {
                        powercrp.memory.lockPowerJob--;
                        //                        console.log('doing Locking powerJob', roomLink(powercrp.room.name), powercrp.memory.lockPowerJob);
                        if (powercrp.memory.lockPowerJob <= 0) {
                            powercrp.memory.lockPowerJob = undefined;
                        }
                    }
                    /*

                    if (powercrp.memory.lockPowerJob) {
                        console.log(powercrp.memory.currentPowerJob);
                    }*/
                    if (powercrp.powers[powercrp.memory.currentPowerJob] && powercrp.powers[powercrp.memory.currentPowerJob].cooldown > 0 && !powercrp.memory.lockPowerJob) {
//                        console.log('this shouldn"t ever happen?', powercrp.memory.currentPowerJob);
                        powercrp.memory.currentPowerJob = undefined;
                    }

                    switch (powercrp.memory.currentPowerJob) {
                        case 69:

                            if (doFillTower(powercrp)) continue;
                            break;
                        case PWR_FORTIFY:
                            powercrp.memory.currentPowerJob = undefined;
                        break;
                        case PWR_OPERATE_OBSERVER:
                            if (doOperateObserver(powercrp)) {
                                powercrp.memory.currentJob = undefined;
                                continue; // PWR_REGEN_MINERAL
                            }
                            break;
                        case PWR_OPERATE_LAB:
                            if (doOperateLab(powercrp)) {
                                //                                    powercrp.room.memory.currentJob = 5; //Lab Work.
                                continue; // PWR_REGEN_MINERAL
                            }
                            break;
                        case PWR_OPERATE_EXTENSION:
                            if (doOperateExtension(powercrp)) {
                                powercrp.memory.currentJob = undefined;
                                continue; // PWR_REGEN_MINERAL
                            }
                            break;
                        case PWR_REGEN_SOURCE:
                            if (!bads && doOperateSource(powercrp)) {
                                powercrp.memory.currentJob = undefined;
                                continue; //  PWR_REGEN_SOURCE
                            }
                            break;
                        case PWR_REGEN_MINERAL:
                            if (!bads && doOperateMineral(powercrp)) {
                                powercrp.memory.currentJob = 3; //MINERAL

                                continue; // PWR_REGEN_MINERAL
                            }
                            break;
                        case PWR_OPERATE_POWER:
                            if (doOperatePower(powercrp)) {
                                powercrp.memory.currentJob = undefined;
                                continue; // PWR_REGEN_MINERAL
                            }
                            break;
                        case PWR_OPERATE_SPAWN:
                            if (doOperateSpawn(powercrp)) {
                                powercrp.memory.currentJob = undefined;
                                continue; // PWR_REGEN_MINERAL
                            }

                            break;
                        case PWR_OPERATE_TERMINAL:
                            if (doOperateTerminal(powercrp)) {
                                powercrp.memory.currentJob = undefined;

                                continue; // PWR_REGEN_MINERAL
                            }

                            break;
                        case PWR_OPERATE_STORAGE:
                            if (doOperateStorage(powercrp)) {
                                powercrp.memory.currentJob = undefined;

                                continue; // PWR_REGEN_MINERAL

                            }

                            break;
                        case PWR_OPERATE_CONTROLLER:
                            if (doOperateController(powercrp)) {
                                powercrp.memory.currentJob = undefined;

                                continue; // PWR_REGEN_MINERAL

                            } else {

                            }

                            break;
                    }

                } else {

                }
                //                console.log(powercrp.stats('extension'),"extension power",powercrp.pos.roomName);
                doRole(powercrp);
            }
        }
    }
}
module.exports = PowerInteract;
/*
   PWR_GENERATE_OPS: 1,
    PWR_OPERATE_SPAWN: 2,
    PWR_OPERATE_TOWER: 3,
    PWR_OPERATE_STORAGE: 4,
    PWR_OPERATE_LAB: 5,
    PWR_OPERATE_EXTENSION: 6,
    PWR_OPERATE_OBSERVER: 7,
    PWR_OPERATE_TERMINAL: 8,
    PWR_DISRUPT_SPAWN: 9,
    PWR_DISRUPT_TOWER: 10,
    PWR_DISRUPT_SOURCE: 11,
    PWR_SHIELD: 12,
    PWR_REGEN_SOURCE: 13,
    PWR_REGEN_MINERAL: 14,
    PWR_DISRUPT_TERMINAL: 15,
    PWR_OPERATE_POWER: 16,
    PWR_FORTIFY: 17,
    PWR_OPERATE_CONTROLLER: 18,
    PWR_OPERATE_FACTORY: 19*/