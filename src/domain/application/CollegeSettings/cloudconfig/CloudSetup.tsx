import * as React from 'react';
import { withApollo } from 'react-apollo';
import {MessageBox} from '../../Message/MessageBox'
import { commonFunctions } from '../../_utilites/common.functions';
import { jcrSettingsServices } from '../../_services/jcrSettings.service';

import {config} from '../../config';
import wsCmsBackendServiceSingletonClient from '../../../../wsCmsBackendServiceClient';
import { GET_CLOUD_CONTEXT_PATH_LIST, SAVE_CLOUD_CONTEXT_PATH } from '../../_queries';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, context path could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_ADDED = "Data saved successfully";


interface CloudProp extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
}

class CloudSetup extends React.Component<CloudProp, any> {
    
    constructor(props: CloudProp) {
        super(props);
        this.state = {
            URL_PARAMS:  new URLSearchParams(location.search),
            cloudServiceProvider: null,
            errorMessage: "", 
            successMessage: "",
            branchId: null,
            academicYearId: null,
            departmentId: null,
            list: this.props.ctxList,
            emsModules: null,
            contextPath: null,
            accessKey: null,
            secrateKey: null,
            endPoint: null,
        };
        this.registerSocket = this.registerSocket.bind(this);
        this.onChange = this.onChange.bind(this);
        this.save = this.save.bind(this);
        this.isMandatoryField = this.isMandatoryField.bind(this);
        this.validate = this.validate.bind(this);
        this.getInput = this.getInput.bind(this);
        this.validateCloudConfig = this.validateCloudConfig.bind(this);
        this.getCloudConfigInput = this.getCloudConfigInput.bind(this);
        this.saveCloudConfig = this.saveCloudConfig.bind(this);
    }

    async componentDidMount(){
        await this.registerSocket();
    }
    registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("CloudSetup. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("CloudSetup. branchId: ",this.state.branchId);
            console.log("CloudSetup. ayId: ",this.state.academicYearId);  
            console.log("CloudSetup. departmentId: ",this.state.departmentId);  
        }
    
        socket.onopen = () => {
            console.log("CloudSetup. Opening websocekt connection to cmsbackend. User : ",new URLSearchParams(location.search).get("signedInUser"));
            socket.send(new URLSearchParams(location.search).get("signedInUser"));
        }
    
