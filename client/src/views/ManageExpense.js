import React, { Component } from 'react'
import {Table, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import axios from 'axios'

  
export default class ManageExpense extends Component {

    constructor(){
        super();
        this.state = {
            expenses : [],
            categories : [],
            expid : 0,
            clicked : false,
            successfulDelete:false
        };
    }

    componentDidMount(){
        this.getAllCats();
        this.getExpenses();
     
    }

    componentDidUpdate(){
        this.getExpenses();
    }

    //get all categories
    getExpenses = async() => {
        axios.get(`http://127.0.0.1:5000/expense/user/${localStorage.getItem('currentUserId')}`)
       .then(response=>{
        this.setState({expenses:response.data.expenses}, ()=>console.log("fetched all expenses"), console.log(response.data));
        })
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

    editItem = (expid) => {
        this.setState({ clicked: true , expid:expid });
    };
       
    deleteexpense = async(id) => {
        axios.delete(`http://127.0.0.1:5000/expense/${id}`)
        .then(response=>{
            this.setState({successfulDelete:true}, ()=>console.log("deleted expense"));
         })
    }

    render() {

        return (
            <div>
                {this.state.clicked ? (
                    // <Redirect to={`/editbudget/${this.state.budgetid}`  } />
                    <Redirect to={{pathname: `/editexpenses/${this.state.expid}`}} id={this.state.expid} />
                    ) : ("")
                }

                {this.state.successfulDelete?<p style={{color:"#FB4807", marginLeft:"30px", fontSize:"15px"}}>Expense deleted!!</p>:""}
                {this.state.expenses?
                <Table bordered hover size="md" style={{marginTop:"30px", marginLeft:"30px"}}> 
                <thead style={{backgroundColor:"#A300CC", color:"white", fontSize:"14px"}}>
                    <tr>
                        {/* <th>ID</th> */}
                        <th>Month</th>
                        <th>Description</th>
                        <th>Amount</th>
                        <th>Category</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                        {this.state.expenses.map(
                            (i)=>(
                                <tr key={i.id} >
                                    {/* <td>{i.id}</td> */}
                                    <td>{i.month ?? "No Month"}</td>
                                    <td>{i.description ?? "No Description"}</td>
                                    <td>${i.amount ?? "No Amount"}</td>
                                    <td>{this.getCatName(i.category_id) ?? "No Category"}</td>
                                    {/* <td>${i.amount.toFixed(2) ?? "No Amount"}</td> */}
                                    {/* <td>{i.category ?? "No Category"}</td> */}
                                    <td>
                                        <Button style={{backgroundColor:"#00b359"}}
                                             onClick={()=>this.editItem(i.id)}
                                            >
                                                Edit
                                        </Button>

                                    </td>
                                    <td>
                                    <Button 
                                            style={{backgroundColor:"#FB4807"}}
                                            onClick={()=>this.deleteexpense(i.id)}
                                            >
                                                Delete
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </Table>:"No expenses noted. Please add expenses."}
            </div>
        )
    }
}
