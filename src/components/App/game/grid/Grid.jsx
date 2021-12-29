import PropTypes from 'prop-types';

import Cell from "./cell/Cell";
import GridBackground from "./gridBackground/GridBackground";

import {
  getCellWidth,
  getCellHeight,
  getCellXPosition,
  getCellYPosition
} from "../../../../logic/logic";

import "./grid.css";

const Grid = (props) => {
  const cellWidth = getCellWidth(props.width, props.radius);
  const cellHeight = getCellHeight(cellWidth);

  return (
    <div
      className="grid"
      style={{
        width: `${props.width}px`,
        height: `${props.height}px`
      }}
    >
      <GridBackground
        width={props.width}
        height={props.height}
        radius={props.radius}
      />

      {props.cells.map(cell => {
        return (
          <Cell
            key={cell.id}
            cellData={cell}
            level={props.radius}
            x={getCellXPosition(props.width, cellWidth, cell.x)}
            y={getCellYPosition(props.height, cellHeight, cell.x, cell.z)}
            value={cell.value}
            width={cellWidth}
            height={cellHeight}
          />
        );
      })}
    </div>
  );
};

export default Grid;

Grid.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  radius: PropTypes.number.isRequired,
  cells: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string,
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    z: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired
  })).isRequired
};
