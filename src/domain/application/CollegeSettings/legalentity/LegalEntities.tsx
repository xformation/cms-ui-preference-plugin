import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { collegeSettingsServices } from '../../_services/collegeSettings.services';



export class LegalEntities extends React.Component<any, any> {
	DEFAULT_LOGO = '/public/img/college_logo.png';
	constructor(props: any) {
		super(props);
		this.state = {
			activeTab: 0,
			logoSrc: '',
			isModalOpen: false,
			isModalOpen1: false,
			states: [],
			cities: [],
			selectedState: '',
			selectedCity: ''
		};
		this.toggleTab = this.toggleTab.bind(this);
		this.showModal = this.showModal.bind(this);
		this.showModalNew = this.showModalNew.bind(this);
		this.handleStateChange = this.handleStateChange.bind(this);
		this.createCitySelectbox = this.createCitySelectbox.bind(this);
		this.handleImageChange = this.handleImageChange.bind(this);
	}

	toggleTab(tabNo: any) {
		this.setState({
			activeTab: tabNo
		});
	}

	componentDidMount() {
		collegeSettingsServices.getStates().then(
			(response) => {
				this.setState({
					states: response
				});
			},
			(error) => {
				console.log(error);
			}
		);
		collegeSettingsServices.getCities().then(
			(response) => {
				this.setState({
					cities: response
				});
			},
			(error) => {
				console.log(error);
			}
		);
	}

	handleImageChange(e: any) {
		const { files, name } = e.target;
		if (files.length > 0) {
			const result = this.toBase64(files[0]);
			result
				.then((base64) => {
					this.setState({
						[name]: base64
					});
				})
				.catch(() => { });
		} else {
			this.setState({
				[name]: null
			});
		}
	}

