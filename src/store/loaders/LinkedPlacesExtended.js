import { normalizeURI } from '..';

/**
 * Handles LaNC specific extensions to the Linked Places format. Most importantly: embedded linked records.
 * Example:
 * 
 * "links": [{
 *   "type": "seeAlso",
 *   "id": "https://sounds.bl.uk/Accents-and-dialects/Evolving-English-VoiceBank/021M-C1442X06173X-0101V0",
 *   "label": "Mr Tickle in a Darlington accent",
 *   "properties": {
 *     "type": "sound",
 *     "id": "C1442X06173X-0101",
 *     "collection": "Evolving English VoiceBank",
 *     "title": "Mr Tickle in a Darlington accent",
 *     "description": "A recording of 'Mr Tickle', by Roger Hargreaves. Speaker born 1975; female. \n Self-defined linguistic identity: Darlington.",
 *     "public_note": "The Evolving English VoiceBank is a collection of recordings of a reading passage, Mr Tickle, contributed by visitors to the British Library's Evolving English exhibition in 2010/11. Comprising speakers of all ages and embracing varieties of English in the UK and overseas including non-native speakers, the VoiceBank constitutes a snapshot of English accents worldwide at the start of the 21st century.",
 *     "private_note": "Not embeddable.",
 *     "resource_url": "https://sounds.bl.uk/Accents-and-dialects/Evolving-English-VoiceBank/021M-C1442X06173X-0101V0",
 *     "place_name": "Darlington",
 *     "relationship": "Self-defined linguistic identity."
 *   }
 * }]
 */

export const getEmbeddedLinkedNodes = (node, dataset) => {
  if (node.links && node.links.length > 0) {
    return node.links
      .filter(link => link?.properties && (link.id || link.identifier))
      .map(link => {
        const id = link.id || link.identifier;
        const normalized = normalizeURI(id);

        return {
          ...link,
          id: normalized,
          title: link.label || link.properties.title,
          dataset,
          properties: {
            ...link.properties,
            id: normalized,
            dataset
          }
        }
      });
  } else {
    return [];
  }
}