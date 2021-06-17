import React, { Component } from 'react';
import {connect} from "react-redux"
import {Form} from "react-bootstrap"
import BackendService from "../services/BackendService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faSave} from "@fortawesome/free-solid-svg-icons";
import {alertActions} from "../utils/Rdx";
import Alert from "react-bootstrap/Alert";
import {logger} from "redux-logger/src";

class UserComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            password: '',
            hidden: false,
            alertShow: false,
            alertMessage: '',
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange({target}) {
        this.setState({[target.name]: target.value});
    };

    onSubmit(event) {
        console.log(event, 'event');
        event.preventDefault();
        event.stopPropagation();
        let err = null;
        console.log(this.state, 'STATE');
        if (!this.state.password) {
            err = "Новый пароль должен быть указан"
        }
        if (err) {
            this.props.dispatch(alertActions.error(err))
            this.setState({alertShow: true, alertMessage: err});
            return ;
        }
        let user = {id: this.state.id, np: this.state.password, email: this.state};
        console.log(user, 'user')
        BackendService.updateUser(user)
            .then(() => this.props.history.push('/users'))
            .catch(() => {
            })

    }

    componentDidMount() {
        if(parseInt(this.state.id) !== -1) {
            BackendService.retrieveCountry(this.state.id)
                .then((resp) => {
                    this.setState({
                        name: resp.data.name,
                    });
                })
                .catch(() => this.setState({hidden: true}));
        }
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <>
                {this.state.alertShow && <Alert variant={'danger'}>{this.state.alertMessage}</Alert>}
                <div className="m-4">
                    <div className="row my-2 mr-0">
                        <h3>Пользователи</h3>
                        <button
                            className="btn btn-outline-secondary ml-auto"
                            onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}Назад
                        </button>
                    </div>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group>
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите новой пароль"
                                onChange={this.handleChange}
                                value={this.state.password}
                                name="password"
                                autoComplete="off"
                            />
                        </Form.Group>
                        <button
                            className="btn btn-outline-secondary"
                            type="submit"><FontAwesomeIcon icon={faSave}/>{" "}-Сохранить
                        </button>
                    </Form>
                </div>
            </>
        )
    }

}

export default connect()(UserComponent);