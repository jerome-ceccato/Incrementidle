var gameContent = gameContent || {}
gameContent.plants = {
	"resources": {
		"seed": {},
		"nutriment": {},
		"water": {},
		"discovery": {}
	},
	"units": {
		"plant": {
			"type": "unit",
			"cost": [{
				"resource": "seed",
				"amount": 1,
			}],

			"generates": [{
				"resource": "seed",
				"amount": 0.1
			}],
		},

		"root": {
			"type": "unit",
			"cost": [{
				"resource": "seed",
				"amount": 1
			}],

			"generates": [{
				"resource": "nutriment",
				"amount": 1
			}],

			"preReq": [{
				"type": "ownUnit",
				"unit": "plant",
				"amount": 1
			}]
		},

		"fern": {
			"type": "unit",
			"cost": [{
				"resource": "seed",
				"amount": 1
			}, {
				"resource": "nutriment",
				"amount": 20
			}],

			"generates": [{
				"resource": "water",
				"amount": 1
			}],

			"preReq": [{
				"type": "ownUnit",
				"unit": "root",
				"amount": 2
			}]
		},

		"plantation": {
			"type": "building",
			"cost": [{
				"unit": "plant",
				"amount": 10,
				"multiplier": 1.3
			}, {
				"resource": "nutriment",
				"amount": 100,
				"multiplier": 1.3
			}, {
				"resource": "water",
				"amount": 100,
				"multiplier": 1.3
			}],

			"generates": [{
				"unit": "plant",
				"amount": 1
			}, {
				"resource": "seed",
				"amount": -1
			}],

			"preReq": [{
				"type": "ownUnit",
				"unit": "root",
				"amount": 10
			}, {
				"type": "ownUnit",
				"unit": "fern",
				"amount": 10
			}, {
				"type": "ownUnit",
				"unit": "plant",
				"amount": 50
			}]
		},

		"tree": {
			"type": "building",
			"cost": [{
				"resource": "seed",
				"amount": 1
			}, {
				"resource": "nutriment",
				"amount": 500,
				"multiplier": 1.2
			}, {
				"resource": "water",
				"amount": 100,
				"multiplier": 1.2
			}],

			"generates": [{
				"unit": "root",
				"amount": 1
			}, {
				"resource": "seed",
				"amount": -1
			}],

			"preReq": [{
				"type": "ownUnit",
				"unit": "root",
				"amount": 50
			}, {
				"type": "ownUnit",
				"unit": "fern",
				"amount": 10
			}, {
				"type": "ownUnit",
				"unit": "plant",
				"amount": 10
			}]
		},

		"swamp": {
			"type": "building",
			"cost": [{
				"resource": "seed",
				"amount": 1
			}, {
				"resource": "nutriment",
				"amount": 100,
				"multiplier": 1.2
			}, {
				"resource": "water",
				"amount": 500,
				"multiplier": 1.2
			}],

			"generates": [{
				"unit": "fern",
				"amount": 1
			}, {
				"resource": "seed",
				"amount": -1
			}],

			"preReq": [{
				"type": "ownUnit",
				"unit": "root",
				"amount": 10
			}, {
				"type": "ownUnit",
				"unit": "fern",
				"amount": 50
			}, {
				"type": "ownUnit",
				"unit": "plant",
				"amount": 10
			}]
		},

		"ivy": {
			"type": "unit",
			"cost": [{
				"resource": "seed",
				"amount": 100
			}],

			"generates": [{
				"resource": "discovery",
				"amount": 1
			}],

			"preReq": [{
				"type": "ownUnit",
				"unit": "tree",
				"amount": 1
			}, {
				"type": "ownUnit",
				"unit": "swamp",
				"amount": 1
			}, {
				"type": "ownUnit",
				"unit": "plantation",
				"amount": 1
			}]
		},
	},
	"upgrades": {
		"scienceInstitute": {
			"type": "once",
			"cost": [{
				"resource": "discovery",
				"amount": 1000
			}, {
				"unit": "tree",
				"amount": 1
			}],
			"preReq": [{
				"type": "ownUnit",
				"unit": "ivy",
				"amount": 1
			}]
		}
	},
	"locale": {
		"fr": {
			"resources": {
				"seed": {
					"displayName": "Graines",
					"displayNameSingle": "Graine",
					"description": "Toutes les plantes naissent de graines."
				},

				"nutriment": {
					"displayName": "Nutriments",
					"displayNameSingle": "Nutriment",
					"description": "Un ??l??ment n??cessaire ?? la survie de toutes les plantes."
				},

				"water": {
					"displayName": "Eau",
					"displayNameSingle": "Eau",
					"description": "Les plantes sont compos??es en grande partie d'eau."
				},

				"discovery": {
					"displayName": "Points de d??couverte",
					"displayNameSingle": "Point de d??couverte",
					"description": "Il semble que certaines de vos plantes souhaitent d??couvrir le monde qui les entoure !"
				}
			},

			"units": {
				"plant": {
					"displayName": "Plantes",
					"displayNameSingle": "Plante",
					"description": "Une plante de base."
				},

				"root": {
					"displayName": "Racines",
					"displayNameSingle": "Racine",
					"description": "Les racines sont capables d'extraire les nutriments du sol."
				},

				"fern": {
					"displayName": "Foug??res",
					"displayNameSingle": "Foug??re",
					"description": "Les foug??res produisent de l'eau. Ne me demandez pas comment."
				},

				"plantation": {
					"displayName": "Plantations",
					"displayNameSingle": "Plantation",
					"description": "Un champ de plante. Qui g??n??re des plantes. Enfin, qui transforme des graines en plantes."
				},

				"tree": {
					"displayName": "Arbres",
					"displayNameSingle": "Arbre",
					"description": "L'abre produit des racines qui ramassent des nutriments."
				},

				"swamp": {
					"displayName": "Mar??cages",
					"displayNameSingle": "Mar??cage",
					"description": "La foug??re g??n??re de l'eau et les mar??cages g??n??rent des foug??res. C'est pourtant logique, non ?"
				},

				"ivy": {
					"displayName": "Lierres",
					"displayNameSingle": "Lierre",
					"description": "En combinant des graines, on peut cr??er du Lierre : une plante grimpante qui aime se faufiler partout afin de d??courir le monde. Le lierre est une sorte de plante exploratrice si on veut."
				}
			},

			"upgrades": {
				"scienceInstitute": {
					"displayName": "Institution scientifique des plantes et v??g??taux unis",
					"description": "Il semblerait que les plantes aient form?? une sorte d'institution scientifique."
				}
			}
		}
	} 
};
