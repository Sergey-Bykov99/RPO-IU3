import React from "react";
import BackendService from "../services/BackendService";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import Alert from "./Alert";
import PaginationComponent from "./PaginationComponent";

class UsersListComponent extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            message: undefined,
            users: [],
            selected_users: [],
            show_alert: false,
            checkedItems: [],
            hidden: false,
            page: 1,
            limit: 5,
            totalCount: 0,
        }

        this.refreshUsers = this.refreshUsers.bind(this)
        this.updateUserClicked = this.updateUserClicked.bind(this)
        this.addUserClicked = this.addUserClicked.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteUsersClicked = this.deleteUsersClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
    }

    onPageChanged(cp) {
        this.refreshUsers( cp - 1 );
    }

    setChecked(v) {
        let checkedCopy = Array(this.state.users.length).fill(v);
        this.setState({checkedItems: checkedCopy});
    }

    handleCheckChange(e) {
        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedItems];
        checkedCopy[idx] = isChecked;
        this.setState({checkedItems: checkedCopy});
    }

    handleGroupCheckChange(e) {
        const isChecked = e.target.checked;
        this.setChecked(isChecked);
    }

    deleteUsersClicked() {
        let x = [];
        this.state.users.map((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0
        });
        if (x.length > 0) {
            let msg;
            if (x.length > 1) {
                msg = "Пожалуйста подтвердите удаление " + x.length + "пользователей";
            } else {
                msg = "Пожалуйста подтвердите удаление пользователя " + x[0].name;
            }
            this.setState({show_alert: true, selected_users: x, message: msg});
        }
    }

    onDelete() {
        BackendService.deleteUsers(this.state.selected_countries)
            .then(() => this.refreshUsers(this.state.page))
            .catch(() => {
            });
    }

    closeAlert() {
        this.setState({show_alert: false})
    }

    refreshUsers(cp) {
        console.log('cp', this.state.page);
        BackendService.retrieveAllUsers(cp, this.state.limit)
            .then(resp => {
                console.log('RESP', resp);
                this.setState({
                    users: resp.data, hidden: false });
            })
            .catch(() => {
                this.setState({totalCount:0, hidden: true})
            })
            .finally(() => this.setChecked(false))
    }

    componentDidMount() {
        this.refreshUsers(0);
    }

    updateUserClicked(id) {
        this.props.history.push(`/users/${id}`)
    }

    addUserClicked() {
        this.props.history.push(`/users/-1`);
    }

    render() {
        if (this.state.hidden)
            return null;
        return (
            <div className="m-4">
                <div className=" row my-2 mr-0">
                    <h3>Пользователи</h3>
                    <button className="btn btn-outline-secondary ml-auto"
                            onClick={this.addUserClicked}><FontAwesomeIcon icon={faPlus}/>{' '}-Добавить
                    </button>
                    <button className="btn btn-outline-secondary ml-2"
                            onClick={this.deleteUsersClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Удалить
                    </button>
                </div>
                <div className="row my-2 mr-0">
                    <PaginationComponent
                        totalRecords={this.state.totalCount}
                        pageLimit={this.state.limit}
                        pageNeighbours={1}
                        onPageChanged={this.onPageChanged}
                    />
                    <table className="table table-sm">
                        <thead className="thead-light">
                        <tr>
                            <th>Логин</th>
                            <th>E-mail</th>
                            <th>
                                <div className="btn-toolbar pb-1">
                                    <div className="btn-group ml-auto">
                                        <input type="checkbox" onChange={this.handleGroupCheckChange}/>
                                    </div>
                                </div>
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {console.log(this.state.users)}
                        {
                            this.state.users && this.state.users.map((user, index) =>
                                <tr key={user.id}>
                                    <td>{user.login}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm-btn-toolbar"
                                                        onClick={() => this.updateUserClicked(user.id)}>
                                                    <FontAwesomeIcon icon={faEdit} fixedWidth/></button>
                                            </div>
                                            <div className="btn-group ml-2 mt-1">
                                                <input type="checkbox" name={index}
                                                       checked={this.state.checkedItems.length > index ? this.state.checkedItems[index] : false}
                                                       onChange={this.handleCheckChange}/>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }

                        </tbody>
                    </table>
                </div>
                <Alert
                    title='Удаление'
                    message={this.state.message}
                    ok={this.onDelete}
                    close={this.closeAlert}
                    modal={this.state.show_alert}
                    cancelButton={true}
                />
            </div>
        )
    }
}

export default UsersListComponent;