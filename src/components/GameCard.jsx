import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Typography, Card, CardMedia, CardActions, CardContent } from '@material-ui/core';
import fetchFunc from './fetchFunc.js';
import { useStyles } from './GameCard.styles';
import { useHistory } from 'react-router-dom';

export default function GameCard ({ game, index, deleteGame, setGameStartWindow, setGameEndWindow, setActiveSession, setCurrentGameId }) {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem('token');
  const [size, setSize] = React.useState(0);
  const [totalTime, setTotalTime] = React.useState(0);
  const convertTime = (timeString) => {
    if (timeString === '30s') return 30;
    if (timeString === '1min') return 60;
    if (timeString === '1min30s') return 90;
    if (timeString === '2mins') return 120;
    return 0;
  }
  const getTotalTime = (questions) => {
    let tTime = 0;
    if (questions.length) {
      questions.forEach((q) => {
        tTime += convertTime(q.timeLimit);
      })
    }
    return tTime / 60;
  }
  const loadGameData = async () => {
    await fetchFunc('admin/quiz/' + game.id, 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setSize(res.questions.length);
        setTotalTime(getTotalTime(res.questions));
      })
  }
  const handleDeleteGame = async () => {
    const res = await fetchFunc('admin/quiz/' + game.id, 'DELETE', token, null);
    if (res.status === 200) {
      deleteGame(game.id);
    } else {
      console.warn(res);
    }
  }
  const startGame = async () => {
    await fetchFunc('admin/quiz/' + game.id + '/start', 'POST', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(() => setGameStartWindow(true))
      .catch((err) => console.warn(err))
    await fetchFunc('admin/quiz/' + game.id, 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setActiveSession(res.active);
        setCurrentGameId(game.id);
      })
  }
  const endGame = async () => {
    await fetchFunc('admin/quiz/' + game.id + '/end', 'POST', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(() => {
        setGameEndWindow(true);
      })
      .catch((err) => console.warn(err))
  }
  if (game) {
    useEffect(() => {
      loadGameData();
    }, [game]);
    return (
        <Grid item key={index} xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cardMedia}
            image={ game.thumbnail ? game.thumbnail : 'https://source.unsplash.com/random'}
            title="Image title"
          />
          <CardContent className={classes.cardContent}>
            <Typography gutterBottom variant="h5" component="h2">
              {game.name}
            </Typography>
            <Typography>
              {size ? size + ' Questions' : size + ' Question'}
            </Typography>
            <Typography>
              Time to complete: {totalTime} minutes
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small" color="primary" onClick={ () => history.push('/details/' + game.id) }>
              Edit
            </Button>
            {game.active
              ? (<Button size="small" color="primary" onClick={endGame}>
                End Game
              </Button>)
              : (<Button size="small" color="primary" onClick={startGame}>
                Start Game
              </Button>)}
            <Button size="small" color="primary" onClick={handleDeleteGame}>
              Delete
            </Button>
          </CardActions>
        </Card>
      </Grid>
    )
  }
  return null;
}

GameCard.propTypes = {
  game: PropTypes.object,
  index: PropTypes.number,
  deleteGame: PropTypes.func,
  setGameStartWindow: PropTypes.func,
  setGameEndWindow: PropTypes.func,
  setActiveSession: PropTypes.func,
  setCurrentGameId: PropTypes.func,
};
