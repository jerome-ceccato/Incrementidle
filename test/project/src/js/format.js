/**
 * Created by IATGOF on 09/01/2016.
 */

var Formatter = {
    number: function (n) {
        return this.suffixNotation(n.floor());
    },
    
    suffixNotation: function (n) {
        var nString = n.toFixed();
        if (nString.length < 4) {
            return nString;
        }

        // Taken from https://github.com/swarmsim/swarm/blob/master/app/scripts/filters/bignum.coffee
        var suffixes = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc', 'No',
        'Dc', 'UDc', 'DDc', 'TDc', 'QaDc', 'QiDc', 'SxDc', 'SpDc', 'ODc', 'NDc',
        'Vi', 'UVi', 'DVi', 'TVi', 'QaVi', 'QiVi', 'SxVi', 'SpVi', 'OVi', 'NVi',
        'Tg', 'UTg', 'DTg', 'TTg', 'QaTg', 'QiTg', 'SxTg', 'SpTg', 'OTg', 'NTg',
        'Qd', 'UQd', 'DQd', 'TQd', 'QaQd', 'QiQd', 'SxQd', 'SpQd', 'OQd', 'NQd',
        'Qq', 'UQq', 'DQq', 'TQq', 'QaQq', 'QiQq', 'SxQq', 'SpQq', 'OQq', 'NQq',
        'Sg', 'USg', 'DSg', 'TSg', 'QaSg', 'QiSg', 'SxSg', 'SpSg', 'OSg', 'NSg',
        'St', 'USt', 'DSt', 'TSt', 'QaSt', 'QiSt', 'SxSt', 'SpSt', 'OSt', 'NSt',
        'Og', 'UOg', 'DOg', 'TOg', 'QaOg', 'QiOg', 'SxOg', 'SpOg', 'OOg', 'NOg'];

        var significantDigits = 3;
        var power = Math.floor((nString.length - 1) / 3);
        var integerPart = nString.length - (power * 3);
        if (power < suffixes.length) {
            var result = nString.substr(0, integerPart);
            if (integerPart < significantDigits) {
                result += '.' + nString.substr(integerPart, significantDigits - integerPart)
            }
            return result + suffixes[power];
        }
        return this.exponentNotation(n);
    },

    exponentNotation: function (n) {
        return n.toExponential(2).replace('+', '');
    }
};
