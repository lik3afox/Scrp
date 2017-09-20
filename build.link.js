function use() { "use strict"; }
var total = 0;
var _links = [
    // Spawn 1 room
    '599e13ba4820ce76f0fb3380','59a9d6e62bae572632b013d8','59af0a6e977e652b898e8f87','59af622d01fa5e37c804e084','59af307769b01a1b4a1ee7c0',
    '59a4bdacd8d06c343275053c','59a03a667e2fc03c4463fb61','59a89d77236cf70be22c4a94','59aa685a7de64c7c32186eff','59ab835078aa150c59d17611','59ab66cbea76c83e4369e9a6',
    '59a0d1a0b0eec64f0a3160b5','59a307ac7ea36e50423b0f3d','59a30a4b88e45701dbb46b44','59a17e06e5b4d21092a57e5a','59a4a21ea43d2e7af216c1ba','59a635a4e164b11de2dbb53a',
    '59a081f1063f4155d29b0c4f','5999196d0efd617fae40a7eb','599db076d16d032ddc47c76d','599f5542b6ef480fb43489c1','599f88a92e6d2935543e1b55','59a0a51811339d0b50c91557',
    '59b05f22f180f93951ddbd2b','59b23bbc82c370249f03afe5','59b5c0e285bed438554b96b3','59b6ca7c325d146a3c1fd4e3','59b714acab6f307d50650c77',
    '59ba7e431e3fe9425fe1aef5','59bbdbdfe488d72705baba8f','59bffbfeb495a06edb54f035','59c03de3111054267de7e2dd','59c14850412b1716375f72bd'
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
            } else {
                console.log(from,to,amount,'LINK ERROR');
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
        sendEnergy(['59a307ac7ea36e50423b0f3d','59a30a4b88e45701dbb46b44','5999196d0efd617fae40a7eb'], '59a5c250bcad865bbc88f878',700);
        sendEnergy('59a635a4e164b11de2dbb53a', '59b5bfe372a7fc4e5705c512');
        sendEnergy('59b5bfe372a7fc4e5705c512', '599d4b24de5c444ff07248a4');
        sendEnergy('59c14850412b1716375f72bd', '59b0372168bf6b4daa13fa97');
        
        sendEnergy(['59b0372168bf6b4daa13fa97'], '599d511549eaf30b4769db20', 700);
        sendEnergy(['599db076d16d032ddc47c76d','59a081f1063f4155d29b0c4f'], '599d9a8849dbcd7a6e95f99b');
        sendEnergy(['59a0a51811339d0b50c91557'], '599e13ba4820ce76f0fb3380',700);

        sendEnergy('59a4a21ea43d2e7af216c1ba', '59a9e1bd0795aa50d7ded256');
        sendEnergy('59a9e1bd0795aa50d7ded256', '59a9b11438c396766a497cb4');

        sendEnergy('59a9b11438c396766a497cb4', '599e1b793ffb5e7550c34732');
        
        sendEnergy('59a89d77236cf70be22c4a94', '59b949e060a1a0307ca7d427');
        sendEnergy('59b949e060a1a0307ca7d427', '59b94502b04f8614c2a94265');
        sendEnergy('59b94502b04f8614c2a94265', '59a03a667e2fc03c4463fb61');

        sendEnergy(['599f5542b6ef480fb43489c1','59a17e06e5b4d21092a57e5a'], '599ef53a7b9d8a11e04396e8');

        sendEnergy('59b714acab6f307d50650c77', '59b712448ac2cf2be7ea58d0');
        sendEnergy('59b712448ac2cf2be7ea58d0', '59b701cca2cbcf11bd1ec94c');
        sendEnergy('59b701cca2cbcf11bd1ec94c', '599fb7715718b6076387d35f');

        sendEnergy(['59bbdbdfe488d72705baba8f', '59a4bdacd8d06c343275053c'], '59a07c04154ede2fcbe77639');

        sendEnergy('59a9d6e62bae572632b013d8', '59b9a2a6565ce54d1aef1042');
        sendEnergy('59b9a2a6565ce54d1aef1042', '59b99d6aaf8a2a22f13565f5');
        sendEnergy('59b99d6aaf8a2a22f13565f5', '59a155f20c94391988abc174');

        sendEnergy('59bffbfeb495a06edb54f035', '59c0153e30e8ee637f612557');
        sendEnergy('59c0153e30e8ee637f612557', '59c0335bd15ad770355ec802');
        sendEnergy('59c0335bd15ad770355ec802', '59aadcceefa89764af662d60');

        sendEnergy(['59af622d01fa5e37c804e084'], '59aadcceefa89764af662d60',700);
        sendEnergy(['59aa685a7de64c7c32186eff'], '59aa2a5bb5acfa10d8cae3ee',700);

        sendEnergy('59ba7e431e3fe9425fe1aef5', '59ba927a6169eb0a76ca15a0');
        sendEnergy('59ba927a6169eb0a76ca15a0', '59aa2a5bb5acfa10d8cae3ee');


        sendEnergy(['59b23bbc82c370249f03afe5'], '59b412373a3095542bd58682');
        sendEnergy(['59af0a6e977e652b898e8f87','59b412373a3095542bd58682'], '59aadbeebf5816036ca1dfc1',700);

        sendEnergy(['59ab835078aa150c59d17611'], '59ab66cbea76c83e4369e9a6');
        sendEnergy(['59af307769b01a1b4a1ee7c0'], '59ab831de08945471b2f274e',700);

        sendEnergy('59c03de3111054267de7e2dd', '59c03c62dc27cf4548d667b7');
        sendEnergy('59c03c62dc27cf4548d667b7', '59c0372ffbb3414ca490fb1a');
        sendEnergy('59c0372ffbb3414ca490fb1a', '59ada0239cabec7faa49800f');




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
//                    creep.memory.linkID = nlinkz[i].id;
                    creep.transfer(nlinkz[i].structure, RESOURCE_ENERGY);

                    if (creep.room.memory.masterLinkID !== undefined) {
                        let mLink = Game.getObjectById(creep.room.memory.masterLinkID);
                        if (mLink !== null) {
                            if (nlinkz[i].structure.energy > 700)
                                nlinkz[i].structure.transferEnergy(mLink);
                            nlinkz[i].structure.room.visual.line(nlinkz[i].structure.pos, mLink.pos, { color: 'green' });
                        }
                    }

                    return true;
                }
            }
        } else {
            let LINK = getCached(creep.memory.linkID);
            if (creep.pos.isNearTo(LINK)) {
                creep.transfer(LINK, RESOURCE_ENERGY);
                if(LINK.energy > 700 && creep.room.memory.masterLinkID !== undefined) {
                    let mLink = Game.getObjectById(creep.room.memory.masterLinkID);
                    if(mLink !== undefined) {
                        LINK.transferEnergy(mLink);
                    }
                }

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
