import * as React from 'react';
import { graphql, QueryProps, MutationFunc, compose, withApollo } from 'react-apollo';
// import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { GET_ACADEMIC_YEAR_LIST, GET_HOLIDAY_LIST, GET_TERM_LIST } from '../_queries';

import { CalendarSetup } from './CalendarSetup';
import AcademicYear from './academicyear/AcademicYear';
import Holiday from './holiday/Holiday';
import Term from './term/Term';

class AcademicSettings extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: 0,
            ayList: null,
            holidayList: null,
            termList: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getAcademicYearList = this.getAcademicYearList.bind(this);
        this.getHolidayList = this.getHolidayList.bind(this);
        this.getTermList = this.getTermList.bind(this);
        this.updateAyList = this.updateAyList.bind(this);
    }

    updateAyList(newAyList: any) {
        console.log("Update AcademicYear list from child : ", newAyList);
        // to clear the cache, setting the academic year list as null before assigning new list 
        this.setState({
            ayList: null
        });
        this.setState({
          ayList: newAyList
        });
    }

    async componentDidMount(){
        await this.getAcademicYearList();
    }

    toggleTab(tabNo: any) {
        if(tabNo === 0 ){
            this.getAcademicYearList();
        }
        if(tabNo === 1 ){
            this.getHolidayList();
        }
        if(tabNo === 2 ){
            this.getTermList();
        }
        this.setState({
            activeTab: tabNo,
        });
    }

    async getAcademicYearList(){
        const { data } = await this.props.client.query({
            query: GET_ACADEMIC_YEAR_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            ayList: data.getAcademicYearList
        });
    }

    async getHolidayList(){
        const { data } = await this.props.client.query({
            query: GET_HOLIDAY_LIST,
             fetchPolicy: 'no-cache'
        })
        
        this.setState({
            holidayList: data
        });
    }

    async getTermList(){
        const { data } = await this.props.client.query({
            query: GET_TERM_LIST,
             fetchPolicy: 'no-cache'
        })
        
        this.setState({
            termList: data
        });
    }

    render() {
        const { activeTab, ayList, holidayList, termList } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                            Academic Year Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                            Holiday Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                            Term Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                            Department Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 4 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(4); }} >
                            Courses
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 5 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(5); }} >
                            Staff Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 6 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(6); }} >
                            Subject Setup
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 7 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(7); }} >
                            Timetable Setup
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                    <TabPane tabId={0}>
                        {
                            ayList !== null ?
                                <AcademicYear ayList={ayList} onSaveUpdate={this.updateAyList}></AcademicYear>
                            :
                            "No Record Found"
                        }
                    </TabPane>
                    <TabPane tabId={1}>
                        {
                            ayList !== null && holidayList !== null ?
                                <Holiday holidayList={holidayList.getHolidayList} ayList={ayList}></Holiday>
                            :
                            "No Record Found"
                        }
                    </TabPane>
                    <TabPane tabId={2}>
                        {
                            ayList !== null && termList !== null ?
                                <Term termList={termList.getTermList} ayList={ayList}></Term>
                            :
                            "No Record Found"
                        }
                    </TabPane>
                    <TabPane tabId={3}>
                        Test
                    </TabPane>
                    <TabPane tabId={4}>
                        Test
                    </TabPane>
                    <TabPane tabId={5}>
                        Test
                    </TabPane>
                    <TabPane tabId={6}>
                        Test
                    </TabPane>
                    <TabPane tabId={7}>
                        <CalendarSetup />
                    </TabPane>
                </TabContent>
            </section>
        );
    }
}

export default withApollo(AcademicSettings)