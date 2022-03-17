export const getPreviewImage = node => {
  if (node.depictions?.length > 0) {
    // Temporary hack!
    const iiif = node.depictions.filter(d => d.selector);
    if (iiif.length > 0) {
      const d = node.depictions[0];
      const baseUrl = d['@id'].substring(0, d['@id'].lastIndexOf('/'));
      const coordinates = d.selector[0].value.substring(d.selector[0].value.indexOf('pixel:') + 6);
      return `${baseUrl}/${coordinates}/max/0/default.jpg`;
    } else {   
      return node.depictions[0]['@id'];
    }
  } 
}

export const getTypes = node => {
  if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else if (node.properties.type)
    return [ node.properties.type ];
  else if (node.types?.length > 0)
    return node.types.map(t => t.label);
  else
    return [];
}
