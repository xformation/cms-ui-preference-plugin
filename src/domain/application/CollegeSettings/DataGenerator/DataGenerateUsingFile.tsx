import * as React from 'react';
import { withApollo } from 'react-apollo';
class DataGenerateUsingFile extends React.Component<any, any> {
    const={}=this.state;
    constructor(props:any){
        super(props);
        this.state= {
            entity: null,
            sourceFile: null,
            fileContent: null,
            activeTab: 0,
            iteration:null,
            delayFrequency:null,
            frequencyType:null,
            startDate:null,
            endDate:null,
            kafkaTopics:{
                'student':'student',
                'employee':'employee',
                'admission':'admission'

            },
            kafkaTopic:null,
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
            if(this.state.kafkaTopics.hasOwnProperty(e.target.value)){
                this.setState({
                    kafkaTopic:this.state.kafkaTopics[e.target.value]
                });
            }
        }
   
    onSelectFile = async (e:any) =>{
        e.preventDefault();
        const fileReder = new FileReader();
        fileReder.onload = async (e: any) => {
            const text = e.target.result
            this.setState({ 
                fileContent: text 
            });
        };
        fileReder.readAsText(e.target.files[0]);
    }


    sendData=()=>{
       let content:any;
       // let content:any;
    //    let fileReader = new FileReader();
    //    fileReader.onloadend = (e: any) => {
    //     content = fileReader.result;
    //     console.log(content)
    //     // … do something with the 'content' …
    //    };
    //    fileReader.readAsText(this.state.selectedFile);
    //    console.log("result"+fileReader.result) 

        const { entity, 
            fileContent,
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
            data.append('fileContent',fileContent);
            data.append("iteration",iteration);
            data.append("delayFrequency",delayFrequency);
            data.append("frequencyType",frequencyType);
            data.append("startDate",startDate);
            data.append("endDate",endDate);
           const res= fetch('http://localhost:8190/dataGenerator/upload', {
                method: 'post',
                body: data,
              })
                .then((response) => response.json());

                alert(res);

    }
    toggleTab=(tabNo: any)=> {
        this.setState({
          activeTab: tabNo,
        });
      }
    render() {
        const {entity,kafkaTopic,iteration,delayFrequency,frequencyType,startDate,endDate} = this.state;
        const style2:any={
            float: 'left important'
        }
   
        return (
            < >
                    <div className="div-width-50">
                    <h5 className="form-h5">Select Entity</h5>
                    <div className="gf-form m-b-1">
                        <select name="entity"  onChange={this.onChange} value={entity} className="gf-form-input max-width-18">
                        <option key={""} value={""}>Select</option>
                                <option key={"student"} value={"student"}>student</option>
                                <option key={"employee"} value={"employee"}>employee</option>
                                <option key={"admission"} value={"admission"}>employee</option>
                        </select>
                    </div>
                    <div className="gf-form m-b-1">
                            <h5 className="form-h5">Kafka topic: {kafkaTopic}</h5>
                    </div>
                    
                    <h5 className="form-h5 mt-1">Upload Source Json</h5>   <input type="file"  onChange={this.onSelectFile} className="input-json-file"   name="sourceFile" />
                    <div className="logo-container d-flex m-b-1 mt-1">

                        {/* <div className="gf-form m-b-1">
                            <label className="upload-cursor">
                                <input id="d-none" type="file"  onChange={this.onSelectFile} className="gf-form-file-input"   name="sourceFile" />
                                Upload <i className="fa fa-info-circle l-grey"></i>
                            </label>
                        </div> */}
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
export default withApollo(DataGenerateUsingFile)