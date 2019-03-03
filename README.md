# Smart: encounters' levels
---

This is an experimental patcher to dynamically guess and assign levels to encounter zones.  
Based of different JSON, it will patch all `ECZN` records while walking their respective
`LCTN` to get more info about the zone.  
  
**WARNING:** this patcher is still a work in progress, thus the `JSON` contain the info to
delevel / level the world are experimental (and without support to other mods such as Wyrmstooth,
Falskaar, Moon path...).

## Properties

The properties used in all the files.

### MinLevel
`"MinLevel": number`
The minimum level of the zone.

### MaxLevel
`"MaxLevel": number`
The maximum level of the zone.

### Range
`"Range": number`
A random value range to sum when adding levels.

### NeverResets
`"NeverResets": boolean`
Sets the flag "Never Resets". The zone will never resets so once cleared, it will be cleared forever.

### MatchLevel
`"MatchLevel": boolean`
Sets the flag "Match PC Below Minimum Level". The zone will match its level with the player if 
he's below it.

### DisableBoundary
`"DisableBoundary": boolean`
Sets the "Disable Combat Boundary". Enemies can follow you through loading screens.  
*Note:* Use this property carefully!

### Traverse
`"Traverse": boolean`
Tells the patcher if should traverse up the parents location to apply the configuration.  
*Note:* Use this property carefully!

### Operation
`"Operation": string`
The type of operation the operation should do when using the object configuration.
Operations:
  - `"merge"`: it will merge only higher records into the existing.
    - For example, a `MinLevel: 10` will be overwritten by `MinLevel: 20`.
  - `"override"`: the rule of one, same as skyrim plugins. The last configuration applied wins.
  - `"zoning"`: it will sets the "base" configuration starting from the parent to which existing values 
    will be added to. This will traverse up by default.
    - For example, using `{ "Matches": [ "WhiterunHold" ], "MinLevel": 20, "Operation": "zoning" }`
      will sets all zones belonging to the Whiterun Hold to start with a base level 20.

### Example 

```JSON
{
  "MinLevel": 0,
  "MaxLevel": 0,
  "Range": 0,
  "NeverResets": false,
  "MatchLevel": false,
  "DisableBoundary": false,
  "Traverse": false,
  "Operation": "merge"
}
```

## Specialized properties

### Keywords
`"Keywords": string[]`
The location type keywords to match in order to apply the configurations.  
*Note:* this is done using a substring match strategy, so be careful and check for typos or overlaps!  
  
Every animal den will start with a minimum level of 1.

```JSON
{
  "Keywords": [
    "LocTypeAnimalDen"
  ],
  "MinLevel": 1
}
```

### Matches
`"Matches": string[]`
The editor ID of the location to match in order to apply the configurations.  
*Note:* this is done using a substring match strategy, so be careful and check for typos or overlaps!  
  
Every zones of the DLC2 book will not follow you through loading doors.

```JSON
{
  "Matches": [
    "DLC2Book"
  ],
  "DisableBoundary": false
}
```

## Files

The order of the files and their applications is signed by a priority here in the docs. The lower, the first.

### `zoneTypeDefault.json`
*Priority 1*  
This file contains the default configuration. <!-- Properties `Operation` and `Traverse` are ignored. -->

### `zoneTypesByKeyword.json`
*Priority 2*  
It uses the property `Keywords`. Apply all matching configurations for a zone if has those keywords 
in its location.  
*Note:* use here the property `Keywords`, because `Matches` will be ignored in this file.

### `zoneTypesByEdid.json`
*Priority 3*  
It uses the property `Matches`. Apply all matching configurations for a zone if its editor ID
location matches.  
*Note:* use here the property `Matches`, because `Keywords` will be ignored in this file.

### `zoneTypesByBoth.json`
*Priority 4*  
It uses the property `Keywords` first, then uses `Matches`.
