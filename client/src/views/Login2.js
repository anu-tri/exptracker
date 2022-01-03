import React, { useState, useEffect } from 'react';
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

const Login = (props)=>{
    const [redirect, setRedirect] = useState('');
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        getAllCats();
    }, [])
    
    const getAllCats = async()=>{
        await axios.get(`http://127.0.0.1:5000/category`)
        .then(response=>{
        setCategories(response.data.category)
        })
    };

    //returns category name given cat id
    // const getCatName=(id)=>{
    //     for(let i=0; i<categories.length; i++)
    //     {
    //     if(categories[i].id === id)
    //         return categories[i].name
    //     }
    //     return "No category"
    // }
    
    const handleSubmit = ({ username, password }) => {
        const response = getToken(username, password);
        // this.setState({ error: response.error });
        setError(response.error)
        response.token="678yhfsg356sfvbxlo";
        alert(response.token)
        props.setToken(response.token);
        props.setCurrentUserId(response.current_userid);
        props.setUserName(username);
        // setRedirect(true);
            
        if (response.token) {
          setRedirect(true)
          console.log(response.token);
          props.setBarChartData();
          props.setPieChartData();
          alert(redirect);
        }
        return response;
    }    
        

    // render() {
        const styles = {
            error: { color: "red", marginLeft:"85px"},
            text: {color:"white", marginLeft:"85px", marginTop:"20px"},
            field: {marginLeft:"85px"},
            button:{color:"white",marginLeft:"85px"}//#BA60CA
          };
      
        return (
          
            <div>
                {redirect ? (
                <Redirect
                    to={{
                    pathname: "/",
                    // props: { token: props.token },
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
                            handleSubmit(values);
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

                                <small style={styles.error}>{error}</small><br/>
                                <Button type="submit" style={styles.button}>Login</Button><br/><br/>
                            </Form>
                        )}
                        </Formik>
            </div>
        );
    // }
}

export default Login;