createOrder(ORDER_SELL, RESOURCE_KEANIUM, 0.9, 1000);

Game.market.calcTransactionCost(1000, 'W39N68', 'W28S73');

Game.market.deal('5c33996f3d74033c84925cfe', 3576, 'E19S49');

Game.market.deal('5a76547921d27469cb613e25', 2000, 'E19S49');

Game.market.deal('591c9806be13d2530e2d9d20', 5000, 'E28S71');
Game.market.deal('588b9067dab725f87b0f1afc', 4000, 'E26S77');

Game.rooms.E28S73.terminal.send(RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, 500, 'E26S73', 'trade');

Game.rooms.E18S36.terminal.send('ops', 5000, 'E21S49', 'trade');

Game.rooms.E59S51.terminal.send('XGHO2', 4999, 'E1S11', 'trade');

Game.rooms.E14S38.terminal.send('K', 5600, 'E1S11', 'trade');
Game.rooms.E1S11.terminal.send(RESOURCE_POWER, 25000, 'E54S53', 'trade');
Game.rooms.E18S32.terminal.send('energy', 100000, 'E38S72', 'trade');
let obj = Game.rooms[roomName].memory.mineInfo;
//Game.rooms[roomName].memory.mineInfo = _(_.keys(obj))
    //.sortBy(id => parseInt('0x' + id, 16))
//    .reduce((acc, id) => _.set(acc, id, obj[id]), {})

function getOutsideWalls2(walls, room) {
    const WALL = 1, VISITED = 2;
    const result = [];
    const matrix = new PathFinder.CostMatrix();
    walls.forEach(pos => matrix.set(pos.x, pos.y, WALL));
    walls.forEach(pos => matrix.set(pos.x-1, pos.y, WALL));
    walls.forEach(pos => matrix.set(pos.x, pos.y-1, WALL));
    walls.forEach(pos => matrix.set(pos.x-1, pos.y-1, WALL));

    room.find(FIND_EXIT).forEach(({ x, y }) => flood(x, y));
    return result;
}






Game.market.cancelOrder('5c89e0281683466493e0efb0');
Game.market.cancelOrder('5c8a4b751683466493f0d225');
Game.market.cancelOrder('5c8a746b1683466493f69ff4');


Game.market.cancelOrder('5a9712e72e3b170337c1a395');
Game.market.cancelOrder('5a9712e72e3b170337c1a396');


Game.rooms.E27S45.terminal.send('energy',1000000, 'E27S55', 'trade');


Game.rooms.E19S49.terminal.send('energy', 10000, 'W7S56', 'trade');



Game.rooms.E25S37.terminal.send('Z', 20000, 'E22S48', 'trade');


Game.rooms.E24S33.terminal.send('U', 21000, 'E22S48', 'trade');

Game.rooms.E25S43.terminal.send('O', 30000, 'E25S37', 'trade');

Game.rooms.E25S37.terminal.send('Z', 20700, 'E6S28', 'trade');

Game.rooms.E28S71.terminal.send('X', 15000, 'E5N7', 'trade');

Game.rooms.E23S38.terminal.send('UH', 2500, 'E25S47', 'trade');
Game.rooms.E23S38.terminal.send('LHO2', 11000, 'E25S27', 'trade');

Game.rooms.W4S93.terminal.send('H', 8000, 'E5N7', 'trade');

Game.market.cancelOrder('598dd9bbc9aaff3cb2dad9b6');
Game.market.cancelOrder('59d937cc1aadaa262312db20');

Game.market.cancelOrder('5a9714b6d51df80354b2a821');
Game.market.cancelOrder('5aa348cf23d04b416ef51687');
Game.market.cancelOrder('5a9769c9a73e5306b853e052');



Game.market.cancelOrder('59c72e66e6480025b1468a45');

var cost = Game.market.calcTransactionCost(10000, 'E28S73', 'E28S71');



Game.market.createOrder(ORDER_BUY, 'energy', 0.023, 500000, "E19S49");
Game.market.createOrder(ORDER_BUY, 'X', 0.05, 300000, "E38S72");

Game.market.createOrder(ORDER_SELL, 'X', 0.1, 10000, "E19S49");

Game.market.createOrder(ORDER_BUY, 'energy', 0.03, 50000, "E19S49");


Game.market.createOrder(ORDER_BUY, 'H', 1, 40000, "E14S43");
Game.market.changeOrderPrice('5bf5a2da434cba1f989554b0', 0.01);



