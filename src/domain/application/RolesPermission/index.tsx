import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import {Permissions} from './permissions/Permissions';
import {Groups} from './groups/Groups';
import {Users} from './users/Users';
import {Roles} from './roles/Roles';

export interface RolePermProps extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
    user?: any;
}
export default class RolesPermission extends React.Component<RolePermProps, any> {
    constructor(props: RolePermProps) {
        super(props);
        this.state = {
            activeTab: 0,
            isLoaded: "NO",
            user: this.props.user,
        };
        this.toggleTab = this.toggleTab.bind(this);
    }

    toggleTab(tabNo: any) {
        this.setState({
            activeTab: tabNo,
        });
        if(tabNo === 1){
            this.setState({
                isLoaded: "YES",
            }); 
        }else{
            this.setState({
                isLoaded: "NO",
            });
        }
        
    }

    render() {
        const { activeTab,isLoaded,user } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                            Permission
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                            Roles
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                            Groups
                        </NavLink>
                    </NavItem>
                    <NavItem className="cursor-pointer">
                        <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                            Users
                        </NavLink>
                    </NavItem>
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                    <TabPane tabId={0}>
                        <Permissions />
                    </TabPane>
                    <TabPane tabId={1}> 
                        {
                            activeTab === 1 ? <Roles isLoaded={activeTab === 1 ? "YES" : "NO"}/> : null
                        }
                        
                    </TabPane>
                    <TabPane tabId={2}>
                        {activeTab === 2 ? <Groups isPageLoaded={activeTab === 2 ? "YES" : "NO"}/> : null}
                    </TabPane>
                    <TabPane tabId={3}>
                        {activeTab === 3 ? <Users user={user} isPageLoaded={activeTab === 3 ? "YES" : "NO"}/> : null}
                    </TabPane>
                    
                </TabContent>
            </section>
        );
    }
}
