import * as React from 'react';
// import { collegeSettingsServices } from '../../../_services/collegeSettings.services';
import { withApollo } from 'react-apollo';
import { commonFunctions } from '../../_utilites/common.functions';
import { ADD_COLLEGE} from '../../_queries';
// import { validators } from '../_services/commonValidation';
// import withLoadingHandler from '../../withLoadingHandler';
import MessageBox from '../../Message/MessageBox';
import {config} from '../../../application/config';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const SUCCESS_MESSAGE_MASTERDATA_ADDED = "Master data uploaded successfully";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preference service, master data could not be uploaded. Please check preference service logs";

export interface MasterDataProp extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    tableList?: any;
    onSaveUpdate?: any;
}

class MasterDataImport extends React.Component<MasterDataProp, any> {
    constructor(props: MasterDataProp) {
        super(props);
        this.state = {
            errorMessage:"",
            successMessage:"",
            tableList: this.props.tableList,
            excelFile: null,
            obj: {
                entityId: "",
            }
        }; 
        this.onChange = this.onChange.bind(this);
        this.createTableSelectbox = this.createTableSelectbox.bind(this);
        this.getFile = this.getFile.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    createTableSelectbox(data: any){
        let retData = [];
        if(data.length > 0){
            for(let i=0; i<data.length;i++){
                let item = data[i];
                retData.push(
                    <option value={item} key={item}>{item}</option>
                );
            }
        } 
        return retData;
    }

    validateFields(obj: any){
        const {excelFile} = this.state;
        let isValid = true;
        let errorMessage = ""
        if(obj.entityId === undefined || obj.entityId === null || obj.entityId === ""){
            commonFunctions.changeTextBoxBorderToError((obj.entityId === undefined || obj.entityId === null) ? "" : obj.entityId, "entityId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if (excelFile.name === undefined || excelFile.name === '' || excelFile.name === null) {
            errorMessage = "Please upload an excel file"
            isValid = false;
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid;
    }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { obj } = this.state;
        
        this.setState({
            obj: {
                ...obj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

    getFile(e: any) {
        let excelFile = URL.createObjectURL(e.target.files[0]);
        var r = new FileReader();
        r.onload = function (e: any) {
            excelFile = e.target.result;
        };
        r.readAsDataURL(e.target.files[0]);

        this.setState({
            excelFile: excelFile
        })
    }

    async uploadFile(e: any) {
        const {excelFile, obj} = this.state;

        const data = new FormData();
        data.append('file', excelFile, excelFile.name);
        const requestOptions = commonFunctions.getRequestOptions("POST", {"Content-Type":undefined}, JSON.stringify(data));
// //     
//         const resp = await fetch(config.CMS_UPLOAD_MASTER_DATA_URL, data {
//           transformRequest: requestOptions,
//         });
        return await fetch(config.CMS_UPLOAD_MASTER_DATA_URL, requestOptions)
        .then(response => response.json()); 

        // console.log('Post response : ', resp);
        // alert(resp.data.statusDesc);
    }

    render() {
        const { errorMessage, successMessage, tableList, obj } = this.state;
        return (
            <main >
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
                <div className="page-container page-body legal-entities-main-container">
                    <div className="authorized-signatory-container m-b-1">
                        <h3>Import existing data into EMS.</h3>
                        <div className="importDflex">
                            <div className="rtMargin">
                                <label className="button-file-upload">
                                    <span className="fake-upload-button">Choose File</span>
                                    <span className="js-button-file-upload-text button-file-upload-text"></span>
                                    <input type="file" id="file" name="file" onChange={this.getFile} className="js-button-file-upload-input" />
                                </label>
                            </div>
                            <div className="form-h5">
                                <label className="form-h5">Entity</label>
                                <select id="entityId" name="entityId" onChange={this.onChange} value={obj.entityId}>
                                    <option value="">Select Entity</option>
                                    <option value="all">All</option>
                                    {
                                        this.createTableSelectbox(tableList)
                                    }
                                </select>
                            </div>
                        </div>
                    </div>
                    <button onClick={this.uploadFile} className="btn btn-primary">Upload</button>
                </div>
            </main>
        );
    }
};

export default withApollo(MasterDataImport)