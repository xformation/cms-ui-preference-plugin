import * as React from 'react';
import {Calendar, momentLocalizer} from 'react-big-calendar';
import * as moment from 'moment';
import events from './events';

import "react-big-calendar/lib/css/react-big-calendar.css";


export class CalendarSetup extends React.Component<any, any> {
    globalizeLocalizer: any = null;
    constructor(props: any) {
        super(props);
        this.state = {

        };
        this.globalizeLocalizer = momentLocalizer(moment);
    }

    render() {
        return (
            <div className="calendar-container">
                <Calendar
                    localizer={this.globalizeLocalizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                />
            </div>
        );
    }
}
