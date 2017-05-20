function checkNCreate(id) {
        let creep = Game.getObjectById(id);
        if(creep == undefined){
          console.log('Id is invalid');
          return false;
        } 
        if(creep.memory.task == undefined) {
          console.log('Failure creep doesn"t accept taskts');
        }
        return creep;
}

function setupCommands() {

  Game.myMarket = {
    order(type,resourceType,price,totalAmount) {
  		console.log('testing');
  	}
/*    clear(id) {
      let creep = checkNCreate(id);
      let task = creep.memory.task;
      console.log('Clearing Task list')
      task = [];
    }*/

  };

  Game.Order = {
    /* this hsould be given 
    target or pos can be optional 
//        targetID:58b4baa812f4bf357c355244,
    Game.Order.creep('58e987f98dd21b4f7aa198a7',{
        order:"attack",
        pos: new RoomPosition(8,8,'E28S71'),
        targetID:'58b4baa812f4bf357c355244',
        options:{reusePath:40}
      }) */
    creep(id,order){
      let creep = checkNCreate(id);
      creep.memory.task.push(order);
    },
    clear(id) {
      let creep = checkNCreate(id);
      console.log('Clearing Task list',task.length)
    },
    pop(id) {
      let creep = checkNCreate(id);
      let task = creep.memory.task;
      console.log('Poping Last')
      task.pop();
    },
    shift(id) {
      let creep = checkNCreate(id);
      let task = creep.memory.task;
      console.log('Shift First')
      task.shift();
    }

  };

}
// Game.market.createOrder(ORDER_SELL, RESOURCE_GHODIUM, 9.95, 10000, "W1N1");
// Game.market.calcTransactionCost(1000, 'W0N0', 'W10N5');
module.exports = {
  wrap(callback) { 
  setupCommands();
  	return callback();
  }
}