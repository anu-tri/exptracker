import React, {Component} from 'react';
import {Pie} from 'react-chartjs-2';

class PieChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      chartData:this.props.chartData
    }
  }

  static defaultProps = {
    displayTitle:true,
    displayLegend: true,
    legendPosition:'right'
  }

 
  render(){
    return (
      <div className="chart">
        <Pie
          data={this.state.chartData} 
          width="500px"
          height="400px"
          options={{
            title:{
              display:this.props.displayTitle,
              fontSize:25
            },
            legend:{
              display:true,
              position:'bottom'
            }
          }}
        />

      </div>
    )
  }
}

export default PieChart;