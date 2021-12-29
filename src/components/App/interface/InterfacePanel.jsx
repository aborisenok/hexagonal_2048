import PropTypes from 'prop-types';
import Select from 'react-select';
import InputRange from 'react-input-range';

import Button from './button/Button';

import { SERVER_URLS, LEVELS_RANGE, SERVER_PORTS } from '../../../common/constants'

import "react-input-range/lib/css/index.css"
import "./interfacePanel.css";

const InterfacePanel = (props) => {
  const onGameStart = (event) => {
    event.preventDefault();
    props.onStart();
  }

  return (
    <div
      onSubmit={onGameStart}
      className="interface_panel">
      <h2 className='interface_panel_title'>Game Settings</h2>

      <h3 className='interface_panel_label'>Port:</h3>
      <Select
        isSearchable={false}
        defaultValue={props.port}
        options={Object.values(SERVER_PORTS)}
        onChange={props.onPortChange} />

      <h3 className='interface_panel_label'>Server:</h3>
      <Select
        isSearchable={false}
        defaultValue={props.serverUrl}
        options={Object.values(SERVER_URLS)}
        onChange={props.onServerChange} />

      <h3 className='interface_panel_label'>Level:</h3>
      <InputRange
        maxValue={LEVELS_RANGE.MAX}
        minValue={LEVELS_RANGE.MIN}
        value={props.level}
        onChange={props.onLevelChange} />
      <Button onClick={onGameStart}>Start Game</Button>
    </div>
  );
};

export default InterfacePanel;

InterfacePanel.propTypes = {
  level: PropTypes.number.isRequired,
  port: PropTypes.shape({
    label: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  }).isRequired,
  serverUrl: PropTypes.shape({
    label: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  }).isRequired,
  onPortChange: PropTypes.func.isRequired,
  onServerChange: PropTypes.func.isRequired,
  onLevelChange: PropTypes.func.isRequired,
  onStart: PropTypes.func.isRequired
};
