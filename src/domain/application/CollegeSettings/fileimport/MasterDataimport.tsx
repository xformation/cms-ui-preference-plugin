import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';


export class MasterDataimport extends React.Component<any, any> {
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


    render() {

        return (
            <div className="info-container">
                <div className="authorized-signatory-container m-b-1">
                    <h3>Import existing data into CMS.</h3>
                </div>
                <div className="importDflex">
                    <div className="rtMargin">
                        <label className="button-file-upload">
                            <span className="fake-upload-button">Choose File</span>
                            <span className="js-button-file-upload-text button-file-upload-text"></span>
                            {/* <input type="file" id="file" name="file" file-model="file" file-select="ctrl.getFile($event)"
                                className="js-button-file-upload-input"> */}
                        </label>

                    </div>
                    <div className="form-h5">
                        <label className="form-h5">Entity</label>
                        <select required  >
                            <option value="">Select Entity</option>
                            <option value="all">All</option>

                        </select>

                    </div>
                </div>
                <button ng-click="uploadFile()" className="uploadbtn"><i className="fa fa-cloud-upload imclod" aria-hidden="true"></i>
                    <span>Upload</span></button>
            </div>

        );
    }
}
