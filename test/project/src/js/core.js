var engine = new function() {

	this.game = undefined;

	this.currentLocale = function() {
		return 'fr';
	};

	this.selectedBuyQuantity = function() {
		return new BigNumber(1);
	};

	this.start = function() {
		//this.game = new Game(new Race('plants', gameContent.plants));
		this.game = new Game(GameRace.create('plants', gameContent.plants));
		this.game.buildTables();
		this.refresh();

		window.setInterval(function() {
			engine.update();
		}, 100);
	};

	this.update = function() {
		this.game.tick();
		this.refresh();
	};

	this.refresh = function() {
		this.game.refreshTable();
	};

	this.mainButtonPressed = function() {
		this.game.mainButtonPressed();
		this.refresh();
	};

	this.mainButton2Pressed = function() {
		this.game.mainButton2Pressed();
		this.refresh();
	};
};

$(document).ready(function() {
	engine.start();
});
