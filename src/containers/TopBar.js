import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  ButtonGroup,
  Button,
  makeStyles,
  Link,
} from "@material-ui/core";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { useHistory } from "react-router-dom";
import { connect, useSelector, useDispatch } from "react-redux";
import { setCurrentPath } from "../redux/actions";

const useStyles = makeStyles(() => ({
  viewType: {
    color: "white",
    borderColor: "white",
  },
  title: {
    flexGrow: 1,
  },
  pointer: {
    cursor: "pointer",
  },
  homeIcon: {
    fontSize: 22,
    marginTop: 5,
  },
  path: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
}));

function TopBar() {
  const classes = useStyles();
  const history = useHistory();

  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.inventory.currentPath);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          Syrrus
        </Typography>
        <ButtonGroup>
          <Button
            className={classes.viewType}
            onClick={() => history.push("/files")}
          >
            Files
          </Button>
          <Button
            className={classes.viewType}
            onClick={() => history.push("/transfers")}
          >
            Transfers
          </Button>
        </ButtonGroup>
      </Toolbar>
      <Toolbar variant="dense">
        <Link
          color="inherit"
          className={classes.pointer}
          onClick={() => history.push("/accounts")}
        >
          Home
        </Link>
        <NavigateNextIcon />
        <Link
          color="inherit"
          className={classes.pointer}
          onClick={() => history.push("/vaults")}
        >
          test account
        </Link>
        <NavigateNextIcon />
        <Link
          color="inherit"
          className={classes.pointer}
          onClick={() => dispatch(setCurrentPath([]))}
        >
          chevigne
        </Link>
        {currentPath.map((p, i) => (
          <div key={i} className={classes.path}>
            <NavigateNextIcon />
            <Link
              color="inherit"
              className={classes.pointer}
              onClick={() =>
                dispatch(setCurrentPath(currentPath.slice(0, i + 1)))
              }
            >
              {p}
            </Link>
          </div>
        ))}
      </Toolbar>
    </AppBar>
  );
}

export default connect()(TopBar);
