import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import SchoolIcon from '@material-ui/icons/School';
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import { useStyles } from './Dashboard.styles';
import FetchFunc from '../components/fetchFunc';
import ReactPlayer from 'react-player'
import { useHistory } from 'react-router-dom';
import Counter from '../components/Counter';
import Choices from '../components/Choices';

function status (playerId, setSta) {
  const result = FetchFunc('play/' + playerId + '/status', 'GET', null, null);
  result.then((data) => {
    if (data.status === 200) {
      data.json().then(result => {
        setSta(result.started)
      })
    } else {
      data.json().then(result => {
        console.log(result.error)
        window.location.href = '/results'
      })
    }
  })
}

export default function Playgame () {
  const classes = useStyles();
  const [quiz, setQuiz] = React.useState({ question: '', type: '', timelimit: '', file: '', filetype: '', point: '' });
  const [sta, setSta] = React.useState(false);
  const url = window.location.href.split('/')
  const playerId = url[url.length - 1]
  const history = useHistory();

  window.addEventListener('storage', (e) => {
    console.log('received stage: ' + e.newValue)
    const current = window.location.href;
    window.location.href = current;
  })

  console.log(playerId)
  useEffect(() => {
    result()
  }, [])
  function result () {
    const result = FetchFunc('play/' + playerId + '/question', 'GET', null, null)
    result.then((data) => {
      if (data.status === 200) {
        data.json().then(res => {
          setQuiz({ question: res.question.name, type: res.question.questionType, timelimit: res.question.timeLimit, file: res.question.file, filetype: res.question.fileType, point: res.question.point })
        })
      } else {
        data.json().then(result => {
          console.log(result.error)
        })
      }
    })
  }
  console.log(quiz.point)
  const Screen = () => {
    status(playerId, setSta)
    const videoRef = React.useRef();
    const imgRef = React.useRef();
    if (sta) {
      return <>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Let&apos;s get started!
        </Typography>
        <Typography component="h1" variant="h2" align="center" color="primary" gutterBottom>
          Question
        </Typography>
        <Typography component="h1" variant="h5" align="center" color="primary" gutterBottom>
          {quiz.point} Point
        </Typography>
        <br></br>
        <Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
          {quiz.question}
        </Typography>
        {quiz.filetype === 'image' &&
          <Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
            <img ref={imgRef} src={quiz.file} className={classes.img} />
          </Typography>
        }
        {quiz.filetype === 'video' &&
          <Typography component="h1" variant="h5" align="center" color="textPrimary" gutterBottom>
            <ReactPlayer ref={videoRef} className={classes.img} url={quiz.file} />
          </Typography>
        }
        <br></br>
        <Choices playerId={playerId} />
      </>
    } else {
      return <>
      <br></br>
      <br></br>
      <Typography component="h1" variant="h2" align="center" color="primary" gutterBottom>
        Waiting for start
      </Typography>
      </>
    }
  }

  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
          <SchoolIcon className={classes.icon} />
          <Typography variant="h6" color="inherit" noWrap>
            BigBrain
          </Typography>
        </Toolbar>
      </AppBar>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Screen />
          </Container>
        </div>
        <div className={classes.gifContainer}>
          {!sta && <img src='https://media0.giphy.com/media/KGGJeW0OH1bIHGohmZ/source.gif' className={classes.gif} />}
        </div>
      </main>
      {/* Footer */}
      {sta && <Counter playerId={playerId} history={history}/>}
      <footer className={classes.footer}>
        <Typography variant="subtitle1" align="center" color="textSecondary" component="p">
          Have Fun!
        </Typography>
      </footer>
      {/* End footer */}
    </React.Fragment>
  );
}
