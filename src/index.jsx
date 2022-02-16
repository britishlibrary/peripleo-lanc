import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from "react-router-dom";

import Peripleo from './Peripleo';
import { StoreContextProvider } from './store';

import './index.scss';

ReactDOM.render(
  <StoreContextProvider>  
    <HashRouter>
      <Routes>
        <Route> 
          <Route path=":recordId" element={<Peripleo />} />
          <Route path="/" element={<Peripleo />} />
        </Route> 
      </Routes>
    </HashRouter>
  </StoreContextProvider>

, document.getElementById('app'));