	toBase64(file: any) {
		return new Promise((resolve: any, reject: any) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	}

	showModal(e: any, bShow: boolean) {
		e && e.preventDefault();
		this.setState(() => ({
			isModalOpen: bShow
		}));
	}

	showModalNew(e: any, bShow: boolean) {
		e && e.preventDefault();
		this.setState(() => ({
			isModalOpen1: bShow
		}));
	}

	handleStateChange(e: any) {
		const { name, value } = e.target;
		this.setState({
			[name]: value
		});
	}

	createCitySelectbox(selectedState: any) {
		const { cities } = this.state;
		let retData = [];
		selectedState = parseInt(selectedState);
		for (let i = 0; i < cities.length; i++) {
			let city = cities[i];
			if (selectedState === city.stateId) {
				retData.push(
					<option key={city.id} value={city.id}>
						{city.cityName}
					</option>
				);
			}
		}
		return retData;
	}

	render() {
		const {
			logoSrc,
			isModalOpen,
			isModalOpen1,
			states,
			cities,
			selectedState,
			selectedCity,
			activeTab
		} = this.state;
		return (
			<div className="info-container">
				<div className="authorized-signatory-container m-b-1">
					<h3>Legal Entity</h3>
					<small>
						A Legal Entity is the registered name of your institution. This name is used in all documents
						such as pay slip, offer letter etc.
					</small>
				</div>
				<div className="max-width-18">
					<h5 className="form-h5">COLLEGE</h5>
					<select className="gf-form-input" required>
						<option value="">Select College</option>
					</select>
				</div>
				<div className="logo-container d-flex m-b-1 mt-1">
					<img className="logo m-b-1" src={logoSrc || this.DEFAULT_LOGO} />
					<div className="gf-form m-b-1">
						<label className="upload-cursor">
							<input
								id="d-none"
								type="file"
								className="gf-form-file-input"
								accept="image/*"
								onChange={this.handleImageChange}
								name="logoSrc"
							/>
							LEGAL ENTITY
						</label>
					</div>
				</div>
				<div className="s-flex">
					<h5 className="form-h5">AUTHORIZED SIGNATORY</h5>
					<div className="tile">
						<a onClick={(e) => this.showModalNew(e, true)} className="upload-cursor">
							+ Add New Signatory
						</a>
					</div>
				</div>
				<div className="signatory-list">
					<div className="tile m-r-2 ">
						<div className="tile-circle yellow">
							<b>1</b>
						</div>
						<div className="tile-right-part">
							<div className="tile-name">
								<span>Signatory Name</span>
							</div>
							<div className="tile-info">DESIGNATION</div>
						</div>
					</div>
				</div>
				<div className="clearfix" />
				<Modal isOpen={isModalOpen1} className="react-strap-modal-container">
					<ModalHeader>Add New Signatory</ModalHeader>
					<ModalBody className="modal-content">
						<form className="gf-form-group section m-0 dflex">
							<div className="modal-fwidth">
								<div className="mdflex modal-fwidth">
									<div className="fwidth-modal-text m-r-1">
										<label className="gf-form-label b-0 bg-transparent">SIGNATORY NAME</label>
										<input
											type="text"
											required
											className="gf-form-input"
											placeholder="signatory name"
										/>
									</div>
									<div className="fwidth-modal-text m-r-1">
										<label className="gf-form-label b-0 bg-transparent">
											SIGNATORY FATHER NAME
										</label>
										<input
											type="text"
											required
											className="gf-form-input"
											placeholder="signatory father name"
										/>
									</div>
									<div className="fwidth-modal-text">
										<label className="gf-form-label b-0 bg-transparent">
											SIGNATORY DESIGNATION
										</label>
										<input
											type="text"
											required
											className="gf-form-input"
											placeholder="signatory designation"
										/>
									</div>
								</div>
								<div className="fwidth-modal-text modal-fwidth">
									<label className="gf-form-label b-0 bg-transparent">ADDRESS</label>
									<input type="text" required className="gf-form-input " placeholder="" />
									<input type="text" required className="gf-form-input m-t-1 " placeholder="" />
									<div className="mdflex modal-fwidth m-t-1">
										<input type="text" required className="gf-form-input m-r-1" placeholder="" />
										<input type="text" required className="gf-form-input m-r-1" placeholder="" />
										<input type="text" required className="gf-form-input " placeholder="" />
									</div>
								</div>

								<div className="mdflex modal-fwidth">
									<div className="fwidth-modal-text m-r-1">
										<label className="gf-form-label b-0 bg-transparent">EMAIL</label>
										<input type="text" required className="gf-form-input" placeholder="email" />
									</div>
									<div className="fwidth-modal-text">
										<label className="gf-form-label b-0 bg-transparent">PAN CARD NUMBER</label>
										<input
											type="text"
											required
											className="gf-form-input"
											placeholder="pancard number"
										/>
									</div>
								</div>
								<div className="mdflex modal-fwidth">
									<div className="fwidth-modal-text fwidth">
										<label className="gf-form-label b-0 bg-transparent">BRANCH</label>
										<select className="gf-form-input" required>
											<option value="">Select Branch</option>
										</select>
									</div>
								</div>
								<div className="m-t-1 text-center">
									<button type="submit" className="btn btn-success border-bottom">
										Save
									</button>
									<button type="submit" className="btn btn-success border-bottom">
										Update
									</button>
									<button
										className="btn btn-danger border-bottom"
										onClick={(e) => this.showModalNew(e, false)}
									>
										Cancel
									</button>
								</div>
							</div>
						</form>
					</ModalBody>
				</Modal>

				<div className="s-flex m-t-1">
					<h5 className="form-h5">BANK ACCOUNTS</h5>
					<div className="tile">
						<a onClick={(e) => this.showModal(e, true)} className="upload-cursor">
							+ Add Bank Account
						</a>
					</div>
				</div>
				<div className="signatory-list">
					<div className="tile m-r-2 ">
						<div className="tile-circle SBI">
							<b>&#8377;</b>
						</div>
						<div className="tile-right-part">
							<div className="tile-name">
								<span>SBI</span>
							</div>
							<div className="tile-info">Madhapur</div>
						</div>
					</div>
				</div>
				<Modal isOpen={isModalOpen} className="react-strap-modal-container">
					<ModalHeader>Add Bank Account</ModalHeader>
					<ModalBody className="modal-content">
						<form className="gf-form-group section m-0 dflex">
							<div className="modal-fwidth">
								<div className="mdflex modal-fwidth">
									<div className="fwidth-modal-text m-r-1">
										<label className="gf-form-label b-0 bg-transparent">NAME OF BANK</label>
										<select className="gf-form-input" required>
											<option value="">Select Bank</option>
										</select>
									</div>
									<div className="fwidth-modal-text">
										<label className="gf-form-label b-0 bg-transparent">ACCOUNT NUMBER</label>
										<input type="number" required className="gf-form-input" placeholder="" />
									</div>
								</div>
								<div className="mdflex modal-fwidth">
									<div className="fwidth-modal-text m-r-1">
										<label className="gf-form-label b-0 bg-transparent">TYPE OF ACCOUNT</label>
										<select className="gf-form-input" required>
											<option value="">Select Account Type</option>
										</select>
									</div>
									<div className="fwidth-modal-text">
										<label className="gf-form-label b-0 bg-transparent">IFSC CODE</label>
										<input type="text" required className="gf-form-input" placeholder="" />
									</div>
								</div>
								<div className="mdflex modal-fwidth">
									<div className="fwidth-modal-text m-r-1">
										<label className="gf-form-label b-0 bg-transparent">BRANCH ADDRESS</label>
										<input type="text" required className="gf-form-input" placeholder="" />
									</div>
									<div className="fwidth-modal-text">
										<label className="gf-form-label b-0 bg-transparent">CORPORATE ID</label>
										<input type="text" required className="gf-form-input" placeholder="" />
									</div>
								</div>

								<div className="fwidth-modal-text">
									<label className="gf-form-label b-0 bg-transparent">BRANCH</label>
									<select className="gf-form-input" required>
										<option value="">Select Branch</option>
									</select>
								</div>

								<div className="m-t-1 text-center">
									<button type="submit" className="btn btn-success border-bottom">
										Save
									</button>
									<button type="submit" className="btn btn-success border-bottom">
										Update
									</button>
									<button
										className="btn btn-danger border-bottom"
										onClick={(e) => this.showModal(e, false)}
									>
										Cancel
									</button>
								</div>
							</div>
						</form>
					</ModalBody>
				</Modal>
				<div className="clearfix" />
				<div className="dflex m-b-1 algn-item-center">
					<h5 className="form-h5 m-r-1 fwidth">Registration & Tax information</h5>
					<div className="dflex">
						<select className="gf-form-input m-r-1" required>
							<option value="">Select State</option>
						</select>
						<select className="gf-form-input m-r-1" required>
							<option value="">Select City</option>
						</select>
						<select className="gf-form-input" required>
							<option value="">Select Branch</option>
						</select>
					</div>
				</div>
				<Nav tabs className="" id="rmfloat" >
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
											<label className="gf-form-label b-0 bg-white">LEGAL NAME OF COLLEGE</label>
											<input type="text" className="gf-form-input text-uppercase"
												name="college" placeholder="College Name" required />

										</div>
										<div className="m-b-1 ">
											<div className="m-b-1 ">
												<label className="gf-form-label b-0 bg-white">DATE OF INCORPORATION</label>
												<input type="date" className="gf-form-input "
													required />

											</div>
											<div className="m-b-1 ">
												<label className="gf-form-label b-0 bg-white">COLLEGE IDENTIFICATION NUMBER</label>
												<input type="text" name="idnumber"
													className="gf-form-input text-uppercase" placeholder="CIN1234567" required
												/>

											</div>
										</div>
										<div className="form-right">
											<div className="m-b-1 ">
												<label className="gf-form-label b-0 bg-white ">TYPE OF COLLEGE</label>
												<div className="gf-form-select-wrapper">
													<select ng-model="legalEntity.typeOfCollege" ng-options="f for f in ['PRIVATE', 'PUBLIC']"
														className="gf-form-input" required>
													</select>

												</div>
											</div>
											<div className="m-b-1 ">
												<label className="gf-form-label b-0 bg-white ">REGISTERED OFFICE ADDRESS</label>
												<input type="text" className="gf-form-input"
													placeholder="ADDRESS LINE 1" required name="addr1"
													ng-pattern="/^[\/#.0-9a-zA-Z\s,-]+$/" />

											</div>
											<div className="m-b-1 ">
												<input type="text" className="gf-form-input"
													placeholder="ADDRESS LINE 2" name="addr2" />
											</div>
											<div className="m-b-1 ">
												<input type="text" className="gf-form-input legalWidth"
													name="addr3" required placeholder="ADDRESS LINE 3"
												/>
											</div>
											<div className="flex">

												<div>
													<input type="text" className="gf-form-input legalWidth"
														name="addr4" required placeholder="ADDRESS LINE 4"
													/>

												</div>
												<div>
													<input type="text" className="gf-form-input legalWidth"
														placeholder="Pincode" name="pincode" required
													/>
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
						</div>
					</TabPane>


					<TabPane tabId={1}>
						<div>
							<div className="contnet">
								<div className="gf-form-group section fwidth">
									<div className="m-b-1 width-18">
										<label className="gf-form-label b-0 bg-white ">PAN</label>
										<input type="text" className="gf-form-input text-uppercase"
											placeholder="ABCDE1234H" required name="pan"
										/>

									</div>
									<div className="flex">
										<div className="m-b-1 width-18">
											<label className="gf-form-label b-0 bg-white ">TAN</label>
											<input type="text" className="gf-form-input text-uppercase"
												placeholder="TASN12345H" required name="tan"
											/>


										</div>
										<div className="m-b-1 width-18 mx">
											<label className="gf-form-label b-0 bg-white">TAN CIRCLE NUMBER</label>
											<input type="text" className="gf-form-input text-uppercase"
												placeholder="12345678" name="tancircle" required />


										</div>
										<div className="m-b-1 width-18">
											<label className="gf-form-label b-0 bg-white ">CIT(TDS) LOCATION</label>
											<input type="text" ng-model="legalEntity.citTdsLocation" className="gf-form-input text-uppercase"
												placeholder="CITY NAME" name="city" required ng-pattern='/^[a-zA-Z0-9 ]+$/' />

										</div>
									</div>
									<div className="m-b-1 width-18">
										<label className="gf-form-label b-0 bg-white">FORM 16 SIGNATORY</label>
										<div className="gf-form-select-wrapper">
											<select className="gf-form-input" required>

											</select>

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
					<TabPane tabId={2}>
						<div >
							<div className="contnet">
								<div className="gf-form-group">
									<div className="dflex">
										<div className="form-left">
											<div className="m-b-1">
												<label className="gf-form-label b-0 bg-white ">PF NUMBER</label>
												<input type="text"
													className="gf-form-input text-uppercase" name="pfNumber" placeholder="AP/HYD/1234567" required
												/>


											</div>
											<div className="m-b-1">
												<label className="gf-form-label b-0 bg-white ">SIGNATORY</label>
												<div className="gf-form-select-wrapper">
													<select className="gf-form-input"
														required>

													</select>

												</div>
											</div>
											<div className="m-b-1">
												<label className="gf-form-label b-0 bg-white ">SIGNATORY'S FATHER'S NAME</label>
												<input type="text" disabled className="gf-form-input " />

											</div>
										</div>
										<div className="form-right">
											<div className="m-b-1">
												<label className="gf-form-label b-0 bg-white">REGISTRATION DATE</label>
												<input type="date" className="gf-form-input"
													required />

												<div className="m-b-1">
													<label className="gf-form-label b-0 bg-white">SIGNATORY DESIGNATION</label>
													<input type="text" disabled className="gf-form-input" />
												</div>
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
					<TabPane tabId={3}>

						<div ng-class="{'hide':ctrl.activeTabIndex !== 3}">
							<div className="contnet">
								<div className="gf-form-group">
									<div className="dflex">
										<div className="form-left">
											<div className="m-b-1">
												<label className="gf-form-label b-0 bg-white">ESI NUMBER</label>
												<input type="text" className="gf-form-input"
													placeholder="454876877985465" required name="esi" />

											</div>
											<div className="m-b-1">
												<label className="gf-form-label b-0 bg-white ">SIGNATORY</label>
												<div className="gf-form-select-wrapper">
													<select className="gf-form-input" required>

													</select>

												</div>
												<div className="m-b-1">
													<label className="gf-form-label b-0 bg-white">SIGNATORY'S FATHER'S NAME</label>
													<input type="text" disabled className="gf-form-input" />
												</div>
											</div>
											<div className="form-right">
												<div className="m-b-1">
													<label className="gf-form-label b-0 bg-white">REGISTRATION DATE</label>
													<input type="date" className="gf-form-input"
														required />

													<div className="m-b-1">
														<label className="gf-form-label b-0 bg-white">SIGNATORY DESIGNATION</label>
														<input type="text" disabled className="gf-form-input" />
													</div>
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
						</div>
					</TabPane>
					<TabPane tabId={4}>  <div >
						<div className="contnet">
							<div className="section fwidth">
								<div className="gf-form-group">
									<div className="flex">
										<div className="m-b-1 width-18">
											<label className="gf-form-label b-0 bg-white">PT NUMBER</label>
											<input type="text" className="gf-form-input text-uppercase"
												placeholder="4548768779" name="pt" required />

										</div>
										<div className="m-b-1 width-18 mx">
											<label className="gf-form-label b-0 bg-white">PT REGISTRATION DATE</label>
											<input type="date" className="gf-form-input"
												required />
										</div>
										<div className="m-b-1 width-18">
											<label className="gf-form-label b-0 bg-white">PT SIGNATORY</label>
											<div className="gf-form-select-wrapper">
												<select className="gf-form-input" >

												</select>

											</div>
										</div>
									</div>
									<div className="gf-form-button-row p-r-0">
										<button type="submit" className="btn btn-success border-bottom">Save</button>
										<button type="reset" className="btn btn-danger border-bottom">Clear</button>
									</div>
								</div>
							</div>
						</div>
					</div>

					</TabPane>
				</TabContent>
			</div>
		);
	}
}
