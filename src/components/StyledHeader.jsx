import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import SchoolIcon from '@material-ui/icons/School';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import { makeStyles } from '@material-ui/core/styles';
import logout from './logout';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  logout: {
    position: 'relative',
    display: 'flex',
    marginLeft: 'auto',
    marginRight: 0,
    cursor: 'pointer'
  },
  icons: {
    position: 'relative',
    marginLeft: theme.spacing(2),
    marginRight: 0,
    cursor: 'pointer'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
}));

const jumpto = () => {
  window.location.href = '/join'
}
export function IconButton ({ icon, handleOnClick }) {
  const classes = useStyles();
  if (!handleOnClick) handleOnClick = (icon === 'join' ? jumpto : logout)
  if (icon === 'join') {
    return (
      <SportsEsportsIcon className={classes.icons} align="right" onClick={handleOnClick}>
      </SportsEsportsIcon>
    )
  }
  return (
    <ExitToAppIcon className={classes.icons} align="right" onClick={handleOnClick}>
    </ExitToAppIcon>
  )
}
IconButton.propTypes = {
  icon: PropTypes.string,
  handleOnClick: PropTypes.func
};
export function StyledHeader ({ handleOnClick }) {
  const classes = useStyles();
  const token = localStorage.getItem('token');
  return (
    <AppBar position="relative">
      <Toolbar>
        <SchoolIcon className={classes.icon} />
        <Typography variant="h6" color="inherit" noWrap>
          BigBrain
        </Typography>
        <div className={classes.logout} color="inherit">
          <IconButton handleOnClick={handleOnClick} icon={'join'} />
          {token && (<IconButton handleOnClick={handleOnClick} icon={'logout'} />)}
        </div>
      </Toolbar>
    </AppBar>
  )
}
StyledHeader.propTypes = {
  handleOnClick: PropTypes.func
};
