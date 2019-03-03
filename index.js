/* global info, xelib, registerPatcher, patcherUrl, patcherPath */

registerPatcher({
  info: info,
  gameModes: [ xelib.gmSSE, xelib.gmTES5 ],
  settings: {
    label: info.name,
    hide: false,
    templateUrl: `${patcherUrl}/partials/settings.html`,
    defaultSettings: {
      title: info.name,
      patchFileName: 'Smart Patch.esp'
    }
  },
  getFilesToPatch: filenames => {
    return filenames
  },
  execute: (patchFile, helpers, settings, locals) => ({
    initialize: () => {
      // initialize
      // measure the execution time
      locals.start = new Date()
      // initialize the path
      const srcPath = `${patcherPath}/src`
      // load zone types
      locals.zoneTypeDefault = require(`${srcPath}/zoneTypeDefault.json`)
      locals.zoneTypesByKeyword = require(`${srcPath}/zoneTypesByKeyword.json`)
      locals.zoneTypesByEDID = require(`${srcPath}/zoneTypesByEDID.json`)
      locals.zoneTypesByBoth = require(`${srcPath}/zoneTypesByBoth.json`)
      // load functions
      locals.operateZoneTypes = require(`${srcPath}/operateZoneTypes.js`)(helpers, locals)
      locals.traverseUp = require(`${srcPath}/traverseUp.js`)(helpers, locals)
      locals.processByKeyword = require(`${srcPath}/processByKeyword.js`)(helpers, locals)
      locals.processByEDID = require(`${srcPath}/processByEDID.js`)(helpers, locals)
      locals.processByBoth = require(`${srcPath}/processByBoth.js`)(helpers, locals)
    },
    process: [{
      load: {
        signature: 'ECZN',
        filter: record => {
          // filter for winning overrides and for zones assigned to a location (which is not the NULL ref)
          return xelib.IsWinningOverride(record) && xelib.HasElement(record, 'DATA\\Location') && xelib.GetLinksTo(record, 'DATA\\Location') !== 0
        }
      },
      patch: record => {
        // we get the winning override of the location
        const location = xelib.GetWinningOverride(xelib.GetLinksTo(record, 'DATA\\Location'))
        // clone and start from the default zone type
        const zoneType = Object.assign({}, locals.zoneTypeDefault)
        // process by keyword
        locals.processByKeyword(zoneType, location)
        // process by EDID
        locals.processByEDID(zoneType, location)
        // process by both
        locals.processByBoth(zoneType, location)

        // helpers.logMessage(`${xelib.EditorID(record)} - ${xelib.EditorID(location)}`)
        // helpers.logMessage(`${JSON.stringify(zoneType)}\n`)
        // patch it
        // set the levels
        if (zoneType.MinLevel !== undefined) xelib.SetUIntValue(record, 'DATA\\Min Level', zoneType.MinLevel)
        if (zoneType.MaxLevel !== undefined) xelib.SetUIntValue(record, 'DATA\\Max Level', zoneType.MaxLevel)
        // set the never resets flag
        if (zoneType.NeverResets !== undefined) xelib.SetFlag(record, 'DATA\\Flags', 'Never Resets', zoneType.NeverResets)
        // set the match level flag
        if (zoneType.MatchLevel !== undefined) xelib.SetFlag(record, 'DATA\\Flags', 'Match PC Below Minimum Level', zoneType.MatchLevel)
        // set the combat boundary flag
        if (zoneType.DisableBoundary !== undefined) xelib.SetFlag(record, 'DATA\\Flags', 'Disable Combat Boundary', zoneType.DisableBoundary)

        // REVIEW if it's good practice
        // // assign the zone to the map marker of its location
        // if (xelib.HasElement(location, 'MNAM')) {
        //   let mapMarker = xelib.GetWinningOverride(xelib.GetLinksTo(location, 'MNAM'))
        //   mapMarker = xelib.CopyElement(mapMarker, patchFile, false)
        //   // xelib.AddElementValue(mapMarker, 'XEZN', xelib.GetHexFormID(record))
        //   xelib.AddElement(mapMarker, 'XEZN')
        //   xelib.SetLinksTo(mapMarker, record, 'XEZN')
        // }
      }
    }],
    finalize: () => {
      // log the execution time
      locals.time = new Date() - locals.start
      helpers.logMessage(`Took ${locals.time / 1000} seconds`)
    }
  })
})
