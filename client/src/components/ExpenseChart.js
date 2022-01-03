import React, { Component } from 'react';
import PieChart from './PieChart';
import BarChart from './BarChart';
import {Chart as ChartJS} from 'chart.js/auto'
import axios from 'axios'
import {Pie} from 'react-chartjs-2'


export default class ExpenseChart extends Component {
  constructor(){
    super();
    this.state = {
      chartData:{},
      categories:[]
    }
  }

  componentWillMount(){
    this.getAllCats();
    this.getChartData();
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
  
  getChartData=()=>{
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
    //  alert(result[1]["amount"])
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
    
    
    this.setState({
      chartData:{
        labels: JSON.parse(localStorage.getItem('category')),
        datasets:[
          {
            label:'Expenses by Category',
            data : JSON.parse(localStorage.getItem('catamount')),
            // data:[12000,2000,8000,500],
            backgroundColor:[
              'blue',
              'rgb(255, 209, 26)',
              '#d966ff',
              '#00b359',
              'red',
              '#D83F87',
              '#104CD5',
              '#009879'
            ]
          }
        ]
      }
    });

  }
  

  render(){
    return (
          <div className="chart" style={{width:"400px", height:"400px", marginLeft:"290px"}}>
              <PieChart chartData={this.state.chartData} />
              <p style={{fontSize:"12px",marginLeft:"130px", marginTop:"20px"}}>**All values are in percentage</p>
              <div style={{color:"purple", width:"300px",fontSize:"20px", fontWeight:"bold", marginLeft:"130px", marginTop:"30px"}}>Expense Overview</div>
          </div>
          

        );
    
   }
}
  
 

