import * as React from 'react';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_BANK_ACCOUNTS } from '../../_queries';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, bank account could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_BANK_ACCOUNT_ADDED = "New bank account saved successfully";
const SUCCESS_MESSAGE_BANK_ACCOUNT_UPDATED = "Bank account updated successfully";

export interface BankAccountProp extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    branchList?: any;
    onCloseModel?: any;
    onSaveUpdate?: any;
    bankObj?: any;
    headerLabel?: any;
}

class BankAccount extends React.Component<BankAccountProp, any> {
  constructor(props: BankAccountProp) {
    super(props);
    this.state = {
      bankObj: this.props.bankObj,
      errorMessage: "",
      successMessage: "",
      branchList: this.props.branchList,
      headerLabel: this.props.headerLabel
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
    const { bankObj } = this.state;
    
    this.setState({
        bankObj: {
            ...bankObj,
            [name]: value
        },
        errorMessage: "",
        successMessage: "",
    });  
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  
  getInput(bankObj: any, headerLabel: any){
    let asId = null;
    console.log("Header bank account model :::: ", headerLabel);
    if(headerLabel === "Edit Bank Account"){
        console.log("bank account id : ", bankObj.id);
        asId = bankObj.id;
    }else{
      console.log("bank account id is null....... ");
    }
    let bankAccountInput = {
        id: asId,
        bankName: bankObj.bankName,
        accountNumber: bankObj.accountNumber,
        typeOfAccount: bankObj.typeOfAccount,
        ifscCode: bankObj.ifscCode,
        address: bankObj.address,
        corporateId: bankObj.corporateId,
        branchId: bankObj.branchId,
        status: bankObj.status,
        
    };
    return bankAccountInput;
  }

  async doSave(bankAccountInput: any, id: any){
    let btn = document.querySelector("#"+id);
    btn && btn.setAttribute("disabled", "true");
    let exitCode = 0;
    
    await this.props.client.mutate({
        mutation: SAVE_BANK_ACCOUNTS,
        variables: { 
            input: bankAccountInput
        },
        // fetchPolicy: 'cache-and-network'
    }).then((resp: any) => {
        console.log("Success in saveBankAccount Mutation. Exit code : ",resp.data.saveBankAccounts.cmsBankAccountsVo.exitCode);
        exitCode = resp.data.saveBankAccounts.cmsBankAccountsVo.exitCode;
        this.props.onSaveUpdate(resp.data.saveBankAccounts.cmsBankAccountsVo.dataList);
    }).catch((error: any) => {
        exitCode = 1;
        console.log('Error in saveBankAccount : ', error);
    });
    btn && btn.removeAttribute("disabled");
    
    let errorMessage = "";
    let successMessage = "";
    if(exitCode === 0 ){
        successMessage = SUCCESS_MESSAGE_BANK_ACCOUNT_ADDED;
        if(bankAccountInput.id !== null){
            successMessage = SUCCESS_MESSAGE_BANK_ACCOUNT_UPDATED;
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
    const {bankObj, headerLabel} = this.state;
    let isValid = this.validateFields(bankObj);
    if(isValid === false){
        return;
    }
    const bankAccountInput = this.getInput(bankObj, headerLabel);
    this.doSave(bankAccountInput, id);
  }

  validateFields(bankObj: any){
    let isValid = true;
    let errorMessage = ""
    if(bankObj.bankName === undefined || bankObj.bankName === null || bankObj.bankName === ""){
        commonFunctions.changeTextBoxBorderToError((bankObj.bankName === undefined || bankObj.bankName === null) ? "" : bankObj.bankName, "bankName");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(bankObj.accountNumber === undefined || bankObj.accountNumber === null || bankObj.accountNumber === ""){
        commonFunctions.changeTextBoxBorderToError((bankObj.accountNumber === undefined || bankObj.accountNumber === null) ? "" : bankObj.accountNumber, "accountNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(bankObj.typeOfAccount === undefined || bankObj.typeOfAccount === null || bankObj.typeOfAccount === ""){
      commonFunctions.changeTextBoxBorderToError((bankObj.typeOfAccount === undefined || bankObj.typeOfAccount === null) ? "" : bankObj.typeOfAccount , "typeOfAccount");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(bankObj.ifscCode === undefined || bankObj.ifscCode === null || bankObj.ifscCode === ""){
      commonFunctions.changeTextBoxBorderToError((bankObj.ifscCode === undefined || bankObj.ifscCode === null) ? "" : bankObj.ifscCode , "ifscCode");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(bankObj.address === undefined || bankObj.address === null || bankObj.address === ""){
      commonFunctions.changeTextBoxBorderToError((bankObj.address === undefined || bankObj.address === null) ? "" : bankObj.address , "address");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(bankObj.corporateId === undefined || bankObj.corporateId === null || bankObj.corporateId === ""){
      commonFunctions.changeTextBoxBorderToError((bankObj.corporateId === undefined || bankObj.corporateId === null) ? "" : bankObj.corporateId , "corporateId");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(bankObj.branchId === undefined || bankObj.branchId === null || bankObj.branchId === ""){
      commonFunctions.changeTextBoxBorderToError((bankObj.branchId === undefined || bankObj.branchId === null) ? "" : bankObj.branchId, "branchId");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(bankObj.status === undefined || bankObj.status === null || bankObj.status === ""){
      commonFunctions.changeTextBoxBorderToError((bankObj.status === undefined || bankObj.status === null) ? "" : bankObj.status, "status");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }

    this.setState({
        errorMessage: errorMessage
    });
    return isValid; 

  }

  render() {
    const { bankObj, branchList, modelHeader, errorMessage, successMessage, headerLabel } = this.state;
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
              <div className="modal-fwidth">
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> NAME OF BANK<span style={{ color: 'red' }}> * </span> </label>
                    <input type="text" required name="bankName" id="bankName"  onChange={this.onChange} value={bankObj.bankName} className="gf-form-input" maxLength={255} placeholder="NAME OF BANK"/>
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">ACCOUNT NUMBER<span style={{ color: 'red' }}> * </span> </label>
                    <input type="text" required name="accountNumber" id="accountNumber"  onChange={this.onChange} value={bankObj.accountNumber} className="gf-form-input" maxLength={255} placeholder="ACCOUNT NUMBER"/>
                  </div>
                </div>
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">TYPE OF ACCOUNT<span style={{ color: 'red' }}> * </span> </label>
                    <select className="gf-form-input" name="typeOfAccount" id="typeOfAccount" onChange={this.onChange} value={bankObj.typeOfAccount} >
                        <option key={""} value={""}>Select Account Type</option>
                        <option key={"CURRENT"} value={"CURRENT"}>CURRENT</option>
                        <option key={"SAVING"} value={"SAVING"}>SAVING</option>
                    </select>
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent">IFSC CODE<span style={{ color: 'red' }}> * </span></label>
                    <input type="text" required name="ifscCode" id="ifscCode"  onChange={this.onChange} value={bankObj.ifscCode} className="gf-form-input" maxLength={255} placeholder="IFSC CODE" />
                  </div>
                </div>
                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent"> BRANCH ADDRESS<span style={{ color: 'red' }}> * </span> </label>
                    <input type="text" required name="address" id="address"  onChange={this.onChange} value={bankObj.address} className="gf-form-input" maxLength={255} placeholder="BRANCH ADDRESS"/>
                  </div>
                  <div className="fwidth-modal-text">
                    <label className="gf-form-label b-0 bg-transparent"> CORPORATE ID<span style={{ color: 'red' }}> * </span> </label>
                    <input type="text" required name="corporateId" id="corporateId"  onChange={this.onChange} value={bankObj.corporateId} className="gf-form-input" maxLength={255} placeholder="CORPORATE ID" />
                  </div>
                </div>

                <div className="mdflex modal-fwidth">
                  <div className="fwidth-modal-text m-r-1">
                    <label className="gf-form-label b-0 bg-transparent">BRANCH<span style={{ color: 'red' }}> * </span></label>
                    <select className="gf-form-input" required name="branchId" id="branchId" onChange={this.onChange} value={bankObj.branchId}>
                      <option value="">Select Branch</option>
                        {
                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                        }
                    </select>
                  </div>

                  <div className="fwidth-modal-text">
                  <label className="gf-form-label b-0 bg-transparent">STATUS<span style={{ color: 'red' }}> * </span></label>
                    <select className="gf-form-input" name="status" id="status" onChange={this.onChange} value={bankObj.status} >
                        <option key={""} value={""}>Select Status</option>
                        <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                        <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                        <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                    </select>
                  </div>
                </div>



                <div className="m-t-1 text-center">
                {
                    headerLabel === "Add Bank Account" ?
                    <button id="btnAdd"  className="btn btn-primary border-bottom mr-1" onClick={this.save}> Save</button>
                    :
                    <button id="btnUpdate"  className="btn btn-primary border-bottom mr-1" onClick={this.save}> Update</button>
                  }
                  <button className="btn btn-danger border-bottom" onClick={e => this.closeModel()} > Cancel </button>
                </div>
              </div>
            
         
          
      </div>
    );
  }
}


export default withApollo(BankAccount);