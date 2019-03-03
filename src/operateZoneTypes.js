module.exports = (helpers, locals) => {
  // create the namespace for the function
  const namespace = {}

  namespace.operateZoneTypes = (baseZoneType, newZoneType) => {
    // check which operation should do
    switch (newZoneType.Operation) {
      // override all
      case 'override':
        if (typeof newZoneType.MinLevel === 'number') {
          baseZoneType.MinLevel = newZoneType.MinLevel
        }
        if (typeof newZoneType.MaxLevel === 'number') {
          baseZoneType.MaxLevel = newZoneType.MaxLevel
        }
        if (typeof newZoneType.Range === 'number') {
          baseZoneType.Range = newZoneType.Range
        }
        break

      // setup as base and sum up levels
      case 'zoning':
        if (typeof newZoneType.MinLevel === 'number') {
          baseZoneType.MinLevel += newZoneType.MinLevel
        }
        if (typeof newZoneType.MaxLevel === 'number') {
          baseZoneType.MaxLevel += newZoneType.MaxLevel
        }
        if (typeof newZoneType.Range === 'number') {
          baseZoneType.Range += newZoneType.Range
        }
        // when we are zoning, we default to traverse up the tree
        if (typeof newZoneType.Traverse !== 'boolean') {
          newZoneType.Traverse = true
        }
        break

      // default is "merge"
      default:
        // check minlevel zonetype
        if (typeof newZoneType.MinLevel === 'number' && baseZoneType.MinLevel < newZoneType.MinLevel) {
          baseZoneType.MinLevel = newZoneType.MinLevel
        }
        // check maxlevel zonetype
        if (typeof newZoneType.MaxLevel === 'number' && baseZoneType.MaxLevel < newZoneType.MaxLevel) {
          baseZoneType.MaxLevel = newZoneType.MaxLevel
        }
        // check range
        if (typeof newZoneType.Range === 'number' && baseZoneType.Range < newZoneType.Range) {
          baseZoneType.Range = newZoneType.Range
        }
        // operation done
        newZoneType.Operation = 'merge'
        break
    }
    // check flags
    if (typeof newZoneType.NeverResets === 'boolean') {
      baseZoneType.NeverResets = newZoneType.NeverResets
    }
    if (typeof newZoneType.MatchLevel === 'boolean') {
      baseZoneType.MatchLevel = newZoneType.MatchLevel
    }
    if (typeof newZoneType.DisableBoundary === 'boolean') {
      baseZoneType.DisableBoundary = newZoneType.DisableBoundary
    }
    // clean for possible mistakes
    // negative value will be set to zero
    if (typeof baseZoneType.MinLevel === 'number' && baseZoneType.MinLevel < 0) baseZoneType.MinLevel = 0
    if (typeof baseZoneType.MaxLevel === 'number' && baseZoneType.MaxLevel < 0) baseZoneType.MaxLevel = 0
    if (typeof baseZoneType.Range === 'number' && baseZoneType.Range < 0) baseZoneType.Range = 0
    // reset max level if min level is higher
    if (baseZoneType.MinLevel > baseZoneType.MaxLevel) baseZoneType.MaxLevel = 0

    // set last operation options
    baseZoneType.Operation = newZoneType.Operation
    baseZoneType.Traverse = newZoneType.Traverse

    // helpers.logMessage(`op ${JSON.stringify(baseZoneType)}`)
  }

  // return it
  return namespace.operateZoneTypes
}
