import React, { Component } from "react";
import { Card, Col, Button } from "react-bootstrap";
import { titleCase } from "../helpers";
import { Redirect } from "react-router-dom";
import axios from 'axios'

export default class ExpenseCard extends Component {
  constructor() {
    super();
    this.state = {
      clicked: false,
    };
  }

  //returns category name given cat id
  getCatName(id){
    for(let i=0; i<this.props.categories.length; i++)
    {
      if(this.props.categories[i].id === id)
         return this.props.categories[i].name
    }
    return "No category"
  }


  handleRenderItem = () => {
    this.setState({ clicked: true });
  };


  render() {
  return (
     
      <Col>
        {this.state.clicked ? (
          <Redirect to={`/expense/${this.props.expenseitem.id}`} />
          ) : (
            ""
          )}
       

        <Card style={{ width: "250px", height:"200px", marginBottom: "25px" }} >
          <Card.Body>
          <Card.Title style={{fontSize:"13px", color:"#606A72", backgroundColor:"aliceblue", paddingTop:"5px", width:"200px", height:"30px"}}>
              Expense ID:{(this.props.expenseitem.id) ?? "Generic Expense"} 
            </Card.Title>
    
          <Card.Text style={{fontSize:"13px", color:"#D83F87"}}>
              {this.getCatName(this.props.expenseitem.category_id)}<br/>
              {this.props.expenseitem.month??"Sorry No Month"}<br/>
              {/* <img src="https://res.cloudinary.com/dzzbwxwsv/image/upload/v1639121978/gift_r6xmyb.png" width="50px" height="50px" /><br/> */}
              {titleCase(this.props.expenseitem.description) ?? "Sorry No Description"}
            </Card.Text>

            <Card.Subtitle className="float-left " style={{color:"#71D4EE"}}>
              ${this.props.expenseitem.amount ?? "?.??"}{" "}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            </Card.Subtitle>
            
          </Card.Body>
        </Card>
      </Col>
    );
  }
}
