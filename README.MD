# TerableLockons

Made by TerableCoder

Auto-Heal + Let-me-target + TerableCoder upgrades = TerableLockons

Tera-proxy module that skips lockons and instantly heals and cleanses party members.
Also instantly locks on bams/players with options for player name or class priorities and blacklists.
Priority is: player name > healer (if active) > dps class (if active) > anyone else.
Priority can be changed per skill to: player name > dps (if active) > healer (if active) > anyone else.

## Info
- Skills will instantly lockon and heal/cleanse party members. Heals prioritize the lowest HP.
- Mystic's cleanse only works in parties of 5 members or less. Disabled in raids.
- Auto-casting can be disabled (Skills will pre-lockon onto targets and need to be manually pressed again to cast).

| Skills affected                 |
| ------------------------------- |
| Priest - Focus Heal             |
| Priest - Healing Immersion      |
| Priest - Ishara's Lullaby	      |
| Priest - Energy Stars		      |
| Priest - Plague of Exhaustion   |
| ------------------------------- |
| Mystic - Titanic Favor          |
| Mystic - Arun's Cleansing Touch |
| Mystic - Sonorous Dreams		  |
| Mystic - Volley of Curses		  |
| Mystic - Contagion			  |
| Mystic - Curse of Exhaustion	  |
| Mystic - Mire^Soon			  |
| ------------------------------- |
| Archer - Arrow Volley			  |
| ------------------------------- |
| Sorcerer - Flaming Barrage	  |
| Sorcerer - Burning Breath		  |
| Sorcerer - Time Gyre			  |
| Sorcerer - Nerve Exhaustion	  |
| Sorcerer - Mana Volley		  |
| ------------------------------- |

## Usage
### `teral` or `tlockons` or `teralockons` or `terablelockons`
- Toggle entire module on or off, default is on
### `autoheal` ~ automatically lockon people
- Toggle on/off, default is on
### `autoheal [on/off]`
- Enables/disables auto-heals
### `autoheal [HP]`
- Set cutoff for healing. ('autoheal 50' = ignore members with >50% HP. Set to 100 to always heal)
- Default cutoff is 90%
### `autocleanse` ~ automatically lockon mystic cleanse
- Toggle on/off, default is on
### `autocleanse [on/off]`
- Enables/disables auto-cleansing
### `autocast` ~ automatically completes heals and mystic cleanse
- Toggle on/off, default is on
### `autocast [on/off]`
- Enables/disables auto-casting
### `autodps` ~ automatically completes bam lockons
- Toggle on/off, default is on
### `autodps [on/off]`
- Enables/disables auto-casting
### `autopvp` ~ automatically completes player lockons
- Toggle on/off, default is on
### `autopvp [on/off]`
- Enables/disables auto-casting
### `targetboss` ~ allows you to lockon bams (disabling it is good for CU)
- Toggle on/off, default is on
### `targetboss [on/off]`
- Enables/disables auto-casting
### `splitsleep` ~ if healer false, split fear/sleep/gyre with 2 players
- Toggle on/off, default is on
### `splitsleep [on/off]`
- Enables/disables auto-casting

### `castdelay [time]`
- Set delay for all autocasts. Default delay is 10.

### `sleepdps`
- Toggle on/off, default is on
### `sleepdps [on/off]`
- Enables/disables auto-heals
### `sleep [healer/archer/zerk/lancer/slayer/sorc/warrior/reaper/gunner/brawler/ninja/valk]`
- Toggle sleep priority for this class on and off. healer is on by default, the rest are off by default.
### `sleepy [name]` ~ example: sleepy Wrong
- Add name to sleep priority list. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `sleepyremove [name]` ~ example: sleepyremove Wrong
- Remove a name from the sleep priority list. You must capitalize the name the same way as it's spelled.
### `dmg [name]` ~ example: dmg Wrong
- Add name to eStars/Arrow Volley/Flaming Barrage/Burning Breath priority list. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `dmgremove [name]` ~ example: dmgremove Wrong
- Remove a name from the eStars/Arrow Volley/Flaming Barrage/Burning Breath priority list. You must capitalize the name the same way as it's spelled.
### `pp [name]` ~ example: pp Wrong
- Add name to plague priority list. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `ppremove [name]` ~ example: ppremove Wrong
- Remove a name from the plague priority list. You must capitalize the name the same way as it's spelled.
### `bl [name]` ~ example: bl Wrong
- Add name to enemy CC lockon block list, this makes you not lock onto them. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `blremove [name]` ~ example: blremove Wrong
- Remove a name from the plague priority list. You must capitalize the name the same way as it's spelled.
### `dd [name]` ~ example: bl Wrong
- Add name to enemy DMG lockon block list, this makes you not lock onto them. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `ddremove [name]` ~ example: blremove Wrong
- Remove a name from the plague priority list. You must capitalize the name the same way as it's spelled.
### `dh [name]` ~ example: dh Wrong
- Add name to teammate Heal lockon block list, this makes you not lock onto them. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `dhremove [name]` ~ example: dhremove Wrong
- Remove a name from the plague priority list. You must capitalize the name the same way as it's spelled.

