// Main 300
// level 0 = 200
// level 1 = 300 / 0
// Level 2 = 550 / 5
// Level 3 = 800 / 10
// Level 4 = 1300 / 20
// Level 5 = 1800 / 30
// Level 6 = 2300 / 40  Not added yet, not certain if needed.
var movement = require('commands.toMove');
var roleParent = require('role.parent');
var classLevels = [
    [MOVE, MOVE],
    [MOVE, MOVE, MOVE],
    [MOVE, MOVE, MOVE],
    [MOVE, MOVE, MOVE]
];
class constructionBoss extends roleParent {
    static levels(level) {
        if (level > classLevels.length - 1) level = classLevels.length - 1;
        return classLevels[level];
    }

    static run(creep) {
        super.calcuateStats(creep);
        if (super.doTask(creep)) {
            return; }

        /*
        for (var name in Game.rooms) {
            var motherSpawn;

            for (var i in Game.spawns) {
                motherSpawn = Game.spawns[i];
                break;
            }

            var croom = Game.rooms[name];
            var sources = croom.find(FIND_SOURCES);
        } */

        if (creep.memory.goal !== undefined) {
            // Go to goal. 
            var constr = require('commands.toStructure');
            let lastMovement = { x: creep.pos.x, y: creep.pos.y };
            //            console.log(lastMovement,'rayray',Game.getObjectById(creep.memory.goal));

            if (Game.getObjectById(creep.memory.goal) === null) {
                /*                    var goingTo = movement.getRoomPos(creep.memory.goal); // this gets the goal pos.

                                console.log(goingTo);
                                    creep.moveTo(goingTo);*/

                movement.moveToGoal(creep);

            } else {
                creep.moveTo(Game.getObjectById(creep.memory.goal));
            }
            constr.createRoadAt(creep);
        }

        var target = Game.getObjectById(creep.memory.goal);
        //        console.log(target, creep.memory.goal,Game.getObjectById(creep.memory.goal));
        if (target !== null && creep.pos.inRangeTo(target, 1)) {
            creep.say('Reporting');
            var parent = Game.getObjectById(creep.memory.parent);
            var spawn = require('build.spawn');

            spawn.reportFrom(creep);


            creep.suicide();
        }



        creep.say('dad');
    }
}
module.exports = constructionBoss;
