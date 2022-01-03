import React, { Component } from 'react'
import axios from 'axios'
import {Col, Row, Button} from 'react-bootstrap'
import ExpenseCard from '../components/ExpenseCard'
import IncomeChart from '../components/IncomeChart'
import BarChartComponent from '../components/BarChartComponent'
import {Bar, Line, Pie} from 'react-chartjs-2';
import {Chart} from 'chart.js/auto'


export default class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            expenses:[],
            categories:[],
            itemStart: 0,
            itemEnd:15,
            token:this.props.token
        };
    }

    // const [expenses, setExpenses] = useState([]);

    componentDidMount() {
        this.getAllCats();
        this.getExpensesByUser(this.props.currentUserId);
    }

    getAllCats = async()=>{
        await axios.get(`http://127.0.0.1:5000/category`)
        .then(response=>{
        this.setState({categories:response.data.category}, ()=>console.log("fetched all categories"), console.log(response.data));
        })
    }

    getExpensesByUser = async(id)=>{
        await axios.get(`http://127.0.0.1:5000/expense/user/`+id)
        .then(response=>{
        this.setState({expenses:response.data.expenses}, ()=>console.log("fetched all expenses for the user"));
        });
    }

    //get all expenses by category
    getExpensesByCat = async(id)=>{
        await axios.get(`http://127.0.0.1:5000/expense/category/${id}/user/${this.props.currentUserId}`)
        .then(response => {
            this.setState({expenses:response.data.expenses}, ()=>console.log("fetched all expenses for category."));
        });
        
    }

    //returns category name given cat id
    getCatName(id){
        let list =  this.state.categories
        return (list[id-1].name)
    }

    resetItemCounts = () =>{
        this.setState({itemStart:0, itemEnd:15});
    }

    handlePrev=()=>{
        const oldStart=this.state.itemStart;
        const oldEnd=this.state.itemEnd;
        this.setState({itemStart:oldStart-15, itemEnd:oldEnd-15});
    }

    handleNext=()=>{
        const oldStart=this.state.itemStart;
        const oldEnd=this.state.itemEnd;
        this.setState({itemStart:oldStart+15, itemEnd:oldEnd+15});
    }

    handleCat = async(id) =>{
        this.resetItemCounts();
        if (id===0){
            return await this.getExpensesByUser(this.props.currentUserId);
        }
        // this.getCatName(id)
        return await this.getExpensesByCat(id);
    }

    render() {

        const styles = {
            catButton:{
                backgroundColor: "white",
                color: "#D83F87",
                width: '100%',
                border: '1px solid #D83F87',
                borderRadius: '15px',
                marginBottom:'8px',
                fontSize:'15px'
            },
            pageStyles:{
                backgroundColor: "white",
                padding:"20px"
            },
            headerStyles:{
                color:"black",
                fontSize:'20px'
            }
        }

        return (
            <div style={styles.pageStyles}>
                {/* <center><img src="https://res.cloudinary.com/dzzbwxwsv/image/upload/v1638057557/banner3_q7fshc.jpg" width="1060px" height="300px" style={{marginLeft:"-10px", marginTop:"-10px"}}></img></center> */}
                {/* <center><BarChartComponent /></center> */}
                
                <Row>
                    <Col md={3}>
                        {/* category section */}
                        <center><h3 style={styles.headerStyles}>EXPENSE BY CATEGORY</h3></center>
                        <hr/>
                        <ul style={{listStyleType:'none'}}>
                            <li>
                                <button style={styles.catButton} onClick={()=>this.handleCat(0)}>EXPENSES</button>
                            </li>
                            {/*  (c)=><li key={this.state.categories.indexOf(c)}> */}
                            {this.state.categories.map(
                                (c)=><li key={c.id}>
                                    <button style={styles.catButton} onClick={()=>this.handleCat(c.id)}>{c.name}</button>
                                </li>
                            )}

                        </ul>
                    </Col>
                    <Col md={9}>
                        {/* expense section */}
                        <Row>
                            {this.state.expenses.slice(this.state.itemStart,this.state.itemEnd)
                                .map((e)=><ExpenseCard expenseitem={e} key={e.id} categories={this.state.categories} />)}
                        </Row>
                        <div className="d-flex justify-content-center">
                            <Button className={"me-2 " + (this.state.itemStart===0?"disabled":'')} style={{backgroundColor:"#FB4807"}} onClick={()=>this.handlePrev()}>{"<< Prev"}</Button>
                            <Button className={" " + (this.state.expenses?.length<=this.state.itemEnd?"disabled":'')} style={{backgroundColor:"#4380C3"}} onClick={()=>this.handleNext()}>{"Next >>"}</Button>
                        </div>
                    </Col>

                </Row>
            </div>
        )
    }
}
