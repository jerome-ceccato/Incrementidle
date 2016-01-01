function Game(content) {
	this.content = content;

	this.listUnits = function() {
		Object.keys(this.content.units).forEach(function (key) {
   			console.log(key)
		});
	};
};
