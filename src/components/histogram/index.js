import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3'; 

import './histogram.sass'

const Histogram = (props) => {
  const { data, value, axis } = props
  const renderHistogram = () => {
    // CSS data for D3
    const height = 100
    const width = document.querySelector('.Histogram') ? 
    document.querySelector('.Histogram').clientWidth * .9 : 250
    const margin = ({top: 20, right: 20, bottom: 30, left: 40})

    // D3 template
    const svg = d3.select(`.Histogram__Svg--${axis}`).attr('width', width).attr('height', height)

    // Filtered Data array for histogram
    const dataArr = data.map(obj => obj[value])

    // X-axis Linear Scale
    const x = d3.scaleLinear()
      .domain(d3.extent(dataArr)).nice()
      .range([margin.left, width - margin.right])
    
    const bins = d3.histogram()
      .domain(x.domain())
      .thresholds(x.ticks(20))(dataArr)

    // Y-axis Linear Scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(bins, d => d.length)]).nice()
      .range([height - margin.bottom, margin.top])
    
    // X-axis Positioning
    const xAxis = g => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickSizeOuter(0))

    // Append d3 data to DOM
    svg.selectAll("g").remove()
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
      <svg className={"Histogram__Svg--"+axis} />
    </div>
  )
}

Histogram.propTypes = {
  axis: PropTypes.string,
  value: PropTypes.string,
  data: PropTypes.array,
};

export default Histogram;
