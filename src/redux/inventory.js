import {
  GET_INVENTORY,
  SET_INVENTORY,
  START_INVENTORY,
  SET_CURRENT_PATH,
} from "./actions";

const INITIAL_STATE = {
  loading: false,
  currentPath: [],
  items: [],
  paths: {},
};

function inventory(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_INVENTORY:
      return Object.assign({}, state, {
        loading: true,
      });
    case SET_INVENTORY:
      const { items, paths } = action;
      return Object.assign({}, state, {
        loading: false,
        completed: true,
        items,
        paths,
      });
    case START_INVENTORY:
      const { startDate } = action;
      return Object.assign({}, state, {
        loading: false,
        completed: false,
        startDate,
      });
    case SET_CURRENT_PATH:
      const { currentPath } = action;
      return Object.assign({}, state, {
        currentPath,
      });
    default:
      return state;
  }
}

export default inventory;
