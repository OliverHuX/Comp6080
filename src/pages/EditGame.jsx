import React, { useEffect } from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import QuestionCard from '../components/QuestionCard';
import fetchFunc from '../components/fetchFunc.js';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import AddNewPopup from '../components/AddNewPopup';
import { StyledHeader } from '../components/StyledHeader';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(2),
  },
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  root: {
    flexGrow: 1,
  },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
}));
export default function EditGame () {
  const { id } = useParams();
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem('token');
  const [game, setGame] = React.useState({});
  const [questions, setQuestions] = React.useState([]);
  const [newQ, setNewQ] = React.useState('');
  const [open, setOpen] = React.useState(false);

  const loadGame = async () => {
    await fetchFunc('admin/quiz/' + id, 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setGame(res);
        setQuestions(res.questions);
      })
  };

  const updateQuestions = async () => {
    if (newQ) {
      const newQuestions = [...questions, { name: newQ }];
      const body = JSON.stringify({
        questions: newQuestions,
        name: game.name,
        thumbnail: null
      });
      const res = await fetchFunc('admin/quiz/' + id, 'PUT', token, body)
        .then(res => (res.ok ? res : Promise.reject(res)))
      if (res.status === 200) {
        setOpen(false);
      }
    }
  }
  const deleteQuestion = async (index) => {
    if (index < questions.length) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
      const body = JSON.stringify({
        questions: newQuestions,
        name: game.name,
        thumbnail: null
      });
      await fetchFunc('admin/quiz/' + id, 'PUT', token, body)
        .then(res => (res.ok ? res : Promise.reject(res)))
    }
  }
  useEffect(() => {
    loadGame();
  }, [open]);
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/>
      <main>
        {/* Hero unit */}
        <div className={classes.heroContent}>
          <Container maxWidth="sm">
            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
              {game.name}
            </Typography>
            <Typography variant="h5" align="center" color="textSecondary" paragraph>
              Game Id is {id}
            </Typography>
            <div className={classes.heroButtons}>
              <Grid container spacing={2} justify="center">
                <Grid item>
                  <AddNewPopup
                    open={open}
                    setOpen={setOpen}
                    title={'Create New Question'}
                    contentText={'To create new question to this game, please provide a name for the question.'}
                    textLabel={'Name for the New Question'}
                    handleTextOnChange={(event) => setNewQ(event.target.value)}
                    hundleOnClick={updateQuestions}
                  />
                </Grid>
                <Grid item>
                  <Button variant="outlined" color="primary" onClick={() => history.push('/dashboard')}>
                  Back to Dashboard
                  </Button>
                </Grid>
              </Grid>
            </div>
          </Container>
        </div>
        <Container className={classes.cardGrid} maxWidth="md">
          {/* End hero unit */}
          <div className={classes.root}>
            {questions.map((question, idx) => {
              return (
                <QuestionCard
                  question={question}
                  index={idx}
                  key={idx}
                  deleteQuestion={deleteQuestion}
                />
              )
            })}
          </div>
        </Container>
      </main>
    </React.Fragment>
  );
}
