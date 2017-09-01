var labRooms = ['E18S36', 'E23S38', 'E25S37', 'E13S34', 'E17S34', 'E27S34', 'E18S32','E14S37','E17S45','E28S37','E27S34','E24S33'];

/*
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
    RESOURCE_ZYNTHIUM_OXIDE: "ZO",
    RESOURCE_GHODIUM_HYDRIDE: "GH",
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
    RESOURCE_CATALYZED_ZYNTHIUM_ACID: "XZH2O",
    RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE: "XZHO2",
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

    'OH': 30000,
    'UL': 10000,
    'ZK': 10000,
    'G': 50000,
    'GG' : 50000,
    'LH': 30000,
    'KO': 30000,
    'LO': 30000,

    /*    'UO': 10000,
        'UH': 10000,
        'ZO': 10000,
        'ZH': 10000,
        'KH': 10000, */

    'GH': 50000,
    //    'GHO2': 60000,
    /*    'XGHO2': 100,

        //    'UHO2': 5000,
        //   'UH2O': 5000,
        //    'ZHO2': 5000,
        //    'ZH2O': 5000,
        //    'LHO2': 5000,
        //    'LH2O': 5000,
        //    'KHO2': 5000,
        //    'KH2O': 5000,

        'XUHO2': 0, //  Mining
        'XUH2O': 100000, // Attack
        'XZHO2': 100000, //  Move
        'XZH2O': 100000, // Dismantle
        'XLHO2': 100000, // Heal
        'XLH2O': 0, // Repair
        'XKHO2': 100000, // Ranged
        'XKH2O': 0, // Carry */

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
    resource: 'XUH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
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
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'XGH2O',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'XGH2O',
    amount: 2700,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'XGH2O',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'ZHO2',
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
    resource: 'XZHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

// Range Attack
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
    resource: 'KHO2',
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
    resource: 'XKHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
}];

// MOVE
var XXZHO2 = [{
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
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'OH',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'UH2O',
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
    resource: 'XUH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XGH2O',
    amount: 2500,
    emptied: false
}];

