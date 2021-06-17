import React, {useState} from 'react';
import './App.css';
import { Router, Switch, Route, Redirect } from "react-router-dom";
import { createBrowserHistory } from 'history';
import NavigationBar from "./components/NavigationBar";
import Home from "./components/Home";
import Login from "./components/Login";
import Utils from "./utils/Utils"
import {connect} from "react-redux";
import CountryListComponent from "./components/CountryListComponent";
import CountryComponent from "./components/CountryComponent";
import SideBar from "./components/SideBar";
import ArtistListComponent from "./components/ArtistListComponent";
import PaintingListComponent from "./components/PaintingListComponent";
import MuseumListComponent from "./components/MuseumListComponent";
import UserListComponent from "./components/UserListComponent";
import MyAccountComponent from "./components/MyAccountComponent";
import MuseumComponent from "./components/MuseumComponent";


const AuthRoute = props => {
    let user = Utils.getUser();
    if (!user) return <Redirect to="/login" />;
    return <Route {...props} />;
};

const history = createBrowserHistory();

function App(props) {
    const [exp, setExpanded] = useState(false);

    return (
        <div className = "App">
            <Router history = { history }>
                <NavigationBar toggleSideBar={()=>setExpanded(!exp)}/>
                <div className="wrapper">
                    <SideBar expanded={exp}/>
                    <div className="container-fluid">
                        {props.error_message &&
                        <div className="alert alert-danger m-1">{props.error_message}</div>}
                        <Switch>
                            <AuthRoute path="/home" component={Home} />
                            <AuthRoute path="/countries" exact component={CountryListComponent}/>
                            <AuthRoute path="/countries/:id" component={CountryComponent}/>
                            <AuthRoute path="/artists" exact component={ArtistListComponent}/>
                            <AuthRoute path="/paintings" exact component={PaintingListComponent}/>
                            <AuthRoute path="/museums" exact component={MuseumListComponent}/>
                            <AuthRoute path="/museums/:id" component={MuseumComponent}/>
                            <AuthRoute path="/users" exact component={UserListComponent}/>
                            <AuthRoute path="/myaccount" exact component={MyAccountComponent}/>
                            <Route path="/login" component={Login} />
                        </Switch>
                    </div>
                </div>
            </Router>
        </div>
    );
}

function mapStateToProps(state) {
    const {msg} = state.alert;
    return {error_message: msg};
}

export default connect(mapStateToProps)(App);