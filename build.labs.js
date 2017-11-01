var labRooms = ['E23S38', 'E13S34', 'E17S34', 'E27S34', 'E18S32', 'E14S37', 'E17S45', 'E28S37', 'E27S34', 'E24S33', 'E14S43', 'E28S42', 'E23S42', 'E25S43', 'E25S47', 'E14S47', 'E18S36', 'E14S38', 'E25S37', 'E25S27','E27S45'];

/*

 Room       Prim        Second
 
 E18S36     XGHO2       *GH
 E14S43     XGHO2       XGH2O
 
 E24S33     XZHO2       ZK*         // MV
 E25S43     *XZHO2      *GH2O        
 
 E13S34     XZH2O*      GH*         // Dismantle
 
 E17S45     G*      G*
 E25S47     XUH2O*      &UL
 
 E27S34     XLH2O*      *ZK
 
 E25S27     XLHO2       G
 E14S37     XLHO2*      UL*

 E25S37     XKHO2       OH*


 E17S34     OH         *GH2O
 E23S38     ZK
 E18S32     LO
 E28S37     ZK
 E23S42     KO
 E28S42     LH

 

  E14S38        UPGRADE


RESOURCE_ENERGY: "energy",
    RESOURCE_POWER: "power",

    RESOURCE_HYDROGEN: "H",
    RESOURCE_OXYGEN: "O",
    RESOURCE_UTRIUM: "U",
    RESOURCE_LEMERGIUM: "L",
    RESOURCE_KEANIUM: "K",
    RESOURCE_ZYNTHIUM: "Z",
    RESOURCE_CATALYST: "X",
    RESOURCE_GHODIUM: "G",

    RESOURCE_HYDROXIDE: "OH",
    RESOURCE_ZYNTHIUM_KEANITE: "ZK",
    RESOURCE_UTRIUM_LEMERGITE: "UL",

    RESOURCE_UTRIUM_HYDRIDE: "UH",
217    RESOURCE_UTRIUM_OXIDE: "UO",
    RESOURCE_KEANIUM_HYDRIDE: "KH",
    RESOURCE_KEANIUM_OXIDE: "KO",
    RESOURCE_LEMERGIUM_HYDRIDE: "LH",
    RESOURCE_LEMERGIUM_OXIDE: "LO",
    RESOURCE_ZYNTHIUM_HYDRIDE: "ZH",
    RESOURCE_ZYNTHIUM_OXIDE: "ZO",;sn
    RESOURCE_GHODIUM_OXIDE: "GO",

    RESOURCE_UTRIUM_ACID: "UH2O",
    RESOURCE_UTRIUM_ALKALIDE: "UHO2",
    RESOURCE_KEANIUM_ACID: "KH2O",
    RESOURCE_KEANIUM_ALKALIDE: "KHO2",
    RESOURCE_LEMERGIUM_ACID: "LH2O",
    RESOURCE_LEMERGIUM_ALKALIDE: "LHO2",
    RESOURCE_ZYNTHIUM_ACID: "ZH2O",
    RESOURCE_ZYNTHIUM_ALKALIDE: "ZHO2",
    RESOURCE_GHODIUM_ACID: "GH2O",
    RESOURCE_GHODIUM_ALKALIDE: "GHO2",

    RESOURCE_CATALYZED_UTRIUM_ACID: "XUH2O",
    RESOURCE_CATALYZED_UTRIUM_ALKALIDE: "XUHO2",
    RESOURCE_CATALYZED_KEANIUM_ACID: "XKH2O",
    RESOURCE_CATALYZED_KEANIUM_ALKALIDE: "XKHO2",
    RESOURCE_CATALYZED_LEMERGIUM_ACID: "XLH2O",
    RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE: "XLHO2",
    RESOURCE_CATALYZED_ZYNTHIUM_ACID: "XZH2O"
 ,   RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE: "XZHO2",
    RESOURCE_CATALYZED_GHODIUM_ACID: "XGH2O",
    RESOURCE_CATALYZED_GHODIUM_ALKALIDE: "XGHO2",
5836b8118b8b9619519f1663
8,13
E25S75
*/
var constr = require('commands.toStructure');
var labmax = 2401;
var emptyLab = [{
    id: 'none',
    resource: 'none',
    empted: false,
    amount: 0
}];
var allLabs = [{
    id: '59404817f09551065801fb93',
    resource: 'XGH2O',
    amount: 2700
}, {
    id: '5940584df9399f32041dea6a',
    resource: 'none',
    amount: 2700
}, {
    id: '5940502fce1e936d4d837fa9',
    resource: 'none',
    amount: 2700
}];

