export const GET_INVENTORY = "GET_INVENTORY";
export const SET_INVENTORY = "SET_INVENTORY";
export const START_INVENTORY = "START_INVENTORY";

export const GET_JOBS = "GET_JOBS";
export const ADD_JOBS = "ADD_JOBS";
export const GET_DOWNLOAD_STATUS = "GET_DOWNLOAD_STATUS";
export const SET_DOWNLOAD_STATUS = "SET_DOWNLOAD_STATUS";

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

export function addJobs(items, finished) {
  return {
    type: ADD_JOBS,
    items,
    finished
  };
}

export function getJobDownloadStatus(jobs) {
  return {
    type: GET_DOWNLOAD_STATUS,
    jobs
  };
}

export function setJobDownloadStatus(jobId, status) {
  return {
    type: SET_DOWNLOAD_STATUS,
    jobId,
    status
  };
}
