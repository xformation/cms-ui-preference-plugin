import * as React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
// import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_LEGAL_ENTITY } from '../../_queries';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, legal entity could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_LEGAL_ENTITY_ADDED = "New legal entity saved successfully";
const SUCCESS_MESSAGE_LEGAL_ENTITY_UPDATED = "Legal entity updated successfully";


export interface RegistrationProps extends React.HTMLAttributes<HTMLElement>{
  [data: string]: any;
  branchList?: any;
  stateList?: any;
  cityList?: any;
  originalCityList?: any;
  signatoryList?: any;
  onSaveUpdate?: any;
  signatoryListFlag?: any;
}
class RegistrationPage<T = {[data: string]: any}> extends React.Component<RegistrationProps, any> {
  constructor(props: RegistrationProps) {
    super(props);
    this.state = {
      activeTab: 0,
      branchList : this.props.branchList,
      originalBranchList : this.props.branchList,
      stateList: this.props.stateList,
      cityList: this.props.cityList,
      originalCityList: this.props.cityList,
      signatoryList: this.props.signatoryList,
      regObj: { 
        id: null,
        legalNameOfCollege: "",
        registeredOfficeAddress: "",
        dateOfIncorporation: "",
        typeOfCollege: "",
        collegeIdentificationNumber: "",
        pan: "",
        tan: "",
        tanCircleNumber: "",
        formSignatory: "",
        citTdsLocation: "",
        pfNumber: "",
        pfRegistrationDate: "",
        pfSignatory: "",
        esiNumber: "",
        esiRegistrationDate: "",
        esiSignatory: "",
        ptNumber: "",
        ptRegistrationDate: "",
        ptSignatory: "",
        branchId: "",
        stateId: "",
        cityId: "",
      },
      isSignatoryListChanged: this.props.signatoryListFlag,
      ptSignatoryDesignation: "",
      esiSignatoryDesignation:"",
      pfSignatoryDesignation: "",
      
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.validateCollegeInfo = this.validateCollegeInfo.bind(this);
    this.validateItInfo = this.validateItInfo.bind(this);
    this.validatePfInfo = this.validatePfInfo.bind(this);
    this.validateEsiInfo = this.validateEsiInfo.bind(this);
    this.validatePtInfo = this.validatePtInfo.bind(this);
    this.save = this.save.bind(this);
    this.applyDesignation = this.applyDesignation.bind(this);
    this.filterCityList = this.filterCityList.bind(this);
    this.filterBranchList = this.filterBranchList.bind(this);

  }
 
  componentWillUpdate(newProps: any, newState: any){
    // Following code is to reflect the add Authorized Signatory changes in the signatory drop-down 
    if(this.props.signatoryList.length !== newProps.signatoryList.length){
      this.setState({
        signatoryList: newProps.signatoryList
      });
    }

    // Following code is to reflect the update changes of Authorized Signatory in the signatory drop-down 
    let isFound=false;
    for (let i = 0; i < newProps.signatoryList.length; i++) {
      const po = newProps.signatoryList[i];
      for (let j = 0; j < this.state.signatoryList.length; j++) {
        const so = this.state.signatoryList[j];
        if(po.name === so.name && po.designation === so.designation){
          isFound=true;
          break;
        }
      }
      if(isFound){
        isFound = false;
      }else{
        this.setState({
          signatoryList: newProps.signatoryList
        });
        break;
      }
    }
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  
  onChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.nativeEvent.target;
    const { regObj, errorMessage } = this.state;
    
    this.setState({
        regObj: {
            ...regObj,
            [name]: value
        },
        errorMessage: "",
        successMessage: "",
    });
    if(name === "stateId"){
        regObj.stateId = value;
        this.setState({
          regObj: regObj
        });
        this.filterCityList(value);
        this.filterBranchList();
        this.resetCollegeNameAndAddress();
    }
    if(name === "cityId"){
      regObj.cityId = value;
      this.setState({
        regObj: regObj
      });
      this.filterBranchList();
      this.resetCollegeNameAndAddress();
    }
    if(name === "branchId"){
      regObj.branchId = value;
      if(value !== ""){
        let obj = this.applyBranch(value);
        regObj.legalNameOfCollege = obj.legalNameOfCollege;
        regObj.registeredOfficeAddress = obj.registeredOfficeAddress;
      }else{
        regObj.legalNameOfCollege = "";
        regObj.registeredOfficeAddress = "";
      }
      commonFunctions.restoreTextBoxBorderToNormal("legalNameOfCollege");
      commonFunctions.restoreTextBoxBorderToNormal("registeredOfficeAddress");
      this.setState({
        regObj: regObj
      });
      
    }

    if(name === "ptSignatory"){
      let desig = this.applyDesignation(value);
      this.setState({
        ptSignatoryDesignation: desig
      });
    }
    if(name === "esiSignatory"){
      let desig = this.applyDesignation(value);
      this.setState({
        esiSignatoryDesignation: desig
      });
    }
    if(name === "pfSignatory"){
      let desig = this.applyDesignation(value);
      this.setState({
        pfSignatoryDesignation: desig
      });
    }
    this.props.onSaveUpdate("", "", regObj); 
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  resetCollegeNameAndAddress(){
    const {regObj} = this.state;
    regObj.legalNameOfCollege = "";
    regObj.registeredOfficeAddress = "";
     
    this.setState({
      regObj: regObj
    });
  }

  filterBranchList(){
    const {regObj, originalBranchList} = this.state;
    let stateId = regObj.stateId;
    let cityId = regObj.cityId;
    if((stateId === undefined || stateId === null || stateId === "") 
        && (cityId === undefined || cityId === null || cityId === "")){
        this.setState({
            branchList: originalBranchList
        });
        console.log("Fist condition .....");
        return;
    }
    let tempBranchList = [] ;
    this.setState({
        branchList: []
    }); 
    for(let i=0;i<originalBranchList.length;i++){
        const item = originalBranchList[i];
        if(stateId !== "" && (cityId === undefined || cityId === null || cityId === "")){
          console.log("item 1 : ::: ",item);
          if(parseInt(item.state.id,10) === parseInt(stateId,10)){
              tempBranchList.push(
                  item
              );
          }
        }else if(stateId !== "" && cityId !== ""){
          if(parseInt(item.state.id,10) === parseInt(stateId,10) &&
              parseInt(item.city.id,10) === parseInt(cityId,10)){
                console.log("item 2 : ::: ",item);
                tempBranchList.push(
                    item
                );
          }
        }else if((stateId === undefined || stateId === null || stateId === "") && cityId !== ""){
          if(parseInt(item.city.id,10) === parseInt(cityId,10)){
                console.log("item 3 : ::: ",item);
                tempBranchList.push(
                    item
                );
          }
        }
    }
    this.setState({
        branchList: tempBranchList
    });
  }

  applyDesignation(asId: any){
    const {signatoryList} = this.state;
    let designation = "";
    for (let i = 0; i < signatoryList.length; i++) {
      const k = signatoryList[i];
      if(parseInt(asId, 10) === parseInt(k.id, 10)){
        designation = k.designation;
        break;
      }
    }
    return designation;
  }

  applyBranch(branchId: any){
    const {regObj, branchList} = this.state;
    let obj = regObj;
    for (let i = 0; i < branchList.length; i++) {
      const k = branchList[i];
      if(parseInt(branchId, 10) === parseInt(k.id, 10)){
        obj.legalNameOfCollege = k.branchName;
        obj.registeredOfficeAddress = k.address;
        break;
      }
    }
    return obj;
  }

  filterCityList(stateId: any){
    if(stateId === undefined || stateId === null || stateId === ""){
        this.setState({
            cityList: this.state.originalCityList
        });
        return;
    }
    let tempCityList = [] ;
    this.setState({
        cityList: []
    }); 
    for(let i=0;i<this.state.originalCityList.length;i++){
        let item = this.state.originalCityList[i];
        if(item.state.id == stateId){
            tempCityList.push(
                item
            );
        }
    }
    this.setState({
        cityList: tempCityList
    });
  }

  validateCollegeInfo(){
    const { regObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(regObj.legalNameOfCollege === undefined || regObj.legalNameOfCollege === null || regObj.legalNameOfCollege === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.legalNameOfCollege === undefined || regObj.legalNameOfCollege === null) ? "" : regObj.legalNameOfCollege, "legalNameOfCollege");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.registeredOfficeAddress === undefined || regObj.registeredOfficeAddress === null || regObj.registeredOfficeAddress === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.registeredOfficeAddress === undefined || regObj.registeredOfficeAddress === null) ? "" : regObj.registeredOfficeAddress, "registeredOfficeAddress");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.dateOfIncorporation === undefined || regObj.dateOfIncorporation === null || regObj.dateOfIncorporation === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.dateOfIncorporation === undefined || regObj.dateOfIncorporation === null) ? "" : regObj.dateOfIncorporation, "dateOfIncorporation");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.typeOfCollege === undefined || regObj.typeOfCollege === null || regObj.typeOfCollege === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.typeOfCollege === undefined || regObj.typeOfCollege === null) ? "" : regObj.typeOfCollege, "typeOfCollege");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.collegeIdentificationNumber === undefined || regObj.collegeIdentificationNumber === null || regObj.collegeIdentificationNumber === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.collegeIdentificationNumber === undefined || regObj.collegeIdentificationNumber === null) ? "" : regObj.collegeIdentificationNumber, "collegeIdentificationNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    this.setState({
        errorMessage: errorMessage
    });
    this.props.onSaveUpdate(errorMessage, "", null); 
    if(isValid) {
      this.toggleTab(1);
    }
    return isValid; 
  }

  validateItInfo(){
    const { regObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(regObj.pan === undefined || regObj.pan === null || regObj.pan === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.pan === undefined || regObj.pan === null) ? "" : regObj.pan, "pan");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.tanCircleNumber === undefined || regObj.tanCircleNumber === null || regObj.tanCircleNumber === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.tanCircleNumber === undefined || regObj.tanCircleNumber === null) ? "" : regObj.tanCircleNumber, "tanCircleNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.citTdsLocation === undefined || regObj.citTdsLocation === null || regObj.citTdsLocation === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.citTdsLocation === undefined || regObj.citTdsLocation === null) ? "" : regObj.citTdsLocation, "citTdsLocation");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.tan === undefined || regObj.tan === null || regObj.tan === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.tan === undefined || regObj.tan === null) ? "" : regObj.tan, "tan");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.formSignatory === undefined || regObj.formSignatory === null || regObj.formSignatory === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.formSignatory === undefined || regObj.formSignatory === null) ? "" : regObj.formSignatory, "formSignatory");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    this.setState({
        errorMessage: errorMessage
    });
    this.props.onSaveUpdate(errorMessage, "", null); 
    if(isValid) {
      this.toggleTab(2);
    }
    return isValid; 
  }

  validatePfInfo(){
    const { regObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(regObj.pfNumber === undefined || regObj.pfNumber === null || regObj.pfNumber === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.pfNumber === undefined || regObj.pfNumber === null) ? "" : regObj.pfNumber, "pfNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.pfRegistrationDate === undefined || regObj.pfRegistrationDate === null || regObj.pfRegistrationDate === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.pfRegistrationDate === undefined || regObj.pfRegistrationDate === null) ? "" : regObj.pfRegistrationDate, "pfRegistrationDate");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.pfSignatory === undefined || regObj.pfSignatory === null || regObj.pfSignatory === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.pfSignatory === undefined || regObj.pfSignatory === null) ? "" : regObj.pfSignatory, "pfSignatory");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    this.setState({
        errorMessage: errorMessage
    });
    this.props.onSaveUpdate(errorMessage, "", null); 
    if(isValid) {
      this.toggleTab(3);
    }
    return isValid; 
  }

  validateEsiInfo(){
    const { regObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(regObj.esiNumber === undefined || regObj.esiNumber === null || regObj.esiNumber === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.esiNumber === undefined || regObj.esiNumber === null) ? "" : regObj.esiNumber, "esiNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.esiRegistrationDate === undefined || regObj.esiRegistrationDate === null || regObj.esiRegistrationDate === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.esiRegistrationDate === undefined || regObj.esiRegistrationDate === null) ? "" : regObj.esiRegistrationDate, "esiRegistrationDate");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.esiSignatory === undefined || regObj.esiSignatory === null || regObj.esiSignatory === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.esiSignatory === undefined || regObj.esiSignatory === null) ? "" : regObj.esiSignatory, "esiSignatory");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    this.setState({
        errorMessage: errorMessage
    });
    this.props.onSaveUpdate(errorMessage, "", null); 
    if(isValid) {
      this.toggleTab(4);
    }
    return isValid; 
  }

  validatePtInfo(){
    const { regObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(regObj.ptNumber === undefined || regObj.ptNumber === null || regObj.ptNumber === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.ptNumber === undefined || regObj.ptNumber === null) ? "" : regObj.ptNumber, "ptNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.ptRegistrationDate === undefined || regObj.ptRegistrationDate === null || regObj.ptRegistrationDate === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.ptRegistrationDate === undefined || regObj.ptRegistrationDate === null) ? "" : regObj.ptRegistrationDate, "ptRegistrationDate");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(regObj.ptSignatory === undefined || regObj.ptSignatory === null || regObj.ptSignatory === ""){
        commonFunctions.changeTextBoxBorderToError((regObj.ptSignatory === undefined || regObj.ptSignatory === null) ? "" : regObj.ptSignatory, "ptSignatory");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    this.setState({
        errorMessage: errorMessage
    });
    this.props.onSaveUpdate(errorMessage, "", null); 
    return isValid; 
  }

  save = (e: any) => {
    const { id } = e.nativeEvent.target;
    const {regObj} = this.state;
    if(!this.validateCollegeInfo()){
      this.toggleTab(0);
      return;
    }else if(!this.validateItInfo()){
      this.toggleTab(1);
      return;
    }else if(!this.validatePfInfo()){
      this.toggleTab(2);
      return;
    }else if(!this.validateEsiInfo()){
      this.toggleTab(3);
      return;
    }else if(!this.validatePtInfo()){
      this.toggleTab(4);
      return;
    }
    const legalEntityInput = this.getInput(regObj);
    this.doSave(legalEntityInput, id);
  }

  async doSave(legalEntityInput: any, id: any){
    let btn = document.querySelector("#"+id);
    btn && btn.setAttribute("disabled", "true");
    let exitCode = 0;
    
    await this.props.client.mutate({
        mutation: SAVE_LEGAL_ENTITY,
        variables: { 
            input: legalEntityInput
        },
        // fetchPolicy: 'cache-and-network'
    }).then((resp: any) => {
        console.log("Success in saveLegalEntity Mutation. Exit code : ",resp.data.saveLegalEntity.cmsLegalEntityVo.exitCode);
        exitCode = resp.data.saveLegalEntity.cmsLegalEntityVo.exitCode;
        
    }).catch((error: any) => {
        exitCode = 1;
        console.log('Error in saveLegalEntity : ', error);
    });
    btn && btn.removeAttribute("disabled");
    
    let errorMessage = "";
    let successMessage = "";
    if(exitCode === 0 ){
        successMessage = SUCCESS_MESSAGE_LEGAL_ENTITY_ADDED;
        if(legalEntityInput.id !== null){
            successMessage = SUCCESS_MESSAGE_LEGAL_ENTITY_UPDATED;
        }
    }else {
        errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
    }
    this.setState({
        successMessage: successMessage,
        errorMessage: errorMessage
    });
    this.props.onSaveUpdate("", successMessage, legalEntityInput);
  }
  
  getInput(regObj: any){
    let asId = null;
    // if(headerLabel === "Edit Bank Account"){
    //     console.log("bank account id : ", bankObj.id);
    //     asId = bankObj.id;
    // }else{
    //   console.log("bank account id is null....... ");
    // }
    let legalEntityInput = {
        // id: asId,
        logoFile: null, 		
        logoFilePath: null, 		
        logoFileName: null, 		
        logoFileExtension: null, 		
        legalNameOfCollege: regObj.legalNameOfCollege, 		
        typeOfCollege: regObj.typeOfCollege, 		
        strDateOfIncorporation: regObj.dateOfIncorporation, 		
        registeredOfficeAddress: regObj.registeredOfficeAddress, 		
        collegeIdentificationNumber: regObj.collegeIdentificationNumber, 		
        pan: regObj.pan, 		
        tan: regObj.tan,
        tanCircleNumber: regObj.tanCircleNumber,
        citTdsLocation: regObj.citTdsLocation,
        formSignatory: regObj.formSignatory,
        pfNumber: regObj.pfNumber,
        strPfRegistrationDate: regObj.pfRegistrationDate,
        pfSignatory: regObj.pfSignatory,
        esiNumber: regObj.esiNumber,
        strEsiRegistrationDate: regObj.strEsiRegistrationDate,
        esiSignatory: regObj.esiSignatory,
        ptNumber: regObj.ptNumber,
        strPtRegistrationDate: regObj.ptRegistrationDate,
        ptSignatory: regObj.ptSignatory,
        branchId: regObj.branchId
    };
    return legalEntityInput;
  }

  render() {
    const {activeTab, stateList, cityList, branchList, signatoryList, regObj, ptSignatoryDesignation, esiSignatoryDesignation,
    pfSignatoryDesignation} = this.state;
    return (
      <section className="tab-container">
        <div className="clearfix" />
        <div className="dflex m-b-1 algn-item-center">
          <h5 className="form-h5 m-r-1 fwidth">Registration & Tax information</h5>
          <div className="dflex">
            <select className="gf-form-input m-r-1" name="stateId" id="stateId"  onChange={this.onChange} value={regObj.stateId}>
              <option value="">Select State</option>
              {
                  commonFunctions.createSelectbox(stateList, "id", "id", "stateName")
              }
            </select>
            <select className="gf-form-input m-r-1" name="cityId" id="cityId" onChange={this.onChange} value={regObj.cityId}>
              <option value="">Select City</option>
              {
                  commonFunctions.createSelectbox(cityList, "id", "id", "cityName")
              }
            </select>
            <select className="gf-form-input" required name="branchId" id="branchId" onChange={this.onChange} value={regObj.branchId}>
              <option value="" key="">Select Branch</option>
              {
                  commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
              }
            </select>
          </div>
        </div>
        <Nav tabs className="" id="rmfloat">
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
              College Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
              IT Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 2 ? 'active' : ''}`} onClick={() => { this.toggleTab(2); }} >
              PF Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 3 ? 'active' : ''}`} onClick={() => { this.toggleTab(3); }} >
              ESI Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 4 ? 'active' : ''}`} onClick={() => { this.toggleTab(4); }} > 
            PT Info 
          </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="ltab-contianer">
          <TabPane tabId={0}>
            <div>
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> LEGAL NAME OF COLLEGE<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" disabled className="gf-form-input" onChange={this.onChange} value={regObj.legalNameOfCollege} name="legalNameOfCollege" id="legalNameOfCollege" placeholder="LEGAL NAME OF COLLEGE" maxLength={255} />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> DATE OF INCORPORATION<span style={{ color: 'red' }}> * </span> </label>
                        <input type="date" onChange={this.onChange} value={regObj.dateOfIncorporation} name="dateOfIncorporation" id="dateOfIncorporation" className="gf-form-input " maxLength={10} />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> COLLEGE IDENTIFICATION NUMBER<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" onChange={this.onChange} value={regObj.collegeIdentificationNumber} name="collegeIdentificationNumber" id="collegeIdentificationNumber" className="gf-form-input" placeholder="CIN1234567" maxLength={255} />
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> REGISTERED OFFICE ADDRESS<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" disabled name="registeredOfficeAddress" id="registeredOfficeAddress" onChange={this.onChange} value={regObj.registeredOfficeAddress} className="gf-form-input" placeholder="REGISTERED OFFICE ADDRESS" maxLength={255}/>
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> TYPE OF COLLEGE<span style={{ color: 'red' }}> * </span> </label>
                        <div className="gf-form-select-wrapper">
                          <select name="typeOfCollege" id="typeOfCollege" onChange={this.onChange} value={regObj.typeOfCollege} className="gf-form-input">
                              <option key={""} value={""}>Select Type Of College</option>
                              <option key={"PRIVATE"} value={"PRIVATE"}>PRIVATE</option>
                              <option key={"PUBLIC"} value={"PUBLIC"}>PUBLIC</option>
                          </select>
                        </div>
                      </div>
                      
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="button" onClick={this.validateCollegeInfo} className="btn btn-primary border-bottom"> Next </button>
                    {/* <button type="reset" className="btn btn-danger border-bottom"> Clear </button> */}
                  </div>
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tabId={1}>
          <div>
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">PAN<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="pan" id="pan" onChange={this.onChange} value={regObj.pan} className="gf-form-input text-uppercase" placeholder="ABCDE1234H" maxLength={10}/>
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> TAN CIRCLE NUMBER<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" name="tanCircleNumber" id="tanCircleNumber" onChange={this.onChange} value={regObj.tanCircleNumber} className="gf-form-input text-uppercase" placeholder="12345678" maxLength={255} />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white "> CIT(TDS) LOCATION<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" name="citTdsLocation" id="citTdsLocation" onChange={this.onChange} value={regObj.citTdsLocation} className="gf-form-input text-uppercase" placeholder="CITY NAME" maxLength={255}/>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white ">TAN<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="tan" id="tan" onChange={this.onChange} value={regObj.tan} className="gf-form-input text-uppercase" placeholder="TASN12345H" maxLength={255} />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> FORM 16 SIGNATORY<span style={{ color: 'red' }}> * </span> </label>
                        <div className="gf-form-select-wrapper">
                          <select name="formSignatory" id="formSignatory" onChange={this.onChange} value={regObj.formSignatory} className="gf-form-input" >
                            <option key={""} value={""}>Select Form Signatory</option>
                            {
                                commonFunctions.createSelectbox(signatoryList, "id", "id", "name")
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="button" onClick={this.validateItInfo} className="btn btn-primary border-bottom"> Next </button>
                    {/* <button type="reset" className="btn btn-danger border-bottom"> Clear </button> */}
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={2}>
            <div>
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">PF NUMBER<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="pfNumber" id="pfNumber" onChange={this.onChange} value={regObj.pfNumber} className="gf-form-input text-uppercase" placeholder="AP/HYD/1234567" maxLength={255}/>
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">SIGNATORY<span style={{ color: 'red' }}> * </span></label>
                        <div className="gf-form-select-wrapper">
                          <select name="pfSignatory" id="pfSignatory" onChange={this.onChange} value={regObj.pfSignatory} className="gf-form-input" >
                            <option key={""} value={""}>Select PF Signatory</option>
                            {
                                commonFunctions.createSelectbox(signatoryList, "id", "id", "name")
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> REGISTRATION DATE<span style={{ color: 'red' }}> * </span> </label>
                        <input type="date" name="pfRegistrationDate" id="pfRegistrationDate" onChange={this.onChange} value={regObj.pfRegistrationDate} className="gf-form-input" maxLength={10} />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> SIGNATORY DESIGNATION </label>
                        <input type="text" name="pfSignatoryDesignation" id="pfSignatoryDesignation" value={pfSignatoryDesignation} disabled className="gf-form-input" />
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="button" onClick={this.validatePfInfo} className="btn btn-primary border-bottom"> Next </button>
                    {/* <button type="reset" className="btn btn-danger border-bottom"> Clear </button> */}
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={3}>
            <div >
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">ESI NUMBER<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="esiNumber" id="esiNumber" onChange={this.onChange} value={regObj.esiNumber} className="gf-form-input" placeholder="454876877985465" maxLength={255}/>
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">SIGNATORY<span style={{ color: 'red' }}> * </span></label>
                        <div className="gf-form-select-wrapper">
                          <select name="esiSignatory" id="esiSignatory" onChange={this.onChange} value={regObj.esiSignatory} className="gf-form-input" >
                            <option key={""} value={""}>Select ESI Signatory</option>
                            {
                                commonFunctions.createSelectbox(signatoryList, "id", "id", "name")
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white"> REGISTRATION DATE<span style={{ color: 'red' }}> * </span> </label>
                          <input type="date" name="esiRegistrationDate" id="esiRegistrationDate" onChange={this.onChange} value={regObj.esiRegistrationDate} className="gf-form-input" maxLength={10} />
                        </div>
                        <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white"> SIGNATORY DESIGNATION </label>
                          <input type="text" name="esiSignatoryDesignation" id="esiSignatoryDesignation" value={esiSignatoryDesignation} disabled className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="button" onClick={this.validateEsiInfo} className="btn btn-primary border-bottom"> Next </button>
                    {/* <button type="reset" className="btn btn-danger border-bottom"> Clear </button> */}
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={4}>
          <div >
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">PT NUMBER<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="ptNumber" id="ptNumber" onChange={this.onChange} value={regObj.ptNumber} className="gf-form-input text-uppercase" placeholder="4548768779" maxLength={255}/>
                      </div>
                      <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white">SIGNATORY<span style={{ color: 'red' }}> * </span></label>
                          <div className="gf-form-select-wrapper">
                            <select name="ptSignatory" id="ptSignatory" onChange={this.onChange} value={regObj.ptSignatory} className="gf-form-input" >
                              <option key={""} value={""}>Select PT Signatory</option>
                              {
                                  commonFunctions.createSelectbox(signatoryList, "id", "id", "name")
                              }
                            </select>
                          </div>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> REGISTRATION DATE<span style={{ color: 'red' }}> * </span> </label>
                        <input type="date" name="ptRegistrationDate" id="ptRegistrationDate" onChange={this.onChange} value={regObj.ptRegistrationDate} className="gf-form-input" maxLength={10} />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> SIGNATORY DESIGNATION </label>
                        <input type="text" name="ptSignatoryDesignation" id="ptSignatoryDesignation" value={ptSignatoryDesignation} disabled className="gf-form-input" />
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="button" id="btnSaveLegalEntity" onClick={this.save} className="btn btn-primary border-bottom"> Save </button>
                    {/* <button type="reset" className="btn btn-danger border-bottom"> Clear </button> */}
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </section>
    );
  }
}

export default withApollo(RegistrationPage);