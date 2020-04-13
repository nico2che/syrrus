import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
const { ipcRenderer } = window.require("electron");
/* eslint-disable import/first */

import {
  getInventory,
  setInventory,
  startInventory,
  setCurrentPath,
} from "../redux/actions";
import { transformPaths, FGDescription, getPath } from "../utils";

import { makeStyles } from "@material-ui/core/styles";
import {
  CircularProgress,
  Fab,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@material-ui/core";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

const useStyles = makeStyles((theme) => ({
  container: {
    height: "calc(100vh - 64px)",
  },
  loadContainer: {
    height: "100%",
    width: "100%",
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

  table: {
    width: "100%",
    height: "100%",
  },
  tbody: {
    width: "100%",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
    boxSizing: "border-box",
    minWidth: "100%",
    width: "100%",
  },
  cell: {
    display: "block",
    flexGrow: 0,
    flexShrink: 0,
    width: "100%",
    height: 36,
  },

  rootTree: {
    padding: "30px",
  },
  labelRoot: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0.5, 0),
  },
  labelText: {
    fontWeight: "inherit",
    flexGrow: 1,
  },
  viewType: {
    color: "white",
    borderColor: "white",
  },
  title: {
    flexGrow: 1,
  },
  fab: {
    margin: theme.spacing(1),
    position: "fixed",
    bottom: "10px",
    right: "10px",
  },
  fabIcon: {
    marginRight: theme.spacing(1),
  },
}));

function Files() {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const classes = useStyles();

  const dispatch = useDispatch();
  const inventory = useSelector((state) => state.inventory);

  useEffect(() => {
    ipcRenderer.on("GET_INVENTORY_RESPONSE", (_, response) => {
      if (response.completed) {
        const paths = {
          id: "root",
          name: "root",
          children: [],
        };
        response.items.ArchiveList.map((archive) => ({
          id: archive.ArchiveId,
          name: FGDescription(archive.ArchiveDescription),
          size: archive.Size,
        })).map((line) => transformPaths(paths, line.name, line.id));
        return dispatch(setInventory(response.items, paths));
      }
      dispatch(startInventory(response.startDate));
    });
    ipcRenderer.on("DOWNLOAD_FILES_RESPONSE", console.log);
    return () => {
      ipcRenderer.removeAllListeners("GET_INVENTORY_RESPONSE");
      ipcRenderer.removeAllListeners("DOWNLOAD_FILES_RESPONSE");
    };
  }, [dispatch]);

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

  const paths = inventory.paths;
  const currentDirectory = getPath(paths, [...inventory.currentPath]);

  function renderRow(props) {
    const { index, style } = props;
    if (index === 0) {
      return (
        <TableRow
          className={classes.row}
          component="div"
          hover
          role="checkbox"
          tabIndex={-1}
          key={index}
          onClick={() =>
            dispatch(setCurrentPath(inventory.currentPath.slice(0, -1)))
          }
          style={style}
        >
          <TableCell className={classes.cell} component="div" variant="body">
            ..
          </TableCell>
        </TableRow>
      );
    }
    const name = currentDirectory.children[index - 1].name;
    return (
      <TableRow
        className={classes.row}
        component="div"
        hover
        role="checkbox"
        tabIndex={-1}
        key={index}
        onClick={() =>
          dispatch(setCurrentPath([...inventory.currentPath, name]))
        }
        style={style}
      >
        <TableCell className={classes.cell} component="div" variant="body">
          {name}
        </TableCell>
      </TableRow>
    );
  }

  return (
    <div className={classes.container}>
      <Table
        component="div"
        stickyHeader
        size="small"
        className={classes.table}
      >
        <TableHead component="div">
          <TableRow component="div">
            <TableCell component="div">Name</TableCell>
          </TableRow>
        </TableHead>
        <TableBody component="div" className={classes.tbody}>
          <AutoSizer>
            {({ height, width }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemCount={currentDirectory.children.length + 1}
                itemSize={37}
                // itemKey={(index, data) => data.items[index].id}
                // itemData={currentDirectory.children}
              >
                {renderRow}
              </FixedSizeList>
            )}
          </AutoSizer>
        </TableBody>
      </Table>
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
