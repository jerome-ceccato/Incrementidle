/**
 * Created by IATGOF on 07/01/2016.
 */

var RelationBase = {
    create: function (type, key, amount, generator) {
        return $.extend(Object.create(this), {
            type: type,
            key: key,
            amount: new BigNumber(amount || 1),
            generator: generator || defaultGenerator
        });
    }
};

var RelationCost = $.extend(Object.create(RelationBase), {
    validate: function (race, entity, n) {
        var resource = race.getEntity(this.getEntityIdentifier());
        return resource.owned.greaterThanOrEqualTo(this.getCostForEntities(entity, n));
    },

    getEntityIdentifier: function () {
        return this.key;
    },

    getCostForEntities: function (entity, n) {
        return this.generator.getAmount(entity.owned, this.amount, n);
    }
});

var RelationGenerates = $.extend(Object.create(RelationBase), {

});

// Might be a separate entity depending on the requirements
var RelationRequirement = $.extend(Object.create(RelationBase), {
    create: function (requirement, type, key, amount, generator) {
        return $.extend(RelationBase.create.call(this, type, key, amount, generator), {
            requirement: requirement
        });
    },

    validate: function (race) {
        if (this.requirement == 'ownUnit' || this.requirement == 'ownResource' || this.requirement == 'ownBuilding') {
            return race.getEntity(this.key).owned.greaterThanOrEqualTo(this.amount);
        }
        return false;
    }
});
