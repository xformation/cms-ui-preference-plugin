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
            maxTime: maxTime
        };
        this.globalizeLocalizer = momentLocalizer(moment);
        this.onClickEvent = this.onClickEvent.bind(this);
        this.showModal = this.showModal.bind(this);
    }

    componentDidMount() {
        academicSettingsServices.getCmsLectures().then(
            response => {
                let { events, minTime, maxTime } = this.createCalendarEvents(response);
                this.setState({
                    events,
                    minTime,
                    maxTime
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    showModal(e: any, bShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow
        }));
    }

    setMinMaxTime() {

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
                minTime = startTime;
            } else {
                minTime = startTime < minTime ? startTime : minTime;
            }
            if (!maxTime) {
                maxTime = endTime;
            } else {
                maxTime = endTime > maxTime ? endTime : maxTime;
            }
            events.push({
                title: title,
                start: startTime,
                end: endTime,
                allDay: false,
                teacher: attendancemaster.teach.teacher.teacherName + " " + attendancemaster.teach.teacher.teacherLastName,
                subject: attendancemaster.teach.subject.subjectCode
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

    render() {
        const { events, selectedEvent, isModalOpen, minTime, maxTime } = this.state;
        return (
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
        );
    }
}