var maxMinerals = {
    //    'U':300000,
    /*    'U': 125000,
        'L': 125000,
        'Z': 125000,
        'K': 125000,
        'O': 125000,
        'H': 125000,
        'X': 125000, */

    'OH': 100000,
    'UL': 50000,
    'ZK': 50000,
    'G': 100000,
    'GG': 30000,

    'LH': 50000,

    'KO': 50000,
    'LO': 50000,

    'GH': 100000,
    'GH2O': 75000,
    'XGH2O': 150000,

    /*    'UO': 10000,
        'UH': 10000,
        'ZO': 10000,
        'ZH': 10000,
        'KH': 10000, */

    /*
            //    'UHO2': 5000,
            //   'UH2O': 5000,
            //    'ZHO2': 5000,
            //    'ZH2O': 5000,
            //    'LHO2': 5000,
            //    'LH2O': 5000,
            //    'KHO2': 5000,
            //    'KH2O': 5000,

            'XUHO2': 0, //  Mining
            'XKH2O': 0, // Carry */
    'LH2O': 1000, // Repair
    //    'LH': 1000, // Repair
    'XLH2O': 50000, // Repair *

    'XGHO2': 300000,
    'GHO2': 10000, // Repair
    'GO': 10000, // Repair

    'XZH2O': 150000, // Dismantle
    'ZH2O': 1000, // Repair
    'ZH': 1000, // Repair

    'XKHO2': 300000, // Ranged*
    'KHO2': 1000, // Repair
    //    'KO': 1000, // Repair

    'XZHO2': 200000, //  Move*
    'ZHO2': 1000, // Move
    'ZO': 1000, // Move

    'XUH2O': 150000, // Attack
    'UH2O': 2000, // Repair
    'UH': 1000, // Repair

    'XLHO2': 200000, // Heal*
    'LHO2': 1000, // Repair

};

var linksCache = [];

