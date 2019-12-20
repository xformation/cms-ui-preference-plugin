import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export class Departments extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
      states: [],
      cities: [],
      selectedState: '',
      selectedCity: '',
    };
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    // this.createCitySelectbox = this.createCitySelectbox.bind(this);
  }

  // componentDidMount() {
  //     collegeSettingsServices.getStates().then(
  //         response => {
  //             this.setState({
  //                 states: response
  //             });
  //         },
  //         error => {
  //             console.log(error);
  //         }
  //     );
  //     collegeSettingsServices.getCities().then(
  //         response => {
  //             this.setState({
  //                 cities: response
  //             });
  //         },
  //         error => {
  //             console.log(error);
  //         }
  //     );
  // }

  showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      isModalOpen: bShow,
    }));
  }

  handleStateChange(e: any) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
  }

  // createCitySelectbox(selectedState: any) {
  //     const { cities } = this.state;
  //     let retData: any[] = [];
  //     selectedState = parseInt(selectedState);
  //     for (let i = 0; i < cities.length; i++) {
  //         let city = cities[i];
  //         if (selectedState === city.stateId) {
  //             retData.push(
  //                 <option key={city.id} value={city.id}>{city.cityName}</option>
  //             );
  //         }
  //     }
  //     return retData;
  // }

  // createStateSelectbox(stateList: any) {
  //     let retData: any[] = [];
  //     if (stateList.length > 0) {
  //         for (let i = 0; i < stateList.length; i++) {
  //             let item = stateList[i];
  //             retData.push(
  //                 <option value={item["id"]} key={item["id"]}>{item["stateName"]}</option>
  //             );
  //         }
  //     }
  //     return retData;
  // }

  render() {
    const {isModalOpen} = this.state;
    return (
      <div className="info-container">
        <div className="authorized-signatory-container m-b-1">
          <h3>Department Setup</h3>
        </div>
        <button className="btn btn-primary m-b-1" onClick={e => this.showModal(e, true)}>
          <i className="fa fa-plus-circle " /> Add new
        </button>
        <Modal isOpen={isModalOpen} className="react-strap-modal-container">
          <ModalHeader>Add New</ModalHeader>
          <ModalBody className="modal-content">
            <form className="gf-form-group section m-0 dflex">
              <div className="modal-fwidth">
                <div className="dflex">
                  <div className="fwidth-modal-text modal-fwidth m-r-2">
                    <label className="gf-form-label b-0 bg-transparent">
                      DEPARTMENT NAME
                    </label>
                    <input
                      type="text"
                      required
                      className="gf-form-input "
                      maxLength={255}
                      placeholder="department name"
                    />
                  </div>
                  <div className="fwidth-modal-text modal-fwidth m-r-2">
                    <label className="gf-form-label b-0 bg-transparent">
                      DEPARTMENT HEAD
                    </label>
                    <input
                      type="text"
                      required
                      className="gf-form-input "
                      maxLength={255}
                      placeholder="department head"
                    />
                  </div>
                </div>
                {/* <div className="dflex"> */}{' '}
                <div className="mdflex modal-fwidth ">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      COLLEGE BRANCH
                    </label>
                    <select className="gf-form-input" required>
                      <option value="">Select College Branch</option>
                      {/* <option ng-repeat="branch in branches" value="{{branch.id}}">
								            </option> */}
                    </select>
                  </div>
                </div>
                <div className="mdflex modal-fwidth ">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      ACADEMIC YEAR
                    </label>
                    <select
                      className="gf-form-input"
                      required
                      ng-model="department.academicyearId"
                    >
                      <option value="">Select AcademicYear</option>
                      <option
                        ng-repeat="academicYear in academicYears"
                        value="{{academicYear.id}}"
                      />
                    </select>
                  </div>
                </div>
                {/* </div> */}
                <div className="modal-fwidth fwidth-modal-text m-r-1">
                  <label className="gf-form-label b-0 bg-transparent">Comments</label>
                  <input
                    type="text"
                    required
                    className="gf-form-input "
                    maxLength={255}
                    placeholder="description"
                  />
                </div>
                <div className="m-t-1 text-center">
                  <button type="submit" className="btn btn-success border-bottom mr-1">
                    Save
                  </button>
                  <button type="submit" className="btn btn-success border-bottom mr-1">
                    Update
                  </button>
                  <button
                    className="btn btn-danger border-bottom"
                    onClick={e => this.showModal(e, false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          </ModalBody>
        </Modal>
        <span />
        <table className="fwidth">
          <thead>
            <th>Name</th>
            <th>DESCRIPTION</th>
            <th>DEPARTMENT HEAD</th>
            <th>Actions </th>
          </thead>
        </table>
      </div>
    );
  }
}
