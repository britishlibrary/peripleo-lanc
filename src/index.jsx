import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import App from './App';
import { StoreContextProvider } from './store';
import URLState from './state/URLState';

import './index.scss';

import 'react-image-lightbox/style.css';

ReactDOM.render(
  <RecoilRoot>
    <StoreContextProvider>
      <URLState />  
      <HashRouter>
        <Routes>
          <Route> 
            <Route path="/:zoom/:lon/:lat" element={<App />} />
            <Route path="/" element={<App />} />
          </Route> 
        </Routes>
      </HashRouter>
    </StoreContextProvider>
  </RecoilRoot>
, document.getElementById('app'));