let parsed = /^([WE])([0-9]+)([NS])([0-9]+)$/.exec(room_name);
let we = parsed[1]; // will contain W or E
let we_v = Number(parsed[2]); // will contain the number after W or E
let ns = parsed[3]; // will contain N or S
let ns_v = Number(parsed[4]); // will contain the number after N or S
/*
Object.defineProperty(Room.prototype, 'sources', {
 configurable: true,
 get: function(this: Room) {
   if (this.cache.sources === undefined) {
     this.cache.sources = this.find<Source>(FIND_SOURCES)
   }
   if (this.cache.sources === undefined) {
     this.cache.sources = []
   }
   return this.cache.sources
 }
})
*/
Game.Order.creep('58e987f98dd21b4f7aa198a7', {
    order: "harvest",
    resource: RESOURCE_ENERGY,
    repeat: true,
    targetID: '5836bab3090e0ab576fdd797',
    options: { reusePath: 10 }
});

Game.Order.creep('58e987f98dd21b4f7aa198a7', {
    order: "wait",
    timed: 5,
});

Game.rooms.E13S18.terminal.send(RESOURCE_ENERGY, 45000, 'E28S73', 'trade');

Game.rooms.E13S18.terminal.send('XGH2O', 5000, 'E14S13', 'trade');

Game.rooms.E26S73.terminal.send('UH', 300, 'E38S82', 'trade');

Game.rooms.E26S73.terminal.send('GHO2', 9000, 'E27S75', 'trade');

Game.rooms.E26S77.terminal.send('XUH2O', 1500, 'E38S82', 'trade');

Game.rooms.E26S73.terminal.send('XLH2O', 2400, 'E35S83', 'trade');

Game.rooms.E26S77.terminal.send('XZHO2', 1500, 'E38S82', 'trade');


                /*if (Game.spawns[title].room.memory.energyIn) {
                    Game.spawns[title].room.visual.text("+", Game.spawns[title].pos.x - 0.5, Game.spawns[title].pos.y + 0.5, {
                        color: '#FFFFFF ',
                        stroke: '#000000 ',
                        strokeWidth: 0.123,
                        font: 1.5,
                        align: RIGHT
                    });
                } else {
                    Game.spawns[title].room.visual.text("-", Game.spawns[title].pos.x - 0.5, Game.spawns[title].pos.y + 0.5, {
                        color: '#FFFFFF ',
                        stroke: '#000000 ',
                        strokeWidth: 0.123,
                        font: 1.5,
                        align: RIGHT
                    });

                }*/
                /*
                                if (Game.spawns[title].room.boostLab !== undefined)
                                    Game.spawns[title].room.visual.text("B", Game.spawns[title].room.boostLab.pos.x - 0.5, Game.spawns[title].room.boostLab.pos.y + 0.5, {
                                        color: '#FFFFFF ',
                                        stroke: '#000000 ',
                                        strokeWidth: 0.123,
                                        font: 1.5,
                                        align: RIGHT
                                    });


                if (Game.spawns[title].room.memory.terminalText !== undefined) {
                    let xx = 40;
                    let yy = 28;
                    Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.labMode + "(Lab)W:" + Game.spawns[title].room.memory.labsNeedWork + " Min:" + Game.spawns[title].room.memory.lab2Mode + " time:" + Game.spawns[title].room.memory.labShift, xx, yy + 1, { color: '#FF00FF ', stroke: '#000000 ', strokeWidth: 0.123, font: 0.5 });

                    if (Game.spawns[title].room.memory.terminalText.sent !== undefined) {
                        Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.terminalText.sent, xx, yy + 2, {
                            color: '#97c39a ',
                            stroke: '#000000 ',
                            strokeWidth: 0.123,
                            font: 0.5,
                        });
                    }
                    if (Game.spawns[title].room.memory.terminalText.recieved !== undefined) {
                        Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.terminalText.recieved, xx, yy + 3, {
                            color: '#97c39a ',
                            stroke: '#000000 ',
                            strokeWidth: 0.123,
                            font: 0.5,
                        });
                    }
                    if (Game.spawns[title].room.memory.terminalText.deal !== undefined) {
                        Game.spawns[title].room.visual.text(Game.spawns[title].room.memory.terminalText.deal, xx, yy + 4, {
                            color: '#97c39a ',
                            stroke: '#000000 ',
                            strokeWidth: 0.123,
                            font: 0.5,
                        });
                    }

                }
                                    
                */