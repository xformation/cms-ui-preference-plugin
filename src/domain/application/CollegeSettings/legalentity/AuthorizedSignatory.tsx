import * as React from 'react';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_AUTHORIZED_SIGNATORY } from '../../_queries';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, authorized signatory could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_AUTHORIZED_SIGNATORY_ADDED = "New authorized signatory saved successfully";
const SUCCESS_MESSAGE_AUTHORIZED_SIGNATORY_UPDATED = "Authorized signatory updated successfully";


export interface AuthorizedSignatoryProp extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    branchList?: any;
    onCloseModel?: any;
    onSaveUpdate?: any;
    asObj?: any;
    signatoryHeaderLabel?: any;
}

class AuthorizedSignatory<T = {[data: string]: any}> extends React.Component<AuthorizedSignatoryProp, any> {
  constructor(props: AuthorizedSignatoryProp) {
    super(props);
    this.state = {
      asObj: this.props.asObj,
      errorMessage: "",
      successMessage: "",
      branchList: this.props.branchList,
      signatoryHeaderLabel: this.props.signatoryHeaderLabel
    };
    
    this.closeModel = this.closeModel.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.save = this.save.bind(this);
    this.doSave = this.doSave.bind(this);
  }

  closeModel = () => {
    this.props.onCloseModel();
  }

  onChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.nativeEvent.target;
    const { asObj } = this.state;
    
    this.setState({
        asObj: {
            ...asObj,
            [name]: value
        },
        errorMessage: "",
        successMessage: "",
    });  
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  
  getInput(asObj: any, signatoryHeaderLabel: any){
    let asId = null;
    if(signatoryHeaderLabel === "Edit Signatory"){
        asId = asObj.id;
    }
    let asInput = {
        id: asId,
        name: asObj.name,
        // fatherName: asObj.fatherName,
        designation: asObj.designation,
        address: asObj.address,
        emailId: asObj.emailId,
        cellPhoneNumber: asObj.cellPhoneNumber,
        status: asObj.status,
        panNo: asObj.panNo,
        branchId: asObj.branchId
    };
    return asInput;
  }

  async doSave(asInput: any, id: any){
    let btn = document.querySelector("#"+id);
    btn && btn.setAttribute("disabled", "true");
    let exitCode = 0;
    
    await this.props.client.mutate({
        mutation: SAVE_AUTHORIZED_SIGNATORY,
        variables: { 
            input: asInput
        },
        // fetchPolicy: 'cache-and-network'
    }).then((resp: any) => {
        console.log("Success in saveAuthorizedSignatory Mutation. Exit code : ",resp.data.saveAuthorizedSignatory.cmsAuthorizedSignatoryVo.exitCode);
        exitCode = resp.data.saveAuthorizedSignatory.cmsAuthorizedSignatoryVo.exitCode;
        this.props.onSaveUpdate(resp.data.saveAuthorizedSignatory.cmsAuthorizedSignatoryVo.dataList);
    }).catch((error: any) => {
        exitCode = 1;
        console.log('Error in saveAuthorizedSignatory : ', error);
    });
    btn && btn.removeAttribute("disabled");
    
    let errorMessage = "";
    let successMessage = "";
    if(exitCode === 0 ){
        successMessage = SUCCESS_MESSAGE_AUTHORIZED_SIGNATORY_ADDED;
        if(asInput.id !== null){
            successMessage = SUCCESS_MESSAGE_AUTHORIZED_SIGNATORY_UPDATED;
        }
    }else {
        errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
    }
    this.setState({
        successMessage: successMessage,
        errorMessage: errorMessage
    });
    
  }

  save = (e: any) => {
    const { id } = e.nativeEvent.target;
    const {asObj, signatoryHeaderLabel} = this.state;
    let isValid = this.validateFields(asObj);
    if(isValid === false){
        return;
    }
    const asInput = this.getInput(asObj, signatoryHeaderLabel);
    this.doSave(asInput, id);
  }

