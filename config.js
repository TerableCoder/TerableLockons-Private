module.exports = {
     Skills: {
        6: [ // Priest
            19, // Focus Heal
            37  // Immersion
        ],
        7: [ // Mystic
            5, // Titanic Favor
            9  // Arun's Cleansing Touch
        ]
    },
    
    autoCast: true,     // true = skills auto lockon and cast. false = pre-lockon onto targets and casting is done manually
    autoCleanse: true,  // enable mystic cleanse
    smartCleanse: true,  // enable mystic cleanse
    autoDps: true,     // enable dps skills
	autoPvP: true,     // enables dps skills in pvp
    autoDpsDelay: 50,     // auto dps Delay
    autoHeal: true,     // enable healing skills
    hpCutoff: 90,       // (healing only) ignore members that have more HP% than this
    maxDistance: 35,    // in-game meters. can work up to 35m
    maxVertical: 35,     // (ignore targets at top of CS ladders, etc). can also be 35m
	
	maxImmersionRange: 28, // Immersion desyncs past 30 meters
	maxDebuffRange: 30, 
	maxDPSRange: 35, 
	maxEStarsRange: 25, // the buff is max range 25
	
	// sleep prioritize this class
	healer: true,
	archer: false,
	zerk: false,
	lancer: false,
	slayer: false,
	sorc: false,
	warrior: false,
	reaper: false,
	gunner: false,
	brawler: false,
	ninja: false,
	valk: false,
	prioDpsBeforeHealer: false
	
	
	
}