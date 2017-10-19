createOrder(ORDER_SELL, RESOURCE_KEANIUM, 0.9, 1000);

Game.market.calcTransactionCost(1000, 'W39N68', 'W28S73');

Game.market.deal('59b6cf25655799687523c272', 5000, 'E17S45');

Game.market.deal('583ee4c0d934dd3652132183', 1000, 'E28S71');
Game.market.deal('591c9806be13d2530e2d9d20', 5000, 'E28S71');
Game.market.deal('588b9067dab725f87b0f1afc', 4000, 'E26S77');

Game.rooms.E28S73.terminal.send(RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, 500, 'E26S73', 'trade');

Game.rooms.E29S79.terminal.send(RESOURCE_POWER, 10000, 'E37S75', 'trade');

Game.rooms.E28S37.terminal.send('energy', 150000, 'E14S38', 'trade');




Game.rooms.E25S43.terminal.send('UO', 30000, 'E25S37', 'trade');
Game.rooms.E25S37.terminal.send('Z', 20000, 'E9S42', 'trade');

Game.rooms.E28S71.terminal.send('X', 15000, 'E5N7', 'trade');
Game.rooms.E23S38.terminal.send('LO', 1000, 'E18S36', 'trade');
Game.rooms.W4S93.terminal.send('H', 8000, 'E5N7', 'trade');

Game.market.cancelOrder('598dd9bbc9aaff3cb2dad9b6');
Game.market.cancelOrder('59d937cc1aadaa262312db20');
Game.market.cancelOrder('59d937d01aadaa262312dc57');
Game.market.cancelOrder('59d937d91aadaa262312dec3');
Game.market.cancelOrder('59dd832216373068e967dbaf');
Game.market.cancelOrder('59c6688cc3086045fc730bd0');

Game.market.cancelOrder('59c72e66e6480025b1468a45');

var cost = Game.market.calcTransactionCost(10000, 'E28S73', 'E28S71');

Game.market.createOrder(ORDER_BUY, 'L', 0.08, 400000, "E28S77");
Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 400000, "E38S81");

Game.market.createOrder(ORDER_SELL, 'O', 0.82, 100000, "E18S36");

Game.market.createOrder(ORDER_SELL, 'K', 0.86, 20000, "E17S45");

Game.market.createOrder(ORDER_BUY, 'H', 1, 40000, "E14S43");
Game.market.changeOrderPrice('59b6c6351d0e513fdacac4b9', 1.10);



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

Game.rooms.E27S75.terminal.send(RESOURCE_ENERGY, 45000, 'E28S73', 'trade');

Game.rooms.E27S75.terminal.send('XGH2O', 13000, 'E35S83', 'trade');

Game.rooms.E26S73.terminal.send('UH', 300, 'E38S82', 'trade');

Game.rooms.E26S73.terminal.send('GHO2', 9000, 'E27S75', 'trade');

Game.rooms.E26S77.terminal.send('XUH2O', 1500, 'E38S82', 'trade');

Game.rooms.E26S73.terminal.send('XLH2O', 2400, 'E35S83', 'trade');

Game.rooms.E26S77.terminal.send('XZHO2', 1500, 'E38S82', 'trade');
