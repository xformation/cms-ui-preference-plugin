import * as React from 'react';
// import { Modal,  ModalHeader,  ModalBody,  ModalFooter,  TabContent,  TabPane,  Nav,  NavItem,  NavLink} from 'reactstrap';
// import {collegeSettingsServices} from '../../_services/collegeSettings.services';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
// import { GET_BRANCH_LIST, SAVE_BRANCH } from '../../_queries';

export interface AuthorizedSignatoryProp extends React.HTMLAttributes<HTMLElement>{
    branchList?: any;
    onCloseModel?: any;
}

class AuthorizedSignatory extends React.Component<AuthorizedSignatoryProp, any> {
  constructor(props: AuthorizedSignatoryProp) {
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
        <div className="clearfix" />
          
              <div className="modal-fwidth">
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      SIGNATORY NAME
                    </label>
                    <input type="text" required className="gf-form-input" maxLength={255} placeholder="signatory name" />
                  </div>
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      SIGNATORY FATHER NAME
                    </label>
                    <input type="text" required className="gf-form-input" placeholder="signatory father name" maxLength={255} />
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">
                      SIGNATORY DESIGNATION
                    </label>
                    <input type="text" required className="gf-form-input" placeholder="signatory designation" maxLength={255} />
                  </div>
                </div>
                <div className="fwidth-modal-text modal-fwidth">
                  <label className="gf-form-label b-0 bg-transparent">ADDRESS</label>
                  <input type="textarea" required className="gf-form-input m-r-1" maxLength={2000}></input>
                </div>

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">EMAIL</label>
                    <input type="text" required className="gf-form-input" maxLength={255} placeholder="email" />
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">
                      CELL PHONE NUMBER
                    </label>
                    <input type="text" required className="gf-form-input" placeholder="cell phone number" maxLength={255} />
                  </div>
                </div>

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      PAN CARD NUMBER
                    </label>
                    <input type="text" required className="gf-form-input" placeholder="pancard number" maxLength={255} />
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
                </div>         

                <div className="m-t-1 text-center">
                  <button  className="btn btn-primary border-bottom mr-1"> Save</button>
                  <button  className="btn btn-primary border-bottom mr-1"> Update</button>
                  <button  className="btn btn-danger border-bottom mr-1" onClick={e => this.closeModel()} > Cancel </button>
                </div>
              </div>
         
          
      </div>
    );
  }
}


export default withApollo(AuthorizedSignatory);