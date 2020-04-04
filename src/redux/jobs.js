import { GET_JOBS, SET_JOBS } from "./actions";

const INITIAL_STATE = {
  loading: false,
  fetched: false,
  items: []
};

function jobs(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_JOBS:
      return Object.assign({}, state, {
        loading: true
      });
    case SET_JOBS:
      const { items } = action;
      return Object.assign({}, state, {
        loading: false,
        fetched: true,
        items
      });
    default:
      return state;
  }
}

export default jobs;
