function use() { "use strict"; }
var total = 0;
var _links = [
    // Spawn 1 room
    '599e13ba4820ce76f0fb3380',
    '59a0d1a0b0eec64f0a3160b5',
    '59a081f1063f4155d29b0c4f','5997aa2a9ba23f4bc8cae84a','5999196d0efd617fae40a7eb','599db076d16d032ddc47c76d','599f5542b6ef480fb43489c1','599f88a92e6d2935543e1b55','59a093c32db27b362b2141a7','59a0a51811339d0b50c91557'
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
        sendEnergy(['5997aa2a9ba23f4bc8cae84a','599d2e9d8b56f54f26879246','5999196d0efd617fae40a7eb'], '5997883fab58151efecc98e0',700);
        sendEnergy(['599d7b1826a1d10fe2916c7a','59a0995324116d15c6066256'], '599d4b24de5c444ff07248a4', 700);
        sendEnergy(['599d67c618a08751a7262df9','599f88a92e6d2935543e1b55'], '599d511549eaf30b4769db20', 700);
        sendEnergy(['599db076d16d032ddc47c76d','59a081f1063f4155d29b0c4f'], '599d9a8849dbcd7a6e95f99b');
        sendEnergy(['599e156450b255770346a5cf','59a093c32db27b362b2141a7'], '599e02188f76c44a7e6079c8',700);
        sendEnergy(['599e2c7f6145822e02a37dd9','59a0a51811339d0b50c91557'], '599e13ba4820ce76f0fb3380',700);
        sendEnergy(['599e35c1296127177e64c747','59a17da37e58813734913135'], '599e1b793ffb5e7550c34732',700);
        sendEnergy(['599f5542b6ef480fb43489c1'], '599ef53a7b9d8a11e04396e8',700);
        sendEnergy(['599fd95638a48354454672af'], '599fb7715718b6076387d35f',700);
        sendEnergy(['59a087a117949d1664063798'], '59a03a667e2fc03c4463fb61',700);
        sendEnergy(['59a0d1a0b0eec64f0a3160b5'], '59a07c04154ede2fcbe77639');

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
