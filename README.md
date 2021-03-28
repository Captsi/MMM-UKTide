## MMM-UKTide
An update to the current (2020) tides apps available using MMM-SORT and MMM-COVID19 as a basis for a tide app. The change was needed as worldtides no longer offered a free API and as a result other sources of information were sought. This module uses the UK Admiralty developers portal from the UK hydrographoc office, which offers free accounts. 

## Installation
In your terminal, go to your MagicMirror's Module folder:

```
cd ~/MagicMirror/modules
```
Clone this repository:
```
git clone https://github.com/Captsi/MMM-UKTide.git
```
Go to https://admiraltyapi.portal.azure-api.net/products/uk-tidal-api and create an account. You may find that once you've created the account it's easier to click on the link above a second time to take you to the correct page. You need to subscribe (free) to the UK Tidal API and make a note of the subscription key, which will be put in the main MagiMirror config file.

## Configuration
Add the module to the modules array in the config/config.js file:
```
{
	disabled: false,
	module: "MMM-UKTide",
	position: "top_left",
	config: {
		AdmiraltyKey: "YOUR API KEY",// free from Admiralty
		mode: "static",             // static or rotating
                timeFormat: "  h:mm a",     // use standard time formatting (" HH:mm" for 24 hour)
		LowText: "Low",             // Low tide text. Whatever you want or nothing "",
		HighText: "High",           // High tide text. Whatever you want or nothing "",
		height: "m",                // ft = feet, m = meters (When mode: is rotating)
		useHeader: false,           // false if you don't want a header      
		header: "",                 // Change in config file. useHeader must be true
		maxWidth: "380px",
		animationSpeed: 3000,       // fade speed
		rotateInterval: 20 * 1000,  // seconds (When mode: is rotating)
	}
},
```

 
