import React from 'react';
import { useHistory } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { myStyles } from './Register.style';
import FetchFunc from '../components/fetchFunc';
import { StyledHeader } from '../components/StyledHeader';
import { TextPopup } from '../components/TextPopup';

function signup (email, password, firstname, lastname, history, setErrorMsg, setError) {
  const payload = JSON.stringify({
    email: email,
    password: password,
    name: firstname + ' ' + lastname
  })
  const result = FetchFunc('admin/auth/register', 'POST', null, payload);
  result.then((data) => {
    if (data.status === 200) {
      data.json().then(result => {
        console.log(result.token);
        const storage = new Event('storage');
        localStorage.setItem('token', result.token);
        localStorage.setItem('user', email);
        window.dispatchEvent(storage);
        history.push('/dashboard')
      })
    } else {
      data.json().then(result => {
        console.log(result.error)
        setErrorMsg(result.error);
        setError(true)
      })
    }
  })
}

export default function Register () {
  const [firstName, setFirstNameInputs] = React.useState('');
  const [lastName, setLastNameInputs] = React.useState('');
  const [emailInputs, setEmailInputs] = React.useState('');
  const [passWord, setPasswordInputs] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [error, setError] = React.useState(false);
  const history = useHistory();
  const classes = myStyles();
  // console.log(emailInputs)
  // const firstname = document.getElementById('firstName');
  // const lastname = document.getElementById('lastName');
  // const email = document.getElementById('email');
  // const password = document.getElementById('password');

  return (
    <React.Fragment>
      <CssBaseline />
      <StyledHeader/>
      <main>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="fname"
                    name="firstName"
                    variant="outlined"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                    onChange={(e) => setFirstNameInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lname"
                    onChange={(e) => setLastNameInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    onChange={(e) => setEmailInputs(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    onChange={(e) => setPasswordInputs(e.target.value)}
                  />
                </Grid>
                {/* <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid> */}
              </Grid>
              <Button
                // type="submit"
                name='signup'
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={() => console.log(signup(emailInputs, passWord, firstName, lastName, history, setErrorMsg, setError))}
              >
                Sign Up
              </Button>
              <TextPopup
                open={error}
                setOpen={setError}
                title={errorMsg}
                handleOnClick={() => setError(false)}
              />
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
