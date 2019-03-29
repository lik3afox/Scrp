var roleParent = require('role.parent');



class armyBard extends roleParent {

    static levels(level) {
        return [MOVE];
    }
    static boosts(level) {
        return;
    }

    static run(creep) {
        //var restSpot = new RoomPosition(26,36,"E13S17");
        let bardFlag = Game.flags.bard;
        let battleFlag = Game.flags.dangerRoom;
        if (creep.pos.isEqualTo(Game.flags.bard)) {
            // So the bard is one who looks for our creeps, if it finds it, it will clear flag data, but what stops it from being re added?
            if (creep.room.myBattleGroup.length > 0) {
                creep.sing(["Get", "Ready", "bitches"], true);
                battleFlag.memory.challenger = undefined;
                creep.memory.groupDeployed = true;
            } else if (creep.room.myBattleGroup.length === 0) {

                if (!creep.memory.groupDeployed) {
                    if (Game.flags.dangerRoom && Game.flags.dangerRoom.color !== COLOR_YELLOW && Game.flags.dangerRoom.color !== COLOR_ORANGE) {
                        Game.flags.dangerRoom.memory.setColor = {
                            color: COLOR_YELLOW,
                            secondaryColor: COLOR_YELLOW,
                        };
                    }
                    if (battleFlag.memory.challenger) {
                        creep.sing([battleFlag.memory.challenger, "Challenge", "Accepted", "Mustering", "Units"], true);
                    }
                } else {
                    creep.sing(["Battle", "Over", "GG", "Kill Me", "4 New", "Request"], true);
                    Game.flags.dangerRoom.memory.setColor = {
                        color: COLOR_WHITE,
                        secondaryColor: COLOR_WHITE,
                    };
                }
            }

            if (creep.partyFlag.color === COLOR_YELLOW) {
                creep.partyFlag.memory.setColor = {
                    color: COLOR_WHITE,
                    secondaryColor: COLOR_WHITE,
                };
            }

        } else {
            creep.moveMe(Game.flags.bard, { reusePath: 50 });
        }
    }
}

module.exports = armyBard;