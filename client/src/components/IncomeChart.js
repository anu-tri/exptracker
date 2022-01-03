import React, { Component } from 'react';
import BarChart from './BarChart'
import {Chart as ChartJS} from 'chart.js/auto'
import axios from 'axios'
import {Bar} from 'react-chartjs-2'



export default class IncomeChart extends Component {
    

  constructor(){
    super();

    let months = ["January", "Febuary", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]  
    let budgetdata = new Array(12);
    budgetdata.fill(0);
    let expensedata = new Array(12);
    expensedata.fill(0);
    let savings = [];
    let result = {}
    var holder = {};


    //Budget
    axios.get(`http://127.0.0.1:5000/income/user/${localStorage.getItem('currentUserId')}`)
    .then(res => {
     for(let i=0; i<res.data.incomes.length; i++)
      {
        if(months.indexOf(res.data.incomes[i]["month"]) in months){
          budgetdata.splice(months.indexOf(res.data.incomes[i]["month"]),1, res.data.incomes[i]["amount"])
        }
      }
      localStorage.setItem('budgetdata',JSON.stringify(budgetdata))
     });
  //    .catch(error=>{
  //     console.error("There was an error trying to get the user: ", error);
  // });

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
     let budgetdatachart = []
     budgetdatachart = JSON.parse(localStorage.getItem('budgetdata'))
     let expensedatachart = []
     expensedatachart = JSON.parse(localStorage.getItem('expensedata'))

     if ((budgetdatachart != null ) && (expensedatachart != null )) {
      for(let i = 0;i<=budgetdatachart.length-1;i++){
        savings.push((budgetdatachart[i]) - (expensedatachart[i]));
      }
     }
    
  

    this.state = {
      chartData:{
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets:[
          {
            label:'Budget',
            data : budgetdatachart,
            backgroundColor:[
            //   'rgb(153, 51, 255)'
            'blue'
            ]
          },
          {
            label:'Expense',
            data : expensedatachart,
            backgroundColor:[
              'rgb(217, 179, 255)'
            ]
          },
          {
            label:'Savings',
            data : savings,
            backgroundColor:[
            // 'rgb(255, 209, 26)'
            '#80bfff'
            ]
          },
        ]
      }
    }
  }

  

  render(){
    return (
          <div className="IncomeChart" style={{width:"1000px", height:"350px"}}>
              <BarChart chartData={this.state.chartData} legendPosition="bottom" />
              <p style={{color:"purple", fontSize:"20px", fontWeight:"bold", marginLeft:"470px", marginTop:"60px"}}>Yearly Overview</p>
          </div>
        );
    
   }
}