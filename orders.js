createOrder(ORDER_SELL, RESOURCE_KEANIUM, 0.9, 1000);

Game.market.calcTransactionCost(1000, 'W39N68', 'W28S73');

Game.market.deal('588b9067dab725f87b0f1afc', 10000, 'E28S73');
Game.market.deal('588b9067dab725f87b0f1afc', 4000, 'E26S77');

Game.rooms.E28S73.terminal.send(RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE, 500, 'E26S73', 'trade');

Game.rooms.E29S79.terminal.send(RESOURCE_POWER, 10000, 'E37S75', 'trade');

Game.rooms.E26S77.terminal.send('XGH2O', 40000, 'E38S82', 'trade');

Game.rooms.E27S74.terminal.send('H', 15777, 'E28S71', 'trade');

Game.rooms.E28S71.terminal.send(RESOURCE_ENERGY, 1500000, 'E26S77', 'trade');

Game.market.cancelOrder('589a4c6230c9ccee528ba498');

var cost = Game.market.calcTransactionCost(10000, 'E28S73', 'E28S71');

Game.market.createOrder(ORDER_BUY, 'XUH2O', 0.05, 10000, "E28S77");
Game.market.createOrder(ORDER_BUY, RESOURCE_ENERGY, 0.01, 1200000, "W4S93");

Game.market.createOrder(ORDER_BUY, 'O', 0.15, 50000, "E28S71");

Game.market.createOrder(ORDER_SELL, 'U', 0.17, 100000, "E37S75");

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
