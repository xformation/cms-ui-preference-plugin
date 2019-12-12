import * as React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

export class Groups extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isModalOpen: false,
            isAssignRole: false
        };
        this.showModal = this.showModal.bind(this);
        this.showAssign = this.showAssign.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
    }

    
    

    showModal(e: any, bShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow
        }));
    }

    showAssign(e: any, aShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isAssignRole: aShow
        }));
    }

    handleStateChange(e: any) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }

    


    render() {
        const { isModalOpen,isAssignRole } = this.state;
        return (
            <div className="info-container">
                 <div className="border p-1 pb-2">
                <button className="btn btn-primary m-1" onClick={e => this.showModal(e, true)} style={{width: '160px'}}>
                    <i className="fa fa-plus-circle"></i> Create New Group
                </button>
                <button className="btn btn-primary m-1" onClick={e => this.showAssign(e, true)} style={{width: '130px'}}>
                    <i className="fa fa-plus-circle"></i> Assign Role
                </button>
                <button className="btn btn-primary m-1" style={{width: '130px'}}>Search Group</button>
                <input type="text"   placeholder="search group" />
                <Modal isOpen={isModalOpen} className="react-strap-modal-container">
                    <ModalHeader>Create New Group</ModalHeader>
                    <ModalBody className="modal-content">
                        <form className="gf-form-group section m-0 dflex">
                            <div className="modal-fwidth">
                                <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text m-r-1">
                                        <label className="gf-form-label b-0 bg-transparent">VERSION</label>
                                        <input type="text" required className="gf-form-input " placeholder="version" />
                                    </div>
                                    </div>
                                    <div className="mdflex modal-fwidth">
                                    <div className="fwidth-modal-text">
                                        <label className="gf-form-label b-0 bg-transparent">GROUP NAME</label>
                                        <input type="text" required className="gf-form-input " placeholder="group name" />
                                    </div>
                                </div>
                                <div className="fwidth-modal-text modal-fwidth">
                                <div className="fwidth-modal-text">
                                    <label className="gf-form-label b-0 bg-transparent">GROUP DESCRIPTION</label>
                                    <textarea  required className="gf-form-input " placeholder="description" />
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
                                        <input type="text"  className="gf-form-input " placeholder="search group" />
                                    </div>
                                    <label>SELECT ROLE TO ASSIGN</label>
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
                <th>Name</th>
                <th>Roles Assigned</th>
              </tr>
            </thead>
           
          </table>
          </div>
            </div>
        );
    }
}
