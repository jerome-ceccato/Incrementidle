/**
 * Created by IATGOF on 06/01/2016.
 */

var GameEntity = {
    owned: new BigNumber(0),
    create: function (race, name, type, cost, generates, requirements) {
        return $.extend(Object.create(this), {
            race: race,
            name: name,
            type: type,
            cost: cost,
            generates: generates,
            requirements: requirements
        });
    },

    getIdentifier: function () {
        return this.name;
    },

    ownedDisplayString: function () {
        return this.owned.toString();
    },

    displayString: function () {
        return this.race.locale.displayNameForKey(this.name, this.owned.greaterThan(1));
    },

    displayCost: function () {
        if (this.cost && this.cost.length > 0) {
            return 'has cost';
        }
        return '';
    },

    isVisible: function () {
        if (this.race.isEntityUnlocked(this)) {
            return true;
        }
        else if (this.owned.greaterThan(0)
            || (this.requirements && this.race.meetsRequirements(this.requirements))) {
            this.race.unlockEntity(this);
            return true;
        }
        return false;
    }
};

var GameResource = $.extend(Object.create(GameEntity), {
});

var GameUnit = $.extend(Object.create(GameEntity), {
});

var GameUpgrade = $.extend(Object.create(GameEntity), {
});

