/**
 * Created by IATGOF on 09/01/2016.
 */

var Formatter = {
    number: function (n) {
        n = Math.floor(n);
        if (isFinite(n)) {
            return this.suffixNotation(n);
        }
        return '∞';
    },

    floor: function (n) {
        return (Math.abs(n) - Math.abs(Math.floor(n)) >= 0.9999999999999991) ? Math.ceil(n) : Math.floor(n);
    },
    
    suffixNotation: function (n) {
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

        var d = undefined;
        var l = (this.floor(Math.log(Math.abs(n)) / Math.log(10)) <= 0) ? 0 : this.floor(Math.log(Math.abs(n)) / Math.log(10));
        if (this.floor(l / 3) < suffixes.length) {
            var p = (l % 3 === 0) ? 2 : (((l - 1) % 3 === 0) ? 1 : 0);
            var r = (Math.abs(n) < 1000) ? ((typeof d === "number") ? n.toFixed(d) : this.floor(n)) : (this.floor(n / (Math.pow(10, this.floor(l / 3) * 3 - p))) / Math.pow(10, p));

            return r + suffixes[this.floor(l / 3)];
        }
        return this.exponentNotation(n);
    },

    exponentNotation: function (n) {
        return n.toExponential(2).replace('+', '');
    }
};
