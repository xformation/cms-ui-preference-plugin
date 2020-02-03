import * as React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import * as moment from 'moment';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';

import { academicSettingsServices } from '../_services/academicSettings.service';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { EventUI } from "./CustomCalendarComponents";

export class CalendarSetup extends React.Component<any, any> {
    globalizeLocalizer: any = null;
    constructor(props: any) {
        super(props);
        let minTime = new Date();
        minTime.setHours(6, 30, 0);
        let maxTime = new Date();
        maxTime.setHours(20, 30, 0);
        this.state = {
            events: [],
            isModalOpen: false,
            selectedEvent: {},
            minTime: minTime,
            maxTime: maxTime,
            academicYearId: "",
            departmentId: "",
            terms: [],
            selectedTerm: "",
            batches: [],
            selectedBatch: "",
            sections: [],
            selectedSection: "",
            subjects: [],
            selectedSubject: "",
            teachers: [],
            selectedTeacher: "",
            attendanceMaster: [],
            fromDate: "",
            toDate: "",
            isRequestMade: false,
            submitted: false
        };
        this.globalizeLocalizer = momentLocalizer(moment);
        this.onClickEvent = this.onClickEvent.bind(this);
        this.showModal = this.showModal.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.getCmsSections = this.getCmsSections.bind(this);
        this.createSubjectSelectbox = this.createSubjectSelectbox.bind(this);
        this.createTeacherSelectbox = this.createTeacherSelectbox.bind(this);
        this.onClickSearchButton = this.onClickSearchButton.bind(this);
    }

