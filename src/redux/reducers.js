import {collect} from "collect.js";

const data = (state = [] , action) => {

    switch(action.type) {
        case 'FETCH_POOL_DATA':
            const collection = collect(state.concat(action.payload.data));
            const unique = collection.unique('pairAddress');
            return unique.all();
        default:
            return state
    }
}

export default data