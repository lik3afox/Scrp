function getEnemy(creep) {
    return creep.room.find(FIND_HOSTILE_CREEPS);
}

class AttackInteract {
    constructor() {

    }

    static getHostiles(creep) {
        return getEnemy(creep);
    }

    static isThere(creep) {
        var enemies = getEnemy(creep);
        if (enemies.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    static attackClosest(creep) {
        var enemies = getEnemy(creep);
        if (enemies.length > 0) {
            if (creep.attack(enemies[0]) == ERR_NOT_IN_RANGE) {
                creep.say('go');
                creep.moveTo(enemies[0]);
            }
            return true;
        } else {
            return false;
        }

    }

}

module.exports = AttackInteract;
