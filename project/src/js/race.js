var GameRace = {
    resources: [],
    units: [],
    upgrades: [],

    entitiesLookupTable: {},
	entitiesGeneratedAmountCache: {},

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

    // Access
    getEntity: function (key) {
        return this.entitiesLookupTable[key];
    },

    getGeneratedAmountForEntityIdentifier: function (key) {
        return this.entitiesGeneratedAmountCache[key];
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
                var maxAffordable = n * entity.owned;
                for (var i = 0; i < entity.generates.length; i++) {
                    maxAffordable = Math.max(maxAffordable, entity.generates[i].getMaxGenerable(self, maxAffordable));
                }
                if (maxAffordable > 0) {
                    entity.verifiedGenerate(maxAffordable);
                }
            }
        });
	},

    // Game loop
    tick: function (n) {
		this.generateEntities(n);
	},
	
	prepareForDisplay: function () {
        this.entitiesGeneratedAmountCache = GameRaceInternals.buildEntitiesGeneratedAmountCache(this);
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
                    this.parseGenerates(object.generate),
                    this.parseRequirements(object.require),
                    this.parseAffects(object.affect)));
            }
        }
    },

    parseCost: function (object) {
        return this.parseResourceRequirement(object, function (object, key) {
            return RelationCost.create(key, object.amount, GameRaceInternals.parseGenerator(object));
        });
    },

    parseGenerates: function (object) {
        return this.parseResourceRequirement(object, function (object, key) {
            return RelationGenerates.create(key, object.amount, GameRaceInternals.parseGenerator(object));
        });
    },

    parseRequirements: function (object) {
        // Rewrite to support more than 'own'
        return this.parseResourceRequirement(object, function (object, key) {
            return RelationRequirement.create(object.type, key, object.amount);
        });
    },

    parseAffects: function (object) {
        return this.parseResourceRequirement(object, function (object, key) {
            return RelationAffects.create(key, object.amount, object.subentity, object.type, object.action);
        });
    },

    parseResourceRequirement: function (object, generateOne) {
        if (object) {
            var array = [];
            for (var i = 0; i < object.length; i++) {
                array.push(generateOne(object[i], object[i].entity));
            }
            return array;
        }
        return undefined;
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
    },
    
    buildEntitiesGeneratedAmountCache: function (race) {
        var cache = {};
        this.foreachEntity(race, function (entity) {
            if (entity.canGenerateEntities()) {
                for (var i = 0; i < entity.generates.length; i++) {
                    var generator = entity.generates[i];
                    var base = cache[generator.getEntityIdentifier()] || 0;
                    cache[generator.getEntityIdentifier()] = base + generator.getGeneratedAmountForEntities(entity, entity.owned);
                }
            }
        });
        return cache;
    }
};
