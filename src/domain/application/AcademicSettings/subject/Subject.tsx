import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import wsCmsBackendServiceSingletonClient from '../../../../wsCmsBackendServiceClient';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_SUBJECT } from '../../_queries';


export interface SubjectProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any;
    subjectList?: any;
    batchList?: any;
    teacherList?: any;
    sectionList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, subject could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_SUBJECT_ADDED = "New subject saved successfully";
const SUCCESS_MESSAGE_SUBJECT_UPDATED = "Subject updated successfully";

class Subject<T = {[data: string]: any}> extends React.Component<SubjectProps, any> {
    constructor(props: SubjectProps) {
        super(props);
        this.state = {
            subjectList: this.props.subjectList,
            batchList: this.props.batchList,
            teacherList: this.props.teacherList,
            sectionList: this.props.sectionList,
            user: this.props.user,
            isModalOpen: false,
            branchId: null,
            academicYearId: null,
            departmentId: null,
            subjectObj: {
                id: "",    
                subjectCode: "",
                subjectType: "",
                subjectDesc: "",
                status: "",
                batchId: "",
                teacherId: "",
                sectionId: "",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: "",
            assignModelHeader: "",
        };
        this.registerSocket = this.registerSocket.bind(this);
        this.validateFields = this.validateFields.bind(this);
        this.getInput = this.getInput.bind(this);
        this.createBatchSelectbox = this.createBatchSelectbox.bind(this);
        this.createRows = this.createRows.bind(this);
        this.createSubjectSelectbox = this.createSubjectSelectbox.bind(this);
    }
    
    async componentDidMount(){
        await this.registerSocket();
    }
    registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("Subject page. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("Subject page. branchId: ",this.state.branchId);
            console.log("Subject page. ayId: ",this.state.academicYearId);  
            console.log("Subject page. departmentId: ",this.state.departmentId);  
        }
    
        socket.onopen = () => {
            console.log("Subject page. Opening websocekt connection to cmsbackend. User : ",new URLSearchParams(location.search).get("signedInUser"));
            socket.send(new URLSearchParams(location.search).get("signedInUser"));
        }
    
        window.onbeforeunload = () => {
            console.log("Subject page. Closing websocket connection with cms backend service");
        }
    }

    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { subjectObj } = this.state;
        
        subjectObj.id = editObj.id;
        subjectObj.subjectCode = editObj.subjectCode;
        subjectObj.subjectType = editObj.subjectType;
        subjectObj.subjectDesc = editObj.subjectDesc;
        subjectObj.status = editObj.status;
        subjectObj.departmentId = editObj.departmentId;
        subjectObj.batchId = editObj.batchId;
        
