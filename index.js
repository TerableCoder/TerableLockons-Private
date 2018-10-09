const Command = require('command');
const config = require('./config.js');
    
module.exports = function AutoHeal(dispatch) {
    const command = Command(dispatch);
    
    let enabled = false, // gets enabled when you log in as a healer
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
    
	
    command.add('autoheal', (p1)=> {
        if (p1 == null) {
            config.autoHeal = !config.autoHeal;
        } else if (p1.toLowerCase() === 'off') {
            config.autoHeal = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoHeal = true;
        } else if (p1.toLowerCase() === 'debug') {
            debug = !debug;
            command.message('Debug ' + (debug ? 'enabled' : 'disabled'));
            return;
        } else if (!isNaN(p1)) {
            config.autoHeal = true;
            config.hpCutoff = (p1 < 0 ? 0 : p1 > 100 ? 100 : p1);
        } else {
            command.message(p1 +' is an invalid argument');
            return;
        }        
        command.message('Healing ' + (config.autoHeal ? 'enabled (' + config.hpCutoff + '%)' : 'disabled'));
    });
    command.add('autocleanse', (p1) => {
        if (p1 == null) {
            config.autoCleanse = !config.autoCleanse;
        } else if (p1.toLowerCase() === 'off') {
            config.autoCleanse = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoCleanse = true;
        } else {
            command.message(p1 +' is an invalid argument for cleanse command');
            return;
        }
        command.message('Cleansing ' + (config.autoCleanse ? 'enabled' : 'disabled'));
    });
    command.add('autocast', (p1)=> {
        if (p1 == null) {
            config.autoCast = !config.autoCast;
        } else if (p1.toLowerCase() === 'off') {
            config.autoCast = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoCast = true;
        } else {
            command.message(p1 +' is an invalid argument for cast command');
            return;
        }        
        command.message('Heal Casting ' + (config.autoCast ? 'enabled' : 'disabled'));
    });
	command.add('autodps', (p1)=> {
        if (p1 == null) {
            config.autoDps = !config.autoDps;
        } else if (p1.toLowerCase() === 'off') {
            config.autoDps = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoDps = true;
        } else {
            command.message(p1 +' is an invalid argument for cast command');
            return;
        }        
        command.message('PvE Casting ' + (config.autoDps ? 'enabled' : 'disabled'));
    });
	command.add('autopvp', (p1)=> {
        if (p1 == null) {
            config.autoPvP = !config.autoPvP;
        } else if (p1.toLowerCase() === 'off') {
            config.autoPvP = false;
        } else if (p1.toLowerCase() === 'on') {
            config.autoPvP = true;
        } else {
            command.message(p1 +' is an invalid argument for cast command');
            return;
        }        
        command.message('PvP Casting ' + (config.autoPvP ? 'enabled' : 'disabled'));
    });
	command.add('dpsdelay', (p1)=> {
		let delay = Number(p1);
        if (delay == NaN || autoDpsDelay < 0) {
            command.message(p1 +' is an invalid argument for cast command');
            return;
        } else {
            config.autoDpsDelay = delay;
        }        
        command.message('Casting Delay ' + config.autoDpsDelay);
    });
	
	command.add('sleepdps', (p1)=> {
        if (p1 == null) {
            config.sleepPrioDpsBeforeHealer = !config.sleepPrioDpsBeforeHealer;
        } else if (p1.toLowerCase() === 'off') {
            config.sleepPrioDpsBeforeHealer = false;
        } else if (p1.toLowerCase() === 'on') {
            config.sleepPrioDpsBeforeHealer = true;
        } else {
            command.message(p1 +' is an invalid argument');
            return;
        }
        command.message('Sleep Priority Dps Before Priority Healer ' + (config.sleepPrioDpsBeforeHealer ? 'enabled' : 'disabled'));
    });
	/*
	command.add('esdps', (p1)=> {
        if (p1 == null) {
            config.eStarsPrioDpsBeforeHealer = !config.eStarsPrioDpsBeforeHealer;
        } else if (p1.toLowerCase() === 'off') {
            config.eStarsPrioDpsBeforeHealer = false;
        } else if (p1.toLowerCase() === 'on') {
            config.eStarsPrioDpsBeforeHealer = true;
        } else {
            command.message(p1 +' is an invalid argument');
            return;
        }
        command.message('E Stars Priority Dps Before Priority Healer ' + (config.eStarsPrioDpsBeforeHealer ? 'enabled' : 'disabled'));
    });
	*/
	command.add('ppdps', (p1)=> {
        if (p1 == null) {
            config.plaguePrioDpsBeforeHealer = !config.plaguePrioDpsBeforeHealer;
        } else if (p1.toLowerCase() === 'off') {
            config.plaguePrioDpsBeforeHealer = false;
        } else if (p1.toLowerCase() === 'on') {
            config.plaguePrioDpsBeforeHealer = true;
        } else {
            command.message(p1 +' is an invalid argument');
            return;
        }
        command.message('Plague Priority Dps Before Priority Healer ' + (config.plaguePrioDpsBeforeHealer ? 'enabled' : 'disabled'));
    });
	
	command.add('targetboss', (p1)=> {
        if (p1 == null) {
            config.targetBoss = !config.targetBoss;
        } else if (p1.toLowerCase() === 'off') {
            config.targetBoss = false;
        } else if (p1.toLowerCase() === 'on') {
            config.targetBoss = true;
        } else {
            command.message(p1 +' is an invalid argument');
            return;
        }
        command.message('Target boss ' + (config.targetBoss ? 'enabled' : 'disabled'));
    });
	
	command.add('sleep', (p1)=> {
        if (p1 == null) {
            command.message(p1 +' is an invalid argument');
			return;
        }
		p1 = p1.toLowerCase();
		
		if (p1 == 'healer'){
			config.healer = !config.healer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.healer ? 'enabled' : 'disabled'));
		} else if (p1 == 'archer') {
			config.archer = !config.archer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.archer ? 'enabled' : 'disabled'));
        } else if (p1 == 'zerk'){
			config.zerk = !config.zerk;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.zerk ? 'enabled' : 'disabled'));
		} else if (p1 == 'lancer'){
			config.lancer = !config.lancer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.lancer ? 'enabled' : 'disabled'));
		} else if (p1 == 'slayer'){
			config.slayer = !config.slayer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.slayer ? 'enabled' : 'disabled'));
		} else if (p1 == 'sorc'){
			config.sorc = !config.sorc;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.sorc ? 'enabled' : 'disabled'));
		} else if (p1 == 'warrior'){
			config.warrior = !config.warrior;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.warrior ? 'enabled' : 'disabled'));
		} else if (p1 == 'reaper'){
			config.reaper = !config.reaper;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.reaper ? 'enabled' : 'disabled'));
		} else if (p1 == 'gunner'){
			config.gunner = !config.gunner;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.gunner ? 'enabled' : 'disabled'));
		} else if (p1 == 'brawler'){
			config.brawler = !config.brawler;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.brawler ? 'enabled' : 'disabled'));
		} else if (p1 == 'ninja'){
			config.ninja = !config.ninja;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.ninja ? 'enabled' : 'disabled'));
		} else if (p1 == 'valk'){
			config.valk = !config.valk;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.valk ? 'enabled' : 'disabled'));	
		} else {
            command.message(p1 +' is an invalid argument');
            return;
        }
    });
	command.add('plague', (p1)=> {
        if (p1 == null) {
            command.message(p1 +' is an invalid argument');
			return;
        }
		p1 = p1.toLowerCase();
		
		if (p1 == 'healer'){
			config.phealer = !config.phealer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.healer ? 'enabled' : 'disabled'));
		} else if (p1 == 'archer') {
			config.parcher = !config.parcher;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.archer ? 'enabled' : 'disabled'));
        } else if (p1 == 'zerk'){
			config.pzerk = !config.pzerk;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.zerk ? 'enabled' : 'disabled'));
		} else if (p1 == 'lancer'){
			config.plancer = !config.plancer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.lancer ? 'enabled' : 'disabled'));
		} else if (p1 == 'slayer'){
			config.pslayer = !config.pslayer;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.slayer ? 'enabled' : 'disabled'));
		} else if (p1 == 'sorc'){
			config.psorc = !config.psorc;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.sorc ? 'enabled' : 'disabled'));
		} else if (p1 == 'warrior'){
			config.pwarrior = !config.pwarrior;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.warrior ? 'enabled' : 'disabled'));
		} else if (p1 == 'reaper'){
			config.preaper = !config.preaper;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.reaper ? 'enabled' : 'disabled'));
		} else if (p1 == 'gunner'){
			config.pgunner = !config.pgunner;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.gunner ? 'enabled' : 'disabled'));
		} else if (p1 == 'brawler'){
			config.pbrawler = !config.pbrawler;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.brawler ? 'enabled' : 'disabled'));
		} else if (p1 == 'ninja'){
			config.pninja = !config.pninja;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.ninja ? 'enabled' : 'disabled'));
		} else if (p1 == 'valk'){
			config.pvalk = !config.pvalk;
			command.message('Sleep Priority ' + p1 + ' = ' + (config.valk ? 'enabled' : 'disabled'));	
		} else {
            command.message(p1 +' is an invalid argument');
            return;
        }
    });
	
    command.add('sleepy', (p1) => {
		if (!config.sleepyPlayers[0].includes(p1)){
			config.sleepyPlayers[0].push(p1);
		}
        message(JSON.stringify(config.sleepyPlayers[0], null, 4));
    });
	command.add('es', (p1) => {
		if (!config.freeStars[0].includes(p1)){
			config.freeStars[0].push(p1);
		}
        message(JSON.stringify(config.freeStars[0], null, 4));
    });
	command.add('pp', (p1) => {
		if (!config.plaguePrio[0].includes(p1)){
			config.plaguePrio[0].push(p1);
		}
        message(JSON.stringify(config.plaguePrio[0], null, 4));
    });
	command.add('bl', (p1) => {
		if (!config.blockList[0].includes(p1)){
			config.blockList[0].push(p1);
		}
        message(JSON.stringify(config.blockList[0], null, 4));
    });
	command.add('dh', (p1) => {
		if (!config.dontHeal[0].includes(p1)){
			config.dontHeal[0].push(p1);
		}
        message(JSON.stringify(config.dontHeal[0], null, 4));
    });
	command.add('sleepyremove', (p1) => {
		let index = config.sleepyPlayers[0].indexOf(p1);
		if (index > -1){
			config.sleepyPlayers[0].splice(index, 1);
		}
        message(JSON.stringify(config.sleepyPlayers[0], null, 4));
    });
	command.add('esremove', (p1) => {
		let index = config.freeStars[0].indexOf(p1);
		if (index > -1){
			config.freeStars[0].splice(index, 1);
		}
        message(JSON.stringify(config.freeStars[0], null, 4));
    });
	command.add('ppremove', (p1) => {
		let index = config.plaguePrio[0].indexOf(p1);
		if (index > -1){
			config.plaguePrio[0].splice(index, 1);
		}
        message(JSON.stringify(config.plaguePrio[0], null, 4));
    });
	command.add('blremove', (p1) => {
		let index = config.blockList[0].indexOf(p1);
		if (index > -1){
			config.blockList[0].splice(index, 1);
		}
        message(JSON.stringify(config.blockList[0], null, 4));
    });
	command.add('dhremove', (p1) => {
		let index = config.dontHeal[0].indexOf(p1);
		if (index > -1){
			config.dontHeal[0].splice(index, 1);
		}
        message(JSON.stringify(config.dontHeal[0], null, 4));
    });
	
    command.add('tp', () => {
        sortHp();
        message(JSON.stringify(partyMembers, null, 4));
    });
	command.add('tb', () => {
        sortDistBoss();
        message(JSON.stringify(bossInfo, null, 4));
    });
	command.add('te', () => {
		sortDistEnemies();
        message(JSON.stringify(enemies, null, 4));
    });
	command.add('cp', () => {
        partyMembers = [];
        message(JSON.stringify(partyMembers, null, 4));
    });
	command.add('cb', () => {
        bossInfo = [];
        message(JSON.stringify(bossInfo, null, 4));
    });
	command.add('ce', () => {
        enemies = [];
        message(JSON.stringify(enemies, null, 4));
    });
	command.add('ml', () => {
		message("My Location");
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
	
	/*
	[dispatch] handle: error running hook for S_PARTY_MEMBER_LIST<7>
	hook: (anonymous) in let-me-autocast
	data: { ims: true,
	  raid: false,
	  unk1: 3,
	  unk2: 19478,
	  unk3: 134,
	  unk4: 26,
	  leaderServerId: 26,
	  leaderPlayerId: 3126545,
	  unk5: 1,
	  unk6: 1,
	  unk7: 0,
	  unk8: 1,
	  unk9: 0,
	  unk10: 1,
	  unk11: 0,
	  members:
	   [ { serverId: 26,
		   playerId: 3126545,
		   level: 65,
		   class: 6,
		   online: true,
		   gameId: [Long],
		   order: 0,
		   canInvite: 0,
		   laurel: 0,
		   awakeningLevel: 0,
		   name: 'Wrong' },
		 { serverId: 26,
		   playerId: 3123637,
		   level: 65,
		   class: 4,
		   online: true,
		   gameId: [Long],
		   order: 1,
		   canInvite: 0,
		   laurel: 3,
		   awakeningLevel: 0,
		   name: 'Roookie',
		   loc: undefined },
		 { serverId: 26,
		   playerId: 1990474,
		   level: 65,
		   class: 8,
		   online: true,
		   gameId: [Long],
		   order: 2,
		   canInvite: 0,
		   laurel: 0,
		   awakeningLevel: 0,
		   name: 'Teal' } ] }
	error: Cannot set property 'hpP' of undefined
		at Object.AutoHeal.dispatch.hook [as callback] (C:\Users\Kenny\Music\tera-proxy_pvp\eu cali\CaaliTeraProxy\bin\node_modules\let-me-autocast\index.js:112:28)
	*/
	
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
                    if (event.members[i].gameId.equals(partyMembers[j].gameId)) {
                        event.members[i].loc = partyMembers[j].loc;
                        event.members[i].hpP = partyMembers[j].hpP;
						
						/*
						if (isNaN(partyMembers[j].hpP) || partyMembers[j].hpP == undefined || partyMembers[j].hpP == null && partyMembers[j].hpP > 100){
							command.message("S_PARTY_MEMBER_LIST, " + partyMembers[i].playerId + " HP = " + partyMembers[j].hpP);
						}
						*/
						
						/*
						let asd = (event.curHp / event.maxHp) * 100;
						if (asd != null && asd <= 100){
							//event.members[i].hpP = asd;
							event.members[i].hpP = partyMembers[j].hpP;
						} else {
							event.members[i].hpP = 100;
							command.message("S_PARTY_MEMBER_LIST, " + partyMembers[i].playerId + " HP = " + asd);
						}
						*/
                    }
                }
            }
        }
        partyMembers = event.members;
        // remove self from targets
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].gameId.equals(gameId)) {
                partyMembers.splice(i, 1);
				
				if (addedMember){ // join party -> clear list
					enemies = []; // potentially error inviting
					//message("S_PARTY_MEMBER_LIST");
					//message("CLEARED Enemies List");
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
                if (partyMembers[i].gameId.equals(event.gameId)) {
                    partyMembers[i].loc = event.loc;
                    partyMembers[i].hpP = (event.alive ? 100 : 0);
                    return;
                }
            }
		}
		
		let theirClass = (event.templateId - 10101) % 100;
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].gameId.equals(event.gameId)) {
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
			dist: 99999999,
			job: theirClass,
			name: event.name
		}
		enemies.push(tempPushEvent);
	
		//message("S_SPAWN_USER");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_USER_LOCATION', 5, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].gameId.equals(event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].gameId.equals(event.gameId)) {
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
			dist: 99999999,
			job: null,
			name: ""
		}
		enemies.push(tempPushEvent);
		
		//message("S_USER_LOCATION");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_USER_LOCATION_IN_ACTION', 2, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].gameId.equals(event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].gameId.equals(event.gameId)) {
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
			dist: 99999999,
			job: null,
			name: ""
		}
		enemies.push(tempPushEvent);
		
		//message("S_USER_LOCATION_IN_ACTION");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
    dispatch.hook('S_INSTANT_DASH', 3, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].gameId.equals(event.gameId)) {
                partyMembers[i].loc = event.loc;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].gameId.equals(event.gameId)) {
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
			dist: 99999999,
			job: null,
			name: ""
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
				let asd = (event.curHp / event.maxHp) * 100;
				if (asd != null && asd <= 100){
					partyMembers[i].hpP = asd;
				} else {
					//partyMembers[i].hpP = 100;
					//command.message("S_PARTY_MEMBER_CHANGE_HP, " + partyMembers[i].playerId + " HP = " + asd);
				}
                //partyMembers[i].hpP = (event.curHp / event.maxHp) * 100;
				/*let tempvar = Number(event.curHp);
				let tempvarrr = Number(event.maxHp);
                partyMembers[i].hpP = tempvar * tempvarrr * 100;*/
				//command.message("player hp = " + partyMembers[i].hpP);
                return;
            }
        }
    })
    
	/*
	[dispatch] handle: error running hook for S_PARTY_MEMBER_STAT_UPDATE<3>
	hook: (anonymous) in let-me-autocast
	data: { serverId: 26,
	  playerId: 3125405,
	  curHp: 135115n,
	  curMp: 5399,
	  maxHp: 135115n,
	  maxMp: 6112,
	  level: 65,
	  inCombat: 1,
	  vitality: 0,
	  alive: 1,
	  stamina: 120,
	  curRe: 0,
	  maxRe: 0,
	  unk2: 0 }
	error: Cannot mix BigInt and other types, use explicit conversions
		at Object.AutoHeal.dispatch.hook [as callback] (C:\Users\Kenny\Downloads\tera-proxy\bin\node_modules\let-me-autocast\index.js:200:67)
	*/
	
    dispatch.hook('S_PARTY_MEMBER_STAT_UPDATE', 3, (event) => {
        if (!enabled) return;
        if (playerId == event.playerId) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].playerId === event.playerId) {
				let asd = (event.curHp / event.maxHp) * 100;
				if (asd != null && asd <= 100){
					partyMembers[i].hpP = asd;
				} else {
					//partyMembers[i].hpP = 100;
					//command.message("S_PARTY_MEMBER_STAT_UPDATE, " + partyMembers[i].playerId + " HP = " + asd);
				}
                //partyMembers[i].hpP = (event.curHp / event.maxHp) * 100;
				/*let tempvar = Number(event.curHp);
				let tempvarrr = Number(event.maxHp);
                partyMembers[i].hpP = tempvar * tempvarrr * 100;*/
				//command.message("player hp = " + partyMembers[i].hpP);
                return;
            }
        }
    })
    
    dispatch.hook('S_DEAD_LOCATION', 2, (event) => {
        if (!enabled) return;
        for (let i = 0; i < partyMembers.length; i++) {
            if (partyMembers[i].gameId.equals(event.gameId)) {
                partyMembers[i].loc = event.loc;
                partyMembers[i].hpP = 0;
                return;
            }
        }
		
		// if enemy, update them
		for (let i = 0; i < enemies.length; i++) {
			if (enemies[i].gameId.equals(event.gameId)) {
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
			dist: 99999999,
			job: null,
			name: ""
		}
		enemies.push(tempPushEvent);
		
		//message("S_DEAD_LOCATION");
		//message(JSON.stringify(enemies, null, 4));
		return;
		
    })
    
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
    
	/*
	[dispatch] handle: error running hook for S_BOSS_GAGE_INFO<3>
	hook: (anonymous) in let-me-autocast
	data: { id: 3519330562979537n,
	  huntingZoneId: 979,
	  templateId: 47951,
	  target: 72198331527996728n,
	  unk1: 0,
	  unk2: 1,
	  curHp: 0n,
	  maxHp: 1400000n,
	  unk3: 1 }
	error: Cannot convert a BigInt value to a number
		at Math.round (<anonymous>)
		at Object.AutoHeal.dispatch.hook [as callback] (C:\Users\Kenny\Downloads\tera-proxy\bin\node_modules\let-me-autocast\index.js:283:22)
	*/
	dispatch.hook('S_BOSS_GAGE_INFO', 3, { order: -10 }, (event) => {

        let alreadyHaveBoss = false;
		/*
		let tempvar = Number(event.curHp);
		let tempvarrr = Number(event.maxHp);
		tempvar = tempvar * tempvarrr * 100;
		*/
		//command.message("Boss hp = " + tempvar);
        let tempPushEvent = {
            id: event.id,
            x: 99999999,
            y: 99999999,
            z: 99999999,
            w: null,
            hp: Math.round(event.curHp / event.maxHp * 100),
            //hp: tempvar,
            dist: 100
        }
        if (bossInfo.length <= 0) {
            bossInfo.push(tempPushEvent);
        } else {
            for (let b = 0; b < bossInfo.length; b++) {
                if (bossInfo[b].id.equals(event.id)) {
                    bossInfo[b].hp = Math.round(event.curHp / event.maxHp * 100);
                    //bossInfo[b].hp = tempvar;
                    alreadyHaveBoss = true;
                    if (event.curHp <= 0) {
                        bossInfo = bossInfo.filter(function (p) {
                            return !p.id.equals(event.id);
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
// use 8 once patch 75
    dispatch.hook('S_ACTION_STAGE', 7, { order: -10 }, (event) => {

        if (bossInfo.length > 0) {
			for (let b = 0; b < bossInfo.length; b++) {
				if (event.gameId.equals(bossInfo[b].id)) {
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
				if (event.gameId.equals(enemies[b].id)) {
					enemies[b].loc = event.loc;
					enemies[b].w = event.w;
					break;
				}
			}
		}
		
    });
	
    dispatch.hook('C_START_SKILL', 7, (event) => {
        if (!enabled) return;
        // if (partyMembers.length == 0) return; // be in a party
        if (event.skill.id / 10 & 1 != 0) { // is casting (opposed to locking on)
            playerLocation.w = event.w;
            return; 
        }
        let skill = Math.floor(event.skill.id / 10000);
		
		let skillId = event.skill.id
		//let skillSub = event.skill.id % 100;
		//let packetSkillInfo = config.find(o => o.group == skillInfo.group && o.job == job);
        
        if(config.Skills[job] && config.Skills[job].includes(skill)) {
			//command.message("Priest or mystic heal");
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
                    }, 10);
                }
            }
			//command.message("Priest or mystic heal completed!");
        } else if (job == 7 && (skill == 24 || skill == 28 || skill == 41) && bossInfo != null && bossInfo.length != 0 && config.targetBoss){ // Mystic and Volley of Curses || Sonorous Dreams || Contagion
			// TODO
			//command.message("Mystic lockon attacks");
            sortDistBoss();
            if (bossInfo.length > 0 && bossInfo[0].dist <= config.maxDebuffRange) {
				setTimeout(() => {
					dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: bossInfo[0].id, skill: event.skill.id});
				}, 20);
				
				if (config.autoDps) {
					setTimeout(() => {
						dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
					}, config.autoDpsDelay);
				}
			}
			//command.message("Mystic lockon Completed");
			
		} else if (job == 6 && (skill == 30 || skill == 33 || skill == 35) && bossInfo != null && bossInfo.length != 0 && config.targetBoss){ // Priest and Plague of Exhaustion || Ishara's Lullaby || Energy Stars
			//command.message("Priest lockon attacks");
            sortDistBoss();
			
			if ((skill == 35 && (bossInfo.length > 0 && bossInfo[0].dist <= config.maxEStarsRange)) || // if estars
			((skill == 30 || skill == 33) && (bossInfo.length > 0 && bossInfo[0].dist <= config.maxDebuffRange))){ // other dps skill
				setTimeout(() => {
					dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: bossInfo[0].id, skill: event.skill.id});
				}, 20);
				
				if (config.autoDps) {
					setTimeout(() => {
						dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
					}, config.autoDpsDelay);
				}
				
			}
			//command.message("Priest lockon Completed");
			
		} else if (((job == 5 && skill == 2) || // Arrow Volley
		(job == 4 && skill == 20)) // Flaming Barrage
		&& bossInfo != null && config.targetBoss){ 
			// TODO
			//command.message("Sorc or Archer lockon");
			sortDistBoss();
			
			if (bossInfo.length > 0 && bossInfo[0].dist <= config.maxDPSRange){
				setTimeout(() => {
					dispatch.toServer('C_CAN_LOCKON_TARGET', 3, {target: bossInfo[0].id, skill: event.skill.id});
				}, 20);
				
				if (config.autoDps) {
					setTimeout(() => {
						dispatch.toServer('C_START_SKILL', 7, Object.assign({}, event, {w: playerLocation.w, skill: (event.skill.id + 10)}));
					}, config.autoDpsDelay);
				}
				
			}
			//command.message("Sorc or Archer lockon Completed");
		} else if (job == 6 && (skill == 30) && enemies.length != 0){ // Priest and Plague of Exhaustion
			//command.message("Priest Lockon Enemies - Plague");
			
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
									//command.message("Priest Enemy Added - Plague" + (i+1));
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
									//command.message("Priest Enemy Added - Sleep" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
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
									//command.message("Priest Enemy Added - Sleep" + (i+1));
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
										//command.message("Priest Enemy Added - Sleep" + (i+1));
										if (targetMembers.length == maxTargetCount) break;
									}
								}
							}
						}
					}
				}
			}
			
			// no priority target found, look for anyone
            for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
                if (enemies[i].alive == true &&
                    enemies[i].loc != undefined &&
                    (Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
					if (enemies[i].dist <= config.maxDebuffRange) {
						if (!config.blockList[0].includes(enemies[i].name)){
							targetMembers.push(enemies[i]);
							//command.message("Priest Enemy Added - Plague" + (i+1));
							if (targetMembers.length == maxTargetCount) break;
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
                    }, 10);
                }
				//command.message("Priest Lockon Completed - Plague");
            }
			//command.message("Priest Lockon Enemies Completed - Plague");
			
		} else if (job == 6 && (skill == 35) && enemies.length != 0){ // Priest and Energy Stars
			//command.message("Priest Lockon Enemies - eStars");
			
			let targetMembers = [];
            let maxTargetCount = 1;
			
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
							if (enemies[i].dist <= config.maxEStarsRange) {
								if (!config.blockList[0].includes(enemies[i].name)){
									targetMembers.push(enemies[i]);
									//command.message("Priest Enemy Added - eStars" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
								}
							}
						}
					}
				}
			}
			
            for (let i = 0; i < enemies.length; i++) { // queue ppl to lock on to
                if (enemies[i].alive == true &&
                    enemies[i].loc != undefined &&
                    (Math.abs(enemies[i].loc.z - playerLocation.loc.z) / 25) <= config.maxVertical){
					if (enemies[i].dist <= config.maxEStarsRange) {
						if (!config.blockList[0].includes(enemies[i].name)){
							targetMembers.push(enemies[i]);
							//command.message("Priest Enemy Added - eStars" + (i+1));
							if (targetMembers.length == maxTargetCount) break;
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
                    }, 10);
                }
				
				//command.message("Priest Lockon Completed - eStars");
            }
			//command.message("Priest Lockon Enemies Completed - eStars");
			
		} else if (job == 6 && (skill == 33) && enemies.length != 0){ // Priest and Ishara's Lullaby
			//command.message("Priest Lockon Enemies - Sleep");
			
			let targetMembers = [];
            let maxTargetCount = 1;
			
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
									//command.message("Priest Enemy Added - Sleep" + (i+1));
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
									//command.message("Priest Enemy Added - Sleep" + (i+1));
									if (targetMembers.length == maxTargetCount) break;
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
									//command.message("Priest Enemy Added - Sleep" + (i+1));
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
										//command.message("Priest Enemy Added - Sleep" + (i+1));
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
								//command.message("Priest Enemy Added - eStars" + (i+1));
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
                    }, 10);
                }
				
				//command.message("Priest Lockon Completed - Sleep");
            }
			//command.message("Priest Lockon Enemies Completed - Sleep");
			
		} else {
			//command.message("Enemies.length = " + enemies.length);
			//command.message("bossInfo.length = " + bossInfo.length);
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
            return parseFloat(a.hpP) - parseFloat(b.hpP);
        });
    }
        
    function outputDebug(skill) {
        let out = '\nAutoheal Debug... Skill: ' + skill.id + '\tpartyMemebers.length: ' + partyMembers.length;
        for (let i = 0; i < partyMembers.length; i++) {
            out += '\n' + i + '\t';
            let name = partyMembers[i].name;
            name += ' '.repeat(21-name.length);
            let hp = '\tHP: ' + partyMembers[i].hpP.toFixed(2);
            let dist = '\tDist: ' + (partyMembers[i].loc.dist3D(playerLocation.loc) / 25).toFixed(2);
            let vert = '\tVert: ' + (Math.abs(partyMembers[i].loc.z - playerLocation.loc.z) / 25).toFixed(2);
            let online = '\tOnline: ' + partyMembers[i].online;
            out += name + hp + dist + vert + online;
        }
        console.log(out)
    }
	
	function sortDistBoss() {
        bossInfo.sort(function (a, b) {
            return parseFloat(a.dist) - parseFloat(b.dist);
        });
    }
	
	function sortDistEnemies() {
		enemies.sort(function (a, b) {
			return parseFloat(a.dist) - parseFloat(b.dist);
		});
	}
	
	function message(msg, chat = false) {
        if (chat == true) {
            command.message('(Let Me Target) ' + msg);
        } else {
            console.log('(Let Me Target) ' + msg);
        }
    }
	
	function checkDistance(x, y, z, x1, y1, z1) {
        return (Math.sqrt(Math.pow(x1 - x, 2) + Math.pow(y1 - y, 2) + Math.pow(z1 - z, 2))) / 25;
    }
	
}
