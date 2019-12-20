import * as React from 'react';
import {Modal, ModalHeader, ModalBody, ModalFooter} from 'reactstrap';

export class Permissions extends React.Component<any, any> {
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
        <div className="border p-1 pb-2">
          {/* <div className="col-md-8"> */}

          <div className="m-b-1" style={{float: 'right'}}>
            <button
              className="btn btn-primary m-1 width-14 m-r-1"
              onClick={e => this.showModal(e, true)}
            >
              <i className="fa fa-plus-circle mr-1" /> Create New Permission
            </button>
            <button className="btn btn-primary m-1 m-r-1" style={{width: '140px'}}>
              Search Permission
            </button>
            <input type="text" placeholder="search permission" />
          </div>

          {/* </div> */}
          <Modal isOpen={isModalOpen} className="react-strap-modal-container">
            <ModalHeader>Add New</ModalHeader>
            <ModalBody className="modal-content">
              <form className="gf-form-group section m-0 dflex">
                <div className="modal-fwidth">
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">NAME</label>
                      <select className="gf-form-input">
                        <option value="">Select</option>
                      </select>
                    </div>
                  </div>
                  <div className="mdflex modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">
                        PERMISSION
                      </label>
                      <select className="gf-form-input">
                        <option value="">Select</option>
                      </select>
                    </div>
                  </div>
                  <div className="fwidth-modal-text modal-fwidth">
                    <div className="fwidth-modal-text m-r-1 fwidth">
                      <label className="gf-form-label b-0 bg-transparent">
                        DESCRIPTION
                      </label>
                      <textarea
                        required
                        className="gf-form-input "
                        placeholder="description"
                      />
                    </div>
                  </div>

                  <div className="m-t-1 text-center">
                    <button type="submit" className="btn btn-success border-bottom mr-1">
                      Save
                    </button>
                    <button
                      className="btn btn-danger border-bottom mr-1"
                      onClick={e => this.showModal(e, false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </ModalBody>
          </Modal>
          <table className="fwidth" id="feetable">
            <thead>
              <tr>
                <th>Version</th>
                <th>Name</th>
                <th>Permission</th>
                <th>Description</th>
              </tr>
            </thead>
          </table>
        </div>
      </div>
    );
  }
}