        this.setState(() => ({
            isModalOpen: bShow,
            subjectObj: subjectObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const {departmentId} = this.state;
        console.log("createRows() - subject list on subject page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const aryLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < aryLength; i++) {
            const obj = objAry[i];
            if(parseInt(obj.departmentId,10) === parseInt(departmentId,10)){
                retVal.push(
                    <tr >
                      <td>{obj.id}</td>
                      <td>{obj.subjectCode}</td>
                      <td>{obj.subjectType}</td>
                      <td>{obj.subjectDesc}</td>
                      <td>{obj.cmsDepartmentVo.name}</td>
                      <td>{obj.cmsBatchVo.batch}</td>
                      <td>{(obj.cmsSectionVo !== null && obj.cmsSectionVo !== undefined) ? obj.cmsSectionVo.section : ""}</td>
                      <td>{(obj.cmsTeacherVo !== null && obj.cmsTeacherVo !== undefined) ? obj.cmsTeacherVo.teacherName : ""}</td>
                      <td>{obj.status}</td>
                      <td>
                          {
                              <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Subject")}>Edit</button>
                          }
                      </td>
                    </tr>
                  );
            }
            
        }
        return retVal;
    }

    showModal(e: any, bShow: boolean, headerLabel: any) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow,
            subjectObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { subjectObj } = this.state;
        
        this.setState({
            subjectObj: {
                ...subjectObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

    validateFields(obj: any){
        const {branchId, departmentId, modelHeader} = this.state;
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
        if(obj.subjectCode === undefined || obj.subjectCode === null || obj.subjectCode === ""){
            commonFunctions.changeTextBoxBorderToError((obj.subjectCode === undefined || obj.subjectCode === null) ? "" : obj.subjectCode, "subjectCode");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.subjectType === undefined || obj.subjectType === null || obj.subjectType === ""){
            commonFunctions.changeTextBoxBorderToError((obj.subjectType === undefined || obj.subjectType === null) ? "" : obj.subjectType, "subjectType");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.subjectDesc === undefined || obj.subjectDesc === null || obj.subjectDesc === ""){
            commonFunctions.changeTextBoxBorderToError((obj.subjectDesc === undefined || obj.subjectDesc === null) ? "" : obj.subjectDesc, "subjectDesc");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.batchId === undefined || obj.batchId === null || obj.batchId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.batchId === undefined || obj.batchId === null) ? "" : obj.batchId, "batchId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.status === undefined || obj.status === null || obj.status === ""){
            commonFunctions.changeTextBoxBorderToError((obj.status === undefined || obj.status === null) ? "" : obj.status, "status");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }        
        if(modelHeader === "Edit Subject"){
            if((obj.teacherId === undefined || obj.teacherId === null || obj.teacherId === "")
                && (obj.sectionId !== null) ){
                commonFunctions.changeTextBoxBorderToError((obj.teacherId === undefined || obj.teacherId === null) ? "" : obj.teacherId, "teacherId");
                errorMessage = "Please select teacher since section is selected for teacher assignment";
                isValid = false;
            }
            if((obj.sectionId === undefined || obj.sectionId === null || obj.sectionId === "")
                && (obj.teacherId !== null) ){
                commonFunctions.changeTextBoxBorderToError((obj.sectionId === undefined || obj.sectionId === null) ? "" : obj.sectionId, "sectionId");
                errorMessage = "Please select section since teacher is selected for teacher assignment" ;
                isValid = false;
            }
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    getInput(obj: any, modelHeader: any){
        const {departmentId} = this.state;
        let id = null;
        let teacherId = null;
        let sectionId = null;
        if(modelHeader === "Edit Subject"){
            id = obj.id;
            teacherId = obj.teacherId;
            sectionId = obj.sectionId;
        }
        let input = {
            id: id,
            subjectCode: obj.subjectCode,
            subjectType: obj.subjectType,
            subjectDesc: obj.subjectDesc,
            status: obj.status,
            departmentId: departmentId,
            batchId: obj.batchId,
            teacherId: teacherId,
            sectionId: sectionId,
        };
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_SUBJECT,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveSubject Mutation. Exit code : ",resp.data.saveSubject.cmsSubjectVo.exitCode);
            exitCode = resp.data.saveSubject.cmsSubjectVo.exitCode;
            let temp = resp.data.saveSubject.cmsSubjectVo.dataList; 
            console.log("New subject list : ", temp);
            this.setState({
                subjectList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveSubject : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_SUBJECT_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_SUBJECT_UPDATED;
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
        const {subjectObj, modelHeader} = this.state;
        let isValid = this.validateFields(subjectObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getInput(subjectObj, modelHeader);
        this.doSave(inputObj, id);
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

    createSubjectSelectbox(data: any, value: any, key: any, label: any){
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

    createTeacherSelectbox(data: any, value: any, key: any, label: any){
        const{branchId, departmentId} = this.state;
        let retData = [];
        if(data.length > 0){
            for(let i=0; i<data.length;i++){
                let item = data[i];
                if(departmentId !== null && departmentId !== undefined){
                    if(parseInt(item.cmsBranchVo.id,10) === parseInt(branchId,10) && parseInt(departmentId, 10) === parseInt(item.cmsDepartmentVo.id, 10)){
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

    render() {
        const {subjectList, teacherList, batchList, sectionList, isModalOpen, subjectObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            <main>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                    <ModalHeader>{modelHeader}</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
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
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Subject Code <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={subjectObj.subjectCode} placeholder="Subject Code" name="subjectCode" id="subjectCode" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Subject Type <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={subjectObj.subjectType} placeholder="Subject Type" name="subjectType" id="subjectType" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Subject Description</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={subjectObj.subjectDesc} placeholder="Subject Description" name="subjectDesc" id="subjectDesc" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={subjectObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Year<span style={{ color: 'red' }}> * </span></label>
                                        <select name="batchId" id="batchId" onChange={this.onChange} value={subjectObj.batchId} className="gf-form-input">
                                            <option value="">Select Year</option>
                                            {
                                                this.createBatchSelectbox(batchList, "id", "id", "batch")
                                            }
                                        </select>
                                    </div>
                                    {
                                        modelHeader === "Edit Subject" ? 
                                        <div className="fwidth-modal-text">
                                            <label className="gf-form-label b-0 bg-transparent">Teacher</label>
                                            <select name="teacherId" id="teacherId" onChange={this.onChange} value={subjectObj.teacherId} className="gf-form-input">
                                                    <option value="">Select Teacher</option>
                                                    {
                                                        this.createTeacherSelectbox(teacherList, "id", "id", "teacherName")
                                                    }
                                                </select>
                                        </div>
                                        : <div className="fwidth-modal-text">&nbsp;</div>
                                    } 
                                </div>
                                
                                {
                                    modelHeader === "Edit Subject" ?
                                        <div className="mdflex modal-fwidth">
                                            <div className="fwidth-modal-text m-r-1">
                                            <label className="gf-form-label b-0 bg-transparent">Section</label>
                                            <select name="sectionId" id="sectionId" onChange={this.onChange} value={subjectObj.sectionId} className="gf-form-input">
                                                <option value="">Select Section</option>
                                                {
                                                    this.createSectionSelectbox(sectionList, "id", "id", "section", subjectObj.batchId)
                                                }
                                            </select>
                                            </div>
                                            <div className="fwidth-modal-text m-r-1">&nbsp;</div>
                                        </div>
                                            
                                        : null
                                        
                                }
                                
                                 
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Subject" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.save} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.save}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>

                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Subject")}>
                    <i className="fa fa-plus-circle"></i> Add New Subject
                </button>
                    
                {
                    subjectList !== null && subjectList !== undefined && subjectList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Subject Code</th>
                                        <th>Subject Type</th>
                                        <th>Description</th>
                                        <th>Department</th>
                                        <th>Year</th>
                                        <th>Section</th>
                                        <th>Teacher</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(subjectList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Subject);