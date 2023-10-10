import { IS_LOADING, SUCCESS_LOADING, ERROR_LOADING } from "./preloaderAC";

const initState = {
    isLoading: false,
    successLoading: false,
    errorLoading: false
};

function preloadersReducer(state = initState, action) {
    switch (action.type) {
        case IS_LOADING: {
            let newState = {...state, isLoading: true, successLoading: false, errorLoading: false};
            return newState;
        };

        case SUCCESS_LOADING: {
            let newState = {...state, isLoading: false, successLoading: true, errorLoading: false};
            return newState;
        };

        case ERROR_LOADING: {
            let newState = {...state, isLoading: false, successLoading: false, errorLoading: true};
            return newState;
        };
    
        default: return state
    }

};

export default preloadersReducer;
