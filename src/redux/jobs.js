import {
  GET_JOBS,
  ADD_JOBS,
  GET_DOWNLOAD_STATUS,
  SET_DOWNLOAD_STATUS
} from "./actions";

const INITIAL_STATE = {
  loading: false,
  fetched: false,
  fetchingDownloadStatus: false,
  statusById: {},
  items: []
};

function jobs(state = INITIAL_STATE, action) {
  switch (action.type) {
    case GET_JOBS:
      return Object.assign({}, state, {
        loading: true
      });
    case ADD_JOBS:
      return Object.assign({}, state, {
        loading: action.finished,
        fetched: true,
        items: [...action.items, ...state.items]
      });
    case GET_DOWNLOAD_STATUS:
      const jobsById = action.jobs.map(job => ({ [job.JobId]: "FETCHING" }));
      return Object.assign({}, state, {
        statusById: Object.assign({}, state.statusById, ...jobsById)
      });
    case SET_DOWNLOAD_STATUS:
      const { jobId, status } = action;
      return Object.assign({}, state, {
        statusById: Object.assign({}, state.statusById, {
          [jobId]: status
        })
      });
    default:
      return state;
  }
}

export default jobs;
