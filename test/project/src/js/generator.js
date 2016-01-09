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

var defaultCostGenerator = Generator.create(new BigNumber(1), 'linear');
var defaultGeneratesGenerator = Generator.create(new BigNumber(1), 'fixed');

/*
    x(n) = C * n

    x(a) + x(a+1) + x(a+2) + x(a+3) + x(a+4)
    = C * a + C * (a+1) + C * (a+2) + C * (a+3) + C * (a+4)
    = C * a + C * a + C + C * a + 2C + C * a + 3C + C * a + 4C
    = 5(C * a) + C + 2C + 3C + 4C
    = 5(C * a) + 10C

 x(a) + x(a+1) + x(a+2) + x(a+3) + x(a+4) + x(a+5) + x(a+6) + x(a+7)
 = C * a + C * (a+1) + C * (a+2) + C * (a+3) + C * (a+4) + C * (a+5) + C * (a+6) + C * (a+7)
 = C * a + C * a + C + C * a + 2C + C * a + 3C + C * a + 4C + C * a + 5C + C * a + 6C + C * a + 7C
 = 8(C * a) + C + 2C + 3C + 4C + 5C + 6C + 7C
 = 8(C * a) + 28C

 E(i, a -> b) x(i) = (b - a + 1)*x(a) + (C * E(j, 1 -> (b - a)) j)
 = (b - a + 1)*x(a) + 0.5(b - a)((b - a) + 1)*C

 E(i, 28 -> 35), C:10 = (35-28+1)*(28*10) + 0.5(35-28)(35-28+1)*10
 = 8*(28*10) + 28*10
 = 2520

 28*10 + 29*10 + 30*10 + 31*10 + 32*10 + 33*10 + 34*10 + 35*10 = 2520

 console.log(defaultGenerator.generateLinear(new BigNumber(28), new BigNumber(10), new BigNumber(8)).toString());
 => 2520
*/