import React from "react";
import PagesLinks from "./components/pages/PagesLinks";
import PagesRouter from "./components/pages/PagesRouter";
import Start from "./components/Start/Start";
import { Provider } from "react-redux";

import store from "./redux/store";

import './pagesApp.css';

class PagesApp extends React.Component {
    render () {
        return (
            <Provider store={store}>
                <div className="pages-app">
                    <PagesRouter />
                </div>
            </Provider>
        )
    }
}

export default PagesApp;