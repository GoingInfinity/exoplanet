import React, { Component } from 'react';
import * as d3 from 'd3';

import AxisSelector from './components/axisSelector.js'
import csvData from './assets/phl_hec_all_confirmed.csv'
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

  componentDidMount() {
    this.renderPlotGraph()
    this.renderHistogram('x')
    this.renderHistogram('y')
  }

  componentDidUpdate(prevProps, prevState) {
    d3.selectAll("svg").remove()
    if (prevState.xSelector !== this.state.xSelector || 
      prevState.ySelector !== this.state.ySelector ) {
      this.renderPlotGraph()
      this.renderHistogram('x')
      this.renderHistogram('y')
    } 
  }

  renderHistogram = (selector) => {
    const { data, xSelector, ySelector } = this.state
    let targetClass, axisSelection

    // Histogram selector
    if (selector === "x") {
      targetClass = ".AxisSelector__xHistogram"
      axisSelection = xSelector
    } else
    if (selector === "y") {
      targetClass = ".AxisSelector__yHistogram"
      axisSelection = ySelector
    }
    // CSS data for D3
    const height = 100
    const width = d3.select(targetClass).node().getBoundingClientRect().width
    const margin = ({top: 20, right: 20, bottom: 30, left: 40})

    // Create D3 template
    const svg = d3.select(targetClass).append("svg").classed("AxisSelector__Svg", true).attr('width', width).attr('height', height)

    // Filter Data array for histogram
    const dataArr = data.map(obj => obj[axisSelection])

    // X-axis Linear Scale
    const x = d3.scaleLinear()
      .domain(d3.extent(dataArr)).nice()
      .range([margin.left, width - margin.right])
    
    const bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(20))
    (dataArr)

    // Y-axis Linear Scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)]).nice()
      .range([height - margin.bottom, margin.top])
    
    // X-axis Positioning
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
    
    // Y-axis Positioning
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

    // Append d3 data to DOM
    svg.append("g")
      .call(xAxis);
    svg.append("g")
        .attr("fill", "steelblue")
      .selectAll("rect")
      .data(bins)
      .enter().append("rect")
        .attr("x", d => x(d.x0) + 1)
        .attr("width", d => Math.max(0, x(d.x1) - x(d.x0) - 1))
        .attr("y", d => y(d.length))
        .attr("height", d => y(0) - y(d.length));
  }

  renderPlotGraph = () => {
    const { data, xSelector, ySelector } = this.state

    // CSS data for D3
    const height = 300
    const width = d3.select(".App__PlotGraph").node().getBoundingClientRect().width
    const margin = ({top: 20, right: 30, bottom: 30, left: 40})

    // Append SVG to target
    const svg = d3.select(".App__PlotGraph").append("svg").attr("width", width).attr("height", height);


    // x-axis linear scale
    const x = d3.scaleLinear()
      .domain(d3.extent(data, d => d[xSelector]))
      .range([margin.left, width - margin.right])
    
    // y-axis linear scale
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

    // Append d3 data to DOM
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

  updateAxisSelection = (e, axis) => {
    if (axis === 'x') this.setState({ xSelector: e.value })
    if (axis === 'y') this.setState({ ySelector: e.value })
  }
  
  render() {
    const { columns, xSelector, ySelector } = this.state
    return (
      <div className="App">
        <h1>Exoplanet Data Explorer</h1>
        <div className="App__AxisSelectionContainer">
          <AxisSelector columns={columns} update={this.updateAxisSelection} axis='x' title='X-Axis' value={xSelector} />
          <AxisSelector columns={columns} update={this.updateAxisSelection} axis='y' title='Y-Axis' value={ySelector} />
        </div>
        <div className="App__MainContent">
          <h3 className="App__GraphTitle">
            {this.state.xSelector} vs {this.state.ySelector}
          </h3>
          <div className="App__PlotGraph" />
        </div>
      </div>
    );
  }
}

export default App;
