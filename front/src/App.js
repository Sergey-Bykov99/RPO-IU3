import React from "react";
import "./App.css";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from "history";
import NavigationBar from "./components/NavigationBar";
import Login from "./components/Login";
import Home from "./components/Home";
import Utils from "./utils/Utils";
import {connect} from "react-redux";


const AuthRoute = props => {
    let user = Utils.getUserName();
    if (!user) return <Redirect to={"/login"}/>;
    return <Route {...props}/>;
};

const history = createBrowserHistory();

function App(props) {
  return (
    <div className="App">
      <Router history={ history }>
          <NavigationBar/>
          <div className="container-fluid">
              {props.error_message &&
              <div className="alert alert-danger m-1">{props.error_message}</div>
              }
              <Switch>
                  <AuthRoute path="/home/" component={Home}/>
                  <Route path="/login" component={Login}/>
              </Switch>
          </div>
      </Router>
    </div>
  );
}

function mapStateToProps(state) {
    const {msg} = state.alert;
    return {error_message: msg}
}

export default connect(mapStateToProps)(App);
