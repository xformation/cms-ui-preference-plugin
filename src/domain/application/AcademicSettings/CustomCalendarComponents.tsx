import * as React from 'react';

export function EventUI({ event }: any) {
    return (
        <div style={{padding: "5px"}}>
            <div style={{marginBottom: "20px"}}>
                <div style={{marginBottom:"5px"}}>
                    Teacher:
                </div>
                <div>
                    <strong>{event.teacher}</strong>
                </div>
            </div>
            <div>
                <div style={{marginBottom:"5px"}}>
                    Subject:
                </div>
                <div>
                    <strong>{event.subject}</strong>
                </div>
            </div>
        </div>
    )
}
