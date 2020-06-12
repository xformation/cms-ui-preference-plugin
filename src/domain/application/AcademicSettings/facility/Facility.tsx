import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_FACILITY } from '../../_queries';
import moment = require('moment');


export interface FacilityProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    branchList?: any;  
    ayList?: any;
    facilityList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, facility could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_FACILITY_ADDED = "New facility saved successfully";
const SUCCESS_MESSAGE_FACILITY_UPDATED = "Facility updated successfully";
const ERROR_MESSAGE_DATES_OVERLAP = "End date cannot be prior or same as start date";

class Facility<T = {[data: string]: any}> extends React.Component<FacilityProps, any> {
    constructor(props: FacilityProps) {
        super(props);
        this.state = {
            branchList: this.props.branchList,
            ayList: this.props.ayList,
            facilityList: this.props.facilityList,
            isModalOpen: false,
            facilityObj: {
                branchId: "",
                academicYearId:"",
                name: "",
                amount: "",
                startDate: "",
                endDate: "",
                status: "",
            },
            errorMessage: "",
            successMessage: "",
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean, editObj: any, modelHeader: any) {
        e && e.preventDefault();
        const { facilityObj } = this.state;
        
        facilityObj.id = editObj.id;
        facilityObj.academicYearId = editObj.academicYearId;
        facilityObj.branchId = editObj.branchId;
        facilityObj.name = editObj.name;
        facilityObj.amount = editObj.amount;
        facilityObj.startDate = moment(editObj.strStartDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        facilityObj.endDate = moment(editObj.strEndDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        facilityObj.status = editObj.status;
        
        this.setState(() => ({
            isModalOpen: bShow,
            facilityObj: facilityObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - facility list on facility page:  ", objAry);
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
                <td>{obj.amount}</td>
                <td>{obj.strStartDate}</td>
                <td>{obj.strEndDate}</td>
                <td>{obj.cmsAcademicYearVo.description}</td>
                <td>{obj.cmsBranchVo.branchName}</td>
                <td>{obj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Facility")}>Edit</button>
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
            facilityObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { facilityObj } = this.state;
        
        this.setState({
            facilityObj: {
                ...facilityObj,
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
        if(obj.amount === undefined || obj.amount === null || obj.amount === ""){
            commonFunctions.changeTextBoxBorderToError((obj.amount === undefined || obj.amount === null) ? "" : obj.amount, "amount");
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

    getInput(facilityObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Facility"){
            id = facilityObj.id;
        }
        let input = {
            id: id,
            name: facilityObj.name,
            amount: facilityObj.amount,
            strStartDate: moment(facilityObj.startDate).format("DD-MM-YYYY"),
            strEndDate: moment(facilityObj.endDate).format("DD-MM-YYYY"),
            status: facilityObj.status,
            academicYearId: facilityObj.academicYearId,
            branchId: facilityObj.branchId
        };
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_FACILITY,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveFacility Mutation. Exit code : ",resp.data.saveFacility.cmsFacility.exitCode);
            exitCode = resp.data.saveFacility.cmsFacility.exitCode;
            let temp = resp.data.saveFacility.cmsFacility.dataList; 
            console.log("New facility list : ", temp);
            this.setState({
                facilityList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveFacility : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_FACILITY_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_FACILITY_UPDATED;
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
        const {facilityObj, modelHeader} = this.state;
        let isValid = this.validateFields(facilityObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getInput(facilityObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {facilityList, ayList, branchList, isModalOpen, facilityObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                        <select name="branchId" id="branchId" onChange={this.onChange} value={facilityObj.branchId} className="gf-form-input">
                                        <option value="">Select Branch</option>
                                        {
                                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                                        }
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Academic Year<span style={{ color: 'red' }}> * </span></label>
                                        <select name="academicYearId" id="academicYearId" onChange={this.onChange} value={facilityObj.academicYearId} className="gf-form-input">
                                        <option value="">Select Academic Year</option>
                                        {
                                            commonFunctions.createSelectbox(ayList, "id", "id", "description")
                                        }
                                        </select>
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Facility Name <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={facilityObj.name} placeholder="Facility Name" name="name" id="name" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Amount <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={facilityObj.amount} placeholder="Amount" name="amount" id="amount" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Start Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={facilityObj.startDate} placeholder="Start date" name="startDate" id="startDate" maxLength={10}  />
                                    </div>
                                {/* </div>
                                <div className="mdflex modal-fwidth"> */}
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">End Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={facilityObj.endDate} placeholder="End date" name="endDate" id="endDate" maxLength={10}  />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                   
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={facilityObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                               
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Facility" ?
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
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Facility")}>
                    <i className="fa fa-plus-circle"></i> Add New Facility
                </button>
                {
                    facilityList !== null && facilityList !== undefined && facilityList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Facility Name</th>
                                        <th>Amount</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>Academic Year</th>
                                        <th>Branch</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(facilityList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Facility);