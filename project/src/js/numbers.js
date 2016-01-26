/**
 * Created by IATGOF on 12/01/2016.
 */

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