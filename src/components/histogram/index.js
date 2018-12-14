import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3'; 

import './histogram.sass'

const Histogram = (props) => {
  const renderHistogram = () => {
    const { data, value, axis } = props
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

    // D3 template
    const svg = d3.select(targetClass).classed("AxisSelector__Svg", true).attr('width', width).attr('height', height)

    // Filtered Data array for histogram
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

  return (
    <div className="Histogram">
      {renderHistogram()}
      <svg className={"Histogram__Svg--"} />
    </div>
  )
}

Histogram.propTypes = {

};

export default Histogram;
