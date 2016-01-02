function RaceResource(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = 0;
};

function RaceUnit(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = 0;
};

function RaceUpgrade(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = 0;
};

function Race(name, content) {
	this.name = name;
	this.content = content;

	this.resources = [];
	this.units = [];
	this.upgrades = [];

	this.globalLookupTable = {};
	this.resourcesLookupTable = {};
	this.unitsLookupTable = {};
	this.upgradesLookupTable = {};

	this.init = function () {
		for (key in this.content.resources) {
			if (this.content.resources.hasOwnProperty(key)) {
				var resource = new RaceResource(key, this.content.resources[key]);
				this.resources.push(resource);
				this.resourcesLookupTable[resource.name] = resource;
				this.globalLookupTable[resource.name] = resource; 
			}
		}

		for (key in this.content.units) {
			if (this.content.units.hasOwnProperty(key)) {
				var unit = new RaceUnit(key, this.content.units[key]);
				this.units.push(unit);
				this.unitsLookupTable[unit.name] = unit;
				this.globalLookupTable[unit.name] = unit;
			}
		}

		for (key in this.content.upgrades) {
			if (this.content.upgrades.hasOwnProperty(key)) {
				var upgrade = new RaceUpgrade(key, this.content.upgrades[key]);
				this.upgrades.push(upgrade);
				this.upgradesLookupTable[upgrade.name] = upgrade;
				this.globalLookupTable[upgrade.name] = upgrade;
			}
		}
	};

	this.localizedName = function(type, key) {
		console.log(type + ' ' + key);
		return this.content.locale[engine.currentLocale()][type][key].displayName;
	};

	this.getOwnedEntity = function(name) {
		return this.globalLookupTable[name].owned;
	};

	this.offsetOwnedEntity = function(name, offset) {
		this.globalLookupTable[name].owned += offset;
		return this.globalLookupTable[name].owned;
	};

	this.canAfford = function(data, type) {
		switch (type) {
			case 'resources': return false;
			default:
			if (data.content.cost !== undefined) {
				for (var i = 0; i < data.content.cost.length; i++) {
					var cost = data.content.cost[i];
					if (cost.resource !== undefined && this.resourcesLookupTable[cost.resource].owned < cost.amount) {
						return false;
					} else if (cost.unit !== undefined && this.unitsLookupTable[cost.unit].owned < cost.amount) {
						return false;
					}
				}
			}
			return true;
		}
	};

	this.tryBuy = function(data, type) {
		if (this.canAfford(data, type)) {
			if (data.content.cost !== undefined) {
				for (var i = 0; i < data.content.cost.length; i++) {
					var cost = data.content.cost[i];
					if (cost.resource !== undefined) {
						this.resourcesLookupTable[cost.resource].owned -= cost.amount;
					} else if (cost.unit !== undefined) {
						this.unitsLookupTable[cost.unit].owned -= cost.amount;
					}
				}
			}
			this.offsetOwnedEntity(data.name, 1);
			return true;
		}
		return false;
	}

	this.init();
};
