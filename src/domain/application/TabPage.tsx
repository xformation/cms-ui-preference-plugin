import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import CollegeSettings from './CollegeSettings';
import AcademicSettings from './AcademicSettings';
import RolesPermission from './RolesPermission';
import {config} from './config';
import axios from 'axios'; 
import { commonFunctions } from './_utilites/common.functions';
import { rbacSettingsServices } from './_services/rbacSettings.service';

export default class TabPage extends React.Component<any, any> {
  LOGGED_IN_USER = new URLSearchParams(location.search).get('signedInUser');
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
      permissions: [],
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.getUserPermissions = this.getUserPermissions.bind(this);
  }

  async componentDidMount(){
    await this.getUserPermissions();
  }

  async getUserPermissions(){
    if(this.LOGGED_IN_USER !== 'admin'){
      await rbacSettingsServices.getUserPermission(this.LOGGED_IN_USER).then(
        response => {
          const lg: any = response["loginResponse"];
          const auth: any = lg["authz"];
          const perm: any = auth["permissions"];
          const arr: any = [];
          perm.map((item: any) =>{
            arr[item] = item;
          });
          this.setState({
            permissions: arr,
          });
          console.log("PERMISSION ::::: ",arr[config.LABEL_COLLEGE_SETTINGS]);
        }
      )
    }
    
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const {activeTab, user, permissions} = this.state;
    return (
      <section className="tab-container">
        <div>
          {/* <img src="../../img/students.png" alt="" /> */}
          <h5>
          </h5>
        </div>
        <Nav tabs className="pl-3 pl-3 mb-4 mt-4 bottom-box-shadow">
          
          {
            this.LOGGED_IN_USER !== 'admin' && permissions[config.LABEL_COLLEGE_SETTINGS] === config.LABEL_COLLEGE_SETTINGS ?
              <NavItem className="cursor-pointer">
                <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                  {config.LABEL_COLLEGE_SETTINGS}
                </NavLink>
              </NavItem>
            : this.LOGGED_IN_USER === 'admin' ?
              <NavItem className="cursor-pointer">
                <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                  {config.LABEL_COLLEGE_SETTINGS}
                </NavLink>
              </NavItem>
            : null
          }

          {
            this.LOGGED_IN_USER !== 'admin' && permissions[config.LABEL_ACADEMIC_SETTINGS] === config.LABEL_ACADEMIC_SETTINGS ?
              <NavItem className="cursor-pointer">
                <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                  {config.LABEL_ACADEMIC_SETTINGS} 
                </NavLink>
              </NavItem>
            : this.LOGGED_IN_USER === 'admin' ?
              <NavItem className="cursor-pointer">
                <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                  {config.LABEL_ACADEMIC_SETTINGS} 
                </NavLink>
              </NavItem>
            : null
          }
          
          {
            this.LOGGED_IN_USER !== 'admin' && permissions[config.LABEL_ROLES_AND_PERMISSIONS] === config.LABEL_ROLES_AND_PERMISSIONS ?
              <NavItem className="cursor-pointer">
                <NavLink className={`${activeTab === 2 ? 'active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                  {config.LABEL_ROLES_AND_PERMISSIONS}
                </NavLink>
              </NavItem>
            : this.LOGGED_IN_USER === 'admin' ?
              <NavItem className="cursor-pointer">
                <NavLink className={`${activeTab === 2 ? 'active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                  {config.LABEL_ROLES_AND_PERMISSIONS}
                </NavLink>
              </NavItem>
            : null
          }
          


        </Nav>
        <TabContent activeTab={activeTab} className="border-right">
          
          <TabPane tabId={0}>
              {/* <CollegeSettings  /> */}
              {activeTab === 0 ? <CollegeSettings /> : null}
          </TabPane>
          <TabPane tabId={1}>
          {
            // user !== null && (
            //   <AcademicSettings user={user}  />
            // )
            activeTab === 1 ?
              this.LOGGED_IN_USER !== null && (
                  <AcademicSettings user={this.LOGGED_IN_USER}  />
              ) 
            : null
          }
          </TabPane>
          <TabPane tabId={2}>
          {
            // user !== null && (
            //   <RolesPermission user={user}/>)
            activeTab === 2 ?
              this.LOGGED_IN_USER !== null && (
                  <RolesPermission user={this.LOGGED_IN_USER}  />
              ) 
            : null
          }
          </TabPane>
        </TabContent>
      </section>
    );
  }
}
