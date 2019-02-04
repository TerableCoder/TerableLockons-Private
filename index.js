module.exports = function TerableLockons(mod){
	const command = mod.command || mod.require.command;
	
	if(mod.proxyAuthor !== 'caali'){
		const options = require('./module').options
		if(options){
			const settingsVersion = options.settingsVersion
			if(settingsVersion){
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
        glyphs = null,
		bossInfo = [],
		npcInfo = [],
		enemies = [];
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
	
	maybe add another thing for GS/Tenacity/Mocking Shout (different color changing debuff for stun, stagger kaias, stagger unbreakable, and both)
    */
    
    //Class#: warrior = 0, lancer = 1, slayer = 2, berserker = 3, sorcerer = 4, archer = 5,
    //priest = 6, mystic = 7, reaper = 8, gunner = 9, brawler = 10, ninja = 11, valkyrie = 12
    
	function loopBigIntToString(obj){ // from PacketsLogger
		Object.keys(obj).forEach(key => {
			if(obj[key] && typeof obj[key] === 'object') loopBigIntToString(obj[key]);
			else if(typeof obj[key] === "bigint") obj[key] = obj[key].toString();
		});
	}
	function printBigInt(whatList, printInGame){ // WARNING: DON'T USE THIS FUNCTION BEFORE SENDING A BIGINT TO THE SERVER OR YOU WILL CRASH FROM IT NO LONGER BEING A BIG INT
		loopBigIntToString(whatList);
		console.log(JSON.stringify(whatList, null, 4));
		if(printInGame) command.message(JSON.stringify(whatList, null, 4));
	}
	
	function toggleOnOfSetting(variableToToggle, commandMessage, argument, whatNumber){
		if(!argument){
			mod.settings[variableToToggle] = !mod.settings[variableToToggle];
			mod.saveSettings();
			command.message(commandMessage + (mod.settings[variableToToggle] ? 'enabled' : 'disabled'));
			return;
        }
		let isNumber = !isNaN(argument);
		let tempNum = argument;
		argument = argument.toLowerCase();
		if(argument === 'off'){
            mod.settings[variableToToggle] = false;
        } else if(argument === 'on'){
            mod.settings[variableToToggle] = true;
        } else if(isNumber && whatNumber){ // change hp cutoff
			mod.settings[variableToToggle] = true;
            mod.settings[whatNumber] = (tempNum < 0 ? 0 : tempNum > 100 ? 100 : tempNum);
        } else{
            command.message(argument + ' is an invalid argument');
            return;
        }
		mod.saveSettings();
		if(whatNumber) command.message(commandMessage + (mod.settings[variableToToggle] ? 'enabled (' + mod.settings[whatNumber] + '%)' : 'disabled'));
        else command.message(commandMessage + (mod.settings[variableToToggle] ? 'enabled' : 'disabled'));
	}
	
	command.add(['cs', 'changeskill'], (p1, p2, p3, p4) => {
    	if(typeof p1 === 'string' || p1 instanceof String){
			p1 = p1.replace("_", " "); // replace _ with space
			p1.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); // capitalize first letter of each word
			//var splitStr = p1.toLowerCase().split(' '); // capitalize first letter of each word
			//for (var i = 0; i < splitStr.length; i++) {
			//   splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
			//}
			//p1 = splitStr.join(' '); 
			let foundSkill = mod.settings.Skills[job].find(p => p.name == p1);
			//mod.settings.Skills[job][skill].type 
			console.log(`p1 = ${p1}, p2 = ${p2}, p3 = ${p3}, p4 = ${p4}`);
			console.log(foundSkill);
            if(foundSkill){
				if(p2){
					p2.toLowerCase();
				} else {
					command.message("Missing 2nd argument");
					changeSkillHelp();
					return;
				}
				switch(p2){
					case "targets":
						let add = false;
						let remove = false;
						if(p3 == "add"){
							add = true;
						} else if(p3 == "remove"){
							remove = true;
						} else{
							command.message("Missing 3rd argument");
							changeSkillHelp();
							return;
						}
						let argIndex;
						switch(p4){
							case "enemyBuff":
							case "enemyHealer":
							case "enemyDps":
							case "enemy":
							case "boss":
							case "npc":
								if(foundSkill.type == "heal" || foundSkill.type == "cleanse"){
									command.message("You can only target heal with heals, and cleanse with cleanse");
									return;
								}
								argIndex = foundSkill.targets.indexOf(p4);
								if(add && argIndex == -1) foundSkill.targets.push(p4);
								else if(remove && argIndex > -1) foundSkill.targets.splice(argIndex, 1);
								break;
							case "heal":
							case "cleanse":
								if(foundSkill.type != p4){
									command.message("You can only target heal with heals, and cleanse with cleanse");
									return;
								}
								argIndex = foundSkill.targets.indexOf(p4);
								if(add && argIndex == -1) foundSkill.targets.push(p4);
								else if(remove && argIndex > -1) foundSkill.targets.splice(argIndex, 1);
								break;
							default:
								command.message("Missing 4th argument");
								changeSkillHelp();
								return;
						}
						break;
					case "distance":
						if(isNaN(p3)) command.message("Distance must be a number");
						else foundSkill.distance = p3.toString();
						break;
					case "maxtargetcount":
						if(isNaN(p3)) command.message("maxTargetCount must be a number");
						else if(p3 > -1) foundSkill.maxTargetCount = p3.toString();
						break;
					case "lockondelay":
						if(isNaN(p3)) command.message("lockonDelay must be a number");
						else if(p3 > -1) foundSkill.lockonDelay = p3.toString();
						break;
					case "autocastdelay":
						if(isNaN(p3)) command.message("autoCastDelay must be a number");
						else if(p3 > -1) foundSkill.autoCastDelay = p3.toString();
						break;
					case "autocast":
						switch(p4){
							case "on":
							case "true":
								foundSkill.autoCast = true;
								break;
							case "off":
							case "false":
								foundSkill.autoCast = false;
								break;
							default:
								foundSkill.autoCast = !foundSkill.autoCast;
								break;
						}
					default:
						command.message("2nd argument is invalid");
						changeSkillHelp();
						return;
				}
				mod.saveSettings();
			} else{
				command.message("Couldn't find skill named " + p1);
				changeSkillHelp();
			}				
		}
    });
	
	function changeSkillHelp(){
		command.message("The command changeskill format is:");
		command.message("changeskill skill_name targets add/remove atarget");
		command.message("changeskill skill_name distance thedistance");
		command.message("changeskill skill_name maxtargetcount numtargets");
		command.message("changeskill skill_name lockondelay delay");
		command.message("changeskill skill_name autocastdelay delay");
		command.message("changeskill skill_name autocast [on/off/true/false]");
	}
	
	
	command.add(['teral', 'tlockons', 'teralockons', 'terablelockons'], (p1, p2)=> {
		if(p1 == "reload"){
			/*if(mod.proxyAuthor !== 'caali'){
				const options = require('./module').options
				if(options){
					const settingsVersion = options.settingsVersion
					if(settingsVersion){
						mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
						mod.settings._version = settingsVersion
					}
				}
			} else{*/
				console.log("~~~Before~~~");
				console.log(mod.settings);
				mod.settings = require('./config.json'); // idk if this works
				console.log("~~~Midway~~~");
				console.log(mod.settings);
				mod.settings = mod.settings.data;
				console.log("~~~After~~~");
				console.log(mod.settings);
			//}
		} else if(p1 == "help"){
			if(p2){
				switch(p2){
					case "heal":
						command.message("heal, cleanse, healcast, cleansecast, targetparty, dh (name), dhr (name)");
						return;
					case "attack":
						command.message("attack, attackcast, targetboss, targetnpc, targetenemy, pp(name), ppr (name), bl (name), blr (name)");
						return;
					case "debuff":
						command.message("debuff, debuffcast, targetboss, targetnpc, targetenemy, sleepy (name), sleepyr (name), bl (name), blr (name)");
						return;
					case "other":
						command.message("teral, teral reload, disablesleep, splitcc, findmob, castdelay (delay), lockondelay (delay)");
						command.message("cs skill_name targets add/remove thetarget, cs skill_name variable value");
						command.message("ml, tparty, cparty, tnpc, cnpc, tb, cb, te, ce");
						return;
					case "all":
						command.message("heal, cleanse, healcast, cleansecast, targetparty, dh (name), dhr (name)");
						command.message("attack, attackcast, targetboss, targetnpc, targetenemy, pp(name), ppr (name), bl (name), blr (name)");
						command.message("debuff, debuffcast, targetboss, targetnpc, targetenemy, sleepy (name), sleepyr (name), bl (name), blr (name)");
						command.message("teral, teral reload, disablesleep, splitcc, findmob, castdelay (delay), lockondelay (delay)");
						command.message("cs skill_name targets add/remove thetarget, cs skill_name variable value");
						command.message("ml, tparty, cparty, tnpc, cnpc, tb, cb, te, ce");
						return;
					default: // VVV print out help directory VVV
				}
			}
			command.message("teral help heal");
			command.message("teral help attack");
			command.message("teral help debuff");
			command.message("teral help other");
			command.message("teral help all");
		} else toggleOnOfSetting("enabled", 'TerableLockons is ', p1, null);
	});
	
    command.add('heal', (p1)=> {
		toggleOnOfSetting("autoHeal", 'Healing is ', p1, "hpCutoff");
    });
    command.add('cleanse', (p1) => {
		toggleOnOfSetting("autoCleanse", 'Cleansing is ', p1, null);
    });
	command.add('attack', (p1)=> {
		toggleOnOfSetting("autoAttack", 'Attack lockons are ', p1, null);
    });
    command.add('debuff', (p1) => {
		toggleOnOfSetting("autoDebuff", 'Debuff lockons are ', p1, null);
    });
	
	command.add('healcast', (p1)=> {
		toggleOnOfSetting("healCast", 'Healing completion is ', p1, "hpCutoff");
    });
    command.add('cleansecast', (p1) => {
		toggleOnOfSetting("cleanseCast", 'Cleansing completion is ', p1, null);
    });
	command.add('attackcast', (p1)=> {
		toggleOnOfSetting("attackCast", 'Attack lockons completion is ', p1, null);
    });
    command.add('debuffcast', (p1) => {
		toggleOnOfSetting("debuffCast", 'Debuff lockons completion is ', p1, null);
    });
	
	command.add('targetparty', (p1)=> {
		toggleOnOfSetting("targetParty", 'Targeting Party is ', p1, null);
    });
	command.add('targetboss', (p1)=> {
		toggleOnOfSetting("targetBoss", 'Targeting Boss is ', p1, null);
    });
    command.add('targetnpc', (p1)=> {
        toggleOnOfSetting("targetNpc", 'Targeting Npc is ', p1, null);
    });
	command.add('targetEnemy', (p1)=> {
		toggleOnOfSetting("targetEnemy", 'Targeting Enemy is ', p1, null);
    });
	
	command.add('disablesleep', (p1)=> {
		toggleOnOfSetting("disableSleep", 'DisableSleep Casting is ', p1, null);
    });
	command.add('splitcc', (p1)=> {
		toggleOnOfSetting("splitSleep", 'Split Sleep/Fear/Gyre is ', p1, null);
    });
	command.add('eth', (p1)=> {
		toggleOnOfSetting("ethics", 'Ethics is ', p1, null);
    });
	
	command.add('findmob', (p1)=> {
		toggleOnOfSetting("findMob", 'Find Mob is ', p1, null);
    });
	
	
	command.add('castdelay', (p1)=> {
		let delay = Number(p1);
        if(isNaN(delay) || delay < 0){
            command.message(p1 +' is an invalid argument');
            return;
        }
		mod.settings.autoDpsDelay = delay;
		mod.saveSettings();
        command.message('Casting Delay = ' + mod.settings.autoDpsDelay);
    });
	command.add('lockondelay', (p1)=> {
		let delay = Number(p1);
        if(isNaN(delay) || delay < 0){
            command.message(p1 +' is an invalid argument');
            return;
        }
		mod.settings.lockonDelay = delay;
		mod.saveSettings();
        command.message('Lockon Delay =  ' + mod.settings.lockonDelay);
    });
	
	
	function priorityNameList(whatList, argument, add){
		if(argument){ 
			argument = argument.toLowerCase();
			let argumentIndex = mod.settings[whatList].indexOf(argument);
			if(add && argumentIndex == -1) mod.settings[whatList].push(argument); // if not in list, add to list
			else if(!add && argumentIndex > -1) mod.settings[whatList].splice(argumentIndex, 1); // if in list, remove from list
			mod.saveSettings();
		}
		printBigInt(mod.settings[whatList], true);
	}
	
    command.add('sleepy', (p1) => {
		priorityNameList("sleepyPlayers", p1, true);
    });
	command.add('pp', (p1) => {
		priorityNameList("plaguePrio", p1, true);
    });
	command.add('bl', (p1) => {
		priorityNameList("blockList", p1, true);
    });
	command.add('dh', (p1) => {
		priorityNameList("dontHeal", p1, true);
    });
	
	command.add('sleepyr', (p1) => {
		priorityNameList("sleepyPlayers", p1, false);
    });
	command.add('ppr', (p1) => {
		priorityNameList("plaguePrio", p1, false);
    });
	command.add('blr', (p1) => {
		priorityNameList("blockList", p1, false);
    });
	command.add('dhr', (p1) => {
		priorityNameList("dontHeal", p1, false);
    });
	
	
	command.add('tparty', () => {
        sortHp();
		printBigInt(partyMembers, true);
		partyMembers = [];
    });
	command.add('tb', () => {
        sortDistBoss();
		printBigInt(bossInfo, true);
		bossInfo = [];
    });
	command.add('tnpc', () => {
        sortDistNpc();
		printBigInt(npcInfo, true);
		npcInfo = [];
    });
	command.add('te', () => {
		sortDistEnemies();
		printBigInt(enemies, true);
		enemies = [];
    });
	command.add('cparty', () => { // no cp here!
        partyMembers = [];
		printBigInt(partyMembers, true);
    });
	command.add('cb', () => {
        bossInfo = [];
		printBigInt(bossInfo, true);
    });
	command.add('cnpc', () => {
        npcInfo = [];
		printBigInt(npcInfo, true);
    });
	command.add('ce', () => {
        enemies = [];
		printBigInt(enemies, true);
    });
	
	command.add('ml', () => {
		console.log("My Location");
		printBigInt(playerLocation.loc, true);
    });
	
	
    mod.hook('S_LOGIN', 12, (event) => {
        playerId = event.playerId;
        gameId = event.gameId;
        job = (event.templateId - 10101) % 100;
        enabled = (mod.settings.Skills[job]) ? true : false;
		enemies = [];
		bossInfo = [];
		npcInfo = [];
    });
	
    mod.hook('S_PARTY_MEMBER_LIST', 7, (event) => {
		let addedMember = (event.members.length -1 > partyMembers.length) ? true : false;
        // refresh locations of existing party members
        for (let i = 0; i < event.members.length; i++){
            for (let j = 0; j < partyMembers.length; j++){
                if(partyMembers[j] && event.members[i].gameId == partyMembers[j].gameId){
					event.members[i].loc = partyMembers[j].loc;
					event.members[i].hpP = partyMembers[j].hpP;
					break;
                }
            }
        }
        partyMembers = event.members;
        // remove self from targets
        for (let i = 0; i < partyMembers.length; i++){
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
		npcInfo = [];
		enemies = [];
    });
    
    mod.hook('S_LEAVE_PARTY', 1, (event) => {
        partyMembers = [];
		// TODO add party members to enemies, also add ppl to enemies if they drop
    });
    
    mod.hook('C_PLAYER_LOCATION', 5, (event) => {
        playerLocation = event;
    });
    
    mod.hook('S_SPAWN_ME', 3, (event) => {
        playerLocation.gameId = event.gameId;
        playerLocation.loc = event.loc;
        playerLocation.w = event.w;
        bossInfo = [];
		npcInfo = [];
		enemies = [];
    });
    
	
	function addEnemy(egameid, eloc, ew, ealive, edist, ejob, ename, eclassbuffed, estunimmune){
		let tempPushEvent = { // if new enemy, add them
			gameId: egameid,
			loc: eloc,
			w: ew,
			alive: ealive,
			dist: edist,
			job: ejob,
			name: ename.toLowerCase(),
			classBufffed: eclassbuffed,
			stunImmune: estunimmune
		}
		enemies.push(tempPushEvent);
	}
	
    mod.hook('S_SPAWN_USER', 14, (event) => {
		for (let i = 0; i < partyMembers.length; i++){
			if(partyMembers[i].gameId == event.gameId){
				partyMembers[i].serverId = event.serverId;
				partyMembers[i].playerId = event.playerId;
				partyMembers[i].loc = event.loc;
				partyMembers[i].hpP = (event.alive ? 100 : 0);
				return;
			}
		}
		
		let theirClass = (event.templateId - 10101) % 100;
		for (let i = 0; i < enemies.length; i++){
			if(enemies[i].gameId == event.gameId){ // if enemy, update them
				enemies[i].serverId = event.serverId;
				enemies[i].playerId = event.playerId;
				enemies[i].loc = event.loc;
				enemies[i].alive = event.alive;
				enemies[i].job = theirClass;
				enemies[i].name = event.name.toLowerCase();
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, event.alive, Number(99999999), theirClass, event.name, false, false);
		return;
    });
    
    mod.hook('S_USER_LOCATION', 5, (event) => {
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].gameId == (event.gameId)){
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++){
			if(enemies[i].gameId == (event.gameId)){
				enemies[i].loc = event.loc;
				enemies[i].alive = true;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, true, Number(99999999), null, "", false, false);
		return;
    });
    
    mod.hook('S_USER_LOCATION_IN_ACTION', 2, (event) => {
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].gameId == (event.gameId)){
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++){
			if(enemies[i].gameId == (event.gameId)){
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
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].gameId == (event.gameId)){
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++){
			if(enemies[i].gameId == (event.gameId)){
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
            if(partyMembers[i].playerId === event.playerId){
				let theirHP = (Number(event.curHp) / Number(event.maxHp)) * 100;
				if(theirHP != null && theirHP <= 100) partyMembers[i].hpP = theirHP;
                return;
            }
        }
    });
    
    mod.hook('S_PARTY_MEMBER_STAT_UPDATE', 3, (event) => {
        if(playerId == event.playerId) return; // if me, return 
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].playerId === event.playerId){
				let theirHP = (Number(event.curHp) / Number(event.maxHp)) * 100;
				if(theirHP != null && theirHP <= 100) partyMembers[i].hpP = theirHP;
                return;
            }
        }
    });
	
    mod.hook('S_DEAD_LOCATION', 2, (event) => {
        for (let i = 0; i < partyMembers.length; i++){
            if(partyMembers[i].gameId == (event.gameId)){
                partyMembers[i].loc.x = 0; // don't target the dead...
                partyMembers[i].loc.y = 0;
                partyMembers[i].loc.z = 0;
                //partyMembers[i].loc = event.loc;
                partyMembers[i].hpP = 0;
                return;
            }
        }
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++){
			if(enemies[i].gameId == (event.gameId)){
				enemies[i].loc.x = 0; // don't target the dead...
                enemies[i].loc.y = 0;
                enemies[i].loc.z = 0;
				//enemies[i].loc = event.loc;
				enemies[i].alive = false;
				return;
			}
		}
		addEnemy(event.gameId, event.loc, event.w, false, Number(99999999), null, "", false, false);
		return;
    })
	
	
	// from https://github.com/teralove/make-valk-rag-obvious
    mod.hook('S_ABNORMALITY_BEGIN', 3, event => { // ADD COMMAND TO TOGGLE THIS
        if(event.id != RagnarokId) return;
        if(buffPartyMemberGrow){
            for (let i = 0; i < partyMembers.length; i++){
                if(partyMembers[i].gameId == event.target) applyChange(event.target, GROW_ID);
            }
        } else if(buffGrow){
            for (let i = 0; i < enemies.length; i++){
                if(enemies[i].gameId == event.target) applyChange(event.target, GROW_ID);
            }
        }
    });
    mod.hook('S_ABNORMALITY_END', 1, event => {
        if(event.id == RagnarokId) removeChange(event.target, GROW_ID);
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
				addEnemy(event.gameId, partyMembers[i].loc, 0, false, Number(99999999), null, "", false, false); // add to enemies
                partyMembers.splice(i, 1); // remove from party
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
    
	mod.hook('S_SPAWN_NPC', 11, { order: -10 }, (event) => {
		if(event.villager) return;
        let tempPushEvent = {
            gameId: event.gameId,
            huntingZoneId: event.huntingZoneId,
            templateId: event.templateId,
			loc: event.loc,
            dist: 100
        }
		npcInfo.push(tempPushEvent);
    });
	mod.hook('S_DESPAWN_NPC', 3, { order: -10 }, (event) => {
		for (let b = 0; b < npcInfo.length; b++){
			if(npcInfo[b].gameId == event.gameId){
				if(mod.settings.findMob) printBigInt(npcInfo[b].huntingZoneId + "_" + npcInfo[b].templateId, true);
				// remove dead boss
				npcInfo = npcInfo.filter(function (p){
					return (p.gameId == event.gameId) ? false : true;
				});
				break;
			}
		}
    });
	mod.hook('S_NPC_LOCATION', 3, { order: -10 }, (event) => {
		for (let b = 0; b < npcInfo.length; b++){
			if(npcInfo[b].gameId == event.gameId){
				npcInfo[b].loc = event.loc;
				break;
			}
		}
    });
	
	
	mod.hook('S_BOSS_GAGE_INFO', 3, { order: -10 }, (event) => {
        let alreadyHaveBoss = false; // TODO make the boss get removed if the boss resets
        let tempPushEvent = {
            id: event.id,
            x: Number(99999999),
            y: Number(99999999),
            z: Number(99999999),
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
                        bossInfo = bossInfo.filter(function (p){
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
				bossInfo[b].x = event.loc.x;
				bossInfo[b].y = event.loc.y;
				bossInfo[b].z = event.loc.z;
				return;
			}
		}
		
		for (let b = 0; b < enemies.length; b++){
			if(event.gameId == (enemies[b].id)){
				enemies[b].loc = event.loc;
				enemies[b].w = event.w;
				return;
			}
		}
    });
	
	
	mod.hook('S_CREST_INFO', 2, (event) => {
        glyphs = event.crests;
    });
    mod.hook('S_CREST_APPLY', 2, (event) => {
		let glyph = glyphs.find(g => g.id == event.id);
        if(glyph) glyph.enable = event.enable;  
    });
    function getMaxTargets(skill){
        switch(skill){
            case 19: return isGlyphEnabled(28003) ? 4 : 2; // priest heal
            case 5: return isGlyphEnabled(27000) ? 4 : 2; // mystic heal
            case 9: return (isGlyphEnabled(27063) || isGlyphEnabled(27003)) ? 5 : 3; // cleanse
        }
        return 100; // return a big number
    }
    function isGlyphEnabled(glyphId){ // add arrow volley and flaming barrage glyphs maybe LOL?
        for (let i = 0; i < glyphs.length; i++){
            if(glyphs[i].id == glyphId && glyphs[i].enable)  return true;
        }
        return false;
    }
	
	function getNumTargets(job, skill){ // update this, change based upon "splitsleep" 
		let numTargets = mod.settings.Skills[job][skill].maxTargetCount;
		if(!mod.settings.splitSleep && (skill == 25 || skill == 28 || skill == 31)) return 1; // Time Gyre, Mystic Sleep, Mystic Fear
		return numTargets;
    }
	mod.hook('C_START_SKILL', 7, (event) => {
        if(!enabled || !mod.settings.enabled) return;
        if(event.skill.id / 10 & 1 != 0){ // is casting (opposed to locking on)
            playerLocation.w = event.w; // ^^^ checks second to last digit to see if casting or not
            return; 
        }
        let skill = Math.floor(event.skill.id / 10000);
		// Replace mod.settings.Skills[job][skill] with a variable 
        if(mod.settings.Skills[job] && mod.settings.Skills[job][skill]){ // if it's a skill that we handle 
			if(mod.settings.Skills[job][skill].type == "heal" && (!mod.settings.autoHeal || partyMembers.length == 0)) return; // be enabled in a party to heal
            if(mod.settings.Skills[job][skill].type == "cleanse" && (!mod.settings.autoCleanse || partyMembers.length > 4 || partyMembers.length < 1)) return; // be enabled in a party(not a raid) to cleanse 
			if(mod.settings.Skills[job][skill].type == "damage" && (!mod.settings.autoAttack)) return; // enabled
            if(mod.settings.Skills[job][skill].type == "debuff" && (!mod.settings.autoDebuff)) return; // enabled
            if(mod.settings.disableSleep && (skill == 33 || skill == 28)) return; // sleep disabled
			
			sortAllTargets(); // partyMembers + bossInfo + enemies
            let maxTargetCount = getNumTargets(job, skill);
            let maxTargets = getMaxTargets(skill);
			maxTargetCount = maxTargetCount < maxTargets ? maxTargetCount : maxTargets; // whichever is smaller
            let targetMembers = []; // who we lockon to 
			let targetArrayLength = 0; // partyMembers or enemies
			let healing = false;
			let checkedPriorityTargets = false;
			let checkedClassTargets = false;
			let prioArrayToCheck = (mod.settings.Skills[job][skill].type == "damage") ? mod.settings.plaguePrio : (mod.settings.Skills[job][skill].type == "debuff") ? mod.settings.sleepyPlayers : []; // get priority target list
			
			if(mod.settings.Skills[job][skill].type == "heal" || mod.settings.Skills[job][skill].type == "cleanse"){
				targetArrayLength = partyMembers.length;
				healing = true; // target party members
			} else{
				targetArrayLength = enemies.length;
			}
			// TODO: Deal with people who teleport out still getting targeted
			// TODO: Check if enemy.guild = myguild, then skip them
			// add targets
			for (let k = 0; k < mod.settings.Skills[job][skill].targets.length; k++){ // go through all target arrays
				if(targetMembers.length == maxTargetCount) break;
				
				if(mod.settings.Skills[job][skill].targets[k] == "boss"){ // boss, target boss
					if(healing || !mod.settings.targetBoss) continue;
					for (let j = 0; j < bossInfo.length; j++){ // queue bams to lock on to
						if(!(mod.settings.ethics && bossInfo[j].dist <= 20) && !(!mod.settings.ethics && bossInfo[j].dist <= mod.settings.Skills[job][skill].distance)) break;
						targetMembers.push(bossInfo[j]); // push if in range
						if(targetMembers.length == maxTargetCount) break;
					}
					continue;
				}
				if(mod.settings.Skills[job][skill].targets[k] == "npc"){ // npc, target npc
					if(healing || !mod.settings.targetNpc) continue;
                    for (let j = 0; j < npcInfo.length; j++){ // queue bams to lock on to
						if(!(mod.settings.ethics && npcInfo[j].dist <= 20) && !(!mod.settings.ethics && npcInfo[j].dist <= mod.settings.Skills[job][skill].distance)) break;
						if(mod.settings.huntingZoneId_templateId.indexOf(npcInfo[j].huntingZoneId + "_" + npcInfo[j].templateId) > -1) targetMembers.push(npcInfo[j]); // in config
						if(targetMembers.length == maxTargetCount) break;
                    }
                    continue;
                }
				for (let i = 0; i < targetArrayLength; i++){ // go through current array
					if(targetMembers.length == maxTargetCount) break;
					
					if(healing && mod.settings.targetParty){
						if(partyMembers[i].online &&  // heal/cleanse online 
						partyMembers[i].hpP && partyMembers[i].hpP != undefined && partyMembers[i].hpP != 0 &&
						((skill == 9) ? true : partyMembers[i].hpP <= mod.settings.hpCutoff) && // check (hp < hpCutoff) if not cleanse
						partyMembers[i].loc && partyMembers[i].loc != undefined && (Math.abs(partyMembers[i].loc.z - playerLocation.loc.z) / 25) <= mod.settings.maxVertical){
							if(!(mod.settings.ethics && (partyMembers[i].loc.dist3D(playerLocation.loc) / 25) <= 20) && !(!mod.settings.ethics && (partyMembers[i].loc.dist3D(playerLocation.loc) / 25) <= mod.settings.Skills[job][skill].distance)) break;
							let dontHealThem = false;
							let partyMemberName = partyMembers[i].name.toLowerCase();
							for (let j = 0; j < mod.settings.dontHeal.length; j++){
								if(mod.settings.dontHeal[j] == partyMemberName){ // on the don't heal list
									dontHealThem = true;
									break;
								}
							}
							if(!dontHealThem) targetMembers.push(partyMembers[i]); // add
						}
					} else if(!healing && mod.settings.targetEnemy){ // attack and enabled
						if((mod.settings.Skills[job][skill].targets[k] == "enemyBuff" || mod.settings.Skills[job][skill].targets[k] == "enemyHealer" || // enemy
						mod.settings.Skills[job][skill].targets[k] == "enemyDps" || mod.settings.Skills[job][skill].targets[k] == "enemy") &&
						enemies[i].alive && !mod.settings.blockList[enemies[i].name] &&  // alive, not blocked
						enemies[i].loc && enemies[i].loc != undefined && (Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= mod.settings.maxVertical){
							if(!(mod.settings.ethics && enemies[i].dist <= 20) && !(!mod.settings.ethics && enemies[i].dist <= mod.settings.Skills[job][skill].distance)) break;
							if(prioArrayToCheck.length != 0 && !checkedPriorityTargets){
								checkedPriorityTargets = true;
								for (let j = 0; j < prioArrayToCheck.length; j++){ // search name priority list
									if(targetMembers.length == maxTargetCount) break;
									for (let u = 0; u < targetArrayLength; u++){ // search enemies
										if(enemies[u].name == prioArrayToCheck[j].toLowerCase() && // enemy name is priority
										enemies[i].alive && !mod.settings.blockList[enemies[i].name]){ // alive, not blocked
											if(!(mod.settings.ethics && enemies[u].dist <= 20) && !(!mod.settings.ethics && enemies[u].dist <= mod.settings.Skills[job][skill].distance)) break;
											targetMembers.push(enemies[u]); // add
											//console.log(enemies[u].name);
											//console.log(enemies[u].dist);
											//console.log("^^ PRIO NAME ^^");
											break;
										}
									}
								}
							}
							//console.log("targetMembers.length = " + targetMembers.length + " at i = " + i + " after prioname");
							if(targetMembers.length == maxTargetCount) break;
							
							if(mod.settings.prioByClass && (skill != 31 && skill != 28 && skill != 33 && skill != 35) && !checkedClassTargets){ // not sleep/fear/estars(buff doesn't apply to me too often)
								checkedClassTargets = true;
								for (let j = 0; j < mod.settings.prioClass.length; j++){ // search class priority list
									if(targetMembers.length == maxTargetCount) break;
									for (let u = 0; u < targetArrayLength; u++){ // search enemies
										if(targetMembers.length == maxTargetCount) break;
										if(enemies[u].job == mod.settings.prioClass[j] && // enemy class is priority
										enemies[i].alive && !mod.settings.blockList[enemies[i].name] &&  // alive, not blocked
										(Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= mod.settings.maxVertical){
											if(!(mod.settings.ethics && enemies[u].dist <= 20) && !(!mod.settings.ethics && enemies[u].dist <= mod.settings.Skills[job][skill].distance)) break;
											if(targetMembers.indexOf(enemies[u]) == -1) targetMembers.push(enemies[u]); // add if not already in list
											//console.log(enemies[u].name);
											//console.log(enemies[u].dist);
											//console.log("^^ PRIO CLASS ^^");
										}
									}
								}
							}
							//console.log("targetMembers.length = " + targetMembers.length + " at i = " + i + " after prioclass");
							if(targetMembers.length == maxTargetCount) break;
							
							if(mod.settings.Skills[job][skill].targets[k] == "enemyHealer" && (enemies[i].job == 6 || enemies[i].job == 7)){ // targeting healer
								if(targetMembers.indexOf(enemies[i]) == -1) targetMembers.push(enemies[i]);
							} else if(mod.settings.Skills[job][skill].targets[k] == "enemyDps" && (enemies[i].job != 6 && enemies[i].job != 7)){ // targeting dps
								if(targetMembers.indexOf(enemies[i]) == -1) targetMembers.push(enemies[i]);
							} else if(mod.settings.Skills[job][skill].targets[k] == "enemy"){ // no priority target found, look for anyone
								if(targetMembers.indexOf(enemies[i]) == -1) targetMembers.push(enemies[i]);
							}
							//console.log(enemies[i].name);
							//console.log(enemies[i].dist);
							//console.log("^^ regular ^^");
							//console.log("targetMembers.length = " + targetMembers.length + " at i = " + i + " after " + mod.settings.Skills[job][skill].targets[k]);
						}
					}
				}
			}
			
			// if no delay, use global default delay
            let lockondelay = mod.settings.Skills[job][skill].lockonDelay ? mod.settings.Skills[job][skill].lockonDelay : mod.settings.lockonDelay;
            let castdelay = mod.settings.Skills[job][skill].autoCastDelay ? mod.settings.Skills[job][skill].autoCastDelay : mod.settings.autoDpsDelay;
            let autoCast = false;
            if(mod.settings.Skills[job][skill].type == "heal" && mod.settings.healCast) autoCast = true;
            else if(mod.settings.Skills[job][skill].type == "cleanse" && mod.settings.cleanseCast) autoCast = true; 
            else if(mod.settings.Skills[job][skill].type == "damage" && mod.settings.attackCast) autoCast = true;
            else if(mod.settings.Skills[job][skill].type == "debuff" && mod.settings.debuffCast) autoCast = true;
			//console.log("maxTargetCount = " + maxTargetCount);
            //console.log("targetMembers.length = " + targetMembers.length);
            for (let y = 0; y < targetMembers.length; y++){ // lockon to targets
                setTimeout(() => {
                    if(targetMembers[y].gameId) mod.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[y].gameId, skill: event.skill.id}); // player/npc
                    else mod.toServer('C_CAN_LOCKON_TARGET', 3, {target: targetMembers[y].id, skill: event.skill.id}); // bam
                }, lockondelay);
				//if(targetMembers[y].name) console.log(targetMembers[y].name);
				//if(targetMembers[y].dist) console.log(targetMembers[y].dist);
            }
            if(autoCast && mod.settings.Skills[job][skill].autoCast){ // cast skill
                setTimeout(() => {
                    mod.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
                }, castdelay);
            }
		}
	});
	
	
	function sortHp(){
        partyMembers.sort(function (a, b){
            return Number(a.hpP) - Number(b.hpP);
        });
    }
	function sortDistBoss(){
		for (let i = 0; i < bossInfo.length; i++){ // calculate distance
			bossInfo[i].dist = (Math.sqrt(Math.pow(bossInfo[i].x - playerLocation.loc.x, 2) + Math.pow(bossInfo[i].y - playerLocation.loc.y, 2) + Math.pow(bossInfo[i].z - playerLocation.loc.z, 2))) / 25;
		}
        bossInfo.sort(function (a, b){
            return Number(a.dist) - Number(b.dist);
        });
    }
    function sortDistNpc(){
        for (let i = 0; i < npcInfo.length; i++){ // calculate distance
            npcInfo[i].dist = npcInfo[i].loc.dist3D(playerLocation.loc) / 25;
        }
        npcInfo.sort(function (a, b){
            return Number(a.dist) - Number(b.dist);
        });
    }
	function sortDistEnemies(){
		for (let i = 0; i < enemies.length; i++){ // calculate distance
			enemies[i].dist = enemies[i].loc.dist3D(playerLocation.loc) / 25;
		}
		enemies.sort(function (a, b){
			return Number(a.dist) - Number(b.dist);
		});
	}
	function sortAllTargets(){
		if(partyMembers.length > 0) sortHp();
		if(bossInfo.length > 0) sortDistBoss();
        if(npcInfo.length > 0) sortDistNpc();
		if(enemies.length > 0) sortDistEnemies();
	}
}