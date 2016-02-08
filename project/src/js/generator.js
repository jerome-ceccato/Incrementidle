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
                this.multiplier = this.multiplier || 1.1;
                break;
            case 'fixed':
                this.generate = this.generateFixed;
                this.maxAffordable = this.maxAffordableFixed;
                this.multiplier = this.multiplier || 1;
                break;
            default:
                this.generate = this.generateLinear;
                this.maxAffordable = this.maxAffordableLinear;
                this.multiplier = this.multiplier || 1;
        }
        this.cleanup();
        return this;
    },

    cleanup: function () {
        this.baseIncrement = 0;
        this.baseMultiplier = 1;
        this.totalMultiplier = 1;
    },

    // TODO : apply total multiplier to linerar and exponential functions

    getAmount: function (owned, cost, n) {
        return this.generate(owned, cost, n);
    },

    generateFixed: function (owned, cost, n) {
        cost = (cost + this.baseIncrement) * this.baseMultiplier;
        return cost * n * this.totalMultiplier;
    },

    generateLinear: function (owned, cost, n) {
        cost = (cost + this.baseIncrement) * this.baseMultiplier;
        var normalizedCost = cost * this.multiplier;
        var initial = (owned + 1) * normalizedCost;

        if (n == 1) {
            return initial;
        }
        return (initial * n) + ((n - 1) * n / 2 * cost);
    },
    
    generateExponential: function (owned, cost, n) {
        cost = (cost + this.baseIncrement) * this.baseMultiplier;
        var initial = cost * Math.pow(this.multiplier, owned);

        if (n == 1) {
            return initial;
        }
        return initial * (Math.pow(this.multiplier, n) - 1) / (this.multiplier - 1);
    },
    
    getMaxAffordable: function (entity, cost, n) {
        return this.maxAffordable(entity, cost, n);
    },

    maxAffordableFixed: function (entity, cost, n) {
        cost = (cost + this.baseIncrement) * this.baseMultiplier;
        return Math.floor(n / cost * this.totalMultiplier);
    },

    maxAffordableLinear: function (entity, cost, n) {
        cost = (cost + this.baseIncrement) * this.baseMultiplier;
        var initial = (entity.owned + 1) * (cost * this.multiplier);
        return Math.floor((cost * Math.sqrt(((n * cost * 8) + (initial * initial * 4) - (initial * cost * 4) + (cost * cost)) / (cost * cost)) - (initial * 2) + cost) / (cost * 2));
    },

    maxAffordableExponential: function (entity, cost, n) {
        cost = (cost + this.baseIncrement) * this.baseMultiplier;
        var initial = cost * Math.pow(this.multiplier, Math.floor(entity.owned));
        return Math.floor(Math.log(n / initial * (this.multiplier - 1) + 1) / Math.log(this.multiplier));
    }
};

var defaultCostGenerator = Generator.create(1.1, 'exponential');
var defaultGeneratesGenerator = Generator.create(1, 'fixed');
