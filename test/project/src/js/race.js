var GameRace = {
    resources: [],
    units: [],
    upgrades: [],
    entitiesLookupTable: {},

    create: function (name, content) {
        return $.extend(Object.create(this), {
            name: name,
            content: content,
            locale: Localization.create(content.locale.fr)
        }).init();
    },
    
    init: function () {
        GameRaceInternals.pushContentInArray(this, this.resources, 'resources', GameResource);
        GameRaceInternals.pushContentInArray(this, this.units, 'units', GameUnit);
        GameRaceInternals.pushContentInArray(this, this.upgrades, 'upgrades', GameUpgrade);
        GameRaceInternals.indexEntities(this.entitiesLookupTable, this.resources, this.units, this.upgrades);

        return this;
    },

    getEntity: function (key) {
        return this.entitiesLookupTable[key];
    },

    // Entity unlocking
    unlockedEntities: {},
    isEntityUnlocked: function (entity) {
        return this.unlockedEntities.hasOwnProperty(entity.getIdentifier());
    },
    unlockEntity: function (entity) {
        this.unlockedEntities[entity.getIdentifier()] = true;
    },

    meetsRequirements: function (requirements) {
        for (var i = 0; i < requirements.length; i++) {
            if (!requirements[i].validate(this)) {
                return false;
            }
        }
        return true;
    },

    // Buy
    canAffordEntity: function (entity, n) {
        for (var i = 0; i < entity.cost.length; i++) {
            if (!entity.cost[i].validate(this, entity, n)) {
                return false;
            }
        }
        return true;
    },

	// Generate
	generateEntities: function (n) {
        var self = this;
        GameRaceInternals.foreachEntity(this, function (entity) {
            if (entity.canGenerateEntities()) {
                var maxAffordable = n.times(entity.owned);
                for (var i = 0; i < entity.generates.length; i++) {
                    maxAffordable = BigNumber.max(maxAffordable, entity.generates[i].getMaxGenerable(self, maxAffordable));
                }
                if (maxAffordable.greaterThan(0)) {
                    entity.verifiedGenerate(maxAffordable);
                }
            }
        });
	},

    // Game loop
    tick: function (n) {
        this.generateEntities(n);
    }
};

var GameRaceInternals = {
    foreachEntity: function (race, callback) {
        for (var key in race.entitiesLookupTable) {
            if (race.entitiesLookupTable.hasOwnProperty(key)) {
                callback(race.entitiesLookupTable[key]);
            }
        }
    },

    pushContentInArray: function (race, array, contentKey, baseObject) {
        for (var key in race.content[contentKey]) {
            if (race.content[contentKey].hasOwnProperty(key)) {
                var object = race.content[contentKey][key];
                array.push(baseObject.create(race, key, object.type,
                    this.parseCost(object.cost),
                    this.parseGenerates(object.generates),
                    this.parseRequirements(object.preReq)));
            }
        }
    },

    parseCost: function (object) {
        return this.parseResourceRequirement(object, function (object, type, key) {
            return RelationCost.create(type, key, object.amount, GameRaceInternals.parseGenerator(object));
        });
    },

    parseGenerates: function (object) {
        return this.parseResourceRequirement(object, function (object, type, key) {
            return RelationGenerates.create(type, key, object.amount, GameRaceInternals.parseGenerator(object));
        });
    },

    parseRequirements: function (object) {
        // Rewrite to support more than 'ownUnit'
        return this.parseResourceRequirement(object, function (object, type, key) {
            return RelationRequirement.create(object.type, type, key, object.amount, GameRaceInternals.parseGenerator(object));
        });
    },

    parseResourceRequirement: function (object, generateOne) {
        if (object) {
            var array = [];
            for (var i = 0; i < object.length; i++) {
                var tuple = this.parseTypeAndKey(object[i]),
                    type = tuple[0],
                    key = tuple[1];
                array.push(generateOne(object[i], type, key));
            }
            return array;
        }
        return undefined;
    },

    parseTypeAndKey: function (object) {
        var type = undefined,
            key = undefined;
        if (object.resource) {
            type = 'resource';
            key = object.resource;
        }
        else if (object.unit) {
            type = 'unit';
            key = object.unit;
        }
        else if (object.building) {
            type = 'building';
            key = object.building;
        }
        return [type, key];
    },

    parseGenerator: function (object) {
        if (object.multiplier !== undefined || object.curve !== undefined) {
            return Generator.create(object.multiplier, object.curve);
        }
        return undefined;
    },

    indexEntities: function (table) {
        for (var i = 1; i < arguments.length; i++) {
            for (var j = 0; j < arguments[i].length; j++) {
                var entity = arguments[i][j];
                table[entity.getIdentifier()] = entity;
            }
        }
    }
};
