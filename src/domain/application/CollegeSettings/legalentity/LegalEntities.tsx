import * as React from 'react';
import { useState } from 'react';
import { Modal,  ModalHeader,  ModalBody,  ModalFooter,  TabContent,  TabPane,  Nav,  NavItem,  NavLink} from 'reactstrap';
import {collegeSettingsServices} from '../../_services/collegeSettings.services';
import { commonFunctions } from '../../_utilites/common.functions';
import RegistrationPage from './RegistrationPage';
import AuthorizedSignatory from './AuthorizedSignatory';
import BankAccount from './BankAccount';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'

export interface LegalEntitiesProps extends React.HTMLAttributes<HTMLElement>{
  branchList?: any;
  stateList?: any;
  cityList?: any;
  originalCityList?: any;
  signatoryList?: any;
  bankAccountsList?: any;
}

export class LegalEntities extends React.Component<LegalEntitiesProps, any> {
  DEFAULT_LOGO = '/public/img/college_logo.png';
  constructor(props: LegalEntitiesProps) {
    super(props);
    
    this.state = {
      branchList: this.props.branchList,
      stateList: this.props.stateList,
      cityList: this.props.cityList,
      originalCityList: this.props.cityList,
      activeTab: 0,
      logoSrc: '',
      isSignatoryModalOpen: false,
      isBankModalOpen: false,
      // // states: [],
      // // cities: [],
      // selectedState: '',
      // selectedCity: '',
      signatoryList: this.props.signatoryList,
      asObj:{
        id: null,
        name: "",
        fatherName: "",
        designation: "",
        address: "",
        emailId: "",
        cellPhoneNumber: "",
        panNo: "",
        branchId: "",
      },
      signatoryHeaderLabel:"",
      bankAccountHeaderLabel:"",
      bankObj:{
        id: null,
        bankName: "",
        accountNumber: "",
        typeOfAccount: "",
        ifscCode: "",
        address: "",
        corporateId: "",
        branchId: "",
      },
      bankAccountsList: this.props.bankAccountsList,
      errorMessage: "",
      successMessage: "",
      legalEntityObj: null,
      isSignatoryListChanged: false
    };
    this.toggleTab = this.toggleTab.bind(this);
    // this.showModal = this.showModal.bind(this);
    // this.showModalNew = this.showModalNew.bind(this);
    // this.handleStateChange = this.handleStateChange.bind(this);
    // this.createCitySelectbox = this.createCitySelectbox.bind(this);
    this.handleImageChange = this.handleImageChange.bind(this);

    this.closeSignatoryModal = this.closeSignatoryModal.bind(this);
    this.closeBankModal = this.closeBankModal.bind(this);
    this.updateSignatoryList = this.updateSignatoryList.bind(this);
    this.showSignatoryModal = this.showSignatoryModal.bind(this);
    this.showSignatoryModalForEdit = this.showSignatoryModalForEdit.bind(this);
    this.updateBankAccountsList = this.updateBankAccountsList.bind(this);
    this.updateLegalEntity = this.updateLegalEntity.bind(this);
    this.updateSignatoryListFlag = this.updateSignatoryListFlag.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  // componentDidMount() {
  //   collegeSettingsServices.getStates().then(
  //     response => {
  //       this.setState({
  //         states: response,
  //       });
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  //   collegeSettingsServices.getCities().then(
  //     response => {
  //       this.setState({
  //         cities: response,
  //       });
  //     },
  //     error => {
  //       console.log(error);
  //     }
  //   );
  // }

  handleImageChange(e: any) {
    const {files, name} = e.target;
    if (files.length > 0) {
      const result = this.toBase64(files[0]);
      result
        .then(base64 => {
          this.setState({
            [name]: base64,
          });
        })
        .catch(() => {});
    } else {
      this.setState({
        [name]: null,
      });
    }
  }

  toBase64(file: any) {
    return new Promise((resolve: any, reject: any) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  showSignatoryModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      asObj: {},
      isSignatoryModalOpen: bShow,
      signatoryHeaderLabel: "Add New Signatory"
    }));
  }

  showSignatoryModalForEdit(e: any, bShow: boolean, signatoryObj: any) {
    e && e.preventDefault();
    this.setState(() => ({
      isSignatoryModalOpen: bShow,
      asObj: signatoryObj,
      signatoryHeaderLabel: "Edit Signatory"
    }));
  }

  showBankModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      bankObj: {},
      isBankModalOpen: bShow,
      bankAccountHeaderLabel: "Add Bank Account"
    }));
  }

  showBankModalForEdit(e: any, bShow: boolean, bankObj: any) {
    e && e.preventDefault();
    this.setState(() => ({
      isBankModalOpen: bShow,
      bankObj: bankObj,
      bankAccountHeaderLabel: "Edit Bank Account"
    }));
  }

  closeSignatoryModal() {
    this.setState({
      isSignatoryModalOpen: false
    });
  }

  closeBankModal() {
    this.setState({
      isBankModalOpen: false
    });
  }

  // handleStateChange(e: any) {
  //   const {name, value} = e.target;
  //   this.setState({
  //     [name]: value,
  //   });
  // }

  // createCitySelectbox(selectedState: any) {
  //   const {cities} = this.state;
  //   let retData = [];
  //   selectedState = parseInt(selectedState);
  //   for (let i = 0; i < cities.length; i++) {
  //     let city = cities[i];
  //     if (selectedState === city.stateId) {
  //       retData.push(
  //         <option key={city.id} value={city.id}>
  //           {city.cityName}
  //         </option>
  //       );
  //     }
  //   }
  //   return retData;
  // }

  // updateSignatoryList method being called from Add/Edit Authorized Signatory model/pop-up.
  // It's a callback method being called by onSaveUpdate property of Add/Edit Authorized Signatory model/pop-up
  
  updateSignatoryList(signatoryList: any) {
    console.log("SIGNATORY LIST from child : ", signatoryList);
    this.setState({
      signatoryList: signatoryList,
      isSignatoryListChanged: true
    });
  }

  updateSignatoryListFlag(flag: any){
    this.setState({
      isSignatoryListChanged: flag
    });
  }
  // updateBankAccountsList method being called from Add/Edit Bank Account model/pop-up
  updateBankAccountsList(bankAccountsList: any) {
    console.log("BankAccounts LIST from child : ", bankAccountsList);
    this.setState({
      bankAccountsList: bankAccountsList
    });
  }

  displaySignatoryList(signatoryList: any){
    const retVal = [];
    for (let i = 0; i < signatoryList.length; i++) {
        const k = signatoryList[i];
        retVal.push(
          <div className="tile m-r-2 ">
            <div id={k.id} className="tile-circle yellow upload-cursor" onClick={e => this.showSignatoryModalForEdit(e, true, k)}>
              <b> {k.name.charAt(0)} 
              </b>
            </div>
            <div className="tile-right-part">
              <div className="tile-info">Name: {k.name}</div>
              <div className="tile-info">Designation: {k.designation}</div>
              {/* <div className="tile-info">Branch: {k.cmsBranchVo !== null ? k.cmsBranchVo.branchName : ""}</div> */}
            </div>
          </div>
        );
    }
    return retVal;
  }

  displayBankAccountList(bankAccountsList: any){
    const retVal = [];
    for (let i = 0; i < bankAccountsList.length; i++) {
        const k = bankAccountsList[i];
        retVal.push(
          <div className="tile m-r-2 ">
            <div id={k.id} className="tile-circle SBI upload-cursor" onClick={e => this.showBankModalForEdit(e, true, k)}>
              <b> {k.bankName.charAt(0)} 
              </b>
            </div>
            <div className="tile-right-part">
              <div className="tile-name"><span>{k.bankName}</span></div>
              <div className="tile-info">{k.address}</div>
              {/* <div className="tile-info">Branch: {k.cmsBranchVo !== null ? k.cmsBranchVo.branchName : ""}</div> */}
            </div>
          </div>
        );
    }
    return retVal;
  }

  // updateLegalEntity method being called from RegistrationPage component
  updateLegalEntity(errorMessage: any, successMessage: any, legalEntityObj: any) {
    console.log("Legal entiy object from child : ", legalEntityObj);
    this.setState({
      errorMessage: errorMessage,
      successMessage: successMessage,
      legalEntityObj: legalEntityObj
    });
  }

  

  render() {
    const { logoSrc, isSignatoryModalOpen, isBankModalOpen,  branchList, stateList, cityList, signatoryList, asObj, signatoryHeaderLabel, bankAccountHeaderLabel, bankObj, bankAccountsList, 
      errorMessage, successMessage, isSignatoryListChanged, selectedState, selectedCity, activeTab } = this.state;
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
        <div className="authorized-signatory-container m-b-1">
          <small>
            A Legal Entity is the registered name of the institution. This name will be used in all documents such as pay slip, offer letter etc.
          </small>
        </div>
        <div className="logo-container d-flex m-b-1 mt-1">
          <img className="logo m-b-1" src={logoSrc || this.DEFAULT_LOGO} />
          <div className="gf-form m-b-1">
            <label className="upload-cursor">
              <input id="d-none" type="file" className="gf-form-file-input" accept="image/*" onChange={this.handleImageChange} name="logoSrc" />
              Upload Legal Entity Logo
            </label>
          </div>
        </div>
        <div className="s-flex">
          <h5 className="form-h5">AUTHORIZED SIGNATORY</h5>
          <div className="tile">
            <a onClick={e => this.showSignatoryModal(e, true)} className="upload-cursor">
              + Add New Signatory
            </a>
          </div>
        </div>
        <div className="signatory-list">
            {
              signatoryList !== null ? this.displaySignatoryList(signatoryList) : null 
            }
        </div>
        <div className="clearfix" />
        <Modal isOpen={isSignatoryModalOpen} className="react-strap-modal-container">
        <ModalHeader>{signatoryHeaderLabel}</ModalHeader>
          <ModalBody className="modal-content">
            <AuthorizedSignatory signatoryHeaderLabel={signatoryHeaderLabel} asObj={asObj} branchList={branchList} onCloseModel={this.closeSignatoryModal} onSaveUpdate={this.updateSignatoryList}></AuthorizedSignatory>
          </ModalBody>
        </Modal>

        <div className="s-flex m-t-1">
          <h5 className="form-h5">BANK ACCOUNTS</h5>
          <div className="tile">
            <a onClick={e => this.showBankModal(e, true)} className="upload-cursor">
              + Add Bank Account
            </a>
          </div>
        </div>
        <div className="signatory-list">
          {
              bankAccountsList !== null ? this.displayBankAccountList(bankAccountsList) : null 
          }
          
        </div>
        <Modal isOpen={isBankModalOpen} className="react-strap-modal-container">
          <ModalHeader>{bankAccountHeaderLabel}</ModalHeader>
          <ModalBody className="modal-content">
            <BankAccount headerLabel={bankAccountHeaderLabel} bankObj={bankObj} branchList={branchList} onCloseModel={this.closeBankModal} onSaveUpdate={this.updateBankAccountsList}></BankAccount>
          </ModalBody>
        </Modal>
        
        <RegistrationPage signatoryListFlag={isSignatoryListChanged} signatoryList={signatoryList} branchList={branchList} stateList={stateList} cityList={cityList} onSaveUpdate={this.updateLegalEntity}></RegistrationPage>
        
      </div>
    );
  }
}
