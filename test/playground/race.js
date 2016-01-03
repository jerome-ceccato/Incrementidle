function RaceResource(name, content, raceOwner) {
	this.raceOwner = raceOwner;
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = new BigNumber(0);

	this.costForCurrentOwnedAmount = function(cost) {
		return new BigNumber(cost.amount); // TODO
	};

	this.ownedDisplayString = function() {
		return this.owned.floor().toString();
	};

	this.nameDisplayString = function(amount) {
		return this.raceOwner.localizedName(this.name, 'resources', (amount === undefined ? this.owned : amount));
	}

	this.costDisplayString = function() {
		var displayString = '';
		if (this.content.cost !== undefined) {
			for (var i = 0; i < this.content.cost.length; i++) {
				var entity = this.raceOwner.entityForCost(this.content.cost[i]);
				if (entity !== undefined) {
					if (displayString.length > 0) {
						displayString += ', ';
					}
					var totalCost = entity.costForCurrentOwnedAmount(this.content.cost[i]);
					displayString += totalCost + ' ' + entity.nameDisplayString(totalCost);
				}
			}
		}
		return displayString;
	};

	this.fullDisplayString = function() {
		var cost = this.costDisplayString();
		var name = this.nameDisplayString();

		return cost.length > 0 ? name + ' (' + cost + ')' : name;
	};
};

function RaceUnit(name, content, raceOwner) {
	this.raceOwner = raceOwner;
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = new BigNumber(0);
	this.type = content.type;

	this.costForCurrentOwnedAmount = function(cost) {
		return new BigNumber(cost.amount); // TODO
	};

	this.ownedDisplayString = function() {
		return this.owned.floor().toString();
	};

	this.nameDisplayString = function(amount) {
		var name = this.raceOwner.localizedName(this.name, 'units', (amount === undefined ? this.owned : amount));
		return this.type == 'unit' ? name : '[' + name + ']';
	}

	this.costDisplayString = function() {
		var displayString = '';
		if (this.content.cost !== undefined) {
			for (var i = 0; i < this.content.cost.length; i++) {
				var entity = this.raceOwner.entityForCost(this.content.cost[i]);
				if (entity !== undefined) {
					if (displayString.length > 0) {
						displayString += ', ';
					}
					var totalCost = entity.costForCurrentOwnedAmount(this.content.cost[i]);
					displayString += totalCost + ' ' + entity.nameDisplayString(totalCost);
				}
			}
		}
		return displayString;
	};

	this.fullDisplayString = function() {
		var cost = this.costDisplayString();
		var name = this.nameDisplayString();

		return cost.length > 0 ? name + ' (' + cost + ')' : name;
	};
};

