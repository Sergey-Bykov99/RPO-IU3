import React, {Component} from 'react';
import BackendService from "../services/BackendService";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEdit, faPlus, faTrash} from "@fortawesome/free-solid-svg-icons";
import Alert from "./Alert";
import PaginationComponent from "./PaginationComponent";

class PaintingListComponent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: undefined,
            paintings: [],
            selected_paintings: [],
            show_alert: false,
            checkedItems: [],
            hidden: false,
            page: 1,
            limit: 100,
            totalCount: 0
        }

        this.refreshPaintings = this.refreshPaintings.bind(this)
        this.updatePaintingClicked = this.updatePaintingClicked.bind(this)
        this.addPaintingClicked = this.addPaintingClicked.bind(this)
        this.onDelete = this.onDelete.bind(this)
        this.closeAlert = this.closeAlert.bind(this)
        this.handleCheckChange = this.handleCheckChange.bind(this)
        this.handleGroupCheckChange = this.handleGroupCheckChange.bind(this)
        this.setChecked = this.setChecked.bind(this)
        this.deletePaintingsClicked = this.deletePaintingsClicked.bind(this)
        this.onPageChanged = this.onPageChanged.bind(this)
    }

    onPageChanged(cp) {
        this.refreshPaintings(cp-1)
    }

    setChecked(v)
    {
        let checkedCopy = Array(this.state.paintings.length).fill(v);
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

    deletePaintingsClicked() {
        let x = [];
        this.state.paintings.map ((t, idx) => {
            if (this.state.checkedItems[idx]) {
                x.push(t)
            }
            return 0;
        });
        if (x.length > 0) {
            var msg;
            if (x.length > 1)
            {
                msg = "Пожалуйста подтвердите удаление " + x.length + " стран";
            }
            else
            {
                msg = "Пожалуйста подтвердите удаление страны " + x[0].name;
            }
            this.setState({show_alert: true, selected_paintings: x, message: msg});
        }
    }

    onDelete()
    {
        BackendService.deletePaintings(this.state.selected_paintings)
            .then(() => this.refreshPaintings())
            .catch(() => {})
    }

    closeAlert()
    {
        this.setState({show_alert: false})
    }

    refreshPaintings(cp){
        console.log("cp2", this.state.page)
        BackendService.retrieveAllPaintings(cp, this.state.limit)
            .then(
                resp => {
                    this.setState({paintings: resp.data.content,
                        totalCount: resp.data.totalElements, page: cp, hidden: false});
                }
            )
            .catch(() => {this.setState({totalCount: 0, hidden: true})})
            .finally(()=>this.setChecked(false))
    }

    componentDidMount() {
        this.refreshPaintings(0)
    }

    updatePaintingClicked(id){
        this.props.history.push(`/paintings/${id}`)
    }

    addPaintingClicked(){
        this.props.history.push(`/paintings/-1`)
    }

    render(){
        if (this.state.hidden)
            return null;
        return (
            <div className="m-4">
                <div className="row my-2 mr-0">
                    <h3>Картины</h3>
                    <button className="btn btn-outline-secondary ml-auto"
                            onClick={this.addPaintingClicked}><FontAwesomeIcon icon={faPlus}/>{' '}Добавить</button>
                    <button className="btn btn-outline-secondary ml-2"
                            onClick={this.deletePaintingsClicked}><FontAwesomeIcon icon={faTrash}/>{' '}Удалить</button>
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
                            <th>Название</th>
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
                            this.state.paintings && this.state.paintings.map((painting, index)=>
                                <tr key={painting.id}>
                                    <td>{painting.name}</td>
                                    <td>
                                        <div className="btn-toolbar">
                                            <div className="btn-group ml-auto">
                                                <button className="btn btn-outline-secondary btn-sm btn-toolbar"
                                                        onClick={()=>this.updatePaintingClicked(painting.id)}>
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

export default PaintingListComponent;