var engine = new function() {

	this.gold = 0;
	this.game = undefined;

	this.currentLocale = function() {
		return 'fr';
	};

	this.start = function() {
		this.game = new Game(new Race('plants', gameContent.plants));
		this.game.buildTables();

		window.setInterval(function() {
			engine.update();
		}, 1000);
	};

	this.update = function() {
		this.gold++;
		this.refresh();
	};

	this.refresh = function() {
		$('#gold').text(this.gold);
		this.game.refreshTable();
	};

	this.addOne = function() {
		this.gold++;
		this.refresh();
	};
};

$(document).ready(function() {
	engine.start();
});
