import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk'
import data from './reducers.js'

//code to setup redux dev tools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(data, composeEnhancers(
    applyMiddleware(thunk)
));

export default store