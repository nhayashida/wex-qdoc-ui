import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import Slide from '@material-ui/core/Slide';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { TransitionProps } from '@material-ui/core/transitions';
import { Theme, makeStyles, useTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import isArray from 'lodash/isArray';
import qs from 'query-string';
import React, { forwardRef, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { initialize } from '../reducers/actions';
import Notification from './Notification';
import Search from './Search';
import Settings from './Settings';

const useStyles = makeStyles((theme: Theme) => ({
  appBar: {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    '& > div': {
      padding: theme.spacing(1),
      '& > p': {
        flexGrow: 1,
      },
    },
  },
  contentHeader: theme.mixins.toolbar,
}));

interface Props {
  location: { search: string };
  initialize: typeof initialize;
}

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({ initialize }, dispatch);

// tslint:disable-next-line:variable-name
const Transition = forwardRef<unknown, TransitionProps>((props, ref) => (
  <Slide direction="right" ref={ref} {...props} />
));

// tslint:disable-next-line: variable-name
const App = (props: Props): JSX.Element => {
  const { location } = props;

  const theme = useTheme();
  const classes = useStyles();

  const [settingsOpened, setSettingsOpened] = useState(false);

  useEffect(() => {
    const { q } = qs.parse(location.search);
    props.initialize((isArray(q) ? q[0] : q) || undefined);
  }, []);

  const onSettingsOpen = () => {
    setSettingsOpened(true);
  };

  const onSettingsClose = () => {
    setSettingsOpened(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar className={classes.appBar} position="absolute">
        <Toolbar>
          <Typography />
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
      <Notification />
    </ThemeProvider>
  );
};

export default connect(
  null,
  mapDispatchToProps,
)(App);
