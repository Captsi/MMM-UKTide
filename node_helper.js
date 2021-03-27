/* global module */

/* Magic Mirror
 * Node Helper: MMM-TidesUK
 *
 * By Simon Cowdell
 * MIT Licensed.
 * byCountryUrl
 */

var NodeHelper = require('node_helper')
var request = require('request')

			url: "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/0068/TidalEvents?duration=1", 

module.exports = NodeHelper.create({
        
  start: function () {
    console.log('Starting node helper for: ' + this.name)
  },
  getTides: function(key) {
    var self = this
    var options = {
      method: 'GET',
      url: url,
//        'x-rapidapi-key': key
      headers: {
			  'Host': 'admiraltyapi.azure-api.net',
			  'Ocp-Apim-Subscription-Key':'515a75514aee4a07837db6d60bc10e41',
		    'Content-Type': 'application/json'
		    		}
      
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body)
        console.log(response.statusCode + result);    		// uncomment to see in terminal
         self.sendSocketNotification('TIDAL_RESULT', result)
      }
    })
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_TIDES') {
      this.getTides(payload)
    }
  }
  
});
