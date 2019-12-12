import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class Users extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isImport: false,
            isModalOpen: false,
            isAssignRole: false
        };
        this.showImport = this.showImport.bind(this);
        this.showModal = this.showModal.bind(this);
        this.showAssign = this.showAssign.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    
    showAssign(e: any, aShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isAssignRole: aShow
        }));
    }

    showModal(e: any, bShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow
        }));
    }

    showImport(e: any, iShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isImport: iShow
        }));
    }

    handleStateChange(e: any) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    


    render() {
        const { isModalOpen,isAssignRole,isImport } = this.state;
        return (
            <div className="info-container">
                <div className="border p-1 pb-2">
                <button className="btn btn-primary m-1" onClick={e => this.showImport(e, true)} style={{width: '120px'}}>
                    <i className="fa fa-plus-circle"></i> Import User
                </button>
                <button className="btn btn-primary m-1" onClick={e => this.showModal(e, true)} style={{width: '110px'}}>
                    <i className="fa fa-plus-circle"></i> Add User
                </button>
                <button className="btn btn-primary m-1" style={{width: '100px'}}> Edit User </button>
                 <button className="btn btn-primary m-1" onClick={e => this.showAssign(e, true)} style={{width: '130px'}}>
                    <i className="fa fa-plus-circle"></i> Assign Group
                </button>
                <button className="btn btn-primary m-1" style={{width: '110px'}}>Search Group</button>
                <input type="text"   placeholder="search group" />
                <Modal isOpen={isImport} className="react-strap-modal-container">
                    <ModalHeader>Import User</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="fwidth-modal-text">
                            
                                <label className="gf-form-label b-0 bg-transparent">Import from CMS</label>
						
						<button  className="btn btn-success border-bottom">Import</button>        
                        </div>
                        </form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                    <ModalHeader>Add New</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">EMAIL</label>
                                        <input type="text" required className="gf-form-input " placeholder="Enter Your Email" />
                                    </div>
                                    </div>
                                    <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">CREATE LOGIN ID</label>
                                        <input type="text" required className="gf-form-input " placeholder="Enter Your Username" />
                                    </div>
                                </div>
                                <div className="fwidth-modal-text modal-fwidth">
                                <div className="fwidth-modal-text">
                                    <label className="gf-form-label b-0 bg-transparent">PASSWORD</label>
                                    <input type="text" required className="gf-form-input " placeholder="Enter Your Password" />
                                </div>

                                </div>
                                
                                <div className="m-t-1 text-center">
                                    <button type="submit" className="btn btn-success border-bottom m-1">Save</button>
                                   
                                    <button className="btn btn-danger border-bottom" onClick={(e) => this.showModal(e, false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <Modal isOpen={isAssignRole} className="react-strap-modal-container">
                    <ModalHeader>Assign Group</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
                                <div className="mdflex modal-fwidth">
                                
                                    <div className="fwidth-modal-text">
                                        <input type="text"  className="gf-form-input " placeholder="SEARCH USER" />
                                    </div>
                                    <label>SELECT GROUP TO ASSIGN</label>
                                    </div>
                                    <div className="fwidth-modal-text">
                                        <input type="text"  className="gf-form-input " /> 
                                    </div>
                                    <div className="fwidth-modal-text">
                                    <input type="text"  className="gf-form-input " />
                                   </div>
                                <div className="m-t-1 text-center">
                                    <button type="submit" className="btn btn-success border-bottom m-1">Save</button>
                                   
                                    <button className="btn btn-danger border-bottom" onClick={(e) => this.showAssign(e, false)}>Cancel</button>
                                </div>
                            </div>
                        </form>
                    </ModalBody>
                </Modal>
                <table className="fwidth" >
               <thead >
                <tr>
                <th>User Name</th>
                <th>Email</th>
                <th>Groups assigned to users</th>
              </tr>
            </thead>
           
          </table>
          </div>
            </div>
        );
    }
}
