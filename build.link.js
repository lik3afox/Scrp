function use() { "use strict"; }
var total = 0;
var _links = [
    // Spawn 1 room
    '5997aa2a9ba23f4bc8cae84a','5999196d0efd617fae40a7eb','599db076d16d032ddc47c76d'
];

var gameCache = [];

function getCached(id) {
    if (gameCache[id] !== undefined) {
        if (gameCache[id] === null) {
            //        console.log( 'Null Linked Cache',id);
            return null;
        } else {
            //        console.log('returned cache',gameCache[id],id);
            return gameCache[id];
        }
    }
    let zzz = Game.getObjectById(id);
    //    console.log('Created Cache');
    gameCache[id] = zzz;
    return zzz; //Game.getObjectById(id);
}

function linkTransfer() {
    var LINK;
    var ttarget;
    var e = _links.length;
    while (e--) {


        LINK = getCached(_links[e]); //Game.getObjectById(_links[e]);

        if (LINK !== null && LINK.energy !== 800) {
            let targets = LINK.pos.findInRange(FIND_MY_CREEPS, 1);
            targets = _.filter(targets, function(s) {
                return (s.carry[RESOURCE_ENERGY] > 0 && s.memory.linkID == _links[e]);
            });

            if (targets.length !== 0) {

                if (targets.length > 1)
                    targets.sort((a, b) => a.carry[RESOURCE_ENERGY] - b.carry[RESOURCE_ENERGY]);

                ttarget = targets[0];

                if (ttarget !== undefined) {
                    let vv = ttarget.transfer(LINK, RESOURCE_ENERGY);
                }
            }
        }
    }
}

function sendEnergy(from, to, amount) {
    if (amount === undefined) amount = 0;
    var linkFrom;
    var linkTo;

    if (_.isArray(from)) {
        linkTo = getCached(to);
        var e = from.length;
        while (e--) {
            linkFrom = getCached(from[e]);
            if (linkFrom !== null && linkTo !== null) {
                linkFrom.room.visual.line(linkFrom.pos, linkTo.pos, { color: 'blue' });
                if (linkTo.energy < linkFrom.energy && linkFrom.cooldown === 0 && linkFrom.energy >= amount) {
                    if (linkFrom.transferEnergy(linkTo) == OK) {
                        total++;
                        return true;
                    }
                }
            }
        }

    } else {
        linkFrom = getCached(from);
        linkTo = getCached(to);

        if (linkFrom === null || linkTo === null) return false;
        linkFrom.room.visual.line(linkFrom.pos, linkTo.pos, { color: 'blue' });
        if (linkFrom.cooldown !== undefined && linkFrom.cooldown !== 0)
            linkFrom.room.visual.text(linkFrom.cooldown, linkFrom.pos.x, linkFrom.pos.y + 1, { color: '#97c39b ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });
        if (linkFrom.cooldown !== 0 || linkFrom.energy <= amount) return false;

        if (linkTo.energy > 400) return false;
        if (linkFrom.transferEnergy(linkTo) == OK) total++;
        return true;
    }
}

class buildLink {

    /** @param {Creep} creep **/
    static run() {
        linkTransfer();

        total = 0;
        // Spawn 1
        sendEnergy(['599d2e9d8b56f54f26879246','5997aa2a9ba23f4bc8cae84a','5999196d0efd617fae40a7eb'], '5997883fab58151efecc98e0', 700);
        sendEnergy(['599d7b1826a1d10fe2916c7a'], '599d4b24de5c444ff07248a4', 700);
        sendEnergy(['599d67c618a08751a7262df9'], '599d511549eaf30b4769db20', 700);
        sendEnergy(['599db076d16d032ddc47c76d'], '599d9a8849dbcd7a6e95f99b');
        sendEnergy(['599e156450b255770346a5cf'], '599e02188f76c44a7e6079c8',700);

        gameCache = []; // cleaning up cache for this tick.
    }

    static deposit(creep) { // Used by harvesters

        if (creep.carry[RESOURCE_ENERGY] === 0) return false;

        if (creep.memory.linkID === undefined) {
            let yy = creep.pos.y - 1;
            if (yy < 0) yy = 0;
            let yy2 = creep.pos.y + 1;
            if (yy2 > 49) yy2 = 49;
            let xx = creep.pos.x - 1;
            if (xx < 0) xx = 0;
            let xx2 = creep.pos.x + 1;
            if (xx2 > 49) xx2 = 49;
            var nlinkz = creep.room.lookForAtArea(LOOK_STRUCTURES, yy, xx, yy2, xx2, true);

            for (var i in nlinkz) {
                if (nlinkz[i].structure !== undefined && nlinkz[i].structure.structureType == 'link') {
                    creep.memory.linkID = nlinkz[i].id;

                    creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY);
                    return true;
                }
            }
        } else {
            let LINK = getCached(creep.memory.linkID);
            if (creep.pos.isNearTo(LINK)) {
                creep.transfer(LINK, RESOURCE_ENERGY);
                return true;
            }
        }
    }

    static stayDeposit(creep) {

        if (creep.carry[RESOURCE_ENERGY] === 0) return false;
        if (creep.room.name != creep.memory.home && creep.room.name != 'E37S75') {
            return false;
        }
        let LINK;

        if (creep.memory.linkID === undefined) {
            var e = _links.length;
            while (e--) {
                LINK = getCached(_links[e]);
                if (LINK !== null && creep.pos.isNearTo(LINK)) {
                    creep.memory.linkID = _links[e];
                    return true;
                }
            }
        } else {
            LINK = getCached(creep.memory.linkID);
            if (LINK !== null && creep.pos.isNearTo(LINK)) {
                return true;
            }
        }

    }

}

module.exports = buildLink;
