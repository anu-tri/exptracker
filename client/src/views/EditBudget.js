import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import * as Yup from 'yup'
import {Formik, Form, Field} from 'formik'
import axios from 'axios'

const FormSchema = Yup.object().shape({
    "month": Yup.string(),
    "amount": Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Amount").required("Required")
})

export default class EditBudget extends Component {

    constructor(props){
        super(props)
        this.state = {
            budget:{},
            month:'',
            successfulPost:false,
            months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    }


    componentDidMount(){
        this.getBudget()
    }


    getBudget=async()=>{
        await axios.get(`http://127.0.0.1:5000/income/${this.props.match.params.id}`)
        .then(response=>{
            this.setState({budget:response.data}, ()=>console.log("fetched budget item"),console.log(response.data));
        });

    }

    handleSubmit=({month,amount}, id)=>{
        month = this.state.month?this.state.month:this.state.budget.month
                
        axios.put(`http://127.0.0.1:5000/income/${id}`, {
            amount:amount,
            month:month,
            user_id:localStorage.getItem('currentUserId')
        })
        .then(res=>{this.setState({successfulPost:true}, ()=>console.log("Budget modified."))})
        // .then(json=>{this.setState({successfulPost:true}, ()=>console.log("Budget modified."))})

    }

    handlePullDown=(event)=>{
        // let selectedindex = event.target.selectedIndex;
        let selectedmonth = event.target.options[event.target.selectedIndex].label;// event.nativeEvent.target[this.index].label;
        this.setState({month:selectedmonth})
        this.setState({successfulPost:false})
     }

    render() {
        return (
            <div>
                {this.state.successfulPost?<p style={{color:"#FB4807"}}>Budget modified!!</p>:""}
    
                <Formik
                        initialValues={
                            {
                                amount:this.state.budget?.amount??'',
                                // month:this.state.budget?.month ?? ''
                            }
                        }
                        enableReinitialize
                        validationSchema={FormSchema}
                        onSubmit={
                            (values,{resetForm})=>{
                                console.log(values);
                                this.handleSubmit(values, this.state.budget?.id);
                                resetForm({
                                    amount:'',
                                    month:''
                            });
                            }
                        }
                        >
                        {({ errors, touched })=>(
                            <Form>
                                <p style={{backgroundColor:"#a300cc", color:"white", width:"250px", height:"30px", paddingTop:"2px", paddingLeft:"5px"}}>Edit Budget</p>
                                
                                <label htmlFor="month"  className="form-label" style={{ fontSize:"15px"}}>Month</label><br/>
                                <select id="options" name="month" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} onChange={(event)=>this.handlePullDown(event)}> 
                                    <option defaultValue={this.state.budget.month} label={this.state.budget.month} />
                                    {this.state.months?.map(
                                        (month)=><option key={month.indexOf(month)} value={month.indexOf(month)} label={month}/>
                                        )}
                                </select><br/>

                                <label htmlFor="amount" className="form-label" style={{fontSize:"15px"}}>Amount</label><br/>
                                <Field name="amount" style={{width:"250px", height:"25px", color:"#4380C3", fontSize:"15px"}}/>
                                {errors.amount && touched.amount ? (<div style={{color:'red'}}>{errors.amount}</div>):null}
                                <br/><br/>

                                <Button  type="submit" style={{backgroundColor:"#00b359"}}>Edit Budget</Button>&nbsp;&nbsp;&nbsp;
                            </Form>
                        )
                        }

                    </Formik>

            </div>
        )
    }
}



















