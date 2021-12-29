import React from "react";
import PropTypes from 'prop-types';

import "./cell.css";

const Cell = (props) => {
  return (
    <div
      id={props.cellData.id}
      data-x={props.cellData.x}
      data-y={props.cellData.y}
      data-z={props.cellData.z}
      data-value={props.value}
      style={{
        fontSize: `${10 / props.level}vh`,
        width: `${props.width}px`,
        height: `${props.height}px`,
        opacity: `${props.cellData.value ? 1 : 0}`,
        filter: `hue-rotate(${10 * props.cellData.value}deg)`,
        transform: `translateX(${props.x}px) translateY(${props.y}px)`
      }}
      className={`cell ${props.cellData.value ? 'fade_in' : ''}`}
    >
      <span className="cell_value">{props.value}</span>
    </div>
  );
};

export default React.memo(Cell);

Cell.propTypes = {
  level: PropTypes.number.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  cellData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  }).isRequired,
};

