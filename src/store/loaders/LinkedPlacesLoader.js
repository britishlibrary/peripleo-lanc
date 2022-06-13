import Store, { normalizeURI, getBounds } from '..';

import { getEmbeddedLinkedNodes } from './LinkedPlacesExtended';

/**
 * Converts a GeoJSON/LP feature into a store graph node.
 * 
 * The graph node is mostly identical to the GeoJSON feature,
 * with just a few sytactic normalizations.
 * 
 * @param {object} feature the GeoJSON feature 
 * @param {string} name the dataset name 
 * @returns {object} the graph node
 */
const featureToNode = (feature, name) => {
  const node = { ...feature };

  // LP uses '@id', whereas graph nodes use 'id'
  const id = normalizeURI(feature['@id']);
  delete node['@id'];
  node.id = id;
  node.title = node.properties.title;
  node.dataset = name;

  // For convenience when mapping
  node.properties.id = id;
  node.properties.dataset = name;
        
  return node;
}

/**
 * Fetches a Linked Places dataset from a URL and loads it into the graph store.
 * @param {string} url the dataset URL
 * @param {string} name the dataset name  
 * @param {Store} store the graph store
 */
export const loadLinkedPlaces = (name, url, store) => 
  fetch(url)    
    .then(response => response.json())
    .then(data => {
      console.log(`Importing LP: ${name} (${data.features.length} features)`);

      store.graph.beginUpdate();

      // Add nodes to graph and spatial tree
      const nodes = data.features.map(feature => {
        // This feature, as a node
        const node = featureToNode(feature, name);
        
        store.graph.addNode(node.id, node);

        const bounds = getBounds(node);
        if (bounds)
            store.spatialIndex.insert({ ...bounds, node });  

        return node;
      });

      // Special case for LPx: embedded nodes
      const embeddedNodes = nodes
        .filter(node => node.links?.length > 0)
        .reduce((all, node ) => {
          const embedded = getEmbeddedLinkedNodes(node, name);   
          
          embedded.forEach(node => {
            store.graph.addNode(node.id, node);

            const bounds = getBounds(node);
            if (bounds)
              store.spatialIndex.insert({ ...bounds, node });  
          });

          return [...all, ...embedded];
        }, []);
    
      // Add edges to graph
      const edgeCount = nodes
        .filter(node => node.links?.length > 0)
        .reduce((totalCount, node) => { 
          return totalCount + node.links.reduce((countPerNode, link) => {
            try {
              const identifier = link.identifier || link.id; // required

              if (identifier) {
                // In LinkedPlaces, links have the shape
                // { type, id }
                const sourceId = node.id;
                const targetId = normalizeURI(link.id || link.identifier);

                // Normalize in place
                link.id = targetId;

                // Note that this will create 'empty nodes' for targets not yet in
                store.graph.addLink(sourceId, targetId, link);

                return countPerNode + 1;
              } else {
                console.warn('Link does not declare identifier', link, 'on node', node);
                return countPerNode;
              }
            } catch {
              console.error('Unable to parse link', link, 'on node', node);
              return countPerNode;
            }
          }, 0)
        }, 0);

      store.graph.endUpdate();

      // Add to search index
      console.log('Indexing...');
      console.time('Took');
      store.index([...nodes, ...embeddedNodes ]);
      console.timeEnd('Took');

      return { 
        // Dataset name,
        name,

        // Dataset node count
        nodes: nodes.length + embeddedNodes.length, 

        // Dataset edge count
        edges: edgeCount,

        // Dataset structured metadata, if any
        metadata: data.indexing
      };
    });

