~~A league of legends patch history browser that will potentially never see the light of day~~

# https://resonate.moe

- Only tracks stats, does not track system changes such as sellback price
- Only bugfixes that could constitute a meaningful change in gameplay is included. Blatant exploits (e.g. duplicating for free gold) are also excluded.
  - Examples included: attacking wards disabling out of combat bonuses, item giving the wrong amount of stats.
  - Examples excluded: tooltips, visual bugs, stat tracking, shop related, lifesteal incorrectly applying to wards (insignificant), auras sometimes fail to apply at edge of range (rare edge case)
- Hotfixes on the same patch as another change are displayed as a message inside the parent patch. The infobox itself shows the item after hotfixes. An item that is not changed in the main patch but is changed by a hotfix is not specially noted as an hotfix.
- Exact formulae for effects such as 'based on missing health' aren't included.
- Though best effort is made preserve the the exact wording of the passives where appropriate, there is no guarantee of it being so, and clarity takes priority over historicality. Tooltip updates without balance changes are also untracked.
- Modern League of Legends blurs the line between items and game systems for jungle & support. Their items in recent years function more as role markers that unlock specific systems than items in the traditional sense. As a general rule, only information reasonable for in-game item tooltips are included,underlying system changes are not tracked
  - The jungle pet from S12+ is not included, despite technically being an item mechanic. Changes to jungle pet affect jungler balance, rather than item strength.
  - For support items, detailed minion execution mechanics, over-farming penalties, anti lane swap system etc. are similarly considered out of scope.
- Minor icon touchups in 10.24 are not included. The 10.24 version is directly included in the previous applicable patch.
- Ornn's Masterwork items are **not** tracked.

**Old patch notes were highly uninformative, and often do not provide enough information to accurately reconstruct an item. In particular, prior to S1, assume listed gold costs to be ballpark estimates, and provided stats to be potentially inaccurate.**

Items are being added in order listed on wiki. Potions and Consumables, Trinkets, Distributed items will be done last as low priority

Below items have old icons on the wiki, but did not specify when they were updated. If you have any idea when their original icons were switched out (even roughly), please let me know.

- Berserker's greaves (3006).
- Cloth armor (1029).
- Dagger (1042)
- Long Sword (1036)
- Chain Vest (1031)
- Glacial Shroud (3024)
- Hexdrinker (3155)
- Last Whisper (3035): This was when it had the IE icon!
- Phage (3044): with the Stinger icon
- Zeal (3086): Sheen icon
- Bloodthirster (3072): Unknown when the middle verion was in use.
- Infinity Edge (3031): Wit's End icon

These items have unknown original recipes:

- Aegis of the Legion (3105)

These items have item_ids changed during their lives

- Catalyst the Protector/Catalyst of Aeons - 3010/3803 - Listed as a single item under 3803
- Death's Dance - 3812/6333 - Listed under 6333

Some alpha/beta items do not have an ID listed on the wiki, and have been given one manually:

- Sage's Ring (9000)
- Watchful Wardstone and Stirring Wardstone somehow share the same item ID of 4638. Stirring Wardstone has been reassigned 9001.
- Kage's Lucky Pick (9002)
