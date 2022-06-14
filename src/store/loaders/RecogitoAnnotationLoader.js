import { normalizeURI, getBounds } from '..';

/**
 * Essentially need to turn an annotation into a GeoJSON(-like) feature.
 */
const annotationToNode = (annotation, name) => {
  const id = normalizeURI(annotation.id);

  const title =
    annotation.body.find(b => b.purpose === 'transcribing')?.value || id;

  const geometry = 
    annotation.body.find(b => b.purpose === 'georeferencing')?.geometry;

  const depictions = [{
    '@id': `${id}.jpg`.replace('/annotation', '/api/annotation')
  }];

  return { 
    id, 
    title,
    dataset: name,
    properties: {
      id,
      dataset: name  
    },
    geometry,
    depictions
  };
}

export const loadImageAnnotations = (name, url, store) => 
  fetch(url)    
    .then(response => response.json())
    .then(data => {
      console.log(`Importing WebAnnotations: ${name} (${data.length} annotations)`);

      store.graph.beginUpdate();

      // Add nodes to graph and spatial tree
      const nodes = data.map(annotation => {
        // This annotation, as a node
        const node = annotationToNode(annotation, name);

        store.graph.addNode(node.id, node);

        const bounds = getBounds(node);
        if (bounds)
            store.spatialIndex.insert({ ...bounds, node });  

        return node;
      });

      store.graph.endUpdate();

      // Add to search index
      console.log('Indexing...');
      console.time('Took');
      store.index(nodes);
      console.timeEnd('Took');

      return { 
        // Dataset name,
        name,

        // Dataset node count
        nodes: nodes.length, 

        // Dataset edge count
        edges: 0
      };
    });

