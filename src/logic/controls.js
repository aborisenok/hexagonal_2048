import { KEY_SHIFT_AXIS } from '../common/constants'

const onKeyPressed = ({ code }, cb) => {
  if (KEY_SHIFT_AXIS[code]) {
    cb(KEY_SHIFT_AXIS[code]);
  }
};

export const addKeysControlsListener = (cb) => {
  document.addEventListener("keydown", (event) => onKeyPressed(event, cb));
}

export const addResizeListener = (cb) => {
  window.addEventListener("resize", cb);
}
