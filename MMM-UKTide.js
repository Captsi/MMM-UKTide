/* Magic Mirror
 * Module: MMM-UKTide = UK Tides
 *
 * By Simon Cowdell
 * MIT License
 */

Module.register("MMM-UKTide", {

    // Module config defaults.
    defaults: {
        AdmiraltyKey: "",
        StationID: "0068",              // Chichester harbour entrance
        Duration: 3,
        mode: "static",                 // static or rotating
        timeFormat: "",
        height: "m",                    // ft = feet, m = meters for tide height
        LowText: "Low",                 // Low tide text. Whatever you want or nothing ""
        LowColour: "#FCFF00",            // Low water colour on screen - Blue 
        HighText: "High",               // High tide text. Whatever you want or nothing ""
        HighColour: "#F3172D",          // High water colour on screem - Red
        images: true,
        useHeader: false,               // False if you don't want a header
        header: "",                     // Change in config file. useHeader must be true
        maxWidth: "380px",
        LinesToShow: 6,
		animationSpeed: 3000,           // fade speed
        fadeSpeed: 4000, 
        initialLoadDelay: 1250,
        retryDelay: 2500,
        rotateInterval: 30 * 1000,      // seconds
        updateInterval: 60 * 60 * 1000, // Equals 720 of 1000 free calls a month
    },

    getStyles: function() {
        return ["MMM-UKTide.css"];
    },

    getScripts: function(){
		return ['moment.js']; // needed for MM versions without moment
	},

    start: function() {
        Log.info("Starting module: " + this.name);
        this.getInfo()

        //  Set locale.
	    this.url = "https://admiraltyapi.azure-api.net/uktidalapi/api/V1/Stations/0068/TidalEvents?duration=3";
        this.tides = [];
        this.activeItem = 0;
        this.rotateInterval = null;
        this.scheduleUpdate();
    },

    getInfo: function () {
        this.sendSocketNotification('GET_TIDES', this.config)
      },

    socketNotificationReceived: function(notification, payload) {
        var self = this
        if (notification === "TIDAL_RESULT") {
          this.tides = payload
          this.updateDom(self.config.fadeSpeed)
        }
       
      },

	// only called if the module header was configured in module config in config.js
	getHeader: function() {
		return this.data.header;
	},

	// unload the results from Admiralty API
	processData: function(data) {

		if (!data) {
			// Did not receive usable new data.
			// Maybe this needs a better check?
			Log.log("#No data");
			return;
		}

		this.data = data;
		this.loaded = true;
		this.updateDom(this.config.animationSpeed);
	},

	// Override dom generator.
	getDom: function() {
		var wrapper = document.createElement("div");

		if (!this.loaded) {
			wrapper.innerHTML = this.translate("LOADING");
			Log.log("#LOADED");
			return wrapper;
		}

		if (!this.data) {
			wrapper.innerHTML = "No data";
			Log.log("#NODATA");
			return wrapper;
		}

		
		var tableHeading = document.createElement("div");
		tableHeading.className = "divider";

		var TableIcon = document.createElement("img");
		TableIcon.className = "icon";
		TableIcon.src = "";
		
		tableHeading.appendChild(TableIcon);
		wrapper.appendChild(tableHeading);

		tableWrapper = document.createElement("table");
		tableWrapper.className = "Mytable xsmall";

		var row = tableWrapper.insertRow(-1);
		
		if(this.config.useHeader != false){
					
				var headerCell = document.createElement("th");
				headerCell.className = "Header";
				headerCell.innerHTML = "H/L";
				row.appendChild(headerCell);

				var headerCell = document.createElement("th");
				headerCell.className = "Header";
				headerCell.innerHTML = "Time";
				row.appendChild(headerCell);

				var headerCell = document.createElement("th");
				headerCell.className = "Header";
				headerCell.innerHTML = "High/Low";
				row.appendChild(headerCell);

				var headerCell = document.createElement("th");
				headerCell.className = "Header";
				headerCell.innerHTML = "Height";
				row.appendChild(headerCell);
		} else {};
		
		var tides = this.tides;
		var TableLinesToShow = Math.min(this.config.LinesToShow, tides.length);
		if(tides.length > 0) {

			for(var i = 0; i < TableLinesToShow; i++) {

				var eventWrapper = document.createElement("tr");
				eventWrapper.className = "small";
			
				var HLSymbolWrapper = document.createElement("td");
				HLSymbolWrapper.className = "small";
				
				var symbol = document.createElement("span");
				var image = document.createElement("img");
				image.className = "tag";
				HLSymbolWrapper.style.width = "30px";
				if(tides[i].EventType == "HighWater") {image.src = "modules/MMM-UKTide/images/high.png";}
				else {image.src = "modules/MMM-UKTide/images/low.png";}
				symbol.appendChild(image);
				symbol.className = "symbol";
				HLSymbolWrapper.appendChild(symbol);
				
				var timeWrapper = document.createElement("td");
				timeWrapper.className = "small";
				var dateAndTime = tides[i].DateTime;
				timeWrapper.innerHTML = moment.utc(tides[i].DateTime).local().format("ddd") + " &nbsp" + moment.utc(tides[i].DateTime).local().format(this.config.timeFormat);

				var HLTextWrapper = document.createElement("td");
				HLTextWrapper.className = "small";
				if (tides[i].EventType == "LowWater") {
					HLTextWrapper.innerHTML = " <font color=#" + this.config.LowColour +   ">" + this.config.LowText + "</font>"; 
				} else {
					HLTextWrapper.innerHTML = " <font color=#" + this.config.HighColour +   ">" + this.config.HighText + "</font>";
				}
				
				var HeightWrapper = document.createElement("td");
				HeightWrapper.className = "small";
				HeightWrapper.innerHTML = "(" + tides[i].Height.toFixed(2) + "m)";
				var now = new Date
				if (Date.now() > Date.parse(tides[i].DateTime)  - now.getTimezoneOffset()*60 *1000) {
					eventWrapper.className = "dimmed";
				} else { eventWrapper.classList.add("small", "bright", "date");}
				eventWrapper.appendChild(HLSymbolWrapper);
				eventWrapper.appendChild(timeWrapper);
				eventWrapper.appendChild(HLTextWrapper);
				eventWrapper.appendChild(HeightWrapper);

				tableWrapper.appendChild(eventWrapper);
			}
		}
		else {
			var eventWrapper = document.createElement("tr");
			eventWrapper.className = "small";

			var lineWrapper = document.createElement("td");
			lineWrapper.className = "small";

			lineWrapper.innerHTML = "NO DATA";
			eventWrapper.appendChild(lineWrapper);
			tableWrapper.appendChild(eventWrapper);
		}


		wrapper.appendChild(tableWrapper);
		return wrapper;
	},


    processTides: function(data) {
        this.tides = data; // Object
    //	console.log(this.tides); // for checking
        this.loaded = true;

    },

    scheduleCarousel: function() {
    //    console.log("Carousel of Tides");
        this.rotateInterval = setInterval(() => {
            this.activeItem++;
            this.updateDom(this.config.animationSpeed);
        }, this.config.rotateInterval);
    },

    scheduleUpdate: function() {
        setInterval(() => {
            this.getTides();
        }, this.config.updateInterval);
        this.getTides(this.config.initialLoadDelay);
    },

    getTides: function() {
        this.sendSocketNotification('GET_TIDES', this.config);
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "TIDAL_RESULT") { 
            this.processTides(payload);
            if (this.config.mode != 'static' && this.rotateInterval == null) {   // if you want static it will return false and will not try to run
            //these statements BOTH have to be true to run... if one is false the other true it will not run. Huge props to Cowboysdude for this!!!
                this.scheduleCarousel();
            }
            this.updateDom(this.config.animationSpeed);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
