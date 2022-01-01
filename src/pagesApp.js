import React from "react";
import { BrowserRouter } from 'react-router-dom';
import PagesLinks from "./components/pages/PagesLinks";
import PagesRouter from "./components/pages/PagesRouter";

import './pagesApp.css';

class PagesApp extends React.Component {
    render () {
        return (
            <div className="pages-app">
                <PagesLinks />
                <PagesRouter />
            </div>
        )
    }
    
}

export default PagesApp;