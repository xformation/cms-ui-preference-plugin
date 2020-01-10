import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_HOLIDAY } from '../../_queries';
import * as moment from 'moment';

export interface HolidayProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    holidayList?: any;  
    ayList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, holiday could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_HOLIDAY_ADDED = "New holiday saved successfully";
const SUCCESS_MESSAGE_HOLIDAY_UPDATED = "Holiday updated successfully";

class Holiday<T = {[data: string]: any}> extends React.Component<HolidayProps, any> {
    constructor(props: HolidayProps) {
        super(props);
        this.state = {
            holidayList: this.props.holidayList,
            ayList: this.props.ayList,
            isModalOpen: false,
            holidayObj: {
                description: "",
                holidayDate: "",
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
        const { holidayObj } = this.state;
        holidayObj.id = editObj.id;
        holidayObj.holidayDate = moment(editObj.strHolidayDate,"DD-MM-YYYY").format("YYYY-MM-DD");
        holidayObj.description = editObj.description;
        holidayObj.comments = editObj.comments;
        holidayObj.status = editObj.status;
        this.setState(() => ({
            isModalOpen: bShow,
            holidayObj: holidayObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - holiday list on holiday page:  ", objAry);
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
                <td>{obj.strHolidayDate}</td>
                <td>{obj.comments}</td>
                <td>{obj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Holiday")}>Edit</button>
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
        const { holidayObj } = this.state;
        
        this.setState({
            holidayObj: {
                ...holidayObj,
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
        if(obj.holidayDate === undefined || obj.holidayDate === null || obj.holidayDate === ""){
            commonFunctions.changeTextBoxBorderToError((obj.holidayDate === undefined || obj.holidayDate === null) ? "" : obj.holidayDate, "holidayDate");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.status === undefined || obj.status === null || obj.status === ""){
            commonFunctions.changeTextBoxBorderToError((obj.status === undefined || obj.status === null) ? "" : obj.status, "status");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }

        // if(isValid){
        //     isValid = this.validateDates(obj.startDate, obj.endDate);
        //     if(isValid === false){
        //         errorMessage = ERROR_MESSAGE_DATES_OVERLAP;
        //     }
        //  }
        

        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    // validateDates(startDate: any, endDate: any){
    //     let stDate = moment(startDate, "YYYY-MM-DD");
    //     let enDate = moment(endDate, "YYYY-MM-DD");
    //     if (enDate.isSameOrBefore(stDate) || stDate.isSameOrAfter(enDate)) {
    //         return false;
    //     }
    //     return true;
    // }
    getHolidayInput(holidayObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Holiday"){
            id = holidayObj.id;
        }
        let ayInput = {
            id: id,
            description: holidayObj.description,
            strHolidayDate: moment(holidayObj.holidayDate).format("DD-MM-YYYY"),
            comments: holidayObj.comments,
            status: holidayObj.status,
            academicYearId: holidayObj.academicYearId
        };
        return ayInput;
    }
    
    async doSave(holidayInput: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_HOLIDAY,
            variables: { 
                input: holidayInput
            },
        }).then((resp: any) => {
            console.log("Success in saveHoliday Mutation. Exit code : ",resp.data.saveHoliday.cmsHolidayVo.exitCode);
            exitCode = resp.data.saveHoliday.cmsHolidayVo.exitCode;
            let temp = resp.data.saveHoliday.cmsHolidayVo.dataList; 
            console.log("New holiday list : ", temp);
            this.setState({
                holidayList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveHoliday : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_HOLIDAY_ADDED;
            if(holidayInput.id !== null){
                successMessage = SUCCESS_MESSAGE_HOLIDAY_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
    }

    saveHoliday = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {holidayObj, modelHeader} = this.state;
        let isValid = this.validateFields(holidayObj);
        if(isValid === false){
            return;
        }
        const holidayInput = this.getHolidayInput(holidayObj, modelHeader);
        this.doSave(holidayInput, id);
    }

    render() {
        const {holidayList, ayList, isModalOpen, holidayObj, modelHeader, errorMessage, successMessage} = this.state;
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
                                        <select name="academicYearId" id="academicYearId" onChange={this.onChange} value={holidayObj.academicYearId} className="gf-form-input">
                                        <option value="">Select Holiday</option>
                                        {
                                            commonFunctions.createSelectbox(ayList, "id", "id", "description")
                                        }
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Description <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={holidayObj.description} placeholder="Description" name="description" id="description" maxLength={255} />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Holiday Date <span style={{ color: 'red' }}> * </span></label>
                                        <input type="date" className="gf-form-input" onChange={this.onChange}  value={holidayObj.holidayDate} placeholder="Holiday date" name="holidayDate" id="holidayDate" maxLength={10}  />
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Comments</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={holidayObj.comments} placeholder="Comments" name="comments" id="comments" maxLength={255}/>
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={holidayObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                    <div className="fwidth-modal-text">&nbsp;</div>
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Holiday" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.saveHoliday} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.saveHoliday}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Holiday")}>
                    <i className="fa fa-plus-circle"></i> Add New Holiday
                </button>
                {
                    holidayList !== null && holidayList !== undefined && holidayList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Description</th>
                                        <th>Holiday Date</th>
                                        <th>Comments</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(holidayList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Holiday);