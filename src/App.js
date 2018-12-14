import React, { Component } from 'react';
import * as d3 from 'd3';


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
      this.renderPlotGraph()
      this.renderHistogram('x')
      this.renderHistogram('y')
    }
    if (prevState.xSelector !== this.state.xSelector) {
      this.renderHistogram('x')
    } else
    if (prevState.ySelector !== this.state.ySelector) {
      this.renderHistogram('y')
    }
  }

  renderHistogram = (selector) => {
    const { data, xSelector, ySelector } = this.state
    // const axis = selector === 'x' ? "App__XAxisHistogram" : "App__YAxisHistogram"
    const svg = d3.select(".App__XAxisHistogram").attr("width", 300).attr("height", 100)
    const height = 100
    const width = 300
    const margin = ({top: 20, right: 20, bottom: 30, left: 40})
    const dataArr = data.map(obj => obj[xSelector])
    
    const x = d3.scaleLinear()
      .domain(d3.extent(dataArr)).nice()
      .range([margin.left, width - margin.right])
    
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d[xSelector])]).nice()
      .range([height - margin.bottom, margin.top])
    
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))
    
    const yAxis = g => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
    
    const bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(10))
    (dataArr)
    
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
    const height = 300
    const width = 700

    // Appends SVG to target ".App__PlotGraph"
    const svg = d3.select(".App__PlotGraph").attr("width", 700).attr("height", 300);

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
        <div className="App__MainContent">
          <h3 className="App__GraphTitle">
            {this.state.xSelector} vs {this.state.ySelector}
          </h3>
          <div>
            x-axis histogram
            <svg className="App__XAxisHistogram" />
            {/* y-axis histogram
            <svg className="App__YAxisHistogram" /> */}
          </div>
          <svg className="App__PlotGraph" />
        </div>
      </div>
    );
  }
}

export default App;
