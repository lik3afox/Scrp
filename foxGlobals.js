/*
var roleParent = require('role.parent');
var movement = require('commands.toMove');
var constr = require('commands.toStructure');
var source = require('commands.toSource');
var containers = require('commands.toContainer');
#ffe56d
*/
var console = require('market');

module.exports = {
    friends: ['admon', 'Baj', 'Zeekner', 'ponka', 'ART999'],
    RETREAT: COLOR_BROWN, // Flag that certain creeps use to defend too.
    DEFEND: COLOR_RED, // Everyone will defend to this.
    PARTY: COLOR_ORANGE, // Before Rally creeps will stop by this.
    ATTACK: COLOR_GREEN, // All creeps go to it
    RISK: COLOR_GREY, // NOt certain if it's in use
    RALLY: COLOR_YELLOW, // If this flag has a name on it will create an party
    FOCUS: COLOR_CYAN, // This is where transportx and transporty will move too.
    RAMPART: COLOR_PURPLE,
    GUARD: COLOR_BLUE // For guarding a keeper room
};
/*
{color: '#97c39b ',
stroke: '#000000 ',
strokeWidth: 0.123,
font: 0.5}
*/
// {filter: {structureType: STRUCTURE_SPAWN}}
// ,{filter: {structureType: STRUCTURE_SPAWN}}
//  Game.market.deal('58765c84289f0256300749e8', 1000, "E26S73");
/*      let expansions = spawn.room.find(FIND_STRUCTURES, {
            filter: object => (object.structureType == STRUCTURE_CONTAINER &&
                                spawn.pos.isNearBy(object))
            });
*/ //containers.sort((a, b) => a.hits - b.hits);
//Game.market.deal('58765c84289f0256300749e8', 5000, "E26S73"); 

//var targets = creep.room.find(FIND_STRUCTURES, {filter: s => s.structureType == STRUCTURE_CONTAINER && _.sum(s.store) < s.storeCapacity})
