module.exports = function() {   

Creep.prototype.moveMe = function(target) {
	if (this.fatigue > 0) return;

	if (_.isUndefined(this.memory.stuckCount)) this.memory.stuckCount = 0;

	var moveStatus;
	var options = {};
	var samePath = 50;
	var stuck = false;

	if (this.memory.position != undefined) {
		stuck = this.pos.isEqualTo(this.memory.position.x, this.memory.position.y);
	}
	this.memory.position = this.pos;

	if (stuck) {
		this.memory.stuckCount++;
		if (this.memory.stuckCount >= 2) {
			this.memory.detourTicks = 5;
		}
	} else {
		this.memory.stuckCount = 0;
	}

	if (this.memory.detourTicks > 0) {
		this.memory.detourTicks--;
		samePath = 5;
	}

	options.reusePath = samePath;
	options.visualizePathStyle = {
		stroke: '#fa0',
		lineStyle: 'dotted',
		strokeWidth: 0.1,
		opacity: 0.5
	};

	moveStatus = this.moveTo(target, options);
	this.say('moving');
	if (moveStatus == ERR_NO_PATH) {
		this.moveFromExit();
	}

	return moveStatus;
};
};