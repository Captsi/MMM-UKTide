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

//			url: "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/0068/TidalEvents?duration=1", 
//
module.exports = NodeHelper.create({
      start: function () {
        console.log('Starting node helper for: ' + this.name)
  },
  getTides: function() {
    var self = this;
    var myurl= "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/" + this.config.StationID + "/TidalEvents?duration=" + this.config.Duration ;
    
  //  "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/0068/TidalEvents?duration=3"
    var options = {
      method: 'GET',
      url: myurl,
//      https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/0068/TidalEvents?duration=3",
//        'x-rapidapi-key': key
      headers: {
			  'Host': 'admiraltyapi.azure-api.net',
			  'Ocp-Apim-Subscription-Key': this.config.AdmiraltyKey,
		    'Content-Type': 'application/json'
		    		}
      
    }
    request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        var result = JSON.parse(body)
  //      console.log(response.statusCode + result);    		// uncomment to see in terminal
         self.sendSocketNotification('TIDAL_RESULT', result)
      }
    })
  },

  //Subclass socketNotificationReceived received.
  socketNotificationReceived: function(notification, payload) {
    if (notification === 'GET_TIDES') {
      this.config = payload
      this.getTides()
    }
  }
  
});
