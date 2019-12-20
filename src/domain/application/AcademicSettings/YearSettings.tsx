import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export class YearSettings extends React.Component<any, any> {
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
    this.createCitySelectbox = this.createCitySelectbox.bind(this);
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

  createCitySelectbox(selectedState: any) {
    const {cities} = this.state;
    let retData: any[] = [];
    selectedState = parseInt(selectedState);
    for (let i = 0; i < cities.length; i++) {
      let city = cities[i];
      if (selectedState === city.stateId) {
        retData.push(
          <option key={city.id} value={city.id}>
            {city.cityName}
          </option>
        );
      }
    }
    return retData;
  }

  createStateSelectbox(stateList: any) {
    let retData: any[] = [];
    if (stateList.length > 0) {
      for (let i = 0; i < stateList.length; i++) {
        let item = stateList[i];
        retData.push(
          <option value={item['id']} key={item['id']}>
            {item['stateName']}
          </option>
        );
      }
    }
    return retData;
  }

  render() {
    const {isModalOpen} = this.state;
    return (
      <div className="info-container">
        <div className="authorized-signatory-container m-b-1">
          <h3>Year Settings</h3>
        </div>
        <button onClick={e => this.showModal(e, true)}>
          <i className="fa fa-plus-circle" /> Add new
        </button>
        <Modal isOpen={isModalOpen} className="react-strap-modal-container">
          <ModalHeader>Add New</ModalHeader>
          <ModalBody className="modal-content">
            <form className="gf-form-group section m-0 dflex">
              <div className="modal-fwidth">
                <div className="fwidth-modal-text modal-fwidth">
                  <label className="gf-form-label b-0 bg-transparent">
                    ACADEMIC YEAR
                  </label>
                  <input
                    type="text"
                    required
                    className="gf-form-input "
                    maxLength={255}
                    placeholder="academic year name"
                  />
                </div>

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text">
                    {/* <label class="switch"> <input disabled type="checkbox" ng-model="academicYear.status"
                            ng-true-value="'ACTIVE'" ng-false-value="'DEACTIVE'" /> 
                            <span class="slider disabledCursor"></span>
                        </label> */}
                    <label className="gf-form-label b-0 bg-transparent" htmlFor="">
                      STATUS
                    </label>
                    <label className="switch">
                      {' '}
                      <input type="checkbox" id="status" name="status" />{' '}
                      <span className="slider" />{' '}
                    </label>
                  </div>
                  {/* <td class="text-center link-td">
              <input type="date" required ng-model="term.startDate" maxlength="10" class="gf-form-input" />
            </td>
            <td class="text-center link-td">
              <input type="date" required ng-model="term.endDate" maxlength="10" class="gf-form-input" />
            </td> */}
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">START DATE</label>
                    <input type="date" required className="gf-form-input" />
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">END DATE</label>
                    <input type="date" required className="gf-form-input" />
                  </div>
                </div>

                <div className="m-t-1 text-center">
                  <button type="submit" className="btn btn-success border-bottom">
                    Save
                  </button>
                  <button type="submit" className="btn btn-success border-bottom">
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

        <table id="academic" className="fwidth">
          <thead>
            <th>Year</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Holidays</th>
            <th>Terms</th>
            <th>Status</th>
            <th>Actions</th>
          </thead>
          <tbody />
        </table>
      </div>
    );
  }
}
