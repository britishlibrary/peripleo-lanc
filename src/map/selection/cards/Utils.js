/**
 * TODO read image attribution info.
 * 
 * {
 *   "@id": "https://s1.geograph.org.uk/geophotos/01/79/56/1795693_f274c0a0.jpg",
 *   "title": "Over the fence is the Badbury Rings point-to-point course.",
 *   "thumbnail": "https://s1.geograph.org.uk/geophotos/01/79/56/1795693_f274c0a0_120x120.jpg",
 *   "license": "http://creativecommons.org/licenses/by-sa/2.0/",
 *   "accreditation": "&copy; David Lally"
 * }
 */
export const getPreviewImage = node => {
  if (node.depictions?.length > 0) {
    const iiif = node.depictions.filter(d => d.selector);
    if (iiif.length > 0) {
      const d = iiif[0];
      const baseUrl = d['@id'].substring(0, d['@id'].lastIndexOf('/'));
      const coordinates = d.selector[0].value.substring(d.selector[0].value.indexOf('pixel:') + 6);
      return {
        src: `${baseUrl}/${coordinates}/max/0/default.jpg`,
        title: d.title,
        license: d.license,
        accreditation: d.accreditation
      };
    } else {   
      const d = node.depictions[0];
      return {
        src: node.depictions[0]['@id'], 
        title: d.title,
        license: d.license,
        accreditation: d.accreditation
      }
    }
  }}

export const getTypes = node => {
  if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else if (node.properties?.type)
    return [ node.properties.type ];
  else if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else
    return [];
}

export const formatTime = str =>
  str.replace('>=', 'after ')
     .replace('/', ' - ');