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
            default:
                this.generate = this.generateLinear;
                this.multiplier = this.multiplier || new BigNumber(1);
        }
        return this;
    },

    getAmount: function (owned, cost) {
        return this.generate(owned, cost);
    },

    generateLinear: function (owned, cost) {
        return owned.times(this.multiplier).times(cost);
    },
    
    generateExponential: function (owned, cost) {
        // BigNumber.pow() does not support decimal exponents
        return cost.times(this.multiplier.pow(owned.floor()));
    }
};

var defaultGenerator = Generator.create();
