import React from 'react';
import PropTypes from 'prop-types';
import { Route, Routes } from 'react-router-dom';
import App from '../../App';
import Start from '../Start/Start';


class PagesRouter extends React.Component {
          
  render() {

    return (
      <Routes>
        <Route path="/" exact element={<Start/>} />
        <Route path="/app" element={<App/>} />
      </Routes>
    )
    
  }

}
    
export default PagesRouter;
    