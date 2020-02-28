import * as React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import "../../../../css/custom.css";
import { withApollo } from 'react-apollo';
import CreateTimeTable from './CreateTimeTable';
import { CalendarSetup } from './CalendarSetup';

class TimeTablePage<T = { [data: string]: any }> extends React.Component<any, any> {

  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
      termList: this.props.termList,
      batchList: this.props.batchList,
      sectionList: this.props.sectionList,
      subjectList: this.props.subjectList,
      teacherList: this.props.teacherList,
    };
    this.toggleTab = this.toggleTab.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  render() {
    const { activeTab, termList, batchList, sectionList, teacherList, subjectList } = this.state;
    return (
      <section className="tab-container">

        <div className="clearfix" />
        <div className="dflex m-b-1 algn-item-center">
        </div>
        <Nav tabs className="" id="rmfloat">
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 0 ? 'active' : ''}`} onClick={() => { this.toggleTab(0); }} >
              Create Lecture
            </NavLink>
          </NavItem>
          <NavItem className="cursor-pointer">
            <NavLink className={`${activeTab === 1 ? 'active' : ''}`} onClick={() => { this.toggleTab(1); }} >
              Search Lecture
            </NavLink>
          </NavItem>

        </Nav>
        <TabContent activeTab={activeTab} className="ltab-contianer">
          <TabPane tabId={0}>
            <CreateTimeTable termList={termList} sectionList={sectionList} batchList={batchList} teacherList={teacherList} subjectList={subjectList} />
          </TabPane>

          <TabPane tabId={1}>
            {/* <div>
              <div className="contnet">
                <div className="gf-form-group">
                  <div className="dflex">
                    <div className="form-left">
                      <div className="m-b-1">
                        <label className="gf-form-label b-0 bg-white ">PAN<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="pan" id="pan" onChange={this.onChange} value={regObj.pan} className="gf-form-input text-uppercase" placeholder="ABCDE1234H" maxLength={10}/>
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> TAN CIRCLE NUMBER<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" name="tanCircleNumber" id="tanCircleNumber" onChange={this.onChange} value={regObj.tanCircleNumber} className="gf-form-input text-uppercase" placeholder="12345678" maxLength={255} />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white "> CIT(TDS) LOCATION<span style={{ color: 'red' }}> * </span> </label>
                        <input type="text" name="citTdsLocation" id="citTdsLocation" onChange={this.onChange} value={regObj.citTdsLocation} className="gf-form-input text-uppercase" placeholder="CITY NAME" maxLength={255}/>
                      </div>
                    </div>
                    <div className="form-right">
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white ">TAN<span style={{ color: 'red' }}> * </span></label>
                        <input type="text" name="tan" id="tan" onChange={this.onChange} value={regObj.tan} className="gf-form-input text-uppercase" placeholder="TASN12345H" maxLength={255} />
                      </div>
                      <div className="m-b-1 ">
                        <label className="gf-form-label b-0 bg-white"> FORM 16 SIGNATORY<span style={{ color: 'red' }}> * </span> </label>
                        <div className="gf-form-select-wrapper">
                          <select name="formSignatory" id="formSignatory" onChange={this.onChange} value={regObj.formSignatory} className="gf-form-input" >
                            <option key={""} value={""}>Select Form Signatory</option>
                            {
                                commonFunctions.createSelectbox(signatoryList, "id", "id", "name")
                            }
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="gf-form-button-row p-r-0 p-t-1">
                    <button type="button" onClick={this.validateItInfo} className="btn btn-primary border-bottom"> Next </button>
                  </div>
                </div>
              </div>
            </div> */}
            <CalendarSetup />
          </TabPane>

        </TabContent>
      </section>
    );
  }
}

export default withApollo(TimeTablePage);