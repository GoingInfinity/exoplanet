import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';

import './axisSelector.sass';

const AxisSelector = (props) => {
  const options = props.columns.map(title => ({
    value: title,
    label: title
  }))

  return (
    <div className="AxisSelector__Container">
      <h4>{props.title}</h4>
      <Select 
        className="AxisSelector__Dropdown"
        value={{label: props.value}}
        options={options}
        onChange={(e) => props.update(e,props.axis)}
      />
      <div className={"AxisSelector__" + props.axis + "Histogram AxisSelector__Histogram"} />
    </div>
  )
}

AxisSelector.propTypes = {
  title: PropTypes.string,
  axis: PropTypes.string,
  update: PropTypes.func,
  columns: PropTypes.array,
  value: PropTypes.string
};

export default AxisSelector;
