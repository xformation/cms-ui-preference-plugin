import * as React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import {graphql, MutationFunc, withApollo} from 'react-apollo';
import { commonFunctions } from '../../_utilites/common.functions';
import * as moment from 'moment';
import wsCmsBackendServiceSingletonClient from '../../../../wsCmsBackendServiceClient';
import {MessageBox} from '../../Message/MessageBox'
import { SAVE_STAFF, GET_STAFF_LIST } from '../../_queries';

export interface StaffProps extends React.HTMLAttributes<HTMLElement>{
  [data: string]: any;
  branchList?: any;  
  departmentList?: any;
  staffList?: any;
  user?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_INVALID_EMAIL_ID = "Invalid email id";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, staff could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_STAFF_ADDED = "New employee saved successfully";
const SUCCESS_MESSAGE_STAFF_UPDATED = "Employee updated successfully";

class Staff extends React.Component<StaffProps, any> {
  DEFAULT_STAFF_IMAGE = "/public/img/user_profile.png";
  constructor(props: StaffProps) {
    super(props);
    this.state = {
      branchList: this.props.branchList,
      departmentList: this.props.departmentList,
      staffList: this.props.staffList,
      allData: this.props.staffList,
      user: this.props.user,
      branchId: null,
      academicYearId: null,
      departmentId: null,
      errorMessage: "",
      successMessage: "",
      staffObj:{
        id: null,
        uploadPhoto: "",
        logoFilePath: "",
        logoFileName: "",
        logoFileExtension: "",
        logoFile: "", // base64 encoded string
        teacherName: "",
        teacherMiddleName: "",
        teacherLastName: "",
        fatherName: "",
        fatherMiddleName: "",
        fatherLastName: "",
        spouseName: "",
        spouseMiddleName: "",
        spouseLastName: "",
        motherName: "",
        motherMiddleName: "",
        motherLastName: "",
        aadharNo: "",
        panNo: "",
        dateOfBirth: "",
        placeOfBirth: "",
        religion: "",
        caste: "",
        subCaste: "",
        sex: "",
        bloodGroup: "",
        address: "",
        town: "",
        state: "",
        country: "",
        pinCode: "",
        teacherContactNumber: "",
        alternateContactNumber: "",
        teacherEmailAddress: "",
        alternateEmailAddress: "",
        relationWithStaff: "",
        emergencyContactName: "",
        emergencyContactMiddleName: "",
        emergencyContactLastName: "",
        emergencyContactNo: "",
        emergencyContactEmailAddress: "",
        status: "",
        employeeId: "",
        designation: "",
        staffType: "",
        departmentId: "",
        branchId: "",
        searchName: "",
      },
      activeTab: 0,
      isModalOpen: false,
      states: [],
      cities: [],
      selectedState: '',
      selectedCity: '',
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
    this.deleteImage = this.deleteImage.bind(this);
    this.registerSocket = this.registerSocket.bind(this);
    this.validatePersonalInfo = this.validatePersonalInfo.bind(this);
    this.validateContactDetails = this.validateContactDetails.bind(this);
    this.validateEmergencyDetails = this.validateEmergencyDetails.bind(this);
    this.save = this.save.bind(this);
    this.doSave = this.doSave.bind(this);
    this.getInput = this.getInput.bind(this);
    this.searchStaff = this.searchStaff.bind(this);
    this.onClickCheckbox = this.onClickCheckbox.bind(this);
    this.checkAll = this.checkAll.bind(this);
    this.exportStaff = this.exportStaff.bind(this);
    this.convertArrayOfObjectsToCSV = this.convertArrayOfObjectsToCSV.bind(this);
    this.download = this.download.bind(this);
  }

  async componentDidMount(){
    await this.registerSocket();
  }

  registerSocket() {
    const socket = wsCmsBackendServiceSingletonClient.getInstance();

    socket.onmessage = (response: any) => {
        let message = JSON.parse(response.data);
        console.log("Staff. message received from server ::: ", message);
        this.setState({
            branchId: message.selectedBranchId,
            academicYearId: message.selectedAcademicYearId,
            departmentId: message.selectedDepartmentId,
        });
        console.log("Staff. branchId: ",this.state.branchId);
        console.log("Staff. ayId: ",this.state.academicYearId);  
    }

    socket.onopen = () => {
        console.log("Staff. Opening websocekt connection to cmsbackend. User : ",new URLSearchParams(location.search).get("signedInUser"));
        socket.send(new URLSearchParams(location.search).get("signedInUser"));
    }

    window.onbeforeunload = () => {
        console.log("Staff. Closing websocket connection with cms backend service");
    }
  }

  onChange = (e: any) => {
    e.preventDefault();
    const { name, value } = e.nativeEvent.target;
    const { staffObj } = this.state;
    this.setState({
      staffObj: {
          ...staffObj,
          [name]: value
      },
      errorMessage: "",
      successMessage: "",
    });
  
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  // componentDidMount() {

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
  create() {
    let {count, countParticularDiv, academicYearId, branchId, departmentId } = this.state;
    console.log("Create method: branchId: "+branchId+", ayId: "+academicYearId+", deptId: "+departmentId);
    countParticularDiv = 0;
    count = [];
    this.setState({
      countParticularDiv,
      count,
    });

    let fCatGrid: any = document.querySelector('#crdiv');
    fCatGrid.setAttribute('class', 'grid');
    let fCatGrida: any = document.querySelector('#lidiv');
    fCatGrida.setAttribute('class', 'hide');
    let createbtns: any = document.querySelector('#createbtn');
    createbtns.setAttribute('class', 'hide');
    let backbtn: any = document.querySelector('#backbtn');
    backbtn.setAttribute('class', 'btn btn-primary m-r-1');
  }
  back() {
    let {count, countParticularDiv} = this.state;
    countParticularDiv = 0;
    count = [];
    this.setState({
      countParticularDiv,
      count,
    });
    let fCatGrid: any = document.querySelector('#crdiv');
    fCatGrid.setAttribute('class', 'hide');
    let fCatGrida: any = document.querySelector('#lidiv');
    fCatGrida.setAttribute('class', 'p-1 page-body legal-entities-main-container');
    let createbtns: any = document.querySelector('#createbtn');
    createbtns.setAttribute('class', 'btn btn-primary m-r-1');
    let backbtn: any = document.querySelector('#backbtn');
    backbtn.setAttribute('class', 'hide');
  }

  getImage = (e: any) => {
    const { staffObj } = this.state;
    let objImg : any = document.querySelector("#uploadPhoto");
    objImg.src = staffObj.uploadPhoto;
    staffObj.uploadPhoto = URL.createObjectURL(e.target.files[0]);
    var r = new FileReader();
    r.onload = function (e: any){
      staffObj.fileName = e.target.result;
      console.log('Image converted to base64 string :\n\n' + staffObj.fileName);
    };
    r.readAsDataURL(e.target.files[0]);    

      this.setState({
        staffObj: staffObj
      })     
  }

  deleteImage(){
    const { staffObj } = this.state;
    let objImg : any = document.querySelector("#uploadPhoto");
    objImg.src = null;
    // objImg.setAttribute('src', this.DEFAULT_STAFF_IMAGE);
    staffObj.uploadPhoto = "";
    staffObj.fileName = "";
    this.setState({
      staffObj: staffObj
    })
  }

  validatePersonalInfo(){
    const { staffObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(staffObj.designation === undefined || staffObj.designation === null || staffObj.designation.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.designation === undefined || staffObj.designation === null) ? "" : staffObj.designation, "designation");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.staffType === undefined || staffObj.staffType === null || staffObj.staffType === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.staffType === undefined || staffObj.staffType === null) ? "" : staffObj.staffType, "staffType");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.status === undefined || staffObj.status === null || staffObj.status === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.status === undefined || staffObj.status === null) ? "" : staffObj.status, "status");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.teacherName === undefined || staffObj.teacherName === null || staffObj.teacherName.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.teacherName === undefined || staffObj.teacherName === null) ? "" : staffObj.teacherName, "teacherName");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.teacherLastName === undefined || staffObj.teacherLastName === null || staffObj.teacherLastName.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.teacherLastName === undefined || staffObj.teacherLastName === null) ? "" : staffObj.teacherLastName, "teacherLastName");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.fatherName === undefined || staffObj.fatherName === null || staffObj.fatherName.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.fatherName === undefined || staffObj.fatherName === null) ? "" : staffObj.fatherName, "fatherName");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(staffObj.fatherLastName === undefined || staffObj.fatherLastName === null || staffObj.fatherLastName.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.fatherLastName === undefined || staffObj.fatherLastName === null) ? "" : staffObj.fatherLastName, "fatherLastName");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(staffObj.dateOfBirth === undefined || staffObj.dateOfBirth === null || staffObj.dateOfBirth.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.dateOfBirth === undefined || staffObj.dateOfBirth === null) ? "" : staffObj.dateOfBirth, "dateOfBirth");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(staffObj.sex === undefined || staffObj.sex === null || staffObj.sex.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.sex === undefined || staffObj.sex === null) ? "" : staffObj.sex, "sex");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    this.setState({
        errorMessage: errorMessage
    });
    // this.props.onSaveUpdate(errorMessage, ""); 
    if(isValid) {
      this.toggleTab(1);
    }
    return isValid;
  }

  validateContactDetails(){
    const { staffObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(staffObj.designation === undefined || staffObj.designation === null || staffObj.designation.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.designation === undefined || staffObj.designation === null) ? "" : staffObj.designation, "designation");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.staffType === undefined || staffObj.staffType === null || staffObj.staffType === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.staffType === undefined || staffObj.staffType === null) ? "" : staffObj.staffType, "staffType");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.status === undefined || staffObj.status === null || staffObj.status === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.status === undefined || staffObj.status === null) ? "" : staffObj.status, "status");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.address === undefined || staffObj.address === null || staffObj.address.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.address === undefined || staffObj.address === null) ? "" : staffObj.address, "address");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.teacherContactNumber === undefined || staffObj.teacherContactNumber === null || staffObj.teacherContactNumber.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.teacherContactNumber === undefined || staffObj.teacherContactNumber === null) ? "" : staffObj.teacherContactNumber, "teacherContactNumber");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.fatherName === undefined || staffObj.teacherEmailAddress === null || staffObj.teacherEmailAddress.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.teacherEmailAddress === undefined || staffObj.teacherEmailAddress === null) ? "" : staffObj.teacherEmailAddress, "teacherEmailAddress");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    
    this.setState({
        errorMessage: errorMessage
    });
    // this.props.onSaveUpdate(errorMessage, ""); 
    if(isValid) {
      this.toggleTab(2);
    }
    return isValid;
  }

  validateEmergencyDetails(){
    const { staffObj } = this.state;
    let isValid = true;
    let errorMessage = ""
    if(staffObj.designation === undefined || staffObj.designation === null || staffObj.designation.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.designation === undefined || staffObj.designation === null) ? "" : staffObj.designation, "designation");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.staffType === undefined || staffObj.staffType === null || staffObj.staffType === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.staffType === undefined || staffObj.staffType === null) ? "" : staffObj.staffType, "staffType");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.status === undefined || staffObj.status === null || staffObj.status === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.status === undefined || staffObj.status === null) ? "" : staffObj.status, "status");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.relationWithStaff === undefined || staffObj.relationWithStaff === null || staffObj.relationWithStaff === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.relationWithStaff === undefined || staffObj.relationWithStaff === null) ? "" : staffObj.relationWithStaff, "relationWithStaff");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.emergencyContactName === undefined || staffObj.emergencyContactName === null || staffObj.emergencyContactName.trim() === ""){
        commonFunctions.changeTextBoxBorderToError((staffObj.emergencyContactName === undefined || staffObj.emergencyContactName === null) ? "" : staffObj.emergencyContactName, "emergencyContactName");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(staffObj.emergencyContactLastName === undefined || staffObj.emergencyContactLastName === null || staffObj.emergencyContactLastName.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.emergencyContactLastName === undefined || staffObj.emergencyContactLastName === null) ? "" : staffObj.emergencyContactLastName, "emergencyContactLastName");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }
    if(staffObj.emergencyContactNo === undefined || staffObj.emergencyContactNo === null || staffObj.emergencyContactNo.trim() === ""){
      commonFunctions.changeTextBoxBorderToError((staffObj.emergencyContactNo === undefined || staffObj.emergencyContactNo === null) ? "" : staffObj.emergencyContactNo, "emergencyContactNo");
      errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
      isValid = false;
    }

    if(isValid){
      if(staffObj.emergencyContactEmailAddress.trim() !== ""){
        if(!commonFunctions.validateEmail(staffObj.emergencyContactEmailAddress)){
            errorMessage = ERROR_MESSAGE_INVALID_EMAIL_ID;
            commonFunctions.changeComponentBorderToError("emergencyContactEmailAddress");
            
            this.setState({
                errorMessage: errorMessage
            });
            return;
        } 
      }
    }
    

    this.setState({
        errorMessage: errorMessage
    });
    // this.props.onSaveUpdate(errorMessage, ""); 
    if(isValid) {
      this.toggleTab(2);
    }
    return isValid;
  }

  getInput(staffObj: any){
    const {branchId, departmentId} = this.state;
    let inputObj = {
        id: (staffObj.id !== null || staffObj.id !== undefined || staffObj.id !== "") ? staffObj.id : null,
        uploadPhoto: null,
        logoFilePath: null,
        logoFileName: null,
        logoFileExtension: null,
        logoFile: null,
        teacherName: staffObj.teacherName,
        teacherMiddleName: staffObj.teacherMiddleName,
        teacherLastName: staffObj.teacherLastName,
        fatherName: staffObj.fatherName,
        fatherMiddleName: staffObj.fatherMiddleName,
        fatherLastName: staffObj.fatherLastName,
        spouseName: staffObj.spouseName,
        spouseMiddleName: staffObj.spouseMiddleName,
        spouseLastName: staffObj.spouseLastName,
        motherName: staffObj.motherName,
        motherMiddleName: staffObj.motherMiddleName,
        motherLastName: staffObj.motherLastName,
        aadharNo: staffObj.aadharNo,
        panNo: staffObj.panNo,
        placeOfBirth: staffObj.placeOfBirth,
        religion: staffObj.religion,
        caste: staffObj.caste,
        subCaste: staffObj.subCaste,
        sex: staffObj.sex,
        address: staffObj.address,
        town: staffObj.town,
        state: staffObj.state,
        country: staffObj.country,
        pinCode: staffObj.pinCode,
        teacherContactNumber: staffObj.teacherContactNumber,
        alternateContactNumber: staffObj.alternateContactNumber,
        teacherEmailAddress: staffObj.teacherEmailAddress,
        alternateEmailAddress: staffObj.alternateEmailAddress,
        relationWithStaff: staffObj.relationWithStaff,
        emergencyContactName: staffObj.emergencyContactName,
        emergencyContactMiddleName: staffObj.emergencyContactMiddleName,
        emergencyContactLastName: staffObj.emergencyContactLastName,
        emergencyContactNo: staffObj.emergencyContactNo,
        emergencyContactEmailAddress: staffObj.emergencyContactEmailAddress,
        status: staffObj.status,
        designation: staffObj.designation,
        staffType: staffObj.staffType,
        departmentId: departmentId, 
        branchId: branchId,
        strDateOfBirth: (staffObj.dateOfBirth !== null || staffObj.dateOfBirth !== undefined || staffObj.dateOfBirth !== "") ? moment(staffObj.dateOfBirth).format("DD-MM-YYYY") : "",	
    };
    return inputObj;
  }

  async doSave(inputObj: any, id: any){
    let btn = document.querySelector("#"+id);
    btn && btn.setAttribute("disabled", "true");
    let exitCode = 0;
    
    await this.props.client.mutate({
        mutation: SAVE_STAFF,
        variables: { 
            input: inputObj
        },
    }).then((resp: any) => {
        console.log("Success in saveStaff Mutation. Exit code : ",resp.data.saveTeacher.cmsTeacherVo.exitCode);
        exitCode = resp.data.saveTeacher.cmsTeacherVo.exitCode;
        
        this.setState({
          staffList: resp.data.saveTeacher.cmsTeacherVo.dataList
        });
    }).catch((error: any) => {
        exitCode = 1;
        console.log('Error in saveTeacher : ', error);
    });
    btn && btn.removeAttribute("disabled");
    
    let errorMessage = "";
    let successMessage = "";
    if(exitCode === 0 ){
        successMessage = SUCCESS_MESSAGE_STAFF_ADDED;
        if(inputObj.id !== null){
            successMessage = SUCCESS_MESSAGE_STAFF_UPDATED;
        }
    }else {
        errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
    }
    this.setState({
        successMessage: successMessage,
        errorMessage: errorMessage
    });
    // this.props.onSaveUpdate(errorMessage, successMessage);
  }

  save = (e: any) => {
    const { id } = e.nativeEvent.target;
    const {staffObj} = this.state;
    if(!this.validatePersonalInfo()){
      this.toggleTab(0);
      return;
    }else if(!this.validateContactDetails()){
      this.toggleTab(1);
      return;
    }else if(!this.validateEmergencyDetails()){
      this.toggleTab(2);
      return;
    }
    const inputObj = this.getInput(staffObj);
    this.doSave(inputObj, id);
  }

  checkAll(e: any) {
    const {staffList} = this.state;
    let chkAll = e.nativeEvent.target.checked;
    let els = document.querySelectorAll('input[type=checkbox]');

    var empty = [].filter.call(els, function(el: any) {
      if (chkAll) {
        el.checked = true;
      } else {
        el.checked = false;
      }
    });
  }

  onClickCheckbox(index: any, e: any) {
    const {id} = e.nativeEvent.target;
    let chkBox: any = document.querySelector('#' + id);
    chkBox.checked = e.nativeEvent.target.checked;
  }

  createRows(objAry: any) {
    const {branchId, departmentId} = this.state;
    console.log("createRows() - Staff list on staff page:  ", objAry);
    if(objAry === undefined || objAry === null) {
        return;
    }
    const aryLength = objAry.length;
    const retVal = [];
    for (let i = 0; i < aryLength; i++) {
        const obj = objAry[i];
        if(parseInt(obj.branchId,10) === parseInt(branchId,10) &&
              parseInt(obj.departmentId,10) === parseInt(departmentId,10)){
                retVal.push(
                  <tr key="teacher.id">
                        <td> <input type="checkbox" id={'chk'+obj.id} onClick={(e: any) => this.onClickCheckbox(i, e)}/> </td>
                        <td>{obj.teacherName}</td>
                        <td>{obj.employeeId}</td>
                        <td>{obj.designation}</td>
                        <td>{obj.cmsBranchVo.branchName}</td>
                        <td>{obj.cmsDepartmentVo.name}</td>
                        <td>{obj.sex}</td>
                        <td>{obj.staffType}</td>
                        <td>{obj.status}</td>
                  </tr>
        
                  
                    // <td>
                    //     {
                    //         <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Holiday")}>Edit</button>
                    //     }
                    // </td>
                  
                );
              }
        
    }
    return retVal;
  }

  searchStaff(e: any) {
    const { name, value } = e.target;
    this.setState({
        [name]: value
    });
    let result = [];
    const { allData } = this.state;
    if (value !== "") {
        if (allData && allData.length > 0) {
            for (let i = 0; i < allData.length; i++) {
                let teacher = allData[i];
                let name = teacher.teacherName + " " + teacher.employeeId + " " + teacher.designation+ " " + teacher.cmsBranchVo.branchName + " " + teacher.cmsDepartmentVo.name + " " +teacher.sex + " " + teacher.staffType + " " + teacher.status;
                name = name.toLowerCase();
                if (name.indexOf(value.toLowerCase()) !== -1) {
                    result.push(teacher);
                }
            }
            this.setState({
                staffList: result
            });
        }
    } else {
        this.setState({
          staffList: allData
        });
    }
  }

  exportStaff(objAry: any) {
    const staffToExport = [];
    // const mutateResLength = objAry.length;
    // let fileType: any = document.querySelector('#fileType');
    // if (fileType.value == '') {
    //   alert('Please select a file type to export');
    //   return;
    // }
    for (let x = 0; x < objAry.length; x++) {
      const tempObj = objAry[x];
      // const students = tempObj.data.getStudentList;
      // const length = students.length;
      // for (let i = 0; i < length; i++) {
        // const student = students[i];
        if(tempObj.cmsBranchVo.id === this.state.branchId && tempObj.cmsDepartmentVo.id === this.state.departmentId){
          console.log("checkbox id : ",tempObj.id);
          let chkBox: any = document.querySelector('#chk'+tempObj.id);
          if (chkBox !== null && chkBox !== undefined && chkBox.checked) {
            staffToExport.push(tempObj);
          }
        }
        
        
      // }
    }
    if (staffToExport.length > 0) {
      var csvContent = this.convertArrayOfObjectsToCSV(staffToExport);
      this.download(csvContent, 'studentlist.csv', 'text/csv;encoding:utf-8');
    } else {
      alert('Please select records to export');
    }
  }

  download(content: any, fileName: any, mimeType: any) {
    var a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) {
      // IE10
      navigator.msSaveBlob(
        new Blob([content], {
          type: mimeType,
        }),
        fileName
      );
    } else if (URL && 'download' in a) {
      //html5 A[download]
      a.href = URL.createObjectURL(
        new Blob([content], {
          type: mimeType,
        })
      );
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
  }

  convertArrayOfObjectsToCSV(data: any) {
    var result: any, ctr: any, keys: any, columnDelimiter: any, lineDelimiter: any;

    data = data || null;
    if (data == null || !data.length) {
      return null;
    }

    columnDelimiter = ',';
    lineDelimiter = '\n';

    keys = Object.keys(data[0]);

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    data.forEach(function(item: any) {
      ctr = 0;
      keys.forEach(function(key: any) {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];
        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  }

  render() {
    const {isModalOpen, staffList, activeTab, staffObj, errorMessage, successMessage} = this.state;
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
        <div className="authorized-signatory-container m-b-1 dflex ht bg-heading">
          <h4 className="ptl-06">Staff Details</h4>
          <div className="">
            <button id="createbtn" className="btn btn-primary m-r-1" onClick={this.create} > Create </button>
            <button id="backbtn" className="hide" onClick={this.back}> Back </button>
          </div>
        </div>

        
        <div id="crdiv" className="hide">
          <div className="leftbar">
            <div className="row p-1">
              <div className="col-md-6 col-lg-12 col-xs-12 col-sm-6" >
                <img  id="uploadPhoto" src={staffObj.uploadPhoto || this.DEFAULT_STAFF_IMAGE}  className="student-photo" style={{width:'150px', height:'150px'}}  />
              </div>
              
            </div>
            <div className="col-md-6 col-lg-12 col-xs-12 col-sm-6 gf-form m-b-1">
              <label className="upload-cursor m-r-2" style={{marginLeft:'0rem'}}>
                <input type="file" id="d-none"  accept="image/*" onChange={this.getImage}/>
                Upload <i className="fa fa-info-circle l-grey" aria-hidden="true" />
              </label>
              <label className="upload-cursor">
                <input type="button" id="d-none" onClick={this.deleteImage}/>
                Delete
              </label>
            </div>
            <div className="form-justify">
              {/* <label className="gf-form-label b-0 bg-transparent">Employee Id:</label> */}
              {/* <input className="gf-form-input width-11 m-b-1" required type="number" name="employeeid" /> */}
            </div>
            <div className="form-justify">
              <label className="gf-form-label b-0 bg-transparent">Designation<span style={{ color: 'red' }}> * </span></label>
              <input name="designation" id="designation" className="gf-form-input width-11 m-b-1" type="text" onChange={this.onChange} value={staffObj.designation}   maxLength={255}  />
            </div>
            <div className="form-justify">
              <label className="gf-form-label b-0 bg-transparent">Staff Type<span style={{ color: 'red' }}> * </span></label>
              <select name="staffType" id="staffType" className="gf-form-input width-11 m-b-1" onChange={this.onChange} value={staffObj.staffType} >
                <option value="">Select Staff Type</option>
                <option value="TEACHING">TEACHING</option>
                <option value="NONTEACHING">NONTEACHING</option>
              </select>
            </div>
            <div className="form-justify">
              <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
              <select name="status" id="status"  className="gf-form-input width-11" onChange={this.onChange} value={staffObj.status} >
                  <option key={""} value={""}>Select Status</option>
                  <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                  <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                  <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
              </select>
            </div>
          </div>
          <div className="">
            <Nav tabs className="" id="rmfloat">
              <NavItem className="cursor-pointer">
                <NavLink
                  className={`${activeTab === 0 ? 'active' : ''}`}
                  onClick={() => {
                    this.toggleTab(0);
                  }}
                >
                  Personal Details
                </NavLink>
              </NavItem>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={`${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => {
                    this.toggleTab(1);
                  }}
                >
                  Contact Details
                </NavLink>
              </NavItem>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={`${activeTab === 2 ? 'active' : ''}`}
                  onClick={() => {
                    this.toggleTab(2);
                  }}
                >
                  Emergency Contact
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="ltab-contianer p-0">
              <TabPane tabId={0}>
                <div>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="">Name<span style={{ color: 'red' }}> * </span></label>
                      <input onChange={this.onChange} value={staffObj.teacherName} name="teacherName" id="teacherName" className="gf-form-input fwidth" type="tex" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Middle Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.teacherMiddleName} name="teacherMiddleName" id="teacherMiddleName" maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Last Name<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.teacherLastName} name="teacherLastName" id="teacherLastName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Father Name<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.fatherName} name="fatherName" id="fatherName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Father Middle Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.fatherMiddleName} name="fatherMiddleName" id="fatherMiddleName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Father Last Name<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.fatherLastName} name="fatherLastName" id="fatherLastName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Spouse Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.spouseName} name="spouseName" id="spouseName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Spouse Middle Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.spouseMiddleName} name="spouseMiddleName" id="spouseMiddleName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Spouse Last Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.spouseLastName} name="spouseLastName" id="spouseLastName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Mother Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.motherName} name="motherName" id="motherName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Mother Middle Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.motherMiddleName} name="motherMiddleName" id="motherMiddleName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Mother Last Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.motherLastName} name="motherLastName" id="motherLastName" maxLength={255} />
                    </div>
                    {/* <div>
                      <label htmlFor="">Adhar No</label>
                      <input className="gf-form-input fwidth" type="text" name="adhar" maxLength={255} />
                    </div> */}
                    <div>
                      <label htmlFor="">Date Of Birth<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="date" onChange={this.onChange} value={staffObj.dateOfBirth} name="dateOfBirth" id="dateOfBirth" maxLength={10}/>
                    </div>
                    <div>
                      <label htmlFor="">Place Of Birth</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.placeOfBirth} name="placeOfBirth" id="placeOfBirth" />
                    </div>
                    <div>
                      <label htmlFor="">Religion</label>
                      <select className="gf-form-input fwidth" onChange={this.onChange} value={staffObj.religion} name="religion" id="religion">
                        <option value="">Select Religion</option>
                        <option value="HINDU">HINDU</option>
                        <option value="MUSLIM">MUSLIM</option>
                        <option value="SIKH">SIKH</option>
                        <option value="CHRISTIAN">CHRISTIAN</option>
                        <option value="BUDH">BUDH</option>
                        <option value="PARSIAN">PARSIAN</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="">Caste</label>
                      <select className="gf-form-input fwidth" onChange={this.onChange} value={staffObj.caste} name="caste" id="caste">
                        <option value="">Select Caste</option>
                        <option value="GENERAL">GENERAL</option>
                        <option value="SC">SCHEDULED CASTES</option>
                        <option value="ST">SCHEDULED TRIBES</option>
                        <option value="OBC">OTHER BACKWARDS CLASSES</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="">Sub Caste</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.subCaste} name="subCaste" id="subCaste" maxLength={255} />
                    </div>
                    {/* <div>
                      <label htmlFor="">Age*</label>
                      <input
                        className="gf-form-input fwidth"
                        required
                        name="age"
                        type="text"
                        maxLength={255}
                      />
                    </div> */}
                    <div>
                      <label htmlFor="">Gender<span style={{ color: 'red' }}> * </span></label>
                      <select className="gf-form-input fwidth" onChange={this.onChange} value={staffObj.sex} name="sex" id="sex">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="">Adhar No</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.aadharNo} name="aadharNo" id="aadharNo" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">PAN No</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.panNo} name="panNo" id="panNo" maxLength={255} />
                    </div>
                    {/* <div>
                      <label htmlFor="">Blood Group*</label>
                      <select className="gf-form-input fwidth" required>
                        <option value="">Select Blood Group</option>
                      </select>
                    </div> */}
                    <div></div>
                    <div>
                      <button type="button" onClick={this.validatePersonalInfo} className="btn btn-primary border-bottom"> Next </button>
                    </div>
                  </div>
                </div>
              </TabPane>

              <TabPane tabId={1}>
                <div>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="">Address<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.address} name="address" id="address" maxLength={255} />
                    </div>
                    {/* <div>
                      <label htmlFor="">Address Line 2</label>
                      <input className="gf-form-input fwidth" name="adr2" maxLength={255} />
                    </div> */}
                    {/* <div>
                      <label htmlFor="">Address Line 3</label>
                      <input className="gf-form-input fwidth" type="text"name="adr3" maxLength={255} />
                    </div> */}
                    <div>
                      <label htmlFor="">City</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.town} name="town" id="town"  maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">State</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.state} name="state" id="state" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Country</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.country} name="country" id="country" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Pin Code</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.pinCode} name="pinCode" id="pinCode" maxLength={255} />
                    </div>
                    <div> 
                      <label htmlFor="">Contact Number<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.teacherContactNumber} name="teacherContactNumber" id="teacherContactNumber" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Alternate Contact Number</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.alternateContactNumber} name="alternateContactNumber" id="alternateContactNumber" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Email Address<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.teacherEmailAddress} name="teacherEmailAddress" id="teacherEmailAddress" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Alternate Email Address</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.alternateEmailAddress}  name="alternateEmailAddress" id="alternateEmailAddress" maxLength={255} />
                    </div>
                    
                    <div>
                      <button type="button" onClick={this.validateContactDetails} className="btn btn-primary border-bottom"> Next </button>
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId={2}>
                <div>
                  <div className="staff-p">
                    <label htmlFor="">Relation with Staff<span style={{ color: 'red' }}> * </span></label>
                    <select className="gf-form-input fwidth" onChange={this.onChange} value={staffObj.relationWithStaff} name="relationWithStaff" id="relationWithStaff">
                      <option value="">Select Relation</option>
                      <option value="FATHER">FATHER</option>
                      <option value="MOTHER">MOTHER</option>
                      <option value="GUARDIAN">GUARDIAN</option>
                    </select>
                  </div>
                  <div className="form-grid m-t-1">
                    <div>
                      <label htmlFor="">Name<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.emergencyContactName} name="emergencyContactName" id="emergencyContactName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Middle Name</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.emergencyContactMiddleName} name="emergencyContactMiddleName" id="emergencyContactMiddleName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Last Name<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.emergencyContactLastName} name="emergencyContactLastName" id="emergencyContactLastName" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Contact Number<span style={{ color: 'red' }}> * </span></label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.emergencyContactNo} name="emergencyContactNo" id="emergencyContactNo" maxLength={255} />
                    </div>
                    <div>
                      <label htmlFor="">Email Address</label>
                      <input className="gf-form-input fwidth" type="text" onChange={this.onChange} value={staffObj.emergencyContactEmailAddress} name="emergencyContactEmailAddress" id="emergencyContactEmailAddress" maxLength={255} />
                    </div>
                    <div></div>
                    <div>
                      <button type="button" name="btnSaveStaff" id="btnSaveStaff" onClick={this.save} className="btn btn-primary border-bottom"> Save </button>
                    </div>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </div>
        <div id="lidiv" className="p-1 page-body legal-entities-main-container">
          <div className="staff-management">
            {/* <div>
              <label htmlFor="">Gender</label>
              <select className="gf-form-input">
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Staff Type</label>
              <select className="gf-form-input">
                <option value="">Select Staff Type</option>
                <option value="TEACHING">TEACHING</option>
                <option value="NONTEACHING">NONTEACHING</option>
              </select>
            </div> */}
            <div className="margin-bott m-r-1">
              <label htmlFor="">Search</label>
              <input type="text" className="input" placeholder="search" name="searchStaff" onChange={this.searchStaff} value={this.state.searchName} />
            </div>
            <a onClick={(e: any) => this.exportStaff(staffList) } className="btn btn-primary" style={{marginTop: '-5px'}} >
              Export To CSV
            </a>
          </div>

          <table className="staff-management-table">
            <thead>
              <th>
                <input type="checkbox" value="checkedAll" onClick={(e: any) => this.checkAll(e)} key="teacher.id" id="chkAll" name="chkAll"/>
              </th>
              <th>Name</th>
              <th>Emp Id</th>
              <th>Designation</th>
              <th>Branch</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Type</th>
              <th>status</th>
            </thead>
            <tbody>
            {
              staffList !== null && staffList !== undefined && staffList.length > 0 ?
                this.createRows(staffList)
              :null
              
            }
            
              
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default withApollo(Staff)