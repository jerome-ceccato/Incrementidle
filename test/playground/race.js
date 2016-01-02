function RaceResource(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = new BigNumber(0);
};

function RaceUnit(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = new BigNumber(0);
};

function RaceUpgrade(name, content) {
	this.name = name;
	this.key = name;
	this.content = content;
	this.owned = new BigNumber(0);
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

	this.localizedName = function(key, type) {
		return this.localizationData(key, type).displayName;
	};

	this.getOwnedEntity = function(name) {
		return this.globalLookupTable[name].owned;
	};

	this.offsetOwnedEntity = function(name, offset) {
		this.globalLookupTable[name].owned = this.globalLookupTable[name].owned.add(offset);
		return this.globalLookupTable[name].owned;
	};

	this.shouldReveal = function(data, type) {
		var entity = this.globalLookupTable[data.name];
		if (entity.owned.greaterThan(0)) {
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
		}
		return true;
	};

	this.totalCostForObjects = function(cost, quantity) {
		return new BigNumber(cost.amount).abs().times(quantity); // TODO formula
	};

	this.canAfford = function(data, type, quantity) {
		switch (type) {
			case 'resources': return false;
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
		amount = this.totalCostForObjects(cost, quantity);
		if (cost.resource !== undefined && this.resourcesLookupTable[cost.resource].owned.lessThan(amount)) {
			return false;
		} else if (cost.unit !== undefined && this.unitsLookupTable[cost.unit].owned.lessThan(amount)) {
			return false;
		}
		return true;
	};

	this.tryBuy = function(data, type, quantity) {
		if (this.canAfford(data, type, quantity)) {
			if (data.content.cost !== undefined) {
				for (var i = 0; i < data.content.cost.length; i++) {
					var cost = data.content.cost[i];
					var amount = this.totalCostForObjects(cost, quantity);
					if (cost.resource !== undefined) {
						this.resourcesLookupTable[cost.resource].owned = this.resourcesLookupTable[cost.resource].owned.sub(amount);
					} else if (cost.unit !== undefined) {
						this.unitsLookupTable[cost.unit].owned = this.unitsLookupTable[cost.unit].owned.sub(amount);
					}
				}
			}
			this.offsetOwnedEntity(data.name, quantity);
			return true;
		}
		return false;
	}

	this.maxGeneratable = function(cost, quantity) {
		amount = new BigNumber(cost.amount).abs().times(quantity);
		if (cost.resource !== undefined) {
			return BigNumber.min(quantity, this.resourcesLookupTable[cost.resource].owned.div(amount));
		} else if (cost.unit !== undefined) {
			return BigNumber.min(quantity, this.unitsLookupTable[cost.unit].owned.div(amount));
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
						console.log('i have ' + this.globalLookupTable[entity.name].owned + ' ' + this.localizedName(entity.name))
						var max = this.maxCanGenerate(entity, ticks);
						for (var i = 0; i < entity.content.generates.length; i++) {
							var generated = entity.content.generates[i];
							var amount = new BigNumber(generated.amount).times(max);
							if (generated.resource !== undefined) {
								console.log('can generate ' + amount + ' ' + generated.resource);
								this.offsetOwnedEntity(generated.resource, amount);
							} else if (generated.unit !== undefined) {
								console.log('can generate ' + amount + ' ' + generated.unit);
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
