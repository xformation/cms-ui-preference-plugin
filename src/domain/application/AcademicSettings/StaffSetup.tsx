import * as React from 'react';
import {TabContent, TabPane, Nav, NavItem, NavLink} from 'reactstrap';
import {graphql, MutationFunc} from 'react-apollo';

export class StaffSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      activeTab: 0,
      isModalOpen: false,
      states: [],
      cities: [],
      selectedState: '',
      selectedCity: '',
    };
    this.toggleTab = this.toggleTab.bind(this);
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
  }

  toggleTab(tabNo: any) {
    this.setState({
      activeTab: tabNo,
    });
  }

  // componentDidMount() {

  showModal(e: any, bShow: boolean) {
    e && e.preventDefault();
    this.setState(() => ({
      isModalOpen: bShow,
    }));
  }

  handleStateChange(e: any) {
    const {name, value} = e.target;
    this.setState({
      [name]: value,
    });
  }
  create() {
    let {count, countParticularDiv} = this.state;
    countParticularDiv = 0;
    count = [];
    this.setState({
      countParticularDiv,
      count,
    });

    let fCatGrid: any = document.querySelector('#crdiv');
    fCatGrid.setAttribute('class', 'grid');
    let fCatGrida: any = document.querySelector('#lidiv');
    fCatGrida.setAttribute('class', 'hide');
    let createbtns: any = document.querySelector('#createbtn');
    createbtns.setAttribute('class', 'hide');
    let savebtns: any = document.querySelector('#savebtn');
    savebtns.setAttribute('class', 'btn bs save-all-forms-btn m-r-1 height-33');
  }
  back() {
    let {count, countParticularDiv} = this.state;
    countParticularDiv = 0;
    count = [];
    this.setState({
      countParticularDiv,
      count,
    });
    let fCatGrid: any = document.querySelector('#crdiv');
    fCatGrid.setAttribute('class', 'hide');
    let fCatGrida: any = document.querySelector('#lidiv');
    fCatGrida.setAttribute('class', 'p-1 page-body legal-entities-main-container');
    let createbtns: any = document.querySelector('#createbtn');
    createbtns.setAttribute('class', 'btn btn-primary m-r-1');
    let savebtns: any = document.querySelector('#savebtn');
    savebtns.setAttribute('class', 'hide');
  }

  render() {
    const {isModalOpen, activeTab} = this.state;
    return (
      <div className="info-container">
        <div className="authorized-signatory-container m-b-1">
          <h3>Staff Setup</h3>
          {/* <a className="btn btn-primary"  >
            Assign
          </a> */}
        </div>
        <div className="authorized-signatory-container m-b-1 dflex ht bg-heading">
          <h4 className="ptl-06">Staff Details</h4>
          <div className="">
            <button
              id="createbtn"
              className="btn btn-primary m-r-1"
              onClick={this.create}
            >
              Create
            </button>
            <button id="savebtn" className="hide" onClick={this.create}>
              Save
            </button>
            <button className="btn btn-primary m-r-1" onClick={this.back}>
              Back
            </button>
          </div>
        </div>

        {/* <div  id="crdiv" className="hide" >sgfsdgfsd</div> */}

        <div id="crdiv" className="hide">
          <div className="leftbar">
            <div className="row p-1">
              <div className="col-md-6 col-lg-12 col-xs-12 col-sm-6">
                <img
                  className="student-photo"
                  id="stPhoto"
                  src={this.state.uploadPhoto}
                />
              </div>
            </div>
            {/* <img src="{{ ctrl.profileSrc }}" alt="" className="img-width" /> */}
            <div className="gf-form m-b-1">
              <label className="upload-cursor">
                <input
                  id="d-none"
                  type="file"
                  file-select="ctrl.getFile(file)"
                  className="gf-form-file-input"
                  accept="image/*"
                />
                Upload <i className="fa fa-info-circle l-grey" aria-hidden="true" />
              </label>
            </div>
            <div className="form-justify">
              <label htmlFor="">*Upload photo:</label>
              <input
                className="gf-form-input width-11 m-b-1"
                type="text"
                maxLength={255}
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Employee Id:</label>
              <input
                className="gf-form-input width-11 m-b-1"
                required
                type="number"
                name="employeeid"
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Designation:</label>
              <input
                className="gf-form-input width-11 m-b-1"
                type="text"
                maxLength={255}
                required
                name="designation"
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Staff Type:</label>
              <select className="gf-form-input width-11 b-r" required>
                <option value="">Select Staff Type</option>
              </select>
            </div>
            <div className="form-justify">
              <label htmlFor="">*Department:</label>
              <select className="gf-form-input width-11" required>
                <option value="">Select Department</option>
              </select>
            </div>
            <div className="form-justify">
              <label htmlFor="">*Branch:</label>
              <select className="gf-form-input width-11" required>
                <option value="">Select Branch</option>
              </select>
            </div>
            <div className="form-justify">
              <span>*Status:</span>
              <label className="switch">
                <input type="checkbox" /> <span className="slider" />
              </label>
            </div>
          </div>
          <div className="">
            <Nav tabs className="" id="rmfloat">
              <NavItem className="cursor-pointer">
                <NavLink
                  className={`${activeTab === 0 ? 'active' : ''}`}
                  onClick={() => {
                    this.toggleTab(0);
                  }}
                >
                  Personal Details
                </NavLink>
              </NavItem>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={`${activeTab === 1 ? 'active' : ''}`}
                  onClick={() => {
                    this.toggleTab(1);
                  }}
                >
                  Contact Details
                </NavLink>
              </NavItem>
              <NavItem className="cursor-pointer">
                <NavLink
                  className={`${activeTab === 2 ? 'active' : ''}`}
                  onClick={() => {
                    this.toggleTab(2);
                  }}
                >
                  Primary & Emergency Contact
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab} className="ltab-contianer p-0">
              <TabPane tabId={0}>
                <div>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="">Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="sfname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Middle Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="mname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Last Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="lname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Father Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="ffname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Father Middle Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="fmname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Father Last Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="flname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Spouse Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="sname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Spouse Middle Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="smname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Spouse Last Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="slname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Mother Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="mfname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Mother Middle Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="mmname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Mother Last Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="mlname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Adhar No*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        name="adhar"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Date Of Birth*</label>
                      <input className="gf-form-input fwidth" type="date" />
                    </div>
                    <div>
                      <label htmlFor="">Place Of Birth*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="pob"
                      />
                    </div>
                    <div>
                      <label htmlFor="">Religion*</label>
                      <select className="gf-form-input fwidth" required>
                        <option value="">Select Religion</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="">Caste*</label>
                      <select className="gf-form-input fwidth" required>
                        <option value="">Select Caste</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="">Subcaste*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="subcaste"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Age*</label>
                      <input
                        className="gf-form-input fwidth"
                        required
                        name="age"
                        type="text"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Sex*</label>
                      <select className="gf-form-input fwidth" required>
                        <option value="">Select Gender</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="">Blood Group*</label>
                      <select className="gf-form-input fwidth" required>
                        <option value="">Select Blood Group</option>
                      </select>
                    </div>
                  </div>
                </div>
              </TabPane>

              <TabPane tabId={1}>
                <div>
                  <div className="form-grid">
                    <div>
                      <label htmlFor="">Address Line 1*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="adr1"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Address Line 2</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="adr2"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Address Line 3</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="adr3"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Town*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stftown"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">State*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfstate"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Country*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfcountry"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Pin Code*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="number"
                        name="stfpin"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Contact Number*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="number"
                        name="stfcont"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Alternate Contact Number 1</label>
                      <input
                        className="gf-form-input fwidth"
                        type="number"
                        name="stfaltcont"
                        required
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Email Address*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfemail"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Alternate Email Address</label>
                      <input
                        className="gf-form-input fwidth"
                        type="email"
                        required
                        name="stfaltemail"
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>
              </TabPane>
              <TabPane tabId={2}>
                <div>
                  <div className="staff-p">
                    <label htmlFor="">Relation with Staff*</label>
                    <select className="gf-form-input fwidth" required>
                      <option value="">Select Relation</option>
                    </select>
                  </div>
                  <div className="form-grid m-t-1">
                    <div>
                      <label htmlFor="">Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfpname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Middle Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfpmname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Last Name*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfplname"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Contact Number*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="text"
                        required
                        name="stfpcn"
                        maxLength={255}
                      />
                    </div>
                    <div>
                      <label htmlFor="">Email Address*</label>
                      <input
                        className="gf-form-input fwidth"
                        type="email"
                        required
                        name="stfpemail"
                        maxLength={255}
                      />
                    </div>
                  </div>
                </div>
              </TabPane>
            </TabContent>
          </div>
        </div>
        <div id="lidiv" className="p-1 page-body legal-entities-main-container">
          <div className="staff-management">
            <div>
              <label htmlFor="">Department</label>
              <select className="gf-form-input">
                <option value="">Select Department</option>
              </select>
            </div>
            <div />
            <div>
              <label htmlFor="">Gender</label>
              <select className="gf-form-input">
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Staff Type</label>
              <select className="gf-form-input">
                <option value="">Select Staff Type</option>
                <option value="TEACHING">TEACHING</option>
                <option value="NONTEACHING">NONTEACHING</option>
                <option value="GUEST">GUEST</option>
              </select>
            </div>
            <div className="margin-bott">
              <label htmlFor="">Search</label>
              <input type="search" placeholder="search by name" />
            </div>
            <a className="btn btn-success" id="fileType">
              Export
            </a>
          </div>

          <table className="staff-management-table">
            <thead>
              <th>
                <input type="checkbox" key="teacher.id" id="chk" />
              </th>
              <th>Name</th>
              <th>Emp Id</th>
              <th>Designation</th>
              <th>Department</th>
              <th>Gender</th>
              <th>Type</th>
              <th>Subjects</th>
              <th>status</th>
            </thead>
            <tbody>
              <tr key="teacher.id">
                <td>
                  <input type="checkbox" id="chk" />
                </td>
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
