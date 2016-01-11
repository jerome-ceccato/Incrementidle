/**
 * Created by IATGOF on 07/01/2016.
 */

var Localization = {
    create: function (content) {
        return $.extend(Object.create(this), {
            content: content
        })
    },

    objectForKey: function (key) {
        return this.content.resources[key] || this.content.units[key] || this.content.upgrades[key];
    },

    displayNameForKey: function (key, plural) {
        var object = this.objectForKey(key);
        if (object.displayNameSingle && plural === false) {
            return object.displayNameSingle;
        }
        return object.displayName;
    }
};