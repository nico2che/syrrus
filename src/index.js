import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
import "./index.css";
import { Switch, Route, Redirect, Router } from "react-router";
import { createBrowserHistory } from "history";

import Files from "./containers/Files";
import Transfers from "./containers/Transfers";
import TopBar from "./containers/TopBar";

import reducers from "./redux/reducers";

const history = createBrowserHistory();
const store = createStore(reducers);

function App() {
  return (
    <Router history={history}>
      <Provider store={store}>
        <TopBar />
        <Switch>
          <Redirect exact path="/" to="/files" />
          <Route exact path="/files" component={Files} />
          <Route exact path="/transfers" component={Transfers} />
        </Switch>
      </Provider>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
