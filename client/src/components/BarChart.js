import React, {Component} from 'react';
import {Bar, Line, Pie} from 'react-chartjs-2';
// import {Chart} from 'chart.js/auto'
// var Bar = require("react-chartjs-2").Bar;



class BarChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:this.props.chartData
    }
  }

  
  render(){
    return (
      <div className="chart">
        <Bar
          data={this.state.chartData} 
          width="1100px"
          height="400px"
          options={{
            maintainAspectRatio: false
          }}
        />

      </div>
    )
  }
}

export default BarChart;