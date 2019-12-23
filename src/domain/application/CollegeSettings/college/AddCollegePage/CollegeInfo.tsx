import * as React from 'react';
import { collegeSettingsServices } from '../../../_services/collegeSettings.services';
import { graphql, withApollo } from 'react-apollo';

import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { ADD_COLLEGE} from '../../../_queries';
// import { validators } from '../_services/commonValidation';
// import withLoadingHandler from '../../withLoadingHandler';
import MessageBox from '../../../Message/MessageBox';

type CollegeState = {
    collegeData: any,
};

class CollegeInfo extends React.Component<any, CollegeState> {
    DEFAULT_LOGO = "/public/img/college_logo.png";
    // DEFAULT_BG = "/public/img/dashboard.png";
    isActive: any = false;
    collegeFormRef: any;
    // cumulativeResult: any;

    constructor(props: any) {
        super(props);
        this.state = {
            collegeData: {
                logoFile: this.DEFAULT_LOGO,
                collegeName: "",
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleImageChange = this.handleImageChange.bind(this);
        this.collegeFormRef = React.createRef();
    }

    handleStateChange(e: any) {
        const { name, value } = e.nativeEvent.target;
        const { collegeData } = this.state;
        this.setState({
            collegeData: {
              ...collegeData,
              collegeName: value
            }
        });
    }

    handleImageChange(e: any) {
        const { collegeData } = this.state;
        collegeData.logoFile = URL.createObjectURL(e.target.files[0]);
        var r = new FileReader();
        r.onload = function (e: any) {
            collegeData.logoFile = e.target.result;
            console.log('College logo converted to base64 :\n\n' + collegeData.logoFile);
        };
        r.readAsDataURL(e.target.files[0]);

        this.setState({
            collegeData: collegeData
        })
    }

    // handleImageChange(e: any) {
    //     const { files } = e.target;
    //     if (files.length > 0) {
    //         const result = this.toBase64(files[0]);
    //         result.then((base64) => {
    //             this.setState({
    //                 logoFile: base64
    //             });

    //         }).catch(() => {

    //         });
    //     } else {
    //         this.setState({
    //             logoFile: null
    //         });

    //     }

    // }

    handleSubmit(e: any) {
        // e.preventDefault();
        const { collegeData } = this.state;
        let btn = document.querySelector(".save-all-forms-btn");
        btn && btn.setAttribute("disabled", "true");
        let dataSavedMessage: any = document.querySelector(".data-saved-message");
        // dataSavedMessage.style.display = "none";
        let logoFileString = collegeData.logoFile; 
        if(collegeData.logoFile === this.DEFAULT_LOGO){
            logoFileString = null;
        }
        let collegeInput = {
            collegeName: collegeData.collegeName,
            logoFile: logoFileString
        };
        
        return this.props.client.mutate({
            variables: { input: collegeInput },
        }).then((data: any) => {
            btn && btn.removeAttribute("disabled");
            dataSavedMessage.style.display = "inline-block";
            console.log("gql response --- : ",data);
        }).catch((error: any) => {
            btn && btn.removeAttribute("disabled");
            dataSavedMessage.style.display = "inline-block";
            console.log('there was an error sending the update mutation', error);
        });
    }

    // handleSubmit(e: any) {
    //     e.preventDefault();
    //     const { logoFile } = this.state;
    //     const sendData = {
    //         logoFile: logoFile,
    //     };
    //     this.setState({
    //         is_api_progress: true
    //     });
    //     collegeSettingsServices.saveCollege(sendData).then(
    //         response => {
    //             if (response === 200 || response === 201) {
    //                 // alert('College data saved successfully.');
    //             } else if (response === 500) {
    //                 // alert('College already exists.');
    //             } else {
    //                 // alert('Due to some error college data could not be saved!');
    //             }
    //             this.setState({
    //                 is_api_progress: false
    //             });
    //         },
    //         error => {
    //             alert("Due to some error college data could not be saved!");
    //             this.setState({
    //                 is_api_progress: false
    //             });
    //         }
    //     );
    // }

    

    toBase64(file: any) {
        return new Promise((resolve: any, reject: any) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    render() {
        const { collegeData } = this.state;
        return (
            <div className="info-container">
                {/* <small>REGISTER COLLEGE</small>
                    <hr></hr> */}
                <MessageBox id='1' message='REGISTER COLLEGE' activeTab='0'></MessageBox>
                {/* <div className=""> */}
                    {/* <h6>REGISTER BASIC INFORMATION ABOUT COLLEGE</h6> */}
                    {/* <hr></hr> */}
                    {/* <small>REGISTER BASIC INFORMATION ABOUT COLLEGE</small>
                    <hr></hr> */}
                {/* </div> */}
                <form name="collegeForm" className="gf-form-group section m-b-1" onSubmit={this.handleSubmit}>
                    <h5 className="form-h5">Name</h5>
                    <div className="gf-form m-b-1">
                        <input type="text" className="gf-form-input max-width-18" placeholder="College Name" maxLength={255} required={true} name="collegeName" value={collegeData.collegeName} onChange={this.handleStateChange} />
                    </div>
                    
                    <h5 className="form-h5 mt-1">LOGO</h5>
                    <small>Logo dimensions cannot exceed 60px height 100px width.</small>
                    <div className="logo-container d-flex m-b-1 mt-1">
                        <img className="logo m-b-1" src={collegeData.logoFile || this.DEFAULT_LOGO} />
                        <div className="gf-form m-b-1">
                            <label className="upload-cursor">
                                <input id="d-none" type="file" className="gf-form-file-input" accept="image/*" onChange={this.handleImageChange} name="logoFile" />
                                Upload <i className="fa fa-info-circle l-grey"></i>
                            </label>
                        </div>
                    </div>
                    <div className="gf-form-button-row">
                        {/* <input type="button" value="Save" onClick={this.handleSubmit} className="btn bs save-all-forms-btn"></input> */}
                        <button type="submit" className="btn btn-primary border-bottom save-all-forms-btn">Save</button>
                    </div>
                </form>
            </div>
        );
    }
};

// export default (
//     graphql(ADD_COLLEGE, {
//         name: "addCollegeMutation",
//     })
//     (CollegeInfo)
// );

export default withApollo(CollegeInfo)