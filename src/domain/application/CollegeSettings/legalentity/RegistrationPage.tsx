import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import CollegeSettings from './CollegeSettings';
// import AcademicSettings from './AcademicSettings';
// import RolesPermission from './RolesPermission';
import  "../../../../css/tabs.css";
import  "../../../../css/legal-entities.css";

export default class RegistrationPage extends React.Component<any, any> {
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
        
        {/* <Nav tabs className="pl-3 mb-4 mt-4 col-sm-2" id="rmfloat"> */}
          {/* <NavItem className="cursor-pointer"> */}
            <NavLink className={`${activeTab === 0 ? 'pl-3 mb-4 mt-4 legal-entities-col-sm-2 active' : 'pl-3 mb-4 mt-4 legal-entities-col-sm-2'}`} onClick={() => { this.toggleTab(0); }} >
            College Info
            </NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* </NavItem> */}
          {/* <NavItem className="cursor-pointer"> */}
            <NavLink className={`${activeTab === 1 ? 'pl-3 mb-4 mt-4 legal-entities-col-sm-2 active' : 'pl-3 mb-4 mt-4 legal-entities-col-sm-2'}`} onClick={() => { this.toggleTab(1); }} >
            IT Info
            </NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* </NavItem> */}
          {/* <NavItem className="cursor-pointer"> */}
            <NavLink className={`${activeTab === 2 ? 'pl-3 mb-4 mt-4 legal-entities-col-sm-2 active' : 'pl-3 mb-4 mt-4 legal-entities-col-sm-2'}`} onClick={() => { this.toggleTab(2); }} >
              PF Info
            </NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink className={`${activeTab === 3 ? 'pl-3 mb-4 mt-4 legal-entities-col-sm-2 active' : 'pl-3 mb-4 mt-4 legal-entities-col-sm-2'}`} onClick={() => { this.toggleTab(3); }} >
            ESI Info
            </NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <NavLink className={`${activeTab === 4 ? 'pl-3 mb-4 mt-4 legal-entities-col-sm-2 active' : 'pl-3 mb-4 mt-4 legal-entities-col-sm-2'}`} onClick={() => { this.toggleTab(4); }} >
            PT Info
            </NavLink>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          {/* </NavItem> */}
        {/* </Nav> */}
        <p></p>
        <TabContent activeTab={activeTab} className="border-right">
          <p></p>
          <TabPane tabId={0}>
            <div ng-class="{'hide':ctrl.activeTabIndex !== 0}">
                <div className="contnet">
                  <div className="gf-form-group section m-0 dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">Legal Name Of College </label>
                        <input type="text" className="gf-form-input text-uppercase" name="college" placeholder="College Name" required maxLength={255} />
                      </div>
                      <div className="m-b-1 ">
                        <div className="m-b-1 ">
                          <label className="gf-form-label b-0 bg-white">Date Of Incorporation </label>
                          <input type="date" className="gf-form-input" required maxLength={255} />
                        </div>
                        <div className="m-b-1 ">
                          <label className="gf-form-label b-0 bg-white">College Identification Number </label>
                          <input type="text" name="idnumber" className="gf-form-input text-uppercase" placeholder="CIN1234567" required maxLength={255} />
                        </div>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white ">Type Of College </label>
                        <div className="gf-form-select-wrapper">
                          <select ng-model="legalEntity.typeOfCollege" ng-options="f for f in ['PRIVATE', 'PUBLIC']" className="gf-form-input" required />
                        </div>
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white "> Registered Office Address </label>
                        <input type="text" className="gf-form-input" placeholder="ADDRESS LINE 1" required name="addr1" ng-pattern="/^[\/#.0-9a-zA-Z\s,-]+$/" />
                      </div>
                      <div className="m-b-1 ">
                        <input type="text" className="gf-form-input" placeholder="ADDRESS LINE 2" name="addr2" />
                      </div>
                      <div className="m-b-1 ">
                        <input type="text" className="gf-form-input legalWidth" name="addr3" required placeholder="ADDRESS LINE 3" />
                      </div>
                      <div className="flex">
                        <div>
                          <input type="text" className="gf-form-input legalWidth" name="addr4" required placeholder="ADDRESS LINE 4" />
                        </div>
                        <div>
                          <input type="text" className="gf-form-input legalWidth" placeholder="Pincode" name="pincode" required />
                        </div>
                      </div>
                      <div className="gf-form-button-row p-r-0">
                        <button type="submit" className="btn btn-success border-bottom">Continue</button>
                        <button type="reset" className="btn btn-danger border-bottom">Clear</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
          </TabPane>
          <TabPane tabId={1}>
            <div>
              <div className="contnet">
                <div className="gf-form-group section fwidth">
                    <div className="flex">
                      <div className="m-b-1 width-18">
                        <label className="gf-form-label b-0 bg-white ">PAN</label>
                        <input type="text" className="gf-form-input text-uppercase" placeholder="ABCDE1234H" required name="pan" />
                      </div>
                      <div className="m-b-1 width-18 mx">
                          <label className="gf-form-label b-0 bg-white"> TAN Circle Number </label>
                          <input type="text" className="gf-form-input text-uppercase" placeholder="12345678" name="tancircle" required />
                      </div>
                      <div className="m-b-1 width-18">
                        <label className="gf-form-label b-0 bg-white "> CIT(TDS) Location </label>
                        <input type="text" ng-model="legalEntity.citTdsLocation" className="gf-form-input text-uppercase" placeholder="CITY NAME" name="city" required ng-pattern="/^[a-zA-Z0-9 ]+$/" />
                      </div>
                    </div>  
                    <div className="flex">
                        <div className="m-b-1 width-18">
                          <label className="gf-form-label b-0 bg-white ">TAN</label>
                          <input type="text" className="gf-form-input text-uppercase" placeholder="TASN12345H" required name="tan" />
                        </div>
                        <div className="m-b-1 width-18 mx">
                          <label className="gf-form-label b-0 bg-white">Form 16 Signatory </label>
                          <select className="gf-form-input" required />
                        </div>
                        <div className="m-b-1 width-18">&nbsp;</div>
                    </div>
                    <div className="gf-form-button-row p-r-0">
                      <button type="submit" className="btn btn-success border-bottom"> Continue </button>
                      <button type="reset" className="btn btn-danger border-bottom"> Clear </button>
                    </div>
                  </div>
                </div>
            </div>
          </TabPane>
          <TabPane tabId={2}>
            <div>
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">PF Number</label>
                        <input type="text" className="gf-form-input text-uppercase" name="pfNumber" placeholder="AP/HYD/1234567" required />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">Signatory</label>
                        <div className="gf-form-select-wrapper">
                          <select className="gf-form-input" required />
                        </div>
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white "> Signatory's Father's Name </label>
                        <input type="text" disabled className="gf-form-input " />
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> Registration Date </label>
                        <input type="date" className="gf-form-input" required />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> Signatory Designation </label>
                        <input type="text" disabled className="gf-form-input" />
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="submit" className="btn btn-success border-bottom"> Continue </button>
                    <button type="reset" className="btn btn-danger border-bottom"> Clear </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={3}>
            <div ng-class="{'hide':ctrl.activeTabIndex !== 3}">
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">ESI Number</label>
                        <input type="text" className="gf-form-input" placeholder="454876877985465" required name="esi" />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">Signatory</label>
                        <div className="gf-form-select-wrapper">
                          <select className="gf-form-input" required />
                        </div>
                        <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white"> Signatory's Father's Name </label>
                          <input type="text" disabled className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white"> Registration Date </label>
                        <input type="date" className="gf-form-input" required />

                        <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white"> Signatory Designation </label>
                          <input type="text" disabled className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0">
                    <button type="submit" className="btn btn-success border-bottom"> Continue </button>
                    <button type="reset" className="btn btn-danger border-bottom"> Clear </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={4}>
            <div>
              <div className="contnet">
                <div className="section fwidth">
                  <div className="gf-form-group">
                    <div className="flex">
                      <div className="m-b-1 width-18">
                        <label className="gf-form-label b-0 bg-white">PT Number</label>
                        <input type="text" className="gf-form-input text-uppercase" placeholder="4548768779" name="pt" required />
                      </div>
                      <div className="m-b-1 width-18 mx">
                        <label className="gf-form-label b-0 bg-white"> PT Registration Date </label>
                        <input type="date" className="gf-form-input" required />
                      </div>
                      <div className="m-b-1 width-18">
                        <label className="gf-form-label b-0 bg-white">PT Signatory</label>
                        <div className="gf-form-select-wrapper">
                          <select className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                    <div className="gf-form-button-row p-r-0 p-t-1">
                      <button type="submit" className="btn btn-success border-bottom mr-1" > Save </button>
                      <button type="reset" className="btn btn-danger border-bottom mr-1"> Clear </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          
        </TabContent>
      </section>
    );
  }
}
