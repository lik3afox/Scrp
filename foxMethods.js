class foxyTime  {

// Is creep has x and y in range. 
  static isInRange(creep,xx,yy,range) {
    let pos = creep.pos;
    if((pos.x > xx - range ) && (pos.y > yy - range) &&
       (pos.x < xx + range ) && (pos.y < yy + range) ) {
      return true;
    }

    return false;
  }

}

module.exports =  foxyTime;
