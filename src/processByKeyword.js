/* global xelib */

module.exports = (helpers, locals) => {
  // create the namespace for the function
  const namespace = {}

  namespace.processByKeyword = (workingZoneType, location) => {
    // process through all zone types
    locals.zoneTypesByKeyword.forEach(zoneType => {
      // helpers.logMessage(`open ${JSON.stringify(zoneType)}`)
      // if no keywords are provided exit
      if (zoneType.Keywords === undefined) return
      // and its keywords
      zoneType.Keywords.forEach(keyword => {
        // helpers.logMessage(`lookup ${keyword}`)
        // if the location contains the keyword we update the zonetype
        if (xelib.HasKeyword(location, keyword)) {
          // helpers.logMessage(`=> set ${keyword}`)
          // merge the zones
          locals.operateZoneTypes(workingZoneType, zoneType)
        }
      })
    })

    // helpers.logMessage(`finally ${JSON.stringify(workingZoneType)}`)
    // if need to traverse up
    locals.traverseUp(workingZoneType, location, namespace.processByKeyword)
  }

  // return it
  return namespace.processByKeyword
}
