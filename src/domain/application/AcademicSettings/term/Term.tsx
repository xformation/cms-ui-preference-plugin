import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_TERM } from '../../_queries';
import * as moment from 'moment';

export interface TermProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    termList?: any;  
    ayList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, term could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_TERM_ADDED = "New term saved successfully";
const SUCCESS_MESSAGE_TERM_UPDATED = "Term updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";

class Term<T = {[data: string]: any}> extends React.Component<TermProps, any> {
    constructor(props: TermProps) {
        super(props);
        this.state = {
            termList: this.props.termList,
            ayList: this.props.ayList,
            isModalOpen: false,
            termObj: {
                description: "",
                startDate: "",
                endDate: "",
                comments: "",
                status: "",
                academicYearId:""
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { termObj } = this.state;
        termObj.id = editObj.id;
        termObj.startDate = moment(editObj.strStartDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        termObj.endDate = moment(editObj.strEndDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        termObj.description = editObj.description;
        termObj.comments = editObj.comments;
        termObj.status = editObj.status;
        termObj.academicYearId = editObj.academicYearId;
        this.setState(() => ({
            isModalOpen: bShow,
            termObj: termObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - term list on term page:  ", objAry);
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
                <td>{obj.description}</td>
                <td>{obj.strStartDate}</td>
                <td>{obj.strEndDate}</td>
                <td>{obj.comments}</td>
                <td>{obj.cmsAcademicYearVo.description}</td>
                <td>{obj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Term")}>Edit</button>
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
            termObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { termObj } = this.state;
        
        this.setState({
            termObj: {
                ...termObj,
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
        if(obj.academicYearId === undefined || obj.academicYearId === null || obj.academicYearId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.academicYearId === undefined || obj.academicYearId === null) ? "" : obj.academicYearId, "academicYearId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.description === undefined || obj.description === null || obj.description === ""){
            commonFunctions.changeTextBoxBorderToError((obj.description === undefined || obj.description === null) ? "" : obj.description, "description");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.startDate === undefined || obj.startDate === null || obj.startDate === ""){
            commonFunctions.changeTextBoxBorderToError((obj.startDate === undefined || obj.startDate === null) ? "" : obj.startDate, "startDate");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.endDate === undefined || obj.endDate === null || obj.endDate === ""){
            commonFunctions.changeTextBoxBorderToError((obj.endDate === undefined || obj.endDate === null) ? "" : obj.endDate, "endDate");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.status === undefined || obj.status === null || obj.status === ""){
            commonFunctions.changeTextBoxBorderToError((obj.status === undefined || obj.status === null) ? "" : obj.status, "status");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }

        if(isValid){
            isValid = this.validateDates(obj.startDate, obj.endDate);
            if(isValid === false){
                errorMessage = ERROR_MESSAGE_DATES_OVERLAP;
            }
         }
        

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    validateDates(startDate: any, endDate: any){
        let stDate = moment(startDate, "YYYY-MM-DD");
        let enDate = moment(endDate, "YYYY-MM-DD");
        if (enDate.isSameOrBefore(stDate) || stDate.isSameOrAfter(enDate)) {
            return false;
        }
        return true;
    }
    getTermInput(termObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Term"){
            id = termObj.id;
        }
        let input = {
            id: id,
            description: termObj.description,
            strStartDate: moment(termObj.startDate).format("DD-MM-YYYY"),
            strEndDate: moment(termObj.endDate).format("DD-MM-YYYY"),
            comments: termObj.comments,
            status: termObj.status,
            academicYearId: termObj.academicYearId
        };
        return input;
    }
    
    async doSave(termInput: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_TERM,
            variables: { 
                input: termInput
            },
        }).then((resp: any) => {
            console.log("Success in saveTerm Mutation. Exit code : ",resp.data.saveTerm.cmsTermVo.exitCode);
            exitCode = resp.data.saveTerm.cmsTermVo.exitCode;
            let temp = resp.data.saveTerm.cmsTermVo.dataList; 
            console.log("New term list : ", temp);
            this.setState({
                termList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveTerm : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_TERM_ADDED;
            if(termInput.id !== null){
                successMessage = SUCCESS_MESSAGE_TERM_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    saveTerm = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {termObj, modelHeader} = this.state;
        let isValid = this.validateFields(termObj);
        if(isValid === false){
            return;
        }
        const termInput = this.getTermInput(termObj, modelHeader);
        this.doSave(termInput, id);
    }

    render() {
        const {termList, ayList, isModalOpen, termObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                        <label className="gf-form-label b-0 bg-transparent">Academic Year<span style={{ color: 'red' }}> * </span></label>
                                        <select name="academicYearId" id="academicYearId" onChange={this.onChange} value={termObj.academicYearId} className="gf-form-input">
                                        <option value="">Select Academic Year</option>
                                        {
                                            commonFunctions.createSelectbox(ayList, "id", "id", "description")
                                        }
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Description <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={termObj.description} placeholder="Description" name="description" id="description" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Start Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={termObj.startDate} placeholder="Start date" name="startDate" id="startDate" maxLength={10}  />
                                    </div>
                                    <div className="fwidth-modal-text">
                                    <label className="gf-form-label b-0 bg-transparent">End Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={termObj.endDate} placeholder="End date" name="endDate" id="endDate" maxLength={10}  />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={termObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Comments</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={termObj.comments} placeholder="Comments" name="comments" id="comments" maxLength={255}/>
                                    </div>
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Term" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.saveTerm} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.saveTerm}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Term")}>
                    <i className="fa fa-plus-circle"></i> Add New Term
                </button>
                {
                    termList !== null && termList !== undefined && termList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Description</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Comments</th>
                                        <th>Academic Year</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(termList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Term);