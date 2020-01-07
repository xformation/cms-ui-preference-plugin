import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';
import { GET_BRANCH_LIST, SAVE_BRANCH } from '../../_queries';

export interface BranchProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    totalRecords?: number | string;
    type?: string;
    source?: string;
    sourceOfApplication?: string;
    stateList?: any;
    cityList?: any;
    originalCityList?: any;
}

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preferences service, branch could not be saved. Please check preferences service logs";
const SUCCESS_MESSAGE_BRANCH_ADDED = "New branch saved successfully";
const SUCCESS_MESSAGE_BRANCH_UPDATED = "Branch updated successfully";

class BranchGrid<T = {[data: string]: any}> extends React.Component<BranchProps, any> {
    constructor(props: BranchProps) {
        super(props);
        this.state = {
            list: this.props.data,
            totalRecords: this.props.totalRecords,
            type: this.props.type,
            isModalOpen: false,
            branchObj: {
                stateId: "",
                cityId: "",
                branchName: "",
                address: "",
                pinCode: "",
                branchHead: "",
                status: "",
            },
            errorMessage: "",
            successMessage: "",
            source: this.props.source,
            sourceOfApplication: this.props.sourceOfApplication,
            stateList: this.props.stateList,
            cityList: this.props.cityList,
            originalCityList: this.props.cityList,
            modelHeader: ""
        };
        
    }
    
    showDetail(e: any, bShow: boolean, branchObj: any, modelHeader: any) {
        e && e.preventDefault();
        this.filterCityList(branchObj.stateId);
        this.setState(() => ({
            isModalOpen: bShow,
            branchObj: branchObj,
            source: this.props.source,
            sourceOfApplication: this.props.sourceOfApplication,
            modelHeader: modelHeader,
            errorMessage: "",
            successMessage: "",
        }));
    }

