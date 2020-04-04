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
  ListItem
} from "@material-ui/core";
import FileCopyIcon from "@material-ui/icons/FileCopy";

import { getJobs, setJobs } from "../redux/actions";

const useStyles = makeStyles(() => ({
  container: {
    height: "calc(100vh - 64px)"
  },
  loadContainer: {
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  loadDetails: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  details: {
    color: "white"
  }
}));

export default function RecursiveTreeView() {
  const classes = useStyles();

  const dispatch = useDispatch();
  const { inventory, jobs } = useSelector(state => state);

  useEffect(() => {
    ipcRenderer.on("GET_JOBS_RESPONSE", (_, jobs) => {
      const jobsWithDetails = jobs.map(job => {
        job.details = inventory.items.ArchiveList.find(
          archive => archive.ArchiveId === job.ArchiveId
        );
        return job;
      });
      dispatch(setJobs(jobsWithDetails));
    });
    return () => {
      ipcRenderer.removeAllListeners("GET_JOBS_RESPONSE");
    };
  }, []);

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
    ipcRenderer.send("GET_JOBS");
    return (
      <div className={classes.container}>
        <div className={classes.loadContainer}>
          <CircularProgress color="secondary" />
        </div>
      </div>
    );
  }

  console.log(jobs);

  // jobs.items
  //   .filter(item => !item.downloadStatus)
  //   .map(item => dispatch(getJobDownloadStatus(item.JobId)));

  return (
    <div className={classes.container}>
      <List dense={true}>
        {jobs.items.map(job => (
          <ListItem key={job.JobId}>
            <ListItemIcon>
              <FileCopyIcon className={classes.details} />
            </ListItemIcon>
            <ListItemText
              className={classes.details}
              primary={job.details.Path}
              secondary={job.StatusCode}
            />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
