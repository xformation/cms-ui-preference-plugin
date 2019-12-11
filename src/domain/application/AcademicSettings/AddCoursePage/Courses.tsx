import * as React from 'react';
import { graphql, MutationFunc } from 'react-apollo';

export class Courses extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            isModalOpen: false,
            states: [],
            cities: [],
            selectedState: "",
            selectedCity: ""
        };
        this.showModal = this.showModal.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);

    }

    // componentDidMount() {


    showModal(e: any, bShow: boolean) {
        e && e.preventDefault();
        this.setState(() => ({
            isModalOpen: bShow
        }));
    }

    handleStateChange(e: any) {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    }



    render() {
        const { isModalOpen } = this.state;
        return (

            <div className="info-container">
                <div className="authorized-signatory-container m-b-1">
                    <h3>Academic Courses</h3>
                    <a className="btn btn-primary" ng-click="">Assign</a>
                </div>
                <table id="academic" className="fwidth">

                    <thead>
                        {/* <th><input type="checkbox"></th> */}
                        <th>Course Name</th>
                        <th>Fees</th>
                        <th>Duration</th>
                    </thead>
                    <tbody>
                        <tr>
                            {/* <td>
                                <input type="checkbox">
                            </td> */}
                            <td>
                                Course 1
                                </td>
                            <td>
                                200
                                    </td>
                            <td>
                                1 year
                                </td>
                        </tr>
                    </tbody>
                </table>
            </div>





        );
    }
}
