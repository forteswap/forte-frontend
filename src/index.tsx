import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import {Provider} from 'react-redux';
import store from './redux/store';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter} from "react-router-dom";
import './style/index.css'

ReactDOM.createRoot(document.getElementById('root') as Element).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
);

reportWebVitals();
