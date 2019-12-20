import * as React from 'react';
import {graphql, MutationFunc} from 'react-apollo';

export class StaffSetup extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
      states: [],
      cities: [],
      selectedState: '',
      selectedCity: '',
    };
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
    this.create = this.create.bind(this);
    this.back = this.back.bind(this);
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
  }

  render() {
    const {isModalOpen} = this.state;
    return (
      <div className="info-container">
        <div className="authorized-signatory-container m-b-1">
          <h3>Staff Setup</h3>
          <a className="btn btn-primary" ng-click="">
            Assign
          </a>
        </div>
        <div className="authorized-signatory-container m-b-1 dflex ht bg-heading">
          <h4 className="ptl-06">Staff Details</h4>
          <button className="btn btn-primary" onClick={this.create} ng-click="">
            Create
          </button>
          <button className="btn btn-primary" onClick={this.back} ng-click="">
            Back
          </button>
        </div>

        {/* <div  id="crdiv" className="hide" >sgfsdgfsd</div> */}

        <div id="crdiv" className="hide grid">
          <div className="leftbar">
            <img src="{{ ctrl.profileSrc }}" alt="" className="img-width" />
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
                ng-model="teacher.uploadPhoto"
                className="border-plugin input-width"
                type="text"
                maxLength={255}
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Employee Id:</label>
              <input
                ng-model="teacher.employeeId"
                className="border-plugin input-width"
                required
                type="number"
                name="employeeid"
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Designation:</label>
              <input
                ng-model="teacher.designation"
                className="border-plugin input-width"
                type="text"
                maxLength={255}
                required
                name="designation"
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Staff Type:</label>
              <select
                ng-model="teacher.staffType"
                ng-options="f for f in ['TEACHING', 'NONTEACHING', 'GUEST']"
                className="border-plugin"
              />
            </div>
            <div className="form-justify">
              <label htmlFor="">*Department:</label>
              <select
                className="gf-form-input border-plugin"
                ng-model="teacher.departmentId"
              >
                {/* <option ng-repeat="department in ctrl.departments" value="{{ department.id }}"> {{ department.name }}</option> */}
              </select>
            </div>
            <div className="form-justify">
              <label htmlFor="">*Branch:</label>
              <select className="gf-form-input border-plugin" ng-model="teacher.branchId">
                {/* <option ng-repeat="branch in ctrl.branches" value="{{ branch.id }}"> {{ branch.branchName }}</option> */}
              </select>
            </div>
            <div className="form-justify">
              <span>*Status:</span>
              <label className="switch">
                <input
                  type="checkbox"
                  ng-model="teacher.status"
                  ng-true-value="'ACTIVE'"
                  ng-false-value="'DEACTIVE'"
                />{' '}
                <span className="slider" />
              </label>
            </div>
          </div>
          <div className="rightbar">
            <div className="bg-heading p-s5 b-1 staff-flex">
              <h6 className="pt-bold">Personal Details</h6>
              {/* <div>
          <a ng-className="{'hide':ctrl.activeTabPersonalIndex === 1}" ng-click="ctrl.activateTabPersonal(1)"><i
              className="fa fa-plus"></i></a>
          <a ng-className="{'hide':ctrl.activeTabPersonalIndex !== 1}" ng-click="ctrl.activateTabPersonal(0)"><i
              className="fa fa-minus"></i></a>
        </div> */}
            </div>
            <div>
              <div className="form-grid">
                <div>
                  <label htmlFor="">Name*</label>
                  <input
                    ng-model="teacher.teacherName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="sfname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Middle Name*</label>
                  <input
                    ng-model="teacher.teacherMiddleName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="mname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Last Name*</label>
                  <input
                    ng-model="teacher.teacherLastName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="lname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Father Name*</label>
                  <input
                    ng-model="teacher.fatherName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="ffname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Father Middle Name*</label>
                  <input
                    ng-model="teacher.fatherMiddleName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="fmname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Father Last Name*</label>
                  <input
                    ng-model="teacher.fatherLastName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="flname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Spouse Name*</label>
                  <input
                    ng-model="teacher.spouseName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="sname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Spouse Middle Name*</label>
                  <input
                    ng-model="teacher.spouseMiddleName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="smname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Spouse Last Name*</label>
                  <input
                    ng-model="teacher.spouseLastName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="slname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Mother Name*</label>
                  <input
                    ng-model="teacher.motherName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="mfname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Mother Middle Name*</label>
                  <input
                    ng-model="teacher.motherMiddleName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="mmname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Mother Last Name*</label>
                  <input
                    ng-model="teacher.motherLastName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="mlname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Adhar No*</label>
                  <input
                    ng-model="teacher.aadharNo"
                    className="border-plugin fwidth"
                    type="text"
                    name="adhar"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Date Of Birth*</label>
                  <input
                    ng-model="teacher.dateOfBirth"
                    className="border-plugin fwidth"
                    type="date"
                  />
                </div>
                <div>
                  <label htmlFor="">Place Of Birth*</label>
                  <input
                    ng-model="teacher.placeOfBirth"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="pob"
                    ng-pattern="/^[a-zA-Z ]+$/"
                  />
                  {/* <span className="form-error" ng-show="teacherForm.pob.$error.pattern">Place Of Birth</span> */}
                </div>
                <div>
                  <label htmlFor="">Religion*</label>
                  <select
                    ng-model="teacher.religion"
                    ng-options="f for f in ['HINDU', 'MUSLIM', 'CHRISTIAN']"
                    className="gf-form-input border-plugin"
                  />
                </div>
                <div>
                  <label htmlFor="">Caste*</label>
                  <select
                    ng-model="teacher.caste"
                    ng-options="f for f in ['OC', 'BC', 'SC', 'ST']"
                    className="gf-form-input border-plugin"
                  />
                </div>
                <div>
                  <label htmlFor="">Subcaste*</label>
                  <input
                    ng-model="teacher.subCaste"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="subcaste"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Age*</label>
                  <input
                    ng-model="teacher.age"
                    className="border-plugin fwidth"
                    required
                    name="age"
                    type="text"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Sex*</label>
                  <select
                    ng-model="teacher.sex"
                    ng-options="f for f in ['MALE', 'FEMALE']"
                    className="gf-form-input border-plugin"
                  />
                </div>
                <div>
                  <label htmlFor="">Blood Group*</label>
                  <select
                    ng-model="teacher.bloodGroup"
                    ng-options="f for f in ['ABPOSITIVE','ABNEGATIVE','OPOSITIVE','BPOSITIVE','BNEGATIVE']"
                    className="gf-form-input border-plugin"
                  />
                </div>
              </div>
            </div>
            <div className="bg-heading p-s5 b-1 staff-flex">
              <h6 className="pt-bold">Contact Details</h6>
              {/* <div>
          <a ng-className="{'hide':ctrl.activeTabContactIndex === 1}" ng-click="ctrl.activateTabContact(1)"><i
              className="fa fa-plus"></i></a>
          <a ng-className="{'hide':ctrl.activeTabContactIndex !== 1}" ng-click="ctrl.activateTabContact(0)"><i
              className="fa fa-minus"></i></a>
        </div> */}
            </div>
            <div>
              <div className="form-grid">
                <div>
                  <label htmlFor="">Address Line 1*</label>
                  <input
                    ng-model="teacher.addressLineOne"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="adr1"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Address Line 2</label>
                  <input
                    ng-model="teacher.addressLineTwo"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="adr2"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Address Line 3</label>
                  <input
                    ng-model="teacher.addressLineThree"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="adr3"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Town*</label>
                  <input
                    ng-model="teacher.town"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stftown"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">State*</label>
                  <input
                    ng-model="teacher.state"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfstate"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Country*</label>
                  <input
                    ng-model="teacher.country"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfcountry"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Pin Code*</label>
                  <input
                    ng-model="teacher.pincode"
                    className="border-plugin fwidth"
                    type="number"
                    name="stfpin"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Contact Number*</label>
                  <input
                    ng-model="teacher.teacherContactNumber"
                    className="border-plugin fwidth"
                    type="number"
                    name="stfcont"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Alternate Contact Number 1</label>
                  <input
                    ng-model="teacher.alternateContactNumber"
                    className="border-plugin fwidth"
                    type="number"
                    name="stfaltcont"
                    required
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Email Address*</label>
                  <input
                    ng-model="teacher.teacherEmailAddress"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfemail"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Alternate Email Address</label>
                  <input
                    ng-model="teacher.alternateEmailAddress"
                    className="border-plugin fwidth"
                    type="email"
                    required
                    name="stfaltemail"
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
            <div className="bg-heading p-s5 b-1 staff-flex">
              <h6 className="pt-bold">Primary And Emergency contact Details</h6>
              {/* <div>
          <a ng-className="{'hide':ctrl.activeTabPrimaryIndex === 1}" ng-click="ctrl.activateTabPrimary(1)"><i
              className="fa fa-plus"></i></a>
          <a ng-className="{'hide':ctrl.activeTabPrimaryIndex !== 1}" ng-click="ctrl.activateTabPrimary(0)"><i
              className="fa fa-minus"></i></a>
        </div> */}
            </div>

            <div>
              <div className="reln">
                <label htmlFor="">Relation with Staff*</label>
                <select
                  ng-model="teacher.relationWithStaff"
                  ng-options="f for f in ['FATHER','MOTHER','GUARDIAN']"
                  className="gf-form-input border-plugin"
                />
              </div>
              <div className="form-grid">
                <div>
                  <label htmlFor="">Name*</label>
                  <input
                    ng-model="teacher.emergencyContactName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfpname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Middle Name*</label>
                  <input
                    ng-model="teacher.emergencyContactMiddleName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfpmname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Last Name*</label>
                  <input
                    ng-model="teacher.emergencyContactLastName"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfplname"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Contact Number*</label>
                  <input
                    ng-model="teacher.emergencyContactNo"
                    className="border-plugin fwidth"
                    type="text"
                    required
                    name="stfpcn"
                    maxLength={255}
                  />
                </div>
                <div>
                  <label htmlFor="">Email Address*</label>
                  <input
                    ng-model="teacher.emergencyContactEmailAddress"
                    className="border-plugin fwidth"
                    type="email"
                    required
                    name="stfpemail"
                    maxLength={255}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* direct page */}
        <div id="lidiv" className="hide p-1 page-body legal-entities-main-container">
          <div className="staff-management">
            <div>
              <label htmlFor="">Department</label>
              <select
                className="gf-form-input"
                ng-model="ctrl.departmentId"
                ng-change="ctrl.onChangeFilter()"
              >
                <option value="">Select Department</option>
                {/* <option ng-repeat="department in ctrl.departments" value="{{department.id}}">{{ department.name }}</option> */}
              </select>
            </div>
            <div />
            <div>
              <label htmlFor="">Gender</label>
              <select
                className="gf-form-input"
                ng-model="ctrl.sex"
                ng-change="ctrl.onChangeFilter()"
              >
                <option value="">Select Gender</option>
                <option value="MALE">MALE</option>
                <option value="FEMALE">FEMALE</option>
                <option value="OTHER">OTHER</option>
              </select>
            </div>
            <div>
              <label htmlFor="">Staff Type</label>
              <select
                className="gf-form-input"
                ng-model="ctrl.staffType"
                ng-change="ctrl.onChangeFilter()"
              >
                <option value="">Select Staff Type</option>
                <option value="TEACHING">TEACHING</option>
                <option value="NONTEACHING">NONTEACHING</option>
                <option value="GUEST">GUEST</option>
              </select>
            </div>
            <div className="margin-bott">
              <label htmlFor="">Search</label>
              <input
                type="search"
                ng-model="search.teacherName"
                placeholder="search by name"
              />
            </div>
            <a className="btn btn-success" id="fileType" ng-click="ctrl.exportStaffs();">
              Export
            </a>
          </div>

          <table className="staff-management-table">
            <thead>
              <th>
                {/* <!-- <input type="checkbox" style="width:18px; height: 18px;" ng-model="ctrl.checked" */}
                {/* ng-change="ctrl.onClickCheckbox()" /> --> */}
                <input
                  type="checkbox"
                  ng-model="ctrl.isCheckAll"
                  ng-change="ctrl.checkAllTeachers()"
                  key="teacher.id"
                  id="chk"
                />
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
              <tr
                ng-repeat=" teacher in ctrl.filteredTeachers | filter:search:strict | orderBy:'teacherName'"
                key="teacher.id"
              >
                <td>
                  <input
                    type="checkbox"
                    ng-model="teacher.isChecked"
                    ng-change="ctrl.onTeacherCheckedChange($index)"
                    id="chk"
                  />
                </td>
                <td ng-search=" filter:search" />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                <td />
                {/* <td>{{ teacher.employeeId }}</td>
                                <td>{{ teacher.designation }}</td>
                                <td>{{ teacher.department.name }}</td>
                                <td>{{ teacher.sex }}</td>
                                <td>{{ teacher.staffType }}</td>
                                <td>{{ teacher.contactNo }}</td>
                                <td>{{ teacher.status }}</td> */}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
