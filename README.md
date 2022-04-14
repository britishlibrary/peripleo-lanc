# Peripleo LaNC

Peripleo LaNC is a prototype application for spatio-temporal search and visualization of collection data, currently under 
development as part of the [**Locating a National Collection project**](https://britishlibrary.github.io/locating-a-national-collection/home.html) (LaNC).

LaNC investigates how creating links between locations in different collections might open up new forms of research, engagement and interaction for different audiences. Based at the British Library, project partners include: National Trust, Historic Royal Palaces, Historic England, Historic Environment Scotland, Museum of London Archaeology, Portable Antiquities Scheme, English Heritage.

LaNC is a Foundation project within the AHRC-funded [Towards a National Collection Programme](https://www.nationalcollection.org.uk/).

## LaNC Project Partners

Thanks to various project partners and others, who may retain copyright in their respective sample datasets used in this software:

- [English Heritage](https://www.english-heritage.org.uk/)
- [Historic England](http://www.HistoricEngland.org.uk) - contains Ordnance Survey data © Crown copyright and database right 2020.
- [Historic Environment Scotland](https://www.historicenvironment.scot/) - Scottish Charity No. SC045925 © Crown copyright and database right 2020.
- [Historic Royal Palaces](https://www.hrp.org.uk/)
- [Museum of London Archaeology](https://www.mola.org.uk/)
- [The National Trust](https://www.nationaltrust.org.uk/) - Registered Charity in England & Wales No. 205846
- [The Portable Antiquities Scheme](https://finds.org.uk/) - linked images Courtesy of the Portable Antiquities Scheme - © The British Museum.
- [Viae Regiae](https://viaeregiae.org/) - a volunteer-driven member project of the Pelagios Network

## Development

To run Peripleo in development mode:

- `npm install` once, to download project dependencies
- `npm start`

## Site Preview

The project web site can be found [here](https://britishlibrary.github.io/locating-a-national-collection/home.html), and includes several examples of geospatial datasets rendered as maps using *Peripleo*.

## Configuration File Format

Peripleo's data and appearance is configured through a configuration file (usually `peripleo.config.json`). Example:

```json
{
  "initial_bounds": [-7.9, 49.5, 2.2, 59.4], 
  "map_style": "https://api.maptiler.com/maps/outdoor/style.json?key=MY_API_KEY",
  "data": [
    { "name": "Hollar", "format": "LINKED_PLACES", "src": "data/Hollar-1660.lp.json" },
    { "name": "VisitPlus", "format": "LINKED_PLACES", "src": "data/VisitPlus.lp.json" }
  ],
  "layers": [{
    "name": "A Google-Maps-style XYZ tile layer",
    "type": "raster",
    "tiles": [
      "https://www.example-tileserver.com/tiles/{z}/{x}/{y}.png"
    ],
    "tileSize": 256,
    "attribution": "Example tiles",
    "minzoom": 0,
    "maxzoom": 22
  }],
  "facets": [
    "dataset",
    { "name": "organisation", "path": ["properties", "organisation" ] },
    { "name": "custodian", "path": ["relations", "label"], "condition": [ "relationType", "http://vocab.getty.edu/page/aat/300160390" ] },
    "type",
    { "name": "technique", "path": ["relations", "label"], "condition": [ "relationType", "aat:300138082" ] },
    "has_image"
  ],
  "link_icons": {
    "www.nationaltrust.org.uk": "logos/www.nationaltrust.org.uk.png",
    "www.mola.org.uk": "logos/www.mola.org.uk.png",
    "www.historicenvironment.scot": "logos/www.historicenvironment.scot.png",
  }
}
```

### Configuration Properties

- __initial_bounds__: the extent of the map that will be shown on initial start, __if no other center/zoom setting is set in the URL__
- __map_style__ (optional): the URL to a vector basemap style, e.g. from MapBox or MapTiler. If left out, Peripleo will load with an empty background
- __layers__ (optional): additional base layers. Peripleo currently supports GeoJSON and raster tile base layers.
- __facets__ (optional): the facets shown in the filter panel. Each facet configuration can be either a string, for built-in facets common to the Linked Places format (`dataset`, `type`, `has_image`), or a JSON object with `name`, `path` and optional `condition` filter.
- __link_icons__ (optional): URLs to icon images that should be used in the "related records" list of the map popup

#### About Additional Baselayers

In the `layers` array, Peripleo supports GeoJSON and raster tile sources. Each layer configuration object __must__
have a `name` field, and a `type` field with a value of either `geojson` or `raster`. Examples:

```json
{ 
  "name": "SW Rivers", 
  "type": "geojson",
  "src": "layers/SW_rivers.geojson", 
  "color": "#5555ff" 
}
```

```json
{
  "name": "A Google-Maps-style XYZ tile layer",
  "type": "raster",
  "tiles": [
    "https://www.example-tileserver.com/tiles/{z}/{x}/{y}.png"
  ],
  "tileSize": 256,
  "attribution": "Example tiles",
  "minzoom": 0,
  "maxzoom": 22
}
```

#### About Facets

Every custom facet configuration __must__ have a `name` and a `path` field. The name will be shown (capitalized)
as a title in the filter legend. The `path` defines from which part of the record Peripleo will aggregate 
result counts.

For example, if you set `path: 'category'`, Peripleo will aggregate the values found in the `category` field at 
the top of each data record. If you want to aggregate the values found in `properties.category` of each record,
set the path to `path: [ 'properties', 'category' ]`.

Peripleo supports multi-value aggregation as well as paths with list structures. I.e. if you set 
`path: [ 'types', 'label' ]`, Peripleo will be able to aggregate from the following record data structures:

```json
{
  "types": {
    "label": "My Custom Type #1"
  }
}
```

```json
{
  "types": [{
    "label": "My Custom Type #1"
  },{
    "label": "My Custom Type #2"
  }]
}
```


```json
{
  "types": {
    "label": [ "My Custom Type #1", "My Custom Type #2" ]
  }
}
```

```json
{
  "types": [{
    "label": [ "My Custom Type #1", "My Custom Type #2" ]
  }, {
    "label": [ "My Custom Type #3", "My Custom Type #4" ]
  }]
}
```
