/**
 * Created by IATGOF on 11/01/2016.
 */
 var Test = {
    createNumber: function (a) {
        return new BigNumber(a);
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
                    return Generator.generateExponential(Test.createNumber(owned), cost, Test.createNumber(1)).floor();
                }.bind(this, i, cost))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (owned, cost, acc) {
                    return acc.plus(Generator.generateExponential(Test.createNumber(owned), cost, Test.createNumber(1))).floor();
                }.bind(this, i, cost, acc))()
            })));
            acc = acc.plus(Generator.generateExponential(Test.createNumber(i), cost, Test.createNumber(1)));

            row.append($('<td>').append($('<span>', {
                text: (function (i, cost) {
                    return Generator.generateExponential(Test.createNumber(0), cost, Test.createNumber(i + 1)).floor();
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

            /*
            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    var n = Generator.maxAffordableBrute(Test.createNumber(0), cost, max);
                    return Generator.generateExponential(Test.createNumber(0), cost, n).floor();
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));
            */

            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    return Generator.maxAffordable(Test.createNumber(0), cost, max);
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));

            row.append($('<td>').append($('<span>', {
                text: (function (max) {
                    var n = Generator.maxAffordable(Test.createNumber(0), cost, max);
                    return Generator.generateExponential(Test.createNumber(0), cost, n).floor();
                }.bind(this, Test.createNumber(10).pow(i)))()
            })));

            $('#maxTable').append(row);
        }

        var time = new Date().getTime();
        var calc = 0;
        for (var i = 0; i < 100 ; i++) {
            calc = Generator.maxAffordable(Test.createNumber(0), cost, Test.createNumber(10).pow(20));
        }
        $('#content').text('calc: ' + calc + ' (' + (new Date().getTime() - time) + ' ms)')
    },

    refresh: function () {
        //100.	125278	1377961	1377961
        //100.	125278	1377961	1377961
        //1000.	2.2453935618234784856e+44	2.4699329180058263342e+45	2.4699329180058263341e+45
        //1000.	2.24539356182347848556735307735020134337248489e+44	2.469932918005826334124088385085221477709723385e+45	2.469932918005826334124088385085221477709723385e+45
    }
};

var Generator = {
    multiplier: Test.createNumber(1.1),

    generateExponential: function (owned, cost, n) {
        // BigNumber.pow() does not support decimal exponents
        var initial = cost.times(this.multiplier.pow(owned.floor()));
        if (n.equals(1)) {
            return initial;
        }
        return initial.times(this.multiplier.pow(n).minus(1).div(this.multiplier.minus(1)));
    },

    maxAffordableBrute: function (owned, cost, max) {
        for (var i = Test.createNumber(1); true; i = i.plus(1)) {
            if (max.lessThan(this.generateExponential(owned, cost, i))) {
                return i.minus(1);
            }
        }
    },

    maxAffordable: function (owned, cost, max) {
        var initial = cost.times(this.multiplier.pow(owned.floor()));
        return Decimal.log(new Decimal(max.div(initial).times(this.multiplier.minus(1)).plus(1))).div(Decimal.log(new Decimal(this.multiplier))).floor();
    }
};

/*
assuming initial, mult and money are positive
    money < initial * ((mult^max - 1) / (mult - 1))
    money/initial < (mult^max - 1) / (mult - 1)
    (money/initial)*(mult - 1) < mult^max - 1
    (money/initial)*(mult-1) + 1 < mult^max
    mult^max > (money/initial)*(mult-1) + 1
    max > log((money/initial)*(mult-1) + 1)/log(mult)

 */