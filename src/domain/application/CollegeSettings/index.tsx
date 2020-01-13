import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';

import '../../../css/college-settings.css';
import CollegeInfo  from './college/AddCollegePage/CollegeInfo';
import BranchGrid from './branch/BranchGrid';
import {LegalEntities} from './legalentity/LegalEntities';
import { withApollo } from 'react-apollo';
import { GET_BRANCH_LIST, GET_STATE_LIST, GET_CITY_LIST, GET_AUTHORIZED_SIGNATORY_LIST, GET_BANK_ACCOUNTS_LIST, GET_LEGAL_ENTITY_LIST } from '../_queries';

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
            legalEntityList: null
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getBranchList = this.getBranchList.bind(this);
        this.updateBranchListAfterCollegeUpdate = this.updateBranchListAfterCollegeUpdate.bind(this);
        this.getStateList = this.getStateList.bind(this);
        this.getCityList = this.getCityList.bind(this);
        this.getAuthorizedSignatoryList = this.getAuthorizedSignatoryList.bind(this);
        this.getBankAccountsList = this.getBankAccountsList.bind(this);
        this.getLegalEntityList = this.getLegalEntityList.bind(this);
    }

    async componentDidMount(){
        await this.getStateList();
        await this.getCityList();
    }

    async toggleTab (tabNo: any) {
        // this.setState({
        //     branchList: null,
        //     activeTab: tabNo,            
        // });
        // let bid = 34; 
        // let aid = 56; 
        
        if(tabNo === 1 ){
            this.getBranchList();
        }else if(tabNo === 2){
            this.getBranchList();
            this.getAuthorizedSignatoryList();
            this.getBankAccountsList();
            this.getLegalEntityList();
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

    render() {
        const { activeTab, branchList, stateDataList, cityDataList, authorizedSignatoryList, bankAccountsList, legalEntityList } = this.state;
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
                    <TabPane tabId={0}>
                        <CollegeInfo onSaveUpdate={this.updateBranchListAfterCollegeUpdate}/>
                    </TabPane>
                    <TabPane tabId={1}>
                        {
                            branchList !== null && stateDataList !== null && cityDataList !== null && (
                                <BranchGrid data={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList} />
                            ) 
                        }
                    </TabPane>
                    <TabPane tabId={2}>
                        {
                            legalEntityList !== null && bankAccountsList !== null && authorizedSignatoryList !==null && branchList !== null && stateDataList !== null && cityDataList !== null && (
                                <LegalEntities legalEntityList={legalEntityList.getLegalEntityList} signatoryList={authorizedSignatoryList.getAuthorizedSignatoryList} bankAccountsList={bankAccountsList.getBankAccountsList} branchList={branchList} stateList={stateDataList.getStateList} cityList={this.state.cityDataList.getCityList}></LegalEntities>
                            )
                        }
                    </TabPane>
                    <TabPane tabId={3}>
                        Test
                    </TabPane>
                    <TabPane tabId={4}>
                        Test
                    </TabPane>
                </TabContent>
            </section>
        );
    }
};

export default withApollo(CollegeSettings)