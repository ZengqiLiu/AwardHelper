// utils/requiredPoints.js

/**
 * Given a single route configuration, parses its distance range (e.g. "7701-10000km"),
 * and returns the cost object if the actual distance (assumed to be in the same unit) falls within the range.
 *
 * @param {Object} route - Route configuration object.
 *   Expected properties:
 *     - distance: a string in the format "min-max" with unit appended (e.g. "7701-10000km")
 *     - cost: an object with keys: economy, premiumEconomy, business, first.
 * @param {number} actualDistance - The actual computed distance (in the same unit as in route.distance).
 * @returns {Object|null} - The cost object if the distance matches, or null otherwise.
 */
function getRequiredPoints(route, actualDistance) {
    // Expected format: "7701-10000km" or "7701-10000mi"
    const distancePattern = /^(\d+)-(\d+)(km|mi)$/i;
    const match = route.distance.match(distancePattern);
    
    if (!match) {
      console.error("Invalid distance format in route:", route.distance);
      return null;
    }
    
    const minDistance = parseFloat(match[1]);
    const maxDistance = parseFloat(match[2]);
    const routeUnit = match[3];

    // Convert actualDistance to route unit if necessary
    let distance = actualDistance;
    if (routeUnit == 'mi') {
        distance = actualDistance * 0.621371;
    } else {
        distance = actualDistance;
        
    }
  
    if (distance >= minDistance && distance <= maxDistance) {
      return route.cost;
    } else {
      return null;
    }
}
  
/**
* Given an array of route configurations (for the same departing and landing zones),
* returns the cost object for the first route whose distance range matches the actual distance.
*
* @param {Array} routes - Array of route configuration objects.
* @param {number} actualDistance - The actual computed distance (in the same unit as defined in each route).
* @returns {Object|null} - The cost object if a matching route is found; otherwise, null.
*/
function getRequiredPointsFromRoutes(routes, actualDistance) {
    for (let route of routes) {
        const cost = getRequiredPoints(route, actualDistance);
        if (cost !== null) {
            return cost;
        }
    }
    return null;
}
  
module.exports = { getRequiredPoints, getRequiredPointsFromRoutes };
  