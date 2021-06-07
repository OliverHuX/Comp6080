import React from 'react';
import { Typography } from '@material-ui/core';
import PropTypes from 'prop-types';

export default function ShowCorrectAnswer ({ answer, answerIds }) {
  return <>
    <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom>
      Answer:
      <br></br>
    </Typography>
    {answer.length !== 0 && answerIds.map(item => {
      return (
        <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom key={item}>
          {answer && Object.keys(answer[item])}
        </Typography>
      )
    })}
  </>
}
ShowCorrectAnswer.propTypes = {
  answer: PropTypes.array,
  answerIds: PropTypes.array,
};
