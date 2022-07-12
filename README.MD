# TerableLockons

NOT updated for Menma's Tera

Made by TerableCoder

Tera-proxy module that skips lockons and instantly heals/cleanses party members or attacks/debuffs bams/npcs/enemy players. 
with options for player name/class priorities and name blacklists.

Skill target priority can be configured per skill in the 'config.json' file.
- 'enemyBuff' enemy with a priority buff, like Berserker Unleash
- 'enemyHealer' enemy priest or mystic
- 'enemyDps' enemy tank or dps
- 'enemy' any enemy
- 'boss' a BAM with the funky looking BAM HP bar, like Bahaar or Kylos
- 'npc' a mob or BAM that uses the /select UI, like Skeletons mobs in Bahaar or IOD BAMs

## Info
- Heals prioritize the lowest HP.
- All non-heal/non-cleanse skills prioritize distance from current target in the skills targets array. [INSERT IMAGE] 
- Mystic's cleanse only works in parties of 5 members or less. Disabled in raids.
- Can lockon and cast to any BAM that uses the funky looking BAM HP bar. 
- Can lockon and cast to any NPC that uses the /select UI that we've added the ID of.
- Auto-casting can be disabled (Skills will pre-lockon onto targets, but need to be manually pressed again to cast).
- Auto-lockon can be disabled (You will have to manually lockon and cast).
- Can add players to a blacklist where you don't lockon to them.
- Can add enemy players to a list where you prioritize targeting them.
- Can add enemy class prioritization.


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
| Mystic - Curse of Confusion	  |
| Mystic - Curse of Exhaustion	  |
| Mystic - Mire					  |
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
### `heal [on/off]`
- Toggle or set heal type skills to enabled/disabled
### `heal [HP]`
- Set cutoff for healing. ('autoheal 50' = ignore members with >50% HP. Set to 100 to always heal)
- Default cutoff is 100%
### `cleanse [on/off]`
- Toggle or set cleansing type skills enabled/disabled
### `attack [on/off]`
- Toggle or set attack type skills enabled/disabled
### `autodebuff [on/off]`
- Toggle or set debuff type skills to enabled/disabled

### `healcast [on/off]`
- Toggle or set heal casting to enabled/disabled
### `autocleanse [on/off]`
- Toggle or set cleanse casting to enabled/disabled
### `autoattack [on/off]`
- Toggle or set attack casting to enabled/disabled
### `autodebuff [on/off]`
- Toggle or set debuff casting to enabled/disabled

### `targetparty [on/off]`
- Toggle or set healing and cleansing to enabled/disabled
### `targetboss [on/off]`
- Toggle or set boss targeting to enabled/disabled (useful for CU)
### `targetnpc [on/off]`
- Toggle or set npc targeting to enabled/disabled (useful for CS defense)
### `targetenemy [on/off]`
- Toggle or set enemy targeting to enabled/disabled (useful for open Rally BAMs)

### `disablesleep [on/off]`
- Toggle or set Priest and Mystic Sleep to enabled/disabled (useful for Bahaar)
### `splitsleep [on/off]`
- Toggle or set Time Gyre, Mystic Sleep, Mystic Fear, Mire # of targets from default to 1, enabled/disabled
### `eth [on/off]`
- Toggle or set max range = 20 to enabled/disabled
### `findmob [on/off]`
- Toggle or set the printing of NPC IDs upon despawn to enabled/disabled

### `lockondelay (time)`
- Set global delay for lockons, the default delay is 5. Global delay is used if the skill config delay is 0.
### `castdelay (time)`
- Set global delay for autocasts, the default delay is 20. Global delay is used if the skill config delay is 0.

### `sleepy (name)` ~ example: sleepy player.one
- Add name to sleep priority list.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `sleepyr (name)` ~ example: sleepyr player.one
- Remove a name from the sleep priority list.
### `pp (name)` ~ example: pp player.one
- Add name to plague priority list.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `ppr (name)` ~ example: ppr player.one
- Remove a name from the plague priority list.
### `bl (name)` ~ example: bl player.one
- Add name to enemy CC lockon block list, this makes you not lockon to them.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `blr (name)` ~ example: blr player.one
- Remove a name from the plague priority list.
### `dd (name)` ~ example: bl player.one
- Add name to enemy DMG lockon block list, this makes you not lockon to them.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `ddr (name)` ~ example: blr player.one
- Remove a name from the plague priority list.
### `dh (name)` ~ example: dh player.one
- Add name to teammate Heal lockon block list so you won't lockon to them.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `dhr (name)` ~ example: dhr player.one
- Remove a name from the plague priority list.

## WARNING
### Do not use tparty/tb/te/tnpc directly before you cast a lockon, you will crash if you do so.
### You must wait 5-15 seconds for the targets gameId to be updated before you can safely cast a lockon skill.

### `tparty` ~ test party
- Sorts your party members by health, then prints it out onto the proxy display(cmd).
### `tb` ~ test boss
- Sorts your target bosses by distance, then prints it out onto the proxy display(cmd).
### `te` ~ test enemy
- Sorts your target enemy players by distance, then prints it out onto the proxy display(cmd).
### `tnpc` ~ test npc
- Sorts your target NPCs by distance, then prints it out onto the proxy display(cmd).
### `cparty` ~ clear party list
- Clears the party members list, then prints it out onto the proxy display(cmd), which should be empty.
### `cb` ~ clear boss list
- Clears the boss list, then prints it out onto the proxy display(cmd), which should be empty.
### `ce` ~ clear enemies list
- Clears the enemy list, then prints it out onto the proxy display(cmd), which should be empty.
### `cnpc` ~ clear npc list
- Clears the NPC list, then prints it out onto the proxy display(cmd), which should be empty.

### `ml` ~ my location
- Prints your location (x, y, z) out onto the proxy display(cmd).



## Issues
- Skills can ghost if proxy is also using Skill-Prediction (You see the skill animation but nothing happens). Workaround is to disable the skills in SP. [Click here to see how](https://i.imgur.com/bS4VkbX.png)
- Pressing a lockon while using another SP enabled skill will sometimes lead to the lockon not targeting anyone, and won't target anyone until you manually cast the lockon or another skill. The fix is to disable SP emulation of the lockon skills.

## Changelog
<details>
	
	- TODO: Edit skill config by command
	- TODO: Add lockons-light (test if I can lockon during their I-frames)
	- TODO: Reload config by command
	- TODO: Don't try to lockon to non-partied(enemy) guild members
	- TODO: Make increase max target number glyphs work for archer/sorc, probably never...
	- TODO: Make there be a timeout so that if an enemy hasn't been updated in a long time we reset their location, maybe?
	- TODO: Make boss list never bug, aka boss resets
	- TODO: Add buffed target prioritization
	- TODO: Fix printing BigInts and then locking on causing the game to crash
	3.0
	- Complete refactor
	- Fix: BigInts print now, but printing a BigInt and then casting a skill will cause you to crash
	- New: Can now target mobs
	- New: Can now target both bams, npcs, and players at the same time (plague all 3 in 1 skill cast)
	- Edit: Added and removed various commands and settings
	2.41
	- Fixed for patch 77 and BigInts
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
	
	S_LOGIN 12
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
