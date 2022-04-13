# Peripleo: Quick Setup #
### What you need to get started ###
* Dataset(s) formatted as [Linked Places Format (LPF)](https://github.com/LinkedPasts/linked-places-format/blob/master/README.md) or GeoJSON. 
    * You can use any such dataset if it is accessible via a URL.
    * If your data is in a spreadsheet or delimited text (for example CSV), you will need to convert it using a tool such as [Locolligo](https://github.com/docuracy/Locolligo/blob/main/README.md).
* Somewhere to host and serve a simple HTML file, together with any datasets not hosted elsewhere.

### Configuring your map ###

These are the configuration settings for the example map [here](https://descartes.emew.io/VCH/): 

~~~~
{
  "api_key": "get-your-own-key-from-https://cloud.maptiler.com/account/keys/",
  "initial_bounds": [-5.5, 49.5, 2.2, 55.8],
  "data": [
    { "name": "VCH Places", "format": "LINKED_PLACES", "src": "https://docuracy.github.io/Locolligo/datasets/VCH-Places.lp.json" }
  ],
  "facets": [
	  { "name": "County", "path": ["properties", "county"] },
	  { "name": "Schools", "path": ["properties", "schools"] },
    "type"
  ],
  "link_icons": {
      "www.british-history.ac.uk": "https://raw.githubusercontent.com/britishlibrary/peripleo-lanc/main/logos/bho.png"
    }
}
~~~~

* `api_key`: To use the default basemap you will need to get your own API Key from [MapTiler](https://cloud.maptiler.com/account/keys/). Ideally, your should limit its use to the domain on which you intend to host your files.
* `initial_bounds`: Here you specify the coordinates (in degrees of longitude and latitude) of the bottom left and top right corners of your map, in the format `[bottom-left-longitude, bottom-left-latitude, top-right-longitude, top-right-latitude]`.
* `data`: This is where your put information about each of your datasets, enclosed in {curly brackets}. You can use multiple datasets, separating them with a comma. 
* `facets`: If you want your dataset to be filtered, this is where you specify how.
* `link_icons`: These are used to prettify external links in your dataset, and are defined by the link's domain name and a URL pointing to an icon (ideally 100px square).

### Publishing your map ###

* Upload your `index.html` and configuration settings (in a file named `peripleo.config.json`) to the web server of your choice. These files must both sit in the same directory.
* **That's it !!!** Point your browser to the URL of your `index.html` file and wait for it to load.
