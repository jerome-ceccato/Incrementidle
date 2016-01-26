/**
 * Created by IATGOF on 07/01/2016.
 */

var RelationBase = {
    create: function (type, key, amount) {
        return $.extend(Object.create(this), {
            type: type,
            key: key,
            amount: amount || 1
        });
    },

    getEntityIdentifier: function () {
        return this.key;
    }
};

var RelationCost = $.extend(Object.create(RelationBase), {
    create: function (type, key, amount, generator) {
        return $.extend(RelationBase.create.call(this, type, key, amount), {
            generator: generator || defaultCostGenerator
        });
    },

    validate: function (race, entity, n) {
        var resource = race.getEntity(this.getEntityIdentifier());
        return resource.owned >= this.getCostForEntities(entity, n);
    },

    getCostForEntities: function (entity, n) {
        return this.generator.getAmount(entity.owned, this.amount, n);
    },

    getMaxAffordable: function(race, entity) {
        var resource = race.getEntity(this.getEntityIdentifier());
        return this.generator.getMaxAffordable(entity, this.amount, resource.owned);
    }
});

var RelationGenerates = $.extend(Object.create(RelationBase), {
    create: function (type, key, amount, generator) {
        return $.extend(RelationBase.create.call(this, type, key, amount), {
            generator: generator || defaultGeneratesGenerator
        });
    },

    getMaxGenerable: function (race, n) {
        // Only negative generation (fixed cost) can reach a maximum generable
        if (this.amount < 0) {
            var entity = race.getEntity(this.getEntityIdentifier());
            return this.generator.getMaxAffordable(entity, Math.abs(this.amount), n);
        }
        return n;
    },

    getGeneratedAmountForEntities: function (entity, n) {
        return this.generator.getAmount(entity.owned, this.amount, n);
    }
});

// Might be a separate entity depending on the requirements
var RelationRequirement = $.extend(Object.create(RelationBase), {
    create: function (requirement, type, key, amount) {
        return $.extend(RelationBase.create.call(this, type, key, amount), {
            requirement: requirement
        });
    },

    validate: function (race) {
        if (this.requirement == 'ownUnit' || this.requirement == 'ownResource' || this.requirement == 'ownBuilding') {
            return race.getEntity(this.key).owned >= this.amount;
        }
        return false;
    }
});
