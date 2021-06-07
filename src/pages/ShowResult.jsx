import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import CameraIcon from '@material-ui/icons/PhotoCamera';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useStyles } from './Dashboard.styles';
import FetchFunc from '../components/fetchFunc';
import Button from '@material-ui/core/Button';
import { useHistory } from 'react-router-dom';

export default function ShowResult () {
  const classes = useStyles();
  const players = JSON.parse(localStorage.getItem('players'));
  const [results, setResult] = React.useState([]);
  const history = useHistory();
  useEffect(() => {
    res()
    result()
  }, [])
  function result (playerId, name) {
    const result = FetchFunc('play/' + playerId + '/results', 'GET', null, null)
    result.then((data) => {
      if (data.status === 200) {
        data.json().then(result => {
          setResult((results) => [...results, { [name]: result }])
        })
      } else {
        data.json().then(result => {
          console.log(result.error)
        })
      }
    })
  }
  const res = () => {
    for (let i = 0; i < players.length; i++) {
      const name = players[i].name
      result(players[i].id, name)
    }
  }
  console.log(results)

  const Showans = () => {
    return <>
      <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom>
        RESULTS:
        <br></br>
      </Typography>
      {results.map(item => {
        let counter = 0
        return (
          <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom key={item}>
            Player: {Object.keys(item)[0]}
            <br></br>
            {item[Object.keys(item)[0]].map(quiz => {
              counter++
              return (
                <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom key={quiz}>
                  Question {counter}: {JSON.stringify(quiz.correct)}
                </Typography>
              )
            })}
          </Typography>
        )
      })}
    </>
  }

  const back = () => {
    history.push('/join');
    localStorage.removeItem('players')
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
            <Showans />
          </Container>
        </div>
      </main>
      {/* Footer */}
      <footer className={classes.footer}>
      <Container maxWidth="sm">
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={() => back()}
          >
            Back To Join Session
          </Button>
        </Container>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
