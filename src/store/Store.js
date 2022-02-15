import createGraph from 'ngraph.graph';
import RBush from 'rbush';
import * as JsSearch from 'js-search';

import { loadLinkedPlaces } from './loaders/LinkedPlacesLoader';

export default class Store {

  constructor() {
    this.graph = createGraph();

    this.spatialIndex = new RBush();

    // Fulltext search, using node ID as primary key
    this.search = new JsSearch.Search('id');
    this.search.tokenizer = {
      tokenize(text) {
        return text
          .replace(/[.,'"#!$%^&*;:{}=\-_`~()]/g, '')
          .split(/[\s,-]+/)
      }
    };

    this.search.addIndex('title'); 
    this.search.addIndex('description');
    this.search.addIndex('names'); 
  }

  index = nodes => {
    // TODO index for fulltext search
  }

  init = config => {
    if (!config.data?.length > 0)
      throw "No data";
      
    return Promise.all(config.data.map(conf => {
      const { name, format, src } = conf;

      if (format === 'LINKED_PLACES') {
        return loadLinkedPlaces(name, src, this);
      } else {
        throw 'Unsupported format: ' + format
      }  
    }));
  }

  getNode = id =>
    this.graph.getNode(id)?.data;

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

}