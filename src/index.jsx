import React from 'react';
import ReactDOM from 'react-dom';
import Peripleo from './Peripleo';
import { StoreContextProvider } from './store';

import './index.scss';

ReactDOM.render(
  <StoreContextProvider>  
    <Peripleo />
  </StoreContextProvider>

, document.getElementById('app'));