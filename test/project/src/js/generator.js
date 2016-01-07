/**
 * Created by IATGOF on 07/01/2016.
 */

var Generator = {
    create: function (multiplier, curve) {
        return $.extend(Object.create(this), {
            multiplier: multiplier,
            type: curve
        })
    }
};

var defaultGenerator = Generator.create();
