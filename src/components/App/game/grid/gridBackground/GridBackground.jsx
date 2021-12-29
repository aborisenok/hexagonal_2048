import PropTypes from 'prop-types';

import {
  getCellXPosition,
  getCellYPosition,
  getCellWidth,
  getCellHeight,
  generateCells
} from "../../../../../logic/logic";

import "./gridBackground.css";

const GridBackground = (props) => {
  const cells = generateCells(props.radius);
  const cellWidth = getCellWidth(props.width, props.radius);
  const cellHeight = getCellHeight(cellWidth);
  return (
    <div
      className="grid_background"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`
      }}
    >
      {cells.map((cell, i) => {
        const x = getCellXPosition(props.width, cellWidth, cell.x);
        const y = getCellYPosition(props.height, cellHeight, cell.x, cell.z);
        return (
          <div
            key={i}
            style={{
              width: `${cellWidth}px`,
              height: `${cellHeight}px`,
              transform: `translateX(${x}px) translateY(${y}px) scale(0.98)`
            }}
            className="background_cell"
          >
          </div>
        );
      })}
    </div>
  );
};

export default GridBackground;

GridBackground.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired
};
