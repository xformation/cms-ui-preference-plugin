import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { collegeSettingsServices } from '../_services/collegeSettings.services';
import { commonFunctions } from '../_utilites/common.functions';

export class CollegeBranches extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isModalOpen: false,
            states: [],
            cities: [],
            selectedState: "",
            selectedCity: ""
        };
        this.showModal = this.showModal.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.createCitySelectbox = this.createCitySelectbox.bind(this);
    }

    componentDidMount() {
        collegeSettingsServices.getStates().then(
            response => {
                this.setState({
                    states: response
                });
            },
            error => {
                console.log(error);
            }
        );
        collegeSettingsServices.getCities().then(
            response => {
                this.setState({
                    cities: response
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    showModal(e: any, bShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow
        }));
    }

    handleStateChange(e: any) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    createCitySelectbox(selectedState: any) {
        const { cities } = this.state;
        let retData = [];
        selectedState = parseInt(selectedState);
        for (let i = 0; i < cities.length; i++) {
            let city = cities[i];
            if( selectedState === city.stateId){
                retData.push(
                    <option key={city.id} value={city.id}>{city.cityName}</option>
                );
            }
        }
        return retData;
    }

    render() {
        const { isModalOpen, states, cities, selectedState, selectedCity } = this.state;
        return (
            <div className="info-container">
                <div className="authorized-signatory-container m-b-1">
                    <h3>Colleges Branches</h3>
                    <small> Create and manage college branches.</small>
                </div>
                <button onClick={e => this.showModal(e, true)}>
                    <i className="fa fa-plus-circle"></i> Add new
                </button>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                    <ModalHeader>Add New</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">STATE</label>
                                        <select className="gf-form-input" name="selectedState" value={selectedState} onChange={this.handleStateChange} required>
                                            <option value="">
                                                Select State
                                            </option>
                                            {
                                                // commonFunctions.createSelectbox(states, "id", "id", "stateName")
                                                }
                                        </select>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">CITY</label>
                                        <select className="gf-form-input" name="selectedCity" value={selectedCity} onChange={this.handleStateChange} required>
                                            <option value="">
                                                Select City
                                            </option>
                                            {this.createCitySelectbox(selectedState)}
                                        </select>
                                    </div>
                                </div>
                                <div className="fwidth-modal-text modal-fwidth">
                                    <label className="gf-form-label b-0 bg-transparent">BRANCH NAME</label>
                                    <input type="text" required className="gf-form-input " placeholder="branch name" />
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">ADDRESS</label>
                                        <input type="text" required className="gf-form-input" placeholder="address line 2" />
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent"></label>
                                        <input type="text" required className="gf-form-input" placeholder="addresss line 1" />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">BRANCH HEAD</label>
                                        <input type="text" required className="gf-form-input" placeholder="branch head" />
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">COLLEGE</label>
                                        <select className="gf-form-input" required>
                                            <option value="">
                                                Select College
                                            </option>
                                        </select>
                                    </div>
                                </div>
                                <div className="m-t-1 text-center">
                                    <button type="submit" className="btn btn-success border-bottom">Save</button>
                                    <button type="submit" className="btn btn-success border-bottom">Update</button>
                                    <button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
            </div>
        );
    }
}
