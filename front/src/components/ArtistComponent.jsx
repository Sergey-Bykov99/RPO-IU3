import React, { Component } from 'react';
import {connect} from "react-redux"
import {Form} from "react-bootstrap"
import BackendService from "../services/BackendService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faSave} from "@fortawesome/free-solid-svg-icons";
import {alertActions} from "../utils/Rdx";
import Alert from "react-bootstrap/Alert";
import React, {Component} from 'react';
import BackendService from "../services/BackendService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import PaginationComponent from "./PaginationComponent";


class ArtistComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            name: '',
            // countryid: '',
            century: '',
            hidden: false,
        }

        this.onSubmit = this.onSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
    }

    handleChange({target}) {
        this.setState({[target.name]: target.value});
        // this.setState({[target.countryid]: target.value});
        this.setState({[target.century]: target.value});
    };

    onSubmit(event) {
        event.preventDefault();
        event.stopPropagation();
        let err = null;
        if (!this.state.name) {
            err = "ФИО художника должно быть указано"
        }
        if (err) {
            this.props.dispatch(alertActions.error(err))
        }
        let artist = {id: this.state.id, name: this.state.name,  century: this.state.century};
        // let museum = {id: this.state.id, location: this.state.location};  countryid: this.state.countryid,
        if (parseInt(artist.id) === -1) {
            BackendService.createArtist(artist)
                .then(() => {
                    this.props.history.push('/artists')
                })
                .catch(() => {});
        } else {
            BackendService.updateArtist(artist)
                .then(() => this.props.history.push('/artists'))
                .catch(() => {
                })
        }
    }

    componentDidMount() {
        if(parseInt(this.state.id) !== -1) {
            BackendService.retrieveArtist(this.state.id)
                .then((resp) => {
                    this.setState({
                        name: resp.data.name,
                        // countryid: resp.data.countryid,
                        century: resp.data.century,
                    });
                })
                .catch(() => this.setState({hidden: true}));
        }
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="m-4">
                <div className="row my-2 mr-0">
                    <h3>Художники</h3>
                    <button
                        className="btn btn-outline-secondary ml-auto"
                        onClick={() => this.props.history.goBack()}><FontAwesomeIcon
                        icon={faChevronLeft}/>{' '}Назад
                    </button>
                </div>
                <Form onSubmit={this.onSubmit}>
                    <Form.Group>
                        <Form.Label>Название</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите название музея"
                            onChange={this.handleChange}
                            value={this.state.name}
                            name="name"
                            autoComplete="off"
                        />
                        {/*<Form.Label>Страна</Form.Label>*/}
                        {/*<Form.Control*/}
                        {/*    type="text"*/}
                        {/*    placeholder="Введите страну художника"*/}
                        {/*    onChange={this.handleChange}*/}
                        {/*    value={this.state.countryid}*/}
                        {/*    name="countryid"*/}
                        {/*    autoComplete="off"*/}
                        {/*/>*/}
                        <Form.Label>Век</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите век"
                            onChange={this.handleChange}
                            value={this.state.century}
                            name="century"
                            autoComplete="off"
                        />
                    </Form.Group>
                    <button
                        className="btn btn-outline-secondary"
                        type="submit"><FontAwesomeIcon
                        icon={faSave}/>{" "}-Сохранить
                    </button>
                </Form>
            </div>
        )
    }

}

export default connect()(ArtistComponent);