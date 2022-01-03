import React, { Component } from 'react'
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import {Button} from 'react-bootstrap';
import { Redirect } from 'react-router';
import axios from 'axios';


const FormSchema = Yup.object().shape({
    "month": Yup.string(),
    "amount": Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Mount").required("Required")
})

const initialValues = {
    month: '',
    amount: ''
}


export default class CreateBudget extends Component {
    constructor(){
        super();
        this.state = {
            tokenError:false,
            month : '',
            index : 0,
            error: '',
            incomes:[],
            successfulPost: false,
            months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    }

        
    componentDidMount(){
        this.getIncomes();
    }

    //get all incomes
    getIncomes = async() => {
        axios.get(`http://127.0.0.1:5000/income/user/${localStorage.getItem('currentUserId')}`)
       .then(response=>{
        this.setState({incomes:response.data.incomes}, ()=>console.log("fetched all incomes"), console.log(response.data));
        })
   }

    handleSubmit= async({amount})=>{
        
        if(this.state.index == 0)
        {
            alert("Please select a month")
            return
        }
        // await axios.get(`http://127.0.0.1:5000/income/month/${this.state.month}`)
        // .then(response => {
        //      console.log("fetched income for month." + response.data);
        // });
       
        for(let i=0; i<this.state.incomes.length;i++){
            if(this.state.incomes[i].month === this.state.month){
                alert("Budget for this month already exists. Please modify it.")
                return;
            }
        }
       
        await axios.post(`http://127.0.0.1:5000/income`, {
            month:this.state.month,
            amount:amount,
            user_id:localStorage.getItem('currentUserId')
        })
        .then(response=>{
            if (response.data){
                console.log(response.data);
                this.setState({successfulPost:true, error:response.error});
            }
            else{
                this.setState({ error:response.error});
                console.log("Error creating budget : ", response.error);
            }
        })
        
    }

     handlePullDown=(event)=>{
        let selectedindex = event.target.selectedIndex;
        let selectedmonth = event.target.options[event.target.selectedIndex].label;// event.nativeEvent.target[this.index].label;
        this.setState({month:selectedmonth})
        this.setState({index:selectedindex})
        this.setState({successfulPost:false})
     }

    render() {
        return (
            <div>
                {this.state.successfulPost?<p style={{color:"#FB4807", fontSize:"15px"}}>Budget created!!</p>:""}
                {this.state.tokenError?<Redirect to='/login'/>:''}  

                <Formik
                    validationSchema = {FormSchema}
                    initialValues = {initialValues}
                    onSubmit = {(values, {resetForm}) => {
                        this.handleSubmit(values);
                        resetForm({
                            amount:'',
                            monthList:''
                            
                    });
                    }}
                >
                {
                    ({errors, touched}) => (
                        <Form>
                            <p style={{backgroundColor:"#a300cc", color:"white", width:"250px", height:"30px", paddingTop:"2px", paddingLeft:"5px"}}>Add Budget</p>
                            
                            <label htmlFor="month"  className="form-label" style={{ fontSize:"15px"}}>Month</label><br/>
                            {/* <select id="options" name="monthList" style={{color:"#4380C3", fontSize:"15px", height:"25px"}} onChange={(event)=>this.handlePullDown(event)}> */}
                            <select id="options" name="monthList" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} onChange={(event)=>this.handlePullDown(event)}> 
                                    <option defaultValue={0} label="--Months--" />
                                    {this.state.months?.map(
                                        (month)=><option key={month.indexOf(month)} value={month.indexOf(month)} label={month}/>
                                     )}
                            </select><br/>
                            {errors.month && touched.month ? (<div style={{color:'red'}}>{errors.month}</div>):null}<br/>

                            <label htmlFor="amount" className="form-label" style={{fontSize:"15px"}}>Amount</label><br/>
                            <Field name="amount" style={{width:"250px", height:"25px", color:"#4380C3", fontSize:"15px"}}/><br/>
                            {errors.amount && touched.amount ? (<div style={{color:'red'}}>{errors.amount}</div>):null}<br/>

                            <small style={{color:"red"}}>{this.state.error}</small>
                            <Button className="btn btn-primary " style={{backgroundColor:"#00b359"}} type="submit">Add Budget</Button><br/>
                        </Form>
                    )
                }    
                </Formik>
            </div>
        )
    }
}