var muster = [{
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XGHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XLHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XKHO2',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}];

// AttackXUHO2
var XUH2O = [{
    id: 'getReplaced',
    resource: 'U',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH2O',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH2O',
    amount: 2500,
    emptied: false
}];

var XGH2O = [{
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 1,
    emptied: true
}];


var GH2O = [{
    id: 'getReplaced',
    resource: 'GH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH2O',
    amount: 1,
    emptied: true
}];

var UO = [{
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'U',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UO',
    amount: 1,
    emptied: true
}];

var OH = [{
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 1,
    emptied: true
}];

var LO = [{
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 1,
    emptied: true
}];


var KO = [{
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'K',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 1,
    emptied: true
}];


var GH = [{
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'GH',
    amount: 1,
    emptied: true
}];

// Repair
var LH = [{
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 1,
    emptied: true
}];
// Attack
var UH = [{
    id: 'getReplaced',
    resource: 'U',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 2400,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UH',
    amount: 1,
    emptied: true
}];

var XZHO2 = [{
    id: 'getReplaced',
    resource: 'Z',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZHO2',
    amount: 2500,
    emptied: false
}];

var XZH2O = [{
    id: 'getReplaced',
    resource: 'Z',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XZH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZH2O',
    amount: 2500,
    emptied: false
}];

var XKHO2 = [{
    id: 'getReplaced',
    resource: 'K',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'KO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XKHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KHO2',
    amount: 2500,
    emptied: false
}];

var XKH2O = [{
    id: 'getReplaced',
    resource: 'K',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'KH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XKH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'KH2O',
    amount: 2500,
    emptied: false
}];

// TOUGH
var XGHO2 = [{
    id: 'getReplaced',
    resource: 'G',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'GO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XGHO2',
    amount: 1,
    emptied: true
}, {

    id: 'getReplaced',
    resource: 'GHO2',
    amount: 2500,
    emptied: true
}];

var E33S76WarMix = [
    [3, 1, 2],
    [4, 2, 5],
    [6, 3, 4],
    [9, 7, 6]
];
// HAL
var XLHO2 = [{
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LO',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XLHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LHO2',
    amount: 2500,
    emptied: false
}];
var XLH2O = [{
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'none',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'X',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'LH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XLH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'LH2O',
    amount: 2500,
    emptied: false
}];
var UL = [{
    id: 'getReplaced',
    resource: 'U',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'L',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: true
}];


var ZK = [{
    id: 'getReplaced',
    resource: 'K',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'Z',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: true
}];

var G = [{
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'K',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 1,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'Z',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'U',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'L',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UL',
    amount: 1,
    emptied: false
}];


// MOVE
var GG = [{
    id: 'getReplaced',
    resource: 'UL',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZK',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'G',
    amount: 1,
    emptied: true
}];

var E29S79WarMix = [
    [3, 1, 2],
    [5, 4, 2],
    [6, 5, 3],
    [9, 7, 6]
];

var gMix = [
    [3, 4, 6],
    [5, 4, 6],

    [10, 9, 7],
    [8, 7, 9],

    [1, 3, 10],
    [2, 5, 8]
];

var level8Mix = [
    [3, 1, 2],
    [4, 2, 5],
    [10, 3, 4],
    [9, 10, 7],
];

var oneWarMix = [
    [3, 1, 2],
    [4, 1, 2],
    [5, 1, 2],
    [6, 1, 2],
    [7, 1, 2],
    [8, 1, 2],
    [9, 1, 2],
    [10, 1, 2],
];

function getCached(id) {
    //  if (linksCache[id] === undefined) {
    linksCache[id] = Game.getObjectById(id);
    //    }
    return linksCache[id];
}

function whatDoIget(creep) {
    let labs = returnLabs(creep.room.name);

    for (var i in labs) {

        if (labs[i].resource != 'none') {
            let currentLab = getCached(labs[i].id);

            //           if (creep.room.name == 'E35S73')
            //                console.log('lab works ', currentLab.energy, currentLab.energyCapacity, i, labs[i].id);

            if (currentLab !== null && currentLab.energy < currentLab.energyCapacity && currentLab.room.name == creep.room.name && !labs[i].emptied) {
                return RESOURCE_ENERGY;
            }
            if (currentLab !== null && currentLab.mineralAmount < labs[i].amount && currentLab.room.name == creep.room.name &&
                creep.room.terminal.store[labs[i].resource] > 0 && !labs[i].emptied) {
                return labs[i].resource;
            }
        }
    }
}


function howMuchDoIget(creep, wanted) {
    let labs = returnLabs(creep.room.name);

    for (var i in labs) {
        if (labs[i].resource == wanted) {
            return labs[i].amount;
        }
    }

}

function whereDoIPut(creep, have) {
    let labs = returnLabs(creep.room.name);
    for (var i in labs) {
        let real = getCached(labs[i].id);

        if (!labs[i].emptied && real !== null && labs[i].resource == have && real.pos.roomName == creep.room.name && real.mineralAmount < labs[i].amount) {
            return labs[i].id;
        }

        if (real !== null && have == RESOURCE_ENERGY && real.pos.roomName == creep.room.name) {
            if (real.energy < real.energyCapacity) {
                return labs[i].id;
            }
        }
    }
    return undefined;
}

function whatDoIHave(creep) {
    for (var i in creep.carry) {
        if (creep.carry[i] > 0) {
            return i;
        }
    }
}

function labDo(roomName, created, labz, laby) {
    let labs = returnLabs(roomName);
    //   if(roomName == 'E25S37')
    //    console.log('created 0 ', created, labz, laby, roomName);

    if (created === 0) {
        return false;
    }
    if (labs[created - 1] === undefined || labs[labz - 1] === undefined || labs[laby - 1] === undefined) {
        //        console.log('undefined Lab', roomName);
        return false;
    }
    //    if (Memory.stats.totalMinerals[labs[created - 1]] === undefined) return false;
    //    console.log(( Memory.stats.totalMinerals[labs[created-1].resource]>maxMinerals[labs[created-1].resource] ));
    if (REACTIONS[labs[labz - 1].resource] === undefined) {
        //        console.log('ERROR', roomName);
    } else if (REACTIONS[labs[labz - 1].resource][labs[laby - 1].resource] !== labs[created - 1].resource) {
        //      console.log(REACTIONS[labs[labz - 1].resource][labs[laby - 1].resource], labs[created - 1].resource, roomName);
        return;
    }
    if (Memory.stats.totalMinerals !== undefined)
        if (labs[created - 1].resource == 'XGHO2') console.log(Memory.stats.totalMinerals[labs[created - 1].resource], maxMinerals[labs[created - 1].resource], labs[created - 1].emptied);
//    if (Memory.stats.totalMinerals[labs[created - 1].resource] > maxMinerals[labs[created - 1].resource] && labs[created - 1].emptied) {
    if (Memory.stats.totalMinerals[labs[created - 1].resource] > maxMinerals[labs[created - 1].resource] ) {
//        console.log("max Mineral Triggered", labs[created - 1].resource, maxMinerals[labs[created - 1].resource], Memory.stats.totalMinerals[labs[created - 1].resource],roomName);
        return false;
    }
    let lab1 = getCached(labs[created - 1].id);
    let lab2 = getCached(labs[labz - 1].id);
    let lab3 = getCached(labs[laby - 1].id);
    if (lab1 === null || lab2 === null || lab3 === null) {
        return false;
    } else {
        lab1.room.visual.line(lab1.pos, lab2.pos, { color: 'red' });
        lab1.room.visual.line(lab1.pos, lab3.pos, { color: 'red' });
    }
    //   if(lab1.room.name == 'E13S34')
    //     console.log('gets here?2');

    if (lab1.cooldown !== 0) return false;

    if (!lab3.room.memory.labsNeedWork) {
        if (lab1.mineralAmount >= 2950 && labs[labz - 1].emptied) {
            lab3.room.memory.labsNeedWork = true;
        }
        if ((!labs[labz - 1].emptied && lab2.mineralAmount < 150 && lab2.room.terminal.store[labs[labz - 1].resource] > 1) ||
            (!labs[laby - 1].emptied && lab3.mineralAmount < 150 && lab3.room.terminal.store[labs[laby - 1].resource] > 1)) {
            lab3.room.memory.labsNeedWork = true;
        }

        if (lab3.mineralType === undefined || lab2.mineralType === undefined)
            lab3.room.memory.labsNeedWork = true;

        if ((lab2.mineralType !== undefined && labs[labz - 1].resource !== lab2.mineralType)) {
            lab3.room.memory.labsNeedWork = true;
        }
        if (
            (lab3.mineralType !== undefined && labs[laby - 1].resource !== lab3.mineralType)) {
            lab3.room.memory.labsNeedWork = true;
        }
    }

    if (labs[created - 1].emptied && labs[created - 1].resource == 'LO' && Game.rooms[roomName].memory.primaryLab ? lab1.room.memory.labMode : lab1.room.memory.lab2Mode == 'LO') {
        if (Memory.stats.totalMinerals.L < 60000 || Memory.stats.totalMinerals.O < 60000) {
            //        console.log('LO failed due to low L or O',roomName);
            return false;
        }
    }

    if (labs[created - 1].emptied && labs[created - 1].resource == 'KO' && Game.rooms[roomName].memory.primaryLab ? lab1.room.memory.labMode : lab1.room.memory.lab2Mode == 'KO') {
        if (Memory.stats.totalMinerals.K < 60000 || Memory.stats.totalMinerals.O < 60000) {
            //          console.log('KO failed due to low L or O',roomName);
            return false;
        }
    }
    if (labs[created - 1].emptied && labs[created - 1].resource == 'LH' && Game.rooms[roomName].memory.primaryLab ? lab1.room.memory.labMode : lab1.room.memory.lab2Mode == 'LH') {
        if (Memory.stats.totalMinerals.L < 30000 || Memory.stats.totalMinerals.H < 30000) {
            //            console.log('LH failed due to low L or H',roomName);
            return false;
        }
    }

    if (lab2.mineralType != labs[labz - 1].resource) return false;
    if (lab3.mineralType != labs[laby - 1].resource) return false;

    let zz = lab1.runReaction(lab2, lab3);

    //    if (zz !== 0) console.log(created, labz, laby, lab1.mineralAmount, 'lab Reaction', zz, lab1.mineralType, lab2.mineralType, lab3.mineralType, roomName);
    return true;
}

function labReady(roomName, labz) {
    let labs = returnLabs(roomName);
    let lab1 = getCached(labs[labz - 1].id);
    if (lab1.cooldown === 0) return true;
    return false;
}

function labMode(roomName, mode, labs) {
    var a;
    var returned;

    switch (mode) {
        case 'OH':
            returned = OH;
            break;
        case 'UL':
            returned = UL;
            break;
        case 'ZK':
            returned = ZK;
            break;

        case 'G':
            returned = GG;
            break;

        case 'GH':
            returned = GH;
            break;
        case 'UO':
            returned = UO;
            break;

        case 'GH2O':
            returned = GH2O;
            break;

        case 'XGH2O':
            returned = XGH2O;
            break;

        case 'muster':
            returned = muster;
            break;
        case 'XUH2O':
            returned = XUH2O;
            break;
        case 'XLH2O':
            returned = XLH2O;
            break;
        case 'XKH2O':
            returned = XKH2O;
            break;
        case 'XGHO2':
            returned = XGHO2;
            break;
        case 'XUHO2':
            returned = XUHO2;
            break;
        case 'XZH2O':
            returned = XZH2O;
            break;
        case 'XKHO2':
            returned = XKHO2;
            break;
        case 'XZHO2':
            returned = XZHO2;
            break;
        case 'XLHO2':
            returned = XLHO2;
            break;
        case 'UH':
            returned = UH;
            break;
        case 'LH':
            returned = LH;
            break;
        case 'KO':
            returned = KO;
            break;
        case 'LO':
            returned = LO;
            break;
        case 'empty':
            for (var bb in labs) {
                labs[bb].resource = 'none';
            }
            return labs;
        default:
            return labs;

        case 'light':
            var count = {};
            for (var c in labs) {
                if (count[c] === undefined) {
                    count[c] = 0;
                }
                count[c]++;
                if (count[c] > 1) {
                    labs[c].resource = 'XUH2O';
                }
            }
            return labs;
    }

    for (var mmm in returned) {
        if (labs[mmm] !== undefined)
            returned[mmm].id = labs[mmm].id;
    }
    return returned;
}

function getLabMixes(roomName) {
    var lab;
    if (Game.rooms[roomName].memory.primaryLab) {
        lab = Game.rooms[roomName].memory.labMode;
    } else {
        lab = Game.rooms[roomName].memory.lab2Mode;
    }

    switch (lab) {
        case 'XGH2O':
        case 'LH':
        case 'OH':
        case 'GH':
        case 'ZK':
        case 'UL':
        case 'KO':
        case 'LO':
        case 'UO':
        case 'GH2O':
        case 'G':
            return oneWarMix;
        case 'light':
        case undefined:
            return Game.rooms[roomName].memory.labMix;
        case 'G':
            return gMix;
        case 'XUH2O':
        case 'XUHO2':
        case 'XGHO2':
        case 'XLHO2':
        case 'XLH2O':
        case 'XKHO2':
        case 'XKH2O':
        case 'XZHO2':
        case 'XZH2O':
            return level8Mix;
        default:
            return oneWarMix;
    }
}

//labRooms
/*
function anyroomMakingMineral(type) {
    for (var e in labRooms) {
        //        console.log(Game.rooms[labRooms[e]].memory.labMode, labRooms[e], type);
        if (Game.rooms[labRooms[e]].memory.labMode !== undefined && Game.rooms[labRooms[e]].memory.labMode == type) {
            return true;
        }
    }
    return false;
}
*/

function analyzeRoomLabs(roomName, labs) {
    if (Game.rooms[roomName].memory.labMode === undefined) {
        Game.rooms[roomName].memory.labMode = 'none';
    }
    if (Game.rooms[roomName].memory.lab2Mode === undefined) {
        Game.rooms[roomName].memory.lab2Mode = 'none';
    }
    if (Game.rooms[roomName].memory.primaryLab === undefined) {
        Game.rooms[roomName].memory.primaryLab = true;
    }
    let min = Game.rooms[roomName].memory.labMode;
    if (Memory.stats.totalMinerals[min] !== undefined && Memory.stats.totalMinerals[min] < maxMinerals[min]) {

        Game.rooms[roomName].memory.primaryLab = true;
        return Game.rooms[roomName].memory.labMode;
    } else {
        if (Game.rooms[roomName].memory.lab2Mode == 'none') {
            //          console.log('maxed out minerals, doing 1st cause no 2ndary.', roomName);

            Game.rooms[roomName].memory.primaryLab = true;
            return Game.rooms[roomName].memory.labMode;
        }
        //        console.log('maxed out minerals, doing 2ndary.', roomName);

        Game.rooms[roomName].memory.primaryLab = false;
        return Game.rooms[roomName].memory.lab2Mode;
    }
}

function setLabs(roomName, labs) {
    var mode = analyzeRoomLabs(roomName, labs);

    if (mode) {
        let zz = labMode(roomName, mode, labs);
        return zz;
    }

    return labs;
}

function returnLabs(roomName) {
    if (Game.rooms[roomName] === undefined) {
        console.log(roomName, 'return labs failure', roomName.pos.roomName);
        return false;

    }
    if (Game.rooms[roomName].memory.labs === undefined) {
        switch (roomName) {

            default: console.log('Room not available,return empty room', roomName);
            return [];
        }
    } else {
        let zz = setLabs(roomName, Game.rooms[roomName].memory.labs);
        return zz;

    }

}

function updateRoomMember(roomName) {
    //    if (Game.rooms[roomName].memory.boostRequest !== undefined) Game.rooms[roomName].memory.boostRequest = undefined;

    let roomLabs = returnLabs(roomName); //Game.rooms[roomName].memory.labs;
    let minerals = {};
    let bb = Math.ceil(Math.random() * 2);
    for (var e in roomLabs) {
        let lab = getCached(roomLabs[e].id);
        if (lab !== null) {

            if (bb == 1) {
                lab.room.visual.text(parseInt(e) + 1, lab.pos.x, lab.pos.y, {
                    color: '#97c39a ',
                    stroke: '#000000 ',
                    strokeWidth: 0.123,
                    font: 0.5
                });
            } else {
                let color = '#97c39a ';
                if (roomLabs[e].emptied) color = '#660033';
                lab.room.visual.text(roomLabs[e].resource, lab.pos.x, lab.pos.y, {
                    color: color,
                    stroke: '#000000 ',
                    strokeWidth: 0.123,
                    font: 0.5
                });
            }


            if (minerals[lab.mineralType] === undefined) {
                minerals[lab.mineralType] = lab.mineralAmount;
            } else {
                minerals[lab.mineralType] += lab.mineralAmount;
            }
        }

    }



}



//5836bb2241230b6b7a5b9a4d E35S75 43,15
class buildLab {

    static getPlans(roomName) { // returns the acutal plans.
        let zzz = returnLabs(roomName);
        return zzz;
    }

    static getLabs(roomName) { // Returns the object of the labs.
        let returned = [];

        let labs = returnLabs(roomName);

        for (var i in labs) {
            let test = Game.getObjectById(labs[i].id);
            if (test !== null && test.pos.roomName !== roomName) {
                //                console.log('WTF why this not in the same room?', test, test.pos, test.id, roomName);
            } else if (test !== null) {
                returned.push(test);
            }
        }
        return returned;
    }

    static run() {

        for (var e in labRooms) {
            let roomName = labRooms[e];
            if (Game.rooms[roomName] !== undefined) {
                if (Game.rooms[roomName].memory.labs === undefined) {
                    Game.rooms[roomName].memory.labs = returnLabs(roomName);
                }
                if (Game.rooms[roomName].memory.labsNeedWork === undefined) {
                    Game.rooms[roomName].memory.labsNeedWork = true;
                }
                if (Game.rooms[roomName].memory.labs.length === 0) {
                    Game.rooms[roomName].memory.labs = emptyLab;
                }

                updateRoomMember(roomName);

                var labMix = getLabMixes(roomName);
                for (var a in labMix) {
                    let form = labMix[a];
                    if (labDo(roomName, form[0], form[1], form[2])) {}
                }
            }
        }

        linksCache = [];



    }

    static neededMinerals(roomName) {
        let mins = [];
        let labs = returnLabs(roomName);

        // Go through the labs in that room,
        // see what resources it needs,
        // send back array that has required
        // Terminal will use this, and then terminal will see if others have what it wants and gets it sent to them.

        for (var e in labs) {
            let lab = getCached(labs[e].id);
            if (lab !== null) {
                //        } && lab.mineralAmount < labs[e].amount) {
                let temp = labs[e].resource;
                mins.push(temp);
            }
        }
        return _.uniq(mins);
    }


    static moveToTransfer(creep) {
        let What;
        if (creep.carryTotal !== 0) {
            What = whatDoIHave(creep);
        } else {
            for (var a in creep.carry) {
                if (creep.carry[a] > 0)
                    What = a;
            }
        }
        let Where = whereDoIPut(creep, What);
        creep.say('m');
        //    console.log(Where,'58b231304f9ae14589af186d');
        if (Where === undefined) return false;
        let itgoes = getCached(Where);
        //    console.log(Where,itgoes,itgoes.mineralType, What)
        if (What != RESOURCE_ENERGY) {
            if (itgoes.mineralType !== null) {
                if (itgoes.mineralType != What) return false;
            }
        }
        // if(itgoes.mineralType != undefined && itgoes.mineralType != What ) return false;

        if (creep.pos.isNearTo(itgoes)) {
            creep.transfer(itgoes, What);
        } else {
            creep.moveMe(itgoes);
        }
        return true;
    }


    static getFromTerminal(creep) { // gets the resource wanted from the terminal.
        creep.say('g');
        let wanted = whatDoIget(creep);
        if (wanted === undefined) return false;
        let howMuch = howMuchDoIget(creep, wanted);

        if (creep.withdraw(creep.room.terminal, wanted) == ERR_NOT_IN_RANGE) {
            creep.moveMe(creep.room.terminal);
        }
        return true;
    }
}

module.exports = buildLab;