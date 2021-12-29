import {v4 as uuidv4} from 'uuid';
import {
  AXIS,
  LEVELS_RANGE,
  COLOR_THEME
 } from '../common/constants';

export const getGridSize = (radius) => {
  const screenHeight = window.innerHeight;
  const gridHeight = screenHeight * 0.7;

  const gridWidth =
    (gridHeight * (3 * radius - 1)) / (Math.sqrt(3) * (2 * radius - 1));

  return {
    width: getNearestEvenValue(gridWidth),
    height: getNearestEvenValue(gridHeight)
  };
};

export const getCellWidth = (gridWidth, radius) => {
  const width = (gridWidth / (3 * radius - 1)) * 2;
  return getNearestEvenValue(width);
};

export const getCellHeight = (cellWidth) => {
  const height = (Math.sqrt(3) * cellWidth) / 2;

  return getNearestEvenValue(height);
};

export const getCellXPosition = (gridWidth, cellWidth, coordX) => {
  const cellCenterShiftX = (gridWidth - cellWidth) / 2;
  const cellResultshiftX = cellCenterShiftX + (cellWidth * coordX * 3) / 4;

  return Math.round(cellResultshiftX);
};

export const getCellYPosition = (gridHeight, cellHeight, coordX, coordZ) => {
  const cellCenterShiftY = (gridHeight - cellHeight) / 2;

  const cellResultshiftY =
    cellCenterShiftY + cellHeight * (coordZ + coordX / 2);
  return Math.round(cellResultshiftY);
};

export const generateCells = (radius, isIds) => {
  const cells = [];
  const n = radius - 1;

  for (let q = -n; q <= n; q++) {
    const r1 = Math.max(-n, -q - n);
    const r2 = Math.min(n, -q + n);
    for (let r = r1; r <= r2; r++) {
      const cell = {
        x: -q - r,
        y: r,
        z: q,
        value: 0
      }

      if (isIds) {
        cell.id = uuidv4();
      }

      cells.push(cell);
    }
  }

  return cells;
};

export const getFilledCells = (cells) => {
  return cells.filter((cell) => !!cell.value);
};

export const mergeCells = (cells, newCells) => {
  return cells.map((cell) => {
    const isCell = newCells.find((newCell) => {
      return (
        newCell.x === cell.x && newCell.y === cell.y && newCell.z === cell.z
      );
    });

    if (isCell) {
      cell.value = isCell.value;
    }

    return cell;
  });
};

const getNearestEvenValue = (value) => {
  if (Math.ceil(value) % 2) {
    return Math.floor(value);
  } else {
    return Math.ceil(value);
  }
};

const checkCellForMerge = (targetCell, cell, mergedCells) => {
  const isEmptyCell = !targetCell.value;
  const isMergable = targetCell.value === cell.value;
  const isAlreadyMerged = mergedCells.find(mergedCell => {
    return mergedCell.x === targetCell.x && mergedCell.y === targetCell.y && mergedCell.z === targetCell.z;
  })

  return (isMergable && !isAlreadyMerged) || isEmptyCell;
}

const combineTwoCells = (targetCell, newCell) => {
  const tempCell = {...newCell};
  const isNotEmptyMerge = !!newCell.value && !!targetCell.value;

  newCell.x = targetCell.x;
  newCell.y = targetCell.y;
  newCell.z = targetCell.z;
  newCell.value = newCell.value + targetCell.value;

  targetCell.x = tempCell.x;
  targetCell.y = tempCell.y;
  targetCell.z = tempCell.z;
  targetCell.value = 0;

  if (isNotEmptyMerge) {
    return newCell;
  } else {
    return null;
  }
}

const getCellByAxisValue = (cellsLine, axis, axisCoord) => {
  return cellsLine.find(cell => cell[axis] === axisCoord);
}

export const moveCells = (cells, mainAxis, directionAxis) => {
  const resultCells = [...cells];
  let isCellsChanged = false;

  const cellsLines = getAxisLines(resultCells, mainAxis);

  cellsLines.forEach(cellsLine => {
    const mergedCells = [];

    cellsLine = sortAxisLines(cellsLine, directionAxis);

    cellsLine.forEach((cell, i) => {
      if (cell.value) {
        let nextCellPosition = cell[directionAxis] - 1;
        let cellForMerge = null;

        while (getCellByAxisValue(cellsLine, directionAxis, nextCellPosition)) {
          const nextCell = getCellByAxisValue(cellsLine, directionAxis, nextCellPosition);

          if (nextCell) {
            if (checkCellForMerge(nextCell, cell, mergedCells)) {
              cellForMerge = nextCell;
              nextCellPosition--;
            } else {
              break;
            }
          }
        }

        if (cellForMerge) {
          const resMerged = combineTwoCells(cellForMerge, cell);

          if (resMerged) {
            mergedCells.push(resMerged);
          }
  
          cellForMerge = null;
          isCellsChanged = true;
        }
      }
    });
  })

  return {
    resultCells,
    isCellsChanged
  };
};

const getAxisLines = (cells, axis) => {
  const axisLines = cells.reduce((res, cell) => {
    if (!res[cell[axis]]) {
      res[cell[axis]] = [];
    }

    res[cell[axis]].push(cell);

    return res;
  }, {});

  return Object.values(axisLines);
}

const sortAxisLines = (cellsLine, directionAxis) => {
  return cellsLine.sort((cellA, cellB) => {
    return cellA[directionAxis] - cellB[directionAxis];
  });
}

const checkMoveInLine = (cellsLine) => {
  let isMove = false;
  let prevValue = null;

  cellsLine.forEach(cell => {
    if (cell.value === 0 || cell.value === prevValue) {
      isMove = true;
    } else {
      prevValue = cell.value;
    }
  })

  return isMove;
}

export const isGameOver = (cells) => {
  let isMovePossible = false;

  Object.values(AXIS).forEach(axis => {
    const axisLines = getAxisLines(cells, axis.mainAxis);

    axisLines.forEach(line => {
      const sortedCellsLine = sortAxisLines(line, axis.directionAxis);
      const isMoveInLine = checkMoveInLine(sortedCellsLine);

      if (isMoveInLine) {
        isMovePossible = true;
      }
    })
  })

  return !isMovePossible;
}

export const validateQueryParams = (hostname, port, level) => {
  const isHostNameValid = hostname && hostname.trim().length > 0;
  const isPort = port && port.trim().length > 0;
  const levelValue = level ? parseInt(level, 10) : 0;
  const isLevel = Number.isInteger(levelValue) && checkGameSizeLimit(levelValue);

  return !!isHostNameValid && !!isPort && !!isLevel;
}

export const checkGameSizeLimit = (level) => {
  let isLevelValid = true;

  if (level > LEVELS_RANGE.MAX) {
    isLevelValid = false;
  }

  if (level < LEVELS_RANGE.MIN) {
    isLevelValid = false;
  }
  
 return isLevelValid;
}

export const setThemeToLocalStorage = (value) => {
  window.localStorage.setItem("theme", value);
}

export const getThemeFromLocalStorage = () => {
  return window.localStorage.getItem("theme") || COLOR_THEME.LIGHT;
}