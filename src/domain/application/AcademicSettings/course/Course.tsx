import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { SAVE_COURSE } from '../../_queries';


export interface CourseProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    courseList?: any;
    branchList?: any;  
    departmentList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, course could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_COURSE_ADDED = "New course saved successfully";
const SUCCESS_MESSAGE_COURSE_UPDATED = "Course updated successfully";

class Course<T = {[data: string]: any}> extends React.Component<CourseProps, any> {
    constructor(props: CourseProps) {
        super(props);
        this.state = {
            courseList: this.props.courseList,
            branchList: this.props.branchList,
            departmentList: this.props.departmentList,
            isModalOpen: false,
            courseObj: {
                branchId: "",
                departmentId:"",
                name: "",
                description: "",
                courseDuration: "", 
                courseType: "",
                yearOrSemesterType: "",
                totalFee: "",
                yearlyFee: "",
                perSemesterFee: "",
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
        const { courseObj } = this.state;
        
        courseObj.id = editObj.id;
        courseObj.departmentId = editObj.departmentId;
        courseObj.branchId = editObj.branchId;
        courseObj.name = editObj.name;
        courseObj.description = editObj.description;
        courseObj.courseDuration = editObj.courseDuration;
        courseObj.courseType = editObj.courseType;
        courseObj.yearOrSemesterType = editObj.yearOrSemesterType;
        courseObj.totalFee = editObj.totalFee;
        courseObj.yearlyFee = editObj.yearlyFee;
        courseObj.perSemesterFee = editObj.perSemesterFee;
        courseObj.comments = editObj.comments;
        courseObj.status = editObj.status;
        
        this.setState(() => ({
            isModalOpen: bShow,
            holidayObj: courseObj,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - course list on course page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const aryLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < aryLength; i++) {
            const obj = objAry[i];
            retVal.push(
              <tr >
                <td>{obj.name}</td>
                <td>{obj.description}</td>
                <td>{obj.courseDuration}</td>
                <td>{obj.courseType}</td>
                <td>{obj.yearOrSemesterType}</td>
                <td>{obj.totalFee}</td>
                <td>{obj.cmsDepartmentVo.name}</td>
                <td>{obj.cmsBranchVo.branchName}</td>
                <td>{obj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, obj, "Edit Course")}>Edit</button>
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
            courseObj: {},
            modelHeader: headerLabel,
            errorMessage: "",
            successMessage: "",
        }));
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { courseObj } = this.state;
        
        this.setState({
            courseObj: {
                ...courseObj,
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
        if(obj.departmentId === undefined || obj.departmentId === null || obj.departmentId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.departmentId === undefined || obj.departmentId === null) ? "" : obj.departmentId, "departmentId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.name === undefined || obj.name === null || obj.name === ""){
            commonFunctions.changeTextBoxBorderToError((obj.name === undefined || obj.name === null) ? "" : obj.name, "name");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.description === undefined || obj.description === null || obj.description === ""){
            commonFunctions.changeTextBoxBorderToError((obj.description === undefined || obj.description === null) ? "" : obj.description, "description");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.courseDuration === undefined || obj.courseDuration === null || obj.courseDuration === ""){
            commonFunctions.changeTextBoxBorderToError((obj.courseDuration === undefined || obj.courseDuration === null) ? "" : obj.courseDuration, "courseDuration");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.courseType === undefined || obj.courseType === null || obj.courseType === ""){
            commonFunctions.changeTextBoxBorderToError((obj.courseType === undefined || obj.courseType === null) ? "" : obj.courseType, "courseType");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(obj.yearOrSemesterType === undefined || obj.yearOrSemesterType === null || obj.yearOrSemesterType === ""){
            commonFunctions.changeTextBoxBorderToError((obj.yearOrSemesterType === undefined || obj.yearOrSemesterType === null) ? "" : obj.yearOrSemesterType, "yearOrSemesterType");
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

    getInput(courseObj: any, modelHeader: any){
        let id = null;
        if(modelHeader === "Edit Course"){
            id = courseObj.id;
        }
        let input = {
            id: id,
            branchId: courseObj.branchId,
            departmentId: courseObj.departmentId,
            name: courseObj.name,
            description: courseObj.description,
            courseDuration: courseObj.courseDuration, 
            courseType: courseObj.courseType,
            yearOrSemesterType: courseObj.yearOrSemesterType,
            totalFee: courseObj.totalFee,
            yearlyFee: courseObj.yearlyFee,
            perSemesterFee: courseObj.perSemesterFee,
            comments: courseObj.comments,
            status: courseObj.status,
        };
        return input;
    }
    
    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_COURSE,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveCourse Mutation. Exit code : ",resp.data.saveCourse.cmsCourseVo.exitCode);
            exitCode = resp.data.saveCourse.cmsCourseVo.exitCode;
            let temp = resp.data.saveCourse.cmsCourseVo.dataList; 
            console.log("New course list : ", temp);
            this.setState({
                courseList: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveCourse : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_COURSE_ADDED;
            if(inp.id !== null){
                successMessage = SUCCESS_MESSAGE_COURSE_UPDATED;
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
        const {courseObj, modelHeader} = this.state;
        let isValid = this.validateFields(courseObj);
        if(isValid === false){
            return;
        }
        const inputObj = this.getInput(courseObj, modelHeader);
        this.doSave(inputObj, id);
    }

    render() {
        const {courseList, departmentList, branchList, isModalOpen, courseObj, modelHeader, errorMessage, successMessage} = this.state;
        return (
            <main>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container" style={{height:"500px", overflow:"auto"}}>
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
                                        <select name="branchId" id="branchId" onChange={this.onChange} value={courseObj.branchId} className="gf-form-input">
                                        <option value="">Select Branch</option>
                                        {
                                            commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
                                        }
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Department<span style={{ color: 'red' }}> * </span></label>
                                        <select name="departmentId" id="departmentId" onChange={this.onChange} value={courseObj.departmentId} className="gf-form-input">
                                        <option value="">Select Department</option>
                                        {
                                            commonFunctions.createSelectbox(departmentList, "id", "id", "name")
                                        }
                                        </select>
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Name <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={courseObj.name} placeholder="Course Name" name="name" id="name" maxLength={255} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Description<span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={courseObj.description} placeholder="Course Description" name="description" id="description" maxLength={255} />
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Course Duration <span style={{ color: 'red' }}> * </span></label>
                                        <select name="courseDuration" id="courseDuration" onChange={this.onChange} value={courseObj.courseDuration} className="gf-form-input">
                                            <option key={""} value={""}>Select Course Duration</option>
                                            <option key={"SIX MONTH"} value={"SIX MONTH"}>SIX MONTH</option>
                                            <option key={"ONE YEAR"} value={"ONE YEAR"}>ONE YEAR</option>
                                            <option key={"TWO YEAR"} value={"TWO YEAR"}>TWO YEAR</option>
                                            <option key={"THREE YEAR"} value={"THREE YEAR"}>THREE YEAR</option>
                                            <option key={"FOUR YEAR"} value={"FOUR YEAR"}>FOUR YEAR</option>
                                            <option key={"FIVE YEAR"} value={"FIVE YEAR"}>FIVE YEAR</option>
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Course Type<span style={{ color: 'red' }}> * </span></label>
                                        <select name="courseType" id="courseType" onChange={this.onChange} value={courseObj.courseType} className="gf-form-input">
                                            <option key={""} value={""}>Select Course Type</option>
                                            <option key={"DEGREE"} value={"DEGREE"}>DEGREE</option>
                                            <option key={"DIPLOMA"} value={"DIPLOMA"}>DIPLOMA</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Yearly/Semester Course <span style={{ color: 'red' }}> * </span></label>
                                        <select name="yearOrSemesterType" id="yearOrSemesterType" onChange={this.onChange} value={courseObj.yearOrSemesterType} className="gf-form-input">
                                            <option key={""} value={""}>Select Yearly/Semester Course</option>
                                            <option key={"YEARLY"} value={"YEARLY"}>YEARLY COURSE</option>
                                            <option key={"SEMESTER"} value={"SEMESTER"}>SEMESTER COURSE</option>
                                        </select>
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Total Course Fee</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={courseObj.totalFee} placeholder="Total Course Fee" name="totalFee" id="totalFee" maxLength={10} />
                                    </div>
                                </div>
                                
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Yearly Course Fee</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={courseObj.yearlyFee} placeholder="Yearly Course Fee" name="yearlyFee" id="yearlyFee" maxLength={10} />
                                    </div> 

                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Per Semester Course Fee</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={courseObj.perSemesterFee} placeholder="Per Semester Course Fee" name="perSemesterFee" id="perSemesterFee" maxLength={255} />
                                    </div>
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1 ">
                                        <label className="gf-form-label b-0 bg-transparent">Comments</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={courseObj.comments} placeholder="Comments" name="comments" id="comments" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={courseObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Course" ?
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
                <button className="btn btn-primary" style={{width:'200px'}} onClick={e => this.showModal(e, true, "Add New Course")}>
                    <i className="fa fa-plus-circle"></i> Add New Course
                </button>
                {
                    courseList !== null && courseList !== undefined && courseList.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="ayTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>name</th>
                                        <th>description</th>
                                        <th>Course Duration</th>
                                        <th>Course Type</th>
                                        <th>Year/Semester Course</th>
                                        <th>Total Fee</th>
                                        <th>Department</th>
                                        <th>Branch</th>
                                        <th>Status</th>
                                        <th>Edit</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(courseList) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(Course);