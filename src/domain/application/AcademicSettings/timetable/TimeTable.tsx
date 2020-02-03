import * as React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import wsCmsBackendServiceSingletonClient from '../../../../wsCmsBackendServiceClient';
import { SAVE_LEGAL_ENTITY } from '../../_queries';
import * as moment from 'moment';
import BranchGrid from '../../CollegeSettings/branch/BranchGrid';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, lectures could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_LECTURE_ADDED = "Lectures saved successfully";
const SUCCESS_MESSAGE_LECTURE_UPDATED = "Lectures updated successfully";


export interface TimeTableProps extends React.HTMLAttributes<HTMLElement>{
  [data: string]: any;
  user?: any;
  termList?: any;
  batchList?: any;
  sectionList?: any;
  onSaveUpdate?: any;
}

class LectureSchedule {
  startTimeObj: any;
  endTimeObj: any;
  startTime: any;
  endTime: any;
  isSatLecture: any;
  isBreak: any;
  constructor(startTimeObj: any, endTimeObj: any, startTime: any, endTime: any, isSatLecture: any, isBreak: any) {
    this.startTimeObj = startTimeObj;
    this.endTimeObj = endTimeObj;
    this.startTime = startTime;
    this.endTime = endTime;
    this.isSatLecture = isSatLecture;
    this.isBreak = isBreak;
  }
}

class TimeTablePage<T = {[data: string]: any}> extends React.Component<TimeTableProps, any> {

