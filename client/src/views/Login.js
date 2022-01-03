import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from "formik";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router";
import getToken from '../api/apiBasicAuth';
import axios from 'axios';
import PieChart from '../components/PieChart';
import {Chart} from 'chart.js/auto'

const FormSchema = Yup.object().shape({
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required")

});

const initialValues = {
    username: "",
    password: ""
  };

export default class Login extends Component {
    constructor(){
        super();
        this.state = {
            error : "",
            redirect: false
        };
    }

    componentWillMount(){
        this.getAllCats();
      }
    
    getAllCats = async()=>{
        await axios.get(`http://127.0.0.1:5000/category`)
        .then(response=>{
        this.setState({categories:response.data.category}, ()=>console.log("fetched all categories"), console.log(response.data));
        })
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
    
    handleSubmit = async ({ username, password }) => {
        const response = await getToken(username, password);
        this.setState({ error: response.error });
        this.props.setToken(response.token);
        this.props.setCurrentUserId(response.current_userid);
        this.props.setUserName(username);
            
        if (response.token) {
          this.setState({ redirect: true });
          console.log(response.token);
          this.props.setBarChartData();
          this.props.setPieChartData();
        }
    }    
        

    render() {
        const styles = {
            error: { color: "red", marginLeft:"85px"},
            text: {color:"white", marginLeft:"85px", marginTop:"20px"},
            field: {marginLeft:"85px"},
            button:{color:"white",marginLeft:"85px"}//#BA60CA
          };
      
        return (
            <div>
                {this.state.redirect ? (
                <Redirect
                    to={{
                    pathname: "/"
                    // props: { token: localStorage.getItem("token") },
                    }}
                />
                ) : (
                ""
                )}

                <Formik    
                        initialValues={initialValues}
                        validationSchema={FormSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            this.handleSubmit(values);
                        }}
                        >
                        {({ errors, touched }) => (
                            <Form style={{backgroundColor:"purple", width:"30%", borderRadius:"10px", marginTop:"80px", marginLeft:"380px"}}>
                                <label htmlFor="username" className="form-label" style={styles.text}>Username</label>
                                <Field name="username" style={styles.field} />
                                {errors.username && touched.username ? (
                                    <div style={styles.error}>{errors.username}</div>
                                ) : null}

                                <label htmlFor="password" className="form-label" style={styles.text}>Password</label>
                                <Field name="password"  type="password" style={styles.field}/><br/>
                                {errors.password && touched.password ? (
                                    <div style={styles.error}>{errors.password}</div>
                                ) : null}

                                <small style={styles.error}>{this.state.error}</small><br/>
                                <Button type="submit" style={styles.button}>Login</Button><br/><br/>
                            </Form>
                        )}
                        </Formik>
            </div>
        );
    }
}
