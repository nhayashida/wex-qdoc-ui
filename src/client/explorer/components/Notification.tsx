import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { Theme } from '@material-ui/core/styles';
import { makeStyles } from '@material-ui/styles';
import CloseIcon from '@material-ui/icons/Close';
import ErrorIcon from '@material-ui/icons/Error';
import React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
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

interface Props {
  errorMessage: string;
  hideErrorMessage: typeof hideErrorMessage;
}

const mapStateToProps = (state: State) => ({
  errorMessage: state.app.errorMessage,
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators({ hideErrorMessage }, dispatch);

// tslint:disable-next-line: variable-name
const Notification = (props: Props): JSX.Element => {
  const { errorMessage } = props;

  const classes = useStyles();

  const message = (
    <span className={classes.message}>
      <ErrorIcon />
      {errorMessage}
    </span>
  );
  const action = (
    <IconButton key="close" aria-label="Close" color="inherit" onClick={props.hideErrorMessage}>
      <CloseIcon />
    </IconButton>
  );

  return (
    <Snackbar open={!!errorMessage} autoHideDuration={1000 * 10} onClose={props.hideErrorMessage}>
      <SnackbarContent className={classes.content} message={message} action={[action]} />
    </Snackbar>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Notification);
