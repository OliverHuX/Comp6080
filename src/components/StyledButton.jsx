import React from 'react';
import Button from '@material-ui/core/Button';
import PropTypes from 'prop-types';

const StyledButton = ({ buttonValue, handleClick }) => (

  <Button variant="contained" color="primary" onClick={handleClick}>
    {buttonValue}
    </Button>);
export default StyledButton;

StyledButton.propTypes = {
  buttonValue: PropTypes.string,
  handleClick: PropTypes.func
};
