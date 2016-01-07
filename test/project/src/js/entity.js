/**
 * Created by IATGOF on 06/01/2016.
 */

var GameEntity = {
    owned: new BigNumber(0),
    init: function (name, content) {
        return $.extend(this, {
            name: name,
            content: content
        });
    }
};

var GameResource = $.extend(GameEntity, {
    getName: function () {
        return this.name;
    }
});

console.log(GameResource.init("toto").getName());
