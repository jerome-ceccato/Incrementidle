/**
 * Created by IATGOF on 12/01/2016.
 */

Decimal.prototype.add = Decimal.prototype.plus;
Decimal.prototype.sub = Decimal.prototype.minus;

function GameNumber(n) {
    return new Decimal(n);
}

function GameNumberMin(a, b) {
    return Decimal.min(a, b);
}

function GameNumberMax(a, b) {
    return Decimal.max(a, b);
}

function GameNumberLn(a) {
    return Decimal.log(a)
}

/////////////////

var BuyAmount = {
    create: function (n) {
        return $.extend(Object.create(this), {
            n: n,
            unlimited: false
        })
    },

    max: function () {
        return $.extend(Object.create(this), {
            unlimited: true
        })
    }
};