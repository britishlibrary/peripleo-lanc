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
      
    config.data.forEach(conf => {
      const { name, format, src } = conf;

      if (format === 'LINKED_PLACES') {
        return loadLinkedPlaces(name, src, this);
      } else {
        throw 'Unsupported format: ' + format
      }  
    });
  }

}