### `tp` ~ test party
- Sorts your party members by health, then prints it out onto the proxy display(cmd).
### `tb` ~ test boss
- Sorts your target bosses by distance, then prints it out onto the proxy display(cmd).
### `te` ~ test enemy
- Sorts your target enemy players by distance, then prints it out onto the proxy display(cmd).
TODO: Sort target monsters/enemies by pure health
### `cp` ~ clear party list
- Clears the party members list, then prints it out onto the proxy display(cmd), which should be empty.
### `cb` ~ clear boss list
- Clears the boss list, then prints it out onto the proxy display(cmd), which should be empty.
### `ce` ~ clear enemies list
- Clears the enemy list, then prints it out onto the proxy display(cmd), which should be empty.

### `ml` ~ my location
- Prints your location (x, y, z) out onto the proxy display(cmd).





## Issues
- Skills can ghost if proxy is also using Skill-Prediction (You see animation but nothing happens). Workaround is to disable the skills in SP. [Click here to see how](https://i.imgur.com/bS4VkbX.png)

## Changelog
<details>
	
	- TODO: Let it target mobs
	- TODO: Let it target both bams and players at the same time (plague both)
	- TODO: Make increase max target number glyphs actually work for archer/sorc
	- TODO: Make there be a timeout so that if an enemy hasn't been seen in a long time we remove them from the enemy list, maybe?
	- TODO: Make boss list never bug, aka boss resets
	- TODO: Distribute, maybe?
	3.0
	- Complete refactor
	- Fix: bigints print now
	2.41
	- Fixed for patch 77 and new proxy
	2.4
	- Edit: Seperated block list for attack skills and CC skills
	- New: Added support for every lockon on every class(priest, mystic, sorc, archer)
	- New: Added option to split sleep, if healer false and splitSleep true, split fear/sleep/gyre with 2 players
	- Fix: Made adding a player to the party not clear the enemies list, instead it removes the added players from the enemies list
	- Fix: PvE lockons work on multiple bosses
	- Random Small Changes~
	2.31
	- Fix: TargetBoss fixed
	2.3
	- New: Added option to prioritize dps classes before healer classes
	- New: Added plague class priority, no longer shared with sleep class plague priority
	- New: Added option to prioritize dps classes before healer classes
	- New: Added sleep player priority list
	- New: Added E Stars player priority list
	- New: Added plague player priority list
	- New: Added enemy player target block list
	- New: Added party member target block list
	- Fix: Changed plague player range from same as eStars to plague boss range
	- New: Added packet version list
	2.2
	- New: Added sleep class priority
	2.1
	- New: Added enemy player targeting
	2.0
	- New: Added BAM auto lockon and auto cast
	- New: Added max range per skill
	
</details>

## Packet Version List
<details>
	
	S_LOGIN 10
	S_PARTY_MEMBER_LIST 7
	S_LEAVE_PARTY 1
	C_PLAYER_LOCATION 5
	S_SPAWN_ME 3
	S_SPAWN_USER 13
	S_USER_LOCATION 5
	S_USER_LOCATION_IN_ACTION 2
	S_INSTANT_DASH 3
	S_PARTY_MEMBER_CHANGE_HP 4
	S_PARTY_MEMBER_STAT_UPDATE 3
	S_DEAD_LOCATION 2
	S_LEAVE_PARTY_MEMBER 2
	S_LOGOUT_PARTY_MEMBER 1
	S_BAN_PARTY_MEMBER 1
	S_BOSS_GAGE_INFO 3
	S_ACTION_STAGE 8
	C_START_SKILL 7
	C_CAN_LOCKON_TARGET 3
	S_CREST_INFO 2
	S_CREST_APPLY 2
	
</details>


---
