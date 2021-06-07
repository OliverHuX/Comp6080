import React from 'react';
import { Typography } from '@material-ui/core';
import FetchFunc from '../components/fetchFunc';
import PropTypes from 'prop-types';

let timer = null

export default function Counter ({ playerId, history }) {
  const [seconds, setSeconds] = React.useState(30);
  // const [t, setT] = React.useState('');
  React.useEffect(() => {
    result()
  }, [])

  function result () {
    const result = FetchFunc('play/' + playerId + '/question', 'GET', null, null)
    result.then((data) => {
      if (data.status === 200) {
        data.json().then(res => {
          if (res.question.timeLimit === '30s') {
            setSeconds(30)
          } else if (res.question.timeLimit === '1min') {
            setSeconds(60)
          } else if (res.question.timeLimit === '1min30s') {
            setSeconds(90)
          } else if (res.question.timeLimit === '2mins') {
            setSeconds(120)
          }
          // setT(res.question.timeLimit)
        })
      } else {
        data.json().then(result => {
          console.log(result.error)
        })
      }
    })
  }

  React.useEffect(() => {
    timer = window.setInterval(() => {
      setSeconds(s => s - 1);
    }, 1000);
  }, []);
  console.log(seconds)

  if (seconds <= 0) {
    clearInterval(timer);
    history.push('/showans/' + playerId)
  }

  return <>
    <Typography variant="h5" align="center" color="inherit" gutterBottom>
          {seconds}s Left
    </Typography>
  </>
}

Counter.propTypes = {
  playerId: PropTypes.number,
  history: PropTypes.func
};
