import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  image: {
    width: 128,
    height: 128,
  },
  img: {
    margin: 'auto',
    display: 'block',
    maxWidth: '90%',
    maxHeight: '100%',
  },
}));

export default function QuestionCard ({ question, index, deleteQuestion }) {
  const classes = useStyles();
  const history = useHistory();
  const { id } = useParams();
  if (question) {
    return (
      <Paper className={classes.paper}>
        <Grid container>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={question.fileType === 'image' ? question.file : 'https://source.unsplash.com/random'} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                { question.name }
                </Typography>
                <Typography variant="body2" gutterBottom>
                  {question.questionType ? question.questionType + ' choice' : null}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {question.timeLimit}
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={ () => history.push('/details/' + id + '/' + index) }>
                  Edit
                </Typography>
                <Typography variant="body2" style={{ cursor: 'pointer' }} onClick={() => deleteQuestion(index)}>
                  Remove
                </Typography>
              </Grid>
            </Grid>
            <Grid item>
              <Typography variant="subtitle1">{ index + 1 }</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    );
  }
}

QuestionCard.propTypes = {
  question: PropTypes.object,
  index: PropTypes.number,
  deleteQuestion: PropTypes.func
};
