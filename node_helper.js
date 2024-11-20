/* global module */

/* Magic Mirror
 * Node Helper: MMM-TidesUK
 *
 * By Simon Cowdell
 * MIT Licensed.
 * byCountryUrl
 * Rewrite and simplification to avoid request.
 */

var NodeHelper = require('node_helper')
module.exports = NodeHelper.create({

  async socketNotificationReceived(notification, payload) {
    const self = this

    if (notification === "GET_TIDES") {
      let url = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/" + payload.StationID + "/TidalEvents?duration=3";

      if (payload.difficulties)
        url += `&difficulties=${payload.difficulties}`
      if (payload.tags)
        url += `&tags=${payload.tags}`

      try {
        const response = await fetch(url, {
          headers: {
          'Host': 'admiraltyapi.azure-api.net',
          'Ocp-Apim-Subscription-Key': payload.AdmiraltyKey,
          'Content-Type': 'application/json'
             }})
         const body = await response.json();
        self.sendSocketNotification('TIDAL_RESULT', body)
      } catch (error) {
        self.sendSocketNotification("TIDES_FAILED", error);
      }
    }
  },
})
  
});
