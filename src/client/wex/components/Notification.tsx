import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { hideErrorMessage } from '../reducers/app/actions';
import { State } from '../reducers/store';

const useStyles = makeStyles((theme: Theme) => ({
  content: {
    backgroundColor: theme.palette.error.main,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
    wordBreak: 'break-all',
    '& svg': {
      marginRight: theme.spacing(1),
    },
  },
}));

// tslint:disable-next-line: variable-name
const Notification = (): JSX.Element => {
  const dispatch = useDispatch();
  const errorMessage = useSelector((state: State) => state.app.errorMessage);

  const classes = useStyles();

  const onClose = () => {
    dispatch(hideErrorMessage());
  };

  const message = (
    <span className={classes.message}>
      <ErrorIcon />
      {errorMessage}
    </span>
  );
  const action = (
    <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <Snackbar open={!!errorMessage} autoHideDuration={1000 * 10} onClose={onClose}>
      <SnackbarContent className={classes.content} message={message} action={[action]} />
    </Snackbar>
  );
};

export default Notification;
