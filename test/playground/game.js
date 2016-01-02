function Game(race) {
	this.race = race;

	this.buildTables = function() {
		var resources = document.getElementById("table_resources");
		resources.innerHTML = "";
		this.buildTableFromData(resources, this.race.resources, 'resources');

		var units = document.getElementById("table_units");
		units.innerHTML = "";
		this.buildTableFromData(units, this.race.units, 'units');

		var upgrades = document.getElementById("table_upgrades");
		upgrades.innerHTML = "";
		this.buildTableFromData(upgrades, this.race.upgrades, 'upgrades');
	};

	this.identifierForNode = function(type, node, nodeType) {
		return this.race.name + '-' + type + '-' + this.race[type][node].key + '-' + nodeType;
	};

	this.buildTableFromData = function(table, data, type) {
		var tableBody = document.createElement('tbody');
		for (var ntr = 0; ntr < 2; ntr++) {
			var tr = document.createElement('tr');
			for (var ntd = 0; ntd < data.length; ntd++) {
				var td = document.createElement('td');
				if (ntr == 0) {
					var button = document.createElement('button');
					var buttonContent = document.createTextNode(this.race.localizedName(type, data[ntd].name));
					button.appendChild(buttonContent);
					button.id = this.identifierForNode(type, ntd, 'button');

					(function(entity, button) {
						button.onclick = function() {
							console.log(button.id);
							console.log(entity);
							entity.user++;
							console.log(entity.user);
							engine.refresh();
						};
					})(data[ntd], button);

					td.appendChild(button);
				} else {
					var text = document.createTextNode(data[ntd].user)
					td.id = this.identifierForNode(type, ntd, 'text');
					td.appendChild(text);
				}
				tr.appendChild(td);
			}
			tableBody.appendChild(tr);
		}
		table.appendChild(tableBody);
	};

	this.refreshTable = function() {
		var refreshSingleTable = function(self, data, type) {
			for (var ntd = 0; ntd < data.length; ntd++) {
				$('#' + self.identifierForNode(type, ntd, 'text')).html(data[ntd].user);
			}
		};

		refreshSingleTable(this, this.race.resources, 'resources');
		refreshSingleTable(this, this.race.units, 'units');
		refreshSingleTable(this, this.race.upgrades, 'upgrades');
	};
};
