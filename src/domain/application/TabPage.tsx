import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import {FaCog} from 'react-icons/fa';
import CollegeSettings from './CollegeSettings';
import AcademicSettings from './AcademicSettings';
import RolesPermission from './RolesPermission';
import {config} from './config';
import axios from 'axios';
import {commonFunctions} from './_utilites/common.functions';
import {rbacSettingsServices} from './_services/rbacSettings.service';

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

  async componentDidMount() {
    await this.getUserPermissions();
    console.log('PrefPlugin. Permissions : ', this.state.permissions);
  }

  async getUserPermissions() {
    if (this.LOGGED_IN_USER !== 'admin' && this.LOGGED_IN_USER !== null) {
      const URL = config.CMS_GLOBAL_CONFIG_URL + '?userName=' + this.LOGGED_IN_USER;
      await fetch(URL)
        .then((response) => response.json())
        .then((res) => {
          const perm = res.loginResponse.authz.permissions;
          console.log('Preference Plugin. Permissions ::------->>>>>> ', perm);
          const arr: any = [];
          perm.map((item: any) => {
            arr[item] = item;
          });
          this.setState({
            permissions: arr,
          });
        });
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
        <div className="pref p-1">
          <h5>
            <FaCog className="fa-2x" />
            Preferences
          </h5>
        </div>
        <Nav tabs className="pl-3 pl-3 mb-4 mt-4 bottom-box-shadow">
          {this.LOGGED_IN_USER !== 'admin' &&
          permissions['College Settings'] === 'College Settings' ? (
            <NavItem className="cursor-pointer">
              <NavLink
                className={`${activeTab === 0 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(0);
                }}
              >
                College Settings
              </NavLink>
            </NavItem>
          ) : this.LOGGED_IN_USER === 'admin' ? (
            <NavItem className="cursor-pointer">
              <NavLink
                className={`${activeTab === 0 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(0);
                }}
              >
                College Settings
              </NavLink>
            </NavItem>
          ) : null}

          {this.LOGGED_IN_USER !== 'admin' &&
          permissions['Academic Settings'] === 'Academic Settings' ? (
            <NavItem className="cursor-pointer">
              <NavLink
                className={`${activeTab === 1 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(1);
                }}
              >
                Academic Settings
              </NavLink>
            </NavItem>
          ) : this.LOGGED_IN_USER === 'admin' ? (
            <NavItem className="cursor-pointer">
              <NavLink
                className={`${activeTab === 1 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(1);
                }}
              >
                Academic Settings
              </NavLink>
            </NavItem>
          ) : null}

          {this.LOGGED_IN_USER !== 'admin' &&
          permissions['Roles & Permissions'] === 'Roles & Permissions' ? (
            <NavItem className="cursor-pointer">
              <NavLink
                className={`${activeTab === 2 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(2);
                }}
              >
                {'Roles & Permissions'}
              </NavLink>
            </NavItem>
          ) : this.LOGGED_IN_USER === 'admin' ? (
            <NavItem className="cursor-pointer">
              <NavLink
                className={`${activeTab === 2 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(2);
                }}
              >
                {'Roles & Permissions'}
              </NavLink>
            </NavItem>
          ) : null}
        </Nav>
        <TabContent activeTab={activeTab} className="border-right">
          {this.LOGGED_IN_USER !== 'admin' &&
          permissions['College Settings'] === 'College Settings' ? (
            <TabPane tabId={0}>
              {activeTab === 0 ? <CollegeSettings permissions={permissions} /> : null}
            </TabPane>
          ) : this.LOGGED_IN_USER === 'admin' ? (
            <TabPane tabId={0}>
              {activeTab === 0 ? <CollegeSettings permissions={permissions} /> : null}
            </TabPane>
          ) : null}

          {this.LOGGED_IN_USER !== 'admin' &&
          permissions['Academic Settings'] === 'Academic Settings' ? (
            <TabPane tabId={1}>
              {activeTab === 1 ? <AcademicSettings permissions={permissions} /> : null}
            </TabPane>
          ) : this.LOGGED_IN_USER === 'admin' ? (
            <TabPane tabId={1}>
              {activeTab === 1 ? <AcademicSettings permissions={permissions} /> : null}
            </TabPane>
          ) : null}

          {this.LOGGED_IN_USER !== 'admin' &&
          permissions['Roles & Permissions'] === 'Roles & Permissions' ? (
            <TabPane tabId={2}>
              {activeTab === 2
                ? this.LOGGED_IN_USER !== null && (
                    <RolesPermission user={this.LOGGED_IN_USER} />
                  )
                : null}
            </TabPane>
          ) : this.LOGGED_IN_USER === 'admin' ? (
            <TabPane tabId={2}>
              {activeTab === 2
                ? this.LOGGED_IN_USER !== null && (
                    <RolesPermission user={this.LOGGED_IN_USER} />
                  )
                : null}
            </TabPane>
          ) : null}
        </TabContent>
      </section>
    );
  }
}
