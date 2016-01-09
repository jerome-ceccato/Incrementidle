/**
 * Created by IATGOF on 07/01/2016.
 */

var Generator = {
    generate: undefined,
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
                this.multiplier = this.multiplier || new BigNumber(1.1);
                break;
            case 'fixed':
                this.generate = this.generateFixed;
                this.multiplier = this.multiplier || new BigNumber(1);
                break;
            default:
                this.generate = this.generateLinear;
                this.multiplier = this.multiplier || new BigNumber(1);
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
        // BigNumber.pow() does not support decimal exponents
        var initial = cost.times(this.multiplier.pow(owned.floor()));

        if (n.equals(1)) {
            return initial;
        }
        return initial.times(this.multiplier.pow(n).sub(1).div(this.multiplier.sub(1)));
    },
    
    getMaxAffordable: function (entity, cost, n) {
        if (this.curve != 'fixed') {
            throw new TypeError('getMaxAffordable() is unimplemented for ' + this.curve + ' curve');
        }
        return BigNumber.min(n, entity.owned.div(cost));
    }
};

var defaultCostGenerator = Generator.create(new BigNumber(1.1), 'exponential');
var defaultGeneratesGenerator = Generator.create(new BigNumber(1), 'fixed');
