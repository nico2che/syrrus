export const GET_INVENTORY = "GET_INVENTORY";
export const SET_INVENTORY = "SET_INVENTORY";
export const START_INVENTORY = "START_INVENTORY";

export const GET_JOBS = "GET_JOBS";
export const SET_JOBS = "SET_JOBS";

export function getInventory() {
  return {
    type: GET_INVENTORY
  };
}

export function setInventory(items) {
  return {
    type: SET_INVENTORY,
    items
  };
}

export function startInventory(startDate) {
  return {
    type: START_INVENTORY,
    startDate
  };
}

export function getJobs() {
  return {
    type: GET_JOBS
  };
}

export function setJobs(items) {
  return {
    type: SET_JOBS,
    items
  };
}
