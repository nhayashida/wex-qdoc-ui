import {
  AppBar,
  createMuiTheme,
  createStyles,
  CssBaseline,
  Dialog,
  IconButton,
  MuiThemeProvider,
  Slide,
  Snackbar,
  SnackbarContent,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
} from '@material-ui/core';
import {
  Close as CloseIcon,
  Error as ErrorIcon,
  Settings as SettingsIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { isArray } from 'lodash';
import qs from 'query-string';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Search from './Search';
import Settings from './Settings';
import actions from '../actions/actions';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
});

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    toolbar: {
      padding: theme.spacing.unit,
    },
    toolbarTitle: {
      flexGrow: 1,
    },
    contentHeader: theme.mixins.toolbar,
    notificationContent: {
      backgroundColor: theme.palette.error.main,
    },
    notificationMessage: {
      display: 'flex',
      alignItems: 'center',
      wordBreak: 'break-all',
      '& svg': {
        marginRight: theme.spacing.unit,
      },
    },
  });

interface Props extends WithStyles<typeof styles> {
  location: { search: string };
  appTitle: string;
  input: Explorer.QueryInput;
  errorMessage: string;
  initialize: () => void;
  query: (text: string, page: number, count: number) => void;
  hideErrorMessage: () => void;
}

type State = {
  settingsOpen: boolean;
};

const mapStateToProps = (state: Props) => ({
  errorMessage: state.errorMessage,
  appTitle: state.appTitle,
  input: state.input,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line:variable-name
const Transition = props => <Slide direction="up" {...props} />;

class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      settingsOpen: false,
    };
  }

  componentDidMount() {
    this.props.initialize();

    // Execute query if ?q=<query> is set to url
    const { q } = qs.parse(this.props.location.search);
    if (q) {
      const { count } = this.props.input;
      this.props.query(isArray(q) ? q[0] : q, 0, count);
    }
  }

  onSettingsOpen = () => {
    this.setState({ settingsOpen: true });
  };

  onSettingsClose = () => {
    this.setState({ settingsOpen: false });
  };

  generateNotification() {
    const { classes, errorMessage, hideErrorMessage } = this.props;

    const message = (
      <span className={classes.notificationMessage}>
        <ErrorIcon />
        {errorMessage}
      </span>
    );
    const action = (
      <IconButton key="close" aria-label="Close" color="inherit" onClick={hideErrorMessage}>
        <CloseIcon />
      </IconButton>
    );

    return (
      <Snackbar open={!!errorMessage} autoHideDuration={1000 * 10} onClose={hideErrorMessage}>
        <SnackbarContent
          className={classes.notificationContent}
          message={message}
          action={[action]}
        />
      </Snackbar>
    );
  }

  render(): JSX.Element {
    const { classes } = this.props;
    const { settingsOpen } = this.state;

    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar className={classes.appBar} position="absolute">
          <Toolbar className={classes.toolbar}>
            <Typography className={classes.toolbarTitle} />
            <IconButton onClick={this.onSettingsOpen}>
              <SettingsIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main>
          <div className={classes.contentHeader} />
          <div>
            <Search />
          </div>
        </main>
        <Dialog fullScreen={true} open={settingsOpen} TransitionComponent={Transition}>
          <Settings onClose={this.onSettingsClose} />
        </Dialog>
        {this.generateNotification()}
      </MuiThemeProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(App));
