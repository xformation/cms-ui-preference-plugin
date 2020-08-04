import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import '../../../css/college-settings.css';
import CollegeInfo  from './college/AddCollegePage/CollegeInfo';
import BranchGrid from './branch/BranchGrid';
import {LegalEntities} from './legalentity/LegalEntities';
import MasterDataImport from './import/MasterDataImport';
import PaymentInput from './payment/PaymentInput';
import CloudSetup from './cloudconfig/CloudSetup';
import DataGeneratorInput from './DataGenerator/DataGeneratorInput'

import { withApollo } from 'react-apollo';
import { GET_BRANCH_LIST, GET_STATE_LIST, GET_CITY_LIST, GET_AUTHORIZED_SIGNATORY_LIST, GET_BANK_ACCOUNTS_LIST, GET_LEGAL_ENTITY_LIST,
            GET_TABLE_LIST, GET_CLOUD_CONTEXT_PATH_LIST } from '../_queries';
import {UserAgentApplication} from 'msal';
import {azureConfig} from '../../../azureConfig';
import axios from 'axios'; 
import { jcrSettingsServices } from '../_services/jcrSettings.service';
import {config} from '../config';

export interface AcademicSettingsProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    permissions?: any;
    user?: any,
    userAgentApplication?: UserAgentApplication; 
    azureUser?: any;
    accessToken?:any;
    mcCloudParentId?: any;
}
class CollegeSettings extends React.Component<any, any> {
    LOGGED_IN_USER = new URLSearchParams(location.search).get("signedInUser");
    constructor(props: any) {
        super(props);
        this.state = {
            permissions: this.props.permissions,
            activeTab: 0,
            branchList: null,
            stateDataList: null,
            cityDataList: null,
            authorizedSignatoryList: null,
            bankAccountsList: null,
            legalEntityList: null,
            tableList: null,
            cloudContextPathList: null,
            userAgentApplication: this.props.userAgentApplication,
            azureUser: this.props.azureUser,
            accessToken: this.props.accessToken,
            mcCloudParentId: this.props.mcCloudParentId,
            txnRefNo: null,
            txnStatus: null,
            txnDate: null,
            txnAmt: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getBranchList = this.getBranchList.bind(this);
        this.updateBranchListAfterCollegeUpdate = this.updateBranchListAfterCollegeUpdate.bind(this);
        this.getStateList = this.getStateList.bind(this);
        this.getCityList = this.getCityList.bind(this);
        this.getAuthorizedSignatoryList = this.getAuthorizedSignatoryList.bind(this);
        this.getBankAccountsList = this.getBankAccountsList.bind(this);
        this.getLegalEntityList = this.getLegalEntityList.bind(this);
        this.getTableList = this.getTableList.bind(this);
        this.setPaymentPageActive = this.setPaymentPageActive.bind(this);
        this.getCloudContextPathList = this.getCloudContextPathList.bind(this);
    }

    async componentDidMount(){
        const tRefNo =  new URLSearchParams(location.search).get('txnRefNo');
        if(tRefNo !== null && tRefNo !== undefined && tRefNo !== ""){
            this.setPaymentPageActive();  
        }
        await this.getStateList();
        await this.getCityList();
        await this.getTableList();
    }

    async setPaymentPageActive(){
        this.setState({
            activeTab: 4,
        });
    }

    async toggleTab (tabNo: any) {
        if(tabNo === 1 ){
            this.getBranchList();
        }else if(tabNo === 2){
            this.getBranchList();
            this.getAuthorizedSignatoryList();
            this.getBankAccountsList();
            this.getLegalEntityList();
        }else if(tabNo === 3){
            this.getTableList();
        }else if(tabNo === 5){
            this.getCloudContextPathList(config.CMS_GET_CLOUD_CONTEXT_PATH);
        }
        const params = new URLSearchParams(location.search);
        if(params.get("txnRefNo") !== null){
            console.log("Updating query params $$$$$$$$$$$$$$$$$$$$$$$$$$$");
            params.delete("txnRefNo");
            params.delete("txnStatus");
            params.delete("txnDate");
            params.delete("txnAmt");
            let sUser = sessionStorage.getItem("signedInUser");
            console.log("1. user before ::::: ", sUser);
            if(sUser !== null ){
                console.log("2. user after ::::: ", sUser);
                params.set("signedInUser", sUser) ;
                sessionStorage.removeItem("signedInUser");
                window.history.replaceState({}, '', `${location.pathname}?${params}`);
            }
        }

        this.setState({
            activeTab: tabNo,
        });
    }

    async getBranchList(){
        console.log("Branch list set null to fetch data again. Branch list : ", this.state.branchList);
        const { data } = await this.props.client.query({
            query: GET_BRANCH_LIST,
             fetchPolicy: 'no-cache'
        })
        
        this.setState({
            branchList: data.getBranchList
        });
    }

    updateBranchListAfterCollegeUpdate(newBranchList: any) {
        console.log("Branch list from CollegeInfo child :: ", newBranchList);
        this.setState({
            branchList: null
        });
        console.log("branch list cache cleared. Branch list : ",this.state.branchList);
        this.setState({
            branchList: newBranchList
        });
    }

    async getStateList(){
        const { data } = await this.props.client.query({
            query: GET_STATE_LIST,
            fetchPolicy: 'no-cache'
        })
        this.setState({
            stateDataList: data
        });
    }

    async getCityList(){
        const { data } = await this.props.client.query({
            query: GET_CITY_LIST,
            fetchPolicy: 'no-cache'
        })
        this.setState({
            cityDataList: data
        });
    }

    async getAuthorizedSignatoryList(){
        const { data } = await this.props.client.query({
            query: GET_AUTHORIZED_SIGNATORY_LIST,
             fetchPolicy: 'no-cache'
        })
        
        this.setState({
            authorizedSignatoryList: data
        });
    }

    async getBankAccountsList(){
        const { data } = await this.props.client.query({
            query: GET_BANK_ACCOUNTS_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            bankAccountsList: data
        });
    }

    async getLegalEntityList(){
        const { data } = await this.props.client.query({
            query: GET_LEGAL_ENTITY_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            legalEntityList: data
        });
    }

    async getTableList(){
        const { data } = await this.props.client.query({
            query: GET_TABLE_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            tableList : data
        });
    }

    async getCloudContextPathList(url: any){
        // const { data } = await this.props.client.query({
        //     query: GET_CLOUD_CONTEXT_PATH_LIST,
        //      fetchPolicy: 'no-cache'
        // })
        // this.setState({
        //     cloudContextPathList : data
        // });
        // console.log("cloud context path list : ",data);
        await jcrSettingsServices.getCloudInfoList(url).then(
            response => {
              this.setState({
                  cloudContextPathList: response,
              });
            }
        );
    }

    

    render() {
        const { permissions, activeTab, branchList, stateDataList, cityDataList, authorizedSignatoryList, bankAccountsList, legalEntityList, 
                    tableList, mcCloudParentId, accessToken, userAgentApplication, cloudContextPathList } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["College Setup"] === "College Setup" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                                    College Setup
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                                    College Setup
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Branch Setup"] === "Branch Setup" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                                    Branch Setup
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                                    Branch Setup
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Legal Entities"] === "Legal Entities" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                                    Legal Entities
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                                    Legal Entities
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Master Data Import"] === "Master Data Import" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                                    Master Data Import
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                                    Master Data Import
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Payment"] === "Payment" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 4 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(4); }} >
                                    Payment
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 4 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(4); }} >
                                    Payment
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Cloud Setup"] === "Cloud Setup" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 5 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(5); }} >
                                    Cloud Setup
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 5 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(5); }} >
                                    Cloud Setup
                                </NavLink>
                            </NavItem>
                        : null
                    }
                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Cloud Setup"] === "Cloud Setup" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 6 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(6); }} >
                                    Cloud Setup
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 6 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(6); }} >
                                    Custom Data Generator
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {/* {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Cloud Setup"] === "Cloud Setup" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 6 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(6); }} >
                                    Cloud Setup
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 6 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(6); }} >
                                    Cloud Setup
                                </NavLink>
                            </NavItem>
                        : null
                    } */}
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["College Setup"] === "College Setup" ?
                            <TabPane tabId={0}>
                                {
                                    activeTab === 0 ?
                                        <CollegeInfo onSaveUpdate={this.updateBranchListAfterCollegeUpdate}/>
                                    : null
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={0}>
                                {
                                    activeTab === 0 ?
                                        <CollegeInfo onSaveUpdate={this.updateBranchListAfterCollegeUpdate}/>
                                    : null
                                }
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Branch Setup"] === "Branch Setup" ?
                            <TabPane tabId={1}>
                                {
                                    activeTab === 1 ?
                                    (
                                        branchList !== null && stateDataList !== null && cityDataList !== null && (
                                            <BranchGrid data={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList} />
                                        )
                                    )
                                    : null            
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={1}>
                                {
                                    activeTab === 1 ?
                                    (
                                        branchList !== null && stateDataList !== null && cityDataList !== null && (
                                            <BranchGrid data={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList} />
                                        )
                                    )
                                    : null            
                                }
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Legal Entities"] === "Legal Entities" ?
                            <TabPane tabId={2}>
                                {   
                                    activeTab === 2 ?
                                    (
                                        legalEntityList !== null && bankAccountsList !== null && authorizedSignatoryList !==null && branchList !== null && stateDataList !== null && cityDataList !== null && (
                                            <LegalEntities legalEntityList={legalEntityList.getLegalEntityList} signatoryList={authorizedSignatoryList.getAuthorizedSignatoryList} bankAccountsList={bankAccountsList.getBankAccountsList} branchList={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList}></LegalEntities>
                                        )
                                    )
                                    : null
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={2}>
                                {   
                                    activeTab === 2 ?
                                    (
                                        legalEntityList !== null && bankAccountsList !== null && authorizedSignatoryList !==null && branchList !== null && stateDataList !== null && cityDataList !== null && (
                                            <LegalEntities legalEntityList={legalEntityList.getLegalEntityList} signatoryList={authorizedSignatoryList.getAuthorizedSignatoryList} bankAccountsList={bankAccountsList.getBankAccountsList} branchList={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList}></LegalEntities>
                                        )
                                    )
                                    : null
                                }
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Master Data Import"] === "Master Data Import" ?
                            <TabPane tabId={3}>
                                {
                                    activeTab === 3 ?
                                    (
                                        tableList !== null && (
                                            <MasterDataImport tableList={tableList.getTableList}/>
                                        )
                                    )
                                    : null  
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={3}>
                                {
                                    activeTab === 3 ?
                                    (
                                        tableList !== null && (
                                            <MasterDataImport tableList={tableList.getTableList}/>
                                        )
                                    )
                                    : null  
                                }
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Payment"] === "Payment" ?                            
                            <TabPane tabId={4}>
                                {
                                    activeTab === 4 ?  
                                        <PaymentInput />
                                    : null
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={4}>
                                {
                                    activeTab === 4 ?  
                                        <PaymentInput />
                                    : null
                                }
                            </TabPane>
                        : null
                         
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Cloud Setup"] === "Cloud Setup" ? 
                            <TabPane tabId={5}>
                                {
                                    activeTab === 5 ?
                                    (
                                        cloudContextPathList !== null && (
                                            <CloudSetup ctxList={cloudContextPathList}/>
                                        )
                                    )
                                    : null  
                                }
                                
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={5}>
                                {
                                    activeTab === 5 ?
                                    (
                                        cloudContextPathList !== null && (
                                            <CloudSetup ctxList={cloudContextPathList}/>
                                        )
                                    )
                                    : null  
                                }
                            </TabPane>
                        : null
                    }
                    
                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["College Setup"] === "College Setup" ?
                            <TabPane tabId={6}>
                                {
                                    activeTab === 6 ?
                                        <DataGeneratorInput/>
                                    : null
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={6}>
                                {
                                    activeTab === 6 ?
                                        <DataGeneratorInput/>
                                    : null
                                }
                            </TabPane>
                        : null
                    }
                    {/* {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Cloud Setup"] === "Cloud Setup" ?                            
                            <TabPane tabId={6}>
                                {
                                    // activeTab === 6 ?  <CloudSetup ctxList={cloudContextPathList.getCloudContextPathList}/> : null
                                    cloudContextPathList !== null && (
                                        <CloudSetup ctxList={cloudContextPathList.getCloudContextPathList}/>
                                    )
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={6}>
                                {
                                    activeTab === 6 ? <CloudSetup ctxList={cloudContextPathList.getCloudContextPathList}/> : null
                                }
                            </TabPane>
                        : null
                    } */}
                </TabContent>
            </section>
        );
    }
};

export default withApollo(CollegeSettings)