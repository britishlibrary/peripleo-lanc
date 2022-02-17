import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Routes, Route } from "react-router-dom";

import App from './App';
import { StoreContextProvider } from './store';

import './index.scss';

ReactDOM.render(
  <StoreContextProvider>  
    <HashRouter>
      <Routes>
        <Route> 
          <Route path=":recordId" element={<App />} />
          <Route path="/" element={<App />} />
        </Route> 
      </Routes>
    </HashRouter>
  </StoreContextProvider>

, document.getElementById('app'));