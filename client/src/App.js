import React, {Component} from "react";
import NavBar from "./components/NavBar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Switch, Route } from "react-router-dom";
import { Container } from 'react-bootstrap'
import {titleCase} from './helpers';
import axios from 'axios';
import Login from "./views/Login";
import Logout from "./views/Logout";
import Register from "./views/Register";
import Footer from "./components/Footer"
import Home from "./views/Home";
import CreateCats from "./views/CreateCats";
import ManageCats from "./views/ManageCats";
import EditCats from "./views/EditCats";
import CreateExpense from "./views/CreateExpense";
import ViewExpense from "./views/ViewExpense";
import EditExpense from "./views/EditExpense";
import ManageExpense from "./views/ManageExpense";
import CreateBudget from "./views/CreateBudget";
import EditBudget from "./views/EditBudget";
import ManageBudget from "./views/ManageBudget";
import IncomeChart from './components/IncomeChart';
import ExpenseChart from './components/ExpenseChart';
import ExpenseChartHome from './components/ExpenseChartHome';
import ProtectedRoute from "./components/ProtectedRoute"

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      token:"",
      userFullName:"",
      categories:[],
      currentUserId:0
    };
  }
 
  componentDidMount(){
    this.getAllCats();
  }

  setToken = (token) => {
    this.setState({token});
    localStorage.setItem("token", token)
  };

  setCurrentUserId = (id) => {
    localStorage.setItem('currentUserId', id);
    this.setState({currentUserId: id});
  }

  setUserName = (username) => {
    let fullname = "";
    fetch('http://127.0.0.1:5000/user')
    .then(response=>response.json())
    .then(response=>{
      for(let user of response.users){
        if(user.username === username){
          fullname = user.firstname + " " + user.lastname;
          this.setState({userFullName:titleCase(fullname)});
          localStorage.setItem("userFullName",titleCase(fullname));
          break;
        }
      }
    })
  }

   doLogout=()=>{
    localStorage.clear();
    this.setToken('');
    this.setUserName('');
    this.setCurrentUserId(0);
    this.setState({userFullName:''});
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
  
  setBarChartData=()=>{
        // Bar  Chart
        let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]  
        let budgetdata = new Array(12);
        budgetdata.fill(0);
        let expensedata = new Array(12);
        expensedata.fill(0);
        let result = {}
        let savings = [];

        //Budget
        axios.get(`http://127.0.0.1:5000/income/user/${localStorage.getItem('currentUserId')}`)
        .then(res => {
        for(let i=0; i<res.data.incomes.length; i++)
        {
            if(months.indexOf(res.data.incomes[i]["month"]) in months){
                budgetdata.splice(months.indexOf(res.data.incomes[i]["month"]),1, res.data.incomes[i]["amount"])
            }
        }
        localStorage.setItem('expensedata',JSON.stringify(expensedata))
        });

        //Expenses
        axios.get(`http://127.0.0.1:5000/expense/user/${localStorage.getItem('currentUserId')}`)
        .then(res => {
        //Sum of amount for a specific month(i.e getting sum of amount for all jan,...)  
        const result = Array.from(res.data.expenses.reduce(
        (m, {month, amount}) => m.set(month, (m.get(month) || 0) + Number(amount)), new Map
        ), ([month, amount]) => ({month, amount}));
        
        for(let i=0; i<result.length; i++)
        {
            if(months.indexOf(result[i]["month"]) in months){
                expensedata.splice(months.indexOf(result[i]["month"]),1, result[i]["amount"])
            }
        }
        localStorage.setItem('expensedata',JSON.stringify(expensedata))
        });

        //Savings
        // let budgetdatachart = []
        let budgetdatachart = JSON.parse(localStorage.getItem('budgetdata'))
        let expensedatachart = JSON.parse(localStorage.getItem('expensedata'))

        if ((budgetdatachart != null ) && (expensedatachart != null )) {
            for(let i = 0;i<=budgetdatachart.length-1;i++){
                savings.push((budgetdatachart[i]) - (expensedatachart[i]));
            }
      }
      localStorage.setItem('savingsdata',JSON.stringify(savings))
  }
  
  setPieChartData=()=>{
      //Expenses
      axios.get(`http://127.0.0.1:5000/expense/user/${localStorage.getItem('currentUserId')}`)
      .then(res => {
    
      //Sum of amount for a specific category(i.e getting sum of amount for a category,...)  
      const result = Array.from(res.data.expenses.reduce(
      (m, {category_id, amount}) => m.set(category_id, (m.get(category_id) || 0) + Number(amount)), new Map
      ), ([category_id, amount]) => ({category_id, amount}));
    
      let category=[]
      let catamount = []
      let total = 0
      
      for(let i=0; i<result.length; i++)
      {
            category.push(this.getCatName(result[i]["category_id"]))
            catamount.push(result[i]["amount"])
      }
      total = catamount.reduce((a, b) => a + b, 0)
      catamount = catamount.map((x)=>((x/total)*100).toFixed(2))
      localStorage.setItem('catamount',JSON.stringify(catamount))
      localStorage.setItem('category',JSON.stringify(category))
      });

  }
  
  render(){
    return (
    <div>
      <NavBar token={this.state.token} userFullName={this.state.userFullName} currentUserId={this.state.currentUserId}/>
      <Container>
          <Switch> 
            <Route exact path="/login" render={()=><Login setToken={this.setToken} setUserName={this.setUserName} setCurrentUserId={this.setCurrentUserId} setBarChartData={this.setBarChartData} setPieChartData={this.setPieChartData}/>} />
            <Route exact path="/register" render={()=><Register/>} />
            <ProtectedRoute exact path="/" token={this.state.token} render={()=><Home token={this.state.token} currentUserId={this.state.currentUserId} />} />
            <ProtectedRoute exact path ="/logout" token={this.state.token} render={()=><Logout doLogout={this.doLogout}/>}/>
            <ProtectedRoute exact path ="/createcategory" token={this.state.token} 
                render={()=><CreateCats />} />
            <ProtectedRoute exact path ="/editcategory/:id" token={this.state.token} 
                render={(props)=><EditCats {...props}/>} />
            <ProtectedRoute exact path ="/managecategory" token={this.state.token} 
                render={()=><ManageCats/>} />
             
            <ProtectedRoute exact path ="/viewexpenses" token={this.state.token} 
                render={()=><ViewExpense currentUserId={this.state.currentUserId} />} />
            <ProtectedRoute exact path ="/createexpenses" token={this.state.token} 
                render={()=><CreateExpense />} />
            <ProtectedRoute exact path ="/editexpenses/:id" token={this.state.token} 
                render={(props)=><EditExpense {...props}/>} />
            <ProtectedRoute exact path ="/manageexpenses" token={this.state.token} 
                render={()=><ManageExpense/>} />
            <ProtectedRoute exact path ="/createbudget" token={this.state.token} 
                render={()=><CreateBudget  />} />
            <ProtectedRoute exact path ="/managebudget" token={this.state.token} 
                render={()=><ManageBudget />} />
            <ProtectedRoute exact path ="/editbudget/:id" token={this.state.token} 
                render={(props)=><EditBudget {...props}/>} />
            <ProtectedRoute exact path ="/incomechart" token={this.state.token} 
                render={()=><IncomeChart />} />
            <ProtectedRoute exact path ="/incomechart1" token={this.state.token} 
                render={()=><IncomeChart />} />
            <ProtectedRoute exact path ="/expensechart" token={this.state.token} 
                render={()=><ExpenseChart />} />
          </Switch>
      </Container>
    </div>
  );
}
}

