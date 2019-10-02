import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import CollegeSettings from './CollegeSettings';
import AcademicSettings from './AcademicSettings';
import RolesPermission from './RolesPermission';

export default class TabPage extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const {activeTab} = this.state;
    return (
      <section className="tab-container">
        <div>
          {/* <img src="../../img/students.png" alt="" /> */}
          <h5>
          </h5>
        </div>
        <Nav tabs className="pl-3 pl-3 mb-4 mt-4 bottom-box-shadow">
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
              College Settings
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
              Academic Settings
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 2 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(2);
              }}
            >
              Roles &amp; Permissions
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="border-right">
          <TabPane tabId={0}>
            <CollegeSettings />
          </TabPane>
          <TabPane tabId={1}>
            <AcademicSettings />
          </TabPane>
          <TabPane tabId={2}>
            <RolesPermission />
          </TabPane>
        </TabContent>
      </section>
    );
  }
}
