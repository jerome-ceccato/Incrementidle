var engine = {
    game: undefined,

    selectedBuyQuantity: function () {
        return new BigNumber(1);
    },

    start: function () {
        this.game = new Game(GameRace.create('plants', gameContent.plants));
        this.game.buildTables();
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
        this.game.refreshTable();
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
