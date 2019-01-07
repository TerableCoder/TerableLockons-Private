//const Command = require('command');
const config = require('./config.js');
    
module.exports = function LetMeAutocast(dispatch) {
    //const dispatch.command = dispatch.command(dispatch);
    
    let enabled = false, // gets enabled when you log in as a healer, sorc, or archer
        debug = false,
        playerId = 0,
        gameId = 0,
        playerLocation = {},
        partyMembers = [],
        job = -1,
        glyphs = null,
		ownX = null,
        ownY = null,
        ownZ = null,
		bossInfo = [];
	let enemies = [];
	let reset = false;
	const RagnarokId = 10155130;
    const GROW_ID = 7000005;
    const stack = 10;
    const stackSmall = 5;
    const duration = 30000;
	let buffGrow = true;
	let buffPartyMemberGrow = false;
	/*
	valk 25/28.75
	sorc 20/24
	war 20/24
	reaper 15/19.5
	slayer 20
	lancer 20
	zerk 30
	ninja 24
	brawler basically infinite
	priest kaias+gs maybe
	mystic corruption ring maybe
	
	add another thing for GS/Tenacity/Mocking Shout
	*/
    
	
    dispatch.command.add('autoheal', (p1)=> {
        if (p1 == null) {
            config.autoHeal = !config.autoHeal;
        } else if (p1.toLowerCase() === 'off') {
            config.autoHeal = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoHeal = true;
        } else if (p1.toLowerCase() === 'debug') {
            debug = !debug;
            dispatch.command.message('Debug ' + (debug ? 'enabled' : 'disabled'));
            return;
        } else if (!isNaN(p1)) {
            config.autoHeal = true;
            config.hpCutoff = (p1 < 0 ? 0 : p1 > 100 ? 100 : p1);
        } else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }        
        dispatch.command.message('Healing ' + (config.autoHeal ? 'enabled (' + config.hpCutoff + '%)' : 'disabled'));
    });
    dispatch.command.add('autocleanse', (p1) => {
        if (p1 == null) {
            config.autoCleanse = !config.autoCleanse;
        } else if (p1.toLowerCase() === 'off') {
            config.autoCleanse = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoCleanse = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument for cleanse dispatch.command');
            return;
        }
        dispatch.command.message('Cleansing ' + (config.autoCleanse ? 'enabled' : 'disabled'));
    });
    dispatch.command.add('autocast', (p1)=> {
        if (p1 == null) {
            config.autoCast = !config.autoCast;
        } else if (p1.toLowerCase() === 'off') {
            config.autoCast = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoCast = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument for cast dispatch.command');
            return;
        }        
        dispatch.command.message('Heal Casting ' + (config.autoCast ? 'enabled' : 'disabled'));
    });
	dispatch.command.add('autodps', (p1)=> {
        if (p1 == null) {
            config.autoDps = !config.autoDps;
        } else if (p1.toLowerCase() === 'off') {
            config.autoDps = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoDps = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument for cast dispatch.command');
            return;
        }        
        dispatch.command.message('PvE Casting ' + (config.autoDps ? 'enabled' : 'disabled'));
    });
	dispatch.command.add('autopvp', (p1)=> {
        if (p1 == null) {
            config.autoPvP = !config.autoPvP;
        } else if (p1.toLowerCase() === 'off') {
            config.autoPvP = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoPvP = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument for cast dispatch.command');
            return;
        }        
        dispatch.command.message('PvP Casting ' + (config.autoPvP ? 'enabled' : 'disabled'));
    });
	dispatch.command.add('enable', (p1)=> {
        if (p1 == null) {
            enabled = !enabled;
        } else if (p1.toLowerCase() === 'off') {
            enabled = false;
        } else if (p1.toLowerCase() === 'on') {
            enabled = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument for enable dispatch.command');
            return;
        }        
        dispatch.command.message('Enabled ' + (enabled ? 'true' : 'false'));
    });
	dispatch.command.add('castdelay', (p1)=> {
		let delay = Number(p1);
        if (delay == NaN || delay < 0) {
            dispatch.command.message(p1 +' is an invalid argument for cast dispatch.command');
            return;
        } else {
            config.autoDpsDelay = delay;
        }        
        dispatch.command.message('Casting Delay ' + config.autoDpsDelay);
    });
	
	dispatch.command.add('sleepdps', (p1)=> {
        if (p1 == null) {
            config.sleepPrioDpsBeforeHealer = !config.sleepPrioDpsBeforeHealer;
        } else if (p1.toLowerCase() === 'off') {
            config.sleepPrioDpsBeforeHealer = false;
        } else if (p1.toLowerCase() === 'on') {
            config.sleepPrioDpsBeforeHealer = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
        dispatch.command.message('Sleep Priority Dps Before Priority Healer ' + (config.sleepPrioDpsBeforeHealer ? 'enabled' : 'disabled'));
    });
	/*
	dispatch.command.add('esdps', (p1)=> {
        if (p1 == null) {
            config.eStarsPrioDpsBeforeHealer = !config.eStarsPrioDpsBeforeHealer;
        } else if (p1.toLowerCase() === 'off') {
            config.eStarsPrioDpsBeforeHealer = false;
        } else if (p1.toLowerCase() === 'on') {
            config.eStarsPrioDpsBeforeHealer = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
        dispatch.command.message('E Stars Priority Dps Before Priority Healer ' + (config.eStarsPrioDpsBeforeHealer ? 'enabled' : 'disabled'));
    });
	*/
	dispatch.command.add('ppdps', (p1)=> {
        if (p1 == null) {
            config.plaguePrioDpsBeforeHealer = !config.plaguePrioDpsBeforeHealer;
        } else if (p1.toLowerCase() === 'off') {
            config.plaguePrioDpsBeforeHealer = false;
        } else if (p1.toLowerCase() === 'on') {
            config.plaguePrioDpsBeforeHealer = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
        dispatch.command.message('Plague Priority Dps Before Priority Healer ' + (config.plaguePrioDpsBeforeHealer ? 'enabled' : 'disabled'));
    });
	
	dispatch.command.add('targetboss', (p1)=> {
        if (p1 == null) {
            config.targetBoss = !config.targetBoss;
        } else if (p1.toLowerCase() === 'off') {
            config.targetBoss = false;
        } else if (p1.toLowerCase() === 'on') {
            config.targetBoss = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
        dispatch.command.message('Target boss ' + (config.targetBoss ? 'enabled' : 'disabled'));
    });
	
	dispatch.command.add('splitcc', (p1)=> {
        if (p1 == null) {
            config.splitSleep = !config.splitSleep;
        } else if (p1.toLowerCase() === 'off') {
            config.splitSleep = false;
        } else if (p1.toLowerCase() === 'on') {
            config.splitSleep = true;
        } else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
        dispatch.command.message('Split Sleep/Fear/Gyre ' + (config.splitSleep ? 'enabled' : 'disabled'));
    });
	
	dispatch.command.add('sleepa', (p1)=> {
        if (p1 == null) {
            dispatch.command.message(p1 +' is an invalid argument');
			return;
        }
		p1 = p1.toLowerCase();
		
		if (p1 == 'healer'){
			config.healer = !config.healer;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.healer ? 'enabled' : 'disabled'));
		} else if (p1 == 'archer') {
			config.archer = !config.archer;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.archer ? 'enabled' : 'disabled'));
        } else if (p1 == 'zerk'){
			config.zerk = !config.zerk;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.zerk ? 'enabled' : 'disabled'));
		} else if (p1 == 'lancer'){
			config.lancer = !config.lancer;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.lancer ? 'enabled' : 'disabled'));
		} else if (p1 == 'slayer'){
			config.slayer = !config.slayer;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.slayer ? 'enabled' : 'disabled'));
		} else if (p1 == 'sorc'){
			config.sorc = !config.sorc;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.sorc ? 'enabled' : 'disabled'));
		} else if (p1 == 'warrior'){
			config.warrior = !config.warrior;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.warrior ? 'enabled' : 'disabled'));
		} else if (p1 == 'reaper'){
			config.reaper = !config.reaper;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.reaper ? 'enabled' : 'disabled'));
		} else if (p1 == 'gunner'){
			config.gunner = !config.gunner;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.gunner ? 'enabled' : 'disabled'));
		} else if (p1 == 'brawler'){
			config.brawler = !config.brawler;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.brawler ? 'enabled' : 'disabled'));
		} else if (p1 == 'ninja'){
			config.ninja = !config.ninja;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.ninja ? 'enabled' : 'disabled'));
		} else if (p1 == 'valk'){
			config.valk = !config.valk;
			dispatch.command.message('Sleep Priority ' + p1 + ' = ' + (config.valk ? 'enabled' : 'disabled'));	
		} else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
    });
	dispatch.command.add('plague', (p1)=> {
        if (p1 == null) {
            dispatch.command.message(p1 +' is an invalid argument');
			return;
        }
		p1 = p1.toLowerCase();
		
		if (p1 == 'healer'){
			config.phealer = !config.phealer;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.phealer ? 'enabled' : 'disabled'));
		} else if (p1 == 'archer') {
			config.parcher = !config.parcher;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.parcher ? 'enabled' : 'disabled'));
        } else if (p1 == 'zerk'){
			config.pzerk = !config.pzerk;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pzerk ? 'enabled' : 'disabled'));
		} else if (p1 == 'lancer'){
			config.plancer = !config.plancer;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.plancer ? 'enabled' : 'disabled'));
		} else if (p1 == 'slayer'){
			config.pslayer = !config.pslayer;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pslayer ? 'enabled' : 'disabled'));
		} else if (p1 == 'sorc'){
			config.psorc = !config.psorc;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.psorc ? 'enabled' : 'disabled'));
		} else if (p1 == 'warrior'){
			config.pwarrior = !config.pwarrior;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pwarrior ? 'enabled' : 'disabled'));
		} else if (p1 == 'reaper'){
			config.preaper = !config.preaper;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.preaper ? 'enabled' : 'disabled'));
		} else if (p1 == 'gunner'){
			config.pgunner = !config.pgunner;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pgunner ? 'enabled' : 'disabled'));
		} else if (p1 == 'brawler'){
			config.pbrawler = !config.pbrawler;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pbrawler ? 'enabled' : 'disabled'));
		} else if (p1 == 'ninja'){
			config.pninja = !config.pninja;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pninja ? 'enabled' : 'disabled'));
		} else if (p1 == 'valk'){
			config.pvalk = !config.pvalk;
			dispatch.command.message('Plague Priority ' + p1 + ' = ' + (config.pvalk ? 'enabled' : 'disabled'));	
		} else {
            dispatch.command.message(p1 +' is an invalid argument');
            return;
        }
    });
	
    dispatch.command.add('sleepy', (p1) => {
		if (!config.sleepyPlayers[0].includes(p1)){
			config.sleepyPlayers[0].push(p1);
		}
        dispatch.command.message(JSON.stringify(config.sleepyPlayers[0], null, 4));
        message(JSON.stringify(config.sleepyPlayers[0], null, 4));
    });
	dispatch.command.add('dmgadd', (p1) => {
		if (!config.freeStars[0].includes(p1)){
			config.freeStars[0].push(p1);
		}
        dispatch.command.message(JSON.stringify(config.freeStars[0], null, 4));
        message(JSON.stringify(config.freeStars[0], null, 4));
    });
	dispatch.command.add('pp', (p1) => {
		if (!config.plaguePrio[0].includes(p1)){
			config.plaguePrio[0].push(p1);
		}
        dispatch.command.message(JSON.stringify(config.plaguePrio[0], null, 4));
        message(JSON.stringify(config.plaguePrio[0], null, 4));
    });
	dispatch.command.add('bl', (p1) => {
		if (p1 != null && !config.blockList[0].includes(p1)){
			config.blockList[0].push(p1);
		}
        dispatch.command.message(JSON.stringify(config.blockList[0], null, 4));
        message(JSON.stringify(config.blockList[0], null, 4));
    });
	dispatch.command.add('dd', (p1) => {
		if (p1 != null && !config.dontDamage[0].includes(p1)){
			config.dontDamage[0].push(p1);
		}
        dispatch.command.message(JSON.stringify(config.dontDamage[0], null, 4));
        message(JSON.stringify(config.dontDamage[0], null, 4));
    });
	dispatch.command.add('dh', (p1) => {
		if (!config.dontHeal[0].includes(p1)){
			config.dontHeal[0].push(p1);
		}
        dispatch.command.message(JSON.stringify(config.dontHeal[0], null, 4));
        message(JSON.stringify(config.dontHeal[0], null, 4));
    });
	dispatch.command.add('sleepyremove', (p1) => {
		let index = config.sleepyPlayers[0].indexOf(p1);
		if (index > -1){
			config.sleepyPlayers[0].splice(index, 1);
		}
        dispatch.command.message(JSON.stringify(config.sleepyPlayers[0], null, 4));
        message(JSON.stringify(config.sleepyPlayers[0], null, 4));
    });
	dispatch.command.add('dmgremove', (p1) => {
		let index = config.freeStars[0].indexOf(p1);
		if (index > -1){
			config.freeStars[0].splice(index, 1);
		}
        dispatch.command.message(JSON.stringify(config.freeStars[0], null, 4));
        message(JSON.stringify(config.freeStars[0], null, 4));
    });
	dispatch.command.add('ppremove', (p1) => {
		let index = config.plaguePrio[0].indexOf(p1);
		if (index > -1){
			config.plaguePrio[0].splice(index, 1);
		}
        dispatch.command.message(JSON.stringify(config.plaguePrio[0], null, 4));
        message(JSON.stringify(config.plaguePrio[0], null, 4));
    });
	dispatch.command.add('blremove', (p1) => {
		let index = config.blockList[0].indexOf(p1);
		if (index > -1){
			config.blockList[0].splice(index, 1);
		}
        dispatch.command.message(JSON.stringify(config.blockList[0], null, 4));
        message(JSON.stringify(config.blockList[0], null, 4));
    });
	dispatch.command.add('ddremove', (p1) => {
		let index = config.dontDamage[0].indexOf(p1);
		if (index > -1){
			config.dontDamage[0].splice(index, 1);
		}
        dispatch.command.message(JSON.stringify(config.dontDamage[0], null, 4));
        message(JSON.stringify(config.dontDamage[0], null, 4));
    });
	dispatch.command.add('dhremove', (p1) => {
		let index = config.dontHeal[0].indexOf(p1);
		if (index > -1){
			config.dontHeal[0].splice(index, 1);
		}
        dispatch.command.message(JSON.stringify(config.dontHeal[0], null, 4));
        message(JSON.stringify(config.dontHeal[0], null, 4));
    });
	
    dispatch.command.add('tp', () => {
        sortHp();
        dispatch.command.message(JSON.stringify(partyMembers, null, 4));
        message(JSON.stringify(partyMembers, null, 4));
    });
	dispatch.command.add('tb', () => {
        sortDistBoss();
        dispatch.command.message(JSON.stringify(bossInfo, null, 4));
        message(JSON.stringify(bossInfo, null, 4));
    });
	dispatch.command.add('te', () => {
		sortDistEnemies();
        dispatch.command.message(JSON.stringify(enemies, null, 4));
        message(JSON.stringify(enemies, null, 4));
    });
	dispatch.command.add('cp', () => {
        partyMembers = [];
        dispatch.command.message(JSON.stringify(partyMembers, null, 4));
        message(JSON.stringify(partyMembers, null, 4));
    });
	dispatch.command.add('cb', () => {
        bossInfo = [];
        dispatch.command.message(JSON.stringify(bossInfo, null, 4));
        message(JSON.stringify(bossInfo, null, 4));
    });
	dispatch.command.add('ce', () => {
        enemies = [];
        dispatch.command.message(JSON.stringify(enemies, null, 4));
        message(JSON.stringify(enemies, null, 4));
    });
	dispatch.command.add('ml', () => {
		message("My Location");
        dispatch.command.message(JSON.stringify(playerLocation, null, 4));
        message(JSON.stringify(playerLocation, null, 4));
    });
	
	
	
    dispatch.hook('S_LOGIN', 10, (event) => {
        playerId = event.playerId;
        gameId = event.gameId;
        job = (event.templateId - 10101) % 100;
        //enabled = (config.Skills[job]) ? true : false;
		if ((job == 4) || (job == 5) || (job == 6) || (job == 7)){ // sorc or archer or priest or mystic
			enabled = true;
		} else {
			enabled = false;
		}
		enemies = [];
		//message("S_LOGIN");
		//message("CLEARED Enemies List");
		
    })
	
    dispatch.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
        if (!enabled) return;
		
		let addedMember;
		if (event.members.length -1 > partyMembers.length){
			addedMember = true;
		} else {
			addedMember = false;
		}
		
        // refresh locations of existing party members.
        for (let i = 0; i < event.members.length; i++) {
            for (let j = 0; j < partyMembers.length; j++) {
                if (partyMembers[j]) {
                    //if (event.members[i].gameId.equals(partyMembers[j].gameId)) {
                    if (event.members[i].gameId == (partyMembers[j].gameId)) {
                        event.members[i].loc = partyMembers[j].loc;
                        event.members[i].hpP = partyMembers[j].hpP;
						
						/*
						if (isNaN(partyMembers[j].hpP) || partyMembers[j].hpP == undefined || partyMembers[j].hpP == null && partyMembers[j].hpP > 100){
							dispatch.command.message("S_PARTY_MEMBER_LIST, " + partyMembers[i].playerId + " HP = " + partyMembers[j].hpP);
						}
						*/
						
						/*
						let asd = (event.curHp / event.maxHp) * 100;
						if (asd != null && asd <= 100){
							//event.members[i].hpP = asd;
							event.members[i].hpP = partyMembers[j].hpP;
						} else {
							event.members[i].hpP = 100;
							dispatch.command.message("S_PARTY_MEMBER_LIST, " + partyMembers[i].playerId + " HP = " + asd);
						}
						*/
                    }
                }
            }
        }
        partyMembers = event.members;
        // remove self from targets
        for (let i = 0; i < partyMembers.length; i++) {
           // if (partyMembers[i].gameId.equals(gameId)) {
            if (partyMembers[i].gameId == (gameId)) {
                partyMembers.splice(i, 1);
				
				if (addedMember){ // remove party members from enemies list
					for (let j = 0; j < partyMembers.length; j++){
						for (let k = 0; k < enemies.length; k++){
							//if (enemies[k].gameId.equals(partyMembers[j].gameId)){
							if (enemies[k].gameId == (partyMembers[j].gameId)){
								enemies.splice(k, 1);
								break;
							}
						}
					}
				}
				
                return;
            }
        }
    })
    
    dispatch.hook('S_LEAVE_PARTY', 1, (event) => {
        partyMembers = [];
		bossInfo = [];
		enemies = [];
    })
    
    dispatch.hook('C_PLAYER_LOCATION', 5, (event) => {
        if (!enabled) return;
        playerLocation = event;
		ownX = (event.loc.x + event.dest.x) / 2;
        ownY = (event.loc.y + event.dest.y) / 2;
        ownZ = (event.loc.z + event.dest.z) / 2;
    })
    
    dispatch.hook('S_SPAWN_ME', 3, (event) => {
        playerLocation.gameId = event.gameId;
        playerLocation.loc = event.loc;
        playerLocation.w = event.w;
		enemies = [];
		//message("S_SPAWN_ME");
		//message("CLEARED Enemies List");
    })
    
	/*
    class index
    warrior = 0, lancer = 1, slayer = 2, berserker = 3,
    sorcerer = 4, archer = 5, priest = 6, mystic = 7,
    reaper = 8, gunner = 9, brawler = 10, ninja = 11,
    valkyrie = 12
    */
	
    dispatch.hook('S_SPAWN_USER', 13, (event) => {
        if (!enabled) return;
        if (partyMembers.length != 0) {
            for (let i = 0; i < partyMembers.length; i++) {
                //if (partyMembers[i].gameId.equals(event.gameId)) {
                if (partyMembers[i].gameId == (event.gameId)) {
                    partyMembers[i].loc = event.loc;
                    partyMembers[i].hpP = (event.alive ? 100 : 0);
                    return;
                }
            }
		}
		
		let theirClass = (event.templateId - 10101) % 100;
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			//if (enemies[i].gameId.equals(event.gameId)) {
			if (enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].alive = event.alive;
				enemies[i].job = theirClass;
				enemies[i].name = event.name;
				return;
			}
		}
		// if new enemy, add them
		let tempPushEvent = {
			gameId: event.gameId,
			loc: event.loc,
			w: event.w,
			alive: event.alive,
			dist: Number(99999999),
			job: theirClass,
			name: event.name,
			classBufffed: false,
			stunImmune: false
		}
		enemies.push(tempPushEvent);
	
		//message("S_SPAWN_USER");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_USER_LOCATION', 5, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            //if (partyMembers[i].gameId.equals(event.gameId)) {
            if (partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			//if (enemies[i].gameId.equals(event.gameId)) {
			if (enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].alive = true;
				return;
			}
		}
		
		// if new enemy, add them
		let tempPushEvent = {
			gameId: event.gameId,
			loc: event.loc,
			w: event.w,
			alive: true,
			dist: Number(99999999),
			job: null,
			name: "",
			classBufffed: false,
			stunImmune: false
		}
		enemies.push(tempPushEvent);
		
		//message("S_USER_LOCATION");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_USER_LOCATION_IN_ACTION', 2, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            //if (partyMembers[i].gameId.equals(event.gameId)) {
            if (partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			//if (enemies[i].gameId.equals(event.gameId)) {
			if (enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].w = event.w;
				enemies[i].alive = true;
				return;
			}
		}
		
		// if new enemy, add them
		let tempPushEvent = {
			gameId: event.gameId,
			loc: event.loc,
			w: event.w,
			alive: true,
			dist: Number(99999999),
			job: null,
			name: "",
			classBufffed: false,
			stunImmune: false
		}
		enemies.push(tempPushEvent);
		
		//message("S_USER_LOCATION_IN_ACTION");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_INSTANT_DASH', 3, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            //if (partyMembers[i].gameId.equals(event.gameId)) {
            if (partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			//if (enemies[i].gameId.equals(event.gameId)) {
			if (enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].w = event.w;
				enemies[i].alive = true;
				return;
			}
		}
		
		// if new enemy, add them
		let tempPushEvent = {
			gameId: event.gameId,
			loc: event.loc,
			w: event.w,
			alive: true,
			dist: Number(99999999),
			job: null,
			name: "",
			classBufffed: false,
			stunImmune: false
		}
		enemies.push(tempPushEvent);
		
		//message("S_INSTANT_DASH");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_PARTY_MEMBER_CHANGE_HP', 4, (event) => {
        if (!enabled) return;
        if (playerId == event.playerId) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].playerId === event.playerId) {
				let asd = (Number(event.curHp) / Number(event.maxHp)) * 100;
				if (asd != null && asd <= 100){
					partyMembers[i].hpP = asd;
				} else {
					//partyMembers[i].hpP = 100;
					//dispatch.command.message("S_PARTY_MEMBER_CHANGE_HP, " + partyMembers[i].playerId + " HP = " + asd);
				}
                //partyMembers[i].hpP = (event.curHp / event.maxHp) * 100;
				/*let tempvar = Number(event.curHp);
				let tempvarrr = Number(event.maxHp);
                partyMembers[i].hpP = tempvar * tempvarrr * 100;*/
				//dispatch.command.message("player hp = " + partyMembers[i].hpP);
                return;
            }
        }
    })
    
	
    dispatch.hook('S_PARTY_MEMBER_STAT_UPDATE', 3, (event) => {
        if (!enabled) return;
        if (playerId == event.playerId) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].playerId === event.playerId) {
				let asd = (Number(event.curHp) / Number(event.maxHp)) * 100;
				if (asd != null && asd <= 100){
					partyMembers[i].hpP = asd;
				} else {
					//partyMembers[i].hpP = 100;
					//dispatch.command.message("S_PARTY_MEMBER_STAT_UPDATE, " + partyMembers[i].playerId + " HP = " + asd);
				}
                //partyMembers[i].hpP = (event.curHp / event.maxHp) * 100;
				/*let tempvar = Number(event.curHp);
				let tempvarrr = Number(event.maxHp);
                partyMembers[i].hpP = tempvar * tempvarrr * 100;*/
				//dispatch.command.message("player hp = " + partyMembers[i].hpP);
                return;
            }
        }
    })
	
    dispatch.hook('S_DEAD_LOCATION', 2, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            //if (partyMembers[i].gameId.equals(event.gameId)) {
            if (partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                partyMembers[i].hpP = 0;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			//if (enemies[i].gameId.equals(event.gameId)) {
			if (enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc; // has no w
				enemies[i].alive = false;
				return;
			}
		}
		
		// if new enemy, add them
		let tempPushEvent = {
			gameId: event.gameId,
			loc: event.loc,
			w: null,
			alive: false,
			dist: Number(99999999),
			job: null,
			name: "",
			classBufffed: false,
			stunImmune: false
		}
		enemies.push(tempPushEvent);
		
		//message("S_DEAD_LOCATION");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
	
	
	
	
	dispatch.hook('S_ABNORMALITY_BEGIN', 3, event => {
        if (event.id == RagnarokId) {
			if (buffPartyMemberGrow){
				for (let i = 0; i < partyMembers.length; i++) {
					//if (partyMembers[i].gameId.equals(event.target)) {
					if (partyMembers[i].gameId == (event.target)) {
						applyChange(event.target, GROW_ID);
					}
				}
			}
			if (buffGrow){
				for (let i = 0; i < enemies.length; i++) {
					//if (enemies[i].gameId.equals(event.target)) {
					if (enemies[i].gameId == (event.target)) {
						applyChange(event.target, GROW_ID);
					}
				}
			}
			
			
        }
     })

     dispatch.hook('S_ABNORMALITY_END', 1, event => {
        if (event.id == RagnarokId) {
            removeChange(event.target, GROW_ID);
        }
     })

    function applyChange (target, id){
        dispatch.toClient('S_ABNORMALITY_END', 1, {
                    target: target,
                    id: id,
                });	
        dispatch.toClient('S_ABNORMALITY_BEGIN', 3, {
                    target: target,
                    source: target,
                    id: id,
                    duration: duration,
                    unk: 0,
                    stacks: stack,
                    unk2: 0,
                });
    }
    
    function removeChange (target, id){
        dispatch.toClient('S_ABNORMALITY_BEGIN', 3, {
                    target: target,
                    source: target,                      
                    id: id,                      	  //Sometimes abnormality disappears and needs to be restored before removing.
                    duration: duration,			  //This makes sure u can restore your appearance and no abnormality icon is left in your buff bar.
                    unk: 0,
                    stacks: stack,
                    unk2: 0,
                });
        dispatch.toClient('S_ABNORMALITY_END', 1, {
                    target: target,
                    id: id,
                });	
	}
	
	
    
    dispatch.hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].playerId === event.playerId) {
                partyMembers.splice(i, 1);
                return;
            }
        }
    });
     
    dispatch.hook('S_LOGOUT_PARTY_MEMBER', 1, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].playerId === event.playerId) {
                partyMembers[i].online = false;
                return;
            }
        }
    });
    
    dispatch.hook('S_BAN_PARTY_MEMBER', 1, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].playerId === event.playerId) {
                partyMembers.splice(i, 1);
                return;
            }
        }
    });    
    
	
	dispatch.hook('S_BOSS_GAGE_INFO', 3, { order: -10 }, (event) => {

        let alreadyHaveBoss = false;
		/*
		let tempvar = Number(event.curHp);
		let tempvarrr = Number(event.maxHp);
		tempvar = tempvar * tempvarrr * 100;
		*/
		//dispatch.command.message("Boss hp = " + tempvar);
        let tempPushEvent = {
            id: event.id,
            x: Number(99999999),
            y: Number(99999999),
            z: Number(99999999),
            w: null,
            hp: (Number(event.curHp) / Number(event.maxHp) * 100),
            //hp: tempvar,
            dist: 100
        }
        if (bossInfo.length <= 0) {
            bossInfo.push(tempPushEvent);
        } else {
            for (let b = 0; b < bossInfo.length; b++) {
                //if (bossInfo[b].id.equals(event.id)) {
                if (bossInfo[b].id == (event.id)) {
                    bossInfo[b].hp = (Number(event.curHp) / Number(event.maxHp) * 100);
                    //bossInfo[b].hp = tempvar;
                    alreadyHaveBoss = true;
                    if (event.curHp <= 0) {
                        bossInfo = bossInfo.filter(function (p) {
                            //return !p.id.equals(event.id);
							let tempvari = true;
							if (p.id == event.id){
								tempvari = false;
							}
                            return tempvari;
                        });
                    }
                    break;
                }
            }
            if (alreadyHaveBoss == false) {
                bossInfo.push(tempPushEvent);
            }
        }

    });
	
    dispatch.hook('S_ACTION_STAGE', 9, { order: -10 }, (event) => {

        if (bossInfo.length > 0) {
			for (let b = 0; b < bossInfo.length; b++) {
				//if (event.gameId.equals(bossInfo[b].id)) {
				if (event.gameId == (bossInfo[b].id)) {
					bossInfo[b].x = event.loc.x;
					bossInfo[b].y = event.loc.y;
					bossInfo[b].z = event.loc.z;
					bossInfo[b].w = event.w;
					bossInfo[b].dist = checkDistance(ownX, ownY, ownZ, event.loc.x, event.loc.y, event.loc.z);
					break;
				}
			}
		}
		
		if (enemies.length <= 0) {
			for (let b = 0; b < enemies.length; b++) {
				//if (event.gameId.equals(enemies[b].id)) {
				if (event.gameId == (enemies[b].id)) {
					enemies[b].loc = event.loc;
					enemies[b].w = event.w;
					break;
				}
			}
		}
		
    });
	/*
	dispatch.hook('S_CREST_MESSAGE', 2, ({type, skill}) => {
        if (type === 6) {
			reset = true;
			dispatch.send('S_DUNGEON_EVENT_MESSAGE', 2, {
                //message: `<img src="img://skill__0__${mod.game.me.templateId}__${skill}" width="48" height="48" vspace="-20"/><font size="24" color="${mod.settings.reset_font_color}">&nbsp;Reset</font>`,
                message: `<img src="img://skill__0__${dispatch.game.me.templateId}__${skill}" width="48" height="48" vspace="-20"/><font size="24" color="#FF4500">&nbsp;Reset</font>`,
				//type: mod.settings.flashing_notification ? 70 : 2,
				type: 2,
                chat: false,
                channel: 0,
            })
			return false;
		}
    });
	*/
	
    dispatch.hook('C_START_SKILL', 7, (event) => {
        if (!enabled) return;
        // if (partyMembers.length == 0) return; // be in a party
        if (event.skill.id / 10 & 1 != 0) { // is casting (opposed to locking on)
            playerLocation.w = event.w;
            return; 
        }
        let skill = Math.floor(event.skill.id / 10000);
		
		//let skillId = event.skill.id
		//let skillSub = event.skill.id % 100;
		//let packetSkillInfo = config.find(o => o.group == skillInfo.group && o.job == job);
		
		//reset = false;
        //message("starting");
        //dispatch.command.message("starting");
        if(config.Skills[job] && config.Skills[job].includes(skill)) { // heal/cleanse?
			//dispatch.command.message("Priest or mystic heal");
			if (partyMembers.length == 0) return; // be in a party
            if (skill != 9 && !config.autoHeal) return; // skip heal if disabled
            if (skill == 9 && !config.autoCleanse) return; // skip cleanse if disabled
            if (skill == 9 && partyMembers.length > 4) return; // skip cleanse if in a raid
            
            let targetMembers = [];
            let maxTargetCount = getMaxTargets(skill);
            if (skill != 9) sortHp();
            for (let i = 0; i < partyMembers.length; i++) { // queue ppl to lock on to
                if (partyMembers[i].online &&
                    partyMembers[i].hpP != undefined &&
                    partyMembers[i].hpP != 0 &&
                    ((skill == 9) ? true : partyMembers[i].hpP <= config.hpCutoff) && // (cleanse) ignore max hp
                    partyMembers[i].loc != undefined &&
                    //(partyMembers[i].loc.dist3D(playerLocation.loc) / 25) <= config.maxDistance && 
                    (Math.abs(partyMembers[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
						if (skill == 37) { // if immersion
							if ((partyMembers[i].loc.dist3D(playerLocation.loc) / 25) <= config.maxImmersionRange) {
								if (!config.dontHeal[0].includes(partyMembers[i].name)){
									targetMembers.push(partyMembers[i]);
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						} else { // else not immersion
							if ((partyMembers[i].loc.dist3D(playerLocation.loc) / 25) <= config.maxDistance){
								if (!config.dontHeal[0].includes(partyMembers[i].name)){
									targetMembers.push(partyMembers[i]);
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
                        
                    }
            }
            
            if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].gameId, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoCast) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
            }
			//dispatch.command.message("reset = " + reset);
			//message("reset = " + reset);
			//dispatch.command.message("Priest or mystic heal completed!");
        } else if (job == 7 && (skill == 24 || skill == 28 || skill == 41) && bossInfo != null && bossInfo.length != 0 && config.targetBoss){ // Mystic and Volley of Curses || Sonorous Dreams || Contagion
			// TODO
			//dispatch.command.message("Mystic lockon attacks");
            sortDistBoss();
			
			let targetMembers = [];
            let maxTargetCount = 1;
			if (skill == 41){
				maxTargetCount = 1;
			} else if (skill == 28) {
				maxTargetCount = 2;
			} else if (skill == 24) {
				maxTargetCount = 4;
			}
			
			for (let i = 0; i < bossInfo.length; i++) { // queue ppl to lock on to
                if (bossInfo[0].dist <= config.maxDebuffRange){
					targetMembers.push(bossInfo[i]);
					if (targetMembers.length == maxTargetCount) break;
				}
            }
			
			if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].id, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoDps) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
            }
			
			//dispatch.command.message("Mystic lockon Completed");
			
		} else if (job == 6 && (skill == 30 || skill == 33 || skill == 35) && bossInfo != null && bossInfo.length != 0 && config.targetBoss){ // Priest and Plague of Exhaustion || Ishara's Lullaby || Energy Stars
			//dispatch.command.message("Priest lockon attacks");
			sortDistBoss();
			
			let targetMembers = [];
            let maxTargetCount = 1;
			if (skill == 33 || skill == 35){
				maxTargetCount = 1;
			} else if (skill == 30) {
				maxTargetCount = 4;
			}
			
			for (let i = 0; i < bossInfo.length; i++) { // queue ppl to lock on to
                if ((skill == 35 && (bossInfo[0].dist <= config.maxEStarsRange)) || // if estars
                ((skill == 30 || skill == 33) && (bossInfo[0].dist <= config.maxDebuffRange))){// other dps skill
					targetMembers.push(bossInfo[i]);
					if (targetMembers.length == maxTargetCount) break;
				}
            }
			
			if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].id, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoDps) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
            }
			
			//dispatch.command.message("Priest lockon Completed");
			
		} else if (((job == 5 && skill == 2) || (job == 4 && (skill == 20 || skill == 22))) && bossInfo != null && bossInfo.length != 0 && config.targetBoss){ // Arrow Volley or Flaming Barrage or Burning Breath
			//dispatch.command.message("Sorc or Archer lockon - boss");
			//message("Sorc or Archer lockon - boss");
			sortDistBoss();
			
			let targetMembers = [];
            let maxTargetCount = 1;
			if (skill == 22){
				maxTargetCount = 1;
			} else if (skill == 20) {
				maxTargetCount = 4;
			} else if (skill == 2) {
				maxTargetCount = 5;
			}
			
			for (let i = 0; i < bossInfo.length; i++) { // queue ppl to lock on to
                if (bossInfo[0].dist <= config.maxDPSRange){
					targetMembers.push(bossInfo[i]);
					if (targetMembers.length == maxTargetCount) break;
				}
            }
			
			if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].id, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoDps) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
            }
			
			//dispatch.command.message("Sorc or Archer lockon Completed");
		} else if (((job == 6 && (skill == 30)) || (job == 7 && (skill == 30))) && enemies.length != 0){ // Priest and Plague of Exhaustion OR Mystic and Curse of Exhaustion
			//dispatch.command.message("Priest Lockon Enemies - Plague");
			
			let targetMembers = [];
            let maxTargetCount = 4;
			
			for (let i = 0; i < enemies.length; i++) { // calculate distance
				enemies[i].dist = enemies[i].loc.dist3D(playerLocation.loc) / 25;
			}
			sortDistEnemies();
			
			
			// plague priority players
			if (config.plaguePrio[0].length > 0){ // we have plague priority players
				for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
					if (config.plaguePrio[0].includes(enemies[i].name)){ // matching name?
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if (!config.blockList[0].includes(enemies[i].name)){
									targetMembers.push(enemies[i]);
									//dispatch.command.message("Priest Enemy Added - Plague" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
					}
				}
			}
			
			/*
			class index
			warrior = 0, lancer = 1, slayer = 2, berserker = 3,
			sorcerer = 4, archer = 5, priest = 6, mystic = 7,
			reaper = 8, gunner = 9, brawler = 10, ninja = 11,
			valkyrie = 12
			*/
			
			let dpsPrio = config.parcher || config.pzerk || config.plancer || config.pslayer || config.psorc 
			|| config.pwarrior || config.preaper || config.pgunner || config.pbrawler || config.pninja || config.pvalk;
			
			// look for priority dps
			if (!config.phealer && dpsPrio || config.plaguePrioDpsBeforeHealer){ // phealer = false && a dps = true OR plaguePrioDpsBeforeHealer = true
				if (targetMembers.length < maxTargetCount){
					for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if ((config.parcher ? enemies[i].job == 5 : false) || 
								(config.pzerk ? enemies[i].job == 3 : false) || 
								(config.plancer ? enemies[i].job == 1 : false) || 
								(config.pslayer ? enemies[i].job == 2 : false) || 
								(config.psorc ? enemies[i].job == 4 : false) || 
								(config.pwarrior ? enemies[i].job == 0 : false) || 
								(config.preaper ? enemies[i].job == 8 : false) || 
								(config.pgunner ? enemies[i].job == 9 : false) || 
								(config.pbrawler ? enemies[i].job == 10 : false) || 
								(config.pninja ? enemies[i].job == 11 : false) || 
								(config.pvalk ? enemies[i].job == 12 : false)){
									if (!config.blockList[0].includes(enemies[i].name)){
										targetMembers.push(enemies[i]);
										//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
										if (targetMembers.length == maxTargetCount) break;
									}
								}
							}
						}
					}
				}
			}
			
			// look for healer
			if (config.phealer){ // phealer = true
				if (targetMembers.length < maxTargetCount){
					for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(enemies[i].job == 6 || enemies[i].job == 7) &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if (!config.blockList[0].includes(enemies[i].name)){
									targetMembers.push(enemies[i]);
									//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
					}
				}
			}
			
			// look for priority dps
			if (dpsPrio){ // a dps = true
				if (targetMembers.length < maxTargetCount){
					for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if ((config.parcher ? enemies[i].job == 5 : false) || 
								(config.pzerk ? enemies[i].job == 3 : false) || 
								(config.plancer ? enemies[i].job == 1 : false) || 
								(config.pslayer ? enemies[i].job == 2 : false) || 
								(config.psorc ? enemies[i].job == 4 : false) || 
								(config.pwarrior ? enemies[i].job == 0 : false) || 
								(config.preaper ? enemies[i].job == 8 : false) || 
								(config.pgunner ? enemies[i].job == 9 : false) || 
								(config.pbrawler ? enemies[i].job == 10 : false) || 
								(config.pninja ? enemies[i].job == 11 : false) || 
								(config.pvalk ? enemies[i].job == 12 : false)){
									if (!config.blockList[0].includes(enemies[i].name)){
										targetMembers.push(enemies[i]);
										//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
										if (targetMembers.length == maxTargetCount) break;
									}
								}
							}
						}
					}
				}
			}
			
			// no priority target found, look for anyone
			if (targetMembers.length < maxTargetCount){
				for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
					if (enemies[i].alive == true &&
						enemies[i].loc != undefined &&
						(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
						if (enemies[i].dist <= config.maxDebuffRange) {
							if (!config.blockList[0].includes(enemies[i].name)){
								targetMembers.push(enemies[i]);
								//dispatch.command.message("Priest Enemy Added - Plague" + (i+1));
								if (targetMembers.length == maxTargetCount) break;
							}
						}
					}
				}
			}
			
			if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].gameId, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoPvP) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
				//dispatch.command.message("Priest Lockon Completed - Plague");
            }
			//dispatch.command.message("Priest Lockon Enemies Completed - Plague");
			
		} else if (((job == 6 && skill == 35) || // Priest and Energy Stars
		(job == 5 && skill == 2) || // Arrow Volley
		(job == 7 && (skill == 24 || skill == 41)) || // Volley of Curses or Contagion
		(job == 4 && (skill == 20 || skill == 22))) // Flaming Barrage or Burning Breath
		&& enemies.length != 0){ 
			//dispatch.command.message("Priest Lockon Enemies - eStars");
			
			let targetMembers = [];
            let maxTargetCount = 1;
			if (skill == 35 || skill == 22 || skill == 41){
				maxTargetCount = 1;
			} else if (skill == 20 || skill == 24) {
				maxTargetCount = 4;
			} else if (skill == 2) {
				maxTargetCount = 5;
			}
			//dispatch.command.message(maxTargetCount);
			//message(maxTargetCount);
			for (let i = 0; i < enemies.length; i++) { // calculate distance
				enemies[i].dist = enemies[i].loc.dist3D(playerLocation.loc) / 25;
			}
			sortDistEnemies();
			
			// free eStars players
			if (config.freeStars[0].length > 0){ // we have free eStars players
				for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
					if (config.freeStars[0].includes(enemies[i].name)){ // matching name?
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (((skill == 35) && enemies[i].dist <= config.maxEStarsRange) || ((skill == 2 || skill == 20 || skill == 22) && enemies[i].dist <= config.maxDPSRange) || ((skill == 24 || skill == 41) && enemies[i].dist <= config.maxDebuffRange)) {
								if (!config.dontDamage[0].includes(enemies[i].name)){
									targetMembers.push(enemies[i]);
									//dispatch.command.message("Priest Enemy Added - eStars" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
					}
				}
			}
			if (targetMembers.length < maxTargetCount){
				for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
					if (enemies[i].alive == true &&
						enemies[i].loc != undefined &&
						(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
						if (((skill == 35) && enemies[i].dist <= config.maxEStarsRange) || ((skill == 2 || skill == 20 || skill == 22) && enemies[i].dist <= config.maxDPSRange) || ((skill == 24 || skill == 41) && enemies[i].dist <= config.maxDebuffRange)) {
							if (!config.dontDamage[0].includes(enemies[i].name)){
								targetMembers.push(enemies[i]);
								//dispatch.command.message("Priest Enemy Added - eStars" + (i+1));
								if (targetMembers.length == maxTargetCount) break;
							}
						}
					}
				}
			}
			
			if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].gameId, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoPvP) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
				
				//dispatch.command.message("Priest Lockon Completed - eStars");
            }
			//dispatch.command.message("Priest Lockon Enemies Completed - eStars");
			
		} else if (((job == 6 && (skill == 33)) || (job == 7 && (skill == 28 || skill == 31)) || (job == 4 && (skill == 25 || skill == 21 || skill == 23))) && enemies.length != 0){ // Priest and Ishara's Lullaby OR Mystic and Sonorous Dreams or Curse of Exhaustion OR Sorc and Time Gyre or Nerve Exhaustion or Mana Volley
			//dispatch.command.message("Priest Lockon Enemies - Sleep");
			
			let targetMembers = [];
            let maxTargetCount = 1; // eStars
			if (!config.healer && config.splitSleep && (skill == 28 || skill == 31 || skill == 25)) { // if cc ing dps and split == true, split lockon
				maxTargetCount = 2;
			} else if (skill == 21 || skill == 23) { // if Nerve Exhaustion or Mana Volley
				maxTargetCount = 4;
			}
			
			for (let i = 0; i < enemies.length; i++) { // calculate distance
				enemies[i].dist = enemies[i].loc.dist3D(playerLocation.loc) / 25;
			}
			sortDistEnemies();
			
			
			// sleepy players
			if (config.sleepyPlayers[0].length > 0){ // we have sleepy players
				for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
					if (config.sleepyPlayers[0].includes(enemies[i].name)){ // matching name?
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if (!config.blockList[0].includes(enemies[i].name)){
									targetMembers.push(enemies[i]);
									//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
					}
				}
			}
			
			/*
			class index
			warrior = 0, lancer = 1, slayer = 2, berserker = 3,
			sorcerer = 4, archer = 5, priest = 6, mystic = 7,
			reaper = 8, gunner = 9, brawler = 10, ninja = 11,
			valkyrie = 12
			*/
			
			let dpsPrio = config.archer || config.zerk || config.lancer || config.slayer || config.sorc 
			|| config.warrior || config.reaper || config.gunner || config.brawler || config.ninja || config.valk;
			
			// look for priority dps
			if (!config.healer && dpsPrio || config.sleepPrioDpsBeforeHealer){ // healer = false && a dps = true OR sleepPrioDpsBeforeHealer = true
				if (targetMembers.length < maxTargetCount){
					for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if ((config.archer ? enemies[i].job == 5 : false) || 
								(config.zerk ? enemies[i].job == 3 : false) || 
								(config.lancer ? enemies[i].job == 1 : false) || 
								(config.slayer ? enemies[i].job == 2 : false) || 
								(config.sorc ? enemies[i].job == 4 : false) || 
								(config.warrior ? enemies[i].job == 0 : false) || 
								(config.reaper ? enemies[i].job == 8 : false) || 
								(config.gunner ? enemies[i].job == 9 : false) || 
								(config.brawler ? enemies[i].job == 10 : false) || 
								(config.ninja ? enemies[i].job == 11 : false) || 
								(config.valk ? enemies[i].job == 12 : false)){
									if (!config.blockList[0].includes(enemies[i].name)){
										targetMembers.push(enemies[i]);
										//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
										if (targetMembers.length == maxTargetCount) break;
									}
								}
							}
						}
					}
				}
			}
			
			// look for healer
			if (config.healer){ // healer = true
				if (targetMembers.length < maxTargetCount){
					for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(enemies[i].job == 6 || enemies[i].job == 7) &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if (!config.blockList[0].includes(enemies[i].name)){
									targetMembers.push(enemies[i]);
									//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
					}
				}
			}
			
			// look for priority dps
			if (dpsPrio){ // a dps = true
				if (targetMembers.length < maxTargetCount){
					for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
						if (enemies[i].alive == true &&
							enemies[i].loc != undefined &&
							(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
							if (enemies[i].dist <= config.maxDebuffRange) {
								if ((config.archer ? enemies[i].job == 5 : false) || 
								(config.zerk ? enemies[i].job == 3 : false) || 
								(config.lancer ? enemies[i].job == 1 : false) || 
								(config.slayer ? enemies[i].job == 2 : false) || 
								(config.sorc ? enemies[i].job == 4 : false) || 
								(config.warrior ? enemies[i].job == 0 : false) || 
								(config.reaper ? enemies[i].job == 8 : false) || 
								(config.gunner ? enemies[i].job == 9 : false) || 
								(config.brawler ? enemies[i].job == 10 : false) || 
								(config.ninja ? enemies[i].job == 11 : false) || 
								(config.valk ? enemies[i].job == 12 : false)){
									if (!config.blockList[0].includes(enemies[i].name)){
										targetMembers.push(enemies[i]);
										//dispatch.command.message("Priest Enemy Added - Sleep" + (i+1));
										if (targetMembers.length == maxTargetCount) break;
									}
								}
							}
						}
					}
				}
			}
			
			// no priority target found, look for anyone
			if (targetMembers.length < maxTargetCount){
				for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
					if (enemies[i].alive == true &&
						enemies[i].loc != undefined &&
						(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
						if (enemies[i].dist <= config.maxDebuffRange) {
							if (!config.blockList[0].includes(enemies[i].name)){
								targetMembers.push(enemies[i]);
								//dispatch.command.message("Priest Enemy Added - eStars" + (i+1));
								if (targetMembers.length == maxTargetCount) break;
							}
						}
					}
				}
			}
			
			if (targetMembers.length > 0) {
                if (debug) outputDebug(event.skill);
                for (let i = 0; i < targetMembers.length; i++) {
                    setTimeout(() => {
                        dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[i].gameId, skill: event.skill.id});
                    }, 5);
                }
                
                if (config.autoPvP) {
                    setTimeout(() => {
                        dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                    }, config.autoDpsDelay);
                }
				
				//dispatch.command.message("Priest Lockon Completed - Sleep");
            }
			//dispatch.command.message("Priest Lockon Enemies Completed - Sleep");
			
		} else {
			//dispatch.command.message(skill);
			//message(skill);
			//dispatch.command.message("Enemies.length = " + enemies.length);
			//dispatch.command.message("bossInfo.length = " + bossInfo.length);
        }
		
    })
	

    dispatch.hook('S_CREST_INFO', 2, (event) => {
        if (!enabled) return;
        glyphs = event.crests;
    })
    
    dispatch.hook('S_CREST_APPLY', 2, (event) => {
        if (!enabled) return;
        for (let i = 0; i < glyphs.length; i++) {
            if (glyphs[i].id == event.id) {
                glyphs[i].enable = event.enable;
                return;
            }
        }
    })
    
    function getMaxTargets (skill) {
        switch(skill) {
            case 19: return isGlyphEnabled(28003) ? 4 : 2;
            case 37: return 1;
            case 5: return isGlyphEnabled(27000) ? 4 : 2;
            case 9: return (isGlyphEnabled(27063) || isGlyphEnabled(27003)) ? 5 : 3;
        }
        return 1;
    }
    
    function isGlyphEnabled(glyphId) {
        for(let i = 0; i < glyphs.length; i++) {
            if (glyphs[i].id == glyphId && glyphs[i].enable) {
                return true;
            }
        }
        return false;
    }
    
    function sortHp() {
        partyMembers.sort(function (a, b) {
            return Number(a.hpP) - Number(b.hpP);
        });
    }
        
    function outputDebug(skill) {
        let out = '\nAutoheal Debug... Skill: ' + skill.id + '\tpartyMemebers.length: ' + partyMembers.length;
        for (let i = 0; i < partyMembers.length; i++) {
            out += '\n' + i + '\t';
            let name = partyMembers[i].name;
            name += ' '.repeat(21-name.length);
            let hp = '\tHP: ' + partyMembers[i].hpP.toFixed(2);
			//let hp = '\tHP: ' + Number(partyMembers[i].hpP).toFixed(2);
            let dist = '\tDist: ' + (partyMembers[i].loc.dist3D(playerLocation.loc) / 25).toFixed(2);
            let vert = '\tVert: ' + (Math.abs(partyMembers[i].loc.z - playerLocation.loc.z) / 25).toFixed(2);
            let online = '\tOnline: ' + partyMembers[i].online;
            out += name + hp + dist + vert + online;
        }
        console.log(out)
    }
	
	function sortDistBoss() {
        bossInfo.sort(function (a, b) {
            return Number(a.dist) - Number(b.dist);
        });
    }
	
	function sortDistEnemies() {
		enemies.sort(function (a, b) {
			return Number(a.dist) - Number(b.dist);
		});
	}
	
	function message(msg, chat = false) {
        if (chat == true) {
            dispatch.command.message('(Let Me Target) ' + msg);
        } else {
            console.log('(Let Me Target) ' + msg);
        }
    }
	
	function checkDistance(x, y, z, x1, y1, z1) {
        return (Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2) + Math.pow(z1 - z, 2))) / 25;
    }
	
}
