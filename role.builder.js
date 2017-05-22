// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.

var classLevels = [
    [WORK, WORK, CARRY, MOVE], // 
    [WORK, WORK, MOVE, WORK, CARRY, CARRY, CARRY, MOVE], // 550

    [WORK, MOVE, CARRY, WORK, WORK, WORK, MOVE, WORK, WORK, CARRY, MOVE],
    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY],
    [CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, CARRY],


    [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
        WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
        WORK, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY
    ]
];

var roleParent = require('role.parent');
var constr = require('commands.toStructure');
var containers = require('commands.toContainer');
var sources = require('commands.toSource');

class roleBuilder extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    /** @param {Creep} creep **/
    static run(creep) {
        if (super.returnEnergy(creep)) {
            return;
        }
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return; }

        //if(creep.room.name == 'E35S83')
        //          if(super.boosted(creep,['XLH2O'])) { return;}

        if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.carry.energy < 51) {

            if (creep.room.name == 'E28S73' && creep.memory.roleID === 0) {
                creep.moveTo(21, 43);
            }
            constr.pickUpEnergy(creep);

            if (creep.room.name == "E27S74" && creep.room.terminal.store[RESOURCE_ENERGY] > 0) {
                containers.withdrawFromTerminal(creep);
            } else if (creep.room.name == "E35S83") {
                containers.withdrawFromTerminal(creep);
            } else {
                //            containers.fromContainer(creep)
                if (!constr.moveToPickUpEnergy(creep, 100)) {
                    if (!containers.withdrawFromStorage(creep)) {
                        //                if(!containers.withdrawFromStorage(creep)) {


                        if (!containers.moveToWithdraw(creep)) {
                            sources.moveToWithdraw(creep);
                        }
                    }
                }

            }
        }

        /*        if (creep.memory.building && contargets.length == 0) {
                    creep.memory.building = false;
                } */
        //     console.log('testing',creep.memory.building,_.sum(creep.carry), creep.carryCapacity);


        // Action
        // Action
        // Action
        if (creep.memory.building) {
            if (!constr.doCloseBuild(creep)) {
                //            creep.memory.death = true;
            }
            //          creep.say('buil');
        } else {


        }

    }
}

module.exports = roleBuilder;
