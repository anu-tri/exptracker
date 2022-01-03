import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import * as Yup from 'yup'
import {Formik, Form, Field} from 'formik'
import axios from 'axios'

const FormSchema = Yup.object().shape({
    "month": Yup.string(),
    "description": Yup.string(),
    "amount": Yup.string().matches(/^\d+(\.\d{1,2})?$/,"Must be a Valid Amount").required("Required"),
    "category":Yup.string()
})

export default class EditExpense extends Component {

    constructor(props){
        super(props)
        this.state = {
            expense:{},
            categories:[],
            month:'',
            cat_id:'',
            mindex:0,
            cindex:0,
            successfulPost:false,
            months: ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        }
    }


    componentDidMount(){
        this.getAllCats()
        this.getExpense()
    }

    getAllCats = async()=>{
        await axios.get(`http://127.0.0.1:5000/category`)
        .then(response=>{
        this.setState({categories:response.data.category}, ()=>console.log("fetched all categories"), console.log(response.data));
        })
    }

    getExpense=async()=>{
        await axios.get(`http://127.0.0.1:5000/expense/${this.props.match.params.id}`)
        .then(response=>{
            this.setState({expense:response.data}, ()=>console.log("fetched expense"),console.log(response.data));
        });

    }

    //returns category name given cat id
    getCatName(id){
        for(let i=0; i<this.state.categories.length; i++)
        {
        if(this.state.categories[i].id === id)
            return this.state.categories[i].name
        }
        return "No category"
    }

    handleSubmit=({month,description,amount, category_id}, id)=>{
        month = this.state.month?this.state.month:this.state.expense.month
        category_id = this.state.cat_id?this.state.cat_id:this.state.expense.category_id
        alert(id+amount+month+category_id+description)
        axios.put(`http://127.0.0.1:5000/expense/${id}`, {
            amount:amount,
            month:month,
            description:description,
            category_id:category_id,
            user_id:localStorage.getItem('currentUserId')
        })
        .then(res=>{this.setState({successfulPost:true}, ()=>console.log("Expense modified."))})
    }

    handleMonthPullDown=(event)=>{
        // let selectedindex = event.target.selectedIndex;
        let selectedmonth = event.target.options[event.target.selectedIndex].label;// event.nativeEvent.target[this.index].label;
        this.setState({month:selectedmonth})
        this.setState({successfulPost:false})
     }

     handleCatPullDown=(event)=>{
        let selectedindex = event.target.selectedIndex;
        let selectedcat = event.target.options[event.target.selectedIndex].label;
        this.setState({cat_id:selectedindex})
        this.setState({successfulPost:false})
     }

    render() {
        return (
            <div>
                {this.state.successfulPost?<p style={{color:"#FB4807"}}>Expense modified!!</p>:""}
    
                <Formik
                        initialValues={
                            {
                                amount:this.state.expense?.amount??'',
                                description:this.state.expense?.description ?? ''
                            }
                        }
                        enableReinitialize
                        validationSchema={FormSchema}
                        onSubmit={
                            (values,{resetForm})=>{
                                console.log(values);
                                this.handleSubmit(values, this.state.expense?.id);
                                resetForm({
                                    amount:'',
                                    description:'',
                                    category:'',
                                    month:''
                            });
                            }
                        }
                        >
                        {({ errors, touched })=>(
                            <Form>
                                <p style={{backgroundColor:"#a300cc", color:"white", width:"250px", height:"30px", paddingTop:"2px", paddingLeft:"5px"}}>Edit Expense</p>
                                
                                <label htmlFor="month"  className="form-label" style={{ fontSize:"15px"}}>Month</label><br/>
                                <select id="options" name="month" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} onChange={(event)=>this.handleMonthPullDown(event)}> 
                                    <option defaultValue={this.state.expense.month} label={this.state.expense.month} />
                                    {this.state.months?.map(
                                        (month)=><option key={month.indexOf(month)} value={month.indexOf(month)} label={month}/>
                                        )}
                                </select><br/><br/>
                                
                                <label htmlFor="amount" className="form-label" style={{fontSize:"15px"}}>Amount</label><br/>
                                <Field name="amount" style={{width:"250px", height:"25px", color:"#4380C3", fontSize:"15px"}}/>
                                {errors.amount && touched.amount ? (<div style={{color:'red'}}>{errors.amount}</div>):null}
                                <br/><br/>

                                <label htmlFor="category"  className="form-label" style={{ fontSize:"15px"}}>Category</label><br/>
                                <select id="options" name="category" style={{color:"#4380C3", fontSize:"15px", width:"250px", height:"25px"}} onChange={(event)=>this.handleCatPullDown(event)}> 
                                        <option defaultValue={this.getCatName(this.state.expense.category_id)} label={this.getCatName(this.state.expense.category_id)}  />
                                        {this.state.categories?.map(
                                            (cat)=><option key={cat.id} value={cat.id} label={cat.name}/>
                                        )}
                                </select><br/><br/>

                                <small style={{color:"red"}}>{this.state.error}</small>
                                <Button  type="submit" style={{backgroundColor:"#00b359"}}>Edit Expense</Button>&nbsp;&nbsp;&nbsp;
                            </Form>
                        )
                        }

                    </Formik>

            </div>
        )
    }
}