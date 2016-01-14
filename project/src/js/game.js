var Game = {
    lastUpdate: undefined,

    create: function (race) {
        return $.extend(Object.create(this), {
            race: race
        }).init();
    },

    init: function () {
        GameInternals.buildTables(this.race);
        this.lastUpdate = new Date().getTime();
        return this;
    },

    tick: function () {
        var elapsedTime = (new Date().getTime() - this.lastUpdate) / 1000.0;
        this.race.tick(GameNumber(elapsedTime));
        this.lastUpdate = new Date().getTime();
    },

    refresh: function () {
        this.race.prepareForDisplay();
        GameInternals.refreshTables(this.race);
    },

    ////////////////////////////////////////////////////////
    /// DEBUG
    ////////////////////////////////////////////////////////

    mainButtonPressed: function () {
        var entity = this.race.getEntity('seed');
        entity.owned = entity.owned.add(1);
    },

    mainButton2Pressed: function () {
        var entity = this.race.getEntity($('#selectMore').val());
        entity.owned = entity.owned.times(10);
    }
};

var GameInternals = {
    unavailableText: '?',

    buildTables: function (race) {
        var array = ['resources', 'units', 'upgrades'];
        for (var i = 0; i < array.length; i++) {
            var doc = $('#table_' + array[i]);
            doc.html('');
            this.buildTableFromData(doc, race[array[i]], i == 0);
        }
    },

    buildTableFromData: function (table, data, isResource) {
        var body = $('<tbody>');
        var row = $('<tr>');

        // Row 1: name and buy button
        $.each(data, function (i) {
            var column = $('<td>');

            var nameText = $('<span>',  {
                text: this.unavailableText,
                id: this.identifierForNode(data[i], 'nameText')
            });
            column.append(nameText);

            if (!isResource) {
                var button = $('<button>', {
                    text: 'Buy',
                    id: this.identifierForNode(data[i], 'buyButton')
                });

                button.click(function (entity) {
                    if (entity.tryBuy(engine.selectedBuyQuantity())) {
                        engine.refresh();
                    }
                }.bind(this, data[i]));
                column.append(button);
            }
            body.append(row.append(column));
        }.bind(this));

        // Row 2: Owned and generated amounts
        row = $('<tr>');
        $.each(data, function (i) {
            var amountText = $('<span>',  {
                text: this.unavailableText,
                id: this.identifierForNode(data[i], 'amountText')
            });

            var generatedText = $('<span>',  {
                text: '',
                id: this.identifierForNode(data[i], 'generatedText')
            });

            var column = $('<td>').append(amountText).append(generatedText);
            body.append(row.append(column));
        }.bind(this));

        // Row 3: Cost
        if (!isResource) {
            row = $('<tr>');
            $.each(data, function (i) {
                var costText = $('<span>', {
                    text: this.unavailableText,
                    id: this.identifierForNode(data[i], 'costText')
                });

                var column = $('<td>').append(costText);
                body.append(row.append(column));
            }.bind(this));
        }

        table.append(body);
    },

    identifierForNode: function (entity, nodeType) {
        return entity.getIdentifier() + '-' + nodeType;
    },

    refreshTables: function (race) {
        this.refreshSingleTable(race.resources);
        this.refreshSingleTable(race.units);
        this.refreshSingleTable(race.upgrades);
    },

    refreshSingleTable: function (entities) {
        for (var i = 0; i < entities.length; i++) {
            var entity = entities[i];
            var nameText = $('#' + this.identifierForNode(entity, 'nameText')),
                buyButton = $('#' + this.identifierForNode(entity, 'buyButton')),
                amountText = $('#' + this.identifierForNode(entity, 'amountText')),
                generatedText = $('#' + this.identifierForNode(entity, 'generatedText')),
                costText = $('#' + this.identifierForNode(entity, 'costText'));

            var shouldReveal = entity.isVisible();
            nameText.text(shouldReveal ? entity.displayString() : this.unavailableText);
            buyButton.prop('disabled', !shouldReveal || !entity.canAfford(engine.selectedBuyQuantity()));
            costText.text(shouldReveal ? 'Cost: ' + entity.displayCost(engine.selectedBuyQuantity()) : null);
            amountText.text(shouldReveal ? entity.ownedDisplayString() : this.unavailableText);
            generatedText.text(shouldReveal ? entity.displayGenerated() : '');

            if (!shouldReveal || entity.isUpgrade()) {
                buyButton.text('Buy');
            }
            else {
                buyButton.text('Buy ' + Formatter.number(GameNumberMax(GameNumber(1), entity.maxAffordableAmount(engine.selectedBuyQuantity()))));
            }
        }
    }
};
