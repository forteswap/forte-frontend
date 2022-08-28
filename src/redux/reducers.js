import {collect} from "collect.js";

const data = (state = [] , action) => {

    switch(action.type) {
        case 'FETCH_POOL_DATA':
            const newState = state.concat(action.payload.data);
            const collection = collect(newState).reverse();
            const unique = collection.unique('pairAddress').sortByDesc('tvl');
            return unique.all();
        default:
            return state
    }
}

export default data