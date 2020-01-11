import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_DEPARTMENT } from '../../_queries';


export interface DepartmentProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    branchList?: any;  
    ayList?: any;
    departmentList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, department could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_DEPARTMENT_ADDED = "New department saved successfully";
const SUCCESS_MESSAGE_DEPARTMENT_UPDATED = "Department updated successfully";

class Department<T = {[data: string]: any}> extends React.Component<DepartmentProps, any> {
    constructor(props: DepartmentProps) {
        super(props);
        this.state = {
            branchList: this.props.branchList,
            ayList: this.props.ayList,
            departmentList: this.props.departmentList,
            isModalOpen: false,
            departmentObj: {
                branchId: "",
                academicYearId:"",
                name: "",
                description: "",
                deptHead: "",
                comments: "",
                status: "",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { departmentObj } = this.state;
        
        departmentObj.id = editObj.id;
        departmentObj.academicYearId = editObj.academicYearId;
        departmentObj.branchId = editObj.branchId;
        departmentObj.name = editObj.name;
        departmentObj.deptHead = editObj.deptHead;
        departmentObj.comments = editObj.comments;
        departmentObj.status = editObj.status;
        
        this.setState(() => ({
            isModalOpen: bShow,
            holidayObj: departmentObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - department list on department page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const aryLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < aryLength; i++) {
            const obj = objAry[i];
            retVal.push(
              <tr >
                <td>{obj.id}</td>
                <td>{obj.name}</td>
                <td>{obj.deptHead}</td>
                <td>{obj.comments}</td>
                <td>{obj.cmsAcademicYearVo.description}</td>
                <td>{obj.cmsBranchVo.branchName}</td>
                <td>{obj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Department")}>Edit</button>
                    }
                </td>
              </tr>
            );
        }
        return retVal;
    }

    showModal(e: any, bShow: boolean, headerLabel: any) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow,
            departmentObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { departmentObj } = this.state;
        
        this.setState({
            departmentObj: {
                ...departmentObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

    
    validateFields(obj: any){
        let isValid = true;
        let errorMessage = ""
        if(obj.branchId === undefined || obj.branchId === null || obj.branchId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.branchId === undefined || obj.branchId === null) ? "" : obj.branchId, "branchId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.academicYearId === undefined || obj.academicYearId === null || obj.academicYearId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.academicYearId === undefined || obj.academicYearId === null) ? "" : obj.academicYearId, "academicYearId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.name === undefined || obj.name === null || obj.name === ""){
            commonFunctions.changeTextBoxBorderToError((obj.name === undefined || obj.name === null) ? "" : obj.name, "name");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.deptHead === undefined || obj.deptHead === null || obj.deptHead === ""){
            commonFunctions.changeTextBoxBorderToError((obj.deptHead === undefined || obj.deptHead === null) ? "" : obj.deptHead, "deptHead");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.status === undefined || obj.status === null || obj.status === ""){
            commonFunctions.changeTextBoxBorderToError((obj.status === undefined || obj.status === null) ? "" : obj.status, "status");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }        

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    getInput(departmentObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Department"){
            id = departmentObj.id;
        }
        let input = {
            id: id,
            name: departmentObj.name,
            deptHead: departmentObj.deptHead,
            comments: departmentObj.comments,
            status: departmentObj.status,
            academicYearId: departmentObj.academicYearId,
            branchId: departmentObj.branchId
        };
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_DEPARTMENT,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveDepartment Mutation. Exit code : ",resp.data.saveDepartment.cmsDepartmentVo.exitCode);
            exitCode = resp.data.saveDepartment.cmsDepartmentVo.exitCode;
            let temp = resp.data.saveDepartment.cmsDepartmentVo.dataList; 
            console.log("New department list : ", temp);
            this.setState({
                departmentList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveDepartment : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_DEPARTMENT_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_DEPARTMENT_UPDATED;
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
        const {departmentObj, modelHeader} = this.state;
        let isValid = this.validateFields(departmentObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getInput(departmentObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {departmentList, ayList, branchList, isModalOpen, departmentObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                        <label className="gf-form-label b-0 bg-transparent">Branch<span style={{ color: 'red' }}> * </span></label>
                                        <select name="branchId" id="branchId" onChange={this.onChange} value={departmentObj.branchId} className="gf-form-input">
                                        <option value="">Select Branch</option>
                                        {
                                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                                        }
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Academic Year<span style={{ color: 'red' }}> * </span></label>
                                        <select name="academicYearId" id="academicYearId" onChange={this.onChange} value={departmentObj.academicYearId} className="gf-form-input">
                                        <option value="">Select Academic Year</option>
                                        {
                                            commonFunctions.createSelectbox(ayList, "id", "id", "description")
                                        }
                                        </select>
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Department Name <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={departmentObj.name} placeholder="Department" name="name" id="name" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Department Head <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={departmentObj.deptHead} placeholder="Department Head" name="deptHead" id="deptHead" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Comments</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={departmentObj.comments} placeholder="Comments" name="comments" id="comments" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={departmentObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Department" ?
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
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Department")}>
                    <i className="fa fa-plus-circle"></i> Add New Department
                </button>
                {
                    departmentList !== null && departmentList !== undefined && departmentList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Department Name</th>
                                        <th>Department Head</th>
                                        <th>Comments</th>
                                        <th>Academic Year</th>
                                        <th>Branch</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(departmentList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Department);