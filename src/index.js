import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import './index.css';
import PagesApp from './pagesApp';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter>
      <PagesApp />
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);


