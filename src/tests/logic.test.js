import * as logic from '../logic/logic';
import { COLOR_THEME } from '../common/constants';

beforeAll(() => {
  window.innerHeight = 100;
});

test('calculate grid size acording to screen height', () => {
  expect(logic.getGridSize(3)).toEqual({width: 64, height: 70});
});

test('calculate grid cell width ', () => {
  expect(logic.getCellWidth(100, 2)).toBe(40);
});

test('calculate grid cell height', () => {
  expect(logic.getCellHeight(100)).toBe(86);
});

test.each([
  {gridWidth: 100, cellWidth: 40, coordX: -1, expected: 0},
  {gridWidth: 100, cellWidth: 40, coordX: 0, expected: 30},
  {gridWidth: 100, cellWidth: 40, coordX: 1, expected: 60},
])('calculate grid cell x coordinate', ({gridWidth, cellWidth, coordX, expected}) => {
  expect(logic.getCellXPosition(gridWidth, cellWidth, coordX)).toBe(expected);
});

test.each([
  {gridHeight: 100, cellHeight: 86, coordX: -1, coordZ: 1,  expected: 50},
  {gridHeight: 100, cellHeight: 86, coordX: 0, coordZ: 0, expected: 7},
  {gridHeight: 100, cellHeight: 86, coordX: 1, coordZ: -1, expected: -36},
])('calculate grid cell y coordinate', ({gridHeight, cellHeight, coordX, coordZ, expected}) => {
  expect(logic.getCellYPosition(gridHeight, cellHeight, coordX, coordZ)).toBe(expected);
});


test.each([
  {radius: 2, isIds: false, expected: 7},
  {radius: 3, isIds: false, expected: 19},
  {radius: 4, isIds: true, expected: 37},
])('generate grid cells', ({radius, isIds, expected}) => {
  const cells = logic.generateCells(radius, isIds);

  const cellsCorrectCoord = cells.filter(cell => {
    return (cell.x + cell.y + cell.z) === 0;
  });

  const cellsCorrectVal = cells.filter(cell => {
    return cell.value === 0;
  })

  const cellsWithIds = cells.filter(cell => {
    return cell.id;
  })

  expect(cells.length).toBe(expected);
  expect(cellsCorrectCoord.length).toBe(expected);
  expect(cellsCorrectVal.length).toBe(expected);
  expect(cellsWithIds.length).toBe(isIds ? expected : 0);
});

test('get only cells with value', () => {
  const cells = [{value: 0},{value: 2},{value: 0}]
  const filteredCells = logic.getFilledCells(cells);

  expect(filteredCells.length).toBe(1);
});

test.each([
  {
    cells: [
      {x: 1, y: 0, z: -1, value: 0},
      {x: 0, y: 0, z: 0, value: 2}
    ],
    newCells:  [
      {x: -1, y: 0, z: 1, value: 0},
      {x: -1, y: 1, z: 0, value: 2}
    ],
    expected: [
      {x: 1, y: 0, z: -1, value: 0},
      {x: 0, y: 0, z: 0, value: 2}
    ]
  },
  {
    cells: [
      {x: 1, y: 0, z: -1, value: 0},
      {x: 0, y: 0, z: 0, value: 0}
    ],
    newCells:  [
      {x: 1, y: 0, z: -1, value: 2},
      {x: 0, y: 0, z: 0, value: 2}
    ],
    expected: [
      {x: 1, y: 0, z: -1, value: 2},
      {x: 0, y: 0, z: 0, value: 2}
    ]
  }
])('merge existing cells with new cells', ({cells, newCells, expected}) => {
  expect(logic.mergeCells(cells, newCells)).toEqual(expected);
});

test.each([
  {
    filledCells: [
      {x: 0, y: 2, z: -2, value: 2},
      {x: -1, y: 2, z: -1, value: 2},
      {x: 0, y: -2, z: 2, value: 2}
    ],
    mainAxis:  'x',
    directionAxis: 'z',
    expected: [
      {x: 0, y: 2, z: -2, value: 2},
      {x: -1, y: 2, z: -1, value: 4}
    ],
    isChanged: true
  },
  {
    filledCells: [
      {x: 0, y: 2, z: -2, value: 4},
      {x: 0, y: 2, z: -1, value: 2},
      {x: -1, y: -2, z: 2, value: 2}
    ],
    mainAxis:  'x',
    directionAxis: 'z',
    expected: [
      {x: 0, y: 2, z: -2, value: 4},
      {x: 0, y: 1, z: -1, value: 2},
      {x: -1, y: 2, z: -1, value: 2}
    ],
    isChanged: false
  },
  {
    filledCells: [
      {x: 0, y: 2, z: -2, value: 2},
      {x: 0, y: 1, z: -1, value: 2},
      {x: 0, y: 0, z: 0, value: 4}
    ],
    mainAxis:  'x',
    directionAxis: 'z',
    expected: [
      {x: 0, y: 2, z: -2, value: 4},
      {x: 0, y: 1, z: -1, value: 4},
    ],
    isChanged: true
  }
])('move cells along axis', ({filledCells, mainAxis, directionAxis, expected, isChanged}) => {
  const cells = logic.generateCells(3);
  const resultCells = logic.mergeCells(cells, filledCells)


  expect(logic.moveCells(resultCells, mainAxis, directionAxis)).toEqual({
    isCellsChanged: isChanged,
    resultCells: logic.mergeCells(cells, expected)
  });
});


test.each([
  {
    cells: [
      {x: -1, y: 1, z: 0, value: 8},
      {x: -1, y: 0, z: 1, value: 4},
      {x: 0, y: 1, z: -1, value: 2},
      {x: 0, y: 0, z: 0, value: 2},
      {x: 0, y: -1, z: 1, value: 2},
      {x: 1, y: 0, z: 2, value: 64},
      {x: 1, y: -1, z: 2, value: 128}
    ],
    expected: false,
  },
  {
    cells: [
      {x: -1, y: 1, z: 0, value: 2},
      {x: -1, y: 0, z: 1, value: 4},
      {x: 0, y: 1, z: -1, value: 8},
      {x: 0, y: 0, z: 0, value: 16},
      {x: 0, y: -1, z: 1, value: 32},
      {x: 1, y: 0, z: 2, value: 64},
      {x: 1, y: -1, z: 2, value: 128}
    ],
    expected: true,
  }
])('check game over status', ({cells, expected}) => {
  expect(logic.isGameOver(cells)).toBe(expected);
});

test.each([
  { hostname: 'localhost', port: '80', level: '3', expected: true },
  { hostname: '', port: '80', level: '3', expected: false },
  { hostname: 'localhost', port: '', level: '3', expected: false },
  { hostname: 'localhost', port: '80', level: '1', expected: false },
  { hostname: 'localhost', port: '80', level: '10', expected: false }
])('validate query params', ({hostname, port, level, expected}) => {
  expect(logic.validateQueryParams(hostname, port, level)).toBe(expected);
});

test('test localstorage default value', () => {
  expect(logic.getThemeFromLocalStorage()).toBe(COLOR_THEME.LIGHT);
});

test('test localstorage value', () => {
  Storage.prototype.getItem = jest.fn(() => {
    return COLOR_THEME.DARK;
  });

  expect(logic.getThemeFromLocalStorage()).toBe(COLOR_THEME.DARK);
});
