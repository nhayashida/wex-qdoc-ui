import {
  createStyles,
  IconButton,
  Snackbar,
  SnackbarContent,
  Theme,
  WithStyles,
} from '@material-ui/core';
import { Close as CloseIcon, Error as ErrorIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import React from 'react';
import { connect } from 'react-redux';
import { hideErrorMessage } from '../reducers/app/actions';

const styles = (theme: Theme) =>
  createStyles({
    content: {
      backgroundColor: theme.palette.error.main,
    },
    message: {
      display: 'flex',
      alignItems: 'center',
      wordBreak: 'break-all',
      '& svg': {
        marginRight: theme.spacing.unit,
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  errorMessage: string;
  hideErrorMessage: typeof hideErrorMessage;
}

// tslint:disable-next-line: variable-name
const Notification = (props: Props): JSX.Element => {
  const { classes, errorMessage } = props;

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
  null,
  { hideErrorMessage },
)(withStyles(styles, { withTheme: true })(Notification));
