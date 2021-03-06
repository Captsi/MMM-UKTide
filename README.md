## MMM-UKTide
An update to the current (2020) tides apps available using MMM-SORT, MMM-COVID19 and MMM-Flo as a basis for a tide app. The change was needed as worldtides no longer offered a free API and as a result other sources of information were sought. This module uses the UK Admiralty developers portal from the UK hydrographic office, which offers free accounts and covers the UK at this time. 

## Installation
In your terminal, go to your MagicMirror's Module folder:

```
cd ~/MagicMirror/modules
```
Clone this repository:
```
git clone https://github.com/Captsi/MMM-UKTide.git
```
Go to https://admiraltyapi.portal.azure-api.net/products/uk-tidal-api and create an account. You may find that once you've created the account it's easier to click on the link above a second time to take you to the correct page. You need to subscribe (free) to the UK Tidal API and make a note of the subscription key, which will be put in the main MagiMirror config file. You can also visit the "Stations" API in order to get the correct StationID for your location. A sample list of StationIDs is shown in the StationID.md file in the git.

## Screenshot
|![Example: Chichester Harbour Tide](UKTide-screenshot.png)<br>*Chichester Harbour times*

## Configuration
Add the module to the modules array in the config/config.js file:
```
{
	disabled: false,
	module: "MMM-UKTide",
	position: "top_left",
	config: {
		AdmiraltyKey: "YOUR API KEY",// free from Admiralty
		StationID: "0068",          // Station ID of tidal information
		mode: "static",             // static or rotating
                timeFormat: "  h:mm a",     // use standard time formatting (" HH:mm" for 24 hour)
		LowText: "Low",             // Low tide text. Whatever you want or nothing "",
		LowColour: "#4BE000",       // Pick a HEX colour
		HighText: "High",           // High tide text. Whatever you want or nothing "",
		HighColour: "#A3DDFF",      // Pick a HEX colour
		height: "m",                // ft = feet, m = meters (When mode: is rotating)
		useHeader: false,           // false if you don't want a header      
		LinesToShow: 6,
		header: "",                 // Change in config file. useHeader must be true
		maxWidth: "380px",
		animationSpeed: 3000,       // fade speed
		rotateInterval: 20 * 1000,  // seconds (When mode: is rotating)
	}
},
```

## Functions
The tides will show the next "LinesToShow" tides from midnight. As the tide passes it will dim in intensity. You can change the text of the tidal event, and the colour of that text. 

## Custom CSS
You may want to edit your custom CSS to get the formatting the way you want it. I made sure the left hand areas were left justified, just to line things up, and made the text 24 point, but everyone will want something different. Have a good time experimenting.
