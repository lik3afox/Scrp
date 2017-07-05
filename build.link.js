function use() { "use strict"; }
var total = 0;
var _links = [
    // Spawn 1 room
    '58b001ce20048565118f241c', '58afe9e63c5e431f63d27903',
    // spawn 3 room
    '58b0e62dabc23087239d8454', '58ef09f13685233e323f2786',
    // spawn 2 room
    '58b70092ec6c7fbb6db8952f',
    // Spawn room 4.
    '58c4c2337a92cc7169fb0aeb', '58d4a16e13994446731e4986',
    '58bb7684b591b9fc7d0a9df2', '58df611bbeb92e3de67dff2f',
    // Spawn room 6
    '58baf3bdefbd256c113625e9', '595c6868b5dd826b00dba4f0',
    //E35S73
    '58e292aa2748ce6edec91dbe', '58ed5954cc4792513b19b417', '58eee4540c9a49987f234952',
    // Spawn room E38S72
    '58ffa4eaff28ce410959868a', '5908d7b565640df9183ab7cb', '5908fc066303cfc31b28f48a',
    // Spawn room W4S93
    '59217cc320243b65e83790bf', '592a46de7618175a3092fdae',
    // E23S75
    '593da1f5694770f664e2df0b',
    // Spawn room E37S75
    '592b1d484bc45519161537ef', '592b3ffa429df6134a992506', '594a882f332f7c6ef1dfe57a',
    // E33S76
    '5949a8128a497d010b6c1e4a'
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

        sendEnergy('58b4cd8ee974380f1de2f9f7', '595a736200d3867e11c7e0bc', 700);
        sendEnergy('58afe9e63c5e431f63d27903', '595a736200d3867e11c7e0bc');


        sendEnergy('58b001ce20048565118f241c', '58b4df8c5da64e904b11a6fc');
        sendEnergy('58b4df8c5da64e904b11a6fc', '58b4ce36d29202cf03ebf22a');
        sendEnergy('58b4ce36d29202cf03ebf22a', '595a736200d3867e11c7e0bc');

        // Spawn 3
        sendEnergy(['58b094643386e27ab8eb8cb0', '58b087634b99972008ac7457'], '58b0ad8777b2837790268120', 700);
        sendEnergy(['58b0e62dabc23087239d8454'], '58b0ad8777b2837790268120');

        // Spawn 2
        sendEnergy('58ef09f13685233e323f2786', '58ef020fa6a3e00542e66ce3');
        sendEnergy('58ef020fa6a3e00542e66ce3', '58b12623584c0844f13caf93');

        sendEnergy('58b70092ec6c7fbb6db8952f', '58b6dff39144d14b7a165e62');

        //sendEnergy('58b6f111cb08671a52fed9ba','58b12623584c0844f13caf93');

        sendEnergy('58b6dff39144d14b7a165e62', '58b12623584c0844f13caf93');

        sendEnergy('58b132cfba0a75976007d8f2', '58b12623584c0844f13caf93', 700);

        // Spawn 4

        sendEnergy('58bb7684b591b9fc7d0a9df2', '58bdb95b4f290a245f3adb8b');
        sendEnergy(['58d4a16e13994446731e4986', '58c4c2337a92cc7169fb0aeb', '58bdb95b4f290a245f3adb8b'], '58b70f08fcbbe3403e815c29');
        sendEnergy('58d49792d303cf1f202d68b8', '58b70f08fcbbe3403e815c29', 700);

        // Spawn 5  

        sendEnergy('58ba4ff836439c9e6a5a1c23', '58ba2df2045ee10bf18fb464', 700);

        // 
        sendEnergy('58df611bbeb92e3de67dff2f', '58baddb59ac6e6215aa593b6');
        sendEnergy('58baf3bdefbd256c113625e9', '58dfcf2ccdfd8bc567323e91');
        sendEnergy('58dfcf2ccdfd8bc567323e91', '58baddb59ac6e6215aa593b6');
        sendEnergy(['58c5cbb9c44a206a64c09f68', '58bfe1913ed94d20f6bee37c'], '58baddb59ac6e6215aa593b6', 700);


        // upgrade RoomID: 58eedea95b45f6e068ea87e8

        sendEnergy('58c49bac27df0e3f02785e8a', '58c48ff96b89238f10ad2947', 700);

        sendEnergy('595c6868b5dd826b00dba4f0', '595c62d912ef4b0357754666');
        sendEnergy('595c62d912ef4b0357754666', '595c5cff8f61b25768b0bdd8');
        sendEnergy('595c5cff8f61b25768b0bdd8', '595c5a78bb4b85342f2d7b90');
        sendEnergy('595c5a78bb4b85342f2d7b90', '58eeda269b7d1b581c9cf311');


        sendEnergy('595c5f9eed5318210b4dd7f4', '58eeda269b7d1b581c9cf311', 600);

        //zolox skID: 

        sendEnergy('58e6c0db9195c77f68dc9c22', '58dfbad7836eeb30dd91e1a3', 700);
        sendEnergy('58dfc900827589b30d7acdbe', '58dfbad7836eeb30dd91e1a3', 700);
        sendEnergy(['58e292aa2748ce6edec91dbe', '58ed5954cc4792513b19b417'], '58dfbad7836eeb30dd91e1a3');

        sendEnergy(['58ffa4eaff28ce410959868a', '5908d7b565640df9183ab7cb', '5908fc066303cfc31b28f48a'], '590239e397a4002b4e9f550c');
        sendEnergy(['5906172405d3aa23ec649810', '590538c1db2e7585784144dc'], '590239e397a4002b4e9f550c', 700);


        //        sendEnergy('590f55b87ed675bb51e96132', '590f2337820b9efc44a15794');
        sendEnergy(['59134206c9fe82b849c2c92e', '59217cc320243b65e83790bf'], '590f2337820b9efc44a15794', 700);

        sendEnergy('592a46de7618175a3092fdae', '59233b3584aa3b2902f2543e');
        sendEnergy('59233b3584aa3b2902f2543e', '590f2337820b9efc44a15794');

        //if(total > 0)console.log('Links transfered:'+total);
        //return total;'5924524129c65d152e19c40c', 
        //        sendEnergy([''], '59243d3f403da5a97dea664a');

        sendEnergy(['592c9b9dbc84a408e80d9aee', '59346fe0b9ec62526a4218dc', '594a882f332f7c6ef1dfe57a'], '5924524129c65d152e19c40c');
        sendEnergy('5949a8128a497d010b6c1e4a', '59346fe0b9ec62526a4218dc');
        //        ''
        sendEnergy('5924524129c65d152e19c40c', '59243d3f403da5a97dea664a');

        sendEnergy(['592b1d484bc45519161537ef', '592b3ffa429df6134a992506'], '592b2bba08d445510286532a');
        sendEnergy('592b2bba08d445510286532a', '592b1f2b9eb200190288958e');
        sendEnergy('592b29f24dbc43d258db1db4', '592b1f2b9eb200190288958e', 700);
        sendEnergy('593da1f5694770f664e2df0b', '5949e84c088c672237d2cf79');
        sendEnergy('5949e84c088c672237d2cf79', '5949da19dd7f393da48578db');
        sendEnergy('5949da19dd7f393da48578db', '593d6e902c4a79a70901fac1');



        sendEnergy(['59437ada633ad90d033e741c', '59408dd58b64951171f89b71'], '593d6e902c4a79a70901fac1', 700);

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
