import * as React from 'react';
// import { collegeSettingsServices } from '../../../_services/collegeSettings.services';
import { withApollo } from 'react-apollo';

class DataGenerateUsingInputs extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            entity: null,
            kafkaTopic: null,
            jsonContent: null,
            activeTab: 0,
            iteration:null,
            delayFrequency:null,
            frequencyType:null,
            startDate:null,
            endDate:null,
        }
    }
    isANumber=(e:any)=>{
        if(e.target.name=="iteration"){
        if((e.target.value).match("^[0-9]*$")==null||(e.target.value).match("^[0-9]*$")==""){
            let iterationMsg:any=document.getElementById("iterationMsg");
            iterationMsg.innerText="Please Enter Integer Value";
        }else{
            let iterationMsg:any=document.getElementById("iterationMsg");
            iterationMsg.innerText="";
        }
    }
        if(e.target.name=="delayFrequency"){
            if((e.target.value).match("^[0-9]*$")==null||(e.target.value).match("^[0-9]*$")==""){
                let delayFrequencyMsg:any=document.getElementById("delayFrequencyMsg");
                delayFrequencyMsg.innerText="Please Enter Integer Value";
            }else{
                let delayFrequencyMsg:any=document.getElementById("delayFrequencyMsg");
                delayFrequencyMsg.innerText="";
            }
        }
}
    onChange=(e:any)=>{
          const {name,value}=e.target;
            this.setState({
                [name]:value
            })
        }


    sendData = () => {

        const { entity, 
            jsonContent,
            iteration,
            delayFrequency,
            frequencyType,
            startDate,
            endDate,kafkaTopic }=this.state;
            if(iteration!=null && delayFrequency==null){
                //document.querySelector("#delayFrequencyMsg")?.innerHTML="";
                let delayFrequencyMsg:any=document.getElementById("delayFrequencyMsg");
                delayFrequencyMsg.innerText="Please Enter Delay Frequency";
                return;
            }else{
                let delayFrequencyMsg:any=document.getElementById("delayFrequencyMsg");
                delayFrequencyMsg.innerText="";
            }
            if(frequencyType==null && delayFrequency!=null){
                let frequencyTypeMsg:any=document.getElementById("frequencyTypeMsg");
                frequencyTypeMsg.innerText="Please Select Frequency Type";
                return;
            }else{
                let frequencyTypeMsg:any=document.getElementById("frequencyTypeMsg");
                frequencyTypeMsg.innerText="";
            }
            if(iteration==null && delayFrequency!=null){
                let iterationId=document.getElementById("iteration");
                let iterationMsg:any=document.getElementById("iterationMsg");
                iterationMsg.innerText="Please Enter Iteration";
                return;
            }else{
                let iterationMsg:any=document.getElementById("iterationMsg");
                iterationMsg.innerText="";
            }
            if(startDate!=null && endDate==null){
                let endDateMsg:any=document.getElementById("endDateMsg");
                endDateMsg.innerText="Please Select End Date";
                return;
            }else{
                let endDateMsg:any=document.getElementById("endDateMsg");
                endDateMsg.innerText="";
            }
            if(startDate!=null && endDate==null){
                let startDateMsg:any=document.getElementById("startDateMsg");
                startDateMsg.innerText="Please Select Start Date";
                return;
            }else{
                let startDateMsg:any=document.getElementById("startDateMsg");
                startDateMsg.innerText="";
            }
            const data=new FormData();
            data.append('kafkaTopic',kafkaTopic);
            data.append('entity',entity);
            data.append('fileContent',jsonContent);
            data.append("iteration",iteration);
            data.append("delayFrequency",delayFrequency);
            data.append("frequencyType",frequencyType);
            data.append("startDate",startDate);
            data.append("endDate",endDate);
        const res = fetch('http://localhost:8190/dataGenerator/usinginputs', {
            method: 'post',
            body: data,
        })
            .then((response) => response.json());

        alert(res);

    }
    render() {
        const {entity,kafkaTopic,jsonContent,iteration,delayFrequency,frequencyType,startDate,endDate} = this.state
        const jsonSchema=`[
            '{{repeat(2)}}',
            {
                "studentId": "{{integer(1,1000)}}",
                "name": "{{firstName()}}",
                "address": "{{state()}}",
                "branch": "{{random("Hye Eng College","Del Eng College")}}",
                "department": "{{random("Computer Science","Civil Engineering", "Chemical Engineering")}}",
                "cellPhoneNo": "{{phone()}}",
                "section": "{{random("A","B", "C", "D")}}",
                "gender": "{{random("Male","Female")}}",
                "batch": "{{random("FirstYear", "SecondYear", "ThirdYear", "FourthYear", "FifthYear")}}",
                "emailId": "{{firstName()}}@aa.com",
                "totalFee": "{{integer(1,10000)}}",
                "depositedFee": "{{integer(1,1000)}}",
                "remainingFee": "{{integer(1,1000)}}",
                "academicYear": "2020-2021"				
            }	
        ]`;
        return (
            < >
            <div className="div-width-50">
                <h5 className="form-h5">Entity</h5>
                <div className="gf-form m-b-1">
                    <input type="text" className="gf-form-input max-width-18" placeholder="Entity Name" maxLength={255} required={true} name="entity" value={entity} onChange={this.onChange} />
                </div>
                <h5 className="form-h5">Kafka topic</h5>
                <div className="gf-form m-b-1">
                    <input type="text" className="gf-form-input max-width-18" placeholder="Topic Name" maxLength={255} required={true} name="kafkaTopic" value={kafkaTopic} onChange={this.onChange} />
                </div>
                <h5 className="form-h5">Source json Schema </h5>
                <div className="gf-form m-b-1">
                    <textarea className="gf-form-input max-width-18" style={{height:129}} placeholder={jsonSchema}  required={true} name="jsonContent" value={jsonContent} onChange={this.onChange}>

                    </textarea>
                </div>
                </div>
                <div className="div-width-50">
                    <h5 className="form-h5">Number Of Iteration</h5>
                        <div className="gf-form m-b-1">
                        <input type="number" id="iteration"  className="gf-form-input max-width-18" placeholder="Number of Iteration" onChange={this.onChange}  onKeyUp={this.isANumber} name="iteration" value={iteration}/> 
                        <span className="errorMsg" id="iterationMsg"></span>
                        </div>
                    
                    
                        <h5 className="form-h5">Delay Frequency</h5>
                        <div className="gf-form m-b-1">
                        <input type="number" className="gf-form-input max-width-18" placeholder="Delay Frequency" onChange={this.onChange} onKeyUp={this.isANumber}  name="delayFrequency" value={delayFrequency}/> 
                        <span  className="errorMsg"  id="delayFrequencyMsg"></span>
                       </div>
                       <div className="gf-form m-b-1">
                        <select name="frequencyType" onChange={this.onChange}   value={frequencyType} className="gf-form-input max-width-18">
                        <option key={""} value={""}>Select Frequency Type</option>
                                <option key={"Second"} value={"Second"}>Second</option>
                                <option key={"Minutes"} value={"Minutes"}>Minutes</option>
                                <option key={"Hours"} value={"Hours"}>Hours</option>
                        </select>
                        <span  className="errorMsg"  id="frequencyTypeMsg"></span>
                        </div>
                        <h5 className="form-h5">Start Date</h5>
                        <div className="gf-form m-b-1">
                        <input type="date" className="gf-form-input max-width-18"  placeholder="Delay Frequency" onChange={this.onChange}   name="startDate" value={startDate}/> 
                        <span  className="errorMsg"  id="startDateMsg"></span>
                       </div>
                       <h5 className="form-h5">End Date</h5>
                        <div className="gf-form m-b-1">
                        <input type="date" className="gf-form-input max-width-18" placeholder="Delay Frequency" onChange={this.onChange}   name="endDate" value={endDate}/> 
                        <span  className="errorMsg"  id="endDateMsg"></span>
                       </div>
                    <div className="gf-form-button-row">
                        <input type="button" onClick={this.sendData} id="btnAddCollege" value="Generate"  className="btn btn-primary save-all-forms-btn"></input>
                    </div>
                   
                        </div>

            </>
        );
    }
};

export default withApollo(DataGenerateUsingInputs)