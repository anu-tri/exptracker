import React, { Component } from 'react';
import * as Yup from 'yup';
import { Formik, Form, Field } from "formik";
import Button from "react-bootstrap/Button";
import { Redirect } from "react-router";
import axios from 'axios';

const FormSchema = Yup.object().shape({
    firstname: Yup.string().required("Required"),
    lastname: Yup.string().required("Required"),
    username: Yup.string().required("Required"),
    password: Yup.string().required("Required")

});

const initialValues = {
    firstname:"",
    lastname:"",
    username: "",
    password: ""
  };

export default class Register extends Component {
    constructor(){
        super();
        this.state = {
            error : "",
            redirect: false
        };
    }
    
    handleSubmit = ({firstname, lastname, username, password}) => {
        axios.post(`http://127.0.0.1:5000/user`, {
            firstname:firstname,
            lastname:lastname,
            username:username,
            password:password
        })
        .then(response=>{
            if (response.data){
                console.log(response.data);
                this.setState({redirect:true, error:response.error});
            }
            else{
                this.setState({error:response.error});
                console.log("Error creating user : ", response.error);
            }
        })
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
                    pathname: "/Login"
                    }}
                />) : ""}

                <Formik    
                        initialValues={initialValues}
                        validationSchema={FormSchema}
                        onSubmit={(values) => {
                            console.log(values);
                            this.handleSubmit(values);
                        }}
                        >
                        {({ errors, touched }) => (
                            <Form style={{backgroundColor:"purple", width:"30%", borderRadius:"10px", marginTop:"50px", marginLeft:"380px"}}>
                                <label htmlFor="firstname" className="form-label" style={styles.text}>Firstname</label>
                                <Field name="firstname" style={styles.field} />
                                {errors.firstname && touched.firstname ? (
                                    <div style={styles.error}>{errors.firstname}</div>
                                ) : null}

                                <label htmlFor="lastname" className="form-label" style={styles.text}>Lastname</label>
                                <Field name="lastname" style={styles.field} />
                                {errors.lastname && touched.lastname ? (
                                    <div style={styles.error}>{errors.lastname}</div>
                                ) : null}

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
                                <Button type="submit" style={styles.button}>Register</Button><br/><br/>
                            </Form>
                        )}
                        </Formik>
            </div>
        );
    }
}