// DISMANTLE
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
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'O',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'ZH2O',
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
    resource: 'XZH2O',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
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
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'H',
    amount: 2400,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'GHO2',
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
    resource: 'XGHO2',
    amount: 1,
    emptied: true
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'LHO2',
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
    resource: 'XLHO2',
    amount: 1,
    emptied: true
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
    resource: 'XGH2O',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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
    resource: 'XGH2O',
    amount: 2500,
    emptied: false
}, {
    id: 'getReplaced',
    resource: 'XUH2O',
    amount: 2500,
    emptied: false
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

var oneWarMix = [
    [3, 1, 2],
    [4, 1, 2],
    [5, 1, 2],
    [6, 1, 2],
    [7, 1, 2],
    [8, 1, 2],
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
        console.log('undefined Lab', roomName);
        return false;
    }
    //    if (Memory.stats.totalMinerals[labs[created - 1]] === undefined) return false;
    //    console.log(( Memory.stats.totalMinerals[labs[created-1].resource]>maxMinerals[labs[created-1].resource] ));
    if (REACTIONS[labs[labz - 1].resource] === undefined) {
        console.log('ERROR', roomName);
    } else if (REACTIONS[labs[labz - 1].resource][labs[laby - 1].resource] !== labs[created - 1].resource) {
        console.log(REACTIONS[labs[labz - 1].resource][labs[laby - 1].resource], labs[created - 1].resource, roomName);
        return;
    }
    //  if (Memory.stats.totalMinerals !== undefined)
    //        if (Memory.stats.totalMinerals[labs[created - 1].resource] > maxMinerals[labs[created - 1].resource] && labs[created - 1].emptied) {
    //        console.log("max Mineral Triggered", labs[created - 1].resource, maxMinerals[labs[created - 1].resource], Memory.stats.totalMinerals[labs[created - 1].resource]);
    //    return false;
    //  }
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
    ///       if(lab1.room.name == 'E13S34')
    //   console.log('gets here?');
//    if(labs[created - 1].resource == 'g')
//    console.log('bizz',lab2.room.terminal.store[labs[created - 1].resource],labs[created - 1].resource,roomName);
        if (lab1.mineralAmount >= 2950 || (lab2.mineralAmount < 50 && lab2.room.terminal.store[labs[labz - 1].resource] > 100 ) || 
            (lab3.mineralAmount < 50 && lab3.room.terminal.store[labs[laby - 1].resource] > 100 ) ) {

            lab3.room.memory.labsNeedWork = true;
            return false;
        }
    if (lab2.mineralType != labs[labz - 1].resource) return false;
    if (lab3.mineralType != labs[laby - 1].resource) return false;

    let zz = lab1.runReaction(lab2, lab3);

    if (zz !== 0) console.log(created, labz, laby, lab1.mineralAmount, 'lab Reaction', zz, lab1.mineralType, lab2.mineralType, lab3.mineralType, roomName);
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
        case 'G':
            for (a in G) {
                if (labs[a] !== undefined)
                    G[a].id = labs[a].id;
            }
            returned = G;
            break;
        case 'GG':
            returned = GG;
            break;
        case 'OH':
            for (a in OH) {
                if (labs[a] !== undefined)
                    OH[a].id = labs[a].id;
            }
            returned = OH;
            break;
        case 'UL':
            returned = UL;
            break;
        case 'ZK':
            for (a in ZK) {
                if (labs[a] !== undefined)
                    ZK[a].id = labs[a].id;
            }
            returned = ZK;
            break;

        case 'GG':
            for (a in GG) {
                if (labs[a] !== undefined)
                    GG[a].id = labs[a].id;
            }
            returned = GG;
            break;

        case 'GH':
            for (a in GH) {
                if (labs[a] !== undefined)
                    GH[a].id = labs[a].id;
            }
            returned = GH;
            break;

        case 'GH2O':
            for (a in GH2O) {
                if (labs[a] !== undefined)
                    GH2O[a].id = labs[a].id;
            }
            returned = GH2O;
            break;

        case 'XGH2O':
            for (a in XGH2O) {
                if (labs[a] !== undefined)
                    XGH2O[a].id = labs[a].id;
            }
            returned = XGH2O;
            break;

        case 'muster':
            for (a in muster) {
                if (labs[a] !== undefined)
                    muster[a].id = labs[a].id;
            }
            returned = muster;
            break;
        case 'XUH2O':
            for (a in XUH2O) {
                if (labs[a] !== undefined)
                    XUH2O[a].id = labs[a].id;
            }
            returned = XUH2O;
            break;
        case 'XKH2O':
            for (a in XKH2O) {
                //        if (labs[e] !== undefined)
                if (labs[a] !== undefined)
                    XKH2O[a].id = labs[a].id;
            }
            returned = XKH2O;
            break;
        case 'XGHO2':
            for (var e in XGHO2) {
                if (labs[a] !== undefined)
                    XGHO2[e].id = labs[e].id;
            }
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
  //  if(roomName == 'E14S37')
//console.log( returned[2].resource,'b',Game.rooms[roomName].memory.boostRequest.length);
    if(Game.rooms[roomName].memory.boostRequest !== undefined)
        if ( Game.rooms[roomName].memory.boostRequest.length > 0) {
                Game.rooms[roomName].memory.boostRequest[0].timed--;
            if (Game.rooms[roomName].memory.boostRequest[0].timed < 0) {
                Game.rooms[roomName].memory.boostRequest.shift();
            } else {
                let zz = Game.rooms[roomName].memory.boostRequest[0].resource;
//                console.log(zz,Game.rooms[roomName].memory.boostRequest[0].amount,roomName);
                returned[2].resource = zz;
                returned[2].amount = Game.rooms[roomName].memory.boostRequest[0].amount;
                returned[2].emptied = false;
            }
        }
//    if(roomName == 'E14S37')

//console.log( returned[2].resource,'a',Game.rooms[roomName].memory.boostRequest.length);
    return returned;
}

