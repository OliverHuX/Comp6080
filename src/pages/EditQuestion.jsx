import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import { Select, InputLabel, MenuItem, FormControl, FormLabel, FormGroup, FormControlLabel, Checkbox } from '@material-ui/core';
import { useParams } from 'react-router';
import fetchFunc from '../components/fetchFunc.js';
import { useHistory } from 'react-router-dom';
import { StyledHeader } from '../components/StyledHeader';
import handleModifyQuestion from '../components/handleModifyQuestion';
const useStyles = makeStyles((theme) => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

// source https://stackoverflow.com/questions/46040973/how-to-upload-image-using-reactjs-and-save-into-local-storage
const getBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
}
export default function EditQuestion () {
  const classes = useStyles();
  const history = useHistory();
  const token = localStorage.getItem('token');
  const { gameId, questionId } = useParams();
  const [gameData, setGameData] = React.useState({});
  const [question, setQuestion] = React.useState('');
  const [questionType, setQuestionType] = React.useState('single');
  const [timeLimit, setTimeLimit] = React.useState('30s');
  const [point, setPoint] = React.useState('1');
  const [imageWindow, setImageWindow] = React.useState(false);
  const [videoWindow, setVideoWindow] = React.useState(false);
  const [answers, setAnswers] = React.useState([{ Answer1: false }, { Answer2: false }]);
  const [file, setFile] = React.useState();

  useEffect(() => {
    loadQuestion();
  }, []);
  const handleImageChange = (event) => {
    const link = event.target.files[0];
    getBase64(link).then(base64 => {
      setFile(base64);
    });
  }
  const handleUploadOption = (option) => {
    if (option === 'image') {
      setImageWindow(true);
      setVideoWindow(false);
    } else {
      setImageWindow(false);
      setVideoWindow(true);
    }
  }
  const addAnswer = () => {
    if (answers.length < 6) {
      const newAnswers = [...answers];
      newAnswers.push({ newAnswer: false });
      setAnswers(newAnswers);
    }
  }
  const handleCheckbox = (event) => {
    const newAnswers = [...answers];
    const index = parseInt(event.target.name);
    const key = Object.keys(answers[index])[0];
    newAnswers[index][key] = event.target.checked
    setAnswers(newAnswers);
  }
  const handleAnswer = (event, index) => {
    const newName = event.target.value;
    const oldName = event.target.name;
    const newAnswers = [...answers];
    newAnswers[index] = { [newName]: answers[index][oldName] };
    setAnswers(newAnswers);
  }
  const error = questionType === 'single'
    ? answers.filter(value => value[Object.keys(value)[0]]).length === 1
    : answers.filter(value => value[Object.keys(value)[0]]).length > 1;

  const loadQuestion = async () => {
    await fetchFunc('admin/quiz/' + gameId, 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        setGameData(res);
        if (res.questions.length) {
          setQuestion(res.questions[questionId].name);
          res.questions[questionId].questionType && setQuestionType(res.questions[questionId].questionType);
          res.questions[questionId].timeLimit && setTimeLimit(res.questions[questionId].timeLimit);
          res.questions[questionId].point && setPoint(res.questions[questionId].point);
          res.questions[questionId].file && setFile(res.questions[questionId].file);
          res.questions[questionId].fileType && res.questions[questionId].fileType === 'video' && setVideoWindow(true);
          res.questions[questionId].fileType && res.questions[questionId].fileType === 'image' && setImageWindow(true);
          res.questions[questionId].answers && setAnswers(res.questions[questionId].answers);
        }
      })
  };

  const handleSubmit = async () => {
    await handleModifyQuestion(gameData.questions, gameId, questionId, question, questionType, timeLimit, point, file, imageWindow, answers, token, gameData.thumbnail)
      .then(() => history.push('/details/' + gameId))
  };
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
            Edit Question
          </Typography>
          <React.Fragment>
            <React.Fragment>
              <Typography variant="h6" gutterBottom>
                  Question
              </Typography>
              <Grid container spacing={3}>
              <Grid item xs={12}>
              <TextField
                  // required
                  id="question"
                  name="question"
                  fullWidth
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
              />
              </Grid>
              <Grid item xs={12}>
                  <InputLabel id="label-question-type">Question Type</InputLabel>
                  <Select
                    labelId="label-question-type"
                    id="select"
                    value={questionType}
                    fullWidth
                    onChange={e => setQuestionType(e.target.value)}
                  >
                  <MenuItem value="multiple">Multiple Choice</MenuItem>
                  <MenuItem value="single">Single Choice</MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={12}>
                  <InputLabel id="label-time">Time Limit</InputLabel>
                  <Select
                    labelId="label-time"
                    id="select"
                    value={timeLimit}
                    fullWidth
                    onChange={event => setTimeLimit(event.target.value)}
                  >
                  <MenuItem value="30s">30 seconds</MenuItem>
                  <MenuItem value="1min">1 minute</MenuItem>
                  <MenuItem value="1min30s">1 minute 30 seconds</MenuItem>
                  <MenuItem value="2mins">2 minutes</MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={12}>
                  <InputLabel id="label-point">Points Worth</InputLabel>
                  <Select
                  labelId="label-point"
                  id="select"
                  value={point}
                  fullWidth
                  onChange={event => setPoint(event.target.value)}
                  >
                  <MenuItem value="1">Standard 1 Point</MenuItem>
                  <MenuItem value="2">Double 2 Points</MenuItem>
                  <MenuItem value="0">Zero 0 Point</MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={12}>
                  <InputLabel id="label-upload">Upload File</InputLabel>
                  <Select
                    labelId="label-upload"
                    id="select"
                    defaultValue=""
                    fullWidth
                    onChange={(event) => handleUploadOption(event.target.value)}
                  >
                  <MenuItem value="image">Upload Image</MenuItem>
                  <MenuItem value="video">Upload Youtube Video</MenuItem>
                  </Select>
              </Grid>
              <Grid item xs={12}>
                {videoWindow && (
                <form>
                  <iframe width="420" height="315" src={file}></iframe>
                  <TextField
                    required
                    label="Youtube Link URL"
                    fullWidth
                    onChange={(event) => setFile(event.target.value.replace('watch?v=', 'embed/'))}
                  />
                </form>
                )}
                {imageWindow && (
                <form>
                <img id="output" width="420" height="315" border="1px solid transparent" src={file}/>
                <InputLabel htmlFor="img">Select image:</InputLabel>
                <input
                  type="file"
                  accept="image/*"
                  className={classes.button}
                  onChange={(e) => handleImageChange(e)}
                />
                </form>
                )}
              </Grid>
              <Grid>
                <FormControl required error={!error} component="fieldset" className={classes.formControl}>
                  <FormLabel component="legend">Answers: Tick the box if it is the correct answer to the question</FormLabel>
                  <FormLabel component="legend">Note: This is a { questionType } question.</FormLabel>
                  <FormGroup>
                    {answers.map((value, index) => {
                      const key = Object.keys(value)[0];
                      const checked = value[key];
                      return (
                      <Grid key={index} item xs={12}>
                        <FormControlLabel
                          control={<Checkbox checked={checked} onChange={handleCheckbox} name={index.toString()}/>}
                        />
                        <TextField
                          required
                          defaultValue={key}
                          name={key}
                          fullWidth
                          onBlur={(event) => handleAnswer(event, index)}
                        />
                      </Grid>
                      );
                    })}
                    <Button className={classes.button} onClick={addAnswer}>Add</Button>
                  </FormGroup>
                  {/* <FormHelperText>Be careful</FormHelperText> */}
                </FormControl>
              </Grid>
              </Grid>
            </React.Fragment>
            <React.Fragment>
              <div className={classes.buttons}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  className={classes.button}
                >
                  Complete
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => history.push('/details/' + gameId)}
                  className={classes.button}
                >
                  Back
                </Button>
              </div>
            </React.Fragment>
          </React.Fragment>
        </Paper>
      </main>
    </React.Fragment>
  );
}
