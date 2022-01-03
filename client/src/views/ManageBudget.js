import React, { Component } from 'react'
import {Table, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import axios from 'axios'

  
export default class ManageBudget extends Component {

    constructor(){
        super();
        this.state = {
            budgets : [],
            budgetid : 0,
            clicked : false,
            successfulDelete:false
        };
    }

    componentDidMount(){
        this.getIncomes();
    }

    componentDidUpdate(){
        this.getIncomes();
    }

    //get all categories
    getIncomes = async() => {
        axios.get(`http://127.0.0.1:5000/income/user/${localStorage.getItem('currentUserId')}`)
       .then(response=>{
        this.setState({budgets:response.data.incomes}, ()=>console.log("fetched all budgets"), console.log(response.data));
        })
   }

    editItem = (budgetid, budgetamount) => {
        this.setState({ clicked: true , budgetid:budgetid, });
    };
       
    deletebudget = async(id) => {
        axios.delete(`http://127.0.0.1:5000/income/${id}`)
        .then(response=>{
            this.setState({successfulDelete:true}, ()=>console.log("deleted budget"));
         })
    }

    render() {

        return (
            <div>
                {this.state.clicked ? (
                    // <Redirect to={`/editbudget/${this.state.budgetid}`  } />
                    <Redirect to={{pathname: `/editbudget/${this.state.budgetid}`}} id={this.state.budgetid} />

                    ) : ("")
                }

                {this.state.successfulDelete?<p style={{color:"#FB4807", marginLeft:"30px", fontSize:"15px"}}>Budget deleted!!</p>:""}
                
                {this.state.budgets?
                <Table bordered hover size="md" style={{marginTop:"30px", marginLeft:"30px"}}> 
                <thead style={{backgroundColor:"#a300cc", color:"white", fontSize:"14px"}}>
                    <tr>
                        {/* <th>ID</th> */}
                        <th>Month</th>
                        <th>Amount</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                        {this.state.budgets.map(
                            (i)=>(
                                <tr key={i.id} >
                                    {/* <td>{i.id}</td> */}
                                    <td>{i.month ?? "No Month"}</td>
                                    <td>${i.amount ?? "No Amount"}</td>
                                    {/* <td>${i.amount.toFixed(2) ?? "No Amount"}</td> */}
                                    {/* <td>{i.category ?? "No Category"}</td> */}
                                    <td>
                                        <Button style={{backgroundColor:'#00b359'}}
                                             onClick={()=>this.editItem(i.id)}
                                            >
                                                Edit
                                        </Button>

                                    </td>
                                    <td>
                                    <Button 
                                            style={{backgroundColor:"#FB4807"}}
                                            onClick={()=>this.deletebudget(i.id)}
                                            >
                                                Delete
                                        </Button>

                                    </td>
                                   
                                </tr>
                            )
                        )
                    }
                </tbody>
            </Table>:"No budget.Please add a budget."}
            </div>
        )
    }
}
