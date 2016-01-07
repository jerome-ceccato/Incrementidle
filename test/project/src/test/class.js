/**
 * Created by IATGOF on 06/01/2016.
 */

var GameEntity = function(content) {
    return {
        content: content,
        name: undefined,
        owned: new BigNumber(0)
    };
};

var GameResource = function(name) {
    var resource = GameEntity();

    resource.name = name;
    return $.extend(resource, {
        getName: function() {
            return this.name;
        }
    });
};

console.log(GameResource('toto').getName());

///////////////////////////////////////////////////

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