  validateFields(asObj: any){
    let isValid = true;
    let errorMessage = ""
    if(asObj.name === undefined || asObj.name === null || asObj.name === ""){
        commonFunctions.changeTextBoxBorderToError((asObj.name === undefined || asObj.name === null) ? "" : asObj.name, "name");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(asObj.designation === undefined || asObj.designation === null || asObj.designation === ""){
        commonFunctions.changeTextBoxBorderToError((asObj.designation === undefined || asObj.designation === null) ? "" : asObj.designation, "designation");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(asObj.address === undefined || asObj.address === null || asObj.address === ""){
      commonFunctions.changeTextBoxBorderToError((asObj.address === undefined || asObj.address === null) ? "" : asObj.address , "address");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(asObj.emailId === undefined || asObj.emailId === null || asObj.emailId === ""){
      commonFunctions.changeTextBoxBorderToError((asObj.emailId === undefined || asObj.emailId === null) ? "" : asObj.emailId , "emailId");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(asObj.cellPhoneNumber === undefined || asObj.cellPhoneNumber === null || asObj.cellPhoneNumber === ""){
      commonFunctions.changeTextBoxBorderToError((asObj.cellPhoneNumber === undefined || asObj.cellPhoneNumber === null) ? "" : asObj.cellPhoneNumber , "cellPhoneNumber");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(asObj.panNo === undefined || asObj.panNo === null || asObj.panNo === ""){
      commonFunctions.changeTextBoxBorderToError((asObj.panNo === undefined || asObj.panNo === null) ? "" : asObj.panNo , "panNo");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(asObj.branchId === undefined || asObj.branchId === null || asObj.branchId === ""){
      commonFunctions.changeTextBoxBorderToError((asObj.branchId === undefined || asObj.branchId === null) ? "" : asObj.branchId, "branchId");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(asObj.status === undefined || asObj.status === null || asObj.status === ""){
      commonFunctions.changeTextBoxBorderToError((asObj.status === undefined || asObj.status === null) ? "" : asObj.status, "status");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }

    this.setState({
        errorMessage: errorMessage
    });
    return isValid; 

  }

  render() {
    const { asObj, branchList, errorMessage, successMessage, signatoryHeaderLabel } = this.state;
    return (
      <div className="info-container">
        {
            errorMessage !== ""  ? 
                <MessageBox id="mbox" message={errorMessage} activeTab={2}/>        
                : null
        }
        {
            successMessage !== ""  ? 
                <MessageBox id="mbox" message={successMessage} activeTab={1}/>        
                : null
        }
        <div className="clearfix" />
          
              <div className="modal-fwidth">
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      SIGNATORY NAME<span style={{ color: 'red' }}> * </span>
                    </label>
                    <input type="text" required name="name" id="name"  onChange={this.onChange} value={asObj.name} className="gf-form-input" maxLength={255} placeholder="SIGNATORY NAME" />
                  </div>
                  {/* <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      SIGNATORY FATHER NAME
                    </label>
                    <input type="text" name="fatherName" id="fatherName"  onChange={this.onChange} value={asObj.fatherName} required className="gf-form-input" placeholder="SIGNATORY FATHER NAME" maxLength={255} />
                  </div> */}
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">
                      SIGNATORY DESIGNATION<span style={{ color: 'red' }}> * </span>
                    </label>
                    <input type="text" name="designation" id="designation"  onChange={this.onChange} value={asObj.designation} required className="gf-form-input" placeholder="SIGNATORY DESIGNATION" maxLength={255} />
                  </div>
                </div>
                <div className="fwidth-modal-text modal-fwidth">
                  <label className="gf-form-label b-0 bg-transparent">ADDRESS<span style={{ color: 'red' }}> * </span></label>
                  <input type="textarea" name="address" id="address"  onChange={this.onChange} value={asObj.address} required className="gf-form-input m-r-1" placeholder="ADDRESS" maxLength={2000}></input>
                </div>

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">EMAIL<span style={{ color: 'red' }}> * </span></label>
                    <input type="text" name="emailId" id="emailId"  onChange={this.onChange} value={asObj.emailId} required className="gf-form-input" maxLength={255} placeholder="EMAIL" />
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">
                      CELL PHONE NUMBER<span style={{ color: 'red' }}> * </span>
                    </label>
                    <input type="text" name="cellPhoneNumber" id="cellPhoneNumber"  onChange={this.onChange} value={asObj.cellPhoneNumber} required className="gf-form-input" placeholder="CELL PHONE NUMBER" maxLength={255} />
                  </div>
                </div>

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">
                      PAN NUMBER<span style={{ color: 'red' }}> * </span>
                    </label>
                    <input type="text" name="panNo" id="panNo"  onChange={this.onChange} value={asObj.panNo} required className="gf-form-input" placeholder="PAN NUMBER" maxLength={255} />
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">BRANCH<span style={{ color: 'red' }}> * </span></label>
                    <select className="gf-form-input" required name="branchId" id="branchId" onChange={this.onChange} value={asObj.branchId}>
                      <option value="">Select Branch</option>
                        {
                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                        }
                    </select>
                  </div>
                </div>         

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">STATUS<span style={{ color: 'red' }}> * </span></label>
                    <select className="gf-form-input" name="status" id="status" onChange={this.onChange} value={asObj.status} >
                        <option key={""} value={""}>Select Status</option>
                        <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                        <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                        <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                    </select>
                  </div>
                  <div className="fwidth-modal-text">&nbsp;</div>
                </div>         

                <div className="m-t-1 text-center">
                  {
                    signatoryHeaderLabel === "Add New Signatory" ?
                    <button id="btnAdd"  className="btn btn-primary border-bottom mr-1" onClick={this.save}> Save</button>
                    :
                    <button id="btnUpdate"  className="btn btn-primary border-bottom mr-1" onClick={this.save}> Update</button>
                  }
                  <button  className="btn btn-danger border-bottom mr-1" onClick={e => this.closeModel()} > Cancel </button>
                </div>
              </div>
         
          
      </div>
    );
  }
}


export default withApollo(AuthorizedSignatory);