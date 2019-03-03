/* global xelib */

module.exports = (helpers, locals) => {
  // create the namespace for the function
  const namespace = {}

  namespace.processByBoth = (workingZoneType, location) => {
    // get the parent location
    const parentLocation = xelib.GetLinksTo(location, 'PNAM')
    // if it is available and is not the NULL ref
    if (xelib.HasElement(location, 'PNAM') && parentLocation !== 0) {
      // get the location editor ID
      const plocEditorID = xelib.EditorID(parentLocation)
      // process through all zone types
      locals.zoneTypesByBoth.forEach(zoneType => {
        // helpers.logMessage(`open ${JSON.stringify(zoneType)}`)
        // if keywords are provided
        if (zoneType.Keywords !== undefined) {
          // its keywords first
          zoneType.Keywords.forEach(keyword => {
            // helpers.logMessage(`lookup ${keyword}`)
            // if the location contains the keyword we update the zonetype
            if (xelib.HasKeyword(parentLocation, keyword)) {
              // helpers.logMessage(`=> set ${keyword}`)
              // merge the zones
              locals.operateZoneTypes(workingZoneType, zoneType)
            }
          })
        }
        // if matches are provided
        if (zoneType.Matches !== undefined) {
          // and its matches second
          zoneType.Matches.forEach(match => {
            // helpers.logMessage(`lookup ${match}`)
            // if the location matches the given match we update it
            if (plocEditorID.indexOf(match) >= 0) {
              // helpers.logMessage(`=> set ${match}`)
              // merge the zones
              locals.operateZoneTypes(workingZoneType, zoneType)
            }
          })
        }
      })
    }

    // helpers.logMessage(`finally ${JSON.stringify(workingZoneType)}`)
    // if need to traverse up
    locals.traverseUp(workingZoneType, location, namespace.processByBoth)
  }

  // return it
  return namespace.processByBoth
}
