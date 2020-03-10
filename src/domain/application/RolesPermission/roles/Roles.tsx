import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export class Roles extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      isModalOpen: false,
    };
    this.showModal = this.showModal.bind(this);
    this.handleStateChange = this.handleStateChange.bind(this);
  }

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

  render() {
    const {isModalOpen} = this.state;
    return (
      <div className="info-container">
        <div className="border FirstRow p-1">
          <button
            className="btn btn-primary"
            onClick={e => this.showModal(e, true)}
            style={{width: '160px'}}
          >
            <i className="fa fa-plus-circle" /> Create New Role
          </button>
          <Modal isOpen={isModalOpen} className="react-strap-modal-container">
            <ModalHeader>Add New</ModalHeader>
            <ModalBody className="modal-content">
              <form className="gf-form-group section m-0 dflex">
                <div className="modal-fwidth">
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">VERSION</label>
                      <input type="text" required className="gf-form-input " />
                    </div>
                  </div>
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">
                        ROLE NAME
                      </label>
                      <input type="text" required className="gf-form-input " />
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">
                        ROLE DESCRIPTION
                      </label>
                      <textarea required className="gf-form-input " />
                    </div>
                  </div>

                  <div className="m-t-1 text-center">
                    <button type="submit" className="btn btn-success border-bottom mr-1">
                      Save
                    </button>

                    <button
                      className="btn btn-danger border-bottom"
                      onClick={e => this.showModal(e, false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
        </div>
        <hr />
        <div className="transition-preference-label">Set transition preferences</div>
        <div className="border FirstRow p-1">
          <div className="m-t-1 text-center">
            <button type="submit" className="btn btn-success border-bottom mr-1">
              APPLY
            </button>
            <button className="btn btn-danger border-bottom">Cancel</button>
          </div>
        </div>
      </div>
    );
  }
}
