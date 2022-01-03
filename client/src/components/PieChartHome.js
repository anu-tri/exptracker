import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';
// import {Chart} from 'chart.js/auto'


class PieChartHome extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:this.props.chartData
    }
  }

 
  render(){
    return (
      <div className="chart">
        <Pie
          data={this.state.chartData}
          options={{
            maintainAspectRatio: false
          }}
        />

      </div>
    )
  }
}

export default PieChartHome;