function getLabMixes(roomName) {
    switch (Game.rooms[roomName].memory.labMode) {
        case 'XGH2O':
        case 'LH':
        case 'OH':
        case 'GH':
        case 'ZK':
        case 'UL':
        case 'KO':
        case 'LO':
        case 'GH2O':
        case 'GG':
            return oneWarMix;
        case 'XXZHO2':
            return E29S79WarMix;
        case 'light':
        case undefined:
            return Game.rooms[roomName].memory.labMix;
        case 'G':
            return gMix;
        default:
            return oneWarMix;
    }
}

//labRooms
function anyroomMakingMineral(type) {
    for (var e in labRooms) {
//        console.log(Game.rooms[labRooms[e]].memory.labMode, labRooms[e], type);
        if (Game.rooms[labRooms[e]].memory.labMode !== undefined && Game.rooms[labRooms[e]].memory.labMode == type) {
            return true;
        }
    }
    return false;
}


function analyzeRoomLabs(roomName, labs) {

    if (Game.rooms[roomName].memory.labMode === undefined) {
        //    console.log('first we check to see what mineral we need to use');
        for (var RS in maxMinerals) {
            //        console.log(Memory.stats.totalMinerals[RS], RS, maxMinerals[RS]);
            if (Memory.stats.totalMinerals[RS] < maxMinerals[RS]) {
                // We need this
                var min = RS;

                if (!anyroomMakingMineral(RS)) {
                    //                console.log('Then we check to see if any room is available', Game.rooms[roomName], anyroomMakingMineral(RS));
                    var lv8 = [
                        'XUHO2',
                        'XUH2O',
                        'XZHO2',
                        'XZH2O',
                        'XLHO2',
                        'XLH2O',
                        'XKHO2',
                        'XKH2O',
                    ];
                    if (_.contains(lv8, RS) && Game.rooms[roomName].controller.level == 8) {
                        Game.rooms[roomName].memory.labMode = RS;
                    } else {
                        Game.rooms[roomName].memory.labMode = RS;
                    }
                    //                  console.log('Then we change it into it.', Game.rooms[roomName].memory.labMode);
                    return Game.rooms[roomName].memory.labMode;
                }
            }
        }
    } else {
        //        console.log('for that one we also check to see if any room is currently doing it, and if it"s reaching it max');
        var mineral = Game.rooms[roomName].memory.labMode;
        if (maxMinerals[mineral] === undefined) {
//            Game.rooms[roomName].memory.labMode = undefined;
        } else if (Memory.stats.totalMinerals[mineral] >= maxMinerals[mineral]) {
//            Game.rooms[roomName].memory.labMode = undefined;
        } else {
            //            console.log('and it"s not ready',Memory.stats.totalMinerals[mineral], maxMinerals[mineral],mineral);
            return Game.rooms[roomName].memory.labMode;
        }
    }
}

function setLabs(roomName, labs) {
    var lab = analyzeRoomLabs(roomName, labs);

    if (lab) {
        let zz = labMode(roomName, lab, labs);
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
    // Game.rooms[roomName].memory.labMinerals - this hold what the room has
    // Game.rooms[roomName].memory.calledMinerals - this holds what creep in production have called.
    // Game.rooms[roomName].memory.availableMinerals - this hold what is available for creeps to call.
    if (Game.rooms[roomName].memory.calledMinerals === undefined) {
        Game.rooms[roomName].memory.calledMinerals = {};
    }
    //    if (Game.rooms[roomName].memory.availableMinerals === undefined) Game.rooms[roomName].memory.availableMinerals = [];

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
                if (Game.rooms[roomName].memory.calledMinerals[lab.mineralType] === undefined) {
                    Game.rooms[roomName].memory.calledMinerals[lab.mineralType] = 0;
                }
            } else {
                minerals[lab.mineralType] += lab.mineralAmount;
            }
        }

    }


    Game.rooms[roomName].memory.labMinerals = minerals;

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
            if (Game.rooms[roomName].memory.labsNeedWork) {
                // here we see if the flag to create scientist is there
                if (Game.flags.SCI === undefined && roomName !== 'E18S36') {
                    console.log("ADDING FLAG",roomName);
                    Game.rooms[roomName].createFlag(25, 25, 'SCI', COLOR_YELLOW, COLOR_YELLOW);
                } else {

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