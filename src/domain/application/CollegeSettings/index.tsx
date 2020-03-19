import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import '../../../css/college-settings.css';
import CollegeInfo  from './college/AddCollegePage/CollegeInfo';
import BranchGrid from './branch/BranchGrid';
import {LegalEntities} from './legalentity/LegalEntities';
import MasterDataImport from './import/MasterDataImport';
import PaymentInput from './payment/PaymentInput';
import { withApollo } from 'react-apollo';
import { GET_BRANCH_LIST, GET_STATE_LIST, GET_CITY_LIST, GET_AUTHORIZED_SIGNATORY_LIST, GET_BANK_ACCOUNTS_LIST, GET_LEGAL_ENTITY_LIST,
            GET_TABLE_LIST } from '../_queries';
import {UserAgentApplication} from 'msal';
import {azureConfig} from '../../../azureConfig';
import axios from 'axios'; 

export interface AcademicSettingsProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any,
    userAgentApplication?: UserAgentApplication; 
    azureUser?: any;
    accessToken?:any;
    mcCloudParentId?: any;
}
class CollegeSettings extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: 0,
            branchList: null,
            stateDataList: null,
            cityDataList: null,
            authorizedSignatoryList: null,
            bankAccountsList: null,
            legalEntityList: null,
            tableList: null,
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

    render() {
        const { activeTab, branchList, stateDataList, cityDataList, authorizedSignatoryList, bankAccountsList, legalEntityList, 
                    tableList, mcCloudParentId, accessToken, userAgentApplication } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                            College Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                            Branch Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                            Legal Entities
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                            Master Data Import
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 4 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(4); }} >
                            Payment
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                    {
                        activeTab === 0 ?
                            <TabPane tabId={0}>
                                <CollegeInfo onSaveUpdate={this.updateBranchListAfterCollegeUpdate}/>
                            </TabPane>
                        : null
                    }
                    
                    {
                        activeTab === 1 ?
                            <TabPane tabId={1}>
                                {
                                    branchList !== null && stateDataList !== null && cityDataList !== null && (
                                        <BranchGrid data={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList} />
                                    ) 
                                }
                            </TabPane>
                        : null
                    }
                    
                    {
                        activeTab === 2 ?
                            <TabPane tabId={2}>
                                {
                                    legalEntityList !== null && bankAccountsList !== null && authorizedSignatoryList !==null && branchList !== null && stateDataList !== null && cityDataList !== null && (
                                        <LegalEntities legalEntityList={legalEntityList.getLegalEntityList} signatoryList={authorizedSignatoryList.getAuthorizedSignatoryList} bankAccountsList={bankAccountsList.getBankAccountsList} branchList={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList}></LegalEntities>
                                    )
                                }
                            </TabPane>
                        : null
                    }
                    
                    {
                        activeTab === 3 ?
                            <TabPane tabId={3}>
                                {
                                    tableList !== null && (
                                		<MasterDataImport tableList={tableList.getTableList}/>
                            		)
                                }
                            </TabPane>
                        : null  
                    }
                    
                    {
                        activeTab === 4 ?  
                            <TabPane tabId={4}>
                                <PaymentInput />
                            </TabPane>
                        : null
                    }
                    
                </TabContent>
            </section>
        );
    }
};

export default withApollo(CollegeSettings)