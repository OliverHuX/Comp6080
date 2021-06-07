import React, { useEffect } from 'react';
import clsx from 'clsx';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Chart from '../components/Chart';
import ResultTable from '../components/ResultTable';
import { StyledHeader } from '../components/StyledHeader';
import { useStyles } from './AdminGameResult.styles';
import { useParams } from 'react-router';
import fetchFunc from '../components/fetchFunc.js';

export default function AdminGameResult () {
  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);
  const token = localStorage.getItem('token');
  const { sessionId } = useParams();
  const [correctCount, setCorrectCount] = React.useState([]);
  const [userCorrectCount, setUserCorrectCount] = React.useState([]);
  const [responseTime, setResponseTime] = React.useState([]);
  const [username, setUsername] = React.useState([]);

  const getRankInfo = () => {
    const info = new Array(username.length).fill('');
    for (let i = 0; i < username.length; i++) {
      info[i] = { name: username[i], score: userCorrectCount[i] };
    }
    info.sort((a, b) => a.score > b.score);
    for (let i = 0; i < username.length; i++) {
      info[i] = { ...info[i], rank: i + 1 };
    }
    return info.slice(0, 5); // get the top five rank
  }
  const loadResult = async () => {
    await fetchFunc('admin/session/' + sessionId + '/results', 'GET', token, null)
      .then(res => (res.ok ? res : Promise.reject(res)))
      .then(res => res.json())
      .then(res => {
        const len = res.results.length ? res.results[0].answers.length : 0;
        const newCorrectCount = new Array(len).fill(0);
        const newUsername = new Array(res.results.length).fill('');
        const newUserCorrectCount = new Array(res.results.length).fill(0);
        const rTime = new Array(len).fill(0);
        res.results.forEach((result, i) => {
          newUsername[i] = result.name;
          result.answers.forEach((answer, index) => {
            if (answer.correct) {
              newCorrectCount[index] += 1;
              newUserCorrectCount[i] += 1;
            }
            rTime[index] += (new Date(answer.answeredAt) - new Date(answer.questionStartedAt));
          })
        })
        setCorrectCount(newCorrectCount);
        setResponseTime(rTime.map((val) => val / 1000 / res.results.length));
        setUsername(newUsername);
        setUserCorrectCount(newUserCorrectCount);
      })
  }
  useEffect(() => {
    loadResult();
  }, []);
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/>
      <div className={classes.root}>
        <main className={classes.content}>
          <div className={classes.appBarSpacer} />
          <Container maxWidth="lg" className={classes.container}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={6} lg={12}>
                <Paper className={fixedHeightPaper}>
                  <Chart title={'Breakdown of people got certain questions correct'} data={correctCount} />
                </Paper>
              </Grid>
              <Grid item xs={12} md={6} lg={9}>
                <Paper className={fixedHeightPaper}>
                  <Chart title={'Response Time in seconds'} data={responseTime} />
                </Paper>
              </Grid>
              <Grid item xs={12}>
                <Paper className={classes.paper}>
                  <ResultTable title={'Top 5 users and score'} data={getRankInfo()} />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </main>
      </div>
    </React.Fragment>
  );
}
