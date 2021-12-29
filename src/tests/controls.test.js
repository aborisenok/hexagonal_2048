import * as controls from '../logic/controls';

import { KEY_SHIFT_AXIS } from '../common/constants'

it('fire keybord event by proper key, calback must be called', () => {
  const mockCallback = jest.fn();
  controls.addKeysControlsListener(mockCallback)

  document.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyW'}));

  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith(KEY_SHIFT_AXIS['KeyW']);
});

it('fire keybord event by wrong key, calback must not be called', () => {
  const mockCallback = jest.fn();
  controls.addKeysControlsListener(mockCallback)

  document.dispatchEvent(new KeyboardEvent('keydown', {code: 'KeyI'}));

  expect(mockCallback).toHaveBeenCalledTimes(0);
});


