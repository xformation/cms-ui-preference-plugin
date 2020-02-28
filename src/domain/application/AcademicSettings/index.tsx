import * as React from 'react';
import { withApollo } from 'react-apollo';
// import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { GET_BRANCH_LIST, GET_ACADEMIC_YEAR_LIST, GET_HOLIDAY_LIST, GET_TERM_LIST, GET_DEPARTMENT_LIST, GET_COURSE_LIST, 
    GET_STAFF_LIST, GET_SUBJECT_LIST,GET_BATCH_LIST,GET_SECTION_LIST } from '../_queries';
import wsCmsBackendServiceSingletonClient from '../../../wsCmsBackendServiceClient';
// import { CalendarSetup } from './CalendarSetup';
import  TimeTable  from './timetable';
import AcademicYear from './academicyear/AcademicYear';
import Holiday from './holiday/Holiday';
import Term from './term/Term';
import Department from './department/Department';
import Course from './course/Course';
import Staff from './staff/Staff';
import Subject from './subject/Subject';

export interface AcademicSettingsProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any,
}

class AcademicSettings extends React.Component<AcademicSettingsProps, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            activeTab: 0,
            user: this.props.user,
            branchList: null,
            ayList: null,
            holidayList: null,
            termList: null,
            departmentList: null,
            courseList: null,
            branchId: null,
            academicYearId: null,
            departmentId: null,
            staffList: null,
            batchList: null,
            sectionList: null,
        };
        this.toggleTab = this.toggleTab.bind(this);
        this.getBranchList = this.getBranchList.bind(this);
        this.getAcademicYearList = this.getAcademicYearList.bind(this);
        this.getHolidayList = this.getHolidayList.bind(this);
        this.getTermList = this.getTermList.bind(this);
        this.getDepartmentList = this.getDepartmentList.bind(this);
        this.getCourseList = this.getCourseList.bind(this);
        this.updateAyList = this.updateAyList.bind(this);
        this.registerSocket = this.registerSocket.bind(this);
        this.getStaffList = this.getStaffList.bind(this);
        this.getSubjectList = this.getSubjectList.bind(this);
        this.getBatchList = this.getBatchList.bind(this);
        this.getSectionList = this.getSectionList.bind(this);
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
        await this.registerSocket();
        await this.getAcademicYearList();
        await this.getBranchList();
        await this.getDepartmentList();
        await this.getHolidayList();
        await this.getTermList();
        await this.getStaffList();
        await this.getSubjectList();
        await this.getBatchList();
        await this.getSectionList();
    }

    registerSocket() {
        const socket = wsCmsBackendServiceSingletonClient.getInstance();
    
        socket.onmessage = (response: any) => {
            let message = JSON.parse(response.data);
            console.log("AcademicSettings Index. message received from server ::: ", message);
            this.setState({
                branchId: message.selectedBranchId,
                academicYearId: message.selectedAcademicYearId,
                departmentId: message.selectedDepartmentId,
            });
            console.log("AcademicSettings Index. branchId: ",this.state.branchId);
            console.log("AcademicSettings Index. ayId: ",this.state.academicYearId);  
        }
    
        socket.onopen = () => {
            console.log("AcademicSettings Index. Opening websocekt connection to cmsbackend. User : ",this.state.user.login);
            socket.send(this.state.user.login);
        }
    
        window.onbeforeunload = () => {
            console.log("Staff. Closing websocket connection with cms backend service");
        }
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
        if(tabNo === 3 ){
            this.getDepartmentList();
        }
        if(tabNo === 4 ){
            this.getCourseList();
        }
        if(tabNo === 5 ){
            this.getStaffList();
        }
        if(tabNo === 6 ){
            this.getSubjectList();
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

    async getBranchList(){
        const { data } = await this.props.client.query({
            query: GET_BRANCH_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            branchList: data.getBranchList
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

    async getDepartmentList(){
        const { data } = await this.props.client.query({
            query: GET_DEPARTMENT_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            departmentList: data
        });
    }

    async getCourseList(){
        const { data } = await this.props.client.query({
            query: GET_COURSE_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            courseList: data.getCourseList
        });

    }

    async getStaffList(){
        // const {branchId, departmentId, academicYearId} = this.state;
        const { data } = await this.props.client.query({
            query: GET_STAFF_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            staffList: data.getTeacherList
        });
        console.log("getStaffList() : ", this.state.staffList);
    }

    async getSubjectList(){
        const { data } = await this.props.client.query({
            query: GET_SUBJECT_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            subjectList: data.getSubjectList
        });
        console.log("getSubjectList() : ", this.state.subjectList);
    }

    async getBatchList(){
        const { data } = await this.props.client.query({
            query: GET_BATCH_LIST,
             fetchPolicy: 'no-cache'
        })
        this.setState({
            batchList: data.getBatchList
        });
        console.log("getBatchList() : ", this.state.batchList);
    }

    async getSectionList(){
        const { data } = await this.props.client.query({
            query: GET_SECTION_LIST,
             fetchPolicy: 'no-cache'
        })

        this.setState({
            sectionList: data.getSectionList
        });
        console.log("getSectionList() : ", this.state.sectionList);
    }
    
    render() {
        const { activeTab, user, branchList, ayList, courseList, holidayList, termList, departmentList, staffList, subjectList, batchList, sectionList } = this.state;
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
                            Course Setup
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
                            null
                        }
                    </TabPane>
                    <TabPane tabId={1}>
                        {
                            ayList !== null && holidayList !== null ?
                                <Holiday holidayList={holidayList.getHolidayList} ayList={ayList}></Holiday>
                            :
                            null
                        }
                    </TabPane>
                    <TabPane tabId={2}>
                        {
                            ayList !== null && termList !== null ?
                                <Term termList={termList.getTermList} ayList={ayList}></Term>
                            :
                            null
                        }
                    </TabPane>
                    <TabPane tabId={3}>
                        {
                            branchList !== null && ayList !== null && departmentList !== null && (
                                <Department branchList={branchList} ayList={ayList} departmentList={departmentList.getDepartmentList} ></Department>
                            )
                        }
                    </TabPane>
                    <TabPane tabId={4}>
                        {
                            courseList !== null && branchList !== null && departmentList !== null && (
                                <Course branchList={branchList} courseList={courseList} departmentList={departmentList.getDepartmentList} ></Course>
                            )
                        }
                    </TabPane>
                    <TabPane tabId={5}>
                        {
                            user !== null && staffList !== null && (
                                <Staff user={user} staffList={staffList} ></Staff>
                            )
                        }
                        
                    </TabPane>
                    <TabPane tabId={6}>
                        {
                            user !== null && sectionList !== null && subjectList !== null && staffList !== null && batchList !== null && (
                                <Subject user={user} sectionList={sectionList} teacherList={staffList} subjectList={subjectList} batchList={batchList} ></Subject>
                            )
                        }
                    </TabPane>
                    <TabPane tabId={7}>
                        {
                            user !== null && sectionList !== null && termList !== null && batchList !== null && (
                                <TimeTable user={user} sectionList={sectionList} termList={termList.getTermList} batchList={batchList} teacherList={staffList} subjectList={subjectList}></TimeTable>
                            )
                        }
                    </TabPane>
                </TabContent>
            </section>

        );
    }
}

export default withApollo(AcademicSettings)