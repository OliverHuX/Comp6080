import React from 'react';
// import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Title from '../components/Title';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

const useStyles = makeStyles((theme) => ({
  depositContext: {
    flex: 1,
  },
}))
export default function LittleInfoBox ({ data }) {
  const classes = useStyles();
  return (
    <React.Fragment>
      <Title>Quiz</Title>
      <Typography component="p" variant="h4">
        {data} Questions
      </Typography>
      <Typography color="textSecondary" className={classes.depositContext}>
        on {new Date().toLocaleString()}
      </Typography>
    </React.Fragment>
  );
}
LittleInfoBox.propTypes = {
  data: PropTypes.array,
};
