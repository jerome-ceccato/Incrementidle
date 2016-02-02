/**
 * Created by IATGOF on 06/01/2016.
 */

var GameEntity = {
    owned: 0,
    create: function (race, name, type, cost, generates, requirements, affects) {
        return $.extend(Object.create(this), {
            race: race,
            name: name,
            type: type,
            cost: cost,
            generates: generates,
            requirements: requirements,
            affects: affects
        });
    },

    getIdentifier: function () {
        return this.name;
    },

    ownedDisplayString: function () {
        return Formatter.number(this.owned);
    },

    displayString: function () {
        return this.race.locale.displayNameForKey(this.name, this.owned > 1);
    },

    hasCost: function () {
        return this.cost && this.cost.length > 0;
    },

    isVisible: function () {
        if (this.race.isEntityUnlocked(this)) {
            return true;
        }
        else if (this.owned > 0
            || (this.requirements && this.race.meetsRequirements(this.requirements))) {
            this.race.unlockEntity(this);
            return true;
        }
        return false;
    },

    canAfford: function (amount) {
        if (!this.hasCost()) {
            return false;
        }
        if (amount === undefined || amount.unlimited) {
            return this.race.canAffordEntity(this, 1);
        }
        return this.race.canAffordEntity(this, amount.n);
    },
    
    tryBuy: function (amount) {
        if (!this.hasCost()) {
            return false;
        }
        if (amount) {
            if (this.canAfford(amount)) {
                this.verifiedBuy(amount);
                return true;
            }
            return false;
        }
        return false;
    },

    maxAffordableAmount: function(amount) {
        if (amount.unlimited) {
            var total = undefined;
            if (!this.hasCost()) {
                return 0;
            }
            for (var i = 0; i < this.cost.length; i++) {
                var cost = this.cost[i];
                var localMax = cost.getMaxAffordable(this.race, this);
                total = (total === undefined) ? localMax : Math.min(total, localMax);
            }
            return Math.floor(total);
        }
        return Math.floor(amount.n);
    },

    verifiedBuy: function (amount) {
        var n = this.maxAffordableAmount(amount);
        for (var i = 0; i < this.cost.length; i++) {
            var cost = this.cost[i];
            var entity = this.race.getEntity(cost.getEntityIdentifier());
            entity.owned -= cost.getCostForEntities(this, n);
        }
        this.owned += n;
    },

    canGenerateEntities: function () {
        return this.generates !== undefined && this.generates.length > 0 && this.owned > 0;
    },
    
    verifiedGenerate: function (n) {
        for (var i = 0; i < this.generates.length; i++) {
            var generated = this.generates[i];
            var entity = this.race.getEntity(generated.getEntityIdentifier());
            entity.owned += generated.getGeneratedAmountForEntities(this, n);
        }
    },

    amountGeneratedPerTick: function () {
        return this.race.getGeneratedAmountForEntityIdentifier(this.getIdentifier());
    },

    isUpgrade: function () {
        return false
    },

    ////////////////////////////////////////////////////////
    /// DEBUG
    ////////////////////////////////////////////////////////

    displayCost: function (amount) {
        if (this.hasCost()) {
            var n = Math.max(1, this.maxAffordableAmount(amount));
            var content = '';
            for (var i = 0; i < this.cost.length; i++) {
                if (content.length > 0) {
                    content += ', ';
                }
                var totalCost = this.cost[i].getCostForEntities(this, n);
                content += '' + Formatter.number(totalCost) + ' ' + this.race.locale.displayNameForKey(this.cost[i].getEntityIdentifier(), totalCost > 1);
            }
            return content;
        }
        return '-';
    },

    displayGenerated: function () {
        var generated = this.amountGeneratedPerTick();
        if (generated === undefined || generated == 0) {
            return '';
        }
        var generatedString = Formatter.number(Math.abs(generated));
        return '(' + (generated < 0 ? '-' : '+') + generatedString + '/sec)';
    }
};

var GameResource = $.extend(Object.create(GameEntity), {
});

var GameUnit = $.extend(Object.create(GameEntity), {
});

var GameUpgrade = $.extend(Object.create(GameEntity), {
    unlocked: false,

    ownedDisplayString: function () {
        return this.unlocked ? 'Unlocked' : '-';
    },

    canAfford: function () {
        return this.unlocked ? false : GameEntity.canAfford.call(this, BuyAmount.create(1));
    },

    tryBuy: function () {
        return this.unlocked ? false : GameEntity.tryBuy.call(this, BuyAmount.create(1))
    },

    verifiedBuy: function () {
        GameEntity.verifiedBuy.call(this, BuyAmount.create(1));
        this.unlocked = true;
    },

    isUpgrade: function () {
        return true
    },

    ////////////////////////////////////////////////////////
    /// DEBUG
    ////////////////////////////////////////////////////////

    displayCost: function () {
        return this.unlocked ? '-' : GameEntity.displayCost.call(this, BuyAmount.create(1));
    }
});

