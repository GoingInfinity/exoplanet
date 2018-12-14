import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3'; 

import './plotGraph.sass'

const PlotGraph = (props) => {
  const renderPlotGraph = () => {
    const { data, xSelector, ySelector } = props

    // CSS data for D3
    const height = 300
    const width = document.body.clientWidth * .95
    const margin = ({top: 20, right: 30, bottom: 30, left: 40})

    // Append SVG to target
    const svg = d3.select(".PlotGraph__Svg").attr("width", width).attr("height", height);


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
    svg.selectAll("g").remove()
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

  return (
    <div className="PlotGraph">
      {renderPlotGraph()}
      <svg className="PlotGraph__Svg" />
    </div>
  )
}

PlotGraph.propTypes = {
  data: PropTypes.array,
  xSelector: PropTypes.string,
  ySelector: PropTypes.string
};

export default PlotGraph;