    handleStateChange(e: any) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        })
        if (name === "selectedBatch") {
            this.getCmsSections(value);
            this.setState({
                selectedSection: ""
            });
        } else if(name === "selectedSubject"){
            this.setState({
                selectedTeacher: ""
            });
        }
    }

    getCmsSections(batchId: any) {
        academicSettingsServices.getCmsSections(batchId).then(
            response => {
                this.setState({
                    sections: response
                });
            }
        );
    }

    componentDidMount() {
        academicSettingsServices.getGlobalConfiguration("admin").then(
            response => {
                let academicYearId = null;
                if (response.selectedAcademicYearId === null || response.selectedAcademicYearId === 0) {
                    academicYearId = response.cmsAcademicYearVo.id;
                } else {
                    academicYearId = response.selectedAcademicYearId;
                }
                if (academicYearId) {
                    this.setState({
                        academicYearId
                    });
                    academicSettingsServices.getCmsTerms(academicYearId).then(
                        response => {
                            this.setState({
                                terms: response
                            });
                        }
                    );
                    let departmentId = response.selectedDepartmentId;
                    // departmentId = 2001;
                    this.setState({
                        departmentId
                    });
                    academicSettingsServices.getCmsBatches(departmentId).then(
                        response => {
                            this.setState({
                                batches: response
                            });
                        }
                    );
                    academicSettingsServices.getCmsSubjects(departmentId).then(
                        response => {
                            this.setState({
                                subjects: response
                            });
                        }
                    );
                    academicSettingsServices.getCmsTeachers(departmentId).then(
                        response => {
                            this.setState({
                                teachers: response
                            });
                        }
                    );
                    academicSettingsServices.getFilterAttendanceMasterByDepartment(departmentId).then(
                        response => {
                            this.setState({
                                attendanceMaster: response
                            });
                        }
                    );
                }
            },
            error => {
                alert("Error in getting global config");
            }
        );
    }

    showModal(e: any, bShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow
        }));
    }

    createCalendarEvents(response: any) {
        let events = [];
        let minTime = null;
        let maxTime = null;
        for (let i = 0; i < response.length; i++) {
            let res = response[i];
            let { lecDate, attendancemaster } = res;
            let startTime = new Date(lecDate + " " + res.startTime);
            let endTime = new Date(lecDate + " " + res.endTime);
            let title = "Techer: " + attendancemaster.teach.teacher.teacherName + " Subject: " + attendancemaster.teach.subject.subjectCode;
            if (!minTime) {
                minTime = new Date();
                minTime.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
            } else {
                let tempDate = new Date();
                tempDate.setHours(startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                minTime = tempDate < minTime ? tempDate : minTime;
            }
            if (!maxTime) {
                maxTime = new Date();
                maxTime.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
            } else {
                let tempDate = new Date();
                tempDate.setHours(endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                maxTime = tempDate > maxTime ? tempDate : maxTime;
            }
            events.push({
                title: title,
                start: startTime,
                end: endTime,
                allDay: false,
                teacher: attendancemaster.teach.teacher.teacherName + " " + attendancemaster.teach.teacher.teacherLastName,
                subject: attendancemaster.teach.subject.subjectCode,
                img: attendancemaster.teach.teacher.uploadPhoto,
                sex: attendancemaster.teach.teacher.sex
            });
        }
        return {
            events,
            minTime,
            maxTime
        };
    }

    onClickEvent(event: any, e: any) {
        this.setState({
            selectedEvent: event
        });
        this.showModal(e, true);
    }

    createSelectbox(data: any, value: any, label: any, uniqueKey: any) {
        const retData = [];
        for (let i = 0; i < data.length; i++) {
            let option = data[i];
            retData.push(
                <option key={option[value] + "-" + uniqueKey} value={option[value]}>{option[label]}</option>
            );
        }
        return retData;
    }

    createSubjectSelectbox(data: any) {
        const { selectedBatch } = this.state;
        const retData = [];
        if (selectedBatch) {
            for (let i = 0; i < data.length; i++) {
                let option = data[i];
                if (option.batch.id === parseInt(selectedBatch, 10)) {
                    retData.push(
                        <option key={option["id"] + "-subject"} value={option["id"]}>{option["subjectDesc"]}</option>
                    );
                }
            }
        }
        return retData;
    }

    createTeacherSelectbox(data: any) {
        const { selectedSubject, attendanceMaster } = this.state;
        const retData = [];
        if (selectedSubject) {
            let addedTeachers: any = [];
            for (let i = 0; i < attendanceMaster.length; i++) {
                let master = attendanceMaster[i];
                const subject = master.teach.subject;
                if (subject.id === parseInt(selectedSubject, 10)) {
                    if (addedTeachers.indexOf(master.teach.teacher.id) === -1) {
                        retData.push(
                            <option value={master.teach.teacher.id} key={master.teach.teacher.id + "-teacher"}>{master.teach.teacher.teacherName} {master.teach.teacher.teacherLastName}</option>
                        );
                        addedTeachers.push(master.teach.teacher.id);
                    }
                }
            }
        }
        return retData;
    }

    convertInDDMMYYFormat(date: any) {
        if (date) {
            let dateArr = date.split("-");
            return dateArr[2] + "-" + dateArr[1] + "-" + dateArr[0];
        }
        return "";
    }

    onClickSearchButton(e: any) {
        this.setState({
            submitted: true
        });
        const { selectedTerm, selectedBatch, selectedSection, selectedSubject, selectedTeacher, fromDate, toDate, departmentId, academicYearId } = this.state;
        if (selectedTerm && selectedBatch && selectedSection) {
            this.setState({
                isRequestMade: true
            });
            let data = {
                selectedTerm,
                academicYearId,
                selectedSection,
                selectedBatch,
                departmentId,
                selectedSubject,
                selectedTeacher,
                fromDate: this.convertInDDMMYYFormat(fromDate),
                toDate: this.convertInDDMMYYFormat(toDate)
            };
            academicSettingsServices.getCmsLectures(data).then(
                response => {
                    let { events, minTime, maxTime } = this.createCalendarEvents(response);
                    this.setState({
                        events,
                        minTime,
                        maxTime,
                        isRequestMade: false
                    });
                },
                error => {
                    console.log(error);
                    this.setState({
                        isRequestMade: false
                    });
                }
            );
        }
    }

    render() {
        const { events, selectedEvent, isModalOpen, minTime, maxTime, terms, selectedTerm, batches, selectedBatch, sections, selectedSection, subjects, selectedSubject, teachers, selectedTeacher, fromDate, toDate, isRequestMade, submitted } = this.state;
        return (
            <div>
                <div className="gf-form-group row m-b-0 p-l-1">
                    <div className={`gf-form--grow form-control-container m-b-1 ${submitted && !selectedTerm ? "has-error" : ""}`}>
                        <label className="gf-form-label bg-transparent b-0">Term/Semester</label>
                        <select className="gf-form-select-box" name="selectedTerm" value={selectedTerm} onChange={this.handleStateChange}>
                            <option value="">Select Term</option>
                            {this.createSelectbox(terms, "id", "termsDesc", "term")}
                        </select>
                        {
                            submitted && !selectedTerm &&
                            <div className="error">Term is required.</div>
                        }
                    </div>
                    <div className={`gf-form--grow form-control-container m-b-1 ${submitted && !selectedBatch ? "has-error" : ""}`}>
                        <label className="gf-form-label bg-transparent b-0">Year</label>
                        <select className="gf-form-select-box" name="selectedBatch" value={selectedBatch} onChange={this.handleStateChange}>
                            <option value="">Select Year</option>
                            {this.createSelectbox(batches, "id", "batch", "batch")}
                        </select>
                        {
                            submitted && !selectedBatch &&
                            <div className="error">Year is required.</div>
                        }
                    </div>
                    <div className={`gf-form--grow form-control-container m-b-1 ${submitted && !selectedSection ? "has-error" : ""}`}>
                        <label className="gf-form-label bg-transparent b-0">Section</label>
                        <select className="gf-form-select-box" name="selectedSection" value={selectedSection} onChange={this.handleStateChange}>
                            <option value="">Select Section</option>
                            {this.createSelectbox(sections, "id", "section", "section")}
                        </select>
                        {
                            submitted && !selectedSection &&
                            <div className="error">Section is required.</div>
                        }
                    </div>
                    <div className="gf-form--grow form-control-container m-b-1">
                        <label className="gf-form-label bg-transparent b-0">Subject</label>
                        <select className="gf-form-select-box" name="selectedSubject" value={selectedSubject} onChange={this.handleStateChange}>
                            <option value="">Select Subject</option>
                            {this.createSubjectSelectbox(subjects)}
                        </select>
                    </div>
                    <div className="gf-form--grow form-control-container m-b-1">
                        <label className="gf-form-label bg-transparent b-0">Teacher </label>
                        <select className="gf-form-select-box" name="selectedTeacher" value={selectedTeacher} onChange={this.handleStateChange}>
                            <option value="">Select Teacher</option>
                            {this.createTeacherSelectbox(teachers)}
                        </select>
                    </div>
                </div>
                <div className="gf-form-group row m-b-0 p-l-1">
                </div>
                <div className="gf-form-group row p-l-1">
                    <div className="gf-form--grow form-control-container m-b-1">
                        <label className="gf-form-label bg-transparent b-0">From Date</label>
                        <input type="date" className="gf-form-input" name="fromDate" value={fromDate} onChange={this.handleStateChange} />
                    </div>
                    <div className="gf-form--grow form-control-container m-b-1">
                        <label className="gf-form-label bg-transparent b-0">To Date</label>
                        <input type="date" className="gf-form-input" name="toDate" value={toDate} onChange={this.handleStateChange} />
                    </div>
                </div>
                <div className="gf-form-group row p-l-1">
                    <div className="gf-form--grow form-control-container cust-width-220">
                        <input type="button" className="btn btn-primary gf-form-control" onClick={this.onClickSearchButton} value="Search" disabled={isRequestMade} />
                    </div>
                </div>
                <div className="calendar-container">
                    <Calendar
                        localizer={this.globalizeLocalizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        views={["month", "week", "work_week", "day", "agenda"]}
                        onSelectEvent={this.onClickEvent}
                        min={minTime}
                        max={maxTime}
                        components={{
                            event: EventUI,
                        }}
                    />
                    <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                        <ModalHeader>Add New</ModalHeader>
                        <ModalBody className="modal-content">
                            <form className="gf-form-group section m-0 dflex">
                                <div className="modal-fwidth">
                                    <div className="modal-fwidth">
                                        <div className="row">
                                            <label className="col-sm-6">Teacher: </label>
                                            <label className="col-sm-6"><b>{selectedEvent.teacher}</b></label>
                                        </div>
                                        <div className="row">
                                            <label className="col-sm-6">Subject: </label>
                                            <label className="col-sm-6"><b>{selectedEvent.subject}</b></label>
                                        </div>
                                    </div>
                                    <div className="m-t-1 text-center">
                                        <button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false)}>Close</button>
                                    </div>
                                </div>
                            </form>
                        </ModalBody>
                    </Modal>
                </div>
            </div>
        );
    }
}
