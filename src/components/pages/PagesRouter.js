import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import App from '../../App';

import Page_App from './Page_App';

class PagesRouter extends React.Component {
          
  render() {

    return (
      <Routes>
        
        <Route path="/app" element={<App/>} />
      </Routes>
    );
    
  }

}
    
export default PagesRouter;
    