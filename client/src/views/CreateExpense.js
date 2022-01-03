import React, { Component } from 'react'
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import {Button} from 'react-bootstrap';
import { Redirect } from 'react-router';
import axios from 'axios';


const FormSchema = Yup.object().shape({
    "month": Yup.string(),
    "description": Yup.string().required("Required"),
    "amount": Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Mount").required("Required"),
    "category": Yup.string()
})

const initialValues = {
    month: '',
    amount: '',
    description:'',
    category:''
}


export default class CreateExpense extends Component {

    constructor(props){
        super(props);
        this.state = {
            tokenError:false,
            categories:[],
            month:'',
            selectedcatid:0,
            mindex:0,
            cindex:0,
            error:'',
            successfulPost:false,
            months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    }

    componentDidMount(){
        this.getAllCats();
    }

    getAllCats = async()=>{
        await axios.get(`http://127.0.0.1:5000/category`)
        .then(response=>{
        this.setState({categories:response.data.category}, ()=>console.log("fetched all categories"), console.log(response.data));
        })
    }


    handleSubmit= async({month, amount, description, category})=>{
        
        if(this.state.mindex == 0)
        {
            alert("Please select a month")
            return
        }
        if(this.state.cindex == 0)
        {
            alert("Please select a Category")
            return
        }
        
        await axios.post(`http://127.0.0.1:5000/expense`, {
            month:this.state.month,
            amount:amount,
            description:description,
            category_id:this.state.selectedcatid,
            user_id:localStorage.getItem('currentUserId')
        })
        .then(response=>{
            if (response.data){
                console.log(response.data);
                this.setState({successfulPost:true, error:response.error});
            }
            else{
                this.setState({ error:response.error});
                console.log("Error creating expense : ", response.error);
            }
        })
    }

    handleMonthPullDown=(event)=>{
        let selectedindex = event.target.selectedIndex;
        let selectedmonth = event.target.options[event.target.selectedIndex].label;// event.nativeEvent.target[this.index].label;
        this.setState({month:selectedmonth})
        this.setState({mindex:selectedindex})
        this.setState({successfulPost:false})
     }

    handleCatPullDown=(event)=>{
        let selectedindex = event.target.selectedIndex;
        let selectedcatid = event.target.options[event.target.selectedIndex].value;// event.nativeEvent.target[this.index].label;
        this.setState({selectedcatid:selectedcatid})
        this.setState({cindex:selectedindex})
        this.setState({successfulPost:false})
     }

    render() {
        return (
            <div>
                {this.state.successfulPost?<p style={{color:"#FB4807", fontSize:"15px"}}>Your expense was created</p>:""}
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
                            <p style={{backgroundColor:"#a300cc", color:"white", width:"250px", height:"30px", paddingTop:"2px", paddingLeft:"5px"}}>Add Expense</p>
                            <label htmlFor="month"  className="form-label" style={{ fontSize:"15px"}}>Month</label><br/>
                            <select id="options" name="monthList" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} onChange={(event)=>this.handleMonthPullDown(event)}> 
                                    <option defaultValue={0} label="--Months--" />
                                    {this.state.months?.map(
                                        (month)=><option key={month.indexOf(month)} value={month.indexOf(month)} label={month}/>
                                     )}
                            </select>
                            {errors.month && touched.month ? (<div style={{color:'red'}}>{errors.month}</div>):null}<br/>

                            <label htmlFor="amount" className="form-label" style={{fontSize:"15px"}}>Amount</label><br/>
                            <Field name="amount" style={{width:"250px", height:"25px", color:"#4380C3", fontSize:"15px"}}/>
                            {errors.amount && touched.amount ? (<div style={{color:'red'}}>{errors.amount}</div>):null}<br/>

                            <label htmlFor="description" className="form-label" style={{fontSize:"15px"}}>Description</label><br/>
                            <Field name="description" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} /><br/>
                            {errors.description && touched.description ? (<div style={{color:'red'}}>{errors.description}</div>):null}
                            
                            <label htmlFor="category"  className="form-label" style={{ fontSize:"15px"}}>Category</label><br/>
                            <select id="options" name="catList" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} onChange={(event)=>this.handleCatPullDown(event)}> 
                                    <option defaultValue={0} label="--Category--" />
                                    {this.state.categories?.map(
                                        (cat)=><option key={cat.id} value={cat.id} label={cat.name}/>
                                     )}
                            </select><br/><br/>

                            <small style={{color:"red"}}>{this.state.error}</small>
                            <Button className="btn btn-primary " type="submit" style={{backgroundColor:"#00b359"}}>Add Expense</Button><br/>
                        </Form>
                    )
                }    
                
                

                </Formik>
            </div>
        )
    }
}