    createRows(objAry: any) {
        const { source } = this.state;
        console.log("createRows() - Branch list on BranchGrid page:  ", objAry);
        if(objAry === undefined || objAry === null) {
            return;
        }
        const mutateResLength = objAry.length;
        const retVal = [];
        for (let i = 0; i < mutateResLength; i++) {
            const branchObj = objAry[i];
            retVal.push(
              <tr >
                <td>{branchObj.id}</td>
                <td>{branchObj.branchName}</td>
                <td>{branchObj.address}</td>
                <td>{branchObj.pinCode}</td>
                <td>{branchObj.branchHead}</td>
                <td>{branchObj.isMainBranch}</td>
                <td>{branchObj.status}</td>
                <td>
                    {
                        <button className="btn btn-primary" onClick={e => this.showDetail(e, true, branchObj, "Edit Branch")}>Edit</button>
                    }
                </td>
              </tr>
            );
        }
        return retVal;
    }
    showModal(e: any, bShow: boolean, headerLabel: any) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow,
            branchObj: {},
            modelHeader: headerLabel,
            cityList: this.state.originalCityList,
            errorMessage: "",
            successMessage: "",
        }));
    }

    // createSelectbox(data: any, value: any, key: any, label: any){
    //     let retData = [];
    //     if(data.length > 0){
    //         for(let i=0;i<data.length;i++){
    //             let item = data[i];
    //             retData.push(
    //                 <option value={item[value]} key={item[key]}>{item[label]}</option>
    //             );
    //         }
    //     }
    //     return retData;
    // }

    onChange = (e: any) => {
        e.preventDefault();
        const { name, value } = e.nativeEvent.target;
        const { branchObj, originalCityList } = this.state;
        
        this.setState({
            branchObj: {
                ...branchObj,
                [name]: value
            },
            errorMessage: "",
            successMessage: "",
        });
        if(name === "stateId"){
            this.filterCityList(value);
        }
        commonFunctions.restoreTextBoxBorderToNormal(name);
    }

    filterCityList(stateId: any){
        if(stateId === undefined || stateId === null || stateId === ""){
            this.setState({
                cityList: this.state.originalCityList
            });
            console.log("blank state id, returning original city list");
            return;
        }
        let tempCityList = [] ;
        this.setState({
            cityList: []
        }); 
        for(let i=0;i<this.state.originalCityList.length;i++){
            let item = this.state.originalCityList[i];
            console.log("Selected state id : ", stateId);
            if(item.state.id == stateId){
                console.log("state id : ",item.state.id);
                tempCityList.push(
                    item
                );
            }
        }
        this.setState({
            cityList: tempCityList
        });
    }

    validateFields(branchObj: any){
        let isValid = true;
        let errorMessage = ""
        if(branchObj.stateId === undefined || branchObj.stateId === null || branchObj.stateId === ""){
            // branchObj.stateId = "";
            commonFunctions.changeTextBoxBorderToError((branchObj.stateId === undefined || branchObj.stateId === null) ? "" : branchObj.stateId, "stateId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(branchObj.cityId === undefined || branchObj.cityId === null || branchObj.cityId === ""){
            // branchObj.cityId = "";
            commonFunctions.changeTextBoxBorderToError((branchObj.cityId === undefined || branchObj.cityId === null) ? "" : branchObj.cityId, "cityId");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(branchObj.branchName === undefined || branchObj.branchName === null || branchObj.branchName === ""){
            // branchObj.branchName = "";
            commonFunctions.changeTextBoxBorderToError((branchObj.branchName === undefined || branchObj.branchName === null) ? "" : branchObj.branchName, "branchName");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(branchObj.address === undefined || branchObj.address === null || branchObj.address === ""){
            // branchObj.address = "";
            commonFunctions.changeTextBoxBorderToError((branchObj.address === undefined || branchObj.address === null) ? "" : branchObj.address , "address");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        if(branchObj.status === undefined || branchObj.status === null || branchObj.status === ""){
            // branchObj.status = "";
            commonFunctions.changeTextBoxBorderToError((branchObj.status === undefined || branchObj.status === null) ? "" : branchObj.status, "status");
            errorMessage = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
            isValid = false;
        }
        this.setState({
            errorMessage: errorMessage
        });
        return isValid; 

    }

    getBranchInput(branchObj: any, modelHeader: any){
        let branchId = null;
        if(modelHeader === "Edit Branch"){
            branchId = branchObj.id;
        }
        let branchInput = {
            id: branchId,
            branchName: branchObj.branchName,
            address: branchObj.address,
            pinCode: branchObj.pinCode,
            branchHead: branchObj.branchHead,
            status: branchObj.status,
            stateId: branchObj.stateId,
            cityId: branchObj.cityId
        };
        return branchInput;
    }
    
    async doSave(branchInput: any, id: any){
        let btn = document.querySelector("#"+id);
        btn && btn.setAttribute("disabled", "true");
        let exitCode = 0;
        
        await this.props.client.mutate({
            mutation: SAVE_BRANCH,
            variables: { 
                input: branchInput
            },
            // fetchPolicy: 'cache-and-network'
        }).then((resp: any) => {
            console.log("Success in saveBranch Mutation. Exit code : ",resp.data.saveBranch.cmsBranchVo.exitCode);
            exitCode = resp.data.saveBranch.cmsBranchVo.exitCode;
            let temp = resp.data.saveBranch.cmsBranchVo.dataList; 
            console.log("New branch list : ", temp);
            this.setState({
                list: temp
            });
        }).catch((error: any) => {
            exitCode = 1;
            console.log('Error in saveBranch : ', error);
        });
        btn && btn.removeAttribute("disabled");
        
        let errorMessage = "";
        let successMessage = "";
        if(exitCode === 0 ){
            successMessage = SUCCESS_MESSAGE_BRANCH_ADDED;
            if(branchInput.id !== null){
                successMessage = SUCCESS_MESSAGE_BRANCH_UPDATED;
            }
        }else {
            errorMessage = ERROR_MESSAGE_SERVER_SIDE_ERROR;
        }
        this.setState({
            successMessage: successMessage,
            errorMessage: errorMessage
        });
        
    }

    async getBranchList (e: any){
        console.log("Refreshing branch list");
        const { data } =  await this.props.client.query({
            query: GET_BRANCH_LIST,
            fetchPolicy: 'no-cache'
        })
        const temp = data.getBranchList;
        this.setState({
            list: temp
        });
    }

    saveBranch = (e: any) => {
        const { id } = e.nativeEvent.target;
        const {branchObj, modelHeader} = this.state;
        let isValid = this.validateFields(branchObj);
        if(isValid === false){
            return;
        }
        const branchInput = this.getBranchInput(branchObj, modelHeader);
        this.doSave(branchInput, id);
        // this.setState({
        //     list: {}
        // });
        // this.getBranchList();
        
    }

    render() {
        const {list, isModalOpen, branchObj, stateList, cityList, modelHeader, errorMessage, successMessage} = this.state;
        return (
            <main>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                    <ModalHeader>{modelHeader}</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
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
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">State <span style={{ color: 'red' }}> * </span></label>
                                        <select className="gf-form-input" name="stateId" id="stateId"  onChange={this.onChange} value={branchObj.stateId}>
                                            <option value="">Select State</option>
                                                {
                                                    commonFunctions.createSelectbox(stateList, "id", "id", "stateName")
                                                }
                                        </select>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">City <span style={{ color: 'red' }}> * </span></label>
                                        <select className="gf-form-input" name="cityId" id="cityId" onChange={this.onChange} value={branchObj.cityId}>
                                            <option value="">Select City</option>
                                                {
                                                    commonFunctions.createSelectbox(cityList, "id", "id", "cityName")
                                                }
                                        </select>
                                    </div>
                                </div>
                                <div className="fwidth-modal-text modal-fwidth">
                                    <label className="gf-form-label b-0 bg-transparent">Branch Name <span style={{ color: 'red' }}> * </span></label>
                                    <input type="text" className="gf-form-input " onChange={this.onChange}  value={branchObj.branchName} placeholder="branch name" name="branchName" id="branchName" maxLength={255} />
                                </div>

                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Address <span style={{ color: 'red' }}> * </span></label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={branchObj.address} placeholder="address" name="address" id="address" maxLength={255}  />
                                    </div>
                                {/* </div>
                                <div className="mdflex modal-fwidth"> */}
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">PIN/ZIP Code</label>
                                        <input type="text" className="gf-form-input" onChange={this.onChange}  value={branchObj.pinCode} placeholder="pin code" name="pinCode" id="pinCode" maxLength={255}  />
                                    </div>
                                </div>
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">Branch Head</label>
                                        <input type="text" required className="gf-form-input" onChange={this.onChange}  value={branchObj.branchHead} placeholder="branch head" name="branchHead" id="branchHead" maxLength={255}/>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">Status<span style={{ color: 'red' }}> * </span></label>
                                        <select name="status" id="status" onChange={this.onChange} value={branchObj.status} className="gf-form-input">
                                            <option key={""} value={""}>Select Status</option>
                                            <option key={"ACTIVE"} value={"ACTIVE"}>ACTIVE</option>
                                            <option key={"DEACTIVE"} value={"DEACTIVE"}>DEACTIVE</option>
                                            <option key={"DRAFT"} value={"DRAFT"}>DRAFT</option>
                                        </select>
                                    </div> 
                                </div>
                                <div className="m-t-1 text-center">
                                    {
                                        modelHeader === "Add New Branch" ?
                                        <button type="button" id="btnAdd" className="btn btn-primary border-bottom" onClick={this.saveBranch} >Save</button>
                                        :
                                        <button type="button" id="btnUpdate" className="btn btn-primary border-bottom" onClick={this.saveBranch}>Update</button>
                                    }
                                    &nbsp;<button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false, modelHeader)}>Cancel</button>
                                    
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <button className="btn btn-primary" style={{width:'150px'}} onClick={e => this.showModal(e, true, "Add New Branch")}>
                    <i className="fa fa-plus-circle"></i> Add new Branch
                </button>
                {
                    list !== null && list !== undefined && list.length > 0 ?
                        <div style={{width:'100%', height:'250px', overflow:'auto'}}>
                            <table id="branchTable" className="striped-table fwidth bg-white p-2 m-t-1">
                                <thead>
                                    <tr>
                                        <th>Id</th>
                                        <th>Branch Name</th>
                                        <th>Address</th>
                                        <th>Pin/Zip Code</th>
                                        <th>Branch Head</th>
                                        <th>Main Branch</th>
                                        <th>Status</th>
                                        <th>Edit</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { this.createRows(list) }
                                </tbody>
                            </table>
                        </div>
                    : null
                }
                
            </main>
        );
    }
}

export default withApollo(BranchGrid);