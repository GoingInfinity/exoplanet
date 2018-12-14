import React, { Component } from 'react';
import * as d3 from 'd3';

import AxisSelector from './components/axisSelector';
import PlotGraph from './components/plotGraph';

import csvData from './assets/phl_hec_all_confirmed.csv';
import './App.sass';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      xSelector: '',
      ySelector: '',
      columns: [],
      data: []
    };
  }

  componentWillMount() {
    const filteredColumns = {}

    // Load and Parse CSV data
    d3.csv(csvData, (row) => {
      const keys = Object.keys(row)
      keys.forEach(column => {

        // Checks string with characters and spaces
        if (/^[ a-z]+$/i.test(row[column])) {
          row[column] = row[column].trim()
        } else 
        // Checks string with numbers and exponentials, including spaces
        if (/^[ -+.0-9e-]+$/.test(row[column])) {
          row[column] = parseFloat(row[column])
          filteredColumns[column] = true
        }
      })
      return row
    }).then(result => {
      this.setState({
        columns: Object.keys(filteredColumns),
        data: result,
        xSelector: result.columns[32],
        ySelector: result.columns[11]
      })
    })
  }

  updateAxisSelection = (e, axis) => {
    if (axis === 'x') this.setState({ xSelector: e.value })
    if (axis === 'y') this.setState({ ySelector: e.value })
  }
  
  render() {
    const { data, columns, xSelector, ySelector } = this.state
    return (
      <div className="App">
        <h1>Exoplanet Data Explorer</h1>
        <div className="App__AxisSelectionContainer">
          <AxisSelector columns={columns} update={this.updateAxisSelection} axis='x' title='X-Axis' value={xSelector} data={data} />
          <AxisSelector columns={columns} update={this.updateAxisSelection} axis='y' title='Y-Axis' value={ySelector} data={data} />
        </div>
        <div className="App__MainContent">
          <h3 className="App__GraphTitle">
            {this.state.xSelector} vs {this.state.ySelector}
          </h3>
          <PlotGraph data={data} xSelector={xSelector} ySelector={ySelector} />
        </div>
      </div>
    );
  }
}

export default App;
