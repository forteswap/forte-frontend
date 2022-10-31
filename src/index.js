import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import {Provider} from 'react-redux';
import store from './redux/store.js';
import reportWebVitals from './reportWebVitals.js';
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
);

reportWebVitals();
