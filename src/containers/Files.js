import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
const { ipcRenderer } = window.require("electron");
/* eslint-disable import/first */

import { getInventory, setInventory, startInventory } from "../redux/actions";
import { transformPaths, FGDescription } from "../utils";

import { makeStyles } from "@material-ui/core/styles";
import { CircularProgress, Fab, Typography, Checkbox } from "@material-ui/core";
import TreeView from "@material-ui/lab/TreeView";
import TreeItem from "@material-ui/lab/TreeItem";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

const useStyles = makeStyles(theme => ({
  container: {
    height: "calc(100vh - 64px)"
  },
  loadContainer: {
    height: "100%",
    width: "100%",
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
  rootTree: {
    padding: "30px"
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0)
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1
  },
  viewType: {
    color: "white",
    borderColor: "white"
  },
  title: {
    flexGrow: 1
  },
  fab: {
    margin: theme.spacing(1),
    position: "fixed",
    bottom: "10px",
    right: "10px"
  },
  fabIcon: {
    marginRight: theme.spacing(1)
  }
}));

function Files() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const classes = useStyles();

  const dispatch = useDispatch();
  const inventory = useSelector(state => state.inventory);

  useEffect(() => {
    ipcRenderer.on("GET_INVENTORY_RESPONSE", (_, response) => {
      if (response.completed) {
        return dispatch(setInventory(response.items));
      }
      dispatch(startInventory(response.startDate));
    });
    ipcRenderer.on("DOWNLOAD_FILES_RESPONSE", console.log);
    return () => {
      ipcRenderer.removeAllListeners("GET_INVENTORY_RESPONSE");
      ipcRenderer.removeAllListeners("DOWNLOAD_FILES_RESPONSE");
    };
  }, []);

  if (inventory.loading) {
    return (
      <div className={classes.loadContainer}>
        <div className={classes.loadDetails}>
          <CircularProgress color="secondary" />
        </div>
      </div>
    );
  }

  if (!inventory.completed) {
    dispatch(getInventory());
    ipcRenderer.send("GET_INVENTORY");
    return (
      <div className={classes.loadContainer}>
        <div className={classes.loadDetails}>
          <CircularProgress color="secondary" />
          <p>Waiting for the inventory</p>
          <p>
            <small>
              inventory retrieval initiated at: {inventory.startDate}
            </small>
          </p>
        </div>
      </div>
    );
  }

  const checkItem = node => {
    return e => {
      e.stopPropagation();
      node.checked = e.target.checked;
      setSelectedFiles(getSelectedFiles(inventory.items.children));
    };
  };

  const renderTree = nodes =>
    nodes.id && (
      <TreeItem
        className="file-line"
        key={nodes.id}
        nodeId={nodes.id}
        label={
          <div className={classes.labelRoot}>
            <Checkbox onClick={checkItem(nodes)} />
            <span className={classes.labelText}>{nodes.name}</span>
            {nodes.children && (
              <Typography variant="caption" color="inherit">
                {nodes.children.length}
              </Typography>
            )}
          </div>
        }
      >
        {Array.isArray(nodes.children)
          ? nodes.children.map(node => renderTree(node))
          : null}
      </TreeItem>
    );

  const getSelectedFiles = folder => {
    const files = [];
    for (const file of folder) {
      if (file.checked && file.type === 2) {
        files.push(file);
      }
      if (file.children) {
        [].push.apply(files, getSelectedFiles(file.children));
      }
    }
    return files;
  };

  const paths = {
    id: "root",
    name: "chevigne",
    children: []
  };
  inventory.items.ArchiveList.map(archive => ({
    id: archive.ArchiveId,
    name: FGDescription(archive.ArchiveDescription),
    size: archive.Size
  })).map(line => transformPaths(paths, line.name, line.id));

  return (
    <div className={classes.container}>
      <TreeView
        className={classes.rootTree}
        defaultCollapseIcon={<ExpandMoreIcon />}
        defaultExpanded={["root"]}
        defaultExpandIcon={<ChevronRightIcon />}
      >
        {renderTree(paths)}
      </TreeView>
      {!!selectedFiles.length && (
        <Fab
          className={classes.fab}
          variant="extended"
          color="secondary"
          onClick={() => ipcRenderer.send("DOWNLOAD_FILES", selectedFiles)}
        >
          <CloudDownloadIcon className={classes.fabIcon} />
          {selectedFiles.length}
        </Fab>
      )}
    </div>
  );
}

export default connect()(Files);
