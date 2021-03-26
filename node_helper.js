/* Magic Mirror
 * Node Helper: Newsfeed
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */

const NodeHelper = require("node_helper");
const validUrl = require("valid-url");
const NewsfeedFetcher = require("./newsfeedfetcher.js");
const Log = require("../../../js/logger");

module.exports = NodeHelper.create({
	// Override start method.
	start: function () {
		Log.log("Starting node helper for: " + this.name);
		this.fetchers = [];
	},

	// Override socketNotificationReceived received.
	socketNotificationReceived: function (notification, payload) {
		if (notification === "ADD_FEED") {
			this.createFetcher(payload.feed, payload.config);
		}
	},

	/**
	 * Creates a fetcher for a new feed if it doesn't exist yet.
	 * Otherwise it reuses the existing one.
	 *
	 * @param {object} feed The feed object.
	 * @param {object} config The configuration object.
	 */
	createFetcher: function (feed, config) {
		const url = feed.url || "";
		const encoding = feed.encoding || "UTF-8";
		const reloadInterval = feed.reloadInterval || config.reloadInterval || 5 * 60 * 1000;

		if (!validUrl.isUri(url)) {
			this.sendSocketNotification("INCORRECT_URL", url);
			return;
		}

		let fetcher;
		if (typeof this.fetchers[url] === "undefined") {
			Log.log("Create new news fetcher for url: " + url + " - Interval: " + reloadInterval);
			fetcher = new NewsfeedFetcher(url, reloadInterval, encoding, config.logFeedWarnings);

			fetcher.onReceive(() => {
				this.broadcastFeeds();
			});

			fetcher.onError((fetcher, error) => {
				this.sendSocketNotification("FETCH_ERROR", {
					url: fetcher.url(),
					error: error
				});
			});

			this.fetchers[url] = fetcher;
		} else {
			Log.log("Use existing news fetcher for url: " + url);
			fetcher = this.fetchers[url];
			fetcher.setReloadInterval(reloadInterval);
			fetcher.broadcastItems();
		}

		fetcher.startFetch();
	},

	/**
	 * Creates an object with all feed items of the different registered feeds,
	 * and broadcasts these using sendSocketNotification.
	 */
	broadcastFeeds: function () {
		var feeds = {};
		for (var f in this.fetchers) {
			feeds[f] = this.fetchers[f].items();
		}
		this.sendSocketNotification("NEWS_ITEMS", feeds);
	},
	

	getData: function() {
		var self = this;

		this.sendSocketNotification("Test", 2);
						
		
		request({
			url: "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/0068/TidalEvents?duration=1", 
//			+ this.config.lat + "&start_longitude=" + this.config.lng,
			method: 'GET',
			headers: {
			'Host': 'admiraltyapi.azure-api.net',
			'Ocp-Apim-Subscription-Key':'515a75514aee4a07837db6d60bc10e41',
		        'Content-Type': 'application/json'
		    		},
			}, 
			function (error, response, body) {
			
			if (!error && response.statusCode == 200) {
				self.sendSocketNotification("TIME", body);
			}
			else {
				self.sendSocketNotification("ERROR", "In TIME request with status code: " + response.statusCode);
			}
		});


		setTimeout(function() { self.getData(); }, this.config.updateInterval);
		
	},

	socketNotificationReceived: function(notification, payload) {
		//var self = this;
		this.sendSocketNotification("Test", 0);
		if (notification === 'CONFIG') {
			this.sendSocketNotification("Test", 1);
			this.config = payload;
			this.getData();
		}
	}
});
