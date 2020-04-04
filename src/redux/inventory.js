import { GET_INVENTORY, SET_INVENTORY, START_INVENTORY } from "./actions";

const INITIAL_STATE = {
  loading: false,
  items: []
};

function inventory(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_INVENTORY:
      return Object.assign({}, state, {
        loading: true
      });
    case SET_INVENTORY:
      const { items } = action;
      return Object.assign({}, state, {
        loading: false,
        completed: true,
        items
      });
    case START_INVENTORY:
      const { startDate } = action;
      return Object.assign({}, state, {
        loading: false,
        completed: false,
        startDate
      });
    default:
      return state;
  }
}

export default inventory;
