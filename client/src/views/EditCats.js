import React, { Component } from 'react'
import {Button} from 'react-bootstrap'
import * as Yup from 'yup'
import {Formik, Form, Field} from 'formik'
import axios from 'axios'

const FormSchema = Yup.object().shape({
    "name": Yup.string(),
    "description": Yup.string()
})

export default class EditBudget extends Component {

    constructor(props){
        super(props)
        this.state = {
            category:{},
            successfulPost:false,
        }
    }

    componentDidMount(){
        this.getCategory()
    }

    getCategory=async()=>{
        await axios.get(`http://127.0.0.1:5000/category/${this.props.match.params.id}`)
        .then(response=>{
            this.setState({category:response.data}, ()=>console.log("fetched categry item"),console.log(response.data));
        });

    }

    handleSubmit=({name,description}, id)=>{
        axios.put(`http://127.0.0.1:5000/category/${id}`, {
            name:name,
            description:description
        })
        .then(res=>{this.setState({successfulPost:true}, ()=>console.log("Category modified."))})
    }


    render() {
        return (
            <div>
                {this.state.successfulPost?<p style={{color:"#FB4807"}}>Category modified!!</p>:""}
    
                <Formik
                        initialValues={
                            {
                                name:this.state.category?.name??'',
                                description:this.state.category?.description??''
                            }
                        }
                        enableReinitialize
                        validationSchema={FormSchema}
                        onSubmit={
                            (values,{resetForm})=>{
                                console.log(values);
                                this.handleSubmit(values, this.state.category?.id);
                                resetForm({
                                    name:'',
                                    description:''
                            });
                            }
                        }
                        >
                        {({ errors, touched })=>(
                            <Form>
                            <p style={{backgroundColor:"#a300cc", fontSize:"15px", color:"white", width:"250px", height:"30px", paddingTop:"2px", paddingLeft:"5px"}}>Edit Category</p>
                            <label htmlFor="name" className="form-label" style={{fontSize:"15px"}}>Name</label><br/>
                            <Field name="name" style={{width:"250px", height:"25px", fontSize:"15px",color:"#4380C3", fontSize:"15px"}}/><br/>
                            {errors.name && touched.name ? (<div style={{color:'red'}}>{errors.name}</div>):null}<br/>

                            <label htmlFor="description" className="form-label" style={{fontSize:"15px"}}>Description</label><br/>
                            <Field name="description" style={{width:"250px", height:"25px", fontSize:"15px",color:"#4380C3", fontSize:"15px"}}/><br/>
                            {errors.description && touched.description ? (<div style={{color:'red'}}>{errors.description}</div>):null}<br/>

                            <Button  type="submit" style={{backgroundColor:"#00b359", fontSize:"15px"}}>Edit Category</Button>&nbsp;&nbsp;&nbsp;
                            </Form>
                        )
                        }

                    </Formik>

            </div>
        )
    }
}