import { makeStyles } from '@material-ui/core/styles';

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
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
  },
  cardContent: {
    flexGrow: 1,
  },
  inputFile: {
    display: 'none'
  },
  linkButton: {
    border: '1px solid #6573c3',
    display: 'inline-block',
    padding: '8px 16px',
    borderRadius: 3,
    color: '#2c387e'
  },
  footer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(6),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  img: {
    width: '50%',
    height: '50%'
  },
  gif: {
    width: '80%',
    height: '80%'
  },
  gifContainer: {
    display: 'flex',
    justifyContent: 'center',
    margin: 'auto'
  }
}));
export { useStyles };
