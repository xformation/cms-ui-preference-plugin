import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export class Payment extends React.Component<any, any> {
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
  }

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

  render() {
    return (
      <div className="info-container">
        <div className="page-container page-body legal-entities-main-container">
          <div className="authorized-signatory-container m-b-1">
            <h3>Summary </h3>
            <div className="authorized-signatory-container m-t-1 m-b-1">
              <div className="row">
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Student Name: </span>
                  <span>Rahul</span>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Student Id: </span>
                  <span>1122</span>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Department: </span>
                  <span>CSE</span>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Year: </span>
                  <span>1st Year</span>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Section: </span>
                  <span>A</span>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Total Fee: </span>
                  <span>125000</span>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-2 m-b-1">
                  <span className="label-color">Fees Due: </span>
                  <span>50000</span>
                </div>
                <div className="col-xs-12 col-sm-4 col-md-4 m-b-1">
                  <span className="label-color">Due Date: </span>
                  <span>01/09/2019</span>
                </div>
              </div>
            </div>
            <h3>Make a Secure Payment</h3>
          </div>
          <div className="p-flex">
            <form name="paymentForm" className="gf-form-group section m-b-1">
              <input
                type="number"
                placeholder="Enter amount"
                id="pmt"
                required
                ng-model="pmt.amount"
              />
              <input
                className="btn btn-primary cust-h-w mr-1"
                type="button"
                id="btnPay"
                value="Pay"
                ng-click="doPayment()"
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
}
