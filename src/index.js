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

const theme = createMuiTheme();

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
