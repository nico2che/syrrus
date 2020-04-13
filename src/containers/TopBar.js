import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  ButtonGroup,
  Button,
  makeStyles,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles(() => ({
  viewType: {
    color: "white",
    borderColor: "white",
  },
  title: {
    flexGrow: 1,
  },
}));

function TopBar() {
  const classes = useStyles();
  const history = useHistory();
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
    </AppBar>
  );
}

export default TopBar;
