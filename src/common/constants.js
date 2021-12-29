export const AXIS = {
  upLeft: {
    mainAxis: 'z',
    directionAxis: 'x'
  },
  up: {
    mainAxis: 'x',
    directionAxis: 'z'
  },
  upRight: {
    mainAxis: 'y',
    directionAxis: 'z'
  },
  downRight: {
    mainAxis: 'z',
    directionAxis: 'y'
  },
  down: {
    mainAxis: 'x',
    directionAxis: 'y'
  },
  downLeft: {
    mainAxis: 'y',
    directionAxis: 'x'
  }
};

export const KEY_SHIFT_AXIS = {
  KeyQ: AXIS.upLeft,
  KeyW: AXIS.up,
  KeyE: AXIS.upRight,
  KeyD: AXIS.downRight,
  KeyS: AXIS.down,
  KeyA: AXIS.downLeft
};

export const SERVER_PORTS = {
  LOCAL: {
    label: 13337,
    value: 13337
  },
  REMOTE: {
    label: 80,
    value: 80
  }
};

export const SERVER_URLS = {
  LOCAL: {
    label: "localhost",
    value: "localhost"
  },
  REMOTE: {
    label: "hex2048szb9jquj-hex15.functions.fnc.fr-par.scw.cloud",
    value: "hex2048szb9jquj-hex15.functions.fnc.fr-par.scw.cloud"
  }
};

export const LEVELS_RANGE = {
  MIN: 2,
  MAX: 7
};

export const GAME_STATUS = {
  PLAYING: {
    key: 'playing',
    text: 'Playing'
  },
  GAME_OVER: {
    key: 'game-over',
    text: 'Game Over'
  },
  SERVER_FAIL: {
    key: 'server-fail',
    text: 'Server Fail'
  }
};

export const COLOR_THEME = {
  LIGHT: 'light',
  DARK: 'dark'
};