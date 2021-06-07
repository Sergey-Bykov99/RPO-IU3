import React from "react";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHome, faUser} from "@fortawesome/free-solid-svg-icons";
import Utils from "../utils/Utils";
import BackendService from "../services/BackendService";
import {connect} from "react-redux";
import {userActions} from "../utils/Rdx";

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.goHome = this.goHome.bind(this)
        this.logout = this.logout.bind(this)
    }

    goHome(){
        this.props.history.push(this)
    }

    logout(){
        BackendService.logout().finally(() => {
            this.props.dispatch(userActions.logout())
            this.props.history.push('/login')
        })
    }

    render() {
        let uname = Utils.getUserName();
        return(
            <Navbar bg="light" expand="lg">
                <Navbar.Brand><FontAwesomeIcon icon={ faHome}/>{"  "}</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {/*<Nav.Link href="/home">Home</Nav.Link>*/}
                        <Nav.Link as={Link} to="/home">Home</Nav.Link>
                        <Nav.Link onClick={this.goHome}>Another home</Nav.Link>
                        <Nav.Link onClick={() => {this.props.history.push("/home")}}>Yet Another home</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
                <Navbar.Text>{this.props.user && this.props.user.name}</Navbar.Text>
                {this.props.user &&
                    <Nav.Link onClick={this.logout}><FontAwesomeIcon icon={faUser} fixedWidth/>{'  '}Выход</Nav.Link>
                }
                {!this.props.user &&
                    <Nav.Link as={Link} to="/login"><FontAwesomeIcon icon={faUser} fixedWidth/>{'  '}Вход</Nav.Link>
                }
            </Navbar>
        )
    }
}

function mapStateToProps(state) {
    const {user} = state.authentication;
    return {user};
}

export default connect(mapStateToProps)(withRouter(NavigationBar));