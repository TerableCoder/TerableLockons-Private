# Let me autocast
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
| ------------------------------- |
| Archer - Arrow Volley			  |
| ------------------------------- |
| Sorcerer - Flaming Barrage	  |
| ------------------------------- |

## Usage
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

### `dpsdelay [time]`
- Set delay for all autocasts. Default delay is 50.

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
### `es [name]` ~ example: es Wrong
- Add name to E Stars priority list. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `esremove [name]` ~ example: esremove Wrong
- Remove a name from the E Stars priority list. You must capitalize the name the same way as it's spelled.
### `pp [name]` ~ example: pp Wrong
- Add name to plague priority list. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `ppremove [name]` ~ example: ppremove Wrong
- Remove a name from the plague priority list. You must capitalize the name the same way as it's spelled.
### `bl [name]` ~ example: bl Wrong
- Add name to enemy lockon block list, this makes you not lock onto them. You must capitalize the name the same way as it's spelled.
- You can type 'te' to get a players' name from the proxy display(cmd) outside of game, then copy it and paste it into ingame chat.
### `blremove [name]` ~ example: blremove Wrong
- Remove a name from the plague priority list. You must capitalize the name the same way as it's spelled.
### `dh [name]` ~ example: dh Wrong
- Add name to teammate lockon block list, this makes you not lock onto them. You must capitalize the name the same way as it's spelled.
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

## My Own Changelog
<details>
	
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
	S_ACTION_STAGE 7 ~ 8 on patch 75
	C_START_SKILL 7
	S_CREST_INFO 2
	S_CREST_APPLY 2
	
</details>

## Auto Heal Changelog
<details>

    1.63
    - Update for patch version 74.03
    - Removed redundant text in command messages 
    1.62
    - Updated S_PARTY_MEMBER_CHANGE_HP hook version to 4
    1.61
    - Fix: Misspelled config.js in manifest
    1.60
    - New: autocast command and feature
    - New: Configs stored in separate file
    - New: Debug command
    1.52
    - Fix: Lockons ignoring berserkers with negative health
    - Fix: Locking onto kicked party members
    1.51
    - New: Added support for Caali auto-update.
    1.50
    - New: autoheal and autocleanse commands toggle only their respectable behaviours. 
    - New: autoheal command has argument to set HP cutoff.
    - New: autoheal command has argument to toggle on/off explicitly ('autoheal on/off')
    - New: autocleanse command has argument to toggle on/off explicitly ('autocleanse on/off')
    - New: Vertical distance check.
    - Fixed: Locking onto players that left the party.
    - Fixed: Mod would only start working on players when they had moved.
    - Fixed: Mod would briefly stop working when a dead party member resses.
    - Fixed: Mod would briefly stop working after toggling via command toggle.
    1.42
    - Added S_USER_LOCATION_IN_ACTION hook.
    1.41
    - Updated protocol versions.
    - Set max distance to 32m
    1.40
    - Faster response
    - Added: Priest's Immersion skill.
    - Added: Glyphs affect number of lockon targets.
    - Fixed bug: Casting skills would reset player rotation
    - Reduced max distance to 30m
    1.30
    - Code update and aesthetics
    - Fixed bug: Locking and casting onto dead targets
    - Added Command dependency
    - Added autocleanse command
    - Removed slash support
    1.20
    - Added heal skills for low level characters.
    - Fix hp choosing bug, now targets with full hp will not receive heal.
    1.12
    - Added mystic's focus heal X
    1.11
    - Code aesthetics
    1.10
    - Disabled raid cleanse

</details>

---
