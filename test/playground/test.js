/**
 * Created by IATGOF on 11/01/2016.
 */
 var Test = {
    createNumber: function (a) {
        return new Decimal(a);
    },

    init: function () {
        var cost = Test.createNumber(10);
        var acc = Test.createNumber(0);

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
                    return Generator.generate(Test.createNumber(owned), cost, Test.createNumber(1)).floor();
                }.bind(this, i, cost))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (owned, cost, acc) {
                    return acc.plus(Generator.generate(Test.createNumber(owned), cost, Test.createNumber(1))).floor();
                }.bind(this, i, cost, acc))()
            })));
            acc = acc.plus(Generator.generate(Test.createNumber(i), cost, Test.createNumber(1)));

            row.append($('<td>').append($('<span>', {
                text: (function (i, cost) {
                    return Generator.generate(Test.createNumber(0), cost, Test.createNumber(i + 1)).floor();
                }.bind(this, i, cost))()
            })));

            $('#table').append(row);
        }


        $('#maxTable').append($('<tr>').append($('<td>').append($('<span>', {
            text: 'Money'
        }))).append($('<td>').append($('<span>', {
            text: 'Max buy (brute)'
        }))).append($('<td>').append($('<span>', {
            text: 'Total cost'
        }))).append($('<td>').append($('<span>', {
            text: 'Max buy (computed)'
        }))).append($('<td>').append($('<span>', {
            text: 'Total cost'
        }))));

        for (var i = 0; i < 10; i++) {
            var row = $('<tr>');
            row.append($('<td>').append($('<span>', {
                text: Test.createNumber(10).pow(i).toString()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    return Generator.maxAffordableBrute(Test.createNumber(0), cost, max);
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    var n = Generator.maxAffordableBrute(Test.createNumber(0), cost, max);
                    return Generator.generate(Test.createNumber(0), cost, n).floor();
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    return Generator.maxAffordable(Test.createNumber(0), cost, max);
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    var n = Generator.maxAffordable(Test.createNumber(0), cost, max);
                    return Generator.generate(Test.createNumber(0), cost, n).floor();
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));

            $('#maxTable').append(row);
        }

        var time = new Date().getTime();
        var calc = 0;
        for (var i = 0; i < 100 ; i++) {
            calc = Generator.maxAffordable(Test.createNumber(0), cost, Test.createNumber(10).pow(1000));
        }
        $('#content').text('calc: ' + calc + ' (' + (new Date().getTime() - time) + ' ms)')
    },

    refresh: function () {

    }
};

var Generator = {
    multiplier: Test.createNumber(1.1),

    generateExponential: function (owned, cost, n) {
        var initial = cost.times(this.multiplier.pow(owned));
        if (n.equals(1)) {
            return initial;
        }
        return initial.times(this.multiplier.pow(n).minus(1).div(this.multiplier.minus(1)));
    },

    generateLinear: function (owned, cost, n) {
        var normalizedCost = cost.times(this.multiplier);
        var initial = owned.plus(1).times(normalizedCost);

        if (n.equals(1)) {
            return initial;
        }
        return initial.times(n).plus(n.minus(1).times(n).div(2).times(cost));
    },

    maxAffordableBruteExponential: function (owned, cost, max) {
        for (var i = Test.createNumber(1); true; i = i.plus(1)) {
            if (max.lessThan(this.generateExponential(owned, cost, i))) {
                return i.minus(1);
            }
        }
    },

    maxAffordableBruteLinear: function (owned, cost, max) {
        for (var i = Test.createNumber(1); true; i = i.plus(1)) {
            if (max.lessThan(this.generateLinear(owned, cost, i))) {
                return i.minus(1);
            }
        }
    },

    maxAffordableExponential: function (owned, cost, max) {
        var initial = cost.times(this.multiplier.pow(owned.floor()));
        return Decimal.log(max.div(initial).times(this.multiplier.minus(1)).plus(1)).div(Decimal.log(this.multiplier)).floor();
    },

    maxAffordableLinear: function (owned, cost, max) {
        var initial = owned.plus(1).times(cost.times(this.multiplier));
        return cost.times(max.times(cost).times(8).plus(initial.times(initial).times(4)).minus(initial.times(cost).times(4)).plus(cost.times(cost)).div(cost.times(cost)).sqrt()).minus(initial.times(2)).plus(cost).div(cost.times(2)).floor();
    }
};

Generator.generate = Generator.generateLinear;
Generator.maxAffordableBrute = Generator.maxAffordableBruteLinear;
Generator.maxAffordable = Generator.maxAffordableLinear;
/*
    money < (initial * n) + ((n - 1) * n / 2 * cost)
    A < Bx + (x - 1)(x / 2 * C)
    0 < Bx + (x - 1)(x / 2 * C) - A
    -Bx < (x - 1)(x / 2 * C) - A
    nvm
 http://www.wolframalpha.com/input/?i=A+%3C+%28B+*+x%29+%2B+%28%28x+-+1%29+*+x+%2F+2+*+C%29%2C+x%3D%3F

assuming initial, mult and money are positive
    money < initial * ((mult^max - 1) / (mult - 1))
    money/initial < (mult^max - 1) / (mult - 1)
    (money/initial)*(mult - 1) < mult^max - 1
    (money/initial)*(mult-1) + 1 < mult^max
    mult^max > (money/initial)*(mult-1) + 1
    max > log((money/initial)*(mult-1) + 1)/log(mult)

 */