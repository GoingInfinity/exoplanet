import React, { Component } from 'react';
import * as d3 from 'd3';
import csvData from './assets/phl_hec_all_confirmed.csv'
import logo from './logo.svg';
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
        }
      })
      return row
    }).then(result => {
      this.setState({
        columns: result.columns,
        data: result,
        xSelector: result.columns[12],
        ySelector: result.columns[11]
      })
    })
  }

  componentDidMount() {
    this.renderPlotGraph()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.data !== this.state.data) {
      d3.select("svg").remove()
      this.renderPlotGraph()
    }
  }

  renderHistogram = () => {

  }

  renderPlotGraph = () => {
    const { data, xSelector, ySelector } = this.state
    const height = 300
    const width = 700
    console.log('state', data)

    // Appends SVG to target ".App__PlotGraph"
    const svg = d3.select(".App__PlotGraph").append("svg").attr("width", 700).attr("height", 300);

    const margin = ({top: 20, right: 30, bottom: 30, left: 40})

    // linear scale
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xSelector]))
      .range([margin.left, width - margin.right])
    
    // linear scale
    const y = d3.scaleLinear()
      .domain(d3.extent(data, d => d[ySelector])).nice()
      .range([height - margin.bottom, margin.top])
    
    // X-axis positioning
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
    
    // Y-axis positioning
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.append("g")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("fill", "none")
      .selectAll("circle")
      .data(data)
      .enter().append("circle")
        .attr("cx", d => x(d[xSelector]))
        .attr("cy", d => y(d[ySelector]))
        .attr("r", 2);
  }
  
  render() {
    return (
      <div className="App">
        <h1>Exoplanet Data Explorer</h1>
        <div>
          <h3>{this.state.xSelector}</h3>
          vs
          <h3>{this.state.ySelector}</h3>
        </div>
        <div className="App__PlotGraph" />
      </div>
    );
  }
}

export default App;
