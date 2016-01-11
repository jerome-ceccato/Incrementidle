var engine = {
    game: undefined,

    selectedBuyQuantity: function () {
        return new BigNumber($('#buyAmount').val());
    },

    start: function () {
        this.game = Game.create(GameRace.create('plants', gameContent.plants));
        this.refresh();

        var self = this;
        window.setInterval(function () {
            self.update();
        }, 100);
    },

    update: function () {
        this.game.tick();
        this.refresh();
    },

    refresh: function () {
        this.game.refresh();
    },

    ////////////////////////////////////////////////////////
    /// DEBUG
    ////////////////////////////////////////////////////////

    mainButtonPressed: function () {
        this.game.mainButtonPressed();
        this.refresh();
    },
    mainButton2Pressed: function () {
        this.game.mainButton2Pressed();
        this.refresh();
    }
};

$(document).ready(function () {
    engine.start();
});
