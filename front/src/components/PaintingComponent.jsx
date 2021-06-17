import React, { Component } from 'react';
import {connect} from "react-redux"
import {Form} from "react-bootstrap"
import BackendService from "../services/BackendService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronLeft, faSave} from "@fortawesome/free-solid-svg-icons";
import {alertActions} from "../utils/Rdx";
import Alert from "react-bootstrap/Alert";
import {logger} from "redux-logger/src";
class PaintingComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: this.props.match.params.id,
            name: '',
            author: '',
            museum:'',
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
        let err = '';
        if (!this.state.name) {
            err += "Название картины должно быть указано"
        }
        if (!this.state.author) {
            err += " Автор картины должна быть указана"
        }
        if (!this.state.museum) {
            err += " Музей должен быть указан"
        }
        if (err) {
            this.props.dispatch(alertActions.error(err))
            this.setState({alertShow: true, alertMessage: err});
            return ;
        }
        let painting = {id: this.state.id, name: this.state.name, author: this.state.author, museum: this.state.museum};
        if (parseInt(painting.id) === -1) {
            BackendService.createPainting(painting)
                .then((res) => {
                    if (res.data.error) {
                        console.log(res.data.error)
                        throw new Error(res.data.error);
                    }
                    this.props.history.push('/paintings')
                })
                .catch((e) => {
                    this.props.dispatch(alertActions.error(e));
                    this.setState({alertShow: true, alertMessage: 'Такая картина уже есть уже есть'});
                })
        } else {
            BackendService.updatePainting(painting)
                .then(() => this.props.history.push('/paintings'))
                .catch(() => {
                })
        }
    }

    componentDidMount() {
        if (parseInt(this.state.id) !== -1) {
            BackendService.retrievePainting(this.state.id)
                .then(async (resp) => {
                    console.log(resp.data, 'data')
                    const info = await BackendService.retrieveMuseumsAndArtist(resp.data.artistid, resp.data.museumid);
                    console.log(info, 'info');
                    this.setState({
                        name: resp.data.name,
                        author: info.artist,
                        museum: info.museum,
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
                        <h3>Страна</h3>
                        <button
                            className="btn btn-outline-secondary ml-auto"
                            onClick={() => this.props.history.goBack()}><FontAwesomeIcon icon={faChevronLeft}/>{' '}Назад
                        </button>
                    </div>
                    <Form onSubmit={this.onSubmit}>
                        <Form.Group>
                            <Form.Label>Название</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите название картины"
                                onChange={this.handleChange}
                                value={this.state.name}
                                name="name"
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Автор</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите автор картины"
                                onChange={this.handleChange}
                                value={this.state.author}
                                name="author"
                                autoComplete="off"
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Музей</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите музей картины"
                                onChange={this.handleChange}
                                value={this.state.museum}
                                name="museum"
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

export default connect()(PaintingComponent);