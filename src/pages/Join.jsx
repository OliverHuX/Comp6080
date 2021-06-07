import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import VideogameAssetIcon from '@material-ui/icons/VideogameAsset';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { myStyles } from './Login.style';
import FetchFunc from '../components/fetchFunc';
import { StyledHeader } from '../components/StyledHeader';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';

function joinin (sessionId, name, history) {
  const payload = JSON.stringify({
    name: name
  });
  const result = FetchFunc('play/join/' + sessionId, 'POST', null, payload);
  result.then((data) => {
    if (data.status === 200) {
      data.json().then(result => {
        console.log(result.playerId);
        // const storage = new Event('storage');
        // localStorage.setItem('token', result.token);
        // localStorage.setItem('playerId', result.playerId);
        const old = JSON.parse(localStorage.getItem('players')) || [];
        const player = {
          name: name,
          id: result.playerId
        };
        old.push(player);
        localStorage.setItem('players', JSON.stringify(old));
        // window.dispatchEvent(storage);
        history.push('/playgame/' + result.playerId)
      })
    } else {
      data.json().then(result => {
        console.log(result.error)
      })
    }
  })
  console.log(localStorage.getItem('players'))
}

export default function Joinin () {
  const classes = myStyles();
  const [sessionId, setSessionId] = React.useState('');
  const [name, setName] = React.useState('');
  const history = useHistory();
  return (
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/>
      <main>
        <Container component="main" maxWidth="xs">
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <VideogameAssetIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Join The Session
            </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Session ID"
                label="Session ID"
                name="Session ID"
                // autoComplete="email"
                autoFocus
                onChange={(e) => setSessionId(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="Name"
                label="Name"
                type="Name"
                id="Name"
                // autoComplete="current-password"
                onChange={(e) => setName(e.target.value)}
              />
              <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => console.log(joinin(sessionId, name, history))}
              >
                Join In
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/" variant="body2">
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
            </form>
          </div>
        </Container>
      </main>
    </React.Fragment>
  );
}
