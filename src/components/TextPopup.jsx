import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

export const TextButton = ({ buttonText = 'OK', handleOnClick }) => {
  return (
    <Button onClick={handleOnClick} color="primary">
      {buttonText}
    </Button>
  )
}
TextButton.propTypes = {
  handleOnClick: PropTypes.func,
  buttonText: PropTypes.string,
};
export function TextPopup ({ open = false, setOpen, title = 'Notification', handleOnClick, buttonText }) {
  const handleClose = () => setOpen(false);
  return (
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" fullWidth>
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
        </DialogContent>
        <DialogActions>
          <TextButton buttonText={'Cancel'} handleOnClick={handleClose}/>
          <TextButton buttonText={buttonText} handleOnClick={handleOnClick}/>
        </DialogActions>
      </Dialog>
  );
}
TextPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  title: PropTypes.string,
  handleOnClick: PropTypes.func,
  buttonText: PropTypes.string,
};
