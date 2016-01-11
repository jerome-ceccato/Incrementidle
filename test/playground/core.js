var engine = {
    start: function () {
        Test.init();
        this.refresh();
        var self = this;

        window.setInterval(function () {
            self.update();
        }, 100);
    },

    update: function () {
        this.refresh();
    },

    refresh: function () {
        Test.refresh();
    }
};

$(document).ready(function() {
	engine.start();
});
