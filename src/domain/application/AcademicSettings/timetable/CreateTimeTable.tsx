import * as React from 'react';
import { commonFunctions } from '../../_utilites/common.functions';
import "../../../../css/custom.css";
import { withApollo } from 'react-apollo';
import wsCmsBackendServiceSingletonClient from '../../../../wsCmsBackendServiceClient';
import * as moment from 'moment';
import { academicSettingsServices } from '../../_services/academicSettings.service';
import {config} from '../../config';

enum Steps {
    CreateLecture,
    EnterSubjects
};

enum Days {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday
}

class TimeTablePage<T = { [data: string]: any }> extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            counter: 0,
            lectureTimings: [],
            user: null,
            termList: this.props.termList,
            batchList: this.props.batchList,
            sectionList: this.props.sectionList,
            subjectList: this.props.subjectList,
            teacherList: this.props.teacherList,
            branchId: null,
            academicYearId: null,
            departmentId: null,
            lecObj: {
                id: null,
                termId: "",
                batchId: "",
                sectionId: "",
            },
            showTimeScheduleAssignment: Steps.CreateLecture,
            errorMessage: "",
            successMessage: "",
            submitted: false,
            subjectWiseTeachers: [],
            isRequestMade: true
        };
        this.handleLecObjChange = this.handleLecObjChange.bind(this);
        this.changeCounter = this.changeCounter.bind(this);
        this.validatePreferenceFields = this.validatePreferenceFields.bind(this);
        this.validateTimings = this.validateTimings.bind(this);
        this.onClickCreateLectures = this.onClickCreateLectures.bind(this);
        this.goBack = this.goBack.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.createSectionSelectbox = this.createSectionSelectbox.bind(this);
        this.createBatchSelectbox = this.createBatchSelectbox.bind(this);
        this.createLectureTimings = this.createLectureTimings.bind(this);
        this.createTimeTableEntries = this.createTimeTableEntries.bind(this);
        this.createSubjectSelectbox = this.createSubjectSelectbox.bind(this);
        this.getLoggedInUser = this.getLoggedInUser.bind(this);
    }

    async componentDidMount() {
        await this.registerSocket();
    }

    async getLoggedInUser(){
        const requestOptions = commonFunctions.getRequestOptions('GET', {});
        await fetch(config.LOGGED_IN_USER_URL, requestOptions).then( 
            response => response.json()
        ).then (data =>{
            this.setState({
                user: data
            })
        })
    }

    async registerSocket() {
        await this.getLoggedInUser();
        console.log("registerSocket ::---->>>>>> ",this.state.user);
        const socket = await wsCmsBackendServiceSingletonClient.getInstance();
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
        }

        socket.onopen = () => {
            console.log("TimeTable page. Opening websocekt connection to cmsbackend. User : ", this.state.user.login);
            socket.send(this.state.user.login);
        }

        window.onbeforeunload = () => {
            console.log("TimeTable page. Closing websocket connection with cms backend service");
        }
    }

    handleLecObjChange(e: any) {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { lecObj } = this.state;
        this.setState({
            lecObj: {
                ...lecObj,
                [name]: value
            }
        });
    }

    changeCounter(opt: any) {
        const { lectureTimings } = this.state;
        let counter = this.state.counter + opt;
        if (counter < 0) {
            counter = 0;
        }
        const length = lectureTimings.length;
        if (counter <= length) {
            lectureTimings.length = counter;
        } else {
            for (let i = length; i < counter; i++) {
                lectureTimings.push({
                    subjects: {},
                    startTime: "",
                    endTime: "",
                    isBreak: false,
                    isSatLecture: false,
                    teachers: {},
                });
            }
        }
        this.setState({
            counter: counter,
            lectureTimings
        });
    }

    validatePreferenceFields() {
        const { branchId, departmentId } = this.state;
        let isValid = true;
        let errorMessage = ""

        if (!branchId) {
            errorMessage = "Please select branch from user preferences";
            isValid = false;
        } else if (!departmentId) {
            errorMessage = "Please select department from user preferences";
            isValid = false;
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid;

    }

    validateTimings(lectureTimings: any) {
        let isValid = true;
        let retData = [];

        for (let i = 0; i < lectureTimings.length; i++) {
            let validationData = {
                startTime: {
                    message: "",
                    valid: true
                },
                endTime: {
                    message: "",
                    valid: true
                }
            };
            const lecture = lectureTimings[i];
            if (!lecture.startTime) {
                validationData.startTime.message = "Please enter start time.";
                validationData.startTime.valid = false;
                isValid = false;
            }
            if (!lecture.endTime) {
                validationData.endTime.message = "Please enter end time.";
                validationData.endTime.valid = false;
                isValid = false;
            }
            if (lecture.startTime && lecture.endTime) {
                const stTime = moment(lecture.startTime, "HH:mm");
                const ndTime = moment(lecture.endTime, "HH:mm");
                if (stTime.isSameOrAfter(ndTime)) {
                    validationData.startTime.message = "Start time should be less than end time.";
                    validationData.startTime.valid = false;
                    isValid = false;
                }
            }
            let nextLecture = lectureTimings[i + 1];
            if (nextLecture) {
                let endTime = moment(lecture.endTime, "HH:mm");
                const nextStartTime = moment(nextLecture.startTime, "HH:mm");
                if (lecture.isBreak) {
                    endTime = endTime.add("30", "minute");
                }
                if (endTime.isSameOrAfter(nextStartTime)) {
                    validationData.endTime.message = "Please enter valid end time.";
                    validationData.endTime.valid = false;
                    isValid = false;
                }
            }
            retData.push(validationData);
        }
        return {
            isValid,
            errorData: retData
        };
    }

    onClickCreateLectures() {
        const { lecObj, lectureTimings, counter, showTimeScheduleAssignment, academicYearId, branchId, departmentId } = this.state;
        if (showTimeScheduleAssignment === Steps.CreateLecture) {
            this.setState({
                submitted: true
            });
            if (!this.validatePreferenceFields()) {
                return;
            }
            let validationData = this.validateTimings(lectureTimings);
            if (validationData.isValid && counter > 0 && lecObj.batchId && lecObj.sectionId && lecObj.termId) {
                this.setState({
                    showTimeScheduleAssignment: Steps.EnterSubjects
                });
            }
        } else if (showTimeScheduleAssignment === Steps.EnterSubjects) {
            const payLoad = [];
            let counter = 0;
            const length = lectureTimings.length;
            for (let i = 0; i < length; i++) {
                const timings = lectureTimings[i];
                const subjects = timings.subjects;
                const teachers = timings.teachers;
                for (const j in subjects) {
                    payLoad[counter] = {
                        weekDay: j,
                        startTime: timings.startTime,
                        endTime: timings.endTime,
                        subjectId: subjects[j],
                        teacherId: teachers[j]
                    };
                    counter++;
                }
            }
            const params = {
                termId: lecObj.termId,
                academicYearId: academicYearId,
                sectionId: lecObj.sectionId,
                batchId: lecObj.batchId,
                branchId: branchId,
                departmentId: departmentId
            };
            academicSettingsServices.saveLectures(payLoad, params).then(
                response => {
                    alert("lecture saved");
                }
            );
        }
    }

    goBack() {
        this.setState({
            showTimeScheduleAssignment: Steps.CreateLecture
        });
    }

    createBatchSelectbox(data: any, value: any, key: any, label: any) {
        const { departmentId } = this.state;
        let retData = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (departmentId) {
                    if (parseInt(departmentId, 10) === parseInt(item.cmsDepartmentVo.id, 10)) {
                        retData.push(
                            <option value={item[value]} key={item[key]}>{item[label]}</option>
                        );
                    }
                }
            }
        }
        return retData;
    }

    createSectionSelectbox(data: any, value: any, key: any, label: any, batchId: any) {
        const { departmentId } = this.state;
        let retData = [];
        if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
                let item = data[i];
                if (departmentId) {
                    if (parseInt(item.batchId, 10) === parseInt(batchId, 10)) {
                        retData.push(
                            <option value={item[value]} key={item[key]}>{item[label]}</option>
                        );
                    }
                }
            }
        }
        return retData;
    }

    createSubjectSelectbox() {
        const { subjectList, lecObj } = this.state;
        const retObj = [];
        for (let i = 0; i < subjectList.length; i++) {
            const subject = subjectList[i];
            if (parseInt(subject.batchId, 10) === parseInt(lecObj.batchId, 10) && parseInt(subject.sectionId, 10) === parseInt(lecObj.sectionId, 10)) {
                retObj.push(
                    <option value={subject.id} key={subject.id}>{subject.subjectCode}</option>
                );
            }
        }
        return retObj;
    }

    handleLecturTimingChange(e: any, index: any, name: any) {
        const { value, checked } = e.target;
        const { lectureTimings } = this.state;
        const lecture = lectureTimings[index];
        if (name === "isSatLecture" || name === "isBreak") {
            lecture[name] = checked;
        } else {
            lecture[name] = value;
        }
        this.setState({
            lectureTimings
        });
    }

    handleSubjectChange(e: any, index: any, day: any) {
        const { value } = e.target;
        const { lectureTimings, subjectWiseTeachers, subjectList } = this.state;
        const lecture = lectureTimings[index];
        if (lecture) {
            lecture.subjects[day] = value;
            lecture.teachers[day] = "";
            const subject = this.findSubjectFromId(value, subjectList);
            subjectWiseTeachers[index] = subjectWiseTeachers[index] || {};
            subjectWiseTeachers[index][day] = subject ? [subject.cmsTeacherVo] : [];
            this.setState({
                subjectWiseTeachers,
                lectureTimings
            });
        }
    }

    handleTeacherChange(e: any, index: any, day: any) {
        const { value } = e.target;
        const { lectureTimings } = this.state;
        const lecture = lectureTimings[index];
        if (lecture) {
            lecture.teachers[day] = value;
            this.setState({
                lectureTimings
            });
        }
    }

    findSubjectFromId(value: any, subjectList: any) {
        const length = subjectList.length;
        let retVal = null;
        for (let i = 0; i < length; i++) {
            if (parseInt(value, 10) === parseInt(subjectList[i].id, 10)) {
                retVal = subjectList[i];
                break;
            }
        }
        return retVal;
    }

    createLectureTimings() {
        const { counter, lectureTimings, submitted } = this.state;
        const retVal = [];
        const validationData = this.validateTimings(lectureTimings);
        const { errorData } = validationData;
        for (let i = 0; i < counter; i++) {
            const timing = lectureTimings[i];
            const error = errorData[i];
            retVal.push(
                <tr>
                    <td>{i + 1}</td>
                    <td>Lecture {i + 1}</td>
                    <td>
                        <input type="time" name={'startTime' + i} id={'startTime' + i} value={timing.startTime} onChange={e => this.handleLecturTimingChange(e, i, "startTime")} className={`${submitted && !error.startTime.valid ? 'input-textbox-error' : ''}`} />
                        {
                            submitted &&
                            <small className="error-text">{error.startTime.message}</small>
                        }
                    </td>
                    <td>
                        <input type="time" name={"endTime" + i} id={"endTime" + i} value={timing.endTime} onChange={e => this.handleLecturTimingChange(e, i, "endTime")} className={`${submitted && !error.endTime.valid ? 'input-textbox-error' : ''}`} />
                        {
                            submitted &&
                            <small className="error-text">{error.endTime.message}</small>
                        }
                    </td>
                    <td>
                        <label className="switch">
                            <input type="checkbox" name={"satLec_" + i} id={"satLec_" + i} checked={timing.isSatLecture} onChange={e => this.handleLecturTimingChange(e, i, "isSatLecture")} />
                            <span className="slider m-0"></span>
                        </label>
                    </td>
                    <td>
                        <label className="switch">
                            <input type="checkbox" name={"brkAfter_" + i} id={"brkAfter_" + i} checked={timing.isBreak} onChange={e => this.handleLecturTimingChange(e, i, "isBreak")} />
                            <span className="slider m-0"></span>
                        </label>
                    </td>
                </tr>
            );
        }
        return retVal;
    }

    createTimeTableEntries() {
        const { counter, lectureTimings, subjectWiseTeachers } = this.state;
        const retVal = [];
        for (let i = 0; i < counter; i++) {
            const lecture = lectureTimings[i];
            subjectWiseTeachers[i] = subjectWiseTeachers[i] || {};
            retVal.push(
                <tr>
                    <td>
                        <div className="ttlect">
                            <span>Lecture {i + 1}</span>
                            <br />
                            <span>
                                {lecture.startTime}<br />
                                {lecture.endTime}
                            </span>
                        </div>
                    </td>
                    <td>
                        <div className="ttdgrid">
                            <div className="ttd">
                                <span>Subject</span>
                            </div>
                            <div>
                                <select className="gf-form-input" value={lecture.subjects[Days.Monday]} onChange={e => this.handleSubjectChange(e, i, Days.Monday)}>
                                    <option value="">Select Subject</option>
                                    {this.createSubjectSelectbox()}
                                </select>
                            </div>
                            <div>
                                <span className="ttd">Teacher</span>
                                <select className="gf-form-input" value={lecture.teachers[Days.Monday]} onChange={e => this.handleTeacherChange(e, i, Days.Monday)}>
                                    <option value="">Select Teacher</option>
                                    {commonFunctions.createSelectbox(subjectWiseTeachers[i][Days.Monday], "id", "id", "teacherName")}
                                </select>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="ttdgrid">
                            <div className="ttd">
                                <span>Subject</span>
                            </div>
                            <div>
                                <select className="gf-form-input" value={lecture.subjects[Days.Tuesday]} onChange={e => this.handleSubjectChange(e, i, Days.Tuesday)}>
                                    <option value="">Select Subject</option>
                                    {this.createSubjectSelectbox()}
                                </select>
                            </div>
                            <div>
                                <span className="ttd">Teacher</span>
                                <select className="gf-form-input" value={lecture.teachers[Days.Tuesday]} onChange={e => this.handleTeacherChange(e, i, Days.Tuesday)}>
                                    <option value="">Select Teacher</option>
                                    {commonFunctions.createSelectbox(subjectWiseTeachers[i][Days.Tuesday], "id", "id", "teacherName")}
                                </select>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="ttdgrid">
                            <div className="ttd">
                                <span>Subject</span>
                            </div>
                            <div>
                                <select className="gf-form-input" value={lecture.subjects[Days.Wednesday]} onChange={e => this.handleSubjectChange(e, i, Days.Wednesday)}>
                                    <option value="">Select Subject</option>
                                    {this.createSubjectSelectbox()}
                                </select>
                            </div>
                            <div>
                                <span className="ttd">Teacher</span>
                                <select className="gf-form-input" value={lecture.teachers[Days.Wednesday]} onChange={e => this.handleTeacherChange(e, i, Days.Wednesday)}>
                                    <option value="">Select Teacher</option>
                                    {commonFunctions.createSelectbox(subjectWiseTeachers[i][Days.Wednesday], "id", "id", "teacherName")}
                                </select>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="ttdgrid">
                            <div className="ttd">
                                <span>Subject</span>
                            </div>
                            <div>
                                <select className="gf-form-input" value={lecture.subjects[Days.Thursday]} onChange={e => this.handleSubjectChange(e, i, Days.Thursday)}>
                                    <option value="">Select Subject</option>
                                    {this.createSubjectSelectbox()}
                                </select>
                            </div>
                            <div>
                                <span className="ttd">Teacher</span>
                                <select className="gf-form-input" value={lecture.teachers[Days.Thursday]} onChange={e => this.handleTeacherChange(e, i, Days.Thursday)}>
                                    <option value="">Select Teacher</option>
                                    {commonFunctions.createSelectbox(subjectWiseTeachers[i][Days.Thursday], "id", "id", "teacherName")}
                                </select>
                            </div>
                        </div>
                    </td>
                    <td>
                        <div className="ttdgrid">
                            <div className="ttd">
                                <span>Subject</span>
                            </div>
                            <div>
                                <select className="gf-form-input" value={lecture.subjects[Days.Friday]} onChange={e => this.handleSubjectChange(e, i, Days.Friday)} >
                                    <option value="">Select Subject</option>
                                    {this.createSubjectSelectbox()}
                                </select>
                            </div>
                            <div>
                                <span className="ttd">Teacher</span>
                                <select className="gf-form-input" value={lecture.teachers[Days.Friday]} onChange={e => this.handleTeacherChange(e, i, Days.Friday)}>
                                    <option value="">Select Teacher</option>
                                    {commonFunctions.createSelectbox(subjectWiseTeachers[i][Days.Friday], "id", "id", "teacherName")}
                                </select>
                            </div>
                        </div>
                    </td>
                    <td>
                        {lecture.isSatLecture &&
                            <div className="ttdgrid">
                                <div className="ttd">
                                    <span>Subject</span>
                                </div>
                                <div>
                                    <select className="gf-form-input" value={lecture.subjects[Days.Saturday]} onChange={e => this.handleSubjectChange(e, i, Days.Saturday)}>
                                        <option value="">Select Subject</option>
                                        {this.createSubjectSelectbox()}
                                    </select>
                                </div>
                                <div>
                                    <span className="ttd">Teacher</span>
                                    <select className="gf-form-input" value={lecture.teachers[Days.Saturday]} onChange={e => this.handleTeacherChange(e, i, Days.Saturday)}>
                                        <option value="">Select Teacher</option>
                                        {commonFunctions.createSelectbox(subjectWiseTeachers[i][Days.Saturday], "id", "id", "teacherName")}
                                    </select>
                                </div>
                            </div>
                        }
                    </td>
                </tr>
            );
            if (lecture.isBreak) {
                retVal.push(
                    <tr>
                        <td colSpan={7}>Break</td>
                    </tr>
                );
            }
        }
        return retVal;
    }

    render() {
        const { termList, batchList, sectionList, lecObj, submitted, counter, showTimeScheduleAssignment } = this.state;
        return (
            <section className="tab-container">
                <div>
                    <div className="contnet">
                        <div className="gf-form-group">
                            <div className="dflex">
                                <div >
                                    <label className="gf-form-label b-0 bg-white">Term<span style={{ color: 'red' }}> * </span> </label>
                                    <select className={`gf-form-input ${submitted && !lecObj.termId ? 'input-textbox-error' : ''}`} name="termId" id="termId" value={lecObj.termId} onChange={this.handleLecObjChange} disabled={showTimeScheduleAssignment !== Steps.CreateLecture} >
                                        <option value="">Select Term</option>
                                        {commonFunctions.createSelectbox(termList, "id", "id", "description")}
                                    </select>
                                    {submitted && !lecObj.termId &&
                                        <small className="error-text">Please select Term</small>
                                    }
                                </div>
                                <div >
                                    <label className="gf-form-label bg-transparent b-0">Year<span style={{ color: 'red' }}> * </span></label>
                                    <select className={`gf-form-input ${submitted && !lecObj.batchId ? 'input-textbox-error' : ''}`} name="batchId" id="batchId" value={lecObj.batchId} onChange={this.handleLecObjChange} disabled={showTimeScheduleAssignment !== Steps.CreateLecture}>
                                        <option value="">Select Year</option>
                                        {this.createBatchSelectbox(batchList, "id", "id", "batch")}
                                    </select>
                                    {submitted && !lecObj.batchId &&
                                        <small className="error-text">Please select Batch</small>
                                    }
                                </div>
                                <div >
                                    <label className="gf-form-label bg-transparent b-0">Section<span style={{ color: 'red' }}> * </span></label>
                                    <select className={`gf-form-input ${submitted && !lecObj.sectionId ? 'input-textbox-error' : ''}`} name="sectionId" id="sectionId" value={lecObj.sectionId} onChange={this.handleLecObjChange} disabled={showTimeScheduleAssignment !== Steps.CreateLecture}>
                                        <option value="">Select Section</option>
                                        {this.createSectionSelectbox(sectionList, "id", "id", "section", lecObj.batchId)}
                                    </select>
                                    {submitted && !lecObj.sectionId &&
                                        <small className="error-text">Please select Section</small>
                                    }
                                </div>
                                <div >
                                    <label className="gf-form-label bg-transparent b-0">Number of Lectures<span style={{ color: 'red' }}> * </span></label>
                                    <div className={`gf-form-input ${submitted && counter === 0 ? 'input-textbox-error' : ''}`} style={{ width: '100px' }} id="numberOfLectures">
                                        <button className="btn btn-primary mr-1 btn-small" onClick={e => this.changeCounter(-1)}
                                            disabled={showTimeScheduleAssignment !== Steps.CreateLecture}>
                                            <i className="fa fa-minus" aria-hidden="true" ></i>
                                        </button>{counter}
                                        <button className="btn btn-primary ml-1 btn-small" onClick={e => this.changeCounter(1)}
                                            disabled={showTimeScheduleAssignment !== Steps.CreateLecture}>
                                            <i className="fa fa-plus" aria-hidden="true" ></i>
                                        </button>
                                    </div>
                                    {submitted && counter === 0 &&
                                        <small className="error-text">Lectures should be greater than 0</small>
                                    }
                                </div>
                                {/* </div> */}
                            </div>
                            <div className="dflex">
                                {
                                    showTimeScheduleAssignment === Steps.CreateLecture && counter > 0 &&
                                    <div id="createLectureDiv">
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
                                    </div>
                                }
                                {
                                    showTimeScheduleAssignment === Steps.EnterSubjects &&
                                    <div className="info-container" >
                                        <div className="page-container mt-1 mb-1 legal-entities-main-container plr">
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
                                                {this.createTimeTableEntries()}
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
                                        <input type="button" value="Next" onClick={this.onClickCreateLectures} className="btn btn-primary mr-1" />
                                        {
                                            showTimeScheduleAssignment === Steps.EnterSubjects &&
                                            <input type="button" value="Back" onClick={this.goBack} className="btn btn-primary" />
                                        }
                                    </div>
                                </div>
                                <div >
                                    <label className="gf-form-label bg-transparent b-0">{' '}</label>

                                </div>
                                <div >
                                    <label className="gf-form-label bg-transparent b-0">{' '}</label>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>
        );
    }
}

export default withApollo(TimeTablePage);