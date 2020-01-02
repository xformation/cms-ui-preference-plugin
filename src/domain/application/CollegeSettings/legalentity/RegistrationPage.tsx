import * as React from 'react';
// import { graphql, QueryProps, MutationFunc, compose } from 'react-apollo';
// import {withRouter, RouteComponentProps, Link} from 'react-router-dom';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
// import  "../../../../css/tabs.css";
// import  "../../../../css/legal-entities.css";
import { commonFunctions } from '../../_utilites/common.functions';
import  "../../../../css/custom.css";
import {MessageBox} from '../../Message/MessageBox'
import { withApollo } from 'react-apollo';

export interface RegistrationProps extends React.HTMLAttributes<HTMLElement>{
  branchList?: any;
  stateList?: any;
  cityList?: any;
  originalCityList?: any;
}
class RegistrationPage extends React.Component<RegistrationProps, any> {
  constructor(props: RegistrationProps) {
    super(props);
    this.state = {
      activeTab: 0,
      branchList : this.props.branchList,
      stateList: this.props.stateList,
      cityList: this.props.cityList,
      originalCityList: this.props.cityList
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const {activeTab, stateList, cityList, branchList} = this.state;
    return (
      <section className="tab-container">
        <div className="clearfix" />
        <div className="dflex m-b-1 algn-item-center">
          <h5 className="form-h5 m-r-1 fwidth">Registration & Tax information</h5>
          <div className="dflex">
            <select className="gf-form-input m-r-1" required>
              <option value="">Select State</option>
              {
                  commonFunctions.createSelectbox(stateList, "id", "id", "stateName")
              }
            </select>
            <select className="gf-form-input m-r-1" required>
              <option value="">Select City</option>
              {
                  commonFunctions.createSelectbox(cityList, "id", "id", "cityName")
              }
            </select>
            <select className="gf-form-input" required>
              <option value="">Select Branch</option>
              {
                  commonFunctions.createSelectbox(branchList, "id", "id", "branchName")
              }
            </select>
          </div>
        </div>
        <Nav tabs className="" id="rmfloat">
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 0 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(0);
              }}
            >
              College Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 1 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(1);
              }}
            >
              IT Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 2 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(2);
              }}
            >
              PF Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 3 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(3);
              }}
            >
              ESI Info
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink
              className={`${activeTab === 4 ? 'active' : ''}`}
              onClick={() => {
                this.toggleTab(4);
              }}
            >
              PT Info
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={activeTab} className="ltab-contianer">
          <TabPane tabId={0}>
            <div ng-class="{'hide':ctrl.activeTabIndex !== 0}">
              <div className="contnet">
                <div className="gf-form-group section m-0 dflex">
                  <div className="form-left">
                    <div className="m-b-1">
                      <label className="gf-form-label b-0 bg-white">
                        LEGAL NAME OF COLLEGE
                      </label>
                      <input
                        type="text"
                        className="gf-form-input text-uppercase"
                        name="college"
                        placeholder="College Name"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div className="m-b-1 ">
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white">
                          DATE OF INCORPORATION
                        </label>
                        <input
                          type="date"
                          className="gf-form-input "
                          required
                          maxLength={255}
                        />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white">
                          COLLEGE IDENTIFICATION NUMBER
                        </label>
                        <input
                          type="text"
                          name="idnumber"
                          className="gf-form-input text-uppercase"
                          placeholder="CIN1234567"
                          required
                          maxLength={255}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-right">
                    <div className="m-b-1 ">
                      <label className="gf-form-label b-0 bg-white ">
                        TYPE OF COLLEGE
                      </label>
                      <div className="gf-form-select-wrapper">
                        <select
                          ng-model="legalEntity.typeOfCollege"
                          ng-options="f for f in ['PRIVATE', 'PUBLIC']"
                          className="gf-form-input"
                          required
                        />
                      </div>
                    </div>
                    <div className="m-b-1 ">
                      <label className="gf-form-label b-0 bg-white ">
                        REGISTERED OFFICE ADDRESS
                      </label>
                      <input
                        type="text"
                        className="gf-form-input"
                        placeholder="ADDRESS LINE 1"
                        required
                        name="addr1"
                        ng-pattern="/^[\/#.0-9a-zA-Z\s,-]+$/"
                      />
                    </div>
                    <div className="m-b-1 ">
                      <input
                        type="text"
                        className="gf-form-input"
                        placeholder="ADDRESS LINE 2"
                        name="addr2"
                      />
                    </div>
                    <div className="m-b-1 ">
                      <input
                        type="text"
                        className="gf-form-input legalWidth"
                        name="addr3"
                        required
                        placeholder="ADDRESS LINE 3"
                      />
                    </div>
                    <div className="flex">
                      <div>
                        <input
                          type="text"
                          className="gf-form-input legalWidth"
                          name="addr4"
                          required
                          placeholder="ADDRESS LINE 4"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          className="gf-form-input legalWidth"
                          placeholder="Pincode"
                          name="pincode"
                          required
                        />
                      </div>
                    </div>
                    <div className="gf-form-button-row p-r-0">
                      <button type="submit" className="btn btn-success border-bottom">
                        Continue
                      </button>
                      <button type="reset" className="btn btn-danger border-bottom">
                        Clear
                      </button>
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
                      <label className="gf-form-label b-0 bg-white">
                        TAN CIRCLE NUMBER
                      </label>
                      <input type="text" className="gf-form-input text-uppercase" placeholder="12345678" name="tancircle" required />
                    </div>
                    <div className="m-b-1 width-18">
                      <label className="gf-form-label b-0 bg-white ">
                        CIT(TDS) LOCATION
                      </label>
                      <input type="text" ng-model="legalEntity.citTdsLocation" className="gf-form-input text-uppercase" placeholder="CITY NAME" name="city" required ng-pattern="/^[a-zA-Z0-9 ]+$/" />
                    </div>
                  </div>



                  <div className="flex">
                    <div className="m-b-1 width-18">
                      <label className="gf-form-label b-0 bg-white ">TAN</label>
                      <input type="text" className="gf-form-input text-uppercase" placeholder="TASN12345H" required name="tan" />
                    </div>
                    <div className="m-b-1 width-18">
                      <label className="gf-form-label b-0 bg-white">
                        FORM 16 SIGNATORY
                      </label>
                      <div className="gf-form-select-wrapper">
                        <select className="gf-form-input" required />
                      </div>
                    </div>
                    
                    <div className="m-b-1 width-18">&nbsp;</div>
                  </div>
                  {/* <div className="m-b-1 width-18"> */}
                    <div className="gf-form-button-row p-r-0">
                      <button type="submit" className="btn btn-success border-bottom">Continue</button>
                      <button type="reset" className="btn btn-danger border-bottom">Clear</button>
                    </div>
                  {/* </div> */}
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
                        <label className="gf-form-label b-0 bg-white ">PF NUMBER</label>
                        <input
                          type="text"
                          className="gf-form-input text-uppercase"
                          name="pfNumber"
                          placeholder="AP/HYD/1234567"
                          required
                        />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">SIGNATORY</label>
                        <div className="gf-form-select-wrapper">
                          <select className="gf-form-input" required />
                        </div>
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">
                          SIGNATORY'S FATHER'S NAME
                        </label>
                        <input type="text" disabled className="gf-form-input " />
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">
                          REGISTRATION DATE
                        </label>
                        <input type="date" className="gf-form-input" required />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">
                          SIGNATORY DESIGNATION
                        </label>
                        <input type="text" disabled className="gf-form-input" />
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="submit" className="btn btn-success border-bottom">
                      Continue
                    </button>
                    <button type="reset" className="btn btn-danger border-bottom">
                      Clear
                    </button>
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
                        <label className="gf-form-label b-0 bg-white">ESI NUMBER</label>
                        <input
                          type="text"
                          className="gf-form-input"
                          placeholder="454876877985465"
                          required
                          name="esi"
                        />
                      </div>
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">SIGNATORY</label>
                        <div className="gf-form-select-wrapper">
                          <select className="gf-form-input" required />
                        </div>
                        <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white">
                            SIGNATORY'S FATHER'S NAME
                          </label>
                          <input type="text" disabled className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white">
                          REGISTRATION DATE
                        </label>
                        <input type="date" className="gf-form-input" required />

                        <div className="m-b-1">
                          <label className="gf-form-label b-0 bg-white">
                            SIGNATORY DESIGNATION
                          </label>
                          <input type="text" disabled className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0">
                    <button type="submit" className="btn btn-success border-bottom">
                      Continue
                    </button>
                    <button type="reset" className="btn btn-danger border-bottom">
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </TabPane>
          <TabPane tabId={4}>
            {' '}
            <div>
              <div className="contnet">
                <div className="section fwidth">
                  <div className="gf-form-group">
                    <div className="flex">
                      <div className="m-b-1 width-18">
                        <label className="gf-form-label b-0 bg-white">PT NUMBER</label>
                        <input
                          type="text"
                          className="gf-form-input text-uppercase"
                          placeholder="4548768779"
                          name="pt"
                          required
                        />
                      </div>
                      <div className="m-b-1 width-18 mx">
                        <label className="gf-form-label b-0 bg-white">
                          PT REGISTRATION DATE
                        </label>
                        <input type="date" className="gf-form-input" required />
                      </div>
                      <div className="m-b-1 width-18">
                        <label className="gf-form-label b-0 bg-white">PT SIGNATORY</label>
                        <div className="gf-form-select-wrapper">
                          <select className="gf-form-input" />
                        </div>
                      </div>
                    </div>
                    <div className="gf-form-button-row p-r-0 p-t-1">
                      <button
                        type="submit"
                        className="btn btn-success border-bottom mr-1"
                      >
                        Save
                      </button>
                      <button type="reset" className="btn btn-danger border-bottom mr-1">
                        Clear
                      </button>
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

export default withApollo(RegistrationPage);