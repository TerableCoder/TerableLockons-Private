const DefaultSettings = {
		"Skills":{
			"4":{
				"className": "Sorcerer",
				"20":{
					"name": "Flaming Barrage",
					"type": "damage",
					"targets": [
						"boss",
						"npc",
						"enemy"
					],
					"distance": 35,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"22":{
					"name": "Burning Breath",
					"type": "damage",
					"targets": [
						"enemyDps",
						"enemy",
						"boss",
						"npc"
					],
					"distance": 35,
					"maxTargetCount": 1,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"23":{
					"name": "Mana Volley",
					"type": "debuff",
					"targets": [
						"enemyHealer",
						"enemy",
						"boss",
						"npc"
					],
					"distance": 30,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"21":{
					"name": "Nerve Exhaustion",
					"type": "debuff",
					"targets": [
						"enemyHealer",
						"enemy",
						"boss",
						"npc"
					],
					"distance": 30,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"25":{
					"name": "Time Gyre",
					"type": "debuff",
					"targets": [
						"enemyHealer",
						"enemy",
						"boss",
						"npc"
					],
					"distance": 30,
					"maxTargetCount": 2,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				}
			},
			
			"5":{
				"className": "Archer",
				"2":{
					"name": "Arrow Volley",
					"type": "damage",
					"targets": [
						"boss",
						"npc",
						"enemy"
					],
					"distance": 35,
					"maxTargetCount": 5,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				}
			},
			
			"6":{
				"className": "Priest",
				"19":{
					"name": "Focus Heal",
					"type": "heal",
					"targets": [
						"heal"
					],
					"distance": 35,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"37":{
					"name": "Healing Immersion",
					"type": "heal",
					"targets": [
						"heal"
					],
					"distance": 32,
					"maxTargetCount": 1,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"30":{
					"name": "Plague of Exhaustion",
					"type": "damage",
					"targets": [
						"enemyBuff",
						"enemy",
						"boss",
						"npc"
					],
					"distance": 30,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"33":{
					"name": "Ishara's Lullaby",
					"type": "debuff",
					"targets": [
						"enemyHealer",
						"enemy",
						"npc",
						"boss"
					],
					"distance": 30,
					"maxTargetCount": 1,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"35":{
					"name": "Energy Stars",
					"type": "damage",
					"targets": [
						"enemyBuff",
						"boss",
						"npc",
						"enemyDps",
						"enemy"
					],
					"distance": 23,
					"maxTargetCount": 1,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				}
			},
			
			"7":{
				"className": "Mystic",
				"5":{
					"name": "Titanic Favor",
					"type": "heal",
					"targets": [
						"heal"
					],
					"distance": 35,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"9":{
					"name": "Arun's Cleansing",
					"type": "cleanse",
					"targets": [
						"cleanse"
					],
					"distance": 35,
					"maxTargetCount": 5,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"24":{
					"name": "Volley of Curses",
					"type": "damage",
					"targets": [
						"boss",
						"npc",
						"enemyDps",
						"enemy"
					],
					"distance": 30,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"41":{
					"name": "Contaigon",
					"type": "damage",
					"targets": [
						"boss",
						"npc",
						"enemyBuff",
						"enemyHealer",
						"enemy"
					],
					"distance": 30,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"28":{
					"name": "Sonorous Dreams",
					"type": "debuff",
					"targets": [
						"enemyHealer",
						"enemyDps",
						"enemy",
						"npc",
						"boss"
					],
					"distance": 30,
					"maxTargetCount": 2,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"31":{
					"name": "Curse of Confusion",
					"type": "debuff",
					"targets": [
						"enemyHealer",
						"enemyDps",
						"enemy",
						"boss",
						"npc"
					],
					"distance": 30,
					"maxTargetCount": 2,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"30":{
					"name": "Curse of Exhaustion",
					"type": "debuff",
					"comment": "TODO DOUBLE CHECK EVERYHING ABOUT THIS ONE",
					"targets": [
						"enemyBuff",
						"enemy"
					],
					"distance": 30,
					"maxTargetCount": 4,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				},
				"32":{
					"name": "Mire",
					"type": "debuff",
					"targets": [
						"enemyBuff",
						"enemy",
						"npc"
					],
					"distance": 30,
					"maxTargetCount": 2,
					"lockonDelay": 0,
					"autoCastDelay": 0,
					"autoCast": true
				}
			}
			
		},

		"enabled": true,
        "autoDpsDelay": 20,
        "lockonDelay": 5,
		"autoHeal": true,
		"autoCleanse": true,
		"autoAttack": true,
		"autoDebuff": true,
		"targetParty": true,
		"targetBoss": true,
		"targetNpc": true,
		"targetEnemy": true,
		"prioByClass": true,
		"hpCutoff": 100,
		"maxVertical": 15,
		"healCast": true,
        "cleanseCast": true,
        "attackCast": true,
        "debuffCast": true,

		"splitSleep": true,
		"disableSleep": false,
		"ethics": true,
		
		"prioClass": [
			3
		],

		"sleepyPlayers": [
			"playerone",
			"playertwo",
			"left",
			"right"
		],
		"plaguePrio": [
			"playerone",
			"playertwo",
			"left",
			"right"
		],

		"blockList": [
			"playerone",
			"playertwo",
			"left",
			"right"
		],
		"dontHeal": [
			"playerone",
			"playertwo",
			"left",
			"right"
		],
		
		"findMob": false,
		"huntingZoneId_templateId": [
			"1200_6021",
			"1200_6011",
			"1200_6001",
			"116_3001",
			"116_3000",
			"116_2000",
			"13_7009",
			"13_7008",
			"13_7007",
			"13_7006",
			"13_7005",
			"13_7004",
			"13_7003",
			"13_7002",
			"13_7001"
		],


		"whatever": false
};

module.exports = function MigrateSettings(from_ver, to_ver, settings) {
    if (from_ver === undefined) {
        // Migrate legacy config file
        return Object.assign(Object.assign({}, DefaultSettings), settings);
    } else if (from_ver === null) {
        // No config file exists, use default settings
        return DefaultSettings;
    } else {
        // Migrate from older version (using the new system) to latest one
        if (from_ver + 1 < to_ver) {
            // Recursively upgrade in one-version steps
            settings = MigrateSettings(from_ver, from_ver + 1, settings);
            return MigrateSettings(from_ver + 1, to_ver, settings);
        }
        
        // If we reach this point it's guaranteed that from_ver === to_ver - 1, so we can implement
        // a switch for each version step that upgrades to the next version. This enables us to
        // upgrade from any version to the latest version without additional effort!
        switch(to_ver)
        {
            default:
				let oldsettings = settings
				
				settings = Object.assign(DefaultSettings, {});
				
				for(let option in oldsettings) {
					if(settings[option]) {
						settings[option] = oldsettings[option]
					}
				}
				
				break;
        }
        
        return settings;
    }
}