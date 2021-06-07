import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useStyles } from './Dashboard.styles';
import FetchFunc from '../components/fetchFunc';
import ShowCorrectAnswer from '../components/ShowCorrectAnswer';
export default function ShowAnswer () {
  const classes = useStyles();
  const [answer, setAns] = React.useState([]);
  const url = window.location.href.split('/')
  const playerId = url[url.length - 1]
  const [answerIds, setIds] = React.useState([]);
  window.addEventListener('storage', (e) => {
    window.location.href = ('/playgame/' + playerId)
  })
  useEffect(() => {
    result()
    ans()
  }, [])

  const result = async () => {
    await FetchFunc('play/' + playerId + '/question', 'GET', null, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setAns(res.question.answers)
      })
  }

  const ans = async () => {
    await FetchFunc('play/' + playerId + '/answer', 'GET', null, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setIds(res.answerIds)
      })
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <CameraIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            BigBrain
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <ShowCorrectAnswer answer={answer} answerIds={answerIds} />
          </Container>
        </div>
      </main>
    </React.Fragment>
  );
}
