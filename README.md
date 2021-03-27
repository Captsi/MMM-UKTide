Using MMM SORT as a basis for a tide app
Installation
In your terminal, go to your MagicMirror's Module folder:

cd ~/MagicMirror/modules
Clone this repository:

git clone https://github.com/bibaldo/MMM-COVID19.git
Add the module to the modules array in the config/config.js file:

{
	disabled: false,
	module: "MMM-UKTide",
	position: "top_left",
	config: {
		apiKey: "YOUR API KEY",     // free from Admiralty
		lat: "51.111111",           // your latitude
		lon: "-1.111111",          // your longitude
		mode: "static",             // static or rotating
                timeFormat: "  h:mm a",     // use standard time formatting (" HH:mm" for 24 hour)
		LowText: "Low",             // Low tide text. Whatever you want or nothing "",
		HighText: "High",           // High tide text. Whatever you want or nothing "",
		height: "m",                // ft = feet, m = meters (When mode: is rotating)
		useHeader: false,           // false if you don't want a header      
		header: "",                 // Change in config file. useHeader must be true
		maxWidth: "300px",
		animationSpeed: 3000,       // fade speed
		rotateInterval: 20 * 1000,  // seconds (When mode: is rotating)
	}
},

 
