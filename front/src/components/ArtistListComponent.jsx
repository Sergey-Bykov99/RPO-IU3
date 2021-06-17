import React, {Component} from 'react';
import BackendService from "../services/BackendService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import PaginationComponent from "./PaginationComponent";

class ArtistListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: undefined,
            artists: [],
            selected_artists: [],
            show_alert: false,
            checkedItems: [],
            hidden: false,
            page: 4,
            limit: 2,
            totalCount: 0
        }

        this.refreshArtists = this.refreshArtists.bind(this)
        this.updateArtistClicked = this.updateArtistClicked.bind(this)
        this.addArtistClicked = this.addArtistClicked.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deleteArtistsClicked = this.deleteArtistsClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
    }

    onPageChanged(cp) {
        this.refreshArtists(cp-1)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.artists.length).fill(v);
        this.setState({checkedItems: checkedCopy})
    }

    handleCheckChange(e)
    {
        const idx = e.target.name;
        const isChecked = e.target.checked;

        let checkedCopy = [...this.state.checkedItems];
        checkedCopy[idx] = isChecked;
        this.setState({checkedItems: checkedCopy});
    }

    handleGroupCheckChange(e)
    {
        const isChecked = e.target.checked;
        this.setChecked(isChecked);
    }

    deleteArtistsClicked() {
        let x = [];
        this.state.artists.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Пожалуйста подтвердите удаление " + x.length + " художников";
            }
            else
            {
                msg = "Пожалуйста подтвердите удаление художника " + x[0].name;
            }
            this.setState({show_alert: true, selected_artists: x, message: msg});
        }
    }

    onDelete()
    {
        BackendService.deleteArtists(this.state.selected_artists)
            .then(() => this.refreshArtists())
            .catch(() => {})
    }

    closeAlert()
    {
        this.setState({show_alert: false})
    }

    refreshArtists(cp){
        console.log("cp2", this.state.page)
        BackendService.retrieveAllArtists(cp, this.state.limit)
            .then(
                resp => {
                    this.setState({artists: resp.data.content,
                        totalCount: resp.data.totalElements, page: cp, hidden: false});
                }
            )
            .catch(() => {this.setState({totalCount: 0, hidden: true})})
            .finally(()=>this.setChecked(false))
    }

    componentDidMount() {
        this.refreshArtists(0)
    }

    updateArtistClicked(id){
        this.props.history.push(`/artists/${id}`)
    }

    addArtistClicked(){
        this.props.history.push(`/artist/-1`)
    }

    render(){
        if (this.state.hidden)
            return null;
        return (
            <div className="m-4">
                <div className="row my-2 mr-0">
                    <h3>Художники</h3>
                    <button className="btn btn-outline-secondary ml-auto"
                            onClick={this.addArtistClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Добавить</button>
                    <button className="btn btn-outline-secondary ml-2"
                            onClick={this.deleteArtistsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Удалить</button>
                </div>
                <div className="row my-2 mr-0">
                    <PaginationComponent
                        totalRecords={this.state.totalCount}
                        pageLimit={this.state.limit}
                        pageNeighbours={1}
                        onPageChanged={this.onPageChanged} />
                    <table className="table table-sm">
                        <thead className="thead-light">
                        <tr>
                            <th>ФИО</th>
                            {/*<th>Страна</th>*/}
                            <th>Век</th>
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
                        {
                            this.state.artists && this.state.artists.map((artist, index)=>
                                <tr key={artist.id}>
                                    <td>{artist.name}</td>
                                    {/*<td>{artist.countryid}</td>*/}
                                    <td>{artist.century}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar"
                                                        onClick={()=>this.updateArtistClicked(artist.id)}>
                                                    <FontAwesomeIcon icon={faEdit} fixedWidth/>
                                                </button>
                                            </div>
                                            <div className="btn-group ml-2 mt-1">
                                                <input type="checkbox" name={index}
                                                       checked={this.state.checkedItems.length > index ? this.state.checkedItems[index]: false}
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
                    title="Удаление"
                    message={this.state.message}
                    ok={this.onDelete}
                    close={this.closeAlert}
                    modal={this.state.show_alert}
                    cancelButton={true}/>
            </div>
        )
    }
}

export default ArtistListComponent;