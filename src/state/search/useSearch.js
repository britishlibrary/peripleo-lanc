import { useContext } from 'react';
import { useRecoilState } from 'recoil';

import { StoreContext } from '../../store';

import Search from './Search';
import { searchState } from '..';


const useSearch = () => {

  const { store } = useContext(StoreContext);

  const [ search, setSearchState ] = useRecoilState(searchState);

  const setSearch = (query, filters, fitMap) => {
    // TODO handle filters etc.
    const results = query ?
      store.searchMappable(query) :
      store.getAllLocatedNodes();
    
    setSearchState(new Search(query, filters, fitMap, results));
  }
    
  const clearSearch = () => 
    setSearch(new Search(null, search?.filters, search?.fitMap));

  const fitMap = () => {
    // Don't run search twice - just clone and set the flag
    const updated = search.clone();
    updated.fitMap = true;
    setSearchState(updated);
  }

  return {
    search,
    setSearch,
    clearSearch,
    fitMap
  };

}

export default useSearch;