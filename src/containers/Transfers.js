import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
const { ipcRenderer } = window.require("electron");
/* eslint-disable import/first */

import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  List,
  ListItemText,
  ListItemIcon,
  ListItem,
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import {
  getJobs,
  addJobs,
  getJobDownloadStatus,
  setJobDownloadStatus,
} from "../redux/actions";

const useStyles = makeStyles(() => ({
  container: {
    height: "calc(100vh - 64px)",
  },
  loadContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadDetails: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  details: {
    color: "white",
  },
}));

export default function RecursiveTreeView() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { inventory, jobs } = useSelector((state) => state);

  useEffect(() => {
    ipcRenderer.on("GET_JOBS_RESPONSE", (_, data) => {
      const jobsWithDetails = data.JobList.map((job) => {
        job.details = inventory.items.ArchiveList.find(
          (archive) => archive.ArchiveId === job.ArchiveId
        );
        return job;
      });
      dispatch(addJobs(jobsWithDetails, !!data.Marker));
      if (data.Marker) {
        ipcRenderer.send("GET_JOBS", { marker: data.Marker });
      }
    });

    ipcRenderer.on("GET_DOWNLOAD_STATUS_RESPONSE", (_, response) => {
      const { jobId, status } = response;
      dispatch(setJobDownloadStatus(jobId, status));
    });
    return () => {
      ipcRenderer.removeAllListeners("GET_JOBS_RESPONSE");
      ipcRenderer.removeAllListeners("GET_DOWNLOAD_STATUS_RESPONSE");
    };
  }, [inventory.items.ArchiveList, dispatch]);

  if (jobs.loading) {
    return (
      <div className={classes.container}>
        <div className={classes.loadContainer}>
          <CircularProgress color="secondary" />
        </div>
      </div>
    );
  }

  if (!jobs.fetched) {
    dispatch(getJobs());
    ipcRenderer.send("GET_JOBS", {});
    return (
      <div className={classes.container}>
        <div className={classes.loadContainer}>
          <CircularProgress color="secondary" />
        </div>
      </div>
    );
  }

  const jobsToFetch = jobs.items.filter(
    (job) => job.Completed && !jobs.statusById[job.JobId]
  );
  if (jobsToFetch.length) {
    dispatch(getJobDownloadStatus(jobsToFetch));
    ipcRenderer.send("GET_DOWNLOAD_STATUS", jobsToFetch);
  }

  const getStatus = (job) => {
    if (!job.Completed) {
      return `${job.StatusCode}`;
    }
    const status = {
      FETCHING: "Retrieving download status...",
      WAIT_FOR_DOWNLOAD: "Wait for download...",
      DOWNLOADING: "Downloading...",
      DOWNLOADED: "Downloaded ✓",
    };
    return `${job.StatusCode} - ${status[jobs.statusById[job.JobId]]}`;
  };

  return (
    <div className={classes.container}>
      <List dense={true}>
        {jobs.items
          .sort((a, b) => b.details.Path - a.details.Path)
          .map((job) => (
            <ListItem key={job.JobId}>
              <ListItemIcon>
                <FileCopyIcon className={classes.details} />
              </ListItemIcon>
              <ListItemText
                className={classes.details}
                primary={`${getStatus(job)} - ${job.details.Path}`}
                secondary={""}
              />
            </ListItem>
          ))}
      </List>
    </div>
  );
}
