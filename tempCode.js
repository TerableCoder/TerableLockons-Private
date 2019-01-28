	command.add(['cs', 'changeskill'], (p1, p2, p3, p4) {
    	if(typeof p1 === 'string' || p1 instanceof String){
			p1 = p1.replace("_", " "); // replace _ with space
			p1.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}); // capitalize first letter of each word
			let foundSkill = mod.settings.Skill[job].find(p => p.name == p1);
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
								let argIndex = foundSkill.targets.indexOf(p4);
								if(add && argIndex == -1) foundSkill.targets.push(p4);
								else if(remove && argIndex > -1) foundSkill.targets.splice(argIndex, 1);
								break;
							case "heal":
							case "cleanse":
								if(foundSkill.type != p4){
									command.message("You can only target heal with heals, and cleanse with cleanse");
									return;
								}
								let argIndex = foundSkill.targets.indexOf(p4);
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
	
	
	command.add(['teral', 'tlockons', 'teralockons', 'terablelockons'], (p1)=> {
		if(p1 == "reload"){
			if(mod.proxyAuthor !== 'caali'){
				const options = require('./module').options
				if(options){
					const settingsVersion = options.settingsVersion
					if(settingsVersion){
						mod.settings = require('./' + (options.settingsMigrator || 'module_settings_migrator.js'))(mod.settings._version, settingsVersion, mod.settings)
						mod.settings._version = settingsVersion
					}
				}
			} else mod.settings = require('./config.json'); // idk if this works
		} else toggleOnOfSetting("enabled", 'TerableLockons is ', p1, null);
	});