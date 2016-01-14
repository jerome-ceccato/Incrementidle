/**
 * Created by IATGOF on 07/01/2016.
 */

var Generator = {
    generate: undefined,
    maxAffordable: undefined,
    create: function (multiplier, curve) {
        return $.extend(Object.create(this), {
            multiplier: multiplier,
            curve: curve
        }).init();
    },

    init: function () {
        switch (this.curve) {
            case 'exponential':
                this.generate = this.generateExponential;
                this.maxAffordable = this.maxAffordableExponential;
                this.multiplier = this.multiplier || GameNumber(1.1);
                break;
            case 'fixed':
                this.generate = this.generateFixed;
                this.maxAffordable = this.maxAffordableFixed;
                this.multiplier = this.multiplier || GameNumber(1);
                break;
            default:
                this.generate = this.generateLinear;
                this.maxAffordable = this.maxAffordableLinear;
                this.multiplier = this.multiplier || GameNumber(1);
        }
        return this;
    },

    getAmount: function (owned, cost, n) {
        return this.generate(owned, cost, n);
    },

    generateFixed: function (owned, cost, n) {
        return cost.times(n);
    },

    generateLinear: function (owned, cost, n) {
        var normalizedCost = cost.times(this.multiplier);
        var initial = owned.add(1).times(normalizedCost);

        if (n.equals(1)) {
            return initial;
        }
        return initial.times(n).add(n.sub(1).times(n).div(2).times(cost));
    },
    
    generateExponential: function (owned, cost, n) {
        var initial = cost.times(this.multiplier.pow(owned));

        if (n.equals(1)) {
            return initial;
        }
        return initial.times(this.multiplier.pow(n).sub(1).div(this.multiplier.sub(1)));
    },
    
    getMaxAffordable: function (entity, cost, n) {
        return this.maxAffordable(entity, cost, n);
    },

    maxAffordableFixed: function (entity, cost, n) {
        return GameNumberMin(n, entity.owned.div(cost));
    },

    maxAffordableLinear: function (entity, cost, n) {
        var initial = entity.owned.plus(1).times(cost.times(this.multiplier));
        return cost.times(n.times(cost).times(8).plus(initial.times(initial).times(4)).minus(initial.times(cost).times(4)).plus(cost.times(cost)).div(cost.times(cost)).sqrt()).minus(initial.times(2)).plus(cost).div(cost.times(2)).floor();
    },

    maxAffordableExponential: function (entity, cost, n) {
        var initial = cost.times(this.multiplier.pow(entity.owned.floor()));
        return GameNumberLn(GameNumber(n.div(initial).times(this.multiplier.sub(1)).add(1))).div(GameNumberLn(GameNumber(this.multiplier))).floor();
    }
};

var defaultCostGenerator = Generator.create(GameNumber(1.1), 'exponential');
var defaultGeneratesGenerator = Generator.create(GameNumber(1), 'fixed');
