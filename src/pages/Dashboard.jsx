import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Typography } from '@material-ui/core';
import Container from '@material-ui/core/Container';
import GameCard from '../components/GameCard';
import AddNewPopup from '../components/AddNewPopup';
import { TextPopup } from '../components/TextPopup';
import fetchFunc from '../components/fetchFunc.js';
import { useStyles } from './Dashboard.styles';
import { useHistory } from 'react-router-dom';
import { StyledHeader } from '../components/StyledHeader';

export default function Dashboard () {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem('token');
  const [render, setRender] = React.useState(false);
  const [games, setGames] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [nameNewGame, setNameNewGame] = React.useState('');
  const [deleteWindow, setDeleteWindow] = React.useState(false);
  const [gameStartWindow, setGameStartWindow] = React.useState(false);
  const [gameEndWindow, setGameEndWindow] = React.useState(false);
  const [activeSession, setActiveSession] = React.useState(0);
  const [currentGameId, setCurrentGameId] = React.useState(0);
  const [jsonFile, setJsonFile] = React.useState({});
  useEffect(() => {
    loadGames(setGames);
  }, [gameStartWindow, gameEndWindow, open, render]);
  const loadGames = async () => {
    await fetchFunc('admin/quiz', 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setGames(res.quizzes.sort((a, b) => { return new Date(b.createdAt) - new Date(a.createdAt) }))
      })
  };

  const deleteGame = (id) => {
    const newGames = games.filter((game) => game.id !== id);
    setGames(newGames);
  };
  const handleAddNewGame = async () => {
    const res = await fetchFunc('admin/quiz/new', 'POST', token, JSON.stringify({ name: nameNewGame }));
    if (res.status === 200) {
      setOpen(false);
    } else {
      console.warn(res);
    }
  }
  const handleEndGame = () => {
    setGameEndWindow(false);
    history.push('/adminGameResult/' + activeSession);
  }
  // source: https://stackoverflow.com/questions/61707105/react-app-upload-and-read-json-file-into-variable-without-a-server
  const loadJsonFile = e => {
    const fileReader = new FileReader();
    fileReader.readAsText(e.target.files[0], 'UTF-8');
    fileReader.onload = e => {
      e.target.result && setJsonFile(JSON.parse(e.target.result));
    };
  };
  const handleLoadJson = async () => {
    for (const key in jsonFile) {
      const body = JSON.stringify({
        questions: jsonFile[key].questions,
        name: jsonFile[key].name,
        thumbnail: null
      });
      await fetchFunc('admin/quiz/new', 'POST', token, JSON.stringify({ name: jsonFile[key].name }))
        .then(res => (res.ok ? res : Promise.reject(res)))
        .then(res => res.json())
        .then((res) => fetchFunc('admin/quiz/' + res.quizId, 'PUT', token, body))
        .then(res => (res.ok ? res : Promise.reject(res)))
        .then(res => {
          if (res.status === 200) {
            setRender(!render);
          }
        })
    }
  }
  const handleNextGame = async () => {
    await fetchFunc('admin/quiz/' + currentGameId + '/advance', 'POST', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        localStorage.setItem('signal', res.stage)
      })
      .catch(err => console.warn(err))
    await fetchFunc('admin/session/' + activeSession + '/status', 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        !res.results.active && setGameEndWindow(true);
      })
      .catch(err => console.warn(err))
  }
  useEffect(() => {
    handleLoadJson();
  }, [jsonFile]);
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/>
      <main>
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              Dashboard
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Welcome to the Dashboard!
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container justify="center">
                <Grid item>
                  {activeSession
                    ? (<Button variant="contained" color="primary" onClick={handleNextGame}>
                    Go To Next Question
                    </Button>)
                    : null}
                </Grid>
              </Grid>
            </div>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <AddNewPopup
                    open={open}
                    setOpen={setOpen}
                    title={'Create New Game'}
                    contentText={'To create new game to this website, please provide a name for the game.'}
                    textLabel={'Name for the New Game'}
                    handleTextOnChange={(event) => setNameNewGame(event.target.value)}
                    hundleOnClick={handleAddNewGame}
                  />
                </Grid>
                <Grid item>
                  <label variant="outlined" color="primary" className={classes.linkButton}>
                    <input type="file" accept="application/JSON" className={classes.inputFile} onChange={loadJsonFile} />
                      LOAD JSON FILE
                  </label>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          <Grid container spacing={4}>
            {games.map((val, idx) => {
              return (
                <GameCard
                  key={idx}
                  index={idx}
                  game={games[idx]}
                  deleteGame={deleteGame}
                  deleteWindow={deleteWindow}
                  setDeleteWindow={setDeleteWindow}
                  setGameStartWindow={setGameStartWindow}
                  setGameEndWindow={setGameEndWindow}
                  setActiveSession={setActiveSession}
                  setCurrentGameId={setCurrentGameId}
                />
              )
            })}
          </Grid>
        </Container>
        <TextPopup
          open={gameStartWindow}
          setOpen={setGameStartWindow}
          title={'Current session ID is ' + activeSession}
          handleOnClick={() => navigator.clipboard.writeText(activeSession)}
          buttonText={'copy link'}
        />
        <TextPopup
          open={gameEndWindow}
          setOpen={setGameEndWindow}
          title={'Would you like to view the result?'}
          handleOnClick={handleEndGame}
          buttonText={'YES'}
        />
      </main>
    </React.Fragment>
  );
}
