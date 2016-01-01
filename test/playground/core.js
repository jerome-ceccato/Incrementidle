var engine = new function() {

	this.gold = 0;
	this.game = new Game();

	this.start = function() {
		dataBind(document.getElementById('gold'), this)

		setInterval('engine.update();', 1000);

		(new Game(gameContent.plants)).listUnits();
	};

	this.update = function() {
		this.gold++;
	};

	this.addOne = function() {
		this.gold++;
	};
};