  constructor(props: TimeTableProps) {
    super(props);
    this.state = {
      activeTab: 0,
      counter: 0,
      totalLectures: [],
      lectureTimings: [],
      user: this.props.user,
      termList: this.props.termList,
      batchList : this.props.batchList,
      sectionList : this.props.sectionList,
      branchId: null,
      academicYearId: null,
      departmentId: null,
      lecObj: { 
        id: null,
        termId: "",
        batchId: "",
        sectionId: "",
      },
      showTimeScheduleAssignment: true,
      errorMessage: "",
      successMessage: "",
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    // this.timeScheduleChange = this.timeScheduleChange.bind(this);
    this.changeCounter = this.changeCounter.bind(this);
    this.validateFields = this.validateFields.bind(this);
    this.validateTimings = this.validateTimings.bind(this);
    this.onClickCreateLectures = this.onClickCreateLectures.bind(this);
    this.goBack = this.goBack.bind(this);
    this.registerSocket = this.registerSocket.bind(this);
    this.createSectionSelectbox = this.createSectionSelectbox.bind(this);
    this.createBatchSelectbox = this.createBatchSelectbox.bind(this);
    this.createLectureTimings = this.createLectureTimings.bind(this);
  }
 
  async componentDidMount(){
    await this.registerSocket();
  }

  registerSocket() {
    const socket = wsCmsBackendServiceSingletonClient.getInstance();

    socket.onmessage = (response: any) => {
        let message = JSON.parse(response.data);
        console.log("TimeTable page. message received from server ::: ", message);
        this.setState({
            branchId: message.selectedBranchId,
            academicYearId: message.selectedAcademicYearId,
            departmentId: message.selectedDepartmentId,
        });
        console.log("TimeTable page. branchId: ",this.state.branchId);
        console.log("TimeTable page. ayId: ",this.state.academicYearId);  
        console.log("TimeTable page. departmentId: ",this.state.departmentId);  
    }

    socket.onopen = () => {
        console.log("TimeTable page. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
        socket.send(this.state.user.login);
    }

    window.onbeforeunload = () => {
        console.log("TimeTable page. Closing websocket connection with cms backend service");
    }
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  handleStateChange = (e: any) => {
    e.preventDefault();
    const { id, name, value } = e.nativeEvent.target;
    const { lecObj, errorMessage } = this.state;
    
    this.setState({
        lecObj: {
            ...lecObj,
            [name]: value
        },
        errorMessage: "",
        successMessage: "",
    });
    console.log("Name : ",name);
    // this.props.onSaveUpdate("", ""); 
    commonFunctions.restoreTextBoxBorderToNormal(name);
  }

  // timeScheduleChange = (e: any) => {
  //   e.preventDefault();
  //   const { id, name, value } = e.nativeEvent.target;
  //   const {lectureTimings, counter} = this.state;

  //   const index = name.split('_');
    
  //   for(let i=0; i<lectureTimings.length; i++){
  //     let ls = lectureTimings[i]; 
  //     if(parseInt(index[1],10) === i){
  //       if(index[0] === "startTime"){
  //         ls.startTime = value;
  //         lectureTimings[i] = ls;
  //         console.log("startTime : "+name+", index : "+index[1]+", value : "+value);
  //       }
  //       if(index[0] === "endTime"){
  //         ls.endTime = value;
  //         lectureTimings[i] = ls;
  //         console.log("endTime : "+name+", index : "+index[1]+", value : "+value);
  //       }
  //       if(index[0] === "satLec"){
  //         ls.satLec = value;
  //         lectureTimings[i] = ls;
  //       }
  //       if(index[0] === "brkAfter"){
  //         ls.brkAfter = value;
  //         lectureTimings[i] = ls;
  //       }
  //     }
  //   }

  // }

  changeCounter(opt: any) {
    // const {lectureTimings} = this.state;
    // if (!(this.isReadOnly || this.isViewOnly)) {
      let counter = this.state.counter + opt;
      if (counter < 0) {
          counter = 0;
      }
      this.setState({
        counter: counter,
      });
      if(counter > 0){
        commonFunctions.restoreTextBoxBorderToNormal("numberOfLectures");
      }
      
    // }
  }
  
  validateFields(obj: any){
    const {branchId, departmentId, counter, modelHeader} = this.state;
    let isValid = true;
    let errorMessage = ""
    
    if(branchId === undefined || branchId === null || branchId === ""){
        errorMessage = "Please select branch from user preferences";
        isValid = false;
        this.setState({
            errorMessage: errorMessage
        });
        return isValid;
    }
    if(departmentId === undefined || departmentId === null || departmentId === ""){
        errorMessage = "Please select department from user preferences";
        isValid = false;
        this.setState({
            errorMessage: errorMessage
        });
        return isValid;
    }
    if(obj.termId === undefined || obj.termId === null || obj.termId === ""){
        commonFunctions.changeTextBoxBorderToError((obj.termId === undefined || obj.termId === null) ? "" : obj.termId, "termId");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    
    if(obj.batchId === undefined || obj.batchId === null || obj.batchId === ""){
        commonFunctions.changeTextBoxBorderToError((obj.batchId === undefined || obj.batchId === null) ? "" : obj.batchId, "batchId");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(obj.sectionId === undefined || obj.sectionId === null || obj.sectionId === ""){
        commonFunctions.changeTextBoxBorderToError((obj.sectionId === undefined || obj.sectionId === null) ? "" : obj.sectionId, "sectionId");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }
    if(counter === 0){
        commonFunctions.changeTextBoxBorderToError((counter === 0) ? "" : "numberOfLectures", "numberOfLectures");
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
    }        
    this.setState({
        errorMessage: errorMessage
    });
    return isValid; 

  }

  validateTimings(lectureTimings: any) {
    let isValid = true;
    let errorMessage = "";
    
    for (let i = 0; i < lectureTimings.length; i++) {
      const ls = lectureTimings[i];
      // console.log("LectureSchedule :: ",ls);
      if (ls.startTime === "") {
        commonFunctions.changeTextBoxBorderToError(ls.startTime, "startTime_"+i);
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
      }
      if (ls.endTime === "") {
        commonFunctions.changeTextBoxBorderToError(ls.endTime, "endTime_"+i);
        errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        isValid = false;
      }
    }
    
    if(isValid){
      for (let i = 0; i < lectureTimings.length; i++) {
        const ls = lectureTimings[i];
        commonFunctions.restoreTextBoxBorderToNormal("startTime_"+i);
        commonFunctions.restoreTextBoxBorderToNormal("endTime_"+i);
      }
      for (let i = 0; i < lectureTimings.length; i++) {
        const ls = lectureTimings[i];
        const stTime = moment(ls.startTime, "HH:mm");
        const ndTime = moment(ls.endTime, "HH:mm");
        // console.log("START TIME : ",stTime);
        // console.log("END TIME : ",ndTime);
        if(stTime.isSameOrAfter(ndTime) || ndTime.isSameOrBefore(stTime)){
          errorMessage = "Start time cannot be same or higher than end time";
          commonFunctions.changeTextBoxBorderToError('', "startTime_"+i);
          commonFunctions.changeTextBoxBorderToError('', "endTime_"+i);
          isValid = false;
          break;
        }
      }

      for (let i = 0; i < lectureTimings.length; i++) {
        const ls = lectureTimings[i];
        let nextIndex = i+1;
        if(ls.isBreak){
          const lsNext = lectureTimings[nextIndex];
          console.log("lsNext :::", lsNext);
          
          const ndTime = moment(ls.endTime, "HH:mm");
          const nextStTime = moment(lsNext.startTime, "HH:mm");
          
          let diff = nextStTime.diff(ndTime)/(1000*60);
          if(diff < 30){
            errorMessage = "Please add atleast 30 mins to start time after break";
            commonFunctions.changeTextBoxBorderToError('', "endTime_"+i);
            commonFunctions.changeTextBoxBorderToError('', "startTime_"+(i+1));
            isValid = false;
            break;
          }
        }
        
      }    
    }

    this.setState({
      errorMessage: errorMessage
    });
    return isValid;
  }

  onClickCreateLectures() {
    const {lecObj, counter} = this.state;
    if(!this.validateFields(lecObj)){
      return;
    }

    let lectureTimings = [];
    for(let i=0; i<counter; i++){
      let objStartTime: any = document.querySelector("#startTime_"+i);
      let objEndTime: any = document.querySelector("#endTime_"+i);
      let objSatLec: any = document.querySelector("#satLec_"+i);
      let objBrkAfter: any = document.querySelector("#brkAfter_"+i);
      let ls = new LectureSchedule(objStartTime, objEndTime, objStartTime.value, objEndTime.value, objSatLec.checked, objBrkAfter.checked);
      lectureTimings.push(ls);
    }
    
    if(!this.validateTimings(lectureTimings)){
      return;
    }

    this.setState({
      lectureTimings: lectureTimings,
      showTimeScheduleAssignment: false
    });
    
    // const elm : any = document.getElementById('createLectureDiv');
    // // elm.className = 'info-container';
    // if (this.totalLectures.length !== counter) {
    //   this.totalLectures.length = 0;
    //   this.lectureTimings = [];
    //   for (let i = 0; i < this.counter; i++) {
    //     this.totalLectures.push({ i });
    //   }
    //   if (this.counter === 0) {
    //     elm.className = 'hide';
    //     return;
    //   }
    // } else {
    //   if (this.counter === 0) {
    //     alert('Please provide some value to number of lectures');
    //     return;
    //   }
    // }
    // elm.className = 'info-container';

    // const lcRptDv = document.getElementById('createLectureReportDiv');
    // lcRptDv.className = 'hide';
    // this.showLectureReport = 1;
    // const timings = this.lectureTimings;

    // if (timings.length > 0) {
    //   this.next();
    // }
  }

  goBack(){
    let lectureTimings: any = [];
    this.setState({
      lectureTimings: lectureTimings,
      showTimeScheduleAssignment: true
    });
  }

  createBatchSelectbox(data: any, value: any, key: any, label: any){
    const{departmentId} = this.state;
    let retData = [];
    if(data.length > 0){
        for(let i=0; i<data.length;i++){
            let item = data[i];
            if(departmentId !== null && departmentId !== undefined){
                if(parseInt(departmentId, 10) === parseInt(item.cmsDepartmentVo.id, 10)){
                    retData.push(
                        <option value={item[value]} key={item[key]}>{item[label]}</option>
                    );
                }
            }
        }
    } 
    return retData;
  }

  createSectionSelectbox(data: any, value: any, key: any, label: any, batchId: any){
    const{ departmentId} = this.state;
    let retData = [];
    if(data.length > 0){
        for(let i=0; i<data.length;i++){
            let item = data[i];
            if(departmentId !== null && departmentId !== undefined){
                if(parseInt(item.batchId,10) === parseInt(batchId,10)){
                    retData.push(
                        <option value={item[value]} key={item[key]}>{item[label]}</option>
                    );
                }
            }
        }
    } 
    return retData;
  }

  createLectureTimings(){
    const {counter, totalLectures, lectureTimings} = this.state;
    const retVal = [];
    
      for(let i=0; i<counter; i++){
        retVal.push(
          <tr>
            <td>{i+1}</td>
            <td>Lecture {i + 1}</td>
            <td>
                <input type="time" name={'startTime_'+i}  id={'startTime_'+i}  onChange={this.handleStateChange}/>
            </td>
            <td>
                <input type="time" name={"endTime_"+i}  id={"endTime_"+i} onChange={this.handleStateChange} />
            </td>
            <td> 
                <label className="switch"> 
                  <input type="checkbox" name={"satLec_"+i} id={"satLec_"+i}  /> 
                  <span className="slider m-0"></span> 
                </label>
            </td>
            <td> 
              <label className="switch"> 
                <input type="checkbox" name={"brkAfter_"+i} id={"brkAfter_"+i}  /> 
                <span className="slider m-0"></span> 
              </label>
            </td>
          </tr>
        );
      }
    return retVal;
  }

  render() {
    const {activeTab, termList, batchList, sectionList, lecObj, errorMessage, successMessage, counter,
            lectureTimings, showTimeScheduleAssignment} = this.state;
    return (
      <section className="tab-container">
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
        <div className="dflex m-b-1 algn-item-center">
          {/* <h5 className="form-h5 m-r-1 fwidth">{ ' '}</h5> */}
        </div>
        <Nav tabs className="" id="rmfloat">
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
              Create Lecture
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
              Search Lecture
            </NavLink>
          </NavItem>
          
        </Nav>
        <TabContent activeTab={activeTab} className="ltab-contianer">
          <TabPane tabId={0}>
            <div>
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    {/* <div className="form-left"> */}
                      <div >
                        <label className="gf-form-label b-0 bg-white">Term<span style={{ color: 'red' }}> * </span> </label>
                        <select className="gf-form-input" name="termId" id="termId" value={lecObj.termId} onChange={this.handleStateChange} disabled={showTimeScheduleAssignment === false ? true : false} >
                            <option value="">Select Term</option>
                            {commonFunctions.createSelectbox(termList, "id", "id", "description")}
                        </select>
                      </div>
                      <div >
                        <label className="gf-form-label bg-transparent b-0">Year<span style={{ color: 'red' }}> * </span></label>
                        <select className="gf-form-input" name="batchId" id="batchId" value={lecObj.batchId} onChange={this.handleStateChange} disabled={showTimeScheduleAssignment === false ? true : false}>
                            <option value="">Select Year</option>
                            {this.createBatchSelectbox(batchList, "id", "id", "batch")}
                        </select>
                      </div>
                      <div >
                        <label className="gf-form-label bg-transparent b-0">Section<span style={{ color: 'red' }}> * </span></label>
                        <select className="gf-form-input" name="sectionId" id="sectionId" value={lecObj.sectionId} onChange={this.handleStateChange} disabled={showTimeScheduleAssignment === false ? true : false}>
                            <option value="">Select Section</option>
                            {this.createSectionSelectbox(sectionList, "id", "id", "section", lecObj.batchId)}
                        </select>
                      </div>
                      <div >
                        <label className="gf-form-label bg-transparent b-0">Number of Lectures<span style={{ color: 'red' }}> * </span></label>
                        <div className="gf-form-input" style={{width:'100px'}} id="numberOfLectures">
                          <button className="btn btn-primary mr-1 btn-small" onClick = {e => this.changeCounter(-1)}
                            disabled={showTimeScheduleAssignment === false ? true : false}>
                            <i className="fa fa-minus" aria-hidden="true" ></i>
                          </button>{this.state.counter}
                          <button className="btn btn-primary ml-1 btn-small" onClick={e => this.changeCounter(1)} 
                            disabled={showTimeScheduleAssignment === false ? true : false}>
                            <i className="fa fa-plus" aria-hidden="true" ></i>
                          </button>
                        </div>
                      </div>  
                    {/* </div> */}
                    </div>
                    <div className="dflex">
                      {
                         showTimeScheduleAssignment === true ? 
                          <div  id="createLectureDiv">
                            {
                              counter > 0 ? 
                                <table id="tttemplt" >
                                  <thead>
                                    <th>Sr. No</th>
                                    <th>Period Name</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Saturday Lecture</th>
                                    <th>Break After</th>
                                  </thead>
                                  <tbody>
                                    {
                                        this.createLectureTimings() 
                                    }
                                  </tbody>
                                </table>
                              : null
                            }
                          </div>
                        :
                        <div className="info-container" >
                          <div className="page-container page-body legal-entities-main-container plr">
                            <table id="tmtd" className="fwidth">
                              <thead>
                                <th></th>
                                <th>Monday</th>
                                <th>Tuesday</th>
                                <th>Wednesday</th>
                                <th>Thursday</th>
                                <th>Friday</th>
                                <th>Saturday</th>
                              </thead>
                               
                            </table>
                          </div>
                        </div>
                      }
                      <div></div>
                      <div></div>
                  </div>
                  <div className="dflex">
                      <div className="m-t-1" >
                        <div>
                          <label className="b-0 " ></label>
                          <input type="button" value="Next" onClick={this.onClickCreateLectures} className="btn btn-primary"/>
                        </div>
                        {
                          showTimeScheduleAssignment === false ? 
                          <div>
                            &nbsp;&nbsp;&nbsp;
                            <label className="b-0 " ></label>
                            <input type="button" value="Back" onClick={this.goBack} className="btn btn-primary"/>
                          </div>  
                          : null
                        }
                      </div>
                      <div >
                        <label className="gf-form-label bg-transparent b-0">{ ' '}</label>
                        
                      </div>
                      <div >
                        <label className="gf-form-label bg-transparent b-0">{ ' '}</label>
                      </div>
                  </div>
                 
                </div>
              </div>
            </div>
          </TabPane>

          <TabPane tabId={1}>
            {/* <div>
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
                  </div>
                </div>
              </div>
            </div> */}
          </TabPane>
          
        </TabContent>
      </section>
    );
  }
}

export default withApollo(TimeTablePage);