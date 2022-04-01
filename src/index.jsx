import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import { StoreContextProvider } from './store';
import { FacetsContextProvider } from './state/search/FacetsContext';
import URLState from './state/URLState';

import './index.scss';

import 'react-image-lightbox/style.css';

ReactDOM.render(
  <RecoilRoot>
    <StoreContextProvider>
      <FacetsContextProvider>
        <URLState />  
        <HashRouter>
          <Routes>
            <Route> 
              <Route path="/:zoom/:lon/:lat" element={<App />} />
              <Route path="/:zoom/:lon/:lat/:args" element={<App />} />
              <Route path="/" element={<App />} />
            </Route> 
          </Routes>
        </HashRouter>
      </FacetsContextProvider>
    </StoreContextProvider>
  </RecoilRoot>
, document.getElementById('app'));