module.exports = function TerableLockons(mod) {
	const command = mod.command || mod.require.command;
	
	if(mod.proxyAuthor !== 'caali') {
		const options = require('./module').options
		if(options) {
			const settingsVersion = options.settingsVersion
			if(settingsVersion) {
				mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
				mod.settings._version = settingsVersion
			}
		}
	}
    
    let enabled = false, // gets enabled when you log in as a lockon class
        playerId = 0,
        gameId = 0,
        playerLocation = {},
        partyMembers = [],
        job = -1,
		bossInfo = [];
	let enemies = [];
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
    
	function loopBigIntToString(obj){ // from PacketsLogger
		Object.keys(obj).forEach(key => {
			if(obj[key] && typeof obj[key] === 'object') loopBigIntToString(obj[key]);
			else if(typeof obj[key] === "bigint") obj[key] = obj[key].toString();
		});
	}
	
	function printBigInt(whatList, printInGame){
		let tempevent = whatList;
		loopBigIntToString(tempevent);
		console.log(JSON.stringify(tempevent, null, 4));
		if(printInGame) command.message(JSON.stringify(tempevent, null, 4));
	}
	
	function toggleOnOfSetting(variableToToggle, commandMessage, argument, whatNumber){
		if(!argument){
			mod.settings[variableToToggle] = !mod.settings[variableToToggle];
			mod.saveSettings();
			console.log(commandMessage + (mod.settings[variableToToggle] ? 'enabled' : 'disabled'));
			return;
        }
		let isNumber = !isNaN(argument);
		let tempNum = argument;
		argument = argument.toLowerCase();
		if(argument === 'off'){
            mod.settings[variableToToggle] = false;
        } else if(argument === 'on'){
            mod.settings[variableToToggle] = true;
        } else if(isNumber && whatNumber){
			mod.settings[variableToToggle] = true;
            mod.settings[whatNumber] = (tempNum < 0 ? 0 : tempNum > 100 ? 100 : tempNum);
        } else{
            command.message(argument + ' is an invalid argument');
            return;
        }
		mod.saveSettings();
        
		if(whatNumber){
			command.message(commandMessage + (mod.settings[variableToToggle] ? 'enabled (' + mod.settings[whatNumber] + '%)' : 'disabled'));
        } else{
			command.message(commandMessage + (mod.settings[variableToToggle] ? 'enabled' : 'disabled'));
		}
	}
	
	command.add(['teral', 'tlockons', 'teralockons', 'terablelockons'], (p1)=> {
		toggleOnOfSetting("enabled", 'TerableLockons is ', p1, null);
	});
	
	command.add('disablesleep', (p1)=> {
		toggleOnOfSetting("disableSleep", 'DisableSleep Casting is ', p1, null);
    });
	
    command.add('autoheal', (p1)=> {
		toggleOnOfSetting("autoHeal", 'Healing is ', p1, "hpCutoff");
    });
	
    command.add('autocleanse', (p1) => {
		toggleOnOfSetting("autoCleanse", 'Cleansing is ', p1, null);
    });
	
    command.add('autocast', (p1)=> {
		toggleOnOfSetting("autoCast", 'Heal Casting is ', p1, null);
    });
	
	command.add('autodps', (p1)=> {
		toggleOnOfSetting("autoDps", 'PvE Casting is ', p1, null);
    });
	
	command.add('autopvp', (p1)=> {
		toggleOnOfSetting("autoPvP", 'PvP Casting is ', p1, null);
    });
	
	
	command.add('castdelay', (p1)=> {
		let delay = Number(p1);
        if(delay.isNaN() || delay < 0) {
            command.message(p1 +' is an invalid argument');
            return;
        }
		mod.settings.autoDpsDelay = delay;
		mod.saveSettings();
        command.message('Casting Delay = ' + mod.settings.autoDpsDelay);
    });
	
	command.add('lockondelay', (p1)=> {
		let delay = Number(p1);
        if(delay.isNaN() || delay < 0) {
            command.message(p1 +' is an invalid argument');
            return;
        }
		mod.settings.lockonDelay = delay;
		mod.saveSettings();
        command.message('Lockon Delay =  ' + mod.settings.lockonDelay);
    });
	
	
	command.add('sleepdps', (p1)=> {
		toggleOnOfSetting("sleepPrioDpsBeforeHealer", 'Sleep Dps Before Healer is ', p1, null); // true/false
    });
	
	command.add('ppdps', (p1)=> {
		toggleOnOfSetting("plaguePrioDpsBeforeHealer", 'Plague Dps Before Healer is ', p1, null);
    });
	
	command.add('targetboss', (p1)=> {
		toggleOnOfSetting("targetBoss", 'Targeting Boss is ', p1, null);
    });
	
	command.add('targetbossfirst', (p1)=> {
		toggleOnOfSetting("targetBossFirst", 'Targeting Boss First is ', p1, null);
    });
	
	command.add('splitcc', (p1)=> {
		toggleOnOfSetting("splitSleep", 'Split Sleep/Fear/Gyre is ', p1, null);
    });
	
	
	function toggleClass(variableNameAddition, argument, skillP){
		if(!argument){
            command.message(argument +' is an invalid argument');
			return;
		}
		argument = argument.toLowerCase();
		let thingToToggle = variableNameAddition + argument;
		switch(argument){
			case "healer":
			case "archer":
			case "zerk":
			case "lancer":
			case "slayer":
			case "sorc":
			case "warrior":
			case "reaper":
			case "gunner":
			case "brawler":
			case "ninja":
			case "valk":
				mod.settings[thingToToggle] = !mod.settings[thingToToggle];
				mod.saveSettings();
				command.message(skillP + ' Priority ' + argument + ' = ' + (mod.settings[thingToToggle] ? 'enabled' : 'disabled'));
				break;
			default:
				command.message(argument +' is an invalid argument');
				break;
		}
	}
	
	command.add('sleepa', (p1)=> {
        toggleClass("", p1, "Sleep");
    });
	command.add('plague', (p1)=> {
        toggleClass("p", p1, "Plague");
    });
	
	
	
	function priorityNameList(whatList, argument, add){
		if(add && mod.settings[whatList].indexOf(argument) == -1){ // if not in list
			mod.settings[whatList].push(argument); // add to list
		} else if(!add && mod.settings[whatList].indexOf(argument) > -1){ // if in list
			mod.settings[whatList].splice(mod.settings[whatList].indexOf(argument), 1); // remove from list
		}
		mod.saveSettings();
		printBigInt(mod.settings[whatList], false);
	} // TODO: Double Check this
	
	
    command.add('sleepy', (p1) => {
		if(p1 && !mod.settings.sleepyPlayers.includes(p1)) // if not in list
			mod.settings.sleepyPlayers.push(p1); // add to list
		printBigInt(mod.settings.sleepyPlayers, false);
    });
	command.add('dmgadd', (p1) => {
		if(p1 && !mod.settings.freeStars.includes(p1)) // if not in list
			mod.settings.freeStars.push(p1); // add to list
		printBigInt(mod.settings.freeStars, false);
    });
	command.add('pp', (p1) => {
		priorityNameList("plaguePrio", p1, true);
		//if(p1 && !mod.settings.plaguePrio.includes(p1)) // if not in list
		//	mod.settings.plaguePrio.push(p1); // add to list
		//printBigInt(mod.settings.plaguePrio, false);
    });
	command.add('bl', (p1) => {
		if(p1 && !mod.settings.blockList.includes(p1)) // if not in list
			mod.settings.blockList.push(p1); // add to list
		printBigInt(mod.settings.blockList, false);
    });
	command.add('dd', (p1) => {
		if(p1 && !mod.settings.dontDamage.includes(p1)) // if not in list
			mod.settings.dontDamage.push(p1); // add to list
		printBigInt(mod.settings.dontDamage, false);
    });
	command.add('dh', (p1) => {
		if(p1 && !mod.settings.dontHeal.includes(p1)) // if not in list
			mod.settings.dontHeal.push(p1); // add to list
		printBigInt(mod.settings.dontHeal, false);
    });
	
	command.add('sleepyr', (p1) => {
		let index = mod.settings.sleepyPlayers.indexOf(p1);
		if(index > -1) // if in list
			mod.settings.sleepyPlayers.splice(index, 1); // remove from list
		printBigInt(mod.settings.sleepyPlayers, false);
    });
	command.add('dmgr', (p1) => {
		let index = mod.settings.freeStars.indexOf(p1);
		if(index > -1) // if in list
			mod.settings.freeStars.splice(index, 1); // remove from list
		printBigInt(mod.settings.freeStars, false);
    });
	command.add('ppr', (p1) => {
		priorityNameList("plaguePrio", p1, false);
		//let index = mod.settings.plaguePrio.indexOf(p1);
		//if(index > -1) // if in list
		//	mod.settings.plaguePrio.splice(index, 1); // remove from list
		//printBigInt(mod.settings.plaguePrio, false);
    }); // TODO: Double Check this
	command.add('blr', (p1) => {
		let index = mod.settings.blockList.indexOf(p1);
		if(index > -1) // if in list
			mod.settings.blockList.splice(index, 1); // remove from list
		printBigInt(mod.settings.blockList, false);
    });
	command.add('ddr', (p1) => {
		let index = mod.settings.dontDamage.indexOf(p1);
		if(index > -1) // if in list
			mod.settings.dontDamage.splice(index, 1); // remove from list
		printBigInt(mod.settings.dontDamage, false);
    });
	command.add('dhr', (p1) => {
		let index = mod.settings.dontHeal.indexOf(p1);
		if(index > -1) // if in list
			mod.settings.dontHeal.splice(index, 1); // remove from list
		printBigInt(mod.settings.dontHeal, false);
    });
	
	
    command.add('tp', () => {
        sortHp();
		printBigInt(partyMembers, true);
    });
	command.add('tb', () => {
        sortDistBoss();
		printBigInt(bossInfo, true);
    });
	command.add('te', () => {
		sortDistEnemies();
		printBigInt(enemies, true);
    });
	command.add('cp', () => {
        partyMembers = [];
		printBigInt(partyMembers, true);
    });
	command.add('cb', () => {
        bossInfo = [];
		printBigInt(bossInfo, true);
    });
	command.add('ce', () => {
        enemies = [];
		printBigInt(enemies, true);
    });
	
	command.add('ml', () => {
		console.log("My Location");
		printBigInt(playerLocation, true);
    });
	
	
	
    mod.hook('S_LOGIN', 12, (event) => {
        playerId = event.playerId;
        gameId = event.gameId;
        job = (event.templateId - 10101) % 100;
        enabled = (mod.settings.Skills[job]) ? true : false;
		enemies = [];
    });
	
    mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
		let addedMember = (event.members.length -1 > partyMembers.length) ? true : false;
		
        // refresh locations of existing party members.
        for (let i = 0; i < event.members.length; i++) {
            for (let j = 0; j < partyMembers.length; j++) {
                if(partyMembers[j] && event.members[i].gameId == partyMembers[j].gameId) {
					event.members[i].loc = partyMembers[j].loc;
					event.members[i].hpP = partyMembers[j].hpP;
					break;
                }
            }
        }
        partyMembers = event.members;
        // remove self from targets
        for (let i = 0; i < partyMembers.length; i++) {
            if(partyMembers[i].gameId == gameId){
                partyMembers.splice(i, 1);
				break;
			}
		}
		// remove party members from enemies list
		if(addedMember){
			for (let j = 0; j < partyMembers.length; j++){
				for (let k = 0; k < enemies.length; k++){
					if(enemies[k].gameId == partyMembers[j].gameId){
						enemies.splice(k, 1);
						break;
					}
				}
			}
		}
    });
	
	mod.hook('S_LOAD_TOPO', 3, (event) => {
        bossInfo = [];
		enemies = [];
    });
    
    mod.hook('S_LEAVE_PARTY', 1, (event) => {
        partyMembers = [];
		bossInfo = [];
		enemies = [];
    });
    
    mod.hook('C_PLAYER_LOCATION', 5, (event) => {
        playerLocation = event;
    });
    
    mod.hook('S_SPAWN_ME', 3, (event) => {
        playerLocation.gameId = event.gameId;
        playerLocation.loc = event.loc;
        playerLocation.w = event.w;
        bossInfo = [];
		enemies = [];
    });
    
	/*
    class index
    warrior = 0, lancer = 1, slayer = 2, berserker = 3,
    sorcerer = 4, archer = 5, priest = 6, mystic = 7,
    reaper = 8, gunner = 9, brawler = 10, ninja = 11,
    valkyrie = 12
    */
	
	
	function addEnemy(egameid, eloc, ew, ealive, edist, ejob, ename, eclassbuffed, estunimmune){
		let tempPushEvent = { // if new enemy, add them
			gameId: egameid,
			loc: eloc,
			w: ew,
			alive: ealive,
			dist: edist,
			job: ejob,
			name: ename,
			classBufffed: eclassbuffed,
			stunImmune: estunimmune
		}
		enemies.push(tempPushEvent);
	}
	
	
    mod.hook('S_SPAWN_USER', 13, (event) => {
        if(partyMembers.length != 0){
            for (let i = 0; i < partyMembers.length; i++){
                if(partyMembers[i].gameId == event.gameId){
                    partyMembers[i].loc = event.loc;
                    partyMembers[i].hpP = (event.alive ? 100 : 0);
                    return;
                }
            }
		}
		
		let theirClass = (event.templateId - 10101) % 100;
		for (let i = 0; i < enemies.length; i++){
			if(enemies[i].gameId == event.gameId){ // if enemy, update them
				enemies[i].loc = event.loc;
				enemies[i].alive = event.alive;
				enemies[i].job = theirClass;
				enemies[i].name = event.name;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, event.alive, Number(99999999), theirClass, event.name, false, false);
		return;
    });
    
    mod.hook('S_USER_LOCATION', 5, (event) => {
        for (let i = 0; i < partyMembers.length; i++) {
            if(partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if(enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].alive = true;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, true, Number(99999999), null, "", false, false);
		return;
    });
    
    mod.hook('S_USER_LOCATION_IN_ACTION', 2, (event) => {
        for (let i = 0; i < partyMembers.length; i++) {
            if(partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if(enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].w = event.w;
				enemies[i].alive = true;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, true, Number(99999999), null, "", false, false);
		return;
    });
    
    mod.hook('S_INSTANT_DASH', 3, (event) => {
        for (let i = 0; i < partyMembers.length; i++) {
            if(partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if(enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].w = event.w;
				enemies[i].alive = true;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, true, Number(99999999), null, "", false, false);
		return;
    });
    
    mod.hook('S_PARTY_MEMBER_CHANGE_HP', 4, (event) => {
        if(playerId == event.playerId) return; // if me, return
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].playerId === event.playerId) {
				let theirHP = (Number(event.curHp) / Number(event.maxHp)) * 100;
				if(theirHP != null && theirHP <= 100) partyMembers[i].hpP = theirHP;
                return;
            }
        }
    });
    
	
    mod.hook('S_PARTY_MEMBER_STAT_UPDATE', 3, (event) => {
        if(playerId == event.playerId) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if(partyMembers[i].playerId === event.playerId) {
				let theirHP = (Number(event.curHp) / Number(event.maxHp)) * 100;
				if(theirHP != null && theirHP <= 100) partyMembers[i].hpP = theirHP;
                return;
            }
        }
    });
	
    mod.hook('S_DEAD_LOCATION', 2, (event) => {
        for (let i = 0; i < partyMembers.length; i++) {
            if(partyMembers[i].gameId == (event.gameId)) {
                partyMembers[i].loc = event.loc;
                partyMembers[i].hpP = 0;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if(enemies[i].gameId == (event.gameId)) {
				enemies[i].loc = event.loc;
				enemies[i].alive = false;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, false, Number(99999999), null, "", false, false);
		return;
    })
	
	
	// from https://github.com/teralove/make-valk-rag-obvious
	mod.hook('S_ABNORMALITY_BEGIN', 3, event => { // ADD TOGGLE FOR THIS
        if(event.id == RagnarokId) {
			if(buffPartyMemberGrow){
				for (let i = 0; i < partyMembers.length; i++) {
					if(partyMembers[i].gameId == (event.target)) {
						applyChange(event.target, GROW_ID);
					}
				}
			}
			if(buffGrow){
				for (let i = 0; i < enemies.length; i++) {
					if(enemies[i].gameId == (event.target)) {
						applyChange(event.target, GROW_ID);
					}
				}
			}
        }
    });

    mod.hook('S_ABNORMALITY_END', 1, event => {
        if(event.id == RagnarokId){
            removeChange(event.target, GROW_ID);
        }
    });

    function applyChange(target, id){
        mod.toClient('S_ABNORMALITY_END', 1, {
			target: target,
			id: id,
		});	
        mod.toClient('S_ABNORMALITY_BEGIN', 3, {
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
        mod.toClient('S_ABNORMALITY_BEGIN', 3, {
			target: target,
			source: target,                      
			id: id,				//Sometimes abnormality disappears and needs to be restored before removing.
			duration: duration,	//This makes sure u can restore your appearance and no abnormality icon is left in your buff bar.
			unk: 0,
			stacks: stack,
			unk2: 0,
		});
        mod.toClient('S_ABNORMALITY_END', 1, {
			target: target,
			id: id,
		});	
	}
	
	
    
    mod.hook('S_LEAVE_PARTY_MEMBER', 2, (event) => {
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].playerId === event.playerId){
                partyMembers.splice(i, 1);
                return;
            }
        }
    });
     
    mod.hook('S_LOGOUT_PARTY_MEMBER', 1, (event) => {
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].playerId === event.playerId){
                partyMembers[i].online = false;
                return;
            }
        }
    });
    
    mod.hook('S_BAN_PARTY_MEMBER', 1, (event) => {
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].playerId === event.playerId){
                partyMembers.splice(i, 1);
                return;
            }
        }
    });    
    
	
	mod.hook('S_BOSS_GAGE_INFO', 3, { order: -10 }, (event) => {
        let alreadyHaveBoss = false; // TODO make the boss get removed if the boss resets
        let tempPushEvent = {
            id: event.id,
            loc: {
				"x": 0,
				"y": 0,
				"z": 0
			},
            hp: (Number(event.curHp) / Number(event.maxHp) * 100),
            dist: 100
        }
        if(bossInfo.length <= 0){
            bossInfo.push(tempPushEvent);
        } else{
            for (let b = 0; b < bossInfo.length; b++){
                if(bossInfo[b].id == event.id){
                    bossInfo[b].hp = (Number(event.curHp) / Number(event.maxHp) * 100);
                    alreadyHaveBoss = true;
                    if(event.curHp <= 0){ // remove dead boss
                        bossInfo = bossInfo.filter(function (p) {
							return (p.id == event.id) ? false : true;
                        });
                    }
                    break;
                }
            }
            if(alreadyHaveBoss == false) bossInfo.push(tempPushEvent);
        }

    });
	
    mod.hook('S_ACTION_STAGE', 9, { order: -10 }, (event) => {
		for (let b = 0; b < bossInfo.length; b++){
			if(event.gameId == (bossInfo[b].id)){
				bossInfo[b].loc = event.loc;
				break;
			}
		}
		
		for (let b = 0; b < enemies.length; b++){
			if(event.gameId == (enemies[b].id)){
				enemies[b].loc = event.loc;
				enemies[b].w = event.w;
				break;
			}
		}
    });
	
	
	function getNumTargets(job, skill){ // update this, change based upon "splitsleep" 
		let numTargets = mod.settings.Skills[job][skill].maxTargetCount;
		if(mod.settings.splitSleep && (skill == 25 || skill == 28 || skill == 31)) return 1;
		return numTargets;
    }
	
	mod.hook('C_START_SKILL', 7, (event) => {
        if(!enabled || !mod.settings.enabled) return;
        if(event.skill.id / 10 & 1 != 0) { // is casting (opposed to locking on)
            playerLocation.w = event.w;
            return; 
        }
        let skill = Math.floor(event.skill.id / 10000);
		
        if(mod.settings.Skills[job] && mod.settings.Skills[job][skill]){ // if it's a skill that we handle 
			if(mod.settings.Skills[job][skill].type == "heal" && (partyMembers.length == 0 || !mod.settings.autoHeal)) return; // be enabled in a party for heals
            if(mod.settings.Skills[job][skill].type == "cleanse" && (!mod.settings.autoCleanse || partyMembers.length > 4 || partyMembers.length < 1)) return; // be enabled in a party(not a raid) for cleanse
            if(mod.settings.disableSleep && (skill == 33 || skill == 28)) return; // sleep disabled
			
			sortAllTargets();
            let maxTargetCount = getNumTargets(job, skill);
            let targetMembers = [];
			let targetArrayLength = 0;
			let bossLength = 0;
			let healing = false;
			let prioArrayToCheck = (mod.settings.Skills[job][skill].type == "damage") ? mod.settings.plaguePrio : (mod.settings.Skills[job][skill].type == "debuff") ? mod.settings.sleepyPlayers : []; // Test this

			if(mod.settings.Skills[job][skill].type == "heal" || mod.settings.Skills[job][skill].type == "cleanse"){
				targetArrayLength = partyMembers.length;
				healing = true; // target party members
			} else{
				targetArrayLength = enemies.length;
			}
			
			// add targets
			for (let k = 0; k < mod.settings.Skills[job][skill].targets.length; k++){ // go through all target arrays //  FIX/ADD SOME
				if(targetMembers.length == maxTargetCount) break;
				
				if(mod.settings.Skills[job][skill].targets[k] == "boss" && mod.settings.targetBoss){ // boss, and boss targeting is enabled
					for (let j = 0; j < bossInfo.length; j++){ // queue ppl to lock on to
						if(bossInfo[j].dist <= mod.settings.Skills[job][skill].distance){ // in range
							targetMembers.push(bossInfo[j]);
							break;
						}
					}
					break;
				}
				for (let i = 0; i < targetArrayLength; i++){ // go through current array
					if(targetMembers.length == maxTargetCount) break;
					if(healing && partyMembers[i].online &&  // heal/cleanse online 
					partyMembers[i].hpP && ((skill == 9) ? true : partyMembers[i].hpP <= mod.settings.hpCutoff) && // check (hp < hpCutoff) if not cleanse
					partyMembers[i].loc && (partyMembers[i].loc.dist3D(playerLocation.loc) / 25) <= mod.settings.Skills[job][skill].distance && // in range
					!mod.settings.dontHeal[partyMembers[i].name]){ // not on the don't heal list 
						printBigInt("added heal target", false);
						targetMembers.push(partyMembers[i]);
						break;
						
					} else if(!healing){ // attack
						if(mod.settings.Skills[job][skill].targets[k] == "enemyBuff" || mod.settings.Skills[job][skill].targets[k] == "enemyHealer" ||
						mod.settings.Skills[job][skill].targets[k] == "enemyDps" || mod.settings.Skills[job][skill].targets[k] == "enemy" ){
							if(enemies[i].alive){
								if(!mod.settings.blockList[enemies[i].name]){ // enemey, alive, not blocked
									command.message("enemies check 2 passed");
									if(enemies[i].dist <= mod.settings.Skills[job][skill].distance){ // in range
										printBigInt("enemies check 3 passed", true);
										if(prioArrayToCheck.length != 0){
											let addedTarget = false;
											for (let j = 0; j < prioArrayToCheck.length; j++){ // queue ppl to lock on to
												if(enemies[i].name == prioArrayToCheck[j].name){ // matching name
													targetMembers.push(enemies[i]);
													addedTarget = true;
													break;
												}
											}
											if(addedTarget) break;
										} 
										if(mod.settings.Skills[job][skill].targets[k] == "enemyHealer" && (enemies[i].job == 6 || enemies[i].job == 7)){ // targeting healer
											targetMembers.push(enemies[i]);
											printBigInt("added enemyHealer target", true);
										} else if(mod.settings.Skills[job][skill].targets[k] == "enemyDps" && (enemies[i].job != 6 && enemies[i].job != 7)){ // targeting dps
											targetMembers.push(enemies[i]);
											printBigInt("added enemyDps target", true);
										} else if(mod.settings.Skills[job][skill].targets[k] == "enemy"){ // no priority target found, look for anyone
											targetMembers.push(enemies[i]);
											printBigInt("added enemy target", true);
										}
										
									}
								}
							}
						}
					}
				}
				
			}
			
			let autoCasting = (mod.settings.Skills[job][skill].autoCast) ? true : false;
			lockonAndComplete(event, targetMembers, autoCasting);
		}
	});
	
	function lockonAndComplete(event, targetMembers, autoComplete){
		if(true) printBigInt(targetMembers, true);
		if(targetMembers.length > 0){
			for (let target of targetMembers){
				setTimeout(() => {
					if(!target.id) mod.toServer('C_CAN_LOCKON_TARGET', 3, {target: Number(target.gameId), skill: event.skill.id}); // player
					else mod.toServer('C_CAN_LOCKON_TARGET', 3, {target: Number(target.id), skill: event.skill.id}); // bam
				}, mod.settings.lockonDelay);
			}
			
			if(autoComplete){
				setTimeout(() => {
					mod.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
				}, mod.settings.autoDpsDelay);
			}
		}
	}
	
	
	function sortHp() {
        partyMembers.sort(function (a, b) {
            return Number(a.hpP) - Number(b.hpP);
        });
    }
	function sortDistBoss(){
		for (let i = 0; i < bossInfo.length; i++){ // calculate distance
			bossInfo[i].dist = bossInfo[i].loc.dist3D(playerLocation.loc) / 25;
		}
        bossInfo.sort(function (a, b) {
            return Number(a.dist) - Number(b.dist);
        });
    }
	function sortDistEnemies(){
		for (let i = 0; i < enemies.length; i++){ // calculate distance
			enemies[i].dist = enemies[i].loc.dist3D(playerLocation.loc) / 25;
		}
		enemies.sort(function (a, b) {
			return Number(a.dist) - Number(b.dist);
		});
	}
	function sortAllTargets(){
		if(partyMembers.length > 0) sortHp();
		if(bossInfo.length > 0) sortDistBoss();
		if(enemies.length > 0) sortDistEnemies();
	}
}