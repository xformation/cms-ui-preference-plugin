import * as React from 'react';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import * as moment from 'moment';

import { academicSettingsServices } from '../_services/academicSettings.service';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Recoverable } from 'repl';

export class CalendarSetup extends React.Component<any, any> {
    globalizeLocalizer: any = null;
    constructor(props: any) {
        super(props);
        this.state = {
            events: []
        };
        this.globalizeLocalizer = momentLocalizer(moment);
    }

    componentDidMount() {
        academicSettingsServices.getCmsLectures().then(
            response => {
                let events = this.createCalendarEvents(response);
                this.setState({
                    events
                });
            },
            error => {
                console.log(error);
            }
        );
    }

    createCalendarEvents(response: any) {
        let events = [];
        for (let i = 0; i < response.length; i++) {
            let res = response[i];
            let { lecDate, attendancemaster } = res;
            let startTime = new Date(lecDate + " " + res.startTime);
            let endTime = new Date(lecDate + " " + res.endTime);
            let title = "Techer: " + attendancemaster.teach.teacher.teacherName + " Subject: " + attendancemaster.teach.subject.subjectCode;
            events.push({
                title: title,
                start: startTime,
                end: endTime,
                allDay: false
            });
        }
        return events;
    }

    render() {
        const { events } = this.state;
        return (
            <div className="calendar-container">
                <Calendar
                    localizer={this.globalizeLocalizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={["month", "week", "work_week", "day", "agenda"]}
                />
            </div>
        );
    }
}
