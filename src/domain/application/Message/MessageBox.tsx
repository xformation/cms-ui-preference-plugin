import * as React from 'react';
import "./MessageBox.css";

interface MsgProps {
    // id: any;
    // messageType: any;
    message: any;
    activeTab: any;
}

export class MessageBox extends React.Component<MsgProps, any> {
    constructor(props: MsgProps) {
        super(props);
        this.state = {
            activeState: this.props.activeTab,
        };
        this.closeDiv = this.closeDiv.bind(this);
    }

    closeDiv() {
        this.setState({
          activeState: 0,
        });
    }
    

    render() {
        const {message} = this.props
        const {activeState} = this.state;
        return (
            <main>
                <div className={`${activeState === 0 ? 'info msgbox-border form-h5 msgbox-width-height' : 'hide'}`}>
                    <div>{message}</div>
                    <hr className='msgbox-hr'></hr>
                </div>
                <div className={`${activeState === 1 ? 'success msgbox-border msgbox-padding msgbox-width-height text' : 'hide'}`}>
                    <div><input onClick={this.closeDiv} className="msgbox-close fa-info-circle" type="button" value="x"></input>{message}</div>
                </div>
                <div className={`${activeState === 2 ? 'error msgbox-border msgbox-padding msgbox-width-height text' : 'hide'}`}>
                    <div><input onClick={this.closeDiv} className="msgbox-close fa-info-circle" type="button" value="x"></input>{message}</div>
                </div>
                
            </main>
            
            
        );
    }
}

export default MessageBox;