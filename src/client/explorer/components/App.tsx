import {
  AppBar,
  createMuiTheme,
  createStyles,
  CssBaseline,
  Dialog,
  IconButton,
  MuiThemeProvider,
  Slide,
  Theme,
  Toolbar,
  Typography,
  WithStyles,
} from '@material-ui/core';
import { Settings as SettingsIcon } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import { isArray } from 'lodash';
import qs from 'query-string';
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import Notification from './Notification';
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
  });

interface Props extends WithStyles<typeof styles> {
  location: { search: string };
  input: Explorer.QueryInput;
  errorMessage: string;
  initialize: () => void;
  query: (text: string, page: number, count: number) => void;
  hideErrorMessage: () => void;
}

const mapStateToProps = (state: Props) => ({
  errorMessage: state.errorMessage,
  input: state.input,
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators(actions, dispatch);

// tslint:disable-next-line:variable-name
const Transition = props => <Slide direction="up" {...props} />;

// tslint:disable-next-line: variable-name
const App = (props: Props): JSX.Element => {
  const { classes, location, input, errorMessage, initialize, query, hideErrorMessage } = props;

  const [settingsOpened, setSettingsOpened] = useState(false);

  useEffect(() => {
    initialize();

    // Execute query if ?q=<query> is set to url
    const { q } = qs.parse(location.search);
    if (q) {
      const { count } = input;
      query(isArray(q) ? q[0] : q, 0, count);
    }
  }, []);

  const onSettingsOpen = () => {
    setSettingsOpened(true);
  };

  const onSettingsClose = () => {
    setSettingsOpened(false);
  };

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar className={classes.appBar} position="absolute">
        <Toolbar className={classes.toolbar}>
          <Typography className={classes.toolbarTitle} />
          <IconButton onClick={onSettingsOpen}>
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
      <Dialog fullScreen={true} open={settingsOpened} TransitionComponent={Transition}>
        <Settings onClose={onSettingsClose} />
      </Dialog>
      <Notification errorMessage={errorMessage} />
    </MuiThemeProvider>
  );
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(withStyles(styles, { withTheme: true })(App));