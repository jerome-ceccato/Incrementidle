/**
 * Created by IATGOF on 11/01/2016.
 */
 var Test = {
    init: function () {
        var cost = new BigNumber(10);
        var acc = new BigNumber(0);

        $('#table').append($('<tr>').append($('<td>').append($('<span>', {
            text: 'i'
        }))).append($('<td>').append($('<span>', {
            text: 'Cost'
        }))).append($('<td>').append($('<span>', {
            text: 'Accumulated cost'
        }))).append($('<td>').append($('<span>', {
            text: 'Computed accumulated cost'
        }))));

        for (var i = 0; i < 100; i++) {
            var row = $('<tr>');

            row.append($('<td>').append($('<span>', {
                text: (function (i) {
                    return '' + i + '.'
                }.bind(this, i+1))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (owned, cost) {
                    return Generator.generateExponential(new BigNumber(owned), cost, new BigNumber(1)).floor();
                }.bind(this, i, cost))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (owned, cost, acc) {
                    return acc.add(Generator.generateExponential(new BigNumber(owned), cost, new BigNumber(1))).floor();
                }.bind(this, i, cost, acc))()
            })));
            acc = acc.add(Generator.generateExponential(new BigNumber(i), cost, new BigNumber(1)));

            row.append($('<td>').append($('<span>', {
                text: (function (i, cost) {
                    return Generator.generateExponential(new BigNumber(0), cost, new BigNumber(i + 1)).floor();
                }.bind(this, i, cost))()
            })));

            $('#table').append(row);
        }
    },

    refresh: function () {
    }
};

var Generator = {
    multiplier: new BigNumber(1.1),

    generateExponential: function (owned, cost, n) {
        // BigNumber.pow() does not support decimal exponents
        var initial = cost.times(this.multiplier.pow(owned.floor()));
        if (n.equals(1)) {
            return initial;
        }
        return initial.times(this.multiplier.pow(n).sub(1).div(this.multiplier.sub(1)));
    }

};
/*
if cost.factor.equals 1
cost.val = cost.val.times num
else
# see maxCostMet for O(1) summation formula derivation.
# cost.val *= (1 - Math.pow cost.factor, num) / (1 - cost.factor)
cost.val = cost.val.times Decimal.ONE.minus(Decimal.pow cost.factor, num).dividedBy(Decimal.ONE.minus cost.factor)
    */