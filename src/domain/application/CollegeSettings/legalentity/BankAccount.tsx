import * as React from 'react';
// import { Modal,  ModalHeader,  ModalBody,  ModalFooter,  TabContent,  TabPane,  Nav,  NavItem,  NavLink} from 'reactstrap';
// import {collegeSettingsServices} from '../../_services/collegeSettings.services';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
// import { GET_BRANCH_LIST, SAVE_BRANCH } from '../../_queries';

export interface BankAccountProp extends React.HTMLAttributes<HTMLElement>{
    branchList?: any;
    onCloseModel?: any;
}

class BankAccount extends React.Component<BankAccountProp, any> {
  constructor(props: BankAccountProp) {
    super(props);
    this.state = {
      branchList: this.props.branchList,
    };
    
    this.closeModel = this.closeModel.bind(this);
  }

  closeModel = () => {
    this.props.onCloseModel();
  }

  render() {
    const { branchList } = this.state;
    return (
      <div className="info-container">
              <div className="modal-fwidth">
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> NAME OF BANK </label>
                    <input type="text" maxLength={255} className="gf-form-input" placeholder="NAME OF BANK"/>
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">
                      ACCOUNT NUMBER
                    </label>
                    <input type="number" required className="gf-form-input" placeholder="ACCOUNT NUMBER" maxLength={255} />
                  </div>
                </div>
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      TYPE OF ACCOUNT
                    </label>
                    <select className="gf-form-input" required>
                      <option value="">Select Account Type</option>
                    </select>
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">IFSC CODE</label>
                    <input type="text" required className="gf-form-input" placeholder="IFSC CODE" maxLength={255} />
                  </div>
                </div>
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      BRANCH ADDRESS
                    </label>
                    <input type="text" required className="gf-form-input" placeholder="BRANCH ADDRESS" maxLength={255} />
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">
                      CORPORATE ID
                    </label>
                    <input type="text" required className="gf-form-input" placeholder="CORPORATE ID" maxLength={255} />
                  </div>
                </div>

                <div className="fwidth-modal-text">
                  <label className="gf-form-label b-0 bg-transparent">BRANCH</label>
                  <select className="gf-form-input" required>
                    <option value="">Select Branch</option>
                      {
                          commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                      }
                  </select>
                </div>

                <div className="m-t-1 text-center">
                  <button className="btn btn-primary border-bottom mr-1"> Save </button>
                  <button className="btn btn-primary border-bottom mr-1"> Update </button>
                  <button className="btn btn-danger border-bottom" onClick={e => this.closeModel()} > Cancel </button>
                </div>
              </div>
            
         
          
      </div>
    );
  }
}


export default withApollo(BankAccount);