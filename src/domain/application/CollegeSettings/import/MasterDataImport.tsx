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
            },
            status: [],
            isLoading: false,
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
            this.setState({
                errorMessage: errorMessage
            });
            return isValid;
        }
        if (excelFile === undefined || excelFile === '' || excelFile  === null) {
            errorMessage = "Please upload an excel file"
            this.setState({
                errorMessage: errorMessage
            });
            isValid = false;
            return isValid;
        }
        
        
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
        console.log("File : ",e.target.files[0]);
        this.setState({
            excelFile: e.target.files[0]
        })
    }

    async uploadFile(e: any) {
        const {excelFile, obj} = this.state;
        if(!this.validateFields(obj)){
            return;
        }
        this.setState({
            isLoading: true,
            status: [],
            errorMessage: "",
            successMessage: "",
        })
        const data = new FormData();
        data.append('file', excelFile, excelFile.name);

        await fetch(config.CMS_UPLOAD_MASTER_DATA_URL+ '/' + obj.entityId, {
            method: 'post',
            body: data
        }) .then(response => response.json())
        .then(resp => {
            console.log("Response 1: ",resp);
            resp.map((item: any) =>{
                console.log("resp item ::: ",item);
                this.state.status.push(item);
            })
            this.setState({
                successMessage: SUCCESS_MESSAGE_MASTERDATA_ADDED,
                isLoading: false,
            })
            
        });
    }

    createGrid(){
        const {status} = this.state;
        let retData = [];
        if(status.length > 0){
            for(let i=0; i<status.length;i++){
                let item = status[i];
                retData.push(
                    <tbody>
                        <tr><td>{item.entity.toUpperCase()}</td><td>{item.status}</td></tr>
                    </tbody>
                );
            }
        } 
        return retData;
    }
    render() {
        const { errorMessage, successMessage, tableList, obj, status, isLoading } = this.state;
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
                    {
                        isLoading ?
                            <div>Data is loading...</div>
                        :
                        <div className="authorized-signatory-container m-t-1 fwidth">
                            {
                                status.length > 0 &&
                                <table>
                                    <thead><th>Table</th><th>Status</th></thead>
                                    {this.createGrid()}
                                </table>
                                
                            }
                        </div>
                    }
                </div>
            </main>
        );
    }
};

export default withApollo(MasterDataImport)