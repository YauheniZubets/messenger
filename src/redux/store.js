import { createStore } from "redux";
import combinedReducer from "../redux/combinedReducer";

let store = createStore(combinedReducer);

export default store;

