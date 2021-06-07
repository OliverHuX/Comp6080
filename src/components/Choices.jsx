import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import FetchFunc from '../components/fetchFunc';
import Button from '@material-ui/core/Button';
import { TextPopup } from './TextPopup';
import Container from '@material-ui/core/Container';
import { useStyles } from '../pages/Dashboard.styles';

function answerQuiz (playerId, answerIds, setMessage) {
  const payload = JSON.stringify({
    answerIds: answerIds
  });
  const result = FetchFunc('play/' + playerId + '/answer', 'PUT', null, payload);
  result.then((data) => {
    if (data.status === 200) {
      data.json().then(result => {
        console.log('success')
        setMessage('success')
      })
    } else {
      data.json().then(result => {
        console.log(result.error)
        setMessage(result.error)
      })
    }
  })
}

export default function Choices ({ playerId }) {
  const [answer, setAns] = React.useState([]);
  const [clicked, setClicked] = React.useState([]);
  const [disabled, setDisabled] = React.useState([]);
  const [answerIds, setIds] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const [type, setType] = React.useState('');
  const [message, setMessage] = React.useState('')

  React.useEffect(() => {
    result()
  }, [])

  function result () {
    const result = FetchFunc('play/' + playerId + '/question', 'GET', null, null)
    result.then((data) => {
      if (data.status === 200) {
        data.json().then(res => {
          setAns(res.question.answers)
          setType(res.question.questionType)
        })
      } else {
        data.json().then(result => {
          console.log(result.error)
        })
      }
    })
  }
  // this function allocate the number of clicked that is the same number of choices
  // the clicked is used for checking if the whether the choice clicked or not
  React.useEffect(() => {
    for (let i = 0; i < answer.length; i++) {
      setClicked(clicked => ({ ...clicked, [Object.keys(answer[i])]: false }))
      setDisabled(disabled => ({ ...disabled, [i]: false }))
    }
  }, [])

  const handleChange = (e) => {
    setClicked({ ...clicked, [e.target.name]: e.target.checked })
    if (e.target.checked && !answerIds.some(item => item === Number(e.target.value))) {
      setIds(answerIds => [...answerIds, Number(e.target.value)]);
    } else if (!e.target.checked && answerIds.some(item => item === Number(e.target.value))) {
      setIds(answerIds.filter(item => item !== Number(e.target.value)));
    }
    if (type === 'single') {
      if (e.target.checked) {
        for (let i = 0; i < answer.length; i++) {
          if (Number(e.target.value) !== i) {
            console.log(i + e.target.value)
            setDisabled(disabled => ({ ...disabled, [i]: true }))
          }
        }
      } else {
        for (let j = 0; j < answer.length; j++) {
          setDisabled(disabled => ({ ...disabled, [j]: false }))
        }
      }
    }
  }

  return (
    <Container maxWidth="sm">
      <div align="center" id='check'>
        {answer.map((val, index) => {
          return (
            <FormControlLabel
              key={index}
              label={Object.keys(val)}
              control={
                <Checkbox
                  checked = {clicked[Object.keys(val)[0]]}
                  disabled = {disabled[index]}
                  value = {index}
                  name = {Object.keys(val)}
                  onChange={handleChange}
                  color="primary"
                />
              }
              align="center"
            />
          )
        })}
      </div>
      <br></br>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        className={classes.submit}
        onClick={() => [answerQuiz(playerId, answerIds, setMessage), setOpen(true)]}
      >
        Submit
      </Button>
      <TextPopup
        open={open}
        setOpen={setOpen}
        title={message}
        handleOnClick={() => setOpen(false)}
      />
    </Container>
  )
}

Choices.propTypes = {
  playerId: PropTypes.number,
};
