function RaceResource(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.user = 0;
};

function RaceUnit(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.user = 0;
};

function RaceUpgrade(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.user = 0;
};

function Race(name, content) {
	this.name = name;
	this.content = content;

	this.resources = [];
	this.units = [];
	this.upgrades = [];

	this.init = function () {
		for (key in this.content.resources) {
			if (this.content.resources.hasOwnProperty(key)) {
				this.resources.push(new RaceResource(key, this.content.resources[key]));
			}
		}

		for (key in this.content.units) {
			if (this.content.units.hasOwnProperty(key)) {
				this.units.push(new RaceUnit(key, this.content.units[key]));
			}
		}

		for (key in this.content.upgrades) {
			if (this.content.upgrades.hasOwnProperty(key)) {
				this.upgrades.push(new RaceUpgrade(key, this.content.upgrades[key]));
			}
		}
	};

	this.localizedName = function(type, key) {
		switch (type) {
			case 'resources': return this.content.locale[engine.currentLocale()].resources[key].displayName;
			case 'units': return this.content.locale[engine.currentLocale()].units[key].displayName;
			case 'upgrades': return this.content.locale[engine.currentLocale()].upgrades[key].displayName;
		}
		return '';
	};

	this.init();
};
