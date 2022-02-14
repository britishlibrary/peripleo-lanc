# Source Datasets

- __Heritage for All__. A GeoJSON feature collection of ~2.800 records from two collections, with point coordinates 
  and _title_, _organization_, _url_ and (sometimes) _description_ properties. IDs are permalinks using w3id.org (But 
  w3id.org seems to have trouble with availability.) URLs point to landing pages in from different partners, and seems 
  to be on different content types. (__C) Content seems to be IIIF manifests, manifest URL seems to be constructable 
  from the _url_ parameter. (I had trouble accessing some samples though, with a permission error message.)

- __Hollar__. A wrapped GeoJSON feature collection of 94 records. Point coordinates. Has _title_ and _transcription_ properties.
  Sometimes nested comments. Links and depictions. Seems to be an LP gazetteer (PastPlace?) with names and links.

- __SW_Coins-Monasteries__. A collection of GeoJSON files, bundled with a GeoTIFF and two .KML files. The intent is visually 
  to suggest some correlation between monastic sites and archaeological coin finds - quite how this might be done requires 
  discussion. _Comment RSi: correlation between monastic sites and coin finds is definitely in the scope of the prototype. 
  Adding GeoTIFF, KML layers etc. would require a different design approach. It's definitely not factored into the current plan.
  We can brainstorm what to do about it, and see if there's leftover time in the end, perhaps._

- __VisitPlus__. Two sub-sets:
  - ~1.000 places as GeoJSON/LP. Looks similar in structure to HfA (properties: title, organization, url, description). 
  - Linked Traces-style list of 100 annotations.

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
- [ ] the links sometimes point to media. Custom format with a bunch of custom properties. 
- [ ] there are null values sometimes (broken export?)

### VisitPlus

- [ ] links to LP records via their __url__ property, not __id__!
- [ ] it's not clear to me what the purpose of the annotations is. They seem to have redundant info, repeating the gazetteer data.
- [ ] __Warning:__ might be misunderstanding of LT file format. Looks "inverted", where the target (and not body!) is the place.
  (Example: for a sound file collection with 100 items, located at the same place, there should be 100 annotations - not 1 with 100 
  bodies.)
- [ ] annotation bodies are not according to W3C 
- [ ] "bodies" often lack even basic metadata for the item (not even proper title)