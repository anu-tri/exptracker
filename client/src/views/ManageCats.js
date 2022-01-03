import React, { Component } from 'react'
import {Table, Button} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import axios from 'axios'

  
export default class ManageCats extends Component {

    constructor(){
        super();
        this.state = {
            categories : [],
            catid : 0,
            clicked : false,
            successfulDelete:false
        };
    }

    componentDidMount(){
        this.getCategory();
    }

    componentDidUpdate(){
        this.getCategory();
    }

    //get all categories
    getCategory = async() => {
        axios.get('http://127.0.0.1:5000/category')
       .then(response=>{
        this.setState({categories:response.data.category}, ()=>console.log("fetched all category"), console.log(response.data));
        })
   }

    editCat = (catid, catname, catdesc) => {
        this.setState({ clicked: true , catid:catid, });
    };
       

    render() {
        return (
            <div>
                {this.state.clicked ? (
                    // <Redirect to={`/editbudget/${this.state.budgetid}`  } />
                    <Redirect to={{pathname: `/editcategory/${this.state.catid}`}} id={this.state.catid} />
                    ) : ("")
                }

                {/* {this.state.successfulDelete?<p style={{color:"#FB4807", marginLeft:"30px", fontSize:"15px"}}>Budget deleted!!</p>:""} */}
                {this.state.categories?
                <Table bordered hover size="md" style={{marginTop:"30px", marginLeft:"30px"}}> 
                <thead style={{backgroundColor:"#a300cc", color:"white", fontSize:"14px"}}>
                    <tr>
                        {/* <th>ID</th> */}
                        <th>Name</th>
                        <th>Description</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                        {this.state.categories.map(
                            (i)=>(
                                <tr key={i.id} >
                                    {/* <td>{i.id}</td> */}
                                    <td>{i.name ?? "No Name"}</td>
                                    <td>{i.description ?? "No Description"}</td>
                                    <td>
                                        <Button style={{backgroundColor:"#00b359"}}
                                             onClick={()=>this.editCat(i.id)}
                                            >
                                                Edit
                                        </Button>
                                    </td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </Table>:"No Category created. Please add a category."}
            </div>
        )
    }
}
