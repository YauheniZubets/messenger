import { combineReducers } from "redux";
import mesReducer from "../redux/reducer";
import preloadersReducer from "./preloaders-reducer";

let combinedReducer = combineReducers({
    stateMes: mesReducer,
    preloaders: preloadersReducer
})

export default combinedReducer;