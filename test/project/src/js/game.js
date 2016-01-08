function Game(race) {
	this.race = race;

	this.buildTables = function() {
		var array = ['resources', 'units', 'upgrades'];
        for (var i = 0; i < array.length; i++) {
            var doc = document.getElementById('table_' + array[i]);
            doc.innerHTML = '';
            this.buildTableFromData(doc, this.race[array[i]], array[i]);
        }
	};

	this.buildTableFromData = function(table, data, type) {
		var tableBody = document.createElement('tbody');
		for (var ntr = 0; ntr < 3; ntr++) {
			var tr = document.createElement('tr');
			for (var ntd = 0; ntd < data.length; ntd++) {
				var td = document.createElement('td');
                var entity = data[ntd];
				if (ntr == 0) {
					var button = document.createElement('button');
					var buttonContent = document.createTextNode('?');
					button.appendChild(buttonContent);
					button.id = this.identifierForNode(entity, 'button');

					(function(entity, button) {
						button.onclick = function() {
							console.log(button.id);
							if (entity.tryBuy(engine.selectedBuyQuantity())) {
                                engine.refresh();
                            }
						};
					})(entity, button);

					td.appendChild(button);
				}
                else if (ntr == 1) {
                    var text = document.createTextNode('?');
                    td.id = this.identifierForNode(entity, 'text');
                    td.appendChild(text);
                }
                else {
					var cost = document.createTextNode('?');
					td.id = this.identifierForNode(entity, 'cost');
					td.appendChild(cost);
				}
				tr.appendChild(td);
			}
			tableBody.appendChild(tr);
		}
		table.appendChild(tableBody);
	};

    this.identifierForNode = function(entity, nodeType) {
        return entity.getIdentifier() + '-' + nodeType;
    };

	this.refreshTable = function() {
		var refreshSingleTable = function(self, data) {
			for (var ntd = 0; ntd < data.length; ntd++) {
                var entity = data[ntd];

				var value = $('#' + self.identifierForNode(entity, 'text')),
                    button = $('#' + self.identifierForNode(entity, 'button')),
                    cost = $('#' + self.identifierForNode(entity, 'cost'));

				value.html(entity.ownedDisplayString());
                cost.text(entity.displayCost());

                var shouldReveal = entity.isVisible();
                button.prop('disabled', !shouldReveal || !entity.canAfford(engine.selectedBuyQuantity()));
                button.text(shouldReveal ? entity.displayString() : '  ?  ');
			}
		};

		refreshSingleTable(this, this.race.resources);
		refreshSingleTable(this, this.race.units);
		refreshSingleTable(this, this.race.upgrades);
	};

	this.tick = function() {
		//this.race.tick(1);
	};

	this.mainButtonPressed = function() {
		this.race.resources[0].owned = this.race.resources[0].owned.add(1);
	};
};
