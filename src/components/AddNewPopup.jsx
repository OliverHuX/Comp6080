import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import StyledButton from './StyledButton';

export default function AddNewPopup ({ open, setOpen, title, contentText, textLabel, handleTextOnChange, hundleOnClick }) {
  const handleClose = () => setOpen(false);
  return (
    <div>
      <StyledButton buttonValue={title} handleClick={() => setOpen(true)}>
      </StyledButton>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {contentText}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label={textLabel}
            type="text"
            onChange={handleTextOnChange}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            color="primary"
            onClick={hundleOnClick}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
AddNewPopup.propTypes = {
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  title: PropTypes.string,
  textLabel: PropTypes.string,
  contentText: PropTypes.string,
  handleTextOnChange: PropTypes.func,
  hundleOnClick: PropTypes.func,
};
