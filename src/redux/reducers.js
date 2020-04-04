import { combineReducers } from "redux";

import inventory from "./inventory";
import jobs from "./jobs";

const rootReducer = combineReducers({
  inventory,
  jobs
});

export default rootReducer;
