/* global xelib */

module.exports = (helpers, locals) => {
  // create the namespace for the function
  const namespace = {}

  namespace.traverseUp = (workingZoneType, location, fn) => {
    // if need to traverse up
    if (workingZoneType.Traverse === true) {
      // get the parent location
      const parentLocation = xelib.GetLinksTo(location, 'PNAM')
      // if it is available and is not the NULL ref
      if (xelib.HasElement(location, 'PNAM') && parentLocation !== 0) {
        fn(workingZoneType, parentLocation)
      }
    }
  }

  // return it
  return namespace.traverseUp
}
