import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import { Switch, Route, Redirect, Router } from "react-router";
import { createBrowserHistory } from "history";
import { createLogger } from "redux-logger";

import CssBaseline from "@material-ui/core/CssBaseline";
import { createMuiTheme } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";

import "./index.css";

import Files from "./containers/Files";
import Transfers from "./containers/Transfers";
import TopBar from "./containers/TopBar";

import reducers from "./redux/reducers";

const theme = createMuiTheme({
  palette: {
    common: { black: "#000", white: "#fff" },
    background: { paper: "#fff", default: "#fafafa" },
    primary: {
      light: "#7986cb",
      main: "#3f51b5",
      dark: "#303f9f",
      contrastText: "#fff",
    },
    secondary: {
      light: "rgba(74, 144, 226, 0.55)",
      main: "rgba(74, 144, 226, 1)",
      dark: "rgba(43, 71, 168, 1)",
      contrastText: "#fff",
    },
    error: {
      light: "#e57373",
      main: "#f44336",
      dark: "#d32f2f",
      contrastText: "#fff",
    },
    text: {
      primary: "rgba(0, 0, 0, 0.87)",
      secondary: "rgba(0, 0, 0, 0.54)",
      disabled: "rgba(0, 0, 0, 0.38)",
      hint: "rgba(0, 0, 0, 0.38)",
    },
  },
});

const logger = createLogger();
const history = createBrowserHistory();
const store = createStore(reducers, applyMiddleware(logger));

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <TopBar />
          <Switch>
            <Redirect exact path="/" to="/files" />
            <Route exact path="/files" component={Files} />
            <Route exact path="/transfers" component={Transfers} />
          </Switch>
        </ThemeProvider>
      </Provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
