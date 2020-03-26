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
    permissions?: any;
}
export default class RolesPermission extends React.Component<RolePermProps, any> {
    LOGGED_IN_USER = new URLSearchParams(location.search).get('signedInUser');
    constructor(props: RolePermProps) {
        super(props);
        this.state = {
            permissions: this.props.permissions,
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
        const { activeTab,isLoaded, permissions } = this.state;
        return (
            <section className="tab-container row vertical-tab-container">
                <Nav tabs className="pl-3 pl-3 mb-4 mt-4 col-sm-2">
                    
                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Permission"] === "Permission" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                                    Permission
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 0 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(0); }} >
                                    Permission
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Roles"] === "Roles" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                                    Roles
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 1 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(1); }} >
                                    Roles
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Groups"] === "Groups" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                                    Groups
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 2 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(2); }} >
                                    Groups
                                </NavLink>
                            </NavItem>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Users"] === "Users" ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                                    Users
                                </NavLink>
                            </NavItem>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <NavItem className="cursor-pointer">
                                <NavLink className={`vertical-nav-link ${activeTab === 3 ? 'side-active' : ''}`} onClick={() => { this.toggleTab(3); }} >
                                    Users
                                </NavLink>
                            </NavItem>
                        : null
                    }
                </Nav>
                <TabContent activeTab={activeTab} className="col-sm-9 border-left p-t-1">
                    
                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Permission"] === "Permission" ?
                            <TabPane tabId={0}>
                                <Permissions />
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={0}>
                                <Permissions />
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Roles"] === "Roles" ?
                            <TabPane tabId={1}> 
                                {
                                    activeTab === 1 ? <Roles isLoaded={activeTab === 1 ? "YES" : "NO"}/> : null
                                }
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={1}> 
                                {
                                    activeTab === 1 ? <Roles isLoaded={activeTab === 1 ? "YES" : "NO"}/> : null
                                }
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Groups"] === "Groups" ?
                            <TabPane tabId={2}>
                                {activeTab === 2 ? <Groups isPageLoaded={activeTab === 2 ? "YES" : "NO"}/> : null}
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={2}>
                                {activeTab === 2 ? <Groups isPageLoaded={activeTab === 2 ? "YES" : "NO"}/> : null}
                            </TabPane>
                        : null
                    }

                    {
                        this.LOGGED_IN_USER !== 'admin' && permissions["Users"] === "Users" ?
                            <TabPane tabId={3}>
                                {activeTab === 3 ? <Users isPageLoaded={activeTab === 3 ? "YES" : "NO"}/> : null}
                            </TabPane>
                        : this.LOGGED_IN_USER === 'admin' ?
                            <TabPane tabId={3}>
                                {activeTab === 3 ? <Users isPageLoaded={activeTab === 3 ? "YES" : "NO"}/> : null}
                            </TabPane>
                        : null
                    }
                </TabContent>
            </section>
        );
    }
}
