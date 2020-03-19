import * as React from 'react';
import { withApollo } from 'react-apollo';
import {MessageBox} from '../../Message/MessageBox'
import { commonFunctions } from '../../_utilites/common.functions';
import { paymentSettingsServices } from '../../_services/paymentSettings.service';
import {config} from '../../config';
import * as browserHistory  from 'react-router';

const ERROR_MESSAGE_MANDATORY_FIELD_MISSING = "Mandatory fields missing";

interface PaymentProp extends React.HTMLAttributes<HTMLElement>{
    [data: string]: any;
}

class PaymentInput extends React.Component<PaymentProp, any> {
    
    constructor(props: PaymentProp) {
        super(props);
        this.state = {
            URL_PARAMS:  new URLSearchParams(location.search),
            amount: null,
            errorMessage: "", 
            successMessage: "",
            paymentRequestMessage: {},
            paymentResponseMessage: {},
            txnRefNo: '',
            txnStatus: '',
            txnDate: '',
            txnAmt: '',
        };
        this.handleStateChange = this.handleStateChange.bind(this);
        this.isMandatoryField = this.isMandatoryField.bind(this);
        this.validate = this.validate.bind(this);
        this.getMessage = this.getMessage.bind(this);
        this.doPayment = this.doPayment.bind(this);
    }

    async componentDidMount(){
        let sUser = this.state.URL_PARAMS.get("signedInUser"); 
        if( sUser !== "null" && sUser !== null && sUser !== undefined){
            sessionStorage.setItem("signedInUser", sUser);
        }
        const txnRefNo = this.state.URL_PARAMS.get('txnRefNo');
        if(txnRefNo !== null && txnRefNo !== undefined && txnRefNo !== ""){
            this.setState({
                txnRefNo: txnRefNo,
                txnStatus: this.state.URL_PARAMS.get('txnStatus'),
                txnDate: this.state.URL_PARAMS.get('txnDate'),
                txnAmt: this.state.URL_PARAMS.get('txnAmt'),
            });
        }
    }

    handleStateChange(e: any) {
        const { name, value } = e.nativeEvent.target;
        this.setState({
            [name]: value
        });
    }

    isMandatoryField(objValue: any, obj: any){
        let erroMsg = "";
        if(objValue === undefined || objValue === null || objValue.trim() === ""){
          let tempVal = "";
          commonFunctions.changeTextBoxBorderToError(tempVal, obj);
          erroMsg = ERROR_MESSAGE_MANDATORY_FIELD_MISSING;
        }
        return erroMsg;
    }
    
    validate(){
        const {amount} = this.state;
        let errorMessage = this.isMandatoryField(amount, "amount");
        this.setState({
          errorMessage: errorMessage
        });
        if(errorMessage !== "") {
          return false;
        }
        return true;
    }
    
    async getMessage() {
        const {amount} = this.state;
        if(!this.validate()){
          return;
        }
        console.log('moving to payment gateway');
        await paymentSettingsServices.getMessage(amount).then(response => {
          console.log('Api response payment msg: ', response);
          this.setState({
            paymentRequestMessage: response,
          });
        });
        await this.doPayment();
    }
    async doPayment(){
        localStorage.setItem("signedInUser", this.state.URL_PARAMS.get('signedInUser'));
        const{paymentRequestMessage} = this.state;
        window.location.href = config.PAYMENT_GATEWAY_URL + '?msg=' + paymentRequestMessage.statusDesc;
    }

    render() {
        const { amount, errorMessage, successMessage, txnRefNo, txnStatus, txnDate, txnAmt } = this.state;
        console.log("txnRefNo ---------------------- ",txnRefNo);
        if(txnRefNo !== null && txnRefNo !== undefined && txnRefNo !== '') {
            return (
                <main>  
                    <div className="info-container">
                        <div className="fwidth section-to-print">
                            <form name="pmtRsp" className="payment-container" method="POST">
                                <div className="dflex">
                                <h1>Payment Status</h1>
                                {/* <button className="btn btn-primary dont-print" onClick={print()}>Print</button> */}
                                </div>
                                <table className="fwidth" id="paymt-border">
                                <tr>
                                    <td><label className="gf-form-label b-0 bg-transparent">Transaction Status:</label></td>
                                    <td><label className="gf-form-label b-0 bg-transparent">{txnStatus === '0300' || txnStatus === '0301' ? 'Transaction Successful' : 'Transaction Failed'}</label></td>
                                </tr>
                                <tr>
                                    <td><label className="gf-form-label b-0 bg-transparent">Transaction Reference No:</label></td>
                                    <td><label className="gf-form-label b-0 bg-transparent">{txnRefNo}</label></td>
                                </tr>
                                <tr>
                                    <td><label className="gf-form-label b-0 bg-transparent">Transaction Date:</label></td>
                                    <td><label className="gf-form-label b-0 bg-transparent">{txnDate}</label></td>
                                </tr>
                                <tr>
                                    <td><label className="gf-form-label b-0 bg-transparent">Transaction Amount:</label></td>
                                    <td><label className="gf-form-label b-0 bg-transparent">{txnAmt}</label></td>
                                </tr>
                                </table>
                            </form>
                        </div>
                    </div>
                </main>
                
            );
        }else {    
            return (
                <main>  
                    <div className="info-container">
                    {
                        errorMessage !== ""  ? <MessageBox id="mbox" message={errorMessage} activeTab={2}/> : null
                    }
                    {
                        successMessage !== ""  ? <MessageBox id="mbox" message={successMessage} activeTab={1}/> : null
                    }
                    </div>
                    <div className="info-container">
                        <div className="authorized-signatory-container m-t-1 m-b-1"><h3>Make a Secure Payment</h3></div>
                    </div>
                    <div className="info-container">
                        <table style={{border:'none'}}>
                            <tr style={{border:'none'}}>
                                <td style={{border:'none'}}><input type="number" className="gf-form-input" style={{width:'300px'}} placeholder="Enter amount" name="amount" id="amount" value={amount} onChange={this.handleStateChange}/></td>
                                <td style={{border:'none'}}><input onClick={this.getMessage} className="btn btn-primary cust-h-w" type="button" id="btnPay" value="Pay" /></td>
                            </tr>
                        </table>
                    </div>
                </main>
                
            );
        }
    }
};

export default withApollo(PaymentInput)