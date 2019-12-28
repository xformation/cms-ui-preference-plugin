import * as React from 'react';
// import { collegeSettingsServices } from '../../../_services/collegeSettings.services';
import { withApollo } from 'react-apollo';
import { ADD_COLLEGE} from '../../../_queries';
// import { validators } from '../_services/commonValidation';
// import withLoadingHandler from '../../withLoadingHandler';
import MessageBox from '../../../Message/MessageBox';

const SUCCESS_MESSAGE_COLLEGE_ADDED = "College is added successfully. It is created as default main branch also";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preference service, college could not be saved. Please check preference service logs";
const ERROR_MESSAGE_COLLEGE_EXISTS = "College already exists. Application allows only one college";
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
                errorMessage:"",
                successMessage:"",
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
              [name]: value
            }
        });
    }

    handleImageChange(e: any) {
        const { collegeData } = this.state;
        collegeData.logoFile = URL.createObjectURL(e.target.files[0]);
        var r = new FileReader();
        r.onload = function (e: any) {
            collegeData.logoFile = e.target.result;
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

    async handleSubmit(e: any) {
        const { collegeData } = this.state;
        collegeData.errorMessage = "";
        collegeData.successMessage ="";
        this.setState({
            collegeData: collegeData
        });

        let btn = document.querySelector("#btnAddCollege");
        btn && btn.setAttribute("disabled", "true");
        let logoFileString = collegeData.logoFile; 
        if(collegeData.logoFile === this.DEFAULT_LOGO){
            logoFileString = null;
        }
        let collegeInput = {
            collegeName: collegeData.collegeName,
            logoFile: logoFileString
        };
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation:  ADD_COLLEGE,
            variables: { input: collegeInput },
            fetchPolicy: 'no-cache'
        }).then((resp: any) => {
            console.log("Response in addCollege mutation. Exit code : ",resp.data.addCollege.cmsCollegeVo.exitCode);
            exitCode = resp.data.addCollege.cmsCollegeVo.exitCode;
            if(exitCode === 100){
                collegeData.errorMessage = ERROR_MESSAGE_COLLEGE_EXISTS;
                console.log("Resp with Error code: ",ERROR_MESSAGE_COLLEGE_EXISTS )
            }else{
                collegeData.successMessage = SUCCESS_MESSAGE_COLLEGE_ADDED;
                console.log("Success resp: ",SUCCESS_MESSAGE_COLLEGE_ADDED);
            }
            this.setState({
                collegeData: collegeData
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in addCollege mutation : ', error);
            collegeData.errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
            this.setState({
                collegeData: collegeData
            });
        });
        btn && btn.removeAttribute("disabled");
        
    }

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
            <main >
                {
                    collegeData.errorMessage !== ""  ? 
                        <MessageBox id="mbox" message={collegeData.errorMessage} activeTab={2}/>        
                        : null
                }
                {
                    collegeData.successMessage !== ""  ? 
                        <MessageBox id="mbox" message={collegeData.successMessage} activeTab={1}/>        
                        : null
                }
                    
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
                        <input type="button" id="btnAddCollege" value="Save" onClick={this.handleSubmit} className="btn btn-primary save-all-forms-btn"></input>
                    </div>
                
            </main>
        );
    }
};

export default withApollo(CollegeInfo)