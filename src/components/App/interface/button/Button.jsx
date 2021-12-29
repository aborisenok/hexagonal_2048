import PropTypes from 'prop-types';

import './button.css';

const Button = (props) => {
  return (<button
    className={`button ${props.layout}`}
    style={{
      visibility: `${props.hidden ? 'hidden' : 'visible'}`
    }}
    onClick={props.onClick}>
      {props.children}
  </button>);
};

export default Button;

Button.propTypes = {
  layout: PropTypes.string,
  hidden: PropTypes.bool,
  children: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
};
