# Source Datasets

- __Heritage for All__. A GeoJSON feature collection of ~2.800 records from two collections, with point coordinates 
  and _title_, _organization_, _url_ and (sometimes) _description_ properties. IDs are permalinks using w3id.org (But 
  w3id.org seems to have trouble with availability.) URLs point to landing pages in from different partners, and seems 
  to be on different content types. (__C) Content seems to be IIIF manifests, manifest URL seems to be constructable 
  from the _url_ parameter. (I had trouble accessing some samples though, with a permission error message.)

- __Hollar__. A wrapped GeoJSON feature collection of 94 records. Point coordinates. Has _title_ and _transcription_ properties.
  Sometimes nested comments. Links and depictions. Seems to be an LP gazetteer (PastPlace?) with names and links. __Caution:__ 
  the links sometimes point to media. Custom format with a bunch of custom properties. There are null values sometimes.

- __VisitPlus__. [...10-15000? 7 partner collections plus 2 non-partner...]

## Problems/Questions

### General
- [ ] it would be good to have some kind of taxonomy of types, so we can at least do some minimal thematic faceting
- [ ] what to do with W3ID URLs? Will partner URLs change?

### Heritage for All
- [ ] metadata in source dataset too minimal to be useful (title, org, url) 
- [ ] no information on the content type
- [ ] no preview image URL
- [ ] either no description, or a generic one ("Listed Building")

### Hollar
The Hollar dataset really needs explaining! (Different sources, different schemas, custom properties and conventions?)
What are the expectations concerning the (sometime __many__ links)?

- [ ] the custom format where the actual content is inside the link is slightly weird. We should crosswalk to LP + LT!
- [ ] sometimes, place depictions seem to be IIIF annotations. What are the expectations concerning UI?