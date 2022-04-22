const LICENSES = [
  [ 'creativecommons.org/licenses/by', 'CC BY' ],
  [ 'creativecommons.org/licenses/by-sa', 'CC BY-SA' ],
  [ 'creativecommons.org/licenses/by-nc', 'CC BY-NC' ],
  [ 'creativecommons.org/licenses/by-nc-sa', 'CC BY-NC-SA' ],
  [ 'creativecommons.org/licenses/by-nd', 'CC BY-ND' ],
  [ 'creativecommons.org/licenses/by-nc-nd', 'CC BY-NC-ND' ],
  [ 'creativecommons.org/publicdomain/zero', 'CC0' ]
]

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

      let license = null;

      if (d.license) {
        const label = LICENSES.find(t => d.license.indexOf(t[0]) > - 1);
        license = {
          src: d.license,
          label: label ? label[1] : null
        };
      }

      return {
        src: node.depictions[0]['@id'], 
        title: d.title,
        license,
        accreditation: d.accreditation
      }
    }
  }
}

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