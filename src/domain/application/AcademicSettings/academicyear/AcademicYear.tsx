import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_ACADEMIC_YEAR } from '../../_queries';
import * as moment from 'moment';

export interface AcademicYearProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    ayList?: any;
    
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, branch could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_ACADEMIC_YEAR_ADDED = "New academic year saved successfully";
const SUCCESS_MESSAGE_ACADEMIC_YEAR_UPDATED = "Academic year updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";

class AcademicYear<T = {[data: string]: any}> extends React.Component<AcademicYearProps, any> {
    constructor(props: AcademicYearProps) {
        super(props);
        this.state = {
            ayList: this.props.ayList,
            isModalOpen: false,
            ayObj: {
                description: "",
                startDate: "",
                endDate: "",
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
        const { ayObj } = this.state;
        ayObj.id = editObj.id;
        ayObj.startDate = moment(editObj.strStartDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        ayObj.endDate = moment(editObj.strEndDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        ayObj.description = editObj.description;
        ayObj.comments = editObj.comments;
        ayObj.status = editObj.status;
        this.setState(() => ({
            isModalOpen: bShow,
            ayObj: ayObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - AcademicYear list on AcademicYear page:  ", objAry);
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
                <td>{obj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Academic Year")}>Edit</button>
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
            ayObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { ayObj } = this.state;
        
        this.setState({
            ayObj: {
                ...ayObj,
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
        if(obj.comments === undefined || obj.comments === null || obj.comments === ""){
            commonFunctions.changeTextBoxBorderToError((obj.comments === undefined || obj.comments === null) ? "" : obj.comments , "comments");
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
    getAcademicYearInput(ayObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Academic Year"){
            id = ayObj.id;
        }
        let ayInput = {
            id: id,
            description: ayObj.description,
            strStartDate: moment(ayObj.startDate).format("DD-MM-YYYY"),
            strEndDate: moment(ayObj.endDate).format("DD-MM-YYYY"),
            comments: ayObj.comments,
            status: ayObj.status
        };
        return ayInput;
    }
    
    async doSave(ayInput: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_ACADEMIC_YEAR,
            variables: { 
                input: ayInput
            },
        }).then((resp: any) => {
            console.log("Success in saveAcademicYear Mutation. Exit code : ",resp.data.saveAcademicYear.cmsAcademicYearVo.exitCode);
            exitCode = resp.data.saveAcademicYear.cmsAcademicYearVo.exitCode;
            let temp = resp.data.saveAcademicYear.cmsAcademicYearVo.dataList; 
            console.log("New academic year list : ", temp);
            this.setState({
                ayList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveAcademicYear : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_ACADEMIC_YEAR_ADDED;
            if(ayInput.id !== null){
                successMessage = SUCCESS_MESSAGE_ACADEMIC_YEAR_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    saveAcademicYear = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {ayObj, modelHeader} = this.state;
        let isValid = this.validateFields(ayObj);
        if(isValid === false){
            return;
        }
        const ayInput = this.getAcademicYearInput(ayObj, modelHeader);
        this.doSave(ayInput, id);
    }

    render() {
        const {ayList, isModalOpen, ayObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                <div className="fwidth-modal-text modal-fwidth">
                                    <label className="gf-form-label b-0 bg-transparent">Description <span style={{ color: 'red' }}> * </span></label>
                                    <input type="text" className="gf-form-input " onChange={this.onChange}  value={ayObj.description} placeholder="Description" name="description" id="description" maxLength={255} />
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Start Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={ayObj.startDate} placeholder="Start date" name="startDate" id="startDate" maxLength={10}  />
                                    </div>
                                {/* </div>
                                <div className="mdflex modal-fwidth"> */}
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">End Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={ayObj.endDate} placeholder="End date" name="endDate" id="endDate" maxLength={10}  />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Comments<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={ayObj.comments} placeholder="Comments" name="comments" id="comments" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={ayObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Academic Year" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.saveAcademicYear} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.saveAcademicYear}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Academic Year")}>
                    <i className="fa fa-plus-circle"></i> Add New Academic Year
                </button>
                {
                    ayList !== null && ayList !== undefined && ayList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Description</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Comments</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(ayList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(AcademicYear);