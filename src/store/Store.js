import createGraph from 'ngraph.graph';
import RBush from 'rbush';
import * as JsSearch from 'js-search';

import { loadLinkedPlaces } from './loaders/LinkedPlacesLoader';

/**
 * Converts a network node to a JsSearch
 * document for indexing.
 */
const nodeToDocument = node => ({
  id: node.id,
  dataset: node.dataset,
  title: node.title,
  description: node.properties?.description,
  names: node.name ? [ node.name ] : node.names?.map(n => n.toponym)
})

export default class Store {

  constructor() {
    this.graph = createGraph();

    this.spatialIndex = new RBush();

    // Fulltext search, using node ID as primary key
    this.searchIndex = new JsSearch.Search('id');
    this.searchIndex.tokenizer = {
      tokenize(text) {
        return text
          .replace(/[.,'"#!$%^&*;:{}=\-_`~()]/g, '')
          .split(/[\s,-]+/)
      }
    };

    this.searchIndex.addIndex('title'); 
    this.searchIndex.addIndex('description');
    this.searchIndex.addIndex('names'); 
  }

  loadDataset = (config, afterLoad) => {
    const { name, format, src } = config;

    if (format === 'LINKED_PLACES') {
      return loadLinkedPlaces(name, src, this, afterLoad);
    } else {
      return new Promise((_, reject) => 
        reject(new Error('Unsupported format: ' + format)));
    }  
  }

  index = nodes => this.searchIndex.addDocuments(
    nodes.map(node => nodeToDocument(node)));

  countNodes = () => {
    let nodes = 0;
    this.graph.forEachNode(() =>{ nodes = nodes + 1; });
    return nodes;
  }

  countEdges = () => {
    let edges = 0;
    this.graph.forEachLink(() => { edges += 1; });
    return edges;
  }

  getNode = id =>
    this.graph.getNode(id)?.data;

  getLinkedNodes = id => {
    const linkedNodes = [];

    this.graph.forEachLinkedNode(id, (node, link) => {
      linkedNodes.push({ node, link });
    });

    return linkedNodes;
  }

  getNodesInBounds = (bounds, optDataset) => {
    let minX, minY, maxX, maxY;

    if (bounds.length === 4)
      [ minX, minY, maxX, maxY ] = bounds;
    else
      [[ minX, minY ], [ maxX, maxY ]] = bounds;
    
    const results = this.spatialIndex.search({ minX, minY, maxX, maxY });

    const filtered = optDataset ?
      results.filter(r => r.node.dataset === optDataset) : results;

    // We'll exclude nodes that are larger than the viewport!
    const isInsideBounds = r =>
      r.minX > minX && r.maxX < maxX && r.minY > minY && r.maxY < maxY;

    return filtered
      .filter(result =>
        result.node.geometry.type === 'Point' || isInsideBounds(result))
      .map(result => result.node);
  }

  fetchGeometryRecursive = (node, maxHops, spentHops = 0) => {
    if (spentHops >= maxHops)
      return;
    
    // Don't walk graph unnecessarily
    if (node.geometry)
      return node.geometry;

    // Get all neighbors
    const neighbors = this.getLinkedNodes(node.id).map(t => t.node.data);
    console.log('neighbours', neighbors);

    // Find first neighbour with a geometry
    const locatedNeighbour = neighbors.find(node => node.geometry);
    console.log('located neighbour', locatedNeighbour);

    if (locatedNeighbour) {
      return locatedNeighbour.geometry;
    } else if (neighbors.length > 0) {
      const nextHops = neighbors.map(node => 
        this.fetchUpstreamGeometry(node, maxHops, spentHops + 1));

      console.log(nextHops);

      return nextHops.find(geom => geom);
    }
  }

  // To be extended in the future
  search = query =>
    this.searchIndex.search(query)
      .map(document => this.getNode(document.id));

  // To be extended in the future
  searchMappable = query => {
    const withInferredGeometry = this.search(query)
      .map(node => {
        if (node.geometry?.type) {
          return node;
        } else {
          // Unlocated node - try to fetch location from the graph
          return { ...node, geometry: this.fetchGeometryRecursive(node, 2) };
        }
      })
    .filter(n => n.geometry?.type);

    return withInferredGeometry;
  }

}