        window.onbeforeunload = () => {
            console.log("CloudSetup. Closing websocket connection with cms backend service");
        }
    }

    onChange(e: any) {
        const { name, value } = e.nativeEvent.target;
        this.setState({
            [name]: value,
            successMessage: '',
            errorMessage: ''
        });
        commonFunctions.restoreTextBoxBorderToNormal(name);
        console.log("name : "+name+", value : "+value);
        if(name === "emsModules"){
            this.filterPath(value);
        }
        if(name === "cloudServiceProvider"){
            this.fetchCloudConfig(value);        
        }
    }

    async fetchCloudConfig(value : any){
        await jcrSettingsServices.getCloudInfoList(config.CMS_GET_CLOUD_PROVIDER_CONFIG).then(
            response => {
                console.log("cloud provider config : ",response[0]);
              this.setState({
                  accessKey: response[0].accessKey,
                  secrateKey: response[0].secrateKey,
                  endPoint: response[0].endPoint
              });
            }
        );
    }

    filterPath(pluginName: any){
        const {list} = this.state;
        console.log("list : ", list);
        let isFound = false;
        for(let i=0; i<list.length; i++){
            let item = list[i];
            if(item.plugin === pluginName){
                this.setState({
                    contextPath: item.path
                });
                isFound = true;
                break;
            }
        }
        if(!isFound){
            this.setState({
                contextPath: ""
            });
        }
    }

    isMandatoryField(objValue: any, obj: any){
        if(objValue === undefined || objValue === null || objValue.trim() === ""){
          commonFunctions.changeTextBoxBorderToError("", obj);
          return true
        }
        return false;
    }
    
    validate(){
        const {emsModules, contextPath, cloudServiceProvider} = this.state;
        if(this.isMandatoryField(cloudServiceProvider, "cloudServiceProvider")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        }else if(this.isMandatoryField(emsModules, "emsModules")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        } else if (this.isMandatoryField(contextPath, "contextPath")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        }
        
        return true;
    }
    
    validateCloudConfig(){
        const {cloudServiceProvider, accessKey, secrateKey, endPoint} = this.state;
        if(this.isMandatoryField(cloudServiceProvider, "cloudServiceProvider")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        }else if(this.isMandatoryField(accessKey, "accessKey")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        } else if (this.isMandatoryField(secrateKey, "secrateKey")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        }else if (this.isMandatoryField(endPoint, "endPoint")){
            this.setState({
                errorMessage: ERROR_MESSAGE_MANDATORY_FIELD_MISSING
            });
            return false;
        }
        
        return true;
    }

    getInput() {
        const {emsModules, contextPath, cloudServiceProvider} = this.state;
        let input = {
            provider: cloudServiceProvider,
            plugin: emsModules,
            path: contextPath,
        };
        return input;
    }

    getCloudConfigInput() {
        const {cloudServiceProvider, accessKey, secrateKey, endPoint} = this.state;
        let input = {
            provider: cloudServiceProvider,
            accessKey: accessKey,
            secrateKey: secrateKey,
            endPoint: endPoint,
        };
        return input;
    }

    async doSave(inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_CLOUD_CONTEXT_PATH,
            variables: { 
                input: inp
            },
        }).then((resp: any) => {
            console.log("Success in saveCloudContextPath Mutation. Exit code : ",resp.data.saveCloudContextPath.cmsCloudContextPathVo.exitCode);
            exitCode = resp.data.saveCloudContextPath.cmsCloudContextPathVo.exitCode;
            let temp = resp.data.saveCloudContextPath.cmsCloudContextPathVo.dataList; 
            console.log("New cloud context path list : ", temp);
            this.setState({
                list: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveCloudContextPath : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_ADDED;
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
        
    }

    async doSave2(url: any, inp: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;

        await jcrSettingsServices.save(url, inp).then(response => {
            console.log('Api response: ', response);
            this.setState({
                successMessage: SUCCESS_MESSAGE_ADDED,
                list: response
            });
        }).catch((error: any) => {
            this.setState({
                errorMessage: ERROR_MESSAGE_SERVER_SIDE_ERROR
            });
            console.log('Error in saveCloudContextPath : ', error);
        });
        btn && btn.removeAttribute("disabled");
    }

    save = (e: any) => {
        const { id } = e.nativeEvent.target;
        let isValid = this.validate();
        if(isValid === false){
            return;
        }
        const inp = this.getInput();
        console.log("Input :::: ",inp);
        // this.doSave(inp, id);
        this.doSave2(config.CMS_SAVE_CLOUD_CONTEXT_PATH, inp, id);
    }
    
    saveCloudConfig= (e: any) => {
        const { id } = e.nativeEvent.target;
        let isValid = this.validateCloudConfig();
        if(isValid === false){
            return;
        }
        const inp = this.getCloudConfigInput();
        console.log("Cloud provider config input :::: ",inp);
        this.doSave2(config.CMS_SAVE_CLOUD_PROVIDER_CONFIG, inp, id);
    }

    render() {
        const { errorMessage, successMessage, cloudServiceProvider, emsModules, contextPath,
                accessKey, secrateKey, endPoint} = this.state;
        return (
                <main>  
                    <div className="info-container">
                        {
                            errorMessage !== ""  ? <MessageBox id="mbox" message={errorMessage} activeTab={2}/> : null
                        }
                        {
                            successMessage !== ""  ? <MessageBox id="mbox" message={successMessage} activeTab={1}/> : null
                        }
                    </div>
                    <div className="mdflex modal-fwidth">
                        <div className="fwidth-modal-text">
                            <label className="gf-form-label b-0 bg-transparent">Cloud Service Provider<span style={{ color: 'red' }}> * </span></label>
                            <select onChange={this.onChange} value={cloudServiceProvider} name="cloudServiceProvider" id="cloudServiceProvider" className="gf-form-input">
                                <option key={""} value={""}>Select</option>
                                <option key={"AmazonS3"} value={"AmazonS3"}>Amazon S3</option>
                            </select>
                        </div>
                    </div>
                    
                    <label className="gf-form-label b-0 bg-transparent">Cloud Context Path</label>
                    <div style={{border:'1px solid black'}}>
                        
                        <div className="mdflex modal-fwidth">
                            <div className="fwidth-modal-text ">
                                <label className="gf-form-label b-0 bg-transparent">Ems Modules<span style={{ color: 'red' }}> * </span></label>
                                <select onChange={this.onChange} value={emsModules} name="emsModules" id="emsModules" className="gf-form-input">
                                    <option key={""} value={""}>Select</option>
                                    <option key={"admission"} value={"admission"}>Admission</option>
                                    <option key={"attendance"} value={"attendance"}>Attendance</option>
                                    <option key={"exam"} value={"exam"}>Exam</option>
                                    <option key={"library"} value={"library"}>Library</option>
                                    <option key={"preferences"} value={"preferences"}>Preferences</option>
                                    <option key={"student"} value={"student"}>Student</option>
                                    <option key={"transport"} value={"transport"}>Transport</option>
                                </select>
                            </div>
                            <div className="fwidth-modal-text">
                                <label className="gf-form-label b-0 bg-transparent">Context Path <span style={{ color: 'red' }}> * </span></label>
                                <input onChange={this.onChange} value={contextPath} type="text" className="gf-form-input" placeholder="admission/inquiry/documents" name="contextPath" id="contextPath" maxLength={2000} />
                            </div>
                            
                        </div>
                        <div className="mdflex modal-fwidth">
                            <div className="fwidth-modal-text">
                            <button type="button" id="btnSave" className="btn btn-primary border-bottom" onClick={this.save} >Save</button>
                            </div>
                        </div> 
                        
                    </div> 
                    
                    <label className="gf-form-label b-0 bg-transparent">Cloud Configurations</label>
                    <div style={{border:'1px solid black'}}>
                        <div className="mdflex modal-fwidth">
                            <div className="fwidth-modal-text ">
                                <label className="gf-form-label b-0 bg-transparent">Access Key<span style={{ color: 'red' }}> * </span></label>
                                <input onChange={this.onChange} value={accessKey} type="text" className="gf-form-input" placeholder="Access Key Id" name="accessKey" id="accessKey" maxLength={2000} />
                            </div>
                            <div className="fwidth-modal-text">
                                <label className="gf-form-label b-0 bg-transparent">Secrate Key <span style={{ color: 'red' }}> * </span></label>
                                <input onChange={this.onChange} value={secrateKey} type="text" className="gf-form-input" placeholder="Secrate Key" name="secrateKey" id="secrateKey" maxLength={2000} />
                            </div>
                        </div>
                        <div className="mdflex modal-fwidth">
                            <div className="fwidth-modal-text ">
                                <label className="gf-form-label b-0 bg-transparent">End Point<span style={{ color: 'red' }}> * </span></label>
                                <input onChange={this.onChange} value={endPoint} type="text" className="gf-form-input" placeholder="Cloud End Point URL" name="endPoint" id="endPoint" maxLength={2000} />
                            </div>
                        </div>
                        
                        <div className="mdflex modal-fwidth">
                            <div className="fwidth-modal-text">
                            <button type="button" id="btnSaveCloudConfig" className="btn btn-primary border-bottom" onClick={this.saveCloudConfig} >Save</button>
                            </div>
                        </div> 
                        
                    </div>    
                </main>
                
            );
        }
    
};

export default withApollo(CloudSetup)