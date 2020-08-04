import * as React from 'react';
// import { collegeSettingsServices } from '../../../_services/collegeSettings.services';
import { withApollo } from 'react-apollo';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import DataGenerateUsingFile from './DataGenerateUsingFile'
import DataGenerateUsingInputs from './DataGenerateUsingInputs'


const SUCCESS_MESSAGE_COLLEGE_ADDED = "College is added successfully. It is created as default main branch also";
const ERROR_MESSAGE_SERVER_SIDE_ERROR = "Due to some error in preference service, college could not be saved. Please check preference service logs";
const ERROR_MESSAGE_COLLEGE_EXISTS = "College already exists. Application allows only one college";

// export interface CollegeProp extends React.HTMLAttributes<HTMLElement>{
//     [data: string]: any;
//     onSaveUpdate?: any;
// }

// type CollegeState = {
//     collegeData: any,
// };

class DataGeneratorInput extends React.Component<any, any> {
    constructor(props:any){
        super(props);
        this.state= {
            activeTab: 0,
        }
    }
    toggleTab=(tabNo: any)=> {
        this.setState({
          activeTab: tabNo,
        });
      }
    render() {
        const {entity,activeTab} = this.state;
        return (
            <main >
    
                 <section className="tab-container">
             <Nav tabs className="pl-3 pl-3 mb-4 mt-4 bottom-box-shadow">
                 
            <NavItem className="cursor-pointer my-nav-item">
              <NavLink
                className={`${activeTab === 0 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(0);
                }}
              >
                CMS Data Generator
              </NavLink>
            </NavItem>
            <NavItem className="cursor-pointer my-nav-item" >
              <NavLink
                className={`${activeTab === 1 ? 'active' : ''}`}
                onClick={() => {
                  this.toggleTab(1);
                }}
              >
                Generic Data Generator
              </NavLink>
            </NavItem>

        </Nav>
        <TabContent activeTab={activeTab} className="border-right">
         
            <TabPane tabId={0}>
              {activeTab === 0 ? <DataGenerateUsingFile/> : null}
            </TabPane>
          
            <TabPane tabId={1}>
              {activeTab === 1 ? <DataGenerateUsingInputs />  : null}
            </TabPane>
    

          
        </TabContent>

        </section>
            </main>
        );
    }
};

export default withApollo(DataGeneratorInput)