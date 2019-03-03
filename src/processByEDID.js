/* global xelib */

module.exports = (helpers, locals) => {
  // create the namespace for the function
  const namespace = {}

  namespace.processByEDID = (workingZoneType, location) => {
    // get the location editor ID
    const locEditorID = xelib.EditorID(location)
    // process through all zone types
    locals.zoneTypesByEDID.forEach(zoneType => {
      // helpers.logMessage(`open ${JSON.stringify(zoneType)}`)
      // if no matches are provided exit
      if (zoneType.Matches === undefined) return
      // and its matches
      zoneType.Matches.forEach(match => {
        // helpers.logMessage(`lookup ${match}`)
        // if the location matches the given match we update it
        if (locEditorID.indexOf(match) >= 0) {
          // helpers.logMessage(`=> set ${match}`)
          // merge the zones
          locals.operateZoneTypes(workingZoneType, zoneType)
        }
      })
    })

    // helpers.logMessage(`finally ${JSON.stringify(workingZoneType)}`)
    // if need to traverse up
    locals.traverseUp(workingZoneType, location, namespace.processByEDID)
  }

  // return it
  return namespace.processByEDID
}