function RaceUpgrade(name, content, raceOwner) {
	this.raceOwner = raceOwner;
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = new BigNumber(0);
	this.type = content.type;

	this.costForCurrentOwnedAmount = function(cost) {
		return new BigNumber(cost.amount);
	};

	this.ownedDisplayString = function() {
		return this.owned.greaterThan(0) ? 'yes' : 'no';
	};

	this.nameDisplayString = function(amount) {
		return this.raceOwner.localizedName(this.name, 'upgrades', (amount === undefined ? this.owned : amount));
	}

	this.costDisplayString = function() {
		var displayString = '';
		if (this.content.cost !== undefined) {
			for (var i = 0; i < this.content.cost.length; i++) {
				var entity = this.raceOwner.entityForCost(this.content.cost[i]);
				if (entity !== undefined) {
					if (displayString.length > 0) {
						displayString += ', ';
					}
					var totalCost = entity.costForCurrentOwnedAmount(this.content.cost[i]);
					displayString += totalCost + ' ' + entity.nameDisplayString(totalCost);
				}
			}
		}
		return displayString;
	};

	this.fullDisplayString = function() {
		var cost = this.costDisplayString();
		var name = this.nameDisplayString();

		return cost.length > 0 ? name + ' (' + cost + ')' : name;
	};
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

	this.unlocked = {};

	this.init = function () {
		for (key in this.content.resources) {
			if (this.content.resources.hasOwnProperty(key)) {
				var resource = new RaceResource(key, this.content.resources[key], this);
				this.resources.push(resource);
				this.resourcesLookupTable[resource.name] = resource;
				this.globalLookupTable[resource.name] = resource; 
			}
		}

		for (key in this.content.units) {
			if (this.content.units.hasOwnProperty(key)) {
				var unit = new RaceUnit(key, this.content.units[key], this);
				this.units.push(unit);
				this.unitsLookupTable[unit.name] = unit;
				this.globalLookupTable[unit.name] = unit;
			}
		}

		for (key in this.content.upgrades) {
			if (this.content.upgrades.hasOwnProperty(key)) {
				var upgrade = new RaceUpgrade(key, this.content.upgrades[key], this);
				this.upgrades.push(upgrade);
				this.upgradesLookupTable[upgrade.name] = upgrade;
				this.globalLookupTable[upgrade.name] = upgrade;
			}
		}
	};

	this.localizationData = function(key, type) {
		if (type === undefined) {
			for (type in this.content.locale[engine.currentLocale()]) {
				if (this.content.locale[engine.currentLocale()].hasOwnProperty(type)) {
					if (this.content.locale[engine.currentLocale()][type][key] !== undefined) {
						return this.content.locale[engine.currentLocale()][type][key];
					}
				}
			}
		}
		return this.content.locale[engine.currentLocale()][type][key];
	};

	this.localizedName = function(key, type, quantity) {
		var data = this.localizationData(key, type);
		if ((quantity === undefined || quantity.lessThan(2)) && data.displayNameSingle !== undefined) {
			return data.displayNameSingle;
		}
		return data.displayName;
	};

	this.getOwnedEntity = function(name) {
		return this.globalLookupTable[name].owned;
	};

	this.offsetOwnedEntity = function(name, offset) {
		this.globalLookupTable[name].owned = this.globalLookupTable[name].owned.add(offset);
		return this.globalLookupTable[name].owned;
	};

	this.shouldReveal = function(data, type) {
		if (this.unlocked[data.name]) {
			return true;
		}
		var entity = this.globalLookupTable[data.name];
		if (entity.owned.greaterThan(0)) {
			this.unlocked[data.name] = true;
			return true;
		} else if (entity.content.preReq !== undefined) {
			for (var i = 0; i < entity.content.preReq.length; i++) {
				var requirement = entity.content.preReq[i];
				switch (requirement.type) {
					case 'ownUnit':
						if (this.unitsLookupTable[requirement.unit].owned.lessThan(requirement.amount)) {
							return false;
						}
					break;
					default:
					console.log('unknown requirement ' + requirement.type);
				}
			}
		} else if (type == 'resources') {
			return false;
		}
		this.unlocked[data.name] = true;
		return true;
	};

	this.entityForCost = function(cost) {
		if (cost.resource !== undefined) {
			return this.resourcesLookupTable[cost.resource];
		} else if (cost.unit !== undefined) {
			return this.unitsLookupTable[cost.unit];
		}
	};

	this.totalCostForObjects = function(cost, quantity) {
		return new BigNumber(cost.amount).abs().times(quantity); // TODO formula
	};

	this.canAfford = function(data, type, quantity) {
		switch (type) {
			case 'resources': return false;
			case 'upgrades':
				if (this.upgradesLookupTable[data.name].type == 'once') {
					if (this.upgradesLookupTable[data.name].owned.greaterThan(0)) {
						return false;
					} else {
						quantity = 1;
					}
				}
			default:
			if (data.content.cost !== undefined) {
				for (var i = 0; i < data.content.cost.length; i++) {
					if (!this.canAffordSingle(data.content.cost[i], quantity)) {
						return false;
					}
				}
			}
			return true;
		}
	};

	this.canAffordSingle = function(cost, quantity) {
		var amount = this.totalCostForObjects(cost, quantity);
		var entity = this.entityForCost(cost);
		if (entity !== undefined && entity.owned.lessThan(amount)) {
			return false;
		}
		return true;
	};

	this.tryBuy = function(data, type, quantity) {
		if (this.canAfford(data, type, quantity)) {
			if (type == 'upgrades' && this.upgradesLookupTable[data.name].type == 'once') {
				quantity = 1;
			}
			if (data.content.cost !== undefined) {
				for (var i = 0; i < data.content.cost.length; i++) {
					var cost = data.content.cost[i];
					var amount = this.totalCostForObjects(cost, quantity);
					var entity = this.entityForCost(cost);

					if (entity !== undefined) {
						entity.owned = entity.owned.sub(amount);
					}
				}
			}
			this.offsetOwnedEntity(data.name, quantity);
			return true;
		}
		return false;
	}

	this.maxGeneratable = function(cost, quantity) {
		var amount = new BigNumber(cost.amount).abs();
		var entity = this.entityForCost(cost);

		if (entity !== undefined) {
			return BigNumber.min(quantity, entity.owned.div(amount));
		}
		return quantity;
	};

	this.maxCanGenerate = function(entity, quantity) {
		var totalQuantity = new BigNumber(quantity).times(this.globalLookupTable[entity.name].owned);
		var maxAffordable = totalQuantity;
		for (var i = 0; i < entity.content.generates.length; i++) {
			if (entity.content.generates[i].amount < 0) {
				maxAffordable = BigNumber.min(totalQuantity, this.maxGeneratable(entity.content.generates[i], totalQuantity));
			}
		}
		return maxAffordable;
	};

	this.tick = function(ticks) {
		for (key in this.globalLookupTable) {
			if (this.globalLookupTable.hasOwnProperty(key)) {
				var entity = this.globalLookupTable[key];
				if (entity.content.generates !== undefined) {
					if (this.globalLookupTable[entity.name].owned.greaterThan(0)) {
						var max = this.maxCanGenerate(entity, ticks);
						for (var i = 0; i < entity.content.generates.length; i++) {
							var generated = entity.content.generates[i];
							var amount = new BigNumber(generated.amount).times(max);
							if (generated.resource !== undefined) {
								this.offsetOwnedEntity(generated.resource, amount);
							} else if (generated.unit !== undefined) {
								this.offsetOwnedEntity(generated.unit, amount);
							}
						}
					}
				}
			}
		}
	};

	this.init();
};
